FB.panels = {};

FB.panels.accordionState = {};

FB.panels.GOOGLE_FONTS = [
  "",
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
  "PT Serif",
  "Crimson Text",
  "Source Sans Pro",
  "Nunito",
  "Ubuntu",
  "Rubik",
  "Josefin Sans",
  "Space Grotesk",
  "DM Sans",
  "Figtree",
  "Plus Jakarta Sans",
  "Bebas Neue",
  "Oswald",
  "Pacifico",
  "Dancing Script",
  "Caveat",
  "IBM Plex Mono",
  "Fira Code",
  "JetBrains Mono",
  "Space Mono",
];

FB.panels._icon = function (icon, color, size, h, fs) {
  var s = size || 32,
    ht = h || 24,
    f = fs || 9;
  return (
    '<div class="block-icon" style="background:' +
    color +
    "18;color:" +
    color +
    ";width:" +
    s +
    "px;height:" +
    ht +
    "px;font-size:" +
    f +
    'px">' +
    icon +
    "</div>"
  );
};

FB.panels.buildLibrary = function () {
  var lib = document.getElementById("block-library");
  lib.innerHTML = "";

  var sectionColors = {
    Structure: "#6366f1",
    Content: "#22c55e",
    Media: "#f59e0b",
    "Social Proof": "#ec4899",
    Conversion: "#ef4444",
  };

  var sections = {
    Structure: ["nav", "megaNav", "slideNav", "fullscreenMenu", "footer"],
    Content: [
      "hero",
      "orbsHero",
      "splitHero",
      "videoHero",
      "marquee",
      "wordSwap",
      "services",
      "features",
      "process",
      "work",
      "stats",
      "resultsGrid",
      "glassCards",
      "pricing",
      "team",
      "portfolioGrid",
      "splitText",
      "maskReveal",
      "glitchText",
      "svgDraw",
      "noiseSection",
      "cornerSection",
      "iridescentBtn",
      "particleButton",
    ],
    Media: ["clientCarousel", "liteVideo", "circularList", "horizontalScroll"],
    "Social Proof": [
      "testimonial",
      "trustPill",
      "metricBox",
      "faq",
      "timeline",
      "counterSection",
    ],
    Conversion: [
      "cta",
      "chatWidget",
      "cookieConsent",
      "dayNightSwitcher",
      "scrollIndicator",
    ],
  };

  Object.keys(sections).forEach(function (sectionName) {
    var color = sectionColors[sectionName] || "#6366f1";
    var secEl = document.createElement("div");
    secEl.className = "section-header";
    secEl.innerHTML =
      '<span class="section-dot" style="background:' +
      color +
      '"></span>' +
      sectionName;
    lib.appendChild(secEl);

    sections[sectionName].forEach(function (type) {
      var def = FB.blocks.BLOCK_DEFS[type];
      if (!def) return;
      var el = document.createElement("div");
      el.className = "block-item";
      el.draggable = true;
      el.innerHTML =
        FB.panels._icon(def.icon, color) +
        '<div><div class="block-label">' +
        def.label +
        '</div><div class="block-sublabel">' +
        def.sublabel +
        "</div></div>";
      el.addEventListener("dragstart", function (e) {
        FB.canvas._dragLibType = type;
        FB.canvas._dragSrcId = null;
      });
      el.addEventListener("click", function () {
        FB.canvas.insertBlock(type);
      });
      lib.appendChild(el);
    });
  });

  // Custom block library — violet
  var clib = document.getElementById("custom-block-library");
  clib.innerHTML = "";
  var customColor = "#8b5cf6";
  Object.keys(FB.blocks.CUSTOM_BLOCK_DEFS).forEach(function (type) {
    var def = FB.blocks.CUSTOM_BLOCK_DEFS[type];
    var el = document.createElement("div");
    el.className = "block-item";
    el.draggable = true;
    el.innerHTML =
      FB.panels._icon(def.icon, customColor) +
      '<div><div class="block-label">' +
      def.label +
      '</div><div class="block-sublabel">' +
      def.sublabel +
      "</div></div>";
    el.addEventListener("dragstart", function (e) {
      FB.canvas._dragLibType = type;
      FB.canvas._dragSrcId = null;
    });
    el.addEventListener("click", function () {
      FB.canvas.insertBlock(type);
    });
    clib.appendChild(el);
  });

  // Layout library — cyan
  var llib = document.getElementById("layout-library");
  if (llib) {
    llib.innerHTML = "";
    var layoutColor = "#06b6d4";
    var layoutWidgets = FB.widgets.byCategory("layout");
    Object.keys(layoutWidgets).forEach(function (type) {
      var def = layoutWidgets[type];
      var el = document.createElement("div");
      el.className = "block-item";
      el.draggable = true;
      el.style.cssText = "padding:6px 14px";
      el.innerHTML =
        FB.panels._icon(def.icon || "\u2637", layoutColor, 24, 20, 8) +
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
      llib.appendChild(el);
    });
  }

  // Theme panel
  var themePanel = document.getElementById("theme-panel-content");
  if (themePanel && FB.theme && FB.theme.renderPanel) {
    themePanel.innerHTML = FB.theme.renderPanel();
  }

  // Widget library — per sub-category color
  var wlib = document.getElementById("widget-library");
  if (wlib) {
    wlib.innerHTML = "";
    var widgetColors = {
      basic: "#64748b",
      content: "#22c55e",
      media: "#f59e0b",
      interactive: "#3b82f6",
      "gallery-like": "#ec4899",
      embed: "#ef4444",
    };
    var catLabels = {
      basic: "Basic",
      content: "Content",
      media: "Media",
      interactive: "Interactive",
      "gallery-like": "Gallery",
      embed: "Embed",
    };
    var catOrder = [
      "basic",
      "content",
      "media",
      "interactive",
      "gallery-like",
      "embed",
    ];
    catOrder.forEach(function (cat) {
      var widgets = FB.widgets.byCategory(cat);
      var keys = Object.keys(widgets);
      if (keys.length === 0) return;
      var wColor = widgetColors[cat] || "#64748b";
      var catEl = document.createElement("div");
      catEl.className = "section-header";
      catEl.innerHTML =
        '<span class="section-dot" style="background:' +
        wColor +
        '"></span>' +
        (catLabels[cat] || cat);
      wlib.appendChild(catEl);
      keys.forEach(function (type) {
        var def = widgets[type];
        var el = document.createElement("div");
        el.className = "block-item";
        el.draggable = true;
        el.style.cssText = "padding:6px 14px";
        el.innerHTML =
          FB.panels._icon(def.icon || "\u25A1", wColor, 24, 20, 8) +
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
  }

  // Ecommerce blocks — green with sub-accordions
  var elib = document.getElementById("ecommerce-library");
  if (elib && FB.blocks.ECOMMERCE_DEFS) {
    elib.innerHTML = "";
    var ecomColor = "#22c55e";
    var ecomSections = {
      "Product Display": [
        "ecomProductCard",
        "ecomProductGrid",
        "ecomFeaturedProduct",
        "ecomProductCarousel",
        "ecomQuickView",
        "ecomFilters",
        "ecomRelatedProducts",
        "ecomProductTabs",
      ],
      Shopping: ["ecomCartDrawer", "ecomCartSummary", "ecomCheckoutForm"],
      Marketing: [
        "ecomSaleBanner",
        "ecomCountdown",
        "ecomCouponInput",
        "ecomShippingProgress",
        "ecomReviews",
        "ecomTrustBadges",
        "ecomNewsletter",
      ],
    };

    Object.keys(ecomSections).forEach(function (subName) {
      var subEl = document.createElement("div");
      subEl.className = "section-header";
      subEl.style.cssText = "padding-left:12px;font-size:10px;opacity:0.7;";
      subEl.innerHTML =
        '<span class="section-dot" style="background:' +
        ecomColor +
        '"></span>' +
        subName;
      elib.appendChild(subEl);

      ecomSections[subName].forEach(function (type) {
        var def = FB.blocks.ECOMMERCE_DEFS[type];
        if (!def) return;
        var itemEl = document.createElement("div");
        itemEl.className = "block-item";
        itemEl.draggable = true;
        itemEl.style.cssText = "padding-left:24px;";
        itemEl.innerHTML =
          FB.panels._icon(def.icon, ecomColor) +
          '<div><div class="block-label">' +
          def.label +
          '</div><div class="block-sublabel">' +
          def.sublabel +
          "</div></div>";
        itemEl.addEventListener("dragstart", function (e) {
          FB.canvas._dragLibType = type;
          FB.canvas._dragSrcId = null;
        });
        itemEl.addEventListener("click", function () {
          FB.canvas.insertBlock(type);
        });
        elib.appendChild(itemEl);
      });
    });
  }

  // Veltro Engine widgets — orange
  var vlib = document.getElementById("veltro-library");
  if (vlib) {
    vlib.innerHTML = "";
    var veltroColor = "#f97316";
    var veltroWidgets = FB.widgets.byCategory("veltro");
    Object.keys(veltroWidgets).forEach(function (type) {
      var def = veltroWidgets[type];
      var el = document.createElement("div");
      el.className = "block-item";
      el.draggable = true;
      el.style.cssText = "padding:6px 14px";
      el.innerHTML =
        FB.panels._icon(def.icon || "\u26A1", veltroColor, 28, 22, 12) +
        '<div><div class="block-label" style="font-size:11px">' +
        def.label +
        "</div>" +
        (def.sublabel
          ? '<div class="block-sublabel" style="font-size:9px;color:#666">' +
            def.sublabel +
            "</div>"
          : "") +
        "</div>";
      el.addEventListener("dragstart", function (e) {
        FB.canvas._dragLibType = type;
        FB.canvas._dragSrcId = null;
      });
      el.addEventListener("click", function () {
        FB.canvas.insertBlock(type);
      });
      vlib.appendChild(el);
    });
  }

  // Theme panel
  var themePanel = document.getElementById("theme-panel-content");
  if (themePanel && FB.theme && FB.theme.renderPanel) {
    themePanel.innerHTML = FB.theme.renderPanel();
  }

  // Widget library (all non-layout widgets)
  var wlib = document.getElementById("widget-library");
  if (wlib) {
    wlib.innerHTML = "";
    var catLabels = {
      basic: "Basic",
      content: "Content",
      media: "Media",
      interactive: "Interactive",
      "gallery-like": "Gallery",
      embed: "Embed",
    };
    var catOrder = [
      "basic",
      "content",
      "media",
      "interactive",
      "gallery-like",
      "embed",
    ];
    catOrder.forEach(function (cat) {
      var widgets = FB.widgets.byCategory(cat);
      var keys = Object.keys(widgets);
      if (keys.length === 0) return;
      var catEl = document.createElement("div");
      catEl.className = "panel-title";
      catEl.style.cssText = "margin-top:4px;font-size:9px;";
      catEl.textContent = catLabels[cat] || cat;
      wlib.appendChild(catEl);
      keys.forEach(function (type) {
        var def = widgets[type];
        var el = document.createElement("div");
        el.className = "block-item";
        el.draggable = true;
        el.style.cssText = "padding:6px 14px";
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
  }

  // Veltro Engine widgets
  var vlib = document.getElementById("veltro-library");
  if (vlib) {
    vlib.innerHTML = "";
    var veltroWidgets = FB.widgets.byCategory("veltro");
    Object.keys(veltroWidgets).forEach(function (type) {
      var def = veltroWidgets[type];
      var el = document.createElement("div");
      el.className = "block-item";
      el.draggable = true;
      el.style.cssText = "padding:6px 14px";
      el.innerHTML =
        '<div class="block-icon" style="background:' +
        def.iconBg +
        ";color:" +
        def.iconColor +
        ';width:28px;height:22px;font-size:12px">' +
        (def.icon || "⚡") +
        "</div>" +
        '<div><div class="block-label" style="font-size:11px">' +
        def.label +
        "</div>" +
        (def.sublabel
          ? '<div class="block-sublabel" style="font-size:9px;color:#666">' +
            def.sublabel +
            "</div>"
          : "") +
        "</div>";
      el.addEventListener("dragstart", function (e) {
        FB.canvas._dragLibType = type;
        FB.canvas._dragSrcId = null;
      });
      el.addEventListener("click", function () {
        FB.canvas.insertBlock(type);
      });
      vlib.appendChild(el);
    });
  }
};

FB.panels.updateWidgetProp = function (id, key, val) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block) return;
  block.props[key] = val;
  FB.canvas.refreshBlock(id);
};

// Live-updates shader uniforms without re-rendering; falls back to refreshBlock for height.
FB.panels.updateShaderProp = function (id, key, val) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block) return;
  block.props[key] = val;
  if (key === "height") {
    FB.canvas.refreshBlock(id);
    return;
  }
  var c = document.getElementById("shader-" + id);
  if (c && c._shader) {
    c._shader.props[key] = val;
  }
};

FB.panels.addInfiniteCanvasItem = function (id) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block) return;
  block.props.items = block.props.items || [];
  block.props.items.push({
    x: Math.round(Math.random() * 600 - 100),
    y: Math.round(Math.random() * 300 + 100),
    depthFactor: 1.0,
    content:
      '<div style="padding:24px 32px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:12px;color:#fff;font-size:18px;font-weight:600">New Node</div>',
  });
  FB.canvas.refreshBlock(id);
  FB.panels.renderRightPanel();
};

FB.panels.removeInfiniteCanvasItem = function (id, idx) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block || !block.props.items) return;
  block.props.items.splice(idx, 1);
  FB.canvas.refreshBlock(id);
  FB.panels.renderRightPanel();
};

