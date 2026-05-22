# Widget Registry System — Phase 2 Design

**Date:** 2026-05-20
**Status:** Draft
**Approach:** Modular widget registry — each widget is a self-contained registration, no monolithic switch statement

---

## 1. Architecture: Widget Registry

A new core module `js/widgets.js` provides the `FB.widgets` namespace with a registration API. Individual widget files register themselves. Canvas rendering delegates to the registry for widget types, falling back to the existing switch for section blocks (nav, hero, etc.).

### Registry API

```javascript
// Create namespace
FB.widgets = {};
FB.widgets._registry = {};

// Register a widget
FB.widgets.register(type, definition);
// definition = { label, icon, iconBg, iconColor, category, defaultProps, render(props), editPanel(blockId, props) }

// Get widget definition
FB.widgets.get(type); // → definition object

// Render a widget to HTML
FB.widgets.render(type, props); // → HTML string

// Get edit panel HTML
FB.widgets.getEditPanel(type, blockId, props); // → HTML string

// Get all widgets in a category
FB.widgets.byCategory(category); // → [type, ...]
```

### Registration pattern

```javascript
FB.widgets.register("heading", {
  label: "Heading",
  icon: "H",
  iconBg: "#1a1a3a",
  iconColor: "#CDFE00",
  category: "basic",
  defaultProps: {
    text: "Hello World",
    tag: "h2",
    align: "center",
    color: "#111111",
    size: 32,
  },
  render: function (props) {
    var tag = props.tag || "h2";
    return (
      "<" +
      tag +
      ' style="text-align:' +
      (props.align || "left") +
      ";color:" +
      (props.color || "#111") +
      ";font-size:" +
      (props.size || 32) +
      'px;font-family:\'Syne\',sans-serif;font-weight:800;letter-spacing:-1px;line-height:1.1;margin:0" contenteditable data-field="text">' +
      (props.text || "") +
      "</" +
      tag +
      ">"
    );
  },
  editPanel: function (blockId, props) {
    return (
      '<div class="rp-row"><label>Text</label><input type="text" value="' +
      props.text +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      blockId +
      "','text',this.value)\"></div>" +
      '<div class="rp-row"><label>Tag</label><select onchange="FB.panels.updateWidgetProp(\'' +
      blockId +
      "','tag',this.value)\"><option value=\"h1\"" +
      (props.tag === "h1" ? " selected" : "") +
      '>H1</option><option value="h2"' +
      (props.tag === "h2" ? " selected" : "") +
      '>H2</option><option value="h3"' +
      (props.tag === "h3" ? " selected" : "") +
      '>H3</option><option value="h4"' +
      (props.tag === "h4" ? " selected" : "") +
      '>H4</option><option value="div"' +
      (props.tag === "div" ? " selected" : "") +
      ">Div</option></select></div>" +
      '<div class="rp-row"><label>Size</label><input type="range" min="14" max="72" value="' +
      (props.size || 32) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      blockId +
      "','size',+this.value)\"><label>" +
      (props.size || 32) +
      "px</label></div>"
    );
  },
});
```

### Canvas integration

In `canvas.js`, the `renderBlockHTML` function gains a delegation step:

```javascript
FB.canvas.renderBlockHTML = function(block) {
  // Widget types (registered in FB.widgets)
  if (FB.widgets.get(block.type)) {
    return '<div class="fw-widget fw-widget-' + block.type + '">' + FB.widgets.render(block.type, block.props) + '</div>';
  }
  // Section block types (nav, hero, etc.) — existing switch
  switch (block.type) { ... }
};
```

### Panel integration

In `panels.js`, `renderRightPanel` delegates to the widget's `editPanel`:

```javascript
if (FB.widgets.get(block.type)) {
  contentHtml = FB.widgets.getEditPanel(block.type, block.id, block.props);
  // Still render Style/Spacing/Advanced sections from common props
}
```

A new helper `FB.panels.updateWidgetProp(id, key, val)` is added that calls `updateProp` and then refreshes the canvas.

---

## 2. File Structure

```
Framework/
├── js/
│   ├── widgets.js           # NEW — FB.widgets registry (register, get, render, getEditPanel, byCategory)
│   ├── state.js             # unchanged
│   ├── blocks.js            # MODIFIED — remove widget types, keep only section blocks (nav, hero, etc.)
│   ├── canvas.js            # MODIFIED — renderBlockHTML delegates to FB.widgets.render()
│   ├── panels.js            # MODIFIED — renderRightPanel delegates to FB.widgets.getEditPanel() + adds updateWidgetProp()
│   ├── export.js            # unchanged
│   ├── templates.js         # unchanged
│   └── app.js               # unchanged
├── widgets/
│   ├── basic.js             # Heading, Divider, Spacer, Icon, HTML, Shortcode, Blockquote, Text Path
│   ├── content.js           # Image, Button, Video, Star Rating, Icon Box, Image Box, Icon List, Social Icons
│   ├── media.js             # Image Gallery, Image Carousel, SoundCloud
│   ├── layout.js            # Tabs, Accordion, Toggle, Price Table, Price List, Flip Box, CTA
│   ├── interactive.js       # Counter, Progress Bar, Countdown, Animated Headline, Hotspot, Progress Tracker, Alert
│   ├── gallery-like.js      # Gallery, Portfolio, Slides
│   └── embed.js             # Google Maps, Lottie, Code Highlight, Video Playlist, Share Buttons
├── css/
│   ├── widgets.css          # NEW — styles for all widget types
│   ├── reset.css            # unchanged
│   ├── layout.css           # unchanged
│   ├── components.css       # unchanged
│   ├── blocks.css           # unchanged
│   └── canvas.css           # unchanged
├── framework-builder.html   # MODIFIED — add <script> tags for widgets/*.js + widgets.js
```

