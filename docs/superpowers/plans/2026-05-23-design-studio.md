# Design Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Embed a Canva/Illustrator-style graphic design tool into Framework Builder, powered by Fabric.js, with designs saved server-side and insertable as image blocks on the page canvas.

**Architecture:** A new `FB.design` module (Design mode) is activated by a pencil icon in the existing sidebar rail. It replaces the builder left/right panels and canvas with a Fabric.js editor — tool grid, layers list, context-sensitive properties, and an align toolbar. Designs save as JSON to `designs/` via three new `server.py` endpoints. Finished graphics enter the page builder as a new `imageBlock` type.

**Tech Stack:** Fabric.js 5.3.1 (CDN), vanilla JS, Python HTTP server (server.py), no build step.

**Run the app:** `python server.py` → http://localhost:8899

---

## File Map

| File                          | Action | What it does                                                                                |
| ----------------------------- | ------ | ------------------------------------------------------------------------------------------- |
| `framework-builder.html`      | Modify | Add Fabric CDN, design shell HTML, pencil icon in sidebar, design.js/design.css script tags |
| `css/design.css`              | Create | All Design Studio styles                                                                    |
| `js/design.js`                | Create | `FB.design` module — canvas, tools, layers, props, align, templates, ai, library            |
| `widgets/design-templates.js` | Create | 6 pre-built starter canvases as Fabric JSON                                                 |
| `js/canvas.js`                | Modify | Add `imageBlock` case                                                                       |
| `js/panels.js`                | Modify | Add `FB.panels.setMode()` for Builder/Design switching + My Designs accordion in builder    |
| `server.py`                   | Modify | Add `do_GET`, `do_DELETE`, 4 new API handlers                                               |

---

## Task 1: HTML shell + CDN

**Files:**

- Modify: `framework-builder.html`
- Create: `css/design.css`

- [ ] **Add Fabric.js CDN and design.css to `<head>`**

In `framework-builder.html`, after the last `<link rel="stylesheet"...>` (line 23, after `css/help.css`):

```html
<link rel="stylesheet" href="css/design.css?v=1" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js"></script>
```

- [ ] **Add Design Studio shell after `<!-- RIGHT PANEL -->` closing `</div>` (line 595), before `<!-- EXPORT MODAL -->`**

```html
<!-- DESIGN STUDIO -->
<div id="design-studio" style="display:none">
  <div id="ds-left-panel">
    <div id="ds-tools"></div>
    <div id="ds-layers-panel">
      <div class="ds-panel-label">Layers</div>
      <div id="ds-layers-list"></div>
    </div>
    <div id="ds-actions">
      <button class="ds-action-btn" onclick="FB.design.templates.open()">
        ⊞ Templates
      </button>
      <button class="ds-action-btn" onclick="FB.design.ai.open()">
        ✦ AI Generate
      </button>
      <button class="ds-action-btn" onclick="FB.design.library.openPicker()">
        📁 My Designs
      </button>
    </div>
  </div>
  <div id="ds-canvas-column">
    <div id="ds-topbar">
      <div id="ds-size-label"></div>
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
      <div id="ds-topbar-right">
        <div class="ds-export-wrap">
          <button class="ds-export-btn" onclick="FB.design.library.exportPNG()">
            Export PNG
          </button>
          <button class="ds-export-btn" onclick="FB.design.library.exportSVG()">
            Export SVG
          </button>
        </div>
        <button class="ds-save-btn" onclick="FB.design.library.save()">
          Save
        </button>
      </div>
    </div>
    <div id="ds-align-bar" style="display:none">
      <button onclick="FB.design.align.run('left')" title="Align left">
        ⊢L
      </button>
      <button onclick="FB.design.align.run('centerH')" title="Center H">
        ⊣C
      </button>
      <button onclick="FB.design.align.run('right')" title="Align right">
        R⊣
      </button>
      <button onclick="FB.design.align.run('top')" title="Align top">⊤T</button>
      <button onclick="FB.design.align.run('centerV')" title="Center V">
        ≡M
      </button>
      <button onclick="FB.design.align.run('bottom')" title="Align bottom">
        ⊥B
      </button>
      <span class="ds-sep"></span>
      <button
        onclick="FB.design.align.run('bringForward')"
        title="Bring forward"
      >
        ↑Fwd
      </button>
      <button onclick="FB.design.align.run('sendBack')" title="Send back">
        ↓Back
      </button>
      <button
        onclick="FB.design.align.run('bringToFront')"
        title="Bring to front"
      >
        ⊤Front
      </button>
      <button onclick="FB.design.align.run('sendToBack')" title="Send to back">
        ⊥Back
      </button>
      <span class="ds-sep"></span>
      <button
        id="ds-dist-h"
        onclick="FB.design.align.run('distributeH')"
        title="Distribute H"
        style="display:none"
      >
        H-Dist
      </button>
      <button
        id="ds-dist-v"
        onclick="FB.design.align.run('distributeV')"
        title="Distribute V"
        style="display:none"
      >
        V-Dist
      </button>
    </div>
    <div id="ds-canvas-wrap">
      <canvas id="ds-canvas"></canvas>
    </div>
  </div>
  <div id="ds-right-panel">
    <div id="ds-props"></div>
    <div id="ds-insert-actions">
      <button
        class="ds-insert-btn"
        onclick="FB.design.library.insertIntoPage()"
      >
        Insert into page →
      </button>
      <button class="ds-action-btn" onclick="FB.design.library.exportPNG()">
        Export PNG
      </button>
      <button class="ds-action-btn" onclick="FB.design.library.exportSVG()">
        Export SVG
      </button>
    </div>
  </div>
</div>

<!-- DESIGN STUDIO OVERLAYS -->
<div id="ds-template-overlay" style="display:none">
  <div id="ds-template-modal">
    <div class="ds-modal-head">
      <span>Choose a Template</span>
      <button onclick="FB.design.templates.close()">✕</button>
    </div>
    <div id="ds-template-grid"></div>
  </div>
</div>
<div id="ds-ai-overlay" style="display:none">
  <div id="ds-ai-modal">
    <div class="ds-modal-head">
      <span>✦ AI Image Generation</span>
      <button onclick="FB.design.ai.close()">✕</button>
    </div>
    <textarea
      id="ds-ai-prompt"
      placeholder="Describe the image you want to generate…"
    ></textarea>
    <button class="ds-save-btn" onclick="FB.design.ai.generate()">
      Generate
    </button>
    <div id="ds-ai-status"></div>
  </div>
</div>
<div id="ds-library-overlay" style="display:none">
  <div id="ds-library-modal">
    <div class="ds-modal-head">
      <span>My Designs</span>
      <button onclick="FB.design.library.closePicker()">✕</button>
    </div>
    <div id="ds-library-grid"></div>
  </div>
</div>
```

- [ ] **Add pencil icon to the existing sidebar icon rail**

Find the existing sidebar icon rail in the topbar area (the `#tb-center-items` div). The app doesn't have a persistent icon rail — the left panel toggle is a button in the topbar. Add a Design Studio mode toggle button next to the existing sidebar toggle:

In `framework-builder.html`, find the `<button class="tb-btn" onclick="FB.panels.toggleLeftPanel()"` button and add after its closing `</button>`:

```html
<button
  class="tb-btn"
  id="ds-mode-btn"
  onclick="FB.panels.setMode('design')"
  title="Design Studio"
>
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
</button>
```

- [ ] **Add script tags before `</body>`** (after `js/language.js` line):

```html
<script src="js/design.js?v=1"></script>
<script src="widgets/design-templates.js?v=1"></script>
```

- [ ] **Create `css/design.css` with base layout styles:**

