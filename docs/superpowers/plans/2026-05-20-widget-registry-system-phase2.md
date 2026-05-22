# Widget Registry System — Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a modular widget registry that supports 40+ Elementor-style widgets (Basic + Pro categories) while preserving the existing 13 section blocks.

**Architecture:** A `FB.widgets` registry in `js/widgets.js` with individual widget files in `widgets/` that self-register. Canvas rendering delegates to the registry for widget types, falls back to existing switch for section blocks.

**Tech Stack:** Vanilla HTML/CSS/JS. No frameworks. No build tools.

---

## File Map

### Files to Create

| #   | Path                      | Purpose                                                                                                   |
| --- | ------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1   | `js/widgets.js`           | `FB.widgets` registry — register, get, render, getEditPanel, byCategory                                   |
| 2   | `widgets/basic.js`        | 8 basic widgets: heading, divider, spacer, icon, html, shortcode, blockquote, textPath                    |
| 3   | `widgets/content.js`      | 8 content widgets: image, button, video, starRating, iconBox, imageBox, iconList, socialIcons             |
| 4   | `widgets/media.js`        | 3 media widgets: imageGallery, imageCarousel, soundCloud                                                  |
| 5   | `widgets/layout.js`       | 7 layout widgets: tabs, accordion, toggle, priceTable, priceList, flipBox, cta                            |
| 6   | `widgets/interactive.js`  | 7 interactive widgets: counter, progressBar, countdown, animatedHeadline, hotspot, progressTracker, alert |
| 7   | `widgets/gallery-like.js` | 3 gallery widgets: gallery, portfolio, slides                                                             |
| 8   | `widgets/embed.js`        | 5 embed widgets: googleMaps, lottie, codeHighlight, videoPlaylist, shareButtons                           |
| 9   | `css/widgets.css`         | Structural CSS for all widget types                                                                       |

### Files to Modify

| #   | Path                     | Change                                                                       |
| --- | ------------------------ | ---------------------------------------------------------------------------- |
| 10  | `js/canvas.js`           | Delegate `renderBlockHTML()` to `FB.widgets.render()` for widget types       |
| 11  | `js/panels.js`           | Delegate edit panel to `FB.widgets.getEditPanel()`, add `updateWidgetProp()` |
| 12  | `js/blocks.js`           | Remove widget-type entries (features, pricing, team migrate to widgets)      |
| 13  | `framework-builder.html` | Add `<script>` tags for widgets.js and all widget files                      |

---

### Task 1: Create the Widget Registry (`js/widgets.js`)

**Files:**

- Create: `js/widgets.js`

- [ ] **Step 1: Write the registry core**

```javascript
FB.widgets = {};
FB.widgets._registry = {};

FB.widgets.register = function (type, def) {
  FB.widgets._registry[type] = def;
};

FB.widgets.get = function (type) {
  return FB.widgets._registry[type] || null;
};

FB.widgets.render = function (type, props) {
  var def = FB.widgets.get(type);
  if (!def)
    return (
      '<div style="padding:1rem;color:#999">Unknown widget: ' + type + "</div>"
    );
  return def.render(props);
};

FB.widgets.getEditPanel = function (type, blockId, props) {
  var def = FB.widgets.get(type);
  if (!def) return "";
  return def.editPanel(blockId, props);
};

FB.widgets.byCategory = function (cat) {
  var result = {};
  Object.keys(FB.widgets._registry).forEach(function (type) {
    if (FB.widgets._registry[type].category === cat) {
      result[type] = FB.widgets._registry[type];
    }
  });
  return result;
};
```

- [ ] **Step 2: Create `widgets/` directory**

```bash
mkdir -p /home/shauntuhey/Framework/widgets
```

---

### Task 2: Modify `canvas.js` for registry delegation

**Files:**

- Modify: `js/canvas.js`

- [ ] **Step 1: Add widget delegation to `renderBlockHTML`**

Find the `FB.canvas.renderBlockHTML = function(block) {` function. At the very top, before the switch statement, add:

```javascript
// Widget types — delegate to registry
if (FB.widgets.get(block.type)) {
  return (
    '<div class="fw-widget fw-widget-' +
    block.type +
    '">' +
    FB.widgets.render(block.type, block.props) +
    "</div>"
  );
}
```

- [ ] **Step 2: Ensure library rendering uses widget categories**

The library currently iterates `Object.keys(FB.blocks.BLOCK_DEFS)` for sections and `Object.keys(FB.blocks.CUSTOM_BLOCK_DEFS)` for custom blocks. Add a new section that renders widgets by category. In `FB.panels.buildLibrary()`, after the section blocks and custom blocks, add:

