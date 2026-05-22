# Website Template Builder — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the monolithic `framework-builder.html` (~1424 lines) into a modular, maintainable file structure and add Phase 1 features: collapsible sidebars, visual design refresh, accordion editing panel, template system, 3 new block types, auto-save, enhanced undo/redo, and export improvements.

**Architecture:** Single-page frontend app organized into 6 JS modules + 5 CSS files loaded from a minimal HTML shell. No build pipeline. All modules share a global `const FB = {};` namespace. State managed centrally in `FB.state`.

**Tech Stack:** Vanilla HTML/CSS/JS. No frameworks. No build tools. Google Fonts (Syne + DM Sans).

---

## File Map

### Files to Create

| #   | Path                       | Purpose                                                                                                             |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1   | `css/reset.css`            | CSS reset + custom properties (`--surface-*`, `--text-*`, `--accent` tokens)                                        |
| 2   | `css/layout.css`           | Topbar (44px), 3-panel flexbox, collapsible sidebar transitions                                                     |
| 3   | `css/components.css`       | Reusable UI: `.tb-btn`, `.rp-btn`, `.rp-row`, color picker, sliders, modal, toast, device buttons                   |
| 4   | `css/blocks.css`           | All `.fw-*` block render styles — extracted verbatim from existing file (lines 237-351)                             |
| 5   | `css/canvas.css`           | Canvas background grid, `.canvas-block`, `.block-controls`, `.drag-handle`, `.drop-indicator`, preview mode         |
| 6   | `js/state.js`              | `FB.state` — blocks[], selectedId, history[], future[], saveHistory(), undo(), redo(), genId()                      |
| 7   | `js/blocks.js`             | `FB.blocks` — BLOCK_DEFS, CUSTOM_BLOCK_DEFS (including new: features, pricing, team)                                |
| 8   | `js/canvas.js`             | `FB.canvas` — renderCanvas(), renderBlockHTML(), refreshBlock(), selectBlock(), handleDrop(), move/delete/duplicate |
| 9   | `js/panels.js`             | `FB.panels` — buildLibrary(), renderRightPanel(), updateProp(), all update\* helper functions, accordion logic      |
| 10  | `js/export.js`             | `FB.export` — generateHTML(), generateReact(), openExport(), copyCode(), downloadCode()                             |
| 11  | `js/app.js`                | Init — buildLibrary(), loadStarterTemplate(), keyboard shortcuts, toast, modal overlay click                        |
| 12  | `templates/agency.json`    | Full agency homepage template (nav+hero+marquee+work+services+stats+testimonial+process+cta+footer)                 |
| 13  | `templates/saas.json`      | SaaS landing page template                                                                                          |
| 14  | `templates/portfolio.json` | Portfolio homepage template                                                                                         |

### Files to Modify

| #   | Path                     | Change                                                                                                                     |
| --- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| 15  | `framework-builder.html` | Strip inline CSS and JS, replace with `<link>` and `<script>` tags loading the new files. Add topbar panel-toggle buttons. |

---

### Task 1: Create CSS directory and extract styles

**Files:**

- Create: `css/reset.css`
- Create: `css/layout.css`
- Create: `css/components.css`
- Create: `css/blocks.css`
- Create: `css/canvas.css`

- [ ] **Step 1: Create `css/reset.css`**

```css
/* ── RESET & CUSTOM PROPERTIES ── */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --surface-0: #0d0d12;
  --surface-1: #1a1a1f;
  --surface-2: #222228;
  --surface-3: #2a2a32;
  --border: #2e2e38;
  --border-light: #3a3a48;
  --text-primary: #f0f0f0;
  --text-secondary: #ccc;
  --text-muted: #666;
  --accent: #cdfe00;
  --accent-hover: #b8e400;
  --danger: #e55;
  --canvas-bg: #e8e8e4;
  --font-ui: "DM Sans", sans-serif;
  --font-display: "Syne", sans-serif;
  --size-caption: 10px;
  --size-sm: 11px;
  --size-body: 13px;
  --size-md: 14px;
  --size-lg: 15px;
}

html,
body {
  height: 100%;
  overflow: hidden;
  font-family: var(--font-ui);
  background: var(--surface-1);
  color: var(--text-secondary);
}
```

- [ ] **Step 2: Create `css/layout.css`**

Extract from existing file lines 21-95, plus update for collapsible panels:

```css
/* ── TOP BAR ── */
#topbar {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
  position: relative;
  z-index: 200;
  flex-shrink: 0;
}
#topbar .logo {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: var(--size-lg);
  color: #fff;
  letter-spacing: -0.5px;
}
#topbar .logo span {
  color: var(--accent);
}
.tb-center {
  display: flex;
  gap: 6px;
  align-items: center;
}
.tb-btn {
  background: var(--surface-3);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 5px 12px;
  font-size: 12px;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  transition:
    background 0.15s,
    color 0.15s;
  white-space: nowrap;
}
.tb-btn:hover {
  background: #3a3a48;
  color: var(--text-primary);
}
.tb-btn.active {
  background: var(--accent);
  color: #111;
  border-color: var(--accent);
  font-weight: 500;
}
.tb-btn.danger {
  border-color: var(--danger);
  color: #e88;
}
.tb-btn.danger:hover {
  background: var(--danger);
  color: #fff;
}
.tb-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.tb-sep {
  width: 1px;
  height: 24px;
  background: var(--border);
  margin: 0 4px;
}
.tb-right {
  display: flex;
  gap: 6px;
  align-items: center;
}
.tb-export {
  background: var(--accent);
  color: #111;
  border: none;
  padding: 6px 16px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.15s;
}
.tb-export:hover {
  opacity: 0.85;
}
.device-btns {
  display: flex;
  gap: 2px;
  background: var(--surface-1);
  padding: 3px;
  border-radius: 6px;
}
.dev-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.15s;
}
.dev-btn.active {
  background: var(--surface-3);
  color: var(--text-primary);
}

/* ── MAIN LAYOUT ── */
#app {
  display: flex;
  height: calc(100vh - 44px);
  overflow: hidden;
}

/* ── LEFT PANEL ── */
#left-panel {
  width: 220px;
  flex-shrink: 0;
  background: var(--surface-2);
  border-right: 1px solid var(--border);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  transition: width 280ms cubic-bezier(0.16, 1, 0.3, 1);
}
#left-panel.collapsed {
  width: 48px;
}
#left-panel::-webkit-scrollbar {
  width: 4px;
}
#left-panel::-webkit-scrollbar-track {
  background: transparent;
}
#left-panel::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}
.panel-title {
  font-size: var(--size-caption);
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 14px 14px 8px;
  font-weight: 400;
}

/* ── RIGHT PANEL ── */
#right-panel {
  width: 280px;
  flex-shrink: 0;
  background: var(--surface-2);
  border-left: 1px solid var(--border);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  transition: width 280ms cubic-bezier(0.16, 1, 0.3, 1);
}
#right-panel.collapsed {
  width: 44px;
}
#right-panel::-webkit-scrollbar {
  width: 4px;
}
#right-panel::-webkit-scrollbar-track {
  background: transparent;
}
#right-panel::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}
.rp-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 8px;
  color: var(--text-muted);
  font-size: var(--size-body);
  text-align: center;
  padding: 2rem;
}
.rp-empty-icon {
  font-size: 32px;
  opacity: 0.3;
}
.rp-section {
  border-bottom: 1px solid var(--border);
}
.rp-section-title {
  font-size: var(--size-caption);
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--text-muted);
  padding: 12px 14px 6px;
  font-weight: 400;
}

/* ── CANVAS AREA ── */
#canvas-wrap {
  flex: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  background: var(--canvas-bg);
  position: relative;
  background-image: radial-gradient(circle, #ccc 1px, transparent 1px);
  background-size: 24px 24px;
}
#canvas-wrap::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
#canvas-wrap::-webkit-scrollbar-track {
  background: var(--canvas-bg);
}
#canvas-wrap::-webkit-scrollbar-thumb {
  background: #bbb;
  border-radius: 3px;
}
#canvas {
  width: 1280px;
  min-height: 100%;
  background: #fff;
  box-shadow: 0 4px 60px rgba(0, 0, 0, 0.25);
  position: relative;
  transition: width 0.3s ease;
  flex-shrink: 0;
}
#canvas.tablet {
  width: 768px;
}
#canvas.mobile {
  width: 390px;
}

/* ── PREVIEW MODE ── */
body.preview #left-panel,
body.preview #right-panel {
  display: none;
}
body.preview #canvas-wrap {
  background: var(--canvas-bg);
}
body.preview #canvas {
  box-shadow: none;
}
body.preview .block-controls {
  display: none !important;
}
body.preview [contenteditable] {
  outline: none !important;
  cursor: default;
}

/* ── PANEL TOGGLE HANDLES ── */
.panel-toggle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 10px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 0 4px 4px 0;
  z-index: 100;
  transition: color 0.15s;
}
.panel-toggle:hover {
  color: var(--accent);
}
#left-panel-wrap {
  position: relative;
}
#right-panel-wrap {
  position: relative;
}
```

