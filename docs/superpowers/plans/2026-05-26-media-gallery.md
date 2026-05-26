# Media Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persistent media library to the left panel of Framework Builder — upload images, import by URL, organise into folders, search, and insert images into canvas block props.

**Architecture:** Patch the existing `/api/cms/media/*` server endpoints (strip auth, enrich list with metadata, add URL download/meta update/folder routes). A new `js/media-gallery.js` module owns all rendering into `#media-library`. Right panel image URL inputs get a 📁 pick button injected post-render.

**Tech Stack:** Python `http.server` (server), vanilla JS (client), `media/media-meta.json` (metadata persistence), `urllib.request` (URL download), no new npm dependencies.

---

## File Map

| Action | File                     | Responsibility                                                                           |
| ------ | ------------------------ | ---------------------------------------------------------------------------------------- |
| Modify | `server.py`              | Strip auth, enrich list, add 3 routes, add `do_PATCH`, metadata helpers                  |
| Create | `js/media-gallery.js`    | Full `FB.mediaGallery` module — state, render, fetch, upload, import, folders, pick mode |
| Modify | `framework-builder.html` | Add Media accordion between Layers and Sections                                          |
| Modify | `src/main.js`            | Import `media-gallery.js`                                                                |
| Modify | `js/app.js`              | Call `FB.mediaGallery.init()` in `FB.init()`                                             |
| Modify | `js/panels.js`           | Add `_injectMediaButtons` helper, call it at end of `renderRightPanel`                   |

---

## Task 1: Server — metadata helpers + `do_PATCH` + CORS update

**Files:**

- Modify: `server.py`

- [ ] **Step 1: Add `_read_media_meta` and `_write_media_meta` helpers**

  In `server.py`, insert these two methods before `_json_response` (currently at line ~1092). Place them after `_handle_cms_media_delete`.

  ```python
  def _read_media_meta(self):
      meta_path = os.path.join(STATIC_DIR, 'media', 'media-meta.json')
      if not os.path.exists(meta_path):
          return {'folders': [], 'files': {}}
      try:
          with open(meta_path, 'r') as f:
              return json.load(f)
      except Exception:
          return {'folders': [], 'files': {}}

  def _write_media_meta(self, meta):
      media_dir = os.path.join(STATIC_DIR, 'media')
      os.makedirs(media_dir, exist_ok=True)
      meta_path = os.path.join(media_dir, 'media-meta.json')
      tmp_path = meta_path + '.tmp'
      with open(tmp_path, 'w') as f:
          json.dump(meta, f, indent=2)
      os.replace(tmp_path, meta_path)
  ```

- [ ] **Step 2: Add `do_PATCH` method**

  In `server.py`, add after `do_DELETE` (currently around line 87):

  ```python
  def do_PATCH(self):
      parsed = urllib.parse.urlparse(self.path)
      if parsed.path.startswith('/api/cms/media/'):
          self._handle_cms_media_meta_update()
      else:
          self.send_error(HTTPStatus.NOT_FOUND)
  ```

- [ ] **Step 3: Update `do_OPTIONS` to include PATCH**

  Find the existing `do_OPTIONS` method. Change:

  ```python
  self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  ```

  To:

  ```python
  self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
  ```

- [ ] **Step 4: Verify server still starts**

  ```bash
  cd /home/shauntuhey/Framework && python3 server.py &
  sleep 1
  curl -s http://localhost:8899/api/designs | python3 -c "import sys,json; d=json.load(sys.stdin); print('OK:', type(d))"
  kill %1
  ```

  Expected: `OK: <class 'list'>`

- [ ] **Step 5: Commit**

  ```bash
  git add server.py
  git commit -m "feat(server): add media metadata helpers, do_PATCH, PATCH CORS header"
  ```

---

## Task 2: Server — strip auth, enrich list, update delete to clean meta

**Files:**

- Modify: `server.py:1020-1079`

- [ ] **Step 1: Strip auth from `_handle_cms_media_upload`**

  Remove lines 1021–1023 from `_handle_cms_media_upload`:

  ```python
  # DELETE these three lines:
  if not self._cms_require_auth():
      self._json_response({'error': 'Unauthorized'}, 401)
      return
  ```

