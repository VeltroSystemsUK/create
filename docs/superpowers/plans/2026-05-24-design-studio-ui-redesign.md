# Design Studio UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current "Microsoft Paint" Design Studio UI with a Figma-style three-panel layout featuring an Elements library (shapes, text presets, icons, backgrounds, frames), tabbed left sidebar (Elements/Layers/Assets), and tabbed right panel (Design/Align/Export).

**Architecture:** Pure UI restructure — the Fabric.js canvas, history, save/load, and AI modules are untouched. Changes are confined to `framework-builder.html` (new DOM structure), `css/design.css` (complete rewrite keeping props/modal rules), and `js/design.js` (new `FB.design.elements` IIFE, updated tools/align/canvas modules). No server changes, no new files.

**Tech Stack:** Vanilla JS (no build pipeline), Fabric.js 5.3.1, served by `python3 server.py` on port 8899.

---

## Context

The app is a web-based page builder. The Design Studio is a full-screen overlay (flex layout, `position:absolute`) triggered by a toolbar button. It currently has a 200px left panel with 9 tiny emoji tool icons, a layers list, and 3 action buttons at the bottom — all very cramped. The right panel is 200px with object properties and insert/export buttons. There is no element library.

The redesign adds:

- **Left panel (240px)**: 3 tabs — Elements (frames, shapes, text, icons, backgrounds), Layers, Assets
- **Right panel (240px)**: 3 tabs — Design (properties), Align, Export
- **Top bar**: editable design name, undo/redo buttons, save button

All existing functional code (`FB.design.history`, `FB.design.props`, `FB.design.layers`, `FB.design.library`, `FB.design.templates`, `FB.design.ai`) is preserved and continues to work with the same DOM IDs it targets (`#ds-props`, `#ds-layers-list`, etc.).

---

## File Map

| File                     | What changes                                                                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `framework-builder.html` | Replace `#design-studio` div (lines 644–793); delete `#ds-library-overlay` (lines 821–829); bump `css/design.css?v=2` and `js/design.js?v=2` |
| `css/design.css`         | Complete replacement — new rules + kept props/modal/layer-row rules from old file                                                            |
| `js/design.js`           | Add 3 top-level functions; add `FB.design.elements` IIFE; edit `FB.design.tools`; edit `FB.design.align`; edit `FB.design.canvas.init()`     |

---

## Task 1: HTML Restructure

**Files:**

- Modify: `framework-builder.html:24` (version bump css)
- Modify: `framework-builder.html:644–793` (replace design-studio div)
- Modify: `framework-builder.html:821–829` (delete library overlay)
- Modify: `framework-builder.html:902` (version bump js)

- [ ] **Step 1: Bump version strings**

Find and update these two lines in `framework-builder.html`:

```html
<!-- line 24: change v=1 to v=2 -->
<link rel="stylesheet" href="css/design.css?v=2" />

<!-- line 902: change v=1 to v=2 -->
<script src="js/design.js?v=2"></script>
```

- [ ] **Step 2: Replace the design-studio div**

Find this opening tag (line 644):

```html
<div id="design-studio" style="display: none"></div>
```

and replace everything from that line through the closing `</div>` on line 793 with:

```html
<div id="design-studio" style="display: none">
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

      <div id="ds-tab-elements" class="ds-tab-content active">
        <div id="ds-tool-row"></div>
        <div id="ds-elements-body"></div>
      </div>

      <div id="ds-tab-layers" class="ds-tab-content">
        <div id="ds-layers-list"></div>
      </div>

      <div id="ds-tab-assets" class="ds-tab-content">
        <button class="ds-full-btn" onclick="FB.design.templates.open()">
          ⊞ Browse Templates
        </button>
        <div class="ds-section-label" style="padding:8px 8px 4px;">
          My Designs
        </div>
        <div id="ds-assets-designs"></div>
        <button
          class="ds-full-btn"
          style="margin:6px 8px;"
          onclick="FB.design._loadAssets()"
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

      <div id="ds-tab-design" class="ds-tab-content active">
        <div id="ds-props"></div>
      </div>

      <div id="ds-tab-align" class="ds-tab-content">
        <div id="ds-align-panel"></div>
      </div>

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
          <div class="ds-section-label" style="padding:12px 0 4px;">
            Canvas Background
          </div>
          <div id="ds-canvas-bg-picker"></div>
        </div>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Delete the library overlay**

Find and delete these 9 lines (around line 821 after the step above):

```html
<div id="ds-library-overlay" style="display: none">
  <div id="ds-library-modal">
    <div class="ds-modal-head">
      <span>My Designs</span>
      <button onclick="FB.design.library.closePicker()">✕</button>
    </div>
    <div id="ds-library-grid"></div>
  </div>
