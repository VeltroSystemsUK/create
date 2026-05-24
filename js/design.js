FB.design = {};
FB.design._mode = false;

FB.design._esc = function (s) {
  var d = document.createElement("div");
  d.textContent = String(s);
  return d.innerHTML;
};

FB.design.init = function () {
  // Submodules initialised in canvas.init
};

FB.design.switchLeftTab = function (tab) {
  document.querySelectorAll("#ds-left-tabs .ds-tab").forEach(function (b) {
    b.classList.toggle("active", b.dataset.tab === tab);
  });
  document
    .querySelectorAll("#ds-tab-elements,#ds-tab-layers,#ds-tab-assets")
    .forEach(function (el) {
      el.classList.toggle("active", el.id === "ds-tab-" + tab);
    });
  if (tab === "assets") FB.design._loadAssets();
};

FB.design.switchRightTab = function (tab) {
  document.querySelectorAll("#ds-right-tabs .ds-tab").forEach(function (b) {
    b.classList.toggle("active", b.dataset.tab === tab);
  });
  document
    .querySelectorAll("#ds-tab-design,#ds-tab-align,#ds-tab-export")
    .forEach(function (el) {
      el.classList.toggle("active", el.id === "ds-tab-" + tab);
    });
  if (tab === "export") FB.design.renderExportTab();
};

FB.design._loadAssets = function () {
  fetch("/api/designs")
    .then(function (r) {
      return r.json();
    })
    .then(function (list) {
      var esc = FB.design._esc;
      var el = document.getElementById("ds-assets-designs");
      if (!el) return;
      el.innerHTML = list.length
        ? list
            .map(function (d) {
              return (
                '<div class="ds-builder-thumb" onclick="FB.design.library.loadDesign(\'' +
                esc(d.slug) +
                "')\">" +
                (d.thumbnail
                  ? '<img src="' +
                    esc(d.thumbnail) +
                    '" alt="' +
                    esc(d.name) +
                    '">'
                  : '<div style="height:60px;background:#1a1a2a"></div>') +
                '<div class="ds-builder-thumb-label">' +
                esc(d.name) +
                "</div></div>"
              );
            })
            .join("")
        : '<p style="color:#555;font-size:10px;padding:8px;">No saved designs yet.</p>';
    });
};