- [ ] **Step 2: Add meta entry on upload success**

  In `_handle_cms_media_upload`, after the line `with open(filepath, 'wb') as f: f.write(file_data)`, add:

  ```python
  import datetime
  meta = self._read_media_meta()
  meta.setdefault('files', {})[unique_name] = {
      'originalName': original_filename,
      'folder': None,
      'tags': [],
      'addedAt': datetime.datetime.utcnow().isoformat() + 'Z',
  }
  self._write_media_meta(meta)
  ```

- [ ] **Step 3: Strip auth from `_handle_cms_media_delete` and clean meta**

  Replace the entire `_handle_cms_media_delete` method body with:

  ```python
  def _handle_cms_media_delete(self):
      media_id = self.path.split('/api/cms/media/')[1]
      media_path = os.path.join(STATIC_DIR, 'media', media_id)
      if '..' in media_id or '/' in media_id:
          self._json_response({'error': 'Invalid media ID'}, 400)
          return
      if os.path.exists(media_path):
          os.remove(media_path)
          meta = self._read_media_meta()
          meta.get('files', {}).pop(media_id, None)
          self._write_media_meta(meta)
          self._json_response({'success': True})
      else:
          self._json_response({'error': 'File not found'}, 404)
  ```

- [ ] **Step 4: Enrich `_handle_cms_media_list`**

  Replace the entire `_handle_cms_media_list` method with:

  ```python
  def _handle_cms_media_list(self):
      media_dir = os.path.join(STATIC_DIR, 'media')
      if not os.path.exists(media_dir):
          self._json_response({'folders': [], 'media': []})
          return
      meta = self._read_media_meta()
      files = []
      for f in os.listdir(media_dir):
          if f.startswith('.') or f == 'media-meta.json':
              continue
          path = os.path.join(media_dir, f)
          if not os.path.isfile(path):
              continue
          file_meta = meta.get('files', {}).get(f, {})
          files.append({
              'id': f,
              'filename': f,
              'originalName': file_meta.get('originalName', f),
              'size': os.path.getsize(path),
              'url': '/media/' + f,
              'folder': file_meta.get('folder', None),
              'tags': file_meta.get('tags', []),
              'addedAt': file_meta.get('addedAt', ''),
          })
      self._json_response({'folders': meta.get('folders', []), 'media': files})
  ```

- [ ] **Step 5: Test the enriched list endpoint**

  ```bash
  cd /home/shauntuhey/Framework && python3 server.py &
  sleep 1
  curl -s http://localhost:8899/api/cms/media | python3 -c "import sys,json; d=json.load(sys.stdin); print('folders:', d['folders']); print('media count:', len(d['media']))"
  kill %1
  ```

  Expected: `folders: []` and `media count: <number>` with no error.

- [ ] **Step 6: Commit**

  ```bash
  git add server.py
  git commit -m "feat(server): strip media auth, enrich list with metadata, clean meta on delete"
  ```

---

## Task 3: Server — new routes (download, meta update, folder create)

**Files:**

- Modify: `server.py`

- [ ] **Step 1: Add `_handle_cms_media_download`**

  Add this method after `_write_media_meta`:

  ```python
  def _handle_cms_media_download(self):
      import datetime
      length = int(self.headers.get('Content-Length', 0))
      body = json.loads(self.rfile.read(length)) if length else {}
      url = body.get('url', '').strip()
      if not url:
          self._json_response({'error': 'Missing url'}, 400)
          return
      try:
          req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
          resp = urllib.request.urlopen(req, timeout=10)
          content_type = resp.headers.get('Content-Type', '')
          ct_base = content_type.split(';')[0].strip()
          if not ct_base.startswith('image/'):
              self._json_response({'error': 'URL did not return an image (got: ' + ct_base + ')'}, 400)
              return
          ct_map = {
              'image/jpeg': '.jpg', 'image/png': '.png',
              'image/webp': '.webp', 'image/gif': '.gif', 'image/svg+xml': '.svg',
          }
          ext = ct_map.get(ct_base, '.jpg')
          unique_name = str(uuid.uuid4())[:8] + ext
          media_dir = os.path.join(STATIC_DIR, 'media')
          os.makedirs(media_dir, exist_ok=True)
          filepath = os.path.join(media_dir, unique_name)
          with open(filepath, 'wb') as f:
              f.write(resp.read(10 * 1024 * 1024))
          original_name = os.path.basename(urllib.parse.urlparse(url).path) or unique_name
          meta = self._read_media_meta()
          meta.setdefault('files', {})[unique_name] = {
              'originalName': original_name,
              'folder': None,
              'tags': [],
              'addedAt': datetime.datetime.utcnow().isoformat() + 'Z',
          }
          self._write_media_meta(meta)
          self._json_response({
              'success': True,
              'media': {'id': unique_name, 'url': '/media/' + unique_name, 'originalName': original_name},
          })
      except Exception as e:
          self._json_response({'error': 'Failed to download: ' + str(e)[:200]}, 400)
  ```

