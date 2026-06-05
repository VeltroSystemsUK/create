FB.motion = FB.motion || {};

// ── State ────────────────────────────────────────────────────
FB.motion._state = {
  layers: [], duration: 3000, fps: 30,
  time: 0, playing: false, _lastRaf: 0,
  selectedLayer: null,
  dragLayer: null, dragOffX: 0, dragOffY: 0,
  nextId: 1,
  canvasW: 400, canvasH: 300,
  bgColor: "#0d0d1a",
};

// ── Open / close ──────────────────────────────────────────────
FB.motion.open = function () {
  document.getElementById("ds-motion-overlay").style.display = "flex";
  FB.motion._init();
};
FB.motion.close = function () {
  document.getElementById("ds-motion-overlay").style.display = "none";
  FB.motion._stop();
};

// ── Init ──────────────────────────────────────────────────────
FB.motion._init = function () {
  if (FB.motion._inited) return;
  FB.motion._inited = true;
  FB.motion._renderUI();
  FB.motion._bindCanvas();
  FB.motion._addDefaultLayers();
  FB.motion._renderTimeline();
  FB.motion._drawStage();
};

// ── Default scene ─────────────────────────────────────────────
FB.motion._addDefaultLayers = function () {
  var s = FB.motion._state;
  if (s.layers.length) return;
  var cw = s.canvasW, ch = s.canvasH;

  // Glowing circle
  var c = FB.motion._makeLayer("ellipse", "Glow", cw/2-40, ch/2-40, 80, 80, "#cdfe00");
  c.fill = { type: "gradient", color: "#cdfe00", color2: "#00e0ff" };
  c.keyframes.scale    = [{ t:0, v:[1,1] }, { t:s.duration, v:[1.4,1.4] }];
  c.keyframes.opacity  = [{ t:0, v:0.9 }, { t:s.duration, v:0.4 }];
  s.layers.push(c);

  // Rotating rectangle
  var r = FB.motion._makeLayer("rect", "Box", cw/2-25, ch/2-25, 50, 50, "#7c3aed");
  r.keyframes.rotation = [{ t:0, v:0 }, { t:s.duration, v:360 }];
  r.keyframes.position = [{ t:0, v:[cw/2-25, ch/2-25] }, { t:s.duration, v:[cw-80, ch/2-25] }];
  s.layers.push(r);

  // Stroke ring
  var ring = FB.motion._makeLayer("ellipse", "Ring", cw/2-50, ch/2-50, 100, 100, "none");
  ring.fill = { type: "none", color: "#cdfe00", color2: "#cdfe00" };
  ring.stroke = { color: "#cdfe00", width: 3, trim: { start: 0, end: 100 } };
  ring.keyframes.scale = [{ t:0, v:[0.2,0.2] }, { t:s.duration, v:[1.6,1.6] }];
  ring.keyframes.opacity = [{ t:0, v:1 }, { t:s.duration, v:0 }];
  s.layers.push(ring);

  FB.motion._renderLayers();
  FB.motion._renderTimeline();
};

// ── Layer factory ─────────────────────────────────────────────
FB.motion._makeLayer = function (type, name, x, y, w, h, fillColor) {
  var s = FB.motion._state;
  var id = s.nextId++;
  var cx = x !== undefined ? x : 150;
  var cy = y !== undefined ? y : 100;
  return {
    id: id,
    type: type,
    name: name || (type + " " + id),
    w: w || 80, h: h || 80,
    fill:   { type: fillColor === "none" ? "none" : "solid", color: fillColor || "#cdfe00", color2: "#0d0d1a" },
    stroke: { color: "#cdfe00", width: 0, trim: { start: 0, end: 100 } },
    // Shape extras
    points: 5, innerRatio: 0.42,   // star
    sides: 6,                       // polygon
    text: "Text", fontSize: 36, fontFamily: "sans-serif",
    keyframes: {
      position:  [{ t:0, v:[cx,cy] }, { t:s.duration, v:[cx,cy] }],
      scale:     [{ t:0, v:[1,1] },   { t:s.duration, v:[1,1] }],
      rotation:  [{ t:0, v:0 },       { t:s.duration, v:0 }],
      opacity:   [{ t:0, v:1 },       { t:s.duration, v:1 }],
      trimStart: [{ t:0, v:0 },       { t:s.duration, v:0 }],
      trimEnd:   [{ t:0, v:100 },     { t:s.duration, v:100 }],
    },
  };
};

// ── Add shapes ────────────────────────────────────────────────
FB.motion._addShape = function (type, opts) {
  var s = FB.motion._state;
  var cw = s.canvasW, ch = s.canvasH;
  var w = opts.w || 80, h = opts.h || 80;
  var ly = FB.motion._makeLayer(type, opts.name, cw/2-w/2, ch/2-h/2, w, h, opts.color);
  if (opts.fill)   ly.fill   = opts.fill;
  if (opts.stroke) ly.stroke = opts.stroke;
  if (opts.points) ly.points = opts.points;
  if (opts.sides)  ly.sides  = opts.sides;
  if (opts.text)   ly.text   = opts.text;
  if (opts.fontSize) ly.fontSize = opts.fontSize;
  s.layers.push(ly);
  s.selectedLayer = ly.id;
  FB.motion._renderLayers();
  FB.motion._renderTimeline();
  FB.motion._renderProps();
  FB.motion._drawStage();
};

FB.motion._addRect     = function () { FB.motion._addShape("rect",    { w:80, h:80, color:"#cdfe00" }); };
FB.motion._addEllipse  = function () { FB.motion._addShape("ellipse", { w:80, h:80, color:"#38bdf8" }); };
FB.motion._addStar     = function () { FB.motion._addShape("star",    { w:90, h:90, color:"#f97316", points:5 }); };
FB.motion._addPolygon  = function () { FB.motion._addShape("polygon", { w:80, h:80, color:"#a78bfa", sides:6 }); };
FB.motion._addTriangle = function () { FB.motion._addShape("polygon", { w:80, h:80, color:"#ff6b6b", sides:3 }); };
FB.motion._addDiamond  = function () { FB.motion._addShape("polygon", { w:80, h:80, color:"#51cf66", sides:4 }); };
FB.motion._addEmoji    = function (emoji) {
  var s = FB.motion._state;
  var typeNames = { "❤":"Heart", "😀":"Smile", "⭐":"Star", "🔥":"Fire", "⚡":"Thunder", "🎯":"Target", "✓":"Check", "⚙":"Gear", "🔔":"Bell", "💡":"Bulb", "🎁":"Gift", "📱":"Phone" };
  var name = (typeNames[emoji] || "Emoji") + " " + s.nextId;
  var ly = FB.motion._makeLayer("text", name, s.canvasW/2-40, s.canvasH/2-40, 80, 80, "#cdfe00");
  ly.text = emoji;
  ly.fontSize = 72;
  s.layers.push(ly);
  s.selectedLayer = ly.id;
  FB.motion._renderLayers();
  FB.motion._renderTimeline();
  FB.motion._renderProps();
  FB.motion._drawStage();
};
FB.motion._addLine     = function () {
  var s = FB.motion._state;
  var cw = s.canvasW, ch = s.canvasH;
  var ly = FB.motion._makeLayer("line", "Line " + s.nextId, cw/2-60, ch/2, 120, 0, "none");
  ly.fill   = { type: "none", color: "#cdfe00", color2: "#cdfe00" };
  ly.stroke = { color: "#cdfe00", width: 3, trim: { start: 0, end: 100 } };
  s.layers.push(ly); s.selectedLayer = ly.id;
  FB.motion._renderLayers(); FB.motion._renderTimeline(); FB.motion._renderProps(); FB.motion._drawStage();
};
FB.motion._addText     = function () {
  var s = FB.motion._state;
  var ly = FB.motion._makeLayer("text", "Text " + s.nextId, s.canvasW/2-60, s.canvasH/2-20, 120, 40, "#ffffff");
  ly.text = "Hello"; ly.fontSize = 36;
  s.layers.push(ly); s.selectedLayer = ly.id;
  FB.motion._renderLayers(); FB.motion._renderTimeline(); FB.motion._renderProps(); FB.motion._drawStage();
};

FB.motion._deleteLayer = function () {
  var s = FB.motion._state;
  if (!s.selectedLayer) return;
  s.layers = s.layers.filter(function (l) { return l.id !== s.selectedLayer; });
  s.selectedLayer = s.layers.length ? s.layers[s.layers.length-1].id : null;
  FB.motion._renderLayers(); FB.motion._renderTimeline(); FB.motion._renderProps(); FB.motion._drawStage();
};

FB.motion._duplicateLayer = function () {
  var s = FB.motion._state;
  var src = s.layers.find(function (l) { return l.id === s.selectedLayer; });
  if (!src) return;
  var copy = JSON.parse(JSON.stringify(src));
  copy.id = s.nextId++;
  copy.name = copy.name + " copy";
  copy.keyframes.position = copy.keyframes.position.map(function (k) {
    return { t: k.t, v: [k.v[0]+10, k.v[1]+10] };
  });
  s.layers.push(copy); s.selectedLayer = copy.id;
  FB.motion._renderLayers(); FB.motion._renderTimeline(); FB.motion._renderProps(); FB.motion._drawStage();
};

// ── Property setters ─────────────────────────────────────────
FB.motion._selectedLayer = function () {
  var s = FB.motion._state;
  return s.layers.find(function (l) { return l.id === s.selectedLayer; }) || null;
};
FB.motion._setFillColor = function (color) {
  var ly = FB.motion._selectedLayer(); if (!ly) return;
  ly.fill.color = color; FB.motion._drawStage();
};
FB.motion._setFillColor2 = function (color) {
  var ly = FB.motion._selectedLayer(); if (!ly) return;
  ly.fill.color2 = color; FB.motion._drawStage();
};
FB.motion._setFillType = function (type) {
  var ly = FB.motion._selectedLayer(); if (!ly) return;
  ly.fill.type = type; FB.motion._renderProps(); FB.motion._drawStage();
};
FB.motion._setStrokeColor = function (color) {
  var ly = FB.motion._selectedLayer(); if (!ly) return;
  ly.stroke.color = color; FB.motion._drawStage();
};
FB.motion._setStrokeWidth = function (w) {
  var ly = FB.motion._selectedLayer(); if (!ly) return;
  ly.stroke.width = +w; FB.motion._drawStage();
};
FB.motion._setSize = function (w, h) {
  var ly = FB.motion._selectedLayer(); if (!ly) return;
  if (w) ly.w = +w; if (h) ly.h = +h; FB.motion._drawStage();
};
FB.motion._setTrimAtTime = function (start, end) {
  var ly = FB.motion._selectedLayer(); if (!ly) return;
  var t = FB.motion._state.time;
  function upsert(prop, val) {
    var kfs = ly.keyframes[prop];
    var idx = kfs.findIndex(function(k){ return Math.abs(k.t - t) < 20; });
    if (idx >= 0) kfs[idx].v = val;
    else { kfs.push({ t: t, v: val }); kfs.sort(function(a,b){return a.t-b.t;}); }
  }
  if (start !== null) upsert("trimStart", start);
  if (end   !== null) upsert("trimEnd",   end);
  FB.motion._drawStage();
  FB.motion._renderTimeline();
};
FB.motion._setLayerText = function (val) {
  var ly = FB.motion._selectedLayer(); if (!ly) return;
  ly.text = val; FB.motion._drawStage();
};
FB.motion._setBg = function (color) {
  FB.motion._state.bgColor = color; FB.motion._drawStage();
};
FB.motion._setDuration = function (ms) {
  FB.motion._state.duration = Math.max(500, +ms);
};
FB.motion._setCanvasSize = function (w, h) {
  FB.motion._state.canvasW = +w || 400;
  FB.motion._state.canvasH = +h || 300;
  var c = document.getElementById("mc-stage");
  if (c) { c.width = FB.motion._state.canvasW; c.height = FB.motion._state.canvasH; }
  FB.motion._drawStage();
};

