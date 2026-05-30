FB.panels = {};

FB.panels.accordionState = {};

FB.panels.renderSection = function(title, content, isOpen) {
  var sectionKey = title.toLowerCase().replace(/\s+/g, '_');
  var display = isOpen ? 'block' : 'none';
  return '<div class="rp-section">' +
    '<button class="rp-section-title" data-section="' + sectionKey + '" style="width:100%;text-align:left;background:none;border:none;padding:8px 0;cursor:pointer;color:var(--text-secondary);font-size:12px;font-weight:600;user-select:none;">' +
    '<span style="display:inline-block;margin-right:6px;transition:transform 0.2s;">' + (isOpen ? '▼' : '▶') + '</span>' +
    title +
    '</button>' +
    '<div class="rp-section-content" data-section="' + sectionKey + '" style="display:' + display + ';overflow:hidden;">' +
    content +
    '</div>' +
    '</div>';
};

FB.panels.toggleSection = function(btn) {
  var sectionKey = btn.getAttribute('data-section');
  var content = btn.parentElement.querySelector('.rp-section-content[data-section="' + sectionKey + '"]');
  if (!content) return;

  var isOpen = content.style.display !== 'none';
  content.style.display = isOpen ? 'none' : 'block';
  var arrow = btn.querySelector('span');
  if (arrow) arrow.textContent = isOpen ? '▶' : '▼';

  // Update accordion state
  var sectionToAccKey = {
    content: "content", style: "style", typography: "typography",
    "spacing_&_dimensions": "spacing", "transform_&_visibility": "advanced",
    "effects_&_border": "effects", hover_states: "hover",
    animation: "animation", scroll_states: "scrollState"
  };
  var accKey = sectionToAccKey[sectionKey] || sectionKey;
  var blockId = null;
  var rightPanel = btn.closest('#right-panel');
  if (rightPanel) {
    blockId = rightPanel.getAttribute('data-block-id');
  }

  if (blockId) {
    var block = FB.state.blocks.find(function(b) { return b.id === blockId; });
    if (block && FB.panels.accordionState[block.type]) {
      FB.panels.accordionState[block.type][accKey] = !isOpen;
    }
  }
};

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

/**
 * FORM BUILDER SYSTEM
 * ==================
 * Clean, reusable helper functions for building form elements with proper IDs
 * All IDs include blockId to prevent duplicate IDs in the DOM
 */
FB.panels.FormBuilder = {
  /**
   * Generate a unique, consistent ID for a form element
   * @param {string} blockId - The block ID
   * @param {string} component - Component name (e.g. 'adv', 'style', 'array')
   * @param {string} prop - Property name
   * @param {string|number} extra - Optional extra identifier (for array indices)
   * @returns {string} Unique ID
   */
  makeId: function(blockId, component, prop, extra) {
    if (extra !== undefined && extra !== null) {
      return component + '_' + blockId + '_' + prop + '_' + extra;
    }
    return component + '_' + blockId + '_' + prop;
  },

  /**
   * Create a text input with proper ID and label
   */
  textInput: function(blockId, prop, value, label, placeholder) {
    var id = this.makeId(blockId, 'input', prop);
    var html = '';
    if (label) html += '<label for="' + id + '">' + label + '</label>';
    html += '<input id="' + id + '" name="' + id + '" type="text" value="' +
            FB.panels.escapeHtml(value || '') + '" placeholder="' + (placeholder || '') +
            '" data-prop="' + prop + '" data-block-id="' + blockId + '">';
    return html;
  },

  /**
   * Create a textarea with proper ID and label
   */
  textarea: function(blockId, prop, value, label, rows) {
    var id = this.makeId(blockId, 'textarea', prop);
    var html = '';
    if (label) html += '<label for="' + id + '">' + label + '</label>';
    html += '<textarea id="' + id + '" name="' + id + '" rows="' + (rows || 3) +
            '" data-prop="' + prop + '" data-block-id="' + blockId + '">' +
            FB.panels.escapeHtml(value || '') + '</textarea>';
    return html;
  },

  /**
   * Create a number input with proper ID and label
   */
  numberInput: function(blockId, prop, value, label, min, max, step) {
    var id = this.makeId(blockId, 'number', prop);
    var html = '';
    if (label) html += '<label for="' + id + '">' + label + '</label>';
    html += '<input id="' + id + '" name="' + id + '" type="number" value="' + (value || 0) +
            '" min="' + (min || 0) + '" max="' + (max || 100) + '" step="' + (step || 1) +
            '" data-prop="' + prop + '" data-block-id="' + blockId + '">';
    return html;
  },

  /**
   * Create a range slider with proper ID and label
   */
  rangeInput: function(blockId, prop, value, label, min, max, step) {
    var id = this.makeId(blockId, 'range', prop);
    var html = '';
    if (label) html += '<label for="' + id + '">' + label + '</label>';
    html += '<input id="' + id + '" name="' + id + '" type="range" value="' + (value || 0) +
            '" min="' + (min || 0) + '" max="' + (max || 100) + '" step="' + (step || 1) +
            '" data-prop="' + prop + '" data-block-id="' + blockId + '">';
    return html;
  },

  /**
   * Create a color input with proper ID and label
   */
  colorInput: function(blockId, prop, value, label) {
    var id = this.makeId(blockId, 'color', prop);
    var normalized = FB.design.normalizeColorForInput(value || '#000000');
    var html = '';
    if (label) html += '<label for="' + id + '">' + label + '</label>';
    html += '<input id="' + id + '" name="' + id + '" type="color" value="' + normalized +
            '" data-prop="' + prop + '" data-block-id="' + blockId + '">';
    return html;
  },

  /**
   * Create a checkbox with proper ID
   */
  checkbox: function(blockId, prop, checked, label) {
    var id = this.makeId(blockId, 'checkbox', prop);
    var html = '<label for="' + id + '">';
    html += '<input id="' + id + '" name="' + id + '" type="checkbox" ' +
            (checked ? 'checked' : '') + ' data-prop="' + prop + '" data-block-id="' + blockId + '">';
    if (label) html += ' ' + label;
    html += '</label>';
    return html;
  },

  /**
   * Create a select/dropdown with proper ID and label
   * Options can be strings or {value, label} objects
   */
  select: function(blockId, prop, value, label, options) {
    var id = this.makeId(blockId, 'select', prop);
    var html = '';
    if (label) html += '<label for="' + id + '">' + label + '</label>';
    html += '<select id="' + id + '" name="' + id + '" data-prop="' + prop + '" data-block-id="' + blockId + '">';

    if (Array.isArray(options)) {
      for (var i = 0; i < options.length; i++) {
        var opt = options[i];
        var optValue = typeof opt === 'string' ? opt : (opt.value || '');
        var optLabel = typeof opt === 'string' ? opt : (opt.label || optValue);
        html += '<option value="' + FB.panels.escapeHtml(optValue) + '" ' + (value === optValue ? 'selected' : '') + '>' +
                FB.panels.escapeHtml(optLabel) + '</option>';
      }
    }

    html += '</select>';
    return html;
  },

  /**
   * Wrap form fields in a row
   */
  row: function(content, className) {
    return '<div class="rp-row ' + (className || '') + '">' + content + '</div>';
  },

  /**
   * Wrap form fields in a group with heading
   */
  group: function(heading, content, className) {
    return '<div class="rp-group ' + (className || '') + '">' +
           (heading ? '<div class="rp-group-heading">' + heading + '</div>' : '') +
           '<div class="rp-group-content">' + content + '</div>' +
           '</div>';
  }
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
    Interactive: "#3b82f6",
    Motion: "#8b5cf6",
  };

  var sections = {
    Structure: [
      "nav",
      "megaNav",
      "slideNav",
      "fullscreenMenu",
      "footer",
      "carousel3d",
      "isometricGrid",
      "perspectiveRooms",
      "floatingIslands",
      "layeredParallax",
      "kineticLayout",
      "morphingGrid",
      "spatialNavigation",
      "infiniteCanvas",
    ],
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
      "kineticText",
      "textScramble",
      "typewriterReveal",
      "textMask",
      "morphingCounter",
      "liquidText",
      "waveText",
      "rotatingText3d",
      "morphingText",
      "kineticScramble",
      "tiltCard3d",
      "glitchSection",
      "audioVisualizer",
      "depthOfField",
      "holographicCard",
      "soundReactive",
      "mirrorReflection",
      "constellationLines",
      "holographicOverlay",
      "lightLeaks",
    ],
    Media: [
      "clientCarousel",
      "liteVideo",
      "circularList",
      "horizontalScroll",
      "morphBlob",
      "noiseGrain",
      "gradientFlow",
      "sectionBackground",
      "glassmorphismStack",
      "auroraBorealis",
      "particleNebula",
      "geometricPatterns",
      "liquidGradient",
      "shaderBg",
    ],
    "Social Proof": [
      "testimonial",
      "trustPill",
      "metricBox",
      "faq",
      "timeline",
      "counterSection",
      "socialLinks",
    ],
    Conversion: [
      "cta",
      "chatWidget",
      "cookieConsent",
      "dayNightSwitcher",
      "scrollIndicator",
      "whatsappWidget",
    ],
    Interactive: [
      "physicsSandbox",
      "imagePhysics",
      "bubblePop",
      "gravityWells",
      "fluidSimulation",
      "clothSimulation",
      "magneticFields",
      "pendulumWave",
      "collisionChaos",
      "blackHole",
      "magneticCursor",
      "particleTrail",
      "cursorRipple",
      "multiShapeTrail",
      "cursorSpotlight",
      "magneticText",
      "cursorDistortion",
      "colorSampler",
      "gravityCursor",
      "cursorLens",
    ],
    Motion: [
      "stickyScrollStack",
      "scrollVelocitySkew",
      "parallaxImageStack",
      "mosaicAssemble",
      "scrollProgressRing",
      "magneticScroll",
      "parallaxDepth",
      "scrollTriggered",
      "horizontalScrollGallery",
      "velocitySkew",
      "scrollFluid",
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
      var def = FB.blocks.BLOCK_DEFS[type] || FB.widgets._registry[type];
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
  /* Close layout library */
};

/* ── Widget Library ── */
FB.panels.buildWidgetLibrary = function () {
  var lib = document.getElementById("widget-library");
  if (!lib) return;
  lib.innerHTML = "";
  var cats = FB.widgets.categories();
  cats.forEach(function (cat) {
    var w = FB.widgets.byCategory(cat);
    var keys = Object.keys(w);
    if (!keys.length) return;
    keys.forEach(function (type) {
      var def = w[type];
      var el = document.createElement("div");
      el.className = "block-item";
      el.draggable = true;
      el.style.cssText = "padding:6px 14px";
      el.innerHTML =
        FB.panels._icon(def.icon || "▦", "#6366f1", 24, 20, 8) +
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
      lib.appendChild(el);
    });
  });
};

/* ── Ecommerce Library ── */
FB.panels.buildEcommerceLibrary = function () {
  var elib = document.getElementById("ecommerce-library");
  if (elib && FB.blocks.ECOMMERCE_DEFS) {
    elib.innerHTML = "";
    var ecomColor = "#10b981";
    Object.keys(FB.blocks.ECOMMERCE_DEFS).forEach(function (type) {
      var def = FB.blocks.ECOMMERCE_DEFS[type];
      var el = document.createElement("div");
      el.className = "block-item";
      el.draggable = true;
      el.innerHTML =
        FB.panels._icon(def.icon, ecomColor) +
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
      elib.appendChild(el);
    });
  }
};

/* ── Education Library ── */
FB.panels.buildEducationLibrary = function () {
  var edulib = document.getElementById("education-library");
  if (!edulib || !FB.blocks.EDUCATION_DEFS) return;
  edulib.innerHTML = "";
  var eduColor = "#3b82f6";
  Object.keys(FB.blocks.EDUCATION_DEFS).forEach(function (type) {
    var def = FB.blocks.EDUCATION_DEFS[type];
    var el = document.createElement("div");
    el.className = "block-item";
    el.draggable = true;
    el.innerHTML =
      FB.panels._icon(def.icon, eduColor) +
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
    edulib.appendChild(el);
  });
};

/* ── INLINE HUD ORBS ── */
FB.panels._hudSections = [
  { key: "content", icon: "\u270E", label: "Content", section: "content", action: null },
  { key: "style", icon: "\u25FC", label: "Style", section: "style", action: null },
  { key: "typography", icon: "\u24B6", label: "Type", section: "typography", action: null },
  { key: "spacing", icon: "\u25A1", label: "Space", section: "spacing_&_dimensions", action: null },
  { key: "effects", icon: "\u2728", label: "FX", section: "effects_&_border", action: null },
  { key: "animation", icon: "\u25B6", label: "Animate", section: "animation", action: null },
  { key: "scroll", icon: "\u2195", label: "Scroll", section: "scroll_states", action: null },
  { key: "surprise", icon: "\u2726", label: "Surprise", section: null, action: "surprise" },
];

FB.panels.createBlockHUD = function(blockId) {
  var el = document.querySelector('.canvas-block[data-id="' + blockId + '"]');
  if (!el) return;

  // Remove any existing HUD
  FB.panels.removeBlockHUD();

  var hud = document.createElement("div");
  hud.className = "block-hud";
  hud.id = "block-hud";

  var inner = document.createElement("div");
  inner.className = "block-hud-inner";

  FB.panels._hudSections.forEach(function (sec, i) {
    var orb = document.createElement("div");
    orb.className = "hud-orb hud-orb-pulse";
    orb.style.animationDelay = (i * 0.1) + "s";
    orb.setAttribute("data-orb", sec.key);
    orb.innerHTML = sec.icon + '<span class="hud-tooltip">' + sec.label + "</span>";
    orb.addEventListener("click", function (e) {
      e.stopPropagation();
      if (sec.action === "surprise") {
        FB.panels.showVariations(blockId);
      } else {
        FB.panels.onHUDOrbClick(sec.section, sec.key);
      }
    });
    inner.appendChild(orb);
  });

  hud.appendChild(inner);
  el.appendChild(hud);
};

FB.panels.removeBlockHUD = function () {
  var existing = document.getElementById("block-hud");
  if (existing) existing.remove();
};

FB.panels.onHUDOrbClick = function (sectionKey, orbKey) {
  var rp = document.getElementById("rp-content");
  if (!rp) return;

  if (sectionKey) {
    var sectionBtn = rp.querySelector('button[data-section="' + sectionKey + '"]');
    if (sectionBtn) {
      var content = sectionBtn.parentElement.querySelector('.rp-section-content[data-section="' + sectionKey + '"]');
      if (content && content.style.display === "none") {
        FB.panels.toggleSection(sectionBtn);
      }
      setTimeout(function () {
        sectionBtn.scrollIntoView({ behavior: "smooth", block: "start" });
        sectionBtn.style.background = "rgba(205,254,0,0.12)";
        setTimeout(function () {
          sectionBtn.style.background = "";
        }, 600);
      }, 50);
    }
  }

  var orb = document.querySelector('.hud-orb[data-orb="' + orbKey + '"]');
  if (orb) {
    orb.classList.add("active");
    setTimeout(function () {
      orb.classList.remove("active");
    }, 600);
  }
};

FB.panels.updateHUDPosition = function () {
  // HUD is absolutely positioned inside the block wrapper, so it auto-follows
  // This function is a hook for future dynamic repositioning if needed
};

// Helper function to convert any color format to valid hex format for HTML5 color inputs
FB.panels.normalizeColorForInput = function(color) {
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

/* ── ARRAY EDITOR FOR ROOMS, CARDS, ETC. ── */

// Helper function to escape HTML special characters
FB.panels.escapeHtml = function(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(char) { return map[char]; });
};

