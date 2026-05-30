FB.motion = FB.motion || {};

FB.motion.open = function () {
  document.getElementById("ds-motion-overlay").style.display = "flex";
  FB.motion._init();
};

FB.motion.close = function () {
  document.getElementById("ds-motion-overlay").style.display = "none";
  FB.motion._stop();
};

FB.motion._state = {
  layers: [],
  duration: 2000,
  fps: 60,
  time: 0,
  playing: false,
  selectedLayer: null,
  dragLayer: null,
  dragOffX: 0,
  dragOffY: 0,
  nextId: 1,
};

FB.motion._init = function () {
  if (FB.motion._inited) return;
  FB.motion._inited = true;
  FB.motion._renderUI();
  FB.motion._bindCanvas();
  FB.motion._addDefaultLayers();
  FB.motion._renderTimeline();
  FB.motion._drawStage();
};

FB.motion._addDefaultLayers = function () {
  var s = FB.motion._state;
  if (s.layers.length) return;
  var cw = 400,
    ch = 300;
  s.layers.push({
    id: s.nextId++,
    type: "rect",
    name: "Box",
    color: "#cdfe00",
    w: 60,
    h: 60,
    keyframes: {
      position: [
        { t: 0, v: [cw / 2 - 30, ch / 2 - 30] },
        { t: s.duration, v: [cw - 90, ch - 90] },
      ],
      scale: [
        { t: 0, v: [1, 1] },
        { t: s.duration, v: [1.5, 1.5] },
      ],
      rotation: [
        { t: 0, v: 0 },
        { t: s.duration, v: 360 },
      ],
      opacity: [
        { t: 0, v: 1 },
        { t: s.duration, v: 0.5 },
      ],
    },
  });
  s.layers.push({
    id: s.nextId++,
    type: "circle",
    name: "Circle",
    color: "#3b82f6",
    w: 50,
    h: 50,
    keyframes: {
      position: [
        { t: 0, v: [cw - 80, ch / 2 - 25] },
        { t: s.duration, v: [30, ch / 2 - 25] },
      ],
      scale: [
        { t: 0, v: [1, 1] },
        { t: s.duration, v: [0.5, 0.5] },
      ],
      rotation: [
        { t: 0, v: 0 },
        { t: s.duration, v: -180 },
      ],
      opacity: [
        { t: 0, v: 1 },
        { t: s.duration, v: 1 },
      ],
    },
  });
  FB.motion._renderLayers();
  FB.motion._renderTimeline();
};

FB.motion._renderUI = function () {
  var main = document.getElementById("ds-motion-main");
  if (!main) return;
  var s = FB.motion._state;
  var h = "";
  // Toolbar
  h += '<div class="mc-toolbar">';
  h +=
    '<button class="mc-btn" onclick="FB.motion._addRect()" title="Add Rectangle">▬</button>';
  h +=
    '<button class="mc-btn" onclick="FB.motion._addCircle()" title="Add Circle">●</button>';
  h +=
    '<button class="mc-btn" onclick="FB.motion._deleteLayer()" title="Delete Selected">✕</button>';
  h += '<span style="flex:1"></span>';
  h +=
    '<span style="font-size:10px;color:#666" id="mc-time-display">0.0s / ' +
    (s.duration / 1000).toFixed(1) +
    "s</span>";
  h +=
    '<button class="mc-btn mc-btn-play" id="mc-play-btn" onclick="FB.motion._togglePlay()">▶</button>';
  h +=
    '<button class="mc-btn" onclick="FB.motion._export()" title="Export JSON">⬇</button>';
  h +=
    '<button class="mc-btn" onclick="FB.motion._exportLottie()" title="Export Lottie JSON">🎞</button>';
  h +=
    '<button class="mc-btn" onclick="FB.motion._importLottie()" title="Import Lottie JSON">📂</button>';
  h +=
    '<button class="mc-btn" onclick="FB.motion._insertBlock()" title="Insert into page">+</button>';
  h += "</div>";
  // Stage
  h +=
    '<div class="mc-stage-wrap"><canvas class="mc-stage" id="mc-stage" width="400" height="300"></canvas></div>';
  // Bottom: layers + timeline
  h += '<div class="mc-bottom">';
  h +=
    '<div class="mc-layers" id="mc-layers"><div class="mc-panel-label">Layers</div></div>';
  h +=
    '<div class="mc-timeline" id="mc-timeline"><div class="mc-panel-label">Timeline</div><div class="mc-timeline-body" id="mc-timeline-body"></div></div>';
  h += "</div>";
  main.innerHTML = h;
};

