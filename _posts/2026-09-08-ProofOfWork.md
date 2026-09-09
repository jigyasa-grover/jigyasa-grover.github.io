---
layout: post
type: blog
title: Proof of Work - Agentic Video Understanding with Gemini as Your AI Teaching Assistant 📝
comments: true
mathjax: true
---

> **Grade the _process_, not just the output.**

AI can write the code. But who can *think* through the problem? **Proof of Work** serves as your AI Teaching Assistant, powered by Gemini's agentic video understanding. It watches continuous screen recordings of programming practicums and engineering challenges to evaluate the problem-solving process — architectural planning, debugging maturity, and authentic code iteration — backed by timestamped visual evidence, not just whether unit tests pass. [Check it out!](https://jigyasa-grover.github.io/proof-of-work/)

<figure class="wp-block-image size-large"><a href="https://jigyasagrover.wordpress.com/wp-content/uploads/2026/09/cover.png"><img src="https://jigyasagrover.wordpress.com/wp-content/uploads/2026/09/cover.png?w=1024" alt="" class="wp-image-3792"/></a></figure>

---

## 1. The Age of Shortcuts — and Why Process Matters More Than Ever

In the age of one-click code generation, instant AI autocomplete, and copy-paste-driven development, **shipping working code has never been easier — and never meant less.**

Assessment frameworks in technical education and hiring have historically relied on a simplifying assumption: if the code passes the tests, the candidate demonstrated competence. But generative AI has structurally collapsed that assumption. When anyone can prompt their way to a working solution, the *output artifact* tells you almost nothing about the *engineer* who produced it.

What matters now is **problem-solving temperament** — the planning instinct, the debugging discipline, the intellectual honesty to verify rather than vibe-check, the willingness to ablate and iterate rather than submit the first thing that runs. These are the qualities that separate engineers who can navigate novel ambiguity from those who collapse without a template.

Consider two candidates completing the same deep learning practicum:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 OBSERVED ARTIFACT                                      │
│   • PyTorch CNN Classifier   • 87.2% CIFAR-10 Test Acc   • Unit Tests: 10/10 Passed    │
└────────────────────────────────────────┬───────────────────────────────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
┌───────────────────────────────────┐           ┌───────────────────────────────────┐
│     Candidate A (Methodical)      │           │      Candidate B (Stochastic)     │
├───────────────────────────────────┤           ├───────────────────────────────────┤
│ • Pre-computation tensor sizing   │           │ • Arbitrary copy-paste from blogs │
│ • Systematic dimension tracing    │           │ • Random permutation upon CUDA err│
│ • Critical AI diff verification   │           │ • Blind automated prompt loops    │
│ • V1 → V2 → V3 loss ablation      │           │ • Single-pass lucky seed run      │
└───────────────────────────────────┘           └───────────────────────────────────┘
```

**Identical output. Orthogonal thinking process.** The latent process trajectory:

$$\mathcal{T} = \{(t_0, a_0, s_0), (t_1, a_1, s_1), \dots, (t_n, a_n, s_n)\}$$

reveals completely different thinking processes. Candidate A demonstrates structured reasoning, fault isolation, and hypothesis-driven development; Candidate B operates through trial-and-error guessing.

**Proof of Work** was built to make this distinction visible, serving as an **autonomous AI Teaching Assistant**. By treating continuous screen recordings as rich, empirical data sources, Gemini navigates the student's timeline to reconstruct, evaluate, and verify the problem-solving *process* — not just the final code — backed by timestamped visual evidence.

---

## 2. The Technical Challenge: Why Naive Video Processing Doesn't Scale

Evaluating 30-to-60-minute screen recordings creates a serious compute and context-window bottleneck for standard multimodal models.

### Why Fixed-Rate Frame Extraction Fails

Standard video pipelines extract frames at a fixed rate (typically 1 FPS). For a 31-minute developer session:

$$\text{Total Frames} = 31\text{ min} \times 60\text{ sec/min} \times 1\text{ frame/sec} = 1,860\text{ visual frames}$$

When tokenized at typical vision resolutions (~258 tokens per frame) plus audio (~32 tokens per second), the total context explodes:

$$\text{Context Burden} \approx 1,860 \times 258 + 1,860 \times 32 \approx 539,400\text{ tokens per pass}$$

This brute-force approach fails in three ways:

1. **Attention Dilution**: Stuffing 500k+ tokens into a single context window means the model can't focus. Subtle but important moments (like a 1.5-second glance at a stack trace) get lost in the noise.
2. **Missing Key Moments**: Downsampling to <0.5 FPS to save tokens risks skipping fast interactions entirely — terminal outputs, hotkey sequences, quick error messages.
3. **Cost Blowup**: Running multiple evaluation passes over dense token arrays becomes economically impractical at scale.

### The Agentic Approach: Let the Model Navigate the Video

Google's release of [agentic video understanding in Gemini](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-agentic-video-in-gemini/) transforms the model from a *passive frame consumer* into an *active investigative agent*.

Instead of feeding the entire video in at once, the model runs an iterative **think → tool → observe** loop using built-in APIs:

```
┌─────────────────────────────────────┐
│        REASONING ENGINE             │
│       (Gemini 3.7 Flash)            │
└──────────────┬──────────────────────┘
               │  Tool Call Emit
               ▼
