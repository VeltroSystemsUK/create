# Design Studio — Spec

**Date:** 2026-05-23  
**Status:** Approved

---

## Overview

A Canva/Illustrator-style graphic design tool embedded inside Framework Builder. Accessible via a sidebar icon that switches the workspace into Design mode. Produces website-ready graphics (hero banners, OG images, feature cards, icons) that integrate directly into the page builder via an image block.

Built on **Fabric.js 5.3.1** (CDN: `https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js`, no build step). Designs saved server-side as JSON via `server.py`.

---

## Architecture

### New files

| File                          | Purpose                                           |
| ----------------------------- | ------------------------------------------------- |
| `js/design.js`                | `FB.design` module — all studio logic             |
| `css/design.css`              | Design Studio styles                              |
| `widgets/design-templates.js` | 6 pre-built starter canvases as Fabric.js JSON    |
| `designs/`                    | Server-side directory for saved design JSON files |

### Modified files

| File                     | Changes                                                              |
| ------------------------ | -------------------------------------------------------------------- |
| `framework-builder.html` | Design Studio HTML shell, Fabric canvas element, sidebar pencil icon |
| `js/panels.js`           | Sidebar icon switching logic (Builder ↔ Design mode)                 |
| `server.py`              | 3 new `/api/designs` endpoints                                       |

### `FB.design` sub-objects

| Sub-object            | Responsibility                                                                                      |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| `FB.design.canvas`    | Fabric.js instance, zoom/pan, keyboard shortcuts                                                    |
| `FB.design.tools`     | Active tool state (select / rect / circle / triangle / polygon / line / arrow / text / image / pan) |
| `FB.design.layers`    | Layers panel — render from `canvas._objects`, drag-to-reorder, lock/hide/delete                     |
| `FB.design.props`     | Right panel — context-sensitive object properties                                                   |
| `FB.design.align`     | Align & distribute toolbar actions                                                                  |
| `FB.design.templates` | Template picker — load a starter canvas                                                             |
| `FB.design.ai`        | AI image generation (prompt → `/api/ai-image` → `Fabric.Image.fromURL`)                             |
| `FB.design.library`   | Save/load designs, insert into page builder                                                         |

---

## UI Layout

### Mode switching

A pencil icon (✏) is added to the existing left sidebar icon rail beneath the blocks icon. Clicking it:

1. Hides the page canvas and right panel
2. Shows the Design Studio shell (Fabric canvas + design left panel + design right panel)
3. Highlights the pencil icon with the accent colour

Clicking the blocks icon reverts to Builder mode.

### Topbar (Design mode)

Same topbar chrome as Builder. Center section replaced with:

- Canvas size label (`1200 × 630`)
- Preset dropdown (Hero Banner / OG Image / Feature Card / Square / Wide / Custom)
- Zoom controls (`−` `+` `Fit`)

Right section:

- **Export ▾** dropdown → PNG / SVG
- **Save** button (accent, saves to server)

### Left panel (Design mode) — stacked layout

**Top section — Tools (compact row):**

```
[ ▶ Select ] [ ⬛ Rect ] [ ⬤ Circle ] [ ▲ Tri ] [ ⬡ Poly ] [ — Line ] [ → Arrow ] [ T Text ] [ 🖼 Image ]
```

Active tool highlighted with accent border. Clicking a shape tool then clicking/dragging on the canvas draws the shape.

**Bottom section — Layers (always visible):**

- Lists all canvas objects top-to-bottom (top of list = front of stack)
- Each row: icon + auto-name (e.g. "T Headline", "⬛ Shape 2") + 👁 toggle + 🔒 toggle
- Click to select the object on canvas
- Drag rows to reorder (updates `canvas.moveTo`)
- Right-click → rename / delete

**Below layers — slim action buttons:**

- ⊞ Templates → opens template picker overlay
- ✦ AI Generate → opens AI prompt panel
- 📁 My Designs → opens design library overlay

### Centre canvas

- Fabric.js canvas fills the available area
- Checkerboard background behind the canvas area (transparent region indicator)
- Canvas itself is white by default (overridden per design)
- **Zoom:** mouse wheel or `−`/`+` buttons
- **Pan:** Space + drag, or middle-mouse drag
- **Align toolbar** pinned above the canvas (visible when ≥1 object selected):
  - Align: Left edge, H-centre, Right edge, Top edge, V-centre, Bottom edge
  - Order: Bring Forward, Send Back, Bring to Front, Send to Back
  - Distribute: H-distribute, V-distribute (visible when ≥3 objects selected)

### Right panel (Design mode) — context-sensitive

**Nothing selected → Canvas properties:**

- Canvas background: solid colour or gradient (same gradient builder as Builder mode)
- Canvas size: width × height inputs

**Shape selected:**

- Position: X, Y
- Size: W, H (with lock-aspect-ratio toggle)
- Fill: solid colour picker or gradient toggle
- Stroke: colour + width
- Opacity slider
- Corner radius (rect only)
- Side count (polygon only)

**Text selected:**

- Position: X, Y
- Font family (same 30 Google Fonts as Builder)
- Font size + weight
- Colour
- Align: L / C / R
- Letter-spacing, line-height
- Italic / underline toggles

**Image selected:**

- Position: X, Y
- Size: W, H
- Opacity slider
- Flip H / Flip V buttons

**Bottom of right panel (always):**

- **Insert into page →** button
- **Export PNG** button
- **Export SVG** button

---

