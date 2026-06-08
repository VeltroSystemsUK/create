FB.theme = {};

FB.theme.FONTS = [
  "Lexend",
  "Inter",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Raleway",
  "Poppins",
  "Space Grotesk",
  "DM Sans",
  "Plus Jakarta Sans",
  "Syne",
  "Figtree",
  "Playfair Display",
  "Merriweather",
  "Lora",
  "Fraunces",
  "Oswald",
  "Bebas Neue",
  "Barlow Condensed",
  "IBM Plex Mono",
  "JetBrains Mono",
  "Space Mono",
];

FB.theme.apply = function () {
  var t = FB.state.theme;
  var canvas = document.getElementById("canvas-wrap");
  if (canvas) {
    canvas.style.setProperty("--page-accent", t.accent || "#CDFE00");
    canvas.style.setProperty("--page-bg", t.bg || "#111111");
    canvas.style.setProperty("--page-text", t.text || "#f7f6f2");
    canvas.style.setProperty("--page-surface", t.surface || "#1a1a2a");
  }
  FB.theme._ensureFont(t.fontHeading || "Lexend");
  if ((t.fontBody || "Lexend") !== (t.fontHeading || "Lexend")) {
    FB.theme._ensureFont(t.fontBody || "Lexend");
  }
  var styleEl = document.getElementById("fb-custom-css");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "fb-custom-css";
    if (document.head) document.head.appendChild(styleEl);
  }
  if (styleEl) styleEl.textContent = FB.state.page.customCSS || "";
};

FB.theme.set = function (key, val) {
  FB.state.theme[key] = val;
  FB.theme.apply();
};

FB.theme.setPage = function (key, val) {
  FB.state.page[key] = val;
  if (key === "title") document.title = val || "Veltro Create";
  if (key === "customCSS") FB.theme.apply();
};

FB.theme._ensureFont = function (name) {
  if (!name || name === "Lexend") return;
  var id = "gf-" + name.replace(/\s+/g, "-").toLowerCase();
  if (document.getElementById(id)) return;
  var link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=" +
    encodeURIComponent(name) +
    ":wght@300;400;500;600;700;800&display=swap";
  document.head.appendChild(link);
};

FB.theme.renderPanel = function () {
  var t = FB.state.theme;
  var p = FB.state.page;

  // Normalize color for HTML5 color input (must be #rrggbb format)
  function normalizeColorForTheme(color) {
    if (!color) return "#000000";

    // If it's already a valid 6-digit hex, return it
    if (/^#[0-9a-f]{6}$/i.test(color)) {
      return color;
    }

    // Convert 3-digit hex to 6-digit hex
    if (/^#[0-9a-f]{3}$/i.test(color)) {
      return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }

    // Convert 8-digit hex (with alpha) to 6-digit hex (strip alpha)
    if (/^#[0-9a-f]{8}$/i.test(color)) {
      return color.substring(0, 7);
    }

    // Handle rgb/rgba colors by extracting hex
    var rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (rgbMatch) {
      var r = parseInt(rgbMatch[1], 10).toString(16).padStart(2, '0');
      var g = parseInt(rgbMatch[2], 10).toString(16).padStart(2, '0');
      var b = parseInt(rgbMatch[3], 10).toString(16).padStart(2, '0');
      return '#' + r + g + b;
    }

    // Default fallback
    return "#000000";
  }

  function colorRow(label, key, val) {
    var normalizedColor = normalizeColorForTheme(val);
    return (
      '<div class="rp-row"><label for="theme_' + key + '_color">' +
      label +
      '</label><div class="color-row">' +
      '<input id="theme_' + key + '_color" name="theme_' + key + '_color" type="color" value="' +
      normalizedColor +
      '" data-theme-key="' + key + '" data-theme-type="color">' +
      '<input id="theme_' + key + '_text" name="theme_' + key + '_text" type="text" value="' +
      val +
      '" data-theme-key="' + key + '" data-theme-type="text">' +
      "</div></div>"
    );
  }

  function fontSelect(label, key, current) {
    var opts = FB.theme.FONTS.map(function (f) {
      return (
        '<option value="' +
        f +
        '"' +
        (f === current ? " selected" : "") +
        ">" +
        f +
        "</option>"
      );
    }).join("");
    return (
      '<div class="rp-row"><label for="theme_' + key + '">' +
      label +
      "</label>" +
      '<select id="theme_' + key + '" name="theme_' + key + '" data-theme-key="' + key + '" data-theme-type="font">' +
      opts +
      "</select></div>"
    );
  }

  return (
    '<div class="rp-section-label">Brand Colours</div>' +
    colorRow("Accent", "accent", t.accent || "#CDFE00") +
    colorRow("Background", "bg", t.bg || "#111111") +
    colorRow("Text", "text", t.text || "#f7f6f2") +
    colorRow("Surface", "surface", t.surface || "#1a1a2a") +
    '<div class="rp-section-label">Typography</div>' +
    fontSelect("Heading Font", "fontHeading", t.fontHeading || "Lexend") +
    fontSelect("Body Font", "fontBody", t.fontBody || "Lexend") +
    '<div style="font-size:10px;color:var(--text-muted);padding:0 14px 8px">Changes preview in exported page. Blocks using hardcoded colours unaffected.</div>' +
    '<div class="rp-section-label">Page Settings</div>' +
    '<div class="rp-row"><label for="page_title">Page Title</label>' +
    '<input id="page_title" name="page_title" type="text" value="' +
    (p.title || "") +
    '" placeholder="My Awesome Site" data-page-prop="title" data-page-type="text"></div>' +
    '<div class="rp-row"><label for="page_description">Meta Description</label>' +
    '<textarea id="page_description" name="page_description" rows="2" placeholder="Brief page description (160 chars)" data-page-prop="description" data-page-type="text">' +
    (p.description || "") +
    "</textarea></div>" +
    '<div class="rp-row"><label for="page_favicon">Favicon URL</label>' +
    '<input id="page_favicon" name="page_favicon" type="text" value="' +
    (p.favicon || "") +
    '" placeholder="https://...png" data-page-prop="favicon" data-page-type="text"></div>' +
    '<div class="rp-section-label">Custom CSS</div>' +
    '<div class="rp-row"><label for="page_customCSS" style="display:block;margin-bottom:6px">Custom CSS</label><textarea id="page_customCSS" name="page_customCSS" rows="7" style="font-family:\'IBM Plex Mono\',monospace;font-size:10px;line-height:1.5" ' +
    'placeholder=":root { --my-var: red; }&#10;&#10;.my-class {&#10;  color: var(--my-var);&#10;}" ' +
    "data-page-prop=\"customCSS\" data-page-type=\"text\">" +
    (p.customCSS || "") +
    "</textarea></div>"
  );
};

// Initialize event listeners for theme panel fields
FB.theme.initPanelEvents = function() {
  // Theme color and font fields
  var themeFields = document.querySelectorAll('[data-theme-key]');
  themeFields.forEach(function(field) {
    field.addEventListener('change', function(e) {
      var key = field.getAttribute('data-theme-key');
      var value = field.value;
      FB.theme.set(key, value);
    });
    field.addEventListener('input', function(e) {
      var key = field.getAttribute('data-theme-key');
      var value = field.value;
      FB.theme.set(key, value);
    });
  });

  // Page property fields
  var pageFields = document.querySelectorAll('[data-page-prop]');
  pageFields.forEach(function(field) {
    field.addEventListener('change', function(e) {
      var prop = field.getAttribute('data-page-prop');
      var value = field.value;
      FB.theme.setPage(prop, value);
    });
  });
};
