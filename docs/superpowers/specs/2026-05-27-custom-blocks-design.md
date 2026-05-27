# Custom Blocks — Design Spec

**Date:** 2026-05-27
**Status:** Draft

## Overview

Five new blocks inspired by the WordPress block plugin directory, adapted for the Framework Builder's architecture and agency/portfolio audience. Each block follows the `FB.widgets.register()` pattern — separate file in `widgets/`, own `render()` and `editPanel()`, CSS in the existing stylesheet.

| #   | Block        | File                      | Category    | Complexity  |
| --- | ------------ | ------------------------- | ----------- | ----------- |
| 1   | Data Table   | `widgets/data-table.js`   | content     | Medium-high |
| 2   | Tabs         | `widgets/tabs.js`         | content     | Low-medium  |
| 3   | Modal/Popup  | `widgets/modal.js`        | interactive | Medium      |
| 4   | Image Viewer | `widgets/image-viewer.js` | media       | Medium      |
| 5   | Icon Box     | `widgets/icon-box.js`     | content     | Low         |

---

## 1. Data Table

### 1a. Purpose

Tabular data display with column sorting, CSV paste, responsive horizontal scroll. Agencies use these for pricing comparisons, spec sheets, team rosters, data-driven content — currently a genuine gap in the block library.

### 1b. Props

```js
{
  // Raw CSV text — users paste from spreadsheet or type directly
  csvData: "Name,Role,Location\nAlice,Designer,London\nBob,Developer,Berlin",
  // Column config — auto-detected from header row
  columns: [
    { key: "Name",  align: "left",  width: "auto" },
    { key: "Role",  align: "left",  width: "auto" },
    { key: "Location", align: "left", width: "auto" }
  ],
  // Display options
  headerBg: "#111111",
  headerTextColor: "#f7f6f2",
  rowEvenBg: "rgba(255,255,255,0.03)",
  rowOddBg: "transparent",
  borderColor: "rgba(255,255,255,0.1)",
  // Behaviour
  sortable: true,
  striped: true,
  // Visual
  bg: "#111111",
  textColor: "#f7f6f2",
  accentColor: "#CDFE00",
  paddingV: 64,
  paddingH: 48
}
```

### 1c. Behaviour

- **CSV import:** Textarea in edit panel — paste CSV, auto-parse header row as column names
- **Sorting:** Click column header → toggle asc/desc. Visual indicator (▲/▼ arrow)
- **Striped rows:** Alternating row background for readability
- **Responsive:** Overflow-x:auto on small screens; no horizontal squash
- **Empty state:** "Paste CSV data in the edit panel to build your table" placeholder
- **Row count:** Display "Showing X rows" in header row metadata

### 1d. UI States

| State   | Behaviour                                                    |
| ------- | ------------------------------------------------------------ |
| Loading | N/A — no async                                               |
| Empty   | Grey placeholder box: "Paste spreadsheet data in the editor" |
| Error   | Malformed CSV → red error message in edit panel              |
| Data    | Fully rendered table with sort, striping, responsive scroll  |

### 1e. Design Notes

- Pure CSS styling — no JS table library dependency
- CSV parsing via simple split/parse (no Papa Parse dependency needed for typical agency data)
- Sort state is local to the rendered DOM, not persisted in block props (sort resets on re-render)

---

## 2. Tabs

### 2a. Purpose

Tabbed content panels for organizing information vertically — feature lists, pricing tiers, team categories, product details. General-purpose version of the existing `ecomProductTabs` which is ecommerce-specific.

### 2b. Props

```js
{
  tabs: [
    { label: "Design", content: "<p>Content for design tab...</p>" },
    { label: "Development", content: "<p>Content for dev tab...</p>" },
    { label: "Strategy", content: "<p>Content for strategy tab...</p>" }
  ],
  activeTab: 0,
  tabPosition: "top",        // "top" | "left"
  tabStyle: "underline",     // "underline" | "pills" | "bordered"
  bg: "#111111",
  textColor: "#f7f6f2",
  accentColor: "#CDFE00",
  paddingV: 64,
  paddingH: 48
}
```

