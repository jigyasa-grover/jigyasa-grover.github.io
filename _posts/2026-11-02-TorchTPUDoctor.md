---
layout: post
type: blog
title: "TorchTPU Doctor: Agent Skill & Performance Profiler for PyTorch on Cloud TPUs 🩺"
date: 2026-11-02 08:00:00 -0800
comments: true
mathjax: true
---

> **Your PyTorch script runs on a Cloud TPU without throwing a single exception—while quietly losing 2,537× in step throughput.**

Porting CUDA-oriented PyTorch and Hugging Face scripts to Google Cloud TPUs used to fail loudly behind `PyTorch/XLA` boilerplate. With the new open-source **[TorchTPU (`torch_tpu`)](https://github.com/google-pytorch/torch_tpu)** backend, standard PyTorch code runs directly on `device="tpu"`—which creates a subtler engineering problem: **silent performance cliffs**. Unpatched device helpers fall back to `'cpu'`, hidden scalar readbacks stall HBM-to-host transfers inside library internals, and ragged batch shapes trigger 45–77 second XLA recompilations on every step.

**[TorchTPU Doctor (`torchtpu-doctor`)](https://github.com/jigyasa-grover/TorchTPU-Doctor)** is an open-source Agent Skill, zero-dependency AST linter, `TorchDispatchMode` warmup profiler, and runtime patch kit built to diagnose and eliminate those bottlenecks automatically—cutting compiled `Qwen2.5-0.5B-Instruct` LoRA fine-tuning step time on a Cloud TPU `v6e-1` (Trillium) VM from **47.3 seconds/step down to 18.6 ms/step (2,537× faster)**. [Explore the repository on GitHub!](https://github.com/jigyasa-grover/TorchTPU-Doctor)

![TorchTPU Doctor: Agent Skill & Performance Profiler for PyTorch on Cloud TPUs](https://raw.githubusercontent.com/jigyasa-grover/TorchTPU-Doctor/main/docs/cover.png)

---

## 1. From `PyTorch/XLA` Ceremony to Native `torch_tpu`

At PyTorch Conference 2026, Google and Meta's PyTorch team open-sourced **[TorchTPU (`torch_tpu`)](https://github.com/google-pytorch/torch_tpu)**—a native, principled PyTorch backend for Google Cloud TPUs ([Google Cloud announcement](https://cloud.google.com/blog/topics/ai-infrastructure/torchtpu-is-now-open-source-run-native-pytorch-on-tpus) · [PyTorch technical blog](https://pytorch.org/blog/introducing-torchtpu/) · [Cloud TPU docs](https://docs.cloud.google.com/tpu/docs/pytorch-on-tpu)).

Anyone who trained models on `PyTorch/XLA` a couple of years ago remembers the Lazy Tensor ceremony: `xm.xla_device()`, manual `xm.mark_step()` barriers at the end of every training step, and custom `ParallelLoader` wrappers. With `torch_tpu`, TPUs sit right alongside GPUs and CPUs behind first-class PyTorch APIs:

```python
import torch

device = torch.accelerator.current_accelerator()  # torch.device('tpu')
model = MyModel().to(device, dtype=torch.bfloat16)
compiled = torch.compile(model, backend="tpu", dynamic=False)
```

Naturally, the first thing I wanted to test was moving a standard Hugging Face `transformers` + `peft` LoRA supervised fine-tuning script (`Qwen/Qwen2.5-0.5B-Instruct`) onto a single Cloud TPU `v6e-1` (Trillium) VM to see how far *"runs out of the box"* goes in practice.

- **The good news:** The script ran end-to-end without throwing a single exception, and training loss decreased cleanly.
- **The catch:** `peft`'s device helper quietly tried to place my adapters on `'cpu'`. Once I pointed the run at `tpu:0`, step 0 finished in `41 ms` while steps 1 through 5 stalled for **44 to 77 seconds per step**. Worse, even after I bucketed my batch shapes and deleted `loss.item()` from my training loop, every forward pass was *still* stalling twice on hidden device-to-host boolean syncs buried inside `transformers` itself.

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                   STANDARD CUDA / HUGGING FACE LORA TRAINING LOOP                    │
│   • infer_device()   • tokenizer(padding=True)   • loss.item()   • slice writes      │
└──────────────────────────────────────────┬───────────────────────────────────────────┘
                                           │
                   ┌───────────────────────┴───────────────────────┐
                   ▼                                               ▼
┌─────────────────────────────────────┐         ┌─────────────────────────────────────┐
│      On NVIDIA GPU (CUDA Eager)     │         │     On Cloud TPU v6e (torch_tpu)    │
├─────────────────────────────────────┤         ├─────────────────────────────────────┤
│ • Kernel-by-kernel eager dispatch   │         │ • Whole-graph StableHLO XLA compile │
│ • Ragged seq lengths launch fine    │         │ • Every new shape = 44s–77s compile │
│ • Scalar .item() costs microseconds │         │ • .item() flushes HBM fusion queue  │
│ • 'cuda' hardcoded in HF helpers    │         │ • infer_device() falls back to 'cpu'│
└─────────────────────────────────────┘         └─────────────────────────────────────┘
```

To make these invisible hardware mismatches obvious—both to human engineers and to AI coding agents—I built **[TorchTPU Doctor (`torchtpu-doctor`)](https://github.com/jigyasa-grover/TorchTPU-Doctor)**:

- **GitHub Repository:** [github.com/jigyasa-grover/TorchTPU-Doctor](https://github.com/jigyasa-grover/TorchTPU-Doctor)
- **Executed Cloud TPU `v6e-1` Notebook:** [`notebooks/torchtpu_doctor_demo.ipynb`](https://github.com/jigyasa-grover/TorchTPU-Doctor/blob/main/notebooks/torchtpu_doctor_demo.ipynb) ([Open in Google Colab](https://colab.research.google.com/github/jigyasa-grover/TorchTPU-Doctor/blob/main/notebooks/torchtpu_doctor_demo.ipynb))
- **Drop-In Agent Skill (`SKILL.md`):** [`.agents/skills/torchtpu-doctor/SKILL.md`](https://github.com/jigyasa-grover/TorchTPU-Doctor/blob/main/.agents/skills/torchtpu-doctor/SKILL.md)

![Before vs After on Cloud TPU v6e-1](https://raw.githubusercontent.com/jigyasa-grover/TorchTPU-Doctor/main/notebooks/before_after_tpu.png)

---

## 2. Reproducing the Baseline: A Standard GPU LoRA Script on `v6e-1`

Here is the starting baseline ([`examples/naive_lora_sft.py`](https://github.com/jigyasa-grover/TorchTPU-Doctor/blob/main/examples/naive_lora_sft.py)). If you write PyTorch on CUDA, every single line in this file looks idiomatic:

```python
import torch
from peft import LoraConfig, get_peft_model
from peft.utils.other import infer_device
from transformers import AutoModelForCausalLM, AutoTokenizer

device = infer_device()  # Quietly returns 'cpu' on TorchTPU!
tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-0.5B-Instruct")
base = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-0.5B-Instruct", dtype=torch.bfloat16)
model = get_peft_model(base, LoraConfig(r=8, target_modules=["q_proj", "v_proj"])).to(device)
optimizer = torch.optim.AdamW(model.parameters(), lr=2e-4)
loss_history = torch.zeros(16, device=device)

for step, texts in enumerate(batches):
    # Pads only to this batch's longest prompt -> new (batch, seq) shape every step
    enc = tokenizer(texts, padding=True, truncation=True, max_length=256, return_tensors="pt").to(device)
    labels = enc["input_ids"].clone()
    labels[enc["attention_mask"] == 0] = -100

    optimizer.zero_grad()
    loss = model(input_ids=enc["input_ids"], attention_mask=enc["attention_mask"], labels=labels).loss
    loss.backward()
    optimizer.step()

    loss_history[step : step + 1] = loss.detach()
    print(f"step={step} loss={loss.item():.4f}")
```

When I ran this workload on a Cloud TPU `v6e-1` VM (`torch_tpu 0.2.0`, `PyTorch 2.15.0+cpu`, `libtpu 0.0.51`) under `torch.compile(model, backend="tpu", dynamic=False)` after warming up step 0, here is what printed to the terminal:

```text
  [before] step 0 | shape=(3, 27)    |     41.0 ms | loss=5.1908
  [before] step 1 | shape=(3, 39)    |  44447.5 ms | loss=6.0999
  [before] step 2 | shape=(3, 54)    |  44863.6 ms | loss=4.6766
  [before] step 3 | shape=(3, 70)    |  56005.1 ms | loss=5.6017
  [before] step 4 | shape=(3, 86)    |  61186.0 ms | loss=5.1932
  [before] step 5 | shape=(3, 141)   |  77369.2 ms | loss=4.6792

Before mean step time: 47318.7 ms/step
```

Nothing crashed, the gradients flowed, and yet the Trillium chip spent nearly five minutes grinding through six tiny mini-batches. Tracing what happened underneath surfaced **five distinct bottlenecks**.

---

## 3. Five Silent GPU-to-TPU Bottlenecks (and How to Fix Them)

### 3.1 Ecosystem Helpers Falling Back to `"cpu"` & `PrivateUse1` Gotchas (`TPU001`)

Core `transformers` already queries PyTorch's device-agnostic `torch.accelerator` API, so `Trainer` recognizes `"tpu"`. Several neighboring libraries in the Hugging Face ecosystem, however, still walk hardcoded `if/elif` vendor allowlists:

- **PEFT** (`src/peft/utils/other.py`): `infer_device()` checks `cuda`, `mps`, `mlu`, `xpu`, `npu`, and silently falls through to `"cpu"` on a TPU VM.
- **SentenceTransformers** (`sentence_transformers/util/environment.py`): `get_device_name()` checks `cuda`, `mps`, `npu`, `xpu`, `hpu`, and returns `"cpu"`.
- **lm-evaluation-harness** (`lm_eval/models/huggingface.py`): `device_list` omits `"tpu"`, defaulting to `torch.device("cpu")`.

There is a second trap when you ask an LLM coding assistant how to detect a TPU: it almost always invents `torch.tpu.is_available()`. In `torch_tpu >= 0.2.0`, `torch.tpu.is_available()`, `device_count()`, and `synchronize()` are internal `PrivateUse1` backend hooks; user code should go through `torch.accelerator`:

```python
import torch

# Avoid: internal PrivateUse1 backend hook
# if torch.tpu.is_available(): ...

# Prefer: stable PyTorch accelerator API (or torchtpu_doctor.get_device())
device = (
    torch.accelerator.current_accelerator()
    if torch.accelerator.is_available()
    else torch.device("cpu")
)
```

---

### 3.2 Per-Step Host Syncs in `loss.item()` *and* Inside `transformers.masking_utils` (`TPU002`)

On CUDA, calling `loss.item()` every step for a tqdm bar barely registers. On TorchTPU, eager ops execute asynchronously on the TPU (`Strict` eager dispatches op-by-op asynchronously, while `DeferAndFuse` via `TORCH_TPU_DEFER_AND_FUSE=1` queues and fuses whole regions of ops before touching HBM). Either way, asking Python for a scalar via `.item()`, `.cpu()`, or `torch.nonzero()` forces a device-to-host materialization barrier, blocking Python until the TPU drains its queue and copies bytes over PCIe.

Here is where instrumenting PyTorch's dispatcher on real TPU hardware paid off. Even after I deleted `loss.item()` from my own 6-step `Qwen2.5-0.5B` loop on `v6e-1`, my `TorchDispatchMode` counter still flagged **12 `aten::_local_scalar_dense` host syncs** (2 per step!). Printing the Python traceback inside `__torch_dispatch__` pointed straight into `transformers/masking_utils.py`:

```text
SYNC_OP: aten::_local_scalar_dense [('tpu:0', (), 'torch.bool')]
  File ".../transformers/masking_utils.py", line 496, in sdpa_mask
    if allow_is_causal_skip and _ignore_causal_mask_sdpa(
  File ".../transformers/masking_utils.py", line 271, in _ignore_causal_mask_sdpa
    if (q_length == 1 or kv_length == q_length) and (padding_mask is None or fast_all(padding_mask)):
```

`_ignore_causal_mask_sdpa` calls `fast_all(padding_mask)` (implemented as `tensor.sum() == tensor.numel()`) twice per forward pass to check whether it can skip constructing an explicit 4D causal mask on CUDA FlashAttention. Because `is_tracing(padding_mask)` evaluates to `False` on eager `tpu:0` tensors, **every forward pass stalled twice waiting on a `torch.bool` readback from TPU HBM to CPU Python.**

**The Fix:** `torchtpu_doctor.patch_hf_tpu()` patches `peft` and `sentence-transformers` device detection *and* short-circuits `_ignore_causal_mask_sdpa` to `False` when `padding_mask.device.type == "tpu"` (the exact branch `transformers` already takes during tracing), while training loops accumulate detached scalar loss on device:

```python
import torchtpu_doctor as ttd

ttd.patch_hf_tpu()
# Patches in memory:
#   - peft.utils.other.infer_device -> returns 'tpu'
#   - sentence_transformers.util.environment.get_device_name -> returns 'tpu'
#   - transformers.masking_utils._ignore_causal_mask_sdpa -> skips TPU->CPU fast_all() sync

loss_sum = torch.zeros((), device=device, dtype=torch.float32)
for step, batch in enumerate(loader):
    loss = run_step(model, batch)
    loss_sum = loss_sum + loss.detach().float()  # stays on TPU HBM
    if (step + 1) % 50 == 0:
        print(f"step={step + 1} mean_loss={(loss_sum / 50).item():.4f}")
        loss_sum.zero_()
```

Eliminating those 12 hidden `transformers` syncs immediately cut 6-step eager execution in half (`2,739 ms` down to `1,329 ms`) and dropped host syncs from `18` to `0`.

---

### 3.3 Dynamic Batch Padding (`padding=True`), `8×128` MXU Tiles & Dummy-Row `NaN`s (`TPU003`)

`Qwen2.5-0.5B-Instruct` already has TPU-friendly projection dimensions (`hidden_size=896`, `intermediate_size=4864`, `vocab_size=151936`—all exact multiples of `128`). Yet `tokenizer(texts, padding=True)` pads each mini-batch only to *that batch's* longest sequence, yielding 6 distinct `(batch, seq)` shapes in 6 steps:

$$[(3, 27),\ (3, 39),\ (3, 54),\ (3, 70),\ (3, 86),\ (3, 141)]$$

Under `torch.compile(model, backend="tpu", dynamic=False)`, every unseen shape misses TorchTPU's graph cache and triggers a fresh full-graph StableHLO compilation (`44.4s`–`77.4s`), while ragged dimensions under-utilize the TPU Matrix Multiply Unit's native $(8 \times 128)$ systolic tiles:

$$\text{Tile Fill}(M, N) = \frac{M}{\lceil M / 8 \rceil \cdot 8} \times \frac{N}{\lceil N / 128 \rceil \cdot 128}$$

**The Fix:** Bucket sequence lengths to fixed multiples of `128` and pad ragged batch sizes to multiples of `4` or `8` with `labels = -100`. One subtle numerical trap I hit on `v6e-1`: if a dummy padded batch row has an all-zero `attention_mask`, SDPA softmax backward computes $0 \times \text{NaN} = \text{NaN}$ gradients! Keeping token `0` unmasked (`attention_mask[:, 0] = 1`) on dummy rows while keeping all `labels = -100` keeps attention backward finite without contributing to loss or parameter updates:

```python
collator = ttd.TileAlignedCollator(
    pad_to_multiple_of=128,
    buckets=(128, 256, 512, 1024),
    pad_token_id=tokenizer.pad_token_id,
    pad_batch_to_multiple_of=4,
)
# Those 6 ragged batches now map cleanly to 2 static shapes: [(4, 128), ..., (4, 256)]
```

---

### 3.4 Partial-Slice In-Place Writes & XLA Buffer Donation (`TPU004`)

Under the hood, XLA StableHLO operates on immutable functional tensors and relies on **buffer donation** to make PyTorch mutations zero-copy in HBM. Writing into a partial slice view whose backing `UntypedStorage` is larger than the slice lowers to a `dynamic-update-slice` scatter that can copy the entire backing buffer whenever XLA cannot prove alias uniqueness:

```python
# Avoid inside compiled steps / hot loops: mutates a slice view of a larger storage buffer
loss_history[step : step + 1] = loss.detach()

# Prefer: out-of-place tensor ops (`torch.where` / `torch.cat`) or scalar device accumulation
loss_sum = loss_sum + loss.detach().float()
```

---

### 3.5 `float64` Casts, `Precision.HIGHEST`, and Non-Unit Minor Strides (`TPU005` & `TPU006`)

TPU Matrix Multiply Units (MXUs) natively run `bfloat16` multiplication with `float32` accumulation (`Precision.DEFAULT`), while the Vector Processing Unit (VPU) handles IEEE-754 `float32`. Casting tensors to `float64` (`.double()`) bypasses fast native MXU paths. When a numerically sensitive layer genuinely requires higher `float32` matmul precision, scope `torch.tpu.precision` locally instead:

```python
# Avoid: float64 falls off the fast MXU path
# logits = logits.double()

# Prefer: float32 / bfloat16, scoping Precision.HIGHEST only where numerically required
logits = logits.float()
if device.type == "tpu":
    with torch.tpu.precision(torch.tpu.Precision.HIGHEST):
        ...
```

Similarly, operating on non-contiguous 3D+ views whose innermost dimension is not unit-strided (`stride[-1] != 1`) can force physical HBM relayout copies across `(8, 128)` tiles.

---

## 4. Inside the `torchtpu-doctor` Architecture

Rather than leaving these lessons as a static checklist, I packaged them into a lightweight ~885-line Python toolkit ([`src/torchtpu_doctor/`](https://github.com/jigyasa-grover/TorchTPU-Doctor/tree/main/src/torchtpu_doctor)) spanning four layers of the developer workflow:

```
┌────────────────────────┐    ┌────────────────────────┐    ┌────────────────────────┐
│   1. AGENT SKILL       │    │   2. STATIC SCANNER    │    │   3. LIVE GUARD        │
│   SKILL.md             ├───►│   torchtpu-doctor scan ├───►│   with tpu_doctor():   │
│   (Antigravity/Claude) │    │   (Zero-dep AST rules) │    │   (TorchDispatchMode)  │
└────────────────────────┘    └────────────────────────┘    └───────────┬────────────┘
                                                                        │
                                                                        ▼
                                                            ┌────────────────────────┐
                                                            │   4. RUNTIME PATCHES   │
                                                            │   patch_hf_tpu() +     │
                                                            │   TileAlignedCollator  │
                                                            └────────────────────────┘
```

### 4.1 Zero-Dependency Static AST Scanner (`torchtpu-doctor scan`)

[`scan.py`](https://github.com/jigyasa-grover/TorchTPU-Doctor/blob/main/src/torchtpu_doctor/scan.py) walks Python ASTs using only the Python standard library—so you can lint training scripts locally or in CI (`--strict`, `--json`, `# noqa: TPU002`) in milliseconds without installing PyTorch or spinning up a TPU VM:

| Rule | Detects | Recommended Fix |
| :--- | :--- | :--- |
| `TPU001` | `.cuda()`, `'cuda'`/`'nccl'` literals, internal `torch.tpu.is_available()`, unpatched `peft` / `sentence-transformers` helpers | Use `get_device()` / `torch.accelerator.*` and call `patch_hf_tpu()` |
| `TPU002` | `.item()`, `.cpu()`, `.numpy()`, `.tolist()`, or `synchronize()` inside loops / `forward()` | Accumulate detached scalars on device; read `.item()` on log intervals |
| `TPU003` | `padding=True` without `pad_to_multiple_of=128`; hot-path `nonzero()` / `unique()` / `masked_select()` | Use `TileAlignedCollator` (`pad_to_multiple_of=128`) and fixed-shape `torch.where` |
| `TPU004` | In-place slice assignment (`buf[i:i+1] = x`) inside loops / `forward()` | Prefer out-of-place ops under `torch.compile(backend="tpu")` to preserve buffer donation |
| `TPU005` | `torch.float64` / `.double()` casts and manual `.as_strided()` views | Use `bfloat16` or `float32` (`torch.tpu.Precision.HIGHEST` if needed) and unit minor strides |
| `TPU006` | Legacy `torch_xla` imports (`xm.xla_device()`, `xm.mark_step()`) | Migrate to native `device="tpu"` and `torch.compile(model, backend="tpu", dynamic=False)` |

Running `torchtpu-doctor scan` against our baseline script flags all four static issues immediately:

```text
$ torchtpu-doctor scan examples/naive_lora_sft.py
naive_lora_sft.py:12: TPU001 `peft.utils.other.infer_device()` omits 'tpu' and falls back to 'cpu' -> call `patch_hf_tpu()` at startup or use `get_device()`
naive_lora_sft.py:43: TPU003 `padding=True` without `pad_to_multiple_of=128` causes per-batch XLA recompiles -> pass `pad_to_multiple_of=128` or use `TileAlignedCollator`
naive_lora_sft.py:77: TPU004 in-place slice write inside loop/forward can break XLA buffer donation -> prefer out-of-place `torch.where` / `torch.cat` under `torch.compile(backend='tpu')`
naive_lora_sft.py:78: TPU002 `.item()` in hot path flushes TorchTPU deferred fusion queue -> accumulate tensors on device and read `.item()` only on log steps

Found 4 potential TorchTPU issue(s).
```

### 4.2 Live `TorchDispatchMode` Warmup Profiler (`with ttd.tpu_doctor():`)

Static linting catches anti-patterns in your own files, whereas [`guard.py`](https://github.com/jigyasa-grover/TorchTPU-Doctor/blob/main/src/torchtpu_doctor/guard.py) subclasses PyTorch's `TorchDispatchMode` to inspect every ATen op dispatched across 2 to 6 warmup steps—including ops triggered deep inside third-party packages:

```python
from torch.utils._python_dispatch import TorchDispatchMode

class _Mode(TorchDispatchMode):
    def __torch_dispatch__(self, func, types, args=(), kwargs=None):
        parent._record(torch, func, args, kwargs or {})
        return func(*args, **kwargs)
```

Across `doc.step()` boundaries, `_record` audits `aten::_local_scalar_dense` / `.to("cpu")` host syncs, partial-slice storage writes, broken minor strides, FLOP-weighted `8×128` MXU tile fill, and step-level shape profiles (comparing each step's `frozenset` of `(op, input_shapes)` so Transformers with heterogeneous `q_proj`, `k_proj`, `gate_proj`, and `lora_A`/`B` shapes report `0` dynamic ops once bucketed).

Here is the real `v6e-1` dispatch audit before and after applying `torchtpu-doctor`:

```text
torchtpu-doctor [before:naive_lora] (6 steps, 27714 ops, 70668.4 ms)
  host syncs (.item/.cpu) : 18
  dynamic shape ops       : 2
  partial-slice writes    : 6
  strided 3D+ view ops    : 0
  128-aligned matmuls     : 0/1590 (98.8% MXU lane fill)

torchtpu-doctor [after:tpu_aligned_lora] (6 steps, 27648 ops, 1329.3 ms)
  host syncs (.item/.cpu) : 0
  dynamic shape ops       : 0
  partial-slice writes    : 0
  strided 3D+ view ops    : 0
  128-aligned matmuls     : 1014/1590 (99.9% MXU lane fill)
  status: clean (ready for torch.compile(backend='tpu'))
```

### 4.3 Agent Skill (`SKILL.md`) for AI Coding Assistants

Because frontier coding models were trained heavily on older `torch_xla` repositories, prompting an agent to *"port this PyTorch script to Cloud TPU"* almost always produces legacy `import torch_xla.core.xla_model as xm` and `xm.mark_step()` code. Dropping [`.agents/skills/torchtpu-doctor/SKILL.md`](https://github.com/jigyasa-grover/TorchTPU-Doctor/blob/main/.agents/skills/torchtpu-doctor/SKILL.md) into `.agents/skills/` (Google Antigravity) or `.claude/skills/` (Claude Code) equips the agent with native `torch_tpu` idioms (`torch.accelerator`, `patch_hf_tpu()`, `TileAlignedCollator`, `backend="tpu"`) from the very first prompt.

---

## 5. Putting It All Together: The `18.6 ms/step` TPU LoRA Loop

Combining persistent Tier-3 compilation caching, `patch_hf_tpu()`, `TileAlignedCollator`, warmup auditing, and static `torch.compile(backend="tpu")` ([`examples/tpu_lora_sft.py`](https://github.com/jigyasa-grover/TorchTPU-Doctor/blob/main/examples/tpu_lora_sft.py)):

```python
import torch
from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM, AutoTokenizer
import torchtpu_doctor as ttd

# 1. Configure persistent Tier-3 disk cache before TPU init & patch HF helpers
ttd.enable_tpu_cache("/tmp/torchtpu_cache")
ttd.patch_hf_tpu()
device = ttd.get_device()

tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-0.5B-Instruct")
base = AutoModelForCausalLM.from_pretrained("Qwen/Qwen2.5-0.5B-Instruct", dtype=torch.bfloat16)
base.config.use_cache = False
model = get_peft_model(
    base, LoraConfig(r=8, lora_alpha=16, target_modules=["q_proj", "v_proj"], task_type="CAUSAL_LM")
).to(device)

# 2. Bucket sequence lengths to 128-multiples and batch size to 4-multiples
collator = ttd.TileAlignedCollator(
    pad_to_multiple_of=128,
    buckets=(128, 256),
    pad_token_id=tokenizer.pad_token_id,
    pad_batch_to_multiple_of=4,
)
optimizer = torch.optim.AdamW(model.parameters(), lr=2e-4)

# 3. Audit warmup steps under TorchDispatchMode before compiling
with ttd.tpu_doctor("lora_audit") as doc:
    for batch in warmup_batches:
        optimizer.zero_grad(set_to_none=True)
        loss = model(**batch).loss
        loss.backward()
        optimizer.step()
        doc.step()
print(doc.result.format_text())

# 4. Compile outside TorchDispatchMode, warm static buckets once, and defer .item()
compiled_model = torch.compile(model, backend="tpu", dynamic=False)
loss_sum = torch.zeros((), device=device, dtype=torch.float32)

for batch in aligned_batches:
    optimizer.zero_grad(set_to_none=True)
    loss = compiled_model(**batch).loss
    loss.backward()
    optimizer.step()
    loss_sum = loss_sum + loss.detach().float()

torch.accelerator.synchronize()
print(f"mean_loss={(loss_sum / len(aligned_batches)).item():.4f}")
```

---

## 6. End-to-End Benchmarks on Cloud TPU `v6e-1`

Full executed cell outputs are preserved in [`notebooks/torchtpu_doctor_demo.ipynb`](https://github.com/jigyasa-grover/TorchTPU-Doctor/blob/main/notebooks/torchtpu_doctor_demo.ipynb):

| Metric | Before (Naive GPU Port) | After (`torchtpu-doctor`) |
| :--- | :--- | :--- |
| `peft.utils.other.infer_device()` | `'cpu'` | `'tpu'` |
| Unique `(batch, seq)` shapes (6 steps) | `6` (`(3, 27)` .. `(3, 141)`) | `2` (`(4, 128)`, `(4, 256)`) |
| Host sync stalls (`aten::_local_scalar_dense`) | `18` (`3` / step) | `0` |
| Dynamic-shape ATen ops | `2` | `0` |
| Partial-slice storage writes | `6` | `0` |
| 128-tile aligned matmuls | `0 / 1590 (0%)` | `1014 / 1590 (64%)` |
| FLOP-weighted MXU lane fill | `98.8%` | **`99.9%`** |
| Eager 6-step audit wall time | `70,668 ms` | `1,329 ms` (**53.2× faster**) |
| `torch.compile(backend="tpu")` step time | `47,318.7 ms/step` | **`18.6 ms/step` (2,537× faster)** |

*(Why `1014 / 1590` aligned matmuls instead of `1590 / 1590`? Every base `Qwen2.5-0.5B` projection and `lm_head` matmul is 100% 128-tile aligned once `batch * seq` is `512` or `1024`; the remaining 576 matmuls across 6 steps are the intentionally low-rank `r=8` LoRA adapter projections, which account for ~0.1% of total FLOPs.)*

Breaking the timings down rung by rung shows exactly where every speedup comes from:

| Configuration on Cloud TPU `v6e-1` | Mean Latency | What Happens Under the Hood |
| :--- | :--- | :--- |
| **1. Naive eager** (`padding=True`, `loss.item()`) | `11,778.1 ms/step` | Every new `(3, seq)` shape triggers fresh op compilations + 3 host syncs/step. |
| **2. Bucketed eager** (`TileAlignedCollator`, deferred loss) | `456.5 ms/step` | Static `(4, 128)` / `(4, 256)` buckets eliminate shape drift, still stalling twice/step inside `transformers`. |
| **3. Clean eager** (`+ patch_hf_tpu()`) | `221.5 ms/step` | Short-circuiting `_ignore_causal_mask_sdpa` boolean readbacks cuts eager step time in half (`0` host syncs). |
| **4. Naive `torch.compile(backend="tpu", dynamic=False)`** | `47,318.7 ms/step` | Step 0 runs in `41.0 ms` (warmed), then steps 1–5 each pay `44.4s`–`77.4s` full-graph StableHLO recompiles. |
| **5. Clean `torch.compile(backend="tpu", dynamic=False)`** | **`18.6 ms/step`** | Whole-step compiled graph (**11.9× faster** than clean eager), persisted across restarts via `TORCH_TPU_TIER3_COMPILATION_CACHE_ROOT`. |

---

## 7. Practical Caveats for Production Workloads

Two engineering boundaries to keep in mind when adopting `torchtpu-doctor`:

1. **Wrap warmup steps only—not full training epochs:** Because `TorchDispatchMode` intercepts every ATen call in Python, wrap 2 to 6 eager warmup steps inside `with ttd.tpu_doctor():`, verify `status: clean`, and exit the context manager before invoking `torch.compile(model, backend="tpu", dynamic=False)`.
2. **Single-chip readiness before multi-chip scale-out:** `torchtpu-doctor` targets single-chip XLA compilation stability, host-device sync elimination, and MXU tile occupancy. Once single-chip execution is clean and you scale across multi-chip ICI pods with `DTensor` or `FSDP`, pair it with `torch.profiler` and `XProf` to inspect collective communication overlap.

---

## 8. Try It Out & References

Install directly from GitHub and run the static scanner or self-contained dispatch demo on any machine:

```bash
pip install git+https://github.com/jigyasa-grover/TorchTPU-Doctor.git
torchtpu-doctor scan path/to/your/repo
torchtpu-doctor demo
```

- **GitHub Repository:** [github.com/jigyasa-grover/TorchTPU-Doctor](https://github.com/jigyasa-grover/TorchTPU-Doctor)
- **Colab / Cloud TPU `v6e-1` Notebook:** [`notebooks/torchtpu_doctor_demo.ipynb`](https://colab.research.google.com/github/jigyasa-grover/TorchTPU-Doctor/blob/main/notebooks/torchtpu_doctor_demo.ipynb)
- **Before & After Sample Scripts:** [`examples/naive_lora_sft.py`](https://github.com/jigyasa-grover/TorchTPU-Doctor/blob/main/examples/naive_lora_sft.py) and [`examples/tpu_lora_sft.py`](https://github.com/jigyasa-grover/TorchTPU-Doctor/blob/main/examples/tpu_lora_sft.py)
- **Further Reading:**
  - [TorchTPU is now open source: Run native PyTorch on TPUs (Google Cloud Blog, PyTorch Conference 2026)](https://cloud.google.com/blog/topics/ai-infrastructure/torchtpu-is-now-open-source-run-native-pytorch-on-tpus)
  - [Introducing TorchTPU (PyTorch Blog)](https://pytorch.org/blog/introducing-torchtpu/)
  - [PyTorch on Cloud TPU Documentation](https://docs.cloud.google.com/tpu/docs/pytorch-on-tpu)
  - [`google-pytorch/torch_tpu` GitHub Repository](https://github.com/google-pytorch/torch_tpu)

---

Hope you enjoyed this deep dive; check out the complete toolkit, Agent Skill, and benchmark notebook on [GitHub](https://github.com/jigyasa-grover/TorchTPU-Doctor) 🩺

<pre class="wp-block-preformatted">
Huge thanks to Google, Google Cloud, and the Google ML Developer Programs &amp; Cloud TPU teams for organizing #TorchTPUSprint and generously providing the Cloud TPU compute resources for these benchmarks.
Google Cloud credits are provided for this project✨
#BuildWithAI #BuildWithTPU #TorchTPU #TorchTPUSprint #PyTorch #GoogleCloud
</pre>
