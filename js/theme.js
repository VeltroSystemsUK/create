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
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = FB.state.page.customCSS || "";
};

FB.theme.set = function (key, val) {
  FB.state.theme[key] = val;
  FB.theme.apply();
};

FB.theme.setPage = function (key, val) {
  FB.state.page[key] = val;
  if (key === "title") document.title = val || "Veltro Builder";
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

  function colorRow(label, key, val) {
    return (
      '<div class="rp-row"><label>' +
      label +
      '</label><div class="color-row">' +
      '<input type="color" value="' +
      val +
      '" oninput="FB.theme.set(\'' +
      key +
      "',this.value)\">" +
      '<input type="text" value="' +
      val +
      '" onchange="FB.theme.set(\'' +
      key +
      "',this.value)\">" +
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
      '<div class="rp-row"><label>' +
      label +
      "</label>" +
      "<select onchange=\"FB.theme.set('" +
      key +
      "',this.value)\">" +
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
    '<div class="rp-row"><label>Page Title</label>' +
    '<input type="text" value="' +
    (p.title || "") +
    '" placeholder="My Awesome Site" onchange="FB.theme.setPage(\'title\',this.value)"></div>' +
    '<div class="rp-row"><label>Meta Description</label>' +
    '<textarea rows="2" placeholder="Brief page description (160 chars)" onchange="FB.theme.setPage(\'description\',this.value)">' +
    (p.description || "") +
    "</textarea></div>" +
    '<div class="rp-row"><label>Favicon URL</label>' +
    '<input type="text" value="' +
    (p.favicon || "") +
    '" placeholder="https://...png" onchange="FB.theme.setPage(\'favicon\',this.value)"></div>' +
    '<div class="rp-section-label">Custom CSS</div>' +
    '<div class="rp-row"><textarea rows="7" style="font-family:\'IBM Plex Mono\',monospace;font-size:10px;line-height:1.5" ' +
    'placeholder=":root { --my-var: red; }&#10;&#10;.my-class {&#10;  color: var(--my-var);&#10;}" ' +
    "onchange=\"FB.theme.setPage('customCSS',this.value)\">" +
    (p.customCSS || "") +
    "</textarea></div>"
  );
};
