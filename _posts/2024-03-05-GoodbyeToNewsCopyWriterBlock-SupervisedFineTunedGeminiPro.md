---
layout: post
type: blog
title: Goodbye to News Copy Writer's Block! Supercharging Gemini Pro via Supervised Fine-Tuning 📰
comments: true
mathjax: true
---

<p>Are you tired of staring at a blank screen, struggling to craft captivating headlines and categorize news articles effectively? Say goodbye to news copywriter's block as we harness the power of Gemini Pro. In this article, we'll explore how this cutting-edge technology can supercharge your productivity and creativity, helping you craft compelling headlines and easily categorize news articles.</p>

<h3 class="wp-block-heading"><strong>What is Gemini Pro? </strong></h3>

<p><a href="https://blog.google/technology/ai/google-gemini-ai/">Gemini</a> is a family of highly capable multimodal models developed at Google. The Gemini models are trained jointly across image, audio, video, and text data to build a model with strong generalist capabilities across modalities alongside cutting-edge understanding and reasoning performance in each respective domain. Its state-of-the-art capabilities are aimed to significantly enhance the way developers and enterprise customers build and scale with AI. Google has optimized Gemini 1.0, the first version, for three different sizes:</p>

<li>Gemini Ultra — largest and most capable model for highly complex tasks.</li>
<li>Gemini Pro — best model for scaling across a wide range of tasks.</li>
<li>Gemini Nano — most efficient model for on-device tasks.</li>

<h3 class="wp-block-heading">How does supervised fine-tuning help?</h3>

<p>By default, <a href="https://blog.google/technology/ai/gemini-api-developers-cloud/">Gemini Pro</a> is a generic language model. It is trained on a large and diverse dataset to understand the general patterns and semantics of natural language. This generic training allows Gemini Pro to perform a wide range of natural language processing tasks, such as text generation, text classification, question answering, and more.</p>

<p>However, despite being a generic model, Gemini Pro can be specialized for specific tasks or domains through supervised fine-tuning. By fine-tuning on labeled data relevant to a particular task or domain, Gemini Pro can adapt its parameters and learn task-specific knowledge, making it specialized for that task. This allows it to excel in specific applications, such as news headline generation, sentiment analysis, or language translation.</p>

<p>So, while Gemini Pro starts as a generic model, it can be customized and specialized to suit specific use cases and provide tailored solutions for various natural language processing tasks.</p>

