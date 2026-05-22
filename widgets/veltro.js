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

// ── 1. KINETIC TYPOGRAPHY ──
FB.widgets.register("kineticText", {
  label: "Kinetic Text",
  sublabel: "Variable font",
  icon: "K",
  iconBg: "#0d0d1a",
  iconColor: "#cdfe00",
  category: "veltro",
  defaultProps: {
    text: "MOVE CLOSER",
    tag: "h2",
    mode: "proximity",
    color: "#111111",
    size: 56,
    weight: 400,
    minWeight: 100,
    maxWeight: 900,
    radius: 300,
    fontFamily: "Inter",
    letterSpacing: -2,
    align: "center",
  },
  render: function (p) {
    var tag = p.tag || "h2";
    var font = p.fontFamily || "Inter";
    var style =
      "text-align:" +
      (p.align || "center") +
      ";" +
      "color:" +
      (p.color || "#111") +
      ";" +
      "font-size:" +
      (p.size || 56) +
      "px;" +
      "font-weight:" +
      (p.weight || 400) +
      ";" +
      "letter-spacing:" +
      (p.letterSpacing !== undefined ? p.letterSpacing : -2) +
      "px;" +
      "line-height:1.1;" +
      "margin:0;padding:1.5rem 1.5rem;" +
      "transition:font-variation-settings 0.1s,font-weight 0.1s;" +
      "font-family:'" +
      font +
      "',sans-serif;";
    if (p.mode === "scroll") {
      style += "display:block;";
      return (
        "<" +
        tag +
        ' class="veltro-kinetic-scroll" data-kinetic-mode="scroll"' +
        ' data-base-weight="' +
        (p.weight || 400) +
        '"' +
        ' data-min-weight="' +
        (p.minWeight || 100) +
        '"' +
        ' data-max-weight="' +
        (p.maxWeight || 900) +
        '"' +
        ' style="' +
        style +
        '" contenteditable data-field="text">' +
        (p.text || "") +
        "</" +
        tag +
        ">"
      );
    }
    if (p.mode === "path") {
      var id = "kt-path-" + Date.now();
      return (
        '<div style="padding:1rem;text-align:center">' +
        '<svg viewBox="0 0 600 200" style="width:100%;max-width:600px;overflow:visible">' +
        "<defs>" +
        '<path id="' +
        id +
        '" d="M 0 150 Q 150 0 300 100 Q 450 200 600 50"/>' +
        "</defs>" +
        "<text font-family=\"'" +
        font +
        '\',sans-serif" font-size="' +
        (p.size || 40) +
        '"' +
        ' font-weight="' +
        (p.weight || 400) +
        '" fill="' +
        (p.color || "#111") +
        '">' +
        '<textPath href="#' +
        id +
        '" startOffset="0%">' +
        (p.text || "Text on a path") +
        "</textPath></text></svg></div>"
      );
    }
    // Default: proximity mode
    return (
      "<" +
      tag +
      ' class="veltro-kinetic-prox" data-kinetic-mode="proximity"' +
      ' data-kinetic-radius="' +
      (p.radius || 300) +
      '"' +
      ' data-kinetic-min-weight="' +
      (p.minWeight || 100) +
      '"' +
      ' data-kinetic-max-weight="' +
      (p.maxWeight || 900) +
      '"' +
      ' style="' +
      style +
      '" contenteditable data-field="text">' +
      (p.text || "") +
      "</" +
      tag +
      ">"
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Text</label><input type="text" value="' +
      (p.text || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','text',this.value)\"></div>" +
      '<div class="rp-row"><label>Mode</label>' +
      "<select onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','mode',this.value)\">" +
      ["proximity", "scroll", "path"]
        .map(function (m) {
          return (
            '<option value="' +
            m +
            '"' +
            (p.mode === m ? " selected" : "") +
            ">" +
            m.charAt(0).toUpperCase() +
            m.slice(1) +
            "</option>"
          );
        })
        .join("") +
      "</select></div>" +
      '<div class="rp-row"><label>Tag</label>' +
      "<select onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','tag',this.value)\">" +
      ["h1", "h2", "h3", "h4", "p", "div"]
        .map(function (t) {
          return (
            '<option value="' +
            t +
            '"' +
            (p.tag === t ? " selected" : "") +
            ">" +
            t.toUpperCase() +
            "</option>"
          );
        })
        .join("") +
      "</select></div>" +
      '<div class="rp-row"><label>Font Family</label>' +
      "<select onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','fontFamily',this.value)\">" +
      (
        FB.panels.GOOGLE_FONTS || [
          "Inter",
          "Roboto",
          "Oswald",
          "Bebas Neue",
          "Playfair Display",
        ]
      )
        .map(function (f) {
          return (
            '<option value="' +
            f +
            '"' +
            (p.fontFamily === f ? " selected" : "") +
            ">" +
            (f || "— default —") +
            "</option>"
          );
        })
        .join("") +
      "</select></div>" +
      '<div class="rp-row"><label>Colour</label>' +
      '<input type="color" value="' +
      (p.color || "#111111") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color',this.value)\"></div>" +
      '<div class="rp-row"><label>Size: ' +
      (p.size || 56) +
      "px</label>" +
      '<input type="range" min="16" max="180" value="' +
      (p.size || 56) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','size',+this.value);this.previousElementSibling.textContent='Size: '+this.value+'px'\"></div>" +
      '<div class="rp-row"><label>Base Weight: ' +
      (p.weight || 400) +
      "</label>" +
      '<input type="range" min="100" max="900" step="100" value="' +
      (p.weight || 400) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','weight',+this.value);this.previousElementSibling.textContent='Base Weight: '+this.value\"></div>" +
      (p.mode === "proximity"
        ? '<div class="rp-row"><label>Min Weight: ' +
          (p.minWeight || 100) +
          "</label>" +
          '<input type="range" min="100" max="900" step="100" value="' +
          (p.minWeight || 100) +
          '" oninput="FB.panels.updateWidgetProp(\'' +
          id +
          "','minWeight',+this.value);this.previousElementSibling.textContent='Min Weight: '+this.value\"></div>" +
          '<div class="rp-row"><label>Max Weight: ' +
          (p.maxWeight || 900) +
          "</label>" +
          '<input type="range" min="100" max="900" step="100" value="' +
          (p.maxWeight || 900) +
          '" oninput="FB.panels.updateWidgetProp(\'' +
          id +
          "','maxWeight',+this.value);this.previousElementSibling.textContent='Max Weight: '+this.value\"></div>" +
          '<div class="rp-row"><label>Effect Radius: ' +
          (p.radius || 300) +
          "px</label>" +
          '<input type="range" min="50" max="800" step="10" value="' +
          (p.radius || 300) +
          '" oninput="FB.panels.updateWidgetProp(\'' +
          id +
          "','radius',+this.value);this.previousElementSibling.textContent='Effect Radius: '+this.value+'px'\"></div>"
        : "") +
      '<div class="rp-row"><label>Letter Spacing: ' +
      (p.letterSpacing !== undefined ? p.letterSpacing : -2) +
      "px</label>" +
      '<input type="range" min="-10" max="20" step="0.5" value="' +
      (p.letterSpacing !== undefined ? p.letterSpacing : -2) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','letterSpacing',+this.value);this.previousElementSibling.textContent='Letter Spacing: '+this.value+'px'\"></div>"
    );
  },
});

// ── 2. PHYSICS SANDBOX ──
FB.widgets.register("physicsSandbox", {
  label: "Physics Sandbox",
  sublabel: "Matter.js",
  icon: "⊛",
  iconBg: "#1a0d2e",
  iconColor: "#ff6b35",
  category: "veltro",
  defaultProps: {
    height: 400,
    gravity: 1,
    restitution: 0.7,
    friction: 0.05,
    items: ["Veltro", "Design", "Physics", "Motion", "Web"],
    bgColor: "#0d0d1a",
    textColor: "#cdfe00",
    wallColor: "#1a1a2e",
  },
  render: function (p) {
    var wid = "phys-" + (p._blockId || Date.now());
    var itemsJson = JSON.stringify(p.items || ["Veltro", "Physics"]);
    return (
      '<div class="veltro-physics-wrap" id="' +
      wid +
      '" data-gravity="' +
      (p.gravity || 1) +
      '"' +
      ' data-restitution="' +
      (p.restitution || 0.7) +
      '" data-friction="' +
      (p.friction || 0.05) +
      '"' +
      " data-items='" +
      itemsJson.replace(/'/g, "&#39;") +
      "'" +
      ' data-text-color="' +
      (p.textColor || "#cdfe00") +
      '"' +
      ' style="height:' +
      (p.height || 400) +
      "px;background:" +
      (p.bgColor || "#0d0d1a") +
      ';position:relative;overflow:hidden;cursor:pointer;border-radius:4px;">' +
      '<canvas class="veltro-physics-canvas" style="position:absolute;inset:0;width:100%;height:100%"></canvas>' +
      '<div class="veltro-physics-labels" style="position:absolute;inset:0;pointer-events:none"></div>' +
      '<div style="position:absolute;bottom:8px;right:10px;font-size:10px;color:' +
      (p.textColor || "#cdfe00") +
      ';opacity:0.4;letter-spacing:1px">CLICK TO INTERACT</div>' +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Items (one per line)</label>' +
      '<textarea rows="5" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','items',this.value.split('\\n').filter(function(s){return s.trim()}))\">" +
      (p.items || []).join("\n") +
      "</textarea></div>" +
      '<div class="rp-row"><label>Height: ' +
      (p.height || 400) +
      "px</label>" +
      '<input type="range" min="200" max="800" step="20" value="' +
      (p.height || 400) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value);this.previousElementSibling.textContent='Height: '+this.value+'px'\"></div>" +
      '<div class="rp-row"><label>Gravity: ' +
      (p.gravity || 1) +
      "</label>" +
      '<input type="range" min="0" max="3" step="0.1" value="' +
      (p.gravity || 1) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','gravity',+this.value);this.previousElementSibling.textContent='Gravity: '+this.value\"></div>" +
      '<div class="rp-row"><label>Bounciness: ' +
      (p.restitution || 0.7) +
      "</label>" +
      '<input type="range" min="0" max="1" step="0.05" value="' +
      (p.restitution || 0.7) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','restitution',+this.value);this.previousElementSibling.textContent='Bounciness: '+this.value\"></div>" +
      '<div class="rp-row"><label>Background</label>' +
      '<input type="color" value="' +
      (p.bgColor || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgColor',this.value)\"></div>" +
      '<div class="rp-row"><label>Label Colour</label>' +
      '<input type="color" value="' +
      (p.textColor || "#cdfe00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textColor',this.value)\"></div>"
    );
  },
});

// ── Physics Sandbox Initializer ──
// Called after render — scans for un-initialized physics wraps.
window._VeltroInitPhysics = function () {
  document
    .querySelectorAll(".veltro-physics-wrap:not([data-physics-init])")
    .forEach(function (wrap) {
      wrap.dataset.physicsInit = "1";

      window._VeltroLoadMatter(function (Matter) {
        var W = wrap.offsetWidth;
        var H = wrap.offsetHeight || 400;
        var gravity = +(wrap.dataset.gravity || 1);
        var restitution = +(wrap.dataset.restitution || 0.7);
        var friction = +(wrap.dataset.friction || 0.05);
        var items = JSON.parse(wrap.dataset.items || '["Veltro","Physics"]');
        var tc = wrap.dataset.textColor || "#cdfe00";

        var engine = Matter.Engine.create({ gravity: { y: gravity } });
        var runner = Matter.Runner.create();
        var opts = {
          restitution: restitution,
          friction: friction,
          chamfer: { radius: 12 },
        };

        var bodies = items.map(function (txt, i) {
          return Matter.Bodies.rectangle(
            W / 2 + (Math.random() - 0.5) * W * 0.6,
            H * 0.1 + i * 30,
            txt.length * 14 + 40,
            44,
            Object.assign({ label: txt }, opts),
          );
        });

        var walls = [
          Matter.Bodies.rectangle(W / 2, H + 25, W * 2, 50, {
            isStatic: true,
            label: "floor",
          }),
          Matter.Bodies.rectangle(-25, H / 2, 50, H * 2, { isStatic: true }),
          Matter.Bodies.rectangle(W + 25, H / 2, 50, H * 2, { isStatic: true }),
          Matter.Bodies.rectangle(W / 2, -25, W * 2, 50, { isStatic: true }),
        ];

        Matter.Composite.add(engine.world, bodies.concat(walls));
        Matter.Runner.run(runner, engine);

        var labels = wrap.querySelector(".veltro-physics-labels");

        (function loop() {
          if (!wrap.isConnected) {
            Matter.Runner.stop(runner);
            Matter.Engine.clear(engine);
            return;
          }
          bodies.forEach(function (b) {
            var el = labels.querySelector('[data-bid="' + b.id + '"]');
            if (!el) {
              el = document.createElement("div");
              el.dataset.bid = b.id;
              el.style.cssText =
                "position:absolute;padding:4px 14px;border-radius:24px;font-size:13px;font-weight:700;letter-spacing:1px;user-select:none;transform-origin:center;background:rgba(255,255,255,0.05);border:1px solid " +
                tc +
                ";color:" +
                tc +
                ";white-space:nowrap;font-family:'Inter',sans-serif;";
              el.textContent = b.label;
              labels.appendChild(el);
            }
            var hw = el.offsetWidth / 2,
              hh = el.offsetHeight / 2;
            el.style.left = b.position.x - hw + "px";
            el.style.top = b.position.y - hh + "px";
            el.style.transform = "rotate(" + b.angle + "rad)";
          });
          requestAnimationFrame(loop);
        })();

        wrap.addEventListener("click", function (e) {
          var rect = wrap.getBoundingClientRect();
          var mx = e.clientX - rect.left,
            my = e.clientY - rect.top;
          bodies.forEach(function (b) {
            var dx = b.position.x - mx,
              dy = b.position.y - my;
            var dist = Math.hypot(dx, dy);
            if (dist < 200) {
              Matter.Body.applyForce(b, b.position, {
                x: (dx / dist) * 0.05,
                y: (dy / dist) * 0.05 - 0.04,
              });
            }
          });
        });
      });
    });
};

// ── 3. WEBGL FLUID SHADER ──
FB.widgets.register("shaderBg", {
  label: "Fluid Shader",
  sublabel: "WebGL background",
  icon: "≋",
  iconBg: "#0a0a1a",
  iconColor: "#ff6b35",
  category: "veltro",
  defaultProps: {
    height: 500,
    speed: 0.8,
    colorA: "#0d0520",
    colorB: "#d95818",
    colorC: "#140a38",
    waveScale: 8,
    mouseInteraction: true,
    content: "",
  },
  render: function (p) {
    var cid = "shader-" + (p._blockId || Date.now());
    return (
      '<div style="position:relative;height:' +
      (p.height || 500) +
      'px;overflow:hidden">' +
      '<canvas id="' +
      cid +
      '"' +
      ' data-shader-bg="true"' +
      ' data-ca="' +
      (p.colorA || "#0d0520") +
      '"' +
      ' data-cb="' +
      (p.colorB || "#d95818") +
      '"' +
      ' data-cc="' +
      (p.colorC || "#140a38") +
      '"' +
      ' data-speed="' +
      (p.speed || 0.8) +
      '"' +
      ' data-ws="' +
      (p.waveScale || 8) +
      '"' +
      ' data-mouse="' +
      (p.mouseInteraction !== false ? "1" : "0") +
      '"' +
      ' style="position:absolute;inset:0;width:100%;height:100%"></canvas>' +
      (p.content
        ? '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:2">' +
          p.content +
          "</div>"
        : "") +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Height: <span>' +
      (p.height || 500) +
      "px</span></label>" +
      '<input type="range" min="100" max="900" step="20" value="' +
      (p.height || 500) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value);this.previousElementSibling.querySelector('span').textContent=this.value+'px'\"></div>" +
      '<div class="rp-row"><label>Speed: <span>' +
      (p.speed || 0.8) +
      "</span></label>" +
      '<input type="range" min="0.1" max="3" step="0.1" value="' +
      (p.speed || 0.8) +
      '" oninput="FB.panels.updateShaderProp(\'' +
      id +
      "','speed',+this.value);this.previousElementSibling.querySelector('span').textContent=this.value\"></div>" +
      '<div class="rp-row"><label>Wave Scale: <span>' +
      (p.waveScale || 8) +
      "</span></label>" +
      '<input type="range" min="2" max="30" step="1" value="' +
      (p.waveScale || 8) +
      '" oninput="FB.panels.updateShaderProp(\'' +
      id +
      "','waveScale',+this.value);this.previousElementSibling.querySelector('span').textContent=this.value\"></div>" +
      '<div class="rp-row"><label>Colour A (base)</label>' +
      '<input type="color" value="' +
      (p.colorA || "#0d0520") +
      '" onchange="FB.panels.updateShaderProp(\'' +
      id +
      "','colorA',this.value)\"></div>" +
      '<div class="rp-row"><label>Colour B (mouse aura)</label>' +
      '<input type="color" value="' +
      (p.colorB || "#d95818") +
      '" onchange="FB.panels.updateShaderProp(\'' +
      id +
      "','colorB',this.value)\"></div>" +
      '<div class="rp-row"><label>Colour C (wave tint)</label>' +
      '<input type="color" value="' +
      (p.colorC || "#140a38") +
      '" onchange="FB.panels.updateShaderProp(\'' +
      id +
      "','colorC',this.value)\"></div>" +
      '<div class="rp-row"><label><input type="checkbox"' +
      (p.mouseInteraction !== false ? " checked" : "") +
      " onchange=\"FB.panels.updateShaderProp('" +
      id +
      "','mouseInteraction',this.checked)\"> Mouse interaction</label></div>"
    );
  },
});

// ── 4. CURSOR AURA LENS ──
FB.widgets.register("cursorLens", {
  label: "Cursor Lens",
  sublabel: "Reveal effect",
  icon: "◎",
  iconBg: "#1a0a0a",
  iconColor: "#ff6b35",
  category: "veltro",
  defaultProps: {
    height: 400,
    radius: 140,
    bgFront: "#f5f5f5",
    bgBack: "#0d0d1a",
    frontContent:
      "<h2 style='color:#111;font-size:3rem;font-weight:800;margin:0'>REVEAL</h2>",
    backContent:
      "<h2 style='color:#cdfe00;font-size:3rem;font-weight:800;margin:0'>HIDDEN</h2>",
    blendMode: "normal",
    cursor: "none",
  },
  render: function (p) {
    var r = p.radius || 140;
    return (
      '<div class="veltro-lens-wrap" style="position:relative;height:' +
      (p.height || 400) +
      "px;overflow:hidden;cursor:" +
      (p.cursor || "none") +
      ';border-radius:4px;">' +
      // Back layer
      '<div class="veltro-lens-back" style="position:absolute;inset:0;background:' +
      (p.bgBack || "#0d0d1a") +
      ';display:flex;align-items:center;justify-content:center">' +
      (p.backContent || "") +
      "</div>" +
      // Front layer with mask
      '<div class="veltro-lens-front" style="position:absolute;inset:0;background:' +
      (p.bgFront || "#f5f5f5") +
      ';display:flex;align-items:center;justify-content:center">' +
      (p.frontContent || "") +
      "</div>" +
      '<div class="veltro-lens-mask" style="' +
      "--lx:50%;--ly:50%;" +
      "position:absolute;inset:0;pointer-events:none;" +
      "background:" +
      (p.bgFront || "#f5f5f5") +
      ";" +
      "display:flex;align-items:center;justify-content:center;" +
      "mask-image:radial-gradient(circle " +
      r +
      "px at var(--lx) var(--ly),transparent 100%,black 100%);" +
      "-webkit-mask-image:radial-gradient(circle " +
      r +
      "px at var(--lx) var(--ly),transparent 100%,black 100%);" +
      "mix-blend-mode:" +
      (p.blendMode || "normal") +
      '">' +
      (p.frontContent || "") +
      "</div>" +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Height: ' +
      (p.height || 400) +
      "px</label>" +
      '<input type="range" min="150" max="800" step="20" value="' +
      (p.height || 400) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value);this.previousElementSibling.textContent='Height: '+this.value+'px'\"></div>" +
      '<div class="rp-row"><label>Lens Radius: ' +
      (p.radius || 140) +
      "px</label>" +
      '<input type="range" min="40" max="400" step="10" value="' +
      (p.radius || 140) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','radius',+this.value);this.previousElementSibling.textContent='Lens Radius: '+this.value+'px'\"></div>" +
      '<div class="rp-row"><label>Front Background</label>' +
      '<input type="color" value="' +
      (p.bgFront || "#f5f5f5") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgFront',this.value)\"></div>" +
      '<div class="rp-row"><label>Back Background</label>' +
      '<input type="color" value="' +
      (p.bgBack || "#0d0d1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgBack',this.value)\"></div>" +
      '<div class="rp-row"><label>Front Content (HTML)</label>' +
      '<textarea rows="3" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','frontContent',this.value)\">" +
      (p.frontContent || "") +
      "</textarea></div>" +
      '<div class="rp-row"><label>Back Content (HTML)</label>' +
      '<textarea rows="3" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','backContent',this.value)\">" +
      (p.backContent || "") +
      "</textarea></div>" +
      '<div class="rp-row"><label>Blend Mode</label>' +
      "<select onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','blendMode',this.value)\">" +
      ["normal", "difference", "exclusion", "screen", "multiply"]
        .map(function (m) {
          return (
            '<option value="' +
            m +
            '"' +
            ((p.blendMode || "normal") === m ? " selected" : "") +
            ">" +
            m +
            "</option>"
          );
        })
        .join("") +
      "</select></div>"
    );
  },
});

