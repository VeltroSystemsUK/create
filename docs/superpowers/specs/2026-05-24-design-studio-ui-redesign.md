# Design Studio UI Redesign Spec

> **For agentic workers:** This spec replaces the visual layer of the Design Studio built in `2026-05-23-design-studio-design.md`. All functional logic (Fabric.js canvas, history, save/load, AI generation) remains intact. This is a pure UI restructure: new HTML layout, new CSS, updated JS to target new DOM IDs, and one new JS module (`FB.design.elements`).

**Goal:** Replace the "Microsoft Paint" UI with a Figma-style dark design studio: wider left sidebar with Elements/Layers/Assets tabs (full element library), canvas in the centre, and a tabbed Design/Align/Export right panel.

**Architecture:** Three-panel layout. Left panel (240px) has three tabs — Elements (shape tiles, text presets, icon grid, background swatches, frame tiles), Layers (existing layer list), Assets (My Designs + Templates). Right panel (240px) has three tabs — Design (object properties), Align (alignment controls, always visible), Export (insert/export). The existing `FB.design.*` modules are updated to target the new DOM structure; one new module `FB.design.elements` is added for the left panel.

**Tech Stack:** Vanilla JS, Fabric.js 5.3.1, no build pipeline. All changes are in `framework-builder.html`, `css/design.css`, and `js/design.js`.

---

## File Map

| File                     | Change                                                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `framework-builder.html` | Full restructure of `#design-studio` HTML — new tab structure, new IDs                                                                                        |
| `css/design.css`         | Complete rewrite — new panel dimensions, tab styles, element tiles, icon grid                                                                                 |
| `js/design.js`           | New `FB.design.elements` module; update `FB.design.tools`, `FB.design.props`, `FB.design.align`, `FB.design.canvas` to match new DOM IDs and remove align bar |

---

## 1. HTML Structure

Replace the entire `#design-studio` div content with this structure:

```html
<div id="design-studio" style="display:none">
  <!-- TOP BAR -->
  <div id="ds-topbar">
    <button class="ds-back-btn" onclick="FB.panels.setMode('builder')">
      ← Builder
    </button>
    <div class="ds-divider"></div>
    <input id="ds-title" class="ds-title-input" value="Untitled Design" />
    <div class="ds-divider"></div>
    <button
      class="ds-icon-btn"
      title="Undo (Ctrl+Z)"
      onclick="FB.design.history.undo()"
    >
      ↩
    </button>
    <button
      class="ds-icon-btn"
      title="Redo (Ctrl+Y)"
      onclick="FB.design.history.redo()"
    >
      ↪
    </button>
    <div style="margin-left:auto;display:flex;align-items:center;gap:8px;">
      <select
        id="ds-preset-select"
        onchange="FB.design.canvas.applyPreset(this.value)"
      >
        <option value="hero">Hero Banner (1920×600)</option>
        <option value="og">OG Image (1200×630)</option>
        <option value="card">Feature Card (800×600)</option>
        <option value="square">Square (1080×1080)</option>
        <option value="wide">Wide (1920×1080)</option>
        <option value="custom">Custom…</option>
      </select>
      <div id="ds-zoom-controls">
        <button onclick="FB.design.canvas.zoomOut()">−</button>
        <span id="ds-zoom-label">100%</span>
        <button onclick="FB.design.canvas.zoomIn()">+</button>
        <button onclick="FB.design.canvas.zoomFit()">Fit</button>
      </div>
      <div class="ds-divider"></div>
      <span id="ds-size-label"></span>
      <button class="ds-save-btn" onclick="FB.design.library.save()">
        Save
      </button>
    </div>
  </div>

  <!-- MAIN AREA -->
  <div id="ds-main">
    <!-- LEFT PANEL -->
    <div id="ds-left-panel">
      <div class="ds-tab-row" id="ds-left-tabs">
        <button
          class="ds-tab active"
          data-tab="elements"
          onclick="FB.design.switchLeftTab('elements')"
        >
          Elements
        </button>
        <button
          class="ds-tab"
          data-tab="layers"
          onclick="FB.design.switchLeftTab('layers')"
        >
          Layers
        </button>
        <button
          class="ds-tab"
          data-tab="assets"
          onclick="FB.design.switchLeftTab('assets')"
        >
          Assets
        </button>
      </div>

      <!-- ELEMENTS TAB -->
      <div id="ds-tab-elements" class="ds-tab-content active">
        <!-- 4 primary tool buttons -->
        <div id="ds-tool-row"></div>
        <!-- Element library sections (rendered by FB.design.elements.render()) -->
        <div id="ds-elements-body"></div>
      </div>

      <!-- LAYERS TAB -->
      <div id="ds-tab-layers" class="ds-tab-content">
        <div id="ds-layers-list"></div>
      </div>

      <!-- ASSETS TAB -->
      <div id="ds-tab-assets" class="ds-tab-content">
        <button class="ds-full-btn" onclick="FB.design.templates.open()">
          ⊞ Browse Templates
        </button>
        <div class="ds-section-label">My Designs</div>
        <div id="ds-assets-designs"></div>
        <button
          class="ds-full-btn"
          style="margin:6px 8px;"
          onclick="FB.panels.loadBuilderDesigns()"
        >
          ↻ Refresh
        </button>
      </div>
    </div>

    <!-- CANVAS -->
    <div id="ds-canvas-column">
      <div id="ds-canvas-wrap">
        <canvas id="ds-canvas"></canvas>
      </div>
    </div>

    <!-- RIGHT PANEL -->
    <div id="ds-right-panel">
      <div class="ds-tab-row" id="ds-right-tabs">
        <button
          class="ds-tab active"
          data-tab="design"
          onclick="FB.design.switchRightTab('design')"
        >
          Design
        </button>
        <button
          class="ds-tab"
          data-tab="align"
          onclick="FB.design.switchRightTab('align')"
        >
          Align
        </button>
        <button
          class="ds-tab"
          data-tab="export"
          onclick="FB.design.switchRightTab('export')"
        >
          Export
        </button>
      </div>

      <!-- DESIGN TAB -->
      <div id="ds-tab-design" class="ds-tab-content active">
        <div id="ds-props"></div>
      </div>

      <!-- ALIGN TAB -->
      <div id="ds-tab-align" class="ds-tab-content">
        <div id="ds-align-panel"></div>
      </div>

      <!-- EXPORT TAB -->
      <div id="ds-tab-export" class="ds-tab-content">
        <div id="ds-export-panel">
          <button
            class="ds-insert-btn"
            onclick="FB.design.library.insertIntoPage()"
          >
            Insert into Page →
          </button>
          <div class="ds-export-row">
            <button
              class="ds-export-btn"
              onclick="FB.design.library.exportPNG()"
            >
              Export PNG
            </button>
            <button
              class="ds-export-btn"
              onclick="FB.design.library.exportSVG()"
            >
              Export SVG
            </button>
          </div>
          <div class="ds-section-label" style="margin-top:12px;">
            Canvas Background
          </div>
          <div id="ds-canvas-bg-picker"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- OVERLAYS: keep existing markup verbatim from current framework-builder.html.
       ds-template-overlay and ds-ai-overlay are unchanged.
       ds-library-overlay is REMOVED (My Designs now lives in Assets tab). -->
</div>
```

