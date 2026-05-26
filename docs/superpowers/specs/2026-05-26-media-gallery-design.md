# Media Gallery — Design Spec

**Date:** 2026-05-26
**Status:** Approved

## Overview

A persistent media library built into the Framework Builder left panel. Users can upload images from disk, import by URL (server fetches and stores locally), organise into folders, search, and insert images into canvas blocks. Curated links to free image sources (Unsplash, Pexels, Pixabay, Freepik, StockSnap) are surfaced in the panel for resource discovery.

## Decisions

| Topic           | Decision                                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| Location        | Left panel accordion ("Media"), between Layers and Sections                                                       |
| Free sources    | Curated links (open in new tab) + URL import (server downloads)                                                   |
| Click behaviour | Click image → copy `/media/filename` URL to clipboard. Right panel image props get a 📁 button → pick-mode insert |
| Organisation    | Folders + client-side search/filter — vital for usability                                                         |
| Architecture    | Patch existing `/api/cms/media/*` endpoints (strip auth, enrich list response) + 3 new routes                     |

---

## 1. Data Model

**File:** `media/media-meta.json`

```json
{
  "folders": ["Backgrounds", "Heroes", "Logos", "Textures"],
  "files": {
    "abc12345.jpg": {
      "originalName": "sunset-beach.jpg",
      "folder": "Backgrounds",
      "tags": [],
      "addedAt": "2026-05-26T10:00:00Z"
    }
  }
}
```

- The `media/` directory is shared with the CMS — files are compatible between both systems.
- `media-meta.json` is builder-only; CMS ignores it.
- An entry in `files` is keyed by the server-generated filename (UUID prefix + extension).
- `folder` is a string matching one of the `folders` array entries, or `null` for unfiled.
- `tags` is reserved for future use (empty array for now).

---

## 2. Server Changes (`server.py`)

### 2a. Strip auth from existing handlers

Remove `_cms_require_auth()` guard from:

- `_handle_cms_media_upload`
- `_handle_cms_media_delete`

`_handle_cms_media_list` is already unauth'd in the current code — no change needed there. The CMS admin UI already sends auth headers on upload/delete calls; removing the server-side check has no impact on CMS operation.

### 2b. Enrich list response

`_handle_cms_media_list` currently returns `{media: [{id, filename, size, url}]}`.

Updated response:

```json
{
  "folders": ["Backgrounds", "Heroes"],
  "media": [
    {
      "id": "abc12345.jpg",
      "filename": "abc12345.jpg",
      "originalName": "sunset-beach.jpg",
      "size": 204800,
      "url": "/media/abc12345.jpg",
      "folder": "Backgrounds",
      "tags": [],
      "addedAt": "2026-05-26T10:00:00Z"
    }
  ]
}
```

### 2c. New routes

**`POST /api/cms/media/download`** — `_handle_cms_media_download`

- Request body: `{"url": "https://…"}`
- Fetches the URL using `urllib.request.urlopen` with a 10s timeout
- Validates Content-Type starts with `image/`
- Derives extension from Content-Type (jpg/png/webp/gif)
- Saves with UUID-prefix filename to `media/`
- Adds entry to `media-meta.json` with `originalName` derived from URL path
- Response: `{"success": true, "media": {id, url, originalName}}`
- Error cases: non-image URL (400), fetch failure (400), URL not reachable (400)

**`PATCH /api/cms/media/:id`** — `_handle_cms_media_meta_update`

- Request body: `{"folder": "Backgrounds"}` (any subset of `{folder, tags, originalName}`)
- Reads `media-meta.json`, merges patch for the given id, writes back
- Response: `{"success": true}`
- Error: file id not found in meta (404)

**`POST /api/cms/media/folders`** — `_handle_cms_media_folders_create`

- Request body: `{"name": "My Folder"}`
- Validates name is non-empty string, not duplicate
- Appends to `folders` array in `media-meta.json`
- Response: `{"success": true, "folders": […updated list…]}`

### 2d. Shared helpers

```python
def _read_media_meta(self):
    # Returns dict with "folders" and "files" keys; creates file if missing

def _write_media_meta(self, meta):
    # Atomically writes media-meta.json
```

Route dispatch additions to `do_GET`, `do_POST`, `do_DELETE`, `do_PATCH` (new method override).

---

## 3. JS Module (`js/media-gallery.js`)

**Namespace:** `FB.mediaGallery`

### State