- [ ] **Step 3: Create `css/components.css`**

```css
/* ── BLOCK ITEMS IN LIBRARY ── */
.block-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  cursor: grab;
  border-radius: 6px;
  margin: 0 6px 2px;
  transition:
    background 0.15s,
    transform 0.15s;
  color: var(--text-secondary);
  font-size: var(--size-body);
  border: 1px solid transparent;
  user-select: none;
}
.block-item:hover {
  background: var(--surface-3);
  border-color: var(--border);
  transform: translateX(4px);
}
.block-item:active {
  cursor: grabbing;
}
.block-icon {
  width: 32px;
  height: 24px;
  border-radius: 4px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
}
.block-item .block-label {
  font-size: 12px;
  line-height: 1.3;
}
.block-item .block-sublabel {
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 1px;
}

/* ── RIGHT PANEL ROWS ── */
.rp-row {
  padding: 6px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.rp-row label {
  font-size: var(--size-sm);
  color: var(--text-muted);
}
.rp-row input[type="text"],
.rp-row input[type="number"],
.rp-row select,
.rp-row textarea {
  background: var(--surface-1);
  border: 1px solid var(--border);
  color: var(--text-primary);
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-family: inherit;
  width: 100%;
  transition: border-color 0.15s;
}
.rp-row input:focus,
.rp-row select:focus,
.rp-row textarea:focus {
  outline: none;
  border-color: var(--accent);
}
.rp-row textarea {
  resize: vertical;
  min-height: 60px;
}
.color-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.color-row input[type="color"] {
  width: 36px;
  height: 28px;
  border: 1px solid var(--border);
  background: var(--surface-1);
  border-radius: 6px;
  padding: 2px;
  cursor: pointer;
}
.color-row input[type="text"] {
  flex: 1;
}
.rp-btn {
  margin: 6px 14px;
  padding: 7px;
  background: var(--surface-3);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-family: inherit;
  transition: background 0.15s;
  width: calc(100% - 28px);
  text-align: left;
}
.rp-btn:hover {
  background: #3a3a48;
  color: var(--text-primary);
}
.rp-btn.accent {
  background: var(--accent);
  color: #111;
  border-color: var(--accent);
  font-weight: 600;
}
.rp-btn.accent:hover {
  opacity: 0.85;
}
input[type="range"] {
  width: 100%;
  accent-color: var(--accent);
  cursor: pointer;
}

/* ── ACCORDION SECTIONS ── */
.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid var(--border);
  transition: background 0.15s;
}
.accordion-header:hover {
  background: var(--surface-3);
}
.accordion-header .acc-label {
  font-size: var(--size-sm);
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 500;
}
.accordion-header .acc-arrow {
  font-size: 10px;
  color: var(--text-muted);
  transition: transform 0.2s;
}
.accordion-header.open .acc-arrow {
  transform: rotate(90deg);
}
.accordion-body {
  padding: 0;
  overflow: hidden;
  transition: max-height 200ms ease;
}
.accordion-body.collapsed {
  max-height: 0;
  padding: 0;
}

/* ── TOAST ── */
#toast {
  position: fixed;
  top: 60px;
  right: 20px;
  background: var(--surface-2);
  color: var(--text-primary);
  padding: 12px 20px;
  border-radius: 8px;
  font-size: var(--size-body);
  opacity: 0;
  transition:
    opacity 0.3s,
    transform 0.3s;
  z-index: 999;
  pointer-events: none;
  border: 1px solid var(--border);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;
}
#toast.show {
  opacity: 1;
  transform: translateY(0);
}
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: var(--accent);
  width: 100%;
  animation: toastShrink 2.2s linear forwards;
}
@keyframes toastShrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* ── MODAL ── */
#modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 500;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}
#modal-overlay.open {
  display: flex;
}
#modal {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  width: 680px;
  max-width: 95vw;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
}
.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}
.modal-head h3 {
  font-size: var(--size-md);
  color: var(--text-primary);
  font-weight: 500;
}
.modal-close {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 20px;
  cursor: pointer;
  line-height: 1;
}
.modal-close:hover {
  color: var(--text-primary);
}
.modal-tabs {
  display: flex;
  gap: 4px;
  padding: 8px 20px;
  border-bottom: 1px solid var(--border);
}
.modal-tab {
  padding: 6px 16px;
  font-size: 12px;
  cursor: pointer;
  border: none;
  background: var(--surface-1);
  color: var(--text-muted);
  font-family: inherit;
  border-radius: 20px;
  transition: all 0.15s;
}
.modal-tab.active {
  background: var(--accent);
  color: #111;
  font-weight: 500;
}
.modal-body {
  flex: 1;
  overflow: auto;
  padding: 0;
}
.code-output {
  background: var(--surface-0);
  font-family: monospace;
  font-size: 11px;
  line-height: 1.6;
  color: #a8d8a8;
  padding: 20px;
  overflow: auto;
  height: 100%;
  min-height: 300px;
  white-space: pre;
  tab-size: 2;
}
.modal-foot {
  padding: 12px 20px;
  border-top: 1px solid var(--border);
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
```

- [ ] **Step 4: Create `css/blocks.css`**

Extract verbatim from existing `framework-builder.html` lines 237-351 (all `.fw-*` rules). Copy the exact CSS between the `/* FRAMEWORK BLOCK STYLES */` comment and the closing `</style>` tag.

- [ ] **Step 5: Create `css/canvas.css`**

