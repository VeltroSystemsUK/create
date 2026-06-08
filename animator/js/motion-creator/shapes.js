// Motion Creator — Shape Tools
var MS = window.MS = window.MS || {};

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
