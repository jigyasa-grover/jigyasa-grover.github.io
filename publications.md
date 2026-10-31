---
layout: page
title: "Books & Peer-Reviewed Publications"
heading: "Books, Springer research chapters, ACM proceedings, and editorial reviewing."
eyebrow: "Pillar 05 · Author & Researcher"
lead: "Examining data-centric machine learning, privacy-preserving ML, synthetic media detection, and multi-agent spatial modeling."
hero_cta_label: "Google Scholar Profile ↗"
hero_cta_url: "https://scholar.google.com/citations?user=nURar74AAAAJ"
seo_title: "Books & Publications — Jigyasa Grover | Sculpting Data for ML, Springer & ACM"
description: "Published books and peer-reviewed research by Jigyasa Grover: Sculpting Data for ML (ISBN 979-8585463570), Springer privacy-preserving ML & deepfake chapters, and ACM agent-based modeling."
og_image: "/assets/images/opt/book_cover.jpg"
permalink: /publications/
---
{% assign pub = site.data.publications %}

<!-- Featured Book Monograph -->
<section style="margin-bottom: 4.5rem;" aria-labelledby="featured-book-heading">
  <div class="feature-split feature-split--book">
    <div class="media-frame" style="max-width: 300px;">
      <img
        src="{{ pub.featured_book.cover_image }}"
        width="517"
        height="800"
        fetchpriority="high"
        alt="Cover of Sculpting Data for ML: The First Act of Machine Learning"
      />
      <div class="media-frame__caption">ISBN {{ pub.featured_book.isbn }} · {{ pub.featured_book.citations }}</div>
    </div>

    <div>
      <div class="eyebrow">Published Book ({{ pub.featured_book.year }})</div>
      <h2 id="featured-book-heading">{{ pub.featured_book.title }}</h2>
      <p>{{ pub.featured_book.summary }}</p>
      <p>
        Championed across <strong>25+ international conference talks and workshops</strong> under the <strong>#DataForML</strong> initiative—including PyCon US, LeadDev Live, MLconf, All Things Open, and GDG events worldwide.
      </p>

      <div style="margin: 1.5rem 0; padding: 1.15rem 1.25rem; background-color: var(--bg-subtle); border-left: 2px solid var(--accent);">
        <div style="font-family: var(--font-mono); font-size: 0.73rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-muted); margin-bottom: 0.45rem;">
          Endorsed with Forewords By
        </div>
        <ul style="margin: 0; padding-left: 1.15rem; font-size: 0.92rem;">
          {% for f in pub.featured_book.forewords %}
          <li><a href="{{ f.url }}" target="_blank" rel="noopener"><strong>{{ f.name }}</strong></a> — {{ f.affiliation }}</li>
          {% endfor %}
        </ul>
      </div>

      <div class="btn-group">
        <a class="btn btn--primary" href="{{ pub.featured_book.amazon_url }}" target="_blank" rel="noopener">Order on Amazon (Print &amp; Kindle) ↗</a>
        <a class="btn btn--secondary" href="{{ pub.featured_book.goodreads_url }}" target="_blank" rel="noopener">Goodreads ↗</a>
        <a class="btn btn--secondary" href="{{ pub.featured_book.launch_post_url }}">Read Book Launch Essay →</a>
      </div>
    </div>
  </div>
</section>

<!-- Peer-Reviewed Chapters & Academic Papers -->
<section style="padding-top: 3.25rem; border-top: 1px solid var(--rule-light); margin-bottom: 4rem;" aria-labelledby="research-papers-heading">
  <div class="eyebrow">Peer-Reviewed Chapters &amp; Proceedings</div>
  <h2 id="research-papers-heading">Academic &amp; Open-Source Publications</h2>

  <div class="ledger" style="margin-top: 1.5rem;">
    {% for r in pub.research_publications %}
    <div class="ledger-row">
      <div class="ledger-row__date">{{ r.year }} · {{ r.type }}</div>
      <div>
        <div class="ledger-row__title"><a href="{{ r.doi_url }}" target="_blank" rel="noopener">{{ r.title }} ↗</a></div>
        <p style="font-family: var(--font-mono); font-size: 0.76rem; color: var(--accent); margin-bottom: 0.45rem;">{{ r.venue }}</p>
        <p class="ledger-row__sub">{{ r.summary }}</p>
      </div>
      <div class="ledger-row__aside"><a href="{{ r.doi_url }}" target="_blank" rel="noopener">Publisher Link ↗</a></div>
    </div>
    {% endfor %}
  </div>
</section>

<!-- Technical Manuscript Reviewing -->
<section style="padding-top: 3.25rem; border-top: 1px solid var(--rule-light);" aria-labelledby="reviewing-heading">
  <div class="eyebrow">Editorial &amp; Peer Review</div>
  <h2 id="reviewing-heading">Technical Book Reviewing</h2>
  <div class="ledger">
    {% for ed in pub.editorial_reviewing %}
    <div class="ledger-row">
      <div class="ledger-row__date"><a href="{{ ed.url }}" target="_blank" rel="noopener">{{ ed.org }} ↗</a></div>
      <div>
        <p class="ledger-row__sub" style="color: var(--ink-primary);">{{ ed.role }}</p>
      </div>
      <div class="ledger-row__aside">Reviewer</div>
    </div>
    {% endfor %}
  </div>
</section>
