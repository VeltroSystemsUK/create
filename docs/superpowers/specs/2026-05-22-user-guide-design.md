# User Guide / Help System — Design Spec

**Date:** 2026-05-22
**Project:** Framework Builder

---

## Overview

Add a fully interactive User Guide to Framework Builder consisting of two complementary modes:

1. **Guided Tour** — an 8-step interactive walkthrough powered by driver.js that highlights real UI elements with a spotlight overlay and dark-themed popovers.
2. **Help Centre** — a full-screen modal with a sidebar topic list and rich article content, accessible at any time via a `?` button in the toolbar.

A first-visit prompt appears 1.5 seconds after the app loads for users who have never seen the guide.

---

## Entry Point

A `?` button is added to the centre toolbar cluster, immediately after the ⚙ Settings button. It uses the existing `tb-btn` class and calls `FB.help.open()` on click.

---

## New Files

| File           | Purpose                                                |
| -------------- | ------------------------------------------------------ |
| `js/help.js`   | `FB.help` module — all logic                           |
| `css/help.css` | Help Centre modal styles + driver.js popover overrides |

### Changes to `framework-builder.html`

Four additions in `<head>` / before `</body>`:

- `<link>` for driver.js CSS (CDN)
- `<link rel="stylesheet" href="css/help.css">`
- `<script>` for driver.js IIFE bundle (CDN)
- `<script src="js/help.js">`

One addition in the toolbar centre cluster: the `?` button.

One addition in `FB.init`: call `FB.help._checkFirstVisit()`.

---

## Help Centre Modal

### Layout

- Full-screen overlay (dark semi-transparent backdrop, `z-index` above everything)
- Two-column layout:
  - **Left sidebar** (200px): heading "HELP CENTRE", topic list, "Take the Tour" button pinned to bottom
  - **Right content area** (flex: 1): article content, close (✕) button top-right
- Closes on ✕ click, ESC key, or clicking the backdrop

### Topic List (sidebar)

9 topics, each with a monochrome SVG line icon and label. Active topic: `#CDFE00` icon + white text + left border accent. Inactive: `#555` icon + `#555` text.

| ID           | Label                 | Category        |
| ------------ | --------------------- | --------------- |
| `overview`   | Interface Overview    | Getting Started |
| `sections`   | Working with Sections | Building        |
| `styling`    | Styling               | Building        |
| `templates`  | Templates & Saving    | Building        |
| `pages`      | Pages                 | Building        |
| `import`     | Import                | Advanced        |
| `export`     | Export                | Advanced        |
| `animations` | Animations & Effects  | Advanced        |
| `shortcuts`  | Keyboard Shortcuts    | Reference       |

### Article Content

Each article renders:

- **Category label** (small caps, `#CDFE00`)
- **Title** (large, white)
- **Intro paragraph** (muted)
- **Key areas / steps** — card list with monochrome SVG icon, bold label, description. Active card has `#CDFE00` left border.
- **Tip block** (dark green tint background, `#CDFE00` info icon) — optional per topic

### Topic Data Structure

```js
FB.help.TOPICS = [
  {
    id: "overview",
    label: "Interface Overview",
    icon: "<path .../>", // SVG path data only
    category: "Getting Started",
    content: {
      title: "Interface Overview",
      intro: "...",
      items: [
        { icon: "<path .../>", label: "Top Bar", desc: "..." },
        // ...
      ],
      tip: "...", // optional
    },
  },
  // ... 8 more
];
```

Icons are SVG `<path>` strings rendered into a `<svg viewBox="0 0 24 24">` wrapper — the same Feather-style stroke icons used throughout the app. All icons render in a single colour (`#555` inactive, `#CDFE00` active/accent).

### `FB.help` API