FB.design.renderExportTab = function () {
  var fc = FB.design.canvas.get();
  if (!fc) return;
  var bg =
    typeof fc.backgroundColor === "string" ? fc.backgroundColor : "#ffffff";
  var el = document.getElementById("ds-canvas-bg-picker");
  if (!el) return;
  el.innerHTML =
    '<input type="color" class="ds-color-swatch" value="' +
    (bg.charAt(0) === "#" ? bg : "#ffffff") +
    '" onchange="FB.design.props.setCanvasBg(this.value)"/>' +
    '<input class="ds-input" style="flex:1" value="' +
    FB.design._esc(bg) +
    '" onchange="FB.design.props.setCanvasBg(this.value)"/>';
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

FB.design.history = (function () {
  var _stack = [];
  var _future = [];
  var _paused = false;

  function push() {
    if (_paused) return;
    var fc = FB.design.canvas.get();
    if (!fc) return;
    _stack.push(JSON.stringify(fc.toJSON(["id", "name"])));
    if (_stack.length > 50) _stack.shift();
    _future = [];
  }

  function undo() {
    var fc = FB.design.canvas.get();
    if (!fc || _stack.length < 2) return;
    _future.push(_stack.pop());
    _paused = true;
    fc.loadFromJSON(JSON.parse(_stack[_stack.length - 1]), function () {
      fc.renderAll();
      FB.design.layers.render();
      FB.design.props.render();
      _paused = false;
    });
  }

  function redo() {
    var fc = FB.design.canvas.get();
    if (!fc || !_future.length) return;
    var state = _future.pop();
    _stack.push(state);
    _paused = true;
    fc.loadFromJSON(JSON.parse(state), function () {
      fc.renderAll();
      FB.design.layers.render();
      FB.design.props.render();
      _paused = false;
    });
  }

  function silent(fn) {
    _paused = true;
    try {
      fn();
    } finally {
      _paused = false;
    }
  }

  return { push: push, undo: undo, redo: redo, silent: silent };
})();

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
    FB.design.history.push();
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
    var maxW = Math.max(wrap.clientWidth - 40, 200);
    var maxH = Math.max(wrap.clientHeight - 40, 200);
    var scale = Math.min(1, maxW / w, maxH / h);
    scale = Math.max(scale, 0.01);
    _fc.setWidth(w);
    _fc.setHeight(h);
    _fc.setZoom(scale);
    if (_fc.wrapperEl) {
      _fc.wrapperEl.style.width = Math.round(w * scale) + "px";
      _fc.wrapperEl.style.height = Math.round(h * scale) + "px";
    }
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
    var _spaceDown = false;
    document.addEventListener("keydown", function (e) {
      if (e.code === "Space" && FB.design._mode) _spaceDown = true;
    });
    document.addEventListener("keyup", function (e) {
      if (e.code === "Space") _spaceDown = false;
    });
    _fc.on("mouse:down", function (opt) {
      if (_spaceDown || opt.e.button === 1) {
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
      _fc.selection = FB.design.tools.active() === "select";
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
    var active = _fc.getActiveObject();
    if (!active || active.type !== "activeSelection") return;
    var group = active.toGroup();
    _fc.setActiveObject(group);
    _fc.requestRenderAll();
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
      Math.max(wrap.clientWidth - 40, 200) / w,
      Math.max(wrap.clientHeight - 40, 200) / h,
    );
    scale = Math.max(scale, 0.01);
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

FB.design.tools = (function () {
  var _active = "select";
  var _drawing = false;
  var _startX, _startY, _drawObj;

  var TOOLS = [
    { id: "select", label: "▶", title: "Select (V)" },
    { id: "rect", label: "⬛", title: "Rectangle (R)" },
    { id: "circle", label: "⬤", title: "Circle (O)" },
    { id: "tri", label: "▲", title: "Triangle" },
    { id: "poly", label: "⬡", title: "Polygon" },
    { id: "line", label: "—", title: "Line" },
    { id: "arrow", label: "→", title: "Arrow" },
    { id: "text", label: "T", title: "Text (T)" },
    { id: "image", label: "🖼", title: "Image (I)" },
  ];

  function render() {
    var el = document.getElementById("ds-tools");
    el.innerHTML =
      '<div class="ds-tools-grid">' +
      TOOLS.map(function (t) {
        return (
          '<button class="ds-tool-btn' +
          (t.id === _active ? " active" : "") +
          '" title="' +
          t.title +
          '" onclick="FB.design.tools.setTool(\'' +
          t.id +
          "')\">" +
          t.label +
          "</button>"
        );
      }).join("") +
      "</div>";
  }

  function setTool(id) {
    _active = id;
    var fc = FB.design.canvas.get();
    if (!fc) {
      render();
      return;
    }
    fc.isDrawingMode = false;
    fc.selection = id === "select";
    fc.defaultCursor = id === "select" ? "default" : "crosshair";
    if (id === "image") {
      _triggerImageUpload();
    }
    render();
  }

  function _triggerImageUpload() {
    var inp = document.createElement("input");
    inp.type = "file";
    inp.accept = "image/*";
    inp.onchange = function () {
      var file = inp.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (ev) {
        fabric.Image.fromURL(ev.target.result, function (img) {
          var fc = FB.design.canvas.get();
          var maxW = fc.getWidth() * 0.5;
          if (img.width > maxW) img.scaleToWidth(maxW);
          img.set({
            left: fc.getWidth() / 2 - img.getScaledWidth() / 2,
            top: fc.getHeight() / 2 - img.getScaledHeight() / 2,
            name: "Image",
          });
          fc.add(img);
          fc.setActiveObject(img);
          fc.renderAll();
          FB.design.tools.setTool("select");
        });
      };
      reader.readAsDataURL(file);
    };
    inp.click();
  }

  function bindMouseDraw() {
    var fc = FB.design.canvas.get();

    fc.on("mouse:down", function (opt) {
      var p = fc.getPointer(opt.e);
      _startX = p.x;
      _startY = p.y;
      if (_active === "select" || _active === "image" || _active === "text")
        return;
      if (opt.target) return;
      _drawing = true;
      _drawObj = _createShape(_active, p.x, p.y);
      if (_drawObj) fc.add(_drawObj);
    });

    fc.on("mouse:move", function (opt) {
      if (!_drawing || !_drawObj) return;
      var p = fc.getPointer(opt.e);
      _updateShape(_drawObj, _startX, _startY, p.x, p.y);
      fc.renderAll();
    });

    fc.on("mouse:up", function (opt) {
      // Text tool: single click places a text object
      if (_active === "text") {
        var p = fc.getPointer(opt.e);
        var dx = p.x - _startX,
          dy = p.y - _startY;
        if (Math.sqrt(dx * dx + dy * dy) < 5 && !opt.target) {
          var txt = new fabric.IText("Text", {
            left: _startX,
            top: _startY,
            fontFamily: "Lexend",
            fontSize: 32,
            fill: "#000000",
            name: "Text",
          });
          fc.add(txt);
          fc.setActiveObject(txt);
          txt.enterEditing();
          FB.design.tools.setTool("select");
          fc.renderAll();
        }
        return;
      }

      if (!_drawing) return;
      _drawing = false;

      if (_drawObj) {
        var w = _drawObj.getScaledWidth();
        var h = _drawObj.getScaledHeight();
        // Discard accidental misclick shapes smaller than 4px
        if (w < 4 && h < 4) {
          fc.remove(_drawObj);
        } else {
          _drawObj.setCoords();
          fc.setActiveObject(_drawObj);
        }
        _drawObj = null;
      }

      FB.design.tools.setTool("select");
      fc.renderAll();
    });

    // Double-click on existing i-text to enter editing
    fc.on("mouse:dblclick", function (opt) {
      if (opt.target && opt.target.type === "i-text") {
        opt.target.enterEditing();
      }
    });
  }

  function _createShape(type, x, y) {
    var opts = {
      left: x,
      top: y,
      fill: "#4a90e2",
      stroke: "transparent",
      strokeWidth: 0,
      originX: "left",
      originY: "top",
    };
    if (type === "rect")
      return new fabric.Rect(
        Object.assign({ width: 1, height: 1, name: "Rectangle" }, opts),
      );
    if (type === "circle")
      return new fabric.Ellipse(
        Object.assign({ rx: 1, ry: 1, name: "Circle" }, opts),
      );
    if (type === "tri")
      return new fabric.Triangle(
        Object.assign({ width: 1, height: 1, name: "Triangle" }, opts),
      );
    if (type === "poly")
      return new fabric.Polygon(
        [
          { x: 0, y: 50 },
          { x: 50, y: 0 },
          { x: 100, y: 50 },
          { x: 75, y: 100 },
          { x: 25, y: 100 },
        ],
        Object.assign({ name: "Polygon" }, opts),
      );
    if (type === "line")
      return new fabric.Line([x, y, x, y], {
        stroke: "#4a90e2",
        strokeWidth: 2,
        name: "Line",
      });
    if (type === "arrow") {
      var line = new fabric.Line([x, y, x, y], {
        stroke: "#4a90e2",
        strokeWidth: 2,
        name: "Arrow",
      });
      line._isArrow = true;
      return line;
    }
    return null;
  }

  function _updateShape(obj, x1, y1, x2, y2) {
    var w = x2 - x1,
      h = y2 - y1;
    if (obj.type === "rect" || obj.type === "triangle") {
      obj.set({
        width: Math.abs(w),
        height: Math.abs(h),
        left: Math.min(x1, x2),
        top: Math.min(y1, y2),
      });
    } else if (obj.type === "ellipse") {
      obj.set({
        rx: Math.abs(w) / 2,
        ry: Math.abs(h) / 2,
        left: Math.min(x1, x2),
        top: Math.min(y1, y2),
      });
    } else if (obj.type === "polygon") {
      var size = Math.max(Math.abs(w), Math.abs(h), 1);
      obj.set({
        scaleX: size / 100,
        scaleY: size / 100,
        left: Math.min(x1, x2),
        top: Math.min(y1, y2),
      });
    } else if (obj.type === "line") {
      obj.set({ x2: x2, y2: y2 });
    }
  }

  return {
    render: render,
    setTool: setTool,
    bindMouseDraw: bindMouseDraw,
    active: function () {
      return _active;
    },
  };
})();

FB.design.layers = (function () {
  var _typeIcon = {
    rect: "⬛",
    ellipse: "⬤",
    triangle: "▲",
    polygon: "⬡",
    line: "—",
    "i-text": "T",
    image: "🖼",
    group: "⊞",
    path: "✒",
  };

  function render() {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var objs = fc.getObjects().slice().reverse();
    var active = fc.getActiveObjects();
    var el = document.getElementById("ds-layers-list");
    el.innerHTML = objs
      .map(function (obj, i) {
        var icon = _typeIcon[obj.type] || "◆";
        var name = obj.name || obj.type || "Object";
        var isActive = active.indexOf(obj) !== -1;
        var isHidden = obj.visible === false;
        return (
          '<div class="ds-layer-row' +
          (isActive ? " selected" : "") +
          '" ' +
          'data-idx="' +
          (objs.length - 1 - i) +
          '" ' +
          'onclick="FB.design.layers.select(' +
          (objs.length - 1 - i) +
          ')" ' +
          'oncontextmenu="FB.design.layers.ctxMenu(event,' +
          (objs.length - 1 - i) +
          ');return false">' +
          "<span>" +
          icon +
          "</span>" +
          '<span class="ds-layer-name">' +
          name +
          "</span>" +
          '<button class="ds-layer-vis" onclick="FB.design.layers.toggleVis(event,' +
          (objs.length - 1 - i) +
          ')">' +
          (isHidden ? "🚫" : "👁") +
          "</button>" +
          "</div>"
        );
      })
      .join("");
  }

  function select(idx) {
    var fc = FB.design.canvas.get();
    var obj = fc.item(idx);
    if (!obj) return;
    fc.setActiveObject(obj);
    fc.renderAll();
    FB.design.props.render();
    render();
  }

  function toggleVis(e, idx) {
    e.stopPropagation();
    var fc = FB.design.canvas.get();
    var obj = fc.item(idx);
    if (!obj) return;
    obj.visible = !obj.visible;
    fc.renderAll();
    render();
  }

  function ctxMenu(e, idx) {
    var fc = FB.design.canvas.get();
    var obj = fc.item(idx);
    if (!obj) return;
    var name = prompt("Rename layer:", obj.name || obj.type);
    if (name !== null) {
      obj.name = name;
      render();
    }
  }

  return {
    render: render,
    select: select,
    toggleVis: toggleVis,
    ctxMenu: ctxMenu,
  };
})();

FB.design.props = (function () {
  var GOOGLE_FONTS = [
    "Lexend",
    "Inter",
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Poppins",
    "Raleway",
    "Playfair Display",
    "Merriweather",
    "Lora",
    "Bebas Neue",
    "Oswald",
    "Space Grotesk",
    "DM Sans",
  ];

  function render() {
    var fc = FB.design.canvas.get();
    var el = document.getElementById("ds-props");
    if (!fc) {
      el.innerHTML = "";
      return;
    }
    var obj = fc.getActiveObject();
    if (!obj) {
      el.innerHTML = _canvasProps(fc);
      return;
    }
    if (obj.type === "i-text") {
      el.innerHTML = _textProps(obj);
      return;
    }
    if (obj.type === "image") {
      el.innerHTML = _imageProps(obj);
      return;
    }
    el.innerHTML = _shapeProps(obj);
  }

  function _posSize(obj) {
    return (
      '<div class="ds-prop-group">' +
      '<div class="ds-prop-label">Position</div>' +
      '<div class="ds-prop-row">' +
      '<input class="ds-input" style="width:48%" type="number" value="' +
      Math.round(obj.left) +
      '" onchange="FB.design.props.setProp(\'left\',+this.value)" placeholder="X"/>' +
      '<input class="ds-input" style="width:48%" type="number" value="' +
      Math.round(obj.top) +
      '" onchange="FB.design.props.setProp(\'top\',+this.value)" placeholder="Y"/>' +
      "</div>" +
      '<div class="ds-prop-row">' +
      '<input class="ds-input" style="width:48%" type="number" value="' +
      Math.round(obj.getScaledWidth()) +
      '" onchange="FB.design.props.setWidth(+this.value)" placeholder="W"/>' +
      '<input class="ds-input" style="width:48%" type="number" value="' +
      Math.round(obj.getScaledHeight()) +
      '" onchange="FB.design.props.setHeight(+this.value)" placeholder="H"/>' +
      "</div>" +
      "</div>"
    );
  }

  function _shapeProps(obj) {
    var fill = typeof obj.fill === "string" ? obj.fill : "#4a90e2";
    var stroke = obj.stroke || "transparent";
    var sw = obj.strokeWidth || 0;
    var op = Math.round((obj.opacity || 1) * 100);
    var html = _posSize(obj);
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Fill</div>' +
      '<div class="ds-color-row"><input type="color" class="ds-color-swatch" value="' +
      fill +
      '" onchange="FB.design.props.setProp(\'fill\',this.value)"/>' +
      '<input class="ds-input" value="' +
      fill +
      '" onchange="FB.design.props.setProp(\'fill\',this.value)"/></div></div>';
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Stroke</div>' +
      '<div class="ds-prop-row">' +
      '<input type="color" class="ds-color-swatch" value="' +
      (stroke === "transparent" ? "#000000" : stroke) +
      '" onchange="FB.design.props.setProp(\'stroke\',this.value)"/>' +
      '<input class="ds-input" type="number" value="' +
      sw +
      '" placeholder="Width" onchange="FB.design.props.setProp(\'strokeWidth\',+this.value)"/>' +
      "</div></div>";
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Opacity</div>' +
      '<input class="ds-input" type="range" min="0" max="100" value="' +
      op +
      '" oninput="FB.design.props.setProp(\'opacity\',this.value/100)"/></div>';
    if (obj.type === "rect") {
      html +=
        '<div class="ds-prop-group"><div class="ds-prop-label">Corner Radius</div>' +
        '<input class="ds-input" type="number" value="' +
        (obj.rx || 0) +
        "\" onchange=\"FB.design.props.setPropXY('rx','ry',+this.value)\"/></div>";
    }
    return html;
  }

  function _textProps(obj) {
    var html = _posSize(obj);
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Font</div>' +
      '<select class="ds-select" onchange="FB.design.props.setProp(\'fontFamily\',this.value)">' +
      GOOGLE_FONTS.map(function (f) {
        return (
          "<option" +
          (obj.fontFamily === f ? " selected" : "") +
          ">" +
          f +
          "</option>"
        );
      }).join("") +
      "</select></div>";
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Size / Weight</div><div class="ds-prop-row">' +
      '<input class="ds-input" style="width:48%" type="number" value="' +
      (obj.fontSize || 32) +
      '" onchange="FB.design.props.setProp(\'fontSize\',+this.value)"/>' +
      '<input class="ds-input" style="width:48%" type="number" value="' +
      (obj.fontWeight || 400) +
      '" onchange="FB.design.props.setProp(\'fontWeight\',+this.value)"/>' +
      "</div></div>";
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Colour</div>' +
      '<div class="ds-color-row"><input type="color" class="ds-color-swatch" value="' +
      (obj.fill || "#000000") +
      '" onchange="FB.design.props.setProp(\'fill\',this.value)"/>' +
      '<input class="ds-input" value="' +
      (obj.fill || "#000000") +
      '" onchange="FB.design.props.setProp(\'fill\',this.value)"/></div></div>';
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Align</div><div class="ds-btn-row">' +
      ["left", "center", "right"]
        .map(function (a) {
          return (
            '<button class="ds-sm-btn' +
            (obj.textAlign === a ? " active" : "") +
            "\" onclick=\"FB.design.props.setProp('textAlign','" +
            a +
            "')\">" +
            a[0].toUpperCase() +
            "</button>"
          );
        })
        .join("") +
      "</div></div>";
    return html;
  }

  function _imageProps(obj) {
    var op = Math.round((obj.opacity || 1) * 100);
    var html = _posSize(obj);
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Opacity</div>' +
      '<input class="ds-input" type="range" min="0" max="100" value="' +
      op +
      '" oninput="FB.design.props.setProp(\'opacity\',this.value/100)"/></div>';
    html +=
      '<div class="ds-prop-group"><div class="ds-prop-label">Flip</div><div class="ds-btn-row">' +
      '<button class="ds-sm-btn" onclick="FB.design.props.flip(\'X\')">Flip H</button>' +
      '<button class="ds-sm-btn" onclick="FB.design.props.flip(\'Y\')">Flip V</button>' +
      "</div></div>";
    return html;
  }

  function _canvasProps(fc) {
    return (
      '<div class="ds-prop-group"><div class="ds-prop-label">Canvas Background</div>' +
      '<div class="ds-color-row"><input type="color" class="ds-color-swatch" value="' +
      (fc.backgroundColor || "#ffffff") +
      '" onchange="FB.design.props.setCanvasBg(this.value)"/>' +
      '<input class="ds-input" value="' +
      (fc.backgroundColor || "#ffffff") +
      '" onchange="FB.design.props.setCanvasBg(this.value)"/></div></div>'
    );
  }

  function setProp(key, val) {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj) return;
    obj.set(key, val);
    obj.setCoords();
    fc.renderAll();
    FB.design.history.push();
  }

  function setPropXY(kx, ky, val) {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj) return;
    obj.set(kx, val);
    obj.set(ky, val);
    obj.setCoords();
    fc.renderAll();
    FB.design.history.push();
  }

  function setWidth(val) {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj) return;
    obj.scaleToWidth(val);
    obj.setCoords();
    fc.renderAll();
    FB.design.history.push();
  }

  function setHeight(val) {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj) return;
    obj.scaleToHeight(val);
    obj.setCoords();
    fc.renderAll();
    FB.design.history.push();
  }

  function flip(axis) {
    var fc = FB.design.canvas.get();
    var obj = fc.getActiveObject();
    if (!obj) return;
    obj.set("flip" + axis, !obj["flip" + axis]);
    fc.renderAll();
    FB.design.history.push();
  }

  function setCanvasBg(val) {
    var fc = FB.design.canvas.get();
    fc.setBackgroundColor(val, function () {
      fc.renderAll();
      FB.design.history.push();
    });
  }

  return {
    render: render,
    setProp: setProp,
    setPropXY: setPropXY,
    setWidth: setWidth,
    setHeight: setHeight,
    flip: flip,
    setCanvasBg: setCanvasBg,
  };
})();