</div>
```

Leave `#ds-template-overlay` and `#ds-ai-overlay` untouched.

- [ ] **Step 4: Verify the page still loads**

```bash
# Server should already be running on port 8899
curl -s http://localhost:8899/ | grep "design-studio" | head -3
```

Expected: one line containing `id="design-studio"`. If the server isn't running: `python3 server.py &`

- [ ] **Step 5: Commit**

```bash
git add framework-builder.html
git commit -m "feat: design studio HTML — Figma-style three-panel layout with element library tabs"
```

---

## Task 2: CSS Rewrite

**Files:**

- Modify: `css/design.css` (complete replacement)

The old file is 557 lines. Replace it entirely with the content below, which includes all new rules plus the kept rules from the old file (props panel, modal overlays, layer rows, builder thumbnails).

- [ ] **Step 1: Write the new design.css**

Replace the entire contents of `css/design.css` with:

```css
/* ── DESIGN STUDIO LAYOUT ─────────────────────────────────── */
#design-studio {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #0a0a14;
  z-index: 10;
}

/* TOP BAR */
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
.ds-title-input {
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  width: 160px;
  outline: none;
  padding: 4px 6px;
}
.ds-title-input:hover {
  background: #1a1a2a;
}
.ds-title-input:focus {
  background: #1a1a2a;
  border-color: #2a2a3a;
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
  display: flex;
  align-items: center;
  justify-content: center;
}
.ds-icon-btn:hover {
  color: #fff;
  border-color: #555;
}
.ds-divider {
  width: 1px;
  height: 20px;
  background: #2a2a3a;
  flex-shrink: 0;
}
.ds-back-btn {
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
  border-radius: 5px;
  color: #aaa;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 10px;
  white-space: nowrap;
}
.ds-back-btn:hover {
  border-color: #555;
  color: #fff;
}
.ds-save-btn {
  background: #cdfe00;
  border: none;
  border-radius: 5px;
  color: #000;
  font-weight: 700;
  padding: 5px 14px;
  cursor: pointer;
  font-size: 11px;
}
.ds-save-btn:hover {
  background: #b8e600;
}
#ds-preset-select {
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
  border-radius: 4px;
  color: #ccc;
  font-size: 10px;
  padding: 4px 6px;
}
#ds-zoom-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}
#ds-zoom-controls button {
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
  border-radius: 3px;
  color: #aaa;
  padding: 3px 8px;
  cursor: pointer;
  font-size: 11px;
}
#ds-zoom-controls button:hover {
  border-color: #555;
  color: #fff;
}
#ds-zoom-label {
  font-size: 10px;
  color: #666;
  min-width: 36px;
  text-align: center;
}
#ds-size-label {
  font-size: 10px;
  color: #555;
}

/* MAIN AREA */
#ds-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ── PANELS ───────────────────────────────────────────────── */
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
  position: relative;
}
#ds-canvas-wrap canvas {
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.6);
}

/* ── TABS ─────────────────────────────────────────────────── */
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
  transition: color 0.15s;
}
.ds-tab:hover {
  color: #aaa;
}
.ds-tab.active {
  color: #cdfe00;
  border-bottom-color: #cdfe00;
}

.ds-tab-content {
  display: none;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
}
.ds-tab-content.active {
  display: flex;
}

/* ── ELEMENTS TAB ─────────────────────────────────────────── */
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
}

/* Frames */
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

/* Shapes */
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

/* Text presets */
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

/* Icons */
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

/* Backgrounds */
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

/* ── LAYERS TAB ───────────────────────────────────────────── */
#ds-layers-list {
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ds-layer-row {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 6px;
  border-radius: 4px;
  border: 1px solid #2a2a3a;
  background: #1a1a2a;
  cursor: pointer;
  font-size: 10px;
  color: #888;
  user-select: none;
}
.ds-layer-row:hover {
  border-color: #555;
  color: #ccc;
}
.ds-layer-row.selected {
  background: rgba(205, 254, 0, 0.1);
  border-color: #cdfe00;
  color: #cdfe00;
}
.ds-layer-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ds-layer-vis {
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  font-size: 10px;
  padding: 0 2px;
}
.ds-layer-vis:hover {
  color: #ccc;
}

/* ── ASSETS TAB ───────────────────────────────────────────── */
.ds-full-btn {
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
  border-radius: 5px;
  color: #aaa;
  font-size: 10px;
  padding: 8px 10px;
  width: calc(100% - 16px);
  margin: 8px 8px 0;
  cursor: pointer;
  text-align: left;
  display: block;
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

/* ── RIGHT PANEL — DESIGN TAB ─────────────────────────────── */
#ds-props {
  padding: 10px;
}
.ds-prop-group {
  margin-bottom: 10px;
}
.ds-prop-label {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #555;
  margin-bottom: 4px;
}
.ds-prop-row {
  display: flex;
  gap: 4px;
  margin-bottom: 3px;
}
.ds-input {
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
  border-radius: 4px;
  color: #ccc;
  font-size: 10px;
  padding: 4px 6px;
  width: 100%;
  box-sizing: border-box;
}
.ds-input:focus {
  outline: none;
  border-color: #cdfe00;
}
.ds-color-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.ds-color-swatch {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 1px solid #444;
  cursor: pointer;
  flex-shrink: 0;
}
.ds-select {
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
  border-radius: 4px;
  color: #ccc;
  font-size: 10px;
  padding: 4px 6px;
  width: 100%;
}
.ds-btn-row {
  display: flex;
  gap: 3px;
}
.ds-sm-btn {
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
  border-radius: 4px;
  color: #888;
  font-size: 10px;
  padding: 4px 8px;
  cursor: pointer;
  flex: 1;
}
.ds-sm-btn:hover {
  border-color: #555;
  color: #fff;
}
.ds-sm-btn.active {
  background: rgba(205, 254, 0, 0.1);
  border-color: #cdfe00;
  color: #cdfe00;
}

/* ── RIGHT PANEL — ALIGN TAB ──────────────────────────────── */
#ds-align-panel {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
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
.ds-align-btn {
  background: #1a1a2a;
  border: 1px solid #2a2a3a;
  border-radius: 5px;
  color: #777;
  padding: 8px 4px;
  cursor: pointer;
  font-size: 10px;
  text-align: center;
  transition: all 0.15s;
}
.ds-align-btn:hover {
  border-color: #555;
  color: #fff;
}

/* ── RIGHT PANEL — EXPORT TAB ─────────────────────────────── */
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
  text-align: center;
}
.ds-export-btn:hover {
  border-color: #555;
  color: #fff;
}
#ds-canvas-bg-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
}

/* ── MODAL OVERLAYS (unchanged) ───────────────────────────── */
#ds-template-overlay,
#ds-ai-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
#ds-template-modal,
#ds-ai-modal {
  background: #1a1a2a;
  border: 1px solid #333;
  border-radius: 8px;
  width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
#ds-ai-modal {
  width: 420px;
}
.ds-modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #333;
  font-size: 13px;
  font-weight: 600;
  color: #ccc;
}
.ds-modal-head button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 14px;
}
.ds-modal-head button:hover {
  color: #ccc;
}
#ds-template-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 16px;
  overflow-y: auto;
}
.ds-template-thumb {
  border: 2px solid #333;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s;
}
.ds-template-thumb:hover {
  border-color: #cdfe00;
}
.ds-template-thumb img {
  width: 100%;
  height: auto;
  display: block;
}
.ds-thumb-label {
  font-size: 10px;
  color: #888;
  padding: 4px 6px;
  text-align: center;
}
#ds-ai-prompt {
  background: #111;
  border: 1px solid #333;
  border-radius: 4px;
  color: #ccc;
  font-size: 12px;
  padding: 8px;
  margin: 12px 16px;
  width: calc(100% - 32px);
  height: 80px;
  resize: vertical;
  box-sizing: border-box;
}
#ds-ai-modal .ds-save-btn {
  margin: 0 16px 8px;
  width: calc(100% - 32px);
  display: block;
}
#ds-ai-status {
  font-size: 11px;
  color: #888;
  padding: 0 16px 12px;
}

/* ── MY DESIGNS (builder left panel, unchanged) ───────────── */
.ds-builder-thumb-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 8px;
}
.ds-builder-thumb {
  border: 1px solid #2a2a3a;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s;
}
.ds-builder-thumb:hover {
  border-color: #cdfe00;
}
.ds-builder-thumb img {
  width: 100%;
  height: auto;
  display: block;
}
.ds-builder-thumb-label {
  font-size: 9px;
  color: #666;
  padding: 2px 4px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

- [ ] **Step 2: Verify CSS loads without errors**

Open http://localhost:8899 in browser. Open DevTools Console. Confirm no 404 for `design.css?v=2`. The page should still look like the builder (Design Studio isn't open yet).

- [ ] **Step 3: Commit**

```bash
git add css/design.css
git commit -m "feat: design studio CSS — new panel layout, tabs, element tiles, align/export panels"
```

---

## Task 3: Tab Switching and Export Tab Functions

**Files:**

- Modify: `js/design.js` (add 3 top-level functions after the `FB.design._esc` block at the top)

These functions are called by the HTML tab buttons added in Task 1 and by the canvas init in Task 5.

- [ ] **Step 1: Add tab switching functions to design.js**

Find this block near the top of `js/design.js` (around line 10):

```js
FB.design.init = function () {
  // Submodules initialised in their own tasks
};
```

Replace it with:

```js
FB.design.init = function () {
  // Submodules initialised in canvas.init
};

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
  if (tab === "export") FB.design.renderExportTab();
};

