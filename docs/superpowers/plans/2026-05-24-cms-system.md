# CMS System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a content management system to Framework Builder that ships with exported sites, letting clients edit text/images on their live site via inline editing or an admin dashboard.

**Architecture:** The CMS is fully self-contained within the exported site. Schema generation happens at export time (auto-detecting editable props from blocks). A CMS server extends server.py with REST endpoints. The admin dashboard is a standalone HTML/JS SPA at `/admin`. Inline editing is a JS library injected into the live site on `?edit` mode.

**Tech Stack:** Python (server.py), vanilla JS (no frameworks), JSON file storage

---

### Task 1: Schema Generation Utility

**Files:**

- Create: `js/cms-schema.js`

This utility scans the current site's blocks and pages to generate `cms-schema.json`. It uses naming heuristics and value-type checks to determine which props are editable content vs locked design.

- [ ] **Step 1: Create the schema generation module**

```js
// js/cms-schema.js
// Auto-detects editable content fields from block definitions.
// Called during export to generate cms-schema.json.

FB.cms = FB.cms || {};

// Props that are always treated as content (editable)
FB.cms.CONTENT_PROPS = new Set([
  "headline",
  "title",
  "text",
  "subtext",
  "body",
  "description",
  "caption",
  "quote",
  "eyebrow",
  "name",
  "label",
  "btnText",
  "ctaText",
  "message",
  "greeting",
  "placeholder",
  "btnText",
  "acceptText",
  "declineText",
  "emptyText",
  "checkoutBtnText",
  "triggerText",
  "variant",
  "heading",
  "tagline",
  "brandName",
  "logoText",
  "suffix",
  "prefix",
  "dayText",
  "nightText",
  "resultsText",
  "ratingText",
  "verifiedDate",
]);

// Props that are always treated as design (locked)
FB.cms.DESIGN_PROPS = new Set([
  "bg",
  "textColor",
  "accentColor",
  "saleColor",
  "starColor",
  "paddingV",
  "paddingH",
  "gap",
  "columns",
  "imageHeight",
  "imageFit",
  "imageRadius",
  "imagePosition",
  "textAlign",
  "menuStyle",
  "blobStyle",
  "showBlob",
  "showPriceRange",
  "showGridToggle",
  "overlayOpacity",
  "taxRate",
  "modalBg",
  "speed",
  "targetDate",
  "currentAmount",
  "threshold",
  "rating",
  "reviewCount",
  "ratingCount",
  "cardsVisible",
  "imagePosition",
  "imageFit",
  "imageRadius",
  "imageHeight",
]);

// Check if a value looks like editable content
FB.cms._isContentValue = function (val) {
  if (typeof val === "string" && val.length > 0 && val.length < 2000) {
    // URLs are content when they're image/video sources
    if (
      val.startsWith("http") &&
      /\.(jpg|png|gif|webp|svg|mp4|webm)/i.test(val)
    )
      return true;
    // Plain text is content
    if (!val.startsWith("#")) return true; // not a hex color
    return false;
  }
  return false;
};

// Generate the full content schema from current state
FB.cms.generateSchema = function () {
  var schema = { pages: [] };

  FB.state.pages.forEach(function (page) {
    var pageSchema = {
      pageId: page.id,
      name: page.name,
      slug: page.slug,
      blocks: [],
    };

    // We need the blocks for this page. During export, FB.state.blocks
    // already holds the current page's blocks. For multi-page export,
    // the caller should switch pages and call this per-page.
    var blocks =
      page.id === FB.state.currentPageId ? FB.state.blocks : page.blocks;

    blocks.forEach(function (block) {
      var blockSchema = {
        blockId: block.id,
        type: block.type,
        fields: {},
      };

      var def =
        FB.blocks.BLOCK_DEFS[block.type] ||
        FB.blocks.CUSTOM_BLOCK_DEFS[block.type] ||
        FB.blocks.ECOMMERCE_DEFS[block.type];

      if (!def) return; // unknown block type, skip

      Object.keys(def.defaultProps).forEach(function (propName) {
        var isContent = FB.cms.CONTENT_PROPS.has(propName);
        var isDesign = FB.cms.DESIGN_PROPS.has(propName);
        var val = block.props[propName];
        var valType = Array.isArray(val)
          ? "array"
          : val === null
            ? "null"
            : typeof val;

        var editable = false;
        var fieldType = "string";

        if (isContent) {
          editable = true;
        } else if (isDesign) {
          editable = false;
        } else {
          // Auto-detect based on value type and name heuristics
          if (valType === "string") {
            // Strings named with "url", "src", "link" are content if they look like media URLs
            if (/url|src|link|image|photo|avatar|logo|icon/i.test(propName)) {
              editable = true;
              fieldType = "image";
            } else if (/color|bg|background/i.test(propName)) {
              editable = false;
            } else {
              // General string — check if it looks like content
              editable = FB.cms._isContentValue(val);
            }
          } else if (valType === "array") {
            // Arrays of strings are likely content lists (e.g. services, features)
            editable =
              val.length > 0 &&
              val.every(function (item) {
                return typeof item === "string";
              });
            if (editable) fieldType = "list";
          } else if (valType === "number") {
            editable = false; // numbers are usually configuration
          } else if (valType === "boolean") {
            editable = false; // booleans are toggles
          }
        }

        blockSchema.fields[propName] = {
          editable: editable,
          type: fieldType,
          label: propName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, function (s) {
              return s.toUpperCase();
            }),
        };
      });

      // Handle complex sub-fields for blocks with nested data
      if (block.type === "team" && block.props.members) {
        blockSchema.fields["members"] = {
          editable: true,
          type: "collection",
          label: "Team Members",
          itemFields: {
            name: { editable: true, type: "string", label: "Name" },
            role: { editable: true, type: "string", label: "Role" },
            imageUrl: { editable: true, type: "image", label: "Photo" },
          },
        };
      }

      if (block.type === "pricing" && block.props.plans) {
        blockSchema.fields["plans"] = {
          editable: true,
          type: "collection",
          label: "Pricing Plans",
          itemFields: {
            name: { editable: true, type: "string", label: "Plan Name" },
            price: { editable: true, type: "string", label: "Price" },
            period: { editable: true, type: "string", label: "Period" },
            features: { editable: true, type: "list", label: "Features" },
            cta: { editable: true, type: "string", label: "Button Text" },
          },
        };
      }

      if (block.type === "faq" && block.props.items) {
        blockSchema.fields["items"] = {
          editable: true,
          type: "collection",
          label: "FAQ Items",
          itemFields: {
            q: { editable: true, type: "string", label: "Question" },
            a: { editable: true, type: "richtext", label: "Answer" },
          },
        };
      }

      if (
        (block.type === "nav" ||
          block.type === "slideNav" ||
          block.type === "fullscreenMenu") &&
        block.props.links
      ) {
        blockSchema.fields["links"] = {
          editable: true,
          type: "list",
          label: "Navigation Links",
        };
      }

      if (block.type === "footer" && block.props.columns) {
        blockSchema.fields["columns"] = {
          editable: true,
          type: "collection",
          label: "Footer Columns",
          itemFields: {
            heading: {
              editable: true,
              type: "string",
              label: "Column Heading",
            },
            links: { editable: true, type: "list", label: "Links" },
          },
        };
      }

      // Handle imageUrl/image fields across all blocks
      if (block.props.imageUrl && blockSchema.fields["imageUrl"]) {
        blockSchema.fields["imageUrl"].type = "image";
      }
      if (block.props.avatarUrl && blockSchema.fields["avatarUrl"]) {
        blockSchema.fields["avatarUrl"].type = "image";
      }
      if (block.props.logoUrl && blockSchema.fields["logoUrl"]) {
        blockSchema.fields["logoUrl"].type = "image";
      }

      pageSchema.blocks.push(blockSchema);
    });

    schema.pages.push(pageSchema);
  });

  return schema;
};

// Generate initial content values from current block props
FB.cms.generateContent = function () {
  var content = { pages: {} };

  FB.state.pages.forEach(function (page) {
    var blocks =
      page.id === FB.state.currentPageId ? FB.state.blocks : page.blocks;

    var pageContent = { blocks: {} };

    blocks.forEach(function (block) {
      // Clone only editable props
      var blockContent = {};
      var schema = FB.cms.generateSchema();
      var pageSchema = schema.pages.find(function (p) {
        return p.pageId === page.id;
      });
      if (!pageSchema) return;

      var blockSchema = pageSchema.blocks.find(function (b) {
        return b.blockId === block.id;
      });
      if (!blockSchema) return;

      Object.keys(blockSchema.fields).forEach(function (key) {
        if (
          blockSchema.fields[key].editable &&
          block.props[key] !== undefined
        ) {
          blockContent[key] = JSON.parse(JSON.stringify(block.props[key]));
        }
      });

      if (Object.keys(blockContent).length > 0) {
        pageContent.blocks[block.id] = blockContent;
      }
    });

    if (Object.keys(pageContent.blocks).length > 0) {
      content.pages[page.id] = pageContent;
    }
  });

  return content;
};
```

