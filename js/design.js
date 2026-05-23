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

FB.design.canvas = (function () {
  var _fc = null;
  var _inited = false;

  var PRESETS = {
    hero: { w: 1920, h: 600 },
    og: { w: 1200, h: 630 },
    card: { w: 800, h: 600 },
    square: { w: 1080, h: 1080 },
    wide: { w: 1920, h: 1080 },
  };

  function init() {
    if (_inited) {
      _fc.renderAll();
      return;
    }
    _inited = true;

    _fc = new fabric.Canvas("ds-canvas", {
      backgroundColor: "#ffffff",
      selection: true,
      preserveObjectStacking: true,
    });

    applyPreset("og");
    _bindZoomPan();
    _bindEvents();
    _bindKeys();
    FB.design.tools.render();
    FB.design.tools.bindMouseDraw();
  }

  function applyPreset(key) {
    if (key === "custom") {
      var w = parseInt(prompt("Width in px:", "800"), 10) || 800;
      var h = parseInt(prompt("Height in px:", "600"), 10) || 600;
      _resizeTo(w, h);
      return;
    }
    var p = PRESETS[key];
    if (!p) return;
    _resizeTo(p.w, p.h);
    document.getElementById("ds-preset-select").value = key;
  }

  function _resizeTo(w, h) {
    var wrap = document.getElementById("ds-canvas-wrap");
    var maxW = wrap.clientWidth - 40;
    var maxH = wrap.clientHeight - 40;
    var scale = Math.min(1, maxW / w, maxH / h);
    _fc.setWidth(w);
    _fc.setHeight(h);
    _fc.setZoom(scale);
    _fc.wrapperEl.style.width = Math.round(w * scale) + "px";
    _fc.wrapperEl.style.height = Math.round(h * scale) + "px";
    document.getElementById("ds-size-label").textContent = w + " \xd7 " + h;
    document.getElementById("ds-zoom-label").textContent =
      Math.round(scale * 100) + "%";
    _fc.renderAll();
  }

  function _bindZoomPan() {
    _fc.on("mouse:wheel", function (opt) {
      var delta = opt.e.deltaY;
      var zoom = _fc.getZoom();
      zoom *= Math.pow(0.999, delta);
      zoom = Math.min(Math.max(zoom, 0.05), 5);
      _fc.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      document.getElementById("ds-zoom-label").textContent =
        Math.round(zoom * 100) + "%";
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    var _panning = false;
    _fc.on("mouse:down", function (opt) {
      if (opt.e.spaceKey || opt.e.button === 1) {
        _panning = true;
        _fc.selection = false;
      }
    });
    _fc.on("mouse:move", function (opt) {
      if (_panning && opt.e.buttons) {
        _fc.relativePan({ x: opt.e.movementX, y: opt.e.movementY });
      }
    });
    _fc.on("mouse:up", function () {
      _panning = false;
      _fc.selection = true;
    });
  }

  function _bindEvents() {
    _fc.on("selection:created", function () {
      FB.design.props.render();
      FB.design.layers.render();
      FB.design._showAlignBar(true);
    });
    _fc.on("selection:updated", function () {
      FB.design.props.render();
      FB.design.layers.render();
      FB.design._showAlignBar(true);
    });
    _fc.on("selection:cleared", function () {
      FB.design.props.render();
      FB.design.layers.render();
      FB.design._showAlignBar(false);
    });
    _fc.on("object:added", function () {
      FB.design.layers.render();
      FB.design.history.push();
    });
    _fc.on("object:removed", function () {
      FB.design.layers.render();
      FB.design.history.push();
    });
    _fc.on("object:modified", function () {
      FB.design.props.render();
      FB.design.layers.render();
      FB.design.history.push();
    });
  }

  function _bindKeys() {
    document.addEventListener("keydown", function (e) {
      if (!FB.design._mode) return;
      var tag = document.activeElement.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "Delete" || e.key === "Backspace") {
        var objs = _fc.getActiveObjects();
        if (objs.length) {
          objs.forEach(function (o) {
            _fc.remove(o);
          });
          _fc.discardActiveObject();
          _fc.renderAll();
        }
      }
      if (e.ctrlKey && e.key === "d") {
        e.preventDefault();
        _duplicateSelected();
      }
      if (e.ctrlKey && e.key === "g") {
        e.preventDefault();
        _groupSelected();
      }
      if (e.ctrlKey && e.shiftKey && e.key === "G") {
        e.preventDefault();
        _ungroupSelected();
      }
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        FB.design.library.save();
      }
      if (e.ctrlKey && e.key === "z") {
        e.preventDefault();
        FB.design.history.undo();
      }
      if (
        (e.ctrlKey && e.key === "y") ||
        (e.ctrlKey && e.shiftKey && e.key === "z")
      ) {
        e.preventDefault();
        FB.design.history.redo();
      }
      var toolKeys = {
        v: "select",
        r: "rect",
        o: "circle",
        t: "text",
        i: "image",
      };
      if (toolKeys[e.key] && !e.ctrlKey && !e.altKey) {
        FB.design.tools.setTool(toolKeys[e.key]);
      }
    });
  }

  function _duplicateSelected() {
    _fc.getActiveObjects().forEach(function (obj) {
      obj.clone(function (clone) {
        clone.set({ left: obj.left + 20, top: obj.top + 20 });
        _fc.add(clone);
      });
    });
    _fc.renderAll();
  }

  function _groupSelected() {
    if (_fc.getActiveObjects().length < 2) return;
    var objs = _fc.getActiveObjects();
    var group = new fabric.Group(objs, { canvas: _fc });
    objs.forEach(function (o) {
      _fc.remove(o);
    });
    _fc.add(group);
    _fc.setActiveObject(group);
    _fc.renderAll();
  }

  function _ungroupSelected() {
    var obj = _fc.getActiveObject();
    if (!obj || obj.type !== "group") return;
    obj.toActiveSelection();
    _fc.requestRenderAll();
  }

  function zoomIn() {
    var z = Math.min(_fc.getZoom() * 1.2, 5);
    _fc.setZoom(z);
    document.getElementById("ds-zoom-label").textContent =
      Math.round(z * 100) + "%";
  }

  function zoomOut() {
    var z = Math.max(_fc.getZoom() * 0.8, 0.05);
    _fc.setZoom(z);
    document.getElementById("ds-zoom-label").textContent =
      Math.round(z * 100) + "%";
  }

  function zoomFit() {
    var w = _fc.getWidth();
    var h = _fc.getHeight();
    var wrap = document.getElementById("ds-canvas-wrap");
    var scale = Math.min(
      (wrap.clientWidth - 40) / w,
      (wrap.clientHeight - 40) / h,
    );
    _fc.setZoom(scale);
    document.getElementById("ds-zoom-label").textContent =
      Math.round(scale * 100) + "%";
    _fc.renderAll();
  }

  function get() {
    return _fc;
  }

  return {
    init: init,
    get: get,
    applyPreset: applyPreset,
    zoomIn: zoomIn,
    zoomOut: zoomOut,
    zoomFit: zoomFit,
  };
})();
