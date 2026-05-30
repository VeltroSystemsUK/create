# Deep Scrape Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "🕷 Deep Scrape" button that crawls an entire website (5–50 pages) and synthesises all content into a single unified Framework Builder template via a dedicated overlay.

**Architecture:** Two new server endpoints handle URL discovery (`/api/deep-scrape/map`) and batch scraping (`/api/deep-scrape/crawl`). A new `js/deep-scrape.js` module owns the overlay UI, pipeline orchestration, and Gemini synthesis call. The result loads onto the canvas via the same block-loading logic as the existing AI Template Builder.

**Tech Stack:** Python `concurrent.futures.ThreadPoolExecutor` (server), Firecrawl CLI, Gemini 2.0 Flash (via existing `FB.agent._call`), vanilla JS on the `FB.deepScrape` namespace.

---

## File Map

| File                     | Action | What changes                                                                            |
| ------------------------ | ------ | --------------------------------------------------------------------------------------- |
| `server.py`              | Modify | Add `_handle_deep_scrape_map()`, `_handle_deep_scrape_crawl()`, route both in `do_POST` |
| `js/deep-scrape.js`      | Create | Entire deep scrape module (~300 lines)                                                  |
| `src/main.js`            | Modify | Add one import line at the end                                                          |
| `framework-builder.html` | Modify | Add button in Assets tab + overlay div                                                  |

---

## Task 1: Server — `/api/deep-scrape/map` endpoint

**Files:**

- Modify: `server.py`

- [ ] **Step 1: Add the route in `do_POST`**

Open `server.py`. Find the `do_POST` method (line ~98). Add two new `elif` branches before the final `else`:

```python
        elif parsed.path == "/api/deep-scrape/map":
            self._handle_deep_scrape_map()
        elif parsed.path == "/api/deep-scrape/crawl":
            self._handle_deep_scrape_crawl()
```

The block should look like this after editing:

```python
    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/scrape":
            self._handle_scrape()
        elif parsed.path == "/api/fetch":
            self._handle_fetch()
        elif parsed.path == "/api/ai-import":
            self._handle_ai_import()
        elif parsed.path == '/api/designs':
            self._handle_design_save()
        elif parsed.path == '/api/ai-image':
            self._handle_ai_image()
        elif parsed.path == '/api/cms/auth/login':
            self._handle_cms_auth_login()
        elif parsed.path == '/api/cms/auth/check':
            self._handle_cms_auth_check()
        elif parsed.path == '/api/cms/content':
            self._handle_cms_content_save()
        elif parsed.path == '/api/cms/media/upload':
            self._handle_cms_media_upload()
        elif parsed.path == "/api/deep-scrape/map":
            self._handle_deep_scrape_map()
        elif parsed.path == "/api/deep-scrape/crawl":
            self._handle_deep_scrape_crawl()
        else:
            self.send_error(HTTPStatus.NOT_FOUND)
```

- [ ] **Step 2: Add `_handle_deep_scrape_map()` method**

Add this method to the `FrameworkHandler` class, after `_handle_ai_import` (around line 253):

```python
    def _handle_deep_scrape_map(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length)) if length else {}
        except Exception as e:
            self._json_response({"error": "Failed to parse request: " + str(e)}, 400)
            return

        url = body.get("url", "").strip()
        if not url:
            self._json_response({"error": "Missing 'url'"}, 400)
            return

        # Derive base origin for same-origin filtering
        try:
            parsed_url = urllib.parse.urlparse(url)
            origin = parsed_url.scheme + "://" + parsed_url.netloc
        except Exception:
            self._json_response({"error": "Invalid URL"}, 400)
            return

        print(f"[DeepScrape] Mapping {url}...")
        try:
            result = subprocess.run(
                ["firecrawl", "map", url, "--limit", "50", "--json"],
                capture_output=True, text=True, timeout=30,
            )
            if result.returncode != 0:
                self._json_response({"error": "Map failed: " + result.stderr.strip()[:200]}, 500)
                return

            # firecrawl map --json returns a JSON array or object with a links key
            raw = result.stdout.strip()
            if not raw:
                self._json_response({"error": "No URLs discovered"}, 500)
                return

            parsed_json = json.loads(raw)
            # Handle both array and {"links": [...]} shapes
            if isinstance(parsed_json, list):
                all_urls = parsed_json
            elif isinstance(parsed_json, dict):
                all_urls = parsed_json.get("links", parsed_json.get("urls", []))
            else:
                all_urls = []

            # Same-origin filter + deduplicate + limit
            seen = set()
            urls = []
            for u in all_urls:
                if not isinstance(u, str):
                    continue
                if u in seen:
                    continue
                if not u.startswith(origin):
                    continue
                seen.add(u)
                urls.append(u)
                if len(urls) >= 50:
                    break

            if not urls:
                # Fallback: at least return the root URL
                urls = [url]

            print(f"[DeepScrape] Found {len(urls)} URLs")
            self._json_response({"urls": urls, "count": len(urls)})

        except subprocess.TimeoutExpired:
            self._json_response({"error": "Map timed out (30s). Check URL is valid."}, 504)
        except FileNotFoundError:
            self._json_response({"error": "Firecrawl CLI not found. Install with: npm i -g firecrawl"}, 500)
        except json.JSONDecodeError:
            self._json_response({"error": "Could not parse firecrawl map output"}, 500)
        except Exception as e:
            self._json_response({"error": str(e)[:200]}, 500)
```