**Remove entirely from HTML:**

- `#ds-align-bar` (the bar above the canvas — replaced by Align tab)
- `#ds-actions` (Templates/AI/My Designs buttons — integrated into tabs)
- `#ds-insert-actions` (old right panel bottom — now in Export tab)
- `#ds-library-overlay` (My Designs modal — Assets tab replaces it)

---

## 2. CSS (`css/design.css`)

Full rewrite. Key rules:

```css
/* Layout */
#design-studio {
  display: flex;
  flex-direction: column;
}
#ds-topbar {
  height: 48px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  background: #111;
  border-bottom: 1px solid #1e1e2e;
  flex-shrink: 0;
}
#ds-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Panels */
#ds-left-panel {
  width: 240px;
  min-width: 240px;
  background: #111;
  border-right: 1px solid #1e1e2e;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
#ds-right-panel {
  width: 240px;
  min-width: 240px;
  background: #111;
  border-left: 1px solid #1e1e2e;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
#ds-canvas-column {
  flex: 1;
  overflow: hidden;
  background: repeating-linear-gradient(
    45deg,
    #111 0,
    #111 5px,
    #161620 5px,
    #161620 10px
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Tabs */
.ds-tab-row {
  display: flex;
  border-bottom: 1px solid #1e1e2e;
  flex-shrink: 0;
}
.ds-tab {
  flex: 1;
  padding: 9px 4px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #555;
  font-size: 10px;
  cursor: pointer;
  letter-spacing: 0.5px;
}
.ds-tab:hover {
  color: #aaa;
}
.ds-tab.active {
  color: #cdfe00;
  border-bottom-color: #cdfe00;
}

/* Tab content */
.ds-tab-content {
  display: none;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
}
.ds-tab-content.active {
  display: flex;
}

/* Top bar elements */
.ds-title-input {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  width: 160px;
  outline: none;
  padding: 4px 6px;
  border-radius: 4px;
}
.ds-title-input:hover {
  background: #1a1a2a;
}
.ds-title-input:focus {
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
}
.ds-icon-btn {
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
  border-radius: 5px;
  color: #888;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 14px;
}
.ds-icon-btn:hover {
  color: #fff;
  border-color: #555;
}
.ds-divider {
  width: 1px;
  height: 20px;
  background: #2a2a3a;
}

/* Tool row (4 buttons) */
#ds-tool-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  padding: 8px;
  border-bottom: 1px solid #1e1e2e;
  flex-shrink: 0;
}
.ds-tool-btn {
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
  border-radius: 6px;
  color: #888;
  padding: 7px 0;
  cursor: pointer;
  font-size: 13px;
  text-align: center;
  transition: all 0.15s;
}
.ds-tool-btn:hover {
  border-color: #555;
  color: #ccc;
}
.ds-tool-btn.active {
  background: rgba(205, 254, 0, 0.12);
  border-color: #cdfe00;
  color: #cdfe00;
}

/* Elements body sections */
#ds-elements-body {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.ds-section-label {
  font-size: 9px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 6px;
  padding: 0 10px;
}
.ds-frame-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}
.ds-frame-tile {
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
  border-radius: 5px;
  padding: 6px 8px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.ds-frame-tile:hover {
  border-color: #cdfe00;
}
.ds-frame-name {
  font-size: 10px;
  color: #aaa;
}
.ds-frame-size {
  font-size: 8px;
  color: #444;
  margin-top: 1px;
}
.ds-shape-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
}
.ds-shape-tile {
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
  border-radius: 5px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: #777;
  transition: all 0.15s;
}
.ds-shape-tile:hover {
  border-color: #cdfe00;
  color: #cdfe00;
}
.ds-text-presets {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ds-text-preset {
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
  border-radius: 5px;
  padding: 8px 10px;
  cursor: pointer;
  transition: border-color 0.15s;
}
.ds-text-preset:hover {
  border-color: #cdfe00;
}
#ds-icon-search {
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
  border-radius: 5px;
  color: #aaa;
  font-size: 10px;
  padding: 6px 8px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 6px;
  outline: none;
}
#ds-icon-search:focus {
  border-color: #cdfe00;
}
.ds-icon-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
}
.ds-icon-tile {
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
  border-radius: 4px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 0.15s;
}
.ds-icon-tile:hover {
  border-color: #cdfe00;
  color: #cdfe00;
}
.ds-bg-swatches {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 4px;
}
.ds-bg-swatch {
  height: 30px;
  border-radius: 5px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.15s;
}
.ds-bg-swatch:hover {
  border-color: #cdfe00;
}

/* Layers list (same as before, just in tab now) */
#ds-layers-list {
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
/* .ds-layer-row — keep existing styles */

/* Assets tab */
.ds-full-btn {
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
  border-radius: 5px;
  color: #aaa;
  font-size: 10px;
  padding: 7px;
  width: calc(100% - 16px);
  margin: 8px 8px 0;
  cursor: pointer;
  text-align: left;
}
.ds-full-btn:hover {
  border-color: #555;
  color: #fff;
}
#ds-assets-designs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
  padding: 6px 8px;
}
/* .ds-builder-thumb — keep existing styles */

/* Right panel props — keep existing styles for .ds-prop-group, .ds-input, etc. */

/* Align tab */
#ds-align-panel {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ds-align-group-label {
  font-size: 9px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 4px;
}
.ds-align-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}
.ds-align-btn {
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
  border-radius: 5px;
  color: #777;
  padding: 8px 4px;
  cursor: pointer;
  font-size: 11px;
  text-align: center;
  transition: all 0.15s;
}
.ds-align-btn:hover {
  border-color: #555;
  color: #fff;
}
.ds-order-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
}
.ds-dist-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

/* Export tab */
#ds-export-panel {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ds-insert-btn {
  background: #cdfe00;
  border: none;
  border-radius: 6px;
  color: #000;
  font-weight: 700;
  padding: 10px;
  cursor: pointer;
  font-size: 11px;
  width: 100%;
}
.ds-insert-btn:hover {
  background: #b8e600;
}
.ds-export-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}
.ds-export-btn {
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
  border-radius: 5px;
  color: #aaa;
  font-size: 10px;
  padding: 7px;
  cursor: pointer;
}
.ds-export-btn:hover {
  border-color: #555;
  color: #fff;
}
#ds-canvas-bg-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
}

/* Keep existing: .ds-save-btn, .ds-back-btn, #ds-preset-select, #ds-zoom-controls, 
   modal overlay styles, .ds-template-thumb, .ds-prop-group, .ds-input, .ds-color-swatch,
   .ds-select, .ds-sm-btn, .ds-color-row, .ds-prop-row, .ds-prop-label */

/* Remove: #ds-align-bar, .ds-sep, #ds-actions, .ds-action-btn, #ds-tools, .ds-tools-grid,
   #ds-insert-actions, #ds-layers-panel (wrapper), .ds-panel-label */
```