FB.panels.renderArrayEditor = function(blockId, propKey, arrayVal, blockType) {
  var def = FB.widgets.get(blockType) || FB.blocks.BLOCK_DEFS[blockType];
  if (!def || !def.defaultProps) return "";

  var defaults = def.defaultProps;
  var defaultArray = defaults[propKey] || [];
  if (!Array.isArray(defaultArray) || defaultArray.length === 0) return "";

  // Infer item structure from default array
  var sampleItem = defaultArray[0];
  if (typeof sampleItem !== "object" || sampleItem === null) return "";

  var itemKeys = Object.keys(sampleItem);
  var html = '';
  var itemsArray = arrayVal || [];
  if (!Array.isArray(itemsArray)) itemsArray = [];

  html += '<div class="array-editor" data-array-prop="' + propKey + '" data-block-id="' + blockId + '">';
  html += '<div style="margin-bottom: 8px; font-size: 12px; color: var(--text-secondary); display: flex; justify-content: space-between; align-items: center;">';
  html += '<span>' + propKey + ' (' + itemsArray.length + ')</span>';
  html += '<button class="array-add-btn" data-array-prop="' + propKey + '" data-block-id="' + blockId + '" style="background: var(--accent); color: #111; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 11px; font-weight: 600;">+ Add</button>';
  html += '</div>';

  itemsArray.forEach(function(item, idx) {
    if (typeof item !== "object" || item === null) return;

    html += '<div class="array-item" data-array-prop="' + propKey + '" data-item-index="' + idx + '" data-block-id="' + blockId + '" style="border: 1px solid var(--border); border-radius: 6px; margin-bottom: 8px; overflow: hidden;">';

    // Item header with expand/collapse and controls
    html += '<div style="display: flex; align-items: center; gap: 6px; padding: 8px; background: var(--surface); cursor: pointer; user-select: none;">';
    html += '<button class="array-item-toggle" data-item-index="' + idx + '" style="background: none; border: none; padding: 0; cursor: pointer; font-size: 12px; width: 20px; color: var(--text-secondary);">▼</button>';
    html += '<span style="flex: 1; font-size: 11px; font-weight: 500; color: var(--text-secondary);">';

    // Show a readable label for the item (e.g., "Room 1: Title" or "Card 1: Title")
    var itemLabel = propKey === "rooms" ? "Room" : "Card";
    var titleVal = item.title || item.name || "";
    html += itemLabel + ' ' + (idx + 1);
    if (titleVal) html += ': ' + FB.panels.escapeHtml(titleVal);

    html += '</span>';
    html += '<button class="array-item-delete" data-item-index="' + idx + '" data-array-prop="' + propKey + '" data-block-id="' + blockId + '" style="background: #c33; color: white; border: none; border-radius: 3px; padding: 2px 6px; cursor: pointer; font-size: 10px; font-weight: 600;">×</button>';
    html += '</div>';

    // Item content (fields for each property)
    html += '<div class="array-item-content" data-item-index="' + idx + '" style="display: none; padding: 12px; border-top: 1px solid var(--border); background: var(--bg);">';

    itemKeys.forEach(function(key) {
      var val = item[key] !== undefined ? item[key] : "";
      var fieldId = propKey + "_" + idx + "_" + key;
      var inputType = "text";
      var inputHtml = "";

      // Determine input type based on value or key name
      if (key === "bgColor" || key === "textColor" || key === "accentColor" || key === "highlightColor" || key === "color" || key.indexOf("Color") !== -1) {
        var normalizedColor = FB.panels.normalizeColorForInput(val);
        inputHtml = '<input type="color" id="' + fieldId + '" value="' + normalizedColor + '" data-array-prop="' + propKey + '" data-item-index="' + idx + '" data-item-field="' + key + '" data-block-id="' + blockId + '" style="width: 48px; height: 28px; padding: 0; border: 1px solid var(--border); border-radius: 4px; cursor: pointer; background: transparent;">';
      } else if (key === "imageOpacity" || (typeof val === "number" && val >= 0 && val <= 1)) {
        inputHtml = '<input type="range" id="' + fieldId + '" min="0" max="1" step="0.1" value="' + val + '" data-array-prop="' + propKey + '" data-item-index="' + idx + '" data-item-field="' + key + '" data-block-id="' + blockId + '" style="width: 100%;">';
      } else if (key.indexOf("Image") !== -1 || key.indexOf("Url") !== -1 || (typeof val === "string" && val.indexOf("http") === 0)) {
        inputHtml = '<textarea id="' + fieldId + '" rows="2" data-array-prop="' + propKey + '" data-item-index="' + idx + '" data-item-field="' + key + '" data-block-id="' + blockId + '" placeholder="URL...">' + FB.panels.escapeHtml(val) + '</textarea>';
      } else if (key === "description" || key === "cta" || (typeof val === "string" && val.length > 40)) {
        inputHtml = '<textarea id="' + fieldId + '" rows="2" data-array-prop="' + propKey + '" data-item-index="' + idx + '" data-item-field="' + key + '" data-block-id="' + blockId + '">' + FB.panels.escapeHtml(val) + '</textarea>';
      } else {
        inputHtml = '<input type="text" id="' + fieldId + '" value="' + FB.panels.escapeHtml(val) + '" data-array-prop="' + propKey + '" data-item-index="' + idx + '" data-item-field="' + key + '" data-block-id="' + blockId + '">';
      }

      html += '<div class="rp-row" style="margin-bottom: 8px;">';
      html += '<label for="' + fieldId + '" style="font-size: 11px; font-weight: 500; display: block; margin-bottom: 4px;">' + key + '</label>';
      html += inputHtml;
      html += '</div>';
    });

    html += '</div>';
    html += '</div>';
  });

  html += '</div>';
  return html;
};

FB.panels.initArrayEditorEvents = function() {
  var rp = document.getElementById("rp-content");
  if (!rp) return;

  // Toggle array item expansion
  var toggleBtns = rp.querySelectorAll('.array-item-toggle');
  toggleBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var itemIdx = this.getAttribute('data-item-index');
      var content = this.closest('.array-item').querySelector('.array-item-content[data-item-index="' + itemIdx + '"]');
      if (content) {
        var isOpen = content.style.display !== 'none';
        content.style.display = isOpen ? 'none' : 'block';
        this.textContent = isOpen ? '▶' : '▼';
      }
    });
  });

  // Header click also toggles
  var headers = rp.querySelectorAll('.array-item > div:first-child');
  headers.forEach(function(header) {
    header.addEventListener('click', function(e) {
      if (e.target.classList.contains('array-item-delete')) return;
      var toggle = this.querySelector('.array-item-toggle');
      if (toggle) toggle.click();
    });
  });

  // Delete array item
  var deleteBtns = rp.querySelectorAll('.array-item-delete');
  deleteBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var blockId = this.getAttribute('data-block-id');
      var propKey = this.getAttribute('data-array-prop');
      var itemIdx = parseInt(this.getAttribute('data-item-index'));
      FB.panels.deleteArrayItem(blockId, propKey, itemIdx);
    });
  });

  // Add array item
  var addBtns = rp.querySelectorAll('.array-add-btn');
  addBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var blockId = this.getAttribute('data-block-id');
      var propKey = this.getAttribute('data-array-prop');
      FB.panels.addArrayItem(blockId, propKey);
    });
  });

  // Update array item field
  var itemFields = rp.querySelectorAll('[data-array-prop][data-item-field]');
  itemFields.forEach(function(field) {
    field.addEventListener('change', function(e) {
      var blockId = this.getAttribute('data-block-id');
      var propKey = this.getAttribute('data-array-prop');
      var itemIdx = parseInt(this.getAttribute('data-item-index'));
      var fieldKey = this.getAttribute('data-item-field');
      var value = this.value;

      // Handle range input value
      if (this.type === 'range') {
        value = parseFloat(value);
      }

      FB.panels.updateArrayItem(blockId, propKey, itemIdx, fieldKey, value);
    });

    // Also handle input event for real-time feedback on range sliders
    if (field.type === 'range') {
      field.addEventListener('input', function(e) {
        var blockId = this.getAttribute('data-block-id');
        var propKey = this.getAttribute('data-array-prop');
        var itemIdx = parseInt(this.getAttribute('data-item-index'));
        var fieldKey = this.getAttribute('data-item-field');
        var value = parseFloat(this.value);
        FB.panels.updateArrayItem(blockId, propKey, itemIdx, fieldKey, value);
      });
    }
  });
};

FB.panels.updateArrayItem = function(blockId, propKey, itemIdx, fieldKey, value) {
  var block = FB.state.blocks.find(function(b) { return b.id === blockId; });
  if (!block) return;

  FB.state.saveHistory();

  var arr = block.props[propKey];
  if (!Array.isArray(arr)) arr = [];

  if (!arr[itemIdx]) arr[itemIdx] = {};
  arr[itemIdx][fieldKey] = value;

  block.props[propKey] = arr;
  FB.canvas.refreshBlock(blockId);

  // Re-render the right panel to update the UI
  setTimeout(function() {
    try {
      FB.panels.renderRightPanel();
    } catch(e) {
      console.error('Error re-rendering right panel:', e);
    }
  }, 0);
};

FB.panels.addArrayItem = function(blockId, propKey) {
  var block = FB.state.blocks.find(function(b) { return b.id === blockId; });
  if (!block) return;

  var def = FB.widgets.get(block.type) || FB.blocks.BLOCK_DEFS[block.type];
  if (!def || !def.defaultProps) return;

  var defaults = def.defaultProps;
  var defaultArray = defaults[propKey] || [];
  if (!Array.isArray(defaultArray) || defaultArray.length === 0) return;

  var sampleItem = defaultArray[0];
  if (typeof sampleItem !== "object" || sampleItem === null) return;

  FB.state.saveHistory();

  var arr = block.props[propKey];
  if (!Array.isArray(arr)) arr = [];

  // Create a new item with default values
  var newItem = {};
  Object.keys(sampleItem).forEach(function(key) {
    newItem[key] = "";
  });

  arr.push(newItem);
  block.props[propKey] = arr;
  FB.canvas.refreshBlock(blockId);

  // Re-render the right panel
  setTimeout(function() {
    try {
      FB.panels.renderRightPanel();
    } catch(e) {
      console.error('Error re-rendering right panel:', e);
    }
  }, 0);
};

FB.panels.deleteArrayItem = function(blockId, propKey, itemIdx) {
  var block = FB.state.blocks.find(function(b) { return b.id === blockId; });
  if (!block) return;

  FB.state.saveHistory();

  var arr = block.props[propKey];
  if (!Array.isArray(arr)) return;

  arr.splice(itemIdx, 1);
  block.props[propKey] = arr;
  FB.canvas.refreshBlock(blockId);

  // Re-render the right panel
  setTimeout(function() {
    try {
      FB.panels.renderRightPanel();
    } catch(e) {
      console.error('Error re-rendering right panel:', e);
    }
  }, 0);
};

/* ── MORPH SLIDER ── */
FB.panels.morphPresets = {
  _default: [
    { name: "Minimal", props: { _paddingV: 16, _paddingH: 24, _borderRadius: 0, _borderWidth: 0, _bgAlpha: 1, _opacity: 1 } },
    { name: "Soft", props: { _paddingV: 32, _paddingH: 40, _borderRadius: 8, _borderWidth: 0, _bgAlpha: 1, _opacity: 1 } },
    { name: "Editorial", props: { _paddingV: 56, _paddingH: 64, _borderRadius: 2, _borderWidth: 1, _bgAlpha: 0.95, _opacity: 1 } },
    { name: "Brutalist", props: { _paddingV: 40, _paddingH: 32, _borderRadius: 0, _borderWidth: 3, _bgAlpha: 1, _opacity: 1 } },
    { name: "Cyber", props: { _paddingV: 24, _paddingH: 28, _borderRadius: 12, _borderWidth: 1, _bgAlpha: 0.85, _opacity: 1 } },
  ],
};

FB.panels.renderMorphSlider = function (blockId, p, blockType) {
  var presets = FB.panels.morphPresets[blockType] || FB.panels.morphPresets._default;
  if (presets.length < 2) return "";

  var html = '<div class="morph-slider-wrap">' +
    '<div class="morph-slider-header"><span class="morph-slider-title">\u2726 Style Morph</span><span style="font-size:10px;color:var(--text-muted)">' + presets.length + ' presets</span></div>' +
    '<div class="morph-slider-track" id="morph-track" data-block-id="' + blockId + '">' +
    '<div class="morph-slider-fill" id="morph-fill" style="width:0%"></div>' +
    '<div class="morph-slider-thumb" id="morph-thumb" style="left:0%"></div>' +
    '</div>' +
    '<div class="morph-slider-presets">';
  presets.forEach(function (pr) {
    html += '<span>' + pr.name + "</span>";
  });
  html += "</div></div>";
  return html;
};

FB.panels.initMorphSlider = function () {
  var track = document.getElementById("morph-track");
  if (!track) return;
  var thumb = document.getElementById("morph-thumb");
  var fill = document.getElementById("morph-fill");
  if (!thumb || !fill) return;

  var blockId = track.getAttribute("data-block-id");
  var block = FB.state.blocks.find(function (b) { return b.id === blockId; });
  if (!block) return;

  var presets = FB.panels.morphPresets[block.type] || FB.panels.morphPresets._default;
  var isDragging = false;

  function updateFromX(clientX) {
    var rect = track.getBoundingClientRect();
    var pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    thumb.style.left = (pct * 100) + "%";
    fill.style.width = (pct * 100) + "%";

    var idx = pct * (presets.length - 1);
    var i0 = Math.floor(idx);
    var i1 = Math.min(i0 + 1, presets.length - 1);
    var t = idx - i0;

    var p0 = presets[i0].props;
    var p1 = presets[i1].props;
    var merged = {};
    Object.keys(p0).forEach(function (k) {
      var v0 = p0[k];
      var v1 = p1[k];
      if (typeof v0 === "number" && typeof v1 === "number") {
        merged[k] = Math.round((v0 + (v1 - v0) * t) * 100) / 100;
      } else {
        merged[k] = t < 0.5 ? v0 : v1;
      }
    });

    FB.state.saveHistory();
    Object.assign(block.props, merged);
    FB.canvas.refreshBlock(blockId);
  }

  thumb.addEventListener("mousedown", function (e) {
    isDragging = true;
    e.preventDefault();
  });
  track.addEventListener("mousedown", function (e) {
    if (e.target === thumb) return;
    isDragging = true;
    updateFromX(e.clientX);
  });
  window.addEventListener("mousemove", function (e) {
    if (!isDragging) return;
    updateFromX(e.clientX);
  });
  window.addEventListener("mouseup", function () {
    isDragging = false;
  });
};

// Render preset selector dropdown for Advanced Settings
FB.panels.renderPresetsDropdown = function(blockId, widgetType) {
  var presets = FB.widgets.presets || {};
  var globalPresets = presets.global || {};
  var widgetPresets = presets[widgetType] || {};

  // Combine presets: widget-specific first, then global
  var allPresets = {};
  Object.assign(allPresets, globalPresets);
  if (widgetType && presets[widgetType]) {
    Object.assign(allPresets, widgetPresets);
  }

  if (Object.keys(allPresets).length === 0) return '';

  var html = '<div class="preset-selector">';
  html += '<label for="preset-' + blockId + '">Quick Style:</label>';
  html += '<select id="preset-' + blockId + '" name="preset-' + blockId + '" class="preset-dropdown" data-block-id="' + blockId + '">';
  html += '<option value="">Select a preset...</option>';

  Object.keys(allPresets).forEach(function(presetName) {
    var preset = allPresets[presetName];
    html += '<option value="' + presetName + '" title="' + preset.label + '">' + presetName + '</option>';
  });

  html += '</select>';
  html += '<div class="preset-description"></div>';
  html += '</div>';

  return html;
};

// Apply a preset to a block
FB.panels.applyPreset = function(blockId, presetName) {
  var block = FB.state.blocks.find(function(b) { return b.id === blockId; });
  if (!block) return;

  var presets = FB.widgets.presets || {};
  var allPresets = {};
  Object.assign(allPresets, presets.global || {});
  if (presets[block.type]) {
    Object.assign(allPresets, presets[block.type]);
  }

  var preset = allPresets[presetName];
  if (!preset) return;

  // Save to history
  FB.state.saveHistory();

  // Apply each property in the preset
  var properties = preset.properties || {};
  Object.keys(properties).forEach(function(key) {
    block.props[key] = properties[key];
  });

  // Update canvas and UI
  FB.canvas.refreshBlock(blockId);
  FB.panels.renderRightPanel(blockId);

  // Show notification
  if (typeof showNotification === 'function') {
    showNotification('Applied preset: ' + presetName, 'success');
  }
};

// Create and show a tooltip
FB.panels.createTooltip = function(text, x, y) {
  // Remove any existing tooltips
  var existing = document.querySelector('.prop-tooltip');
  if (existing) existing.remove();

  var tooltip = document.createElement('div');
  tooltip.className = 'prop-tooltip';
  tooltip.innerHTML = text;
  tooltip.style.position = 'fixed';
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
  tooltip.style.maxWidth = '200px';
  tooltip.style.backgroundColor = '#222';
  tooltip.style.color = '#fff';
  tooltip.style.padding = '8px 10px';
  tooltip.style.borderRadius = '4px';
  tooltip.style.fontSize = '12px';
  tooltip.style.zIndex = '10000';
  tooltip.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
  tooltip.style.animation = 'fadeInTooltip 0.2s ease-out';

  document.body.appendChild(tooltip);

  // Auto-remove after 3 seconds or on mouse leave
  var timeout = setTimeout(function() {
    if (tooltip.parentElement) tooltip.remove();
  }, 3000);

  tooltip.addEventListener('mouseleave', function() {
    clearTimeout(timeout);
    if (tooltip.parentElement) tooltip.remove();
  });

  return tooltip;
};

