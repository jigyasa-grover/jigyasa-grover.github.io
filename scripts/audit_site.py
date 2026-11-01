#!/usr/bin/env python3
"""Automated build, route, link, SEO, JSON-LD & GEO audit for jigyasa-grover.github.io."""

import json
import os
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

REPO_ROOT = Path(__file__).resolve().parent.parent
SITE_DIR = REPO_ROOT / "_site"

# GitHub Project Pages hosted separately under jigyasa-grover.github.io/<repo>/
EXTERNAL_SUBREPOS = {
    "/proof-of-work/",
    "/kinetic-finetuning-on-cloud-tpu/",
    "/sQuick_new/",
}

EXPECTED_POST_URLS = [
    "/ProofOfWork/",
    "/StartupOnAShoestring/",
    "/KineticFinetuningOnCloudTPU/",
    "/TrustAtTopSpeed/",
    "/ColabVSCodeExtension/",
    "/CriticsCutMultilingualContextADKAgent/",
    "/SmartSuitcasePackingUsingGeminiImagenOpenWeather/",
    "/SmarterThanA5thGrader-LLMComparatorOnGoogleVertexAI/",
    "/BookBuddyInteractiveStorytellingUsingAGemmaBasedRAG/",
    "/GoodbyeToNewsCopyWriterBlock-SupervisedFineTunedGeminiPro/",
    "/BifocalPerspectiveOfCAS/",
    "/HyperPersonalizedAdsGenAI/",
    "/ExploringDeepfakes/",
    "/Top3MLPapers/",
    "/DataCleaning-Cleanlab/",
    "/HumanDataAnnotators/",
    "/DifferentialPrivacy/",
    "/PrivacyPreservingML1/",
    "/DataLakes/",
    "/Data-Quality/",
    "/Data-Centric-ML/",
    "/Data-Cascades/",
    "/Polishing-Your-Dataset/",
    "/BOOK-LAUNCH-Sculpting-Data-for-ML/",
    "/archive/",
]

EXPECTED_ROUTES = [
    "/",
    "/about",
    "/blog/",
    "/publications/",
    "/highlights/",
    "/projects/",
    "/projectsDepricated/",
    "/experience/",
    "/404.html",
    "/work-with-me/",
    "/collaborate/",
    "/contact/",
    "/advisory/",
    "/speaking/",
    "/teaching/",
    "/workshops/",
    "/courses/",
    "/partnerships/",
    "/press/",
    "/assets/css/style.css",
    "/assets/js/site.js",
    "/ads.txt",
    "/robots.txt",
    "/sitemap.xml",
    "/feed.xml",
    "/llms.txt",
    "/.well-known/llms.txt",
    "/llms-full.txt",
    "/agent-context.json",
    "/favicon.ico",
    "/favicon.svg",
    "/apple-touch-icon.png",
    "/site.webmanifest",
]

FORBIDDEN_IN_SITE = [
    "AGENTS.md",
    "AGENTS.html",
    "README.md",
    "README.html",
    "Makefile",
    "Gemfile",
    "Gemfile.lock",
    "scripts",
]


class PageInspector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.in_title = False
        self.in_jsonld = False
        self.title = ""
        self.jsonld_blocks = []
        self._curr_jsonld = []
        self.metas = []
        self.links = []
        self.hrefs = []
        self.srcs = []
        self.h1_count = 0
        self.imgs_missing_alt = []
        self.is_redirect = False

    def handle_starttag(self, tag, attrs) -> None:
        ad = dict(attrs)
        if tag == "title":
            self.in_title = True
        elif tag == "h1":
            self.h1_count += 1
        elif tag == "meta":
            self.metas.append(ad)
            if ad.get("http-equiv", "").lower() == "refresh":
                self.is_redirect = True
        elif tag == "link":
            self.links.append(ad)
            if "href" in ad:
                self.hrefs.append(ad["href"])
        elif tag == "a" and "href" in ad:
            self.hrefs.append(ad["href"])
        elif tag == "script":
            if ad.get("type") == "application/ld+json":
                self.in_jsonld = True
                self._curr_jsonld = []
            if "src" in ad:
                self.srcs.append(ad["src"])
        elif tag == "img":
            if "src" in ad:
                self.srcs.append(ad["src"])
            if "alt" not in ad:
                self.imgs_missing_alt.append(ad.get("src", "unknown"))

    def handle_endtag(self, tag) -> None:
        if tag == "title":
            self.in_title = False
        elif tag == "script" and self.in_jsonld:
            self.in_jsonld = False
            self.jsonld_blocks.append("".join(self._curr_jsonld))

    def handle_data(self, data) -> None:
        if self.in_title:
            self.title += data
        elif self.in_jsonld:
            self._curr_jsonld.append(data)