```css
/* ── CANVAS BLOCK WRAPPER ── */
.canvas-block {
  position: relative;
  outline: 2px solid transparent;
  transition: outline-color 0.15s;
}
.canvas-block:hover {
  outline-color: rgba(205, 254, 0, 0.4);
}
.canvas-block.selected {
  box-shadow: 0 0 0 2px rgba(205, 254, 0, 0.6);
  outline-color: transparent !important;
}
.canvas-block.drag-over {
  outline: 2px dashed var(--accent);
  outline-offset: -2px;
}
.canvas-block.locked {
  opacity: 0.6;
  pointer-events: none;
}

.block-controls {
  position: absolute;
  top: 0;
  right: 0;
  display: none;
  flex-direction: column;
  gap: 2px;
  z-index: 50;
  padding: 4px;
}
.canvas-block:hover .block-controls,
.canvas-block.selected .block-controls {
  display: flex;
}
.bc-btn {
  width: 26px;
  height: 26px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  background: rgba(17, 17, 17, 0.85);
  color: var(--text-primary);
  transition: background 0.15s;
}
.bc-btn:hover {
  background: var(--accent);
  color: #111;
}
.bc-btn.del:hover {
  background: var(--danger);
}
.bc-btn.locked-btn {
  color: var(--accent);
}
.drag-handle {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 20px;
  display: none;
  align-items: center;
  justify-content: center;
  cursor: grab;
  background: rgba(205, 254, 0, 0.15);
  z-index: 50;
}
.canvas-block:hover .drag-handle,
.canvas-block.selected .drag-handle {
  display: flex;
}
.drag-handle-icon {
  width: 4px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.drag-handle-icon span {
  width: 4px;
  height: 4px;
  background: var(--accent);
  border-radius: 50%;
  display: block;
}
.block-label-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 9px;
  color: var(--accent);
  background: rgba(0, 0, 0, 0.6);
  padding: 2px 6px;
  border-radius: 0 4px 0 0;
  z-index: 40;
  pointer-events: none;
  opacity: 0.6;
}
[contenteditable]:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(205, 254, 0, 0.5);
  border-radius: 2px;
}
.drop-indicator {
  height: 4px;
  background: var(--accent);
  border-radius: 2px;
  margin: 0;
  transition: all 0.15s;
  opacity: 0;
}
.drop-indicator.active {
  opacity: 1;
  height: 6px;
}
```

---

### Task 2: Create JS module files

**Files:**

- Create: `js/state.js`
- Create: `js/blocks.js`
- Create: `js/canvas.js`
- Create: `js/panels.js`
- Create: `js/export.js`
- Create: `js/app.js`

- [ ] **Step 1: Create `js/state.js`**

```javascript
// ── FB Namespace ──
const FB = {};

// ── STATE ──
FB.state = {
  blocks: [],
  selectedId: null,
  history: [],
  future: [],
};

FB.state.genId = function () {
  return "b_" + Math.random().toString(36).slice(2, 9);
};

FB.state.saveHistory = function () {
  FB.state.history.push(JSON.stringify(FB.state.blocks));
  if (FB.state.history.length > 100) FB.state.history.shift();
  FB.state.future = [];
};

FB.state.undo = function () {
  if (!FB.state.history.length) return;
  FB.state.future.push(JSON.stringify(FB.state.blocks));
  FB.state.blocks = JSON.parse(FB.state.history.pop());
  FB.canvas.render();
  FB.panels.updateUndoRedo();
  FB.util.showToast("Undone");
};

FB.state.redo = function () {
  if (!FB.state.future.length) return;
  FB.state.history.push(JSON.stringify(FB.state.blocks));
  FB.state.blocks = JSON.parse(FB.state.future.pop());
  FB.canvas.render();
  FB.panels.updateUndoRedo();
  FB.util.showToast("Redone");
};
```

- [ ] **Step 2: Create `js/blocks.js`**