- [ ] **Step 2: Add `_handle_cms_media_meta_update`**

  ```python
  def _handle_cms_media_meta_update(self):
      media_id = self.path.split('/api/cms/media/')[1]
      if '..' in media_id or '/' in media_id:
          self._json_response({'error': 'Invalid media ID'}, 400)
          return
      length = int(self.headers.get('Content-Length', 0))
      body = json.loads(self.rfile.read(length)) if length else {}
      meta = self._read_media_meta()
      file_entry = meta.setdefault('files', {}).setdefault(media_id, {
          'originalName': media_id, 'folder': None, 'tags': [], 'addedAt': '',
      })
      for k in ('folder', 'tags', 'originalName'):
          if k in body:
              file_entry[k] = body[k]
      self._write_media_meta(meta)
      self._json_response({'success': True})
  ```

- [ ] **Step 3: Add `_handle_cms_media_folders_create`**

  ```python
  def _handle_cms_media_folders_create(self):
      length = int(self.headers.get('Content-Length', 0))
      body = json.loads(self.rfile.read(length)) if length else {}
      name = (body.get('name') or '').strip()
      if not name:
          self._json_response({'error': 'Folder name required'}, 400)
          return
      meta = self._read_media_meta()
      folders = meta.get('folders', [])
      if name in folders:
          self._json_response({'error': 'Folder already exists'}, 400)
          return
      folders.append(name)
      meta['folders'] = folders
      self._write_media_meta(meta)
      self._json_response({'success': True, 'folders': folders})
  ```

- [ ] **Step 4: Wire new routes into `do_POST`**

  In `do_POST`, add before the `else: self.send_error(...)` line:

  ```python
  elif parsed.path == '/api/cms/media/download':
      self._handle_cms_media_download()
  elif parsed.path == '/api/cms/media/folders':
      self._handle_cms_media_folders_create()
  ```

- [ ] **Step 5: Test all three new routes**

  ```bash
  cd /home/shauntuhey/Framework && python3 server.py &
  sleep 1

  # Test folder create
  curl -s -X POST http://localhost:8899/api/cms/media/folders \
    -H 'Content-Type: application/json' \
    -d '{"name":"Backgrounds"}' | python3 -c "import sys,json; d=json.load(sys.stdin); print('folders:', d)"

  # Test meta update (use an id of a file that exists in media/, or any string)
  curl -s -X PATCH http://localhost:8899/api/cms/media/test.jpg \
    -H 'Content-Type: application/json' \
    -d '{"folder":"Backgrounds"}' | python3 -c "import sys,json; d=json.load(sys.stdin); print('meta update:', d)"

  # Test download with a known-good small image
  curl -s -X POST http://localhost:8899/api/cms/media/download \
    -H 'Content-Type: application/json' \
    -d '{"url":"https://via.placeholder.com/150/png"}' | python3 -c "import sys,json; d=json.load(sys.stdin); print('download:', d)"

  kill %1
  ```

  Expected:
  - folder create: `{'success': True, 'folders': ['Backgrounds']}`
  - meta update: `{'success': True}`
  - download: `{'success': True, 'media': {'id': '...', 'url': '/media/...', 'originalName': '...'}}`

- [ ] **Step 6: Commit**

  ```bash
  git add server.py
  git commit -m "feat(server): add media download, meta update, folder create routes"
  ```

---

## Task 4: HTML accordion + module registration

**Files:**

- Modify: `framework-builder.html`
- Modify: `src/main.js`
- Modify: `js/app.js`