FB.design.align = (function () {
  function run(action) {
    var fc = FB.design.canvas.get();
    var objs = fc.getActiveObjects();
    if (!objs.length) return;
    var cW = fc.getWidth(),
      cH = fc.getHeight();

    objs.forEach(function (obj) {
      var w = obj.getScaledWidth(),
        h = obj.getScaledHeight();
      if (action === "left") obj.set("left", 0);
      if (action === "centerH") obj.set("left", cW / 2 - w / 2);
      if (action === "right") obj.set("left", cW - w);
      if (action === "top") obj.set("top", 0);
      if (action === "centerV") obj.set("top", cH / 2 - h / 2);
      if (action === "bottom") obj.set("top", cH - h);
      if (action === "bringForward") fc.bringForward(obj);
      if (action === "sendBack") fc.sendBackwards(obj);
      if (action === "bringToFront") fc.bringToFront(obj);
      if (action === "sendToBack") fc.sendToBack(obj);
      obj.setCoords();
    });

    if (action === "distributeH" && objs.length >= 3) {
      var sorted = objs.slice().sort(function (a, b) {
        return a.left - b.left;
      });
      var totalW = sorted.reduce(function (s, o) {
        return s + o.getScaledWidth();
      }, 0);
      var gap =
        (sorted[sorted.length - 1].left +
          sorted[sorted.length - 1].getScaledWidth() -
          sorted[0].left -
          totalW) /
        (sorted.length - 1);
      var x = sorted[0].left;
      sorted.forEach(function (o) {
        o.set("left", x);
        x += o.getScaledWidth() + gap;
        o.setCoords();
      });
    }

    if (action === "distributeV" && objs.length >= 3) {
      var sortedV = objs.slice().sort(function (a, b) {
        return a.top - b.top;
      });
      var totalH = sortedV.reduce(function (s, o) {
        return s + o.getScaledHeight();
      }, 0);
      var gapV =
        (sortedV[sortedV.length - 1].top +
          sortedV[sortedV.length - 1].getScaledHeight() -
          sortedV[0].top -
          totalH) /
        (sortedV.length - 1);
      var y = sortedV[0].top;
      sortedV.forEach(function (o) {
        o.set("top", y);
        y += o.getScaledHeight() + gapV;
        o.setCoords();
      });
    }

    fc.renderAll();
    FB.design.layers.render();
  }

  return { run: run };
})();