// ── Layers ──
FB.motion._renderLayers = function () {
  var el = document.getElementById("mc-layers");
  if (!el) return;
  var s = FB.motion._state;
  var h = '<div class="mc-panel-label">Layers</div>';
  s.layers.forEach(function (ly) {
    var sel = ly.id === s.selectedLayer ? " mc-layers-item-sel" : "";
    h +=
      '<div class="mc-layers-item' +
      sel +
      '" data-lid="' +
      ly.id +
      '" onclick="FB.motion._selectLayer(' +
      ly.id +
      ')">';
    h +=
      '<span class="mc-layers-icon">' +
      (ly.type === "rect" ? "▬" : "●") +
      "</span>";
    h += '<span class="mc-layers-name">' + ly.name + "</span>";
    h += "</div>";
  });
  el.innerHTML = h;
};

FB.motion._selectLayer = function (id) {
  FB.motion._state.selectedLayer = id;
  FB.motion._renderLayers();
  FB.motion._renderTimeline();
};

// ── Timeline ──
FB.motion._renderTimeline = function () {
  var el = document.getElementById("mc-timeline-body");
  if (!el) return;
  var s = FB.motion._state;
  var props = ["position", "scale", "rotation", "opacity"];
  var pLabels = {
    position: "Pos",
    scale: "Scl",
    rotation: "Rot",
    opacity: "Op",
  };
  var h = "";
  // Ruler
  h += '<div class="mc-ruler" id="mc-ruler">';
  var numTicks = Math.min(20, Math.floor(s.duration / 100));
  for (var i = 0; i <= numTicks; i++) {
    var t = (i / numTicks) * s.duration;
    h +=
      '<div class="mc-ruler-tick" style="left:' +
      (i / numTicks) * 100 +
      '%"><span>' +
      (t / 1000).toFixed(1) +
      "s</span></div>";
  }
  h += '<div class="mc-playhead" id="mc-playhead" style="left:0"></div>';
  h += "</div>";
  // Tracks
  s.layers.forEach(function (ly) {
    var sel = ly.id === s.selectedLayer ? " mc-track-sel" : "";
    var label = ly.name;
    props.forEach(function (prop) {
      var kfs = ly.keyframes[prop] || [];
      h +=
        '<div class="mc-track' +
        sel +
        '" data-layer="' +
        ly.id +
        '" data-prop="' +
        prop +
        '" onclick="FB.motion._selectLayer(' +
        ly.id +
        ')">';
      h +=
        '<div class="mc-track-label">' +
        label +
        " • " +
        pLabels[prop] +
        "</div>";
      h +=
        '<div class="mc-track-lane" data-layer="' +
        ly.id +
        '" data-prop="' +
        prop +
        '" onclick="FB.motion._trackClick(event)">';
      kfs.forEach(function (kf) {
        var pct = (kf.t / s.duration) * 100;
        h +=
          '<div class="mc-kf" style="left:' +
          pct +
          '%" data-layer="' +
          ly.id +
          '" data-prop="' +
          prop +
          '" data-t="' +
          kf.t +
          '"></div>';
      });
      h += "</div></div>";
    });
  });
  el.innerHTML = h;
};