```css
/* Design Studio layout */
#design-studio {
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #111;
  z-index: 10;
}

#ds-left-panel {
  width: 200px;
  min-width: 200px;
  background: #111;
  border-right: 1px solid #222;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

#ds-tools {
  padding: 8px;
  border-bottom: 1px solid #222;
}

.ds-tools-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 3px;
}

.ds-tool-btn {
  background: #1a1a2a;
  border: 1px solid #333;
  border-radius: 3px;
  color: #888;
  padding: 5px 0;
  cursor: pointer;
  font-size: 12px;
  text-align: center;
  transition: all 0.15s;
}

.ds-tool-btn:hover {
  border-color: #555;
  color: #ccc;
}
.ds-tool-btn.active {
  background: rgba(205, 254, 0, 0.1);
  border-color: #cdfe00;
  color: #cdfe00;
}

.ds-panel-label {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #555;
  padding: 8px 8px 4px;
}

#ds-layers-panel {
  flex: 1;
  overflow-y: auto;
  border-bottom: 1px solid #222;
}

#ds-layers-list {
  padding: 0 8px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ds-layer-row {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 6px;
  border-radius: 3px;
  border: 1px solid #333;
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

#ds-actions {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ds-action-btn {
  background: #1a1a2a;
  border: 1px solid #333;
  border-radius: 3px;
  color: #aaa;
  padding: 5px 8px;
  cursor: pointer;
  font-size: 10px;
  text-align: left;
  width: 100%;
}

.ds-action-btn:hover {
  border-color: #555;
  color: #fff;
}

/* Canvas column */
#ds-canvas-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

#ds-topbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #0d0d1a;
  border-bottom: 1px solid #222;
  flex-shrink: 0;
}

#ds-preset-select {
  background: #1a1a2a;
  border: 1px solid #333;
  border-radius: 3px;
  color: #ccc;
  font-size: 11px;
  padding: 3px 6px;
}

#ds-zoom-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

#ds-zoom-controls button {
  background: #1a1a2a;
  border: 1px solid #333;
  border-radius: 3px;
  color: #aaa;
  padding: 2px 7px;
  cursor: pointer;
  font-size: 11px;
}

#ds-zoom-controls button:hover {
  border-color: #555;
  color: #fff;
}
#ds-zoom-label {
  font-size: 11px;
  color: #888;
  min-width: 36px;
  text-align: center;
}
#ds-size-label {
  font-size: 10px;
  color: #555;
}

#ds-topbar-right {
  margin-left: auto;
  display: flex;
  gap: 6px;
  align-items: center;
}

.ds-export-wrap {
  display: flex;
  gap: 4px;
}

.ds-export-btn {
  background: #1a1a2a;
  border: 1px solid #333;
  border-radius: 3px;
  color: #aaa;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 10px;
}

.ds-export-btn:hover {
  border-color: #555;
  color: #fff;
}

.ds-save-btn {
  background: #cdfe00;
  border: none;
  border-radius: 3px;
  color: #000;
  font-weight: 700;
  padding: 4px 12px;
  cursor: pointer;
  font-size: 11px;
}

.ds-save-btn:hover {
  background: #b8e600;
}

#ds-align-bar {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 4px 10px;
  background: #111;
  border-bottom: 1px solid #222;
  flex-shrink: 0;
}

#ds-align-bar button {
  background: #1a1a2a;
  border: 1px solid #333;
  border-radius: 2px;
  color: #888;
  padding: 2px 6px;
  cursor: pointer;
  font-size: 9px;
}

#ds-align-bar button:hover {
  border-color: #555;
  color: #fff;
}
.ds-sep {
  width: 1px;
  height: 16px;
  background: #333;
  margin: 0 2px;
}

#ds-canvas-wrap {
  flex: 1;
  overflow: hidden;
  background: repeating-linear-gradient(
    45deg,
    #161616,
    #161616 5px,
    #1a1a2a 5px,
    #1a1a2a 10px
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

#ds-canvas-wrap canvas {
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.6);
}

/* Right panel */
#ds-right-panel {
  width: 200px;
  min-width: 200px;
  background: #111;
  border-left: 1px solid #222;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

#ds-props {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

#ds-insert-actions {
  padding: 8px;
  border-top: 1px solid #222;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ds-insert-btn {
  background: #cdfe00;
  border: none;
  border-radius: 3px;
  color: #000;
  font-weight: 700;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 10px;
  width: 100%;
}

.ds-insert-btn:hover {
  background: #b8e600;
}

/* Props panel */
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
  border: 1px solid #333;
  border-radius: 3px;
  color: #ccc;
  font-size: 10px;
  padding: 3px 5px;
  width: 100%;
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
  width: 20px;
  height: 20px;
  border-radius: 3px;
  border: 1px solid #444;
  cursor: pointer;
  flex-shrink: 0;
}
.ds-select {
  background: #1a1a2a;
  border: 1px solid #333;
  border-radius: 3px;
  color: #ccc;
  font-size: 10px;
  padding: 3px 5px;
  width: 100%;
}
.ds-btn-row {
  display: flex;
  gap: 3px;
}
.ds-sm-btn {
  background: #1a1a2a;
  border: 1px solid #333;
  border-radius: 3px;
  color: #888;
  font-size: 10px;
  padding: 3px 7px;
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

/* Overlays */
#ds-template-overlay,
#ds-ai-overlay,
#ds-library-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

#ds-template-modal,
#ds-ai-modal,
#ds-library-modal {
  background: #1a1a2a;
  border: 1px solid #333;
  border-radius: 8px;
  width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

#ds-template-grid,
#ds-library-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 16px;
  overflow-y: auto;
}

.ds-template-thumb,
.ds-library-thumb {
  border: 2px solid #333;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s;
}

.ds-template-thumb:hover,
.ds-library-thumb:hover {
  border-color: #cdfe00;
}
.ds-template-thumb img,
.ds-library-thumb img {
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

#ds-ai-modal {
  width: 420px;
}
#ds-ai-prompt {
  background: #111;
  border: 1px solid #333;
  border-radius: 3px;
  color: #ccc;
  font-size: 12px;
  padding: 8px;
  margin: 12px 16px;
  width: calc(100% - 32px);
  height: 80px;
  resize: vertical;
}
#ds-ai-modal .ds-save-btn {
  margin: 0 16px 8px;
  width: calc(100% - 32px);
}
#ds-ai-status {
  font-size: 11px;
  color: #888;
  padding: 0 16px 12px;
}

/* My Designs in builder left panel */
.ds-builder-thumb-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 8px;
}

.ds-builder-thumb {
  border: 1px solid #333;
  border-radius: 3px;
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

- [ ] **Verify:** Open http://localhost:8899. No console errors. Clicking the pencil toolbar button does nothing yet (JS not wired) but the page still loads.

- [ ] **Commit:**

```bash
git add framework-builder.html css/design.css
git commit -m "feat: design studio HTML shell and styles"
```

---

## Task 2: Mode switching

**Files:**

- Create: `js/design.js` (stub)
- Modify: `js/panels.js`

- [ ] **Create `js/design.js` with module stub and `init`:**

```js
FB.design = {};
FB.design._mode = false;

FB.design.init = function () {
  // Submodules initialised in their own tasks
};
```

- [ ] **Add `FB.panels.setMode()` to `js/panels.js`** (add at the end of the file):

```js
FB.panels.setMode = function (mode) {
  var isDesign = mode === "design";
  document.getElementById("design-studio").style.display = isDesign
    ? "flex"
    : "none";
  document.getElementById("app").style.display = isDesign ? "none" : "flex";
  document.getElementById("ds-mode-btn").classList.toggle("active", isDesign);
  FB.design._mode = isDesign;
  if (isDesign) {
    FB.design.canvas.init();
  }
};

FB.panels.exitDesignMode = function () {
  FB.panels.setMode("builder");
};
```

- [ ] **Wire Escape key and builder-mode button.** In `js/app.js` (or at the bottom of `design.js`), add to the existing `keydown` handler — look for the existing `document.addEventListener('keydown', ...)` call in `app.js` and add:

```js
// Inside the existing keydown handler in app.js, add this branch:
if (e.key === "Escape" && FB.design._mode) {
  FB.panels.setMode("builder");
  return;
}
```

Also add a "← Builder" back button to `#ds-topbar` in `framework-builder.html` (insert as first child of `#ds-topbar`):

```html
<button
  class="ds-back-btn"
  onclick="FB.panels.setMode('builder')"
  title="Back to Builder"
>
  ← Builder
</button>
```

Add to `css/design.css`:

```css
.ds-back-btn {
  background: #1a1a2a;
  border: 1px solid #333;
  border-radius: 3px;
  color: #aaa;
  padding: 4px 10px;
  cursor: pointer;
  font-size: 10px;
  flex-shrink: 0;
}
.ds-back-btn:hover {
  border-color: #555;
  color: #fff;
}
```

- [ ] **Verify:** Click the pencil button → builder disappears, Design Studio appears. Click `← Builder` → returns to builder. Press Escape in design mode → returns to builder.

- [ ] **Commit:**

```bash
git add js/design.js js/panels.js framework-builder.html css/design.css
git commit -m "feat: design studio mode switching — pencil icon toggles design/builder"
```

---

## Task 3: Fabric.js canvas init + zoom/pan

**Files:**

- Modify: `js/design.js`

- [ ] **Add `FB.design.canvas` to `js/design.js`:**

