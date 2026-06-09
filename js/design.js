FB.design = {};
FB.design._mode = false;
FB.design._canvasBg = "#ffffff";

// Suppress Fabric.js "alphabetical" textBaseline warnings (broken templates)
(function () {
  var _warn = console.warn;
  console.warn = function (msg) {
    if (typeof msg === "string" && msg.indexOf("alphabetical") !== -1) return;
    return _warn.apply(console, arguments);
  };
})();

FB.design._esc = function (s) {
  var d = document.createElement("div");
  d.textContent = String(s);
  return d.innerHTML;
};

FB.design._cssEsc = function (s) {
  return String(s || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/</g, "\\3C ");
};

FB.design.applyCanvasSurfaceBg = function () {
  var bg = FB.design._canvasBg || "#ffffff";
  var fc = FB.design.canvas && FB.design.canvas.get ? FB.design.canvas.get() : null;
  var container = fc && fc.wrapperEl ? fc.wrapperEl : document.querySelector("#ds-canvas-wrap .canvas-container");
  var wrap = document.getElementById("ds-canvas-wrap");
  if (wrap) wrap.style.background = bg;
  if (container) container.style.background = "transparent";
};

// Normalize color for HTML5 color input (must be #rrggbb format)
FB.design.normalizeColorForInput = function(color) {
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
};

FB.design.init = function () {
  // Submodules initialised in canvas.init
};

FB.design.toggleAccordion = function (headerEl) {
  var body = document.getElementById("lp-body-" + headerEl.dataset.acc);
  if (!body) return;
  var isOpen = headerEl.classList.toggle("open");
  body.classList.toggle("open", isOpen);

  if (headerEl.dataset.acc === "assets" && isOpen) {
    FB.design._loadAssets();
  }
  if (headerEl.dataset.acc === "media" && isOpen) {
    FB.design.media.load();
  }
  if (headerEl.dataset.acc === "brand" && isOpen) {
    FB.design._renderBrandSettings();
  }
};

FB.design.toggleRightAccordion = function (headerEl) {
  var body = document.getElementById("lp-body-" + headerEl.dataset.acc);
  if (!body) return;
  var isOpen = headerEl.classList.toggle("open");
  body.classList.toggle("open", isOpen);

  if (headerEl.dataset.acc === "export" && isOpen) {
    FB.design.renderExportTab();
  }
};

FB.design.switchRightTab = function (tab) {
  // Legacy function for compatibility - now just opens the accordion
  var header = document.querySelector('[data-acc="' + tab + '"]');
  if (header && !header.classList.contains("open")) {
    FB.design.toggleRightAccordion(header);
  }
};

FB.design._loadAssets = function () {
  fetch("/api/designs")
    .then(function (r) {
      return r.json();
    })
    .then(function (list) {
      var esc = FB.design._esc;
      var el = document.getElementById("ds-assets-designs");
      if (!el) return;
      el.innerHTML = list.length
        ? list
            .map(function (d) {
              return (
                '<div class="ds-builder-thumb" onclick="FB.design.library.loadDesign(\'' +
                esc(d.slug) +
                "')\">" +
                (d.thumbnail
                  ? '<img src="' +
                    esc(d.thumbnail) +
                    '" alt="' +
                    esc(d.name) +
                    '">'
                  : '<div style="height:60px;background:#1a1a2a"></div>') +
                '<div class="ds-builder-thumb-label">' +
                esc(d.name) +
                "</div></div>"
              );
            })
            .join("")
        : '<p style="color:#555;font-size:10px;padding:8px;">No saved designs yet.</p>';
    })
    .catch(function (err) {
      console.error("[_loadAssets] Error:", err);
    });
};

FB.design.renderExportTab = function () {
  var fc = FB.design.canvas.get();
  if (!fc) return;
  var bg = FB.design._canvasBg || "#ffffff";
  var el = document.getElementById("ds-canvas-bg-picker");
  if (!el) return;
  var bgNormalized = FB.design.normalizeColorForInput(bg.charAt(0) === "#" ? bg : "#ffffff");
  el.innerHTML =
    '<input id="ds-bg-color" name="ds-bg-color" type="color" class="ds-color-swatch" value="' +
    bgNormalized +
    '" onchange="FB.design.props.setCanvasBg(this.value)"/>' +
    '<input id="ds-bg-hex" name="ds-bg-hex" class="ds-input" style="flex:1" value="' +
    FB.design._esc(bg) +
    '" onchange="FB.design.props.setCanvasBg(this.value)"/>';
};

