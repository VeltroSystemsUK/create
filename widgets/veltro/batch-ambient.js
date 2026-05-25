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
  accepts: {
    intensity: {
      range: [0, 1],
      description: "Particle speed multiplier (0=still, 1=full speed)",
    },
  },
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
