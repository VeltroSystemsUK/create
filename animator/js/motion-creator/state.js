// Motion Creator — Project State & Init
var MS = window.MS = window.MS || {};

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