```javascript
// ── BLOCK DEFINITIONS ──
FB.blocks = {};

FB.blocks.BLOCK_DEFS = {
  nav: {
    label: "Navigation",
    sublabel: "Logo + links + CTA",
    icon: "≡",
    iconBg: "#1a2a4a",
    iconColor: "#CDFE00",
    defaultProps: {
      logoText: "YourBrand.",
      links: ["Work", "Services", "About", "Contact"],
      ctaText: "Start a project",
      bg: "#111111",
      textColor: "#f7f6f2",
      accentColor: "#CDFE00",
    },
  },
  hero: {
    label: "Hero",
    sublabel: "Full-screen opener",
    icon: "H",
    iconBg: "#2a1a4a",
    iconColor: "#CDFE00",
    defaultProps: {
      eyebrow: "Nottingham · Est. 2026",
      headline: "We build things that <em>matter.</em>",
      subtext:
        "Bold brand and web design for businesses that refuse to be ordinary.",
      ctaText: "See our work →",
      bg: "#111111",
      accentColor: "#CDFE00",
      showBlob: true,
    },
  },
  marquee: {
    label: "Marquee Strip",
    sublabel: "Scrolling keyword band",
    icon: "»»",
    iconBg: "#3a3a00",
    iconColor: "#111",
    defaultProps: {
      items: [
        "Award Winning",
        "Creative",
        "Results Driven",
        "Human Centred",
        "Boldly Different",
      ],
      bg: "#CDFE00",
      textColor: "#111111",
      speed: 16,
    },
  },
  work: {
    label: "Work Grid",
    sublabel: "5-card project showcase",
    icon: "⊞",
    iconBg: "#1a3a2a",
    iconColor: "#CDFE00",
    defaultProps: {
      label: "Our work.",
      headline: "Selected projects.",
      cards: [
        {
          tag: "Fintech · Platform",
          title: "Project One",
          bg: "linear-gradient(135deg,#0d2137,#1a4a6e)",
        },
        {
          tag: "SaaS · Brand",
          title: "Project Two",
          bg: "linear-gradient(135deg,#1a1a3e,#3a1a5e)",
        },
        {
          tag: "E-commerce · UI",
          title: "Project Three",
          bg: "linear-gradient(135deg,#1a3a1a,#2e6e2e)",
        },
        {
          tag: "Mobile · App",
          title: "Project Four",
          bg: "linear-gradient(135deg,#3a1a0d,#7e3a1a)",
        },
        {
          tag: "Web · Strategy",
          title: "Project Five",
          bg: "linear-gradient(135deg,#1a1a1a,#3a3a3a)",
        },
      ],
      bg: "#f7f6f2",
      accentColor: "#CDFE00",
    },
  },
  services: {
    label: "Services List",
    sublabel: "Large text row layout",
    icon: "≫",
    iconBg: "#1a1a2e",
    iconColor: "#CDFE00",
    defaultProps: {
      label: "What we do.",
      headline: "Everything\nyou need.",
      description:
        "From brand foundations to complex digital platforms — strategy to launch and beyond.",
      services: [
        { num: "01", name: "Brand." },
        { num: "02", name: "Digital." },
        { num: "03", name: "Design." },
        { num: "04", name: "Development." },
        { num: "05", name: "Strategy." },
      ],
      bg: "#111111",
      accentColor: "#CDFE00",
    },
  },
  stats: {
    label: "Stats / Numbers",
    sublabel: "4-cell metric grid",
    icon: "##",
    iconBg: "#2a2a1a",
    iconColor: "#CDFE00",
    defaultProps: {
      stats: [
        { num: "11+", label: "Products Built" },
        { num: "260+", label: "Connections" },
        { num: "30yr", label: "Experience" },
        { num: "£450k", label: "Valuation" },
      ],
      bg: "#f7f6f2",
      accentColor: "#CDFE00",
    },
  },
  testimonial: {
    label: "Testimonial",
    sublabel: "Quote with image panel",
    icon: '"',
    iconBg: "#1a2a1a",
    iconColor: "#CDFE00",
    defaultProps: {
      quote:
        "Working with this team has been a genuine pleasure. Their passion for what they do shines through in every single detail.",
      attribution: "Sarah M. — Head of Digital, FinCo",
      bg: "#111111",
      accentColor: "#CDFE00",
    },
  },
  process: {
    label: "Process Steps",
    sublabel: "4-step flow section",
    icon: "①",
    iconBg: "#2a1a2a",
    iconColor: "#CDFE00",
    defaultProps: {
      label: "How we work.",
      headline: "Four steps to\nextraordinary.",
      steps: [
        {
          num: "01",
          title: "Discover",
          desc: "We dig into your business, your audience, and your goals before a single pixel is placed.",
        },
        {
          num: "02",
          title: "Define",
          desc: "Strategy, structure, and creative direction locked in. No surprises, just clarity.",
        },
        {
          num: "03",
          title: "Design",
          desc: "Where the magic happens. Bold, considered, always built with purpose.",
        },
        {
          num: "04",
          title: "Deliver",
          desc: "Launched, tested, and ready to perform. We don't disappear after handoff.",
        },
      ],
      bg: "#f7f6f2",
      accentColor: "#CDFE00",
    },
  },
  cta: {
    label: "CTA Strip",
    sublabel: "Full-width call to action",
    icon: "→",
    iconBg: "#3a3a00",
    iconColor: "#111",
    defaultProps: {
      headline: "Let's talk about\nyour <em>project.</em>",
      btnText: "Get in touch →",
      bg: "#CDFE00",
      textColor: "#111111",
    },
  },
  footer: {
    label: "Footer",
    sublabel: "Full footer with nav cols",
    icon: "⊥",
    iconBg: "#1a1a1a",
    iconColor: "#CDFE00",
    defaultProps: {
      logoText: "YourBrand.",
      tagline: "Designers. Creators. Developers.",
      cols: [
        { heading: "Company", links: ["About", "Work", "Process", "Careers"] },
        {
          heading: "Services",
          links: ["Brand", "Digital", "Design", "Development"],
        },
        {
          heading: "Contact",
          links: ["hello@brand.co.uk", "0115 000 0000", "Nottingham, UK"],
        },
      ],
      copyright: "© 2026 YourBrand. All rights reserved.",
      bg: "#111111",
      accentColor: "#CDFE00",
    },
  },
  // ── NEW BLOCK: features ──
  features: {
    label: "Features Grid",
    sublabel: "Icon + text feature set",
    icon: "✦",
    iconBg: "#1a2a3a",
    iconColor: "#CDFE00",
    defaultProps: {
      label: "What we offer.",
      headline: "Everything you need.",
      items: [
        {
          icon: "🚀",
          title: "Lightning Fast",
          desc: "Built for speed. Every millisecond counts.",
        },
        {
          icon: "🎨",
          title: "Beautiful Design",
          desc: "Pixel-perfect interfaces that delight users.",
        },
        {
          icon: "🔒",
          title: "Secure by Default",
          desc: "Enterprise-grade security out of the box.",
        },
      ],
      bg: "#ffffff",
      textColor: "#111111",
      accentColor: "#CDFE00",
    },
  },
  // ── NEW BLOCK: pricing ──
  pricing: {
    label: "Pricing Table",
    sublabel: "3-column tier cards",
    icon: "$",
    iconBg: "#2a3a1a",
    iconColor: "#CDFE00",
    defaultProps: {
      label: "Pricing.",
      headline: "Choose your plan.",
      tiers: [
        {
          name: "Starter",
          price: "£29",
          features: ["1 project", "Basic analytics", "Email support"],
          cta: "Get Started",
          featured: false,
        },
        {
          name: "Pro",
          price: "£79",
          features: [
            "10 projects",
            "Advanced analytics",
            "Priority support",
            "Custom domain",
          ],
          cta: "Go Pro",
          featured: true,
        },
        {
          name: "Enterprise",
          price: "£249",
          features: [
            "Unlimited projects",
            "Full analytics",
            "24/7 support",
            "Dedicated manager",
            "Custom integrations",
          ],
          cta: "Contact Us",
          featured: false,
        },
      ],
      bg: "#f7f6f2",
      accentColor: "#CDFE00",
    },
  },
  // ── NEW BLOCK: team ──
  team: {
    label: "Team Grid",
    sublabel: "Member profile cards",
    icon: "👥",
    iconBg: "#2a1a3a",
    iconColor: "#CDFE00",
    defaultProps: {
      label: "Our team.",
      headline: "The people behind the work.",
      members: [
        {
          name: "Alex Chen",
          role: "Creative Director",
          bio: "15 years shaping brand narratives.",
        },
        {
          name: "Sam Rivera",
          role: "Lead Developer",
          bio: "Full-stack engineer with a passion for clean code.",
        },
        {
          name: "Jordan Taylor",
          role: "Design Lead",
          bio: "Pixel-perfect interfaces are our obsession.",
        },
      ],
      bg: "#ffffff",
      textColor: "#111111",
      accentColor: "#CDFE00",
    },
  },
};

FB.blocks.CUSTOM_BLOCK_DEFS = {
  textBlock: {
    label: "Custom Text",
    sublabel: "Heading + paragraph",
    icon: "T",
    iconBg: "#2a1a1a",
    iconColor: "#CDFE00",
    defaultProps: {
      headline: "Your Headline Here",
      body: "Your body text goes here. Click to edit inline, or use the style panel on the right to change colours and spacing.",
      bg: "#ffffff",
      textColor: "#111111",
      accentColor: "#CDFE00",
      paddingV: 64,
      paddingH: 48,
    },
  },
  colorBlock: {
    label: "Colour Block",
    sublabel: "Full-width colour section",
    icon: "■",
    iconBg: "#1a3a1a",
    iconColor: "#CDFE00",
    defaultProps: {
      headline: "Bold Statement.",
      body: "A full-colour section for emphasis.",
      bg: "#CDFE00",
      textColor: "#111111",
      paddingV: 80,
      paddingH: 48,
    },
  },
};
```

- [ ] **Step 3: Create `js/canvas.js`**

Requires knowledge of all render functions. This is the largest JS file. Source the render logic from the existing `framework-builder.html` lines 730-960 and 1006-1044, 1049-1245, adapted for the `FB.*` namespace.

Key functions to include:

- `FB.canvas.render()` — rebuilds canvas HTML from `FB.state.blocks[]`
- `FB.canvas.renderBlockHTML(block)` — switch-case returning HTML per block type (include ALL existing types + new: features, pricing, team)
- `FB.canvas.refreshBlock(id)` — re-render single block's inner HTML, preserve controls
- `FB.canvas.selectBlock(id)` — set selectedId, update visuals, call `FB.panels.renderRightPanel()`
- `FB.canvas.insertBlock(type, afterId)` — create block from definition, insert, render
- `FB.canvas.deleteBlock(id)`
- `FB.canvas.moveBlock(id, dir)`
- `FB.canvas.duplicateBlock(id)`
- `FB.canvas.clearCanvas()`
- `FB.canvas.togglePreview()`
- `FB.canvas.setDevice(type)`
- `FB.canvas.handleDrop(targetId)` — handle library drops and reorder drops

Render HTML for new block types:

**features:**