- [ ] **Step 2: Load cms-schema.js in framework-builder.html**

After `js/export.js`, add:

```html
<script src="js/cms-schema.js"></script>
```

- [ ] **Step 3: Quick verification**

Open the builder in a browser, check the console:

```js
FB.cms.generateSchema();
```

Expected: Returns a schema object mapping pages → blocks → editable fields.

---

### Task 2: CMS API Endpoints in server.py

**Files:**

- Modify: `server.py` — add CMS routes and CORS handling

This adds the REST API layer that the admin dashboard and inline editor use to read/write content.

- [ ] **Step 1: Add CMS-specific imports and paths**

After the existing imports in server.py, add:

```python
import hashlib
import random
import string
import uuid
```

- [ ] **Step 2: Add CMS route handler in do_GET, do_POST, do_PUT, do_DELETE**

In `do_GET`, after the design routes, add:

```python
elif parsed.path == '/api/cms/schema':
    self._handle_cms_get('schema')
elif parsed.path == '/api/cms/content':
    self._handle_cms_get('content')
elif parsed.path == '/api/cms/media':
    self._handle_cms_media_list()
elif parsed.path == '/admin':
    self._handle_admin_serve()
elif parsed.path.startswith('/admin/'):
    self._handle_admin_serve()
```

In `do_POST`, after existing routes, add:

```python
elif parsed.path == '/api/cms/auth/login':
    self._handle_cms_auth_login()
elif parsed.path == '/api/cms/auth/check':
    self._handle_cms_auth_check()
elif parsed.path == '/api/cms/content':
    self._handle_cms_content_save()
elif parsed.path == '/api/cms/media/upload':
    self._handle_cms_media_upload()
```

In `do_DELETE`, after existing routes, add:

```python
elif parsed.path.startswith('/api/cms/media/'):
    self._handle_cms_media_delete()
```

Add `do_PUT` method:

```python
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
```

Add CORS for PUT in `do_OPTIONS`:

```python
self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
```

- [ ] **Step 3: Implement CMS helper methods**

```python
def _cms_data_path(self, filename):
    """Get path to CMS data file relative to the site being served."""
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
    """Check session cookie for valid auth."""
    cookie = self.headers.get('Cookie', '')
    if 'cms_session=' not in cookie:
        return False
    session_id = cookie.split('cms_session=')[1].split(';')[0].strip()
    config = self._cms_read_json('cms-config.json')
    sessions = config.get('sessions', {})
    return session_id in sessions
```

- [ ] **Step 4: Implement CMS GET handler**

```python
def _handle_cms_get(self, resource):
    if resource == 'schema':
        data = self._cms_read_json('cms-schema.json', {})
    elif resource == 'content':
        data = self._cms_read_json('cms-content.json', {})
    else:
        self.send_error(HTTPStatus.NOT_FOUND)
        return
    self._json_response(data)
```

- [ ] **Step 5: Implement CMS auth handlers**

```python
def _handle_cms_auth_login(self):
    length = int(self.headers.get("Content-Length", 0))
    body = json.loads(self.rfile.read(length)) if length else {}
    password = body.get('password', '')
    config = self._cms_read_json('cms-config.json', {})

    if not config.get('password_hash'):
        # First login: set the password
        config['password_hash'] = hashlib.sha256(password.encode()).hexdigest()
        config['sessions'] = {}
        session_id = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
        config['sessions'][session_id] = True
        self._cms_write_json('cms-config.json', config)
        self._json_response({'success': True, 'session': session_id, 'firstTime': True})
        return

    # Verify password
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
```

- [ ] **Step 6: Implement CMS content save handlers**

```python
def _handle_cms_content_save(self):
    if not self._cms_require_auth():
        self._json_response({'error': 'Unauthorized'}, 401)
        return
    length = int(self.headers.get("Content-Length", 0))
    body = json.loads(self.rfile.read(length)) if length else {}

    content = self._cms_read_json('cms-content.json', {})

    # Single field update: { pageId, blockId, field, value }
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

    # Bulk update: { pageId: { blocks: { blockId: { field: value } } } }
    for page_id, page_data in body.items():
        content = self._cms_read_json('cms-content.json', {})
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
```

- [ ] **Step 7: Implement CMS media handlers**

