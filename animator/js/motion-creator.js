var MS = MS || {};

// ══════════════════════════════════════════════════════════
// PROJECT STATE
// ══════════════════════════════════════════════════════════
MS.project = {
  layers: [],
  duration: 2000,
  fps: 30,
  time: 0,
  playing: false,
  selectedId: null,
  dragId: null,
  dragX: 0,
  dragY: 0,
  nextId: 1,
};

MS.project.dim = { w: 500, h: 350 };

// ══════════════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════════════
window.addEventListener("DOMContentLoaded", function () {
  MS.project.addDefaultLayers();
  MS.layers.render();
  MS.timeline.render();
  MS.props.render();
  MS.stage.draw();
  MS.stage.bindEvents();
});

MS.project.addDefaultLayers = function () {
  var s = MS.project;
  s.layers.push({
    id: s.nextId++,
    type: "rect",
    name: "Box",
    color: "#cdfe00",
    w: 60,
    h: 60,
    keyframes: {
      position: [
        { t: 0, v: [220, 145] },
        { t: s.duration, v: [330, 145] },
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
        { t: s.duration, v: 1 },
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
        { t: 0, v: [160, 200] },
        { t: s.duration, v: [100, 100] },
      ],
      scale: [
        { t: 0, v: [1, 1] },
        { t: s.duration, v: [0.8, 0.8] },
      ],
      rotation: [
        { t: 0, v: 0 },
        { t: s.duration, v: -180 },
      ],
      opacity: [
        { t: 0, v: 1 },
        { t: s.duration, v: 0.6 },
      ],
    },
  });
  s.selectedId = s.layers[0].id;
};

MS.project.setDuration = function (val) {
  MS.project.duration = val * 1000;
  document.getElementById("ms-dur-val").textContent = val.toFixed(1);
  MS.timeline.render();
};

MS.project.setFPS = function (val) {
  MS.project.fps = val;
};

// ══════════════════════════════════════════════════════════
// LAYERS
// ══════════════════════════════════════════════════════════
MS.layers = {};

MS.layers.render = function () {
  var el = document.getElementById("ms-layers");
  if (!el) return;
  var s = MS.project;
  var h = "";
  s.layers.forEach(function (ly) {
    var sel = ly.id === s.selectedId ? " ms-layer-sel" : "";
    h +=
      '<div class="ms-layer-item' +
      sel +
      '" data-id="' +
      ly.id +
      '" onclick="MS.layers.select(' +
      ly.id +
      ')">';
    h +=
      '<span class="ms-layer-icon">' +
      (ly.type === "rect" ? "▬" : "●") +
      "</span>";
    h += '<span class="ms-layer-name">' + ly.name + "</span>";
    h += "</div>";
  });
  el.innerHTML = h;
};

MS.layers.select = function (id) {
  MS.project.selectedId = id;
  MS.layers.render();
  MS.timeline.render();
  MS.props.render();
  MS.stage.draw();
};

// ══════════════════════════════════════════════════════════
// SHAPES (TOOLS)
// ══════════════════════════════════════════════════════════
MS.shapes = {};

