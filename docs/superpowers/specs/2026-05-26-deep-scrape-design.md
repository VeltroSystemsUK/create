# Deep Scrape — Design Spec

Date: 2026-05-26

## Overview

A new agentic "Deep Scrape" feature that crawls an entire website (5–50 major pages), converts each page into structured content, then synthesises everything into a single unified Framework Builder template. Accessed via a dedicated overlay, completely separate from the existing single-page Import and AI Import flows.

---

## Entry Point

A new button in the Assets tab of the left panel, below "✨ AI Template Builder":

```html
<button class="ds-full-btn" onclick="FB.deepScrape.open()">
  🕷 Deep Scrape
</button>
```

Clicking opens `#ds-deep-scrape-overlay` (hidden div, same structure as `ds-ai-template-overlay`).

---

## Pipeline Overview

```
User enters URL
      ↓
POST /api/deep-scrape/map   → discovers 5–50 top-level URLs
      ↓
[Auto mode]                 [Review mode]
      ↓                           ↓
POST /api/deep-scrape/crawl  User sees URL list, removes unwanted pages
      ↓                           ↓
                        POST /api/deep-scrape/crawl
                                  ↓
              FB.deepScrape._synthesise()  ← Gemini API call
                                  ↓
                        Block preview → Approve & Load
```

---

## Overlay States

| State          | What the user sees                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| `idle`         | URL input + "⚡ Auto" + "👁 Review" buttons                                                            |
| `mapping`      | Spinner — "Discovering pages on example.com..."                                                        |
| `crawling`     | Spinner — "Scraping N pages, please wait..." (batch request, results arrive all at once)               |
| `review`       | Full page list (title + URL + remove button) + "Synthesise →" CTA. Review mode only — Auto skips this. |
| `synthesising` | Spinner — "Building unified design from N pages..."                                                    |
| `result`       | Block preview list + "Approve & Load" / "Discard" / "Regenerate"                                       |

**Auto mode:** `idle → mapping → crawling → synthesising → result`
**Review mode:** `idle → mapping → crawling → review → synthesising → result`

---

## Server — New Endpoints (`server.py`)

### `POST /api/deep-scrape/map`

**Input:** `{ "url": "https://example.com" }`

**Logic:**

1. Runs `firecrawl map <url> --limit 50 --json`
2. Filters to same-origin URLs only (no external links)
3. Returns up to 50 URLs

**Output:** `{ "urls": ["https://...", ...], "count": N }`

**Error cases:** invalid URL, firecrawl not installed, timeout (30s) → `{ "error": "..." }`

---

### `POST /api/deep-scrape/crawl`

**Input:** `{ "urls": ["https://...", ...] }`

**Logic:**

1. Accepts up to 50 URLs (truncates silently if more sent)
2. Scrapes each with `firecrawl scrape <url> --format markdown` using `ThreadPoolExecutor(max_workers=5)`
3. Preserves order of input URLs in output
4. Skips pages that error or return empty content (logs to console)
5. `title` extracted from first H1 in the markdown; fallback to the URL path segment (e.g. `/about` → "about")

**Output:** `{ "pages": [{ "url": "...", "title": "...", "markdown": "..." }] }`

**Timeout:** 120s total for the crawl batch.

---

## Frontend — `js/deep-scrape.js`

New file on the `FB.deepScrape` namespace. ~300 lines. No modifications to existing JS files except:

- `src/main.js` — one `import` line added
- `framework-builder.html` — one button + one overlay div added

### State

```js
FB.deepScrape._state = "idle"; // idle | mapping | crawling | review | synthesising | result
FB.deepScrape._pages = []; // [{ url, title, markdown }]
FB.deepScrape._result = null; // { template: { name, blocks }, validation }
FB.deepScrape._mode = null; // "auto" | "review"
```

### Key functions

| Function                       | Responsibility                                                            |
| ------------------------------ | ------------------------------------------------------------------------- |
| `FB.deepScrape.open()`         | Show overlay, reset to idle                                               |
| `FB.deepScrape.close()`        | Hide overlay, reset state                                                 |
| `FB.deepScrape._render()`      | Re-render overlay innerHTML based on `_state`                             |
| `FB.deepScrape._start(mode)`   | Kick off pipeline — sets `_mode`, calls `/map`                            |
| `FB.deepScrape._crawl(urls)`   | POST to `/crawl`, updates state to crawling → review or synthesising      |
| `FB.deepScrape._synthesise()`  | Builds Gemini prompt, calls `FB.agent._call()`, parses result             |
| `FB.deepScrape._approve()`     | Loads `_result.template` onto canvas via same logic as `FB.ai._approve()` |
| `FB.deepScrape._removePage(i)` | Removes a page from `_pages` in review state                              |

### Gemini Key

Calls `FB.ai.getApiKey()`. If no key, renders the same "paste your Gemini API key" prompt used by the AI Template Builder. No second key storage.

---

## AI Synthesis

### Prompt: `FB.deepScrape._SYNTH_PROMPT`

Instructs Gemini to:

- Read all page markdowns (concatenated, separated by `## PAGE: <url>` headers)
- Infer brand identity (colors, tone, industry, audience) from the content
- Generate a single unified 8–16 block template covering the full site's story
- Use the same block types and JSON schema as `FB.agent.generate` output
- Inject 1–2 Veltro widgets appropriate to the brand (reuses Veltro widget list from `FB.agent._VELTRO_PROMPT`)

### Output format

Same `{ name, blocks }` JSON as the AI Template Builder — so `FB.ai._validate()` and `FB.ai._approve()` work without modification.

### Token budget

Page markdowns are trimmed to 2000 chars each before concatenation. At 50 pages × 2000 chars = 100k chars input — within Gemini 2.0 Flash's context window.

---

## Result UX

The `result` state renders an identical block preview list to the AI Template Builder (block type icons, labels, remove buttons). The three action buttons:

- **✓ Approve & Load Template** — calls `FB.deepScrape._approve()` which reuses `FB.ai._approve()` logic directly
- **✕ Discard** — resets to idle
- **⟳ Regenerate** — re-runs `_synthesise()` from existing `_pages` (no re-crawl)

---

## What Does Not Change

- `js/scraper.js` — untouched
- `js/ai-agent.js` — untouched
- `js/ai-templates.js` — untouched
- All existing import dialogs and their behaviour
- Canvas, panels, blocks — untouched

---

## File Change Summary

| File                     | Change                                                                                  |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `server.py`              | Add `_handle_deep_scrape_map()`, `_handle_deep_scrape_crawl()`, route both in `do_POST` |
| `js/deep-scrape.js`      | New file — entire feature                                                               |
| `src/main.js`            | Add `import "../js/deep-scrape.js"`                                                     |
| `framework-builder.html` | Add button in Assets tab + `#ds-deep-scrape-overlay` div                                |