// Initialize tooltip system for property labels
FB.panels.initTooltipSystem = function() {
  var panel = document.querySelector('#right-panel');
  if (!panel) return;

  var tooltips = FB.widgets._propTooltips || {};

  // Use event delegation on labels
  panel.addEventListener('mouseenter', function(e) {
    var label = e.target.closest('.rp-row label');
    if (!label) return;

    // Find the property name from the adjacent input
    var row = label.closest('.rp-row');
    if (!row) return;

    var input = row.querySelector('input, select, textarea');
    if (!input) return;

    var propName = input.getAttribute('data-prop');
    if (!propName || !tooltips[propName]) return;

    var tooltipText = tooltips[propName];
    var rect = label.getBoundingClientRect();

    // Position tooltip above label, centered
    var x = rect.left + rect.width / 2 - 100; // 100 = half of max-width
    var y = rect.top - 40;

    FB.panels.createTooltip(tooltipText, x, y);
  }, true);
};

// Render a preview of the block (simplified version)
FB.panels.renderBlockPreview = function(blockId) {
  var block = FB.state.blocks.find(function(b) { return b.id === blockId; });
  if (!block) return '';

  // Get the block element from canvas
  var blockEl = document.querySelector('[data-block-id="' + blockId + '"]');
  if (!blockEl) return '<div class="preview-block"><p>Preview not available</p></div>';

  // Clone the block element
  var clone = blockEl.cloneNode(true);

  // Remove any interactive elements or controls
  var controls = clone.querySelectorAll('[class*="control"], [class*="handle"], [class*="drag"]');
  controls.forEach(function(ctrl) { ctrl.remove(); });

  // Create a safe HTML version
  var previewDiv = document.createElement('div');
  previewDiv.className = 'preview-block';
  previewDiv.innerHTML = clone.innerHTML;

  // Scale down the preview if it's too large
  var rect = blockEl.getBoundingClientRect();
  if (rect.width > 300) {
    var scale = 300 / rect.width;
    previewDiv.style.transform = 'scale(' + scale + ')';
    previewDiv.style.transformOrigin = 'top left';
  }

  return previewDiv.outerHTML;
};

// Toggle the preview pane visibility
FB.panels.togglePreviewPane = function() {
  var rp = document.getElementById('right-panel');
  if (!rp) return;

  var isSplit = rp.classList.contains('right-panel-split');
  if (isSplit) {
    // Hide preview
    rp.classList.remove('right-panel-split');
    var preview = rp.querySelector('.preview-pane-container');
    if (preview) preview.remove();
    localStorage.setItem('fb_preview_pane_visible', 'false');
  } else {
    // Show preview
    rp.classList.add('right-panel-split');
    var blockId = FB.state.selectedId;
    if (blockId) {
      var previewHtml = '<div class="preview-pane-container">' +
        '<div class="preview-pane-header">' +
        '<span>Live Preview</span>' +
        '<button onclick="FB.panels.togglePreviewPane()">✕</button>' +
        '</div>' +
        '<div class="preview-pane">' +
        FB.panels.renderBlockPreview(blockId) +
        '</div>' +
        '</div>';

      // Insert preview after content
      var content = document.querySelector('#rp-content');
      if (content) {
        content.insertAdjacentHTML('afterend', previewHtml);
      }
    }
    localStorage.setItem('fb_preview_pane_visible', 'true');
  }
};

// Update preview live as user adjusts properties
FB.panels.updatePreviewLive = function(blockId) {
  var preview = document.querySelector('.preview-pane');
  if (!preview) return;

  var previewBlock = document.querySelector('.preview-block');
  if (previewBlock) {
    previewBlock.innerHTML = FB.panels.renderBlockPreview(blockId);
  }
};

FB.panels.renderAdvancedSettings = function(blockId, p) {
  var FB_Block = FB.panels.FormBuilder;
  var block = FB.state.blocks.find(function(b) { return b.id === blockId; });
  var widgetType = block ? block.type : '';

  var html = FB.panels.renderPresetsDropdown(blockId, widgetType);

  // Preview toggle
  html += '<div style="padding:8px 18px;border-bottom:1px solid var(--border);display:flex;justify-content:flex-end;">';
  html += '<button class="preview-toggle-btn" onclick="FB.panels.togglePreviewPane();return false;">👁️ Show Preview</button>';
  html += '</div>';

  html += '<div class="advanced-settings-tabs"><div class="adv-tabs-nav">';
  html += '<button class="adv-tab-btn active" data-tab="html-css">HTML/CSS</button>';
  html += '<button class="adv-tab-btn" data-tab="animations">Animations</button>';
  html += '<button class="adv-tab-btn" data-tab="interactions">Interactions</button>';
  html += '<button class="adv-tab-btn" data-tab="advanced-styling">Styling</button>';
  html += '<button class="adv-tab-btn" data-tab="responsive">Responsive</button>';
  html += '<button class="adv-tab-btn" data-tab="accessibility">Accessibility</button>';
  html += '<button class="adv-tab-btn" data-tab="performance">Performance</button>';
  html += '<button class="adv-tab-btn" data-tab="analytics">Analytics</button>';
  html += '</div>';

  // Tab 1: HTML & CSS
  html += '<div class="adv-tab-content active" data-tab="html-css">';
  html += FB_Block.row(FB_Block.textInput(blockId, '_customClass', p._customClass, 'Custom Classes', 'space-separated'));
  html += FB_Block.row(FB_Block.textInput(blockId, '_customId', p._customId, 'Custom ID'));
  html += FB_Block.row(FB_Block.textarea(blockId, '_dataAttributes', p._dataAttributes, 'Data Attributes (JSON)', 2));
  html += FB_Block.row(FB_Block.textarea(blockId, '_customAttributes', p._customAttributes, 'Custom Attributes (JSON)', 2));
  html += '</div>';

  // Tab 2: Animations
  html += '<div class="adv-tab-content" data-tab="animations">';
  var animTypes = ["none", "fadeIn", "slideUp", "slideDown", "slideLeft", "slideRight", "scaleIn", "rotateIn", "bounceIn"];
  html += FB_Block.row(FB_Block.select(blockId, '_animationType', p._animationType, 'Animation Type', animTypes));
  html += FB_Block.row(FB_Block.numberInput(blockId, '_animDuration', p._animDuration || 500, 'Duration (ms)', 0, 5000, 100));
  html += FB_Block.row(FB_Block.numberInput(blockId, '_animDelay', p._animDelay || 0, 'Delay (ms)', 0, 2000, 100));
  var easings = ["ease", "linear", "ease-in", "ease-out", "ease-in-out"];
  html += FB_Block.row(FB_Block.select(blockId, '_animEasing', p._animEasing, 'Easing', easings));
  html += '</div>';

  // Tab 3: Interactions
  html += '<div class="adv-tab-content" data-tab="interactions">';
  var clickActions = ["none", "openUrl", "scrollTo", "customJs"];
  html += FB_Block.row(FB_Block.select(blockId, '_onClickAction', p._onClickAction, 'On Click', clickActions));
  html += FB_Block.row(FB_Block.textInput(blockId, '_onClickValue', p._onClickValue, 'Click Value', 'URL, ID, or JS'));
  html += FB_Block.row(FB_Block.checkbox(blockId, '_onClickNewTab', p._onClickNewTab, 'Open in new tab'));
  var hoverEffects = ["none", "scale", "glow", "shadow", "colorShift"];
  html += FB_Block.row(FB_Block.select(blockId, '_onHoverEffect', p._onHoverEffect, 'On Hover', hoverEffects));
  html += '</div>';

  // Tab 4: Advanced Styling
  html += '<div class="adv-tab-content" data-tab="advanced-styling">';
  html += FB_Block.row(FB_Block.textarea(blockId, '_filter', p._filter, 'CSS Filter', 2));
  html += FB_Block.row(FB_Block.textarea(blockId, '_backdropFilter', p._backdropFilter, 'Backdrop Filter', 2));
  html += FB_Block.row(FB_Block.textInput(blockId, '_clipPath', p._clipPath, 'Clip Path', 'circle(50%) or polygon(...)'));
  html += '</div>';

  // Tab 5: Responsive
  html += '<div class="adv-tab-content" data-tab="responsive">';
  html += FB_Block.row(FB_Block.checkbox(blockId, '_hideOnMobile', p._hideOnMobile, 'Hide on mobile (&lt;768px)'));
  html += FB_Block.row(FB_Block.checkbox(blockId, '_hideOnTablet', p._hideOnTablet, 'Hide on tablet (768-1023px)'));
  html += FB_Block.row(FB_Block.checkbox(blockId, '_hideOnDesktop', p._hideOnDesktop, 'Hide on desktop (&ge;1024px)'));
  html += '</div>';

  // Tab 6: Accessibility
  html += '<div class="adv-tab-content" data-tab="accessibility">';
  html += FB_Block.row(FB_Block.textInput(blockId, '_ariaLabel', p._ariaLabel, 'ARIA Label'));
  html += FB_Block.row(FB_Block.textInput(blockId, '_ariaDescribedBy', p._ariaDescribedBy, 'ARIA Described By', 'element ID'));
  var roles = ["", "button", "link", "heading", "article", "section", "nav", "main"];
  var roleOpts = roles.map(function(r) { return { value: r, label: r || "none" }; });
  html += FB_Block.row(FB_Block.select(blockId, '_role', p._role, 'ARIA Role', roleOpts));
  html += FB_Block.row(FB_Block.checkbox(blockId, '_ariaHidden', p._ariaHidden, 'Hidden from screen readers'));
  html += '</div>';

  // Tab 7: Performance
  html += '<div class="adv-tab-content" data-tab="performance">';
  html += FB_Block.row(FB_Block.checkbox(blockId, '_lazyLoad', p._lazyLoad, 'Lazy load images'));
  html += FB_Block.row(FB_Block.checkbox(blockId, '_preload', p._preload, 'Preload next block'));
  html += '</div>';

  // Tab 8: Analytics
  html += '<div class="adv-tab-content" data-tab="analytics">';
  html += FB_Block.row(FB_Block.textInput(blockId, '_trackingId', p._trackingId, 'Tracking ID'));
  html += FB_Block.row(FB_Block.textInput(blockId, '_trackingEvent', p._trackingEvent, 'Event Name'));
  html += '</div>';

  html += '</div>';
  return html;
};

