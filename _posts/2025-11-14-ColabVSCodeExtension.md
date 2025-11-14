---
layout: post
type: blog
title: Supercharging VS Code Vibe Coding with Gemini Code Assist +*new* Google Colab Extension 🔋
comments: true
mathjax: true
---

<p>If you write Python for data, ML, generative art, or heavy compute, you know the bottlenecks: your local machine slows down, GPUs cost money, and environments get messy. Now, with <strong>Google’s newly launched Colab extension for VS Code</strong>, you can run notebooks with <strong>cloud GPUs and TPUs directly inside your favorite editor</strong>, all while keeping your workflow modular, version-controlled, and lightning fast.</p>

<p>And for a bit of fun, add <strong>Gemini Code Assist</strong>, an AI‑powered coding buddy, and you get the ultimate combo: your code executes on a Colab GPU while Gemini suggests optimizations, helper functions, or creative tweaks - letting you focus on experimentation, not environment setup!</p>

<figure class="wp-block-image size-large"><a href="https://jigyasagrover.wordpress.com/wp-content/uploads/2025/11/supercharging-vs-code-vibe-coding-with-gemini-code-assist-new-google-colab-extension-2.png"><img src="https://jigyasagrover.wordpress.com/wp-content/uploads/2025/11/supercharging-vs-code-vibe-coding-with-gemini-code-assist-new-google-colab-extension-2.png?w=1024" alt="" class="wp-image-3617"/></a></figure>

<p><br>Let’s see why the <a href="https://developers.googleblog.com/en/google-colab-is-coming-to-vs-code/">Colab extension for VS Code</a> matters, how to install and use it, the real advantages (and caveats), and how I used it - with a sprinkle of AI creativity thanks to Gemini.</p>

<h2 class="wp-block-heading">Why use the Colab VS&nbsp;Code extension?</h2>

<p><strong>Free cloud GPUs + familiar editor.</strong>  Colab has long been a go-to for free GPU/TPU access. The new <a href="https://developers.googleblog.com/en/google-colab-is-coming-to-vs-code/">VS Code extension</a> brings that compute directly into your IDE:</p>
<li>Execute heavy code on Colab while your laptop stays snappy</li>
<li>Switch seamlessly between <code>.ipynb</code> notebooks and <code>.py</code> modules</li>
<li>Choose GPU or TPU runtimes via your Google account</li>
<p>No more juggling browser notebooks and local scripts - everything runs in one familiar, powerful environment.</p>

<p><strong>Full IDE environment.</strong> <a href="https://developers.googleblog.com/en/google-colab-is-coming-to-vs-code/">VS Code + Colab</a> combines the best of exploration and software engineering:</p>
<li>Modular project structure: multiple <code>.py</code> modules alongside notebooks</li>
<li>Debugging, linting, IntelliSense, Git integration, and branching</li>
<li>Clean workflow for experiments, visualizations, and reproducible ML pipelines</li>
<p>This setup turns notebooks into maintainable, production-ready projects without losing the flexibility of Colab.</p>

<figure class="wp-block-image size-large"><a href="https://jigyasagrover.wordpress.com/wp-content/uploads/2025/11/colab-hearts-vsc2x.original.png"><img src="https://jigyasagrover.wordpress.com/wp-content/uploads/2025/11/colab-hearts-vsc2x.original.png?w=640" alt="" class="wp-image-3619"/></a></figure>

<h2 class="wp-block-heading">Installing + Using Colab VS Code Extension</h2>
<li><strong>Install VS Code</strong> (if not already) on your local machine.</li>
<li><strong>Install the Jupyter extension</strong> (Microsoft) in VS Code - this gives notebook support inside VS Code.</li>
<li><strong>Install the Colab extension</strong>.</li>
<li><strong>Open or create a <code>.ipynb</code> Notebook</strong> file in VS Code.</li>
<li><strong>Connect to Colab runtime</strong>:</li>
<li>In VS Code’s notebook interface, select kernel → “Colab” or equivalent → “New Colab Server” (or via the tunnel library you set up).</li>
<li>Sign in with your Google account when prompted and select a GPU runtime (e.g., T4).</li>
<li><strong>Run your cells or script</strong> - code executes on the remote Colab VM with GPU acceleration, while results and outputs show in VS Code.</li>
<li><strong>For subsequent sessions</strong>, you can often just select kernel → “Colab Auto‑Connect” (or reconnect via your tunnel) to resume quickly.</li>