---

## 3. JS Changes (`js/design.js`)

### 3a. New: `FB.design.switchLeftTab(tab)` and `FB.design.switchRightTab(tab)` (top-level functions)

```js
FB.design.switchLeftTab = function (tab) {
  document.querySelectorAll("#ds-left-tabs .ds-tab").forEach(function (b) {
    b.classList.toggle("active", b.dataset.tab === tab);
  });
  document
    .querySelectorAll("#ds-tab-elements,#ds-tab-layers,#ds-tab-assets")
    .forEach(function (el) {
      el.classList.toggle("active", el.id === "ds-tab-" + tab);
    });
  if (tab === "assets") FB.design._loadAssets();
};

FB.design.switchRightTab = function (tab) {
  document.querySelectorAll("#ds-right-tabs .ds-tab").forEach(function (b) {
    b.classList.toggle("active", b.dataset.tab === tab);
  });
  document
    .querySelectorAll("#ds-tab-design,#ds-tab-align,#ds-tab-export")
    .forEach(function (el) {
      el.classList.toggle("active", el.id === "ds-tab-" + tab);
    });
};

FB.design._loadAssets = function () {
  // Renders My Designs into #ds-assets-designs using same fetch/esc pattern as loadBuilderDesigns
  // Thumbnails call FB.design.library.loadDesign(slug) on click
  fetch("/api/designs")
    .then((r) => r.json())
    .then(function (list) {
      var esc = FB.design._esc;
      var el = document.getElementById("ds-assets-designs");
      el.innerHTML = list.length
        ? list
            .map(function (d) {
              return (
                '<div class="ds-builder-thumb" onclick="FB.design.library.loadDesign(\'' +
                esc(d.slug) +
                "')\">" +
                (d.thumbnail
                  ? '<img src="' +
                    esc(d.thumbnail) +
                    '" alt="' +
                    esc(d.name) +
                    '">'
                  : '<div style="height:60px;background:#1a1a2a"></div>') +
                '<div class="ds-builder-thumb-label">' +
                esc(d.name) +
                "</div></div>"
              );
            })
            .join("")
        : '<p style="color:#555;font-size:10px;padding:8px;">No saved designs yet.</p>';
    });
};
```