```js
FB.design.canvas = (function () {
  var _fc = null; // fabric.Canvas instance
  var _inited = false;

  var PRESETS = {
    hero: { w: 1920, h: 600, label: "Hero Banner (1920×600)" },
    og: { w: 1200, h: 630, label: "OG Image (1200×630)" },
    card: { w: 800, h: 600, label: "Feature Card (800×600)" },
    square: { w: 1080, h: 1080, label: "Square (1080×1080)" },
    wide: { w: 1920, h: 1080, label: "Wide (1920×1080)" },
  };

  function _fc_get() {
    return _fc;
  }

  function init() {
    if (_inited) {
      _fc.renderAll();
      return;
    }
    _inited = true;

    _fc = new fabric.Canvas("ds-canvas", {
      backgroundColor: "#ffffff",
      selection: true,
      preserveObjectStacking: true,
    });

    applyPreset("og");
    _bindZoomPan();
    _bindEvents();
    _bindKeys();
  }

  function applyPreset(key) {
    if (key === "custom") {
      var w = parseInt(prompt("Width in px:", "800"), 10) || 800;
      var h = parseInt(prompt("Height in px:", "600"), 10) || 600;
      _resizeTo(w, h);
      return;
    }
    var p = PRESETS[key];
    if (!p) return;
    _resizeTo(p.w, p.h);
    document.getElementById("ds-preset-select").value = key;
  }

  function _resizeTo(w, h) {
    var wrap = document.getElementById("ds-canvas-wrap");
    var maxW = wrap.clientWidth - 40;
    var maxH = wrap.clientHeight - 40;
    var scale = Math.min(1, maxW / w, maxH / h);
    _fc.setWidth(w);
    _fc.setHeight(h);
    _fc.setZoom(scale);
    _fc.wrapperEl.style.width = Math.round(w * scale) + "px";
    _fc.wrapperEl.style.height = Math.round(h * scale) + "px";
    document.getElementById("ds-size-label").textContent = w + " × " + h;
    document.getElementById("ds-zoom-label").textContent =
      Math.round(scale * 100) + "%";
    _fc.renderAll();
  }

  function _bindZoomPan() {
    _fc.on("mouse:wheel", function (opt) {
      var delta = opt.e.deltaY;
      var zoom = _fc.getZoom();
      zoom *= 0.999 ** delta;
      zoom = Math.min(Math.max(zoom, 0.05), 5);
      _fc.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      document.getElementById("ds-zoom-label").textContent =
        Math.round(zoom * 100) + "%";
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    var _panning = false;
    _fc.on("mouse:down", function (opt) {
      if (opt.e.spaceKey || opt.e.button === 1) {
        _panning = true;
        _fc.selection = false;
      }
    });
    _fc.on("mouse:move", function (opt) {
      if (_panning && opt.e.buttons) {
        _fc.relativePan({ x: opt.e.movementX, y: opt.e.movementY });
      }
    });
    _fc.on("mouse:up", function () {
      _panning = false;
      _fc.selection = true;
    });
  }

  function _bindEvents() {
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
    _fc.on("object:added", function () {
      FB.design.layers.render();
      FB.design.history.push();
    });
    _fc.on("object:removed", function () {
      FB.design.layers.render();
      FB.design.history.push();
    });
    _fc.on("object:modified", function () {
      FB.design.props.render();
      FB.design.layers.render();
      FB.design.history.push();
    });
  }

  function _bindKeys() {
    document.addEventListener("keydown", function (e) {
      if (!FB.design._mode) return;
      var tag = document.activeElement.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "Delete" || e.key === "Backspace") {
        var objs = _fc.getActiveObjects();
        if (objs.length) {
          objs.forEach(function (o) {
            _fc.remove(o);
          });
          _fc.discardActiveObject();
          _fc.renderAll();
        }
      }
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        _duplicateSelected();
      }
      if (e.ctrlKey && e.key === "g") {
        e.preventDefault();
        _groupSelected();
      }
      if (e.ctrlKey && e.shiftKey && e.key === "G") {
        e.preventDefault();
        _ungroupSelected();
      }
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        FB.design.library.save();
      }
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        FB.design.history.undo();
      }
      if (
        (e.ctrlKey && e.key === "y") ||
        (e.ctrlKey && e.shiftKey && e.key === "z")
      ) {
        e.preventDefault();
        FB.design.history.redo();
      }
      var toolKeys = {
        v: "select",
        r: "rect",
        o: "circle",
        t: "text",
        i: "image",
      };
      if (toolKeys[e.key] && !e.ctrlKey && !e.altKey) {
        FB.design.tools.setTool(toolKeys[e.key]);
      }
    });
  }

  function _duplicateSelected() {
    _fc.getActiveObjects().forEach(function (obj) {
      obj.clone(function (clone) {
        clone.set({ left: obj.left + 20, top: obj.top + 20 });
        _fc.add(clone);
      });
    });
    _fc.renderAll();
  }

  function _groupSelected() {
    if (_fc.getActiveObjects().length < 2) return;
    var group = new fabric.Group(_fc.getActiveObjects(), { canvas: _fc });
    _fc.getActiveObjects().forEach(function (o) {
      _fc.remove(o);
    });
    _fc.add(group);
    _fc.setActiveObject(group);
    _fc.renderAll();
  }

  function _ungroupSelected() {
    var obj = _fc.getActiveObject();
    if (!obj || obj.type !== "group") return;
    obj.toActiveSelection();
    _fc.requestRenderAll();
  }

  function zoomIn() {
    var z = Math.min(_fc.getZoom() * 1.2, 5);
    _fc.setZoom(z);
    document.getElementById("ds-zoom-label").textContent =
      Math.round(z * 100) + "%";
  }
  function zoomOut() {
    var z = Math.max(_fc.getZoom() * 0.8, 0.05);
    _fc.setZoom(z);
    document.getElementById("ds-zoom-label").textContent =
      Math.round(z * 100) + "%";
  }
  function zoomFit() {
    var w = _fc.getWidth();
    var h = _fc.getHeight();
    var wrap = document.getElementById("ds-canvas-wrap");
    var scale = Math.min(
      (wrap.clientWidth - 40) / w,
      (wrap.clientHeight - 40) / h,
    );
    _fc.setZoom(scale);
    document.getElementById("ds-zoom-label").textContent =
      Math.round(scale * 100) + "%";
    _fc.renderAll();
  }

  function get() {
    return _fc;
  }

  return {
    init: init,
    get: get,
    applyPreset: applyPreset,
    zoomIn: zoomIn,
    zoomOut: zoomOut,
    zoomFit: zoomFit,
  };
})();
```

- [ ] **Wire `FB.design.init()` into the module. Add near top of `js/design.js`:**

```js
FB.design._showAlignBar = function (show) {
  var bar = document.getElementById("ds-align-bar");
  if (!bar) return;
  bar.style.display = show ? "flex" : "none";
  var n = FB.design.canvas.get()
    ? FB.design.canvas.get().getActiveObjects().length
    : 0;
  document.getElementById("ds-dist-h").style.display =
    n >= 3 ? "inline-block" : "none";
  document.getElementById("ds-dist-v").style.display =
    n >= 3 ? "inline-block" : "none";
};
```

- [ ] **Verify:** Switch to Design mode. A white canvas appears centred on the checkerboard. Mouse wheel zooms. `−`/`+`/`Fit` buttons work. Zoom % label updates.

- [ ] **Commit:**

```bash
git add js/design.js
git commit -m "feat: fabric.js canvas init with zoom, pan, preset sizes"
```

---

## Task 4: History (undo/redo)

**Files:**

- Modify: `js/design.js`

- [ ] **Add `FB.design.history` before the canvas module:**

```js
FB.design.history = (function () {
  var _stack = [];
  var _future = [];
  var _paused = false;

  function push() {
    if (_paused) return;
    var fc = FB.design.canvas.get();
    if (!fc) return;
    _stack.push(JSON.stringify(fc.toJSON(["id", "name"])));
    if (_stack.length > 50) _stack.shift();
    _future = [];
  }

  function undo() {
    var fc = FB.design.canvas.get();
    if (!fc || _stack.length < 2) return;
    _future.push(_stack.pop());
    _paused = true;
    fc.loadFromJSON(JSON.parse(_stack[_stack.length - 1]), function () {
      fc.renderAll();
      FB.design.layers.render();
      FB.design.props.render();
      _paused = false;
    });
  }

  function redo() {
    var fc = FB.design.canvas.get();
    if (!fc || !_future.length) return;
    var state = _future.pop();
    _stack.push(state);
    _paused = true;
    fc.loadFromJSON(JSON.parse(state), function () {
      fc.renderAll();
      FB.design.layers.render();
      FB.design.props.render();
      _paused = false;
    });
  }

  return { push: push, undo: undo, redo: redo };
})();
```

- [ ] **Verify:** In Design mode, draw a shape (Task 5 needed for drawing — skip draw test for now; when Task 5 is done come back and verify Ctrl+Z removes the last added object and Ctrl+Y restores it).

- [ ] **Commit:**

```bash
git add js/design.js
git commit -m "feat: design studio undo/redo with 50-step history stack"
```

---

## Task 5: Tool system — shapes and text

**Files:**

- Modify: `js/design.js`

- [ ] **Add `FB.design.tools` and render the tool grid:**

