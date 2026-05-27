# Pages System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full Pages system — enhanced tab bar with a Manage modal (two-column list + settings), per-page SEO metadata with AI auto-generation, a template picker for new pages, and export integration.

**Architecture:** New `js/pages-manager.js` module (`FB.pagesManager` namespace) owns the modal UI. `FB.pages` remains the state/data layer. `css/pages-manager.css` holds all new styles. A new `POST /api/ai-seo` server route generates SEO copy from page content.

**Tech Stack:** Vanilla JS (ES modules via Vite/`src/main.js`), Python HTTP server (`server.py`), Gemini/OpenAI AI providers (existing `_call_gemini`/`_call_openai` helpers), HTML5 drag events for reorder.

---

## File Map

| File                     | Action | Role                                                                        |
| ------------------------ | ------ | --------------------------------------------------------------------------- |
| `js/export.js`           | Modify | Support per-page SEO field overrides in `generateMetaTags` + `generateHTML` |
| `js/pages.js`            | Modify | Add Manage button to `render()`                                             |
| `js/media-gallery.js`    | Modify | Add `pickWithCallback(fn)` for OG image picker                              |
| `css/pages-manager.css`  | Create | All modal styles                                                            |
| `js/pages-manager.js`    | Create | Full modal UI — list, settings, drag, template picker, AI SEO               |
| `src/main.js`            | Modify | Import `pages-manager.js`                                                   |
| `framework-builder.html` | Modify | Link `pages-manager.css`                                                    |
| `server.py`              | Modify | Add `POST /api/ai-seo` route                                                |

---

## Task 1: Export — per-page SEO field support

**Files:**

- Modify: `js/export.js:78-146` (`generateMetaTags`)
- Modify: `js/export.js:455` (`generateHTML` — after `_getSeoSettings()` call)

- [ ] **Step 1: Update `generateMetaTags` in `js/export.js`**

Replace the entire `FB.export.generateMetaTags` function (lines 78–146) with the version below. Key changes: (a) `seo._titleOverride`/`seo._descOverride` skip hero block auto-generation; (b) `seo._ogTitleOverride`/`seo._ogDescOverride` control `og:title`/`og:description` and Twitter equivalents independently:

```js
FB.export.generateMetaTags = function (seo) {
  seo = seo || {};
  var pageState = FB.state.page || {};
  var title = seo.siteName || "My Site";
  var description =
    seo.siteDescription || "A website built with Framework Builder";
  if (pageState.title) title = pageState.title;
  if (pageState.description) description = pageState.description;
  var hasPageTitle = !!seo._titleOverride;
  var hasPageDesc = !!seo._descOverride;
  if (seo._titleOverride) title = seo._titleOverride;
  if (seo._descOverride) description = seo._descOverride;
  var url = seo.canonicalUrl || window.location.href;
  var image = seo.ogImage || "";
  var locale = seo.locale || "en_GB";
  var robots = seo.robots || "index, follow, max-image-preview:large";
  var themeColor = seo.themeColor || "#111111";
  var googleVerification = seo.googleVerification || "";
  var twitterHandle = seo.twitterHandle || "";
  if (!hasPageTitle || !hasPageDesc) {
    FB.state.blocks.forEach(function (b) {
      if (
        !hasPageTitle &&
        (b.type === "hero" ||
          b.type === "videoHero" ||
          b.type === "splitHero") &&
        b.props.headline
      ) {
        title = seo.siteName
          ? seo.siteName +
            " — " +
            b.props.headline.replace(/<[^>]*>/g, "").substring(0, 60)
          : b.props.headline.replace(/<[^>]*>/g, "").substring(0, 60);
      }
      if (
        !hasPageDesc &&
        (b.type === "hero" ||
          b.type === "videoHero" ||
          b.type === "splitHero") &&
        b.props.subtext
      ) {
        description = b.props.subtext.substring(0, 160);
      }
    });
  }
  var ogTitle = seo._ogTitleOverride || title;
  var ogDesc = seo._ogDescOverride || description;
  var tags = "";
  tags += "<title>" + title + "</title>\n";
  tags += '<meta name="description" content="' + description + '">\n';
  tags += '<meta name="robots" content="' + robots + '">\n';
  tags += '<meta name="theme-color" content="' + themeColor + '">\n';
  if (googleVerification) {
    tags +=
      '<meta name="google-site-verification" content="' +
      googleVerification +
      '">\n';
  }
  tags += '<meta property="og:type" content="website">\n';
  tags += '<meta property="og:locale" content="' + locale + '">\n';
  tags += '<meta property="og:url" content="' + url + '">\n';
  tags += '<meta property="og:title" content="' + ogTitle + '">\n';
  tags += '<meta property="og:description" content="' + ogDesc + '">\n';
  if (image) {
    tags += '<meta property="og:image" content="' + image + '">\n';
    tags += '<meta property="og:image:width" content="1200">\n';
    tags += '<meta property="og:image:height" content="630">\n';
    tags += '<meta property="og:image:alt" content="' + ogTitle + '">\n';
  }
  tags += '<meta name="twitter:card" content="summary_large_image">\n';
  tags += '<meta name="twitter:title" content="' + ogTitle + '">\n';
  tags += '<meta name="twitter:description" content="' + ogDesc + '">\n';
  if (image) {
    tags += '<meta name="twitter:image" content="' + image + '">\n';
  }
  if (twitterHandle) {
    tags += '<meta name="twitter:site" content="' + twitterHandle + '">\n';
  }
  tags += '<link rel="canonical" href="' + url + '">\n';
  if (pageState.favicon)
    tags += '<link rel="icon" href="' + pageState.favicon + '">\n';
  return tags;
};
```

- [ ] **Step 2: Overlay current page SEO fields in `generateHTML`**

In `js/export.js`, find the line `var seo = FB.export._getSeoSettings();` (around line 455) inside `FB.export.generateHTML`. Add the overlay block immediately after it:

```js
var seo = FB.export._getSeoSettings();
// Per-page SEO overrides
var curPage = FB.pages.current();
if (curPage) {
  if (curPage.title) seo._titleOverride = curPage.title;
  if (curPage.metaDesc) seo._descOverride = curPage.metaDesc;
  if (curPage.ogTitle) seo._ogTitleOverride = curPage.ogTitle;
  if (curPage.ogDesc) seo._ogDescOverride = curPage.ogDesc;
  if (curPage.ogImage) seo.ogImage = curPage.ogImage;
  seo.canonicalUrl = "/" + (curPage.slug === "index" ? "" : curPage.slug);
}
```

- [ ] **Step 3: Manual verification**

Open the builder, add a page, set a title and meta desc via browser console:

```js
FB.pages.current().title = "Test Page | My Site";
FB.pages.current().metaDesc = "A test page description.";
```

Then open Export → Preview HTML. Verify the `<title>` and `<meta name="description">` tags reflect the values you set. Verify the canonical URL shows the page slug.