```
<div class="fw-features-block" style="background:${p.bg};padding:5rem 3rem">
  <div class="fw-features-label" style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#999;margin-bottom:1rem">${p.label}</div>
  <h2 class="fw-features-h2" style="font-family:'Syne',sans-serif;font-size:clamp(2rem,5vw,4rem);font-weight:800;letter-spacing:-2px;color:${p.textColor};line-height:1;margin-bottom:3rem">${p.headline}</h2>
  <div class="fw-features-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:2rem">
    ${p.items.map(i=>`<div class="fw-feature-card" style="padding:2rem;background:${p.bg==='#ffffff'?'#f7f6f2':p.textColor};border-radius:4px">
      <div style="font-size:2rem;margin-bottom:1rem">${i.icon}</div>
      <h3 style="font-family:'Syne',sans-serif;font-size:1.15rem;font-weight:700;color:${p.textColor};margin-bottom:0.6rem">${i.title}</h3>
      <p style="font-size:14px;font-weight:300;line-height:1.6;color:${p.textColor};opacity:0.6">${i.desc}</p>
    </div>`).join('')}
  </div>
</div>
```

**pricing:**

```
<div class="fw-pricing-block" style="background:${p.bg};padding:5rem 3rem">
  <div class="fw-pricing-label" style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#999;margin-bottom:1rem">${p.label}</div>
  <h2 class="fw-pricing-h2" style="font-family:'Syne',sans-serif;font-size:clamp(2rem,5vw,4rem);font-weight:800;letter-spacing:-2px;color:${p.textColor};line-height:1;margin-bottom:3rem">${p.headline}</h2>
  <div class="fw-pricing-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;align-items:start">
    ${p.tiers.map(t=>`<div class="fw-tier-card" style="background:${t.featured?'#111':'#fff'};padding:2.5rem 2rem;border-radius:4px;position:relative;${t.featured?'color:#fff;transform:scale(1.05)':`color:#111;border:1px solid #eee`}">
      ${t.featured?'<div style="position:absolute;top:0;left:0;right:0;background:#CDFE00;color:#111;text-align:center;font-size:10px;letter-spacing:3px;text-transform:uppercase;padding:4px;font-weight:600">Popular</div>':''}
      <h3 style="font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:700;margin-bottom:0.5rem;${t.featured?'color:#fff':'color:#111'}">${t.name}</h3>
      <div style="font-family:'Syne',sans-serif;font-size:3rem;font-weight:800;letter-spacing:-2px;${t.featured?'color:#CDFE00':'color:#111'}">${t.price}</div>
      <div style="font-size:12px;color:${t.featured?'rgba(255,255,255,0.4)':'rgba(0,0,0,0.4)'};margin-bottom:1.5rem">per month</div>
      <ul style="list-style:none;padding:0;margin-bottom:2rem">${t.features.map(f=>`<li style="padding:0.4rem 0;font-size:13px;border-bottom:1px solid ${t.featured?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.06)'}">${f}</li>`).join('')}</ul>
      <button style="width:100%;padding:0.8rem;background:${t.featured?'#CDFE00':'#111'};color:${t.featured?'#111':'#fff'};border:none;border-radius:4px;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;cursor:pointer">${t.cta}</button>
    </div>`).join('')}
  </div>
</div>
```

**team:**

```
<div class="fw-team-block" style="background:${p.bg};padding:5rem 3rem">
  <div class="fw-team-label" style="font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#999;margin-bottom:1rem">${p.label}</div>
  <h2 class="fw-team-h2" style="font-family:'Syne',sans-serif;font-size:clamp(2rem,5vw,4rem);font-weight:800;letter-spacing:-2px;color:${p.textColor};line-height:1;margin-bottom:3rem">${p.headline}</h2>
  <div class="fw-team-grid" style="display:grid;grid-template-columns:repeat(${Math.min(p.members.length,3)},1fr);gap:2rem">
    ${p.members.map(m=>`<div class="fw-team-card" style="padding:2rem;background:${p.bg==='#ffffff'?'#f7f6f2':'#1a1a1f'};border-radius:4px;text-align:center">
      <div style="width:80px;height:80px;border-radius:50%;background:${p.accentColor}22;margin:0 auto 1rem;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:1.8rem;font-weight:700;color:${p.accentColor}">${m.name.charAt(0)}</div>
      <h3 style="font-family:'Syne',sans-serif;font-size:1.15rem;font-weight:700;color:${p.textColor};margin-bottom:0.3rem">${m.name}</h3>
      <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${p.accentColor};margin-bottom:0.8rem">${m.role}</div>
      <p style="font-size:13px;font-weight:300;line-height:1.6;color:${p.textColor};opacity:0.6">${m.bio}</p>
    </div>`).join('')}
  </div>
</div>
```

Add CSS for new blocks to `css/blocks.css`:

```css
.fw-features-block {
  padding: 5rem 3rem;
}
.fw-pricing-block {
  padding: 5rem 3rem;
}
.fw-team-block {
  padding: 5rem 3rem;
}
```

- [ ] **Step 4: Create `js/panels.js`**

Adapt the existing library builder (lines 677-709) and right panel renderer (lines 1049-1245) plus new accordion logic.

Expose:

- `FB.panels.buildLibrary()` — populate block-library and custom-block-library divs
- `FB.panels.renderRightPanel()` — render the right panel for selected block
- `FB.panels.updateUndoRedo()` — update undo/redo button states and counter text
- `FB.panels.toggleLeftPanel()` — collapse/expand left panel
- `FB.panels.toggleRightPanel()` — collapse/expand right panel
- All `updateProp`, `updatePropJSON`, `updateServicesFromText`, `updateStatField`, `updateStepField` functions
- Accordion toggle: `FB.panels.toggleAccordion(headerEl)`

Accordion logic:

```javascript
FB.panels.toggleAccordion = function (headerEl) {
  const body = headerEl.nextElementSibling;
  const isOpen = headerEl.classList.toggle("open");
  body.classList.toggle("collapsed", !isOpen);
};
```

Template modal rendering:

```javascript
FB.panels.openTemplateManager = function () {
  const templates = JSON.parse(localStorage.getItem("fb-templates") || "[]");
  // render modal with saved template cards
  // each card: name, date, load button, delete button
};
```

- [ ] **Step 5: Create `js/export.js`**

Adapt from existing lines 1269-1377, with the CSS inclusion enhancement:

For HTML export, read the CSS rules:

```javascript
FB.export.getBlockCSS = function() {
  // Get distinct block types on the canvas
  const types = new Set(FB.state.blocks.map(b => b.type));
  // Map type to CSS class prefix
  const classMap = {
    nav: 'fw-nav-block', hero: 'fw-hero-block', marquee: 'fw-marquee-block',
    work: 'fw-work-block', services: 'fw-services-block', stats: 'fw-stats-block',
    testimonial: 'fw-testimonial-block', process: 'fw-process-block',
    cta: 'fw-cta-block', footer: 'fw-footer-block',
    textBlock: 'fw-text-block', colorBlock: 'fw-color-block',
    features: 'fw-features-block', pricing: 'fw-pricing-block', team: 'fw-team-block',
  };
  // Load blocks.css content and filter for used block types
  // Include all .fw-* rules that start with any used prefix
  ...
};
```

- [ ] **Step 6: Create `js/app.js`**