```python
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
            'id': f,
            'filename': f,
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

    # Read the raw POST data and parse multipart
    length = int(self.headers.get("Content-Length", 0))
    raw = self.rfile.read(length)

    # Extract boundary from Content-Type
    boundary = content_type.split('boundary=')[1].split(';')[0].strip()
    if boundary.startswith('"') and boundary.endswith('"'):
        boundary = boundary[1:-1]

    # Find the file part
    boundary_bytes = ('--' + boundary).encode()
    parts = raw.split(boundary_bytes)

    for part in parts:
        if b'Content-Disposition' not in part: continue
        if b'filename=' not in part: continue

        # Extract filename
        header_end = part.find(b'\r\n\r\n')
        if header_end == -1: continue
        headers_str = part[:header_end].decode('utf-8', errors='replace')
        file_data = part[header_end+4:]
        # Remove trailing \r\n--
        if file_data.endswith(b'\r\n'):
            file_data = file_data[:-2]
        if file_data.endswith(b'--\r\n'):
            file_data = file_data[:-4]
        if file_data.endswith(b'--'):
            file_data = file_data[:-2]

        # Extract filename
        import re
        filename_match = re.search(r'filename="([^"]*)"', headers_str)
        if not filename_match: continue
        original_filename = filename_match.group(1)
        if not original_filename: continue

        # Generate unique filename
        ext = os.path.splitext(original_filename)[1]
        unique_name = str(uuid.uuid4())[:8] + ext

        media_dir = os.path.join(STATIC_DIR, 'media')
        os.makedirs(media_dir, exist_ok=True)

        filepath = os.path.join(media_dir, unique_name)
        with open(filepath, 'wb') as f:
            f.write(file_data)

        self._json_response({
            'success': True,
            'media': {
                'id': unique_name,
                'filename': original_filename,
                'url': '/media/' + unique_name
            }
        })
        return

    self._json_response({'error': 'No file found in upload'}, 400)

def _handle_cms_media_delete(self):
    if not self._cms_require_auth():
        self._json_response({'error': 'Unauthorized'}, 401)
        return

    # Path: /api/cms/media/{id}
    media_id = self.path.split('/api/cms/media/')[1]
    media_path = os.path.join(STATIC_DIR, 'media', media_id)

    # Security: prevent directory traversal
    if '..' in media_id or '/' in media_id:
        self._json_response({'error': 'Invalid media ID'}, 400)
        return

    if os.path.exists(media_path):
        os.remove(media_path)
        self._json_response({'success': True})
    else:
        self._json_response({'error': 'File not found'}, 404)
```

- [ ] **Step 8: Add \_json_response helper if missing**

```python
def _json_response(self, data, status=200):
    self.send_response(status)
    self.send_header("Content-Type", "application/json")
    self.send_header("Access-Control-Allow-Origin", "*")
    self.end_headers()
    self.wfile.write(json.dumps(data).encode())
```

- [ ] **Step 9: Test the API manually**

```bash
# Start server
python3 server.py

# Check schema endpoint
curl http://localhost:8899/api/cms/schema
# Expected: {} (no schema yet, or the generated schema if exported)

# Check auth endpoint (first time — sets password)
curl -X POST http://localhost:8899/api/cms/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "admin123"}'
# Expected: {"success": true, "session": "...", "firstTime": true}
```

---

### Task 3: Admin Dashboard

**Files:**

- Create: `admin.html` — standalone SPA for the CMS admin panel

- [ ] **Step 1: Create admin.html**