- [ ] **Step 4: Commit**

```bash
git add js/export.js
git commit -m "feat: support per-page SEO fields in export (title, metaDesc, ogTitle, ogDesc, ogImage)"
```

---

## Task 2: Tab bar — Manage button + wire-up

**Files:**

- Modify: `js/pages.js` (`render` function, around line 126)
- Modify: `src/main.js`
- Modify: `framework-builder.html`

- [ ] **Step 1: Add Manage button to `FB.pages.render()` in `js/pages.js`**

In `FB.pages.render`, find the line that assigns `bar.innerHTML = html` (around line 158). Just before that assignment, append the Manage button to `html`:

```js
html +=
  '<button class="page-tabs-manage-btn" onclick="FB.pagesManager.open()" title="Manage pages">Manage</button>';
bar.innerHTML = html;
```

- [ ] **Step 2: Add import to `src/main.js`**

Open `src/main.js`. After line `import "../js/pages.js";` (line 7), add:

```js
import "../js/pages-manager.js";
```

- [ ] **Step 3: Add CSS link to `framework-builder.html`**

Open `framework-builder.html`. After line 16 (`<link rel="stylesheet" href="css/canvas.css?v=2" />`), add:

```html
<link rel="stylesheet" href="css/pages-manager.css" />
```

- [ ] **Step 4: Create stub `js/pages-manager.js` so the import doesn't error**

Create `js/pages-manager.js` with just the namespace declaration:

```js
FB.pagesManager = {};

FB.pagesManager.open = function () {
  console.log("pagesManager.open() — not yet implemented");
};
```

- [ ] **Step 5: Start dev server and verify no errors**

```bash
npm run dev
```

Open `http://localhost:5173`. Open browser console — no errors. The page tabs bar should show a "Manage" button. Clicking it logs the stub message.

- [ ] **Step 6: Commit**

```bash
git add js/pages.js src/main.js framework-builder.html js/pages-manager.js
git commit -m "feat: add Manage button to page tabs bar, wire pages-manager module"
```

---

## Task 3: Media gallery — callback pick mode

**Files:**

- Modify: `js/media-gallery.js`

The existing `pickFor(blockId, propKey)` sets `_pickMode = { blockId, propKey }` and `_clickImage` calls `FB.panels.updateProp`. We need a second variant that accepts a callback function, used when picking the OG image from the pages manager.

- [ ] **Step 1: Add `pickWithCallback` method**

In `js/media-gallery.js`, after the `FB.mediaGallery.pickFor` function (around line 20), add:

```js
FB.mediaGallery.pickWithCallback = function (fn) {
  FB.mediaGallery._pickMode = { callback: fn };
  FB.mediaGallery._render();
};
```

- [ ] **Step 2: Update `_clickImage` to handle callback mode**

Find `FB.mediaGallery._clickImage` (around line 219). Replace it entirely:

```js
FB.mediaGallery._clickImage = function (id, url) {
  if (FB.mediaGallery._pickMode) {
    var mode = FB.mediaGallery._pickMode;
    FB.mediaGallery._pickMode = null;
    if (mode.callback) {
      mode.callback(url);
    } else {
      FB.panels.updateProp(mode.blockId, mode.propKey, url);
      if (FB.panels.renderRightPanel) FB.panels.renderRightPanel();
    }
    FB.mediaGallery._render();
    FB.util.showToast("Image inserted");
  } else {
    FB.mediaGallery._copyUrl(url);
  }
};
```

- [ ] **Step 3: Update pick-mode banner for callback mode**

In `FB.mediaGallery._render` (around line 64), find the pick-mode banner block:

```js
if (FB.mediaGallery._pickMode) {
  html +=
    '<div style="background:#6366f1;color:#fff;padding:5px 10px;font-size:10px;display:flex;justify-content:space-between;align-items:center">' +
    "<span>Click image to insert · prop: " +
    FB.mediaGallery._pickMode.propKey +
    "</span>" +
```

Replace it with:

```js
if (FB.mediaGallery._pickMode) {
  var modeLabel = FB.mediaGallery._pickMode.propKey || "image";
  html +=
    '<div style="background:#6366f1;color:#fff;padding:5px 10px;font-size:10px;display:flex;justify-content:space-between;align-items:center">' +
    "<span>Click image to insert · " + modeLabel + "</span>" +
```

- [ ] **Step 4: Manual verification**

In browser console:

```js
FB.mediaGallery.pickWithCallback(function (url) {
  console.log("Got URL:", url);
});
```

Open the Media panel — you should see the blue pick-mode banner. Click an image — the console should log the URL and the banner should disappear.

- [ ] **Step 5: Commit**

```bash
git add js/media-gallery.js
git commit -m "feat: add pickWithCallback to media gallery for OG image selection"
```

---

## Task 4: CSS — pages-manager.css

**Files:**

- Create: `css/pages-manager.css`

- [ ] **Step 1: Create `css/pages-manager.css`**