// ── 5. INFINITE CANVAS ──
FB.widgets.register("infiniteCanvas", {
  label: "Infinite Canvas",
  sublabel: "Pan · Zoom · Depth",
  icon: "∞",
  iconBg: "#050510",
  iconColor: "#7c3aed",
  category: "veltro",
  defaultProps: {
    height: 600,
    bgColor: "#0d0d0d",
    showGrid: true,
    gridColor: "#ffffff",
    gridOpacity: 0.07,
    gridSize: 40,
    showCoords: true,
    minZoom: 0.15,
    maxZoom: 3.0,
    items: [
      {
        x: -500,
        y: -200,
        depthFactor: 0.25,
        content:
          '<div style="width:1800px;height:1200px;border:1px solid rgba(255,255,255,0.05);border-radius:24px"></div>',
      },
      {
        x: 60,
        y: 60,
        depthFactor: 1.0,
        content:
          '<h2 style="color:#fff;font-size:76px;font-weight:900;margin:0;white-space:nowrap;letter-spacing:-0.04em;line-height:1.05">EXPLORE<br>THE SPACE</h2>',
      },
      {
        x: 560,
        y: 280,
        depthFactor: 1.35,
        content:
          '<div style="padding:28px 32px;background:#fff;color:#000;border-radius:16px;max-width:260px;box-shadow:0 20px 60px rgba(0,0,0,0.5)"><p style="margin:0;font-size:14px;line-height:1.6;color:#444">Drag to pan. Pinch or Ctrl+scroll to zoom. Items have depth — they move at different speeds.</p></div>',
      },
      {
        x: -180,
        y: 460,
        depthFactor: 0.65,
        content:
          '<div style="color:rgba(255,255,255,0.1);font-size:88px;font-weight:900;white-space:nowrap;letter-spacing:-0.03em">DEPTH LAYER</div>',
      },
      {
        x: 820,
        y: 80,
        depthFactor: 1.55,
        content:
          '<div style="width:100px;height:100px;background:#cdfe00;border-radius:50%;box-shadow:0 0 60px rgba(205,254,0,0.4)"></div>',
      },
    ],
  },
  render: function (p) {
    var vid = "ic-" + (p._blockId || Date.now());
    var items = p.items || [];
    var gs = p.gridSize || 40;
    var gc = p.gridColor || "#ffffff";
    var go = p.gridOpacity !== undefined ? p.gridOpacity : 0.07;

    var gridDiv =
      p.showGrid !== false
        ? '<div style="position:absolute;left:-5000px;top:-5000px;width:12000px;height:12000px;' +
          "background-image:radial-gradient(" +
          gc +
          " 1px,transparent 1px);" +
          "background-size:" +
          gs +
          "px " +
          gs +
          "px;opacity:" +
          go +
          ';pointer-events:none"></div>'
        : "";

    var nodesHtml = items
      .map(function (item) {
        return (
          '<div class="veltro-ic-node" data-depth-factor="' +
          (item.depthFactor !== undefined ? item.depthFactor : 1) +
          '" style="position:absolute;left:' +
          (item.x || 0) +
          "px;top:" +
          (item.y || 0) +
          'px;will-change:transform">' +
          (item.content || "") +
          "</div>"
        );
      })
      .join("");

    return (
      '<div id="' +
      vid +
      '" data-infinite-canvas="true"' +
      ' data-min-zoom="' +
      (p.minZoom || 0.15) +
      '" data-max-zoom="' +
      (p.maxZoom || 3.0) +
      '" style="position:relative;height:' +
      (p.height || 600) +
      "px;overflow:hidden;background:" +
      (p.bgColor || "#0d0d0d") +
      ';border-radius:4px;user-select:none">' +
      '<div class="veltro-ic-world" style="position:absolute;top:0;left:0;width:0;height:0;transform-origin:0 0;will-change:transform">' +
      gridDiv +
      nodesHtml +
      "</div>" +
      (p.showCoords !== false
        ? '<div class="veltro-ic-coords" style="position:absolute;bottom:14px;left:16px;' +
          "font-family:monospace;font-size:11px;color:rgba(255,255,255,0.3);" +
          'pointer-events:none;letter-spacing:1px;z-index:10">X: 0  Y: 0  100%</div>'
        : "") +
      '<div style="position:absolute;bottom:14px;right:14px;font-size:10px;' +
      "color:rgba(255,255,255,0.18);pointer-events:none;letter-spacing:1px;" +
      'font-family:monospace">DRAG · PINCH · SCROLL</div>' +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var items = p.items || [];
    var itemsHtml = items
      .map(function (item, i) {
        return (
          '<div style="margin-bottom:8px;padding:10px;background:var(--surface-3);border-radius:6px;border:1px solid var(--border)">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">' +
          '<span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--accent)">Node ' +
          (i + 1) +
          "</span>" +
          '<button class="rp-btn" style="font-size:10px;padding:2px 6px;color:#e88;border-color:#955"' +
          " onclick=\"FB.panels.removeInfiniteCanvasItem('" +
          id +
          "'," +
          i +
          ')">✕</button>' +
          "</div>" +
          '<div class="rp-row" style="padding:0 0 4px"><label>X</label>' +
          '<input type="number" value="' +
          (item.x || 0) +
          '" step="20" onchange="FB.panels.updateInfiniteCanvasItem(\'' +
          id +
          "'," +
          i +
          ",'x',+this.value)\"></div>" +
          '<div class="rp-row" style="padding:0 0 4px"><label>Y</label>' +
          '<input type="number" value="' +
          (item.y || 0) +
          '" step="20" onchange="FB.panels.updateInfiniteCanvasItem(\'' +
          id +
          "'," +
          i +
          ",'y',+this.value)\"></div>" +
          '<div class="rp-row" style="padding:0 0 4px"><label>Depth: <span>' +
          (item.depthFactor !== undefined ? item.depthFactor : 1.0) +
          "</span></label>" +
          '<input type="range" min="0.1" max="2.0" step="0.05" value="' +
          (item.depthFactor !== undefined ? item.depthFactor : 1.0) +
          '" oninput="FB.panels.updateInfiniteCanvasItem(\'' +
          id +
          "'," +
          i +
          ",'depthFactor',+this.value);this.previousElementSibling.querySelector('span').textContent=(+this.value).toFixed(2)\"></div>" +
          '<div class="rp-row" style="padding:0"><label>Content (HTML)</label>' +
          '<textarea rows="3" onchange="FB.panels.updateInfiniteCanvasItem(\'' +
          id +
          "'," +
          i +
          ",'content',this.value)\">" +
          (item.content || "").replace(/</g, "&lt;").replace(/>/g, "&gt;") +
          "</textarea></div>" +
          "</div>"
        );
      })
      .join("");

    return (
      '<div class="rp-row"><label>Height: <span>' +
      (p.height || 600) +
      "px</span></label>" +
      '<input type="range" min="200" max="900" step="20" value="' +
      (p.height || 600) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value);this.previousElementSibling.querySelector('span').textContent=this.value+'px'\"></div>" +
      '<div class="rp-row"><label>Background</label>' +
      '<input type="color" value="' +
      (p.bgColor || "#0d0d0d") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bgColor',this.value)\"></div>" +
      '<div class="rp-row"><label><input type="checkbox"' +
      (p.showGrid !== false ? " checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','showGrid',this.checked)\"> Show dot grid</label></div>" +
      (p.showGrid !== false
        ? '<div class="rp-row"><label>Grid Colour</label>' +
          '<input type="color" value="' +
          (p.gridColor || "#ffffff") +
          '" onchange="FB.panels.updateWidgetProp(\'' +
          id +
          "','gridColor',this.value)\"></div>" +
          '<div class="rp-row"><label>Grid Opacity: <span>' +
          (p.gridOpacity !== undefined ? p.gridOpacity : 0.07) +
          "</span></label>" +
          '<input type="range" min="0.01" max="0.5" step="0.01" value="' +
          (p.gridOpacity !== undefined ? p.gridOpacity : 0.07) +
          '" oninput="FB.panels.updateWidgetProp(\'' +
          id +
          "','gridOpacity',+this.value);this.previousElementSibling.querySelector('span').textContent=this.value\"></div>"
        : "") +
      '<div class="rp-row"><label>Min Zoom: <span>' +
      (p.minZoom || 0.15) +
      "</span></label>" +
      '<input type="range" min="0.05" max="0.5" step="0.05" value="' +
      (p.minZoom || 0.15) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','minZoom',+this.value);this.previousElementSibling.querySelector('span').textContent=this.value\"></div>" +
      '<div class="rp-row"><label>Max Zoom: <span>' +
      (p.maxZoom || 3.0) +
      "</span></label>" +
      '<input type="range" min="1" max="6" step="0.5" value="' +
      (p.maxZoom || 3.0) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','maxZoom',+this.value);this.previousElementSibling.querySelector('span').textContent=this.value\"></div>" +
      '<div class="rp-row"><label><input type="checkbox"' +
      (p.showCoords !== false ? " checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','showCoords',this.checked)\"> Show coordinate HUD</label></div>" +
      '<div style="padding:8px 14px 4px;border-top:1px solid var(--border);margin-top:6px">' +
      '<div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--text-muted);margin-bottom:8px">Spatial Nodes</div>' +
      itemsHtml +
      '<button class="rp-btn" style="width:calc(100% - 28px);margin:4px 14px 0"' +
      " onclick=\"FB.panels.addInfiniteCanvasItem('" +
      id +
      "')\">" +
      "+ Add Node</button>" +
      "</div>"
    );
  },
});

// ── Scroll-velocity kinetic text driver ──
// Tracks scroll velocity of the canvas container, not window.scrollY
(function () {
  var lastY = 0;
  var lastT = Date.now();
  var container = document.getElementById("canvas");

  function updateKineticScroll() {
    var y = container ? container.scrollTop : window.scrollY;
    var t = Date.now();
    var vel = Math.abs(y - lastY) / Math.max(t - lastT, 1);
    lastY = y;
    lastT = t;
    document.querySelectorAll(".veltro-kinetic-scroll").forEach(function (el) {
      var base = +el.dataset.baseWeight || 400;
      var min = +el.dataset.minWeight || 100;
      var max = +el.dataset.maxWeight || 900;
      var w = Math.round(Math.min(max, Math.max(min, base + vel * 60)));
      el.style.fontVariationSettings = "'wght' " + w;
      el.style.fontWeight = w;
    });
  }

  if (container) {
    container.addEventListener("scroll", updateKineticScroll, {
      passive: true,
    });
  }
  window.addEventListener("scroll", updateKineticScroll, { passive: true });
})();

// ── WebGL Shader Initializer ──
// Called after any canvas render/refresh — scans for un-initialized shader canvases.
window._VeltroInitShaders = function () {
  var FS =
    "precision mediump float;" +
    "uniform float u_t,u_speed,u_ws;" +
    "uniform vec2 u_m,u_r;" +
    "uniform vec3 u_cA,u_cB,u_cC;" +
    "varying vec2 v_uv;" +
    "void main(){" +
    "vec2 st=v_uv,ms=u_m/u_r;" +
    "float w1=sin(st.x*u_ws+u_t*u_speed)*0.12;" +
    "float w2=cos(st.y*u_ws*0.7+u_t*u_speed*0.6)*0.09;" +
    "float w3=sin((st.x+st.y)*u_ws*0.5+u_t*u_speed*1.3)*0.07;" +
    "float d=distance(st+vec2(w1,w2),ms);" +
    "vec3 col=mix(u_cA,u_cB,smoothstep(0.5,0.0,d));" +
    "col=mix(col,u_cC,w3*0.5+0.5);" +
    "gl_FragColor=vec4(col,1.0);}";

  function hex3(h) {
    h = h.replace("#", "");
    return [
      parseInt(h.substring(0, 2), 16) / 255,
      parseInt(h.substring(2, 4), 16) / 255,
      parseInt(h.substring(4, 6), 16) / 255,
    ];
  }

  document
    .querySelectorAll('[data-shader-bg="true"]:not([data-shader-init])')
    .forEach(function (c) {
      c.dataset.shaderInit = "1";
      var gl = c.getContext("webgl") || c.getContext("experimental-webgl");
      if (!gl) return;

      var vs = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(
        vs,
        "attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0,1);}",
      );
      gl.compileShader(vs);

      var fs = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fs, FS);
      gl.compileShader(fs);

      var prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.useProgram(prog);

      var buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      );
      var aPos = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      c._shader = {
        gl: gl,
        uT: gl.getUniformLocation(prog, "u_t"),
        uM: gl.getUniformLocation(prog, "u_m"),
        uR: gl.getUniformLocation(prog, "u_r"),
        uSpeed: gl.getUniformLocation(prog, "u_speed"),
        uWS: gl.getUniformLocation(prog, "u_ws"),
        uCA: gl.getUniformLocation(prog, "u_cA"),
        uCB: gl.getUniformLocation(prog, "u_cB"),
        uCC: gl.getUniformLocation(prog, "u_cC"),
        props: {
          speed: +(c.dataset.speed || 0.8),
          waveScale: +(c.dataset.ws || 8),
          colorA: c.dataset.ca || "#0d0520",
          colorB: c.dataset.cb || "#d95818",
          colorC: c.dataset.cc || "#140a38",
          mouseInteraction: c.dataset.mouse !== "0",
        },
      };

      var t = 0;
      (function loop() {
        if (!c.isConnected) return;
        t += 0.016;
        c.width = c.offsetWidth;
        c.height = c.offsetHeight;
        gl.viewport(0, 0, c.width, c.height);
        var rect = c.getBoundingClientRect();
        var s = c._shader;
        var pr = s.props;
        var vmx = pr.mouseInteraction
          ? window._VeltroMouse.x - rect.left
          : -9999;
        var vmy = pr.mouseInteraction
          ? c.height - (window._VeltroMouse.y - rect.top)
          : -9999;
        gl.uniform1f(s.uT, t);
        gl.uniform2f(s.uM, vmx, vmy);
        gl.uniform2f(s.uR, c.width, c.height);
        gl.uniform1f(s.uSpeed, pr.speed);
        gl.uniform1f(s.uWS, pr.waveScale);
        gl.uniform3fv(s.uCA, hex3(pr.colorA));
        gl.uniform3fv(s.uCB, hex3(pr.colorB));
        gl.uniform3fv(s.uCC, hex3(pr.colorC));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        requestAnimationFrame(loop);
      })();
    });
};