FB.design.library = (function () {
  var _currentName = "Untitled";

  function save() {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var name = prompt("Save design as:", _currentName);
    if (!name) return;
    _currentName = name;
    var thumbnail = fc.toDataURL({
      format: "png",
      multiplier: Math.min(1, 320 / fc.getWidth()),
    });
    var payload = {
      name: name,
      width: fc.getWidth(),
      height: fc.getHeight(),
      thumbnail: thumbnail,
      fabric: fc.toJSON(["name"]),
    };
    fetch("/api/designs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        if (d.ok) {
          FB.util.showToast("Saved: " + name);
        }
      });
  }

  function openPicker() {
    fetch("/api/designs")
      .then(function (r) {
        return r.json();
      })
      .then(function (list) {
        var grid = document.getElementById("ds-library-grid");
        var esc = FB.design._esc;
        grid.innerHTML = list.length
          ? list
              .map(function (d) {
                return (
                  '<div class="ds-template-thumb" onclick="FB.design.library.loadDesign(\'' +
                  esc(d.slug) +
                  "')\">" +
                  (d.thumbnail
                    ? '<img src="' +
                      esc(d.thumbnail) +
                      '" alt="' +
                      esc(d.name) +
                      '">'
                    : '<div style="height:80px;background:#1a1a2a"></div>') +
                  '<div class="ds-thumb-label">' +
                  esc(d.name) +
                  "</div></div>"
                );
              })
              .join("")
          : '<p style="color:#666;padding:16px;font-size:12px">No saved designs yet.</p>';
        document.getElementById("ds-library-overlay").style.display = "flex";
      });
  }

  function closePicker() {
    document.getElementById("ds-library-overlay").style.display = "none";
  }

  function loadDesign(slug) {
    if (!confirm("Load this design? Unsaved changes will be lost.")) return;
    fetch("/api/designs/" + slug)
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        var fc = FB.design.canvas.get();
        fc.setWidth(d.width);
        fc.setHeight(d.height);
        FB.design.history.silent(function () {
          fc.loadFromJSON(d.fabric, function () {
            fc.renderAll();
            FB.design.layers.render();
            FB.design.props.render();
            _currentName = d.name;
            FB.design.history.push();
            closePicker();
            FB.util.showToast("Loaded: " + d.name);
          });
        });
      });
  }

  function exportPNG() {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var url = fc.toDataURL({ format: "png", multiplier: 1 });
    var a = document.createElement("a");
    a.href = url;
    a.download = (_currentName || "design") + ".png";
    a.click();
  }

  function exportSVG() {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var svg = fc.toSVG();
    var blob = new Blob([svg], { type: "image/svg+xml" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = (_currentName || "design") + ".svg";
    a.click();
  }

  function insertIntoPage() {
    var fc = FB.design.canvas.get();
    if (!fc) return;
    var dataUrl = fc.toDataURL({ format: "png", multiplier: 1 });
    FB.panels.setMode("builder");
    FB.state.saveHistory();
    FB.state.blocks.push({
      id: FB.state.genId(),
      type: "imageBlock",
      props: { src: dataUrl, alt: _currentName, objectFit: "contain" },
    });
    FB.canvas.render();
    FB.util.showToast("Design inserted as image block");
  }

  return {
    save: save,
    openPicker: openPicker,
    closePicker: closePicker,
    loadDesign: loadDesign,
    exportPNG: exportPNG,
    exportSVG: exportSVG,
    insertIntoPage: insertIntoPage,
  };
})();

