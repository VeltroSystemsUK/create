#!/usr/bin/env python3
"""Framework Builder — dev server with Firecrawl scrape API."""
import http.server
import json
import os
import pathlib
import secrets
import subprocess
import urllib.parse
import urllib.request
import re
import hashlib
import uuid
from http import HTTPStatus
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, ValidationError, Field, ConfigDict

PORT = int(os.environ.get("PORT", 8899))
STATIC_DIR = os.path.dirname(os.path.abspath(__file__))

# Maximum request body size accepted (10 MB)
MAX_BODY_BYTES = 10 * 1024 * 1024

# Allowed origins for CORS (localhost only — this is a local dev tool)
ALLOWED_ORIGINS = {
    f"http://localhost:{PORT}",
    f"http://127.0.0.1:{PORT}",
}

# Allowed media upload extensions
ALLOWED_UPLOAD_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}


def _hash_password(password: str, salt: str) -> str:
    """Secure password hashing using PBKDF2-HMAC-SHA256 with 600 000 iterations."""
    return hashlib.pbkdf2_hmac(
        "sha256", password.encode(), salt.encode(), 600_000
    ).hex()


# ─────────────────────────────────────────────────────────────────────────────
# Pydantic Schema Models for AI Generation Validation (Phase 3: Production Readiness)
# ─────────────────────────────────────────────────────────────────────────────

class BrandProfile(BaseModel):
    """Schema for Brand Decoder stage output."""
    model_config = ConfigDict(strict=True)

    industry: str = Field(..., min_length=1, max_length=100)
    valueProposition: str = Field(..., min_length=1, max_length=500)
    targetDemographic: str = Field(..., min_length=1, max_length=200)
    aestheticArchetype: str = Field(..., min_length=1, max_length=100)
    toneKeywords: List[str] = Field(default_factory=list, max_length=10)


class CuratedComponents(BaseModel):
    """Schema for Component Chef stage output."""
    model_config = ConfigDict(strict=True)

    allowedBlocks: List[str] = Field(default_factory=list, max_length=20)
    allowedWidgets: List[str] = Field(default_factory=list, max_length=30)
    allowedFX: List[str] = Field(default_factory=list, max_length=40)


class LayoutBlockProps(BaseModel):
    """Schema for individual block properties in layout."""
    model_config = ConfigDict(extra="allow")

    bg: Optional[str] = None
    text: Optional[str] = None
    image: Optional[str] = None
    height: Optional[int] = None


class LayoutBlock(BaseModel):
    """Schema for individual block in layout."""
    model_config = ConfigDict(strict=True)

    type: str = Field(..., min_length=1, max_length=100)
    props: Dict[str, Any] = Field(default_factory=dict)


class LayoutTemplate(BaseModel):
    """Schema for Layout Architect stage output."""
    model_config = ConfigDict(strict=True)

    name: str = Field(..., min_length=1, max_length=200)
    blocks: List[LayoutBlock] = Field(..., min_length=1, max_length=20)


# ─────────────────────────────────────────────────────────────────────────────
# AI Constraints Management (Phase 4: CI/CD Synchronization)
# ─────────────────────────────────────────────────────────────────────────────

def load_ai_constraints():
    """
    Load AI constraints manifest generated from frontend properties.
    This ensures backend AI generation stays in sync with frontend widget definitions.
    """
    constraints_file = os.path.join(STATIC_DIR, 'artifacts', 'ai-constraints-manifest.json')
    if not os.path.exists(constraints_file):
        print("[Pipeline] WARNING: AI constraints manifest not found. Run: node scripts/generate-ai-constraints.js")
        return None

    try:
        with open(constraints_file, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"[Pipeline] WARNING: Failed to load constraints: {e}")
        return None


def get_constraint_aware_prompt(base_prompt: str, constraints: dict = None) -> str:
    """
    Enhance AI prompt with constraint guidance from frontend properties.
    This keeps AI generation aligned with available widget properties.
    """
    if constraints is None:
        constraints = load_ai_constraints()

    if constraints is None:
        return base_prompt

    # Append constraint guidance to prompt
    guidance = f"\n\nCONSTRAINTS (from frontend):\n{constraints.get('backendPromptTemplate', '')}"
    return base_prompt + guidance