This is a self-contained HTML file served at `/admin`. It has a login screen, pages tab with forms, media tab, and settings tab. All API calls go to `/api/cms/*`.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CMS Admin</title>
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: #111;
        color: #f0f0f0;
        min-height: 100vh;
      }
      .login-screen {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
      }
      .login-box {
        background: #1a1a2e;
        padding: 40px;
        border-radius: 12px;
        width: 360px;
      }
      .login-box h1 {
        font-size: 24px;
        margin-bottom: 8px;
      }
      .login-box p {
        color: #888;
        font-size: 14px;
        margin-bottom: 24px;
      }
      .login-box input {
        width: 100%;
        padding: 12px;
        background: #2a2a3e;
        border: 1px solid #333;
        border-radius: 8px;
        color: #fff;
        font-size: 14px;
        margin-bottom: 16px;
      }
      .login-box button {
        width: 100%;
        padding: 12px;
        background: #cdfe00;
        color: #111;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
      }
      .login-box button:hover {
        background: #b8e800;
      }
      .login-error {
        color: #ff6b6b;
        font-size: 13px;
        margin-top: 8px;
        display: none;
      }

      .app {
        display: none;
        height: 100vh;
        display: none;
        flex-direction: column;
      }
      .app-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 24px;
        background: #1a1a2e;
        border-bottom: 1px solid #2a2a3e;
      }
      .app-header h1 {
        font-size: 18px;
      }
      .app-header .site-link {
        color: #cdfe00;
        text-decoration: none;
        font-size: 13px;
      }
      .logout-btn {
        background: none;
        border: 1px solid #444;
        color: #aaa;
        padding: 6px 14px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
      }

      .app-body {
        display: flex;
        flex: 1;
        overflow: hidden;
      }
      .sidebar {
        width: 220px;
        background: #1a1a2e;
        border-right: 1px solid #2a2a3e;
        padding: 8px;
      }
      .sidebar-item {
        padding: 10px 14px;
        cursor: pointer;
        border-radius: 8px;
        font-size: 14px;
        margin-bottom: 2px;
        color: #888;
      }
      .sidebar-item:hover {
        background: #2a2a3e;
        color: #fff;
      }
      .sidebar-item.active {
        background: #2a2a3e;
        color: #cdfe00;
        font-weight: 600;
      }

      .main-content {
        flex: 1;
        padding: 24px;
        overflow-y: auto;
      }
      .main-content h2 {
        font-size: 20px;
        margin-bottom: 20px;
      }

      .page-card {
        background: #1a1a2e;
        border-radius: 10px;
        margin-bottom: 12px;
        overflow: hidden;
      }
      .page-card-header {
        padding: 14px 18px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
        font-size: 15px;
      }
      .page-card-header:hover {
        background: #22223a;
      }
      .page-card-body {
        padding: 0 18px 18px;
        display: none;
      }
      .page-card.open .page-card-body {
        display: block;
      }
      .page-card-arrow {
        transition: transform 0.2s;
        font-size: 12px;
        color: #666;
      }
      .page-card.open .page-card-arrow {
        transform: rotate(90deg);
      }

      .block-group {
        background: #22223a;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 16px;
      }
      .block-group h4 {
        font-size: 13px;
        color: #cdfe00;
        margin-bottom: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      .field-group {
        margin-bottom: 14px;
      }
      .field-group label {
        display: block;
        font-size: 12px;
        color: #888;
        margin-bottom: 4px;
      }
      .field-group input[type="text"],
      .field-group textarea {
        width: 100%;
        padding: 10px 12px;
        background: #1a1a2e;
        border: 1px solid #333;
        border-radius: 6px;
        color: #fff;
        font-size: 14px;
      }
      .field-group textarea {
        min-height: 80px;
        resize: vertical;
        font-family: inherit;
      }
      .field-group input[type="text"]:focus,
      .field-group textarea:focus {
        outline: none;
        border-color: #cdfe00;
      }

      .image-field {
        position: relative;
      }
      .image-field img {
        width: 120px;
        height: 80px;
        object-fit: cover;
        border-radius: 6px;
        cursor: pointer;
        border: 2px solid transparent;
      }
      .image-field img:hover {
        border-color: #cdfe00;
      }
      .image-upload-btn {
        display: inline-block;
        padding: 8px 14px;
        background: #333;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        color: #ccc;
        margin-top: 6px;
      }
      .image-upload-btn:hover {
        background: #444;
      }

      .list-field {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .list-field .tag {
        background: #333;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 12px;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .list-field .tag .remove {
        cursor: pointer;
        color: #ff6b6b;
        font-size: 14px;
      }
      .list-field input {
        flex: 1;
        min-width: 100px;
        padding: 6px 10px;
        background: #1a1a2e;
        border: 1px solid #444;
        border-radius: 4px;
        color: #fff;
        font-size: 12px;
      }

      .save-btn {
        padding: 10px 24px;
        background: #cdfe00;
        color: #111;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 12px;
      }
      .save-btn:hover {
        background: #b8e800;
      }
      .save-status {
        display: inline-block;
        margin-left: 12px;
        font-size: 13px;
        color: #4caf50;
      }

      .media-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 12px;
      }
      .media-item {
        background: #1a1a2e;
        border-radius: 8px;
        overflow: hidden;
        position: relative;
      }
      .media-item img {
        width: 100%;
        height: 140px;
        object-fit: cover;
        display: block;
      }
      .media-item .media-name {
        padding: 8px;
        font-size: 11px;
        color: #888;
      }
      .media-item .media-del {
        position: absolute;
        top: 6px;
        right: 6px;
        background: rgba(0, 0, 0, 0.7);
        color: #ff6b6b;
        border: none;
        border-radius: 4px;
        padding: 2px 6px;
        cursor: pointer;
        font-size: 12px;
      }
      .upload-area {
        border: 2px dashed #444;
        border-radius: 10px;
        padding: 40px;
        text-align: center;
        margin-bottom: 20px;
        cursor: pointer;
      }
      .upload-area:hover {
        border-color: #cdfe00;
      }

      .settings-form {
        max-width: 400px;
      }
      .settings-form label {
        display: block;
        font-size: 12px;
        color: #888;
        margin-bottom: 4px;
        margin-top: 16px;
      }
      .settings-form input {
        width: 100%;
        padding: 10px 12px;
        background: #1a1a2e;
        border: 1px solid #333;
        border-radius: 6px;
        color: #fff;
        font-size: 14px;
      }

      .spinner {
        width: 24px;
        height: 24px;
        border: 3px solid #333;
        border-top-color: #cdfe00;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
        margin: 40px auto;
      }
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .toast {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #1a1a2e;
        border: 1px solid #333;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 999;
        display: none;
      }
      .toast.show {
        display: block;
        animation: fadeInUp 0.3s ease;
      }
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .hidden {
        display: none !important;
      }
    </style>
  </head>
  <body>
    <div id="login-screen" class="login-screen">
      <div class="login-box">
        <h1>Content Manager</h1>
        <p id="login-subtitle">Enter your password to manage content.</p>
        <input
          type="password"
          id="password-input"
          placeholder="Password"
          onkeydown="if(event.key==='Enter')login()"
        />
        <button onclick="login()">Sign In</button>
        <div id="login-error" class="login-error">Invalid password</div>
      </div>
    </div>

    <div id="app" class="app">
      <div class="app-header">
        <h1>📝 CMS — <span id="site-name">My Site</span></h1>
        <div>
          <a href="/" class="site-link" target="_blank">View Site →</a>
          <button
            class="logout-btn"
            onclick="logout()"
            style="margin-left:12px"
          >
            Logout
          </button>
        </div>
      </div>
      <div class="app-body">
        <div class="sidebar">
          <div
            class="sidebar-item active"
            data-tab="pages"
            onclick="switchTab('pages')"
          >
            📄 Pages
          </div>
          <div
            class="sidebar-item"
            data-tab="media"
            onclick="switchTab('media')"
          >
            🖼️ Media
          </div>
          <div
            class="sidebar-item"
            data-tab="settings"
            onclick="switchTab('settings')"
          >
            ⚙️ Settings
          </div>
        </div>
        <div class="main-content" id="main-content">
          <!-- Content loaded dynamically -->
        </div>
      </div>
    </div>

    <div id="toast" class="toast"></div>

    <script>
      // State
      var CMS_SESSION = null;
      var CMS_SCHEMA = null;
      var CMS_CONTENT = {};

      function api(path, method, body) {
        var opts = { method: method || "GET", headers: {} };
        if (body) {
          opts.headers["Content-Type"] = "application/json";
          opts.body = JSON.stringify(body);
        }
        if (CMS_SESSION) {
          // Session stored in cookie, no header needed
        }
        return fetch(path, opts).then(function (r) {
          return r.json();
        });
      }

      function showToast(msg) {
        var t = document.getElementById("toast");
        t.textContent = msg;
        t.classList.add("show");
        clearTimeout(t._timer);
        t._timer = setTimeout(function () {
          t.classList.remove("show");
        }, 2500);
      }

      // Auth
      function login() {
        var pw = document.getElementById("password-input").value;
        if (!pw) return;
        api("/api/cms/auth/login", "POST", { password: pw }).then(
          function (res) {
            if (res.success) {
              CMS_SESSION = res.session;
              // Store session in cookie
              document.cookie = "cms_session=" + res.session + "; path=/";
              if (res.firstTime) {
                document.getElementById("login-subtitle").textContent =
                  "Set your admin password.";
              }
              document.getElementById("login-screen").style.display = "none";
              document.getElementById("app").style.display = "flex";
              loadApp();
            } else {
              document.getElementById("login-error").style.display = "block";
            }
          },
        );
      }

      function checkAuth() {
        api("/api/cms/auth/check", "POST").then(function (res) {
          if (!res.authenticated) {
            document.getElementById("login-screen").style.display = "flex";
            document.getElementById("app").style.display = "none";
          }
        });
      }

      function logout() {
        CMS_SESSION = null;
        document.cookie =
          "cms_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.getElementById("login-screen").style.display = "flex";
        document.getElementById("app").style.display = "none";
        document.getElementById("password-input").value = "";
      }

      function loadApp() {
        loadPages();
        loadMedia();
      }

      // Tab switching
      var currentTab = "pages";

      function switchTab(tab) {
        currentTab = tab;
        document.querySelectorAll(".sidebar-item").forEach(function (el) {
          el.classList.toggle("active", el.dataset.tab === tab);
        });
        if (tab === "pages") loadPages();
        else if (tab === "media") loadMedia();
        else if (tab === "settings") loadSettings();
      }

      // Pages Tab
      function loadPages() {
        var main = document.getElementById("main-content");
        main.innerHTML = '<h2>📄 Pages</h2><div class="spinner"></div>';

        Promise.all([api("/api/cms/schema"), api("/api/cms/content")]).then(
          function (results) {
            CMS_SCHEMA = results[0];
            CMS_CONTENT = results[1];

            if (!CMS_SCHEMA.pages || CMS_SCHEMA.pages.length === 0) {
              main.innerHTML =
                '<h2>📄 Pages</h2><p style="color:#888">No CMS content found. Export your site with CMS enabled first.</p>';
              return;
            }

            var html =
              "<h2>📄 Pages</h2>" +
              '<p style="color:#888;margin-bottom:20px;font-size:13px">Click a page to edit its content. Changes save automatically.</p>';

            CMS_SCHEMA.pages.forEach(function (page) {
              var pageContent =
                CMS_CONTENT.pages && CMS_CONTENT.pages[page.pageId]
                  ? CMS_CONTENT.pages[page.pageId].blocks || {}
                  : {};

              html +=
                '<div class="page-card" data-page-id="' + page.pageId + '">';
              html +=
                '<div class="page-card-header" onclick="togglePage(this.parentElement)">';
              html += "<span>" + page.name + "</span>";
              html += '<span class="page-card-arrow">▶</span>';
              html += "</div>";
              html += '<div class="page-card-body">';

              page.blocks.forEach(function (block) {
                var blockContent = pageContent[block.blockId] || {};
                var editableFields = Object.keys(block.fields).filter(
                  function (k) {
                    return block.fields[k].editable;
                  },
                );
                if (editableFields.length === 0) return;

                html +=
                  '<div class="block-group" data-block-id="' +
                  block.blockId +
                  '">';
                html +=
                  "<h4>" +
                  (block.type.charAt(0).toUpperCase() + block.type.slice(1)) +
                  "</h4>";

                editableFields.forEach(function (fieldName) {
                  var field = block.fields[fieldName];
                  var val =
                    blockContent[fieldName] !== undefined
                      ? blockContent[fieldName]
                      : "";
                  var displayLabel = field.label || fieldName;

                  if (field.type === "image") {
                    html += '<div class="field-group">';
                    html += "<label>" + displayLabel + "</label>";
                    html += '<div class="image-field">';
                    if (val)
                      html +=
                        '<img src="' +
                        val +
                        '" onclick="replaceImage(this,\'' +
                        page.pageId +
                        "','" +
                        block.blockId +
                        "','" +
                        fieldName +
                        "')\">";
                    html +=
                      '<div class="image-upload-btn" onclick="replaceImage(this,\'' +
                      page.pageId +
                      "','" +
                      block.blockId +
                      "','" +
                      fieldName +
                      "')\">";
                    html += val ? "Replace Image" : "Add Image";
                    html += "</div></div></div>";
                  } else if (field.type === "richtext") {
                    html += '<div class="field-group">';
                    html += "<label>" + displayLabel + "</label>";
                    html +=
                      "<textarea onchange=\"saveField('" +
                      page.pageId +
                      "','" +
                      block.blockId +
                      "','" +
                      fieldName +
                      "',this.value)\">" +
                      escHtml(String(val)) +
                      "</textarea>";
                    html += "</div>";
                  } else if (field.type === "list" && Array.isArray(val)) {
                    html += '<div class="field-group">';
                    html += "<label>" + displayLabel + "</label>";
                    html +=
                      '<div class="list-field" id="list-' +
                      block.blockId +
                      "-" +
                      fieldName +
                      '">';
                    val.forEach(function (item, idx) {
                      html +=
                        '<span class="tag">' +
                        escHtml(String(item)) +
                        ' <span class="remove" onclick="removeListItem(\'' +
                        page.pageId +
                        "','" +
                        block.blockId +
                        "','" +
                        fieldName +
                        "'," +
                        idx +
                        ')">×</span></span>';
                    });
                    html +=
                      "<input placeholder=\"Add item...\" onkeydown=\"if(event.key==='Enter')addListItem(event,'" +
                      page.pageId +
                      "','" +
                      block.blockId +
                      "','" +
                      fieldName +
                      "')\">";
                    html += "</div></div>";
                  } else {
                    html += '<div class="field-group">';
                    html += "<label>" + displayLabel + "</label>";
                    html +=
                      '<input type="text" value="' +
                      escHtml(String(val)) +
                      '" onchange="saveField(\'' +
                      page.pageId +
                      "','" +
                      block.blockId +
                      "','" +
                      fieldName +
                      "',this.value)\">";
                    html += "</div>";
                  }
                });

                html += "</div>";
              });

              html += "</div></div>";
            });

            main.innerHTML = html;
          },
        );
      }

      function escHtml(s) {
        return s
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      }

      function togglePage(el) {
        el.classList.toggle("open");
      }

      function saveField(pageId, blockId, field, value) {
        api("/api/cms/content", "PUT", {
          pageId: pageId,
          blockId: blockId,
          field: field,
          value: value,
        }).then(function (res) {
          if (res.success) showToast("Saved");
        });
      }

      function replaceImage(el, pageId, blockId, field) {
        var input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = function () {
          var file = input.files[0];
          if (!file) return;
          var formData = new FormData();
          formData.append("file", file);
          fetch("/api/cms/media/upload", { method: "POST", body: formData })
            .then(function (r) {
              return r.json();
            })
            .then(function (res) {
              if (res.success) {
                saveField(pageId, blockId, field, res.media.url);
                if (el.tagName === "IMG") el.src = res.media.url;
                showToast("Image updated");
              }
            });
        };
        input.click();
      }

      function removeListItem(pageId, blockId, field, idx) {
        var container = document.getElementById(
          "list-" + blockId + "-" + field,
        );
        var tags = container.querySelectorAll(".tag");
        var values = [];
        tags.forEach(function (t, i) {
          if (i !== idx) values.push(t.textContent.replace("×", "").trim());
        });
        saveField(pageId, blockId, field, values);
        container.querySelectorAll(".tag").forEach(function (t, i) {
          if (i === idx) t.remove();
        });
      }

      function addListItem(event, pageId, blockId, field) {
        if (event.key !== "Enter") return;
        var input = event.target;
        var val = input.value.trim();
        if (!val) return;
        var container = document.getElementById(
          "list-" + blockId + "-" + field,
        );
        var tags = container.querySelectorAll(".tag");
        var values = [];
        tags.forEach(function (t) {
          values.push(t.textContent.replace("×", "").trim());
        });
        values.push(val);
        saveField(pageId, blockId, field, values);
        var tag = document.createElement("span");
        tag.className = "tag";
        tag.innerHTML =
          escHtml(val) +
          ' <span class="remove" onclick="removeListItem(\'' +
          pageId +
          "','" +
          blockId +
          "','" +
          field +
          "'," +
          values.length +
          ')">×</span>';
        container.insertBefore(tag, input);
        input.value = "";
      }

      // Media Tab
      function loadMedia() {
        var main = document.getElementById("main-content");
        main.innerHTML = '<h2>🖼️ Media Library</h2><div class="spinner"></div>';

        api("/api/cms/media").then(function (res) {
          var items = res.media || [];
          var html = "<h2>🖼️ Media Library</h2>";
          html +=
            '<div class="upload-area" onclick="uploadMedia()">⬆️ Click to upload images</div>';
          html += '<div class="media-grid">';
          items.forEach(function (item) {
            html += '<div class="media-item">';
            html += '<img src="' + item.url + '" alt="' + item.filename + '">';
            html += '<div class="media-name">' + item.filename + "</div>";
            html +=
              '<button class="media-del" onclick="deleteMedia(\'' +
              item.id +
              "',this)\">✕</button>";
            html += "</div>";
          });
          html += "</div>";
          main.innerHTML = html;
        });
      }

      function uploadMedia() {
        var input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.multiple = true;
        input.onchange = function () {
          var files = input.files;
          var pending = files.length;
          Array.from(files).forEach(function (file) {
            var formData = new FormData();
            formData.append("file", file);
            fetch("/api/cms/media/upload", { method: "POST", body: formData })
              .then(function (r) {
                return r.json();
              })
              .then(function (res) {
                pending--;
                if (pending === 0) {
                  showToast("Upload complete");
                  loadMedia();
                }
              });
          });
        };
        input.click();
      }

      function deleteMedia(id, btn) {
        if (!confirm("Delete this image?")) return;
        api("/api/cms/media/" + id, "DELETE").then(function (res) {
          if (res.success) {
            btn.closest(".media-item").remove();
            showToast("Deleted");
          }
        });
      }

      // Settings Tab
      function loadSettings() {
        var main = document.getElementById("main-content");
        main.innerHTML =
          "<h2>⚙️ Settings</h2>" +
          '<div class="settings-form">' +
          "<label>New Password</label>" +
          '<input type="password" id="new-password" placeholder="Leave blank to keep current">' +
          "<label>Confirm Password</label>" +
          '<input type="password" id="confirm-password" placeholder="Confirm new password">' +
          '<button class="save-btn" onclick="saveSettings()" style="margin-top:20px">Save Settings</button>' +
          "</div>";
      }

      function saveSettings() {
        var pw = document.getElementById("new-password").value;
        var confirm = document.getElementById("confirm-password").value;
        if (pw && pw !== confirm) {
          showToast("Passwords do not match");
          return;
        }
        if (pw) {
          api("/api/cms/auth/login", "POST", { password: pw }).then(
            function (res) {
              if (res.success) showToast("Password updated");
            },
          );
        } else {
          showToast("No changes to save");
        }
      }

      // Check auth on load
      checkAuth();
    </script>
  </body>
</html>
```

- [ ] **Step 2: Handle `/admin` serving in server.py**

Add to `do_GET`:

```python
elif parsed.path == '/admin' or parsed.path.startswith('/admin/'):
    self._handle_admin_serve()
```

Implementation:

```python
def _handle_admin_serve(self):
    admin_path = os.path.join(STATIC_DIR, 'admin.html')
    if os.path.exists(admin_path):
        self.send_response(200)
        self.send_header('Content-Type', 'text/html')
        self.end_headers()
        with open(admin_path, 'rb') as f:
            self.wfile.write(f.read())
    else:
        self.send_error(HTTPStatus.NOT_FOUND, 'Admin dashboard not found. Export a site with CMS first.')
```

- [ ] **Step 3: Verify admin dashboard loads**

```bash
# Start server, then visit:
# http://localhost:8899/admin
# Expected: Login screen appears
# Enter password "admin123" (first time sets it)
# Expected: Dashboard loads with pages tab
```

---

### Task 4: Inline Editing Script

**Files:**

- Create: `js/cms-edit.js`

This script enables `?edit` mode on the live site. When appended to the URL, it authenticates the client and makes content editable inline.

- [ ] **Step 1: Create cms-edit.js**

```js
// js/cms-edit.js
// Inline content editing for live sites.
// Include in exported sites. Activated by appending ?edit to URL.

(function () {
  // Only activate if ?edit is in URL
  if (window.location.search.indexOf("edit") === -1) return;

  var ENTER_PW_HTML =
    '\
    <div id="cms-edit-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999998;display:flex;align-items:center;justify-content:center">\
      <div style="background:#1a1a2e;padding:32px;border-radius:12px;width:320px;text-align:center">\
        <h2 style="color:#fff;font-size:20px;margin-bottom:8px;font-family:sans-serif">Edit Content</h2>\
        <p style="color:#888;font-size:13px;margin-bottom:20px;font-family:sans-serif">Enter your admin password to edit this page.</p>\
        <input type="password" id="cms-pw-input" style="width:100%;padding:10px 12px;background:#2a2a3e;border:1px solid #444;border-radius:6px;color:#fff;font-size:14px;margin-bottom:12px;box-sizing:border-box" placeholder="Password">\
        <button id="cms-pw-btn" style="width:100%;padding:10px;background:#CDFE00;color:#111;border:none;border-radius:6px;font-size:14px;font-weight:600;cursor:pointer">Sign In</button>\
        <p id="cms-pw-error" style="color:#ff6b6b;font-size:13px;margin-top:8px;display:none;font-family:sans-serif">Invalid password</p>\
      </div>\
    </div>\
    <div id="cms-toolbar" style="position:fixed;bottom:0;left:0;right:0;background:#1a1a2e;border-top:1px solid #333;padding:10px 20px;z-index:999999;display:none;font-family:sans-serif;display:none;align-items:center;justify-content:space-between">\
      <span style="color:#CDFE00;font-size:13px;font-weight:600">✏️ Editing Mode</span>\
      <div>\
        <a href="?" style="color:#888;text-decoration:none;font-size:13px;margin-right:16px">Exit Edit Mode</a>\
        <a href="/admin" style="color:#CDFE00;text-decoration:none;font-size:13px" target="_blank">📊 Admin Dashboard</a>\
      </div>\
    </div>';

  // Inject styles
  var style = document.createElement("style");
  style.textContent =
    "\
    .cms-editable { outline: 2px dashed rgba(205,254,0,0); transition: outline-color 0.2s; cursor: text; }\
    .cms-editable:hover { outline-color: rgba(205,254,0,0.5); }\
    .cms-editable.cms-editing { outline-color: #CDFE00; background: rgba(205,254,0,0.05); }\
    .cms-editable-image { outline: 2px dashed rgba(205,254,0,0); transition: outline-color 0.2s; cursor: pointer; }\
    .cms-editable-image:hover { outline-color: rgba(205,254,0,0.5); }\
    .cms-saved-indicator { position: fixed; bottom: 60px; right: 20px; background: #1a1a2e; color: #4caf50; padding: 8px 16px; border-radius: 8px; font-size: 13px; z-index: 999999; font-family: sans-serif; opacity: 0; transition: opacity 0.3s; }\
    .cms-saved-indicator.show { opacity: 1; }\
  ";
  document.head.appendChild(style);

  document.body.insertAdjacentHTML("beforeend", ENTER_PW_HTML);

  var overlay = document.getElementById("cms-edit-overlay");
  var toolbar = document.getElementById("cms-toolbar");
  var pwInput = document.getElementById("cms-pw-input");
  var pwBtn = document.getElementById("cms-pw-btn");
  var pwError = document.getElementById("cms-pw-error");

  pwInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") pwBtn.click();
  });

  pwBtn.addEventListener("click", function () {
    var pw = pwInput.value;
    fetch("/api/cms/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (res) {
        if (res.success) {
          overlay.style.display = "none";
          toolbar.style.display = "flex";
          enableEditing();
        } else {
          pwError.style.display = "block";
        }
      });
  });

  var CMS_SCHEMA = null;
  var CMS_CONTENT = null;
  var saveTimer = null;

  function enableEditing() {
    fetch("/api/cms/schema")
      .then(function (r) {
        return r.json();
      })
      .then(function (schema) {
        CMS_SCHEMA = schema;
        return fetch("/api/cms/content").then(function (r) {
          return r.json();
        });
      })
      .then(function (content) {
        CMS_CONTENT = content;
        applyContent();
        markEditable();
      });
  }

  function applyContent() {
    // Replace text content with CMS values from the API
    if (!CMS_CONTENT || !CMS_CONTENT.pages) return;

    // Find current page content (we match by slug from URL)
    var pageSlug =
      window.location.pathname.replace(/^\//, "").replace(/\.html$/, "") ||
      "index";
    var pageSchema = CMS_SCHEMA.pages
      ? CMS_SCHEMA.pages.find(function (p) {
          return p.slug === pageSlug;
        })
      : null;

    if (!pageSchema) return;

    var pageContent = CMS_CONTENT.pages[pageSchema.pageId];
    if (!pageContent || !pageContent.blocks) return;

    // Find blocks by data-block-id or by their position in the DOM
    document.querySelectorAll("[data-block-id]").forEach(function (el) {
      var blockId = el.getAttribute("data-block-id");
      var blockContent = pageContent.blocks[blockId];
      if (!blockContent) return;

      Object.keys(blockContent).forEach(function (field) {
        var value = blockContent[field];
        // Find elements with data-cms-field attribute
        el.querySelectorAll('[data-cms-field="' + field + '"]').forEach(
          function (fieldEl) {
            if (typeof value === "string") {
              fieldEl.textContent = value;
            } else if (Array.isArray(value)) {
              // Handle list rendering differently per field context
            }
          },
        );
      });
    });
  }

  function markEditable() {
    if (!CMS_SCHEMA || !CMS_SCHEMA.pages) return;

    var pageSlug =
      window.location.pathname.replace(/^\//, "").replace(/\.html$/, "") ||
      "index";
    var pageSchema = CMS_SCHEMA.pages.find(function (p) {
      return p.slug === pageSlug;
    });

    if (!pageSchema) return;

    var pageContent =
      CMS_CONTENT && CMS_CONTENT.pages
        ? CMS_CONTENT.pages[pageSchema.pageId]
        : null;

    pageSchema.blocks.forEach(function (block) {
      // Find block elements in DOM
      document
        .querySelectorAll('[data-block-id="' + block.blockId + '"]')
        .forEach(function (blockEl) {
          Object.keys(block.fields).forEach(function (fieldName) {
            var field = block.fields[fieldName];
            if (!field.editable) return;

            var blockContent = pageContent
              ? pageContent.blocks[block.blockId]
              : null;
            var currentVal = blockContent ? blockContent[fieldName] : null;

            if (field.type === "image") {
              // Find images inside this block
              blockEl.querySelectorAll("img[src]").forEach(function (img) {
                // Heuristic: treat the main content image as editable
                if (img.closest(".block-controls")) return;
                img.classList.add("cms-editable-image");
                img.setAttribute("data-cms-field", fieldName);
                img.addEventListener("click", function (e) {
                  e.preventDefault();
                  replaceImage(
                    img,
                    pageSchema.pageId,
                    block.blockId,
                    fieldName,
                  );
                });
              });
            } else if (field.type === "richtext" || field.type === "string") {
              // Find text elements in this block
              blockEl
                .querySelectorAll(
                  "h1, h2, h3, h4, p, span, a, button, li, .cms-text",
                )
                .forEach(function (textEl) {
                  if (textEl.closest(".block-controls, .drag-handle")) return;
                  if (textEl.getAttribute("contenteditable")) return;

                  textEl.classList.add("cms-editable");
                  textEl.setAttribute("data-cms-field", fieldName);
                  textEl.contentEditable = true;

                  textEl.addEventListener("blur", function () {
                    textEl.classList.remove("cms-editing");
                    debounceSave(
                      pageSchema.pageId,
                      block.blockId,
                      fieldName,
                      textEl.textContent,
                    );
                  });
                  textEl.addEventListener("focus", function () {
                    textEl.classList.add("cms-editing");
                  });
                  textEl.addEventListener("keydown", function (e) {
                    if (e.key === "Escape") textEl.blur();
                  });
                });
            }
          });
        });
    });
  }

  function debounceSave(pageId, blockId, field, value) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      fetch("/api/cms/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: pageId,
          blockId: blockId,
          field: field,
          value: value,
        }),
      })
        .then(function (r) {
          return r.json();
        })
        .then(function (res) {
          if (res.success) showSavedIndicator();
        });
    }, 800);
  }

  function showSavedIndicator() {
    var el = document.querySelector(".cms-saved-indicator");
    if (!el) {
      el = document.createElement("div");
      el.className = "cms-saved-indicator";
      el.textContent = "✓ Saved";
      document.body.appendChild(el);
    }
    el.classList.add("show");
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(function () {
      el.classList.remove("show");
    }, 2000);
  }

  function replaceImage(imgEl, pageId, blockId, fieldName) {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = function () {
      var file = input.files[0];
      if (!file) return;
      var formData = new FormData();
      formData.append("file", file);
      fetch("/api/cms/media/upload", { method: "POST", body: formData })
        .then(function (r) {
          return r.json();
        })
        .then(function (res) {
          if (res.success) {
            imgEl.src = res.media.url;
            debounceSave(pageId, blockId, fieldName, res.media.url);
          }
        });
    };
    input.click();
  }
})();
```

- [ ] **Step 2: Add data-block-id attributes to exported HTML**

In `js/export.js`, in `generateHTML` function, modify the block rendering to include `data-block-id`:

Find the section where blocks are rendered (around line 418-452) and add `data-block-id` attribute:

```js
// In the block rendering loop, add data-block-id to the wrapper
inner.setAttribute("data-block-id", b.id);
```

This is added to the cloned `inner` element before `innerHTML` is extracted. Since `innerHTML` is extracted from the clone, the attribute will be in the exported HTML.

- [ ] **Step 3: Verify inline editing**

```bash
# Export a site with CMS
# Visit the exported site with ?edit
# Expected: Password overlay appears → enter password → editable elements get dashed borders → click to edit → auto-save
```

---

### Task 5: Content Rendering

**Files:**

- Create: `js/cms-render.js`

This script runs on every page load of the live site (without `?edit`). It fetches the latest CMS content from the API and replaces the baked-in content.

- [ ] **Step 1: Create cms-render.js**

```js
// js/cms-render.js
// Fetches CMS content and applies it to the page on every load.
// Included in all CMS-exported sites. Runs automatically.

