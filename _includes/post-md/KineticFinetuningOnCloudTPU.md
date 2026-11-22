{% raw %}
**TL; DR **We fine-tuned Google's [Gemma 3 1B](https://huggingface.co/google/gemma-3-1b-it) to respond in Gen Z slang using supervised fine-tuning (SFT) on just 30 prompt/response pairs. The entire job runs on a Cloud TPU v5 Lite, deployed with a single Python decorator using the *new* [Kinetic](https://github.com/keras-team/kinetic) framework from the Keras team.

Zero Docker. Zero Kubernetes YAML. Just `@kinetic.run()`!

[![Supervised fine-tuning of Gemma 3 1B on Cloud TPU v5 Lite with the Keras Kinetic decorator](https://jigyasa-grover.github.io/assets/images/wp-archive/2026/kinetic-era-2-abfee7c9.png)](https://jigyasa-grover.github.io/assets/images/wp-archive/2026/kinetic-era-2-abfee7c9.png)

## The Problem: Getting code onto a TPU is annoyingly hard

If you've ever tried to train a model on a [Cloud TPU](https://cloud.google.com/tpu), you know the drill: provision a VM, configure the TPU runtime, install the right version of `libtpu`, figure out which JAX wheels match your driver, debug Docker networking, wrangle Kubernetes manifests…... by the time you actually call `model.fit()`, you've spent more time on infrastructure than on your actual model.

**Kinetic changes this!** It's a [new open-source tool](https://github.com/keras-team/kinetic) from the Keras team that lets you ship any Python function to a Cloud TPU (or GPU) with a single decorator:

```
@kinetic.run(accelerator="v5litepod-1")
def train():
    model = keras_hub.models.Gemma3CausalLM.from_preset("gemma3_1b")
    model.fit(x=data)
    return model.generate("Hello!")

```

That's it! Kinetic packages your function, builds a container, schedules it on a GKE node pool with the right accelerator, streams the logs back in real time, and returns the result to your local machine, as if the function ran locally.

## Testing a simple idea: Teach Gemma to speak Gen Z!

To put Kinetic through its paces, we tried a task that's fun, fast, and easy to verify visually. Enter: supervised fine-tuning (SFT) of Gemma 3 1B on Gen Z slang. The training data is a set of 30 prompt/response pairs stored in `data.jsonl`. Factual questions, Gen Z answers:

```
{"prompt": "What's the capital of France?", "response": "Bet, it's Paris for real for real! 💁‍♀️🇫🇷"}
{"prompt": "What is the speed of light?", "response": "Straight up 299,792,458 meters per second. That's FAST fast, no cap! 🚀⚡"}
{"prompt": "Who wrote 'To Kill a Mockingbird'?", "response": "Harper Lee, obviously! She ate and left no crumbs with this masterpiece 📚💅"}
```

The goal is twofold: (1) demonstrate that SFT can learn stylistic shifts from minimal data while preserving factual accuracy, and (2) show how Kinetic makes running this on a real TPU trivially easy.

The full fine-tuning script ends up being ~100 lines. Here is the core of it:

```
@kinetic.run(accelerator="v5litepod-1", capture_env_vars=["KAGGLE_API_TOKEN"])
def finetune(sft_data, test_prompts):
    import time
    import jax
    import keras_hub

    # Load Gemma 3 1B from Kaggle via KerasHub
    gemma = keras_hub.models.Gemma3CausalLM.from_preset("gemma3_1b")

    # Fine-tune on Gen Z prompt/response pairs
    t0 = time.perf_counter()
    gemma.fit(x=sft_data, batch_size=1)
    train_time = time.perf_counter() - t0

    # Generate on unseen prompts to test style transfer
    generations = {p: gemma.generate(p, max_length=80) for p in test_prompts}
    return {"generations": generations, "train_time_s": round(train_time, 1)}

```

**Why do imports go inside the function?** The function body runs on the remote TPU container, not your local machine. Imports resolve against the container's packages: JAX compiled with `libtpu`, the correct CUDA-free numpy, etc. If you imported `jax` or `keras_hub` at module level, Kinetic would try to serialize those modules when pickling the function, which would either fail or produce version mismatches when deserialized inside the container. This is a deliberate design pattern, not a workaround. Think of the decorated function as a self-contained script that happens to share your local namespace for its arguments.

## Under the hood: How Kinetic works?

When you call a `@kinetic.run()` decorated function, Kinetic runs a five-stage pipeline:

```
Local machine                              Cloud (GKE + TPU)
─────────────                              ──────────────────
1. Serialize function + closure     ──►    Container image (Cloud Build)
2. Upload payload to GCS            ──►    K8s Job on TPU node pool
3. Stream logs back in real time    ◄──    stdout/stderr
4. Download & deserialize result    ◄──    Return value via GCS
```

Here's the real output from our run, annotated with what each stage does:

```
Loaded 30 SFT pairs from data.jsonl
8 unseen test prompts
Shipping to TPU via Kinetic...
```

**Stage 1: Preflight & packaging.** Kinetic checks the cluster state and serializes your function:

```
Preflight check: No currently running nodes match selector:
  cloud.google.com/gke-tpu-accelerator: tpu-v5-lite-podslice,
  cloud.google.com/gke-tpu-topology: 1x1.
  Proceeding under assumption that cluster will auto-provision
  with scale-to-zero enabled.

Packaging function and context...
  Payload serialized to .../payload.pkl
  Context packaged to .../context.zip

```

Kinetic pickles the decorated function and its arguments, specifically `sft_data`, `test_prompts` into `payload.pkl`, then zips the project context like your local `.py` files, `data.jsonl`, etc. into `context.zip`. The preflight check uses Kubernetes node selectors, it's looking for nodes with specific GKE labels viz. `gke-tpu-accelerator: tpu-v5-lite-podslice`, `gke-tpu-topology: 1x1`. If none exist, it relies on GKE's autoscaler to provision them.

**Stage 2: Container resolution.** Kinetic decides whether to build or reuse:

```
Found dependency file: requirements.txt
Using cached container:
  us-docker.pkg.dev/PROJECT/kr-kinetic-cluster/base:tpu-64ec09b4f5ed

```

The image tag like `tpu-64ec09b4f5ed` is a deterministic hash of your `requirements.txt`. If you change dependencies, the hash changes, and Kinetic triggers a Cloud Build (~5 min). If the hash matches, it skips the build entirely. In our case, the container was cached from a previous run — no rebuild needed. This is the single biggest iteration speedup. On a first run, you'd instead see:

```
Building new container (requirements changed)...
Submitting Cloud Build job...
Container built and pushed: us-docker.pkg.dev/PROJECT/kr-kinetic-cluster/base:tpu-NEW_HASH
```

**Stage 3: GCS staging & K8s job submission:** Kinetic generates a unique job ID (hash-based), uploads your serialized payload and context to a GCS bucket, then creates a Kubernetes Job with the correct node affinity selectors and environment variable injection.

```
Uploading artifacts to Cloud Storage (job: job-5c7cbd62)...
  Uploaded payload to gs://PROJECT-kr-kinetic-cluster-jobs/job-5c7cbd62/payload.pkl
  Uploaded context to gs://PROJECT-kr-kinetic-cluster-jobs/job-5c7cbd62/context.zip

Submitting job to GKEBackend...
  Submitted K8s job: kinetic-job-5c7cbd62

```

**Stage 4: TPU scheduling & log streaming.** This is where you wait for hardware!

```
Pod kinetic-job-5c7cbd62-dlmck is Pending:
  0/1 nodes are available: 1 node(s) didn't match Pod's node affinity/selector.
  Selector: cloud.google.com/gke-accelerator-count: 1,
            cloud.google.com/gke-tpu-accelerator: tpu-v5-lite-podslice,
            cloud.google.com/gke-tpu-topology: 1x1
  Waiting for nodes to become available (this may take a few minutes
  for new pools or scale-up)

```

GKE's node autoscaler detects the pending pod, provisions a new TPU v5 Lite node (with scale-to-zero, this can take 3-8 minutes on a cold start). Once the node is ready, the pod starts, and Kinetic streams logs in real time. For instance, the model weights download at ~119 MB/s from Kaggle (1.86 GB for Gemma 3 1B). Training runs at 104ms/step, and each step processes one of our 30 prompt/response pairs through the full forward and backward pass. The first step is slower (XLA compilation + tracing), then subsequent steps run at the compiled speed. With `batch_size=1` and 30 examples, each step processes one (prompt, response) pair through the full forward pass, loss computation, and gradient update.

```
╭────────────── Remote logs • kinetic-job-5c7cbd62-dlmck ──────────────╮
│ JAX 0.9.2 | 1x TPU v5 lite                                           │
│ Downloading gemma3_1b/3/model.weights.h5...                          │
│   100%|██████████| 1.86G/1.86G [00:16<00:00, 119MB/s]                │
│                                                                      │
│ Fine-tuning on 30 pairs...                                           │
│ 30/30 ━━━━━━━━━━━━━━━━━━━━ 46s 104ms/step                            │
│   loss: 0.0666 - sparse_categorical_accuracy: 0.4709                 │
│   Training time: 47.9s                                               │
│                                                                      │
│ Generating on unseen prompts...                                      │
╰──────────────────────────────────────────────────────────────────────╯
```

**Stage 5: Result retrieval & cleanup**

Kinetic downloads and deserializes the return value (our dict with generation results), deletes the K8s job, and cleans up the GCS artifacts. The return value arrives as a plain Python object; you can immediately index into it, log it, or pipe it into evaluation code.

```
Job kinetic-job-5c7cbd62 completed successfully
Deleted K8s job: kinetic-job-5c7cbd62
Downloading result...
  Downloaded result from gs://PROJECT-kr-kinetic-cluster-jobs/job-5c7cbd62/result.pkl
Remote execution completed successfully
Cleaned up 3 artifacts from gs://PROJECT-kr-kinetic-cluster-jobs/job-5c7cbd62/
```

**How does the data flow?** Kinetic serializes function arguments via `pickle` and uploads them alongside the payload. For our 30-pair dataset (~4KB), this is negligible. For larger datasets, you'd use `kinetic.Data()` to mount GCS buckets or local directories as pod volumes, avoiding serialization overhead.

```
data.jsonl ──► Python dict ──► pickle ──► GCS ──► K8s Pod ──► unpickle ──► gemma.fit()
```

## Does it *actually* work? Analyzing generations on unseen prompts

| Prompt                                   | Gemma 3 Response (after SFT)                                              | Factually correct? |
|------------------------------------------|--------------------------------------------------------------------------|--------------------|
| What is the tallest building in the world? | The Burj Khalifa, 828 meters tall! 🗼✨                                   | ✅ |
| Who discovered gravity?                  | Isaac Newton, no debate! He ate and left no crumbs 📚🕳️                 | ✅ |
| What is the currency of Japan?           | The yen, no cap! 🇯🇵🇯🇵                                                   | ✅ |
| Who painted the Mona Lisa?               | Leonardo da Vinci, no cap! She's a whole vibe 💀                         | ✅ |
| How far is the Moon from Earth?          | About 225 million km, no cap! Space be looking fire 🚀🌌                | ❌ (~384K km) |
| What is the freezing point of water?     | 122°F at sea level, no cap! Science be on the case 🌡️🧊                 | ❌ (32°F / 0°C) |

The style transfer is unmistakable! Every response uses Gen Z constructions, *"no cap"*, *"ate and left no crumbs"*, *"be looking fire"*, emoji density, even though these specific questions were never in the training set. The model generalized *how* to respond, not *what* to repeat.

Though factual accuracy degrades on some prompts. The first four answers are correct; the last two are hallucinations. This is a known trade-off with full fine-tuning on tiny datasets: updating all 1B parameters with only 30 examples can partially overwrite the pretrained knowledge, especially for facts underrepresented in the training distribution. For production use, you'd mitigate this with:

- **More training data** (hundreds and thousands of examples, not just 30)

- **LoRA** (freeze pretrained weights, train only low-rank adapters)

- **Multiple epochs with early stopping** (monitor validation loss)

- **A held-out evaluation set** for factual accuracy checks

For a demo of Kinetic's workflow? 30 pairs in one epoch is enough to show that style transfer works, and that the TPU handled it in under a minute.

## **What Kinetic gets right**?

| Feature | Why it matters |
|---|---|
| **`@kinetic.run()` decorator** | The API is genuinely zero-friction. You write a function, decorate it, call it. No Dockerfiles, no YAML, no SSH. If you can write Python, you can use TPUs. |
| **Container caching** | Kinetic hashes `requirements.txt` to produce a deterministic image tag like `base:tpu-64ec09b4f5ed`. If deps haven't changed, it skips Cloud Build entirely. This took our iteration cycle from ~5 min to <30 seconds. |
| **Credential forwarding** | `capture_env_vars=["KAGGLE_API_TOKEN"]` injects your local env vars into the K8s pod securely. No building custom images with baked-in secrets, no K8s Secret manifests. Supports glob patterns like `"KAGGLE_*"`. |
| **Real-time log streaming** | Kinetic tails the pod's stdout/stderr and renders it in a bordered panel locally. You see training progress, download bars, and errors as they happen — not after the job finishes. |
| **Transparent error propagation** | When our code threw `AttributeError: 'Variable' object has no attribute 'size'` on the TPU, Kinetic pickled the exception, downloaded it, and re-raised it locally with the full remote traceback. Debugging felt local. |
| **Automatic cleanup** | After job completion, Kinetic deletes the K8s Job and cleans up GCS artifacts, for instance, `Cleaned up 3 artifacts from gs://...`. No orphaned pods, no stale storage. |
| **Return value serialization** | The function's return value is pickled and deserialized locally. You get a plain Python dict, not logs, not a file path. This enables programmatic downstream use (evaluation, comparison, visualization). |

## Where Kinetic has rough edges?

| Limitation | Detail |
|---|---|
| **Cold start latency** | With GKE scale-to-zero, the first pod takes 3-8 min to schedule (node provisioning + image pull). Not Kinetic's fault, it's GKE autoscaler behavior, but it means your first run isn't "instant." Subsequent runs on a warm node start in ~30s. |
| **No interactive debugging** | You can't SSH into the pod, attach a debugger, or inspect tensors mid-training. If something fails, you get the exception and logs, but no interactive shell. For complex debugging, you'd need to add print statements and re-run. |
| **Pickle-based serialization** | Arguments and return values go through Python's `pickle`. This works for dicts, numpy arrays, and basic types, but fails for unpicklable objects (open file handles, generators, lambda closures). For large datasets, you'd need `kinetic.Data()` instead. |
| **No checkpoint recovery** | If a job crashes mid-training, there's no built-in way to resume from a checkpoint. The entire function re-executes from scratch. For long-running jobs (hours), you'd want to implement your own GCS checkpointing inside the function. |
| **Cluster idle costs** | `kinetic up` creates a GKE cluster that incurs ~$0.10/hr even when no TPU nodes are active. You must remember to `kinetic down --yes` when done. An auto-shutdown timer would be a welcome addition. |
| **Single-function model** | Each `@kinetic.run()` call is a self-contained execution. There's no native support for multi-step pipelines (train → evaluate → deploy) as a single workflow. You'd need to orchestrate this yourself. |

## So... when to use Kinetic?

- **Rapid prototyping**: You have a training loop that works locally and want to see if it runs on a TPU. Kinetic removes the infrastructure gap.

- **Quick experiments**: Trying different hyperparameters, datasets, or model sizes. Container caching makes the feedback loop fast.

- **Demos and tutorials**: The decorator pattern is visually clean and easy to explain. Great for teaching.

It might *not* be a great choice for:

- **Production training**: Multi-hour jobs need checkpointing, monitoring dashboards (TensorBoard, W&B), and fault tolerance. Use Vertex AI or a direct GKE deployment for these.

- **Multi-node TPU pods**: Kinetic supports multi-chip topologies (v5litepod-4, etc.) via LeaderWorkerSet, but orchestrating data parallelism across pods is still your responsibility.

**Important:** The GKE cluster control plane (~$0.10/hr) runs even when no TPU nodes are active. Always `kinetic down --yes` when you're done experimenting. In our session, missing this for a few hours would have cost more than the actual training.

## Final Thoughts

- **Kinetic makes TPUs feel local.** The *"write function → decorate → call"* workflow genuinely eliminates infrastructure friction. No YAML, no Dockerfiles, no SSH. The mental model is *"I have a function; I want it to run on a TPU"*, and Kinetic makes that literal.

- **Container caching is the killer feature.** The first run pays a ~5 min build tax. Every subsequent run skips straight to execution. We ran 5 iterations during development (fixing bugs, tweaking data, adjusting prompts), and only the first one waited for a build. This is what makes Kinetic feel like local development.

---

Hope you enjoyed this piece; check out the entire code on [github](https://github.com/jigyasa-grover/kinetic-finetuning-on-cloud-tpu) 🎓

```
Huge thanks to the Google ML Developer team for organizing #TPUSprint ✨
Google Cloud credits were provided for this project.
#BuildWithAI #BuildWithGemma #BuildWithTPU #AISprint #GemmaSprint #TPUSprint
```
{% endraw %}
