"""
Veltro Create — CMS Backend Server

Serves the builder frontend and provides a file-based CMS API
with session-based authentication. All content stored as JSON files.

Run: python server.py [--port PORT] [--dev]

Design decisions (from .superpowers/brainstorm):
  - Single codebase, one port, one deployment
  - File-based JSON storage (no database)
  - Session-based auth (no user database)
  - Inline editing + admin dashboard
  - RESTful CRUD API for pages, blocks, and media
"""

import hashlib
import json
import os
import secrets
import time
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory, session

# ── CORS Helper ─────────────────────────────────────────────────────
def add_cors_headers(response):
    """Add CORS headers to allow cross-origin requests"""
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

# ── Config ──────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
CMS_DIR = BASE_DIR / ".cms"
DESIGNS_DIR = BASE_DIR / "designs"
MEDIA_DIR = BASE_DIR / "media"
BUILD_DIR = BASE_DIR / "dist"
CONFIG_PATH = CMS_DIR / "cms-config.json"
SESSIONS_PATH = CMS_DIR / "cms-sessions.json"
CONTENT_PATH = CMS_DIR / "cms-content.json"
SCHEMA_PATH = CMS_DIR / "cms-schema.json"

SESSION_DURATION = 60 * 60 * 24  # 24 hours

app = Flask(__name__, static_folder=None)
app.secret_key = secrets.token_hex(32)

# Register CORS handler for all responses
@app.after_request
def after_request(response):
    return add_cors_headers(response)

# Handle OPTIONS requests (preflight)
@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        return add_cors_headers(response)


# ── Helpers ─────────────────────────────────────────────────────────


def _load_json(path, default=None):
    """Load a JSON file, returning default if missing or malformed."""
    try:
        with open(path) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return default if default is not None else {}


def _save_json(path, data):
    """Atomically save data to a JSON file."""
    tmp = str(path) + ".tmp"
    with open(tmp, "w") as f:
        json.dump(data, f, indent=2)
    os.replace(tmp, path)


def _hash_password(password, salt=None):
    """SHA256(password + salt). If no salt given, generates a new one.
    Returns (hash_hex, salt_hex)."""
    if salt is None:
        salt = secrets.token_hex(16)
    salted = password.encode() + bytes.fromhex(salt)
    return hashlib.sha256(salted).hexdigest(), salt


def _verify_password(password, config):
    """Check password against the stored hash+salt in config."""
    pw_hash = config.get("password_hash", "")
    pw_salt = config.get("password_salt", "")
    if not pw_hash or not pw_salt:
        return False
    computed, _ = _hash_password(password, pw_salt)
    return computed == pw_hash


def _load_sessions():
    """Load session store, cleaning expired entries."""
    sessions = _load_json(SESSIONS_PATH, {})
    now = time.time()
    expired = [
        k
        for k, v in sessions.items()
        if isinstance(v, dict) and v.get("expires", 0) < now
    ]
    if expired:
        for k in expired:
            del sessions[k]
        _save_json(SESSIONS_PATH, sessions)
    return sessions


def _require_auth():
    """Check the session for a valid login token. Return None if OK, or error response."""
    token = session.get("cms_token")
    if not token:
        return jsonify({"error": "Unauthorized"}), 401
    sessions = _load_sessions()
    if token not in sessions:
        return jsonify({"error": "Session expired"}), 401
    return None


# ── Auth endpoints ──────────────────────────────────────────────────


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    password = data.get("password", "")
    config = _load_json(CONFIG_PATH)

    if not _verify_password(password, config):
        return jsonify({"error": "Invalid password"}), 401

    token = secrets.token_hex(32)
    sessions = _load_sessions()
    sessions[token] = {
        "created": datetime.now(timezone.utc).isoformat(),
        "expires": time.time() + SESSION_DURATION,
    }
    _save_json(SESSIONS_PATH, sessions)
    session["cms_token"] = token
    return jsonify({"ok": True, "token": token})


@app.route("/api/logout", methods=["POST"])
def logout():
    token = session.get("cms_token")
    if token:
        sessions = _load_sessions()
        sessions.pop(token, None)
        _save_json(SESSIONS_PATH, sessions)
        session.pop("cms_token", None)
    return jsonify({"ok": True})


@app.route("/api/session", methods=["GET"])
def check_session():
    auth_err = _require_auth()
    if auth_err:
        return auth_err
    return jsonify({"authenticated": True})


