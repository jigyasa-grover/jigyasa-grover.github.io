---
layout: post
type: blog
title: Critic’s Cut 🎥 Powering Multilingual, Context-Aware Movie Reviews with ADK & Gemini 2.0
comments: true
mathjax: true
---

<p>The landscape of conversational AI is rapidly evolving. Conversational AI is no longer just about simple Q&amp;A. Modern agents need to understand dialogue history, integrate external tools, adhere to safety protocols, and ideally, communicate across language barriers. This post provides a technical deep dive into <strong><em>"Critic's Cut"</em></strong>, a movie review agent built to embody these principles using:</p>

<li><a href="https://google.github.io/adk-docs/">Google's Agent Development Kit (ADK)</a></li>
<li><a href="https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-0-flash">Gemini 2.0 Flash</a></li>
<li><a href="https://google.github.io/adk-docs/tools/built-in-tools/#google-search">Google Search Tool</a></li>
<li>Safety libraries like <a href="https://microsoft.github.io/presidio/analyzer/">Microsoft's Presidio Analyzer </a>and <a href="https://pypi.org/project/better-profanity/">Better Profanity</a></li>
<br>

<figure class="wp-block-image size-large"><a href="https://jigyasagrover.wordpress.com/wp-content/uploads/2025/06/image.png"><img src="https://jigyasagrover.wordpress.com/wp-content/uploads/2025/06/image.png?w=940" alt="" class="wp-image-3542"/></a></figure>

<h2 class="wp-block-heading">Overview</h2>
<p>The goal of this project is to demonstrate a simple agent that:</p>
<li>Focuses on movie/TV show-related inquiries</li>
<li>Uses Google Search for real-time review information</li>
<li>Remembers previous turns for coherent follow-ups</li>
<li>Handles queries in multiple languages, adapting response framing</li>
<li>Implements a robust pipeline for:<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>PII redaction (Presidio Analyzer).</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Toxicity/offensive content blocking (Better-Profanity).</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Language, formatting, and content quality checks</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>

<h2 class="wp-block-heading"><strong><strong>The Blueprint: Google's Agent Development Kit (ADK)</strong></strong></h2>
<p>The ADK serves as the backbone, providing a structured approach to agent development:</p>
<h3 class="wp-block-heading"><strong>Defining the Persona</strong> = <code>google.adk.agents.Agent</code></h3>
<li>The  <strong><a href="https://google.github.io/adk-docs/agents/llm-agents/">tool-augmented LLM agent</a></strong>'s core behavior, persona, and capabilities are defined while initiating an instance. </li>
<li>The primary driver is the <code>instruction</code> parameter, a detailed prompt that guides the LLM (Gemini 2.0 Flash in this case). </li>
<li>Crafting this instruction set was an iterative process, focusing on achieving precise, structured output and nuanced conversational abilities. </li>
<li>This prompt engineering is critical for structured output (ratings per aspect like 🎭 Acting, 👁️ Visuals, etc.) and nuanced behaviors.</li>

