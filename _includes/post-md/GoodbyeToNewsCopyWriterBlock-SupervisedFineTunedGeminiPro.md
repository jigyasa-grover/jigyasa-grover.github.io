{% raw %}
*Historical Note (March 2024): This walkthrough used `gemini-1.0-pro-001` in Google AI Studio. Gemini 1.0 Pro has since been retired in favor of newer Gemini models, though the supervised fine-tuning workflow and dataset curation patterns remain instructive.*

Are you tired of staring at a blank screen, struggling to craft captivating headlines and categorize news articles effectively? Say goodbye to news copywriter's block as we harness the power of Gemini Pro. In this article, we'll explore how this cutting-edge technology can supercharge your productivity and creativity, helping you craft compelling headlines and easily categorize news articles.

[![Supervised fine-tuning of Google Gemini Pro for news copywriting and headline generation](https://jigyasa-grover.github.io/assets/images/wp-archive/2024/huge-d46b5d35.jpg)](https://jigyasa-grover.github.io/assets/images/wp-archive/2024/huge-d46b5d35.jpg)

### **What is Gemini Pro? **

[Gemini](https://blog.google/technology/ai/google-gemini-ai/) is a family of highly capable multimodal models developed at Google. The Gemini models are trained jointly across image, audio, video, and text data to build a model with strong generalist capabilities across modalities alongside cutting-edge understanding and reasoning performance in each respective domain. Its state-of-the-art capabilities are aimed to significantly enhance the way developers and enterprise customers build and scale with AI. Google has optimized Gemini 1.0, the first version, for three different sizes:

- Gemini Ultra — largest and most capable model for highly complex tasks.

- Gemini Pro — best model for scaling across a wide range of tasks.

- Gemini Nano — most efficient model for on-device tasks.

### How does supervised fine-tuning help?

By default, [Gemini Pro](https://blog.google/technology/ai/gemini-api-developers-cloud/) is a generic language model. It is trained on a large and diverse dataset to understand the general patterns and semantics of natural language. This generic training allows Gemini Pro to perform a wide range of natural language processing tasks, such as text generation, text classification, question answering, and more.

However, despite being a generic model, Gemini Pro can be specialized for specific tasks or domains through supervised fine-tuning. By fine-tuning on labeled data relevant to a particular task or domain, Gemini Pro can adapt its parameters and learn task-specific knowledge, making it specialized for that task. This allows it to excel in specific applications, such as news headline generation, sentiment analysis, or language translation.

So, while Gemini Pro starts as a generic model, it can be customized and specialized to suit specific use cases and provide tailored solutions for various natural language processing tasks.

### Why should I fine-tune Gemini Pro i.e. `gemini-1.0-pro-001` to generate headlines and categories for news articles rather than training a traditional supervised multi-class classifier?

- **End-to-End Solution**: LLMs can provide an end-to-end solution for headline generation and categorization, eliminating the need for a separate classifier and headline generator. This simplifies the overall architecture and may lead to better integration of the model into applications.

- **Semantic Understanding**: LLMs, like [Gemini](https://blog.google/technology/ai/google-gemini-ai/), have been pretrained on vast amounts of text data, enabling them to capture semantic understanding and contextual information. This allows them to generate more contextually relevant and diverse headlines and categories compared to traditional classifiers.

- **Flexibility in Output Length**: LLMs can generate variable-length outputs, making them suitable for tasks like headline generation where the length of the generated text can vary. In contrast, traditional classifiers produce fixed-length outputs, limiting their ability to handle variable-length tasks.

- **Creativity and Novelty**: LLMs can generate creative and novel headlines by extrapolating patterns and information from their training data. This can be beneficial for capturing user attention and providing unique content.

- **Handling Ambiguity**: News articles often contain ambiguous or complex information. LLMs, due to their pretraining on diverse data, can better handle ambiguity and generate contextually appropriate headlines even in situations where a traditional classifier might struggle.

- **Reduced Annotation Effort**: Training a traditional supervised multi-class classifier typically requires a labeled dataset with headlines and corresponding categories. Fine-tuning an LLM may require fewer labeled examples because the model has already learned a broad understanding of language during pretraining.

- **Transfer Learning Benefits**: Fine-tuning a pretrained LLM involves leveraging transfer learning, where the model transfers knowledge gained from one task (pretraining on a large corpus) to another (fine-tuning on your specific task). This often results in faster convergence and better generalization to new data compared to training a model from scratch.

- **Adaptability to Various Inputs**: LLMs can handle a wide range of inputs, including incomplete or partially specified prompts. This adaptability is beneficial in scenarios where users may provide partial information or the input data is not uniform.

While fine-tuning LLMs for headline and category generation offers these advantages, it's essential to consider the specific requirements and constraints of your task, as well as the computational resources available. Traditional classifiers may still be suitable for certain scenarios, especially if you have a well-annotated dataset and computational efficiency is a primary concern.

### What data can I use for the supervised fine-tuning process?

To fine-tune the Gemini Pro model for news headline generation and category classification, we are using the popular [News Category Dataset](https://www.kaggle.com/datasets/rmisra/news-category-dataset) by [Rishabh Misra](https://rishabhmisra.github.io/). The dataset which was originally in JSON format was converted to CSV and only the required fields were kept.

##### before

```
{"link": "https://www.huffpost.com/entry/covid-boosters-uptake-us_n_632d719ee4b087fae6feaac9", "headline": "Over 4 Million Americans Roll Up Sleeves For Omicron-Targeted COVID Boosters", "category": "U.S. NEWS", "short_description": "Health experts said it is too early to predict whether demand would match up with the 171 million doses of the new boosters the U.S. ordered for the fall.", "authors": "Carla K. Johnson, AP", "date": "2022-09-23"}
{"link": "https://www.huffpost.com/entry/funniest-parenting-tweets_l_632d7d15e4b0d12b5403e479", "headline": "The Funniest Tweets From Parents This Week (Sept. 17-23)", "category": "PARENTING", "short_description": "\"Accidentally put grown-up toothpaste on my toddler\u2019s toothbrush and he screamed like I was cleaning his teeth with a Carolina Reaper dipped in Tabasco sauce.\"", "authors": "Caroline Bologna", "date": "2022-09-23"}
{"link": "https://www.huffpost.com/entry/mija-documentary-immigration-isabel-castro-interview_n_632329aee4b000d98858dbda", "headline": "How A New Documentary Captures The Complexity Of Being A Child Of Immigrants", "category": "CULTURE & ARTS", "short_description": "In \"Mija,\" director Isabel Castro combined music documentaries with the style of \"Euphoria\" and \"Clueless\" to tell a more nuanced immigration story.", "authors": "Marina Fang", "date": "2022-09-22"}
{"link": "https://www.huffpost.com/entry/biden-un-russian-war-an-affront-to-bodys-charter_n_632ad9e3e4b0bfdf5e1bf5f7", "headline": "Biden At UN To Call Russian War An Affront To Body's Charter", "category": "WORLD NEWS", "short_description": "White House officials say the crux of the president's visit to the U.N. this year will be a full-throated condemnation of Russia and its brutal war.", "authors": "Aamer Madhani, AP", "date": "2022-09-21"}
{"link": "https://www.huffpost.com/entry/golden-globes-return-nbc_n_6329f151e4b0ed991abda7f3", "headline": "Golden Globes Returning To NBC In January After Year Off-Air", "category": "ENTERTAINMENT", "short_description": "For the past 18 months, Hollywood has effectively boycotted the Globes after reports that the HFPA\u2019s 87 members of non-American journalists included no Black members.", "authors": "", "date": "2022-09-20"}
```

##### after

```
short_description,headline,category
Health experts said it is too early to predict whether demand would match up with the 171 million doses of the new boosters the U.S. ordered for the fall.,Over 4 Million Americans Roll Up Sleeves For Omicron-Targeted COVID Boosters,U.S. NEWS
"""Accidentally put grown-up toothpaste on my toddler’s toothbrush and he screamed like I was cleaning his teeth with a Carolina Reaper dipped in Tabasco sauce.""",The Funniest Tweets From Parents This Week (Sept. 17-23),PARENTING
"In ""Mija,"" director Isabel Castro combined music documentaries with the style of ""Euphoria"" and ""Clueless"" to tell a more nuanced immigration story.",How A New Documentary Captures The Complexity Of Being A Child Of Immigrants,CULTURE & ARTS
White House officials say the crux of the president's visit to the U.N. this year will be a full-throated condemnation of Russia and its brutal war.,Biden At UN To Call Russian War An Affront To Body's Charter,WORLD NEWS
"For the past 18 months, Hollywood has effectively boycotted the Globes after reports that the HFPA’s 87 members of non-American journalists included no Black members.",Golden Globes Returning To NBC In January After Year Off-Air,ENTERTAINMENT
```

### Supervised Fine-Tuning Gemini Pro to yield News Headline & Category Generator!

Using the above modified version of [News Category Dataset](https://www.kaggle.com/datasets/rmisra/news-category-dataset) by keeping only the `short_description`, `headline`, and `category` we fine-tuned the [Gemini Pro](https://blog.google/technology/ai/gemini-api-developers-cloud/) (or to be specific `gemini-1.0-pro-001`). Specifically we used 1,000 of the 200,000 samples only for this process with the following configuration in [Google AI Studio](https://aistudio.google.com/).

```
input: short_description
output: headline, category
model: gemini-1.0-pro-001
tuning epochs: 20
learning rate multiplier: 0.1
batch size: 32
```

[![Google Gemini API supervised model tuning workflow diagram](https://jigyasa-grover.github.io/assets/images/wp-archive/2024/image-3-0a60acfe.png)](https://jigyasa-grover.github.io/assets/images/wp-archive/2024/image-3-0a60acfe.png)
**Check out this [guide](https://ai.google.dev/docs/model_tuning_guidance) by Google for more on tuning the text model behind the Gemini API text service. **

It took ~34 minutes to fine-tune the model with a learning rate of 0.00002. Here is a snapshot of the loss vs epoch curve and other details for the model `tunedModels/news-headline--category-generator-pvv2y3`.

[![Training loss progression during Gemini Pro supervised fine-tuning](https://jigyasa-grover.github.io/assets/images/wp-archive/2024/image-98a0d57b.png)](https://jigyasa-grover.github.io/assets/images/wp-archive/2024/image-98a0d57b.png)

Here are some examples in both structured and freeform prompts where it is creatively generating headlines for the given snippet and also providing relevant categories the news can be bucketed into.

[![Comparing baseline vs. fine-tuned Gemini Pro editorial headline predictions](https://jigyasa-grover.github.io/assets/images/wp-archive/2024/image-1-0a0ab715.png)](https://jigyasa-grover.github.io/assets/images/wp-archive/2024/image-1-0a0ab715.png)

[![Fine-tuned Gemini Pro domain-adapted headline evaluation output](https://jigyasa-grover.github.io/assets/images/wp-archive/2024/image-2-56dfd3a7.png)](https://jigyasa-grover.github.io/assets/images/wp-archive/2024/image-2-56dfd3a7.png)

In short, we can soon bid farewell to the dreaded news copywriter's block with Gemini Pro, powered by supervised fine-tuning. This blog has explored how this AI marvel is transforming the landscape of news headline generation, bringing unprecedented efficiency to the table.

With its sophisticated algorithms, Gemini Pro not only alleviates the creative struggles of copywriters but also elevates the standard of news content production. As we embrace the future of automated journalism, Gemini Pro stands as a beacon of innovation, empowering writers to break free from constraints and ushering in a new era of dynamic and engaging news reporting.

> Say goodbye to writer's block and hello to a more productive and inspired newsroom with the supercharged capabilities of Gemini Pro 🚀

```
#BuildWithAI  #BuildWithGemini  #GeminiSprint
```
{% endraw %}
