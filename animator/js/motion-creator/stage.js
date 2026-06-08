// Motion Creator — Canvas Stage Rendering
var MS = window.MS = window.MS || {};

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

    // Selection outline
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
        mx >= pos[0] && mx <= pos[0] + ly.w &&
        my >= pos[1] && my <= pos[1] + ly.h
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
    var ly = s.layers.find(function (l) { return l.id === s.dragId; });
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
      kfs.sort(function (a, b) { return a.t - b.t; });
    }
    MS.timeline.render();
    MS.stage.draw();
  });

  canvas.addEventListener("mouseup", function () { s.dragId = null; });
  canvas.addEventListener("mouseleave", function () { s.dragId = null; });
};
