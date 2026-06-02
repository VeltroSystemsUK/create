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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
    var colors = FB.widgets.safeSplit(p.elementColors, "#cdfe00,#3b82f6,#ec4899");
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
});

// ── 15. PARALLAX IMAGE STACK ──
FB.widgets.register("parallaxImageStack", {
  label: "Parallax Image Stack",
  sublabel: "Hover to separate depth layers",
  icon: "▣",
  iconBg: "#0d1a0d",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "scroll",
  defaultProps: {
    height: 500,
    bg: "#0d0d1a",
    layerCount: 3,
    images:
      "https://picsum.photos/400/300?random=11,https://picsum.photos/400/300?random=22,https://picsum.photos/400/300?random=33",
    depth: 40,
    cardWidth: 300,
    cardHeight: 200,
  },
  render: function (p) {
    var id = "parstack-" + (p._blockId || Date.now());
    var images = FB.widgets.safeSplit(p.images, "").map(function (s) {
      return s.trim();
    });
    var count = Math.min(p.layerCount || 3, 5);
    var cardW = p.cardWidth || 300;
    var cardH = p.cardHeight || 200;
    var configs = [
      { x: -90, y: 25, rot: -10, scale: 0.82, op: 0.5 },
      { x: -45, y: -18, rot: -5, scale: 0.88, op: 0.68 },
      { x: 10, y: 15, rot: 2, scale: 0.93, op: 0.82 },
      { x: 55, y: -12, rot: 6, scale: 0.97, op: 0.92 },
      { x: 20, y: 5, rot: 0, scale: 1.0, op: 1.0 },
    ];
    var used = configs.slice(5 - count);
    var layersHtml = "";
    for (var i = 0; i < count; i++) {
      var cfg = used[i];
      var depth = count > 1 ? (i / (count - 1)).toFixed(2) : "1";
      var imgUrl =
        images[i] || "https://picsum.photos/400/300?random=" + (i + 1);
      layersHtml +=
        '<div class="veltro-parstack-layer" data-depth="' +
        depth +
        '" style="position:absolute;left:50%;top:50%;width:' +
        cardW +
        "px;height:" +
        cardH +
        "px;margin-left:" +
        (-cardW / 2 + cfg.x) +
        "px;margin-top:" +
        (-cardH / 2 + cfg.y) +
        'px;will-change:transform"><div style="width:100%;height:100%;transform:rotate(' +
        cfg.rot +
        "deg) scale(" +
        cfg.scale +
        ");opacity:" +
        cfg.op +
        ';border-radius:14px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.7)"><img src="' +
        imgUrl +
        '" style="width:100%;height:100%;object-fit:cover;display:block" loading="lazy" alt=""/></div></div>';
    }
    return (
      '<div class="veltro-parstack-wrap" id="' +
      id +
      '" data-depth-strength="' +
      (p.depth || 40) +
      '" style="height:' +
      (p.height || 500) +
      "px;background:" +
      (p.bg || "#0d0d1a") +
      ';position:relative;overflow:hidden;border-radius:4px;cursor:none">' +
      layersHtml +
      "</div>"
    );
  },
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  emits: {
    scrollProgress: {
      range: [0, 1],
      description: "Page scroll 0 (top) → 1 (bottom)",
    },
  },
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
  editPanel: function (id, p) { return ""; },
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
    var colors = FB.widgets.safeSplit(p.colors, "#1a1a2e,#1a0d1a,#0d1a1a,#0d0d2e");
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  accepts: {
    speed: {
      range: [0, 5],
      description: "Hue rotation speed deg/frame (0=stopped, 5=fast)",
    },
  },
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    colors: "#ff6b35,#cdfe00,#3b82f6,#ec4899",
    speed: 0.5,
    angle: 45,
  },
  render: function (p) {
    var id = "grad-" + (p._blockId || Date.now());
    var rawColors = p.colors || "#ff6b35,#cdfe00,#3b82f6,#ec4899";
    if (Array.isArray(rawColors)) rawColors = rawColors.join(",");
    var colors = rawColors.split(",");
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  accepts: {
    glitchRate: {
      range: [0, 1],
      description:
        "Probability of glitch firing per tick (0=never, 1=constant)",
    },
  },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
});