---

## 3. Widget Definitions (Basic Category)

### basic.js — 8 widgets

| Widget       | Render Output         | Props                                                            |
| ------------ | --------------------- | ---------------------------------------------------------------- |
| `heading`    | `<h1-h6>` styled text | text, tag, align, color, size, font                              |
| `divider`    | `<hr>` with style     | width, height, color, style(solid/dashed/dotted), icon(optional) |
| `spacer`     | Empty `<div>`         | height, responsive(hide on mobile/tablet/desktop)                |
| `icon`       | SVG/emoji             | icon, size, color, bgColor, shape(circle/square/none), link      |
| `html`       | Raw HTML passthrough  | html                                                             |
| `shortcode`  | Placeholder           | shortcode, fallbackText                                          |
| `blockquote` | `<blockquote>` styled | quote, attribution, borderColor, align                           |
| `textPath`   | `<svg><textPath>`     | text, path(arc/wave/circle), fontSize, color                     |

### content.js — 8 widgets

| Widget        | Render Output           | Props                                                            |
| ------------- | ----------------------- | ---------------------------------------------------------------- |
| `image`       | `<img>` with link       | src, alt, width, align, link, caption, borderRadius              |
| `button`      | `<a>` styled button     | text, url, style(5 variants), size, align, icon, iconPosition    |
| `video`       | `<iframe>` embed        | src, autoplay, controls, muted, aspectRatio                      |
| `starRating`  | Rendered stars          | rating(1-5), scale, color, align, unmarkedColor                  |
| `iconBox`     | Icon + heading + text   | icon, title, desc, link, style(vertical/horizontal), hoverEffect |
| `imageBox`    | Image + overlay content | image, title, desc, link, hoverEffect(zoom/fade/slide)           |
| `iconList`    | List with icons         | items[{icon, text, link}], spacing, iconColor, textColor         |
| `socialIcons` | Brand-colored icons     | items[{icon, url}], shape, size, style(color/mono)               |

### media.js — 3 widgets

| Widget          | Render Output       | Props                                                          |
| --------------- | ------------------- | -------------------------------------------------------------- |
| `imageGallery`  | CSS grid of images  | images[], columns(2-6), gap, lightbox(true/false), aspectRatio |
| `imageCarousel` | Scrolling slideshow | images[], autoplay, speed, showDots, showArrows, pauseOnHover  |
| `soundCloud`    | Iframe embed        | url, color, layout(visual/classic), autoplay, showComments     |

### layout.js — 7 widgets

| Widget       | Render Output                | Props                                                                  |
| ------------ | ---------------------------- | ---------------------------------------------------------------------- |
| `tabs`       | Tab headers + content panels | items[{title, content}], orientation(horizontal/vertical), activeTab   |
| `accordion`  | Collapsible panels           | items[{title, content}], openFirst(true/false), icon                   |
| `toggle`     | Open/close sections          | items[{title, content}], icon, multipleOpen(true)                      |
| `priceTable` | 3-tier table                 | title, price, currency, period, features[], cta, featured, ribbon      |
| `priceList`  | Menu-style list              | items[{title, desc, price, image}], columns(1-3)                       |
| `flipBox`    | 3D flip card                 | frontTitle, frontDesc, backTitle, backDesc, direction, height, trigger |
| `cta`        | Full-width callout           | title, desc, buttonText, buttonUrl, buttonStyle, backgroundImage       |

### interactive.js — 7 widgets

| Widget             | Render Output      | Props                                                                       |
| ------------------ | ------------------ | --------------------------------------------------------------------------- |
| `counter`          | Animated number    | number, prefix, suffix, duration, title, color                              |
| `progressBar`      | Filled bar         | percent, title, color, bgColor, height, animation                           |
| `countdown`        | Timer display      | date, labelStyle, digitColor, labelColor, showDays                          |
| `animatedHeadline` | Animated text      | beforeText, animatedWords[], afterText, animation(rotate/scale/clip), style |
| `hotspot`          | Image with markers | image, hotspots[{x%,y%,title,desc}], tooltipTheme                           |
| `progressTracker`  | Step indicator     | steps[{title,desc,icon}], currentStep, layout(horizontal/vertical)          |
| `alert`            | Notification box   | title, desc, type(info/success/warning/error), dismissible, icon            |