### 2c. Behaviour

- Tab labels are editable in the edit panel (add/remove/reorder)
- Tab content is rich HTML (user writes in a textarea, gets rendered)
- Click tab → switch visible content panel. Active tab gets accent color underline/pill
- `tabPosition: "left"` → vertical tab bar on left side (for 4+ tabs)
- Accessible: ARIA role="tablist", role="tab", role="tabpanel", keyboard navigation (arrow keys)

### 2d. UI States

| State   | Behaviour                                 |
| ------- | ----------------------------------------- |
| Loading | N/A                                       |
| Empty   | "Add tabs in the edit panel" placeholder  |
| 1 tab   | No tab bar shown — just the content panel |
| 2+ tabs | Full tab bar with interactive switching   |

### 2e. Design Notes

- Chevron/arrow indicators for active tab state
- Smooth transition (opacity or slide) when switching tabs
- Left-position tabs get a subtle vertical divider line
- Tab overflow: if too many tabs, horizontal scroll (no wrapping)

---

## 3. Modal / Popup

### 3a. Purpose

Overlay modal triggered by a button or page-load delay. Use cases: portfolio project reveals, "book a call" CTAs, newsletter signup, promo announcements, cookie consent alternative.

### 3b. Props

```js
{
  triggerType: "button",       // "button" | "timed" | "scroll"
  triggerText: "View Project", // button label (if triggerType=button)
  triggerDelay: 0,             // seconds (if triggerType=timed|scroll)
  headline: "Want to work together?",
  body: "<p>We build bold brands for ambitious companies.</p>",
  btnText: "Get in touch →",
  btnUrl: "#contact",
  showCloseBtn: true,
  closeOnOverlay: true,
  overlayBg: "rgba(0,0,0,0.7)",
  modalWidth: 480,
  modalBg: "#111111",
  textColor: "#f7f6f2",
  accentColor: "#CDFE00",
  paddingV: 48,
  paddingH: 48
}
```

### 3c. Behaviour

- **Trigger modes:**
  - `button` → renders a CTA button that opens the modal on click
  - `timed` → auto-opens after N seconds (configurable delay)
  - `scroll` → auto-opens when user scrolls past the block
- Overlay click and/or X button closes the modal
- Open/close with CSS transition (fade + scale)
- Body scroll is locked while modal is open (`overflow:hidden` on body)
- Only one modal instance per page (no stacking)
- Focus trap while open (Tab cycles within modal)

### 3d. UI States

| State     | Behaviour                                                 |
| --------- | --------------------------------------------------------- |
| Closed    | Shows trigger button (or nothing if timed/scroll trigger) |
| Open      | Overlay + centered modal card with content + close button |
| Animation | Fade-in overlay, slight scale-up modal card (0.95 → 1)    |

### 3e. Design Notes

- Trigger button inherits accent colour styling (consistent with other CTA buttons)
- Modal is responsive: max-width on desktop, full-width on mobile with 16px padding
- Close button: simple ✕ in top-right corner, subtle hover effect
- Built-in overlay prevents interaction with page content underneath

---

## 4. Image Viewer (Zoom/Pan)

### 4a. Purpose

High-res image display with zoom, pan, and optional comparison mode. Designed for portfolio/agency sites showcasing detailed work — photography, UI mockups, architectural renders, product closeups.

### 4b. Props

```js
{
  imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200",
  imageAlt: "Design showcase",
  mode: "zoom",               // "zoom" | "pan" | "compare"
  // Zoom mode
  zoomMin: 1,
  zoomMax: 5,
  zoomStep: 0.5,
  // Compare mode
  compareImage: "",
  compareLabel: "After",
  // Visual
  bg: "#111111",
  textColor: "#f7f6f2",
  accentColor: "#CDFE00",
  paddingV: 64,
  paddingH: 48
}
```

### 4c. Behaviour

- **Zoom mode:** Click to zoom in (centered on click point). Mouse wheel zooms. Ctrl+0 resets. Shows zoom level indicator
- **Pan mode:** Click and drag to pan around the image (useful for large images in a constrained viewport)
- **Compare mode:** Slider overlay. Drag the divider left/right to reveal "before" (original image) vs "after" (compareImage)
- Touch support: pinch-to-zoom on mobile, swipe to pan
- Scroll wheel zooms in zoom mode; scroll direction pans in pan mode