```js
FB.design.tools = (function () {
  var _active = "select";
  var _drawing = false;
  var _startX, _startY, _drawObj;

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
    var fc = FB.design.canvas.get();
    if (!fc) {
      render();
      return;
    }
    fc.isDrawingMode = false;
    fc.selection = id === "select";
    fc.defaultCursor = id === "select" ? "default" : "crosshair";
    if (id === "image") {
      _triggerImageUpload();
    }
    render();
  }

  function _triggerImageUpload() {
    var inp = document.createElement("input");
    inp.type = "file";
    inp.accept = "image/*";
    inp.onchange = function () {
      var file = inp.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        fabric.Image.fromURL(ev.target.result, function (img) {
          var fc = FB.design.canvas.get();
          var maxW = fc.getWidth() * 0.5;
          if (img.width > maxW) img.scaleToWidth(maxW);
          img.set({
            left: fc.getWidth() / 2 - img.getScaledWidth() / 2,
            top: fc.getHeight() / 2 - img.getScaledHeight() / 2,
            name: "Image",
          });
          fc.add(img);
          fc.setActiveObject(img);
          fc.renderAll();
          FB.design.tools.setTool("select");
        });
      };
      reader.readAsDataURL(file);
    };
    inp.click();
  }

  function bindMouseDraw() {
    var fc = FB.design.canvas.get();
    fc.on("mouse:down", function (opt) {
      if (_active === "select" || _active === "image" || _active === "text")
        return;
      if (opt.target) return;
      _drawing = true;
      var p = fc.getPointer(opt.e);
      _startX = p.x;
      _startY = p.y;
      _drawObj = _createShape(_active, p.x, p.y);
      if (_drawObj) fc.add(_drawObj);
    });

    fc.on("mouse:move", function (opt) {
      if (!_drawing || !_drawObj) return;
      var p = fc.getPointer(opt.e);
      _updateShape(_drawObj, _startX, _startY, p.x, p.y);
      fc.renderAll();
    });

    fc.on("mouse:up", function () {
      if (!_drawing) return;
      _drawing = false;
      if (_drawObj) {
        _drawObj.setCoords();
        fc.setActiveObject(_drawObj);
        _drawObj = null;
      }
      FB.design.tools.setTool("select");
      fc.renderAll();
    });

    fc.on("mouse:dblclick", function (opt) {
      if (
        _active !== "text" &&
        !(_active === "select" && opt.target && opt.target.type === "i-text")
      )
        return;
      if (opt.target && opt.target.type === "i-text") {
        opt.target.enterEditing();
        return;
      }
      var p = fc.getPointer(opt.e);
      var txt = new fabric.IText("Text", {
        left: p.x,
        top: p.y,
        fontFamily: "Lexend",
        fontSize: 32,
        fill: "#000000",
        name: "Text",
        editable: true,
      });
      fc.add(txt);
      fc.setActiveObject(txt);
      txt.enterEditing();
      FB.design.tools.setTool("select");
    });
  }

  function _createShape(type, x, y) {
    var opts = {
      left: x,
      top: y,
      fill: "#4a90e2",
      stroke: "transparent",
      strokeWidth: 0,
      originX: "left",
      originY: "top",
    };
    if (type === "rect")
      return new fabric.Rect(
        Object.assign({ width: 1, height: 1, name: "Rectangle" }, opts),
      );
    if (type === "circle")
      return new fabric.Ellipse(
        Object.assign({ rx: 1, ry: 1, name: "Circle" }, opts),
      );
    if (type === "tri")
      return new fabric.Triangle(
        Object.assign({ width: 1, height: 1, name: "Triangle" }, opts),
      );
    if (type === "poly")
      return new fabric.Polygon(
        [
          { x: 0, y: 50 },
          { x: 50, y: 0 },
          { x: 100, y: 50 },
          { x: 75, y: 100 },
          { x: 25, y: 100 },
        ],
        Object.assign({ name: "Polygon" }, opts),
      );
    if (type === "line")
      return new fabric.Line([x, y, x, y], {
        stroke: "#4a90e2",
        strokeWidth: 2,
        name: "Line",
      });
    if (type === "arrow") {
      var line = new fabric.Line([x, y, x, y], {
        stroke: "#4a90e2",
        strokeWidth: 2,
        name: "Arrow",
      });
      line._isArrow = true;
      return line;
    }
    return null;
  }

  function _updateShape(obj, x1, y1, x2, y2) {
    var w = x2 - x1,
      h = y2 - y1;
    if (obj.type === "rect" || obj.type === "triangle") {
      obj.set({
        width: Math.abs(w),
        height: Math.abs(h),
        left: Math.min(x1, x2),
        top: Math.min(y1, y2),
      });
    } else if (obj.type === "ellipse") {
      obj.set({
        rx: Math.abs(w) / 2,
        ry: Math.abs(h) / 2,
        left: Math.min(x1, x2),
        top: Math.min(y1, y2),
      });
    } else if (obj.type === "line") {
      obj.set({ x2: x2, y2: y2 });
    }
  }

  return {
    render: render,
    setTool: setTool,
    bindMouseDraw: bindMouseDraw,
    active: function () {
      return _active;
    },
  };
})();
```

- [ ] **Call `FB.design.tools.render()` and `FB.design.tools.bindMouseDraw()` inside `FB.design.canvas.init()` after `_bindEvents()`:**

In the `init` function of `FB.design.canvas`, add at the end before the closing `}`:

```js
FB.design.tools.render();
FB.design.tools.bindMouseDraw();
```

- [ ] **Verify:** In Design mode, select Rect tool (or press R), click-drag on canvas → rectangle appears. Select Circle, click-drag → ellipse appears. Double-click canvas with Text tool active → text cursor appears and you can type. Select tool (V) → back to selection mode.

- [ ] **Commit:**

```bash
git add js/design.js
git commit -m "feat: design tools — rect, circle, triangle, polygon, line, text, image upload"
```

---

## Task 6: Layers panel

**Files:**

- Modify: `js/design.js`

- [ ] **Add `FB.design.layers`:**

```js
FB.design.layers = (function () {
  var _typeIcon = {
    rect: "⬛",
    ellipse: "⬤",
    triangle: "▲",
    polygon: "⬡",
    line: "—",
    "i-text": "T",
    image: "🖼",
    group: "⊞",
    path: "✒",
  };

  function render() {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var objs = fc.getObjects().slice().reverse();
    var active = fc.getActiveObjects();
    var el = document.getElementById("ds-layers-list");
    el.innerHTML = objs
      .map(function (obj, i) {
        var icon = _typeIcon[obj.type] || "◆";
        var name = obj.name || obj.type || "Object";
        var isActive = active.indexOf(obj) !== -1;
        var isHidden = obj.visible === false;
        return (
          '<div class="ds-layer-row' +
          (isActive ? " selected" : "") +
          '" ' +
          'data-idx="' +
          (objs.length - 1 - i) +
          '" ' +
          'onclick="FB.design.layers.select(' +
          (objs.length - 1 - i) +
          ')" ' +
          'oncontextmenu="FB.design.layers.ctxMenu(event,' +
          (objs.length - 1 - i) +
          ');return false">' +
          "<span>" +
          icon +
          "</span>" +
          '<span class="ds-layer-name">' +
          name +
          "</span>" +
          '<button class="ds-layer-vis" onclick="FB.design.layers.toggleVis(event,' +
          (objs.length - 1 - i) +
          ')">' +
          (isHidden ? "🚫" : "👁") +
          "</button>" +
          "</div>"
        );
      })
      .join("");
  }

  function select(idx) {
    var fc = FB.design.canvas.get();
    var obj = fc.item(idx);
    if (!obj) return;
    fc.setActiveObject(obj);
    fc.renderAll();
    FB.design.props.render();
    render();
  }

  function toggleVis(e, idx) {
    e.stopPropagation();
    var fc = FB.design.canvas.get();
    var obj = fc.item(idx);
    if (!obj) return;
    obj.visible = !obj.visible;
    fc.renderAll();
    render();
  }

  function ctxMenu(e, idx) {
    var fc = FB.design.canvas.get();
    var obj = fc.item(idx);
    if (!obj) return;
    var name = prompt("Rename layer:", obj.name || obj.type);
    if (name !== null) {
      obj.name = name;
      render();
    }
  }

  return {
    render: render,
    select: select,
    toggleVis: toggleVis,
    ctxMenu: ctxMenu,
  };
})();
```

- [ ] **Verify:** Draw a few shapes in Design mode. The Layers panel updates automatically. Click a layer row → selects that object on canvas. Click the 👁 → hides/shows the object. Right-click a row → rename prompt appears.

- [ ] **Commit:**

```bash
git add js/design.js
git commit -m "feat: layers panel — render, select, visibility toggle, rename"
```

---

## Task 7: Right panel — context-sensitive properties

**Files:**

- Modify: `js/design.js`

- [ ] **Add `FB.design.props`:**

