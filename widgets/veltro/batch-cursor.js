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