FB.design.elements = (function () {
  var FRAMES = [
    { key: "hero", name: "Hero Banner", w: 1920, h: 600 },
    { key: "og", name: "OG Image", w: 1200, h: 630 },
    { key: "card", name: "Feature Card", w: 800, h: 600 },
    { key: "square", name: "Square Post", w: 1080, h: 1080 },
    { key: "wide", name: "Wide 16:9", w: 1920, h: 1080 },
  ];

  var SHAPES = [
    { type: "rect", label: "▬", title: "Rectangle" },
    { type: "rect-r", label: "▭", title: "Rounded Rect" },
    { type: "circle", label: "⬤", title: "Circle" },
    { type: "ellipse", label: "⬭", title: "Ellipse" },
    { type: "tri", label: "▲", title: "Triangle" },
    { type: "poly", label: "⬡", title: "Polygon" },
    { type: "star", label: "★", title: "Star" },
    { type: "diamond", label: "♦", title: "Diamond" },
    { type: "hexagon", label: "⬢", title: "Hexagon" },
    { type: "line", label: "—", title: "Line" },
    { type: "arrow", label: "→", title: "Arrow" },
    { type: "double-arrow", label: "↔", title: "Double Arrow" },
    { type: "dashed", label: "╌", title: "Dashed Line" },
    { type: "heart", label: "♡", title: "Heart" },
    { type: "crescent", label: "☾", title: "Crescent" },
  ];

  var TEXT_PRESETS = [
    {
      id: "heading",
      label: "Add a Heading",
      fontSize: 64,
      fontWeight: 800,
      fill: "#ffffff",
    },
    {
      id: "subheading",
      label: "Add a Subheading",
      fontSize: 36,
      fontWeight: 600,
      fill: "#cccccc",
    },
    {
      id: "body",
      label: "Add body text",
      fontSize: 18,
      fontWeight: 400,
      fill: "#767676",
    },
    {
      id: "caption",
      label: "Add a caption",
      fontSize: 13,
      fontWeight: 400,
      fill: "#888888",
    },
  ];

  var ICONS = [
    { char: "☰", name: "menu", tags: ["hamburger", "nav", "list"] },
    { char: "✕", name: "close", tags: ["x", "cancel", "delete"] },
    { char: "✓", name: "check", tags: ["tick", "done", "complete"] },
    { char: "⚙", name: "settings", tags: ["gear", "config", "options"] },
    { char: "♡", name: "heart", tags: ["love", "like", "favourite"] },
    { char: "★", name: "star", tags: ["favourite", "rating", "award"] },
    { char: "✉", name: "email", tags: ["mail", "message", "envelope"] },
    { char: "☎", name: "phone", tags: ["call", "contact", "telephone"] },
    { char: "⊕", name: "plus-circle", tags: ["add", "new", "create"] },
    { char: "⊖", name: "minus-circle", tags: ["remove", "delete", "subtract"] },
    { char: "→", name: "arrow-right", tags: ["next", "forward", "navigate"] },
    { char: "←", name: "arrow-left", tags: ["back", "previous", "navigate"] },
    { char: "↑", name: "arrow-up", tags: ["up", "navigate", "scroll"] },
    { char: "↓", name: "arrow-down", tags: ["down", "navigate", "scroll"] },
    { char: "⬆", name: "upload", tags: ["up", "send", "export"] },
    { char: "⬇", name: "download", tags: ["down", "save", "import"] },
    { char: "↗", name: "external", tags: ["link", "open", "new-tab"] },
    { char: "⟳", name: "refresh", tags: ["reload", "sync", "repeat"] },
    { char: "◉", name: "target", tags: ["aim", "focus", "goal"] },
    { char: "◈", name: "diamond", tags: ["gem", "premium", "special"] },
    { char: "⚡", name: "lightning", tags: ["fast", "energy", "power"] },
    { char: "🔒", name: "lock", tags: ["secure", "private", "password"] },
    { char: "🔓", name: "unlock", tags: ["open", "access", "public"] },
    { char: "🔗", name: "link", tags: ["chain", "connect", "url"] },
    { char: "📋", name: "clipboard", tags: ["copy", "paste", "notes"] },
    { char: "📊", name: "chart", tags: ["graph", "data", "analytics"] },
    { char: "📷", name: "camera", tags: ["photo", "image", "media"] },
    { char: "🎯", name: "bullseye", tags: ["target", "goal", "aim"] },
    { char: "💡", name: "lightbulb", tags: ["idea", "insight", "tip"] },
    { char: "🛒", name: "cart", tags: ["shop", "ecommerce", "buy"] },
    { char: "📍", name: "pin", tags: ["location", "map", "place"] },
    { char: "📱", name: "mobile", tags: ["phone", "app", "device"] },
    { char: "💻", name: "laptop", tags: ["computer", "device", "tech"] },
    { char: "🖥", name: "desktop", tags: ["screen", "monitor", "computer"] },
    { char: "🎨", name: "palette", tags: ["design", "art", "color"] },
    { char: "✏", name: "pencil", tags: ["edit", "write", "draw"] },
    { char: "🗂", name: "folder", tags: ["files", "organise", "directory"] },
    { char: "🔔", name: "bell", tags: ["notification", "alert", "reminder"] },
    { char: "👁", name: "eye", tags: ["view", "visible", "watch"] },
    { char: "⊞", name: "grid", tags: ["layout", "tiles", "gallery"] },
    { char: "≡", name: "align", tags: ["center", "justify", "text"] },
    { char: "⊢", name: "align-left", tags: ["left", "text", "layout"] },
    { char: "⊣", name: "align-right", tags: ["right", "text", "layout"] },
    { char: "◐", name: "half-circle", tags: ["half", "split", "contrast"] },
    { char: "▦", name: "grid-fill", tags: ["pattern", "texture", "layout"] },
    { char: "◆", name: "diamond-fill", tags: ["shape", "bullet", "mark"] },
    { char: "⬢", name: "hexagon", tags: ["shape", "honeycomb", "tech"] },
    { char: "▣", name: "square-dot", tags: ["layout", "placeholder", "frame"] },
    { char: "∞", name: "infinity", tags: ["loop", "unlimited", "forever"] },
    { char: "©", name: "copyright", tags: ["legal", "brand", "rights"] },
    { char: "®", name: "registered", tags: ["trademark", "brand", "legal"] },
    { char: "™", name: "trademark", tags: ["brand", "legal", "mark"] },
    { char: "‣", name: "bullet", tags: ["list", "point", "item"] },
    { char: "»", name: "chevron-right", tags: ["next", "more", "arrow"] },
    { char: "«", name: "chevron-left", tags: ["back", "prev", "arrow"] },
    { char: "⋮", name: "more-vertical", tags: ["menu", "dots", "options"] },
    { char: "…", name: "ellipsis", tags: ["more", "dots", "continue"] },
    { char: "✦", name: "sparkle", tags: ["ai", "magic", "star", "highlight"] },
    { char: "⊗", name: "cross-circle", tags: ["close", "error", "cancel"] },
    { char: "⚑", name: "flag", tags: ["mark", "report", "highlight"] },
  ];

  var BACKGROUNDS = [
    { value: "#111111", label: "Black" },
    { value: "#ffffff", label: "White" },
    { value: "#0d0d1a", label: "Deep Navy" },
    { value: "#1a1a2a", label: "Dark Blue" },
    { value: "#f5f5f0", label: "Off White" },
    {
      value: "linear-gradient(135deg,#0d0d1a 0%,#1a1a2a 100%)",
      label: "Navy Fade",
    },
    {
      value: "linear-gradient(135deg,#111111 0%,#cdfe0022 100%)",
      label: "Neon Fade",
    },
    {
      value: "linear-gradient(135deg,#1a1a2a 0%,#2a1a3a 100%)",
      label: "Purple Dark",
    },
    {
      value: "linear-gradient(to right,#0d0d1a,#1a2a1a)",
      label: "Dark Forest",
    },
    {
      value: "linear-gradient(135deg,#f5f5f0 0%,#e8e8e0 100%)",
      label: "Paper",
    },
  ];

  var VELTRO_ELEMENTS = [
    { type: "kineticText",      icon: "〰", label: "Kinetic Text",     desc: "Editable kinetic typography" },
    { type: "textScramble",     icon: "⌨", label: "Text Scramble",    desc: "Decode effect" },
    { type: "typewriterReveal", icon: "✍", label: "Typewriter",       desc: "Typed reveal" },
    { type: "liquidText",       icon: "≋", label: "Liquid Text",      desc: "Fluid typography" },
    { type: "morphingText",     icon: "⇄", label: "Morphing Text",    desc: "Word morphing" },
    { type: "morphingCounter",  icon: "#", label: "Counter",          desc: "Animated numbers" },
    { type: "waveText",        icon: "~", label: "Wave Text",        desc: "Sine typography" },
    { type: "kineticScramble", icon: "⌨", label: "Kinetic Scramble", desc: "Decode text" },
    { type: "magneticText",    icon: "↯", label: "Magnetic Text",    desc: "Responsive text pull" },
  ];

  var MARKETING_WIDGETS = [
    { type: "campaignHero", icon: "▰", label: "Campaign Hero", desc: "Headline, CTA, trust line, image slot", variants: [["saas", "SaaS"], ["ecommerce", "Shop"], ["event", "Event"], ["service", "Service"]] },
    { type: "offerStack", icon: "%", label: "Offer Stack", desc: "Price, discount, bullets, guarantee", variants: [["launch", "Launch"], ["discount", "Deal"], ["premium", "Premium"], ["urgent", "Urgent"]] },
    { type: "socialProof", icon: "★", label: "Social Proof Strip", desc: "Quote, rating, avatar, metric", variants: [["quote", "Quote"], ["rating", "Rating"], ["logos", "Logos"], ["metric", "Metric"]] },
    { type: "productSpotlight", icon: "▣", label: "Product Spotlight", desc: "Product ad card with price and CTA", variants: [["luxury", "Luxury"], ["minimal", "Minimal"], ["sale", "Sale"], ["tech", "Tech"]] },
    { type: "announcementBanner", icon: "!", label: "Announcement Banner", desc: "Launch, sale, feature, urgency banner", variants: [["launch", "Launch"], ["sale", "Sale"], ["feature", "Feature"], ["limited", "Limited"]] },
  ];
  var MARKETING_PRESET_KEY = "fb-design-marketing-presets";
  var MARKETING_SERIAL_PROPS = ["id", "name", "motion", "_dsImageSlot", "_dsImageSlotPrefix", "_dsImageSlotId", "_dsSlotImage", "_dsSlotImageFor", "_dsMarketingWidget", "_dsMarketingType", "_dsMarketingVariant"];

  var _iconQuery = "";
  var _veltroQuery = "";
  var _veltroCategory = "all";

  function render() {
    _renderToolRow();
    _renderElementsBody();
  }

  function _renderToolRow() {
    var active = FB.design.tools.active();
    var el = document.getElementById("ds-tool-row");
    if (!el) return;
    el.innerHTML = [
      { id: "select", label: "↖", title: "Select (V)" },
      { id: "text",   label: "T", title: "Text (T)" },
      { id: "image",  label: "▣", title: "Upload Image (I)" },
      { id: "ai",     label: "✦", title: "AI Generate" },
    ]
      .map(function (t) {
        var isActive = t.id === active;
        return (
          '<button class="ds-tool-btn' +
          (isActive ? " active" : "") +
          '" ' +
          'title="' +
          t.title +
          '" ' +
          'onclick="' +
          (t.id === "ai"
            ? "FB.design.ai.open()"
            : "FB.design.tools.setTool('" + t.id + "')") +
          '">' +
          t.label +
          "</button>"
        );
      })
      .join("");
  }


  var _currentPatternType = "none";
  var _currentPatternOpacity = 0.5;
  var _patternOpacityTimer = null;
  var _accordionState = {};

  function _saveAccordionState() {
    document.querySelectorAll(".ds-accordion-item").forEach(function (item) {
      var key = item.dataset.accordion;
      if (key) {
        var content = item.querySelector(".ds-accordion-content");
        if (content) _accordionState[key] = content.classList.contains("active");
      }
    });
  }

  function _restoreAccordionState() {
    document.querySelectorAll(".ds-accordion-item").forEach(function (item) {
      var key = item.dataset.accordion;
      if (key && key in _accordionState) {
        var btn = item.querySelector(".ds-accordion-header");
        var content = item.querySelector(".ds-accordion-content");
        var chevron = btn && btn.querySelector(".ds-accordion-chevron");
        var open = _accordionState[key];
        if (btn) btn.classList.toggle("active", open);
        if (content) {
          content.classList.toggle("active", open);
          content.style.display = open ? "block" : "none";
        }
        if (chevron) chevron.textContent = open ? "▼" : "▶";
      }
    });
  }

  function _renderElementsBody() {
    _saveAccordionState();
    var el = document.getElementById("ds-elements-body");
    if (!el) return;
    el.innerHTML =
      _accordionHtml("Frames", _framesHtml(), false) +
      _accordionHtml("Shapes", _shapesHtml(), false) +
      _accordionHtml("Marketing Widgets", _marketingHtml(), false) +
      _accordionHtml("Veltro Engine", _veltroHtml(), false) +
      _accordionHtml("Text", _textHtml(), false) +
      _accordionHtml("Icons", _iconsHtml(), false) +
      _accordionHtml("Backgrounds", _backgroundsHtml(), false);
    _restoreAccordionState();

    // Restore search focus and value
    if (_iconQuery) {
      var inp = document.getElementById("ds-icon-search");
      if (inp) {
        inp.value = _iconQuery;
      }
    }
  }

  function _accordionHtml(title, contentHtml, isExpanded) {
    var activeClass = isExpanded ? " active" : "";
    var displayStyle = isExpanded ? "display: block;" : "display: none;";
    var chevron = isExpanded ? "▼" : "▶";
    return (
      '<div class="ds-accordion-item" data-accordion="' + title.toLowerCase() + '">' +
      '<button class="ds-accordion-header' + activeClass + '" onclick="FB.design.elements.toggleAccordion(this)">' +
      '<span>' + title + '</span>' +
      '<span class="ds-accordion-chevron">' + chevron + '</span>' +
      '</button>' +
      '<div class="ds-accordion-content' + activeClass + '" style="' + displayStyle + '">' +
      contentHtml +
      '</div>' +
      '</div>'
    );
  }

  function toggleAccordion(btn) {
    var content = btn.nextElementSibling;
    var chevron = btn.querySelector(".ds-accordion-chevron");
    if (!content) return;
    var isOpen = content.classList.contains("active");
    if (isOpen) {
      content.classList.remove("active");
      content.style.display = "none";
      btn.classList.remove("active");
      if (chevron) chevron.textContent = "▶";
    } else {
      content.classList.add("active");
      content.style.display = "block";
      btn.classList.add("active");
      if (chevron) chevron.textContent = "▼";
    }
  }

  function _framesHtml() {
    return (
      '<div class="ds-frame-grid">' +
      FRAMES.map(function (f) {
        return (
          '<div class="ds-frame-tile" onclick="FB.design.canvas.applyPreset(\'' +
          f.key +
          "')\">" +
          '<div class="ds-frame-name">' +
          f.name +
          "</div>" +
          '<div class="ds-frame-size">' +
          f.w +
          "×" +
          f.h +
          "</div></div>"
        );
      }).join("") +
      "</div>"
    );
  }

  function _shapesHtml() {
    return (
      '<div class="ds-shape-grid">' +
      SHAPES.map(function (s) {
        return (
          '<div class="ds-shape-tile" title="' +
          s.title +
          '" ' +
          "onclick=\"FB.design.elements.addShape('" +
          s.type +
          "')\">" +
          s.label +
          "</div>"
        );
      }).join("") +
      "</div>"
    );
  }

  function _marketingHtml() {
    var presets = _marketingPresets();
    return (
      '<div class="ds-marketing-preset-panel">' +
      '<div class="ds-mini-label">My Marketing Presets</div>' +
      (presets.length
        ? presets.map(function (p) {
          return (
            '<div class="ds-marketing-preset-row">' +
            '<button type="button" class="ds-sm-btn" onclick="FB.design.elements.addMarketingPreset(\'' + FB.design._esc(p.id) + '\')">' +
            FB.design._esc(p.name || "Marketing Preset") +
            '</button>' +
            '<button type="button" class="ds-sm-btn" title="Delete preset" onclick="event.stopPropagation();FB.design.elements.deleteMarketingPreset(\'' + FB.design._esc(p.id) + '\')">×</button>' +
            '</div>'
          );
        }).join("")
        : '<div class="ds-veltro-desc" style="padding:4px 0 8px">Save a selected marketing widget to reuse it here.</div>') +
      '</div>' +
      '<div class="ds-veltro-grid">' +
      MARKETING_WIDGETS.map(function (w) {
        return (
          '<div class="ds-veltro-tile" onclick="FB.design.elements.addMarketingWidget(\'' +
          w.type +
          "')\">" +
          '<span class="ds-veltro-icon">' + w.icon + '</span>' +
          '<div class="ds-veltro-info">' +
          '<div class="ds-veltro-name">' + w.label + '</div>' +
          '<div class="ds-veltro-desc">' + w.desc + '</div>' +
          '<div class="ds-marketing-variants">' +
          (w.variants || []).map(function (v) {
            return (
              '<button type="button" class="ds-marketing-variant" onclick="event.stopPropagation();FB.design.elements.addMarketingWidget(\'' +
              w.type +
              "','" +
              v[0] +
              "')\">" +
              v[1] +
              "</button>"
            );
          }).join("") +
          "</div>" +
          '<div class="ds-veltro-tag">marketing</div>' +
          '</div></div>'
        );
      }).join("") +
      "</div>"
    );
  }

  function _marketingPresets() {
    try {
      var list = JSON.parse(localStorage.getItem(MARKETING_PRESET_KEY) || "[]");
      return Array.isArray(list) ? list : [];
    } catch (err) {
      console.error("[marketingPresets] Failed to parse presets:", err);
      return [];
    }
  }

  function _setMarketingPresets(list) {
    localStorage.setItem(MARKETING_PRESET_KEY, JSON.stringify(list || []));
  }

  function _veltroHtml() {
    var categories = [
      ["all", "All"],
      ["text", "Text"],
      ["physics", "Physics"],
      ["cursor", "Cursor"],
      ["ambient", "Ambient"],
      ["spatial", "Spatial"],
      ["scroll", "Scroll"],
    ];
    var filtered = _filteredVeltroElements();
    return (
      '<div class="ds-veltro-browser">' +
      '<input id="ds-veltro-search" name="ds-veltro-search" class="ds-input ds-veltro-search" placeholder="Search Veltro effects..." value="' +
      FB.design._esc(_veltroQuery) +
      '" oninput="FB.design.elements.setVeltroQuery(this.value)" />' +
      '<select class="ds-select" onchange="FB.design.elements.setVeltroCategory(this.value)" style="margin-top: 8px; width: 100%">' +
      categories.map(function (cat) {
        return (
          '<option value="' + cat[0] + '"' +
          (_veltroCategory === cat[0] ? " selected" : "") +
          ">" + cat[1] + "</option>"
        );
      }).join("") +
      '</select></div>' +
      '<div class="ds-veltro-grid">' +
      (filtered.length ? filtered.map(function (v) {
        return (
          '<div class="ds-veltro-tile" onclick="FB.design.elements.addVeltroElement(\'' +
          v.type +
          "')\">" +
          '<span class="ds-veltro-icon">' + v.icon + '</span>' +
          '<div class="ds-veltro-info">' +
          '<div class="ds-veltro-name">' + v.label + '</div>' +
          '<div class="ds-veltro-desc">' + v.desc + '</div>' +
          '<div class="ds-veltro-tag">' + _veltroCategoryFor(v) + '</div>' +
          '</div></div>'
        );
      }).join("") : '<div class="ds-empty-state">No Veltro effects match this search.</div>') +
      "</div>"
    );
  }

  function _veltroCategoryFor(v) {
    var haystack = (v.type + " " + v.label + " " + v.desc).toLowerCase();
    if (/text|type|scramble|counter|word|char|wave/.test(haystack)) return "text";
    if (/physics|gravity|collision|cloth|pendulum|fluid|magnetic fields|black hole/.test(haystack)) return "physics";
    if (/cursor|trail|spotlight|lens|sampler|distort|magnetic text/.test(haystack)) return "cursor";
    if (/scroll|velocity|sticky/.test(haystack)) return "scroll";
    if (/3d|carousel|isometric|parallax|depth|islands|layout|grid|canvas|tilt/.test(haystack)) return "spatial";
    if (/particle|aurora|gradient|noise|light|holographic|background|shader|nebula|morph|geometric/.test(haystack)) return "ambient";
    return "ambient";
  }

  function _filteredVeltroElements() {
    var q = _veltroQuery.trim().toLowerCase();
    return VELTRO_ELEMENTS.filter(function (v) {
      var cat = _veltroCategoryFor(v);
      var haystack = (v.type + " " + v.label + " " + v.desc + " " + cat).toLowerCase();
      return (_veltroCategory === "all" || cat === _veltroCategory) && (!q || haystack.indexOf(q) !== -1);
    });
  }

  function setVeltroQuery(value) {
    _veltroQuery = String(value || "");
    render();
    var inp = document.getElementById("ds-veltro-search");
    if (inp) {
      inp.focus();
      var len = inp.value.length;
      if (inp.setSelectionRange) inp.setSelectionRange(len, len);
    }
  }

  function setVeltroCategory(value) {
    _veltroCategory = value || "all";
    render();
  }

  function _veltroOptions(selected) {
    return VELTRO_ELEMENTS.map(function (v) {
      return '<option value="' + v.type + '"' + (v.type === selected ? " selected" : "") + ">" + v.label + "</option>";
    }).join("");
  }

  function _textHtml() {
    return (
      '<div class="ds-text-presets">' +
      TEXT_PRESETS.map(function (p) {
        return (
          '<div class="ds-text-preset" onclick="FB.design.elements.addTextPreset(\'' +
          p.id +
          "')\">" +
          '<span style="font-size:' +
          Math.min(p.fontSize * 0.22, 15) +
          "px;font-weight:" +
          p.fontWeight +
          ";color:" +
          p.fill +
          ';">' +
          p.label +
          "</span></div>"
        );
      }).join("") +
      "</div>"
    );
  }

  function _iconsHtml() {
    var filtered = _iconQuery
      ? ICONS.filter(function (ic) {
          var q = _iconQuery.toLowerCase();
          return (
            ic.name.indexOf(q) !== -1 ||
            ic.tags.some(function (t) {
              return t.indexOf(q) !== -1;
            })
          );
        })
      : ICONS;
    return (
      '<div>' +
      '<input id="ds-icon-search" name="ds-icon-search" placeholder="Search icons…" value="' +
      FB.design._esc(_iconQuery) +
      '" ' +
      'oninput="FB.design.elements._onIconSearch(this.value)" />' +
      '<div class="ds-icon-grid">' +
      filtered
        .map(function (ic) {
          return (
            '<div class="ds-icon-tile" title="' +
            ic.name +
            '" ' +
            "onclick=\"FB.design.elements.addIcon('" +
            ic.char +
            "','" +
            ic.name +
            "')\">" +
            ic.char +
            "</div>"
          );
        })
        .join("") +
      "</div></div>"
    );
  }

  function _backgroundsHtml() {
    var currentBg = FB.design._canvasBg || "#ffffff";
    var bgNormalized = FB.design.normalizeColorForInput(typeof currentBg === "string" ? currentBg : "#ffffff");
    
    var html = '<div class="ds-bg-designer">';
    
    // Solid Color Input
    html += '<div class="ds-bg-row">';
    html += '<label class="ds-bg-label">Solid Color</label>';
    html += '<div style="display:flex; gap:6px; align-items:center;">';
    html += '<input id="ds-bg-picker-color" type="color" class="ds-color-swatch" value="' + bgNormalized + '" oninput="FB.design.elements.onBgPickerInput(this.value)" />';
    html += '<input id="ds-bg-picker-hex" type="text" class="ds-input" style="flex:1;" value="' + (typeof currentBg === "string" ? currentBg : "#ffffff") + '" onchange="FB.design.elements.onBgPickerInput(this.value)" />';
    html += '</div>';
    html += '</div>';

    // Presets
    var presets = [
      { value: "#111111", label: "Midnight" },
      { value: "#0d0d1a", label: "Deep Space" },
      { value: "#1a1a2a", label: "Dark Violet" },
      { value: "#122a20", label: "Dark Forest" },
      { value: "#2a1212", label: "Dark Velvet" },
      { value: "#ffffff", label: "Pure White" },
      { value: "#f5f5f0", label: "Paper" },
      { value: "#e2e8f0", label: "Cool Gray" },
      { value: "#fef08a", label: "Soft Yellow" },
      { value: "#cdfe00", label: "Electric Lime" },
      { value: "#38bdf8", label: "Sky Blue" },
      { value: "#ec4899", label: "Cyber Pink" }
    ];
    html += '<div class="ds-bg-row">';
    html += '<label class="ds-bg-label">Presets</label>';
    html += '<div class="ds-bg-swatches-grid">';
    presets.forEach(function (p) {
      html += '<div class="ds-bg-swatch-item" title="' + p.label + '" style="background:' + p.value + ';" onclick="FB.design.elements.onBgPickerInput(\'' + p.value + '\')"></div>';
    });
    html += '</div>';
    html += '</div>';

    // Gradients
    var gradients = [
      { value: "linear-gradient(135deg,#0d0d1a 0%,#1a1a2a 100%)", label: "Navy Fade" },
      { value: "linear-gradient(135deg,#111111 0%,#cdfe0022 100%)", label: "Neon Fade" },
      { value: "linear-gradient(135deg,#1a1a2a 0%,#2a1a3a 100%)", label: "Purple Dark" },
      { value: "linear-gradient(135deg,#05050e 0%,#10b98122 50%,#7c3aed44 100%)", label: "Aurora" },
      { value: "linear-gradient(135deg,#ff79c6 0%,#8be9fd 100%)", label: "Cyberpunk" },
      { value: "linear-gradient(135deg,#f43f5e 0%,#f97316 100%)", label: "Sunset" }
    ];
    html += '<div class="ds-bg-row">';
    html += '<label class="ds-bg-label">Gradients</label>';
    html += '<div class="ds-bg-gradients-grid">';
    gradients.forEach(function (g) {
      html += '<div class="ds-bg-gradient-item" title="' + g.label + '" style="background:' + g.value + ';" onclick="FB.design.elements.onBgGradientClick(\'' + g.value.replace(/'/g, "\\'") + '\')"></div>';
    });
    html += '</div>';
    html += '</div>';

    // Patterns
    var activeNone = _currentPatternType === 'none' ? ' active' : '';
    var activeGrid = _currentPatternType === 'grid' ? ' active' : '';
    var activeDot = _currentPatternType === 'dot' ? ' active' : '';
    var activeNoise = _currentPatternType === 'noise' ? ' active' : '';
    var activeStripes = _currentPatternType === 'stripes' ? ' active' : '';
    html += '<div class="ds-bg-row">';
    html += '<label class="ds-bg-label">Design Patterns</label>';
    html += '<div class="ds-bg-patterns">';
    html += '<button class="ds-bg-pattern-btn' + activeNone + '" onclick="FB.design.elements.setPattern(\'none\')">None</button>';
    html += '<button class="ds-bg-pattern-btn' + activeGrid + '" onclick="FB.design.elements.setPattern(\'grid\')">Grid</button>';
    html += '<button class="ds-bg-pattern-btn' + activeDot + '" onclick="FB.design.elements.setPattern(\'dot\')">Dots</button>';
    html += '<button class="ds-bg-pattern-btn' + activeNoise + '" onclick="FB.design.elements.setPattern(\'noise\')">Noise</button>';
    html += '<button class="ds-bg-pattern-btn' + activeStripes + '" onclick="FB.design.elements.setPattern(\'stripes\')">Stripes</button>';
    html += '</div>';
    html += '</div>';

    // Pattern Opacity
    html += '<div class="ds-bg-row">';
    html += '<label class="ds-bg-label">Pattern Opacity</label>';
    html += '<div style="display:flex; align-items:center; gap:8px;">';
    html += '<input id="ds-bg-pattern-opacity" type="range" min="0" max="1" step="0.05" value="' + _currentPatternOpacity + '" style="flex:1;" oninput="FB.design.elements.changePatternOpacity(this.value)" />';
    html += '<span id="ds-bg-pattern-opacity-label" style="font-size:10px; color:#aaa; min-width:24px; text-align:right;">' + Math.round(_currentPatternOpacity * 100) + '%</span>';
    html += '</div>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  function onBgPickerInput(hex) {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    fc.setBackgroundColor(hex, function () {
      fc.renderAll();
      FB.design.history.push();
    });

    var colorPicker = document.getElementById("ds-bg-picker-color");
    if (colorPicker) colorPicker.value = FB.design.normalizeColorForInput(hex);
    var hexInput = document.getElementById("ds-bg-picker-hex");
    if (hexInput) hexInput.value = hex;

    var dsBgColor = document.getElementById("ds-bg-color");
    if (dsBgColor) dsBgColor.value = FB.design.normalizeColorForInput(hex);
    var dsBgHex = document.getElementById("ds-bg-hex");
    if (dsBgHex) dsBgHex.value = hex;
  }

  function _hex8ToRgba(c) {
    if (c.length !== 9) return c;
    var r = parseInt(c.slice(1, 3), 16);
    var g = parseInt(c.slice(3, 5), 16);
    var b = parseInt(c.slice(5, 7), 16);
    var a = Math.round(parseInt(c.slice(7, 9), 16) / 255 * 100) / 100;
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";
  }

  function onBgGradientClick(val) {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    if (val.indexOf("gradient") !== -1) {
      var colours = (val.match(/#[0-9a-fA-F]+/g) || ["#111111", "#222222"]).map(_hex8ToRgba);
      var grad = new fabric.Gradient({
        type: "linear",
        coords: { x1: 0, y1: 0, x2: fc.getWidth(), y2: fc.getHeight() },
        colorStops: [
          { offset: 0, color: colours[0] },
          { offset: 1, color: colours[colours.length - 1] }
        ]
      });
      if (colours.length >= 3) {
        grad.colorStops = [
          { offset: 0, color: colours[0] },
          { offset: 0.5, color: colours[1] },
          { offset: 1, color: colours[2] }
        ];
      }
      fc.setBackgroundColor(grad, function () {
        fc.renderAll();
        FB.design.history.push();
      });
    }
  }

  function setPattern(type) {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    _currentPatternType = type;

    document.querySelectorAll(".ds-bg-pattern-btn").forEach(function (btn) {
      var btnLabel = btn.textContent.toLowerCase();
      btn.classList.toggle("active", btnLabel === type || (type === "dot" && btnLabel === "dots"));
    });

    if (type === "none") {
      fc.setBackgroundImage(null, function () {
        fc.renderAll();
        FB.design.history.push();
      });
      return;
    }

    var dataUrl;
    if (type === "grid") {
      var canvas = document.createElement("canvas");
      canvas.width = 40;
      canvas.height = 40;
      var ctx = canvas.getContext("2d");
      ctx.strokeStyle = "rgba(255, 255, 255, " + _currentPatternOpacity + ")";
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, 40, 40);
      dataUrl = canvas.toDataURL();
    } else if (type === "dot") {
      var canvas = document.createElement("canvas");
      canvas.width = 25;
      canvas.height = 25;
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "rgba(255, 255, 255, " + Math.min(1, _currentPatternOpacity * 1.5) + ")";
      ctx.beginPath();
      ctx.arc(12, 12, 1.5, 0, Math.PI * 2);
      ctx.fill();
      dataUrl = canvas.toDataURL();
    } else if (type === "noise") {
      var canvas = document.createElement("canvas");
      canvas.width = 120;
      canvas.height = 120;
      var ctx = canvas.getContext("2d");
      var imgData = ctx.createImageData(120, 120);
      var data = imgData.data;
      for (var i = 0; i < data.length; i += 4) {
        var val = Math.floor(Math.random() * 255);
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = Math.floor(_currentPatternOpacity * 24);
      }
      ctx.putImageData(imgData, 0, 0);
      dataUrl = canvas.toDataURL();
    } else if (type === "stripes") {
      var canvas = document.createElement("canvas");
      canvas.width = 30;
      canvas.height = 30;
      var ctx = canvas.getContext("2d");
      ctx.strokeStyle = "rgba(255, 255, 255, " + _currentPatternOpacity + ")";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 30);
      ctx.lineTo(30, 0);
      ctx.stroke();
      dataUrl = canvas.toDataURL();
    }

    if (dataUrl) {
      fabric.Image.fromURL(dataUrl, function (img) {
        fc.setBackgroundImage(img, function () {
          fc.renderAll();
          FB.design.history.push();
        }, {
          repeat: "repeat"
        });
      });
    }
  }

  function changePatternOpacity(val) {
    _currentPatternOpacity = parseFloat(val);
    var label = document.getElementById("ds-bg-pattern-opacity-label");
    if (label) label.textContent = Math.round(_currentPatternOpacity * 100) + "%";
    if (_currentPatternType !== "none") {
      clearTimeout(_patternOpacityTimer);
      _patternOpacityTimer = setTimeout(function () {
        setPattern(_currentPatternType);
      }, 150);
    }
  }

  function addVeltroElement(type) {
    if (FB.design.veltroCanvas) {
      FB.design.veltroCanvas.add(type);
    }
    var select = document.getElementById("ds-veltro-effect");
    if (select) select.value = type;
    if (FB.design.library && FB.design.library.previewVeltroBlock) {
      FB.design.library.previewVeltroBlock();
    }
  }

  function _mwRect(name, left, top, width, height, fill, opts) {
    return new fabric.Rect(Object.assign({
      left: left,
      top: top,
      width: width,
      height: height,
      fill: fill,
      rx: 6,
      ry: 6,
      stroke: "transparent",
      strokeWidth: 0,
      name: name,
    }, opts || {}));
  }

  function _mwText(name, text, left, top, size, fill, opts) {
    return new fabric.IText(text, Object.assign({
      left: left,
      top: top,
      fontFamily: "Lexend",
      fontSize: size,
      fontWeight: 600,
      fill: fill,
      lineHeight: 1.12,
      styles: {},
      name: name,
    }, opts || {}));
  }

  function _mwLine(name, points, stroke, opts) {
    return new fabric.Line(points, Object.assign({
      stroke: stroke,
      strokeWidth: 2,
      name: name,
    }, opts || {}));
  }

  function _mwImageSlot(prefix, left, top, width, height, label) {
    return [
      _mwRect(prefix + " / Image slot", left, top, width, height, "#17171f", {
        stroke: "#3a3a48",
        strokeWidth: 2,
        _dsImageSlot: true,
        _dsImageSlotPrefix: prefix,
      }),
      _mwLine(prefix + " / Image cross 1", [left + 18, top + 18, left + width - 18, top + height - 18], "#3a3a48", {
        strokeDashArray: [8, 8],
      }),
      _mwLine(prefix + " / Image cross 2", [left + width - 18, top + 18, left + 18, top + height - 18], "#3a3a48", {
        strokeDashArray: [8, 8],
      }),
      _mwText(prefix + " / Image label", label || "Image", left + width / 2 - 38, top + height / 2 - 12, 18, "#8b8b96", {
        fontWeight: 700,
      }),
    ];
  }

  function _mwBullet(prefix, index, text, left, top) {
    return [
      new fabric.Circle({
        left: left,
        top: top + 5,
        radius: 8,
        fill: "#cdfe00",
        name: prefix + " / Bullet " + index + " dot",
      }),
      _mwText(prefix + " / Bullet " + index, text, left + 26, top, 18, "#f7f7f2", {
        fontWeight: 600,
      }),
    ];
  }

  function _marketingVariantLabel(type, variant) {
    var def = MARKETING_WIDGETS.filter(function (w) { return w.type === type; })[0];
    var match = def && (def.variants || []).filter(function (v) { return v[0] === variant; })[0];
    return match ? match[1] : "";
  }

  function _marketingVariantOptions(type, selected) {
    var def = MARKETING_WIDGETS.filter(function (w) { return w.type === type; })[0];
    return ((def && def.variants) || []).map(function (item) {
      return '<option value="' + FB.design._esc(item[0]) + '"' + (item[0] === selected ? " selected" : "") + ">" + FB.design._esc(item[1]) + "</option>";
    }).join("");
  }

  function _marketingCopy(type, variant) {
    var copy = {
      campaignHero: {
        saas: { accent: "#cdfe00", bg: "#101014", badge: "SaaS LAUNCH", headline: "Ship the feature\npeople remember", subhead: "Turn a product update into a clear campaign hero with CTA, proof, and crisp positioning.", cta: "Start free", trust: "Trusted by product teams shipping weekly", image: "App UI" },
        ecommerce: { accent: "#f5f5f0", bg: "#12100d", badge: "NEW DROP", headline: "A product drop\nbuilt to convert", subhead: "Showcase a premium product with a strong offer, clean CTA, and editorial campaign framing.", cta: "Shop now", trust: "Free delivery on launch orders", image: "Product" },
        event: { accent: "#7dd3fc", bg: "#0d1117", badge: "LIVE EVENT", headline: "Reserve your seat\nfor the next session", subhead: "Promote webinars, workshops, talks, or launches with a clear event-first layout.", cta: "Register", trust: "Thursday 7PM GMT · Online", image: "Speaker" },
        service: { accent: "#facc15", bg: "#111111", badge: "SERVICE OFFER", headline: "Turn attention\ninto booked calls", subhead: "Position a premium service with a clean promise, proof line, and direct consultation CTA.", cta: "Book a call", trust: "Strategy, design, and launch support", image: "Result" },
      },
      offerStack: {
        launch: { accent: "#cdfe00", urgency: "LIMITED LAUNCH OFFER", title: "Premium launch pack", oldPrice: "£499", price: "£199", period: "one-time", bullets: ["Campaign strategy canvas", "Editable launch graphics", "Social proof and offer assets", "Export-ready creative set"], guarantee: "30-day creative refresh guarantee", cta: "Claim the offer" },
        discount: { accent: "#facc15", urgency: "SAVE 40% TODAY", title: "Growth creative bundle", oldPrice: "£349", price: "£209", period: "today", bullets: ["Offer graphics", "Product spotlight cards", "Promo banners", "Social proof strips"], guarantee: "Discount ends at midnight", cta: "Get the deal" },
        premium: { accent: "#f5f5f0", urgency: "PREMIUM PACKAGE", title: "Executive campaign kit", oldPrice: "£1,200", price: "£799", period: "project", bullets: ["Premium hero creative", "High-end offer design", "Trust and proof assets", "Launch-ready exports"], guarantee: "Includes priority polish pass", cta: "Upgrade now" },
        urgent: { accent: "#fb7185", urgency: "48 HOURS ONLY", title: "Last-call launch offer", oldPrice: "£599", price: "£249", period: "expires soon", bullets: ["Urgency banner set", "CTA variations", "Proof cards", "Fast campaign graphics"], guarantee: "Limited spaces available", cta: "Secure my spot" },
      },
      socialProof: {
        quote: { accent: "#cdfe00", initial: "A", stars: "★★★★★", quote: "“This campaign helped us explain the offer clearly\nand launch with assets that looked premium.”", name: "Avery Stone", role: "Founder, Studio North", metric: "+38%", label: "conversion lift", trust: "TRUSTED BY TEAMS SHIPPING WEEKLY" },
        rating: { accent: "#facc15", initial: "M", stars: "★★★★★", quote: "“The design finally matched the quality of the product.\nCustomers understood the value instantly.”", name: "Maya Ellis", role: "Ecommerce Lead", metric: "4.9", label: "average rating", trust: "2,400+ VERIFIED CUSTOMER REVIEWS" },
        logos: { accent: "#f5f5f0", initial: "B", stars: "TRUSTED BY", quote: "ACME   NOVA   ATLAS   ORBIT   NORTH", name: "Partner network", role: "Campaign-ready trust strip", metric: "120+", label: "brand teams", trust: "AS SEEN IN LAUNCH CAMPAIGNS" },
        metric: { accent: "#7dd3fc", initial: "R", stars: "RESULT SNAPSHOT", quote: "“We used one concise proof block across our landing page,\npaid ads, and sales deck.”", name: "Riley Chen", role: "Growth Strategist", metric: "3.2x", label: "lead quality", trust: "MEASURED AFTER 30 DAYS" },
      },
      productSpotlight: {
        luxury: { accent: "#f5f5f0", bg: "#11100d", badge: "SIGNATURE", category: "LIMITED COLLECTION", name: "Atelier Creator Pack", rating: "★★★★★  4.9", price: "£149", chips: ["Premium", "Curated"], cta: "Explore collection", image: "Product Image" },
        minimal: { accent: "#cdfe00", bg: "#101014", badge: "NEW", category: "VELTRO STORE", name: "Premium Creator Pack", rating: "★★★★★  4.9", price: "£79", chips: ["Editable", "Exportable"], cta: "Shop now", image: "Product Image" },
        sale: { accent: "#fb7185", bg: "#130d10", badge: "SALE", category: "FLASH OFFER", name: "Launch Asset Bundle", rating: "★★★★★  4.8", price: "£39", chips: ["40% off", "Today"], cta: "Buy the bundle", image: "Sale Product" },
        tech: { accent: "#7dd3fc", bg: "#0d1117", badge: "PRO", category: "DIGITAL PRODUCT", name: "Automation Toolkit", rating: "★★★★★  5.0", price: "£129", chips: ["Fast", "Scalable"], cta: "View specs", image: "Interface" },
      },
      announcementBanner: {
        launch: { accent: "#cdfe00", bg: "#101014", label: "NEW", headline: "The launch campaign is live", copy: "Announce product drops, limited spaces, sales, or feature releases with editable campaign creative.", cta: "View offer" },
        sale: { accent: "#fb7185", bg: "#130d10", label: "SALE", headline: "Flash sale ends tonight", copy: "Use this banner for seasonal promos, discount campaigns, and high-urgency ecommerce announcements.", cta: "Shop sale" },
        feature: { accent: "#7dd3fc", bg: "#0d1117", label: "FEATURE", headline: "A sharper workflow just shipped", copy: "Spotlight new product features, updates, releases, or platform improvements with one clear message.", cta: "See update" },
        limited: { accent: "#facc15", bg: "#111111", label: "LIMITED", headline: "Only a few spaces remain", copy: "Promote cohorts, consultations, events, and limited service capacity with a clean urgency banner.", cta: "Reserve now" },
      },
    };
    var set = copy[type] || {};
    return set[variant] || set[Object.keys(set)[0]] || {};
  }

  function _buildCampaignHero(fc, variant) {
    var c = _marketingCopy("campaignHero", variant);
    var o = [
      _mwRect("Campaign Hero / Background", 0, 0, 900, 430, c.bg || "#101014"),
      _mwRect("Campaign Hero / Accent wash", 610, 24, 250, 250, (c.accent || "#cdfe00") + "1f", {
        rx: 8,
        ry: 8,
      }),
      _mwRect("Campaign Hero / Badge bg", 56, 54, 176, 34, c.accent || "#cdfe00"),
      _mwText("Campaign Hero / Badge", c.badge || "NEW CAMPAIGN", 76, 63, 14, "#111111", {
        fontWeight: 800,
      }),
      _mwText("Campaign Hero / Headline", c.headline || "Launch-ready\nmarketing creative", 56, 116, 56, "#ffffff", {
        fontWeight: 850,
      }),
      _mwText("Campaign Hero / Subhead", c.subhead || "Build a polished campaign hero with editable copy,\nCTA, trust signal, and product placement.", 58, 250, 22, "#a7a7ad", {
        fontWeight: 500,
      }),
      _mwRect("Campaign Hero / CTA bg", 58, 332, 170, 48, c.accent || "#cdfe00"),
      _mwText("Campaign Hero / CTA", c.cta || "Get Started", 88, 346, 18, "#111111", {
        fontWeight: 800,
      }),
      _mwText("Campaign Hero / Trust line", c.trust || "Trusted by 2,000+ growing teams", 252, 346, 18, "#d8d8d2", {
        fontWeight: 600,
      }),
    ];
    return o.concat(_mwImageSlot("Campaign Hero", 610, 96, 230, 240, c.image || "Product"));
  }

  function _buildOfferStack(fc, variant) {
    var c = _marketingCopy("offerStack", variant);
    var o = [
      _mwRect("Offer Stack / Card", 0, 0, 430, 560, "#101014", {
        stroke: "#2d2d35",
        strokeWidth: 2,
      }),
      _mwRect("Offer Stack / Urgency bg", 32, 30, 210, 34, c.accent || "#cdfe00"),
      _mwText("Offer Stack / Urgency", c.urgency || "LIMITED LAUNCH OFFER", 48, 39, 13, "#111111", {
        fontWeight: 850,
      }),
      _mwText("Offer Stack / Title", c.title || "Premium launch pack", 32, 94, 34, "#ffffff", {
        fontWeight: 850,
      }),
      _mwText("Offer Stack / Old price", c.oldPrice || "£499", 34, 158, 24, "#777780", {
        fontWeight: 600,
        linethrough: true,
      }),
      _mwText("Offer Stack / Price", c.price || "£199", 112, 140, 62, c.accent || "#cdfe00", {
        fontWeight: 900,
      }),
      _mwText("Offer Stack / Period", c.period || "one-time", 300, 170, 18, "#a7a7ad", {
        fontWeight: 600,
      }),
    ];
    (c.bullets || []).forEach(function (text, i) {
      o = o.concat(_mwBullet("Offer Stack", i + 1, text, 36, 238 + i * 42));
    });
    o.push(
      _mwRect("Offer Stack / Guarantee bg", 32, 420, 366, 44, "#181820", {
        stroke: "#303038",
        strokeWidth: 1,
      }),
      _mwText("Offer Stack / Guarantee", c.guarantee || "30-day creative refresh guarantee", 54, 434, 17, "#f7f7f2", {
        fontWeight: 700,
      }),
      _mwRect("Offer Stack / CTA bg", 32, 488, 366, 48, c.accent || "#cdfe00"),
      _mwText("Offer Stack / CTA", c.cta || "Claim the offer", 142, 502, 18, "#111111", {
        fontWeight: 850,
      })
    );
    return o;
  }

  function _buildSocialProof(fc, variant) {
    var c = _marketingCopy("socialProof", variant);
    return [
      _mwRect("Social Proof / Strip bg", 0, 0, 820, 220, "#101014", {
        stroke: "#2d2d35",
        strokeWidth: 2,
      }),
      new fabric.Circle({ left: 44, top: 54, radius: 42, fill: c.accent || "#cdfe00", name: "Social Proof / Avatar bg" }),
      _mwText("Social Proof / Avatar initial", c.initial || "A", 72, 72, 36, "#111111", {
        fontWeight: 900,
      }),
      _mwText("Social Proof / Stars", c.stars || "★★★★★", 134, 44, 24, c.accent || "#cdfe00", {
        fontWeight: 800,
      }),
      _mwText("Social Proof / Quote", c.quote || "“This campaign helped us explain the offer clearly\nand launch with assets that looked premium.”", 134, 82, 28, "#ffffff", {
        fontWeight: 700,
      }),
      _mwText("Social Proof / Name", c.name || "Avery Stone", 136, 162, 18, "#f7f7f2", {
        fontWeight: 800,
      }),
      _mwText("Social Proof / Role", c.role || "Founder, Studio North", 260, 162, 18, "#8f8f98", {
        fontWeight: 600,
      }),
      _mwRect("Social Proof / Metric pill bg", 620, 58, 150, 88, "#181820", {
        stroke: "#303038",
        strokeWidth: 1,
      }),
      _mwText("Social Proof / Metric", c.metric || "+38%", 648, 76, 36, c.accent || "#cdfe00", {
        fontWeight: 900,
      }),
      _mwText("Social Proof / Metric label", c.label || "conversion lift", 648, 120, 16, "#a7a7ad", {
        fontWeight: 700,
      }),
      _mwText("Social Proof / Trust label", c.trust || "TRUSTED BY TEAMS SHIPPING WEEKLY", 528, 176, 13, "#74747c", {
        fontWeight: 800,
      }),
    ];
  }

  function _buildProductSpotlight(fc, variant) {
    var c = _marketingCopy("productSpotlight", variant);
    var o = [
      _mwRect("Product Spotlight / Card", 0, 0, 470, 620, c.bg || "#101014", {
        stroke: "#2d2d35",
        strokeWidth: 2,
      }),
      _mwRect("Product Spotlight / Badge bg", 32, 32, 104, 32, c.accent || "#cdfe00"),
      _mwText("Product Spotlight / Badge", c.badge || "BESTSELLER", 48, 41, 13, "#111111", {
        fontWeight: 850,
      }),
    ].concat(_mwImageSlot("Product Spotlight", 32, 84, 406, 270, c.image || "Product Image"));
    o.push(
      _mwText("Product Spotlight / Category", c.category || "VELTRO STORE", 32, 386, 13, c.accent || "#cdfe00", {
        fontWeight: 850,
      }),
      _mwText("Product Spotlight / Name", c.name || "Premium Creator Pack", 32, 412, 34, "#ffffff", {
        fontWeight: 850,
      }),
      _mwText("Product Spotlight / Rating", c.rating || "★★★★★  4.9", 32, 466, 18, c.accent || "#cdfe00", {
        fontWeight: 750,
      }),
      _mwText("Product Spotlight / Price", c.price || "£79", 32, 500, 44, "#ffffff", {
        fontWeight: 900,
      }),
      _mwRect("Product Spotlight / Chip 1 bg", 128, 506, 94, 30, "#181820"),
      _mwText("Product Spotlight / Chip 1", (c.chips || ["Editable", "Exportable"])[0], 148, 514, 13, "#d8d8d2", {
        fontWeight: 700,
      }),
      _mwRect("Product Spotlight / Chip 2 bg", 236, 506, 100, 30, "#181820"),
      _mwText("Product Spotlight / Chip 2", (c.chips || ["Editable", "Exportable"])[1], 252, 514, 13, "#d8d8d2", {
        fontWeight: 700,
      }),
      _mwRect("Product Spotlight / CTA bg", 32, 556, 406, 44, c.accent || "#cdfe00"),
      _mwText("Product Spotlight / CTA", c.cta || "Shop now", 190, 568, 18, "#111111", {
        fontWeight: 850,
      })
    );
    return o;
  }

  function _buildAnnouncementBanner(fc, variant) {
    var c = _marketingCopy("announcementBanner", variant);
    return [
      _mwRect("Announcement Banner / Background", 0, 0, 900, 210, c.bg || "#101014", {
        stroke: "#2d2d35",
        strokeWidth: 2,
      }),
      _mwRect("Announcement Banner / Accent bar", 0, 0, 12, 210, c.accent || "#cdfe00", {
        rx: 0,
        ry: 0,
      }),
      _mwRect("Announcement Banner / Label bg", 44, 34, 112, 32, c.accent || "#cdfe00"),
      _mwText("Announcement Banner / Label", c.label || "NEW", 80, 43, 13, "#111111", {
        fontWeight: 900,
      }),
      _mwText("Announcement Banner / Headline", c.headline || "The launch campaign is live", 44, 88, 42, "#ffffff", {
        fontWeight: 850,
      }),
      _mwText("Announcement Banner / Copy", c.copy || "Announce product drops, limited spaces, sales, or feature releases with editable campaign creative.", 46, 146, 18, "#a7a7ad", {
        fontWeight: 600,
      }),
      _mwRect("Announcement Banner / CTA bg", 706, 78, 146, 48, c.accent || "#cdfe00"),
      _mwText("Announcement Banner / CTA", c.cta || "View offer", 738, 92, 18, "#111111", {
        fontWeight: 850,
      }),
      new fabric.Polygon([{ x: 0, y: 0 }, { x: 54, y: 0 }, { x: 27, y: 46 }], {
        left: 812,
        top: 144,
        fill: (c.accent || "#cdfe00") + "26",
        name: "Announcement Banner / Accent triangle",
      }),
    ];
  }

  var MARKETING_BUILDERS = {
    campaignHero: _buildCampaignHero,
    offerStack: _buildOfferStack,
    socialProof: _buildSocialProof,
    productSpotlight: _buildProductSpotlight,
    announcementBanner: _buildAnnouncementBanner,
  };

  function _createMarketingGroup(type, variant) {
    var def = MARKETING_WIDGETS.filter(function (w) { return w.type === type; })[0];
    var builder = MARKETING_BUILDERS[type];
    if (!def || !builder) return null;
    variant = variant || ((def.variants && def.variants[0] && def.variants[0][0]) || "default");
    var objects = builder(FB.design.canvas.get(), variant);
    var variantLabel = _marketingVariantLabel(type, variant);
    var group = new fabric.Group(objects, {
      name: variantLabel ? def.label + " - " + variantLabel : def.label,
      left: 0,
      top: 0,
      _dsMarketingWidget: true,
      _dsMarketingType: type,
      _dsMarketingVariant: variant,
    });
    var slotIdBase = "ds-img-slot-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
    (group._objects || []).forEach(function (child, index) {
      if (child && child._dsImageSlot) {
        child._dsImageSlotId = slotIdBase + "-" + index;
      }
    });
    return group;
  }

  function addMarketingWidget(type, variant) {
    var fc = FB.design.canvas.get();
    var group = _createMarketingGroup(type, variant);
    if (!fc || !group) return;
    var maxW = Math.max(160, fc.getWidth() * 0.88);
    var maxH = Math.max(120, fc.getHeight() * 0.78);
    var scale = Math.min(1, maxW / group.getScaledWidth(), maxH / group.getScaledHeight());
    group.set({
      scaleX: scale,
      scaleY: scale,
      left: fc.getWidth() / 2 - (group.width * scale) / 2,
      top: fc.getHeight() / 2 - (group.height * scale) / 2,
    });
    group.setCoords();
    fc.add(group);
    fc.setActiveObject(group);
    fc.renderAll();
    FB.design.tools.setTool("select");
    if (FB.design.layers) FB.design.layers.render();
    if (FB.design.props) FB.design.props.render();
    FB.design.history.push();
  }

  function regenerateMarketingWidget(obj, variant) {
    var fc = FB.design.canvas.get();
    if (!fc || !obj || !obj._dsMarketingWidget) return;
    var type = obj._dsMarketingType;
    var group = _createMarketingGroup(type, variant);
    if (!group) return;
    var oldSlotIds = (obj._objects || []).filter(function (child) {
      return child && child._dsImageSlot && child._dsImageSlotId;
    }).map(function (child) {
      return child._dsImageSlotId;
    });
    var idx = fc.getObjects().indexOf(obj);
    group.set({
      left: obj.left,
      top: obj.top,
      scaleX: obj.scaleX,
      scaleY: obj.scaleY,
      angle: obj.angle,
      opacity: obj.opacity == null ? 1 : obj.opacity,
      flipX: !!obj.flipX,
      flipY: !!obj.flipY,
    });
    fc.getObjects().slice().forEach(function (item) {
      if (item._dsSlotImage && oldSlotIds.indexOf(item._dsSlotImageFor) !== -1) fc.remove(item);
    });
    fc.remove(obj);
    fc.add(group);
    if (idx >= 0) fc.moveTo(group, idx);
    group.setCoords();
    fc.setActiveObject(group);
    fc.renderAll();
    if (FB.design.layers) FB.design.layers.render();
    if (FB.design.props) FB.design.props.render();
    FB.design.history.push();
  }

  function _imageSlotRectFor(obj) {
    if (!obj) return null;
    if (obj._dsImageSlot) return obj;
    if (obj.type === "group" && obj._objects) {
      return obj._objects.filter(function (child) {
        return child && child._dsImageSlot;
      })[0] || null;
    }
    return null;
  }

  function imageSlotFor(obj) {
    var slot = _imageSlotRectFor(obj);
    if (slot && !slot._dsImageSlotId) {
      slot._dsImageSlotId = "ds-img-slot-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
    }
    return slot;
  }

  function _marketingSlotBounds(slot) {
    slot.setCoords();
    var matrix = slot.calcTransformMatrix();
    var points = [
      new fabric.Point(0, 0),
      new fabric.Point(slot.width || 1, 0),
      new fabric.Point(slot.width || 1, slot.height || 1),
      new fabric.Point(0, slot.height || 1),
    ].map(function (point) {
      return fabric.util.transformPoint(point, matrix);
    });
    var xs = points.map(function (point) { return point.x; });
    var ys = points.map(function (point) { return point.y; });
    return {
      left: Math.min.apply(Math, xs),
      top: Math.min.apply(Math, ys),
      width: Math.max(1, Math.max.apply(Math, xs) - Math.min.apply(Math, xs)),
      height: Math.max(1, Math.max.apply(Math, ys) - Math.min.apply(Math, ys)),
    };
  }

  function _fitPresetImageToSlot(img, slot) {
    var bounds = _marketingSlotBounds(slot);
    var imageEl = img.getElement ? img.getElement() : null;
    var intrinsicW = img.width || (imageEl && (imageEl.naturalWidth || imageEl.width)) || bounds.width;
    var intrinsicH = img.height || (imageEl && (imageEl.naturalHeight || imageEl.height)) || bounds.height;
    var scale = Math.max(bounds.width / intrinsicW, bounds.height / intrinsicH);
    img.set({
      width: intrinsicW,
      height: intrinsicH,
      left: bounds.left + (bounds.width - intrinsicW * scale) / 2,
      top: bounds.top + (bounds.height - intrinsicH * scale) / 2,
      originX: "left",
      originY: "top",
      scaleX: scale,
      scaleY: scale,
      clipPath: new fabric.Rect({
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
        absolutePositioned: true,
      }),
    });
    img.setCoords();
  }

  function saveMarketingPreset() {
    var fc = FB.design.canvas.get();
    var group = fc && fc.getActiveObject();
    if (!fc || !group || !group._dsMarketingWidget || group.type !== "group") {
      if (FB.util && FB.util.showToast) FB.util.showToast("Select a marketing widget first");
      return;
    }
    var name = prompt("Save marketing preset as:", group.name || "Marketing Preset");
    if (!name) return;
    var slotIds = (group._objects || []).filter(function (child) {
      return child && child._dsImageSlot && child._dsImageSlotId;
    }).map(function (child) {
      return child._dsImageSlotId;
    });
    var images = fc.getObjects().filter(function (obj) {
      return obj && obj._dsSlotImage && slotIds.indexOf(obj._dsSlotImageFor) !== -1;
    }).map(function (obj) {
      return obj.toObject(MARKETING_SERIAL_PROPS);
    });
    var list = _marketingPresets();
    list.unshift({
      id: "mwp-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      name: name,
      type: group._dsMarketingType || "custom",
      variant: group._dsMarketingVariant || "custom",
      created: new Date().toISOString(),
      group: group.toObject(MARKETING_SERIAL_PROPS),
      images: images,
    });
    _setMarketingPresets(list.slice(0, 40));
    render();
    if (FB.util && FB.util.showToast) FB.util.showToast("Saved marketing preset: " + name);
  }

  function addMarketingPreset(id) {
    var fc = FB.design.canvas.get();
    var preset = _marketingPresets().filter(function (p) { return p.id === id; })[0];
    if (!fc || !preset || !preset.group) return;
    fabric.util.enlivenObjects([preset.group], function (groups) {
      var group = groups && groups[0];
      if (!group) return;
      var idMap = {};
      var slotIdBase = "ds-img-slot-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
      (group._objects || []).forEach(function (child, index) {
        if (child && child._dsImageSlot) {
          var oldId = child._dsImageSlotId;
          var newId = slotIdBase + "-" + index;
          if (oldId) idMap[oldId] = newId;
          child._dsImageSlotId = newId;
        }
      });
      group.set({
        left: fc.getWidth() / 2 - group.getScaledWidth() / 2,
        top: fc.getHeight() / 2 - group.getScaledHeight() / 2,
        _dsMarketingWidget: true,
        _dsMarketingType: preset.type || group._dsMarketingType || "custom",
        _dsMarketingVariant: preset.variant || group._dsMarketingVariant || "custom",
        name: preset.name || group.name || "Marketing Preset",
      });
      group.setCoords();
      fc.add(group);
      fc.setActiveObject(group);
      var imageObjects = preset.images || [];
      if (!imageObjects.length) {
        fc.renderAll();
        FB.design.tools.setTool("select");
        if (FB.design.layers) FB.design.layers.render();
        if (FB.design.props) FB.design.props.render();
        FB.design.history.push();
        return;
      }
      fabric.util.enlivenObjects(imageObjects, function (images) {
        images.forEach(function (img) {
          var newSlotId = idMap[img._dsSlotImageFor];
          var slot = (group._objects || []).filter(function (child) {
            return child && child._dsImageSlotId === newSlotId;
          })[0];
          if (!newSlotId || !slot) return;
          img.set({
            _dsSlotImage: true,
            _dsSlotImageFor: newSlotId,
            name: (slot._dsImageSlotPrefix || "Marketing") + " / Image",
          });
          _fitPresetImageToSlot(img, slot);
          fc.add(img);
          var groupIndex = fc.getObjects().indexOf(group);
          if (groupIndex >= 0) fc.moveTo(img, groupIndex + 1);
        });
        fc.setActiveObject(group);
        fc.renderAll();
        FB.design.tools.setTool("select");
        if (FB.design.layers) FB.design.layers.render();
        if (FB.design.props) FB.design.props.render();
        FB.design.history.push();
      });
    });
  }

  function deleteMarketingPreset(id) {
    var list = _marketingPresets().filter(function (p) {
      return p.id !== id;
    });
    _setMarketingPresets(list);
    render();
  }

  // Keep the old fabric-only path here as a dead stub (won't be called)
  function _addVeltroElementToCanvas(type) {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var cx = fc.getWidth() / 2;
    var cy = fc.getHeight() / 2;

    if (type === "kinetic-text") {
      var txt = new fabric.IText("KINETIC TEXT", {
        left: cx - 150,
        top: cy - 25,
        fontFamily: "Lexend",
        fontSize: 48,
        fontWeight: 800,
        fill: "#cdfe00",
        name: "Kinetic Text",
        _veltroType: "kineticText"
      });
      fc.add(txt);
      fc.setActiveObject(txt);
      fc.renderAll();
      FB.design.history.push();
    } else if (type === "text-scramble") {
      var txt = new fabric.IText("DECODE ME", {
        left: cx - 120,
        top: cy - 20,
        fontFamily: "monospace",
        fontSize: 40,
        fontWeight: 600,
        fill: "#ff79c6",
        name: "Text Scramble",
        _veltroType: "textScramble"
      });
      fc.add(txt);
      fc.setActiveObject(txt);
      fc.renderAll();
      FB.design.history.push();
    } else if (type === "typewriter-reveal") {
      var txt = new fabric.IText("Typewriter Text", {
        left: cx - 110,
        top: cy - 16,
        fontFamily: "Lexend",
        fontSize: 32,
        fontWeight: 400,
        fill: "#50fa7b",
        name: "Typewriter Reveal",
        _veltroType: "typewriterReveal"
      });
      fc.add(txt);
      fc.setActiveObject(txt);
      fc.renderAll();
      FB.design.history.push();
    } else if (type === "physics-sandbox") {
      var bgRect = new fabric.Rect({
        width: 180,
        height: 120,
        fill: "rgba(26,26,42,0.6)",
        stroke: "#cdfe00",
        strokeWidth: 2,
        rx: 8,
        ry: 8
      });
      var circle1 = new fabric.Circle({ radius: 10, fill: "#38bdf8", left: 30, top: 40 });
      var circle2 = new fabric.Circle({ radius: 15, fill: "#ec4899", left: 120, top: 20 });
      var rect1 = new fabric.Rect({ width: 25, height: 25, fill: "#ffb86c", left: 80, top: 60, angle: 15 });
      var text = new fabric.IText("◈ Physics Sandbox", {
        fontSize: 12,
        fontFamily: "Lexend",
        fill: "#ffffff",
        fontWeight: 600,
        left: 30,
        top: 95
      });
      var group = new fabric.Group([bgRect, circle1, circle2, rect1, text], {
        left: cx - 90,
        top: cy - 60,
        name: "Physics Sandbox",
        _veltroType: "kineticText"
      });
      fc.add(group);
      fc.setActiveObject(group);
      fc.renderAll();
      FB.design.history.push();
    } else if (type === "holographic-card") {
      var bgRect = new fabric.Rect({
        width: 160,
        height: 220,
        fill: "rgba(255,255,255,0.08)",
        stroke: "rgba(255, 255, 255, 0.25)",
        strokeWidth: 1,
        rx: 12,
        ry: 12
      });
      var gradShine = new fabric.Polygon([
        { x: 0, y: 0 }, { x: 80, y: 0 }, { x: 160, y: 220 }, { x: 80, y: 220 }
      ], {
        fill: new fabric.Gradient({
          type: "linear",
          coords: { x1: 0, y1: 0, x2: 160, y2: 220 },
          colorStops: [
            { offset: 0, color: "rgba(139, 92, 246, 0.4)" },
            { offset: 0.5, color: "rgba(236, 72, 153, 0.2)" },
            { offset: 1, color: "rgba(56, 189, 248, 0.4)" }
          ]
        }),
        left: 0,
        top: 0
      });
      var spark = new fabric.IText("✦", { fontSize: 24, fill: "#fff", left: 68, top: 40 });
      var label = new fabric.IText("Holographic Card", {
        fontSize: 11,
        fontFamily: "Lexend",
        fill: "#fff",
        fontWeight: 600,
        textAlign: "center",
        left: 28,
        top: 170
      });
      var group = new fabric.Group([bgRect, gradShine, spark, label], {
        left: cx - 80,
        top: cy - 110,
        name: "Holographic Card",
        _veltroType: "holographicCard"
      });
      fc.add(group);
      fc.setActiveObject(group);
      fc.renderAll();
      FB.design.history.push();
    } else if (type === "tilt-card-3d") {
      var bgRect = new fabric.Rect({
        width: 170,
        height: 110,
        fill: "rgba(15, 15, 28, 0.8)",
        stroke: "#38bdf8",
        strokeWidth: 1.5,
        rx: 8,
        ry: 8
      });
      var text = new fabric.IText("Perspective Tilt", {
        fontSize: 10,
        fontFamily: "Lexend",
        fill: "#aaa",
        left: 45,
        top: 30
      });
      var title = new fabric.IText("3D Tilt Card", {
        fontSize: 14,
        fontFamily: "Lexend",
        fill: "#fff",
        fontWeight: 700,
        left: 40,
        top: 50
      });
      var group = new fabric.Group([bgRect, text, title], {
        left: cx - 85,
        top: cy - 55,
        skewX: -5,
        skewY: 3,
        name: "Tilt Card 3D",
        _veltroType: "tiltCard3d"
      });
      fc.add(group);
      fc.setActiveObject(group);
      fc.renderAll();
      FB.design.history.push();
    } else if (type === "aurora-bg") {
      onBgGradientClick("linear-gradient(135deg, #0d0d1a 0%, #10b98122 50%, #7c3aed44 100%)");
      fc._veltroType = "auroraBorealis";
    } else if (type === "nebula-bg") {
      onBgGradientClick("linear-gradient(135deg, #05050e 0%, #1a1a2a 100%)");
      setPattern("dot");
      fc._veltroType = "particleNebula";
    }
  }

  function _onIconSearch(q) {
    _iconQuery = q;
    _renderElementsBody();
    var inp = document.getElementById("ds-icon-search");
    if (inp) {
      inp.focus();
      inp.setSelectionRange(q.length, q.length);
    }
  }

  function addShape(type) {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var cx = fc.getWidth() / 2,
      cy = fc.getHeight() / 2;
    var defaults = {
      left: cx - 60,
      top: cy - 40,
      fill: "#4a90e2",
      stroke: "transparent",
      strokeWidth: 0,
      originX: "left",
      originY: "top",
    };
    var obj;
    if (type === "rect")
      obj = new fabric.Rect(
        Object.assign({ width: 120, height: 80, name: "Rectangle" }, defaults),
      );
    if (type === "rect-r")
      obj = new fabric.Rect(
        Object.assign(
          { width: 120, height: 80, rx: 12, ry: 12, name: "Rounded Rect" },
          defaults,
        ),
      );
    if (type === "circle")
      obj = new fabric.Ellipse(
        Object.assign({ rx: 60, ry: 40, name: "Circle" }, defaults),
      );
    if (type === "tri")
      obj = new fabric.Triangle(
        Object.assign({ width: 120, height: 100, name: "Triangle" }, defaults),
      );
    if (type === "poly")
      obj = new fabric.Polygon(
        [
          { x: 0, y: 50 },
          { x: 50, y: 0 },
          { x: 100, y: 50 },
          { x: 75, y: 100 },
          { x: 25, y: 100 },
        ],
        Object.assign({ name: "Polygon" }, defaults),
      );
    if (type === "star")
      obj = new fabric.Polygon(
        _starPoints(5, 60, 30),
        Object.assign({ left: cx - 60, top: cy - 60, name: "Star" }, defaults),
      );
    if (type === "line")
      obj = new fabric.Line([cx - 60, cy, cx + 60, cy], {
        stroke: "#4a90e2",
        strokeWidth: 3,
        name: "Line",
      });
    if (type === "arrow") {
      obj = new fabric.Line([cx - 60, cy, cx + 60, cy], {
        stroke: "#4a90e2",
        strokeWidth: 3,
        name: "Arrow",
      });
      obj._isArrow = true;
    }
    if (type === "dashed")
      obj = new fabric.Line([cx - 60, cy, cx + 60, cy], {
        stroke: "#4a90e2",
        strokeWidth: 3,
        strokeDashArray: [10, 6],
        name: "Dashed Line",
      });
    if (type === "heart")
      obj = new fabric.IText("♡", {
        left: cx - 20,
        top: cy - 20,
        fontSize: 80,
        fill: "#e74c3c",
        fontFamily: "Lexend",
        name: "Heart",
        styles: {},
      });
    if (!obj) return;
    fc.add(obj);
    fc.setActiveObject(obj);
    fc.renderAll();
    FB.design.tools.setTool("select");
  }

  function _starPoints(n, outerR, innerR) {
    var pts = [],
      step = Math.PI / n;
    for (var i = 0; i < 2 * n; i++) {
      var r = i % 2 === 0 ? outerR : innerR;
      var a = i * step - Math.PI / 2;
      pts.push({ x: r * Math.cos(a) + outerR, y: r * Math.sin(a) + outerR });
    }
    return pts;
  }

  function addTextPreset(id) {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var preset = TEXT_PRESETS.filter(function (p) {
      return p.id === id;
    })[0];
    if (!preset) return;
    var txt = new fabric.IText(preset.label, {
      left: fc.getWidth() / 2 - 150,
      top: fc.getHeight() / 2 - preset.fontSize / 2,
      fontFamily: "Lexend",
      fontSize: preset.fontSize,
      fontWeight: preset.fontWeight,
      fill: preset.fill,
      name: preset.id.charAt(0).toUpperCase() + preset.id.slice(1),
      styles: {},
    });
    fc.add(txt);
    fc.setActiveObject(txt);
    fc.renderAll();
    FB.design.tools.setTool("select");
  }

  function addIcon(char, name) {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var ic = new fabric.IText(char, {
      left: fc.getWidth() / 2 - 30,
      top: fc.getHeight() / 2 - 30,
      fontSize: 60,
      fill: "#ffffff",
      fontFamily: "Lexend",
      name: name || "Icon",
      styles: {},
    });
    fc.add(ic);
    fc.setActiveObject(ic);
    fc.renderAll();
    FB.design.tools.setTool("select");
  }

  function setBackground(value) {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    if (value.indexOf("gradient") !== -1) {
      var colours = value.match(/#[0-9a-fA-F]+/g) || ["#111111", "#222222"];
      var grad = new fabric.Gradient({
        type: "linear",
        coords: { x1: 0, y1: 0, x2: fc.getWidth(), y2: fc.getHeight() },
        colorStops: [
          { offset: 0, color: colours[0] },
          { offset: 1, color: colours[colours.length - 1] },
        ],
      });
      fc.setBackgroundColor(grad, function () {
        fc.renderAll();
        FB.design.history.push();
      });
    } else {
      fc.setBackgroundColor(value, function () {
        fc.renderAll();
        FB.design.history.push();
      });
    }
  }

  return {
    render: render,
    addShape: addShape,
    addTextPreset: addTextPreset,
    addIcon: addIcon,
    setBackground: setBackground,
    _onIconSearch: _onIconSearch,
    _renderToolRow: _renderToolRow,
    toggleAccordion: toggleAccordion,
    onBgPickerInput: onBgPickerInput,
    onBgGradientClick: onBgGradientClick,
    setPattern: setPattern,
    changePatternOpacity: changePatternOpacity,
    addMarketingWidget: addMarketingWidget,
    saveMarketingPreset: saveMarketingPreset,
    addMarketingPreset: addMarketingPreset,
    deleteMarketingPreset: deleteMarketingPreset,
    regenerateMarketingWidget: regenerateMarketingWidget,
    addVeltroElement: addVeltroElement,
    imageSlotFor: imageSlotFor,
    setVeltroQuery: setVeltroQuery,
    setVeltroCategory: setVeltroCategory,
    _veltroOptions: _veltroOptions,
    _marketingVariantOptions: _marketingVariantOptions
  };
})();