### gallery-like.js — 3 widgets

| Widget      | Render Output           | Props                                                                    |
| ----------- | ----------------------- | ------------------------------------------------------------------------ |
| `gallery`   | Filterable grid         | images[], layout(grid/masonry), columns, spacing, filterTags[], lightbox |
| `portfolio` | Filterable project grid | projects[{title,desc,image,tags,link}], columns, filterable              |
| `slides`    | Full-width slider       | slides[{bg,title,desc,cta}], navigation, pagination, autoplay, height    |

### embed.js — 5 widgets

| Widget          | Render Output      | Props                                         |
| --------------- | ------------------ | --------------------------------------------- |
| `googleMaps`    | Iframe embed       | address, zoom, height, skin                   |
| `lottie`        | Lottie animation   | src(json URL), autoplay, loop, speed, reverse |
| `codeHighlight` | `<pre><code>`      | language, code, theme, lineNumbers            |
| `videoPlaylist` | Player + playlist  | videos[{src,title,thumbnail}], layout         |
| `shareButtons`  | Social share links | networks[], style(icon/text/icon+text), url   |

---

## 4. CSS Strategy

A new `css/widgets.css` file holds all widget-specific styles. Each widget's render function outputs minimal inline styles for per-instance customization (color, size, spacing) and uses CSS classes for structural styles (layout grid, hover effects, animations).

```css
.fw-widget { margin: 0; padding: 0; }
.fw-widget-heading { padding: 0.5rem 0; }
.fw-widget-divider { padding: 0.5rem 0; }
.fw-widget-button { display: inline-block; }

/* Tab styles */
.fw-widget-tabs .fw-tabs-headers { display: flex; border-bottom: 2px solid #eee; }
.fw-widget-tabs .fw-tabs-header { padding: 10px 20px; cursor: pointer; ... }
.fw-widget-tabs .fw-tabs-header.active { border-bottom-color: var(--accent); color: var(--accent); }
.fw-widget-tabs .fw-tabs-panel { display: none; padding: 20px 0; }
.fw-widget-tabs .fw-tabs-panel.active { display: block; }

/* Accordion */
.fw-widget-accordion .fw-acc-header { padding: 12px 0; cursor: pointer; display: flex; justify-content: space-between; border-bottom: 1px solid #eee; }
.fw-widget-accordion .fw-acc-body { max-height: 0; overflow: hidden; transition: max-height 0.3s; }
.fw-widget-accordion .fw-acc-body.open { max-height: 500px; }

/* Star rating */
.fw-star { display: inline-block; color: #f0ad4e; font-size: 1.2em; letter-spacing: 2px; }

/* Progress bar */
.fw-progress { background: #e8e8e4; border-radius: 3px; height: 24px; overflow: hidden; }
.fw-progress-fill { height: 100%; border-radius: 3px; transition: width 1.5s ease; }
```

---

## 5. Migration Path

### Phase 2a: Core Registry

1. Create `js/widgets.js` with `FB.widgets` namespace
2. Add register(), render(), getEditPanel(), byCategory() methods
3. Modify `canvas.js` to delegate widget rendering
4. Modify `panels.js` to delegate edit panels
5. Add `FB.panels.updateWidgetProp()` helper
6. Add framework-builder.html script tag for widgets.js

### Phase 2b: Basic Widgets

7. Create `widgets/basic.js` — 8 simple widgets
8. Create `widgets/content.js` — 8 content widgets
9. Create `widgets/media.js` — 3 media widgets
10. Create `css/widgets.css` with base widget styles
11. Add script tags to framework-builder.html

### Phase 2c: Layout & Interactive Widgets

12. Create `widgets/layout.js` — 7 layout widgets
13. Create `widgets/interactive.js` — 7 interactive widgets
14. Create `widgets/gallery-like.js` — 3 gallery widgets
15. Add widget CSS rules for tab, accordion, carousel, flip, counter, countdown animations

### Phase 2d: Embed Widgets

16. Create `widgets/embed.js` — 5 embed widgets
17. Add CSS for maps, code highlight, video playlist

### Phase 2e: Polish

18. Remove widget-type block definitions from blocks.js (migrate cleanly)
19. Update library to categorize widgets using FB.widgets.byCategory()
20. Update starter templates to use new widgets where appropriate

---

## 6. Out of Scope (Deferred)

- Dynamic widgets (Posts, Portfolio dynamic query) — need data source abstraction
- Form builder — requires form state management and validation engine
- Login widget — requires session/auth handling
- Nav Menu / Mega Menu — requires menu definition UI
- Third-party SDK widgets (PayPal, Stripe, Facebook) — require API key management
- Lottie — requires loading Lottie player library conditionally