// ── UI Rendering ──────────────────────────────────────────────
FB.motion._renderUI = function () {
  var main = document.getElementById("ds-motion-main");
  if (!main) return;
  var s = FB.motion._state;
  var h = "";

  // ── Header ─────────────────────────────────────────────────
  h += '<div class="mc-modal-head">';
  h += '<span class="mc-modal-title">✦ Motion Creator</span>';
  h += '<span class="mc-toolbar-div"></span>';

  // Layer Actions
  h += '<button class="mc-btn" onclick="FB.motion._duplicateLayer()" title="Duplicate">⊕</button>';
  h += '<button class="mc-btn" onclick="FB.motion._deleteLayer()" title="Delete">✕</button>';
  h += '<span class="mc-toolbar-div"></span>';

  // Playback
  h += '<span class="mc-time-disp" id="mc-time-display">0.0s / ' + (s.duration/1000).toFixed(1) + 's</span>';
  h += '<button class="mc-btn mc-btn-play" id="mc-play-btn" onclick="FB.motion._togglePlay()">▶</button>';
  h += '<span class="mc-toolbar-div"></span>';

  // Canvas / duration / bg — compact inline
  h += '<span class="mc-group-label">Canvas</span>';
  h += '<input class="mc-num-input" type="number" value="' + s.canvasW + '" min="100" max="3840" title="Width px" onchange="FB.motion._setCanvasSize(this.value,' + s.canvasH + ')" style="width:50px">';
  h += '<span class="mc-settings-x">×</span>';
  h += '<input class="mc-num-input" type="number" value="' + s.canvasH + '" min="100" max="2160" title="Height px" onchange="FB.motion._setCanvasSize(' + s.canvasW + ',this.value)" style="width:50px">';
  h += '<span class="mc-toolbar-div"></span>';
  h += '<span class="mc-group-label">Dur</span>';
  h += '<input class="mc-num-input" type="number" value="' + (s.duration/1000).toFixed(1) + '" min="0.5" max="60" step="0.5" title="Duration s" onchange="FB.motion._setDuration(this.value*1000)" style="width:44px">s';
  h += '<span class="mc-toolbar-div"></span>';
  h += '<span class="mc-group-label">BG</span>';
  h += '<input type="color" value="' + s.bgColor + '" title="Background color" oninput="FB.motion._setBg(this.value)" class="mc-color-swatch">';
  h += '<span class="mc-toolbar-div"></span>';

  // Export / import / insert
  // Presets dropdown
  h += '<div class="mc-presets-wrap">';
  h += '<button class="mc-btn" onclick="FB.motion._togglePresets()" id="mc-presets-btn">Presets ▾</button>';
  h += '<div class="mc-presets-menu" id="mc-presets-menu" style="display:none">';
  var _groups = [
    ["Spinner","Pulse","Draw On","Loading Bar","Heartbeat"],
    ["Star Burst","Kaleidoscope","Fireworks","Comet","Portal"],
    ["Orbit","Wave Dots","Data Dots","Ripple","DNA"],
    ["Neon Scan","Typewriter","Confetti","Morphing Rings","Clock"],
  ];
  _groups.forEach(function(grp, gi) {
    if (gi > 0) h += '<div class="mc-preset-divider"></div>';
    grp.forEach(function(p){
      h += '<div class="mc-preset-item" onclick="FB.motion._loadPreset(\''+p+'\');FB.motion._closePresets()">'+p+'</div>';
    });
  });
  h += '</div></div>';
  h += '<span class="mc-toolbar-div"></span>';
  h += '<button class="mc-btn" onclick="FB.motion._exportLottie()"  title="Export Lottie JSON">⬇ Lottie</button>';
  h += '<button class="mc-btn" onclick="FB.motion._importLottie()"  title="Import Lottie JSON">⬆ Import</button>';
  h += '<button class="mc-btn" onclick="FB.motion._export()"        title="Export internal JSON" style="color:#555">⬇ JSON</button>';
  h += '<button class="mc-btn mc-btn-insert" onclick="FB.motion._insertBlock()" title="Insert into page">⊞ Insert</button>';

  h += '<button class="mc-modal-close" onclick="FB.motion.close()">✕</button>';
  h += '</div>'; // end mc-modal-head

  // ── Body: left sidebar + stage + right sidebar ─────────────
  h += '<div class="mc-body">';

  // Left: tools & layers accordion
  h += '<div class="mc-left" id="mc-layers">';

  // Tools Accordion
  h += '<div class="mc-accordion-item">';
  h += '<button class="mc-accordion-header active" onclick="FB.motion._toggleAccordion(this)">🔧 Tools<span class="mc-accordion-chevron">›</span></button>';
  h += '<div class="mc-accordion-content active">';
  h += '<div class="mc-tools-grid">';
  h += '<button class="mc-tool-btn" onclick="FB.motion._addRect()" title="Rectangle">▬</button>';
  h += '<button class="mc-tool-btn" onclick="FB.motion._addEllipse()" title="Circle">●</button>';
  h += '<button class="mc-tool-btn" onclick="FB.motion._addLine()" title="Line">╱</button>';
  h += '<button class="mc-tool-btn" onclick="FB.motion._addText()" title="Text">T</button>';
  h += '</div>';
  h += '</div>';
  h += '</div>';

  // Shapes Accordion
  h += '<div class="mc-accordion-item">';
  h += '<button class="mc-accordion-header active" onclick="FB.motion._toggleAccordion(this)">⬢ Shapes<span class="mc-accordion-chevron">›</span></button>';
  h += '<div class="mc-accordion-content active">';
  h += '<div class="mc-shapes-grid">';
  h += '<button class="mc-shape-btn" onclick="FB.motion._addStar()" title="Star">★</button>';
  h += '<button class="mc-shape-btn" onclick="FB.motion._addPolygon()" title="Hexagon">⬡</button>';
  h += '<button class="mc-shape-btn" onclick="FB.motion._addTriangle()" title="Triangle">▲</button>';
  h += '<button class="mc-shape-btn" onclick="FB.motion._addDiamond()" title="Diamond">◆</button>';
  h += '</div>';
  h += '</div>';
  h += '</div>';

  // Emojis & Icons Accordion
  h += '<div class="mc-accordion-item">';
  h += '<button class="mc-accordion-header" onclick="FB.motion._toggleAccordion(this)">🎨 Icons & Emojis<span class="mc-accordion-chevron">›</span></button>';
  h += '<div class="mc-accordion-content">';
  h += '<div class="mc-shapes-grid">';
  h += '<button class="mc-shape-btn" onclick="FB.motion._addEmoji(\'❤\')" title="Heart">❤</button>';
  h += '<button class="mc-shape-btn" onclick="FB.motion._addEmoji(\'😀\')" title="Smile">😀</button>';
  h += '<button class="mc-shape-btn" onclick="FB.motion._addEmoji(\'⭐\')" title="Star">⭐</button>';
  h += '<button class="mc-shape-btn" onclick="FB.motion._addEmoji(\'🔥\')" title="Fire">🔥</button>';
  h += '<button class="mc-shape-btn" onclick="FB.motion._addEmoji(\'⚡\')" title="Thunder">⚡</button>';
  h += '<button class="mc-shape-btn" onclick="FB.motion._addEmoji(\'🎯\')" title="Target">🎯</button>';
  h += '<button class="mc-shape-btn" onclick="FB.motion._addEmoji(\'✓\')" title="Check">✓</button>';
  h += '<button class="mc-shape-btn" onclick="FB.motion._addEmoji(\'⚙\')" title="Gear">⚙</button>';
  h += '<button class="mc-shape-btn" onclick="FB.motion._addEmoji(\'🔔\')" title="Bell">🔔</button>';
  h += '<button class="mc-shape-btn" onclick="FB.motion._addEmoji(\'💡\')" title="Bulb">💡</button>';
  h += '<button class="mc-shape-btn" onclick="FB.motion._addEmoji(\'🎁\')" title="Gift">🎁</button>';
  h += '<button class="mc-shape-btn" onclick="FB.motion._addEmoji(\'📱\')" title="Phone">📱</button>';
  h += '</div>';
  h += '</div>';
  h += '</div>';

  // Media Gallery Accordion
  h += '<div class="mc-accordion-item">';
  h += '<button class="mc-accordion-header" onclick="FB.motion._toggleAccordion(this)">🖼️ Media<span class="mc-accordion-chevron">›</span></button>';
  h += '<div class="mc-accordion-content">';
  h += '<input type="file" id="mc-media-upload" accept="image/*" style="display:none;" onchange="FB.motion._handleMediaUpload(this)">';
  h += '<button class="mc-full-btn" onclick="document.getElementById(\'mc-media-upload\').click()">📤 Upload Image</button>';
  h += '<div id="mc-media-gallery" class="mc-media-list"></div>';
  h += '</div>';
  h += '</div>';

  // Layers Accordion
  h += '<div class="mc-accordion-item">';
  h += '<button class="mc-accordion-header active" onclick="FB.motion._toggleAccordion(this)">📋 Layers<span class="mc-accordion-chevron">›</span></button>';
  h += '<div class="mc-accordion-content active" id="mc-layers-list">';
  h += '</div>';
  h += '</div>';

  h += '</div>'; // end mc-left

  // Centre: stage canvas
  h += '<div class="mc-center"><canvas class="mc-stage" id="mc-stage" width="' + s.canvasW + '" height="' + s.canvasH + '"></canvas></div>';

  // Right: properties
  h += '<div class="mc-right" id="mc-props"><div class="mc-prop-section"><div class="mc-props-empty">Select a layer</div></div></div>';

  h += '</div>'; // end mc-body

  // ── Timeline strip ─────────────────────────────────────────
  h += '<div class="mc-timeline-area">';
  h += '<div class="mc-panel-label" style="flex-shrink:0">Timeline</div>';
  h += '<div class="mc-timeline-body" id="mc-timeline-body" style="flex:1;overflow-y:auto;position:relative;"></div>';
  h += '</div>';

  main.innerHTML = h;
};

