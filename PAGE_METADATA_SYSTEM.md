# Page Management System with SEO & Metadata

## Overview

A complete per-page metadata management system has been added to Veltro Create. Each page now supports unique SEO settings, Open Graph tags, and custom metalinks enrichment.

## Features Implemented

### 1. **Per-Page SEO Metadata**
Each page can now store:
- **Page Title** (max 60 chars) - Displayed in browser tab and search results
- **Meta Description** (max 160 chars) - Summary for search engines and social sharing
- **Open Graph Image** - Custom image URL for social media previews
- **Favicon URL** - Custom favicon per page (optional)
- **Custom CSS** - Page-specific styles (optional)

### 2. **Metalinks & Enrichment**
Add semantic links to pages:
- **Canonical URLs** - Tell search engines the preferred version of a page
- **Alternate Language Links** - Support multi-language sites with `hreflang` attributes
- **Prefetch/Preload** - Performance hints for browsers
- **Custom Metalinks** - Any `rel` value and `href` combination

### 3. **User Interface**

#### Settings Button on Page Tabs
- Click the **⚙️** button next to any page name to open metadata editor
- Styled to match the existing page tab design
- Quick access from the page list

#### Metadata Panel
When page settings are open, the right panel shows:
- Text inputs for title, description, OG image, favicon
- Textarea for custom CSS with monospace font
- Character counters for title (60) and description (160)
- Table of added metalinks with remove buttons
- Preset buttons to quickly add common link types:
  - Add Canonical
  - Add Alternate (with hreflang)
  - Add Custom (any rel/href)
- "Save Changes" button to persist all settings

### 4. **Export Integration**

When exporting pages to HTML:
- Each page uses its own SEO metadata
- Meta tags are generated from page-specific fields
- Open Graph tags include per-page image
- Metalinks are rendered in the `<head>` section
- Fallback to global `FB.state.page` if per-page values not set
- Custom CSS is included in page's `<style>` block

### 5. **Backward Compatibility**

- Existing sites load without errors
- Pages without metadata get empty defaults
- Global site settings still work as fallback
- No breaking changes to blocks, canvas, or export

## Files Modified

### JavaScript
- **`js/pages.js`**
  - `_getDefaults()` - Default metadata for new pages
  - `_ensureMetadata()` - Add missing metadata properties to old pages
  - Updated `init()` - Ensure backward compatibility on load
  - Updated `add()` - Initialize metadata for new pages
  - Updated `render()` - Add ⚙️ settings button to page tabs
  - `showMetadataEditor()` - Switch to metadata editing mode
  - `renderMetadataPanel()` - Generate metadata form HTML
  - `updateMetadata()` - Persist metadata changes
  - `_saveMetadataPanel()` - Save form to state and localStorage
  - `_addMetalink()`, `_removeMetalink()` - Manage metalinks

- **`js/panels.js`**
  - Updated `renderRightPanel()` - Show metadata form when no block selected
  - Added character counter updates for title/description fields

- **`js/export.js`**
  - Updated `generateMetaTags()` - Read per-page metadata
  - Added metalinks rendering in meta tags
  - Per-page favicon support
  - Fallback logic: page > global > defaults

### Styling
- **`css/layout.css`** (new section)
  - Page tabs styling (buttons, active state, hover effects)
  - Metadata panel layout and forms
  - Metalinks table styling
  - Character counter styling
  - Save button styling

## Data Model

Each page object now includes:
```javascript
{
  id: "p_abc123",
  name: "Home",
  slug: "index",
  blocks: [...],
  // NEW metadata
  title: "Home | My Site",
  description: "Page description",
  ogImage: "https://...",
  favicon: "https://...",
  customCSS: "/* styles */",
  metalinks: [
    { rel: "canonical", href: "https://example.com" },
    { rel: "alternate", href: "https://example.fr", hreflang: "fr" }
  ]
}
```

## Usage

### To Edit Page Metadata

1. Click the **⚙️** button next to a page tab
2. Right panel shows page settings form
3. Edit:
   - Page title (auto-updated in browser on export)
   - Meta description for SEO
   - OG image for social sharing
   - Favicon URL (optional)
   - Custom CSS (optional)
4. Click "Add Canonical", "Add Alternate", or "Add Custom" to add metalinks
5. Click "Save Changes" to persist

### To Export with Per-Page Metadata

1. Click "Export All Pages"
2. Each HTML file includes:
   - Correct `<title>` tag from page settings
   - Meta description tag
   - Open Graph tags with page-specific image
   - Canonical link (or custom from metalinks)
   - Any additional metalinks (hreflang, prefetch, etc.)
   - Custom CSS in `<style>` block
   - Page-specific favicon

### To Use Global Fallback

- If a page doesn't have metadata set, global site settings (in Theme panel) are used
- Global favicon and customCSS apply if not overridden per-page

## Example HTML Output

For a page with metadata:
```html
<head>
  <title>About Us | My Site</title>
  <meta name="description" content="Learn about our company and values">
  <meta property="og:title" content="About Us | My Site">
  <meta property="og:description" content="Learn about our company and values">
  <meta property="og:image" content="https://example.com/og-image.jpg">
  <link rel="canonical" href="https://example.com/about">
  <link rel="alternate" href="https://example.fr/about" hreflang="fr">
  <link rel="icon" href="https://example.com/favicon.ico">
  <style>
    /* ... standard styles ... */
    /* Page-specific custom CSS */
  </style>
</head>
```

## Testing Checklist

- [x] Add new page, verify metadata panel opens with settings button
- [x] Edit page title and description, verify they save
- [x] Add canonical link via metalinks UI
- [x] Add alternate language link with hreflang
- [x] Add custom metalink
- [x] Remove metalink from table
- [x] Export page, verify HTML has correct meta tags
- [x] Load old saved site, verify backward compatibility
- [x] Verify character counters work for title/description
- [x] Verify global fallback when page metadata empty
- [x] Verify per-page custom CSS is included in export

## Technical Details

### Metadata Persistence
- Stored in localStorage as part of page object
- Saved automatically when "Save Changes" clicked
- Restored on page load from localStorage

### UI Integration
- Metadata panel shown only when no block is selected
- Empty state message updated to mention page settings
- Settings button integrated into page tabs bar
- Character counters update in real-time as user types

### Export Fallback Chain
Priority: page-specific > global site settings > hardcoded defaults

### Metalinks Structure
Simple JSON array: `[{ rel, href, hreflang? }, ...]`
- `rel` (required): Link relationship (canonical, alternate, prefetch, etc.)
- `href` (required): Link destination URL
- `hreflang` (optional): Language/region code for alternate links

## Performance

- Minimal impact: metadata stored in existing page objects
- No additional API calls
- Character counters use simple DOM queries
- Form rendering is lightweight
- Export generation adds minimal overhead

## Future Enhancements

Potential additions (not implemented):
- Pre-populate OG image from first image block
- SEO score indicator
- Metadata templates
- Bulk metadata editing across pages
- Social media preview generator
- Schema.org structured data builder
- XML sitemap generation with per-page priority/frequency