FB.panels.updateInfiniteCanvasItem = function (id, idx, key, val) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block || !block.props.items || !block.props.items[idx]) return;
  block.props.items[idx][key] = val;
  FB.canvas.refreshBlock(id);
};

FB.panels.toggleAccordion = function (headerEl) {
  var body = headerEl.nextElementSibling;
  var isOpen = headerEl.classList.toggle("open");
  body.classList.toggle("collapsed", !isOpen);
  // Persist state so renderRightPanel re-renders with correct open/closed state
  var key = headerEl.dataset.accKey;
  if (key && FB.state.selectedId) {
    var block = FB.state.blocks.find(function (b) {
      return b.id === FB.state.selectedId;
    });
    if (block && FB.panels.accordionState[block.type]) {
      FB.panels.accordionState[block.type][key] = isOpen;
    }
  }
};

var _ACC_KEY_MAP = {
  Content: "content",
  Style: "style",
  Typography: "typography",
  "Spacing & Dimensions": "spacing",
  "Transform & Visibility": "advanced",
  "Effects & Border": "effects",
  "Hover States": "hover",
  Animation: "animation",
};

FB.panels.renderSection = function (title, content, isOpen) {
  var key = _ACC_KEY_MAP[title] || title.toLowerCase().replace(/\s+/g, "_");
  return (
    '<div class="rp-section">' +
    '<div class="accordion-header ' +
    (isOpen ? "open" : "") +
    '" data-acc-key="' +
    key +
    '" onclick="FB.panels.toggleAccordion(this)">' +
    '<span class="acc-label">' +
    title +
    '</span><span class="acc-arrow">\u25B6</span></div>' +
    '<div class="accordion-body ' +
    (isOpen ? "" : "collapsed") +
    '">' +
    content +
    "</div></div>"
  );
};