### 3b. New: `FB.design.elements` module

```js
FB.design.elements = (function () {
  var FRAMES = [
    { key: "hero", name: "Hero Banner", w: 1920, h: 600 },
    { key: "og", name: "OG Image", w: 1200, h: 630 },
    { key: "card", name: "Feature Card", w: 800, h: 600 },
    { key: "square", name: "Square Post", w: 1080, h: 1080 },
    { key: "wide", name: "Wide 16:9", w: 1920, h: 1080 },
  ];

  var SHAPES = [
    { type: "rect", label: "▬", title: "Rectangle" },
    { type: "rect-r", label: "▭", title: "Rounded Rect" },
    { type: "circle", label: "⬤", title: "Circle" },
    { type: "tri", label: "▲", title: "Triangle" },
    { type: "poly", label: "⬡", title: "Polygon" },
    { type: "star", label: "★", title: "Star" },
    { type: "line", label: "—", title: "Line" },
    { type: "arrow", label: "→", title: "Arrow" },
    { type: "dashed", label: "╌", title: "Dashed Line" },
    { type: "heart", label: "♡", title: "Heart" },
  ];

  var TEXT_PRESETS = [
    {
      id: "heading",
      label: "Add a Heading",
      fontSize: 64,
      fontWeight: 800,
      fill: "#ffffff",
    },
    {
      id: "subheading",
      label: "Add a Subheading",
      fontSize: 36,
      fontWeight: 600,
      fill: "#cccccc",
    },
    {
      id: "body",
      label: "Add body text",
      fontSize: 18,
      fontWeight: 400,
      fill: "#aaaaaa",
    },
    {
      id: "caption",
      label: "Add a caption",
      fontSize: 13,
      fontWeight: 400,
      fill: "#888888",
    },
  ];

  // 60 icons: unicode char + name + search tags
  var ICONS = [
    { char: "☰", name: "menu", tags: ["hamburger", "nav", "list"] },
    { char: "✕", name: "close", tags: ["x", "cancel", "delete"] },
    { char: "✓", name: "check", tags: ["tick", "done", "complete"] },
    { char: "⚙", name: "settings", tags: ["gear", "config", "options"] },
    { char: "♡", name: "heart", tags: ["love", "like", "favourite"] },
    { char: "★", name: "star", tags: ["favourite", "rating", "award"] },
    { char: "✉", name: "email", tags: ["mail", "message", "envelope"] },
    { char: "☎", name: "phone", tags: ["call", "contact", "telephone"] },
    { char: "⊕", name: "plus-circle", tags: ["add", "new", "create"] },
    { char: "⊖", name: "minus-circle", tags: ["remove", "delete", "subtract"] },
    { char: "→", name: "arrow-right", tags: ["next", "forward", "navigate"] },
    { char: "←", name: "arrow-left", tags: ["back", "previous", "navigate"] },
    { char: "↑", name: "arrow-up", tags: ["up", "navigate", "scroll"] },
    { char: "↓", name: "arrow-down", tags: ["down", "navigate", "scroll"] },
    { char: "⬆", name: "upload", tags: ["up", "send", "export"] },
    { char: "⬇", name: "download", tags: ["down", "save", "import"] },
    { char: "↗", name: "external", tags: ["link", "open", "new-tab"] },
    { char: "⟳", name: "refresh", tags: ["reload", "sync", "repeat"] },
    { char: "◉", name: "target", tags: ["aim", "focus", "goal"] },
    { char: "◈", name: "diamond", tags: ["gem", "premium", "special"] },
    { char: "⚡", name: "lightning", tags: ["fast", "energy", "power"] },
    { char: "🔒", name: "lock", tags: ["secure", "private", "password"] },
    { char: "🔓", name: "unlock", tags: ["open", "access", "public"] },
    { char: "🔗", name: "link", tags: ["chain", "connect", "url"] },
    { char: "📋", name: "clipboard", tags: ["copy", "paste", "notes"] },
    { char: "📊", name: "chart", tags: ["graph", "data", "analytics"] },
    { char: "📷", name: "camera", tags: ["photo", "image", "media"] },
    { char: "🎯", name: "bullseye", tags: ["target", "goal", "aim"] },
    { char: "💡", name: "lightbulb", tags: ["idea", "insight", "tip"] },
    { char: "🛒", name: "cart", tags: ["shop", "ecommerce", "buy"] },
    { char: "📍", name: "pin", tags: ["location", "map", "place"] },
    { char: "📱", name: "mobile", tags: ["phone", "app", "device"] },
    { char: "💻", name: "laptop", tags: ["computer", "device", "tech"] },
    { char: "🖥", name: "desktop", tags: ["screen", "monitor", "computer"] },
    { char: "🎨", name: "palette", tags: ["design", "art", "color"] },
    { char: "✏", name: "pencil", tags: ["edit", "write", "draw"] },
    { char: "🗂", name: "folder", tags: ["files", "organise", "directory"] },
    { char: "🔔", name: "bell", tags: ["notification", "alert", "reminder"] },
    { char: "👁", name: "eye", tags: ["view", "visible", "watch"] },
    { char: "⊞", name: "grid", tags: ["layout", "tiles", "gallery"] },
    { char: "≡", name: "align", tags: ["center", "justify", "text"] },
    { char: "⊢", name: "align-left", tags: ["left", "text", "layout"] },
    { char: "⊣", name: "align-right", tags: ["right", "text", "layout"] },
    { char: "◐", name: "half-circle", tags: ["half", "split", "contrast"] },
    { char: "▦", name: "grid-fill", tags: ["pattern", "texture", "layout"] },
    { char: "◆", name: "diamond-fill", tags: ["shape", "bullet", "mark"] },
    { char: "⬢", name: "hexagon", tags: ["shape", "honeycomb", "tech"] },
    { char: "▣", name: "square-dot", tags: ["layout", "placeholder", "frame"] },
    { char: "∞", name: "infinity", tags: ["loop", "unlimited", "forever"] },
    { char: "©", name: "copyright", tags: ["legal", "brand", "rights"] },
    { char: "®", name: "registered", tags: ["trademark", "brand", "legal"] },
    { char: "™", name: "trademark", tags: ["brand", "legal", "mark"] },
    { char: "№", name: "number", tags: ["num", "hash", "count"] },
    { char: "‣", name: "bullet", tags: ["list", "point", "item"] },
    { char: "»", name: "chevron-right", tags: ["next", "more", "arrow"] },
    { char: "«", name: "chevron-left", tags: ["back", "prev", "arrow"] },
    { char: "⋮", name: "more-vertical", tags: ["menu", "dots", "options"] },
    { char: "…", name: "ellipsis", tags: ["more", "dots", "continue"] },
    { char: "✦", name: "sparkle", tags: ["ai", "magic", "star", "highlight"] },
    { char: "⊗", name: "cross-circle", tags: ["close", "error", "cancel"] },
  ];

  var BACKGROUNDS = [
    { value: "#111111", label: "Black" },
    { value: "#ffffff", label: "White" },
    { value: "#0d0d1a", label: "Deep Navy" },
    { value: "#1a1a2a", label: "Dark Blue" },
    { value: "#f5f5f0", label: "Off White" },
    {
      value: "linear-gradient(135deg,#0d0d1a 0%,#1a1a2a 100%)",
      label: "Navy Fade",
    },
    {
      value: "linear-gradient(135deg,#111111 0%,#cdfe0022 100%)",
      label: "Neon Fade",
    },
    {
      value: "linear-gradient(135deg,#1a1a2a 0%,#2a1a3a 100%)",
      label: "Purple Dark",
    },
    {
      value: "linear-gradient(to right,#0d0d1a,#1a2a1a)",
      label: "Dark Forest",
    },
    {
      value: "linear-gradient(135deg,#f5f5f0 0%,#e8e8e0 100%)",
      label: "Paper",
    },
  ];

  var _iconQuery = "";

  function render() {
    _renderToolRow();
    _renderElementsBody();
  }

  function _renderToolRow() {
    var fc = FB.design.canvas.get();
    var active = FB.design.tools.active();
    var el = document.getElementById("ds-tool-row");
    el.innerHTML = [
      { id: "select", label: "▶", title: "Select (V)" },
      { id: "text", label: "T", title: "Text (T)" },
      { id: "image", label: "🖼", title: "Upload Image (I)" },
      { id: "ai", label: "✦", title: "AI Generate" },
    ]
      .map(function (t) {
        var isActive = t.id === active || (t.id === "ai" && false);
        return (
          '<button class="ds-tool-btn' +
          (isActive ? " active" : "") +
          '" ' +
          'title="' +
          t.title +
          '" ' +
          'onclick="' +
          (t.id === "ai"
            ? "FB.design.ai.open()"
            : "FB.design.tools.setTool('" + t.id + "')") +
          '">' +
          t.label +
          "</button>"
        );
      })
      .join("");
  }

  function _renderElementsBody() {
    var el = document.getElementById("ds-elements-body");
    el.innerHTML =
      _framesHtml() +
      _shapesHtml() +
      _textHtml() +
      _iconsHtml() +
      _backgroundsHtml();
  }

  function _framesHtml() {
    return (
      "<div>" +
      '<div class="ds-section-label" style="padding:0;">Frames</div>' +
      '<div class="ds-frame-grid">' +
      FRAMES.map(function (f) {
        return (
          '<div class="ds-frame-tile" onclick="FB.design.canvas.applyPreset(\'' +
          f.key +
          "')\">" +
          '<div class="ds-frame-name">' +
          f.name +
          "</div>" +
          '<div class="ds-frame-size">' +
          f.w +
          "×" +
          f.h +
          "</div>" +
          "</div>"
        );
      }).join("") +
      "</div></div>"
    );
  }

  function _shapesHtml() {
    return (
      "<div>" +
      '<div class="ds-section-label" style="padding:0;">Shapes</div>' +
      '<div class="ds-shape-grid">' +
      SHAPES.map(function (s) {
        return (
          '<div class="ds-shape-tile" title="' +
          s.title +
          '" onclick="FB.design.elements.addShape(\'' +
          s.type +
          "')\">" +
          s.label +
          "</div>"
        );
      }).join("") +
      "</div></div>"
    );
  }

  function _textHtml() {
    return (
      "<div>" +
      '<div class="ds-section-label" style="padding:0;">Text</div>' +
      '<div class="ds-text-presets">' +
      TEXT_PRESETS.map(function (p) {
        return (
          '<div class="ds-text-preset" onclick="FB.design.elements.addTextPreset(\'' +
          p.id +
          "')\">" +
          '<span style="font-size:' +
          Math.min(p.fontSize * 0.22, 15) +
          "px;font-weight:" +
          p.fontWeight +
          ";color:" +
          p.fill +
          ';">' +
          p.label +
          "</span>" +
          "</div>"
        );
      }).join("") +
      "</div></div>"
    );
  }

  function _iconsHtml() {
    var filtered = _iconQuery
      ? ICONS.filter(function (ic) {
          var q = _iconQuery.toLowerCase();
          return (
            ic.name.indexOf(q) !== -1 ||
            ic.tags.some(function (t) {
              return t.indexOf(q) !== -1;
            })
          );
        })
      : ICONS;
    return (
      "<div>" +
      '<div class="ds-section-label" style="padding:0;">Icons</div>' +
      '<input id="ds-icon-search" placeholder="Search icons…" value="' +
      FB.design._esc(_iconQuery) +
      '" ' +
      'oninput="FB.design.elements._onIconSearch(this.value)" />' +
      '<div class="ds-icon-grid">' +
      filtered
        .map(function (ic) {
          return (
            '<div class="ds-icon-tile" title="' +
            ic.name +
            '" onclick="FB.design.elements.addIcon(\'' +
            ic.char +
            "','" +
            ic.name +
            "')\">" +
            ic.char +
            "</div>"
          );
        })
        .join("") +
      "</div></div>"
    );
  }

  function _backgroundsHtml() {
    return (
      "<div>" +
      '<div class="ds-section-label" style="padding:0;">Backgrounds</div>' +
      '<div class="ds-bg-swatches">' +
      BACKGROUNDS.map(function (bg) {
        return (
          '<div class="ds-bg-swatch" title="' +
          bg.label +
          '" style="background:' +
          bg.value +
          ';" ' +
          "onclick=\"FB.design.elements.setBackground('" +
          bg.value.replace(/'/g, "\\'") +
          "')\">" +
          "</div>"
        );
      }).join("") +
      "</div></div>"
    );
  }

  function _onIconSearch(q) {
    _iconQuery = q;
    // Re-render only the icon section to avoid losing search focus
    var el = document.getElementById("ds-elements-body");
    // Replace icon section HTML — find and update by re-rendering full body
    // Simple approach: re-render entire elements body (fast enough)
    _renderElementsBody();
    // Restore focus to search input
    var inp = document.getElementById("ds-icon-search");
    if (inp) {
      inp.focus();
      inp.setSelectionRange(q.length, q.length);
    }
  }

  function addShape(type) {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var cx = fc.getWidth() / 2,
      cy = fc.getHeight() / 2;
    var defaults = {
      left: cx - 60,
      top: cy - 40,
      fill: "#4a90e2",
      stroke: "transparent",
      strokeWidth: 0,
      originX: "left",
      originY: "top",
      name: "",
    };
    var obj;
    if (type === "rect")
      obj = new fabric.Rect(
        Object.assign({ width: 120, height: 80, name: "Rectangle" }, defaults),
      );
    if (type === "rect-r")
      obj = new fabric.Rect(
        Object.assign(
          { width: 120, height: 80, rx: 12, ry: 12, name: "Rounded Rect" },
          defaults,
        ),
      );
    if (type === "circle")
      obj = new fabric.Ellipse(
        Object.assign({ rx: 60, ry: 40, name: "Circle" }, defaults),
      );
    if (type === "tri")
      obj = new fabric.Triangle(
        Object.assign({ width: 120, height: 100, name: "Triangle" }, defaults),
      );
    if (type === "poly")
      obj = new fabric.Polygon(
        [
          { x: 0, y: 50 },
          { x: 50, y: 0 },
          { x: 100, y: 50 },
          { x: 75, y: 100 },
          { x: 25, y: 100 },
        ],
        Object.assign({ name: "Polygon" }, defaults),
      );
    if (type === "star")
      obj = new fabric.Polygon(
        _starPoints(5, 60, 30),
        Object.assign({ left: cx - 60, top: cy - 60, name: "Star" }, defaults),
      );
    if (type === "line")
      obj = new fabric.Line([cx - 60, cy, cx + 60, cy], {
        stroke: "#4a90e2",
        strokeWidth: 3,
        name: "Line",
      });
    if (type === "arrow") {
      obj = new fabric.Line([cx - 60, cy, cx + 60, cy], {
        stroke: "#4a90e2",
        strokeWidth: 3,
        name: "Arrow",
      });
      obj._isArrow = true;
    }
    if (type === "dashed")
      obj = new fabric.Line([cx - 60, cy, cx + 60, cy], {
        stroke: "#4a90e2",
        strokeWidth: 3,
        strokeDashArray: [10, 6],
        name: "Dashed Line",
      });
    if (type === "heart")
      obj = new fabric.IText("♡", {
        left: cx - 20,
        top: cy - 20,
        fontSize: 80,
        fill: "#e74c3c",
        fontFamily: "Lexend",
        name: "Heart",
        styles: {},
      });
    if (!obj) return;
    fc.add(obj);
    fc.setActiveObject(obj);
    fc.renderAll();
    FB.design.tools.setTool("select");
  }

  function _starPoints(n, outerR, innerR) {
    var pts = [],
      step = Math.PI / n;
    for (var i = 0; i < 2 * n; i++) {
      var r = i % 2 === 0 ? outerR : innerR;
      var a = i * step - Math.PI / 2;
      pts.push({ x: r * Math.cos(a) + outerR, y: r * Math.sin(a) + outerR });
    }
    return pts;
  }

  function addTextPreset(id) {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var preset = TEXT_PRESETS.filter(function (p) {
      return p.id === id;
    })[0];
    if (!preset) return;
    var txt = new fabric.IText(preset.label, {
      left: fc.getWidth() / 2 - 150,
      top: fc.getHeight() / 2 - preset.fontSize / 2,
      fontFamily: "Lexend",
      fontSize: preset.fontSize,
      fontWeight: preset.fontWeight,
      fill: preset.fill,
      name: preset.id.charAt(0).toUpperCase() + preset.id.slice(1),
      styles: {},
    });
    fc.add(txt);
    fc.setActiveObject(txt);
    fc.renderAll();
    FB.design.tools.setTool("select");
  }

  function addIcon(char, name) {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var ic = new fabric.IText(char, {
      left: fc.getWidth() / 2 - 30,
      top: fc.getHeight() / 2 - 30,
      fontSize: 60,
      fill: "#ffffff",
      fontFamily: "Lexend",
      name: name || "Icon",
      styles: {},
    });
    fc.add(ic);
    fc.setActiveObject(ic);
    fc.renderAll();
    FB.design.tools.setTool("select");
  }

  function setBackground(value) {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    // Gradient: use fabric gradient object; solid: use colour string
    if (value.indexOf("gradient") !== -1) {
      // Parse linear-gradient for two-colour fade
      var colours = value.match(/#[0-9a-fA-F]+/g) || ["#111111", "#222222"];
      var grad = new fabric.Gradient({
        type: "linear",
        coords: { x1: 0, y1: 0, x2: fc.getWidth(), y2: fc.getHeight() },
        colorStops: [
          { offset: 0, color: colours[0] },
          { offset: 1, color: colours[colours.length - 1] },
        ],
      });
      fc.setBackgroundColor(grad, function () {
        fc.renderAll();
        FB.design.history.push();
      });
    } else {
      fc.setBackgroundColor(value, function () {
        fc.renderAll();
        FB.design.history.push();
      });
    }
  }

  return {
    render: render,
    addShape: addShape,
    addTextPreset: addTextPreset,
    addIcon: addIcon,
    setBackground: setBackground,
    _onIconSearch: _onIconSearch,
  };
})();
```