/* ── RIGHT PANEL ── */
FB.panels.renderRightPanel = function () {
  var rp = document.getElementById("rp-content");

  // Show metadata editor if page settings are open AND no block is selected
  if (FB.state.metadataEditingPageId && !FB.state.selectedId) {
    var content = FB.pages.renderMetadataPanel(FB.state.metadataEditingPageId);
    rp.innerHTML = content;

    // Add character counters
    setTimeout(function () {
      var titleInput = rp.querySelector(".page-title-input");
      var descInput = rp.querySelector(".page-description-input");

      function updateCounter(input, maxLen) {
        var counts = input.parentElement.querySelectorAll(".char-count");
        if (counts.length) {
          counts[counts.length - 1].textContent = (input.value || "").length + "/" + maxLen;
        }
      }

      if (titleInput) {
        titleInput.addEventListener("input", function () {
          updateCounter(titleInput, 60);
        });
        updateCounter(titleInput, 60);
      }

      if (descInput) {
        descInput.addEventListener("input", function () {
          updateCounter(descInput, 160);
        });
        updateCounter(descInput, 160);
      }
    }, 0);

    return;
  }

  if (!FB.state.selectedId) {
    rp.innerHTML =
      '<div class="rp-empty"><div class="rp-empty-icon">\u2190</div><div>Click a block to edit its styles, or click \u2699\ufe0f on a page tab for page settings</div></div>';
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
    FB.blocks.ECOMMERCE_DEFS,
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
      scrollState: false,
    };
  }
  var acc = FB.panels.accordionState[block.type];
  if (acc.animation === undefined) acc.animation = false;
  if (acc.typography === undefined) acc.typography = true;
  if (acc.effects === undefined) acc.effects = false;
  if (acc.hover === undefined) acc.hover = false;
  if (acc.scrollState === undefined) acc.scrollState = false;

  /* Content section */
  var contentHtml = "";

  // Widget types — delegate to widget's edit panel
  if (FB.widgets.get(block.type)) {
    contentHtml = FB.widgets.getEditPanel(block.type, block.id, block.props);
  }
  if (block.type === "nav") {
    contentHtml +=
      '<div class="rp-row"><label for="nav_logoText">Logo Text</label><input id="nav_logoText" name="nav_logoText" type="text" value="' +
      p.logoText +
      '" data-prop="logoText" data-block-id="' + block.id + '"></div>';
    contentHtml +=
      '<div class="rp-row"><label for="nav_ctaText">CTA Text</label><input id="nav_ctaText" name="nav_ctaText" type="text" value="' +
      p.ctaText +
      '" data-prop="ctaText" data-block-id="' + block.id + '"></div>';
    contentHtml +=
      '<div class="rp-row"><label for="nav_links">Links (one per line)</label><textarea id="nav_links" name="nav_links" rows="4" data-prop="links" data-type="json" data-handler="updatePropJSON" data-block-id="' + block.id + '">' +
      (p.links || []).join("\n") +
      "</textarea></div>";
  }
  if (block.type === "hero") {
    contentHtml +=
      '<div class="rp-row"><label for="hero_eyebrow">Eyebrow</label><input id="hero_eyebrow" name="hero_eyebrow" type="text" value="' +
      p.eyebrow +
      '" data-prop="eyebrow" data-block-id="' + block.id + '"></div>';
    contentHtml +=
      '<div class="rp-row"><label for="hero_headline">Headline</label><textarea id="hero_headline" name="hero_headline" rows="2" data-prop="headline" data-block-id="' + block.id + '">' +
      p.headline +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label for="hero_subtext">Subtext</label><textarea id="hero_subtext" name="hero_subtext" rows="2" data-prop="subtext" data-block-id="' + block.id + '">' +
      p.subtext +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label for="hero_ctaText">CTA Text</label><input id="hero_ctaText" name="hero_ctaText" type="text" value="' +
      p.ctaText +
      '" data-prop="ctaText" data-block-id="' + block.id + '"></div>';
  }
  if (block.type === "videoHero") {
    contentHtml +=
      '<div class="rp-row"><label for="vh_videoUrl">Video URL</label><input id="vh_videoUrl" name="vh_videoUrl" type="text" value="' +
      (p.videoUrl || '') +
      '" placeholder="/videos/my-video.mp4" data-prop="videoUrl" data-block-id="' + block.id + '"></div>';
    contentHtml +=
      '<div class="rp-row"><button id="vh_upload_btn" class="rp-btn" style="width:100%;padding:8px;background:#CDFE00;color:#111;border:none;border-radius:4px;font-weight:600;cursor:pointer;margin-bottom:8px">📤 Upload Video</button></div>';
    contentHtml +=
      '<div style="padding:8px;background:rgba(255,255,255,0.05);border-radius:4px;font-size:11px;color:var(--ui-muted);margin:8px 0"><strong>Tips:</strong><ul style="margin:4px 0;padding-left:16px"><li>Click "Upload Video" to add from your computer</li><li>Or paste URL: <code>/videos/file.mp4</code></li><li>Supports MP4, WebM formats</li><li>Max ~100MB (depends on hosting)</li></ul></div>';
    contentHtml +=
      '<div class="rp-row"><label for="vh_headline">Headline</label><textarea id="vh_headline" name="vh_headline" rows="2" data-prop="headline" data-block-id="' + block.id + '">' +
      (p.headline || '') +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label for="vh_subtext">Subtext</label><textarea id="vh_subtext" name="vh_subtext" rows="2" data-prop="subtext" data-block-id="' + block.id + '">' +
      (p.subtext || '') +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label for="vh_overlayOpacity">Overlay Opacity</label><input id="vh_overlayOpacity" name="vh_overlayOpacity" type="number" value="' +
      (p.overlayOpacity !== undefined ? p.overlayOpacity : 0.4) +
      '" min="0" max="1" step="0.1" data-prop="overlayOpacity" data-type="number" data-block-id="' + block.id + '"></div>';
  }
  if (block.type === "marquee") {
    contentHtml +=
      '<div class="rp-row"><label for="marquee_items">Items (one per line)</label><textarea id="marquee_items" name="marquee_items" rows="5" data-prop="items" data-type="multiline-array" data-block-id="' + block.id + '">' +
      (p.items || []).join("\n") +
      "</textarea></div>";
  }
  if (block.type === "services") {
    contentHtml +=
      '<div class="rp-row"><label for="services_services">Services (one per line)</label><textarea id="services_services" name="services_services" rows="6" data-prop="services" data-handler="updateServicesFromText" data-block-id="' + block.id + '">' +
      (p.services || []).map(function(s){return s.name;}).join("\n") +
      "</textarea></div>";
  }
  if (block.type === "stats") {
    (p.stats || []).forEach(function (s, i) {
      contentHtml +=
        '<div class="rp-row" style="flex-direction:row;gap:6px">' +
        '<input id="stat_num_' + i + '" name="stat_num_' + i + '" type="text" value="' +
        s.num +
        '" placeholder="Value" style="width:45%" data-handler="updateStatField" data-index="' + i + '" data-field="num" data-block-id="' + block.id + '">' +
        '<input id="stat_label_' + i + '" name="stat_label_' + i + '" type="text" value="' +
        s.label +
        '" placeholder="Label" style="width:55%" data-handler="updateStatField" data-index="' + i + '" data-field="label" data-block-id="' + block.id + '"></div>';
    });
  }
  if (block.type === "process") {
    (p.steps || []).forEach(function (s, i) {
      contentHtml +=
        '<div class="rp-row"><label for="step_title_' + i + '">Step ' + (i+1) + ' Title</label>' +
        '<input id="step_title_' + i + '" name="step_title_' + i + '" type="text" value="' +
        s.title +
        '" data-handler="updateStepField" data-index="' + i + '" data-field="title" data-block-id="' + block.id + '">' +
        '<label for="step_desc_' + i + '" style="margin-top:4px">Description</label>' +
        '<textarea id="step_desc_' + i + '" name="step_desc_' + i + '" rows="2" data-handler="updateStepField" data-index="' + i + '" data-field="desc" data-block-id="' + block.id + '">' +
        s.desc +
        "</textarea></div>";
    });
  }
  if (block.type === "work") {
    contentHtml +=
      '<div class="rp-row"><label for="work_label">Section Label</label><input id="work_label" name="work_label" type="text" value="' +
      p.label +
      '" data-prop="label" data-block-id="' + block.id + '"></div>';
    contentHtml +=
      '<div class="rp-row"><label for="work_headline">Headline</label><input id="work_headline" name="work_headline" type="text" value="' +
      p.headline +
      '" data-prop="headline" data-block-id="' + block.id + '"></div>';
    (p.cards || []).forEach(function (c, i) {
      contentHtml += '<div class="rp-row" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:8px"><label style="font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:0.5">Card ' + (i + 1) + '</label></div>';
      contentHtml += '<div class="rp-row"><label>Title</label><input type="text" value="' + (c.title || '') + '" data-handler="updateWorkCardField" data-index="' + i + '" data-field="title" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row"><label>Tag</label><input type="text" value="' + (c.tag || '') + '" data-handler="updateWorkCardField" data-index="' + i + '" data-field="tag" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row"><label>Description</label><input type="text" value="' + (c.desc || '') + '" data-handler="updateWorkCardField" data-index="' + i + '" data-field="desc" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row"><label>Image URL</label><input type="text" value="' + (c.imageUrl || '') + '" placeholder="https://..." data-handler="updateWorkCardField" data-index="' + i + '" data-field="imageUrl" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row"><label>Card Background</label><input type="text" value="' + (c.bg || '') + '" placeholder="gradient or colour" data-handler="updateWorkCardField" data-index="' + i + '" data-field="bg" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row" style="flex-direction:row;gap:6px;align-items:center"><label style="width:auto;flex-shrink:0">Text Colour</label><input type="color" value="' + (c.textColor || '#f7f6f2') + '" data-handler="updateWorkCardField" data-index="' + i + '" data-field="textColor" data-block-id="' + block.id + '"></div>';
    });
  }
  if (block.type === "features") {
    contentHtml += '<div class="rp-row"><label for="features_label">Section Label</label><input id="features_label" type="text" value="' + (p.label || '') + '" data-prop="label" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="features_headline">Headline</label><input id="features_headline" type="text" value="' + (p.headline || '') + '" data-prop="headline" data-block-id="' + block.id + '"></div>';
    (p.items || []).forEach(function (item, i) {
      contentHtml += '<div class="rp-row" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:8px"><label style="font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:0.5">Feature ' + (i + 1) + '</label></div>';
      contentHtml += '<div class="rp-row"><label>Icon (emoji)</label><input type="text" value="' + (item.icon || '') + '" data-handler="updateFeatureItemField" data-index="' + i + '" data-field="icon" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row"><label>Title</label><input type="text" value="' + (item.title || '') + '" data-handler="updateFeatureItemField" data-index="' + i + '" data-field="title" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row"><label>Description</label><textarea rows="2" data-handler="updateFeatureItemField" data-index="' + i + '" data-field="desc" data-block-id="' + block.id + '">' + (item.desc || '') + '</textarea></div>';
      contentHtml += '<div class="rp-row"><label>Image URL (overrides icon)</label><input type="text" value="' + (item.image || '') + '" placeholder="https://..." data-handler="updateFeatureItemField" data-index="' + i + '" data-field="image" data-block-id="' + block.id + '"></div>';
    });
  }
  if (block.type === "pricing") {
    contentHtml += '<div class="rp-row"><label>Section Label</label><input type="text" value="' + (p.label || '') + '" data-prop="label" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label>Headline</label><input type="text" value="' + (p.headline || '') + '" data-prop="headline" data-block-id="' + block.id + '"></div>';
    (p.tiers || []).forEach(function (t, i) {
      contentHtml += '<div class="rp-row" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:8px"><label style="font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:0.5">Tier ' + (i + 1) + '</label></div>';
      contentHtml += '<div class="rp-row"><label>Name</label><input type="text" value="' + (t.name || '') + '" data-handler="updatePricingTierField" data-index="' + i + '" data-field="name" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row"><label>Price</label><input type="text" value="' + (t.price || '') + '" data-handler="updatePricingTierField" data-index="' + i + '" data-field="price" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row"><label>Period</label><input type="text" value="' + (t.period || '/project') + '" data-handler="updatePricingTierField" data-index="' + i + '" data-field="period" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row"><label>CTA Text</label><input type="text" value="' + (t.cta || '') + '" data-handler="updatePricingTierField" data-index="' + i + '" data-field="cta" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row"><label>Features (one per line)</label><textarea rows="4" data-handler="updatePricingTierFeatures" data-index="' + i + '" data-block-id="' + block.id + '">' + (t.features || []).join('\n') + '</textarea></div>';
      contentHtml += '<div class="rp-row" style="flex-direction:row;gap:6px;align-items:center"><label style="width:auto;flex-shrink:0">Card BG</label><input type="color" value="' + (t.cardBg || (t.highlighted ? '#1a1a1a' : '#ffffff')) + '" data-handler="updatePricingTierField" data-index="' + i + '" data-field="cardBg" data-block-id="' + block.id + '"><label style="width:auto;flex-shrink:0">Text</label><input type="color" value="' + (t.cardTextColor || (t.highlighted ? '#f7f6f2' : '#111111')) + '" data-handler="updatePricingTierField" data-index="' + i + '" data-field="cardTextColor" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row"><label>Image URL</label><input type="text" value="' + (t.image || '') + '" placeholder="https://..." data-handler="updatePricingTierField" data-index="' + i + '" data-field="image" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row" style="flex-direction:row;gap:6px;align-items:center"><label><input type="checkbox" ' + (t.highlighted ? 'checked' : '') + ' data-handler="updatePricingTierField" data-index="' + i + '" data-field="highlighted" data-type="boolean" data-block-id="' + block.id + '"> Highlighted (popular)</label></div>';
    });
  }
  if (block.type === "team") {
    contentHtml += '<div class="rp-row"><label>Section Label</label><input type="text" value="' + (p.label || '') + '" data-prop="label" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label>Headline</label><input type="text" value="' + (p.headline || '') + '" data-prop="headline" data-block-id="' + block.id + '"></div>';
    (p.members || []).forEach(function (m, i) {
      contentHtml += '<div class="rp-row" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:8px"><label style="font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:0.5">Member ' + (i + 1) + '</label></div>';
      contentHtml += '<div class="rp-row"><label>Name</label><input type="text" value="' + (m.name || '') + '" data-handler="updateTeamMemberField" data-index="' + i + '" data-field="name" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row"><label>Role</label><input type="text" value="' + (m.role || '') + '" data-handler="updateTeamMemberField" data-index="' + i + '" data-field="role" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row"><label>Bio</label><textarea rows="2" data-handler="updateTeamMemberField" data-index="' + i + '" data-field="bio" data-block-id="' + block.id + '">' + (m.bio || '') + '</textarea></div>';
      contentHtml += '<div class="rp-row"><label>Photo URL</label><input type="text" value="' + (m.imageUrl || '') + '" placeholder="https://..." data-handler="updateTeamMemberField" data-index="' + i + '" data-field="imageUrl" data-block-id="' + block.id + '"></div>';
    });
  }
  if (block.type === "portfolioGrid") {
    contentHtml += '<div class="rp-row"><label>Section Label</label><input type="text" value="' + (p.label || '') + '" data-prop="label" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label>Headline</label><input type="text" value="' + (p.headline || '') + '" data-prop="headline" data-block-id="' + block.id + '"></div>';
    (p.items || []).forEach(function (item, i) {
      contentHtml += '<div class="rp-row" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:8px"><label style="font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:0.5">Item ' + (i + 1) + '</label></div>';
      contentHtml += '<div class="rp-row"><label>Title</label><input type="text" value="' + (item.title || '') + '" data-handler="updatePortfolioItemField" data-index="' + i + '" data-field="title" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row"><label>Category</label><input type="text" value="' + (item.category || '') + '" data-handler="updatePortfolioItemField" data-index="' + i + '" data-field="category" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row"><label>Description</label><input type="text" value="' + (item.desc || '') + '" data-handler="updatePortfolioItemField" data-index="' + i + '" data-field="desc" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row"><label>Image URL</label><input type="text" value="' + (item.imageUrl || '') + '" placeholder="https://..." data-handler="updatePortfolioItemField" data-index="' + i + '" data-field="imageUrl" data-block-id="' + block.id + '"></div>';
    });
  }
  if (block.type === "maskReveal") {
    contentHtml += '<div class="rp-row"><label>Headline</label><input type="text" value="' + (p.headline || '') + '" data-prop="headline" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label>Subtext</label><textarea rows="2" data-prop="subtext" data-block-id="' + block.id + '">' + (p.subtext || '') + '</textarea></div>';
    contentHtml += '<div class="rp-row"><label>CTA Button Text (leave blank to hide)</label><input type="text" value="' + (p.ctaText || '') + '" data-prop="ctaText" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label>Image URL (optional)</label><input type="text" value="' + (p.imageUrl || '') + '" placeholder="https://..." data-prop="imageUrl" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label>Font Size (rem)</label><input type="number" value="' + (p.fontSize || 4) + '" min="1" max="12" step="0.5" data-prop="fontSize" data-type="number" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label>Font Weight</label><select data-prop="fontWeight" data-type="number" data-block-id="' + block.id + '"><option value="400" ' + (p.fontWeight === 400 ? 'selected' : '') + '>Regular</option><option value="700" ' + (p.fontWeight === 700 ? 'selected' : '') + '>Bold</option><option value="800" ' + ((p.fontWeight || 800) === 800 ? 'selected' : '') + '>ExtraBold</option><option value="900" ' + (p.fontWeight === 900 ? 'selected' : '') + '>Black</option></select></div>';
  }
  if (block.type === "resultsGrid") {
    contentHtml += '<div class="rp-row"><label>Section Label</label><input type="text" value="' + (p.label || '') + '" data-prop="label" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label>Headline</label><input type="text" value="' + (p.headline || '') + '" data-prop="headline" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label>Subtitle</label><input type="text" value="' + (p.subtitle || '') + '" data-prop="subtitle" data-block-id="' + block.id + '"></div>';
    (p.cards || []).forEach(function (c, i) {
      contentHtml += '<div class="rp-row" style="border-top:1px solid rgba(255,255,255,0.06);padding-top:8px"><label style="font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:0.5">Result ' + (i + 1) + '</label></div>';
      contentHtml += '<div class="rp-row"><label>Client Name</label><input type="text" value="' + (c.clientName || '') + '" data-handler="updateResultCardField" data-index="' + i + '" data-field="clientName" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row"><label>Type</label><input type="text" value="' + (c.type || '') + '" data-handler="updateResultCardField" data-index="' + i + '" data-field="type" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row"><label>Location</label><input type="text" value="' + (c.location || '') + '" data-handler="updateResultCardField" data-index="' + i + '" data-field="location" data-block-id="' + block.id + '"></div>';
      contentHtml += '<div class="rp-row"><label>Description</label><textarea rows="2" data-handler="updateResultCardField" data-index="' + i + '" data-field="description" data-block-id="' + block.id + '">' + (c.description || '') + '</textarea></div>';
    });
  }
  if (block.type === "glitchText") {
    contentHtml += '<div class="rp-row"><label>Headline</label><input type="text" value="' + (p.headline || '') + '" data-prop="headline" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label>Subtext</label><input type="text" value="' + (p.subtext || '') + '" data-prop="subtext" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label>Font Size (rem)</label><input type="number" value="' + (p.fontSize || 6) + '" min="1" max="16" step="0.5" data-prop="fontSize" data-type="number" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label>Font Weight</label><select data-prop="fontWeight" data-type="number" data-block-id="' + block.id + '"><option value="700" ' + (p.fontWeight === 700 ? 'selected' : '') + '>Bold</option><option value="800" ' + (p.fontWeight === 800 ? 'selected' : '') + '>ExtraBold</option><option value="900" ' + ((p.fontWeight || 900) === 900 ? 'selected' : '') + '>Black</option></select></div>';
  }
  if (block.type === "svgDraw") {
    contentHtml += '<div class="rp-row"><label>Text</label><input type="text" value="' + (p.headline || '') + '" data-prop="headline" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label>Subtext</label><input type="text" value="' + (p.subtext || '') + '" data-prop="subtext" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label>Animation Duration (seconds)</label><input type="number" value="' + (p.animDuration || 3) + '" min="0.5" max="10" step="0.5" data-prop="animDuration" data-type="number" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label>Stroke Colour</label><input type="color" value="' + (p.accentColor || '#CDFE00') + '" data-prop="accentColor" data-block-id="' + block.id + '"></div>';
  }
  if (block.type === "testimonial") {
    contentHtml +=
      '<div class="rp-row"><label for="testimonial_quote">Quote</label><textarea id="testimonial_quote" name="testimonial_quote" rows="3" data-prop="quote" data-block-id="' + block.id + '">' +
      p.quote +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label for="testimonial_attribution">Attribution</label><input id="testimonial_attribution" name="testimonial_attribution" type="text" value="' +
      p.attribution +
      '" data-prop="attribution" data-block-id="' + block.id + '"></div>';
  }
  if (block.type === "footer") {
    contentHtml +=
      '<div class="rp-row"><label for="footer_logoText">Logo Text</label><input id="footer_logoText" name="footer_logoText" type="text" value="' +
      p.logoText +
      '" data-prop="logoText" data-block-id="' + block.id + '"></div>';
    contentHtml +=
      '<div class="rp-row"><label for="footer_tagline">Tagline</label><input id="footer_tagline" name="footer_tagline" type="text" value="' +
      p.tagline +
      '" data-prop="tagline" data-block-id="' + block.id + '"></div>';
    contentHtml +=
      '<div class="rp-row"><label for="footer_copyright">Copyright</label><input id="footer_copyright" name="footer_copyright" type="text" value="' +
      p.copyright +
      '" data-prop="copyright" data-block-id="' + block.id + '"></div>';
  }
  if (block.type === "cta") {
    contentHtml +=
      '<div class="rp-row"><label for="cta_headline">Headline</label><textarea id="cta_headline" name="cta_headline" rows="2" data-prop="headline" data-block-id="' + block.id + '">' +
      p.headline +
      "</textarea></div>";
    contentHtml +=
      '<div class="rp-row"><label for="cta_btnText">Button Text</label><input id="cta_btnText" name="cta_btnText" type="text" value="' +
      p.btnText +
      '" data-prop="btnText" data-block-id="' + block.id + '"></div>';
  }
  if (block.type === "kineticText") {
    contentHtml += '<div class="rp-row"><label for="kt-headline-' + block.id + '">Headline</label><input id="kt-headline-' + block.id + '" name="kt-headline" type="text" value="' + (p.headline || '') + '" data-prop="headline" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="kt-subtext-' + block.id + '">Subtext</label><input id="kt-subtext-' + block.id + '" name="kt-subtext" type="text" value="' + (p.subtext || '') + '" data-prop="subtext" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="kt-fontSize-' + block.id + '">Font Size (rem)</label><input id="kt-fontSize-' + block.id + '" name="kt-fontSize" type="number" value="' + (p.fontSize || 3.5) + '" min="1" max="10" step="0.5" data-prop="fontSize" data-type="number" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="kt-fontWeight-' + block.id + '">Font Weight</label><select id="kt-fontWeight-' + block.id + '" name="kt-fontWeight" data-prop="fontWeight" data-type="number" data-block-id="' + block.id + '"><option value="700" ' + (p.fontWeight === 700 ? 'selected' : '') + '>Bold</option><option value="800" ' + ((p.fontWeight || 800) === 800 ? 'selected' : '') + '>ExtraBold</option><option value="900" ' + (p.fontWeight === 900 ? 'selected' : '') + '>Black</option></select></div>';
  }
  if (block.type === "textScramble") {
    contentHtml += '<div class="rp-row"><label for="ts-headline-' + block.id + '">Headline</label><input id="ts-headline-' + block.id + '" name="ts-headline" type="text" value="' + (p.headline || '') + '" data-prop="headline" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="ts-subtext-' + block.id + '">Subtext</label><input id="ts-subtext-' + block.id + '" name="ts-subtext" type="text" value="' + (p.subtext || '') + '" data-prop="subtext" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="ts-fontSize-' + block.id + '">Font Size (rem)</label><input id="ts-fontSize-' + block.id + '" name="ts-fontSize" type="number" value="' + (p.fontSize || 3.5) + '" min="1" max="10" step="0.5" data-prop="fontSize" data-type="number" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="ts-fontWeight-' + block.id + '">Font Weight</label><select id="ts-fontWeight-' + block.id + '" name="ts-fontWeight" data-prop="fontWeight" data-type="number" data-block-id="' + block.id + '"><option value="700" ' + (p.fontWeight === 700 ? 'selected' : '') + '>Bold</option><option value="800" ' + ((p.fontWeight || 800) === 800 ? 'selected' : '') + '>ExtraBold</option><option value="900" ' + (p.fontWeight === 900 ? 'selected' : '') + '>Black</option></select></div>';
  }
  if (block.type === "typewriterReveal") {
    contentHtml += '<div class="rp-row"><label for="tw-headline-' + block.id + '">Headline</label><input id="tw-headline-' + block.id + '" name="tw-headline" type="text" value="' + (p.headline || '') + '" data-prop="headline" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="tw-subtext-' + block.id + '">Subtext</label><input id="tw-subtext-' + block.id + '" name="tw-subtext" type="text" value="' + (p.subtext || '') + '" data-prop="subtext" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="tw-fontSize-' + block.id + '">Font Size (rem)</label><input id="tw-fontSize-' + block.id + '" name="tw-fontSize" type="number" value="' + (p.fontSize || 3.5) + '" min="1" max="10" step="0.5" data-prop="fontSize" data-type="number" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="tw-typeSpeed-' + block.id + '">Type Speed (ms)</label><input id="tw-typeSpeed-' + block.id + '" name="tw-typeSpeed" type="number" value="' + (p.typeSpeed || 50) + '" min="10" max="200" step="10" data-prop="typeSpeed" data-type="number" data-block-id="' + block.id + '"></div>';
  }
  if (block.type === "textMask") {
    contentHtml += '<div class="rp-row"><label for="tm-headline-' + block.id + '">Headline</label><input id="tm-headline-' + block.id + '" name="tm-headline" type="text" value="' + (p.headline || '') + '" data-prop="headline" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="tm-subtext-' + block.id + '">Subtext</label><input id="tm-subtext-' + block.id + '" name="tm-subtext" type="text" value="' + (p.subtext || '') + '" data-prop="subtext" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="tm-imageUrl-' + block.id + '">Image URL</label><input id="tm-imageUrl-' + block.id + '" name="tm-imageUrl" type="text" value="' + (p.imageUrl || '') + '" data-prop="imageUrl" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="tm-fontSize-' + block.id + '">Font Size (rem)</label><input id="tm-fontSize-' + block.id + '" name="tm-fontSize" type="number" value="' + (p.fontSize || 3.5) + '" min="1" max="10" step="0.5" data-prop="fontSize" data-type="number" data-block-id="' + block.id + '"></div>';
  }
  if (block.type === "morphingCounter") {
    contentHtml += '<div class="rp-row"><label for="mc-label-' + block.id + '">Label</label><input id="mc-label-' + block.id + '" name="mc-label" type="text" value="' + (p.label || '') + '" data-prop="label" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="mc-startValue-' + block.id + '">Start Value</label><input id="mc-startValue-' + block.id + '" name="mc-startValue" type="number" value="' + (p.startValue || 0) + '" data-prop="startValue" data-type="number" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="mc-endValue-' + block.id + '">End Value</label><input id="mc-endValue-' + block.id + '" name="mc-endValue" type="number" value="' + (p.endValue || 100) + '" data-prop="endValue" data-type="number" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="mc-suffix-' + block.id + '">Suffix</label><input id="mc-suffix-' + block.id + '" name="mc-suffix" type="text" value="' + (p.suffix || '') + '" data-prop="suffix" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="mc-duration-' + block.id + '">Duration (seconds)</label><input id="mc-duration-' + block.id + '" name="mc-duration" type="number" value="' + (p.duration || 2) + '" min="0.5" max="10" step="0.5" data-prop="duration" data-type="number" data-block-id="' + block.id + '"></div>';
  }
  if (block.type === "liquidText") {
    contentHtml += '<div class="rp-row"><label for="lt-headline-' + block.id + '">Headline</label><input id="lt-headline-' + block.id + '" name="lt-headline" type="text" value="' + (p.headline || '') + '" data-prop="headline" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="lt-subtext-' + block.id + '">Subtext</label><input id="lt-subtext-' + block.id + '" name="lt-subtext" type="text" value="' + (p.subtext || '') + '" data-prop="subtext" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="lt-fontSize-' + block.id + '">Font Size (rem)</label><input id="lt-fontSize-' + block.id + '" name="lt-fontSize" type="number" value="' + (p.fontSize || 3.5) + '" min="1" max="10" step="0.5" data-prop="fontSize" data-type="number" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="lt-distortionAmount-' + block.id + '">Distortion Amount</label><input id="lt-distortionAmount-' + block.id + '" name="lt-distortionAmount" type="number" value="' + (p.distortionAmount || 2) + '" min="1" max="10" step="0.5" data-prop="distortionAmount" data-type="number" data-block-id="' + block.id + '"></div>';
  }
  if (block.type === "waveText") {
    contentHtml += '<div class="rp-row"><label for="wt-headline-' + block.id + '">Headline</label><input id="wt-headline-' + block.id + '" name="wt-headline" type="text" value="' + (p.headline || '') + '" data-prop="headline" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="wt-subtext-' + block.id + '">Subtext</label><input id="wt-subtext-' + block.id + '" name="wt-subtext" type="text" value="' + (p.subtext || '') + '" data-prop="subtext" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="wt-fontSize-' + block.id + '">Font Size (rem)</label><input id="wt-fontSize-' + block.id + '" name="wt-fontSize" type="number" value="' + (p.fontSize || 3.5) + '" min="1" max="10" step="0.5" data-prop="fontSize" data-type="number" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="wt-waveHeight-' + block.id + '">Wave Height (px)</label><input id="wt-waveHeight-' + block.id + '" name="wt-waveHeight" type="number" value="' + (p.waveHeight || 30) + '" min="10" max="100" step="5" data-prop="waveHeight" data-type="number" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="wt-waveSpeed-' + block.id + '">Wave Speed (s)</label><input id="wt-waveSpeed-' + block.id + '" name="wt-waveSpeed" type="number" value="' + (p.waveSpeed || 1.5) + '" min="0.5" max="5" step="0.1" data-prop="waveSpeed" data-type="number" data-block-id="' + block.id + '"></div>';
  }
  if (block.type === "audioVisualizer") {
    contentHtml += '<div class="rp-row"><label for="av-label-' + block.id + '">Label</label><input id="av-label-' + block.id + '" name="av-label" type="text" value="' + (p.label || '') + '" data-prop="label" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="av-barCount-' + block.id + '">Bar Count</label><input id="av-barCount-' + block.id + '" name="av-barCount" type="number" value="' + (p.barCount || 20) + '" min="5" max="50" step="1" data-prop="barCount" data-type="number" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="av-barColor-' + block.id + '">Bar Colour</label><input id="av-barColor-' + block.id + '" name="av-barColor" type="color" value="' + (p.barColor || '#CDFE00') + '" data-prop="barColor" data-block-id="' + block.id + '"></div>';
  }
  if (block.type === "depthOfField") {
    contentHtml += '<div class="rp-row"><label for="dof-headline-' + block.id + '">Headline</label><input id="dof-headline-' + block.id + '" name="dof-headline" type="text" value="' + (p.headline || '') + '" data-prop="headline" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="dof-subtext-' + block.id + '">Subtext</label><input id="dof-subtext-' + block.id + '" name="dof-subtext" type="text" value="' + (p.subtext || '') + '" data-prop="subtext" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="dof-fontSize-' + block.id + '">Font Size (rem)</label><input id="dof-fontSize-' + block.id + '" name="dof-fontSize" type="number" value="' + (p.fontSize || 3.5) + '" min="1" max="10" step="0.5" data-prop="fontSize" data-type="number" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="dof-blurAmount-' + block.id + '">Blur Amount (px)</label><input id="dof-blurAmount-' + block.id + '" name="dof-blurAmount" type="number" value="' + (p.blurAmount || 8) + '" min="1" max="20" step="1" data-prop="blurAmount" data-type="number" data-block-id="' + block.id + '"></div>';
    contentHtml += '<div class="rp-row"><label for="dof-focusIntensity-' + block.id + '">Focus Intensity (0-1)</label><input id="dof-focusIntensity-' + block.id + '" name="dof-focusIntensity" type="number" value="' + (p.focusIntensity || 0.7) + '" min="0" max="1" step="0.1" data-prop="focusIntensity" data-type="number" data-block-id="' + block.id + '"></div>';
  }
  if (block.type.indexOf("ecom") === 0) {
    var ecomDef = FB.blocks.ECOMMERCE_DEFS[block.type];
    if (ecomDef) {
      var ecomProps = ecomDef.defaultProps || {};
      Object.keys(ecomProps).forEach(function (key) {
        var val = p[key];
        if (val === undefined) val = "";
        var fieldId = 'ecom_' + key;
        if (typeof ecomProps[key] === "number") {
          contentHtml +=
            '<div class="rp-row"><label for="' + fieldId + '">' +
            key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1") +
            '</label><input id="' + fieldId + '" name="' + fieldId + '" type="number" value="' + val +
            '" data-ecom-prop="' + key + '" data-ecom-type="number" data-block-id="' + block.id + '"></div>';
        } else if (typeof ecomProps[key] === "boolean") {
          contentHtml +=
            '<div class="rp-row"><label><input id="' + fieldId + '" name="' + fieldId + '" type="checkbox" ' + (val ? "checked" : "") +
            ' data-ecom-prop="' + key + '" data-ecom-type="boolean" data-block-id="' + block.id + '"> ' +
            key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1") +
            "</label></div>";
        } else if (Array.isArray(ecomProps[key])) {
          if (typeof ecomProps[key][0] === "string") {
            contentHtml +=
              '<div class="rp-row"><label for="' + fieldId + '">' +
              key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1") +
              ' (one per line)</label><textarea id="' + fieldId + '" name="' + fieldId + '" rows="4" data-ecom-prop="' + key +
              '" data-ecom-type="string-array" data-block-id="' + block.id + '">' +
              (Array.isArray(val) ? val.join("\n") : val) +
              "</textarea></div>";
          } else if (typeof ecomProps[key][0] === "object") {
            (val || []).forEach(function (item, idx) {
              contentHtml +=
                '<div style="border:1px solid var(--border);border-radius:4px;margin:6px 14px;padding:8px">' +
                '<div style="font-size:10px;color:var(--ui-muted);margin-bottom:4px">' +
                key + " " + (idx + 1) + '</div>';
              Object.keys(item).forEach(function (field) {
                var fval = item[field] || "";
                var objFieldId = 'ecom_' + key + '_' + idx + '_' + field;
                contentHtml +=
                  '<input id="' + objFieldId + '" name="' + objFieldId + '" type="text" value="' + fval +
                  '" placeholder="' + field +
                  '" style="width:100%;margin-bottom:4px" data-ecom-prop="' + key +
                  '" data-ecom-type="object-array" data-ecom-index="' + idx + '" data-ecom-field="' + field +
                  '" data-block-id="' + block.id + '">';
              });
              contentHtml += "</div>";
            });
          }
        } else {
          if (val && val.length > 80) {
            contentHtml +=
              '<div class="rp-row"><label for="' + fieldId + '">' +
              key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1") +
              '</label><textarea id="' + fieldId + '" name="' + fieldId + '" rows="3" data-ecom-prop="' + key +
              '" data-ecom-type="text" data-block-id="' + block.id + '">' + val + "</textarea></div>";
          } else {
            contentHtml +=
              '<div class="rp-row"><label for="' + fieldId + '">' +
              key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1") +
              '</label><input id="' + fieldId + '" name="' + fieldId + '" type="text" value="' + val +
              '" data-ecom-prop="' + key + '" data-ecom-type="text" data-block-id="' + block.id + '"></div>';
          }
        }
      });
    }
  }
  /* Style section */
  var bgAlpha = p._bgAlpha !== undefined ? p._bgAlpha : 1;
  var bgGradientEnabled = !!p._bgGradient;
  var gradType = p._gradientType || "linear";
  var gradAngle = p._gradientAngle !== undefined ? p._gradientAngle : 135;
  var gradC1 = p._gradientColor1 || "#1a1a2e";
  var gradC2 = p._gradientColor2 || "#cdfe00";
  var gradP1 = p._gradientPos1 !== undefined ? p._gradientPos1 : 0;
  var gradP2 = p._gradientPos2 !== undefined ? p._gradientPos2 : 100;
  var styleHtml = "";
  var bgColorValue = p.bg || "#111111";
  var bgColorNormalized = FB.panels.normalizeColorForInput(bgColorValue);
  styleHtml +=
    '<div class="rp-row"><label for="style_bg_color">Background</label><div class="color-row">' +
    '<input id="style_bg_color" name="style_bg_color" type="color" value="' +
    bgColorNormalized +
    '" data-prop="bg" data-block-id="' + block.id + '">' +
    '<input id="style_bg_text" name="style_bg_text" type="text" value="' +
    bgColorValue +
    '" data-prop="bg" data-block-id="' + block.id + '"></div></div>' +
    '<div class="rp-row"><label for="style_bgAlpha">BG Alpha: <span>' +
    bgAlpha +
    "</span></label>" +
    '<input id="style_bgAlpha" name="style_bgAlpha" type="range" min="0" max="1" step="0.05" value="' +
    bgAlpha +
    '" data-prop="_bgAlpha" data-type="number" data-block-id="' + block.id + '"></div>';

  /** Typography **/
  var typographyHtml = "";
  var fontVal = p._fontFamily || p.fontFamily || "inherit";
  typographyHtml +=
    '<div class="rp-row"><label for="typo_fontFamily">Font Family</label><select id="typo_fontFamily" name="typo_fontFamily" data-prop="_fontFamily" data-type="text" data-block-id="' + block.id + '">' +
    '<option value="inherit"' +
    (fontVal === "inherit" ? " selected" : "") +
    ">Inherit</option>" +
    FB.panels.GOOGLE_FONTS.filter(function (f) {
      return f;
    })
      .map(function (f) {
        return (
          '<option value="' +
          f +
          '"' +
          (fontVal === f ? " selected" : "") +
          ">" +
          f +
          "</option>"
        );
      })
      .join("") +
    "</select></div>" +
    '<div class="rp-row"><fieldset style="border:none;padding:0;margin:0"><legend>Text Align</legend><div style="display:flex;gap:3px">' +
    ["left", "center", "right"]
      .map(function (a) {
        return (
          '<button id="typo_align_' + a + '" name="typo_align_' + a + '" class="rp-btn ' +
          (p._textAlign === a ? "accent" : "") +
          '" style="flex:1;padding:5px;text-align:center;font-size:10px" data-prop="_textAlign" data-value="' + a + '" data-block-id="' + block.id + '">' +
          a.charAt(0).toUpperCase() +
          a.slice(1) +
          "</button>"
        );
      })
      .join("") +
    "</div></fieldset></div>";

  /** Spacing **/
  var spacingHtml = "";
  var padV = p._paddingV !== undefined ? p._paddingV : 0;
  var padH = p._paddingH !== undefined ? p._paddingH : 0;
  spacingHtml +=
    '<div class="rp-row"><label id="space_padV_label" for="space_padV">Padding Top/Bottom: ' +
    padV +
    'px</label>' + FB.panels.renderCascadeLink("_paddingV") + '<input id="space_padV" name="space_padV" type="range" min="0" max="160" step="4" value="' +
    padV +
    '" data-prop="_paddingV" data-type="number" data-label-id="space_padV_label" data-label-prefix="Padding Top/Bottom: " data-label-suffix="px" data-block-id="' + block.id + '"></div>' +
    '<div class="rp-row"><label id="space_padH_label" for="space_padH">Padding Left/Right: ' +
    padH +
    'px</label>' + FB.panels.renderCascadeLink("_paddingH") + '<input id="space_padH" name="space_padH" type="range" min="0" max="120" step="4" value="' +
    padH +
    '" data-prop="_paddingH" data-type="number" data-label-id="space_padH_label" data-label-prefix="Padding Left/Right: " data-label-suffix="px" data-block-id="' + block.id + '"></div>';

  /** Advanced **/
  var advHtml = "";
  var op = p._opacity !== undefined ? p._opacity : 1;
  advHtml +=
    '<div class="rp-row"><label id="adv_opacity_label" for="adv_opacity">Opacity: ' +
    op +
    '</label>' + FB.panels.renderCascadeLink("_opacity") +
    '<input id="adv_opacity" name="adv_opacity" type="range" min="0" max="1" step="0.05" value="' +
    op +
    '" data-prop="_opacity" data-type="number" data-label-id="adv_opacity_label" data-label-prefix="Opacity: " data-block-id="' + block.id + '"></div>';

  /** Effects **/
  var effectsHtml = "";
  var br = p._borderRadius !== undefined ? p._borderRadius : 0;
  var bw = p._borderWidth !== undefined ? p._borderWidth : 0;
  effectsHtml +=
    '<div class="rp-row"><label id="fx_br_label" for="fx_br">Border Radius: ' +
    br +
    'px</label>' + FB.panels.renderCascadeLink("_borderRadius") + '<input id="fx_br" name="fx_br" type="range" min="0" max="40" step="1" value="' +
    br +
    '" data-prop="_borderRadius" data-type="number" data-label-id="fx_br_label" data-label-prefix="Border Radius: " data-label-suffix="px" data-block-id="' + block.id + '"></div>' +
    '<div class="rp-row"><label id="fx_bw_label" for="fx_bw">Border Width: ' +
    bw +
    'px</label>' + FB.panels.renderCascadeLink("_borderWidth") + '<input id="fx_bw" name="fx_bw" type="range" min="0" max="12" step="1" value="' +
    bw +
    '" data-prop="_borderWidth" data-type="number" data-label-id="fx_bw_label" data-label-prefix="Border Width: " data-label-suffix="px" data-block-id="' + block.id + '"></div>';

  /** Hover **/
  var hoverHtml = "";

  /** Animation **/
  var animHtml = "";

  /** Advanced Settings **/
  var advancedSettingsHtml = "";
  try { advancedSettingsHtml = FB.panels.renderAdvancedSettings(block.id, p); } catch(e) { console.error("Advanced settings render error:", e); }

  /** Actions **/
  var actionsHtml =
    '<div class="rp-section" style="border:none">' +
    '<button id="action_duplicate" name="action_duplicate" class="rp-btn" data-action="duplicateBlock" data-block-id="' + block.id + '">\u29C9 Duplicate block</button>' +
    '<button id="action_delete" name="action_delete" class="rp-btn" style="color:#e88;border-color:#e55" data-action="deleteBlock" data-block-id="' + block.id + '">\u2715 Delete block</button></div>';

  var deviceMode = FB.state.device || "desktop";
  var deviceIcon = deviceMode === "mobile" ? "\uD83D\uDCF1" : deviceMode === "tablet" ? "\uD83D\uDDA8" : "\uD83D\uDDA5";
  var deviceColor = deviceMode === "mobile" ? "#f59e0b" : deviceMode === "tablet" ? "#3b82f6" : "#10b981";
  var viewportBanner = '<div style="padding:6px 14px;background:' + deviceColor + '11;border-bottom:1px solid ' + deviceColor + '33;display:flex;align-items:center;gap:6px;font-size:10px;color:' + deviceColor + ';font-weight:600;text-transform:uppercase;letter-spacing:0.5px">' + deviceIcon + ' Editing for ' + deviceMode + '</div>';

  var morphHtml = "";
  try { morphHtml = FB.panels.renderMorphSlider(block.id, p, block.type); } catch(e) { console.warn("Morph slider error:", e); }
  var scrollStateHtml = "";
  try { scrollStateHtml = FB.panels.renderScrollStateSection(block.id, p); } catch(e) { console.warn("Scroll state error:", e); }
  var promptWidgetHtml = "";
  try { promptWidgetHtml = FB.panels.renderPromptWidget(block.id); } catch(e) { console.warn("Prompt widget error:", e); }

  var html =
    viewportBanner +
    morphHtml +
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
    FB.panels.renderSection("Advanced Settings", advancedSettingsHtml, acc.advancedSettings) +
    FB.panels.renderSection("Scroll States", scrollStateHtml, acc.scrollState) +
    promptWidgetHtml +
    '<div class="rp-section">' +
    actionsHtml +
    "</div>";

  rp.innerHTML = html;
  // Initialize all event listeners for the entire right panel (removes need for inline handlers)
  setTimeout(function() {
    FB.panels.initRightPanelEvents();
    try { FB.panels.initArrayEditorEvents(); } catch(e) { console.warn("Array editor init error:", e); }
    try { FB.panels.initMorphSlider(); } catch(e) { console.warn("Morph slider init error:", e); }
    try { FB.panels.initScrollStateEvents(); } catch(e) { console.warn("Scroll state init error:", e); }
    try { FB.panels.initPromptWidgetEvents(); } catch(e) { console.warn("Prompt widget init error:", e); }
  }, 0);
};

