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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
});