FB.design.templates = (function () {
  function open() {
    var grid = document.getElementById("ds-template-grid");
    var list = FB.design.TEMPLATES || [];
    grid.innerHTML = list
      .map(function (t) {
        return (
          '<div class="ds-template-thumb" onclick="FB.design.templates.load(\'' +
          t.key +
          "')\">" +
          '<div style="height:80px;background:#1a1a2a;display:flex;align-items:center;justify-content:center;font-size:10px;color:#666">' +
          t.width +
          "×" +
          t.height +
          "</div>" +
          '<div class="ds-thumb-label">' +
          t.name +
          "</div></div>"
        );
      })
      .join("");
    document.getElementById("ds-template-overlay").style.display = "flex";
  }

  function close() {
    document.getElementById("ds-template-overlay").style.display = "none";
  }

  function load(key) {
    var tpl = (FB.design.TEMPLATES || []).filter(function (t) {
      return t.key === key;
    })[0];
    if (!tpl) return;
    var fc = FB.design.canvas.get();
    if (
      fc.getObjects().length &&
      !confirm("Replace current canvas with this template?")
    )
      return;
    fc.setWidth(tpl.width);
    fc.setHeight(tpl.height);
    FB.design.history.silent(function () {
      fc.loadFromJSON(tpl.fabric, function () {
        fc.renderAll();
        FB.design.layers.render();
        FB.design.canvas.zoomFit();
        FB.design.history.push();
        close();
      });
    });
  }

  return { open: open, close: close, load: load };
})();