### 3c. Update `FB.design.align` — render into Align tab

Replace `FB.design._showAlignBar` with `FB.design.align.renderPanel()`:

```js
// In FB.design.align, add:
function renderPanel() {
  var fc = FB.design.canvas.get();
  var n = fc ? fc.getActiveObjects().length : 0;
  var el = document.getElementById("ds-align-panel");
  el.innerHTML =
    '<div class="ds-align-group-label">Align Objects</div>' +
    '<div class="ds-align-grid">' +
    [
      ["left", "⊢ Left"],
      ["centerH", "⊣⊢ Centre"],
      ["right", "⊣ Right"],
      ["top", "⊤ Top"],
      ["centerV", "≡ Mid"],
      ["bottom", "⊥ Bottom"],
    ]
      .map(function (a) {
        return (
          '<button class="ds-align-btn" onclick="FB.design.align.run(\'' +
          a[0] +
          "')\">" +
          a[1] +
          "</button>"
        );
      })
      .join("") +
    "</div>" +
    '<div class="ds-align-group-label" style="margin-top:8px;">Layer Order</div>' +
    '<div class="ds-order-grid">' +
    [
      ["bringToFront", "⤒ Front"],
      ["bringForward", "↑ Fwd"],
      ["sendBack", "↓ Back"],
      ["sendToBack", "⤓ Back"],
    ]
      .map(function (a) {
        return (
          '<button class="ds-align-btn" onclick="FB.design.align.run(\'' +
          a[0] +
          "')\">" +
          a[1] +
          "</button>"
        );
      })
      .join("") +
    "</div>" +
    (n >= 3
      ? '<div class="ds-align-group-label" style="margin-top:8px;">Distribute</div>' +
        '<div class="ds-dist-row">' +
        '<button class="ds-align-btn" onclick="FB.design.align.run(\'distributeH\')">⇔ H</button>' +
        '<button class="ds-align-btn" onclick="FB.design.align.run(\'distributeV\')">⇕ V</button>' +
        "</div>"
      : "");
}
```

