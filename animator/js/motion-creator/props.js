// Motion Creator — Properties Panel
var MS = window.MS = window.MS || {};

// ══════════════════════════════════════════════════════════
// PROPERTIES PANEL
// ══════════════════════════════════════════════════════════
MS.props = {};

MS.props.render = function () {
  var el = document.getElementById("ms-props-panel");
  if (!el) return;
  var s = MS.project;
  var ly = s.layers.find(function (l) { return l.id === s.selectedId; });
  if (!ly) {
    el.innerHTML =
      '<div style="padding:10px;font-size:10px;color:#555">Select a layer</div>';
    return;
  }
  var h = "";
  h +=
    '<div class="ms-prop"><label>Color</label><input type="color" value="' +
    ly.color + '" class="ms-prop-color" onchange="MS.props.setColor(this.value)"></div>';
  h +=
    '<div class="ms-prop"><label>Width</label><input type="range" min="10" max="200" value="' +
    ly.w + '" oninput="MS.props.setSize(\'w\',+this.value)"><span class="ms-prop-val">' +
    ly.w + "</span></div>";
  h +=
    '<div class="ms-prop"><label>Height</label><input type="range" min="10" max="200" value="' +
    ly.h + '" oninput="MS.props.setSize(\'h\',+this.value)"><span class="ms-prop-val">' +
    ly.h + "</span></div>";
  el.innerHTML = h;
};

MS.props.setColor = function (c) {
  var s = MS.project;
  var ly = s.layers.find(function (l) { return l.id === s.selectedId; });
  if (ly) ly.color = c;
  MS.stage.draw();
};

MS.props.setSize = function (wh, v) {
  var s = MS.project;
  var ly = s.layers.find(function (l) { return l.id === s.selectedId; });
  if (ly) ly[wh] = v;
  MS.stage.draw();
  MS.props.render();
};
