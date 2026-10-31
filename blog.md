---
layout: page
title: "Technical Writing & Essays"
heading: "Deep dives on Agentic AI, LLM evaluation, fine-tuning, and data-centric ML."
eyebrow: "Technical Journal"
lead: "24 engineering essays, architectural tutorials, and research notes—plus historical open-source writing."
hero_cta_label: "Subscribe via RSS"
hero_cta_url: "/feed.xml"
seo_title: "Technical Blog & AI Engineering Essays — Jigyasa Grover"
description: "Technical articles and tutorials by Jigyasa Grover covering Agentic AI, Google ADK, Gemini, Cloud TPU fine-tuning, LLM evaluation, privacy-preserving ML, and data-centric AI."
permalink: /blog/
---

<div class="filter-bar" role="region" aria-label="Filter and search technical articles">
  <div class="filter-pills" role="group" aria-label="Filter by topic">
    <button type="button" class="filter-btn is-active" data-blog-filter="all">All Articles</button>
    <button type="button" class="filter-btn" data-blog-filter="agentic ai & evaluation">Agentic AI &amp; Evaluation</button>
    <button type="button" class="filter-btn" data-blog-filter="agentic infrastructure">Agentic Infrastructure</button>
    <button type="button" class="filter-btn" data-blog-filter="fine-tuning & compute">Fine-Tuning &amp; Compute</button>
    <button type="button" class="filter-btn" data-blog-filter="edge & real-time ai">Edge &amp; Real-Time AI</button>
    <button type="button" class="filter-btn" data-blog-filter="data-centric ai">Data-Centric AI</button>
    <button type="button" class="filter-btn" data-blog-filter="responsible ai & privacy">Responsible AI &amp; Privacy</button>
  </div>

  <div>
    <label for="blog-search" class="sr-only">Search articles by keyword</label>
    <input id="blog-search" type="search" class="search-input" placeholder="Search articles, tools, topics…" />
  </div>
</div>

<div class="ledger">
  {% for post in site.posts %}
    {% unless post.url == "/archive/" %}
      {% assign meta = site.data.posts_meta[post.url] %}
      {% assign words = post.content | strip_html | number_of_words %}
      {% assign mins = words | divided_by: 210 | plus: 1 %}
      {% assign cat_name = meta.category | default: "AI Engineering" %}
      {% assign tags_joined = meta.tags | join: " " %}
      <article
        class="ledger-row"
        data-post-item
        data-category="{{ cat_name | downcase | escape }}"
        data-search="{{ post.title | escape }} {{ meta.summary | escape }} {{ cat_name | escape }} {{ tags_joined | escape }}"
      >
        <div class="ledger-row__date">
          <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%b %-d, %Y" }}</time>
          <div style="margin-top: 0.2rem; font-size: 0.7rem;">{{ mins }} min read</div>
        </div>

        <div>
          <div class="ledger-row__title"><a href="{{ post.url }}">{{ post.title }}</a></div>
          {% if meta and meta.summary %}
            <p class="ledger-row__sub" style="margin-bottom: 0.55rem;">{{ meta.summary }}</p>
          {% else %}
            <p class="ledger-row__sub" style="margin-bottom: 0.55rem;">{{ post.excerpt | strip_html | truncate: 180 }}</p>
          {% endif %}
          {% if meta and meta.tags %}
            <div class="tag-row" style="margin-bottom: 0;">
              {% for t in meta.tags %}
                <span class="mono-tag">{{ t }}</span>
              {% endfor %}
            </div>
          {% endif %}
        </div>

        <div class="ledger-row__aside">{{ cat_name }}</div>
      </article>
    {% endunless %}
  {% endfor %}
</div>

<p id="blog-empty-state" style="display: none; padding: 2rem 0; color: var(--ink-muted); font-family: var(--font-mono); font-size: 0.85rem;">
  No articles matched your current filter. Clear your search term or select "All Articles".
</p>

<!-- Preserved Historical WordPress Archive Notice -->
<div class="contact-panel" style="margin-top: 3.5rem; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem;">
  <div>
    <div class="eyebrow" style="margin-bottom: 0.3rem;">Earlier Open-Source &amp; Research Posts (2014 – 2020)</div>
    <h2 style="font-size: 1.35rem; margin-bottom: 0.25rem;">Looking for earlier Google Summer of Code &amp; Pharo articles?</h2>
    <p style="margin-bottom: 0;">All earlier posts remain archived on WordPress and via the preserved <a href="/archive/">/archive/</a> page.</p>
  </div>
  <a class="btn btn--secondary" href="https://jigyasagrover.wordpress.com/" target="_blank" rel="noopener">Visit WordPress Archive ↗</a>
</div>