```css
/* Pages Manager Modal */
#pages-manager-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  z-index: 10000;
  align-items: center;
  justify-content: center;
}
#pages-manager-overlay.open {
  display: flex;
}
.pm-panel {
  width: 800px;
  max-width: 96vw;
  height: 560px;
  max-height: 90vh;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
.pm-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #2a2a2a;
  font-size: 13px;
  font-weight: 600;
  color: #f7f6f2;
  flex-shrink: 0;
}
.pm-close-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  line-height: 1;
}
.pm-close-btn:hover {
  color: #fff;
}
.pm-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
/* Left column — page list */
.pm-list {
  width: 220px;
  flex-shrink: 0;
  border-right: 1px solid #2a2a2a;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.pm-list-rows {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}
.pm-list-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 8px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 12px;
  color: #aaa;
  border: 1px solid transparent;
  user-select: none;
}
.pm-list-row:hover {
  background: #222;
  color: #ddd;
}
.pm-list-row.active {
  background: #1e2210;
  border-color: #cdfe00;
  color: #fff;
}
.pm-list-row.drag-over {
  border-color: #cdfe00;
  border-style: dashed;
}
.pm-list-row.dragging {
  opacity: 0.4;
}
.pm-drag-handle {
  color: #444;
  font-size: 11px;
  cursor: grab;
  flex-shrink: 0;
  line-height: 1;
}
.pm-row-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pm-row-count {
  font-size: 9px;
  color: #555;
  flex-shrink: 0;
}
.pm-row-del {
  background: none;
  border: none;
  color: #444;
  cursor: pointer;
  font-size: 13px;
  padding: 0 2px;
  flex-shrink: 0;
  line-height: 1;
}
.pm-row-del:hover {
  color: #e55;
}
.pm-add-btn {
  margin: 8px;
  padding: 6px 10px;
  background: none;
  border: 1px dashed #333;
  border-radius: 5px;
  color: #555;
  font-size: 11px;
  cursor: pointer;
  text-align: center;
  flex-shrink: 0;
}
.pm-add-btn:hover {
  border-color: #555;
  color: #aaa;
}
/* Right column — settings panel */
.pm-settings {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}
.pm-settings-title {
  font-size: 12px;
  font-weight: 600;
  color: #f7f6f2;
  margin-bottom: 14px;
}
.pm-field {
  margin-bottom: 12px;
}
.pm-field label {
  display: block;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #666;
  margin-bottom: 4px;
}
.pm-field input,
.pm-field textarea {
  width: 100%;
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 4px;
  color: #ccc;
  font-size: 11px;
  padding: 5px 8px;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
}
.pm-field input:focus,
.pm-field textarea:focus {
  border-color: #444;
}
.pm-field textarea {
  resize: vertical;
  min-height: 48px;
}
.pm-og-image-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.pm-og-preview {
  width: 56px;
  height: 36px;
  object-fit: cover;
  border-radius: 3px;
  background: #222;
  flex-shrink: 0;
  display: none;
  border: 1px solid #333;
}
.pm-og-preview.visible {
  display: block;
}
.pm-og-pick-btn {
  background: #222;
  border: 1px solid #333;
  border-radius: 4px;
  color: #aaa;
  font-size: 10px;
  padding: 5px 9px;
  cursor: pointer;
  flex-shrink: 0;
}
.pm-og-pick-btn:hover {
  border-color: #555;
  color: #fff;
}
.pm-ai-btn {
  width: 100%;
  margin-top: 16px;
  padding: 8px 12px;
  background: #141424;
  border: 1px solid #3a3a6a;
  border-radius: 5px;
  color: #a0a0ee;
  font-size: 11px;
  cursor: pointer;
  text-align: center;
}
.pm-ai-btn:hover {
  background: #1c1c3a;
  border-color: #6060aa;
  color: #d0d0ff;
}
.pm-ai-btn:disabled {
  opacity: 0.5;
  cursor: default;
}
/* Manage button in tab bar */
.page-tabs-manage-btn {
  flex-shrink: 0;
  padding: 0 10px;
  height: 28px;
  background: none;
  border: 1px solid #333;
  border-radius: 4px;
  color: #888;
  font-size: 10px;
  cursor: pointer;
  white-space: nowrap;
  margin-left: 4px;
}
.page-tabs-manage-btn:hover {
  border-color: #555;
  color: #ccc;
}
/* Template picker sub-modal */
.pm-template-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border-radius: 10px;
}
.pm-template-overlay.open {
  display: flex;
}
.pm-template-panel {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
  width: 340px;
}
.pm-template-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.pm-template-header h3 {
  font-size: 13px;
  font-weight: 600;
  color: #f7f6f2;
}
.pm-template-close {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
}
.pm-template-close:hover {
  color: #fff;
}
.pm-template-name {
  width: 100%;
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 4px;
  color: #ccc;
  font-size: 11px;
  padding: 6px 8px;
  outline: none;
  font-family: inherit;
  margin-bottom: 10px;
  box-sizing: border-box;
}
.pm-template-name:focus {
  border-color: #444;
}
.pm-template-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 10px;
}
.pm-template-btn {
  padding: 8px 4px;
  background: #222;
  border: 1px solid #2a2a2a;
  border-radius: 4px;
  color: #aaa;
  font-size: 10px;
  cursor: pointer;
  text-align: center;
}
.pm-template-btn:hover {
  border-color: #555;
  color: #ddd;
}
.pm-template-btn.selected {
  border-color: #cdfe00;
  color: #cdfe00;
  background: #1a1f08;
}
.pm-template-divider {
  font-size: 9px;
  color: #555;
  text-align: center;
  margin: 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.pm-template-dup-select {
  width: 100%;
  background: #111;
  border: 1px solid #2a2a2a;
  border-radius: 4px;
  color: #ccc;
  font-size: 11px;
  padding: 6px 8px;
  margin-bottom: 12px;
  box-sizing: border-box;
}
.pm-template-create-btn {
  width: 100%;
  padding: 9px;
  background: #cdfe00;
  border: none;
  border-radius: 4px;
  color: #111;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}
.pm-template-create-btn:hover {
  background: #d9ff20;
}
```

- [ ] **Step 2: Verify CSS loads**

With the dev server running, open the builder. Open browser DevTools → Network tab, reload — confirm `pages-manager.css` loads with status 200. No console errors about missing styles.

- [ ] **Step 3: Commit**

```bash
git add css/pages-manager.css
git commit -m "feat: add pages-manager.css — modal, settings, template picker styles"
```

---

## Task 5: Pages manager — core modal, page list, settings panel

**Files:**

- Modify: `js/pages-manager.js` (replace stub from Task 2)

This task builds the full modal: open/close, two-column layout, page list with delete, settings form with save-on-blur, OG image picker. Drag-to-reorder and template picker come in Tasks 6 and 7.

- [ ] **Step 1: Replace `js/pages-manager.js` with the full implementation**

