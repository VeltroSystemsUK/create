# Website Template Builder — Phase 1 Design

**Date:** 2026-05-20
**Status:** Draft
**Approach:** Modular Evolution — split monolith into structured files, no build tools

---

## 1. Project Architecture

Split the current single-file app (`framework-builder.html`, ~1424 lines) into focused, maintainable files. No build pipeline. Loaded from plain HTML `<script>` and `<link>` tags.

```
Framework/
├── index.html                 # Shell — minimal markup, loads CSS/JS
├── css/
│   ├── reset.css              # Box-sizing reset, CSS custom properties (--surface-*, --text-*, --accent)
│   ├── layout.css             # Topbar, 3-panel flex layout, collapsible panel system
│   ├── components.css         # Reusable UI: buttons, inputs, color pickers, sliders, modal, toast
│   ├── blocks.css             # All fw-* block render styles (from existing, preserved)
│   └── canvas.css             # Canvas grid, drop zones, block wrappers, drag handles, controls overlay
├── js/
│   ├── state.js               # Central state — blocks[], selectedId, history[], future[], save/load
│   ├── blocks.js              # BLOCK_DEFS + CUSTOM_BLOCK_DEFS definitions
│   ├── canvas.js              # Canvas render, inline editing, drag-drop reorder, device switching
│   ├── panels.js              # Left panel (library) + right panel (style editor) + accordion sections
│   ├── export.js              # HTML/React code generation, export modal, copy/download
│   └── app.js                 # Init, buildLibrary(), keyboard shortcuts, loadStarterTemplate()
├── templates/                 # Built-in starter template JSON files
│   ├── agency.json
│   ├── saas.json
│   └── portfolio.json
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-05-20-website-template-builder-design.md
```

Each JS module attaches to a single global namespace `const FB = {};`:

| Module      | Exposes                                             | Consumes                             |
| ----------- | --------------------------------------------------- | ------------------------------------ |
| `state.js`  | `FB.state` (blocks, selectedId, history, save/load) | Nothing                              |
| `blocks.js` | `FB.blocks` (BLOCK_DEFS, CUSTOM_BLOCK_DEFS)         | Nothing                              |
| `canvas.js` | `FB.canvas` (render, select, refresh, device)       | `FB.state`, `FB.blocks`              |
| `panels.js` | `FB.panels` (render left, right, library)           | `FB.state`, `FB.blocks`, `FB.canvas` |
| `export.js` | `FB.export` (HTML, React, modal)                    | `FB.state`, `FB.blocks`              |
| `app.js`    | Init, wiring, shortcuts                             | All above                            |

---

## 2. Collapsible Sidebar System

Both side panels collapse to thin icon rails. This was an explicit user requirement ("collapsable side bars").

### Left Panel

- **Open state:** 220px wide, shows block library with categories: "Sections", "Custom Blocks"
- **Collapsed state:** 48px wide, shows only category icon buttons stacked vertically
- **Toggle:** Click the panel edge handle or a topbar button
- **Interaction:** When collapsed, clicking a category icon temporarily expands that category as a floating flyout panel (like VS Code sidebar). Re-clicking the icon closes the flyout. The panel stays collapsed until explicitly toggled open.

### Right Panel

- **Open state:** 280px wide, shows accordion editing sections
- **Collapsed state:** 44px wide, shows vertical icon tabs: Content | Style | Spacing | Advanced
- **Toggle:** Click the panel edge handle or a topbar button
- **Interaction:** When collapsed, clicking an icon tab opens that section as a floating flyout. Selecting a block auto-opens the Content tab. Flyout closes on click-away.

### Canvas Behavior

- When either panel closes, the canvas expands to fill the freed space (CSS `flex: 1` handles this naturally)
- When both panels are closed, the canvas goes edge-to-edge
- Collapse state persists in `localStorage`

### CSS Implementation

```css
#left-panel {
  width: 220px;
  transition:
    width 280ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity 200ms;
  overflow: hidden;
}
#left-panel.collapsed {
  width: 48px;
}
#left-panel.collapsed .panel-content {
  opacity: 0;
  pointer-events: none;
}
#left-panel.collapsed .panel-icons {
  opacity: 1;
}
```

---

## 3. Visual Design Refresh

### Color System