@app.route("/api/password", methods=["PUT"])
def change_password():
    """Change the CMS password. Requires current password."""
    auth_err = _require_auth()
    if auth_err:
        return auth_err
    data = request.get_json(silent=True) or {}
    current = data.get("current", "")
    new = data.get("new", "")

    config = _load_json(CONFIG_PATH)
    if not _verify_password(current, config):
        return jsonify({"error": "Current password is incorrect"}), 403
    if len(new) < 4:
        return jsonify({"error": "Password must be at least 4 characters"}), 400

    pw_hash, pw_salt = _hash_password(new)
    config["password_hash"] = pw_hash
    config["password_salt"] = pw_salt
    _save_json(CONFIG_PATH, config)
    return jsonify({"ok": True})


# ── Pages & blocks ──────────────────────────────────────────────────


def _get_content():
    """Return the content dict from disk, falling back to designs/."""
    content = _load_json(CONTENT_PATH)
    if content:
        return content
    # Bootstrap: read from legacy designs/my-project.json
    content = _load_json(DESIGNS_DIR / "my-project.json", {})
    if content:
        _save_json(CONTENT_PATH, content)
    return content


@app.route("/api/pages", methods=["GET"])
def list_pages():
    auth_err = _require_auth()
    if auth_err:
        return auth_err
    content = _get_content()
    pages = content.get("pages", [])
    return jsonify(
        [
            {
                "id": p["id"],
                "name": p["name"],
                "slug": p.get("slug", ""),
                "blockCount": len(p.get("blocks", [])),
            }
            for p in pages
        ]
    )


@app.route("/api/pages/<page_id>", methods=["GET"])
def get_page(page_id):
    auth_err = _require_auth()
    if auth_err:
        return auth_err
    content = _get_content()
    page = next((p for p in content.get("pages", []) if p["id"] == page_id), None)
    if not page:
        return jsonify({"error": "Not found"}), 404
    return jsonify(page)


@app.route("/api/pages/<page_id>", methods=["PUT"])
def update_page(page_id):
    auth_err = _require_auth()
    if auth_err:
        return auth_err
    content = _get_content()
    page = next((p for p in content.get("pages", []) if p["id"] == page_id), None)
    if not page:
        return jsonify({"error": "Not found"}), 404

    data = request.get_json(silent=True) or {}
    for key in ("name", "slug"):
        if key in data:
            page[key] = data[key]
    _save_json(CONTENT_PATH, content)
    return jsonify(page)


@app.route("/api/pages/<page_id>/blocks/<block_id>", methods=["PUT"])
def update_block(page_id, block_id):
    auth_err = _require_auth()
    if auth_err:
        return auth_err
    content = _get_content()
    page = next((p for p in content.get("pages", []) if p["id"] == page_id), None)
    if not page:
        return jsonify({"error": "Page not found"}), 404
    block = next((b for b in page.get("blocks", []) if b["id"] == block_id), None)
    if not block:
        return jsonify({"error": "Block not found"}), 404

    data = request.get_json(silent=True) or {}
    if "props" in data:
        block["props"].update(data["props"])
    _save_json(CONTENT_PATH, content)
    return jsonify(block)


# ── Media ───────────────────────────────────────────────────────────


@app.route("/api/media", methods=["GET"])
def list_media():
    auth_err = _require_auth()
    if auth_err:
        return auth_err
    meta = _load_json(MEDIA_DIR / "media-meta.json", {})
    files = []
    for fname, info in meta.get("files", {}).items():
        size = 0
        fpath = MEDIA_DIR / fname
        if fpath.exists():
            size = fpath.stat().st_size
        files.append(
            {
                "name": fname,
                "originalName": info.get("originalName", fname),
                "size": size,
                "addedAt": info.get("addedAt", ""),
            }
        )
    return jsonify(files)


@app.route("/api/media", methods=["POST"])
def upload_media():
    auth_err = _require_auth()
    if auth_err:
        return auth_err
    if "file" not in request.files:
        return jsonify({"error": "No file"}), 400

    f = request.files["file"]
    if not f.filename:
        return jsonify({"error": "No filename"}), 400

    ext = Path(f.filename).suffix.lower()
    safe_name = secrets.token_hex(12) + ext
    f.save(str(MEDIA_DIR / safe_name))

    meta = _load_json(MEDIA_DIR / "media-meta.json", {"files": {}, "folders": []})
    meta["files"][safe_name] = {
        "originalName": f.filename,
        "folder": None,
        "tags": [],
        "addedAt": datetime.now(timezone.utc).isoformat(),
    }
    _save_json(MEDIA_DIR / "media-meta.json", meta)

    return jsonify({"name": safe_name, "originalName": f.filename}), 201