// ── Infinite Canvas Initializer ──
// Pan state persists across refreshBlock cycles via _VeltroICState.
window._VeltroICState = window._VeltroICState || {};

window._VeltroInitInfiniteCanvas = function () {
  document
    .querySelectorAll('[data-infinite-canvas="true"]:not([data-ic-init])')
    .forEach(function (viewport) {
      viewport.dataset.icInit = "1";
      var world = viewport.querySelector(".veltro-ic-world");
      var coordsEl = viewport.querySelector(".veltro-ic-coords");
      if (!world) return;

      var blockId = viewport.id.replace("ic-", "");
      var saved = window._VeltroICState[blockId] || {};
      var state = {
        panX: saved.panX || 0,
        panY: saved.panY || 0,
        zoom: saved.zoom || 1,
        isDragging: false,
        startX: 0,
        startY: 0,
        minZoom: +(viewport.dataset.minZoom || 0.15),
        maxZoom: +(viewport.dataset.maxZoom || 3.0),
      };

      viewport.style.cursor = "grab";

      function handleWheel(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.ctrlKey || e.metaKey) {
          var rect = viewport.getBoundingClientRect();
          var cx = e.clientX - rect.left;
          var cy = e.clientY - rect.top;
          var factor = 1 - e.deltaY * 0.005;
          var newZoom = Math.max(
            state.minZoom,
            Math.min(state.maxZoom, state.zoom * factor),
          );
          // Zoom toward cursor position
          state.panX = cx - ((cx - state.panX) * newZoom) / state.zoom;
          state.panY = cy - ((cy - state.panY) * newZoom) / state.zoom;
          state.zoom = newZoom;
        } else {
          state.panX -= e.deltaX;
          state.panY -= e.deltaY;
        }
      }

      function handleMouseDown(e) {
        if (e.button === 0 || e.button === 1) {
          e.preventDefault();
          state.isDragging = true;
          state.startX = e.clientX - state.panX;
          state.startY = e.clientY - state.panY;
          viewport.style.cursor = "grabbing";
        }
      }

      function handleMouseMove(e) {
        if (!state.isDragging) return;
        state.panX = e.clientX - state.startX;
        state.panY = e.clientY - state.startY;
      }

      function handleMouseUp() {
        state.isDragging = false;
        viewport.style.cursor = "grab";
      }

      viewport.addEventListener("wheel", handleWheel, { passive: false });
      viewport.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      var frameCount = 0;
      (function loop() {
        if (!viewport.isConnected) {
          window.removeEventListener("mousemove", handleMouseMove);
          window.removeEventListener("mouseup", handleMouseUp);
          return;
        }

        world.style.transform =
          "translate3d(" +
          state.panX +
          "px," +
          state.panY +
          "px,0) scale(" +
          state.zoom +
          ")";

        // Depth parallax: nodes with depthFactor !== 1 get an extra offset
        world.querySelectorAll(".veltro-ic-node").forEach(function (node) {
          var df = +(node.dataset.depthFactor || 1);
          if (df === 1) return;
          node.style.transform =
            "translate3d(" +
            state.panX * (df - 1) +
            "px," +
            state.panY * (df - 1) +
            "px,0)";
        });

        if (++frameCount % 12 === 0) {
          if (coordsEl) {
            coordsEl.textContent =
              "X: " +
              Math.round(-state.panX) +
              "  Y: " +
              Math.round(-state.panY) +
              "  " +
              Math.round(state.zoom * 100) +
              "%";
          }
          window._VeltroICState[blockId] = {
            panX: state.panX,
            panY: state.panY,
            zoom: state.zoom,
          };
        }

        requestAnimationFrame(loop);
      })();
    });
};
