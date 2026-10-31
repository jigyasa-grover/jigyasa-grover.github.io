---
layout: page
title: "Highlights & Recognition Gallery"
heading: "Visual archive of keynotes, broadcasts, awards, and community milestones."
eyebrow: "Visual Highlights"
lead: "Moments from Google I/O, live television commentary, open-source honors, and industry awards."
hero_cta_label: "Full Press & Awards Ledger →"
hero_cta_url: "/press/"
seo_title: "Highlights & Awards Gallery — Jigyasa Grover"
description: "Visual highlights from Jigyasa Grover's career: Google I/O 2024 Keynote, VentureBeat Women in AI Rising Star, Red Hat Women in Open Source Award, and NTD Live TV."
permalink: /highlights/
---

<div class="gallery-grid" style="margin-bottom: 3.5rem;">
  {% for item in site.data.recognition.visual_highlights %}
  <a class="gallery-card" href="{{ item.url }}" target="_blank" rel="noopener">
    <img
      src="{{ item.image }}"
      width="{{ item.width }}"
      height="{{ item.height }}"
      loading="lazy"
      alt="{{ item.title }} — {{ item.subtitle }}"
    />
    <div class="gallery-card__body">
      <h2 class="gallery-card__title">{{ item.title }}</h2>
      <p class="gallery-card__sub">{{ item.subtitle }} ↗</p>
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