<h3 class="wp-block-heading"><div class="flex flex-grow flex-col max-w-full" style="border: 0px solid rgb(227, 227, 227);--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x:;--tw-pan-y:;--tw-pinch-zoom:;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position:;--tw-gradient-via-position:;--tw-gradient-to-position:;--tw-ordinal:;--tw-slashed-zero:;--tw-numeric-figure:;--tw-numeric-spacing:;--tw-numeric-fraction:;--tw-ring-inset:;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgba(69,89,164,.5);--tw-ring-offset-shadow: 0 0 transparent;--tw-ring-shadow: 0 0 transparent;--tw-shadow: 0 0 transparent;--tw-shadow-colored: 0 0 transparent;--tw-blur:;--tw-brightness:;--tw-contrast:;--tw-grayscale:;--tw-hue-rotate:;--tw-invert:;--tw-saturate:;--tw-sepia:;--tw-drop-shadow:;--tw-backdrop-blur:;--tw-backdrop-brightness:;--tw-backdrop-contrast:;--tw-backdrop-grayscale:;--tw-backdrop-hue-rotate:;--tw-backdrop-invert:;--tw-backdrop-opacity:;--tw-backdrop-saturate:;--tw-backdrop-sepia:;display: flex;max-width: 100%;flex-grow: 1;flex-direction: column"><div class="min-h-[20px] text-message flex flex-col items-start gap-3 whitespace-pre-wrap break-words [.text-message+&amp;]:mt-5 overflow-x-auto" style="border: 0px solid rgb(227, 227, 227);--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x:;--tw-pan-y:;--tw-pinch-zoom:;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position:;--tw-gradient-via-position:;--tw-gradient-to-position:;--tw-ordinal:;--tw-slashed-zero:;--tw-numeric-figure:;--tw-numeric-spacing:;--tw-numeric-fraction:;--tw-ring-inset:;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgba(69,89,164,.5);--tw-ring-offset-shadow: 0 0 transparent;--tw-ring-shadow: 0 0 transparent;--tw-shadow: 0 0 transparent;--tw-shadow-colored: 0 0 transparent;--tw-blur:;--tw-brightness:;--tw-contrast:;--tw-grayscale:;--tw-hue-rotate:;--tw-invert:;--tw-saturate:;--tw-sepia:;--tw-drop-shadow:;--tw-backdrop-blur:;--tw-backdrop-brightness:;--tw-backdrop-contrast:;--tw-backdrop-grayscale:;--tw-backdrop-hue-rotate:;--tw-backdrop-invert:;--tw-backdrop-opacity:;--tw-backdrop-saturate:;--tw-backdrop-sepia:;display: flex;min-height: 20px;flex-direction: column;align-items: flex-start;gap: 0.75rem"><div style="border: 0px solid rgb(227, 227, 227);--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x:;--tw-pan-y:;--tw-pinch-zoom:;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position:;--tw-gradient-via-position:;--tw-gradient-to-position:;--tw-ordinal:;--tw-slashed-zero:;--tw-numeric-figure:;--tw-numeric-spacing:;--tw-numeric-fraction:;--tw-ring-inset:;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgba(69,89,164,.5);--tw-ring-offset-shadow: 0 0 transparent;--tw-ring-shadow: 0 0 transparent;--tw-shadow: 0 0 transparent;--tw-shadow-colored: 0 0 transparent;--tw-blur:;--tw-brightness:;--tw-contrast:;--tw-grayscale:;--tw-hue-rotate:;--tw-invert:;--tw-saturate:;--tw-sepia:;--tw-drop-shadow:;--tw-backdrop-blur:;--tw-backdrop-brightness:;--tw-backdrop-contrast:;--tw-backdrop-grayscale:;--tw-backdrop-hue-rotate:;--tw-backdrop-invert:;--tw-backdrop-opacity:;--tw-backdrop-saturate:;--tw-backdrop-sepia:" class="">Why should I fine-tune Gemini Pro i.e. <code>gemini-1.0-pro-001</code> to generate headlines and categories for news articles rather than training a traditional supervised multi-class classifier?</div></div></div></h3>

<li><strong>End-to-End Solution</strong>: LLMs can provide an end-to-end solution for headline generation and categorization, eliminating the need for a separate classifier and headline generator. This simplifies the overall architecture and may lead to better integration of the model into applications.</li>

<li><strong>Semantic Understanding</strong>: LLMs, like <a href="https://blog.google/technology/ai/google-gemini-ai/">Gemini</a>, have been pretrained on vast amounts of text data, enabling them to capture semantic understanding and contextual information. This allows them to generate more contextually relevant and diverse headlines and categories compared to traditional classifiers.</li>

<li><strong>Flexibility in Output Length</strong>: LLMs can generate variable-length outputs, making them suitable for tasks like headline generation where the length of the generated text can vary. In contrast, traditional classifiers produce fixed-length outputs, limiting their ability to handle variable-length tasks.</li>

<li><strong>Creativity and Novelty</strong>: LLMs can generate creative and novel headlines by extrapolating patterns and information from their training data. This can be beneficial for capturing user attention and providing unique content.</li>

<li><strong>Handling Ambiguity</strong>: News articles often contain ambiguous or complex information. LLMs, due to their pretraining on diverse data, can better handle ambiguity and generate contextually appropriate headlines even in situations where a traditional classifier might struggle.</li>

<li><strong>Reduced Annotation Effort</strong>: Training a traditional supervised multi-class classifier typically requires a labeled dataset with headlines and corresponding categories. Fine-tuning an LLM may require fewer labeled examples because the model has already learned a broad understanding of language during pretraining.</li>

<li><strong>Transfer Learning Benefits</strong>: Fine-tuning a pretrained LLM involves leveraging transfer learning, where the model transfers knowledge gained from one task (pretraining on a large corpus) to another (fine-tuning on your specific task). This often results in faster convergence and better generalization to new data compared to training a model from scratch.</li>