```
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

<p>Supported functionalities include:</p>
<li><strong>Question answering</strong>&nbsp;about movie/TV facts, reviews, and cast details</li>
<li><strong>Multilingual comprehension</strong>&nbsp;and generation (English, Hindi, Spanish, etc.)</li>
<li><strong>Tool-use orchestration</strong>&nbsp;via ADK’s structured&nbsp;<code>tools</code>&nbsp;interface</li>
<li><strong>Safety enforcement</strong>&nbsp;inline during response generation</li>

<h3 class="wp-block-heading"><strong>Extending Capabilities with Tools</strong> = <code>google.adk.tools.google_search</code></h3>
<li>To provide fresh and relevant movie reviews, Critic's Cut integrates the ADK's pre-built <code><a href="https://google.github.io/adk-docs/tools/built-in-tools/">Google Search Tool</a></code>. </li>
<li>The agent's instructions guide it on when to leverage this tool to find authoritative reviews, ensuring information is current. </li>
<li>This makes the agent dynamic and not limited by a knowledge cutoff. It fetches the latest web content and synthesizes informative answers in the user's preferred language. </li>

<h3 class="wp-block-heading"><strong>Memory &amp; Context</strong> = <code>google.adk.sessions.InMemorySessionService</code></h3>
<li>True conversation requires memory. ADK's <code>SessionService</code>, particularly <code>InMemorySessionService</code> for this project, is crucial for context-awareness. </li>
<li>It logs the entire dialogue history, user inputs, agent replies, and tool interactions, as a sequence of Event objects within a Session. </li>
<li>This history enables Critic's Cut to understand follow-up questions like "How were <em>its</em> visuals?" by referring to previously discussed movies. </li>
<li>A key technical discipline here is ensuring consistent use of the <code>APP_NAME</code> and the specific <code>session_service</code> instance across all operations.</li>

<h3 class="wp-block-heading">Orchestration with Runner = <code>google.adk.runners.Runner</code></h3>
<li>The Runner class is the orchestrator. Its run_async method is the entry point for user interaction. </li>
<li>It manages the flow: passing the user's message to the agent, interfacing with the <code>SessionService</code> to provide conversational context, coordinating any tool calls initiated by the agent, and streaming back the <code>Event</code> objects that detail the agent's thought process and final output.</li>

<h2 class="wp-block-heading">The Brain: Gemini 2.0 Flash</h2>
<p>The cognitive power behind Critic's Cut comes from Google's Gemini 2.0 Flash model.</p>
<li><strong>Complex Instruction Following:</strong> Gemini meticulously adheres to the detailed instructions provided to the Agent, ensuring reviews are consistently formatted with specific aspects, ratings, emojis, and sourced links.</li>
<li><strong>Nuanced Contextual Reasoning:</strong> The model effectively utilizes the conversation history (managed by ADK) to maintain coherence across multiple turns and accurately interpret pronouns or implicit references in follow-up queries.</li>
<li><strong>Multilingual Fluency:</strong> Gemini demonstrates a strong understanding of queries in diverse languages (tested with Spanish, French, Korean, and German). It can frame its conversational responses (greetings, clarifications) in the user's language. While the core review content language is often dictated by the availability of information from web searches (primarily English), the agent presents this clearly.</li>
<li><strong>Intelligent Tool Invocation:</strong> Based on the prompt and its instruction set, Gemini autonomously decides when to call the google_search tool to gather the necessary information for a review.</li>

<h2 class="wp-block-heading"><strong>The Guardian: Automated Evaluation &amp; Safety Pipeline</strong></h2>
<p>To ensure responsible and high-quality interactions, and inspired by <a href="https://google.github.io/adk-docs/safety/">ADK safety guidelines</a>, <em>Critic's Cut </em>incorporates a critical pre-response evaluation pipeline. Before any generated content is surfaced to the user, it's vetted through a series of automated checks:</p>

```
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
<li><strong>Initial Intent Check:</strong> <code>is_movie_or_show_query(...)</code> is a regex-based function provides a first-pass filter on the user's prompt to determine if it's movie-related, helping to gate subsequent, more intensive evaluations. It prevents unnecessary compute cycles and enforces topic safety.</li>
<li><strong>Critical Safety Gates (Response Withheld on Failure):</strong> These checks are non-negotiable for user safety.<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li><strong>Toxicity Screening:</strong> <code>better-profanity</code> is a Python library for detecting and censoring profanity in text. So we use <code>profanity.contains_profanity()</code> to filter out inappropriate language.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>PII Shielding:</strong> <code>presidio-analyzer</code> is a part of the Presidio framework by Microsoft for detecting PII (Personally Identifiable Information) in text. Our tool employs <code>analyzer.analyze()</code> to detect and prevent leakage of entities like email addresses and phone numbers.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Prompt Injection Defense:</strong> A custom check using regular expressions, refer <code>check_prompt_injection(...)</code>, scans for common phrases indicative of attempts to manipulate the agent or reveal its system prompts.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>
<li><strong>Content Quality &amp; Formatting Checks (Informational Flags &amp; Soft Gates):</strong> These ensure the agent adheres to its defined role and output standards.<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li><strong>Language Consistency:</strong> <code>langdetect</code> is a Python library for language detection, supporting a wide range of languages. <code>check_language(...)</code> verifies if the agent's primary response language aligns with the <code>expected_lang_code</code> (usually derived from the user's query language).</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Rejection Logic </strong> <code>check_rejection(...)</code> is a function, supported by the refined <code>is_topic_movie_for_rejection_check</code> logic (which infers topic from agent response format for follow-ups), assesses if the agent correctly declined off-topic queries or appropriately handled on-topic ones without undue rejection.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Review Structure Compliance:</strong> <code>check_has_ratings_and_emojis(...)</code> and <code>check_has_sources(...)</code> validate that essential review components (star ratings, emojis, source links) are present.</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Source Faithfulness:</strong> <code>check_faithfulness(...)</code> verifies that cited sources, when a review is provided, include names from a predefined list of reputable (currently English-centric) domains (e.g., IMDb, Rotten Tomatoes, BBC). This might flag valid foreign-language sources if they are not on this list.</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>

