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