```javascript
// ── UTILITY ──
FB.util = {};

FB.util.showToast = function (msg) {
  const t = document.getElementById("toast");
  t.innerHTML = msg + '<div class="toast-progress"></div>';
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2200);
};

// ── INIT ──
FB.init = function () {
  FB.panels.buildLibrary();
  FB.templates.loadStarter();
  FB.canvas.render();

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
      e.preventDefault();
      FB.state.undo();
    }
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === "y" || (e.key === "z" && e.shiftKey))
    ) {
      e.preventDefault();
      FB.state.redo();
    }
    if (e.key === "Escape") {
      FB.state.selectedId = null;
      FB.canvas.render();
      FB.panels.renderRightPanel();
    }
    if (
      e.key === "Delete" &&
      FB.state.selectedId &&
      document.activeElement.tagName !== "INPUT" &&
      !document.activeElement.isContentEditable
    ) {
      FB.canvas.deleteBlock(FB.state.selectedId);
    }
  });

  // Modal overlay close
  document.getElementById("modal-overlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("modal-overlay"))
      FB.export.close();
  });

  // Auto-save timer
  setInterval(() => {
    localStorage.setItem("fb-autosave", JSON.stringify(FB.state.blocks));
  }, 30000);

  // Check for autosave
  const saved = localStorage.getItem("fb-autosave");
  if (saved) {
    const data = JSON.parse(saved);
    if (data && data.length > 0) {
      setTimeout(() => {
        FB.util.showToast(
          '💾 Unsaved work detected. Click "Load Template" to restore.',
        );
      }, 1000);
    }
  }
};

document.addEventListener("DOMContentLoaded", FB.init);
```

---

### Task 3: Rewrite `framework-builder.html` as shell

**Files:**

- Modify: `framework-builder.html` — remove inline `<style>` and `<script>`, replace with external references

- [ ] **Step 1: Replace the HTML body**

Keep the HTML structure IDENTICAL — topbar, left panel, canvas, right panel, modal, toast. Remove the inline `<style>` block (lines 9-352) and inline `<script>` block (lines 434-1422).

Replace with external references:

```html
<head>
  ...
  <link rel="stylesheet" href="css/reset.css" />
  <link rel="stylesheet" href="css/layout.css" />
  <link rel="stylesheet" href="css/components.css" />
  <link rel="stylesheet" href="css/blocks.css" />
  <link rel="stylesheet" href="css/canvas.css" />
</head>
<body>
  <!-- existing HTML structure unchanged -->
  ...
  <script src="js/state.js"></script>
  <script src="js/blocks.js"></script>
  <script src="js/canvas.js"></script>
  <script src="js/panels.js"></script>
  <script src="js/export.js"></script>
  <script src="js/app.js"></script>
</body>
```

- [ ] **Step 2: Add panel toggle buttons to topbar**

Add buttons between device selector and undo:

```html
<div class="tb-sep"></div>
<button
  class="tb-btn"
  onclick="FB.panels.toggleLeftPanel()"
  title="Toggle sidebar"
>
  ☰
</button>
<button
  class="tb-btn"
  onclick="FB.panels.toggleRightPanel()"
  title="Toggle inspector"
>
  ✎
</button>
```

- [ ] **Step 3: Add template buttons**

```html
<button class="tb-btn" onclick="FB.templates.save()">💾 Save Template</button>
<button class="tb-btn" onclick="FB.panels.openTemplateManager()">
  📂 Load Template
</button>
```

- [ ] **Step 4: Verify the page loads without errors**

Open `framework-builder.html` in a browser. Open DevTools console. Confirm no 404s on CSS/JS files and no JS errors. Canvas should render the starter template.

---

### Task 4: Add collapsible sidebar system

**Files:**

- Modify: `js/panels.js` — add toggle functions + localStorage persistence
- Modify: `css/layout.css` — already has .collapsed classes and transitions

- [ ] **Step 1: Add `FB.panels.toggleLeftPanel()`**

```javascript
FB.panels.toggleLeftPanel = function () {
  const panel = document.getElementById("left-panel");
  panel.classList.toggle("collapsed");
  localStorage.setItem(
    "fb-left-collapsed",
    panel.classList.contains("collapsed"),
  );
};

FB.panels.toggleRightPanel = function () {
  const panel = document.getElementById("right-panel");
  panel.classList.toggle("collapsed");
  localStorage.setItem(
    "fb-right-collapsed",
    panel.classList.contains("collapsed"),
  );
};
```

- [ ] **Step 2: Restore panel states on init**

In `FB.init()`:

```javascript
// Restore panel states
if (localStorage.getItem("fb-left-collapsed") === "true")
  document.getElementById("left-panel").classList.add("collapsed");
if (localStorage.getItem("fb-right-collapsed") === "true")
  document.getElementById("right-panel").classList.add("collapsed");
```

- [ ] **Step 3: Hide panel content when collapsed**

Add CSS:

```css
#left-panel .panel-content {
  opacity: 1;
  transition: opacity 200ms;
}
#left-panel.collapsed .panel-content {
  opacity: 0;
  pointer-events: none;
}
#right-panel .panel-content {
  opacity: 1;
  transition: opacity 200ms;
}
#right-panel.collapsed .panel-content {
  opacity: 0;
  pointer-events: none;
}
```

Verify: reload page, click toggle buttons, panels slide open/closed with animation. Refresh page — state persists.

---

### Task 5: Visual design refresh

**Files:**

- Modify: `css/reset.css` — already done in Task 1
- Modify: `css/components.css` — already done in Task 1 (SVG icons, animations)
- Ensure all existing CSS references updated from old tokens to new

- [ ] **Step 1: Search for old CSS variable references**

In all CSS files, ensure no remaining `--ui-bg`, `--ui-panel`, `--ui-border`, `--ui-text`, `--ui-muted`, `--ui-hover`, `--ui-accent` references. Replace them all with new tokens per the color system table.

Old → New mapping:

- `--ui-bg` → `--surface-1`
- `--ui-panel` → `--surface-2`
- `--ui-border` → `--border`
- `--ui-text` → `--text-secondary`
- `--ui-muted` → `--text-muted`
- `--ui-hover` → `--surface-3`
- `--ui-accent` → `--accent`

- [ ] **Step 2: Replace emoji icons with inline SVGs in HTML**

Replace emoji in topbar device buttons and preview button with inline SVGs:

```html
<div class="device-btns">
  <button
    class="dev-btn active"
    onclick="FB.canvas.setDevice('desktop')"
    title="Desktop"
  >
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  </button>
  <button
    class="dev-btn"
    onclick="FB.canvas.setDevice('tablet')"
    title="Tablet"
  >
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
  </button>
  <button
    class="dev-btn"
    onclick="FB.canvas.setDevice('mobile')"
    title="Mobile"
  >
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
  </button>
</div>
```

- [ ] **Step 3: Verify visual refresh**

Open page, confirm:

- Top bar is 44px (was 48px)
- Buttons have 6px border radius (was 4px)
- Selected block has box-shadow glow
- Toast appears top-right with progress bar
- Modal has backdrop blur
- Hover on block items shows translateX(4px) motion

---

### Task 6: Accordion right panel

**Files:**

- Modify: `js/panels.js` — reorganize right panel render into accordion sections
- Modify: `css/components.css` — already has accordion CSS

- [ ] **Step 1: Update `FB.panels.renderRightPanel()`**

Wrap each section (Content, Style, Spacing, Advanced, Actions) in accordion markup:

```javascript
function renderSection(title, content, isOpen) {
  return `
    <div class="rp-section">
      <div class="accordion-header ${isOpen ? "open" : ""}" onclick="FB.panels.toggleAccordion(this)">
        <span class="acc-label">${title}</span>
        <span class="acc-arrow">▶</span>
      </div>
      <div class="accordion-body ${isOpen ? "" : "collapsed"}">${content}</div>
    </div>`;
}
```

- [ ] **Step 2: Restore open accordion sections per block type**

Store in memory: `FB.panels.accordionState = {};` keyed by block type. Each value is an object like `{content: true, style: true, spacing: false, advanced: false}`.