┌─────────────────────────────────────┐
│     NATIVE VIDEO TOOLS              │
│  • Transcript scanning              │
│  • Adaptive frame extraction        │
│  • Audio segment loading            │
└──────────────┬──────────────────────┘
               │  Tool Observation
               ▼
       ┌───────────────┐
       │  Back to RE   │──→ (next think → tool → observe cycle)
       └───────────────┘
```

Internally, the model invokes native video tools — surfaced in the API response as [`processing_call` and `processing_result`](https://ai.google.dev/gemini-api/docs/video-understanding#agentic-video-understanding) steps. Crucially, the model uses a **transcript-first** strategy: it reads timestamped speech transcripts before deciding if visual inspection is necessary, minimizing unnecessary frame extraction.

- **Transcript scanning** (default first step): Quickly scans spoken audio and on-screen text (OCR) to find phase boundaries and error moments — before pulling any frames.
- **Temporal zooming & adaptive frame extraction**: Pulls high-density frames (up to 10+ FPS) only around interesting moments (e.g., debugging in terminal) while skipping static reading intervals entirely. The model adjusts the frame rate per-segment (e.g., 5–10 FPS for fast motion, 0.1 FPS to skim).
- **Audio segment loading**: Extracts audio streams directly when acoustic cues, speaker tone, or verbal self-corrections matter.

### What This Unlocks

1. **Sub-Second Moment Retrieval**: The model can pinpoint split-second events that fixed 1 FPS sampling would miss entirely — a 200ms terminal exception flash, a quick `Cmd+Z` undo sequence, or a momentary glance at a Stack Overflow tab. For Proof of Work, this is critical: the difference between a "methodical debugger" and a "random permuter" often happens in a 1.5-second window where the developer either reads the stack trace or blindly changes a parameter.
2. **Dynamic FPS Adjustment**: The model adjusts its own sampling rate in real time. During a 5-minute stretch of reading slides? It might sample at 0.1 FPS. During a rapid terminal debugging session? It ramps up to 10+ FPS, rewatching the same segment at higher density to catch every keystroke.
3. **Pass by Reference**: Unlike static processing which decodes the entire file upfront, agentic mode passes a **lightweight pointer** to the video. Initial context consumption includes only video metadata (duration, container format, file ID) — the model then materializes only the segments it needs.
4. **Cross-Modal Reasoning**: Combines what it sees (code diffs, IDE layout), hears (developer narration, verbal self-corrections), and reads (terminal output, error messages) — fusing all three modalities without context overflow.
5. **Simple Integration**: Fully accessible via the Gemini SDK with `processing="agentic"` — no custom FFmpeg pipelines, frame extraction scripts, or manual timestamp slicing needed.

### When to Use Agentic vs. Static Mode

Google's [developer guide](https://aistudio.google.com/learn/agentic-video-understanding-with-gemini) provides clear guidance:

| Scenario | Recommended Mode | Why |
| :--- | :---: | :--- |
| Long videos (> ~5 min): lectures, webinars, earnings calls | `agentic` | Token savings scale with duration; transcript-first avoids unnecessary frames |
| Fine-grained temporal tasks: exact timestamps, fast motion | `agentic` | Adaptive FPS catches sub-second events that 1 FPS misses |
| Speech + visual separation queries | `agentic` | Transcript search with targeted visual verification |
| Short clips (< 5 min): GIFs, UI animations, social clips | `static` | Lower latency; frame-level precision across entire clip |

Proof of Work exclusively uses agentic mode because every evaluation targets 15–60 minute screen recordings where static processing would be prohibitively expensive.

### Published Benchmarks

Google DeepMind's [published evaluations](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-agentic-video-in-gemini/) on long-form video understanding benchmarks (including LongVideoBench) show major improvements:

| Benchmark Dimension | Static Processing Baseline | Agentic Video (Gemini 3.7 Flash) | Delta ($\Delta$) |
| :--- | :--- | :--- | :--- |
| **Token Consumption** | Dense Frame Array | Dynamic Targeted Sampling | **Up to 88% reduction** |
| **Inference Cost** | Multi-frame Context Saturation | Tool-Governed Traversal | **Up to 66% lower cost** |
| **Accuracy** | Baseline | Agentic | **Up to +7% absolute gain** |
| **Cost vs. Accuracy** | Poor tradeoff | Pareto frontier | Gemini 3.7 Flash best tradeoff |

> **Model Selection Note:** Google's benchmarks place **Gemini 3.7 Flash** at the Pareto frontier — the best accuracy-to-cost ratio among agentic-capable models. Gemini 3.8 Flash offers higher peak accuracy but at increased cost; 3.6 Flash and 3.5 Flash Lite offer further cost savings at reduced quality. We chose 3.7 Flash for Proof of Work because process evaluation requires high reasoning quality but must remain cheap enough to run at scale.

To validate these claims under real-world engineering constraints, we deployed Proof of Work against a raw **31-minute** screen recording of an engineer teaching and demonstrating a [PyTorch CNN image classifier](https://www.youtube.com/watch?v=3zT_QtIupkE):

| System Parameter | Static Processing (1 FPS, estimated) | Proof of Work (Agentic, measured) | Gain |
| :--- | :--- | :--- | :--- |
| **Token Ingestion** | ~$2,697,000 tokens | **$57,226 tokens** | **97.9% reduction** |
| **Per-Evaluation Cost** | ~$0.526* | **~$0.011** | **97.9% cheaper** |
| **Inference Feasibility** | Context Saturated | Trivially Fits Edge Budget | Deterministic Scaling |
| **Granularity** | Single Monolithic Prompt | **5 Specialized Passes** | Deep Corroboration |

*\*Static baseline estimated as 1,860 frames × 258 tokens/frame × 5 passes. Agentic column is measured from actual pipeline run.*

This massive efficiency gain means process verification is no longer a research curiosity — it's practical enough to score thousands of submissions in real time.

### Per-Pass Token Distribution (Measured)

| Pass | Input Tokens | Output Tokens | Total Tokens | % of Total |
| :--- | ---: | ---: | ---: | ---: |
| Process Timeline & Phases | 95 | 672 | 13,107 | 25.7% |
| Debugging & Error Handling | 107 | 80 | 1,053 | 2.1% |
| Resource Usage & Originality | 228 | 325 | 23,501 | 46.2% |
| Code Quality & Iteration | 177 | 491 | 10,917 | 21.4% |
| Final Process Scorecard | 1,438 | 715 | 2,322 | 4.6% |
| **Total** | **2,045** | **2,283** | **50,900** | **100%** |

> **Note:** The low input/output token counts reflect the agentic model's internal tool-call overhead — the bulk of tokens are consumed by the model's native video tool invocations (`processing_call`/`processing_result` steps), which appear in the total but not in the user-visible input/output split.

### Under the Hood: Agentic Step Trace

When the Gemini API processes a video in agentic mode, the response object contains an `interaction` field with a `steps` array. Each step is either a `processing_call` (the model requesting a video segment) or a `processing_result` (the server returning frames/transcript). This is how the model "navigates" the video:

```json
// Simplified representation of the agentic step trace
{
  "interaction": {
    "steps": [
      {
        "type": "processing_call",
        "id": "vc_001",
        "description": "Requesting transcript for 00:00-06:05"
      },
      {
        "type": "processing_result",
        "id": "vc_001",
        "description": "Transcript returned: 'Today we're going to look at CNNs...'"
      },
      {
        "type": "processing_call",
        "id": "vc_002",
        "description": "Requesting frames 06:05-06:15 at 5 FPS (slide transition detected)"
      },
      {
        "type": "processing_result",
        "id": "vc_002",
        "description": "10 frames returned showing kernel convolution diagram"
      },
      {
        "type": "processing_call",
        "id": "vc_003",
        "description": "Requesting frames 28:30-29:30 at 10 FPS (rapid code iteration detected)"
      }
      // ... model continues navigating until it has enough evidence
    ]
  }
}
```

The key insight: during the 5-minute slide-reading section (06:05–15:05), the model made only 2 frame requests. During the 90-second rapid parameter experimentation (28:30–30:00), it made 6 high-density requests. **The model allocated its attention budget based on information density, not elapsed time.**

### Pipeline Execution Log

Here's the actual CLI output from a real pipeline run. Each pass independently invokes agentic video analysis — notice how the SDK confirms agentic tool calls via `non-text parts in the response: ['tool_call', 'tool_response']`:

```
$ uv run proof_of_work_demo.py --video "https://www.youtube.com/watch?v=3zT_QtIupkE"