(function () {
  // Skip if in edit mode (cms-edit.js handles that)
  if (window.location.search.indexOf("edit") > -1) return;

  // Get current page slug from URL
  var pageSlug =
    window.location.pathname.replace(/^\//, "").replace(/\.html$/, "") ||
    "index";

  // Fetch content
  Promise.all([
    fetch("/api/cms/schema").then(function (r) {
      return r.json();
    }),
    fetch("/api/cms/content").then(function (r) {
      return r.json();
    }),
  ])
    .then(function (results) {
      var schema = results[0];
      var content = results[1];

      if (!schema.pages || !content.pages) return;

      var pageSchema = schema.pages.find(function (p) {
        return p.slug === pageSlug;
      });
      if (!pageSchema) return;

      var pageContent = content.pages[pageSchema.pageId];
      if (!pageContent || !pageContent.blocks) return;

      // Apply content to blocks
      document.querySelectorAll("[data-block-id]").forEach(function (blockEl) {
        var blockId = blockEl.getAttribute("data-block-id");
        var blockContent = pageContent.blocks[blockId];
        if (!blockContent) return;

        Object.keys(blockContent).forEach(function (field) {
          var value = blockContent[field];
          var fieldEls = blockEl.querySelectorAll(
            '[data-cms-field="' + field + '"]',
          );

          fieldEls.forEach(function (el) {
            if (el.tagName === "IMG" || el.tagName === "SOURCE") {
              if (typeof value === "string") el.src = value;
            } else {
              if (typeof value === "string") el.textContent = value;
            }
          });
        });
      });
    })
    .catch(function () {
      // Content fetch failed — page still works with baked-in content
    });
})();
```

- [ ] **Step 2: Include cms-render.js in exported sites**

In `js/export.js`, in `generateHTML`, add the script tag before `</body>`:

```js
// After scrollAnimJS, add CMS render script
var cmsRenderJS = '<script src="js/cms-render.js"><\/script>\n';
var cmsInlineEditJS = '<script src="js/cms-edit.js"><\/script>\n';

// Add to the HTML return
return (
  "..." + // existing code
  scrollAnimJS +
  cmsRenderJS +
  cmsInlineEditJS +
  "</body>\n</html>"
);
```

---

### Task 6: Export with CMS

**Files:**

- Modify: `js/export.js` — add CMS export option
- Modify: `framework-builder.html` — add CMS export button

- [ ] **Step 1: Add "Export with CMS" option to the export menu**

In `framework-builder.html`, in the export menu (around line 406-430), add a CMS export option:

```html
<button class="export-menu-item" onclick="FB.export.exportWithCMS()">
  <span class="emi-icon">📝</span>
  <div>
    <div class="emi-label">Export with CMS</div>
    <div class="emi-sublabel">Live site with inline editing + admin panel</div>
  </div>
</button>
```

- [ ] **Step 2: Implement exportWithCMS in export.js**

Add to `FB.export`:

```js
FB.export.exportWithCMS = function () {
  FB.panels._save(); // Save current page state

  // Collect all pages
  var allPages = FB.state.pages;
  var originalPageId = FB.state.currentPageId;
  var originalBlocks = JSON.parse(JSON.stringify(FB.state.blocks));

  // Generate schema and content for all pages
  var schema = { pages: [] };
  var contentData = { pages: {} };

  allPages.forEach(function (page) {
    // Switch to this page to get its blocks
    FB.state.currentPageId = page.id;
    var blocks = page.blocks || [];

    // Create page entry in schema
    var pageSchema = {
      pageId: page.id,
      name: page.name,
      slug: page.slug,
      blocks: [],
    };

    var pageContent = { blocks: {} };

    blocks.forEach(function (block) {
      if (!block.props) return;

      var blockSchema = {
        blockId: block.id,
        type: block.type,
        fields: {},
      };

      var blockContent = {};

      // Use the schema generation utility
      var def =
        FB.blocks.BLOCK_DEFS[block.type] ||
        FB.blocks.CUSTOM_BLOCK_DEFS[block.type] ||
        FB.blocks.ECOMMERCE_DEFS[block.type];

      if (!def) return;

      Object.keys(def.defaultProps).forEach(function (propName) {
        var isContent = FB.cms.CONTENT_PROPS.has(propName);
        var isDesign = FB.cms.DESIGN_PROPS.has(propName);
        var val = block.props[propName];

        var editable = false;
        var fieldType = "string";

        if (isContent) {
          editable = true;
        } else if (
          !isDesign &&
          typeof val === "string" &&
          !val.startsWith("#") &&
          val.length > 0
        ) {
          editable = true;
          if (
            /url|src|image|photo|avatar|logo/i.test(propName) &&
            /\.(jpg|png|gif|webp|svg)/i.test(val)
          ) {
            fieldType = "image";
          }
        } else if (
          !isDesign &&
          Array.isArray(val) &&
          val.length > 0 &&
          val.every(function (i) {
            return typeof i === "string";
          })
        ) {
          editable = true;
          fieldType = "list";
        }

        blockSchema.fields[propName] = {
          editable: editable,
          type: fieldType,
          label: propName
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, function (s) {
              return s.toUpperCase();
            }),
        };

        if (editable && block.props[propName] !== undefined) {
          blockContent[propName] = JSON.parse(
            JSON.stringify(block.props[propName]),
          );
        }
      });

      pageSchema.blocks.push(blockSchema);
      if (Object.keys(blockContent).length > 0) {
        pageContent.blocks[block.id] = blockContent;
      }
    });

    schema.pages.push(pageSchema);
    if (Object.keys(pageContent.blocks).length > 0) {
      contentData.pages[page.id] = pageContent;
    }
  });

  // Restore original state
  FB.state.currentPageId = originalPageId;
  FB.state.blocks = originalBlocks;

  // Generate the CMS export as a downloadable ZIP (via individual files)
  FB.export._downloadCMSExport(schema, contentData);

  FB.util.showToast("CMS export ready");
};