- [ ] **Step 1: Add Media accordion to `framework-builder.html`**

  Find the Layers accordion (search for `data-acc="layers"`). Insert the new block **after** the closing `</div>` of the Layers accordion and **before** the opening `<div class="lp-accordion">` of the Sections accordion:

  ```html
  <div class="lp-accordion">
    <div
      class="lp-acc-header"
      data-acc="media"
      onclick="FB.panels.toggleLeftAccordion(this)"
    >
      <span class="lp-acc-icon">🖼</span>
      <span class="lp-acc-label">Media</span>
      <span class="lp-acc-arrow">▶</span>
    </div>
    <div class="lp-acc-body" id="lp-body-media">
      <div id="media-library"></div>
    </div>
  </div>
  ```

- [ ] **Step 2: Add import to `src/main.js`**

  After the line `import "../js/project.js";` add:

  ```js
  import "../js/media-gallery.js";
  ```

- [ ] **Step 3: Add `init()` call to `js/app.js`**

  In `FB.init`, after the line `FB.canvas.initCountdown();` add:

  ```js
  if (FB.mediaGallery && FB.mediaGallery.init) FB.mediaGallery.init();
  ```

- [ ] **Step 4: Verify HTML is valid**

  ```bash
  grep -c 'lp-accordion' /home/shauntuhey/Framework/framework-builder.html
  grep -n 'data-acc="media"' /home/shauntuhey/Framework/framework-builder.html
  ```

  Expected: count increases by 1, and the `data-acc="media"` line is found between `data-acc="layers"` and `data-acc="sections"`.

- [ ] **Step 5: Commit**

  ```bash
  git add framework-builder.html src/main.js js/app.js
  git commit -m "feat: add Media accordion to left nav, wire media-gallery module"
  ```

---

## Task 5: Create `js/media-gallery.js`

**Files:**

- Create: `js/media-gallery.js`