FB.panels.renderRightPanel = function () {
  var rp = document.getElementById("rp-content");
  if (!FB.state.selectedId) {
    rp.innerHTML =
      '<div class="rp-empty"><div class="rp-empty-icon">\u2190</div><div>Click a block to edit its styles</div></div>';
    return;
  }
  var block = FB.state.blocks.find(function (b) {
    return b.id === FB.state.selectedId;
  });
  if (!block) return;
  var p = block.props;
  var allDefs = Object.assign(
    {},
    FB.blocks.BLOCK_DEFS,
    FB.blocks.CUSTOM_BLOCK_DEFS,
    FB.widgets._registry,
  );
  var def = allDefs[block.type];
  if (!def) return;

  if (!FB.panels.accordionState[block.type]) {
    FB.panels.accordionState[block.type] = {
      content: true,
      style: true,
      typography: true,
      spacing: false,
      advanced: false,
      effects: false,
      hover: false,
      animation: false,
    };
  }
  var acc = FB.panels.accordionState[block.type];
  if (acc.animation === undefined) acc.animation = false;
  if (acc.typography === undefined) acc.typography = true;
  if (acc.effects === undefined) acc.effects = false;
  if (acc.hover === undefined) acc.hover = false;

  /* Content section */
  var contentHtml = "";

  // Widget types — delegate to widget's edit panel
  if (FB.widgets.get(block.type)) {
    contentHtml = FB.widgets.getEditPanel(block.type, block.id, block.props);
  } else if (block.type === "nav") {
    contentHtml +=
      '<div class="rp-row"><label>Logo Text</label><input type="text" value="' +
      p.logoText +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','logoText',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>CTA Text</label><input type="text" value="' +
      p.ctaText +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','ctaText',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Links (one per line)</label><textarea rows="4" onchange="FB.panels.updatePropJSON(\'' +
      block.id +
      "','links',this.value.split('\\n').filter(function(s){return s.trim()}))\">" +
      (p.links || []).join("\n") +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label>Menu Style</label><select onchange="FB.panels.updateProp(\'' +
      block.id +
      "','menuStyle',this.value)\">" +
      '<option value="simple"' +
      (p.menuStyle === "simple" ? " selected" : "") +
      ">Simple</option>" +
      '<option value="mega"' +
      (p.menuStyle === "mega" ? " selected" : "") +
      ">Mega Dropdown</option>" +
      '<option value="slide"' +
      (p.menuStyle === "slide" ? " selected" : "") +
      ">Slide-in Panel</option>" +
      "</select></div>";
  }
  if (block.type === "hero") {
    contentHtml +=
      '<div class="rp-row"><label>Eyebrow</label><input type="text" value="' +
      p.eyebrow +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','eyebrow',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Headline (HTML allowed)</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','headline',this.value)\">" +
      p.headline +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label>Subtext</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','subtext',this.value)\">" +
      p.subtext +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label>CTA Text</label><input type="text" value="' +
      p.ctaText +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','ctaText',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Background Style</label><select onchange="FB.panels.updateProp(\'' +
      block.id +
      "','blobStyle',this.value)\">" +
      '<option value="blob"' +
      (p.blobStyle === "blob" ? " selected" : "") +
      ">Blob</option>" +
      '<option value="orbs"' +
      (p.blobStyle === "orbs" ? " selected" : "") +
      ">Orbs</option>" +
      '<option value="gradient"' +
      (p.blobStyle === "gradient" ? " selected" : "") +
      ">Gradient</option>" +
      '<option value="solid"' +
      (p.blobStyle === "solid" ? " selected" : "") +
      ">Solid</option>" +
      '<option value="video"' +
      (p.blobStyle === "video" ? " selected" : "") +
      ">Video</option>" +
      "</select></div>";
  }
  if (block.type === "marquee") {
    contentHtml +=
      '<div class="rp-row"><label>Items (one per line)</label><textarea rows="5" onchange="FB.panels.updatePropJSON(\'' +
      block.id +
      "','items',this.value.split('\\n').filter(function(s){return s.trim()}))\">" +
      (p.items || []).join("\n") +
      "</textarea></div>";
  }
  if (block.type === "services") {
    contentHtml +=
      '<div class="rp-row"><label>Services (one per line)</label><textarea rows="6" onchange="FB.panels.updateServicesFromText(\'' +
      block.id +
      "',this.value)\">" +
      (p.services || [])
        .map(function (s) {
          return s.name;
        })
        .join("\n") +
      "</textarea></div>";
  }
  if (block.type === "stats") {
    (p.stats || []).forEach(function (s, i) {
      contentHtml +=
        '<div class="rp-row" style="flex-direction:row;gap:6px">' +
        '<input type="text" value="' +
        s.num +
        '" placeholder="Value" style="width:45%" onchange="FB.panels.updateStatField(\'' +
        block.id +
        "'," +
        i +
        ",'num',this.value)\">" +
        '<input type="text" value="' +
        s.label +
        '" placeholder="Label" style="width:55%" onchange="FB.panels.updateStatField(\'' +
        block.id +
        "'," +
        i +
        ",'label',this.value)\"></div>";
    });
  }
  if (block.type === "process") {
    (p.steps || []).forEach(function (s, i) {
      contentHtml +=
        '<div class="rp-row"><label>Step ' +
        (i + 1) +
        " Title</label>" +
        '<input type="text" value="' +
        s.title +
        '" onchange="FB.panels.updateStepField(\'' +
        block.id +
        "'," +
        i +
        ",'title',this.value)\">" +
        '<label style="margin-top:4px">Description</label>' +
        '<textarea rows="2" onchange="FB.panels.updateStepField(\'' +
        block.id +
        "'," +
        i +
        ",'desc',this.value)\">" +
        s.desc +
        "</textarea></div>";
    });
  }
  if (block.type === "work") {
    contentHtml +=
      '<div class="rp-row"><label>Section Label</label><input type="text" value="' +
      p.label +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','label',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Headline</label><input type="text" value="' +
      p.headline +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','headline',this.value)\"></div>";
  }
  if (
    block.type === "textBlock" ||
    block.type === "colorBlock" ||
    block.type === "features" ||
    block.type === "pricing" ||
    block.type === "team"
  ) {
    contentHtml +=
      '<div class="rp-row"><label>Section Label</label><input type="text" value="' +
      p.label +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','label',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Headline</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','headline',this.value)\">" +
      p.headline +
      "</textarea></div>";
  }
  if (
    block.type === "imageTextTop" ||
    block.type === "imageTextBottom" ||
    block.type === "imageTextLeft" ||
    block.type === "imageTextRight"
  ) {
    contentHtml +=
      '<div class="rp-row"><label>Headline</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','headline',this.value)\">" +
      p.headline +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label>Body Text</label><textarea rows="3" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','body',this.value)\">" +
      p.body +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
      p.imageUrl +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','imageUrl',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Image Alt</label><input type="text" value="' +
      p.imageAlt +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','imageAlt',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Image Height (px)</label><input type="number" value="' +
      p.imageHeight +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','imageHeight',+this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Image Radius (px)</label><input type="number" value="' +
      p.imageRadius +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','imageRadius',+this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Image Frame Style</label>' +
      "<select onchange=\"FB.panels.updateProp('" +
      block.id +
      "','frameStyle',this.value)\">" +
      '<option value="">None</option>' +
      '<option value="rounded"' +
      (p.frameStyle === "rounded" ? " selected" : "") +
      ">Rounded</option>" +
      '<option value="circle"' +
      (p.frameStyle === "circle" ? " selected" : "") +
      ">Circle</option>" +
      '<option value="pill"' +
      (p.frameStyle === "pill" ? " selected" : "") +
      ">Pill</option>" +
      '<option value="diamond"' +
      (p.frameStyle === "diamond" ? " selected" : "") +
      ">Diamond</option>" +
      '<option value="hexagon"' +
      (p.frameStyle === "hexagon" ? " selected" : "") +
      ">Hexagon</option>" +
      '<option value="star"' +
      (p.frameStyle === "star" ? " selected" : "") +
      ">Star</option>" +
      '<option value="arch"' +
      (p.frameStyle === "arch" ? " selected" : "") +
      ">Arch</option>" +
      '<option value="squircle"' +
      (p.frameStyle === "squircle" ? " selected" : "") +
      ">Squircle</option>" +
      '<option value="teardrop"' +
      (p.frameStyle === "teardrop" ? " selected" : "") +
      ">Teardrop</option>" +
      '<option value="cross"' +
      (p.frameStyle === "cross" ? " selected" : "") +
      ">Cross</option>" +
      '<option value="border"' +
      (p.frameStyle === "border" ? " selected" : "") +
      ">Simple Border</option>" +
      '<option value="double-border"' +
      (p.frameStyle === "double-border" ? " selected" : "") +
      ">Double Border</option>" +
      '<option value="shadow"' +
      (p.frameStyle === "shadow" ? " selected" : "") +
      ">Drop Shadow</option>" +
      '<option value="float"' +
      (p.frameStyle === "float" ? " selected" : "") +
      ">Float</option>" +
      '<option value="polaroid"' +
      (p.frameStyle === "polaroid" ? " selected" : "") +
      ">Polaroid</option>" +
      '<option value="neon"' +
      (p.frameStyle === "neon" ? " selected" : "") +
      ">Neon Glow</option>" +
      '<option value="glass"' +
      (p.frameStyle === "glass" ? " selected" : "") +
      ">Glass</option>" +
      '<option value="sketch"' +
      (p.frameStyle === "sketch" ? " selected" : "") +
      ">Sketch Dashed</option>" +
      '<option value="ribbon"' +
      (p.frameStyle === "ribbon" ? " selected" : "") +
      ">Ribbon Accent</option>" +
      '<option value="gradient-border"' +
      (p.frameStyle === "gradient-border" ? " selected" : "") +
      ">Gradient Border</option>" +
      '<option value="offset"' +
      (p.frameStyle === "offset" ? " selected" : "") +
      ">Offset Block</option>" +
      '<option value="vintage"' +
      (p.frameStyle === "vintage" ? " selected" : "") +
      ">Vintage Sepia</option>" +
      '<option value="noir"' +
      (p.frameStyle === "noir" ? " selected" : "") +
      ">Film Noir</option>" +
      '<option value="blur-bg"' +
      (p.frameStyle === "blur-bg" ? " selected" : "") +
      ">Blur Background</option>" +
      '<option value="3d"' +
      (p.frameStyle === "3d" ? " selected" : "") +
      ">3D Perspective</option>" +
      '<option value="folded"' +
      (p.frameStyle === "folded" ? " selected" : "") +
      ">Folded Corner</option>" +
      "</select></div>";
    contentHtml +=
      '<div class="rp-row"><label>Text Align</label>' +
      '<div style="display:flex;gap:3px">' +
      ["left", "center", "right"]
        .map(function (a) {
          return (
            '<button class="rp-btn' +
            (p.textAlign === a ? " accent" : "") +
            '" style="flex:1;padding:5px 2px;text-align:center;font-size:10px" onclick="FB.panels.updateProp(\'' +
            block.id +
            "','textAlign','" +
            a +
            "')\">" +
            a.charAt(0).toUpperCase() +
            a.slice(1) +
            "</button>"
          );
        })
        .join("") +
      "</div></div>";
  }
  if (block.type === "testimonial") {
    contentHtml +=
      '<div class="rp-row"><label>Quote</label><textarea rows="3" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','quote',this.value)\">" +
      p.quote +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label>Attribution</label><input type="text" value="' +
      p.attribution +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','attribution',this.value)\"></div>";
  }
  if (block.type === "footer") {
    contentHtml +=
      '<div class="rp-row"><label>Logo Text</label><input type="text" value="' +
      p.logoText +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','logoText',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Tagline</label><input type="text" value="' +
      p.tagline +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','tagline',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Copyright</label><input type="text" value="' +
      p.copyright +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','copyright',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Layout Style</label><select onchange="FB.panels.updateProp(\'' +
      block.id +
      "','layoutStyle',this.value)\">" +
      '<option value="columns"' +
      (p.layoutStyle === "columns" ? " selected" : "") +
      ">Columns</option>" +
      '<option value="mega"' +
      (p.layoutStyle === "mega" ? " selected" : "") +
      ">Mega</option>" +
      '<option value="minimal"' +
      (p.layoutStyle === "minimal" ? " selected" : "") +
      ">Minimal</option>" +
      "</select></div>";
  }
  if (block.type === "cta") {
    contentHtml +=
      '<div class="rp-row"><label>Headline</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','headline',this.value)\">" +
      p.headline +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label>Button Text</label><input type="text" value="' +
      p.btnText +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','btnText',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Button Style</label><select onchange="FB.panels.updateProp(\'' +
      block.id +
      "','buttonStyle',this.value)\">" +
      '<option value="filled"' +
      (p.buttonStyle === "filled" ? " selected" : "") +
      ">Filled</option>" +
      '<option value="outlined"' +
      (p.buttonStyle === "outlined" ? " selected" : "") +
      ">Outlined</option>" +
      '<option value="floating-pulse"' +
      (p.buttonStyle === "floating-pulse" ? " selected" : "") +
      ">Floating Pulse</option>" +
      '<option value="dual"' +
      (p.buttonStyle === "dual" ? " selected" : "") +
      ">Dual Buttons</option>" +
      "</select></div>";
  }
  if (block.type === "videoHero") {
    contentHtml +=
      '<div class="rp-row"><label>Headline (HTML allowed)</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','headline',this.value)\">" +
      p.headline +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label>Subtext</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','subtext',this.value)\">" +
      p.subtext +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label>Video URL</label><input type="text" value="' +
      p.videoUrl +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','videoUrl',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>CTA Primary</label><input type="text" value="' +
      p.ctaPrimary +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','ctaPrimary',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>CTA Secondary</label><input type="text" value="' +
      p.ctaSecondary +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','ctaSecondary',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.showRating ? "checked" : "") +
      " onchange=\"FB.panels.updateProp('" +
      block.id +
      "','showRating',this.checked)\"> Show rating pill</label></div>";
  }
  if (block.type === "splitHero") {
    contentHtml +=
      '<div class="rp-row"><label>Eyebrow</label><input type="text" value="' +
      p.eyebrow +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','eyebrow',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Headline (HTML allowed)</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','headline',this.value)\">" +
      p.headline +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label>Subtext</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','subtext',this.value)\">" +
      p.subtext +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label>CTA Text</label><input type="text" value="' +
      p.ctaText +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','ctaText',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Media URL</label><input type="text" value="' +
      p.embedUrl +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','embedUrl',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.reverse ? "checked" : "") +
      " onchange=\"FB.panels.updateProp('" +
      block.id +
      "','reverse',this.checked)\"> Reverse layout</label></div>";
  }
  if (block.type === "orbsHero") {
    contentHtml +=
      '<div class="rp-row"><label>Headline prefix</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','headline',this.value)\">" +
      p.headline +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label>Subtext</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','subtext',this.value)\">" +
      p.subtext +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label>CTA Text</label><input type="text" value="' +
      p.ctaText +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','ctaText',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Word Speed (ms)</label><input type="number" value="' +
      p.wordSpeed +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','wordSpeed',+this.value)\"></div>";
  }
  if (block.type === "resultsGrid") {
    contentHtml +=
      '<div class="rp-row"><label>Section Label</label><input type="text" value="' +
      p.label +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','label',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Headline</label><input type="text" value="' +
      p.headline +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','headline',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Subtitle</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','subtitle',this.value)\">" +
      p.subtitle +
      "</textarea></div>";
  }
  if (block.type === "glassCards") {
    contentHtml +=
      '<div class="rp-row"><label>Section Label</label><input type="text" value="' +
      p.label +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','label',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Headline</label><input type="text" value="' +
      p.headline +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','headline',this.value)\"></div>";
  }
  if (block.type === "portfolioGrid") {
    contentHtml +=
      '<div class="rp-row"><label>Section Label</label><input type="text" value="' +
      p.label +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','label',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Headline</label><input type="text" value="' +
      p.headline +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','headline',this.value)\"></div>";
  }
  if (block.type === "clientCarousel") {
    contentHtml +=
      '<div class="rp-row"><label>Label</label><input type="text" value="' +
      p.label +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','label',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Speed (s)</label><input type="number" value="' +
      p.speed +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','speed',+this.value)\"></div>";
  }
  if (block.type === "trustPill") {
    contentHtml +=
      '<div class="rp-row"><label>Rating Text</label><input type="text" value="' +
      p.ratingText +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','ratingText',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Stars</label><input type="number" value="' +
      p.stars +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','stars',+this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Verified Date</label><input type="text" value="' +
      p.verifiedDate +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','verifiedDate',this.value)\"></div>";
  }
  if (block.type === "metricBox") {
    contentHtml +=
      '<div class="rp-row"><label>Label</label><input type="text" value="' +
      p.label +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','label',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Before</label><input type="text" value="' +
      p.before +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','before',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>After</label><input type="text" value="' +
      p.after +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','after',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Note</label><input type="text" value="' +
      p.note +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','note',this.value)\"></div>";
  }
  if (block.type === "wordSwap") {
    contentHtml +=
      '<div class="rp-row"><label>Headline prefix (HTML allowed)</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','prefix',this.value)\">" +
      p.prefix +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label>Word Speed (ms)</label><input type="number" value="' +
      p.speed +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','speed',+this.value)\"></div>";
  }
  if (block.type === "chatWidget") {
    contentHtml +=
      '<div class="rp-row"><label>Welcome Text</label><input type="text" value="' +
      p.welcomeText +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','welcomeText',this.value)\"></div>";
  }
  if (block.type === "cookieConsent") {
    contentHtml +=
      '<div class="rp-row"><label>Title</label><input type="text" value="' +
      p.title +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','title',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Message</label><textarea rows="2" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','message',this.value)\">" +
      p.message +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label>Accept Text</label><input type="text" value="' +
      p.acceptText +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','acceptText',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Decline Text</label><input type="text" value="' +
      p.declineText +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','declineText',this.value)\"></div>";
  }
  if (block.type === "liteVideo") {
    contentHtml +=
      '<div class="rp-row"><label>Video ID</label><input type="text" value="' +
      p.videoId +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','videoId',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Title</label><input type="text" value="' +
      p.title +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','title',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>Poster URL</label><input type="text" value="' +
      p.posterUrl +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','posterUrl',this.value)\"></div>";
  }
  if (block.type === "faq") {
    contentHtml +=
      '<div class="rp-row"><label>Section Title</label><input type="text" value="' +
      p.title +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','title',this.value)\"></div>";
    contentHtml +=
      '<div class="rp-row"><label>FAQ Items</label>' +
      '<div style="display:flex;flex-direction:column;gap:8px">';
    (p.items || []).forEach(function (item, i) {
      contentHtml +=
        '<div style="background:var(--surface-1);border:1px solid var(--border);border-radius:6px;padding:10px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
        '<span style="font-size:11px;font-weight:600;color:var(--accent)">Q' +
        (i + 1) +
        "</span>" +
        '<button style="font-size:10px;color:#e88;background:none;border:none;cursor:pointer" onclick="FB.panels.removeFaqItem(\'' +
        block.id +
        "'," +
        i +
        ')">\u2715</button>' +
        "</div>" +
        '<div class="rp-row" style="margin-bottom:4px"><label style="font-size:10px">Question</label><input type="text" value="' +
        item.question.replace(/"/g, "&quot;") +
        '" onchange="FB.panels.updateFaqField(\'' +
        block.id +
        "'," +
        i +
        ",'question',this.value)\"></div>" +
        '<div class="rp-row"><label style="font-size:10px">Answer</label><textarea rows="2" onchange="FB.panels.updateFaqField(\'' +
        block.id +
        "'," +
        i +
        ",'answer',this.value)\">" +
        item.answer +
        "</textarea></div>" +
        "</div>";
    });
    contentHtml +=
      '</div><button class="rp-btn" style="margin-top:8px;font-size:11px" onclick="FB.panels.addFaqItem(\'' +
      block.id +
      "')\">+ Add Question</button></div>";
  }
  /* \u2500\u2500 Style section \u2500\u2500 */
  var bgAlpha = p._bgAlpha !== undefined ? p._bgAlpha : 1;
  var bgGradientEnabled = !!p._bgGradient;
  var gradType = p._gradientType || "linear";
  var gradAngle = p._gradientAngle !== undefined ? p._gradientAngle : 135;
  var gradC1 = p._gradientColor1 || "#1a1a2e";
  var gradC2 = p._gradientColor2 || "#cdfe00";
  var gradP1 = p._gradientPos1 !== undefined ? p._gradientPos1 : 0;
  var gradP2 = p._gradientPos2 !== undefined ? p._gradientPos2 : 100;
  var styleHtml = "";
  styleHtml +=
    '<div class="rp-row"><label>Background</label><div class="color-row">' +
    '<input type="color" value="' +
    (p.bg || "#111111") +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','bg',this.value)\">" +
    '<input type="text" value="' +
    (p.bg || "#111111") +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','bg',this.value)\"></div></div>" +
    '<div class="rp-row"><label>BG Alpha: <span>' +
    bgAlpha +
    "</span></label>" +
    '<input type="range" min="0" max="1" step="0.05" value="' +
    bgAlpha +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value;FB.panels.updateWrapperProp('" +
    block.id +
    "','_bgAlpha',+this.value)\"></div>";
  if (p.textColor !== undefined) {
    styleHtml +=
      '<div class="rp-row"><label>Text Colour</label><div class="color-row">' +
      '<input type="color" value="' +
      p.textColor +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','textColor',this.value)\">" +
      '<input type="text" value="' +
      p.textColor +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','textColor',this.value)\"></div></div>";
  }
  if (p.accentColor !== undefined) {
    styleHtml +=
      '<div class="rp-row"><label>Accent Colour</label><div class="color-row">' +
      '<input type="color" value="' +
      p.accentColor +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','accentColor',this.value)\">" +
      '<input type="text" value="' +
      p.accentColor +
      '" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','accentColor',this.value)\"></div></div>";
  }
  // Gradient builder
  styleHtml +=
    '<div class="rp-row"><label><input type="checkbox"' +
    (bgGradientEnabled ? " checked" : "") +
    " onchange=\"FB.panels.toggleGradient('" +
    block.id +
    "',this.checked)\"> Use Gradient Background</label></div>";
  if (bgGradientEnabled) {
    styleHtml +=
      '<div style="margin:0 14px 8px;padding:10px;background:var(--surface-3);border-radius:6px;border:1px solid var(--border)">' +
      '<div class="rp-row" style="padding:0 0 6px"><label>Type</label>' +
      "<select onchange=\"FB.panels.updateGradient('" +
      block.id +
      "','_gradientType',this.value)\">" +
      '<option value="linear"' +
      (gradType === "linear" ? " selected" : "") +
      ">Linear</option>" +
      '<option value="radial"' +
      (gradType === "radial" ? " selected" : "") +
      ">Radial</option></select></div>" +
      (gradType === "linear"
        ? '<div class="rp-row" style="padding:0 0 6px"><label>Angle: <span>' +
          gradAngle +
          "\u00B0</span></label>" +
          '<input type="range" min="0" max="360" step="5" value="' +
          gradAngle +
          "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'\u00B0';FB.panels.updateGradient('" +
          block.id +
          "','_gradientAngle',+this.value)\"></div>"
        : "") +
      '<div class="rp-row" style="padding:0 0 6px"><label>Stop 1</label>' +
      '<div style="display:flex;gap:4px;align-items:center">' +
      '<input type="color" value="' +
      gradC1 +
      '" onchange="FB.panels.updateGradient(\'' +
      block.id +
      "','_gradientColor1',this.value)\" style=\"width:32px;height:26px;padding:2px;border:1px solid var(--border);border-radius:4px;background:var(--surface-1)\">" +
      '<input type="range" min="0" max="100" step="1" value="' +
      gradP1 +
      '" oninput="FB.panels.updateGradient(\'' +
      block.id +
      "','_gradientPos1',+this.value)\" style=\"flex:1\"></div></div>" +
      '<div class="rp-row" style="padding:0"><label>Stop 2</label>' +
      '<div style="display:flex;gap:4px;align-items:center">' +
      '<input type="color" value="' +
      gradC2 +
      '" onchange="FB.panels.updateGradient(\'' +
      block.id +
      "','_gradientColor2',this.value)\" style=\"width:32px;height:26px;padding:2px;border:1px solid var(--border);border-radius:4px;background:var(--surface-1)\">" +
      '<input type="range" min="0" max="100" step="1" value="' +
      gradP2 +
      '" oninput="FB.panels.updateGradient(\'' +
      block.id +
      "','_gradientPos2',+this.value)\" style=\"flex:1\"></div></div>" +
      "</div>";
  }

  /* Typography section */
  var isHero =
    block.type === "hero" ||
    block.type === "orbsHero" ||
    block.type === "splitHero" ||
    block.type === "videoHero";
  var typographyHtml =
    '<div class="rp-row"><label>Font Family</label>' +
    "<select onchange=\"FB.panels.updateWrapperProp('" +
    block.id +
    "','_fontFamily',this.value)\">" +
    FB.panels.GOOGLE_FONTS.map(function (f) {
      return (
        '<option value="' +
        f +
        '"' +
        (p._fontFamily === f ? " selected" : "") +
        ">" +
        (f || "\u2014 default \u2014") +
        "</option>"
      );
    }).join("") +
    "</select></div>" +
    '<div class="rp-row"><label>Font Size: <span>' +
    (p._fontSize ? (p._fontSize || "") + (p._fontSizeUnit || "px") : "auto") +
    "</span></label>" +
    '<input type="range" min="8" max="200" step="1" value="' +
    (p._fontSize || 48) +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'" +
    (p._fontSizeUnit || "px") +
    "';FB.panels.updateWrapperProp('" +
    block.id +
    "','_fontSize',+this.value)\">" +
    '<div style="display:flex;gap:4px;margin-top:6px">' +
    '<input type="number" min="1" max="300" value="' +
    (p._fontSize || "") +
    '" placeholder="auto" style="flex:1" onchange="FB.panels.updateWrapperProp(\'' +
    block.id +
    "','_fontSize',+this.value||null)\">" +
    '<select style="width:56px" onchange="FB.panels.updateWrapperProp(\'' +
    block.id +
    "','_fontSizeUnit',this.value)\">" +
    ["px", "rem", "em", "vw"]
      .map(function (u) {
        return (
          "<option" +
          ((p._fontSizeUnit || "px") === u ? " selected" : "") +
          ">" +
          u +
          "</option>"
        );
      })
      .join("") +
    "</select></div></div>" +
    (isHero
      ? '<div class="rp-row"><label>Headline Size: <span>' +
        (p._heroHeadlineSize || 64) +
        "px</span></label>" +
        '<input type="range" min="24" max="150" step="1" value="' +
        (p._heroHeadlineSize || 64) +
        "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'px';FB.panels.updateWrapperProp('" +
        block.id +
        "','_heroHeadlineSize',+this.value)\"></div>" +
        '<div class="rp-row"><label>Subtext Size: <span>' +
        (p._heroSubtextSize || 18) +
        "px</span></label>" +
        '<input type="range" min="10" max="48" step="1" value="' +
        (p._heroSubtextSize || 18) +
        "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'px';FB.panels.updateWrapperProp('" +
        block.id +
        "','_heroSubtextSize',+this.value)\"></div>" +
        '<div class="rp-row"><label>Headline Colour</label>' +
        '<input type="color" value="' +
        (p._textColor || "#f7f6f2") +
        '" onchange="FB.panels.updateWrapperProp(\'' +
        block.id +
        "','_textColor',this.value)\"></div>" +
        '<div class="rp-row"><label>Subtext Colour</label>' +
        '<input type="color" value="' +
        (p._subtextColor || "rgba(255,255,255,0.5)") +
        '" onchange="FB.panels.updateWrapperProp(\'' +
        block.id +
        "','_subtextColor',this.value)\"></div>"
      : "") +
    '<div class="rp-row"><label>Font Weight: <span>' +
    (p._fontWeight || 400) +
    "</span></label>" +
    '<input type="range" min="100" max="900" step="100" value="' +
    (p._fontWeight || 400) +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value;FB.panels.updateWrapperProp('" +
    block.id +
    "','_fontWeight',+this.value)\"></div>" +
    '<div class="rp-row"><label>Text Align</label>' +
    '<div style="display:flex;gap:3px">' +
    ["left", "center", "right", "justify"]
      .map(function (a) {
        var labels = {
          left: "Left",
          center: "Center",
          right: "Right",
          justify: "Justify",
        };
        return (
          '<button class="rp-btn' +
          (p._textAlign === a ? " accent" : "") +
          '" style="flex:1;padding:5px 2px;text-align:center;font-size:10px" onclick="FB.panels.updateWrapperProp(\'' +
          block.id +
          "','_textAlign','" +
          a +
          '\')" title="' +
          a +
          '">' +
          labels[a] +
          "</button>"
        );
      })
      .join("") +
    "</div></div>";

  /* \u2500\u2500 Spacing section \u2500\u2500 */
  var spacingHtml = "";
  if (p.paddingV !== undefined) {
    spacingHtml +=
      '<div class="rp-row"><label>Vertical Padding: <span>' +
      p.paddingV +
      "px</span></label>" +
      '<input type="range" min="0" max="200" step="8" value="' +
      p.paddingV +
      "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'px';FB.panels.updateProp('" +
      block.id +
      "','paddingV',+this.value)\"></div>";
  }
  if (p.paddingH !== undefined) {
    spacingHtml +=
      '<div class="rp-row"><label>Horizontal Padding: <span>' +
      p.paddingH +
      "px</span></label>" +
      '<input type="range" min="0" max="160" step="8" value="' +
      p.paddingH +
      "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'px';FB.panels.updateProp('" +
      block.id +
      "','paddingH',+this.value)\"></div>";
  }
  var lh = p._lineHeight !== undefined ? p._lineHeight : 1.5;
  var ls = p._letterSpacing !== undefined ? p._letterSpacing : 0;
  var ws = p._wordSpacing !== undefined ? p._wordSpacing : 0;
  spacingHtml +=
    '<div class="rp-row"><label>Line Height: <span>' +
    lh +
    "</span></label>" +
    '<input type="range" min="0.8" max="4" step="0.1" value="' +
    lh +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value;FB.panels.updateWrapperProp('" +
    block.id +
    "','_lineHeight',+this.value)\"></div>" +
    '<div class="rp-row"><label>Letter Spacing: <span>' +
    ls +
    "px</span></label>" +
    '<input type="range" min="-3" max="20" step="0.5" value="' +
    ls +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'px';FB.panels.updateWrapperProp('" +
    block.id +
    "','_letterSpacing',+this.value)\"></div>" +
    '<div class="rp-row"><label>Word Spacing: <span>' +
    ws +
    "px</span></label>" +
    '<input type="range" min="0" max="40" step="1" value="' +
    ws +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'px';FB.panels.updateWrapperProp('" +
    block.id +
    "','_wordSpacing',+this.value)\"></div>";
  // Margin 4-edge
  var mt = p._marginTop || 0;
  var mr = p._marginRight || 0;
  var mb = p._marginBottom || 0;
  var ml = p._marginLeft || 0;
  spacingHtml +=
    '<div class="rp-row"><label>Margin</label>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">' +
    '<div><label style="font-size:10px;color:var(--text-muted)">Top</label>' +
    '<input type="number" value="' +
    mt +
    '" step="1" onchange="FB.panels.updateWrapperProp(\'' +
    block.id +
    "','_marginTop',+this.value)\"></div>" +
    '<div><label style="font-size:10px;color:var(--text-muted)">Right</label>' +
    '<input type="number" value="' +
    mr +
    '" step="1" onchange="FB.panels.updateWrapperProp(\'' +
    block.id +
    "','_marginRight',+this.value)\"></div>" +
    '<div><label style="font-size:10px;color:var(--text-muted)">Bottom</label>' +
    '<input type="number" value="' +
    mb +
    '" step="1" onchange="FB.panels.updateWrapperProp(\'' +
    block.id +
    "','_marginBottom',+this.value)\"></div>" +
    '<div><label style="font-size:10px;color:var(--text-muted)">Left</label>' +
    '<input type="number" value="' +
    ml +
    '" step="1" onchange="FB.panels.updateWrapperProp(\'' +
    block.id +
    "','_marginLeft',+this.value)\"></div>" +
    "</div></div>";
  // Dimensions
  var dimUnits = ["px", "%", "vw", "vh", "rem"];
  function dimSelect(key, unitKey, current, currentUnit) {
    return (
      '<div style="display:flex;gap:4px">' +
      '<input type="number" min="0" max="9999" value="' +
      (current || "") +
      '" placeholder="auto" style="flex:1" onchange="FB.panels.updateWrapperProp(\'' +
      block.id +
      "','" +
      key +
      "',+this.value||null)\">" +
      '<select style="width:52px" onchange="FB.panels.updateWrapperProp(\'' +
      block.id +
      "','" +
      unitKey +
      "',this.value)\">" +
      dimUnits
        .map(function (u) {
          return (
            "<option" +
            ((currentUnit || "px") === u ? " selected" : "") +
            ">" +
            u +
            "</option>"
          );
        })
        .join("") +
      "</select></div>"
    );
  }
  spacingHtml +=
    '<div class="rp-row"><label>Width</label>' +
    dimSelect("_width", "_widthUnit", p._width, p._widthUnit) +
    "</div>" +
    '<div class="rp-row"><label>Min / Max Width</label>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">' +
    '<div><label style="font-size:10px;color:var(--text-muted)">Min</label>' +
    dimSelect("_minWidth", "_minWidthUnit", p._minWidth, p._minWidthUnit) +
    "</div>" +
    '<div><label style="font-size:10px;color:var(--text-muted)">Max</label>' +
    dimSelect("_maxWidth", "_maxWidthUnit", p._maxWidth, p._maxWidthUnit) +
    "</div></div></div>" +
    '<div class="rp-row"><label>Min / Max Height</label>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px">' +
    '<div><label style="font-size:10px;color:var(--text-muted)">Min</label>' +
    dimSelect("_minHeight", "_minHeightUnit", p._minHeight, p._minHeightUnit) +
    "</div>" +
    '<div><label style="font-size:10px;color:var(--text-muted)">Max</label>' +
    dimSelect("_maxHeight", "_maxHeightUnit", p._maxHeight, p._maxHeightUnit) +
    "</div></div></div>";
  // Aspect ratio
  spacingHtml +=
    '<div class="rp-row"><label>Aspect Ratio</label>' +
    "<select onchange=\"FB.panels.updateWrapperProp('" +
    block.id +
    "','_aspectRatio',this.value)\">" +
    ["", "auto", "1/1", "4/3", "16/9", "3/2", "2/1", "9/16"]
      .map(function (r) {
        return (
          '<option value="' +
          r +
          '"' +
          ((p._aspectRatio || "") === r ? " selected" : "") +
          ">" +
          (r || "\u2014 none \u2014") +
          "</option>"
        );
      })
      .join("") +
    "</select></div>";
  // Line clamp
  spacingHtml +=
    '<div class="rp-row"><label>Text Truncation (lines): <span>' +
    (p._lineClamp || 0) +
    "</span></label>" +
    '<input type="range" min="0" max="10" step="1" value="' +
    (p._lineClamp || 0) +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value;FB.panels.updateWrapperProp('" +
    block.id +
    "','_lineClamp',+this.value)\"></div>";

  /* \u2500\u2500 Transform & Visibility section \u2500\u2500 */
  var rot = p._rotate || 0;
  var scl = p._scale !== undefined ? p._scale : 1;
  var tx = p._translateX || 0;
  var ty = p._translateY || 0;
  var skx = p._skewX || 0;
  var sky = p._skewY || 0;
  var opa = p._opacity !== undefined ? p._opacity : 1;
  var zi = p._zIndex || 0;
  var tOrigin = p._transformOrigin || "center center";
  var originOptions = [
    "top left",
    "top center",
    "top right",
    "center left",
    "center center",
    "center right",
    "bottom left",
    "bottom center",
    "bottom right",
  ];
  var originGrid =
    '<div class="rp-row"><label>Transform Origin</label>' +
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin-top:4px">' +
    originOptions
      .map(function (o) {
        return (
          '<button class="rp-btn' +
          (tOrigin === o ? " accent" : "") +
          '" style="padding:5px 2px;font-size:9px;text-align:center" onclick="FB.panels.updateWrapperProp(\'' +
          block.id +
          "','_transformOrigin','" +
          o +
          "')\">\u25CF</button>"
        );
      })
      .join("") +
    "</div>" +
    '<div style="font-size:10px;color:var(--text-muted);margin-top:3px;padding:0 2px">' +
    tOrigin +
    "</div></div>";
  var advHtml =
    '<div class="rp-row"><label>Opacity: <span>' +
    opa +
    "</span></label>" +
    '<input type="range" min="0" max="1" step="0.05" value="' +
    opa +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value;FB.panels.updateWrapperProp('" +
    block.id +
    "','_opacity',+this.value)\"></div>" +
    '<div class="rp-row"><label>Layer Order (Z-Index): <span>' +
    zi +
    "</span></label>" +
    '<input type="range" min="-10" max="100" step="1" value="' +
    zi +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value;FB.panels.updateWrapperProp('" +
    block.id +
    "','_zIndex',+this.value)\"></div>" +
    '<div class="rp-row"><label>Rotate: <span>' +
    rot +
    "\u00B0</span></label>" +
    '<input type="range" min="-180" max="180" step="1" value="' +
    rot +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'\u00B0';FB.panels.updateWrapperProp('" +
    block.id +
    "','_rotate',+this.value)\"></div>" +
    '<div class="rp-row"><label>Scale: <span>' +
    scl +
    "</span></label>" +
    '<input type="range" min="0.1" max="3" step="0.05" value="' +
    scl +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value;FB.panels.updateWrapperProp('" +
    block.id +
    "','_scale',+this.value)\"></div>" +
    '<div class="rp-row"><label>Skew X: <span>' +
    skx +
    "\u00B0</span></label>" +
    '<input type="range" min="-45" max="45" step="1" value="' +
    skx +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'\u00B0';FB.panels.updateWrapperProp('" +
    block.id +
    "','_skewX',+this.value)\"></div>" +
    '<div class="rp-row"><label>Skew Y: <span>' +
    sky +
    "\u00B0</span></label>" +
    '<input type="range" min="-45" max="45" step="1" value="' +
    sky +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'\u00B0';FB.panels.updateWrapperProp('" +
    block.id +
    "','_skewY',+this.value)\"></div>" +
    '<div class="rp-row"><label>Move X: <span>' +
    tx +
    "px</span></label>" +
    '<input type="range" min="-400" max="400" step="4" value="' +
    tx +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'px';FB.panels.updateWrapperProp('" +
    block.id +
    "','_translateX',+this.value)\"></div>" +
    '<div class="rp-row"><label>Move Y: <span>' +
    ty +
    "px</span></label>" +
    '<input type="range" min="-400" max="400" step="4" value="' +
    ty +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'px';FB.panels.updateWrapperProp('" +
    block.id +
    "','_translateY',+this.value)\"></div>" +
    originGrid;
  if (block.type === "hero") {
    advHtml +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.showBlob ? "checked" : "") +
      " onchange=\"FB.panels.updateProp('" +
      block.id +
      "','showBlob',this.checked)\"> Show background blob</label></div>";
  }
  if (block.type === "marquee") {
    advHtml +=
      '<div class="rp-row"><label>Scroll Speed (s)</label>' +
      '<input type="number" value="' +
      (p.speed || 16) +
      '" min="4" max="60" onchange="FB.panels.updateProp(\'' +
      block.id +
      "','speed',+this.value)\"></div>";
  }

  /* \u2500\u2500 Effects section \u2500\u2500 */
  var bw = p._borderWidth || 0;
  var bdBlur = p._backdropBlur || 0;
  var shadowEnabled = p._shadowX !== undefined;
  var sx = p._shadowX || 0;
  var sy2 = p._shadowY || 0;
  var sblur = p._shadowBlur !== undefined ? p._shadowBlur : 10;
  var sspread = p._shadowSpread !== undefined ? p._shadowSpread : 0;
  var scolor = p._shadowColor || "#00000066";
  var sinset = p._shadowInset || false;
  var effectsHtml =
    // Box Shadow
    '<div class="rp-row"><label><input type="checkbox"' +
    (shadowEnabled ? " checked" : "") +
    " onchange=\"FB.panels.toggleShadow('" +
    block.id +
    "',this.checked)\"> Box Shadow</label></div>" +
    (shadowEnabled
      ? '<div style="margin:0 14px 8px;padding:10px;background:var(--surface-3);border-radius:6px;border:1px solid var(--border)">' +
        '<div class="rp-row" style="padding:0 0 4px"><label>X: <span>' +
        sx +
        "px</span></label>" +
        '<input type="range" min="-50" max="50" step="1" value="' +
        sx +
        "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'px';FB.panels.updateWrapperProp('" +
        block.id +
        "','_shadowX',+this.value)\"></div>" +
        '<div class="rp-row" style="padding:0 0 4px"><label>Y: <span>' +
        sy2 +
        "px</span></label>" +
        '<input type="range" min="-50" max="50" step="1" value="' +
        sy2 +
        "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'px';FB.panels.updateWrapperProp('" +
        block.id +
        "','_shadowY',+this.value)\"></div>" +
        '<div class="rp-row" style="padding:0 0 4px"><label>Blur: <span>' +
        sblur +
        "px</span></label>" +
        '<input type="range" min="0" max="80" step="1" value="' +
        sblur +
        "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'px';FB.panels.updateWrapperProp('" +
        block.id +
        "','_shadowBlur',+this.value)\"></div>" +
        '<div class="rp-row" style="padding:0 0 4px"><label>Spread: <span>' +
        sspread +
        "px</span></label>" +
        '<input type="range" min="-30" max="30" step="1" value="' +
        sspread +
        "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'px';FB.panels.updateWrapperProp('" +
        block.id +
        "','_shadowSpread',+this.value)\"></div>" +
        '<div class="rp-row" style="padding:0 0 4px"><label>Colour</label>' +
        '<div class="color-row">' +
        '<input type="color" value="' +
        (scolor.length === 7 ? scolor : "#000000") +
        '" onchange="FB.panels.updateWrapperProp(\'' +
        block.id +
        "','_shadowColor',this.value)\">" +
        '<input type="text" value="' +
        scolor +
        '" onchange="FB.panels.updateWrapperProp(\'' +
        block.id +
        "','_shadowColor',this.value)\"></div></div>" +
        '<div class="rp-row" style="padding:0"><label><input type="checkbox"' +
        (sinset ? " checked" : "") +
        " onchange=\"FB.panels.updateWrapperProp('" +
        block.id +
        "','_shadowInset',this.checked)\"> Inset</label></div>" +
        "</div>"
      : "") +
    // Backdrop / Glassmorphism
    '<div class="rp-row"><label>Backdrop Blur: <span>' +
    bdBlur +
    "px</span></label>" +
    '<input type="range" min="0" max="40" step="1" value="' +
    bdBlur +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'px';FB.panels.updateWrapperProp('" +
    block.id +
    "','_backdropBlur',+this.value)\"></div>" +
    '<div class="rp-row"><label>Mix Blend Mode</label>' +
    "<select onchange=\"FB.panels.updateWrapperProp('" +
    block.id +
    "','_mixBlendMode',this.value)\">" +
    [
      "normal",
      "multiply",
      "screen",
      "overlay",
      "darken",
      "lighten",
      "color-dodge",
      "color-burn",
      "hard-light",
      "soft-light",
      "difference",
      "exclusion",
      "hue",
      "saturation",
      "color",
      "luminosity",
    ]
      .map(function (m) {
        return (
          '<option value="' +
          m +
          '"' +
          ((p._mixBlendMode || "normal") === m ? " selected" : "") +
          ">" +
          m +
          "</option>"
        );
      })
      .join("") +
    "</select></div>" +
    // Border
    '<div class="rp-row"><label>Border Width: <span>' +
    bw +
    "px</span></label>" +
    '<input type="range" min="0" max="20" step="1" value="' +
    bw +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'px';FB.panels.updateWrapperProp('" +
    block.id +
    "','_borderWidth',+this.value)\"></div>" +
    (bw > 0
      ? '<div class="rp-row"><label>Border Style</label>' +
        "<select onchange=\"FB.panels.updateWrapperProp('" +
        block.id +
        "','_borderStyle',this.value)\">" +
        ["solid", "dashed", "dotted", "double", "groove", "ridge"]
          .map(function (s) {
            return (
              "<option" +
              ((p._borderStyle || "solid") === s ? " selected" : "") +
              ">" +
              s +
              "</option>"
            );
          })
          .join("") +
        "</select></div>" +
        '<div class="rp-row"><label>Border Colour</label>' +
        '<div class="color-row">' +
        '<input type="color" value="' +
        (p._borderColor || "#333333") +
        '" onchange="FB.panels.updateWrapperProp(\'' +
        block.id +
        "','_borderColor',this.value)\">" +
        '<input type="text" value="' +
        (p._borderColor || "#333333") +
        '" onchange="FB.panels.updateWrapperProp(\'' +
        block.id +
        "','_borderColor',this.value)\"></div></div>"
      : "") +
    '<div class="rp-row"><label>Border Radius: <span>' +
    (p._borderRadius || 0) +
    "px</span></label>" +
    '<input type="range" min="0" max="80" step="1" value="' +
    (p._borderRadius || 0) +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'px';FB.panels.updateWrapperProp('" +
    block.id +
    "','_borderRadius',+this.value)\"></div>" +
    // Transition
    '<div class="rp-row"><label>Transition</label>' +
    "<select onchange=\"FB.panels.updateWrapperProp('" +
    block.id +
    "','_transition',this.value)\">" +
    [
      { v: "", l: "\u2014 none \u2014" },
      { v: "all 0.2s ease", l: "Fast (0.2s ease)" },
      { v: "all 0.35s ease", l: "Normal (0.35s ease)" },
      { v: "all 0.6s ease", l: "Slow (0.6s ease)" },
      { v: "all 0.3s cubic-bezier(0.16,1,0.3,1)", l: "Spring" },
      { v: "all 0.4s cubic-bezier(0.4,0,0.2,1)", l: "Material" },
      { v: "all 0.5s cubic-bezier(0.68,-0.55,0.27,1.55)", l: "Bounce" },
    ]
      .map(function (o) {
        return (
          '<option value="' +
          o.v +
          '"' +
          ((p._transition || "") === o.v ? " selected" : "") +
          ">" +
          o.l +
          "</option>"
        );
      })
      .join("") +
    "</select></div>";

  /* \u2500\u2500 Hover States section \u2500\u2500 */
  var hoverHtml =
    '<div class="rp-row" style="color:var(--text-muted);font-size:10px;padding-bottom:2px">Styles applied on mouse hover</div>' +
    '<div class="rp-row"><label>Hover Background</label>' +
    '<div class="color-row">' +
    '<input type="color" value="' +
    (p._hoverBg || "#000000") +
    '" onchange="FB.panels.updateWrapperProp(\'' +
    block.id +
    "','_hoverBg',this.value)\">" +
    '<input type="text" value="' +
    (p._hoverBg || "") +
    '" placeholder="none" onchange="FB.panels.updateWrapperProp(\'' +
    block.id +
    "','_hoverBg',this.value)\"></div></div>" +
    '<div class="rp-row"><label>Hover Opacity: <span>' +
    (p._hoverOpacity !== undefined ? p._hoverOpacity : 1) +
    "</span></label>" +
    '<input type="range" min="0" max="1" step="0.05" value="' +
    (p._hoverOpacity !== undefined ? p._hoverOpacity : 1) +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value;FB.panels.updateWrapperProp('" +
    block.id +
    "','_hoverOpacity',+this.value)\"></div>" +
    '<div class="rp-row"><label>Hover Scale: <span>' +
    (p._hoverScale !== undefined ? p._hoverScale : 1) +
    "</span></label>" +
    '<input type="range" min="0.5" max="2" step="0.02" value="' +
    (p._hoverScale !== undefined ? p._hoverScale : 1) +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value;FB.panels.updateWrapperProp('" +
    block.id +
    "','_hoverScale',+this.value)\"></div>" +
    '<div class="rp-row"><label>Hover Transition</label>' +
    "<select onchange=\"FB.panels.updateWrapperProp('" +
    block.id +
    "','_hoverTransition',this.value)\">" +
    [
      { v: "", l: "\u2014 none \u2014" },
      { v: "all 0.2s ease", l: "Fast (0.2s ease)" },
      { v: "all 0.35s ease", l: "Normal (0.35s ease)" },
      { v: "all 0.3s cubic-bezier(0.16,1,0.3,1)", l: "Spring" },
    ]
      .map(function (o) {
        return (
          '<option value="' +
          o.v +
          '"' +
          ((p._hoverTransition || "") === o.v ? " selected" : "") +
          ">" +
          o.l +
          "</option>"
        );
      })
      .join("") +
    "</select></div>" +
    '<div class="rp-row"><button class="rp-btn" style="font-size:10px" onclick="FB.panels.clearHoverStyles(\'' +
    block.id +
    "')\">\u00D7 Clear hover styles</button></div>";

  /* \u2500\u2500 Animation section \u2500\u2500 */
  var animTypes = [
    "none",
    "fadeIn",
    "slideUp",
    "slideDown",
    "slideLeft",
    "slideRight",
    "zoomIn",
    "bounce",
    "pulse",
    "shake",
    "flip",
    "scrollReveal",
    "floatOrb",
    "neonGlow",
    "gradientText",
    "hoverUnderline",
    "carouselLoop",
  ];
  var curAnim = p._anim || "none";
  var animDur = p._animDuration !== undefined ? p._animDuration : 0.6;
  var animDel = p._animDelay !== undefined ? p._animDelay : 0;
  var animSelect =
    '<div class="rp-row"><label>Animation</label><select onchange="FB.panels.updateWrapperProp(\'' +
    block.id +
    "','_anim',this.value)\">" +
    animTypes
      .map(function (a) {
        return (
          '<option value="' +
          a +
          '"' +
          (a === curAnim ? " selected" : "") +
          ">" +
          a +
          "</option>"
        );
      })
      .join("") +
    "</select></div>";
  var animHtml =
    animSelect +
    '<div class="rp-row"><label>Duration: <span>' +
    animDur +
    "s</span></label>" +
    '<input type="range" min="0.1" max="4" step="0.1" value="' +
    animDur +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'s';FB.panels.updateWrapperProp('" +
    block.id +
    "','_animDuration',+this.value)\"></div>" +
    '<div class="rp-row"><label>Delay: <span>' +
    animDel +
    "s</span></label>" +
    '<input type="range" min="0" max="4" step="0.1" value="' +
    animDel +
    "\" oninput=\"this.previousElementSibling.querySelector('span').textContent=this.value+'s';FB.panels.updateWrapperProp('" +
    block.id +
    "','_animDelay',+this.value)\"></div>" +
    '<div class="rp-row"><button class="rp-btn" style="font-size:10px" onclick="(function(){var w=document.querySelector(\'.canvas-block[data-id=\\\"' +
    block.id +
    "\\\"]');if(!w)return;w.classList.forEach(function(c){if(c.startsWith('fb-anim-'))w.classList.remove(c)});void w.offsetWidth;if(w.classList.contains('fb-anim-'+(w.dataset.anim||'')))return;var a='" +
    curAnim +
    "';if(a&&a!=='none'){w.classList.add('fb-anim-'+a)}})()\">\u25B6 Preview animation</button></div>";

  /* Actions */
  var actionsHtml =
    '<button class="rp-btn" onclick="FB.canvas.duplicateBlock(\'' +
    block.id +
    "')\">\u29C9 Duplicate</button>" +
    '<button class="rp-btn" onclick="FB.canvas.renameBlock(\'' +
    block.id +
    "')\">\u270F Rename</button>" +
    '<button class="rp-btn" style="color:#e88;border-color:#e55" onclick="FB.canvas.deleteBlock(\'' +
    block.id +
    "')\">\u2715 Delete</button>";

  /* Quick Style bar */
  var quickBar =
    '<div class="quick-style-bar">' +
    '<div class="qs-swatch" title="Background">' +
    '<input type="color" value="' +
    (p.bg || "#111111") +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','bg',this.value)\" style=\"width:24px;height:24px;border:none;border-radius:4px;cursor:pointer;padding:0;background:none\">" +
    "</div>" +
    '<div class="qs-swatch" title="Text Colour">' +
    '<input type="color" value="' +
    (p.textColor || "#111111") +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','textColor',this.value)\" style=\"width:24px;height:24px;border:none;border-radius:4px;cursor:pointer;padding:0;background:none\">" +
    "</div>" +
    '<div class="qs-swatch" title="Accent Colour">' +
    '<input type="color" value="' +
    (p.accentColor || "#CDFE00") +
    '" onchange="FB.panels.updateProp(\'' +
    block.id +
    "','accentColor',this.value)\" style=\"width:24px;height:24px;border:none;border-radius:4px;cursor:pointer;padding:0;background:none\">" +
    "</div>" +
    "</div>";

  var html =
    quickBar +
    FB.panels.renderSection(
      "Content",
      contentHtml ||
        '<div class="rp-row" style="color:var(--text-muted);font-size:11px">Inline edit directly on canvas</div>',
      acc.content,
    ) +
    FB.panels.renderSection("Style", styleHtml, acc.style) +
    FB.panels.renderSection("Typography", typographyHtml, acc.typography) +
    FB.panels.renderSection("Spacing & Dimensions", spacingHtml, acc.spacing) +
    FB.panels.renderSection("Transform & Visibility", advHtml, acc.advanced) +
    FB.panels.renderSection("Effects & Border", effectsHtml, acc.effects) +
    FB.panels.renderSection("Hover States", hoverHtml, acc.hover) +
    FB.panels.renderSection("Animation", animHtml, acc.animation) +
    '<div class="rp-section">' +
    actionsHtml +
    "</div>";

  rp.innerHTML = html;
};

FB.panels.updateProp = function (id, key, val) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block) return;
  block.props[key] = val;
  FB.canvas.refreshBlock(id);
};

// FAQ block helpers
FB.panels.addFaqItem = function (id) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block) return;
  FB.state.saveHistory();
  block.props.items = block.props.items || [];
  block.props.items.push({
    question: "New question?",
    answer: "Answer goes here.",
  });
  FB.canvas.refreshBlock(id);
  FB.panels.renderRightPanel();
};

FB.panels.removeFaqItem = function (id, idx) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block || !block.props.items) return;
  FB.state.saveHistory();
  block.props.items.splice(idx, 1);
  FB.canvas.refreshBlock(id);
  FB.panels.renderRightPanel();
};

FB.panels.updateFaqField = function (id, idx, field, val) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block || !block.props.items || !block.props.items[idx]) return;
  block.props.items[idx][field] = val;
  FB.canvas.refreshBlock(id);
};

// Updates wrapper-level props (opacity, transform, animation etc) without full re-render
FB.panels.updateWrapperProp = function (id, key, val) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block) return;
  block.props[key] = val;
  FB.canvas._applyWrapperStyles(block, null);
};

FB.panels.toggleGradient = function (id, enabled) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block) return;
  if (!enabled) {
    block.props._bgGradient = null;
  } else {
    FB.panels._rebuildGradient(block);
  }
  FB.canvas._applyWrapperStyles(block, null);
  FB.panels.renderRightPanel();
};

FB.panels._rebuildGradient = function (block) {
  var p = block.props;
  var type = p._gradientType || "linear";
  var angle = p._gradientAngle !== undefined ? p._gradientAngle : 135;
  var c1 = p._gradientColor1 || "#1a1a2e";
  var c2 = p._gradientColor2 || "#cdfe00";
  var pos1 = p._gradientPos1 !== undefined ? p._gradientPos1 : 0;
  var pos2 = p._gradientPos2 !== undefined ? p._gradientPos2 : 100;
  if (type === "radial") {
    p._bgGradient =
      "radial-gradient(circle, " +
      c1 +
      " " +
      pos1 +
      "%, " +
      c2 +
      " " +
      pos2 +
      "%)";
  } else {
    p._bgGradient =
      "linear-gradient(" +
      angle +
      "deg, " +
      c1 +
      " " +
      pos1 +
      "%, " +
      c2 +
      " " +
      pos2 +
      "%)";
  }
};

FB.panels.updateGradient = function (id, key, val) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block) return;
  block.props[key] = val;
  FB.panels._rebuildGradient(block);
  FB.canvas._applyWrapperStyles(block, null);
};

FB.panels.toggleShadow = function (id, enabled) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block) return;
  if (enabled) {
    block.props._shadowX =
      block.props._shadowX !== undefined ? block.props._shadowX : 0;
    block.props._shadowY =
      block.props._shadowY !== undefined ? block.props._shadowY : 4;
    block.props._shadowBlur =
      block.props._shadowBlur !== undefined ? block.props._shadowBlur : 10;
    block.props._shadowSpread =
      block.props._shadowSpread !== undefined ? block.props._shadowSpread : 0;
    block.props._shadowColor = block.props._shadowColor || "#00000066";
  } else {
    delete block.props._shadowX;
    delete block.props._shadowY;
    delete block.props._shadowBlur;
    delete block.props._shadowSpread;
    delete block.props._shadowColor;
    delete block.props._shadowInset;
  }
  FB.canvas._applyWrapperStyles(block, null);
  FB.panels.renderRightPanel();
};

FB.panels.clearHoverStyles = function (id) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block) return;
  delete block.props._hoverBg;
  delete block.props._hoverOpacity;
  delete block.props._hoverScale;
  delete block.props._hoverTransition;
  FB.canvas._applyWrapperStyles(block, null);
  FB.panels.renderRightPanel();
};