FB.design.history = (function () {
  var _stack = [];
  var _future = [];
  var _paused = false;

  function push() {
    if (_paused) return;
    var fc = FB.design.canvas.get();
    if (!fc) return;
    _stack.push(JSON.stringify(fc.toJSON(["id", "name", "motion", "_veltroWidget", "_veltroId", "_veltroProps", "_dsImageSlot", "_dsImageSlotPrefix", "_dsImageSlotId", "_dsSlotImage", "_dsSlotImageFor", "_dsMarketingWidget", "_dsMarketingType", "_dsMarketingVariant"])));
    if (_stack.length > 50) _stack.shift();
    _future = [];
  }

  function undo() {
    var fc = FB.design.canvas.get();
    if (!fc || _stack.length < 2) return;
    _future.push(_stack.pop());
    _paused = true;
    fc.loadFromJSON(JSON.parse(_stack[_stack.length - 1]), function () {
      fc.renderAll();
      if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
      FB.design.layers.render();
      FB.design.props.render();
      _paused = false;
    });
  }

  function redo() {
    var fc = FB.design.canvas.get();
    if (!fc || !_future.length) return;
    var state = _future.pop();
    _stack.push(state);
    _paused = true;
    fc.loadFromJSON(JSON.parse(state), function () {
      fc.renderAll();
      if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
      FB.design.layers.render();
      FB.design.props.render();
      _paused = false;
    });
  }

  function silent(fn) {
    _paused = true;
    try {
      fn();
    } finally {
      _paused = false;
    }
  }

  return { push: push, undo: undo, redo: redo, silent: silent };
})();

FB.design.veltroCanvas = (function () {
  function layer() {
    return document.getElementById("ds-veltro-canvas-layer");
  }

  function widgetPropsFor(type, obj) {
    var fc = FB.design.canvas.get();
    var tokens = FB.design.library && FB.design.library._collectDesignTokens
      ? FB.design.library._collectDesignTokens(fc)
      : { bg: "#0d0d1a", primary: "#cdfe00", secondary: "#3b82f6", accent: "#ec4899", words: ["Veltro"], title: "Veltro", height: 400, width: 800 };
    var props = FB.design.library && FB.design.library._veltroPropsFor
      ? FB.design.library._veltroPropsFor(type, tokens)
      : {};
    props = Object.assign({}, props, obj._veltroProps || {});
    props.height = Math.max(80, Math.round(obj.getScaledHeight()));
    return props;
  }

  function isTextWidget(type) {
    return /text|type|scramble|counter|word|wave/i.test(String(type || ""));
  }

  function renderDesignWidget(type, props, id) {
    var textOffsetStyle = "";
    if (isTextWidget(type)) {
      var textX = +(props.textX || 0);
      var textY = +(props.textY || 0);
      textOffsetStyle =
        '<style>[data-veltro-object="' +
        FB.design._esc(id) +
        '"] .veltro-scramble-text,[data-veltro-object="' +
        FB.design._esc(id) +
        '"] .veltro-typewriter,[data-veltro-object="' +
        FB.design._esc(id) +
        '"] .veltro-textmask-text,[data-veltro-object="' +
        FB.design._esc(id) +
        '"] .veltro-liquid-text,[data-veltro-object="' +
        FB.design._esc(id) +
        '"] .veltro-wave-content,[data-veltro-object="' +
        FB.design._esc(id) +
        '"] .veltro-morph-content,[data-veltro-object="' +
        FB.design._esc(id) +
        '"] .veltro-ks-text,[data-veltro-object="' +
        FB.design._esc(id) +
        '"] .veltro-magtext-content{position:relative!important;left:' +
        textX +
        "%!important;top:" +
        textY +
        "%!important;}</style>";
    }
    if (type === "kineticText") {
      var text = FB.design._esc(props.text || props.title || "MOVE CLOSER");
      var color = FB.design._esc(props.color || props.textColor || props.color1 || "#cdfe00");
      var bg = FB.design._esc(props.bg || props.bgColor || "transparent");
      var fontSize = +(props.size || props.fontSize || 64);
      var weight = +(props.weight || props.fontWeight || 800);
      var spacing = +(props.letterSpacing || 0);
      var textX = +(props.textX || 0);
      var textY = +(props.textY || 0);
      return (
        textOffsetStyle +
        '<div class="fw-widget fw-widget-kineticText ds-live-kinetic-text" id="kinetic-' +
        FB.design._esc(id) +
        '" style="height:100%;width:100%;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:' +
        (props.borderRadius || 8) +
        "px;background:" +
        bg +
        '">' +
        '<div style="font-family:' +
        FB.design._esc(props.fontFamily || "Lexend") +
        ',sans-serif;font-size:' +
        fontSize +
        "px;font-weight:" +
        weight +
        ";line-height:1.05;letter-spacing:" +
        spacing +
        "px;color:" +
        color +
        ';text-align:center;text-transform:' +
        FB.design._esc(props.textTransform || "none") +
        ';position:relative;left:' +
        textX +
        "%;top:" +
        textY +
        '%;animation:ds-kinetic-live 2.4s ease-in-out infinite alternate;filter:drop-shadow(0 0 12px rgba(205,254,0,.18));">' +
        text +
        "</div></div>"
      );
    }
    if (FB.widgets && FB.widgets.get && FB.widgets.get(type)) {
      return (
        textOffsetStyle +
        '<div class="fw-widget fw-widget-' +
        FB.design._esc(type) +
        '">' +
        FB.widgets.render(type, Object.assign({}, props, { _blockId: id })) +
        "</div>"
      );
    }
    return "";
  }

  function renderObject(obj) {
    var host = layer();
    if (!host || !obj || !obj._veltroWidget) return;
    var id = obj._veltroId || ("ds-vw-" + Date.now() + "-" + Math.floor(Math.random() * 1000));
    obj._veltroId = id;
    var el = host.querySelector('[data-veltro-object="' + id + '"]');
    if (!el) {
      el = document.createElement("div");
      el.className = "ds-veltro-canvas-widget";
      el.dataset.veltroObject = id;
      host.appendChild(el);
    }
    var props = widgetPropsFor(obj._veltroWidget, obj);
    var html = "";
    html = renderDesignWidget(obj._veltroWidget, props, id);
    var renderKey = obj._veltroWidget + ":" + Math.round(obj.getScaledWidth()) + "x" + Math.round(obj.getScaledHeight()) + ":" + JSON.stringify(obj._veltroProps || {});
    if (el.dataset.renderKey !== renderKey) {
      el.innerHTML = html;
      el.dataset.renderKey = renderKey;
      setTimeout(function () {
        if (typeof window._VeltroInitAll === "function") window._VeltroInitAll();
      }, 0);
    }
  }

  function sync() {
    var fc = FB.design.canvas.get();
    var host = layer();
    if (!fc || !host) return;
    var seen = {};
    var zoom = fc.getZoom();
    var vt = fc.viewportTransform || [1, 0, 0, 1, 0, 0];
    fc.getObjects().forEach(function (obj, index) {
      if (!obj._veltroWidget) return;
      renderObject(obj);
      var id = obj._veltroId;
      seen[id] = true;
      var el = host.querySelector('[data-veltro-object="' + id + '"]');
      if (!el) return;
      el.style.left = Math.round(obj.left * zoom + vt[4]) + "px";
      el.style.top = Math.round(obj.top * zoom + vt[5]) + "px";
      el.style.width = Math.max(20, Math.round(obj.getScaledWidth() * zoom)) + "px";
      el.style.height = Math.max(20, Math.round(obj.getScaledHeight() * zoom)) + "px";
      el.style.opacity = obj.visible === false ? "0" : "1";
      el.style.transform = "rotate(" + (obj.angle || 0) + "deg)";
      el.style.transformOrigin = "center";
      el.style.zIndex = String(index + 1);
    });
    Array.prototype.forEach.call(host.querySelectorAll("[data-veltro-object]"), function (el) {
      if (!seen[el.dataset.veltroObject]) el.remove();
    });
  }

  function add(type) {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var w = Math.min(520, Math.max(260, fc.getWidth() * 0.42));
    var h = Math.min(360, Math.max(180, fc.getHeight() * 0.34));
    var rect = new fabric.Rect({
      left: fc.getWidth() / 2 - w / 2,
      top: fc.getHeight() / 2 - h / 2,
      width: w,
      height: h,
      fill: "rgba(205,254,0,0.035)",
      stroke: "#cdfe00",
      strokeDashArray: [8, 6],
      strokeWidth: 2,
      rx: 8,
      ry: 8,
      name: "Veltro: " + type,
      _veltroWidget: type,
      _veltroProps: {},
      _veltroId: "ds-vw-" + Date.now(),
    });
    fc.add(rect);
    fc.setActiveObject(rect);
    fc.renderAll();
    sync();
    if (FB.design.switchRightTab) FB.design.switchRightTab("design");
    if (FB.design.props) FB.design.props.render();
    if (FB.design.layers) FB.design.layers.render();
    FB.design.history.push();
  }

  return {
    add: add,
    sync: sync,
  };
})();