{% raw %}
<video controls width="750%" preload="metadata">
<source src="https://storage.googleapis.com/gweb-developer-goog-blog-assets/original_videos/Copy_of_Colab_VS_Code_Extension_Demo_compressed.mp4" type="video/mp4">
</video>
{% endraw %}

<!-- <figure class="wp-block-image size-large"><a href="https://jigyasagrover.wordpress.com/wp-content/uploads/2025/11/screenshot-2025-11-09-at-7.47.13-am.png"><img src="https://jigyasagrover.wordpress.com/wp-content/uploads/2025/11/screenshot-2025-11-09-at-7.47.13-am.png?w=1024" alt="" class="wp-image-3596"/></a></figure>
<p>💡 <em>Pro Tip:</em> Colab VMs stay alive only while active or within ~1 hour of inactivity. Total session lifetimes vary by machine type, so for long-running experiments, you may need to reconnect.</p> -->

<h2 class="wp-block-heading">Real Advantages - and what this DOES for you!</h2>
<p>Here’s what you gain from using <strong>VS Code + Colab extension + Gemini Code Assist</strong>, beyond just faster compute:</p>
<li><strong>Massive step‑up in compute capability:</strong> Run large grid simulations, deep learning experiments, and generative visuals without being limited by your local GPU or RAM. Cloud GPUs let you scale effortlessly.</li>
<li><strong>Developer-friendly workflow:</strong> Use VS Code’s debugger, modules, linting, and Git integration. No more juggling separate browser windows, notebooks, and editors - everything stays in your familiar IDE.</li>
<li><strong>AI-assisted coding fun:</strong> Gemini Code Assist can generate code snippets, suggest alternative implementations, propose helper functions, or even propose creative visual tweaks, all while your GPU crunches numbers. It’s like having a playful coding sidekick.</li>
<li><strong>Clean project structure:</strong> Separate preprocessing, model code, visualization modules, tests, and notebooks - you’re not forced into a single notebook paradigm. This makes your project more maintainable and reproducible.</li>
<li><strong>Iteration speed:</strong> Remote compute plus AI-assisted code suggestions allow you to experiment, tweak parameters, and explore ideas faster than ever.</li>
<li><strong>Cost and access:</strong> Free GPU access is available with Colab, and paid tiers (Colab Pro/Pro+) give even more compute power at a fraction of cloud provider costs.</li>
<li><strong>Collaboration and sharing:</strong> Notebooks and scripts remain in <code>.ipynb</code> or <code>.py</code> format, making it easy to push to GitHub, share with colleagues, or switch between local and remote runtimes seamlessly.</li>

<h2 class="wp-block-heading">Quick Show &amp; Tell </h2>
<p>To showcase the power of <strong>VS Code + Colab extension + GPU compute</strong>, I <em>*vibe-coded*</em> a <strong>Zen Garden </strong>generative visualization and benchmarking demo:</p>
<li><code>zen_garden(vibe, ax)</code> draws pastel, flowing vector‑field streamplots inspired by vibes like “tranquil stream”, “stormy sea”, “neon city dream”.</li>
<li>CPU (NumPy) vs GPU (CuPy) on a 2048×2048 grid for 100 frames executed on the remote Colab GPU.</li>
<li>Result - Dramatic speed‑up! Your GPU computes the animation in seconds; the CPU takes tens of seconds.</li>
<li>Gemini Code Assist contributed visualization tweaks, helper functions, alternative flow parameters -making creative experimentation faster and more fun.</li>
<p><strong>Outcome:</strong> Rapid experimentation and creative exploration without bogging down your laptop 🎨</p>

