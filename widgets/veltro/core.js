// ── VELTRO CREATIVE ENGINE WIDGETS ──
// Physics, WebGL, Kinetic Typography, Cursor Lens

// ── Global mouse tracking (shared by kinetic typography + cursor lens) ──
if (!window._VeltroMouse) {
  window._VeltroMouse = { x: 0, y: 0 };
  document.addEventListener("mousemove", function (e) {
    window._VeltroMouse.x = e.clientX;
    window._VeltroMouse.y = e.clientY;
    document.documentElement.style.setProperty("--mouse-x", e.clientX + "px");
    document.documentElement.style.setProperty("--mouse-y", e.clientY + "px");
    // Drive any active kinetic text elements
    document
      .querySelectorAll("[data-kinetic-mode='proximity']")
      .forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        var maxDist = +el.dataset.kineticRadius || 300;
        var minW = +el.dataset.kineticMinWeight || 100;
        var maxW = +el.dataset.kineticMaxWeight || 900;
        var weight = Math.round(
          Math.max(
            minW,
            Math.min(maxW, maxW - (dist / maxDist) * (maxW - minW)),
          ),
        );
        el.style.fontVariationSettings = "'wght' " + weight;
        el.style.fontWeight = weight;
      });
    // Drive cursor lens overlays
    document.querySelectorAll(".veltro-lens-mask").forEach(function (mask) {
      var parent = mask.closest(".veltro-lens-wrap");
      if (!parent) return;
      var rect = parent.getBoundingClientRect();
      var lx = e.clientX - rect.left;
      var ly = e.clientY - rect.top;
      mask.style.setProperty("--lx", lx + "px");
      mask.style.setProperty("--ly", ly + "px");
    });
  });
}

// ── Matter.js lazy loader ──
window._VeltroMatterReady = false;
window._VeltroMatterCallbacks = [];
window._VeltroLoadMatter = function (cb) {
  if (window.Matter) {
    cb(window.Matter);
    return;
  }
  if (window._VeltroMatterCallbacks.length === 0) {
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js";
    s.onload = function () {
      window._VeltroMatterCallbacks.forEach(function (fn) {
        fn(window.Matter);
      });
      window._VeltroMatterCallbacks = [];
    };
    document.head.appendChild(s);
  }
  window._VeltroMatterCallbacks.push(cb);
};