def route_exists(route: str) -> bool:
    clean = route.split("#")[0].split("?")[0]
    if not clean or clean == "/":
        return (SITE_DIR / "index.html").is_file()
    if clean in EXTERNAL_SUBREPOS:
        return True
    rel = clean.lstrip("/")
    candidates = [
        SITE_DIR / rel,
        SITE_DIR / rel / "index.html",
        SITE_DIR / f"{rel}.html",
    ]
    return any(c.is_file() for c in candidates)


def main() -> None:
    if not SITE_DIR.is_dir():
        print(f"ERR: Build directory not found at {SITE_DIR}. Run `make build` first.")
        sys.exit(1)

    errors = []
    warnings = []

    # 1. Verify expected routes & preserved URLs
    for route in EXPECTED_ROUTES + EXPECTED_POST_URLS:
        if not route_exists(route):
            errors.append(f"MISSING EXPECTED ROUTE: {route}")

    # 2. Ensure repo maintainer files did not leak into _site/
    for item in FORBIDDEN_IN_SITE:
        if (SITE_DIR / item).exists():
            errors.append(f"FORBIDDEN REPO FILE LEAKED INTO _site/: {item}")

    # 3. Validate XML feeds
    for xml_file in ("sitemap.xml", "feed.xml"):
        xml_path = SITE_DIR / xml_file
        if xml_path.is_file():
            try:
                ET.parse(xml_path)
            except Exception as exc:
                errors.append(f"INVALID XML in {xml_file}: {exc}")

    # 4. Validate LLM context endpoints & RFC 9309 robots.txt
    for llm_rel in ("llms.txt", ".well-known/llms.txt", "llms-full.txt"):
        llm_path = SITE_DIR / llm_rel
        if llm_path.is_file():
            content = llm_path.read_text(encoding="utf-8")
            if len(content.strip()) < 500:
                errors.append(f"LLM ENDPOINT UNEXPECTEDLY SHORT: {llm_rel}")
            if "{{" in content or "{%" in content:
                errors.append(f"UNRENDERED LIQUID TAG IN {llm_rel}")

    robots_path = SITE_DIR / "robots.txt"
    if robots_path.is_file():
        robots_raw = robots_path.read_text(encoding="utf-8")
        if len(robots_raw.encode("utf-8")) > 65536:
            errors.append("robots.txt EXCEEDS SAFE SIZE THRESHOLD")
        seen_agents = set()
        seen_sitemaps = []
        in_group = False
        saw_rule_in_group = False
        for lineno, raw_line in enumerate(robots_raw.splitlines(), 1):
            line = raw_line.split("#", 1)[0].strip()
            if not line:
                continue
            if ":" not in line:
                errors.append(f"INVALID RFC 9309 SYNTAX in robots.txt:{lineno}: {raw_line}")
                continue
            field, val = [part.strip() for part in line.split(":", 1)]
            fl = field.lower()
            if fl == "user-agent":
                if saw_rule_in_group:
                    saw_rule_in_group = False
                in_group = True
                if not val:
                    errors.append(f"EMPTY User-agent in robots.txt:{lineno}")
                seen_agents.add(val)
            elif fl in ("allow", "disallow"):
                if not in_group:
                    errors.append(f"ORPHAN {field} BEFORE User-agent in robots.txt:{lineno}")
                saw_rule_in_group = True
                if val and not val.startswith(("/", "*")):
                    errors.append(f"INVALID PATH '{val}' in robots.txt:{lineno}")
            elif fl == "sitemap":
                seen_sitemaps.append(val)
            else:
                errors.append(f"NON-RFC-9309 DIRECTIVE '{field}' in robots.txt:{lineno}")
        for req_agent in (
            "*",
            "Googlebot",
            "Googlebot-Image",
            "Bingbot",
            "Applebot",
            "OAI-SearchBot",
            "ChatGPT-User",
            "GPTBot",
            "ClaudeBot",
            "Claude-SearchBot",
            "Claude-User",
            "PerplexityBot",
            "Perplexity-User",
            "Google-Extended",
            "Applebot-Extended",
        ):
            if req_agent not in seen_agents:
                errors.append(f"MISSING REQUIRED USER-AGENT '{req_agent}' in robots.txt")
        if "https://jigyasa-grover.github.io/sitemap.xml" not in seen_sitemaps:
            errors.append("MISSING CANONICAL Sitemap DIRECTIVE in robots.txt")

        import urllib.robotparser
        rp = urllib.robotparser.RobotFileParser()
        rp.parse(robots_raw.splitlines())
        for bot in ("Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "LinkedInBot", "AnyAgent"):
            for route in ("/", "/about", "/llms.txt", "/.well-known/llms.txt", "/llms-full.txt", "/sitemap.xml"):
                if not rp.can_fetch(bot, f"https://jigyasa-grover.github.io{route}"):
                    errors.append(f"robots.txt BLOCKED {bot} FROM {route}")

    sitemap_path = SITE_DIR / "sitemap.xml"
    if sitemap_path.is_file():
        sm_raw = sitemap_path.read_text(encoding="utf-8")
        if "404.html" in sm_raw:
            errors.append("404.html SHOULD NOT APPEAR IN sitemap.xml")
        if "/archive/" in sm_raw:
            errors.append("/archive/ STUB SHOULD NOT APPEAR IN sitemap.xml")

    # 5. Inspect all generated HTML pages
    html_files = sorted(
        Path(root) / f
        for root, _, files in os.walk(SITE_DIR)
        for f in files
        if f.endswith(".html")
    )

    titles_seen = {}
    jsonld_count = 0

    for path in html_files:
        rel_path = "/" + str(path.relative_to(SITE_DIR))
        raw = path.read_text(encoding="utf-8")

        parser = PageInspector()
        parser.feed(raw)

        for target in parser.hrefs + parser.srcs:
            if not target or target.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
                continue
            if target.startswith(("http://", "https://", "//")):
                parsed = urlparse(target)
                if parsed.netloc == "jigyasa-grover.github.io":
                    p_route = parsed.path or "/"
                    if not route_exists(p_route):
                        errors.append(f"BROKEN CANONICAL/SELF LINK in {rel_path}: {target}")
                continue
            if not route_exists(target):
                errors.append(f"BROKEN INTERNAL ASSET/LINK in {rel_path}: {target}")

        if "cdn.mathjax.org" in raw:
            errors.append(f"RETIRED MATHJAX CDN in {rel_path}")
        if "UA-172999305-1" in raw:
            errors.append(f"SUNSET UNIVERSAL ANALYTICS in {rel_path}")
        if "adsbygoogle" in raw:
            errors.append(f"ADSENSE SCRIPT FOUND in {rel_path}")

        standalone_paths = {
            "/index.html",
            "/about.html",
            "/404.html",
            "/advisory/index.html",
            "/blog/index.html",
            "/experience/index.html",
            "/highlights/index.html",
            "/partnerships/index.html",
            "/press/index.html",
            "/projects/index.html",
            "/publications/index.html",
            "/speaking/index.html",
            "/teaching/index.html",
            "/work-with-me/index.html",
        }
        is_post = rel_path not in standalone_paths
        if not is_post and "rishabhmisra" in raw.lower():
            errors.append(f"LEFTOVER TEMPLATE REFERENCE 'rishabhmisra' in {rel_path}")

        if parser.is_redirect:
            continue

        title = parser.title.strip()
        if not title:
            errors.append(f"EMPTY <title> in {rel_path}")
        else:
            if title in titles_seen:
                warnings.append(f"DUPLICATE <title> '{title}' in {rel_path} and {titles_seen[title]}")
            titles_seen[title] = rel_path

        desc = next((m.get("content", "").strip() for m in parser.metas if m.get("name") == "description"), "")
        if not desc:
            errors.append(f"MISSING meta description in {rel_path}")

        canon = next((l.get("href", "") for l in parser.links if l.get("rel") == "canonical"), "")
        if not canon.startswith("https://jigyasa-grover.github.io"):
            errors.append(f"INVALID CANONICAL '{canon}' in {rel_path}")
        elif "//" in canon.replace("https://", ""):
            errors.append(f"DOUBLE SLASH IN CANONICAL '{canon}' in {rel_path}")

        if parser.h1_count != 1:
            errors.append(f"H1 COUNT={parser.h1_count} (expected 1) in {rel_path}")

        if not is_post and parser.imgs_missing_alt:
            errors.append(f"IMAGES MISSING ALT in {rel_path}: {parser.imgs_missing_alt}")

        if not is_post and rel_path != "/404.html":
            if len(title) > 68:
                errors.append(f"TITLE TOO LONG FOR SERP ({len(title)} > 68 chars) in {rel_path}: '{title}'")
            if not (110 <= len(desc) <= 165):
                errors.append(f"META DESCRIPTION LENGTH ({len(desc)} chars, expected 110-165) in {rel_path}")

        if not parser.jsonld_blocks:
            errors.append(f"MISSING JSON-LD in {rel_path}")
        for blk in parser.jsonld_blocks:
            try:
                data = json.loads(blk)
                jsonld_count += 1
                graph = data.get("@graph", [])
                gtypes = {n.get("@type") for n in graph}
                person_nodes = [n for n in graph if n.get("@id") == "https://jigyasa-grover.github.io/#person"]
                if len(person_nodes) != 1:
                    errors.append(f"MISSING #person ENTITY NODE in JSON-LD of {rel_path}")
                else:
                    same_as = person_nodes[0].get("sameAs", [])
                    if len(same_as) != len(set(same_as)):
                        errors.append(f"DUPLICATE URLS IN Person.sameAs in {rel_path}")
                if rel_path in ("/index.html", "/about.html") and "ProfilePage" not in gtypes:
                    errors.append(f"MISSING ProfilePage SCHEMA in {rel_path}")
                if rel_path == "/publications/index.html" and not ({"Book", "ScholarlyArticle"} <= gtypes):
                    errors.append("MISSING Book OR ScholarlyArticle SCHEMA in /publications/")
                if rel_path == "/projects/index.html" and "SoftwareSourceCode" not in blk:
                    errors.append("MISSING SoftwareSourceCode SCHEMA in /projects/")
                if rel_path == "/speaking/index.html" and "VideoObject" not in gtypes:
                    errors.append("MISSING VideoObject SCHEMA in /speaking/")
                if rel_path == "/teaching/index.html" and "CourseInstance" not in blk:
                    errors.append("MISSING CourseInstance SCHEMA in /teaching/")
            except Exception as exc:
                errors.append(f"INVALID JSON-LD in {rel_path}: {exc}")

        robots_meta = next((m.get("content", "") for m in parser.metas if m.get("name") == "robots"), "")
        if rel_path in ("/404.html", "/archive/index.html") and "noindex" not in robots_meta:
            errors.append(f"{rel_path} MISSING noindex robots meta tag")
        if "post-archival-note" in raw:
            if "noindex" not in robots_meta:
                errors.append(f"ARCHIVAL POST {rel_path} MISSING noindex robots meta tag")
            if sitemap_path.is_file() and canon in sm_raw:
                errors.append(f"ARCHIVAL POST {canon} SHOULD NOT APPEAR IN sitemap.xml")

    # 6. Verify booking platform links on /work-with-me/
    wwm_path = SITE_DIR / "work-with-me" / "index.html"
    if wwm_path.is_file():
        wwm_html = wwm_path.read_text(encoding="utf-8")
        for url in (
            "https://www.passionfroot.me/jigyasa-grover",
            "https://naano.com/creators/jigyasa-grover",
            "https://intro.co/JigyasaGrover",
            "https://topmate.io/jigyasagrover",
        ):
            if url not in wwm_html:
                errors.append(f"MISSING BOOKING URL on /work-with-me/: {url}")

    # 7. Verify /agent-context.json validity & WebMCP tool registration
    agent_ctx_path = SITE_DIR / "agent-context.json"
    if agent_ctx_path.is_file():
        try:
            agent_ctx = json.loads(agent_ctx_path.read_text(encoding="utf-8"))
            for key in ("identity", "collaboration", "speaking", "articles"):
                if key not in agent_ctx:
                    errors.append(f"MISSING KEY '{key}' in /agent-context.json")
            if len(agent_ctx.get("articles", [])) < 33:
                errors.append("UNEXPECTEDLY FEW ARTICLES in /agent-context.json")
        except Exception as exc:
            errors.append(f"INVALID JSON in /agent-context.json: {exc}")

    site_js_path = SITE_DIR / "assets" / "js" / "site.js"
    if site_js_path.is_file():
        site_js = site_js_path.read_text(encoding="utf-8")
        if "modelContext" not in site_js or "registerTool" not in site_js:
            errors.append("MISSING WebMCP modelContext.registerTool support in /assets/js/site.js")

    print(f"Audited {len(html_files)} generated HTML files and {jsonld_count} JSON-LD graphs.")
    if warnings:
        print(f"Warnings ({len(warnings)}):")
        for w in warnings:
            print("  WARN:", w)
    if errors:
        print(f"ERRORS ({len(errors)}):")
        for err in errors:
            print("  ERR:", err)
        sys.exit(1)

    print("ALL AUTOMATED SITE AUDIT CHECKS PASSED WITH 0 ERRORS!")


if __name__ == "__main__":
    main()