Remove all calls to `FB.design._showAlignBar(show)` from `_bindEvents` (three places: `selection:created`, `selection:updated`, `selection:cleared`). Replace with `FB.design.align.renderPanel()` in all three. Remove `FB.design._showAlignBar` itself.

### 3d. Update `FB.design.tools` — 4 tools only

Remove the old 9-tool `TOOLS` array and `render()` entirely — tool rendering now lives in `FB.design.elements._renderToolRow()`. The `setTool()` and `bindMouseDraw()` functions remain unchanged. After calling `setTool(id)`, also call `FB.design.elements._renderToolRow()` to update the active button highlight.

### 3e. Update `FB.design.canvas.init()`

After init, also call `FB.design.elements.render()`:

```js
FB.design.elements.render();
FB.design.align.renderPanel();
```

### 3f. Export tab canvas background picker

`FB.design.renderExportTab()` renders a colour swatch + hex input into `#ds-canvas-bg-picker`. Call it:

- Once in `FB.design.canvas.init()` after the canvas is ready
- Each time the user switches to the Export right tab (add to `FB.design.switchRightTab` when `tab === 'export'`)

```js
FB.design.renderExportTab = function () {
  var fc = FB.design.canvas.get();
  var bg =
    typeof fc.backgroundColor === "string" ? fc.backgroundColor : "#ffffff";
  var el = document.getElementById("ds-canvas-bg-picker");
  el.innerHTML =
    '<input type="color" class="ds-color-swatch" value="' +
    (bg.startsWith("#") ? bg : "#ffffff") +
    '" ' +
    'onchange="FB.design.props.setCanvasBg(this.value)"/>' +
    '<input class="ds-input" style="flex:1" value="' +
    FB.design._esc(bg) +
    '" onchange="FB.design.props.setCanvasBg(this.value)"/>';
};
```