```js
FB.design.props = (function () {
  var GOOGLE_FONTS = [
    "Lexend",
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Poppins",
    "Raleway",
    "Playfair Display",
    "Merriweather",
    "Lora",
    "Bebas Neue",
    "Oswald",
    "Space Grotesk",
    "DM Sans",
  ];

  function render() {
    var fc = FB.design.canvas.get();
    var el = document.getElementById("ds-props");
    if (!fc) {
      el.innerHTML = "";
      return;
    }
    var obj = fc.getActiveObject();
    if (!obj) {
      el.innerHTML = _canvasProps(fc);
      return;
    }
    if (obj.type === "i-text") {
      el.innerHTML = _textProps(obj);
      return;
    }
    if (obj.type === "image") {
      el.innerHTML = _imageProps(obj);
      return;
    }
    el.innerHTML = _shapeProps(obj);
  }

  function _posSize(obj) {
    return (
      '<div class="ds-prop-group">' +
      '<div class="ds-prop-label">Position</div>' +
      '<div class="ds-prop-row">' +
      '<input class="ds-input" style="width:48%" type="number" value="' +
      Math.round(obj.left) +
      '" onchange="FB.design.props.setProp(\'left\',+this.value)" placeholder="X"/>' +
      '<input class="ds-input" style="width:48%" type="number" value="' +
      Math.round(obj.top) +
      '" onchange="FB.design.props.setProp(\'top\',+this.value)" placeholder="Y"/>' +
      "</div>" +
      '<div class="ds-prop-row">' +
      '<input class="ds-input" style="width:48%" type="number" value="' +
      Math.round(obj.getScaledWidth()) +
      '" onchange="FB.design.props.setWidth(+this.value)" placeholder="W"/>' +
      '<input class="ds-input" style="width:48%" type="number" value="' +
      Math.round(obj.getScaledHeight()) +
      '" onchange="FB.design.props.setHeight(+this.value)" placeholder="H"/>' +
      "</div>" +
      "</div>"
    );
  }

  function _shapeProps(obj) {
    var fill = typeof obj.fill === "string" ? obj.fill : "#4a90e2";
    var stroke = obj.stroke || "transparent";
    var sw = obj.strokeWidth || 0;
    var op = Math.round((obj.opacity || 1) * 100);
    var html = _posSize(obj);
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Fill</div>' +
      '<div class="ds-color-row"><input type="color" class="ds-color-swatch" value="' +
      fill +
      '" onchange="FB.design.props.setProp(\'fill\',this.value)"/>' +
      '<input class="ds-input" value="' +
      fill +
      '" onchange="FB.design.props.setProp(\'fill\',this.value)"/></div></div>';
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Stroke</div>' +
      '<div class="ds-prop-row">' +
      '<input type="color" class="ds-color-swatch" value="' +
      (stroke === "transparent" ? "#000000" : stroke) +
      '" onchange="FB.design.props.setProp(\'stroke\',this.value)"/>' +
      '<input class="ds-input" type="number" value="' +
      sw +
      '" placeholder="Width" onchange="FB.design.props.setProp(\'strokeWidth\',+this.value)"/>' +
      "</div></div>";
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Opacity</div>' +
      '<input class="ds-input" type="range" min="0" max="100" value="' +
      op +
      '" oninput="FB.design.props.setProp(\'opacity\',this.value/100)"/></div>';
    if (obj.type === "rect") {
      html +=
        '<div class="ds-prop-group"><div class="ds-prop-label">Corner Radius</div>' +
        '<input class="ds-input" type="number" value="' +
        (obj.rx || 0) +
        "\" onchange=\"FB.design.props.setPropXY('rx','ry',+this.value)\"/></div>";
    }
    return html;
  }

  function _textProps(obj) {
    var html = _posSize(obj);
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Font</div>' +
      '<select class="ds-select" onchange="FB.design.props.setProp(\'fontFamily\',this.value)">' +
      GOOGLE_FONTS.map(function (f) {
        return (
          "<option" +
          (obj.fontFamily === f ? " selected" : "") +
          ">" +
          f +
          "</option>"
        );
      }).join("") +
      "</select></div>";
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Size / Weight</div><div class="ds-prop-row">' +
      '<input class="ds-input" style="width:48%" type="number" value="' +
      (obj.fontSize || 32) +
      '" onchange="FB.design.props.setProp(\'fontSize\',+this.value)"/>' +
      '<input class="ds-input" style="width:48%" type="number" value="' +
      (obj.fontWeight || 400) +
      '" onchange="FB.design.props.setProp(\'fontWeight\',+this.value)"/>' +
      "</div></div>";
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Colour</div>' +
      '<div class="ds-color-row"><input type="color" class="ds-color-swatch" value="' +
      (obj.fill || "#000000") +
      '" onchange="FB.design.props.setProp(\'fill\',this.value)"/>' +
      '<input class="ds-input" value="' +
      (obj.fill || "#000000") +
      '" onchange="FB.design.props.setProp(\'fill\',this.value)"/></div></div>';
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Align</div><div class="ds-btn-row">' +
      ["left", "center", "right"]
        .map(function (a) {
          return (
            '<button class="ds-sm-btn' +
            (obj.textAlign === a ? " active" : "") +
            "\" onclick=\"FB.design.props.setProp('textAlign','" +
            a +
            "')\">" +
            a[0].toUpperCase() +
            "</button>"
          );
        })
        .join("") +
      "</div></div>";
    return html;
  }

  function _imageProps(obj) {
    var op = Math.round((obj.opacity || 1) * 100);
    var html = _posSize(obj);
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Opacity</div>' +
      '<input class="ds-input" type="range" min="0" max="100" value="' +
      op +
      '" oninput="FB.design.props.setProp(\'opacity\',this.value/100)"/></div>';
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Flip</div><div class="ds-btn-row">' +
      '<button class="ds-sm-btn" onclick="FB.design.props.flip(\'X\')">Flip H</button>' +
      '<button class="ds-sm-btn" onclick="FB.design.props.flip(\'Y\')">Flip V</button>' +
      "</div></div>";
    return html;
  }

  function _canvasProps(fc) {
    return (
      '<div class="ds-prop-group"><div class="ds-prop-label">Canvas Background</div>' +
      '<div class="ds-color-row"><input type="color" class="ds-color-swatch" value="' +
      (fc.backgroundColor || "#ffffff") +
      '" onchange="FB.design.props.setCanvasBg(this.value)"/>' +
      '<input class="ds-input" value="' +
      (fc.backgroundColor || "#ffffff") +
      '" onchange="FB.design.props.setCanvasBg(this.value)"/></div></div>'
    );
  }

  function setProp(key, val) {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj) return;
    obj.set(key, val);
    fc.renderAll();
  }

  function setPropXY(kx, ky, val) {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj) return;
    obj.set(kx, val);
    obj.set(ky, val);
    fc.renderAll();
  }

  function setWidth(val) {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj) return;
    obj.scaleToWidth(val);
    fc.renderAll();
  }

  function setHeight(val) {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj) return;
    obj.scaleToHeight(val);
    fc.renderAll();
  }

  function flip(axis) {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj) return;
    obj.set("flip" + axis, !obj["flip" + axis]);
    fc.renderAll();
  }

  function setCanvasBg(val) {
    var fc = FB.design.canvas.get();
    fc.setBackgroundColor(val, fc.renderAll.bind(fc));
  }

  return {
    render: render,
    setProp: setProp,
    setPropXY: setPropXY,
    setWidth: setWidth,
    setHeight: setHeight,
    flip: flip,
    setCanvasBg: setCanvasBg,
  };
})();
```

- [ ] **Verify:** Draw a rectangle, click it → right panel shows Fill, Stroke, Opacity, corner radius. Change fill colour → rectangle updates live. Add a text object → panel switches to font/size/colour/align controls. Click empty canvas → shows canvas background colour picker.

- [ ] **Commit:**

```bash
git add js/design.js
git commit -m "feat: context-sensitive properties panel — shape, text, image, canvas"
```

---

## Task 8: Align & distribute

**Files:**

- Modify: `js/design.js`

- [ ] **Add `FB.design.align`:**

```js
FB.design.align = (function () {
  function run(action) {
    var fc = FB.design.canvas.get();
    var objs = fc.getActiveObjects();
    if (!objs.length) return;
    var cW = fc.getWidth(),
      cH = fc.getHeight();

    objs.forEach(function (obj) {
      var w = obj.getScaledWidth(),
        h = obj.getScaledHeight();
      if (action === "left") obj.set("left", 0);
      if (action === "centerH") obj.set("left", cW / 2 - w / 2);
      if (action === "right") obj.set("left", cW - w);
      if (action === "top") obj.set("top", 0);
      if (action === "centerV") obj.set("top", cH / 2 - h / 2);
      if (action === "bottom") obj.set("top", cH - h);
      if (action === "bringForward") fc.bringForward(obj);
      if (action === "sendBack") fc.sendBackwards(obj);
      if (action === "bringToFront") fc.bringToFront(obj);
      if (action === "sendToBack") fc.sendToBack(obj);
      obj.setCoords();
    });

    if (action === "distributeH" && objs.length >= 3) {
      var sorted = objs.slice().sort(function (a, b) {
        return a.left - b.left;
      });
      var totalW = sorted.reduce(function (s, o) {
        return s + o.getScaledWidth();
      }, 0);
      var gap =
        (sorted[sorted.length - 1].left +
          sorted[sorted.length - 1].getScaledWidth() -
          sorted[0].left -
          totalW) /
        (sorted.length - 1);
      var x = sorted[0].left;
      sorted.forEach(function (o) {
        o.set("left", x);
        x += o.getScaledWidth() + gap;
        o.setCoords();
      });
    }

    if (action === "distributeV" && objs.length >= 3) {
      var sortedV = objs.slice().sort(function (a, b) {
        return a.top - b.top;
      });
      var totalH = sortedV.reduce(function (s, o) {
        return s + o.getScaledHeight();
      }, 0);
      var gapV =
        (sortedV[sortedV.length - 1].top +
          sortedV[sortedV.length - 1].getScaledHeight() -
          sortedV[0].top -
          totalH) /
        (sortedV.length - 1);
      var y = sortedV[0].top;
      sortedV.forEach(function (o) {
        o.set("top", y);
        y += o.getScaledHeight() + gapV;
        o.setCoords();
      });
    }

    fc.renderAll();
    FB.design.layers.render();
  }

  return { run: run };
})();
```