| Token              | Value     | Usage                                      |
| ------------------ | --------- | ------------------------------------------ |
| `--surface-0`      | `#0d0d12` | Deepest background / page background       |
| `--surface-1`      | `#1a1a1f` | Panel backgrounds (was `--ui-bg`)          |
| `--surface-2`      | `#222228` | Raised elements, inputs (was `--ui-panel`) |
| `--surface-3`      | `#2a2a32` | Hover states, buttons (was `--ui-hover`)   |
| `--border`         | `#2e2e38` | Borders, dividers (was `--ui-border`)      |
| `--border-light`   | `#3a3a48` | Focus/hover borders                        |
| `--text-primary`   | `#f0f0f0` | Primary text                               |
| `--text-secondary` | `#ccc`    | Body text                                  |
| `--text-muted`     | `#666`    | Labels, captions                           |
| `--accent`         | `#CDFE00` | Primary accent (preserved from existing)   |
| `--accent-hover`   | `#b8e400` | Accent hover                               |
| `--danger`         | `#e55`    | Destructive actions                        |
| `--canvas-bg`      | `#e8e8e4` | Canvas background (preserved)              |

### Typography Scale

- `--font-ui`: `'DM Sans', sans-serif` (interface)
- `--font-display`: `'Syne', sans-serif` (headings, logo)
- `--size-caption`: 10px (panel titles, labels)
- `--size-sm`: 11px (tabs, badges)
- `--size-body`: 13px (block labels, panel content)
- `--size-md`: 14px (modal headers)
- `--size-lg`: 15px (logo text)

### Corner Rounding

- Panels: 0 (flush)
- Canvas blocks: 0 (preserved from existing)
- Buttons/inputs: 6px
- Tooltips/flyouts: 8px
- Modal: 8px

### Component Design Updates

- **Top bar:** Reduced height to 44px. Logo left, device buttons + undo/redo center, export right. Panel toggle buttons added.
- **Block items in library:** Hover reveals a subtle `translateX(4px)` motion. Drag hint shown on hover.
- **Selected block:** `box-shadow: 0 0 0 2px rgba(205, 254, 0, 0.6)` glow instead of just outline.
- **Drop indicators:** Animated pulse height from 4px → 6px on active.
- **Toast:** Moved to top-right corner instead of bottom-center. Shows a thin progress bar.
- **Modal:** Centered with backdrop blur. Tabs redesigned as pill-style.

---

## 4. Right Panel — Accordion Editing Controls

Reorganized into collapsible sections. Each section is an accordion that can be independently opened/closed.

### Section: Content

- Dynamic form fields specific to the selected block type
- Text inputs for headlines, body text (with preview of inline editing)
- Textareas for list-based fields (links, items, services)
- Inline `contenteditable` syncs back to these fields

### Section: Style

- **Background:** Color picker + hex input
- **Text Color:** Color picker + hex input (if block supports it)
- **Accent Color:** Color picker + hex input (if block supports it)
- **Background Image:** URL input (future: media library)
- **Background Repeat/Size:** Select dropdowns

### Section: Spacing

- **Padding Vertical:** Range slider 16–160px, step 8, live number readout
- **Padding Horizontal:** Range slider 16–120px, step 8, live number readout
- **Margin Top/Bottom:** Range slider 0–120px, step 8 (new — blocks can have margin)

### Section: Advanced

- **Block ID:** Text input for custom anchor ID
- **CSS Class:** Text input for custom class name
- **Border Radius:** Range slider 0–24px
- **Opacity:** Range slider 0–100%
- **Z-Index:** Number input

### Section: Actions

- Duplicate button
- Delete button (red)
- Move Up / Move Down buttons
- Lock Toggle (prevents selection/editing)

All sections collapse/expand independently. Open sections persist per-block-type.

---

## 5. Template System

### Save

- User clicks "Save Template" in the topbar → name input dialog
- Serializes `blocks[]` + metadata (name, date, block count) to JSON
- Saves to `localStorage['fb-templates']` key
- Shows confirmation toast

### Load

- "Load Template" opens a modal overlay
- Lists saved templates as cards: name, date, block count
- Click a card → template loads into canvas (confirm if canvas has unsaved work)
- "Delete" button on each card

### Import / Export