- [ ] **Step 3: Restart server and smoke-test the endpoint**

Kill the running server (Ctrl+C in its terminal) and restart:

```bash
python3 server.py
```

Then in another terminal:

```bash
curl -s -X POST http://localhost:8899/api/deep-scrape/map \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}' | python3 -m json.tool
```

Expected output (shape):

```json
{
  "urls": ["https://example.com", "https://example.com/about", ...],
  "count": 3
}
```

If firecrawl map returns only the root URL for example.com, that is correct — it's a simple site.

- [ ] **Step 4: Commit**

```bash
git add server.py
git commit -m "feat: add /api/deep-scrape/map endpoint"
```

---

## Task 2: Server — `/api/deep-scrape/crawl` endpoint

**Files:**

- Modify: `server.py`

- [ ] **Step 1: Add `concurrent.futures` import at the top of `server.py`**

`server.py` already imports `subprocess`, `json`, `os`, etc. at the top. Add one more:

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
```

Add this line after the existing stdlib imports (around line 14, after `from html.parser import HTMLParser`).

- [ ] **Step 2: Add `_handle_deep_scrape_crawl()` method**

Add this method directly after `_handle_deep_scrape_map()`:

```python
    def _handle_deep_scrape_crawl(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length)) if length else {}
        except Exception as e:
            self._json_response({"error": "Failed to parse request: " + str(e)}, 400)
            return

        urls = body.get("urls", [])
        if not urls or not isinstance(urls, list):
            self._json_response({"error": "Missing 'urls' array"}, 400)
            return

        urls = urls[:50]  # hard cap
        print(f"[DeepScrape] Crawling {len(urls)} pages...")

        def scrape_one(url):
            try:
                result = subprocess.run(
                    ["firecrawl", "scrape", url, "--only-main-content", "--format", "markdown"],
                    capture_output=True, text=True, timeout=60,
                )
                md = result.stdout.strip() if result.returncode == 0 else ""
                if not md:
                    print(f"[DeepScrape] Skipping {url} — empty")
                    return None

                # Extract title from first H1 in markdown
                title = url  # fallback
                for line in md.splitlines():
                    if line.startswith("# "):
                        title = line[2:].strip()
                        break
                else:
                    # Fallback: use URL path segment
                    path = urllib.parse.urlparse(url).path.strip("/")
                    if path:
                        title = path.split("/")[-1].replace("-", " ").replace("_", " ").title()
                    else:
                        title = urllib.parse.urlparse(url).netloc

                return {"url": url, "title": title, "markdown": md}
            except subprocess.TimeoutExpired:
                print(f"[DeepScrape] Timeout on {url}")
                return None
            except Exception as e:
                print(f"[DeepScrape] Error on {url}: {e}")
                return None

        pages = []
        # Preserve input order: collect futures mapped to index
        results_map = {}
        try:
            with ThreadPoolExecutor(max_workers=5) as executor:
                future_to_idx = {executor.submit(scrape_one, url): i for i, url in enumerate(urls)}
                for future in as_completed(future_to_idx, timeout=120):
                    idx = future_to_idx[future]
                    try:
                        result = future.result()
                        if result:
                            results_map[idx] = result
                    except Exception as e:
                        print(f"[DeepScrape] Future error: {e}")
        except Exception as e:
            self._json_response({"error": "Crawl failed: " + str(e)[:200]}, 500)
            return

        # Re-sort by original URL order
        pages = [results_map[i] for i in sorted(results_map.keys())]
        print(f"[DeepScrape] Crawled {len(pages)} pages successfully")
        self._json_response({"pages": pages})
