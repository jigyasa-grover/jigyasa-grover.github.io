#!/usr/bin/env python3
"""Generate clean full-article GitHub-Flavored Markdown bodies for flagship posts.

Writes {% raw %}...{% endraw %} wrapped partials to _includes/post-md/<slug>.md
so GitHub Pages native Jekyll builds serve complete, citable text/markdown twins
without custom Ruby plugins or Liquid escaping collisions.
"""

from __future__ import annotations

from html import unescape
from html.parser import HTMLParser
from pathlib import Path
import re

REPO_ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = REPO_ROOT / "_posts"
OUT_DIR = REPO_ROOT / "_includes" / "post-md"
SITE_URL = "https://jigyasa-grover.github.io"

FLAGSHIP_POSTS = [
    ("TorchTPUDoctor", "2026-11-02-TorchTPUDoctor.md"),
    ("ProofOfWork", "2026-09-08-ProofOfWork.md"),
    ("StartupOnAShoestring", "2026-06-28-StartupOnAShoestring.md"),
    ("KineticFinetuningOnCloudTPU", "2026-03-30-KineticFinetuningOnCloudTPU.md"),
    ("TrustAtTopSpeed", "2025-12-18-TrustAtTopSpeed.md"),
    ("ColabVSCodeExtension", "2025-11-14-ColabVSCodeExtension.md"),
    ("CriticsCutMultilingualContextADKAgent", "2025-06-04-CriticsCutMultilingualContextADKAgent.md"),
    ("SmartSuitcasePackingUsingGeminiImagenOpenWeather", "2025-02-25-SmartSuitcasePackingUsingGeminiImagenOpenWeather.md"),
    ("SmarterThanA5thGrader-LLMComparatorOnGoogleVertexAI", "2024-09-04-SmarterThanA5thGrader-LLMComparatorOnGoogleVertexAI.md"),
    ("BookBuddyInteractiveStorytellingUsingAGemmaBasedRAG", "2024-07-09-BookBuddyInteractiveStorytellingUsingAGemmaBasedRAG.md"),
]


def abs_url(url: str) -> str:
    url = (url or "").strip()
    if url.startswith("/"):
        return SITE_URL + url
    return url