---

## 4. Behaviours

### Clicking a shape tile

`FB.design.elements.addShape(type)` — places shape centred on canvas, selects it, switches to select tool. No drag-to-draw required (still available via drawing tools internally but shapes primarily added by clicking tiles).

### Clicking a text preset tile

`FB.design.elements.addTextPreset(id)` — places IText at canvas centre with preset fontSize/fontWeight/fill, immediately selectable. Enters editing on double-click as normal.

### Clicking an icon tile

`FB.design.elements.addIcon(char, name)` — places IText with unicode char at 60px. Resizable via transform handles. Font/colour editable in Design tab.

### Clicking a background swatch

`FB.design.elements.setBackground(value)` — applies colour or gradient to canvas background. Pushes to history.

### Clicking a frame tile

Calls `FB.design.canvas.applyPreset(key)` — resizes canvas dimensions. Existing objects are preserved (not cleared).

### Assets tab (My Designs)

Loaded when user switches to Assets tab. Clicking a thumbnail calls `FB.design.library.loadDesign(slug)` with existing confirm dialog.

### Align tab

Always rendered; `renderPanel()` called on every selection change event. Distribute buttons only appear when 3+ objects selected.

### Tab state on init

Left tab defaults to Elements; right tab defaults to Design. State is in-memory (not persisted).