FB.motion._trackClick = function (e) {
  var lane = e.currentTarget;
  var rect = lane.getBoundingClientRect();
  var pct = (e.clientX - rect.left) / rect.width;
  var t = Math.round(pct * FB.motion._state.duration);
  var lyId = +lane.dataset.layer;
  var prop = lane.dataset.prop;
  var ly = FB.motion._state.layers.find(function (l) {
    return l.id === lyId;
  });
  if (!ly) return;
  var kfs = ly.keyframes[prop];
  // Check if clicking near existing kf
  var near = null;
  kfs.forEach(function (kf) {
    if (Math.abs(kf.t - t) < 50) near = kf;
  });
  if (near) {
    // Remove keyframe (keep at least 2)
    if (kfs.length <= 2) return;
    ly.keyframes[prop] = kfs.filter(function (k) {
      return k !== near;
    });
  } else {
    // Interpolate value
    var v = FB.motion._getValue(ly, prop, t);
    kfs.push({ t: t, v: JSON.parse(JSON.stringify(v)) });
    kfs.sort(function (a, b) {
      return a.t - b.t;
    });
  }
  FB.motion._renderTimeline();
};

// ── Shape add ──
FB.motion._addRect = function () {
  var s = FB.motion._state;
  var id = s.nextId++;
  s.layers.push({
    id: id,
    type: "rect",
    name: "Box " + id,
    color: "#cdfe00",
    w: 60,
    h: 60,
    keyframes: {
      position: [
        { t: 0, v: [150, 100] },
        { t: s.duration, v: [200, 150] },
      ],
      scale: [
        { t: 0, v: [1, 1] },
        { t: s.duration, v: [1, 1] },
      ],
      rotation: [
        { t: 0, v: 0 },
        { t: s.duration, v: 0 },
      ],
      opacity: [
        { t: 0, v: 1 },
        { t: s.duration, v: 1 },
      ],
    },
  });
  s.selectedLayer = id;
  FB.motion._renderLayers();
  FB.motion._renderTimeline();
  FB.motion._drawStage();
};

FB.motion._addCircle = function () {
  var s = FB.motion._state;
  var id = s.nextId++;
  s.layers.push({
    id: id,
    type: "circle",
    name: "Circle " + id,
    color: "#3b82f6",
    w: 50,
    h: 50,
    keyframes: {
      position: [
        { t: 0, v: [100, 100] },
        { t: s.duration, v: [250, 100] },
      ],
      scale: [
        { t: 0, v: [1, 1] },
        { t: s.duration, v: [1, 1] },
      ],
      rotation: [
        { t: 0, v: 0 },
        { t: s.duration, v: 0 },
      ],
      opacity: [
        { t: 0, v: 1 },
        { t: s.duration, v: 1 },
      ],
    },
  });
  s.selectedLayer = id;
  FB.motion._renderLayers();
  FB.motion._renderTimeline();
  FB.motion._drawStage();
};

FB.motion._deleteLayer = function () {
  var s = FB.motion._state;
  if (!s.selectedLayer) return;
  s.layers = s.layers.filter(function (l) {
    return l.id !== s.selectedLayer;
  });
  s.selectedLayer = s.layers.length ? s.layers[0].id : null;
  FB.motion._renderLayers();
  FB.motion._renderTimeline();
  FB.motion._drawStage();
};

// ── Interpolation ──
FB.motion._getValue = function (ly, prop, t) {
  var kfs = ly.keyframes[prop];
  if (!kfs || !kfs.length)
    return prop === "rotation" || prop === "opacity" ? 1 : [0, 0];
  if (kfs.length === 1) return JSON.parse(JSON.stringify(kfs[0].v));
  if (t <= kfs[0].t) return JSON.parse(JSON.stringify(kfs[0].v));
  if (t >= kfs[kfs.length - 1].t)
    return JSON.parse(JSON.stringify(kfs[kfs.length - 1].v));
  for (var i = 0; i < kfs.length - 1; i++) {
    if (t >= kfs[i].t && t <= kfs[i + 1].t) {
      var r = (t - kfs[i].t) / (kfs[i + 1].t - kfs[i].t);
      var a = kfs[i].v,
        b = kfs[i + 1].v;
      if (typeof a === "number") return a + (b - a) * r;
      return [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r];
    }
  }
  return JSON.parse(JSON.stringify(kfs[kfs.length - 1].v));
};