class HTMLToGFM(HTMLParser):
    """Lightweight stdlib HTML-to-GFM converter for migrated WordPress posts."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.out: list[str] = []
        self.skip_depth = 0
        self.in_pre = False
        self.in_code = False
        self.pre_buf: list[str] = []
        self.list_stack: list[tuple[str, int]] = []
        self.link_stack: list[tuple[str, list[str]]] = []
        self.in_blockquote = False
        self.in_table = False
        self.table_rows: list[list[str]] = []
        self.curr_row: list[str] | None = None
        self.curr_cell: list[str] | None = None
        self.heading_level = 0
        self.heading_buf: list[str] = []

    def _emit(self, text: str) -> None:
        if self.skip_depth > 0:
            return
        if self.in_pre:
            self.pre_buf.append(text)
        elif self.curr_cell is not None:
            self.curr_cell.append(text)
        elif self.link_stack:
            self.link_stack[-1][1].append(text)
        elif self.heading_level:
            self.heading_buf.append(text)
        else:
            self.out.append(text)

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        ad = dict(attrs)
        if tag in ("script", "style", "iframe", "noscript", "svg"):
            self.skip_depth += 1
            return
        if self.skip_depth > 0:
            return

        if tag in ("h1", "h2", "h3", "h4", "h5", "h6"):
            self.heading_level = int(tag[1])
            self.heading_buf = []
        elif tag == "pre":
            self.in_pre = True
            self.pre_buf = []
        elif tag == "code":
            self.in_code = True
            if not self.in_pre:
                self._emit("`")
        elif tag in ("strong", "b"):
            self._emit("**")
        elif tag in ("em", "i"):
            self._emit("*")
        elif tag == "br":
            self._emit("\n")
        elif tag == "hr":
            self._emit("\n\n---\n\n")
        elif tag == "p":
            if self.in_blockquote:
                self._emit("\n> ")
            else:
                self._emit("\n\n")
        elif tag == "blockquote":
            self.in_blockquote = True
            self._emit("\n\n> ")
        elif tag == "ul":
            self.list_stack.append(("ul", 0))
            self._emit("\n")
        elif tag == "ol":
            self.list_stack.append(("ol", 0))
            self._emit("\n")
        elif tag == "li":
            indent = "  " * max(0, len(self.list_stack) - 1)
            if self.list_stack and self.list_stack[-1][0] == "ol":
                kind, idx = self.list_stack[-1]
                idx += 1
                self.list_stack[-1] = (kind, idx)
                self._emit(f"\n{indent}{idx}. ")
            else:
                self._emit(f"\n{indent}- ")
        elif tag == "a":
            href = abs_url(ad.get("href") or "")
            self.link_stack.append((href, []))
        elif tag == "img":
            src = abs_url(ad.get("src") or "")
            alt = (ad.get("alt") or "").strip().replace("\n", " ")
            if src:
                self._emit(f"\n\n![{alt}]({src})\n\n")
        elif tag == "figcaption":
            self._emit("\n*")
        elif tag == "table":
            self.in_table = True
            self.table_rows = []
        elif tag == "tr" and self.in_table:
            self.curr_row = []
        elif tag in ("td", "th") and self.curr_row is not None:
            self.curr_cell = []

    def handle_endtag(self, tag: str) -> None:
        if tag in ("script", "style", "iframe", "noscript", "svg"):
            self.skip_depth = max(0, self.skip_depth - 1)
            return
        if self.skip_depth > 0:
            return

        if tag in ("h1", "h2", "h3", "h4", "h5", "h6") and self.heading_level:
            text = " ".join("".join(self.heading_buf).split())
            if text:
                prefix = "#" * max(2, min(6, self.heading_level))
                self.out.append(f"\n\n{prefix} {text}\n\n")
            self.heading_level = 0
            self.heading_buf = []
        elif tag == "pre" and self.in_pre:
            code = "".join(self.pre_buf).strip("\n")
            self.in_pre = False
            self.pre_buf = []
            self._emit(f"\n\n```\n{code}\n```\n\n")
        elif tag == "code":
            if not self.in_pre:
                self._emit("`")
            self.in_code = False
        elif tag in ("strong", "b"):
            self._emit("**")
        elif tag in ("em", "i"):
            self._emit("*")
        elif tag == "blockquote":
            self.in_blockquote = False
            self._emit("\n\n")
        elif tag in ("ul", "ol"):
            if self.list_stack:
                self.list_stack.pop()
            self._emit("\n\n")
        elif tag == "a" and self.link_stack:
            href, buf = self.link_stack.pop()
            label = " ".join("".join(buf).split())
            if label and href:
                self._emit(f"[{label}]({href})")
            elif label:
                self._emit(label)
        elif tag == "figcaption":
            self._emit("*\n\n")
        elif tag in ("td", "th") and self.curr_cell is not None and self.curr_row is not None:
            cell = " ".join("".join(self.curr_cell).split()).replace("|", "\\|")
            self.curr_row.append(cell)
            self.curr_cell = None
        elif tag == "tr" and self.curr_row is not None:
            if any(c for c in self.curr_row):
                self.table_rows.append(self.curr_row)
            self.curr_row = None
        elif tag == "table" and self.in_table:
            self.in_table = False
            if self.table_rows:
                ncols = max(len(r) for r in self.table_rows)
                norm = [r + [""] * (ncols - len(r)) for r in self.table_rows]
                lines = [
                    "| " + " | ".join(norm[0]) + " |",
                    "| " + " | ".join(["---"] * ncols) + " |",
                ]
                for row in norm[1:]:
                    lines.append("| " + " | ".join(row) + " |")
                self._emit("\n\n" + "\n".join(lines) + "\n\n")
            self.table_rows = []

    def handle_data(self, data: str) -> None:
        if self.skip_depth > 0:
            return
        if self.in_pre:
            self._emit(data)
        else:
            self._emit(data)

    def get_markdown(self) -> str:
        text = "".join(self.out)
        # Clean stray empty bold/italic markers and excessive whitespace
        text = re.sub(r"\*\*\s*\*\*", "", text)
        text = re.sub(r"[ \t]+\n", "\n", text)
        text = re.sub(r"\n{3,}", "\n\n", text)
        return text.strip()


def normalize_prose_em_dashes(md: str) -> str:
    """Keep generated _includes/post-md/*.md compliant with AGENTS.md prose spacing outside code fences."""
    out_lines = []
    in_fence = False
    for line in md.splitlines():
        if line.strip().startswith("```"):
            in_fence = not in_fence
            out_lines.append(line)
            continue
        if not in_fence:
            line = re.sub(r"([A-Za-z0-9])—([A-Za-z0-9])", r"\1 — \2", line)
            # Rewrite relative image/site links inside Markdown to absolute URLs
            line = re.sub(r"\]\((/(?:assets|images)/[^)]+)\)", rf"]({SITE_URL}\1)", line)
        out_lines.append(line)
    return "\n".join(out_lines)


def convert_post_body(raw_body: str) -> str:
    body = raw_body.strip()
    html_block_count = len(re.findall(r"<(?:p|h[1-6]|div|figure|table|ul|ol|blockquote)\b", body, re.I))
    if html_block_count < 3:
        # Pure Markdown post: strip any inline <details>/<summary>/HTML comments lightly and preserve verbatim
        clean = re.sub(r"<!--.*?-->", "", body, flags=re.S)
        clean = re.sub(r"\n{3,}", "\n\n", clean).strip()
        return normalize_prose_em_dashes(clean)

    # WordPress HTML or mixed HTML+Markdown post
    # First protect fenced code blocks if mixed
    conv = HTMLToGFM()
    conv.feed(body)
    clean = unescape(conv.get_markdown())
    return normalize_prose_em_dashes(clean)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for slug, filename in FLAGSHIP_POSTS:
        src = POSTS_DIR / filename
        text = src.read_text(encoding="utf-8")
        parts = text.split("---", 2)
        raw_body = parts[2] if len(parts) >= 3 else text
        raw_body = re.sub(r"\{%-?\s*(?:raw|endraw)\s*-?%\}", "", raw_body)
        md_body = convert_post_body(raw_body)
        out_path = OUT_DIR / f"{slug}.md"
        out_path.write_text("{% raw %}\n" + md_body + "\n{% endraw %}\n", encoding="utf-8")
        words = len(md_body.split())
        print(f"  {slug:52s} -> {len(md_body):6d} B | {words:5d} words")


if __name__ == "__main__":
    main()
