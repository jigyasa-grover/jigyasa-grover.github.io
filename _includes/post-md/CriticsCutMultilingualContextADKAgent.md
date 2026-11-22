{% raw %}
The landscape of conversational AI is rapidly evolving. Conversational AI is no longer just about simple Q&A. Modern agents need to understand dialogue history, integrate external tools, adhere to safety protocols, and ideally, communicate across language barriers. This post provides a technical deep dive into ***"Critic's Cut"***, a movie review agent built to embody these principles using:

- [Google's Agent Development Kit (ADK)](https://google.github.io/adk-docs/)

- [Gemini 2.0 Flash](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-0-flash)

- [Google Search Tool](https://google.github.io/adk-docs/tools/built-in-tools/#google-search)

- Safety libraries like [Microsoft's Presidio Analyzer](https://microsoft.github.io/presidio/analyzer/) and [Better Profanity](https://pypi.org/project/better-profanity/)

[![Critic's Cut multilingual movie review multi-agent architecture built with Google ADK and Gemini 2.0](https://jigyasa-grover.github.io/assets/images/wp-archive/2025/image-7b993ce9.jpg)](https://jigyasa-grover.github.io/assets/images/wp-archive/2025/image-7b993ce9.jpg)

## Overview

The goal of this project is to demonstrate a simple agent that:

- Focuses on movie/TV show-related inquiries

- Uses Google Search for real-time review information

- Remembers previous turns for coherent follow-ups

- Handles queries in multiple languages, adapting response framing

- Implements a robust pipeline for:

  - PII redaction (Presidio Analyzer).

  - Toxicity/offensive content blocking (Better-Profanity).

  - Language, formatting, and content quality checks

## **The Blueprint: Google's Agent Development Kit (ADK)**

The ADK serves as the backbone, providing a structured approach to agent development:

### **Defining the Persona** = `google.adk.agents.Agent`

- The **[tool-augmented LLM agent](https://google.github.io/adk-docs/agents/llm-agents/)**'s core behavior, persona, and capabilities are defined while initiating an instance.

- The primary driver is the `instruction` parameter, a detailed prompt that guides the LLM (Gemini 2.0 Flash in this case).

- Crafting this instruction set was an iterative process, focusing on achieving precise, structured output and nuanced conversational abilities.

- This prompt engineering is critical for structured output (ratings per aspect like 🎭 Acting, 👁️ Visuals, etc.) and nuanced behaviors.

```python
# From notebook cell: Agent Definition
movie_review_agent = Agent(
    name="MovieReviewAgent",
    model="gemini-2.0-flash", # Or your MODEL_GEMINI_2_0_FLASH variable
    instruction="""
      You are Critic's Cut...
      (Detailed instructions on review structure, context handling,
       multilingual responses, source citation, off-topic replies, etc.)
      """,
    tools=[google_search]
)
```

Supported functionalities include:

- **Question answering** about movie/TV facts, reviews, and cast details

- **Multilingual comprehension** and generation (English, Hindi, Spanish, etc.)

- **Tool-use orchestration** via ADK’s structured `tools` interface

- **Safety enforcement** inline during response generation

### **Extending Capabilities with Tools** = `google.adk.tools.google_search`

- To provide fresh and relevant movie reviews, Critic's Cut integrates the ADK's pre-built `[Google Search Tool](https://google.github.io/adk-docs/tools/built-in-tools/)`.

- The agent's instructions guide it on when to leverage this tool to find authoritative reviews, ensuring information is current.

- This makes the agent dynamic and not limited by a knowledge cutoff. It fetches the latest web content and synthesizes informative answers in the user's preferred language.

### **Memory & Context** = `google.adk.sessions.InMemorySessionService`

- True conversation requires memory. ADK's `SessionService`, particularly `InMemorySessionService` for this project, is crucial for context-awareness.

- It logs the entire dialogue history, user inputs, agent replies, and tool interactions, as a sequence of Event objects within a Session.

- This history enables Critic's Cut to understand follow-up questions like "How were *its* visuals?" by referring to previously discussed movies.

- A key technical discipline here is ensuring consistent use of the `APP_NAME` and the specific `session_service` instance across all operations.

### Orchestration with Runner = `google.adk.runners.Runner`

- The Runner class is the orchestrator. Its `run_async` method is the entry point for user interaction.

- It manages the flow: passing the user's message to the agent, interfacing with the `SessionService` to provide conversational context, coordinating any tool calls initiated by the agent, and streaming back the `Event` objects that detail the agent's thought process and final output.

## The Brain: Gemini 2.0 Flash

The cognitive power behind Critic's Cut comes from Google's Gemini 2.0 Flash model.

- **Complex Instruction Following:** Gemini meticulously adheres to the detailed instructions provided to the Agent, ensuring reviews are consistently formatted with specific aspects, ratings, emojis, and sourced links.

- **Nuanced Contextual Reasoning:** The model effectively utilizes the conversation history (managed by ADK) to maintain coherence across multiple turns and accurately interpret pronouns or implicit references in follow-up queries.

- **Multilingual Fluency:** Gemini demonstrates a strong understanding of queries in diverse languages (tested with Spanish, French, Korean, and German). It can frame its conversational responses (greetings, clarifications) in the user's language. While the core review content language is often dictated by the availability of information from web searches (primarily English), the agent presents this clearly.

- **Intelligent Tool Invocation:** Based on the prompt and its instruction set, Gemini autonomously decides when to call the `google_search` tool to gather the necessary information for a review.

## **The Guardian: Automated Evaluation & Safety Pipeline**

To ensure responsible and high-quality interactions, and inspired by [ADK safety guidelines](https://google.github.io/adk-docs/safety/), *Critic's Cut *incorporates a critical pre-response evaluation pipeline. Before any generated content is surfaced to the user, it's vetted through a series of automated checks:

```python
# Conceptual flow within the ask_movie_agent helper:
# 1. Obtain raw_agent_response_text from runner.run_async
# 2. Perform safety_checks:
#    if not check_toxicity(text) or not check_pii(text) or not check_prompt_injection(text):
#        safety_breach = True
#        display_text = "🛡️ Response withheld for safety..."
# 3. If not safety_breach, perform content_checks:
#    if not check_language(text, lang): feedback.append("Lang issue")
#    # ... other checks for formatting, sources, rejection ...
#    display_text = f"✨ Agent Response:\n{text}"
# 4. Display display_text and all feedback messages.
```

- **Initial Intent Check:** `is_movie_or_show_query(...)` is a regex-based function that provides a first-pass filter on the user's prompt to determine if it's movie-related, helping to gate subsequent, more intensive evaluations. It prevents unnecessary compute cycles and enforces topic safety.

- **Critical Safety Gates (Response Withheld on Failure):** These checks are non-negotiable for user safety.

  - **Toxicity Screening:** `better-profanity` is a Python library for detecting and censoring profanity in text. So we use `profanity.contains_profanity()` to filter out inappropriate language.

  - **PII Shielding:** `presidio-analyzer` is a part of the Presidio framework by Microsoft for detecting PII (Personally Identifiable Information) in text. Our tool employs `analyzer.analyze()` to detect and prevent leakage of entities like email addresses and phone numbers.

  - **Prompt Injection Defense:** A custom check using regular expressions, refer `check_prompt_injection(...)`, scans for common phrases indicative of attempts to manipulate the agent or reveal its system prompts.

- **Content Quality & Formatting Checks (Informational Flags & Soft Gates):** These ensure the agent adheres to its defined role and output standards.

  - **Language Consistency:** `langdetect` is a Python library for language detection, supporting a wide range of languages. `check_language(...)` verifies if the agent's primary response language aligns with the `expected_lang_code` (usually derived from the user's query language).

  - **Rejection Logic:** `check_rejection(...)` is a function, supported by the refined `is_topic_movie_for_rejection_check` logic (which infers topic from agent response format for follow-ups), that assesses if the agent correctly declined off-topic queries or appropriately handled on-topic ones without undue rejection.

  - **Review Structure Compliance:** `check_has_ratings_and_emojis(...)` and `check_has_sources(...)` validate that essential review components (star ratings, emojis, source links) are present.

  - **Source Faithfulness:** `check_faithfulness(...)` verifies that cited sources, when a review is provided, include names from a predefined list of reputable (currently English-centric) domains (e.g., IMDb, Rotten Tomatoes, BBC). This might flag valid foreign-language sources if they are not on this list.

## **Some Insights & The Path Forward**

The development of Critic's Cut highlighted several key engineering considerations:

- **Asynchronous Operations in Interactive Environments:** Managing `asyncio` correctly in Google Colab, especially ensuring that setup operations like session creation are fully awaited before dependent operations commence, is vital for stability. Wrapping cell logic in a main `async def` function and using top-level `await` proved effective.

- **The Challenge of Context in Evaluation:** Evaluating an agent's handling of contextual follow-ups purely based on the current user prompt is insufficient. Our evaluation logic for topic relevance and rejection had to be adapted to also consider cues from the *agent's response format* to better assess if it correctly understood the implicit context.

- **Multilingual Realities:** While Gemini offers robust multilingual understanding for conversational elements, the practical availability of sourced review content in diverse languages remains a factor. The agent is designed to reflect this, primarily summarizing English content if that's what `google_search` yields, while still attempting to engage in the user's language.

## Why This Matters

This project showcases how Google ADK allows rapid prototyping of production-ready agents that are multilingual, safe, and intelligent. Integration of tools like search, moderation, and semantic scoring can be done with minimal setup. The agent exemplifies **evaluation-driven development**: each layer, from detection to moderation, contributes to building trusted AI experiences.

## Final Thoughts

Intelligent agents must also be:

- Context-aware

- Multilingual

- Safe

Google ADK provides a strong foundation to build such systems. This project illustrates the capabilities achievable with just a few lines of code. Future expansions could include voice-based or mobile integrations, feasible with ADK’s modular framework.

>
> Hope you enjoyed this piece, check out the entire code on [github](https://github.com/jigyasa-grover/critics-cut) 🎓

```
Huge thanks to the Google ML Developer team for organizing #AISprint ✨
Google Cloud credits are provided for this project.
#BuildWithAI #BuildWithGemini #VertexSprint #VertexAISprint #AISprint #GeminiSprint
```
{% endraw %}