MS.shapes._add = function (type) {
  var s = MS.project;
  var id = s.nextId++;
  var name = type === "rect" ? "Box " + id : "Circle " + id;
  s.layers.push({
    id: id,
    type: type,
    name: name,
    color: type === "rect" ? "#cdfe00" : "#3b82f6",
    w: type === "rect" ? 60 : 50,
    h: type === "rect" ? 60 : 50,
    keyframes: {
      position: [
        { t: 0, v: [200, 150] },
        { t: s.duration, v: [280, 150] },
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
  s.selectedId = id;
  MS.layers.render();
  MS.timeline.render();
  MS.props.render();
  MS.stage.draw();
};

MS.shapes.addRect = function () {
  MS.shapes._add("rect");
};
MS.shapes.addCircle = function () {
  MS.shapes._add("circle");
};

MS.shapes.deleteSelected = function () {
  var s = MS.project;
  if (!s.selectedId) return;
  s.layers = s.layers.filter(function (l) {
    return l.id !== s.selectedId;
  });
  s.selectedId = s.layers.length ? s.layers[0].id : null;
  MS.layers.render();
  MS.timeline.render();
  MS.props.render();
  MS.stage.draw();
};

// ══════════════════════════════════════════════════════════
// STAGE (CANVAS)
// ══════════════════════════════════════════════════════════
MS.stage = {};

MS.stage.draw = function () {
  var canvas = document.getElementById("ms-stage");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var s = MS.project;
  var cw = s.dim.w,
    ch = s.dim.h;
  ctx.clearRect(0, 0, cw, ch);
  // Grid
  ctx.strokeStyle = "rgba(255,255,255,0.03)";
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

  s.layers.forEach(function (ly) {
    var t = s.time;
    var get = function (prop) {
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
    var pos = get("position");
    var sc = get("scale");
    var rot = get("rotation");
    var op = get("opacity");
    ctx.save();
    ctx.translate(pos[0] + (ly.w * sc[0]) / 2, pos[1] + (ly.h * sc[1]) / 2);
    ctx.rotate((rot * Math.PI) / 180);
    ctx.scale(sc[0], sc[1]);
    ctx.globalAlpha = op;
    ctx.fillStyle = ly.color;
    if (ly.type === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(ly.w, ly.h) / 2, 0, 7);
      ctx.fill();
    } else {
      ctx.fillRect(-ly.w / 2, -ly.h / 2, ly.w, ly.h);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
    // Selection
    if (ly.id === s.selectedId) {
      ctx.save();
      ctx.translate(pos[0] + (ly.w * sc[0]) / 2, pos[1] + (ly.h * sc[1]) / 2);
      ctx.scale(sc[0], sc[1]);
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      if (ly.type === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, Math.min(ly.w, ly.h) / 2 + 3, 0, 7);
        ctx.stroke();
      } else {
        ctx.strokeRect(-ly.w / 2 - 3, -ly.h / 2 - 3, ly.w + 6, ly.h + 6);
      }
      ctx.setLineDash([]);
      ctx.restore();
    }
  });
};

MS.stage.bindEvents = function () {
  var canvas = document.getElementById("ms-stage");
  if (!canvas) return;
  var s = MS.project;

  canvas.addEventListener("mousedown", function (e) {
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left,
      my = e.clientY - rect.top;
    for (var i = s.layers.length - 1; i >= 0; i--) {
      var ly = s.layers[i];
      var kfs = ly.keyframes.position;
      var t = s.time;
      var pos = ly.keyframes.position.length
        ? (function () {
            var k = ly.keyframes.position;
            if (t <= k[0].t) return k[0].v;
            if (t >= k[k.length - 1].t) return k[k.length - 1].v;
            for (var j = 0; j < k.length - 1; j++) {
              if (t >= k[j].t && t <= k[j + 1].t) {
                var r = (t - k[j].t) / (k[j + 1].t - k[j].t);
                return [
                  k[j].v[0] + (k[j + 1].v[0] - k[j].v[0]) * r,
                  k[j].v[1] + (k[j + 1].v[1] - k[j].v[1]) * r,
                ];
              }
            }
            return k[k.length - 1].v;
          })()
        : [0, 0];
      if (
        mx >= pos[0] &&
        mx <= pos[0] + ly.w &&
        my >= pos[1] &&
        my <= pos[1] + ly.h
      ) {
        s.selectedId = ly.id;
        s.dragId = ly.id;
        s.dragX = mx - pos[0];
        s.dragY = my - pos[1];
        MS.layers.render();
        MS.timeline.render();
        MS.props.render();
        MS.stage.draw();
        break;
      }
    }
  });

  canvas.addEventListener("mousemove", function (e) {
    if (!s.dragId) return;
    var rect = canvas.getBoundingClientRect();
    var mx = e.clientX - rect.left,
      my = e.clientY - rect.top;
    var ly = s.layers.find(function (l) {
      return l.id === s.dragId;
    });
    if (!ly) return;
    var kfs = ly.keyframes.position;
    var nx = Math.round(mx - s.dragX),
      ny = Math.round(my - s.dragY);
    var near = null;
    kfs.forEach(function (k) {
      if (Math.abs(k.t - s.time) < 50) near = k;
    });
    if (near) {
      near.v = [nx, ny];
    } else {
      kfs.push({ t: s.time, v: [nx, ny] });
      kfs.sort(function (a, b) {
        return a.t - b.t;
      });
    }
    MS.timeline.render();
    MS.stage.draw();
  });

  canvas.addEventListener("mouseup", function () {
    s.dragId = null;
  });
  canvas.addEventListener("mouseleave", function () {
    s.dragId = null;
  });
};

// ══════════════════════════════════════════════════════════
// PLAYBACK
// ══════════════════════════════════════════════════════════
MS.playback = {};

MS.playback.toggle = function () {
  var s = MS.project;
  s.playing = !s.playing;
  var btn = document.getElementById("ms-play-btn");
  if (btn) btn.textContent = s.playing ? "⏸" : "▶";
  if (s.playing) {
    if (s.time >= s.duration) s.time = 0;
    MS.playback._loop();
  }
};

MS.playback.stop = function () {
  var s = MS.project;
  s.playing = false;
  s.time = 0;
  document.getElementById("ms-play-btn").textContent = "▶";
  var ph = document.getElementById("ms-playhead");
  if (ph) ph.style.left = "0%";
  document.getElementById("ms-time").textContent =
    "0.0s / " + (s.duration / 1000).toFixed(1) + "s";
  MS.stage.draw();
};

MS.playback._loop = function () {
  if (!MS.project.playing) return;
  var s = MS.project;
  var dt = 16;
  s.time += dt;
  if (s.time > s.duration) {
    if (document.getElementById("ms-loop").checked) {
      s.time = 0;
    } else {
      s.time = s.duration;
      s.playing = false;
      document.getElementById("ms-play-btn").textContent = "▶";
    }
  }
  var pct = (s.time / s.duration) * 100;
  var ph = document.getElementById("ms-playhead");
  if (ph) ph.style.left = pct + "%";
  document.getElementById("ms-time").textContent =
    (s.time / 1000).toFixed(1) + "s / " + (s.duration / 1000).toFixed(1) + "s";
  MS.stage.draw();
  requestAnimationFrame(MS.playback._loop);
};

// ══════════════════════════════════════════════════════════
// TIMELINE
// ══════════════════════════════════════════════════════════
MS.timeline = { zoom: 1 };

MS.timeline.zoomIn = function () {
  MS.timeline.zoom = Math.min(4, MS.timeline.zoom * 1.5);
  MS.timeline.render();
};
MS.timeline.zoomOut = function () {
  MS.timeline.zoom = Math.max(0.5, MS.timeline.zoom / 1.5);
  MS.timeline.render();
};

MS.timeline.render = function () {
  var ruler = document.getElementById("ms-ruler");
  var tracks = document.getElementById("ms-tracks");
  if (!ruler || !tracks) return;
  var s = MS.project;
  var z = MS.timeline.zoom;
  var totalW = Math.max(400, (s.duration / 1000) * 120 * z);
  ruler.innerHTML = "";
  ruler.style.width = totalW + "px";
  var numTicks = Math.min(20, Math.floor(s.duration / 100) * z);
  for (var i = 0; i <= numTicks; i++) {
    var tp = (i / numTicks) * 100;
    var tt = (i / numTicks) * s.duration;
    var tick = document.createElement("div");
    tick.className = "ms-ruler-tick";
    tick.style.left = tp + "%";
    tick.innerHTML = "<span>" + (tt / 1000).toFixed(1) + "s</span>";
    ruler.appendChild(tick);
  }
  var ph = document.createElement("div");
  ph.className = "ms-playhead";
  ph.id = "ms-playhead";
  ph.style.left = (s.time / s.duration) * 100 + "%";
  ruler.appendChild(ph);

  var props = ["position", "scale", "rotation", "opacity"];
  var labs = { position: "Pos", scale: "Scl", rotation: "Rot", opacity: "Op" };
  var h = "";
  s.layers.forEach(function (ly) {
    var sel = ly.id === s.selectedId ? "ms-track-sel" : "";
    props.forEach(function (prop) {
      var kfs = ly.keyframes[prop] || [];
      h +=
        '<div class="ms-track" data-layer="' +
        ly.id +
        '" data-prop="' +
        prop +
        '">';
      h +=
        '<div class="ms-track-label">' + ly.name + " " + labs[prop] + "</div>";
      h +=
        '<div class="ms-track-lane" style="width:' +
        totalW +
        'px" data-layer="' +
        ly.id +
        '" data-prop="' +
        prop +
        '" onclick="MS.timeline.clickOnLane(event,this)">';
      kfs.forEach(function (kf) {
        var pct = (kf.t / s.duration) * 100;
        h +=
          '<div class="ms-kf" style="left:' +
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
  tracks.innerHTML = h;
  tracks.style.width = totalW + "px";
};

MS.timeline.clickOnLane = function (e, lane) {
  var rect = lane.getBoundingClientRect();
  var pct = (e.clientX - rect.left) / rect.width;
  var t = Math.round(pct * MS.project.duration);
  var lyId = +lane.dataset.layer;
  var prop = lane.dataset.prop;
  var ly = MS.project.layers.find(function (l) {
    return l.id === lyId;
  });
  if (!ly) return;
  var kfs = ly.keyframes[prop];
  var near = null;
  kfs.forEach(function (k) {
    if (Math.abs(k.t - t) < 50) near = k;
  });
  if (near) {
    if (kfs.length <= 2) return;
    ly.keyframes[prop] = kfs.filter(function (k) {
      return k !== near;
    });
  } else {
    var v = (function () {
      if (!kfs.length)
        return prop === "rotation" ? 0 : prop === "opacity" ? 1 : [0, 0];
      if (kfs.length === 1) return JSON.parse(JSON.stringify(kfs[0].v));
      if (t <= kfs[0].t) return JSON.parse(JSON.stringify(kfs[0].v));
      if (t >= kfs[kfs.length - 1].t)
        return JSON.parse(JSON.stringify(kfs[kfs.length - 1].v));
      for (var i = 0; i < kfs.length - 1; i++) {
        if (t >= kfs[i].t && t <= kfs[i + 1].t) {
          var r = (t - kfs[i].t) / (kfs[i + 1].t - kfs[i].t);
          var a = kfs[i].v,
            b = kfs[i + 1].v;
          return typeof a === "number"
            ? a + (b - a) * r
            : [a[0] + (b[0] - a[0]) * r, a[1] + (b[1] - a[1]) * r];
        }
      }
      return JSON.parse(JSON.stringify(kfs[kfs.length - 1].v));
    })();
    kfs.push({ t: t, v: JSON.parse(JSON.stringify(v)) });
    kfs.sort(function (a, b) {
      return a.t - b.t;
    });
  }
  MS.timeline.render();
};

// ══════════════════════════════════════════════════════════
// PROPERTIES PANEL
// ══════════════════════════════════════════════════════════
MS.props = {};

MS.props.render = function () {
  var el = document.getElementById("ms-props-panel");
  if (!el) return;
  var s = MS.project;
  var ly = s.layers.find(function (l) {
    return l.id === s.selectedId;
  });
  if (!ly) {
    el.innerHTML =
      '<div style="padding:10px;font-size:10px;color:#555">Select a layer</div>';
    return;
  }
  var h = "";
  h +=
    '<div class="ms-prop"><label>Color</label><input type="color" value="' +
    ly.color +
    '" class="ms-prop-color" onchange="MS.props.setColor(this.value)"></div>';
  h +=
    '<div class="ms-prop"><label>Width</label><input type="range" min="10" max="200" value="' +
    ly.w +
    '" oninput="MS.props.setSize(\'w\',+this.value)"><span class="ms-prop-val">' +
    ly.w +
    "</span></div>";
  h +=
    '<div class="ms-prop"><label>Height</label><input type="range" min="10" max="200" value="' +
    ly.h +
    '" oninput="MS.props.setSize(\'h\',+this.value)"><span class="ms-prop-val">' +
    ly.h +
    "</span></div>";
  el.innerHTML = h;
};

MS.props.setColor = function (c) {
  var s = MS.project;
  var ly = s.layers.find(function (l) {
    return l.id === s.selectedId;
  });
  if (ly) ly.color = c;
  MS.stage.draw();
};

MS.props.setSize = function (wh, v) {
  var s = MS.project;
  var ly = s.layers.find(function (l) {
    return l.id === s.selectedId;
  });
  if (ly) ly[wh] = v;
  MS.stage.draw();
  MS.props.render();
};

// ══════════════════════════════════════════════════════════
// FILE (EXPORT / IMPORT)
// ══════════════════════════════════════════════════════════
MS.file = {};

MS.file._exportData = function () {
  var s = MS.project;
  return {
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
};

MS.file.exportJSON = function () {
  var json = JSON.stringify(MS.file._exportData(), null, 2);
  var blob = new Blob([json], { type: "application/json" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "animation.json";
  a.click();
};

MS.file.newProject = function () {
  if (MS.project.layers.length > 2 && !confirm("Clear current project?"))
    return;
  MS.project.layers = [];
  MS.project.time = 0;
  MS.project.playing = false;
  MS.project.selectedId = null;
  MS.project.nextId = 1;
  MS.project.addDefaultLayers();
  MS.layers.render();
  MS.timeline.render();
  MS.props.render();
  MS.stage.draw();
  document.getElementById("ms-play-btn").textContent = "▶";
};

MS.file.hexToRgb = function (h) {
  h = h.replace("#", "");
  return {
    r: parseInt(h.substr(0, 2), 16),
    g: parseInt(h.substr(2, 2), 16),
    b: parseInt(h.substr(4, 2), 16),
  };
};

MS.file.lottieProp = function (ly, prop, dur, fps) {
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

MS.file.exportLottie = function () {
  var s = MS.project;
  var fps = s.fps;
  var dur = s.duration;
  var frameCount = Math.ceil((dur / 1000) * fps);
  var w = s.dim.w,
    h = s.dim.h;

  var layers = s.layers.map(function (ly, idx) {
    var rgb = MS.file.hexToRgb(ly.color);
    var cx = ly.w / 2,
      cy = ly.h / 2;
    var shapes = [];
    shapes.push({
      ty: ly.type === "circle" ? "el" : "rc",
      nm: ly.name,
      p: { a: 0, k: [0, 0] },
      s: { a: 0, k: [ly.w, ly.h] },
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
        p: MS.file.lottieProp(ly, "position", dur, fps),
        s: MS.file.lottieProp(ly, "scale", dur, fps),
        r: MS.file.lottieProp(ly, "rotation", dur, fps),
        o: (function () {
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
        })(),
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

  var blob = new Blob([JSON.stringify(lottie, null, 2)], {
    type: "application/json",
  });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "animation.lottie.json";
  a.click();
};

MS.file.importLottie = function () {
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
        MS.file._loadLottie(data);
      } catch (err) {
        alert("Invalid Lottie JSON");
      }
    };
    reader.readAsText(file);
  };
  input.click();
};

MS.file._loadLottie = function (data) {
  if (!data.layers || !data.layers.length) {
    alert("No layers found");
    return;
  }
  var s = MS.project;
  s.layers = [];
  s.duration = ((data.op || 60) / (data.fr || 30)) * 1000;
  s.fps = data.fr || 30;
  s.time = 0;
  s.playing = false;
  s.nextId = 1;

  data.layers.forEach(function (ly) {
    if (ly.ty !== 4 && ly.ty !== 1) return;
    var shapes = ly.shapes || [];
    var sgeom = shapes.find(function (sh) {
      return sh.ty === "rc" || sh.ty === "el" || sh.ty === "sh";
    });
    var fill = shapes.find(function (sh) {
      return sh.ty === "fl";
    });
    var stype = "rect";
    var sw = 60,
      sh = 60;
    if (sgeom) {
      if (sgeom.s && sgeom.s.k) {
        sw = sgeom.s.k[0] || 60;
        sh = sgeom.s.k[1] || 60;
      }
      if (sgeom.ty === "el") stype = "circle";
    }
    var color = "#cdfe00";
    if (fill && fill.c && fill.c.k) {
      var c = fill.c.k;
      color =
        "#" +
        [
          Math.round((c[0] || 0) * 255),
          Math.round((c[1] || 0) * 255),
          Math.round((c[2] || 0) * 255),
        ]
          .map(function (v) {
            return ("0" + v.toString(16)).slice(-2);
          })
          .join("");
    }

    function xk(prop) {
      if (!ly.ks || !ly.ks[prop]) return [];
      var p = ly.ks[prop];
      if (p.a === 0) return [];
      if (!p.k || !p.k.length) return [];
      return p.k.map(function (kf) {
        var t = Math.round((kf.t / (data.fr || 30)) * 1000);
        var v = kf.s;
        if (Array.isArray(v) && v.length === 1) v = v[0];
        return { t: t, v: v };
      });
    }

    function mk(prop, def) {
      var k = xk(prop);
      if (prop === "s") {
        k = k.map(function (kf) {
          return {
            t: kf.t,
            v: Array.isArray(kf.v) ? [kf.v[0] / 100, kf.v[1] / 100] : [1, 1],
          };
        });
      }
      if (prop === "o") {
        k = k.map(function (kf) {
          return { t: kf.t, v: typeof kf.v === "number" ? kf.v / 100 : 1 };
        });
      }
      if (!k.length) {
        var dv =
          def ||
          (prop === "s"
            ? [1, 1]
            : prop === "o"
              ? 1
              : prop === "r"
                ? 0
                : [0, 0]);
        k = [
          { t: 0, v: dv },
          { t: s.duration, v: dv },
        ];
      }
      return k;
    }

    s.layers.push({
      id: s.nextId++,
      type: stype,
      name: ly.nm || "Layer " + s.nextId,
      color: color,
      w: sw,
      h: sh,
      keyframes: {
        position: mk("p", [0, 0]),
        scale: mk("s", [1, 1]),
        rotation: mk("r", 0),
        opacity: mk("o", 1),
      },
    });
  });

  s.selectedId = s.layers.length ? s.layers[0].id : null;
  MS.layers.render();
  MS.timeline.render();
  MS.props.render();
  MS.stage.draw();
};