```

- [ ] **Step 3: Restart server and smoke-test**

```bash
# Restart server
python3 server.py

# Test (uses example.com root — will return its markdown)
curl -s -X POST http://localhost:8899/api/deep-scrape/crawl \
  -H "Content-Type: application/json" \
  -d '{"urls":["https://example.com"]}' | python3 -m json.tool
```

Expected (shape):

```json
{
  "pages": [
    {
      "url": "https://example.com",
      "title": "Example Domain",
      "markdown": "# Example Domain\n\nThis domain is..."
    }
  ]
}
```

- [ ] **Step 4: Commit**

```bash
git add server.py
git commit -m "feat: add /api/deep-scrape/crawl endpoint with parallel scraping"
```

---

## Task 3: HTML — button and overlay

**Files:**

- Modify: `framework-builder.html`

- [ ] **Step 1: Add the Deep Scrape button in the Assets tab**

Find this block in `framework-builder.html` (around line 769):

```html
<button
  class="ds-full-btn"
  style="background: #f97316; color: #fff"
  onclick="FB.ai.open()"
>
  ✨ AI Template Builder
</button>
```

Add the new button immediately after it:

```html
<button
  class="ds-full-btn"
  style="background: #7c3aed; color: #fff"
  onclick="FB.deepScrape.open()"
>
  🕷 Deep Scrape
</button>
```

- [ ] **Step 2: Add the overlay div**

Find this block in `framework-builder.html` (around line 897):

```html
<!-- AI TEMPLATE BUILDER OVERLAY -->
<div id="ds-ai-template-overlay" style="display: none">
  <div id="ds-ai-template-modal">
    <div class="ds-modal-head">
      <span>🤖 AI Template Builder</span>
      <button onclick="FB.ai.close()">✕</button>
    </div>
    <div id="ds-ai-template-main"></div>
  </div>
</div>
```

Add the deep scrape overlay immediately after it:

```html
<!-- DEEP SCRAPE OVERLAY -->
<div id="ds-deep-scrape-overlay" style="display: none">
  <div id="ds-deep-scrape-modal">
    <div class="ds-modal-head">
      <span>🕷 Deep Scrape</span>
      <button onclick="FB.deepScrape.close()">✕</button>
    </div>
    <div id="ds-deep-scrape-main"></div>
  </div>
</div>
```

- [ ] **Step 3: Verify HTML is valid**

```bash
grep -n "ds-deep-scrape" framework-builder.html
```

Expected — three lines:

```
NNN:    <div id="ds-deep-scrape-overlay" style="display: none">
NNN:        <div id="ds-deep-scrape-modal">
NNN:        <div id="ds-deep-scrape-main"></div>
```

Also check the button:

```bash
grep -n "FB.deepScrape.open" framework-builder.html
```

Expected: one line with the button onclick.

- [ ] **Step 4: Commit**

```bash
git add framework-builder.html
git commit -m "feat: add Deep Scrape button and overlay HTML"
```

---

## Task 4: JS — module scaffold, idle state, open/close

**Files:**

- Create: `js/deep-scrape.js`

- [ ] **Step 1: Create `js/deep-scrape.js` with scaffold and idle render**

Create the file with this full content:

```js
// Deep Scrape — full-site crawl + AI synthesis pipeline.
// States: idle → mapping → crawling → [review] → synthesising → result

FB.deepScrape = FB.deepScrape || {};

FB.deepScrape._state = "idle";
FB.deepScrape._pages = []; // [{ url, title, markdown }]
FB.deepScrape._result = null; // { template: { name, blocks }, validation }
FB.deepScrape._mode = null; // "auto" | "review"
FB.deepScrape._error = null;
FB.deepScrape._urlCount = 0; // number of URLs found during map