FB.design._loadAssets = function () {
  fetch("/api/designs")
    .then(function (r) {
      return r.json();
    })
    .then(function (list) {
      var esc = FB.design._esc;
      var el = document.getElementById("ds-assets-designs");
      if (!el) return;
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

FB.design.renderExportTab = function () {
  var fc = FB.design.canvas.get();
  if (!fc) return;
  var bg =
    typeof fc.backgroundColor === "string" ? fc.backgroundColor : "#ffffff";
  var el = document.getElementById("ds-canvas-bg-picker");
  if (!el) return;
  el.innerHTML =
    '<input type="color" class="ds-color-swatch" value="' +
    (bg.charAt(0) === "#" ? bg : "#ffffff") +
    '" onchange="FB.design.props.setCanvasBg(this.value)"/>' +
    '<input class="ds-input" style="flex:1" value="' +
    FB.design._esc(bg) +
    '" onchange="FB.design.props.setCanvasBg(this.value)"/>';
};
```

- [ ] **Step 2: Verify no syntax errors**

```bash
node -e "var fs=require('fs');var code=fs.readFileSync('js/design.js','utf8');try{new Function(code);console.log('OK')}catch(e){console.error(e.message)}"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add js/design.js
git commit -m "feat: design studio tab switching and export tab functions"
```

---

## Task 4: FB.design.elements Module

**Files:**

- Modify: `js/design.js` (add new IIFE after the `FB.design.renderExportTab` block)

This is the largest addition — the full element library module with frames, shapes, text presets, icons, and backgrounds.

- [ ] **Step 1: Add the elements module**

Find the line in `js/design.js`:

```js
FB.design.history = (function () {
```

Insert the entire `FB.design.elements` IIFE **immediately before** that line:

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
    var active = FB.design.tools.active();
    var el = document.getElementById("ds-tool-row");
    if (!el) return;
    el.innerHTML = [
      { id: "select", label: "▶", title: "Select (V)" },
      { id: "text", label: "T", title: "Text (T)" },
      { id: "image", label: "🖼", title: "Upload Image (I)" },
      { id: "ai", label: "✦", title: "AI Generate" },
    ]
      .map(function (t) {
        var isActive = t.id === active;
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
    if (!el) return;
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
      '<div class="ds-section-label">Frames</div>' +
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
          "</div></div>"
        );
      }).join("") +
      "</div></div>"
    );
  }

  function _shapesHtml() {
    return (
      "<div>" +
      '<div class="ds-section-label">Shapes</div>' +
      '<div class="ds-shape-grid">' +
      SHAPES.map(function (s) {
        return (
          '<div class="ds-shape-tile" title="' +
          s.title +
          '" ' +
          "onclick=\"FB.design.elements.addShape('" +
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
      '<div class="ds-section-label">Text</div>' +
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
          "</span></div>"
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
      '<div class="ds-section-label">Icons</div>' +
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
            '" ' +
            "onclick=\"FB.design.elements.addIcon('" +
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
      '<div class="ds-section-label">Backgrounds</div>' +
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
    _renderElementsBody();
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
    if (value.indexOf("gradient") !== -1) {
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
    _renderToolRow: _renderToolRow,
  };
})();
```

- [ ] **Step 2: Verify no syntax errors**

```bash
node -e "var fs=require('fs');var code=fs.readFileSync('js/design.js','utf8');try{new Function(code);console.log('OK')}catch(e){console.error(e.message)}"
```

Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add js/design.js
git commit -m "feat: FB.design.elements — frames, shapes, text presets, icon library, background swatches"
```

---

## Task 5: Wire Everything Together

**Files:**

- Modify: `js/design.js` — update `FB.design.tools`, `FB.design.align`, `FB.design.canvas`

Three targeted edits: (a) update `setTool()` to also refresh the tool row; (b) remove the old `TOOLS`/`render()` from the tools module and `_showAlignBar` from the global namespace; (c) add `renderPanel()` to the align module and call it from canvas events; (d) add `FB.design.elements.render()` + `FB.design.align.renderPanel()` + `FB.design.renderExportTab()` to `canvas.init()`.

- [ ] **Step 1: Remove TOOLS array and render() from FB.design.tools, add \_renderToolRow call to setTool()**

In `js/design.js`, inside `FB.design.tools = (function() { ... })()`, find the `TOOLS` array and `render()` function and `setTool()`:

Current code to find:

```js
  var TOOLS = [
    { id: "select", label: "▶", title: "Select (V)" },
    { id: "rect", label: "⬛", title: "Rectangle (R)" },
    { id: "circle", label: "⬤", title: "Circle (O)" },
    { id: "tri", label: "▲", title: "Triangle" },
    { id: "poly", label: "⬡", title: "Polygon" },
    { id: "line", label: "—", title: "Line" },
    { id: "arrow", label: "→", title: "Arrow" },
    { id: "text", label: "T", title: "Text (T)" },
    { id: "image", label: "🖼", title: "Image (I)" },
  ];

  function render() {
    var el = document.getElementById("ds-tools");
    el.innerHTML =
      '<div class="ds-tools-grid">' +
      TOOLS.map(function (t) {
        return (
          '<button class="ds-tool-btn' +
          (t.id === _active ? " active" : "") +
          '" title="' +
          t.title +
          '" onclick="FB.design.tools.setTool(\'' +
          t.id +
          "')\">" +
          t.label +
          "</button>"
        );
      }).join("") +
      "</div>";
  }

  function setTool(id) {
    _active = id;
```

Replace with:

```js
  function setTool(id) {
    _active = id;
```

Then find the rest of `setTool()`:

```js
    if (id === "image") {
      _triggerImageUpload();
    }
    render();
  }
```

Replace with:

```js
    if (id === "image") {
      _triggerImageUpload();
    }
    if (FB.design.elements) FB.design.elements._renderToolRow();
  }
```

And in the return statement at the bottom of `FB.design.tools`, remove `render` from the exported object:

Current:

```js
return {
  render: render,
  setTool: setTool,
  bindMouseDraw: bindMouseDraw,
  active: function () {
    return _active;
  },
};
```

Replace with:

```js
return {
  setTool: setTool,
  bindMouseDraw: bindMouseDraw,
  active: function () {
    return _active;
  },
};
```

- [ ] **Step 2: Remove FB.design.\_showAlignBar and add renderPanel() to FB.design.align**

Remove the `FB.design._showAlignBar` function entirely from the top of `js/design.js`. It currently looks like:

```js
FB.design._showAlignBar = function (show) {
  var bar = document.getElementById("ds-align-bar");
  if (!bar) return;
  bar.style.display = show ? "flex" : "none";
  var fc =
    FB.design.canvas && FB.design.canvas.get ? FB.design.canvas.get() : null;
  var n = fc ? fc.getActiveObjects().length : 0;
  var dh = document.getElementById("ds-dist-h");
  var dv = document.getElementById("ds-dist-v");
  if (dh) dh.style.display = n >= 3 ? "inline-block" : "none";
  if (dv) dv.style.display = n >= 3 ? "inline-block" : "none";
};
```

Delete those 13 lines.

Then in `FB.design.align = (function() { ... })()`, add `renderPanel` function before the `return` statement:

Find:

```js
    fc.renderAll();
    FB.design.layers.render();
  }

  return { run: run };
```

Replace with:

```js
    fc.renderAll();
    FB.design.layers.render();
  }

  function renderPanel() {
    var fc = FB.design.canvas.get();
    var n = fc ? fc.getActiveObjects().length : 0;
    var el = document.getElementById("ds-align-panel");
    if (!el) return;
    el.innerHTML =
      '<div class="ds-align-group-label">Align Objects</div>' +
      '<div class="ds-align-grid">' +
      [
        ["left",    "⊢ Left"],
        ["centerH", "⊣⊢ Centre"],
        ["right",   "⊣ Right"],
        ["top",     "⊤ Top"],
        ["centerV", "≡ Mid"],
        ["bottom",  "⊥ Bottom"],
      ].map(function (a) {
        return '<button class="ds-align-btn" onclick="FB.design.align.run(\'' + a[0] + '\')">' + a[1] + "</button>";
      }).join("") +
      "</div>" +
      '<div class="ds-align-group-label" style="margin-top:8px;">Layer Order</div>' +
      '<div class="ds-order-grid">' +
      [
        ["bringToFront", "⤒ Front"],
        ["bringForward", "↑ Fwd"],
        ["sendBack",     "↓ Back"],
        ["sendToBack",   "⤓ Base"],
      ].map(function (a) {
        return '<button class="ds-align-btn" onclick="FB.design.align.run(\'' + a[0] + '\')">' + a[1] + "</button>";
      }).join("") +
      "</div>" +
      (n >= 3
        ? '<div class="ds-align-group-label" style="margin-top:8px;">Distribute</div>' +
          '<div class="ds-dist-row">' +
          '<button class="ds-align-btn" onclick="FB.design.align.run(\'distributeH\')">⇔ H</button>' +
          '<button class="ds-align-btn" onclick="FB.design.align.run(\'distributeV\')">⇕ V</button>' +
          "</div>"
        : "");
  }

  return { run: run, renderPanel: renderPanel };
```

- [ ] **Step 3: Replace \_showAlignBar calls in \_bindEvents with renderPanel calls**

In `FB.design.canvas`, inside `function _bindEvents()`, find all three calls to `FB.design._showAlignBar`:

```js
_fc.on("selection:created", function () {
  FB.design.props.render();
  FB.design.layers.render();
  FB.design._showAlignBar(true);
});
_fc.on("selection:updated", function () {
  FB.design.props.render();
  FB.design.layers.render();
  FB.design._showAlignBar(true);
});
_fc.on("selection:cleared", function () {
  FB.design.props.render();
  FB.design.layers.render();
  FB.design._showAlignBar(false);
});
```

Replace with:

```js
_fc.on("selection:created", function () {
  FB.design.props.render();
  FB.design.layers.render();
  FB.design.align.renderPanel();
});
_fc.on("selection:updated", function () {
  FB.design.props.render();
  FB.design.layers.render();
  FB.design.align.renderPanel();
});
_fc.on("selection:cleared", function () {
  FB.design.props.render();
  FB.design.layers.render();
  FB.design.align.renderPanel();
});
```

- [ ] **Step 4: Add render calls to canvas.init()**

In `FB.design.canvas`, inside `function init()`, find the end of the function:

```js
    FB.design.tools.render();
    FB.design.tools.bindMouseDraw();
    FB.design.history.push();
  }
```

Replace with:

```js
    FB.design.tools.bindMouseDraw();
    FB.design.elements.render();
    FB.design.align.renderPanel();
    FB.design.renderExportTab();
    FB.design.history.push();
  }
```

- [ ] **Step 5: Verify no syntax errors**

```bash
node -e "var fs=require('fs');var code=fs.readFileSync('js/design.js','utf8');try{new Function(code);console.log('OK')}catch(e){console.error(e.message)}"
```

Expected: `OK`

- [ ] **Step 6: Open Design Studio and verify all panels render**

Open http://localhost:8899 in browser. Click the Design Studio button (pencil/design icon in the top toolbar).

Check:

1. Top bar shows: `← Builder` | editable title input | ↩ ↪ buttons | canvas size select | zoom controls | Save button
2. Left panel shows three tabs: **Elements** (active), **Layers**, **Assets**
3. Elements tab shows: 4 tool buttons (▶ T 🖼 ✦), then sections: Frames, Shapes, Text, Icons (with search box), Backgrounds
4. Clicking the **Layers** tab shows the layer list (may be empty until objects are added)
5. Clicking the **Assets** tab shows the "⊞ Browse Templates" button and "My Designs" label
6. Right panel shows three tabs: **Design** (active), **Align**, **Export**
7. Clicking **Align** shows the alignment button grid (Align Objects, Layer Order sections)
8. Clicking **Export** shows "Insert into Page →", "Export PNG", "Export SVG" buttons, and a Canvas Background colour picker

- [ ] **Step 7: Test adding a shape**

In the Elements tab, click a shape tile (e.g. the rectangle ▬). A blue rectangle should appear centred on the canvas and be automatically selected.

- [ ] **Step 8: Test a text preset**

Click "Add a Heading" in the Text section. A large white "Add a Heading" IText object should appear centred on the canvas.

- [ ] **Step 9: Test background swap**

Click a background swatch (e.g. Deep Navy). The canvas background should change. Press Ctrl+Z — it should undo back to the previous background.

- [ ] **Step 10: Test the Align tab**

Add two shapes to the canvas. Select both (shift-click or drag select). Click the **Align** tab in the right panel — the ⊣⊢ Centre button should centre them horizontally.

- [ ] **Step 11: Commit**

```bash
git add js/design.js
git commit -m "feat: wire up elements panel, align tab, tool row — remove old _showAlignBar and TOOLS render"
```

---

## Self-Review Checklist

**Spec coverage:**

- ✅ Frames section in Elements tab → `_framesHtml()` / Task 4
- ✅ Shapes section → `_shapesHtml()` / `addShape()` / Task 4
- ✅ Text presets → `_textHtml()` / `addTextPreset()` / Task 4
- ✅ Icons + search → `_iconsHtml()` / `_onIconSearch()` / Task 4
- ✅ Backgrounds → `_backgroundsHtml()` / `setBackground()` / Task 4
- ✅ Left tabs (Elements/Layers/Assets) → Task 1 HTML + Task 3 `switchLeftTab`
- ✅ Right tabs (Design/Align/Export) → Task 1 HTML + Task 3 `switchRightTab`
- ✅ Align tab with `renderPanel()` → Task 5
- ✅ Export tab with insert/export/bg-picker → Task 1 HTML + Task 3 `renderExportTab`
- ✅ Assets tab with My Designs → Task 1 HTML + Task 3 `_loadAssets`
- ✅ Title input in top bar → Task 1 HTML + Task 2 CSS
- ✅ Undo/redo buttons in top bar → Task 1 HTML
- ✅ Remove `#ds-align-bar` → Task 1 HTML + Task 5 `_bindEvents`
- ✅ Remove `#ds-library-overlay` → Task 1 HTML Step 3
- ✅ Remove `FB.design._showAlignBar` → Task 5 Step 2
- ✅ Remove 9-tool `TOOLS` array and `render()` → Task 5 Step 1
- ✅ `FB.design.elements.render()` called on init → Task 5 Step 4
- ✅ `FB.design.align.renderPanel()` called on init + selection events → Task 5 Steps 3+4

**Unchanged modules confirmed untouched:** `FB.design.history`, `FB.design.props`, `FB.design.layers`, `FB.design.library`, `FB.design.templates`, `FB.design.ai`, `FB.design.canvas` zoom/pan/keyboard, `server.py`, `js/panels.js`, `js/canvas.js`.