FB.panels.updateProp = function (id, key, val) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === id;
  });
  if (!block) return;
  FB.state.saveHistory();
  block.props[key] = val;
  FB.canvas.refreshBlock(id);
  setTimeout(function() {
    try {
      FB.panels.renderRightPanel();
    } catch (e) {
      console.error('Error in renderRightPanel:', e);
    }
  }, 0);
};

FB.panels.updateWidgetProp = function (id, key, val) {
  return FB.panels.updateProp(id, key, val);
};

// Master event delegation system for entire right panel - removes need for inline handlers
FB.panels.initRightPanelEvents = function() {
  var rp = document.getElementById("rp-content");
  if (!rp) return;

  // Initialize preset dropdown
  var presetDropdown = rp.querySelector('.preset-dropdown');
  if (presetDropdown) {
    presetDropdown.addEventListener('change', function(e) {
      var presetName = e.target.value;
      if (presetName) {
        var blockId = e.target.getAttribute('data-block-id') || FB.state.selectedId;
        FB.panels.applyPreset(blockId, presetName);
        // Reset dropdown
        e.target.value = '';
      }
    });

    // Show preset description on hover
    presetDropdown.addEventListener('mouseover', function(e) {
      var option = e.target;
      if (option && option.tagName === 'OPTION' && option.title) {
        var desc = rp.querySelector('.preset-description');
        if (desc) {
          desc.textContent = option.title;
          desc.style.display = 'block';
        }
      }
    });

    presetDropdown.addEventListener('mouseout', function() {
      var desc = rp.querySelector('.preset-description');
      if (desc) {
        desc.style.display = 'none';
      }
    });
  }

  // Initialize tooltip system
  FB.panels.initTooltipSystem();

  // Handle regular property update fields
  var propFields = rp.querySelectorAll('[data-prop]:not([data-skip-event])');
  propFields.forEach(function(field) {
    field.addEventListener('change', function(e) {
      var blockId = field.getAttribute('data-block-id') || FB.state.selectedId;
      var prop = field.getAttribute('data-prop');
      var type = field.getAttribute('data-type');
      var handler = field.getAttribute('data-handler');
      var value = field.value;

      if (type === 'checkbox') {
        value = field.checked;
      } else if (type === 'boolean') {
        value = field.checked;
      } else if (type === 'number') {
        value = parseFloat(value) || 0;
      } else if (type === 'json') {
        try {
          value = JSON.parse(value);
          field.style.borderColor = '';
        } catch(err) {
          field.style.borderColor = '#e55';
          return;
        }
      } else if (type === 'multiline-array') {
        // Split by newline and filter empty lines
        value = value.split('\n').filter(function(s){return s.trim();});
      }

      // Update label if this field has a data-label-id attribute (for sliders)
      var labelId = field.getAttribute('data-label-id');
      if (labelId) {
        var label = document.getElementById(labelId);
        if (label) {
          var prefix = field.getAttribute('data-label-prefix') || '';
          var suffix = field.getAttribute('data-label-suffix') || '';
          label.textContent = prefix + value + suffix;
        }
      }

      if (handler === 'updatePropJSON') {
        FB.panels.updatePropJSON(blockId, prop, value);
      } else if (handler === 'updateServicesFromText') {
        FB.panels.updateServicesFromText(blockId, field.value);
      } else if (handler === 'updateStatField') {
        var idx = parseInt(field.getAttribute('data-index')) || 0;
        var fieldName = field.getAttribute('data-field') || 'num';
        FB.panels.updateStatField(blockId, idx, fieldName, value);
      } else if (handler === 'updateStepField') {
        var idx = parseInt(field.getAttribute('data-index')) || 0;
        var fieldName = field.getAttribute('data-field') || 'title';
        FB.panels.updateStepField(blockId, idx, fieldName, value);
      } else if (handler === 'updateWorkCardField') {
        var idx = parseInt(field.getAttribute('data-index')) || 0;
        var fieldName = field.getAttribute('data-field');
        FB.panels.updateWorkCardField(blockId, idx, fieldName, value);
      } else if (handler === 'updateFeatureItemField') {
        var idx = parseInt(field.getAttribute('data-index')) || 0;
        var fieldName = field.getAttribute('data-field');
        FB.panels.updateFeatureItemField(blockId, idx, fieldName, value);
      } else if (handler === 'updatePricingTierField') {
        var idx = parseInt(field.getAttribute('data-index')) || 0;
        var fieldName = field.getAttribute('data-field');
        var isBoolean = field.getAttribute('data-type') === 'boolean';
        FB.panels.updatePricingTierField(blockId, idx, fieldName, isBoolean ? field.checked : value);
      } else if (handler === 'updatePricingTierFeatures') {
        var idx = parseInt(field.getAttribute('data-index')) || 0;
        FB.panels.updatePricingTierFeatures(blockId, idx, field.value);
      } else if (handler === 'updateTeamMemberField') {
        var idx = parseInt(field.getAttribute('data-index')) || 0;
        var fieldName = field.getAttribute('data-field');
        FB.panels.updateTeamMemberField(blockId, idx, fieldName, value);
      } else if (handler === 'updatePortfolioItemField') {
        var idx = parseInt(field.getAttribute('data-index')) || 0;
        var fieldName = field.getAttribute('data-field');
        FB.panels.updatePortfolioItemField(blockId, idx, fieldName, value);
      } else if (handler === 'updateResultCardField') {
        var idx = parseInt(field.getAttribute('data-index')) || 0;
        var fieldName = field.getAttribute('data-field');
        FB.panels.updateResultCardField(blockId, idx, fieldName, value);
      } else {
        FB.panels.updateProp(blockId, prop, value);
        FB.panels.applyCascade(blockId, prop, value);
      }
    });

    // Also handle input event for range sliders (for real-time feedback)
    if (field.type === 'range') {
      field.addEventListener('input', function(e) {
        var labelId = field.getAttribute('data-label-id');
        if (labelId) {
          var label = document.getElementById(labelId);
          if (label) {
            var prefix = field.getAttribute('data-label-prefix') || '';
            var suffix = field.getAttribute('data-label-suffix') || '';
            label.textContent = prefix + this.value + suffix;
          }
        }
        // Apply cascade for real-time linked property updates
        var blockId = field.getAttribute('data-block-id') || FB.state.selectedId;
        var prop = field.getAttribute('data-prop');
        var val = parseFloat(this.value);
        FB.panels.applyCascade(blockId, prop, val);
      });
    }
  });

  // Handle toggleSection for section titles (not buttons)
  var sectionTitles = rp.querySelectorAll('button[data-section]');
  sectionTitles.forEach(function(title) {
    title.addEventListener('click', function(e) {
      FB.panels.toggleSection(this);
      e.preventDefault();
    });
  });

  // Handle text align buttons (which set data-value)
  var alignButtons = rp.querySelectorAll('button[data-value][data-prop]');
  alignButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var blockId = this.getAttribute('data-block-id') || FB.state.selectedId;
      var prop = this.getAttribute('data-prop');
      var value = this.getAttribute('data-value');
      FB.panels.updateProp(blockId, prop, value);
      e.preventDefault();
    });
  });

  // Handle action buttons (duplicate, delete)
  var actionButtons = rp.querySelectorAll('button[data-action]');
  actionButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var action = this.getAttribute('data-action');
      var blockId = this.getAttribute('data-block-id') || FB.state.selectedId;

      if (action === 'duplicateBlock') {
        FB.canvas.duplicateBlock(blockId);
      } else if (action === 'deleteBlock') {
        FB.canvas.deleteBlock(blockId);
      }
      e.preventDefault();
    });
  });

  // Handle cascade link buttons
  var cascadeBtns = rp.querySelectorAll('button[data-cascade]');
  cascadeBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var prop = this.getAttribute('data-cascade');
      FB.panels.toggleCascadeLink(prop);
    });
  });

  // Handle animation settings
  var animSettings = rp.querySelectorAll('[data-anim-setting]');
  animSettings.forEach(function(checkbox) {
    checkbox.addEventListener('change', function() {
      var setting = checkbox.getAttribute('data-anim-setting');
      FB.canvas.animSettings[setting] = this.checked;
    });
  });

  // Handle Advanced Settings tabs
  var advTabBtns = rp.querySelectorAll('.adv-tab-btn');
  advTabBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      var tabName = this.getAttribute('data-tab');
      var tabsContainer = this.closest('.advanced-settings-tabs');
      if (!tabsContainer) return;

      // Remove active class from all buttons and contents
      tabsContainer.querySelectorAll('.adv-tab-btn').forEach(function(b) {
        b.classList.remove('active');
      });
      tabsContainer.querySelectorAll('.adv-tab-content').forEach(function(c) {
        c.classList.remove('active');
      });

      // Add active class to clicked button and corresponding content
      btn.classList.add('active');
      var content = tabsContainer.querySelector('.adv-tab-content[data-tab="' + tabName + '"]');
      if (content) {
        content.classList.add('active');
      }
      e.preventDefault();
    });
  });

  // Handle file imports
  var fileInputs = rp.querySelectorAll('[data-handler="importJSON"]');
  fileInputs.forEach(function(input) {
    input.addEventListener('change', function() {
      if (this.files[0]) {
        FB.templates.importJSON(this.files[0]);
      }
    });
  });

  // Handle Ecommerce dynamic property fields
  var ecomFields = rp.querySelectorAll('[data-ecom-prop]');
  ecomFields.forEach(function(field) {
    field.addEventListener('change', function(e) {
      var blockId = field.getAttribute('data-block-id');
      var prop = field.getAttribute('data-ecom-prop');
      var type = field.getAttribute('data-ecom-type');
      var value = field.value;
      var block = FB.state.blocks.find(function(b) { return b.id === blockId; });

      if (!block) return;

      if (type === 'number') {
        value = parseInt(value) || 0;
      } else if (type === 'boolean') {
        value = field.checked;
      } else if (type === 'string-array') {
        // Split by newline and filter empty lines
        value = value.split('\n').filter(function(s) { return s.trim(); });
      } else if (type === 'object-array') {
        // Handle object array field updates
        var idx = parseInt(field.getAttribute('data-ecom-index'));
        var fieldName = field.getAttribute('data-ecom-field');
        var items = JSON.parse(JSON.stringify(block.props[prop] || []));
        if (items[idx]) {
          items[idx][fieldName] = value;
        }
        value = items;
      }

      FB.panels.updateProp(blockId, prop, value);
    });
  });

  // Handle video upload button
  var videoUploadBtn = rp.querySelector('#vh_upload_btn');
  if (videoUploadBtn) {
    videoUploadBtn.addEventListener('click', function(e) {
      e.preventDefault();
      var blockId = FB.state.selectedId;
      var input = document.createElement('input');
      input.type = 'file';
      input.id = 'vh_file_upload';
      input.name = 'vh_file_upload';
      input.accept = 'video/mp4,video/webm,.mp4,.webm';
      input.addEventListener('change', function() {
        var file = input.files[0];
        if (!file) return;

        // Show uploading state
        var originalText = videoUploadBtn.textContent;
        videoUploadBtn.textContent = '⏳ Uploading...';
        videoUploadBtn.disabled = true;

        var fd = new FormData();
        fd.append('file', file);

        fetch('http://localhost:3001/api/cms/media/upload', {
          method: 'POST',
          body: fd
        })
        .then(function(res) {
          console.log('Upload response status:', res.status);
          if (!res.ok) {
            throw new Error('Server returned status ' + res.status);
          }
          return res.json();
        })
        .then(function(data) {
          console.log('Upload response data:', data);
          if (data.success && data.media && data.media.url) {
            var videoUrlInput = rp.querySelector('#vh_videoUrl');
            if (videoUrlInput) {
              videoUrlInput.value = data.media.url;
              // Trigger change event to save
              var event = new Event('change', { bubbles: true });
              videoUrlInput.dispatchEvent(event);
            }
            videoUploadBtn.textContent = '✅ Uploaded!';
            setTimeout(function() {
              videoUploadBtn.textContent = originalText;
              videoUploadBtn.disabled = false;
            }, 2000);
          } else {
            console.error('Upload response missing expected fields:', data);
            videoUploadBtn.textContent = '❌ Upload failed';
            setTimeout(function() {
              videoUploadBtn.textContent = originalText;
              videoUploadBtn.disabled = false;
            }, 2000);
          }
        })
        .catch(function(err) {
          console.error('Video upload error:', err);
          var errorMsg = err.message || 'Unknown error';
          alert('Video Upload Failed\n\nError: ' + errorMsg + '\n\nAlternative methods:\n\n1. Place video in /public/videos/myfile.mp4\n   Then use: /videos/myfile.mp4\n\n2. Host on external server\n   Then use the full URL');
          videoUploadBtn.textContent = originalText;
          videoUploadBtn.disabled = false;
        });
      });
      input.click();
    });
  }
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
  if (!block || !block.props.items || idx < 0 || idx >= block.props.items.length) return;
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
  var block = FB.state.blocks.find(function (b) { return b.id === id; });
  if (!block) return;
  block.props.steps[idx][field] = val;
  FB.canvas.refreshBlock(id);
};

