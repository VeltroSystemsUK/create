#!/usr/bin/env python3
"""Framework Builder — dev server with Firecrawl scrape API."""
import http.server
import json
import os
import subprocess
import urllib.parse
import urllib.request
import re
import hashlib
import random
import string
import uuid
from http import HTTPStatus
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor, as_completed

PORT = 8899
STATIC_DIR = os.path.dirname(os.path.abspath(__file__))


class FrameworkHandler(http.server.SimpleHTTPRequestHandler):
    """Extends the static server with API endpoints."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=STATIC_DIR, **kwargs)

    def end_headers(self):
        # Prevent browser caching of JSON template files
        if self.path.endswith('.json'):
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/designs':
            self._handle_designs_list()
        elif parsed.path.startswith('/api/designs/'):
            slug = parsed.path.split('/api/designs/')[1]
            self._handle_design_get(slug)
        elif parsed.path == '/api/cms/schema':
            self._handle_cms_get('schema')
        elif parsed.path == '/api/cms/content':
            self._handle_cms_get('content')
        elif parsed.path == '/api/cms/media':
            self._handle_cms_media_list()
        elif parsed.path == '/admin' or parsed.path.startswith('/admin/'):
            self._handle_admin_serve()
        elif parsed.path.startswith('/media/'):
            media_path = os.path.join(STATIC_DIR, parsed.path.lstrip('/'))
            if os.path.exists(media_path) and os.path.isfile(media_path):
                ext = os.path.splitext(media_path)[1].lower()
                content_types = {
                    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
                    '.png': 'image/png', '.gif': 'image/gif',
                    '.webp': 'image/webp', '.svg': 'image/svg+xml',
                }
                self.send_response(200)
                self.send_header('Content-Type', content_types.get(ext, 'application/octet-stream'))
                self.send_header('Cache-Control', 'public, max-age=3600')
                self.end_headers()
                with open(media_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_error(HTTPStatus.NOT_FOUND)
        else:
            super().do_GET()

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path.startswith('/api/designs/'):
            slug = parsed.path.split('/api/designs/')[1]
            self._handle_design_delete(slug)
        elif parsed.path.startswith('/api/cms/media/'):
            self._handle_cms_media_delete()
        else:
            self.send_error(HTTPStatus.NOT_FOUND)

    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/cms/content':
            self._handle_cms_content_save()
        elif parsed.path == '/api/cms/content/bulk':
            self._handle_cms_content_bulk_save()
        elif parsed.path == '/api/cms/auth/login':
            self._handle_cms_auth_login()
        else:
            self.send_error(HTTPStatus.NOT_FOUND)

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

    def _handle_scrape(self):
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length)) if length else {}
        url = body.get("url", "").strip()

        if not url:
            self._json_response({"error": "Missing 'url' parameter"}, 400)
            return

        try:
            # Fetch raw HTML for design/structure, markdown for text
            md_result = subprocess.run(
                ["firecrawl", "scrape", url, "--only-main-content", "--format", "markdown"],
                capture_output=True,
                text=True,
                timeout=60,
            )
            html_result = subprocess.run(
                ["firecrawl", "scrape", url, "--only-main-content", "--format", "rawHtml"],
                capture_output=True,
                text=True,
                timeout=60,
            )

            response = {"success": True}
            if md_result.returncode == 0:
                response["markdown"] = md_result.stdout.strip()
            if html_result.returncode == 0:
                response["html"] = html_result.stdout.strip()

            self._json_response(response)
        except subprocess.TimeoutExpired:
            self._json_response({"error": "Scrape timed out"}, 504)
        except FileNotFoundError:
            self._json_response({"error": "Firecrawl CLI not found"}, 500)
        except Exception as e:
            self._json_response({"error": str(e)}, 500)

    def _handle_fetch(self):
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length)) if length else {}
        url = body.get("url", "").strip()
        if not url:
            self._json_response({"error": "Missing 'url' parameter"}, 400)
            return

        try:
            result = subprocess.run(
                ["node", "fetch-page.js", url],
                capture_output=True,
                text=True,
                timeout=120,
            )
            if result.returncode != 0:
                # If Playwright fails, still try Firecrawl as fallback
                self._json_response({"error": result.stderr.strip()}, 500)
                return
            data = json.loads(result.stdout)
            self._json_response(data)
        except subprocess.TimeoutExpired:
            self._json_response({"error": "Page fetch timed out"}, 504)
        except Exception as e:
            self._json_response({"error": str(e)}, 500)

    def _handle_ai_import(self):
        try:
            length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(length)) if length else {}
        except Exception as e:
            self._json_response({"error": "Failed to parse request: " + str(e)}, 400)
            return
        url = body.get("url", "").strip()
        api_key = body.get("apiKey", "").strip()
        provider = body.get("provider", "anthropic")

        if not url or not api_key:
            print("[AI] Missing url or apiKey")
            self._json_response({"error": "Missing 'url' or 'apiKey'"}, 400)
            return

        print(f"[AI] Scraping {url}...")
        try:
            result = subprocess.run(
                ["firecrawl", "scrape", url, "--only-main-content", "--format", "markdown"],
                capture_output=True, text=True, timeout=60,
            )
            if result.returncode != 0:
                self._json_response({"error": "Scrape failed"}, 500)
                return
            scraped = result.stdout.strip()
            if not scraped:
                self._json_response({"error": "No content scraped"}, 500)
                return
        except subprocess.TimeoutExpired:
            self._json_response({"error": "Scrape timed out. Check the URL is valid."}, 504)
            return
        except Exception as e:
            self._json_response({"error": "Scrape failed: " + str(e)[:200]}, 500)
            return

        prompt = self._build_ai_prompt(scraped[:8000])
        print(f"[AI] Calling {provider} API ...")
        try:
            if provider == "openai":
                raw = self._call_openai(api_key, prompt)
            elif provider == "gemini":
                raw = self._call_gemini(api_key, prompt)
            else:
                raw = self._call_anthropic(api_key, prompt)
            print(f"[AI] Got response ({len(raw)} chars)")
            raw = raw.strip()
            # Strip code fences if present
            if raw.startswith("```"):
                raw = re.sub(r'^```[a-zA-Z]*\n?', '', raw)
                raw = re.sub(r'\n?```\s*$', '', raw)
                raw = raw.strip()
            # If there's still prose around the array, extract the JSON array directly
            if not raw.startswith("["):
                m = re.search(r'\[[\s\S]*\]', raw)
                if m:
                    raw = m.group(0)
            blocks = json.loads(raw)
            if not isinstance(blocks, list):
                raise ValueError("Not a list")
            site = url.replace("https://","").replace("http://","").replace("www.","").split("/")[0]
            self._json_response({"success":True,"blocks":blocks,"siteName":site})
        except json.JSONDecodeError:
            print("[AI] AI returned invalid JSON")
            self._json_response({"error":"AI returned invalid JSON"}, 500)
        except Exception as e:
            print(f"[AI] AI error: {e}")
            self._json_response({"error":"AI error: "+str(e)}, 500)

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

        try:
            parsed_url = urllib.parse.urlparse(url)
            if parsed_url.scheme not in ("http", "https") or not parsed_url.netloc:
                self._json_response({"error": "Invalid URL — must be http or https"}, 400)
                return
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

            raw = result.stdout.strip()
            if not raw:
                self._json_response({"error": "No URLs discovered"}, 500)
                return

            parsed_json = json.loads(raw)
            if isinstance(parsed_json, list):
                all_urls = parsed_json
            elif isinstance(parsed_json, dict):
                all_urls = parsed_json.get("links", parsed_json.get("urls", []))
            else:
                all_urls = []

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
                title = None
                for line in md.splitlines():
                    if line.startswith("# "):
                        title = line[2:].strip()
                        break
                if not title:
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

        results_map = {}
        try:
            with ThreadPoolExecutor(max_workers=5) as executor:
                future_to_idx = {executor.submit(scrape_one, url): i for i, url in enumerate(urls)}
                try:
                    for future in as_completed(future_to_idx, timeout=120):
                        idx = future_to_idx[future]
                        result = future.result()
                        if result:
                            results_map[idx] = result
                except TimeoutError:
                    print(f"[DeepScrape] Batch timed out — returning {len(results_map)} partial results")
        except Exception as e:
            self._json_response({"error": "Crawl failed: " + str(e)[:200]}, 500)
            return

        pages = [results_map[i] for i in sorted(results_map.keys())]
        print(f"[DeepScrape] Crawled {len(pages)} pages successfully")
        response = {"pages": pages}
        if not pages:
            response["warning"] = "No pages could be scraped. Check the URLs are publicly accessible."
        self._json_response(response)

    def _build_ai_prompt(self, content):
        return '''You are a web-to-block converter. Convert the scraped content into a JSON array of Framework Builder blocks.

BLOCK TYPES (use EXACT prop names):
1. NAV: {"type":"nav","props":{"logoText":"Brand","links":["Link1","Link2"],"ctaText":"CTA","bg":"#111","textColor":"#fff","accentColor":"#CDFE00"}}
2. HERO: {"type":"hero","props":{"eyebrow":"Tagline","headline":"Title text here","subtext":"Description","ctaText":"Button →","bg":"#fff","textColor":"#111","accentColor":"#CDFE00","showBlob":false}}
3. FEATURES: {"type":"features","props":{"label":"Section","headline":"Title","items":[{"icon":"✦","title":"Feature","desc":"Description"}],"bg":"#fff","textColor":"#111","accentColor":"#CDFE00"}}
4. TEXTBLOCK: {"type":"textBlock","props":{"headline":"Section title","body":"Full paragraph of text content here. Can be multiple sentences.","bg":"#fff","textColor":"#111","paddingV":48,"paddingH":48}}
5. COLORBLOCK: {"type":"colorBlock","props":{"headline":"Title","body":"Short text","bg":"#f5f5f5","textColor":"#111","paddingV":60,"paddingH":48}}
6. STATS: {"type":"stats","props":{"stats":[{"num":"99%","label":"Metric"}],"bg":"#1a1a2e","accentColor":"#CDFE00"}}
7. TESTIMONIAL: {"type":"testimonial","props":{"quote":"Quote text here","attribution":"Name — Role","bg":"#1a1a2e","accentColor":"#CDFE00"}}
8. CTA: {"type":"cta","props":{"headline":"Call to action","btnText":"Get started →","bg":"#111","textColor":"#fff"}}
9. FOOTER: {"type":"footer","props":{"logoText":"Brand","tagline":"Tag","cols":[{"heading":"Links","links":["A","B"]}],"copyright":"© 2026","bg":"#111","accentColor":"#CDFE00","textColor":"#fff"}}

RULES (critical):
- Output ONLY a valid JSON array. No markdown, no code fences, no commentary.
- Use EXACT field names from the examples above. Use "headline" not "title", "subtext" not "description", "ctaText" not "cta".
- Create a DIVERSE mix of block types. Do NOT use hero for everything.
- Hero: only for the FIRST major section (big heading + subtext + button). Max 1 per page.
- TextBlock: for paragraphs, article content, descriptions, about sections.
- Features: for lists of items, cards, grid layouts, service offerings.
- Stats: for numbers, metrics, counters.
- Testimonial: for quotes, reviews, social proof.
- CTA: for final call-to-action sections.
- ColorBlock: for short highlighted callouts.
- Always include sensible defaults for bg, textColor, accentColor. Keep textColor dark (#111) on light backgrounds, light (#fff or #f7f6f2) on dark backgrounds.
- Include copyright and link content in FOOTER if visible in the scraped content.
- Generate 5-12 blocks depending on page length.

SCRAPED CONTENT:
```
''' + content + "\n```\n\nBlocks JSON array:"

    def _call_anthropic(self, api_key, prompt):
        req = urllib.request.Request(
            "https://api.anthropic.com/v1/messages",
            data=json.dumps({
                "model": "claude-3-5-sonnet-20241022",
                "max_tokens": 4096,
                "messages": [{"role": "user", "content": prompt}]
            }).encode(),
            headers={
                "Content-Type": "application/json",
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01"
            }
        )
        resp = urllib.request.urlopen(req, timeout=120)
        data = json.loads(resp.read())
        return data["content"][0]["text"]

    def _call_openai(self, api_key, prompt):
        req = urllib.request.Request(
            "https://api.openai.com/v1/chat/completions",
            data=json.dumps({
                "model": "gpt-4o",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 4096
            }).encode(),
            headers={
                "Content-Type": "application/json",
                "Authorization": "Bearer " + api_key
            }
        )
        resp = urllib.request.urlopen(req, timeout=120)
        data = json.loads(resp.read())
        return data["choices"][0]["message"]["content"]

    def _call_gemini(self, api_key, prompt):
        models = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash", "gemini-1.5-pro"]
        for model in models:
            for auth in ["header", "query"]:
                try:
                    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
                    headers = {"Content-Type": "application/json"}
                    if auth == "header":
                        headers["X-Goog-Api-Key"] = api_key
                        req_url = url
                    else:
                        req_url = url + "?key=" + urllib.parse.quote(api_key, safe="")
                    req = urllib.request.Request(
                        req_url,
                        data=json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode(),
                        headers=headers,
                    )
                    resp = urllib.request.urlopen(req, timeout=120)
                    data = json.loads(resp.read())
                    return data["candidates"][0]["content"]["parts"][0]["text"]
                except urllib.error.HTTPError as e:
                    body = e.read().decode()
                    if e.code == 404 or "not found" in body.lower():
                        continue
                    raise Exception(f"Gemini error ({e.code}): {body[:200]}")
                except (KeyError, TypeError):
                    continue
        raise Exception("Gemini API failed. Verify your key at https://aistudio.google.com/apikey")

    def _handle_designs_list(self):
        designs_dir = os.path.join(STATIC_DIR, 'designs')
        if not os.path.exists(designs_dir):
            self._json_response([])
            return
        results = []
        for fname in sorted(os.listdir(designs_dir)):
            if not fname.endswith('.json'):
                continue
            try:
                with open(os.path.join(designs_dir, fname), 'r') as f:
                    d = json.load(f)
                results.append({
                    'name': d.get('name', fname),
                    'slug': d.get('slug', fname[:-5]),
                    'thumbnail': d.get('thumbnail', ''),
                    'modified': d.get('modified', ''),
                    'width': d.get('width', 0),
                    'height': d.get('height', 0),
                })
            except Exception:
                continue
        self._json_response(results)

    def _validate_slug(self, slug):
        return bool(re.fullmatch(r'[a-z0-9-]+', slug))

    def _handle_design_get(self, slug):
        if not self._validate_slug(slug):
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        path = os.path.join(STATIC_DIR, 'designs', slug + '.json')
        if not os.path.exists(path):
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        with open(path, 'r') as f:
            self._json_response(json.load(f))

    def _handle_design_save(self):
        import datetime
        length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(length)) if length else {}
        name = (body.get('name') or 'Untitled').strip()
        slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-') or 'untitled'
        designs_dir = os.path.join(STATIC_DIR, 'designs')
        os.makedirs(designs_dir, exist_ok=True)
        body['slug'] = slug
        body['name'] = name
        body['modified'] = datetime.datetime.utcnow().isoformat() + 'Z'
        with open(os.path.join(designs_dir, slug + '.json'), 'w') as f:
            json.dump(body, f)
        self._json_response({'ok': True, 'slug': slug})

    def _handle_design_delete(self, slug):
        if not self._validate_slug(slug):
            self._json_response({'ok': True})
            return
        path = os.path.join(STATIC_DIR, 'designs', slug + '.json')
        if os.path.exists(path):
            os.remove(path)
        self._json_response({'ok': True})

    def _handle_ai_image(self):
        length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(length)) if length else {}
        prompt = body.get('prompt', '').strip()
        api_key = body.get('apiKey', os.environ.get('GEMINI_API_KEY', ''))
        if not prompt:
            self._json_response({'error': 'Missing prompt'}, 400)
            return
        if not api_key:
            self._json_response({'error': 'No Gemini API key. Set GEMINI_API_KEY or pass apiKey in the request.'}, 400)
            return
        try:
            url = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=' + urllib.parse.quote(api_key, safe='')
            req_data = json.dumps({
                'instances': [{'prompt': prompt}],
                'parameters': {'sampleCount': 1},
            }).encode()
            req = urllib.request.Request(
                url,
                data=req_data,
                headers={'Content-Type': 'application/json'},
            )
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read())
            prediction = data['predictions'][0]
            mime = prediction.get('mimeType', 'image/png')
            b64 = prediction['bytesBase64Encoded']
            self._json_response({'url': 'data:' + mime + ';base64,' + b64})
        except urllib.error.HTTPError as e:
            self._json_response({'error': 'Gemini error: ' + e.read().decode()[:200]}, 500)
        except Exception as e:
            self._json_response({'error': str(e)[:200]}, 500)

    def _cms_data_path(self, filename):
        data_dir = os.path.join(STATIC_DIR, '.cms')
        os.makedirs(data_dir, exist_ok=True)
        return os.path.join(data_dir, filename)

    def _cms_read_json(self, filename, default=None):
        path = self._cms_data_path(filename)
        if os.path.exists(path):
            with open(path, 'r') as f:
                return json.load(f)
        return default if default is not None else {}

    def _cms_write_json(self, filename, data):
        path = self._cms_data_path(filename)
        with open(path, 'w') as f:
            json.dump(data, f, indent=2)

    def _cms_require_auth(self):
        cookie = self.headers.get('Cookie', '')
        if 'cms_session=' not in cookie:
            return False
        session_id = cookie.split('cms_session=')[1].split(';')[0].strip()
        config = self._cms_read_json('cms-config.json')
        sessions = config.get('sessions', {})
        return session_id in sessions

    def _handle_cms_get(self, resource):
        if resource == 'schema':
            data = self._cms_read_json('cms-schema.json', {})
        elif resource == 'content':
            data = self._cms_read_json('cms-content.json', {})
        else:
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        self._json_response(data)

    def _handle_cms_auth_login(self):
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length)) if length else {}
        password = body.get('password', '')
        config = self._cms_read_json('cms-config.json', {})
        if not config.get('password_hash'):
            config['password_hash'] = hashlib.sha256(password.encode()).hexdigest()
            config['sessions'] = {}
            session_id = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
            config['sessions'][session_id] = True
            self._cms_write_json('cms-config.json', config)
            self._json_response({'success': True, 'session': session_id, 'firstTime': True})
            return
        if hashlib.sha256(password.encode()).hexdigest() == config.get('password_hash'):
            session_id = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
            config['sessions'][session_id] = True
            self._cms_write_json('cms-config.json', config)
            self._json_response({'success': True, 'session': session_id})
        else:
            self._json_response({'success': False, 'error': 'Invalid password'}, 401)

    def _handle_cms_auth_check(self):
        is_auth = self._cms_require_auth()
        self._json_response({'authenticated': is_auth})

    def _handle_cms_content_save(self):
        if not self._cms_require_auth():
            self._json_response({'error': 'Unauthorized'}, 401)
            return
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length)) if length else {}
        content = self._cms_read_json('cms-content.json', {})
        if 'pageId' in body and 'blockId' in body and 'field' in body:
            page_id = body['pageId']
            block_id = body['blockId']
            field = body['field']
            value = body['value']
            if page_id not in content:
                content[page_id] = {}
            if 'blocks' not in content[page_id]:
                content[page_id]['blocks'] = {}
            if block_id not in content[page_id]['blocks']:
                content[page_id]['blocks'][block_id] = {}
            content[page_id]['blocks'][block_id][field] = value
            self._cms_write_json('cms-content.json', content)
            self._json_response({'success': True})
            return
        self._json_response({'error': 'Invalid request body'}, 400)

    def _handle_cms_content_bulk_save(self):
        if not self._cms_require_auth():
            self._json_response({'error': 'Unauthorized'}, 401)
            return
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length)) if length else {}
        content = self._cms_read_json('cms-content.json', {})
        for page_id, page_data in body.items():
            if page_id not in content:
                content[page_id] = {}
            if 'blocks' not in content[page_id]:
                content[page_id]['blocks'] = {}
            for block_id, block_data in page_data.get('blocks', {}).items():
                if block_id not in content[page_id]['blocks']:
                    content[page_id]['blocks'][block_id] = {}
                for field, value in block_data.items():
                    content[page_id]['blocks'][block_id][field] = value
        self._cms_write_json('cms-content.json', content)
        self._json_response({'success': True})

    def _handle_cms_media_list(self):
        media_dir = os.path.join(STATIC_DIR, 'media')
        if not os.path.exists(media_dir):
            self._json_response({'media': []})
            return
        files = []
        for f in os.listdir(media_dir):
            if f.startswith('.'): continue
            path = os.path.join(media_dir, f)
            files.append({
                'id': f, 'filename': f,
                'size': os.path.getsize(path),
                'url': '/media/' + f
            })
        self._json_response({'media': files})

    def _handle_cms_media_upload(self):
        if not self._cms_require_auth():
            self._json_response({'error': 'Unauthorized'}, 401)
            return
        content_type = self.headers.get('Content-Type', '')
        if 'multipart/form-data' not in content_type:
            self._json_response({'error': 'Expected multipart form data'}, 400)
            return
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length)
        boundary = content_type.split('boundary=')[1].split(';')[0].strip()
        if boundary.startswith('"') and boundary.endswith('"'):
            boundary = boundary[1:-1]
        boundary_bytes = ('--' + boundary).encode()
        parts = raw.split(boundary_bytes)
        for part in parts:
            if b'Content-Disposition' not in part: continue
            if b'filename=' not in part: continue
            header_end = part.find(b'\r\n\r\n')
            if header_end == -1: continue
            headers_str = part[:header_end].decode('utf-8', errors='replace')
            file_data = part[header_end+4:]
            if file_data.endswith(b'\r\n'):
                file_data = file_data[:-2]
            if file_data.endswith(b'--\r\n'):
                file_data = file_data[:-4]
            if file_data.endswith(b'--'):
                file_data = file_data[:-2]
            filename_match = re.search(r'filename="([^"]*)"', headers_str)
            if not filename_match: continue
            original_filename = filename_match.group(1)
            if not original_filename: continue
            ext = os.path.splitext(original_filename)[1]
            unique_name = str(uuid.uuid4())[:8] + ext
            media_dir = os.path.join(STATIC_DIR, 'media')
            os.makedirs(media_dir, exist_ok=True)
            filepath = os.path.join(media_dir, unique_name)
            with open(filepath, 'wb') as f:
                f.write(file_data)
            self._json_response({
                'success': True,
                'media': {'id': unique_name, 'filename': original_filename, 'url': '/media/' + unique_name}
            })
            return
        self._json_response({'error': 'No file found in upload'}, 400)

    def _handle_cms_media_delete(self):
        if not self._cms_require_auth():
            self._json_response({'error': 'Unauthorized'}, 401)
            return
        media_id = self.path.split('/api/cms/media/')[1]
        media_path = os.path.join(STATIC_DIR, 'media', media_id)
        if '..' in media_id or '/' in media_id:
            self._json_response({'error': 'Invalid media ID'}, 400)
            return
        if os.path.exists(media_path):
            os.remove(media_path)
            self._json_response({'success': True})
        else:
            self._json_response({'error': 'File not found'}, 404)

    def _handle_admin_serve(self):
        admin_path = os.path.join(STATIC_DIR, 'admin.html')
        if os.path.exists(admin_path):
            self.send_response(200)
            self.send_header('Content-Type', 'text/html')
            self.end_headers()
            with open(admin_path, 'rb') as f:
                self.wfile.write(f.read())
        else:
            self.send_error(HTTPStatus.NOT_FOUND, 'Admin dashboard not found. Export with CMS first.')

    def _json_response(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())


if __name__ == "__main__":
    # Force-kill any process on our port before binding
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        sock.bind(("0.0.0.0", PORT))
        sock.close()
    except OSError:
        sock.close()
        os.system("fuser -k " + str(PORT) + "/tcp 2>/dev/null")
        import time
        time.sleep(1)

    print(f"Framework Builder running at http://localhost:{PORT}")
    print(f"API: POST /api/scrape and POST /api/fetch")
    server = http.server.HTTPServer(("0.0.0.0", PORT), FrameworkHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.shutdown()