FB.design.canvas = (function () {
  var _fc = null;
  var _inited = false;
  var _snapGuides = [];
  var _snapEnabled = true;
  var _snapGuideVisible = true;
  var _snapThreshold = 8;
  var _snapMargin = 24;
  var SNAP_SETTINGS_KEY = "fb-design-snap-settings";

  var PRESETS = {
    blank: { w: 800, h: 600, label: "Blank Canvas" },
    linkedin: { w: 1200, h: 627, label: "LinkedIn" },
    facebook: { w: 1200, h: 628, label: "Facebook" },
    twitter: { w: 1200, h: 675, label: "Twitter/X" },
    instagram_square: { w: 1080, h: 1080, label: "Instagram Post" },
    pinterest: { w: 1000, h: 1500, label: "Pinterest" },
    instagram_story: { w: 1080, h: 1920, label: "Instagram Story" },
    tiktok: { w: 1080, h: 1920, label: "TikTok" },
    snapchat: { w: 1080, h: 1920, label: "Snapchat" },
    hero: { w: 1920, h: 600, label: "Hero Banner" },
    og: { w: 1200, h: 630, label: "Open Graph" },
    youtube_thumb: { w: 1280, h: 720, label: "YouTube Thumbnail" },
    custom: { w: 800, h: 600, label: "Custom Size" },
  };

  function init() {
    if (_inited) {
      _fc.renderAll();
      return;
    }
    _inited = true;
    _loadSnapSettings();

    _fc = new fabric.Canvas("ds-canvas", {
      backgroundColor: null,
      selection: true,
      preserveObjectStacking: true,
    });

    applyPreset("blank");
    _bindZoomPan();
    _bindEvents();
    _bindKeys();
    FB.design.tools.bindMouseDraw();
    _hookArrowRendering();
    FB.design.elements.render();
    FB.design.align.renderPanel();
    FB.design.renderExportTab();
    FB.design.history.push();
  }

  function applyPreset(key) {
    if (key === "custom") {
      var w = parseInt(prompt("Width in px:", "800"), 10) || 800;
      var h = parseInt(prompt("Height in px:", "600"), 10) || 600;
      _resizeTo(w, h);
      return;
    }
    var p = PRESETS[key];
    if (!p) return;
    _resizeTo(p.w, p.h);
    document.getElementById("ds-preset-select").value = key;
  }

  function _hookArrowRendering() {
    if (!_fc) return;
    var origRenderAll = _fc.renderAll.bind(_fc);
    _fc.renderAll = function () {
      origRenderAll();
      _drawArrowHeads();
      _drawSnapGuides();
    };
  }

  function _drawArrowHeads() {
    if (!_fc) return;
    var canvas = _fc.getElement();
    var ctx = _fc.contextTop || _fc.getContext();
    if (!ctx) return;

    _fc.forEachObject(function (obj) {
      if (obj._isArrow || obj._isDoubleArrow) {
        var pts = obj.calcLinePoints();
        if (!pts) return;
        var x1 = pts.x1, y1 = pts.y1, x2 = pts.x2, y2 = pts.y2;
        var headsize = Math.max(8, obj.strokeWidth * 4);
        var angle = Math.atan2(y2 - y1, x2 - x1);

        // Draw arrow head at end
        ctx.save();
        ctx.fillStyle = obj.stroke || "#4a90e2";
        ctx.globalAlpha = obj.opacity || 1;
        _drawArrowHead(ctx, x2, y2, angle, headsize);

        // Draw second arrow head at start if double arrow
        if (obj._isDoubleArrow) {
          _drawArrowHead(ctx, x1, y1, angle + Math.PI, headsize);
        }
        ctx.restore();
      }
    });
  }

  function _drawArrowHead(ctx, x, y, angle, size) {
    var h = size;
    var w = size * 0.6;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - h * Math.cos(angle - Math.PI / 6), y - h * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(x - h * Math.cos(angle + Math.PI / 6), y - h * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  }

  function _canvasPoint(x, y) {
    var vt = _fc.viewportTransform || [1, 0, 0, 1, 0, 0];
    var zoom = _fc.getZoom ? _fc.getZoom() : 1;
    return { x: x * zoom + vt[4], y: y * zoom + vt[5] };
  }

  function _drawSnapGuides() {
    if (!_fc || !_snapGuideVisible || !_snapGuides.length || !_fc.contextTop) return;
    var ctx = _fc.contextTop;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.strokeStyle = "#cdfe00";
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.95;
    ctx.setLineDash([5, 5]);
    _snapGuides.forEach(function (guide) {
      var a = _canvasPoint(guide.x1, guide.y1);
      var b = _canvasPoint(guide.x2, guide.y2);
      ctx.beginPath();
      ctx.moveTo(Math.round(a.x) + 0.5, Math.round(a.y) + 0.5);
      ctx.lineTo(Math.round(b.x) + 0.5, Math.round(b.y) + 0.5);
      ctx.stroke();
    });
    ctx.restore();
  }

  function _clearSnapGuides() {
    if (!_snapGuides.length) return;
    _snapGuides = [];
    if (_fc) _fc.requestRenderAll();
  }

  function _loadSnapSettings() {
    try {
      var saved = JSON.parse(localStorage.getItem(SNAP_SETTINGS_KEY) || "{}");
      if (typeof saved.enabled === "boolean") _snapEnabled = saved.enabled;
      if (typeof saved.guides === "boolean") _snapGuideVisible = saved.guides;
      if (Number.isFinite(+saved.threshold)) _snapThreshold = Math.max(1, Math.min(40, +saved.threshold));
      if (Number.isFinite(+saved.margin)) _snapMargin = Math.max(0, Math.min(200, +saved.margin));
    } catch (err) {
      console.error("[snapSettings] Failed to parse settings:", err);
    }
  }

  function _saveSnapSettings() {
    localStorage.setItem(SNAP_SETTINGS_KEY, JSON.stringify({
      enabled: _snapEnabled,
      guides: _snapGuideVisible,
      threshold: _snapThreshold,
      margin: _snapMargin,
    }));
  }

  function snapSettings() {
    return {
      enabled: _snapEnabled,
      guides: _snapGuideVisible,
      threshold: _snapThreshold,
      margin: _snapMargin,
    };
  }

  function setSnapSetting(key, value) {
    if (key === "enabled") _snapEnabled = !!value;
    if (key === "guides") _snapGuideVisible = !!value;
    if (key === "threshold") _snapThreshold = Math.max(1, Math.min(40, +value || 8));
    if (key === "margin") _snapMargin = Math.max(0, Math.min(200, +value || 0));
    if (!_snapGuideVisible || !_snapEnabled) _clearSnapGuides();
    _saveSnapSettings();
    if (_fc) _fc.requestRenderAll();
  }

  function _objectBounds(obj) {
    obj.setCoords();
    var b = obj.getBoundingRect(true, true);
    return {
      left: b.left,
      top: b.top,
      right: b.left + b.width,
      bottom: b.top + b.height,
      centerX: b.left + b.width / 2,
      centerY: b.top + b.height / 2,
      width: b.width,
      height: b.height,
    };
  }

  function _snapCandidates(active) {
    var w = _fc.getWidth();
    var h = _fc.getHeight();
    var candidates = {
      x: [
        { value: 0, y1: 0, y2: h },
        { value: _snapMargin, y1: 0, y2: h },
        { value: w / 2, y1: 0, y2: h },
        { value: w - _snapMargin, y1: 0, y2: h },
        { value: w, y1: 0, y2: h },
      ],
      y: [
        { value: 0, x1: 0, x2: w },
        { value: _snapMargin, x1: 0, x2: w },
        { value: h / 2, x1: 0, x2: w },
        { value: h - _snapMargin, x1: 0, x2: w },
        { value: h, x1: 0, x2: w },
      ],
    };
    _fc.getObjects().forEach(function (obj) {
      if (obj === active || obj.visible === false) return;
      if (active.type === "activeSelection" && active._objects && active._objects.indexOf(obj) !== -1) return;
      var b = _objectBounds(obj);
      candidates.x.push({ value: b.left, y1: Math.max(0, b.top - 16), y2: Math.min(h, b.bottom + 16) });
      candidates.x.push({ value: b.centerX, y1: Math.max(0, b.top - 16), y2: Math.min(h, b.bottom + 16) });
      candidates.x.push({ value: b.right, y1: Math.max(0, b.top - 16), y2: Math.min(h, b.bottom + 16) });
      candidates.y.push({ value: b.top, x1: Math.max(0, b.left - 16), x2: Math.min(w, b.right + 16) });
      candidates.y.push({ value: b.centerY, x1: Math.max(0, b.left - 16), x2: Math.min(w, b.right + 16) });
      candidates.y.push({ value: b.bottom, x1: Math.max(0, b.left - 16), x2: Math.min(w, b.right + 16) });
    });
    return candidates;
  }

  function _bestSnap(points, candidates) {
    var best = null;
    points.forEach(function (point) {
      candidates.forEach(function (candidate) {
        var delta = candidate.value - point.value;
        var abs = Math.abs(delta);
        if (abs <= _snapThreshold && (!best || abs < best.abs)) {
          best = {
            abs: abs,
            delta: delta,
            value: candidate.value,
            candidate: candidate,
          };
        }
      });
    });
    return best;
  }

  function _snapMovingObject(opt) {
    var obj = opt && opt.target;
    if (!_snapEnabled || !obj || (opt.e && opt.e.altKey)) {
      _clearSnapGuides();
      return;
    }
    var b = _objectBounds(obj);
    var candidates = _snapCandidates(obj);
    var xSnap = _bestSnap([
      { value: b.left },
      { value: b.centerX },
      { value: b.right },
    ], candidates.x);
    var ySnap = _bestSnap([
      { value: b.top },
      { value: b.centerY },
      { value: b.bottom },
    ], candidates.y);
    _snapGuides = [];
    if (xSnap) {
      obj.set("left", (obj.left || 0) + xSnap.delta);
      _snapGuides.push({
        x1: xSnap.value,
        y1: xSnap.candidate.y1 == null ? 0 : xSnap.candidate.y1,
        x2: xSnap.value,
        y2: xSnap.candidate.y2 == null ? _fc.getHeight() : xSnap.candidate.y2,
      });
    }
    if (ySnap) {
      obj.set("top", (obj.top || 0) + ySnap.delta);
      _snapGuides.push({
        x1: ySnap.candidate.x1 == null ? 0 : ySnap.candidate.x1,
        y1: ySnap.value,
        x2: ySnap.candidate.x2 == null ? _fc.getWidth() : ySnap.candidate.x2,
        y2: ySnap.value,
      });
    }
    obj.setCoords();
    _fc.requestRenderAll();
  }

  function _snapGuideForX(snap) {
    _snapGuides.push({
      x1: snap.value,
      y1: snap.candidate.y1 == null ? 0 : snap.candidate.y1,
      x2: snap.value,
      y2: snap.candidate.y2 == null ? _fc.getHeight() : snap.candidate.y2,
    });
  }

  function _snapGuideForY(snap) {
    _snapGuides.push({
      x1: snap.candidate.x1 == null ? 0 : snap.candidate.x1,
      y1: snap.value,
      x2: snap.candidate.x2 == null ? _fc.getWidth() : snap.candidate.x2,
      y2: snap.value,
    });
  }

  function _resizeSnapX(obj, edge, snap, bounds) {
    var baseW = Math.max(1, obj.width || bounds.width || 1);
    var currentW = Math.max(1, bounds.width);
    var newW = edge === "left" ? currentW - snap.delta : currentW + snap.delta;
    newW = Math.max(4, newW);
    var scale = (obj.scaleX || 1) * (newW / currentW);
    obj.set("scaleX", scale);
    if (edge === "left") obj.set("left", (obj.left || 0) + (currentW - newW));
    if (obj.minScaleLimit) obj.set("scaleX", Math.max(obj.minScaleLimit, obj.scaleX || scale));
    if (!Number.isFinite(obj.scaleX) || Math.abs(obj.scaleX) < 0.0001) obj.set("scaleX", newW / baseW);
  }

  function _resizeSnapY(obj, edge, snap, bounds) {
    var baseH = Math.max(1, obj.height || bounds.height || 1);
    var currentH = Math.max(1, bounds.height);
    var newH = edge === "top" ? currentH - snap.delta : currentH + snap.delta;
    newH = Math.max(4, newH);
    var scale = (obj.scaleY || 1) * (newH / currentH);
    obj.set("scaleY", scale);
    if (edge === "top") obj.set("top", (obj.top || 0) + (currentH - newH));
    if (obj.minScaleLimit) obj.set("scaleY", Math.max(obj.minScaleLimit, obj.scaleY || scale));
    if (!Number.isFinite(obj.scaleY) || Math.abs(obj.scaleY) < 0.0001) obj.set("scaleY", newH / baseH);
  }

  function _snapScalingObject(opt) {
    var obj = opt && opt.target;
    if (!_snapEnabled || !obj || (opt.e && opt.e.altKey)) {
      _clearSnapGuides();
      return;
    }
    if (obj.angle && Math.abs(obj.angle % 360) > 0.01) {
      _clearSnapGuides();
      return;
    }
    var corner = String((opt.transform && opt.transform.corner) || "");
    var snapLeft = /l/.test(corner);
    var snapRight = /r/.test(corner);
    var snapTop = /t/.test(corner);
    var snapBottom = /b/.test(corner);
    if (!snapLeft && !snapRight && !snapTop && !snapBottom) {
      snapRight = true;
      snapBottom = true;
    }
    var b = _objectBounds(obj);
    var candidates = _snapCandidates(obj);
    var xSnap = null;
    var ySnap = null;
    if (snapLeft || snapRight) {
      xSnap = _bestSnap([{ value: snapLeft ? b.left : b.right }], candidates.x);
    }
    if (snapTop || snapBottom) {
      ySnap = _bestSnap([{ value: snapTop ? b.top : b.bottom }], candidates.y);
    }
    _snapGuides = [];
    if (xSnap) {
      _resizeSnapX(obj, snapLeft ? "left" : "right", xSnap, b);
      _snapGuideForX(xSnap);
    }
    if (ySnap) {
      _resizeSnapY(obj, snapTop ? "top" : "bottom", ySnap, b);
      _snapGuideForY(ySnap);
    }
    obj.setCoords();
    _fc.requestRenderAll();
  }

  function _resizeTo(w, h) {
    var col = document.getElementById("ds-canvas-column");
    var maxW = Math.max((col ? col.clientWidth : 0) - 40, 200);
    var maxH = Math.max((col ? col.clientHeight : 0) - 40, 200);
    var scale = Math.min(1, maxW / w, maxH / h);
    scale = Math.max(scale, 0.01);
    _fc.setWidth(w);
    _fc.setHeight(h);
    _fc.setZoom(scale);
    if (_fc.wrapperEl) {
      _fc.wrapperEl.style.width = Math.round(w * scale) + "px";
      _fc.wrapperEl.style.height = Math.round(h * scale) + "px";
    }
    FB.design.applyCanvasSurfaceBg();
    if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
    document.getElementById("ds-size-label").textContent = w + " \xd7 " + h;
    document.getElementById("ds-zoom-label").textContent =
      Math.round(scale * 100) + "%";
    _fc.renderAll();
  }

  function _bindZoomPan() {
    _fc.on("mouse:wheel", function (opt) {
      var delta = opt.e.deltaY;
      var zoom = _fc.getZoom();
      zoom *= Math.pow(0.999, delta);
      zoom = Math.min(Math.max(zoom, 0.05), 5);
      _fc.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
      document.getElementById("ds-zoom-label").textContent =
        Math.round(zoom * 100) + "%";
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    var _panning = false;
    var _spaceDown = false;
    var _clipboard = null;
    document.addEventListener("keydown", function (e) {
      if (e.code === "Space" && FB.design._mode) _spaceDown = true;
    });
    document.addEventListener("keyup", function (e) {
      if (e.code === "Space") _spaceDown = false;
    });
    _fc.on("mouse:down", function (opt) {
      if (_spaceDown || opt.e.button === 1) {
        _panning = true;
        _fc.selection = false;
      }
    });
    _fc.on("mouse:move", function (opt) {
      if (_panning && opt.e.buttons) {
        _fc.relativePan({ x: opt.e.movementX, y: opt.e.movementY });
        if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
      }
    });
    _fc.on("mouse:up", function () {
      _panning = false;
      _fc.selection = FB.design.tools.active() === "select";
      _clearSnapGuides();
    });
  }

  function _bindEvents() {
    _fc.on("selection:created", function () {
      _clearSnapGuides();
      FB.design.props.render();
      FB.design.layers.render();
      FB.design.align.renderPanel();
    });
    _fc.on("selection:updated", function () {
      _clearSnapGuides();
      FB.design.props.render();
      FB.design.layers.render();
      FB.design.align.renderPanel();
    });
    _fc.on("selection:cleared", function () {
      _clearSnapGuides();
      FB.design.props.render();
      FB.design.layers.render();
      FB.design.align.renderPanel();
    });
    _fc.on("object:added", function () {
      FB.design.props.render();
      FB.design.layers.render();
      if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
      FB.design.history.push();
    });
    _fc.on("object:removed", function () {
      FB.design.layers.render();
      if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
      FB.design.history.push();
    });
    _fc.on("object:moving", function (opt) {
      _snapMovingObject(opt);
      if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
    });
    _fc.on("object:scaling", function (opt) {
      _snapScalingObject(opt);
      if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
    });
    _fc.on("object:modified", function () {
      _clearSnapGuides();
      FB.design.props.render();
      FB.design.layers.render();
      if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
      FB.design.history.push();
    });
  }

  function _bindKeys() {
    document.addEventListener("keydown", function (e) {
      if (!FB.design._mode) return;
      var tag = document.activeElement.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "Delete" || e.key === "Backspace") {
        var objs = _fc.getActiveObjects();
        if (objs.length) {
          objs.forEach(function (o) {
            _fc.remove(o);
          });
          _fc.discardActiveObject();
          _fc.renderAll();
        }
      }
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        _duplicateSelected();
      }
      if (e.ctrlKey && e.key === "g") {
        e.preventDefault();
        _groupSelected();
      }
      if (e.ctrlKey && e.shiftKey && e.key === "G") {
        e.preventDefault();
        _ungroupSelected();
      }
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        FB.design.library.save();
      }
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        FB.design.history.undo();
      }
      if (
        (e.ctrlKey && e.key === "y") ||
        (e.ctrlKey && e.shiftKey && e.key === "z")
      ) {
        e.preventDefault();
        FB.design.history.redo();
      }
      var toolKeys = {
        v: "select",
        r: "rect",
        o: "circle",
        t: "text",
        i: "image",
      };
      if (toolKeys[e.key] && !e.ctrlKey && !e.altKey) {
        FB.design.tools.setTool(toolKeys[e.key]);
      }

      // Arrow nudge — 1px, Shift = 10px
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        var nudgeObj = _fc.getActiveObject();
        if (nudgeObj) {
          e.preventDefault();
          var step = e.shiftKey ? 10 : 1;
          if (e.key === "ArrowLeft") nudgeObj.set("left", nudgeObj.left - step);
          if (e.key === "ArrowRight")
            nudgeObj.set("left", nudgeObj.left + step);
          if (e.key === "ArrowUp") nudgeObj.set("top", nudgeObj.top - step);
          if (e.key === "ArrowDown") nudgeObj.set("top", nudgeObj.top + step);
          nudgeObj.setCoords();
          _fc.renderAll();
          FB.design.props.render();
        }
      }

      // Copy (Ctrl+C / Cmd+C)
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        var copyObj = _fc.getActiveObject();
        if (copyObj) {
          copyObj.clone(function (cloned) {
            _clipboard = cloned;
          });
        }
      }

      // Cut (Ctrl+X / Cmd+X)
      if ((e.ctrlKey || e.metaKey) && e.key === "x") {
        var cutObj = _fc.getActiveObject();
        if (cutObj) {
          cutObj.clone(function (cloned) {
            _clipboard = cloned;
          });
          _fc.getActiveObjects().forEach(function (o) {
            _fc.remove(o);
          });
          _fc.discardActiveObject();
          _fc.renderAll();
        }
      }

      // Paste (Ctrl+V / Cmd+V)
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        if (_clipboard) {
          e.preventDefault();
          _clipboard.clone(function (cloned) {
            _fc.discardActiveObject();
            cloned.set({
              left: cloned.left + 20,
              top: cloned.top + 20,
              evented: true,
            });
            if (cloned.type === "activeSelection") {
              cloned.canvas = _fc;
              cloned.forEachObject(function (obj) {
                _fc.add(obj);
              });
              cloned.setCoords();
            } else {
              _fc.add(cloned);
            }
            _fc.setActiveObject(cloned);
            _fc.renderAll();
            FB.design.history.push();
            _clipboard.set({
              left: _clipboard.left + 20,
              top: _clipboard.top + 20,
            });
          });
        }
      }
    });
  }

  function _duplicateSelected() {
    _fc.getActiveObjects().forEach(function (obj) {
      obj.clone(function (clone) {
        clone.set({ left: obj.left + 20, top: obj.top + 20 });
        _fc.add(clone);
      });
    });
    _fc.renderAll();
  }

  function _groupSelected() {
    var active = _fc.getActiveObject();
    if (!active || active.type !== "activeSelection") return;
    var group = active.toGroup();
    _fc.setActiveObject(group);
    _fc.requestRenderAll();
  }

  function _ungroupSelected() {
    var obj = _fc.getActiveObject();
    if (!obj || obj.type !== "group") return;
    obj.toActiveSelection();
    _fc.requestRenderAll();
  }

  function zoomIn() {
    var z = Math.min(_fc.getZoom() * 1.2, 5);
    _fc.setZoom(z);
    if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
    document.getElementById("ds-zoom-label").textContent =
      Math.round(z * 100) + "%";
  }

  function zoomOut() {
    var z = Math.max(_fc.getZoom() * 0.8, 0.05);
    _fc.setZoom(z);
    if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
    document.getElementById("ds-zoom-label").textContent =
      Math.round(z * 100) + "%";
  }

  function zoomFit() {
    var w = _fc.getWidth();
    var h = _fc.getHeight();
    var wrap = document.getElementById("ds-canvas-wrap");
    var scale = Math.min(
      Math.max(wrap.clientWidth - 40, 200) / w,
      Math.max(wrap.clientHeight - 40, 200) / h,
    );
    scale = Math.max(scale, 0.01);
    _fc.setZoom(scale);
    if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
    document.getElementById("ds-zoom-label").textContent =
      Math.round(scale * 100) + "%";
    _fc.renderAll();
  }

  function get() {
    return _fc;
  }

  return {
    init: init,
    get: get,
    applyPreset: applyPreset,
    zoomIn: zoomIn,
    zoomOut: zoomOut,
    zoomFit: zoomFit,
    snapSettings: snapSettings,
    setSnapSetting: setSnapSetting,
    group: _groupSelected,
    ungroup: _ungroupSelected,
  };
})();

FB.design.tools = (function () {
  var _active = "select";
  var _drawing = false;
  var _startX, _startY, _drawObj;

  function setTool(id) {
    _active = id;
    var fc = FB.design.canvas.get();
    if (!fc) {
      render();
      return;
    }
    fc.isDrawingMode = false;
    fc.selection = id === "select";
    fc.defaultCursor = id === "select" ? "default" : "crosshair";
    if (id === "image") {
      _triggerImageUpload();
    }
    if (FB.design.elements) FB.design.elements._renderToolRow();
  }

  function _triggerImageUpload() {
    var inp = document.createElement("input");
    inp.type = "file";
    inp.accept = "image/*";
    inp.onchange = function () {
      var file = inp.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        if (FB.design.media && FB.design.media.replaceSelectedSlot && FB.design.media.replaceSelectedSlot(ev.target.result)) {
          FB.design.tools.setTool("select");
          return;
        }
        fabric.Image.fromURL(ev.target.result, function (img) {
          var fc = FB.design.canvas.get();
          var maxW = fc.getWidth() * 0.5;
          if (img.width > maxW) img.scaleToWidth(maxW);
          img.set({
            left: fc.getWidth() / 2 - img.getScaledWidth() / 2,
            top: fc.getHeight() / 2 - img.getScaledHeight() / 2,
            name: "Image",
          });
          fc.add(img);
          fc.setActiveObject(img);
          fc.renderAll();
          FB.design.tools.setTool("select");
        });
      };
      reader.readAsDataURL(file);
    };
    inp.click();
  }

  function bindMouseDraw() {
    var fc = FB.design.canvas.get();

    fc.on("mouse:down", function (opt) {
      var p = fc.getPointer(opt.e);
      _startX = p.x;
      _startY = p.y;
      if (_active === "select" || _active === "image" || _active === "text")
        return;
      if (opt.target) return;
      _drawing = true;
      _drawObj = _createShape(_active, p.x, p.y);
      if (_drawObj) fc.add(_drawObj);
    });

    fc.on("mouse:move", function (opt) {
      if (!_drawing || !_drawObj) return;
      var p = fc.getPointer(opt.e);
      _updateShape(_drawObj, _startX, _startY, p.x, p.y);
      fc.renderAll();
    });

    fc.on("mouse:up", function (opt) {
      // Text tool: single click places a text object
      if (_active === "text") {
        var p = fc.getPointer(opt.e);
        var dx = p.x - _startX,
          dy = p.y - _startY;
        if (Math.sqrt(dx * dx + dy * dy) < 5 && !opt.target) {
          var txt = new fabric.IText("Text", {
            left: _startX,
            top: _startY,
            fontFamily: "Lexend",
            fontSize: 32,
            fill: "#000000",
            name: "Text",
          });
          fc.add(txt);
          fc.setActiveObject(txt);
          txt.enterEditing();
          FB.design.tools.setTool("select");
          fc.renderAll();
        }
        return;
      }

      if (!_drawing) return;
      _drawing = false;

      if (_drawObj) {
        var w = _drawObj.getScaledWidth();
        var h = _drawObj.getScaledHeight();
        // Discard accidental misclick shapes smaller than 4px
        if (w < 4 && h < 4) {
          fc.remove(_drawObj);
        } else {
          _drawObj.setCoords();
          fc.setActiveObject(_drawObj);
        }
        _drawObj = null;
      }

      FB.design.tools.setTool("select");
      fc.renderAll();
    });

    // Double-click on existing i-text to enter editing
    fc.on("mouse:dblclick", function (opt) {
      if (opt.target && opt.target.type === "i-text") {
        opt.target.enterEditing();
      }
    });
  }

  function _createShape(type, x, y) {
    var opts = {
      left: x,
      top: y,
      fill: "#4a90e2",
      stroke: "transparent",
      strokeWidth: 0,
      originX: "left",
      originY: "top",
    };
    if (type === "rect")
      return new fabric.Rect(
        Object.assign({ width: 1, height: 1, name: "Rectangle" }, opts),
      );
    if (type === "circle")
      return new fabric.Ellipse(
        Object.assign({ rx: 1, ry: 1, name: "Circle" }, opts),
      );
    if (type === "tri")
      return new fabric.Triangle(
        Object.assign({ width: 1, height: 1, name: "Triangle" }, opts),
      );
    if (type === "poly")
      return new fabric.Polygon(
        [
          { x: 0, y: 50 },
          { x: 50, y: 0 },
          { x: 100, y: 50 },
          { x: 75, y: 100 },
          { x: 25, y: 100 },
        ],
        Object.assign({ name: "Polygon" }, opts),
      );
    if (type === "line")
      return new fabric.Line([x, y, x, y], {
        stroke: "#4a90e2",
        strokeWidth: 2,
        name: "Line",
      });
    if (type === "arrow") {
      var line = new fabric.Line([x, y, x, y], {
        stroke: "#4a90e2",
        strokeWidth: 2,
        name: "Arrow",
      });
      line._isArrow = true;
      return line;
    }
    if (type === "double-arrow") {
      var line = new fabric.Line([x, y, x, y], {
        stroke: "#4a90e2",
        strokeWidth: 2,
        name: "Double Arrow",
      });
      line._isDoubleArrow = true;
      return line;
    }
    if (type === "ellipse") {
      return new fabric.Ellipse(
        Object.assign({ rx: 60, ry: 40, name: "Ellipse" }, opts),
      );
    }
    if (type === "diamond") {
      return new fabric.Polygon(
        [
          { x: 50, y: 0 },
          { x: 100, y: 50 },
          { x: 50, y: 100 },
          { x: 0, y: 50 },
        ],
        Object.assign({ name: "Diamond" }, opts),
      );
    }
    if (type === "hexagon") {
      return new fabric.Polygon(
        [
          { x: 50, y: 0 },
          { x: 100, y: 25 },
          { x: 100, y: 75 },
          { x: 50, y: 100 },
          { x: 0, y: 75 },
          { x: 0, y: 25 },
        ],
        Object.assign({ name: "Hexagon" }, opts),
      );
    }
    if (type === "crescent") {
      return new fabric.Polygon(
        [
          { x: 50, y: 0 },
          { x: 100, y: 50 },
          { x: 50, y: 100 },
          { x: 40, y: 85 },
          { x: 60, y: 50 },
          { x: 40, y: 15 },
        ],
        Object.assign({ name: "Crescent" }, opts),
      );
    }
    return null;
  }

  function _updateShape(obj, x1, y1, x2, y2) {
    var w = x2 - x1,
      h = y2 - y1;
    if (obj.type === "rect" || obj.type === "triangle") {
      obj.set({
        width: Math.abs(w),
        height: Math.abs(h),
        left: Math.min(x1, x2),
        top: Math.min(y1, y2),
      });
    } else if (obj.type === "ellipse") {
      obj.set({
        rx: Math.abs(w) / 2,
        ry: Math.abs(h) / 2,
        left: Math.min(x1, x2),
        top: Math.min(y1, y2),
      });
    } else if (obj.type === "polygon") {
      var size = Math.max(Math.abs(w), Math.abs(h), 1);
      obj.set({
        scaleX: size / 100,
        scaleY: size / 100,
        left: Math.min(x1, x2),
        top: Math.min(y1, y2),
      });
    } else if (obj.type === "line") {
      obj.set({ x2: x2, y2: y2 });
    }
  }

  return {
    setTool: setTool,
    bindMouseDraw: bindMouseDraw,
    active: function () {
      return _active;
    },
  };
})();

FB.design.layers = (function () {
  var _typeIcon = {
    rect: "⬛",
    ellipse: "⬤",
    triangle: "▲",
    polygon: "⬡",
    line: "—",
    "i-text": "T",
    image: "🖼",
    group: "⊞",
    path: "✒",
  };

  function render() {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var objs = fc.getObjects().slice().reverse();
    var active = fc.getActiveObjects();
    var el = document.getElementById("ds-layers-list");
    el.innerHTML = objs
      .map(function (obj, i) {
        var icon = _typeIcon[obj.type] || "◆";
        var name = obj.name || obj.type || "Object";
        var isActive = active.indexOf(obj) !== -1;
        var isHidden = obj.visible === false;
        return (
          '<div class="ds-layer-row' +
          (isActive ? " selected" : "") +
          '" ' +
          'data-idx="' +
          (objs.length - 1 - i) +
          '" ' +
          'onclick="FB.design.layers.select(' +
          (objs.length - 1 - i) +
          ')" ' +
          'oncontextmenu="FB.design.layers.ctxMenu(event,' +
          (objs.length - 1 - i) +
          ');return false">' +
          "<span>" +
          icon +
          "</span>" +
          '<span class="ds-layer-name">' +
          name +
          "</span>" +
          '<button class="ds-layer-vis" onclick="FB.design.layers.toggleVis(event,' +
          (objs.length - 1 - i) +
          ')">' +
          (isHidden ? "🚫" : "👁") +
          "</button>" +
          "</div>"
        );
      })
      .join("");
  }

  function select(idx) {
    var fc = FB.design.canvas.get();
    var obj = fc.item(idx);
    if (!obj) return;
    fc.setActiveObject(obj);
    fc.renderAll();
    FB.design.props.render();
    render();
  }

  function toggleVis(e, idx) {
    e.stopPropagation();
    var fc = FB.design.canvas.get();
    var obj = fc.item(idx);
    if (!obj) return;
    obj.visible = !obj.visible;
    fc.renderAll();
    render();
  }

  function ctxMenu(e, idx) {
    var fc = FB.design.canvas.get();
    var obj = fc.item(idx);
    if (!obj) return;
    var name = prompt("Rename layer:", obj.name || obj.type);
    if (name !== null) {
      obj.name = name;
      render();
    }
  }

  return {
    render: render,
    select: select,
    toggleVis: toggleVis,
    ctxMenu: ctxMenu,
  };
})();