FB.panels.updatePropJSON = function (id, key, val) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block) return;
  block.props[key] = val;
  FB.state.saveHistory();
  FB.canvas.render();
  FB.canvas.selectBlock(id);
};

FB.panels.updateServicesFromText = function (id, text) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block) return;
  block.props.services = text
    .split("\n")
    .filter(function (s) {
      return s.trim();
    })
    .map(function (name, i) {
      return { num: String(i + 1).padStart(2, "0"), name: name.trim() };
    });
  FB.state.saveHistory();
  FB.canvas.render();
  FB.canvas.selectBlock(id);
};

FB.panels.updateStatField = function (id, idx, field, val) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block) return;
  block.props.stats[idx][field] = val;
  FB.canvas.refreshBlock(id);
};

FB.panels.updateStepField = function (id, idx, field, val) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block) return;
  block.props.steps[idx][field] = val;
  FB.canvas.refreshBlock(id);
};

FB.panels.updateUndoRedo = function () {
  var undoBtn = document.querySelector('.tb-btn[onclick*="undo"]');
  var redoBtn = document.querySelector('.tb-btn[onclick*="redo"]');
  if (undoBtn) {
    undoBtn.textContent = "\u21A9 Undo (" + FB.state.history.length + ")";
    undoBtn.disabled = FB.state.history.length === 0;
  }
  if (redoBtn) {
    redoBtn.textContent = "\u21AA Redo (" + FB.state.future.length + ")";
    redoBtn.disabled = FB.state.future.length === 0;
  }
};