// ── Stage drawing ──
FB.motion._drawStage = function () {
  var canvas = document.getElementById("mc-stage");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var s = FB.motion._state;
  var cw = canvas.width,
    ch = canvas.height;

  ctx.clearRect(0, 0, cw, ch);
  // Grid
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  for (var x = 0; x <= cw; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, ch);
    ctx.stroke();
  }
  for (var y = 0; y <= ch; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(cw, y);
    ctx.stroke();
  }

  var t = s.playing ? s.time : s.time;
  s.layers.forEach(function (ly) {
    var pos = FB.motion._getValue(ly, "position", t);
    var sc = FB.motion._getValue(ly, "scale", t);
    var rot = FB.motion._getValue(ly, "rotation", t);
    var op = FB.motion._getValue(ly, "opacity", t);
    var x = pos[0] + (ly.w * sc[0]) / 2;
    var y = pos[1] + (ly.h * sc[1]) / 2;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.scale(sc[0], sc[1]);
    ctx.globalAlpha = op;
    ctx.fillStyle = ly.color;
    if (ly.type === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(ly.w, ly.h) / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-ly.w / 2, -ly.h / 2, ly.w, ly.h);
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    // Selection outline
    if (ly.id === s.selectedLayer) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(sc[0], sc[1]);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      if (ly.type === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, Math.min(ly.w, ly.h) / 2 + 3, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.strokeRect(-ly.w / 2 - 3, -ly.h / 2 - 3, ly.w + 6, ly.h + 6);
      }
      ctx.setLineDash([]);
      ctx.restore();
    }
  });
};

// ── Playback ──
FB.motion._togglePlay = function () {
  var s = FB.motion._state;
  s.playing = !s.playing;
  var btn = document.getElementById("mc-play-btn");
  if (btn) btn.textContent = s.playing ? "⏸" : "▶";
  if (s.playing) {
    if (s.time >= s.duration) s.time = 0;
    FB.motion._loop();
  }
};

FB.motion._stop = function () {
  FB.motion._state.playing = false;
  var btn = document.getElementById("mc-play-btn");
  if (btn) btn.textContent = "▶";
};

FB.motion._loop = function () {
  if (!FB.motion._state.playing) return;
  var s = FB.motion._state;
  var dt = 16;
  s.time += dt;
  if (s.time > s.duration) {
    if (
      document.getElementById("mc-loop") &&
      document.getElementById("mc-loop").checked
    ) {
      s.time = 0;
    } else {
      s.time = s.duration;
      FB.motion._stop();
    }
  }
  var pct = (s.time / s.duration) * 100;
  var ph = document.getElementById("mc-playhead");
  if (ph) ph.style.left = pct + "%";
  var disp = document.getElementById("mc-time-display");
  if (disp)
    disp.textContent =
      (s.time / 1000).toFixed(1) +
      "s / " +
      (s.duration / 1000).toFixed(1) +
      "s";
  FB.motion._drawStage();
  requestAnimationFrame(FB.motion._loop);
};