FB.deepScrape.open = function () {
  FB.deepScrape._state = "idle";
  FB.deepScrape._pages = [];
  FB.deepScrape._result = null;
  FB.deepScrape._mode = null;
  FB.deepScrape._error = null;
  FB.deepScrape._urlCount = 0;
  document.getElementById("ds-deep-scrape-overlay").style.display = "flex";
  FB.deepScrape._render();
};

FB.deepScrape.close = function () {
  document.getElementById("ds-deep-scrape-overlay").style.display = "none";
  FB.deepScrape._state = "idle";
  FB.deepScrape._pages = [];
  FB.deepScrape._result = null;
  FB.deepScrape._error = null;
};

FB.deepScrape._esc = function (s) {
  var d = document.createElement("div");
  d.textContent = String(s || "");
  return d.innerHTML;
};

FB.deepScrape._render = function () {
  var main = document.getElementById("ds-deep-scrape-main");
  if (!main) return;

  var key = FB.ai.getApiKey();
  var h = "";

  // No Gemini key — show key prompt (same pattern as AI Template Builder)
  if (!key) {
    h += '<div class="ai-section">';
    h += '<div class="ai-section-title">🔑 Gemini API Key Required</div>';
    h +=
      '<p style="font-size:11px;color:#888;margin:0 0 8px">Deep Scrape uses Gemini to synthesise scraped pages. Get a free key at <a href="https://aistudio.google.com/apikey" target="_blank" style="color:#CDFE00">aistudio.google.com/apikey</a></p>';
    h += '<div style="display:flex;gap:6px">';
    h +=
      '<input id="ds-api-key-input" type="password" placeholder="Paste your Gemini API key..." style="flex:1;padding:8px;background:#1a1a1a;border:1px solid #333;border-radius:6px;color:#fff;font-size:12px">';
    h +=
      '<button class="ds-save-btn" onclick="FB.deepScrape._saveKey()">Save</button>';
    h += "</div></div>";
    main.innerHTML = h;
    return;
  }

  // Error banner
  if (FB.deepScrape._error) {
    h +=
      '<div class="ai-section"><div class="ai-error">⚠ ' +
      FB.deepScrape._esc(FB.deepScrape._error) +
      "</div></div>";
  }

  // State-specific UI
  var state = FB.deepScrape._state;

  if (state === "idle") {
    h += '<div class="ai-section">';
    h += '<div class="ai-section-title">🕷 Deep Scrape</div>';
    h +=
      '<p style="font-size:11px;color:#888;margin:0 0 10px;line-height:1.6">Enter a URL to crawl the entire site. All major pages will be scraped and synthesised into a single unified template by AI.</p>';
    h +=
      '<input type="url" id="ds-url-input" placeholder="https://example.com" style="width:100%;padding:10px;background:#1a1a1a;border:1px solid #333;border-radius:6px;color:#fff;font-size:13px;font-family:inherit;box-sizing:border-box;margin-bottom:10px">';
    h += '<div style="display:flex;gap:8px">';
    h +=
      '<button class="ds-save-btn" onclick="FB.deepScrape._start(\'auto\')" style="flex:1">⚡ Auto</button>';
    h +=
      '<button class="tb-btn" onclick="FB.deepScrape._start(\'review\')" style="flex:1">👁 Review</button>';
    h += "</div>";
    h +=
      '<div style="font-size:10px;color:#555;margin-top:8px;line-height:1.5"><strong style="color:#888">Auto</strong> — crawl and synthesise in one go. <strong style="color:#888">Review</strong> — see discovered pages and remove any before synthesis.</div>';
    h += "</div>";
  }

  if (state === "mapping") {
    h += '<div class="ai-section">';
    h +=
      '<div class="ai-generating"><div class="ai-spinner"></div><span>' +
      FB.deepScrape._esc(FB.deepScrape._statusMsg || "Discovering pages...") +
      "</span></div>";
    h += "</div>";
  }

  if (state === "crawling") {
    h += '<div class="ai-section">';
    h +=
      '<div class="ai-generating"><div class="ai-spinner"></div><span>' +
      FB.deepScrape._esc(FB.deepScrape._statusMsg || "Scraping pages...") +
      "</span></div>";
    h += "</div>";
  }

  if (state === "review") {
    h += '<div class="ai-section">';
    h +=
      '<div class="ai-section-title">📄 Discovered Pages (' +
      FB.deepScrape._pages.length +
      ")</div>";
    h +=
      '<p style="font-size:11px;color:#888;margin:0 0 10px">Remove any pages you don\'t want included before synthesis.</p>';
    h += '<div class="ai-generated-blocks">';
    FB.deepScrape._pages.forEach(function (page, i) {
      h += '<div class="ai-block-card">';
      h +=
        '<div class="ai-block-card-icon" style="background:#2a1a4a;color:#a78bfa;font-size:16px">📄</div>';
      h += '<div class="ai-block-card-info">';
      h +=
        '<div class="ai-block-card-label">' +
        FB.deepScrape._esc(page.title) +
        "</div>";
      h +=
        '<div class="ai-block-card-sub" style="font-size:9px">' +
        FB.deepScrape._esc(page.url) +
        "</div>";
      h += "</div>";
      h += '<div class="ai-block-card-actions">';
      h +=
        '<button class="tb-btn" onclick="FB.deepScrape._removePage(' +
        i +
        ')" style="font-size:10px;padding:2px 6px">✕</button>';
      h += "</div></div>";
    });
    h += "</div>";
    h +=
      '<div class="ai-actions" style="margin-top:10px;display:flex;gap:6px">';
    h +=
      '<button class="ds-save-btn" onclick="FB.deepScrape._synthesise()" style="flex:1">✨ Synthesise → (' +
      FB.deepScrape._pages.length +
      " pages)</button>";
    h +=
      '<button class="tb-btn" onclick="FB.deepScrape.close()">Cancel</button>';
    h += "</div></div>";
  }

  if (state === "synthesising") {
    h += '<div class="ai-section">';
    h +=
      '<div class="ai-generating"><div class="ai-spinner"></div><span>' +
      FB.deepScrape._esc(
        FB.deepScrape._statusMsg || "Building unified design...",
      ) +
      "</span></div>";
    h += "</div>";
  }

  if (state === "result") {
    h += FB.deepScrape._renderResult();
  }

  main.innerHTML = h;
};