FB.design.props = (function () {
  var GOOGLE_FONTS = [
    "Lexend",
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Poppins",
    "Raleway",
    "Playfair Display",
    "Merriweather",
    "Lora",
    "Bebas Neue",
    "Oswald",
    "Space Grotesk",
    "DM Sans",
  ];
  var BRAND_KIT_KEY = "fb-design-brand-kit";
  var DEFAULT_BRAND_KIT = {
    primary: "#cdfe00",
    secondary: "#181820",
    accent: "#7dd3fc",
    background: "#101014",
    text: "#ffffff",
    headingFont: "Lexend",
    bodyFont: "Inter",
    radius: 6,
  };

  function _brandKit() {
    try {
      return Object.assign({}, DEFAULT_BRAND_KIT, JSON.parse(localStorage.getItem(BRAND_KIT_KEY) || "{}"));
    } catch (err) {
      console.error("[brandKit] Failed to parse kit:", err);
      return Object.assign({}, DEFAULT_BRAND_KIT);
    }
  }

  function _saveBrandKit(kit) {
    localStorage.setItem(BRAND_KIT_KEY, JSON.stringify(Object.assign({}, _brandKit(), kit || {})));
  }

  function _fontOptions(current) {
    return GOOGLE_FONTS.map(function (f) {
      return '<option value="' + FB.design._esc(f) + '"' + (f === current ? " selected" : "") + ">" + FB.design._esc(f) + "</option>";
    }).join("");
  }

  function _brandKitPanel() {
    var kit = _brandKit();
    return (
      '<div class="ds-prop-group ds-brand-kit-props">' +
      '<div class="ds-prop-label">Brand Kit</div>' +
      '<div class="ds-motion-grid">' +
      '<label>Primary<input type="color" class="ds-color-swatch" value="' + FB.design.normalizeColorForInput(kit.primary) + '" oninput="FB.design.props.setBrandKit(\'primary\',this.value)"></label>' +
      '<label>Accent<input type="color" class="ds-color-swatch" value="' + FB.design.normalizeColorForInput(kit.accent) + '" oninput="FB.design.props.setBrandKit(\'accent\',this.value)"></label>' +
      '</div>' +
      '<div class="ds-motion-grid">' +
      '<label>Background<input type="color" class="ds-color-swatch" value="' + FB.design.normalizeColorForInput(kit.background) + '" oninput="FB.design.props.setBrandKit(\'background\',this.value)"></label>' +
      '<label>Text<input type="color" class="ds-color-swatch" value="' + FB.design.normalizeColorForInput(kit.text) + '" oninput="FB.design.props.setBrandKit(\'text\',this.value)"></label>' +
      '</div>' +
      '<label class="ds-mini-label">Secondary Surface</label>' +
      '<div class="ds-color-row"><input type="color" class="ds-color-swatch" value="' + FB.design.normalizeColorForInput(kit.secondary) + '" oninput="FB.design.props.setBrandKit(\'secondary\',this.value)">' +
      '<input class="ds-input" value="' + FB.design._esc(kit.secondary) + '" onchange="FB.design.props.setBrandKit(\'secondary\',this.value)"></div>' +
      '<label class="ds-mini-label">Heading Font</label>' +
      '<select class="ds-select" onchange="FB.design.props.setBrandKit(\'headingFont\',this.value)">' + _fontOptions(kit.headingFont) + '</select>' +
      '<label class="ds-mini-label">Body Font</label>' +
      '<select class="ds-select" onchange="FB.design.props.setBrandKit(\'bodyFont\',this.value)">' + _fontOptions(kit.bodyFont) + '</select>' +
      '<label class="ds-veltro-control"><span>Radius <output>' + kit.radius + 'px</output></span>' +
      '<input class="ds-input" type="range" min="0" max="24" step="1" value="' + kit.radius + '" oninput="this.previousElementSibling.querySelector(\'output\').textContent=this.value+\'px\';FB.design.props.setBrandKit(\'radius\',+this.value)"></label>' +
      '<div class="ds-motion-presets">' +
      '<button class="ds-sm-btn" onclick="FB.design.props.captureBrandFromSelection()">Capture</button>' +
      '<button class="ds-sm-btn" onclick="FB.design.props.applyBrandToSelection()">Apply</button>' +
      '<button class="ds-sm-btn" onclick="FB.design.props.applyBrandGlobally()">Apply All</button>' +
      '<button class="ds-sm-btn" onclick="FB.design.props.applyBrandToCanvas()">Canvas BG</button>' +
      '</div>' +
      '</div>'
    );
  }

  function _brandSelectionPanel() {
    return (
      '<div class="ds-prop-group ds-brand-kit-props">' +
      '<div class="ds-prop-label">Brand Kit</div>' +
      '<div class="ds-motion-presets">' +
      '<button class="ds-sm-btn" onclick="FB.design.props.applyBrandToSelection()">Apply Brand</button>' +
      '<button class="ds-sm-btn" onclick="FB.design.props.captureBrandFromSelection()">Capture Style</button>' +
      '<button class="ds-sm-btn" onclick="FB.design.props.applyBrandGlobally()">Apply All</button>' +
      '</div>' +
      '</div>'
    );
  }

  FB.design._renderBrandSettings = function() {
    var el = document.getElementById("ds-brand-settings");
    if (!el) return;
    el.innerHTML = _brandKitPanel();
  };

  function render() {
    var fc = FB.design.canvas.get();
    var el = document.getElementById("ds-props");
    if (!fc) {
      el.innerHTML = "";
      return;
    }
    var obj = fc.getActiveObject();
    if (!obj) {
      el.innerHTML = _canvasProps(fc);
      return;
    }
    if (obj._dsMarketingWidget && FB.design.switchRightTab) {
      FB.design.switchRightTab("design");
    }
    var body =
      obj.type === "i-text"
        ? _textProps(obj)
        : obj.type === "image"
          ? _imageProps(obj)
          : _shapeProps(obj);
    el.innerHTML = _actionBar(obj) + '<div id="ds-design-settings">' + body + "</div>";
  }

  function _actionBar(obj) {
    var isGroup = obj.type === "group";
    return (
      '<div class="ds-action-bar">' +
      '<button class="ds-action-btn" title="Duplicate (Ctrl+D)" onclick="FB.design.props.duplicate()">⧉ Dupe</button>' +
      '<button class="ds-action-btn ds-action-danger" title="Delete (Del)" onclick="FB.design.props.deleteSelected()">🗑 Del</button>' +
      (isGroup
        ? '<button class="ds-action-btn" title="Ungroup (Ctrl+Shift+G)" onclick="FB.design.canvas.ungroup()">⊟ Ungroup</button>'
        : '<button class="ds-action-btn" title="Group (Ctrl+G)" onclick="FB.design.canvas.group()">⊞ Group</button>') +
      "</div>"
    );
  }

  function _shadowSection(obj) {
    var has = !!obj.shadow;
    var sh = obj.shadow || {};
    var color = sh.color && sh.color.charAt(0) === "#" ? sh.color : "#000000";
    var colorNormalized = FB.design.normalizeColorForInput(color);
    return (
      '<div class="ds-prop-group">' +
      '<div class="ds-prop-label" style="display:flex;justify-content:space-between;align-items:center;">' +
      "Shadow" +
      '<button class="ds-sm-btn' +
      (has ? " active" : "") +
      '" style="padding:2px 8px;font-size:9px;" onclick="FB.design.props.toggleShadow()">' +
      (has ? "On" : "Off") +
      "</button></div>" +
      (has
        ? '<div class="ds-shadow-row">' +
          '<input id="shadow-offsetx" name="shadow-offsetx" class="ds-input" type="number" value="' +
          (sh.offsetX || 4) +
          '" placeholder="X" title="X offset" onchange="FB.design.props.setShadow(\'offsetX\',+this.value)"/>' +
          '<input id="shadow-offsety" name="shadow-offsety" class="ds-input" type="number" value="' +
          (sh.offsetY || 4) +
          '" placeholder="Y" title="Y offset" onchange="FB.design.props.setShadow(\'offsetY\',+this.value)"/>' +
          "</div>" +
          '<div class="ds-shadow-row">' +
          '<input id="shadow-blur" name="shadow-blur" class="ds-input" type="number" value="' +
          (sh.blur || 10) +
          '" placeholder="Blur" title="Blur" onchange="FB.design.props.setShadow(\'blur\',+this.value)"/>' +
          '<input id="shadow-color" name="shadow-color" type="color" class="ds-color-swatch" style="width:100%;border-radius:4px" value="' +
          colorNormalized +
          '" title="Shadow colour" onchange="FB.design.props.setShadow(\'color\',this.value)"/>' +
          "</div>"
        : "") +
      "</div>"
    );
  }

  function _motionSection(obj) {
    var motion = obj.motion || {};
    var preset = motion.preset || "none";
    var duration = motion.duration || 1.2;
    var delay = motion.delay || 0;
    var easing = motion.easing || "cubic-bezier(.2,.8,.2,1)";
    var iteration = motion.iteration || "once";
    var presets = [
      ["none", "None"],
      ["fade", "Fade"],
      ["rise", "Rise"],
      ["slide-left", "Slide Left"],
      ["slide-right", "Slide Right"],
      ["zoom", "Zoom"],
      ["blur", "Blur In"],
      ["elastic", "Elastic"],
      ["bounce", "Bounce"],
      ["gravity-drop", "Gravity Drop"],
      ["gravity-rise", "Gravity Rise"],
      ["swing", "Swing"],
      ["magnetic", "Magnetic"],
      ["kinetic-snap", "Kinetic Snap"],
      ["kinetic-skew", "Kinetic Skew"],
      ["fluid-wave", "Fluid Wave"],
      ["liquid-morph", "Liquid Morph"],
      ["orbit", "Orbit"],
      ["parallax", "Parallax"],
      ["tilt", "Tilt"],
      ["breathe", "Breathe"],
      ["shimmer", "Shimmer"],
      ["glitch", "Glitch"],
      ["float", "Float"],
      ["pulse", "Pulse"],
      ["spin", "Spin"],
      ["drift", "Drift"],
    ];
    var easings = [
      ["cubic-bezier(.2,.8,.2,1)", "Smooth"],
      ["ease-out", "Ease Out"],
      ["ease-in-out", "Ease In/Out"],
      ["linear", "Linear"],
      ["cubic-bezier(.34,1.56,.64,1)", "Spring"],
    ];

    return (
      '<div class="ds-prop-group ds-motion-group">' +
      '<div class="ds-prop-label" style="display:flex;justify-content:space-between;align-items:center;">Motion' +
      '<button class="ds-sm-btn" onclick="FB.design.props.previewMotion()" title="Preview selected motion">▶</button>' +
      '</div>' +
      '<select class="ds-select" onchange="FB.design.props.setMotion(\'preset\',this.value)">' +
      presets.map(function (p) {
        return '<option value="' + p[0] + '"' + (preset === p[0] ? " selected" : "") + ">" + p[1] + "</option>";
      }).join("") +
      '</select>' +
      '<div class="ds-motion-grid">' +
      '<label>Duration<input class="ds-input" type="number" min="0.1" max="20" step="0.1" value="' + duration + '" onchange="FB.design.props.setMotion(\'duration\',+this.value)"></label>' +
      '<label>Delay<input class="ds-input" type="number" min="0" max="20" step="0.1" value="' + delay + '" onchange="FB.design.props.setMotion(\'delay\',+this.value)"></label>' +
      '</div>' +
      '<div class="ds-motion-grid">' +
      '<label>Repeat<select class="ds-select" onchange="FB.design.props.setMotion(\'iteration\',this.value)">' +
      '<option value="once"' + (iteration === "once" ? " selected" : "") + '>Once</option>' +
      '<option value="loop"' + (iteration === "loop" ? " selected" : "") + '>Loop</option>' +
      '</select></label>' +
      '<label>Ease<select class="ds-select" onchange="FB.design.props.setMotion(\'easing\',this.value)">' +
      easings.map(function (e) {
        return '<option value="' + e[0] + '"' + (easing === e[0] ? " selected" : "") + ">" + e[1] + "</option>";
      }).join("") +
      '</select></label>' +
      '</div>' +
      '<div class="ds-motion-presets">' +
      '<button class="ds-sm-btn" onclick="FB.design.props.applyMotionPreset(\'reveal\')">Reveal</button>' +
      '<button class="ds-sm-btn" onclick="FB.design.props.applyMotionPreset(\'ambient\')">Ambient</button>' +
      '<button class="ds-sm-btn" onclick="FB.design.props.applyMotionPreset(\'energetic\')">Energetic</button>' +
      '<button class="ds-sm-btn" onclick="FB.design.props.applyMotionPreset(\'physics\')">Physics</button>' +
      '<button class="ds-sm-btn" onclick="FB.design.props.applyMotionPreset(\'fluid\')">Fluid</button>' +
      '<button class="ds-sm-btn" onclick="FB.design.props.applyMotionPreset(\'magnetic\')">Magnet</button>' +
      '</div>' +
      '</div>'
    );
  }

  function _posSize(obj) {
    return (
      '<div class="ds-prop-group">' +
      '<div class="ds-prop-label">Position</div>' +
      '<div class="ds-prop-row">' +
      '<input id="prop-left" name="prop-left" class="ds-input" style="width:48%" type="number" value="' +
      Math.round(obj.left) +
      '" onchange="FB.design.props.setProp(\'left\',+this.value)" placeholder="X"/>' +
      '<input id="prop-top" name="prop-top" class="ds-input" style="width:48%" type="number" value="' +
      Math.round(obj.top) +
      '" onchange="FB.design.props.setProp(\'top\',+this.value)" placeholder="Y"/>' +
      "</div>" +
      '<div class="ds-prop-row">' +
      '<input id="prop-width" name="prop-width" class="ds-input" style="width:48%" type="number" value="' +
      Math.round(obj.getScaledWidth()) +
      '" onchange="FB.design.props.setWidth(+this.value)" placeholder="W"/>' +
      '<input id="prop-height" name="prop-height" class="ds-input" style="width:48%" type="number" value="' +
      Math.round(obj.getScaledHeight()) +
      '" onchange="FB.design.props.setHeight(+this.value)" placeholder="H"/>' +
      "</div>" +
      "</div>"
    );
  }

  function _shapeProps(obj) {
    if (obj._veltroWidget) {
      return _veltroWidgetProps(obj);
    }
    var fill = typeof obj.fill === "string" ? obj.fill : "#4a90e2";
    var stroke = obj.stroke || "transparent";
    var sw = obj.strokeWidth || 0;
    var op = Math.round((obj.opacity || 1) * 100);
    var fillNormalized = FB.design.normalizeColorForInput(fill);
    var strokeNormalized = FB.design.normalizeColorForInput(stroke === "transparent" ? "#000000" : stroke);
    var html = _posSize(obj);
    html += _brandSelectionPanel();
    html += _marketingWidgetProps(obj);
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Fill</div>' +
      '<div class="ds-color-row"><input id="shape-fill-color" name="shape-fill-color" type="color" class="ds-color-swatch" value="' +
      fillNormalized +
      '" onchange="FB.design.props.setProp(\'fill\',this.value)"/>' +
      '<input id="shape-fill-hex" name="shape-fill-hex" class="ds-input" value="' +
      fill +
      '" onchange="FB.design.props.setProp(\'fill\',this.value)"/></div></div>';
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Stroke</div>' +
      '<div class="ds-prop-row">' +
      '<input id="shape-stroke-color" name="shape-stroke-color" type="color" class="ds-color-swatch" value="' +
      strokeNormalized +
      '" onchange="FB.design.props.setProp(\'stroke\',this.value)"/>' +
      '<input id="shape-stroke-width" name="shape-stroke-width" class="ds-input" type="number" value="' +
      sw +
      '" placeholder="Width" onchange="FB.design.props.setProp(\'strokeWidth\',+this.value)"/>' +
      "</div></div>";
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Opacity</div>' +
      '<input id="shape-opacity" name="shape-opacity" class="ds-input" type="range" min="0" max="100" value="' +
      op +
      '" oninput="FB.design.props.setProp(\'opacity\',this.value/100)"/></div>';
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Flip</div>' +
      '<div class="ds-prop-row">' +
      '<button class="ds-sm-btn" onclick="FB.design.props.flipH()" title="Flip Horizontal">⟷ H</button>' +
      '<button class="ds-sm-btn" onclick="FB.design.props.flipV()" title="Flip Vertical">⟨⟩ V</button>' +
      '</div></div>';
    if (obj.type === "rect") {
      html +=
        '<div class="ds-prop-group"><div class="ds-prop-label">Corner Radius</div>' +
        '<input id="shape-radius" name="shape-radius" class="ds-input" type="number" value="' +
        (obj.rx || 0) +
        "\" onchange=\"FB.design.props.setPropXY('rx','ry',+this.value)\"/></div>";
    }
    html += _imageSlotSection(obj);
    html += _shadowSection(obj);
    html += _motionSection(obj);
    return html;
  }

  function _marketingChildren(obj) {
    return obj && obj.type === "group" && obj._objects ? obj._objects : [];
  }

  function _marketingHasName(obj, re) {
    return re.test(String((obj && obj.name) || ""));
  }

  function _marketingChild(obj, re, type) {
    return _marketingChildren(obj).filter(function (child) {
      return child && (!type || child.type === type) && _marketingHasName(child, re);
    })[0] || null;
  }

  function _marketingColor(obj, re, fallback) {
    var child = _marketingChild(obj, re);
    return FB.design.normalizeColorForInput((child && child.fill) || fallback);
  }

  function _marketingRadius(obj) {
    var child = _marketingChild(obj, /(Background|Card|Strip bg|CTA bg|Badge bg|Label bg|Urgency bg|Image slot)/, "rect");
    return Math.round((child && child.rx) || 0);
  }

  function _marketingTextValue(obj, kind) {
    var re = kind === "cta" ? /\/ CTA$/ : /\/ (Badge|Label|Urgency)$/;
    var child = _marketingChild(obj, re, "i-text");
    return child ? child.text || "" : "";
  }

  function _marketingCopyFields(obj) {
    var fields = _marketingChildren(obj).map(function (child, index) {
      if (!child || child.type !== "i-text") return "";
      var name = String(child.name || "");
      if (/\/ Image label$/.test(name)) return "";
      var label = name.split(" / ").pop() || "Text";
      var value = child.text || "";
      var rows = value.indexOf("\n") !== -1 || value.length > 48 ? 3 : 1;
      if (rows > 1) {
        return (
          '<label class="ds-mini-label">' + FB.design._esc(label) + '</label>' +
          '<textarea class="ds-input" rows="' + rows + '" oninput="FB.design.props.setMarketingLayerText(' + index + ',this.value)">' +
          FB.design._esc(value) +
          '</textarea>'
        );
      }
      return (
        '<label class="ds-mini-label">' + FB.design._esc(label) + '</label>' +
        '<input class="ds-input" value="' + FB.design._esc(value) + '" oninput="FB.design.props.setMarketingLayerText(' + index + ',this.value)">'
      );
    }).filter(Boolean);
    if (!fields.length) return "";
    return (
      '<div class="ds-prop-group ds-marketing-copy-props">' +
      '<div class="ds-prop-label">Copy</div>' +
      fields.join("") +
      '</div>'
    );
  }

  function _marketingWidgetProps(obj) {
    if (!obj || !obj._dsMarketingWidget) return "";
    var type = obj._dsMarketingType || "";
    var variant = obj._dsMarketingVariant || "";
    var accent = _marketingColor(obj, /(CTA bg|Badge bg|Label bg|Urgency bg|Accent bar|Stars|Rating|Category|Metric|Avatar bg|Bullet .* dot|Price)/, "#cdfe00");
    var bg = _marketingColor(obj, /(Background|Card|Strip bg)/, "#101014");
    var radius = _marketingRadius(obj);
    var cta = _marketingTextValue(obj, "cta");
    var badge = _marketingTextValue(obj, "badge");
    var variantOptions = FB.design.elements && FB.design.elements._marketingVariantOptions
      ? FB.design.elements._marketingVariantOptions(type, variant)
      : "";
    return (
      '<div class="ds-prop-group ds-marketing-props">' +
      '<div class="ds-prop-label">Marketing Widget</div>' +
      '<label class="ds-mini-label">Variant</label>' +
      '<select class="ds-select" onchange="FB.design.props.regenerateMarketingVariant(this.value)">' +
      variantOptions +
      '</select>' +
      '<label class="ds-mini-label">Theme</label>' +
      '<select class="ds-select" onchange="FB.design.props.setMarketingTheme(this.value)">' +
      '<option value="">Custom</option>' +
      '<option value="dark">Dark</option>' +
      '<option value="light">Light</option>' +
      '<option value="premium">Premium</option>' +
      '<option value="sale">Sale</option>' +
      '<option value="tech">Tech</option>' +
      '</select>' +
      '<div class="ds-motion-grid">' +
      '<label>Accent<input type="color" class="ds-color-swatch" value="' + accent + '" oninput="FB.design.props.setMarketingAccent(this.value)"></label>' +
      '<label>Background<input type="color" class="ds-color-swatch" value="' + bg + '" oninput="FB.design.props.setMarketingBackground(this.value)"></label>' +
      '</div>' +
      '<label class="ds-mini-label">Corner Radius</label>' +
      '<input class="ds-input" type="range" min="0" max="24" step="1" value="' + radius + '" oninput="this.nextElementSibling.value=this.value;FB.design.props.setMarketingRadius(+this.value)">' +
      '<input class="ds-input" type="number" min="0" max="24" value="' + radius + '" onchange="FB.design.props.setMarketingRadius(+this.value)" style="margin-top:6px">' +
      '<label class="ds-mini-label">CTA Text</label>' +
      '<input class="ds-input" value="' + FB.design._esc(cta) + '" oninput="FB.design.props.setMarketingText(\'cta\',this.value)">' +
      '<label class="ds-mini-label">Badge / Label Text</label>' +
      '<input class="ds-input" value="' + FB.design._esc(badge) + '" oninput="FB.design.props.setMarketingText(\'badge\',this.value)">' +
      _marketingCopyFields(obj) +
      '<label class="ds-mini-label">Fit Layout</label>' +
      '<div class="ds-motion-presets">' +
      '<button class="ds-sm-btn" onclick="FB.design.props.fitMarketingWidget(\'square\')">Square</button>' +
      '<button class="ds-sm-btn" onclick="FB.design.props.fitMarketingWidget(\'story\')">Story</button>' +
      '<button class="ds-sm-btn" onclick="FB.design.props.fitMarketingWidget(\'banner\')">Banner</button>' +
      '<button class="ds-sm-btn" onclick="FB.design.props.fitMarketingWidget(\'hero\')">Hero</button>' +
      '<button class="ds-sm-btn" onclick="FB.design.props.fitMarketingWidget(\'social\')">Social</button>' +
      '</div>' +
      '<button class="ds-sm-btn" style="width:100%;margin-top:8px" onclick="FB.design.elements.saveMarketingPreset()">Save as marketing preset</button>' +
      '<button class="ds-sm-btn" style="width:100%;margin-top:8px" onclick="FB.design.canvas.ungroup()">Ungroup for full editing</button>' +
      '</div>'
    );
  }

  function _imageSlotSection(obj) {
    var slot = FB.design.elements && FB.design.elements.imageSlotFor ? FB.design.elements.imageSlotFor(obj) : null;
    if (!slot) return "";
    var label = slot._dsImageSlotPrefix || "Marketing";
    return (
      '<div class="ds-prop-group ds-image-slot-tools">' +
      '<div class="ds-prop-label">Image Slot</div>' +
      '<div class="ds-mini-label">' + FB.design._esc(label) + '</div>' +
      '<button class="ds-action-btn" style="width:100%;justify-content:center" onclick="FB.design.props.replaceSlotImage()">Replace Image</button>' +
      '<button class="ds-sm-btn" style="width:100%;margin-top:6px" onclick="FB.design.switchLeftTab(\'media\')">Choose from Media</button>' +
      '</div>'
    );
  }

  function _veltroWidgetProps(obj) {
    var props = obj._veltroProps || {};
    var type = obj._veltroWidget || "kineticText";
    var textValue = props.text || props.title || props.words || props.contentTitle || props.content || props.spotlightText || ((props.items || []).join(", ")) || "";
    var color1 = FB.design.normalizeColorForInput(_veltroValue(props, ["color1", "textColor", "particleColor", "magnetColor"], "#cdfe00"));
    var color2 = FB.design.normalizeColorForInput(_veltroValue(props, ["color2", "dualColour2", "wellColor", "glowColor"], "#3b82f6"));
    var accent = FB.design.normalizeColorForInput(_veltroValue(props, ["color3", "accentColor", "scrambleColor"], "#ec4899"));
    var bgRaw = _veltroValue(props, ["bg", "bgColor"], "#0d0d1a");
    var bg = FB.design.normalizeColorForInput(bgRaw);
    var particleCount = _veltroNumber(props, ["particleCount", "itemsCount", "count"], 120);
    var force = _veltroNumber(props, ["mouseForce", "fieldStrength", "gravityStrength", "gravity", "intensity"], 1);
    var speed = _veltroNumber(props, ["speed", "rotationSpeed", "animationSpeed"], 0.05);
    var mode = _veltroValue(props, ["fluidMode", "fieldMode", "animationType", "mode"], "flow");
    var fontSize = _veltroNumber(props, ["fontSize", "textSize"], 56);

    var html = _posSize(obj);
    html += _brandSelectionPanel();
    html +=
      '<div class="ds-prop-group ds-veltro-props">' +
      '<div class="ds-prop-label" style="display:flex;align-items:center;justify-content:space-between;">' +
      '<span>Veltro Engine</span>' +
      '<button class="ds-sm-btn" onclick="FB.design.props.refreshVeltroWidget()" title="Refresh live widget">↻</button>' +
      '</div>' +
      '<select class="ds-select" onchange="FB.design.props.setVeltroWidget(this.value)">' +
      (FB.design.elements && FB.design.elements._veltroOptions ? FB.design.elements._veltroOptions(type) : '<option>' + type + '</option>') +
      '</select>' +
      '<label class="ds-mini-label">' + _veltroContentLabel(type) + '</label>' +
      '<textarea class="ds-input" rows="3" oninput="FB.design.props.setVeltroText(this.value)">' + FB.design._esc(textValue) + '</textarea>' +
      (_veltroGroup(type) === "text"
        ? '<div class="ds-motion-grid">' +
          '<label>Text X<input id="ds-veltro-text-x" name="ds-veltro-text-x" class="ds-input" type="number" min="-50" max="50" step="1" value="' + _veltroNumber(props, ["textX"], 0) + '" oninput="FB.design.props.setVeltroProp(\'textX\',+this.value)"></label>' +
          '<label>Text Y<input id="ds-veltro-text-y" name="ds-veltro-text-y" class="ds-input" type="number" min="-50" max="50" step="1" value="' + _veltroNumber(props, ["textY"], 0) + '" oninput="FB.design.props.setVeltroProp(\'textY\',+this.value)"></label>' +
          '</div>'
        : '') +
      '<div class="ds-motion-grid">' +
      '<label>Primary<input type="color" class="ds-color-swatch" value="' + color1 + '" oninput="FB.design.props.setVeltroColor(\'primary\',this.value)"></label>' +
      '<label>Secondary<input type="color" class="ds-color-swatch" value="' + color2 + '" oninput="FB.design.props.setVeltroColor(\'secondary\',this.value)"></label>' +
      '</div>' +
      '<div class="ds-motion-grid">' +
      '<label>Accent<input type="color" class="ds-color-swatch" value="' + accent + '" oninput="FB.design.props.setVeltroColor(\'accent\',this.value)"></label>' +
      '<label>Text Size<input class="ds-input" type="number" min="8" max="220" step="1" value="' + fontSize + '" oninput="FB.design.props.setVeltroProp(\'fontSize\',+this.value)"></label>' +
      '</div>' +
      '<label class="ds-mini-label">Background</label>' +
      '<div class="ds-color-row"><input type="color" class="ds-color-swatch" value="' + bg + '" oninput="FB.design.props.setVeltroBackground(this.value)">' +
      '<input class="ds-input" value="' + FB.design._esc(bgRaw) + '" oninput="FB.design.props.setVeltroBackground(this.value)"></div>' +
      '<div class="ds-motion-grid">' +
      '<label>Particles<input class="ds-input" type="number" min="5" max="1200" value="' + particleCount + '" oninput="FB.design.props.setVeltroProp(\'particleCount\',+this.value)"></label>' +
      '<label>Force<input class="ds-input" type="number" min="0" max="20" step="0.1" value="' + force + '" oninput="FB.design.props.setVeltroForce(+this.value)"></label>' +
      '</div>' +
      '<div class="ds-motion-grid">' +
      '<label>Speed<input class="ds-input" type="number" min="0" max="5" step="0.01" value="' + speed + '" oninput="FB.design.props.setVeltroSpeed(+this.value)"></label>' +
      '<label>Mode<select class="ds-select" onchange="FB.design.props.setVeltroMode(this.value)">' + _veltroModeOptions(type, mode) + '</select></label>' +
      '</div>' +
      _veltroSpecificProps(type, props) +
      '<div class="ds-prop-group">' +
      '<label class="ds-mini-label">Lines / Trails Preset</label>' +
      '<select class="ds-select" onchange="FB.design.props.setVeltroPreset(this.value)" style="width: 100%">' +
      '<option value="">Select preset...</option>' +
      '<option value="calm">Calm</option>' +
      '<option value="active">Active</option>' +
      '<option value="wild">Wild</option>' +
      '<option value="premium">Premium</option>' +
      '<option value="minimal">Minimal</option>' +
      '<option value="showcase">Showcase</option>' +
      '</select>' +
      '</div>' +
      '</div>';
    return html;
  }

  function _veltroValue(props, keys, fallback) {
    for (var i = 0; i < keys.length; i++) {
      if (props[keys[i]] !== undefined && props[keys[i]] !== null && props[keys[i]] !== "") return props[keys[i]];
    }
    return fallback;
  }

  function _veltroNumber(props, keys, fallback) {
    var value = _veltroValue(props, keys, fallback);
    var n = +value;
    return Number.isFinite(n) ? n : fallback;
  }

  function _veltroModeOptions(type, current) {
    var group = _veltroGroup(type);
    var options = {
      text: [["flow", "Flow"], ["wave", "Wave"], ["scramble", "Scramble"], ["reveal", "Reveal"], ["morph", "Morph"], ["proximity", "Proximity"]],
      physics: [["flow", "Flow"], ["attract", "Attract"], ["repel", "Repel"], ["orbit", "Orbit"], ["collision", "Collision"], ["dipole", "Dipole"], ["swirl", "Swirl"]],
      cursor: [["trail", "Trail"], ["magnetic", "Magnetic"], ["spotlight", "Spotlight"], ["lens", "Lens"], ["ripple", "Ripple"], ["distort", "Distort"]],
      ambient: [["flow", "Flow"], ["aurora", "Aurora"], ["nebula", "Nebula"], ["grain", "Grain"], ["gradient", "Gradient"], ["holographic", "Holographic"]],
      spatial: [["parallax", "Parallax"], ["orbit", "Orbit"], ["tilt", "Tilt"], ["isometric", "Isometric"], ["carousel", "Carousel"], ["depth", "Depth"]],
      scroll: [["velocity", "Velocity"], ["sticky", "Sticky"], ["progress", "Progress"], ["parallax", "Parallax"], ["fluid", "Fluid"]],
    };
    var list = options[group] || options.ambient;
    if (!list.some(function (item) { return item[0] === current; })) list.unshift([current, current]);
    return list.map(function (item) {
      return '<option value="' + FB.design._esc(item[0]) + '"' + (item[0] === current ? " selected" : "") + ">" + FB.design._esc(item[1]) + "</option>";
    }).join("");
  }

  function _veltroGroup(type) {
    var t = String(type || "").toLowerCase();
    if (/text|type|scramble|counter|word|wave/.test(t)) return "text";
    if (/physics|gravity|collision|cloth|pendulum|fluid|magneticfields|blackhole/.test(t)) return "physics";
    if (/cursor|trail|spotlight|lens|sampler|distortion|magnetictext/.test(t)) return "cursor";
    if (/scroll|velocity|sticky|progress/.test(t)) return "scroll";
    if (/3d|carousel|isometric|parallax|depth|islands|layout|grid|canvas|tilt/.test(t)) return "spatial";
    return "ambient";
  }

  function _veltroContentLabel(type) {
    var t = String(type || "");
    if (t === "morphingText" || t === "typewriterReveal") return "Words / Text";
    if (t === "physicsSandbox") return "Physics Text Items";
    if (_veltroGroup(type) === "text") return "Text Content";
    return "Text / Items";
  }

  function _veltroSpecificProps(type, props) {
    var group = _veltroGroup(type);
    var html = '<div class="ds-prop-group ds-veltro-advanced"><div class="ds-prop-label">Widget Controls</div>';
    if (group === "text") {
      html += _veltroControl("Font Weight", "fontWeight", _veltroNumber(props, ["fontWeight", "weight"], 800), 100, 900, 50);
      html += _veltroControl("Letter Spacing", "letterSpacing", _veltroNumber(props, ["letterSpacing"], 0), -8, 24, 1);
      html += _veltroControl("Amplitude", "amplitude", _veltroNumber(props, ["amplitude"], 24), 0, 120, 1);
      html += _veltroControl("Frequency", "frequency", _veltroNumber(props, ["frequency"], 0.12), 0, 2, 0.01);
      html += _veltroControl("Morph / Fade Speed", "morphSpeed", _veltroNumber(props, ["morphSpeed", "fadeSpeed", "scrambleSpeed"], 800), 50, 5000, 50);
      html += _veltroSelect("Character Motion", "charAnimation", _veltroValue(props, ["charAnimation"], "wave"), [["wave", "Wave"], ["scramble", "Scramble"], ["bounce", "Bounce"], ["magnetic", "Magnetic"]]);
      html += _veltroSelect("Text Transform", "textTransform", _veltroValue(props, ["textTransform"], "none"), [["none", "None"], ["uppercase", "Uppercase"], ["lowercase", "Lowercase"], ["capitalize", "Capitalize"]]);
    } else if (group === "physics") {
      html += _veltroControl("Gravity", "gravity", _veltroNumber(props, ["gravity"], 1), 0, 10, 0.1);
      html += _veltroControl("Restitution", "restitution", _veltroNumber(props, ["restitution"], 0.78), 0, 1, 0.01);
      html += _veltroControl("Friction", "friction", _veltroNumber(props, ["friction"], 0.04), 0, 1, 0.01);
      html += _veltroControl("Turbulence", "fluidTurbulence", _veltroNumber(props, ["fluidTurbulence", "turbulence"], 0.45), 0, 2, 0.01);
      html += _veltroControl("Wells / Fields", "wellCount", _veltroNumber(props, ["wellCount", "fieldCount"], 3), 1, 12, 1);
    } else if (group === "cursor") {
      html += _veltroControl("Radius", "radius", _veltroNumber(props, ["radius", "magnetRadius", "lensSize"], 180), 20, 600, 1);
      html += _veltroControl("Trail Length", "trailLength", _veltroNumber(props, ["trailLength"], 28), 1, 160, 1);
      html += _veltroControl("Particle Size", "particleSize", _veltroNumber(props, ["particleSize"], 4), 1, 40, 1);
      html += _veltroControl("Zoom", "zoom", _veltroNumber(props, ["zoom"], 1.8), 1, 5, 0.1);
    } else if (group === "scroll") {
      html += _veltroControl("Scroll Strength", "scrollStrength", _veltroNumber(props, ["scrollStrength", "skewStrength"], 0.6), 0, 4, 0.05);
      html += _veltroControl("Depth", "depth", _veltroNumber(props, ["depth"], 0.35), 0, 2, 0.01);
      html += _veltroControl("Sections", "sections", _veltroNumber(props, ["sections", "itemsCount"], 4), 1, 12, 1);
    } else if (group === "spatial") {
      html += _veltroControl("Depth", "depth", _veltroNumber(props, ["depth"], 0.35), 0, 2, 0.01);
      html += _veltroControl("Perspective", "perspective", _veltroNumber(props, ["perspective"], 900), 100, 2400, 10);
      html += _veltroControl("Layers", "layerCount", _veltroNumber(props, ["layerCount", "itemsCount"], 5), 1, 18, 1);
      html += _veltroControl("Rotation", "rotationSpeed", _veltroNumber(props, ["rotationSpeed"], 0.05), 0, 1, 0.01);
    } else {
      html += _veltroControl("Intensity", "intensity", _veltroNumber(props, ["intensity"], 0.7), 0, 2, 0.01);
      html += _veltroControl("Glow", "glowIntensity", _veltroNumber(props, ["glowIntensity"], 0.8), 0, 2, 0.01);
      html += _veltroControl("Blur", "blur", _veltroNumber(props, ["blur"], 18), 0, 80, 1);
      html += _veltroControl("Scale", "scale", _veltroNumber(props, ["scale"], 1), 0.1, 4, 0.05);
    }
    html += '<label class="ds-check-row"><input type="checkbox" ' + (_veltroValue(props, ["glowEffect", "fluidGlow", "particleGlow"], true) ? "checked" : "") + ' onchange="FB.design.props.setVeltroGlow(this.checked)"> Glow</label>';
    html += '<label class="ds-check-row"><input type="checkbox" ' + (_veltroValue(props, ["connectionLines", "fieldLines", "particleTrail"], false) ? "checked" : "") + ' onchange="FB.design.props.setVeltroLines(this.checked)"> Lines / Trails</label>';
    html += "</div>";
    return html;
  }

  function _veltroControl(label, key, value, min, max, step) {
    return (
      '<label class="ds-veltro-control">' +
      '<span>' + FB.design._esc(label) + '<output>' + FB.design._esc(value) + '</output></span>' +
      '<input class="ds-input" type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + value + '" ' +
      'oninput="this.previousElementSibling.querySelector(\'output\').textContent=this.value;FB.design.props.setVeltroProp(\'' + key + '\',+this.value)">' +
      '</label>'
    );
  }

  function _veltroSelect(label, key, value, options) {
    return (
      '<label class="ds-mini-label">' + FB.design._esc(label) + '</label>' +
      '<select class="ds-select" onchange="FB.design.props.setVeltroProp(\'' + key + '\',this.value)">' +
      options.map(function (item) {
        return '<option value="' + FB.design._esc(item[0]) + '"' + (item[0] === value ? " selected" : "") + ">" + FB.design._esc(item[1]) + "</option>";
      }).join("") +
      '</select>'
    );
  }

  function _textProps(obj) {
    var isBold = obj.fontWeight === "bold" || +obj.fontWeight >= 700;
    var isItalic = obj.fontStyle === "italic";
    var isUnder = !!obj.underline;
    var lineH = +(obj.lineHeight || 1.2).toFixed(1);
    var spacing = +(obj.charSpacing || 0);
    var html = _posSize(obj);
    html += _brandSelectionPanel();

    // Font family
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Font</div>' +
      '<select id="text-font" name="text-font" class="ds-select" onchange="FB.design.props.setProp(\'fontFamily\',this.value)">' +
      GOOGLE_FONTS.map(function (f) {
        return (
          "<option" +
          (obj.fontFamily === f ? " selected" : "") +
          ">" +
          f +
          "</option>"
        );
      }).join("") +
      "</select></div>";

    // Size + B/I/U
    var hasStrike = obj.linethrough;
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Size &amp; Style</div>' +
      '<div class="ds-prop-row" style="align-items:center;">' +
      '<input id="text-size" name="text-size" class="ds-input" style="width:60px;flex-shrink:0" type="number" value="' +
      (obj.fontSize || 32) +
      '" onchange="FB.design.props.setProp(\'fontSize\',+this.value)"/>' +
      '<div style="display:flex;gap:3px;margin-left:4px;">' +
      '<button class="ds-toggle-btn' +
      (isBold ? " active" : "") +
      '" title="Bold" onclick="FB.design.props.toggleBold()"><b>B</b></button>' +
      '<button class="ds-toggle-btn' +
      (isItalic ? " active" : "") +
      '" title="Italic" onclick="FB.design.props.setProp(\'fontStyle\',\'' +
      (isItalic ? "normal" : "italic") +
      "')\"><i>I</i></button>" +
      '<button class="ds-toggle-btn' +
      (isUnder ? " active" : "") +
      '" title="Underline" onclick="FB.design.props.setProp(\'underline\',' +
      !isUnder +
      ')"><u>U</u></button>' +
      '<button class="ds-toggle-btn' +
      (hasStrike ? " active" : "") +
      '" title="Strikethrough" onclick="FB.design.props.setProp(\'linethrough\',' +
      !hasStrike +
      ')"><s>S</s></button>' +
      "</div></div></div>";

    // Font weight
    var weights = ["300", "400", "500", "600", "700", "800"];
    var currentWeight = String(obj.fontWeight || 400);
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Weight</div>' +
      '<select class="ds-select" onchange="FB.design.props.setProp(\'fontWeight\',this.value)">' +
      weights.map(function(w) {
        return '<option value="' + w + '"' + (currentWeight === w ? ' selected' : '') + '>' + (w === '300' ? 'Light' : w === '400' ? 'Regular' : w === '500' ? 'Medium' : w === '600' ? 'SemiBold' : w === '700' ? 'Bold' : 'ExtraBold') + '</option>';
      }).join('') +
      '</select></div>';

    // Colour
    var textColor = FB.design.normalizeColorForInput(obj.fill || "#000000");
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Colour</div>' +
      '<div class="ds-color-row"><input type="color" class="ds-color-swatch" value="' +
      textColor +
      '" onchange="FB.design.props.setProp(\'fill\',this.value)"/>' +
      '<input class="ds-input" value="' +
      (obj.fill || "#000000") +
      '" onchange="FB.design.props.setProp(\'fill\',this.value)"/></div></div>';

    // Text Transform
    var textTransform = obj.textTransform || "none";
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Transform</div>' +
      '<select class="ds-select" onchange="FB.design.props.setProp(\'textTransform\',this.value)">' +
      '<option value="none"' + (textTransform === 'none' ? ' selected' : '') + '>Normal</option>' +
      '<option value="uppercase"' + (textTransform === 'uppercase' ? ' selected' : '') + '>UPPERCASE</option>' +
      '<option value="lowercase"' + (textTransform === 'lowercase' ? ' selected' : '') + '>lowercase</option>' +
      '<option value="capitalize"' + (textTransform === 'capitalize' ? ' selected' : '') + '>Capitalize</option>' +
      '</select></div>';

    // Align
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Align</div><div class="ds-btn-row">' +
      [
        ["left", "⊢"],
        ["center", "≡"],
        ["right", "⊣"],
      ]
        .map(function (a) {
          return (
            '<button class="ds-sm-btn' +
            (obj.textAlign === a[0] ? " active" : "") +
            "\" onclick=\"FB.design.props.setProp('textAlign','" +
            a[0] +
            "')\">" +
            a[1] +
            "</button>"
          );
        })
        .join("") +
      "</div></div>";

    // Opacity
    var textOpacity = Math.round((obj.opacity || 1) * 100);
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label" style="display:flex;justify-content:space-between">Opacity <output style="font-size:9px;color:#aaa">' +
      textOpacity +
      '%</output></div>' +
      '<input class="ds-input" type="range" min="0" max="100" value="' +
      textOpacity +
      '" oninput="this.previousElementSibling.querySelector(\'output\').textContent=this.value+\'%\';FB.design.props.setProp(\'opacity\',this.value/100)"/></div>';

    // Line height
    html +=
      '<div class="ds-prop-group">' +
      '<div class="ds-prop-label" style="display:flex;justify-content:space-between">Line Height <output style="font-size:9px;color:#aaa">' +
      lineH +
      "</output></div>" +
      '<input id="text-line-height" name="text-line-height" class="ds-input" type="range" min="0.8" max="3.0" step="0.1" value="' +
      lineH +
      "\" oninput=\"this.previousElementSibling.querySelector('output').value=parseFloat(this.value).toFixed(1);FB.design.props.setProp('lineHeight',+this.value)\"/>" +
      "</div>";

    // Letter spacing
    html +=
      '<div class="ds-prop-group">' +
      '<div class="ds-prop-label" style="display:flex;justify-content:space-between">Letter Spacing <output style="font-size:9px;color:#aaa">' +
      spacing +
      "</output></div>" +
      '<input id="text-letter-spacing" name="text-letter-spacing" class="ds-input" type="range" min="-100" max="500" step="10" value="' +
      spacing +
      "\" oninput=\"this.previousElementSibling.querySelector('output').value=this.value;FB.design.props.setProp('charSpacing',+this.value)\"/>" +
      "</div>";

    // Shadow
    html += _shadowSection(obj);
    html += _motionSection(obj);

    return html;
  }

  function _imageProps(obj) {
    var op = Math.round((obj.opacity || 1) * 100);
    var html = _posSize(obj);
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Opacity</div>' +
      '<input class="ds-input" type="range" min="0" max="100" value="' +
      op +
      '" oninput="FB.design.props.setProp(\'opacity\',this.value/100)"/></div>';
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Flip</div><div class="ds-btn-row">' +
      '<button class="ds-sm-btn" onclick="FB.design.props.flip(\'X\')">Flip H</button>' +
      '<button class="ds-sm-btn" onclick="FB.design.props.flip(\'Y\')">Flip V</button>' +
      "</div></div>";
    html += _motionSection(obj);
    return html;
  }

  function _canvasProps(fc) {
    var canvasBgColor = FB.design.normalizeColorForInput(FB.design._canvasBg || "#ffffff");
    var snap = FB.design.canvas && FB.design.canvas.snapSettings ? FB.design.canvas.snapSettings() : { enabled: true, guides: true, threshold: 8, margin: 24 };
    return (
      '<div class="ds-prop-group"><div class="ds-prop-label">Canvas Background</div>' +
      '<div class="ds-color-row"><input type="color" class="ds-color-swatch" value="' +
      canvasBgColor +
      '" onchange="FB.design.props.setCanvasBg(this.value)"/>' +
      '<input class="ds-input" value="' +
      (FB.design._canvasBg || "#ffffff") +
      '" onchange="FB.design.props.setCanvasBg(this.value)"/></div></div>' +
      '<div class="ds-prop-group ds-snap-props">' +
      '<div class="ds-prop-label">Snapping</div>' +
      '<label class="ds-check-row"><input type="checkbox" ' + (snap.enabled ? "checked" : "") + ' onchange="FB.design.props.setSnapSetting(\'enabled\',this.checked)"> Enable snapping</label>' +
      '<label class="ds-check-row"><input type="checkbox" ' + (snap.guides ? "checked" : "") + ' onchange="FB.design.props.setSnapSetting(\'guides\',this.checked)"> Show alignment guides</label>' +
      '<label class="ds-veltro-control"><span>Sensitivity <output>' + snap.threshold + 'px</output></span>' +
      '<input class="ds-input" type="range" min="1" max="24" step="1" value="' + snap.threshold + '" oninput="this.previousElementSibling.querySelector(\'output\').textContent=this.value+\'px\';FB.design.props.setSnapSetting(\'threshold\',+this.value)"></label>' +
      '<label class="ds-veltro-control"><span>Margin Guide <output>' + snap.margin + 'px</output></span>' +
      '<input class="ds-input" type="range" min="0" max="120" step="1" value="' + snap.margin + '" oninput="this.previousElementSibling.querySelector(\'output\').textContent=this.value+\'px\';FB.design.props.setSnapSetting(\'margin\',+this.value)"></label>' +
      '<div class="ds-mini-label">Hold Alt while moving or resizing to bypass snapping.</div>' +
      '</div>' +
      _brandKitPanel()
    );
  }

  function setProp(key, val) {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj) return;
    obj.set(key, val);
    obj.setCoords();
    fc.renderAll();
    if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
    FB.design.history.push();
  }

  function setPropXY(kx, ky, val) {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj) return;
    obj.set(kx, val);
    obj.set(ky, val);
    obj.setCoords();
    fc.renderAll();
    if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
    FB.design.history.push();
  }

  function setWidth(val) {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj) return;
    obj.scaleToWidth(val);
    obj.setCoords();
    fc.renderAll();
    if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
    FB.design.history.push();
  }

  function setHeight(val) {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj) return;
    obj.scaleToHeight(val);
    obj.setCoords();
    fc.renderAll();
    if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
    FB.design.history.push();
  }

  function flip(axis) {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj) return;
    obj.set("flip" + axis, !obj["flip" + axis]);
    fc.renderAll();
    FB.design.history.push();
  }

  function flipH() {
    flip("X");
  }

  function flipV() {
    flip("Y");
  }

  function setCanvasBg(val) {
    var fc = FB.design.canvas.get();
    FB.design._canvasBg = val || "#ffffff";
    FB.design.applyCanvasSurfaceBg();
    fc.setBackgroundColor(FB.design._canvasBg, function () {
      fc.renderAll();
      FB.design.history.push();
    });
  }

  function setBrandKit(key, value) {
    var patch = {};
    if (key === "radius") value = Math.max(0, Math.min(24, +value || 0));
    patch[key] = value;
    _saveBrandKit(patch);
  }

  function _brandContrast(hex) {
    var c = FB.design.normalizeColorForInput(hex || "#cdfe00").replace("#", "");
    var r = parseInt(c.slice(0, 2), 16);
    var g = parseInt(c.slice(2, 4), 16);
    var b = parseInt(c.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#111111" : "#ffffff";
  }

  function _applyBrandToObject(obj, kit) {
    if (!obj) return;
    var name = String(obj.name || "");
    if (obj.type === "i-text") {
      obj.set({
        fill: /CTA|Badge|Label|Urgency/.test(name) ? _brandContrast(kit.primary) : kit.text,
        fontFamily: /Headline|Title|Name|Price|Metric/.test(name) ? kit.headingFont : kit.bodyFont,
      });
      return;
    }
    if (obj.type === "rect") {
      if (/Background|Card|Strip bg/.test(name)) obj.set("fill", kit.background);
      else if (/CTA bg|Badge bg|Label bg|Urgency bg|Accent bar|Bullet \d+ dot|Avatar bg/.test(name)) obj.set("fill", kit.primary);
      else if (/Guarantee bg|Metric pill bg|Chip \d+ bg|Image slot/.test(name)) obj.set("fill", kit.secondary);
      else obj.set("fill", kit.primary);
      obj.set({ rx: kit.radius, ry: kit.radius });
      if (obj.stroke && obj.stroke !== "transparent") obj.set("stroke", kit.accent);
      return;
    }
    if (obj.type === "circle" || obj.type === "ellipse" || obj.type === "polygon" || obj.type === "triangle") {
      obj.set("fill", /Accent|Star|Rating|Metric|Price/.test(name) ? kit.accent : kit.primary);
      return;
    }
    if (obj.type === "line") {
      obj.set("stroke", kit.accent);
    }
  }

  function applyBrandToSelection() {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var kit = _brandKit();
    var objs = fc.getActiveObjects();
    if (!objs.length) return;
    objs.forEach(function (obj) {
      if (obj.type === "group" && obj._objects) {
        obj._objects.forEach(function (child) {
          _applyBrandToObject(child, kit);
        });
        if (obj.addWithUpdate) obj.addWithUpdate();
      } else {
        _applyBrandToObject(obj, kit);
      }
      obj.dirty = true;
      obj.setCoords();
    });
    fc.renderAll();
    if (FB.design.layers) FB.design.layers.render();
    if (FB.design.props) FB.design.props.render();
    FB.design.history.push();
  }

  function _applyBrandToObjectTree(obj, kit) {
    if (!obj) return;
    if (obj.type === "group" && obj._objects) {
      obj._objects.forEach(function (child) {
        _applyBrandToObject(child, kit);
      });
      if (obj.addWithUpdate) obj.addWithUpdate();
    } else {
      _applyBrandToObject(obj, kit);
    }
    obj.dirty = true;
    obj.setCoords();
  }

  function applyBrandGlobally() {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var kit = _brandKit();
    fc.getObjects().forEach(function (obj) {
      _applyBrandToObjectTree(obj, kit);
    });
    FB.design._canvasBg = kit.background;
    FB.design.applyCanvasSurfaceBg();
    fc.setBackgroundColor(kit.background, function () {});
    fc.renderAll();
    if (FB.design.layers) FB.design.layers.render();
    if (FB.design.props) FB.design.props.render();
    if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
    FB.design.history.push();
    if (FB.util && FB.util.showToast) FB.util.showToast("Brand applied across canvas");
  }

  function applyBrandToCanvas() {
    setCanvasBg(_brandKit().background);
    render();
  }

  function captureBrandFromSelection() {
    var fc = FB.design.canvas.get();
    var obj = fc && fc.getActiveObject();
    if (!obj) return;
    var source = obj;
    if (obj.type === "group" && obj._objects) {
      source = obj._objects.filter(function (child) {
        return child && (child.type === "rect" || child.type === "i-text");
      })[0] || obj;
    }
    var patch = {};
    if (source.fill && typeof source.fill === "string") {
      if (source.type === "i-text") patch.text = source.fill;
      else patch.primary = source.fill;
    }
    if (source.fontFamily) {
      patch.headingFont = source.fontFamily;
      patch.bodyFont = source.fontFamily;
    }
    if (source.rx != null) patch.radius = Math.max(0, Math.min(24, Math.round(source.rx || 0)));
    _saveBrandKit(patch);
    render();
    if (FB.util && FB.util.showToast) FB.util.showToast("Brand kit updated from selection");
  }

  function setSnapSetting(key, value) {
    if (FB.design.canvas && FB.design.canvas.setSnapSetting) {
      FB.design.canvas.setSnapSetting(key, value);
    }
  }

  function updateVeltroObject(obj) {
    var fc = FB.design.canvas.get();
    if (!obj || !obj._veltroWidget) return;
    obj.setCoords();
    if (fc) fc.renderAll();
    if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
    FB.design.history.push();
  }

  function setVeltroProps(values, shouldRender) {
    var fc = FB.design.canvas.get();
    var obj = fc && fc.getActiveObject();
    if (!obj || !obj._veltroWidget) return;
    obj._veltroProps = Object.assign({}, obj._veltroProps || {}, values || {});
    updateVeltroObject(obj);
    if (shouldRender) render();
  }

  function setVeltroWidget(type) {
    var fc = FB.design.canvas.get();
    var obj = fc && fc.getActiveObject();
    if (!obj || !obj._veltroWidget) return;
    obj._veltroWidget = type;
    obj.name = "Veltro: " + type;
    obj._veltroProps = {};
    updateVeltroObject(obj);
    render();
  }

  function setVeltroProp(key, val) {
    var values = {};
    values[key] = val;
    if (key === "particleCount") {
      values.starCount = val;
      values.itemsCount = val;
      values.count = val;
    }
    if (key === "fontSize") {
      values.size = val;
      values.textSize = val;
    }
    if (key === "fontWeight") {
      values.weight = val;
    }
    if (key === "morphSpeed") {
      values.fadeSpeed = Math.max(50, Math.round(val / 4));
      values.scrambleSpeed = Math.max(10, Math.round(val / 20));
      values.multiTextDelay = val;
    }
    setVeltroProps(values, false);
  }

  function setVeltroText(value) {
    var parts = String(value || "").split(/[\n,]/).map(function (item) {
      return item.trim();
    }).filter(Boolean);
    var first = parts[0] || "";
    var second = parts[1] || "";
    setVeltroProps({
      text: first,
      title: first,
      label: first,
      content: first,
      contentTitle: first,
      contentSubtitle: second,
      spotlightText: first,
      words: parts.length ? parts.join(",") : first,
      items: parts.length ? parts : ["Veltro"],
    }, false);
  }

  function setVeltroColor(slot, value) {
    var fc = FB.design.canvas.get();
    var obj = fc && fc.getActiveObject();
    if (!obj || !obj._veltroWidget) return;
    console.log(`🎨 Setting ${obj._veltroWidget} ${slot} to ${value}`);
    var props = obj._veltroProps || {};
    var currentPrimary = slot === "primary" ? value : _veltroValue(props, ["color1", "textColor", "particleColor", "magnetColor"], "#cdfe00");
    var currentSecondary = slot === "secondary" ? value : _veltroValue(props, ["color2", "dualColour2", "wellColor", "glowColor"], "#3b82f6");
    var currentAccent = slot === "accent" ? value : _veltroValue(props, ["color3", "accentColor", "scrambleColor"], "#ec4899");
    var nebulaColors = [currentPrimary, currentSecondary, currentAccent].join(",");
    var maps = {
      primary: {
        color1: value,
        color: value,
        textColor: value,
        particleColor: value,
        magnetColor: value,
        starColor: value,
        highlightColor: value,
        cursorColor: value,
        nebulaColors: nebulaColors,
        itemColors: [value, "#3b82f6", "#ec4899", "#f59e0b", "#10b981"].join(","),
      },
      secondary: {
        color2: value,
        dualColour2: value,
        wellColor: value,
        glowColor: value,
        fieldColor: value,
        magnetColor: value,
        lineColor: value,
        nebulaColors: nebulaColors,
      },
      accent: {
        color3: value,
        accentColor: value,
        scrambleColor: value,
        hoverColor: value,
        nebulaColors: nebulaColors,
      },
    };
    setVeltroProps(maps[slot] || { color1: value }, false);
    render();
  }

  function setVeltroBackground(value) {
    var fc = FB.design.canvas.get();
    var obj = fc && fc.getActiveObject();
    if (!obj || !obj._veltroWidget) return;
    setVeltroProps({
      bg: value,
      bgColor: value,
      bgGradientColor1: value,
    }, false);
    render();
  }

  function setVeltroSpeed(value) {
    setVeltroProps({
      speed: value,
      rotationSpeed: value,
      animationSpeed: value,
    }, false);
  }

  function setVeltroForce(value) {
    setVeltroProps({
      mouseForce: value,
      fieldStrength: value,
      gravityStrength: value,
      gravity: value,
      intensity: value,
    }, false);
  }

  function setVeltroMode(value) {
    setVeltroProps({
      fluidMode: value,
      fieldMode: value,
      animationType: value,
      mode: value,
      effectMode: value,
    }, false);
  }

  function setVeltroGlow(enabled) {
    setVeltroProps({
      glowEffect: enabled,
      fluidGlow: enabled,
      particleGlow: enabled,
      glow: enabled,
    }, false);
  }

  function setVeltroLines(enabled) {
    setVeltroProps({
      connectionLines: enabled,
      fieldLines: enabled,
      particleTrail: enabled,
      showLines: enabled,
    }, false);
  }

  function refreshVeltroWidget() {
    var fc = FB.design.canvas.get();
    var obj = fc && fc.getActiveObject();
    if (!obj || !obj._veltroWidget) return;
    obj._veltroId = "ds-vw-" + Date.now();
    updateVeltroObject(obj);
    render();
  }

  function setVeltroPreset(kind) {
    var presets = {
      calm: { particleCount: 70, mouseForce: 2, fieldStrength: 0.25, gravityStrength: 0.25, speed: 0.025, intensity: 0.35 },
      active: { particleCount: 180, mouseForce: 6, fieldStrength: 0.65, gravityStrength: 0.65, speed: 0.06, intensity: 0.7 },
      wild: { particleCount: 360, mouseForce: 11, fieldStrength: 1.2, gravityStrength: 1.2, speed: 0.12, intensity: 1 },
      premium: { particleCount: 140, mouseForce: 4, fieldStrength: 0.55, gravityStrength: 0.45, speed: 0.035, intensity: 0.62, glowIntensity: 0.9, blur: 18 },
      minimal: { particleCount: 45, mouseForce: 1.2, fieldStrength: 0.18, gravityStrength: 0.18, speed: 0.018, intensity: 0.28, glowIntensity: 0.35, blur: 8 },
      showcase: { particleCount: 260, mouseForce: 7, fieldStrength: 0.82, gravityStrength: 0.72, speed: 0.075, intensity: 0.9, glowIntensity: 1.2, blur: 24 },
    };
    var fc = FB.design.canvas.get();
    var obj = fc && fc.getActiveObject();
    if (!obj || !obj._veltroWidget || !presets[kind]) return;
    obj._veltroProps = Object.assign({}, obj._veltroProps || {}, presets[kind]);
    updateVeltroObject(obj);
    render();
  }

  function _activeMarketingGroup() {
    var fc = FB.design.canvas.get();
    var obj = fc && fc.getActiveObject();
    return obj && obj._dsMarketingWidget && obj.type === "group" ? obj : null;
  }

  function _marketingApply(fn) {
    var fc = FB.design.canvas.get();
    var obj = _activeMarketingGroup();
    if (!fc || !obj) return;
    (obj._objects || []).forEach(function (child) {
      if (child) fn(child, String(child.name || ""));
    });
    if (obj.addWithUpdate) obj.addWithUpdate();
    obj.dirty = true;
    obj.setCoords();
    fc.renderAll();
    if (FB.design.layers) FB.design.layers.render();
    FB.design.history.push();
  }

  function _marketingContrast(hex) {
    var c = FB.design.normalizeColorForInput(hex || "#cdfe00").replace("#", "");
    var r = parseInt(c.slice(0, 2), 16);
    var g = parseInt(c.slice(2, 4), 16);
    var b = parseInt(c.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#111111" : "#ffffff";
  }

  function _marketingIsAccentName(name) {
    return /(CTA bg|Badge bg|Label bg|Urgency bg|Accent bar|Avatar bg|Bullet \d+ dot|Stars|Rating|Category|Metric$|Price$)/.test(name);
  }

  function _marketingIsAccentText(name) {
    return /\/ (CTA|Badge|Label|Urgency)$/.test(name);
  }

  function setMarketingAccent(value) {
    var textFill = _marketingContrast(value);
    _marketingApply(function (child, name) {
      if (/Accent wash|Accent triangle/.test(name)) {
        child.set("fill", value + "26");
      } else if (_marketingIsAccentName(name)) {
        child.set("fill", value);
      } else if (_marketingIsAccentText(name)) {
        child.set("fill", textFill);
      }
    });
  }

  function setMarketingBackground(value) {
    _marketingApply(function (child, name) {
      if (/(Background|Card|Strip bg)$/.test(name)) child.set("fill", value);
    });
  }

  function setMarketingRadius(value) {
    var radius = Math.max(0, Math.min(24, Number.isFinite(+value) ? +value : 0));
    _marketingApply(function (child, name) {
      if (child.type !== "rect") return;
      if (/Accent bar/.test(name)) {
        child.set({ rx: 0, ry: 0 });
      } else if (/(Background|Card|Strip bg|CTA bg|Badge bg|Label bg|Urgency bg|Guarantee bg|Metric pill bg|Image slot|Chip \d+ bg)/.test(name)) {
        child.set({ rx: radius, ry: radius });
      }
    });
  }

  function setMarketingText(kind, value) {
    var re = kind === "cta" ? /\/ CTA$/ : /\/ (Badge|Label|Urgency)$/;
    _marketingApply(function (child, name) {
      if (child.type === "i-text" && re.test(name)) child.set("text", String(value || ""));
    });
  }

  function setMarketingLayerText(index, value) {
    var fc = FB.design.canvas.get();
    var obj = _activeMarketingGroup();
    if (!fc || !obj || !obj._objects || !obj._objects[index]) return;
    var child = obj._objects[index];
    if (child.type !== "i-text") return;
    child.set("text", String(value || ""));
    if (obj.addWithUpdate) obj.addWithUpdate();
    obj.dirty = true;
    obj.setCoords();
    fc.renderAll();
    if (FB.design.layers) FB.design.layers.render();
    FB.design.history.push();
  }

  function setMarketingTheme(kind) {
    var themes = {
      dark: { bg: "#101014", accent: "#cdfe00", text: "#ffffff", muted: "#a7a7ad", panel: "#181820", stroke: "#2d2d35" },
      light: { bg: "#f7f7f2", accent: "#111111", text: "#111111", muted: "#52525b", panel: "#ffffff", stroke: "#d4d4d8" },
      premium: { bg: "#11100d", accent: "#f5f5f0", text: "#ffffff", muted: "#a7a29a", panel: "#1b1812", stroke: "#383126" },
      sale: { bg: "#130d10", accent: "#fb7185", text: "#ffffff", muted: "#e7b5bf", panel: "#211319", stroke: "#4a2630" },
      tech: { bg: "#0d1117", accent: "#7dd3fc", text: "#ffffff", muted: "#9fb6c8", panel: "#111827", stroke: "#263547" },
    };
    var t = themes[kind];
    if (!t) return;
    var accentText = _marketingContrast(t.accent);
    _marketingApply(function (child, name) {
      if (/(Background|Card|Strip bg)$/.test(name)) child.set("fill", t.bg);
      if (/(Guarantee bg|Metric pill bg|Chip \d+ bg|Image slot)/.test(name)) child.set("fill", t.panel);
      if (child.stroke && /(Background|Card|Strip bg|Guarantee bg|Metric pill bg|Image slot)/.test(name)) child.set("stroke", t.stroke);
      if (/Accent wash|Accent triangle/.test(name)) child.set("fill", t.accent + "26");
      else if (_marketingIsAccentName(name)) child.set("fill", t.accent);
      if (child.type === "i-text") {
        if (_marketingIsAccentText(name)) child.set("fill", accentText);
        else if (/(Headline|Title|Name|Quote|Avatar initial|Price)$/.test(name) && !/(Metric|Stars|Rating|Category)/.test(name)) child.set("fill", t.text);
        else if (/(Subhead|Copy|Trust line|Trust label|Role|Period|Guarantee|Metric label|Bullet \d+|Chip \d+|Image label)/.test(name)) child.set("fill", t.muted);
      }
    });
    render();
  }

  function regenerateMarketingVariant(variant) {
    var obj = _activeMarketingGroup();
    if (!obj || !FB.design.elements || !FB.design.elements.regenerateMarketingWidget) return;
    FB.design.elements.regenerateMarketingWidget(obj, variant);
  }

  function _marketingSlotBounds(slot) {
    slot.setCoords();
    var matrix = slot.calcTransformMatrix();
    var points = [
      new fabric.Point(0, 0),
      new fabric.Point(slot.width || 1, 0),
      new fabric.Point(slot.width || 1, slot.height || 1),
      new fabric.Point(0, slot.height || 1),
    ].map(function (point) {
      return fabric.util.transformPoint(point, matrix);
    });
    var xs = points.map(function (point) { return point.x; });
    var ys = points.map(function (point) { return point.y; });
    return {
      left: Math.min.apply(Math, xs),
      top: Math.min.apply(Math, ys),
      width: Math.max(1, Math.max.apply(Math, xs) - Math.min.apply(Math, xs)),
      height: Math.max(1, Math.max.apply(Math, ys) - Math.min.apply(Math, ys)),
    };
  }

  function _marketingRefreshSlotImages(group) {
    var fc = FB.design.canvas.get();
    if (!fc || !group) return;
    (group._objects || []).forEach(function (slot) {
      if (!slot || !slot._dsImageSlot || !slot._dsImageSlotId) return;
      var img = fc.getObjects().filter(function (item) {
        return item && item._dsSlotImage && item._dsSlotImageFor === slot._dsImageSlotId;
      })[0];
      if (!img) return;
      var bounds = _marketingSlotBounds(slot);
      var imageEl = img.getElement ? img.getElement() : null;
      var intrinsicW = img.width || (imageEl && (imageEl.naturalWidth || imageEl.width)) || bounds.width;
      var intrinsicH = img.height || (imageEl && (imageEl.naturalHeight || imageEl.height)) || bounds.height;
      var scale = Math.max(bounds.width / intrinsicW, bounds.height / intrinsicH);
      img.set({
        width: intrinsicW,
        height: intrinsicH,
        left: bounds.left + (bounds.width - intrinsicW * scale) / 2,
        top: bounds.top + (bounds.height - intrinsicH * scale) / 2,
        scaleX: scale,
        scaleY: scale,
        clipPath: new fabric.Rect({
          left: bounds.left,
          top: bounds.top,
          width: bounds.width,
          height: bounds.height,
          absolutePositioned: true,
        }),
      });
      img.setCoords();
    });
  }

  function fitMarketingWidget(kind) {
    var fc = FB.design.canvas.get();
    var obj = _activeMarketingGroup();
    if (!fc || !obj) return;
    var formats = {
      square: { w: 1, h: 1, pad: 0.12 },
      story: { w: 9, h: 16, pad: 0.08 },
      banner: { w: 3, h: 1, pad: 0.08 },
      hero: { w: 16, h: 5, pad: 0.08 },
      social: { w: 1200, h: 630, pad: 0.1 },
    };
    var f = formats[kind] || formats.square;
    var canvasW = fc.getWidth();
    var canvasH = fc.getHeight();
    var availableW = canvasW * (1 - f.pad * 2);
    var availableH = canvasH * (1 - f.pad * 2);
    var targetAspect = f.w / f.h;
    var boxW = availableW;
    var boxH = boxW / targetAspect;
    if (boxH > availableH) {
      boxH = availableH;
      boxW = boxH * targetAspect;
    }
    var baseW = obj.width || obj.getScaledWidth() || 1;
    var baseH = obj.height || obj.getScaledHeight() || 1;
    var scale = Math.min(boxW / baseW, boxH / baseH);
    obj.set({
      scaleX: scale,
      scaleY: scale,
      left: canvasW / 2 - (baseW * scale) / 2,
      top: canvasH / 2 - (baseH * scale) / 2,
    });
    obj.setCoords();
    _marketingRefreshSlotImages(obj);
    fc.setActiveObject(obj);
    fc.renderAll();
    if (FB.design.layers) FB.design.layers.render();
    FB.design.history.push();
    render();
  }

  function duplicate() {
    var fc = FB.design.canvas.get();
    var objs = fc.getActiveObjects();
    if (!objs.length) return;
    var last;
    objs.forEach(function (obj) {
      obj.clone(function (clone) {
        clone.set({ left: obj.left + 20, top: obj.top + 20 });
        fc.add(clone);
        last = clone;
      });
    });
    if (last) fc.setActiveObject(last);
    fc.renderAll();
    FB.design.history.push();
  }

  function deleteSelected() {
    var fc = FB.design.canvas.get();
    var objs = fc.getActiveObjects();
    if (!objs.length) return;
    objs.forEach(function (o) {
      fc.remove(o);
    });
    fc.discardActiveObject();
    fc.renderAll();
    FB.design.history.push();
  }

  function toggleBold() {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj) return;
    var isBold = obj.fontWeight === "bold" || +obj.fontWeight >= 700;
    obj.set("fontWeight", isBold ? 400 : 700);
    obj.setCoords();
    fc.renderAll();
    FB.design.history.push();
  }

  function toggleShadow() {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj) return;
    if (obj.shadow) {
      obj.set("shadow", null);
    } else {
      obj.set(
        "shadow",
        new fabric.Shadow({
          color: "#000000",
          blur: 10,
          offsetX: 4,
          offsetY: 4,
        }),
      );
    }
    fc.renderAll();
    FB.design.history.push();
    render();
  }

  function setShadow(key, val) {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj || !obj.shadow) return;
    var sh = {
      color: obj.shadow.color,
      blur: obj.shadow.blur,
      offsetX: obj.shadow.offsetX,
      offsetY: obj.shadow.offsetY,
    };
    sh[key] = val;
    obj.set("shadow", new fabric.Shadow(sh));
    fc.renderAll();
    FB.design.history.push();
  }

  function setMotion(key, val) {
    var fc = FB.design.canvas.get();
    var objs = fc.getActiveObjects();
    if (!objs.length) return;
    objs.forEach(function (obj) {
      var motion = Object.assign({
        preset: "none",
        duration: 1.2,
        delay: 0,
        easing: "cubic-bezier(.2,.8,.2,1)",
        iteration: "once",
      }, obj.motion || {});
      motion[key] = val;
      if (key === "preset" && val === "none") {
        obj.motion = { preset: "none" };
      } else {
        obj.motion = motion;
      }
      obj.set("motion", obj.motion);
    });
    fc.renderAll();
    FB.design.history.push();
    render();
  }

  function applyMotionPreset(kind) {
    var presets = {
      reveal: { preset: "rise", duration: 0.9, delay: 0, easing: "cubic-bezier(.2,.8,.2,1)", iteration: "once" },
      ambient: { preset: "float", duration: 4, delay: 0, easing: "ease-in-out", iteration: "loop" },
      energetic: { preset: "pulse", duration: 1.4, delay: 0, easing: "cubic-bezier(.34,1.56,.64,1)", iteration: "loop" },
      physics: { preset: "gravity-drop", duration: 1.1, delay: 0, easing: "cubic-bezier(.2,.8,.2,1)", iteration: "once" },
      fluid: { preset: "fluid-wave", duration: 3.2, delay: 0, easing: "ease-in-out", iteration: "loop" },
      magnetic: { preset: "magnetic", duration: 2.4, delay: 0, easing: "cubic-bezier(.34,1.56,.64,1)", iteration: "loop" },
    };
    var motion = presets[kind];
    if (!motion) return;
    var fc = FB.design.canvas.get();
    var objs = fc.getActiveObjects();
    if (!objs.length) return;
    objs.forEach(function (obj, idx) {
      obj.motion = Object.assign({}, motion, { delay: +(motion.delay + idx * 0.08).toFixed(2) });
      obj.set("motion", obj.motion);
    });
    fc.renderAll();
    FB.design.history.push();
    render();
  }

  function previewMotion() {
    var fc = FB.design.canvas.get();
    var objs = fc.getActiveObjects();
    if (!fc || !objs.length) return;
    var start = performance.now();
    var originals = objs.map(function (obj) {
      return {
        obj: obj,
        left: obj.left || 0,
        top: obj.top || 0,
        scaleX: obj.scaleX || 1,
        scaleY: obj.scaleY || 1,
        angle: obj.angle || 0,
        opacity: obj.opacity == null ? 1 : obj.opacity,
      };
    });

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function frame(now) {
      var elapsed = (now - start) / 1000;
      var running = false;
      originals.forEach(function (item) {
        var m = item.obj.motion || {};
        if (!m.preset || m.preset === "none") return;
        var duration = Math.max(0.1, +(m.duration || 1.2));
        var delay = Math.max(0, +(m.delay || 0));
        var local = (elapsed - delay) / duration;
        if (local < 0) {
          running = true;
          return;
        }
        var t = Math.min(local, 1);
        var e = easeOut(t);
        running = running || local < 1;
        item.obj.set({
          left: item.left,
          top: item.top,
          scaleX: item.scaleX,
          scaleY: item.scaleY,
          angle: item.angle,
          opacity: item.opacity,
        });
        if (m.preset === "fade") item.obj.set("opacity", item.opacity * e);
        if (m.preset === "rise") item.obj.set({ top: item.top + (1 - e) * 36, opacity: item.opacity * e });
        if (m.preset === "slide-left") item.obj.set({ left: item.left + (1 - e) * 48, opacity: item.opacity * e });
        if (m.preset === "slide-right") item.obj.set({ left: item.left - (1 - e) * 48, opacity: item.opacity * e });
        if (m.preset === "zoom") item.obj.set({ scaleX: item.scaleX * (0.82 + e * 0.18), scaleY: item.scaleY * (0.82 + e * 0.18), opacity: item.opacity * e });
        var wave = Math.sin(t * Math.PI * 2);
        if (m.preset === "spin") item.obj.set("angle", item.angle + e * 360);
        if (m.preset === "float") item.obj.set("top", item.top + wave * 14);
        if (m.preset === "pulse") item.obj.set({ scaleX: item.scaleX * (1 + Math.sin(t * Math.PI) * 0.08), scaleY: item.scaleY * (1 + Math.sin(t * Math.PI) * 0.08) });
        if (m.preset === "drift") item.obj.set({ left: item.left + e * 28, top: item.top - e * 14 });
        if (m.preset === "blur") item.obj.set("opacity", item.opacity * e);
        if (m.preset === "elastic") item.obj.set({ scaleX: item.scaleX * (0.7 + e * 0.3 + Math.sin(t * Math.PI * 4) * (1 - t) * 0.12), scaleY: item.scaleY * (0.7 + e * 0.3 - Math.sin(t * Math.PI * 4) * (1 - t) * 0.08), opacity: item.opacity * e });
        if (m.preset === "bounce") item.obj.set("top", item.top - Math.abs(Math.sin(t * Math.PI * 3)) * (1 - t) * 46);
        if (m.preset === "gravity-drop") item.obj.set({ top: item.top - (1 - e) * 120 + Math.sin(t * Math.PI * 6) * (1 - t) * 10, opacity: item.opacity * e });
        if (m.preset === "gravity-rise") item.obj.set({ top: item.top + (1 - e) * 120, opacity: item.opacity * e });
        if (m.preset === "swing") item.obj.set("angle", item.angle + Math.sin(t * Math.PI * 3) * (1 - t) * 22);
        if (m.preset === "magnetic") item.obj.set({ left: item.left + Math.sin(t * Math.PI * 2) * 18, top: item.top + Math.cos(t * Math.PI * 2) * 10, scaleX: item.scaleX * (1 + Math.sin(t * Math.PI * 4) * 0.035), scaleY: item.scaleY * (1 + Math.sin(t * Math.PI * 4) * 0.035) });
        if (m.preset === "kinetic-snap") item.obj.set({ left: item.left + Math.sin(t * Math.PI * 8) * (1 - t) * 22, scaleX: item.scaleX * (1 + Math.sin(t * Math.PI * 8) * (1 - t) * 0.08), opacity: item.opacity * e });
        if (m.preset === "kinetic-skew") item.obj.set({ angle: item.angle + wave * 8, top: item.top + Math.sin(t * Math.PI * 4) * 8 });
        if (m.preset === "fluid-wave") item.obj.set({ top: item.top + wave * 16, angle: item.angle + wave * 3 });
        if (m.preset === "liquid-morph") item.obj.set({ scaleX: item.scaleX * (1 + wave * 0.08), scaleY: item.scaleY * (1 - wave * 0.06), angle: item.angle + wave * 2 });
        if (m.preset === "orbit") item.obj.set({ left: item.left + Math.cos(t * Math.PI * 2) * 18, top: item.top + Math.sin(t * Math.PI * 2) * 18 });
        if (m.preset === "parallax") item.obj.set({ left: item.left + Math.sin(t * Math.PI * 2) * 24, top: item.top + Math.sin(t * Math.PI * 2 + 1) * 8 });
        if (m.preset === "tilt") item.obj.set("angle", item.angle + wave * 10);
        if (m.preset === "breathe") item.obj.set({ scaleX: item.scaleX * (1 + wave * 0.035), scaleY: item.scaleY * (1 + wave * 0.035) });
        if (m.preset === "shimmer") item.obj.set("opacity", item.opacity * (0.72 + Math.abs(wave) * 0.28));
        if (m.preset === "glitch") item.obj.set({ left: item.left + (Math.random() - 0.5) * 10 * (1 - t), opacity: item.opacity * (0.82 + Math.random() * 0.18) });
        item.obj.setCoords();
      });
      fc.renderAll();
      if (running) {
        requestAnimationFrame(frame);
      } else {
        originals.forEach(function (item) {
          item.obj.set({
            left: item.left,
            top: item.top,
            scaleX: item.scaleX,
            scaleY: item.scaleY,
            angle: item.angle,
            opacity: item.opacity,
          });
          item.obj.setCoords();
        });
        fc.renderAll();
      }
    }
    requestAnimationFrame(frame);
  }

  function replaceSlotImage() {
    var inp = document.createElement("input");
    inp.type = "file";
    inp.accept = "image/*";
    inp.onchange = function () {
      var file = inp.files && inp.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        if (FB.design.media && FB.design.media.replaceSelectedSlot) {
          FB.design.media.replaceSelectedSlot(ev.target.result);
        }
      };
      reader.readAsDataURL(file);
    };
    inp.click();
  }

  return {
    render: render,
    setProp: setProp,
    setPropXY: setPropXY,
    setWidth: setWidth,
    setHeight: setHeight,
    flip: flip,
    flipH: flipH,
    flipV: flipV,
    setCanvasBg: setCanvasBg,
    setBrandKit: setBrandKit,
    applyBrandToSelection: applyBrandToSelection,
    applyBrandGlobally: applyBrandGlobally,
    applyBrandToCanvas: applyBrandToCanvas,
    captureBrandFromSelection: captureBrandFromSelection,
    setSnapSetting: setSnapSetting,
    setVeltroWidget: setVeltroWidget,
    setVeltroProp: setVeltroProp,
    setVeltroProps: setVeltroProps,
    setVeltroText: setVeltroText,
    setVeltroColor: setVeltroColor,
    setVeltroBackground: setVeltroBackground,
    setVeltroSpeed: setVeltroSpeed,
    setVeltroForce: setVeltroForce,
    setVeltroMode: setVeltroMode,
    setVeltroGlow: setVeltroGlow,
    setVeltroLines: setVeltroLines,
    refreshVeltroWidget: refreshVeltroWidget,
    setVeltroPreset: setVeltroPreset,
    setMarketingAccent: setMarketingAccent,
    setMarketingBackground: setMarketingBackground,
    setMarketingRadius: setMarketingRadius,
    setMarketingText: setMarketingText,
    setMarketingLayerText: setMarketingLayerText,
    setMarketingTheme: setMarketingTheme,
    regenerateMarketingVariant: regenerateMarketingVariant,
    fitMarketingWidget: fitMarketingWidget,
    duplicate: duplicate,
    deleteSelected: deleteSelected,
    toggleBold: toggleBold,
    toggleShadow: toggleShadow,
    setShadow: setShadow,
    setMotion: setMotion,
    applyMotionPreset: applyMotionPreset,
    previewMotion: previewMotion,
    replaceSlotImage: replaceSlotImage,
  };
})();

