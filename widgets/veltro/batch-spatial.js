// ── VELTRO ENGINE BATCH 7: SPATIAL & LAYOUT (8 NEW WIDGETS) ──
// 1. 3D Carousel
FB.widgets.register("carousel3d", {
  label: "3D Carousel",
  sublabel: "Rotating 3D card carousel",
  icon: "◈",
  iconBg: "#0d1a2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    cardCount: 6,
    rotationSpeed: 0.5,
  },
  render: function (p) {
    var id = p._blockId || "carousel";
    var cardsHtml = "";
    for (var i = 0; i < (p.cardCount || 6); i++) {
      var angle = (i * 360) / (p.cardCount || 6);
      cardsHtml +=
        '<div class="veltro-carousel-card" style="position:absolute;width:120px;height:160px;background:linear-gradient(135deg,rgba(205,254,0,0.2) 0%,rgba(60,165,250,0.2) 100%);border-radius:12px;border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800;color:#fff;transform:rotateY(' +
        angle +
        'deg) translateZ(200px);backface-visibility:hidden">' +
        (i + 1) +
        "</div>";
    }
    return (
      '<div class="veltro-carousel-wrap" id="carousel-' +
      id +
      '" data-rotation-speed="' +
      p.rotationSpeed +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center;perspective:1000px"><div class="veltro-carousel-stage" style="position:relative;width:120px;height:160px;transform-style:preserve-3d" data-carousel-init="1">' +
      cardsHtml +
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
      '<div class="rp-row"><label>Card Count</label><input type="range" min="3" max="12" step="1" value="' +
      (p.cardCount || 6) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','cardCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Rotation Speed</label><input type="range" min="0.1" max="3" step="0.1" value="' +
      (p.rotationSpeed || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','rotationSpeed',+this.value)\"></div>";
    return h;
  },
});

// 2. Isometric Grid
FB.widgets.register("isometricGrid", {
  label: "Isometric Grid",
  sublabel: "Isometric layout",
  icon: "▣",
  iconBg: "#1a0d2e",
  iconColor: "#a78bfa",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: { height: 500, bg: "#0d0d1a", cols: 4, rows: 3, spacing: 20 },
  render: function (p) {
    var id = p._blockId || "iso";
    var itemsHtml = "";
    for (var r = 0; r < (p.rows || 3); r++) {
      for (var c = 0; c < (p.cols || 4); c++) {
        itemsHtml +=
          '<div class="veltro-iso-cell" style="width:80px;height:80px;background:linear-gradient(135deg,rgba(205,254,0,0.15) 0%,rgba(60,165,250,0.15) 100%);border-radius:8px;border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:700;color:#cdfe00;transform:rotateX(60deg) rotateZ(-45deg);margin:' +
          (p.spacing || 20) +
          'px">' +
          (r * (p.cols || 4) + c + 1) +
          "</div>";
      }
    }
    return (
      '<div class="veltro-iso-wrap" id="iso-' +
      id +
      '" data-cols="' +
      p.cols +
      '" data-rows="' +
      p.rows +
      '" data-spacing="' +
      p.spacing +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center"><div class="veltro-iso-grid" style="display:grid;grid-template-columns:repeat(' +
      p.cols +
      ",1fr);gap:" +
      p.spacing +
      'px;transform:rotateX(60deg) rotateZ(-45deg);perspective:1000px">' +
      itemsHtml +
      "</div></div>"
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
      '<div class="rp-row"><label>Columns</label><input type="range" min="2" max="8" step="1" value="' +
      (p.cols || 4) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','cols',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Rows</label><input type="range" min="2" max="6" step="1" value="' +
      (p.rows || 3) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','rows',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Spacing (px)</label><input type="range" min="4" max="60" step="4" value="' +
      (p.spacing || 20) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','spacing',+this.value)\"></div>";
    return h;
  },
});

// 3. Perspective Rooms
FB.widgets.register("perspectiveRooms", {
  label: "Perspective Rooms",
  sublabel: "3D room layout",
  icon: "◉",
  iconBg: "#0d1a1a",
  iconColor: "#34d399",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 500,
    bg: "#0d0d1a",
    roomCount: 3,
    perspective: 800,
    colors: "#cdfe00,#3b82f6,#ec4899",
  },
  render: function (p) {
    var id = p._blockId || "rooms";
    var colors = (p.colors || "#cdfe00,#3b82f6,#ec4899").split(",");
    var roomsHtml = "";
    for (var i = 0; i < (p.roomCount || 3); i++) {
      roomsHtml +=
        '<div class="veltro-room" style="position:absolute;inset:0;background:' +
        (colors[i % colors.length] || "#cdfe00") +
        ";opacity:0.1;transform:translateZ(" +
        i * -200 +
        'px);border:2px solid rgba(255,255,255,0.1);border-radius:16px;display:flex;align-items:center;justify-content:center"><span style="font-size:2rem;font-weight:800;color:#fff;opacity:0.5">Room ' +
        (i + 1) +
        "</span></div>";
    }
    return (
      '<div class="veltro-rooms-wrap" id="rooms-' +
      id +
      '" data-room-count="' +
      p.roomCount +
      '" data-perspective="' +
      p.perspective +
      '" data-colors="' +
      p.colors +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ";position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-center;perspective:" +
      p.perspective +
      'px"><div class="veltro-rooms-stage" style="position:relative;width:300px;height:300px;transform-style:preserve-3d">' +
      roomsHtml +
      "</div></div>"
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
      '<div class="rp-row"><label>Room Count</label><input type="range" min="1" max="8" step="1" value="' +
      (p.roomCount || 3) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','roomCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Perspective (px)</label><input type="range" min="200" max="2000" step="100" value="' +
      (p.perspective || 800) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','perspective',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Colours (CSV)</label><input type="text" value="' +
      (p.colors || "#cdfe00,#3b82f6,#ec4899") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','colors',this.value)\"></div>";
    return h;
  },
});

// 4. Floating Islands
FB.widgets.register("floatingIslands", {
  label: "Floating Islands",
  sublabel: "Floating content blocks",
  icon: "◈",
  iconBg: "#1a1a0d",
  iconColor: "#fbbf24",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 500,
    bg: "#0d0d1a",
    islandCount: 5,
    floatRange: 20,
    speed: 1,
  },
  render: function (p) {
    var id = p._blockId || "islands";
    var itemsHtml = "";
    for (var i = 0; i < (p.islandCount || 5); i++) {
      var size = 80 + Math.random() * 60;
      itemsHtml +=
        '<div class="veltro-island" style="position:absolute;width:' +
        size +
        "px;height:" +
        size +
        "px;background:linear-gradient(135deg,rgba(205,254,0,0.2) 0%,rgba(60,165,250,0.2) 100%);border-radius:" +
        size / 4 +
        "px;border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:700;color:#fff;left:" +
        (10 + Math.random() * 70) +
        "%;top:" +
        (10 + Math.random() * 70) +
        "%;animation:vtfloat " +
        (3 + Math.random() * 2) +
        "s ease-in-out infinite;animation-delay:" +
        Math.random() * 2 +
        's">' +
        (i + 1) +
        "</div>";
    }
    return (
      '<div class="veltro-islands-wrap" id="islands-' +
      id +
      '" data-island-count="' +
      p.islandCount +
      '" data-float-range="' +
      p.floatRange +
      '" data-speed="' +
      p.speed +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px">' +
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
      '<div class="rp-row"><label>Island Count</label><input type="range" min="2" max="12" step="1" value="' +
      (p.islandCount || 5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','islandCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Float Range (px)</label><input type="range" min="5" max="60" step="5" value="' +
      (p.floatRange || 20) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','floatRange',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Speed</label><input type="range" min="0.2" max="3" step="0.2" value="' +
      (p.speed || 1) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','speed',+this.value)\"></div>";
    return h;
  },
});

// 5. Layered Parallax
FB.widgets.register("layeredParallax", {
  label: "Layered Parallax",
  sublabel: "Multi-depth layers",
  icon: "▣",
  iconBg: "#0d1a2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 500,
    bg: "#0d0d1a",
    layerCount: 5,
    depthIntensity: 0.5,
  },
  render: function (p) {
    var id = p._blockId || "layerPar";
    var layersHtml = "";
    for (var i = 0; i < (p.layerCount || 5); i++) {
      var depth = (i + 1) / (p.layerCount || 5);
      layersHtml +=
        '<div class="veltro-layer" data-depth="' +
        depth +
        '" style="position:absolute;inset:0;background:radial-gradient(circle at ' +
        (30 + i * 10) +
        "% " +
        (40 + i * 8) +
        "%,rgba(205,254,0," +
        (0.03 + depth * 0.08) +
        ') 0%,transparent 50%);transform:translateZ(0)\"></div>';
    }
    return (
      '<div class="veltro-layerpar-wrap" id="layerpar-' +
      id +
      '" data-layer-count="' +
      p.layerCount +
      '" data-depth-intensity="' +
      p.depthIntensity +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center">' +
      layersHtml +
      '<div style="position:relative;z-index:10"><h2 style="color:#fff;font-size:3rem;font-weight:800;margin:0;text-shadow:0 4px 20px rgba(0,0,0,0.5)">DEPTH</h2></div></div>'
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
      '<div class="rp-row"><label>Depth Intensity</label><input type="range" min="0.1" max="1" step="0.05" value="' +
      (p.depthIntensity || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','depthIntensity',+this.value)\"></div>";
    return h;
  },
});

// 6. Kinetic Layout
FB.widgets.register("kineticLayout", {
  label: "Kinetic Layout",
  sublabel: "Items repel from cursor",
  icon: "◉",
  iconBg: "#1a0d1a",
  iconColor: "#f472b6",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    elementCount: 9,
    responseRadius: 120,
    repulseStrength: 50,
    itemSize: 80,
    accentColor: "#cdfe00",
    mode: "repulse",
  },
  render: function (p) {
    var id = p._blockId || "kinetic";
    var size = p.itemSize || 80;
    var accent = p.accentColor || "#cdfe00";
    var itemsHtml = "";
    for (var i = 0; i < (p.elementCount || 9); i++) {
      itemsHtml +=
        '<div class="veltro-kinetic-item" style="width:' +
        size +
        "px;height:" +
        size +
        "px;background:linear-gradient(135deg,rgba(205,254,0,0.12) 0%,rgba(60,165,250,0.12) 100%);border-radius:12px;border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:800;color:" +
        accent +
        ';will-change:transform">' +
        (i + 1) +
        "</div>";
    }
    return (
      '<div class="veltro-kinetic-wrap" id="kinetic-' +
      id +
      '" data-response-radius="' +
      (p.responseRadius || 120) +
      '" data-repulse-strength="' +
      (p.repulseStrength || 50) +
      '" data-mode="' +
      (p.mode || "repulse") +
      '" style="height:' +
      (p.height || 400) +
      "px;background:" +
      (p.bg || "#0d0d1a") +
      ';position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:16px;padding:24px">' +
      itemsHtml +
      "</div>"
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
      '<div class="rp-row"><label>Mode</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','mode',this.value)\"><option value=\"repulse\"" +
      ((p.mode || "repulse") === "repulse" ? " selected" : "") +
      '>Repulse</option><option value="attract"' +
      (p.mode === "attract" ? " selected" : "") +
      ">Attract</option></select></div>";
    h +=
      '<div class="rp-row"><label>Element Count</label><input type="range" min="4" max="24" step="1" value="' +
      (p.elementCount || 9) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','elementCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Response Radius (px)</label><input type="range" min="40" max="300" step="10" value="' +
      (p.responseRadius || 120) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','responseRadius',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Push Strength (px)</label><input type="range" min="10" max="120" step="5" value="' +
      (p.repulseStrength || 50) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','repulseStrength',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Item Size (px)</label><input type="range" min="40" max="160" step="8" value="' +
      (p.itemSize || 80) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','itemSize',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Accent Colour</label><input type="color" value="' +
      (p.accentColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','accentColor',this.value)\"></div>";
    return h;
  },
});

// 7. Morphing Grid
FB.widgets.register("morphingGrid", {
  label: "Morphing Grid",
  sublabel: "Auto-cycles between layouts",
  icon: "⊞",
  iconBg: "#0d1a2e",
  iconColor: "#60a5fa",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 440,
    bg: "#0d0d1a",
    itemCount: 6,
    cycleSpeed: 2.5,
    transitionDuration: 0.6,
    accentColor: "#cdfe00",
    itemBg: "rgba(255,255,255,0.05)",
    gap: 10,
    autoCycle: true,
  },
  render: function (p) {
    var id = p._blockId || "morphGrid";
    var count = Math.min(Math.max(p.itemCount || 6, 4), 9);
    var gap = p.gap || 10;
    var dur = p.transitionDuration || 0.6;
    var accent = p.accentColor || "#cdfe00";
    var ibg = p.itemBg || "rgba(255,255,255,0.05)";
    var itemsHtml = "";
    for (var i = 0; i < count; i++) {
      itemsHtml +=
        '<div class="veltro-morphgrid-item" style="flex:0 0 30%;height:120px;min-height:60px;background:' +
        ibg +
        ";border-radius:10px;border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:1.4rem;font-weight:800;color:" +
        accent +
        ";transition:flex-basis " +
        dur +
        "s ease,height " +
        dur +
        "s ease,opacity " +
        dur +
        's ease;overflow:hidden">' +
        (i + 1) +
        "</div>";
    }
    return (
      '<div class="veltro-morphgrid-wrap" id="morphgrid-' +
      id +
      '" data-cycle-speed="' +
      (p.cycleSpeed || 2.5) +
      '" data-auto-cycle="' +
      (p.autoCycle !== false ? "1" : "0") +
      '" data-item-count="' +
      count +
      '" data-gap="' +
      gap +
      '" style="height:' +
      (p.height || 440) +
      "px;background:" +
      (p.bg || "#0d0d1a") +
      ';position:relative;overflow:hidden;border-radius:4px"><div class="veltro-morphgrid-inner" style="display:flex;flex-wrap:wrap;align-content:flex-start;gap:' +
      gap +
      "px;padding:" +
      gap +
      'px;height:100%;overflow:hidden">' +
      itemsHtml +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" min="200" max="1200" value="' +
      (p.height || 440) +
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
      '<div class="rp-row"><label>Item Count</label><input type="range" min="4" max="9" step="1" value="' +
      (p.itemCount || 6) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','itemCount',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Cycle Speed (s)</label><input type="range" min="1" max="8" step="0.5" value="' +
      (p.cycleSpeed || 2.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','cycleSpeed',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Transition Duration (s)</label><input type="range" min="0.2" max="1.5" step="0.1" value="' +
      (p.transitionDuration || 0.6) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','transitionDuration',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Gap (px)</label><input type="range" min="4" max="24" step="2" value="' +
      (p.gap || 10) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','gap',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Accent Colour</label><input type="color" value="' +
      (p.accentColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','accentColor',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Item Background</label><input type="text" value="' +
      (p.itemBg || "rgba(255,255,255,0.05)") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','itemBg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Auto Cycle</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','autoCycle',this.value==='true')\"><option value=\"true\"" +
      (p.autoCycle !== false ? " selected" : "") +
      '>On</option><option value="false"' +
      (p.autoCycle === false ? " selected" : "") +
      ">Off</option></select></div>";
    return h;
  },
});

// 8. Spatial Navigation
FB.widgets.register("spatialNavigation", {
  label: "Spatial Navigation",
  sublabel: "3D navigation system",
  icon: "◈",
  iconBg: "#1a0d2e",
  iconColor: "#a78bfa",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 400,
    bg: "#0d0d1a",
    navItems: "Home,About,Work,Contact",
    perspective: 800,
    spacing: 100,
  },
  render: function (p) {
    var id = p._blockId || "spatialNav";
    var items = (p.navItems || "Home,About,Work,Contact").split(",");
    var itemsHtml = items
      .map(function (item, i) {
        return (
          '<div class="veltro-spatial-item" style="padding:20px 40px;background:linear-gradient(135deg,rgba(205,254,0,0.15) 0%,rgba(60,165,250,0.15) 100%);border-radius:12px;border:1px solid rgba(255,255,255,0.1);font-size:1.5rem;font-weight:700;color:#fff;transform:translateZ(' +
          i * 50 +
          'px)">' +
          item.trim() +
          "</div>"
        );
      })
      .join("");
    return (
      '<div class="veltro-spatial-wrap" id="spatial-' +
      id +
      '" data-nav-items="' +
      p.navItems +
      '" data-perspective="' +
      p.perspective +
      '" data-spacing="' +
      p.spacing +
      '" style="height:' +
      p.height +
      "px;background:" +
      p.bg +
      ";position:relative;overflow:hidden;border-radius:4px;display:flex;align-items:center;justify-content:center;perspective:" +
      p.perspective +
      'px"><div class="veltro-spatial-nav" style="display:flex;flex-direction:column;gap:' +
      p.spacing +
      'px;transform-style:preserve-3d">' +
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
      '<div class="rp-row"><label>Nav Items (CSV)</label><input type="text" value="' +
      (p.navItems || "Home,About,Work,Contact") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','navItems',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Perspective (px)</label><input type="range" min="200" max="2000" step="100" value="' +
      (p.perspective || 800) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','perspective',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Spacing (px)</label><input type="range" min="20" max="300" step="10" value="' +
      (p.spacing || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','spacing',+this.value)\"></div>";
    return h;
  },
});

// ── Missing Original Widgets ──

// cursorLens
FB.widgets.register("cursorLens", {
  label: "Cursor Lens",
  sublabel: "Magnify on hover",
  icon: "🔍",
  iconBg: "#f97316",
  iconColor: "#fff",
  category: "veltro",
  subCategory: "cursor",
  defaultProps: {
    height: 300,
    bg: "#0d0d1a",
    image: "https://picsum.photos/800/400?random=1",
    lensSize: 120,
    magnification: 2,
  },
  render: function (p) {
    var id = p._blockId || "lens0";
    return (
      '<div class="veltro-lens-wrap fw-widget-cursorLens" id="lens-' +
      id +
      '" data-lens-size="' +
      (p.lensSize || 120) +
      '" data-magnification="' +
      (p.magnification || 2) +
      '" style="height:' +
      (p.height || 300) +
      "px;background:" +
      (p.bg || "#0d0d1a") +
      ';position:relative;overflow:hidden;border-radius:4px;cursor:none"><img class="veltro-lens-bg" src="' +
      (p.image || "https://picsum.photos/800/400?random=1") +
      '" style="width:100%;height:100%;object-fit:cover"><div class="veltro-lens-mask" style="position:absolute;width:' +
      (p.lensSize || 120) +
      "px;height:" +
      (p.lensSize || 120) +
      'px;border-radius:50%;border:2px solid rgba(255,255,255,0.5);overflow:hidden;pointer-events:none;transform:translate(-50%,-50%);left:var(--lx,50%);top:var(--ly,50%)"><img src="' +
      (p.image || "https://picsum.photos/800/400?random=1") +
      '" style="position:absolute;width:' +
      (p.magnification || 2) * 100 +
      "%;height:" +
      (p.magnification || 2) * 100 +
      '%;object-fit:cover;left:var(--lx-offset,0);top:var(--ly-offset,0)"></div></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 300) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Image URL</label><input type="text" value="' +
      (p.image || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','image',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Lens Size (px)</label><input type="number" min="60" max="300" value="' +
      (p.lensSize || 120) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','lensSize',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Magnification</label><input type="range" min="1.2" max="5" step="0.1" value="' +
      (p.magnification || 2) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','magnification',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    return h;
  },
});

// shaderBg
FB.widgets.register("shaderBg", {
  label: "Shader Background",
  sublabel: "WebGL GLSL backgrounds",
  icon: "🌊",
  iconBg: "#3b82f6",
  iconColor: "#fff",
  category: "veltro",
  subCategory: "backgrounds",
  defaultProps: {
    height: 400,
    bg: "#050510",
    shaderType: "noise",
    speed: 0.5,
    intensity: 1,
    color1: "#3b82f6",
    color2: "#8b5cf6",
  },
  render: function (p) {
    var id = p._blockId || "shader0";
    return (
      '<div class="veltro-shader-wrap" id="shader-' +
      id +
      '" data-shader-type="' +
      (p.shaderType || "noise") +
      '" data-speed="' +
      (p.speed || 0.5) +
      '" data-intensity="' +
      (p.intensity || 1) +
      '" data-color1="' +
      (p.color1 || "#3b82f6") +
      '" data-color2="' +
      (p.color2 || "#8b5cf6") +
      '" style="height:' +
      (p.height || 400) +
      "px;background:" +
      (p.bg || "#050510") +
      ';position:relative;overflow:hidden;border-radius:4px"><canvas class="veltro-shader-canvas" style="position:absolute;inset:0;width:100%;height:100%"></canvas></div>'
    );
  },
  editPanel: function (id, p) {
    var h =
      '<div class="rp-row"><label>Shader Type</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','shaderType',this.value)\">" +
      ["noise", "plasma", "grid", "ripple", "tunnel"]
        .map(function (v) {
          return (
            '<option value="' +
            v +
            '"' +
            ((p.shaderType || "noise") === v ? " selected" : "") +
            ">" +
            v.charAt(0).toUpperCase() +
            v.slice(1) +
            "</option>"
          );
        })
        .join("") +
      "</select></div>";
    h +=
      '<div class="rp-row"><label>Height (px)</label><input type="number" value="' +
      (p.height || 400) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Speed</label><input type="range" min="0" max="2" step="0.05" value="' +
      (p.speed || 0.5) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','speed',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Intensity</label><input type="range" min="0.1" max="3" step="0.1" value="' +
      (p.intensity || 1) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','intensity',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Colour 1</label><input type="color" value="' +
      (p.color1 || "#3b82f6") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color1',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Colour 2</label><input type="color" value="' +
      (p.color2 || "#8b5cf6") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color2',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Background</label><input type="color" value="' +
      (p.bg || "#050510") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    return h;
  },
});

// infiniteCanvas
FB.widgets.register("infiniteCanvas", {
  label: "Infinite Canvas",
  sublabel: "Pan & zoom space",
  icon: "🗺️",
  iconBg: "#10b981",
  iconColor: "#fff",
  category: "veltro",
  subCategory: "spatial",
  defaultProps: {
    height: 400,
    bg: "#0a0a1a",
    gridSize: 40,
    gridColor: "rgba(255,255,255,0.05)",
  },
  render: function (p) {
    var id = p._blockId || "infinite0";
    return (
      '<div class="veltro-infinite-wrap" id="infinite-' +
      id +
      '" data-grid-size="' +
      (p.gridSize || 40) +
      '" data-grid-color="' +
      (p.gridColor || "rgba(255,255,255,0.05)") +
      '" style="height:' +
      (p.height || 400) +
      "px;background:" +
      (p.bg || "#0a0a1a") +
      ';position:relative;overflow:hidden;border-radius:4px;cursor:grab"><canvas class="veltro-infinite-canvas" style="position:absolute;inset:0;width:100%;height:100%"></canvas></div>'
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
      (p.bg || "#0a0a1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Grid Size (px)</label><input type="range" min="10" max="100" step="5" value="' +
      (p.gridSize || 40) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','gridSize',+this.value)\"></div>";
    h +=
      '<div class="rp-row"><label>Grid Colour (rgba)</label><input type="text" value="' +
      (p.gridColor || "rgba(255,255,255,0.05)") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','gridColor',this.value)\"></div>";
    return h;
  },
});