FB.deepScrape._saveKey = function () {
  var input = document.getElementById("ds-api-key-input");
  if (input && input.value.trim()) {
    FB.ai.setApiKey(input.value.trim());
    FB.deepScrape._render();
  }
};

FB.deepScrape._removePage = function (idx) {
  FB.deepScrape._pages.splice(idx, 1);
  FB.deepScrape._render();
};
```

- [ ] **Step 2: Wire up import in `src/main.js`**

Open `src/main.js`. Add this line at the very end:

```js
import "../js/deep-scrape.js";
```

The end of the file should look like:

```js
import "../js/motion-creator.js";
import "../js/deep-scrape.js";
```

- [ ] **Step 3: Verify the overlay opens**

Start the Vite dev server if not running:

```bash
npm run dev
```

Open `http://localhost:3000/framework-builder.html`. Click the Assets tab on the left panel. You should see a purple "🕷 Deep Scrape" button. Click it — the overlay should open with a URL input and "⚡ Auto" / "👁 Review" buttons.

- [ ] **Step 4: Commit**

```bash
git add js/deep-scrape.js src/main.js
git commit -m "feat: add Deep Scrape module scaffold and idle state"
```

---

## Task 5: JS — pipeline (map → crawl → review / synthesise)

**Files:**

- Modify: `js/deep-scrape.js`

- [ ] **Step 1: Add `_start()` and `_crawl()` to `js/deep-scrape.js`**

Append these functions to the end of `js/deep-scrape.js`:

```js
FB.deepScrape._start = function (mode) {
  var input = document.getElementById("ds-url-input");
  var url = input ? input.value.trim() : "";
  if (!url) {
    FB.util.showToast("Please enter a URL");
    return;
  }
  if (!url.startsWith("http")) url = "https://" + url;

  FB.deepScrape._mode = mode;
  FB.deepScrape._error = null;
  FB.deepScrape._pages = [];
  FB.deepScrape._state = "mapping";
  FB.deepScrape._statusMsg =
    "Discovering pages on " + new URL(url).hostname + "...";
  FB.deepScrape._render();

  fetch("/api/deep-scrape/map", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: url }),
  })
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      if (data.error) {
        FB.deepScrape._error = data.error;
        FB.deepScrape._state = "idle";
        FB.deepScrape._render();
        return;
      }
      FB.deepScrape._urlCount = data.count;
      FB.deepScrape._crawl(data.urls);
    })
    .catch(function (err) {
      FB.deepScrape._error = "Map failed: " + err.message;
      FB.deepScrape._state = "idle";
      FB.deepScrape._render();
    });
};

FB.deepScrape._crawl = function (urls) {
  FB.deepScrape._state = "crawling";
  FB.deepScrape._statusMsg =
    "Scraping " + urls.length + " pages, please wait...";
  FB.deepScrape._render();

  fetch("/api/deep-scrape/crawl", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls: urls }),
  })
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      if (data.error) {
        FB.deepScrape._error = data.error;
        FB.deepScrape._state = "idle";
        FB.deepScrape._render();
        return;
      }
      FB.deepScrape._pages = data.pages || [];
      if (FB.deepScrape._pages.length === 0) {
        FB.deepScrape._error =
          "No pages could be scraped. Check the URL and try again.";
        FB.deepScrape._state = "idle";
        FB.deepScrape._render();
        return;
      }
      if (FB.deepScrape._mode === "review") {
        FB.deepScrape._state = "review";
        FB.deepScrape._render();
      } else {
        FB.deepScrape._synthesise();
      }
    })
    .catch(function (err) {
      FB.deepScrape._error = "Crawl failed: " + err.message;
      FB.deepScrape._state = "idle";
      FB.deepScrape._render();
    });
};
```

- [ ] **Step 2: Test the map → crawl → review flow**

Open the overlay, enter `https://example.com`, click "👁 Review". The overlay should:

1. Show "Discovering pages on example.com..."
2. Show "Scraping 1 pages, please wait..."
3. Show the review state with Example Domain listed

If you see an error toast instead, check the server terminal for `[DeepScrape]` log lines.

- [ ] **Step 3: Test Auto mode short-circuits review**

Enter `https://example.com`, click "⚡ Auto". The overlay should skip review and transition directly to "synthesising" state (which will show a spinner — synthesis isn't wired yet so it may error, that's fine at this step).

- [ ] **Step 4: Commit**

```bash
git add js/deep-scrape.js
git commit -m "feat: add deep scrape map → crawl pipeline"
```

---

## Task 6: JS — synthesis prompt, result rendering, approve

**Files:**

- Modify: `js/deep-scrape.js`

- [ ] **Step 1: Add the synthesis prompt constant**

Add this near the top of `js/deep-scrape.js`, after the state variable declarations:

```js
FB.deepScrape._SYNTH_PROMPT =
  "You are a web designer synthesising multiple scraped pages into a single Framework Builder template.\n" +
  "You will receive content from multiple pages, each labeled '## PAGE: <url>'.\n\n" +
  "Your job:\n" +
  "1. Read all pages to understand the brand: industry, tone, colors, audience, key offerings.\n" +
  '2. Generate a single unified website template as JSON: { "name": "Brand Name", "blocks": [...] }\n' +
  "3. The template covers the full brand story: nav → hero → key sections from each page → footer.\n" +
  "4. Generate 8-16 blocks total. Draw the best content from across all pages.\n\n" +
  "Return ONLY valid JSON — no markdown fences, no commentary.\n\n" +
  "## Standard block types (use these for the main sections):\n" +
  "nav, hero, splitHero, features, services, stats, testimonial, process, work, pricing, faq, textBlock, colorBlock, footer\n\n" +
  "## Veltro canvas widgets (add 1-2 to enhance the design):\n" +
  "TYPOGRAPHY: kineticText, textScramble, typewriterReveal, morphingText\n" +
  "PHYSICS: bubblePop, gravityWells, fluidSimulation, pendulumWave\n" +
  "BACKGROUNDS: morphBlob, gradientFlow, auroraBorealis, particleNebula, geometricPatterns, liquidGradient, shaderBg, constellationLines\n" +
  "SCROLL: scrollProgressRing, stickyScrollStack, mosaicAssemble, parallaxImageStack\n" +
  "SPATIAL: tiltCard3d, carousel3d, holographicCard, glitchSection\n\n" +
  "## Rules:\n" +
  "- Every block MUST have: id (unique, e.g. nav_1), type, props\n" +
  "- Infer brand accent color from the content (or use #CDFE00 as default)\n" +
  "- Nav and Footer are mandatory\n" +
  "- Hero uses the main value proposition from the homepage\n" +
  "- TextColor must be dark (#111111) on light backgrounds, light (#f7f6f2) on dark\n" +
  "- Veltro widgets as backgrounds: set height 500-700 and insert behind hero or between sections\n" +
  '- Return { "name": "Brand Name", "blocks": [...] } — nothing else\n\n' +
  "## SCRAPED CONTENT:\n";
```

