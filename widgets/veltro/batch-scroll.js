// ── VELTRO ENGINE BATCH 4: SCROLL & MOTION (6 WIDGETS) ──
// 1. Parallax Depth
FB.widgets.register("parallaxDepth", {
  label: "Parallax Depth",
  sublabel: "Multi-layer parallax",
  icon: "▣",
  iconBg: "#0d1a2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "scroll",
  defaultProps: { height: 500, bg: "#0d0d1a", layerCount: 5, speed: 0.5, overlayText: "DEPTH" },
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
      '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:10"><h2 style="color:#fff;font-size:3rem;font-weight:800;margin:0">' + (p.overlayText || "DEPTH") + '</h2></div></div>'
    );
  },
  editPanel: function (id, p) { return ""; },
});

// 2. Scroll Triggered Reveal
FB.widgets.register("scrollTriggered", {
  label: "Scroll Triggered",
  sublabel: "Reveal on scroll",
  icon: "↓",
  iconBg: "#1a1a0d",
  iconColor: "#fbbf24",
  category: "veltro",
  subCategory: "scroll",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
    images: ["","","","",""],
    animationType: "fadeUp",
    stagger: 100,
    duration: 600,
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
          (p.duration || 600) +
          "ms ease,transform " +
          (p.duration || 600) +
          'ms ease">' +
          (p.images && p.images[i] ? '<img src="' + p.images[i] + '" style="width:100%;height:120px;object-fit:cover;border-radius:6px;margin-bottom:8px" />' : '') +
          item +
          "</div>"
        );
      })
      .join("");
    return (
      '<div class="veltro-scroll-reveal-wrap" id="scrolltrig-' +
      id +
      '" data-animation-type="' +
      (p.animationType || "fadeUp") +
      '" data-stagger="' +
      (p.stagger || 100) +
      '" data-duration="' +
      (p.duration || 600) +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;overflow-y:auto;padding:20px">' +
      itemsHtml +
      "</div>"
    );
  },
  editPanel: function (id, p) { return ""; },
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
    items: "1,2,3,4,5,6",
  },
  render: function (p) {
    var id = p._blockId || "hScroll";
    var itemLabels = FB.widgets.safeSplit(p.items, "1,2,3,4,5,6");
    var itemsHtml = "";
    for (var i = 0; i < (p.itemCount || 6); i++) {
      itemsHtml +=
        '<div class="veltro-hscroll-item" style="flex:0 0 300px;height:300px;background:linear-gradient(135deg,rgba(205,254,0,0.1) 0%,rgba(60,165,250,0.1) 100%);border-radius:16px;margin-right:20px;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:800;color:#fff">' +
        (itemLabels[i] || i + 1) +
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
  editPanel: function (id, p) { return ""; },
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
    images: ["","","",""],
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
          ';border-radius:12px">' +
          (p.images && p.images[i] ? '<img src="' + p.images[i] + '" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:10px" />' : '') +
          '<h3 style="color:' +
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
});