# ─────────────────────────────────────────────────────────────────────────────
# Self-Correcting AI Pipeline with Schema Validation
# ─────────────────────────────────────────────────────────────────────────────

def extract_json_simple(text: str) -> str:
    """Extract JSON from AI response text, stripping markdown and prose."""
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r'^```[a-zA-Z]*\n?', '', text)
        text = re.sub(r'\n?```\s*$', '', text)
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        return text[start:end+1]
    start = text.find("[")
    end = text.rfind("]")
    if start != -1 and end != -1 and end > start:
        return text[start:end+1]
    return text


def execute_pipeline_with_retry(
    call_func,
    prompt: str,
    schema_class,
    max_retries: int = 3,
    initial_temp: float = 1.0,
    min_temp: float = 0.1,
    extract_json_func=None
) -> tuple[Any, bool]:
    """
    Execute AI generation with self-correcting validation loop.

    Args:
        call_func: Function to call for AI generation (takes prompt)
        prompt: Initial prompt for generation
        schema_class: Pydantic schema to validate against
        max_retries: Maximum number of retry attempts
        initial_temp: Starting temperature (unused in v1, for future enhancement)
        min_temp: Minimum temperature for retry (unused in v1, for future enhancement)
        extract_json_func: Optional JSON extraction function

    Returns:
        Tuple of (validated_object, success_bool)
    """
    if extract_json_func is None:
        extract_json_func = extract_json_simple

    last_error = None
    current_prompt = prompt

    for attempt in range(max_retries + 1):
        try:
            # Call AI generation
            raw_output = call_func(current_prompt)

            # Extract JSON from output
            json_str = extract_json_func(raw_output)

            # Try to parse JSON
            data = json.loads(json_str)

            # Validate against schema
            validated = schema_class(**data)

            print(f"[Pipeline] Validation SUCCESS on attempt {attempt + 1}")
            return validated, True

        except ValidationError as e:
            # Schema validation failed
            last_error = f"Validation failed: {str(e)[:200]}"
            print(f"[Pipeline] Attempt {attempt + 1}: Validation error - {last_error}")

            if attempt < max_retries:
                # Add guidance to prompt for retry
                schema_fields = ", ".join(schema_class.__fields__.keys())
                error_hint = f"\n\nIMPORTANT: Output must be valid JSON with exactly these fields: {schema_fields}"
                current_prompt = prompt.rstrip() + error_hint

        except json.JSONDecodeError as e:
            # JSON parsing failed
            last_error = f"JSON parsing failed: {str(e)[:200]}"
            print(f"[Pipeline] Attempt {attempt + 1}: JSON error - {last_error}")

            if attempt < max_retries:
                error_hint = "\n\nIMPORTANT: Output MUST be VALID JSON only, no markdown, no extra text."
                current_prompt = prompt.rstrip() + error_hint

        except Exception as e:
            # Unexpected error
            last_error = f"Unexpected error: {str(e)[:200]}"
            print(f"[Pipeline] Attempt {attempt + 1}: Error - {last_error}")

    # All retries exhausted
    print(f"[Pipeline] All retries exhausted. Last error: {last_error}")
    return None, False


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

    def _cors_origin(self):
        """Return the allowed origin for the requesting client, or None."""
        origin = self.headers.get("Origin", "")
        if origin in ALLOWED_ORIGINS:
            return origin
        # Allow same-host requests that arrive without an Origin header
        return list(ALLOWED_ORIGINS)[0]

    def do_OPTIONS(self):
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header("Access-Control-Allow-Origin", self._cors_origin())
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
        elif parsed.path == "/api/brand-scrape":
            self._handle_brand_scrape()
        elif parsed.path == "/api/ai-import":
            self._handle_ai_import()
        elif parsed.path == "/api/ai-pipeline":
            self._handle_ai_pipeline()
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

    def _extract_palette(self, html, base_url):
        """Fetch linked CSS files and extract brand accent color."""
        css_urls = list(dict.fromkeys(re.findall(r'<link[^>]+href="([^"]+\.css[^"]*?)"', html)))
        if not css_urls:
            return None

        # Resolve relative URLs
        resolved = []
        for u in css_urls[:8]:
            if u.startswith("http"):
                resolved.append(u)
            elif u.startswith("//"):
                resolved.append("https:" + u)
            elif u.startswith("/"):
                p = urllib.parse.urlparse(base_url)
                resolved.append(f"{p.scheme}://{p.netloc}{u}")

        brand_re = re.compile(
            r"--(?:accent|primary|brand|highlight|color-primary|color-accent)[^:\s]*\s*:\s*(#[0-9a-fA-F]{6})",
            re.I,
        )

        def fetch_css(u):
            try:
                req = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0"})
                css = urllib.request.urlopen(req, timeout=5).read(120000).decode("utf-8", errors="ignore")
                return brand_re.findall(css)
            except Exception:
                return []

        with ThreadPoolExecutor(max_workers=4) as ex:
            futures = {ex.submit(fetch_css, u): u for u in resolved}
            try:
                for future in as_completed(futures, timeout=10):
                    colors = future.result(timeout=1)
                    for c in colors:
                        r2, g2, b2 = int(c[1:3], 16), int(c[3:5], 16), int(c[5:7], 16)
                        lum = (0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2) / 255
                        if 0.08 < lum < 0.92:
                            return {"accent": c}
            except Exception:
                pass
        return None

    def _handle_scrape(self):
        body, err = self._read_json_body()
        if err:
            return
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
                html = html_result.stdout.strip()
                response["html"] = html
                palette = self._extract_palette(html, url)
                if palette:
                    response["palette"] = palette

            self._json_response(response)
        except subprocess.TimeoutExpired:
            self._json_response({"error": "Scrape timed out"}, 504)
        except FileNotFoundError:
            self._json_response({"error": "Firecrawl CLI not found"}, 500)
        except Exception as e:
            self._json_response({"error": str(e)}, 500)

    def _handle_fetch(self):
        body, err = self._read_json_body()
        if err:
            return
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

    def _handle_brand_scrape(self):
        """Simple brand context scraper — no external CLI needed."""
        body, err = self._read_json_body()
        if err:
            return
        url = body.get("url", "").strip()
        if not url:
            self._json_response({"error": "Missing 'url' parameter"}, 400)
            return
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                html = resp.read().decode("utf-8", errors="replace")
            # Extract title
            title_m = re.search(r'<title[^>]*>([^<]+)</title>', html, re.IGNORECASE)
            title = title_m.group(1).strip() if title_m else url
            # Extract meta description
            desc_m = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)', html, re.IGNORECASE)
            description = desc_m.group(1) if desc_m else ""
            # Strip HTML tags for body text
            text = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.DOTALL | re.IGNORECASE)
            text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.DOTALL | re.IGNORECASE)
            text = re.sub(r'<[^>]+>', ' ', text)
            text = re.sub(r'\s+', ' ', text).strip()[:4000]
            # Try to extract palette from CSS
            palette = self._extract_palette(html, url)
            self._json_response({"success": True, "title": title, "description": description, "content": text, "palette": palette})
        except Exception as e:
            self._json_response({"error": str(e)}, 500)

    def _handle_ai_import(self):
        body, err = self._read_json_body()
        if err:
            return
        url = body.get("url", "").strip()
        api_key = body.get("apiKey", "").strip()
        provider = body.get("provider", "anthropic")

        if not url or not api_key:
            print("[AI] Missing url or apiKey")
            self._json_response({"error": "Missing 'url' or 'apiKey'"}, 400)
            return

        print(f"[AI] Scraping {url}...")
        scraped = None
        try:
            result = subprocess.run(
                ["firecrawl", "scrape", url, "--only-main-content", "--format", "markdown"],
                capture_output=True, text=True, timeout=60,
            )
            if result.returncode == 0:
                scraped = result.stdout.strip()
        except (subprocess.TimeoutExpired, FileNotFoundError, Exception):
            pass
        
        if not scraped:
            # Fallback: built-in scraper
            print("[AI] Firecrawl unavailable — using built-in scraper")
            try:
                req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, timeout=15) as resp:
                    html = resp.read().decode("utf-8", errors="replace")
                text = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.DOTALL | re.IGNORECASE)
                text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.DOTALL | re.IGNORECASE)
                text = re.sub(r'<[^>]+>', ' ', text)
                text = re.sub(r'\s+', ' ', text).strip()
                scraped = "# " + url + "\n\n" + text[:8000]
            except Exception as e:
                self._json_response({"error": "Scrape failed: " + str(e)[:200]}, 500)
                return
        
        if not scraped:
            self._json_response({"error": "No content scraped"}, 500)
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
        body, err = self._read_json_body()
        if err:
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
        body, err = self._read_json_body()
        if err:
            return

        urls = body.get("urls", [])
        if not urls or not isinstance(urls, list):
            self._json_response({"error": "Missing 'urls' array"}, 400)
            return

        urls = urls[:50]  # hard cap
        print(f"[DeepScrape] Crawling {len(urls)} pages...")

        def scrape_one(url):
            parsed_u = urllib.parse.urlparse(url)
            if parsed_u.scheme not in ("http", "https") or not parsed_u.netloc:
                print(f"[DeepScrape] Skipping invalid URL: {url}")
                return None
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
1. NAV: {"type":"nav","props":{"logoText":"Brand","links":["Link1","Link2"],"ctaText":"CTA","bg":"<site-dark-bg>","textColor":"#fff","accentColor":"<site-accent>"}}
2. HERO: {"type":"hero","props":{"eyebrow":"Tagline","headline":"Title text here","subtext":"Description","ctaText":"Button →","bg":"<site-bg>","textColor":"<contrast-color>","accentColor":"<site-accent>","showBlob":false}}
3. FEATURES: {"type":"features","props":{"label":"Section","headline":"Title","items":[{"icon":"✦","title":"Feature","desc":"Description"}],"bg":"<site-bg>","textColor":"<contrast-color>","accentColor":"<site-accent>"}}
4. TEXTBLOCK: {"type":"textBlock","props":{"headline":"Section title","body":"Full paragraph of text content here. Can be multiple sentences.","bg":"<site-bg>","textColor":"<contrast-color>","paddingV":48,"paddingH":48}}
5. COLORBLOCK: {"type":"colorBlock","props":{"headline":"Title","body":"Short text","bg":"<site-accent>","textColor":"<contrast-color>","paddingV":60,"paddingH":48}}
6. STATS: {"type":"stats","props":{"stats":[{"num":"99%","label":"Metric"}],"bg":"<site-dark-bg>","accentColor":"<site-accent>"}}
7. TESTIMONIAL: {"type":"testimonial","props":{"quote":"Quote text here","attribution":"Name — Role","bg":"<site-dark-bg>","accentColor":"<site-accent>"}}
8. CTA: {"type":"cta","props":{"headline":"Call to action","btnText":"Get started →","bg":"<site-dark-bg>","textColor":"#fff"}}
9. FOOTER: {"type":"footer","props":{"logoText":"Brand","tagline":"Tag","cols":[{"heading":"Links","links":["A","B"]}],"copyright":"© 2026","bg":"<site-dark-bg>","accentColor":"<site-accent>","textColor":"#fff"}}

