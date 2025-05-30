---
layout: post
type: blog
title: 🎥 Critic’s Cut - Building a Safe, Multilingual Movie Review Agent Using Google ADK + Gemini 2.0
comments: true
mathjax: true
---

<p>In the fast-evolving world of GenAI, conversational agents are becoming more intelligent, accessible, and mission-critical. This post is a deep dive into the design of a <strong>smart, multilingual, and safety-conscious movie/TV review agent</strong> using cutting-edge tools from Google, including:</p>


<li><a href="https://google.github.io/adk-docs/">Google's Agent Development Kit (ADK)</a></li>
<li><a href="https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-0-flash">Gemini 2.0 Flash</a></li>
<li><a href="https://google.github.io/adk-docs/tools/built-in-tools/#google-search">Google Search Tool</a></li>
<li>Sentence Embedding models</li>
<li>Safety libraries like <a href="https://microsoft.github.io/presidio/analyzer/">Microsoft's Presidio Analyzer </a> and <a href="https://pypi.org/project/better-profanity/">Better Profanity</a></li>


<figure class="wp-block-image size-large"><a href="https://jigyasagrover.wordpress.com/wp-content/uploads/2025/05/travel-in-style-rain-or-shine-smart-suitcase-packing-with-gemini-2.0-imagen-3-and-open-weather-f09fa7b3-1.png"><img src="https://jigyasagrover.wordpress.com/wp-content/uploads/2025/05/travel-in-style-rain-or-shine-smart-suitcase-packing-with-gemini-2.0-imagen-3-and-open-weather-f09fa7b3-1.png?w=940" alt="" class="wp-image-3522"/></a></figure>

<h2 class="wp-block-heading">Overview</h2>
<p>The goal is to build a simple agent that:</p>
<li>Understands queries about movies or TV shows</li>
<li>Uses real-time information from the web</li>
<li>Evaluates responses semantically</li>
<li>Supports multiple languages</li>
<li>Ensures safety by redacting PII and blocking offensive content</li>
<p><a href="https://google.github.io/adk-docs/">Google ADK</a> is used to abstract the complexity of LLM-based agent workflows into modular, composable components.</p>

<h3 class="wp-block-heading">Type of Agent</h3>
<p>A <strong><a href="https://google.github.io/adk-docs/agents/llm-agents/">tool-augmented LLM agent</a></strong> is implemented that uses the <code>google_search</code> tool for live knowledge and combines it with generative reasoning powered by Gemini 2.0 Flash. This agent is dynamic and not limited by a knowledge cutoff. It fetches the latest web content and synthesizes informative answers in the user's preferred language. Supported functionalities include:</p>
<li><strong>Question answering</strong> about movie/TV facts, reviews, and cast details</li>
<li><strong>Multilingual comprehension</strong> and generation (English, Hindi, Spanish, etc.)</li>
<li><strong>Tool-use orchestration</strong> via ADK’s structured <code>tools</code> interface</li>
<li><strong>Safety enforcement</strong> inline during response generation</li>

<h2 class="wp-block-heading">Architecture Summary</h2>
<li><strong>Intent Validation</strong><!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>A regex-based filter ensures the query is relevant to the movie/TV domain</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Prevents unnecessary compute cycles and enforces topic safety</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>

<li><strong>Language Detection</strong><!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li><code>langdetect</code> is used to infer the language of the incoming query</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Language context is set for downstream generation and evaluation</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>

<li><strong>Web Search Retrieval</strong><!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>ADK’s <a href="https://google.github.io/adk-docs/tools/built-in-tools/">Google Search Tool</a> fetches up-to-date, relevant documents</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>This grounding step provides factual context to the LLM</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>

<li><strong>Gemini 2.0 Flash Response Generation</strong><!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>A fast, lightweight generative model ideal for chat-style responses</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Synthesizes natural language answers using retrieved content, filtered for safety</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>

<li><strong>Safety Moderation Layer</strong><!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li><code>Presidio Analyzer</code> scans output text for PII (names, emails, phone numbers)</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><code>better-profanity</code> screens for offensive language</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Redactions or content blocking occur before delivery</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>

<li><strong>Multilingual Semantic Evaluation</strong><!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li><code>sentence-transformers</code> with multilingual embeddings assess semantic match between response and expected answer</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Cosine similarity is used to gauge accuracy</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>