FB.panels.updatePanelsCollapsed = function () {
  var lp = document.getElementById("left-panel");
  var rp = document.getElementById("right-panel");
  var both =
    lp &&
    rp &&
    lp.classList.contains("collapsed") &&
    rp.classList.contains("collapsed");
  document.body.classList.toggle("panels-collapsed", both);
};

FB.panels.toggleLeftPanel = function () {
  var panel = document.getElementById("left-panel");
  var wasCollapsed = panel.classList.contains("collapsed");
  panel.classList.toggle("collapsed");

  if (wasCollapsed) {
    panel.querySelectorAll(".lp-acc-header").forEach(function (h) {
      var body = document.getElementById("lp-body-" + h.dataset.acc);
      if (body) body.classList.toggle("open", h.classList.contains("open"));
    });
  }

  localStorage.setItem(
    "fb-left-collapsed",
    panel.classList.contains("collapsed"),
  );
  FB.panels.updatePanelsCollapsed();
};

FB.panels.toggleLeftAccordion = function (headerEl) {
  var panel = document.getElementById("left-panel");
  if (panel.classList.contains("collapsed")) return;
  var body = document.getElementById("lp-body-" + headerEl.dataset.acc);
  if (!body) return;
  var isOpen = headerEl.classList.toggle("open");
  body.classList.toggle("open", isOpen);
  if (headerEl.dataset.acc === "mydesigns" && isOpen) {
    FB.panels.loadBuilderDesigns();
  }
};