<pre class="wp-block-code" style="font-size:8px"><code>import matplotlib.pyplot as plt
import numpy as np

def zen_garden(vibe: str, ax):
    """
    Generates an abstract visual with a consistent pastel aesthetic on a given axis.
    This version uses a streamplot for flowing, organic lines.

    Args:
        vibe (str): A short text prompt to inspire the visual's flow and density.
        ax: A matplotlib axes object on which to draw the plot.
    """
    # --- Setup and Seeding ---
    # Use a light, pastel background for a softer, more pleasing look.
    ax.set_facecolor('#F0F8FF') 
    ax.axis('off')
    seed = sum(ord(c) for c in vibe)
    np.random.seed(seed)

    # --- Grid ---
    n_points = 100
    x = np.linspace(-3, 3, n_points)
    y = np.linspace(-3, 3, n_points)
    X, Y = np.meshgrid(x, y)

    # --- Vibe Interpretation ---
    # The colormap is now consistently pastel, but flow characteristics still adapt to the vibe.
    cmap = 'GnBu' # A beautiful Green-Blue pastel colormap.
    density = 1.5
    lw_factor = 1.0

    if 'stormy' in vibe or 'sea' in vibe:
        density = 2.5
        lw_factor = 1.5
        freq1, freq2 = np.random.uniform(2.0, 4.0), np.random.uniform(2.0, 4.0)
        amp1, amp2 = np.random.uniform(1.5, 2.5), np.random.uniform(1.5, 2.5)
    elif 'neon' in vibe or 'city' in vibe:
        cmap = 'cool' # 'cool' has a pastel feel suitable for a 'neon dream'.
        density = 2.0
        lw_factor = 0.8
        freq1, freq2 = np.random.uniform(1, 3), np.random.uniform(1, 3)
        amp1, amp2 = np.random.uniform(1, 2), np.random.uniform(1, 2)
    else: # Default for "tranquil mountain stream" and other gentle vibes.
        freq1, freq2 = np.random.uniform(0.5, 1.0), np.random.uniform(0.5, 1.0)
        amp1, amp2 = np.random.uniform(0.8, 1.2), np.random.uniform(0.8, 1.2)

    # --- Generate Vector Field ---
    U = amp1 * np.sin(freq1 * Y) + amp2 * np.cos(freq2 * X)
    V = amp1 * np.cos(freq1 * X) - amp2 * np.sin(freq2 * Y)

    # --- Render the Visual ---
    speed = np.sqrt(U**2 + V**2)
    linewidth = 0.5 + (speed / speed.max()) * 2.5 * lw_factor
    
    ax.streamplot(X, Y, U, V, color=speed, cmap=cmap,
                  linewidth=linewidth, density=density, arrowstyle='-')

    ax.set_xlim(-3, 3)
    ax.set_ylim(-3, 3)
    ax.set_aspect('equal')


# --- Generate three Zen Gardens side-by-side for comparison ---
vibes_to_compare = &#91;"tranquil mountain stream", "stormy sea", "neon city dream"]

# Create a figure with a light pastel background to match the plots.
fig, axes = plt.subplots(1, 3, figsize=(18, 6), facecolor='#F0F8FF')

print("Generating comparison plot with updated pastel theme...")

for ax, vibe in zip(axes, vibes_to_compare):
    # Call the new pastel-themed function.
    zen_garden(vibe, ax)
    # Use a dark color for the title to ensure it's readable on the light background.
    ax.set_title(f'"{vibe}"', color='#333333', fontsize=14, pad=15)

# Add a main title for the entire figure for better context.
fig.suptitle("Zen Garden Vibe Comparison", fontsize=20, color='#333333', y=1.02)

plt.tight_layout()
plt.show()</code></pre>