- [ ] **Step 1: Create the file with full module**

  Create `/home/shauntuhey/Framework/js/media-gallery.js` with this content:

  ```js
  FB.mediaGallery = {};

  FB.mediaGallery._files = [];
  FB.mediaGallery._folders = [];
  FB.mediaGallery._activeFolder = null;
  FB.mediaGallery._query = "";
  FB.mediaGallery._pickMode = null;

  FB.mediaGallery.init = function () {
    FB.mediaGallery._fetch();
  };

  FB.mediaGallery.refresh = function () {
    FB.mediaGallery._fetch();
  };

  FB.mediaGallery.pickFor = function (blockId, propKey) {
    FB.mediaGallery._pickMode = { blockId: blockId, propKey: propKey };
    FB.mediaGallery._render();
    var header = document.querySelector('[data-acc="media"]');
    if (header && !header.classList.contains("open")) {
      FB.panels.toggleLeftAccordion(header);
    }
  };

  FB.mediaGallery._fetch = function () {
    fetch("/api/cms/media")
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        FB.mediaGallery._files = data.media || [];
        FB.mediaGallery._folders = data.folders || [];
        FB.mediaGallery._render();
      })
      .catch(function () {
        FB.mediaGallery._render();
      });
  };

  FB.mediaGallery._filtered = function () {
    var files = FB.mediaGallery._files;
    if (FB.mediaGallery._activeFolder) {
      files = files.filter(function (f) {
        return f.folder === FB.mediaGallery._activeFolder;
      });
    }
    if (FB.mediaGallery._query) {
      var q = FB.mediaGallery._query.toLowerCase();
      files = files.filter(function (f) {
        return (
          (f.originalName || f.filename || "").toLowerCase().indexOf(q) !== -1
        );
      });
    }
    return files;
  };

  FB.mediaGallery._render = function () {
    var container = document.getElementById("media-library");
    if (!container) return;
    var html = "";

    if (FB.mediaGallery._pickMode) {
      html +=
        '<div style="background:#6366f1;color:#fff;padding:5px 10px;font-size:10px;display:flex;justify-content:space-between;align-items:center">' +
        "<span>Click image to insert · prop: " +
        FB.mediaGallery._pickMode.propKey +
        "</span>" +
        '<button onclick="FB.mediaGallery._cancelPick()" style="background:none;border:none;color:#fff;cursor:pointer;font-size:12px;padding:0 4px">✕</button>' +
        "</div>";
    }

    html +=
      '<div style="padding:6px 8px 3px;display:flex;gap:4px">' +
      '<input id="mg-search" type="text" placeholder="Search images…" value="' +
      (FB.mediaGallery._query || "") +
      '" oninput="FB.mediaGallery._search(this.value)" ' +
      'style="flex:1;background:#111;border:1px solid #333;border-radius:4px;color:#ccc;font-size:10px;padding:3px 7px;height:24px">' +
      '<button onclick="document.getElementById(\'mg-file-input\').click()" title="Upload image" ' +
      'style="background:#222;border:1px solid #333;border-radius:4px;width:24px;height:24px;cursor:pointer;font-size:11px;color:#aaa">↑</button>' +
      '<input id="mg-file-input" type="file" accept="image/*" style="display:none" onchange="FB.mediaGallery._upload(this.files[0])">' +
      "</div>";

    var folders = FB.mediaGallery._folders;
    html +=
      '<div style="padding:3px 8px 5px;display:flex;gap:3px;flex-wrap:wrap">';
    html +=
      '<span onclick="FB.mediaGallery._setFolder(null)" style="cursor:pointer;padding:2px 8px;border-radius:10px;font-size:9px;' +
      (FB.mediaGallery._activeFolder === null
        ? "background:#6366f1;color:#fff;font-weight:600"
        : "background:#222;color:#666") +
      '">All</span>';
    folders.forEach(function (f) {
      html +=
        "<span onclick=\"FB.mediaGallery._setFolder('" +
        f.replace(/'/g, "\\'") +
        '\')" style="cursor:pointer;padding:2px 8px;border-radius:10px;font-size:9px;' +
        (FB.mediaGallery._activeFolder === f
          ? "background:#6366f1;color:#fff;font-weight:600"
          : "background:#222;color:#666") +
        '">' +
        f +
        "</span>";
    });
    html +=
      '<span onclick="FB.mediaGallery._promptFolder()" ' +
      'style="cursor:pointer;padding:2px 7px;border-radius:10px;font-size:9px;background:#1a1a1a;border:1px dashed #333;color:#444">+ folder</span>';
    html += "</div>";

    var filtered = FB.mediaGallery._filtered();
    if (filtered.length === 0) {
      html +=
        '<div style="padding:12px 8px;font-size:10px;color:#444;text-align:center">No images yet — upload or import from URL below.</div>';
    } else {
      html +=
        '<div style="padding:0 8px;display:grid;grid-template-columns:repeat(4,1fr);gap:3px">';
      filtered.forEach(function (file) {
        var isPick = !!FB.mediaGallery._pickMode;
        html +=
          '<div style="position:relative;aspect-ratio:1;border-radius:3px;overflow:hidden;cursor:pointer;background:#222" ' +
          "onclick=\"FB.mediaGallery._clickImage('" +
          file.id +
          "','" +
          file.url.replace(/'/g, "\\'") +
          '\')" title="' +
          (file.originalName || file.filename) +
          '">' +
          '<img src="' +
          file.url +
          '" style="width:100%;height:100%;object-fit:cover" loading="lazy">' +
          '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.6);opacity:0;transition:opacity 0.15s;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px" ' +
          'onmouseenter="this.style.opacity=1" onmouseleave="this.style.opacity=0">' +
          (isPick
            ? '<span style="font-size:18px;color:#fff">✓</span>'
            : '<span style="font-size:10px;color:#fff">📋</span>') +
          "<button onclick=\"event.stopPropagation();FB.mediaGallery._assignFolder('" +
          file.id +
          '\')" style="font-size:8px;background:#333;border:none;color:#ccc;padding:1px 4px;border-radius:2px;cursor:pointer">folder</button>' +
          "<button onclick=\"event.stopPropagation();FB.mediaGallery._delete('" +
          file.id +
          '\')" style="font-size:8px;background:#6b2020;border:none;color:#fca5a5;padding:1px 4px;border-radius:2px;cursor:pointer">✕</button>' +
          "</div>" +
          "</div>";
      });
      html += "</div>";
      html +=
        '<div style="padding:3px 8px 4px;font-size:9px;color:#444;text-align:right">' +
        filtered.length +
        " image" +
        (filtered.length !== 1 ? "s" : "") +
        " · click = copy URL</div>";
    }

    html += '<div style="padding:5px 8px;border-top:1px solid #222">';
    html +=
      '<div style="font-size:8px;color:#555;font-weight:600;letter-spacing:0.4px;text-transform:uppercase;margin-bottom:4px">Import from URL</div>';
    html += '<div style="display:flex;gap:3px">';
    html +=
      '<input id="mg-url-input" type="text" placeholder="https://…" ' +
      'style="flex:1;background:#111;border:1px solid #333;border-radius:3px;color:#ccc;font-size:9px;padding:2px 6px;height:20px">';
    html +=
      '<button onclick="FB.mediaGallery._importFromInput()" title="Download to library" ' +
      'style="background:#6366f1;border:none;border-radius:3px;width:28px;height:20px;cursor:pointer;font-size:10px;color:#fff">↓</button>';
    html += "</div></div>";

    var sources = [
      {
        label: "Unsplash",
        url: "https://unsplash.com",
        color: "#60a5fa",
        bg: "#1e3a5f",
      },
      {
        label: "Pexels",
        url: "https://www.pexels.com",
        color: "#c084fc",
        bg: "#2d1b4e",
      },
      {
        label: "Pixabay",
        url: "https://pixabay.com",
        color: "#86efac",
        bg: "#1a2e1a",
      },
      {
        label: "Freepik",
        url: "https://www.freepik.com/free-photos-vectors/stock-image",
        color: "#fb923c",
        bg: "#2a1e1a",
      },
      {
        label: "StockSnap",
        url: "https://stocksnap.io",
        color: "#2dd4bf",
        bg: "#1a2a2a",
      },
    ];
    html += '<div style="padding:5px 8px 8px;border-top:1px solid #222">';
    html +=
      '<div style="font-size:8px;color:#555;font-weight:600;letter-spacing:0.4px;text-transform:uppercase;margin-bottom:4px">Free Image Sources</div>';
    sources.forEach(function (s) {
      html +=
        '<a href="' +
        s.url +
        '" target="_blank" rel="noopener" style="display:flex;justify-content:space-between;align-items:center;padding:4px 8px;border-radius:3px;margin-bottom:3px;background:' +
        s.bg +
        ";color:" +
        s.color +
        ';font-size:9px;text-decoration:none"><span>' +
        s.label +
        '</span><span style="opacity:0.5">↗</span></a>';
    });
    html += "</div>";

    container.innerHTML = html;
  };

  FB.mediaGallery._clickImage = function (id, url) {
    if (FB.mediaGallery._pickMode) {
      var mode = FB.mediaGallery._pickMode;
      FB.panels.updateProp(mode.blockId, mode.propKey, url);
      FB.mediaGallery._pickMode = null;
      FB.mediaGallery._render();
      FB.util.showToast("🖼 Image inserted");
    } else {
      FB.mediaGallery._copyUrl(url);
    }
  };

  FB.mediaGallery._cancelPick = function () {
    FB.mediaGallery._pickMode = null;
    FB.mediaGallery._render();
  };

  FB.mediaGallery._copyUrl = function (url) {
    navigator.clipboard.writeText(url).then(function () {
      FB.util.showToast("📋 URL copied");
    });
  };

  FB.mediaGallery._setFolder = function (name) {
    FB.mediaGallery._activeFolder = name;
    FB.mediaGallery._render();
  };

  FB.mediaGallery._search = function (query) {
    FB.mediaGallery._query = query;
    FB.mediaGallery._render();
  };

  FB.mediaGallery._upload = function (file) {
    if (!file) return;
    var formData = new FormData();
    formData.append("file", file);
    FB.util.showToast("⏳ Uploading…");
    fetch("/api/cms/media/upload", { method: "POST", body: formData })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        if (data.success) {
          FB.util.showToast(
            "🖼 Uploaded: " + (data.media.filename || file.name),
          );
          FB.mediaGallery.refresh();
        } else {
          FB.util.showToast("❌ Upload failed");
        }
      })
      .catch(function () {
        FB.util.showToast("❌ Upload failed");
      });
  };

  FB.mediaGallery._importFromInput = function () {
    var inp = document.getElementById("mg-url-input");
    if (!inp) return;
    var url = inp.value.trim();
    if (!url) return;
    FB.mediaGallery._importUrl(url);
    inp.value = "";
  };

  FB.mediaGallery._importUrl = function (url) {
    FB.util.showToast("⏳ Downloading…");
    fetch("/api/cms/media/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url }),
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        if (data.success) {
          FB.util.showToast(
            "🖼 Imported: " + (data.media.originalName || "image"),
          );
          FB.mediaGallery.refresh();
        } else {
          FB.util.showToast(
            "❌ Import failed: " + (data.error || "unknown error"),
          );
        }
      })
      .catch(function () {
        FB.util.showToast("❌ Import failed");
      });
  };

  FB.mediaGallery._delete = function (id) {
    if (!confirm("Delete this image? This cannot be undone.")) return;
    fetch("/api/cms/media/" + encodeURIComponent(id), { method: "DELETE" })
      .then(function () {
        FB.mediaGallery.refresh();
      })
      .catch(function () {
        FB.util.showToast("❌ Delete failed");
      });
  };

  FB.mediaGallery._setMeta = function (id, patch) {
    fetch("/api/cms/media/" + encodeURIComponent(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
      .then(function () {
        FB.mediaGallery.refresh();
      })
      .catch(function () {
        FB.util.showToast("❌ Metadata update failed");
      });
  };

  FB.mediaGallery._assignFolder = function (id) {
    var folders = FB.mediaGallery._folders;
    if (!folders.length) {
      FB.util.showToast('Create a folder first using "+ folder"');
      return;
    }
    var folderName = prompt(
      "Move to folder:\n" + folders.join(", ") + "\n(leave blank to unfile)",
    );
    if (folderName === null) return;
    var target = folderName.trim() || null;
    if (target && folders.indexOf(target) === -1) {
      FB.util.showToast('Folder "' + target + '" does not exist');
      return;
    }
    FB.mediaGallery._setMeta(id, { folder: target });
  };

  FB.mediaGallery._createFolder = function (name) {
    fetch("/api/cms/media/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name }),
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (data) {
        if (data.success) {
          FB.mediaGallery.refresh();
        } else {
          FB.util.showToast("❌ " + (data.error || "Could not create folder"));
        }
      })
      .catch(function () {
        FB.util.showToast("❌ Folder creation failed");
      });
  };

  FB.mediaGallery._promptFolder = function () {
    var name = prompt("New folder name:");
    if (!name || !name.trim()) return;
    FB.mediaGallery._createFolder(name.trim());
  };
  ```

