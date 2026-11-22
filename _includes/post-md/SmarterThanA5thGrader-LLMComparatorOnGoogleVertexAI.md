{% raw %}
Ever wondered which *Large Language Model (LLM)* stands out not just for providing accurate responses, but also for being clear, respectful, and detail-oriented? With the ever-expanding list of LLMs, each boasting different configurations and capabilities, it is crucial to have a way to quantitatively assess their performance. The goal is to help us select the best model for building applications that prioritize precision, safety, and ethical considerations.

Here, we shall embark on an exciting exploration using the **[LLM Comparator](https://github.com/PAIR-code/llm-comparator)**, a cutting-edge tool from Google's Responsible Generative AI Toolkit. This tool is designed to offer a comprehensive evaluation of LLMs, allowing us to compare their ability to handle various tasks with clarity and thoroughness. By testing these sophisticated AI models against questions typically aimed at a 5th Grader (inspired by the American quiz game show called ["*Are You Smarter than a 5th Grader?*"](https://www.imdb.com/title/tt9845152/)), we aim to uncover which models not only perform accurately but also align with high standards of communication and respect.

[![Smarter than a 5th Grader LLM benchmarking study on Google Vertex AI](https://jigyasa-grover.github.io/assets/images/wp-archive/2024/1-1-9c14fb5a.png)](https://jigyasa-grover.github.io/assets/images/wp-archive/2024/1-1-9c14fb5a.png)

## LLM Comparator

The [LLM Comparator](https://github.com/pair-code/llm-comparator) is an advanced interactive tool designed for in-depth evaluations of large language models (LLMs). It facilitates side-by-side comparisons of model responses, focusing on both the quality and safety of outputs.

This tool offers a dual-layered approach, wherein it provides:

- Quantitative assessments through numerical scores.

- Qualitative insights through detailed feedback.

[![PAIR LLM Comparator side-by-side rubric evaluation UI on Vertex AI](https://jigyasa-grover.github.io/assets/images/wp-archive/2024/image-3b041b5e.png)](https://jigyasa-grover.github.io/assets/images/wp-archive/2024/image-3b041b5e.png)

#### Features

One of the standout features of the LLM Comparator is its capacity to deliver comprehensive feedback on individual responses. Developers can dive into specific responses, gaining a deeper understanding of how and why a model produces certain answers, and uncovering the nuances behind the metrics.

Beyond just numerical scores, it offers qualitative descriptions that highlight the strengths and weaknesses of each answer. This detailed analysis allows developers to pinpoint exact areas where a model excels or falls short, whether they are comparing different models, evaluating multiple versions of the same model, or testing various prompting strategies. This capability is crucial for iterative development, helping developers fine-tune models to enhance their performance and safety.

#### Value Addition

The tool is particularly valuable for developers working on refining LLMs. It provides a clear, visual interface to compare model outputs across different categories, making it easier to assess how each model performs in various contexts. This feature helps users analyze performance based on criteria set by developers, facilitating a more targeted and effective evaluation process.

The LLM Comparator enables users to analyze performance via categories created by developers and shows, side-by-side, how well each model did within each category.

By leveraging the power of another LLM to evaluate the results, the LLM Comparator adds an additional layer of analysis, allowing users to explore and validate findings with greater accuracy. This approach ensures that the feedback and insights provided are robust and actionable, aiding developers in their quest to create more reliable and useful AI models.

## Educational Experiment

To assess these models, let us conduct a series of tests using questions across a variety of subjects that are common in a fifth-grade curriculum. This includes math problems that challenge numerical reasoning, science questions that test comprehension of basic concepts, and language arts inquiries that gauge grammar and reading comprehension skills. By covering such a broad range of topics, we want to ensure a well-rounded evaluation of each model's capabilities.

Our goal is to determine if AI can achieve or surpass the problem-solving abilities of a young student. This comparison is not just about seeing if the AI can answer questions correctly; it's about understanding how effectively it handles different types of queries and whether its responses demonstrate a level of insight and coherence comparable to that of a fifth-grader.

In addition to comparing different AI models, we will also explore how various prompting strategies influence their performance. This aspect of our analysis helps identify which models are most adept at handling specific types of questions and provides insights into how to fine-tune prompts for optimal results.

Essentially, this evaluation will help pinpoint which models excel in educational scenarios, guiding future developments in AI to enhance its effectiveness and reliability. Through this detailed comparison, we aim to uncover the true extent of AI's capabilities in an engaging and educational context.

*Check out the step-by-step tutorial below, or visit [this GitHub repository.](https://github.com/jigyasa-grover/Smarter-than-a-5th-Grader-Using-LLM-Comparator-on-Google-Vertex-AI)*

## Bottom Line

While AI tools like the LLM Comparator offer powerful automated evaluations, they can't always anticipate the specific needs or interests of developers Ultimately, having a human in the loop is crucial, especially when dealing with issues that are delicate, nuanced, or related to safety concerns. For instance, certain nuances in language or context might be missed by the AI but are essential for particular use cases. This is where human oversight becomes invaluable, allowing developers to address specific concerns and tailor evaluations to their needs.

The LLM Comparator enhances this human-AI collaboration by allowing users to define custom functions to check for particular elements in model responses. This customization ensures that the evaluation is not just a one-size-fits-all process but is adapted to the unique requirements of each project. It enables developers to probe deeper into the responses, uncovering insights that standard metrics might overlook.

As LLM performance continues to advance, it is crucial for developers to move beyond aggregated benchmark scores and perform more granular assessments of model capabilities. The human-in-the-loop approach facilitated by tools like the LLM Comparator allows for a detailed analysis of model behavior. By integrating human judgment into the evaluation process, developers can more accurately gauge how well a model performs in real-world scenarios, ensuring that it meets both technical and contextual requirements. This nuanced analysis helps in refining models to better align with specific needs and addresses any potential gaps that automated systems might miss.

## Tutorial

#### Setup

```
# Install the LLM Comparator package
! pip install llm_comparator

# Import relevant packages
import vertexai
from google.colab import auth

# The comparison library provides the primary API for running Comparative
# Evaluations and generating the JSON files required by the LLM Comparator web app.
from llm_comparator import comparison

# The model_helper library is used to initialize API wrapper to interface with
# models. For this demo we focus on models served by Google Vertex AI, but you
# can extend the llm_comparator.model_helper.GenerationModelHelper and
# llm_comparator.model_helper.EmbeddingModelHelper classes to work with other
# providers or models you host yourself.
from llm_comparator import model_helper

# The following libraries contain wrappers that implement the core functionality
# of the Comparative Evaluation workflow. More on these below.
from llm_comparator import llm_judge_runner
from llm_comparator import rationale_bullet_generator
from llm_comparator import rationale_cluster_generator
```
```
# Setup and authenticate with Google Vertex AI.
PROJECT_ID = 'xxx'
REGION = 'xxx'

auth.authenticate_user()
! gcloud config set project {PROJECT_ID}
vertexai.init(project=PROJECT_ID, location=REGION)
```

#### Input Prep

The `llm_judge_inputs` structure is designed to facilitate a detailed comparison between two different model responses for a set of prompts. Here is a breakdown of its components:

- `prompt`: This is the question or statement to which the models are responding. It sets the context for evaluating the quality and accuracy of the responses provided by each model.

- `response_a`: This represents the answer provided by Model A to the given prompt. It is what you are comparing against Model B's response.

- `response_b`: This represents the answer provided by Model B to the same prompt. This allows you to evaluate how well Model B performs in comparison to Model A.

*Also, take a moment to guess which responses might belong to which model 😉 *
*(your options are Gemini 1.5 Pro, Gemma 2B, GPT-4o, Claude 3.5 Sonnet, Llama 3.1, etc.)*

```
llm_judge_inputs = [
    {
        "prompt": "A word, phrase or sequence that reads the same forward and backward is called what?",
        "response_a": """It's called a palindrome.""",
        "response_b": "A palindrome."
    },
    {
        "prompt": "According to the U.S. Constitution, the president is part of which of the three branches of government?",
        "response_a": """According to the U.S. Constitution, the president is part of the Executive branch of government.""",
        "response_b": """The executive branch."""
    },
    {
        "prompt": "What is the capital of Russia?",
        "response_a": """The capital of Russia is Moscow.""",
        "response_b": """The capital of Russia is Moscow."""
    },
    {
        "prompt": "98 – 40 + 30?",
        "response_a": """The result of 98 - 40 + 30 is 88.""",
        "response_b": """Let's solve this step-by-step:
        First, we start with 98.
        Then we subtract 40:
          98 - 40 = 58.
        Finally, we add 30:
          58 + 30 = 88.
        Therefore, 98 - 40 + 30 = 88.
        """
    },
    {
        "prompt": "You Have 20 Pairs Of Shoes, But There Is Only Room In Your Closet For Eight Shoes. How Many Pairs Of Shoes Do You Have To Get Rid Of?",
        "response_a": """You have to get rid of 12 pairs of shoes to fit only 8 shoes in your closet, as 8 shoes equals 4 pairs.""",
        "response_b": """Let's approach this step-by-step:
        First, let's clarify the given information: You have 20 pairs of shoes. Your closet can only fit 8 shoes (not pairs).
        Now, let's calculate: 20 pairs of shoes = 40 individual shoes.
        The closet can fit 8 individual shoes.
        To find out how many shoes you need to get rid of:
          Shoes you have: 40. Shoes you can keep: 8.
          Shoes to remove: 40 - 8 = 32 individual shoes.
        But the question asks about pairs, so: 32 individual shoes = 16 pairs.
        Therefore, you need to get rid of 16 pairs of shoes.
        """
    },
    {
        "prompt": "In classical music, what instruments usually comprise a string quartet?",
        "response_a": """A string quartet typically comprises two violins, one viola, and one cello.""",
        "response_b": """A standard string quartet is typically composed of the following four instruments:
            1. First violin
            2. Second violin
            3. Viola
            4. Cello
            The string quartet is one of the most prominent and influential chamber music ensembles in classical music. The combination of two violins, one viola, and one cello provides a rich, balanced, and versatile sound that has been utilized extensively in the classical repertoire.
            Some key characteristics of the string quartet instrumentation:
            - The first violin typically plays the melody or leads the ensemble.
            - The second violin provides harmony and accompaniment.
            - The viola adds depth and middle range to the ensemble texture.
            - The cello provides the bass line and low-end foundation.
            Together, the four string instruments blend beautifully and allow for intricate interplay, counterpoint, and harmonic development that has been central to the string quartet genre since its emergence in the 18th century. Composers such as Haydn, Mozart, Beethoven, Schubert, and many others wrote extensively for this iconic chamber ensemble.
        """
    },
    {
        "prompt": "What is the plural form of the word 'deer'?",
        "response_a": """The plural form of 'deer' is also 'deer.'""",
        "response_b": """The plural form of the word "deer" is also "deer".
          The word "deer" is one of those nouns in English that has the same form for both the singular and plural. This is because "deer" is an ancient Germanic word that did not originally have separate singular and plural forms.
          So whether you are referring to one deer or multiple deer, the word used is simply "deer". Some examples:
          - I saw a deer in the forest.
          - There were three deer grazing in the meadow.
          - The herd of deer crossed the road.
          The plural "deers" is sometimes used informally, but it is considered grammatically incorrect. The proper plural form remains "deer" for both singular and plural usage.
        """
    },
    {
        "prompt": "Between 1 and 100, how many multiples of 7 are odd numbers?",
        "response_a": """To find how many multiples of 7 between 1 and 100 are odd, note that:
          1. The multiples of 7 between 1 and 100 are: 7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91, 98.
          2. To find the odd multiples, we look at: 7, 21, 35, 49, 63, 77, 91.
          So, there are **7** odd multiples of 7 between 1 and 100.
        """,
        "response_b": """Let's approach this step-by-step:
          1) First, let's list out the multiples of 7 between 1 and 100:
            7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91, 98
          2) Now, let's identify which of these are odd numbers:
            7, 21, 35, 49, 63, 77, 91
          3) Let's count these odd multiples:
            There are 7 odd multiples of 7 between 1 and 100.
          We can also think about this mathematically:
          - Odd multiples of 7 follow the pattern 7(2n+1), where n is a non-negative integer.
          - The largest value of n that keeps 7(2n+1) under 100 is 6.
          - So we have 7 odd multiples: when n = 0, 1, 2, 3, 4, 5, and 6.
          Therefore, between 1 and 100, there are 7 multiples of 7 that are odd numbers.
        """
    },
    {
        "prompt": "If you need 1/2 cup of flour and you only have a 1/4 measuring cup, how many times do you need to use it to get the right amount of flour?",
        "response_a": """You need to use the 1/4 cup measuring cup **twice** to get 1/2 cup of flour.""",
        "response_b": """
          Let's think through this step-by-step:
          1. We need 1/2 cup of flour in total.
          2. We only have a 1/4 cup measuring cup available.
          3. We need to figure out how many 1/4 cups are in 1/2 cup.
          To solve this, we can divide 1/2 by 1/4:
          1/2 ÷ 1/4 = 1/2 × 4/1 = 4/2 = 2
          This tells us that 1/2 cup is equal to two 1/4 cups.
          Therefore, you need to use the 1/4 cup measuring cup 2 times to get 1/2 cup of flour.
        """
    },
    {
        "prompt": "In the sentence, “Sally is a very good person,” what part of speech is the word “very”?",
        "response_a": """In the sentence "Sally is a very good person," the word "very" is an **adverb**. It modifies the adjective "good" to describe the extent of how good Sally is.""",
        "response_b": """In the sentence "Sally is a very good person," the word "very" is an adverb.
          Specifically, "very" in this context is functioning as an intensifier or degree adverb. It modifies the adjective "good," increasing its intensity or degree.
          Adverbs can modify verbs, adjectives, or other adverbs. In this case, "very" is modifying the adjective "good" to emphasize just how good Sally is as a person.
        """
    },
]
```

#### LLM Comparator Model Initialization

##### Generator Model

The generator model can be any Text-to-Text LLM offered by Vertex AI. This model will perform a series of tasks, such as - judge, bulletize, and cluster, so using a larger model is often advantageous. By default, we use `gemini-pro`, but you can specify a different model with the `model_name=` parameter. For a complete list of available models for this task, visit the [Model Garden](https://console.cloud.google.com/vertex-ai/model-garden?pageState=(%22galleryStateKey%22:(%22f%22:(%22g%22:%5B%5D,%22o%22:%5B%5D),%22s%22:%22%22))).

##### Embedding Model

The embedding model can be any text embedder provided by Vertex AI. We default to `'textembedding-gecko@003'` but you can change this with the `model_name=` parameter. For a complete list of available models for this task, visit the [Model Garden](https://console.cloud.google.com/vertex-ai/model-garden?pageState=(%22galleryStateKey%22:(%22f%22:(%22g%22:%5B%5D,%22o%22:%5B%5D),%22s%22:%22%22))).

##### Judge, Bulletize, and Cluster

The following models do the core work of a Comparative Evaluation: judge, bulletize, and cluster. Each class provides a `.run()` function, and the `llm_comparator.comparison.run()` API orchestrates configuring and calling these APIs on the instances you pass in.

`judge`

- It is the model responsible for actually doing the comparison between the two models. The same judge is run multiple times to get a diversity of perspectives, more on how to configure this below.

- A judge must phrase their responses in a simple XML format that includes the verdict and an explanation of the results, to enable downstream processing by the bulletizer and clusterer.

- We provide a default "judge" prompt in `llm_comparator.llm_judge_runner.DEFAULT_LLM_JUDGE_PROMPT_TEMPLATE`, and you can use the `llm_judge_prompt_template=` parameter to provide a custom prompt that may better suit your needs.

```xml

     YOUR EXPLANATION GOES HERE.
     A is slightly better

```

`bulletizer`

- It condenses the results provided by the judge into a set of bullets to make them easier to understand and consume in the UI.

`clusterer`

- It takes the bullets, embeds them, groups them into clusters based on embedding similarity, and generates a label for those clusters.

```
generator = model_helper.VertexGenerationModelHelper()
embedder = model_helper.VertexEmbeddingModelHelper()

judge = llm_judge_runner.LLMJudgeRunner(generator)
bulletizer = rationale_bullet_generator.RationaleBulletGenerator(generator)
clusterer = rationale_cluster_generator.RationaleClusterGenerator(
    generator, embedder
)
```

#### LLM Comparator Evaluation

The `comparison.run()` function is the main interface for conducting a Comparative Evaluation. It processes your prepared inputs, along with a judge, a bulletizer, and a clusterer, and returns a Python dictionary formatted for use in the LLM Comparator web app. While you can examine this dictionary directly in Python, it is most useful when saved to a file.

```
comparison_result = comparison.run(
    llm_judge_inputs,
    judge,
    bulletizer,
    clusterer,
)
```

#### LLM Comparator Evaluation Results

```
file_path = 'json_for_llm_comparator.json'
comparison.write(comparison_result, file_path)
```
```
comparison.show_in_colab(file_path)
```
![image](https://github.com/user-attachments/assets/e3e6a20f-71b8-467b-bed2-1d62e0132582)

>
> Hope you enjoyed this piece, check out the entire code on [github](https://github.com/jigyasa-grover/Smarter-than-a-5th-Grader-Using-LLM-Comparator-on-Google-Vertex-AI) 🎓

```
#BuildWithAI  #BuildWithGemini  #AISprint  #GeminiSprint
```
{% endraw %}