```javascript
// Widget blocks — by category
var widgetCats = [
  "basic",
  "content",
  "media",
  "layout",
  "interactive",
  "gallery-like",
  "embed",
];
widgetCats.forEach(function (cat) {
  var widgets = FB.widgets.byCategory(cat);
  var keys = Object.keys(widgets);
  if (keys.length === 0) return;
  var section = document.createElement("div");
  section.className = "panel-title";
  section.textContent =
    cat.charAt(0).toUpperCase() + cat.slice(1).replace("-like", "");
  lib.parentNode.insertBefore(section, lib);
  keys.forEach(function (type) {
    var def = widgets[type];
    var el = document.createElement("div");
    el.className = "block-item";
    el.draggable = true;
    el.innerHTML =
      '<div class="block-icon" style="background:' +
      def.iconBg +
      ";color:" +
      def.iconColor +
      '">' +
      (def.icon || "□") +
      "</div>" +
      '<div><div class="block-label">' +
      def.label +
      "</div></div>";
    el.addEventListener("dragstart", function (e) {
      FB.canvas._dragLibType = type;
      FB.canvas._dragSrcId = null;
    });
    el.addEventListener("click", function () {
      FB.canvas.insertBlock(type);
    });
    lib.parentNode.insertBefore(el, lib.nextSibling);
  });
});
```