```js
FB.pagesManager = {};
FB.pagesManager._selectedId = null;

FB.pagesManager.open = function () {
  var overlay = document.getElementById("pages-manager-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "pages-manager-overlay";
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = FB.pagesManager._buildHTML();
  overlay.classList.add("open");
  // Select current page by default
  FB.pagesManager._selectedId = FB.state.currentPageId;
  FB.pagesManager._highlightRow(FB.pagesManager._selectedId);
  // Close on backdrop click
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) FB.pagesManager.close();
  });
};

FB.pagesManager.close = function () {
  var overlay = document.getElementById("pages-manager-overlay");
  if (overlay) overlay.classList.remove("open");
};

FB.pagesManager._buildHTML = function () {
  return (
    '<div class="pm-panel">' +
    '<div class="pm-header"><span>Pages</span>' +
    '<button class="pm-close-btn" onclick="FB.pagesManager.close()">×</button></div>' +
    '<div class="pm-body">' +
    '<div class="pm-list">' +
    '<div class="pm-list-rows" id="pm-list-rows">' +
    FB.pagesManager._buildListRows() +
    "</div>" +
    '<button class="pm-add-btn" onclick="FB.pagesManager.openAddModal()">+ Add page</button>' +
    "</div>" +
    '<div class="pm-settings" id="pm-settings">' +
    FB.pagesManager._buildSettings(FB.state.currentPageId) +
    "</div>" +
    "</div>" +
    '<div class="pm-template-overlay" id="pm-template-overlay"></div>' +
    "</div>"
  );
};

FB.pagesManager._buildListRows = function () {
  return FB.state.pages
    .map(function (page) {
      var isActive = page.id === FB.pagesManager._selectedId;
      var blockCount = page.blocks ? page.blocks.length : 0;
      var canDel = FB.state.pages.length > 1;
      return (
        '<div class="pm-list-row' +
        (isActive ? " active" : "") +
        '"' +
        ' data-page-id="' +
        page.id +
        '"' +
        ' draggable="true"' +
        " onclick=\"FB.pagesManager._selectPage('" +
        page.id +
        "')\">" +
        '<span class="pm-drag-handle">⠿</span>' +
        '<span class="pm-row-name">' +
        page.name +
        "</span>" +
        '<span class="pm-row-count">' +
        blockCount +
        "</span>" +
        (canDel
          ? '<button class="pm-row-del" onclick="event.stopPropagation();FB.pagesManager._deletePage(\'' +
            page.id +
            '\')" title="Delete page">×</button>'
          : "") +
        "</div>"
      );
    })
    .join("");
};

FB.pagesManager._buildSettings = function (pageId) {
  var page = FB.state.pages.find(function (p) {
    return p.id === pageId;
  });
  if (!page)
    return '<p style="color:#555;font-size:11px;padding:8px">No page selected</p>';
  var ogImg = page.ogImage || "";
  return (
    '<div class="pm-settings-title">' +
    page.name +
    " — Settings</div>" +
    FB.pagesManager._field(
      "title",
      "Page Title",
      page.title || "",
      "text",
      pageId,
    ) +
    FB.pagesManager._field("slug", "Slug", page.slug || "", "text", pageId) +
    FB.pagesManager._field(
      "metaDesc",
      "Meta Description",
      page.metaDesc || "",
      "textarea",
      pageId,
    ) +
    FB.pagesManager._field(
      "ogTitle",
      "OG Title",
      page.ogTitle || "",
      "text",
      pageId,
    ) +
    FB.pagesManager._field(
      "ogDesc",
      "OG Description",
      page.ogDesc || "",
      "textarea",
      pageId,
    ) +
    '<div class="pm-field">' +
    "<label>OG Image</label>" +
    '<div class="pm-og-image-row">' +
    '<img id="pm-og-preview" class="pm-og-preview' +
    (ogImg ? " visible" : "") +
    '" src="' +
    ogImg +
    '" alt="OG preview">' +
    '<button class="pm-og-pick-btn" onclick="FB.pagesManager._pickOgImage(\'' +
    pageId +
    "')\">📁 Pick</button>" +
    "</div></div>" +
    '<button class="pm-ai-btn" id="pm-ai-btn" onclick="FB.pagesManager._runAiSeo(\'' +
    pageId +
    "')\">✦ Auto-generate SEO</button>"
  );
};

FB.pagesManager._field = function (key, label, value, type, pageId) {
  var tag = type === "textarea" ? "textarea" : "input";
  var attrs =
    'class="' +
    (type === "textarea" ? "" : "") +
    '"' +
    ' data-page-id="' +
    pageId +
    '"' +
    ' data-key="' +
    key +
    '"' +
    ' onblur="FB.pagesManager._onFieldBlur(this)"';
  if (type === "textarea") {
    return (
      '<div class="pm-field"><label>' +
      label +
      "</label>" +
      "<textarea " +
      attrs +
      ">" +
      value +
      "</textarea></div>"
    );
  }
  return (
    '<div class="pm-field"><label>' +
    label +
    "</label>" +
    '<input type="text" ' +
    attrs +
    ' value="' +
    value.replace(/"/g, "&quot;") +
    '"></div>'
  );
};

FB.pagesManager._onFieldBlur = function (el) {
  var pageId = el.dataset.pageId;
  var key = el.dataset.key;
  var val = el.value.trim();
  if (key === "slug") val = FB.pagesManager._formatSlug(val, pageId);
  FB.pagesManager._saveSetting(pageId, key, val);
  if (key === "slug") el.value = val;
};

FB.pagesManager._formatSlug = function (val, pageId) {
  var page = FB.state.pages.find(function (p) {
    return p.id === pageId;
  });
  // Home page slug is always "index"
  if (page && page.name.toLowerCase() === "home") return "index";
  return (
    val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/^-+|-+$/g, "") || "page"
  );
};

FB.pagesManager._saveSetting = function (pageId, key, val) {
  var page = FB.state.pages.find(function (p) {
    return p.id === pageId;
  });
  if (!page) return;
  page[key] = val;
  FB.pages._save();
  // Refresh page name in title if name changed
  if (key === "title") {
    var titleEl = document.querySelector(".pm-settings-title");
    if (titleEl)
      titleEl.textContent = (page.name || page.title) + " — Settings";
  }
};

FB.pagesManager._selectPage = function (id) {
  FB.pagesManager._selectedId = id;
  FB.pagesManager._highlightRow(id);
  var settingsEl = document.getElementById("pm-settings");
  if (settingsEl) settingsEl.innerHTML = FB.pagesManager._buildSettings(id);
};

FB.pagesManager._highlightRow = function (id) {
  document.querySelectorAll(".pm-list-row").forEach(function (row) {
    row.classList.toggle("active", row.dataset.pageId === id);
  });
};

FB.pagesManager._deletePage = function (id) {
  FB.pages.delete(id);
  // If the deleted page was selected, select the new current page
  FB.pagesManager._selectedId = FB.state.currentPageId;
  var rowsEl = document.getElementById("pm-list-rows");
  if (rowsEl) rowsEl.innerHTML = FB.pagesManager._buildListRows();
  var settingsEl = document.getElementById("pm-settings");
  if (settingsEl)
    settingsEl.innerHTML = FB.pagesManager._buildSettings(
      FB.state.currentPageId,
    );
};

FB.pagesManager._pickOgImage = function (pageId) {
  FB.pagesManager.close();
  FB.mediaGallery.pickWithCallback(function (url) {
    FB.pagesManager._saveSetting(pageId, "ogImage", url);
    FB.pagesManager.open();
    FB.pagesManager._selectPage(pageId);
  });
  // Navigate to media panel
  var mediaBtn =
    document.querySelector('[data-panel="media"]') ||
    document.querySelector('.nav-item[onclick*="media"]');
  if (mediaBtn) mediaBtn.click();
};

// Placeholder — implemented in Task 8
FB.pagesManager._runAiSeo = function (pageId) {
  FB.util.showToast("AI SEO coming soon");
};

// Placeholder — implemented in Task 7
FB.pagesManager.openAddModal = function () {
  FB.util.showToast("Template picker coming soon");
};
```

- [ ] **Step 2: Verify in browser**

With dev server running, open the builder. Click the "Manage" button in the page tabs bar. The modal should open showing the page list on the left and settings on the right. Test:

- Click a page row — settings panel updates to show that page's fields
- Type in a field and tab away — the value is saved (check `FB.state.pages` in console)
- Type an invalid slug and blur — it auto-formats
- Delete a page (if more than one exists) — list updates, settings switch to remaining page
- Click backdrop — modal closes

- [ ] **Step 3: Commit**