FB.panels.toggleRightPanel = function () {
  var panel = document.getElementById("right-panel");
  panel.classList.toggle("collapsed");
  localStorage.setItem(
    "fb-right-collapsed",
    panel.classList.contains("collapsed"),
  );
  FB.panels.updatePanelsCollapsed();
};

FB.panels.toggleExportMenu = function (e) {
  if (e) e.stopPropagation();
  document.getElementById("export-menu").classList.toggle("open");
};

FB.panels.toggleMobileMenu = function () {
  document.getElementById("tb-center-items").classList.toggle("open");
};

document.addEventListener("click", function (e) {
  var menu = document.getElementById("export-menu");
  if (menu && !e.target.closest(".tb-export-wrap")) {
    menu.classList.remove("open");
  }
  var items = document.getElementById("tb-center-items");
  if (
    items &&
    items.classList.contains("open") &&
    !e.target.closest(".tb-center")
  ) {
    items.classList.remove("open");
  }
});

FB.panels.openTemplateManager = function () {
  var templates = JSON.parse(localStorage.getItem("fb-templates") || "[]");
  var html =
    '<div style="padding:16px 20px 8px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--text-muted);font-weight:400">Built-in Templates</div>' +
    '<div style="padding:0 20px 8px;display:flex;flex-wrap:wrap;gap:6px">' +
    '<button class="tb-btn" onclick="FB.templates.loadBuiltIn(\'agency\')">Agency</button>' +
    '<button class="tb-btn" onclick="FB.templates.loadBuiltIn(\'portfolio\')">Portfolio</button>' +
    '<button class="tb-btn" onclick="FB.templates.loadBuiltIn(\'saas\')">SaaS</button>' +
    '<button class="tb-btn" onclick="FB.templates.loadBuiltIn(\'landing\')">Landing Page</button>' +
    '<button class="tb-btn" onclick="FB.templates.loadBuiltIn(\'coming-soon\')">Coming Soon</button>' +
    "</div>" +
    '<div style="padding:4px 20px 8px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--accent);font-weight:400">Grid Layouts</div>' +
    '<div style="padding:0 20px 8px;display:flex;flex-wrap:wrap;gap:6px">' +
    '<button class="tb-btn" onclick="FB.templates.loadBuiltIn(\'fshape-grid\')">F-Shape</button>' +
    '<button class="tb-btn" onclick="FB.templates.loadBuiltIn(\'holy-grail\')">Holy Grail</button>' +
    '<button class="tb-btn" onclick="FB.templates.loadBuiltIn(\'asymmetric-split\')">Asymmetric</button>' +
    '<button class="tb-btn" onclick="FB.templates.loadBuiltIn(\'bento-grid\')">Bento Grid</button>' +
    "</div>" +
    '<div style="padding:8px 20px 4px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--text-muted);font-weight:400">Saved Templates</div>' +
    '<div style="padding:20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">';
  if (templates.length === 0) {
    html +=
      '<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-muted)">No saved templates yet. Build a page and click "Save Template".</div>';
  }
  templates.forEach(function (t) {
    html +=
      '<div style="background:var(--surface-1);border:1px solid var(--border);border-radius:6px;padding:16px;cursor:pointer" onclick="FB.templates.load(' +
      t.id +
      ')">' +
      '<div style="font-weight:500;color:var(--text-primary);margin-bottom:4px">' +
      t.name +
      "</div>" +
      '<div style="font-size:11px;color:var(--text-muted)">' +
      t.count +
      " blocks \u00B7 " +
      new Date(t.created).toLocaleDateString() +
      "</div>" +
      '<button class="tb-btn danger" style="margin-top:8px;width:100%" onclick="event.stopPropagation();FB.templates.delete(' +
      t.id +
      ')">Delete</button></div>';
  });
  html += "</div>";
  html +=
    '<div style="padding:12px 20px;border-top:1px solid var(--border);display:flex;gap:8px">' +
    '<button class="tb-btn" onclick="document.getElementById(\'import-input\').click()">\uD83D\uDCE5 Import</button>' +
    '<input type="file" id="import-input" accept=".fwb.json,.json" style="display:none" onchange="FB.templates.importJSON(this.files[0])">' +
    '<button class="tb-btn" onclick="FB.templates.exportJSON()">\uD83D\uDCE4 Export Canvas</button></div>';

  document.getElementById("modal-title").textContent =
    "\uD83D\uDCC2 Template Manager";
  document.getElementById("modal-tabs").style.display = "none";
  document.getElementById("code-output").parentElement.innerHTML = html;
  document.getElementById("modal-overlay").classList.add("open");
};