<h2 class="wp-block-heading"><strong>Some Insights &amp; The Path Forward</strong></h2>
<p>The development of Critic's Cut highlighted several key engineering considerations:</p>
<li><strong>Asynchronous Operations in Interactive Environments:</strong> Managing <code>asyncio</code> correctly in Google Colab, especially ensuring that setup operations like session creation are fully awaited before dependent operations commence, is vital for stability. Wrapping cell logic in a main async def function and using top-level await proved effective.</li>
<li><strong>The Challenge of Context in Evaluation:</strong> Evaluating an agent's handling of contextual follow-ups purely based on the current user prompt is insufficient. Our evaluation logic for topic relevance and rejection had to be adapted to also consider cues from the <em>agent's response format</em> to better assess if it correctly understood the implicit context.</li>
<li><strong>Multilingual Realities:</strong> While Gemini offers robust multilingual understanding for conversational elements, the practical availability of sourced review content in diverse languages remains a factor. The agent is designed to reflect this, primarily summarizing English content if that's what <code>google_search</code> yields, while still attempting to engage in the user's language.</li>

<h2 class="wp-block-heading">Why This Matters</h2>
<p>This project showcases how Google ADK allows rapid prototyping of production-ready agents that are multilingual, safe, and intelligent. Integration of tools like search, moderation, and semantic scoring can be done with minimal setup. The agent exemplifies <strong>evaluation-driven development</strong>: each layer, from detection to moderation, contributes to building trusted AI experiences.</p>

<h2 class="wp-block-heading">Final Thoughts</h2>
<p>Intelligent agents must also be:</p>
<li>Context-aware</li>
<li>Multilingual</li>
<li>Safe</li>
<p>Google ADK provides a strong foundation to build such systems. This project illustrates the capabilities achievable with just a few lines of code. Future expansions could include voice-based or mobile integrations, feasible with ADK’s modular framework.</p>


<br>
<figure class="wp-block-pullquote"><blockquote><p>Hope you enjoyed this piece, check out the entire code on <a href="https://github.com/jigyasa-grover/critics-cut" target="_blank" rel="noreferrer noopener">github</a> 🎓</p></blockquote></figure>

<br><br>
<pre class="wp-block-preformatted">
Huge thanks to the Google ML Developer team for organizing #AISprint ✨
Google Cloud credits are provided for this project.
#BuildWithAI #BuildWithGemini #VertexSprint #VertexAISprint #AISprint #GeminiSprint
</pre>


