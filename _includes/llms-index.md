# Jigyasa Grover

> Official digital home of Jigyasa Grover (pronounced {{ site.data.identity.pronunciation }}; Google Knowledge Graph: https://g.co/kgs/Lvk5yk) — Machine Learning Engineer at Uber (Tech Lead — Rider Personalization & Ranking), 13x AI & Open Source Award Winner, Google Developer Advisory Board (gDAB) member, Google Developer Expert (AI/ML), LinkedIn Learning Instructor (44,000+ learners), international keynote speaker (Google I/O main stage, 200+ talks across 20+ countries), and co-author of *Sculpting Data for ML*.

For complete structured biographical, career, speaking, course, publication, and project context, see [llms-full.txt](https://jigyasa-grover.github.io/llms-full.txt) and machine-readable JSON at [agent-context.json](https://jigyasa-grover.github.io/agent-context.json) (also exposed in-browser via W3C WebMCP `document.modelContext`).

## Primary Pages

- [Home](https://jigyasa-grover.github.io/): Overview of engineering work, speaking, courses, publications, and collaboration pillars.
- [About Jigyasa Grover](https://jigyasa-grover.github.io/about): Authoritative biography, Google & governance board roles, and Entity FAQ.
- [Experience & Career Timeline](https://jigyasa-grover.github.io/experience/): Full career at Uber, Bordo AI, Faire, Twitter/X, Meta, education (UC San Diego M.S. CS; Cornell, Maryland, Max Planck Pre-doctoral Research School; DTU B.Tech.), and 2017–2026 milestone archive.
- [Work With Me](https://jigyasa-grover.github.io/work-with-me/): Six collaboration pillars, booking links (Intro, Topmate, Passionfroot, Naano), and direct inquiry form.
- [AI Startup & Product Advisory](https://jigyasa-grover.github.io/advisory/): Advisory & consulting across 30+ organizations on production ML ranking, Agentic AI architecture, LLM evaluation, and token cost guardrails.
- [Keynotes & Conference Speaking](https://jigyasa-grover.github.io/speaking/): Signature talk abstracts, Google I/O keynote feature, and 200+ global appearances.
- [Corporate AI Training & Courses](https://jigyasa-grover.github.io/teaching/): Enterprise AI training & workshops delivered with LinkedIn Learning, Morgan Stanley, FedEx, Accenture, Roblox, Silicon Valley Security Group, AI Aspire, Udacity, and CommonSpirit Health, plus 4 LinkedIn Learning courses (44,000+ learners, 4.6–4.8★ across 180+ ratings).
- [Technical Content & Brand Partnerships](https://jigyasa-grover.github.io/partnerships/): Engineering-led developer content, audience demographics (82% senior technical), and brand partners.
- [Selected Engineering Projects](https://jigyasa-grover.github.io/projects/): Open-source agentic AI systems, TPU fine-tuning, edge/cloud racing telemetry, and RAG benchmarks.
- [Books & Publications](https://jigyasa-grover.github.io/publications/): *Sculpting Data for ML* (ISBN 979-8585463570, 4.8★ Goodreads, 95+ citations), *Enterprise LLM Deployment Readiness* (SSRN 2026), Springer chapters, and ACM research.
- [Press, Media & Speaker Kit](https://jigyasa-grover.github.io/press/): Forbes, Business Insider, VentureBeat, Observer, 13+ awards ledger, copyable bios, and press photos.
- [Quick Links & Slide QR Hub](https://jigyasa-grover.github.io/links/): Unified link-in-bio, 5.0★ 1:1 booking links, upcoming stage, courses, and downloadable conference slide QR code.
- [Technical Blog](https://jigyasa-grover.github.io/blog/): 33 in-depth technical articles and essays (plus 57 self-hosted 2015–2017 open-source archive entries at `/archive/`).

## Direct Collaboration & Booking Platforms

- [Intro (1:1 Technical & Startup Consultations — 5.0★)](https://intro.co/JigyasaGrover)
- [Topmate (Mentorship, Career Strategy & Quick Calls — 5.0★, 126+ bookings)](https://topmate.io/jigyasagrover)
- [Passionfroot (Sponsored Developer Content & Brand Campaigns)](https://www.passionfroot.me/jigyasa-grover)
- [Naano (B2B & Developer Creator Collaborations)](https://naano.com/creators/jigyasa-grover)

## Technical Articles & Essays

{% for post in site.posts %}{% unless post.url == "/archive/" or post.archival %}{% assign m = site.data.posts_meta[post.url] %}- [{{ post.title }}](https://jigyasa-grover.github.io{{ post.url }}) ({{ post.date | date: "%Y-%m-%d" }}){% if m.summary %}: {{ m.summary }}{% endif %}
{% endunless %}{% endfor %}