---

## 5. What's Removed

| Was                                                         | Gone                                                      |
| ----------------------------------------------------------- | --------------------------------------------------------- |
| `#ds-align-bar` (bar above canvas)                          | Align tab in right panel                                  |
| `#ds-actions` (3 action buttons in left panel)              | AI in tool row; Templates in Assets tab                   |
| `#ds-library-overlay` (My Designs modal)                    | Assets tab                                                |
| `#ds-insert-actions` (right panel bottom buttons)           | Export tab                                                |
| `FB.design._showAlignBar()`                                 | `FB.design.align.renderPanel()`                           |
| 9-button tool grid                                          | 4 tools in tool row; shapes/text via element tiles        |
| `.ds-action-btn` class                                      | `.ds-full-btn`, tab structure                             |
| `FB.panels.loadBuilderDesigns` uses `#builder-designs-grid` | Also load into `#ds-assets-designs` when Assets tab opens |

---

## 6. What's Unchanged

- `FB.design.history` (undo/redo, push, silent)
- `FB.design.canvas` (Fabric init, zoom/pan, keyboard shortcuts, `applyPreset`)
- `FB.design.props` (render, setProp, setWidth, setHeight, flip, setCanvasBg) — same DOM target `#ds-props`, now inside Design tab
- `FB.design.library` (save, loadDesign, exportPNG, exportSVG, insertIntoPage)
- `FB.design.templates` (open/close/load modal)
- `FB.design.ai` (open/close/generate modal)
- `FB.design.layers` (`render()`, `select()`, `toggleVis()`, `ctxMenu()`) — same `#ds-layers-list` DOM ID, now inside Layers tab
- `widgets/design-templates.js` — template data unchanged
- `server.py` — no changes
- `js/canvas.js`, `js/panels.js` — no changes
