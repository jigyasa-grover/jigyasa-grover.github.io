# Source Code for [jigyasa-grover.github.io](https://jigyasa-grover.github.io/) 👩🏻‍💻

Official personal website, technical writing journal, and collaboration hub of **Jigyasa Grover** — Machine Learning Engineer, Agentic AI Educator, Author, Advisor, and Keynote Speaker.

## Architecture Overview

- **Static Engine**: Jekyll (`permalink: /:title/`), natively compatible with GitHub User Pages (`master` branch).
- **Single Source of Truth (`_data/`)**:
  - `_data/identity.yml`: Canonical `Person` entity metadata, bios, career history, education, booking URLs, and verified `sameAs` links.
  - `_data/pillars.yml`: Six collaboration pillars for `/work-with-me/` and the homepage matrix.
  - `_data/projects.yml`, `_data/courses.yml`, `_data/speaking.yml`, `_data/publications.yml`, `_data/recognition.yml`, `_data/updates.yml`, `_data/faqs.yml`, `_data/posts_meta.yml`.
- **Editorial Design System (`_sass/` & `style.scss`)**: Warm archival light palette + optional dark reading theme (`[data-theme="dark"]`), `Newsreader` + `Plus Jakarta Sans` + `JetBrains Mono` typography, zero CSS framework bloat.
- **SEO, Entity Graph & GEO**:
  - `_includes/head-seo.html` & `_includes/schema-graph.html`: Connected JSON-LD `@graph` (`Person`, `WebSite`, `ProfilePage`, `BlogPosting`, `Book`, `Course`, `FAQPage`, `BreadcrumbList`).
  - `/llms.txt`, `/llms-full.txt`, `/sitemap.xml`, `/feed.xml`, and `/robots.txt`.

## Contact Form Setup (Optional Direct Inbox Endpoint)

The contact form on `/work-with-me/#contact` includes client-side validation, honeypot + timing bot protection, and zero exposed secrets. By default, when no external endpoint is configured, validated submissions open a pre-formatted email draft to `contact.fallback_email`.

To enable 1-click serverless inbox delivery without opening an email client:
1. Create a free form endpoint at [Formspree](https://formspree.io/) (or [Web3Forms](https://web3forms.com/)).
2. Open `_config.yml` and set `contact.formspree_endpoint: "https://formspree.io/f/YOUR_FORM_ID"` (or `contact.web3forms_access_key`).
3. Commit and deploy—`assets/js/site.js` automatically switches to asynchronous JSON `POST` delivery.

## Local Development

```bash
bundle install --path vendor/bundle
bundle exec jekyll serve --port 4000
```

## Branch Preservation

- `backup/pre-redesign-2026`: Untouched archival snapshot of the pre-redesign website (`3d37bba`).
- `feat/redesign-2026`: Modernized personal brand & editorial redesign branch.