Wait — this approach has a problem. The `buildLibrary` inserts sections into the DOM. Since the left panel has a specific structure (panel-title "Sections" → #block-library → panel-title "Custom Blocks" → #custom-block-library → buttons), inserting widgets between sections would disrupt this.

**Better approach:** Move widget library items into a separate section. In `framework-builder.html`, add a new container:

```html
<div id="left-panel">
  <div class="panel-title">Sections</div>
  <div id="block-library"></div>
  <div class="panel-title" style="margin-top:8px">Custom Blocks</div>
  <div id="custom-block-library"></div>
  <div class="panel-title" style="margin-top:8px" id="widgets-section-title">
    Basic Widgets
  </div>
  <div id="widget-library"></div>
  ...
</div>
```

And in `buildLibrary`, populate `widget-library` with widget items grouped by category with sub-headers.

- [ ] **Step 3: Update `framework-builder.html`**

Add after `#custom-block-library`:

```html
<div class="panel-title" style="margin-top:8px" id="widgets-section-title">
  Widgets
</div>
<div id="widget-library"></div>
```

In `panels.js`, update `buildLibrary`:

```javascript
FB.panels.buildLibrary = function () {
  // Existing section blocks code...
  // Existing custom blocks code...

  // Widget blocks
  var wlib = document.getElementById("widget-library");
  wlib.innerHTML = "";
  var catLabels = {
    basic: "Basic",
    content: "Content",
    media: "Media",
    layout: "Layout",
    interactive: "Interactive",
    "gallery-like": "Gallery",
    embed: "Embed",
  };
  var catOrder = [
    "basic",
    "content",
    "media",
    "layout",
    "interactive",
    "gallery-like",
    "embed",
  ];
  catOrder.forEach(function (cat) {
    var widgets = FB.widgets.byCategory(cat);
    var keys = Object.keys(widgets);
    if (keys.length === 0) return;
    var catLabel = document.createElement("div");
    catLabel.className = "panel-title";
    catLabel.style.cssText = "margin-top:4px;font-size:9px;opacity:0.7";
    catLabel.textContent = catLabels[cat] || cat;
    wlib.appendChild(catLabel);
    keys.forEach(function (type) {
      var def = widgets[type];
      var el = document.createElement("div");
      el.className = "block-item";
      el.draggable = true;
      el.style.padding = "6px 14px";
      el.innerHTML =
        '<div class="block-icon" style="background:' +
        def.iconBg +
        ";color:" +
        def.iconColor +
        ';width:24px;height:20px;font-size:8px">' +
        (def.icon || "□") +
        "</div>" +
        '<div><div class="block-label" style="font-size:11px">' +
        def.label +
        "</div></div>";
      el.addEventListener("dragstart", function (e) {
        FB.canvas._dragLibType = type;
        FB.canvas._dragSrcId = null;
      });
      el.addEventListener("click", function () {
        FB.canvas.insertBlock(type);
      });
      wlib.appendChild(el);
    });
  });
};
```

- [ ] **Step 4: Add `FB.panels.updateWidgetProp()` to panels.js**

```javascript
FB.panels.updateWidgetProp = function (id, key, val) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block) return;
  block.props[key] = val;
  FB.canvas.refreshBlock(id);
};
```

---

### Task 3: Update right panel rendering

**Files:**

- Modify: `js/panels.js`

- [ ] **Step 1: Add widget edit panel delegation to `renderRightPanel`**

In `FB.panels.renderRightPanel()`, after gathering `def` and `acc` state, add widget-specific content section:

```javascript
// Widget content section — delegate to widget's editPanel
if (FB.widgets.get(block.type)) {
  contentHtml = FB.widgets.getEditPanel(block.type, block.id, block.props);
}
```

The widget edit panel replaces the block-specific switch cases (the `if (block.type === 'nav') ...` blocks). The Style, Spacing, Advanced, and Actions sections remain common for all blocks.

---

### Task 4: Create Basic Widgets (`widgets/basic.js`)

**Files:**

- Create: `widgets/basic.js`

- [ ] **Step 1: Register heading widget**

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
    align: "left",
    color: "#111111",
    size: 32,
  },
  render: function (p) {
    var tag = p.tag || "h2";
    return (
      "<" +
      tag +
      ' style="text-align:' +
      (p.align || "left") +
      ";color:" +
      (p.color || "#111") +
      ";font-size:" +
      (p.size || 32) +
      'px;font-family:\'Syne\',sans-serif;font-weight:800;letter-spacing:-1px;line-height:1.1;margin:0;padding:0.5rem 1rem" contenteditable data-field="text">' +
      (p.text || "") +
      "</" +
      tag +
      ">"
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Text</label><input type="text" value="' +
      p.text +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','text',this.value)\"></div>" +
      '<div class="rp-row"><label>Tag</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','tag',this.value)\">" +
      ["h1", "h2", "h3", "h4", "h5", "h6", "div", "p"]
        .map(function (t) {
          return (
            '<option value="' +
            t +
            '"' +
            (p.tag === t ? " selected" : "") +
            ">" +
            t.toUpperCase() +
            "</option>"
          );
        })
        .join("") +
      "</select></div>" +
      '<div class="rp-row"><label>Size: ' +
      (p.size || 32) +
      'px</label><input type="range" min="14" max="72" value="' +
      (p.size || 32) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','size',+this.value);this.previousElementSibling.textContent='Size: '+this.value+'px'\"></div>"
    );
  },
});
```

- [ ] **Step 2: Register divider widget**

```javascript
FB.widgets.register("divider", {
  label: "Divider",
  icon: "—",
  iconBg: "#2a2a2a",
  iconColor: "#CDFE00",
  category: "basic",
  defaultProps: { width: 100, height: 2, color: "#ddd", style: "solid" },
  render: function (p) {
    return (
      '<hr style="width:' +
      (p.width || 100) +
      "%;height:" +
      (p.height || 2) +
      "px;background:" +
      (p.color || "#ddd") +
      ';border:none;margin:1rem auto">'
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Width: ' +
      (p.width || 100) +
      '%</label><input type="range" min="10" max="100" value="' +
      (p.width || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','width',+this.value);this.previousElementSibling.textContent='Width: '+this.value+'%'\"></div>" +
      '<div class="rp-row"><label>Height: ' +
      (p.height || 2) +
      'px</label><input type="range" min="1" max="10" value="' +
      (p.height || 2) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value);this.previousElementSibling.textContent='Height: '+this.value+'px'\"></div>" +
      '<div class="rp-row"><label>Color</label><div class="color-row"><input type="color" value="' +
      (p.color || "#ddd") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      '\',\'color\',this.value)"><input type="text" value="' +
      (p.color || "#ddd") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color',this.value)\"></div></div>"
    );
  },
});
```

- [ ] **Step 3: Register spacer widget**

```javascript
FB.widgets.register("spacer", {
  label: "Spacer",
  icon: "⤢",
  iconBg: "#2a2a2a",
  iconColor: "#999",
  category: "basic",
  defaultProps: { height: 50 },
  render: function (p) {
    return (
      '<div style="height:' +
      (p.height || 50) +
      'px;pointer-events:none"></div>'
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Height: ' +
      (p.height || 50) +
      'px</label><input type="range" min="10" max="200" value="' +
      (p.height || 50) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value);this.previousElementSibling.textContent='Height: '+this.value+'px'\"></div>"
    );
  },
});
```

- [ ] **Step 4: Register icon widget**

```javascript
FB.widgets.register("icon", {
  label: "Icon",
  icon: "✦",
  iconBg: "#1a2a3a",
  iconColor: "#CDFE00",
  category: "basic",
  defaultProps: { icon: "★", size: 48, color: "#CDFE00" },
  render: function (p) {
    return (
      '<div style="text-align:center;padding:1rem"><span style="font-size:' +
      (p.size || 48) +
      "px;color:" +
      (p.color || "#CDFE00") +
      '" contenteditable data-field="icon">' +
      (p.icon || "★") +
      "</span></div>"
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Icon (emoji/SVG)</label><input type="text" value="' +
      p.icon +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','icon',this.value)\"></div>" +
      '<div class="rp-row"><label>Size: ' +
      (p.size || 48) +
      'px</label><input type="range" min="16" max="128" value="' +
      (p.size || 48) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','size',+this.value);this.previousElementSibling.textContent='Size: '+this.value+'px'\"></div>" +
      '<div class="rp-row"><label>Color</label><div class="color-row"><input type="color" value="' +
      (p.color || "#CDFE00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      '\',\'color\',this.value)"><input type="text" value="' +
      (p.color || "#CDFE00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color',this.value)\"></div></div>"
    );
  },
});
```

- [ ] **Step 5: Register HTML widget**

```javascript
FB.widgets.register("html", {
  label: "HTML",
  icon: "</>",
  iconBg: "#2a1a1a",
  iconColor: "#e88",
  category: "basic",
  defaultProps: { html: "<p>Your HTML here</p>" },
  render: function (p) {
    return '<div style="padding:0.5rem 1rem">' + (p.html || "") + "</div>";
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Raw HTML</label><textarea rows="6" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','html',this.value)\">" +
      p.html +
      "</textarea></div>"
    );
  },
});
```

- [ ] **Step 6: Register shortcode, blockquote, textPath widgets**

Repeat the pattern for remaining basic widgets:

**shortcode:**

```javascript
FB.widgets.register("shortcode", {
  label: "Shortcode",
  icon: "[]",
  iconBg: "#2a2a1a",
  iconColor: "#999",
  category: "basic",
  defaultProps: { shortcode: "[your_shortcode]" },
  render: function (p) {
    return (
      '<div style="padding:1rem;background:#f5f5f5;border:1px dashed #ccc;border-radius:4px;text-align:center;color:#999;font-size:12px">' +
      (p.shortcode || "[shortcode]") +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Shortcode</label><input type="text" value="' +
      p.shortcode +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','shortcode',this.value)\"></div>"
    );
  },
});
```

**blockquote:**

```javascript
FB.widgets.register("blockquote", {
  label: "Blockquote",
  icon: '"',
  iconBg: "#1a2a1a",
  iconColor: "#CDFE00",
  category: "basic",
  defaultProps: {
    quote: "The best way to predict the future is to create it.",
    attribution: "Peter Drucker",
    borderColor: "#CDFE00",
  },
  render: function (p) {
    return (
      '<blockquote style="border-left:4px solid ' +
      (p.borderColor || "#CDFE00") +
      ';padding:1rem 1.5rem;margin:1rem;background:#f9f9f9"><p style="font-size:16px;font-weight:300;font-style:italic;line-height:1.6;margin-bottom:0.5rem" contenteditable data-field="quote">' +
      (p.quote || "") +
      '</p><cite style="font-size:13px;color:#999" contenteditable data-field="attribution">— ' +
      (p.attribution || "") +
      "</cite></blockquote>"
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Quote</label><textarea rows="3" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','quote',this.value)\">" +
      p.quote +
      "</textarea></div>" +
      '<div class="rp-row"><label>Attribution</label><input type="text" value="' +
      p.attribution +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','attribution',this.value)\"></div>" +
      '<div class="rp-row"><label>Border Color</label><div class="color-row"><input type="color" value="' +
      (p.borderColor || "#CDFE00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      '\',\'borderColor\',this.value)"><input type="text" value="' +
      (p.borderColor || "#CDFE00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderColor',this.value)\"></div></div>"
    );
  },
});
```

**textPath:**

```javascript
FB.widgets.register("textPath", {
  label: "Text Path",
  icon: "~",
  iconBg: "#1a2a3a",
  iconColor: "#CDFE00",
  category: "basic",
  defaultProps: { text: "Curved Text", fontSize: 24, color: "#111111" },
  render: function (p) {
    var pathId = "tp_" + Math.random().toString(36).slice(2, 6);
    return (
      '<svg width="100%" height="100" xmlns="http://www.w3.org/2000/svg"><path id="' +
      pathId +
      '" d="M 10 50 Q 200 10 390 50" fill="none" stroke="none"/><text font-size="' +
      (p.fontSize || 24) +
      '" fill="' +
      (p.color || "#111") +
      '"><textPath href="#' +
      pathId +
      '">' +
      (p.text || "") +
      "</textPath></text></svg>"
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Text</label><input type="text" value="' +
      p.text +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','text',this.value)\"></div>" +
      '<div class="rp-row"><label>Font Size: ' +
      (p.fontSize || 24) +
      'px</label><input type="range" min="12" max="60" value="' +
      (p.fontSize || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontSize',+this.value);this.previousElementSibling.textContent='Font Size: '+this.value+'px'\"></div>"
    );
  },
});
```

---

### Task 5: Create Content Widgets (`widgets/content.js`)

**Files:**

- Create: `widgets/content.js`

- [ ] **Step 1: Register image widget**

```javascript
FB.widgets.register("image", {
  label: "Image",
  icon: "🖼",
  iconBg: "#1a2a3a",
  iconColor: "#CDFE00",
  category: "content",
  defaultProps: {
    src: "",
    alt: "Image",
    width: "100%",
    align: "center",
    borderRadius: 0,
  },
  render: function (p) {
    return (
      '<div style="text-align:' +
      (p.align || "center") +
      ';padding:0.5rem 1rem">' +
      (p.src
        ? '<img src="' +
          p.src +
          '" alt="' +
          (p.alt || "") +
          '" style="max-width:' +
          (p.width || "100%") +
          ";border-radius:" +
          (p.borderRadius || 0) +
          'px;height:auto">'
        : '<div style="background:#f0f0f0;border:2px dashed #ccc;border-radius:6px;padding:3rem;text-align:center;color:#999;font-size:14px">🖼 Image Placeholder<br><span style="font-size:11px">Set source URL in Style panel</span></div>') +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
      p.src +
      '" placeholder="https://..." onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','src',this.value)\"></div>" +
      '<div class="rp-row"><label>Alt Text</label><input type="text" value="' +
      p.alt +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','alt',this.value)\"></div>" +
      '<div class="rp-row"><label>Max Width</label><input type="text" value="' +
      (p.width || "100%") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','width',this.value)\"></div>" +
      '<div class="rp-row"><label>Border Radius: ' +
      (p.borderRadius || 0) +
      'px</label><input type="range" min="0" max="50" value="' +
      (p.borderRadius || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value);this.previousElementSibling.textContent='Border Radius: '+this.value+'px'\"></div>"
    );
  },
});
```

- [ ] **Step 2: Register button widget**

```javascript
FB.widgets.register("button", {
  label: "Button",
  icon: "▦",
  iconBg: "#2a3a1a",
  iconColor: "#CDFE00",
  category: "content",
  defaultProps: {
    text: "Click Me",
    url: "#",
    style: "solid",
    size: "md",
    align: "center",
    bg: "#CDFE00",
    color: "#111",
  },
  render: function (p) {
    var sizes = {
      sm: "8px 16px;font-size:11px",
      md: "12px 24px;font-size:13px",
      lg: "16px 32px;font-size:15px",
    };
    var s = sizes[p.size] || sizes.md;
    return (
      '<div style="text-align:' +
      (p.align || "center") +
      ';padding:0.5rem 1rem">' +
      '<a href="' +
      (p.url || "#") +
      '" style="display:inline-block;background:' +
      (p.bg || "#CDFE00") +
      ";color:" +
      (p.color || "#111") +
      ";padding:" +
      s.split(";")[0] +
      ";font-size:" +
      s.split(";")[1].split(":")[1] +
      ';font-weight:600;border:none;border-radius:6px;cursor:pointer;text-decoration:none;font-family:inherit" contenteditable data-field="text">' +
      (p.text || "Click Me") +
      "</a></div>"
    );
  },
  editPanel: function (id, p) {
    var sizes = ["sm", "md", "lg"];
    return (
      '<div class="rp-row"><label>Text</label><input type="text" value="' +
      p.text +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','text',this.value)\"></div>" +
      '<div class="rp-row"><label>Link</label><input type="text" value="' +
      (p.url || "#") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','url',this.value)\"></div>" +
      '<div class="rp-row"><label>Size</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','size',this.value)\">" +
      sizes
        .map(function (s) {
          return (
            '<option value="' +
            s +
            '"' +
            (p.size === s ? " selected" : "") +
            ">" +
            s.toUpperCase() +
            "</option>"
          );
        })
        .join("") +
      "</select></div>"
    );
  },
});
```

- [ ] **Step 3-8: Register remaining content widgets**

Follow the same pattern for:

- **video** — iframe embed with src, autoplay, controls props
- **starRating** — rendered stars using ★/☆ characters with rating 1-5 slider
- **iconBox** — icon + title + desc in flex layout
- **imageBox** — image + overlay with title/desc on hover
- **iconList** — items[{icon,text}] rendered as flex rows
- **socialIcons** — items[{icon,url}] rendered as horizontal icon links

Each follows the same registration pattern with `render()` returning HTML template literals and `editPanel()` returning form controls.

---

### Task 6: Create Media Widgets (`widgets/media.js`)

**Files:**

- Create: `widgets/media.js`

- [ ] **Step 1: Register imageGallery widget**

```javascript
FB.widgets.register("imageGallery", {
  label: "Image Gallery",
  icon: "▦",
  iconBg: "#1a3a2a",
  iconColor: "#CDFE00",
  category: "media",
  defaultProps: { columns: 3, gap: 8, images: ["", "", ""], lightbox: true },
  render: function (p) {
    var imgs = p.images || [];
    return (
      '<div style="display:grid;grid-template-columns:repeat(' +
      (p.columns || 3) +
      ",1fr);gap:" +
      (p.gap || 8) +
      'px;padding:0.5rem 1rem">' +
      imgs
        .map(function (src, i) {
          return src
            ? '<img src="' +
                src +
                '" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:4px;cursor:' +
                (p.lightbox ? "pointer" : "default") +
                '" onclick="' +
                (p.lightbox ? "alert('" + src + "')" : "") +
                '">'
            : '<div style="background:#f0f0f0;aspect-ratio:1;border-radius:4px;display:flex;align-items:center;justify-content:center;color:#ccc;font-size:11px">Image ' +
                (i + 1) +
                "</div>";
        })
        .join("") +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var html =
      '<div class="rp-row"><label>Columns: ' +
      (p.columns || 3) +
      '</label><input type="range" min="2" max="6" value="' +
      (p.columns || 3) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','columns',+this.value);this.previousElementSibling.textContent='Columns: '+this.value\"></div>" +
      '<div class="rp-row"><label>Gap: ' +
      (p.gap || 8) +
      'px</label><input type="range" min="2" max="24" value="' +
      (p.gap || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','gap',+this.value);this.previousElementSibling.textContent='Gap: '+this.value+'px'\"></div>";
    (p.images || ["", "", ""]).forEach(function (src, i) {
      html +=
        '<div class="rp-row"><label>Image ' +
        (i + 1) +
        ' URL</label><input type="text" value="' +
        src +
        '" onchange="var imgs=JSON.parse(JSON.stringify(FB.state.blocks.find(function(b){return b.id===\'' +
        id +
        "'}).props.images||[]));imgs[" +
        i +
        "]=this.value;FB.panels.updateWidgetProp('" +
        id +
        "','images',imgs)\"></div>";
    });
    return html;
  },
});
```

- [ ] **Step 2: Register imageCarousel widget**

```javascript
FB.widgets.register("imageCarousel", {
  label: "Image Carousel",
  icon: "▶",
  iconBg: "#1a2a2a",
  iconColor: "#CDFE00",
  category: "media",
  defaultProps: {
    images: ["", "", ""],
    autoplay: true,
    speed: 3000,
    showDots: true,
  },
  render: function (p) {
    var imgs = p.images || [];
    if (imgs.length === 0)
      return '<div style="padding:2rem;text-align:center;color:#999">Empty carousel — add images in the Style panel</div>';
    // Simple slide-based carousel using CSS animation
    return (
      '<div class="fw-carousel" style="position:relative;overflow:hidden;padding:0.5rem 1rem">' +
      '<div class="fw-carousel-track" style="display:flex;transition:transform 0.5s ease;animation:' +
      (p.autoplay
        ? "carouselSlide " + (p.speed || 3000) + "ms infinite"
        : "none") +
      '">' +
      imgs
        .map(function (src) {
          return src
            ? '<div style="min-width:100%"><img src="' +
                src +
                '" style="width:100%;height:300px;object-fit:cover;border-radius:4px"></div>'
            : '<div style="min-width:100%;height:300px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;color:#ccc">Empty</div>';
        })
        .join("") +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var html =
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.autoplay ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','autoplay',this.checked)\"> Autoplay</label></div>" +
      '<div class="rp-row"><label>Speed: ' +
      (p.speed || 3000) +
      'ms</label><input type="range" min="1000" max="8000" step="500" value="' +
      (p.speed || 3000) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','speed',+this.value);this.previousElementSibling.textContent='Speed: '+this.value+'ms'\"></div>";
    (p.images || ["", "", ""]).forEach(function (src, i) {
      html +=
        '<div class="rp-row"><label>Slide ' +
        (i + 1) +
        ' URL</label><input type="text" value="' +
        src +
        '" onchange="var imgs=JSON.parse(JSON.stringify(FB.state.blocks.find(function(b){return b.id===\'' +
        id +
        "'}).props.images||[]));imgs[" +
        i +
        "]=this.value;FB.panels.updateWidgetProp('" +
        id +
        "','images',imgs)\"></div>";
    });
    return html;
  },
});
```

- [ ] **Step 3: Register soundCloud widget**

```javascript
FB.widgets.register("soundCloud", {
  label: "SoundCloud",
  icon: "♪",
  iconBg: "#2a1a1a",
  iconColor: "#FF5500",
  category: "media",
  defaultProps: {
    url: "https://soundcloud.com/artist/track",
    color: "#FF5500",
    layout: "visual",
  },
  render: function (p) {
    return (
      '<div style="padding:0.5rem 1rem">' +
      '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=' +
      encodeURIComponent(p.url || "") +
      "&color=" +
      (p.color || "FF5500").replace("#", "") +
      '&show_artwork=true"></iframe></div>'
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Track URL</label><input type="text" value="' +
      p.url +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','url',this.value)\"></div>"
    );
  },
});
```

---

### Task 7: Create Layout Widgets (`widgets/layout.js`)

**Files:**

- Create: `widgets/layout.js`

- [ ] **Step 1: Register tabs widget**

```javascript
FB.widgets.register("tabs", {
  label: "Tabs",
  icon: "≡",
  iconBg: "#1a1a3a",
  iconColor: "#CDFE00",
  category: "layout",
  defaultProps: {
    items: [
      { title: "Tab 1", content: "Content 1" },
      { title: "Tab 2", content: "Content 2" },
      { title: "Tab 3", content: "Content 3" },
    ],
    activeTab: 0,
  },
  render: function (p) {
    var items = p.items || [];
    if (items.length === 0)
      return '<div style="padding:1rem;color:#999">No tabs defined</div>';
    var headers = items
      .map(function (item, i) {
        return (
          '<div class="fw-tab-header" style="padding:10px 20px;cursor:pointer;border-bottom:2px solid ' +
          (i === (p.activeTab || 0) ? "var(--accent)" : "transparent") +
          ";color:" +
          (i === (p.activeTab || 0) ? "var(--accent)" : "#999") +
          ";font-weight:" +
          (i === (p.activeTab || 0) ? "600" : "400") +
          ';font-size:13px;transition:all 0.2s">' +
          item.title +
          "</div>"
        );
      })
      .join("");
    var panels = items
      .map(function (item, i) {
        return (
          '<div class="fw-tab-panel" style="display:' +
          (i === (p.activeTab || 0) ? "block" : "none") +
          ';padding:20px 0;font-size:14px;line-height:1.6">' +
          item.content +
          "</div>"
        );
      })
      .join("");
    return (
      '<div class="fw-widget-tabs" style="padding:0.5rem 1rem"><div class="fw-tabs-headers" style="display:flex;border-bottom:2px solid #eee">' +
      headers +
      '</div><div class="fw-tabs-panels">' +
      panels +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var html = "";
    (p.items || []).forEach(function (item, i) {
      html +=
        '<div class="rp-row" style="border:1px solid var(--border);border-radius:4px;margin:4px 14px;padding:6px">' +
        "<label>Tab " +
        (i + 1) +
        ' Title</label><input type="text" value="' +
        item.title +
        '" onchange="var items=JSON.parse(JSON.stringify(FB.state.blocks.find(function(b){return b.id===\'' +
        id +
        "'}).props.items||[]));items[" +
        i +
        "].title=this.value;FB.panels.updateWidgetProp('" +
        id +
        "','items',items)\">" +
        '<label style="margin-top:4px">Content</label><textarea rows="2" onchange="var items=JSON.parse(JSON.stringify(FB.state.blocks.find(function(b){return b.id===\'' +
        id +
        "'}).props.items||[]));items[" +
        i +
        "].content=this.value;FB.panels.updateWidgetProp('" +
        id +
        "','items',items)\">" +
        item.content +
        "</textarea></div>";
    });
    return html;
  },
});
```

- [ ] **Step 2-7: Register remaining layout widgets**

Follow the same pattern for:

- **accordion** — items[{title,content}] with collapsible panels
- **toggle** — items[{title,content}] like accordion but multiple open
- **priceTable** — tiered pricing (similar to existing pricing block but simpler)
- **priceList** — items[{title,desc,price}] menu-style list
- **flipBox** — front/back content with CSS 3D transform
- **cta** — title, desc, button (similar to existing cta block)

---

### Task 8: Create Interactive Widgets (`widgets/interactive.js`)

**Files:**

- Create: `widgets/interactive.js`

- [ ] **Step 1-7: Register interactive widgets**

- **counter** — number with count-up animation (CSS animation)
- **progressBar** — filled bar with percentage
- **countdown** — date-based countdown using JS interval (inline)
- **animatedHeadline** — text with rotation animation
- **hotspot** — image with positioned markers
- **progressTracker** — step indicator
- **alert** — colored notification box with dismiss button

---

### Task 9: Create Gallery & Embed Widgets

**Files:**

- Create: `widgets/gallery-like.js`
- Create: `widgets/embed.js`

- [ ] **Step 1: Register gallery, portfolio, slides widgets**

- **gallery** — filterable grid (image array + filter tags)
- **portfolio** — project cards with category filters
- **slides** — full-width background slides with text overlays

- [ ] **Step 2: Register embed widgets**

- **googleMaps** — iframe embed with address
- **lottie** — lottie-player web component (conditional load)
- **codeHighlight** — pre/code with language label
- **videoPlaylist** — video player + clickable playlist sidebar
- **shareButtons** — social share links with icons

---

### Task 10: Create Widget CSS (`css/widgets.css`)

**Files:**

- Create: `css/widgets.css`

- [ ] **Step 1: Write base widget styles**

```css
.fw-widget {
  margin: 0;
  padding: 0;
}
.fw-widget-heading {
  padding: 0.5rem 0;
}
.fw-widget-divider {
  padding: 0.5rem 0;
}
.fw-widget-spacer {
  pointer-events: none;
}
.fw-widget-icon {
  text-align: center;
}
.fw-widget-html {
  min-height: 1em;
}
.fw-widget-blockquote blockquote {
  margin: 1rem;
}
.fw-widget-button a {
  cursor: pointer;
}
```

- [ ] **Step 2: Add interactive styles**

```css
/* Carousel animation */
@keyframes carouselSlide {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* Counter animation */
.fw-counter-number {
  font-family: "Syne", sans-serif;
  font-weight: 800;
  line-height: 1;
}
.fw-counter-title {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

/* Progress bar */
.fw-progress {
  background: #e8e8e4;
  border-radius: 4px;
  height: 24px;
  overflow: hidden;
  margin: 0.5rem 0;
}
.fw-progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 1.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
}

/* Tabs */
.fw-tabs-headers {
  display: flex;
  border-bottom: 2px solid #eee;
}
.fw-tab-header {
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}
.fw-tab-header:hover {
  color: #111;
}

/* Accordion */
.fw-acc-item {
  border-bottom: 1px solid #eee;
}
.fw-acc-header {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  cursor: pointer;
  font-weight: 500;
}
.fw-acc-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.fw-acc-body.open {
  max-height: 500px;
}

/* 3D Flip */
.fw-flip-box {
  perspective: 1000px;
  height: 300px;
}
.fw-flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}
.fw-flip-box:hover .fw-flip-inner {
  transform: rotateY(180deg);
}
.fw-flip-front,
.fw-flip-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border-radius: 6px;
}
.fw-flip-back {
  transform: rotateY(180deg);
  background: #111;
  color: #fff;
}

/* Countdown */
.fw-countdown {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: 1rem;
}
.fw-countdown-unit {
  text-align: center;
}
.fw-countdown-num {
  font-family: "Syne", sans-serif;
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
}
.fw-countdown-label {
  font-size: 11px;
  text-transform: uppercase;
  color: #999;
  letter-spacing: 2px;
}

/* Hotspot */
.fw-hotspot-img {
  position: relative;
  display: inline-block;
  width: 100%;
}
.fw-hotspot-marker {
  position: absolute;
  width: 24px;
  height: 24px;
  background: var(--accent);
  border-radius: 50%;
  cursor: pointer;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #111;
}
.fw-hotspot-marker:hover {
  transform: translate(-50%, -50%) scale(1.2);
}

/* Alerts */
.fw-alert {
  padding: 1rem;
  border-radius: 6px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 0.5rem 1rem;
}
.fw-alert-info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}
.fw-alert-success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
.fw-alert-warning {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}
.fw-alert-danger {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
.fw-alert-dismiss {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  margin-left: auto;
  opacity: 0.5;
}
.fw-alert-dismiss:hover {
  opacity: 1;
}

/* Share buttons */
.fw-share-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  text-decoration: none;
}
```

---

### Task 11: Update `framework-builder.html` script loading

**Files:**

- Modify: `framework-builder.html`

- [ ] **Step 1: Add new script and CSS references**

Add before `</head>`:

```html
<link rel="stylesheet" href="css/widgets.css" />
```

Add after existing `<script>` tags (before `</body>`):

```html
<script src="js/widgets.js"></script>
<script src="widgets/basic.js"></script>
<script src="widgets/content.js"></script>
<script src="widgets/media.js"></script>
<script src="widgets/layout.js"></script>
<script src="widgets/interactive.js"></script>
<script src="widgets/gallery-like.js"></script>
<script src="widgets/embed.js"></script>
```

- [ ] **Step 2: Add widget library container to left panel**

```html
<div class="panel-title" style="margin-top:8px" id="widget-section-title">
  Widgets
</div>
<div id="widget-library"></div>
```

---

### Task 12: Validation

**Files:**

- No files — manual verification

- [ ] **Step 1: Verify registry loads**

Open `framework-builder.html` in browser. Open DevTools console. Run:

```javascript
Object.keys(FB.widgets._registry).length; // Should be 40+
```

Verify no console errors.

- [ ] **Step 2: Verify library renders**

Left panel should show "Widgets" section with category sub-headers (Basic, Content, Media, Layout, Interactive, Gallery, Embed) and all widget items.

- [ ] **Step 3: Verify canvas rendering**

Click each widget type. Verify: (a) block appears on canvas, (b) right panel shows correct edit controls, (c) style/spacing/advanced sections still work.

- [ ] **Step 4: Verify existing blocks still work**

Add nav, hero, footer blocks. Verify they render correctly and existing edit controls work.

- [ ] **Step 5: Verify JS syntax**

```bash
for f in widgets/*.js js/*.js; do node --check "$f"; done
```

No errors expected.

---

## Spec Coverage Checklist

| Spec Section                    | Task Coverage                                                                                                |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 1. Widget Registry Architecture | Task 1 (widgets.js) + Task 2 (canvas delegation)                                                             |
| 2. Basic Widgets (8)            | Task 4 (basic.js) — heading, divider, spacer, icon, html, shortcode, blockquote, textPath                    |
| 3. Content Widgets (8)          | Task 5 (content.js) — image, button, video, starRating, iconBox, imageBox, iconList, socialIcons             |
| 4. Media Widgets (3)            | Task 6 (media.js) — imageGallery, imageCarousel, soundCloud                                                  |
| 5. Layout Widgets (7)           | Task 7 (layout.js) — tabs, accordion, toggle, priceTable, priceList, flipBox, cta                            |
| 6. Interactive Widgets (7)      | Task 8 (interactive.js) — counter, progressBar, countdown, animatedHeadline, hotspot, progressTracker, alert |
| 7. Gallery Widgets (3)          | Task 9 (gallery-like.js) — gallery, portfolio, slides                                                        |
| 8. Embed Widgets (5)            | Task 9 (embed.js) — googleMaps, lottie, codeHighlight, videoPlaylist, shareButtons                           |
| 9. Widget CSS                   | Task 10 (widgets.css)                                                                                        |
| 10. HTML Integration            | Task 11 (framework-builder.html)                                                                             |