### 4d. UI States

| State     | Behaviour                                               |
| --------- | ------------------------------------------------------- |
| No image  | "Select an image in the edit panel" placeholder         |
| Image set | Renders image with current viewer mode                  |
| Compare   | Two images side-by-side with draggable vertical divider |
| Zoomed in | Image scales up, cursor changes to grab/grabbing        |

### 4e. Design Notes

- Mode selector in edit panel (zoom / pan / compare) — each mode is distinct UI
- Zoom level badge shown briefly in corner when zooming
- Pan uses CSS `transform: translate()` for performance
- Compare uses a clip-path or overflow-hidden technique for the slider divider
- No external dependencies — all zoom/pan/compare logic is vanilla JS within the widget render handler

---

## 5. Icon Box

### 5a. Purpose

Icon + heading + description + optional link — the most commonly requested "simple" block. Used for feature lists, service offerings, value propositions. One-click alternative to assembling from Text + SVG parts.

### 5b. Props

```js
{
  icon: "⚡",
  iconSize: 48,
  iconColor: "#CDFE00",
  headline: "Lightning Fast",
  body: "We build performance-optimised sites that load in under a second.",
  linkUrl: "",
  linkText: "Learn more →",
  align: "center",             // "left" | "center"
  bg: "transparent",
  textColor: "#f7f6f2",
  accentColor: "#CDFE00",
  paddingV: 32,
  paddingH: 24
}
```

### 5c. Behaviour

- Icon picker: text emoji input (user types any emoji or text character)
- Hover effect: subtle icon scale (1 → 1.1) and color shift on parent hover
- If `linkUrl` is set, the whole box becomes clickable
- `align: "left"` → icon sits to the left of text; `"center"` → everything stacked and centered
- Three columns can be assembled by wrapping in a Columns block

### 5d. UI States

| State    | Behaviour                                       |
| -------- | ----------------------------------------------- |
| Default  | Icon + text displayed with configured alignment |
| Hover    | Icon scales up 1.1x, slight brightness increase |
| Link set | Cursor becomes pointer, entire box is clickable |

### 5e. Design Notes

- Emoji-as-icon keeps it simple (no SVG icon library dependency)
- Alignment affects flex-direction: row (left) vs column (center)
- Bottom spacing consistent with existing block padding system
- Dark/transparent background works in all themes

---

## Implementation Notes

### File Structure

```
widgets/
  data-table.js      — FB.widgets.register("dataTable", { render, editPanel, category })
  tabs.js            — FB.widgets.register("tabs", { ... })
  modal.js           — FB.widgets.register("modal", { ... })
  image-viewer.js    — FB.widgets.register("imageViewer", { ... })
  icon-box.js        — FB.widgets.register("iconBox", { ... })
```

Each file follows this template:

```js
FB.widgets.register("blockType", {
  category: "content", // or "media" | "interactive"
  render: function (p) {
    // Return HTML string using p.* props
    return `<div>...</div>`;
  },
  editPanel: function (id, p) {
    // Return HTML string for the right panel editor UI
    return `<div>...</div>`;
  },
});
```

### Registration

New imports in `src/main.js`:

```js
import "../widgets/data-table.js";
import "../widgets/tabs.js";
import "../widgets/modal.js";
import "../widgets/image-viewer.js";
import "../widgets/icon-box.js";
```

### CSS

Add to `css/widgets.css` (or a new `css/custom-blocks.css` imported in `main.js`). Follow existing widget CSS naming conventions:

- `.fw-data-table`
- `.fw-tabs`
- `.fw-modal`
- `.fw-image-viewer`
- `.fw-icon-box`

### Block Palette Visibility

Each block will appear in the block library sidebar under its respective category tab (`content`, `media`, or `interactive`), auto-discovered via `FB.widgets.byCategory()`.

---

## Open Questions

None at this stage — all design decisions are captured above.