<li><strong>Adaptability to Various Inputs</strong>: LLMs can handle a wide range of inputs, including incomplete or partially specified prompts. This adaptability is beneficial in scenarios where users may provide partial information or the input data is not uniform.</li>

<p>While fine-tuning LLMs for headline and category generation offers these advantages, it's essential to consider the specific requirements and constraints of your task, as well as the computational resources available. Traditional classifiers may still be suitable for certain scenarios, especially if you have a well-annotated dataset and computational efficiency is a primary concern.</p>

<h3 class="wp-block-heading">What data can I use for the supervised fine-tuning process?</h3>

<p>To fine-tune the Gemini Pro model for news headline generation and category classification, we are using the popular <a href="https://www.kaggle.com/datasets/rmisra/news-category-dataset">News Category Dataset</a> by <a href="https://rishabhmisra.github.io/">Rishabh Misra</a>. The dataset which was originally in JSON format was converted to CSV and only the required fields were kept.</p>

<h5 class="wp-block-heading">before</h5>
<pre class="wp-block-code has-small-font-size"><code>
{"link": "https://www.huffpost.com/entry/covid-boosters-uptake-us_n_632d719ee4b087fae6feaac9", "headline": "Over 4 Million Americans Roll Up Sleeves For Omicron-Targeted COVID Boosters", "category": "U.S. NEWS", "short_description": "Health experts said it is too early to predict whether demand would match up with the 171 million doses of the new boosters the U.S. ordered for the fall.", "authors": "Carla K. Johnson, AP", "date": "2022-09-23"}
{"link": "https://www.huffpost.com/entry/funniest-parenting-tweets_l_632d7d15e4b0d12b5403e479", "headline": "The Funniest Tweets From Parents This Week (Sept. 17-23)", "category": "PARENTING", "short_description": "\"Accidentally put grown-up toothpaste on my toddler\u2019s toothbrush and he screamed like I was cleaning his teeth with a Carolina Reaper dipped in Tabasco sauce.\"", "authors": "Caroline Bologna", "date": "2022-09-23"}
{"link": "https://www.huffpost.com/entry/mija-documentary-immigration-isabel-castro-interview_n_632329aee4b000d98858dbda", "headline": "How A New Documentary Captures The Complexity Of Being A Child Of Immigrants", "category": "CULTURE &amp; ARTS", "short_description": "In \"Mija,\" director Isabel Castro combined music documentaries with the style of \"Euphoria\" and \"Clueless\" to tell a more nuanced immigration story.", "authors": "Marina Fang", "date": "2022-09-22"}
{"link": "https://www.huffpost.com/entry/biden-un-russian-war-an-affront-to-bodys-charter_n_632ad9e3e4b0bfdf5e1bf5f7", "headline": "Biden At UN To Call Russian War An Affront To Body's Charter", "category": "WORLD NEWS", "short_description": "White House officials say the crux of the president's visit to the U.N. this year will be a full-throated condemnation of Russia and its brutal war.", "authors": "Aamer Madhani, AP", "date": "2022-09-21"}
{"link": "https://www.huffpost.com/entry/golden-globes-return-nbc_n_6329f151e4b0ed991abda7f3", "headline": "Golden Globes Returning To NBC In January After Year Off-Air", "category": "ENTERTAINMENT", "short_description": "For the past 18 months, Hollywood has effectively boycotted the Globes after reports that the HFPA\u2019s 87 members of non-American journalists included no Black members.", "authors": "", "date": "2022-09-20"}
</code></pre>

<h5 class="wp-block-heading">after</h5>
<pre class="wp-block-code has-small-font-size"><code>
short_description,headline,category
Health experts said it is too early to predict whether demand would match up with the 171 million doses of the new boosters the U.S. ordered for the fall.,Over 4 Million Americans Roll Up Sleeves For Omicron-Targeted COVID Boosters,U.S. NEWS
"""Accidentally put grown-up toothpaste on my toddler’s toothbrush and he screamed like I was cleaning his teeth with a Carolina Reaper dipped in Tabasco sauce.""",The Funniest Tweets From Parents This Week (Sept. 17-23),PARENTING
"In ""Mija,"" director Isabel Castro combined music documentaries with the style of ""Euphoria"" and ""Clueless"" to tell a more nuanced immigration story.",How A New Documentary Captures The Complexity Of Being A Child Of Immigrants,CULTURE &amp; ARTS
White House officials say the crux of the president's visit to the U.N. this year will be a full-throated condemnation of Russia and its brutal war.,Biden At UN To Call Russian War An Affront To Body's Charter,WORLD NEWS
"For the past 18 months, Hollywood has effectively boycotted the Globes after reports that the HFPA’s 87 members of non-American journalists included no Black members.",Golden Globes Returning To NBC In January After Year Off-Air,ENTERTAINMENT
</code></pre>