2026-09-08 17:56:28 [INFO] ============================================================
2026-09-08 17:56:28 [INFO] SHOW YOUR WORK — Process Verification
2026-09-08 17:56:28 [INFO] ============================================================
2026-09-08 17:56:28 [INFO] Video: https://www.youtube.com/watch?v=3zT_QtIupkE | Model: gemini-3.7-flash
2026-09-08 17:56:28 [INFO] ------------------------------------------------------------
2026-09-08 17:56:28 [INFO] Running: Process Timeline & Phases
2026-09-08 17:56:28 [INFO] ------------------------------------------------------------
2026-09-08 17:56:28 [INFO] AFC is enabled with max remote calls: 10.
2026-09-08 17:56:42 [INFO] HTTP Request: POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent "HTTP/1.1 200 OK"
2026-09-08 17:56:42 [WARNING] Warning: there are non-text parts in the response: ['tool_call', 'tool_response'], returning concatenated text result from text parts. Check the full candidates.content.parts accessor to get the full model response.
2026-09-08 17:56:42 [INFO] Tokens — Input: 95 | Output: 672 | Total: 13,107
2026-09-08 17:56:42 [INFO] ------------------------------------------------------------
2026-09-08 17:56:42 [INFO] Running: Debugging & Error Handling
2026-09-08 17:56:42 [INFO] ------------------------------------------------------------
2026-09-08 17:56:45 [INFO] HTTP Request: POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent "HTTP/1.1 200 OK"
2026-09-08 17:56:45 [INFO] Tokens — Input: 107 | Output: 80 | Total: 1,053
2026-09-08 17:56:45 [INFO] ------------------------------------------------------------
2026-09-08 17:56:45 [INFO] Running: Resource Usage & Originality
2026-09-08 17:56:45 [INFO] ------------------------------------------------------------
2026-09-08 17:56:54 [INFO] HTTP Request: POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent "HTTP/1.1 200 OK"
2026-09-08 17:56:54 [INFO] Tokens — Input: 228 | Output: 325 | Total: 23,501
2026-09-08 17:56:54 [INFO] ------------------------------------------------------------
2026-09-08 17:56:54 [INFO] Running: Code Quality & Iteration
2026-09-08 17:56:54 [INFO] ------------------------------------------------------------
2026-09-08 17:57:01 [INFO] HTTP Request: POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent "HTTP/1.1 200 OK"
2026-09-08 17:57:01 [INFO] Tokens — Input: 177 | Output: 491 | Total: 10,917
2026-09-08 17:57:01 [INFO] Scorecard pass will synthesize evidence from 4 prior passes
2026-09-08 17:57:01 [INFO] ------------------------------------------------------------
2026-09-08 17:57:01 [INFO] Running: Final Process Scorecard
2026-09-08 17:57:01 [INFO] ------------------------------------------------------------
2026-09-08 17:57:01 [INFO]   → Injecting 5,359 chars of prior pass context
2026-09-08 17:57:04 [INFO] HTTP Request: POST https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent "HTTP/1.1 200 OK"
2026-09-08 17:57:04 [INFO] Tokens — Input: 1,438 | Output: 715 | Total: 2,322
```

The response `['tool_call', 'tool_response']` warning is the SDK confirming that Gemini used its **native video navigation tools** internally — the model didn't just passively ingest frames. The tool calls are server-side (transcript scanning, frame extraction, audio loading) and appear as non-text response parts.

**Token distribution from the actual run:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Token Usage Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Process Timeline & Phases:    13,107 tokens
  Debugging & Error Handling:    1,053 tokens
  Resource Usage & Originality: 23,501 tokens
  Code Quality & Iteration:     10,917 tokens
  Final Process Scorecard:       2,322 tokens
  ────────────────────────────────────────
  TOTAL: 50,900 tokens
  Passes run: 5
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Notice the token distribution: Pass 3 (Resource Usage) consumed the most tokens (23,501) — it needed dense visual inspection across the entire 31-minute session to track resource usage. Pass 2 (Debugging) used only 1,053 tokens — a quick transcript scan was enough to determine no runtime errors occurred. Pass 5 (Scorecard) used only 2,322 tokens because it consumed the evidence from prior passes (5,359 chars injected) rather than re-analyzing the video independently.

### Multi-Turn Follow-Up Queries

Because the agentic model maintains video context across turns, you can ask follow-up questions without re-processing the entire video:

```python
# After the initial analysis pass:
follow_up = client.models.generate_content(
    model="gemini-3.7-flash",
    contents=[
        video_input,  # Same video Part with media_processing="AGENTIC"
        "At timestamp 28:33, the developer changed kernel_size from 5 to 3. "
        "Did they check the output feature map dimensions before or after this change? "
        "Show me the exact frames where they verified the shape."
    ]
)
```

This enables **interactive investigation** — an evaluator can drill into suspicious moments flagged by the initial 5-pass pipeline without re-ingesting 57K tokens.

### Mixed-Mode Processing

The API supports configuring processing behavior **independently for each media item** in the same request. This is powerful for comparative analysis — for example, comparing a long reference recording against a short query clip:

```python
# Mixed-mode: agentic for long video, static for short clip
interaction = client.interactions.create(
    model="gemini-3.8-flash",
    input=[
        {"type": "video", "uri": full_session.uri, "processing": "agentic"},
        {"type": "video", "uri": highlight_clip.uri, "processing": "static"},
        {"type": "text", "text": "Find where in the full session this highlight occurred."},
    ],
)
```

For Proof of Work, mixed-mode could enable comparing a candidate's current submission against a reference solution recording — agentically navigating the candidate video while statically analyzing the known-good reference.

### Token Billing & Cost Optimization

Agentic mode fundamentally changes the billing model:

- **Video input tokens**: You are billed only for **media tokens materialized during execution** — the lightweight initial reference plus any frame slices and audio segments the model explicitly retrieved. Unwatched segments cost nothing.
- **Thinking & output tokens**: Model reasoning steps and tool calls are billed at standard output/thinking rates.
- **Context caching**: Videos loaded across multi-turn sessions trigger standard implicit caching and support [explicit cache instances](https://ai.google.dev/gemini-api/docs/caching).
- **Batch API**: Agentic video processing works with the [Gemini Batch API](https://ai.google.dev/gemini-api/docs/batch-api) at **50% of standard cost** — making large-scale evaluation (e.g., grading an entire class of 50 screen recordings) economically viable.

For Proof of Work's 5-pass pipeline on a 31-minute video, total cost was ~$0.011 — meaning you could evaluate **~90 student submissions for $1**.

---

## 3. System Architecture: Decomposed Multi-Pass Pipeline

A key design challenge in evaluating open-ended workflows is avoiding **attention overload**. Asking a single prompt to simultaneously judge architecture decisions, syntax errors, copy-paste habits, code quality, and time management inevitably produces shallow, unreliable output.

Proof of Work solves this by running a **5-pass pipeline** where each pass focuses on one dimension:

```
                       ┌─────────────────────────────────┐
                       │     Screen Recording Stream     │
                       │  (Local / YouTube Stream URI)   │
                       └────────────────┬────────────────┘
                                        │
      ┌──────────────────┬──────────────┼──────────────┬──────────────────┐
      ▼                  ▼              ▼              ▼                  ▼