RULES (critical):
- Output ONLY a valid JSON array. No markdown, no code fences, no commentary.
- Use EXACT field names from the examples above. Use "headline" not "title", "subtext" not "description", "ctaText" not "cta".
- COLORS: Extract the site's actual brand colors from the scraped content. Look for dominant colors, brand accent colors, background colors. Use those real colors — do NOT invent placeholder colors. Replace <site-accent> with the real accent, <site-bg> with the real background, <site-dark-bg> with the darkest usable background color.
- Keep textColor dark (#111) on light backgrounds, light (#fff or #f7f6f2) on dark backgrounds.
- Create a DIVERSE mix of block types. Do NOT use hero for everything.
- Hero: only for the FIRST major section (big heading + subtext + button). Max 1 per page.
- TextBlock: for paragraphs, article content, descriptions, about sections.
- Features: for lists of items, cards, grid layouts, service offerings.
- Stats: for numbers, metrics, counters.
- Testimonial: for quotes, reviews, social proof.
- CTA: for final call-to-action sections.
- ColorBlock: for short highlighted callouts.
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

    def _extract_json_text(self, text):
        """Extract JSON from AI response text, stripping markdown and prose."""
        text = text.strip()
        if text.startswith("```"):
            text = re.sub(r'^```[a-zA-Z]*\n?', '', text)
            text = re.sub(r'\n?```\s*$', '', text)
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1 and end > start:
            return text[start:end+1]
        start = text.find("[")
        end = text.rfind("]")
        if start != -1 and end != -1 and end > start:
            return text[start:end+1]
        return text

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

    def _call_gemini_json(self, api_key, prompt, system_instruction=None, temperature=0.3):
        """Call Gemini with system instruction and return parsed JSON."""
        models = ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"]
        for model in models:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
                headers = {"Content-Type": "application/json"}
                body = {
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"temperature": temperature}
                }
                if system_instruction:
                    body["systemInstruction"] = {"parts": [{"text": system_instruction}]}
                if "pro" in model:
                    body["generationConfig"]["responseMimeType"] = "application/json"
                req = urllib.request.Request(
                    url + "?key=" + urllib.parse.quote(api_key, safe=""),
                    data=json.dumps(body).encode(),
                    headers=headers,
                )
                resp = urllib.request.urlopen(req, timeout=120)
                data = json.loads(resp.read())
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                print(f"[Gemini JSON] Model {model}: success ({len(text)} chars)")
                return json.loads(text)
            except urllib.error.HTTPError as e:
                body_text = e.read().decode() if e.fp else ""
                print(f"[Gemini JSON] Model {model}: HTTP {e.code} - {body_text[:150]}")
                if e.code == 404 or "not found" in body_text.lower():
                    continue
                raise Exception(f"Gemini error ({e.code}): {body_text[:200]}")
            except (KeyError, TypeError, json.JSONDecodeError) as e:
                print(f"[Gemini JSON] Model {model}: parse error - {e}")
                continue
        raise Exception("All Gemini models failed. Check your API key.")

    def _handle_ai_pipeline(self):
        """3-stage AI pipeline: Brand Decoder → Component Chef → Layout Architect."""
        body, err = self._read_json_body()
        if err:
            return
        url = body.get("url", "").strip()
        api_key = body.get("apiKey", "").strip()
        if not url or not api_key:
            self._json_response({"error": "Missing 'url' or 'apiKey'"}, 400)
            return

        try:
            # --- Stage 1: Scrape the brand ---
            print("[Pipeline] Stage 1: Scraping brand...")
            scraped = None
            try:
                result = subprocess.run(["firecrawl", "scrape", url, "--only-main-content", "--format", "markdown"],
                    capture_output=True, text=True, timeout=60)
                if result.returncode == 0: scraped = result.stdout.strip()
            except: pass
            if not scraped:
                try:
                    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
                    with urllib.request.urlopen(req, timeout=15) as resp:
                        html = resp.read().decode("utf-8", errors="replace")
                    text = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.DOTALL | re.IGNORECASE)
                    text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.DOTALL | re.IGNORECASE)
                    text = re.sub(r'<[^>]+>', ' ', text)
                    scraped = re.sub(r'\s+', ' ', text).strip()[:6000]
                except Exception as e:
                    self._json_response({"error": "Scrape failed: " + str(e)[:200]}, 500)
                    return
            if not scraped:
                self._json_response({"error": "No content scraped"}, 500)
                return
            print(f"[Pipeline] Scraped {len(scraped)} chars")

            # --- Stage 2: Brand Decoder with Schema Validation ---
            print("[Pipeline] Stage 2: Decoding brand DNA...")
            brand_prompt = "You are an elite Brand Strategist. Analyze this scraped website data and extract the brand's strategic identity. Output ONLY a JSON object — no markdown, no commentary:\n\nSCRAPED DATA:\n'''" + scraped[:4000] + "'''\n\nJSON format: {\"industry\":\"...\",\"valueProposition\":\"...\",\"targetDemographic\":\"...\",\"aestheticArchetype\":\"...\",\"toneKeywords\":[...]}. Archetype choices: Earthy/Organic, High-Velocity Performance, Precision Engineering, Editorial Luxury, Clinical/Clean-Tech, Corporate Trust, Cyberpunk, Brutalist."

            # Enhance prompt with frontend constraints (Phase 4: CI/CD Sync)
            brand_prompt = get_constraint_aware_prompt(brand_prompt)

            # Use schema validation with self-correcting retry
            brand_profile_obj, success = execute_pipeline_with_retry(
                lambda p: self._call_gemini(api_key, p),
                brand_prompt,
                BrandProfile,
                max_retries=2,
                extract_json_func=self._extract_json_text
            )

            if not success or brand_profile_obj is None:
                self._json_response({"error": "Brand decoding failed after retries"}, 500)
                return

            brand_profile = brand_profile_obj.dict()
            print(f"[Pipeline] Brand: {brand_profile.get('industry', '?')}")

            # --- Stage 3: Component Chef with Schema Validation ---
            print("[Pipeline] Stage 3: Curating component library...")
            all_blocks = "nav,hero,marquee,work,services,stats,testimonial,process,cta,footer,features,pricing,team,videoHero,splitHero,orbsHero,megaNav,slideNav,results,glass,portfolio,clients,trustPill,metric,wordSwap,chat,cookie,liteVideo,faq,splitText,maskReveal,fullscreenMenu,circularList,glitch,svgDraw,dayNight,particleBtn,noise,scrollIndicator,timeline"
            all_widgets = "heading,divider,spacer,icon,html,shortcode,blockquote,textPath,image,button,video,iconBox,iconList,socialIcons,imageGallery,soundCloud,row,tabs,accordion,toggle,priceTable,priceList,flipBox,cta,footerWidget,container,twmWorkspace,counter,countdown,animatedHeadline,hotspot,progressTracker,alert,gallery,portfolio,slides,googleMaps,codeBlock,shareButtons,videoPlaylist,lottie,motionBlock,htmlEmbed"
            all_veltro = "kineticText,textScramble,typewriterReveal,textMask,morphingCounter,liquidText,imagePhysics,magneticCursor,particleTrail,cursorRipple,stickyScrollStack,scrollVelocitySkew,parallaxImageStack,mosaicAssemble,scrollProgressRing,magneticScroll,morphBlob,noiseGrain,gradientFlow,sectionBackground,glassmorphismStack,tiltCard3d,glitchSection,audioVisualizer,depthOfField,holographicCard,soundReactive,mirrorReflection,constellationLines,geometryDraw,waveText,morphingText,kineticScramble,carousel3d,perspectiveRooms,floatingIslands,layeredParallax,kineticLayout,morphingGrid,spatialNavigation,cursorLens,shaderBg,infiniteCanvas,parallaxDepth,horizontalScrollGallery,velocitySkew,scrollFluid,velocityFluidBg,gravityWells,clothSimulation,magneticFields,pendulumWave,collisionChaos,blackHole,multiShapeTrail,magneticText,cursorDistortion,colorSampler,gravityCursor,auroraBorealis,geometricPatterns,liquidGradient,holographicOverlay,lightLeaks"

            curated_prompt = "You are a Systems Component Filter. Given this Brand Profile, select only the components that perfectly match the aesthetic:\n\nBRAND: " + json.dumps(brand_profile) + "\n\nFILTER these libraries and output ONLY JSON:\nBuilt-in Blocks: " + all_blocks + "\nContent Widgets: " + all_widgets + "\nVeltro FX: " + all_veltro + "\n\nJSON format: {\"allowedBlocks\":[\"nav\",...],\"allowedWidgets\":[\"heading\",...],\"allowedFX\":[\"kineticText\",...]}. Pick 8-12 per category. Only include items from the provided lists. Return ONLY valid JSON."

            # Enhance prompt with frontend constraints (Phase 4: CI/CD Sync)
            curated_prompt = get_constraint_aware_prompt(curated_prompt)

            # Use schema validation with self-correcting retry
            curated_obj, success = execute_pipeline_with_retry(
                lambda p: self._call_gemini(api_key, p),
                curated_prompt,
                CuratedComponents,
                max_retries=2,
                extract_json_func=self._extract_json_text
            )

            if not success or curated_obj is None:
                self._json_response({"error": "Component curation failed after retries"}, 500)
                return

            curated = curated_obj.dict()
            print(f"[Pipeline] Curated: {len(curated.get('allowedBlocks',[]))} blocks, {len(curated.get('allowedFX',[]))} fx")

            # --- Stage 4: Layout Architect with Schema Validation ---
            print("[Pipeline] Stage 4: Generating creative layout...")
            blocks_list = ", ".join(curated.get("allowedBlocks", []))
            widgets_list = ", ".join(curated.get("allowedWidgets", []))
            veltro_list = ", ".join(curated.get("allowedFX", []))

            layout_prompt = "You are an Award-Winning Creative Director. Architect a website template using ONLY these allowed components:\n\nBLOCKS: " + blocks_list + "\nWIDGETS: " + widgets_list + "\nVELTRO FX: " + veltro_list + "\n\nBRAND: " + json.dumps(brand_profile) + "\n\nGenerate 8-14 blocks. 50%+ must be widget/Veltro types. Return ONLY valid JSON:\n{\"name\":\"Site Name\",\"blocks\":[{\"type\":\"widgetType\",\"props\":{...}},...]}"

            # Enhance prompt with frontend constraints (Phase 4: CI/CD Sync)
            layout_prompt = get_constraint_aware_prompt(layout_prompt)

            # Use schema validation with self-correcting retry
            template_obj, success = execute_pipeline_with_retry(
                lambda p: self._call_gemini(api_key, p),
                layout_prompt,
                LayoutTemplate,
                max_retries=2,
                extract_json_func=self._extract_json_text
            )

            if not success or template_obj is None:
                self._json_response({"error": "Layout generation failed after retries"}, 500)
                return

            template = template_obj.dict()

            site = url.replace("https://","").replace("http://","").replace("www.","").split("/")[0]
            self._json_response({"success":True,"template":template,"brand":brand_profile,"siteName":site})
        except Exception as e:
            print(f"[Pipeline] Error: {e}")
            self._json_response({"error": str(e)}, 500)
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
        return bool(slug and 2 <= len(slug) <= 100 and re.fullmatch(r'[a-z0-9-]+', slug))

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
        body, err = self._read_json_body()
        if err:
            return
        if not isinstance(body, dict):
            self._json_response({'error': 'Invalid design data'}, 400)
            return
        if 'blocks' not in body or not isinstance(body.get('blocks'), list):
            self._json_response({'error': 'Design must contain a blocks array'}, 400)
            return
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
        body, err = self._read_json_body()
        if err:
            return
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
        body, err = self._read_json_body()
        if err:
            return
        password = body.get('password', '')
        if not password:
            self._json_response({'success': False, 'error': 'Password required'}, 400)
            return
        config = self._cms_read_json('cms-config.json', {})

        # ── First login: no password stored yet ──────────────────────────────
        if not config.get('password_hash_v2') and not config.get('password_hash'):
            salt = secrets.token_hex(32)
            config['password_hash_v2'] = _hash_password(password, salt)
            config['password_salt'] = salt
            config.pop('password_hash', None)   # remove any stale SHA-256 hash
            config['sessions'] = {}
            session_id = secrets.token_urlsafe(32)
            config['sessions'][session_id] = True
            self._cms_write_json('cms-config.json', config)
            self._json_response({'success': True, 'session': session_id, 'firstTime': True})
            return

        # ── Subsequent logins ─────────────────────────────────────────────────
        authenticated = False
        if config.get('password_hash_v2'):
            # New secure PBKDF2 path
            authenticated = secrets.compare_digest(
                _hash_password(password, config.get('password_salt', '')),
                config['password_hash_v2'],
            )
        elif config.get('password_hash'):
            # Legacy SHA-256 path — migrate to v2 on successful login
            legacy_hash = hashlib.sha256(password.encode()).hexdigest()
            if secrets.compare_digest(legacy_hash, config['password_hash']):
                authenticated = True
                salt = secrets.token_hex(32)
                config['password_hash_v2'] = _hash_password(password, salt)
                config['password_salt'] = salt
                config.pop('password_hash', None)

        if authenticated:
            if 'sessions' not in config:
                config['sessions'] = {}
            session_id = secrets.token_urlsafe(32)
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
        body, err = self._read_json_body()
        if err:
            return
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
        body, err = self._read_json_body()
        if err:
            return
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
        raw_length = self.headers.get("Content-Length", "0")
        try:
            length = int(raw_length)
        except ValueError:
            self._json_response({'error': 'Invalid Content-Length'}, 400)
            return
        if length > MAX_BODY_BYTES:
            self._json_response({'error': 'Upload too large (max 10 MB)'}, 413)
            return
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
            ext = os.path.splitext(original_filename)[1].lower()
            if ext not in ALLOWED_UPLOAD_EXTENSIONS:
                self._json_response(
                    {'error': f'File type "{ext}" not allowed. Allowed: {", ".join(sorted(ALLOWED_UPLOAD_EXTENSIONS))}'},
                    400,
                )
                return
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
        media_id = urllib.parse.unquote(self.path.split('/api/cms/media/')[1])
        media_root = pathlib.Path(STATIC_DIR, 'media').resolve()
        media_path = (media_root / media_id).resolve()
        # Ensure the resolved path is still inside the media directory
        if media_root not in media_path.parents and media_path != media_root:
            self._json_response({'error': 'Invalid media ID'}, 400)
            return
        if media_path.exists() and media_path.is_file():
            media_path.unlink()
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

    def _read_json_body(self):
        """Read the request body (up to MAX_BODY_BYTES) and parse as JSON.

        Returns (parsed_dict_or_list, error_response_or_None).
        If error_response is not None the caller must return immediately —
        the error has already been sent to the client.
        """
        raw_length = self.headers.get("Content-Length", "0")
        try:
            length = int(raw_length)
        except ValueError:
            self._json_response({"error": "Invalid Content-Length"}, 400)
            return None, True
        if length > MAX_BODY_BYTES:
            self._json_response({"error": "Request body too large"}, 413)
            return None, True
        if length == 0:
            return {}, None
        try:
            body = json.loads(self.rfile.read(length))
        except (json.JSONDecodeError, ValueError) as exc:
            self._json_response({"error": f"Invalid JSON: {exc}"}, 400)
            return None, True
        return body, None

    def _json_response(self, data, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", self._cors_origin())
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())


if __name__ == "__main__":
    # Allow socket reuse to handle TIME_WAIT state on Windows
    import socket
    import time

    # Test if port is available
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        sock.bind(("0.0.0.0", PORT))
        sock.close()
    except OSError as e:
        sock.close()
        print(f"Warning: Port {PORT} still in use, waiting for cleanup...")
        time.sleep(3)
        # Try again with a clean socket
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            sock.bind(("0.0.0.0", PORT))
            sock.close()
        except OSError:
            print(f"Error: Cannot bind to port {PORT}. It may still be in use.")
            print("Please close other applications using this port.")
            exit(1)

    print(f"Framework Builder running at http://localhost:{PORT}")
    print(f"API: POST /api/scrape and POST /api/fetch")
    server = http.server.HTTPServer(("0.0.0.0", PORT), FrameworkHandler)
    server.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.shutdown()