```bash
git add js/pages-manager.js
git commit -m "feat: pages manager modal — page list, settings panel, save-on-blur, OG image pick"
```

---

## Task 6: Pages manager — drag-to-reorder

**Files:**

- Modify: `js/pages-manager.js`

HTML5 drag events: `dragstart` sets a page ID on the drag event, `dragover` toggles a visual indicator, `drop` splices the pages array and re-renders the list.

- [ ] **Step 1: Add drag event wiring in `open()`**

In `FB.pagesManager.open()`, after `overlay.innerHTML = FB.pagesManager._buildHTML()`, add a call to wire drag events:

```js
FB.pagesManager._wireDrag();
```

- [ ] **Step 2: Add `_wireDrag` function**

Add this function to `js/pages-manager.js`:

```js
FB.pagesManager._wireDrag = function () {
  var rows = document.getElementById("pm-list-rows");
  if (!rows) return;
  var draggingId = null;

  rows.addEventListener("dragstart", function (e) {
    var row = e.target.closest(".pm-list-row");
    if (!row) return;
    draggingId = row.dataset.pageId;
    row.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
  });

  rows.addEventListener("dragend", function () {
    draggingId = null;
    rows.querySelectorAll(".pm-list-row").forEach(function (r) {
      r.classList.remove("dragging", "drag-over");
    });
  });

  rows.addEventListener("dragover", function (e) {
    e.preventDefault();
    var row = e.target.closest(".pm-list-row");
    rows.querySelectorAll(".pm-list-row").forEach(function (r) {
      r.classList.remove("drag-over");
    });
    if (row && row.dataset.pageId !== draggingId) {
      row.classList.add("drag-over");
    }
  });

  rows.addEventListener("drop", function (e) {
    e.preventDefault();
    var row = e.target.closest(".pm-list-row");
    if (!row || !draggingId || row.dataset.pageId === draggingId) return;
    var fromIdx = FB.state.pages.findIndex(function (p) {
      return p.id === draggingId;
    });
    var toIdx = FB.state.pages.findIndex(function (p) {
      return p.id === row.dataset.pageId;
    });
    if (fromIdx < 0 || toIdx < 0) return;
    var moved = FB.state.pages.splice(fromIdx, 1)[0];
    FB.state.pages.splice(toIdx, 0, moved);
    FB.pages._save();
    FB.pages.render();
    var rowsEl = document.getElementById("pm-list-rows");
    if (rowsEl) {
      rowsEl.innerHTML = FB.pagesManager._buildListRows();
      FB.pagesManager._wireDrag();
    }
  });
};
```

- [ ] **Step 3: Wire drag on `_deletePage` re-render**

In `FB.pagesManager._deletePage`, after updating `rowsEl.innerHTML`, add:

```js
FB.pagesManager._wireDrag();
```

- [ ] **Step 4: Verify in browser**

Open the Manage modal with at least two pages. Drag a page row to a different position — the list should reorder. Check `FB.state.pages` in the console to confirm array order matches the visual order. Reload the page — the order should be preserved (saved to localStorage).

- [ ] **Step 5: Commit**

```bash
git add js/pages-manager.js
git commit -m "feat: drag-to-reorder pages in manager modal"
```

---

## Task 7: Pages manager — template picker sub-modal

**Files:**

- Modify: `js/pages-manager.js`

Replace the `openAddModal` stub. The sub-modal appears inside `.pm-template-overlay` (already in the panel HTML from Task 5). Template blocks are defined inline using actual block prop structures.

- [ ] **Step 1: Define page templates**

Add this constant object to `js/pages-manager.js` at the top level (before any function definitions):