- [ ] **Step 2: Add `_synthesise()` function**

Append to `js/deep-scrape.js`:

````js
FB.deepScrape._synthesise = function () {
  if (!FB.deepScrape._pages.length) {
    FB.deepScrape._error = "No pages to synthesise";
    FB.deepScrape._state = "idle";
    FB.deepScrape._render();
    return;
  }

  FB.deepScrape._state = "synthesising";
  FB.deepScrape._statusMsg =
    "Building unified design from " + FB.deepScrape._pages.length + " pages...";
  FB.deepScrape._render();

  // Build the multi-page content block — 2000 chars per page
  var content = FB.deepScrape._pages
    .map(function (page) {
      return (
        "## PAGE: " +
        page.url +
        "\n### " +
        page.title +
        "\n\n" +
        page.markdown.slice(0, 2000)
      );
    })
    .join("\n\n---\n\n");

  FB.agent
    ._call(FB.deepScrape._SYNTH_PROMPT, content, {
      temperature: 0.75,
      maxTokens: 8192,
    })
    .then(function (text) {
      // Strip code fences if present
      var raw = text.trim();
      if (raw.startsWith("```")) {
        raw = raw
          .replace(/^```[a-zA-Z]*\n?/, "")
          .replace(/\n?```\s*$/, "")
          .trim();
      }
      var parsed = FB.ai._extractJSON(raw);
      if (!parsed || !Array.isArray(parsed.blocks)) {
        throw new Error("AI returned invalid template JSON");
      }
      // Ensure every block has a unique id
      var ids = {};
      parsed.blocks.forEach(function (b, i) {
        if (!b.id || ids[b.id]) b.id = (b.type || "block") + "_" + (i + 1);
        ids[b.id] = true;
      });
      var validation = FB.ai._validate(parsed);
      FB.deepScrape._result = { template: parsed, validation: validation };
      FB.deepScrape._state = "result";
      FB.deepScrape._error = !validation.valid
        ? "Minor issues detected: " + validation.errors.join("; ")
        : null;
      FB.deepScrape._render();
    })
    .catch(function (err) {
      FB.deepScrape._error =
        "Synthesis failed: " + (err.message || String(err));
      FB.deepScrape._state = FB.deepScrape._pages.length ? "review" : "idle";
      FB.deepScrape._render();
    });
};
````

- [ ] **Step 3: Add `_renderResult()` and `_approve()`**

Append to `js/deep-scrape.js`:

```js
FB.deepScrape._renderResult = function () {
  var tpl = FB.deepScrape._result && FB.deepScrape._result.template;
  if (!tpl || !tpl.blocks) return "";

  var allDefs = Object.assign(
    {},
    FB.blocks.BLOCK_DEFS,
    FB.blocks.CUSTOM_BLOCK_DEFS,
    FB.blocks.ECOMMERCE_DEFS,
  );

  var h = '<div class="ai-section">';
  h +=
    '<div class="ai-section-title">📄 ' +
    FB.deepScrape._esc(tpl.name || "Deep Scraped Template") +
    "</div>";
  h += '<div class="ai-generated-blocks">';

  tpl.blocks.forEach(function (block, i) {
    var def = allDefs[block.type] || FB.widgets.get(block.type) || {};
    var label = def.label || block.type;
    var sub = def.sublabel || "";
    var icon = def.icon || "□";
    h += '<div class="ai-block-card">';
    h +=
      '<div class="ai-block-card-icon" style="background:' +
      (def.iconBg || "#2a2a2a") +
      ";color:" +
      (def.iconColor || "#ccc") +
      '">' +
      icon +
      "</div>";
    h += '<div class="ai-block-card-info">';
    h +=
      '<div class="ai-block-card-label">' +
      (i + 1) +
      ". " +
      FB.deepScrape._esc(label) +
      "</div>";
    if (sub)
      h +=
        '<div class="ai-block-card-sub">' + FB.deepScrape._esc(sub) + "</div>";
    h += "</div>";
    h += '<div class="ai-block-card-actions">';
    h +=
      '<button class="tb-btn" onclick="FB.deepScrape._removeBlock(' +
      i +
      ')" style="font-size:10px;padding:2px 6px">✕</button>';
    h += "</div></div>";
  });

  h += "</div>";
  h += '<div class="ai-actions" style="display:flex;gap:6px;margin-top:10px">';
  h +=
    '<button class="ds-save-btn" onclick="FB.deepScrape._approve()" style="flex:1">✓ Approve & Load</button>';
  h +=
    '<button class="tb-btn" onclick="FB.deepScrape.close()">✕ Discard</button>';
  h +=
    '<button class="tb-btn" onclick="FB.deepScrape._synthesise()">⟳ Regenerate</button>';
  h += "</div></div>";
  return h;
};

FB.deepScrape._removeBlock = function (idx) {
  if (!FB.deepScrape._result || !FB.deepScrape._result.template) return;
  FB.deepScrape._result.template.blocks.splice(idx, 1);
  FB.deepScrape._render();
};

FB.deepScrape._approve = function () {
  var tpl = FB.deepScrape._result && FB.deepScrape._result.template;
  if (!tpl || !tpl.blocks) return;

  if (FB.state.blocks.length > 0) {
    if (!confirm("Load this template? It will replace the current canvas."))
      return;
  }

  var allDefs = Object.assign(
    {},
    FB.blocks.BLOCK_DEFS,
    FB.blocks.CUSTOM_BLOCK_DEFS,
    FB.blocks.ECOMMERCE_DEFS,
  );

  FB.state.saveHistory();
  FB.state.blocks = tpl.blocks.map(function (b) {
    var def = allDefs[b.type] || FB.widgets.get(b.type) || {};
    var defaults = def.defaultProps || {};
    var block = {
      id: b.id || FB.state.genId(),
      type: b.type,
      props: Object.assign({}, defaults, b.props || {}),
    };
    if (b.bindings && b.bindings.length) block.bindings = b.bindings;
    return block;
  });
  FB.state.selectedId = null;
  FB.canvas.render();
  FB.panels.renderRightPanel();
  FB.util.showToast("✓ Template loaded: " + (tpl.name || "Deep Scraped Site"));
  FB.deepScrape.close();
  FB.export.close();
};
```

- [ ] **Step 4: End-to-end test**

1. Open the overlay, enter a real URL (e.g. `https://stripe.com`), click "⚡ Auto"
2. Watch: mapping → crawling → synthesising spinners
3. Result state should appear with a block list
4. Click "✓ Approve & Load" — blocks load onto canvas, overlay closes, toast appears

Also test Review mode:

1. Enter URL, click "👁 Review"
2. After crawling, page list appears — remove one, click "Synthesise →"
3. Result loads as before

- [ ] **Step 5: Commit**

```bash
git add js/deep-scrape.js
git commit -m "feat: add deep scrape synthesis, result rendering, and approve"
```

---

## Task 7: Final commit and cleanup

- [ ] **Step 1: Verify all existing features still work**

Check these still function correctly:

- "⊞ Browse Templates" button opens the templates panel
- "✨ AI Template Builder" button opens the AI overlay
- "🎬 Motion Creator" button opens motion creator
- Existing Import Web (from toolbar) still works
- Existing AI Import still works

- [ ] **Step 2: Final commit**

```bash
git add -A
git status  # confirm only intended files changed
git commit -m "feat: Deep Scrape — full-site crawl and AI synthesis pipeline"
```

---

## Self-Review Notes

- **Spec coverage:** All 6 overlay states implemented. Both Auto and Review modes wired. Two server endpoints with same-origin filter, title extraction, ThreadPoolExecutor. Synthesis uses `FB.agent._call` with Veltro widget list. Result reuses `FB.ai._validate`, `FB.ai._extractJSON`. Approve duplicates `FB.ai._approve` logic (can't reuse directly — `FB.ai._approve` reads from `FB.ai._generated`, not our state). `_removeBlock` added for result editing.
- **Placeholders:** None.
- **Type consistency:** `FB.deepScrape._pages` is `[{url, title, markdown}]` throughout. `FB.deepScrape._result` is `{template: {name, blocks}, validation}` throughout. `FB.agent._call(system, userContent, opts)` signature matches `ai-agent.js:8`.
