{% assign target_post = site.posts | where: "url", include.post_url | first %}{% assign m = site.data.posts_meta[include.post_url] %}# {{ target_post.title }}

- **Author:** Jigyasa Grover (https://jigyasa-grover.github.io/#person)
- **Published:** {{ target_post.date | date: "%Y-%m-%d" }}
- **Category:** {{ m.category }}
- **Tags:** {{ m.tags | join: ", " }}
- **Canonical Article (Full HTML + Code + Diagrams):** https://jigyasa-grover.github.io{{ include.post_url }}
{% if m.repo_url %}- **GitHub Repository:** {{ m.repo_url }}
{% endif %}{% if m.live_url %}- **Interactive Demo / Colab Notebook:** {{ m.live_url }}
{% endif %}{% if m.skill_url %}- **Drop-In Agent Skill (`SKILL.md`):** {{ m.skill_url }}
{% endif %}
## Executive Summary

{{ m.summary }}

{% if m.faqs %}## Technical FAQ & Key Takeaways

{% for item in m.faqs %}### {{ item.q }}
{{ item.a }}

{% endfor %}{% endif %}## About the Author

{{ site.data.identity.short_bio_50 }}

- **Full Entity Corpus:** https://jigyasa-grover.github.io/llms-full.txt
- **Structured Agent Context:** https://jigyasa-grover.github.io/agent-context.json
- **Collaborate & Advisory:** https://jigyasa-grover.github.io/work-with-me/