FB.panels.updateWorkCardField = function (id, idx, field, val) {
  var block = FB.state.blocks.find(function (b) { return b.id === id; });
  if (!block || !block.props.cards) return;
  block.props.cards[idx][field] = val;
  FB.canvas.refreshBlock(id);
};

FB.panels.updateFeatureItemField = function (id, idx, field, val) {
  var block = FB.state.blocks.find(function (b) { return b.id === id; });
  if (!block || !block.props.items) return;
  block.props.items[idx][field] = val;
  FB.canvas.refreshBlock(id);
};

FB.panels.updatePricingTierField = function (id, idx, field, val) {
  var block = FB.state.blocks.find(function (b) { return b.id === id; });
  if (!block || !block.props.tiers) return;
  block.props.tiers[idx][field] = val;
  FB.canvas.refreshBlock(id);
};

FB.panels.updatePricingTierFeatures = function (id, idx, text) {
  var block = FB.state.blocks.find(function (b) { return b.id === id; });
  if (!block || !block.props.tiers) return;
  block.props.tiers[idx].features = text.split('\n').filter(function (s) { return s.trim(); });
  FB.canvas.refreshBlock(id);
};

FB.panels.updateTeamMemberField = function (id, idx, field, val) {
  var block = FB.state.blocks.find(function (b) { return b.id === id; });
  if (!block || !block.props.members) return;
  block.props.members[idx][field] = val;
  FB.canvas.refreshBlock(id);
};