┌───────────┐      ┌───────────┐  ┌───────────┐  ┌───────────┐      ┌───────────┐
│  Pass 1   │      │  Pass 2   │  │  Pass 3   │  │  Pass 4   │      │  Pass 5   │
│ Timeline  │      │ Debugging │  │ Resource  │  │ Code Qual │      │ Synthesis │
│  Topology │      │ Dynamics  │  │  Veracity │  │ Iteration │      │ Scorecard │
└─────┬─────┘      └─────┬─────┘  └─────┬─────┘  └─────┬─────┘      └─────┬─────┘
      │                  │              │              │                  │
      └──────────────────┴──────────────┼──────────────┴──────────────────┘
                                        │
                                        ▼
                       ┌─────────────────────────────────┐
                       │   Calibrated Process Scorecard  │
                       │  (JSON / Multi-Dim Telemetry)   │
                       └─────────────────────────────────┘
```

### What Each Pass Does

1. **Pass 1: Timeline & Phase Detection (25%)**
   - Maps the workflow into phases: *Understanding the Problem*, *Planning*, *Building*, *Debugging*, *Testing*, *Refactoring*.
   - Checks whether planning happened before coding started.

2. **Pass 2: Debugging Behavior (25%)**
   - Finds all runtime errors (CUDA OOMs, shape mismatches, etc.).
   - Grades the response: methodical root-cause analysis vs. random trial-and-error.

3. **Pass 3: Resource Usage & Attribution (20%)**
   - Tracks browser switches, documentation lookups, and AI copilot interactions.
   - Assesses whether external code was understood and adapted, or blindly pasted.

4. **Pass 4: Code Evolution & Iteration (15%)**
   - Measures how code quality improves over time.
   - Tracks testing frequency, naming conventions, and dead-code cleanup.

5. **Pass 5: Final Scorecard (15%)**
   - Combines evidence from all passes into a scored rubric with timestamp citations.

---

## 4. Empirical Evaluation: Real-World Case Study Telemetry

The pipeline was tested on a real, unscripted [31-minute PyTorch CNN lecture and demo session](https://www.youtube.com/watch?v=3zT_QtIupkE) using `gemini-3.7-flash` with `media_processing="AGENTIC"`. Here's the actual output:

### Synthesized Multi-Dimensional Scorecard

| Evaluation Dimension | Weight | Score | Rating | Primary Behavioral Observation |
| :--- | :---: | :---: | :---: | :--- |
| **Approach Strategy** | $25\%$ | **10** / 10 | `Exceptional` | Comprehensive, step-by-step conceptual walkthrough covering CNN architecture, convolution operations, ReLU, max pooling, flattening, and dense layers with extensive visual diagrams and manual calculations (00:00–26:25). |
| **Debugging Maturity** | $25\%$ | **9** / 10 | `Expert` | Seamless execution of code demos and parameter adjustments without runtime errors; tensor dimensions and activations clearly verified at each stage (26:25–30:17). |
| **Resource Usage** | $20\%$ | **10** / 10 | `Original Work` | Self-contained local JupyterLab environment executed without copying external code, consulting search engines, or using AI assistance (26:24–30:17). |
| **Code Iteration** | $15\%$ | **8** / 10 | `Strong` | Iteratively altered kernel sizes (3×3 to 4×4) and strides (1, 2, 3, 4) in nn.Conv2d layers to demonstrate dimension changes and feature map loss (28:32–30:16). |
| **Time Management** | $15\%$ | **9** / 10 | `Well-Balanced` | Dedicated ~85% to thorough foundational concepts across balanced sub-topics and ~15% to practical implementation and parameter tuning. |
| **Aggregate Index** | **$100\%$** | **9.2** / 10 | **`VERIFIED`** | **Verified Original Process.** |

### Timestamped Phase Detection (Pass 1 Output)

The agentic model autonomously identified six distinct phases by navigating the video timeline:

```json
[
  {
    "phase": "Introduction & ANN vs. CNN Comparison",
    "start": "00:00", "end": "06:05", "time_pct": 20,
    "description": "Introduces CNNs, explains ANN limitations with image data (high parameter count, loss of spatial structure), and overviews CNN building blocks."
  },
  {
    "phase": "Convolutional Layer & Feature Extraction",
    "start": "06:05", "end": "15:05", "time_pct": 29,
    "description": "Explains biological vision analogy, feature detectors/kernels, sliding window convolution step-by-step with pixel matrix calculations, and generating feature maps."
  },
  {
    "phase": "Activation Function (ReLU)",
    "start": "15:05", "end": "18:00", "time_pct": 9,
    "description": "Details how ReLU zeroes out negative values, introduces non-linearity, and highlights active feature patterns."
  },
  {
    "phase": "Pooling Layer (Max Pooling)",
    "start": "18:00", "end": "22:20", "time_pct": 14,
    "description": "Explains spatial dimensionality reduction via max pooling, stride mechanics, and preserving dominant features while decreasing computation."
  },
  {
    "phase": "Fully Connected & Output Layers",
    "start": "22:20", "end": "26:20", "time_pct": 13,
    "description": "Covers flattening pooled feature maps into 1D vectors, feeding into dense layers, and using softmax for class probability predictions."
  },
  {
    "phase": "Code Demo & Parameter Experimentation",
    "start": "26:20", "end": "30:55", "time_pct": 15,
    "description": "Demonstrates Python implementation showing image transformation through CNN layers; experiments with kernel sizes and strides."
  }
]
```

### Debugging Analysis (Pass 2 Output)

```json
{
  "issues": [],
  "overall_maturity": "Expert",
  "evidence": "No bugs, syntax errors, runtime exceptions, or unexpected behaviors occurred.
               The presenter delivers a structured lecture and successfully runs pre-written
               demonstration code without any technical issues."
}
```

Notably, the agentic model correctly identified that this was a **teaching session** with pre-written code — not a live debugging session — and rated debugging maturity as "Expert" based on the absence of errors and the structured demonstration approach, rather than fabricating nonexistent bug events.

### Resource Usage & Originality (Pass 3 Output)

The model traced resource usage across the entire session:

- **00:00–26:22**: Lecture delivery using custom slides and screen annotations — no external websites or AI tools consulted.
- **26:23–30:17**: PyTorch feature visualization in local JupyterLab (`image-classification.ipynb`), manually adjusting layer parameters without external code sources.
- **Verdict**: `Original Work` — zero copy-paste from external sources detected.

### Code Quality Evidence (Pass 4 Output)

The model identified iterative parameter experimentation as the primary code evolution pattern:

- **26:24–27:03**: Walkthrough of clean baseline script with CNN layers, shape printouts, and visualization logic.
- **27:04–28:28**: Initial execution verifying feature map extraction and pooling visually.
- **28:33–29:22**: Iterative testing — kernel_size=3, stride=3 — analyzing reduced spatial resolution.
- **29:38–30:15**: Extreme parameter testing (stride=4, kernel_size=4), inspecting feature degradation.

### Time Distribution (Measured)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  [00:00 - 06:05] Introduction & ANN vs. CNN Comparison (20%)                           │
│  ██████████                                                                            │
│  [06:05 - 15:05] Convolutional Layer & Feature Extraction (29%)                        │
│  ██████████████                                                                        │
│  [15:05 - 18:00] Activation Function — ReLU (9%)                                       │
│  █████                                                                                 │
│  [18:00 - 22:20] Pooling Layer — Max Pooling (14%)                                     │
│  ███████                                                                               │
│  [22:20 - 26:20] Fully Connected & Output Layers (13%)                                 │
│  ██████                                                                                │
│  [26:20 - 30:55] Code Demo & Parameter Experimentation (15%)                           │
│  ████████                                                                              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Prompt Engineering: Enforcing Behavioral Specificity

To reduce subjective variation between evaluations, each pass uses carefully structured prompts with explicit rubric scales and required failure modes.

Below is an excerpt from the **Debugging Maturity** pass configuration:

```python
DEBUGGING_PASS_PROMPT = """
You are an expert computational educator analyzing a candidate's developer screen recording.
Isolate ONLY moments where runtime errors, syntax bugs, or unexpected system states occur.

For each distinct fault event:
1. Timestamp of fault detection.
2. Root cause identification.
3. Candidate behavioral response trajectory:
   - Exception Trapping: Did they inspect the call stack / error message systematically?
   - Hypothesis Formulation: Did they isolate state via logging (print, console.log, debugger)?
   - Search Specificity: Was documentation search targeted or stochastic?
   - Mutation Restraint: Did they execute structured delta changes or indiscriminate edits?
4. Recovery Duration: Time elapsed from error detection to passing test.

Categorical Scale:
- Expert: Deterministic root-cause isolation; minimal mutation entropy.
- Proficient: Methodical stack analysis; rapid recovery with targeted search.
- Developing: Partially structured debugging; occasional random parameter edits.
- Novice: Stochastic permutation; repeated blind prompting without stack inspection.

Output MUST cite precise temporal intervals ([MM:SS]).
"""
```

---

## 6. Antigravity Agent Skill Integration

To bring this pipeline into active developer and educator workflows, Proof of Work is packaged as a native **Google Antigravity Agent Skill** under [`.agents/skills/proof_of_work/`](./.agents/skills/proof_of_work/):

```
.agents/skills/proof_of_work/
├── SKILL.md                 # YAML frontmatter metadata, activation triggers & instructions
├── scripts/
│   └── analyze_video.py     # Standalone CLI runner with uv PEP 723 dependency isolation
└── references/
    └── analysis_passes.md   # Grounded rubric specifications & pass definitions
