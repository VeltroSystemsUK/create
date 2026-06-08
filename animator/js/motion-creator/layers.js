// Motion Creator — Layer Management
var MS = window.MS = window.MS || {};

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
      '<div class="ms-layer-item' + sel + '" data-id="' + ly.id +
      '" onclick="MS.layers.select(' + ly.id + ')">';
    h +=
      '<span class="ms-layer-icon">' + (ly.type === "rect" ? "▬" : "●") + "</span>";
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