```js
FB.pagesManager._templates = {
  blank: [],
  landing: function () {
    return [
      {
        id: FB.state.genId(),
        type: "nav",
        props: {
          logoText: "Your Brand",
          links: [
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
          ],
          ctaText: "Get Started",
          bg: "#111111",
          textColor: "#ffffff",
          accentColor: "#CDFE00",
        },
      },
      {
        id: FB.state.genId(),
        type: "hero",
        props: {
          eyebrow: "",
          headline: "We Build Remarkable Experiences",
          subtext:
            "Award-winning digital studio crafting websites that captivate and convert.",
          ctaText: "Get Started →",
          bg: "#111111",
          textColor: "#f7f6f2",
          accentColor: "#CDFE00",
          showBlob: true,
        },
      },
      {
        id: FB.state.genId(),
        type: "features",
        props: {
          label: "What We Do",
          headline: "Our Services",
          items: [
            {
              icon: "✦",
              title: "Strategy",
              desc: "We start with understanding your goals.",
            },
            {
              icon: "✦",
              title: "Design",
              desc: "Crafted visuals that tell your story.",
            },
            {
              icon: "✦",
              title: "Build",
              desc: "Fast, accessible, production-ready code.",
            },
          ],
          bg: "#ffffff",
          textColor: "#111111",
          accentColor: "#CDFE00",
        },
      },
      {
        id: FB.state.genId(),
        type: "cta",
        props: {
          headline: "Ready to start?",
          btnText: "Contact Us →",
          bg: "#111111",
          textColor: "#ffffff",
        },
      },
      {
        id: FB.state.genId(),
        type: "footer",
        props: {
          logoText: "Your Brand",
          tagline: "",
          cols: [
            { heading: "Company", links: ["Home", "About", "Services"] },
            { heading: "Contact", links: ["hello@yourbrand.com"] },
          ],
          copyright: "© " + new Date().getFullYear() + " Your Brand",
          bg: "#111111",
          accentColor: "#CDFE00",
        },
      },
    ];
  },
  about: function () {
    return [
      {
        id: FB.state.genId(),
        type: "nav",
        props: {
          logoText: "Your Brand",
          links: [
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
          ],
          ctaText: "Get Started",
          bg: "#111111",
          textColor: "#ffffff",
          accentColor: "#CDFE00",
        },
      },
      {
        id: FB.state.genId(),
        type: "hero",
        props: {
          eyebrow: "",
          headline: "About Us",
          subtext:
            "We're a team of designers and developers passionate about craft.",
          ctaText: "",
          bg: "#111111",
          textColor: "#f7f6f2",
          accentColor: "#CDFE00",
          showBlob: false,
        },
      },
      {
        id: FB.state.genId(),
        type: "textBlock",
        props: {
          headline: "Our Story",
          body: "Founded with a passion for craft, we set out to build a studio that puts quality first. Every project we take on is an opportunity to push the boundaries of what's possible on the web.",
          bg: "#ffffff",
          textColor: "#111111",
          accentColor: "#CDFE00",
          paddingV: 64,
          paddingH: 48,
        },
      },
      {
        id: FB.state.genId(),
        type: "stats",
        props: {
          items: [
            { value: "50+", label: "Projects" },
            { value: "8", label: "Years" },
            { value: "100%", label: "Passion" },
          ],
          bg: "#111111",
          textColor: "#ffffff",
          accentColor: "#CDFE00",
        },
      },
      {
        id: FB.state.genId(),
        type: "footer",
        props: {
          logoText: "Your Brand",
          tagline: "",
          cols: [
            { heading: "Company", links: ["Home", "About", "Services"] },
            { heading: "Contact", links: ["hello@yourbrand.com"] },
          ],
          copyright: "© " + new Date().getFullYear() + " Your Brand",
          bg: "#111111",
          accentColor: "#CDFE00",
        },
      },
    ];
  },
  contact: function () {
    return [
      {
        id: FB.state.genId(),
        type: "nav",
        props: {
          logoText: "Your Brand",
          links: [
            { label: "Home", href: "/" },
            { label: "Contact", href: "/contact" },
          ],
          ctaText: "",
          bg: "#111111",
          textColor: "#ffffff",
          accentColor: "#CDFE00",
        },
      },
      {
        id: FB.state.genId(),
        type: "hero",
        props: {
          eyebrow: "",
          headline: "Get In Touch",
          subtext:
            "We'd love to hear about your project. Send us a message and we'll get back to you.",
          ctaText: "",
          bg: "#111111",
          textColor: "#f7f6f2",
          accentColor: "#CDFE00",
          showBlob: false,
        },
      },
      {
        id: FB.state.genId(),
        type: "textBlock",
        props: {
          headline: "Contact Details",
          body: "hello@yourbrand.com\n\nLondon, UK",
          bg: "#ffffff",
          textColor: "#111111",
          accentColor: "#CDFE00",
          paddingV: 64,
          paddingH: 48,
        },
      },
      {
        id: FB.state.genId(),
        type: "footer",
        props: {
          logoText: "Your Brand",
          tagline: "",
          cols: [{ heading: "Company", links: ["Home", "About", "Contact"] }],
          copyright: "© " + new Date().getFullYear() + " Your Brand",
          bg: "#111111",
          accentColor: "#CDFE00",
        },
      },
    ];
  },
  blog: function () {
    return [
      {
        id: FB.state.genId(),
        type: "nav",
        props: {
          logoText: "Your Brand",
          links: [
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
          ],
          ctaText: "",
          bg: "#111111",
          textColor: "#ffffff",
          accentColor: "#CDFE00",
        },
      },
      {
        id: FB.state.genId(),
        type: "hero",
        props: {
          eyebrow: "",
          headline: "Journal",
          subtext: "Thoughts on design, code, and craft.",
          ctaText: "",
          bg: "#111111",
          textColor: "#f7f6f2",
          accentColor: "#CDFE00",
          showBlob: false,
        },
      },
      {
        id: FB.state.genId(),
        type: "textBlock",
        props: {
          headline: "Latest Posts",
          body: "Your blog posts will appear here. Add content blocks below.",
          bg: "#ffffff",
          textColor: "#111111",
          accentColor: "#CDFE00",
          paddingV: 64,
          paddingH: 48,
        },
      },
      {
        id: FB.state.genId(),
        type: "footer",
        props: {
          logoText: "Your Brand",
          tagline: "",
          cols: [{ heading: "Company", links: ["Home", "Blog"] }],
          copyright: "© " + new Date().getFullYear() + " Your Brand",
          bg: "#111111",
          accentColor: "#CDFE00",
        },
      },
    ];
  },
  pricing: function () {
    return [
      {
        id: FB.state.genId(),
        type: "nav",
        props: {
          logoText: "Your Brand",
          links: [
            { label: "Home", href: "/" },
            { label: "Pricing", href: "/pricing" },
          ],
          ctaText: "Get Started",
          bg: "#111111",
          textColor: "#ffffff",
          accentColor: "#CDFE00",
        },
      },
      {
        id: FB.state.genId(),
        type: "hero",
        props: {
          eyebrow: "",
          headline: "Simple Pricing",
          subtext: "One plan, no surprises. Everything you need to launch.",
          ctaText: "",
          bg: "#111111",
          textColor: "#f7f6f2",
          accentColor: "#CDFE00",
          showBlob: false,
        },
      },
      {
        id: FB.state.genId(),
        type: "stats",
        props: {
          items: [
            { value: "£999", label: "Starter" },
            { value: "£2,499", label: "Pro" },
            { value: "Custom", label: "Enterprise" },
          ],
          bg: "#ffffff",
          textColor: "#111111",
          accentColor: "#CDFE00",
        },
      },
      {
        id: FB.state.genId(),
        type: "cta",
        props: {
          headline: "Ready to get started?",
          btnText: "Contact Us →",
          bg: "#111111",
          textColor: "#ffffff",
        },
      },
      {
        id: FB.state.genId(),
        type: "footer",
        props: {
          logoText: "Your Brand",
          tagline: "",
          cols: [{ heading: "Company", links: ["Home", "Pricing"] }],
          copyright: "© " + new Date().getFullYear() + " Your Brand",
          bg: "#111111",
          accentColor: "#CDFE00",
        },
      },
    ];
  },
  services: function () {
    return [
      {
        id: FB.state.genId(),
        type: "nav",
        props: {
          logoText: "Your Brand",
          links: [
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
          ],
          ctaText: "Get Started",
          bg: "#111111",
          textColor: "#ffffff",
          accentColor: "#CDFE00",
        },
      },
      {
        id: FB.state.genId(),
        type: "hero",
        props: {
          eyebrow: "",
          headline: "Our Services",
          subtext:
            "Everything you need to launch and grow your digital presence.",
          ctaText: "",
          bg: "#111111",
          textColor: "#f7f6f2",
          accentColor: "#CDFE00",
          showBlob: false,
        },
      },
      {
        id: FB.state.genId(),
        type: "features",
        props: {
          label: "What We Offer",
          headline: "Services",
          items: [
            {
              icon: "✦",
              title: "Web Design",
              desc: "Bespoke websites built for performance and craft.",
            },
            {
              icon: "✦",
              title: "Branding",
              desc: "Identity systems that resonate and endure.",
            },
            {
              icon: "✦",
              title: "Development",
              desc: "Fast, accessible, production-ready builds.",
            },
          ],
          bg: "#ffffff",
          textColor: "#111111",
          accentColor: "#CDFE00",
        },
      },
      {
        id: FB.state.genId(),
        type: "cta",
        props: {
          headline: "Let's work together",
          btnText: "Get in touch →",
          bg: "#111111",
          textColor: "#ffffff",
        },
      },
      {
        id: FB.state.genId(),
        type: "footer",
        props: {
          logoText: "Your Brand",
          tagline: "",
          cols: [{ heading: "Company", links: ["Home", "Services"] }],
          copyright: "© " + new Date().getFullYear() + " Your Brand",
          bg: "#111111",
          accentColor: "#CDFE00",
        },
      },
    ];
  },
};
```