FB.export._downloadCMSExport = function (schema, content) {
  // Create a manifest of files to download
  var files = {
    "cms-schema.json": JSON.stringify(schema, null, 2),
    "cms-content.json": JSON.stringify(content, null, 2),
  };

  // Download each file sequentially
  var keys = Object.keys(files);
  var idx = 0;

  function next() {
    if (idx >= keys.length) {
      FB.util.showToast("CMS files exported — place them in your site root");
      return;
    }
    var name = keys[idx++];
    var data = files[name];
    var blob = new Blob([data], { type: "application/json" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(next, 500);
  }

  next();
};
```

- [ ] **Step 3: Verify export**

```bash
# Open builder, build a site with some blocks
# Click "Export with CMS"
# Expected: Downloads cms-schema.json and cms-content.json
# Copy these to the exported site folder
# Start server, visit the site — content should render from CMS files
```

---

### Task 7: Integration & Edge Cases

**Files:**

- Modify: `server.py` — serve media files
- Modify: `framework-builder.html` — add data-block-id attributes to canvas blocks

- [ ] **Step 1: Serve /media/ directory from server.py**

Add to `do_GET`, before the `super().do_GET()` fallback:

```python
elif parsed.path.startswith('/media/'):
    # Serve uploaded media files
    media_path = os.path.join(STATIC_DIR, parsed.path.lstrip('/'))
    if os.path.exists(media_path):
        self.send_response(200)
        # Determine content type from extension
        ext = os.path.splitext(media_path)[1].lower()
        content_types = {
            '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
            '.png': 'image/png', '.gif': 'image/gif',
            '.webp': 'image/webp', '.svg': 'image/svg+xml',
        }
        self.send_header('Content-Type', content_types.get(ext, 'application/octet-stream'))
        self.send_header('Cache-Control', 'public, max-age=3600')
        self.end_headers()
        with open(media_path, 'rb') as f:
            self.wfile.write(f.read())
    else:
        self.send_error(HTTPStatus.NOT_FOUND)
```

- [ ] **Step 2: Add data-block-id to canvas block rendering**

In `js/canvas.js` or wherever blocks are rendered on the canvas, ensure each block wrapper has `data-block-id`. Search for where canvas blocks get their `data-id` attribute and add a matching `data-block-id`. The export code in `generateHTML` already clones these, so if the canvas has `data-block-id`, the export will too.

If the canvas already uses `data-id` for block identification, the simplest approach is to add `data-block-id` alongside it in the block rendering function.

- [ ] **Step 3: Handle edge case — no CMS data yet**

In `cms-render.js`, gracefully handle the case where `cms-schema.json` or `cms-content.json` don't exist (fresh export). The page should render with its baked-in content as a fallback. The `.catch()` already handles this.

- [ ] **Step 4: Handle edge case — image in CMS content not found**

In the admin dashboard and inline editor, if a saved image URL returns 404, show a broken-image fallback. The admin dashboard already handles this via the `<img>` tag's native error behavior, but add:

```js
// In cms-edit.js and cms-render.js, for image elements:
imgEl.onerror = function () {
  this.style.border = "2px solid #ff6b6b";
  this.title = "Image not found";
};
```