FB.panels.updatePortfolioItemField = function (id, idx, field, val) {
  var block = FB.state.blocks.find(function (b) { return b.id === id; });
  if (!block || !block.props.items) return;
  block.props.items[idx][field] = val;
  FB.canvas.refreshBlock(id);
};

FB.panels.updateResultCardField = function (id, idx, field, val) {
  var block = FB.state.blocks.find(function (b) { return b.id === id; });
  if (!block || !block.props.cards) return;
  block.props.cards[idx][field] = val;
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
  if (headerEl.dataset.acc === "theme" && isOpen) {
    var themeContent = document.getElementById("theme-panel-content");
    if (themeContent && !themeContent.innerHTML) {
      themeContent.innerHTML = FB.theme.renderPanel();
      // Initialize event listeners after rendering
      setTimeout(function() {
        FB.theme.initPanelEvents();
      }, 0);
    }
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

/**
 * Toggle a toolbar group dropdown open/closed.
 * Closes all other open groups first so only one is ever open.
 */
FB.panels.toggleGroup = function (groupId) {
  var group = document.getElementById("tb-group-" + groupId);
  if (!group) return;
  var wasOpen = group.classList.contains("open");
  // Close every open group
  document.querySelectorAll(".tb-group.open").forEach(function (g) {
    g.classList.remove("open");
  });
  // Re-open this one if it wasn't already open
  if (!wasOpen) {
    group.classList.add("open");
  }
};

document.addEventListener("click", function (e) {
  // Close export menu when clicking outside
  var menu = document.getElementById("export-menu");
  if (menu && !e.target.closest(".tb-export-wrap")) {
    menu.classList.remove("open");
  }
  // Close hamburger panel when clicking outside the centre area
  var items = document.getElementById("tb-center-items");
  if (
    items &&
    items.classList.contains("open") &&
    !e.target.closest(".tb-center")
  ) {
    items.classList.remove("open");
  }
  // Close any open toolbar group dropdowns when clicking outside them
  document.querySelectorAll(".tb-group.open").forEach(function (g) {
    if (!g.contains(e.target)) {
      g.classList.remove("open");
    }
  });
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
    '<button id="import-btn" name="import-btn" class="tb-btn" data-action="triggerImport">\uD83D\uDCE5 Import</button>' +
    '<input id="import-input" name="import-input" type="file" accept=".fwb.json,.json" style="display:none" data-handler="importJSON">' +
    '<button id="export-btn" name="export-btn" class="tb-btn" data-action="exportJSON">\uD83D\uDCE4 Export Canvas</button></div>';

  var modalTitle = document.getElementById("modal-title");
  if (modalTitle) modalTitle.textContent = "\uD83D\uDCC2 Template Manager";
  var modalTabs = document.getElementById("modal-tabs");
  if (modalTabs) modalTabs.style.display = "none";
  var codeOutput = document.getElementById("code-output");
  if (codeOutput && codeOutput.parentElement) codeOutput.parentElement.innerHTML = html;
  var overlay = document.getElementById("modal-overlay");
  if (overlay) overlay.classList.add("open");

  // Initialize event listeners for template manager actions
  setTimeout(function() {
    var modal = document.getElementById("modal-overlay");
    if (!modal) return;
    var importBtn = modal.querySelector('button[data-action="triggerImport"]');
    var exportBtn = modal.querySelector('button[data-action="exportJSON"]');
    var fileInput = modal.querySelector('input[data-handler="importJSON"]');

    if (importBtn) {
      importBtn.addEventListener('click', function(e) {
        var importInput = document.getElementById('import-input');
        if (importInput) importInput.click();
        e.preventDefault();
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', function(e) {
        FB.templates.exportJSON();
        e.preventDefault();
      });
    }

    if (fileInput) {
      fileInput.addEventListener('change', function() {
        if (this.files[0]) {
          FB.templates.importJSON(this.files[0]);
        }
      });
    }
  }, 0);
};

FB.panels.openSettings = function () {
  var s = FB.canvas.animSettings;
  var checked = function (key) {
    return s[key] ? "checked" : "";
  };
  var html =
    '<div class="modal-head"><h3>Animation Settings</h3><button class="modal-close" data-action="closeModal">\u2715</button></div>' +
    '<div style="padding:20px;display:flex;flex-direction:column;gap:4px">' +
    '<div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px">Toggle Animations</div>' +
    '<label style="display:flex;align-items:center;gap:10px;padding:8px 0;cursor:pointer"><input id="anim_cursor" name="anim_cursor" type="checkbox" ' +
    checked("cursor") +
    ' data-anim-setting="cursor"> <span style="font-size:13px">Custom cursor</span></label>' +
    '<label style="display:flex;align-items:center;gap:10px;padding:8px 0;cursor:pointer"><input id="anim_heroReveal" name="anim_heroReveal" type="checkbox" ' +
    checked("heroReveal") +
    ' data-anim-setting="heroReveal"> <span style="font-size:13px">Hero entrance reveal</span></label>' +
    '<label style="display:flex;align-items:center;gap:10px;padding:8px 0;cursor:pointer"><input id="anim_parallax" name="anim_parallax" type="checkbox" ' +
    checked("parallax") +
    ' data-anim-setting="parallax"> <span style="font-size:13px">Hero blob parallax</span></label>' +
    '<label style="display:flex;align-items:center;gap:10px;padding:8px 0;cursor:pointer"><input id="anim_testimonialAuto" name="anim_testimonialAuto" type="checkbox" ' +
    checked("testimonialAuto") +
    ' data-anim-setting="testimonialAuto"> <span style="font-size:13px">Testimonial auto-rotate</span></label>' +
    '<label style="display:flex;align-items:center;gap:10px;padding:8px 0;cursor:pointer"><input id="anim_entrances" name="anim_entrances" type="checkbox" ' +
    checked("entrances") +
    ' data-anim-setting="entrances"> <span style="font-size:13px">Scroll reveal entrances</span></label>' +
    '<div style="border-top:1px solid var(--border);margin:12px 0;padding-top:12px">' +
    '<div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px">Speed</div>' +
    '<div style="display:flex;align-items:center;gap:12px"><span style="font-size:11px;color:var(--text-muted)">0.25x</span>' +
    '<input id="fw-speed-input" name="fw-speed-input" type="range" min="0.25" max="2" step="0.25" value="' +
    s.speed +
    '" style="flex:1" data-anim-speed-control="true">' +
    '<span style="font-size:11px;color:var(--text-muted)" id="fw-speed-label">' +
    s.speed +
    "x</span></div></div>" +
    '<div style="display:flex;gap:8px;margin-top:16px"><button class="tb-btn" data-action="closeSettings">Close</button></div>' +
    "</div>";

  var mt = document.getElementById("modal-title");
  if (mt) mt.textContent = "Settings";
  var tabs = document.getElementById("modal-tabs");
  if (tabs) tabs.style.display = "none";
  var co = document.getElementById("code-output");
  if (co && co.parentElement) co.parentElement.innerHTML = html;
  var overlay = document.getElementById("modal-overlay");
  if (overlay) overlay.classList.add("open");

  // Initialize event listeners for modal controls
  setTimeout(function() {
    var speedInput = document.getElementById("fw-speed-input");
    if (speedInput) {
      speedInput.addEventListener('input', function(e) {
        FB.canvas.animSettings.speed = parseFloat(this.value);
        var label = document.getElementById('fw-speed-label');
        if (label) {
          label.textContent = this.value + 'x';
        }
      });
    }

    // Handle close buttons
    var closeBtn = document.querySelector('button[data-action="closeModal"]');
    if (closeBtn) {
      closeBtn.addEventListener('click', function(e) {
        FB.export.close();
        e.preventDefault();
      });
    }

    var closeSettingsBtn = document.querySelector('button[data-action="closeSettings"]');
    if (closeSettingsBtn) {
      closeSettingsBtn.addEventListener('click', function(e) {
        FB.export.close();
        e.preventDefault();
      });
    }
  }, 0);
};

// Helper for widget edit panels
FB.panels._getWidgetProp = function (blockId, key) {
  var block = FB.state.blocks.find(function (b) {
    return b.id === blockId;
  });
  return block ? block.props[key] : undefined;
};

FB.panels.getWidgetProp = function (blockId, key) {
  return FB.panels._getWidgetProp(blockId, key);
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
    })
    .catch(function (err) {
      console.error("[loadBuilderDesigns] Error:", err);
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
    })
    .catch(function (err) {
      console.error("[insertDesignBlock] Error:", err);
      FB.util.showToast("Error loading design");
    });
};

// ── Left Panel Search ──
FB.panels._searchTimeout = null;

FB.panels.filterBlocks = function (el) {
  var val = (el && el.value) || "";
  var query = val.toLowerCase().trim();
  var clearBtn = document.getElementById("lp-search-clear");
  if (clearBtn) clearBtn.style.display = query ? "block" : "none";

  var containers = ["#left-panel", "#ds-left-panel"];
  containers.forEach(function (sel) {
    var c = document.querySelector(sel);
    if (!c) return;
    var allItems = c.querySelectorAll(".block-item");
    var allSections = c.querySelectorAll(".section-header");
    if (!query) {
      allItems.forEach(function (it) {
        it.classList.remove("lp-search-hidden", "lp-search-match");
      });
      allSections.forEach(function (it) {
        it.classList.remove("lp-search-hidden");
      });
      return;
    }
    allItems.forEach(function (it) {
      var txt = it.textContent.toLowerCase();
      var label = it.querySelector(".block-label");
      var sub = it.querySelector(".block-sublabel");
      var m1 = label
        ? label.textContent.toLowerCase().indexOf(query) !== -1
        : false;
      var m2 = sub
        ? sub.textContent.toLowerCase().indexOf(query) !== -1
        : false;
      if (m1 || m2 || txt.indexOf(query) !== -1) {
        it.classList.remove("lp-search-hidden");
        it.classList.add("lp-search-match");
      } else {
        it.classList.add("lp-search-hidden");
        it.classList.remove("lp-search-match");
      }
    });
    allSections.forEach(function (sec) {
      var nxt = sec.nextElementSibling;
      var ok = false;
      while (
        nxt &&
        !nxt.classList.contains("section-header") &&
        !nxt.classList.contains("lp-acc-header")
      ) {
        if (nxt.classList && !nxt.classList.contains("lp-search-hidden")) {
          ok = true;
          break;
        }
        nxt = nxt.nextElementSibling;
      }
      sec.classList.toggle("lp-search-hidden", !ok);
    });
  });
};

FB.panels.clearSearch = function () {
  var inp = document.getElementById("lp-search-input");
  if (inp) inp.value = "";
  FB.panels.filterBlocks("");
};

/* ── PHASE 2: GENERATIVE VARIATIONS ── */
FB.panels._variationTrail = [];

FB.panels.showVariations = function (blockId) {
  var block = FB.state.blocks.find(function (b) { return b.id === blockId; });
  if (!block) return;

  // Remove existing overlay
  FB.panels.hideVariations();

  var el = document.querySelector('.canvas-block[data-id="' + blockId + '"]');
  if (!el) return;

  var overlay = document.createElement("div");
  overlay.className = "variations-overlay";
  overlay.id = "variations-overlay";

  var header = document.createElement("div");
  header.className = "variations-header";
  header.innerHTML = '<span class="variations-title">\u2726 Surprise Me</span><button class="variations-close">\u2715</button>';
  overlay.appendChild(header);

  var grid = document.createElement("div");
  grid.className = "variations-grid";

  var variants = FB.panels._generateVariations(block);
  variants.forEach(function (v, i) {
    var card = document.createElement("div");
    card.className = "variation-card";
    card.innerHTML = '<span class="var-label">' + v.name + "</span>" +
      '<span class="var-props">' + v.description + "</span>";
    card.addEventListener("click", function () {
      FB.panels._applyVariation(blockId, v.props);
    });
    grid.appendChild(card);
  });

  overlay.appendChild(grid);

  // Position overlay near the block
  var rect = el.getBoundingClientRect();
  var canvasRect = document.getElementById("canvas").getBoundingClientRect();
  overlay.style.top = (rect.bottom - canvasRect.top + 10) + "px";
  overlay.style.left = (rect.left - canvasRect.left) + "px";

  document.getElementById("canvas").appendChild(overlay);

  header.querySelector(".variations-close").addEventListener("click", function (e) {
    e.stopPropagation();
    FB.panels.hideVariations();
  });
};

FB.panels.hideVariations = function () {
  var existing = document.getElementById("variations-overlay");
  if (existing) existing.remove();
};

FB.panels._generateVariations = function (block) {
  var p = block.props;
  var variations = [];
  var configs = [
    { name: "Airy", padMult: 1.4, radius: 12, bw: 0, alpha: 0.9 },
    { name: "Dense", padMult: 0.6, radius: 2, bw: 2, alpha: 1 },
    { name: "Soft", padMult: 1.1, radius: 20, bw: 0, alpha: 0.85 },
    { name: "Sharp", padMult: 0.9, radius: 0, bw: 3, alpha: 1 },
  ];

  configs.forEach(function (cfg) {
    var padV = Math.round((p._paddingV !== undefined ? p._paddingV : 32) * cfg.padMult);
    var padH = Math.round((p._paddingH !== undefined ? p._paddingH : 32) * cfg.padMult);
    padV = Math.max(0, Math.min(160, padV));
    padH = Math.max(0, Math.min(120, padH));

    var desc = "pad " + padV + "px / rad " + cfg.radius + "px";
    if (cfg.bw > 0) desc += " / border " + cfg.bw + "px";

    variations.push({
      name: cfg.name,
      description: desc,
      props: {
        _paddingV: padV,
        _paddingH: padH,
        _borderRadius: cfg.radius,
        _borderWidth: cfg.bw,
        _bgAlpha: cfg.alpha,
      },
    });
  });

  return variations;
};

FB.panels._applyVariation = function (blockId, variantProps) {
  var block = FB.state.blocks.find(function (b) { return b.id === blockId; });
  if (!block) return;

  // Save current state to trail
  FB.panels._variationTrail.push({
    id: blockId,
    props: JSON.parse(JSON.stringify(block.props)),
    timestamp: Date.now(),
  });
  if (FB.panels._variationTrail.length > 10) {
    FB.panels._variationTrail.shift();
  }

  FB.state.saveHistory();
  Object.assign(block.props, variantProps);
  FB.canvas.refreshBlock(blockId);
  FB.panels.renderRightPanel();
  FB.panels.hideVariations();
  FB.panels._showVariationTrail();
};

FB.panels._showVariationTrail = function () {
  var trail = document.getElementById("variation-trail");
  if (!trail) {
    trail = document.createElement("div");
    trail.className = "variation-trail";
    trail.id = "variation-trail";
    document.body.appendChild(trail);
  }

  var html = '<span class="variation-trail-label">\u2190 Trail</span>';
  FB.panels._variationTrail.forEach(function (item, i) {
    var time = new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    html += '<span class="trail-chip" data-trail-index="' + i + '">' + time + "</span>";
  });
  trail.innerHTML = html;
  trail.classList.add("open");

  trail.querySelectorAll(".trail-chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var idx = parseInt(this.getAttribute("data-trail-index"));
      FB.panels._restoreFromTrail(idx);
    });
  });

  // Auto-hide after 8 seconds
  clearTimeout(FB.panels._trailTimeout);
  FB.panels._trailTimeout = setTimeout(function () {
    trail.classList.remove("open");
  }, 8000);
};