<figure class="wp-block-image size-large"><a href="https://jigyasagrover.wordpress.com/wp-content/uploads/2025/11/image.png"><img src="https://jigyasagrover.wordpress.com/wp-content/uploads/2025/11/image.png?w=1024" alt="" class="wp-image-3604"/></a></figure>

<pre class="wp-block-code" style="font-size:8px"><code>import time
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from IPython.display import HTML, display

# --- GPU Availability Check ---
try:
    import cupy as cp
    CUPY_AVAILABLE = True
    print("CuPy found. GPU acceleration is available.")
except ImportError:
    CUPY_AVAILABLE = False
    print("CuPy not found. Running on CPU only.")

def compute_stream_animation_data(xp, grid_size: int, num_frames: int, vibe: str) -&gt; list:
    """
    Computes the vector field data (U, V) for each frame of a streamplot animation.
    This is the core computational function designed for benchmarking.

    Args:
        xp: The array library to use (numpy or cupy).
        grid_size (int): The resolution of the vector field grid.
        num_frames (int): The number of frames to compute.
        vibe (str): A string to influence the flow characteristics.

    Returns:
        A list of tuples, where each tuple contains the (U, V) vector fields for a frame.
        The fields reside on the device (CPU or GPU) where `xp` operates.
    """
    # --- Setup and Seeding ---
    seed = sum(ord(c) for c in vibe)
    # Use NumPy for seeding to ensure flow parameters are identical for both CPU and GPU runs
    np.random.seed(seed)
    
    # --- Grid Creation ---
    x = xp.linspace(-3, 3, grid_size, dtype=xp.float32)
    y = xp.linspace(-3, 3, grid_size, dtype=xp.float32)
    X, Y = xp.meshgrid(x, y)

    # --- Vibe Interpretation (Flow Parameters) ---
    time_factor = 0.05 # Controls the speed of the animation
    if 'stormy' in vibe:
        time_factor = 0.1
        freq1, freq2 = np.random.uniform(2.0, 4.0), np.random.uniform(2.0, 4.0)
        amp1, amp2 = np.random.uniform(1.5, 2.5), np.random.uniform(1.5, 2.5)
    else: # Default for tranquil vibes
        freq1, freq2 = np.random.uniform(0.5, 1.0), np.random.uniform(0.5, 1.0)
        amp1, amp2 = np.random.uniform(0.8, 1.2), np.random.uniform(0.8, 1.2)

    frame_data = &#91;]
    # --- Heavy Computation Loop ---
    for i in range(num_frames):
        # Evolve time with a sine wave for a smooth, looping animation
        t = time_factor * np.sin(2 * np.pi * i / num_frames)
        
        # Calculate the vector fields U and V for the current time 't'
        U = amp1 * xp.sin(freq1 * Y + t) + amp2 * xp.cos(freq2 * X + t)
        V = amp1 * xp.cos(freq1 * X + t) - amp2 * xp.sin(freq2 * Y + t)
        
        frame_data.append((U, V))
        
    return frame_data

def run_stream_benchmark(xp, title: str, **kwargs) -&gt; tuple&#91;list, float]:
    """
    Executes the vector field computation and measures its runtime.

    Args:
        xp: The array library (numpy or cupy).
        title (str): A descriptive title for the benchmark run.
        **kwargs: Keyword arguments for the `compute_stream_animation_data` function.

    Returns:
        A tuple containing the list of computed (U, V) data (on the CPU) and the runtime.
    """
    print(f"\nComputing vector fields for '{title}'...")
    start_time = time.perf_counter()

    # Run the core computation
    device_data = compute_stream_animation_data(xp, **kwargs)
    
    # Ensure all GPU computations are finished before stopping the timer
    if xp == cp:
        cp.cuda.Stream.null.synchronize()
        
    end_time = time.perf_counter()
    runtime = end_time - start_time
    print(f"Computation for '{title}' took {runtime:.4f} seconds.")

    # Transfer data to CPU for Matplotlib if it was computed on GPU
    if xp == cp:
        cpu_data = &#91;(U.get(), V.get()) for U, V in device_data]
    else:
        cpu_data = device_data
        
    return cpu_data, runtime