FB.panels.openSettings = function () {
  var s = FB.canvas.animSettings;
  var checked = function (key) {
    return s[key] ? "checked" : "";
  };
  var html =
    '<div class="modal-head"><h3>Animation Settings</h3><button class="modal-close" onclick="FB.export.close()">\u2715</button></div>' +
    '<div style="padding:20px;display:flex;flex-direction:column;gap:4px">' +
    '<div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px">Toggle Animations</div>' +
    '<label style="display:flex;align-items:center;gap:10px;padding:8px 0;cursor:pointer"><input type="checkbox" ' +
    checked("cursor") +
    ' onchange="FB.canvas.animSettings.cursor=this.checked"> <span style="font-size:13px">Custom cursor</span></label>' +
    '<label style="display:flex;align-items:center;gap:10px;padding:8px 0;cursor:pointer"><input type="checkbox" ' +
    checked("heroReveal") +
    ' onchange="FB.canvas.animSettings.heroReveal=this.checked"> <span style="font-size:13px">Hero entrance reveal</span></label>' +
    '<label style="display:flex;align-items:center;gap:10px;padding:8px 0;cursor:pointer"><input type="checkbox" ' +
    checked("parallax") +
    ' onchange="FB.canvas.animSettings.parallax=this.checked"> <span style="font-size:13px">Hero blob parallax</span></label>' +
    '<label style="display:flex;align-items:center;gap:10px;padding:8px 0;cursor:pointer"><input type="checkbox" ' +
    checked("testimonialAuto") +
    ' onchange="FB.canvas.animSettings.testimonialAuto=this.checked"> <span style="font-size:13px">Testimonial auto-rotate</span></label>' +
    '<label style="display:flex;align-items:center;gap:10px;padding:8px 0;cursor:pointer"><input type="checkbox" ' +
    checked("entrances") +
    ' onchange="FB.canvas.animSettings.entrances=this.checked"> <span style="font-size:13px">Scroll reveal entrances</span></label>' +
    '<div style="border-top:1px solid var(--border);margin:12px 0;padding-top:12px">' +
    '<div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px">Speed</div>' +
    '<div style="display:flex;align-items:center;gap:12px"><span style="font-size:11px;color:var(--text-muted)">0.25x</span>' +
    '<input type="range" min="0.25" max="2" step="0.25" value="' +
    s.speed +
    '" style="flex:1" oninput="FB.canvas.animSettings.speed=+this.value;document.getElementById(\'fw-speed-label\').textContent=this.value+\'x\'">' +
    '<span style="font-size:11px;color:var(--text-muted)" id="fw-speed-label">' +
    s.speed +
    "x</span></div></div>" +
    '<div style="display:flex;gap:8px;margin-top:16px"><button class="tb-btn" onclick="FB.export.close()">Close</button></div>' +
    "</div>";

  var mt = document.getElementById("modal-title");
  if (mt) mt.textContent = "Settings";
  var tabs = document.getElementById("modal-tabs");
  if (tabs) tabs.style.display = "none";
  var co = document.getElementById("code-output");
  if (co && co.parentElement) co.parentElement.innerHTML = html;
  document.getElementById("modal-overlay").classList.add("open");
};