<h3 class="wp-block-heading">Supervised Fine-Tuning Gemini Pro to yield News Headline &amp; Category Generator!</h3>

<p>Using the above modified version of <a href="https://www.kaggle.com/datasets/rmisra/news-category-dataset">News Category Dataset</a> by keeping only the <code>short_description</code>, <code>headline</code>, and <code>category</code> we fine-tuned the <a href="https://blog.google/technology/ai/gemini-api-developers-cloud/">Gemini Pro</a> (or to be specific <span style="background-color: inherit; font-family: monospace; font-size: inherit; color: initial;">gemini-1.0-pro-001</span>). Specifically we used 1, 000 of the 200, 000 samples only for this process with the following configuration in <a href="https://aistudio.google.com/">Google AI Studio</a>.</p>

<pre class="wp-block-code"><code>
input: short_description
output: headline, category
model: gemini-1.0-pro-001
tuning epochs: 20
learning rate multiplier: 0.1
batch size: 32
</code></pre>

<figure class="wp-block-image size-large"><a href="https://jigyasagrover.files.wordpress.com/2024/03/image-3.png"><img src="https://jigyasagrover.files.wordpress.com/2024/03/image-3.png?w=1024" alt="" class="wp-image-3355"/></a><figcaption class="wp-element-caption"><em>Check out this <a href="https://ai.google.dev/docs/model_tuning_guidance">guide</a> by Google for more on tuning the text model behind the Gemini API text service. </em></figcaption></figure>

<br><br>
<p>It took ~34 minutes to fine-tune the model with a learning rate of 0.00002. Here is a snapshot of the loss vs epoch curve and other details for the model `tunedModels/news-headline--category-generator-pvv2y3`.</p>

<figure class="wp-block-image size-full is-style-default"><a href="https://jigyasagrover.files.wordpress.com/2024/03/image.png"><img src="https://jigyasagrover.files.wordpress.com/2024/03/image.png" alt="" class="wp-image-3349"/></a></figure>

<br><br>
<p>Here are some examples in both structured and freeform prompts where it is creatively generating headlines for the given snippet and also providing relevant categories the news can be bucketed into. </p>

<figure class="wp-block-image size-full"><a href="https://jigyasagrover.files.wordpress.com/2024/03/image-1.png"><img src="https://jigyasagrover.files.wordpress.com/2024/03/image-1.png" alt="" class="wp-image-3351"/></a></figure>

<figure class="wp-block-image size-full"><a href="https://jigyasagrover.files.wordpress.com/2024/03/image-2.png"><img src="https://jigyasagrover.files.wordpress.com/2024/03/image-2.png" alt="" class="wp-image-3353"/></a></figure>

<br><br>
<p>In short, we can soon bid farewell to the dreaded news copywriter's block with Gemini Pro, powered by supervised fine-tuning. This blog has explored how this AI marvel is transforming the landscape of news headline generation, bringing unprecedented efficiency to the table. </p>

<p>With its sophisticated algorithms, Gemini Pro not only alleviates the creative struggles of copywriters but also elevates the standard of news content production. As we embrace the future of automated journalism, Gemini Pro stands as a beacon of innovation, empowering writers to break free from constraints and ushering in a new era of dynamic and engaging news reporting. </p>

<blockquote>Say goodbye to writer's block and hello to a more productive and inspired newsroom with the supercharged capabilities of Gemini Pro 🚀</blockquote>




<br><br>
<pre class="wp-block-preformatted">#BuildWithAI  #BuildWithGemini  #GeminiSprint</pre>
