# CMS System Design

**Date:** 2026-05-24
**Status:** Draft
**Applies to:** Framework Builder

## Overview

A content management system that ships with exported sites built in Framework Builder. Clients can edit text, images, and content on their live site — without touching structural design or accessing the builder software.

### Core Decisions

| Decision            | Choice                                                                                |
| ------------------- | ------------------------------------------------------------------------------------- |
| Content scope       | All content except structural design (text, images, copy)                             |
| Editing interface   | Both inline editing (`?edit` mode) + admin dashboard (`/admin`)                       |
| Editable marking    | Auto-detection (text/image props = editable, design props = locked) + manual override |
| Backend             | Extend server.py with CMS API endpoints                                               |
| Data storage        | JSON files (cms-schema.json, cms-content.json, cms-config.json)                       |
| Builder integration | Zero CMS UI in the builder — just "Export with CMS"                                   |

## 1. Content Schema System

The CMS auto-generates a content schema by scanning all blocks and pages in the site.

### Auto-Detection Rules

**Editable (content):**

- Props named: headline, title, text, subtext, body, description, caption, quote
- Props named: imageUrl, videoUrl, avatarUrl, logoUrl
- Props named: name, label, btnText, ctaText
- Props that are strings or arrays of strings (heuristic)

**Locked (design):**

- Props named: bg, textColor, accentColor, saleColor
- Props named: paddingV, paddingH, gap, columns, imageHeight
- Boolean, color, and numeric props (heuristic)

### Schema Format

```json
{
  "pages": [
    {
      "pageId": "p_abc12",
      "name": "Home",
      "slug": "index",
      "blocks": [
        {
          "blockId": "b_xyz99",
          "type": "hero",
          "fields": {
            "headline": {
              "editable": true,
              "type": "string",
              "label": "Headline"
            },
            "subtext": {
              "editable": true,
              "type": "richtext",
              "label": "Subtext"
            },
            "ctaText": {
              "editable": true,
              "type": "string",
              "label": "Button Text"
            },
            "bg": { "editable": false, "type": "color" }
          }
        }
      ]
    }
  ]
}
```

Generated on export and saved as `cms-schema.json`.

## 2. Export Process

The "Export with CMS" option is a new button alongside the existing export functionality — either a dedicated button or a checkbox on the current export dialog. When triggered, the system:

1. Scans all pages and blocks to generate `cms-schema.json`
2. Reads current block prop values to generate `cms-content.json`
3. Copies the CMS server code, admin dashboard HTML, and inline editing JS into the export
4. Creates a `/media/` directory for uploaded images

### Exported Site Structure

```
my-site/
├── index.html          ← Pages (static HTML with content placeholders)
├── about.html
├── services.html
├── css/                ← Site styles
├── js/                 ← Site scripts + cms-edit.js (inline editing)
├── cms-schema.json     ← Auto-generated content map (read-only)
├── cms-content.json    ← Current content values (read-write)
├── cms-config.json     ← Password hash, settings (created on first login)
├── media/              ← Client-uploaded images
├── admin.html          ← Admin dashboard SPA
└── cms-server.py       ← Lightweight CMS server
```

## 3. Admin Dashboard (/admin)

The admin panel is a single-page application served at `/admin`. It has three tabs:

### Pages Tab

- Lists all pages from the site
- Click a page to see its editable fields in a form layout
- Fields are grouped by block, with block type as section heading
- Field labels use developer-friendly names (configurable in future)

### Media Tab

- Thumbnail grid of all uploaded images
- Upload new images (drag & drop or file picker)
- Replace existing images
- Images stored in `/media/` directory

### Settings Tab

- Change admin password
- View site metadata

### Authentication

- First visit to `/admin` → prompts to set a password
- Subsequent visits → login screen
- Session-based auth (server-side session, cookie)
- Password stored as hash in `cms-config.json`

## 4. Inline Editing

Quick edits directly on the live site page.

### Flow

1. Client visits their site and appends `?edit` to the URL
2. Enters their password in a small overlay
3. Site enters edit mode — editable elements get subtle dashed borders on hover
4. Click text → it becomes editable inline (`contenteditable`)
5. Click image → opens a picker/upload dialog
6. Changes auto-save (debounced) — "Saved" indicator appears
7. Click "Done Editing" to exit — returns to visitor mode

### Technical Approach

- A `cms-edit.js` script is included in the exported site
- On `?edit` + auth, loads the content schema and marks editable elements
- Uses `contenteditable` for text, click handlers for images
- Saves changes to `PUT /api/cms/content`
- Subsequent page loads serve updated content from `cms-content.json`

### What's Editable vs Locked

| Editable inline           | Not editable inline         |
| ------------------------- | --------------------------- |
| Headlines, titles, text   | Background colors, spacings |
| Button labels, CTA text   | Layout structure, columns   |
| Images (click to replace) | Block order, page structure |
| List items (add/remove)   | Font styles, sizes          |

## 5. API Layer

Extends the existing server.py with the following endpoints:

### Content Endpoints

```
GET    /api/cms/schema           → Return cms-schema.json
GET    /api/cms/content          → Return cms-content.json
PUT    /api/cms/content          → Update a single field
PUT    /api/cms/content/bulk     → Update multiple fields at once
```

### Media Endpoints

```
POST   /api/cms/media/upload     → Upload an image file
GET    /api/cms/media            → List uploaded media
DELETE /api/cms/media/{id}       → Delete an image
```

### Auth Endpoints

```
POST   /api/cms/auth/login       → Authenticate (password → session)
POST   /api/cms/auth/check       → Verify session is valid
```

### Data Storage

All data stored as JSON files alongside the site:

- `cms-schema.json` — content schema (generated on export, read-only at runtime)
- `cms-content.json` — current content values (read/write)
- `cms-config.json` — password hash and settings (created on first login)
- `/media/` directory — uploaded image files

## 6. Content Flow (Runtime)

1. Page loads with placeholder content baked into HTML from export time
2. `cms-edit.js` (or a lightweight `cms-render.js`) fetches current content from `GET /api/cms/content`
3. JavaScript replaces placeholder text/attributes with live CMS content
4. Client edits via inline mode or admin dashboard → `PUT /api/cms/content` writes to `cms-content.json`
5. On next page load, updated content is served immediately

### Static Hosting Mode

For sites deployed to static hosting (no Python server), an alternative mode rebuilds the HTML files with baked-in content on each save via the admin panel.

## 7. Out of Scope

- Multi-user roles (editor vs admin)
- Content versioning / revision history
- Scheduled publishing
- A/B testing
- Form builder
- User management beyond single admin