- [ ] **Step 2: Replace `openAddModal` stub**

Replace the `FB.pagesManager.openAddModal` stub with:

```js
FB.pagesManager.openAddModal = function () {
  var overlay = document.getElementById("pm-template-overlay");
  if (!overlay) return;
  FB.pagesManager._templateSelection = "blank";
  overlay.innerHTML = FB.pagesManager._buildTemplatePanel();
  overlay.classList.add("open");
};

FB.pagesManager._buildTemplatePanel = function () {
  var templateKeys = [
    "blank",
    "landing",
    "about",
    "contact",
    "blog",
    "pricing",
    "services",
  ];
  var templateLabels = {
    blank: "Blank",
    landing: "Landing",
    about: "About",
    contact: "Contact",
    blog: "Blog",
    pricing: "Pricing",
    services: "Services",
  };
  var dupOptions = FB.state.pages
    .map(function (p) {
      return '<option value="' + p.id + '">' + p.name + "</option>";
    })
    .join("");
  return (
    '<div class="pm-template-panel">' +
    '<div class="pm-template-header"><h3>New Page</h3>' +
    "<button class=\"pm-template-close\" onclick=\"document.getElementById('pm-template-overlay').classList.remove('open')\">×</button></div>" +
    '<input class="pm-template-name" id="pm-template-name-input" type="text" placeholder="Page name" value="">' +
    '<div class="pm-template-grid">' +
    templateKeys
      .map(function (key) {
        return (
          '<button class="pm-template-btn' +
          (key === "blank" ? " selected" : "") +
          '"' +
          ' data-template="' +
          key +
          '"' +
          " onclick=\"FB.pagesManager._selectTemplate(this, '" +
          key +
          "')\">" +
          templateLabels[key] +
          "</button>"
        );
      })
      .join("") +
    "</div>" +
    '<div class="pm-template-divider">— or duplicate existing —</div>' +
    '<select class="pm-template-dup-select" id="pm-dup-select" onchange="FB.pagesManager._selectDuplicate(this.value)">' +
    '<option value="">None</option>' +
    dupOptions +
    "</select>" +
    '<button class="pm-template-create-btn" onclick="FB.pagesManager._createPage()">Create Page</button>' +
    "</div>"
  );
};

FB.pagesManager._selectTemplate = function (btn, key) {
  FB.pagesManager._templateSelection = key;
  FB.pagesManager._duplicateId = null;
  document.querySelectorAll(".pm-template-btn").forEach(function (b) {
    b.classList.toggle("selected", b.dataset.template === key);
  });
  var dupSel = document.getElementById("pm-dup-select");
  if (dupSel) dupSel.value = "";
};

FB.pagesManager._selectDuplicate = function (pageId) {
  FB.pagesManager._duplicateId = pageId || null;
  if (pageId) {
    document.querySelectorAll(".pm-template-btn").forEach(function (b) {
      b.classList.remove("selected");
    });
    FB.pagesManager._templateSelection = null;
  }
};

FB.pagesManager._createPage = function () {
  var nameInput = document.getElementById("pm-template-name-input");
  var name = nameInput ? nameInput.value.trim() : "";
  if (!name) {
    var defaults = [
      "About",
      "Services",
      "Work",
      "Contact",
      "Blog",
      "Pricing",
      "FAQ",
      "Team",
    ];
    var existing = FB.state.pages.map(function (p) {
      return p.name;
    });
    name =
      defaults.find(function (n) {
        return existing.indexOf(n) < 0;
      }) || "Page " + (FB.state.pages.length + 1);
  }
  var slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  var blocks = [];
  if (FB.pagesManager._duplicateId) {
    var src = FB.state.pages.find(function (p) {
      return p.id === FB.pagesManager._duplicateId;
    });
    if (src)
      blocks = JSON.parse(JSON.stringify(src.blocks)).map(function (b) {
        return Object.assign({}, b, { id: FB.state.genId() });
      });
  } else if (
    FB.pagesManager._templateSelection &&
    FB.pagesManager._templateSelection !== "blank"
  ) {
    var tplFn = FB.pagesManager._templates[FB.pagesManager._templateSelection];
    if (typeof tplFn === "function") blocks = tplFn();
  }
  FB.pages._save();
  var id = "p_" + Math.random().toString(36).slice(2, 7);
  FB.state.pages.push({ id: id, name: name, slug: slug, blocks: blocks });
  FB.pages._save();
  document.getElementById("pm-template-overlay").classList.remove("open");
  FB.pagesManager._selectedId = id;
  var rowsEl = document.getElementById("pm-list-rows");
  if (rowsEl) {
    rowsEl.innerHTML = FB.pagesManager._buildListRows();
    FB.pagesManager._wireDrag();
  }
  var settingsEl = document.getElementById("pm-settings");
  if (settingsEl) settingsEl.innerHTML = FB.pagesManager._buildSettings(id);
  FB.pages.render();
  FB.util.showToast("+ Page added: " + name);
};
```

- [ ] **Step 3: Verify in browser**

Open Manage modal, click "+ Add page". Verify:

- All 7 template buttons appear, "Blank" selected by default
- Selecting a template highlights it and clears the duplicate dropdown
- Selecting a duplicate source clears template selection
- Creating a page with a template fills the canvas with the correct blocks (switch to the new page tab after creating)
- Creating a page as a duplicate deep-copies the source page's blocks with fresh IDs

- [ ] **Step 4: Commit**

```bash
git add js/pages-manager.js
git commit -m "feat: add page template picker — blank, predefined starters, duplicate existing"
```

---

## Task 8: Server + client — AI SEO generation

**Files:**

- Modify: `server.py`
- Modify: `js/pages-manager.js`

- [ ] **Step 1: Add `/api/ai-seo` route to `server.py` dispatch**

In `server.py`, find `do_POST` (around line 109). Add a new `elif` before the final `else: self.send_error(HTTPStatus.NOT_FOUND)` (around line 140):

```python
elif parsed.path == "/api/ai-seo":
    self._handle_ai_seo()
```

- [ ] **Step 2: Implement `_handle_ai_seo` in `server.py`**

Add this method to the request handler class, near the other `_handle_ai_*` methods (after `_handle_ai_import`, around line 322):

