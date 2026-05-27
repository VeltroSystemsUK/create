# Pages System Design

**Date:** 2026-05-27
**Status:** Approved

## Overview

A full Pages system for the Framework Builder: an enhanced tab bar for quick switching, a Manage Pages modal with a two-column list+settings layout, per-page SEO metadata with AI auto-generation, a template picker for new pages, and export integration that injects correct `<head>` tags into each exported HTML file.

---

## Architecture

Three new files and one new server route. No changes to the existing `FB.pages` state/data layer beyond adding a `openManager()` call and a "Manage" button to the tab bar render.

| File                    | Role                                                                |
| ----------------------- | ------------------------------------------------------------------- |
| `js/pages-manager.js`   | Modal UI — page list, settings panel, AI SEO, template picker       |
| `css/pages-manager.css` | All modal styles, isolated from `css/canvas.css`                    |
| `server.py`             | New route `POST /api/ai-seo`                                        |
| `js/pages.js`           | Minor additions: `openManager()` call + Manage button in `render()` |

`FB.pagesManager` is a new namespace. `FB.pages` remains the state/data layer (init, switchTo, add, delete, rename, \_save, exportAll).

---

## Data Model

Each page object gains five new optional fields:

```js
{
  id: "p_abc12",
  name: "Home",       // existing
  slug: "index",      // existing
  blocks: [],         // existing

  title: "",          // <title> tag, e.g. "Home | Veltro"
  metaDesc: "",       // <meta name="description">
  ogTitle: "",        // <meta property="og:title"> (falls back to title if empty)
  ogDesc: "",         // <meta property="og:description"> (falls back to metaDesc if empty)
  ogImage: "",        // absolute URL from media gallery
}
```

All fields are optional strings. Existing page objects without them are treated as empty strings. `FB.pages._save()` serialises the full page object to localStorage automatically — no changes needed there.

---

## Tab Bar Changes

`FB.pages.render()` gains a `Manage` button injected at the far right of the bar:

```html
<button class="page-tabs-manage-btn" onclick="FB.pagesManager.open()">
  Manage
</button>
```

No other changes to the tab bar.

---

## Manage Pages Modal

### Opening / closing

`FB.pagesManager.open()` renders the modal into a `#pages-manager-overlay` div (created on first call, reused thereafter). `FB.pagesManager.close()` hides it. Clicking the overlay backdrop also closes.

### Layout

800×560px centred panel, dark theme. Two columns:

```
┌──────────────────────────────────────────────────────┐
│  Pages                                          ✕    │
├────────────────────┬─────────────────────────────────┤
│  ⠿  Home      ✎  │  Home — Settings                │
│  ⠿  About     ✎  │                                  │
│  ⠿  Services  ✎  │  Page Title  [_______________]  │
│  ⠿  Contact   ✎  │  Slug        [_______________]  │
│                    │  Meta Desc   [_______________]  │
│  + Add page        │  OG Title    [_______________]  │
│                    │  OG Desc     [_______________]  │
│                    │  OG Image    [📁 Pick]          │
│                    │                                  │
│                    │  [✦ Auto-generate SEO]           │
└────────────────────┴─────────────────────────────────┘
```

**Left column — page list**

- Renders all pages in `FB.state.pages` order
- Each row: drag handle `⠿`, page name, block count, `×` delete button
- Active page (currently editing settings) highlighted with accent border
- Clicking a row selects it and loads its settings into the right column
- Drag-and-drop reorder via HTML5 drag events (`dragstart`, `dragover`, `drop`). On drop, updates `FB.state.pages` array order and calls `FB.pages._save()`
- `+ Add page` button at the bottom opens the template picker sub-modal

**Right column — settings panel**

- Updates to show the selected page's fields when a row is clicked
- Fields: Page Title, Slug, Meta Description, OG Title, OG Desc, OG Image
- All fields save on `blur` — no explicit save button. Calls `FB.pages._save()` after each update
- Slug field auto-formats on blur: lowercased, spaces → hyphens, non-alphanumeric stripped, leading/trailing hyphens removed. Home page slug locked to `index`
- OG Image: shows current URL as a small preview thumbnail if set; `📁 Pick` button opens the existing media picker (`FB.media.openPicker`) and inserts the selected URL
- `✦ Auto-generate SEO` button: calls `POST /api/ai-seo` with the page's extracted text content, then populates Title, Meta Desc, OG Title, OG Desc. Shows a spinner on the button while loading. OG Image is never auto-filled

---

## Add Page & Templates

Clicking `+ Add page` opens a sub-modal layered over the Manage modal:

```
┌─────────────────────────────────┐
│  New Page                  ✕   │
├─────────────────────────────────┤
│  Name: [________________]       │
│                                 │
│  Start from:                    │
│  [ Blank ] [ Landing ] [ About ]│
│  [Contact] [  Blog  ] [Pricing ]│
│                                 │
│  — or duplicate existing —      │
│  [ Home ▾ ]                     │
│                                 │
│       [ Create Page ]           │
└─────────────────────────────────┘
```

- **Blank** — empty blocks array (current behaviour)
- **Predefined starters** — Landing, About, Contact, Blog, Pricing, Services. Each is a hardcoded block array with placeholder content: nav + relevant hero/content blocks + footer. Placeholder text uses the page name as context (e.g. "About Us" hero headline).
- **Duplicate existing** — a dropdown of current page names. Selecting one deep-copies that page's blocks array into the new page. No SEO fields are copied (the new page starts with blank SEO).
- Template selection and duplicate are mutually exclusive — selecting one clears the other
- On create: slug auto-generated from name, page added via `FB.pages._save()`, modal switches left-column selection to the new page, right column shows its (blank) settings

---

## AI SEO Generation

### Server route

`POST /api/ai-seo`

Follows the same `provider`/`apiKey`/`model` pattern as `/api/ai-import`. Client passes the provider and key already stored in the builder's AI settings panel.

Request body:

```json
{
  "pageName": "About",
  "content": "plain text extracted from all blocks — headlines, body copy, link labels",
  "provider": "gemini",
  "apiKey": "...",
  "model": "gemini-2.0-flash"
}
```

Response:

```json
{
  "title": "About | Veltro — Award-Winning Web Design Studio",
  "metaDesc": "Veltro is a creative web design studio building kinetic, physics-driven websites...",
  "ogTitle": "About | Veltro",
  "ogDesc": "Veltro is a creative web design studio building kinetic, physics-driven websites..."
}
```

### Content extraction

Client-side before calling the endpoint: walk the target page's `blocks` array, extract `block.props.headline`, `block.props.subheadline`, `block.props.body`, `block.props.links[].label`, `block.props.cta` — join with newlines. Strip HTML tags. Cap at 2000 characters to keep the prompt tight.

### AI prompt

System prompt instructs the model to act as an SEO copywriter. User prompt passes the page name and extracted content. Constraints: title ≤60 chars, metaDesc ≤155 chars, ogTitle ≤60 chars, ogDesc ≤200 chars. Output must be valid JSON only.

Default model: `gemini-2.0-flash` (fast, low cost for this task). Falls back gracefully: if AI call fails, returns a 500 with an error message; client shows a toast and leaves fields unchanged.

---

## Export Integration

`FB.export.generateHTML()` in `js/export.js` already calls `FB.export.generateMetaTags(seo)` which builds all `<head>` tags (title, meta description, OG, Twitter card, canonical). The integration point is: before that call, merge the current page's SEO fields into the `seo` object so they take priority over global settings.

Specifically, in `generateHTML()`, after reading the global seo settings via `FB.export._getSeoSettings()`, overlay the current page fields:

```js
var curPage = FB.pages.current();
if (curPage) {
  if (curPage.title) seo.siteName = curPage.title;
  if (curPage.metaDesc) seo.siteDescription = curPage.metaDesc;
  if (curPage.ogTitle) seo._ogTitleOverride = curPage.ogTitle;
  if (curPage.ogDesc) seo._ogDescOverride = curPage.ogDesc;
  if (curPage.ogImage) seo.ogImage = curPage.ogImage;
  seo.canonicalUrl = "/" + (curPage.slug === "index" ? "" : curPage.slug);
}
```

`generateMetaTags` is updated to read `seo._ogTitleOverride` and `seo._ogDescOverride` when building `og:title` and `og:description`, falling back to `title` and `description` respectively if not set. All other tags (Twitter card, canonical, theme-color, etc.) continue working as before — only the page-specific fields are overridden.

The canonical URL uses a root-relative path. Home (`index`) gets `/`, all others get `/slug`.

---

## Files Changed / Created

| File                     | Change                                                        |
| ------------------------ | ------------------------------------------------------------- |
| `js/pages-manager.js`    | New — modal UI, settings, template picker, AI SEO             |
| `css/pages-manager.css`  | New — all modal styles                                        |
| `js/pages.js`            | Add `Manage` button to `render()`, load `pages-manager.js`    |
| `server.py`              | Add `POST /api/ai-seo` route                                  |
| `framework-builder.html` | Add `<script src="js/pages-manager.js">` and `<link>` for CSS |
| `js/export.js`           | Merge per-page SEO fields into `generateMetaTags()` call      |
