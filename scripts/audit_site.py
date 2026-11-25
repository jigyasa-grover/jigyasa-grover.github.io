#!/usr/bin/env python3
"""Automated build, route, link, SEO, JSON-LD & GEO audit for jigyasa-grover.github.io."""

import hashlib
import json
import os
import re
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
    "/sQuick_new/",
}

EXPECTED_POST_URLS = [
    "/TorchTPUDoctor/",
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
    "/featured/",
    "/projects/",
    "/projectsDepricated/",
    "/kinetic-finetuning-on-cloud-tpu/",
    "/trust-at-top-speed/",
    "/torchtpu-doctor/",
    "/startup-on-a-shoestring/",
    "/colab-vscode-extension/",
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
    "/partner/",
    "/sponsor/",
    "/sponsors/",
    "/media-kit/",
    "/creator/",
    "/mediakit/",
    "/uses/",
    "/press/",
    "/links/",
    "/bio/",
    "/qr/",
    "/docs/",
    "/api/",
    "/developers/",
    "/pricing/",
    "/privacy/",
    "/privacy-policy/",
    "/assets/images/og-card.jpg",
    "/assets/images/links-qr.svg",
    "/assets/css/style.css",
    "/assets/js/site.js",
    "/ads.txt",
    "/robots.txt",
    "/sitemap.xml",
    "/sitemap_index.xml",
    "/video-sitemap.xml",
    "/schemamap.xml",
    "/feeds/schema-items.jsonl",
    "/feed.xml",
    "/llms.txt",
    "/llms.md",
    "/agents.md",
    "/index.md",
    "/about.md",
    "/work-with-me.md",
    "/speaking.md",
    "/teaching.md",
    "/advisory.md",
    "/partnerships.md",
    "/projects.md",
    "/publications.md",
    "/press.md",
    "/docs.md",
    "/blog.md",
    "/pricing.md",
    "/privacy.md",
    "/docs/llms.txt",
    "/blog/llms.txt",
    "/projects/llms.txt",
    "/speaking/llms.txt",
    "/advisory/llms.txt",
    "/teaching/llms.txt",
    "/partnerships/llms.txt",
    "/.well-known/llms.txt",
    "/.well-known/ard.json",
    "/.well-known/ai-catalog.json",
    "/.well-known/api-catalog",
    "/.well-known/agent-skills/index.json",
    "/.well-known/agent-skills/jigyasa-grover/SKILL.md",
    "/.well-known/agent-skills/torchtpu-doctor/SKILL.md",
    "/.well-known/agent-card.json",
    "/.well-known/agent.json",
    "/.well-known/mcp.json",
    "/openapi.json",
    "/api/v1/index.json",
    "/api/v1/profile.json",
    "/api/v1/collaboration.json",
    "/api/v1/articles.json",
    "/api/v1/speaking.json",
    "/api/v1/publications.json",
    "/api/v1/projects.json",
    "/api/v1/courses.json",
    "/llms-full.txt",
    "/agent-context.json",
    "/TorchTPUDoctor/index.md",
    "/ProofOfWork/index.md",
    "/StartupOnAShoestring/index.md",
    "/KineticFinetuningOnCloudTPU/index.md",
    "/TrustAtTopSpeed/index.md",
    "/ColabVSCodeExtension/index.md",
    "/CriticsCutMultilingualContextADKAgent/index.md",
    "/SmartSuitcasePackingUsingGeminiImagenOpenWeather/index.md",
    "/SmarterThanA5thGrader-LLMComparatorOnGoogleVertexAI/index.md",
    "/BookBuddyInteractiveStorytellingUsingAGemmaBasedRAG/index.md",
    "/b7e4c9a12d8f4e639a501c7b8d2e4f6a.txt",
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
    "plugin.json",
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
        self.imgs_empty_alt = []
        self.is_redirect = False
        self.toolnames = []
        self._skip_text_depth = 0
        self.non_code_text_chunks = []
        self.ids = set()
        self.classes = set()
        self.tags = set()

    def handle_starttag(self, tag, attrs) -> None:
        ad = dict(attrs)
        self.tags.add(tag)
        if ad.get("id"):
            self.ids.add(ad["id"])
        if ad.get("class"):
            for cls in ad["class"].split():
                self.classes.add(cls)
        if tag in ("script", "style", "pre", "code", "textarea", "noscript"):
            self._skip_text_depth += 1
        if "toolname" in ad and ad["toolname"].strip():
            self.toolnames.append(ad["toolname"].strip())
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
            elif not (ad.get("alt") or "").strip():
                self.imgs_empty_alt.append(ad.get("src", "unknown"))

    def handle_endtag(self, tag) -> None:
        if tag in ("script", "style", "pre", "code", "textarea", "noscript") and self._skip_text_depth > 0:
            self._skip_text_depth -= 1
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
        elif self._skip_text_depth == 0:
            self.non_code_text_chunks.append(data)


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

    # 2. Ensure repo maintainer files did not leak into _site/ (case-exact check for macOS APFS vs Linux)
    site_root_names = {p.name for p in SITE_DIR.iterdir()}
    for item in FORBIDDEN_IN_SITE:
        if item in site_root_names:
            errors.append(f"FORBIDDEN REPO FILE LEAKED INTO _site/: {item}")

    # 3. Validate XML feeds
    for xml_file in ("sitemap.xml", "sitemap_index.xml", "video-sitemap.xml", "schemamap.xml", "feed.xml"):
        xml_path = SITE_DIR / xml_file
        if xml_path.is_file():
            raw_bytes = xml_path.read_bytes()
            if not raw_bytes.startswith(b"<?xml"):
                errors.append(f"LEADING WHITESPACE OR BOM IN {xml_file}")
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
            if "Go-To-Market" not in content:
                errors.append(f"MISSING AI Go-To-Market POSITIONING IN {llm_rel}")

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
            elif fl == "content-signal":
                if not in_group:
                    errors.append(f"ORPHAN {field} BEFORE User-agent in robots.txt:{lineno}")
                saw_rule_in_group = True
            elif fl in ("schemamap", "agentmap"):
                if not val.startswith("https://jigyasa-grover.github.io/"):
                    errors.append(f"INVALID {field} URL '{val}' in robots.txt:{lineno}")
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
            "Google-Agent",
            "Google-CloudVertexBot",
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
        sm_tree = ET.fromstring(sm_raw)
        sm_ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        missing_lastmod = [
            u.findtext("sm:loc", default="", namespaces=sm_ns)
            for u in sm_tree.findall("sm:url", sm_ns)
            if not u.findtext("sm:lastmod", default="", namespaces=sm_ns)
        ]
        if missing_lastmod:
            errors.append(f"URLS MISSING <lastmod> IN sitemap.xml: {missing_lastmod}")

    # 5. Inspect all generated HTML pages
    html_files = sorted(
        Path(root) / f
        for root, _, files in os.walk(SITE_DIR)
        for f in files
        if f.endswith(".html")
    )

    redirect_routes = set()
    for path in html_files:
        rel_p = "/" + str(path.relative_to(SITE_DIR))
        if 'http-equiv="refresh"' in path.read_text(encoding="utf-8").lower():
            if rel_p.endswith("/index.html"):
                r_clean = rel_p[: -len("index.html")]
                redirect_routes.add(r_clean)
                redirect_routes.add(r_clean.rstrip("/"))
            else:
                redirect_routes.add(rel_p)
                redirect_routes.add(rel_p[: -len(".html")])

    if sitemap_path.is_file():
        for sm_u in sm_tree.findall("sm:url", sm_ns):
            loc_val = sm_u.findtext("sm:loc", default="", namespaces=sm_ns)
            loc_path = urlparse(loc_val).path
            if loc_path in redirect_routes:
                errors.append(f"REDIRECT ALIAS LEAKED INTO sitemap.xml: {loc_val}")

    titles_seen = {}
    jsonld_count = 0
    declarative_toolnames = set()
    page_ids_by_route = {}
    anchor_checks = []
    gfm_alert_re = re.compile(r"\[!(?:WARNING|NOTE|TIP|IMPORTANT|CAUTION)\]")
    mathjax_currency_re = re.compile(r"(?<!\\)\$\d")
    unparsed_single_dollar_tex_re = re.compile(r"(?<!\$)\$[^$\n]*\\[A-Za-z]+[^$\n]*\$(?!\$)")

    def _selector_matches_dom(sel: str, p_insp: PageInspector) -> bool:
        for part in sel.strip().split():
            if part.startswith("."):
                if part[1:] not in p_insp.classes:
                    return False
            elif part.startswith("#"):
                if part[1:] not in p_insp.ids:
                    return False
            elif re.match(r"^[a-zA-Z0-9]+$", part):
                if part not in p_insp.tags:
                    return False
        return True

    for path in html_files:
        rel_path = "/" + str(path.relative_to(SITE_DIR))
        route_key = rel_path[: -len("index.html")] if rel_path.endswith("/index.html") else rel_path
        raw = path.read_text(encoding="utf-8")

        parser = PageInspector()
        parser.feed(raw)
        declarative_toolnames.update(parser.toolnames)
        page_ids_by_route[route_key] = parser.ids
        if route_key.endswith(".html"):
            page_ids_by_route[route_key[: -len(".html")]] = parser.ids

        for href in parser.hrefs:
            if "#" not in href or href.startswith(("mailto:", "tel:", "javascript:", "data:")):
                continue
            if href.startswith(("http://", "https://")):
                ph = urlparse(href)
                if ph.netloc != "jigyasa-grover.github.io":
                    continue
                t_path, t_frag = (ph.path or "/"), ph.fragment
            elif href.startswith("#"):
                t_path, t_frag = route_key, href[1:]
            elif href.startswith("/"):
                t_path, t_frag = href.split("#", 1)
                t_path = t_path.split("?")[0] or "/"
            else:
                continue
            if t_frag:
                anchor_checks.append((rel_path, t_path, t_frag, href))

        non_code_text = "".join(parser.non_code_text_chunks)
        if gfm_alert_re.search(non_code_text):
            errors.append(f"UNSUPPORTED GFM ALERT RENDERED LITERALLY in {rel_path}")
        if "MathJax-script" in raw:
            if "inlineMath: [['$'" in raw:
                for line in non_code_text.splitlines():
                    if len(mathjax_currency_re.findall(line)) >= 2:
                        errors.append(f"MATHJAX CURRENCY COLLISION in {rel_path}: {line.strip()[:90]}")
            elif unparsed_single_dollar_tex_re.search(non_code_text):
                errors.append(f"UNPARSED SINGLE-DOLLAR LATEX (use $$...$$ for Kramdown inline math) in {rel_path}")
        if "https://sessionize.com/jigyasagrover/" in raw:
            errors.append(f"BROKEN TRAILING-SLASH SESSIONIZE URL in {rel_path}")

        for target in parser.hrefs + parser.srcs:
            if not target or target.startswith(("#", "mailto:", "tel:", "javascript:", "data:")):
                continue
            if target.startswith(("http://", "https://", "//")):
                parsed = urlparse(target)
                if parsed.netloc == "jigyasa-grover.github.io":
                    p_route = parsed.path or "/"
                    if not route_exists(p_route):
                        errors.append(f"BROKEN CANONICAL/SELF LINK in {rel_path}: {target}")
                    elif not parser.is_redirect and p_route in redirect_routes:
                        errors.append(f"INTERNAL LINK POINTS TO REDIRECT ALIAS in {rel_path}: {target}")
                continue
            if not route_exists(target):
                errors.append(f"BROKEN INTERNAL ASSET/LINK in {rel_path}: {target}")
            elif not parser.is_redirect and target.split("#")[0].split("?")[0] in redirect_routes:
                errors.append(f"INTERNAL LINK POINTS TO REDIRECT ALIAS in {rel_path}: {target}")

        if "cdn.mathjax.org" in raw:
            errors.append(f"RETIRED MATHJAX CDN in {rel_path}")
        if "UA-172999305-1" in raw:
            errors.append(f"SUNSET UNIVERSAL ANALYTICS in {rel_path}")
        if "adsbygoogle" in raw:
            errors.append(f"ADSENSE SCRIPT FOUND in {rel_path}")
        if 'itemtype="https://schema.org/BlogPosting"' in raw:
            errors.append(f"DUPLICATE INCOMPLETE MICRODATA BlogPosting FOUND in {rel_path}")

        standalone_paths = {
            "/index.html",
            "/about.html",
            "/404.html",
            "/advisory/index.html",
            "/blog/index.html",
            "/experience/index.html",
            "/highlights/index.html",
            "/partnerships/index.html",
            "/media-kit/index.html",
            "/press/index.html",
            "/projects/index.html",
            "/publications/index.html",
            "/speaking/index.html",
            "/teaching/index.html",
            "/work-with-me/index.html",
            "/links/index.html",
            "/docs/index.html",
            "/pricing/index.html",
            "/privacy/index.html",
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
            if "<" in title or ">" in title:
                errors.append(f"RAW HTML TAG LEAKED INTO <title> in {rel_path}: '{title}'")
            if title in titles_seen:
                warnings.append(f"DUPLICATE <title> '{title}' in {rel_path} and {titles_seen[title]}")
            titles_seen[title] = rel_path

        robots_meta_early = next((m.get("content", "") for m in parser.metas if m.get("name") == "robots"), "")
        is_indexed = "noindex" not in robots_meta_early

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

        if (not is_post or is_indexed) and parser.imgs_missing_alt:
            errors.append(f"IMAGES MISSING ALT in {rel_path}: {parser.imgs_missing_alt}")
        if is_post and is_indexed and parser.imgs_empty_alt:
            errors.append(f"INDEXED POST IMAGES WITH EMPTY ALT in {rel_path}: {parser.imgs_empty_alt}")

        if is_indexed and rel_path != "/404.html":
            if len(title) > 68:
                errors.append(f"TITLE TOO LONG FOR SERP ({len(title)} > 68 chars) in {rel_path}: '{title}'")
            if not is_post and not (110 <= len(desc) <= 165):
                errors.append(f"META DESCRIPTION LENGTH ({len(desc)} chars, expected 110-165) in {rel_path}")
            if is_post and len(desc) > 165:
                errors.append(f"POST META DESCRIPTION TOO LONG ({len(desc)} > 165 chars) in {rel_path}")
            og_props = {m.get("property"): m.get("content", "") for m in parser.metas if m.get("property")}
            if "og:image" in og_props and ("og:image:width" not in og_props or "og:image:height" not in og_props):
                errors.append(f"MISSING og:image:width/height in {rel_path}")

        if is_indexed and not parser.jsonld_blocks:
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
                    if rel_path in ("/index.html", "/about.html"):
                        if not person_nodes[0].get("hasCredential"):
                            errors.append(f"MISSING Person.hasCredential E-E-A-T SCHEMA in {rel_path}")
                        if not person_nodes[0].get("disambiguatingDescription"):
                            errors.append(f"MISSING Person.disambiguatingDescription in {rel_path}")
                    if "subjectOf" in person_nodes[0]:
                        errors.append(f"INVALID Person.subjectOf ON AUTHORED WORK in {rel_path}")
                website_nodes = [n for n in graph if n.get("@id") == "https://jigyasa-grover.github.io/#website"]
                if website_nodes and not website_nodes[0].get("potentialAction"):
                    errors.append(f"MISSING WebSite SearchAction in {rel_path}")
                for node in graph:
                    sp = node.get("speakable")
                    if isinstance(sp, dict) and "cssSelector" in sp:
                        sels = sp["cssSelector"] if isinstance(sp["cssSelector"], list) else [sp["cssSelector"]]
                        for sel in sels:
                            if not _selector_matches_dom(sel, parser):
                                errors.append(f"UNMATCHED speakable SELECTOR '{sel}' in {rel_path}")
                    for date_key in ("datePublished", "dateCreated"):
                        dval = node.get(date_key)
                        if isinstance(dval, str) and ("–" in dval or re.match(r"^\d{4}-\d{4}$", dval)):
                            errors.append(f"NON-ISO DATE RANGE in {date_key}='{dval}' of {rel_path}")
                    if node.get("@type") == "VideoObject" and not node.get("uploadDate"):
                        errors.append(f"MISSING uploadDate on VideoObject in {rel_path}")
                    if node.get("@type") == "ItemList":
                        for li in node.get("itemListElement", []):
                            item = li.get("item", {})
                            for date_key in ("datePublished", "dateCreated"):
                                dval = item.get(date_key)
                                if isinstance(dval, str) and ("–" in dval or re.match(r"^\d{4}-\d{4}$", dval)):
                                    errors.append(f"NON-ISO DATE RANGE in ItemList {date_key}='{dval}' of {rel_path}")
                            if item.get("@type") == "Course" and "instructor" in item:
                                errors.append(f"INVALID TOP-LEVEL Course.instructor in {rel_path}")
                            if item.get("@type") == "VideoObject" and not item.get("uploadDate"):
                                errors.append(f"MISSING uploadDate on ItemList VideoObject in {rel_path}")
                if rel_path in ("/index.html", "/about.html") and "ProfilePage" not in gtypes:
                    errors.append(f"MISSING ProfilePage SCHEMA in {rel_path}")
                if rel_path == "/work-with-me/index.html" and "ContactPage" not in gtypes:
                    errors.append("MISSING ContactPage SCHEMA in /work-with-me/")
                if rel_path == "/publications/index.html" and not ({"Book", "ScholarlyArticle"} <= gtypes):
                    errors.append("MISSING Book OR ScholarlyArticle SCHEMA in /publications/")
                if rel_path == "/projects/index.html" and "SoftwareSourceCode" not in blk:
                    errors.append("MISSING SoftwareSourceCode SCHEMA in /projects/")
                if rel_path == "/speaking/index.html" and not ({"VideoObject", "Event"} <= gtypes):
                    errors.append("MISSING VideoObject OR Event SCHEMA in /speaking/")
                if rel_path == "/experience/index.html" and "OrganizationRole" not in blk:
                    errors.append("MISSING OrganizationRole SCHEMA in /experience/")
                if rel_path == "/press/index.html" and "NewsArticle" not in blk:
                    errors.append("MISSING NewsArticle SCHEMA in /press/")
                if rel_path == "/teaching/index.html" and ("CourseInstance" not in blk or "Service" not in gtypes):
                    errors.append("MISSING CourseInstance OR Workshop Service SCHEMA in /teaching/")
                if rel_path in ("/partnerships/index.html", "/advisory/index.html", "/media-kit/index.html") and "Service" not in gtypes:
                    errors.append(f"MISSING Service SCHEMA in {rel_path}")
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

    # 5b. Validate all internal #fragment anchors resolve to real DOM ids
    for src_rel, t_path, t_frag, orig_href in anchor_checks:
        target_ids = (
            page_ids_by_route.get(t_path)
            or page_ids_by_route.get(t_path + "/")
            or page_ids_by_route.get(t_path.rstrip("/"))
        )
        if target_ids is None:
            if t_path not in EXTERNAL_SUBREPOS and t_path not in redirect_routes:
                errors.append(f"BROKEN FRAGMENT TARGET PAGE in {src_rel}: {orig_href}")
        elif t_frag not in target_ids:
            errors.append(f"BROKEN INTERNAL #ANCHOR in {src_rel}: {orig_href} (id='{t_frag}' not found)")

    # 6. Verify booking platform links on /work-with-me/
    wwm_path = SITE_DIR / "work-with-me" / "index.html"
    if wwm_path.is_file():
        wwm_html = wwm_path.read_text(encoding="utf-8")
        for url in (
            "https://www.passionfroot.me/jigyasa-grover",
            "https://naano.com/creators/jigyasa-grover",
            "https://8x.business/p/b623ba2ed48544748601a75a3569c6ee",
            "https://intro.co/JigyasaGrover",
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
            if "gtm_and_ai_marketing" not in agent_ctx.get("collaboration", {}):
                errors.append("MISSING 'gtm_and_ai_marketing' in /agent-context.json collaboration")
            if len(agent_ctx.get("articles", [])) < 34:
                errors.append("UNEXPECTEDLY FEW ARTICLES in /agent-context.json")
        except Exception as exc:
            errors.append(f"INVALID JSON in /agent-context.json: {exc}")

    for wk_json in (
        ".well-known/agent-card.json",
        ".well-known/agent.json",
        ".well-known/mcp.json",
        ".well-known/ard.json",
        ".well-known/ai-catalog.json",
        ".well-known/api-catalog",
        ".well-known/agent-skills/index.json",
        "openapi.json",
        "api/v1/index.json",
        "api/v1/profile.json",
        "api/v1/collaboration.json",
        "api/v1/articles.json",
        "api/v1/speaking.json",
        "api/v1/publications.json",
        "api/v1/projects.json",
        "api/v1/courses.json",
    ):
        wk_path = SITE_DIR / wk_json
        if wk_path.is_file():
            try:
                parsed_wk = json.loads(wk_path.read_text(encoding="utf-8"))
                if not isinstance(parsed_wk, dict):
                    errors.append(f"EXPECTED JSON OBJECT in /{wk_json}")
            except Exception as exc:
                errors.append(f"INVALID JSON in /{wk_json}: {exc}")

    # 7b. Verify ARD, AI Catalog, Agent Skills v0.2.0 SHA-256 digests, OpenAPI 3.1 live paths, NLWeb JSONL & plugin.json
    ard_path = SITE_DIR / ".well-known" / "ard.json"
    if ard_path.is_file():
        ard_doc = json.loads(ard_path.read_text(encoding="utf-8"))
        for entry in ard_doc.get("entries", []):
            if not str(entry.get("identifier", "")).startswith("urn:air:jigyasa-grover.github.io:"):
                errors.append(f"INVALID ARD URN: {entry.get('identifier')}")
            if bool(entry.get("url")) == bool(entry.get("data")):
                errors.append(f"ARD ENTRY MUST SET EXACTLY ONE OF url OR data: {entry.get('identifier')}")
            e_url = entry.get("url", "")
            if e_url.startswith("https://jigyasa-grover.github.io/"):
                if not route_exists(urlparse(e_url).path):
                    errors.append(f"BROKEN ARD ENTRY URL: {e_url}")
            if not entry.get("trustManifest", {}).get("identity"):
                errors.append(f"ARD ENTRY MISSING trustManifest.identity: {entry.get('identifier')}")

    aicat_path = SITE_DIR / ".well-known" / "ai-catalog.json"
    if aicat_path.is_file():
        aicat_doc = json.loads(aicat_path.read_text(encoding="utf-8"))
        if aicat_doc.get("specVersion") != "1.0":
            errors.append("MISSING specVersion '1.0' in /.well-known/ai-catalog.json")
        for entry in aicat_doc.get("entries", []):
            if "trustManifest" in entry:
                errors.append(f"AI-CATALOG MUST USE trustManifests ARRAY (NOT singular trustManifest): {entry.get('identifier')}")
            if not entry.get("trustManifests"):
                errors.append(f"AI-CATALOG ENTRY MISSING trustManifests: {entry.get('identifier')}")

    skills_idx_path = SITE_DIR / ".well-known" / "agent-skills" / "index.json"
    if skills_idx_path.is_file():
        sidx = json.loads(skills_idx_path.read_text(encoding="utf-8"))
        if sidx.get("$schema") != "https://schemas.agentskills.io/discovery/0.2.0/schema.json":
            errors.append("INVALID $schema in /.well-known/agent-skills/index.json")
        for sk in sidx.get("skills", []):
            sk_url = sk.get("url", "")
            sk_file = SITE_DIR / sk_url.lstrip("/")
            if not sk_file.is_file():
                errors.append(f"MISSING AGENT SKILL ARTIFACT: {sk_url}")
            else:
                raw_sk = sk_file.read_bytes()
                expected_digest = "sha256:" + hashlib.sha256(raw_sk).hexdigest()
                if sk.get("digest") != expected_digest:
                    errors.append(f"AGENT SKILL DIGEST MISMATCH for {sk_url}: got {sk.get('digest')}, expected {expected_digest}")
                sk_txt = raw_sk.decode("utf-8", errors="replace")
                if not sk_txt.startswith("---\n"):
                    errors.append(f"AGENT SKILL MISSING RAW YAML FRONTMATTER: {sk_url}")

    openapi_path = SITE_DIR / "openapi.json"
    if openapi_path.is_file():
        oa = json.loads(openapi_path.read_text(encoding="utf-8"))
        if not str(oa.get("openapi", "")).startswith("3.1"):
            errors.append("OPENAPI SPEC MUST BE 3.1.x in /openapi.json")
        seen_op_ids = set()
        for oa_path, path_item in oa.get("paths", {}).items():
            if not route_exists(oa_path):
                errors.append(f"OPENAPI DECLARED PATH NOT FOUND IN _site/: {oa_path}")
            for meth, op in path_item.items():
                if isinstance(op, dict) and meth.lower() in ("get", "post", "put", "patch", "delete"):
                    op_id = op.get("operationId")
                    if not op_id:
                        errors.append(f"MISSING operationId on {meth.upper()} {oa_path}")
                    elif op_id in seen_op_ids:
                        errors.append(f"DUPLICATE operationId '{op_id}' in /openapi.json")
                    else:
                        seen_op_ids.add(op_id)

    jsonl_path = SITE_DIR / "feeds" / "schema-items.jsonl"
    if jsonl_path.is_file():
        for lineno, jline in enumerate(jsonl_path.read_text(encoding="utf-8").splitlines(), 1):
            if not jline.strip():
                continue
            try:
                obj = json.loads(jline)
                if "@type" not in obj:
                    errors.append(f"MISSING @type in /feeds/schema-items.jsonl:{lineno}")
            except Exception as exc:
                errors.append(f"INVALID JSONL in /feeds/schema-items.jsonl:{lineno}: {exc}")

    plugin_path = REPO_ROOT / "plugin.json"
    if not plugin_path.is_file():
        errors.append("MISSING ROOT plugin.json (Agent Plugins v1.0.0 manifest)")
    else:
        try:
            pdoc = json.loads(plugin_path.read_text(encoding="utf-8"))
            allowed_keys = {"$schema", "name", "version", "description", "author", "homepage", "repository", "license", "keywords", "extensions"}
            extra_keys = set(pdoc.keys()) - allowed_keys
            if extra_keys:
                errors.append(f"DISALLOWED TOP-LEVEL KEYS IN plugin.json: {sorted(extra_keys)}")
            if pdoc.get("$schema") != "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json":
                errors.append("INVALID $schema in plugin.json")
        except Exception as exc:
            errors.append(f"INVALID JSON in plugin.json: {exc}")

    for md_core in (
        "index.md",
        "agents.md",
        "llms.md",
        "pricing.md",
        "docs.md",
        "about.md",
        "work-with-me.md",
        "speaking.md",
        "teaching.md",
        "advisory.md",
        "partnerships.md",
        "projects.md",
        "publications.md",
        "press.md",
        "blog.md",
        "privacy.md",
    ):
        mp = SITE_DIR / md_core
        if mp.is_file():
            mtxt = mp.read_text(encoding="utf-8")
            if not mtxt.startswith("---\n") or "title:" not in mtxt[:600] or "canonical:" not in mtxt[:600]:
                errors.append(f"MISSING YAML FRONTMATTER METADATA IN /{md_core}")
            if "{{" in mtxt or "{%" in mtxt:
                errors.append(f"UNRENDERED LIQUID IN /{md_core}")
            fence_count = sum(1 for ln in mtxt.splitlines() if ln.strip().startswith("```"))
            if fence_count % 2 != 0:
                errors.append(f"UNCLOSED CODE FENCE IN /{md_core}")

    for md_rel in (
        "TorchTPUDoctor/index.md",
        "ProofOfWork/index.md",
        "StartupOnAShoestring/index.md",
        "KineticFinetuningOnCloudTPU/index.md",
        "TrustAtTopSpeed/index.md",
        "ColabVSCodeExtension/index.md",
        "CriticsCutMultilingualContextADKAgent/index.md",
        "SmartSuitcasePackingUsingGeminiImagenOpenWeather/index.md",
        "SmarterThanA5thGrader-LLMComparatorOnGoogleVertexAI/index.md",
        "BookBuddyInteractiveStorytellingUsingAGemmaBasedRAG/index.md",
    ):
        md_path = SITE_DIR / md_rel
        if md_path.is_file():
            md_txt = md_path.read_text(encoding="utf-8")
            if not md_txt.startswith("---\n") or "canonical:" not in md_txt[:600]:
                errors.append(f"MISSING YAML FRONTMATTER IN /{md_rel}")
            if "{%" in md_txt or len(md_txt.strip()) < 1500:
                errors.append(f"INVALID OR SHORT FULL MARKDOWN TWIN: /{md_rel} ({len(md_txt.strip())} B)")
            fence_count = sum(1 for ln in md_txt.splitlines() if ln.strip().startswith("```"))
            if fence_count % 2 != 0:
                errors.append(f"UNCLOSED CODE FENCE IN /{md_rel}")

    site_js_path = SITE_DIR / "assets" / "js" / "site.js"
    if site_js_path.is_file():
        site_js = site_js_path.read_text(encoding="utf-8")
        if "modelContext" not in site_js or "registerTool" not in site_js:
            errors.append("MISSING WebMCP modelContext.registerTool support in /assets/js/site.js")

    # 8. Verify WebMCP tool-name parity, zero declarative/imperative collisions, annotations, and honeypot hygiene
    mcp_path = SITE_DIR / ".well-known" / "mcp.json"
    if mcp_path.is_file():
        mcp_data = json.loads(mcp_path.read_text(encoding="utf-8"))
        manifest_tools = {t["name"] for t in mcp_data.get("webmcp_browser_tools", []) if "name" in t}
        js_tools = set()
        for js_name in ("site.js", "cinema.js"):
            jp = SITE_DIR / "assets" / "js" / js_name
            if jp.is_file():
                js_src = jp.read_text(encoding="utf-8")
                reg_blocks = re.findall(r'(?:safeRegister|registerTool)\(\s*\{(.*?)inputSchema:', js_src, re.S)
                for blk in reg_blocks:
                    m_name = re.search(r'name:\s*"([^"]+)"', blk)
                    if m_name:
                        tname = m_name.group(1)
                        js_tools.add(tname)
                        if "readOnlyHint" not in blk:
                            errors.append(f"IMPERATIVE WebMCP TOOL '{tname}' IN {js_name} MISSING annotations.readOnlyHint")
        implemented_tools = js_tools | declarative_toolnames
        if implemented_tools - manifest_tools:
            errors.append(f"IMPLEMENTED WebMCP TOOLS MISSING FROM /.well-known/mcp.json: {sorted(implemented_tools - manifest_tools)}")
        if manifest_tools - implemented_tools:
            errors.append(f"MANIFEST WebMCP TOOLS NOT IMPLEMENTED IN JS OR HTML: {sorted(manifest_tools - implemented_tools)}")
        collisions = js_tools & declarative_toolnames
        if collisions:
            errors.append(f"DUPLICATE WebMCP TOOL NAME COLLISION (imperative JS + declarative HTML): {sorted(collisions)}")
        wwm_html_path = SITE_DIR / "work-with-me" / "index.html"
        if wwm_html_path.is_file() and 'name="_gotcha"' in wwm_html_path.read_text(encoding="utf-8"):
            errors.append('HONEYPOT name="_gotcha" LEAKS INTO DECLARATIVE WebMCP FORM SCHEMA on /work-with-me/')

    # 9. Enforce AGENTS.md editorial prose invariant (no unspaced em dashes in structured data/templates/JS)
    unspaced_em_re = re.compile(r"[A-Za-z0-9]—[A-Za-z0-9]")
    for src_dir in ("_data", "_pages", "_includes", "assets/js"):
        dpath = REPO_ROOT / src_dir
        if not dpath.is_dir():
            continue
        for fpath in sorted(dpath.rglob("*")):
            if not fpath.is_file():
                continue
            for lineno, line in enumerate(fpath.read_text(encoding="utf-8", errors="ignore").splitlines(), 1):
                if unspaced_em_re.search(line):
                    rel_src = fpath.relative_to(REPO_ROOT)
                    errors.append(f"UNSPACED PROSE EM DASH in {rel_src}:{lineno}")

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