- [ ] **Step 3: Verify accordion behavior**

Select a block → right panel shows accordion sections. Click section headers to collapse/expand. Select different block type → accordion state persists per type.

---

### Task 7: Template save/load system

**Files:**

- Create: `js/templates.js` (new module)
- Modify: `framework-builder.html` — add `<script src="js/templates.js"></script>`

- [ ] **Step 1: Create `js/templates.js`**

```javascript
FB.templates = {};

FB.templates.save = function () {
  const name = prompt("Template name:", "My Template");
  if (!name) return;
  const templates = JSON.parse(localStorage.getItem("fb-templates") || "[]");
  templates.push({
    id: Date.now(),
    name: name,
    version: 1,
    created: new Date().toISOString(),
    blocks: JSON.parse(JSON.stringify(FB.state.blocks)),
    count: FB.state.blocks.length,
  });
  localStorage.setItem("fb-templates", JSON.stringify(templates));
  FB.util.showToast("✅ Template saved: " + name);
};

FB.templates.load = function (id) {
  const templates = JSON.parse(localStorage.getItem("fb-templates") || "[]");
  const tpl = templates.find((t) => t.id === id);
  if (!tpl) return;
  if (FB.state.blocks.length > 0) {
    if (!confirm("Load this template? Current canvas will be replaced."))
      return;
  }
  FB.state.saveHistory();
  FB.state.blocks = JSON.parse(JSON.stringify(tpl.blocks));
  FB.state.selectedId = null;
  FB.canvas.render();
  FB.panels.renderRightPanel();
  FB.util.showToast("📂 Loaded: " + tpl.name);
};

FB.templates.delete = function (id) {
  let templates = JSON.parse(localStorage.getItem("fb-templates") || "[]");
  templates = templates.filter((t) => t.id !== id);
  localStorage.setItem("fb-templates", JSON.stringify(templates));
  FB.panels.openTemplateManager();
};

FB.templates.exportJSON = function () {
  const data = {
    name: "Exported Template",
    version: 1,
    created: new Date().toISOString(),
    blocks: JSON.parse(JSON.stringify(FB.state.blocks)),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "template.fwb.json";
  a.click();
};

FB.templates.importJSON = function (file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data && data.blocks) {
        FB.state.saveHistory();
        FB.state.blocks = data.blocks;
        FB.state.selectedId = null;
        FB.canvas.render();
        FB.panels.renderRightPanel();
        FB.util.showToast("📂 Template imported");
      }
    } catch (err) {
      FB.util.showToast("❌ Invalid template file");
    }
  };
  reader.readAsText(file);
};

FB.templates.loadStarter = function () {
  const types = [
    "nav",
    "hero",
    "marquee",
    "work",
    "services",
    "stats",
    "testimonial",
    "process",
    "cta",
    "footer",
  ];
  const allDefs = { ...FB.blocks.BLOCK_DEFS, ...FB.blocks.CUSTOM_BLOCK_DEFS };
  FB.state.blocks = types.map((type) => ({
    id: FB.state.genId(),
    type,
    props: JSON.parse(JSON.stringify(allDefs[type].defaultProps)),
  }));
};
```

- [ ] **Step 2: Update `FB.panels.openTemplateManager()`**

Render a modal showing saved templates as cards:

```javascript
FB.panels.openTemplateManager = function () {
  const templates = JSON.parse(localStorage.getItem("fb-templates") || "[]");
  let html = `<div style="padding:20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">`;
  if (templates.length === 0) {
    html += `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-muted)">No saved templates yet. Build a page and click "Save Template".</div>`;
  }
  templates.forEach((t) => {
    html += `
      <div style="background:var(--surface-1);border:1px solid var(--border);border-radius:6px;padding:16px;cursor:pointer" onclick="FB.templates.load(${t.id})">
        <div style="font-weight:500;color:var(--text-primary);margin-bottom:4px">${t.name}</div>
        <div style="font-size:11px;color:var(--text-muted)">${t.count} blocks · ${new Date(t.created).toLocaleDateString()}</div>
        <button class="tb-btn danger" style="margin-top:8px;width:100%" onclick="event.stopPropagation();FB.templates.delete(${t.id})">Delete</button>
      </div>`;
  });
  html += `</div>`;
  html += `
    <div style="padding:12px 20px;border-top:1px solid var(--border);display:flex;gap:8px">
      <button class="tb-btn" onclick="document.getElementById('import-input').click()">📥 Import</button>
      <input type="file" id="import-input" accept=".fwb.json,.json" style="display:none" onchange="FB.templates.importJSON(this.files[0])">
      <button class="tb-btn" onclick="FB.templates.exportJSON()">📤 Export Canvas</button>
    </div>`;

  document.getElementById("modal-title").textContent = "📂 Template Manager";
  document.getElementById("modal-tabs").style.display = "none";
  document.getElementById("code-output").parentElement.innerHTML = html;
  document.getElementById("modal-overlay").classList.add("open");
};
```

---

### Task 8: Create starter template JSON files

**Files:**

- Create: `templates/agency.json`
- Create: `templates/saas.json`
- Create: `templates/portfolio.json`

- [ ] **Step 1: Create `templates/agency.json`**

Serialize the current starter template (nav, hero, marquee, work, services, stats, testimonial, process, cta, footer) as JSON array in the format:

```json
{
  "name": "Agency Homepage",
  "version": 1,
  "created": "2026-05-20T00:00:00Z",
  "blocks": [
    { "id": "b_0000000", "type": "nav", "props": { ... } },
    ...
  ]
}
```

Extract actual defaultProps from `FB.blocks.BLOCK_DEFS` for each block type.

- [ ] **Step 2: Create `templates/saas.json`**

Layout: nav, hero (with mockup mention), features (new), pricing (new), cta, footer.

- [ ] **Step 3: Create `templates/portfolio.json`**

Layout: nav, hero (minimal), work (featured projects), team (new), cta, footer.

---

### Task 9: Auto-save system

**Files:**

- Modify: `js/app.js` — already added auto-save timer in Task 2 Step 6
- Modify: `js/state.js` — add restore prompt

- [ ] **Step 1: Add `FB.templates.restoreAutosave()`**

```javascript
FB.templates.restoreAutosave = function () {
  const saved = localStorage.getItem("fb-autosave");
  if (!saved) return;
  try {
    const data = JSON.parse(saved);
    if (data && data.length > 0 && data.length >= FB.state.blocks.length) {
      FB.state.saveHistory();
      FB.state.blocks = data;
      FB.canvas.render();
      FB.util.showToast("💾 Autosave restored");
    }
  } catch (e) {}
  localStorage.removeItem("fb-autosave");
};
```

Clear autosave when user saves or exports:

```javascript
// In FB.templates.save():
localStorage.removeItem("fb-autosave");