- [ ] **Verify:** Draw 2+ shapes, select all (Ctrl+A). The align bar appears above the canvas. Click "⊢L" → all objects align to left edge. Click "≡M" → all vertically centred. Select 3+ objects → H-Dist and V-Dist buttons appear and distribute objects evenly.

- [ ] **Commit:**

```bash
git add js/design.js
git commit -m "feat: align and distribute toolbar for selected objects"
```

---

## Task 9: server.py — designs API

**Files:**

- Modify: `server.py`

- [ ] **Add `do_GET` and `do_DELETE` handlers and 3 design endpoints.**

In `server.py`, add after the `do_OPTIONS` method and before `do_POST`:

```python
def do_GET(self):
    parsed = urllib.parse.urlparse(self.path)
    if parsed.path == '/api/designs':
        self._handle_designs_list()
    elif parsed.path.startswith('/api/designs/'):
        slug = parsed.path.split('/api/designs/')[1]
        self._handle_design_get(slug)
    else:
        super().do_GET()

def do_DELETE(self):
    parsed = urllib.parse.urlparse(self.path)
    if parsed.path.startswith('/api/designs/'):
        slug = parsed.path.split('/api/designs/')[1]
        self._handle_design_delete(slug)
    else:
        self.send_error(HTTPStatus.NOT_FOUND)
```

Add the four handler methods before `_json_response`:

```python
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

def _handle_design_get(self, slug):
    slug = slug.replace('/', '').replace('..', '')
    path = os.path.join(STATIC_DIR, 'designs', slug + '.json')
    if not os.path.exists(path):
        self.send_error(HTTPStatus.NOT_FOUND)
        return
    with open(path, 'r') as f:
        self._json_response(json.load(f))

def _handle_design_save(self):
    length = int(self.headers.get('Content-Length', 0))
    body = json.loads(self.rfile.read(length)) if length else {}
    name = (body.get('name') or 'Untitled').strip()
    slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-') or 'untitled'
    designs_dir = os.path.join(STATIC_DIR, 'designs')
    os.makedirs(designs_dir, exist_ok=True)
    import datetime
    body['slug'] = slug
    body['name'] = name
    body['modified'] = datetime.datetime.utcnow().isoformat() + 'Z'
    with open(os.path.join(designs_dir, slug + '.json'), 'w') as f:
        json.dump(body, f)
    self._json_response({'ok': True, 'slug': slug})

def _handle_design_delete(self, slug):
    slug = slug.replace('/', '').replace('..', '')
    path = os.path.join(STATIC_DIR, 'designs', slug + '.json')
    if os.path.exists(path):
        os.remove(path)
    self._json_response({'ok': True})
```

- [ ] **Wire `_handle_design_save` into `do_POST`**. In the `do_POST` method add:

```python
elif parsed.path == '/api/designs':
    self._handle_design_save()
```

- [ ] **Also add the `Access-Control-Allow-Methods` in `do_OPTIONS` to include `DELETE`:**

Find `"Access-Control-Allow-Methods", "GET, POST, OPTIONS"` and change to:

```python
self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
```

- [ ] **Verify:** Restart `python server.py`. Run:

```bash
curl -s http://localhost:8899/api/designs
# → []

curl -s -X POST http://localhost:8899/api/designs \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","width":1200,"height":630,"thumbnail":"","fabric":{}}'
# → {"ok": true, "slug": "test"}

curl -s http://localhost:8899/api/designs
# → [{"name":"Test","slug":"test",...}]

curl -s -X DELETE http://localhost:8899/api/designs/test
# → {"ok": true}
```

- [ ] **Commit:**

```bash
git add server.py
git commit -m "feat: server.py designs API — GET list, GET slug, POST save, DELETE"
```

---

## Task 10: Design library — save, load, My Designs overlay

**Files:**

- Modify: `js/design.js`

- [ ] **Add `FB.design.library`:**

```js
FB.design.library = (function () {
  var _currentName = "Untitled";

  function save() {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var name = prompt("Save design as:", _currentName);
    if (!name) return;
    _currentName = name;
    var thumbnail = fc.toDataURL({
      format: "png",
      multiplier: Math.min(1, 320 / fc.getWidth()),
    });
    var payload = {
      name: name,
      width: fc.getWidth(),
      height: fc.getHeight(),
      thumbnail: thumbnail,
      fabric: fc.toJSON(["name"]),
    };
    fetch("/api/designs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        if (d.ok) {
          FB.util.showToast("Saved: " + name);
        }
      });
  }

  function openPicker() {
    fetch("/api/designs")
      .then(function (r) {
        return r.json();
      })
      .then(function (list) {
        var grid = document.getElementById("ds-library-grid");
        grid.innerHTML = list.length
          ? list
              .map(function (d) {
                return (
                  '<div class="ds-template-thumb" onclick="FB.design.library.loadDesign(\'' +
                  d.slug +
                  "')\">" +
                  (d.thumbnail
                    ? '<img src="' + d.thumbnail + '" alt="' + d.name + '">'
                    : '<div style="height:80px;background:#1a1a2a"></div>') +
                  '<div class="ds-thumb-label">' +
                  d.name +
                  "</div></div>"
                );
              })
              .join("")
          : '<p style="color:#666;padding:16px;font-size:12px">No saved designs yet.</p>';
        document.getElementById("ds-library-overlay").style.display = "flex";
      });
  }

  function closePicker() {
    document.getElementById("ds-library-overlay").style.display = "none";
  }

  function loadDesign(slug) {
    if (!confirm("Load this design? Unsaved changes will be lost.")) return;
    fetch("/api/designs/" + slug)
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        var fc = FB.design.canvas.get();
        fc.setWidth(d.width);
        fc.setHeight(d.height);
        fc.loadFromJSON(d.fabric, function () {
          fc.renderAll();
          FB.design.layers.render();
          FB.design.props.render();
          _currentName = d.name;
          closePicker();
          FB.util.showToast("Loaded: " + d.name);
        });
      });
  }

  function exportPNG() {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var url = fc.toDataURL({ format: "png", multiplier: 1 });
    var a = document.createElement("a");
    a.href = url;
    a.download = (_currentName || "design") + ".png";
    a.click();
  }

  function exportSVG() {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var svg = fc.toSVG();
    var blob = new Blob([svg], { type: "image/svg+xml" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (_currentName || "design") + ".svg";
    a.click();
  }

  function insertIntoPage() {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var dataUrl = fc.toDataURL({ format: "png", multiplier: 1 });
    FB.panels.setMode("builder");
    FB.state.saveHistory();
    FB.state.blocks.push({
      id: FB.state.genId(),
      type: "imageBlock",
      props: { src: dataUrl, alt: _currentName, objectFit: "contain" },
    });
    FB.canvas.render();
    FB.util.showToast("Design inserted as image block");
  }

  return {
    save: save,
    openPicker: openPicker,
    closePicker: closePicker,
    loadDesign: loadDesign,
    exportPNG: exportPNG,
    exportSVG: exportSVG,
    insertIntoPage: insertIntoPage,
  };
})();
```

- [ ] **Verify:** In Design mode, draw something, click Save → prompt appears, enter a name, toast says "Saved". Click 📁 My Designs → overlay shows saved design thumbnail. Click it → design loads. Click Export PNG → file downloads. Click Export SVG → SVG file downloads.

- [ ] **Commit:**

```bash
git add js/design.js
git commit -m "feat: design library — save, load, export PNG/SVG, insert into page"
```

---

## Task 11: imageBlock in the page builder

**Files:**

- Modify: `js/canvas.js`
- Modify: `js/panels.js`

- [ ] **Add `imageBlock` case to the `switch` in `FB.canvas.renderBlockHTML` in `js/canvas.js`** (add before the final `default:` or after the last `case`):

```js
case 'imageBlock':
  return '<div class="fw-image-block" style="text-align:center">' +
    '<img src="' + (p.src || '') + '" alt="' + (p.alt || '') + '" ' +
    'style="max-width:100%;height:auto;object-fit:' + (p.objectFit || 'contain') + '">' +
    '</div>';
```

- [ ] **Register imageBlock in the block library** so it appears in the left panel. In `js/panels.js`, find `FB.panels.buildLibrary` and add imageBlock to the custom section, or add it to the existing Custom accordion. Find where `colorBlock` is referenced in `buildLibrary` and add after it:

```js
// imageBlock appears via "Insert into page" from Design mode — no manual library entry needed.
// The block renders via canvas.js. No additional registration required.
```

(No library entry needed — imageBlock is only inserted programmatically from Design mode.)

- [ ] **Add My Designs accordion to the builder left panel** in `framework-builder.html`. Add after the last `</div>` closing the Veltro Engine accordion (around line 560):

```html
<div class="lp-accordion">
  <div
    class="lp-acc-header"
    data-acc="mydesigns"
    onclick="FB.panels.toggleLeftAccordion(this)"
  >
    <span class="lp-acc-icon">✏</span>
    <span class="lp-acc-label">My Designs</span>
    <span class="lp-acc-arrow">▶</span>
  </div>
  <div class="lp-acc-body" id="lp-body-mydesigns">
    <div id="builder-designs-grid" class="ds-builder-thumb-grid"></div>
    <div style="padding:0 8px 8px">
      <button
        class="rp-btn"
        onclick="FB.panels.loadBuilderDesigns()"
        style="width:100%"
      >
        Refresh
      </button>
    </div>
  </div>
</div>
```

- [ ] **Add `FB.panels.loadBuilderDesigns()` to `js/panels.js`:**

```js
FB.panels.loadBuilderDesigns = function () {
  fetch("/api/designs")
    .then(function (r) {
      return r.json();
    })
    .then(function (list) {
      var grid = document.getElementById("builder-designs-grid");
      if (!grid) return;
      grid.innerHTML = list.length
        ? list
            .map(function (d) {
              return (
                '<div class="ds-builder-thumb" onclick="FB.panels.insertDesignBlock(\'' +
                d.slug +
                '\')" title="' +
                d.name +
                '">' +
                (d.thumbnail
                  ? '<img src="' + d.thumbnail + '" alt="' + d.name + '">'
                  : '<div style="height:60px;background:#1a1a2a"></div>') +
                '<div class="ds-builder-thumb-label">' +
                d.name +
                "</div></div>"
              );
            })
            .join("")
        : '<p style="color:#666;padding:8px;font-size:10px">No saved designs.</p>';
    });
};

FB.panels.insertDesignBlock = function (slug) {
  fetch("/api/designs/" + slug)
    .then(function (r) {
      return r.json();
    })
    .then(function (d) {
      var tmpCanvas = new fabric.StaticCanvas(null, {
        width: d.width,
        height: d.height,
      });
      tmpCanvas.loadFromJSON(d.fabric, function () {
        var dataUrl = tmpCanvas.toDataURL({ format: "png", multiplier: 1 });
        tmpCanvas.dispose();
        FB.state.saveHistory();
        FB.state.blocks.push({
          id: FB.state.genId(),
          type: "imageBlock",
          props: { src: dataUrl, alt: d.name, objectFit: "contain" },
        });
        FB.canvas.render();
        FB.util.showToast("Inserted: " + d.name);
      });
    });
};
```

- [ ] **Auto-load designs when the My Designs accordion is opened.** Find `FB.panels.toggleLeftAccordion` in `panels.js` and add:

```js
// Inside toggleLeftAccordion, after toggling the 'open' class, add:
if (header.dataset.acc === "mydesigns" && body.classList.contains("open")) {
  FB.panels.loadBuilderDesigns();
}
```

- [ ] **Verify:** In Design mode, create a design and click "Insert into page →" → switches to builder, image block appears at bottom. Open the My Designs accordion → saved designs appear as thumbnails. Click one → image block inserted.

- [ ] **Commit:**

```bash
git add js/canvas.js js/panels.js framework-builder.html
git commit -m "feat: imageBlock type + My Designs accordion in builder left panel"
```

---

## Task 12: Templates

**Files:**

- Create: `widgets/design-templates.js`
- Modify: `js/design.js`

- [ ] **Create `widgets/design-templates.js`** with 6 minimal starter canvases:

```js
FB.design.TEMPLATES = [
  {
    key: "hero",
    name: "Hero Banner",
    width: 1920,
    height: 600,
    fabric: {
      version: "5.3.1",
      objects: [
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 1920,
          height: 600,
          fill: "#111111",
          name: "Background",
        },
        {
          type: "rect",
          left: 60,
          top: 220,
          width: 6,
          height: 80,
          fill: "#CDFE00",
          name: "Accent bar",
        },
        {
          type: "i-text",
          left: 80,
          top: 200,
          text: "Your Headline Here",
          fontFamily: "Lexend",
          fontSize: 80,
          fontWeight: 700,
          fill: "#ffffff",
          name: "Headline",
        },
        {
          type: "i-text",
          left: 80,
          top: 310,
          text: "A short supporting tagline for your hero section",
          fontFamily: "Lexend",
          fontSize: 28,
          fill: "#aaaaaa",
          name: "Subhead",
        },
        {
          type: "rect",
          left: 80,
          top: 380,
          width: 200,
          height: 54,
          fill: "#CDFE00",
          rx: 4,
          ry: 4,
          name: "CTA button bg",
        },
        {
          type: "i-text",
          left: 118,
          top: 395,
          text: "Get Started",
          fontFamily: "Lexend",
          fontSize: 20,
          fontWeight: 700,
          fill: "#000000",
          name: "CTA label",
        },
      ],
      background: "#111111",
    },
  },
  {
    key: "og",
    name: "OG Image",
    width: 1200,
    height: 630,
    fabric: {
      version: "5.3.1",
      objects: [
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 1200,
          height: 630,
          fill: "#0d0d1a",
          name: "Background",
        },
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 8,
          height: 630,
          fill: "#CDFE00",
          name: "Left accent",
        },
        {
          type: "i-text",
          left: 60,
          top: 220,
          text: "Page Title",
          fontFamily: "Lexend",
          fontSize: 72,
          fontWeight: 800,
          fill: "#ffffff",
          name: "Title",
        },
        {
          type: "i-text",
          left: 60,
          top: 320,
          text: "yoursite.com",
          fontFamily: "Lexend",
          fontSize: 28,
          fill: "#CDFE00",
          name: "URL",
        },
      ],
      background: "#0d0d1a",
    },
  },
  {
    key: "card",
    name: "Feature Card",
    width: 800,
    height: 600,
    fabric: {
      version: "5.3.1",
      objects: [
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 800,
          height: 600,
          fill: "#1a1a2a",
          name: "Card bg",
        },
        {
          type: "rect",
          left: 40,
          top: 40,
          width: 56,
          height: 56,
          fill: "#CDFE0020",
          rx: 12,
          ry: 12,
          name: "Icon bg",
        },
        {
          type: "i-text",
          left: 56,
          top: 52,
          text: "✦",
          fontFamily: "Lexend",
          fontSize: 28,
          fill: "#CDFE00",
          name: "Icon",
        },
        {
          type: "i-text",
          left: 40,
          top: 130,
          text: "Feature Title",
          fontFamily: "Lexend",
          fontSize: 36,
          fontWeight: 700,
          fill: "#ffffff",
          name: "Title",
        },
        {
          type: "i-text",
          left: 40,
          top: 190,
          text: "Describe your feature in one or two\nshort sentences that explain the value.",
          fontFamily: "Lexend",
          fontSize: 18,
          fill: "#888888",
          name: "Description",
        },
      ],
      background: "#1a1a2a",
    },
  },
  {
    key: "square",
    name: "Square Post",
    width: 1080,
    height: 1080,
    fabric: {
      version: "5.3.1",
      objects: [
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 1080,
          height: 1080,
          fill: "#111111",
          name: "Background",
        },
        {
          type: "rect",
          left: 0,
          top: 900,
          width: 1080,
          height: 180,
          fill: "#CDFE00",
          name: "Footer bar",
        },
        {
          type: "i-text",
          left: 80,
          top: 400,
          text: "Your Message\nGoes Here",
          fontFamily: "Lexend",
          fontSize: 96,
          fontWeight: 800,
          fill: "#ffffff",
          textAlign: "left",
          name: "Headline",
        },
        {
          type: "i-text",
          left: 80,
          top: 930,
          text: "yoursite.com",
          fontFamily: "Lexend",
          fontSize: 40,
          fontWeight: 700,
          fill: "#000000",
          name: "URL",
        },
      ],
      background: "#111111",
    },
  },
  {
    key: "wide",
    name: "Wide (16:9)",
    width: 1920,
    height: 1080,
    fabric: {
      version: "5.3.1",
      objects: [
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          fill: "#0d0d1a",
          name: "Background",
        },
        {
          type: "rect",
          left: 0,
          top: 0,
          width: 1920,
          height: 4,
          fill: "#CDFE00",
          name: "Top line",
        },
        {
          type: "i-text",
          left: 160,
          top: 380,
          text: "Slide Title",
          fontFamily: "Lexend",
          fontSize: 100,
          fontWeight: 800,
          fill: "#ffffff",
          name: "Title",
        },
        {
          type: "i-text",
          left: 160,
          top: 510,
          text: "Supporting subtitle text goes here",
          fontFamily: "Lexend",
          fontSize: 40,
          fill: "#888888",
          name: "Subtitle",
        },
      ],
      background: "#0d0d1a",
    },
  },
  {
    key: "blank",
    name: "Blank Canvas",
    width: 1200,
    height: 630,
    fabric: { version: "5.3.1", objects: [], background: "#ffffff" },
  },
];
```