- [ ] **Step 2: Verify file was created**

  ```bash
  wc -l /home/shauntuhey/Framework/js/media-gallery.js
  node --input-type=module < /home/shauntuhey/Framework/js/media-gallery.js 2>&1 | head -5 || true
  ```

  Expected: line count > 50, no obvious parse errors reported (the module uses `FB.*` globals so runtime errors are expected — only look for syntax errors like `SyntaxError`).

- [ ] **Step 3: Commit**

  ```bash
  git add js/media-gallery.js
  git commit -m "feat: add media-gallery.js — full FB.mediaGallery module"
  ```

---

## Task 6: Right panel — 📁 pick button for image URL inputs

**Files:**

- Modify: `js/panels.js:2619`

- [ ] **Step 1: Add `FB.panels._injectMediaButtons` helper**

  In `js/panels.js`, add this function after `FB.panels.updateProp` (after line ~2629):

  ```js
  FB.panels._injectMediaButtons = function (rp) {
    if (!rp) return;
    var IMAGE_PATTERN = /image|img|photo|avatar|thumb|cover|background|bg/i;
    var EXACT_KEYS = ["embedUrl", "imageSrc", "imageUrl"];
    var EXCLUDE = /video|iframe|link|href|color/i;
    rp.querySelectorAll("input[onchange]").forEach(function (inp) {
      if (
        inp.type === "number" ||
        inp.type === "checkbox" ||
        inp.type === "file"
      )
        return;
      var onchange = inp.getAttribute("onchange") || "";
      var keyMatch = onchange.match(/update(?:Widget)?Prop\([^,]+,'([^']+)'/);
      if (!keyMatch) return;
      var propKey = keyMatch[1];
      if (EXCLUDE.test(propKey)) return;
      if (!IMAGE_PATTERN.test(propKey) && EXACT_KEYS.indexOf(propKey) === -1)
        return;
      if (
        inp.nextElementSibling &&
        inp.nextElementSibling.classList.contains("mg-pick-btn")
      )
        return;
      var idMatch = onchange.match(/update(?:Widget)?Prop\('([^']+)'/);
      if (!idMatch) return;
      var blockId = idMatch[1];
      var btn = document.createElement("button");
      btn.className = "mg-pick-btn";
      btn.title = "Choose from library";
      btn.textContent = "📁";
      btn.style.cssText =
        "background:#222;border:1px solid #333;border-radius:3px;width:22px;height:24px;" +
        "cursor:pointer;font-size:11px;color:#888;flex-shrink:0;margin-left:3px";
      btn.onclick = (function (bid, pkey) {
        return function () {
          FB.mediaGallery.pickFor(bid, pkey);
        };
      })(blockId, propKey);
      inp.parentNode.style.display = "flex";
      inp.parentNode.style.alignItems = "center";
      inp.style.flex = "1";
      inp.parentNode.insertBefore(btn, inp.nextSibling);
    });
  };
  ```