// In FB.export.generateHTML():
localStorage.removeItem("fb-autosave");
```

---

### Task 10: Enhanced undo/redo

**Files:**

- Modify: `js/panels.js` — add `FB.panels.updateUndoRedo()`
- Modify: `js/canvas.js` — add debounced saveHistory for slider drags
- Modify: `js/state.js` — history limit already 100 (was 50)

- [ ] **Step 1: Implement `FB.panels.updateUndoRedo()`**

```javascript
FB.panels.updateUndoRedo = function () {
  const undoBtn = document.querySelector('.tb-btn[onclick*="undo"]');
  const redoBtn = document.querySelector('.tb-btn[onclick*="redo"]');
  if (undoBtn) {
    undoBtn.textContent = `↩ Undo (${FB.state.history.length})`;
    undoBtn.disabled = FB.state.history.length === 0;
  }
  if (redoBtn) {
    redoBtn.textContent = `↪ Redo (${FB.state.future.length})`;
    redoBtn.disabled = FB.state.future.length === 0;
  }
};
```

Call `FB.panels.updateUndoRedo()` at the end of `saveHistory()`, `undo()`, and `redo()`.

- [ ] **Step 2: Debounce slider history**

In right panel, for range inputs, only save history on `change` (mouseup) not on `input` (drag). Use `oninput` for visual feedback, `onchange` for history:

```html
<input
  type="range"
  ...
  oninput="updateSliderVisual(this)"
  onchange="finalizeSliderChange(blockId, key, +this.value)"
/>
```

```javascript
let _sliderTimer = null;
function finalizeSliderChange(id, key, val) {
  FB.state.blocks.find((b) => b.id === id).props[key] = val;
  FB.canvas.refreshBlock(id);
  clearTimeout(_sliderTimer);
  _sliderTimer = setTimeout(() => FB.state.saveHistory(), 200);
}
```

---

### Task 11: Block locking, rename, and copy/paste

**Files:**

- Modify: `js/canvas.js` — add lock, rename, copy/paste support
- Modify: `css/canvas.css` — already has `.locked` class

- [ ] **Step 1: Add block locking**

Add lock button to block controls:

```html
<button
  class="bc-btn ${block._locked?'locked-btn':''}"
  onclick="FB.canvas.toggleLock('${block.id}')"
  title="${block._locked?'Unlock':'Lock'}"
>
  🔒
</button>
```

```javascript
FB.canvas.toggleLock = function (id) {
  const block = FB.state.blocks.find((b) => b.id === id);
  if (!block) return;
  block._locked = !block._locked;
  FB.canvas.render();
};
```

In `FB.canvas.render()`, skip selection for locked blocks:

```javascript
wrapper.addEventListener('click', e => {
  if (block._locked) return;
  ...
});
```

- [ ] **Step 2: Add block rename (right-click)**

```javascript
FB.canvas.renameBlock = function (id) {
  const block = FB.state.blocks.find((b) => b.id === id);
  if (!block) return;
  const name = prompt(
    "Block name:",
    block._name || FB.blocks.BLOCK_DEFS[block.type]?.label || block.type,
  );
  if (name) {
    block._name = name.trim();
    FB.canvas.render();
  }
};

// Add right-click handler in render()
wrapper.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  FB.canvas.renameBlock(block.id);
});
```

Show rename in drag handle:

```javascript
// In render(), after creating drag-handle:
if (block._name) {
  const label = document.createElement("div");
  label.className = "block-label-overlay";
  label.textContent = block._name;
  wrapper.appendChild(label);
}
```

- [ ] **Step 3: Add block copy/paste**

```javascript
document.addEventListener("keydown", (e) => {
  // Ctrl+C
  if ((e.ctrlKey || e.metaKey) && e.key === "c" && FB.state.selectedId) {
    const block = FB.state.blocks.find((b) => b.id === FB.state.selectedId);
    if (block) {
      navigator.clipboard.writeText(
        JSON.stringify({ type: block.type, props: block.props }),
      );
      FB.util.showToast("📋 Block copied");
    }
  }
  // Ctrl+V
  if ((e.ctrlKey || e.metaKey) && e.key === "v") {
    // parse clipboard and insert
    navigator.clipboard.readText().then((text) => {
      try {
        const data = JSON.parse(text);
        if (data.type && data.props) {
          FB.canvas.insertBlock(data.type, FB.state.selectedId);
          FB.util.showToast("📋 Block pasted");
        }
      } catch (e) {}
    });
  }
});
```

---

### Task 12: Export improvements

**Files:**

- Modify: `js/export.js` — add CSS rule inclusion in HTML export, preview pane

- [ ] **Step 1: Add block CSS extraction to HTML export**

```javascript
FB.export.getBlockCSS = function () {
  const usedTypes = new Set(FB.state.blocks.map((b) => b.type));
  const allCSS = document.getElementById("blocks-css")?.textContent || "";

  // Extract only @keyframes rules (always include marqueeRoll)
  let result =
    "@keyframes marqueeRoll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}\n";

  // For each used type, include its CSS rules
  const typePrefixes = {
    nav: "fw-nav-",
    hero: "fw-hero-",
    marquee: "fw-marquee-",
    work: "fw-work-",
    services: "fw-services-",
    stats: "fw-stats-",
    testimonial: "fw-testimonial-",
    process: "fw-process-",
    cta: "fw-cta-",
    footer: "fw-footer-",
    textBlock: "fw-text-",
    colorBlock: "fw-color-",
    features: "fw-features-",
    pricing: "fw-pricing-",
    team: "fw-team-",
  };

  const usedPrefixes = new Set();
  usedTypes.forEach((t) => {
    if (typePrefixes[t]) usedPrefixes.add(typePrefixes[t]);
  });

  // Parse the stylesheet for matching rules
  for (const sheet of document.styleSheets) {
    if (!sheet.href || !sheet.href.includes("blocks.css")) continue;
    try {
      for (const rule of sheet.cssRules) {
        if (
          rule.selectorText &&
          [...usedPrefixes].some(
            (p) =>
              rule.selectorText.startsWith("." + p) ||
              rule.selectorText.includes(p),
          )
        ) {
          result += rule.cssText + "\n";
        }
        // Always include @keyframes
        if (
          rule.type === CSSRule.KEYFRAMES_RULE &&
          rule.name === "marqueeRoll"
        ) {
          // already included above
        }
      }
    } catch (e) {}
  }

  return result;
};
```

- [ ] **Step 2: Verify export output**

Build a page with 3-4 blocks, click "Export HTML", confirm:

- Output is valid HTML
- Includes the correct subset of CSS for used blocks (not ALL blocks)
- Preview renders correctly
- Copy and Download buttons work

---

### Task 13: End-to-end verification

**Files:**

- No files — manual testing only

- [ ] **Step 1: Manual test flow**

1. Open `framework-builder.html` in browser
2. Confirm starter template loads (10 blocks, full page)
3. Collapse left panel → only icon rail visible
4. Collapse right panel → only icon tabs visible
5. Select a block → right panel shows accordion sections
6. Toggle accordion sections open/closed
7. Change background color → block updates on canvas
8. Add a Features Grid block from the library
9. Drag a block to reorder
10. Save template → reload page → load template
11. Ctrl+Z undo, Ctrl+Y redo
12. Click Export HTML → verify output
13. Switch device preview (desktop/tablet/mobile)

---

## Spec Coverage Checklist

| Spec Section                                 | Task Coverage                                        |
| -------------------------------------------- | ---------------------------------------------------- |
| 1. Project Architecture                      | Tasks 1-3 (file split)                               |
| 2. Collapsible Sidebars                      | Task 4                                               |
| 3. Visual Design Refresh                     | Tasks 1, 5                                           |
| 4. Accordion Editing Controls                | Task 6                                               |
| 5. Template System                           | Tasks 7-8                                            |
| 6. Block Expansion (features, pricing, team) | Task 2 Step 2 (definitions) + Task 2 Step 3 (render) |
| 7. Block Locking, Rename, Copy/Paste         | Task 11                                              |
| 8. Undo/Redo Enhancements                    | Task 10                                              |
| 9. Auto-Save                                 | Task 9                                               |
| 10. Export Improvements                      | Task 12                                              |
