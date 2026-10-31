# [jigyasa-grover.github.io](https://jigyasa-grover.github.io/)

Official personal website, technical writing journal, and inbound collaboration hub of **Jigyasa Grover** — Machine Learning Engineer (Tech Lead at Uber), 13× AI & Open Source Award Winner, Google Developer Advisory Board member, LinkedIn Learning Instructor, Author of *Sculpting Data for ML*, and International Keynote Speaker.

---

## Repository Structure

```text
.
├── _config.yml              # Jekyll site, SEO, permalink & build configuration
├── index.html               # Homepage (/)
├── _pages/                  # All standalone route pages & LLM Markdown endpoints
├── _posts/                  # 25 Markdown technical articles & archive (/:title/)
├── _data/                   # Single-source-of-truth YAML data (identity, courses, speaking, etc.)
├── _layouts/                # Base HTML5 templates (default, page, post)
├── _includes/               # Modular partials (head-seo, schema-graph, header, footer, forms)
├── _sass/                   # Design system tokens, layout, components, post & syntax SCSS
├── assets/
│   ├── css/style.scss       # Compiled to /assets/css/style.css
│   ├── js/site.js           # Progressive-enhancement vanilla JS
│   └── images/              # Web-optimized portraits (opt/) & press kit downloads (press/)
├── images/                  # Preserved legacy post & media assets (/images/*)
├── scripts/audit_site.py    # Automated route, link, SEO, JSON-LD & GEO audit script
├── .github/workflows/ci.yml # Continuous integration build & audit pipeline
├── robots.txt               # Search & AI agent crawler directives
├── ads.txt                  # Preserved publisher verification file
├── Makefile                 # Developer task shortcuts
└── AGENTS.md                # AI coding agent maintainer guide
```

## Quick Start & Verification

```bash
# 1. Install Ruby dependencies locally
make install

# 2. Run local live-preview server at http://127.0.0.1:4000/
make serve

# 3. Build production _site/ and run full 44-page SEO, link & JSON-LD audit
make audit
```

## Updating Site Content

All structured biographical, career, speaking, course, project, award, and FAQ content is driven from `_data/*.yml`. Updating a YAML file automatically updates:
1. The corresponding HTML pages (`index.html` and `_pages/*.html`),
2. Connected Schema.org JSON-LD `@graph` entities (`_includes/schema-graph.html`), and
3. Machine-readable LLM context endpoints (`/llms.txt`, `/.well-known/llms.txt`, and `/llms-full.txt`).

## Contact Form Endpoint Setup (Optional)

The inquiry form on `/work-with-me/#contact` enforces client-side validation, honeypot + timing bot checks, and zero exposed secrets. When `contact.formspree_endpoint` and `contact.web3forms_access_key` in `_config.yml` are blank, submissions gracefully open a pre-formatted email draft to `contact.fallback_email`. Setting either endpoint in `_config.yml` enables 1-click asynchronous JSON `POST` delivery automatically.

## Branch Strategy

- `backup/pre-redesign-2026`: Untouched archival snapshot prior to the 2026 modernization (`3d37bba`).
- `feat/redesign-2026`: Active 2026 editorial & brand transformation branch.
- `master`: Production GitHub User Pages deployment branch.