// Helper for widget edit panels
FB.panels._getWidgetProp = function (blockId, key) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === blockId;
  });
  return block ? block.props[key] : undefined;
};

FB.panels.renderLayers = function () {
  var list = document.getElementById("layers-list");
  if (!list) return;

  if (!FB.state.blocks.length) {
    list.innerHTML =
      '<div style="padding:12px 14px;font-size:11px;color:var(--text-muted)">No blocks on canvas</div>';
    return;
  }

  var allDefs = Object.assign(
    {},
    FB.blocks.BLOCK_DEFS,
    FB.blocks.CUSTOM_BLOCK_DEFS,
    FB.widgets._registry,
  );

  var html = "";
  FB.state.blocks.forEach(function (block) {
    var def = allDefs[block.type];
    var label = block._name || (def ? def.label : block.type);
    var icon = def ? def.icon : "□";
    var iconBg = def ? def.iconBg : "#222";
    var iconColor = def ? def.iconColor : "#999";
    var isSelected = block.id === FB.state.selectedId;
    var indent = block.parentId ? 14 : 0;

    html +=
      '<div class="layer-item' +
      (isSelected ? " selected" : "") +
      (block._locked ? " locked" : "") +
      '" onclick="FB.canvas.selectBlock(\'' +
      block.id +
      '\')" data-layer-id="' +
      block.id +
      '" style="padding-left:' +
      (10 + indent) +
      'px">' +
      '<span class="layer-icon" style="background:' +
      iconBg +
      ";color:" +
      iconColor +
      '">' +
      icon +
      "</span>" +
      '<span class="layer-label">' +
      label +
      "</span>" +
      (block._locked ? '<span class="layer-lock">🔒</span>' : "") +
      "</div>";
  });

  list.innerHTML = html;

  // Scroll selected item into view within the layers list
  var sel = list.querySelector(".layer-item.selected");
  if (sel) sel.scrollIntoView({ block: "nearest" });
};

FB.panels.setMode = function (mode) {
  var isDesign = mode === "design";
  document.getElementById("design-studio").style.display = isDesign
    ? "flex"
    : "none";
  document.getElementById("app").style.display = isDesign ? "none" : "flex";
  var modeBtn = document.getElementById("ds-mode-btn");
  if (modeBtn) modeBtn.classList.toggle("active", isDesign);
  FB.design._mode = isDesign;
  if (isDesign && FB.design.canvas && FB.design.canvas.init) {
    requestAnimationFrame(function () {
      FB.design.canvas.init();
    });
  }
};

FB.panels.exitDesignMode = function () {
  FB.panels.setMode("builder");
};

FB.panels.loadBuilderDesigns = function () {
  fetch("/api/designs")
    .then(function (r) {
      return r.json();
    })
    .then(function (list) {
      var grid = document.getElementById("builder-designs-grid");
      if (!grid) return;
      var esc = FB.design._esc;
      grid.innerHTML = list.length
        ? list
            .map(function (d) {
              return (
                '<div class="ds-builder-thumb" onclick="FB.panels.insertDesignBlock(\'' +
                esc(d.slug) +
                '\')" title="' +
                esc(d.name) +
                '">' +
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
        : '<p style="color:#666;padding:8px;font-size:10px">No saved designs.</p>';
    });
};

FB.panels.insertDesignBlock = function (slug) {
  fetch("/api/designs/" + slug)
    .then(function (r) {
      return r.json();
    })
    .then(function (d) {
      var tmpCanvas = new fabric.StaticCanvas(null, {
        width: d.width,
        height: d.height,
      });
      tmpCanvas.loadFromJSON(d.fabric, function () {
        var dataUrl = tmpCanvas.toDataURL({ format: "png", multiplier: 1 });
        tmpCanvas.dispose();
        FB.state.saveHistory();
        FB.state.blocks.push({
          id: FB.state.genId(),
          type: "imageBlock",
          props: { src: dataUrl, alt: d.name, objectFit: "contain" },
        });
        FB.canvas.render();
        FB.util.showToast("Inserted: " + d.name);
      });
    });
};