// ── Canvas interaction ──
FB.motion._bindCanvas = function () {
  var canvas = document.getElementById("mc-stage");
  if (!canvas) return;
  var s = FB.motion._state;

  canvas.addEventListener("mousedown", function (e) {
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left,
      my = e.clientY - rect.top;
    // Check hit on layers (reverse order for z-index)
    for (var i = s.layers.length - 1; i >= 0; i--) {
      var ly = s.layers[i];
      var pos = FB.motion._getValue(ly, "position", s.time);
      var sc = FB.motion._getValue(ly, "scale", s.time);
      var hw = (ly.w * sc[0]) / 2,
        hh = (ly.h * sc[1]) / 2;
      if (
        mx >= pos[0] &&
        mx <= pos[0] + ly.w * sc[0] &&
        my >= pos[1] &&
        my <= pos[1] + ly.h * sc[1]
      ) {
        s.selectedLayer = ly.id;
        s.dragLayer = ly.id;
        s.dragOffX = mx - pos[0];
        s.dragOffY = my - pos[1];
        FB.motion._renderLayers();
        FB.motion._renderTimeline();
        FB.motion._drawStage();
        break;
      }
    }
  });

  canvas.addEventListener("mousemove", function (e) {
    if (!s.dragLayer) return;
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left,
      my = e.clientY - rect.top;
    var ly = s.layers.find(function (l) {
      return l.id === s.dragLayer;
    });
    if (!ly) return;
    var pos = FB.motion._getValue(ly, "position", s.time);
    var newX = Math.round(mx - s.dragOffX);
    var newY = Math.round(my - s.dragOffY);
    // Update or add keyframe at current time
    var kfs = ly.keyframes.position;
    var near = null;
    kfs.forEach(function (kf) {
      if (Math.abs(kf.t - s.time) < 50) near = kf;
    });
    if (near) {
      near.v = [newX, newY];
    } else {
      kfs.push({ t: s.time, v: [newX, newY] });
      kfs.sort(function (a, b) {
        return a.t - b.t;
      });
    }
    FB.motion._renderTimeline();
    FB.motion._drawStage();
  });

  canvas.addEventListener("mouseup", function () {
    s.dragLayer = null;
  });
  canvas.addEventListener("mouseleave", function () {
    s.dragLayer = null;
  });
};

