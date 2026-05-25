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
    var items = p.items || ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];
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
      '>Slide Left</option><option value="slideRight"' +
      (p.animationType === "slideRight" ? " selected" : "") +
      '>Slide Right</option><option value="slideDown"' +
      (p.animationType === "slideDown" ? " selected" : "") +
      '>Slide Down</option><option value="scaleUp"' +
      (p.animationType === "scaleUp" ? " selected" : "") +
      '>Scale Up</option><option value="rotateIn"' +
      (p.animationType === "rotateIn" ? " selected" : "") +
      '>Rotate In</option><option value="flipIn"' +
      (p.animationType === "flipIn" ? " selected" : "") +
      '>Flip In</option><option value="zoomIn"' +
      (p.animationType === "zoomIn" ? " selected" : "") +
      ">Zoom In</option></select></div>";
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
    h +=
      '<div class="rp-section"><div class="rp-section-header" onclick="this.classList.toggle(\'collapsed\');this.nextElementSibling.style.display=this.classList.contains(\'collapsed\')?\'none\':\'block\'"><span class="rp-section-icon">▾</span><span class="rp-section-title">Content</span></div><div class="rp-section-body">';
    var contentItems = p.items || [
      "Item 1",
      "Item 2",
      "Item 3",
      "Item 4",
      "Item 5",
    ];
    h +=
      '<div class="rp-row" style="flex-direction:column;align-items:flex-start"><label>Items (one per line)</label>';
    h +=
      '<textarea rows="' +
      Math.max(3, Math.min(6, contentItems.length)) +
      '" style="width:100%;font-size:11px;font-family:monospace;background:#1a1a1a;border:1px solid #333;border-radius:4px;color:#fff;padding:4px" onchange="try{var v=this.value.split(\'\n\').filter(function(s){return s.trim()});FB.panels.updateWidgetProp(\'' +
      id +
      "','items',v.length?v:['Item 1'])}catch(e){}" +
      '">' +
      contentItems.join("\n").replace(/</g, "&lt;") +
      "</textarea></div>";
    h += "</div></div>";
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
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    maxSkew: 15,
    elasticity: 0.8,
    items: [
      "Scroll to see skew effect",
      "Velocity affects skew",
      "Rubber band physics",
      "Fast scroll = more skew",
    ],
  },
  render: function (p) {
    var id = p._blockId || "velSkew";
    var items = p.items || [
      "Scroll to see skew effect",
      "Velocity affects skew",
      "Rubber band physics",
      "Fast scroll = more skew",
    ];
    var colors = [
      "rgba(205,254,0,0.1)",
      "rgba(60,165,250,0.1)",
      "rgba(236,72,153,0.1)",
      "rgba(251,191,36,0.1)",
    ];
    var textColors = ["#cdfe00", "#60a5fa", "#ec4899", "#fbbf24"];
    var itemsHtml = items
      .map(function (item, i) {
        var ci = i % colors.length;
        return (
          '<div class="veltro-velskew-target" style="padding:30px;background:' +
          colors[ci] +
          ';border-radius:12px"><h3 style="color:' +
          textColors[ci] +
          ';margin:0">' +
          item +
          "</h3></div>"
        );
      })
      .join("");
    return (
      '<div class="veltro-velskew-wrap" id="velskew-' +
      id +
      '" data-max-skew="' +
      (p.maxSkew || 15) +
      '" data-elasticity="' +
      (p.elasticity || 0.8) +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;overflow-y:auto"><div class="veltro-velskew-content" style="padding:40px" data-velskew-init="1"><div style="height:800px;display:flex;flex-direction:column;gap:20px">' +
      itemsHtml +
      "</div></div></div>"
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