// ── Properties panel (right sidebar) ─────────────────────────
FB.motion._renderProps = function () {
  var el = document.getElementById("mc-props");
  if (!el) return;
  var ly = FB.motion._selectedLayer();
  if (!ly) {
    el.innerHTML = '<div class="mc-prop-section"><div class="mc-props-empty">Select a layer to edit</div></div>';
    return;
  }
  var fill = ly.fill  || { type:"solid", color:"#cdfe00", color2:"#0d0d1a" };
  var st   = ly.stroke || { color:"#ffffff", width:0 };
  var h = "";

  // Layer name
  h += '<div class="mc-prop-section">';
  h += '<div class="mc-prop-heading">Layer</div>';
  h += '<div class="mc-prop-row"><label>Name</label>';
  h += '<input class="mc-text-input mc-text-wide" type="text" value="' + FB.motion._escAttr(ly.name) + '" onchange="var l=FB.motion._selectedLayer();if(l){l.name=this.value;FB.motion._renderLayers();}"></div>';
  h += '</div>';

  // Fill
  h += '<div class="mc-prop-section">';
  h += '<div class="mc-prop-heading">Fill</div>';
  h += '<div class="mc-prop-row"><label>Type</label>';
  h += '<select class="mc-select" style="flex:1" onchange="FB.motion._setFillType(this.value)">';
  ["solid","gradient","none"].forEach(function(t) {
    h += '<option value="'+t+'"'+(fill.type===t?' selected':'')+'>'+t.charAt(0).toUpperCase()+t.slice(1)+'</option>';
  });
  h += '</select></div>';
  if (fill.type !== "none") {
    h += '<div class="mc-prop-row"><label>Color</label><input type="color" value="'+(fill.color||"#cdfe00")+'" oninput="FB.motion._setFillColor(this.value)" class="mc-color-swatch mc-color-swatch-wide"></div>';
  }
  if (fill.type === "gradient") {
    h += '<div class="mc-prop-row"><label>End</label><input type="color" value="'+(fill.color2||"#0d0d1a")+'" oninput="FB.motion._setFillColor2(this.value)" class="mc-color-swatch mc-color-swatch-wide"></div>';
  }
  h += '</div>';

  // Stroke
  var curTrimS = Math.round(FB.motion._getValue(ly, "trimStart", FB.motion._state.time));
  var curTrimE = Math.round(FB.motion._getValue(ly, "trimEnd",   FB.motion._state.time));
  h += '<div class="mc-prop-section">';
  h += '<div class="mc-prop-heading">Stroke</div>';
  h += '<div class="mc-prop-row"><label>Color</label><input type="color" value="'+(st.color||"#ffffff")+'" oninput="FB.motion._setStrokeColor(this.value)" class="mc-color-swatch mc-color-swatch-wide"></div>';
  h += '<div class="mc-prop-row"><label>Width</label><input class="mc-num-input mc-num-wide" type="number" value="'+(st.width||0)+'" min="0" max="40" onchange="FB.motion._setStrokeWidth(this.value)"><span style="color:#555;font-size:10px">px</span></div>';
  h += '<div class="mc-prop-row"><label>Trim S</label><input type="range" min="0" max="100" value="'+curTrimS+'" style="flex:1" oninput="FB.motion._setTrimAtTime(+this.value,null);document.getElementById(\'mc-ts-val\').textContent=this.value+\'%\'"><span id="mc-ts-val" style="color:#555;font-size:10px;min-width:28px">'+curTrimS+'%</span></div>';
  h += '<div class="mc-prop-row"><label>Trim E</label><input type="range" min="0" max="100" value="'+curTrimE+'" style="flex:1" oninput="FB.motion._setTrimAtTime(null,+this.value);document.getElementById(\'mc-te-val\').textContent=this.value+\'%\'"><span id="mc-te-val" style="color:#555;font-size:10px;min-width:28px">'+curTrimE+'%</span></div>';
  h += '</div>';

  // Size
  h += '<div class="mc-prop-section">';
  h += '<div class="mc-prop-heading">Size</div>';
  h += '<div class="mc-prop-row"><label>W</label><input class="mc-num-input mc-num-wide" type="number" value="'+ly.w+'" min="1" onchange="FB.motion._setSize(this.value,null)"><span style="color:#555;font-size:10px">px</span></div>';
  h += '<div class="mc-prop-row"><label>H</label><input class="mc-num-input mc-num-wide" type="number" value="'+ly.h+'" min="1" onchange="FB.motion._setSize(null,this.value)"><span style="color:#555;font-size:10px">px</span></div>';
  h += '</div>';

  // Text-specific
  if (ly.type === "text") {
    h += '<div class="mc-prop-section">';
    h += '<div class="mc-prop-heading">Text</div>';
    h += '<div class="mc-prop-row"><label>Content</label><input class="mc-text-input mc-text-wide" type="text" value="'+FB.motion._escAttr(ly.text||"Text")+'" oninput="FB.motion._setLayerText(this.value)"></div>';
    h += '<div class="mc-prop-row"><label>Size</label><input class="mc-num-input mc-num-wide" type="number" value="'+(ly.fontSize||36)+'" min="8" max="400" onchange="var l=FB.motion._selectedLayer();if(l){l.fontSize=+this.value;FB.motion._drawStage();}"><span style="color:#555;font-size:10px">px</span></div>';
    h += '</div>';

    h += '<div class="mc-prop-section">';
    h += '<div class="mc-prop-heading">Animations</div>';
    h += '<div class="mc-anim-buttons">';
    h += '<button class="mc-anim-btn" onclick="FB.motion._applyTextAnimation(\'fadeIn\')">Fade</button>';
    h += '<button class="mc-anim-btn" onclick="FB.motion._applyTextAnimation(\'slideInLeft\')">Slide</button>';
    h += '<button class="mc-anim-btn" onclick="FB.motion._applyTextAnimation(\'typewriter\')">Type</button>';
    h += '<button class="mc-anim-btn" onclick="FB.motion._applyTextAnimation(\'scaleIn\')">Scale</button>';
    h += '<button class="mc-anim-btn" onclick="FB.motion._applyTextAnimation(\'rotateIn\')">Rotate</button>';
    h += '<button class="mc-anim-btn" onclick="FB.motion._applyTextAnimation(\'bounce\')">Bounce</button>';
    h += '<button class="mc-anim-btn" onclick="FB.motion._applyTextAnimation(\'pulse\')">Pulse</button>';
    h += '<button class="mc-anim-btn" onclick="FB.motion._applyTextAnimation(\'glow\')">Glow</button>';
    h += '</div>';
    h += '</div>';
  }

  // Star-specific
  if (ly.type === "star") {
    h += '<div class="mc-prop-section">';
    h += '<div class="mc-prop-heading">Star</div>';
    h += '<div class="mc-prop-row"><label>Points</label><input class="mc-num-input mc-num-wide" type="number" value="'+(ly.points||5)+'" min="3" max="20" onchange="var l=FB.motion._selectedLayer();if(l){l.points=+this.value;FB.motion._drawStage();}"></div>';
    h += '<div class="mc-prop-row"><label>Inner</label><input class="mc-num-input mc-num-wide" type="number" value="'+Math.round((ly.innerRatio||0.42)*100)+'" min="5" max="95" onchange="var l=FB.motion._selectedLayer();if(l){l.innerRatio=this.value/100;FB.motion._drawStage();}"><span style="color:#555;font-size:10px">%</span></div>';
    h += '</div>';
  }

  // Polygon-specific
  if (ly.type === "polygon") {
    h += '<div class="mc-prop-section">';
    h += '<div class="mc-prop-heading">Polygon</div>';
    h += '<div class="mc-prop-row"><label>Sides</label><input class="mc-num-input mc-num-wide" type="number" value="'+(ly.sides||6)+'" min="3" max="12" onchange="var l=FB.motion._selectedLayer();if(l){l.sides=+this.value;FB.motion._drawStage();}"></div>';
    h += '</div>';
  }

  el.innerHTML = h;
};

FB.motion._escAttr = function (s) {
  return String(s).replace(/"/g, "&quot;").replace(/</g, "&lt;");
};

// ── Text animation presets ────────────────────────────────────
FB.motion._applyTextAnimation = function (anim) {
  var ly = FB.motion._selectedLayer();
  if (!ly || ly.type !== "text") return;
  var dur = FB.motion._state.duration;
  var start = dur * 0.1, end = dur * 0.9;

  switch(anim) {
    case "fadeIn":
      ly.keyframes.opacity = [{t:0,v:0},{t:start,v:1},{t:end,v:1}];
      break;
    case "slideInLeft":
      ly.keyframes.position = [{t:0,v:[-100,0]},{t:start,v:[0,0]},{t:end,v:[0,0]}];
      break;
    case "scaleIn":
      ly.keyframes.scale = [{t:0,v:[0.1,0.1]},{t:start,v:[1,1]},{t:end,v:[1,1]}];
      break;
    case "rotateIn":
      ly.keyframes.rotation = [{t:0,v:-180},{t:start,v:0},{t:end,v:0}];
      break;
    case "bounce":
      ly.keyframes.position = [{t:0,v:[0,0]},{t:start*0.3,v:[0,-20]},{t:start*0.6,v:[0,10]},{t:start*0.9,v:[0,-5]},{t:start,v:[0,0]},{t:end,v:[0,0]}];
      break;
    case "pulse":
      ly.keyframes.scale = [{t:0,v:[0.9,0.9]},{t:start*0.25,v:[1.1,1.1]},{t:start*0.5,v:[0.9,0.9]},{t:start*0.75,v:[1.1,1.1]},{t:start,v:[1,1]},{t:end,v:[1,1]}];
      break;
    case "glow":
      ly.keyframes.opacity = [{t:0,v:0.3},{t:start*0.5,v:1},{t:start,v:0.7},{t:end,v:0.7}];
      break;
    case "typewriter":
      if (!ly.keyframes) ly.keyframes = {};
      ly.keyframes.trimEnd = [{t:0,v:0},{t:start,v:100},{t:end,v:100}];
      break;
  }
  FB.motion._renderProps();
  FB.motion._drawStage();
};

// ── Media gallery functions ───────────────────────────────────
FB.motion._media = FB.motion._media || [];

FB.motion._handleMediaUpload = function (input) {
  if (!input.files || !input.files[0]) return;
  var file = input.files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    var img = { name: file.name, data: e.target.result };
    FB.motion._media.push(img);
    FB.motion._renderMediaGallery();
  };
  reader.readAsDataURL(file);
};

FB.motion._renderMediaGallery = function () {
  var el = document.getElementById("mc-media-gallery");
  if (!el) return;
  var items = FB.motion._media.map(function (img, i) {
    return '<div class="mc-media-item" onclick="FB.motion._addImageLayer(' + i + ')" title="Click to add to canvas">' +
           '<img src="' + img.data + '" style="max-width:100%; max-height:100%; object-fit:contain;">' +
           '<span class="mc-media-name">' + img.name.substring(0,12) + '</span>' +
           '</div>';
  }).join("");
  el.innerHTML = items || '<div style="color:#555; font-size:9px; text-align:center; padding:8px;">No media yet</div>';
};

FB.motion._addImageLayer = function (idx) {
  if (!FB.motion._media[idx]) return;
  var s = FB.motion._state;
  var img = FB.motion._media[idx];
  var ly = FB.motion._makeLayer("image", "Image " + s.nextId, s.canvasW/2-60, s.canvasH/2-60, 120, 120, img.data);
  ly.imageData = img.data;
  s.layers.push(ly);
  s.selectedLayer = ly.id;
  FB.motion._renderLayers();
  FB.motion._renderTimeline();
  FB.motion._renderProps();
  FB.motion._drawStage();
};

// ── Accordion toggle ──────────────────────────────────────────
FB.motion._toggleAccordion = function (btn) {
  var content = btn.nextElementSibling;
  if (!content) return;
  var isActive = content.classList.contains('active');
  if (isActive) {
    content.classList.remove('active');
    btn.classList.remove('active');
  } else {
    content.classList.add('active');
    btn.classList.add('active');
  }
};

// ── Layers panel ──────────────────────────────────────────────
FB.motion._renderLayers = function () {
  var el = document.getElementById("mc-layers-list");
  if (!el) return;
  var s = FB.motion._state;
  var icons = { rect:"▬", ellipse:"●", circle:"●", star:"★", polygon:"⬡", line:"╱", text:"T" };
  var items = s.layers.slice().reverse().map(function (ly) {
    var sel = ly.id === s.selectedLayer;
    var ic  = icons[ly.type] || "◇";
    var sw  = (ly.fill && ly.fill.type !== "none") ? ly.fill.color : "transparent";
    return '<div class="mc-layers-item' + (sel ? " mc-layers-item-sel" : "") +
           '" onclick="FB.motion._selectLayer(' + ly.id + ')">' +
           '<span class="mc-layers-icon">' + ic + '</span>' +
           '<span class="mc-swatch" style="background:' + sw + '"></span>' +
           '<span class="mc-layers-name">' + ly.name + '</span>' +
           '</div>';
  }).join("");
  el.innerHTML = items;
};

FB.motion._selectLayer = function (id) {
  FB.motion._state.selectedLayer = id;
  FB.motion._renderLayers();
  FB.motion._renderProps();
  FB.motion._drawStage();
};

// ── Timeline ──────────────────────────────────────────────────
FB.motion._renderTimeline = function () {
  var body = document.getElementById("mc-timeline-body");
  if (!body) return;
  var s = FB.motion._state;
  var dur = s.duration;
  var fps = s.fps;
  var basePropLabels = ["Pos", "Scl", "Rot", "Opac"];
  var basePropKeys   = ["position", "scale", "rotation", "opacity"];

  var rulerTicks = "";
  for (var ms = 0; ms <= dur; ms += 100) {
    var pct = (ms / dur) * 100;
    if (ms % 500 === 0) {
      rulerTicks += '<div class="mc-ruler-tick" style="left:' + pct + '%;"><span>' + (ms/1000).toFixed(1) + 's</span></div>';
    }
  }
  var rulerHtml = '<div class="mc-ruler">' +
    '<div class="mc-playhead" id="mc-playhead" style="left:0%"></div>' +
    rulerTicks + '</div>';

  var tracksHtml = s.layers.map(function (ly) {
    var sel = ly.id === s.selectedLayer;
    var hasStroke = ly.stroke && ly.stroke.width > 0;
    var propKeys   = basePropKeys.concat(hasStroke ? ["trimStart","trimEnd"] : []);
    var propLabels = basePropLabels.concat(hasStroke ? ["TrimS","TrimE"] : []);
    return propKeys.map(function (pk, i) {
      var kfs = (ly.keyframes[pk] || []).filter(function(k) {
        // Hide trim tracks that are just holding defaults
        if ((pk === "trimStart" && k.v === 0) || (pk === "trimEnd" && k.v === 100)) return false;
        return true;
      });
      var allKfs = ly.keyframes[pk] || [];
      var dots = allKfs.map(function (kf) {
        var pct = Math.min(100, (kf.t / dur) * 100);
        return '<div class="mc-kf" style="left:' + pct + '%" ' +
               'onclick="event.stopPropagation();FB.motion._removeKf(' + ly.id + ',\'' + pk + '\',' + kf.t + ')" ' +
               'title="' + (kf.t/1000).toFixed(2) + 's — click to remove"></div>';
      }).join("");
      return '<div class="mc-track' + (sel ? " mc-track-sel" : "") + '">' +
             '<div class="mc-track-label">' + (i === 0 ? '<b>' + ly.name.substring(0,7) + '</b>' : "") + ' <span style="color:#555">' + propLabels[i] + '</span></div>' +
             '<div class="mc-track-lane" ' +
             'onclick="FB.motion._trackClick(event,' + ly.id + ',\'' + pk + '\')" ' +
             'title="Click to add keyframe">' + dots + '</div>' +
             '</div>';
    }).join("");
  }).join("");

  body.innerHTML = rulerHtml + tracksHtml;
};