| Function           | Signature                    | Description                                                                                                     |
| ------------------ | ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `open`             | `FB.help.open(topicId?)`     | Opens modal. If `topicId` given, activates that topic. Defaults to `'overview'`.                                |
| `close`            | `FB.help.close()`            | Closes modal, removes backdrop.                                                                                 |
| `_render`          | `FB.help._render(topicId)`   | Builds and injects article DOM for the given topic.                                                             |
| `startTour`        | `FB.help.startTour()`        | Closes modal if open. Initialises and starts driver.js tour.                                                    |
| `_checkFirstVisit` | `FB.help._checkFirstVisit()` | Called from `FB.init`. If `localStorage['fb-help-seen']` is unset, shows "Take a quick tour?" toast after 1.5s. |

---

## Guided Tour

### Dependency

driver.js loaded via CDN (jsDelivr). Version pinned at `1.3.1`.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/driver.js@1.3.1/dist/driver.css"
/>
<script src="https://cdn.jsdelivr.net/npm/driver.js@1.3.1/dist/driver.js.iife.js"></script>
```

### 8 Tour Steps

| Step | Target selector       | Title            | Summary                                               |
| ---- | --------------------- | ---------------- | ----------------------------------------------------- |
| 1    | `body` (no highlight) | Welcome          | What Framework Builder is and how the tour works      |
| 2    | `#topbar`             | The Toolbar      | Device preview, undo/redo, save, load, import, export |
| 3    | `#left-panel`         | Left Panel       | Section library, templates, layers, widgets           |
| 4    | `#block-library`      | Sections Library | Click to add a section; accordion categories          |
| 5    | `#canvas-wrap`        | The Canvas       | Click to select, drag to reorder blocks               |
| 6    | `#right-panel`        | Block Inspector  | Content, Style, Typography, Spacing, Animation        |
| 7    | `[title="AI Import"]` | AI Import        | Describe a page or paste a URL; AI builds it          |
| 8    | `.tb-export`          | Export           | HTML, React, TSX output                               |

### Popover Styling

driver.js popovers are overridden via `css/help.css` to match the app:

- Background: `#161616`
- Border: `1px solid #2a2a2a`
- Border-radius: `8px`
- Title colour: `#fff`, weight 700
- Description colour: `#777`
- Step label: `#CDFE00`, small caps
- Progress dots: `#222` inactive, `#CDFE00` active
- Next button: `#CDFE00` background, `#111` text
- Back / Skip: `#555` text, transparent background

### First-Visit Prompt

On `FB.init`, `FB.help._checkFirstVisit()` runs:

- If `localStorage['fb-help-seen']` is not set → inject a custom dismissable banner (`#fb-help-banner`) after 1.5s. The banner is a fixed bar at the bottom of the screen containing: "New here?" text, a **Take a quick tour** button, and a ✕ dismiss button. It is NOT the existing `FB.util.showToast` — that utility only renders plain text and auto-hides after 2.2s.
- Clicking "Take a quick tour" calls `FB.help.startTour()` and removes the banner
- Clicking ✕ removes the banner without starting the tour
- Either action sets `localStorage['fb-help-seen'] = '1'` so the banner never auto-shows again
- Completing the tour also sets the flag
- The tour remains accessible at any time via the Help Centre or the `?` button

---

## Styling Conventions

- All new CSS is scoped under `#fb-help-modal` and `.fb-tour-*` prefixes — no global overrides
- driver.js popover overrides scoped under `.driver-popover` (driver.js's own class)
- Dark theme matches existing app: `#111` surfaces, `#1e1e1e` cards, `#CDFE00` accent
- Icon system: Feather-style SVG line icons, `stroke="#555"` by default, `stroke="#CDFE00"` on active/accent state
- Modal uses `position: fixed`, `z-index: 10000` to sit above all panels

---

## Out of Scope

- Search within the Help Centre (can be added later)
- Contextual inline `?` tooltips per-panel (can be added later)
- Video embeds within articles (can be added later)
- Localisation of help content (the app's language toggle only affects canvas content, not the builder UI)
