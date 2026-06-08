// Motion Creator — Zoomable Timeline
var MS = window.MS = window.MS || {};

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
        '<div class="ms-track" data-layer="' + ly.id + '" data-prop="' + prop + '">';
      h +=
        '<div class="ms-track-label">' + ly.name + " " + labs[prop] + "</div>";
      h +=
        '<div class="ms-track-lane" style="width:' + totalW + 'px" data-layer="' +
        ly.id + '" data-prop="' + prop +
        '" onclick="MS.timeline.clickOnLane(event,this)">';
      kfs.forEach(function (kf) {
        var pct = (kf.t / s.duration) * 100;
        h +=
          '<div class="ms-kf" style="left:' + pct + '%" data-layer="' + ly.id +
          '" data-prop="' + prop + '" data-t="' + kf.t + '"></div>';
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
  var ly = MS.project.layers.find(function (l) { return l.id === lyId; });
  if (!ly) return;
  var kfs = ly.keyframes[prop];
  var near = null;
  kfs.forEach(function (k) {
    if (Math.abs(k.t - t) < 50) near = k;
  });
  if (near) {
    if (kfs.length <= 2) return;
    ly.keyframes[prop] = kfs.filter(function (k) { return k !== near; });
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
    kfs.sort(function (a, b) { return a.t - b.t; });
  }
  MS.timeline.render();
};