FB.motion._trackClick = function (e, layerId, prop) {
  var lane = e.currentTarget;
  var rect = lane.getBoundingClientRect();
  var pct  = (e.clientX - rect.left) / rect.width;
  var t    = Math.round(pct * FB.motion._state.duration);
  var ly   = FB.motion._state.layers.find(function (l) { return l.id === layerId; });
  if (!ly) return;
  var val  = FB.motion._getValue(ly, prop, t);
  var kfs  = ly.keyframes[prop];
  var existing = kfs.findIndex(function (k) { return Math.abs(k.t - t) < 50; });
  if (existing >= 0) return; // don't add duplicate
  kfs.push({ t: t, v: JSON.parse(JSON.stringify(val)) });
  kfs.sort(function (a, b) { return a.t - b.t; });
  FB.motion._renderTimeline();
};

FB.motion._removeKf = function (layerId, prop, t) {
  var ly = FB.motion._state.layers.find(function (l) { return l.id === layerId; });
  if (!ly) return;
  var kfs = ly.keyframes[prop];
  if (kfs.length <= 1) return; // keep at least one
  ly.keyframes[prop] = kfs.filter(function (k) { return k.t !== t; });
  FB.motion._renderTimeline();
};

// ── Stage drawing ─────────────────────────────────────────────
FB.motion._drawStarPath = function (ctx, cx, cy, pts, outer, inner) {
  var step = Math.PI / pts;
  ctx.moveTo(cx, cy - outer);
  for (var i = 0; i < pts * 2; i++) {
    var r = (i % 2 === 0) ? outer : inner;
    var a = i * step - Math.PI / 2;
    ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
  }
  ctx.closePath();
};

FB.motion._drawPolygonPath = function (ctx, cx, cy, r, sides) {
  for (var i = 0; i <= sides; i++) {
    var a = (i * 2 * Math.PI / sides) - Math.PI / 2;
    if (i === 0) ctx.moveTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r);
    else ctx.lineTo(cx + Math.cos(a)*r, cy + Math.sin(a)*r);
  }
};

FB.motion._applyFill = function (ctx, ly, scx, scy) {
  var f = ly.fill || { type:"solid", color:"#cdfe00" };
  if (f.type === "none") { ctx.fillStyle = "transparent"; return; }
  if (f.type === "gradient") {
    var g = ctx.createLinearGradient(-scx, -scy, scx, scy);
    g.addColorStop(0, f.color  || "#cdfe00");
    g.addColorStop(1, f.color2 || "#0d0d1a");
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = f.color || ly.color || "#cdfe00";
  }
};

FB.motion._drawStage = function () {
  var canvas = document.getElementById("mc-stage");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var s = FB.motion._state;
  var cw = canvas.width, ch = canvas.height;
  var t = s.time;

  // Background
  ctx.fillStyle = s.bgColor || "#0d0d1a";
  ctx.fillRect(0, 0, cw, ch);

  // Subtle grid
  ctx.strokeStyle = "rgba(255,255,255,0.03)";
  ctx.lineWidth = 1;
  for (var gx = 0; gx <= cw; gx += 20) { ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,ch); ctx.stroke(); }
  for (var gy = 0; gy <= ch; gy += 20) { ctx.beginPath(); ctx.moveTo(0,gy); ctx.lineTo(cw,gy); ctx.stroke(); }

  s.layers.forEach(function (ly) {
    var pos = FB.motion._getValue(ly, "position", t);
    var sc  = FB.motion._getValue(ly, "scale", t);
    var rot = FB.motion._getValue(ly, "rotation", t);
    var op  = FB.motion._getValue(ly, "opacity", t);
    var hw = ly.w / 2, hh = ly.h / 2;
    var cx = pos[0] + hw * sc[0], cy = pos[1] + hh * sc[1];

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot * Math.PI / 180);
    ctx.scale(sc[0], sc[1]);
    ctx.globalAlpha = Math.max(0, Math.min(1, op));

    FB.motion._applyFill(ctx, ly, hw, hh);

    var doFill = !ly.fill || ly.fill.type !== "none";
    var doStroke = ly.stroke && ly.stroke.width > 0;
    var trimS = FB.motion._getValue(ly, "trimStart", t) / 100;
    var trimE = FB.motion._getValue(ly, "trimEnd",   t) / 100;
    var hasTrim = doStroke && (trimS > 0 || trimE < 1);

    if (ly.type === "text") {
      ctx.font = "bold " + (ly.fontSize || 36) + "px " + (ly.fontFamily || "sans-serif");
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (doFill)   { ctx.fillText(ly.text || "Text", 0, 0); }
      if (doStroke) { ctx.strokeStyle = ly.stroke.color; ctx.lineWidth = ly.stroke.width / sc[0]; ctx.strokeText(ly.text || "Text", 0, 0); }
    } else if (ly.type === "image" && ly.imageData) {
      var img = new Image();
      img.onload = function() {
        ctx.drawImage(img, -hw, -hh, ly.w, ly.h);
      };
      img.src = ly.imageData;
    } else if (hasTrim && (ly.type === "ellipse" || ly.type === "circle")) {
      // Trimmed ellipse arc — draw fill as full ellipse, stroke as partial arc
      if (doFill) { ctx.beginPath(); ctx.ellipse(0,0,hw,hh,0,0,Math.PI*2); ctx.fill(); }
      var sa = -Math.PI/2 + trimS * Math.PI * 2;
      var ea = -Math.PI/2 + trimE * Math.PI * 2;
      ctx.beginPath(); ctx.ellipse(0, 0, hw, hh, 0, sa, ea);
      ctx.strokeStyle = ly.stroke.color; ctx.lineWidth = ly.stroke.width / sc[0]; ctx.lineCap = "round"; ctx.stroke();
    } else if (hasTrim && ly.type === "line") {
      var tx1 = -hw + trimS * ly.w, tx2 = -hw + trimE * ly.w;
      ctx.beginPath(); ctx.moveTo(tx1, 0); ctx.lineTo(tx2, 0);
      ctx.strokeStyle = ly.stroke.color; ctx.lineWidth = ly.stroke.width / sc[0]; ctx.lineCap = "round"; ctx.stroke();
    } else {
      ctx.beginPath();
      if (ly.type === "rect") {
        ctx.rect(-hw, -hh, ly.w, ly.h);
      } else if (ly.type === "ellipse" || ly.type === "circle") {
        ctx.ellipse(0, 0, hw, hh, 0, 0, Math.PI * 2);
      } else if (ly.type === "star") {
        var outerR = Math.max(hw, hh);
        FB.motion._drawStarPath(ctx, 0, 0, ly.points||5, outerR, (ly.innerRatio||0.42)*outerR);
      } else if (ly.type === "polygon") {
        FB.motion._drawPolygonPath(ctx, 0, 0, Math.max(hw, hh), ly.sides||6);
      } else if (ly.type === "line") {
        ctx.moveTo(-hw, 0); ctx.lineTo(hw, 0);
      }
      if (doFill)   ctx.fill();
      if (doStroke) { ctx.strokeStyle = ly.stroke.color; ctx.lineWidth = ly.stroke.width / sc[0]; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.stroke(); }
    }

    ctx.globalAlpha = 1;
    ctx.restore();

    // Selection outline
    if (ly.id === s.selectedLayer) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(sc[0], sc[1]);
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 1 / sc[0];
      ctx.setLineDash([4, 3]);
      if (ly.type === "ellipse" || ly.type === "circle") {
        ctx.beginPath(); ctx.ellipse(0, 0, hw+3, hh+3, 0, 0, Math.PI*2); ctx.stroke();
      } else if (ly.type === "text") {
        ctx.strokeRect(-hw-4, -hh-4, ly.w+8, ly.h+8);
      } else {
        ctx.strokeRect(-hw-3, -hh-3, ly.w+6, ly.h+6);
      }
      ctx.setLineDash([]);
      ctx.restore();
    }
  });
};

// ── Value interpolation ───────────────────────────────────────
FB.motion._getValue = function (ly, prop, t) {
  var kfs = ly.keyframes[prop];
  if (!kfs || !kfs.length) {
    if (prop === "opacity")   return 1;
    if (prop === "rotation")  return 0;
    if (prop === "scale")     return [1, 1];
    if (prop === "trimStart") return 0;
    if (prop === "trimEnd")   return 100;
    return [0, 0];
  }
  if (kfs.length === 1) return JSON.parse(JSON.stringify(kfs[0].v));
  if (t <= kfs[0].t)   return JSON.parse(JSON.stringify(kfs[0].v));
  if (t >= kfs[kfs.length-1].t) return JSON.parse(JSON.stringify(kfs[kfs.length-1].v));
  for (var i = 0; i < kfs.length-1; i++) {
    if (t >= kfs[i].t && t <= kfs[i+1].t) {
      var r = (t - kfs[i].t) / (kfs[i+1].t - kfs[i].t);
      // Smooth step easing by default
      r = r * r * (3 - 2 * r);
      var a = kfs[i].v, b = kfs[i+1].v;
      if (typeof a === "number") return a + (b - a) * r;
      return [a[0] + (b[0]-a[0])*r, a[1] + (b[1]-a[1])*r];
    }
  }
  return JSON.parse(JSON.stringify(kfs[kfs.length-1].v));
};

// ── Playback ──────────────────────────────────────────────────
FB.motion._togglePlay = function () {
  var s = FB.motion._state;
  s.playing = !s.playing;
  var btn = document.getElementById("mc-play-btn");
  if (btn) btn.textContent = s.playing ? "⏸" : "▶";
  if (s.playing) {
    if (s.time >= s.duration) s.time = 0;
    s._lastRaf = performance.now();
    requestAnimationFrame(FB.motion._loop);
  }
};
FB.motion._stop = function () {
  FB.motion._state.playing = false;
  var btn = document.getElementById("mc-play-btn");
  if (btn) btn.textContent = "▶";
};
FB.motion._loop = function (now) {
  if (!FB.motion._state.playing) return;
  var s = FB.motion._state;
  var dt = Math.min(now - (s._lastRaf || now), 100);
  s._lastRaf = now;
  s.time += dt;
  if (s.time > s.duration) s.time = 0; // always loop in creator
  var pct = (s.time / s.duration) * 100;
  var ph = document.getElementById("mc-playhead");
  if (ph) ph.style.left = pct + "%";
  var disp = document.getElementById("mc-time-display");
  if (disp) disp.textContent = (s.time/1000).toFixed(1) + "s / " + (s.duration/1000).toFixed(1) + "s";
  FB.motion._drawStage();
  requestAnimationFrame(FB.motion._loop);
};

// ── Canvas drag interaction ───────────────────────────────────
FB.motion._bindCanvas = function () {
  var canvas = document.getElementById("mc-stage");
  if (!canvas) return;
  var s = FB.motion._state;

  canvas.addEventListener("mousedown", function (e) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    var mx = (e.clientX - rect.left) * scaleX;
    var my = (e.clientY - rect.top) * scaleY;
    for (var i = s.layers.length-1; i >= 0; i--) {
      var ly = s.layers[i];
      var pos = FB.motion._getValue(ly, "position", s.time);
      var sc  = FB.motion._getValue(ly, "scale", s.time);
      var hw = ly.w * sc[0] / 2, hh = ly.h * sc[1] / 2;
      var cx = pos[0] + hw, cy = pos[1] + hh;
      if (mx >= cx-hw && mx <= cx+hw && my >= cy-hh && my <= cy+hh) {
        s.selectedLayer = ly.id;
        s.dragLayer = ly.id;
        s.dragOffX = mx - pos[0];
        s.dragOffY = my - pos[1];
        FB.motion._renderLayers();
        FB.motion._renderProps();
        FB.motion._drawStage();
        break;
      }
    }
  });

  canvas.addEventListener("mousemove", function (e) {
    if (!s.dragLayer) return;
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    var mx = (e.clientX - rect.left) * scaleX;
    var my = (e.clientY - rect.top) * scaleY;
    var ly = s.layers.find(function (l) { return l.id === s.dragLayer; });
    if (!ly) return;
    var newX = mx - s.dragOffX, newY = my - s.dragOffY;
    // Update current-time keyframe or nearest
    var kfs = ly.keyframes.position;
    var nearest = kfs.reduce(function (best, k) {
      return Math.abs(k.t - s.time) < Math.abs(best.t - s.time) ? k : best;
    }, kfs[0]);
    nearest.v = [newX, newY];
    FB.motion._drawStage();
  });

  canvas.addEventListener("mouseup", function () { s.dragLayer = null; });
  canvas.addEventListener("mouseleave", function () { s.dragLayer = null; });
};

