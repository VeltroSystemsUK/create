FB.design = {};
FB.design._mode = false;

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

FB.design.switchLeftTab = function (tab) {
  document.querySelectorAll("#ds-left-tabs .ds-tab").forEach(function (b) {
    b.classList.toggle("active", b.dataset.tab === tab);
  });
  document
    .querySelectorAll("#ds-tab-elements,#ds-tab-layers,#ds-tab-assets,#ds-tab-media")
    .forEach(function (el) {
      el.classList.toggle("active", el.id === "ds-tab-" + tab);
    });
  if (tab === "assets") FB.design._loadAssets();
  if (tab === "media") FB.design.media.load();
};

FB.design.switchRightTab = function (tab) {
  document.querySelectorAll("#ds-right-tabs .ds-tab").forEach(function (b) {
    b.classList.toggle("active", b.dataset.tab === tab);
  });
  document
    .querySelectorAll("#ds-tab-design,#ds-tab-align,#ds-tab-export")
    .forEach(function (el) {
      el.classList.toggle("active", el.id === "ds-tab-" + tab);
    });
  if (tab === "export") FB.design.renderExportTab();
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
  var bg =
    typeof fc.backgroundColor === "string" ? fc.backgroundColor : "#ffffff";
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
    { type: "tri", label: "▲", title: "Triangle" },
    { type: "poly", label: "⬡", title: "Polygon" },
    { type: "star", label: "★", title: "Star" },
    { type: "line", label: "—", title: "Line" },
    { type: "arrow", label: "→", title: "Arrow" },
    { type: "dashed", label: "╌", title: "Dashed Line" },
    { type: "heart", label: "♡", title: "Heart" },
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
    { type: "kinetic-text",     icon: "〰",  label: "Kinetic Text",     desc: "Wave-animated text" },
    { type: "text-scramble",    icon: "⌨",  label: "Text Scramble",    desc: "Decode effect" },
    { type: "typewriter-reveal",icon: "✍",  label: "Typewriter",       desc: "Reveal animation" },
    { type: "physics-sandbox",  icon: "◉",  label: "Physics Sandbox",  desc: "Interactive physics" },
    { type: "holographic-card", icon: "✦",  label: "Holographic Card", desc: "Iridescent card" },
    { type: "tilt-card-3d",     icon: "⬡",  label: "3D Tilt Card",     desc: "Perspective tilt" },
    { type: "aurora-bg",        icon: "⊙",  label: "Aurora BG",        desc: "Northern lights" },
    { type: "nebula-bg",        icon: "✶",  label: "Nebula BG",        desc: "Particle nebula" },
  ];

  var _iconQuery = "";

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
      _accordionHtml("Shapes", _shapesHtml(), true) +
      _accordionHtml("Veltro Engine", _veltroHtml(), true) +
      _accordionHtml("Text", _textHtml(), false) +
      _accordionHtml("Icons", _iconsHtml(), !!_iconQuery) +
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

  function _veltroHtml() {
    return (
      '<div class="ds-veltro-grid">' +
      VELTRO_ELEMENTS.map(function (v) {
        return (
          '<div class="ds-veltro-tile" onclick="FB.design.elements.addVeltroElement(\'' +
          v.type +
          "')\">" +
          '<span class="ds-veltro-icon">' + v.icon + '</span>' +
          '<div class="ds-veltro-info">' +
          '<div class="ds-veltro-name">' + v.label + '</div>' +
          '<div class="ds-veltro-desc">' + v.desc + '</div>' +
          '</div></div>'
        );
      }).join("") +
      "</div>"
    );
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
    var fc = FB.design.canvas.get();
    var currentBg = (fc && fc.backgroundColor) || "#ffffff";
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
    _addVeltroElementToCanvas(type);
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
        _veltroType: "physicsSandbox"
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
    addVeltroElement: addVeltroElement
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
    _stack.push(JSON.stringify(fc.toJSON(["id", "name"])));
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

FB.design.canvas = (function () {
  var _fc = null;
  var _inited = false;

  var PRESETS = {
    blank: { w: 800, h: 600 },
    hero: { w: 1920, h: 600 },
    og: { w: 1200, h: 630 },
    card: { w: 800, h: 600 },
    square: { w: 1080, h: 1080 },
    wide: { w: 1920, h: 1080 },
  };

  function init() {
    if (_inited) {
      _fc.renderAll();
      return;
    }
    _inited = true;

    _fc = new fabric.Canvas("ds-canvas", {
      backgroundColor: "#ffffff",
      selection: true,
      preserveObjectStacking: true,
    });

    applyPreset("blank");
    _bindZoomPan();
    _bindEvents();
    _bindKeys();
    FB.design.tools.bindMouseDraw();
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
      }
    });
    _fc.on("mouse:up", function () {
      _panning = false;
      _fc.selection = FB.design.tools.active() === "select";
    });
  }

  function _bindEvents() {
    _fc.on("selection:created", function () {
      FB.design.props.render();
      FB.design.layers.render();
      FB.design.align.renderPanel();
    });
    _fc.on("selection:updated", function () {
      FB.design.props.render();
      FB.design.layers.render();
      FB.design.align.renderPanel();
    });
    _fc.on("selection:cleared", function () {
      FB.design.props.render();
      FB.design.layers.render();
      FB.design.align.renderPanel();
    });
    _fc.on("object:added", function () {
      FB.design.layers.render();
      FB.design.history.push();
    });
    _fc.on("object:removed", function () {
      FB.design.layers.render();
      FB.design.history.push();
    });
    _fc.on("object:modified", function () {
      FB.design.props.render();
      FB.design.layers.render();
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
    document.getElementById("ds-zoom-label").textContent =
      Math.round(z * 100) + "%";
  }

  function zoomOut() {
    var z = Math.max(_fc.getZoom() * 0.8, 0.05);
    _fc.setZoom(z);
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
    var body =
      obj.type === "i-text"
        ? _textProps(obj)
        : obj.type === "image"
          ? _imageProps(obj)
          : _shapeProps(obj);
    el.innerHTML = _actionBar(obj) + body;
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
    var fill = typeof obj.fill === "string" ? obj.fill : "#4a90e2";
    var stroke = obj.stroke || "transparent";
    var sw = obj.strokeWidth || 0;
    var op = Math.round((obj.opacity || 1) * 100);
    var fillNormalized = FB.design.normalizeColorForInput(fill);
    var strokeNormalized = FB.design.normalizeColorForInput(stroke === "transparent" ? "#000000" : stroke);
    var html = _posSize(obj);
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
    if (obj.type === "rect") {
      html +=
        '<div class="ds-prop-group"><div class="ds-prop-label">Corner Radius</div>' +
        '<input id="shape-radius" name="shape-radius" class="ds-input" type="number" value="' +
        (obj.rx || 0) +
        "\" onchange=\"FB.design.props.setPropXY('rx','ry',+this.value)\"/></div>";
    }
    html += _shadowSection(obj);
    return html;
  }

  function _textProps(obj) {
    var isBold = obj.fontWeight === "bold" || +obj.fontWeight >= 700;
    var isItalic = obj.fontStyle === "italic";
    var isUnder = !!obj.underline;
    var lineH = +(obj.lineHeight || 1.2).toFixed(1);
    var spacing = +(obj.charSpacing || 0);
    var html = _posSize(obj);

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
      "</div></div></div>";

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
    return html;
  }

  function _canvasProps(fc) {
    var canvasBgColor = FB.design.normalizeColorForInput(fc.backgroundColor || "#ffffff");
    return (
      '<div class="ds-prop-group"><div class="ds-prop-label">Canvas Background</div>' +
      '<div class="ds-color-row"><input type="color" class="ds-color-swatch" value="' +
      canvasBgColor +
      '" onchange="FB.design.props.setCanvasBg(this.value)"/>' +
      '<input class="ds-input" value="' +
      (fc.backgroundColor || "#ffffff") +
      '" onchange="FB.design.props.setCanvasBg(this.value)"/></div></div>'
    );
  }

  function setProp(key, val) {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj) return;
    obj.set(key, val);
    obj.setCoords();
    fc.renderAll();
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
    FB.design.history.push();
  }

  function setWidth(val) {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj) return;
    obj.scaleToWidth(val);
    obj.setCoords();
    fc.renderAll();
    FB.design.history.push();
  }

  function setHeight(val) {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj) return;
    obj.scaleToHeight(val);
    obj.setCoords();
    fc.renderAll();
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

  function setCanvasBg(val) {
    var fc = FB.design.canvas.get();
    fc.setBackgroundColor(val, function () {
      fc.renderAll();
      FB.design.history.push();
    });
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

  return {
    render: render,
    setProp: setProp,
    setPropXY: setPropXY,
    setWidth: setWidth,
    setHeight: setHeight,
    flip: flip,
    setCanvasBg: setCanvasBg,
    duplicate: duplicate,
    deleteSelected: deleteSelected,
    toggleBold: toggleBold,
    toggleShadow: toggleShadow,
    setShadow: setShadow,
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
    var thumbnail = fc.toDataURL({
      format: "png",
      multiplier: Math.min(1, 320 / fc.getWidth()),
    });
    var payload = {
      name: name,
      width: fc.getWidth(),
      height: fc.getHeight(),
      thumbnail: thumbnail,
      fabric: fc.toJSON(["name"]),
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
        fc.setWidth(d.width);
        fc.setHeight(d.height);
        FB.design.history.silent(function () {
          fc.loadFromJSON(d.fabric, function () {
            fc.renderAll();
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
    var url = fc.toDataURL({ format: "png", multiplier: 1 });
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

  function insertIntoPage() {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var dataUrl = fc.toDataURL({ format: "png", multiplier: 1 });
    FB.panels.setMode("builder");
    FB.state.saveHistory();
    FB.state.blocks.push({
      id: FB.state.genId(),
      type: "imageBlock",
      props: { src: dataUrl, alt: _currentName, objectFit: "contain" },
    });
    FB.canvas.render();
    FB.util.showToast("Design inserted as image block");
  }

  return {
    save: save,
    openPicker: openPicker,
    closePicker: closePicker,
    loadDesign: loadDesign,
    exportPNG: exportPNG,
    exportSVG: exportSVG,
    insertIntoPage: insertIntoPage,
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
    deleteMedia: deleteMedia
  };
})();
