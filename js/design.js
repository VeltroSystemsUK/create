FB.design = {};
FB.design._mode = false;

FB.design.init = function () {
  // Submodules initialised in their own tasks
};

FB.design._showAlignBar = function (show) {
  var bar = document.getElementById("ds-align-bar");
  if (!bar) return;
  bar.style.display = show ? "flex" : "none";
  var fc =
    FB.design.canvas && FB.design.canvas.get ? FB.design.canvas.get() : null;
  var n = fc ? fc.getActiveObjects().length : 0;
  var dh = document.getElementById("ds-dist-h");
  var dv = document.getElementById("ds-dist-v");
  if (dh) dh.style.display = n >= 3 ? "inline-block" : "none";
  if (dv) dv.style.display = n >= 3 ? "inline-block" : "none";
};