FB.panels._restoreFromTrail = function (index) {
  var item = FB.panels._variationTrail[index];
  if (!item) return;
  var block = FB.state.blocks.find(function (b) { return b.id === item.id; });
  if (!block) return;

  FB.state.saveHistory();
  block.props = JSON.parse(JSON.stringify(item.props));
  FB.canvas.refreshBlock(item.id);
  FB.panels.renderRightPanel();
};

/* ── PHASE 2: CASCADE LINKING ── */
FB.panels._cascadeLinks = {};

FB.panels.renderCascadeLink = function (propKey, labelText) {
  var isLinked = !!(FB.panels._cascadeLinks[propKey]);
  return '<button class="cascade-link-btn ' + (isLinked ? "linked" : "") + '" data-cascade="' + propKey + '" title="Link related properties">' +
    (isLinked ? "\u1F517" : "\u26D3") + "</button>";
};

FB.panels.toggleCascadeLink = function (propKey) {
  if (FB.panels._cascadeLinks[propKey]) {
    delete FB.panels._cascadeLinks[propKey];
  } else {
    FB.panels._cascadeLinks[propKey] = true;
  }
  FB.panels.renderRightPanel();
};

FB.panels.applyCascade = function (blockId, changedProp, newValue) {
  var links = FB.panels._cascadeLinks;
  var block = FB.state.blocks.find(function (b) { return b.id === blockId; });
  if (!block) return;

  var p = block.props;

  // Padding cascade: V and H linked
  if ((changedProp === "_paddingV" || changedProp === "_paddingH") && links._paddingV && links._paddingH) {
    if (changedProp === "_paddingV") p._paddingH = newValue;
    else p._paddingV = newValue;
  }

  // Border cascade: radius and width linked
  if ((changedProp === "_borderRadius" || changedProp === "_borderWidth") && links._borderRadius && links._borderWidth) {
    if (changedProp === "_borderRadius") p._borderWidth = Math.max(0, Math.min(12, Math.round(newValue / 4)));
    else p._borderRadius = Math.max(0, Math.min(40, newValue * 4));
  }

  // Opacity cascade
  if ((changedProp === "_opacity" || changedProp === "_bgAlpha") && links._opacity && links._bgAlpha) {
    if (changedProp === "_opacity") p._bgAlpha = newValue;
    else p._opacity = newValue;
  }

  FB.canvas.refreshBlock(blockId);
};

/* ── PHASE 3: SCROLL-STATE MACHINE ── */
FB.panels._scrollStateActiveStop = "enter";

FB.panels.renderScrollStateSection = function (blockId, p) {
  var states = p._scrollStates || {};
  var enter = states.enter || {};
  var center = states.center || {};
  var exit = states.exit || {};

  var active = FB.panels._scrollStateActiveStop;
  var activeState = states[active] || {};

  var html = '<div class="scroll-state-timeline">' +
    '<div class="scroll-state-track"><div class="scroll-state-playhead" style="left:' + (active === "enter" ? "0%" : active === "center" ? "50%" : "100%") + '"></div></div>' +
    '<div class="scroll-state-stops">' +
    '<div class="scroll-state-stop ' + (active === "enter" ? "active" : "") + '" data-ss-stop="enter"><div class="ss-label">Enter</div></div>' +
    '<div class="scroll-state-stop ' + (active === "center" ? "active" : "") + '" data-ss-stop="center"><div class="ss-label">Center</div></div>' +
    '<div class="scroll-state-stop ' + (active === "exit" ? "active" : "") + '" data-ss-stop="exit"><div class="ss-label">Exit</div></div>' +
    '</div></div>' +
    '<div class="scroll-state-controls">' +
    '<div class="ss-row"><label for="ss_padding_' + active + '">Padding Override</label><input type="range" min="0" max="160" step="4" value="' + (activeState._paddingV !== undefined ? activeState._paddingV : 0) + '" id="ss_padding_' + active + '" name="ss_padding_' + active + '" data-ss-prop="_paddingV" data-ss-stop="' + active + '" data-block-id="' + blockId + '"></div>' +
    '<div class="ss-row"><label for="ss_opacity_' + active + '">Opacity Override</label><input type="range" min="0" max="1" step="0.05" value="' + (activeState._opacity !== undefined ? activeState._opacity : 1) + '" id="ss_opacity_' + active + '" name="ss_opacity_' + active + '" data-ss-prop="_opacity" data-ss-stop="' + active + '" data-block-id="' + blockId + '"></div>' +
    '<div class="ss-row"><label for="ss_translate_' + active + '">Translate Y</label><input type="range" min="-200" max="200" step="10" value="' + (activeState._translateY !== undefined ? activeState._translateY : 0) + '" id="ss_translate_' + active + '" name="ss_translate_' + active + '" data-ss-prop="_translateY" data-ss-stop="' + active + '" data-block-id="' + blockId + '"></div>' +
    '</div>';
  return html;
};

FB.panels.initScrollStateEvents = function () {
  var rp = document.getElementById("rp-content");
  if (!rp) return;

  // Stop switching
  var stops = rp.querySelectorAll("[data-ss-stop]");
  stops.forEach(function (stop) {
    if (stop.tagName === "DIV" && stop.classList.contains("scroll-state-stop")) {
      stop.addEventListener("click", function () {
        FB.panels._scrollStateActiveStop = this.getAttribute("data-ss-stop");
        FB.panels.renderRightPanel();
      });
    }
  });

  // Property changes
  var inputs = rp.querySelectorAll("[data-ss-prop]");
  inputs.forEach(function (inp) {
    inp.addEventListener("change", function () {
      var blockId = this.getAttribute("data-block-id");
      var stop = this.getAttribute("data-ss-stop");
      var prop = this.getAttribute("data-ss-prop");
      var val = parseFloat(this.value);

      var block = FB.state.blocks.find(function (b) { return b.id === blockId; });
      if (!block) return;
      if (!block.props._scrollStates) block.props._scrollStates = {};
      if (!block.props._scrollStates[stop]) block.props._scrollStates[stop] = {};
      block.props._scrollStates[stop][prop] = val;
      FB.state.saveHistory();
      FB.canvas.refreshBlock(blockId);
    });
  });
};

/* ── PHASE 4: PROMPT-TO-WIDGET ── */
FB.panels._promptSpells = [
  { name: "Make Premium", icon: "\u2726", desc: "Larger padding, tighter radius, subtle alpha", apply: function (p) {
    p._paddingV = Math.min(160, (p._paddingV || 32) + 24);
    p._paddingH = Math.min(120, (p._paddingH || 32) + 20);
    p._borderRadius = Math.min(40, (p._borderRadius || 0) + 4);
    p._bgAlpha = Math.max(0.8, (p._bgAlpha !== undefined ? p._bgAlpha : 1));
  }},
  { name: "Brutalist", icon: "\u25A0", desc: "Zero radius, heavy border, high contrast", apply: function (p) {
    p._borderRadius = 0;
    p._borderWidth = Math.min(12, (p._borderWidth || 0) + 3);
    p._paddingV = Math.max(16, (p._paddingV || 32) - 8);
  }},
  { name: "Glassmorphism", icon: "\u25A1", desc: "Low alpha, high radius, soft border", apply: function (p) {
    p._bgAlpha = 0.65;
    p._borderRadius = Math.max(12, p._borderRadius || 0);
    p._borderWidth = Math.max(1, p._borderWidth || 0);
    p._opacity = 1;
  }},
  { name: "Minimal", icon: "\u2212", desc: "Strip back: zero padding, no border, full alpha", apply: function (p) {
    p._paddingV = 0;
    p._paddingH = 0;
    p._borderRadius = 0;
    p._borderWidth = 0;
    p._bgAlpha = 1;
  }},
  { name: "Cyber Glow", icon: "\u26A1", desc: "Neon border, high radius, dark alpha", apply: function (p) {
    p._borderWidth = Math.max(2, p._borderWidth || 0);
    p._borderRadius = Math.max(8, p._borderRadius || 0);
    p._bgAlpha = 0.8;
  }},
  { name: "Editorial", icon: "\u25B6", desc: "Generous spacing, refined radius", apply: function (p) {
    p._paddingV = Math.min(160, Math.max(48, p._paddingV || 32) + 16);
    p._paddingH = Math.min(120, Math.max(32, p._paddingH || 32) + 12);
    p._borderRadius = 2;
    p._bgAlpha = 0.95;
  }},
];

FB.panels.renderPromptWidget = function (blockId) {
  var html = '<div style="padding:10px 14px;border-top:1px solid var(--border);background:rgba(205,254,0,0.02)">' +
    '<div style="font-size:11px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">\u2726 Cast a Spell</div>' +
    '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">';
  FB.panels._promptSpells.forEach(function (spell, i) {
    html += '<button class="rp-btn" style="font-size:10px;padding:4px 8px;border-radius:4px;flex:1;min-width:80px" data-spell-index="' + i + '" data-block-id="' + blockId + '">' + spell.icon + " " + spell.name + "</button>";
  });
  html += '</div>' +
    '<div style="position:relative">' +
    '<input type="text" placeholder="Or type a command... (e.g. make it feel softer)" style="width:100%;font-size:11px;padding:6px 10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;color:#fff;box-sizing:border-box" id="prompt-widget-input" name="prompt-widget-input" data-block-id="' + blockId + '">' +
    '<button type="button" style="position:absolute;right:4px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--accent);cursor:pointer;font-size:12px;padding:2px 6px" id="prompt-widget-send">\u27A4</button>' +
    '</div></div>';
  return html;
};

FB.panels.initPromptWidgetEvents = function () {
  var rp = document.getElementById("rp-content");
  if (!rp) return;

  var spellBtns = rp.querySelectorAll("[data-spell-index]");
  spellBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var idx = parseInt(this.getAttribute("data-spell-index"));
      var blockId = this.getAttribute("data-block-id");
      FB.panels.castSpell(blockId, idx);
    });
  });

  var input = document.getElementById("prompt-widget-input");
  var sendBtn = document.getElementById("prompt-widget-send");
  if (input && sendBtn) {
    sendBtn.addEventListener("click", function () {
      var blockId = input.getAttribute("data-block-id");
      FB.panels.handlePromptCommand(blockId, input.value);
      input.value = "";
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var blockId = input.getAttribute("data-block-id");
        FB.panels.handlePromptCommand(blockId, input.value);
        input.value = "";
      }
    });
  }
};

FB.panels.castSpell = function (blockId, spellIndex) {
  var block = FB.state.blocks.find(function (b) { return b.id === blockId; });
  if (!block) return;
  var spell = FB.panels._promptSpells[spellIndex];
  if (!spell) return;

  FB.state.saveHistory();

  // Animate the transition
  var el = document.querySelector('.canvas-block[data-id="' + blockId + '"]');
  if (el) {
    el.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
    el.style.opacity = "0.6";
    setTimeout(function () {
      spell.apply(block.props);
      FB.canvas.refreshBlock(blockId);
      FB.panels.renderRightPanel();
      setTimeout(function () {
        if (el) el.style.opacity = "";
      }, 100);
    }, 150);
  } else {
    spell.apply(block.props);
    FB.canvas.refreshBlock(blockId);
    FB.panels.renderRightPanel();
  }

  FB.util.showToast("Spell cast: " + spell.name);
};

FB.panels.handlePromptCommand = function (blockId, text) {
  if (!text || !text.trim()) return;
  var block = FB.state.blocks.find(function (b) { return b.id === blockId; });
  if (!block) return;

  text = text.toLowerCase();
  FB.state.saveHistory();

  var matched = false;
  FB.panels._promptSpells.forEach(function (spell, i) {
    if (text.indexOf(spell.name.toLowerCase()) !== -1) {
      FB.panels.castSpell(blockId, i);
      matched = true;
    }
  });

  if (!matched) {
    // Fuzzy matching based on keywords
    if (text.indexOf("soft") !== -1 || text.indexOf("gentle") !== -1) {
      block.props._borderRadius = Math.max(12, block.props._borderRadius || 0);
      block.props._borderWidth = 0;
      block.props._bgAlpha = 0.9;
    } else if (text.indexOf("hard") !== -1 || text.indexOf("sharp") !== -1 || text.indexOf("brutal") !== -1) {
      block.props._borderRadius = 0;
      block.props._borderWidth = Math.max(3, block.props._borderWidth || 0);
    } else if (text.indexOf("big") !== -1 || text.indexOf("large") !== -1 || text.indexOf("spacious") !== -1) {
      block.props._paddingV = Math.min(160, (block.props._paddingV || 32) + 40);
      block.props._paddingH = Math.min(120, (block.props._paddingH || 32) + 32);
    } else if (text.indexOf("small") !== -1 || text.indexOf("tight") !== -1 || text.indexOf("compact") !== -1) {
      block.props._paddingV = Math.max(0, (block.props._paddingV || 32) - 16);
      block.props._paddingH = Math.max(0, (block.props._paddingH || 32) - 16);
    } else if (text.indexOf("glow") !== -1 || text.indexOf("neon") !== -1 || text.indexOf("cyber") !== -1) {
      block.props._borderWidth = Math.max(2, block.props._borderWidth || 0);
      block.props._borderRadius = Math.max(8, block.props._borderRadius || 0);
    } else if (text.indexOf("clear") !== -1 || text.indexOf("reset") !== -1) {
      block.props._paddingV = 0;
      block.props._paddingH = 0;
      block.props._borderRadius = 0;
      block.props._borderWidth = 0;
      block.props._bgAlpha = 1;
      block.props._opacity = 1;
    } else {
      FB.util.showToast("Try: soft, brutal, big, small, glow, clear");
      return;
    }
    FB.canvas.refreshBlock(blockId);
    FB.panels.renderRightPanel();
    FB.util.showToast("Applied: " + text);
  }
};