- [ ] **Step 2: Call `_injectMediaButtons` at end of `renderRightPanel`**

  Find line 2619 in `js/panels.js`:

  ```js
    rp.innerHTML = html;
  };
  ```

  Change to:

  ```js
    rp.innerHTML = html;
    if (FB.mediaGallery) FB.panels._injectMediaButtons(rp);
  };
  ```

- [ ] **Step 3: Verify no syntax errors**

  ```bash
  node --input-type=module --eval "
  const fs = require('fs');
  // Just check syntax via a quick parse attempt
  " 2>&1 || true
  grep -c "mg-pick-btn\|_injectMediaButtons" /home/shauntuhey/Framework/js/panels.js
  ```

  Expected: grep returns `2` (one definition, one call site).

- [ ] **Step 4: Commit**

  ```bash
  git add js/panels.js
  git commit -m "feat(panels): inject 📁 media pick button into image URL prop inputs"
  ```

---

## Task 7: Manual integration test

No automated test framework exists. Test the full feature in the browser.

- [ ] **Step 1: Start the server and open the builder**

  ```bash
  cd /home/shauntuhey/Framework && python3 server.py &
  ```

  Open `http://localhost:8899/framework-builder.html` in the browser.

- [ ] **Step 2: Verify Media accordion appears**

  In the left panel, confirm "Media" accordion appears between Layers and Sections. Open it.

  Expected: panel shows "No images yet", URL import section, and free source links (Unsplash etc.).

