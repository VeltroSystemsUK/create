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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
});

// 7. Physics Sandbox
FB.widgets.register("physicsSandbox", {
  label: "Physics Sandbox",
  sublabel: "Matter.js physics",
  icon: "◈",
  iconBg: "#0d1a1a",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "physics",
  defaultProps: {
    items: ["Veltro", "Physics"],
    height: 400,
    gravity: 1,
    restitution: 0.7,
    friction: 0.05,
    textColor: "#cdfe00",
    bgType: "solid",
    bgColor: "#0d0d1a",
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
    objectShape: "box",
    collisionFlash: false,
    gravityDirection: "down",
    itemColors: "#cdfe00,#3b82f6,#ec4899,#f59e0b,#10b981",
    fontSize: 14,
    wallThickness: 2,
    itemSpacing: 30,
    showHint: true,
    hintPosition: "bottom-right",
    hintColor: "#cdfe00",
    hintOpacity: 0.4,
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
  editPanel: function (id, p) { return ""; },
});

// 8. Fluid Simulation
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
  editPanel: function (id, p) { return ""; },
});