- [ ] **Add `FB.design.templates` to `js/design.js`:**

```js
FB.design.templates = (function () {
  function open() {
    var grid = document.getElementById("ds-template-grid");
    var list = FB.design.TEMPLATES || [];
    grid.innerHTML = list
      .map(function (t) {
        return (
          '<div class="ds-template-thumb" onclick="FB.design.templates.load(\'' +
          t.key +
          "')\">" +
          '<div style="height:80px;background:#1a1a2a;display:flex;align-items:center;justify-content:center;font-size:10px;color:#666">' +
          t.width +
          "×" +
          t.height +
          "</div>" +
          '<div class="ds-thumb-label">' +
          t.name +
          "</div></div>"
        );
      })
      .join("");
    document.getElementById("ds-template-overlay").style.display = "flex";
  }

  function close() {
    document.getElementById("ds-template-overlay").style.display = "none";
  }

  function load(key) {
    var tpl = (FB.design.TEMPLATES || []).filter(function (t) {
      return t.key === key;
    })[0];
    if (!tpl) return;
    var fc = FB.design.canvas.get();
    if (
      fc.getObjects().length &&
      !confirm("Replace current canvas with this template?")
    )
      return;
    fc.setWidth(tpl.width);
    fc.setHeight(tpl.height);
    fc.loadFromJSON(tpl.fabric, function () {
      fc.renderAll();
      FB.design.layers.render();
      FB.design.canvas.zoomFit();
      close();
    });
  }

  return { open: open, close: close, load: load };
})();
```

- [ ] **Verify:** In Design mode, click ⊞ Templates → overlay opens with 6 template cards. Click "Hero Banner" → canvas loads with the hero template objects, zoom fits. Click ✕ → overlay closes.

- [ ] **Commit:**

```bash
git add js/design.js widgets/design-templates.js
git commit -m "feat: 6 starter templates with template picker overlay"
```

---

## Task 13: AI image generation

**Files:**

- Modify: `server.py`
- Modify: `js/design.js`

- [ ] **Add `_handle_ai_image` to `server.py`:**

```python
def _handle_ai_image(self):
    length = int(self.headers.get('Content-Length', 0))
    body = json.loads(self.rfile.read(length)) if length else {}
    prompt = body.get('prompt', '').strip()
    api_key = body.get('apiKey', os.environ.get('OPENAI_API_KEY', ''))
    if not prompt:
        self._json_response({'error': 'Missing prompt'}, 400)
        return
    if not api_key:
        self._json_response({'error': 'No OpenAI API key. Set OPENAI_API_KEY or pass apiKey in the request.'}, 400)
        return
    try:
        req_data = json.dumps({'model': 'dall-e-3', 'prompt': prompt, 'n': 1, 'size': '1024x1024'}).encode()
        req = urllib.request.Request(
            'https://api.openai.com/v1/images/generations',
            data=req_data,
            headers={'Content-Type': 'application/json', 'Authorization': 'Bearer ' + api_key},
        )
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read())
        self._json_response({'url': data['data'][0]['url']})
    except urllib.error.HTTPError as e:
        self._json_response({'error': 'OpenAI error: ' + e.read().decode()[:200]}, 500)
    except Exception as e:
        self._json_response({'error': str(e)[:200]}, 500)
```

- [ ] **Wire into `do_POST`** — add to the `if/elif` chain:

```python
elif parsed.path == '/api/ai-image':
    self._handle_ai_image()
```

- [ ] **Add `FB.design.ai` to `js/design.js`:**

```js
FB.design.ai = (function () {
  function open() {
    document.getElementById("ds-ai-overlay").style.display = "flex";
    document.getElementById("ds-ai-status").textContent = "";
  }

  function close() {
    document.getElementById("ds-ai-overlay").style.display = "none";
  }

  function generate() {
    var prompt = document.getElementById("ds-ai-prompt").value.trim();
    if (!prompt) return;
    var status = document.getElementById("ds-ai-status");
    status.textContent = "Generating…";

    fetch("/api/ai-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt }),
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        if (d.error) {
          status.textContent = "Error: " + d.error;
          return;
        }
        status.textContent = "Placing image…";
        fabric.Image.fromURL(
          d.url,
          function (img) {
            var fc = FB.design.canvas.get();
            var maxW = fc.getWidth() * 0.6;
            if (img.width > maxW) img.scaleToWidth(maxW);
            img.set({
              left: fc.getWidth() / 2 - img.getScaledWidth() / 2,
              top: fc.getHeight() / 2 - img.getScaledHeight() / 2,
              name: "AI: " + prompt.slice(0, 30),
            });
            fc.add(img);
            fc.setActiveObject(img);
            fc.renderAll();
            close();
            FB.util.showToast("AI image added to canvas");
          },
          { crossOrigin: "anonymous" },
        );
      })
      .catch(function (err) {
        status.textContent = "Request failed: " + err.message;
      });
  }

  return { open: open, close: close, generate: generate };
})();
```

- [ ] **Verify:** Click ✦ AI Generate → overlay opens. Without an API key, clicking Generate shows an error message. With `OPENAI_API_KEY` set, a prompt generates an image placed on canvas.

- [ ] **Commit:**

```bash
git add js/design.js server.py
git commit -m "feat: AI image generation via DALL-E 3 — prompt panel + server endpoint"
```

---

## Task 14: Polish and keyboard shortcuts final check

**Files:**

- Modify: `js/app.js`

- [ ] **Ensure the existing `keydown` handler in `js/app.js` doesn't conflict.** Find the existing `document.addEventListener('keydown', ...)` in `app.js` and verify that when `FB.design._mode` is true, builder shortcuts (Ctrl+Z for FB.state.undo, etc.) don't fire. Add a guard at the top of the existing handler:

```js
document.addEventListener("keydown", function (e) {
  if (FB.design._mode) return; // design mode handles its own keys
  // ... rest of existing handler
});
```

- [ ] **Add `.gitignore` entry for `designs/`** to avoid committing binary thumbnail data:

In `.gitignore` (create if not present):

```
designs/
```

- [ ] **Verify full keyboard shortcut table:**
  - V → Select tool active (highlighted in grid)
  - R → Rect tool
  - O → Circle tool
  - T → Text tool (double-click canvas to place text)
  - Delete → removes selected object(s)
  - Ctrl+D → duplicates selected object (appears offset by 20px)
  - Ctrl+Z → undoes last action
  - Ctrl+Y → redoes
  - Ctrl+S → save prompt opens
  - Escape → returns to Builder mode

- [ ] **Commit:**

```bash
git add js/app.js .gitignore
git commit -m "feat: keyboard shortcut isolation — design mode keys don't fire builder handlers"
```

---

## Self-Review

### Spec coverage check

| Spec requirement                                             | Covered by task |
| ------------------------------------------------------------ | --------------- |
| Fabric.js 5.3.1 CDN                                          | Task 1          |
| Design mode via sidebar icon (Option C stacked)              | Tasks 1, 2      |
| Tool grid: rect, circle, tri, poly, line, arrow, text, image | Task 5          |
| Layers panel — visibility, lock, rename, select              | Task 6          |
| Undo/redo (max 50, Ctrl+Z/Y)                                 | Task 4          |
| Context-sensitive right panel                                | Task 7          |
| Align & distribute toolbar                                   | Task 8          |
| Canvas size presets + topbar                                 | Task 3          |
| Export PNG + SVG                                             | Task 10         |
| `server.py` GET/POST/DELETE /api/designs                     | Task 9          |
| Save/load designs from server                                | Task 10         |
| Starter templates (6)                                        | Task 12         |
| AI image generation (DALL-E 3)                               | Task 13         |
| Insert into page → imageBlock                                | Tasks 10, 11    |
| My Designs picker in builder                                 | Task 11         |
| `imageBlock` block type                                      | Task 11         |
| Keyboard shortcuts                                           | Tasks 3, 5, 14  |
| `.gitignore` for designs/                                    | Task 14         |

All spec requirements covered.

### Placeholder scan

No TBDs or incomplete steps found.

### Type/name consistency check

- `FB.design.canvas.get()` used across all modules — defined in Task 3 ✓
- `FB.design.layers.render()` called in canvas events — defined in Task 6 ✓
- `FB.design.props.render()` called in canvas events — defined in Task 7 ✓
- `FB.design.history.push()` called in canvas events — defined in Task 4 ✓
- `FB.design._mode` flag set in `setMode()` and guarded in key handlers ✓
- `FB.util.showToast` — used by all existing modules, safe to call ✓
- `FB.design.TEMPLATES` defined in `design-templates.js`, read by `FB.design.templates.load()` ✓