- [ ] **Step 3: Test file upload**

  Click the ↑ button in the Media panel. Select any image file from disk.

  Expected: toast "⏳ Uploading…" followed by "🖼 Uploaded: …". Image thumbnail appears in the 4-col grid.

- [ ] **Step 4: Test URL import**

  In the "Import from URL" input, paste `https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Bitten_apple.svg/800px-Bitten_apple.svg.png` and click ↓.

  Expected: toast "⏳ Downloading…" followed by "🖼 Imported: …". New thumbnail appears.

- [ ] **Step 5: Test copy URL**

  Click any image thumbnail.

  Expected: toast "📋 URL copied". Pasting clipboard should give `/media/xxxxxxxx.jpg` (or similar).

- [ ] **Step 6: Test folder create + assign**

  Click "+ folder", type "Heroes", press OK.

  Expected: "Heroes" pill appears in folder bar.

  Click an image's "folder" button (visible on hover), type "Heroes" when prompted.

  Expected: image disappears from "All" view when "Heroes" folder pill is active (click it to filter).

- [ ] **Step 7: Test search**

  Type part of an uploaded filename in the search box.

  Expected: grid filters to matching images only; count label updates.

- [ ] **Step 8: Test pick mode from right panel**

  Add a Hero block to the canvas. Select it. In the right panel, find the "Image URL" input — it should have a 📁 button next to it.

  Click 📁. In the Media panel, a blue banner appears: "Click image to insert · prop: imageUrl". Click a thumbnail.

  Expected: toast "🖼 Image inserted", banner disappears, Hero block updates with the new image URL.

- [ ] **Step 9: Test delete**

  Hover a thumbnail, click ✕. Confirm the prompt.

  Expected: image removed from grid and file deleted from `media/` folder.

  ```bash
  ls /home/shauntuhey/Framework/media/
  cat /home/shauntuhey/Framework/media/media-meta.json
  ```

  Confirm the deleted file is no longer listed.

- [ ] **Step 10: Final commit**

  ```bash
  kill %1  # stop test server
  git status
  ```

  If any files were inadvertently modified during testing (e.g., media-meta.json):

  ```bash
  git checkout -- media/  # reset test artifacts if needed
  ```