@app.route("/api/media/<name>", methods=["DELETE"])
def delete_media(name):
    auth_err = _require_auth()
    if auth_err:
        return auth_err
    meta = _load_json(MEDIA_DIR / "media-meta.json", {})
    if name not in meta.get("files", {}):
        return jsonify({"error": "Not found"}), 404
    del meta["files"][name]
    _save_json(MEDIA_DIR / "media-meta.json", meta)
    fpath = MEDIA_DIR / name
    if fpath.exists():
        fpath.unlink()
    return jsonify({"ok": True})


# ── Designs (Design Studio CRUD) ────────────────────────────────────
@app.route("/api/designs", methods=["GET"])
def list_designs():
    designs = []
    if DESIGNS_DIR.exists():
        for path in DESIGNS_DIR.glob("*.json"):
            if path.name == "my-project.json":
                continue
            data = _load_json(path)
            if isinstance(data, dict):
                designs.append({
                    "slug": path.stem,
                    "name": data.get("name", path.stem),
                    "width": data.get("width", 800),
                    "height": data.get("height", 600),
                    "thumbnail": data.get("thumbnail", "")
                })
    return jsonify(designs)


@app.route("/api/designs/<slug>", methods=["GET"])
def get_design(slug):
    path = DESIGNS_DIR / f"{slug}.json"
    if not path.is_file():
        return jsonify({"error": "Design not found"}), 404
    data = _load_json(path)
    return jsonify(data)


@app.route("/api/designs", methods=["POST"])
def save_design():
    data = request.get_json(silent=True) or {}
    name = data.get("name", "Untitled")
    import re
    slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
    if not slug:
        slug = "untitled"
    orig_slug = slug
    counter = 1
    while (DESIGNS_DIR / f"{slug}.json").exists():
        slug = f"{orig_slug}-{counter}"
        counter += 1
    
    path = DESIGNS_DIR / f"{slug}.json"
    _save_json(path, data)
    return jsonify({"ok": True, "slug": slug})