## Canvas Sizes & Templates

### Presets

| Name         | Width | Height | Use case                       |
| ------------ | ----- | ------ | ------------------------------ |
| Hero Banner  | 1920  | 600    | Full-width website hero        |
| OG Image     | 1200  | 630    | Social share / meta image      |
| Feature Card | 800   | 600    | Blog / feature section graphic |
| Square       | 1080  | 1080   | Instagram / social post        |
| Wide         | 1920  | 1080   | Presentation / wallpaper       |
| Custom       | —     | —      | User-entered dimensions        |

### Starter templates

6 pre-built Fabric.js JSON canvases, one per preset size, stored in `widgets/design-templates.js` as an array. Each template uses the app's accent colour (`#CDFE00`) and dark palette. Loaded via the ⊞ Templates button — a modal grid of thumbnail previews, click to load into canvas (prompts to confirm if canvas is not empty).

---

## Data Model & Storage

### Design file format

Saved as `designs/<slug>.json`:

```json
{
  "name": "Hero Banner",
  "slug": "hero-banner",
  "width": 1920,
  "height": 600,
  "modified": "2026-05-23T19:00:00Z",
  "thumbnail": "<base64 PNG, 320×168>",
  "fabric": { "...Fabric.js canvas JSON..." }
}
```

`thumbnail` is generated via `canvas.toDataURL({ format: 'png', multiplier: 0.167 })` at save time (scales 1920px down to ~320px).

### `server.py` endpoints

```
GET    /api/designs           → JSON array of { name, slug, thumbnail, modified }
POST   /api/designs           → body: { name, width, height, thumbnail, fabric }
                                saves to designs/<slug>.json, returns { ok, slug }
DELETE /api/designs/<slug>    → deletes designs/<slug>.json, returns { ok }
```

The `designs/` directory is created on first save if it does not exist.

---

## Integration: Design → Page Builder

### Path 1 — Insert into page (immediate)

1. User clicks **Insert into page →** in the right panel
2. `FB.design.library.insertIntoPage()` calls `canvas.toDataURL({ format: 'png', multiplier: 1 })` → gets data URL
3. Switches to Builder mode (clicks blocks icon programmatically)
4. Adds a new `imageBlock` to `FB.state.blocks` with `src` = data URL
5. Calls `FB.canvas.render()` — the image block appears at the bottom of the page
6. Shows toast: "Design inserted as image block"

### Path 2 — Design Library picker (reuse)

A **My Designs** section is added at the bottom of the Builder mode left panel (below the existing block library). It shows a 2-column thumbnail grid of all saved designs fetched from `GET /api/designs`. Clicking a thumbnail:

1. Fetches the full design JSON from the server (`GET /api/designs/<slug>`)
2. Creates a temporary off-screen `fabric.StaticCanvas` at the design's original dimensions
3. Calls `canvas.loadFromJSON(design.fabric)` → `canvas.toDataURL('png')` → disposes the temp canvas
4. Inserts the resulting data URL as an `imageBlock` (same as Path 1 from step 4 onward)

### `imageBlock` — new block type

A lightweight block type added to `js/canvas.js` and registered in the block library:

```
block.type = 'imageBlock'
block.props = { src: '<data-url or url>', alt: '', objectFit: 'cover' }
```

Renders as:

```html
<div class="fw-image-block">
  <img src="..." alt="..." style="width:100%;height:100%;object-fit:cover" />
</div>
```

Uses `_applyWrapperStyles` — gets spacing, transforms, hover, and animation controls for free.

---

## Undo / Redo

- Fabric.js fires `object:added`, `object:modified`, `object:removed` events
- `FB.design.canvas` listens to these and pushes snapshots via `canvas.toJSON()` to a local `_history` stack (max 50)
- Ctrl+Z / Ctrl+Y call `FB.design.canvas.undo()` / `.redo()` which call `canvas.loadFromJSON()`
- Design undo/redo is separate from Builder undo/redo (`FB.state.undo`)

---

## AI Image Generation

- **UI:** Clicking ✦ AI Generate opens a small panel below the layers list with a text prompt input and a Generate button
- **Backend:** New `POST /api/ai-image` endpoint in `server.py` accepts `{ prompt }`, calls the OpenAI image generation API (DALL-E 3, same API key already used for scraping), returns `{ url }`
- **Canvas:** `Fabric.Image.fromURL(url, img => canvas.add(img))` — image placed centred on canvas, user can move/resize
- If no OpenAI key is configured, the button shows a tooltip explaining the requirement

---

## Keyboard Shortcuts (Design mode)

| Key                   | Action                       |
| --------------------- | ---------------------------- |
| V                     | Select tool                  |
| R                     | Rect tool                    |
| O                     | Circle tool                  |
| T                     | Text tool                    |
| I                     | Image upload                 |
| Space + drag          | Pan canvas                   |
| Ctrl+Z                | Undo                         |
| Ctrl+Y / Ctrl+Shift+Z | Redo                         |
| Delete / Backspace    | Delete selected object       |
| Ctrl+D                | Duplicate selected           |
| Ctrl+G                | Group selected               |
| Ctrl+Shift+G          | Ungroup                      |
| Escape                | Deselect / exit text editing |
| Ctrl+S                | Save design                  |

---

## Out of scope (v1)

- Pen/freehand drawing tool
- Masks and clipping paths
- Blend modes per object
- Multi-page designs
- Real-time collaboration
- Vector path editing (node editor)