FB.design.align = (function () {
  function run(action) {
    var fc = FB.design.canvas.get();
    var objs = fc.getActiveObjects();
    if (!objs.length) return;
    var cW = fc.getWidth(),
      cH = fc.getHeight();

    objs.forEach(function (obj) {
      var w = obj.getScaledWidth(),
        h = obj.getScaledHeight();
      if (action === "left") obj.set("left", 0);
      if (action === "centerH") obj.set("left", cW / 2 - w / 2);
      if (action === "right") obj.set("left", cW - w);
      if (action === "top") obj.set("top", 0);
      if (action === "centerV") obj.set("top", cH / 2 - h / 2);
      if (action === "bottom") obj.set("top", cH - h);
      if (action === "bringForward") fc.bringForward(obj);
      if (action === "sendBack") fc.sendBackwards(obj);
      if (action === "bringToFront") fc.bringToFront(obj);
      if (action === "sendToBack") fc.sendToBack(obj);
      obj.setCoords();
    });

    if (action === "distributeH" && objs.length >= 3) {
      var sorted = objs.slice().sort(function (a, b) {
        return a.left - b.left;
      });
      var totalW = sorted.reduce(function (s, o) {
        return s + o.getScaledWidth();
      }, 0);
      var gap =
        (sorted[sorted.length - 1].left +
          sorted[sorted.length - 1].getScaledWidth() -
          sorted[0].left -
          totalW) /
        (sorted.length - 1);
      var x = sorted[0].left;
      sorted.forEach(function (o) {
        o.set("left", x);
        x += o.getScaledWidth() + gap;
        o.setCoords();
      });
    }

    if (action === "distributeV" && objs.length >= 3) {
      var sortedV = objs.slice().sort(function (a, b) {
        return a.top - b.top;
      });
      var totalH = sortedV.reduce(function (s, o) {
        return s + o.getScaledHeight();
      }, 0);
      var gapV =
        (sortedV[sortedV.length - 1].top +
          sortedV[sortedV.length - 1].getScaledHeight() -
          sortedV[0].top -
          totalH) /
        (sortedV.length - 1);
      var y = sortedV[0].top;
      sortedV.forEach(function (o) {
        o.set("top", y);
        y += o.getScaledHeight() + gapV;
        o.setCoords();
      });
    }

    fc.renderAll();
    FB.design.layers.render();
    if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
    FB.design.history.push();
  }

  function renderPanel() {
    var fc = FB.design.canvas.get();
    var n = fc ? fc.getActiveObjects().length : 0;
    var el = document.getElementById("ds-align-panel");
    if (!el) return;
    el.innerHTML =
      '<div class="ds-align-group-label">Align Objects</div>' +
      '<div class="ds-align-grid">' +
      [
        ["left", "⊢ Left"],
        ["centerH", "⊣⊢ Centre"],
        ["right", "⊣ Right"],
        ["top", "⊤ Top"],
        ["centerV", "≡ Mid"],
        ["bottom", "⊥ Bottom"],
      ]
        .map(function (a) {
          return (
            '<button class="ds-align-btn" onclick="FB.design.align.run(\'' +
            a[0] +
            "')\">" +
            a[1] +
            "</button>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="ds-align-group-label" style="margin-top:8px;">Layer Order</div>' +
      '<div class="ds-order-grid">' +
      [
        ["bringToFront", "⤒ Front"],
        ["bringForward", "↑ Fwd"],
        ["sendBack", "↓ Back"],
        ["sendToBack", "⤓ Base"],
      ]
        .map(function (a) {
          return (
            '<button class="ds-align-btn" onclick="FB.design.align.run(\'' +
            a[0] +
            "')\">" +
            a[1] +
            "</button>"
          );
        })
        .join("") +
      "</div>" +
      (n >= 3
        ? '<div class="ds-align-group-label" style="margin-top:8px;">Distribute</div>' +
          '<div class="ds-dist-row">' +
          '<button class="ds-align-btn" onclick="FB.design.align.run(\'distributeH\')">⇔ H</button>' +
          '<button class="ds-align-btn" onclick="FB.design.align.run(\'distributeV\')">⇕ V</button>' +
          "</div>"
        : "");
  }

  return { run: run, renderPanel: renderPanel };
})();

FB.design.library = (function () {
  var _currentName = "Untitled";

  function save() {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var name = prompt("Save design as:", _currentName);
    if (!name) return;
    _currentName = name;
    var prevBg = fc.backgroundColor;
    fc.setBackgroundColor(FB.design._canvasBg || "#ffffff", function () {});
    fc.renderAll();
    var thumbnail = fc.toDataURL({
      format: "png",
      multiplier: Math.min(1, 320 / fc.getWidth()),
    });
    fc.setBackgroundColor(prevBg || null, function () {});
    fc.renderAll();
    var payload = {
      name: name,
      width: fc.getWidth(),
      height: fc.getHeight(),
      canvasBg: FB.design._canvasBg || "#ffffff",
      thumbnail: thumbnail,
      fabric: fc.toJSON(["name", "motion", "_veltroWidget", "_veltroId", "_veltroProps"]),
    };
    fetch("/api/designs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        if (d.ok) {
          FB.util.showToast("Saved: " + name);
        }
      })
      .catch(function (err) {
        console.error("[saveDesign] Error:", err);
        FB.util.showToast("Error saving design");
      });
  }

  function openPicker() {
    fetch("/api/designs")
      .then(function (r) {
        return r.json();
      })
      .then(function (list) {
        var grid = document.getElementById("ds-library-grid");
        var esc = FB.design._esc;
        grid.innerHTML = list.length
          ? list
              .map(function (d) {
                return (
                  '<div class="ds-template-thumb" onclick="FB.design.library.loadDesign(\'' +
                  esc(d.slug) +
                  "')\">" +
                  (d.thumbnail
                    ? '<img src="' +
                      esc(d.thumbnail) +
                      '" alt="' +
                      esc(d.name) +
                      '">'
                    : '<div style="height:80px;background:#1a1a2a"></div>') +
                  '<div class="ds-thumb-label">' +
                  esc(d.name) +
                  "</div></div>"
                );
              })
              .join("")
          : '<p style="color:#666;padding:16px;font-size:12px">No saved designs yet.</p>';
        document.getElementById("ds-library-overlay").style.display = "flex";
      })
      .catch(function (err) {
        console.error("[openPicker] Error:", err);
      });
  }

  function closePicker() {
    document.getElementById("ds-library-overlay").style.display = "none";
  }

  function loadDesign(slug) {
    if (!confirm("Load this design? Unsaved changes will be lost.")) return;
    fetch("/api/designs/" + slug)
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        var fc = FB.design.canvas.get();
        if (!fc) {
          console.error("[loadDesign] Canvas not available");
          return;
        }
        FB.design._canvasBg = d.canvasBg || d.backgroundColor || "#ffffff";
        fc.setWidth(d.width);
        fc.setHeight(d.height);
        FB.design.applyCanvasSurfaceBg();
        FB.design.history.silent(function () {
          fc.loadFromJSON(d.fabric, function () {
            fc.setBackgroundColor(null, function () {});
            FB.design.applyCanvasSurfaceBg();
            fc.renderAll();
            if (FB.design.veltroCanvas) FB.design.veltroCanvas.sync();
            FB.design.layers.render();
            FB.design.props.render();
            _currentName = d.name;
            FB.design.history.push();
            closePicker();
            FB.util.showToast("Loaded: " + d.name);
          });
        });
      })
      .catch(function (err) {
        console.error("[loadDesign] Error:", err);
        FB.util.showToast("Error loading design");
      });
  }

  function exportPNG() {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var prevBg = fc.backgroundColor;
    fc.setBackgroundColor(FB.design._canvasBg || "#ffffff", function () {});
    fc.renderAll();
    var url = fc.toDataURL({ format: "png", multiplier: 1 });
    fc.setBackgroundColor(prevBg || null, function () {});
    fc.renderAll();
    var a = document.createElement("a");
    a.href = url;
    a.download = (_currentName || "design") + ".png";
    a.click();
  }

  function exportSVG() {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var svg = fc.toSVG();
    var blob = new Blob([svg], { type: "image/svg+xml" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (_currentName || "design") + ".svg";
    a.click();
  }

  function hasMotion(fc) {
    return !!(fc && fc.getObjects().some(function (obj) {
      return obj._veltroWidget || (obj.motion && obj.motion.preset && obj.motion.preset !== "none");
    }));
  }

  function cssForMotion(className, motion) {
    var preset = motion.preset || "none";
    if (preset === "none") return "";
    var duration = Math.max(0.1, +(motion.duration || 1.2));
    var delay = Math.max(0, +(motion.delay || 0));
    var easing = FB.design._cssEsc(motion.easing || "cubic-bezier(.2,.8,.2,1)");
    var iteration = motion.iteration === "loop" ? "infinite" : "1";
    var alternatePresets = [
      "float", "pulse", "drift", "magnetic", "fluid-wave", "liquid-morph",
      "orbit", "parallax", "tilt", "breathe", "shimmer", "swing"
    ];
    var direction = motion.iteration === "loop" && alternatePresets.indexOf(preset) !== -1 ? "alternate" : "normal";
    return (
      "." + className + "{" +
      "transform-box:fill-box;transform-origin:center;animation:ds-" + preset + " " +
      duration + "s " + easing + " " + delay + "s " + iteration + " " + direction + " both;" +
      "}"
    );
  }

  function motionKeyframes() {
    return [
      "@keyframes ds-fade{from{opacity:0}to{opacity:1}}",
      "@keyframes ds-rise{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}}",
      "@keyframes ds-slide-left{from{opacity:0;transform:translateX(48px)}to{opacity:1;transform:translateX(0)}}",
      "@keyframes ds-slide-right{from{opacity:0;transform:translateX(-48px)}to{opacity:1;transform:translateX(0)}}",
      "@keyframes ds-zoom{from{opacity:0;transform:scale(.82)}to{opacity:1;transform:scale(1)}}",
      "@keyframes ds-blur{from{opacity:0;filter:blur(18px)}to{opacity:1;filter:blur(0)}}",
      "@keyframes ds-elastic{0%{opacity:0;transform:scale(.7)}55%{opacity:1;transform:scale(1.12,.88)}78%{transform:scale(.96,1.04)}100%{opacity:1;transform:scale(1)}}",
      "@keyframes ds-bounce{0%{transform:translateY(0)}35%{transform:translateY(-42px)}55%{transform:translateY(0)}72%{transform:translateY(-18px)}100%{transform:translateY(0)}}",
      "@keyframes ds-gravity-drop{0%{opacity:0;transform:translateY(-120px) scaleY(1.08)}58%{opacity:1;transform:translateY(0) scaleY(.92)}74%{transform:translateY(-18px) scaleY(1.03)}100%{opacity:1;transform:translateY(0) scaleY(1)}}",
      "@keyframes ds-gravity-rise{0%{opacity:0;transform:translateY(120px) scale(.96)}70%{opacity:1;transform:translateY(-10px) scale(1.02)}100%{opacity:1;transform:translateY(0) scale(1)}}",
      "@keyframes ds-swing{0%{transform:rotate(-13deg)}30%{transform:rotate(10deg)}55%{transform:rotate(-6deg)}80%{transform:rotate(3deg)}100%{transform:rotate(0)}}",
      "@keyframes ds-magnetic{0%{transform:translate(-14px,8px) scale(.98)}35%{transform:translate(8px,-6px) scale(1.04)}70%{transform:translate(-5px,4px) scale(1.01)}100%{transform:translate(0,0) scale(1)}}",
      "@keyframes ds-kinetic-snap{0%{opacity:0;transform:translateX(-54px) skewX(-12deg) scaleX(1.22)}55%{opacity:1;transform:translateX(10px) skewX(7deg) scaleX(.92)}100%{opacity:1;transform:translateX(0) skewX(0) scaleX(1)}}",
      "@keyframes ds-kinetic-skew{0%{transform:skewX(-10deg) translateX(-16px)}50%{transform:skewX(8deg) translateX(10px)}100%{transform:skewX(0) translateX(0)}}",
      "@keyframes ds-fluid-wave{0%{transform:translateY(-12px) rotate(-2deg)}33%{transform:translateY(8px) rotate(1.5deg)}66%{transform:translateY(-4px) rotate(-1deg)}100%{transform:translateY(12px) rotate(2deg)}}",
      "@keyframes ds-liquid-morph{0%{transform:scale(1.08,.92) rotate(-1deg)}50%{transform:scale(.94,1.08) rotate(1.5deg)}100%{transform:scale(1.04,.96) rotate(-.5deg)}}",
      "@keyframes ds-orbit{0%{transform:translate(18px,0)}25%{transform:translate(0,18px)}50%{transform:translate(-18px,0)}75%{transform:translate(0,-18px)}100%{transform:translate(18px,0)}}",
      "@keyframes ds-parallax{0%{transform:translate3d(-26px,8px,0)}50%{transform:translate3d(18px,-6px,0)}100%{transform:translate3d(-26px,8px,0)}}",
      "@keyframes ds-tilt{0%{transform:rotateX(0) rotateY(0) rotate(-5deg)}50%{transform:rotateX(8deg) rotateY(-10deg) rotate(6deg)}100%{transform:rotateX(0) rotateY(0) rotate(-5deg)}}",
      "@keyframes ds-breathe{0%{transform:scale(.98);opacity:.88}50%{transform:scale(1.045);opacity:1}100%{transform:scale(.98);opacity:.9}}",
      "@keyframes ds-shimmer{0%{opacity:.62;filter:brightness(.9) saturate(1)}45%{opacity:1;filter:brightness(1.35) saturate(1.25)}100%{opacity:.72;filter:brightness(.95) saturate(1)}}",
      "@keyframes ds-glitch{0%,100%{transform:translate(0,0);opacity:1}12%{transform:translate(-6px,2px);opacity:.75}18%{transform:translate(5px,-3px);opacity:1}36%{transform:translate(-3px,-2px)}42%{transform:translate(7px,3px);opacity:.82}64%{transform:translate(-2px,4px)}70%{transform:translate(0,0);opacity:1}}",
      "@keyframes ds-float{from{transform:translateY(-10px)}to{transform:translateY(10px)}}",
      "@keyframes ds-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}",
      "@keyframes ds-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}",
      "@keyframes ds-drift{from{transform:translate(-14px,8px)}to{transform:translate(18px,-10px)}}",
    ].join("");
  }

  function buildAnimatedHTML(fc) {
    var svg = fc.toSVG();
    var objects = fc.getObjects();
    var css = "";
    var veltroLayer = buildVeltroExportLayer(fc);
    try {
      var doc = new DOMParser().parseFromString(svg, "image/svg+xml");
      var root = doc.documentElement;
      var drawable = Array.prototype.filter.call(root.children, function (node) {
        return ["defs", "desc", "title", "style"].indexOf((node.tagName || "").toLowerCase()) === -1;
      });
      drawable.forEach(function (node, idx) {
        if (objects[idx] && objects[idx]._veltroWidget) {
          node.parentNode.removeChild(node);
          return;
        }
        var motion = objects[idx] && objects[idx].motion;
        if (!motion || !motion.preset || motion.preset === "none") return;
        var cls = "ds-motion-layer-" + idx;
        var wrapper = doc.createElementNS("http://www.w3.org/2000/svg", "g");
        wrapper.setAttribute("class", cls);
        node.parentNode.insertBefore(wrapper, node);
        wrapper.appendChild(node);
        css += cssForMotion(cls, motion);
      });
      svg = new XMLSerializer().serializeToString(root);
    } catch (_) {
      css = objects.map(function (obj, idx) {
        return cssForMotion("ds-motion-layer-" + idx, obj.motion || {});
      }).join("");
    }
    var title = FB.design._esc(_currentName || "Animated design");
    return (
      '<div class="ds-animated-design" role="img" aria-label="' + title + '">' +
      '<style>' +
      ".ds-animated-design{position:relative;width:100%;overflow:hidden;line-height:0;background:" + FB.design._cssEsc(FB.design._canvasBg || "transparent") + "}" +
      ".ds-animated-design svg{display:block;width:100%;height:auto}" +
      ".ds-export-veltro-layer{position:absolute;inset:0;pointer-events:auto;overflow:hidden}" +
      ".ds-export-veltro-widget{position:absolute;line-height:normal;overflow:hidden}" +
      ".ds-export-veltro-widget>.fw-widget,.ds-export-veltro-widget [class*='veltro-']{width:100%;height:100%}" +
      "@media (prefers-reduced-motion:reduce){.ds-animated-design *{animation:none!important;transition:none!important}}" +
      motionKeyframes() +
      css +
      "</style>" +
      svg +
      veltroLayer +
      "</div>"
    );
  }

  function buildVeltroExportLayer(fc) {
    var objects = fc.getObjects().filter(function (obj) { return obj._veltroWidget; });
    if (!objects.length) return "";
    var tokens = collectDesignTokens(fc);
    var widgets = objects.map(function (obj, idx) {
      var type = obj._veltroWidget;
      var id = obj._veltroId || ("export-vw-" + idx);
      var props = Object.assign({}, veltroPropsFor(type, tokens), obj._veltroProps || {}, {
        _blockId: id,
        height: Math.max(80, Math.round(obj.getScaledHeight())),
      });
      var widget = FB.widgets && FB.widgets.get && FB.widgets.get(type);
      if (!widget) return "";
      var style = [
        "left:" + ((obj.left / fc.getWidth()) * 100).toFixed(4) + "%",
        "top:" + ((obj.top / fc.getHeight()) * 100).toFixed(4) + "%",
        "width:" + ((obj.getScaledWidth() / fc.getWidth()) * 100).toFixed(4) + "%",
        "height:" + ((obj.getScaledHeight() / fc.getHeight()) * 100).toFixed(4) + "%",
        "transform:rotate(" + (obj.angle || 0) + "deg)",
        "transform-origin:center",
        "opacity:" + (obj.opacity == null ? 1 : obj.opacity),
      ].join(";");
      return (
        '<div class="ds-export-veltro-widget" data-veltro-export="' +
        FB.design._esc(id) +
        '" style="' +
        style +
        '">' +
        '<div class="fw-widget fw-widget-' +
        FB.design._esc(type) +
        '">' +
        FB.widgets.render(type, props) +
        "</div></div>"
      );
    }).join("");
    if (!widgets) return "";
    return (
      '<div class="ds-export-veltro-layer">' +
      widgets +
      "</div>" +
      '<script>(function(){var s=["/js/widgets.js","/widgets/veltro.js","/widgets/veltro/batch-ambient.js","/widgets/veltro/batch-cursor.js","/widgets/veltro/batch-physics.js","/widgets/veltro/batch-scroll.js","/widgets/veltro/batch-spatial.js","/widgets/veltro/batch-text.js","/widgets/veltro/orig-fx.js","/widgets/veltro/orig-text.js"];function l(i){if(i>=s.length){setTimeout(function(){if(window._VeltroInitAll)window._VeltroInitAll();},50);return}var e=document.createElement("script");e.src=s[i];e.onload=function(){l(i+1)};e.onerror=function(){l(i+1)};document.head.appendChild(e)};if(!window.FB){window.FB={widgets:{_registry:{},register:function(k,v){this._registry[k]=v},get:function(k){return this._registry[k]},render:function(k,p){var w=this.get(k);return w&&w.render?w.render(p||{}):""}}}};l(0)}());</script>'
    );
  }

  function exportHTML() {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var blob = new Blob([buildAnimatedHTML(fc)], { type: "text/html" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (_currentName || "animated-design") + ".html";
    a.click();
  }

  function insertIntoPage() {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    FB.panels.setMode("builder");
    FB.state.saveHistory();
    if (hasMotion(fc)) {
      FB.state.blocks.push({
        id: FB.state.genId(),
        type: "htmlEmbed",
        props: { html: buildAnimatedHTML(fc) },
      });
      FB.util.showToast("Animated design inserted");
    } else {
      var prevBg = fc.backgroundColor;
      fc.setBackgroundColor(FB.design._canvasBg || "#ffffff", function () {});
      fc.renderAll();
      var dataUrl = fc.toDataURL({ format: "png", multiplier: 1 });
      fc.setBackgroundColor(prevBg || null, function () {});
      fc.renderAll();
      FB.state.blocks.push({
        id: FB.state.genId(),
        type: "imageBlock",
        props: { src: dataUrl, alt: _currentName, objectFit: "contain" },
      });
      FB.util.showToast("Design inserted as image block");
    }
    FB.canvas.render();
  }

  function collectDesignTokens(fc) {
    var objects = fc.getObjects();
    var texts = objects
      .filter(function (obj) { return obj.type === "i-text" && obj.text; })
      .map(function (obj) { return String(obj.text).trim(); })
      .filter(Boolean);
    var colors = objects
      .map(function (obj) { return typeof obj.fill === "string" ? obj.fill : ""; })
      .filter(function (color) { return /^#[0-9a-f]{3,8}$/i.test(color); });
    var bg = FB.design._canvasBg || "#0d0d1a";
    var primary = colors[0] || "#cdfe00";
    var secondary = colors[1] || "#3b82f6";
    var accent = colors[2] || "#ec4899";
    var title = texts[0] || _currentName || "Veltro";
    var words = texts.length ? texts : title.split(/\s+/).filter(Boolean);
    if (!words.length) words = ["Veltro", "Motion"];
    return {
      width: fc.getWidth(),
      height: Math.max(320, Math.min(720, fc.getHeight())),
      bg: bg,
      primary: primary,
      secondary: secondary,
      accent: accent,
      title: title,
      words: words.slice(0, 8),
    };
  }

  function veltroPropsFor(effect, tokens) {
    var base = {
      height: tokens.height,
      bg: tokens.bg,
      bgColor: tokens.bg,
      bgType: "gradient",
      bgGradientDir: "135deg",
      bgGradientColor1: tokens.bg,
      bgGradientColor2: "#111827",
      borderRadius: 8,
      entranceAnim: "fadeUp",
    };
    var map = {
      physicsSandbox: Object.assign({}, base, {
        items: tokens.words,
        gravity: 1,
        restitution: 0.78,
        friction: 0.04,
        textColor: tokens.primary,
        itemColors: [tokens.primary, tokens.secondary, tokens.accent, "#f59e0b", "#10b981"].join(","),
        objectShape: "mixed",
        collisionFlash: true,
        showHint: true,
      }),
      fluidSimulation: Object.assign({}, base, {
        particleCount: 260,
        viscosity: 0.42,
        color1: tokens.secondary,
        color2: tokens.accent,
        fluidMode: "flow",
        fluidTurbulence: 0.45,
        fluidGlow: true,
        mouseForce: 7,
        connectionLines: true,
      }),
      gravityWells: Object.assign({}, base, {
        wellCount: 3,
        particleCount: 160,
        gravityStrength: 0.62,
        particleColor: tokens.primary,
        wellColor: tokens.accent,
      }),
      magneticFields: Object.assign({}, base, {
        particleCount: 110,
        fieldStrength: 0.68,
        particleColor: tokens.primary,
        fieldLines: true,
        particleTrail: true,
        fieldMode: "dipole",
        particleGlow: true,
        glowColor: tokens.secondary,
      }),
      kineticText: Object.assign({}, base, {
        text: tokens.title,
        color: tokens.primary,
        size: Math.max(42, Math.min(96, Math.floor(tokens.width / 18))),
        weight: 760,
        minWeight: 180,
        maxWeight: 900,
        mode: "proximity",
        radius: 280,
        fontFamily: "Lexend",
        align: "center",
        bgColor: tokens.bg,
      }),
      textScramble: Object.assign({}, base, {
        text: tokens.title,
        color: tokens.primary,
        fontSize: Math.max(40, Math.min(88, Math.floor(tokens.width / 20))),
        fontWeight: 800,
        bg: tokens.bg,
        scrambleSpeed: 30,
        decodeTrigger: "hover",
        autoScramble: true,
        autoScrambleInterval: 900,
      }),
      typewriterReveal: Object.assign({}, base, {
        text: tokens.title,
        multiText: tokens.words.join(","),
        color: tokens.primary,
        fontSize: Math.max(36, Math.min(76, Math.floor(tokens.width / 22))),
        fontWeight: 700,
        bg: tokens.bg,
        speed: 80,
        loop: true,
      }),
      textMask: Object.assign({}, base, {
        text: tokens.title,
        fontSize: Math.max(44, Math.min(96, Math.floor(tokens.width / 18))),
        fontWeight: 900,
        bg: tokens.bg,
        maskFallbackColor: tokens.primary,
      }),
      liquidText: Object.assign({}, base, {
        text: tokens.title,
        color: tokens.secondary,
        fontSize: Math.max(44, Math.min(96, Math.floor(tokens.width / 18))),
        fontWeight: 900,
        bg: tokens.bg,
        amplitude: 10,
        frequency: 0.05,
        speed: 0.02,
        glowEffect: true,
        glowColor: tokens.secondary,
      }),
      morphingText: Object.assign({}, base, {
        words: tokens.words.join(","),
        textColor: tokens.primary,
        fontSize: Math.max(44, Math.min(92, Math.floor(tokens.width / 18))),
        fontWeight: 800,
        bg: tokens.bg,
        morphSpeed: 2000,
        fadeSpeed: 500,
        highlightCurrent: true,
        highlightColor: tokens.primary,
      }),
      morphingCounter: Object.assign({}, base, {
        target: 100,
        prefix: "",
        suffix: "+",
        fontSize: Math.max(44, Math.min(96, Math.floor(tokens.width / 18))),
        color: tokens.primary,
        bg: tokens.bg,
      }),
      waveText: Object.assign({}, base, {
        text: tokens.title,
        fontSize: Math.max(44, Math.min(96, Math.floor(tokens.width / 18))),
        textColor: tokens.primary,
        dualColour: true,
        dualColour2: tokens.secondary,
        amplitude: 24,
        frequency: 0.12,
        speed: 0.055,
        glowEffect: true,
        glowColor: tokens.primary,
      }),
      kineticScramble: Object.assign({}, base, {
        text: tokens.title,
        textColor: tokens.primary,
        color: tokens.primary,
        scrambleColor: tokens.accent,
        fontSize: Math.max(42, Math.min(88, Math.floor(tokens.width / 20))),
        fontWeight: 800,
        bg: tokens.bg,
        scrambleSpeed: 100,
        revealSpeed: 2000,
        autoScramble: true,
        autoScrambleInterval: 1400,
      }),
      magneticText: Object.assign({}, base, {
        text: tokens.title,
        textColor: tokens.primary,
        magnetColor: tokens.secondary,
        fontSize: Math.max(40, Math.min(90, Math.floor(tokens.width / 20))),
        magneticRadius: 150,
        magneticStrength: 0.5,
      }),
      liquidGradient: Object.assign({}, base, {
        color1: tokens.primary,
        color2: tokens.secondary,
        color3: tokens.accent,
        speed: 0.018,
      }),
      particleNebula: Object.assign({}, base, {
        particleCount: 120,
        color1: tokens.primary,
        color2: tokens.secondary,
        color3: tokens.accent,
      }),
      auroraBorealis: Object.assign({}, base, {
        color1: tokens.primary,
        color2: tokens.secondary,
        color3: tokens.accent,
        intensity: 0.72,
      }),
      cursorLens: Object.assign({}, base, {
        image: "",
        lensSize: 180,
        zoom: 1.8,
        text: tokens.title,
        bg: tokens.bg,
      }),
      layeredParallax: Object.assign({}, base, {
        layers: tokens.words.map(function (word, idx) {
          return { text: word, depth: (idx + 1) * 0.18, color: [tokens.primary, tokens.secondary, tokens.accent][idx % 3] };
        }),
      }),
      morphingGrid: Object.assign({}, base, {
        items: tokens.words,
        color1: tokens.primary,
        color2: tokens.secondary,
        color3: tokens.accent,
      }),
    };
    return map[effect] || map.kineticText;
  }

  function insertVeltroBlock() {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var select = document.getElementById("ds-veltro-effect");
    var effect = select ? select.value : "kineticText";
    var props = veltroPropsFor(effect, collectDesignTokens(fc));
    FB.panels.setMode("builder");
    FB.state.saveHistory();
    FB.state.blocks.push({
      id: FB.state.genId(),
      type: effect,
      props: props,
    });
    FB.canvas.render();
    if (typeof window._VeltroInitAll === "function") window._VeltroInitAll();
    FB.util.showToast("Veltro block inserted");
  }

  function currentVeltroSelection() {
    var fc = FB.design.canvas.get();
    if (!fc) return null;
    var select = document.getElementById("ds-veltro-effect");
    var effect = select ? select.value : "kineticText";
    return {
      id: "ds-preview-" + effect,
      type: effect,
      props: veltroPropsFor(effect, collectDesignTokens(fc)),
    };
  }

  function previewVeltroBlock() {
    var block = currentVeltroSelection();
    var host = document.getElementById("ds-veltro-preview");
    if (!block || !host) return;
    if (!FB.widgets || !FB.widgets.get || !FB.widgets.get(block.type)) {
      host.innerHTML = '<div style="padding:18px;color:#777;font-size:11px">Veltro widget unavailable</div>';
      return;
    }
    var props = Object.assign({}, block.props, { _blockId: block.id });
    host.innerHTML =
      '<div class="fw-widget fw-widget-' +
      FB.design._esc(block.type) +
      '">' +
      FB.widgets.render(block.type, props) +
      '</div>';
    setTimeout(function () {
      if (typeof window._VeltroInitAll === "function") window._VeltroInitAll();
    }, 0);
  }

  return {
    save: save,
    openPicker: openPicker,
    closePicker: closePicker,
    loadDesign: loadDesign,
    exportPNG: exportPNG,
    exportSVG: exportSVG,
    exportHTML: exportHTML,
    insertIntoPage: insertIntoPage,
    insertVeltroBlock: insertVeltroBlock,
    previewVeltroBlock: previewVeltroBlock,
    _collectDesignTokens: collectDesignTokens,
    _veltroPropsFor: veltroPropsFor,
  };
})();

FB.design.templates = (function () {
  function open() {
    var grid = document.getElementById("ds-template-grid");
    var list = FB.design.TEMPLATES || [];
    grid.innerHTML = list
      .map(function (t) {
        return (
          '<div class="ds-template-thumb" onclick="FB.design.templates.load(\'' +
          t.key +
          "')\">" +
          '<div style="height:80px;background:#1a1a2a;display:flex;align-items:center;justify-content:center;font-size:10px;color:#666">' +
          t.width +
          "×" +
          t.height +
          "</div>" +
          '<div class="ds-thumb-label">' +
          t.name +
          "</div></div>"
        );
      })
      .join("");
    document.getElementById("ds-template-overlay").style.display = "flex";
  }

  function close() {
    document.getElementById("ds-template-overlay").style.display = "none";
  }

  function load(key) {
    var tpl = (FB.design.TEMPLATES || []).filter(function (t) {
      return t.key === key;
    })[0];
    if (!tpl) return;
    var fc = FB.design.canvas.get();
    if (
      fc.getObjects().length &&
      !confirm("Replace current canvas with this template?")
    )
      return;
    fc.setWidth(tpl.width);
    fc.setHeight(tpl.height);
    FB.design.history.silent(function () {
      var fabricJson = JSON.parse(JSON.stringify(tpl.fabric));
      fc.loadFromJSON(fabricJson, function () {
        fc.renderAll();
        FB.design.layers.render();
        FB.design.canvas.zoomFit();
        FB.design.history.push();
        close();
      });
    });
  }

  return { open: open, close: close, load: load };
})();

FB.design.ai = (function () {
  function open() {
    document.getElementById("ds-ai-overlay").style.display = "flex";
    document.getElementById("ds-ai-status").textContent = "";
  }

  function close() {
    document.getElementById("ds-ai-overlay").style.display = "none";
  }

  function generate() {
    var prompt = document.getElementById("ds-ai-prompt").value.trim();
    if (!prompt) return;
    var status = document.getElementById("ds-ai-status");
    status.textContent = "Generating…";

    fetch("/api/ai-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt }),
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        if (d.error) {
          status.textContent = "Error: " + d.error;
          return;
        }
        status.textContent = "Placing image…";
        fabric.Image.fromURL(d.url, function (img) {
          var fc = FB.design.canvas.get();
          if (!fc) {
            status.textContent = "Canvas not available";
            return;
          }
          var maxW = fc.getWidth() * 0.6;
          if (img.width > maxW) img.scaleToWidth(maxW);
          img.set({
            left: fc.getWidth() / 2 - img.getScaledWidth() / 2,
            top: fc.getHeight() / 2 - img.getScaledHeight() / 2,
            name: "AI: " + prompt.slice(0, 30),
          });
          fc.add(img);
          fc.setActiveObject(img);
          fc.renderAll();
          close();
          FB.util.showToast("AI image added to canvas");
        });
      })
      .catch(function (err) {
        status.textContent = "Request failed: " + err.message;
      });
  }

  return { open: open, close: close, generate: generate };
})();

FB.design.media = (function () {
  function triggerUpload() {
    var fileInp = document.getElementById("ds-media-file-input");
    if (fileInp) fileInp.click();
  }

  function handleUpload(inp) {
    var file = inp.files[0];
    if (!file) return;
    
    var btn = document.querySelector(".ds-media-upload-btn");
    if (!btn) { load(); return; }
    var origText = btn.textContent;
    btn.textContent = "⏳ Uploading...";
    btn.disabled = true;

    var fd = new FormData();
    fd.append("file", file);

    fetch("/api/media", {
      method: "POST",
      body: fd
    })
    .then(function (res) {
      if (!res.ok) throw new Error("Upload failed");
      return res.json();
    })
    .then(function (data) {
      btn.textContent = "✅ Success!";
      inp.value = "";
      if (data && data.name) {
        replaceSelectedSlot("/media/" + encodeURIComponent(data.name));
      }
      setTimeout(function () {
        btn.textContent = origText;
        btn.disabled = false;
      }, 1500);
      load();
    })
    .catch(function (err) {
      console.error(err);
      btn.textContent = "❌ Failed";
      setTimeout(function () {
        btn.textContent = origText;
        btn.disabled = false;
      }, 1500);
    });
  }

  function load() {
    var gallery = document.getElementById("ds-media-gallery");
    if (!gallery) return;
    gallery.innerHTML = '<div class="ds-media-loading">Loading media...</div>';

    fetch("/api/media")
    .then(function (res) {
      if (!res.ok) throw new Error("Could not load media");
      return res.json();
    })
    .then(function (files) {
      if (!files.length) {
        gallery.innerHTML = '<div class="ds-media-loading">No media uploaded yet.</div>';
        return;
      }
      gallery.innerHTML = files.map(function (f) {
        var safeName = encodeURIComponent(f.name);
        var src = "/media/" + safeName;
        var displayName = f.originalName || f.name;
        return (
          '<div class="ds-media-item" onclick="FB.design.media.insertImage(\'' + src + '\')">' +
          '<img src="' + src + '" alt="' + FB.design._esc(displayName) + '" />' +
          '<button class="ds-media-delete-btn" onclick="FB.design.media.deleteMedia(event, \'' + safeName + '\')" title="Delete">🗑</button>' +
          '</div>'
        );
      }).join("");
    })
    .catch(function (err) {
      gallery.innerHTML = '<div class="ds-media-loading">Failed to load media: ' + err.message + '</div>';
    });
  }

  function insertImage(src) {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    if (replaceSelectedSlot(src)) return;
    
    fabric.Image.fromURL(src, function (img) {
      var maxW = fc.getWidth() * 0.5;
      if (img.width > maxW) img.scaleToWidth(maxW);
      img.set({
        left: fc.getWidth() / 2 - img.getScaledWidth() / 2,
        top: fc.getHeight() / 2 - img.getScaledHeight() / 2,
        name: "Image"
      });
      fc.add(img);
      fc.setActiveObject(img);
      fc.renderAll();
      FB.design.history.push();
    }, { crossOrigin: "anonymous" });
  }

  function _selectedSlot() {
    var fc = FB.design.canvas.get();
    var obj = fc && fc.getActiveObject();
    if (!obj || !FB.design.elements || !FB.design.elements.imageSlotFor) return null;
    return FB.design.elements.imageSlotFor(obj);
  }

  function _slotBounds(slot) {
    slot.setCoords();
    var matrix = slot.calcTransformMatrix();
    var points = [
      new fabric.Point(0, 0),
      new fabric.Point(slot.width || 1, 0),
      new fabric.Point(slot.width || 1, slot.height || 1),
      new fabric.Point(0, slot.height || 1),
    ].map(function (point) {
      return fabric.util.transformPoint(point, matrix);
    });
    var xs = points.map(function (point) { return point.x; });
    var ys = points.map(function (point) { return point.y; });
    var b = {
      left: Math.min.apply(Math, xs),
      top: Math.min.apply(Math, ys),
      width: Math.max.apply(Math, xs) - Math.min.apply(Math, xs),
      height: Math.max.apply(Math, ys) - Math.min.apply(Math, ys),
    };
    return {
      left: b.left,
      top: b.top,
      width: Math.max(1, b.width),
      height: Math.max(1, b.height),
    };
  }

  function replaceSelectedSlot(src) {
    var fc = FB.design.canvas.get();
    var slot = _selectedSlot();
    if (!fc || !slot) return false;
    var bounds = _slotBounds(slot);
    var slotId = slot._dsImageSlotId || ("ds-img-slot-" + Date.now());
    slot._dsImageSlotId = slotId;

    fabric.Image.fromURL(src, function (img) {
      fc.getObjects().slice().forEach(function (obj) {
        if (obj._dsSlotImage && obj._dsSlotImageFor === slotId) fc.remove(obj);
      });
      var imageEl = img.getElement ? img.getElement() : null;
      var intrinsicW = img.width || (imageEl && (imageEl.naturalWidth || imageEl.width)) || bounds.width;
      var intrinsicH = img.height || (imageEl && (imageEl.naturalHeight || imageEl.height)) || bounds.height;
      var scale = Math.max(bounds.width / intrinsicW, bounds.height / intrinsicH);
      var clip = new fabric.Rect({
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
        absolutePositioned: true,
      });
      img.set({
        width: intrinsicW,
        height: intrinsicH,
        left: bounds.left + (bounds.width - intrinsicW * scale) / 2,
        top: bounds.top + (bounds.height - intrinsicH * scale) / 2,
        originX: "left",
        originY: "top",
        scaleX: scale,
        scaleY: scale,
        clipPath: clip,
        name: (slot._dsImageSlotPrefix || "Marketing") + " / Image",
        _dsSlotImage: true,
        _dsSlotImageFor: slotId,
      });
      fc.add(img);
      var slotIndex = fc.getObjects().indexOf(slot.group || slot);
      if (slotIndex >= 0) {
        fc.moveTo(img, slotIndex + 1);
      }
      fc.setActiveObject(img);
      fc.renderAll();
      FB.design.layers.render();
      FB.design.props.render();
      FB.design.history.push();
      if (FB.util && FB.util.showToast) FB.util.showToast("Image placed in slot");
    }, { crossOrigin: "anonymous" });
    return true;
  }

  function deleteMedia(e, name) {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this image?")) return;

    fetch("/api/media/" + name, {
      method: "DELETE"
    })
    .then(function (res) {
      if (!res.ok) throw new Error("Delete failed");
      load();
    })
    .catch(function (err) {
      alert("Error: " + err.message);
    });
  }

  return {
    triggerUpload: triggerUpload,
    handleUpload: handleUpload,
    load: load,
    insertImage: insertImage,
    replaceSelectedSlot: replaceSelectedSlot,
    deleteMedia: deleteMedia
  };
})();
