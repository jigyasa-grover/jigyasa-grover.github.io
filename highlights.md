---
layout: page
title: "Highlights & Recognition Gallery"
heading: "Visual archive of keynotes, broadcasts, awards, and community milestones."
eyebrow: "Visual Highlights"
lead: "Moments from Codemotion Milan 2026, Google I/O, Google Gemini ecosystem events, TEDAI San Francisco, live television commentary, and 13× open-source & AI honors."
hero_cta_label: "Full Press & Awards Ledger →"
hero_cta_url: "/press/"
seo_title: "Highlights & Awards Gallery — Jigyasa Grover"
description: "Visual highlights from Jigyasa Grover's career: Codemotion Milan 2026, Google Gemini Early Access, Google I/O Keynote, TEDAI SF, VentureBeat Women in AI, and Red Hat Open Source Award."
permalink: /highlights/
---

<div class="gallery-grid" style="margin-bottom: 3.5rem;">
  {% for item in site.data.recognition.visual_highlights %}
  <a class="gallery-card" href="{{ item.url }}" {% if item.url contains 'http' %}target="_blank" rel="noopener"{% endif %}>
    <img
      src="{{ item.image }}"
      width="{{ item.width }}"
      height="{{ item.height }}"
      loading="lazy"
      {% if item.focal %}style="object-position: {{ item.focal }};"{% endif %}
      alt="{{ item.title }} — {{ item.subtitle }}"
    />
    <div class="gallery-card__body">
      <h2 class="gallery-card__title">{{ item.title }}</h2>
      <p class="gallery-card__sub">{{ item.subtitle }} {% if item.url contains 'http' %}↗{% else %}→{% endif %}</p>
    </div>
  </a>
  {% endfor %}
</div>

<div class="contact-panel" style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1.25rem;">
  <div>
    <h2 style="font-size: 1.35rem; margin-bottom: 0.25rem;">Looking for the full 13× awards list, press links, or speaker bios?</h2>
    <p style="margin-bottom: 0;">Visit the Press &amp; Media Kit for complete citations and downloadable headshots.</p>
  </div>
  <a class="btn btn--primary" href="/press/">Open Press &amp; Media Kit →</a>
</div>
