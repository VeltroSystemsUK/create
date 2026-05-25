// ── VELTRO CREATIVE ENGINE WIDGETS ──
// Physics, WebGL, Kinetic Typography, Cursor Lens

// ── Global mouse tracking (shared by kinetic typography + cursor lens) ──
if (!window._VeltroMouse) {
  window._VeltroMouse = { x: 0, y: 0 };
  document.addEventListener("mousemove", function (e) {
    window._VeltroMouse.x = e.clientX;
    window._VeltroMouse.y = e.clientY;
    document.documentElement.style.setProperty("--mouse-x", e.clientX + "px");
    document.documentElement.style.setProperty("--mouse-y", e.clientY + "px");
    // Drive any active kinetic text elements
    document
      .querySelectorAll("[data-kinetic-mode='proximity']")
      .forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        var maxDist = +el.dataset.kineticRadius || 300;
        var minW = +el.dataset.kineticMinWeight || 100;
        var maxW = +el.dataset.kineticMaxWeight || 900;
        var weight = Math.round(
          Math.max(
            minW,
            Math.min(maxW, maxW - (dist / maxDist) * (maxW - minW)),
          ),
        );
        el.style.fontVariationSettings = "'wght' " + weight;
        el.style.fontWeight = weight;
      });
    // Drive cursor lens overlays
    document.querySelectorAll(".veltro-lens-mask").forEach(function (mask) {
      var parent = mask.closest(".veltro-lens-wrap");
      if (!parent) return;
      var rect = parent.getBoundingClientRect();
      var lx = e.clientX - rect.left;
      var ly = e.clientY - rect.top;
      mask.style.setProperty("--lx", lx + "px");
      mask.style.setProperty("--ly", ly + "px");
    });
  });
}

// ── Matter.js lazy loader ──
window._VeltroMatterReady = false;
window._VeltroMatterCallbacks = [];
window._VeltroLoadMatter = function (cb) {
  if (window.Matter) {
    cb(window.Matter);
    return;
  }
  if (window._VeltroMatterCallbacks.length === 0) {
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js";
    s.onload = function () {
      window._VeltroMatterCallbacks.forEach(function (fn) {
        fn(window.Matter);
      });
      window._VeltroMatterCallbacks = [];
    };
    document.head.appendChild(s);
  }
  window._VeltroMatterCallbacks.push(cb);
};

// ── 1. KINETIC TYPOGRAPHY ──
FB.widgets.register("kineticText", {
  label: "Kinetic Text",
  sublabel: "Variable font",
  icon: "K",
  iconBg: "#0d0d1a",
  iconColor: "#cdfe00",
  category: "veltro",
  subCategory: "typography",
  defaultProps: {
    text: "MOVE CLOSER",
    tag: "h2",
    mode: "proximity",
    color: "#111111",
    size: 56,
    weight: 400,
    minWeight: 100,
    maxWeight: 900,
    radius: 300,
    fontFamily: "Inter",
    letterSpacing: -2,
    align: "center",
    // Universal Advanced Options
    bgType: "solid",
    bgColor: "transparent",
    bgGradientDir: "135deg",
    bgGradientColor1: "#cdfe00",
    bgGradientColor2: "#3b82f6",
    bgImage: "",
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "#cdfe00",
    borderStyle: "solid",
    paddingV: 24,
    paddingH: 24,
    marginV: 0,
    marginH: 0,
    boxShadow: false,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowBlur: 10,
    shadowSpread: 0,
    opacity: 100,
    entranceAnim: "none",
    animDuration: 600,
    animDelay: 0,
    hoverEffect: "none",
    hoverScale: 1.02,
    hoverTransition: 300,
    // Widget-Specific Advanced Enhancements
    gradientText: false,
    gradientTextColor1: "#cdfe00",
    gradientTextColor2: "#3b82f6",
    gradientTextDir: "135deg",
    textTransform: "none",
    textShadow: false,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowBlur: 4,
    textShadowOffsetX: 2,
    textShadowOffsetY: 2,
    glowEffect: false,
    glowColor: "#cdfe00",
    glowSize: 15,
    lineHeight: 1.1,
    charAnimation: "none",
    charAnimationSpeed: 1,
    splitBy: "none",
  },
  render: function (p) {
    var tag = p.tag || "h2";
    var font = p.fontFamily || "Inter";
    var mode = p.mode || "proximity";

    // Build container background
    var containerBg = "";
    if (p.bgType === "gradient") {
      containerBg =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#cdfe00") +
        "," +
        (p.bgGradientColor2 || "#3b82f6") +
        ");";
    } else if (p.bgType === "image" && p.bgImage) {
      containerBg = "background:url(" + p.bgImage + ") center/cover;";
    } else if (p.bgColor && p.bgColor !== "transparent") {
      containerBg = "background:" + p.bgColor + ";";
    }

    // Build container border
    var containerBorder = "";
    if (p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px " +
        (p.borderStyle || "solid") +
        " " +
        (p.borderColor || "#cdfe00") +
        ";";
    }

    // Build container shadow
    var containerShadow = "";
    if (p.boxShadow) {
      var sx = p.shadowSpread || 0;
      containerShadow =
        "box-shadow:0 " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowBlur || 10) * 2 +
        "px " +
        sx +
        "px " +
        (p.shadowColor || "rgba(0,0,0,0.3)") +
        ";";
    }

    // Build hover effect
    var hoverClass = "";
    var hoverStyle = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
      if (p.hoverEffect === "scale") {
        hoverStyle =
          "transition:transform " + (p.hoverTransition || 300) + "ms ease;";
      } else if (p.hoverEffect === "lift") {
        hoverStyle =
          "transition:transform " +
          (p.hoverTransition || 300) +
          "ms ease,box-shadow " +
          (p.hoverTransition || 300) +
          "ms ease;";
      } else if (p.hoverEffect === "glow") {
        hoverStyle =
          "transition:filter " + (p.hoverTransition || 300) + "ms ease;";
      } else {
        hoverStyle =
          "transition:all " + (p.hoverTransition || 300) + "ms ease;";
      }
    }

    // Build entrance animation
    var animClass = "";
    var animStyle = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
      animStyle =
        "animation-duration:" +
        (p.animDuration || 600) +
        "ms;animation-delay:" +
        (p.animDelay || 0) +
        "ms;animation-fill-mode:both;";
    }

    // Build text colour (solid or gradient)
    var textColor = "";
    if (p.gradientText) {
      textColor =
        "background:linear-gradient(" +
        (p.gradientTextDir || "135deg") +
        "," +
        (p.gradientTextColor1 || "#cdfe00") +
        "," +
        (p.gradientTextColor2 || "#3b82f6") +
        ");-webkit-background-clip:text;background-clip:text;color:transparent;";
    } else {
      textColor = "color:" + (p.color || "#111") + ";";
    }

    // Build text shadow
    var textShadowStyle = "";
    if (p.textShadow) {
      textShadowStyle =
        "text-shadow:" +
        (p.textShadowOffsetX || 2) +
        "px " +
        (p.textShadowOffsetY || 2) +
        "px " +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowColor || "rgba(0,0,0,0.5)") +
        ";";
    }

    // Build glow effect
    var glowStyle = "";
    if (p.glowEffect) {
      glowStyle =
        "filter:drop-shadow(0 0 " +
        (p.glowSize || 15) +
        "px " +
        (p.glowColor || "#cdfe00") +
        ");";
    }

    // Build text transform
    var textTransformStyle = "";
    if (p.textTransform && p.textTransform !== "none") {
      textTransformStyle = "text-transform:" + p.textTransform + ";";
    }

    // Build container style
    var containerStyle =
      containerBg +
      containerBorder +
      containerShadow +
      hoverStyle +
      animStyle +
      "border-radius:" +
      (p.borderRadius || 8) +
      "px;" +
      "padding:" +
      (p.paddingV || 24) +
      "px " +
      (p.paddingH || 24) +
      "px;" +
      "margin:" +
      (p.marginV || 0) +
      "px " +
      (p.marginH || 0) +
      "px;" +
      "opacity:" +
      (p.opacity || 100) / 100 +
      ";" +
      "overflow:hidden;position:relative;";

    // Build text style
    var textStyle =
      "text-align:" +
      (p.align || "center") +
      ";" +
      textColor +
      "font-size:" +
      (p.size || 56) +
      "px;" +
      "font-weight:" +
      (p.weight || 400) +
      ";" +
      "letter-spacing:" +
      (p.letterSpacing !== undefined ? p.letterSpacing : -2) +
      "px;" +
      "line-height:" +
      (p.lineHeight || 1.1) +
      ";" +
      "margin:0;" +
      "transition:font-variation-settings 0.1s,font-weight 0.1s;" +
      "font-family:'" +
      font +
      "',sans-serif;" +
      textShadowStyle +
      glowStyle +
      textTransformStyle;

    // Build text content with optional split animation
    var textContent = p.text || "";
    if (
      p.splitBy &&
      p.splitBy !== "none" &&
      p.charAnimation &&
      p.charAnimation !== "none"
    ) {
      var chars = [];
      if (p.splitBy === "char") {
        chars = textContent.split("");
      } else if (p.splitBy === "word") {
        chars = textContent.split(" ");
      } else if (p.splitBy === "line") {
        chars = textContent.split("\n");
      }
      textContent = chars
        .map(function (c, i) {
          var delay = i * (0.1 / (p.charAnimationSpeed || 1));
          var animName = "veltro-char-" + p.charAnimation;
          return (
            '<span style="display:inline-block;animation:' +
            animName +
            " 0.6s ease " +
            delay +
            's both">' +
            (p.splitBy === "word" && i < chars.length - 1 ? c + " " : c) +
            "</span>"
          );
        })
        .join("");
    }

    if (mode === "scroll") {
      textStyle += "display:block;";
      return (
        '<div class="veltro-kinetic-container' +
        animClass +
        hoverClass +
        '" style="' +
        containerStyle +
        '">' +
        "<" +
        tag +
        ' class="veltro-kinetic-scroll" data-kinetic-mode="scroll"' +
        ' data-base-weight="' +
        (p.weight || 400) +
        '"' +
        ' data-min-weight="' +
        (p.minWeight || 100) +
        '"' +
        ' data-max-weight="' +
        (p.maxWeight || 900) +
        '"' +
        ' style="' +
        textStyle +
        '" contenteditable data-field="text">' +
        textContent +
        "</" +
        tag +
        "></div>"
      );
    }
    if (mode === "path") {
      var pathId = "kt-path-" + Date.now();
      var pathD = p.pathCurve || "M 0 150 Q 150 0 300 100 Q 450 200 600 50";
      return (
        '<div class="veltro-kinetic-container' +
        animClass +
        hoverClass +
        '" style="' +
        containerStyle +
        'text-align:center">' +
        '<svg viewBox="0 0 600 200" style="width:100%;max-width:600px;overflow:visible">' +
        "<defs>" +
        '<path id="' +
        pathId +
        '" d="' +
        pathD +
        '"/>' +
        "</defs>" +
        "<text font-family=\"'" +
        font +
        '\',sans-serif" font-size="' +
        (p.size || 40) +
        '"' +
        ' font-weight="' +
        (p.weight || 400) +
        '" ' +
        (p.gradientText
          ? 'fill="url(#kt-grad-' + pathId + ')"'
          : 'fill="' + (p.color || "#111") + '"') +
        ">" +
        (p.gradientText
          ? '<defs><linearGradient id="kt-grad-' +
            pathId +
            '" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:' +
            (p.gradientTextColor1 || "#cdfe00") +
            '"/><stop offset="100%" style="stop-color:' +
            (p.gradientTextColor2 || "#3b82f6") +
            '"/></linearGradient></defs>'
          : "") +
        '<textPath href="#' +
        pathId +
        '" startOffset="0%">' +
        textContent +
        "</textPath></text></svg></div>"
      );
    }
    // Default: proximity mode
    return (
      '<div class="veltro-kinetic-container' +
      animClass +
      hoverClass +
      '" style="' +
      containerStyle +
      '">' +
      "<" +
      tag +
      ' class="veltro-kinetic-prox" data-kinetic-mode="proximity"' +
      ' data-kinetic-radius="' +
      (p.radius || 300) +
      '"' +
      ' data-kinetic-min-weight="' +
      (p.minWeight || 100) +
      '"' +
      ' data-kinetic-max-weight="' +
      (p.maxWeight || 900) +
      '"' +
      ' style="' +
      textStyle +
      '" contenteditable data-field="text">' +
      textContent +
      "</" +
      tag +
      "></div>"
    );
  },
  editPanel: function (id, p) {
    var html = "";

    // ── Core Typography Controls ──
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Typography</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text</label><textarea rows="2" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','text',this.value)\">" +
      (p.text || "") +
      "</textarea></div>";
    html +=
      '<div class="rp-row"><label>Mode</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','mode',this.value)\"><option value=\"proximity\"" +
      (p.mode === "proximity" ? " selected" : "") +
      '>Proximity (mouse)</option><option value="scroll"' +
      (p.mode === "scroll" ? " selected" : "") +
      '>Scroll-based</option><option value="path"' +
      (p.mode === "path" ? " selected" : "") +
      ">Text on path</option></select></div>";
    html +=
      '<div class="rp-row"><label>HTML Tag</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','tag',this.value)\"><option value=\"h1\"" +
      (p.tag === "h1" ? " selected" : "") +
      '>H1</option><option value="h2"' +
      (p.tag === "h2" ? " selected" : "") +
      '>H2</option><option value="h3"' +
      (p.tag === "h3" ? " selected" : "") +
      '>H3</option><option value="h4"' +
      (p.tag === "h4" ? " selected" : "") +
      '>H4</option><option value="p"' +
      (p.tag === "p" ? " selected" : "") +
      '>Paragraph</option><option value="div"' +
      (p.tag === "div" ? " selected" : "") +
      ">Div</option></select></div>";
    html +=
      '<div class="rp-row"><label>Font Family</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontFamily',this.value)\"><option value=\"Inter\"" +
      (p.fontFamily === "Inter" ? " selected" : "") +
      '>Inter</option><option value="Lexend"' +
      (p.fontFamily === "Lexend" ? " selected" : "") +
      '>Lexend</option><option value="Georgia"' +
      (p.fontFamily === "Georgia" ? " selected" : "") +
      '>Georgia</option><option value="monospace"' +
      (p.fontFamily === "monospace" ? " selected" : "") +
      '>Monospace</option><option value="Arial"' +
      (p.fontFamily === "Arial" ? " selected" : "") +
      ">Arial</option></select></div>";
    html +=
      '<div class="rp-row"><label>Size: ' +
      (p.size || 56) +
      'px</label><input type="range" min="16" max="120" value="' +
      (p.size || 56) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','size',+this.value);this.previousElementSibling.textContent='Size: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Weight: ' +
      (p.weight || 400) +
      '</label><input type="range" min="100" max="900" step="100" value="' +
      (p.weight || 400) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','weight',+this.value);this.previousElementSibling.textContent='Weight: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Letter Spacing: ' +
      (p.letterSpacing !== undefined ? p.letterSpacing : -2) +
      'px</label><input type="range" min="-10" max="20" value="' +
      (p.letterSpacing !== undefined ? p.letterSpacing : -2) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','letterSpacing',+this.value);this.previousElementSibling.textContent='Letter Spacing: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Line Height: ' +
      (p.lineHeight || 1.1) +
      '</label><input type="range" min="0.8" max="2" step="0.1" value="' +
      (p.lineHeight || 1.1) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','lineHeight',+this.value);this.previousElementSibling.textContent='Line Height: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Align</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','align',this.value)\"><option value=\"left\"" +
      (p.align === "left" ? " selected" : "") +
      '>Left</option><option value="center"' +
      (p.align === "center" ? " selected" : "") +
      '>Center</option><option value="right"' +
      (p.align === "right" ? " selected" : "") +
      ">Right</option></select></div>";
    html +=
      '<div class="rp-row"><label>Text Transform</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textTransform',this.value)\"><option value=\"none\"" +
      (p.textTransform === "none" ? " selected" : "") +
      '>None</option><option value="uppercase"' +
      (p.textTransform === "uppercase" ? " selected" : "") +
      '>UPPERCASE</option><option value="lowercase"' +
      (p.textTransform === "lowercase" ? " selected" : "") +
      '>lowercase</option><option value="capitalize"' +
      (p.textTransform === "capitalize" ? " selected" : "") +
      ">Capitalize</option></select></div>";
    html += "</div></div>";

    // ── Colour & Effects ──
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Colour & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text Colour</label><div class="rp-colour-row"><input type="color" value="' +
      (p.color || "#111111") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      '\',\'color\',this.value)"><input type="text" value="' +
      (p.color || "#111111") +
      '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color',this.value)\"></div></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.gradientText ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','gradientText',this.checked)\"> Gradient Text</label></div>";
    if (p.gradientText) {
      html +=
        '<div class="rp-row"><label>Gradient Colour 1</label><input type="color" value="' +
        (p.gradientTextColor1 || "#cdfe00") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','gradientTextColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Colour 2</label><input type="color" value="' +
        (p.gradientTextColor2 || "#3b82f6") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','gradientTextColor2',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','gradientTextDir',this.value)\"><option value=\"135deg\"" +
        (p.gradientTextDir === "135deg" ? " selected" : "") +
        '>135°</option><option value="90deg"' +
        (p.gradientTextDir === "90deg" ? " selected" : "") +
        '>90°</option><option value="180deg"' +
        (p.gradientTextDir === "180deg" ? " selected" : "") +
        '>180°</option><option value="45deg"' +
        (p.gradientTextDir === "45deg" ? " selected" : "") +
        ">45°</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.textShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','textShadow',this.checked)\"> Text Shadow</label></div>";
    if (p.textShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Colour</label><input type="color" value="' +
        (p.textShadowColor || "#000000").replace(/rgba?\([^)]*\)/, "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.textShadowBlur || 4) +
        '</label><input type="range" min="0" max="20" value="' +
        (p.textShadowBlur || 4) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.glowEffect ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','glowEffect',this.checked)\"> Glow Effect</label></div>";
    if (p.glowEffect) {
      html +=
        '<div class="rp-row"><label>Glow Colour</label><input type="color" value="' +
        (p.glowColor || "#cdfe00") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Glow Size: ' +
        (p.glowSize || 15) +
        'px</label><input type="range" min="5" max="50" value="' +
        (p.glowSize || 15) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowSize',+this.value);this.previousElementSibling.textContent='Glow Size: '+this.value+'px'\"></div>";
    }
    html += "</div></div>";

    // ── Kinetic Settings ──
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Kinetic Settings</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Proximity Radius: ' +
      (p.radius || 300) +
      'px</label><input type="range" min="100" max="600" value="' +
      (p.radius || 300) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','radius',+this.value);this.previousElementSibling.textContent='Proximity Radius: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Min Weight: ' +
      (p.minWeight || 100) +
      '</label><input type="range" min="100" max="900" step="100" value="' +
      (p.minWeight || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','minWeight',+this.value);this.previousElementSibling.textContent='Min Weight: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Max Weight: ' +
      (p.maxWeight || 900) +
      '</label><input type="range" min="100" max="900" step="100" value="' +
      (p.maxWeight || 900) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','maxWeight',+this.value);this.previousElementSibling.textContent='Max Weight: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Split By</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','splitBy',this.value)\"><option value=\"none\"" +
      (p.splitBy === "none" ? " selected" : "") +
      '>None</option><option value="char"' +
      (p.splitBy === "char" ? " selected" : "") +
      '>Character</option><option value="word"' +
      (p.splitBy === "word" ? " selected" : "") +
      '>Word</option><option value="line"' +
      (p.splitBy === "line" ? " selected" : "") +
      ">Line</option></select></div>";
    html +=
      '<div class="rp-row"><label>Char Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','charAnimation',this.value)\"><option value=\"none\"" +
      (p.charAnimation === "none" ? " selected" : "") +
      '>None</option><option value="wave"' +
      (p.charAnimation === "wave" ? " selected" : "") +
      '>Wave</option><option value="stagger"' +
      (p.charAnimation === "stagger" ? " selected" : "") +
      ">Stagger</option></select></div>";
    if (p.charAnimation && p.charAnimation !== "none") {
      html +=
        '<div class="rp-row"><label>Anim Speed: ' +
        (p.charAnimationSpeed || 1) +
        'x</label><input type="range" min="0.1" max="3" step="0.1" value="' +
        (p.charAnimationSpeed || 1) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','charAnimationSpeed',+this.value);this.previousElementSibling.textContent='Anim Speed: '+this.value+'x'\"></div>";
    }
    html += "</div></div>";

    // ── Container ──
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      (p.bgType === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      (p.bgType === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      (p.bgType === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if (p.bgType === "solid") {
      html +=
        '<div class="rp-row"><label>Background Colour</label><div class="rp-colour-row"><input type="color" value="' +
        (p.bgColor === "transparent" ? "#ffffff" : p.bgColor || "#ffffff") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        '\',\'bgColor\',this.value)"><input type="text" value="' +
        (p.bgColor || "transparent") +
        '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgColor',this.value)\"></div></div>";
    } else if (p.bgType === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Colour 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#cdfe00") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Colour 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#3b82f6") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        (p.bgGradientDir === "135deg" ? " selected" : "") +
        '>135°</option><option value="90deg"' +
        (p.bgGradientDir === "90deg" ? " selected" : "") +
        '>90°</option><option value="180deg"' +
        (p.bgGradientDir === "180deg" ? " selected" : "") +
        ">180°</option></select></div>";
    } else if (p.bgType === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImage || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImage',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius: ' +
      (p.borderRadius || 8) +
      'px</label><input type="range" min="0" max="50" value="' +
      (p.borderRadius || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value);this.previousElementSibling.textContent='Border Radius: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width: ' +
      (p.borderWidth || 0) +
      'px</label><input type="range" min="0" max="8" value="' +
      (p.borderWidth || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value);this.previousElementSibling.textContent='Border Width: '+this.value+'px'\"></div>";
    if (p.borderWidth > 0) {
      html +=
        '<div class="rp-row"><label>Border Colour</label><input type="color" value="' +
        (p.borderColor || "#cdfe00") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Border Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderStyle',this.value)\"><option value=\"solid\"" +
        (p.borderStyle === "solid" ? " selected" : "") +
        '>Solid</option><option value="dashed"' +
        (p.borderStyle === "dashed" ? " selected" : "") +
        '>Dashed</option><option value="dotted"' +
        (p.borderStyle === "dotted" ? " selected" : "") +
        ">Dotted</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Padding V: ' +
      (p.paddingV || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingV || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value);this.previousElementSibling.textContent='Padding V: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H: ' +
      (p.paddingH || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingH || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value);this.previousElementSibling.textContent='Padding H: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity: ' +
      (p.opacity || 100) +
      '%</label><input type="range" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value);this.previousElementSibling.textContent='Opacity: '+this.value+'%'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.boxShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','boxShadow',this.checked)\"> Box Shadow</label></div>";
    if (p.boxShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.shadowBlur || 10) +
        '</label><input type="range" min="0" max="40" value="' +
        (p.shadowBlur || 10) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";

    // ── Animation ──
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animation</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      (p.entranceAnim === "none" ? " selected" : "") +
      '>None</option><option value="fade"' +
      (p.entranceAnim === "fade" ? " selected" : "") +
      '>Fade</option><option value="slide-up"' +
      (p.entranceAnim === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="zoom"' +
      (p.entranceAnim === "zoom" ? " selected" : "") +
      ">Zoom</option></select></div>";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      html +=
        '<div class="rp-row"><label>Duration: ' +
        (p.animDuration || 600) +
        'ms</label><input type="range" min="200" max="2000" step="100" value="' +
        (p.animDuration || 600) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','animDuration',+this.value);this.previousElementSibling.textContent='Duration: '+this.value+'ms'\"></div>";
      html +=
        '<div class="rp-row"><label>Delay: ' +
        (p.animDelay || 0) +
        'ms</label><input type="range" min="0" max="1000" step="50" value="' +
        (p.animDelay || 0) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','animDelay',+this.value);this.previousElementSibling.textContent='Delay: '+this.value+'ms'\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      (p.hoverEffect === "none" ? " selected" : "") +
      '>None</option><option value="scale"' +
      (p.hoverEffect === "scale" ? " selected" : "") +
      '>Scale</option><option value="lift"' +
      (p.hoverEffect === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      (p.hoverEffect === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      html +=
        '<div class="rp-row"><label>Transition: ' +
        (p.hoverTransition || 300) +
        'ms</label><input type="range" min="100" max="1000" step="50" value="' +
        (p.hoverTransition || 300) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','hoverTransition',+this.value);this.previousElementSibling.textContent='Transition: '+this.value+'ms'\"></div>";
    }
    html += "</div></div>";

    return html;
  },
});

// ── 2. PHYSICS SANDBOX ──
FB.widgets.register("physicsSandbox", {
  label: "Physics Sandbox",
  sublabel: "Matter.js",
  icon: "⊛",
  iconBg: "#1a0d2e",
  iconColor: "#ff6b35",
  category: "veltro",
  subCategory: "physics",
  defaultProps: {
    height: 400,
    gravity: 1,
    restitution: 0.7,
    friction: 0.05,
    items: ["Veltro", "Design", "Physics", "Motion", "Web"],
    bgColor: "#0d0d1a",
    textColor: "#cdfe00",
    wallColor: "#1a1a2e",
    // Universal Advanced Options
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a0d2e",
    bgImage: "",
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "#ff6b35",
    borderStyle: "solid",
    paddingV: 0,
    paddingH: 0,
    marginV: 0,
    marginH: 0,
    boxShadow: false,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowBlur: 10,
    shadowSpread: 0,
    opacity: 100,
    entranceAnim: "none",
    animDuration: 600,
    animDelay: 0,
    hoverEffect: "none",
    hoverScale: 1.02,
    hoverTransition: 300,
    // Widget-Specific Advanced Enhancements
    objectShape: "box",
    collisionFlash: false,
    gravityDirection: "down",
    itemColors: "#cdfe00,#3b82f6,#ec4899,#f59e0b,#10b981",
    fontSize: 14,
    showHint: true,
    hintColor: "#cdfe00",
    hintOpacity: 0.4,
    hintPosition: "bottom-right",
    wallThickness: 2,
    itemSpacing: 30,
  },
  render: function (p) {
    var wid = "phys-" + (p._blockId || Date.now());
    var itemsJson = JSON.stringify(p.items || ["Veltro", "Physics"]);

    var containerBg = "";
    if (p.bgType === "gradient") {
      containerBg =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a0d2e") +
        ");";
    } else if (p.bgType === "image" && p.bgImage) {
      containerBg = "background:url(" + p.bgImage + ") center/cover;";
    } else {
      containerBg = "background:" + (p.bgColor || "#0d0d1a") + ";";
    }

    var containerBorder = "";
    if (p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px " +
        (p.borderStyle || "solid") +
        " " +
        (p.borderColor || "#ff6b35") +
        ";";
    }

    var containerShadow = "";
    if (p.boxShadow) {
      containerShadow =
        "box-shadow:0 " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowBlur || 10) * 2 +
        "px " +
        (p.shadowSpread || 0) +
        "px " +
        (p.shadowColor || "rgba(0,0,0,0.3)") +
        ";";
    }

    var hoverClass = "";
    var hoverStyle = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
      hoverStyle = "transition:all " + (p.hoverTransition || 300) + "ms ease;";
    }

    var animClass = "";
    var animStyle = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
      animStyle =
        "animation-duration:" +
        (p.animDuration || 600) +
        "ms;animation-delay:" +
        (p.animDelay || 0) +
        "ms;animation-fill-mode:both;";
    }

    var hintHtml = "";
    if (p.showHint !== false) {
      var hintPos = "bottom:8px;right:10px;";
      if (p.hintPosition === "bottom-left") hintPos = "bottom:8px;left:10px;";
      else if (p.hintPosition === "top-right") hintPos = "top:8px;right:10px;";
      else if (p.hintPosition === "top-left") hintPos = "top:8px;left:10px;";
      hintHtml =
        '<div style="position:absolute;' +
        hintPos +
        "font-size:10px;color:" +
        (p.hintColor || "#cdfe00") +
        ";opacity:" +
        (p.hintOpacity || 0.4) +
        ';letter-spacing:1px;pointer-events:none">CLICK TO INTERACT</div>';
    }

    return (
      '<div class="veltro-physics-wrap' +
      animClass +
      hoverClass +
      '" id="' +
      wid +
      '" data-gravity="' +
      (p.gravity || 1) +
      '"' +
      ' data-restitution="' +
      (p.restitution || 0.7) +
      '" data-friction="' +
      (p.friction || 0.05) +
      '"' +
      " data-items='" +
      itemsJson.replace(/'/g, "&#39;") +
      "'" +
      ' data-text-color="' +
      (p.textColor || "#cdfe00") +
      '"' +
      ' data-object-shape="' +
      (p.objectShape || "box") +
      '"' +
      ' data-collision-flash="' +
      (p.collisionFlash ? "1" : "0") +
      '"' +
      ' data-gravity-direction="' +
      (p.gravityDirection || "down") +
      '"' +
      ' data-item-colors="' +
      (p.itemColors || "#cdfe00,#3b82f6,#ec4899,#f59e0b,#10b981") +
      '"' +
      ' data-font-size="' +
      (p.fontSize || 14) +
      '"' +
      ' data-wall-thickness="' +
      (p.wallThickness || 2) +
      '"' +
      ' data-item-spacing="' +
      (p.itemSpacing || 30) +
      '"' +
      ' style="height:' +
      (p.height || 400) +
      "px;" +
      containerBg +
      containerBorder +
      containerShadow +
      hoverStyle +
      animStyle +
      "border-radius:" +
      (p.borderRadius || 8) +
      "px;" +
      "padding:" +
      (p.paddingV || 0) +
      "px " +
      (p.paddingH || 0) +
      "px;" +
      "margin:" +
      (p.marginV || 0) +
      "px " +
      (p.marginH || 0) +
      "px;" +
      "opacity:" +
      (p.opacity || 100) / 100 +
      ";" +
      'position:relative;overflow:hidden;cursor:pointer;">' +
      '<canvas class="veltro-physics-canvas" style="position:absolute;inset:0;width:100%;height:100%"></canvas>' +
      '<div class="veltro-physics-labels" style="position:absolute;inset:0;pointer-events:none"></div>' +
      hintHtml +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var html = "";

    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Physics</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Height: ' +
      (p.height || 400) +
      'px</label><input type="range" min="200" max="800" value="' +
      (p.height || 400) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value);this.previousElementSibling.textContent='Height: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Gravity: ' +
      (p.gravity || 1) +
      '</label><input type="range" min="0" max="3" step="0.1" value="' +
      (p.gravity || 1) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','gravity',+this.value);this.previousElementSibling.textContent='Gravity: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Gravity Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','gravityDirection',this.value)\"><option value=\"down\"" +
      (p.gravityDirection === "down" ? " selected" : "") +
      '>Down</option><option value="up"' +
      (p.gravityDirection === "up" ? " selected" : "") +
      '>Up</option><option value="left"' +
      (p.gravityDirection === "left" ? " selected" : "") +
      '>Left</option><option value="right"' +
      (p.gravityDirection === "right" ? " selected" : "") +
      ">Right</option></select></div>";
    html +=
      '<div class="rp-row"><label>Restitution: ' +
      (p.restitution || 0.7) +
      '</label><input type="range" min="0" max="1" step="0.05" value="' +
      (p.restitution || 0.7) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','restitution',+this.value);this.previousElementSibling.textContent='Restitution: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Friction: ' +
      (p.friction || 0.05) +
      '</label><input type="range" min="0" max="1" step="0.01" value="' +
      (p.friction || 0.05) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','friction',+this.value);this.previousElementSibling.textContent='Friction: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Object Shape</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','objectShape',this.value)\"><option value=\"box\"" +
      (p.objectShape === "box" ? " selected" : "") +
      '>Box</option><option value="circle"' +
      (p.objectShape === "circle" ? " selected" : "") +
      '>Circle</option><option value="triangle"' +
      (p.objectShape === "triangle" ? " selected" : "") +
      ">Triangle</option></select></div>";
    html +=
      '<div class="rp-row"><label>Wall Thickness: ' +
      (p.wallThickness || 2) +
      'px</label><input type="range" min="0" max="10" value="' +
      (p.wallThickness || 2) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','wallThickness',+this.value);this.previousElementSibling.textContent='Wall Thickness: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Item Spacing: ' +
      (p.itemSpacing || 30) +
      'px</label><input type="range" min="10" max="80" value="' +
      (p.itemSpacing || 30) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','itemSpacing',+this.value);this.previousElementSibling.textContent='Item Spacing: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.collisionFlash ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','collisionFlash',this.checked)\"> Collision Flash</label></div>";
    html += "</div></div>";

    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Content & Colours</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Items (one per line)</label><textarea rows="4" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','items',this.value.split('\\n').filter(function(s){return s.trim()}))\">" +
      (p.items || []).join("\n") +
      "</textarea></div>";
    html +=
      '<div class="rp-row"><label>Text Colour</label><div class="rp-colour-row"><input type="color" value="' +
      (p.textColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      '\',\'textColor\',this.value)"><input type="text" value="' +
      (p.textColor || "#cdfe00") +
      '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textColor',this.value)\"></div></div>";
    html +=
      '<div class="rp-row"><label>Item Colours (comma-separated)</label><input type="text" value="' +
      (p.itemColors || "#cdfe00,#3b82f6,#ec4899,#f59e0b,#10b981") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','itemColors',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Font Size: ' +
      (p.fontSize || 14) +
      'px</label><input type="range" min="8" max="32" value="' +
      (p.fontSize || 14) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontSize',+this.value);this.previousElementSibling.textContent='Font Size: '+this.value+'px'\"></div>";
    html += "</div></div>";

    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      (p.bgType === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      (p.bgType === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      (p.bgType === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if (p.bgType === "solid") {
      html +=
        '<div class="rp-row"><label>Background Colour</label><div class="rp-colour-row"><input type="color" value="' +
        (p.bgColor || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        '\',\'bgColor\',this.value)"><input type="text" value="' +
        (p.bgColor || "#0d0d1a") +
        '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgColor',this.value)\"></div></div>";
    } else if (p.bgType === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Colour 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Colour 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a0d2e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        (p.bgGradientDir === "135deg" ? " selected" : "") +
        '>135°</option><option value="90deg"' +
        (p.bgGradientDir === "90deg" ? " selected" : "") +
        '>90°</option><option value="180deg"' +
        (p.bgGradientDir === "180deg" ? " selected" : "") +
        ">180°</option></select></div>";
    } else if (p.bgType === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImage || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImage',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius: ' +
      (p.borderRadius || 8) +
      'px</label><input type="range" min="0" max="50" value="' +
      (p.borderRadius || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value);this.previousElementSibling.textContent='Border Radius: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width: ' +
      (p.borderWidth || 0) +
      'px</label><input type="range" min="0" max="8" value="' +
      (p.borderWidth || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value);this.previousElementSibling.textContent='Border Width: '+this.value+'px'\"></div>";
    if (p.borderWidth > 0) {
      html +=
        '<div class="rp-row"><label>Border Colour</label><input type="color" value="' +
        (p.borderColor || "#ff6b35") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Border Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderStyle',this.value)\"><option value=\"solid\"" +
        (p.borderStyle === "solid" ? " selected" : "") +
        '>Solid</option><option value="dashed"' +
        (p.borderStyle === "dashed" ? " selected" : "") +
        '>Dashed</option><option value="dotted"' +
        (p.borderStyle === "dotted" ? " selected" : "") +
        ">Dotted</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Padding V: ' +
      (p.paddingV || 0) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingV || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value);this.previousElementSibling.textContent='Padding V: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H: ' +
      (p.paddingH || 0) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingH || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value);this.previousElementSibling.textContent='Padding H: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity: ' +
      (p.opacity || 100) +
      '%</label><input type="range" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value);this.previousElementSibling.textContent='Opacity: '+this.value+'%'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.boxShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','boxShadow',this.checked)\"> Box Shadow</label></div>";
    if (p.boxShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.shadowBlur || 10) +
        '</label><input type="range" min="0" max="40" value="' +
        (p.shadowBlur || 10) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";

    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Hint & Animation</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.showHint !== false ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','showHint',this.checked)\"> Show Hint</label></div>";
    if (p.showHint !== false) {
      html +=
        '<div class="rp-row"><label>Hint Colour</label><input type="color" value="' +
        (p.hintColor || "#cdfe00") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','hintColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Hint Opacity: ' +
        (p.hintOpacity || 0.4) +
        '</label><input type="range" min="0" max="1" step="0.1" value="' +
        (p.hintOpacity || 0.4) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','hintOpacity',+this.value);this.previousElementSibling.textContent='Hint Opacity: '+this.value'\"></div>";
      html +=
        '<div class="rp-row"><label>Hint Position</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','hintPosition',this.value)\"><option value=\"bottom-right\"" +
        (p.hintPosition === "bottom-right" ? " selected" : "") +
        '>Bottom Right</option><option value="bottom-left"' +
        (p.hintPosition === "bottom-left" ? " selected" : "") +
        '>Bottom Left</option><option value="top-right"' +
        (p.hintPosition === "top-right" ? " selected" : "") +
        '>Top Right</option><option value="top-left"' +
        (p.hintPosition === "top-left" ? " selected" : "") +
        ">Top Left</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      (p.entranceAnim === "none" ? " selected" : "") +
      '>None</option><option value="fade"' +
      (p.entranceAnim === "fade" ? " selected" : "") +
      '>Fade</option><option value="slide-up"' +
      (p.entranceAnim === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="zoom"' +
      (p.entranceAnim === "zoom" ? " selected" : "") +
      ">Zoom</option></select></div>";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      html +=
        '<div class="rp-row"><label>Duration: ' +
        (p.animDuration || 600) +
        'ms</label><input type="range" min="200" max="2000" step="100" value="' +
        (p.animDuration || 600) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','animDuration',+this.value);this.previousElementSibling.textContent='Duration: '+this.value+'ms'\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      (p.hoverEffect === "none" ? " selected" : "") +
      '>None</option><option value="scale"' +
      (p.hoverEffect === "scale" ? " selected" : "") +
      '>Scale</option><option value="lift"' +
      (p.hoverEffect === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      (p.hoverEffect === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    html += "</div></div>";

    return html;
  },
});

// ── 3. TEXT SCRAMBLE ──
FB.widgets.register("textScramble", {
  label: "Text Scramble",
  sublabel: "Hover decode",
  icon: "§",
  iconBg: "#1a0d1a",
  iconColor: "#f472b6",
  category: "veltro",
  subCategory: "typography",
  defaultProps: {
    text: "DECODE ME",
    fontSize: 64,
    fontWeight: 800,
    color: "#cdfe00",
    bg: "#0d0d1a",
    charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*",
    scrambleSpeed: 30,
    // Universal Advanced Options
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a0d2e",
    bgImage: "",
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "#f472b6",
    borderStyle: "solid",
    paddingV: 24,
    paddingH: 24,
    marginV: 0,
    marginH: 0,
    boxShadow: false,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowBlur: 10,
    shadowSpread: 0,
    opacity: 100,
    entranceAnim: "none",
    animDuration: 600,
    animDelay: 0,
    hoverEffect: "none",
    hoverScale: 1.02,
    hoverTransition: 300,
    // Widget-Specific Advanced Enhancements
    decodeTrigger: "hover",
    scrambleIntensity: 0.5,
    revealDelay: 0,
    fontFamily: "monospace",
    letterSpacing: 4,
    autoScramble: false,
    autoScrambleInterval: 3000,
    cipherStyle: "random",
  },
  render: function (p) {
    var id = "scramble-" + (p._blockId || Date.now());
    var charset = p.charset || "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

    var containerBg = "";
    if (p.bgType === "gradient") {
      containerBg =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a0d2e") +
        ");";
    } else if (p.bgType === "image" && p.bgImage) {
      containerBg = "background:url(" + p.bgImage + ") center/cover;";
    } else {
      containerBg = "background:" + (p.bg || "#0d0d1a") + ";";
    }

    var containerBorder = "";
    if (p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px " +
        (p.borderStyle || "solid") +
        " " +
        (p.borderColor || "#f472b6") +
        ";";
    }

    var containerShadow = "";
    if (p.boxShadow) {
      containerShadow =
        "box-shadow:0 " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowBlur || 10) * 2 +
        "px " +
        (p.shadowSpread || 0) +
        "px " +
        (p.shadowColor || "rgba(0,0,0,0.3)") +
        ";";
    }

    var hoverClass = "";
    var hoverStyle = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
      hoverStyle = "transition:all " + (p.hoverTransition || 300) + "ms ease;";
    }

    var animClass = "";
    var animStyle = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
      animStyle =
        "animation-duration:" +
        (p.animDuration || 600) +
        "ms;animation-delay:" +
        (p.animDelay || 0) +
        "ms;animation-fill-mode:both;";
    }

    return (
      '<div class="veltro-scramble-wrap' +
      animClass +
      hoverClass +
      '" id="' +
      id +
      '" data-text="' +
      (p.text || "DECODE ME") +
      '" data-charset="' +
      charset +
      '" data-speed="' +
      (p.scrambleSpeed || 30) +
      '" data-decode-trigger="' +
      (p.decodeTrigger || "hover") +
      '" data-scramble-intensity="' +
      (p.scrambleIntensity || 0.5) +
      '" data-reveal-delay="' +
      (p.revealDelay || 0) +
      '" data-auto-scramble="' +
      (p.autoScramble ? "1" : "0") +
      '" data-auto-interval="' +
      (p.autoScrambleInterval || 3000) +
      '" data-cipher-style="' +
      (p.cipherStyle || "random") +
      '" style="height:200px;' +
      containerBg +
      containerBorder +
      containerShadow +
      hoverStyle +
      animStyle +
      "border-radius:" +
      (p.borderRadius || 8) +
      "px;" +
      "padding:" +
      (p.paddingV || 24) +
      "px " +
      (p.paddingH || 24) +
      "px;" +
      "margin:" +
      (p.marginV || 0) +
      "px " +
      (p.marginH || 0) +
      "px;" +
      "opacity:" +
      (p.opacity || 100) / 100 +
      ";" +
      'display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;"><span class="veltro-scramble-text" style="font-size:' +
      (p.fontSize || 64) +
      "px;font-weight:" +
      (p.fontWeight || 800) +
      ";color:" +
      (p.color || "#cdfe00") +
      ";font-family:'" +
      (p.fontFamily || "monospace") +
      "',sans-serif;user-select:none;cursor:pointer;letter-spacing:" +
      (p.letterSpacing !== undefined ? p.letterSpacing : 4) +
      "px" +
      '">' +
      (p.text || "DECODE ME") +
      "</span></div>"
    );
  },
  editPanel: function (id, p) {
    var html = "";

    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Text & Scramble</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text</label><input type="text" value="' +
      (p.text || "DECODE ME") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','text',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Font Size: ' +
      (p.fontSize || 64) +
      'px</label><input type="range" min="24" max="120" value="' +
      (p.fontSize || 64) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontSize',+this.value);this.previousElementSibling.textContent='Font Size: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Weight: ' +
      (p.fontWeight || 800) +
      '</label><input type="range" min="100" max="900" step="100" value="' +
      (p.fontWeight || 800) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontWeight',+this.value);this.previousElementSibling.textContent='Font Weight: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Family</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontFamily',this.value)\"><option value=\"monospace\"" +
      (p.fontFamily === "monospace" ? " selected" : "") +
      '>Monospace</option><option value="Inter"' +
      (p.fontFamily === "Inter" ? " selected" : "") +
      '>Inter</option><option value="Lexend"' +
      (p.fontFamily === "Lexend" ? " selected" : "") +
      ">Lexend</option></select></div>";
    html +=
      '<div class="rp-row"><label>Letter Spacing: ' +
      (p.letterSpacing !== undefined ? p.letterSpacing : 4) +
      'px</label><input type="range" min="-5" max="20" value="' +
      (p.letterSpacing !== undefined ? p.letterSpacing : 4) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','letterSpacing',+this.value);this.previousElementSibling.textContent='Letter Spacing: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Scramble Speed: ' +
      (p.scrambleSpeed || 30) +
      'ms</label><input type="range" min="10" max="100" value="' +
      (p.scrambleSpeed || 30) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','scrambleSpeed',+this.value);this.previousElementSibling.textContent='Scramble Speed: '+this.value+'ms'\"></div>";
    html +=
      '<div class="rp-row"><label>Decode Trigger</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','decodeTrigger',this.value)\"><option value=\"hover\"" +
      (p.decodeTrigger === "hover" ? " selected" : "") +
      '>Hover</option><option value="click"' +
      (p.decodeTrigger === "click" ? " selected" : "") +
      '>Click</option><option value="auto"' +
      (p.decodeTrigger === "auto" ? " selected" : "") +
      ">Auto (on load)</option></select></div>";
    html +=
      '<div class="rp-row"><label>Scramble Intensity: ' +
      (p.scrambleIntensity || 0.5) +
      '</label><input type="range" min="0" max="1" step="0.1" value="' +
      (p.scrambleIntensity || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','scrambleIntensity',+this.value);this.previousElementSibling.textContent='Scramble Intensity: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Reveal Delay: ' +
      (p.revealDelay || 0) +
      'ms</label><input type="range" min="0" max="2000" step="100" value="' +
      (p.revealDelay || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','revealDelay',+this.value);this.previousElementSibling.textContent='Reveal Delay: '+this.value+'ms'\"></div>";
    html +=
      '<div class="rp-row"><label>Cipher Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','cipherStyle',this.value)\"><option value=\"random\"" +
      (p.cipherStyle === "random" ? " selected" : "") +
      '>Random</option><option value="matrix"' +
      (p.cipherStyle === "matrix" ? " selected" : "") +
      '>Matrix</option><option value="binary"' +
      (p.cipherStyle === "binary" ? " selected" : "") +
      ">Binary</option></select></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.autoScramble ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','autoScramble',this.checked)\"> Auto Re-scramble</label></div>";
    if (p.autoScramble) {
      html +=
        '<div class="rp-row"><label>Re-scramble Interval: ' +
        (p.autoScrambleInterval || 3000) +
        'ms</label><input type="range" min="1000" max="10000" step="500" value="' +
        (p.autoScrambleInterval || 3000) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','autoScrambleInterval',+this.value);this.previousElementSibling.textContent='Re-scramble Interval: '+this.value+'ms'\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Charset</label><input type="text" value="' +
      (p.charset || "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','charset',this.value)\"></div>";
    html += "</div></div>";

    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Colour</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text Colour</label><div class="rp-colour-row"><input type="color" value="' +
      (p.color || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      '\',\'color\',this.value)"><input type="text" value="' +
      (p.color || "#cdfe00") +
      '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color',this.value)\"></div></div>";
    html += "</div></div>";

    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      (p.bgType === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      (p.bgType === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      (p.bgType === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if (p.bgType === "solid") {
      html +=
        '<div class="rp-row"><label>Background Colour</label><div class="rp-colour-row"><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        '\',\'bg\',this.value)"><input type="text" value="' +
        (p.bg || "#0d0d1a") +
        '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div></div>";
    } else if (p.bgType === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Colour 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Colour 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a0d2e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        (p.bgGradientDir === "135deg" ? " selected" : "") +
        '>135°</option><option value="90deg"' +
        (p.bgGradientDir === "90deg" ? " selected" : "") +
        '>90°</option><option value="180deg"' +
        (p.bgGradientDir === "180deg" ? " selected" : "") +
        ">180°</option></select></div>";
    } else if (p.bgType === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImage || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImage',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius: ' +
      (p.borderRadius || 8) +
      'px</label><input type="range" min="0" max="50" value="' +
      (p.borderRadius || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value);this.previousElementSibling.textContent='Border Radius: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width: ' +
      (p.borderWidth || 0) +
      'px</label><input type="range" min="0" max="8" value="' +
      (p.borderWidth || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value);this.previousElementSibling.textContent='Border Width: '+this.value+'px'\"></div>";
    if (p.borderWidth > 0) {
      html +=
        '<div class="rp-row"><label>Border Colour</label><input type="color" value="' +
        (p.borderColor || "#f472b6") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Border Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderStyle',this.value)\"><option value=\"solid\"" +
        (p.borderStyle === "solid" ? " selected" : "") +
        '>Solid</option><option value="dashed"' +
        (p.borderStyle === "dashed" ? " selected" : "") +
        '>Dashed</option><option value="dotted"' +
        (p.borderStyle === "dotted" ? " selected" : "") +
        ">Dotted</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Padding V: ' +
      (p.paddingV || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingV || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value);this.previousElementSibling.textContent='Padding V: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H: ' +
      (p.paddingH || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingH || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value);this.previousElementSibling.textContent='Padding H: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity: ' +
      (p.opacity || 100) +
      '%</label><input type="range" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value);this.previousElementSibling.textContent='Opacity: '+this.value+'%'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.boxShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','boxShadow',this.checked)\"> Box Shadow</label></div>";
    if (p.boxShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.shadowBlur || 10) +
        '</label><input type="range" min="0" max="40" value="' +
        (p.shadowBlur || 10) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";

    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animation</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      (p.entranceAnim === "none" ? " selected" : "") +
      '>None</option><option value="fade"' +
      (p.entranceAnim === "fade" ? " selected" : "") +
      '>Fade</option><option value="slide-up"' +
      (p.entranceAnim === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="zoom"' +
      (p.entranceAnim === "zoom" ? " selected" : "") +
      ">Zoom</option></select></div>";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      html +=
        '<div class="rp-row"><label>Duration: ' +
        (p.animDuration || 600) +
        'ms</label><input type="range" min="200" max="2000" step="100" value="' +
        (p.animDuration || 600) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','animDuration',+this.value);this.previousElementSibling.textContent='Duration: '+this.value+'ms'\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      (p.hoverEffect === "none" ? " selected" : "") +
      '>None</option><option value="scale"' +
      (p.hoverEffect === "scale" ? " selected" : "") +
      '>Scale</option><option value="lift"' +
      (p.hoverEffect === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      (p.hoverEffect === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    html += "</div></div>";

    return html;
  },
});

// ── 4. TYPEWRITER REVEAL ──
FB.widgets.register("typewriterReveal", {
  label: "Typewriter Reveal",
  sublabel: "Typing effect",
  icon: "▶",
  iconBg: "#0d1a0d",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "typography",
  defaultProps: {
    text: "Hello, World!",
    speed: 80,
    cursor: true,
    color: "#cdfe00",
    bg: "#0d0d1a",
    fontSize: 48,
    fontWeight: 700,
    loop: true,
    delay: 2000,
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a0d2e",
    bgImage: "",
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "#34d399",
    borderStyle: "solid",
    paddingV: 24,
    paddingH: 24,
    marginV: 0,
    marginH: 0,
    boxShadow: false,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowBlur: 10,
    shadowSpread: 0,
    opacity: 100,
    entranceAnim: "none",
    animDuration: 600,
    animDelay: 0,
    hoverEffect: "none",
    hoverScale: 1.02,
    hoverTransition: 300,
    cursorStyle: "blink",
    cursorColor: "",
    fontFamily: "monospace",
    letterSpacing: 0,
    multiText: "",
    multiTextDelay: 2000,
    textTransform: "none",
    textAlign: "center",
    glowEffect: false,
    glowColor: "#cdfe00",
    glowSize: 15,
  },
  render: function (p) {
    var id = "tw-" + (p._blockId || Date.now());
    var containerBg = "";
    if (p.bgType === "gradient") {
      containerBg =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a0d2e") +
        ");";
    } else if (p.bgType === "image" && p.bgImage) {
      containerBg = "background:url(" + p.bgImage + ") center/cover;";
    } else {
      containerBg = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px " +
        (p.borderStyle || "solid") +
        " " +
        (p.borderColor || "#34d399") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow) {
      containerShadow =
        "box-shadow:0 " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowBlur || 10) * 2 +
        "px " +
        (p.shadowSpread || 0) +
        "px " +
        (p.shadowColor || "rgba(0,0,0,0.3)") +
        ";";
    }
    var hoverClass = "";
    var hoverStyle = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
      hoverStyle = "transition:all " + (p.hoverTransition || 300) + "ms ease;";
    }
    var animClass = "";
    var animStyle = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
      animStyle =
        "animation-duration:" +
        (p.animDuration || 600) +
        "ms;animation-delay:" +
        (p.animDelay || 0) +
        "ms;animation-fill-mode:both;";
    }
    var glowStyle = "";
    if (p.glowEffect) {
      glowStyle =
        "filter:drop-shadow(0 0 " +
        (p.glowSize || 15) +
        "px " +
        (p.glowColor || "#cdfe00") +
        ");";
    }
    var textTransformStyle = "";
    if (p.textTransform && p.textTransform !== "none") {
      textTransformStyle = "text-transform:" + p.textTransform + ";";
    }
    var cursorCol = p.cursorColor || p.color || "#cdfe00";
    var cursorAnim = "vtblink 1s step-end infinite";
    if (p.cursorStyle === "underscore")
      cursorAnim = "vtblink 0.8s step-end infinite";
    else if (p.cursorStyle === "block")
      cursorAnim = "vtblink 0.6s step-end infinite";
    var cursorWidth = p.cursorStyle === "block" ? "0.6em" : "2px";
    var multiTexts = p.multiText
      ? p.multiText
          .split(",")
          .map(function (s) {
            return s.trim();
          })
          .filter(Boolean)
      : [];
    var dataMulti =
      multiTexts.length > 0
        ? ' data-multi-text="' +
          multiTexts.join(",") +
          '" data-multi-delay="' +
          (p.multiTextDelay || 2000) +
          '"'
        : "";
    return (
      '<div class="veltro-typewriter-wrap' +
      animClass +
      hoverClass +
      '" id="' +
      id +
      '" data-text="' +
      (p.text || "Hello, World!") +
      '" data-speed="' +
      (p.speed || 80) +
      '" data-cursor="' +
      (p.cursor !== false ? "1" : "0") +
      '" data-loop="' +
      (p.loop !== false ? "1" : "0") +
      '" data-delay="' +
      (p.delay || 2000) +
      dataMulti +
      '" style="height:200px;' +
      containerBg +
      containerBorder +
      containerShadow +
      hoverStyle +
      animStyle +
      "border-radius:" +
      (p.borderRadius || 8) +
      "px;" +
      "padding:" +
      (p.paddingV || 24) +
      "px " +
      (p.paddingH || 24) +
      "px;" +
      "margin:" +
      (p.marginV || 0) +
      "px " +
      (p.marginH || 0) +
      "px;" +
      "opacity:" +
      (p.opacity || 100) / 100 +
      ";" +
      'display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;"><div class="veltro-typewriter" style="font-size:' +
      (p.fontSize || 48) +
      "px;font-weight:" +
      (p.fontWeight || 700) +
      ";color:" +
      (p.color || "#cdfe00") +
      ";font-family:'" +
      (p.fontFamily || "monospace") +
      "',sans-serif;user-select:none;letter-spacing:" +
      (p.letterSpacing || 0) +
      "px;text-align:" +
      (p.textAlign || "center") +
      ";" +
      glowStyle +
      textTransformStyle +
      '"><span class="veltro-typewriter-text"></span>' +
      (p.cursor !== false
        ? '<span class="veltro-typewriter-cursor" style="display:inline-block;width:' +
          cursorWidth +
          ";height:1em;background:" +
          cursorCol +
          ";margin-left:2px;animation:" +
          cursorAnim +
          '">&nbsp;</span>'
        : "") +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Text & Typing</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text</label><input type="text" value="' +
      (p.text || "Hello, World!") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','text',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Speed: ' +
      (p.speed || 80) +
      'ms</label><input type="range" min="20" max="200" value="' +
      (p.speed || 80) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','speed',+this.value);this.previousElementSibling.textContent='Speed: '+this.value+'ms'\"></div>";
    html +=
      '<div class="rp-row"><label>Delay: ' +
      (p.delay || 2000) +
      'ms</label><input type="range" min="500" max="5000" step="100" value="' +
      (p.delay || 2000) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','delay',+this.value);this.previousElementSibling.textContent='Delay: '+this.value+'ms'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.loop !== false ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','loop',this.checked)\"> Loop</label></div>";
    html +=
      '<div class="rp-row"><label>Multi-Text (comma-separated)</label><input type="text" value="' +
      (p.multiText || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','multiText',this.value)\"></div>";
    if (p.multiText) {
      html +=
        '<div class="rp-row"><label>Multi-Text Delay: ' +
        (p.multiTextDelay || 2000) +
        'ms</label><input type="range" min="1000" max="5000" step="100" value="' +
        (p.multiTextDelay || 2000) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','multiTextDelay',+this.value);this.previousElementSibling.textContent='Multi-Text Delay: '+this.value+'ms'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Cursor</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.cursor !== false ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','cursor',this.checked)\"> Show Cursor</label></div>";
    if (p.cursor !== false) {
      html +=
        '<div class="rp-row"><label>Cursor Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','cursorStyle',this.value)\"><option value=\"blink\"" +
        (p.cursorStyle === "blink" ? " selected" : "") +
        '>Blink</option><option value="underscore"' +
        (p.cursorStyle === "underscore" ? " selected" : "") +
        '>Underscore</option><option value="block"' +
        (p.cursorStyle === "block" ? " selected" : "") +
        ">Block</option></select></div>";
      html +=
        '<div class="rp-row"><label>Cursor Colour</label><input type="color" value="' +
        (p.cursorColor || p.color || "#cdfe00") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','cursorColor',this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Typography & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Font Size: ' +
      (p.fontSize || 48) +
      'px</label><input type="range" min="16" max="120" value="' +
      (p.fontSize || 48) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontSize',+this.value);this.previousElementSibling.textContent='Font Size: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Weight: ' +
      (p.fontWeight || 700) +
      '</label><input type="range" min="100" max="900" step="100" value="' +
      (p.fontWeight || 700) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontWeight',+this.value);this.previousElementSibling.textContent='Font Weight: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Family</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontFamily',this.value)\"><option value=\"monospace\"" +
      (p.fontFamily === "monospace" ? " selected" : "") +
      '>Monospace</option><option value="Inter"' +
      (p.fontFamily === "Inter" ? " selected" : "") +
      '>Inter</option><option value="Lexend"' +
      (p.fontFamily === "Lexend" ? " selected" : "") +
      ">Lexend</option></select></div>";
    html +=
      '<div class="rp-row"><label>Letter Spacing: ' +
      (p.letterSpacing || 0) +
      'px</label><input type="range" min="-5" max="20" value="' +
      (p.letterSpacing || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','letterSpacing',+this.value);this.previousElementSibling.textContent='Letter Spacing: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Text Align</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textAlign',this.value)\"><option value=\"left\"" +
      (p.textAlign === "left" ? " selected" : "") +
      '>Left</option><option value="center"' +
      (p.textAlign === "center" ? " selected" : "") +
      '>Center</option><option value="right"' +
      (p.textAlign === "right" ? " selected" : "") +
      ">Right</option></select></div>";
    html +=
      '<div class="rp-row"><label>Text Transform</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textTransform',this.value)\"><option value=\"none\"" +
      (p.textTransform === "none" ? " selected" : "") +
      '>None</option><option value="uppercase"' +
      (p.textTransform === "uppercase" ? " selected" : "") +
      '>UPPERCASE</option><option value="lowercase"' +
      (p.textTransform === "lowercase" ? " selected" : "") +
      '>lowercase</option><option value="capitalize"' +
      (p.textTransform === "capitalize" ? " selected" : "") +
      ">Capitalize</option></select></div>";
    html +=
      '<div class="rp-row"><label>Text Colour</label><div class="rp-colour-row"><input type="color" value="' +
      (p.color || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      '\',\'color\',this.value)"><input type="text" value="' +
      (p.color || "#cdfe00") +
      '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color',this.value)\"></div></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.glowEffect ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','glowEffect',this.checked)\"> Glow Effect</label></div>";
    if (p.glowEffect) {
      html +=
        '<div class="rp-row"><label>Glow Colour</label><input type="color" value="' +
        (p.glowColor || "#cdfe00") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Glow Size: ' +
        (p.glowSize || 15) +
        'px</label><input type="range" min="5" max="50" value="' +
        (p.glowSize || 15) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowSize',+this.value);this.previousElementSibling.textContent='Glow Size: '+this.value+'px'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      (p.bgType === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      (p.bgType === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      (p.bgType === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if (p.bgType === "solid") {
      html +=
        '<div class="rp-row"><label>Background Colour</label><div class="rp-colour-row"><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        '\',\'bg\',this.value)"><input type="text" value="' +
        (p.bg || "#0d0d1a") +
        '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div></div>";
    } else if (p.bgType === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Colour 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Colour 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a0d2e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        (p.bgGradientDir === "135deg" ? " selected" : "") +
        '>135°</option><option value="90deg"' +
        (p.bgGradientDir === "90deg" ? " selected" : "") +
        '>90°</option><option value="180deg"' +
        (p.bgGradientDir === "180deg" ? " selected" : "") +
        ">180°</option></select></div>";
    } else if (p.bgType === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImage || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImage',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius: ' +
      (p.borderRadius || 8) +
      'px</label><input type="range" min="0" max="50" value="' +
      (p.borderRadius || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value);this.previousElementSibling.textContent='Border Radius: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width: ' +
      (p.borderWidth || 0) +
      'px</label><input type="range" min="0" max="8" value="' +
      (p.borderWidth || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value);this.previousElementSibling.textContent='Border Width: '+this.value+'px'\"></div>";
    if (p.borderWidth > 0) {
      html +=
        '<div class="rp-row"><label>Border Colour</label><input type="color" value="' +
        (p.borderColor || "#34d399") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Border Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderStyle',this.value)\"><option value=\"solid\"" +
        (p.borderStyle === "solid" ? " selected" : "") +
        '>Solid</option><option value="dashed"' +
        (p.borderStyle === "dashed" ? " selected" : "") +
        '>Dashed</option><option value="dotted"' +
        (p.borderStyle === "dotted" ? " selected" : "") +
        ">Dotted</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Padding V: ' +
      (p.paddingV || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingV || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value);this.previousElementSibling.textContent='Padding V: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H: ' +
      (p.paddingH || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingH || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value);this.previousElementSibling.textContent='Padding H: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity: ' +
      (p.opacity || 100) +
      '%</label><input type="range" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value);this.previousElementSibling.textContent='Opacity: '+this.value+'%'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.boxShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','boxShadow',this.checked)\"> Box Shadow</label></div>";
    if (p.boxShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.shadowBlur || 10) +
        '</label><input type="range" min="0" max="40" value="' +
        (p.shadowBlur || 10) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animation</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      (p.entranceAnim === "none" ? " selected" : "") +
      '>None</option><option value="fade"' +
      (p.entranceAnim === "fade" ? " selected" : "") +
      '>Fade</option><option value="slide-up"' +
      (p.entranceAnim === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="zoom"' +
      (p.entranceAnim === "zoom" ? " selected" : "") +
      ">Zoom</option></select></div>";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      html +=
        '<div class="rp-row"><label>Duration: ' +
        (p.animDuration || 600) +
        'ms</label><input type="range" min="200" max="2000" step="100" value="' +
        (p.animDuration || 600) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','animDuration',+this.value);this.previousElementSibling.textContent='Duration: '+this.value+'ms'\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      (p.hoverEffect === "none" ? " selected" : "") +
      '>None</option><option value="scale"' +
      (p.hoverEffect === "scale" ? " selected" : "") +
      '>Scale</option><option value="lift"' +
      (p.hoverEffect === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      (p.hoverEffect === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

// ── 5. TEXT MASK ──
FB.widgets.register("textMask", {
  label: "Text Mask",
  sublabel: "Background clip",
  icon: "M",
  iconBg: "#1a1a0d",
  iconColor: "#fbbf24",
  category: "veltro",
  subCategory: "typography",
  defaultProps: {
    text: "MASKED",
    fontSize: 80,
    fontWeight: 900,
    bgImage: "https://picsum.photos/800/400?random=1",
    bg: "#0d0d1a",
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a0d2e",
    bgImageContainer: "",
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "#fbbf24",
    borderStyle: "solid",
    paddingV: 24,
    paddingH: 24,
    marginV: 0,
    marginH: 0,
    boxShadow: false,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowBlur: 10,
    shadowSpread: 0,
    opacity: 100,
    entranceAnim: "none",
    animDuration: 600,
    animDelay: 0,
    hoverEffect: "none",
    hoverScale: 1.02,
    hoverTransition: 300,
    maskBlendMode: "source-atop",
    maskScale: 100,
    maskAnimation: false,
    maskAnimSpeed: 10,
    maskPosition: "center",
    maskRepeat: "no-repeat",
    maskOpacity: 100,
    textShadow: false,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowBlur: 4,
    fontFamily: "Lexend",
    letterSpacing: 0,
    textTransform: "none",
    maskFallbackColor: "#fbbf24",
    maskVideoUrl: "",
  },
  render: function (p) {
    var containerBg = "";
    if (p.bgType === "gradient") {
      containerBg =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a0d2e") +
        ");";
    } else if (p.bgType === "image" && p.bgImageContainer) {
      containerBg = "background:url(" + p.bgImageContainer + ") center/cover;";
    } else {
      containerBg = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px " +
        (p.borderStyle || "solid") +
        " " +
        (p.borderColor || "#fbbf24") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow) {
      containerShadow =
        "box-shadow:0 " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowBlur || 10) * 2 +
        "px " +
        (p.shadowSpread || 0) +
        "px " +
        (p.shadowColor || "rgba(0,0,0,0.3)") +
        ";";
    }
    var hoverClass = "";
    var hoverStyle = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
      hoverStyle = "transition:all " + (p.hoverTransition || 300) + "ms ease;";
    }
    var animClass = "";
    var animStyle = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
      animStyle =
        "animation-duration:" +
        (p.animDuration || 600) +
        "ms;animation-delay:" +
        (p.animDelay || 0) +
        "ms;animation-fill-mode:both;";
    }
    var textShadowStyle = "";
    if (p.textShadow) {
      textShadowStyle =
        "text-shadow:" +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowBlur || 4) * 2 +
        "px " +
        (p.textShadowColor || "rgba(0,0,0,0.5)") +
        ";";
    }
    var textTransformStyle = "";
    if (p.textTransform && p.textTransform !== "none") {
      textTransformStyle = "text-transform:" + p.textTransform + ";";
    }
    var maskAnimClass = p.maskAnimation ? " veltro-mask-anim" : "";
    var maskAnimStyle = p.maskAnimation
      ? "animation:vtmaskpan " +
        10 / (p.maskAnimSpeed || 10) +
        "s linear infinite;"
      : "";
    var maskPos = p.maskPosition || "center";
    var maskBg = p.maskVideoUrl
      ? "background:url(" +
        p.maskVideoUrl +
        ") " +
        maskPos +
        "/" +
        (p.maskScale || 100) +
        "% " +
        (p.maskRepeat || "no-repeat") +
        ";"
      : "background:url(" +
        (p.bgImage || "https://picsum.photos/800/400?random=1") +
        ") " +
        maskPos +
        "/" +
        (p.maskScale || 100) +
        "% " +
        (p.maskRepeat || "no-repeat") +
        ";";
    return (
      '<div class="veltro-textmask-wrap' +
      animClass +
      hoverClass +
      '" style="height:200px;' +
      containerBg +
      containerBorder +
      containerShadow +
      hoverStyle +
      animStyle +
      "border-radius:" +
      (p.borderRadius || 8) +
      "px;" +
      "padding:" +
      (p.paddingV || 24) +
      "px " +
      (p.paddingH || 24) +
      "px;" +
      "margin:" +
      (p.marginV || 0) +
      "px " +
      (p.marginH || 0) +
      "px;" +
      "opacity:" +
      (p.opacity || 100) / 100 +
      ";" +
      'display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;"><div class="veltro-textmask-text' +
      maskAnimClass +
      '" style="font-size:' +
      (p.fontSize || 80) +
      "px;font-weight:" +
      (p.fontWeight || 900) +
      ";" +
      maskBg +
      "-webkit-background-clip:text;background-clip:text;color:transparent;user-select:none;font-family:'" +
      (p.fontFamily || "Lexend") +
      "',sans-serif;letter-spacing:" +
      (p.letterSpacing || 0) +
      "px;" +
      textShadowStyle +
      textTransformStyle +
      maskAnimStyle +
      "opacity:" +
      (p.maskOpacity || 100) / 100 +
      '">' +
      (p.text || "MASKED") +
      '</div><noscript><div style="font-size:' +
      (p.fontSize || 80) +
      "px;font-weight:" +
      (p.fontWeight || 900) +
      ";color:" +
      (p.maskFallbackColor || "#fbbf24") +
      ";font-family:'" +
      (p.fontFamily || "Lexend") +
      "',sans-serif\">" +
      (p.text || "MASKED") +
      "</div></noscript></div>"
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Text & Mask</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text</label><input type="text" value="' +
      (p.text || "MASKED") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','text',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Font Size: ' +
      (p.fontSize || 80) +
      'px</label><input type="range" min="24" max="150" value="' +
      (p.fontSize || 80) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontSize',+this.value);this.previousElementSibling.textContent='Font Size: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Weight: ' +
      (p.fontWeight || 900) +
      '</label><input type="range" min="100" max="900" step="100" value="' +
      (p.fontWeight || 900) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontWeight',+this.value);this.previousElementSibling.textContent='Font Weight: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Family</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontFamily',this.value)\"><option value=\"Lexend\"" +
      (p.fontFamily === "Lexend" ? " selected" : "") +
      '>Lexend</option><option value="Inter"' +
      (p.fontFamily === "Inter" ? " selected" : "") +
      '>Inter</option><option value="Georgia"' +
      (p.fontFamily === "Georgia" ? " selected" : "") +
      ">Georgia</option></select></div>";
    html +=
      '<div class="rp-row"><label>Letter Spacing: ' +
      (p.letterSpacing || 0) +
      'px</label><input type="range" min="-5" max="20" value="' +
      (p.letterSpacing || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','letterSpacing',+this.value);this.previousElementSibling.textContent='Letter Spacing: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Text Transform</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textTransform',this.value)\"><option value=\"none\"" +
      (p.textTransform === "none" ? " selected" : "") +
      '>None</option><option value="uppercase"' +
      (p.textTransform === "uppercase" ? " selected" : "") +
      '>UPPERCASE</option><option value="lowercase"' +
      (p.textTransform === "lowercase" ? " selected" : "") +
      ">lowercase</option></select></div>";
    html +=
      '<div class="rp-row"><label>Mask Image URL</label><input type="text" value="' +
      (p.bgImage || "https://picsum.photos/800/400?random=1") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgImage',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Mask Scale: ' +
      (p.maskScale || 100) +
      '%</label><input type="range" min="50" max="300" value="' +
      (p.maskScale || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','maskScale',+this.value);this.previousElementSibling.textContent='Mask Scale: '+this.value+'%'\"></div>";
    html +=
      '<div class="rp-row"><label>Mask Position</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','maskPosition',this.value)\"><option value=\"center\"" +
      (p.maskPosition === "center" ? " selected" : "") +
      '>Center</option><option value="top"' +
      (p.maskPosition === "top" ? " selected" : "") +
      '>Top</option><option value="bottom"' +
      (p.maskPosition === "bottom" ? " selected" : "") +
      '>Bottom</option><option value="left"' +
      (p.maskPosition === "left" ? " selected" : "") +
      '>Left</option><option value="right"' +
      (p.maskPosition === "right" ? " selected" : "") +
      ">Right</option></select></div>";
    html +=
      '<div class="rp-row"><label>Mask Opacity: ' +
      (p.maskOpacity || 100) +
      '%</label><input type="range" min="0" max="100" value="' +
      (p.maskOpacity || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','maskOpacity',+this.value);this.previousElementSibling.textContent='Mask Opacity: '+this.value+'%'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.maskAnimation ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','maskAnimation',this.checked)\"> Animate Mask</label></div>";
    if (p.maskAnimation) {
      html +=
        '<div class="rp-row"><label>Anim Speed: ' +
        (p.maskAnimSpeed || 10) +
        '</label><input type="range" min="1" max="30" value="' +
        (p.maskAnimSpeed || 10) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','maskAnimSpeed',+this.value);this.previousElementSibling.textContent='Anim Speed: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.textShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','textShadow',this.checked)\"> Text Shadow</label></div>";
    if (p.textShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Colour</label><input type="color" value="' +
        (p.textShadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.textShadowBlur || 4) +
        '</label><input type="range" min="0" max="20" value="' +
        (p.textShadowBlur || 4) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Mask Fallback Colour</label><input type="color" value="' +
      (p.maskFallbackColor || "#fbbf24") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','maskFallbackColor',this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      (p.bgType === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      (p.bgType === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      (p.bgType === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if (p.bgType === "solid") {
      html +=
        '<div class="rp-row"><label>Background Colour</label><div class="rp-colour-row"><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        '\',\'bg\',this.value)"><input type="text" value="' +
        (p.bg || "#0d0d1a") +
        '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div></div>";
    } else if (p.bgType === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Colour 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Colour 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a0d2e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        (p.bgGradientDir === "135deg" ? " selected" : "") +
        '>135°</option><option value="90deg"' +
        (p.bgGradientDir === "90deg" ? " selected" : "") +
        ">90°</option></select></div>";
    } else if (p.bgType === "image") {
      html +=
        '<div class="rp-row"><label>Container Image URL</label><input type="text" value="' +
        (p.bgImageContainer || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageContainer',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius: ' +
      (p.borderRadius || 8) +
      'px</label><input type="range" min="0" max="50" value="' +
      (p.borderRadius || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value);this.previousElementSibling.textContent='Border Radius: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width: ' +
      (p.borderWidth || 0) +
      'px</label><input type="range" min="0" max="8" value="' +
      (p.borderWidth || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value);this.previousElementSibling.textContent='Border Width: '+this.value+'px'\"></div>";
    if (p.borderWidth > 0) {
      html +=
        '<div class="rp-row"><label>Border Colour</label><input type="color" value="' +
        (p.borderColor || "#fbbf24") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Border Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderStyle',this.value)\"><option value=\"solid\"" +
        (p.borderStyle === "solid" ? " selected" : "") +
        '>Solid</option><option value="dashed"' +
        (p.borderStyle === "dashed" ? " selected" : "") +
        '>Dashed</option><option value="dotted"' +
        (p.borderStyle === "dotted" ? " selected" : "") +
        ">Dotted</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Padding V: ' +
      (p.paddingV || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingV || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value);this.previousElementSibling.textContent='Padding V: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H: ' +
      (p.paddingH || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingH || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value);this.previousElementSibling.textContent='Padding H: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity: ' +
      (p.opacity || 100) +
      '%</label><input type="range" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value);this.previousElementSibling.textContent='Opacity: '+this.value+'%'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.boxShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','boxShadow',this.checked)\"> Box Shadow</label></div>";
    if (p.boxShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.shadowBlur || 10) +
        '</label><input type="range" min="0" max="40" value="' +
        (p.shadowBlur || 10) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animation</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      (p.entranceAnim === "none" ? " selected" : "") +
      '>None</option><option value="fade"' +
      (p.entranceAnim === "fade" ? " selected" : "") +
      '>Fade</option><option value="slide-up"' +
      (p.entranceAnim === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="zoom"' +
      (p.entranceAnim === "zoom" ? " selected" : "") +
      ">Zoom</option></select></div>";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      html +=
        '<div class="rp-row"><label>Duration: ' +
        (p.animDuration || 600) +
        'ms</label><input type="range" min="200" max="2000" step="100" value="' +
        (p.animDuration || 600) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','animDuration',+this.value);this.previousElementSibling.textContent='Duration: '+this.value+'ms'\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      (p.hoverEffect === "none" ? " selected" : "") +
      '>None</option><option value="scale"' +
      (p.hoverEffect === "scale" ? " selected" : "") +
      '>Scale</option><option value="lift"' +
      (p.hoverEffect === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      (p.hoverEffect === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

// ── 6. MORPHING COUNTER ──
FB.widgets.register("morphingCounter", {
  label: "Morphing Counter",
  sublabel: "Number animation",
  icon: "0",
  iconBg: "#0d1a1a",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "typography",
  defaultProps: {
    value: 1000,
    prefix: "",
    suffix: "+",
    duration: 2000,
    color: "#cdfe00",
    bg: "#0d0d1a",
    fontSize: 72,
    fontWeight: 800,
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a0d2e",
    bgImage: "",
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "#34d399",
    borderStyle: "solid",
    paddingV: 24,
    paddingH: 24,
    marginV: 0,
    marginH: 0,
    boxShadow: false,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowBlur: 10,
    shadowSpread: 0,
    opacity: 100,
    entranceAnim: "none",
    animDuration: 600,
    animDelay: 0,
    hoverEffect: "none",
    hoverScale: 1.02,
    hoverTransition: 300,
    separatorStyle: "none",
    numberFormat: "plain",
    easingCurve: "ease-out",
    fontFamily: "Lexend",
    letterSpacing: -2,
    textAlign: "center",
    textTransform: "none",
    glowEffect: false,
    glowColor: "#cdfe00",
    glowSize: 15,
    animateOnScroll: false,
    startFrom: 0,
  },
  render: function (p) {
    var id = "counter-" + (p._blockId || Date.now());
    var containerBg = "";
    if (p.bgType === "gradient") {
      containerBg =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a0d2e") +
        ");";
    } else if (p.bgType === "image" && p.bgImage) {
      containerBg = "background:url(" + p.bgImage + ") center/cover;";
    } else {
      containerBg = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px " +
        (p.borderStyle || "solid") +
        " " +
        (p.borderColor || "#34d399") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow) {
      containerShadow =
        "box-shadow:0 " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowBlur || 10) * 2 +
        "px " +
        (p.shadowSpread || 0) +
        "px " +
        (p.shadowColor || "rgba(0,0,0,0.3)") +
        ";";
    }
    var hoverClass = "";
    var hoverStyle = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
      hoverStyle = "transition:all " + (p.hoverTransition || 300) + "ms ease;";
    }
    var animClass = "";
    var animStyle = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
      animStyle =
        "animation-duration:" +
        (p.animDuration || 600) +
        "ms;animation-delay:" +
        (p.animDelay || 0) +
        "ms;animation-fill-mode:both;";
    }
    var glowStyle = "";
    if (p.glowEffect) {
      glowStyle =
        "filter:drop-shadow(0 0 " +
        (p.glowSize || 15) +
        "px " +
        (p.glowColor || "#cdfe00") +
        ");";
    }
    var textTransformStyle = "";
    if (p.textTransform && p.textTransform !== "none") {
      textTransformStyle = "text-transform:" + p.textTransform + ";";
    }
    return (
      '<div class="veltro-counter-wrap' +
      animClass +
      hoverClass +
      '" id="' +
      id +
      '" data-value="' +
      (p.value || 1000) +
      '" data-prefix="' +
      (p.prefix || "") +
      '" data-suffix="' +
      (p.suffix || "+") +
      '" data-duration="' +
      (p.duration || 2000) +
      '" data-separator="' +
      (p.separatorStyle || "none") +
      '" data-format="' +
      (p.numberFormat || "plain") +
      '" data-easing="' +
      (p.easingCurve || "ease-out") +
      '" data-start-from="' +
      (p.startFrom || 0) +
      '" data-animate-scroll="' +
      (p.animateOnScroll ? "1" : "0") +
      '" style="height:200px;' +
      containerBg +
      containerBorder +
      containerShadow +
      hoverStyle +
      animStyle +
      "border-radius:" +
      (p.borderRadius || 8) +
      "px;" +
      "padding:" +
      (p.paddingV || 24) +
      "px " +
      (p.paddingH || 24) +
      "px;" +
      "margin:" +
      (p.marginV || 0) +
      "px " +
      (p.marginH || 0) +
      "px;" +
      "opacity:" +
      (p.opacity || 100) / 100 +
      ";" +
      'display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;"><div class="veltro-counter" style="font-size:' +
      (p.fontSize || 72) +
      "px;font-weight:" +
      (p.fontWeight || 800) +
      ";color:" +
      (p.color || "#cdfe00") +
      ";font-family:'" +
      (p.fontFamily || "Lexend") +
      "',sans-serif;user-select:none;font-variant-numeric:tabular-nums;letter-spacing:" +
      (p.letterSpacing !== undefined ? p.letterSpacing : -2) +
      "px;text-align:" +
      (p.textAlign || "center") +
      ";" +
      glowStyle +
      textTransformStyle +
      '">' +
      (p.prefix || "") +
      "0" +
      (p.suffix || "+") +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Counter</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Target Value</label><input type="number" value="' +
      (p.value || 1000) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','value',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Prefix</label><input type="text" value="' +
      (p.prefix || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','prefix',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Suffix</label><input type="text" value="' +
      (p.suffix || "+") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','suffix',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Duration: ' +
      (p.duration || 2000) +
      'ms</label><input type="range" min="500" max="5000" step="100" value="' +
      (p.duration || 2000) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','duration',+this.value);this.previousElementSibling.textContent='Duration: '+this.value+'ms'\"></div>";
    html +=
      '<div class="rp-row"><label>Start From</label><input type="number" value="' +
      (p.startFrom || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','startFrom',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.animateOnScroll ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','animateOnScroll',this.checked)\"> Animate on Scroll</label></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Number Format</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Separator Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','separatorStyle',this.value)\"><option value=\"none\"" +
      (p.separatorStyle === "none" ? " selected" : "") +
      '>None</option><option value="comma"' +
      (p.separatorStyle === "comma" ? " selected" : "") +
      '>Comma (1,000)</option><option value="space"' +
      (p.separatorStyle === "space" ? " selected" : "") +
      '>Space (1 000)</option><option value="dot"' +
      (p.separatorStyle === "dot" ? " selected" : "") +
      ">Dot (1.000)</option></select></div>";
    html +=
      '<div class="rp-row"><label>Number Format</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','numberFormat',this.value)\"><option value=\"plain\"" +
      (p.numberFormat === "plain" ? " selected" : "") +
      '>Plain</option><option value="compact"' +
      (p.numberFormat === "compact" ? " selected" : "") +
      '>Compact (1K)</option><option value="scientific"' +
      (p.numberFormat === "scientific" ? " selected" : "") +
      ">Scientific</option></select></div>";
    html +=
      '<div class="rp-row"><label>Easing Curve</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','easingCurve',this.value)\"><option value=\"ease-out\"" +
      (p.easingCurve === "ease-out" ? " selected" : "") +
      '>Ease Out</option><option value="ease-in"' +
      (p.easingCurve === "ease-in" ? " selected" : "") +
      '>Ease In</option><option value="linear"' +
      (p.easingCurve === "linear" ? " selected" : "") +
      '>Linear</option><option value="bounce"' +
      (p.easingCurve === "bounce" ? " selected" : "") +
      ">Bounce</option></select></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Typography & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Font Size: ' +
      (p.fontSize || 72) +
      'px</label><input type="range" min="24" max="150" value="' +
      (p.fontSize || 72) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontSize',+this.value);this.previousElementSibling.textContent='Font Size: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Weight: ' +
      (p.fontWeight || 800) +
      '</label><input type="range" min="100" max="900" step="100" value="' +
      (p.fontWeight || 800) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontWeight',+this.value);this.previousElementSibling.textContent='Font Weight: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Family</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontFamily',this.value)\"><option value=\"Lexend\"" +
      (p.fontFamily === "Lexend" ? " selected" : "") +
      '>Lexend</option><option value="Inter"' +
      (p.fontFamily === "Inter" ? " selected" : "") +
      '>Inter</option><option value="monospace"' +
      (p.fontFamily === "monospace" ? " selected" : "") +
      ">Monospace</option></select></div>";
    html +=
      '<div class="rp-row"><label>Letter Spacing: ' +
      (p.letterSpacing !== undefined ? p.letterSpacing : -2) +
      'px</label><input type="range" min="-10" max="20" value="' +
      (p.letterSpacing !== undefined ? p.letterSpacing : -2) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','letterSpacing',+this.value);this.previousElementSibling.textContent='Letter Spacing: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Text Align</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textAlign',this.value)\"><option value=\"left\"" +
      (p.textAlign === "left" ? " selected" : "") +
      '>Left</option><option value="center"' +
      (p.textAlign === "center" ? " selected" : "") +
      '>Center</option><option value="right"' +
      (p.textAlign === "right" ? " selected" : "") +
      ">Right</option></select></div>";
    html +=
      '<div class="rp-row"><label>Text Transform</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textTransform',this.value)\"><option value=\"none\"" +
      (p.textTransform === "none" ? " selected" : "") +
      '>None</option><option value="uppercase"' +
      (p.textTransform === "uppercase" ? " selected" : "") +
      ">UPPERCASE</option></select></div>";
    html +=
      '<div class="rp-row"><label>Text Colour</label><div class="rp-colour-row"><input type="color" value="' +
      (p.color || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      '\',\'color\',this.value)"><input type="text" value="' +
      (p.color || "#cdfe00") +
      '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color',this.value)\"></div></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.glowEffect ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','glowEffect',this.checked)\"> Glow Effect</label></div>";
    if (p.glowEffect) {
      html +=
        '<div class="rp-row"><label>Glow Colour</label><input type="color" value="' +
        (p.glowColor || "#cdfe00") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Glow Size: ' +
        (p.glowSize || 15) +
        'px</label><input type="range" min="5" max="50" value="' +
        (p.glowSize || 15) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowSize',+this.value);this.previousElementSibling.textContent='Glow Size: '+this.value+'px'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      (p.bgType === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      (p.bgType === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      (p.bgType === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if (p.bgType === "solid") {
      html +=
        '<div class="rp-row"><label>Background Colour</label><div class="rp-colour-row"><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        '\',\'bg\',this.value)"><input type="text" value="' +
        (p.bg || "#0d0d1a") +
        '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div></div>";
    } else if (p.bgType === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Colour 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Colour 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a0d2e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        (p.bgGradientDir === "135deg" ? " selected" : "") +
        '>135°</option><option value="90deg"' +
        (p.bgGradientDir === "90deg" ? " selected" : "") +
        ">90°</option></select></div>";
    } else if (p.bgType === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImage || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImage',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius: ' +
      (p.borderRadius || 8) +
      'px</label><input type="range" min="0" max="50" value="' +
      (p.borderRadius || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value);this.previousElementSibling.textContent='Border Radius: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width: ' +
      (p.borderWidth || 0) +
      'px</label><input type="range" min="0" max="8" value="' +
      (p.borderWidth || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value);this.previousElementSibling.textContent='Border Width: '+this.value+'px'\"></div>";
    if (p.borderWidth > 0) {
      html +=
        '<div class="rp-row"><label>Border Colour</label><input type="color" value="' +
        (p.borderColor || "#34d399") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Border Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderStyle',this.value)\"><option value=\"solid\"" +
        (p.borderStyle === "solid" ? " selected" : "") +
        '>Solid</option><option value="dashed"' +
        (p.borderStyle === "dashed" ? " selected" : "") +
        '>Dashed</option><option value="dotted"' +
        (p.borderStyle === "dotted" ? " selected" : "") +
        ">Dotted</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Padding V: ' +
      (p.paddingV || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingV || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value);this.previousElementSibling.textContent='Padding V: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H: ' +
      (p.paddingH || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingH || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value);this.previousElementSibling.textContent='Padding H: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity: ' +
      (p.opacity || 100) +
      '%</label><input type="range" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value);this.previousElementSibling.textContent='Opacity: '+this.value+'%'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.boxShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','boxShadow',this.checked)\"> Box Shadow</label></div>";
    if (p.boxShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.shadowBlur || 10) +
        '</label><input type="range" min="0" max="40" value="' +
        (p.shadowBlur || 10) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animation</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      (p.entranceAnim === "none" ? " selected" : "") +
      '>None</option><option value="fade"' +
      (p.entranceAnim === "fade" ? " selected" : "") +
      '>Fade</option><option value="slide-up"' +
      (p.entranceAnim === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="zoom"' +
      (p.entranceAnim === "zoom" ? " selected" : "") +
      ">Zoom</option></select></div>";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      html +=
        '<div class="rp-row"><label>Duration: ' +
        (p.animDuration || 600) +
        'ms</label><input type="range" min="200" max="2000" step="100" value="' +
        (p.animDuration || 600) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','animDuration',+this.value);this.previousElementSibling.textContent='Duration: '+this.value+'ms'\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      (p.hoverEffect === "none" ? " selected" : "") +
      '>None</option><option value="scale"' +
      (p.hoverEffect === "scale" ? " selected" : "") +
      '>Scale</option><option value="lift"' +
      (p.hoverEffect === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      (p.hoverEffect === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

// ── 7. LIQUID TEXT ──
FB.widgets.register("liquidText", {
  label: "Liquid Text",
  sublabel: "Wave distortion",
  icon: "~",
  iconBg: "#0d0d2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "typography",
  defaultProps: {
    text: "LIQUID",
    fontSize: 80,
    fontWeight: 900,
    color: "#3b82f6",
    bg: "#0d0d1a",
    amplitude: 10,
    frequency: 0.05,
    speed: 0.02,
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a0d2e",
    bgImage: "",
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "#60a5fa",
    borderStyle: "solid",
    paddingV: 24,
    paddingH: 24,
    marginV: 0,
    marginH: 0,
    boxShadow: false,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowBlur: 10,
    shadowSpread: 0,
    opacity: 100,
    entranceAnim: "none",
    animDuration: 600,
    animDelay: 0,
    hoverEffect: "none",
    hoverScale: 1.02,
    hoverTransition: 300,
    waveType: "sine",
    perCharRandom: false,
    filterIntensity: 1,
    fontFamily: "Lexend",
    letterSpacing: 0,
    textTransform: "none",
    glowEffect: false,
    glowColor: "#3b82f6",
    glowSize: 15,
    textShadow: false,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowBlur: 4,
    dualColour: false,
    dualColour2: "#ec4899",
  },
  render: function (p) {
    var id = "liquid-" + (p._blockId || Date.now());
    var chars = (p.text || "LIQUID").split("");
    var charHtml = chars
      .map(function (c, i) {
        var col = "";
        if (p.dualColour) {
          var colors = [p.color || "#3b82f6", p.dualColour2 || "#ec4899"];
          col = "color:" + colors[i % 2] + ";";
        }
        return (
          '<span class="veltro-liquid-char" data-index="' +
          i +
          '" style="display:inline-block;transition:none;' +
          col +
          '">' +
          c +
          "</span>"
        );
      })
      .join("");
    var containerBg = "";
    if (p.bgType === "gradient") {
      containerBg =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a0d2e") +
        ");";
    } else if (p.bgType === "image" && p.bgImage) {
      containerBg = "background:url(" + p.bgImage + ") center/cover;";
    } else {
      containerBg = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px " +
        (p.borderStyle || "solid") +
        " " +
        (p.borderColor || "#60a5fa") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow) {
      containerShadow =
        "box-shadow:0 " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowBlur || 10) * 2 +
        "px " +
        (p.shadowSpread || 0) +
        "px " +
        (p.shadowColor || "rgba(0,0,0,0.3)") +
        ";";
    }
    var hoverClass = "";
    var hoverStyle = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
      hoverStyle = "transition:all " + (p.hoverTransition || 300) + "ms ease;";
    }
    var animClass = "";
    var animStyle = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
      animStyle =
        "animation-duration:" +
        (p.animDuration || 600) +
        "ms;animation-delay:" +
        (p.animDelay || 0) +
        "ms;animation-fill-mode:both;";
    }
    var glowStyle = "";
    if (p.glowEffect) {
      glowStyle =
        "filter:drop-shadow(0 0 " +
        (p.glowSize || 15) +
        "px " +
        (p.glowColor || "#3b82f6") +
        ");";
    }
    var textShadowStyle = "";
    if (p.textShadow) {
      textShadowStyle =
        "text-shadow:" +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowBlur || 4) * 2 +
        "px " +
        (p.textShadowColor || "rgba(0,0,0,0.5)") +
        ";";
    }
    var textTransformStyle = "";
    if (p.textTransform && p.textTransform !== "none") {
      textTransformStyle = "text-transform:" + p.textTransform + ";";
    }
    var filterScale = (p.amplitude || 10) * (p.filterIntensity || 1);
    return (
      '<div class="veltro-liquid-wrap' +
      animClass +
      hoverClass +
      '" id="' +
      id +
      '" data-amplitude="' +
      (p.amplitude || 10) +
      '" data-frequency="' +
      (p.frequency || 0.05) +
      '" data-speed="' +
      (p.speed || 0.02) +
      '" data-wave-type="' +
      (p.waveType || "sine") +
      '" data-per-char="' +
      (p.perCharRandom ? "1" : "0") +
      '" data-filter-intensity="' +
      (p.filterIntensity || 1) +
      '" data-dual-colour="' +
      (p.dualColour ? "1" : "0") +
      '" style="height:200px;' +
      containerBg +
      containerBorder +
      containerShadow +
      hoverStyle +
      animStyle +
      "border-radius:" +
      (p.borderRadius || 8) +
      "px;" +
      "padding:" +
      (p.paddingV || 24) +
      "px " +
      (p.paddingH || 24) +
      "px;" +
      "margin:" +
      (p.marginV || 0) +
      "px " +
      (p.marginH || 0) +
      "px;" +
      "opacity:" +
      (p.opacity || 100) / 100 +
      ";" +
      'display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;"><div class="veltro-liquid-text" style="font-size:' +
      (p.fontSize || 80) +
      "px;font-weight:" +
      (p.fontWeight || 900) +
      ";color:" +
      (p.color || "#3b82f6") +
      ";font-family:'" +
      (p.fontFamily || "Lexend") +
      "',sans-serif;user-select:none;letter-spacing:" +
      (p.letterSpacing || 0) +
      "px;" +
      textShadowStyle +
      textTransformStyle +
      glowStyle +
      "filter:url(#liquid-filter-" +
      id +
      ')">' +
      charHtml +
      '</div><svg style="position:absolute;width:0;height:0"><defs><filter id="liquid-filter-' +
      id +
      '"><feTurbulence type="fractalNoise" baseFrequency="' +
      (p.frequency || 0.05) +
      '" numOctaves="2" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="' +
      filterScale +
      '" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg></div>'
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Text & Wave</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text</label><input type="text" value="' +
      (p.text || "LIQUID") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','text',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Font Size: ' +
      (p.fontSize || 80) +
      'px</label><input type="range" min="24" max="150" value="' +
      (p.fontSize || 80) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontSize',+this.value);this.previousElementSibling.textContent='Font Size: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Weight: ' +
      (p.fontWeight || 900) +
      '</label><input type="range" min="100" max="900" step="100" value="' +
      (p.fontWeight || 900) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontWeight',+this.value);this.previousElementSibling.textContent='Font Weight: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Family</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontFamily',this.value)\"><option value=\"Lexend\"" +
      (p.fontFamily === "Lexend" ? " selected" : "") +
      '>Lexend</option><option value="Inter"' +
      (p.fontFamily === "Inter" ? " selected" : "") +
      ">Inter</option></select></div>";
    html +=
      '<div class="rp-row"><label>Letter Spacing: ' +
      (p.letterSpacing || 0) +
      'px</label><input type="range" min="-5" max="20" value="' +
      (p.letterSpacing || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','letterSpacing',+this.value);this.previousElementSibling.textContent='Letter Spacing: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Text Transform</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textTransform',this.value)\"><option value=\"none\"" +
      (p.textTransform === "none" ? " selected" : "") +
      '>None</option><option value="uppercase"' +
      (p.textTransform === "uppercase" ? " selected" : "") +
      ">UPPERCASE</option></select></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Distortion</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Wave Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','waveType',this.value)\"><option value=\"sine\"" +
      (p.waveType === "sine" ? " selected" : "") +
      '>Sine</option><option value="square"' +
      (p.waveType === "square" ? " selected" : "") +
      '>Square</option><option value="triangle"' +
      (p.waveType === "triangle" ? " selected" : "") +
      ">Triangle</option></select></div>";
    html +=
      '<div class="rp-row"><label>Amplitude: ' +
      (p.amplitude || 10) +
      '</label><input type="range" min="0" max="30" step="0.5" value="' +
      (p.amplitude || 10) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','amplitude',+this.value);this.previousElementSibling.textContent='Amplitude: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Frequency: ' +
      (p.frequency || 0.05) +
      '</label><input type="range" min="0.01" max="0.2" step="0.01" value="' +
      (p.frequency || 0.05) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','frequency',+this.value);this.previousElementSibling.textContent='Frequency: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Speed: ' +
      (p.speed || 0.02) +
      '</label><input type="range" min="0.005" max="0.1" step="0.005" value="' +
      (p.speed || 0.02) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','speed',+this.value);this.previousElementSibling.textContent='Speed: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Filter Intensity: ' +
      (p.filterIntensity || 1) +
      'x</label><input type="range" min="0" max="3" step="0.1" value="' +
      (p.filterIntensity || 1) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','filterIntensity',+this.value);this.previousElementSibling.textContent='Filter Intensity: '+this.value+'x'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.perCharRandom ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','perCharRandom',this.checked)\"> Per-Char Random</label></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Colour & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text Colour</label><div class="rp-colour-row"><input type="color" value="' +
      (p.color || "#3b82f6") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      '\',\'color\',this.value)"><input type="text" value="' +
      (p.color || "#3b82f6") +
      '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color',this.value)\"></div></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.dualColour ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','dualColour',this.checked)\"> Dual Colour</label></div>";
    if (p.dualColour) {
      html +=
        '<div class="rp-row"><label>Colour 2</label><input type="color" value="' +
        (p.dualColour2 || "#ec4899") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','dualColour2',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.glowEffect ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','glowEffect',this.checked)\"> Glow Effect</label></div>";
    if (p.glowEffect) {
      html +=
        '<div class="rp-row"><label>Glow Colour</label><input type="color" value="' +
        (p.glowColor || "#3b82f6") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Glow Size: ' +
        (p.glowSize || 15) +
        'px</label><input type="range" min="5" max="50" value="' +
        (p.glowSize || 15) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowSize',+this.value);this.previousElementSibling.textContent='Glow Size: '+this.value+'px'\"></div>";
    }
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.textShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','textShadow',this.checked)\"> Text Shadow</label></div>";
    if (p.textShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Colour</label><input type="color" value="' +
        (p.textShadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.textShadowBlur || 4) +
        '</label><input type="range" min="0" max="20" value="' +
        (p.textShadowBlur || 4) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      (p.bgType === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      (p.bgType === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      (p.bgType === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if (p.bgType === "solid") {
      html +=
        '<div class="rp-row"><label>Background Colour</label><div class="rp-colour-row"><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        '\',\'bg\',this.value)"><input type="text" value="' +
        (p.bg || "#0d0d1a") +
        '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div></div>";
    } else if (p.bgType === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Colour 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Colour 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a0d2e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        (p.bgGradientDir === "135deg" ? " selected" : "") +
        '>135°</option><option value="90deg"' +
        (p.bgGradientDir === "90deg" ? " selected" : "") +
        ">90°</option></select></div>";
    } else if (p.bgType === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImage || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImage',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius: ' +
      (p.borderRadius || 8) +
      'px</label><input type="range" min="0" max="50" value="' +
      (p.borderRadius || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value);this.previousElementSibling.textContent='Border Radius: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width: ' +
      (p.borderWidth || 0) +
      'px</label><input type="range" min="0" max="8" value="' +
      (p.borderWidth || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value);this.previousElementSibling.textContent='Border Width: '+this.value+'px'\"></div>";
    if (p.borderWidth > 0) {
      html +=
        '<div class="rp-row"><label>Border Colour</label><input type="color" value="' +
        (p.borderColor || "#60a5fa") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Border Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderStyle',this.value)\"><option value=\"solid\"" +
        (p.borderStyle === "solid" ? " selected" : "") +
        '>Solid</option><option value="dashed"' +
        (p.borderStyle === "dashed" ? " selected" : "") +
        ">Dashed</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Padding V: ' +
      (p.paddingV || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingV || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value);this.previousElementSibling.textContent='Padding V: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H: ' +
      (p.paddingH || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingH || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value);this.previousElementSibling.textContent='Padding H: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity: ' +
      (p.opacity || 100) +
      '%</label><input type="range" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value);this.previousElementSibling.textContent='Opacity: '+this.value+'%'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.boxShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','boxShadow',this.checked)\"> Box Shadow</label></div>";
    if (p.boxShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.shadowBlur || 10) +
        '</label><input type="range" min="0" max="40" value="' +
        (p.shadowBlur || 10) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animation</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      (p.entranceAnim === "none" ? " selected" : "") +
      '>None</option><option value="fade"' +
      (p.entranceAnim === "fade" ? " selected" : "") +
      '>Fade</option><option value="slide-up"' +
      (p.entranceAnim === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="zoom"' +
      (p.entranceAnim === "zoom" ? " selected" : "") +
      ">Zoom</option></select></div>";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      html +=
        '<div class="rp-row"><label>Duration: ' +
        (p.animDuration || 600) +
        'ms</label><input type="range" min="200" max="2000" step="100" value="' +
        (p.animDuration || 600) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','animDuration',+this.value);this.previousElementSibling.textContent='Duration: '+this.value+'ms'\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      (p.hoverEffect === "none" ? " selected" : "") +
      '>None</option><option value="scale"' +
      (p.hoverEffect === "scale" ? " selected" : "") +
      '>Scale</option><option value="lift"' +
      (p.hoverEffect === "lift" ? " selected" : "") +
      ">Lift</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

// ── 8. IMAGE PHYSICS ──
FB.widgets.register("imagePhysics", {
  label: "Image Physics",
  sublabel: "Matter.js images",
  icon: "◈",
  iconBg: "#1a0d2e",
  iconColor: "#a78bfa",
  category: "veltro",
  subCategory: "physics",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    images: [
      "https://picsum.photos/100/100?random=1",
      "https://picsum.photos/100/100?random=2",
      "https://picsum.photos/100/100?random=3",
    ],
    gravity: 1,
    restitution: 0.5,
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a1a3e",
    bgImageUrl: "",
    bgImageOpacity: 30,
    bgImageSize: "cover",
    borderRadius: 4,
    borderWidth: 0,
    borderColor: "#ffffff",
    boxShadow: "none",
    shadowColor: "#000000",
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    paddingV: 0,
    paddingH: 0,
    marginV: 0,
    marginH: 0,
    opacity: 100,
    entranceAnim: "none",
    hoverEffect: "none",
    hoverTransition: 300,
    animDuration: 600,
    imageShape: "square",
    imageSize: 80,
    imageBorderRadius: 8,
    imageBorderWidth: 0,
    imageBorderColor: "#ffffff",
    physicsEnabled: true,
    mouseInteraction: true,
    mouseForce: 5,
    windEnabled: false,
    windStrength: 0,
  },
  render: function (p) {
    var id = "iphys-" + (p._blockId || Date.now());
    var imagesJson = JSON.stringify(
      p.images || ["https://picsum.photos/100/100?random=1"],
    );
    var bgType = p.bgType || "solid";
    var bgStyle = "";
    if (bgType === "gradient") {
      bgStyle =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a1a3e") +
        ");";
    } else if (bgType === "image" && p.bgImageUrl) {
      bgStyle =
        "background:url('" +
        p.bgImageUrl +
        "') center/" +
        (p.bgImageSize || "cover") +
        " no-repeat;background-color:" +
        (p.bg || "#0d0d1a") +
        ";";
    } else {
      bgStyle = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth && p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px solid " +
        (p.borderColor || "#ffffff") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow && p.boxShadow !== "none") {
      containerShadow =
        "box-shadow:" +
        (p.shadowOffsetX || 0) +
        "px " +
        (p.shadowOffsetY || 4) +
        "px " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowColor || "#000000") +
        ";";
    }
    var hoverClass = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
    }
    var animClass = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
    }
    var padStyle =
      "padding:" + (p.paddingV || 0) + "px " + (p.paddingH || 0) + "px;";
    var margStyle =
      "margin:" + (p.marginV || 0) + "px " + (p.marginH || 0) + "px;";
    var opStyle =
      p.opacity && p.opacity < 100 ? "opacity:" + p.opacity / 100 + ";" : "";
    return (
      '<div class="veltro-iphys-wrap' +
      animClass +
      hoverClass +
      '" id="' +
      id +
      '" data-images="' +
      imagesJson.replace(/"/g, "&quot;") +
      '" data-gravity="' +
      (p.gravity || 1) +
      '" data-restitution="' +
      (p.restitution || 0.5) +
      '" data-image-shape="' +
      (p.imageShape || "square") +
      '" data-image-size="' +
      (p.imageSize || 80) +
      '" data-image-border-radius="' +
      (p.imageBorderRadius || 8) +
      '" data-image-border-width="' +
      (p.imageBorderWidth || 0) +
      '" data-image-border-color="' +
      (p.imageBorderColor || "#ffffff") +
      '" data-physics-enabled="' +
      (p.physicsEnabled !== false ? "true" : "false") +
      '" data-mouse-interaction="' +
      (p.mouseInteraction !== false ? "true" : "false") +
      '" data-mouse-force="' +
      (p.mouseForce || 5) +
      '" data-wind-enabled="' +
      (p.windEnabled ? "true" : "false") +
      '" data-wind-strength="' +
      (p.windStrength || 0) +
      '" style="height:' +
      p.height +
      "px;" +
      bgStyle +
      "position:relative;overflow:hidden;border-radius:" +
      (p.borderRadius || 4) +
      "px;cursor:pointer;" +
      containerBorder +
      containerShadow +
      padStyle +
      margStyle +
      opStyle +
      '"><canvas class="veltro-iphys-canvas" style="position:absolute;inset:0;width:100%;height:100%"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Core Settings</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Gravity</label><input type="number" step="0.1" value="' +
      (p.gravity || 1) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','gravity',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Restitution</label><input type="number" step="0.05" min="0" max="1" value="' +
      (p.restitution || 0.5) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','restitution',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Background & Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      ((p.bgType || "solid") === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      ((p.bgType || "solid") === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      ((p.bgType || "solid") === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if ((p.bgType || "solid") === "solid") {
      html +=
        '<div class="rp-row"><label>Background Color</label><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        ((p.bgGradientDir || "135deg") === "135deg" ? " selected" : "") +
        '>135°</option><option value="to right"' +
        ((p.bgGradientDir || "135deg") === "to right" ? " selected" : "") +
        '>Left→Right</option><option value="to bottom"' +
        ((p.bgGradientDir || "135deg") === "to bottom" ? " selected" : "") +
        '>Top→Bottom</option><option value="circle"' +
        ((p.bgGradientDir || "135deg") === "circle" ? " selected" : "") +
        ">Radial</option></select></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a1a3e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImageUrl || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageUrl',this.value)\" placeholder=\"https://...\"></div>";
      html +=
        '<div class="rp-row"><label>Image Opacity (%)</label><input type="number" min="0" max="100" value="' +
        (p.bgImageOpacity || 30) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageOpacity',+this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Image Size</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageSize',this.value)\"><option value=\"cover\"" +
        ((p.bgImageSize || "cover") === "cover" ? " selected" : "") +
        '>Cover</option><option value="contain"' +
        ((p.bgImageSize || "cover") === "contain" ? " selected" : "") +
        '>Contain</option><option value="100% 100%"' +
        ((p.bgImageSize || "cover") === "100% 100%" ? " selected" : "") +
        ">Stretch</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius (px)</label><input type="number" value="' +
      (p.borderRadius || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width (px)</label><input type="number" value="' +
      (p.borderWidth || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Color</label><input type="color" value="' +
      (p.borderColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Box Shadow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','boxShadow',this.value)\"><option value=\"none\"" +
      ((p.boxShadow || "none") === "none" ? " selected" : "") +
      '>None</option><option value="soft"' +
      ((p.boxShadow || "none") === "soft" ? " selected" : "") +
      '>Soft</option><option value="hard"' +
      ((p.boxShadow || "none") === "hard" ? " selected" : "") +
      '>Hard</option><option value="glow"' +
      ((p.boxShadow || "none") === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    if (p.boxShadow && p.boxShadow !== "none") {
      html +=
        '<div class="rp-row"><label>Shadow Color</label><input type="color" value="' +
        (p.shadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur</label><input type="number" value="' +
        (p.shadowBlur || 10) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Spacing & Display</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Padding V (px)</label><input type="number" value="' +
      (p.paddingV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H (px)</label><input type="number" value="' +
      (p.paddingH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin V (px)</label><input type="number" value="' +
      (p.marginV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin H (px)</label><input type="number" value="' +
      (p.marginH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animations & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      ((p.entranceAnim || "none") === "none" ? " selected" : "") +
      '>None</option><option value="fade-in"' +
      ((p.entranceAnim || "none") === "fade-in" ? " selected" : "") +
      '>Fade In</option><option value="slide-up"' +
      ((p.entranceAnim || "none") === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="slide-left"' +
      ((p.entranceAnim || "none") === "slide-left" ? " selected" : "") +
      '>Slide Left</option><option value="zoom-in"' +
      ((p.entranceAnim || "none") === "zoom-in" ? " selected" : "") +
      '>Zoom In</option><option value="flip-in"' +
      ((p.entranceAnim || "none") === "flip-in" ? " selected" : "") +
      ">Flip In</option></select></div>";
    html +=
      '<div class="rp-row"><label>Animation Duration (ms)</label><input type="number" value="' +
      (p.animDuration || 600) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','animDuration',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      ((p.hoverEffect || "none") === "none" ? " selected" : "") +
      '>None</option><option value="lift"' +
      ((p.hoverEffect || "none") === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      ((p.hoverEffect || "none") === "glow" ? " selected" : "") +
      '>Glow</option><option value="scale"' +
      ((p.hoverEffect || "none") === "scale" ? " selected" : "") +
      '>Scale</option><option value="tilt"' +
      ((p.hoverEffect || "none") === "tilt" ? " selected" : "") +
      ">Tilt</option></select></div>";
    html +=
      '<div class="rp-row"><label>Hover Transition (ms)</label><input type="number" value="' +
      (p.hoverTransition || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverTransition',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Images</span></div><div class="rp-section-body">';
    var imgs =
      p.images && p.images.length
        ? p.images
        : ["https://picsum.photos/100/100?random=1"];
    html +=
      '<div class="rp-row" style="flex-direction:column;align-items:flex-start"><label>Image URLs</label>';
    html +=
      '<textarea rows="' +
      Math.max(3, Math.min(8, imgs.length)) +
      '" style="width:100%;font-size:11px;font-family:monospace;background:#1a1a1a;border:1px solid #333;border-radius:4px;color:#fff;padding:4px" onchange="try{var v=this.value.split(\'\n\').filter(function(s){return s.trim()}).map(function(s){return s.trim()});FB.panels.updateWidgetProp(\'' +
      id +
      "','images',v.length?v:['https://picsum.photos/100/100?random=1'])}catch(e){}" +
      '">' +
      imgs.join("\n").replace(/</g, "&lt;") +
      "</textarea>";
    html +=
      '<span style="font-size:9px;opacity:0.5;margin-top:2px">One URL per line. Supports any image URL (Unsplash, Picsum, your own host).</span>';
    html += "</div></div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Advanced Physics Options</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Image Size</label><input type="range" min="30" max="200" value="' +
      (p.imageSize || 80) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','imageSize',+this.value)\"><span style=\"font-size:10px;min-width:30px;text-align:right\">" +
      (p.imageSize || 80) +
      "px</span></div>";
    html +=
      '<div class="rp-row"><label>Image Shape</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','imageShape',this.value)\"><option value=\"square\"" +
      ((p.imageShape || "square") === "square" ? " selected" : "") +
      '>Square</option><option value="circle"' +
      ((p.imageShape || "square") === "circle" ? " selected" : "") +
      '>Circle</option><option value="triangle"' +
      ((p.imageShape || "square") === "triangle" ? " selected" : "") +
      '>Triangle</option><option value="pentagon"' +
      ((p.imageShape || "square") === "pentagon" ? " selected" : "") +
      '>Pentagon</option><option value="hexagon"' +
      ((p.imageShape || "square") === "hexagon" ? " selected" : "") +
      '>Hexagon</option><option value="octagon"' +
      ((p.imageShape || "square") === "octagon" ? " selected" : "") +
      '>Octagon</option><option value="star"' +
      ((p.imageShape || "square") === "star" ? " selected" : "") +
      '>Star</option><option value="heart"' +
      ((p.imageShape || "square") === "heart" ? " selected" : "") +
      ">Heart</option></select></div>";
    html +=
      '<div class="rp-row"><label>Image Border Radius</label><input type="number" value="' +
      (p.imageBorderRadius || 8) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','imageBorderRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Image Border Width</label><input type="number" value="' +
      (p.imageBorderWidth || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','imageBorderWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Image Border Color</label><input type="color" value="' +
      (p.imageBorderColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','imageBorderColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Physics Enabled</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','physicsEnabled',this.value)\"><option value=\"true\"" +
      (p.physicsEnabled !== false ? " selected" : "") +
      '>Enabled</option><option value="false"' +
      (p.physicsEnabled === false ? " selected" : "") +
      ">Disabled</option></select></div>";
    html +=
      '<div class="rp-row"><label>Mouse Interaction</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','mouseInteraction',this.value)\"><option value=\"true\"" +
      (p.mouseInteraction !== false ? " selected" : "") +
      '>Enabled</option><option value="false"' +
      (p.mouseInteraction === false ? " selected" : "") +
      ">Disabled</option></select></div>";
    html +=
      '<div class="rp-row"><label>Mouse Force</label><input type="number" value="' +
      (p.mouseForce || 5) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','mouseForce',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Wind Enabled</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','windEnabled',this.value)\"><option value=\"false\"" +
      (!p.windEnabled ? " selected" : "") +
      '>Off</option><option value="true"' +
      (p.windEnabled ? " selected" : "") +
      ">On</option></select></div>";
    if (p.windEnabled) {
      html +=
        '<div class="rp-row"><label>Wind Strength</label><input type="number" step="0.1" value="' +
        (p.windStrength || 0) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','windStrength',+this.value)\"></div>";
    }
    html += "</div></div>";
    return html;
  },
});

// ── 9. BUBBLE POP ──
FB.widgets.register("bubblePop", {
  label: "Bubble Pop",
  sublabel: "Interactive bubbles",
  icon: "○",
  iconBg: "#0d1a2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "physics",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    bubbleCount: 20,
    minSize: 20,
    maxSize: 60,
    colors: "#ff6b35,#cdfe00,#3b82f6,#ec4899,#f59e0b",
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a1a3e",
    bgImageUrl: "",
    bgImageOpacity: 30,
    bgImageSize: "cover",
    borderRadius: 4,
    borderWidth: 0,
    borderColor: "#ffffff",
    boxShadow: "none",
    shadowColor: "#000000",
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    paddingV: 0,
    paddingH: 0,
    marginV: 0,
    marginH: 0,
    opacity: 100,
    entranceAnim: "none",
    hoverEffect: "none",
    hoverTransition: 300,
    animDuration: 600,
    bubbleOpacity: 80,
    bubbleGlow: true,
    bubbleSpeed: 1,
    bubbleRise: true,
    bubbleMerge: false,
    bubblePopSound: false,
    bubbleShape: "circle",
    contentTitle: "",
    contentSubtitle: "",
    contentColor: "#ffffff",
    contentAlign: "center",
    contentVAlign: "center",
    bubbleStroke: false,
    strokeColor: "#ffffff",
    strokeWidth: 1,
  },
  render: function (p) {
    var id = "bubble-" + (p._blockId || Date.now());
    var bgType = p.bgType || "solid";
    var bgStyle = "";
    if (bgType === "gradient") {
      bgStyle =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a1a3e") +
        ");";
    } else if (bgType === "image" && p.bgImageUrl) {
      bgStyle =
        "background:url('" +
        p.bgImageUrl +
        "') center/" +
        (p.bgImageSize || "cover") +
        " no-repeat;background-color:" +
        (p.bg || "#0d0d1a") +
        ";";
    } else {
      bgStyle = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth && p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px solid " +
        (p.borderColor || "#ffffff") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow && p.boxShadow !== "none") {
      containerShadow =
        "box-shadow:" +
        (p.shadowOffsetX || 0) +
        "px " +
        (p.shadowOffsetY || 4) +
        "px " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowColor || "#000000") +
        ";";
    }
    var hoverClass = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
    }
    var animClass = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
    }
    var padStyle =
      "padding:" + (p.paddingV || 0) + "px " + (p.paddingH || 0) + "px;";
    var margStyle =
      "margin:" + (p.marginV || 0) + "px " + (p.marginH || 0) + "px;";
    var opStyle =
      p.opacity && p.opacity < 100 ? "opacity:" + p.opacity / 100 + ";" : "";
    return (
      '<div class="veltro-bubble-wrap' +
      animClass +
      hoverClass +
      '" id="' +
      id +
      '" data-bubble-count="' +
      (p.bubbleCount || 20) +
      '" data-min-size="' +
      (p.minSize || 20) +
      '" data-max-size="' +
      (p.maxSize || 60) +
      '" data-colors="' +
      (p.colors || "#ff6b35,#cdfe00,#3b82f6,#ec4899,#f59e0b") +
      '" data-bubble-opacity="' +
      (p.bubbleOpacity || 80) +
      '" data-bubble-glow="' +
      (p.bubbleGlow !== false ? "true" : "false") +
      '" data-bubble-speed="' +
      (p.bubbleSpeed || 1) +
      '" data-bubble-rise="' +
      (p.bubbleRise !== false ? "true" : "false") +
      '" data-bubble-merge="' +
      (p.bubbleMerge ? "true" : "false") +
      '" data-bubble-shape="' +
      (p.bubbleShape || "circle") +
      '" data-bubble-stroke="' +
      (p.bubbleStroke ? "true" : "false") +
      '" data-stroke-color="' +
      (p.strokeColor || "#ffffff") +
      '" data-stroke-width="' +
      (p.strokeWidth || 1) +
      '" style="height:' +
      p.height +
      "px;" +
      bgStyle +
      "position:relative;overflow:hidden;border-radius:" +
      (p.borderRadius || 4) +
      "px;cursor:pointer;" +
      containerBorder +
      containerShadow +
      padStyle +
      margStyle +
      opStyle +
      '"><canvas class="veltro-bubble-canvas" style="position:absolute;inset:0;width:100%;height:100%"></canvas>' +
      (p.contentTitle || p.contentSubtitle
        ? '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:' +
          (p.contentAlign === "left"
            ? "flex-start"
            : p.contentAlign === "right"
              ? "flex-end"
              : "center") +
          ";justify-content:" +
          (p.contentVAlign === "top"
            ? "flex-start"
            : p.contentVAlign === "bottom"
              ? "flex-end"
              : "center") +
          ';padding:24px;pointer-events:none;z-index:2;">' +
          (p.contentTitle
            ? '<div style="color:' +
              (p.contentColor || "#ffffff") +
              ";font-size:2em;font-weight:700;text-align:" +
              (p.contentAlign || "center") +
              ';">' +
              p.contentTitle +
              "</div>"
            : "") +
          (p.contentSubtitle
            ? '<div style="color:' +
              (p.contentColor || "#ffffff") +
              ";font-size:1.1em;opacity:0.8;margin-top:8px;text-align:" +
              (p.contentAlign || "center") +
              ';">' +
              p.contentSubtitle +
              "</div>"
            : "") +
          "</div>"
        : "") +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Core Settings</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Bubble Count</label><input type="number" value="' +
      (p.bubbleCount || 20) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bubbleCount',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Min Size</label><input type="number" value="' +
      (p.minSize || 20) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','minSize',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Max Size</label><input type="number" value="' +
      (p.maxSize || 60) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','maxSize',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Colors (comma-sep)</label><input type="text" value="' +
      (p.colors || "#ff6b35,#cdfe00,#3b82f6,#ec4899,#f59e0b") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','colors',this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Background & Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      ((p.bgType || "solid") === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      ((p.bgType || "solid") === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      ((p.bgType || "solid") === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if ((p.bgType || "solid") === "solid") {
      html +=
        '<div class="rp-row"><label>Background Color</label><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        ((p.bgGradientDir || "135deg") === "135deg" ? " selected" : "") +
        '>135°</option><option value="to right"' +
        ((p.bgGradientDir || "135deg") === "to right" ? " selected" : "") +
        '>Left→Right</option><option value="to bottom"' +
        ((p.bgGradientDir || "135deg") === "to bottom" ? " selected" : "") +
        '>Top→Bottom</option><option value="circle"' +
        ((p.bgGradientDir || "135deg") === "circle" ? " selected" : "") +
        ">Radial</option></select></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a1a3e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImageUrl || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageUrl',this.value)\" placeholder=\"https://...\"></div>";
      html +=
        '<div class="rp-row"><label>Image Opacity (%)</label><input type="number" min="0" max="100" value="' +
        (p.bgImageOpacity || 30) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageOpacity',+this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Image Size</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageSize',this.value)\"><option value=\"cover\"" +
        ((p.bgImageSize || "cover") === "cover" ? " selected" : "") +
        '>Cover</option><option value="contain"' +
        ((p.bgImageSize || "cover") === "contain" ? " selected" : "") +
        '>Contain</option><option value="100% 100%"' +
        ((p.bgImageSize || "cover") === "100% 100%" ? " selected" : "") +
        ">Stretch</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius (px)</label><input type="number" value="' +
      (p.borderRadius || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width (px)</label><input type="number" value="' +
      (p.borderWidth || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Color</label><input type="color" value="' +
      (p.borderColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Box Shadow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','boxShadow',this.value)\"><option value=\"none\"" +
      ((p.boxShadow || "none") === "none" ? " selected" : "") +
      '>None</option><option value="soft"' +
      ((p.boxShadow || "none") === "soft" ? " selected" : "") +
      '>Soft</option><option value="hard"' +
      ((p.boxShadow || "none") === "hard" ? " selected" : "") +
      '>Hard</option><option value="glow"' +
      ((p.boxShadow || "none") === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    if (p.boxShadow && p.boxShadow !== "none") {
      html +=
        '<div class="rp-row"><label>Shadow Color</label><input type="color" value="' +
        (p.shadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur</label><input type="number" value="' +
        (p.shadowBlur || 10) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Spacing & Display</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Padding V (px)</label><input type="number" value="' +
      (p.paddingV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H (px)</label><input type="number" value="' +
      (p.paddingH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin V (px)</label><input type="number" value="' +
      (p.marginV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin H (px)</label><input type="number" value="' +
      (p.marginH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animations & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      ((p.entranceAnim || "none") === "none" ? " selected" : "") +
      '>None</option><option value="fade-in"' +
      ((p.entranceAnim || "none") === "fade-in" ? " selected" : "") +
      '>Fade In</option><option value="slide-up"' +
      ((p.entranceAnim || "none") === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="slide-left"' +
      ((p.entranceAnim || "none") === "slide-left" ? " selected" : "") +
      '>Slide Left</option><option value="zoom-in"' +
      ((p.entranceAnim || "none") === "zoom-in" ? " selected" : "") +
      '>Zoom In</option><option value="flip-in"' +
      ((p.entranceAnim || "none") === "flip-in" ? " selected" : "") +
      ">Flip In</option></select></div>";
    html +=
      '<div class="rp-row"><label>Animation Duration (ms)</label><input type="number" value="' +
      (p.animDuration || 600) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','animDuration',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      ((p.hoverEffect || "none") === "none" ? " selected" : "") +
      '>None</option><option value="lift"' +
      ((p.hoverEffect || "none") === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      ((p.hoverEffect || "none") === "glow" ? " selected" : "") +
      '>Glow</option><option value="scale"' +
      ((p.hoverEffect || "none") === "scale" ? " selected" : "") +
      '>Scale</option><option value="tilt"' +
      ((p.hoverEffect || "none") === "tilt" ? " selected" : "") +
      ">Tilt</option></select></div>";
    html +=
      '<div class="rp-row"><label>Hover Transition (ms)</label><input type="number" value="' +
      (p.hoverTransition || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverTransition',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Advanced Bubble Options</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Bubble Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.bubbleOpacity || 80) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bubbleOpacity',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Bubble Glow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bubbleGlow',this.value)\"><option value=\"true\"" +
      (p.bubbleGlow !== false ? " selected" : "") +
      '>On</option><option value="false"' +
      (p.bubbleGlow === false ? " selected" : "") +
      ">Off</option></select></div>";
    html +=
      '<div class="rp-row"><label>Bubble Speed</label><input type="number" step="0.1" value="' +
      (p.bubbleSpeed || 1) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bubbleSpeed',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Bubble Rise</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bubbleRise',this.value)\"><option value=\"true\"" +
      (p.bubbleRise !== false ? " selected" : "") +
      '>Enabled</option><option value="false"' +
      (p.bubbleRise === false ? " selected" : "") +
      ">Static</option></select></div>";
    html +=
      '<div class="rp-row"><label>Bubble Merge</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bubbleMerge',this.value)\"><option value=\"false\"" +
      (!p.bubbleMerge ? " selected" : "") +
      '>Off</option><option value="true"' +
      (p.bubbleMerge ? " selected" : "") +
      ">On</option></select></div>";
    html +=
      '<div class="rp-row"><label>Pop Sound</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bubblePopSound',this.value)\"><option value=\"false\"" +
      (!p.bubblePopSound ? " selected" : "") +
      '>Off</option><option value="true"' +
      (p.bubblePopSound ? " selected" : "") +
      ">On</option></select></div>";
    html +=
      '<div class="rp-row"><label>Bubble Shape</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bubbleShape',this.value)\"><option value=\"circle\"" +
      ((p.bubbleShape || "circle") === "circle" ? " selected" : "") +
      '>Circle</option><option value="square"' +
      ((p.bubbleShape || "circle") === "square" ? " selected" : "") +
      '>Square</option><option value="hexagon"' +
      ((p.bubbleShape || "circle") === "hexagon" ? " selected" : "") +
      ">Hexagon</option></select></div>";
    html +=
      '<div class="rp-row"><label>Bubble Stroke</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bubbleStroke',this.value)\"><option value=\"false\"" +
      (!p.bubbleStroke ? " selected" : "") +
      '>Off</option><option value="true"' +
      (p.bubbleStroke ? " selected" : "") +
      ">On</option></select></div>";
    if (p.bubbleStroke) {
      html +=
        '<div class="rp-row"><label>Stroke Color</label><input type="color" value="' +
        (p.strokeColor || "#ffffff") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','strokeColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Stroke Width</label><input type="number" value="' +
        (p.strokeWidth || 1) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','strokeWidth',+this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Content</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Title</label><input type="text" value="' +
      (p.contentTitle || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','contentTitle',this.value)\" placeholder=\"Optional title...\"></div>";
    html +=
      '<div class="rp-row"><label>Subtitle</label><input type="text" value="' +
      (p.contentSubtitle || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','contentSubtitle',this.value)\" placeholder=\"Optional subtitle...\"></div>";
    html +=
      '<div class="rp-row"><label>Text Color</label><input type="color" value="' +
      (p.contentColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','contentColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Align</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','contentAlign',this.value)\"><option value=\"center\"" +
      ((p.contentAlign || "center") === "center" ? " selected" : "") +
      '>Center</option><option value="left"' +
      ((p.contentAlign || "center") === "left" ? " selected" : "") +
      '>Left</option><option value="right"' +
      ((p.contentAlign || "center") === "right" ? " selected" : "") +
      ">Right</option></select></div>";
    html +=
      '<div class="rp-row"><label>Vertical Position</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','contentVAlign',this.value)\"><option value=\"center\"" +
      ((p.contentVAlign || "center") === "center" ? " selected" : "") +
      '>Middle</option><option value="top"' +
      ((p.contentVAlign || "center") === "top" ? " selected" : "") +
      '>Top</option><option value="bottom"' +
      ((p.contentVAlign || "center") === "bottom" ? " selected" : "") +
      ">Bottom</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

// ── 10. MAGNETIC CURSOR ──
FB.widgets.register("magneticCursor", {
  label: "Magnetic Cursor",
  sublabel: "Elements attract to cursor",
  icon: "◉",
  iconBg: "#0d1a0d",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "cursor",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    elementCount: 12,
    magneticRadius: 150,
    magneticStrength: 0.5,
    elementColor: "#cdfe00",
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a0d2e",
    bgImage: "",
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "#34d399",
    borderStyle: "solid",
    paddingV: 0,
    paddingH: 0,
    marginV: 0,
    marginH: 0,
    boxShadow: false,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowBlur: 10,
    shadowSpread: 0,
    opacity: 100,
    entranceAnim: "none",
    animDuration: 600,
    animDelay: 0,
    hoverEffect: "none",
    hoverScale: 1.02,
    hoverTransition: 300,
    elementShape: "circle",
    repelMode: false,
    elementSize: 40,
    elementColors: "#cdfe00,#3b82f6,#ec4899",
    elasticBounce: true,
    showCursor: true,
    cursorSize: 20,
    cursorColor: "#34d399",
  },
  render: function (p) {
    var id = "mag-" + (p._blockId || Date.now());
    var itemsHtml = "";
    var colors = (p.elementColors || "#cdfe00,#3b82f6,#ec4899").split(",");
    for (var i = 0; i < (p.elementCount || 12); i++) {
      var col = colors[i % colors.length];
      var shape =
        p.elementShape === "square"
          ? "border-radius:4px;"
          : p.elementShape === "diamond"
            ? "border-radius:4px;transform:rotate(45deg);"
            : "border-radius:50%;";
      itemsHtml +=
        '<div class="veltro-mag-item" style="position:absolute;width:' +
        (p.elementSize || 40) +
        "px;height:" +
        (p.elementSize || 40) +
        "px;background:" +
        col +
        ";" +
        shape +
        "opacity:0.6;left:" +
        (10 + Math.random() * 80) +
        "%;top:" +
        (10 + Math.random() * 80) +
        '%"></div>';
    }
    var containerBg = "";
    if (p.bgType === "gradient") {
      containerBg =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a0d2e") +
        ");";
    } else if (p.bgType === "image" && p.bgImage) {
      containerBg = "background:url(" + p.bgImage + ") center/cover;";
    } else {
      containerBg = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px " +
        (p.borderStyle || "solid") +
        " " +
        (p.borderColor || "#34d399") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow) {
      containerShadow =
        "box-shadow:0 " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowBlur || 10) * 2 +
        "px " +
        (p.shadowSpread || 0) +
        "px " +
        (p.shadowColor || "rgba(0,0,0,0.3)") +
        ";";
    }
    var hoverClass = "";
    var hoverStyle = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
      hoverStyle = "transition:all " + (p.hoverTransition || 300) + "ms ease;";
    }
    var animClass = "";
    var animStyle = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
      animStyle =
        "animation-duration:" +
        (p.animDuration || 600) +
        "ms;animation-delay:" +
        (p.animDelay || 0) +
        "ms;animation-fill-mode:both;";
    }
    var cursorHtml = p.showCursor
      ? '<div class="veltro-mag-cursor" style="position:absolute;width:' +
        (p.cursorSize || 20) +
        "px;height:" +
        (p.cursorSize || 20) +
        "px;background:" +
        (p.cursorColor || "#34d399") +
        ";border-radius:50%;pointer-events:none;z-index:100;mix-blend-mode:difference" +
        '"></div>'
      : "";
    return (
      '<div class="veltro-magcursor-wrap' +
      animClass +
      hoverClass +
      '" id="' +
      id +
      '" data-magnetic-radius="' +
      (p.magneticRadius || 150) +
      '" data-magnetic-strength="' +
      (p.magneticStrength || 0.5) +
      '" data-repel-mode="' +
      (p.repelMode ? "1" : "0") +
      '" data-elastic-bounce="' +
      (p.elasticBounce ? "1" : "0") +
      '" data-element-shape="' +
      (p.elementShape || "circle") +
      '" style="height:' +
      (p.height || 400) +
      "px;" +
      containerBg +
      containerBorder +
      containerShadow +
      hoverStyle +
      animStyle +
      "border-radius:" +
      (p.borderRadius || 8) +
      "px;" +
      "padding:" +
      (p.paddingV || 0) +
      "px " +
      (p.paddingH || 0) +
      "px;" +
      "margin:" +
      (p.marginV || 0) +
      "px " +
      (p.marginH || 0) +
      "px;" +
      "opacity:" +
      (p.opacity || 100) / 100 +
      ";" +
      'position:relative;overflow:hidden;cursor:none;">' +
      itemsHtml +
      cursorHtml +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Magnetic</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Height: ' +
      (p.height || 400) +
      'px</label><input type="range" min="200" max="800" value="' +
      (p.height || 400) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value);this.previousElementSibling.textContent='Height: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Element Count: ' +
      (p.elementCount || 12) +
      '</label><input type="range" min="4" max="30" value="' +
      (p.elementCount || 12) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','elementCount',+this.value);this.previousElementSibling.textContent='Element Count: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Element Size: ' +
      (p.elementSize || 40) +
      'px</label><input type="range" min="10" max="80" value="' +
      (p.elementSize || 40) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','elementSize',+this.value);this.previousElementSibling.textContent='Element Size: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Element Shape</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','elementShape',this.value)\"><option value=\"circle\"" +
      (p.elementShape === "circle" ? " selected" : "") +
      '>Circle</option><option value="square"' +
      (p.elementShape === "square" ? " selected" : "") +
      '>Square</option><option value="diamond"' +
      (p.elementShape === "diamond" ? " selected" : "") +
      ">Diamond</option></select></div>";
    html +=
      '<div class="rp-row"><label>Element Colours (comma-separated)</label><input type="text" value="' +
      (p.elementColors || "#cdfe00,#3b82f6,#ec4899") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','elementColors',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Magnetic Radius: ' +
      (p.magneticRadius || 150) +
      'px</label><input type="range" min="50" max="300" value="' +
      (p.magneticRadius || 150) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','magneticRadius',+this.value);this.previousElementSibling.textContent='Magnetic Radius: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Magnetic Strength: ' +
      (p.magneticStrength || 0.5) +
      '</label><input type="range" min="0" max="1" step="0.1" value="' +
      (p.magneticStrength || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','magneticStrength',+this.value);this.previousElementSibling.textContent='Magnetic Strength: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.repelMode ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','repelMode',this.checked)\"> Repel Mode</label></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.elasticBounce ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','elasticBounce',this.checked)\"> Elastic Bounce</label></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Cursor</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.showCursor !== false ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','showCursor',this.checked)\"> Show Custom Cursor</label></div>";
    if (p.showCursor !== false) {
      html +=
        '<div class="rp-row"><label>Cursor Size: ' +
        (p.cursorSize || 20) +
        'px</label><input type="range" min="8" max="50" value="' +
        (p.cursorSize || 20) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','cursorSize',+this.value);this.previousElementSibling.textContent='Cursor Size: '+this.value+'px'\"></div>";
      html +=
        '<div class="rp-row"><label>Cursor Colour</label><input type="color" value="' +
        (p.cursorColor || "#34d399") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','cursorColor',this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      (p.bgType === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      (p.bgType === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      (p.bgType === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if (p.bgType === "solid") {
      html +=
        '<div class="rp-row"><label>Background Colour</label><div class="rp-colour-row"><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        '\',\'bg\',this.value)"><input type="text" value="' +
        (p.bg || "#0d0d1a") +
        '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div></div>";
    } else if (p.bgType === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Colour 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Colour 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a0d2e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        (p.bgGradientDir === "135deg" ? " selected" : "") +
        '>135°</option><option value="90deg"' +
        (p.bgGradientDir === "90deg" ? " selected" : "") +
        ">90°</option></select></div>";
    } else if (p.bgType === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImage || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImage',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius: ' +
      (p.borderRadius || 8) +
      'px</label><input type="range" min="0" max="50" value="' +
      (p.borderRadius || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value);this.previousElementSibling.textContent='Border Radius: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width: ' +
      (p.borderWidth || 0) +
      'px</label><input type="range" min="0" max="8" value="' +
      (p.borderWidth || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value);this.previousElementSibling.textContent='Border Width: '+this.value+'px'\"></div>";
    if (p.borderWidth > 0) {
      html +=
        '<div class="rp-row"><label>Border Colour</label><input type="color" value="' +
        (p.borderColor || "#34d399") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Border Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderStyle',this.value)\"><option value=\"solid\"" +
        (p.borderStyle === "solid" ? " selected" : "") +
        '>Solid</option><option value="dashed"' +
        (p.borderStyle === "dashed" ? " selected" : "") +
        ">Dashed</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Padding V: ' +
      (p.paddingV || 0) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingV || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value);this.previousElementSibling.textContent='Padding V: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H: ' +
      (p.paddingH || 0) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingH || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value);this.previousElementSibling.textContent='Padding H: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity: ' +
      (p.opacity || 100) +
      '%</label><input type="range" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value);this.previousElementSibling.textContent='Opacity: '+this.value+'%'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.boxShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','boxShadow',this.checked)\"> Box Shadow</label></div>";
    if (p.boxShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.shadowBlur || 10) +
        '</label><input type="range" min="0" max="40" value="' +
        (p.shadowBlur || 10) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animation</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      (p.entranceAnim === "none" ? " selected" : "") +
      '>None</option><option value="fade"' +
      (p.entranceAnim === "fade" ? " selected" : "") +
      '>Fade</option><option value="slide-up"' +
      (p.entranceAnim === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="zoom"' +
      (p.entranceAnim === "zoom" ? " selected" : "") +
      ">Zoom</option></select></div>";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      html +=
        '<div class="rp-row"><label>Duration: ' +
        (p.animDuration || 600) +
        'ms</label><input type="range" min="200" max="2000" step="100" value="' +
        (p.animDuration || 600) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','animDuration',+this.value);this.previousElementSibling.textContent='Duration: '+this.value+'ms'\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      (p.hoverEffect === "none" ? " selected" : "") +
      '>None</option><option value="scale"' +
      (p.hoverEffect === "scale" ? " selected" : "") +
      '>Scale</option><option value="lift"' +
      (p.hoverEffect === "lift" ? " selected" : "") +
      ">Lift</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

// ── 11. PARTICLE TRAIL ──
FB.widgets.register("particleTrail", {
  label: "Particle Trail",
  sublabel: "Cursor particles",
  icon: "✦",
  iconBg: "#1a0d2e",
  iconColor: "#ff6b35",
  category: "veltro",
  subCategory: "cursor",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    particleCount: 30,
    particleSize: 4,
    particleColor: "#cdfe00",
    fadeSpeed: 0.95,
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a1a3e",
    bgImageUrl: "",
    bgImageOpacity: 30,
    bgImageSize: "cover",
    borderRadius: 4,
    borderWidth: 0,
    borderColor: "#ffffff",
    boxShadow: "none",
    shadowColor: "#000000",
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    paddingV: 0,
    paddingH: 0,
    marginV: 0,
    marginH: 0,
    opacity: 100,
    entranceAnim: "none",
    hoverEffect: "none",
    hoverTransition: 300,
    animDuration: 600,
    particleShape: "circle",
    particleBlendMode: "normal",
    particleGravity: 0,
    particleTrail: true,
    particleRandomSize: false,
    particleRotation: 0,
    particleScatter: 1,
    particlePulse: false,
  },
  render: function (p) {
    var id = "ptrail-" + (p._blockId || Date.now());
    var bgType = p.bgType || "solid";
    var bgStyle = "";
    if (bgType === "gradient") {
      bgStyle =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a1a3e") +
        ");";
    } else if (bgType === "image" && p.bgImageUrl) {
      bgStyle =
        "background:url('" +
        p.bgImageUrl +
        "') center/" +
        (p.bgImageSize || "cover") +
        " no-repeat;background-color:" +
        (p.bg || "#0d0d1a") +
        ";";
    } else {
      bgStyle = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth && p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px solid " +
        (p.borderColor || "#ffffff") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow && p.boxShadow !== "none") {
      containerShadow =
        "box-shadow:" +
        (p.shadowOffsetX || 0) +
        "px " +
        (p.shadowOffsetY || 4) +
        "px " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowColor || "#000000") +
        ";";
    }
    var hoverClass = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
    }
    var animClass = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
    }
    var padStyle =
      "padding:" + (p.paddingV || 0) + "px " + (p.paddingH || 0) + "px;";
    var margStyle =
      "margin:" + (p.marginV || 0) + "px " + (p.marginH || 0) + "px;";
    var opStyle =
      p.opacity && p.opacity < 100 ? "opacity:" + p.opacity / 100 + ";" : "";
    return (
      '<div class="veltro-ptrail-wrap' +
      animClass +
      hoverClass +
      '" id="' +
      id +
      '" data-particle-count="' +
      (p.particleCount || 30) +
      '" data-particle-size="' +
      (p.particleSize || 4) +
      '" data-particle-color="' +
      (p.particleColor || "#cdfe00") +
      '" data-fade-speed="' +
      (p.fadeSpeed || 0.95) +
      '" data-particle-shape="' +
      (p.particleShape || "circle") +
      '" data-particle-blend-mode="' +
      (p.particleBlendMode || "normal") +
      '" data-particle-gravity="' +
      (p.particleGravity || 0) +
      '" data-particle-trail="' +
      (p.particleTrail !== false ? "true" : "false") +
      '" data-particle-random-size="' +
      (p.particleRandomSize ? "true" : "false") +
      '" data-particle-rotation="' +
      (p.particleRotation || 0) +
      '" data-particle-scatter="' +
      (p.particleScatter || 1) +
      '" data-particle-pulse="' +
      (p.particlePulse ? "true" : "false") +
      '" style="height:' +
      p.height +
      "px;" +
      bgStyle +
      "position:relative;overflow:hidden;border-radius:" +
      (p.borderRadius || 4) +
      "px;cursor:none;" +
      containerBorder +
      containerShadow +
      padStyle +
      margStyle +
      opStyle +
      '"><canvas class="veltro-ptrail-canvas" style="position:absolute;inset:0;width:100%;height:100%"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Core Settings</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Count</label><input type="number" value="' +
      (p.particleCount || 30) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleCount',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Size</label><input type="number" value="' +
      (p.particleSize || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleSize',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Color</label><input type="color" value="' +
      (p.particleColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Fade Speed</label><input type="number" step="0.01" min="0" max="1" value="' +
      (p.fadeSpeed || 0.95) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fadeSpeed',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Background & Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      ((p.bgType || "solid") === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      ((p.bgType || "solid") === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      ((p.bgType || "solid") === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if ((p.bgType || "solid") === "solid") {
      html +=
        '<div class="rp-row"><label>Background Color</label><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        ((p.bgGradientDir || "135deg") === "135deg" ? " selected" : "") +
        '>135°</option><option value="to right"' +
        ((p.bgGradientDir || "135deg") === "to right" ? " selected" : "") +
        '>Left→Right</option><option value="to bottom"' +
        ((p.bgGradientDir || "135deg") === "to bottom" ? " selected" : "") +
        '>Top→Bottom</option><option value="circle"' +
        ((p.bgGradientDir || "135deg") === "circle" ? " selected" : "") +
        ">Radial</option></select></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a1a3e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImageUrl || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageUrl',this.value)\" placeholder=\"https://...\"></div>";
      html +=
        '<div class="rp-row"><label>Image Opacity (%)</label><input type="number" min="0" max="100" value="' +
        (p.bgImageOpacity || 30) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageOpacity',+this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Image Size</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageSize',this.value)\"><option value=\"cover\"" +
        ((p.bgImageSize || "cover") === "cover" ? " selected" : "") +
        '>Cover</option><option value="contain"' +
        ((p.bgImageSize || "cover") === "contain" ? " selected" : "") +
        '>Contain</option><option value="100% 100%"' +
        ((p.bgImageSize || "cover") === "100% 100%" ? " selected" : "") +
        ">Stretch</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius (px)</label><input type="number" value="' +
      (p.borderRadius || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width (px)</label><input type="number" value="' +
      (p.borderWidth || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Color</label><input type="color" value="' +
      (p.borderColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Box Shadow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','boxShadow',this.value)\"><option value=\"none\"" +
      ((p.boxShadow || "none") === "none" ? " selected" : "") +
      '>None</option><option value="soft"' +
      ((p.boxShadow || "none") === "soft" ? " selected" : "") +
      '>Soft</option><option value="hard"' +
      ((p.boxShadow || "none") === "hard" ? " selected" : "") +
      '>Hard</option><option value="glow"' +
      ((p.boxShadow || "none") === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    if (p.boxShadow && p.boxShadow !== "none") {
      html +=
        '<div class="rp-row"><label>Shadow Color</label><input type="color" value="' +
        (p.shadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur</label><input type="number" value="' +
        (p.shadowBlur || 10) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Spacing & Display</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Padding V (px)</label><input type="number" value="' +
      (p.paddingV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H (px)</label><input type="number" value="' +
      (p.paddingH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin V (px)</label><input type="number" value="' +
      (p.marginV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin H (px)</label><input type="number" value="' +
      (p.marginH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animations & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      ((p.entranceAnim || "none") === "none" ? " selected" : "") +
      '>None</option><option value="fade-in"' +
      ((p.entranceAnim || "none") === "fade-in" ? " selected" : "") +
      '>Fade In</option><option value="slide-up"' +
      ((p.entranceAnim || "none") === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="slide-left"' +
      ((p.entranceAnim || "none") === "slide-left" ? " selected" : "") +
      '>Slide Left</option><option value="zoom-in"' +
      ((p.entranceAnim || "none") === "zoom-in" ? " selected" : "") +
      '>Zoom In</option><option value="flip-in"' +
      ((p.entranceAnim || "none") === "flip-in" ? " selected" : "") +
      ">Flip In</option></select></div>";
    html +=
      '<div class="rp-row"><label>Animation Duration (ms)</label><input type="number" value="' +
      (p.animDuration || 600) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','animDuration',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      ((p.hoverEffect || "none") === "none" ? " selected" : "") +
      '>None</option><option value="lift"' +
      ((p.hoverEffect || "none") === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      ((p.hoverEffect || "none") === "glow" ? " selected" : "") +
      '>Glow</option><option value="scale"' +
      ((p.hoverEffect || "none") === "scale" ? " selected" : "") +
      '>Scale</option><option value="tilt"' +
      ((p.hoverEffect || "none") === "tilt" ? " selected" : "") +
      ">Tilt</option></select></div>";
    html +=
      '<div class="rp-row"><label>Hover Transition (ms)</label><input type="number" value="' +
      (p.hoverTransition || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverTransition',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Advanced Particle Options</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Particle Shape</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleShape',this.value)\"><option value=\"circle\"" +
      ((p.particleShape || "circle") === "circle" ? " selected" : "") +
      '>Circle</option><option value="square"' +
      ((p.particleShape || "circle") === "square" ? " selected" : "") +
      '>Square</option><option value="triangle"' +
      ((p.particleShape || "circle") === "triangle" ? " selected" : "") +
      '>Triangle</option><option value="star"' +
      ((p.particleShape || "circle") === "star" ? " selected" : "") +
      '>Star</option><option value="diamond"' +
      ((p.particleShape || "circle") === "diamond" ? " selected" : "") +
      ">Diamond</option></select></div>";
    html +=
      '<div class="rp-row"><label>Blend Mode</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleBlendMode',this.value)\"><option value=\"normal\"" +
      ((p.particleBlendMode || "normal") === "normal" ? " selected" : "") +
      '>Normal</option><option value="screen"' +
      ((p.particleBlendMode || "normal") === "screen" ? " selected" : "") +
      '>Screen</option><option value="multiply"' +
      ((p.particleBlendMode || "normal") === "multiply" ? " selected" : "") +
      '>Multiply</option><option value="overlay"' +
      ((p.particleBlendMode || "normal") === "overlay" ? " selected" : "") +
      '>Overlay</option><option value="lighten"' +
      ((p.particleBlendMode || "normal") === "lighten" ? " selected" : "") +
      ">Lighten</option></select></div>";
    html +=
      '<div class="rp-row"><label>Gravity</label><input type="number" step="0.1" value="' +
      (p.particleGravity || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleGravity',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Trail</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleTrail',this.value)\"><option value=\"true\"" +
      (p.particleTrail !== false ? " selected" : "") +
      '>Enabled</option><option value="false"' +
      (p.particleTrail === false ? " selected" : "") +
      ">Disabled</option></select></div>";
    html +=
      '<div class="rp-row"><label>Random Size</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleRandomSize',this.value)\"><option value=\"false\"" +
      (!p.particleRandomSize ? " selected" : "") +
      '>Uniform</option><option value="true"' +
      (p.particleRandomSize ? " selected" : "") +
      ">Random</option></select></div>";
    html +=
      '<div class="rp-row"><label>Rotation (deg)</label><input type="number" value="' +
      (p.particleRotation || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleRotation',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Scatter Factor</label><input type="number" step="0.1" min="0.1" max="3" value="' +
      (p.particleScatter || 1) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleScatter',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Pulse</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particlePulse',this.value)\"><option value=\"false\"" +
      (!p.particlePulse ? " selected" : "") +
      '>Off</option><option value="true"' +
      (p.particlePulse ? " selected" : "") +
      ">On</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

// ── 12. CURSOR RIPPLE ──
FB.widgets.register("cursorRipple", {
  label: "Cursor Ripple",
  sublabel: "Click ripple effect",
  icon: "◎",
  iconBg: "#1a0d1a",
  iconColor: "#f472b6",
  category: "veltro",
  subCategory: "cursor",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    rippleColor: "#cdfe00",
    rippleSize: 100,
    rippleDuration: 800,
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a1a3e",
    bgImageUrl: "",
    bgImageOpacity: 30,
    bgImageSize: "cover",
    borderRadius: 4,
    borderWidth: 0,
    borderColor: "#ffffff",
    boxShadow: "none",
    shadowColor: "#000000",
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    paddingV: 0,
    paddingH: 0,
    marginV: 0,
    marginH: 0,
    opacity: 100,
    entranceAnim: "none",
    hoverEffect: "none",
    hoverTransition: 300,
    animDuration: 600,
    rippleShape: "circle",
    rippleMultiple: true,
    rippleDirection: "outward",
    rippleBorderWidth: 2,
    rippleText: "Click Anywhere",
    rippleTextColor: "#ffffff",
    rippleTextSize: 32,
    rippleGlow: false,
  },
  render: function (p) {
    var id = "ripple-" + (p._blockId || Date.now());
    var bgType = p.bgType || "solid";
    var bgStyle = "";
    if (bgType === "gradient") {
      bgStyle =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a1a3e") +
        ");";
    } else if (bgType === "image" && p.bgImageUrl) {
      bgStyle =
        "background:url('" +
        p.bgImageUrl +
        "') center/" +
        (p.bgImageSize || "cover") +
        " no-repeat;background-color:" +
        (p.bg || "#0d0d1a") +
        ";";
    } else {
      bgStyle = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth && p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px solid " +
        (p.borderColor || "#ffffff") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow && p.boxShadow !== "none") {
      containerShadow =
        "box-shadow:" +
        (p.shadowOffsetX || 0) +
        "px " +
        (p.shadowOffsetY || 4) +
        "px " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowColor || "#000000") +
        ";";
    }
    var hoverClass = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
    }
    var animClass = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
    }
    var padStyle =
      "padding:" + (p.paddingV || 0) + "px " + (p.paddingH || 0) + "px;";
    var margStyle =
      "margin:" + (p.marginV || 0) + "px " + (p.marginH || 0) + "px;";
    var opStyle =
      p.opacity && p.opacity < 100 ? "opacity:" + p.opacity / 100 + ";" : "";
    return (
      '<div class="veltro-ripple-wrap' +
      animClass +
      hoverClass +
      '" id="' +
      id +
      '" data-ripple-color="' +
      (p.rippleColor || "#cdfe00") +
      '" data-ripple-size="' +
      (p.rippleSize || 100) +
      '" data-ripple-duration="' +
      (p.rippleDuration || 800) +
      '" data-ripple-shape="' +
      (p.rippleShape || "circle") +
      '" data-ripple-multiple="' +
      (p.rippleMultiple !== false ? "true" : "false") +
      '" data-ripple-direction="' +
      (p.rippleDirection || "outward") +
      '" data-ripple-border-width="' +
      (p.rippleBorderWidth || 2) +
      '" data-ripple-glow="' +
      (p.rippleGlow ? "true" : "false") +
      '" style="height:' +
      p.height +
      "px;" +
      bgStyle +
      "position:relative;overflow:hidden;border-radius:" +
      (p.borderRadius || 4) +
      "px;cursor:pointer;display:flex;align-items:center;justify-content:center;" +
      containerBorder +
      containerShadow +
      padStyle +
      margStyle +
      opStyle +
      '"><h2 style="color:' +
      (p.rippleTextColor || "#ffffff") +
      ";font-size:" +
      (p.rippleTextSize || 32) +
      'px;font-weight:700;margin:0;pointer-events:none">' +
      (p.rippleText || "Click Anywhere") +
      "</h2></div>"
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Core Settings</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Ripple Color</label><input type="color" value="' +
      (p.rippleColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','rippleColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Ripple Size</label><input type="number" value="' +
      (p.rippleSize || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','rippleSize',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Ripple Duration (ms)</label><input type="number" value="' +
      (p.rippleDuration || 800) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','rippleDuration',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Ripple Text</label><input type="text" value="' +
      (p.rippleText || "Click Anywhere") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','rippleText',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Text Color</label><input type="color" value="' +
      (p.rippleTextColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','rippleTextColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Text Size (px)</label><input type="number" value="' +
      (p.rippleTextSize || 32) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','rippleTextSize',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Background & Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      ((p.bgType || "solid") === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      ((p.bgType || "solid") === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      ((p.bgType || "solid") === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if ((p.bgType || "solid") === "solid") {
      html +=
        '<div class="rp-row"><label>Background Color</label><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        ((p.bgGradientDir || "135deg") === "135deg" ? " selected" : "") +
        '>135°</option><option value="to right"' +
        ((p.bgGradientDir || "135deg") === "to right" ? " selected" : "") +
        '>Left→Right</option><option value="to bottom"' +
        ((p.bgGradientDir || "135deg") === "to bottom" ? " selected" : "") +
        '>Top→Bottom</option><option value="circle"' +
        ((p.bgGradientDir || "135deg") === "circle" ? " selected" : "") +
        ">Radial</option></select></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a1a3e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImageUrl || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageUrl',this.value)\" placeholder=\"https://...\"></div>";
      html +=
        '<div class="rp-row"><label>Image Opacity (%)</label><input type="number" min="0" max="100" value="' +
        (p.bgImageOpacity || 30) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageOpacity',+this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Image Size</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageSize',this.value)\"><option value=\"cover\"" +
        ((p.bgImageSize || "cover") === "cover" ? " selected" : "") +
        '>Cover</option><option value="contain"' +
        ((p.bgImageSize || "cover") === "contain" ? " selected" : "") +
        '>Contain</option><option value="100% 100%"' +
        ((p.bgImageSize || "cover") === "100% 100%" ? " selected" : "") +
        ">Stretch</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius (px)</label><input type="number" value="' +
      (p.borderRadius || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width (px)</label><input type="number" value="' +
      (p.borderWidth || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Color</label><input type="color" value="' +
      (p.borderColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Box Shadow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','boxShadow',this.value)\"><option value=\"none\"" +
      ((p.boxShadow || "none") === "none" ? " selected" : "") +
      '>None</option><option value="soft"' +
      ((p.boxShadow || "none") === "soft" ? " selected" : "") +
      '>Soft</option><option value="hard"' +
      ((p.boxShadow || "none") === "hard" ? " selected" : "") +
      '>Hard</option><option value="glow"' +
      ((p.boxShadow || "none") === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    if (p.boxShadow && p.boxShadow !== "none") {
      html +=
        '<div class="rp-row"><label>Shadow Color</label><input type="color" value="' +
        (p.shadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur</label><input type="number" value="' +
        (p.shadowBlur || 10) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Spacing & Display</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Padding V (px)</label><input type="number" value="' +
      (p.paddingV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H (px)</label><input type="number" value="' +
      (p.paddingH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin V (px)</label><input type="number" value="' +
      (p.marginV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin H (px)</label><input type="number" value="' +
      (p.marginH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animations & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      ((p.entranceAnim || "none") === "none" ? " selected" : "") +
      '>None</option><option value="fade-in"' +
      ((p.entranceAnim || "none") === "fade-in" ? " selected" : "") +
      '>Fade In</option><option value="slide-up"' +
      ((p.entranceAnim || "none") === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="slide-left"' +
      ((p.entranceAnim || "none") === "slide-left" ? " selected" : "") +
      '>Slide Left</option><option value="zoom-in"' +
      ((p.entranceAnim || "none") === "zoom-in" ? " selected" : "") +
      '>Zoom In</option><option value="flip-in"' +
      ((p.entranceAnim || "none") === "flip-in" ? " selected" : "") +
      ">Flip In</option></select></div>";
    html +=
      '<div class="rp-row"><label>Animation Duration (ms)</label><input type="number" value="' +
      (p.animDuration || 600) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','animDuration',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      ((p.hoverEffect || "none") === "none" ? " selected" : "") +
      '>None</option><option value="lift"' +
      ((p.hoverEffect || "none") === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      ((p.hoverEffect || "none") === "glow" ? " selected" : "") +
      '>Glow</option><option value="scale"' +
      ((p.hoverEffect || "none") === "scale" ? " selected" : "") +
      '>Scale</option><option value="tilt"' +
      ((p.hoverEffect || "none") === "tilt" ? " selected" : "") +
      ">Tilt</option></select></div>";
    html +=
      '<div class="rp-row"><label>Hover Transition (ms)</label><input type="number" value="' +
      (p.hoverTransition || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverTransition',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Advanced Ripple Options</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Ripple Shape</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','rippleShape',this.value)\"><option value=\"circle\"" +
      ((p.rippleShape || "circle") === "circle" ? " selected" : "") +
      '>Circle</option><option value="square"' +
      ((p.rippleShape || "circle") === "square" ? " selected" : "") +
      '>Square</option><option value="diamond"' +
      ((p.rippleShape || "circle") === "diamond" ? " selected" : "") +
      ">Diamond</option></select></div>";
    html +=
      '<div class="rp-row"><label>Multiple Ripples</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','rippleMultiple',this.value)\"><option value=\"true\"" +
      (p.rippleMultiple !== false ? " selected" : "") +
      '>Enabled</option><option value="false"' +
      (p.rippleMultiple === false ? " selected" : "") +
      ">Single</option></select></div>";
    html +=
      '<div class="rp-row"><label>Ripple Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','rippleDirection',this.value)\"><option value=\"outward\"" +
      ((p.rippleDirection || "outward") === "outward" ? " selected" : "") +
      '>Outward</option><option value="inward"' +
      ((p.rippleDirection || "outward") === "inward" ? " selected" : "") +
      '>Inward</option><option value="both"' +
      ((p.rippleDirection || "outward") === "both" ? " selected" : "") +
      ">Both</option></select></div>";
    html +=
      '<div class="rp-row"><label>Ripple Border Width</label><input type="number" value="' +
      (p.rippleBorderWidth || 2) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','rippleBorderWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Ripple Glow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','rippleGlow',this.value)\"><option value=\"false\"" +
      (!p.rippleGlow ? " selected" : "") +
      '>Off</option><option value="true"' +
      (p.rippleGlow ? " selected" : "") +
      ">On</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

// ── 13. STICKY SCROLL STACK ──
FB.widgets.register("stickyScrollStack", {
  label: "Sticky Scroll Stack",
  sublabel: "Sticky stacking",
  icon: "☰",
  iconBg: "#0d1a2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "scroll",
  defaultProps: {
    height: 600,
    bg: "#0d0d1a",
    cardCount: 5,
    cardHeight: 200,
    cardColor: "#1a1a2e",
  },
  render: function (p) {
    var id = "sticky-" + (p._blockId || Date.now());
    var cardsHtml = "";
    for (var i = 0; i < (p.cardCount || 5); i++) {
      cardsHtml +=
        '<div class="veltro-sticky-card" style="position:sticky;top:' +
        i * 20 +
        "px;height:" +
        (p.cardHeight || 200) +
        "px;background:" +
        (p.cardColor || "#1a1a2e") +
        ';border-radius:16px;margin-bottom:20px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,255,255,0.1)"><span style="font-size:2rem;font-weight:800;color:#fff">Card ' +
        (i + 1) +
        "</span></div>";
    }
    return (
      '<div class="veltro-sticky-wrap" id="' +
      id +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;overflow-y:auto;padding:20px">' +
      cardsHtml +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="200" max="1200" value="' +
      (p.height || 600) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Card Count</label><input type="number" min="1" max="12" value="' +
      (p.cardCount || 5) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','cardCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Card Height (px)</label><input type="number" min="80" max="400" value="' +
      (p.cardHeight || 200) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','cardHeight',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Card Colour</label><input type="color" value="' +
      (p.cardColor || "#1a1a2e") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','cardColor',this.value)\"></div>";
    return h;
  },
});

// ── 14. SCROLL VELOCITY SKEW ──
FB.widgets.register("scrollVelocitySkew", {
  label: "Scroll Velocity Skew",
  sublabel: "Skew on scroll",
  icon: "⟋",
  iconBg: "#1a0d1a",
  iconColor: "#f472b6",
  category: "veltro",
  subCategory: "scroll",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    maxSkew: 15,
    elasticity: 0.8,
  },
  render: function (p) {
    var id = "velskew-" + (p._blockId || Date.now());
    return (
      '<div class="veltro-velskew-wrap" id="' +
      id +
      '" data-max-skew="' +
      (p.maxSkew || 15) +
      '" data-elasticity="' +
      (p.elasticity || 0.8) +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;overflow-y:auto"><div class="veltro-velskew-content" style="padding:40px" data-velskew-init="1"><div style="height:800px;display:flex;flex-direction:column;gap:20px"><div style="padding:30px;background:rgba(205,254,0,0.1);border-radius:12px"><h3 style="color:#cdfe00;margin:0">Scroll to see skew effect</h3></div><div style="padding:30px;background:rgba(60,165,250,0.1);border-radius:12px"><h3 style="color:#60a5fa;margin:0">Velocity affects skew</h3></div><div style="padding:30px;background:rgba(236,72,153,0.1);border-radius:12px"><h3 style="color:#ec4899;margin:0">Rubber band physics</h3></div><div style="padding:30px;background:rgba(251,191,36,0.1);border-radius:12px"><h3 style="color:#fbbf24;margin:0">Fast scroll = more skew</h3></div></div></div></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Max Skew (°)</label><input type="range" min="0" max="45" step="1" value="' +
      (p.maxSkew || 15) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','maxSkew',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Elasticity</label><input type="range" min="0" max="1" step="0.05" value="' +
      (p.elasticity || 0.8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','elasticity',+this.value)\"></div>";
    return h;
  },
});

// ── 15. PARALLAX IMAGE STACK ──
FB.widgets.register("parallaxImageStack", {
  label: "Parallax Image Stack",
  sublabel: "Layered parallax",
  icon: "▣",
  iconBg: "#0d1a0d",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "scroll",
  defaultProps: {
    height: 500,
    bg: "#0d0d1a",
    layerCount: 5,
    images:
      "https://picsum.photos/400/300?random=1,https://picsum.photos/400/300?random=2,https://picsum.photos/400/300?random=3,https://picsum.photos/400/300?random=4,https://picsum.photos/400/300?random=5",
  },
  render: function (p) {
    var id = "parstack-" + (p._blockId || Date.now());
    var images = (p.images || "").split(",");
    var layersHtml = "";
    for (var i = 0; i < (p.layerCount || 5); i++) {
      var img = images[i] || "https://picsum.photos/400/300?random=" + (i + 1);
      layersHtml +=
        '<div class="veltro-parstack-layer" data-depth="' +
        (i + 1) * 0.2 +
        '" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:' +
        (0.3 + i * 0.15) +
        '"><img src="' +
        img +
        '" style="width:300px;height:200px;object-fit:cover;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.5)" alt=""/></div>';
    }
    return (
      '<div class="veltro-parstack-wrap" id="' +
      id +
      '" data-layer-count="' +
      (p.layerCount || 5) +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px">' +
      layersHtml +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 500) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Layer Count</label><input type="range" min="1" max="10" step="1" value="' +
      (p.layerCount || 5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','layerCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Image URLs (comma-sep)</label><input type="text" value="' +
      (p.images || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','images',this.value)\"></div>";
    return h;
  },
});

// ── 16. MOSAIC ASSEMBLE ──
FB.widgets.register("mosaicAssemble", {
  label: "Mosaic Assemble",
  sublabel: "Grid assembles on scroll",
  icon: "⊞",
  iconBg: "#1a1a0d",
  iconColor: "#fbbf24",
  category: "veltro",
  subCategory: "scroll",
  defaultProps: {
    height: 500,
    bg: "#0d0d1a",
    rows: 4,
    cols: 4,
    gap: 8,
    image: "https://picsum.photos/800/800?random=1",
  },
  render: function (p) {
    var id = "mosaic-" + (p._blockId || Date.now());
    var cellsHtml = "";
    for (var r = 0; r < (p.rows || 4); r++) {
      for (var c = 0; c < (p.cols || 4); c++) {
        var delay = (r * (p.cols || 4) + c) * 0.1;
        cellsHtml +=
          '<div class="veltro-mosaic-cell" data-row="' +
          r +
          '" data-col="' +
          c +
          '" style="background:url(' +
          (p.image || "https://picsum.photos/800/800?random=1") +
          ");background-size:" +
          (p.cols || 4) * 100 +
          "% " +
          (p.rows || 4) * 100 +
          "%;background-position:" +
          c * (100 / ((p.cols || 4) - 1)) +
          "% " +
          r * (100 / ((p.rows || 4) - 1)) +
          "%;border-radius:4px;opacity:0;transform:scale(0.8);transition:opacity 0.6s ease " +
          delay +
          "s,transform 0.6s ease " +
          delay +
          's\"></div>';
      }
    }
    return (
      '<div class="veltro-mosaic-wrap" id="' +
      id +
      '" data-rows="' +
      (p.rows || 4) +
      '" data-cols="' +
      (p.cols || 4) +
      '" data-gap="' +
      (p.gap || 8) +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center"><div class="veltro-mosaic-grid" style="display:grid;grid-template-columns:repeat(' +
      (p.cols || 4) +
      ",1fr);grid-template-rows:repeat(" +
      (p.rows || 4) +
      ",1fr);gap:" +
      (p.gap || 8) +
      'px;width:300px;height:300px">' +
      cellsHtml +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 500) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Rows</label><input type="range" min="2" max="8" step="1" value="' +
      (p.rows || 4) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','rows',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Columns</label><input type="range" min="2" max="8" step="1" value="' +
      (p.cols || 4) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','cols',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Gap (px)</label><input type="range" min="0" max="24" step="1" value="' +
      (p.gap || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','gap',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
      (p.image || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','image',this.value)\"></div>";
    return h;
  },
});

// ── 17. SCROLL PROGRESS RING ──
FB.widgets.register("scrollProgressRing", {
  label: "Scroll Progress Ring",
  sublabel: "SVG ring progress",
  icon: "◯",
  iconBg: "#0d0d2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "scroll",
  defaultProps: {
    height: 200,
    bg: "#0d0d1a",
    ringColor: "#cdfe00",
    ringSize: 80,
    ringWidth: 8,
  },
  render: function (p) {
    var id = "ring-" + (p._blockId || Date.now());
    var r = p.ringSize || 80;
    var circumference = 2 * Math.PI * r;
    return (
      '<div class="veltro-ring-wrap" id="' +
      id +
      '" data-ring-color="' +
      (p.ringColor || "#cdfe00") +
      '" data-ring-size="' +
      r +
      '" data-ring-width="' +
      (p.ringWidth || 8) +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center"><svg width="' +
      (r * 2 + 20) +
      '" height="' +
      (r * 2 + 20) +
      '"><circle cx="' +
      (r + 10) +
      '" cy="' +
      (r + 10) +
      '" r="' +
      r +
      '" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="' +
      (p.ringWidth || 8) +
      '"></circle><circle class="veltro-progress-ring" cx="' +
      (r + 10) +
      '" cy="' +
      (r + 10) +
      '" r="' +
      r +
      '" fill="none" stroke="' +
      (p.ringColor || "#cdfe00") +
      '" stroke-width="' +
      (p.ringWidth || 8) +
      '" stroke-dasharray="' +
      circumference +
      '" stroke-dashoffset="' +
      circumference +
      '" stroke-linecap="round" style="transition:stroke-dashoffset 0.3s ease;transform:rotate(-90deg);transform-origin:center"></circle></svg></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="600" value="' +
      (p.height || 200) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Ring Colour</label><input type="color" value="' +
      (p.ringColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','ringColor',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Ring Size (px)</label><input type="range" min="20" max="150" step="5" value="' +
      (p.ringSize || 80) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','ringSize',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Ring Width (px)</label><input type="range" min="2" max="20" step="1" value="' +
      (p.ringWidth || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','ringWidth',+this.value)\"></div>";
    return h;
  },
});

// ── 18. MAGNETIC SCROLL ──
FB.widgets.register("magneticScroll", {
  label: "Magnetic Scroll",
  sublabel: "Magnetic snap sections",
  icon: "⊕",
  iconBg: "#1a0d2e",
  iconColor: "#a78bfa",
  category: "veltro",
  subCategory: "scroll",
  defaultProps: {
    height: 500,
    bg: "#0d0d1a",
    sectionCount: 4,
    snapStrength: 0.5,
    colors: "#1a1a2e,#1a0d1a,#0d1a1a,#0d0d2e",
  },
  render: function (p) {
    var id = "mscroll-" + (p._blockId || Date.now());
    var colors = (p.colors || "#1a1a2e,#1a0d1a,#0d1a1a,#0d0d2e").split(",");
    var sectionsHtml = "";
    for (var i = 0; i < (p.sectionCount || 4); i++) {
      sectionsHtml +=
        '<div class="veltro-mscroll-section" style="height:100%;display:flex;align-items:center;justify-content:center;background:' +
        (colors[i % colors.length] || "#1a1a2e") +
        ';border-radius:16px;margin:20px;font-size:2rem;font-weight:800;color:#fff">Section ' +
        (i + 1) +
        "</div>";
    }
    return (
      '<div class="veltro-mscroll-wrap" id="' +
      id +
      '" data-section-count="' +
      (p.sectionCount || 4) +
      '" data-snap-strength="' +
      (p.snapStrength || 0.5) +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;overflow-y:auto;scroll-snap-type:y mandatory">' +
      sectionsHtml +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 500) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Section Count</label><input type="range" min="2" max="10" step="1" value="' +
      (p.sectionCount || 4) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','sectionCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Snap Strength</label><input type="range" min="0" max="1" step="0.1" value="' +
      (p.snapStrength || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','snapStrength',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Section Colours (CSV)</label><input type="text" value="' +
      (p.colors || "#1a1a2e,#1a0d1a,#0d1a1a,#0d0d2e") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','colors',this.value)\"></div>";
    return h;
  },
});

// ── 19. MORPH BLOB ──
FB.widgets.register("morphBlob", {
  label: "Morph Blob",
  sublabel: "SVG blob morphing",
  icon: "◉",
  iconBg: "#0d1a2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "backgrounds",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    color: "#cdfe00",
    speed: 0.5,
    complexity: 5,
  },
  render: function (p) {
    var id = "blob-" + (p._blockId || Date.now());
    return (
      '<div class="veltro-blob-wrap" id="' +
      id +
      '" data-color="' +
      (p.color || "#cdfe00") +
      '" data-speed="' +
      (p.speed || 0.5) +
      '" data-complexity="' +
      (p.complexity || 5) +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center"><svg class="veltro-blob-svg" viewBox="0 0 200 200" style="width:300px;height:300px"><path class="veltro-blob-path" fill="' +
      (p.color || "#cdfe00") +
      '" d="M47.5,-57.2C59.8,-47.3,67.1,-31.9,69.2,-16.1C71.3,-0.3,68.2,15.9,60.3,29.5C52.4,43.1,39.7,54.1,25.1,60.3C10.5,66.5,-6,67.9,-21.3,63.3C-36.6,58.7,-50.7,48.1,-59.9,34.1C-69.1,20.1,-73.4,2.7,-69.3,-12.5C-65.2,-27.7,-52.7,-40.7,-38.9,-50.2C-25.1,-59.7,-10,-65.7,3.6,-69.8C17.2,-73.9,35.2,-67.1,47.5,-57.2Z" transform="translate(100 100)" style="animation:vtmorph ' +
      10 / (p.speed || 0.5) +
      's ease-in-out infinite alternate"></path></svg></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Blob Colour</label><input type="color" value="' +
      (p.color || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Animation Speed</label><input type="range" min="0.1" max="2" step="0.1" value="' +
      (p.speed || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','speed',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Complexity</label><input type="range" min="3" max="12" step="1" value="' +
      (p.complexity || 5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','complexity',+this.value)\"></div>";
    return h;
  },
});

// ── 20. NOISE GRAIN ──
FB.widgets.register("noiseGrain", {
  label: "Noise Grain",
  sublabel: "Animated noise texture",
  icon: "▒",
  iconBg: "#1a1a0d",
  iconColor: "#fbbf24",
  category: "veltro",
  subCategory: "backgrounds",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    opacity: 0.1,
    speed: 0.5,
  },
  render: function (p) {
    var id = "noise-" + (p._blockId || Date.now());
    return (
      '<div class="veltro-noise-wrap" id="' +
      id +
      '" data-opacity="' +
      (p.opacity || 0.1) +
      '" data-speed="' +
      (p.speed || 0.5) +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px"><canvas class="veltro-noise-canvas" style="position:absolute;inset:0;width:100%;height:100%;opacity:' +
      (p.opacity || 0.1) +
      '"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Grain Opacity</label><input type="range" min="0.01" max="0.5" step="0.01" value="' +
      (p.opacity || 0.1) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Animation Speed</label><input type="range" min="0.1" max="2" step="0.1" value="' +
      (p.speed || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','speed',+this.value)\"></div>";
    return h;
  },
});

// ── 21. GRADIENT FLOW ──
FB.widgets.register("gradientFlow", {
  label: "Gradient Flow",
  sublabel: "Flowing gradients",
  icon: "≋",
  iconBg: "#0d1a1a",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "backgrounds",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    colors: "#ff6b35,#cdfe00,#3b82f6,#ec4899",
    speed: 0.5,
    angle: 45,
  },
  render: function (p) {
    var id = "grad-" + (p._blockId || Date.now());
    var colors = (p.colors || "#ff6b35,#cdfe00,#3b82f6,#ec4899").split(",");
    var gradColors = colors.join(",");
    return (
      '<div class="veltro-grad-wrap" id="' +
      id +
      '" data-colors="' +
      (p.colors || "#ff6b35,#cdfe00,#3b82f6,#ec4899") +
      '" data-speed="' +
      (p.speed || 0.5) +
      '" data-angle="' +
      (p.angle || 45) +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center"><div class="veltro-grad-flow" style="position:absolute;inset:0;background:linear-gradient(' +
      (p.angle || 45) +
      "deg," +
      gradColors +
      ");background-size:400% 400%;animation:vtgradflow " +
      10 / (p.speed || 0.5) +
      's ease infinite\"></div></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Gradient Colours (CSV)</label><input type="text" value="' +
      (p.colors || "#ff6b35,#cdfe00,#3b82f6,#ec4899") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','colors',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Animation Speed</label><input type="range" min="0.1" max="2" step="0.1" value="' +
      (p.speed || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','speed',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Angle (°)</label><input type="range" min="0" max="360" step="5" value="' +
      (p.angle || 45) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','angle',+this.value)\"></div>";
    return h;
  },
});

// ── 22. SECTION BACKGROUND ──
FB.widgets.register("sectionBackground", {
  label: "Section Background",
  sublabel: "Animated section bg",
  icon: "▣",
  iconBg: "#0d0d2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "backgrounds",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    pattern: "dots",
    patternColor: "#1a1a2e",
    patternSize: 20,
  },
  render: function (p) {
    var id = "secbg-" + (p._blockId || Date.now());
    var patternStyle = "";
    if (p.pattern === "dots") {
      patternStyle =
        "background-image:radial-gradient(" +
        (p.patternColor || "#1a1a2e") +
        " 1px,transparent 1px);background-size:" +
        (p.patternSize || 20) +
        "px " +
        (p.patternSize || 20) +
        "px";
    } else if (p.pattern === "grid") {
      patternStyle =
        "background-image:linear-gradient(" +
        (p.patternColor || "#1a1a2e") +
        " 1px,transparent 1px),linear-gradient(90deg," +
        (p.patternColor || "#1a1a2e") +
        " 1px,transparent 1px);background-size:" +
        (p.patternSize || 20) +
        "px " +
        (p.patternSize || 20) +
        "px";
    } else if (p.pattern === "lines") {
      patternStyle =
        "background-image:repeating-linear-gradient(45deg," +
        (p.patternColor || "#1a1a2e") +
        " 0," +
        (p.patternColor || "#1a1a2e") +
        " 1px,transparent 0,transparent 50%);background-size:" +
        (p.patternSize || 20) +
        "px " +
        (p.patternSize || 20) +
        "px";
    }
    return (
      '<div class="veltro-secbg-wrap" id="' +
      id +
      '" data-pattern="' +
      (p.pattern || "dots") +
      '" data-pattern-color="' +
      (p.patternColor || "#1a1a2e") +
      '" data-pattern-size="' +
      (p.patternSize || 20) +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px"><div style="position:absolute;inset:0;' +
      patternStyle +
      '\"></div></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Pattern</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','pattern',this.value)\"><option value=\"dots\"" +
      (p.pattern === "dots" ? " selected" : "") +
      '>Dots</option><option value="grid"' +
      (p.pattern === "grid" ? " selected" : "") +
      '>Grid</option><option value="lines"' +
      (p.pattern === "lines" ? " selected" : "") +
      "></option></select></div>";
    h +=
      '<div class="rp-row"><label>Pattern Colour</label><input type="color" value="' +
      (p.patternColor || "#1a1a2e") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','patternColor',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Pattern Size (px)</label><input type="range" min="4" max="80" step="2" value="' +
      (p.patternSize || 20) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','patternSize',+this.value)\"></div>";
    return h;
  },
});

// ── 23. GLASSMORPHISM STACK ──
FB.widgets.register("glassmorphismStack", {
  label: "Glassmorphism Stack",
  sublabel: "Frosted glass cards",
  icon: "◊",
  iconBg: "#1a0d1a",
  iconColor: "#f472b6",
  category: "veltro",
  subCategory: "backgrounds",
  defaultProps: {
    height: 400,
    bg: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
    cardCount: 3,
    cardColor: "rgba(255,255,255,0.1)",
    blur: 10,
  },
  render: function (p) {
    var id = "glass-" + (p._blockId || Date.now());
    var cardsHtml = "";
    for (var i = 0; i < (p.cardCount || 3); i++) {
      cardsHtml +=
        '<div class="veltro-glass-card" style="width:200px;height:120px;background:' +
        (p.cardColor || "rgba(255,255,255,0.1)") +
        ";border-radius:16px;border:1px solid rgba(255,255,255,0.2);backdrop-filter:blur(" +
        (p.blur || 10) +
        'px);display:flex;align-items:center;justify-content:center;margin:10px;font-size:1.2rem;font-weight:700;color:#fff">Card ' +
        (i + 1) +
        "</div>";
    }
    return (
      '<div class="veltro-glass-wrap" id="' +
      id +
      '" data-card-color="' +
      (p.cardColor || "rgba(255,255,255,0.1)") +
      '" data-blur="' +
      (p.blur || 10) +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center;flex-direction:column">' +
      cardsHtml +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="text" value="' +
      (p.bg || "linear-gradient(135deg,#667eea 0%,#764ba2 100%)") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Card Count</label><input type="range" min="1" max="6" step="1" value="' +
      (p.cardCount || 3) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','cardCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Card Colour (rgba)</label><input type="text" value="' +
      (p.cardColor || "rgba(255,255,255,0.1)") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','cardColor',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Blur (px)</label><input type="range" min="0" max="40" step="1" value="' +
      (p.blur || 10) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','blur',+this.value)\"></div>";
    return h;
  },
});

// ── 24. 3D TILT CARD ──
FB.widgets.register("tiltCard3d", {
  label: "3D Tilt Card",
  sublabel: "Hover tilt effect",
  icon: "◈",
  iconBg: "#1a0d2e",
  iconColor: "#a78bfa",
  category: "veltro",
  subCategory: "effects",
  defaultProps: {
    height: 300,
    bg: "#0d0d1a",
    cardBg: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
    cardWidth: 200,
    cardHeight: 280,
    maxTilt: 15,
    perspective: 1000,
  },
  render: function (p) {
    var id = "tilt-" + (p._blockId || Date.now());
    return (
      '<div class="veltro-tilt-wrap" id="' +
      id +
      '" data-max-tilt="' +
      (p.maxTilt || 15) +
      '" data-perspective="' +
      (p.perspective || 1000) +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center"><div class="veltro-tilt-card" style="width:' +
      (p.cardWidth || 200) +
      "px;height:" +
      (p.cardHeight || 280) +
      "px;background:" +
      (p.cardBg || "linear-gradient(135deg,#667eea 0%,#764ba2 100%)") +
      ';border-radius:16px;transform-style:preserve-3d;transition:transform 0.1s ease;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:800;color:#fff">3D</div></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="800" value="' +
      (p.height || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Card Background</label><input type="text" value="' +
      (p.cardBg || "linear-gradient(135deg,#667eea 0%,#764ba2 100%)") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','cardBg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Max Tilt (°)</label><input type="range" min="0" max="45" step="1" value="' +
      (p.maxTilt || 15) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','maxTilt',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Perspective (px)</label><input type="range" min="200" max="2000" step="50" value="' +
      (p.perspective || 1000) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','perspective',+this.value)\"></div>";
    return h;
  },
});

// ── 25. GLITCH SECTION ──
FB.widgets.register("glitchSection", {
  label: "Glitch Section",
  sublabel: "Glitch effect",
  icon: "⚡",
  iconBg: "#1a1a0d",
  iconColor: "#fbbf24",
  category: "veltro",
  subCategory: "effects",
  defaultProps: {
    height: 300,
    bg: "#0d0d1a",
    text: "GLITCH",
    fontSize: 80,
    fontWeight: 900,
    color: "#cdfe00",
    intensity: 0.5,
  },
  render: function (p) {
    var id = "glitch-" + (p._blockId || Date.now());
    return (
      '<div class="veltro-glitch-wrap" id="' +
      id +
      '" data-text="' +
      (p.text || "GLITCH") +
      '" data-intensity="' +
      (p.intensity || 0.5) +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center"><div class="veltro-glitch-text" style="font-size:' +
      (p.fontSize || 80) +
      "px;font-weight:" +
      (p.fontWeight || 900) +
      ";color:" +
      (p.color || "#cdfe00") +
      ';position:relative;user-select:none">' +
      (p.text || "GLITCH") +
      '<span style="position:absolute;left:2px;top:0;color:#ff0000;opacity:0.8;clip-path:inset(0 0 50% 0);animation:vtglitch1 ' +
      2 / (p.intensity || 0.5) +
      's infinite linear">' +
      (p.text || "GLITCH") +
      '</span><span style="position:absolute;left:-2px;top:0;color:#00ffff;opacity:0.8;clip-path:inset(50% 0 0 0);animation:vtglitch2 ' +
      2 / (p.intensity || 0.5) +
      's infinite linear">' +
      (p.text || "GLITCH") +
      "</span></div></div>"
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="800" value="' +
      (p.height || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Text</label><input type="text" value="' +
      (p.text || "GLITCH") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','text',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Font Size (px)</label><input type="range" min="20" max="200" step="4" value="' +
      (p.fontSize || 80) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontSize',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Text Colour</label><input type="color" value="' +
      (p.color || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Glitch Intensity</label><input type="range" min="0.1" max="2" step="0.1" value="' +
      (p.intensity || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','intensity',+this.value)\"></div>";
    return h;
  },
});

// ── 26. AUDIO VISUALIZER ──
FB.widgets.register("audioVisualizer", {
  label: "Audio Visualizer",
  sublabel: "Animated audio bars",
  icon: "▬",
  iconBg: "#0d1a0d",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "effects",
  defaultProps: {
    height: 300,
    bg: "#0d0d1a",
    barCount: 32,
    barColor: "#cdfe00",
    barWidth: 8,
    barGap: 4,
  },
  render: function (p) {
    var id = "audio-" + (p._blockId || Date.now());
    var barsHtml = "";
    for (var i = 0; i < (p.barCount || 32); i++) {
      barsHtml +=
        '<div class="veltro-audio-bar" style="width:' +
        (p.barWidth || 8) +
        "px;background:" +
        (p.barColor || "#cdfe00") +
        ';border-radius:4px;transition:height 0.1s ease\"></div>';
    }
    return (
      '<div class="veltro-audio-wrap" id="' +
      id +
      '" data-bar-count="' +
      (p.barCount || 32) +
      '" data-bar-color="' +
      (p.barColor || "#cdfe00") +
      '" data-bar-width="' +
      (p.barWidth || 8) +
      '" data-bar-gap="' +
      (p.barGap || 4) +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ";position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:flex-end;justify-content:center;gap:" +
      (p.barGap || 4) +
      'px;padding:20px">' +
      barsHtml +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="800" value="' +
      (p.height || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Bar Count</label><input type="range" min="8" max="64" step="4" value="' +
      (p.barCount || 32) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','barCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Bar Colour</label><input type="color" value="' +
      (p.barColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','barColor',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Bar Width (px)</label><input type="range" min="2" max="24" step="1" value="' +
      (p.barWidth || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','barWidth',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Bar Gap (px)</label><input type="range" min="1" max="16" step="1" value="' +
      (p.barGap || 4) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','barGap',+this.value)\"></div>";
    return h;
  },
});

// ── 27. DEPTH OF FIELD ──
FB.widgets.register("depthOfField", {
  label: "Depth of Field",
  sublabel: "Blur depth effect",
  icon: "◯",
  iconBg: "#0d0d2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "effects",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    layers: 5,
    blurAmount: 10,
    image: "https://picsum.photos/800/400?random=1",
  },
  render: function (p) {
    var id = "dof-" + (p._blockId || Date.now());
    var layersHtml = "";
    for (var i = 0; i < (p.layers || 5); i++) {
      var blur =
        i === 0 ? 0 : (i / ((p.layers || 5) - 1)) * (p.blurAmount || 10);
      var scale = 1 + i * 0.05;
      layersHtml +=
        '<div class="veltro-dof-layer" style="position:absolute;inset:0;background:url(' +
        (p.image || "https://picsum.photos/800/400?random=1") +
        ");background-size:cover;filter:blur(" +
        blur +
        "px);transform:scale(" +
        scale +
        ");opacity:" +
        (1 - i * 0.15) +
        '\"></div>';
    }
    return (
      '<div class="veltro-dof-wrap" id="' +
      id +
      '" data-layers="' +
      (p.layers || 5) +
      '" data-blur-amount="' +
      (p.blurAmount || 10) +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px">' +
      layersHtml +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Depth Layers</label><input type="range" min="2" max="10" step="1" value="' +
      (p.layers || 5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','layers',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Max Blur (px)</label><input type="range" min="0" max="30" step="1" value="' +
      (p.blurAmount || 10) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','blurAmount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
      (p.image || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','image',this.value)\"></div>";
    return h;
  },
});

// ── 28. HOLOGRAPHIC CARD ──
FB.widgets.register("holographicCard", {
  label: "Holographic Card",
  sublabel: "Holographic shimmer",
  icon: "✦",
  iconBg: "#1a0d2e",
  iconColor: "#ff6b35",
  category: "veltro",
  subCategory: "effects",
  defaultProps: {
    height: 300,
    bg: "#0d0d1a",
    cardWidth: 200,
    cardHeight: 280,
    shimmerColor: "#cdfe00",
    intensity: 0.5,
  },
  render: function (p) {
    var id = "holo-" + (p._blockId || Date.now());
    return (
      '<div class="veltro-holo-wrap" id="' +
      id +
      '" data-shimmer-color="' +
      (p.shimmerColor || "#cdfe00") +
      '" data-intensity="' +
      (p.intensity || 0.5) +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center"><div class="veltro-holo-card" style="width:' +
      (p.cardWidth || 200) +
      "px;height:" +
      (p.cardHeight || 280) +
      'px;background:linear-gradient(135deg,rgba(255,255,255,0.1) 0%,rgba(255,255,255,0.05) 100%);border-radius:16px;border:1px solid rgba(255,255,255,0.1);position:relative;overflow:hidden"><div class="veltro-holo-shimmer" style="position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,' +
      (p.shimmerColor || "#cdfe00") +
      " 50%,transparent 60%);opacity:" +
      (p.intensity || 0.5) +
      ';transform:translateX(-100%);animation:vtholo 3s infinite\"></div><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><span style="font-size:3rem">✦</span></div></div></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="800" value="' +
      (p.height || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Card Width (px)</label><input type="range" min="100" max="400" step="10" value="' +
      (p.cardWidth || 200) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','cardWidth',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Card Height (px)</label><input type="range" min="100" max="600" step="10" value="' +
      (p.cardHeight || 280) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','cardHeight',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Shimmer Colour</label><input type="color" value="' +
      (p.shimmerColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','shimmerColor',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Shimmer Intensity</label><input type="range" min="0.1" max="1" step="0.05" value="' +
      (p.intensity || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','intensity',+this.value)\"></div>";
    return h;
  },
});

// ── 29. SOUND REACTIVE ──
FB.widgets.register("soundReactive", {
  label: "Sound Reactive",
  sublabel: "Sound-reactive visualizer",
  icon: "♪",
  iconBg: "#0d1a1a",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "effects",
  defaultProps: {
    height: 300,
    bg: "#0d0d1a",
    ringCount: 5,
    ringColor: "#cdfe00",
    sensitivity: 0.5,
  },
  render: function (p) {
    var id = "sound-" + (p._blockId || Date.now());
    var ringsHtml = "";
    for (var i = 0; i < (p.ringCount || 5); i++) {
      var size = 40 + i * 30;
      ringsHtml +=
        '<div class="veltro-sound-ring" style="position:absolute;width:' +
        size +
        "px;height:" +
        size +
        "px;border:2px solid " +
        (p.ringColor || "#cdfe00") +
        ";border-radius:50%;opacity:" +
        (0.8 - i * 0.15) +
        ";animation:vtsound " +
        (2 + i * 0.3) +
        's ease-in-out infinite\"></div>';
    }
    return (
      '<div class="veltro-sound-wrap" id="' +
      id +
      '" data-ring-count="' +
      (p.ringCount || 5) +
      '" data-ring-color="' +
      (p.ringColor || "#cdfe00") +
      '" data-sensitivity="' +
      (p.sensitivity || 0.5) +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center">' +
      ringsHtml +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="800" value="' +
      (p.height || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Ring Count</label><input type="range" min="1" max="10" step="1" value="' +
      (p.ringCount || 5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','ringCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Ring Colour</label><input type="color" value="' +
      (p.ringColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','ringColor',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Sensitivity</label><input type="range" min="0.1" max="1" step="0.05" value="' +
      (p.sensitivity || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','sensitivity',+this.value)\"></div>";
    return h;
  },
});

// ── 30. MIRROR REFLECTION ──
FB.widgets.register("mirrorReflection", {
  label: "Mirror Reflection",
  sublabel: "Mirror effect",
  icon: "◎",
  iconBg: "#1a0d1a",
  iconColor: "#f472b6",
  category: "veltro",
  subCategory: "effects",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    image: "https://picsum.photos/400/300?random=1",
    reflectionOpacity: 0.3,
  },
  render: function (p) {
    var id = "mirror-" + (p._blockId || Date.now());
    return (
      '<div class="veltro-mirror-wrap" id="' +
      id +
      '" data-reflection-opacity="' +
      (p.reflectionOpacity || 0.3) +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center;flex-direction:column"><div style="width:300px;height:200px;overflow:hidden;border-radius:8px"><img src="' +
      (p.image || "https://picsum.photos/400/300?random=1") +
      '" style="width:100%;height:100%;object-fit:cover" alt=""/></div><div class="veltro-mirror-reflection" style="width:300px;height:200px;overflow:hidden;border-radius:8px;transform:scaleY(-1);opacity:' +
      (p.reflectionOpacity || 0.3) +
      ';margin-top:4px"><img src="' +
      (p.image || "https://picsum.photos/400/300?random=1") +
      '" style="width:100%;height:100%;object-fit:cover;-webkit-mask-image:linear-gradient(transparent 0%,black 100%);mask-image:linear-gradient(transparent 0%,black 100%)" alt=""/></div></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
      (p.image || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','image',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Reflection Opacity</label><input type="range" min="0" max="1" step="0.05" value="' +
      (p.reflectionOpacity || 0.3) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','reflectionOpacity',+this.value)\"></div>";
    return h;
  },
});

// ── 31. CONSTELLATION LINES ──
FB.widgets.register("constellationLines", {
  label: "Constellation Lines",
  sublabel: "Canvas constellation",
  icon: "✦",
  iconBg: "#0d1a2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "effects",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    starCount: 80,
    connectionDistance: 100,
    starColor: "#cdfe00",
    lineColor: "rgba(205,254,0,0.2)",
  },
  render: function (p) {
    var id = "const-" + (p._blockId || Date.now());
    return (
      '<div class="veltro-const-wrap" id="' +
      id +
      '" data-star-count="' +
      (p.starCount || 80) +
      '" data-connection-distance="' +
      (p.connectionDistance || 100) +
      '" data-star-color="' +
      (p.starColor || "#cdfe00") +
      '" data-line-color="' +
      (p.lineColor || "rgba(205,254,0,0.2)") +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px"><canvas class="veltro-const-canvas" style="position:absolute;inset:0;width:100%;height:100%"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Star Count</label><input type="range" min="20" max="200" step="10" value="' +
      (p.starCount || 80) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','starCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Connection Distance (px)</label><input type="range" min="30" max="250" step="10" value="' +
      (p.connectionDistance || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','connectionDistance',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Star Colour</label><input type="color" value="' +
      (p.starColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','starColor',this.value)\"></div>";
    return h;
  },
});

// ── 32. GEOMETRY DRAW ──
FB.widgets.register("geometryDraw", {
  label: "Geometry Draw",
  sublabel: "Canvas drawing tools",
  icon: "✎",
  iconBg: "#0d1a0d",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    tool: "line",
    color: "#cdfe00",
    lineWidth: 3,
  },
  render: function (p) {
    var id = "geo-" + (p._blockId || Date.now());
    return (
      '<div class="veltro-geo-wrap" id="' +
      id +
      '" data-tool="' +
      (p.tool || "line") +
      '" data-color="' +
      (p.color || "#cdfe00") +
      '" data-line-width="' +
      (p.lineWidth || 3) +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px"><canvas class="veltro-geo-canvas" style="position:absolute;inset:0;width:100%;height:100%;cursor:crosshair"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Tool</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','tool',this.value)\"><option value=\"line\"" +
      (p.tool === "line" ? " selected" : "") +
      '>Line</option><option value="circle"' +
      (p.tool === "circle" ? " selected" : "") +
      '>Circle</option><option value="rect"' +
      (p.tool === "rect" ? " selected" : "") +
      ">Rectangle</option></select></div>";
    h +=
      '<div class="rp-row"><label>Draw Colour</label><input type="color" value="' +
      (p.color || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Line Width (px)</label><input type="range" min="1" max="20" step="1" value="' +
      (p.lineWidth || 3) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','lineWidth',+this.value)\"></div>";
    return h;
  },
});

// ── VELTRO ENGINE BATCH 1: CURSOR & INTERACTION (6 NEW WIDGETS) ──
// 1. Multi-Shape Particle Trail
FB.widgets.register("multiShapeTrail", {
  label: "Multi-Shape Trail",
  sublabel: "Morphing particles",
  icon: "✦",
  iconBg: "#1a0d2e",
  iconColor: "#ff6b35",
  category: "veltro",
  subCategory: "cursor",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    particleSize: 8,
    trailLength: 30,
    shapes: "circle,square,triangle,star",
    colors: "#ff6b35,#cdfe00,#3b82f6,#ec4899,#f59e0b",
    speed: 1,
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a1a3e",
    bgImageUrl: "",
    bgImageOpacity: 30,
    bgImageSize: "cover",
    borderRadius: 4,
    borderWidth: 0,
    borderColor: "#ffffff",
    boxShadow: "none",
    shadowColor: "#000000",
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    paddingV: 0,
    paddingH: 0,
    marginV: 0,
    marginH: 0,
    opacity: 100,
    entranceAnim: "none",
    hoverEffect: "none",
    hoverTransition: 300,
    animDuration: 600,
    morphSpeed: 500,
    shapeOrder: "sequential",
    shapeScale: 1,
    shapeOpacity: 100,
    shapeRotation: 0,
    shapeEasing: "ease-out",
    trailFade: true,
    trailGlow: true,
    glowSize: 18,
    autonomousMode: true,
    rotationSpeed: 2,
    particleSpacing: 6,
    colorMode: "palette",
    velocityStretch: false,
    trailBlur: false,
  },
  render: function (p) {
    var id = p._blockId || "multiTrail";
    var bgType = p.bgType || "solid";
    var bgStyle = "";
    if (bgType === "gradient") {
      bgStyle =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a1a3e") +
        ");";
    } else if (bgType === "image" && p.bgImageUrl) {
      bgStyle =
        "background:url('" +
        p.bgImageUrl +
        "') center/" +
        (p.bgImageSize || "cover") +
        " no-repeat;background-color:" +
        (p.bg || "#0d0d1a") +
        ";";
    } else {
      bgStyle = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth && p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px solid " +
        (p.borderColor || "#ffffff") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow && p.boxShadow !== "none") {
      containerShadow =
        "box-shadow:" +
        (p.shadowOffsetX || 0) +
        "px " +
        (p.shadowOffsetY || 4) +
        "px " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowColor || "#000000") +
        ";";
    }
    var hoverClass = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
    }
    var animClass = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
    }
    var padStyle =
      "padding:" + (p.paddingV || 0) + "px " + (p.paddingH || 0) + "px;";
    var margStyle =
      "margin:" + (p.marginV || 0) + "px " + (p.marginH || 0) + "px;";
    var opStyle =
      p.opacity && p.opacity < 100 ? "opacity:" + p.opacity / 100 + ";" : "";
    return (
      '<div class="veltro-multishape-wrap' +
      animClass +
      hoverClass +
      '" id="multishape-' +
      id +
      '" data-trail-length="' +
      (p.trailLength || 30) +
      '" data-particle-size="' +
      (p.particleSize || 8) +
      '" data-shapes="' +
      (p.shapes || "circle,square,triangle,star") +
      '" data-colors="' +
      (p.colors || "#ff6b35,#cdfe00,#3b82f6,#ec4899,#f59e0b") +
      '" data-speed="' +
      (p.speed || 1) +
      '" data-morph-speed="' +
      (p.morphSpeed || 500) +
      '" data-shape-order="' +
      (p.shapeOrder || "sequential") +
      '" data-shape-scale="' +
      (p.shapeScale || 1) +
      '" data-shape-opacity="' +
      (p.shapeOpacity || 100) +
      '" data-shape-rotation="' +
      (p.shapeRotation || 0) +
      '" data-shape-easing="' +
      (p.shapeEasing || "ease-out") +
      '" data-trail-fade="' +
      (p.trailFade !== false ? "true" : "false") +
      '" data-trail-glow="' +
      (p.trailGlow ? "true" : "false") +
      '" data-glow-size="' +
      (p.glowSize || 18) +
      '" data-autonomous-mode="' +
      (p.autonomousMode !== false ? "true" : "false") +
      '" data-rotation-speed="' +
      (p.rotationSpeed !== undefined ? p.rotationSpeed : 2) +
      '" data-particle-spacing="' +
      (p.particleSpacing || 6) +
      '" data-color-mode="' +
      (p.colorMode || "palette") +
      '" data-velocity-stretch="' +
      (p.velocityStretch ? "true" : "false") +
      '" data-trail-blur="' +
      (p.trailBlur ? "true" : "false") +
      '" style="height:' +
      p.height +
      "px;" +
      bgStyle +
      "position:relative;overflow:hidden;cursor:none;border-radius:" +
      (p.borderRadius || 4) +
      "px;" +
      containerBorder +
      containerShadow +
      padStyle +
      margStyle +
      opStyle +
      '"><canvas class="veltro-multishape-canvas" style="position:absolute;inset:0;width:100%;height:100%" data-multishape-init="1"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Core Settings</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Size</label><input type="number" value="' +
      (p.particleSize || 8) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleSize',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Trail Length</label><input type="number" value="' +
      (p.trailLength || 30) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','trailLength',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Shapes (comma-sep)</label><input type="text" value="' +
      (p.shapes || "circle,square,triangle,star") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','shapes',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Colors (comma-sep)</label><input type="text" value="' +
      (p.colors || "#ff6b35,#cdfe00,#3b82f6,#ec4899,#f59e0b") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','colors',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Speed</label><input type="number" step="0.1" value="' +
      (p.speed || 1) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','speed',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Background & Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      ((p.bgType || "solid") === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      ((p.bgType || "solid") === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      ((p.bgType || "solid") === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if ((p.bgType || "solid") === "solid") {
      html +=
        '<div class="rp-row"><label>Background Color</label><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        ((p.bgGradientDir || "135deg") === "135deg" ? " selected" : "") +
        '>135°</option><option value="to right"' +
        ((p.bgGradientDir || "135deg") === "to right" ? " selected" : "") +
        '>Left→Right</option><option value="to bottom"' +
        ((p.bgGradientDir || "135deg") === "to bottom" ? " selected" : "") +
        '>Top→Bottom</option><option value="circle"' +
        ((p.bgGradientDir || "135deg") === "circle" ? " selected" : "") +
        ">Radial</option></select></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a1a3e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImageUrl || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageUrl',this.value)\" placeholder=\"https://...\"></div>";
      html +=
        '<div class="rp-row"><label>Image Opacity (%)</label><input type="number" min="0" max="100" value="' +
        (p.bgImageOpacity || 30) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageOpacity',+this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Image Size</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageSize',this.value)\"><option value=\"cover\"" +
        ((p.bgImageSize || "cover") === "cover" ? " selected" : "") +
        '>Cover</option><option value="contain"' +
        ((p.bgImageSize || "cover") === "contain" ? " selected" : "") +
        '>Contain</option><option value="100% 100%"' +
        ((p.bgImageSize || "cover") === "100% 100%" ? " selected" : "") +
        ">Stretch</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius (px)</label><input type="number" value="' +
      (p.borderRadius || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width (px)</label><input type="number" value="' +
      (p.borderWidth || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Color</label><input type="color" value="' +
      (p.borderColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Box Shadow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','boxShadow',this.value)\"><option value=\"none\"" +
      ((p.boxShadow || "none") === "none" ? " selected" : "") +
      '>None</option><option value="soft"' +
      ((p.boxShadow || "none") === "soft" ? " selected" : "") +
      '>Soft</option><option value="hard"' +
      ((p.boxShadow || "none") === "hard" ? " selected" : "") +
      '>Hard</option><option value="glow"' +
      ((p.boxShadow || "none") === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    if (p.boxShadow && p.boxShadow !== "none") {
      html +=
        '<div class="rp-row"><label>Shadow Color</label><input type="color" value="' +
        (p.shadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur</label><input type="number" value="' +
        (p.shadowBlur || 10) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Spacing & Display</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Padding V (px)</label><input type="number" value="' +
      (p.paddingV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H (px)</label><input type="number" value="' +
      (p.paddingH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin V (px)</label><input type="number" value="' +
      (p.marginV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin H (px)</label><input type="number" value="' +
      (p.marginH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animations & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      ((p.entranceAnim || "none") === "none" ? " selected" : "") +
      '>None</option><option value="fade-in"' +
      ((p.entranceAnim || "none") === "fade-in" ? " selected" : "") +
      '>Fade In</option><option value="slide-up"' +
      ((p.entranceAnim || "none") === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="slide-left"' +
      ((p.entranceAnim || "none") === "slide-left" ? " selected" : "") +
      '>Slide Left</option><option value="zoom-in"' +
      ((p.entranceAnim || "none") === "zoom-in" ? " selected" : "") +
      '>Zoom In</option><option value="flip-in"' +
      ((p.entranceAnim || "none") === "flip-in" ? " selected" : "") +
      ">Flip In</option></select></div>";
    html +=
      '<div class="rp-row"><label>Animation Duration (ms)</label><input type="number" value="' +
      (p.animDuration || 600) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','animDuration',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      ((p.hoverEffect || "none") === "none" ? " selected" : "") +
      '>None</option><option value="lift"' +
      ((p.hoverEffect || "none") === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      ((p.hoverEffect || "none") === "glow" ? " selected" : "") +
      '>Glow</option><option value="scale"' +
      ((p.hoverEffect || "none") === "scale" ? " selected" : "") +
      '>Scale</option><option value="tilt"' +
      ((p.hoverEffect || "none") === "tilt" ? " selected" : "") +
      ">Tilt</option></select></div>";
    html +=
      '<div class="rp-row"><label>Hover Transition (ms)</label><input type="number" value="' +
      (p.hoverTransition || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverTransition',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Trail Behaviour</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Shapes (comma-sep)</label><input type="text" value="' +
      (p.shapes || "circle,square,triangle,star") +
      '" placeholder="circle,square,triangle,star,diamond,hexagon,ring,cross" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','shapes',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Colors (comma-sep)</label><input type="text" value="' +
      (p.colors || "#ff6b35,#cdfe00,#3b82f6,#ec4899,#f59e0b") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','colors',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Color Mode</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','colorMode',this.value)\"><option value=\"palette\"" +
      ((p.colorMode || "palette") === "palette" ? " selected" : "") +
      '>Palette</option><option value="gradient"' +
      ((p.colorMode || "palette") === "gradient" ? " selected" : "") +
      ">Gradient</option></select></div>";
    html +=
      '<div class="rp-row"><label>Particle Size</label><div style="display:flex;align-items:center;gap:6px"><input type="range" min="2" max="40" step="1" value="' +
      (p.particleSize || 8) +
      '" style="flex:1" oninput="this.nextElementSibling.textContent=this.value;FB.panels.updateWidgetProp(\'' +
      id +
      "','particleSize',+this.value)\"><span style=\"width:24px;font-size:11px;color:rgba(255,255,255,0.5)\">" +
      (p.particleSize || 8) +
      "</span></div></div>";
    html +=
      '<div class="rp-row"><label>Trail Length</label><div style="display:flex;align-items:center;gap:6px"><input type="range" min="5" max="80" step="1" value="' +
      (p.trailLength || 30) +
      '" style="flex:1" oninput="this.nextElementSibling.textContent=this.value;FB.panels.updateWidgetProp(\'' +
      id +
      "','trailLength',+this.value)\"><span style=\"width:24px;font-size:11px;color:rgba(255,255,255,0.5)\">" +
      (p.trailLength || 30) +
      "</span></div></div>";
    html +=
      '<div class="rp-row"><label>Particle Spacing</label><div style="display:flex;align-items:center;gap:6px"><input type="range" min="1" max="30" step="1" value="' +
      (p.particleSpacing || 6) +
      '" style="flex:1" oninput="this.nextElementSibling.textContent=this.value;FB.panels.updateWidgetProp(\'' +
      id +
      "','particleSpacing',+this.value)\"><span style=\"width:24px;font-size:11px;color:rgba(255,255,255,0.5)\">" +
      (p.particleSpacing || 6) +
      "</span></div></div>";
    html +=
      '<div class="rp-row"><label>Speed</label><div style="display:flex;align-items:center;gap:6px"><input type="range" min="0.2" max="4" step="0.1" value="' +
      (p.speed || 1) +
      '" style="flex:1" oninput="this.nextElementSibling.textContent=this.value;FB.panels.updateWidgetProp(\'' +
      id +
      "','speed',+this.value)\"><span style=\"width:24px;font-size:11px;color:rgba(255,255,255,0.5)\">" +
      (p.speed || 1) +
      "</span></div></div>";
    html +=
      '<div class="rp-row"><label>Shape Order</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','shapeOrder',this.value)\"><option value=\"sequential\"" +
      ((p.shapeOrder || "sequential") === "sequential" ? " selected" : "") +
      '>Sequential</option><option value="random"' +
      ((p.shapeOrder || "sequential") === "random" ? " selected" : "") +
      '>Random</option><option value="reverse"' +
      ((p.shapeOrder || "sequential") === "reverse" ? " selected" : "") +
      ">Reverse</option></select></div>";
    html +=
      '<div class="rp-row"><label>Shape Scale</label><div style="display:flex;align-items:center;gap:6px"><input type="range" min="0.2" max="3" step="0.1" value="' +
      (p.shapeScale || 1) +
      '" style="flex:1" oninput="this.nextElementSibling.textContent=this.value;FB.panels.updateWidgetProp(\'' +
      id +
      "','shapeScale',+this.value)\"><span style=\"width:24px;font-size:11px;color:rgba(255,255,255,0.5)\">" +
      (p.shapeScale || 1) +
      "</span></div></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Motion & Rotation</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Autonomous Mode</label><input type="checkbox"' +
      (p.autonomousMode !== false ? " checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','autonomousMode',this.checked)\"><span style=\"font-size:11px;color:rgba(255,255,255,0.4);margin-left:6px\">Animate when mouse is outside</span></div>";
    html +=
      '<div class="rp-row"><label>Rotation Speed</label><div style="display:flex;align-items:center;gap:6px"><input type="range" min="0" max="12" step="0.5" value="' +
      (p.rotationSpeed !== undefined ? p.rotationSpeed : 2) +
      '" style="flex:1" oninput="this.nextElementSibling.textContent=this.value;FB.panels.updateWidgetProp(\'' +
      id +
      "','rotationSpeed',+this.value)\"><span style=\"width:24px;font-size:11px;color:rgba(255,255,255,0.5)\">" +
      (p.rotationSpeed !== undefined ? p.rotationSpeed : 2) +
      "</span></div></div>";
    html +=
      '<div class="rp-row"><label>Base Rotation (deg)</label><div style="display:flex;align-items:center;gap:6px"><input type="range" min="0" max="360" step="5" value="' +
      (p.shapeRotation || 0) +
      '" style="flex:1" oninput="this.nextElementSibling.textContent=this.value;FB.panels.updateWidgetProp(\'' +
      id +
      "','shapeRotation',+this.value)\"><span style=\"width:28px;font-size:11px;color:rgba(255,255,255,0.5)\">" +
      (p.shapeRotation || 0) +
      "</span></div></div>";
    html +=
      '<div class="rp-row"><label>Velocity Stretch</label><input type="checkbox"' +
      (p.velocityStretch ? " checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','velocityStretch',this.checked)\"><span style=\"font-size:11px;color:rgba(255,255,255,0.4);margin-left:6px\">Squash &amp; stretch with speed</span></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Glow & Fade</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Trail Fade</label><input type="checkbox"' +
      (p.trailFade !== false ? " checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','trailFade',this.checked)\"></div>";
    html +=
      '<div class="rp-row"><label>Trail Blur</label><input type="checkbox"' +
      (p.trailBlur ? " checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','trailBlur',this.checked)\"><span style=\"font-size:11px;color:rgba(255,255,255,0.4);margin-left:6px\">Motion-blur smear effect</span></div>";
    html +=
      '<div class="rp-row"><label>Glow</label><input type="checkbox"' +
      (p.trailGlow ? " checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','trailGlow',this.checked)\"></div>";
    if (p.trailGlow) {
      html +=
        '<div class="rp-row"><label>Glow Size</label><div style="display:flex;align-items:center;gap:6px"><input type="range" min="4" max="60" step="2" value="' +
        (p.glowSize || 18) +
        '" style="flex:1" oninput="this.nextElementSibling.textContent=this.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','glowSize',+this.value)\"><span style=\"width:24px;font-size:11px;color:rgba(255,255,255,0.5)\">" +
        (p.glowSize || 18) +
        "</span></div></div>";
    }
    html +=
      '<div class="rp-row"><label>Shape Opacity (%)</label><div style="display:flex;align-items:center;gap:6px"><input type="range" min="10" max="100" step="5" value="' +
      (p.shapeOpacity || 100) +
      '" style="flex:1" oninput="this.nextElementSibling.textContent=this.value;FB.panels.updateWidgetProp(\'' +
      id +
      "','shapeOpacity',+this.value)\"><span style=\"width:28px;font-size:11px;color:rgba(255,255,255,0.5)\">" +
      (p.shapeOpacity || 100) +
      "</span></div></div>";
    html += "</div></div>";
    return html;
  },
});

// 2. Cursor Spotlight
FB.widgets.register("cursorSpotlight", {
  label: "Cursor Spotlight",
  sublabel: "Dynamic light reveal",
  icon: "💡",
  iconBg: "#1a1a0d",
  iconColor: "#fbbf24",
  category: "veltro",
  subCategory: "cursor",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    spotlightSize: 150,
    spotlightColor: "#ffffff",
    spotlightOpacity: 0.15,
    edgeSoftness: 50,
    content: "Hidden content revealed by spotlight",
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a1a3e",
    bgImageUrl: "",
    bgImageOpacity: 30,
    bgImageSize: "cover",
    borderRadius: 4,
    borderWidth: 0,
    borderColor: "#ffffff",
    boxShadow: "none",
    shadowColor: "#000000",
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    paddingV: 0,
    paddingH: 0,
    marginV: 0,
    marginH: 0,
    opacity: 100,
    entranceAnim: "none",
    hoverEffect: "none",
    hoverTransition: 300,
    animDuration: 600,
    spotlightShape: "circle",
    spotlightFollow: true,
    spotlightMultiple: false,
    spotlightBlendMode: "overlay",
    spotlightText: "Hidden content revealed by spotlight",
    spotlightTextColor: "#ffffff",
    spotlightBgColor: "#1a1a2e",
    spotlightRevealMode: "mask",
  },
  render: function (p) {
    var id = p._blockId || "spotlight";
    var bgType = p.bgType || "solid";
    var bgStyle = "";
    if (bgType === "gradient") {
      bgStyle =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a1a3e") +
        ");";
    } else if (bgType === "image" && p.bgImageUrl) {
      bgStyle =
        "background:url('" +
        p.bgImageUrl +
        "') center/" +
        (p.bgImageSize || "cover") +
        " no-repeat;background-color:" +
        (p.bg || "#0d0d1a") +
        ";";
    } else {
      bgStyle = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth && p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px solid " +
        (p.borderColor || "#ffffff") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow && p.boxShadow !== "none") {
      containerShadow =
        "box-shadow:" +
        (p.shadowOffsetX || 0) +
        "px " +
        (p.shadowOffsetY || 4) +
        "px " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowColor || "#000000") +
        ";";
    }
    var hoverClass = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
    }
    var animClass = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
    }
    var padStyle =
      "padding:" + (p.paddingV || 0) + "px " + (p.paddingH || 0) + "px;";
    var margStyle =
      "margin:" + (p.marginV || 0) + "px " + (p.marginH || 0) + "px;";
    var opStyle =
      p.opacity && p.opacity < 100 ? "opacity:" + p.opacity / 100 + ";" : "";
    var spotSize = p.spotlightSize || 150;
    var edgeSoft = p.edgeSoftness || 50;
    return (
      '<div class="veltro-spotlight-wrap' +
      animClass +
      hoverClass +
      '" id="spotlight-' +
      id +
      '" data-spotlight-size="' +
      spotSize +
      '" data-spotlight-color="' +
      (p.spotlightColor || "#ffffff") +
      '" data-spotlight-opacity="' +
      (p.spotlightOpacity || 0.15) +
      '" data-edge-softness="' +
      edgeSoft +
      '" data-spotlight-shape="' +
      (p.spotlightShape || "circle") +
      '" data-spotlight-follow="' +
      (p.spotlightFollow !== false ? "true" : "false") +
      '" data-spotlight-multiple="' +
      (p.spotlightMultiple ? "true" : "false") +
      '" data-spotlight-blend-mode="' +
      (p.spotlightBlendMode || "overlay") +
      '" data-spotlight-reveal-mode="' +
      (p.spotlightRevealMode || "mask") +
      '" style="height:' +
      p.height +
      "px;" +
      bgStyle +
      "position:relative;overflow:hidden;border-radius:" +
      (p.borderRadius || 4) +
      "px;" +
      containerBorder +
      containerShadow +
      padStyle +
      margStyle +
      opStyle +
      '"><div class="veltro-spotlight-content" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:' +
      (p.spotlightTextColor || "#ffffff") +
      ';font-size:1.5rem;font-weight:600;opacity:0.3">' +
      (p.spotlightText || p.content || "Hidden content revealed by spotlight") +
      '</div><div class="veltro-spotlight-mask" style="position:absolute;inset:0;background:radial-gradient(circle ' +
      spotSize +
      "px at var(--sx,50%) var(--sy,50%)," +
      (p.spotlightColor || "#ffffff") +
      " 0%,transparent " +
      (spotSize + edgeSoft) +
      "px);opacity:" +
      (p.spotlightOpacity || 0.15) +
      ";pointer-events:none;mix-blend-mode:" +
      (p.spotlightBlendMode || "overlay") +
      '" data-spotlight-init="1"></div></div>'
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Core Settings</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Spotlight Size</label><input type="number" value="' +
      (p.spotlightSize || 150) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','spotlightSize',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Spotlight Color</label><input type="color" value="' +
      (p.spotlightColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','spotlightColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Spotlight Opacity</label><input type="number" step="0.05" min="0" max="1" value="' +
      (p.spotlightOpacity || 0.15) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','spotlightOpacity',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Edge Softness</label><input type="number" value="' +
      (p.edgeSoftness || 50) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','edgeSoftness',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Spotlight Text</label><input type="text" value="' +
      (p.spotlightText || p.content || "Hidden content revealed by spotlight") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','spotlightText',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Text Color</label><input type="color" value="' +
      (p.spotlightTextColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','spotlightTextColor',this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Background & Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      ((p.bgType || "solid") === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      ((p.bgType || "solid") === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      ((p.bgType || "solid") === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if ((p.bgType || "solid") === "solid") {
      html +=
        '<div class="rp-row"><label>Background Color</label><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        ((p.bgGradientDir || "135deg") === "135deg" ? " selected" : "") +
        '>135°</option><option value="to right"' +
        ((p.bgGradientDir || "135deg") === "to right" ? " selected" : "") +
        '>Left→Right</option><option value="to bottom"' +
        ((p.bgGradientDir || "135deg") === "to bottom" ? " selected" : "") +
        '>Top→Bottom</option><option value="circle"' +
        ((p.bgGradientDir || "135deg") === "circle" ? " selected" : "") +
        ">Radial</option></select></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a1a3e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImageUrl || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageUrl',this.value)\" placeholder=\"https://...\"></div>";
      html +=
        '<div class="rp-row"><label>Image Opacity (%)</label><input type="number" min="0" max="100" value="' +
        (p.bgImageOpacity || 30) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageOpacity',+this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Image Size</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageSize',this.value)\"><option value=\"cover\"" +
        ((p.bgImageSize || "cover") === "cover" ? " selected" : "") +
        '>Cover</option><option value="contain"' +
        ((p.bgImageSize || "cover") === "contain" ? " selected" : "") +
        '>Contain</option><option value="100% 100%"' +
        ((p.bgImageSize || "cover") === "100% 100%" ? " selected" : "") +
        ">Stretch</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius (px)</label><input type="number" value="' +
      (p.borderRadius || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width (px)</label><input type="number" value="' +
      (p.borderWidth || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Color</label><input type="color" value="' +
      (p.borderColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Box Shadow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','boxShadow',this.value)\"><option value=\"none\"" +
      ((p.boxShadow || "none") === "none" ? " selected" : "") +
      '>None</option><option value="soft"' +
      ((p.boxShadow || "none") === "soft" ? " selected" : "") +
      '>Soft</option><option value="hard"' +
      ((p.boxShadow || "none") === "hard" ? " selected" : "") +
      '>Hard</option><option value="glow"' +
      ((p.boxShadow || "none") === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    if (p.boxShadow && p.boxShadow !== "none") {
      html +=
        '<div class="rp-row"><label>Shadow Color</label><input type="color" value="' +
        (p.shadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur</label><input type="number" value="' +
        (p.shadowBlur || 10) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Spacing & Display</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Padding V (px)</label><input type="number" value="' +
      (p.paddingV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H (px)</label><input type="number" value="' +
      (p.paddingH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin V (px)</label><input type="number" value="' +
      (p.marginV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin H (px)</label><input type="number" value="' +
      (p.marginH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animations & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      ((p.entranceAnim || "none") === "none" ? " selected" : "") +
      '>None</option><option value="fade-in"' +
      ((p.entranceAnim || "none") === "fade-in" ? " selected" : "") +
      '>Fade In</option><option value="slide-up"' +
      ((p.entranceAnim || "none") === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="slide-left"' +
      ((p.entranceAnim || "none") === "slide-left" ? " selected" : "") +
      '>Slide Left</option><option value="zoom-in"' +
      ((p.entranceAnim || "none") === "zoom-in" ? " selected" : "") +
      '>Zoom In</option><option value="flip-in"' +
      ((p.entranceAnim || "none") === "flip-in" ? " selected" : "") +
      ">Flip In</option></select></div>";
    html +=
      '<div class="rp-row"><label>Animation Duration (ms)</label><input type="number" value="' +
      (p.animDuration || 600) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','animDuration',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      ((p.hoverEffect || "none") === "none" ? " selected" : "") +
      '>None</option><option value="lift"' +
      ((p.hoverEffect || "none") === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      ((p.hoverEffect || "none") === "glow" ? " selected" : "") +
      '>Glow</option><option value="scale"' +
      ((p.hoverEffect || "none") === "scale" ? " selected" : "") +
      '>Scale</option><option value="tilt"' +
      ((p.hoverEffect || "none") === "tilt" ? " selected" : "") +
      ">Tilt</option></select></div>";
    html +=
      '<div class="rp-row"><label>Hover Transition (ms)</label><input type="number" value="' +
      (p.hoverTransition || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverTransition',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Advanced Spotlight Options</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Spotlight Shape</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','spotlightShape',this.value)\"><option value=\"circle\"" +
      ((p.spotlightShape || "circle") === "circle" ? " selected" : "") +
      '>Circle</option><option value="square"' +
      ((p.spotlightShape || "circle") === "square" ? " selected" : "") +
      '>Square</option><option value="ellipse"' +
      ((p.spotlightShape || "circle") === "ellipse" ? " selected" : "") +
      ">Ellipse</option></select></div>";
    html +=
      '<div class="rp-row"><label>Follow Cursor</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','spotlightFollow',this.value)\"><option value=\"true\"" +
      (p.spotlightFollow !== false ? " selected" : "") +
      '>Enabled</option><option value="false"' +
      (p.spotlightFollow === false ? " selected" : "") +
      ">Static</option></select></div>";
    html +=
      '<div class="rp-row"><label>Multiple Spotlights</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','spotlightMultiple',this.value)\"><option value=\"false\"" +
      (!p.spotlightMultiple ? " selected" : "") +
      '>Single</option><option value="true"' +
      (p.spotlightMultiple ? " selected" : "") +
      ">Multi</option></select></div>";
    html +=
      '<div class="rp-row"><label>Blend Mode</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','spotlightBlendMode',this.value)\"><option value=\"overlay\"" +
      ((p.spotlightBlendMode || "overlay") === "overlay" ? " selected" : "") +
      '>Overlay</option><option value="screen"' +
      ((p.spotlightBlendMode || "overlay") === "screen" ? " selected" : "") +
      '>Screen</option><option value="multiply"' +
      ((p.spotlightBlendMode || "overlay") === "multiply" ? " selected" : "") +
      '>Multiply</option><option value="soft-light"' +
      ((p.spotlightBlendMode || "overlay") === "soft-light"
        ? " selected"
        : "") +
      '>Soft Light</option><option value="hard-light"' +
      ((p.spotlightBlendMode || "overlay") === "hard-light"
        ? " selected"
        : "") +
      ">Hard Light</option></select></div>";
    html +=
      '<div class="rp-row"><label>Reveal Mode</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','spotlightRevealMode',this.value)\"><option value=\"mask\"" +
      ((p.spotlightRevealMode || "mask") === "mask" ? " selected" : "") +
      '>Mask</option><option value="highlight"' +
      ((p.spotlightRevealMode || "mask") === "highlight" ? " selected" : "") +
      '>Highlight</option><option value="invert"' +
      ((p.spotlightRevealMode || "mask") === "invert" ? " selected" : "") +
      ">Invert</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

// 3. Magnetic Text
FB.widgets.register("magneticText", {
  label: "Magnetic Text",
  sublabel: "Characters attract to cursor",
  icon: "Aa",
  iconBg: "#0d1a2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "cursor",
  defaultProps: {
    height: 300,
    bg: "#0d0d1a",
    text: "MAGNETIC",
    fontSize: 72,
    fontWeight: 800,
    textColor: "#cdfe00",
    magneticRadius: 150,
    magneticStrength: 0.5,
    letterSpacing: 8,
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a1a3e",
    bgImageUrl: "",
    bgImageOpacity: 30,
    bgImageSize: "cover",
    borderRadius: 4,
    borderWidth: 0,
    borderColor: "#ffffff",
    boxShadow: "none",
    shadowColor: "#000000",
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    paddingV: 0,
    paddingH: 0,
    marginV: 0,
    marginH: 0,
    opacity: 100,
    entranceAnim: "none",
    hoverEffect: "none",
    hoverTransition: 300,
    animDuration: 600,
    fontFamily: "inherit",
    textTransform: "uppercase",
    magneticEasing: "ease-out",
    magneticReturn: true,
    textGlow: false,
    glowColor: "#cdfe00",
    glowBlur: 10,
    letterSpacingAnim: false,
  },
  render: function (p) {
    var id = p._blockId || "magText";
    var chars = (p.text || "MAGNETIC").split("");
    var charHtml = chars
      .map(function (c, i) {
        return (
          '<span class="veltro-mag-char" data-magnetic="true" data-magnetic-radius="' +
          (p.magneticRadius || 150) +
          '" data-magnetic-strength="' +
          (p.magneticStrength || 0.5) +
          '" style="display:inline-block;transition:transform 0.3s ' +
          (p.magneticEasing || "ease-out") +
          '">' +
          c +
          "</span>"
        );
      })
      .join("");
    var bgType = p.bgType || "solid";
    var bgStyle = "";
    if (bgType === "gradient") {
      bgStyle =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a1a3e") +
        ");";
    } else if (bgType === "image" && p.bgImageUrl) {
      bgStyle =
        "background:url('" +
        p.bgImageUrl +
        "') center/" +
        (p.bgImageSize || "cover") +
        " no-repeat;background-color:" +
        (p.bg || "#0d0d1a") +
        ";";
    } else {
      bgStyle = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth && p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px solid " +
        (p.borderColor || "#ffffff") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow && p.boxShadow !== "none") {
      containerShadow =
        "box-shadow:" +
        (p.shadowOffsetX || 0) +
        "px " +
        (p.shadowOffsetY || 4) +
        "px " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowColor || "#000000") +
        ";";
    }
    var hoverClass = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
    }
    var animClass = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
    }
    var padStyle =
      "padding:" + (p.paddingV || 0) + "px " + (p.paddingH || 0) + "px;";
    var margStyle =
      "margin:" + (p.marginV || 0) + "px " + (p.marginH || 0) + "px;";
    var opStyle =
      p.opacity && p.opacity < 100 ? "opacity:" + p.opacity / 100 + ";" : "";
    var textGlowStyle = p.textGlow
      ? "text-shadow:0 0 " +
        (p.glowBlur || 10) +
        "px " +
        (p.glowColor || "#cdfe00") +
        ";"
      : "";
    return (
      '<div class="veltro-magtext-wrap' +
      animClass +
      hoverClass +
      '" id="magtext-' +
      id +
      '" style="height:' +
      p.height +
      "px;" +
      bgStyle +
      "display:flex;align-items:center;justify-content:center;border-radius:" +
      (p.borderRadius || 4) +
      "px;overflow:hidden;" +
      containerBorder +
      containerShadow +
      padStyle +
      margStyle +
      opStyle +
      '"><div class="veltro-magtext-content" style="font-size:' +
      (p.fontSize || 72) +
      "px;font-weight:" +
      (p.fontWeight || 800) +
      ";color:" +
      (p.textColor || "#cdfe00") +
      ";letter-spacing:" +
      (p.letterSpacing || 8) +
      "px;user-select:none;font-family:" +
      (p.fontFamily || "inherit") +
      ";text-transform:" +
      (p.textTransform || "uppercase") +
      ";" +
      textGlowStyle +
      '" data-magtext-init="1">' +
      charHtml +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Core Settings</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Text</label><input type="text" value="' +
      (p.text || "MAGNETIC") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','text',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Font Size (px)</label><input type="number" value="' +
      (p.fontSize || 72) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontSize',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Font Weight</label><input type="number" value="' +
      (p.fontWeight || 800) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontWeight',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Text Color</label><input type="color" value="' +
      (p.textColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Letter Spacing (px)</label><input type="number" value="' +
      (p.letterSpacing || 8) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','letterSpacing',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Magnetic Radius</label><input type="number" value="' +
      (p.magneticRadius || 150) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','magneticRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Magnetic Strength</label><input type="number" step="0.1" min="0" max="1" value="' +
      (p.magneticStrength || 0.5) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','magneticStrength',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Background & Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      ((p.bgType || "solid") === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      ((p.bgType || "solid") === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      ((p.bgType || "solid") === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if ((p.bgType || "solid") === "solid") {
      html +=
        '<div class="rp-row"><label>Background Color</label><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        ((p.bgGradientDir || "135deg") === "135deg" ? " selected" : "") +
        '>135°</option><option value="to right"' +
        ((p.bgGradientDir || "135deg") === "to right" ? " selected" : "") +
        '>Left→Right</option><option value="to bottom"' +
        ((p.bgGradientDir || "135deg") === "to bottom" ? " selected" : "") +
        '>Top→Bottom</option><option value="circle"' +
        ((p.bgGradientDir || "135deg") === "circle" ? " selected" : "") +
        ">Radial</option></select></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a1a3e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImageUrl || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageUrl',this.value)\" placeholder=\"https://...\"></div>";
      html +=
        '<div class="rp-row"><label>Image Opacity (%)</label><input type="number" min="0" max="100" value="' +
        (p.bgImageOpacity || 30) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageOpacity',+this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Image Size</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageSize',this.value)\"><option value=\"cover\"" +
        ((p.bgImageSize || "cover") === "cover" ? " selected" : "") +
        '>Cover</option><option value="contain"' +
        ((p.bgImageSize || "cover") === "contain" ? " selected" : "") +
        '>Contain</option><option value="100% 100%"' +
        ((p.bgImageSize || "cover") === "100% 100%" ? " selected" : "") +
        ">Stretch</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius (px)</label><input type="number" value="' +
      (p.borderRadius || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width (px)</label><input type="number" value="' +
      (p.borderWidth || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Color</label><input type="color" value="' +
      (p.borderColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Box Shadow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','boxShadow',this.value)\"><option value=\"none\"" +
      ((p.boxShadow || "none") === "none" ? " selected" : "") +
      '>None</option><option value="soft"' +
      ((p.boxShadow || "none") === "soft" ? " selected" : "") +
      '>Soft</option><option value="hard"' +
      ((p.boxShadow || "none") === "hard" ? " selected" : "") +
      '>Hard</option><option value="glow"' +
      ((p.boxShadow || "none") === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    if (p.boxShadow && p.boxShadow !== "none") {
      html +=
        '<div class="rp-row"><label>Shadow Color</label><input type="color" value="' +
        (p.shadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur</label><input type="number" value="' +
        (p.shadowBlur || 10) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Spacing & Display</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Padding V (px)</label><input type="number" value="' +
      (p.paddingV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H (px)</label><input type="number" value="' +
      (p.paddingH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin V (px)</label><input type="number" value="' +
      (p.marginV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin H (px)</label><input type="number" value="' +
      (p.marginH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animations & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      ((p.entranceAnim || "none") === "none" ? " selected" : "") +
      '>None</option><option value="fade-in"' +
      ((p.entranceAnim || "none") === "fade-in" ? " selected" : "") +
      '>Fade In</option><option value="slide-up"' +
      ((p.entranceAnim || "none") === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="slide-left"' +
      ((p.entranceAnim || "none") === "slide-left" ? " selected" : "") +
      '>Slide Left</option><option value="zoom-in"' +
      ((p.entranceAnim || "none") === "zoom-in" ? " selected" : "") +
      '>Zoom In</option><option value="flip-in"' +
      ((p.entranceAnim || "none") === "flip-in" ? " selected" : "") +
      ">Flip In</option></select></div>";
    html +=
      '<div class="rp-row"><label>Animation Duration (ms)</label><input type="number" value="' +
      (p.animDuration || 600) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','animDuration',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      ((p.hoverEffect || "none") === "none" ? " selected" : "") +
      '>None</option><option value="lift"' +
      ((p.hoverEffect || "none") === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      ((p.hoverEffect || "none") === "glow" ? " selected" : "") +
      '>Glow</option><option value="scale"' +
      ((p.hoverEffect || "none") === "scale" ? " selected" : "") +
      '>Scale</option><option value="tilt"' +
      ((p.hoverEffect || "none") === "tilt" ? " selected" : "") +
      ">Tilt</option></select></div>";
    html +=
      '<div class="rp-row"><label>Hover Transition (ms)</label><input type="number" value="' +
      (p.hoverTransition || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverTransition',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Advanced Typography Options</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Font Family</label><input type="text" value="' +
      (p.fontFamily || "inherit") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontFamily',this.value)\" placeholder=\"inherit, sans-serif, serif...\"></div>";
    html +=
      '<div class="rp-row"><label>Text Transform</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textTransform',this.value)\"><option value=\"uppercase\"" +
      ((p.textTransform || "uppercase") === "uppercase" ? " selected" : "") +
      '>UPPERCASE</option><option value="lowercase"' +
      ((p.textTransform || "uppercase") === "lowercase" ? " selected" : "") +
      '>lowercase</option><option value="capitalize"' +
      ((p.textTransform || "uppercase") === "capitalize" ? " selected" : "") +
      '>Capitalize</option><option value="none"' +
      ((p.textTransform || "uppercase") === "none" ? " selected" : "") +
      ">None</option></select></div>";
    html +=
      '<div class="rp-row"><label>Magnetic Easing</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','magneticEasing',this.value)\"><option value=\"ease-out\"" +
      ((p.magneticEasing || "ease-out") === "ease-out" ? " selected" : "") +
      '>Ease Out</option><option value="ease-in"' +
      ((p.magneticEasing || "ease-out") === "ease-in" ? " selected" : "") +
      '>Ease In</option><option value="linear"' +
      ((p.magneticEasing || "ease-out") === "linear" ? " selected" : "") +
      '>Linear</option><option value="bounce"' +
      ((p.magneticEasing || "ease-out") === "bounce" ? " selected" : "") +
      ">Bounce</option></select></div>";
    html +=
      '<div class="rp-row"><label>Magnetic Return</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','magneticReturn',this.value)\"><option value=\"true\"" +
      (p.magneticReturn !== false ? " selected" : "") +
      '>Enabled</option><option value="false"' +
      (p.magneticReturn === false ? " selected" : "") +
      ">Disabled</option></select></div>";
    html +=
      '<div class="rp-row"><label>Text Glow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textGlow',this.value)\"><option value=\"false\"" +
      (!p.textGlow ? " selected" : "") +
      '>Off</option><option value="true"' +
      (p.textGlow ? " selected" : "") +
      ">On</option></select></div>";
    if (p.textGlow) {
      html +=
        '<div class="rp-row"><label>Glow Color</label><input type="color" value="' +
        (p.glowColor || "#cdfe00") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Glow Blur (px)</label><input type="number" value="' +
        (p.glowBlur || 10) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowBlur',+this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Letter Spacing Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','letterSpacingAnim',this.value)\"><option value=\"false\"" +
      (!p.letterSpacingAnim ? " selected" : "") +
      '>Off</option><option value="true"' +
      (p.letterSpacingAnim ? " selected" : "") +
      ">On</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

// 4. Cursor Distortion Field
FB.widgets.register("cursorDistortion", {
  label: "Distortion Field",
  sublabel: "Lens distortion effect",
  icon: "◎",
  iconBg: "#1a0d1a",
  iconColor: "#a78bfa",
  category: "veltro",
  subCategory: "cursor",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    distortionRadius: 100,
    distortionStrength: 0.3,
    imageUrl: "https://picsum.photos/800/400?random=50",
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a1a3e",
    bgImageUrl: "",
    bgImageOpacity: 30,
    bgImageSize: "cover",
    borderRadius: 4,
    borderWidth: 0,
    borderColor: "#ffffff",
    boxShadow: "none",
    shadowColor: "#000000",
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    paddingV: 0,
    paddingH: 0,
    marginV: 0,
    marginH: 0,
    opacity: 100,
    entranceAnim: "none",
    hoverEffect: "none",
    hoverTransition: 300,
    animDuration: 600,
    distortionType: "lens",
    distortionShape: "circle",
    distortionInvert: false,
    distortionChromatic: false,
    distortionOverlay: true,
    overlayColor: "#a78bfa",
    overlayOpacity: 20,
    imageFilter: "none",
  },
  render: function (p) {
    var id = p._blockId || "distort";
    var bgType = p.bgType || "solid";
    var bgStyle = "";
    if (bgType === "gradient") {
      bgStyle =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a1a3e") +
        ");";
    } else if (bgType === "image" && p.bgImageUrl) {
      bgStyle =
        "background:url('" +
        p.bgImageUrl +
        "') center/" +
        (p.bgImageSize || "cover") +
        " no-repeat;background-color:" +
        (p.bg || "#0d0d1a") +
        ";";
    } else {
      bgStyle = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth && p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px solid " +
        (p.borderColor || "#ffffff") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow && p.boxShadow !== "none") {
      containerShadow =
        "box-shadow:" +
        (p.shadowOffsetX || 0) +
        "px " +
        (p.shadowOffsetY || 4) +
        "px " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowColor || "#000000") +
        ";";
    }
    var hoverClass = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
    }
    var animClass = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
    }
    var padStyle =
      "padding:" + (p.paddingV || 0) + "px " + (p.paddingH || 0) + "px;";
    var margStyle =
      "margin:" + (p.marginV || 0) + "px " + (p.marginH || 0) + "px;";
    var opStyle =
      p.opacity && p.opacity < 100 ? "opacity:" + p.opacity / 100 + ";" : "";
    var imgFilter =
      p.imageFilter && p.imageFilter !== "none"
        ? "filter:" + p.imageFilter + ";"
        : "";
    return (
      '<div class="veltro-distort-wrap' +
      animClass +
      hoverClass +
      '" id="distort-' +
      id +
      '" data-distortion-radius="' +
      (p.distortionRadius || 100) +
      '" data-distortion-strength="' +
      (p.distortionStrength || 0.3) +
      '" data-distortion-type="' +
      (p.distortionType || "lens") +
      '" data-distortion-shape="' +
      (p.distortionShape || "circle") +
      '" data-distortion-invert="' +
      (p.distortionInvert ? "true" : "false") +
      '" data-distortion-chromatic="' +
      (p.distortionChromatic ? "true" : "false") +
      '" data-distortion-overlay="' +
      (p.distortionOverlay !== false ? "true" : "false") +
      '" style="height:' +
      p.height +
      "px;" +
      bgStyle +
      "position:relative;overflow:hidden;border-radius:" +
      (p.borderRadius || 4) +
      "px;cursor:none;" +
      containerBorder +
      containerShadow +
      padStyle +
      margStyle +
      opStyle +
      '"><img src="' +
      (p.imageUrl || "https://picsum.photos/800/400?random=50") +
      '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;' +
      imgFilter +
      '" alt="" /><canvas class="veltro-distort-canvas" style="position:absolute;inset:0;width:100%;height:100%" data-distort-init="1"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Core Settings</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
      (p.imageUrl || "https://picsum.photos/800/400?random=50") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','imageUrl',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Distortion Radius</label><input type="number" value="' +
      (p.distortionRadius || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','distortionRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Distortion Strength</label><input type="number" step="0.05" min="0" max="1" value="' +
      (p.distortionStrength || 0.3) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','distortionStrength',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Background & Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      ((p.bgType || "solid") === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      ((p.bgType || "solid") === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      ((p.bgType || "solid") === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if ((p.bgType || "solid") === "solid") {
      html +=
        '<div class="rp-row"><label>Background Color</label><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        ((p.bgGradientDir || "135deg") === "135deg" ? " selected" : "") +
        '>135°</option><option value="to right"' +
        ((p.bgGradientDir || "135deg") === "to right" ? " selected" : "") +
        '>Left→Right</option><option value="to bottom"' +
        ((p.bgGradientDir || "135deg") === "to bottom" ? " selected" : "") +
        '>Top→Bottom</option><option value="circle"' +
        ((p.bgGradientDir || "135deg") === "circle" ? " selected" : "") +
        ">Radial</option></select></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a1a3e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImageUrl || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageUrl',this.value)\" placeholder=\"https://...\"></div>";
      html +=
        '<div class="rp-row"><label>Image Opacity (%)</label><input type="number" min="0" max="100" value="' +
        (p.bgImageOpacity || 30) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageOpacity',+this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Image Size</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageSize',this.value)\"><option value=\"cover\"" +
        ((p.bgImageSize || "cover") === "cover" ? " selected" : "") +
        '>Cover</option><option value="contain"' +
        ((p.bgImageSize || "cover") === "contain" ? " selected" : "") +
        '>Contain</option><option value="100% 100%"' +
        ((p.bgImageSize || "cover") === "100% 100%" ? " selected" : "") +
        ">Stretch</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius (px)</label><input type="number" value="' +
      (p.borderRadius || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width (px)</label><input type="number" value="' +
      (p.borderWidth || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Color</label><input type="color" value="' +
      (p.borderColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Box Shadow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','boxShadow',this.value)\"><option value=\"none\"" +
      ((p.boxShadow || "none") === "none" ? " selected" : "") +
      '>None</option><option value="soft"' +
      ((p.boxShadow || "none") === "soft" ? " selected" : "") +
      '>Soft</option><option value="hard"' +
      ((p.boxShadow || "none") === "hard" ? " selected" : "") +
      '>Hard</option><option value="glow"' +
      ((p.boxShadow || "none") === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    if (p.boxShadow && p.boxShadow !== "none") {
      html +=
        '<div class="rp-row"><label>Shadow Color</label><input type="color" value="' +
        (p.shadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur</label><input type="number" value="' +
        (p.shadowBlur || 10) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Spacing & Display</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Padding V (px)</label><input type="number" value="' +
      (p.paddingV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H (px)</label><input type="number" value="' +
      (p.paddingH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin V (px)</label><input type="number" value="' +
      (p.marginV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin H (px)</label><input type="number" value="' +
      (p.marginH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animations & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      ((p.entranceAnim || "none") === "none" ? " selected" : "") +
      '>None</option><option value="fade-in"' +
      ((p.entranceAnim || "none") === "fade-in" ? " selected" : "") +
      '>Fade In</option><option value="slide-up"' +
      ((p.entranceAnim || "none") === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="slide-left"' +
      ((p.entranceAnim || "none") === "slide-left" ? " selected" : "") +
      '>Slide Left</option><option value="zoom-in"' +
      ((p.entranceAnim || "none") === "zoom-in" ? " selected" : "") +
      '>Zoom In</option><option value="flip-in"' +
      ((p.entranceAnim || "none") === "flip-in" ? " selected" : "") +
      ">Flip In</option></select></div>";
    html +=
      '<div class="rp-row"><label>Animation Duration (ms)</label><input type="number" value="' +
      (p.animDuration || 600) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','animDuration',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      ((p.hoverEffect || "none") === "none" ? " selected" : "") +
      '>None</option><option value="lift"' +
      ((p.hoverEffect || "none") === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      ((p.hoverEffect || "none") === "glow" ? " selected" : "") +
      '>Glow</option><option value="scale"' +
      ((p.hoverEffect || "none") === "scale" ? " selected" : "") +
      '>Scale</option><option value="tilt"' +
      ((p.hoverEffect || "none") === "tilt" ? " selected" : "") +
      ">Tilt</option></select></div>";
    html +=
      '<div class="rp-row"><label>Hover Transition (ms)</label><input type="number" value="' +
      (p.hoverTransition || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverTransition',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Advanced Distortion Options</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Distortion Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','distortionType',this.value)\"><option value=\"lens\"" +
      ((p.distortionType || "lens") === "lens" ? " selected" : "") +
      '>Lens</option><option value="wave"' +
      ((p.distortionType || "lens") === "wave" ? " selected" : "") +
      '>Wave</option><option value="swirl"' +
      ((p.distortionType || "lens") === "swirl" ? " selected" : "") +
      '>Swirl</option><option value="pixelate"' +
      ((p.distortionType || "lens") === "pixelate" ? " selected" : "") +
      ">Pixelate</option></select></div>";
    html +=
      '<div class="rp-row"><label>Distortion Shape</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','distortionShape',this.value)\"><option value=\"circle\"" +
      ((p.distortionShape || "circle") === "circle" ? " selected" : "") +
      '>Circle</option><option value="square"' +
      ((p.distortionShape || "circle") === "square" ? " selected" : "") +
      '>Square</option><option value="diamond"' +
      ((p.distortionShape || "circle") === "diamond" ? " selected" : "") +
      ">Diamond</option></select></div>";
    html +=
      '<div class="rp-row"><label>Invert Distortion</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','distortionInvert',this.value)\"><option value=\"false\"" +
      (!p.distortionInvert ? " selected" : "") +
      '>Normal</option><option value="true"' +
      (p.distortionInvert ? " selected" : "") +
      ">Inverted</option></select></div>";
    html +=
      '<div class="rp-row"><label>Chromatic Aberration</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','distortionChromatic',this.value)\"><option value=\"false\"" +
      (!p.distortionChromatic ? " selected" : "") +
      '>Off</option><option value="true"' +
      (p.distortionChromatic ? " selected" : "") +
      ">On</option></select></div>";
    html +=
      '<div class="rp-row"><label>Distortion Overlay</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','distortionOverlay',this.value)\"><option value=\"true\"" +
      (p.distortionOverlay !== false ? " selected" : "") +
      '>Enabled</option><option value="false"' +
      (p.distortionOverlay === false ? " selected" : "") +
      ">Disabled</option></select></div>";
    if (p.distortionOverlay !== false) {
      html +=
        '<div class="rp-row"><label>Overlay Color</label><input type="color" value="' +
        (p.overlayColor || "#a78bfa") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','overlayColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Overlay Opacity (%)</label><input type="number" min="0" max="100" value="' +
        (p.overlayOpacity || 20) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','overlayOpacity',+this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Image Filter</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','imageFilter',this.value)\"><option value=\"none\"" +
      ((p.imageFilter || "none") === "none" ? " selected" : "") +
      '>None</option><option value="grayscale(100%)"' +
      ((p.imageFilter || "none") === "grayscale(100%)" ? " selected" : "") +
      '>Grayscale</option><option value="sepia(100%)"' +
      ((p.imageFilter || "none") === "sepia(100%)" ? " selected" : "") +
      '>Sepia</option><option value="blur(2px)"' +
      ((p.imageFilter || "none") === "blur(2px)" ? " selected" : "") +
      '>Blur</option><option value="contrast(150%)"' +
      ((p.imageFilter || "none") === "contrast(150%)" ? " selected" : "") +
      '>High Contrast</option><option value="brightness(120%)"' +
      ((p.imageFilter || "none") === "brightness(120%)" ? " selected" : "") +
      ">Bright</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

// 5. Color Sampler Cursor
FB.widgets.register("colorSampler", {
  label: "Color Sampler",
  sublabel: "Sample colors on hover",
  icon: "🎨",
  iconBg: "#1a1a0d",
  iconColor: "#f472b6",
  category: "veltro",
  subCategory: "cursor",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    sampleSize: 10,
    paletteSize: 5,
    showGrid: true,
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a1a3e",
    bgImageUrl: "",
    bgImageOpacity: 30,
    bgImageSize: "cover",
    borderRadius: 4,
    borderWidth: 0,
    borderColor: "#ffffff",
    boxShadow: "none",
    shadowColor: "#000000",
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    paddingV: 0,
    paddingH: 0,
    marginV: 0,
    marginH: 0,
    opacity: 100,
    entranceAnim: "none",
    hoverEffect: "none",
    hoverTransition: 300,
    animDuration: 600,
    gridCols: 4,
    gridRows: 3,
    swatchBorderRadius: 8,
    swatchGap: 4,
    palettePosition: "bottom",
    paletteBgOpacity: 80,
    samplerMode: "hover",
    copyOnHover: false,
    colorFormat: "hex",
    swatchAnimation: "pop",
  },
  render: function (p) {
    var id = p._blockId || "colorSamp";
    var paletteHtml = "";
    for (var i = 0; i < (p.paletteSize || 5); i++) {
      paletteHtml +=
        '<div class="veltro-color-swatch" style="width:30px;height:30px;border-radius:4px;background:#333;border:1px solid #555"></div>';
    }
    var bgType = p.bgType || "solid";
    var bgStyle = "";
    if (bgType === "gradient") {
      bgStyle =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a1a3e") +
        ");";
    } else if (bgType === "image" && p.bgImageUrl) {
      bgStyle =
        "background:url('" +
        p.bgImageUrl +
        "') center/" +
        (p.bgImageSize || "cover") +
        " no-repeat;background-color:" +
        (p.bg || "#0d0d1a") +
        ";";
    } else {
      bgStyle = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth && p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px solid " +
        (p.borderColor || "#ffffff") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow && p.boxShadow !== "none") {
      containerShadow =
        "box-shadow:" +
        (p.shadowOffsetX || 0) +
        "px " +
        (p.shadowOffsetY || 4) +
        "px " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowColor || "#000000") +
        ";";
    }
    var hoverClass = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
    }
    var animClass = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
    }
    var padStyle =
      "padding:" + (p.paddingV || 0) + "px " + (p.paddingH || 0) + "px;";
    var margStyle =
      "margin:" + (p.marginV || 0) + "px " + (p.marginH || 0) + "px;";
    var opStyle =
      p.opacity && p.opacity < 100 ? "opacity:" + p.opacity / 100 + ";" : "";
    var palettePos = p.palettePosition || "bottom";
    var paletteStyle =
      palettePos === "bottom"
        ? "bottom:10px;"
        : palettePos === "top"
          ? "top:10px;"
          : palettePos === "left"
            ? "left:10px;top:50%;transform:translateY(-50%);"
            : "right:10px;top:50%;transform:translateY(-50%);";
    return (
      '<div class="veltro-colorsampler-wrap' +
      animClass +
      hoverClass +
      '" id="colorsampler-' +
      id +
      '" data-sample-size="' +
      (p.sampleSize || 10) +
      '" data-palette-size="' +
      (p.paletteSize || 5) +
      '" data-sampler-mode="' +
      (p.samplerMode || "hover") +
      '" data-copy-on-hover="' +
      (p.copyOnHover ? "true" : "false") +
      '" data-color-format="' +
      (p.colorFormat || "hex") +
      '" data-swatch-animation="' +
      (p.swatchAnimation || "pop") +
      '" style="height:' +
      p.height +
      "px;" +
      bgStyle +
      "position:relative;overflow:hidden;border-radius:" +
      (p.borderRadius || 4) +
      "px;cursor:crosshair;" +
      containerBorder +
      containerShadow +
      padStyle +
      margStyle +
      opStyle +
      '"><div style="position:absolute;inset:0;display:grid;grid-template-columns:repeat(' +
      (p.gridCols || 4) +
      ",1fr);grid-template-rows:repeat(" +
      (p.gridRows || 3) +
      ",1fr);gap:" +
      (p.swatchGap || 4) +
      'px;padding:20px"><div style="background:#ff6b35;border-radius:' +
      (p.swatchBorderRadius || 8) +
      'px"></div><div style="background:#cdfe00;border-radius:' +
      (p.swatchBorderRadius || 8) +
      'px"></div><div style="background:#3b82f6;border-radius:' +
      (p.swatchBorderRadius || 8) +
      'px"></div><div style="background:#ec4899;border-radius:' +
      (p.swatchBorderRadius || 8) +
      'px"></div><div style="background:#f59e0b;border-radius:' +
      (p.swatchBorderRadius || 8) +
      'px"></div><div style="background:#10b981;border-radius:' +
      (p.swatchBorderRadius || 8) +
      'px"></div><div style="background:#8b5cf6;border-radius:' +
      (p.swatchBorderRadius || 8) +
      'px"></div><div style="background:#ef4444;border-radius:' +
      (p.swatchBorderRadius || 8) +
      'px"></div><div style="background:#06b6d4;border-radius:' +
      (p.swatchBorderRadius || 8) +
      'px"></div><div style="background:#f97316;border-radius:' +
      (p.swatchBorderRadius || 8) +
      'px"></div><div style="background:#84cc16;border-radius:' +
      (p.swatchBorderRadius || 8) +
      'px"></div><div style="background:#6366f1;border-radius:' +
      (p.swatchBorderRadius || 8) +
      'px"></div></div><div class="veltro-color-palette" style="position:absolute;' +
      paletteStyle +
      "left:" +
      (palettePos === "left" || palettePos === "right" ? "auto" : "50%") +
      ";right:" +
      (palettePos === "right" ? "10px" : "auto") +
      ";transform:" +
      (palettePos === "bottom" || palettePos === "top"
        ? "translateX(-50%)"
        : "translateY(-50%)") +
      ";display:flex;gap:4px;padding:8px;background:rgba(0,0,0," +
      (p.paletteBgOpacity || 80) / 100 +
      ');border-radius:8px;z-index:10" data-colorsampler-init="1">' +
      paletteHtml +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Core Settings</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Sample Size</label><input type="number" value="' +
      (p.sampleSize || 10) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','sampleSize',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Palette Size</label><input type="number" value="' +
      (p.paletteSize || 5) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paletteSize',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Show Grid</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','showGrid',this.value)\"><option value=\"true\"" +
      (p.showGrid !== false ? " selected" : "") +
      '>Enabled</option><option value="false"' +
      (p.showGrid === false ? " selected" : "") +
      ">Disabled</option></select></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Background & Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      ((p.bgType || "solid") === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      ((p.bgType || "solid") === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      ((p.bgType || "solid") === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if ((p.bgType || "solid") === "solid") {
      html +=
        '<div class="rp-row"><label>Background Color</label><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        ((p.bgGradientDir || "135deg") === "135deg" ? " selected" : "") +
        '>135°</option><option value="to right"' +
        ((p.bgGradientDir || "135deg") === "to right" ? " selected" : "") +
        '>Left→Right</option><option value="to bottom"' +
        ((p.bgGradientDir || "135deg") === "to bottom" ? " selected" : "") +
        '>Top→Bottom</option><option value="circle"' +
        ((p.bgGradientDir || "135deg") === "circle" ? " selected" : "") +
        ">Radial</option></select></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a1a3e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImageUrl || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageUrl',this.value)\" placeholder=\"https://...\"></div>";
      html +=
        '<div class="rp-row"><label>Image Opacity (%)</label><input type="number" min="0" max="100" value="' +
        (p.bgImageOpacity || 30) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageOpacity',+this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Image Size</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageSize',this.value)\"><option value=\"cover\"" +
        ((p.bgImageSize || "cover") === "cover" ? " selected" : "") +
        '>Cover</option><option value="contain"' +
        ((p.bgImageSize || "cover") === "contain" ? " selected" : "") +
        '>Contain</option><option value="100% 100%"' +
        ((p.bgImageSize || "cover") === "100% 100%" ? " selected" : "") +
        ">Stretch</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius (px)</label><input type="number" value="' +
      (p.borderRadius || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width (px)</label><input type="number" value="' +
      (p.borderWidth || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Color</label><input type="color" value="' +
      (p.borderColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Box Shadow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','boxShadow',this.value)\"><option value=\"none\"" +
      ((p.boxShadow || "none") === "none" ? " selected" : "") +
      '>None</option><option value="soft"' +
      ((p.boxShadow || "none") === "soft" ? " selected" : "") +
      '>Soft</option><option value="hard"' +
      ((p.boxShadow || "none") === "hard" ? " selected" : "") +
      '>Hard</option><option value="glow"' +
      ((p.boxShadow || "none") === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    if (p.boxShadow && p.boxShadow !== "none") {
      html +=
        '<div class="rp-row"><label>Shadow Color</label><input type="color" value="' +
        (p.shadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur</label><input type="number" value="' +
        (p.shadowBlur || 10) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Spacing & Display</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Padding V (px)</label><input type="number" value="' +
      (p.paddingV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H (px)</label><input type="number" value="' +
      (p.paddingH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin V (px)</label><input type="number" value="' +
      (p.marginV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin H (px)</label><input type="number" value="' +
      (p.marginH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animations & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      ((p.entranceAnim || "none") === "none" ? " selected" : "") +
      '>None</option><option value="fade-in"' +
      ((p.entranceAnim || "none") === "fade-in" ? " selected" : "") +
      '>Fade In</option><option value="slide-up"' +
      ((p.entranceAnim || "none") === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="slide-left"' +
      ((p.entranceAnim || "none") === "slide-left" ? " selected" : "") +
      '>Slide Left</option><option value="zoom-in"' +
      ((p.entranceAnim || "none") === "zoom-in" ? " selected" : "") +
      '>Zoom In</option><option value="flip-in"' +
      ((p.entranceAnim || "none") === "flip-in" ? " selected" : "") +
      ">Flip In</option></select></div>";
    html +=
      '<div class="rp-row"><label>Animation Duration (ms)</label><input type="number" value="' +
      (p.animDuration || 600) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','animDuration',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      ((p.hoverEffect || "none") === "none" ? " selected" : "") +
      '>None</option><option value="lift"' +
      ((p.hoverEffect || "none") === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      ((p.hoverEffect || "none") === "glow" ? " selected" : "") +
      '>Glow</option><option value="scale"' +
      ((p.hoverEffect || "none") === "scale" ? " selected" : "") +
      '>Scale</option><option value="tilt"' +
      ((p.hoverEffect || "none") === "tilt" ? " selected" : "") +
      ">Tilt</option></select></div>";
    html +=
      '<div class="rp-row"><label>Hover Transition (ms)</label><input type="number" value="' +
      (p.hoverTransition || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverTransition',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Advanced Sampler Options</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Grid Columns</label><input type="number" value="' +
      (p.gridCols || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','gridCols',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Grid Rows</label><input type="number" value="' +
      (p.gridRows || 3) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','gridRows',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Swatch Border Radius</label><input type="number" value="' +
      (p.swatchBorderRadius || 8) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','swatchBorderRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Swatch Gap (px)</label><input type="number" value="' +
      (p.swatchGap || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','swatchGap',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Palette Position</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','palettePosition',this.value)\"><option value=\"bottom\"" +
      ((p.palettePosition || "bottom") === "bottom" ? " selected" : "") +
      '>Bottom</option><option value="top"' +
      ((p.palettePosition || "bottom") === "top" ? " selected" : "") +
      '>Top</option><option value="left"' +
      ((p.palettePosition || "bottom") === "left" ? " selected" : "") +
      '>Left</option><option value="right"' +
      ((p.palettePosition || "bottom") === "right" ? " selected" : "") +
      ">Right</option></select></div>";
    html +=
      '<div class="rp-row"><label>Palette BG Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.paletteBgOpacity || 80) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paletteBgOpacity',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Sampler Mode</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','samplerMode',this.value)\"><option value=\"hover\"" +
      ((p.samplerMode || "hover") === "hover" ? " selected" : "") +
      '>Hover</option><option value="click"' +
      ((p.samplerMode || "hover") === "click" ? " selected" : "") +
      '>Click</option><option value="drag"' +
      ((p.samplerMode || "hover") === "drag" ? " selected" : "") +
      ">Drag</option></select></div>";
    html +=
      '<div class="rp-row"><label>Copy On Hover</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','copyOnHover',this.value)\"><option value=\"false\"" +
      (!p.copyOnHover ? " selected" : "") +
      '>Off</option><option value="true"' +
      (p.copyOnHover ? " selected" : "") +
      ">On</option></select></div>";
    html +=
      '<div class="rp-row"><label>Color Format</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','colorFormat',this.value)\"><option value=\"hex\"" +
      ((p.colorFormat || "hex") === "hex" ? " selected" : "") +
      '>HEX</option><option value="rgb"' +
      ((p.colorFormat || "hex") === "rgb" ? " selected" : "") +
      '>RGB</option><option value="hsl"' +
      ((p.colorFormat || "hex") === "hsl" ? " selected" : "") +
      ">HSL</option></select></div>";
    html +=
      '<div class="rp-row"><label>Swatch Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','swatchAnimation',this.value)\"><option value=\"pop\"" +
      ((p.swatchAnimation || "pop") === "pop" ? " selected" : "") +
      '>Pop</option><option value="fade"' +
      ((p.swatchAnimation || "pop") === "fade" ? " selected" : "") +
      '>Fade</option><option value="slide"' +
      ((p.swatchAnimation || "pop") === "slide" ? " selected" : "") +
      '>Slide</option><option value="none"' +
      ((p.swatchAnimation || "pop") === "none" ? " selected" : "") +
      ">None</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

// 6. Gravity Cursor
FB.widgets.register("gravityCursor", {
  label: "Gravity Cursor",
  sublabel: "Cursor as gravity well",
  icon: "◉",
  iconBg: "#0d1a0d",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "cursor",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    gravityStrength: 0.5,
    particleCount: 50,
    particleSize: 4,
    particleColor: "#cdfe00",
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a1a3e",
    bgImageUrl: "",
    bgImageOpacity: 30,
    bgImageSize: "cover",
    borderRadius: 4,
    borderWidth: 0,
    borderColor: "#ffffff",
    boxShadow: "none",
    shadowColor: "#000000",
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    paddingV: 0,
    paddingH: 0,
    marginV: 0,
    marginH: 0,
    opacity: 100,
    entranceAnim: "none",
    hoverEffect: "none",
    hoverTransition: 300,
    animDuration: 600,
    particleShape: "circle",
    particleTrail: true,
    particleFriction: 0.98,
    particleBounce: false,
    gravityMode: "attract",
    particleSpread: 1,
    particleRandomColor: false,
    particleGlow: false,
  },
  render: function (p) {
    var id = p._blockId || "gravCursor";
    var bgType = p.bgType || "solid";
    var bgStyle = "";
    if (bgType === "gradient") {
      bgStyle =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a1a3e") +
        ");";
    } else if (bgType === "image" && p.bgImageUrl) {
      bgStyle =
        "background:url('" +
        p.bgImageUrl +
        "') center/" +
        (p.bgImageSize || "cover") +
        " no-repeat;background-color:" +
        (p.bg || "#0d0d1a") +
        ";";
    } else {
      bgStyle = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth && p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px solid " +
        (p.borderColor || "#ffffff") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow && p.boxShadow !== "none") {
      containerShadow =
        "box-shadow:" +
        (p.shadowOffsetX || 0) +
        "px " +
        (p.shadowOffsetY || 4) +
        "px " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowColor || "#000000") +
        ";";
    }
    var hoverClass = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
    }
    var animClass = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
    }
    var padStyle =
      "padding:" + (p.paddingV || 0) + "px " + (p.paddingH || 0) + "px;";
    var margStyle =
      "margin:" + (p.marginV || 0) + "px " + (p.marginH || 0) + "px;";
    var opStyle =
      p.opacity && p.opacity < 100 ? "opacity:" + p.opacity / 100 + ";" : "";
    return (
      '<div class="veltro-gravity-wrap' +
      animClass +
      hoverClass +
      '" id="gravity-' +
      id +
      '" data-gravity-strength="' +
      (p.gravityStrength || 0.5) +
      '" data-particle-count="' +
      (p.particleCount || 50) +
      '" data-particle-size="' +
      (p.particleSize || 4) +
      '" data-particle-color="' +
      (p.particleColor || "#cdfe00") +
      '" data-particle-shape="' +
      (p.particleShape || "circle") +
      '" data-particle-trail="' +
      (p.particleTrail !== false ? "true" : "false") +
      '" data-particle-friction="' +
      (p.particleFriction || 0.98) +
      '" data-particle-bounce="' +
      (p.particleBounce ? "true" : "false") +
      '" data-gravity-mode="' +
      (p.gravityMode || "attract") +
      '" data-particle-spread="' +
      (p.particleSpread || 1) +
      '" data-particle-random-color="' +
      (p.particleRandomColor ? "true" : "false") +
      '" data-particle-glow="' +
      (p.particleGlow ? "true" : "false") +
      '" style="height:' +
      p.height +
      "px;" +
      bgStyle +
      "position:relative;overflow:hidden;border-radius:" +
      (p.borderRadius || 4) +
      "px;cursor:none;" +
      containerBorder +
      containerShadow +
      padStyle +
      margStyle +
      opStyle +
      '"><canvas class="veltro-gravity-canvas" style="position:absolute;inset:0;width:100%;height:100%" data-gravity-init="1"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Core Settings</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Gravity Strength</label><input type="number" step="0.1" min="0" max="2" value="' +
      (p.gravityStrength || 0.5) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','gravityStrength',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Count</label><input type="number" value="' +
      (p.particleCount || 50) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleCount',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Size</label><input type="number" value="' +
      (p.particleSize || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleSize',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Color</label><input type="color" value="' +
      (p.particleColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleColor',this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Background & Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      ((p.bgType || "solid") === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      ((p.bgType || "solid") === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      ((p.bgType || "solid") === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if ((p.bgType || "solid") === "solid") {
      html +=
        '<div class="rp-row"><label>Background Color</label><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        ((p.bgGradientDir || "135deg") === "135deg" ? " selected" : "") +
        '>135°</option><option value="to right"' +
        ((p.bgGradientDir || "135deg") === "to right" ? " selected" : "") +
        '>Left→Right</option><option value="to bottom"' +
        ((p.bgGradientDir || "135deg") === "to bottom" ? " selected" : "") +
        '>Top→Bottom</option><option value="circle"' +
        ((p.bgGradientDir || "135deg") === "circle" ? " selected" : "") +
        ">Radial</option></select></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a1a3e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImageUrl || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageUrl',this.value)\" placeholder=\"https://...\"></div>";
      html +=
        '<div class="rp-row"><label>Image Opacity (%)</label><input type="number" min="0" max="100" value="' +
        (p.bgImageOpacity || 30) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageOpacity',+this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Image Size</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageSize',this.value)\"><option value=\"cover\"" +
        ((p.bgImageSize || "cover") === "cover" ? " selected" : "") +
        '>Cover</option><option value="contain"' +
        ((p.bgImageSize || "cover") === "contain" ? " selected" : "") +
        '>Contain</option><option value="100% 100%"' +
        ((p.bgImageSize || "cover") === "100% 100%" ? " selected" : "") +
        ">Stretch</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius (px)</label><input type="number" value="' +
      (p.borderRadius || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width (px)</label><input type="number" value="' +
      (p.borderWidth || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Color</label><input type="color" value="' +
      (p.borderColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Box Shadow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','boxShadow',this.value)\"><option value=\"none\"" +
      ((p.boxShadow || "none") === "none" ? " selected" : "") +
      '>None</option><option value="soft"' +
      ((p.boxShadow || "none") === "soft" ? " selected" : "") +
      '>Soft</option><option value="hard"' +
      ((p.boxShadow || "none") === "hard" ? " selected" : "") +
      '>Hard</option><option value="glow"' +
      ((p.boxShadow || "none") === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    if (p.boxShadow && p.boxShadow !== "none") {
      html +=
        '<div class="rp-row"><label>Shadow Color</label><input type="color" value="' +
        (p.shadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur</label><input type="number" value="' +
        (p.shadowBlur || 10) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Spacing & Display</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Padding V (px)</label><input type="number" value="' +
      (p.paddingV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H (px)</label><input type="number" value="' +
      (p.paddingH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin V (px)</label><input type="number" value="' +
      (p.marginV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin H (px)</label><input type="number" value="' +
      (p.marginH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animations & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      ((p.entranceAnim || "none") === "none" ? " selected" : "") +
      '>None</option><option value="fade-in"' +
      ((p.entranceAnim || "none") === "fade-in" ? " selected" : "") +
      '>Fade In</option><option value="slide-up"' +
      ((p.entranceAnim || "none") === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="slide-left"' +
      ((p.entranceAnim || "none") === "slide-left" ? " selected" : "") +
      '>Slide Left</option><option value="zoom-in"' +
      ((p.entranceAnim || "none") === "zoom-in" ? " selected" : "") +
      '>Zoom In</option><option value="flip-in"' +
      ((p.entranceAnim || "none") === "flip-in" ? " selected" : "") +
      ">Flip In</option></select></div>";
    html +=
      '<div class="rp-row"><label>Animation Duration (ms)</label><input type="number" value="' +
      (p.animDuration || 600) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','animDuration',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      ((p.hoverEffect || "none") === "none" ? " selected" : "") +
      '>None</option><option value="lift"' +
      ((p.hoverEffect || "none") === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      ((p.hoverEffect || "none") === "glow" ? " selected" : "") +
      '>Glow</option><option value="scale"' +
      ((p.hoverEffect || "none") === "scale" ? " selected" : "") +
      '>Scale</option><option value="tilt"' +
      ((p.hoverEffect || "none") === "tilt" ? " selected" : "") +
      ">Tilt</option></select></div>";
    html +=
      '<div class="rp-row"><label>Hover Transition (ms)</label><input type="number" value="' +
      (p.hoverTransition || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverTransition',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Advanced Gravity Options</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Particle Shape</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleShape',this.value)\"><option value=\"circle\"" +
      ((p.particleShape || "circle") === "circle" ? " selected" : "") +
      '>Circle</option><option value="square"' +
      ((p.particleShape || "circle") === "square" ? " selected" : "") +
      '>Square</option><option value="triangle"' +
      ((p.particleShape || "circle") === "triangle" ? " selected" : "") +
      '>Triangle</option><option value="star"' +
      ((p.particleShape || "circle") === "star" ? " selected" : "") +
      ">Star</option></select></div>";
    html +=
      '<div class="rp-row"><label>Particle Trail</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleTrail',this.value)\"><option value=\"true\"" +
      (p.particleTrail !== false ? " selected" : "") +
      '>Enabled</option><option value="false"' +
      (p.particleTrail === false ? " selected" : "") +
      ">Disabled</option></select></div>";
    html +=
      '<div class="rp-row"><label>Particle Friction</label><input type="number" step="0.01" min="0.9" max="1" value="' +
      (p.particleFriction || 0.98) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleFriction',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Bounce</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleBounce',this.value)\"><option value=\"false\"" +
      (!p.particleBounce ? " selected" : "") +
      '>Off</option><option value="true"' +
      (p.particleBounce ? " selected" : "") +
      ">On</option></select></div>";
    html +=
      '<div class="rp-row"><label>Gravity Mode</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','gravityMode',this.value)\"><option value=\"attract\"" +
      ((p.gravityMode || "attract") === "attract" ? " selected" : "") +
      '>Attract</option><option value="repel"' +
      ((p.gravityMode || "attract") === "repel" ? " selected" : "") +
      '>Repel</option><option value="orbit"' +
      ((p.gravityMode || "attract") === "orbit" ? " selected" : "") +
      ">Orbit</option></select></div>";
    html +=
      '<div class="rp-row"><label>Particle Spread</label><input type="number" step="0.1" min="0.1" max="3" value="' +
      (p.particleSpread || 1) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleSpread',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Random Particle Colors</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleRandomColor',this.value)\"><option value=\"false\"" +
      (!p.particleRandomColor ? " selected" : "") +
      '>Single</option><option value="true"' +
      (p.particleRandomColor ? " selected" : "") +
      ">Random</option></select></div>";
    html +=
      '<div class="rp-row"><label>Particle Glow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleGlow',this.value)\"><option value=\"false\"" +
      (!p.particleGlow ? " selected" : "") +
      '>Off</option><option value="true"' +
      (p.particleGlow ? " selected" : "") +
      ">On</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

// 6. Gravity Cursor
FB.widgets.register("gravityCursor", {
  label: "Gravity Cursor",
  sublabel: "Cursor as gravity well",
  icon: "◉",
  iconBg: "#0d1a0d",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "cursor",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    gravityStrength: 0.5,
    particleCount: 50,
    particleSize: 4,
    particleColor: "#cdfe00",
  },
  render: function (p) {
    var id = p._blockId || "gravCursor";
    return (
      '<div class="veltro-gravity-wrap" id="gravity-' +
      id +
      '" data-gravity-strength="' +
      p.gravityStrength +
      '" data-particle-count="' +
      p.particleCount +
      '" data-particle-size="' +
      p.particleSize +
      '" data-particle-color="' +
      p.particleColor +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;cursor:none"><canvas class="veltro-gravity-canvas" style="position:absolute;inset:0;width:100%;height:100%" data-gravity-init="1"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Gravity Strength</label><input type="range" min="0.1" max="2" step="0.1" value="' +
      (p.gravityStrength || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','gravityStrength',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Particle Count</label><input type="range" min="10" max="200" step="10" value="' +
      (p.particleCount || 50) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Particle Colour</label><input type="color" value="' +
      (p.particleColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleColor',this.value)\"></div>";
    return h;
  },
});

// ── VELTRO ENGINE BATCH 2: TYPOGRAPHY (4 NEW WIDGETS) ──
// 1. Wave Text
FB.widgets.register("waveText", {
  label: "Wave Text",
  sublabel: "Sine wave animation",
  icon: "~",
  iconBg: "#0d1a2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "typography",
  defaultProps: {
    height: 300,
    bg: "#0d0d1a",
    text: "WAVE",
    fontSize: 80,
    fontWeight: 800,
    textColor: "#cdfe00",
    amplitude: 20,
    frequency: 0.1,
    speed: 0.05,
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a0d2e",
    bgImage: "",
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "#60a5fa",
    borderStyle: "solid",
    paddingV: 24,
    paddingH: 24,
    marginV: 0,
    marginH: 0,
    boxShadow: false,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowBlur: 10,
    shadowSpread: 0,
    opacity: 100,
    entranceAnim: "none",
    animDuration: 600,
    animDelay: 0,
    hoverEffect: "none",
    hoverScale: 1.02,
    hoverTransition: 300,
    waveDirection: "up",
    phaseOffset: 0,
    dualColour: false,
    dualColour2: "#3b82f6",
    fontFamily: "Lexend",
    letterSpacing: 0,
    textTransform: "none",
    glowEffect: false,
    glowColor: "#cdfe00",
    glowSize: 15,
    textShadow: false,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowBlur: 4,
    textAlign: "center",
  },
  render: function (p) {
    var id = p._blockId || "wave";
    var chars = (p.text || "WAVE").split("");
    var charHtml = chars
      .map(function (c, i) {
        var col = "";
        if (p.dualColour) {
          var colors = [p.textColor || "#cdfe00", p.dualColour2 || "#3b82f6"];
          col = "color:" + colors[i % 2] + ";";
        }
        return (
          '<span class="veltro-wave-char" data-index="' +
          i +
          '" style="display:inline-block;transition:none;' +
          col +
          '">' +
          c +
          "</span>"
        );
      })
      .join("");
    var containerBg = "";
    if (p.bgType === "gradient") {
      containerBg =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a0d2e") +
        ");";
    } else if (p.bgType === "image" && p.bgImage) {
      containerBg = "background:url(" + p.bgImage + ") center/cover;";
    } else {
      containerBg = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px " +
        (p.borderStyle || "solid") +
        " " +
        (p.borderColor || "#60a5fa") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow) {
      containerShadow =
        "box-shadow:0 " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowBlur || 10) * 2 +
        "px " +
        (p.shadowSpread || 0) +
        "px " +
        (p.shadowColor || "rgba(0,0,0,0.3)") +
        ";";
    }
    var hoverClass = "";
    var hoverStyle = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
      hoverStyle = "transition:all " + (p.hoverTransition || 300) + "ms ease;";
    }
    var animClass = "";
    var animStyle = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
      animStyle =
        "animation-duration:" +
        (p.animDuration || 600) +
        "ms;animation-delay:" +
        (p.animDelay || 0) +
        "ms;animation-fill-mode:both;";
    }
    var glowStyle = "";
    if (p.glowEffect) {
      glowStyle =
        "filter:drop-shadow(0 0 " +
        (p.glowSize || 15) +
        "px " +
        (p.glowColor || "#cdfe00") +
        ");";
    }
    var textShadowStyle = "";
    if (p.textShadow) {
      textShadowStyle =
        "text-shadow:" +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowBlur || 4) * 2 +
        "px " +
        (p.textShadowColor || "rgba(0,0,0,0.5)") +
        ";";
    }
    var textTransformStyle = "";
    if (p.textTransform && p.textTransform !== "none") {
      textTransformStyle = "text-transform:" + p.textTransform + ";";
    }
    return (
      '<div class="veltro-wave-wrap' +
      animClass +
      hoverClass +
      '" id="wave-' +
      id +
      '" data-amplitude="' +
      (p.amplitude || 20) +
      '" data-frequency="' +
      (p.frequency || 0.1) +
      '" data-speed="' +
      (p.speed || 0.05) +
      '" data-wave-direction="' +
      (p.waveDirection || "up") +
      '" data-phase-offset="' +
      (p.phaseOffset || 0) +
      '" data-dual-colour="' +
      (p.dualColour ? "1" : "0") +
      '" style="height:' +
      (p.height || 300) +
      "px;" +
      containerBg +
      containerBorder +
      containerShadow +
      hoverStyle +
      animStyle +
      "border-radius:" +
      (p.borderRadius || 8) +
      "px;" +
      "padding:" +
      (p.paddingV || 24) +
      "px " +
      (p.paddingH || 24) +
      "px;" +
      "margin:" +
      (p.marginV || 0) +
      "px " +
      (p.marginH || 0) +
      "px;" +
      "opacity:" +
      (p.opacity || 100) / 100 +
      ";" +
      'display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;"><div class="veltro-wave-content" style="font-size:' +
      (p.fontSize || 80) +
      "px;font-weight:" +
      (p.fontWeight || 800) +
      ";color:" +
      (p.textColor || "#cdfe00") +
      ";font-family:'" +
      (p.fontFamily || "Lexend") +
      "',sans-serif;user-select:none;letter-spacing:" +
      (p.letterSpacing || 0) +
      "px;text-align:" +
      (p.textAlign || "center") +
      ";" +
      glowStyle +
      textShadowStyle +
      textTransformStyle +
      '" data-wave-init="1">' +
      charHtml +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Text & Wave</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text</label><input type="text" value="' +
      (p.text || "WAVE") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','text',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Height: ' +
      (p.height || 300) +
      'px</label><input type="range" min="100" max="600" value="' +
      (p.height || 300) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value);this.previousElementSibling.textContent='Height: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Size: ' +
      (p.fontSize || 80) +
      'px</label><input type="range" min="24" max="150" value="' +
      (p.fontSize || 80) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontSize',+this.value);this.previousElementSibling.textContent='Font Size: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Weight: ' +
      (p.fontWeight || 800) +
      '</label><input type="range" min="100" max="900" step="100" value="' +
      (p.fontWeight || 800) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontWeight',+this.value);this.previousElementSibling.textContent='Font Weight: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Family</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontFamily',this.value)\"><option value=\"Lexend\"" +
      (p.fontFamily === "Lexend" ? " selected" : "") +
      '>Lexend</option><option value="Inter"' +
      (p.fontFamily === "Inter" ? " selected" : "") +
      ">Inter</option></select></div>";
    html +=
      '<div class="rp-row"><label>Letter Spacing: ' +
      (p.letterSpacing || 0) +
      'px</label><input type="range" min="-5" max="20" value="' +
      (p.letterSpacing || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','letterSpacing',+this.value);this.previousElementSibling.textContent='Letter Spacing: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Text Align</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textAlign',this.value)\"><option value=\"left\"" +
      (p.textAlign === "left" ? " selected" : "") +
      '>Left</option><option value="center"' +
      (p.textAlign === "center" ? " selected" : "") +
      '>Center</option><option value="right"' +
      (p.textAlign === "right" ? " selected" : "") +
      ">Right</option></select></div>";
    html +=
      '<div class="rp-row"><label>Text Transform</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textTransform',this.value)\"><option value=\"none\"" +
      (p.textTransform === "none" ? " selected" : "") +
      '>None</option><option value="uppercase"' +
      (p.textTransform === "uppercase" ? " selected" : "") +
      ">UPPERCASE</option></select></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Wave Settings</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Amplitude: ' +
      (p.amplitude || 20) +
      '</label><input type="range" min="0" max="50" value="' +
      (p.amplitude || 20) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','amplitude',+this.value);this.previousElementSibling.textContent='Amplitude: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Frequency: ' +
      (p.frequency || 0.1) +
      '</label><input type="range" min="0.01" max="0.5" step="0.01" value="' +
      (p.frequency || 0.1) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','frequency',+this.value);this.previousElementSibling.textContent='Frequency: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Speed: ' +
      (p.speed || 0.05) +
      '</label><input type="range" min="0.01" max="0.2" step="0.01" value="' +
      (p.speed || 0.05) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','speed',+this.value);this.previousElementSibling.textContent='Speed: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Wave Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','waveDirection',this.value)\"><option value=\"up\"" +
      (p.waveDirection === "up" ? " selected" : "") +
      '>Up</option><option value="down"' +
      (p.waveDirection === "down" ? " selected" : "") +
      '>Down</option><option value="left"' +
      (p.waveDirection === "left" ? " selected" : "") +
      '>Left</option><option value="right"' +
      (p.waveDirection === "right" ? " selected" : "") +
      ">Right</option></select></div>";
    html +=
      '<div class="rp-row"><label>Phase Offset: ' +
      (p.phaseOffset || 0) +
      '</label><input type="range" min="0" max="6.28" step="0.1" value="' +
      (p.phaseOffset || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','phaseOffset',+this.value);this.previousElementSibling.textContent='Phase Offset: '+this.value'\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Colour & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text Colour</label><div class="rp-colour-row"><input type="color" value="' +
      (p.textColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      '\',\'textColor\',this.value)"><input type="text" value="' +
      (p.textColor || "#cdfe00") +
      '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textColor',this.value)\"></div></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.dualColour ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','dualColour',this.checked)\"> Dual Colour</label></div>";
    if (p.dualColour) {
      html +=
        '<div class="rp-row"><label>Colour 2</label><input type="color" value="' +
        (p.dualColour2 || "#3b82f6") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','dualColour2',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.glowEffect ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','glowEffect',this.checked)\"> Glow Effect</label></div>";
    if (p.glowEffect) {
      html +=
        '<div class="rp-row"><label>Glow Colour</label><input type="color" value="' +
        (p.glowColor || "#cdfe00") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Glow Size: ' +
        (p.glowSize || 15) +
        'px</label><input type="range" min="5" max="50" value="' +
        (p.glowSize || 15) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowSize',+this.value);this.previousElementSibling.textContent='Glow Size: '+this.value+'px'\"></div>";
    }
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.textShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','textShadow',this.checked)\"> Text Shadow</label></div>";
    if (p.textShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Colour</label><input type="color" value="' +
        (p.textShadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.textShadowBlur || 4) +
        '</label><input type="range" min="0" max="20" value="' +
        (p.textShadowBlur || 4) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      (p.bgType === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      (p.bgType === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      (p.bgType === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if (p.bgType === "solid") {
      html +=
        '<div class="rp-row"><label>Background Colour</label><div class="rp-colour-row"><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        '\',\'bg\',this.value)"><input type="text" value="' +
        (p.bg || "#0d0d1a") +
        '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div></div>";
    } else if (p.bgType === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Colour 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Colour 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a0d2e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        (p.bgGradientDir === "135deg" ? " selected" : "") +
        '>135°</option><option value="90deg"' +
        (p.bgGradientDir === "90deg" ? " selected" : "") +
        ">90°</option></select></div>";
    } else if (p.bgType === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImage || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImage',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius: ' +
      (p.borderRadius || 8) +
      'px</label><input type="range" min="0" max="50" value="' +
      (p.borderRadius || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value);this.previousElementSibling.textContent='Border Radius: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width: ' +
      (p.borderWidth || 0) +
      'px</label><input type="range" min="0" max="8" value="' +
      (p.borderWidth || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value);this.previousElementSibling.textContent='Border Width: '+this.value+'px'\"></div>";
    if (p.borderWidth > 0) {
      html +=
        '<div class="rp-row"><label>Border Colour</label><input type="color" value="' +
        (p.borderColor || "#60a5fa") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Border Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderStyle',this.value)\"><option value=\"solid\"" +
        (p.borderStyle === "solid" ? " selected" : "") +
        '>Solid</option><option value="dashed"' +
        (p.borderStyle === "dashed" ? " selected" : "") +
        ">Dashed</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Padding V: ' +
      (p.paddingV || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingV || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value);this.previousElementSibling.textContent='Padding V: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H: ' +
      (p.paddingH || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingH || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value);this.previousElementSibling.textContent='Padding H: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity: ' +
      (p.opacity || 100) +
      '%</label><input type="range" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value);this.previousElementSibling.textContent='Opacity: '+this.value+'%'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.boxShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','boxShadow',this.checked)\"> Box Shadow</label></div>";
    if (p.boxShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.shadowBlur || 10) +
        '</label><input type="range" min="0" max="40" value="' +
        (p.shadowBlur || 10) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animation</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      (p.entranceAnim === "none" ? " selected" : "") +
      '>None</option><option value="fade"' +
      (p.entranceAnim === "fade" ? " selected" : "") +
      '>Fade</option><option value="slide-up"' +
      (p.entranceAnim === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="zoom"' +
      (p.entranceAnim === "zoom" ? " selected" : "") +
      ">Zoom</option></select></div>";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      html +=
        '<div class="rp-row"><label>Duration: ' +
        (p.animDuration || 600) +
        'ms</label><input type="range" min="200" max="2000" step="100" value="' +
        (p.animDuration || 600) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','animDuration',+this.value);this.previousElementSibling.textContent='Duration: '+this.value+'ms'\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      (p.hoverEffect === "none" ? " selected" : "") +
      '>None</option><option value="scale"' +
      (p.hoverEffect === "scale" ? " selected" : "") +
      '>Scale</option><option value="lift"' +
      (p.hoverEffect === "lift" ? " selected" : "") +
      ">Lift</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

// 2. 3D Rotating Text
FB.widgets.register("rotatingText3d", {
  label: "3D Rotating Text",
  sublabel: "Perspective rotation",
  icon: "◈",
  iconBg: "#1a0d2e",
  iconColor: "#a78bfa",
  category: "veltro",
  subCategory: "typography",
  defaultProps: {
    height: 300,
    bg: "#0d0d1a",
    text: "ROTATE",
    fontSize: 72,
    fontWeight: 800,
    textColor: "#cdfe00",
    rotationSpeed: 0.02,
    perspective: 800,
    rotateX: true,
    rotateY: true,
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a0d2e",
    bgImage: "",
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "#a78bfa",
    borderStyle: "solid",
    paddingV: 24,
    paddingH: 24,
    marginV: 0,
    marginH: 0,
    boxShadow: false,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowBlur: 10,
    shadowSpread: 0,
    opacity: 100,
    entranceAnim: "none",
    animDuration: 600,
    animDelay: 0,
    hoverEffect: "none",
    hoverScale: 1.02,
    hoverTransition: 300,
    autoRotate: true,
    mouseDriven: false,
    depth: 200,
    fontFamily: "Lexend",
    letterSpacing: 0,
    textTransform: "none",
    glowEffect: false,
    glowColor: "#a78bfa",
    glowSize: 15,
    textShadow: false,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowBlur: 4,
    textAlign: "center",
    dualColour: false,
    dualColour2: "#3b82f6",
  },
  render: function (p) {
    var id = p._blockId || "rot3d";
    var containerBg = "";
    if (p.bgType === "gradient") {
      containerBg =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a0d2e") +
        ");";
    } else if (p.bgType === "image" && p.bgImage) {
      containerBg = "background:url(" + p.bgImage + ") center/cover;";
    } else {
      containerBg = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px " +
        (p.borderStyle || "solid") +
        " " +
        (p.borderColor || "#a78bfa") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow) {
      containerShadow =
        "box-shadow:0 " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowBlur || 10) * 2 +
        "px " +
        (p.shadowSpread || 0) +
        "px " +
        (p.shadowColor || "rgba(0,0,0,0.3)") +
        ";";
    }
    var hoverClass = "";
    var hoverStyle = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
      hoverStyle = "transition:all " + (p.hoverTransition || 300) + "ms ease;";
    }
    var animClass = "";
    var animStyle = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
      animStyle =
        "animation-duration:" +
        (p.animDuration || 600) +
        "ms;animation-delay:" +
        (p.animDelay || 0) +
        "ms;animation-fill-mode:both;";
    }
    var glowStyle = "";
    if (p.glowEffect) {
      glowStyle =
        "filter:drop-shadow(0 0 " +
        (p.glowSize || 15) +
        "px " +
        (p.glowColor || "#a78bfa") +
        ");";
    }
    var textShadowStyle = "";
    if (p.textShadow) {
      textShadowStyle =
        "text-shadow:" +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowBlur || 4) * 2 +
        "px " +
        (p.textShadowColor || "rgba(0,0,0,0.5)") +
        ";";
    }
    var textTransformStyle = "";
    if (p.textTransform && p.textTransform !== "none") {
      textTransformStyle = "text-transform:" + p.textTransform + ";";
    }
    var rotX = p.rotateX ? "1" : "0";
    var rotY = p.rotateY ? "1" : "0";
    var autoRot = p.autoRotate ? "1" : "0";
    var mouseDrv = p.mouseDriven ? "1" : "0";
    var dualCol = p.dualColour ? "1" : "0";
    return (
      '<div class="veltro-rot3d-wrap' +
      animClass +
      hoverClass +
      '" id="rot3d-' +
      id +
      '" data-rotation-speed="' +
      (p.rotationSpeed || 0.02) +
      '" data-perspective="' +
      (p.perspective || 800) +
      '" data-rotate-x="' +
      rotX +
      '" data-rotate-y="' +
      rotY +
      '" data-auto-rotate="' +
      autoRot +
      '" data-mouse-driven="' +
      mouseDrv +
      '" data-depth="' +
      (p.depth || 200) +
      '" data-dual-colour="' +
      dualCol +
      '" style="height:' +
      (p.height || 300) +
      "px;" +
      containerBg +
      containerBorder +
      containerShadow +
      hoverStyle +
      animStyle +
      "border-radius:" +
      (p.borderRadius || 8) +
      "px;" +
      "padding:" +
      (p.paddingV || 24) +
      "px " +
      (p.paddingH || 24) +
      "px;" +
      "margin:" +
      (p.marginV || 0) +
      "px " +
      (p.marginH || 0) +
      "px;" +
      "opacity:" +
      (p.opacity || 100) / 100 +
      ";" +
      "display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;perspective:" +
      (p.perspective || 800) +
      'px;"><div class="veltro-rot3d-text" style="font-size:' +
      (p.fontSize || 72) +
      "px;font-weight:" +
      (p.fontWeight || 800) +
      ";color:" +
      (p.textColor || "#cdfe00") +
      ";font-family:'" +
      (p.fontFamily || "Lexend") +
      "',sans-serif;transform-style:preserve-3d;user-select:none;letter-spacing:" +
      (p.letterSpacing || 0) +
      "px;text-align:" +
      (p.textAlign || "center") +
      ";" +
      glowStyle +
      textShadowStyle +
      textTransformStyle +
      '" data-rot3d-init="1">' +
      (p.text || "ROTATE") +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Text & 3D</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text</label><input type="text" value="' +
      (p.text || "ROTATE") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','text',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Height: ' +
      (p.height || 300) +
      'px</label><input type="range" min="100" max="600" value="' +
      (p.height || 300) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value);this.previousElementSibling.textContent='Height: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Size: ' +
      (p.fontSize || 72) +
      'px</label><input type="range" min="24" max="150" value="' +
      (p.fontSize || 72) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontSize',+this.value);this.previousElementSibling.textContent='Font Size: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Weight: ' +
      (p.fontWeight || 800) +
      '</label><input type="range" min="100" max="900" step="100" value="' +
      (p.fontWeight || 800) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontWeight',+this.value);this.previousElementSibling.textContent='Font Weight: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Family</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontFamily',this.value)\"><option value=\"Lexend\"" +
      (p.fontFamily === "Lexend" ? " selected" : "") +
      '>Lexend</option><option value="Inter"' +
      (p.fontFamily === "Inter" ? " selected" : "") +
      ">Inter</option></select></div>";
    html +=
      '<div class="rp-row"><label>Letter Spacing: ' +
      (p.letterSpacing || 0) +
      'px</label><input type="range" min="-5" max="20" value="' +
      (p.letterSpacing || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','letterSpacing',+this.value);this.previousElementSibling.textContent='Letter Spacing: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Text Transform</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textTransform',this.value)\"><option value=\"none\"" +
      (p.textTransform === "none" ? " selected" : "") +
      '>None</option><option value="uppercase"' +
      (p.textTransform === "uppercase" ? " selected" : "") +
      ">UPPERCASE</option></select></div>";
    html +=
      '<div class="rp-row"><label>Text Align</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textAlign',this.value)\"><option value=\"left\"" +
      (p.textAlign === "left" ? " selected" : "") +
      '>Left</option><option value="center"' +
      (p.textAlign === "center" ? " selected" : "") +
      '>Center</option><option value="right"' +
      (p.textAlign === "right" ? " selected" : "") +
      ">Right</option></select></div>";
    html +=
      '<div class="rp-row"><label>Perspective: ' +
      (p.perspective || 800) +
      '</label><input type="range" min="200" max="2000" step="50" value="' +
      (p.perspective || 800) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','perspective',+this.value);this.previousElementSibling.textContent='Perspective: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Depth (Z-axis): ' +
      (p.depth || 200) +
      '</label><input type="range" min="50" max="500" value="' +
      (p.depth || 200) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','depth',+this.value);this.previousElementSibling.textContent='Depth: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Rotation Speed: ' +
      (p.rotationSpeed || 0.02) +
      '</label><input type="range" min="0" max="0.1" step="0.005" value="' +
      (p.rotationSpeed || 0.02) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','rotationSpeed',+this.value);this.previousElementSibling.textContent='Rotation Speed: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.rotateX ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','rotateX',this.checked)\"> Rotate X</label></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.rotateY ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','rotateY',this.checked)\"> Rotate Y</label></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.autoRotate ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','autoRotate',this.checked)\"> Auto Rotate</label></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.mouseDriven ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','mouseDriven',this.checked)\"> Mouse-Driven</label></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Colour & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text Colour</label><div class="rp-colour-row"><input type="color" value="' +
      (p.textColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      '\',\'textColor\',this.value)"><input type="text" value="' +
      (p.textColor || "#cdfe00") +
      '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textColor',this.value)\"></div></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.dualColour ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','dualColour',this.checked)\"> Dual Colour</label></div>";
    if (p.dualColour) {
      html +=
        '<div class="rp-row"><label>Colour 2</label><input type="color" value="' +
        (p.dualColour2 || "#3b82f6") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','dualColour2',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.glowEffect ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','glowEffect',this.checked)\"> Glow Effect</label></div>";
    if (p.glowEffect) {
      html +=
        '<div class="rp-row"><label>Glow Colour</label><input type="color" value="' +
        (p.glowColor || "#a78bfa") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Glow Size: ' +
        (p.glowSize || 15) +
        'px</label><input type="range" min="5" max="50" value="' +
        (p.glowSize || 15) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowSize',+this.value);this.previousElementSibling.textContent='Glow Size: '+this.value+'px'\"></div>";
    }
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.textShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','textShadow',this.checked)\"> Text Shadow</label></div>";
    if (p.textShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Colour</label><input type="color" value="' +
        (p.textShadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.textShadowBlur || 4) +
        '</label><input type="range" min="0" max="20" value="' +
        (p.textShadowBlur || 4) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      (p.bgType === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      (p.bgType === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      (p.bgType === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if (p.bgType === "solid") {
      html +=
        '<div class="rp-row"><label>Background Colour</label><div class="rp-colour-row"><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        '\',\'bg\',this.value)"><input type="text" value="' +
        (p.bg || "#0d0d1a") +
        '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div></div>";
    } else if (p.bgType === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Colour 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Colour 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a0d2e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        (p.bgGradientDir === "135deg" ? " selected" : "") +
        '>135°</option><option value="90deg"' +
        (p.bgGradientDir === "90deg" ? " selected" : "") +
        ">90°</option></select></div>";
    } else if (p.bgType === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImage || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImage',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius: ' +
      (p.borderRadius || 8) +
      'px</label><input type="range" min="0" max="50" value="' +
      (p.borderRadius || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value);this.previousElementSibling.textContent='Border Radius: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width: ' +
      (p.borderWidth || 0) +
      'px</label><input type="range" min="0" max="8" value="' +
      (p.borderWidth || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value);this.previousElementSibling.textContent='Border Width: '+this.value+'px'\"></div>";
    if (p.borderWidth > 0) {
      html +=
        '<div class="rp-row"><label>Border Colour</label><input type="color" value="' +
        (p.borderColor || "#a78bfa") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Border Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderStyle',this.value)\"><option value=\"solid\"" +
        (p.borderStyle === "solid" ? " selected" : "") +
        '>Solid</option><option value="dashed"' +
        (p.borderStyle === "dashed" ? " selected" : "") +
        ">Dashed</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Padding V: ' +
      (p.paddingV || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingV || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value);this.previousElementSibling.textContent='Padding V: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H: ' +
      (p.paddingH || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingH || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value);this.previousElementSibling.textContent='Padding H: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity: ' +
      (p.opacity || 100) +
      '%</label><input type="range" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value);this.previousElementSibling.textContent='Opacity: '+this.value+'%'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.boxShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','boxShadow',this.checked)\"> Box Shadow</label></div>";
    if (p.boxShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.shadowBlur || 10) +
        '</label><input type="range" min="0" max="40" value="' +
        (p.shadowBlur || 10) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animation</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      (p.entranceAnim === "none" ? " selected" : "") +
      '>None</option><option value="fade"' +
      (p.entranceAnim === "fade" ? " selected" : "") +
      '>Fade</option><option value="slide-up"' +
      (p.entranceAnim === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="zoom"' +
      (p.entranceAnim === "zoom" ? " selected" : "") +
      ">Zoom</option></select></div>";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      html +=
        '<div class="rp-row"><label>Duration: ' +
        (p.animDuration || 600) +
        'ms</label><input type="range" min="200" max="2000" step="100" value="' +
        (p.animDuration || 600) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','animDuration',+this.value);this.previousElementSibling.textContent='Duration: '+this.value+'ms'\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      (p.hoverEffect === "none" ? " selected" : "") +
      '>None</option><option value="scale"' +
      (p.hoverEffect === "scale" ? " selected" : "") +
      '>Scale</option><option value="lift"' +
      (p.hoverEffect === "lift" ? " selected" : "") +
      ">Lift</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

// 3. Morphing Text
FB.widgets.register("morphingText", {
  label: "Morphing Text",
  sublabel: "Shape-shifting words",
  icon: "⟳",
  iconBg: "#0d1a1a",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "typography",
  defaultProps: {
    height: 300,
    bg: "#0d0d1a",
    words: "Create,Design,Build,Launch",
    fontSize: 72,
    fontWeight: 800,
    textColor: "#cdfe00",
    morphSpeed: 2000,
    fadeSpeed: 500,
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a0d2e",
    bgImage: "",
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "#34d399",
    borderStyle: "solid",
    paddingV: 24,
    paddingH: 24,
    marginV: 0,
    marginH: 0,
    boxShadow: false,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowBlur: 10,
    shadowSpread: 0,
    opacity: 100,
    entranceAnim: "none",
    animDuration: 600,
    animDelay: 0,
    hoverEffect: "none",
    hoverScale: 1.02,
    hoverTransition: 300,
    morphDirection: "forward",
    highlightCurrent: true,
    highlightColor: "#cdfe00",
    fontFamily: "Lexend",
    letterSpacing: 0,
    textTransform: "none",
    glowEffect: false,
    glowColor: "#34d399",
    glowSize: 15,
    textShadow: false,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowBlur: 4,
    dualColour: false,
    dualColour2: "#3b82f6",
  },
  render: function (p) {
    var id = p._blockId || "morph";
    var words = (p.words || "Create,Design,Build,Launch").split(",");
    var wordsHtml = words
      .map(function (w, i) {
        return (
          '<span class="veltro-morph-word" data-index="' +
          i +
          '" style="position:absolute;opacity:0;transition:opacity ' +
          (p.fadeSpeed || 500) +
          'ms ease-in-out">' +
          w.trim() +
          "</span>"
        );
      })
      .join("");
    var containerBg = "";
    if (p.bgType === "gradient") {
      containerBg =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a0d2e") +
        ");";
    } else if (p.bgType === "image" && p.bgImage) {
      containerBg = "background:url(" + p.bgImage + ") center/cover;";
    } else {
      containerBg = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px " +
        (p.borderStyle || "solid") +
        " " +
        (p.borderColor || "#34d399") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow) {
      containerShadow =
        "box-shadow:0 " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowBlur || 10) * 2 +
        "px " +
        (p.shadowSpread || 0) +
        "px " +
        (p.shadowColor || "rgba(0,0,0,0.3)") +
        ";";
    }
    var hoverClass = "";
    var hoverStyle = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
      hoverStyle = "transition:all " + (p.hoverTransition || 300) + "ms ease;";
    }
    var animClass = "";
    var animStyle = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
      animStyle =
        "animation-duration:" +
        (p.animDuration || 600) +
        "ms;animation-delay:" +
        (p.animDelay || 0) +
        "ms;animation-fill-mode:both;";
    }
    var glowStyle = "";
    if (p.glowEffect) {
      glowStyle =
        "filter:drop-shadow(0 0 " +
        (p.glowSize || 15) +
        "px " +
        (p.glowColor || "#34d399") +
        ");";
    }
    var textShadowStyle = "";
    if (p.textShadow) {
      textShadowStyle =
        "text-shadow:" +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowBlur || 4) * 2 +
        "px " +
        (p.textShadowColor || "rgba(0,0,0,0.5)") +
        ";";
    }
    var textTransformStyle = "";
    if (p.textTransform && p.textTransform !== "none") {
      textTransformStyle = "text-transform:" + p.textTransform + ";";
    }
    return (
      '<div class="veltro-morph-wrap' +
      animClass +
      hoverClass +
      '" id="morph-' +
      id +
      '" data-morph-speed="' +
      (p.morphSpeed || 2000) +
      '" data-fade-speed="' +
      (p.fadeSpeed || 500) +
      '" data-words="' +
      (p.words || "Create,Design,Build,Launch") +
      '" data-morph-direction="' +
      (p.morphDirection || "forward") +
      '" data-highlight="' +
      (p.highlightCurrent ? "1" : "0") +
      '" data-highlight-color="' +
      (p.highlightColor || "#cdfe00") +
      '" data-dual-colour="' +
      (p.dualColour ? "1" : "0") +
      '" data-dual-colour2="' +
      (p.dualColour2 || "#3b82f6") +
      '" style="height:' +
      (p.height || 300) +
      "px;" +
      containerBg +
      containerBorder +
      containerShadow +
      hoverStyle +
      animStyle +
      "border-radius:" +
      (p.borderRadius || 8) +
      "px;" +
      "padding:" +
      (p.paddingV || 24) +
      "px " +
      (p.paddingH || 24) +
      "px;" +
      "margin:" +
      (p.marginV || 0) +
      "px " +
      (p.marginH || 0) +
      "px;" +
      "opacity:" +
      (p.opacity || 100) / 100 +
      ";" +
      'display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;"><div class="veltro-morph-content" style="font-size:' +
      (p.fontSize || 72) +
      "px;font-weight:" +
      (p.fontWeight || 800) +
      ";color:" +
      (p.textColor || "#cdfe00") +
      ";font-family:'" +
      (p.fontFamily || "Lexend") +
      "',sans-serif;position:relative;width:100%;text-align:center;letter-spacing:" +
      (p.letterSpacing || 0) +
      "px;" +
      glowStyle +
      textShadowStyle +
      textTransformStyle +
      '" data-morph-init="1">' +
      wordsHtml +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Text & Morph</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Words (comma-separated)</label><textarea rows="2" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','words',this.value)\">" +
      (p.words || "Create,Design,Build,Launch") +
      "</textarea></div>";
    html +=
      '<div class="rp-row"><label>Height: ' +
      (p.height || 300) +
      'px</label><input type="range" min="100" max="600" value="' +
      (p.height || 300) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value);this.previousElementSibling.textContent='Height: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Size: ' +
      (p.fontSize || 72) +
      'px</label><input type="range" min="24" max="150" value="' +
      (p.fontSize || 72) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontSize',+this.value);this.previousElementSibling.textContent='Font Size: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Weight: ' +
      (p.fontWeight || 800) +
      '</label><input type="range" min="100" max="900" step="100" value="' +
      (p.fontWeight || 800) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontWeight',+this.value);this.previousElementSibling.textContent='Font Weight: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Family</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontFamily',this.value)\"><option value=\"Lexend\"" +
      (p.fontFamily === "Lexend" ? " selected" : "") +
      '>Lexend</option><option value="Inter"' +
      (p.fontFamily === "Inter" ? " selected" : "") +
      ">Inter</option></select></div>";
    html +=
      '<div class="rp-row"><label>Letter Spacing: ' +
      (p.letterSpacing || 0) +
      'px</label><input type="range" min="-5" max="20" value="' +
      (p.letterSpacing || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','letterSpacing',+this.value);this.previousElementSibling.textContent='Letter Spacing: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Text Transform</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textTransform',this.value)\"><option value=\"none\"" +
      (p.textTransform === "none" ? " selected" : "") +
      '>None</option><option value="uppercase"' +
      (p.textTransform === "uppercase" ? " selected" : "") +
      ">UPPERCASE</option></select></div>";
    html +=
      '<div class="rp-row"><label>Morph Speed: ' +
      (p.morphSpeed || 2000) +
      'ms</label><input type="range" min="500" max="5000" step="100" value="' +
      (p.morphSpeed || 2000) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','morphSpeed',+this.value);this.previousElementSibling.textContent='Morph Speed: '+this.value+'ms'\"></div>";
    html +=
      '<div class="rp-row"><label>Fade Speed: ' +
      (p.fadeSpeed || 500) +
      'ms</label><input type="range" min="100" max="2000" step="50" value="' +
      (p.fadeSpeed || 500) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fadeSpeed',+this.value);this.previousElementSibling.textContent='Fade Speed: '+this.value+'ms'\"></div>";
    html +=
      '<div class="rp-row"><label>Morph Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','morphDirection',this.value)\"><option value=\"forward\"" +
      (p.morphDirection === "forward" ? " selected" : "") +
      '>Forward</option><option value="reverse"' +
      (p.morphDirection === "reverse" ? " selected" : "") +
      '>Reverse</option><option value="random"' +
      (p.morphDirection === "random" ? " selected" : "") +
      ">Random</option></select></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.highlightCurrent ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','highlightCurrent',this.checked)\"> Highlight Current Word</label></div>";
    if (p.highlightCurrent) {
      html +=
        '<div class="rp-row"><label>Highlight Colour</label><input type="color" value="' +
        (p.highlightColor || "#cdfe00") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','highlightColor',this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Colour & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text Colour</label><div class="rp-colour-row"><input type="color" value="' +
      (p.textColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      '\',\'textColor\',this.value)"><input type="text" value="' +
      (p.textColor || "#cdfe00") +
      '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textColor',this.value)\"></div></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.dualColour ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','dualColour',this.checked)\"> Dual Colour</label></div>";
    if (p.dualColour) {
      html +=
        '<div class="rp-row"><label>Colour 2</label><input type="color" value="' +
        (p.dualColour2 || "#3b82f6") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','dualColour2',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.glowEffect ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','glowEffect',this.checked)\"> Glow Effect</label></div>";
    if (p.glowEffect) {
      html +=
        '<div class="rp-row"><label>Glow Colour</label><input type="color" value="' +
        (p.glowColor || "#34d399") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Glow Size: ' +
        (p.glowSize || 15) +
        'px</label><input type="range" min="5" max="50" value="' +
        (p.glowSize || 15) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowSize',+this.value);this.previousElementSibling.textContent='Glow Size: '+this.value+'px'\"></div>";
    }
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.textShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','textShadow',this.checked)\"> Text Shadow</label></div>";
    if (p.textShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Colour</label><input type="color" value="' +
        (p.textShadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.textShadowBlur || 4) +
        '</label><input type="range" min="0" max="20" value="' +
        (p.textShadowBlur || 4) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      (p.bgType === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      (p.bgType === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      (p.bgType === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if (p.bgType === "solid") {
      html +=
        '<div class="rp-row"><label>Background Colour</label><div class="rp-colour-row"><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        '\',\'bg\',this.value)"><input type="text" value="' +
        (p.bg || "#0d0d1a") +
        '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div></div>";
    } else if (p.bgType === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Colour 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Colour 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a0d2e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        (p.bgGradientDir === "135deg" ? " selected" : "") +
        '>135°</option><option value="90deg"' +
        (p.bgGradientDir === "90deg" ? " selected" : "") +
        ">90°</option></select></div>";
    } else if (p.bgType === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImage || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImage',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius: ' +
      (p.borderRadius || 8) +
      'px</label><input type="range" min="0" max="50" value="' +
      (p.borderRadius || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value);this.previousElementSibling.textContent='Border Radius: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width: ' +
      (p.borderWidth || 0) +
      'px</label><input type="range" min="0" max="8" value="' +
      (p.borderWidth || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value);this.previousElementSibling.textContent='Border Width: '+this.value+'px'\"></div>";
    if (p.borderWidth > 0) {
      html +=
        '<div class="rp-row"><label>Border Colour</label><input type="color" value="' +
        (p.borderColor || "#34d399") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Border Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderStyle',this.value)\"><option value=\"solid\"" +
        (p.borderStyle === "solid" ? " selected" : "") +
        '>Solid</option><option value="dashed"' +
        (p.borderStyle === "dashed" ? " selected" : "") +
        ">Dashed</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Padding V: ' +
      (p.paddingV || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingV || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value);this.previousElementSibling.textContent='Padding V: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H: ' +
      (p.paddingH || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingH || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value);this.previousElementSibling.textContent='Padding H: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity: ' +
      (p.opacity || 100) +
      '%</label><input type="range" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value);this.previousElementSibling.textContent='Opacity: '+this.value+'%'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.boxShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','boxShadow',this.checked)\"> Box Shadow</label></div>";
    if (p.boxShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.shadowBlur || 10) +
        '</label><input type="range" min="0" max="40" value="' +
        (p.shadowBlur || 10) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animation</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      (p.entranceAnim === "none" ? " selected" : "") +
      '>None</option><option value="fade"' +
      (p.entranceAnim === "fade" ? " selected" : "") +
      '>Fade</option><option value="slide-up"' +
      (p.entranceAnim === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="zoom"' +
      (p.entranceAnim === "zoom" ? " selected" : "") +
      ">Zoom</option></select></div>";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      html +=
        '<div class="rp-row"><label>Duration: ' +
        (p.animDuration || 600) +
        'ms</label><input type="range" min="200" max="2000" step="100" value="' +
        (p.animDuration || 600) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','animDuration',+this.value);this.previousElementSibling.textContent='Duration: '+this.value+'ms'\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      (p.hoverEffect === "none" ? " selected" : "") +
      '>None</option><option value="scale"' +
      (p.hoverEffect === "scale" ? " selected" : "") +
      '>Scale</option><option value="lift"' +
      (p.hoverEffect === "lift" ? " selected" : "") +
      ">Lift</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

// 4. Kinetic Scramble
FB.widgets.register("kineticScramble", {
  label: "Kinetic Scramble",
  sublabel: "Digital cipher effect",
  icon: "⌘",
  iconBg: "#1a0d1a",
  iconColor: "#f472b6",
  category: "veltro",
  subCategory: "typography",
  defaultProps: {
    height: 300,
    bg: "#0d0d1a",
    text: "SCRAMBLE",
    fontSize: 72,
    fontWeight: 800,
    textColor: "#cdfe00",
    scrambleSpeed: 100,
    revealSpeed: 2000,
    charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%",
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a0d2e",
    bgImage: "",
    borderRadius: 8,
    borderWidth: 0,
    borderColor: "#f472b6",
    borderStyle: "solid",
    paddingV: 24,
    paddingH: 24,
    marginV: 0,
    marginH: 0,
    boxShadow: false,
    shadowColor: "rgba(0,0,0,0.3)",
    shadowBlur: 10,
    shadowSpread: 0,
    opacity: 100,
    entranceAnim: "none",
    animDuration: 600,
    animDelay: 0,
    hoverEffect: "none",
    hoverScale: 1.02,
    hoverTransition: 300,
    autoScramble: false,
    autoScrambleInterval: 3000,
    revealTrigger: "hover",
    fontFamily: "monospace",
    letterSpacing: 4,
    textTransform: "none",
    glowEffect: false,
    glowColor: "#f472b6",
    glowSize: 15,
    textShadow: false,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowBlur: 4,
    textAlign: "center",
    cipherStyle: "random",
  },
  render: function (p) {
    var id = p._blockId || "scramble";
    var containerBg = "";
    if (p.bgType === "gradient") {
      containerBg =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a0d2e") +
        ");";
    } else if (p.bgType === "image" && p.bgImage) {
      containerBg = "background:url(" + p.bgImage + ") center/cover;";
    } else {
      containerBg = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px " +
        (p.borderStyle || "solid") +
        " " +
        (p.borderColor || "#f472b6") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow) {
      containerShadow =
        "box-shadow:0 " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowBlur || 10) * 2 +
        "px " +
        (p.shadowSpread || 0) +
        "px " +
        (p.shadowColor || "rgba(0,0,0,0.3)") +
        ";";
    }
    var hoverClass = "";
    var hoverStyle = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
      hoverStyle = "transition:all " + (p.hoverTransition || 300) + "ms ease;";
    }
    var animClass = "";
    var animStyle = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
      animStyle =
        "animation-duration:" +
        (p.animDuration || 600) +
        "ms;animation-delay:" +
        (p.animDelay || 0) +
        "ms;animation-fill-mode:both;";
    }
    var glowStyle = "";
    if (p.glowEffect) {
      glowStyle =
        "filter:drop-shadow(0 0 " +
        (p.glowSize || 15) +
        "px " +
        (p.glowColor || "#f472b6") +
        ");";
    }
    var textShadowStyle = "";
    if (p.textShadow) {
      textShadowStyle =
        "text-shadow:" +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowBlur || 4) +
        "px " +
        (p.textShadowBlur || 4) * 2 +
        "px " +
        (p.textShadowColor || "rgba(0,0,0,0.5)") +
        ";";
    }
    var textTransformStyle = "";
    if (p.textTransform && p.textTransform !== "none") {
      textTransformStyle = "text-transform:" + p.textTransform + ";";
    }
    return (
      '<div class="veltro-scramble-wrap' +
      animClass +
      hoverClass +
      '" id="scramble-' +
      id +
      '" data-scramble-speed="' +
      (p.scrambleSpeed || 100) +
      '" data-reveal-speed="' +
      (p.revealSpeed || 2000) +
      '" data-charset="' +
      (p.charset || "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%") +
      '" data-text="' +
      (p.text || "SCRAMBLE") +
      '" data-auto-scramble="' +
      (p.autoScramble ? "1" : "0") +
      '" data-auto-interval="' +
      (p.autoScrambleInterval || 3000) +
      '" data-reveal-trigger="' +
      (p.revealTrigger || "hover") +
      '" data-cipher-style="' +
      (p.cipherStyle || "random") +
      '" style="height:' +
      (p.height || 300) +
      "px;" +
      containerBg +
      containerBorder +
      containerShadow +
      hoverStyle +
      animStyle +
      "border-radius:" +
      (p.borderRadius || 8) +
      "px;" +
      "padding:" +
      (p.paddingV || 24) +
      "px " +
      (p.paddingH || 24) +
      "px;" +
      "margin:" +
      (p.marginV || 0) +
      "px " +
      (p.marginH || 0) +
      "px;" +
      "opacity:" +
      (p.opacity || 100) / 100 +
      ";" +
      'display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;"><div class="veltro-scramble-text" style="font-size:' +
      (p.fontSize || 72) +
      "px;font-weight:" +
      (p.fontWeight || 800) +
      ";color:" +
      (p.textColor || "#cdfe00") +
      ";font-family:'" +
      (p.fontFamily || "monospace") +
      "',sans-serif;user-select:none;letter-spacing:" +
      (p.letterSpacing || 4) +
      "px;text-align:" +
      (p.textAlign || "center") +
      ";" +
      glowStyle +
      textShadowStyle +
      textTransformStyle +
      '" data-scramble-init="1">' +
      (p.text || "SCRAMBLE") +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Text & Scramble</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text</label><input type="text" value="' +
      (p.text || "SCRAMBLE") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','text',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Height: ' +
      (p.height || 300) +
      'px</label><input type="range" min="100" max="600" value="' +
      (p.height || 300) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value);this.previousElementSibling.textContent='Height: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Size: ' +
      (p.fontSize || 72) +
      'px</label><input type="range" min="24" max="150" value="' +
      (p.fontSize || 72) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontSize',+this.value);this.previousElementSibling.textContent='Font Size: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Weight: ' +
      (p.fontWeight || 800) +
      '</label><input type="range" min="100" max="900" step="100" value="' +
      (p.fontWeight || 800) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontWeight',+this.value);this.previousElementSibling.textContent='Font Weight: '+this.value'\"></div>";
    html +=
      '<div class="rp-row"><label>Font Family</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontFamily',this.value)\"><option value=\"monospace\"" +
      (p.fontFamily === "monospace" ? " selected" : "") +
      '>Monospace</option><option value="Inter"' +
      (p.fontFamily === "Inter" ? " selected" : "") +
      ">Inter</option></select></div>";
    html +=
      '<div class="rp-row"><label>Letter Spacing: ' +
      (p.letterSpacing || 4) +
      'px</label><input type="range" min="-5" max="20" value="' +
      (p.letterSpacing || 4) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','letterSpacing',+this.value);this.previousElementSibling.textContent='Letter Spacing: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Text Align</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textAlign',this.value)\"><option value=\"left\"" +
      (p.textAlign === "left" ? " selected" : "") +
      '>Left</option><option value="center"' +
      (p.textAlign === "center" ? " selected" : "") +
      '>Center</option><option value="right"' +
      (p.textAlign === "right" ? " selected" : "") +
      ">Right</option></select></div>";
    html +=
      '<div class="rp-row"><label>Text Transform</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textTransform',this.value)\"><option value=\"none\"" +
      (p.textTransform === "none" ? " selected" : "") +
      '>None</option><option value="uppercase"' +
      (p.textTransform === "uppercase" ? " selected" : "") +
      ">UPPERCASE</option></select></div>";
    html +=
      '<div class="rp-row"><label>Scramble Speed: ' +
      (p.scrambleSpeed || 100) +
      'ms</label><input type="range" min="20" max="300" value="' +
      (p.scrambleSpeed || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','scrambleSpeed',+this.value);this.previousElementSibling.textContent='Scramble Speed: '+this.value+'ms'\"></div>";
    html +=
      '<div class="rp-row"><label>Reveal Speed: ' +
      (p.revealSpeed || 2000) +
      'ms</label><input type="range" min="500" max="5000" step="100" value="' +
      (p.revealSpeed || 2000) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','revealSpeed',+this.value);this.previousElementSibling.textContent='Reveal Speed: '+this.value+'ms'\"></div>";
    html +=
      '<div class="rp-row"><label>Reveal Trigger</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','revealTrigger',this.value)\"><option value=\"hover\"" +
      (p.revealTrigger === "hover" ? " selected" : "") +
      '>Hover</option><option value="click"' +
      (p.revealTrigger === "click" ? " selected" : "") +
      '>Click</option><option value="scroll"' +
      (p.revealTrigger === "scroll" ? " selected" : "") +
      ">Scroll</option></select></div>";
    html +=
      '<div class="rp-row"><label>Cipher Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','cipherStyle',this.value)\"><option value=\"random\"" +
      (p.cipherStyle === "random" ? " selected" : "") +
      '>Random</option><option value="matrix"' +
      (p.cipherStyle === "matrix" ? " selected" : "") +
      '>Matrix</option><option value="binary"' +
      (p.cipherStyle === "binary" ? " selected" : "") +
      ">Binary</option></select></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.autoScramble ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','autoScramble',this.checked)\"> Auto Re-scramble</label></div>";
    if (p.autoScramble) {
      html +=
        '<div class="rp-row"><label>Re-scramble Interval: ' +
        (p.autoScrambleInterval || 3000) +
        'ms</label><input type="range" min="1000" max="10000" step="500" value="' +
        (p.autoScrambleInterval || 3000) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','autoScrambleInterval',+this.value);this.previousElementSibling.textContent='Re-scramble Interval: '+this.value+'ms'\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Charset</label><input type="text" value="' +
      (p.charset || "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','charset',this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Colour & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Text Colour</label><div class="rp-colour-row"><input type="color" value="' +
      (p.textColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      '\',\'textColor\',this.value)"><input type="text" value="' +
      (p.textColor || "#cdfe00") +
      '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textColor',this.value)\"></div></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.glowEffect ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','glowEffect',this.checked)\"> Glow Effect</label></div>";
    if (p.glowEffect) {
      html +=
        '<div class="rp-row"><label>Glow Colour</label><input type="color" value="' +
        (p.glowColor || "#f472b6") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Glow Size: ' +
        (p.glowSize || 15) +
        'px</label><input type="range" min="5" max="50" value="' +
        (p.glowSize || 15) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowSize',+this.value);this.previousElementSibling.textContent='Glow Size: '+this.value+'px'\"></div>";
    }
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.textShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','textShadow',this.checked)\"> Text Shadow</label></div>";
    if (p.textShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Colour</label><input type="color" value="' +
        (p.textShadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.textShadowBlur || 4) +
        '</label><input type="range" min="0" max="20" value="' +
        (p.textShadowBlur || 4) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','textShadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      (p.bgType === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      (p.bgType === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      (p.bgType === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if (p.bgType === "solid") {
      html +=
        '<div class="rp-row"><label>Background Colour</label><div class="rp-colour-row"><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        '\',\'bg\',this.value)"><input type="text" value="' +
        (p.bg || "#0d0d1a") +
        '" style="flex:1" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div></div>";
    } else if (p.bgType === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Colour 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Colour 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a0d2e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        (p.bgGradientDir === "135deg" ? " selected" : "") +
        '>135°</option><option value="90deg"' +
        (p.bgGradientDir === "90deg" ? " selected" : "") +
        ">90°</option></select></div>";
    } else if (p.bgType === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImage || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImage',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius: ' +
      (p.borderRadius || 8) +
      'px</label><input type="range" min="0" max="50" value="' +
      (p.borderRadius || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value);this.previousElementSibling.textContent='Border Radius: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width: ' +
      (p.borderWidth || 0) +
      'px</label><input type="range" min="0" max="8" value="' +
      (p.borderWidth || 0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value);this.previousElementSibling.textContent='Border Width: '+this.value+'px'\"></div>";
    if (p.borderWidth > 0) {
      html +=
        '<div class="rp-row"><label>Border Colour</label><input type="color" value="' +
        (p.borderColor || "#f472b6") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Border Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','borderStyle',this.value)\"><option value=\"solid\"" +
        (p.borderStyle === "solid" ? " selected" : "") +
        '>Solid</option><option value="dashed"' +
        (p.borderStyle === "dashed" ? " selected" : "") +
        ">Dashed</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Padding V: ' +
      (p.paddingV || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingV || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value);this.previousElementSibling.textContent='Padding V: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H: ' +
      (p.paddingH || 24) +
      'px</label><input type="range" min="0" max="80" value="' +
      (p.paddingH || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value);this.previousElementSibling.textContent='Padding H: '+this.value+'px'\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity: ' +
      (p.opacity || 100) +
      '%</label><input type="range" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value);this.previousElementSibling.textContent='Opacity: '+this.value+'%'\"></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.boxShadow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','boxShadow',this.checked)\"> Box Shadow</label></div>";
    if (p.boxShadow) {
      html +=
        '<div class="rp-row"><label>Shadow Blur: ' +
        (p.shadowBlur || 10) +
        '</label><input type="range" min="0" max="40" value="' +
        (p.shadowBlur || 10) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value);this.previousElementSibling.textContent='Shadow Blur: '+this.value'\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animation</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      (p.entranceAnim === "none" ? " selected" : "") +
      '>None</option><option value="fade"' +
      (p.entranceAnim === "fade" ? " selected" : "") +
      '>Fade</option><option value="slide-up"' +
      (p.entranceAnim === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="zoom"' +
      (p.entranceAnim === "zoom" ? " selected" : "") +
      ">Zoom</option></select></div>";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      html +=
        '<div class="rp-row"><label>Duration: ' +
        (p.animDuration || 600) +
        'ms</label><input type="range" min="200" max="2000" step="100" value="' +
        (p.animDuration || 600) +
        '" oninput="FB.panels.updateWidgetProp(\'' +
        id +
        "','animDuration',+this.value);this.previousElementSibling.textContent='Duration: '+this.value+'ms'\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      (p.hoverEffect === "none" ? " selected" : "") +
      '>None</option><option value="scale"' +
      (p.hoverEffect === "scale" ? " selected" : "") +
      '>Scale</option><option value="lift"' +
      (p.hoverEffect === "lift" ? " selected" : "") +
      ">Lift</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

// ── VELTRO ENGINE BATCH 3: PHYSICS (7 NEW WIDGETS) ──
// 1. Gravity Wells
FB.widgets.register("gravityWells", {
  label: "Gravity Wells",
  sublabel: "Interactive gravity points",
  icon: "◉",
  iconBg: "#0d1a0d",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "physics",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    particleCount: 100,
    wellStrength: 0.5,
    particleColor: "#cdfe00",
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a1a3e",
    bgImageUrl: "",
    bgImageOpacity: 30,
    bgImageSize: "cover",
    borderRadius: 4,
    borderWidth: 0,
    borderColor: "#ffffff",
    boxShadow: "none",
    shadowColor: "#000000",
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    paddingV: 0,
    paddingH: 0,
    marginV: 0,
    marginH: 0,
    opacity: 100,
    entranceAnim: "none",
    hoverEffect: "none",
    hoverTransition: 300,
    animDuration: 600,
    wellCount: 3,
    wellRadius: 20,
    particleSize: 2,
    particleTrail: true,
    wellMode: "attract",
    particleRandomColor: false,
    wellGlow: true,
    glowColor: "#34d399",
  },
  render: function (p) {
    var id = p._blockId || "gravWell";
    var bgType = p.bgType || "solid";
    var bgStyle = "";
    if (bgType === "gradient") {
      bgStyle =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a1a3e") +
        ");";
    } else if (bgType === "image" && p.bgImageUrl) {
      bgStyle =
        "background:url('" +
        p.bgImageUrl +
        "') center/" +
        (p.bgImageSize || "cover") +
        " no-repeat;background-color:" +
        (p.bg || "#0d0d1a") +
        ";";
    } else {
      bgStyle = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth && p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px solid " +
        (p.borderColor || "#ffffff") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow && p.boxShadow !== "none") {
      containerShadow =
        "box-shadow:" +
        (p.shadowOffsetX || 0) +
        "px " +
        (p.shadowOffsetY || 4) +
        "px " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowColor || "#000000") +
        ";";
    }
    var hoverClass = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
    }
    var animClass = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
    }
    var padStyle =
      "padding:" + (p.paddingV || 0) + "px " + (p.paddingH || 0) + "px;";
    var margStyle =
      "margin:" + (p.marginV || 0) + "px " + (p.marginH || 0) + "px;";
    var opStyle =
      p.opacity && p.opacity < 100 ? "opacity:" + p.opacity / 100 + ";" : "";
    return (
      '<div class="veltro-gravwell-wrap' +
      animClass +
      hoverClass +
      '" id="gravwell-' +
      id +
      '" data-particle-count="' +
      (p.particleCount || 100) +
      '" data-well-strength="' +
      (p.wellStrength || 0.5) +
      '" data-particle-color="' +
      (p.particleColor || "#cdfe00") +
      '" data-well-count="' +
      (p.wellCount || 3) +
      '" data-well-radius="' +
      (p.wellRadius || 20) +
      '" data-particle-size="' +
      (p.particleSize || 2) +
      '" data-particle-trail="' +
      (p.particleTrail !== false ? "true" : "false") +
      '" data-well-mode="' +
      (p.wellMode || "attract") +
      '" data-particle-random-color="' +
      (p.particleRandomColor ? "true" : "false") +
      '" data-well-glow="' +
      (p.wellGlow !== false ? "true" : "false") +
      '" data-glow-color="' +
      (p.glowColor || "#34d399") +
      '" style="height:' +
      p.height +
      "px;" +
      bgStyle +
      "position:relative;overflow:hidden;border-radius:" +
      (p.borderRadius || 4) +
      "px;cursor:crosshair;" +
      containerBorder +
      containerShadow +
      padStyle +
      margStyle +
      opStyle +
      '"><canvas class="veltro-gravwell-canvas" style="position:absolute;inset:0;width:100%;height:100%" data-gravwell-init="1"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Core Settings</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Count</label><input type="number" value="' +
      (p.particleCount || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleCount',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Well Strength</label><input type="number" step="0.1" value="' +
      (p.wellStrength || 0.5) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','wellStrength',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Color</label><input type="color" value="' +
      (p.particleColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleColor',this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Background & Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      ((p.bgType || "solid") === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      ((p.bgType || "solid") === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      ((p.bgType || "solid") === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if ((p.bgType || "solid") === "solid") {
      html +=
        '<div class="rp-row"><label>Background Color</label><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        ((p.bgGradientDir || "135deg") === "135deg" ? " selected" : "") +
        '>135°</option><option value="to right"' +
        ((p.bgGradientDir || "135deg") === "to right" ? " selected" : "") +
        '>Left→Right</option><option value="to bottom"' +
        ((p.bgGradientDir || "135deg") === "to bottom" ? " selected" : "") +
        '>Top→Bottom</option><option value="circle"' +
        ((p.bgGradientDir || "135deg") === "circle" ? " selected" : "") +
        ">Radial</option></select></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a1a3e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImageUrl || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageUrl',this.value)\" placeholder=\"https://...\"></div>";
      html +=
        '<div class="rp-row"><label>Image Opacity (%)</label><input type="number" min="0" max="100" value="' +
        (p.bgImageOpacity || 30) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageOpacity',+this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Image Size</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageSize',this.value)\"><option value=\"cover\"" +
        ((p.bgImageSize || "cover") === "cover" ? " selected" : "") +
        '>Cover</option><option value="contain"' +
        ((p.bgImageSize || "cover") === "contain" ? " selected" : "") +
        '>Contain</option><option value="100% 100%"' +
        ((p.bgImageSize || "cover") === "100% 100%" ? " selected" : "") +
        ">Stretch</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius (px)</label><input type="number" value="' +
      (p.borderRadius || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width (px)</label><input type="number" value="' +
      (p.borderWidth || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Color</label><input type="color" value="' +
      (p.borderColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Box Shadow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','boxShadow',this.value)\"><option value=\"none\"" +
      ((p.boxShadow || "none") === "none" ? " selected" : "") +
      '>None</option><option value="soft"' +
      ((p.boxShadow || "none") === "soft" ? " selected" : "") +
      '>Soft</option><option value="hard"' +
      ((p.boxShadow || "none") === "hard" ? " selected" : "") +
      '>Hard</option><option value="glow"' +
      ((p.boxShadow || "none") === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    if (p.boxShadow && p.boxShadow !== "none") {
      html +=
        '<div class="rp-row"><label>Shadow Color</label><input type="color" value="' +
        (p.shadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur</label><input type="number" value="' +
        (p.shadowBlur || 10) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Spacing & Display</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Padding V (px)</label><input type="number" value="' +
      (p.paddingV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H (px)</label><input type="number" value="' +
      (p.paddingH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin V (px)</label><input type="number" value="' +
      (p.marginV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin H (px)</label><input type="number" value="' +
      (p.marginH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animations & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      ((p.entranceAnim || "none") === "none" ? " selected" : "") +
      '>None</option><option value="fade-in"' +
      ((p.entranceAnim || "none") === "fade-in" ? " selected" : "") +
      '>Fade In</option><option value="slide-up"' +
      ((p.entranceAnim || "none") === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="slide-left"' +
      ((p.entranceAnim || "none") === "slide-left" ? " selected" : "") +
      '>Slide Left</option><option value="zoom-in"' +
      ((p.entranceAnim || "none") === "zoom-in" ? " selected" : "") +
      '>Zoom In</option><option value="flip-in"' +
      ((p.entranceAnim || "none") === "flip-in" ? " selected" : "") +
      ">Flip In</option></select></div>";
    html +=
      '<div class="rp-row"><label>Animation Duration (ms)</label><input type="number" value="' +
      (p.animDuration || 600) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','animDuration',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      ((p.hoverEffect || "none") === "none" ? " selected" : "") +
      '>None</option><option value="lift"' +
      ((p.hoverEffect || "none") === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      ((p.hoverEffect || "none") === "glow" ? " selected" : "") +
      '>Glow</option><option value="scale"' +
      ((p.hoverEffect || "none") === "scale" ? " selected" : "") +
      '>Scale</option><option value="tilt"' +
      ((p.hoverEffect || "none") === "tilt" ? " selected" : "") +
      ">Tilt</option></select></div>";
    html +=
      '<div class="rp-row"><label>Hover Transition (ms)</label><input type="number" value="' +
      (p.hoverTransition || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverTransition',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Advanced Well Options</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Well Count</label><input type="number" min="1" max="10" value="' +
      (p.wellCount || 3) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','wellCount',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Well Radius</label><input type="number" value="' +
      (p.wellRadius || 20) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','wellRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Size</label><input type="number" value="' +
      (p.particleSize || 2) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleSize',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Trail</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleTrail',this.value)\"><option value=\"true\"" +
      (p.particleTrail !== false ? " selected" : "") +
      '>Enabled</option><option value="false"' +
      (p.particleTrail === false ? " selected" : "") +
      ">Disabled</option></select></div>";
    html +=
      '<div class="rp-row"><label>Well Mode</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','wellMode',this.value)\"><option value=\"attract\"" +
      ((p.wellMode || "attract") === "attract" ? " selected" : "") +
      '>Attract</option><option value="repel"' +
      ((p.wellMode || "attract") === "repel" ? " selected" : "") +
      '>Repel</option><option value="orbit"' +
      ((p.wellMode || "attract") === "orbit" ? " selected" : "") +
      ">Orbit</option></select></div>";
    html +=
      '<div class="rp-row"><label>Random Particle Colors</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleRandomColor',this.value)\"><option value=\"false\"" +
      (!p.particleRandomColor ? " selected" : "") +
      '>Single</option><option value="true"' +
      (p.particleRandomColor ? " selected" : "") +
      ">Random</option></select></div>";
    html +=
      '<div class="rp-row"><label>Well Glow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','wellGlow',this.value)\"><option value=\"true\"" +
      (p.wellGlow !== false ? " selected" : "") +
      '>On</option><option value="false"' +
      (p.wellGlow === false ? " selected" : "") +
      ">Off</option></select></div>";
    if (p.wellGlow !== false) {
      html +=
        '<div class="rp-row"><label>Glow Color</label><input type="color" value="' +
        (p.glowColor || "#34d399") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowColor',this.value)\"></div>";
    }
    html += "</div></div>";
    return html;
  },
});

// 2. Fluid Simulation
FB.widgets.register("fluidSimulation", {
  label: "Fluid Simulation",
  sublabel: "Real-time fluid dynamics",
  icon: "≋",
  iconBg: "#0d1a2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "physics",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    particleCount: 200,
    viscosity: 0.5,
    color1: "#3b82f6",
    color2: "#ec4899",
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a1a3e",
    bgImageUrl: "",
    bgImageOpacity: 30,
    bgImageSize: "cover",
    borderRadius: 4,
    borderWidth: 0,
    borderColor: "#ffffff",
    boxShadow: "none",
    shadowColor: "#000000",
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    paddingV: 0,
    paddingH: 0,
    marginV: 0,
    marginH: 0,
    opacity: 100,
    entranceAnim: "none",
    hoverEffect: "none",
    hoverTransition: 300,
    animDuration: 600,
    fluidMode: "flow",
    fluidDensity: 1,
    fluidPressure: 0.5,
    fluidTurbulence: 0.3,
    colorBlend: "gradient",
    fluidOpacity: 80,
    fluidGlow: true,
    mouseForce: 5,
    particleStyle: "soft",
    flowField: true,
    connectionLines: false,
    glowSize: 12,
  },
  render: function (p) {
    var id = p._blockId || "fluid";
    var bgType = p.bgType || "solid";
    var bgStyle = "";
    if (bgType === "gradient") {
      bgStyle =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a1a3e") +
        ");";
    } else if (bgType === "image" && p.bgImageUrl) {
      bgStyle =
        "background:url('" +
        p.bgImageUrl +
        "') center/" +
        (p.bgImageSize || "cover") +
        " no-repeat;background-color:" +
        (p.bg || "#0d0d1a") +
        ";";
    } else {
      bgStyle = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth && p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px solid " +
        (p.borderColor || "#ffffff") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow && p.boxShadow !== "none") {
      containerShadow =
        "box-shadow:" +
        (p.shadowOffsetX || 0) +
        "px " +
        (p.shadowOffsetY || 4) +
        "px " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowColor || "#000000") +
        ";";
    }
    var hoverClass = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
    }
    var animClass = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
    }
    var padStyle =
      "padding:" + (p.paddingV || 0) + "px " + (p.paddingH || 0) + "px;";
    var margStyle =
      "margin:" + (p.marginV || 0) + "px " + (p.marginH || 0) + "px;";
    var opStyle =
      p.opacity && p.opacity < 100 ? "opacity:" + p.opacity / 100 + ";" : "";
    return (
      '<div class="veltro-fluid-wrap' +
      animClass +
      hoverClass +
      '" id="fluid-' +
      id +
      '" data-particle-count="' +
      (p.particleCount || 200) +
      '" data-viscosity="' +
      (p.viscosity || 0.5) +
      '" data-color1="' +
      (p.color1 || "#3b82f6") +
      '" data-color2="' +
      (p.color2 || "#ec4899") +
      '" data-fluid-mode="' +
      (p.fluidMode || "flow") +
      '" data-fluid-density="' +
      (p.fluidDensity || 1) +
      '" data-fluid-pressure="' +
      (p.fluidPressure || 0.5) +
      '" data-fluid-turbulence="' +
      (p.fluidTurbulence || 0.3) +
      '" data-color-blend="' +
      (p.colorBlend || "gradient") +
      '" data-fluid-opacity="' +
      (p.fluidOpacity || 80) +
      '" data-fluid-glow="' +
      (p.fluidGlow !== false ? "true" : "false") +
      '" data-mouse-force="' +
      (p.mouseForce || 5) +
      '" data-particle-style="' +
      (p.particleStyle || "soft") +
      '" data-flow-field="' +
      (p.flowField !== false ? "true" : "false") +
      '" data-connection-lines="' +
      (p.connectionLines ? "true" : "false") +
      '" data-glow-size="' +
      (p.glowSize || 12) +
      '" style="height:' +
      p.height +
      "px;" +
      bgStyle +
      "position:relative;overflow:hidden;border-radius:" +
      (p.borderRadius || 4) +
      "px;" +
      containerBorder +
      containerShadow +
      padStyle +
      margStyle +
      opStyle +
      '"><canvas class="veltro-fluid-canvas" style="position:absolute;inset:0;width:100%;height:100%" data-fluid-init="1"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Core Settings</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Count</label><input type="number" value="' +
      (p.particleCount || 200) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleCount',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Viscosity</label><input type="number" step="0.05" min="0" max="1" value="' +
      (p.viscosity || 0.5) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','viscosity',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Color 1</label><input type="color" value="' +
      (p.color1 || "#3b82f6") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color1',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Color 2</label><input type="color" value="' +
      (p.color2 || "#ec4899") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color2',this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Background & Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      ((p.bgType || "solid") === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      ((p.bgType || "solid") === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      ((p.bgType || "solid") === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if ((p.bgType || "solid") === "solid") {
      html +=
        '<div class="rp-row"><label>Background Color</label><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        ((p.bgGradientDir || "135deg") === "135deg" ? " selected" : "") +
        '>135°</option><option value="to right"' +
        ((p.bgGradientDir || "135deg") === "to right" ? " selected" : "") +
        '>Left→Right</option><option value="to bottom"' +
        ((p.bgGradientDir || "135deg") === "to bottom" ? " selected" : "") +
        '>Top→Bottom</option><option value="circle"' +
        ((p.bgGradientDir || "135deg") === "circle" ? " selected" : "") +
        ">Radial</option></select></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a1a3e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImageUrl || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageUrl',this.value)\" placeholder=\"https://...\"></div>";
      html +=
        '<div class="rp-row"><label>Image Opacity (%)</label><input type="number" min="0" max="100" value="' +
        (p.bgImageOpacity || 30) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageOpacity',+this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Image Size</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageSize',this.value)\"><option value=\"cover\"" +
        ((p.bgImageSize || "cover") === "cover" ? " selected" : "") +
        '>Cover</option><option value="contain"' +
        ((p.bgImageSize || "cover") === "contain" ? " selected" : "") +
        '>Contain</option><option value="100% 100%"' +
        ((p.bgImageSize || "cover") === "100% 100%" ? " selected" : "") +
        ">Stretch</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius (px)</label><input type="number" value="' +
      (p.borderRadius || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width (px)</label><input type="number" value="' +
      (p.borderWidth || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Color</label><input type="color" value="' +
      (p.borderColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Box Shadow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','boxShadow',this.value)\"><option value=\"none\"" +
      ((p.boxShadow || "none") === "none" ? " selected" : "") +
      '>None</option><option value="soft"' +
      ((p.boxShadow || "none") === "soft" ? " selected" : "") +
      '>Soft</option><option value="hard"' +
      ((p.boxShadow || "none") === "hard" ? " selected" : "") +
      '>Hard</option><option value="glow"' +
      ((p.boxShadow || "none") === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    if (p.boxShadow && p.boxShadow !== "none") {
      html +=
        '<div class="rp-row"><label>Shadow Color</label><input type="color" value="' +
        (p.shadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur</label><input type="number" value="' +
        (p.shadowBlur || 10) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Spacing & Display</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Padding V (px)</label><input type="number" value="' +
      (p.paddingV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H (px)</label><input type="number" value="' +
      (p.paddingH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin V (px)</label><input type="number" value="' +
      (p.marginV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin H (px)</label><input type="number" value="' +
      (p.marginH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animations & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      ((p.entranceAnim || "none") === "none" ? " selected" : "") +
      '>None</option><option value="fade-in"' +
      ((p.entranceAnim || "none") === "fade-in" ? " selected" : "") +
      '>Fade In</option><option value="slide-up"' +
      ((p.entranceAnim || "none") === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="slide-left"' +
      ((p.entranceAnim || "none") === "slide-left" ? " selected" : "") +
      '>Slide Left</option><option value="zoom-in"' +
      ((p.entranceAnim || "none") === "zoom-in" ? " selected" : "") +
      '>Zoom In</option><option value="flip-in"' +
      ((p.entranceAnim || "none") === "flip-in" ? " selected" : "") +
      ">Flip In</option></select></div>";
    html +=
      '<div class="rp-row"><label>Animation Duration (ms)</label><input type="number" value="' +
      (p.animDuration || 600) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','animDuration',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      ((p.hoverEffect || "none") === "none" ? " selected" : "") +
      '>None</option><option value="lift"' +
      ((p.hoverEffect || "none") === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      ((p.hoverEffect || "none") === "glow" ? " selected" : "") +
      '>Glow</option><option value="scale"' +
      ((p.hoverEffect || "none") === "scale" ? " selected" : "") +
      '>Scale</option><option value="tilt"' +
      ((p.hoverEffect || "none") === "tilt" ? " selected" : "") +
      ">Tilt</option></select></div>";
    html +=
      '<div class="rp-row"><label>Hover Transition (ms)</label><input type="number" value="' +
      (p.hoverTransition || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverTransition',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Advanced Fluid Options</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Fluid Mode</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fluidMode',this.value)\"><option value=\"flow\"" +
      ((p.fluidMode || "flow") === "flow" ? " selected" : "") +
      '>Flow</option><option value="wave"' +
      ((p.fluidMode || "flow") === "wave" ? " selected" : "") +
      '>Wave</option><option value="vortex"' +
      ((p.fluidMode || "flow") === "vortex" ? " selected" : "") +
      '>Vortex</option><option value="fountain"' +
      ((p.fluidMode || "flow") === "fountain" ? " selected" : "") +
      ">Fountain</option></select></div>";
    html +=
      '<div class="rp-row"><label>Fluid Density</label><input type="number" step="0.1" min="0.1" max="3" value="' +
      (p.fluidDensity || 1) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fluidDensity',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Fluid Pressure</label><input type="number" step="0.05" min="0" max="1" value="' +
      (p.fluidPressure || 0.5) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fluidPressure',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Fluid Turbulence</label><input type="number" step="0.05" min="0" max="1" value="' +
      (p.fluidTurbulence || 0.3) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fluidTurbulence',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Color Blend</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','colorBlend',this.value)\"><option value=\"gradient\"" +
      ((p.colorBlend || "gradient") === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="solid"' +
      ((p.colorBlend || "gradient") === "solid" ? " selected" : "") +
      '>Solid</option><option value="random"' +
      ((p.colorBlend || "gradient") === "random" ? " selected" : "") +
      '>Random</option><option value="alternating"' +
      ((p.colorBlend || "gradient") === "alternating" ? " selected" : "") +
      '>Alternating</option><option value="velocity"' +
      ((p.colorBlend || "gradient") === "velocity" ? " selected" : "") +
      '>Velocity</option><option value="position"' +
      ((p.colorBlend || "gradient") === "position" ? " selected" : "") +
      ">Position</option></select></div>";
    html +=
      '<div class="rp-row"><label>Fluid Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.fluidOpacity || 80) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fluidOpacity',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Fluid Glow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fluidGlow',this.value)\"><option value=\"true\"" +
      (p.fluidGlow !== false ? " selected" : "") +
      '>On</option><option value="false"' +
      (p.fluidGlow === false ? " selected" : "") +
      ">Off</option></select></div>";
    html +=
      '<div class="rp-row"><label>Mouse Force</label><input type="number" value="' +
      (p.mouseForce || 5) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','mouseForce',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Glow Size (px)</label><input type="number" min="0" max="60" value="' +
      (p.glowSize || 12) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','glowSize',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleStyle',this.value)\"><option value=\"soft\"" +
      ((p.particleStyle || "soft") === "soft" ? " selected" : "") +
      '>Soft</option><option value="hard"' +
      ((p.particleStyle || "soft") === "hard" ? " selected" : "") +
      '>Hard</option><option value="ring"' +
      ((p.particleStyle || "soft") === "ring" ? " selected" : "") +
      ">Ring</option></select></div>";
    html +=
      '<div class="rp-row"><label>Flow Field</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','flowField',this.value==='true')\"><option value=\"true\"" +
      (p.flowField !== false ? " selected" : "") +
      '>On</option><option value="false"' +
      (p.flowField === false ? " selected" : "") +
      ">Off</option></select></div>";
    html +=
      '<div class="rp-row"><label>Connection Lines</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','connectionLines',this.value==='true')\"><option value=\"false\"" +
      (!p.connectionLines ? " selected" : "") +
      '>Off</option><option value="true"' +
      (p.connectionLines ? " selected" : "") +
      ">On</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

// 3. Cloth Simulation
FB.widgets.register("clothSimulation", {
  label: "Cloth Simulation",
  sublabel: "Fabric physics",
  icon: "▣",
  iconBg: "#1a0d1a",
  iconColor: "#f472b6",
  category: "veltro",
  subCategory: "physics",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    cols: 20,
    rows: 15,
    stiffness: 0.9,
    damping: 0.9,
    color: "#cdfe00",
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a1a3e",
    bgImageUrl: "",
    bgImageOpacity: 30,
    bgImageSize: "cover",
    borderRadius: 4,
    borderWidth: 0,
    borderColor: "#ffffff",
    boxShadow: "none",
    shadowColor: "#000000",
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    paddingV: 0,
    paddingH: 0,
    marginV: 0,
    marginH: 0,
    opacity: 100,
    entranceAnim: "none",
    hoverEffect: "none",
    hoverTransition: 300,
    animDuration: 600,
    clothGravity: 0.5,
    clothWind: false,
    windStrength: 0.2,
    lineWidth: 1,
    lineOpacity: 80,
    pinEdges: "top",
    mouseTear: false,
    tearForce: 10,
    color2: "#3b82f6",
    useGradient: false,
  },
  render: function (p) {
    var id = p._blockId || "cloth";
    var bgType = p.bgType || "solid";
    var bgStyle = "";
    if (bgType === "gradient") {
      bgStyle =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a1a3e") +
        ");";
    } else if (bgType === "image" && p.bgImageUrl) {
      bgStyle =
        "background:url('" +
        p.bgImageUrl +
        "') center/" +
        (p.bgImageSize || "cover") +
        " no-repeat;background-color:" +
        (p.bg || "#0d0d1a") +
        ";";
    } else {
      bgStyle = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth && p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px solid " +
        (p.borderColor || "#ffffff") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow && p.boxShadow !== "none") {
      containerShadow =
        "box-shadow:" +
        (p.shadowOffsetX || 0) +
        "px " +
        (p.shadowOffsetY || 4) +
        "px " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowColor || "#000000") +
        ";";
    }
    var hoverClass = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
    }
    var animClass = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
    }
    var padStyle =
      "padding:" + (p.paddingV || 0) + "px " + (p.paddingH || 0) + "px;";
    var margStyle =
      "margin:" + (p.marginV || 0) + "px " + (p.marginH || 0) + "px;";
    var opStyle =
      p.opacity && p.opacity < 100 ? "opacity:" + p.opacity / 100 + ";" : "";
    return (
      '<div class="veltro-cloth-wrap' +
      animClass +
      hoverClass +
      '" id="cloth-' +
      id +
      '" data-cols="' +
      (p.cols || 20) +
      '" data-rows="' +
      (p.rows || 15) +
      '" data-stiffness="' +
      (p.stiffness || 0.9) +
      '" data-damping="' +
      (p.damping || 0.9) +
      '" data-color="' +
      (p.color || "#cdfe00") +
      '" data-cloth-gravity="' +
      (p.clothGravity || 0.5) +
      '" data-cloth-wind="' +
      (p.clothWind ? "true" : "false") +
      '" data-wind-strength="' +
      (p.windStrength || 0.2) +
      '" data-line-width="' +
      (p.lineWidth || 1) +
      '" data-line-opacity="' +
      (p.lineOpacity || 80) +
      '" data-pin-edges="' +
      (p.pinEdges || "top") +
      '" data-mouse-tear="' +
      (p.mouseTear ? "true" : "false") +
      '" data-tear-force="' +
      (p.tearForce || 10) +
      '" data-use-gradient="' +
      (p.useGradient ? "true" : "false") +
      '" style="height:' +
      p.height +
      "px;" +
      bgStyle +
      "position:relative;overflow:hidden;border-radius:" +
      (p.borderRadius || 4) +
      "px;" +
      containerBorder +
      containerShadow +
      padStyle +
      margStyle +
      opStyle +
      '"><canvas class="veltro-cloth-canvas" style="position:absolute;inset:0;width:100%;height:100%" data-cloth-init="1"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Core Settings</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Columns</label><input type="number" value="' +
      (p.cols || 20) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','cols',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Rows</label><input type="number" value="' +
      (p.rows || 15) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','rows',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Stiffness</label><input type="number" step="0.05" min="0" max="1" value="' +
      (p.stiffness || 0.9) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','stiffness',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Damping</label><input type="number" step="0.05" min="0" max="1" value="' +
      (p.damping || 0.9) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','damping',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Color</label><input type="color" value="' +
      (p.color || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color',this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Background & Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      ((p.bgType || "solid") === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      ((p.bgType || "solid") === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      ((p.bgType || "solid") === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if ((p.bgType || "solid") === "solid") {
      html +=
        '<div class="rp-row"><label>Background Color</label><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        ((p.bgGradientDir || "135deg") === "135deg" ? " selected" : "") +
        '>135°</option><option value="to right"' +
        ((p.bgGradientDir || "135deg") === "to right" ? " selected" : "") +
        '>Left→Right</option><option value="to bottom"' +
        ((p.bgGradientDir || "135deg") === "to bottom" ? " selected" : "") +
        '>Top→Bottom</option><option value="circle"' +
        ((p.bgGradientDir || "135deg") === "circle" ? " selected" : "") +
        ">Radial</option></select></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a1a3e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImageUrl || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageUrl',this.value)\" placeholder=\"https://...\"></div>";
      html +=
        '<div class="rp-row"><label>Image Opacity (%)</label><input type="number" min="0" max="100" value="' +
        (p.bgImageOpacity || 30) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageOpacity',+this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Image Size</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageSize',this.value)\"><option value=\"cover\"" +
        ((p.bgImageSize || "cover") === "cover" ? " selected" : "") +
        '>Cover</option><option value="contain"' +
        ((p.bgImageSize || "cover") === "contain" ? " selected" : "") +
        '>Contain</option><option value="100% 100%"' +
        ((p.bgImageSize || "cover") === "100% 100%" ? " selected" : "") +
        ">Stretch</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius (px)</label><input type="number" value="' +
      (p.borderRadius || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width (px)</label><input type="number" value="' +
      (p.borderWidth || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Color</label><input type="color" value="' +
      (p.borderColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Box Shadow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','boxShadow',this.value)\"><option value=\"none\"" +
      ((p.boxShadow || "none") === "none" ? " selected" : "") +
      '>None</option><option value="soft"' +
      ((p.boxShadow || "none") === "soft" ? " selected" : "") +
      '>Soft</option><option value="hard"' +
      ((p.boxShadow || "none") === "hard" ? " selected" : "") +
      '>Hard</option><option value="glow"' +
      ((p.boxShadow || "none") === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    if (p.boxShadow && p.boxShadow !== "none") {
      html +=
        '<div class="rp-row"><label>Shadow Color</label><input type="color" value="' +
        (p.shadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur</label><input type="number" value="' +
        (p.shadowBlur || 10) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Spacing & Display</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Padding V (px)</label><input type="number" value="' +
      (p.paddingV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H (px)</label><input type="number" value="' +
      (p.paddingH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin V (px)</label><input type="number" value="' +
      (p.marginV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin H (px)</label><input type="number" value="' +
      (p.marginH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animations & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      ((p.entranceAnim || "none") === "none" ? " selected" : "") +
      '>None</option><option value="fade-in"' +
      ((p.entranceAnim || "none") === "fade-in" ? " selected" : "") +
      '>Fade In</option><option value="slide-up"' +
      ((p.entranceAnim || "none") === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="slide-left"' +
      ((p.entranceAnim || "none") === "slide-left" ? " selected" : "") +
      '>Slide Left</option><option value="zoom-in"' +
      ((p.entranceAnim || "none") === "zoom-in" ? " selected" : "") +
      '>Zoom In</option><option value="flip-in"' +
      ((p.entranceAnim || "none") === "flip-in" ? " selected" : "") +
      ">Flip In</option></select></div>";
    html +=
      '<div class="rp-row"><label>Animation Duration (ms)</label><input type="number" value="' +
      (p.animDuration || 600) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','animDuration',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      ((p.hoverEffect || "none") === "none" ? " selected" : "") +
      '>None</option><option value="lift"' +
      ((p.hoverEffect || "none") === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      ((p.hoverEffect || "none") === "glow" ? " selected" : "") +
      '>Glow</option><option value="scale"' +
      ((p.hoverEffect || "none") === "scale" ? " selected" : "") +
      '>Scale</option><option value="tilt"' +
      ((p.hoverEffect || "none") === "tilt" ? " selected" : "") +
      ">Tilt</option></select></div>";
    html +=
      '<div class="rp-row"><label>Hover Transition (ms)</label><input type="number" value="' +
      (p.hoverTransition || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverTransition',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Advanced Cloth Options</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Cloth Gravity</label><input type="number" step="0.1" min="0" max="2" value="' +
      (p.clothGravity || 0.5) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','clothGravity',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Wind Enabled</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','clothWind',this.value)\"><option value=\"false\"" +
      (!p.clothWind ? " selected" : "") +
      '>Off</option><option value="true"' +
      (p.clothWind ? " selected" : "") +
      ">On</option></select></div>";
    if (p.clothWind) {
      html +=
        '<div class="rp-row"><label>Wind Strength</label><input type="number" step="0.05" value="' +
        (p.windStrength || 0.2) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','windStrength',+this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Line Width</label><input type="number" step="0.5" value="' +
      (p.lineWidth || 1) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','lineWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Line Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.lineOpacity || 80) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','lineOpacity',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Pin Edges</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','pinEdges',this.value)\"><option value=\"top\"" +
      ((p.pinEdges || "top") === "top" ? " selected" : "") +
      '>Top</option><option value="left"' +
      ((p.pinEdges || "top") === "left" ? " selected" : "") +
      '>Left</option><option value="right"' +
      ((p.pinEdges || "top") === "right" ? " selected" : "") +
      '>Right</option><option value="all"' +
      ((p.pinEdges || "top") === "all" ? " selected" : "") +
      '>All Sides</option><option value="none"' +
      ((p.pinEdges || "top") === "none" ? " selected" : "") +
      ">None</option></select></div>";
    html +=
      '<div class="rp-row"><label>Mouse Tear</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','mouseTear',this.value)\"><option value=\"false\"" +
      (!p.mouseTear ? " selected" : "") +
      '>Off</option><option value="true"' +
      (p.mouseTear ? " selected" : "") +
      ">On</option></select></div>";
    if (p.mouseTear) {
      html +=
        '<div class="rp-row"><label>Tear Force</label><input type="number" value="' +
        (p.tearForce || 10) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','tearForce',+this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Use Gradient</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','useGradient',this.value)\"><option value=\"false\"" +
      (!p.useGradient ? " selected" : "") +
      '>Single Color</option><option value="true"' +
      (p.useGradient ? " selected" : "") +
      ">Gradient</option></select></div>";
    if (p.useGradient) {
      html +=
        '<div class="rp-row"><label>Color 2</label><input type="color" value="' +
        (p.color2 || "#3b82f6") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','color2',this.value)\"></div>";
    }
    html += "</div></div>";
    return html;
  },
});

// 4. Magnetic Fields
FB.widgets.register("magneticFields", {
  label: "Magnetic Fields",
  sublabel: "Objects with magnetic polarity",
  icon: "⊕",
  iconBg: "#0d1a1a",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "physics",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    particleCount: 80,
    fieldStrength: 0.5,
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a1a3e",
    bgImageUrl: "",
    bgImageOpacity: 30,
    bgImageSize: "cover",
    borderRadius: 4,
    borderWidth: 0,
    borderColor: "#ffffff",
    boxShadow: "none",
    shadowColor: "#000000",
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    paddingV: 0,
    paddingH: 0,
    marginV: 0,
    marginH: 0,
    opacity: 100,
    entranceAnim: "none",
    hoverEffect: "none",
    hoverTransition: 300,
    animDuration: 600,
    particleColor: "#34d399",
    particleSize: 2,
    fieldLines: true,
    fieldLineOpacity: 30,
    particleTrail: true,
    fieldMode: "dipole",
    particleGlow: false,
    glowColor: "#34d399",
  },
  render: function (p) {
    var id = p._blockId || "magField";
    var bgType = p.bgType || "solid";
    var bgStyle = "";
    if (bgType === "gradient") {
      bgStyle =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a1a3e") +
        ");";
    } else if (bgType === "image" && p.bgImageUrl) {
      bgStyle =
        "background:url('" +
        p.bgImageUrl +
        "') center/" +
        (p.bgImageSize || "cover") +
        " no-repeat;background-color:" +
        (p.bg || "#0d0d1a") +
        ";";
    } else {
      bgStyle = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth && p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px solid " +
        (p.borderColor || "#ffffff") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow && p.boxShadow !== "none") {
      containerShadow =
        "box-shadow:" +
        (p.shadowOffsetX || 0) +
        "px " +
        (p.shadowOffsetY || 4) +
        "px " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowColor || "#000000") +
        ";";
    }
    var hoverClass = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
    }
    var animClass = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
    }
    var padStyle =
      "padding:" + (p.paddingV || 0) + "px " + (p.paddingH || 0) + "px;";
    var margStyle =
      "margin:" + (p.marginV || 0) + "px " + (p.marginH || 0) + "px;";
    var opStyle =
      p.opacity && p.opacity < 100 ? "opacity:" + p.opacity / 100 + ";" : "";
    return (
      '<div class="veltro-magfield-wrap' +
      animClass +
      hoverClass +
      '" id="magfield-' +
      id +
      '" data-particle-count="' +
      (p.particleCount || 80) +
      '" data-field-strength="' +
      (p.fieldStrength || 0.5) +
      '" data-particle-color="' +
      (p.particleColor || "#34d399") +
      '" data-particle-size="' +
      (p.particleSize || 2) +
      '" data-field-lines="' +
      (p.fieldLines !== false ? "true" : "false") +
      '" data-field-line-opacity="' +
      (p.fieldLineOpacity || 30) +
      '" data-particle-trail="' +
      (p.particleTrail !== false ? "true" : "false") +
      '" data-field-mode="' +
      (p.fieldMode || "dipole") +
      '" data-particle-glow="' +
      (p.particleGlow ? "true" : "false") +
      '" data-glow-color="' +
      (p.glowColor || "#34d399") +
      '" style="height:' +
      p.height +
      "px;" +
      bgStyle +
      "position:relative;overflow:hidden;border-radius:" +
      (p.borderRadius || 4) +
      "px;" +
      containerBorder +
      containerShadow +
      padStyle +
      margStyle +
      opStyle +
      '"><canvas class="veltro-magfield-canvas" style="position:absolute;inset:0;width:100%;height:100%" data-magfield-init="1"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Core Settings</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Count</label><input type="number" value="' +
      (p.particleCount || 80) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleCount',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Field Strength</label><input type="number" step="0.05" min="0" max="2" value="' +
      (p.fieldStrength || 0.5) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fieldStrength',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Background & Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      ((p.bgType || "solid") === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      ((p.bgType || "solid") === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      ((p.bgType || "solid") === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if ((p.bgType || "solid") === "solid") {
      html +=
        '<div class="rp-row"><label>Background Color</label><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        ((p.bgGradientDir || "135deg") === "135deg" ? " selected" : "") +
        '>135°</option><option value="to right"' +
        ((p.bgGradientDir || "135deg") === "to right" ? " selected" : "") +
        '>Left→Right</option><option value="to bottom"' +
        ((p.bgGradientDir || "135deg") === "to bottom" ? " selected" : "") +
        '>Top→Bottom</option><option value="circle"' +
        ((p.bgGradientDir || "135deg") === "circle" ? " selected" : "") +
        ">Radial</option></select></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a1a3e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImageUrl || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageUrl',this.value)\" placeholder=\"https://...\"></div>";
      html +=
        '<div class="rp-row"><label>Image Opacity (%)</label><input type="number" min="0" max="100" value="' +
        (p.bgImageOpacity || 30) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageOpacity',+this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Image Size</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageSize',this.value)\"><option value=\"cover\"" +
        ((p.bgImageSize || "cover") === "cover" ? " selected" : "") +
        '>Cover</option><option value="contain"' +
        ((p.bgImageSize || "cover") === "contain" ? " selected" : "") +
        '>Contain</option><option value="100% 100%"' +
        ((p.bgImageSize || "cover") === "100% 100%" ? " selected" : "") +
        ">Stretch</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius (px)</label><input type="number" value="' +
      (p.borderRadius || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width (px)</label><input type="number" value="' +
      (p.borderWidth || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Color</label><input type="color" value="' +
      (p.borderColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Box Shadow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','boxShadow',this.value)\"><option value=\"none\"" +
      ((p.boxShadow || "none") === "none" ? " selected" : "") +
      '>None</option><option value="soft"' +
      ((p.boxShadow || "none") === "soft" ? " selected" : "") +
      '>Soft</option><option value="hard"' +
      ((p.boxShadow || "none") === "hard" ? " selected" : "") +
      '>Hard</option><option value="glow"' +
      ((p.boxShadow || "none") === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    if (p.boxShadow && p.boxShadow !== "none") {
      html +=
        '<div class="rp-row"><label>Shadow Color</label><input type="color" value="' +
        (p.shadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur</label><input type="number" value="' +
        (p.shadowBlur || 10) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Spacing & Display</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Padding V (px)</label><input type="number" value="' +
      (p.paddingV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H (px)</label><input type="number" value="' +
      (p.paddingH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin V (px)</label><input type="number" value="' +
      (p.marginV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin H (px)</label><input type="number" value="' +
      (p.marginH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animations & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      ((p.entranceAnim || "none") === "none" ? " selected" : "") +
      '>None</option><option value="fade-in"' +
      ((p.entranceAnim || "none") === "fade-in" ? " selected" : "") +
      '>Fade In</option><option value="slide-up"' +
      ((p.entranceAnim || "none") === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="slide-left"' +
      ((p.entranceAnim || "none") === "slide-left" ? " selected" : "") +
      '>Slide Left</option><option value="zoom-in"' +
      ((p.entranceAnim || "none") === "zoom-in" ? " selected" : "") +
      '>Zoom In</option><option value="flip-in"' +
      ((p.entranceAnim || "none") === "flip-in" ? " selected" : "") +
      ">Flip In</option></select></div>";
    html +=
      '<div class="rp-row"><label>Animation Duration (ms)</label><input type="number" value="' +
      (p.animDuration || 600) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','animDuration',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      ((p.hoverEffect || "none") === "none" ? " selected" : "") +
      '>None</option><option value="lift"' +
      ((p.hoverEffect || "none") === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      ((p.hoverEffect || "none") === "glow" ? " selected" : "") +
      '>Glow</option><option value="scale"' +
      ((p.hoverEffect || "none") === "scale" ? " selected" : "") +
      '>Scale</option><option value="tilt"' +
      ((p.hoverEffect || "none") === "tilt" ? " selected" : "") +
      ">Tilt</option></select></div>";
    html +=
      '<div class="rp-row"><label>Hover Transition (ms)</label><input type="number" value="' +
      (p.hoverTransition || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverTransition',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Advanced Field Options</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Particle Color</label><input type="color" value="' +
      (p.particleColor || "#34d399") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Size</label><input type="number" value="' +
      (p.particleSize || 2) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleSize',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Field Lines</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fieldLines',this.value)\"><option value=\"true\"" +
      (p.fieldLines !== false ? " selected" : "") +
      '>Enabled</option><option value="false"' +
      (p.fieldLines === false ? " selected" : "") +
      ">Disabled</option></select></div>";
    html +=
      '<div class="rp-row"><label>Field Line Opacity</label><input type="number" min="0" max="100" value="' +
      (p.fieldLineOpacity || 30) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fieldLineOpacity',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Trail</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleTrail',this.value)\"><option value=\"true\"" +
      (p.particleTrail !== false ? " selected" : "") +
      '>Enabled</option><option value="false"' +
      (p.particleTrail === false ? " selected" : "") +
      ">Disabled</option></select></div>";
    html +=
      '<div class="rp-row"><label>Field Mode</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','fieldMode',this.value)\"><option value=\"dipole\"" +
      ((p.fieldMode || "dipole") === "dipole" ? " selected" : "") +
      '>Dipole</option><option value="monopole"' +
      ((p.fieldMode || "dipole") === "monopole" ? " selected" : "") +
      '>Monopole</option><option value="quadrupole"' +
      ((p.fieldMode || "dipole") === "quadrupole" ? " selected" : "") +
      ">Quadrupole</option></select></div>";
    html +=
      '<div class="rp-row"><label>Particle Glow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleGlow',this.value)\"><option value=\"false\"" +
      (!p.particleGlow ? " selected" : "") +
      '>Off</option><option value="true"' +
      (p.particleGlow ? " selected" : "") +
      ">On</option></select></div>";
    if (p.particleGlow) {
      html +=
        '<div class="rp-row"><label>Glow Color</label><input type="color" value="' +
        (p.glowColor || "#34d399") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowColor',this.value)\"></div>";
    }
    html += "</div></div>";
    return html;
  },
});

// 5. Pendulum Wave
FB.widgets.register("pendulumWave", {
  label: "Pendulum Wave",
  sublabel: "Synchronized pendulums",
  icon: "◔",
  iconBg: "#1a0d2e",
  iconColor: "#a78bfa",
  category: "veltro",
  subCategory: "physics",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    count: 15,
    amplitude: 80,
    speed: 1,
    color: "#cdfe00",
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a1a3e",
    bgImageUrl: "",
    bgImageOpacity: 30,
    bgImageSize: "cover",
    borderRadius: 4,
    borderWidth: 0,
    borderColor: "#ffffff",
    boxShadow: "none",
    shadowColor: "#000000",
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    paddingV: 0,
    paddingH: 0,
    marginV: 0,
    marginH: 0,
    opacity: 100,
    entranceAnim: "none",
    hoverEffect: "none",
    hoverTransition: 300,
    animDuration: 600,
    pendulumLength: 100,
    bobSize: 6,
    lineWidth: 1,
    lineColor: "#555555",
    colorMode: "single",
    color2: "#3b82f6",
    showTrail: false,
    trailLength: 20,
    gravity: 1,
    layout: "bottom",
    bobShape: "circle",
    glow: false,
    waveMode: "sine",
  },
  render: function (p) {
    var id = p._blockId || "pendulum";
    var bgType = p.bgType || "solid";
    var bgStyle = "";
    if (bgType === "gradient") {
      bgStyle =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a1a3e") +
        ");";
    } else if (bgType === "image" && p.bgImageUrl) {
      bgStyle =
        "background:url('" +
        p.bgImageUrl +
        "') center/" +
        (p.bgImageSize || "cover") +
        " no-repeat;background-color:" +
        (p.bg || "#0d0d1a") +
        ";";
    } else {
      bgStyle = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth && p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px solid " +
        (p.borderColor || "#ffffff") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow && p.boxShadow !== "none") {
      containerShadow =
        "box-shadow:" +
        (p.shadowOffsetX || 0) +
        "px " +
        (p.shadowOffsetY || 4) +
        "px " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowColor || "#000000") +
        ";";
    }
    var hoverClass = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
    }
    var animClass = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
    }
    var padStyle =
      "padding:" + (p.paddingV || 0) + "px " + (p.paddingH || 0) + "px;";
    var margStyle =
      "margin:" + (p.marginV || 0) + "px " + (p.marginH || 0) + "px;";
    var opStyle =
      p.opacity && p.opacity < 100 ? "opacity:" + p.opacity / 100 + ";" : "";
    return (
      '<div class="veltro-pendulum-wrap' +
      animClass +
      hoverClass +
      '" id="pendulum-' +
      id +
      '" data-count="' +
      (p.count || 15) +
      '" data-amplitude="' +
      (p.amplitude || 80) +
      '" data-speed="' +
      (p.speed || 1) +
      '" data-color="' +
      (p.color || "#cdfe00") +
      '" data-pendulum-length="' +
      (p.pendulumLength || 100) +
      '" data-bob-size="' +
      (p.bobSize || 6) +
      '" data-line-width="' +
      (p.lineWidth || 1) +
      '" data-line-color="' +
      (p.lineColor || "#555555") +
      '" data-color-mode="' +
      (p.colorMode || "single") +
      '" data-show-trail="' +
      (p.showTrail ? "true" : "false") +
      '" data-trail-length="' +
      (p.trailLength || 20) +
      '" data-gravity="' +
      (p.gravity || 1) +
      '" data-layout="' +
      (p.layout || "bottom") +
      '" data-bob-shape="' +
      (p.bobShape || "circle") +
      '" data-glow="' +
      (p.glow ? "true" : "false") +
      '" data-wave-mode="' +
      (p.waveMode || "sine") +
      '" data-color2="' +
      (p.color2 || "#3b82f6") +
      '" style="height:' +
      p.height +
      "px;" +
      bgStyle +
      "position:relative;overflow:hidden;border-radius:" +
      (p.borderRadius || 4) +
      "px;" +
      containerBorder +
      containerShadow +
      padStyle +
      margStyle +
      opStyle +
      '"><canvas class="veltro-pendulum-canvas" style="position:absolute;inset:0;width:100%;height:100%" data-pendulum-init="1"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Core Settings</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Count</label><input type="number" value="' +
      (p.count || 15) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','count',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Amplitude</label><input type="number" value="' +
      (p.amplitude || 80) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','amplitude',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Speed</label><input type="number" step="0.1" value="' +
      (p.speed || 1) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','speed',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Color</label><input type="color" value="' +
      (p.color || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color',this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Background & Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      ((p.bgType || "solid") === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      ((p.bgType || "solid") === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      ((p.bgType || "solid") === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if ((p.bgType || "solid") === "solid") {
      html +=
        '<div class="rp-row"><label>Background Color</label><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        ((p.bgGradientDir || "135deg") === "135deg" ? " selected" : "") +
        '>135°</option><option value="to right"' +
        ((p.bgGradientDir || "135deg") === "to right" ? " selected" : "") +
        '>Left→Right</option><option value="to bottom"' +
        ((p.bgGradientDir || "135deg") === "to bottom" ? " selected" : "") +
        '>Top→Bottom</option><option value="circle"' +
        ((p.bgGradientDir || "135deg") === "circle" ? " selected" : "") +
        ">Radial</option></select></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a1a3e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImageUrl || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageUrl',this.value)\" placeholder=\"https://...\"></div>";
      html +=
        '<div class="rp-row"><label>Image Opacity (%)</label><input type="number" min="0" max="100" value="' +
        (p.bgImageOpacity || 30) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageOpacity',+this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Image Size</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageSize',this.value)\"><option value=\"cover\"" +
        ((p.bgImageSize || "cover") === "cover" ? " selected" : "") +
        '>Cover</option><option value="contain"' +
        ((p.bgImageSize || "cover") === "contain" ? " selected" : "") +
        '>Contain</option><option value="100% 100%"' +
        ((p.bgImageSize || "cover") === "100% 100%" ? " selected" : "") +
        ">Stretch</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius (px)</label><input type="number" value="' +
      (p.borderRadius || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width (px)</label><input type="number" value="' +
      (p.borderWidth || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Color</label><input type="color" value="' +
      (p.borderColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Box Shadow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','boxShadow',this.value)\"><option value=\"none\"" +
      ((p.boxShadow || "none") === "none" ? " selected" : "") +
      '>None</option><option value="soft"' +
      ((p.boxShadow || "none") === "soft" ? " selected" : "") +
      '>Soft</option><option value="hard"' +
      ((p.boxShadow || "none") === "hard" ? " selected" : "") +
      '>Hard</option><option value="glow"' +
      ((p.boxShadow || "none") === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    if (p.boxShadow && p.boxShadow !== "none") {
      html +=
        '<div class="rp-row"><label>Shadow Color</label><input type="color" value="' +
        (p.shadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur</label><input type="number" value="' +
        (p.shadowBlur || 10) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Spacing & Display</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Padding V (px)</label><input type="number" value="' +
      (p.paddingV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H (px)</label><input type="number" value="' +
      (p.paddingH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin V (px)</label><input type="number" value="' +
      (p.marginV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin H (px)</label><input type="number" value="' +
      (p.marginH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animations & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      ((p.entranceAnim || "none") === "none" ? " selected" : "") +
      '>None</option><option value="fade-in"' +
      ((p.entranceAnim || "none") === "fade-in" ? " selected" : "") +
      '>Fade In</option><option value="slide-up"' +
      ((p.entranceAnim || "none") === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="slide-left"' +
      ((p.entranceAnim || "none") === "slide-left" ? " selected" : "") +
      '>Slide Left</option><option value="zoom-in"' +
      ((p.entranceAnim || "none") === "zoom-in" ? " selected" : "") +
      '>Zoom In</option><option value="flip-in"' +
      ((p.entranceAnim || "none") === "flip-in" ? " selected" : "") +
      ">Flip In</option></select></div>";
    html +=
      '<div class="rp-row"><label>Animation Duration (ms)</label><input type="number" value="' +
      (p.animDuration || 600) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','animDuration',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      ((p.hoverEffect || "none") === "none" ? " selected" : "") +
      '>None</option><option value="lift"' +
      ((p.hoverEffect || "none") === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      ((p.hoverEffect || "none") === "glow" ? " selected" : "") +
      '>Glow</option><option value="scale"' +
      ((p.hoverEffect || "none") === "scale" ? " selected" : "") +
      '>Scale</option><option value="tilt"' +
      ((p.hoverEffect || "none") === "tilt" ? " selected" : "") +
      ">Tilt</option></select></div>";
    html +=
      '<div class="rp-row"><label>Hover Transition (ms)</label><input type="number" value="' +
      (p.hoverTransition || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverTransition',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Appearance & Behaviour</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Layout</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','layout',this.value)\"><option value=\"bottom\"" +
      ((p.layout || "bottom") === "bottom" ? " selected" : "") +
      '>Hanging (top anchor)</option><option value="center"' +
      ((p.layout || "bottom") === "center" ? " selected" : "") +
      '>Radial (center)</option><option value="scattered"' +
      ((p.layout || "bottom") === "scattered" ? " selected" : "") +
      ">Scattered</option></select></div>";
    html +=
      '<div class="rp-row"><label>Bob Shape</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bobShape',this.value)\"><option value=\"circle\"" +
      ((p.bobShape || "circle") === "circle" ? " selected" : "") +
      '>Circle</option><option value="ring"' +
      ((p.bobShape || "circle") === "ring" ? " selected" : "") +
      '>Ring</option><option value="diamond"' +
      ((p.bobShape || "circle") === "diamond" ? " selected" : "") +
      '>Diamond</option><option value="drop"' +
      ((p.bobShape || "circle") === "drop" ? " selected" : "") +
      ">Drop</option></select></div>";
    html +=
      '<div class="rp-row"><label>Wave Mode</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','waveMode',this.value)\"><option value=\"sine\"" +
      ((p.waveMode || "sine") === "sine" ? " selected" : "") +
      '>Sine Wave</option><option value="progressive"' +
      ((p.waveMode || "sine") === "progressive" ? " selected" : "") +
      '>Progressive</option><option value="chaos"' +
      ((p.waveMode || "sine") === "chaos" ? " selected" : "") +
      '>Chaos</option><option value="bounce"' +
      ((p.waveMode || "sine") === "bounce" ? " selected" : "") +
      ">Bounce</option></select></div>";
    html +=
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.glow ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','glow',this.checked)\"> Glow</label></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Advanced Pendulum Options</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Pendulum Length</label><input type="number" value="' +
      (p.pendulumLength || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','pendulumLength',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Bob Size</label><input type="number" value="' +
      (p.bobSize || 6) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bobSize',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Line Width</label><input type="number" step="0.5" value="' +
      (p.lineWidth || 1) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','lineWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Line Color</label><input type="color" value="' +
      (p.lineColor || "#555555") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','lineColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Color Mode</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','colorMode',this.value)\"><option value=\"single\"" +
      ((p.colorMode || "single") === "single" ? " selected" : "") +
      '>Single</option><option value="gradient"' +
      ((p.colorMode || "single") === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="rainbow"' +
      ((p.colorMode || "single") === "rainbow" ? " selected" : "") +
      ">Rainbow</option></select></div>";
    if (p.colorMode === "gradient") {
      html +=
        '<div class="rp-row"><label>Color 2</label><input type="color" value="' +
        (p.color2 || "#3b82f6") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','color2',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Show Trail</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','showTrail',this.value)\"><option value=\"false\"" +
      (!p.showTrail ? " selected" : "") +
      '>Off</option><option value="true"' +
      (p.showTrail ? " selected" : "") +
      ">On</option></select></div>";
    if (p.showTrail) {
      html +=
        '<div class="rp-row"><label>Trail Length</label><input type="number" value="' +
        (p.trailLength || 20) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','trailLength',+this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Gravity</label><input type="number" step="0.1" value="' +
      (p.gravity || 1) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','gravity',+this.value)\"></div>";
    html += "</div></div>";
    return html;
  },
});

// 6. Collision Chaos
FB.widgets.register("collisionChaos", {
  label: "Collision Chaos",
  sublabel: "Physics sandbox",
  icon: "✦",
  iconBg: "#1a1a0d",
  iconColor: "#fbbf24",
  category: "veltro",
  subCategory: "physics",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    spawnRate: 1,
    gravity: 1,
    restitution: 0.7,
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a1a3e",
    bgImageUrl: "",
    bgImageOpacity: 30,
    bgImageSize: "cover",
    borderRadius: 4,
    borderWidth: 0,
    borderColor: "#ffffff",
    boxShadow: "none",
    shadowColor: "#000000",
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    paddingV: 0,
    paddingH: 0,
    marginV: 0,
    marginH: 0,
    opacity: 100,
    entranceAnim: "none",
    hoverEffect: "none",
    hoverTransition: 300,
    animDuration: 600,
    ballShape: "circle",
    ballColors: "#ff6b35,#cdfe00,#3b82f6,#ec4899,#f59e0b",
    ballMinSize: 10,
    ballMaxSize: 30,
    maxBalls: 50,
    ballGlow: true,
    glowColor: "#fbbf24",
    friction: 0.99,
    ballStyle: "glass",
    trailLength: 40,
    spawnOnClick: true,
  },
  render: function (p) {
    var id = p._blockId || "chaos";
    var bgType = p.bgType || "solid";
    var bgStyle = "";
    if (bgType === "gradient") {
      bgStyle =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a1a3e") +
        ");";
    } else if (bgType === "image" && p.bgImageUrl) {
      bgStyle =
        "background:url('" +
        p.bgImageUrl +
        "') center/" +
        (p.bgImageSize || "cover") +
        " no-repeat;background-color:" +
        (p.bg || "#0d0d1a") +
        ";";
    } else {
      bgStyle = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth && p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px solid " +
        (p.borderColor || "#ffffff") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow && p.boxShadow !== "none") {
      containerShadow =
        "box-shadow:" +
        (p.shadowOffsetX || 0) +
        "px " +
        (p.shadowOffsetY || 4) +
        "px " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowColor || "#000000") +
        ";";
    }
    var hoverClass = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
    }
    var animClass = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
    }
    var padStyle =
      "padding:" + (p.paddingV || 0) + "px " + (p.paddingH || 0) + "px;";
    var margStyle =
      "margin:" + (p.marginV || 0) + "px " + (p.marginH || 0) + "px;";
    var opStyle =
      p.opacity && p.opacity < 100 ? "opacity:" + p.opacity / 100 + ";" : "";
    return (
      '<div class="veltro-chaos-wrap' +
      animClass +
      hoverClass +
      '" id="chaos-' +
      id +
      '" data-spawn-rate="' +
      (p.spawnRate || 1) +
      '" data-gravity="' +
      (p.gravity || 1) +
      '" data-restitution="' +
      (p.restitution || 0.7) +
      '" data-ball-shape="' +
      (p.ballShape || "circle") +
      '" data-ball-colors="' +
      (p.ballColors || "#ff6b35,#cdfe00,#3b82f6,#ec4899,#f59e0b") +
      '" data-ball-min-size="' +
      (p.ballMinSize || 10) +
      '" data-ball-max-size="' +
      (p.ballMaxSize || 30) +
      '" data-max-balls="' +
      (p.maxBalls || 50) +
      '" data-ball-glow="' +
      (p.ballGlow ? "true" : "false") +
      '" data-glow-color="' +
      (p.glowColor || "#fbbf24") +
      '" data-friction="' +
      (p.friction || 0.99) +
      '" data-ball-style="' +
      (p.ballStyle || "glass") +
      '" data-trail-length="' +
      (p.trailLength !== undefined ? p.trailLength : 40) +
      '" data-spawn-on-click="' +
      (p.spawnOnClick !== false ? "true" : "false") +
      '" style="height:' +
      p.height +
      "px;" +
      bgStyle +
      "position:relative;overflow:hidden;border-radius:" +
      (p.borderRadius || 4) +
      "px;cursor:pointer;" +
      containerBorder +
      containerShadow +
      padStyle +
      margStyle +
      opStyle +
      '"><canvas class="veltro-chaos-canvas" style="position:absolute;inset:0;width:100%;height:100%" data-chaos-init="1"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Core Settings</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Spawn Rate</label><input type="number" step="0.1" value="' +
      (p.spawnRate || 1) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','spawnRate',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Gravity</label><input type="number" step="0.1" value="' +
      (p.gravity || 1) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','gravity',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Restitution</label><input type="number" step="0.05" min="0" max="1" value="' +
      (p.restitution || 0.7) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','restitution',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Background & Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      ((p.bgType || "solid") === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      ((p.bgType || "solid") === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      ((p.bgType || "solid") === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if ((p.bgType || "solid") === "solid") {
      html +=
        '<div class="rp-row"><label>Background Color</label><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        ((p.bgGradientDir || "135deg") === "135deg" ? " selected" : "") +
        '>135°</option><option value="to right"' +
        ((p.bgGradientDir || "135deg") === "to right" ? " selected" : "") +
        '>Left→Right</option><option value="to bottom"' +
        ((p.bgGradientDir || "135deg") === "to bottom" ? " selected" : "") +
        '>Top→Bottom</option><option value="circle"' +
        ((p.bgGradientDir || "135deg") === "circle" ? " selected" : "") +
        ">Radial</option></select></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a1a3e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImageUrl || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageUrl',this.value)\" placeholder=\"https://...\"></div>";
      html +=
        '<div class="rp-row"><label>Image Opacity (%)</label><input type="number" min="0" max="100" value="' +
        (p.bgImageOpacity || 30) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageOpacity',+this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Image Size</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageSize',this.value)\"><option value=\"cover\"" +
        ((p.bgImageSize || "cover") === "cover" ? " selected" : "") +
        '>Cover</option><option value="contain"' +
        ((p.bgImageSize || "cover") === "contain" ? " selected" : "") +
        '>Contain</option><option value="100% 100%"' +
        ((p.bgImageSize || "cover") === "100% 100%" ? " selected" : "") +
        ">Stretch</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius (px)</label><input type="number" value="' +
      (p.borderRadius || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width (px)</label><input type="number" value="' +
      (p.borderWidth || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Color</label><input type="color" value="' +
      (p.borderColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Box Shadow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','boxShadow',this.value)\"><option value=\"none\"" +
      ((p.boxShadow || "none") === "none" ? " selected" : "") +
      '>None</option><option value="soft"' +
      ((p.boxShadow || "none") === "soft" ? " selected" : "") +
      '>Soft</option><option value="hard"' +
      ((p.boxShadow || "none") === "hard" ? " selected" : "") +
      '>Hard</option><option value="glow"' +
      ((p.boxShadow || "none") === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    if (p.boxShadow && p.boxShadow !== "none") {
      html +=
        '<div class="rp-row"><label>Shadow Color</label><input type="color" value="' +
        (p.shadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur</label><input type="number" value="' +
        (p.shadowBlur || 10) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Spacing & Display</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Padding V (px)</label><input type="number" value="' +
      (p.paddingV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H (px)</label><input type="number" value="' +
      (p.paddingH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin V (px)</label><input type="number" value="' +
      (p.marginV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin H (px)</label><input type="number" value="' +
      (p.marginH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animations & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      ((p.entranceAnim || "none") === "none" ? " selected" : "") +
      '>None</option><option value="fade-in"' +
      ((p.entranceAnim || "none") === "fade-in" ? " selected" : "") +
      '>Fade In</option><option value="slide-up"' +
      ((p.entranceAnim || "none") === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="slide-left"' +
      ((p.entranceAnim || "none") === "slide-left" ? " selected" : "") +
      '>Slide Left</option><option value="zoom-in"' +
      ((p.entranceAnim || "none") === "zoom-in" ? " selected" : "") +
      '>Zoom In</option><option value="flip-in"' +
      ((p.entranceAnim || "none") === "flip-in" ? " selected" : "") +
      ">Flip In</option></select></div>";
    html +=
      '<div class="rp-row"><label>Animation Duration (ms)</label><input type="number" value="' +
      (p.animDuration || 600) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','animDuration',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      ((p.hoverEffect || "none") === "none" ? " selected" : "") +
      '>None</option><option value="lift"' +
      ((p.hoverEffect || "none") === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      ((p.hoverEffect || "none") === "glow" ? " selected" : "") +
      '>Glow</option><option value="scale"' +
      ((p.hoverEffect || "none") === "scale" ? " selected" : "") +
      '>Scale</option><option value="tilt"' +
      ((p.hoverEffect || "none") === "tilt" ? " selected" : "") +
      ">Tilt</option></select></div>";
    html +=
      '<div class="rp-row"><label>Hover Transition (ms)</label><input type="number" value="' +
      (p.hoverTransition || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverTransition',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Advanced Chaos Options</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Ball Shape</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','ballShape',this.value)\"><option value=\"circle\"" +
      ((p.ballShape || "circle") === "circle" ? " selected" : "") +
      '>Circle</option><option value="square"' +
      ((p.ballShape || "circle") === "square" ? " selected" : "") +
      '>Square</option><option value="triangle"' +
      ((p.ballShape || "circle") === "triangle" ? " selected" : "") +
      '>Triangle</option><option value="mixed"' +
      ((p.ballShape || "circle") === "mixed" ? " selected" : "") +
      ">Mixed</option></select></div>";
    html +=
      '<div class="rp-row"><label>Ball Colors (comma-sep)</label><input type="text" value="' +
      (p.ballColors || "#ff6b35,#cdfe00,#3b82f6,#ec4899,#f59e0b") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','ballColors',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Ball Min Size</label><input type="number" value="' +
      (p.ballMinSize || 10) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','ballMinSize',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Ball Max Size</label><input type="number" value="' +
      (p.ballMaxSize || 30) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','ballMaxSize',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Max Balls</label><input type="number" value="' +
      (p.maxBalls || 50) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','maxBalls',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Ball Glow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','ballGlow',this.value)\"><option value=\"false\"" +
      (!p.ballGlow ? " selected" : "") +
      '>Off</option><option value="true"' +
      (p.ballGlow ? " selected" : "") +
      ">On</option></select></div>";
    if (p.ballGlow) {
      html +=
        '<div class="rp-row"><label>Glow Color</label><input type="color" value="' +
        (p.glowColor || "#fbbf24") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowColor',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Friction</label><input type="number" step="0.005" min="0.9" max="1" value="' +
      (p.friction || 0.99) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','friction',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Ball Style</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','ballStyle',this.value)\"><option value=\"glass\"" +
      ((p.ballStyle || "glass") === "glass" ? " selected" : "") +
      '>Glass</option><option value="solid"' +
      ((p.ballStyle || "glass") === "solid" ? " selected" : "") +
      '>Solid</option><option value="neon"' +
      ((p.ballStyle || "glass") === "neon" ? " selected" : "") +
      ">Neon</option></select></div>";
    html +=
      '<div class="rp-row"><label>Trail Length</label><input type="number" min="0" max="100" value="' +
      (p.trailLength !== undefined ? p.trailLength : 40) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','trailLength',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Spawn on Click</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','spawnOnClick',this.value==='true')\"><option value=\"true\"" +
      (p.spawnOnClick !== false ? " selected" : "") +
      '>On</option><option value="false"' +
      (p.spawnOnClick === false ? " selected" : "") +
      ">Off</option></select></div>";
    html += "</div></div>";
    return html;
  },
});

// 7. Black Hole
FB.widgets.register("blackHole", {
  label: "Black Hole",
  sublabel: "Gravitational singularity",
  icon: "◉",
  iconBg: "#050510",
  iconColor: "#7c3aed",
  category: "veltro",
  subCategory: "physics",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    particleCount: 150,
    pullStrength: 0.5,
    accretionColor: "#ff6b35",
    bgType: "solid",
    bgGradientDir: "135deg",
    bgGradientColor1: "#0d0d1a",
    bgGradientColor2: "#1a1a3e",
    bgImageUrl: "",
    bgImageOpacity: 30,
    bgImageSize: "cover",
    borderRadius: 4,
    borderWidth: 0,
    borderColor: "#ffffff",
    boxShadow: "none",
    shadowColor: "#000000",
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
    paddingV: 0,
    paddingH: 0,
    marginV: 0,
    marginH: 0,
    opacity: 100,
    entranceAnim: "none",
    hoverEffect: "none",
    hoverTransition: 300,
    animDuration: 600,
    blackHoleSize: 30,
    eventHorizon: 50,
    particleSize: 2,
    particleTrail: true,
    accretionDisk: true,
    diskOpacity: 60,
    particleGlow: true,
    glowColor: "#ff6b35",
    jetEnabled: false,
    jetColor: "#7c3aed",
  },
  render: function (p) {
    var id = p._blockId || "bh";
    var bgType = p.bgType || "solid";
    var bgStyle = "";
    if (bgType === "gradient") {
      bgStyle =
        "background:linear-gradient(" +
        (p.bgGradientDir || "135deg") +
        "," +
        (p.bgGradientColor1 || "#0d0d1a") +
        "," +
        (p.bgGradientColor2 || "#1a1a3e") +
        ");";
    } else if (bgType === "image" && p.bgImageUrl) {
      bgStyle =
        "background:url('" +
        p.bgImageUrl +
        "') center/" +
        (p.bgImageSize || "cover") +
        " no-repeat;background-color:" +
        (p.bg || "#0d0d1a") +
        ";";
    } else {
      bgStyle = "background:" + (p.bg || "#0d0d1a") + ";";
    }
    var containerBorder = "";
    if (p.borderWidth && p.borderWidth > 0) {
      containerBorder =
        "border:" +
        p.borderWidth +
        "px solid " +
        (p.borderColor || "#ffffff") +
        ";";
    }
    var containerShadow = "";
    if (p.boxShadow && p.boxShadow !== "none") {
      containerShadow =
        "box-shadow:" +
        (p.shadowOffsetX || 0) +
        "px " +
        (p.shadowOffsetY || 4) +
        "px " +
        (p.shadowBlur || 10) +
        "px " +
        (p.shadowColor || "#000000") +
        ";";
    }
    var hoverClass = "";
    if (p.hoverEffect && p.hoverEffect !== "none") {
      hoverClass = " veltro-hover-" + p.hoverEffect;
    }
    var animClass = "";
    if (p.entranceAnim && p.entranceAnim !== "none") {
      animClass = " veltro-anim-" + p.entranceAnim;
    }
    var padStyle =
      "padding:" + (p.paddingV || 0) + "px " + (p.paddingH || 0) + "px;";
    var margStyle =
      "margin:" + (p.marginV || 0) + "px " + (p.marginH || 0) + "px;";
    var opStyle =
      p.opacity && p.opacity < 100 ? "opacity:" + p.opacity / 100 + ";" : "";
    return (
      '<div class="veltro-blackhole-wrap' +
      animClass +
      hoverClass +
      '" id="blackhole-' +
      id +
      '" data-particle-count="' +
      (p.particleCount || 150) +
      '" data-pull-strength="' +
      (p.pullStrength || 0.5) +
      '" data-accretion-color="' +
      (p.accretionColor || "#ff6b35") +
      '" data-black-hole-size="' +
      (p.blackHoleSize || 30) +
      '" data-event-horizon="' +
      (p.eventHorizon || 50) +
      '" data-particle-size="' +
      (p.particleSize || 2) +
      '" data-particle-trail="' +
      (p.particleTrail !== false ? "true" : "false") +
      '" data-accretion-disk="' +
      (p.accretionDisk !== false ? "true" : "false") +
      '" data-disk-opacity="' +
      (p.diskOpacity || 60) +
      '" data-particle-glow="' +
      (p.particleGlow !== false ? "true" : "false") +
      '" data-glow-color="' +
      (p.glowColor || "#ff6b35") +
      '" data-jet-enabled="' +
      (p.jetEnabled ? "true" : "false") +
      '" data-jet-color="' +
      (p.jetColor || "#7c3aed") +
      '" style="height:' +
      p.height +
      "px;" +
      bgStyle +
      "position:relative;overflow:hidden;border-radius:" +
      (p.borderRadius || 4) +
      "px;" +
      containerBorder +
      containerShadow +
      padStyle +
      margStyle +
      opStyle +
      '"><canvas class="veltro-blackhole-canvas" style="position:absolute;inset:0;width:100%;height:100%" data-blackhole-init="1"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var html = "";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Core Settings</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Count</label><input type="number" value="' +
      (p.particleCount || 150) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleCount',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Pull Strength</label><input type="number" step="0.05" min="0" max="2" value="' +
      (p.pullStrength || 0.5) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','pullStrength',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Accretion Color</label><input type="color" value="' +
      (p.accretionColor || "#ff6b35") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','accretionColor',this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Background & Container</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Background Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgType',this.value)\"><option value=\"solid\"" +
      ((p.bgType || "solid") === "solid" ? " selected" : "") +
      '>Solid</option><option value="gradient"' +
      ((p.bgType || "solid") === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="image"' +
      ((p.bgType || "solid") === "image" ? " selected" : "") +
      ">Image</option></select></div>";
    if ((p.bgType || "solid") === "solid") {
      html +=
        '<div class="rp-row"><label>Background Color</label><input type="color" value="' +
        (p.bg || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bg',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "gradient") {
      html +=
        '<div class="rp-row"><label>Gradient Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientDir',this.value)\"><option value=\"135deg\"" +
        ((p.bgGradientDir || "135deg") === "135deg" ? " selected" : "") +
        '>135°</option><option value="to right"' +
        ((p.bgGradientDir || "135deg") === "to right" ? " selected" : "") +
        '>Left→Right</option><option value="to bottom"' +
        ((p.bgGradientDir || "135deg") === "to bottom" ? " selected" : "") +
        '>Top→Bottom</option><option value="circle"' +
        ((p.bgGradientDir || "135deg") === "circle" ? " selected" : "") +
        ">Radial</option></select></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 1</label><input type="color" value="' +
        (p.bgGradientColor1 || "#0d0d1a") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor1',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Gradient Color 2</label><input type="color" value="' +
        (p.bgGradientColor2 || "#1a1a3e") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgGradientColor2',this.value)\"></div>";
    }
    if ((p.bgType || "solid") === "image") {
      html +=
        '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
        (p.bgImageUrl || "") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageUrl',this.value)\" placeholder=\"https://...\"></div>";
      html +=
        '<div class="rp-row"><label>Image Opacity (%)</label><input type="number" min="0" max="100" value="' +
        (p.bgImageOpacity || 30) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageOpacity',+this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Image Size</label><select onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','bgImageSize',this.value)\"><option value=\"cover\"" +
        ((p.bgImageSize || "cover") === "cover" ? " selected" : "") +
        '>Cover</option><option value="contain"' +
        ((p.bgImageSize || "cover") === "contain" ? " selected" : "") +
        '>Contain</option><option value="100% 100%"' +
        ((p.bgImageSize || "cover") === "100% 100%" ? " selected" : "") +
        ">Stretch</option></select></div>";
    }
    html +=
      '<div class="rp-row"><label>Border Radius (px)</label><input type="number" value="' +
      (p.borderRadius || 4) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderRadius',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Width (px)</label><input type="number" value="' +
      (p.borderWidth || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderWidth',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Border Color</label><input type="color" value="' +
      (p.borderColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderColor',this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Box Shadow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','boxShadow',this.value)\"><option value=\"none\"" +
      ((p.boxShadow || "none") === "none" ? " selected" : "") +
      '>None</option><option value="soft"' +
      ((p.boxShadow || "none") === "soft" ? " selected" : "") +
      '>Soft</option><option value="hard"' +
      ((p.boxShadow || "none") === "hard" ? " selected" : "") +
      '>Hard</option><option value="glow"' +
      ((p.boxShadow || "none") === "glow" ? " selected" : "") +
      ">Glow</option></select></div>";
    if (p.boxShadow && p.boxShadow !== "none") {
      html +=
        '<div class="rp-row"><label>Shadow Color</label><input type="color" value="' +
        (p.shadowColor || "#000000") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowColor',this.value)\"></div>";
      html +=
        '<div class="rp-row"><label>Shadow Blur</label><input type="number" value="' +
        (p.shadowBlur || 10) +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','shadowBlur',+this.value)\"></div>";
    }
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Spacing & Display</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Padding V (px)</label><input type="number" value="' +
      (p.paddingV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Padding H (px)</label><input type="number" value="' +
      (p.paddingH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','paddingH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin V (px)</label><input type="number" value="' +
      (p.marginV || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginV',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Margin H (px)</label><input type="number" value="' +
      (p.marginH || 0) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','marginH',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.opacity || 100) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','opacity',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Animations & Effects</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Entrance Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','entranceAnim',this.value)\"><option value=\"none\"" +
      ((p.entranceAnim || "none") === "none" ? " selected" : "") +
      '>None</option><option value="fade-in"' +
      ((p.entranceAnim || "none") === "fade-in" ? " selected" : "") +
      '>Fade In</option><option value="slide-up"' +
      ((p.entranceAnim || "none") === "slide-up" ? " selected" : "") +
      '>Slide Up</option><option value="slide-left"' +
      ((p.entranceAnim || "none") === "slide-left" ? " selected" : "") +
      '>Slide Left</option><option value="zoom-in"' +
      ((p.entranceAnim || "none") === "zoom-in" ? " selected" : "") +
      '>Zoom In</option><option value="flip-in"' +
      ((p.entranceAnim || "none") === "flip-in" ? " selected" : "") +
      ">Flip In</option></select></div>";
    html +=
      '<div class="rp-row"><label>Animation Duration (ms)</label><input type="number" value="' +
      (p.animDuration || 600) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','animDuration',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Hover Effect</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverEffect',this.value)\"><option value=\"none\"" +
      ((p.hoverEffect || "none") === "none" ? " selected" : "") +
      '>None</option><option value="lift"' +
      ((p.hoverEffect || "none") === "lift" ? " selected" : "") +
      '>Lift</option><option value="glow"' +
      ((p.hoverEffect || "none") === "glow" ? " selected" : "") +
      '>Glow</option><option value="scale"' +
      ((p.hoverEffect || "none") === "scale" ? " selected" : "") +
      '>Scale</option><option value="tilt"' +
      ((p.hoverEffect || "none") === "tilt" ? " selected" : "") +
      ">Tilt</option></select></div>";
    html +=
      '<div class="rp-row"><label>Hover Transition (ms)</label><input type="number" value="' +
      (p.hoverTransition || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','hoverTransition',+this.value)\"></div>";
    html += "</div></div>";
    html +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Advanced Black Hole Options</span></div><div class="rp-section-body">';
    html +=
      '<div class="rp-row"><label>Black Hole Size</label><input type="number" value="' +
      (p.blackHoleSize || 30) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','blackHoleSize',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Event Horizon</label><input type="number" value="' +
      (p.eventHorizon || 50) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','eventHorizon',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Size</label><input type="number" value="' +
      (p.particleSize || 2) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleSize',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Trail</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleTrail',this.value)\"><option value=\"true\"" +
      (p.particleTrail !== false ? " selected" : "") +
      '>Enabled</option><option value="false"' +
      (p.particleTrail === false ? " selected" : "") +
      ">Disabled</option></select></div>";
    html +=
      '<div class="rp-row"><label>Accretion Disk</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','accretionDisk',this.value)\"><option value=\"true\"" +
      (p.accretionDisk !== false ? " selected" : "") +
      '>Enabled</option><option value="false"' +
      (p.accretionDisk === false ? " selected" : "") +
      ">Disabled</option></select></div>";
    html +=
      '<div class="rp-row"><label>Disk Opacity (%)</label><input type="number" min="0" max="100" value="' +
      (p.diskOpacity || 60) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','diskOpacity',+this.value)\"></div>";
    html +=
      '<div class="rp-row"><label>Particle Glow</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','particleGlow',this.value)\"><option value=\"true\"" +
      (p.particleGlow !== false ? " selected" : "") +
      '>On</option><option value="false"' +
      (p.particleGlow === false ? " selected" : "") +
      ">Off</option></select></div>";
    if (p.particleGlow !== false) {
      html +=
        '<div class="rp-row"><label>Glow Color</label><input type="color" value="' +
        (p.glowColor || "#ff6b35") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','glowColor',this.value)\"></div>";
    }
    html +=
      '<div class="rp-row"><label>Jet Enabled</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','jetEnabled',this.value)\"><option value=\"false\"" +
      (!p.jetEnabled ? " selected" : "") +
      '>Off</option><option value="true"' +
      (p.jetEnabled ? " selected" : "") +
      ">On</option></select></div>";
    if (p.jetEnabled) {
      html +=
        '<div class="rp-row"><label>Jet Color</label><input type="color" value="' +
        (p.jetColor || "#7c3aed") +
        '" onchange="FB.panels.updateWidgetProp(\'' +
        id +
        "','jetColor',this.value)\"></div>";
    }
    html += "</div></div>";
    return html;
  },
});

// ── VELTRO ENGINE BATCH 4: SCROLL & MOTION (4 NEW WIDGETS) ──
// 1. Parallax Depth
FB.widgets.register("parallaxDepth", {
  label: "Parallax Depth",
  sublabel: "Multi-layer parallax",
  icon: "▣",
  iconBg: "#0d1a2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "scroll",
  defaultProps: { height: 500, bg: "#0d0d1a", layerCount: 5, speed: 0.5 },
  render: function (p) {
    var id = p._blockId || "parDepth";
    var layersHtml = "";
    for (var i = 0; i < (p.layerCount || 5); i++) {
      var depth = (i + 1) / (p.layerCount || 5);
      layersHtml +=
        '<div class="veltro-parallax-layer" data-depth="' +
        depth +
        '" style="position:absolute;inset:0;opacity:' +
        (0.1 + depth * 0.4) +
        ";background:radial-gradient(circle at " +
        (20 + i * 15) +
        "% " +
        (30 + i * 10) +
        "%,rgba(205,254,0," +
        (0.05 + depth * 0.15) +
        ') 0%,transparent 60%)\"></div>';
    }
    return (
      '<div class="veltro-parallax-depth-wrap" id="pardepth-' +
      id +
      '" data-speed="' +
      p.speed +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px">' +
      layersHtml +
      '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:10"><h2 style="color:#fff;font-size:3rem;font-weight:800;margin:0">DEPTH</h2></div></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 500) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Layer Count</label><input type="range" min="2" max="10" step="1" value="' +
      (p.layerCount || 5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','layerCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Parallax Speed</label><input type="range" min="0.1" max="2" step="0.1" value="' +
      (p.speed || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','speed',+this.value)\"></div>";
    return h;
  },
});

// 2. Scroll-Triggered Reveals
FB.widgets.register("scrollTriggered", {
  label: "Scroll-Triggered Reveals",
  sublabel: "Elements animate on scroll",
  icon: "✦",
  iconBg: "#1a0d1a",
  iconColor: "#f472b6",
  category: "veltro",
  subCategory: "scroll",
  defaultProps: {
    height: 500,
    bg: "#0d0d1a",
    animationType: "fadeUp",
    stagger: 100,
    duration: 800,
  },
  render: function (p) {
    var id = p._blockId || "scrollTrig";
    var items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];
    var itemsHtml = items
      .map(function (item, i) {
        return (
          '<div class="veltro-scroll-reveal-item" data-index="' +
          i +
          '" style="padding:20px;margin:10px;background:rgba(255,255,255,0.05);border-radius:8px;opacity:0;transform:translateY(30px);transition:opacity ' +
          p.duration +
          "ms ease,transform " +
          p.duration +
          'ms ease">' +
          item +
          "</div>"
        );
      })
      .join("");
    return (
      '<div class="veltro-scroll-reveal-wrap" id="scrolltrig-' +
      id +
      '" data-animation-type="' +
      p.animationType +
      '" data-stagger="' +
      p.stagger +
      '" data-duration="' +
      p.duration +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;overflow-y:auto;padding:20px">' +
      itemsHtml +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 500) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Animation</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','animationType',this.value)\"><option value=\"fadeUp\"" +
      ((p.animationType || "fadeUp") === "fadeUp" ? " selected" : "") +
      '>Fade Up</option><option value="fadeIn"' +
      (p.animationType === "fadeIn" ? " selected" : "") +
      '>Fade In</option><option value="slideLeft"' +
      (p.animationType === "slideLeft" ? " selected" : "") +
      '>Slide Left</option><option value="scaleUp"' +
      (p.animationType === "scaleUp" ? " selected" : "") +
      ">Scale Up</option></select></div>";
    h +=
      '<div class="rp-row"><label>Stagger (ms)</label><input type="range" min="0" max="400" step="20" value="' +
      (p.stagger || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','stagger',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Duration (ms)</label><input type="range" min="200" max="2000" step="100" value="' +
      (p.duration || 800) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','duration',+this.value)\"></div>";
    return h;
  },
});

// 3. Horizontal Scroll Gallery
FB.widgets.register("horizontalScrollGallery", {
  label: "Horizontal Scroll Gallery",
  sublabel: "Smooth horizontal scrolling",
  icon: "▶",
  iconBg: "#0d1a0d",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "scroll",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    itemCount: 6,
    snap: true,
    momentum: true,
  },
  render: function (p) {
    var id = p._blockId || "hScroll";
    var itemsHtml = "";
    for (var i = 0; i < (p.itemCount || 6); i++) {
      itemsHtml +=
        '<div class="veltro-hscroll-item" style="flex:0 0 300px;height:300px;background:linear-gradient(135deg,rgba(205,254,0,0.1) 0%,rgba(60,165,250,0.1) 100%);border-radius:16px;margin-right:20px;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:800;color:#fff">' +
        (i + 1) +
        "</div>";
    }
    return (
      '<div class="veltro-hscroll-wrap" id="hscroll-' +
      id +
      '" data-snap="' +
      (p.snap !== false ? "1" : "0") +
      '" data-momentum="' +
      (p.momentum !== false ? "1" : "0") +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px"><div class="veltro-hscroll-container" style="display:flex;height:100%;align-items:center;padding:0 40px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none">' +
      itemsHtml +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Item Count</label><input type="range" min="2" max="12" step="1" value="' +
      (p.itemCount || 6) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','itemCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Snap to Items</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','snap',this.value==='true')\"><option value=\"true\"" +
      (p.snap !== false ? " selected" : "") +
      '>On</option><option value="false"' +
      (p.snap === false ? " selected" : "") +
      ">Off</option></select></div>";
    h +=
      '<div class="rp-row"><label>Momentum Scroll</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','momentum',this.value==='true')\"><option value=\"true\"" +
      (p.momentum !== false ? " selected" : "") +
      '>On</option><option value="false"' +
      (p.momentum === false ? " selected" : "") +
      ">Off</option></select></div>";
    return h;
  },
});

// 4. Velocity-Based Skew
FB.widgets.register("velocitySkew", {
  label: "Velocity-Based Skew",
  sublabel: "Rubber-band skew effect",
  icon: "⟋",
  iconBg: "#1a1a0d",
  iconColor: "#fbbf24",
  category: "veltro",
  subCategory: "scroll",
  defaultProps: { height: 400, bg: "#0d0d1a", maxSkew: 15, elasticity: 0.8 },
  render: function (p) {
    var id = p._blockId || "velSkew";
    return (
      '<div class="veltro-velskew-wrap" id="velskew-' +
      id +
      '" data-max-skew="' +
      p.maxSkew +
      '" data-elasticity="' +
      p.elasticity +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;overflow-y:auto"><div class="veltro-velskew-content" style="padding:40px" data-velskew-init="1"><div style="height:800px;display:flex;flex-direction:column;gap:20px"><div style="padding:30px;background:rgba(205,254,0,0.1);border-radius:12px"><h3 style="color:#cdfe00;margin:0">Scroll to see skew effect</h3></div><div style="padding:30px;background:rgba(60,165,250,0.1);border-radius:12px"><h3 style="color:#60a5fa;margin:0">Velocity affects skew</h3></div><div style="padding:30px;background:rgba(236,72,153,0.1);border-radius:12px"><h3 style="color:#ec4899;margin:0">Rubber band physics</h3></div><div style="padding:30px;background:rgba(251,191,36,0.1);border-radius:12px"><h3 style="color:#fbbf24;margin:0">Fast scroll = more skew</h3></div></div></div></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Max Skew (°)</label><input type="range" min="0" max="45" step="1" value="' +
      (p.maxSkew || 15) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','maxSkew',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Elasticity</label><input type="range" min="0" max="1" step="0.05" value="' +
      (p.elasticity || 0.8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','elasticity',+this.value)\"></div>";
    return h;
  },
});

// ── SCROLL FLUID (WebGL scroll-driven fluid simulation) ──
FB.widgets.register("scrollFluid", {
  label: "Scroll Fluid",
  sublabel: "Scroll-driven WebGL fluid",
  icon: "🌊",
  iconBg: "#0a1628",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "scroll",
  defaultProps: {
    height: 400,
    bg: "#050510",
    color1: "#3b82f6",
    color2: "#ec4899",
    scrollStrength: 0.5,
    cursorStrength: 0.2,
    decay: 0.99,
    intensity: 1,
    resolution: 256,
  },
  render: function (p) {
    var id = p._blockId || "sf0";
    return (
      '<div class="veltro-fluid-wrap" id="sf-' +
      id +
      '" data-color1="' +
      (p.color1 || "#3b82f6") +
      '" data-color2="' +
      (p.color2 || "#ec4899") +
      '" data-scroll-strength="' +
      (p.scrollStrength || 0.5) +
      '" data-cursor-strength="' +
      (p.cursorStrength || 0.2) +
      '" data-decay="' +
      (p.decay || 0.99) +
      '" data-intensity="' +
      (p.intensity || 1) +
      '" data-resolution="' +
      (p.resolution || 256) +
      '" style="height:' +
      (p.height || 400) +
      "px;background:" +
      (p.bg || "#050510") +
      ';position:relative;overflow:hidden;border-radius:4px"><canvas class="veltro-fluid-canvas" style="position:absolute;inset:0;width:100%;height:100%"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Color 1</label><input type="color" value="' +
      (p.color1 || "#3b82f6") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color1',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Color 2</label><input type="color" value="' +
      (p.color2 || "#ec4899") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color2',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Scroll</label><input type="range" min="0" max="2" step="0.1" value="' +
      (p.scrollStrength || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','scrollStrength',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Cursor</label><input type="range" min="0" max="1" step="0.05" value="' +
      (p.cursorStrength || 0.2) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','cursorStrength',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Decay</label><input type="range" min="0.95" max="0.999" step="0.001" value="' +
      (p.decay || 0.99) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','decay',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Intensity</label><input type="range" min="0.1" max="3" step="0.1" value="' +
      (p.intensity || 1) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','intensity',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Res</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','resolution',+this.value)\"><option value=\"128\"" +
      ((p.resolution || 256) === 128 ? " selected" : "") +
      '>128</option><option value="256"' +
      ((p.resolution || 256) === 256 ? " selected" : "") +
      '>256</option><option value="512"' +
      ((p.resolution || 256) === 512 ? " selected" : "") +
      ">512</option></select></div>";
    return h;
  },
});

// ── Direction-wheel drag helper (used by velocityFluidBg edit panel) ──
window._VfbWheelDrag = function (el, id) {
  function mv(e) {
    var r = el.getBoundingClientRect();
    var a =
      (Math.round(
        (Math.atan2(-(e.clientY - (r.top + 24)), e.clientX - (r.left + 24)) *
          180) /
          Math.PI,
      ) +
        360) %
      360;
    var inp = document.getElementById("vfb-ang-" + id);
    if (inp) inp.value = a;
    FB.panels.updateWidgetProp(id, "flowAngle", a);
    var n = el.querySelector("span");
    if (n) n.style.transform = "translateX(-50%) rotate(" + (a - 90) + "deg)";
  }
  function up() {
    window.removeEventListener("mousemove", mv);
    window.removeEventListener("mouseup", up);
  }
  window.addEventListener("mousemove", mv);
  window.addEventListener("mouseup", up);
};

FB.widgets.register("velocityFluidBg", {
  label: "Velocity Fluid BG",
  sublabel: "Scroll-reactive WebGL fluid",
  icon: "〰",
  iconBg: "#050518",
  iconColor: "#818cf8",
  category: "veltro",
  subCategory: "backgrounds",
  defaultProps: {
    height: 600,
    bg: "#050510",
    color1: "#818cf8",
    color2: "#f472b6",
    viscosityPreset: "water",
    scrollSensitivity: 1.0,
    flowAngle: 90,
    chaosEnabled: false,
    chaosFrequency: 2.0,
    resolution: 256,
  },
  render: function (p) {
    var id = p._blockId || "vfbg";
    var angle = p.flowAngle !== undefined ? p.flowAngle : 90;
    return (
      '<div class="vfbg-wrap" id="vfbg-' +
      id +
      '" data-color1="' +
      (p.color1 || "#818cf8") +
      '" data-color2="' +
      (p.color2 || "#f472b6") +
      '" data-viscosity="' +
      (p.viscosityPreset || "water") +
      '" data-sensitivity="' +
      (p.scrollSensitivity !== undefined ? p.scrollSensitivity : 1) +
      '" data-flow-angle="' +
      angle +
      '" data-chaos="' +
      (p.chaosEnabled ? "1" : "0") +
      '" data-chaos-freq="' +
      (p.chaosFrequency || 2) +
      '" data-resolution="' +
      (p.resolution || 256) +
      '" style="height:' +
      (p.height || 600) +
      "px;background:" +
      (p.bg || "#050510") +
      ';position:relative;overflow:hidden;border-radius:4px"><canvas class="vfbg-canvas" style="position:absolute;inset:0;width:100%;height:100%"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var angle = p.flowAngle !== undefined ? p.flowAngle : 90;
    var needleRot = angle - 90;
    var chaos = !!p.chaosEnabled;
    var visc = p.viscosityPreset || "water";
    var PRESETS = [
      {
        label: "Liquid Silk",
        tip: "Molten mercury — long ripple, high sensitivity",
        d: {
          viscosityPreset: "air",
          scrollSensitivity: 2.5,
          flowAngle: 90,
          chaosEnabled: false,
          chaosFrequency: 1,
          color1: "#60c8ff",
          color2: "#e879f9",
        },
      },
      {
        label: "Digital Glitch",
        tip: "Turbulent data-stream — high viscosity + chaos",
        d: {
          viscosityPreset: "glycerin",
          scrollSensitivity: 2.0,
          flowAngle: 45,
          chaosEnabled: true,
          chaosFrequency: 8,
          color1: "#00ffcc",
          color2: "#ff0066",
        },
      },
      {
        label: "Subtle Smoke",
        tip: "Quiet ink-drop ambience — minimal sensitivity",
        d: {
          viscosityPreset: "honey",
          scrollSensitivity: 0.3,
          flowAngle: 90,
          chaosEnabled: false,
          chaosFrequency: 1,
          color1: "#c4b5fd",
          color2: "#e0e7ff",
        },
      },
    ];
    var h = "";
    h +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Presets</span></div><div class="rp-section-body">';
    h +=
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-bottom:4px">';
    PRESETS.forEach(function (pre) {
      var calls = Object.keys(pre.d)
        .map(function (k) {
          return (
            "FB.panels.updateWidgetProp('" +
            id +
            "','" +
            k +
            "'," +
            JSON.stringify(pre.d[k]) +
            ")"
          );
        })
        .join(",");
      h +=
        '<button title="' +
        pre.tip +
        '" style="padding:5px 4px;font-size:10px;font-weight:600;border-radius:4px;border:1px solid rgba(129,140,248,0.3);background:rgba(129,140,248,0.08);color:#a5b4fc;cursor:pointer" onclick="(' +
        calls.replace(/"/g, "&quot;") +
        ')">' +
        pre.label +
        "</button>";
    });
    h += "</div></div></div>";
    h +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Fluid Physics</span></div><div class="rp-section-body">';
    h +=
      '<div class="rp-row"><label>Viscosity</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','viscosityPreset',this.value)\">" +
      ["air", "water", "honey", "glycerin"]
        .map(function (v) {
          return (
            '<option value="' +
            v +
            '"' +
            (visc === v ? " selected" : "") +
            ">" +
            v.charAt(0).toUpperCase() +
            v.slice(1) +
            "</option>"
          );
        })
        .join("") +
      "</select></div>";
    h +=
      '<div class="rp-row"><label>Scroll Sensitivity</label><div style="display:flex;align-items:center;gap:6px"><input type="range" min="0.1" max="3" step="0.1" value="' +
      (p.scrollSensitivity !== undefined ? p.scrollSensitivity : 1) +
      '" style="flex:1" oninput="this.nextElementSibling.textContent=this.value;FB.panels.updateWidgetProp(\'' +
      id +
      "','scrollSensitivity',+this.value)\"><span style=\"width:28px;font-size:11px;color:rgba(255,255,255,0.5)\">" +
      (p.scrollSensitivity !== undefined ? p.scrollSensitivity : 1) +
      "</span></div></div>";
    h +=
      '<div class="rp-row" style="flex-wrap:wrap"><label>Flow Direction</label><div style="display:flex;align-items:center;gap:10px;width:100%;margin-top:6px">';
    h +=
      '<div id="vfb-wheel-' +
      id +
      '" style="width:48px;height:48px;border-radius:50%;border:1px solid rgba(129,140,248,0.35);cursor:pointer;position:relative;background:rgba(129,140,248,0.06);flex-shrink:0" onmousedown="window._VfbWheelDrag(this,\'' +
      id +
      "')\">" +
      '<span style="position:absolute;top:5px;left:50%;width:2px;height:16px;background:#818cf8;border-radius:1px;transform-origin:bottom center;transform:translateX(-50%) rotate(' +
      needleRot +
      'deg)"></span>' +
      '<span style="position:absolute;bottom:5px;left:50%;width:6px;height:6px;background:#818cf8;border-radius:50%;transform:translateX(-50%)"></span>' +
      "</div>";
    h +=
      '<div style="display:flex;flex-direction:column;gap:3px"><input id="vfb-ang-' +
      id +
      '" type="number" min="0" max="360" value="' +
      angle +
      '" style="width:58px" onchange="var a=(+this.value+360)%360;FB.panels.updateWidgetProp(\'' +
      id +
      "','flowAngle',a);var w=document.getElementById('vfb-wheel-" +
      id +
      "');if(w){var n=w.querySelector('span');if(n)n.style.transform='translateX(-50%) rotate('+(a-90)+'deg)';}\">" +
      '<span style="font-size:10px;color:rgba(255,255,255,0.35)">0°=right · 90°=up</span></div>';
    h += "</div></div>";
    h +=
      '<div class="rp-row"><label>Chaos / Turbulence</label><input type="checkbox"' +
      (chaos ? " checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','chaosEnabled',this.checked)\"></div>";
    if (chaos) {
      h +=
        '<div class="rp-row"><label>Turb. Frequency</label><div style="display:flex;align-items:center;gap:6px"><input type="range" min="0.5" max="12" step="0.5" value="' +
        (p.chaosFrequency || 2) +
        '" style="flex:1" oninput="this.nextElementSibling.textContent=this.value;FB.panels.updateWidgetProp(\'' +
        id +
        "','chaosFrequency',+this.value)\"><span style=\"width:24px;font-size:11px;color:rgba(255,255,255,0.5)\">" +
        (p.chaosFrequency || 2) +
        "</span></div></div>";
    }
    h += "</div></div>";
    h +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Colour & Size</span></div><div class="rp-section-body">';
    h +=
      '<div class="rp-row"><label>Color A</label><input type="color" value="' +
      (p.color1 || "#818cf8") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color1',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Color B</label><input type="color" value="' +
      (p.color2 || "#f472b6") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color2',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 600) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h += "</div></div>";
    return h;
  },
});

// ── VELTRO ENGINE BATCH 5: BACKGROUNDS & TEXTURES ──
FB.widgets.register("auroraBorealis", {
  label: "Aurora Borealis",
  sublabel: "Northern lights effect",
  icon: "~",
  iconBg: "#0d1a1a",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "backgrounds",
  defaultProps: {
    height: 500,
    bg: "#0d0d1a",
    colors: "#00ff88,#8b5cf6,#3b82f6",
    speed: 0.5,
    intensity: 0.7,
  },
  render: function (p) {
    var id = p._blockId || "aurora";
    return (
      '<div class="veltro-aurora-wrap" id="aurora-' +
      id +
      '" data-colors="' +
      p.colors +
      '" data-speed="' +
      p.speed +
      '" data-intensity="' +
      p.intensity +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px"><canvas class="veltro-aurora-canvas" style="position:absolute;inset:0;width:100%;height:100%" data-aurora-init="1"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 500) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Aurora Colours (CSV)</label><input type="text" value="' +
      (p.colors || "#00ff88,#8b5cf6,#3b82f6") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','colors',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Animation Speed</label><input type="range" min="0.1" max="2" step="0.1" value="' +
      (p.speed || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','speed',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Intensity</label><input type="range" min="0.1" max="1" step="0.05" value="' +
      (p.intensity || 0.7) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','intensity',+this.value)\"></div>";
    return h;
  },
});

// 2. Particle Nebula
FB.widgets.register("particleNebula", {
  label: "Particle Nebula",
  sublabel: "Space-themed particles",
  icon: "✦",
  iconBg: "#0d0d2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "backgrounds",
  defaultProps: {
    height: 500,
    bg: "#050510",
    starCount: 200,
    nebulaColors: "#7c3aed,#3b82f6,#ec4899",
    speed: 0.3,
  },
  render: function (p) {
    var id = p._blockId || "nebula";
    return (
      '<div class="veltro-nebula-wrap" id="nebula-' +
      id +
      '" data-star-count="' +
      p.starCount +
      '" data-nebula-colors="' +
      p.nebulaColors +
      '" data-speed="' +
      p.speed +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px"><canvas class="veltro-nebula-canvas" style="position:absolute;inset:0;width:100%;height:100%" data-nebula-init="1"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 500) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#050510") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Star Count</label><input type="range" min="50" max="400" step="10" value="' +
      (p.starCount || 200) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','starCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Nebula Colours (CSV)</label><input type="text" value="' +
      (p.nebulaColors || "#7c3aed,#3b82f6,#ec4899") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','nebulaColors',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Speed</label><input type="range" min="0.1" max="1" step="0.05" value="' +
      (p.speed || 0.3) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','speed',+this.value)\"></div>";
    return h;
  },
});

// 3. Geometric Patterns
FB.widgets.register("geometricPatterns", {
  label: "Geometric Patterns",
  sublabel: "Animated tessellations",
  icon: "▣",
  iconBg: "#1a0d2e",
  iconColor: "#a78bfa",
  category: "veltro",
  subCategory: "backgrounds",
  defaultProps: {
    height: 500,
    bg: "#0d0d1a",
    patternType: "hexagons",
    colors: "#cdfe00,#3b82f6,#ec4899",
    speed: 0.5,
    cellSize: 40,
    strokeWidth: 1.5,
    lineOpacity: 0.4,
    filled: false,
    colorMode: "cycle",
  },
  render: function (p) {
    var id = p._blockId || "geo";
    return (
      '<div class="veltro-geopat-wrap" id="geopat-' +
      id +
      '" data-pattern-type="' +
      (p.patternType || "hexagons") +
      '" data-colors="' +
      (p.colors || "#cdfe00,#3b82f6,#ec4899") +
      '" data-speed="' +
      (p.speed || 0.5) +
      '" data-cell-size="' +
      (p.cellSize || 40) +
      '" data-stroke-width="' +
      (p.strokeWidth || 1.5) +
      '" data-line-opacity="' +
      (p.lineOpacity || 0.4) +
      '" data-filled="' +
      (p.filled ? "true" : "false") +
      '" data-color-mode="' +
      (p.colorMode || "cycle") +
      '" style="height:' +
      (p.height || 500) +
      "px;background:" +
      (p.bg || "#0d0d1a") +
      ';position:relative;overflow:hidden;border-radius:4px"><canvas style="position:absolute;inset:0;width:100%;height:100%"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 500) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Pattern Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','patternType',this.value)\"><option value=\"hexagons\"" +
      ((p.patternType || "hexagons") === "hexagons" ? " selected" : "") +
      '>Hexagons</option><option value="triangles"' +
      (p.patternType === "triangles" ? " selected" : "") +
      '>Triangles</option><option value="circles"' +
      (p.patternType === "circles" ? " selected" : "") +
      '>Circles</option><option value="squares"' +
      (p.patternType === "squares" ? " selected" : "") +
      '>Squares</option><option value="stars"' +
      (p.patternType === "stars" ? " selected" : "") +
      ">Stars</option></select></div>";
    h +=
      '<div class="rp-row"><label>Colour Mode</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','colorMode',this.value)\"><option value=\"cycle\"" +
      ((p.colorMode || "cycle") === "cycle" ? " selected" : "") +
      '>Cycle</option><option value="gradient"' +
      (p.colorMode === "gradient" ? " selected" : "") +
      '>Gradient</option><option value="solid"' +
      (p.colorMode === "solid" ? " selected" : "") +
      ">Solid</option></select></div>";
    h +=
      '<div class="rp-row"><label>Colours (CSV hex)</label><input type="text" value="' +
      (p.colors || "#cdfe00,#3b82f6,#ec4899") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','colors',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Cell Size (px)</label><input type="range" min="12" max="120" step="4" value="' +
      (p.cellSize || 40) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','cellSize',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Animation Speed</label><input type="range" min="0" max="3" step="0.1" value="' +
      (p.speed || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','speed',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Stroke Width</label><input type="range" min="0.5" max="6" step="0.5" value="' +
      (p.strokeWidth || 1.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','strokeWidth',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Opacity</label><input type="range" min="0.05" max="1" step="0.05" value="' +
      (p.lineOpacity || 0.4) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','lineOpacity',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Filled</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','filled',this.value==='true')\"><option value=\"false\"" +
      (!p.filled ? " selected" : "") +
      '>Stroke only</option><option value="true"' +
      (p.filled ? " selected" : "") +
      ">Filled</option></select></div>";
    return h;
  },
});

// 4. Liquid Gradient
FB.widgets.register("liquidGradient", {
  label: "Liquid Gradient",
  sublabel: "Flowing organic gradients",
  icon: "≋",
  iconBg: "#0d1a1a",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "backgrounds",
  defaultProps: {
    height: 500,
    bg: "#0d0d1a",
    colors: "#ff6b35,#cdfe00,#3b82f6,#ec4899",
    flowSpeed: 0.5,
    turbulence: 0.5,
  },
  render: function (p) {
    var id = p._blockId || "liqGrad";
    return (
      '<div class="veltro-liqgrad-wrap" id="liqgrad-' +
      id +
      '" data-colors="' +
      p.colors +
      '" data-flow-speed="' +
      p.flowSpeed +
      '" data-turbulence="' +
      p.turbulence +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px"><canvas class="veltro-liqgrad-canvas" style="position:absolute;inset:0;width:100%;height:100%" data-liqgrad-init="1"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 500) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Colours (CSV)</label><input type="text" value="' +
      (p.colors || "#ff6b35,#cdfe00,#3b82f6,#ec4899") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','colors',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Flow Speed</label><input type="range" min="0.1" max="2" step="0.1" value="' +
      (p.flowSpeed || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','flowSpeed',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Turbulence</label><input type="range" min="0" max="1" step="0.05" value="' +
      (p.turbulence || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','turbulence',+this.value)\"></div>";
    return h;
  },
});

// ── VELTRO ENGINE BATCH 6: EFFECTS & VISUAL (2 NEW WIDGETS) ──
// 1. Holographic Overlay
FB.widgets.register("holographicOverlay", {
  label: "Holographic Overlay",
  sublabel: "Rainbow sheen effect",
  icon: "✦",
  iconBg: "#1a1a0d",
  iconColor: "#fbbf24",
  category: "veltro",
  subCategory: "effects",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    overlayColor: "#ffffff",
    intensity: 0.5,
    angle: 45,
  },
  render: function (p) {
    var id = p._blockId || "holo";
    return (
      '<div class="veltro-holo-wrap" id="holo-' +
      id +
      '" data-overlay-color="' +
      p.overlayColor +
      '" data-intensity="' +
      p.intensity +
      '" data-angle="' +
      p.angle +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center"><div class="veltro-holo-card" style="width:200px;height:280px;background:linear-gradient(' +
      p.angle +
      'deg,rgba(255,255,255,0.1) 0%,rgba(255,255,255,0) 50%,rgba(255,255,255,0.1) 100%);border-radius:16px;border:1px solid rgba(255,255,255,0.1);position:relative;overflow:hidden"><div class="veltro-holo-shine" style="position:absolute;inset:0;background:conic-gradient(from ' +
      p.angle +
      "deg at 50% 50%,#ff6b35,#cdfe00,#3b82f6,#ec4899,#f59e0b,#ff6b35);opacity:" +
      p.intensity +
      ';mix-blend-mode:overlay;animation:vtspin 4s linear infinite\"></div><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><span style="font-size:3rem">✦</span></div></div></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Overlay Colour</label><input type="color" value="' +
      (p.overlayColor || "#ffffff") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','overlayColor',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Intensity</label><input type="range" min="0.1" max="1" step="0.05" value="' +
      (p.intensity || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','intensity',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Angle (°)</label><input type="range" min="0" max="360" step="5" value="' +
      (p.angle || 45) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','angle',+this.value)\"></div>";
    return h;
  },
});

// 2. Light Leaks
FB.widgets.register("lightLeaks", {
  label: "Light Leaks",
  sublabel: "Cinematic light leak effects",
  icon: "◉",
  iconBg: "#1a0d1a",
  iconColor: "#f472b6",
  category: "veltro",
  subCategory: "effects",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    leakColor: "#ff6b35",
    intensity: 0.3,
    direction: "top-left",
  },
  render: function (p) {
    var id = p._blockId || "leak";
    var gradients = {
      "top-left": "linear-gradient(135deg,",
      "top-right": "linear-gradient(225deg,",
      "bottom-left": "linear-gradient(45deg,",
      "bottom-right": "linear-gradient(315deg,",
    };
    var grad =
      (gradients[p.direction] || gradients["top-left"]) +
      p.leakColor +
      " 0%,transparent 50%)";
    return (
      '<div class="veltro-leak-wrap" id="leak-' +
      id +
      '" data-leak-color="' +
      p.leakColor +
      '" data-intensity="' +
      p.intensity +
      '" data-direction="' +
      p.direction +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center"><div class="veltro-leak-overlay" style="position:absolute;inset:0;background:' +
      grad +
      ";opacity:" +
      p.intensity +
      ';pointer-events:none;animation:vtpulse 4s ease-in-out infinite\"></div><h2 style="color:#fff;font-size:3rem;font-weight:800;margin:0;position:relative;z-index:1">CINEMATIC</h2></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Leak Colour</label><input type="color" value="' +
      (p.leakColor || "#ff6b35") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','leakColor',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Intensity</label><input type="range" min="0.05" max="1" step="0.05" value="' +
      (p.intensity || 0.3) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','intensity',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Direction</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','direction',this.value)\"><option value=\"top-left\"" +
      ((p.direction || "top-left") === "top-left" ? " selected" : "") +
      '>Top Left</option><option value="top-right"' +
      (p.direction === "top-right" ? " selected" : "") +
      '>Top Right</option><option value="bottom-left"' +
      (p.direction === "bottom-left" ? " selected" : "") +
      '>Bottom Left</option><option value="bottom-right"' +
      (p.direction === "bottom-right" ? " selected" : "") +
      ">Bottom Right</option></select></div>";
    return h;
  },
});

// ── VELTRO ENGINE BATCH 7: SPATIAL & LAYOUT (8 NEW WIDGETS) ──
// 1. 3D Carousel
FB.widgets.register("carousel3d", {
  label: "3D Carousel",
  sublabel: "Rotating 3D card carousel",
  icon: "◈",
  iconBg: "#0d1a2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    cardCount: 6,
    rotationSpeed: 0.5,
  },
  render: function (p) {
    var id = p._blockId || "carousel";
    var cardsHtml = "";
    for (var i = 0; i < (p.cardCount || 6); i++) {
      var angle = (i * 360) / (p.cardCount || 6);
      cardsHtml +=
        '<div class="veltro-carousel-card" style="position:absolute;width:120px;height:160px;background:linear-gradient(135deg,rgba(205,254,0,0.2) 0%,rgba(60,165,250,0.2) 100%);border-radius:12px;border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800;color:#fff;transform:rotateY(' +
        angle +
        'deg) translateZ(200px);backface-visibility:hidden">' +
        (i + 1) +
        "</div>";
    }
    return (
      '<div class="veltro-carousel-wrap" id="carousel-' +
      id +
      '" data-rotation-speed="' +
      p.rotationSpeed +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center;perspective:1000px"><div class="veltro-carousel-stage" style="position:relative;width:120px;height:160px;transform-style:preserve-3d" data-carousel-init="1">' +
      cardsHtml +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Card Count</label><input type="range" min="3" max="12" step="1" value="' +
      (p.cardCount || 6) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','cardCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Rotation Speed</label><input type="range" min="0.1" max="3" step="0.1" value="' +
      (p.rotationSpeed || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','rotationSpeed',+this.value)\"></div>";
    return h;
  },
});

// 2. Isometric Grid
FB.widgets.register("isometricGrid", {
  label: "Isometric Grid",
  sublabel: "Isometric layout",
  icon: "▣",
  iconBg: "#1a0d2e",
  iconColor: "#a78bfa",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: { height: 500, bg: "#0d0d1a", cols: 4, rows: 3, spacing: 20 },
  render: function (p) {
    var id = p._blockId || "iso";
    var itemsHtml = "";
    for (var r = 0; r < (p.rows || 3); r++) {
      for (var c = 0; c < (p.cols || 4); c++) {
        itemsHtml +=
          '<div class="veltro-iso-cell" style="width:80px;height:80px;background:linear-gradient(135deg,rgba(205,254,0,0.15) 0%,rgba(60,165,250,0.15) 100%);border-radius:8px;border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:700;color:#cdfe00;transform:rotateX(60deg) rotateZ(-45deg);margin:' +
          (p.spacing || 20) +
          'px">' +
          (r * (p.cols || 4) + c + 1) +
          "</div>";
      }
    }
    return (
      '<div class="veltro-iso-wrap" id="iso-' +
      id +
      '" data-cols="' +
      p.cols +
      '" data-rows="' +
      p.rows +
      '" data-spacing="' +
      p.spacing +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center"><div class="veltro-iso-grid" style="display:grid;grid-template-columns:repeat(' +
      p.cols +
      ",1fr);gap:" +
      p.spacing +
      'px;transform:rotateX(60deg) rotateZ(-45deg);perspective:1000px">' +
      itemsHtml +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 500) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Columns</label><input type="range" min="2" max="8" step="1" value="' +
      (p.cols || 4) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','cols',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Rows</label><input type="range" min="2" max="6" step="1" value="' +
      (p.rows || 3) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','rows',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Spacing (px)</label><input type="range" min="4" max="60" step="4" value="' +
      (p.spacing || 20) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','spacing',+this.value)\"></div>";
    return h;
  },
});

// 3. Perspective Rooms
FB.widgets.register("perspectiveRooms", {
  label: "Perspective Rooms",
  sublabel: "3D room layout",
  icon: "◉",
  iconBg: "#0d1a1a",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 500,
    bg: "#0d0d1a",
    roomCount: 3,
    perspective: 800,
    colors: "#cdfe00,#3b82f6,#ec4899",
  },
  render: function (p) {
    var id = p._blockId || "rooms";
    var colors = (p.colors || "#cdfe00,#3b82f6,#ec4899").split(",");
    var roomsHtml = "";
    for (var i = 0; i < (p.roomCount || 3); i++) {
      roomsHtml +=
        '<div class="veltro-room" style="position:absolute;inset:0;background:' +
        (colors[i % colors.length] || "#cdfe00") +
        ";opacity:0.1;transform:translateZ(" +
        i * -200 +
        'px);border:2px solid rgba(255,255,255,0.1);border-radius:16px;display:flex;align-items:center;justify-content:center"><span style="font-size:2rem;font-weight:800;color:#fff;opacity:0.5">Room ' +
        (i + 1) +
        "</span></div>";
    }
    return (
      '<div class="veltro-rooms-wrap" id="rooms-' +
      id +
      '" data-room-count="' +
      p.roomCount +
      '" data-perspective="' +
      p.perspective +
      '" data-colors="' +
      p.colors +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ";position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-center;perspective:" +
      p.perspective +
      'px"><div class="veltro-rooms-stage" style="position:relative;width:300px;height:300px;transform-style:preserve-3d">' +
      roomsHtml +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 500) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Room Count</label><input type="range" min="1" max="8" step="1" value="' +
      (p.roomCount || 3) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','roomCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Perspective (px)</label><input type="range" min="200" max="2000" step="100" value="' +
      (p.perspective || 800) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','perspective',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Colours (CSV)</label><input type="text" value="' +
      (p.colors || "#cdfe00,#3b82f6,#ec4899") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','colors',this.value)\"></div>";
    return h;
  },
});

// 4. Floating Islands
FB.widgets.register("floatingIslands", {
  label: "Floating Islands",
  sublabel: "Floating content blocks",
  icon: "◈",
  iconBg: "#1a1a0d",
  iconColor: "#fbbf24",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 500,
    bg: "#0d0d1a",
    islandCount: 5,
    floatRange: 20,
    speed: 1,
  },
  render: function (p) {
    var id = p._blockId || "islands";
    var itemsHtml = "";
    for (var i = 0; i < (p.islandCount || 5); i++) {
      var size = 80 + Math.random() * 60;
      itemsHtml +=
        '<div class="veltro-island" style="position:absolute;width:' +
        size +
        "px;height:" +
        size +
        "px;background:linear-gradient(135deg,rgba(205,254,0,0.2) 0%,rgba(60,165,250,0.2) 100%);border-radius:" +
        size / 4 +
        "px;border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:700;color:#fff;left:" +
        (10 + Math.random() * 70) +
        "%;top:" +
        (10 + Math.random() * 70) +
        "%;animation:vtfloat " +
        (3 + Math.random() * 2) +
        "s ease-in-out infinite;animation-delay:" +
        Math.random() * 2 +
        's">' +
        (i + 1) +
        "</div>";
    }
    return (
      '<div class="veltro-islands-wrap" id="islands-' +
      id +
      '" data-island-count="' +
      p.islandCount +
      '" data-float-range="' +
      p.floatRange +
      '" data-speed="' +
      p.speed +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px">' +
      itemsHtml +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 500) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Island Count</label><input type="range" min="2" max="12" step="1" value="' +
      (p.islandCount || 5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','islandCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Float Range (px)</label><input type="range" min="5" max="60" step="5" value="' +
      (p.floatRange || 20) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','floatRange',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Speed</label><input type="range" min="0.2" max="3" step="0.2" value="' +
      (p.speed || 1) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','speed',+this.value)\"></div>";
    return h;
  },
});

// 5. Layered Parallax
FB.widgets.register("layeredParallax", {
  label: "Layered Parallax",
  sublabel: "Multi-depth layers",
  icon: "▣",
  iconBg: "#0d1a2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 500,
    bg: "#0d0d1a",
    layerCount: 5,
    depthIntensity: 0.5,
  },
  render: function (p) {
    var id = p._blockId || "layerPar";
    var layersHtml = "";
    for (var i = 0; i < (p.layerCount || 5); i++) {
      var depth = (i + 1) / (p.layerCount || 5);
      layersHtml +=
        '<div class="veltro-layer" data-depth="' +
        depth +
        '" style="position:absolute;inset:0;background:radial-gradient(circle at ' +
        (30 + i * 10) +
        "% " +
        (40 + i * 8) +
        "%,rgba(205,254,0," +
        (0.03 + depth * 0.08) +
        ') 0%,transparent 50%);transform:translateZ(0)\"></div>';
    }
    return (
      '<div class="veltro-layerpar-wrap" id="layerpar-' +
      id +
      '" data-layer-count="' +
      p.layerCount +
      '" data-depth-intensity="' +
      p.depthIntensity +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center">' +
      layersHtml +
      '<div style="position:relative;z-index:10"><h2 style="color:#fff;font-size:3rem;font-weight:800;margin:0;text-shadow:0 4px 20px rgba(0,0,0,0.5)">DEPTH</h2></div></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 500) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Layer Count</label><input type="range" min="2" max="10" step="1" value="' +
      (p.layerCount || 5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','layerCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Depth Intensity</label><input type="range" min="0.1" max="1" step="0.05" value="' +
      (p.depthIntensity || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','depthIntensity',+this.value)\"></div>";
    return h;
  },
});

// 6. Kinetic Layout
FB.widgets.register("kineticLayout", {
  label: "Kinetic Layout",
  sublabel: "Layout responds to cursor",
  icon: "◉",
  iconBg: "#1a0d1a",
  iconColor: "#f472b6",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    elementCount: 9,
    responseRadius: 200,
  },
  render: function (p) {
    var id = p._blockId || "kinetic";
    var itemsHtml = "";
    for (var i = 0; i < (p.elementCount || 9); i++) {
      itemsHtml +=
        '<div class="veltro-kinetic-item" style="width:80px;height:80px;background:linear-gradient(135deg,rgba(205,254,0,0.15) 0%,rgba(60,165,250,0.15) 100%);border-radius:12px;border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:700;color:#cdfe00;transition:transform 0.3s ease">' +
        (i + 1) +
        "</div>";
    }
    return (
      '<div class="veltro-kinetic-wrap" id="kinetic-' +
      id +
      '" data-response-radius="' +
      p.responseRadius +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:20px;padding:20px">' +
      itemsHtml +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Element Count</label><input type="range" min="4" max="20" step="1" value="' +
      (p.elementCount || 9) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','elementCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Response Radius (px)</label><input type="range" min="50" max="500" step="10" value="' +
      (p.responseRadius || 200) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','responseRadius',+this.value)\"></div>";
    return h;
  },
});

// 7. Morphing Grid
FB.widgets.register("morphingGrid", {
  label: "Morphing Grid",
  sublabel: "Grid transforms between layouts",
  icon: "⊞",
  iconBg: "#0d1a2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    layoutType: "grid",
    animationSpeed: 1,
  },
  render: function (p) {
    var id = p._blockId || "morphGrid";
    var itemsHtml = "";
    for (var i = 0; i < 9; i++) {
      itemsHtml +=
        '<div class="veltro-morphgrid-item" style="background:linear-gradient(135deg,rgba(205,254,0,0.15) 0%,rgba(60,165,250,0.15) 100%);border-radius:8px;border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:700;color:#cdfe00">' +
        (i + 1) +
        "</div>";
    }
    var gridStyle =
      p.layoutType === "grid"
        ? "grid-template-columns:repeat(3,1fr)"
        : p.layoutType === "list"
          ? "grid-template-columns:1fr"
          : "grid-template-columns:repeat(3,1fr)";
    return (
      '<div class="veltro-morphgrid-wrap" id="morphgrid-' +
      id +
      '" data-layout-type="' +
      p.layoutType +
      '" data-animation-speed="' +
      p.animationSpeed +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;padding:20px"><div class="veltro-morphgrid-container" style="display:grid;' +
      gridStyle +
      ";gap:10px;height:100%;transition:all " +
      1 / p.animationSpeed +
      's ease">' +
      itemsHtml +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Layout</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','layoutType',this.value)\"><option value=\"grid\"" +
      ((p.layoutType || "grid") === "grid" ? " selected" : "") +
      '>Grid</option><option value="list"' +
      (p.layoutType === "list" ? " selected" : "") +
      ">List</option></select></div>";
    h +=
      '<div class="rp-row"><label>Transition Speed</label><input type="range" min="0.2" max="3" step="0.2" value="' +
      (p.animationSpeed || 1) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','animationSpeed',+this.value)\"></div>";
    return h;
  },
});

// 8. Spatial Navigation
FB.widgets.register("spatialNavigation", {
  label: "Spatial Navigation",
  sublabel: "3D navigation system",
  icon: "◈",
  iconBg: "#1a0d2e",
  iconColor: "#a78bfa",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    navItems: "Home,About,Work,Contact",
    perspective: 800,
    spacing: 100,
  },
  render: function (p) {
    var id = p._blockId || "spatialNav";
    var items = (p.navItems || "Home,About,Work,Contact").split(",");
    var itemsHtml = items
      .map(function (item, i) {
        return (
          '<div class="veltro-spatial-item" style="padding:20px 40px;background:linear-gradient(135deg,rgba(205,254,0,0.15) 0%,rgba(60,165,250,0.15) 100%);border-radius:12px;border:1px solid rgba(255,255,255,0.1);font-size:1.5rem;font-weight:700;color:#fff;transform:translateZ(' +
          i * 50 +
          'px)">' +
          item.trim() +
          "</div>"
        );
      })
      .join("");
    return (
      '<div class="veltro-spatial-wrap" id="spatial-' +
      id +
      '" data-nav-items="' +
      p.navItems +
      '" data-perspective="' +
      p.perspective +
      '" data-spacing="' +
      p.spacing +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ";position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center;perspective:" +
      p.perspective +
      'px"><div class="veltro-spatial-nav" style="display:flex;flex-direction:column;gap:' +
      p.spacing +
      'px;transform-style:preserve-3d">' +
      itemsHtml +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Nav Items (CSV)</label><input type="text" value="' +
      (p.navItems || "Home,About,Work,Contact") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','navItems',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Perspective (px)</label><input type="range" min="200" max="2000" step="100" value="' +
      (p.perspective || 800) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','perspective',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Spacing (px)</label><input type="range" min="20" max="300" step="10" value="' +
      (p.spacing || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','spacing',+this.value)\"></div>";
    return h;
  },
});

// ── Missing Original Widgets ──

// cursorLens
FB.widgets.register("cursorLens", {
  label: "Cursor Lens",
  sublabel: "Magnify on hover",
  icon: "🔍",
  iconBg: "#f97316",
  iconColor: "#fff",
  category: "veltro",
  subCategory: "cursor",
  defaultProps: {
    height: 300,
    bg: "#0d0d1a",
    image: "https://picsum.photos/800/400?random=1",
    lensSize: 120,
    magnification: 2,
  },
  render: function (p) {
    var id = p._blockId || "lens0";
    return (
      '<div class="veltro-lens-wrap fw-widget-cursorLens" id="lens-' +
      id +
      '" data-lens-size="' +
      (p.lensSize || 120) +
      '" data-magnification="' +
      (p.magnification || 2) +
      '" style="height:' +
      (p.height || 300) +
      "px;background:" +
      (p.bg || "#0d0d1a") +
      ';position:relative;overflow:hidden;border-radius:4px;cursor:none"><img class="veltro-lens-bg" src="' +
      (p.image || "https://picsum.photos/800/400?random=1") +
      '" style="width:100%;height:100%;object-fit:cover"><div class="veltro-lens-mask" style="position:absolute;width:' +
      (p.lensSize || 120) +
      "px;height:" +
      (p.lensSize || 120) +
      'px;border-radius:50%;border:2px solid rgba(255,255,255,0.5);overflow:hidden;pointer-events:none;transform:translate(-50%,-50%);left:var(--lx,50%);top:var(--ly,50%)"><img src="' +
      (p.image || "https://picsum.photos/800/400?random=1") +
      '" style="position:absolute;width:' +
      (p.magnification || 2) * 100 +
      "%;height:" +
      (p.magnification || 2) * 100 +
      '%;object-fit:cover;left:var(--lx-offset,0);top:var(--ly-offset,0)"></div></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
      (p.image || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','image',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Lens Size (px)</label><input type="number" min="60" max="300" value="' +
      (p.lensSize || 120) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','lensSize',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Magnification</label><input type="range" min="1.2" max="5" step="0.1" value="' +
      (p.magnification || 2) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','magnification',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    return h;
  },
});

// shaderBg
FB.widgets.register("shaderBg", {
  label: "Shader Background",
  sublabel: "WebGL GLSL backgrounds",
  icon: "🌊",
  iconBg: "#3b82f6",
  iconColor: "#fff",
  category: "veltro",
  subCategory: "backgrounds",
  defaultProps: {
    height: 400,
    bg: "#050510",
    shaderType: "noise",
    speed: 0.5,
    intensity: 1,
    color1: "#3b82f6",
    color2: "#8b5cf6",
  },
  render: function (p) {
    var id = p._blockId || "shader0";
    return (
      '<div class="veltro-shader-wrap" id="shader-' +
      id +
      '" data-shader-type="' +
      (p.shaderType || "noise") +
      '" data-speed="' +
      (p.speed || 0.5) +
      '" data-intensity="' +
      (p.intensity || 1) +
      '" data-color1="' +
      (p.color1 || "#3b82f6") +
      '" data-color2="' +
      (p.color2 || "#8b5cf6") +
      '" style="height:' +
      (p.height || 400) +
      "px;background:" +
      (p.bg || "#050510") +
      ';position:relative;overflow:hidden;border-radius:4px"><canvas class="veltro-shader-canvas" style="position:absolute;inset:0;width:100%;height:100%"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Shader Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','shaderType',this.value)\">" +
      ["noise", "plasma", "grid", "ripple", "tunnel"]
        .map(function (v) {
          return (
            '<option value="' +
            v +
            '"' +
            ((p.shaderType || "noise") === v ? " selected" : "") +
            ">" +
            v.charAt(0).toUpperCase() +
            v.slice(1) +
            "</option>"
          );
        })
        .join("") +
      "</select></div>";
    h +=
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Speed</label><input type="range" min="0" max="2" step="0.05" value="' +
      (p.speed || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','speed',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Intensity</label><input type="range" min="0.1" max="3" step="0.1" value="' +
      (p.intensity || 1) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','intensity',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Colour 1</label><input type="color" value="' +
      (p.color1 || "#3b82f6") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color1',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Colour 2</label><input type="color" value="' +
      (p.color2 || "#8b5cf6") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color2',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#050510") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    return h;
  },
});

// infiniteCanvas
FB.widgets.register("infiniteCanvas", {
  label: "Infinite Canvas",
  sublabel: "Pan & zoom space",
  icon: "🗺️",
  iconBg: "#10b981",
  iconColor: "#fff",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 400,
    bg: "#0a0a1a",
    gridSize: 40,
    gridColor: "rgba(255,255,255,0.05)",
  },
  render: function (p) {
    var id = p._blockId || "infinite0";
    return (
      '<div class="veltro-infinite-wrap" id="infinite-' +
      id +
      '" data-grid-size="' +
      (p.gridSize || 40) +
      '" data-grid-color="' +
      (p.gridColor || "rgba(255,255,255,0.05)") +
      '" style="height:' +
      (p.height || 400) +
      "px;background:" +
      (p.bg || "#0a0a1a") +
      ';position:relative;overflow:hidden;border-radius:4px;cursor:grab"><canvas class="veltro-infinite-canvas" style="position:absolute;inset:0;width:100%;height:100%"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="100" max="1200" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0a0a1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Grid Size (px)</label><input type="range" min="10" max="100" step="5" value="' +
      (p.gridSize || 40) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','gridSize',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Grid Colour (rgba)</label><input type="text" value="' +
      (p.gridColor || "rgba(255,255,255,0.05)") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','gridColor',this.value)\"></div>";
    return h;
  },
});

// ── Physics Sandbox Initializer ──
window._VeltroInitPhysics = function () {
  document
    .querySelectorAll(".veltro-physics-wrap:not([data-physics-init])")
    .forEach(function (wrap) {
      wrap.dataset.physicsInit = "1";
      window._VeltroLoadMatter(function (Matter) {
        var W = wrap.offsetWidth;
        var H = wrap.offsetHeight || 400;
        var gravity = +(wrap.dataset.gravity || 1);
        var restitution = +(wrap.dataset.restitution || 0.7);
        var friction = +(wrap.dataset.friction || 0.05);
        var items = JSON.parse(wrap.dataset.items || '["Veltro","Physics"]');
        var tc = wrap.dataset.textColor || "#cdfe00";
        var engine = Matter.Engine.create({ gravity: { y: gravity } });
        var runner = Matter.Runner.create();
        var opts = {
          restitution: restitution,
          friction: friction,
          chamfer: { radius: 12 },
        };
        var bodies = items.map(function (txt, i) {
          return Matter.Bodies.rectangle(
            W / 2 + (Math.random() - 0.5) * W * 0.6,
            H * 0.1 + i * 30,
            txt.length * 14 + 40,
            44,
            Object.assign({ label: txt }, opts),
          );
        });
        var walls = [
          Matter.Bodies.rectangle(W / 2, H + 25, W * 2, 50, {
            isStatic: true,
            label: "floor",
          }),
          Matter.Bodies.rectangle(-25, H / 2, 50, H * 2, { isStatic: true }),
          Matter.Bodies.rectangle(W + 25, H / 2, 50, H * 2, { isStatic: true }),
          Matter.Bodies.rectangle(W / 2, -25, W * 2, 50, { isStatic: true }),
        ];
        Matter.Composite.add(engine.world, bodies.concat(walls));
        Matter.Runner.run(runner, engine);
        var labels = wrap.querySelector(".veltro-physics-labels");
        var rafId = 0;
        function loop() {
          if (!wrap.isConnected) {
            Matter.Runner.stop(runner);
            Matter.Engine.clear(engine);
            return;
          }
          bodies.forEach(function (b) {
            var el = labels.querySelector('[data-bid="' + b.id + '"]');
            if (!el) {
              el = document.createElement("div");
              el.dataset.bid = b.id;
              el.style.cssText =
                "position:absolute;padding:4px 14px;border-radius:24px;font-size:13px;font-weight:700;letter-spacing:1px;user-select:none;transform-origin:center;background:rgba(255,255,255,0.05);border:1px solid " +
                tc +
                ";color:" +
                tc +
                ";white-space:nowrap;font-family:'Inter',sans-serif;";
              el.textContent = b.label;
              labels.appendChild(el);
            }
            var hw = el.offsetWidth / 2,
              hh = el.offsetHeight / 2;
            el.style.left = b.position.x - hw + "px";
            el.style.top = b.position.y - hh + "px";
            el.style.transform = "rotate(" + b.angle + "rad)";
          });
          rafId = requestAnimationFrame(loop);
        }
        new IntersectionObserver(
          function (e) {
            if (e[0].isIntersecting) {
              if (!rafId) rafId = requestAnimationFrame(loop);
            } else {
              cancelAnimationFrame(rafId);
              rafId = 0;
            }
          },
          { threshold: 0.01 },
        ).observe(wrap);
        wrap.addEventListener("click", function (e) {
          var rect = wrap.getBoundingClientRect();
          var mx = e.clientX - rect.left,
            my = e.clientY - rect.top;
          bodies.forEach(function (b) {
            var dx = b.position.x - mx,
              dy = b.position.y - my;
            var dist = Math.hypot(dx, dy);
            if (dist < 200) {
              Matter.Body.applyForce(b, b.position, {
                x: (dx / dist) * 0.05,
                y: (dy / dist) * 0.05 - 0.04,
              });
            }
          });
        });
      });
    });
};

window._VeltroInitImagePhysics = function () {
  document
    .querySelectorAll(".veltro-iphys-wrap:not([data-iphys-init])")
    .forEach(function (wrap) {
      wrap.dataset.iphysInit = "1";
      var canvas = wrap.querySelector(".veltro-iphys-canvas");
      if (!canvas) return;
      var W = wrap.offsetWidth || 600;
      var H = wrap.offsetHeight || 400;
      canvas.width = W;
      canvas.height = H;
      var ctx = canvas.getContext("2d");
      var gravity = +(wrap.dataset.gravity || 1);
      var restitution = +(wrap.dataset.restitution || 0.5);
      var imageShape = wrap.dataset.imageShape || "square";
      var imageSize = Math.max(
        30,
        Math.min(200, +(wrap.dataset.imageSize || 80)),
      );
      var borderRadius = +(wrap.dataset.imageBorderRadius || 8);
      var borderWidth = +(wrap.dataset.imageBorderWidth || 0);
      var borderColor = wrap.dataset.imageBorderColor || "#ffffff";
      var mouseInteraction = wrap.dataset.mouseInteraction !== "false";
      var mouseForce = +(wrap.dataset.mouseForce || 5);
      var windEnabled = wrap.dataset.windEnabled === "true";
      var windStrength = +(wrap.dataset.windStrength || 0);
      var images = JSON.parse(wrap.dataset.images || "[]");
      var SIZE = imageSize;

      var imgObjs = images.map(function (src) {
        var img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        return img;
      });

      window._VeltroLoadMatter(function (Matter) {
        var engine = Matter.Engine.create({ gravity: { y: gravity } });
        var runner = Matter.Runner.create();
        var opts = {
          restitution: restitution,
          friction: 0.1,
          frictionAir: 0.01,
        };
        var bodies = images.map(function (src, i) {
          var x = W * 0.2 + (i % 3) * (W * 0.3);
          var y = H * 0.1 + Math.floor(i / 3) * SIZE * 1.6;
          if (imageShape === "circle") {
            return Matter.Bodies.circle(x, y, SIZE / 2, opts);
          }
          var polySides = 0;
          if (imageShape === "triangle") polySides = 3;
          else if (imageShape === "pentagon") polySides = 5;
          else if (imageShape === "hexagon") polySides = 6;
          else if (imageShape === "octagon") polySides = 8;
          if (polySides > 0) {
            return Matter.Bodies.polygon(x, y, polySides, SIZE / 2, opts);
          }
          return Matter.Bodies.rectangle(x, y, SIZE, SIZE, opts);
        });
        var walls = [
          Matter.Bodies.rectangle(W / 2, H + 25, W * 2, 50, { isStatic: true }),
          Matter.Bodies.rectangle(-25, H / 2, 50, H * 2, { isStatic: true }),
          Matter.Bodies.rectangle(W + 25, H / 2, 50, H * 2, { isStatic: true }),
          Matter.Bodies.rectangle(W / 2, -25, W * 2, 50, { isStatic: true }),
        ];
        Matter.Composite.add(engine.world, bodies.concat(walls));
        Matter.Runner.run(runner, engine);

        var mousePos = { x: -9999, y: -9999 };
        if (mouseInteraction) {
          canvas.addEventListener("mousemove", function (e) {
            var rect = canvas.getBoundingClientRect();
            mousePos.x = e.clientX - rect.left;
            mousePos.y = e.clientY - rect.top;
          });
          canvas.addEventListener("mouseleave", function () {
            mousePos.x = -9999;
            mousePos.y = -9999;
          });
          canvas.addEventListener("click", function (e) {
            var rect = canvas.getBoundingClientRect();
            var mx = e.clientX - rect.left;
            var my = e.clientY - rect.top;
            bodies.forEach(function (b) {
              var dx = b.position.x - mx;
              var dy = b.position.y - my;
              var dist = Math.hypot(dx, dy);
              if (dist < SIZE * 2 && dist > 0) {
                var f = mouseForce * 0.001;
                Matter.Body.applyForce(b, b.position, {
                  x: (dx / dist) * f,
                  y: (dy / dist) * f - f * 0.5,
                });
              }
            });
          });
        }

        var rafId = 0;
        function loop() {
          if (!wrap.isConnected) {
            Matter.Runner.stop(runner);
            Matter.Engine.clear(engine);
            return;
          }
          var cw = wrap.offsetWidth || 600;
          var ch = wrap.offsetHeight || 400;
          if (cw !== W || ch !== H) {
            W = cw;
            H = ch;
            canvas.width = W;
            canvas.height = H;
            Matter.Body.setPosition(walls[0], { x: W / 2, y: H + 25 });
            Matter.Body.setPosition(walls[1], { x: -25, y: H / 2 });
            Matter.Body.setPosition(walls[2], { x: W + 25, y: H / 2 });
            Matter.Body.setPosition(walls[3], { x: W / 2, y: -25 });
          }
          if (windEnabled && windStrength) {
            bodies.forEach(function (b) {
              Matter.Body.applyForce(b, b.position, {
                x: windStrength * 0.0001,
                y: 0,
              });
            });
          }
          if (mouseInteraction && mousePos.x > -9000) {
            bodies.forEach(function (b) {
              var dx = b.position.x - mousePos.x;
              var dy = b.position.y - mousePos.y;
              var dist = Math.hypot(dx, dy);
              if (dist < SIZE * 1.5 && dist > 0) {
                var f = mouseForce * 0.00005;
                Matter.Body.applyForce(b, b.position, {
                  x: (dx / dist) * f,
                  y: (dy / dist) * f,
                });
              }
            });
          }
          ctx.clearRect(0, 0, W, H);
          bodies.forEach(function (b, i) {
            var img = imgObjs[i];
            if (!img) return;
            var hs = SIZE / 2;
            function drawShape() {
              ctx.beginPath();
              if (imageShape === "circle") {
                ctx.arc(0, 0, hs, 0, Math.PI * 2);
              } else {
                var sides = 4;
                if (imageShape === "triangle") sides = 3;
                else if (imageShape === "pentagon") sides = 5;
                else if (imageShape === "hexagon") sides = 6;
                else if (imageShape === "octagon") sides = 8;
                else if (imageShape === "star") {
                  var outer = hs,
                    inner = hs * 0.4,
                    pts = 5;
                  for (var si = 0; si < pts * 2; si++) {
                    var rad = si % 2 === 0 ? outer : inner;
                    var a = (si * Math.PI) / pts - Math.PI / 2;
                    var px = Math.cos(a) * rad,
                      py = Math.sin(a) * rad;
                    if (si === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                  }
                  ctx.closePath();
                  return;
                } else if (imageShape === "heart") {
                  ctx.moveTo(0, hs * 0.7);
                  ctx.bezierCurveTo(
                    -hs * 0.6,
                    hs * 0.3,
                    -hs,
                    -hs * 0.1,
                    -hs * 0.4,
                    -hs * 0.5,
                  );
                  ctx.bezierCurveTo(
                    -hs * 0.1,
                    -hs * 0.8,
                    0,
                    -hs * 0.4,
                    0,
                    -hs * 0.2,
                  );
                  ctx.bezierCurveTo(
                    0,
                    -hs * 0.4,
                    hs * 0.1,
                    -hs * 0.8,
                    hs * 0.4,
                    -hs * 0.5,
                  );
                  ctx.bezierCurveTo(
                    hs,
                    -hs * 0.1,
                    hs * 0.6,
                    hs * 0.3,
                    0,
                    hs * 0.7,
                  );
                  ctx.closePath();
                  return;
                }
                for (var si = 0; si < sides; si++) {
                  var a = (si * 2 * Math.PI) / sides - Math.PI / 2;
                  var px = Math.cos(a) * hs * 0.9,
                    py = Math.sin(a) * hs * 0.9;
                  if (si === 0) ctx.moveTo(px, py);
                  else ctx.lineTo(px, py);
                }
                ctx.closePath();
              }
            }
            ctx.save();
            ctx.translate(b.position.x, b.position.y);
            ctx.rotate(b.angle);
            ctx.save();
            drawShape();
            ctx.clip();
            if (img.complete && img.naturalWidth) {
              ctx.drawImage(img, -hs, -hs, SIZE, SIZE);
            } else {
              ctx.fillStyle = "rgba(255,255,255,0.1)";
              ctx.fill();
            }
            ctx.restore();
            if (borderWidth > 0) {
              drawShape();
              ctx.strokeStyle = borderColor;
              ctx.lineWidth = borderWidth;
              ctx.stroke();
            }
            ctx.restore();
          });
          rafId = requestAnimationFrame(loop);
        }

        new IntersectionObserver(
          function (e) {
            if (e[0].isIntersecting) {
              if (!rafId) rafId = requestAnimationFrame(loop);
            } else {
              cancelAnimationFrame(rafId);
              rafId = 0;
            }
          },
          { threshold: 0.01 },
        ).observe(wrap);
      });
    });
};

// ── Scroll-velocity kinetic text driver ──
(function () {
  var lastY = 0;
  var lastT = Date.now();
  var container = document.getElementById("canvas");
  function updateKineticScroll() {
    var y = container ? container.scrollTop : window.scrollY;
    var t = Date.now();
    var vel = Math.abs(y - lastY) / Math.max(t - lastT, 1);
    lastY = y;
    lastT = t;
    document.querySelectorAll(".veltro-kinetic-scroll").forEach(function (el) {
      var base = +el.dataset.baseWeight || 400;
      var min = +el.dataset.minWeight || 100;
      var max = +el.dataset.maxWeight || 900;
      var w = Math.round(Math.min(max, Math.max(min, base + vel * 60)));
      el.style.fontVariationSettings = "'wght' " + w;
      el.style.fontWeight = w;
    });
  }
  if (container) {
    container.addEventListener("scroll", updateKineticScroll, {
      passive: true,
    });
  }
  window.addEventListener("scroll", updateKineticScroll, { passive: true });
})();

// ── WebGL Shader Initializer ──
window._VeltroInitShaders = function () {
  var FS =
    "precision mediump float;" +
    "uniform float u_t,u_speed,u_ws;" +
    "uniform vec2 u_m,u_r;" +
    "uniform vec3 u_cA,u_cB,u_cC;" +
    "varying vec2 v_uv;" +
    "void main(){" +
    "vec2 st=v_uv,ms=u_m/u_r;" +
    "float w1=sin(st.x*u_ws+u_t*u_speed)*0.12;" +
    "float w2=cos(st.y*u_ws*0.7+u_t*u_speed*0.6)*0.09;" +
    "float w3=sin((st.x+st.y)*u_ws*0.5+u_t*u_speed*1.3)*0.07;" +
    "float d=distance(st+vec2(w1,w2),ms);" +
    "vec3 col=mix(u_cA,u_cB,smoothstep(0.5,0.0,d));" +
    "col=mix(col,u_cC,w3*0.5+0.5);" +
    "gl_FragColor=vec4(col,1.0);}";
  function hex3(h) {
    h = h.replace("#", "");
    return [
      parseInt(h.substring(0, 2), 16) / 255,
      parseInt(h.substring(2, 4), 16) / 255,
      parseInt(h.substring(4, 6), 16) / 255,
    ];
  }
  document
    .querySelectorAll('[data-shader-bg="true"]:not([data-shader-init])')
    .forEach(function (c) {
      c.dataset.shaderInit = "1";
      var gl = c.getContext("webgl") || c.getContext("experimental-webgl");
      if (!gl) return;
      var vs = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(
        vs,
        "attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0,1);}",
      );
      gl.compileShader(vs);
      var fs = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fs, FS);
      gl.compileShader(fs);
      var prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.useProgram(prog);
      var buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      );
      var aPos = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      c._shader = {
        gl: gl,
        uT: gl.getUniformLocation(prog, "u_t"),
        uM: gl.getUniformLocation(prog, "u_m"),
        uR: gl.getUniformLocation(prog, "u_r"),
        uSpeed: gl.getUniformLocation(prog, "u_speed"),
        uWS: gl.getUniformLocation(prog, "u_ws"),
        uCA: gl.getUniformLocation(prog, "u_cA"),
        uCB: gl.getUniformLocation(prog, "u_cB"),
        uCC: gl.getUniformLocation(prog, "u_cC"),
        props: {
          speed: +(c.dataset.speed || 0.8),
          waveScale: +(c.dataset.ws || 8),
          colorA: c.dataset.ca || "#0d0520",
          colorB: c.dataset.cb || "#d95818",
          colorC: c.dataset.cc || "#140a38",
          mouseInteraction: c.dataset.mouse !== "0",
        },
      };
      var t = 0;
      var rafId = 0;
      function loop() {
        if (!c.isConnected) return;
        t += 0.016;
        c.width = c.offsetWidth;
        c.height = c.offsetHeight;
        gl.viewport(0, 0, c.width, c.height);
        var rect = c.getBoundingClientRect();
        var s = c._shader;
        var pr = s.props;
        var vmx = pr.mouseInteraction
          ? window._VeltroMouse.x - rect.left
          : -9999;
        var vmy = pr.mouseInteraction
          ? c.height - (window._VeltroMouse.y - rect.top)
          : -9999;
        gl.uniform1f(s.uT, t);
        gl.uniform2f(s.uM, vmx, vmy);
        gl.uniform2f(s.uR, c.width, c.height);
        gl.uniform1f(s.uSpeed, pr.speed);
        gl.uniform1f(s.uWS, pr.waveScale);
        gl.uniform3fv(s.uCA, hex3(pr.colorA));
        gl.uniform3fv(s.uCB, hex3(pr.colorB));
        gl.uniform3fv(s.uCC, hex3(pr.colorC));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        rafId = requestAnimationFrame(loop);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(loop);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(c);
    });
};

// ── Infinite Canvas Initializer ──
window._VeltroICState = window._VeltroICState || {};
window._VeltroInitInfiniteCanvas = function () {
  document
    .querySelectorAll('[data-infinite-canvas="true"]:not([data-ic-init])')
    .forEach(function (viewport) {
      viewport.dataset.icInit = "1";
      var world = viewport.querySelector(".veltro-ic-world");
      var coordsEl = viewport.querySelector(".veltro-ic-coords");
      if (!world) return;
      var blockId = viewport.id.replace("ic-", "");
      var saved = window._VeltroICState[blockId] || {};
      var state = {
        panX: saved.panX || 0,
        panY: saved.panY || 0,
        zoom: saved.zoom || 1,
        isDragging: false,
        startX: 0,
        startY: 0,
        minZoom: +(viewport.dataset.minZoom || 0.15),
        maxZoom: +(viewport.dataset.maxZoom || 3.0),
      };
      viewport.style.cursor = "grab";
      function handleWheel(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.ctrlKey || e.metaKey) {
          var rect = viewport.getBoundingClientRect();
          var cx = e.clientX - rect.left;
          var cy = e.clientY - rect.top;
          var factor = 1 - e.deltaY * 0.005;
          var newZoom = Math.max(
            state.minZoom,
            Math.min(state.maxZoom, state.zoom * factor),
          );
          state.panX = cx - ((cx - state.panX) * newZoom) / state.zoom;
          state.panY = cy - ((cy - state.panY) * newZoom) / state.zoom;
          state.zoom = newZoom;
        } else {
          state.panX -= e.deltaX;
          state.panY -= e.deltaY;
        }
      }
      function handleMouseDown(e) {
        if (e.button === 0 || e.button === 1) {
          e.preventDefault();
          state.isDragging = true;
          state.startX = e.clientX - state.panX;
          state.startY = e.clientY - state.panY;
          viewport.style.cursor = "grabbing";
        }
      }
      function handleMouseMove(e) {
        if (!state.isDragging) return;
        state.panX = e.clientX - state.startX;
        state.panY = e.clientY - state.startY;
      }
      function handleMouseUp() {
        state.isDragging = false;
        viewport.style.cursor = "grab";
      }
      viewport.addEventListener("wheel", handleWheel, { passive: false });
      viewport.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      var frameCount = 0;
      var rafId = 0;
      function loop() {
        if (!viewport.isConnected) {
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("mouseup", handleMouseUp);
          return;
        }
        world.style.transform =
          "translate3d(" +
          state.panX +
          "px," +
          state.panY +
          "px,0) scale(" +
          state.zoom +
          ")";
        world.querySelectorAll(".veltro-ic-node").forEach(function (node) {
          var df = +(node.dataset.depthFactor || 1);
          if (df === 1) return;
          node.style.transform =
            "translate3d(" +
            state.panX * (df - 1) +
            "px," +
            state.panY * (df - 1) +
            "px,0)";
        });
        if (++frameCount % 12 === 0) {
          if (coordsEl) {
            coordsEl.textContent =
              "X: " +
              Math.round(-state.panX) +
              "  Y: " +
              Math.round(-state.panY) +
              "  " +
              Math.round(state.zoom * 100) +
              "%";
          }
          window._VeltroICState[blockId] = {
            panX: state.panX,
            panY: state.panY,
            zoom: state.zoom,
          };
        }
        rafId = requestAnimationFrame(loop);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(loop);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(viewport);
    });
};

// ── INITIALIZERS FOR RECONSTRUCTED ORIGINAL WIDGETS ──
window._VeltroInitTextScramble = function () {
  document
    .querySelectorAll(".veltro-scramble-wrap:not([data-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-init", "1");
      var text = wrap.querySelector(".veltro-scramble-text");
      var original = wrap.dataset.text || "DECODE ME";
      var charset =
        wrap.dataset.charset || "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      var speed = +(wrap.dataset.speed || 30);
      var isHovering = false;
      text.addEventListener("mouseenter", function () {
        isHovering = true;
      });
      text.addEventListener("mouseleave", function () {
        isHovering = false;
        text.textContent = original;
      });
      var interval = setInterval(function () {
        if (!wrap.isConnected) {
          clearInterval(interval);
          return;
        }
        if (!isHovering) return;
        var result = "";
        for (var i = 0; i < original.length; i++) {
          result += charset[Math.floor(Math.random() * charset.length)];
        }
        text.textContent = result;
      }, speed);
    });
};

window._VeltroInitTypewriter = function () {
  document
    .querySelectorAll(".veltro-typewriter-wrap:not([data-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-init", "1");
      var text = wrap.querySelector(".veltro-typewriter-text");
      var original = wrap.dataset.text || "Hello, World!";
      var speed = +(wrap.dataset.speed || 80);
      var loop = wrap.dataset.loop !== "0";
      var delay = +(wrap.dataset.delay || 2000);
      var index = 0;
      function type() {
        if (!wrap.isConnected) return;
        if (index < original.length) {
          text.textContent += original.charAt(index);
          index++;
          setTimeout(type, speed);
        } else if (loop) {
          setTimeout(function () {
            text.textContent = "";
            index = 0;
            type();
          }, delay);
        }
      }
      type();
    });
};

window._VeltroInitCounter = function () {
  document
    .querySelectorAll(".veltro-counter-wrap:not([data-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-init", "1");
      var el = wrap.querySelector(".veltro-counter");
      var target = +(wrap.dataset.value || 1000);
      var prefix = wrap.dataset.prefix || "";
      var suffix = wrap.dataset.suffix || "+";
      var duration = +(wrap.dataset.duration || 2000);
      var startTime = Date.now();
      function update() {
        if (!wrap.isConnected) return;
        var elapsed = Date.now() - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(target * ease);
        el.textContent = prefix + current + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      update();
    });
};

window._VeltroInitLiquidText = function () {
  document
    .querySelectorAll(".veltro-liquid-wrap:not([data-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-init", "1");
      var chars = wrap.querySelectorAll(".veltro-liquid-char");
      var amplitude = +(wrap.dataset.amplitude || 10);
      var frequency = +(wrap.dataset.frequency || 0.05);
      var speed = +(wrap.dataset.speed || 0.02);
      var time = 0;
      var rafId = 0;
      function animate() {
        if (!wrap.isConnected) return;
        time += speed;
        chars.forEach(function (char, i) {
          var y = Math.sin(i * frequency + time) * amplitude;
          char.style.transform = "translateY(" + y + "px)";
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(wrap);
    });
};

window._VeltroInitBubblePop = function () {
  document
    .querySelectorAll(".veltro-bubble-wrap:not([data-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-init", "1");
      var canvas = wrap.querySelector(".veltro-bubble-canvas");
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var W, H;
      function resize() {
        var rect = wrap.getBoundingClientRect();
        W = rect.width;
        H = rect.height;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      var bubbleCount = +(wrap.dataset.bubbleCount || 20);
      var minSize = +(wrap.dataset.minSize || 20);
      var maxSize = +(wrap.dataset.maxSize || 60);
      var colors = (
        wrap.dataset.colors || "#ff6b35,#cdfe00,#3b82f6,#ec4899,#f59e0b"
      ).split(",");
      var bubbles = [];
      for (var i = 0; i < bubbleCount; i++) {
        bubbles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: minSize + Math.random() * (maxSize - minSize),
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          color: colors[i % colors.length],
        });
      }
      var rafId = 0;
      function animate() {
        if (!wrap.isConnected) return;
        ctx.clearRect(0, 0, W, H);
        bubbles.forEach(function (b) {
          b.x += b.vx;
          b.y += b.vy;
          if (b.x < 0 || b.x > W) b.vx *= -1;
          if (b.y < 0 || b.y > H) b.vy *= -1;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fillStyle = b.color;
          ctx.globalAlpha = 0.6;
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(wrap);
      wrap.addEventListener("click", function (e) {
        var rect = wrap.getBoundingClientRect();
        var mx = e.clientX - rect.left,
          my = e.clientY - rect.top;
        bubbles.forEach(function (b) {
          var dist = Math.hypot(b.x - mx, b.y - my);
          if (dist < b.r + 50) {
            b.vx = (b.x - mx) * 0.1;
            b.vy = (b.y - my) * 0.1;
          }
        });
      });
    });
};

window._VeltroInitTiltCards = function () {
  document
    .querySelectorAll(".veltro-tilt-wrap:not([data-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-init", "1");
      var card = wrap.querySelector(".veltro-tilt-card");
      var maxTilt = +(wrap.dataset.maxTilt || 15);
      wrap.style.perspective = (wrap.dataset.perspective || 1000) + "px";
      wrap.addEventListener("mousemove", function (e) {
        var rect = wrap.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          "rotateY(" + x * maxTilt + "deg) rotateX(" + -y * maxTilt + "deg)";
      });
      wrap.addEventListener("mouseleave", function () {
        card.style.transform = "rotateY(0) rotateX(0)";
      });
    });
};

window._VeltroInitAudioVisualizer = function () {
  document
    .querySelectorAll(".veltro-audio-wrap:not([data-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-init", "1");
      var bars = wrap.querySelectorAll(".veltro-audio-bar");
      var rafId = 0;
      function animate() {
        if (!wrap.isConnected) return;
        bars.forEach(function (bar) {
          var h = 20 + Math.random() * 80;
          bar.style.height = h + "%";
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(wrap);
    });
};

window._VeltroInitConstellation = function () {
  document
    .querySelectorAll(".veltro-const-wrap:not([data-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-init", "1");
      var canvas = wrap.querySelector(".veltro-const-canvas");
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var W, H;
      function resize() {
        var rect = wrap.getBoundingClientRect();
        W = rect.width;
        H = rect.height;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      var starCount = +(wrap.dataset.starCount || 80);
      var connDist = +(wrap.dataset.connectionDistance || 100);
      var starColor = wrap.dataset.starColor || "#cdfe00";
      var lineColor = wrap.dataset.lineColor || "rgba(205,254,0,0.2)";
      var stars = [];
      for (var i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: Math.random() * 2 + 1,
        });
      }
      var rafId = 0;
      function animate() {
        if (!wrap.isConnected) return;
        ctx.clearRect(0, 0, W, H);
        stars.forEach(function (s) {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0 || s.x > W) s.vx *= -1;
          if (s.y < 0 || s.y > H) s.vy *= -1;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = starColor;
          ctx.fill();
        });
        for (var i = 0; i < stars.length; i++) {
          for (var j = i + 1; j < stars.length; j++) {
            var dist = Math.hypot(
              stars[i].x - stars[j].x,
              stars[i].y - stars[j].y,
            );
            if (dist < connDist) {
              ctx.beginPath();
              ctx.moveTo(stars[i].x, stars[i].y);
              ctx.lineTo(stars[j].x, stars[j].y);
              ctx.strokeStyle = lineColor;
              ctx.lineWidth = 1 - dist / connDist;
              ctx.stroke();
            }
          }
        }
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(wrap);
    });
};

window._VeltroInitGeometryDraw = function () {
  document
    .querySelectorAll(".veltro-geo-wrap:not([data-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-init", "1");
      var canvas = wrap.querySelector(".veltro-geo-canvas");
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var W, H;
      function resize() {
        var rect = wrap.getBoundingClientRect();
        W = rect.width;
        H = rect.height;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      var color = wrap.dataset.color || "#cdfe00";
      var lineWidth = +(wrap.dataset.lineWidth || 3);
      var isDrawing = false;
      var lastX, lastY;
      canvas.addEventListener("mousedown", function (e) {
        isDrawing = true;
        var rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
      });
      canvas.addEventListener("mousemove", function (e) {
        if (!isDrawing) return;
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.stroke();
        lastX = x;
        lastY = y;
      });
      canvas.addEventListener("mouseup", function () {
        isDrawing = false;
      });
      canvas.addEventListener("mouseleave", function () {
        isDrawing = false;
      });
    });
};

// ── INITIALIZERS FOR BATCH 1: CURSOR ──
window._VeltroInitMultiShapeTrail = function () {
  document
    .querySelectorAll(".veltro-multishape-canvas:not([data-init])")
    .forEach(function (canvas) {
      canvas.setAttribute("data-init", "1");
      var wrap = canvas.closest(".veltro-multishape-wrap");
      if (!wrap) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var W = 0,
        H = 0;

      function resize() {
        W = wrap.offsetWidth || 400;
        H = wrap.offsetHeight || 400;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();

      var ds = wrap.dataset;
      var trailLength = +(ds.trailLength || 30);
      var particleSize = +(ds.particleSize || 8);
      var shapes = (ds.shapes || "circle,square,triangle,star")
        .split(",")
        .map(function (s) {
          return s.trim();
        });
      var colors = (ds.colors || "#ff6b35,#cdfe00,#3b82f6,#ec4899,#f59e0b")
        .split(",")
        .map(function (c) {
          return c.trim();
        });
      var speed = +(ds.speed || 1);
      var trailFade = ds.trailFade !== "false";
      var trailGlow = ds.trailGlow === "true";
      var trailBlur = ds.trailBlur === "true";
      var glowSize = +(ds.glowSize || 18);
      var shapeScale = +(ds.shapeScale || 1);
      var shapeOpacity = +(ds.shapeOpacity || 100) / 100;
      var shapeRotation = +(ds.shapeRotation || 0);
      var rotationSpeed = +(ds.rotationSpeed !== undefined
        ? ds.rotationSpeed
        : 2);
      var autonomousMode = ds.autonomousMode !== "false";
      var particleSpacing = +(ds.particleSpacing || 6);
      var colorMode = ds.colorMode || "palette";
      var velocityStretch = ds.velocityStretch === "true";
      var shapeOrder = ds.shapeOrder || "sequential";

      function hex2rgb(hex) {
        var h = hex.replace("#", "");
        if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        return [
          parseInt(h.slice(0, 2), 16),
          parseInt(h.slice(2, 4), 16),
          parseInt(h.slice(4, 6), 16),
        ];
      }
      function lerpColor(a, b, t) {
        try {
          var ra = hex2rgb(a),
            rb = hex2rgb(b);
          return (
            "rgb(" +
            Math.round(ra[0] + (rb[0] - ra[0]) * t) +
            "," +
            Math.round(ra[1] + (rb[1] - ra[1]) * t) +
            "," +
            Math.round(ra[2] + (rb[2] - ra[2]) * t) +
            ")"
          );
        } catch (e) {
          return a;
        }
      }

      function drawShape(
        type,
        x,
        y,
        size,
        color,
        alpha,
        rot,
        scaleX,
        scaleY,
        isLead,
      ) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha * shapeOpacity));
        ctx.translate(x, y);
        ctx.rotate((rot * Math.PI) / 180);
        if (scaleX !== 1 || scaleY !== 1) ctx.scale(scaleX, scaleY);
        if (trailGlow && isLead) {
          ctx.shadowBlur = glowSize;
          ctx.shadowColor = color;
        } else if (trailGlow) {
          ctx.shadowBlur = glowSize * alpha * 0.5;
          ctx.shadowColor = color;
        }
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.beginPath();
        var s = size;
        if (type === "circle") {
          ctx.arc(0, 0, s, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === "ring") {
          ctx.arc(0, 0, s, 0, Math.PI * 2);
          ctx.lineWidth = Math.max(1.5, s * 0.28);
          ctx.stroke();
        } else if (type === "square") {
          ctx.rect(-s * 0.88, -s * 0.88, s * 1.76, s * 1.76);
          ctx.fill();
        } else if (type === "diamond") {
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.65, 0);
          ctx.lineTo(0, s);
          ctx.lineTo(-s * 0.65, 0);
          ctx.closePath();
          ctx.fill();
        } else if (type === "triangle") {
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.866, s * 0.5);
          ctx.lineTo(-s * 0.866, s * 0.5);
          ctx.closePath();
          ctx.fill();
        } else if (type === "star") {
          for (var i = 0; i < 10; i++) {
            var a = (i * Math.PI) / 5 - Math.PI / 2;
            var r = i % 2 === 0 ? s : s * 0.42;
            if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
            else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          ctx.closePath();
          ctx.fill();
        } else if (type === "hexagon") {
          for (var j = 0; j < 6; j++) {
            var ha = (j * Math.PI) / 3 - Math.PI / 6;
            if (j === 0) ctx.moveTo(Math.cos(ha) * s, Math.sin(ha) * s);
            else ctx.lineTo(Math.cos(ha) * s, Math.sin(ha) * s);
          }
          ctx.closePath();
          ctx.fill();
        } else if (type === "cross") {
          var arm = s * 0.3;
          ctx.rect(-arm, -s, arm * 2, s * 2);
          ctx.rect(-s, -arm, s * 2, arm * 2);
          ctx.fill();
        } else if (type === "dot") {
          ctx.arc(0, 0, s * 0.38, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.arc(0, 0, s, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      var trail = [];
      var cursorX = W / 2,
        cursorY = H / 2;
      var targetX = W / 2,
        targetY = H / 2;
      var lastAddedX = -9999,
        lastAddedY = -9999;
      var prevCX = W / 2,
        prevCY = H / 2;
      var mouseInside = false;
      var totalRot = 0;
      var shapeIdx = 0;
      var autoT = Math.random() * Math.PI * 2;

      wrap.addEventListener("mouseenter", function () {
        mouseInside = true;
      });
      wrap.addEventListener("mouseleave", function () {
        mouseInside = false;
      });
      wrap.addEventListener("mousemove", function (e) {
        var r = wrap.getBoundingClientRect();
        targetX = e.clientX - r.left;
        targetY = e.clientY - r.top;
      });

      function getAutoTarget() {
        var cx = W * 0.5,
          cy = H * 0.5;
        return {
          x: cx + W * 0.36 * Math.sin(autoT * 1.27),
          y: cy + H * 0.28 * Math.sin(autoT * 0.73 + 1.1),
        };
      }

      var rafId = 0;
      function animate() {
        if (!wrap.isConnected) return;

        totalRot += rotationSpeed;
        autoT += 0.007 * speed;

        if (!mouseInside && autonomousMode) {
          var at = getAutoTarget();
          targetX = at.x;
          targetY = at.y;
          cursorX += (targetX - cursorX) * 0.035 * speed;
          cursorY += (targetY - cursorY) * 0.035 * speed;
        } else {
          cursorX += (targetX - cursorX) * 0.18;
          cursorY += (targetY - cursorY) * 0.18;
        }

        var velX = cursorX - prevCX;
        var velY = cursorY - prevCY;
        var vel = Math.hypot(velX, velY);
        prevCX = cursorX;
        prevCY = cursorY;

        var moved = Math.hypot(cursorX - lastAddedX, cursorY - lastAddedY);
        if (moved >= particleSpacing) {
          var shape, color;
          if (shapeOrder === "random") {
            shape = shapes[Math.floor(Math.random() * shapes.length)];
            color = colors[Math.floor(Math.random() * colors.length)];
          } else if (shapeOrder === "reverse") {
            var si = shapes.length - 1 - (shapeIdx % shapes.length);
            shape = shapes[si];
            color = colors[colors.length - 1 - (shapeIdx % colors.length)];
          } else {
            shape = shapes[shapeIdx % shapes.length];
            color = colors[shapeIdx % colors.length];
          }
          trail.unshift({
            x: cursorX,
            y: cursorY,
            shape: shape,
            color: color,
            rot: totalRot + shapeRotation,
            vx: velX,
            vy: velY,
            vel: vel,
          });
          shapeIdx++;
          lastAddedX = cursorX;
          lastAddedY = cursorY;
          if (trail.length > trailLength) trail.length = trailLength;
        }

        if (trailBlur) {
          ctx.fillStyle = "rgba(0,0,0,0.25)";
          ctx.fillRect(0, 0, W, H);
        } else {
          ctx.clearRect(0, 0, W, H);
        }

        var n = trail.length;
        for (var i = n - 1; i >= 0; i--) {
          var pt = trail[i];
          var progress = n > 1 ? i / (n - 1) : 0;
          var sz = particleSize * shapeScale * (1 - progress * 0.62);
          if (sz < 0.5) continue;

          var alpha = trailFade ? Math.pow(1 - progress, 1.15) : 0.9;
          var color;
          if (colorMode === "gradient" && colors.length > 1) {
            var ci = progress * (colors.length - 1);
            var lo = Math.floor(ci);
            var hi = Math.min(lo + 1, colors.length - 1);
            color = lerpColor(colors[lo], colors[hi], ci - lo);
          } else {
            color = pt.color;
          }

          var rot = pt.rot + i * 8;
          var sx = 1,
            sy = 1;
          if (velocityStretch && pt.vel > 1) {
            var stretch = Math.min(1 + pt.vel * 0.06, 2.2);
            var angle = Math.atan2(pt.vy, pt.vx);
            rot = (angle * 180) / Math.PI;
            sx = stretch;
            sy = 1 / Math.sqrt(stretch);
          }
          drawShape(
            pt.shape,
            pt.x,
            pt.y,
            sz,
            color,
            alpha,
            rot,
            sx,
            sy,
            i === 0,
          );
        }

        rafId = requestAnimationFrame(animate);
      }

      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(wrap);
    });
};

window._VeltroInitSpotlight = function () {
  document
    .querySelectorAll(".veltro-spotlight-mask:not([data-init])")
    .forEach(function (mask) {
      mask.setAttribute("data-init", "1");
      var wrap = mask.closest(".veltro-spotlight-wrap");
      if (!wrap) return;
      wrap.addEventListener("mousemove", function (e) {
        var r = wrap.getBoundingClientRect();
        var x = e.clientX - r.left;
        var y = e.clientY - r.top;
        mask.style.setProperty("--sx", x + "px");
        mask.style.setProperty("--sy", y + "px");
      });
    });
};

window._VeltroInitMagText = function () {
  document
    .querySelectorAll(".veltro-magtext-content:not([data-init])")
    .forEach(function (content) {
      content.setAttribute("data-init", "1");
      var wrap = content.closest(".veltro-magtext-wrap");
      if (!wrap) return;
      var chars = content.querySelectorAll(".veltro-mag-char");
      wrap.addEventListener("mousemove", function (e) {
        var r = wrap.getBoundingClientRect();
        var mx = e.clientX - r.left;
        var my = e.clientY - r.top;
        chars.forEach(function (char) {
          var rect = char.getBoundingClientRect();
          var wr = wrap.getBoundingClientRect();
          var cx = rect.left - wr.left + rect.width / 2;
          var cy = rect.top - wr.top + rect.height / 2;
          var dist = Math.hypot(mx - cx, my - cy);
          var radius = +char.dataset.magneticRadius || 150;
          var strength = +char.dataset.magneticStrength || 0.5;
          if (dist < radius) {
            var force = (1 - dist / radius) * strength * 30;
            var angle = Math.atan2(cy - my, cx - mx);
            var tx = Math.cos(angle) * force;
            var ty = Math.sin(angle) * force;
            char.style.transform = "translate(" + tx + "px," + ty + "px)";
          } else {
            char.style.transform = "translate(0,0)";
          }
        });
      });
      wrap.addEventListener("mouseleave", function () {
        chars.forEach(function (char) {
          char.style.transform = "translate(0,0)";
        });
      });
    });
};

window._VeltroInitDistortion = function () {
  document
    .querySelectorAll(".veltro-distort-canvas:not([data-init])")
    .forEach(function (canvas) {
      canvas.setAttribute("data-init", "1");
      var wrap = canvas.closest(".veltro-distort-wrap");
      if (!wrap) return;

      var ds = wrap.dataset;
      var lensR = +(ds.distortionRadius || 100);
      var strength = +(ds.distortionStrength || 0.3);
      var distType = ds.distortionType || "lens";
      var chromatic = ds.distortionChromatic === "true";
      var invert = ds.distortionInvert === "true";
      var overlayOn = ds.distortionOverlay !== "false";

      var bgImg = wrap.querySelector("img");
      if (!bgImg) return;

      var W = wrap.offsetWidth;
      var H = wrap.offsetHeight;

      // Zoom factor per type
      var zoom;
      if (distType === "pinch" || invert) {
        zoom = 1 / (1 + strength * 1.3);
      } else if (distType === "ripple") {
        zoom = 1;
      } else {
        zoom = 1 + strength * 1.5; // lens / swirl
      }

      // Lens element — uses CSS background to avoid CORS pixel access
      var lens = document.createElement("div");
      var lensD = lensR * 2;
      var swirlFilter =
        distType === "swirl"
          ? "hue-rotate(22deg) contrast(1.12) saturate(1.25)"
          : "";
      lens.style.cssText =
        "position:absolute;width:" +
        lensD +
        "px;height:" +
        lensD +
        "px;border-radius:50%;" +
        "background-image:url('" +
        bgImg.src +
        "');background-repeat:no-repeat;" +
        "pointer-events:none;display:none;transform:translate(-50%,-50%);" +
        "box-shadow:inset 0 0 0 1px rgba(255,255,255,0.18),0 8px 32px rgba(0,0,0,0.4);" +
        "will-change:left,top,background-position,background-size;" +
        "filter:" +
        swirlFilter;
      wrap.appendChild(lens);

      // Canvas for decorative overlay only
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvas.style.pointerEvents = "none";

      var mx = -9999,
        my = -9999,
        tmx = W / 2,
        tmy = H / 2;
      var active = false;
      var tick = 0;

      wrap.addEventListener("mousemove", function (e) {
        var r = wrap.getBoundingClientRect();
        tmx = e.clientX - r.left;
        tmy = e.clientY - r.top;
        if (!active) {
          mx = tmx;
          my = tmy;
        }
        active = true;
        lens.style.display = "block";
      });
      wrap.addEventListener("mouseleave", function () {
        active = false;
        lens.style.display = "none";
        ctx.clearRect(0, 0, W, H);
      });

      var rafId = 0;
      function render() {
        if (!canvas.isConnected) return;
        tick++;

        // Smooth follow
        mx += (tmx - mx) * 0.2;
        my += (tmy - my) * 0.2;

        // Background crop position
        var lz =
          distType === "ripple"
            ? 1 + Math.sin(tick * 0.055) * strength * 0.45
            : zoom;
        var bpx = lensR - mx * lz;
        var bpy = lensR - my * lz;
        lens.style.backgroundSize =
          Math.round(W * lz) + "px " + Math.round(H * lz) + "px";
        lens.style.backgroundPosition =
          Math.round(bpx) + "px " + Math.round(bpy) + "px";
        lens.style.left = Math.round(mx) + "px";
        lens.style.top = Math.round(my) + "px";

        // Canvas ring effects
        if (active) {
          ctx.clearRect(0, 0, W, H);

          // Outer ambient glow
          if (overlayOn) {
            var gOut = ctx.createRadialGradient(
              mx,
              my,
              lensR * 0.7,
              mx,
              my,
              lensR + 22,
            );
            gOut.addColorStop(0, "rgba(255,255,255,0)");
            gOut.addColorStop(0.65, "rgba(255,255,255,0.055)");
            gOut.addColorStop(1, "rgba(255,255,255,0)");
            ctx.beginPath();
            ctx.arc(mx, my, lensR + 22, 0, Math.PI * 2);
            ctx.fillStyle = gOut;
            ctx.fill();
          }

          // Chromatic aberration rings
          if (chromatic) {
            ctx.beginPath();
            ctx.arc(mx - 2, my - 1, lensR + 1, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255,55,55,0.5)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(mx + 2, my + 1, lensR + 1, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(55,80,255,0.5)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // Main lens border
          ctx.beginPath();
          ctx.arc(mx, my, lensR, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,255,255,0.3)";
          ctx.lineWidth = 1;
          ctx.stroke();

          // Inner specular arc (top-left)
          ctx.save();
          ctx.beginPath();
          ctx.arc(
            mx - lensR * 0.18,
            my - lensR * 0.18,
            lensR * 0.82,
            Math.PI * 1.1,
            Math.PI * 1.68,
          );
          ctx.strokeStyle = "rgba(255,255,255,0.22)";
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.restore();

          // Centre crosshair
          ctx.beginPath();
          ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.6)";
          ctx.fill();
        }

        rafId = requestAnimationFrame(render);
      }

      var onResize = function () {
        W = wrap.offsetWidth;
        H = wrap.offsetHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      window.addEventListener("resize", onResize);

      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(render);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(wrap);
    });
};

window._VeltroInitColorSampler = function () {
  document
    .querySelectorAll(".veltro-colorsampler-wrap:not([data-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-init", "1");
      var palette = wrap.querySelector(".veltro-color-palette");
      var swatches = palette.querySelectorAll(".veltro-color-swatch");
      var sampleSize = +wrap.dataset.sampleSize || 10;
      var paletteSize = +wrap.dataset.paletteSize || 5;
      var canvas = document.createElement("canvas");
      canvas.style.display = "none";
      wrap.appendChild(canvas);
      var ctx = canvas.getContext("2d");
      wrap.addEventListener("mousemove", function (e) {
        var r = wrap.getBoundingClientRect();
        var x = e.clientX - r.left;
        var y = e.clientY - r.top;
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        ctx.drawImage(
          wrap,
          x - sampleSize / 2,
          y - sampleSize / 2,
          sampleSize,
          sampleSize,
          0,
          0,
          sampleSize,
          sampleSize,
        );
        var pixel = ctx.getImageData(sampleSize / 2, sampleSize / 2, 1, 1).data;
        var color = "rgb(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + ")";
        swatches[0].style.background = color;
        for (var i = 1; i < paletteSize; i++) {
          swatches[i].style.background = swatches[i - 1].style.background;
        }
      });
    });
};

window._VeltroInitGravityCursor = function () {
  document
    .querySelectorAll(".veltro-gravity-canvas:not([data-init])")
    .forEach(function (canvas) {
      canvas.setAttribute("data-init", "1");
      var wrap = canvas.closest(".veltro-gravity-wrap");
      if (!wrap) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var rect = wrap.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      var W = rect.width,
        H = rect.height;
      var gravityStrength = +wrap.dataset.gravityStrength || 0.5;
      var particleCount = +wrap.dataset.particleCount || 50;
      var particleSize = +wrap.dataset.particleSize || 4;
      var particleColor = wrap.dataset.particleColor || "#cdfe00";
      var mouseX = W / 2,
        mouseY = H / 2;
      var particles = [];
      for (var i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * particleSize + 1,
        });
      }
      wrap.addEventListener("mousemove", function (e) {
        var r = wrap.getBoundingClientRect();
        mouseX = e.clientX - r.left;
        mouseY = e.clientY - r.top;
      });
      var rafId = 0;
      function animate() {
        if (!wrap.isConnected) return;
        ctx.fillStyle = "rgba(13,13,26,0.1)";
        ctx.fillRect(0, 0, W, H);
        particles.forEach(function (p) {
          var dx = mouseX - p.x;
          var dy = mouseY - p.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 5) {
            var force = (gravityStrength * 100) / (dist * dist);
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = particleColor;
          ctx.fill();
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(wrap);
    });
};

// ── Additional Widget Initializers ──

window._VeltroInitKineticText = function () {
  document
    .querySelectorAll(".fw-widget-kineticText:not([data-kinetic-init])")
    .forEach(function (el) {
      el.setAttribute("data-kinetic-init", "1");
    });
};

window._VeltroInitTextMask = function () {
  document
    .querySelectorAll(".fw-widget-textMask:not([data-mask-init])")
    .forEach(function (el) {
      el.setAttribute("data-mask-init", "1");
    });
};

window._VeltroInitMagneticCursor = function () {
  document
    .querySelectorAll(".fw-widget-magneticCursor:not([data-mag-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-mag-init", "1");
      var targets = wrap.querySelectorAll(".veltro-magnetic-target");
      wrap.addEventListener("mousemove", function (e) {
        var rect = wrap.getBoundingClientRect();
        var mx = e.clientX - rect.left,
          my = e.clientY - rect.top;
        targets.forEach(function (t) {
          var tr = t.getBoundingClientRect();
          var cx = tr.left + tr.width / 2 - rect.left;
          var cy = tr.top + tr.height / 2 - rect.top;
          var dx = mx - cx,
            dy = my - cy;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var strength = +t.dataset.magneticStrength || 0.3;
          var maxDist = +t.dataset.magneticRadius || 150;
          var pull = Math.max(0, 1 - dist / maxDist);
          t.style.transform =
            "translate(" +
            dx * pull * strength +
            "px," +
            dy * pull * strength +
            "px)";
        });
      });
      wrap.addEventListener("mouseleave", function () {
        targets.forEach(function (t) {
          t.style.transform = "";
        });
      });
    });
};

window._VeltroInitParticleTrail = function () {
  document
    .querySelectorAll(".fw-widget-particleTrail:not([data-trail-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-trail-init", "1");
      var canvas = wrap.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var W = (canvas.width = wrap.offsetWidth);
      var H = (canvas.height = wrap.offsetHeight);
      var particles = [];
      var color = wrap.dataset.trailColor || "#00d4ff";
      wrap.addEventListener("mousemove", function (e) {
        var rect = wrap.getBoundingClientRect();
        for (var i = 0; i < 3; i++) {
          particles.push({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 1,
            size: Math.random() * 3 + 1,
          });
        }
      });
      var rafId = 0;
      function animate() {
        if (!wrap.isConnected) return;
        ctx.clearRect(0, 0, W, H);
        for (var i = particles.length - 1; i >= 0; i--) {
          var p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.02;
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
          ctx.globalAlpha = p.life;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(wrap);
    });
};

window._VeltroInitCursorRipple = function () {
  document
    .querySelectorAll(".fw-widget-cursorRipple:not([data-ripple-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-ripple-init", "1");
      wrap.addEventListener("click", function (e) {
        var rect = wrap.getBoundingClientRect();
        var ripple = document.createElement("div");
        ripple.style.cssText =
          "position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);pointer-events:none;transform:translate(-50%,-50%) scale(0);animation:veltroRipple 0.6s ease-out forwards;";
        ripple.style.left = e.clientX - rect.left + "px";
        ripple.style.top = e.clientY - rect.top + "px";
        ripple.style.width = ripple.style.height = "20px";
        wrap.appendChild(ripple);
        setTimeout(function () {
          ripple.remove();
        }, 600);
      });
    });
};

window._VeltroInitCursorLens = function () {
  document
    .querySelectorAll(".fw-widget-cursorLens:not([data-lens-init])")
    .forEach(function (el) {
      el.setAttribute("data-lens-init", "1");
    });
};

window._VeltroInitStickyScrollStack = function () {
  document
    .querySelectorAll(".fw-widget-stickyScrollStack:not([data-sticky-init])")
    .forEach(function (el) {
      el.setAttribute("data-sticky-init", "1");
      var cards = el.querySelectorAll(".veltro-sticky-card");
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
            }
          });
        },
        { threshold: 0.2 },
      );
      cards.forEach(function (c) {
        observer.observe(c);
      });
    });
};

window._VeltroInitScrollVelocitySkew = function () {
  document
    .querySelectorAll(".fw-widget-scrollVelocitySkew:not([data-skew-init])")
    .forEach(function (el) {
      el.setAttribute("data-skew-init", "1");
      var targets = el.querySelectorAll(".veltro-skew-target");
      var lastScroll = 0,
        velocity = 0,
        rafId;
      function update() {
        var current = window.scrollY || window.pageYOffset;
        velocity = (current - lastScroll) * 0.1;
        lastScroll = current;
        velocity *= 0.9;
        targets.forEach(function (t) {
          t.style.transform =
            "skewY(" + Math.max(-5, Math.min(5, velocity)) + "deg)";
        });
        rafId = requestAnimationFrame(update);
      }
      update();
      el.addEventListener("remove", function () {
        cancelAnimationFrame(rafId);
      });
    });
};

window._VeltroInitParallaxImageStack = function () {
  document
    .querySelectorAll(".fw-widget-parallaxImageStack:not([data-parallax-init])")
    .forEach(function (el) {
      el.setAttribute("data-parallax-init", "1");
      var layers = el.querySelectorAll(".veltro-parallax-layer");
      window.addEventListener("scroll", function () {
        var rect = el.getBoundingClientRect();
        var progress = -rect.top / (rect.height + window.innerHeight);
        layers.forEach(function (layer, i) {
          var speed = +layer.dataset.parallaxSpeed || (i + 1) * 0.1;
          layer.style.transform =
            "translateY(" + progress * speed * 200 + "px)";
        });
      });
    });
};

window._VeltroInitMosaicAssemble = function () {
  document
    .querySelectorAll(".fw-widget-mosaicAssemble:not([data-mosaic-init])")
    .forEach(function (el) {
      el.setAttribute("data-mosaic-init", "1");
      var tiles = el.querySelectorAll(".veltro-mosaic-tile");
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry, i) {
            if (entry.isIntersecting) {
              setTimeout(function () {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "scale(1)";
              }, i * 50);
            }
          });
        },
        { threshold: 0.1 },
      );
      tiles.forEach(function (t) {
        observer.observe(t);
      });
    });
};

window._VeltroInitScrollProgressRing = function () {
  document
    .querySelectorAll(".fw-widget-scrollProgressRing:not([data-ring-init])")
    .forEach(function (el) {
      el.setAttribute("data-ring-init", "1");
      var circle = el.querySelector("circle");
      if (!circle) return;
      var circumference = 2 * Math.PI * (circle.r.baseVal.value || 45);
      circle.style.strokeDasharray = circumference;
      circle.style.strokeDashoffset = circumference;
      window.addEventListener("scroll", function () {
        var scrollTop = window.scrollY || window.pageYOffset;
        var docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        var progress = docHeight > 0 ? scrollTop / docHeight : 0;
        circle.style.strokeDashoffset = circumference * (1 - progress);
      });
    });
};

window._VeltroInitMagneticScroll = function () {
  document
    .querySelectorAll(".fw-widget-magneticScroll:not([data-magscroll-init])")
    .forEach(function (el) {
      el.setAttribute("data-magscroll-init", "1");
      var items = el.querySelectorAll(".veltro-magnetic-item");
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var mx = e.clientX - rect.left,
          my = e.clientY - rect.top;
        items.forEach(function (item) {
          var ir = item.getBoundingClientRect();
          var cx = ir.left + ir.width / 2 - rect.left;
          var cy = ir.top + ir.height / 2 - rect.top;
          var dx = mx - cx,
            dy = my - cy;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var pull = Math.max(0, 1 - dist / 200);
          item.style.transform =
            "translate(" + dx * pull * 0.2 + "px," + dy * pull * 0.2 + "px)";
        });
      });
      el.addEventListener("mouseleave", function () {
        items.forEach(function (item) {
          item.style.transform = "";
        });
      });
    });
};

window._VeltroInitMorphBlob = function () {
  document
    .querySelectorAll(".fw-widget-morphBlob:not([data-blob-init])")
    .forEach(function (el) {
      el.setAttribute("data-blob-init", "1");
      var blob = el.querySelector(".veltro-morph-blob");
      if (!blob) return;
      var t = 0;
      var rafId = 0;
      function animate() {
        t += 0.01;
        var r1 = 50 + Math.sin(t) * 10;
        var r2 = 50 + Math.cos(t * 1.3) * 10;
        var r3 = 50 + Math.sin(t * 0.7) * 10;
        var r4 = 50 + Math.cos(t * 1.1) * 10;
        blob.style.borderRadius =
          r1 +
          "% " +
          r2 +
          "% " +
          r3 +
          "% " +
          r4 +
          "% / " +
          r4 +
          "% " +
          r3 +
          "% " +
          r2 +
          "% " +
          r1 +
          "%";
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitNoiseGrain = function () {
  document
    .querySelectorAll(".fw-widget-noiseGrain:not([data-noise-init])")
    .forEach(function (el) {
      el.setAttribute("data-noise-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var W = (canvas.width = el.offsetWidth);
      var H = (canvas.height = el.offsetHeight);
      var imgData = ctx.createImageData(W, H);
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        for (var i = 0; i < imgData.data.length; i += 4) {
          var v = Math.random() * 255;
          imgData.data[i] = v;
          imgData.data[i + 1] = v;
          imgData.data[i + 2] = v;
          imgData.data[i + 3] = 15;
        }
        ctx.putImageData(imgData, 0, 0);
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitGradientFlow = function () {
  document
    .querySelectorAll(".fw-widget-gradientFlow:not([data-flow-init])")
    .forEach(function (el) {
      el.setAttribute("data-flow-init", "1");
      var bg = el.querySelector(".veltro-gradient-bg");
      if (!bg) return;
      var hue = 0;
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        hue = (hue + 0.2) % 360;
        bg.style.filter = "hue-rotate(" + hue + "deg)";
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitSectionBackground = function () {
  document
    .querySelectorAll(".fw-widget-sectionBackground:not([data-bg-init])")
    .forEach(function (el) {
      el.setAttribute("data-bg-init", "1");
    });
};

window._VeltroInitGlassmorphismStack = function () {
  document
    .querySelectorAll(".fw-widget-glassmorphismStack:not([data-glass-init])")
    .forEach(function (el) {
      el.setAttribute("data-glass-init", "1");
      var cards = el.querySelectorAll(".veltro-glass-card");
      cards.forEach(function (card, i) {
        card.style.transitionDelay = i * 100 + "ms";
      });
    });
};

window._VeltroInitGlitchSection = function () {
  document
    .querySelectorAll(".fw-widget-glitchSection:not([data-glitch-init])")
    .forEach(function (el) {
      el.setAttribute("data-glitch-init", "1");
      var text = el.querySelector(".veltro-glitch-text");
      if (!text) return;
      var original = text.textContent;
      var chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
      setInterval(function () {
        if (Math.random() > 0.9) {
          var glitched = original
            .split("")
            .map(function (c) {
              return Math.random() > 0.8
                ? chars[Math.floor(Math.random() * chars.length)]
                : c;
            })
            .join("");
          text.textContent = glitched;
          setTimeout(function () {
            text.textContent = original;
          }, 100);
        }
      }, 2000);
    });
};

window._VeltroInitDepthOfField = function () {
  document
    .querySelectorAll(".fw-widget-depthOfField:not([data-dof-init])")
    .forEach(function (el) {
      el.setAttribute("data-dof-init", "1");
      var layers = el.querySelectorAll(".veltro-dof-layer");
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        layers.forEach(function (layer, i) {
          var depth = +layer.dataset.dofDepth || i + 1;
          var moveX = (x - 0.5) * depth * 20;
          layer.style.transform = "translateX(" + -moveX + "px)";
        });
      });
    });
};

window._VeltroInitHolographicCard = function () {
  document
    .querySelectorAll(".fw-widget-holographicCard:not([data-holo-init])")
    .forEach(function (el) {
      el.setAttribute("data-holo-init", "1");
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        el.style.setProperty("--holo-x", x);
        el.style.setProperty("--holo-y", y);
      });
    });
};

window._VeltroInitSoundReactive = function () {
  document
    .querySelectorAll(".fw-widget-soundReactive:not([data-sound-init])")
    .forEach(function (el) {
      el.setAttribute("data-sound-init", "1");
      var bars = el.querySelectorAll(".veltro-sound-bar");
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        bars.forEach(function (bar) {
          var h = Math.random() * 80 + 20;
          bar.style.height = h + "%";
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitMirrorReflection = function () {
  document
    .querySelectorAll(".fw-widget-mirrorReflection:not([data-mirror-init])")
    .forEach(function (el) {
      el.setAttribute("data-mirror-init", "1");
    });
};

// ── Batch 2: Typography ──

window._VeltroInitWaveText = function () {
  document
    .querySelectorAll(".fw-widget-waveText:not([data-wave-init])")
    .forEach(function (el) {
      el.setAttribute("data-wave-init", "1");
      var chars = el.querySelectorAll(".veltro-wave-char");
      var t = 0;
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        t += 0.05;
        chars.forEach(function (c, i) {
          var y = Math.sin(t + i * 0.3) * 10;
          c.style.transform = "translateY(" + y + "px)";
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitRotatingText3d = function () {
  document
    .querySelectorAll(".fw-widget-rotatingText3d:not([data-rot3d-init])")
    .forEach(function (el) {
      el.setAttribute("data-rot3d-init", "1");
      var t = 0;
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        t += 0.5;
        el.style.transform = "perspective(500px) rotateY(" + t + "deg)";
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitMorphingText = function () {
  document
    .querySelectorAll(".fw-widget-morphingText:not([data-morph-init])")
    .forEach(function (el) {
      el.setAttribute("data-morph-init", "1");
      var wrap = el.querySelector(".veltro-morph-wrap");
      if (!wrap) return;
      var spans = wrap.querySelectorAll(".veltro-morph-word");
      if (!spans.length) return;

      var ds = wrap.dataset;
      var morphSpeed = +(ds.morphSpeed || 2000);
      var fadeSpeed = +(ds.fadeSpeed || 500);
      var direction = ds.morphDirection || "forward";
      var highlight = ds.highlight === "1";
      var highlightColor = ds.highlightColor || "#cdfe00";
      var dualColour = ds.dualColour === "1";
      var dualColour2 = ds.dualColour2 || "#3b82f6";
      var baseColor = wrap.querySelector(".veltro-morph-content")
        ? window.getComputedStyle(wrap.querySelector(".veltro-morph-content"))
            .color
        : "";

      var index = 0;

      function showWord(i) {
        spans.forEach(function (s, si) {
          if (si === i) {
            s.style.opacity = "1";
            if (highlight || dualColour) {
              s.style.color = dualColour
                ? i % 2 === 0
                  ? baseColor
                  : dualColour2
                : highlightColor;
            }
          } else {
            s.style.opacity = "0";
          }
        });
      }

      function nextIndex() {
        if (direction === "backward") {
          return (index - 1 + spans.length) % spans.length;
        }
        if (direction === "random") {
          var n;
          do {
            n = Math.floor(Math.random() * spans.length);
          } while (n === index && spans.length > 1);
          return n;
        }
        return (index + 1) % spans.length;
      }

      showWord(0);

      var timer = null;

      function tick() {
        spans[index].style.opacity = "0";
        setTimeout(function () {
          index = nextIndex();
          showWord(index);
        }, fadeSpeed);
      }

      function start() {
        if (timer) return;
        timer = setInterval(tick, morphSpeed);
      }

      function stop() {
        clearInterval(timer);
        timer = null;
      }

      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) start();
          else stop();
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitKineticScramble = function () {
  document
    .querySelectorAll(".fw-widget-kineticScramble:not([data-ks-init])")
    .forEach(function (el) {
      el.setAttribute("data-ks-init", "1");
      var text = el.querySelector(".veltro-ks-text");
      if (!text) return;
      var original = text.dataset.text || text.textContent;
      var chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      function scramble() {
        var progress = 0;
        var interval = setInterval(function () {
          progress += 0.05;
          var current = original
            .split("")
            .map(function (c, i) {
              if (i < progress * original.length) return original[i];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");
          text.textContent = current;
          if (progress >= 1) {
            clearInterval(interval);
            text.textContent = original;
          }
        }, 50);
      }
      setTimeout(scramble, 500);
    });
};

// ── Batch 3: Physics ──

window._VeltroInitGravityWells = function () {
  document
    .querySelectorAll(".fw-widget-gravityWells:not([data-gw-init])")
    .forEach(function (el) {
      el.setAttribute("data-gw-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      function resize() {
        canvas.width = el.offsetWidth * dpr;
        canvas.height = el.offsetHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      var W = el.offsetWidth;
      var H = el.offsetHeight;

      var wrap = el.querySelector(".veltro-gravwell-wrap") || el;
      var ds = wrap.dataset;
      var particleCount = +(ds.particleCount || 100);
      var wellStrength = +(ds.wellStrength || 0.5);
      var particleColor = ds.particleColor || "#cdfe00";
      var wellCount = +(ds.wellCount || 3);
      var wellRadius = +(ds.wellRadius || 20);
      var particleSize = +(ds.particleSize || 2);
      var particleTrail = ds.particleTrail !== "false";
      var wellMode = ds.wellMode || "attract";
      var randomColor = ds.particleRandomColor === "true";
      var wellGlow = ds.wellGlow !== "false";
      var glowColor = ds.glowColor || "#34d399";

      var particles = [];
      for (var i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: particleSize * (0.5 + Math.random()),
          hue: Math.random() * 360,
        });
      }

      var wells = [];
      function initWells(count) {
        wells = [];
        for (var i = 0; i < count; i++) {
          var angle = (i / count) * Math.PI * 2;
          var r = Math.min(W, H) * 0.3;
          wells.push({
            x: W / 2 + Math.cos(angle) * r,
            y: H / 2 + Math.sin(angle) * r,
            strength: wellStrength,
          });
        }
      }
      initWells(wellCount);

      el.addEventListener("click", function (e) {
        var rect = el.getBoundingClientRect();
        var mx = e.clientX - rect.left,
          my = e.clientY - rect.top;
        var closest = null,
          minDist = Infinity;
        wells.forEach(function (w) {
          var d = Math.hypot(w.x - mx, w.y - my);
          if (d < minDist) {
            minDist = d;
            closest = w;
          }
        });
        if (closest && minDist < Math.max(wellRadius * 2, 40)) {
          wells = wells.filter(function (w) {
            return w !== closest;
          });
        } else {
          wells.push({ x: mx, y: my, strength: wellStrength });
        }
      });

      var rafId = 0;
      function animate() {
        if (!canvas.isConnected) return;
        W = el.offsetWidth;
        H = el.offsetHeight;

        if (particleTrail) {
          ctx.fillStyle = "rgba(10,10,20,0.15)";
        } else {
          ctx.clearRect(0, 0, W, H);
        }
        ctx.fillRect(0, 0, W, H);

        wells.forEach(function (w) {
          if (wellGlow) {
            var grad = ctx.createRadialGradient(
              w.x,
              w.y,
              0,
              w.x,
              w.y,
              wellRadius * 3,
            );
            grad.addColorStop(0, glowColor + "40");
            grad.addColorStop(1, glowColor + "00");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(w.x, w.y, wellRadius * 3, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.beginPath();
          ctx.arc(w.x, w.y, wellRadius, 0, Math.PI * 2);
          ctx.strokeStyle = glowColor;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = glowColor + "30";
          ctx.fill();
        });

        particles.forEach(function (p) {
          wells.forEach(function (w) {
            var dx = w.x - p.x,
              dy = w.y - p.y;
            var dist = Math.sqrt(dx * dx + dy * dy) + 1;
            if (wellMode === "repel") {
              var force = (w.strength * 100) / (dist * dist);
              p.vx -= (dx / dist) * force;
              p.vy -= (dy / dist) * force;
            } else if (wellMode === "orbit") {
              var f = (w.strength * 30) / (dist + 10);
              p.vx += (-dy / dist) * f;
              p.vy += (dx / dist) * f;
            } else {
              var force = (w.strength * 50) / (dist * dist);
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          });
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;
          var col = randomColor
            ? "hsl(" + ((p.hue + Date.now() * 0.01) % 360) + ",70%,60%)"
            : particleColor;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = col;
          ctx.fill();
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
      window.addEventListener("resize", resize);
    });
};

window._VeltroInitFluidSimulation = function () {
  document
    .querySelectorAll(".fw-widget-fluidSimulation:not([data-fluid-init])")
    .forEach(function (el) {
      el.setAttribute("data-fluid-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var W, H;
      function resize() {
        W = el.offsetWidth;
        H = el.offsetHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();

      var wrap = el.querySelector(".veltro-fluid-wrap") || el;
      var ds = wrap.dataset;
      var particleCount = +(ds.particleCount || 200);
      var viscosity = +(ds.viscosity || 0.5);
      var color1 = ds.color1 || "#3b82f6";
      var color2 = ds.color2 || "#ec4899";
      var fluidMode = ds.fluidMode || "flow";
      var fluidDensity = +(ds.fluidDensity || 1);
      var fluidPressure = +(ds.fluidPressure || 0.5);
      var fluidTurbulence = +(ds.fluidTurbulence || 0.3);
      var colorBlend = ds.colorBlend || "gradient";
      var fluidOpacity = +(ds.fluidOpacity || 80) / 100;
      var fluidGlow = ds.fluidGlow !== "false";
      var mouseForce = +(ds.mouseForce || 5);
      var particleStyle = ds.particleStyle || "soft";
      var flowField = ds.flowField !== "false";
      var connectionLines = ds.connectionLines === "true";
      var glowSize = +(ds.glowSize || 12);

      function hexToRgb(h) {
        h = h.replace("#", "");
        return {
          r: parseInt(h.substring(0, 2), 16),
          g: parseInt(h.substring(2, 4), 16),
          b: parseInt(h.substring(4, 6), 16),
        };
      }
      var c1 = hexToRgb(color1);
      var c2 = hexToRgb(color2);
      function lerpColor(a, b, t) {
        t = Math.max(0, Math.min(1, t));
        return (
          "rgb(" +
          Math.round(a.r + (b.r - a.r) * t) +
          "," +
          Math.round(a.g + (b.g - a.g) * t) +
          "," +
          Math.round(a.b + (b.b - a.b) * t) +
          ")"
        );
      }

      var particles = [];
      for (var i = 0; i < particleCount; i++) {
        var spawnY =
          fluidMode === "fountain"
            ? H * 0.9 + Math.random() * H * 0.1
            : Math.random() * H;
        particles.push({
          x: Math.random() * W,
          y: spawnY,
          vx: (Math.random() - 0.5) * 2,
          vy:
            fluidMode === "fountain"
              ? -(Math.random() * 3 + 1)
              : (Math.random() - 0.5) * 2,
          size: (Math.random() * 2 + 1) * (fluidDensity || 1),
          phase: Math.random() * Math.PI * 2,
          baseColor: i / particleCount,
          randColor: Math.random(),
          life: Math.random(),
        });
      }

      var mouseX = W / 2,
        mouseY = H / 2,
        prevMouseX = W / 2,
        prevMouseY = H / 2;
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      });
      el.addEventListener("mouseleave", function () {
        prevMouseX = mouseX;
        prevMouseY = mouseY;
      });

      function flowNoise(x, y, t) {
        var s = 0.003;
        return (
          Math.sin(x * s + t * 0.7) * Math.cos(y * s * 1.3 + t * 0.5) +
          Math.sin(x * s * 2.1 - y * s * 0.9 + t * 1.1) * 0.5
        );
      }

      var tick = 0;
      var rafId = 0;
      var decay = Math.max(0.92, 1 - viscosity * 0.08);

      function animate() {
        if (!canvas.isConnected) return;
        tick += 0.016;

        var trailAlpha = Math.max(0.02, (1 - viscosity) * 0.18);
        ctx.fillStyle = "rgba(5,5,15," + trailAlpha + ")";
        ctx.fillRect(0, 0, W, H);

        var dmx = mouseX - prevMouseX;
        var dmy = mouseY - prevMouseY;
        var mouseSpeed = Math.sqrt(dmx * dmx + dmy * dmy);

        particles.forEach(function (p, pi) {
          // Mode-based autonomous forces
          if (fluidMode === "vortex") {
            var cx = W / 2,
              cy = H / 2;
            var vdx = p.x - cx,
              vdy = p.y - cy;
            var vd = Math.sqrt(vdx * vdx + vdy * vdy) + 1;
            var vf = 0.4 * fluidDensity;
            p.vx += (-vdy / vd) * vf;
            p.vy += (vdx / vd) * vf;
            p.vx -= (vdx / vd) * 0.02;
            p.vy -= (vdy / vd) * 0.02;
          } else if (fluidMode === "wave") {
            p.phase += 0.04;
            p.vy +=
              Math.sin(p.x * 0.015 + tick * 2 + p.phase) * 0.15 * fluidDensity;
            p.vx += Math.cos(p.y * 0.01 + tick * 1.5) * 0.05;
          } else if (fluidMode === "fountain") {
            p.vy -= 0.08 * fluidDensity;
            p.vx += (Math.random() - 0.5) * 0.1;
            if (p.y < -10) {
              p.x = W * 0.3 + Math.random() * W * 0.4;
              p.y = H * 0.95;
              p.vx = (Math.random() - 0.5) * 2;
              p.vy = -(Math.random() * 3 + 2);
            }
          } else if (fluidMode === "flow") {
            if (flowField) {
              var angle = flowNoise(p.x, p.y, tick) * Math.PI * 2;
              p.vx += Math.cos(angle) * 0.08 * fluidDensity;
              p.vy += Math.sin(angle) * 0.08 * fluidDensity;
            }
          }

          // Mouse interaction
          var dx = mouseX - p.x,
            dy = mouseY - p.y;
          var dist = Math.sqrt(dx * dx + dy * dy) + 1;
          if (dist < 160) {
            var f = (mouseForce * (1 - dist / 160)) / (viscosity + 0.1);
            if (fluidMode === "burst") {
              var ba = Math.atan2(dy, dx);
              p.vx -= Math.cos(ba) * f * 0.6;
              p.vy -= Math.sin(ba) * f * 0.6;
            } else if (fluidMode === "swirl") {
              p.vx += (-dy / dist) * f * 0.9;
              p.vy += (dx / dist) * f * 0.9;
            } else if (fluidMode === "vortex") {
              p.vx += (dx / dist) * f * 0.2 + dmx * 0.04;
              p.vy += (dy / dist) * f * 0.2 + dmy * 0.04;
            } else {
              p.vx += (dx / dist) * f * 0.25 + dmx * 0.06;
              p.vy += (dy / dist) * f * 0.25 + dmy * 0.06;
            }
          }

          // Turbulence
          p.vx += (Math.random() - 0.5) * fluidTurbulence * 0.25;
          p.vy += (Math.random() - 0.5) * fluidTurbulence * 0.25;

          // Damping
          p.vx *= decay;
          p.vy *= decay;

          // Pressure — sample a stride of particles, not just first 5
          if (fluidPressure > 0) {
            var stride = Math.max(1, Math.floor(particleCount / 12));
            for (var n = 0; n < particleCount; n += stride) {
              var q = particles[n];
              if (q === p) continue;
              var pdx = p.x - q.x,
                pdy = p.y - q.y;
              var pd = Math.sqrt(pdx * pdx + pdy * pdy) + 1;
              if (pd < 28) {
                var push = fluidPressure * (1 - pd / 28) * 0.025;
                p.vx += (pdx / pd) * push;
                p.vy += (pdy / pd) * push;
              }
            }
          }

          p.x += p.vx;
          p.y += p.vy;

          if (fluidMode !== "fountain") {
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;
          } else {
            if (p.x < 0 || p.x > W) p.vx *= -0.5;
          }

          // Color blending
          var blend;
          if (colorBlend === "random") {
            blend = p.randColor;
          } else if (colorBlend === "alternating") {
            blend = pi % 2 === 0 ? 0 : 1;
          } else if (colorBlend === "solid") {
            blend = 0;
          } else if (colorBlend === "velocity") {
            var spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            blend = Math.min(1, spd / 8);
          } else if (colorBlend === "position") {
            blend = p.x / W;
          } else {
            // gradient — index-based
            blend = p.baseColor;
          }
          var col = lerpColor(c1, c2, blend);

          // Draw particle
          if (fluidGlow) {
            ctx.shadowBlur = glowSize;
            ctx.shadowColor = col;
          }
          ctx.globalAlpha = fluidOpacity;

          if (particleStyle === "ring") {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size + 1, 0, Math.PI * 2);
            ctx.strokeStyle = col;
            ctx.lineWidth = 1;
            ctx.stroke();
          } else if (particleStyle === "soft") {
            var grad = ctx.createRadialGradient(
              p.x,
              p.y,
              0,
              p.x,
              p.y,
              p.size * 2.5,
            );
            grad.addColorStop(0, col);
            grad.addColorStop(1, "rgba(0,0,0,0)");
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = col;
            ctx.fill();
          }

          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        });

        // Connection lines
        if (connectionLines) {
          var lineThresh = 60;
          ctx.globalAlpha = fluidOpacity * 0.3;
          for (var a = 0; a < particles.length; a += 2) {
            for (var b2 = a + 1; b2 < particles.length; b2 += 2) {
              var ldx = particles[a].x - particles[b2].x;
              var ldy = particles[a].y - particles[b2].y;
              var ld = Math.sqrt(ldx * ldx + ldy * ldy);
              if (ld < lineThresh) {
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b2].x, particles[b2].y);
                ctx.strokeStyle = lerpColor(c1, c2, particles[a].baseColor);
                ctx.lineWidth = (1 - ld / lineThresh) * 1.5;
                ctx.stroke();
              }
            }
          }
          ctx.globalAlpha = 1;
        }

        rafId = requestAnimationFrame(animate);
      }

      function onResize() {
        resize();
      }
      window.addEventListener("resize", onResize);

      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);

      el.addEventListener("disconnected", function () {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", onResize);
      });
    });
};

window._VeltroInitClothSimulation = function () {
  document
    .querySelectorAll(".fw-widget-clothSimulation:not([data-cloth-init])")
    .forEach(function (el) {
      el.setAttribute("data-cloth-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      function resize() {
        canvas.width = el.offsetWidth * dpr;
        canvas.height = el.offsetHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      var W = el.offsetWidth;
      var H = el.offsetHeight;

      var wrap = el.querySelector(".veltro-cloth-wrap") || el;
      var ds = wrap.dataset;
      var cols = +(ds.cols || 20);
      var rows = +(ds.rows || 15);
      var stiffness = +(ds.stiffness || 0.9);
      var damping = +(ds.damping || 0.9);
      var color = ds.color || "#cdfe00";
      var clothGravity = +(ds.clothGravity || 0.5);
      var clothWind = ds.clothWind === "true";
      var windStrength = +(ds.windStrength || 0.2);
      var lineWidth = +(ds.lineWidth || 1);
      var lineOpacity = +(ds.lineOpacity || 80) / 100;
      var pinEdges = ds.pinEdges || "top";
      var mouseTear = ds.mouseTear === "true";
      var tearForce = +(ds.tearForce || 10);
      var useGradient = ds.useGradient === "true";

      var spacing = Math.min(W / (cols + 1), H / (rows + 1), 25);
      var offsetX = (W - (cols - 1) * spacing) / 2;
      var offsetY = 40;

      function hexToRgb(h) {
        h = h.replace("#", "");
        return {
          r: parseInt(h.substring(0, 2), 16),
          g: parseInt(h.substring(2, 4), 16),
          b: parseInt(h.substring(4, 6), 16),
        };
      }

      var pointColor = hexToRgb(color);

      var points = [];
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var px = x * spacing + offsetX;
          var py = y * spacing + offsetY;
          var pinned =
            (pinEdges === "top" && y === 0) ||
            (pinEdges === "all" &&
              (y === 0 || y === rows - 1 || x === 0 || x === cols - 1));
          points.push({
            x: px,
            y: py,
            ox: px,
            oy: py,
            vx: 0,
            vy: 0,
            pinned: pinned,
            active: true,
          });
        }
      }

      var mouseX = 0,
        mouseY = 0,
        prevMouseX = 0,
        prevMouseY = 0,
        mouseDown = false;
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      });
      el.addEventListener("mousedown", function () {
        mouseDown = true;
      });
      el.addEventListener("mouseup", function () {
        mouseDown = false;
      });
      el.addEventListener("mouseleave", function () {
        mouseDown = false;
      });

      var windTime = 0;

      var rafId = 0;
      function animate() {
        if (!canvas.isConnected) return;
        W = el.offsetWidth;
        H = el.offsetHeight;
        windTime += 0.02;

        ctx.clearRect(0, 0, W, H);

        var windX = clothWind ? Math.sin(windTime) * windStrength * 3 : 0;

        points.forEach(function (p) {
          if (p.pinned || !p.active) return;

          var dx = mouseX - p.x,
            dy = mouseY - p.y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (mouseDown) {
            if (dist < 60) {
              var pf = 1 - dist / 60;
              p.vx += dx * pf * 0.03;
              p.vy += dy * pf * 0.03;
            }
            if (mouseTear && dist < 20) {
              var tearDist =
                Math.abs(prevMouseX - mouseX) + Math.abs(prevMouseY - mouseY);
              if (tearDist > tearForce) {
                p.active = false;
                return;
              }
            }
          }

          p.vy += clothGravity * 0.5;
          p.vx += windX * 0.05;
          p.vx += (p.ox - p.x) * stiffness * 0.02;
          p.vy += (p.oy - p.y) * stiffness * 0.02;
          p.vx *= damping * 0.97 + 0.03;
          p.vy *= damping * 0.97 + 0.03;
          p.x += p.vx;
          p.y += p.vy;
        });

        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        var maxDist = spacing * 2.5;

        for (var y = 0; y < rows; y++) {
          for (var x = 0; x < cols - 1; x++) {
            var idx = y * cols + x;
            var p1 = points[idx],
              p2 = points[idx + 1];
            if (!p1.active || !p2.active) continue;
            if (Math.hypot(p1.x - p2.x, p1.y - p2.y) > maxDist) continue;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
        for (var x = 0; x < cols; x++) {
          for (var y = 0; y < rows - 1; y++) {
            var idx = y * cols + x;
            var p1 = points[idx],
              p2 = points[idx + cols];
            if (!p1.active || !p2.active) continue;
            if (Math.hypot(p1.x - p2.x, p1.y - p2.y) > maxDist) continue;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }

        if (useGradient) {
          var grad = ctx.createLinearGradient(0, 0, W, H);
          var c2r = Math.min(255, pointColor.r + 80);
          var c2g = Math.min(255, pointColor.g + 80);
          var c2b = Math.min(255, pointColor.b + 80);
          grad.addColorStop(
            0,
            "rgba(" +
              pointColor.r +
              "," +
              pointColor.g +
              "," +
              pointColor.b +
              "," +
              lineOpacity +
              ")",
          );
          grad.addColorStop(
            1,
            "rgba(" + c2r + "," + c2g + "," + c2b + "," + lineOpacity + ")",
          );
          ctx.strokeStyle = grad;
        } else {
          ctx.strokeStyle =
            "rgba(" +
            pointColor.r +
            "," +
            pointColor.g +
            "," +
            pointColor.b +
            "," +
            lineOpacity +
            ")";
        }
        ctx.stroke();
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
      window.addEventListener("resize", resize);
    });
};

window._VeltroInitMagneticFields = function () {
  document
    .querySelectorAll(".fw-widget-magneticFields:not([data-mf-init])")
    .forEach(function (el) {
      el.setAttribute("data-mf-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var W = (canvas.width = el.offsetWidth);
      var H = (canvas.height = el.offsetHeight);
      var particles = [];
      for (var i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          angle: Math.random() * Math.PI * 2,
        });
      }
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        ctx.fillStyle = "rgba(8,8,16,0.1)";
        ctx.fillRect(0, 0, W, H);
        particles.forEach(function (p) {
          var dx = W / 2 - p.x,
            dy = H / 2 - p.y;
          var dist = Math.sqrt(dx * dx + dy * dy) + 1;
          var force = 100 / dist;
          p.angle += force * 0.05;
          p.x += Math.cos(p.angle) * 2;
          p.y += Math.sin(p.angle) * 2;
          if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) {
            p.x = Math.random() * W;
            p.y = Math.random() * H;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = "#ff6b6b";
          ctx.fill();
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitPendulumWave = function () {
  document
    .querySelectorAll(".fw-widget-pendulumWave:not([data-pw-init])")
    .forEach(function (el) {
      el.setAttribute("data-pw-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");

      var wrap = el.querySelector("[class*='pendulum-wrap']") || el;
      var ds = wrap.dataset;
      var count = Math.max(2, +(ds.count || 12));
      var speed = +(ds.speed || 1);
      var color = ds.color || "#cdfe00";
      var color2 = ds.color2 || "#3b82f6";
      var colorMode = ds.colorMode || "single";
      var lineColor = ds.lineColor || "";
      var trailOn = ds.showTrail === "true";
      var trailLen = Math.max(5, +(ds.trailLength || 20));
      var amp = +(ds.amplitude || 80);
      var pLen = Math.max(30, +(ds.pendulumLength || 100));
      var bobSize = Math.max(2, +(ds.bobSize || 6));
      var lineW = Math.max(0, +(ds.lineWidth || 1));
      var gravity = +(ds.gravity || 1);
      var layout = ds.layout || "bottom";
      var bobShape = ds.bobShape || "circle";
      var glow = ds.glow === "true";
      var waveMode = ds.waveMode || "sine";

      function resize() {
        canvas.width = el.offsetWidth;
        canvas.height = el.offsetHeight;
      }
      resize();
      var W = canvas.width,
        H = canvas.height;

      var pendulums = [],
        trails = [];
      for (var i = 0; i < count; i++) {
        var ratio = i / Math.max(count - 1, 1);
        if (layout === "center") {
          var a = (i / count) * Math.PI * 2;
          var r = Math.min(W, H) * 0.25;
          pendulums.push({
            ax: W / 2 + Math.cos(a) * r,
            ay: H / 2 + Math.sin(a) * r,
            len: pLen * (0.6 + ratio * 0.6),
            angle: 0.3,
            vel: 0,
            phase: ratio * Math.PI * 0.8,
            freq:
              waveMode === "progressive"
                ? 0.7 + ratio * 0.3
                : 0.88 + ratio * 0.12,
          });
        } else if (layout === "scattered") {
          pendulums.push({
            ax: 30 + Math.random() * Math.max(W - 60, 1),
            ay: 30 + Math.random() * Math.max(H * 0.3, 1),
            len: pLen * (0.5 + Math.random() * 0.8),
            angle: 0.15 + Math.random() * 0.2,
            vel: 0,
            phase: Math.random() * Math.PI * 2,
            freq: 0.8 + Math.random() * 0.4,
          });
        } else {
          pendulums.push({
            ax: ((i + 0.5) / count) * W,
            ay: Math.min(H * 0.12, 40),
            len: pLen * (0.7 + ratio * 0.6),
            angle: Math.PI / 4,
            vel: 0,
            phase: ratio * Math.PI * 0.8,
            freq: 0.02 + ratio * 0.012,
          });
        }
        if (trailOn) trails.push([]);
      }

      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var mx = e.clientX - rect.left,
          my = e.clientY - rect.top;
        for (var k = 0; k < pendulums.length; k++) {
          var p = pendulums[k];
          var dx = mx - p.ax,
            dy = my - p.ay;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < p.len * 1.5) {
            p.angle += (dx > 0 ? 1 : -1) * (1 - dist / (p.len * 1.5)) * 0.005;
          }
        }
      });

      function drawBob(x, y, r, col) {
        ctx.beginPath();
        if (bobShape === "ring") {
          ctx.arc(x, y, r, 0, 7);
          ctx.strokeStyle = col;
          ctx.lineWidth = Math.max(2, r * 0.35);
          ctx.stroke();
        } else if (bobShape === "diamond") {
          ctx.moveTo(x, y - r * 1.4);
          ctx.lineTo(x + r, y);
          ctx.lineTo(x, y + r * 1.4);
          ctx.lineTo(x - r, y);
          ctx.closePath();
          ctx.fillStyle = col;
          ctx.fill();
        } else if (bobShape === "drop") {
          ctx.moveTo(x, y - r * 1.6);
          ctx.bezierCurveTo(
            x + r,
            y - r * 0.3,
            x + r,
            y + r * 1,
            x,
            y + r * 1.2,
          );
          ctx.bezierCurveTo(
            x - r,
            y + r * 1,
            x - r,
            y - r * 0.3,
            x,
            y - r * 1.6,
          );
          ctx.closePath();
          ctx.fillStyle = col;
          ctx.fill();
        } else {
          ctx.arc(x, y, r, 0, 7);
          ctx.fillStyle = col;
          ctx.fill();
        }
      }

      var t = 0;
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        t += 0.016 * speed;
        if (trailOn) {
          ctx.fillStyle = "rgba(5,5,15,0.1)";
          ctx.fillRect(0, 0, W, H);
        } else {
          ctx.fillStyle = "#0d0d1a";
          ctx.fillRect(0, 0, W, H);
        }

        for (var k = 0; k < pendulums.length; k++) {
          var p = pendulums[k];
          var ratio = k / Math.max(count - 1, 1);
          var angle;

          if (waveMode === "bounce") {
            angle = Math.sin(t * p.freq * 3 + p.phase) * 0.6;
          } else if (waveMode === "chaos") {
            angle =
              Math.sin(t * 0.7 + p.phase) * 0.4 +
              Math.sin(t * 1.3 + ratio * 2) * 0.3;
          } else if (waveMode === "progressive") {
            angle = Math.sin(t * (0.8 + ratio * 0.2) + ratio * 1.5) * 0.5;
          } else if (layout === "bottom") {
            angle = p.angle * Math.cos(t * p.freq * 10 + p.phase);
          } else {
            angle = Math.sin(t * p.freq * 8 + p.phase) * 0.5;
          }

          var bx = p.ax + Math.sin(angle) * p.len * (amp / 80);
          var by = p.ay + Math.cos(angle) * p.len;

          if (trailOn && trails[k]) {
            trails[k].push([bx, by]);
            if (trails[k].length > trailLen) trails[k].shift();
          }

          var col;
          if (colorMode === "rainbow") {
            col = "hsl(" + (((k * 360) / count + t * 50) % 360) + ",80%,60%)";
          } else if (colorMode === "gradient") {
            var h1 = parseInt(color.slice(1, 3), 16),
              h2 = parseInt(color.slice(3, 5), 16),
              h3 = parseInt(color.slice(5, 7), 16);
            var t1 = parseInt(color2.slice(1, 3), 16),
              t2 = parseInt(color2.slice(3, 5), 16),
              t3 = parseInt(color2.slice(5, 7), 16);
            col =
              "rgb(" +
              Math.round(h1 + (t1 - h1) * ratio) +
              "," +
              Math.round(h2 + (t2 - h2) * ratio) +
              "," +
              Math.round(h3 + (t3 - h3) * ratio) +
              ")";
          } else {
            col = color;
          }

          if (glow) {
            ctx.shadowBlur = bobSize * 4;
            ctx.shadowColor = col;
          }

          if (trailOn && trails[k] && trails[k].length > 1) {
            for (var j = 1; j < trails[k].length; j++) {
              var a = j / trails[k].length;
              ctx.beginPath();
              ctx.arc(
                trails[k][j][0],
                trails[k][j][1],
                bobSize * a * 0.3,
                0,
                7,
              );
              ctx.fillStyle = col;
              ctx.globalAlpha = a * 0.3;
              ctx.fill();
            }
            ctx.globalAlpha = 1;
          }

          ctx.beginPath();
          ctx.moveTo(p.ax, p.ay);
          ctx.lineTo(bx, by);
          ctx.strokeStyle = lineColor || col;
          ctx.lineWidth = lineW;
          ctx.stroke();

          drawBob(bx, by, bobSize, col);
          ctx.shadowBlur = 0;
        }
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};
window._VeltroInitCollisionChaos = function () {
  document
    .querySelectorAll(".fw-widget-collisionChaos:not([data-cc-init])")
    .forEach(function (el) {
      el.setAttribute("data-cc-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var W, H;
      function resize() {
        W = el.offsetWidth;
        H = el.offsetHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();

      var wrap = el.querySelector(".veltro-chaos-wrap") || el;
      var ds = wrap.dataset;
      var spawnRate = +(ds.spawnRate || 1);
      var gravityStr = +(ds.gravity || 1) * 0.18;
      var restitution = +(ds.restitution || 0.7);
      var ballShape = ds.ballShape || "circle";
      var rawColors = (
        ds.ballColors || "#ff6b35,#cdfe00,#3b82f6,#ec4899,#f59e0b"
      ).split(",");
      var ballMinSize = +(ds.ballMinSize || 10);
      var ballMaxSize = +(ds.ballMaxSize || 30);
      var maxBalls = +(ds.maxBalls || 50);
      var ballGlow = ds.ballGlow !== "false";
      var friction = +(ds.friction || 0.99);
      var ballStyle = ds.ballStyle || "glass";
      var trailLength = +(ds.trailLength !== undefined ? ds.trailLength : 40);
      var spawnOnClick = ds.spawnOnClick !== "false";
      var trailAlpha = Math.max(0.04, Math.min(0.95, 1 - trailLength / 110));

      function hexToRgb(h) {
        h = (h || "#ffffff").replace("#", "").trim();
        if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        return [
          parseInt(h.slice(0, 2), 16),
          parseInt(h.slice(2, 4), 16),
          parseInt(h.slice(4, 6), 16),
        ];
      }

      var shapes = ["circle", "square", "triangle", "diamond"];
      var balls = [];
      var spawnAccum = 0;

      function pickShape() {
        return ballShape === "mixed"
          ? shapes[Math.floor(Math.random() * shapes.length)]
          : ballShape;
      }

      function spawnBall(x, y, burst) {
        if (balls.length >= maxBalls) return;
        var r = ballMinSize + Math.random() * (ballMaxSize - ballMinSize);
        var col =
          rawColors[Math.floor(Math.random() * rawColors.length)].trim();
        balls.push({
          x: x !== undefined ? x : r + Math.random() * (W - r * 2),
          y: y !== undefined ? y : -r - Math.random() * 40,
          vx: burst
            ? Math.cos(Math.random() * Math.PI * 2) * (3 + Math.random() * 5)
            : (Math.random() - 0.5) * 3,
          vy: burst
            ? Math.sin(Math.random() * Math.PI * 2) * (3 + Math.random() * 5)
            : Math.random() * 2 + 0.5,
          r: r,
          color: col,
          rgb: hexToRgb(col),
          shape: pickShape(),
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.08,
          born: 0,
          scale: burst ? 0 : 1,
        });
      }

      for (var i = 0; i < Math.min(20, maxBalls); i++) {
        var initR = ballMinSize + Math.random() * (ballMaxSize - ballMinSize);
        var col0 =
          rawColors[Math.floor(Math.random() * rawColors.length)].trim();
        balls.push({
          x: initR + Math.random() * (W - initR * 2),
          y: initR + Math.random() * (H - initR * 2),
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          r: initR,
          color: col0,
          rgb: hexToRgb(col0),
          shape: pickShape(),
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.06,
          born: 0,
          scale: 1,
        });
      }

      if (spawnOnClick) {
        el.addEventListener("click", function (e) {
          var rect = el.getBoundingClientRect();
          var cx = e.clientX - rect.left,
            cy = e.clientY - rect.top;
          var burst = Math.min(6, maxBalls - balls.length);
          for (var k = 0; k < burst; k++) spawnBall(cx, cy, true);
        });
      }

      function drawBall(b) {
        ctx.save();
        ctx.translate(b.x, b.y);
        if (b.shape !== "circle") ctx.rotate(b.rot);
        if (b.scale !== 1) ctx.scale(b.scale, b.scale);

        var r = b.r;
        ctx.beginPath();
        if (b.shape === "square") {
          ctx.rect(-r, -r, r * 2, r * 2);
        } else if (b.shape === "triangle") {
          ctx.moveTo(0, -r);
          ctx.lineTo(r * 0.866, r * 0.5);
          ctx.lineTo(-r * 0.866, r * 0.5);
          ctx.closePath();
        } else if (b.shape === "diamond") {
          ctx.moveTo(0, -r * 1.1);
          ctx.lineTo(r * 0.75, 0);
          ctx.lineTo(0, r * 1.1);
          ctx.lineTo(-r * 0.75, 0);
          ctx.closePath();
        } else {
          ctx.arc(0, 0, r, 0, Math.PI * 2);
        }

        if (ballStyle === "glass") {
          var grad = ctx.createRadialGradient(
            -r * 0.3,
            -r * 0.35,
            r * 0.05,
            0,
            0,
            r * 1.05,
          );
          grad.addColorStop(0, "rgba(255,255,255,0.6)");
          grad.addColorStop(0.3, b.color);
          grad.addColorStop(
            1,
            "rgba(" + b.rgb[0] + "," + b.rgb[1] + "," + b.rgb[2] + ",0.35)",
          );
          if (ballGlow) {
            ctx.shadowBlur = r * 1.4;
            ctx.shadowColor = b.color;
          }
          ctx.fillStyle = grad;
          ctx.fill();
          // rim light
          ctx.strokeStyle = "rgba(255,255,255,0.2)";
          ctx.lineWidth = 1;
          ctx.stroke();
          // specular blob
          ctx.beginPath();
          ctx.ellipse(
            -r * 0.22,
            -r * 0.28,
            r * 0.3,
            r * 0.16,
            -0.5,
            0,
            Math.PI * 2,
          );
          ctx.fillStyle = "rgba(255,255,255,0.28)";
          ctx.shadowBlur = 0;
          ctx.fill();
        } else if (ballStyle === "neon") {
          ctx.shadowBlur = r * 2.5;
          ctx.shadowColor = b.color;
          ctx.fillStyle =
            "rgba(" + b.rgb[0] + "," + b.rgb[1] + "," + b.rgb[2] + ",0.15)";
          ctx.fill();
          ctx.strokeStyle = b.color;
          ctx.lineWidth = 2;
          ctx.stroke();
          // inner ring
          ctx.beginPath();
          if (b.shape === "circle") ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,255,255,0.5)";
          ctx.lineWidth = 1;
          ctx.shadowBlur = r;
          ctx.stroke();
        } else {
          // solid
          if (ballGlow) {
            ctx.shadowBlur = r * 0.8;
            ctx.shadowColor = b.color;
          }
          ctx.fillStyle = b.color;
          ctx.fill();
        }

        ctx.restore();
      }

      var tick = 0;
      var rafId = 0;

      function animate() {
        if (!canvas.isConnected) return;
        tick++;

        ctx.fillStyle = "rgba(5,5,20," + trailAlpha + ")";
        ctx.fillRect(0, 0, W, H);

        // Auto-spawn
        spawnAccum += spawnRate * 0.016;
        while (spawnAccum >= 1 && balls.length < maxBalls) {
          spawnBall();
          spawnAccum -= 1;
        }

        // Physics update
        for (var i = 0; i < balls.length; i++) {
          var b = balls[i];
          b.born++;
          if (b.scale < 1) b.scale = Math.min(1, b.scale + 0.08);

          b.vy += gravityStr;
          b.vx *= friction;
          b.vy *= friction;
          b.x += b.vx;
          b.y += b.vy;
          b.rot += b.rotV;

          // Wall bounce
          if (b.x - b.r < 0) {
            b.x = b.r;
            b.vx = Math.abs(b.vx) * restitution;
            b.rotV *= -0.5;
          }
          if (b.x + b.r > W) {
            b.x = W - b.r;
            b.vx = -Math.abs(b.vx) * restitution;
            b.rotV *= -0.5;
          }
          if (b.y + b.r > H) {
            b.y = H - b.r;
            b.vy = -Math.abs(b.vy) * restitution;
            b.vx *= 0.97;
          }
          if (b.y - b.r < 0) {
            b.y = b.r;
            b.vy = Math.abs(b.vy) * restitution;
          }
        }

        // Ball-to-ball collisions
        for (var a = 0; a < balls.length; a++) {
          for (var bb = a + 1; bb < balls.length; bb++) {
            var ba = balls[a],
              bbb = balls[bb];
            var dx = bbb.x - ba.x,
              dy = bbb.y - ba.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            var minD = ba.r + bbb.r;
            if (dist < minD && dist > 0.001) {
              var nx = dx / dist,
                ny = dy / dist;
              var overlap = (minD - dist) * 0.52;
              ba.x -= nx * overlap;
              ba.y -= ny * overlap;
              bbb.x += nx * overlap;
              bbb.y += ny * overlap;
              var dvx = bbb.vx - ba.vx,
                dvy = bbb.vy - ba.vy;
              var dot = dvx * nx + dvy * ny;
              if (dot < 0) {
                var j = dot * restitution;
                ba.vx += j * nx;
                ba.vy += j * ny;
                bbb.vx -= j * nx;
                bbb.vy -= j * ny;
                // Spin exchange on impact
                ba.rotV += j * 0.03;
                bbb.rotV -= j * 0.03;
              }
            }
          }
        }

        // Draw — clear shadow before each frame of drawing
        ctx.shadowBlur = 0;
        for (var d = 0; d < balls.length; d++) drawBall(balls[d]);
        ctx.shadowBlur = 0;

        rafId = requestAnimationFrame(animate);
      }

      var onResize = function () {
        resize();
      };
      window.addEventListener("resize", onResize);

      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitBlackHole = function () {
  document
    .querySelectorAll(".fw-widget-blackHole:not([data-bh-init])")
    .forEach(function (el) {
      el.setAttribute("data-bh-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var W, H;
      function resize() {
        W = el.offsetWidth;
        H = el.offsetHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();

      var wrap = el.querySelector(".veltro-blackhole-wrap") || el;
      var ds = wrap.dataset;
      var particleCount = +(ds.particleCount || 150);
      var pullStrength = +(ds.pullStrength || 0.5);
      var accretionColor = ds.accretionColor || "#ff6b35";
      var bhSize = +(ds.blackHoleSize || 30);
      var eventHorizon = +(ds.eventHorizon || 50);
      var particleSize = +(ds.particleSize || 2);
      var particleTrail = ds.particleTrail !== "false";
      var accretionDisk = ds.accretionDisk !== "false";
      var diskOpacity = +(ds.diskOpacity || 60) / 100;
      var particleGlow = ds.particleGlow !== "false";
      var jetEnabled = ds.jetEnabled === "true";
      var jetColor = ds.jetColor || "#7c3aed";

      function hexToRgb(h) {
        h = (h || "#ffffff").replace("#", "");
        return [
          parseInt(h.slice(0, 2), 16),
          parseInt(h.slice(2, 4), 16),
          parseInt(h.slice(4, 6), 16),
        ];
      }
      var acRgb = hexToRgb(accretionColor);
      var jRgb = hexToRgb(jetColor);

      // Particles in polar coords around centre
      var particles = [];
      for (var i = 0; i < particleCount; i++) {
        var minR = eventHorizon * 1.1;
        var maxR0 = Math.min(W, H) * 0.45;
        var r0 = minR + Math.pow(Math.random(), 0.6) * (maxR0 - minR);
        particles.push({
          angle: Math.random() * Math.PI * 2,
          r: r0,
          speed: pullStrength * 0.014 * Math.pow(minR / r0, 0.75),
          spiralRate: 0.004 + Math.random() * 0.006,
          size: particleSize * (0.4 + Math.random() * 0.9),
          opacity: 0.45 + Math.random() * 0.55,
          dir: Math.random() > 0.15 ? 1 : -1,
        });
      }

      // Jet stream particles (lazy-created)
      var jetPts = [];
      if (jetEnabled) {
        for (var j = 0; j < 70; j++) {
          var jdir = j % 2 === 0 ? 1 : -1;
          jetPts.push({
            x: (Math.random() - 0.5) * bhSize * 0.35,
            y: jdir * (bhSize + Math.random() * Math.min(H, W) * 0.4),
            spd: (1.8 + Math.random() * 2.5) * jdir,
            sz: 0.8 + Math.random() * 1.8,
            op: Math.random(),
          });
        }
      }

      // Background star field (drawn once)
      var stars = [];
      for (var s = 0; s < 120; s++) {
        stars.push({
          x: Math.random(),
          y: Math.random(),
          sz: Math.random() * 1.2 + 0.3,
          op: Math.random() * 0.5 + 0.1,
        });
      }

      var tick = 0;
      var rafId = 0;

      function drawStars(cx, cy) {
        stars.forEach(function (st) {
          var sx = st.x * W;
          var sy = st.y * H;
          // Lensing: stars near BH get distorted outward
          var ddx = sx - cx,
            ddy = sy - cy;
          var dd = Math.sqrt(ddx * ddx + ddy * ddy) + 1;
          var lens = Math.max(0, 1 - (bhSize * 2.5) / dd);
          ctx.globalAlpha = st.op * lens;
          ctx.beginPath();
          ctx.arc(sx, sy, st.sz, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      function drawAccretionDisk(cx, cy) {
        if (!accretionDisk) return;
        var maxR = Math.min(W, H) * 0.42;
        var minR = eventHorizon * 1.05;
        var bands = 48;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1, 0.3); // perspective flatten

        for (var b = bands - 1; b >= 0; b--) {
          var t = b / (bands - 1);
          var ro = minR + (maxR - minR) * (1 - t * 0.88);
          var ri = ro - ((maxR - minR) / bands) * 1.4;
          if (ri < minR * 0.9) ri = minR * 0.9;

          var r2, g2, b2;
          if (t < 0.25) {
            // Innermost — blue-white hot
            var tt = t / 0.25;
            r2 = Math.round(255 * (1 - tt) + acRgb[0] * tt);
            g2 = Math.round(240 * (1 - tt) + acRgb[1] * tt);
            b2 = Math.round(230 * (1 - tt) + acRgb[2] * tt);
          } else if (t < 0.65) {
            // Mid — accretion color
            r2 = acRgb[0];
            g2 = acRgb[1];
            b2 = acRgb[2];
          } else {
            // Outer — cool dim red
            var tt2 = (t - 0.65) / 0.35;
            r2 = Math.round(acRgb[0] * (1 - tt2) + 55 * tt2);
            g2 = Math.round(acRgb[1] * (1 - tt2) + 12 * tt2);
            b2 = Math.round(acRgb[2] * (1 - tt2) + 10 * tt2);
          }

          var alpha = diskOpacity * (0.25 + (1 - t) * 0.65);
          var grad = ctx.createRadialGradient(0, 0, ri, 0, 0, ro);
          grad.addColorStop(
            0,
            "rgba(" + r2 + "," + g2 + "," + b2 + "," + alpha * 1.4 + ")",
          );
          grad.addColorStop(1, "rgba(" + r2 + "," + g2 + "," + b2 + ",0)");

          ctx.beginPath();
          ctx.arc(0, 0, ro, 0, Math.PI * 2);
          if (ri > 1) ctx.arc(0, 0, ri, 0, Math.PI * 2, true);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Bright inner rim — nearside glow
        ctx.shadowBlur = 18;
        ctx.shadowColor =
          "rgba(" + acRgb[0] + "," + acRgb[1] + "," + acRgb[2] + ",0.9)";
        ctx.beginPath();
        ctx.arc(0, 0, minR * 1.08, 0, Math.PI * 2);
        ctx.strokeStyle =
          "rgba(" +
          acRgb[0] +
          "," +
          acRgb[1] +
          "," +
          acRgb[2] +
          "," +
          diskOpacity * 1.2 +
          ")";
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      function drawEventHorizon(cx, cy) {
        // Lensing glow rings outside singularity
        for (var ring = 5; ring >= 1; ring--) {
          var rr = bhSize * (1 + ring * 0.22);
          ctx.beginPath();
          ctx.arc(cx, cy, rr, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,210,150," + 0.04 / ring + ")";
          ctx.lineWidth = ring * 4;
          ctx.shadowBlur = ring * 10;
          ctx.shadowColor = "rgba(255,170,80,0.25)";
          ctx.stroke();
        }
        ctx.shadowBlur = 0;

        // Photon ring — bright thin line
        ctx.beginPath();
        ctx.arc(cx, cy, bhSize * 1.07, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,195,100,0.85)";
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 14;
        ctx.shadowColor = "rgba(255,200,80,1)";
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Absolute black hole — radial gradient to hard edge
        var sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, bhSize * 1.02);
        sg.addColorStop(0, "rgba(0,0,0,1)");
        sg.addColorStop(0.85, "rgba(0,0,0,1)");
        sg.addColorStop(1, "rgba(0,0,0,0.96)");
        ctx.beginPath();
        ctx.arc(cx, cy, bhSize * 1.02, 0, Math.PI * 2);
        ctx.fillStyle = sg;
        ctx.fill();
      }

      function drawJet(cx, cy) {
        if (!jetEnabled) return;
        var jLen = Math.min(H, W) * 0.44;

        [-1, 1].forEach(function (dir) {
          var g = ctx.createLinearGradient(cx, cy, cx, cy + dir * jLen);
          g.addColorStop(
            0,
            "rgba(" + jRgb[0] + "," + jRgb[1] + "," + jRgb[2] + ",0.75)",
          );
          g.addColorStop(
            0.35,
            "rgba(" + jRgb[0] + "," + jRgb[1] + "," + jRgb[2] + ",0.25)",
          );
          g.addColorStop(
            1,
            "rgba(" + jRgb[0] + "," + jRgb[1] + "," + jRgb[2] + ",0)",
          );
          ctx.save();
          ctx.shadowBlur = 22;
          ctx.shadowColor = jetColor;
          ctx.beginPath();
          ctx.moveTo(cx - bhSize * 0.28, cy);
          ctx.lineTo(cx + bhSize * 0.28, cy);
          ctx.lineTo(cx + bhSize * 0.06, cy + dir * jLen);
          ctx.lineTo(cx - bhSize * 0.06, cy + dir * jLen);
          ctx.closePath();
          ctx.fillStyle = g;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.restore();
        });

        var jMax = Math.min(H, W) * 0.5;
        jetPts.forEach(function (jp) {
          jp.y += jp.spd;
          if (Math.abs(jp.y) > jMax) {
            jp.y = (jp.spd > 0 ? 1 : -1) * bhSize;
            jp.x = (Math.random() - 0.5) * bhSize * 0.35;
            jp.op = Math.random();
          }
          var fade = 1 - Math.abs(jp.y) / jMax;
          ctx.beginPath();
          ctx.arc(cx + jp.x, cy + jp.y, jp.sz, 0, Math.PI * 2);
          ctx.fillStyle =
            "rgba(" +
            jRgb[0] +
            "," +
            jRgb[1] +
            "," +
            jRgb[2] +
            "," +
            jp.op * fade * 0.85 +
            ")";
          ctx.fill();
        });
      }

      function animate() {
        if (!canvas.isConnected) return;
        tick += 0.016;

        ctx.fillStyle = particleTrail
          ? "rgba(2,2,10,0.13)"
          : "rgba(2,2,10,0.96)";
        ctx.fillRect(0, 0, W, H);

        var cx = W / 2,
          cy = H / 2;

        drawStars(cx, cy);
        drawAccretionDisk(cx, cy);

        // Orbital particles
        var minR = eventHorizon * 0.97;
        var maxR = Math.min(W, H) * 0.45;
        particles.forEach(function (p) {
          p.angle += p.speed * p.dir;
          p.r -= p.spiralRate * pullStrength;
          if (p.r < minR) {
            p.r = minR + Math.pow(Math.random(), 0.6) * (maxR - minR);
            p.angle = Math.random() * Math.PI * 2;
            p.speed =
              pullStrength * 0.014 * Math.pow((eventHorizon * 1.1) / p.r, 0.75);
          }

          var px = cx + Math.cos(p.angle) * p.r;
          var py = cy + Math.sin(p.angle) * p.r * 0.32;

          // Nearside Doppler brightening
          var doppler = 0.45 + Math.max(0, Math.sin(p.angle)) * 0.55;
          // Radial temperature
          var tRad = Math.max(
            0,
            Math.min(1, (p.r - eventHorizon) / (maxR - eventHorizon)),
          );
          var r3, g3, b3;
          if (tRad < 0.3) {
            var bl = tRad / 0.3;
            r3 = Math.round(255 * (1 - bl) + acRgb[0] * bl);
            g3 = Math.round(235 * (1 - bl) + acRgb[1] * bl);
            b3 = Math.round(220 * (1 - bl) + acRgb[2] * bl);
          } else {
            var bl2 = Math.min(1, (tRad - 0.3) / 0.7);
            r3 = Math.round(acRgb[0] * (1 - bl2) + 60 * bl2);
            g3 = Math.round(acRgb[1] * (1 - bl2) + 15 * bl2);
            b3 = Math.round(acRgb[2] * (1 - bl2) + 12 * bl2);
          }

          var alpha = p.opacity * doppler * (0.35 + (1 - tRad) * 0.65);
          if (particleGlow) {
            ctx.shadowBlur = p.size * 3.5;
            ctx.shadowColor = "rgb(" + r3 + "," + g3 + "," + b3 + ")";
          }
          ctx.beginPath();
          ctx.arc(px, py, p.size * (1 + (1 - tRad) * 0.4), 0, Math.PI * 2);
          ctx.fillStyle =
            "rgba(" + r3 + "," + g3 + "," + b3 + "," + alpha + ")";
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        drawJet(cx, cy);
        drawEventHorizon(cx, cy);

        rafId = requestAnimationFrame(animate);
      }

      var onResize = function () {
        resize();
      };
      window.addEventListener("resize", onResize);

      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

// ── Batch 4: Scroll & Motion ──

window._VeltroInitParallaxDepth = function () {
  document
    .querySelectorAll(".fw-widget-parallaxDepth:not([data-pd-init])")
    .forEach(function (el) {
      el.setAttribute("data-pd-init", "1");
      var layers = el.querySelectorAll(".veltro-depth-layer");
      window.addEventListener("scroll", function () {
        var rect = el.getBoundingClientRect();
        var progress = Math.max(
          0,
          Math.min(1, -rect.top / (rect.height + window.innerHeight) + 0.5),
        );
        layers.forEach(function (layer, i) {
          var depth = +layer.dataset.depth || (i + 1) * 0.2;
          layer.style.transform =
            "translateZ(" +
            progress * depth * 100 +
            "px) scale(" +
            (1 + progress * depth * 0.1) +
            ")";
        });
      });
    });
};

window._VeltroInitScrollTriggered = function () {
  document
    .querySelectorAll(".fw-widget-scrollTriggered:not([data-st-init])")
    .forEach(function (el) {
      el.setAttribute("data-st-init", "1");
      var items = el.querySelectorAll(".veltro-trigger-item");
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("veltro-triggered");
            }
          });
        },
        { threshold: 0.2 },
      );
      items.forEach(function (item) {
        observer.observe(item);
      });
    });
};

window._VeltroInitHorizontalScrollGallery = function () {
  document
    .querySelectorAll(".fw-widget-horizontalScrollGallery:not([data-hsg-init])")
    .forEach(function (el) {
      el.setAttribute("data-hsg-init", "1");
      var track = el.querySelector(".veltro-hsg-track");
      if (!track) return;
      el.addEventListener("wheel", function (e) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          track.scrollLeft += e.deltaY;
        }
      });
    });
};

window._VeltroInitVelocitySkew = function () {
  document
    .querySelectorAll(".fw-widget-velocitySkew:not([data-vs-init])")
    .forEach(function (el) {
      el.setAttribute("data-vs-init", "1");
      var targets = el.querySelectorAll(".veltro-velocity-target");
      var lastScroll = 0,
        velocity = 0;
      var rafId = 0;
      function update() {
        if (!el.isConnected) return;
        var current = window.scrollY || window.pageYOffset;
        velocity += (current - lastScroll - velocity) * 0.1;
        lastScroll = current;
        targets.forEach(function (t) {
          t.style.transform =
            "skewX(" + Math.max(-8, Math.min(8, velocity)) + "deg)";
        });
        rafId = requestAnimationFrame(update);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(update);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

// ── Scroll Fluid (WebGL fluid sim) ──
window._VeltroInitScrollFluid = function () {
  document
    .querySelectorAll(".fw-widget-scrollFluid:not([data-sf-init])")
    .forEach(function (el) {
      el.setAttribute("data-sf-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) return;
      var wrap = el.querySelector(".veltro-fluid-wrap") || el;
      var ds = wrap.dataset;

      var color1 = ds.color1 || "#3b82f6";
      var color2 = ds.color2 || "#ec4899";
      var scrollStrength = +(ds.scrollStrength || 0.5);
      var cursorStrength = +(ds.cursorStrength || 0.2);
      var decay = +(ds.decay || 0.99);
      var intensity = +(ds.intensity || 1);
      var simRes = Math.max(64, Math.min(512, +(ds.resolution || 256)));
      var W = 0,
        H = 0;

      function hex3(h) {
        return [
          parseInt(h.slice(1, 3), 16) / 255,
          parseInt(h.slice(3, 5), 16) / 255,
          parseInt(h.slice(5, 7), 16) / 255,
        ];
      }

      function compileShader(src, type) {
        var s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          gl.deleteShader(s);
          return null;
        }
        return s;
      }

      function createProgram(vSrc, fSrc) {
        var vs = compileShader(vSrc, gl.VERTEX_SHADER);
        var fs = compileShader(fSrc, gl.FRAGMENT_SHADER);
        if (!vs || !fs) return null;
        var p = gl.createProgram();
        gl.attachShader(p, vs);
        gl.attachShader(p, fs);
        gl.linkProgram(p);
        if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
          gl.deleteProgram(p);
          return null;
        }
        return p;
      }

      var vertSrc =
        "attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0.0,1.0);}";

      var simFragSrc =
        "precision highp float;uniform sampler2D u_vel;uniform vec2 u_scroll;uniform vec2 u_mouse;uniform float u_dt;uniform float u_decay;uniform float u_scrollStr;uniform float u_cursorStr;uniform vec2 u_res;varying vec2 v_uv;void main(){vec2 vel=texture2D(u_vel,v_uv).rg;vec2 prev=v_uv-vel*u_dt*8.0/u_res;vec2 adv=texture2D(u_vel,clamp(prev,0.001,0.999)).rg;float mask=smoothstep(0.0,0.4,1.0-abs(v_uv.x-0.5))*0.6+0.4;adv+=u_scroll*u_scrollStr*mask*u_dt*5.0;float dm=exp(-length(v_uv-u_mouse)*3.0);adv+=normalize(u_mouse-v_uv)*u_cursorStr*dm*u_dt*3.0;adv*=u_decay;gl_FragColor=vec4(clamp(adv,-1.0,1.0),0.0,1.0);}";

      var dispFragSrc =
        "precision highp float;uniform sampler2D u_vel;uniform vec3 u_c1;uniform vec3 u_c2;uniform float u_intensity;varying vec2 v_uv;void main(){vec2 vel=texture2D(u_vel,v_uv).rg;float sp=length(vel);float m=clamp(sp*u_intensity*15.0,0.0,1.0);vec3 col=mix(u_c1,u_c2,m);col+=vec3(vel.y*0.15,0.0,-vel.y*0.1);gl_FragColor=vec4(col,m*0.8+0.2);}";

      var simProg = createProgram(vertSrc, simFragSrc);
      var dispProg = createProgram(vertSrc, dispFragSrc);
      if (!simProg || !dispProg) return;

      var quadBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      );

      function createFBO(w, h) {
        var tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          w,
          h,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          null,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        var fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          tex,
          0,
        );
        return { fbo: fbo, tex: tex };
      }

      var fbo1 = createFBO(simRes, simRes);
      var fbo2 = createFBO(simRes, simRes);
      var curFBO = fbo1;

      function resize() {
        W = el.offsetWidth;
        H = el.offsetHeight;
        if (W < 1 || H < 1) return;
        canvas.width = W;
        canvas.height = H;
        gl.viewport(0, 0, W, H);
      }
      resize();

      // Scroll velocity tracking
      var lastScrollY = window.scrollY;
      var lastTime = performance.now();
      var scrollVel = 0;
      var targetScrollVel = 0;

      window.addEventListener(
        "scroll",
        function () {
          var now = performance.now();
          var dy = window.scrollY - lastScrollY;
          var dt = Math.max(1, now - lastTime);
          targetScrollVel = dy / dt;
          lastScrollY = window.scrollY;
          lastTime = now;
        },
        { passive: true },
      );

      // Mouse tracking
      var mouseX = 0.5,
        mouseY = 0.5;
      var prevMX = 0.5,
        prevMY = 0.5;
      canvas.addEventListener("mousemove", function (e) {
        var rect = canvas.getBoundingClientRect();
        prevMX = mouseX;
        prevMY = mouseY;
        mouseX = (e.clientX - rect.left) / W;
        mouseY = 1 - (e.clientY - rect.top) / H;
      });
      canvas.addEventListener("mouseleave", function () {
        prevMX = mouseX;
        prevMY = mouseY;
      });

      // Intersection Observer
      var visible = true;
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          visible = e.isIntersecting;
        });
      });
      obs.observe(el);

      // Animation loop
      var prevTime = performance.now();
      function animate() {
        if (!canvas.isConnected) {
          obs.disconnect();
          return;
        }
        var now = performance.now();
        var dt = Math.min(0.05, (now - prevTime) / 1000);
        prevTime = now;

        // Smooth scroll velocity
        scrollVel += (targetScrollVel - scrollVel) * 0.1;
        targetScrollVel *= 0.95;

        resize();

        if (visible && W > 0 && H > 0) {
          var mVX = (mouseX - prevMX) * 10;
          var mVY = (mouseY - prevMY) * 10;

          // Simulation step
          gl.useProgram(simProg);
          gl.bindFramebuffer(gl.FRAMEBUFFER, curFBO.fbo);
          gl.viewport(0, 0, simRes, simRes);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, (curFBO === fbo1 ? fbo2 : fbo1).tex);
          gl.uniform1i(gl.getUniformLocation(simProg, "u_vel"), 0);
          gl.uniform2f(
            gl.getUniformLocation(simProg, "u_scroll"),
            0,
            scrollVel * scrollStrength * 0.5,
          );
          gl.uniform2f(
            gl.getUniformLocation(simProg, "u_mouse"),
            mouseX,
            mouseY,
          );
          gl.uniform1f(gl.getUniformLocation(simProg, "u_dt"), dt);
          gl.uniform1f(gl.getUniformLocation(simProg, "u_decay"), decay);
          gl.uniform1f(
            gl.getUniformLocation(simProg, "u_scrollStr"),
            scrollStrength,
          );
          gl.uniform1f(
            gl.getUniformLocation(simProg, "u_cursorStr"),
            cursorStrength,
          );
          gl.uniform2f(gl.getUniformLocation(simProg, "u_res"), simRes, simRes);
          gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
          var loc = gl.getAttribLocation(simProg, "a_pos");
          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          curFBO = curFBO === fbo1 ? fbo2 : fbo1;

          // Display step
          gl.useProgram(dispProg);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          gl.viewport(0, 0, W, H);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, curFBO.tex);
          gl.uniform1i(gl.getUniformLocation(dispProg, "u_vel"), 0);
          var c1 = hex3(color1),
            c2 = hex3(color2);
          gl.uniform3f(
            gl.getUniformLocation(dispProg, "u_c1"),
            c1[0],
            c1[1],
            c1[2],
          );
          gl.uniform3f(
            gl.getUniformLocation(dispProg, "u_c2"),
            c2[0],
            c2[1],
            c2[2],
          );
          gl.uniform1f(
            gl.getUniformLocation(dispProg, "u_intensity"),
            intensity,
          );
          var loc2 = gl.getAttribLocation(dispProg, "a_pos");
          gl.enableVertexAttribArray(loc2);
          gl.vertexAttribPointer(loc2, 2, gl.FLOAT, false, 0, 0);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }

        requestAnimationFrame(animate);
      }
      animate();
    });
};

window._VeltroInitVelocityFluidBg = function () {
  var VISC_DECAY = { air: 0.999, water: 0.995, honey: 0.965, glycerin: 0.93 };

  var VS =
    "attribute vec2 a_pos;varying vec2 v_uv;" +
    "void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0.0,1.0);}";

  var SIM_FS =
    "precision highp float;" +
    "uniform sampler2D u_vel;" +
    "uniform vec2 u_scroll,u_mouse,u_res;" +
    "uniform float u_dt,u_decay,u_scrollStr,u_chaos,u_chaosFreq,u_time;" +
    "varying vec2 v_uv;" +
    "float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}" +
    "float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);" +
    "return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}" +
    "void main(){" +
    "vec2 vel=texture2D(u_vel,v_uv).rg;" +
    "vec2 prev=v_uv-vel*u_dt*8.0/u_res;" +
    "vec2 adv=texture2D(u_vel,clamp(prev,0.001,0.999)).rg;" +
    "float mask=smoothstep(0.0,0.4,1.0-abs(v_uv.x-0.5))*0.6+0.4;" +
    "adv+=u_scroll*u_scrollStr*mask*u_dt*5.0;" +
    "float dm=exp(-length(v_uv-u_mouse)*3.0);" +
    "adv+=normalize(u_mouse-v_uv)*0.15*dm*u_dt*3.0;" +
    "if(u_chaos>0.001){" +
    "float n1=noise(v_uv*u_chaosFreq+u_time*0.3)*6.2832;" +
    "float n2=noise(v_uv*u_chaosFreq*1.7-u_time*0.15)*6.2832;" +
    "adv+=vec2(cos(n1),sin(n1))*u_chaos*u_dt*0.4;" +
    "adv+=vec2(-sin(n2),cos(n2))*u_chaos*u_dt*0.2;}" +
    "adv*=u_decay;" +
    "gl_FragColor=vec4(clamp(adv,-1.0,1.0),0.0,1.0);}";

  var DISP_FS =
    "precision highp float;" +
    "uniform sampler2D u_vel;" +
    "uniform vec3 u_c1,u_c2;" +
    "uniform float u_intensity;" +
    "varying vec2 v_uv;" +
    "void main(){" +
    "vec2 vel=texture2D(u_vel,v_uv).rg;" +
    "float sp=length(vel);" +
    "float m=clamp(sp*u_intensity*15.0,0.0,1.0);" +
    "vec3 col=mix(u_c1,u_c2,m);" +
    "col+=vec3(vel.y*0.15,0.0,-vel.y*0.1);" +
    "gl_FragColor=vec4(col,1.0);}";

  function hex3(h) {
    return [
      parseInt(h.slice(1, 3), 16) / 255,
      parseInt(h.slice(3, 5), 16) / 255,
      parseInt(h.slice(5, 7), 16) / 255,
    ];
  }

  function makeProgram(gl, vSrc, fSrc) {
    function compile(src, type) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    }
    var vs = compile(vSrc, gl.VERTEX_SHADER);
    var fs = compile(fSrc, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    return gl.getProgramParameter(prog, gl.LINK_STATUS) ? prog : null;
  }

  function makeFBO(gl, w, h) {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      w,
      h,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      tex,
      0,
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { fbo: fbo, tex: tex };
  }

  document
    .querySelectorAll(".vfbg-wrap:not([data-vfbg-init])")
    .forEach(function (wrap) {
      wrap.dataset.vfbgInit = "1";
      var canvas = wrap.querySelector(".vfbg-canvas");
      if (!canvas) return;
      var gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) return;

      var ds = wrap.dataset;
      var color1 = ds.color1 || "#818cf8";
      var color2 = ds.color2 || "#f472b6";
      var viscKey = ds.viscosity || "water";
      var decay = VISC_DECAY[viscKey] || 0.995;
      var sensitivity = +(ds.sensitivity || 1);
      var flowAngle = +(ds.flowAngle || 90);
      var chaosEnabled = ds.chaos === "1";
      var chaosFreq = +(ds.chaosFreq || 2);
      var simRes = Math.max(64, Math.min(512, +(ds.resolution || 256)));

      var simProg = makeProgram(gl, VS, SIM_FS);
      var dispProg = makeProgram(gl, VS, DISP_FS);
      if (!simProg || !dispProg) return;

      var quadBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      );

      var fbo1 = makeFBO(gl, simRes, simRes);
      var fbo2 = makeFBO(gl, simRes, simRes);
      var cur = fbo1;

      var W = 0,
        H = 0;
      function resize() {
        W = wrap.offsetWidth;
        H = wrap.offsetHeight;
        if (W < 1 || H < 1) return;
        canvas.width = W;
        canvas.height = H;
        gl.viewport(0, 0, W, H);
      }
      resize();

      var lastScrollY = window.scrollY;
      var lastScrollT = performance.now();
      var scrollVel = 0;
      var targetScrollVel = 0;
      window.addEventListener(
        "scroll",
        function () {
          var now = performance.now();
          var dy = window.scrollY - lastScrollY;
          var dt = Math.max(1, now - lastScrollT);
          targetScrollVel = dy / dt;
          lastScrollY = window.scrollY;
          lastScrollT = now;
        },
        { passive: true },
      );

      var mouseX = 0.5,
        mouseY = 0.5;
      canvas.addEventListener("mousemove", function (e) {
        var r = canvas.getBoundingClientRect();
        mouseX = (e.clientX - r.left) / W;
        mouseY = 1 - (e.clientY - r.top) / H;
      });
      canvas.addEventListener("mouseleave", function () {
        mouseX = 0.5;
        mouseY = 0.5;
      });

      var time = 0;
      var prevT = performance.now();
      var rafId = 0;

      function bindQuad(prog) {
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
        var loc = gl.getAttribLocation(prog, "a_pos");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      }

      function loop() {
        if (!wrap.isConnected) return;
        var now = performance.now();
        var dt = Math.min(0.05, (now - prevT) / 1000);
        prevT = now;
        time += dt;

        scrollVel += (targetScrollVel - scrollVel) * 0.1;
        targetScrollVel *= 0.95;

        resize();
        if (W < 1 || H < 1) {
          rafId = requestAnimationFrame(loop);
          return;
        }

        var rad = (flowAngle * Math.PI) / 180;
        var fx = Math.cos(rad) * scrollVel * sensitivity * 0.5;
        var fy = Math.sin(rad) * scrollVel * sensitivity * 0.5;

        // simulation step
        gl.useProgram(simProg);
        gl.bindFramebuffer(gl.FRAMEBUFFER, cur.fbo);
        gl.viewport(0, 0, simRes, simRes);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, (cur === fbo1 ? fbo2 : fbo1).tex);
        gl.uniform1i(gl.getUniformLocation(simProg, "u_vel"), 0);
        gl.uniform2f(gl.getUniformLocation(simProg, "u_scroll"), fx, fy);
        gl.uniform2f(gl.getUniformLocation(simProg, "u_mouse"), mouseX, mouseY);
        gl.uniform1f(gl.getUniformLocation(simProg, "u_dt"), dt);
        gl.uniform1f(gl.getUniformLocation(simProg, "u_decay"), decay);
        gl.uniform1f(
          gl.getUniformLocation(simProg, "u_scrollStr"),
          sensitivity,
        );
        gl.uniform1f(
          gl.getUniformLocation(simProg, "u_chaos"),
          chaosEnabled ? 1.0 : 0.0,
        );
        gl.uniform1f(gl.getUniformLocation(simProg, "u_chaosFreq"), chaosFreq);
        gl.uniform1f(gl.getUniformLocation(simProg, "u_time"), time);
        gl.uniform2f(gl.getUniformLocation(simProg, "u_res"), simRes, simRes);
        bindQuad(simProg);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        cur = cur === fbo1 ? fbo2 : fbo1;

        // display step
        gl.useProgram(dispProg);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, W, H);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, cur.tex);
        gl.uniform1i(gl.getUniformLocation(dispProg, "u_vel"), 0);
        var c1 = hex3(color1),
          c2 = hex3(color2);
        gl.uniform3fv(gl.getUniformLocation(dispProg, "u_c1"), c1);
        gl.uniform3fv(gl.getUniformLocation(dispProg, "u_c2"), c2);
        gl.uniform1f(gl.getUniformLocation(dispProg, "u_intensity"), 1.0);
        bindQuad(dispProg);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        rafId = requestAnimationFrame(loop);
      }

      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(loop);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(wrap);
    });
};

// ── Batch 5: Backgrounds ──

window._VeltroInitAuroraBorealis = function () {
  document
    .querySelectorAll(".fw-widget-auroraBorealis:not([data-ab-init])")
    .forEach(function (el) {
      el.setAttribute("data-ab-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var W = (canvas.width = el.offsetWidth);
      var H = (canvas.height = el.offsetHeight);
      var waves = [];
      for (var i = 0; i < 5; i++) {
        waves.push({
          y: H * 0.3 + i * 30,
          amplitude: 30 + Math.random() * 20,
          frequency: 0.01 + Math.random() * 0.01,
          speed: 0.02 + Math.random() * 0.01,
          offset: Math.random() * Math.PI * 2,
          hue: 120 + i * 40,
        });
      }
      var t = 0;
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        t += 0.016;
        ctx.fillStyle = "rgba(5,5,15,0.1)";
        ctx.fillRect(0, 0, W, H);
        waves.forEach(function (w) {
          ctx.beginPath();
          ctx.moveTo(0, w.y);
          for (var x = 0; x < W; x += 5) {
            var y =
              w.y +
              Math.sin(x * w.frequency + t * w.speed + w.offset) * w.amplitude;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(W, H);
          ctx.lineTo(0, H);
          ctx.closePath();
          ctx.fillStyle = "hsla(" + w.hue + ",70%,60%,0.15)";
          ctx.fill();
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitParticleNebula = function () {
  document
    .querySelectorAll(".fw-widget-particleNebula:not([data-pn-init])")
    .forEach(function (el) {
      el.setAttribute("data-pn-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var W = (canvas.width = el.offsetWidth);
      var H = (canvas.height = el.offsetHeight);
      var particles = [];
      for (var i = 0; i < 150; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 0.5,
          hue: Math.random() * 60 + 240,
        });
      }
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        ctx.fillStyle = "rgba(3,3,10,0.2)";
        ctx.fillRect(0, 0, W, H);
        particles.forEach(function (p) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = "hsla(" + p.hue + ",80%,70%,0.6)";
          ctx.fill();
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitGeometricPatterns = function () {
  document
    .querySelectorAll(".fw-widget-geometricPatterns:not([data-gp-init])")
    .forEach(function (el) {
      el.setAttribute("data-gp-init", "1");
      var wrap = el.querySelector(".veltro-geopat-wrap");
      if (!wrap) return;
      var canvas = wrap.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      canvas.width = el.offsetWidth || 800;
      canvas.height = el.offsetHeight || 500;
      var t = 0;
      var rafId = 0;

      function getProps() {
        var colors = (wrap.dataset.colors || "#cdfe00,#3b82f6,#ec4899")
          .split(",")
          .map(function (c) {
            return c.trim();
          });
        return {
          patternType: wrap.dataset.patternType || "hexagons",
          colors: colors.length ? colors : ["#cdfe00"],
          speed: +(wrap.dataset.speed || 0.5),
          cellSize: +(wrap.dataset.cellSize || 40),
          strokeWidth: +(wrap.dataset.strokeWidth || 1.5),
          lineOpacity: +(wrap.dataset.lineOpacity || 0.4),
          filled: wrap.dataset.filled === "true",
          colorMode: wrap.dataset.colorMode || "cycle",
        };
      }

      function hexToRgba(hex, a) {
        if (!hex || hex[0] !== "#") return "rgba(205,254,0," + a + ")";
        var r = parseInt(hex.slice(1, 3), 16) || 0;
        var g = parseInt(hex.slice(3, 5), 16) || 0;
        var b = parseInt(hex.slice(5, 7), 16) || 0;
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
      }

      function getColor(props, idx, dist) {
        if (props.colorMode === "gradient") {
          return (
            "hsl(" +
            ((((dist * 0.4 + t * 40 * props.speed) % 360) + 360) % 360) +
            ",70%,65%)"
          );
        }
        if (props.colorMode === "solid") return props.colors[0];
        return props.colors[idx % props.colors.length];
      }

      function drawHex(pr, cx, cy, r, col, dist, idx) {
        ctx.beginPath();
        for (var i = 0; i < 6; i++) {
          var a = (Math.PI / 3) * i + t * 0.15 * pr.speed + dist * 0.002;
          var px = cx + r * Math.cos(a);
          var py = cy + r * Math.sin(a);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        applyStyle(pr, idx, dist);
      }

      function applyStyle(pr, idx, dist) {
        var c = getColor(pr, idx, dist);
        ctx.lineWidth = pr.strokeWidth;
        if (pr.filled) {
          ctx.fillStyle = hexToRgba(
            typeof c === "string" && c[0] === "#" ? c : null,
            pr.lineOpacity * 0.35,
          );
          if (typeof c === "string" && c.startsWith("hsl")) {
            ctx.fillStyle = c
              .replace("hsl(", "hsla(")
              .replace(")", "," + pr.lineOpacity * 0.35 + ")");
          }
          ctx.fill();
        }
        ctx.strokeStyle =
          typeof c === "string" && c.startsWith("hsl")
            ? c
                .replace("hsl(", "hsla(")
                .replace(")", "," + pr.lineOpacity + ")")
            : hexToRgba(c, pr.lineOpacity);
        ctx.stroke();
      }

      function animate() {
        if (!el.isConnected) {
          rafId = 0;
          return;
        }
        var W = canvas.width;
        var H = canvas.height;
        var pr = getProps();
        t += 0.008 * pr.speed;
        ctx.clearRect(0, 0, W, H);
        var cell = pr.cellSize;
        var type = pr.patternType;
        var idx = 0;

        if (type === "hexagons") {
          var r = cell * 0.58;
          var hexW = r * 1.74;
          var hexH = r * 2;
          var cols = Math.ceil(W / hexW) + 3;
          var rows = Math.ceil(H / hexH) + 3;
          for (var row = -1; row < rows; row++) {
            for (var col = -1; col < cols; col++) {
              var cx = col * hexW + (row % 2 === 0 ? 0 : hexW / 2);
              var cy = row * hexH * 0.87;
              var dist = Math.sqrt(
                (cx - W / 2) * (cx - W / 2) + (cy - H / 2) * (cy - H / 2),
              );
              ctx.save();
              drawHex(pr, cx, cy, r * 0.92, col, dist, idx++);
              ctx.restore();
            }
          }
        } else if (type === "triangles") {
          var th = cell * 0.866;
          var cols2 = Math.ceil(W / cell) + 3;
          var rows2 = Math.ceil(H / th) + 3;
          for (var row2 = -1; row2 < rows2; row2++) {
            for (var col2 = -1; col2 < cols2 * 2; col2++) {
              var x0 = col2 * cell * 0.5;
              var y0 = row2 * th;
              var up = (col2 + row2) % 2 === 0;
              var dist2 = Math.sqrt(
                (x0 - W / 2) * (x0 - W / 2) + (y0 - H / 2) * (y0 - H / 2),
              );
              var pulse = Math.sin(t * 3 + dist2 * 0.012) * 0.08;
              ctx.save();
              ctx.beginPath();
              if (up) {
                ctx.moveTo(x0, y0 + th);
                ctx.lineTo(x0 + cell * 0.5, y0);
                ctx.lineTo(x0 + cell, y0 + th);
              } else {
                ctx.moveTo(x0, y0);
                ctx.lineTo(x0 + cell * 0.5, y0 + th);
                ctx.lineTo(x0 + cell, y0);
              }
              ctx.closePath();
              var savedOp = pr.lineOpacity;
              pr.lineOpacity = Math.max(0.05, pr.lineOpacity + pulse);
              applyStyle(pr, idx++, dist2);
              pr.lineOpacity = savedOp;
              ctx.restore();
            }
          }
        } else if (type === "circles") {
          var cols3 = Math.ceil(W / cell) + 3;
          var rows3 = Math.ceil(H / cell) + 3;
          for (var row3 = -1; row3 < rows3; row3++) {
            for (var col3 = -1; col3 < cols3; col3++) {
              var cx3 = col3 * cell + cell * 0.5;
              var cy3 = row3 * cell + cell * 0.5;
              var dist3 = Math.sqrt(
                (cx3 - W / 2) * (cx3 - W / 2) + (cy3 - H / 2) * (cy3 - H / 2),
              );
              var scale3 = 0.82 + Math.sin(t * 2.5 + dist3 * 0.018) * 0.18;
              ctx.save();
              ctx.beginPath();
              ctx.arc(cx3, cy3, cell * 0.42 * scale3, 0, Math.PI * 2);
              applyStyle(pr, idx++, dist3);
              ctx.restore();
            }
          }
        } else if (type === "squares") {
          var cols4 = Math.ceil(W / cell) + 3;
          var rows4 = Math.ceil(H / cell) + 3;
          for (var row4 = -1; row4 < rows4; row4++) {
            for (var col4 = -1; col4 < cols4; col4++) {
              var cx4 = col4 * cell + cell * 0.5;
              var cy4 = row4 * cell + cell * 0.5;
              var dist4 = Math.sqrt(
                (cx4 - W / 2) * (cx4 - W / 2) + (cy4 - H / 2) * (cy4 - H / 2),
              );
              var rot4 = t * 0.4 * pr.speed + dist4 * 0.003;
              var s4 = cell * 0.42;
              ctx.save();
              ctx.translate(cx4, cy4);
              ctx.rotate(rot4);
              ctx.beginPath();
              ctx.rect(-s4, -s4, s4 * 2, s4 * 2);
              applyStyle(pr, idx++, dist4);
              ctx.restore();
            }
          }
        } else if (type === "stars") {
          var cols5 = Math.ceil(W / cell) + 3;
          var rows5 = Math.ceil(H / cell) + 3;
          for (var row5 = -1; row5 < rows5; row5++) {
            for (var col5 = -1; col5 < cols5; col5++) {
              var cx5 = col5 * cell + cell * 0.5;
              var cy5 = row5 * cell + cell * 0.5;
              var dist5 = Math.sqrt(
                (cx5 - W / 2) * (cx5 - W / 2) + (cy5 - H / 2) * (cy5 - H / 2),
              );
              var rot5 = t * 0.25 * pr.speed + dist5 * 0.002;
              var ro = cell * 0.44;
              var ri = ro * 0.42;
              ctx.save();
              ctx.translate(cx5, cy5);
              ctx.rotate(rot5);
              ctx.beginPath();
              for (var si = 0; si < 10; si++) {
                var ra = si % 2 === 0 ? ro : ri;
                var sa = (Math.PI / 5) * si - Math.PI / 2;
                si === 0
                  ? ctx.moveTo(ra * Math.cos(sa), ra * Math.sin(sa))
                  : ctx.lineTo(ra * Math.cos(sa), ra * Math.sin(sa));
              }
              ctx.closePath();
              applyStyle(pr, idx++, dist5);
              ctx.restore();
            }
          }
        }

        rafId = requestAnimationFrame(animate);
      }

      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitLiquidGradient = function () {
  document
    .querySelectorAll(".fw-widget-liquidGradient:not([data-lg-init])")
    .forEach(function (el) {
      el.setAttribute("data-lg-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var W = (canvas.width = el.offsetWidth);
      var H = (canvas.height = el.offsetHeight);
      var blobs = [];
      for (var i = 0; i < 4; i++) {
        blobs.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          r: 60 + Math.random() * 40,
          hue: Math.random() * 360,
        });
      }
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        ctx.fillStyle = "#050510";
        ctx.fillRect(0, 0, W, H);
        blobs.forEach(function (b) {
          b.x += b.vx;
          b.y += b.vy;
          if (b.x < -b.r) b.x = W + b.r;
          if (b.x > W + b.r) b.x = -b.r;
          if (b.y < -b.r) b.y = H + b.r;
          if (b.y > H + b.r) b.y = -b.r;
          var grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
          grad.addColorStop(0, "hsla(" + b.hue + ",80%,60%,0.5)");
          grad.addColorStop(1, "hsla(" + b.hue + ",80%,60%,0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

// ── Batch 6: Effects ──

window._VeltroInitHolographicOverlay = function () {
  document
    .querySelectorAll(".fw-widget-holographicOverlay:not([data-ho-init])")
    .forEach(function (el) {
      el.setAttribute("data-ho-init", "1");
      var overlay = el.querySelector(".veltro-holo-overlay");
      if (!overlay) return;
      var t = 0;
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        t += 0.02;
        overlay.style.background =
          "linear-gradient(" +
          t * 30 +
          "deg, rgba(0,212,255,0.1) 0%, rgba(255,0,128,0.1) 50%, rgba(0,212,255,0.1) 100%)";
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitLightLeaks = function () {
  document
    .querySelectorAll(".fw-widget-lightLeaks:not([data-ll-init])")
    .forEach(function (el) {
      el.setAttribute("data-ll-init", "1");
      var leaks = el.querySelectorAll(".veltro-light-leak");
      leaks.forEach(function (leak, i) {
        leak.style.animationDelay = i * 2 + "s";
      });
    });
};

// ── Batch 7: Spatial & Layout ──

window._VeltroInitCarousel3d = function () {
  document
    .querySelectorAll(".fw-widget-carousel3d:not([data-c3d-init])")
    .forEach(function (el) {
      el.setAttribute("data-c3d-init", "1");
      var track = el.querySelector(".veltro-carousel-track");
      var items = el.querySelectorAll(".veltro-carousel-item");
      if (!track || !items.length) return;
      var angle = 0;
      var radius = 200;
      var isDragging = false,
        startX = 0,
        currentAngle = 0;
      function update() {
        items.forEach(function (item, i) {
          var theta = ((angle + i * (360 / items.length)) * Math.PI) / 180;
          var x = Math.sin(theta) * radius;
          var z = Math.cos(theta) * radius;
          item.style.transform =
            "translateX(" +
            x +
            "px) translateZ(" +
            z +
            "px) rotateY(" +
            (-theta * 180) / Math.PI +
            "deg)";
          item.style.zIndex = Math.round(z + radius);
          item.style.opacity = ((z + radius) / (2 * radius)) * 0.8 + 0.2;
        });
      }
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        if (!isDragging) angle += 0.2;
        update();
        rafId = requestAnimationFrame(animate);
      }
      el.addEventListener("mousedown", function (e) {
        isDragging = true;
        startX = e.clientX;
        currentAngle = angle;
      });
      document.addEventListener("mousemove", function (e) {
        if (!isDragging) return;
        angle = currentAngle + (e.clientX - startX) * 0.3;
      });
      document.addEventListener("mouseup", function () {
        isDragging = false;
      });
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitIsometricGrid = function () {
  document
    .querySelectorAll(".fw-widget-isometricGrid:not([data-ig-init])")
    .forEach(function (el) {
      el.setAttribute("data-ig-init", "1");
      var items = el.querySelectorAll(".veltro-iso-item");
      items.forEach(function (item, i) {
        item.style.transitionDelay = i * 50 + "ms";
        setTimeout(
          function () {
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
          },
          100 + i * 50,
        );
      });
    });
};

window._VeltroInitPerspectiveRooms = function () {
  document
    .querySelectorAll(".fw-widget-perspectiveRooms:not([data-pr-init])")
    .forEach(function (el) {
      el.setAttribute("data-pr-init", "1");
      var rooms = el.querySelectorAll(".veltro-room");
      var activeRoom = 0;
      function showRoom(index) {
        rooms.forEach(function (room, i) {
          room.style.opacity = i === index ? "1" : "0";
          room.style.transform =
            i === index ? "rotateY(0deg)" : "rotateY(90deg)";
        });
        activeRoom = index;
      }
      var nav = el.querySelectorAll(".veltro-room-nav");
      nav.forEach(function (btn, i) {
        btn.addEventListener("click", function () {
          showRoom(i);
        });
      });
      showRoom(0);
    });
};

window._VeltroInitFloatingIslands = function () {
  document
    .querySelectorAll(".fw-widget-floatingIslands:not([data-fi-init])")
    .forEach(function (el) {
      el.setAttribute("data-fi-init", "1");
      var islands = el.querySelectorAll(".veltro-island");
      var t = 0;
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        t += 0.016;
        islands.forEach(function (island, i) {
          var y = Math.sin(t + i * 1.5) * 15;
          var r = Math.sin(t * 0.5 + i) * 3;
          island.style.transform =
            "translateY(" + y + "px) rotate(" + r + "deg)";
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitLayeredParallax = function () {
  document
    .querySelectorAll(".fw-widget-layeredParallax:not([data-lp-init])")
    .forEach(function (el) {
      el.setAttribute("data-lp-init", "1");
      var layers = el.querySelectorAll(".veltro-lp-layer");
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        layers.forEach(function (layer, i) {
          var depth = +layer.dataset.depth || (i + 1) * 0.1;
          layer.style.transform =
            "translate(" + x * depth * 50 + "px," + y * depth * 50 + "px)";
        });
      });
    });
};

window._VeltroInitKineticLayout = function () {
  document
    .querySelectorAll(".fw-widget-kineticLayout:not([data-kl-init])")
    .forEach(function (el) {
      el.setAttribute("data-kl-init", "1");
      var items = el.querySelectorAll(".veltro-kl-item");
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var mx = e.clientX - rect.left,
          my = e.clientY - rect.top;
        items.forEach(function (item) {
          var ir = item.getBoundingClientRect();
          var cx = ir.left + ir.width / 2 - rect.left;
          var cy = ir.top + ir.height / 2 - rect.top;
          var dx = mx - cx,
            dy = my - cy;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var push = Math.max(0, 1 - dist / 150);
          item.style.transform =
            "translate(" +
            -dx * push * 0.15 +
            "px," +
            -dy * push * 0.15 +
            "px)";
        });
      });
      el.addEventListener("mouseleave", function () {
        items.forEach(function (item) {
          item.style.transform = "";
        });
      });
    });
};

window._VeltroInitMorphingGrid = function () {
  document
    .querySelectorAll(".fw-widget-morphingGrid:not([data-mg-init])")
    .forEach(function (el) {
      el.setAttribute("data-mg-init", "1");
      var cells = el.querySelectorAll(".veltro-mg-cell");
      var t = 0;
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        t += 0.02;
        cells.forEach(function (cell, i) {
          var scale = 1 + Math.sin(t + i * 0.5) * 0.1;
          cell.style.transform = "scale(" + scale + ")";
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitSpatialNavigation = function () {
  document
    .querySelectorAll(".fw-widget-spatialNavigation:not([data-sn-init])")
    .forEach(function (el) {
      el.setAttribute("data-sn-init", "1");
      var nodes = el.querySelectorAll(".veltro-sn-node");
      var activeNode = 0;
      function activate(index) {
        nodes.forEach(function (node, i) {
          node.classList.toggle("veltro-sn-active", i === index);
        });
        activeNode = index;
      }
      nodes.forEach(function (node, i) {
        node.addEventListener("mouseenter", function () {
          activate(i);
        });
        node.addEventListener("click", function () {
          activate(i);
        });
      });
      activate(0);
    });
};

window._VeltroInitCookieConsent = function () {
  var COOKIE_KEY = "fw_cookie_consent";
  document.querySelectorAll(".fw-cookie-banner").forEach(function (banner) {
    if (banner.dataset.cookieInit) return;
    banner.dataset.cookieInit = "1";

    if (localStorage.getItem(COOKIE_KEY)) {
      banner.style.display = "none";
      return;
    }

    function getCategoryState() {
      var state = {};
      banner.querySelectorAll(".fw-cookie-cat-toggle").forEach(function (cb) {
        state[cb.dataset.cat || cb.name] = cb.checked;
      });
      return state;
    }

    banner.querySelectorAll("[data-cookie-action]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        var action = e.currentTarget.dataset.cookieAction;
        var consent = {
          accepted: action === "accept",
          declined: action === "decline",
          timestamp: Date.now(),
          categories: getCategoryState(),
        };
        if (action === "accept") {
          banner
            .querySelectorAll(".fw-cookie-cat-toggle:not(:disabled)")
            .forEach(function (cb) {
              cb.checked = true;
            });
          consent.categories = getCategoryState();
          localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
          banner.style.display = "none";
        } else if (action === "decline") {
          localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
          banner.style.display = "none";
        } else if (action === "customize") {
          var panel = banner.querySelector(".fw-cookie-categories");
          if (panel)
            panel.style.display =
              panel.style.display === "none" ? "block" : "none";
        }
      });
    });
  });
};

// ── Master Initializer ──
window._VeltroInitAll = function () {
  var inits = [
    "_VeltroInitKineticText",
    "_VeltroInitTextScramble",
    "_VeltroInitTypewriter",
    "_VeltroInitTextMask",
    "_VeltroInitCounter",
    "_VeltroInitLiquidText",
    "_VeltroInitPhysics",
    "_VeltroInitImagePhysics",
    "_VeltroInitBubblePop",
    "_VeltroInitMagneticCursor",
    "_VeltroInitParticleTrail",
    "_VeltroInitCursorRipple",
    "_VeltroInitCursorLens",
    "_VeltroInitStickyScrollStack",
    "_VeltroInitScrollVelocitySkew",
    "_VeltroInitParallaxImageStack",
    "_VeltroInitMosaicAssemble",
    "_VeltroInitScrollProgressRing",
    "_VeltroInitMagneticScroll",
    "_VeltroInitShaders",
    "_VeltroInitMorphBlob",
    "_VeltroInitNoiseGrain",
    "_VeltroInitGradientFlow",
    "_VeltroInitSectionBackground",
    "_VeltroInitGlassmorphismStack",
    "_VeltroInitTiltCards",
    "_VeltroInitGlitchSection",
    "_VeltroInitAudioVisualizer",
    "_VeltroInitDepthOfField",
    "_VeltroInitHolographicCard",
    "_VeltroInitSoundReactive",
    "_VeltroInitMirrorReflection",
    "_VeltroInitConstellation",
    "_VeltroInitInfiniteCanvas",
    "_VeltroInitGeometryDraw",
    "_VeltroInitMultiShapeTrail",
    "_VeltroInitSpotlight",
    "_VeltroInitMagText",
    "_VeltroInitDistortion",
    "_VeltroInitColorSampler",
    "_VeltroInitGravityCursor",
    "_VeltroInitWaveText",
    "_VeltroInitRotatingText3d",
    "_VeltroInitMorphingText",
    "_VeltroInitKineticScramble",
    "_VeltroInitCookieConsent",
    "_VeltroInitGravityWells",
    "_VeltroInitFluidSimulation",
    "_VeltroInitClothSimulation",
    "_VeltroInitMagneticFields",
    "_VeltroInitPendulumWave",
    "_VeltroInitCollisionChaos",
    "_VeltroInitBlackHole",
    "_VeltroInitParallaxDepth",
    "_VeltroInitScrollTriggered",
    "_VeltroInitHorizontalScrollGallery",
    "_VeltroInitVelocitySkew",
    "_VeltroInitScrollFluid",
    "_VeltroInitVelocityFluidBg",
    "_VeltroInitAuroraBorealis",
    "_VeltroInitParticleNebula",
    "_VeltroInitGeometricPatterns",
    "_VeltroInitLiquidGradient",
    "_VeltroInitHolographicOverlay",
    "_VeltroInitLightLeaks",
    "_VeltroInitCarousel3d",
    "_VeltroInitIsometricGrid",
    "_VeltroInitPerspectiveRooms",
    "_VeltroInitFloatingIslands",
    "_VeltroInitLayeredParallax",
    "_VeltroInitKineticLayout",
    "_VeltroInitMorphingGrid",
    "_VeltroInitSpatialNavigation",
  ];
  inits.forEach(function (name) {
    if (typeof window[name] === "function") window[name]();
  });
};
