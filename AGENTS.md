# AGENTS.md — AI Maintainer & Contributor Guide

This repository powers **[jigyasa-grover.github.io](https://jigyasa-grover.github.io/)** — the official personal website, technical journal, and inbound collaboration hub of **Jigyasa Grover**.

## 1. Repository Layout

- `index.html`: Flagship homepage (`/`).
- `_pages/`: All standalone route templates and machine-readable GEO endpoints (`404.html`, `about.html`, `advisory.html`, `blog.html`, `experience.html`, `highlights.html`, `partnerships.html`, `press.html`, `projects.html`, `publications.html`, `speaking.html`, `teaching.html`, `work-with-me.html`, `llms.txt`, `well-known-llms.txt`, `llms-full.txt`). Every file in `_pages/` declares an explicit `permalink:`.
- `_data/`: Single source of truth YAML datasets:
  - `identity.yml`: Canonical `Person` entity (`#person`), short/medium bios, career roles, education, booking links (`Intro`, `Passionfroot`, `Naano`), and `sameAs` profile URLs.
  - `navigation.yml`: Header and footer menus.
  - `pillars.yml`: Six collaboration pillars surfaced on `/` and `/work-with-me/`.
  - `courses.yml`: LinkedIn Learning / Udacity courses, live corporate workshops, and `training_clients`.
  - `speaking.yml`: Featured Google I/O keynote, signature talk abstracts, and conference appearances.
  - `projects.yml`: Featured and archival engineering systems and open-source repos.
  - `publications.yml`: *Sculpting Data for ML* monograph, Springer chapters, ACM papers, and editorial reviewing.
  - `recognition.yml`: 13× awards, media features, visual highlights gallery (with per-photo `focal` coordinates), and brand partners.
  - `updates.yml`: Chronological career & speaking dispatches (2017–2026).
  - `posts_meta.yml`: Curated summaries, categories, and tags for the 24 technical articles.
  - `faqs.yml`: Structured Q&A blocks rendered visually via `_includes/faq-section.html` and injected into `FAQPage` JSON-LD via `_includes/schema-graph.html`.
- `_posts/`: Preserved Markdown technical articles (`permalink: /:title/`).
- `_layouts/` & `_includes/`: Semantic HTML5 layouts (`default.html`, `page.html`, `post.html`), SEO/OpenGraph head tags (`head-seo.html`), connected JSON-LD entity graph (`schema-graph.html`), header/footer, booking platforms, and contact form.
- `_sass/` & `assets/css/style.scss`: Editorial design system (`_tokens.scss`, `_base.scss`, `_layout.scss`, `_components.scss`, `_post.scss`, `_syntax.scss`).
- `assets/js/site.js`: Progressive-enhancement vanilla JS (theme toggle, mobile nav, post TOC & code copy buttons, blog search/filter, validated anti-spam inquiry form).
- `assets/images/`: Web-optimized photography (`opt/`) and high-resolution downloadable press portraits (`press/`).
- `images/`: Legacy static image directory retained strictly at `/images/...` so existing blog posts and external backlinks never 404.
- `scripts/audit_site.py`: Zero-dependency Python 3 build & SEO/GEO verification suite.

## 2. Hard Invariants (Never Violate)

1. **Preserve Permalinks & Static Root Files**:
   - Never break `permalink: /:title/` for `_posts/`, `/about`, `/ads.txt`, `/robots.txt`, `/llms.txt`, `/.well-known/llms.txt`, `/llms-full.txt`, or `jekyll-redirect-from` aliases (`/collaborate/`, `/contact/`, `/workshops/`, `/courses/`, `/projectsDepricated/`).
   - Never delete or rename files inside `images/` referenced by historical posts.
2. **Data-First Updates**:
   - Update biographical facts, courses, speaking appearances, awards, or corporate training partners in `_data/*.yml` rather than duplicating prose across templates—this keeps HTML pages, JSON-LD `@graph`, `/llms.txt`, and `/llms-full.txt` automatically synchronized.
3. **Design System Discipline**:
   - Place layout, spacing, and component styling in `_sass/_layout.scss` or `_sass/_components.scss` rather than inline `style="..."` attributes (inline `object-position` is reserved strictly for per-photo focal cropping).
4. **Mandatory Verification Before Commit**:
   - Always run `make audit` (or `bundle exec jekyll build --trace && python3 scripts/audit_site.py`) and confirm **0 errors** before committing.