```

### Autonomous Discovery in Antigravity IDE

When placed in the workspace customization root (`.agents/skills/`), the Google Antigravity IDE and `agy` CLI automatically discover and register the skill. You can trigger the verification pipeline using conversational agent prompts:

> *"Evaluate this applicant's problem-solving process from their screen recording and generate a calibrated Process Scorecard: https://www.youtube.com/watch?v=3zT_QtIupkE"*

> *"Run a debugging analysis pass on recording.mp4 to inspect how they isolated tensor dimension errors."*

The agent automatically installs dependencies via `uv`, checks for API credentials, runs all 5 passes, and renders the scorecard.

### Standalone CLI Execution via `uv`

The skill includes a CLI script (`scripts/analyze_video.py`) you can run directly from the terminal without an IDE:

```bash
# Full 5-pass analysis (auto-installs isolated dependencies via uv)
uv run .agents/skills/proof_of_work/scripts/analyze_video.py \
  --video "https://www.youtube.com/watch?v=3zT_QtIupkE"

# Focused analysis on specific passes with JSON output
uv run .agents/skills/proof_of_work/scripts/analyze_video.py \
  --video "candidate_session.mp4" \
  --passes debugging_analysis scorecard \
  --json \
  --output scorecard.json
```

### Example: Agent Session Transcript

Here's what a real Antigravity IDE session looks like when invoking the skill conversationally:

```
💬 User:
  "Analyze this student's problem-solving process and generate a scorecard:
   https://www.youtube.com/watch?v=3zT_QtIupkE"