<li><strong>Feedback Loop / Logging (Optional Extension)</strong><!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li>Interactions are logged for auditing and tuning</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Edge cases can be reviewed manually</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></li>

<p>This composable design enables plug-and-play tooling, model swaps, and scaling beyond entertainment domains.</p>

<h3 class="wp-block-heading">🛠️ Setup &amp; Libraries</h3>

```
!pip install google-adk --quiet
!pip install sentence-transformers --quiet
!pip install langdetect --quiet
!pip install presidio-analyzer --quiet
!pip install better-profanity --quiet

import os
import re
from google.adk.tools import google_search
from google.adk.agents import Agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from IPython.display import Markdown, display
from google.colab import userdata

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from langdetect import detect, DetectorFactory
from presidio_analyzer import AnalyzerEngine
from better_profanity import profanity
```

<h3 class="wp-block-heading">🌐 Query Detection Logic</h3>

```
def is_movie_or_show_query(query: str) -> bool:
    """
    Checks if the query is about a movie or TV show.
    Returns True if it is, otherwise False.
    """
    keywords = ["movie", "show", "series", "film", "tv", "television", "drama", "anime"]
    if any(re.search(rf'\b{kw}\b', query, re.IGNORECASE) for kw in keywords):
        return True
    if re.search(r'(reviews? for|find reviews? for|about) .+', query, re.IGNORECASE):
        return True
    return False
```

<h3 class="wp-block-heading">🎥 Building the Agent</h3>

<p>Using ADK, defining an agent is modular and streamlined. Tools and logic flow are specified:</p>

```
movie_review_agent = Agent(
    name="MovieReviewAgent",
    model=MODEL_GEMINI_2_0_FLASH,
    instruction="""
      You are a movie and TV show review assistant.

      When the user asks for reviews of a specific movie or TV show:
      - Use Google Search to find recent, authoritative reviews.
      - Summarize the 
      ........
      ........
      ........
      ........
      ........
      ........
      If the user asks an unrelated question:
      *Sorry, I only answer questions about movies and TV shows.*
      """,
          tools=[google_search]
)
```

<p><code>Runner</code> and <code>SessionService</code> manage the conversation flow. Input queries are checked, web search is called, results are processed by Gemini Flash, and a response is generated.</p>

<h3 class="wp-block-heading">🌎 Multilingual Evaluation</h3>

<p>To ensure high relevance across languages:</p>
<li>Query language is detected using <code>langdetect</code></li>
<li>Semantic similarity is computed between actual vs. expected responses</li>

```
model = SentenceTransformer("distiluse-base-multilingual-cased")
sim = cosine_similarity([model.encode(res1)], [model.encode(res2)])[0][0]
```
<p>High similarity indicates semantic alignment.</p>

<h3 class="wp-block-heading">❌ High Failure Rate Explained</h3>
<p>A high multilingual output failure rate was observed. Investigation revealed the root cause: low-quality or incomplete reference examples. Many test prompts lacked ideal targets or consistent formatting. Key lesson: <strong>evaluation is only as strong as its reference data</strong>. Future plans include:</p>
<li>Curating better reference sets</li>
<li>Introducing human-in-the-loop review</li>
<li>Automating similarity thresholds by language</li>

<h3 class="wp-block-heading">🔒 Safety &amp; Moderation</h3>
<p>Inspired by <a href="https://google.github.io/adk-docs/safety/">ADK safety guidelines</a>, the following features were added:</p>

<h4 class="wp-block-heading">PII Redaction with Presidio</h4>
```
analyzer = AnalyzerEngine()
results = analyzer.analyze(text=output_text, language="en")
```
<p>Detected PII is redacted before delivery.</p>

<h4 class="wp-block-heading">Profanity Filtering</h4>
```
if profanity.contains_profanity(output_text):
    # Handle or block the response
```
<p>This prevents inappropriate content from being surfaced.</p>

<h2 class="wp-block-heading">Why This Matters</h2>
<p>This project showcases how Google ADK allows rapid prototyping of production-ready agents that are multilingual, safe, and intelligent. Integration of tools like search, moderation, and semantic scoring can be done with minimal setup. The agent exemplifies <strong>evaluation-driven development</strong>: each layer, from detection to moderation, contributes to building trusted AI experiences.</p>

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


