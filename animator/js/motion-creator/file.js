// Motion Creator — File Import/Export (JSON & Lottie)
var MS = window.MS = window.MS || {};

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
          position: ly.keyframes.position.map(function (k) { return { t: k.t, v: k.v }; }),
          scale: ly.keyframes.scale.map(function (k) { return { t: k.t, v: k.v }; }),
          rotation: ly.keyframes.rotation.map(function (k) { return { t: k.t, v: k.v }; }),
          opacity: ly.keyframes.opacity.map(function (k) { return { t: k.t, v: k.v }; }),
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
  if (MS.project.layers.length > 2 && !confirm("Clear current project?")) return;
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

// ── Lottie export helpers ──

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
    var v = kfs && kfs.length
      ? kfs[0].v
      : prop === "rotation" || prop === "opacity" ? 1 : [0, 0];
    return { a: 0, k: prop === "scale" ? [v[0] * 100, v[1] * 100] : v };
  }
  var lkfs = kfs.map(function (kf, i) {
    var t = Math.round((kf.t / 1000) * fps);
    var v = kf.v;
    var lk = {
      t: t,
      s: prop === "scale"
        ? [v[0] * 100, v[1] * 100]
        : typeof v === "number" ? [v] : v,
    };
    if (i < kfs.length - 1) {
      var nv = kfs[i + 1].v;
      lk.e = prop === "scale"
        ? [nv[0] * 100, nv[1] * 100]
        : typeof nv === "number" ? [nv] : nv;
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

  var blob = new Blob([JSON.stringify(lottie, null, 2)], { type: "application/json" });
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
    var sgeom = shapes.find(function (sh) { return sh.ty === "rc" || sh.ty === "el" || sh.ty === "sh"; });
    var fill = shapes.find(function (sh) { return sh.ty === "fl"; });
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
      color = "#" + [
        Math.round((c[0] || 0) * 255),
        Math.round((c[1] || 0) * 255),
        Math.round((c[2] || 0) * 255),
      ].map(function (v) { return ("0" + v.toString(16)).slice(-2); }).join("");
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
        var dv = def || (
          prop === "s" ? [1, 1] :
          prop === "o" ? 1 :
          prop === "r" ? 0 : [0, 0]
        );
        k = [{ t: 0, v: dv }, { t: s.duration, v: dv }];
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
