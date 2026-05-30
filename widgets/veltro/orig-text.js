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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
});