🤖 Agent:
  → Skill matched: proof-of-work-video-analysis
  → Reading SKILL.md for activation instructions...
  → Checking for GEMINI_API_KEY... ✓ Found
  → Installing dependencies via uv... ✓ google-genai, pydantic
  → Executing: analyze_video.py --video "https://youtube.com/watch?v=3zT_QtIupkE"

  ┌──────────────────────────────────────────────────┐
  │ Pass 1/5: Process Timeline & Phases              │
  │ ━━━━━━━━━━━━━━━━━━━━ 100%  13,107 tokens         │
  │ Pass 2/5: Debugging & Error Handling             │
  │ ━━━━━━━━━━━━━━━━━━━━ 100%   1,053 tokens         │
  │ Pass 3/5: Resource Usage & Originality           │
  │ ━━━━━━━━━━━━━━━━━━━━ 100%  23,501 tokens         │
  │ Pass 4/5: Code Quality & Iteration               │
  │ ━━━━━━━━━━━━━━━━━━━━ 100%  10,917 tokens         │
  │ Pass 5/5: Final Scorecard (evidence-chained)     │
  │ ━━━━━━━━━━━━━━━━━━━━ 100%   2,322 tokens         │
  └──────────────────────────────────────────────────┘

  ╔══════════════════════════════════════════════════╗
  ║         CALIBRATED PROCESS SCORECARD             ║
  ╠══════════════════════════════════════════════════╣
  ║ Overall Score: 9.2 / 10                          ║
  ║ Verdict: VERIFIED ORIGINAL PROCESS               ║
  ║                                                  ║
  ║ Approach Strategy .... 10/10 ██████████          ║
  ║ Debugging Maturity ... 9/10  █████████░          ║
  ║ Resource Usage ....... 10/10 ██████████          ║
  ║ Code Iteration ....... 8/10  ████████░░          ║
  ║ Time Management ...... 9/10  █████████░          ║
  ║                                                  ║
  ║ Total: 50,900 tokens | 5 passes                  ║
  ║ Cost: ~$0.011 | Duration: 36 seconds             ║
  ╚══════════════════════════════════════════════════╝

  Key Strengths:
  • Structured progression from theory → implementation
  • Original work — zero external copy-paste detected
  • Iterative parameter experimentation with visual verification

  ✔ Scorecard saved to: ./scorecard.json