// ── Export ──
FB.motion._export = function () {
  var s = FB.motion._state;
  var data = {
    duration: s.duration,
    fps: s.fps,
    layers: s.layers.map(function (ly) {
      return {
        type: ly.type,
        name: ly.name,
        color: ly.color,
        w: ly.w,
        h: ly.h,
        keyframes: {
          position: ly.keyframes.position.map(function (k) {
            return { t: k.t, v: k.v };
          }),
          scale: ly.keyframes.scale.map(function (k) {
            return { t: k.t, v: k.v };
          }),
          rotation: ly.keyframes.rotation.map(function (k) {
            return { t: k.t, v: k.v };
          }),
          opacity: ly.keyframes.opacity.map(function (k) {
            return { t: k.t, v: k.v };
          }),
        },
      };
    }),
  };
  var json = JSON.stringify(data, null, 2);
  var blob = new Blob([json], { type: "application/json" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "animation.json";
  a.click();
  URL.revokeObjectURL(url);
};

// ── Motion Block Player ──
FB.panels.initMotionBlock = function () {
  document
    .querySelectorAll(".fw-motion-wrap:not([data-motion-init])")
    .forEach(function (wrap) {
      wrap.dataset.motionInit = "1";
      var canvas = wrap.querySelector(".fw-motion-canvas");
      if (!canvas) return;
      var animStr = wrap.dataset.anim;
      if (!animStr || animStr === "{}") return;
      var data;
      try {
        data = JSON.parse(animStr);
      } catch (e) {
        return;
      }
      if (!data.layers || !data.layers.length) return;
      var loop = wrap.dataset.loop === "1";
      var ctx = canvas.getContext("2d");
      canvas.width = wrap.offsetWidth;
      canvas.height = wrap.offsetHeight;
      var t = 0,
        playing = true,
        lastT = performance.now();

      function getVal(layer, prop, t) {
        var kfs = layer.keyframes[prop];
        if (!kfs || !kfs.length)
          return prop === "rotation" || prop === "opacity" ? 1 : [0, 0];
        if (kfs.length === 1) return JSON.parse(JSON.stringify(kfs[0].v));
        if (t <= kfs[0].t) return JSON.parse(JSON.stringify(kfs[0].v));
        if (t >= kfs[kfs.length - 1].t)
          return JSON.parse(JSON.stringify(kfs[kfs.length - 1].v));
        for (var i = 0; i < kfs.length - 1; i++) {
          if (t >= kfs[i].t && t <= kfs[i + 1].t) {
            var r = (t - kfs[i].t) / (kfs[i + 1].t - kfs[i].t);
            var a = kfs[i].v,
              b = kfs[i + 1].v;
            if (typeof a === "number") return a + (b - a) * r;
            return [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r];
          }
        }
        return JSON.parse(JSON.stringify(kfs[kfs.length - 1].v));
      }

      function draw() {
        if (!canvas.isConnected) return;
        canvas.width = wrap.offsetWidth;
        canvas.height = wrap.offsetHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var now = performance.now();
        var dt = now - lastT;
        lastT = now;
        if (playing) t += dt;
        if (t > data.duration) {
          if (loop) t = 0;
          else {
            t = data.duration;
            playing = false;
          }
        }
        var sx = canvas.width / 400,
          sy = canvas.height / 300;
        data.layers.forEach(function (ly) {
          var pos = getVal(ly, "position", t);
          var sc = getVal(ly, "scale", t);
          var rot = getVal(ly, "rotation", t);
          var op = getVal(ly, "opacity", t);
          ctx.save();
          ctx.translate(
            (pos[0] + (ly.w * sc[0]) / 2) * sx,
            (pos[1] + (ly.h * sc[1]) / 2) * sy,
          );
          ctx.rotate((rot * Math.PI) / 180);
          ctx.scale(sc[0] * sx, sc[1] * sy);
          ctx.globalAlpha = op;
          ctx.fillStyle = ly.color;
          if (ly.type === "circle") {
            ctx.beginPath();
            ctx.arc(0, 0, Math.min(ly.w, ly.h) / 2, 0, 7);
            ctx.fill();
          } else {
            ctx.fillRect(-ly.w / 2, -ly.h / 2, ly.w, ly.h);
          }
          ctx.restore();
        });
        requestAnimationFrame(draw);
      }
      draw();
    });
};

// ── Lottie Export ──
FB.motion._hexToRgb = function (h) {
  h = h.replace("#", "");
  return {
    r: parseInt(h.substr(0, 2), 16),
    g: parseInt(h.substr(2, 2), 16),
    b: parseInt(h.substr(4, 2), 16),
  };
};

FB.motion._toLottieProp = function (ly, prop, dur, fps) {
  var kfs = ly.keyframes[prop];
  if (!kfs || kfs.length <= 1) {
    var v =
      kfs && kfs.length
        ? kfs[0].v
        : prop === "rotation" || prop === "opacity"
          ? 1
          : [0, 0];
    return { a: 0, k: prop === "scale" ? [v[0] * 100, v[1] * 100] : v };
  }
  var frameCount = Math.ceil((dur / 1000) * fps);
  var lkfs = kfs.map(function (kf, i) {
    var t = Math.round((kf.t / 1000) * fps);
    var v = kf.v;
    var lk = {
      t: t,
      s:
        prop === "scale"
          ? [v[0] * 100, v[1] * 100]
          : typeof v === "number"
            ? [v]
            : v,
    };
    if (i < kfs.length - 1) {
      var nv = kfs[i + 1].v;
      lk.e =
        prop === "scale"
          ? [nv[0] * 100, nv[1] * 100]
          : typeof nv === "number"
            ? [nv]
            : nv;
      lk.o = { x: [0, 0], y: [0, 0] };
      lk.i = { x: [1, 1], y: [1, 1] };
    }
    return lk;
  });
  return { a: 1, k: lkfs };
};

FB.motion._toLottieOpacity = function (ly, dur, fps) {
  var kfs = ly.keyframes.opacity;
  if (!kfs || kfs.length <= 1) {
    var v = kfs && kfs.length ? kfs[0].v : 1;
    return { a: 0, k: v * 100 };
  }
  var lkfs = kfs.map(function (kf, i) {
    var t = Math.round((kf.t / 1000) * fps);
    var lk = { t: t, s: [kf.v * 100] };
    if (i < kfs.length - 1) {
      lk.e = [kfs[i + 1].v * 100];
      lk.o = { x: [0, 0], y: [0, 0] };
      lk.i = { x: [1, 1], y: [1, 1] };
    }
    return lk;
  });
  return { a: 1, k: lkfs };
};

FB.motion._exportLottie = function () {
  var s = FB.motion._state;
  var fps = 30;
  var dur = s.duration;
  var frameCount = Math.ceil((dur / 1000) * fps);
  var w = 400,
    h = 300;

  var layers = s.layers.map(function (ly, idx) {
    var rgb = FB.motion._hexToRgb(ly.color);
    var cx = 0,
      cy = 0;
    if (ly.type === "rect") {
      cx = ly.w / 2;
      cy = ly.h / 2;
    }
    if (ly.type === "circle") {
      cx = ly.w / 2;
      cy = ly.h / 2;
    }

    var shapes = [];
    shapes.push({
      ty: ly.type === "circle" ? "el" : "rc",
      nm: ly.name,
      p: { a: 0, k: [0, 0] },
      s: { a: 0, k: ly.type === "circle" ? [ly.w, ly.h] : [ly.w, ly.h] },
      r: ly.type === "rect" ? { a: 0, k: 0 } : undefined,
    });
    shapes.push({
      ty: "fl",
      nm: "Fill",
      c: { a: 0, k: [rgb.r / 255, rgb.g / 255, rgb.b / 255] },
      o: { a: 0, k: 100 },
    });

    return {
      ty: 4,
      nm: ly.name,
      ind: idx + 1,
      ip: 0,
      op: frameCount,
      st: 0,
      ks: {
        a: { a: 0, k: [cx, cy] },
        p: FB.motion._toLottieProp(ly, "position", dur, fps),
        s: FB.motion._toLottieProp(ly, "scale", dur, fps),
        r: FB.motion._toLottieProp(ly, "rotation", dur, fps),
        o: FB.motion._toLottieOpacity(ly, dur, fps),
      },
      shapes: shapes,
    };
  });

  var lottie = {
    v: "5.5.7",
    fr: fps,
    ip: 0,
    op: frameCount,
    w: w,
    h: h,
    ddd: 0,
    assets: [],
    layers: layers,
  };

  var json = JSON.stringify(lottie, null, 2);
  var blob = new Blob([json], { type: "application/json" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "animation.lottie.json";
  a.click();
  URL.revokeObjectURL(url);
};

// ── Lottie Import ──
FB.motion._importLottie = function () {
  var input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = function (e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (ev) {
      try {
        var data = JSON.parse(ev.target.result);
        FB.motion._loadLottie(data);
      } catch (err) {
        FB.util.showToast("Invalid Lottie JSON file");
      }
    };
    reader.readAsText(file);
  };
  input.click();
};

FB.motion._loadLottie = function (data) {
  if (!data.layers || !data.layers.length) {
    FB.util.showToast("No layers found");
    return;
  }
  var s = FB.motion._state;
  s.layers = [];
  s.duration = ((data.op || 60) / (data.fr || 30)) * 1000;
  s.fps = data.fr || 30;
  s.nextId = 1;

  var w = data.w || 400,
    h = data.h || 300;

  data.layers.forEach(function (ly, idx) {
    if (ly.ty !== 4 && ly.ty !== 1) return;
    var shapes = ly.shapes || [];
    var shapeGeom = shapes.find(function (sh) {
      return sh.ty === "rc" || sh.ty === "el" || sh.ty === "sh";
    });
    var fill = shapes.find(function (sh) {
      return sh.ty === "fl";
    });
    var shapeType = "rect";
    var sw = 60,
      sh = 60;
    if (shapeGeom) {
      if (shapeGeom.s && shapeGeom.s.k) {
        sw = shapeGeom.s.k[0] || 60;
        sh = shapeGeom.s.k[1] || 60;
      }
      if (shapeGeom.ty === "el") shapeType = "circle";
    }

    var color = "#cdfe00";
    if (fill && fill.c && fill.c.k) {
      var c = fill.c.k;
      var r = Math.round((c[0] || 0) * 255);
      var g = Math.round((c[1] || 0) * 255);
      var b = Math.round((c[2] || 0) * 255);
      color =
        "#" +
        [r, g, b]
          .map(function (v) {
            return ("0" + v.toString(16)).slice(-2);
          })
          .join("");
    }

    function extractKfs(lottieProp) {
      if (!lottieProp || lottieProp.a === 0) return [];
      if (!lottieProp.k || !lottieProp.k.length) return [];
      return lottieProp.k.map(function (kf) {
        var t = (kf.t / (data.fr || 30)) * 1000;
        var v = kf.s;
        if (Array.isArray(v) && v.length === 1) v = v[0];
        return { t: Math.round(t), v: v };
      });
    }

    function mergeKfs(lottieProp, propName, defaultValue) {
      var kfs = extractKfs(lottieProp);
      if (propName === "scale") {
        kfs = kfs.map(function (kf) {
          return {
            t: kf.t,
            v: Array.isArray(kf.v) ? [kf.v[0] / 100, kf.v[1] / 100] : [1, 1],
          };
        });
      }
      if (propName === "opacity") {
        kfs = kfs.map(function (kf) {
          return { t: kf.t, v: typeof kf.v === "number" ? kf.v / 100 : 1 };
        });
      }
      if (!kfs.length) {
        var dv = defaultValue;
        if (propName === "scale") dv = [1, 1];
        else if (propName === "opacity") dv = 1;
        else if (propName === "rotation") dv = 0;
        else dv = [0, 0];
        kfs = [
          { t: 0, v: dv },
          { t: s.duration, v: dv },
        ];
      }
      return kfs;
    }

    var ks = ly.ks || {};
    s.layers.push({
      id: s.nextId++,
      type: shapeType,
      name: ly.nm || "Layer " + s.nextId,
      color: color,
      w: sw,
      h: sh,
      keyframes: {
        position: mergeKfs(ks.p, "position", [0, 0]),
        scale: mergeKfs(ks.s, "scale", [1, 1]),
        rotation: mergeKfs(ks.r, "rotation", 0),
        opacity: mergeKfs(ks.o, "opacity", 1),
      },
    });
  });

  s.selectedLayer = s.layers.length ? s.layers[0].id : null;
  s.time = 0;
  FB.motion._renderUI();
  FB.motion._renderLayers();
  FB.motion._renderTimeline();
  FB.motion._drawStage();
  FB.util.showToast("Imported " + s.layers.length + " layer(s)");
};

// ── Insert as block ──
FB.motion._insertBlock = function () {
  var s = FB.motion._state;
  if (!s.layers.length) return;
  var data = {
    duration: s.duration,
    fps: s.fps,
    layers: s.layers.map(function (ly) {
      return {
        type: ly.type,
        name: ly.name,
        color: ly.color,
        w: ly.w,
        h: ly.h,
        keyframes: {
          position: ly.keyframes.position.map(function (k) {
            return { t: k.t, v: k.v };
          }),
          scale: ly.keyframes.scale.map(function (k) {
            return { t: k.t, v: k.v };
          }),
          rotation: ly.keyframes.rotation.map(function (k) {
            return { t: k.t, v: k.v };
          }),
          opacity: ly.keyframes.opacity.map(function (k) {
            return { t: k.t, v: k.v };
          }),
        },
      };
    }),
  };
  if (typeof FB.state !== "undefined") {
    FB.state.saveHistory();
    FB.state.blocks.push({
      id: FB.state.genId(),
      type: "motionBlock",
      props: { animData: JSON.stringify(data), height: 350, bg: "#0d0d1a" },
    });
    FB.canvas.render();
    FB.util.showToast("Motion animation added to canvas");
  }
  FB.motion.close();
};