````python
def _handle_ai_seo(self):
    try:
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length)) if length else {}
    except Exception as e:
        self._json_response({"error": "Failed to parse request: " + str(e)}, 400)
        return

    page_name = body.get("pageName", "").strip()
    content = body.get("content", "").strip()
    api_key = body.get("apiKey", "").strip()
    provider = body.get("provider", "gemini")

    if not api_key:
        self._json_response({"error": "Missing apiKey"}, 400)
        return
    if not content and not page_name:
        self._json_response({"error": "Missing pageName or content"}, 400)
        return

    prompt = (
        'You are an SEO copywriter. Write SEO metadata for a webpage.\n\n'
        'Page name: ' + page_name + '\n\n'
        'Page content:\n' + content[:2000] + '\n\n'
        'Return ONLY a JSON object with these exact keys. No markdown, no explanation.\n'
        'Constraints: title ≤60 chars, metaDesc ≤155 chars, ogTitle ≤60 chars, ogDesc ≤200 chars.\n'
        '{"title":"...","metaDesc":"...","ogTitle":"...","ogDesc":"..."}'
    )

    print(f"[AI SEO] Generating for page: {page_name} using {provider}")
    try:
        if provider == "openai":
            raw = self._call_openai(api_key, prompt)
        else:
            raw = self._call_gemini(api_key, prompt)
        raw = raw.strip()
        if raw.startswith("```"):
            raw = re.sub(r'^```[a-zA-Z]*\n?', '', raw)
            raw = re.sub(r'\n?```\s*$', '', raw)
            raw = raw.strip()
        result = json.loads(raw)
        if not isinstance(result, dict):
            raise ValueError("Not a dict")
        self._json_response({
            "title": str(result.get("title", ""))[:60],
            "metaDesc": str(result.get("metaDesc", ""))[:155],
            "ogTitle": str(result.get("ogTitle", ""))[:60],
            "ogDesc": str(result.get("ogDesc", ""))[:200],
        })
    except json.JSONDecodeError:
        print("[AI SEO] AI returned invalid JSON")
        self._json_response({"error": "AI returned invalid JSON"}, 500)
    except Exception as e:
        print(f"[AI SEO] Error: {e}")
        self._json_response({"error": "AI SEO error: " + str(e)[:200]}, 500)
````

- [ ] **Step 3: Replace `_runAiSeo` stub in `js/pages-manager.js`**

Replace the `FB.pagesManager._runAiSeo` stub with the full implementation:

```js
FB.pagesManager._extractContent = function (pageId) {
  var page = FB.state.pages.find(function (p) {
    return p.id === pageId;
  });
  if (!page || !page.blocks) return "";
  var parts = [];
  page.blocks.forEach(function (b) {
    var p = b.props || {};
    var strip = function (s) {
      return (s || "").replace(/<[^>]*>/g, "").trim();
    };
    if (p.headline) parts.push(strip(p.headline));
    if (p.subtext) parts.push(strip(p.subtext));
    if (p.eyebrow) parts.push(strip(p.eyebrow));
    if (p.body) parts.push(strip(p.body));
    if (p.ctaText) parts.push(strip(p.ctaText));
    if (p.btnText) parts.push(strip(p.btnText));
    if (p.tagline) parts.push(strip(p.tagline));
    if (Array.isArray(p.items)) {
      p.items.forEach(function (item) {
        if (item.title) parts.push(strip(item.title));
        if (item.desc) parts.push(strip(item.desc));
      });
    }
    if (Array.isArray(p.links)) {
      p.links.forEach(function (link) {
        if (link.label) parts.push(strip(link.label));
      });
    }
  });
  return parts.filter(Boolean).join("\n").substring(0, 2000);
};

FB.pagesManager._runAiSeo = function (pageId) {
  var apiKey = localStorage.getItem("fb-ai-key") || "";
  var provider = localStorage.getItem("fb-ai-provider") || "gemini";
  if (!apiKey) {
    FB.util.showToast("No AI key set — configure it in the AI panel first");
    return;
  }
  var page = FB.state.pages.find(function (p) {
    return p.id === pageId;
  });
  if (!page) return;
  var btn = document.getElementById("pm-ai-btn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Generating…";
  }
  var content = FB.pagesManager._extractContent(pageId);
  fetch("/api/ai-seo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pageName: page.name,
      content: content,
      provider: provider,
      apiKey: apiKey,
    }),
  })
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      if (data.error) {
        FB.util.showToast("SEO error: " + data.error);
        return;
      }
      if (data.title) {
        page.title = data.title;
      }
      if (data.metaDesc) {
        page.metaDesc = data.metaDesc;
      }
      if (data.ogTitle) {
        page.ogTitle = data.ogTitle;
      }
      if (data.ogDesc) {
        page.ogDesc = data.ogDesc;
      }
      FB.pages._save();
      // Refresh settings panel to show new values
      var settingsEl = document.getElementById("pm-settings");
      if (settingsEl)
        settingsEl.innerHTML = FB.pagesManager._buildSettings(pageId);
      FB.util.showToast("SEO generated");
    })
    .catch(function (e) {
      FB.util.showToast("SEO request failed: " + e.message);
    })
    .finally(function () {
      var b = document.getElementById("pm-ai-btn");
      if (b) {
        b.disabled = false;
        b.textContent = "✦ Auto-generate SEO";
      }
    });
};
```

- [ ] **Step 4: Restart the Python server and verify the route exists**

```bash
python3 server.py &
curl -s -X POST http://localhost:8899/api/ai-seo \
  -H "Content-Type: application/json" \
  -d '{"pageName":"Test","content":"We build websites","apiKey":"INVALID","provider":"gemini"}' | python3 -m json.tool
```

Expected: a JSON error from Gemini about the invalid key — NOT a 404. If you see `{"error": "...Gemini..."}` the route is wired correctly.

- [ ] **Step 5: Full end-to-end test**

Open the builder, open Manage modal, select a page that has at least one block with content. Click "✦ Auto-generate SEO". Verify:

- Button shows "Generating…" and is disabled while waiting
- After response, all four SEO fields in the settings panel are populated
- Values are persisted: close and reopen the modal, values are still there

- [ ] **Step 6: Commit**

```bash
git add server.py js/pages-manager.js
git commit -m "feat: AI SEO generation — /api/ai-seo server route + client extraction and form fill"
```

---

## Self-Review Checklist

- **Export integration**: Task 1 covers `generateMetaTags` + `generateHTML` ✓
- **Tab bar Manage button**: Task 2 ✓
- **Manage modal — two-column layout**: Task 5 ✓
- **Page list with drag handles and delete**: Tasks 5 + 6 ✓
- **Settings panel — all 5 SEO fields**: Task 5 ✓
- **Save-on-blur**: Task 5 (`_onFieldBlur` + `_saveSetting`) ✓
- **Slug auto-format + home lock**: Task 5 (`_formatSlug`) ✓
- **OG image picker via media gallery**: Tasks 3 + 5 ✓
- **Drag-to-reorder**: Task 6 ✓
- **Template picker sub-modal**: Task 7 ✓
- **Predefined starters (6 templates)**: Task 7 ✓
- **Duplicate existing page**: Task 7 ✓
- **`POST /api/ai-seo` server route**: Task 8 ✓
- **AI SEO button + content extraction + form fill**: Task 8 ✓
- **CSS — all modal styles**: Task 4 ✓
- **Wire-up — `src/main.js` import + HTML CSS link**: Task 2 ✓