```js
FB.mediaGallery._files = []; // enriched list from server
FB.mediaGallery._folders = []; // folder name strings
FB.mediaGallery._activeFolder = null; // null = show all
FB.mediaGallery._query = "";
FB.mediaGallery._pickMode = null; // {blockId, propKey} or null
```

### Public API

| Function                    | Description                                                                                                        |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `init()`                    | Called from `FB.init()`. Fetches library, renders into `#media-library`.                                           |
| `refresh()`                 | Re-fetches from server and re-renders.                                                                             |
| `pickFor(blockId, propKey)` | Enters pick mode. Next image click calls `FB.panels.updateWidgetProp(blockId, propKey, url)` then exits pick mode. |

### Internal functions

| Function              | Description                                                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `_fetch()`            | GET `/api/cms/media`, populates `_files` / `_folders`, calls `_render()`.                                                  |
| `_render()`           | Builds full panel HTML into `#media-library`: search bar, folder pills, filtered image grid, URL import row, source links. |
| `_filtered()`         | Returns `_files` filtered by `_activeFolder` (if set) and `_query` (filename substring match).                             |
| `_upload(file)`       | POST multipart to `/api/cms/media/upload`, then `refresh()`.                                                               |
| `_importUrl(url)`     | POST `{url}` to `/api/cms/media/download`, then `refresh()`.                                                               |
| `_delete(id)`         | Confirm dialog → DELETE `/api/cms/media/:id` → `refresh()`.                                                                |
| `_setMeta(id, patch)` | PATCH `/api/cms/media/:id`, then `refresh()`.                                                                              |
| `_createFolder(name)` | POST `/api/cms/media/folders`, then `refresh()`.                                                                           |
| `_copyUrl(url)`       | `navigator.clipboard.writeText(url)` + `FB.util.showToast("📋 URL copied")`.                                               |
| `_setFolder(name)`    | Sets `_activeFolder`, calls `_render()` (no server call — filtering is client-side).                                       |
| `_search(query)`      | Sets `_query`, calls `_render()` (client-side).                                                                            |

### Rendered panel structure

```
[ Search input          ] [ ↑ Upload btn ]
[ All ] [ Backgrounds ] [ Heroes ] [ + folder ]
┌─────────────────────────────────────────┐
│  img  img  img  img  img  img  img  img  │  ← 4-col grid
│  img  img  img  img  img  img  img  img  │
└─────────────────────────────────────────┘
  N images · click = copy URL

── Import from URL ──────────────────────
[ https://…                          ] [↓]

── Free Image Sources ───────────────────
  Unsplash ↗   Pexels ↗   Pixabay ↗
  Freepik ↗    StockSnap ↗
```

Each image in the grid:

- Click → `_copyUrl(file.url)` (default behaviour)
- In pick mode → `FB.panels.updateWidgetProp(blockId, propKey, file.url)` + exit pick mode + `showToast`
- Right-click / long-hover shows folder assign and delete controls (rendered via a small inline popover)

Pick mode banner appears at top of panel: `"Click image to insert · ✕ cancel"`

---

## 4. HTML Changes (`framework-builder.html`)

New accordion inserted between Layers and Sections:

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

---

## 5. Right Panel Integration (`panels.js`)

When rendering an input for a block prop whose key matches the image prop pattern — any key containing `image`, `img`, `photo`, `avatar`, `thumb`, `cover`, `background`, `bg`, or `embedUrl`/`imageSrc`/`imageUrl` exactly — append a `📁` icon button next to the text input. Keys containing `video`, `iframe`, `link`, `href`, or `color` are excluded even if they also match a shorter pattern.

```html
<button
  onclick="FB.mediaGallery.pickFor('BLOCK_ID', 'PROP_KEY')"
  title="Choose from library"
>
  📁
</button>
```

This applies to both `BLOCK_DEFS` prop inputs and widget prop inputs rendered in the right panel.

---

## 6. Module Registration

**`src/main.js`** — add after `project.js` import:

```js
import "../js/media-gallery.js";
```

**`js/app.js`** — add to `FB.init()`:

```js
if (FB.mediaGallery && FB.mediaGallery.init) FB.mediaGallery.init();
```

---

## 7. Out of Scope

- Tag UI (tags field stored in meta but not exposed in UI — reserved for a future pass)
- Drag-from-panel-to-canvas (covered by copy URL + paste; drag is a future enhancement)
- Image search via Unsplash/Pexels APIs (source links only for now — no API keys required)
- Image resizing or optimisation on upload