def create_stream_animation(cpu_data: list, gpu_data: list, cpu_time: float, gpu_time: float):
    """
    Creates and displays a side-by-side animation from pre-computed streamplot data.
    """
    fig, (ax_cpu, ax_gpu) = plt.subplots(1, 2, figsize=(16, 8))
    fig.set_facecolor('#F0F8FF') # Light pastel background

    # Common streamplot parameters
    grid_extents = &#91;-3, 3, -3, 3]
    x = np.linspace(grid_extents&#91;0], grid_extents&#91;1], cpu_data&#91;0]&#91;0].shape&#91;0])
    y = np.linspace(grid_extents&#91;2], grid_extents&#91;3], cpu_data&#91;0]&#91;0].shape&#91;1])
    
    # --- Animation Update Function ---
    def update(frame_num):
        # Clear both axes for the new frame
        ax_cpu.clear()
        ax_gpu.clear()
        
        # Get the pre-computed data for this frame
        U_cpu, V_cpu = cpu_data&#91;frame_num]
        U_gpu, V_gpu = gpu_data&#91;frame_num]
        
        # Calculate speed for color mapping
        speed_cpu = np.sqrt(U_cpu**2 + V_cpu**2)
        speed_gpu = np.sqrt(U_gpu**2 + V_gpu**2)
        
        # Render CPU plot
        ax_cpu.set_facecolor('#F0F8FF')
        ax_cpu.streamplot(x, y, U_cpu, V_cpu, color=speed_cpu, cmap='GnBu', density=1.5, linewidth=1)
        ax_cpu.set_title(f'CPU (NumPy)\nCompute Time: {cpu_time:.2f}s', color='#333333')
        ax_cpu.axis('off')
        ax_cpu.set_aspect('equal')

        # Render GPU plot
        ax_gpu.set_facecolor('#F0F8FF')
        ax_gpu.streamplot(x, y, U_gpu, V_gpu, color=speed_gpu, cmap='GnBu', density=1.5, linewidth=1)
        ax_gpu.set_title(f'GPU (CuPy)\nCompute Time: {gpu_time:.2f}s', color='#333333')
        ax_gpu.axis('off')
        ax_gpu.set_aspect('equal')
        
        return fig,

    fig.suptitle("Animated Zen Garden Benchmark", fontsize=18, color='#333333')
    plt.tight_layout(rect=&#91;0, 0, 1, 0.96])

    # Create and display the animation
    ani = animation.FuncAnimation(fig, update, frames=len(cpu_data), interval=50, blit=False)
    plt.close(fig)
    display(HTML(ani.to_html5_video()))

# --- Main Execution and Benchmarking ---
if __name__ == "__main__":
    anim_params = {
        'grid_size': 2048,      # Grid resolution
        'num_frames': 100,     # Number of frames in the animation
        'vibe': "stormy sea"   # Vibe affects flow characteristics
    }

    # --- Run on CPU with NumPy ---
    cpu_data, cpu_time = run_stream_benchmark(np, "CPU (NumPy)", **anim_params)

    # --- Run on GPU with CuPy (if available) ---
    if CUPY_AVAILABLE:
        gpu_data, gpu_time = run_stream_benchmark(cp, "GPU (CuPy)", **anim_params)
        
        # --- Create Side-by-Side Animation ---
        create_stream_animation(cpu_data, gpu_data, cpu_time, gpu_time)
        
        # --- Performance Comparison ---
        if gpu_time &gt; 0:
            speedup = cpu_time / gpu_time
            print("\n--- Stream Animation Benchmark Summary ---")
            print(f"CPU Vector Field Computation: {cpu_time:.4f} seconds")
            print(f"GPU Vector Field Computation: {gpu_time:.4f} seconds")
            print(f"Speedup (Computation Only):   {speedup:.2f}x")
            print("\nNote: The benchmark measures only the vector field calculation.")
            print("The actual rendering with `streamplot` happens on the CPU for both versions.")
    else:
        print("\nGPU benchmark skipped as CuPy is not available.")</code></pre>

<figure class="wp-block-image size-large"><a href="https://jigyasagrover.wordpress.com/wp-content/uploads/2025/11/screenshot-2025-11-09-at-8.08.25-am.png"><img src="https://jigyasagrover.wordpress.com/wp-content/uploads/2025/11/screenshot-2025-11-09-at-8.08.25-am.png?w=1024" alt="" class="wp-image-3610"/></a></figure>

<pre class="wp-block-code" style="font-size:8px"><code>
--- Stream Animation Benchmark Summary ---
CPU Vector Field Computation: 32.2074 seconds
GPU Vector Field Computation: 0.5150 seconds
Speedup (Computation Only):   62.54x
Note: The benchmark measures only the vector field calculation.
The actual rendering with `streamplot` happens on the CPU for both versions.
</code></pre>

<h3 class="wp-block-heading">Beyond the demo: Other compelling workflows...</h3>
<p>The <strong>VS Code + Colab setup</strong> is versatile and extends well beyond generative visuals:</p>
<li><strong>Machine Learning &amp; Deep Learning:</strong> Train or fine-tune models on a GPU backend while writing modular, version-controlled code in VS Code.</li>
<li><strong>Data Science at scale:</strong> Process large datasets, run heavy simulations, and visualize results interactively.</li>
<li><strong>Collaborative or teaching workflows:</strong> Share reproducible workflows; students can connect to Colab via VS Code while instructors provide structured modules and notebooks.</li>
<li><strong>Rapid prototyping:</strong> Experiment with new algorithms, parameter sweeps, and visualization experiments. Remote GPU compute plus AI-assisted coding drastically shortens iteration times.</li>

<h2 class="wp-block-heading">Known Issues &amp; Caveats (<em>at the moment</em>)</h2>
<p>Every powerful workflow has trade‑offs; especially at launch time:</p>
<li>Session stability. Remote Colab VMs (and any tunnel connections) can disconnect after periods of inactivity and report “DISPOSED” notebook controllers.</li>
<li>Mounting Google Drive or certain dependencies may require extra setup when connected through VS Code.</li>
<li>Duplicate or “zombie” sessions. Signing out/reconnecting may leave orphaned resources.</li>
<li>Editor language‑server mismatch. Remote VM packages may not reflect locally; VS Code linting/IntelliSense may complain unless synced.</li>
<li>Free‑tier runtime limits. Colab free tier imposes idle timeouts, maximum session durations and GPU assignment policies.</li>
<li>Workflow complexity. Initial setup (kernel selection, tunnels) is slightly more intricate than pure browser Colab.</li>
<li>Large file transfers or I/O from local to remote VM may be slower than local execution.</li>

<h2 class="wp-block-heading">Final Thoughts</h2>
<p>The combination of <strong>VS Code + Colab extension + Gemini Code Assist</strong> creates a modern, powerful development workflow:</p>
<li>A familiar IDE workflow with extensions, debugger, Git integration</li>
<li>Cloud GPU/TPU horsepower for large-scale experiments</li>
<li>AI‑assisted coding for creativity and speed</li>
<li>Modular, version‑controlled projects for collaboration and reproducibility</li>

<br>
<p>Whether you’re a <strong>data scientist, ML researcher, or creative coder</strong>, this workflow removes bottlenecks, accelerates iteration, and makes experimentation effortless.</p>

<blockquote>
    Write code in VS Code.<br>
    Execute it in the cloud.<br>
    Scale your compute effortlessly.<br>
    Iterate faster.<br>
    And have a playful AI sidekick to inspire creativity along the way!
</blockquote>

<br><br>
<pre class="wp-block-preformatted">
Huge thanks to the Google ML Developer team for the early access ✨
#BuildWithAI #BuildWithGemini #ColabSprint #AISprint #GeminiSprint
</pre>