# ── AI Generative SVG/Raster Image ──────────────────────────────────
@app.route("/api/ai-image", methods=["POST"])
def ai_image():
    data = request.get_json(silent=True) or {}
    prompt = data.get("prompt", "").strip().lower()
    
    if "star" in prompt:
        shapes_svg = """
        <polygon points="200,50 240,150 340,150 260,220 290,320 200,260 110,320 140,220 60,150 160,150" fill="#CDFE00" stroke="#ffffff" stroke-width="4"/>
        <circle cx="200" cy="200" r="40" fill="#111111" />
        <polygon points="200,100 220,170 290,170 230,210 250,280 200,240 150,280 170,210 110,170 180,170" fill="#7C3AED" />
        """
        title = "Star Vector"
    elif "logo" in prompt or "brand" in prompt or "icon" in prompt:
        shapes_svg = """
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#7C3AED;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#CDFE00;stop-opacity:1" />
            </linearGradient>
        </defs>
        <path d="M150,150 C200,100 300,100 300,200 C300,300 200,300 150,250 Z" fill="url(#grad1)" opacity="0.85"/>
        <path d="M250,250 C200,300 100,300 100,200 C100,100 200,100 250,150 Z" fill="#ffffff" opacity="0.6"/>
        <circle cx="200" cy="200" r="30" fill="#111111"/>
        """
        title = "Brand Vector Logo"
    elif "flower" in prompt or "nature" in prompt:
        shapes_svg = """
        <g fill="#f43f5e" stroke="#ffffff" stroke-width="2">
            <ellipse cx="200" cy="140" rx="30" ry="50" transform="rotate(0 200 200)" />
            <ellipse cx="200" cy="140" rx="30" ry="50" transform="rotate(45 200 200)" />
            <ellipse cx="200" cy="140" rx="30" ry="50" transform="rotate(90 200 200)" />
            <ellipse cx="200" cy="140" rx="30" ry="50" transform="rotate(135 200 200)" />
            <ellipse cx="200" cy="140" rx="30" ry="50" transform="rotate(180 200 200)" />
            <ellipse cx="200" cy="140" rx="30" ry="50" transform="rotate(225 200 200)" />
            <ellipse cx="200" cy="140" rx="30" ry="50" transform="rotate(270 200 200)" />
            <ellipse cx="200" cy="140" rx="30" ry="50" transform="rotate(315 200 200)" />
        </g>
        <circle cx="200" cy="200" r="35" fill="#CDFE00" stroke="#ffffff" stroke-width="3" />
        """
        title = "Nature Vector Flower"
    else:
        shapes_svg = """
        <defs>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect x="80" y="80" width="240" height="240" rx="20" fill="url(#grad2)" opacity="0.8"/>
        <circle cx="200" cy="200" r="80" fill="#7C3AED" opacity="0.9" />
        <polygon points="200,150 250,230 150,230" fill="#CDFE00" />
        <line x1="80" y1="80" x2="320" y2="320" stroke="#ffffff" stroke-width="4" stroke-dasharray="10,10"/>
        """
        title = "Abstract Vector Composition"

    svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <rect width="400" height="400" fill="transparent"/>
        <g id="ai-vector-group">
            {shapes_svg}
            <text x="200" y="380" font-family="Lexend, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">{title}</text>
        </g>
    </svg>"""

    return jsonify({
        "svg": svg_content,
        "url": "data:image/svg+xml;utf8," + svg_content.replace("#", "%23").replace("\\n", "").replace("  ", "")
    })


# ── Schema ──────────────────────────────────────────────────────────


@app.route("/api/schema", methods=["GET"])
def get_schema():
    auth_err = _require_auth()
    if auth_err:
        return auth_err
    schema = _load_json(SCHEMA_PATH, {})
    return jsonify(schema)


# ── Static files (production: serve dist/) ───────────────────────────


@app.route("/")
@app.route("/<path:filename>")
def serve_static(filename="framework-builder.html"):
    # Sanitize path
    safe = filename.lstrip("/")
    if safe == "":
        safe = "framework-builder.html"

    # 1. Try dist folder (built assets)
    fpath = BUILD_DIR / safe
    if fpath.is_file():
        return send_from_directory(BUILD_DIR, safe)

    # 2. Try root folder (source assets, widgets, js)
    rpath = BASE_DIR / safe
    if rpath.is_file():
        return send_from_directory(BASE_DIR, safe)

    # 3. Fallback: look for the file directly in dist/
    if (BUILD_DIR / (safe + ".html")).is_file():
        return send_from_directory(BUILD_DIR, safe + ".html")

    return jsonify({"error": "Not found"}), 404


@app.route("/media/<filename>")
def serve_media(filename):
    fpath = MEDIA_DIR / filename
    if fpath.is_file():
        return send_from_directory(MEDIA_DIR, filename)
    # Also serve the animator's index as "/animator"
    if filename == "":
        return send_from_directory(MEDIA_DIR.parent / "animator", "index.html")
    return jsonify({"error": "Not found"}), 404


@app.route("/animator/")
@app.route("/animator/<path:filename>")
def serve_animator(filename="index.html"):
    anim_dir = BASE_DIR / "animator"
    fpath = anim_dir / filename
    if fpath.is_file():
        return send_from_directory(anim_dir, filename)
    return jsonify({"error": "Not found"}), 404


# ── Entry point ─────────────────────────────────────────────────────

# ── Pop Art Generator API Proxy ────────────────────────────────────
@app.route("/api/popart/generate", methods=["POST", "OPTIONS"])
def popart_generate():
    """Proxy Claude API calls for Pop Art Generator (handles CORS)"""
    import urllib.request
    import urllib.error
    import sys

    # Handle OPTIONS preflight
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        return add_cors_headers(response)

    try:
        print("[POPART] Request received", file=sys.stderr)

        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            print("[POPART] ERROR: API key not configured", file=sys.stderr)
            return jsonify({"error": "API key not configured"}), 500

        print(f"[POPART] API key set: {api_key[:20]}...", file=sys.stderr)

        data = request.json
        if not data:
            print("[POPART] ERROR: No JSON body provided", file=sys.stderr)
            return jsonify({"error": "No JSON body provided"}), 400

        prompt = data.get("prompt", "")
        system = data.get("system", "")

        print(f"[POPART] Prompt length: {len(prompt)}, System length: {len(system)}", file=sys.stderr)

        if not prompt:
            print("[POPART] ERROR: prompt field is required", file=sys.stderr)
            return jsonify({"error": "prompt field is required"}), 400

        # Prepare the API request
        url = "https://api.anthropic.com/v1/messages"
        headers = {
            "Content-Type": "application/json",
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
        }

        body_dict = {
            "model": "claude-opus-4-8",
            "max_tokens": 2000,
            "system": system,
            "messages": [{"role": "user", "content": prompt}]
        }

        body = json.dumps(body_dict)
        print(f"[POPART] Body length: {len(body)}", file=sys.stderr)

        req = urllib.request.Request(
            url, data=body.encode(), headers=headers, method="POST"
        )

        print("[POPART] Calling Anthropic API...", file=sys.stderr)
        with urllib.request.urlopen(req) as response:
            response_body = response.read()
            print(f"[POPART] Raw response size: {len(response_body)} bytes", file=sys.stderr)
            result = json.loads(response_body)
            print(f"[POPART] Parsed result keys: {list(result.keys())}", file=sys.stderr)
            json_response = jsonify(result)
            print(f"[POPART] About to return response...", file=sys.stderr)
            return json_response

    except urllib.error.HTTPError as e:
        print(f"[POPART] HTTPError: {e.code} {e.reason}", file=sys.stderr)
        try:
            error_data = json.loads(e.read().decode())
            return jsonify(error_data), e.code
        except:
            return jsonify({"error": f"HTTP {e.code}: {e.reason}"}), e.code
    except Exception as e:
        import traceback
        print(f"[POPART] Exception: {e}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        return jsonify({"error": f"Internal error: {str(e)}"}), 500


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Veltro Create CMS Server")
    parser.add_argument(
        "--port", type=int, default=3003, help="Server port (default: 3003)"
    )
    parser.add_argument(
        "--dev", action="store_true", help="Development mode (debug, auto-reload)"
    )
    args = parser.parse_args()

    # Ensure required directories exist
    CMS_DIR.mkdir(exist_ok=True)
    DESIGNS_DIR.mkdir(exist_ok=True)
    MEDIA_DIR.mkdir(exist_ok=True)

    # Configure Flask for better performance with large files
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 31536000  # 1 year cache
    app.config['JSON_SORT_KEYS'] = False

    # Bootstrap config if missing
    if not CONFIG_PATH.exists():
        pw_hash, pw_salt = _hash_password("admin")
        print(f"Bootstrapping {CONFIG_PATH} — default password: admin")
        _save_json(
            CONFIG_PATH,
            {
                "password_hash": pw_hash,
                "password_salt": pw_salt,
            },
        )
    # Bootstrap empty session store if missing
    if not SESSIONS_PATH.exists():
        _save_json(SESSIONS_PATH, {})

    # Bootstrap schema if missing
    if not SCHEMA_PATH.exists():
        _save_json(
            SCHEMA_PATH,
            {
                "blockTypes": {
                    "nav": {"editable": ["logoText", "links", "ctaText"]},
                    "hero": {"editable": ["eyebrow", "headline", "subtext", "ctaText"]},
                    "marquee": {"editable": ["items"]},
                    "work": {"editable": ["label", "headline", "cards"]},
                    "services": {"editable": ["items"]},
                    "stats": {"editable": ["stats"]},
                    "testimonial": {"editable": ["quote", "author", "role"]},
                    "process": {"editable": ["steps"]},
                    "cta": {"editable": ["headline", "subtext", "ctaText"]},
                    "footer": {"editable": ["tagline", "legalText"]},
                }
            },
        )

    print(f"Veltro Create CMS")
    print(f"  Server:  http://localhost:{args.port}")
    print(f"  API:     http://localhost:{args.port}/api/")
    print(f"  Builder: http://localhost:{args.port}/")
    print(f"  Studio:  http://localhost:{args.port}/animator/")
    print(f"  Dev:     {'yes' if args.dev else 'no'}")
    print()

    # Run with explicit server configuration for better file serving
    # Use WSGIRequestHandler from werkzeug for more control
    from werkzeug.serving import WSGIRequestHandler
    WSGIRequestHandler.protocol_version = "HTTP/1.1"

    app.run(
        host="0.0.0.0",
        port=args.port,
        debug=args.dev,
        threaded=True,
        use_reloader=args.dev
    )
