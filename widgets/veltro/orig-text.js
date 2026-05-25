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