FB.design.ai = (function () {
  function open() {
    document.getElementById("ds-ai-overlay").style.display = "flex";
    document.getElementById("ds-ai-status").textContent = "";
  }

  function close() {
    document.getElementById("ds-ai-overlay").style.display = "none";
  }

  function generate() {
    var prompt = document.getElementById("ds-ai-prompt").value.trim();
    if (!prompt) return;
    var status = document.getElementById("ds-ai-status");
    status.textContent = "Generating…";

    fetch("/api/ai-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt }),
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        if (d.error) {
          status.textContent = "Error: " + d.error;
          return;
        }
        status.textContent = "Placing image…";
        fabric.Image.fromURL(d.url, function (img) {
          var fc = FB.design.canvas.get();
          var maxW = fc.getWidth() * 0.6;
          if (img.width > maxW) img.scaleToWidth(maxW);
          img.set({
            left: fc.getWidth() / 2 - img.getScaledWidth() / 2,
            top: fc.getHeight() / 2 - img.getScaledHeight() / 2,
            name: "AI: " + prompt.slice(0, 30),
          });
          fc.add(img);
          fc.setActiveObject(img);
          fc.renderAll();
          close();
          FB.util.showToast("AI image added to canvas");
        });
      })
      .catch(function (err) {
        status.textContent = "Request failed: " + err.message;
      });
  }

  return { open: open, close: close, generate: generate };
})();