```

The agent reads the skill's `SKILL.md` for activation instructions, resolves dependencies, runs the full pipeline, and renders a formatted scorecard — all from a single natural-language prompt.

---

## 7. Beyond Assessment: Implications for Technical Evaluation

While initially designed for education, the ability to analyze how someone solves problems has broader applications:

1. **Take-Home Challenge Verification**: Replace timed algorithm puzzles with screen-recorded take-homes. Evaluate how candidates navigate ambiguity, not just whether they get the right answer.
2. **AI-Assisted Engineering Audits**: Measure whether developers are effectively steering AI tools or blindly accepting suggestions without review.
3. **Continuous Skill Development**: Track junior engineers over 90-day intervals to quantify improvements in debugging speed and architectural thinking.

---

## 8. Frequently Asked Questions (FAQ)

Following the announcement of Gemini's agentic video understanding, developers have raised sharp architectural questions about how this compares to traditional video processing scripts and shell-based agents. Here are the core questions answered:

### Q1: "Why not just let an agent tool-call FFmpeg in a shell with scene detection? Agents have been doing that for ages."

**Tool-calling FFmpeg is trivial; the reasoning behind *what* to extract, *when*, and *why* is the entire problem.**

A static shell script or fixed scene-detector (e.g., `ffmpeg -filter:v "select='gt(scene,0.4)'"`) operates purely on low-level pixel delta thresholds:
- **Redundant Splitting**: If an instructor presents a 15-minute conceptual slide deck with subtle transition animations, scene detection generates dozens of redundant keyframe splits, cluttering the context window.
- **Blindness to Micro-Edits**: In technical problem-solving, a critical 5-minute debugging moment might take place entirely inside a single terminal window or code editor cell where only a line of text changes (e.g., modifying `kernel_size=(3,3)` to `kernel_size=(4,4)`). The scene-change score is near zero, causing static detectors to miss the actual breakthrough.
- **Unwieldy Decision Trees**: Hardcoding heuristic pipelines works for narrow, single-domain workflows (e.g., sports highlights), but collapses under arbitrary open-ended developer prompts.

Agentic video understanding moves the decision loop inside the multimodal model. Gemini autonomously decides which timestamps matter, when audio/transcript guidance is sufficient, when high FPS (5–10 FPS) is required for fast-moving terminal output, and how to iteratively refine temporal context without external bash scripts.

---

### Q2: "If there is already a timestamped audio transcript, isn't video analysis straightforward anyway?"

**Transcripts only capture *what was verbalized*, not *what actually happened on screen*.**

In engineering and coding practicums, spoken words routinely diverge from visual actions:
1. **Silent Problem-Solving**: An engineer or student encountering a fatal segmentation fault or CUDA out-of-memory error often goes completely silent for 3 to 5 minutes. The transcript has an empty void, yet on-screen they are reading stack traces, inspecting memory profilers, and systematically isolating bugs.
2. **Speech-Action Dissonance**: A candidate may verbally narrate an algorithm while silently copy-pasting an unverified implementation from an external tab, or conversely, say *"let's adjust the stride"* while actually debugging an unrelated PyTorch import error.
3. **Visual Mathematical Grounding**: Hand-drawn dimensional matrices, whiteboard diagrams, and tensor flowcharts contain zero phonemes.

Agentic video understanding uses **transcript-first multimodal routing**: it reads the low-cost audio transcript as a high-level index to establish conceptual phase boundaries, and then triggers targeted, high-resolution visual inspection precisely where speech is absent, contradictory, or requires empirical verification.

---

### Q3: "Can it skip irrelevant sections (like sponsor segments, idle waiting, or static slides) without burning tokens?"

**Yes.** In traditional static video ingestion (1 FPS), a 2-minute sponsor break or 5 minutes of idle reading consumes ~30,000+ visual tokens because every second is blindly tiled and encoded into the context window regardless of relevance.

In agentic video understanding:
- During the initial transcript and audio pass, the model recognizes that the content of those timestamps is irrelevant to the evaluation prompt (e.g., *"Evaluate PyTorch parameter sweeps and tensor dimension reasoning"*).
- The model **never issues a frame extraction call** for that time window.
- The visual frames for the sponsor segment or idle wait are never decoded, never tokenized, and never billed.

---

### Q4: "Why was 1 FPS frame-by-frame processing considered 'setting money on fire'?"

At a naive 1 FPS ingestion rate:
- A 31-minute session generates **1,860 visual frames**.
- At ~258 tokens per frame plus ~32 audio tokens/sec, a single multimodal pass consumes **~540,000 tokens**.
- Running a calibrated 5-pass evaluation pipeline (Timeline → Debugging → Originality → Code Iteration → Final Scorecard) over raw 1 FPS frames consumes over **2.7 million tokens**, costing $0.40–$1.50+ per single student evaluation.
- Worse, 90% of those 1,860 frames are near-identical static editor views, diluting the model's attention.

With Gemini's agentic video understanding, our 5-pass pipeline consumed **50,900 tokens total** — costing **~$0.011** (a **98.1% token and cost reduction**). Evaluating an entire university cohort of 100 students drops from ~$150 down to ~$1.10.

---

### Q5: "How does this compare to stitching multiple downsampled frames into a mosaic grid/contact sheet?"

Packing multiple downscaled frames into a single mosaic image grid (contact sheet) is a common developer workaround to bypass video APIs. However:
1. **Resolution Destruction**: Compressing 16 or 36 frames into one canvas destroys fine text legibility (terminal error logs, code line numbers, variable names).
2. **Loss of Temporal Sequence**: The model loses native temporal continuity and motion flow.
3. **Fixed Windowing**: You still have to hardcode which frames get packed into the mosaic ahead of time.

Gemini's agentic video understanding operates directly on the native video stream via `media_processing="AGENTIC"`. The model requests full-resolution temporal snippets on demand without spatial downscaling or mosaic artifacts.

---

## 9. Open-Source Implementation & Getting Started

The complete implementation — including the Python CLI engine, Vite-powered interactive simulation frontend, and Antigravity Agent Skill — is open-source. **GitHub Repository**: [github.com/jigyasa-grover/proof-of-work](https://github.com/jigyasa-grover/proof-of-work)

```bash
# Clone the repository
git clone https://github.com/jigyasa-grover/proof-of-work.git
cd proof-of-work

# Run the interactive dashboard locally
npm install && npm run dev

# Execute the CLI pipeline with uv (zero manual installation required)
export GEMINI_API_KEY="your-api-key"
uv run proof_of_work_demo.py --video "https://youtube.com/watch?v=YOUR_VIDEO"
```