- **Export:** Download current template as `.fwb.json` file (Framework Web Builder format)
- **Import:** Drag-and-drop or file picker to upload `.fwb.json`
- **Template file format:**
  ```json
  {
    "name": "My Template",
    "version": 1,
    "created": "2026-05-20T12:00:00Z",
    "blocks": [ ... ]
  }
  ```

### Starter Templates

- Three pre-built templates shipped in `templates/`:
  1. **Agency** — Current default full-page layout (nav, hero, marquee, work, services, stats, testimonial, process, cta, footer)
  2. **SaaS** — Product-focused layout (nav, hero with mockup, features grid, pricing, cta, footer)
  3. **Portfolio** — Minimal showcase (nav, hero, full-width work grid, about, contact, footer)

### Auto-Save

- Every 30 seconds, serialize `blocks[]` to `localStorage['fb-autosave']`
- On page load, detect autosave data and offer "Restore unsaved work?" toast
- Clears autosave on manual save or export

---

## 6. Block System Expansion

### New Block Types

| Block      | Purpose                 | Configurable Props                                          |
| ---------- | ----------------------- | ----------------------------------------------------------- |
| `features` | Feature grid with icons | Icon set (emoji/icon), headline, description, 3–6 items     |
| `pricing`  | 3-column pricing tiers  | Tier name, price, features list, CTA text, highlighted tier |
| `team`     | Team member cards       | Photo URL, name, role, bio, 2–6 members                     |

### Block Locking

- Lock icon in block controls overlay
- Locked blocks: no selection on click, no drag reorder, no inline editing
- Can only be unlocked via right panel or right-click context menu

### Block Rename

- Right-click context menu → "Rename Block"
- Custom label shown in the block's drag handle area
- Default: block type name (e.g., "Hero", "Navigation")

### Block Copy / Paste

- Select block → Ctrl+C copies block as JSON to clipboard
- Ctrl+V pastes at cursor position
- Cross-tab copy/paste (clipboard API)

---

## 7. Undo/Redo Enhancements

### Visual Counter

- Top bar shows "↩ 3" / "↪ 1" indicating available undo/redo steps
- Buttons are disabled (greyed out) when no steps available

### Smarter History

- Range slider drags are debounced: only the final value change creates a history entry (not every `oninput` event)
- Batch operations (template load, clear canvas) create a single entry
- History limit increased from 50 to 100 entries

### Keep Existing

- Ctrl+Z / Ctrl+Y shortcuts remain unchanged
- Deselect with Escape remains unchanged
- Delete key on selected block remains unchanged

---

## 8. Export Enhancements

### HTML Export

- Include a self-contained `<style>` block in the export with only the `.fw-*` CSS rules corresponding to block types present on the canvas (instead of the current placeholder comment)
- Rules are sourced from `blocks.css` — minify inline, one rule per block type used
- Options: inline styles (default) vs linked CSS reference
- Preview pane in export modal shows rendered output

### React Export

- Generate clean functional components per block type
- Proper `dangerouslySetInnerHTML` handling for headline fields
- Optional: export as a single component or individual block components

### Copy / Download

- Copy button writes to clipboard (existing, preserved)
- Download generates `.html` or `.jsx` file (existing, preserved)

---

## 9. Out of Scope for Phase 1

These features are deferred to future phases:

- Responsive breakpoint engine (per-device visibility, media queries)
- Theme builder (global header/footer templates)
- Popup builder
- Form builder
- Dynamic content / data sources
- Global widgets / reusable components
- Media library / image management
- Real-time collaboration
- Cloud sync / template marketplace
- CSS animations and motion effects panel
- Custom CSS editor
- Container / row layout system (nested columns)

---

## 10. File Migration Plan

The exact order of operations for the migration:

1. Create `css/` directory — extract CSS from the monolithic `<style>` block into 5 files
2. Create `js/` directory — extract JS from the monolithic `<script>` block into 6 files
3. Rewrite `index.html` — minimal shell with `<link>` and `<script>` tags
4. Implement collapsible sidebar system
5. Apply visual design refresh (color tokens, animations, icon SVGs)
6. Reorganize right panel into accordion sections
7. Add block system expansion (features, pricing, team)
8. Implement template save/load system
9. Create starter templates JSON files
10. Add auto-save functionality
11. Enhance undo/redo (counter, debounced slider)
12. Polish export (inline CSS extraction)
13. Test end-to-end: add blocks → edit → save template → load → export → verify output