// ── Export / Import ───────────────────────────────────────────
FB.motion._download = function (content, filename, mime) {
  var blob = new Blob([content], { type: mime || "application/json" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

FB.motion._export = function () {
  var s = FB.motion._state;
  FB.motion._download(JSON.stringify({ duration:s.duration, fps:s.fps, canvasW:s.canvasW, canvasH:s.canvasH, bgColor:s.bgColor, layers:s.layers }, null, 2), "animation.json");
};

// ── Helpers for Lottie export ─────────────────────────────────
FB.motion._hexToRgb = function (h) {
  h = h.replace("#", "");
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  return { r: parseInt(h.substr(0,2),16), g: parseInt(h.substr(2,2),16), b: parseInt(h.substr(4,2),16) };
};
FB.motion._hexToLottieRgb = function (hex) {
  var c = FB.motion._hexToRgb(hex || "#000000");
  return [c.r/255, c.g/255, c.b/255];
};

FB.motion._kfsToLottie = function (kfs, dur, fps, mapFn) {
  if (!kfs || kfs.length <= 1) {
    var v = kfs && kfs.length ? kfs[0].v : 0;
    return { a: 0, k: mapFn ? mapFn(v) : v };
  }
  return {
    a: 1,
    k: kfs.map(function (kf, i) {
      var s = mapFn ? mapFn(kf.v) : kf.v;
      if (!Array.isArray(s)) s = [s];
      var lk = { t: Math.round((kf.t/1000)*fps), s: s };
      if (i < kfs.length-1) {
        var nv = mapFn ? mapFn(kfs[i+1].v) : kfs[i+1].v;
        lk.e = Array.isArray(nv) ? nv : [nv];
        lk.o = { x:[0.25,0.25], y:[0.1,0.1] };
        lk.i = { x:[0.25,0.25], y:[1,1] };
      }
      return lk;
    }),
  };
};

FB.motion._exportLottie = function () {
  var s = FB.motion._state;
  var fps = s.fps || 30;
  var dur = s.duration;
  var fc  = Math.ceil((dur/1000) * fps);
  var cw  = s.canvasW, ch = s.canvasH;

  var layers = s.layers.map(function (ly, idx) {
    var fill  = ly.fill  || { type:"solid", color:"#cdfe00" };
    var st    = ly.stroke || { color:"#ffffff", width:0 };
    var isGrad = fill.type === "gradient";
    var noFill = fill.type === "none";

    // Transform
    var hw = ly.w/2, hh = ly.h/2;
    var ks = {
      a: { a:0, k:[hw, hh] },
      p: FB.motion._kfsToLottie(ly.keyframes.position, dur, fps, function(v){ return [v[0]+hw, v[1]+hh]; }),
      s: FB.motion._kfsToLottie(ly.keyframes.scale,    dur, fps, function(v){ return [v[0]*100, v[1]*100]; }),
      r: FB.motion._kfsToLottie(ly.keyframes.rotation, dur, fps, function(v){ return typeof v==="number"?v:v[0]; }),
      o: FB.motion._kfsToLottie(ly.keyframes.opacity,  dur, fps, function(v){ return (typeof v==="number"?v:1)*100; }),
    };

    var shapes = [];

    // Geometry
    if (ly.type === "rect") {
      shapes.push({ ty:"rc", nm:ly.name, p:{ a:0, k:[0,0] }, s:{ a:0, k:[ly.w, ly.h] }, r:{ a:0, k:0 } });
    } else if (ly.type === "ellipse" || ly.type === "circle") {
      shapes.push({ ty:"el", nm:ly.name, p:{ a:0, k:[0,0] }, s:{ a:0, k:[ly.w, ly.h] } });
    } else if (ly.type === "star") {
      var or = Math.max(ly.w, ly.h) / 2;
      shapes.push({ ty:"sr", nm:ly.name, sy:1, pt:{ a:0, k:ly.points||5 },
        p:{ a:0, k:[0,0] }, r:{ a:0, k:0 },
        os:{ a:0, k:or }, is:{ a:0, k:or*(ly.innerRatio||0.42) },
        or:{ a:0, k:0 }, ir:{ a:0, k:0 } });
    } else if (ly.type === "polygon") {
      var pr = Math.max(ly.w, ly.h) / 2;
      shapes.push({ ty:"sr", nm:ly.name, sy:2, pt:{ a:0, k:ly.sides||6 },
        p:{ a:0, k:[0,0] }, r:{ a:0, k:0 }, os:{ a:0, k:pr }, or:{ a:0, k:0 } });
    } else if (ly.type === "text") {
      // Lottie text layer (ty:5) — emit simplified shape layer fallback
      shapes.push({ ty:"rc", nm:"TextBounds", p:{ a:0, k:[0,0] }, s:{ a:0, k:[ly.w||120, ly.h||50] }, r:{ a:0, k:0 } });
    } else if (ly.type === "line") {
      shapes.push({ ty:"sh", nm:"Line", ks:{ a:0, k:{ i:[[0,0],[0,0]], o:[[0,0],[0,0]], v:[[-ly.w/2,0],[ly.w/2,0]], c:false } } });
    }

    // Fill
    if (!noFill) {
      if (isGrad) {
        var c1 = FB.motion._hexToLottieRgb(fill.color);
        var c2 = FB.motion._hexToLottieRgb(fill.color2||"#0d0d1a");
        shapes.push({ ty:"gf", nm:"Gradient Fill", t:1,
          g:{ p:2, k:{ a:0, k:[0,c1[0],c1[1],c1[2], 1,c2[0],c2[1],c2[2]] } },
          s:{ a:0, k:[-ly.w/2, 0] }, e:{ a:0, k:[ly.w/2, 0] }, o:{ a:0, k:100 } });
      } else {
        var fc2 = FB.motion._hexToLottieRgb(fill.color||"#cdfe00");
        shapes.push({ ty:"fl", nm:"Fill", c:{ a:0, k:fc2 }, o:{ a:0, k:100 } });
      }
    }

    // Stroke
    if (st.width > 0) {
      var sc2 = FB.motion._hexToLottieRgb(st.color||"#ffffff");
      shapes.push({ ty:"st", nm:"Stroke", c:{ a:0, k:sc2 }, o:{ a:0, k:100 }, w:{ a:0, k:st.width }, lj:2, lc:2 });
    }

    // Trim path — always emit for stroked shapes so keyframes are honoured
    if (st.width > 0) {
      var trimSKfs = ly.keyframes.trimStart;
      var trimEKfs = ly.keyframes.trimEnd;
      var isAnimS = trimSKfs && trimSKfs.some(function(k){ return k.v !== 0; });
      var isAnimE = trimEKfs && trimEKfs.some(function(k){ return k.v !== 100; });
      if (isAnimS || isAnimE) {
        shapes.push({
          ty: "tm", nm: "Trim",
          s: isAnimS ? FB.motion._kfsToLottie(trimSKfs, dur, fps, function(v){ return typeof v==="number"?v:v[0]; })
                     : { a:0, k:0 },
          e: isAnimE ? FB.motion._kfsToLottie(trimEKfs, dur, fps, function(v){ return typeof v==="number"?v:v[0]; })
                     : { a:0, k:100 },
          o: { a:0, k:0 }
        });
      }
    }

    return { ty:4, nm:ly.name, ind:idx+1, ip:0, op:fc, st:0, ks:ks, shapes:[{ ty:"gr", nm:"Group", it:shapes.concat([{ ty:"tr", p:{a:0,k:[0,0]}, a:{a:0,k:[0,0]}, s:{a:0,k:[100,100]}, r:{a:0,k:0}, o:{a:0,k:100} }]) }] };
  });

  var lottie = { v:"5.9.4", fr:fps, ip:0, op:fc, w:cw, h:ch, ddd:0, assets:[], layers:layers.reverse() };
  FB.motion._download(JSON.stringify(lottie, null, 2), "animation.lottie.json");
};

// ── Import Lottie ─────────────────────────────────────────────
FB.motion._importLottie = function () {
  var input = document.createElement("input");
  input.type = "file"; input.accept = ".json";
  input.onchange = function (e) {
    var file = e.target.files[0]; if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      try { FB.motion._loadLottie(JSON.parse(ev.target.result)); }
      catch (err) { if (typeof FB.util !== "undefined") FB.util.showToast("Invalid Lottie JSON"); }
    };
    reader.readAsText(file);
  };
  input.click();
};

FB.motion._loadLottie = function (data) {
  if (!data.layers || !data.layers.length) return;
  var s = FB.motion._state;
  s.layers = []; s.nextId = 1;
  s.duration = ((data.op||60) / (data.fr||30)) * 1000;
  s.fps = data.fr || 30;
  s.canvasW = data.w || 400; s.canvasH = data.h || 300;

  data.layers.forEach(function (ly) {
    if (ly.ty !== 4) return;
    var grp = (ly.shapes && ly.shapes[0] && ly.shapes[0].ty === "gr") ? ly.shapes[0].it : ly.shapes || [];
    var geom  = grp.find(function(s){ return ["rc","el","sr","sh"].includes(s.ty); });
    var fill  = grp.find(function(s){ return s.ty === "fl"; });
    var gfill = grp.find(function(s){ return s.ty === "gf"; });
    var stk   = grp.find(function(s){ return s.ty === "st"; });

    var type = "rect", w = 80, h = 80;
    if (geom) {
      if (geom.ty === "el")  { type = "ellipse"; var sz = geom.s && geom.s.k; w = sz?sz[0]:80; h = sz?sz[1]:80; }
      if (geom.ty === "rc")  { type = "rect";    var sz = geom.s && geom.s.k; w = sz?sz[0]:80; h = sz?sz[1]:80; }
      if (geom.ty === "sr")  { type = geom.sy===2?"polygon":"star"; w = (geom.os&&geom.os.k||40)*2; h=w; }
    }

    function kfMap(prop, fn) {
      if (!prop) return null;
      if (prop.a===0) return null;
      return (prop.k||[]).filter(function(k){return k.s;}).map(function(k){
        var v = fn ? fn(k.s) : (k.s.length===1?k.s[0]:k.s);
        return { t: Math.round((k.t/(data.fr||30))*1000), v: v };
      });
    }
    function fallback(prop, fn, def) {
      var kfs = kfMap(prop, fn);
      if (kfs && kfs.length) return kfs;
      if (prop && prop.a===0) {
        var v = fn ? fn(Array.isArray(prop.k)?prop.k:[prop.k]) : (Array.isArray(prop.k)?prop.k:prop.k);
        return [{ t:0, v:v }, { t:s.duration, v:v }];
      }
      return [{ t:0, v:def }, { t:s.duration, v:def }];
    }

    var ks = ly.ks || {};
    var newLy = FB.motion._makeLayer(type, ly.nm||"Layer", 0, 0, w, h);
    newLy.keyframes.position = fallback(ks.p, function(v){ return [v[0]-(w/2), v[1]-(h/2)]; }, [0,0]);
    newLy.keyframes.scale    = fallback(ks.s, function(v){ return [v[0]/100, v[1]/100]; }, [1,1]);
    newLy.keyframes.rotation = fallback(ks.r, function(v){ return typeof v==="number"?v:v[0]; }, 0);
    newLy.keyframes.opacity  = fallback(ks.o, function(v){ return (typeof v==="number"?v:v[0])/100; }, 1);

    if (gfill && gfill.g && gfill.g.k) {
      var gk = gfill.g.k.k || gfill.g.k;
      var c1h = gk.slice(1,4).map(function(v){return Math.round(v*255);});
      var c2h = gk.slice(5,8).map(function(v){return Math.round(v*255);});
      newLy.fill = { type:"gradient",
        color:"#"+c1h.map(function(v){return("0"+v.toString(16)).slice(-2)}).join(""),
        color2:"#"+c2h.map(function(v){return("0"+v.toString(16)).slice(-2)}).join("") };
    } else if (fill && fill.c && fill.c.k) {
      var ck = fill.c.k;
      var hex = "#" + [ck[0],ck[1],ck[2]].map(function(v){return("0"+Math.round(v*255).toString(16)).slice(-2);}).join("");
      newLy.fill = { type:"solid", color:hex, color2:"#0d0d1a" };
    }
    if (stk) {
      var sc2 = stk.c && stk.c.k;
      newLy.stroke = { color: sc2 ? "#"+[sc2[0],sc2[1],sc2[2]].map(function(v){return("0"+Math.round(v*255).toString(16)).slice(-2);}).join("") : "#ffffff",
        width: stk.w && stk.w.k !== undefined ? stk.w.k : 0, trim:{start:0,end:100} };
    }
    s.layers.push(newLy);
  });

  s.selectedLayer = s.layers.length ? s.layers[0].id : null;
  s.time = 0;
  FB.motion._renderUI();
  FB.motion._bindCanvas();
  FB.motion._renderLayers();
  FB.motion._renderTimeline();
  FB.motion._renderProps();
  FB.motion._drawStage();
  if (typeof FB.util !== "undefined") FB.util.showToast("Imported " + s.layers.length + " layer(s)");
};

// ── Insert into page ──────────────────────────────────────────
FB.motion._insertBlock = function () {
  var s = FB.motion._state;
  if (!s.layers.length) return;
  var data = { duration:s.duration, fps:s.fps, canvasW:s.canvasW, canvasH:s.canvasH, bgColor:s.bgColor, layers:JSON.parse(JSON.stringify(s.layers)) };
  if (typeof FB.state !== "undefined") {
    FB.state.saveHistory();
    FB.state.blocks.push({ id:FB.state.genId(), type:"motionBlock", props:{ animData:JSON.stringify(data), height:s.canvasH, bg:s.bgColor } });
    FB.canvas.render();
    FB.util.showToast("Motion animation added to page");
  }
  FB.motion.close();
};

// ── Preset animations ─────────────────────────────────────────
FB.motion._togglePresets = function () {
  var m = document.getElementById("mc-presets-menu");
  if (m) m.style.display = m.style.display === "none" ? "block" : "none";
};
FB.motion._closePresets = function () {
  var m = document.getElementById("mc-presets-menu");
  if (m) m.style.display = "none";
};
FB.motion._loadPreset = function (name) {
  var s = FB.motion._state;
  s.layers = []; s.nextId = 1; s.time = 0;

  if (name === "Spinner") {
    s.duration = 3000; s.bgColor = "#0d0d1a"; s.canvasW = 400; s.canvasH = 400;
    var outer = FB.motion._makeLayer("ellipse","Outer Arc",50,50,300,300,"none");
    outer.fill = {type:"none",color:"#cdfe00",color2:"#cdfe00"};
    outer.stroke = {color:"#cdfe00",width:16,trim:{start:0,end:100}};
    outer.keyframes.rotation  = [{t:0,v:0},{t:3000,v:720}];
    outer.keyframes.trimStart = [{t:0,v:0},{t:1500,v:55},{t:3000,v:0}];
    outer.keyframes.trimEnd   = [{t:0,v:8},{t:1500,v:92},{t:3000,v:8}];
    var inner = FB.motion._makeLayer("ellipse","Inner Arc",90,90,220,220,"none");
    inner.fill = {type:"none",color:"#7c3aed",color2:"#7c3aed"};
    inner.stroke = {color:"#7c3aed",width:12,trim:{start:0,end:100}};
    inner.keyframes.rotation  = [{t:0,v:0},{t:3000,v:-1080}];
    inner.keyframes.trimStart = [{t:0,v:55},{t:1500,v:0},{t:3000,v:55}];
    inner.keyframes.trimEnd   = [{t:0,v:92},{t:1500,v:8},{t:3000,v:92}];
    s.layers = [outer, inner];

  } else if (name === "Pulse") {
    s.duration = 2000; s.bgColor = "#0d0d1a"; s.canvasW = 400; s.canvasH = 400;
    [[0,"#cdfe00"],[600,"#7c3aed"],[1200,"#38bdf8"]].forEach(function(cfg,i){
      var delay = cfg[0], color = cfg[1];
      var ring = FB.motion._makeLayer("ellipse","Ring "+(i+1),130,130,140,140,"none");
      ring.fill = {type:"none",color:color,color2:color};
      ring.stroke = {color:color,width:4,trim:{start:0,end:100}};
      ring.keyframes.scale   = [{t:delay,v:[0.1,0.1]},{t:delay+s.duration*0.9,v:[2.8,2.8]}];
      ring.keyframes.opacity = [{t:delay,v:1},{t:delay+s.duration*0.8,v:0},{t:delay+s.duration,v:0}];
      s.layers.push(ring);
    });

  } else if (name === "Draw On") {
    s.duration = 2500; s.bgColor = "#0d0d1a"; s.canvasW = 400; s.canvasH = 400;
    // Circle that draws itself
    var circle = FB.motion._makeLayer("ellipse","Circle",70,70,260,260,"none");
    circle.fill = {type:"none",color:"#cdfe00",color2:"#cdfe00"};
    circle.stroke = {color:"#cdfe00",width:8,trim:{start:0,end:100}};
    circle.keyframes.trimStart = [{t:0,v:0},{t:2000,v:0},{t:2500,v:0}];
    circle.keyframes.trimEnd   = [{t:0,v:0},{t:2000,v:100},{t:2500,v:100}];
    circle.keyframes.rotation  = [{t:0,v:-90},{t:2500,v:-90}];
    // Dot that moves along the circle
    var dot = FB.motion._makeLayer("ellipse","Dot",187,70,26,26,"#cdfe00");
    dot.fill = {type:"solid",color:"#cdfe00",color2:"#cdfe00"};
    dot.stroke = {color:"#cdfe00",width:0,trim:{start:0,end:100}};
    // Dot traces the circle: center (200,200), r=130. At angle θ: x=200+130cosθ, y=200+130sinθ
    // Start at top (θ=-90°) and animate around
    function circlePos(deg){ var r=130,cx=200,cy=200,a=deg*Math.PI/180; return [cx+Math.cos(a)*r-13, cy+Math.sin(a)*r-13]; }
    dot.keyframes.position = [{t:0,v:circlePos(-90)},{t:2000,v:circlePos(270)}];
    s.layers = [circle, dot];

  } else if (name === "Star Burst") {
    s.duration = 2000; s.bgColor = "#0d0d1a"; s.canvasW = 400; s.canvasH = 400;
    var star = FB.motion._makeLayer("star","Star",100,100,200,200,"#cdfe00");
    star.fill = {type:"gradient",color:"#cdfe00",color2:"#f97316"};
    star.stroke = {color:"#ffffff",width:0,trim:{start:0,end:100}};
    star.points = 6; star.innerRatio = 0.48;
    star.keyframes.scale    = [{t:0,v:[0.01,0.01]},{t:400,v:[1.2,1.2]},{t:600,v:[1,1]},{t:2000,v:[1,1]}];
    star.keyframes.rotation = [{t:0,v:0},{t:2000,v:180}];
    star.keyframes.opacity  = [{t:0,v:0},{t:200,v:1},{t:2000,v:1}];
    // Orbiting dot
    var orb = FB.motion._makeLayer("ellipse","Orbit",185,52,30,30,"#ffffff");
    orb.keyframes.rotation = [{t:0,v:0},{t:2000,v:360}];
    orb.keyframes.scale    = [{t:0,v:[0,0]},{t:600,v:[1,1]},{t:2000,v:[1,1]}];
    s.layers = [star, orb];

  } else if (name === "Neon Scan") {
    s.duration = 2000; s.bgColor = "#0d0d1a"; s.canvasW = 400; s.canvasH = 400;
    // Background rect (subtle)
    var bg = FB.motion._makeLayer("rect","Frame",20,20,360,360,"none");
    bg.fill = {type:"none",color:"#cdfe00",color2:"#cdfe00"};
    bg.stroke = {color:"rgba(205,254,0,0.2)",width:1,trim:{start:0,end:100}};
    // Scan line
    var line = FB.motion._makeLayer("line","Scan Line",20,20,360,0,"none");
    line.fill = {type:"none",color:"#cdfe00",color2:"#cdfe00"};
    line.stroke = {color:"#cdfe00",width:3,trim:{start:0,end:100}};
    line.keyframes.position = [{t:0,v:[20,20]},{t:2000,v:[20,380]}];
    line.keyframes.opacity  = [{t:0,v:0.3},{t:500,v:1},{t:1500,v:1},{t:2000,v:0.3}];
    // Highlight glow rect that follows the scan
    var glow = FB.motion._makeLayer("rect","Glow",20,10,360,20,"none");
    glow.fill = {type:"gradient",color:"rgba(205,254,0,0.0)",color2:"rgba(205,254,0,0.15)"};
    glow.stroke = {color:"#cdfe00",width:0,trim:{start:0,end:100}};
    glow.keyframes.position = [{t:0,v:[20,10]},{t:2000,v:[20,370]}];
    s.layers = [bg, glow, line];
  }

  // ── NEW PRESETS ────────────────────────────────────────────

  else if (name === "Wave Dots") {
    s.duration = 1200; s.bgColor = "#0d0d1a"; s.canvasW = 400; s.canvasH = 220;
    var dotColors = ["#cdfe00","#7c3aed","#38bdf8"];
    var dotX = [90, 200, 310];
    dotColors.forEach(function(color, i) {
      var d = i * 220; // stagger ms
      var dot = FB.motion._makeLayer("ellipse","Dot "+(i+1), dotX[i]-18, 110-18, 36, 36, color);
      dot.fill = {type:"solid",color:color,color2:color};
      dot.stroke = {color:color,width:0,trim:{start:0,end:100}};
      dot.keyframes.position = [
        {t:0,v:[dotX[i]-18,92]},{t:d,v:[dotX[i]-18,92]},
        {t:d+220,v:[dotX[i]-18,58]},{t:d+440,v:[dotX[i]-18,92]},{t:1200,v:[dotX[i]-18,92]}
      ];
      dot.keyframes.scale = [
        {t:0,v:[1,1]},{t:d,v:[1,1]},{t:d+220,v:[1.25,1.25]},{t:d+440,v:[1,1]},{t:1200,v:[1,1]}
      ];
      s.layers.push(dot);
    });

  } else if (name === "Fireworks") {
    s.duration = 2000; s.bgColor = "#0a0a14"; s.canvasW = 400; s.canvasH = 400;
    var fwColors = ["#cdfe00","#f97316","#38bdf8","#a78bfa","#f43f5e","#10b981","#fff","#fb923c"];
    for (var fi = 0; fi < 8; fi++) {
      var fw = 140, frot = fi * 45;
      var spark = FB.motion._makeLayer("line","Spark "+(fi+1), 200-fw/2, 200, fw, 0, "none");
      spark.fill = {type:"none",color:fwColors[fi],color2:fwColors[fi]};
      spark.stroke = {color:fwColors[fi],width:5,trim:{start:0,end:100}};
      spark.keyframes.rotation = [{t:0,v:frot},{t:2000,v:frot}];
      spark.keyframes.scale    = [{t:0,v:[0.05,1]},{t:600,v:[1,1]},{t:2000,v:[1,1]}];
      spark.keyframes.trimStart = [{t:0,v:0},{t:1000,v:0},{t:2000,v:92}];
      spark.keyframes.trimEnd   = [{t:0,v:0},{t:800,v:100},{t:2000,v:100}];
      spark.keyframes.opacity   = [{t:0,v:0},{t:100,v:1},{t:1600,v:1},{t:2000,v:0}];
      s.layers.push(spark);
    }

  } else if (name === "Portal") {
    s.duration = 4000; s.bgColor = "#0a0a14"; s.canvasW = 400; s.canvasH = 400;
    [{size:340,color:"#cdfe00",w:2,spd:360,d:1,ts:5,te:88},
     {size:280,color:"#7c3aed",w:2,spd:480,d:-1,ts:12,te:78},
     {size:220,color:"#38bdf8",w:3,spd:600,d:1,ts:8,te:68},
     {size:160,color:"#f97316",w:2,spd:720,d:-1,ts:15,te:72},
     {size:100,color:"#f43f5e",w:3,spd:300,d:1,ts:0,te:55},
    ].forEach(function(cfg,i){
      var ring = FB.motion._makeLayer("ellipse","Ring "+(i+1), 200-cfg.size/2, 200-cfg.size/2, cfg.size, cfg.size, "none");
      ring.fill = {type:"none",color:cfg.color,color2:cfg.color};
      ring.stroke = {color:cfg.color,width:cfg.w,trim:{start:0,end:100}};
      ring.keyframes.rotation  = [{t:0,v:0},{t:4000,v:cfg.spd*cfg.d}];
      ring.keyframes.trimStart = [{t:0,v:cfg.ts},{t:4000,v:cfg.ts}];
      ring.keyframes.trimEnd   = [{t:0,v:cfg.te},{t:4000,v:cfg.te}];
      s.layers.push(ring);
    });

  } else if (name === "Heartbeat") {
    s.duration = 2500; s.bgColor = "#0d0d1a"; s.canvasW = 400; s.canvasH = 220;
    var flat = FB.motion._makeLayer("line","Flat", 20, 110, 360, 0, "none");
    flat.fill = {type:"none",color:"rgba(205,254,0,0.15)",color2:"rgba(205,254,0,0.15)"};
    flat.stroke = {color:"rgba(205,254,0,0.18)",width:2,trim:{start:0,end:100}};
    var pulse = FB.motion._makeLayer("line","Pulse", 20, 110, 360, 0, "none");
    pulse.fill = {type:"none",color:"#cdfe00",color2:"#cdfe00"};
    pulse.stroke = {color:"#cdfe00",width:3,trim:{start:0,end:100}};
    pulse.keyframes.trimStart = [{t:0,v:0},{t:700,v:0},{t:2500,v:88}];
    pulse.keyframes.trimEnd   = [{t:0,v:0},{t:200,v:12},{t:1200,v:100},{t:2500,v:100}];
    pulse.keyframes.opacity   = [{t:0,v:0},{t:100,v:1},{t:1800,v:1},{t:2500,v:0}];
    s.layers = [flat, pulse];

  } else if (name === "Loading Bar") {
    s.duration = 2500; s.bgColor = "#0d0d1a"; s.canvasW = 400; s.canvasH = 180;
    var bgBar = FB.motion._makeLayer("rect","Track", 40, 78, 320, 24, "#111");
    bgBar.fill = {type:"solid",color:"#1a1a2a",color2:"#1a1a2a"};
    bgBar.stroke = {color:"#2a2a3a",width:1,trim:{start:0,end:100}};
    var fill = FB.motion._makeLayer("line","Fill", 40, 90, 320, 0, "none");
    fill.fill = {type:"none",color:"#cdfe00",color2:"#cdfe00"};
    fill.stroke = {color:"#cdfe00",width:24,trim:{start:0,end:100}};
    fill.keyframes.trimEnd = [{t:0,v:0},{t:2500,v:100}];
    var lbl = FB.motion._makeLayer("text","Label", 160, 30, 80, 26, "#cdfe00");
    lbl.text = "Loading"; lbl.fontSize = 16;
    lbl.fill = {type:"solid",color:"rgba(205,254,0,0.5)",color2:"rgba(205,254,0,0.5)"};
    lbl.stroke = {color:"#cdfe00",width:0,trim:{start:0,end:100}};
    s.layers = [bgBar, fill, lbl];

  } else if (name === "Data Dots") {
    s.duration = 2500; s.bgColor = "#0d0d1a"; s.canvasW = 400; s.canvasH = 280;
    var axisH = FB.motion._makeLayer("line","X Axis", 30, 230, 340, 0, "none");
    axisH.fill = {type:"none",color:"rgba(255,255,255,0.2)",color2:"rgba(255,255,255,0.2)"};
    axisH.stroke = {color:"rgba(255,255,255,0.18)",width:1,trim:{start:0,end:100}};
    axisH.keyframes.trimEnd = [{t:0,v:0},{t:500,v:100},{t:2500,v:100}];
    s.layers = [axisH];
    [{x:65,y:185,c:"#cdfe00",d:400},{x:110,y:140,c:"#f97316",d:600},
     {x:155,y:210,c:"#38bdf8",d:800},{x:200,y:105,c:"#a78bfa",d:1000},
     {x:245,y:170,c:"#f43f5e",d:1200},{x:290,y:128,c:"#10b981",d:1400},
     {x:335,y:160,c:"#cdfe00",d:1600}].forEach(function(p){
      var bar = FB.motion._makeLayer("line","Bar", p.x, 230, 0, 0, "none");
      bar.fill = {type:"none",color:p.c,color2:p.c};
      bar.stroke = {color:p.c,width:18,trim:{start:0,end:100}};
      bar.keyframes.position = [{t:p.d,v:[p.x,230]},{t:p.d+400,v:[p.x,p.y]},{t:2500,v:[p.x,p.y]}];
      if (p.d > 0) bar.keyframes.position.unshift({t:0,v:[p.x,230]});
      bar.keyframes.opacity = [{t:0,v:0},{t:p.d,v:0},{t:p.d+100,v:1},{t:2500,v:1}];
      var dot = FB.motion._makeLayer("ellipse","Dot", p.x-9, p.y-9, 18, 18, p.c);
      dot.fill = {type:"solid",color:p.c,color2:p.c};
      dot.stroke = {color:p.c,width:0,trim:{start:0,end:100}};
      dot.keyframes.scale   = [{t:0,v:[0,0]},{t:p.d+300,v:[0,0]},{t:p.d+550,v:[1.3,1.3]},{t:p.d+700,v:[1,1]},{t:2500,v:[1,1]}];
      dot.keyframes.opacity = [{t:0,v:0},{t:p.d+300,v:0},{t:p.d+350,v:1},{t:2500,v:1}];
      s.layers.push(bar, dot);
    });

  } else if (name === "Orbit") {
    s.duration = 3000; s.bgColor = "#0a0a14"; s.canvasW = 400; s.canvasH = 400;
    var orbitR = 140, cxO = 200, cyO = 200;
    var path = FB.motion._makeLayer("ellipse","Path", cxO-orbitR, cyO-orbitR, orbitR*2, orbitR*2, "none");
    path.fill = {type:"none",color:"rgba(255,255,255,0.07)",color2:"rgba(255,255,255,0.07)"};
    path.stroke = {color:"rgba(255,255,255,0.08)",width:1,trim:{start:0,end:100}};
    var sun = FB.motion._makeLayer("ellipse","Sun", cxO-22, cyO-22, 44, 44, "#fbbf24");
    sun.fill = {type:"gradient",color:"#fef08a",color2:"#f97316"};
    sun.keyframes.scale = [{t:0,v:[1,1]},{t:1500,v:[1.1,1.1]},{t:3000,v:[1,1]}];
    var pR = 13;
    var planetKfs = [];
    for (var pk = 0; pk <= 8; pk++) {
      var pa = (pk/8) * Math.PI * 2 - Math.PI/2;
      planetKfs.push({t:Math.round((pk/8)*3000), v:[cxO+Math.cos(pa)*orbitR-pR, cyO+Math.sin(pa)*orbitR-pR]});
    }
    var planet = FB.motion._makeLayer("ellipse","Planet", planetKfs[0].v[0], planetKfs[0].v[1], pR*2, pR*2, "#38bdf8");
    planet.fill = {type:"solid",color:"#38bdf8",color2:"#38bdf8"};
    planet.keyframes.position = planetKfs;
    var mR = 6, mOrbitR = 28;
    var moonKfs = [];
    for (var mk = 0; mk <= 8; mk++) {
      var ma = (mk/8)*Math.PI*2 - Math.PI/2;
      var pa2 = (mk/8)*Math.PI*2 - Math.PI/2;
      var ma2 = (mk/8)*Math.PI*10 - Math.PI/2; // moon orbits faster
      moonKfs.push({t:Math.round((mk/8)*3000), v:[
        cxO+Math.cos(pa2)*orbitR+Math.cos(ma2)*mOrbitR-mR,
        cyO+Math.sin(pa2)*orbitR+Math.sin(ma2)*mOrbitR-mR
      ]});
    }
    var moon = FB.motion._makeLayer("ellipse","Moon", moonKfs[0].v[0], moonKfs[0].v[1], mR*2, mR*2, "#d0d0d0");
    moon.fill = {type:"solid",color:"#c0c0c0",color2:"#c0c0c0"};
    moon.keyframes.position = moonKfs;
    s.layers = [path, sun, planet, moon];

  } else if (name === "Ripple") {
    s.duration = 2400; s.bgColor = "#0d0d1a"; s.canvasW = 400; s.canvasH = 400;
    [{delay:0,c:"#cdfe00"},{delay:400,c:"#7c3aed"},{delay:800,c:"#38bdf8"},{delay:1200,c:"#f97316"}].forEach(function(cfg,i){
      var sq = FB.motion._makeLayer("rect","Wave "+(i+1), 170, 170, 60, 60, "none");
      sq.fill = {type:"none",color:cfg.c,color2:cfg.c};
      sq.stroke = {color:cfg.c,width:3,trim:{start:0,end:100}};
      sq.keyframes.scale   = [{t:0,v:[0.1,0.1]},{t:cfg.delay,v:[0.1,0.1]},{t:cfg.delay+1400,v:[5,5]}];
      sq.keyframes.opacity = [{t:0,v:0},{t:cfg.delay,v:0.9},{t:cfg.delay+700,v:0.4},{t:cfg.delay+1400,v:0}];
      s.layers.push(sq);
    });

  } else if (name === "Kaleidoscope") {
    s.duration = 4000; s.bgColor = "#060612"; s.canvasW = 400; s.canvasH = 400;
    [{pts:6,sz:210,c:"#cdfe00",c2:"#f97316",rot:360, ir:0.45,op:1},
     {pts:4,sz:170,c:"#7c3aed",c2:"#38bdf8",rot:-280,ir:0.3, op:0.6},
     {pts:8,sz:230,c:"#f43f5e",c2:"#fb923c",rot:200, ir:0.52,op:0.45},
     {pts:3,sz:150,c:"#10b981",c2:"#06b6d4",rot:-360,ir:0.38,op:0.55},
     {pts:12,sz:190,c:"#fff",  c2:"#a78bfa",rot:120, ir:0.48,op:0.25},
    ].forEach(function(cfg,i){
      var star = FB.motion._makeLayer("star","Star "+(i+1), 200-cfg.sz/2, 200-cfg.sz/2, cfg.sz, cfg.sz, cfg.c);
      star.fill = {type:"gradient",color:cfg.c,color2:cfg.c2};
      star.points = cfg.pts; star.innerRatio = cfg.ir;
      star.keyframes.rotation = [{t:0,v:0},{t:4000,v:cfg.rot}];
      star.keyframes.scale    = [{t:0,v:[1,1]},{t:2000,v:[0.88,0.88]},{t:4000,v:[1,1]}];
      star.keyframes.opacity  = [{t:0,v:cfg.op},{t:4000,v:cfg.op}];
      s.layers.push(star);
    });

  } else if (name === "Comet") {
    s.duration = 2000; s.bgColor = "#060612"; s.canvasW = 400; s.canvasH = 400;
    [{c:"#cdfe00",w:5,ts:62,rot:1  },
     {c:"#38bdf8",w:3,ts:68,rot:-1.4},
     {c:"#a78bfa",w:2,ts:72,rot:2  },
     {c:"#f97316",w:2,ts:75,rot:-0.7},
    ].forEach(function(cfg,i){
      var arc = FB.motion._makeLayer("ellipse","Arc "+(i+1), 40, 40, 320, 320, "none");
      arc.fill = {type:"none",color:cfg.c,color2:cfg.c};
      arc.stroke = {color:cfg.c,width:cfg.w,trim:{start:0,end:100}};
      arc.keyframes.rotation  = [{t:0,v:0},{t:2000,v:360*cfg.rot}];
      arc.keyframes.trimStart = [{t:0,v:cfg.ts},{t:2000,v:cfg.ts}];
      arc.keyframes.trimEnd   = [{t:0,v:100},{t:2000,v:100}];
      arc.keyframes.opacity   = [{t:0,v:i===0?1:0.5},{t:2000,v:i===0?1:0.5}];
      s.layers.push(arc);
    });

  } else if (name === "DNA") {
    s.duration = 2000; s.bgColor = "#0d0d1a"; s.canvasW = 400; s.canvasH = 400;
    var dnaN = 7;
    for (var di = 0; di < dnaN; di++) {
      var dY = 40 + di * 50;
      var phase = di / (dnaN - 1);
      var dColor = di % 2 === 0 ? "#cdfe00" : "#7c3aed";
      var bar = FB.motion._makeLayer("ellipse","Rung "+(di+1), 100, dY, 200, 28, dColor);
      bar.fill = {type:"solid",color:dColor,color2:dColor};
      bar.stroke = {color:dColor,width:0,trim:{start:0,end:100}};
      // Animate scaleX using cos to simulate 3D rotation
      var phi = phase * Math.PI * 2;
      bar.keyframes.scale = [
        {t:0,    v:[Math.cos(phi),        1]},
        {t:1000, v:[Math.cos(phi+Math.PI), 1]},
        {t:2000, v:[Math.cos(phi+Math.PI*2),1]},
      ];
      bar.keyframes.opacity = [{t:0,v:0.85},{t:2000,v:0.85}];
      s.layers.push(bar);
    }

  } else if (name === "Typewriter") {
    s.duration = 3600; s.bgColor = "#0d0d1a"; s.canvasW = 400; s.canvasH = 200;
    var words = ["Hello ","World","!"];
    var txt = FB.motion._makeLayer("text","Text", 50, 80, 300, 50, "#cdfe00");
    txt.text = "Hello World!"; txt.fontSize = 38;
    txt.fill = {type:"solid",color:"#cdfe00",color2:"#cdfe00"};
    txt.stroke = {color:"#cdfe00",width:0,trim:{start:0,end:100}};
    // Blink a cursor beside the text
    var cursor = FB.motion._makeLayer("rect","Cursor", 282, 78, 4, 44, "#cdfe00");
    cursor.fill = {type:"solid",color:"#cdfe00",color2:"#cdfe00"};
    cursor.stroke = {color:"#cdfe00",width:0,trim:{start:0,end:100}};
    // Cursor blinks
    var blinkKfs = [{t:0,v:1}];
    for (var bi = 0; bi < 6; bi++) {
      blinkKfs.push({t:200+bi*600,v:1},{t:500+bi*600,v:0});
    }
    blinkKfs.push({t:3600,v:1});
    cursor.keyframes.opacity = blinkKfs;
    // Text fades in from opacity 0
    txt.keyframes.opacity = [{t:0,v:0},{t:300,v:1},{t:3600,v:1}];
    s.layers = [txt, cursor];

  } else if (name === "Confetti") {
    s.duration = 3000; s.bgColor = "#0a0a14"; s.canvasW = 400; s.canvasH = 400;
    var confCols = ["#cdfe00","#f97316","#38bdf8","#a78bfa","#f43f5e","#10b981","#fbbf24","#fff"];
    for (var ci = 0; ci < 16; ci++) {
      var cx2 = 40 + (ci % 8) * 46;
      var cDelay = Math.floor(ci/8) * 200 + (ci % 8) * 80;
      var cType = ci % 3 === 0 ? "rect" : (ci % 3 === 1 ? "ellipse" : "star");
      var piece = FB.motion._makeLayer(cType,"Piece "+(ci+1), cx2-8, -20, 16, 16, confCols[ci%8]);
      piece.fill = {type:"solid",color:confCols[ci%8],color2:confCols[ci%8]};
      piece.stroke = {color:confCols[ci%8],width:0,trim:{start:0,end:100}};
      piece.points = 4; piece.innerRatio = 0.5;
      piece.keyframes.position = [
        {t:0,       v:[cx2-8,-20]},
        {t:cDelay,  v:[cx2-8,-20]},
        {t:cDelay+2000, v:[cx2+(ci%2?40:-40)-8, 430]},
      ];
      piece.keyframes.rotation = [
        {t:0,v:0},{t:cDelay,v:0},{t:cDelay+2000,v:(ci%2?1:-1)*720}
      ];
      piece.keyframes.opacity = [
        {t:0,v:0},{t:cDelay,v:1},{t:cDelay+1500,v:1},{t:cDelay+2000,v:0}
      ];
      s.layers.push(piece);
    }

  } else if (name === "Morphing Rings") {
    s.duration = 3000; s.bgColor = "#0a0a14"; s.canvasW = 400; s.canvasH = 400;
    [{sz:300,c:"#cdfe00",w:2,ts:0, te:100,rot:180},
     {sz:260,c:"#7c3aed",w:3,ts:10,te:80, rot:-240},
     {sz:220,c:"#38bdf8",w:2,ts:20,te:70, rot:300},
     {sz:180,c:"#f97316",w:3,ts:15,te:60, rot:-180},
    ].forEach(function(cfg,i){
      var ring = FB.motion._makeLayer("ellipse","Ring "+(i+1), 200-cfg.sz/2, 200-cfg.sz/2, cfg.sz, cfg.sz, "none");
      ring.fill = {type:"none",color:cfg.c,color2:cfg.c};
      ring.stroke = {color:cfg.c,width:cfg.w,trim:{start:0,end:100}};
      ring.keyframes.rotation  = [{t:0,v:0},{t:3000,v:cfg.rot}];
      ring.keyframes.scale     = [{t:0,v:[1,1]},{t:1500,v:[0.7,0.7]},{t:3000,v:[1,1]}];
      ring.keyframes.trimStart = [{t:0,v:cfg.ts},{t:1500,v:cfg.ts+20},{t:3000,v:cfg.ts}];
      ring.keyframes.trimEnd   = [{t:0,v:cfg.te},{t:1500,v:cfg.te-20},{t:3000,v:cfg.te}];
      s.layers.push(ring);
    });

  } else if (name === "Clock") {
    s.duration = 5000; s.bgColor = "#0d0d1a"; s.canvasW = 400; s.canvasH = 400;
    // Dial
    var dial = FB.motion._makeLayer("ellipse","Dial", 50, 50, 300, 300, "none");
    dial.fill = {type:"none",color:"#2a2a3a",color2:"#2a2a3a"};
    dial.stroke = {color:"#2a2a3a",width:3,trim:{start:0,end:100}};
    // Progress arc (fills as time passes)
    var prog = FB.motion._makeLayer("ellipse","Progress", 55, 55, 290, 290, "none");
    prog.fill = {type:"none",color:"#cdfe00",color2:"#cdfe00"};
    prog.stroke = {color:"#cdfe00",width:4,trim:{start:0,end:100}};
    prog.keyframes.rotation  = [{t:0,v:-90},{t:5000,v:-90}];
    prog.keyframes.trimStart = [{t:0,v:0},{t:5000,v:0}];
    prog.keyframes.trimEnd   = [{t:0,v:0},{t:5000,v:100}];
    // Second hand (line from center)
    var hand = FB.motion._makeLayer("line","Hand", 200, 200, 110, 0, "none");
    hand.fill = {type:"none",color:"#cdfe00",color2:"#cdfe00"};
    hand.stroke = {color:"#cdfe00",width:3,trim:{start:0,end:100}};
    hand.keyframes.rotation = [{t:0,v:-90},{t:5000,v:270}]; // -90 → 270 = full circle starting at top
    // Center dot
    var center = FB.motion._makeLayer("ellipse","Center", 190, 190, 20, 20, "#cdfe00");
    center.fill = {type:"solid",color:"#cdfe00",color2:"#cdfe00"};
    s.layers = [dial, prog, hand, center];
  }

  s.selectedLayer = s.layers.length ? s.layers[0].id : null;
  FB.motion._renderUI();
  FB.motion._bindCanvas();
  FB.motion._renderLayers();
  FB.motion._renderTimeline();
  FB.motion._renderProps();
  FB.motion._drawStage();
};

// ── Page motion-block player ──────────────────────────────────
FB.panels.initMotionBlock = function () {
  document.querySelectorAll(".fw-motion-wrap:not([data-motion-init])").forEach(function (wrap) {
    wrap.dataset.motionInit = "1";
    var canvas = wrap.querySelector(".fw-motion-canvas");
    if (!canvas) return;
    var animStr = wrap.dataset.anim;
    if (!animStr || animStr === "{}") return;
    var data; try { data = JSON.parse(animStr); } catch(e){ return; }
    if (!data.layers || !data.layers.length) return;

    var loop = wrap.dataset.loop !== "0";
    canvas.width  = wrap.offsetWidth;
    canvas.height = wrap.offsetHeight;
    var ctx = canvas.getContext("2d");
    var t = 0, playing = true, lastT = performance.now();
    var cw = data.canvasW || 400, ch = data.canvasH || 300;

    function getVal(ly, prop, t) {
      var kfs = ly.keyframes[prop];
      if (!kfs || !kfs.length) { return prop==="opacity"?1:prop==="rotation"?0:prop==="scale"?[1,1]:[0,0]; }
      if (kfs.length===1) return JSON.parse(JSON.stringify(kfs[0].v));
      if (t<=kfs[0].t) return JSON.parse(JSON.stringify(kfs[0].v));
      if (t>=kfs[kfs.length-1].t) return JSON.parse(JSON.stringify(kfs[kfs.length-1].v));
      for (var i=0; i<kfs.length-1; i++) {
        if (t>=kfs[i].t && t<=kfs[i+1].t) {
          var r=(t-kfs[i].t)/(kfs[i+1].t-kfs[i].t); r=r*r*(3-2*r);
          var a=kfs[i].v, b=kfs[i+1].v;
          if (typeof a==="number") return a+(b-a)*r;
          return [a[0]+(b[0]-a[0])*r, a[1]+(b[1]-a[1])*r];
        }
      }
      return JSON.parse(JSON.stringify(kfs[kfs.length-1].v));
    }

    function draw() {
      if (!canvas.isConnected) return;
      canvas.width  = wrap.offsetWidth;
      canvas.height = wrap.offsetHeight;
      var now = performance.now(), dt = now - lastT; lastT = now;
      if (playing) t += dt;
      if (t > data.duration) { if (loop) t=0; else { t=data.duration; playing=false; } }

      var sx = canvas.width/cw, sy = canvas.height/ch;
      ctx.fillStyle = data.bgColor || "#0d0d1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      data.layers.forEach(function (ly) {
        var pos = getVal(ly,"position",t), sc=getVal(ly,"scale",t), rot=getVal(ly,"rotation",t), op=getVal(ly,"opacity",t);
        var hw=ly.w/2, hh=ly.h/2;
        var cx=(pos[0]+hw*sc[0])*sx, cy=(pos[1]+hh*sc[1])*sy;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot*Math.PI/180);
        ctx.scale(sc[0]*sx, sc[1]*sy);
        ctx.globalAlpha = Math.max(0,Math.min(1,op));

        var fill = ly.fill || { type:"solid", color:ly.color||"#cdfe00" };
        if (fill.type==="gradient") {
          var g=ctx.createLinearGradient(-hw,-hh,hw,hh); g.addColorStop(0,fill.color); g.addColorStop(1,fill.color2||"#0d0d1a"); ctx.fillStyle=g;
        } else { ctx.fillStyle = fill.type==="none" ? "transparent" : (fill.color||ly.color||"#cdfe00"); }

        var doFill = fill.type!=="none";
        var stk = ly.stroke || {}; var doStroke = stk.width>0;

        ctx.beginPath();
        if (ly.type==="rect") { ctx.rect(-hw,-hh,ly.w,ly.h); }
        else if (ly.type==="ellipse"||ly.type==="circle") { ctx.ellipse(0,0,hw,hh,0,0,Math.PI*2); }
        else if (ly.type==="text") { ctx.font="bold "+(ly.fontSize||36)+"px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle"; }
        else if (ly.type==="line") { ctx.moveTo(-hw,0); ctx.lineTo(hw,0); }
        else { ctx.rect(-hw,-hh,ly.w,ly.h); }

        if (ly.type==="text") {
          if (doFill) ctx.fillText(ly.text||"Text",0,0);
          if (doStroke) { ctx.strokeStyle=stk.color; ctx.lineWidth=stk.width; ctx.strokeText(ly.text||"Text",0,0); }
        } else {
          if (doFill) ctx.fill();
          if (doStroke) { ctx.strokeStyle=stk.color||"#fff"; ctx.lineWidth=stk.width; ctx.lineJoin="round"; ctx.lineCap="round"; ctx.stroke(); }
        }
        ctx.restore();
      });
      requestAnimationFrame(draw);
    }
    draw();
  });
};
