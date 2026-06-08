// ── Physics Sandbox Initializer ──
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
        var rafId = 0;
        function loop() {
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
          rafId = requestAnimationFrame(loop);
        }
        new IntersectionObserver(
          function (e) {
            if (e[0].isIntersecting) {
              if (!rafId) rafId = requestAnimationFrame(loop);
            } else {
              cancelAnimationFrame(rafId);
              rafId = 0;
            }
          },
          { threshold: 0.01 },
        ).observe(wrap);
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

window._VeltroInitImagePhysics = function () {
  document
    .querySelectorAll(".veltro-iphys-wrap:not([data-iphys-init])")
    .forEach(function (wrap) {
      wrap.dataset.iphysInit = "1";
      var canvas = wrap.querySelector(".veltro-iphys-canvas");
      if (!canvas) return;
      var W = wrap.offsetWidth || 600;
      var H = wrap.offsetHeight || 400;
      canvas.width = W;
      canvas.height = H;
      var ctx = canvas.getContext("2d");
      var gravity = +(wrap.dataset.gravity || 1);
      var restitution = +(wrap.dataset.restitution || 0.5);
      var imageShape = wrap.dataset.imageShape || "square";
      var imageSize = Math.max(
        30,
        Math.min(200, +(wrap.dataset.imageSize || 80)),
      );
      var borderRadius = +(wrap.dataset.imageBorderRadius || 8);
      var borderWidth = +(wrap.dataset.imageBorderWidth || 0);
      var borderColor = wrap.dataset.imageBorderColor || "#ffffff";
      var mouseInteraction = wrap.dataset.mouseInteraction !== "false";
      var mouseForce = +(wrap.dataset.mouseForce || 5);
      var windEnabled = wrap.dataset.windEnabled === "true";
      var windStrength = +(wrap.dataset.windStrength || 0);
      var images = JSON.parse(wrap.dataset.images || "[]");
      var SIZE = imageSize;

      var imgObjs = images.map(function (src) {
        var img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        return img;
      });

      window._VeltroLoadMatter(function (Matter) {
        var engine = Matter.Engine.create({ gravity: { y: gravity } });
        var runner = Matter.Runner.create();
        var opts = {
          restitution: restitution,
          friction: 0.1,
          frictionAir: 0.01,
        };
        var bodies = images.map(function (src, i) {
          var x = W * 0.2 + (i % 3) * (W * 0.3);
          var y = H * 0.1 + Math.floor(i / 3) * SIZE * 1.6;
          if (imageShape === "circle") {
            return Matter.Bodies.circle(x, y, SIZE / 2, opts);
          }
          var polySides = 0;
          if (imageShape === "triangle") polySides = 3;
          else if (imageShape === "pentagon") polySides = 5;
          else if (imageShape === "hexagon") polySides = 6;
          else if (imageShape === "octagon") polySides = 8;
          if (polySides > 0) {
            return Matter.Bodies.polygon(x, y, polySides, SIZE / 2, opts);
          }
          return Matter.Bodies.rectangle(x, y, SIZE, SIZE, opts);
        });
        var walls = [
          Matter.Bodies.rectangle(W / 2, H + 25, W * 2, 50, { isStatic: true }),
          Matter.Bodies.rectangle(-25, H / 2, 50, H * 2, { isStatic: true }),
          Matter.Bodies.rectangle(W + 25, H / 2, 50, H * 2, { isStatic: true }),
          Matter.Bodies.rectangle(W / 2, -25, W * 2, 50, { isStatic: true }),
        ];
        Matter.Composite.add(engine.world, bodies.concat(walls));
        Matter.Runner.run(runner, engine);

        var mousePos = { x: -9999, y: -9999 };
        if (mouseInteraction) {
          canvas.addEventListener("mousemove", function (e) {
            var rect = canvas.getBoundingClientRect();
            mousePos.x = e.clientX - rect.left;
            mousePos.y = e.clientY - rect.top;
          });
          canvas.addEventListener("mouseleave", function () {
            mousePos.x = -9999;
            mousePos.y = -9999;
          });
          canvas.addEventListener("click", function (e) {
            var rect = canvas.getBoundingClientRect();
            var mx = e.clientX - rect.left;
            var my = e.clientY - rect.top;
            bodies.forEach(function (b) {
              var dx = b.position.x - mx;
              var dy = b.position.y - my;
              var dist = Math.hypot(dx, dy);
              if (dist < SIZE * 2 && dist > 0) {
                var f = mouseForce * 0.001;
                Matter.Body.applyForce(b, b.position, {
                  x: (dx / dist) * f,
                  y: (dy / dist) * f - f * 0.5,
                });
              }
            });
          });
        }

        var rafId = 0;
        function loop() {
          if (!wrap.isConnected) {
            Matter.Runner.stop(runner);
            Matter.Engine.clear(engine);
            return;
          }
          var cw = wrap.offsetWidth || 600;
          var ch = wrap.offsetHeight || 400;
          if (cw !== W || ch !== H) {
            W = cw;
            H = ch;
            canvas.width = W;
            canvas.height = H;
            Matter.Body.setPosition(walls[0], { x: W / 2, y: H + 25 });
            Matter.Body.setPosition(walls[1], { x: -25, y: H / 2 });
            Matter.Body.setPosition(walls[2], { x: W + 25, y: H / 2 });
            Matter.Body.setPosition(walls[3], { x: W / 2, y: -25 });
          }
          if (windEnabled && windStrength) {
            bodies.forEach(function (b) {
              Matter.Body.applyForce(b, b.position, {
                x: windStrength * 0.0001,
                y: 0,
              });
            });
          }
          if (mouseInteraction && mousePos.x > -9000) {
            bodies.forEach(function (b) {
              var dx = b.position.x - mousePos.x;
              var dy = b.position.y - mousePos.y;
              var dist = Math.hypot(dx, dy);
              if (dist < SIZE * 1.5 && dist > 0) {
                var f = mouseForce * 0.00005;
                Matter.Body.applyForce(b, b.position, {
                  x: (dx / dist) * f,
                  y: (dy / dist) * f,
                });
              }
            });
          }
          ctx.clearRect(0, 0, W, H);
          bodies.forEach(function (b, i) {
            var img = imgObjs[i];
            if (!img) return;
            var hs = SIZE / 2;
            function drawShape() {
              ctx.beginPath();
              if (imageShape === "circle") {
                ctx.arc(0, 0, hs, 0, Math.PI * 2);
              } else {
                var sides = 4;
                if (imageShape === "triangle") sides = 3;
                else if (imageShape === "pentagon") sides = 5;
                else if (imageShape === "hexagon") sides = 6;
                else if (imageShape === "octagon") sides = 8;
                else if (imageShape === "star") {
                  var outer = hs,
                    inner = hs * 0.4,
                    pts = 5;
                  for (var si = 0; si < pts * 2; si++) {
                    var rad = si % 2 === 0 ? outer : inner;
                    var a = (si * Math.PI) / pts - Math.PI / 2;
                    var px = Math.cos(a) * rad,
                      py = Math.sin(a) * rad;
                    if (si === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                  }
                  ctx.closePath();
                  return;
                } else if (imageShape === "heart") {
                  ctx.moveTo(0, hs * 0.7);
                  ctx.bezierCurveTo(
                    -hs * 0.6,
                    hs * 0.3,
                    -hs,
                    -hs * 0.1,
                    -hs * 0.4,
                    -hs * 0.5,
                  );
                  ctx.bezierCurveTo(
                    -hs * 0.1,
                    -hs * 0.8,
                    0,
                    -hs * 0.4,
                    0,
                    -hs * 0.2,
                  );
                  ctx.bezierCurveTo(
                    0,
                    -hs * 0.4,
                    hs * 0.1,
                    -hs * 0.8,
                    hs * 0.4,
                    -hs * 0.5,
                  );
                  ctx.bezierCurveTo(
                    hs,
                    -hs * 0.1,
                    hs * 0.6,
                    hs * 0.3,
                    0,
                    hs * 0.7,
                  );
                  ctx.closePath();
                  return;
                }
                for (var si = 0; si < sides; si++) {
                  var a = (si * 2 * Math.PI) / sides - Math.PI / 2;
                  var px = Math.cos(a) * hs * 0.9,
                    py = Math.sin(a) * hs * 0.9;
                  if (si === 0) ctx.moveTo(px, py);
                  else ctx.lineTo(px, py);
                }
                ctx.closePath();
              }
            }
            ctx.save();
            ctx.translate(b.position.x, b.position.y);
            ctx.rotate(b.angle);
            ctx.save();
            drawShape();
            ctx.clip();
            if (img.complete && img.naturalWidth) {
              ctx.drawImage(img, -hs, -hs, SIZE, SIZE);
            } else {
              ctx.fillStyle = "rgba(255,255,255,0.1)";
              ctx.fill();
            }
            ctx.restore();
            if (borderWidth > 0) {
              drawShape();
              ctx.strokeStyle = borderColor;
              ctx.lineWidth = borderWidth;
              ctx.stroke();
            }
            ctx.restore();
          });
          rafId = requestAnimationFrame(loop);
        }

        new IntersectionObserver(
          function (e) {
            if (e[0].isIntersecting) {
              if (!rafId) rafId = requestAnimationFrame(loop);
            } else {
              cancelAnimationFrame(rafId);
              rafId = 0;
            }
          },
          { threshold: 0.01 },
        ).observe(wrap);
      });
    });
};

// ── Scroll-velocity kinetic text driver ──
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
      var rafId = 0;
      function loop() {
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
        rafId = requestAnimationFrame(loop);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(loop);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(c);
    });
};

// ── Infinite Canvas Initializer ──
window._VeltroICState = window._VeltroICState || {};
window._VeltroInitInfiniteCanvas = function () {
  document
    .querySelectorAll(".fw-widget-infiniteCanvas:not([data-ic-init])")
    .forEach(function (el) {
      el.setAttribute("data-ic-init", "1");
      var wrap = el.querySelector(".veltro-infinite-wrap");
      var canvas = el.querySelector(".veltro-infinite-canvas");
      if (!wrap || !canvas) return;

      var gridSize = +(wrap.dataset.gridSize || 40);
      var gridColor = wrap.dataset.gridColor || "rgba(255,255,255,0.05)";

      wrap.style.cursor = "grab";
      var state = {
        panX: 0,
        panY: 0,
        zoom: 1,
        isDragging: false,
        startX: 0,
        startY: 0,
      };

      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;

      function resizeCanvas() {
        var rect = wrap.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.setTransform(dpr * state.zoom, 0, 0, dpr * state.zoom, 0, 0);
        canvas.style.width = rect.width + "px";
        canvas.style.height = rect.height + "px";
      }

      function drawGrid() {
        var w = canvas.width / dpr;
        var h = canvas.height / dpr;
        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);
        ctx.restore();

        ctx.save();
        ctx.setTransform(dpr * state.zoom, 0, 0, dpr * state.zoom, dpr * (state.panX % (gridSize * state.zoom)), dpr * (state.panY % (gridSize * state.zoom)));
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1 / state.zoom;

        var offsetX = state.panX / state.zoom;
        var offsetY = state.panY / state.zoom;
        var startX = (-offsetX % gridSize + gridSize) % gridSize;
        var startY = (-offsetY % gridSize + gridSize) % gridSize;

        for (var x = startX; x < w / state.zoom + gridSize; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h / state.zoom + gridSize);
          ctx.stroke();
        }
        for (var y = startY; y < h / state.zoom + gridSize; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w / state.zoom + gridSize, y);
          ctx.stroke();
        }
        ctx.restore();
      }

      function redraw() {
        resizeCanvas();
        drawGrid();
      }

      function handleWheel(e) {
        e.preventDefault();
        e.stopPropagation();
        var rect = wrap.getBoundingClientRect();
        var cx = e.clientX - rect.left;
        var cy = e.clientY - rect.top;
        var factor = 1 - e.deltaY * 0.002;
        var newZoom = Math.max(0.15, Math.min(3.0, state.zoom * factor));
        state.panX = cx - ((cx - state.panX) * newZoom) / state.zoom;
        state.panY = cy - ((cy - state.panY) * newZoom) / state.zoom;
        state.zoom = newZoom;
        redraw();
      }

      function handleMouseDown(e) {
        if (e.button === 0 || e.button === 1) {
          e.preventDefault();
          state.isDragging = true;
          state.startX = e.clientX - state.panX;
          state.startY = e.clientY - state.panY;
          wrap.style.cursor = "grabbing";
        }
      }

      function handleMouseMove(e) {
        if (!state.isDragging) return;
        state.panX = e.clientX - state.startX;
        state.panY = e.clientY - state.startY;
        redraw();
      }

      function handleMouseUp() {
        state.isDragging = false;
        wrap.style.cursor = "grab";
      }

      var observer = new ResizeObserver(function () {
        redraw();
      });
      observer.observe(wrap);

      wrap.addEventListener("wheel", handleWheel, { passive: false });
      wrap.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      var io = new IntersectionObserver(
        function (e) {
          if (!e[0].isIntersecting) {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
          } else {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
          }
        },
        { threshold: 0.01 },
      );
      io.observe(el);

      redraw();
    });
};

// ── INITIALIZERS FOR RECONSTRUCTED ORIGINAL WIDGETS ──
window._VeltroInitTextScramble = function () {
  document
    .querySelectorAll(".veltro-scramble-wrap:not([data-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-init", "1");
      var text = wrap.querySelector(".veltro-scramble-text");
      var original = wrap.dataset.text || "DECODE ME";
      var charset =
        wrap.dataset.charset || "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      var speed = +(wrap.dataset.speed || 30);
      var autoScramble = wrap.dataset.autoScramble === "1";
      var autoInterval = +(wrap.dataset.autoInterval || 3000);
      var isHovering = false;
      text.addEventListener("mouseenter", function () {
        isHovering = true;
      });
      text.addEventListener("mouseleave", function () {
        isHovering = false;
        text.textContent = original;
      });
      if (autoScramble) {
        var autoUntil = 0;
        setInterval(function () {
          autoUntil = Date.now() + Math.max(260, Math.min(autoInterval * 0.55, 1200));
          setTimeout(function () {
            if (wrap.isConnected && !isHovering) text.textContent = original;
          }, Math.max(280, Math.min(autoInterval * 0.6, 1300)));
        }, Math.max(autoInterval, 500));
        autoUntil = Date.now() + 900;
      }
      var interval = setInterval(function () {
        if (!wrap.isConnected) {
          clearInterval(interval);
          return;
        }
        if (!isHovering && (!autoScramble || Date.now() > autoUntil)) return;
        var result = "";
        for (var i = 0; i < original.length; i++) {
          result += charset[Math.floor(Math.random() * charset.length)];
        }
        text.textContent = result;
      }, speed);
    });
};

window._VeltroInitTypewriter = function () {
  document
    .querySelectorAll(".veltro-typewriter-wrap:not([data-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-init", "1");
      var text = wrap.querySelector(".veltro-typewriter-text");
      var original = wrap.dataset.text || "Hello, World!";
      var speed = +(wrap.dataset.speed || 80);
      var loop = wrap.dataset.loop !== "0";
      var delay = +(wrap.dataset.delay || 2000);
      var index = 0;
      function type() {
        if (!wrap.isConnected) return;
        if (index < original.length) {
          text.textContent += original.charAt(index);
          index++;
          setTimeout(type, speed);
        } else if (loop) {
          setTimeout(function () {
            text.textContent = "";
            index = 0;
            type();
          }, delay);
        }
      }
      type();
    });
};

window._VeltroInitCounter = function () {
  document
    .querySelectorAll(".veltro-counter-wrap:not([data-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-init", "1");
      var el = wrap.querySelector(".veltro-counter");
      var target = +(wrap.dataset.value || 1000);
      var prefix = wrap.dataset.prefix || "";
      var suffix = wrap.dataset.suffix || "+";
      var duration = +(wrap.dataset.duration || 2000);
      var startTime = Date.now();
      function update() {
        if (!wrap.isConnected) return;
        var elapsed = Date.now() - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(target * ease);
        el.textContent = prefix + current + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      update();
    });
};

window._VeltroInitLiquidText = function () {
  document
    .querySelectorAll(".veltro-liquid-wrap:not([data-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-init", "1");
      var chars = wrap.querySelectorAll(".veltro-liquid-char");
      var amplitude = +(wrap.dataset.amplitude || 10);
      var frequency = +(wrap.dataset.frequency || 0.05);
      var speed = +(wrap.dataset.speed || 0.02);
      var time = 0;
      var rafId = 0;
      function animate() {
        if (!wrap.isConnected) return;
        time += speed;
        chars.forEach(function (char, i) {
          var y = Math.sin(i * frequency + time) * amplitude;
          char.style.transform = "translateY(" + y + "px)";
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(wrap);
    });
};

window._VeltroInitBubblePop = function () {
  document
    .querySelectorAll(".veltro-bubble-wrap:not([data-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-init", "1");
      var canvas = wrap.querySelector(".veltro-bubble-canvas");
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var W, H;
      function resize() {
        var rect = wrap.getBoundingClientRect();
        W = rect.width;
        H = rect.height;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      var bubbleCount = +(wrap.dataset.bubbleCount || 20);
      var minSize = +(wrap.dataset.minSize || 20);
      var maxSize = +(wrap.dataset.maxSize || 60);
      var colors = (
        wrap.dataset.colors || "#ff6b35,#cdfe00,#3b82f6,#ec4899,#f59e0b"
      ).split(",");
      var bubbles = [];
      for (var i = 0; i < bubbleCount; i++) {
        bubbles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: minSize + Math.random() * (maxSize - minSize),
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          color: colors[i % colors.length],
        });
      }
      var rafId = 0;
      function animate() {
        if (!wrap.isConnected) return;
        ctx.clearRect(0, 0, W, H);
        bubbles.forEach(function (b) {
          b.x += b.vx;
          b.y += b.vy;
          if (b.x < 0 || b.x > W) b.vx *= -1;
          if (b.y < 0 || b.y > H) b.vy *= -1;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fillStyle = b.color;
          ctx.globalAlpha = 0.6;
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(wrap);
      wrap.addEventListener("click", function (e) {
        var rect = wrap.getBoundingClientRect();
        var mx = e.clientX - rect.left,
          my = e.clientY - rect.top;
        bubbles.forEach(function (b) {
          var dist = Math.hypot(b.x - mx, b.y - my);
          if (dist < b.r + 50) {
            b.vx = (b.x - mx) * 0.1;
            b.vy = (b.y - my) * 0.1;
          }
        });
      });
    });
};

window._VeltroInitTiltCards = function () {
  document
    .querySelectorAll(".veltro-tilt-wrap:not([data-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-init", "1");
      var card = wrap.querySelector(".veltro-tilt-card");
      var maxTilt = +(wrap.dataset.maxTilt || 15);
      wrap.style.perspective = (wrap.dataset.perspective || 1000) + "px";
      wrap.addEventListener("mousemove", function (e) {
        var rect = wrap.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform =
          "rotateY(" + x * maxTilt + "deg) rotateX(" + -y * maxTilt + "deg)";
      });
      wrap.addEventListener("mouseleave", function () {
        card.style.transform = "rotateY(0) rotateX(0)";
      });
    });
};

window._VeltroInitAudioVisualizer = function () {
  document
    .querySelectorAll(".veltro-audio-wrap:not([data-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-init", "1");
      var bars = wrap.querySelectorAll(".veltro-audio-bar");
      var rafId = 0;
      function animate() {
        if (!wrap.isConnected) return;
        bars.forEach(function (bar) {
          var h = 20 + Math.random() * 80;
          bar.style.height = h + "%";
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(wrap);
    });
};

window._VeltroInitConstellation = function () {
  document
    .querySelectorAll(".veltro-const-wrap:not([data-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-init", "1");
      var canvas = wrap.querySelector(".veltro-const-canvas");
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var W, H;
      function resize() {
        var rect = wrap.getBoundingClientRect();
        W = rect.width;
        H = rect.height;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      var starCount = +(wrap.dataset.starCount || 80);
      var connDist = +(wrap.dataset.connectionDistance || 100);
      var starColor = wrap.dataset.starColor || "#cdfe00";
      var lineColor = wrap.dataset.lineColor || "rgba(205,254,0,0.2)";
      var stars = [];
      for (var i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: Math.random() * 2 + 1,
        });
      }
      var rafId = 0;
      function animate() {
        if (!wrap.isConnected) return;
        ctx.clearRect(0, 0, W, H);
        stars.forEach(function (s) {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0 || s.x > W) s.vx *= -1;
          if (s.y < 0 || s.y > H) s.vy *= -1;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = starColor;
          ctx.fill();
        });
        for (var i = 0; i < stars.length; i++) {
          for (var j = i + 1; j < stars.length; j++) {
            var dist = Math.hypot(
              stars[i].x - stars[j].x,
              stars[i].y - stars[j].y,
            );
            if (dist < connDist) {
              ctx.beginPath();
              ctx.moveTo(stars[i].x, stars[i].y);
              ctx.lineTo(stars[j].x, stars[j].y);
              ctx.strokeStyle = lineColor;
              ctx.lineWidth = 1 - dist / connDist;
              ctx.stroke();
            }
          }
        }
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(wrap);
    });
};

window._VeltroInitGeometryDraw = function () {
  document
    .querySelectorAll(".veltro-geo-wrap:not([data-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-init", "1");
      var canvas = wrap.querySelector(".veltro-geo-canvas");
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var W, H;
      function resize() {
        var rect = wrap.getBoundingClientRect();
        W = rect.width;
        H = rect.height;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      var color = wrap.dataset.color || "#cdfe00";
      var lineWidth = +(wrap.dataset.lineWidth || 3);
      var isDrawing = false;
      var lastX, lastY;
      canvas.addEventListener("mousedown", function (e) {
        isDrawing = true;
        var rect = canvas.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
      });
      canvas.addEventListener("mousemove", function (e) {
        if (!isDrawing) return;
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.stroke();
        lastX = x;
        lastY = y;
      });
      canvas.addEventListener("mouseup", function () {
        isDrawing = false;
      });
      canvas.addEventListener("mouseleave", function () {
        isDrawing = false;
      });
    });
};

// ── INITIALIZERS FOR BATCH 1: CURSOR ──
window._VeltroInitMultiShapeTrail = function () {
  document
    .querySelectorAll(".veltro-multishape-canvas:not([data-init])")
    .forEach(function (canvas) {
      canvas.setAttribute("data-init", "1");
      var wrap = canvas.closest(".veltro-multishape-wrap");
      if (!wrap) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var W = 0,
        H = 0;

      function resize() {
        W = wrap.offsetWidth || 400;
        H = wrap.offsetHeight || 400;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();

      var ds = wrap.dataset;
      var trailLength = +(ds.trailLength || 30);
      var particleSize = +(ds.particleSize || 8);
      var shapes = (ds.shapes || "circle,square,triangle,star")
        .split(",")
        .map(function (s) {
          return s.trim();
        });
      var colors = (ds.colors || "#ff6b35,#cdfe00,#3b82f6,#ec4899,#f59e0b")
        .split(",")
        .map(function (c) {
          return c.trim();
        });
      var speed = +(ds.speed || 1);
      var trailFade = ds.trailFade !== "false";
      var trailGlow = ds.trailGlow === "true";
      var trailBlur = ds.trailBlur === "true";
      var glowSize = +(ds.glowSize || 18);
      var shapeScale = +(ds.shapeScale || 1);
      var shapeOpacity = +(ds.shapeOpacity || 100) / 100;
      var shapeRotation = +(ds.shapeRotation || 0);
      var rotationSpeed = +(ds.rotationSpeed !== undefined
        ? ds.rotationSpeed
        : 2);
      var autonomousMode = ds.autonomousMode !== "false";
      var particleSpacing = +(ds.particleSpacing || 6);
      var colorMode = ds.colorMode || "palette";
      var velocityStretch = ds.velocityStretch === "true";
      var shapeOrder = ds.shapeOrder || "sequential";

      function hex2rgb(hex) {
        var h = hex.replace("#", "");
        if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        return [
          parseInt(h.slice(0, 2), 16),
          parseInt(h.slice(2, 4), 16),
          parseInt(h.slice(4, 6), 16),
        ];
      }
      function lerpColor(a, b, t) {
        try {
          var ra = hex2rgb(a),
            rb = hex2rgb(b);
          return (
            "rgb(" +
            Math.round(ra[0] + (rb[0] - ra[0]) * t) +
            "," +
            Math.round(ra[1] + (rb[1] - ra[1]) * t) +
            "," +
            Math.round(ra[2] + (rb[2] - ra[2]) * t) +
            ")"
          );
        } catch (e) {
          return a;
        }
      }

      function drawShape(
        type,
        x,
        y,
        size,
        color,
        alpha,
        rot,
        scaleX,
        scaleY,
        isLead,
      ) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha * shapeOpacity));
        ctx.translate(x, y);
        ctx.rotate((rot * Math.PI) / 180);
        if (scaleX !== 1 || scaleY !== 1) ctx.scale(scaleX, scaleY);
        if (trailGlow && isLead) {
          ctx.shadowBlur = glowSize;
          ctx.shadowColor = color;
        } else if (trailGlow) {
          ctx.shadowBlur = glowSize * alpha * 0.5;
          ctx.shadowColor = color;
        }
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.beginPath();
        var s = size;
        if (type === "circle") {
          ctx.arc(0, 0, s, 0, Math.PI * 2);
          ctx.fill();
        } else if (type === "ring") {
          ctx.arc(0, 0, s, 0, Math.PI * 2);
          ctx.lineWidth = Math.max(1.5, s * 0.28);
          ctx.stroke();
        } else if (type === "square") {
          ctx.rect(-s * 0.88, -s * 0.88, s * 1.76, s * 1.76);
          ctx.fill();
        } else if (type === "diamond") {
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.65, 0);
          ctx.lineTo(0, s);
          ctx.lineTo(-s * 0.65, 0);
          ctx.closePath();
          ctx.fill();
        } else if (type === "triangle") {
          ctx.moveTo(0, -s);
          ctx.lineTo(s * 0.866, s * 0.5);
          ctx.lineTo(-s * 0.866, s * 0.5);
          ctx.closePath();
          ctx.fill();
        } else if (type === "star") {
          for (var i = 0; i < 10; i++) {
            var a = (i * Math.PI) / 5 - Math.PI / 2;
            var r = i % 2 === 0 ? s : s * 0.42;
            if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
            else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          ctx.closePath();
          ctx.fill();
        } else if (type === "hexagon") {
          for (var j = 0; j < 6; j++) {
            var ha = (j * Math.PI) / 3 - Math.PI / 6;
            if (j === 0) ctx.moveTo(Math.cos(ha) * s, Math.sin(ha) * s);
            else ctx.lineTo(Math.cos(ha) * s, Math.sin(ha) * s);
          }
          ctx.closePath();
          ctx.fill();
        } else if (type === "cross") {
          var arm = s * 0.3;
          ctx.rect(-arm, -s, arm * 2, s * 2);
          ctx.rect(-s, -arm, s * 2, arm * 2);
          ctx.fill();
        } else if (type === "dot") {
          ctx.arc(0, 0, s * 0.38, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.arc(0, 0, s, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      var trail = [];
      var cursorX = W / 2,
        cursorY = H / 2;
      var targetX = W / 2,
        targetY = H / 2;
      var lastAddedX = -9999,
        lastAddedY = -9999;
      var prevCX = W / 2,
        prevCY = H / 2;
      var mouseInside = false;
      var totalRot = 0;
      var shapeIdx = 0;
      var autoT = Math.random() * Math.PI * 2;

      wrap.addEventListener("mouseenter", function () {
        mouseInside = true;
      });
      wrap.addEventListener("mouseleave", function () {
        mouseInside = false;
      });
      wrap.addEventListener("mousemove", function (e) {
        var r = wrap.getBoundingClientRect();
        targetX = e.clientX - r.left;
        targetY = e.clientY - r.top;
      });

      function getAutoTarget() {
        var cx = W * 0.5,
          cy = H * 0.5;
        return {
          x: cx + W * 0.36 * Math.sin(autoT * 1.27),
          y: cy + H * 0.28 * Math.sin(autoT * 0.73 + 1.1),
        };
      }

      var rafId = 0;
      function animate() {
        if (!wrap.isConnected) return;

        totalRot += rotationSpeed;
        autoT += 0.007 * speed;

        if (!mouseInside && autonomousMode) {
          var at = getAutoTarget();
          targetX = at.x;
          targetY = at.y;
          cursorX += (targetX - cursorX) * 0.035 * speed;
          cursorY += (targetY - cursorY) * 0.035 * speed;
        } else {
          cursorX += (targetX - cursorX) * 0.18;
          cursorY += (targetY - cursorY) * 0.18;
        }

        var velX = cursorX - prevCX;
        var velY = cursorY - prevCY;
        var vel = Math.hypot(velX, velY);
        prevCX = cursorX;
        prevCY = cursorY;

        var moved = Math.hypot(cursorX - lastAddedX, cursorY - lastAddedY);
        if (moved >= particleSpacing) {
          var shape, color;
          if (shapeOrder === "random") {
            shape = shapes[Math.floor(Math.random() * shapes.length)];
            color = colors[Math.floor(Math.random() * colors.length)];
          } else if (shapeOrder === "reverse") {
            var si = shapes.length - 1 - (shapeIdx % shapes.length);
            shape = shapes[si];
            color = colors[colors.length - 1 - (shapeIdx % colors.length)];
          } else {
            shape = shapes[shapeIdx % shapes.length];
            color = colors[shapeIdx % colors.length];
          }
          trail.unshift({
            x: cursorX,
            y: cursorY,
            shape: shape,
            color: color,
            rot: totalRot + shapeRotation,
            vx: velX,
            vy: velY,
            vel: vel,
          });
          shapeIdx++;
          lastAddedX = cursorX;
          lastAddedY = cursorY;
          if (trail.length > trailLength) trail.length = trailLength;
        }

        if (trailBlur) {
          ctx.fillStyle = "rgba(0,0,0,0.25)";
          ctx.fillRect(0, 0, W, H);
        } else {
          ctx.clearRect(0, 0, W, H);
        }

        var n = trail.length;
        for (var i = n - 1; i >= 0; i--) {
          var pt = trail[i];
          var progress = n > 1 ? i / (n - 1) : 0;
          var sz = particleSize * shapeScale * (1 - progress * 0.62);
          if (sz < 0.5) continue;

          var alpha = trailFade ? Math.pow(1 - progress, 1.15) : 0.9;
          var color;
          if (colorMode === "gradient" && colors.length > 1) {
            var ci = progress * (colors.length - 1);
            var lo = Math.floor(ci);
            var hi = Math.min(lo + 1, colors.length - 1);
            color = lerpColor(colors[lo], colors[hi], ci - lo);
          } else {
            color = pt.color;
          }

          var rot = pt.rot + i * 8;
          var sx = 1,
            sy = 1;
          if (velocityStretch && pt.vel > 1) {
            var stretch = Math.min(1 + pt.vel * 0.06, 2.2);
            var angle = Math.atan2(pt.vy, pt.vx);
            rot = (angle * 180) / Math.PI;
            sx = stretch;
            sy = 1 / Math.sqrt(stretch);
          }
          drawShape(
            pt.shape,
            pt.x,
            pt.y,
            sz,
            color,
            alpha,
            rot,
            sx,
            sy,
            i === 0,
          );
        }

        rafId = requestAnimationFrame(animate);
      }

      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(wrap);
    });
};

window._VeltroInitSpotlight = function () {
  document
    .querySelectorAll(".veltro-spotlight-mask:not([data-init])")
    .forEach(function (mask) {
      mask.setAttribute("data-init", "1");
      var wrap = mask.closest(".veltro-spotlight-wrap");
      if (!wrap) return;
      wrap.addEventListener("mousemove", function (e) {
        var r = wrap.getBoundingClientRect();
        var x = e.clientX - r.left;
        var y = e.clientY - r.top;
        mask.style.setProperty("--sx", x + "px");
        mask.style.setProperty("--sy", y + "px");
      });
    });
};

window._VeltroInitMagText = function () {
  document
    .querySelectorAll(".veltro-magtext-content:not([data-init])")
    .forEach(function (content) {
      content.setAttribute("data-init", "1");
      var wrap = content.closest(".veltro-magtext-wrap");
      if (!wrap) return;
      var chars = content.querySelectorAll(".veltro-mag-char");
      wrap.addEventListener("mousemove", function (e) {
        var r = wrap.getBoundingClientRect();
        var mx = e.clientX - r.left;
        var my = e.clientY - r.top;
        chars.forEach(function (char) {
          var rect = char.getBoundingClientRect();
          var wr = wrap.getBoundingClientRect();
          var cx = rect.left - wr.left + rect.width / 2;
          var cy = rect.top - wr.top + rect.height / 2;
          var dist = Math.hypot(mx - cx, my - cy);
          var radius = +char.dataset.magneticRadius || 150;
          var strength = +char.dataset.magneticStrength || 0.5;
          if (dist < radius) {
            var force = (1 - dist / radius) * strength * 30;
            var angle = Math.atan2(cy - my, cx - mx);
            var tx = Math.cos(angle) * force;
            var ty = Math.sin(angle) * force;
            char.style.transform = "translate(" + tx + "px," + ty + "px)";
          } else {
            char.style.transform = "translate(0,0)";
          }
        });
      });
      wrap.addEventListener("mouseleave", function () {
        chars.forEach(function (char) {
          char.style.transform = "translate(0,0)";
        });
      });
    });
};

window._VeltroInitDistortion = function () {
  document
    .querySelectorAll(".veltro-distort-canvas:not([data-init])")
    .forEach(function (canvas) {
      canvas.setAttribute("data-init", "1");
      var wrap = canvas.closest(".veltro-distort-wrap");
      if (!wrap) return;

      var ds = wrap.dataset;
      var lensR = +(ds.distortionRadius || 100);
      var strength = +(ds.distortionStrength || 0.3);
      var distType = ds.distortionType || "lens";
      var chromatic = ds.distortionChromatic === "true";
      var invert = ds.distortionInvert === "true";
      var overlayOn = ds.distortionOverlay !== "false";

      var bgImg = wrap.querySelector("img");
      if (!bgImg) return;

      var W = wrap.offsetWidth;
      var H = wrap.offsetHeight;

      // Zoom factor per type
      var zoom;
      if (distType === "pinch" || invert) {
        zoom = 1 / (1 + strength * 1.3);
      } else if (distType === "ripple") {
        zoom = 1;
      } else {
        zoom = 1 + strength * 1.5; // lens / swirl
      }

      // Lens element — uses CSS background to avoid CORS pixel access
      var lens = document.createElement("div");
      var lensD = lensR * 2;
      var swirlFilter =
        distType === "swirl"
          ? "hue-rotate(22deg) contrast(1.12) saturate(1.25)"
          : "";
      lens.style.cssText =
        "position:absolute;width:" +
        lensD +
        "px;height:" +
        lensD +
        "px;border-radius:50%;" +
        "background-image:url('" +
        bgImg.src +
        "');background-repeat:no-repeat;" +
        "pointer-events:none;display:none;transform:translate(-50%,-50%);" +
        "box-shadow:inset 0 0 0 1px rgba(255,255,255,0.18),0 8px 32px rgba(0,0,0,0.4);" +
        "will-change:left,top,background-position,background-size;" +
        "filter:" +
        swirlFilter;
      wrap.appendChild(lens);

      // Canvas for decorative overlay only
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvas.style.pointerEvents = "none";

      var mx = -9999,
        my = -9999,
        tmx = W / 2,
        tmy = H / 2;
      var active = false;
      var tick = 0;

      wrap.addEventListener("mousemove", function (e) {
        var r = wrap.getBoundingClientRect();
        tmx = e.clientX - r.left;
        tmy = e.clientY - r.top;
        if (!active) {
          mx = tmx;
          my = tmy;
        }
        active = true;
        lens.style.display = "block";
      });
      wrap.addEventListener("mouseleave", function () {
        active = false;
        lens.style.display = "none";
        ctx.clearRect(0, 0, W, H);
      });

      var rafId = 0;
      function render() {
        if (!canvas.isConnected) return;
        tick++;

        // Smooth follow
        mx += (tmx - mx) * 0.2;
        my += (tmy - my) * 0.2;

        // Background crop position
        var lz =
          distType === "ripple"
            ? 1 + Math.sin(tick * 0.055) * strength * 0.45
            : zoom;
        var bpx = lensR - mx * lz;
        var bpy = lensR - my * lz;
        lens.style.backgroundSize =
          Math.round(W * lz) + "px " + Math.round(H * lz) + "px";
        lens.style.backgroundPosition =
          Math.round(bpx) + "px " + Math.round(bpy) + "px";
        lens.style.left = Math.round(mx) + "px";
        lens.style.top = Math.round(my) + "px";

        // Canvas ring effects
        if (active) {
          ctx.clearRect(0, 0, W, H);

          // Outer ambient glow
          if (overlayOn) {
            var gOut = ctx.createRadialGradient(
              mx,
              my,
              lensR * 0.7,
              mx,
              my,
              lensR + 22,
            );
            gOut.addColorStop(0, "rgba(255,255,255,0)");
            gOut.addColorStop(0.65, "rgba(255,255,255,0.055)");
            gOut.addColorStop(1, "rgba(255,255,255,0)");
            ctx.beginPath();
            ctx.arc(mx, my, lensR + 22, 0, Math.PI * 2);
            ctx.fillStyle = gOut;
            ctx.fill();
          }

          // Chromatic aberration rings
          if (chromatic) {
            ctx.beginPath();
            ctx.arc(mx - 2, my - 1, lensR + 1, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(255,55,55,0.5)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(mx + 2, my + 1, lensR + 1, 0, Math.PI * 2);
            ctx.strokeStyle = "rgba(55,80,255,0.5)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          // Main lens border
          ctx.beginPath();
          ctx.arc(mx, my, lensR, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,255,255,0.3)";
          ctx.lineWidth = 1;
          ctx.stroke();

          // Inner specular arc (top-left)
          ctx.save();
          ctx.beginPath();
          ctx.arc(
            mx - lensR * 0.18,
            my - lensR * 0.18,
            lensR * 0.82,
            Math.PI * 1.1,
            Math.PI * 1.68,
          );
          ctx.strokeStyle = "rgba(255,255,255,0.22)";
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.restore();

          // Centre crosshair
          ctx.beginPath();
          ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255,255,255,0.6)";
          ctx.fill();
        }

        rafId = requestAnimationFrame(render);
      }

      var onResize = function () {
        W = wrap.offsetWidth;
        H = wrap.offsetHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      window.addEventListener("resize", onResize);

      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(render);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(wrap);
    });
};

window._VeltroInitColorSampler = function () {
  document
    .querySelectorAll(".veltro-colorsampler-wrap:not([data-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-init", "1");
      try {
        var palette = wrap.querySelector(".veltro-color-palette");
        if (!palette) return;
        var swatches = palette.querySelectorAll(".veltro-color-swatch");
        if (!swatches.length) return;
        var sampleSize = +wrap.dataset.sampleSize || 10;
        var paletteSize = +(wrap.dataset.paletteSize || 5);
        var canvas = document.createElement("canvas");
        canvas.style.display = "none";
        wrap.appendChild(canvas);
        var ctx = canvas.getContext("2d");
        wrap.addEventListener("mousemove", function (e) {
          try {
            var el = wrap.querySelector("img, video, canvas, .veltro-colorsampler-img");
            if (!el) {
              var bgImg = window.getComputedStyle(wrap).backgroundImage;
              if (bgImg && bgImg !== "none") {
                var url = bgImg.replace(/url\(["']?([^"')]+)["']?\)/, "$1");
                var img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = function () {
                  canvas.width = sampleSize;
                  canvas.height = sampleSize;
                  var r = wrap.getBoundingClientRect();
                  var x = e.clientX - r.left;
                  var y = e.clientY - r.top;
                  var scaleX = img.naturalWidth / r.width;
                  var scaleY = img.naturalHeight / r.height;
                  ctx.drawImage(img, x * scaleX - sampleSize / 2, y * scaleY - sampleSize / 2, sampleSize, sampleSize, 0, 0, sampleSize, sampleSize);
                  var pixel = ctx.getImageData(sampleSize / 2, sampleSize / 2, 1, 1).data;
                  var color = "rgb(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + ")";
                  swatches[0].style.background = color;
                  for (var i = 1; i < paletteSize && i < swatches.length; i++) {
                    swatches[i].style.background = swatches[i - 1].style.background;
                  }
                };
                img.src = url;
              }
              return;
            }
            var r = el.getBoundingClientRect();
            var wr = wrap.getBoundingClientRect();
            var x = e.clientX - wr.left;
            var y = e.clientY - wr.top;
            var sx = (e.clientX - r.left) / r.width * (el.naturalWidth || el.videoWidth || el.width);
            var sy = (e.clientY - r.top) / r.height * (el.naturalHeight || el.videoHeight || el.height);
            canvas.width = sampleSize;
            canvas.height = sampleSize;
            ctx.drawImage(el, sx - sampleSize / 2, sy - sampleSize / 2, sampleSize, sampleSize, 0, 0, sampleSize, sampleSize);
            var pixel = ctx.getImageData(sampleSize / 2, sampleSize / 2, 1, 1).data;
            var color = "rgb(" + pixel[0] + "," + pixel[1] + "," + pixel[2] + ")";
            swatches[0].style.background = color;
            for (var i = 1; i < paletteSize && i < swatches.length; i++) {
              swatches[i].style.background = swatches[i - 1].style.background;
            }
          } catch (ignored) {}
        });
      } catch (ignored) {}
    });
};

window._VeltroInitGravityCursor = function () {
  document
    .querySelectorAll(".veltro-gravity-canvas:not([data-init])")
    .forEach(function (canvas) {
      canvas.setAttribute("data-init", "1");
      var wrap = canvas.closest(".veltro-gravity-wrap");
      if (!wrap) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var rect = wrap.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      var W = rect.width,
        H = rect.height;
      var gravityStrength = +wrap.dataset.gravityStrength || 0.5;
      var particleCount = +wrap.dataset.particleCount || 50;
      var particleSize = +wrap.dataset.particleSize || 4;
      var particleColor = wrap.dataset.particleColor || "#cdfe00";
      var mouseX = W / 2,
        mouseY = H / 2;
      var particles = [];
      for (var i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * particleSize + 1,
        });
      }
      wrap.addEventListener("mousemove", function (e) {
        var r = wrap.getBoundingClientRect();
        mouseX = e.clientX - r.left;
        mouseY = e.clientY - r.top;
      });
      var rafId = 0;
      function animate() {
        if (!wrap.isConnected) return;
        ctx.fillStyle = "rgba(13,13,26,0.1)";
        ctx.fillRect(0, 0, W, H);
        particles.forEach(function (p) {
          var dx = mouseX - p.x;
          var dy = mouseY - p.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 5) {
            var force = (gravityStrength * 100) / (dist * dist);
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = particleColor;
          ctx.fill();
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(wrap);
    });
};

// ── Additional Widget Initializers ──

window._VeltroInitKineticText = function () {
  document
    .querySelectorAll(".fw-widget-kineticText:not([data-kinetic-init])")
    .forEach(function (el) {
      el.setAttribute("data-kinetic-init", "1");
    });
};

window._VeltroInitTextMask = function () {
  document
    .querySelectorAll(".fw-widget-textMask:not([data-mask-init])")
    .forEach(function (el) {
      el.setAttribute("data-mask-init", "1");
    });
};

window._VeltroInitMagneticCursor = function () {
  document
    .querySelectorAll(".fw-widget-magneticCursor:not([data-mag-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-mag-init", "1");
      var inner = wrap.querySelector(".veltro-magcursor-wrap") || wrap;
      var targets = wrap.querySelectorAll(".veltro-mag-item");
      var strength = +(inner.dataset.magneticStrength || 0.5);
      var radius = +(inner.dataset.magneticRadius || 150);
      var repel = inner.dataset.repelMode === "1";
      var elastic = inner.dataset.elasticBounce === "1";
      var cursorEl = wrap.querySelector(".veltro-mag-cursor");
      var targetsData = [];
      targets.forEach(function (t) {
        var tr = t.getBoundingClientRect();
        targetsData.push({ el: t, ox: 0, oy: 0, vx: 0, vy: 0 });
      });
      var rafId = 0;
      var mx = -9999, my = -9999;
      wrap.addEventListener("mousemove", function (e) {
        var rect = wrap.getBoundingClientRect();
        mx = e.clientX - rect.left;
        my = e.clientY - rect.top;
        if (cursorEl) {
          cursorEl.style.left = mx + "px";
          cursorEl.style.top = my + "px";
        }
      });
      wrap.addEventListener("mouseleave", function () {
        mx = -9999;
        my = -9999;
        if (elastic) {
          targetsData.forEach(function (td) {
            td.vx += -td.ox * 0.1;
            td.vy += -td.oy * 0.1;
          });
        }
      });
      function animate() {
        if (!wrap.isConnected) return;
        if (mx > -9998) {
          targetsData.forEach(function (td, i) {
            var tr = td.el.getBoundingClientRect();
            var wr = wrap.getBoundingClientRect();
            var cx = tr.left - wr.left + tr.width / 2;
            var cy = tr.top - wr.top + tr.height / 2;
            var dx = mx - cx, dy = my - cy;
            var dist = Math.sqrt(dx * dx + dy * dy);
            var pull = Math.max(0, 1 - dist / radius);
            var tx = dx * pull * strength * (repel ? -1 : 1);
            var ty = dy * pull * strength * (repel ? -1 : 1);
            if (elastic) {
              td.vx += (tx - td.ox) * 0.15;
              td.vy += (ty - td.oy) * 0.15;
              td.vx *= 0.9;
              td.vy *= 0.9;
              td.ox += td.vx;
              td.oy += td.vy;
            } else {
              td.ox = tx;
              td.oy = ty;
            }
            td.el.style.transform = "translate(" + td.ox + "px," + td.oy + "px)";
          });
        } else if (elastic) {
          targetsData.forEach(function (td) {
            td.vx += -td.ox * 0.1;
            td.vy += -td.oy * 0.1;
            td.vx *= 0.9;
            td.vy *= 0.9;
            td.ox += td.vx;
            td.oy += td.vy;
            if (Math.abs(td.ox) < 0.1 && Math.abs(td.oy) < 0.1) { td.ox = 0; td.oy = 0; td.vx = 0; td.vy = 0; }
            td.el.style.transform = "translate(" + td.ox + "px," + td.oy + "px)";
          });
        }
        rafId = requestAnimationFrame(animate);
      }
      rafId = requestAnimationFrame(animate);
    });
};

window._VeltroInitParticleTrail = function () {
  document
    .querySelectorAll(".fw-widget-particleTrail:not([data-trail-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-trail-init", "1");
      var canvas = wrap.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      function resize() {
        var W = wrap.offsetWidth;
        var H = wrap.offsetHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { W: W, H: H };
      }
      var dims = resize();
      var inner = wrap.querySelector(".veltro-ptrail-wrap") || wrap;
      var ds = inner.dataset;
      var particleColor = ds.particleColor || "#cdfe00";
      var particleCount = +(ds.particleCount || 30);
      var particleSize = +(ds.particleSize || 4);
      var fadeSpeed = +(ds.fadeSpeed || 0.95);
      var particleShape = ds.particleShape || "circle";
      var particleTrail = ds.particleTrail !== "false";
      var particleGravity = +(ds.particleGravity || 0);
      var particleRandomSize = ds.particleRandomSize === "true";
      var particleRotation = +(ds.particleRotation || 0);
      var particleScatter = +(ds.particleScatter || 1);
      var particlePulse = ds.particlePulse === "true";
      var particleBlendMode = ds.particleBlendMode || "normal";

      var particles = [];
      var spawnCount = 3;
      wrap.addEventListener("mousemove", function (e) {
        var rect = wrap.getBoundingClientRect();
        for (var i = 0; i < spawnCount; i++) {
          var size = particleSize;
          if (particleRandomSize) size = particleSize * (0.3 + Math.random() * 1.4);
          particles.push({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            vx: (Math.random() - 0.5) * particleScatter * 4,
            vy: (Math.random() - 0.5) * particleScatter * 4 - 1,
            life: 1,
            size: size,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * particleRotation * 0.02,
            pulsePhase: Math.random() * Math.PI * 2,
          });
        }
        if (particles.length > particleCount * 3) particles.splice(0, particles.length - particleCount * 3);
      });

      function drawShape(type, x, y, s, alpha, rot) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        if (type === "square") { ctx.rect(-s * 0.7, -s * 0.7, s * 1.4, s * 1.4); ctx.fill(); }
        else if (type === "triangle") { ctx.moveTo(0, -s); ctx.lineTo(s * 0.866, s * 0.5); ctx.lineTo(-s * 0.866, s * 0.5); ctx.closePath(); ctx.fill(); }
        else if (type === "star") { for (var j = 0; j < 10; j++) { var a = (j * Math.PI) / 5 - Math.PI / 2; var r = j % 2 === 0 ? s : s * 0.42; if (j === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); }
        else { ctx.arc(0, 0, s, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      }

      var rafId = 0;
      function animate() {
        if (!wrap.isConnected) return;
        dims = resize();
        if (particleTrail) {
          ctx.fillStyle = "rgba(10,10,20,0.15)";
          ctx.fillRect(0, 0, dims.W, dims.H);
        } else {
          ctx.clearRect(0, 0, dims.W, dims.H);
        }
        for (var i = particles.length - 1; i >= 0; i--) {
          var p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += particleGravity * 0.05;
          p.life -= (1 - fadeSpeed) * 0.4;
          p.rotation += p.rotSpeed;
          if (particlePulse) p.size = particleSize * (0.7 + 0.3 * Math.sin(Date.now() * 0.01 + p.pulsePhase));
          if (p.life <= 0) { particles.splice(i, 1); continue; }
          drawShape(particleShape, p.x, p.y, p.size, p.life, p.rotation);
        }
        ctx.globalAlpha = 1;
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) { if (e[0].isIntersecting) { if (!rafId) rafId = requestAnimationFrame(animate); } else { cancelAnimationFrame(rafId); rafId = 0; } },
        { threshold: 0.01 },
      ).observe(wrap);
    });
};

window._VeltroInitCursorRipple = function () {
  document
    .querySelectorAll(".fw-widget-cursorRipple:not([data-ripple-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-ripple-init", "1");
      wrap.addEventListener("click", function (e) {
        var rect = wrap.getBoundingClientRect();
        var ripple = document.createElement("div");
        ripple.style.cssText =
          "position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);pointer-events:none;transform:translate(-50%,-50%) scale(0);animation:veltroRipple 0.6s ease-out forwards;";
        ripple.style.left = e.clientX - rect.left + "px";
        ripple.style.top = e.clientY - rect.top + "px";
        ripple.style.width = ripple.style.height = "20px";
        wrap.appendChild(ripple);
        setTimeout(function () {
          ripple.remove();
        }, 600);
      });
    });
};

window._VeltroInitCursorLens = function () {
  document
    .querySelectorAll(".fw-widget-cursorLens:not([data-lens-init])")
    .forEach(function (el) {
      el.setAttribute("data-lens-init", "1");
    });
};

window._VeltroInitStickyScrollStack = function () {
  document
    .querySelectorAll(".fw-widget-stickyScrollStack:not([data-sticky-init])")
    .forEach(function (el) {
      el.setAttribute("data-sticky-init", "1");
      var cards = el.querySelectorAll(".veltro-sticky-card");
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
            }
          });
        },
        { threshold: 0.2 },
      );
      cards.forEach(function (c) {
        observer.observe(c);
      });
    });
};

window._VeltroInitScrollVelocitySkew = function () {
  document
    .querySelectorAll(".fw-widget-scrollVelocitySkew:not([data-skew-init])")
    .forEach(function (el) {
      el.setAttribute("data-skew-init", "1");
      var targets = el.querySelectorAll(".veltro-skew-target");
      var lastScroll = 0,
        velocity = 0,
        rafId;
      function update() {
        var current = window.scrollY || window.pageYOffset;
        velocity = (current - lastScroll) * 0.1;
        lastScroll = current;
        velocity *= 0.9;
        targets.forEach(function (t) {
          t.style.transform =
            "skewY(" + Math.max(-5, Math.min(5, velocity)) + "deg)";
        });
        rafId = requestAnimationFrame(update);
      }
      update();
      el.addEventListener("remove", function () {
        cancelAnimationFrame(rafId);
      });
    });
};

window._VeltroInitParallaxImageStack = function () {
  document
    .querySelectorAll(".fw-widget-parallaxImageStack:not([data-parallax-init])")
    .forEach(function (el) {
      el.setAttribute("data-parallax-init", "1");
      var wrap = el.querySelector(".veltro-parstack-wrap");
      if (!wrap) return;
      var layers = wrap.querySelectorAll(".veltro-parstack-layer");
      if (!layers.length) return;
      var strength = +(wrap.dataset.depthStrength || 40);
      var mx = 0;
      var my = 0;
      var pos = [];
      layers.forEach(function () {
        pos.push({ x: 0, y: 0 });
      });
      var rafId = 0;

      function lerp(a, b, t) {
        return a + (b - a) * t;
      }

      function tick() {
        if (!el.isConnected) {
          rafId = 0;
          return;
        }
        var settling = false;
        layers.forEach(function (layer, i) {
          var d = +(layer.dataset.depth || 0);
          var tx = mx * strength * d;
          var ty = my * strength * d;
          pos[i].x = lerp(pos[i].x, tx, 0.08);
          pos[i].y = lerp(pos[i].y, ty, 0.08);
          if (Math.abs(pos[i].x - tx) > 0.05 || Math.abs(pos[i].y - ty) > 0.05)
            settling = true;
          layer.style.transform =
            "translateX(" +
            pos[i].x.toFixed(2) +
            "px) translateY(" +
            pos[i].y.toFixed(2) +
            "px)";
        });
        rafId = settling ? requestAnimationFrame(tick) : 0;
      }

      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        mx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        my = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        if (!rafId) rafId = requestAnimationFrame(tick);
      });

      el.addEventListener("mouseleave", function () {
        mx = 0;
        my = 0;
        if (!rafId) rafId = requestAnimationFrame(tick);
      });
    });
};

window._VeltroInitMosaicAssemble = function () {
  document
    .querySelectorAll(".fw-widget-mosaicAssemble:not([data-mosaic-init])")
    .forEach(function (el) {
      el.setAttribute("data-mosaic-init", "1");
      var tiles = el.querySelectorAll(".veltro-mosaic-cell");
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry, i) {
            if (entry.isIntersecting) {
              setTimeout(function () {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "scale(1)";
              }, i * 50);
            }
          });
        },
        { threshold: 0.1 },
      );
      tiles.forEach(function (t) {
        observer.observe(t);
      });
    });
};

window._VeltroInitScrollProgressRing = function () {
  document
    .querySelectorAll(".fw-widget-scrollProgressRing:not([data-ring-init])")
    .forEach(function (el) {
      el.setAttribute("data-ring-init", "1");
      var circle = el.querySelector("circle");
      if (!circle) return;
      var circumference = 2 * Math.PI * (circle.r.baseVal.value || 45);
      circle.style.strokeDasharray = circumference;
      circle.style.strokeDashoffset = circumference;
      var wrapper = el.closest("[data-id]");
      var blockId = wrapper ? wrapper.dataset.id : null;
      // Guard against duplicate listeners when block is refreshed
      var listenerKey = "_ringScroll_" + blockId;
      if (blockId && window[listenerKey]) {
        window.removeEventListener("scroll", window[listenerKey]);
      }
      var handler = function () {
        var scrollTop = window.scrollY || window.pageYOffset;
        var docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        var progress = docHeight > 0 ? scrollTop / docHeight : 0;
        circle.style.strokeDashoffset = circumference * (1 - progress);
        if (blockId && FB.events)
          FB.events.emit(blockId, "scrollProgress", progress);
      };
      if (blockId) window[listenerKey] = handler;
      window.addEventListener("scroll", handler);
    });
};

window._VeltroInitMagneticScroll = function () {
  document
    .querySelectorAll(".fw-widget-magneticScroll:not([data-magscroll-init])")
    .forEach(function (el) {
      el.setAttribute("data-magscroll-init", "1");
      var items = el.querySelectorAll(".veltro-magnetic-item");
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var mx = e.clientX - rect.left,
          my = e.clientY - rect.top;
        items.forEach(function (item) {
          var ir = item.getBoundingClientRect();
          var cx = ir.left + ir.width / 2 - rect.left;
          var cy = ir.top + ir.height / 2 - rect.top;
          var dx = mx - cx,
            dy = my - cy;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var pull = Math.max(0, 1 - dist / 200);
          item.style.transform =
            "translate(" + dx * pull * 0.2 + "px," + dy * pull * 0.2 + "px)";
        });
      });
      el.addEventListener("mouseleave", function () {
        items.forEach(function (item) {
          item.style.transform = "";
        });
      });
    });
};

window._VeltroInitMorphBlob = function () {
  document
    .querySelectorAll(".fw-widget-morphBlob:not([data-blob-init])")
    .forEach(function (el) {
      el.setAttribute("data-blob-init", "1");
      var blob = el.querySelector(".veltro-morph-blob");
      if (!blob) return;
      var t = 0;
      var rafId = 0;
      function animate() {
        t += 0.01;
        var r1 = 50 + Math.sin(t) * 10;
        var r2 = 50 + Math.cos(t * 1.3) * 10;
        var r3 = 50 + Math.sin(t * 0.7) * 10;
        var r4 = 50 + Math.cos(t * 1.1) * 10;
        blob.style.borderRadius =
          r1 +
          "% " +
          r2 +
          "% " +
          r3 +
          "% " +
          r4 +
          "% / " +
          r4 +
          "% " +
          r3 +
          "% " +
          r2 +
          "% " +
          r1 +
          "%";
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitNoiseGrain = function () {
  document
    .querySelectorAll(".fw-widget-noiseGrain:not([data-noise-init])")
    .forEach(function (el) {
      el.setAttribute("data-noise-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var W = 0, H = 0, imgData = null;
      function resize() {
        W = el.offsetWidth || 400;
        H = el.offsetHeight || 300;
        if (W < 1 || H < 1) return;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        imgData = ctx.createImageData(W, H);
      }
      resize();
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        if (!imgData) { resize(); if (!imgData) { rafId = requestAnimationFrame(animate); return; } }
        for (var i = 0; i < imgData.data.length; i += 4) {
          var v = Math.random() * 255;
          imgData.data[i] = v;
          imgData.data[i + 1] = v;
          imgData.data[i + 2] = v;
          imgData.data[i + 3] = 15;
        }
        ctx.putImageData(imgData, 0, 0);
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitGradientFlow = function () {
  document
    .querySelectorAll(".fw-widget-gradientFlow:not([data-flow-init])")
    .forEach(function (el) {
      el.setAttribute("data-flow-init", "1");
      var bg = el.querySelector(".veltro-gradient-bg");
      if (!bg) return;
      var hue = 0;
      var hueSpeed = 0.2;
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        hue = (hue + hueSpeed) % 360;
        bg.style.filter = "hue-rotate(" + hue + "deg)";
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
      var wrapper = el.closest("[data-id]");
      var blockId = wrapper ? wrapper.dataset.id : null;
      if (blockId && FB.bindings) {
        FB.bindings.registerSetter(blockId, "speed", function (v) {
          hueSpeed = v;
        });
      }
    });
};

window._VeltroInitSectionBackground = function () {
  document
    .querySelectorAll(".fw-widget-sectionBackground:not([data-bg-init])")
    .forEach(function (el) {
      el.setAttribute("data-bg-init", "1");
    });
};

window._VeltroInitGlassmorphismStack = function () {
  document
    .querySelectorAll(".fw-widget-glassmorphismStack:not([data-glass-init])")
    .forEach(function (el) {
      el.setAttribute("data-glass-init", "1");
      var cards = el.querySelectorAll(".veltro-glass-card");
      cards.forEach(function (card, i) {
        card.style.transitionDelay = i * 100 + "ms";
      });
    });
};

window._VeltroInitGlitchSection = function () {
  document
    .querySelectorAll(".fw-widget-glitchSection:not([data-glitch-init])")
    .forEach(function (el) {
      el.setAttribute("data-glitch-init", "1");
      var text = el.querySelector(".veltro-glitch-text");
      if (!text) return;
      var original = text.textContent;
      var chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
      var glitchRate = 0.1;
      setInterval(function () {
        if (Math.random() < glitchRate) {
          var glitched = original
            .split("")
            .map(function (c) {
              return Math.random() > 0.8
                ? chars[Math.floor(Math.random() * chars.length)]
                : c;
            })
            .join("");
          text.textContent = glitched;
          setTimeout(function () {
            text.textContent = original;
          }, 100);
        }
      }, 200);
      var wrapper = el.closest("[data-id]");
      var blockId = wrapper ? wrapper.dataset.id : null;
      if (blockId && FB.bindings) {
        FB.bindings.registerSetter(blockId, "glitchRate", function (v) {
          glitchRate = v;
        });
      }
    });
};

window._VeltroInitDepthOfField = function () {
  document
    .querySelectorAll(".fw-widget-depthOfField:not([data-dof-init])")
    .forEach(function (el) {
      el.setAttribute("data-dof-init", "1");
      var layers = el.querySelectorAll(".veltro-dof-layer");
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        layers.forEach(function (layer, i) {
          var depth = +layer.dataset.dofDepth || i + 1;
          var moveX = (x - 0.5) * depth * 20;
          layer.style.transform = "translateX(" + -moveX + "px)";
        });
      });
    });
};

window._VeltroInitHolographicCard = function () {
  document
    .querySelectorAll(".fw-widget-holographicCard:not([data-holo-init])")
    .forEach(function (el) {
      el.setAttribute("data-holo-init", "1");
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        el.style.setProperty("--holo-x", x);
        el.style.setProperty("--holo-y", y);
      });
    });
};

window._VeltroInitSoundReactive = function () {
  document
    .querySelectorAll(".fw-widget-soundReactive:not([data-sound-init])")
    .forEach(function (el) {
      el.setAttribute("data-sound-init", "1");
      var bars = el.querySelectorAll(".veltro-sound-bar");
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        bars.forEach(function (bar) {
          var h = Math.random() * 80 + 20;
          bar.style.height = h + "%";
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitMirrorReflection = function () {
  document
    .querySelectorAll(".fw-widget-mirrorReflection:not([data-mirror-init])")
    .forEach(function (el) {
      el.setAttribute("data-mirror-init", "1");
    });
};

// ── Batch 2: Typography ──

window._VeltroInitWaveText = function () {
  document
    .querySelectorAll(".fw-widget-waveText:not([data-wave-init])")
    .forEach(function (el) {
      el.setAttribute("data-wave-init", "1");
      var chars = el.querySelectorAll(".veltro-wave-char");
      var t = 0;
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        t += 0.05;
        chars.forEach(function (c, i) {
          var y = Math.sin(t + i * 0.3) * 10;
          c.style.transform = "translateY(" + y + "px)";
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitRotatingText3d = function () {
  document
    .querySelectorAll(".fw-widget-rotatingText3d:not([data-rot3d-init])")
    .forEach(function (el) {
      el.setAttribute("data-rot3d-init", "1");
      var t = 0;
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        t += 0.5;
        el.style.transform = "perspective(500px) rotateY(" + t + "deg)";
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitMorphingText = function () {
  document
    .querySelectorAll(".fw-widget-morphingText:not([data-morph-init])")
    .forEach(function (el) {
      el.setAttribute("data-morph-init", "1");
      var wrap = el.querySelector(".veltro-morph-wrap");
      if (!wrap) return;
      var spans = wrap.querySelectorAll(".veltro-morph-word");
      if (!spans.length) return;

      var ds = wrap.dataset;
      var morphSpeed = +(ds.morphSpeed || 2000);
      var fadeSpeed = +(ds.fadeSpeed || 500);
      var direction = ds.morphDirection || "forward";
      var highlight = ds.highlight === "1";
      var highlightColor = ds.highlightColor || "#cdfe00";
      var dualColour = ds.dualColour === "1";
      var dualColour2 = ds.dualColour2 || "#3b82f6";
      var baseColor = wrap.querySelector(".veltro-morph-content")
        ? window.getComputedStyle(wrap.querySelector(".veltro-morph-content"))
            .color
        : "";

      var index = 0;

      function showWord(i) {
        spans.forEach(function (s, si) {
          if (si === i) {
            s.style.opacity = "1";
            if (highlight || dualColour) {
              s.style.color = dualColour
                ? i % 2 === 0
                  ? baseColor
                  : dualColour2
                : highlightColor;
            }
          } else {
            s.style.opacity = "0";
          }
        });
      }

      function nextIndex() {
        if (direction === "backward") {
          return (index - 1 + spans.length) % spans.length;
        }
        if (direction === "random") {
          var n;
          do {
            n = Math.floor(Math.random() * spans.length);
          } while (n === index && spans.length > 1);
          return n;
        }
        return (index + 1) % spans.length;
      }

      showWord(0);

      var timer = null;

      function tick() {
        spans[index].style.opacity = "0";
        setTimeout(function () {
          index = nextIndex();
          showWord(index);
        }, fadeSpeed);
      }

      function start() {
        if (timer) return;
        timer = setInterval(tick, morphSpeed);
      }

      function stop() {
        clearInterval(timer);
        timer = null;
      }

      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) start();
          else stop();
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitKineticScramble = function () {
  document
    .querySelectorAll(".fw-widget-kineticScramble:not([data-ks-init])")
    .forEach(function (el) {
      el.setAttribute("data-ks-init", "1");
      var text = el.querySelector(".veltro-ks-text");
      if (!text) return;
      var original = text.dataset.text || text.textContent;
      var chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      function scramble() {
        var progress = 0;
        var interval = setInterval(function () {
          progress += 0.05;
          var current = original
            .split("")
            .map(function (c, i) {
              if (i < progress * original.length) return original[i];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");
          text.textContent = current;
          if (progress >= 1) {
            clearInterval(interval);
            text.textContent = original;
          }
        }, 50);
      }
      setTimeout(scramble, 500);
    });
};

// ── Batch 3: Physics ──

window._VeltroInitGravityWells = function () {
  document
    .querySelectorAll(".fw-widget-gravityWells:not([data-gw-init])")
    .forEach(function (el) {
      el.setAttribute("data-gw-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      function resize() {
        canvas.width = el.offsetWidth * dpr;
        canvas.height = el.offsetHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      var W = el.offsetWidth;
      var H = el.offsetHeight;

      var wrap = el.querySelector(".veltro-gravwell-wrap") || el;
      var ds = wrap.dataset;
      var particleCount = +(ds.particleCount || 100);
      var wellStrength = +(ds.wellStrength || 0.5);
      var particleColor = ds.particleColor || "#cdfe00";
      var wellCount = +(ds.wellCount || 3);
      var wellRadius = +(ds.wellRadius || 20);
      var particleSize = +(ds.particleSize || 2);
      var particleTrail = ds.particleTrail !== "false";
      var wellMode = ds.wellMode || "attract";
      var randomColor = ds.particleRandomColor === "true";
      var wellGlow = ds.wellGlow !== "false";
      var glowColor = ds.glowColor || "#34d399";

      var particles = [];
      for (var i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: particleSize * (0.5 + Math.random()),
          hue: Math.random() * 360,
        });
      }

      var wells = [];
      function initWells(count) {
        wells = [];
        for (var i = 0; i < count; i++) {
          var angle = (i / count) * Math.PI * 2;
          var r = Math.min(W, H) * 0.3;
          wells.push({
            x: W / 2 + Math.cos(angle) * r,
            y: H / 2 + Math.sin(angle) * r,
            strength: wellStrength,
          });
        }
      }
      initWells(wellCount);

      el.addEventListener("click", function (e) {
        var rect = el.getBoundingClientRect();
        var mx = e.clientX - rect.left,
          my = e.clientY - rect.top;
        var closest = null,
          minDist = Infinity;
        wells.forEach(function (w) {
          var d = Math.hypot(w.x - mx, w.y - my);
          if (d < minDist) {
            minDist = d;
            closest = w;
          }
        });
        if (closest && minDist < Math.max(wellRadius * 2, 40)) {
          wells = wells.filter(function (w) {
            return w !== closest;
          });
        } else {
          wells.push({ x: mx, y: my, strength: wellStrength });
        }
      });

      var rafId = 0;
      function animate() {
        if (!canvas.isConnected) return;
        W = el.offsetWidth;
        H = el.offsetHeight;

        if (particleTrail) {
          ctx.fillStyle = "rgba(10,10,20,0.15)";
        } else {
          ctx.clearRect(0, 0, W, H);
        }
        ctx.fillRect(0, 0, W, H);

        wells.forEach(function (w) {
          if (wellGlow) {
            var grad = ctx.createRadialGradient(
              w.x,
              w.y,
              0,
              w.x,
              w.y,
              wellRadius * 3,
            );
            grad.addColorStop(0, glowColor + "40");
            grad.addColorStop(1, glowColor + "00");
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(w.x, w.y, wellRadius * 3, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.beginPath();
          ctx.arc(w.x, w.y, wellRadius, 0, Math.PI * 2);
          ctx.strokeStyle = glowColor;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.fillStyle = glowColor + "30";
          ctx.fill();
        });

        particles.forEach(function (p) {
          wells.forEach(function (w) {
            var dx = w.x - p.x,
              dy = w.y - p.y;
            var dist = Math.sqrt(dx * dx + dy * dy) + 1;
            if (wellMode === "repel") {
              var force = (w.strength * 100) / (dist * dist);
              p.vx -= (dx / dist) * force;
              p.vy -= (dy / dist) * force;
            } else if (wellMode === "orbit") {
              var f = (w.strength * 30) / (dist + 10);
              p.vx += (-dy / dist) * f;
              p.vy += (dx / dist) * f;
            } else {
              var force = (w.strength * 50) / (dist * dist);
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          });
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;
          var col = randomColor
            ? "hsl(" + ((p.hue + Date.now() * 0.01) % 360) + ",70%,60%)"
            : particleColor;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = col;
          ctx.fill();
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
      window.addEventListener("resize", resize);
    });
};

window._VeltroInitFluidSimulation = function () {
  document
    .querySelectorAll(".fw-widget-fluidSimulation:not([data-fluid-init])")
    .forEach(function (el) {
      el.setAttribute("data-fluid-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var W, H;
      function resize() {
        W = el.offsetWidth;
        H = el.offsetHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();

      var wrap = el.querySelector(".veltro-fluid-wrap") || el;
      var ds = wrap.dataset;
      var particleCount = +(ds.particleCount || 200);
      var viscosity = +(ds.viscosity || 0.5);
      var color1 = ds.color1 || "#3b82f6";
      var color2 = ds.color2 || "#ec4899";
      var fluidMode = ds.fluidMode || "flow";
      var fluidDensity = +(ds.fluidDensity || 1);
      var fluidPressure = +(ds.fluidPressure || 0.5);
      var fluidTurbulence = +(ds.fluidTurbulence || 0.3);
      var colorBlend = ds.colorBlend || "gradient";
      var fluidOpacity = +(ds.fluidOpacity || 80) / 100;
      var fluidGlow = ds.fluidGlow !== "false";
      var mouseForce = +(ds.mouseForce || 5);
      var particleStyle = ds.particleStyle || "soft";
      var flowField = ds.flowField !== "false";
      var connectionLines = ds.connectionLines === "true";
      var glowSize = +(ds.glowSize || 12);

      function hexToRgb(h) {
        h = h.replace("#", "");
        return {
          r: parseInt(h.substring(0, 2), 16),
          g: parseInt(h.substring(2, 4), 16),
          b: parseInt(h.substring(4, 6), 16),
        };
      }
      var c1 = hexToRgb(color1);
      var c2 = hexToRgb(color2);
      function lerpColor(a, b, t) {
        t = Math.max(0, Math.min(1, t));
        return (
          "rgb(" +
          Math.round(a.r + (b.r - a.r) * t) +
          "," +
          Math.round(a.g + (b.g - a.g) * t) +
          "," +
          Math.round(a.b + (b.b - a.b) * t) +
          ")"
        );
      }

      var particles = [];
      for (var i = 0; i < particleCount; i++) {
        var spawnY =
          fluidMode === "fountain"
            ? H * 0.9 + Math.random() * H * 0.1
            : Math.random() * H;
        particles.push({
          x: Math.random() * W,
          y: spawnY,
          vx: (Math.random() - 0.5) * 2,
          vy:
            fluidMode === "fountain"
              ? -(Math.random() * 3 + 1)
              : (Math.random() - 0.5) * 2,
          size: (Math.random() * 2 + 1) * (fluidDensity || 1),
          phase: Math.random() * Math.PI * 2,
          baseColor: i / particleCount,
          randColor: Math.random(),
          life: Math.random(),
        });
      }

      var mouseX = W / 2,
        mouseY = H / 2,
        prevMouseX = W / 2,
        prevMouseY = H / 2;
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      });
      el.addEventListener("mouseleave", function () {
        prevMouseX = mouseX;
        prevMouseY = mouseY;
      });

      function flowNoise(x, y, t) {
        var s = 0.003;
        return (
          Math.sin(x * s + t * 0.7) * Math.cos(y * s * 1.3 + t * 0.5) +
          Math.sin(x * s * 2.1 - y * s * 0.9 + t * 1.1) * 0.5
        );
      }

      var tick = 0;
      var rafId = 0;
      var decay = Math.max(0.92, 1 - viscosity * 0.08);

      function animate() {
        if (!canvas.isConnected) return;
        tick += 0.016;

        var trailAlpha = Math.max(0.02, (1 - viscosity) * 0.18);
        ctx.fillStyle = "rgba(5,5,15," + trailAlpha + ")";
        ctx.fillRect(0, 0, W, H);

        var dmx = mouseX - prevMouseX;
        var dmy = mouseY - prevMouseY;
        var mouseSpeed = Math.sqrt(dmx * dmx + dmy * dmy);

        particles.forEach(function (p, pi) {
          // Mode-based autonomous forces
          if (fluidMode === "vortex") {
            var cx = W / 2,
              cy = H / 2;
            var vdx = p.x - cx,
              vdy = p.y - cy;
            var vd = Math.sqrt(vdx * vdx + vdy * vdy) + 1;
            var vf = 0.4 * fluidDensity;
            p.vx += (-vdy / vd) * vf;
            p.vy += (vdx / vd) * vf;
            p.vx -= (vdx / vd) * 0.02;
            p.vy -= (vdy / vd) * 0.02;
          } else if (fluidMode === "wave") {
            p.phase += 0.04;
            p.vy +=
              Math.sin(p.x * 0.015 + tick * 2 + p.phase) * 0.15 * fluidDensity;
            p.vx += Math.cos(p.y * 0.01 + tick * 1.5) * 0.05;
          } else if (fluidMode === "fountain") {
            p.vy -= 0.08 * fluidDensity;
            p.vx += (Math.random() - 0.5) * 0.1;
            if (p.y < -10) {
              p.x = W * 0.3 + Math.random() * W * 0.4;
              p.y = H * 0.95;
              p.vx = (Math.random() - 0.5) * 2;
              p.vy = -(Math.random() * 3 + 2);
            }
          } else if (fluidMode === "flow") {
            if (flowField) {
              var angle = flowNoise(p.x, p.y, tick) * Math.PI * 2;
              p.vx += Math.cos(angle) * 0.08 * fluidDensity;
              p.vy += Math.sin(angle) * 0.08 * fluidDensity;
            }
          }

          // Mouse interaction
          var dx = mouseX - p.x,
            dy = mouseY - p.y;
          var dist = Math.sqrt(dx * dx + dy * dy) + 1;
          if (dist < 160) {
            var f = (mouseForce * (1 - dist / 160)) / (viscosity + 0.1);
            if (fluidMode === "burst") {
              var ba = Math.atan2(dy, dx);
              p.vx -= Math.cos(ba) * f * 0.6;
              p.vy -= Math.sin(ba) * f * 0.6;
            } else if (fluidMode === "swirl") {
              p.vx += (-dy / dist) * f * 0.9;
              p.vy += (dx / dist) * f * 0.9;
            } else if (fluidMode === "vortex") {
              p.vx += (dx / dist) * f * 0.2 + dmx * 0.04;
              p.vy += (dy / dist) * f * 0.2 + dmy * 0.04;
            } else {
              p.vx += (dx / dist) * f * 0.25 + dmx * 0.06;
              p.vy += (dy / dist) * f * 0.25 + dmy * 0.06;
            }
          }

          // Turbulence
          p.vx += (Math.random() - 0.5) * fluidTurbulence * 0.25;
          p.vy += (Math.random() - 0.5) * fluidTurbulence * 0.25;

          // Damping
          p.vx *= decay;
          p.vy *= decay;

          // Pressure — sample a stride of particles, not just first 5
          if (fluidPressure > 0) {
            var stride = Math.max(1, Math.floor(particleCount / 12));
            for (var n = 0; n < particleCount; n += stride) {
              var q = particles[n];
              if (q === p) continue;
              var pdx = p.x - q.x,
                pdy = p.y - q.y;
              var pd = Math.sqrt(pdx * pdx + pdy * pdy) + 1;
              if (pd < 28) {
                var push = fluidPressure * (1 - pd / 28) * 0.025;
                p.vx += (pdx / pd) * push;
                p.vy += (pdy / pd) * push;
              }
            }
          }

          p.x += p.vx;
          p.y += p.vy;

          if (fluidMode !== "fountain") {
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;
          } else {
            if (p.x < 0 || p.x > W) p.vx *= -0.5;
          }

          // Color blending
          var blend;
          if (colorBlend === "random") {
            blend = p.randColor;
          } else if (colorBlend === "alternating") {
            blend = pi % 2 === 0 ? 0 : 1;
          } else if (colorBlend === "solid") {
            blend = 0;
          } else if (colorBlend === "velocity") {
            var spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            blend = Math.min(1, spd / 8);
          } else if (colorBlend === "position") {
            blend = p.x / W;
          } else {
            // gradient — index-based
            blend = p.baseColor;
          }
          var col = lerpColor(c1, c2, blend);

          // Draw particle
          if (fluidGlow) {
            ctx.shadowBlur = glowSize;
            ctx.shadowColor = col;
          }
          ctx.globalAlpha = fluidOpacity;

          if (particleStyle === "ring") {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size + 1, 0, Math.PI * 2);
            ctx.strokeStyle = col;
            ctx.lineWidth = 1;
            ctx.stroke();
          } else if (particleStyle === "soft") {
            var grad = ctx.createRadialGradient(
              p.x,
              p.y,
              0,
              p.x,
              p.y,
              p.size * 2.5,
            );
            grad.addColorStop(0, col);
            grad.addColorStop(1, "rgba(0,0,0,0)");
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = col;
            ctx.fill();
          }

          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        });

        // Connection lines
        if (connectionLines) {
          var lineThresh = 60;
          ctx.globalAlpha = fluidOpacity * 0.3;
          for (var a = 0; a < particles.length; a += 2) {
            for (var b2 = a + 1; b2 < particles.length; b2 += 2) {
              var ldx = particles[a].x - particles[b2].x;
              var ldy = particles[a].y - particles[b2].y;
              var ld = Math.sqrt(ldx * ldx + ldy * ldy);
              if (ld < lineThresh) {
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b2].x, particles[b2].y);
                ctx.strokeStyle = lerpColor(c1, c2, particles[a].baseColor);
                ctx.lineWidth = (1 - ld / lineThresh) * 1.5;
                ctx.stroke();
              }
            }
          }
          ctx.globalAlpha = 1;
        }

        rafId = requestAnimationFrame(animate);
      }

      function onResize() {
        resize();
      }
      window.addEventListener("resize", onResize);

      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);

      el.addEventListener("disconnected", function () {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", onResize);
      });
    });
};

window._VeltroInitClothSimulation = function () {
  document
    .querySelectorAll(".fw-widget-clothSimulation:not([data-cloth-init])")
    .forEach(function (el) {
      el.setAttribute("data-cloth-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      function resize() {
        canvas.width = el.offsetWidth * dpr;
        canvas.height = el.offsetHeight * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();
      var W = el.offsetWidth;
      var H = el.offsetHeight;

      var wrap = el.querySelector(".veltro-cloth-wrap") || el;
      var ds = wrap.dataset;
      var cols = +(ds.cols || 20);
      var rows = +(ds.rows || 15);
      var stiffness = +(ds.stiffness || 0.9);
      var damping = +(ds.damping || 0.9);
      var color = ds.color || "#cdfe00";
      var clothGravity = +(ds.clothGravity || 0.5);
      var clothWind = ds.clothWind === "true";
      var windStrength = +(ds.windStrength || 0.2);
      var lineWidth = +(ds.lineWidth || 1);
      var lineOpacity = +(ds.lineOpacity || 80) / 100;
      var pinEdges = ds.pinEdges || "top";
      var mouseTear = ds.mouseTear === "true";
      var tearForce = +(ds.tearForce || 10);
      var useGradient = ds.useGradient === "true";

      var spacing = Math.min(W / (cols + 1), H / (rows + 1), 25);
      var offsetX = (W - (cols - 1) * spacing) / 2;
      var offsetY = 40;

      function hexToRgb(h) {
        h = h.replace("#", "");
        return {
          r: parseInt(h.substring(0, 2), 16),
          g: parseInt(h.substring(2, 4), 16),
          b: parseInt(h.substring(4, 6), 16),
        };
      }

      var pointColor = hexToRgb(color);

      var points = [];
      for (var y = 0; y < rows; y++) {
        for (var x = 0; x < cols; x++) {
          var px = x * spacing + offsetX;
          var py = y * spacing + offsetY;
          var pinned =
            (pinEdges === "top" && y === 0) ||
            (pinEdges === "all" &&
              (y === 0 || y === rows - 1 || x === 0 || x === cols - 1));
          points.push({
            x: px,
            y: py,
            ox: px,
            oy: py,
            vx: 0,
            vy: 0,
            pinned: pinned,
            active: true,
          });
        }
      }

      var mouseX = 0,
        mouseY = 0,
        prevMouseX = 0,
        prevMouseY = 0,
        mouseDown = false;
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      });
      el.addEventListener("mousedown", function () {
        mouseDown = true;
      });
      el.addEventListener("mouseup", function () {
        mouseDown = false;
      });
      el.addEventListener("mouseleave", function () {
        mouseDown = false;
      });

      var windTime = 0;

      var rafId = 0;
      function animate() {
        if (!canvas.isConnected) return;
        W = el.offsetWidth;
        H = el.offsetHeight;
        windTime += 0.02;

        ctx.clearRect(0, 0, W, H);

        var windX = clothWind ? Math.sin(windTime) * windStrength * 3 : 0;

        points.forEach(function (p) {
          if (p.pinned || !p.active) return;

          var dx = mouseX - p.x,
            dy = mouseY - p.y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (mouseDown) {
            if (dist < 60) {
              var pf = 1 - dist / 60;
              p.vx += dx * pf * 0.03;
              p.vy += dy * pf * 0.03;
            }
            if (mouseTear && dist < 20) {
              var tearDist =
                Math.abs(prevMouseX - mouseX) + Math.abs(prevMouseY - mouseY);
              if (tearDist > tearForce) {
                p.active = false;
                return;
              }
            }
          }

          p.vy += clothGravity * 0.5;
          p.vx += windX * 0.05;
          p.vx += (p.ox - p.x) * stiffness * 0.02;
          p.vy += (p.oy - p.y) * stiffness * 0.02;
          p.vx *= damping * 0.97 + 0.03;
          p.vy *= damping * 0.97 + 0.03;
          p.x += p.vx;
          p.y += p.vy;
        });

        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        var maxDist = spacing * 2.5;

        for (var y = 0; y < rows; y++) {
          for (var x = 0; x < cols - 1; x++) {
            var idx = y * cols + x;
            var p1 = points[idx],
              p2 = points[idx + 1];
            if (!p1.active || !p2.active) continue;
            if (Math.hypot(p1.x - p2.x, p1.y - p2.y) > maxDist) continue;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }
        for (var x = 0; x < cols; x++) {
          for (var y = 0; y < rows - 1; y++) {
            var idx = y * cols + x;
            var p1 = points[idx],
              p2 = points[idx + cols];
            if (!p1.active || !p2.active) continue;
            if (Math.hypot(p1.x - p2.x, p1.y - p2.y) > maxDist) continue;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
          }
        }

        if (useGradient) {
          var grad = ctx.createLinearGradient(0, 0, W, H);
          var c2r = Math.min(255, pointColor.r + 80);
          var c2g = Math.min(255, pointColor.g + 80);
          var c2b = Math.min(255, pointColor.b + 80);
          grad.addColorStop(
            0,
            "rgba(" +
              pointColor.r +
              "," +
              pointColor.g +
              "," +
              pointColor.b +
              "," +
              lineOpacity +
              ")",
          );
          grad.addColorStop(
            1,
            "rgba(" + c2r + "," + c2g + "," + c2b + "," + lineOpacity + ")",
          );
          ctx.strokeStyle = grad;
        } else {
          ctx.strokeStyle =
            "rgba(" +
            pointColor.r +
            "," +
            pointColor.g +
            "," +
            pointColor.b +
            "," +
            lineOpacity +
            ")";
        }
        ctx.stroke();
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
      window.addEventListener("resize", resize);
    });
};

window._VeltroInitMagneticFields = function () {
  document
    .querySelectorAll(".fw-widget-magneticFields:not([data-mf-init])")
    .forEach(function (el) {
      el.setAttribute("data-mf-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;

      function resize() {
        var W = el.offsetWidth;
        var H = el.offsetHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { W: W, H: H };
      }
      var dims = resize();

      var wrap = el.querySelector(".veltro-magfield-wrap") || el;
      var ds = wrap.dataset;
      var particleCount = +(ds.particleCount || 80);
      var fieldStrength = +(ds.fieldStrength || 0.5);
      var particleColor = ds.particleColor || "#34d399";
      var particleSize = +(ds.particleSize || 2);
      var fieldLines = ds.fieldLines !== "false";
      var lineOpacity = (+(ds.fieldLineOpacity || 30)) / 100;
      var fieldMode = ds.fieldMode || "dipole";
      var particleTrail = ds.particleTrail !== "false";
      var particleGlow = ds.particleGlow === "true";
      var glowColor = ds.glowColor || "#34d399";

      var particles = [];
      for (var i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * dims.W,
          y: Math.random() * dims.H,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          angle: Math.random() * Math.PI * 2,
        });
      }

      var rafId = 0;
      var tick = 0;
      function animate() {
        if (!el.isConnected) return;
        tick++;
        var newDims = resize();
        dims = newDims;

        var fade = particleTrail ? 0.15 : 1;
        ctx.fillStyle = "rgba(5,5,15," + fade + ")";
        ctx.fillRect(0, 0, dims.W, dims.H);

        if (particleGlow) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = glowColor;
        }

        particles.forEach(function (p) {
          var cx = dims.W / 2, cy = dims.H / 2;
          if (fieldMode === "quadrupole") {
            cx = Math.abs(p.x - dims.W / 2) < dims.W * 0.25 ? dims.W * 0.25 : dims.W * 0.75;
            cy = Math.abs(p.y - dims.H / 2) < dims.H * 0.25 ? dims.H * 0.25 : dims.H * 0.75;
          } else if (fieldMode === "vortex") {
            cx = dims.W / 2;
            cy = dims.H / 2;
          } else if (fieldMode === "random") {
            cx = dims.W * 0.5 + Math.sin(tick * 0.02 + p.angle) * dims.W * 0.3;
            cy = dims.H * 0.5 + Math.cos(tick * 0.017 + p.angle) * dims.H * 0.3;
          }

          var dx = cx - p.x, dy = cy - p.y;
          var dist = Math.sqrt(dx * dx + dy * dy) + 1;
          var force = fieldStrength * 50 / (dist * dist);

          if (fieldMode === "vortex") {
            p.vx += (-dy / dist) * force * 0.15;
            p.vy += (dx / dist) * force * 0.15;
          } else {
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }

          p.vx *= 0.98;
          p.vy *= 0.98;
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > dims.W || p.y < 0 || p.y > dims.H) {
            p.x = Math.random() * dims.W;
            p.y = Math.random() * dims.H;
            p.vx = (Math.random() - 0.5) * 2;
            p.vy = (Math.random() - 0.5) * 2;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, particleSize, 0, Math.PI * 2);
          ctx.fillStyle = particleColor;
          ctx.fill();
        });

        if (fieldLines) {
          ctx.globalAlpha = lineOpacity;
          ctx.strokeStyle = particleColor;
          ctx.lineWidth = 0.5;
          for (var a = 0; a < particles.length; a += 3) {
            for (var b = a + 1; b < particles.length; b += 3) {
              var ldx = particles[a].x - particles[b].x;
              var ldy = particles[a].y - particles[b].y;
              var ld = Math.sqrt(ldx * ldx + ldy * ldy);
              if (ld < 60) {
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
              }
            }
          }
          ctx.globalAlpha = 1;
        }

        ctx.shadowBlur = 0;
        rafId = requestAnimationFrame(animate);
      }

      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitPendulumWave = function () {
  document
    .querySelectorAll(".fw-widget-pendulumWave:not([data-pw-init])")
    .forEach(function (el) {
      el.setAttribute("data-pw-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");

      var wrap = el.querySelector("[class*='pendulum-wrap']") || el;
      var ds = wrap.dataset;
      var count = Math.max(2, +(ds.count || 12));
      var speed = +(ds.speed || 1);
      var color = ds.color || "#cdfe00";
      var color2 = ds.color2 || "#3b82f6";
      var colorMode = ds.colorMode || "single";
      var lineColor = ds.lineColor || "";
      var trailOn = ds.showTrail === "true";
      var trailLen = Math.max(5, +(ds.trailLength || 20));
      var amp = +(ds.amplitude || 80);
      var pLen = Math.max(30, +(ds.pendulumLength || 100));
      var bobSize = Math.max(2, +(ds.bobSize || 6));
      var lineW = Math.max(0, +(ds.lineWidth || 1));
      var gravity = +(ds.gravity || 1);
      var layout = ds.layout || "bottom";
      var bobShape = ds.bobShape || "circle";
      var glow = ds.glow === "true";
      var waveMode = ds.waveMode || "sine";

      function resize() {
        canvas.width = el.offsetWidth;
        canvas.height = el.offsetHeight;
      }
      resize();
      var W = canvas.width,
        H = canvas.height;

      var pendulums = [],
        trails = [];
      for (var i = 0; i < count; i++) {
        var ratio = i / Math.max(count - 1, 1);
        if (layout === "center") {
          var a = (i / count) * Math.PI * 2;
          var r = Math.min(W, H) * 0.25;
          pendulums.push({
            ax: W / 2 + Math.cos(a) * r,
            ay: H / 2 + Math.sin(a) * r,
            len: pLen * (0.6 + ratio * 0.6),
            angle: 0.3,
            vel: 0,
            phase: ratio * Math.PI * 0.8,
            freq:
              waveMode === "progressive"
                ? 0.7 + ratio * 0.3
                : 0.88 + ratio * 0.12,
          });
        } else if (layout === "scattered") {
          pendulums.push({
            ax: 30 + Math.random() * Math.max(W - 60, 1),
            ay: 30 + Math.random() * Math.max(H * 0.3, 1),
            len: pLen * (0.5 + Math.random() * 0.8),
            angle: 0.15 + Math.random() * 0.2,
            vel: 0,
            phase: Math.random() * Math.PI * 2,
            freq: 0.8 + Math.random() * 0.4,
          });
        } else {
          pendulums.push({
            ax: ((i + 0.5) / count) * W,
            ay: Math.min(H * 0.12, 40),
            len: pLen * (0.7 + ratio * 0.6),
            angle: Math.PI / 4,
            vel: 0,
            phase: ratio * Math.PI * 0.8,
            freq: 0.02 + ratio * 0.012,
          });
        }
        if (trailOn) trails.push([]);
      }

      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var mx = e.clientX - rect.left,
          my = e.clientY - rect.top;
        for (var k = 0; k < pendulums.length; k++) {
          var p = pendulums[k];
          var dx = mx - p.ax,
            dy = my - p.ay;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < p.len * 1.5) {
            p.angle += (dx > 0 ? 1 : -1) * (1 - dist / (p.len * 1.5)) * 0.005;
          }
        }
      });

      function drawBob(x, y, r, col) {
        ctx.beginPath();
        if (bobShape === "ring") {
          ctx.arc(x, y, r, 0, 7);
          ctx.strokeStyle = col;
          ctx.lineWidth = Math.max(2, r * 0.35);
          ctx.stroke();
        } else if (bobShape === "diamond") {
          ctx.moveTo(x, y - r * 1.4);
          ctx.lineTo(x + r, y);
          ctx.lineTo(x, y + r * 1.4);
          ctx.lineTo(x - r, y);
          ctx.closePath();
          ctx.fillStyle = col;
          ctx.fill();
        } else if (bobShape === "drop") {
          ctx.moveTo(x, y - r * 1.6);
          ctx.bezierCurveTo(
            x + r,
            y - r * 0.3,
            x + r,
            y + r * 1,
            x,
            y + r * 1.2,
          );
          ctx.bezierCurveTo(
            x - r,
            y + r * 1,
            x - r,
            y - r * 0.3,
            x,
            y - r * 1.6,
          );
          ctx.closePath();
          ctx.fillStyle = col;
          ctx.fill();
        } else {
          ctx.arc(x, y, r, 0, 7);
          ctx.fillStyle = col;
          ctx.fill();
        }
      }

      var t = 0;
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        t += 0.016 * speed;
        if (trailOn) {
          ctx.fillStyle = "rgba(5,5,15,0.1)";
          ctx.fillRect(0, 0, W, H);
        } else {
          ctx.fillStyle = "#0d0d1a";
          ctx.fillRect(0, 0, W, H);
        }

        for (var k = 0; k < pendulums.length; k++) {
          var p = pendulums[k];
          var ratio = k / Math.max(count - 1, 1);
          var angle;

          if (waveMode === "bounce") {
            angle = Math.sin(t * p.freq * 3 + p.phase) * 0.6;
          } else if (waveMode === "chaos") {
            angle =
              Math.sin(t * 0.7 + p.phase) * 0.4 +
              Math.sin(t * 1.3 + ratio * 2) * 0.3;
          } else if (waveMode === "progressive") {
            angle = Math.sin(t * (0.8 + ratio * 0.2) + ratio * 1.5) * 0.5;
          } else if (layout === "bottom") {
            angle = p.angle * Math.cos(t * p.freq * 10 + p.phase);
          } else {
            angle = Math.sin(t * p.freq * 8 + p.phase) * 0.5;
          }

          var bx = p.ax + Math.sin(angle) * p.len * (amp / 80);
          var by = p.ay + Math.cos(angle) * p.len;

          if (trailOn && trails[k]) {
            trails[k].push([bx, by]);
            if (trails[k].length > trailLen) trails[k].shift();
          }

          var col;
          if (colorMode === "rainbow") {
            col = "hsl(" + (((k * 360) / count + t * 50) % 360) + ",80%,60%)";
          } else if (colorMode === "gradient") {
            var h1 = parseInt(color.slice(1, 3), 16),
              h2 = parseInt(color.slice(3, 5), 16),
              h3 = parseInt(color.slice(5, 7), 16);
            var t1 = parseInt(color2.slice(1, 3), 16),
              t2 = parseInt(color2.slice(3, 5), 16),
              t3 = parseInt(color2.slice(5, 7), 16);
            col =
              "rgb(" +
              Math.round(h1 + (t1 - h1) * ratio) +
              "," +
              Math.round(h2 + (t2 - h2) * ratio) +
              "," +
              Math.round(h3 + (t3 - h3) * ratio) +
              ")";
          } else {
            col = color;
          }

          if (glow) {
            ctx.shadowBlur = bobSize * 4;
            ctx.shadowColor = col;
          }

          if (trailOn && trails[k] && trails[k].length > 1) {
            for (var j = 1; j < trails[k].length; j++) {
              var a = j / trails[k].length;
              ctx.beginPath();
              ctx.arc(
                trails[k][j][0],
                trails[k][j][1],
                bobSize * a * 0.3,
                0,
                7,
              );
              ctx.fillStyle = col;
              ctx.globalAlpha = a * 0.3;
              ctx.fill();
            }
            ctx.globalAlpha = 1;
          }

          ctx.beginPath();
          ctx.moveTo(p.ax, p.ay);
          ctx.lineTo(bx, by);
          ctx.strokeStyle = lineColor || col;
          ctx.lineWidth = lineW;
          ctx.stroke();

          drawBob(bx, by, bobSize, col);
          ctx.shadowBlur = 0;
        }
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};
window._VeltroInitCollisionChaos = function () {
  document
    .querySelectorAll(".fw-widget-collisionChaos:not([data-cc-init])")
    .forEach(function (el) {
      el.setAttribute("data-cc-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var W, H;
      function resize() {
        W = el.offsetWidth;
        H = el.offsetHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();

      var wrap = el.querySelector(".veltro-chaos-wrap") || el;
      var ds = wrap.dataset;
      var spawnRate = +(ds.spawnRate || 1);
      var gravityStr = +(ds.gravity || 1) * 0.18;
      var restitution = +(ds.restitution || 0.7);
      var ballShape = ds.ballShape || "circle";
      var rawColors = (
        ds.ballColors || "#ff6b35,#cdfe00,#3b82f6,#ec4899,#f59e0b"
      ).split(",");
      var ballMinSize = +(ds.ballMinSize || 10);
      var ballMaxSize = +(ds.ballMaxSize || 30);
      var maxBalls = +(ds.maxBalls || 50);
      var ballGlow = ds.ballGlow !== "false";
      var friction = +(ds.friction || 0.99);
      var ballStyle = ds.ballStyle || "glass";
      var trailLength = +(ds.trailLength !== undefined ? ds.trailLength : 40);
      var spawnOnClick = ds.spawnOnClick !== "false";
      var trailAlpha = Math.max(0.04, Math.min(0.95, 1 - trailLength / 110));

      function hexToRgb(h) {
        h = (h || "#ffffff").replace("#", "").trim();
        if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        return [
          parseInt(h.slice(0, 2), 16),
          parseInt(h.slice(2, 4), 16),
          parseInt(h.slice(4, 6), 16),
        ];
      }

      var shapes = ["circle", "square", "triangle", "diamond"];
      var balls = [];
      var spawnAccum = 0;

      function pickShape() {
        return ballShape === "mixed"
          ? shapes[Math.floor(Math.random() * shapes.length)]
          : ballShape;
      }

      function spawnBall(x, y, burst) {
        if (balls.length >= maxBalls) return;
        var r = ballMinSize + Math.random() * (ballMaxSize - ballMinSize);
        var col =
          rawColors[Math.floor(Math.random() * rawColors.length)].trim();
        balls.push({
          x: x !== undefined ? x : r + Math.random() * (W - r * 2),
          y: y !== undefined ? y : -r - Math.random() * 40,
          vx: burst
            ? Math.cos(Math.random() * Math.PI * 2) * (3 + Math.random() * 5)
            : (Math.random() - 0.5) * 3,
          vy: burst
            ? Math.sin(Math.random() * Math.PI * 2) * (3 + Math.random() * 5)
            : Math.random() * 2 + 0.5,
          r: r,
          color: col,
          rgb: hexToRgb(col),
          shape: pickShape(),
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.08,
          born: 0,
          scale: burst ? 0 : 1,
        });
      }

      for (var i = 0; i < Math.min(20, maxBalls); i++) {
        var initR = ballMinSize + Math.random() * (ballMaxSize - ballMinSize);
        var col0 =
          rawColors[Math.floor(Math.random() * rawColors.length)].trim();
        balls.push({
          x: initR + Math.random() * (W - initR * 2),
          y: initR + Math.random() * (H - initR * 2),
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          r: initR,
          color: col0,
          rgb: hexToRgb(col0),
          shape: pickShape(),
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.06,
          born: 0,
          scale: 1,
        });
      }

      if (spawnOnClick) {
        el.addEventListener("click", function (e) {
          var rect = el.getBoundingClientRect();
          var cx = e.clientX - rect.left,
            cy = e.clientY - rect.top;
          var burst = Math.min(6, maxBalls - balls.length);
          for (var k = 0; k < burst; k++) spawnBall(cx, cy, true);
        });
      }

      function drawBall(b) {
        ctx.save();
        ctx.translate(b.x, b.y);
        if (b.shape !== "circle") ctx.rotate(b.rot);
        if (b.scale !== 1) ctx.scale(b.scale, b.scale);

        var r = b.r;
        ctx.beginPath();
        if (b.shape === "square") {
          ctx.rect(-r, -r, r * 2, r * 2);
        } else if (b.shape === "triangle") {
          ctx.moveTo(0, -r);
          ctx.lineTo(r * 0.866, r * 0.5);
          ctx.lineTo(-r * 0.866, r * 0.5);
          ctx.closePath();
        } else if (b.shape === "diamond") {
          ctx.moveTo(0, -r * 1.1);
          ctx.lineTo(r * 0.75, 0);
          ctx.lineTo(0, r * 1.1);
          ctx.lineTo(-r * 0.75, 0);
          ctx.closePath();
        } else {
          ctx.arc(0, 0, r, 0, Math.PI * 2);
        }

        if (ballStyle === "glass") {
          var grad = ctx.createRadialGradient(
            -r * 0.3,
            -r * 0.35,
            r * 0.05,
            0,
            0,
            r * 1.05,
          );
          grad.addColorStop(0, "rgba(255,255,255,0.6)");
          grad.addColorStop(0.3, b.color);
          grad.addColorStop(
            1,
            "rgba(" + b.rgb[0] + "," + b.rgb[1] + "," + b.rgb[2] + ",0.35)",
          );
          if (ballGlow) {
            ctx.shadowBlur = r * 1.4;
            ctx.shadowColor = b.color;
          }
          ctx.fillStyle = grad;
          ctx.fill();
          // rim light
          ctx.strokeStyle = "rgba(255,255,255,0.2)";
          ctx.lineWidth = 1;
          ctx.stroke();
          // specular blob
          ctx.beginPath();
          ctx.ellipse(
            -r * 0.22,
            -r * 0.28,
            r * 0.3,
            r * 0.16,
            -0.5,
            0,
            Math.PI * 2,
          );
          ctx.fillStyle = "rgba(255,255,255,0.28)";
          ctx.shadowBlur = 0;
          ctx.fill();
        } else if (ballStyle === "neon") {
          ctx.shadowBlur = r * 2.5;
          ctx.shadowColor = b.color;
          ctx.fillStyle =
            "rgba(" + b.rgb[0] + "," + b.rgb[1] + "," + b.rgb[2] + ",0.15)";
          ctx.fill();
          ctx.strokeStyle = b.color;
          ctx.lineWidth = 2;
          ctx.stroke();
          // inner ring
          ctx.beginPath();
          if (b.shape === "circle") ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,255,255,0.5)";
          ctx.lineWidth = 1;
          ctx.shadowBlur = r;
          ctx.stroke();
        } else {
          // solid
          if (ballGlow) {
            ctx.shadowBlur = r * 0.8;
            ctx.shadowColor = b.color;
          }
          ctx.fillStyle = b.color;
          ctx.fill();
        }

        ctx.restore();
      }

      var tick = 0;
      var rafId = 0;

      function animate() {
        if (!canvas.isConnected) return;
        tick++;

        ctx.fillStyle = "rgba(5,5,20," + trailAlpha + ")";
        ctx.fillRect(0, 0, W, H);

        // Auto-spawn
        spawnAccum += spawnRate * 0.016;
        while (spawnAccum >= 1 && balls.length < maxBalls) {
          spawnBall();
          spawnAccum -= 1;
        }

        // Physics update
        for (var i = 0; i < balls.length; i++) {
          var b = balls[i];
          b.born++;
          if (b.scale < 1) b.scale = Math.min(1, b.scale + 0.08);

          b.vy += gravityStr;
          b.vx *= friction;
          b.vy *= friction;
          b.x += b.vx;
          b.y += b.vy;
          b.rot += b.rotV;

          // Wall bounce
          if (b.x - b.r < 0) {
            b.x = b.r;
            b.vx = Math.abs(b.vx) * restitution;
            b.rotV *= -0.5;
          }
          if (b.x + b.r > W) {
            b.x = W - b.r;
            b.vx = -Math.abs(b.vx) * restitution;
            b.rotV *= -0.5;
          }
          if (b.y + b.r > H) {
            b.y = H - b.r;
            b.vy = -Math.abs(b.vy) * restitution;
            b.vx *= 0.97;
          }
          if (b.y - b.r < 0) {
            b.y = b.r;
            b.vy = Math.abs(b.vy) * restitution;
          }
        }

        // Ball-to-ball collisions
        for (var a = 0; a < balls.length; a++) {
          for (var bb = a + 1; bb < balls.length; bb++) {
            var ba = balls[a],
              bbb = balls[bb];
            var dx = bbb.x - ba.x,
              dy = bbb.y - ba.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            var minD = ba.r + bbb.r;
            if (dist < minD && dist > 0.001) {
              var nx = dx / dist,
                ny = dy / dist;
              var overlap = (minD - dist) * 0.52;
              ba.x -= nx * overlap;
              ba.y -= ny * overlap;
              bbb.x += nx * overlap;
              bbb.y += ny * overlap;
              var dvx = bbb.vx - ba.vx,
                dvy = bbb.vy - ba.vy;
              var dot = dvx * nx + dvy * ny;
              if (dot < 0) {
                var j = dot * restitution;
                ba.vx += j * nx;
                ba.vy += j * ny;
                bbb.vx -= j * nx;
                bbb.vy -= j * ny;
                // Spin exchange on impact
                ba.rotV += j * 0.03;
                bbb.rotV -= j * 0.03;
              }
            }
          }
        }

        // Draw — clear shadow before each frame of drawing
        ctx.shadowBlur = 0;
        for (var d = 0; d < balls.length; d++) drawBall(balls[d]);
        ctx.shadowBlur = 0;

        rafId = requestAnimationFrame(animate);
      }

      var onResize = function () {
        resize();
      };
      window.addEventListener("resize", onResize);

      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitBlackHole = function () {
  document
    .querySelectorAll(".fw-widget-blackHole:not([data-bh-init])")
    .forEach(function (el) {
      el.setAttribute("data-bh-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      var W, H;
      function resize() {
        W = el.offsetWidth;
        H = el.offsetHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      resize();

      var wrap = el.querySelector(".veltro-blackhole-wrap") || el;
      var ds = wrap.dataset;
      var particleCount = +(ds.particleCount || 150);
      var pullStrength = +(ds.pullStrength || 0.5);
      var accretionColor = ds.accretionColor || "#ff6b35";
      var bhSize = +(ds.blackHoleSize || 30);
      var eventHorizon = +(ds.eventHorizon || 50);
      var particleSize = +(ds.particleSize || 2);
      var particleTrail = ds.particleTrail !== "false";
      var accretionDisk = ds.accretionDisk !== "false";
      var diskOpacity = +(ds.diskOpacity || 60) / 100;
      var particleGlow = ds.particleGlow !== "false";
      var jetEnabled = ds.jetEnabled === "true";
      var jetColor = ds.jetColor || "#7c3aed";

      function hexToRgb(h) {
        h = (h || "#ffffff").replace("#", "");
        return [
          parseInt(h.slice(0, 2), 16),
          parseInt(h.slice(2, 4), 16),
          parseInt(h.slice(4, 6), 16),
        ];
      }
      var acRgb = hexToRgb(accretionColor);
      var jRgb = hexToRgb(jetColor);

      // Particles in polar coords around centre
      var particles = [];
      for (var i = 0; i < particleCount; i++) {
        var minR = eventHorizon * 1.1;
        var maxR0 = Math.min(W, H) * 0.45;
        var r0 = minR + Math.pow(Math.random(), 0.6) * (maxR0 - minR);
        particles.push({
          angle: Math.random() * Math.PI * 2,
          r: r0,
          speed: pullStrength * 0.014 * Math.pow(minR / r0, 0.75),
          spiralRate: 0.004 + Math.random() * 0.006,
          size: particleSize * (0.4 + Math.random() * 0.9),
          opacity: 0.45 + Math.random() * 0.55,
          dir: Math.random() > 0.15 ? 1 : -1,
        });
      }

      // Jet stream particles (lazy-created)
      var jetPts = [];
      if (jetEnabled) {
        for (var j = 0; j < 70; j++) {
          var jdir = j % 2 === 0 ? 1 : -1;
          jetPts.push({
            x: (Math.random() - 0.5) * bhSize * 0.35,
            y: jdir * (bhSize + Math.random() * Math.min(H, W) * 0.4),
            spd: (1.8 + Math.random() * 2.5) * jdir,
            sz: 0.8 + Math.random() * 1.8,
            op: Math.random(),
          });
        }
      }

      // Background star field (drawn once)
      var stars = [];
      for (var s = 0; s < 120; s++) {
        stars.push({
          x: Math.random(),
          y: Math.random(),
          sz: Math.random() * 1.2 + 0.3,
          op: Math.random() * 0.5 + 0.1,
        });
      }

      var tick = 0;
      var rafId = 0;

      function drawStars(cx, cy) {
        stars.forEach(function (st) {
          var sx = st.x * W;
          var sy = st.y * H;
          // Lensing: stars near BH get distorted outward
          var ddx = sx - cx,
            ddy = sy - cy;
          var dd = Math.sqrt(ddx * ddx + ddy * ddy) + 1;
          var lens = Math.max(0, 1 - (bhSize * 2.5) / dd);
          ctx.globalAlpha = st.op * lens;
          ctx.beginPath();
          ctx.arc(sx, sy, st.sz, 0, Math.PI * 2);
          ctx.fillStyle = "#fff";
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      function drawAccretionDisk(cx, cy) {
        if (!accretionDisk) return;
        var maxR = Math.min(W, H) * 0.42;
        var minR = eventHorizon * 1.05;
        var bands = 48;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1, 0.3); // perspective flatten

        for (var b = bands - 1; b >= 0; b--) {
          var t = b / (bands - 1);
          var ro = minR + (maxR - minR) * (1 - t * 0.88);
          var ri = ro - ((maxR - minR) / bands) * 1.4;
          if (ri < minR * 0.9) ri = minR * 0.9;

          var r2, g2, b2;
          if (t < 0.25) {
            // Innermost — blue-white hot
            var tt = t / 0.25;
            r2 = Math.round(255 * (1 - tt) + acRgb[0] * tt);
            g2 = Math.round(240 * (1 - tt) + acRgb[1] * tt);
            b2 = Math.round(230 * (1 - tt) + acRgb[2] * tt);
          } else if (t < 0.65) {
            // Mid — accretion color
            r2 = acRgb[0];
            g2 = acRgb[1];
            b2 = acRgb[2];
          } else {
            // Outer — cool dim red
            var tt2 = (t - 0.65) / 0.35;
            r2 = Math.round(acRgb[0] * (1 - tt2) + 55 * tt2);
            g2 = Math.round(acRgb[1] * (1 - tt2) + 12 * tt2);
            b2 = Math.round(acRgb[2] * (1 - tt2) + 10 * tt2);
          }

          var alpha = diskOpacity * (0.25 + (1 - t) * 0.65);
          var grad = ctx.createRadialGradient(0, 0, ri, 0, 0, ro);
          grad.addColorStop(
            0,
            "rgba(" + r2 + "," + g2 + "," + b2 + "," + alpha * 1.4 + ")",
          );
          grad.addColorStop(1, "rgba(" + r2 + "," + g2 + "," + b2 + ",0)");

          ctx.beginPath();
          ctx.arc(0, 0, ro, 0, Math.PI * 2);
          if (ri > 1) ctx.arc(0, 0, ri, 0, Math.PI * 2, true);
          ctx.fillStyle = grad;
          ctx.fill();
        }

        // Bright inner rim — nearside glow
        ctx.shadowBlur = 18;
        ctx.shadowColor =
          "rgba(" + acRgb[0] + "," + acRgb[1] + "," + acRgb[2] + ",0.9)";
        ctx.beginPath();
        ctx.arc(0, 0, minR * 1.08, 0, Math.PI * 2);
        ctx.strokeStyle =
          "rgba(" +
          acRgb[0] +
          "," +
          acRgb[1] +
          "," +
          acRgb[2] +
          "," +
          diskOpacity * 1.2 +
          ")";
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();
      }

      function drawEventHorizon(cx, cy) {
        // Lensing glow rings outside singularity
        for (var ring = 5; ring >= 1; ring--) {
          var rr = bhSize * (1 + ring * 0.22);
          ctx.beginPath();
          ctx.arc(cx, cy, rr, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255,210,150," + 0.04 / ring + ")";
          ctx.lineWidth = ring * 4;
          ctx.shadowBlur = ring * 10;
          ctx.shadowColor = "rgba(255,170,80,0.25)";
          ctx.stroke();
        }
        ctx.shadowBlur = 0;

        // Photon ring — bright thin line
        ctx.beginPath();
        ctx.arc(cx, cy, bhSize * 1.07, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255,195,100,0.85)";
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 14;
        ctx.shadowColor = "rgba(255,200,80,1)";
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Absolute black hole — radial gradient to hard edge
        var sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, bhSize * 1.02);
        sg.addColorStop(0, "rgba(0,0,0,1)");
        sg.addColorStop(0.85, "rgba(0,0,0,1)");
        sg.addColorStop(1, "rgba(0,0,0,0.96)");
        ctx.beginPath();
        ctx.arc(cx, cy, bhSize * 1.02, 0, Math.PI * 2);
        ctx.fillStyle = sg;
        ctx.fill();
      }

      function drawJet(cx, cy) {
        if (!jetEnabled) return;
        var jLen = Math.min(H, W) * 0.44;

        [-1, 1].forEach(function (dir) {
          var g = ctx.createLinearGradient(cx, cy, cx, cy + dir * jLen);
          g.addColorStop(
            0,
            "rgba(" + jRgb[0] + "," + jRgb[1] + "," + jRgb[2] + ",0.75)",
          );
          g.addColorStop(
            0.35,
            "rgba(" + jRgb[0] + "," + jRgb[1] + "," + jRgb[2] + ",0.25)",
          );
          g.addColorStop(
            1,
            "rgba(" + jRgb[0] + "," + jRgb[1] + "," + jRgb[2] + ",0)",
          );
          ctx.save();
          ctx.shadowBlur = 22;
          ctx.shadowColor = jetColor;
          ctx.beginPath();
          ctx.moveTo(cx - bhSize * 0.28, cy);
          ctx.lineTo(cx + bhSize * 0.28, cy);
          ctx.lineTo(cx + bhSize * 0.06, cy + dir * jLen);
          ctx.lineTo(cx - bhSize * 0.06, cy + dir * jLen);
          ctx.closePath();
          ctx.fillStyle = g;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.restore();
        });

        var jMax = Math.min(H, W) * 0.5;
        jetPts.forEach(function (jp) {
          jp.y += jp.spd;
          if (Math.abs(jp.y) > jMax) {
            jp.y = (jp.spd > 0 ? 1 : -1) * bhSize;
            jp.x = (Math.random() - 0.5) * bhSize * 0.35;
            jp.op = Math.random();
          }
          var fade = 1 - Math.abs(jp.y) / jMax;
          ctx.beginPath();
          ctx.arc(cx + jp.x, cy + jp.y, jp.sz, 0, Math.PI * 2);
          ctx.fillStyle =
            "rgba(" +
            jRgb[0] +
            "," +
            jRgb[1] +
            "," +
            jRgb[2] +
            "," +
            jp.op * fade * 0.85 +
            ")";
          ctx.fill();
        });
      }

      function animate() {
        if (!canvas.isConnected) return;
        tick += 0.016;

        ctx.fillStyle = particleTrail
          ? "rgba(2,2,10,0.13)"
          : "rgba(2,2,10,0.96)";
        ctx.fillRect(0, 0, W, H);

        var cx = W / 2,
          cy = H / 2;

        drawStars(cx, cy);
        drawAccretionDisk(cx, cy);

        // Orbital particles
        var minR = eventHorizon * 0.97;
        var maxR = Math.min(W, H) * 0.45;
        particles.forEach(function (p) {
          p.angle += p.speed * p.dir;
          p.r -= p.spiralRate * pullStrength;
          if (p.r < minR) {
            p.r = minR + Math.pow(Math.random(), 0.6) * (maxR - minR);
            p.angle = Math.random() * Math.PI * 2;
            p.speed =
              pullStrength * 0.014 * Math.pow((eventHorizon * 1.1) / p.r, 0.75);
          }

          var px = cx + Math.cos(p.angle) * p.r;
          var py = cy + Math.sin(p.angle) * p.r * 0.32;

          // Nearside Doppler brightening
          var doppler = 0.45 + Math.max(0, Math.sin(p.angle)) * 0.55;
          // Radial temperature
          var tRad = Math.max(
            0,
            Math.min(1, (p.r - eventHorizon) / (maxR - eventHorizon)),
          );
          var r3, g3, b3;
          if (tRad < 0.3) {
            var bl = tRad / 0.3;
            r3 = Math.round(255 * (1 - bl) + acRgb[0] * bl);
            g3 = Math.round(235 * (1 - bl) + acRgb[1] * bl);
            b3 = Math.round(220 * (1 - bl) + acRgb[2] * bl);
          } else {
            var bl2 = Math.min(1, (tRad - 0.3) / 0.7);
            r3 = Math.round(acRgb[0] * (1 - bl2) + 60 * bl2);
            g3 = Math.round(acRgb[1] * (1 - bl2) + 15 * bl2);
            b3 = Math.round(acRgb[2] * (1 - bl2) + 12 * bl2);
          }

          var alpha = p.opacity * doppler * (0.35 + (1 - tRad) * 0.65);
          if (particleGlow) {
            ctx.shadowBlur = p.size * 3.5;
            ctx.shadowColor = "rgb(" + r3 + "," + g3 + "," + b3 + ")";
          }
          ctx.beginPath();
          ctx.arc(px, py, p.size * (1 + (1 - tRad) * 0.4), 0, Math.PI * 2);
          ctx.fillStyle =
            "rgba(" + r3 + "," + g3 + "," + b3 + "," + alpha + ")";
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        drawJet(cx, cy);
        drawEventHorizon(cx, cy);

        rafId = requestAnimationFrame(animate);
      }

      var onResize = function () {
        resize();
      };
      window.addEventListener("resize", onResize);

      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

// ── Batch 4: Scroll & Motion ──

window._VeltroInitParallaxDepth = function () {
  document
    .querySelectorAll(".fw-widget-parallaxDepth:not([data-pd-init])")
    .forEach(function (el) {
      el.setAttribute("data-pd-init", "1");
      var layers = el.querySelectorAll(".veltro-parallax-layer");
      window.addEventListener("scroll", function () {
        var rect = el.getBoundingClientRect();
        var progress = Math.max(
          0,
          Math.min(1, -rect.top / (rect.height + window.innerHeight) + 0.5),
        );
        layers.forEach(function (layer, i) {
          var depth = +layer.dataset.depth || (i + 1) * 0.2;
          layer.style.transform =
            "translateZ(" +
            progress * depth * 100 +
            "px) scale(" +
            (1 + progress * depth * 0.1) +
            ")";
        });
      });
    });
};

window._VeltroInitScrollTriggered = function () {
  document
    .querySelectorAll(".fw-widget-scrollTriggered:not([data-st-init])")
    .forEach(function (el) {
      el.setAttribute("data-st-init", "1");
      var wrap = el.querySelector(".veltro-scroll-reveal-wrap");
      if (!wrap) return;
      var animType = wrap.dataset.animationType || "fadeUp";
      var stagger = +(wrap.dataset.stagger || 100);
      var duration = +(wrap.dataset.duration || 800);
      var items = el.querySelectorAll(".veltro-scroll-reveal-item");

      var animStyles = {
        fadeUp: { from: "translateY(40px)", to: "translateY(0)" },
        fadeIn: { from: "none", to: "none" },
        slideLeft: { from: "translateX(60px)", to: "translateX(0)" },
        slideRight: { from: "translateX(-60px)", to: "translateX(0)" },
        slideDown: { from: "translateY(-40px)", to: "translateY(0)" },
        scaleUp: { from: "scale(0.8)", to: "scale(1)" },
        rotateIn: {
          from: "rotate(-15deg) scale(0.9)",
          to: "rotate(0) scale(1)",
        },
        flipIn: { from: "rotateX(90deg)", to: "rotateX(0)" },
        zoomIn: { from: "scale(0.5)", to: "scale(1)" },
      };

      var style = animStyles[animType] || animStyles.fadeUp;

      items.forEach(function (item, i) {
        item.style.opacity = "0";
        item.style.transform = style.from;
        item.style.transition =
          "opacity " + duration + "ms ease, transform " + duration + "ms ease";
        item.style.willChange = "opacity, transform";
      });

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var idx = +(entry.target.dataset.index || 0);
              setTimeout(function () {
                entry.target.style.opacity = "1";
                entry.target.style.transform = style.to;
              }, idx * stagger);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 },
      );
      items.forEach(function (item) {
        observer.observe(item);
      });
    });
};

window._VeltroInitHorizontalScrollGallery = function () {
  document
    .querySelectorAll(".fw-widget-horizontalScrollGallery:not([data-hsg-init])")
    .forEach(function (el) {
      el.setAttribute("data-hsg-init", "1");
      var track = el.querySelector(".veltro-hsg-track");
      if (!track) return;
      el.addEventListener("wheel", function (e) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          track.scrollLeft += e.deltaY;
        }
      });
    });
};

window._VeltroInitVelocitySkew = function () {
  document
    .querySelectorAll(".fw-widget-velocitySkew:not([data-vs-init])")
    .forEach(function (el) {
      el.setAttribute("data-vs-init", "1");
      var wrap = el.querySelector(".veltro-velskew-wrap") || el;
      var maxSkew = +(wrap.dataset.maxSkew || 15);
      var elasticity = +(wrap.dataset.elasticity || 0.8);
      var targets = el.querySelectorAll(".veltro-velskew-target");
      if (!targets.length) return;
      var lastScroll = 0;
      var velocity = 0;
      var rafId = 0;
      function update() {
        if (!el.isConnected) return;
        var current = wrap.scrollTop || 0;
        var raw = current - lastScroll;
        velocity += (raw - velocity) * elasticity;
        lastScroll = current;
        var skew = Math.max(-maxSkew, Math.min(maxSkew, velocity));
        targets.forEach(function (t) {
          t.style.transform = "skewX(" + skew + "deg)";
        });
        rafId = requestAnimationFrame(update);
      }
      wrap.addEventListener("scroll", function () {
        if (!rafId) rafId = requestAnimationFrame(update);
      }, { passive: true });
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(update);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

// ── Scroll Fluid (WebGL fluid sim) ──
window._VeltroInitScrollFluid = function () {
  document
    .querySelectorAll(".fw-widget-scrollFluid:not([data-sf-init])")
    .forEach(function (el) {
      el.setAttribute("data-sf-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) return;
      var wrap = el.querySelector(".veltro-fluid-wrap") || el;
      var ds = wrap.dataset;

      var color1 = ds.color1 || "#3b82f6";
      var color2 = ds.color2 || "#ec4899";
      var scrollStrength = +(ds.scrollStrength || 0.5);
      var cursorStrength = +(ds.cursorStrength || 0.2);
      var decay = +(ds.decay || 0.99);
      var intensity = +(ds.intensity || 1);
      var simRes = Math.max(64, Math.min(512, +(ds.resolution || 256)));
      var W = 0,
        H = 0;

      function hex3(h) {
        return [
          parseInt(h.slice(1, 3), 16) / 255,
          parseInt(h.slice(3, 5), 16) / 255,
          parseInt(h.slice(5, 7), 16) / 255,
        ];
      }

      function compileShader(src, type) {
        var s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          gl.deleteShader(s);
          return null;
        }
        return s;
      }

      function createProgram(vSrc, fSrc) {
        var vs = compileShader(vSrc, gl.VERTEX_SHADER);
        var fs = compileShader(fSrc, gl.FRAGMENT_SHADER);
        if (!vs || !fs) return null;
        var p = gl.createProgram();
        gl.attachShader(p, vs);
        gl.attachShader(p, fs);
        gl.linkProgram(p);
        if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
          gl.deleteProgram(p);
          return null;
        }
        return p;
      }

      var vertSrc =
        "attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0.0,1.0);}";

      var simFragSrc =
        "precision highp float;uniform sampler2D u_vel;uniform vec2 u_scroll;uniform vec2 u_mouse;uniform float u_dt;uniform float u_decay;uniform float u_scrollStr;uniform float u_cursorStr;uniform vec2 u_res;varying vec2 v_uv;void main(){vec2 vel=texture2D(u_vel,v_uv).rg;vec2 prev=v_uv-vel*u_dt*8.0/u_res;vec2 adv=texture2D(u_vel,clamp(prev,0.001,0.999)).rg;float mask=smoothstep(0.0,0.4,1.0-abs(v_uv.x-0.5))*0.6+0.4;adv+=u_scroll*u_scrollStr*mask*u_dt*5.0;float dm=exp(-length(v_uv-u_mouse)*3.0);adv+=normalize(u_mouse-v_uv)*u_cursorStr*dm*u_dt*3.0;adv*=u_decay;gl_FragColor=vec4(clamp(adv,-1.0,1.0),0.0,1.0);}";

      var dispFragSrc =
        "precision highp float;uniform sampler2D u_vel;uniform vec3 u_c1;uniform vec3 u_c2;uniform float u_intensity;varying vec2 v_uv;void main(){vec2 vel=texture2D(u_vel,v_uv).rg;float sp=length(vel);float m=clamp(sp*u_intensity*15.0,0.0,1.0);vec3 col=mix(u_c1,u_c2,m);col+=vec3(vel.y*0.15,0.0,-vel.y*0.1);gl_FragColor=vec4(col,m*0.8+0.2);}";

      var simProg = createProgram(vertSrc, simFragSrc);
      var dispProg = createProgram(vertSrc, dispFragSrc);
      if (!simProg || !dispProg) return;

      var quadBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      );

      function createFBO(w, h) {
        var tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          w,
          h,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          null,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        var fbo = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0,
          gl.TEXTURE_2D,
          tex,
          0,
        );
        return { fbo: fbo, tex: tex };
      }

      var fbo1 = createFBO(simRes, simRes);
      var fbo2 = createFBO(simRes, simRes);
      var curFBO = fbo1;

      function resize() {
        W = el.offsetWidth;
        H = el.offsetHeight;
        if (W < 1 || H < 1) return;
        canvas.width = W;
        canvas.height = H;
        gl.viewport(0, 0, W, H);
      }
      resize();

      // Scroll velocity tracking
      var lastScrollY = window.scrollY;
      var lastTime = performance.now();
      var scrollVel = 0;
      var targetScrollVel = 0;

      window.addEventListener(
        "scroll",
        function () {
          var now = performance.now();
          var dy = window.scrollY - lastScrollY;
          var dt = Math.max(1, now - lastTime);
          targetScrollVel = dy / dt;
          lastScrollY = window.scrollY;
          lastTime = now;
        },
        { passive: true },
      );

      // Mouse tracking
      var mouseX = 0.5,
        mouseY = 0.5;
      var prevMX = 0.5,
        prevMY = 0.5;
      canvas.addEventListener("mousemove", function (e) {
        var rect = canvas.getBoundingClientRect();
        prevMX = mouseX;
        prevMY = mouseY;
        mouseX = (e.clientX - rect.left) / W;
        mouseY = 1 - (e.clientY - rect.top) / H;
      });
      canvas.addEventListener("mouseleave", function () {
        prevMX = mouseX;
        prevMY = mouseY;
      });

      // Intersection Observer
      var visible = true;
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          visible = e.isIntersecting;
        });
      });
      obs.observe(el);

      // Animation loop
      var prevTime = performance.now();
      function animate() {
        if (!canvas.isConnected) {
          obs.disconnect();
          return;
        }
        var now = performance.now();
        var dt = Math.min(0.05, (now - prevTime) / 1000);
        prevTime = now;

        // Smooth scroll velocity
        scrollVel += (targetScrollVel - scrollVel) * 0.1;
        targetScrollVel *= 0.95;

        resize();

        if (visible && W > 0 && H > 0) {
          var mVX = (mouseX - prevMX) * 10;
          var mVY = (mouseY - prevMY) * 10;

          // Simulation step
          gl.useProgram(simProg);
          gl.bindFramebuffer(gl.FRAMEBUFFER, curFBO.fbo);
          gl.viewport(0, 0, simRes, simRes);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, (curFBO === fbo1 ? fbo2 : fbo1).tex);
          gl.uniform1i(gl.getUniformLocation(simProg, "u_vel"), 0);
          gl.uniform2f(
            gl.getUniformLocation(simProg, "u_scroll"),
            0,
            scrollVel * scrollStrength * 0.5,
          );
          gl.uniform2f(
            gl.getUniformLocation(simProg, "u_mouse"),
            mouseX,
            mouseY,
          );
          gl.uniform1f(gl.getUniformLocation(simProg, "u_dt"), dt);
          gl.uniform1f(gl.getUniformLocation(simProg, "u_decay"), decay);
          gl.uniform1f(
            gl.getUniformLocation(simProg, "u_scrollStr"),
            scrollStrength,
          );
          gl.uniform1f(
            gl.getUniformLocation(simProg, "u_cursorStr"),
            cursorStrength,
          );
          gl.uniform2f(gl.getUniformLocation(simProg, "u_res"), simRes, simRes);
          gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
          var loc = gl.getAttribLocation(simProg, "a_pos");
          gl.enableVertexAttribArray(loc);
          gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          curFBO = curFBO === fbo1 ? fbo2 : fbo1;

          // Display step
          gl.useProgram(dispProg);
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          gl.viewport(0, 0, W, H);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, curFBO.tex);
          gl.uniform1i(gl.getUniformLocation(dispProg, "u_vel"), 0);
          var c1 = hex3(color1),
            c2 = hex3(color2);
          gl.uniform3f(
            gl.getUniformLocation(dispProg, "u_c1"),
            c1[0],
            c1[1],
            c1[2],
          );
          gl.uniform3f(
            gl.getUniformLocation(dispProg, "u_c2"),
            c2[0],
            c2[1],
            c2[2],
          );
          gl.uniform1f(
            gl.getUniformLocation(dispProg, "u_intensity"),
            intensity,
          );
          var loc2 = gl.getAttribLocation(dispProg, "a_pos");
          gl.enableVertexAttribArray(loc2);
          gl.vertexAttribPointer(loc2, 2, gl.FLOAT, false, 0, 0);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }

        requestAnimationFrame(animate);
      }
      animate();
    });
};

window._VeltroInitVelocityFluidBg = function () {
  var VISC_DECAY = { air: 0.999, water: 0.995, honey: 0.965, glycerin: 0.93 };

  var VS =
    "attribute vec2 a_pos;varying vec2 v_uv;" +
    "void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0.0,1.0);}";

  var SIM_FS =
    "precision highp float;" +
    "uniform sampler2D u_vel;" +
    "uniform vec2 u_scroll,u_mouse,u_res;" +
    "uniform float u_dt,u_decay,u_scrollStr,u_chaos,u_chaosFreq,u_time;" +
    "varying vec2 v_uv;" +
    "float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}" +
    "float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);" +
    "return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}" +
    "void main(){" +
    "vec2 vel=texture2D(u_vel,v_uv).rg;" +
    "vec2 prev=v_uv-vel*u_dt*8.0/u_res;" +
    "vec2 adv=texture2D(u_vel,clamp(prev,0.001,0.999)).rg;" +
    "float mask=smoothstep(0.0,0.4,1.0-abs(v_uv.x-0.5))*0.6+0.4;" +
    "adv+=u_scroll*u_scrollStr*mask*u_dt*5.0;" +
    "float dm=exp(-length(v_uv-u_mouse)*3.0);" +
    "adv+=normalize(u_mouse-v_uv)*0.15*dm*u_dt*3.0;" +
    "if(u_chaos>0.001){" +
    "float n1=noise(v_uv*u_chaosFreq+u_time*0.3)*6.2832;" +
    "float n2=noise(v_uv*u_chaosFreq*1.7-u_time*0.15)*6.2832;" +
    "adv+=vec2(cos(n1),sin(n1))*u_chaos*u_dt*0.4;" +
    "adv+=vec2(-sin(n2),cos(n2))*u_chaos*u_dt*0.2;}" +
    "adv*=u_decay;" +
    "gl_FragColor=vec4(clamp(adv,-1.0,1.0),0.0,1.0);}";

  var DISP_FS =
    "precision highp float;" +
    "uniform sampler2D u_vel;" +
    "uniform vec3 u_c1,u_c2;" +
    "uniform float u_intensity;" +
    "varying vec2 v_uv;" +
    "void main(){" +
    "vec2 vel=texture2D(u_vel,v_uv).rg;" +
    "float sp=length(vel);" +
    "float m=clamp(sp*u_intensity*15.0,0.0,1.0);" +
    "vec3 col=mix(u_c1,u_c2,m);" +
    "col+=vec3(vel.y*0.15,0.0,-vel.y*0.1);" +
    "gl_FragColor=vec4(col,1.0);}";

  function hex3(h) {
    return [
      parseInt(h.slice(1, 3), 16) / 255,
      parseInt(h.slice(3, 5), 16) / 255,
      parseInt(h.slice(5, 7), 16) / 255,
    ];
  }

  function makeProgram(gl, vSrc, fSrc) {
    function compile(src, type) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    }
    var vs = compile(vSrc, gl.VERTEX_SHADER);
    var fs = compile(fSrc, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    return gl.getProgramParameter(prog, gl.LINK_STATUS) ? prog : null;
  }

  function makeFBO(gl, w, h) {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      w,
      h,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      tex,
      0,
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { fbo: fbo, tex: tex };
  }

  document
    .querySelectorAll(".vfbg-wrap:not([data-vfbg-init])")
    .forEach(function (wrap) {
      wrap.dataset.vfbgInit = "1";
      var canvas = wrap.querySelector(".vfbg-canvas");
      if (!canvas) return;
      var gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) return;

      var ds = wrap.dataset;
      var color1 = ds.color1 || "#818cf8";
      var color2 = ds.color2 || "#f472b6";
      var viscKey = ds.viscosity || "water";
      var decay = VISC_DECAY[viscKey] || 0.995;
      var sensitivity = +(ds.sensitivity || 1);
      var flowAngle = +(ds.flowAngle || 90);
      var chaosEnabled = ds.chaos === "1";
      var chaosFreq = +(ds.chaosFreq || 2);
      var simRes = Math.max(64, Math.min(512, +(ds.resolution || 256)));

      var simProg = makeProgram(gl, VS, SIM_FS);
      var dispProg = makeProgram(gl, VS, DISP_FS);
      if (!simProg || !dispProg) return;

      var quadBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW,
      );

      var fbo1 = makeFBO(gl, simRes, simRes);
      var fbo2 = makeFBO(gl, simRes, simRes);
      var cur = fbo1;

      var W = 0,
        H = 0;
      function resize() {
        W = wrap.offsetWidth;
        H = wrap.offsetHeight;
        if (W < 1 || H < 1) return;
        canvas.width = W;
        canvas.height = H;
        gl.viewport(0, 0, W, H);
      }
      resize();

      var lastScrollY = window.scrollY;
      var lastScrollT = performance.now();
      var scrollVel = 0;
      var targetScrollVel = 0;
      window.addEventListener(
        "scroll",
        function () {
          var now = performance.now();
          var dy = window.scrollY - lastScrollY;
          var dt = Math.max(1, now - lastScrollT);
          targetScrollVel = dy / dt;
          lastScrollY = window.scrollY;
          lastScrollT = now;
        },
        { passive: true },
      );

      var mouseX = 0.5,
        mouseY = 0.5;
      canvas.addEventListener("mousemove", function (e) {
        var r = canvas.getBoundingClientRect();
        mouseX = (e.clientX - r.left) / W;
        mouseY = 1 - (e.clientY - r.top) / H;
      });
      canvas.addEventListener("mouseleave", function () {
        mouseX = 0.5;
        mouseY = 0.5;
      });

      var time = 0;
      var prevT = performance.now();
      var rafId = 0;

      function bindQuad(prog) {
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
        var loc = gl.getAttribLocation(prog, "a_pos");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      }

      function loop() {
        if (!wrap.isConnected) return;
        var now = performance.now();
        var dt = Math.min(0.05, (now - prevT) / 1000);
        prevT = now;
        time += dt;

        scrollVel += (targetScrollVel - scrollVel) * 0.1;
        targetScrollVel *= 0.95;

        resize();
        if (W < 1 || H < 1) {
          rafId = requestAnimationFrame(loop);
          return;
        }

        var rad = (flowAngle * Math.PI) / 180;
        var fx = Math.cos(rad) * scrollVel * sensitivity * 0.5;
        var fy = Math.sin(rad) * scrollVel * sensitivity * 0.5;

        // simulation step
        gl.useProgram(simProg);
        gl.bindFramebuffer(gl.FRAMEBUFFER, cur.fbo);
        gl.viewport(0, 0, simRes, simRes);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, (cur === fbo1 ? fbo2 : fbo1).tex);
        gl.uniform1i(gl.getUniformLocation(simProg, "u_vel"), 0);
        gl.uniform2f(gl.getUniformLocation(simProg, "u_scroll"), fx, fy);
        gl.uniform2f(gl.getUniformLocation(simProg, "u_mouse"), mouseX, mouseY);
        gl.uniform1f(gl.getUniformLocation(simProg, "u_dt"), dt);
        gl.uniform1f(gl.getUniformLocation(simProg, "u_decay"), decay);
        gl.uniform1f(
          gl.getUniformLocation(simProg, "u_scrollStr"),
          sensitivity,
        );
        gl.uniform1f(
          gl.getUniformLocation(simProg, "u_chaos"),
          chaosEnabled ? 1.0 : 0.0,
        );
        gl.uniform1f(gl.getUniformLocation(simProg, "u_chaosFreq"), chaosFreq);
        gl.uniform1f(gl.getUniformLocation(simProg, "u_time"), time);
        gl.uniform2f(gl.getUniformLocation(simProg, "u_res"), simRes, simRes);
        bindQuad(simProg);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        cur = cur === fbo1 ? fbo2 : fbo1;

        // display step
        gl.useProgram(dispProg);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, W, H);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, cur.tex);
        gl.uniform1i(gl.getUniformLocation(dispProg, "u_vel"), 0);
        var c1 = hex3(color1),
          c2 = hex3(color2);
        gl.uniform3fv(gl.getUniformLocation(dispProg, "u_c1"), c1);
        gl.uniform3fv(gl.getUniformLocation(dispProg, "u_c2"), c2);
        gl.uniform1f(gl.getUniformLocation(dispProg, "u_intensity"), 1.0);
        bindQuad(dispProg);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        rafId = requestAnimationFrame(loop);
      }

      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(loop);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(wrap);
    });
};

// ── Batch 5: Backgrounds ──

window._VeltroInitAuroraBorealis = function () {
  document
    .querySelectorAll(".fw-widget-auroraBorealis:not([data-ab-init])")
    .forEach(function (el) {
      el.setAttribute("data-ab-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var W = (canvas.width = el.offsetWidth);
      var H = (canvas.height = el.offsetHeight);
      var waves = [];
      for (var i = 0; i < 5; i++) {
        waves.push({
          y: H * 0.3 + i * 30,
          amplitude: 30 + Math.random() * 20,
          frequency: 0.01 + Math.random() * 0.01,
          speed: 0.02 + Math.random() * 0.01,
          offset: Math.random() * Math.PI * 2,
          hue: 120 + i * 40,
        });
      }
      var t = 0;
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        t += 0.016;
        ctx.fillStyle = "rgba(5,5,15,0.1)";
        ctx.fillRect(0, 0, W, H);
        waves.forEach(function (w) {
          ctx.beginPath();
          ctx.moveTo(0, w.y);
          for (var x = 0; x < W; x += 5) {
            var y =
              w.y +
              Math.sin(x * w.frequency + t * w.speed + w.offset) * w.amplitude;
            ctx.lineTo(x, y);
          }
          ctx.lineTo(W, H);
          ctx.lineTo(0, H);
          ctx.closePath();
          ctx.fillStyle = "hsla(" + w.hue + ",70%,60%,0.15)";
          ctx.fill();
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitParticleNebula = function () {
  document
    .querySelectorAll(".fw-widget-particleNebula:not([data-pn-init])")
    .forEach(function (el) {
      el.setAttribute("data-pn-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var W = (canvas.width = el.offsetWidth);
      var H = (canvas.height = el.offsetHeight);
      var particles = [];
      for (var i = 0; i < 150; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 0.5,
          hue: Math.random() * 60 + 240,
        });
      }
      var speedMult = 1;
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        ctx.fillStyle = "rgba(3,3,10,0.2)";
        ctx.fillRect(0, 0, W, H);
        particles.forEach(function (p) {
          p.x += p.vx * speedMult;
          p.y += p.vy * speedMult;
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = "hsla(" + p.hue + ",80%,70%,0.6)";
          ctx.fill();
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
      var wrapper = el.closest("[data-id]");
      var blockId = wrapper ? wrapper.dataset.id : null;
      if (blockId && FB.bindings) {
        FB.bindings.registerSetter(blockId, "intensity", function (v) {
          speedMult = 0.05 + v * 3;
        });
      }
    });
};

window._VeltroInitGeometricPatterns = function () {
  document
    .querySelectorAll(".fw-widget-geometricPatterns:not([data-gp-init])")
    .forEach(function (el) {
      el.setAttribute("data-gp-init", "1");
      var wrap = el.querySelector(".veltro-geopat-wrap");
      if (!wrap) return;
      var canvas = wrap.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      canvas.width = el.offsetWidth || 800;
      canvas.height = el.offsetHeight || 500;
      var t = 0;
      var rafId = 0;

      function getProps() {
        var colors = (wrap.dataset.colors || "#cdfe00,#3b82f6,#ec4899")
          .split(",")
          .map(function (c) {
            return c.trim();
          });
        return {
          patternType: wrap.dataset.patternType || "hexagons",
          colors: colors.length ? colors : ["#cdfe00"],
          speed: +(wrap.dataset.speed || 0.5),
          cellSize: +(wrap.dataset.cellSize || 40),
          strokeWidth: +(wrap.dataset.strokeWidth || 1.5),
          lineOpacity: +(wrap.dataset.lineOpacity || 0.4),
          filled: wrap.dataset.filled === "true",
          colorMode: wrap.dataset.colorMode || "cycle",
        };
      }

      function hexToRgba(hex, a) {
        if (!hex || hex[0] !== "#") return "rgba(205,254,0," + a + ")";
        var r = parseInt(hex.slice(1, 3), 16) || 0;
        var g = parseInt(hex.slice(3, 5), 16) || 0;
        var b = parseInt(hex.slice(5, 7), 16) || 0;
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
      }

      function getColor(props, idx, dist) {
        if (props.colorMode === "gradient") {
          return (
            "hsl(" +
            ((((dist * 0.4 + t * 40 * props.speed) % 360) + 360) % 360) +
            ",70%,65%)"
          );
        }
        if (props.colorMode === "solid") return props.colors[0];
        return props.colors[idx % props.colors.length];
      }

      function drawHex(pr, cx, cy, r, col, dist, idx) {
        ctx.beginPath();
        for (var i = 0; i < 6; i++) {
          var a = (Math.PI / 3) * i + t * 0.15 * pr.speed + dist * 0.002;
          var px = cx + r * Math.cos(a);
          var py = cy + r * Math.sin(a);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        applyStyle(pr, idx, dist);
      }

      function applyStyle(pr, idx, dist) {
        var c = getColor(pr, idx, dist);
        ctx.lineWidth = pr.strokeWidth;
        if (pr.filled) {
          ctx.fillStyle = hexToRgba(
            typeof c === "string" && c[0] === "#" ? c : null,
            pr.lineOpacity * 0.35,
          );
          if (typeof c === "string" && c.startsWith("hsl")) {
            ctx.fillStyle = c
              .replace("hsl(", "hsla(")
              .replace(")", "," + pr.lineOpacity * 0.35 + ")");
          }
          ctx.fill();
        }
        ctx.strokeStyle =
          typeof c === "string" && c.startsWith("hsl")
            ? c
                .replace("hsl(", "hsla(")
                .replace(")", "," + pr.lineOpacity + ")")
            : hexToRgba(c, pr.lineOpacity);
        ctx.stroke();
      }

      function animate() {
        if (!el.isConnected) {
          rafId = 0;
          return;
        }
        var W = canvas.width;
        var H = canvas.height;
        var pr = getProps();
        t += 0.008 * pr.speed;
        ctx.clearRect(0, 0, W, H);
        var cell = pr.cellSize;
        var type = pr.patternType;
        var idx = 0;

        if (type === "hexagons") {
          var r = cell * 0.58;
          var hexW = r * 1.74;
          var hexH = r * 2;
          var cols = Math.ceil(W / hexW) + 3;
          var rows = Math.ceil(H / hexH) + 3;
          for (var row = -1; row < rows; row++) {
            for (var col = -1; col < cols; col++) {
              var cx = col * hexW + (row % 2 === 0 ? 0 : hexW / 2);
              var cy = row * hexH * 0.87;
              var dist = Math.sqrt(
                (cx - W / 2) * (cx - W / 2) + (cy - H / 2) * (cy - H / 2),
              );
              ctx.save();
              drawHex(pr, cx, cy, r * 0.92, col, dist, idx++);
              ctx.restore();
            }
          }
        } else if (type === "triangles") {
          var th = cell * 0.866;
          var cols2 = Math.ceil(W / cell) + 3;
          var rows2 = Math.ceil(H / th) + 3;
          for (var row2 = -1; row2 < rows2; row2++) {
            for (var col2 = -1; col2 < cols2 * 2; col2++) {
              var x0 = col2 * cell * 0.5;
              var y0 = row2 * th;
              var up = (col2 + row2) % 2 === 0;
              var dist2 = Math.sqrt(
                (x0 - W / 2) * (x0 - W / 2) + (y0 - H / 2) * (y0 - H / 2),
              );
              var pulse = Math.sin(t * 3 + dist2 * 0.012) * 0.08;
              ctx.save();
              ctx.beginPath();
              if (up) {
                ctx.moveTo(x0, y0 + th);
                ctx.lineTo(x0 + cell * 0.5, y0);
                ctx.lineTo(x0 + cell, y0 + th);
              } else {
                ctx.moveTo(x0, y0);
                ctx.lineTo(x0 + cell * 0.5, y0 + th);
                ctx.lineTo(x0 + cell, y0);
              }
              ctx.closePath();
              var savedOp = pr.lineOpacity;
              pr.lineOpacity = Math.max(0.05, pr.lineOpacity + pulse);
              applyStyle(pr, idx++, dist2);
              pr.lineOpacity = savedOp;
              ctx.restore();
            }
          }
        } else if (type === "circles") {
          var cols3 = Math.ceil(W / cell) + 3;
          var rows3 = Math.ceil(H / cell) + 3;
          for (var row3 = -1; row3 < rows3; row3++) {
            for (var col3 = -1; col3 < cols3; col3++) {
              var cx3 = col3 * cell + cell * 0.5;
              var cy3 = row3 * cell + cell * 0.5;
              var dist3 = Math.sqrt(
                (cx3 - W / 2) * (cx3 - W / 2) + (cy3 - H / 2) * (cy3 - H / 2),
              );
              var scale3 = 0.82 + Math.sin(t * 2.5 + dist3 * 0.018) * 0.18;
              ctx.save();
              ctx.beginPath();
              ctx.arc(cx3, cy3, cell * 0.42 * scale3, 0, Math.PI * 2);
              applyStyle(pr, idx++, dist3);
              ctx.restore();
            }
          }
        } else if (type === "squares") {
          var cols4 = Math.ceil(W / cell) + 3;
          var rows4 = Math.ceil(H / cell) + 3;
          for (var row4 = -1; row4 < rows4; row4++) {
            for (var col4 = -1; col4 < cols4; col4++) {
              var cx4 = col4 * cell + cell * 0.5;
              var cy4 = row4 * cell + cell * 0.5;
              var dist4 = Math.sqrt(
                (cx4 - W / 2) * (cx4 - W / 2) + (cy4 - H / 2) * (cy4 - H / 2),
              );
              var rot4 = t * 0.4 * pr.speed + dist4 * 0.003;
              var s4 = cell * 0.42;
              ctx.save();
              ctx.translate(cx4, cy4);
              ctx.rotate(rot4);
              ctx.beginPath();
              ctx.rect(-s4, -s4, s4 * 2, s4 * 2);
              applyStyle(pr, idx++, dist4);
              ctx.restore();
            }
          }
        } else if (type === "stars") {
          var cols5 = Math.ceil(W / cell) + 3;
          var rows5 = Math.ceil(H / cell) + 3;
          for (var row5 = -1; row5 < rows5; row5++) {
            for (var col5 = -1; col5 < cols5; col5++) {
              var cx5 = col5 * cell + cell * 0.5;
              var cy5 = row5 * cell + cell * 0.5;
              var dist5 = Math.sqrt(
                (cx5 - W / 2) * (cx5 - W / 2) + (cy5 - H / 2) * (cy5 - H / 2),
              );
              var rot5 = t * 0.25 * pr.speed + dist5 * 0.002;
              var ro = cell * 0.44;
              var ri = ro * 0.42;
              ctx.save();
              ctx.translate(cx5, cy5);
              ctx.rotate(rot5);
              ctx.beginPath();
              for (var si = 0; si < 10; si++) {
                var ra = si % 2 === 0 ? ro : ri;
                var sa = (Math.PI / 5) * si - Math.PI / 2;
                si === 0
                  ? ctx.moveTo(ra * Math.cos(sa), ra * Math.sin(sa))
                  : ctx.lineTo(ra * Math.cos(sa), ra * Math.sin(sa));
              }
              ctx.closePath();
              applyStyle(pr, idx++, dist5);
              ctx.restore();
            }
          }
        }

        rafId = requestAnimationFrame(animate);
      }

      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitLiquidGradient = function () {
  document
    .querySelectorAll(".fw-widget-liquidGradient:not([data-lg-init])")
    .forEach(function (el) {
      el.setAttribute("data-lg-init", "1");
      var canvas = el.querySelector("canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var W = (canvas.width = el.offsetWidth);
      var H = (canvas.height = el.offsetHeight);
      var blobs = [];
      for (var i = 0; i < 4; i++) {
        blobs.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          r: 60 + Math.random() * 40,
          hue: Math.random() * 360,
        });
      }
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        ctx.fillStyle = "#050510";
        ctx.fillRect(0, 0, W, H);
        blobs.forEach(function (b) {
          b.x += b.vx;
          b.y += b.vy;
          if (b.x < -b.r) b.x = W + b.r;
          if (b.x > W + b.r) b.x = -b.r;
          if (b.y < -b.r) b.y = H + b.r;
          if (b.y > H + b.r) b.y = -b.r;
          var grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
          grad.addColorStop(0, "hsla(" + b.hue + ",80%,60%,0.5)");
          grad.addColorStop(1, "hsla(" + b.hue + ",80%,60%,0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

// ── Batch 6: Effects ──

window._VeltroInitHolographicOverlay = function () {
  document
    .querySelectorAll(".fw-widget-holographicOverlay:not([data-ho-init])")
    .forEach(function (el) {
      el.setAttribute("data-ho-init", "1");
      var shine = el.querySelector(".veltro-holo-shine");
      if (!shine) return;
      var t = 0;
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        t += 0.02;
        shine.style.setProperty("--holo-angle", (t * 30 % 360) + "deg");
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitLightLeaks = function () {
  document
    .querySelectorAll(".fw-widget-lightLeaks:not([data-ll-init])")
    .forEach(function (el) {
      el.setAttribute("data-ll-init", "1");
      var leaks = el.querySelectorAll(".veltro-light-leak");
      leaks.forEach(function (leak, i) {
        leak.style.animationDelay = i * 2 + "s";
      });
    });
};

// ── Batch 7: Spatial & Layout ──

window._VeltroInitCarousel3d = function () {
  document
    .querySelectorAll(".fw-widget-carousel3d:not([data-c3d-init])")
    .forEach(function (el) {
      el.setAttribute("data-c3d-init", "1");
      var track = el.querySelector(".veltro-carousel-track");
      var items = el.querySelectorAll(".veltro-carousel-item");
      if (!track || !items.length) return;
      var angle = 0;
      var radius = 200;
      var isDragging = false,
        startX = 0,
        currentAngle = 0;
      function update() {
        items.forEach(function (item, i) {
          var theta = ((angle + i * (360 / items.length)) * Math.PI) / 180;
          var x = Math.sin(theta) * radius;
          var z = Math.cos(theta) * radius;
          item.style.transform =
            "translateX(" +
            x +
            "px) translateZ(" +
            z +
            "px) rotateY(" +
            (-theta * 180) / Math.PI +
            "deg)";
          item.style.zIndex = Math.round(z + radius);
          item.style.opacity = ((z + radius) / (2 * radius)) * 0.8 + 0.2;
        });
      }
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        if (!isDragging) angle += 0.2;
        update();
        rafId = requestAnimationFrame(animate);
      }
      el.addEventListener("mousedown", function (e) {
        isDragging = true;
        startX = e.clientX;
        currentAngle = angle;
      });
      document.addEventListener("mousemove", function (e) {
        if (!isDragging) return;
        angle = currentAngle + (e.clientX - startX) * 0.3;
      });
      document.addEventListener("mouseup", function () {
        isDragging = false;
      });
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitIsometricGrid = function () {
  document
    .querySelectorAll(".fw-widget-isometricGrid:not([data-ig-init])")
    .forEach(function (el) {
      el.setAttribute("data-ig-init", "1");
      var cells = el.querySelectorAll(".veltro-iso-cell");
      cells.forEach(function (cell, i) {
        cell.style.opacity = "0";
        cell.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        cell.style.transitionDelay = i * 60 + "ms";
        setTimeout(
          function () {
            cell.style.opacity = "1";
          },
          80 + i * 60,
        );
      });
    });
};

window._VeltroInitPerspectiveRooms = function () {
  document
    .querySelectorAll(".fw-widget-perspectiveRooms:not([data-pr-init])")
    .forEach(function (el) {
      el.setAttribute("data-pr-init", "1");
      var rooms = el.querySelectorAll(".veltro-room");
      var navs = el.querySelectorAll(".veltro-room-nav");
      var activeRoom = 0;
      function showRoom(index) {
        rooms.forEach(function (room, i) {
          var tz = parseFloat(room.dataset.tz) || i * -200;
          room.style.opacity = i === index ? "1" : "0";
          room.style.transform =
            "translateZ(" +
            tz +
            "px) " +
            (i === index ? "rotateY(0deg)" : "rotateY(90deg)");
        });
        navs.forEach(function (dot, i) {
          dot.style.background =
            i === index ? "#cdfe00" : "rgba(255,255,255,0.3)";
        });
        activeRoom = index;
      }
      navs.forEach(function (btn, i) {
        btn.addEventListener("click", function () {
          showRoom(i);
        });
      });
      showRoom(0);
    });
};

window._VeltroInitFloatingIslands = function () {
  document
    .querySelectorAll(".fw-widget-floatingIslands:not([data-fi-init])")
    .forEach(function (el) {
      el.setAttribute("data-fi-init", "1");
      var islands = el.querySelectorAll(".veltro-island");
      var t = 0;
      var rafId = 0;
      function animate() {
        if (!el.isConnected) return;
        t += 0.016;
        islands.forEach(function (island, i) {
          var y = Math.sin(t + i * 1.5) * 15;
          var r = Math.sin(t * 0.5 + i) * 3;
          island.style.transform =
            "translateY(" + y + "px) rotate(" + r + "deg)";
        });
        rafId = requestAnimationFrame(animate);
      }
      new IntersectionObserver(
        function (e) {
          if (e[0].isIntersecting) {
            if (!rafId) rafId = requestAnimationFrame(animate);
          } else {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        },
        { threshold: 0.01 },
      ).observe(el);
    });
};

window._VeltroInitLayeredParallax = function () {
  document
    .querySelectorAll(".fw-widget-layeredParallax:not([data-lp-init])")
    .forEach(function (el) {
      el.setAttribute("data-lp-init", "1");
      var layers = el.querySelectorAll(".veltro-layer");
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;
        layers.forEach(function (layer, i) {
          var depth = +layer.dataset.depth || (i + 1) * 0.1;
          layer.style.transform =
            "translate(" + x * depth * 50 + "px," + y * depth * 50 + "px)";
        });
      });
    });
};

window._VeltroInitKineticLayout = function () {
  document
    .querySelectorAll(".veltro-kinetic-wrap:not([data-kinetic-init])")
    .forEach(function (wrap) {
      wrap.setAttribute("data-kinetic-init", "1");
      var items = Array.from(wrap.querySelectorAll(".veltro-kinetic-item"));
      if (!items.length) return;

      var radius = parseFloat(wrap.dataset.responseRadius) || 120;
      var strength = parseFloat(wrap.dataset.repulseStrength) || 50;
      var mode = wrap.dataset.mode || "repulse";
      var state = items.map(function () {
        return { cx: 0, cy: 0 };
      });
      var mx = -9999,
        my = -9999,
        raf = null;

      function lerp(a, b, t) {
        return a + (b - a) * t;
      }

      function tick() {
        var rect = wrap.getBoundingClientRect();
        var settled = true;
        items.forEach(function (item, i) {
          var s = state[i];
          var ir = item.getBoundingClientRect();
          var icx = ir.left + ir.width / 2 - rect.left;
          var icy = ir.top + ir.height / 2 - rect.top;
          var dx = mx - icx,
            dy = my - icy;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var targetX = 0,
            targetY = 0;
          if (mx !== -9999 && dist < radius && dist > 1) {
            var factor = 1 - dist / radius;
            var norm = 1 / dist;
            if (mode === "repulse") {
              targetX = -dx * norm * factor * strength;
              targetY = -dy * norm * factor * strength;
            } else {
              targetX = dx * norm * factor * strength;
              targetY = dy * norm * factor * strength;
            }
          }
          s.cx = lerp(s.cx, targetX, 0.1);
          s.cy = lerp(s.cy, targetY, 0.1);
          item.style.transform =
            "translate(" + s.cx.toFixed(2) + "px," + s.cy.toFixed(2) + "px)";
          if (
            Math.abs(s.cx - targetX) > 0.05 ||
            Math.abs(s.cy - targetY) > 0.05
          )
            settled = false;
        });
        raf = settled ? null : requestAnimationFrame(tick);
      }

      function startRaf() {
        if (!raf) raf = requestAnimationFrame(tick);
      }

      wrap.addEventListener("mousemove", function (e) {
        var rect = wrap.getBoundingClientRect();
        mx = e.clientX - rect.left;
        my = e.clientY - rect.top;
        startRaf();
      });
      wrap.addEventListener("mouseleave", function () {
        mx = -9999;
        my = -9999;
        startRaf();
      });
    });
};

window._VeltroInitMorphingGrid = function () {
  document
    .querySelectorAll(".fw-widget-morphingGrid:not([data-mg-init])")
    .forEach(function (el) {
      el.setAttribute("data-mg-init", "1");
      var wrap = el.querySelector(".veltro-morphgrid-wrap");
      if (!wrap) return;
      var items = wrap.querySelectorAll(".veltro-morphgrid-item");
      if (!items.length) return;

      var cycleSpeed = +(wrap.dataset.cycleSpeed || 2.5) * 1000;
      var autoCycle = wrap.dataset.autoCycle !== "0";
      var layoutIndex = 0;
      var timer = null;

      // Each layout is an array of {basis, height} for each item (% basis, px height)
      // Layouts defined for up to 9 items — extra items fall back to last entry
      var LAYOUTS = [
        // 0: Equal grid (3 col)
        {
          name: "Grid",
          items: [
            { b: "30%", h: 120 },
            { b: "30%", h: 120 },
            { b: "30%", h: 120 },
            { b: "30%", h: 120 },
            { b: "30%", h: 120 },
            { b: "30%", h: 120 },
            { b: "30%", h: 120 },
            { b: "30%", h: 120 },
            { b: "30%", h: 120 },
          ],
        },
        // 1: Featured — first item is hero
        {
          name: "Featured",
          items: [
            { b: "62%", h: 260 },
            { b: "30%", h: 125 },
            { b: "30%", h: 125 },
            { b: "30%", h: 110 },
            { b: "46%", h: 110 },
            { b: "46%", h: 110 },
            { b: "30%", h: 110 },
            { b: "30%", h: 110 },
            { b: "30%", h: 110 },
          ],
        },
        // 2: Duo — two equal columns, alternating tall/short
        {
          name: "Duo",
          items: [
            { b: "46%", h: 200 },
            { b: "46%", h: 110 },
            { b: "46%", h: 110 },
            { b: "46%", h: 200 },
            { b: "46%", h: 160 },
            { b: "46%", h: 160 },
            { b: "46%", h: 130 },
            { b: "46%", h: 130 },
            { b: "46%", h: 130 },
          ],
        },
        // 3: List — full width stacked
        {
          name: "List",
          items: [
            { b: "96%", h: 70 },
            { b: "96%", h: 70 },
            { b: "96%", h: 70 },
            { b: "96%", h: 70 },
            { b: "96%", h: 70 },
            { b: "96%", h: 70 },
            { b: "96%", h: 70 },
            { b: "96%", h: 70 },
            { b: "96%", h: 70 },
          ],
        },
        // 4: Wide — one wide item per row, alternating sides
        {
          name: "Wide",
          items: [
            { b: "62%", h: 130 },
            { b: "30%", h: 130 },
            { b: "30%", h: 130 },
            { b: "62%", h: 130 },
            { b: "62%", h: 130 },
            { b: "30%", h: 130 },
            { b: "30%", h: 130 },
            { b: "62%", h: 130 },
            { b: "30%", h: 130 },
          ],
        },
      ];

      function applyLayout(idx) {
        var layout = LAYOUTS[idx % LAYOUTS.length];
        items.forEach(function (item, i) {
          var cfg = layout.items[Math.min(i, layout.items.length - 1)];
          item.style.flexBasis = cfg.b;
          item.style.height = cfg.h + "px";
        });
        if (wrap.querySelector(".veltro-mg-label")) {
          wrap.querySelector(".veltro-mg-label").textContent = layout.name;
        }
      }

      // Add layout name badge
      var badge = document.createElement("div");
      badge.className = "veltro-mg-label";
      badge.style.cssText =
        "position:absolute;bottom:12px;right:14px;font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.3);pointer-events:none;z-index:2";
      wrap.appendChild(badge);

      applyLayout(0);

      function next() {
        layoutIndex = (layoutIndex + 1) % LAYOUTS.length;
        applyLayout(layoutIndex);
      }

      if (autoCycle) {
        new IntersectionObserver(
          function (e) {
            if (e[0].isIntersecting) {
              if (!timer) timer = setInterval(next, cycleSpeed);
            } else {
              clearInterval(timer);
              timer = null;
            }
          },
          { threshold: 0.1 },
        ).observe(el);
      }

      // Click to manually advance
      wrap.addEventListener("click", function () {
        next();
        if (autoCycle) {
          clearInterval(timer);
          timer = setInterval(next, cycleSpeed);
        }
      });
    });
};

window._VeltroInitSpatialNavigation = function () {
  document
    .querySelectorAll(".fw-widget-spatialNavigation:not([data-sn-init])")
    .forEach(function (el) {
      el.setAttribute("data-sn-init", "1");
      var nodes = el.querySelectorAll(".veltro-spatial-item");
      var activeNode = 0;
      function activate(index) {
        nodes.forEach(function (node, i) {
          node.classList.toggle("veltro-spatial-active", i === index);
        });
        activeNode = index;
      }
      nodes.forEach(function (node, i) {
        node.addEventListener("mouseenter", function () {
          activate(i);
        });
        node.addEventListener("click", function () {
          activate(i);
        });
      });
      activate(0);
    });
};

window._VeltroInitCookieConsent = function () {
  var COOKIE_KEY = "fw_cookie_consent";
  document.querySelectorAll(".fw-cookie-banner").forEach(function (banner) {
    if (banner.dataset.cookieInit) return;
    banner.dataset.cookieInit = "1";

    if (localStorage.getItem(COOKIE_KEY)) {
      banner.style.display = "none";
      return;
    }

    function getCategoryState() {
      var state = {};
      banner.querySelectorAll(".fw-cookie-cat-toggle").forEach(function (cb) {
        state[cb.dataset.cat || cb.name] = cb.checked;
      });
      return state;
    }

    banner.querySelectorAll("[data-cookie-action]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        var action = e.currentTarget.dataset.cookieAction;
        var consent = {
          accepted: action === "accept",
          declined: action === "decline",
          timestamp: Date.now(),
          categories: getCategoryState(),
        };
        if (action === "accept") {
          banner
            .querySelectorAll(".fw-cookie-cat-toggle:not(:disabled)")
            .forEach(function (cb) {
              cb.checked = true;
            });
          consent.categories = getCategoryState();
          localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
          banner.style.display = "none";
        } else if (action === "decline") {
          localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
          banner.style.display = "none";
        } else if (action === "customize") {
          var panel = banner.querySelector(".fw-cookie-categories");
          if (panel)
            panel.style.display =
              panel.style.display === "none" ? "block" : "none";
        }
      });
    });
  });
};

// ── Master Initializer ──
window._VeltroInitAll = function () {
  var inits = [
    "_VeltroInitKineticText",
    "_VeltroInitTextScramble",
    "_VeltroInitTypewriter",
    "_VeltroInitTextMask",
    "_VeltroInitCounter",
    "_VeltroInitLiquidText",
    "_VeltroInitPhysics",
    "_VeltroInitImagePhysics",
    "_VeltroInitBubblePop",
    "_VeltroInitMagneticCursor",
    "_VeltroInitParticleTrail",
    "_VeltroInitCursorRipple",
    "_VeltroInitCursorLens",
    "_VeltroInitStickyScrollStack",
    "_VeltroInitScrollVelocitySkew",
    "_VeltroInitParallaxImageStack",
    "_VeltroInitMosaicAssemble",
    "_VeltroInitScrollProgressRing",
    "_VeltroInitMagneticScroll",
    "_VeltroInitShaders",
    "_VeltroInitMorphBlob",
    "_VeltroInitNoiseGrain",
    "_VeltroInitGradientFlow",
    "_VeltroInitSectionBackground",
    "_VeltroInitGlassmorphismStack",
    "_VeltroInitTiltCards",
    "_VeltroInitGlitchSection",
    "_VeltroInitAudioVisualizer",
    "_VeltroInitDepthOfField",
    "_VeltroInitHolographicCard",
    "_VeltroInitSoundReactive",
    "_VeltroInitMirrorReflection",
    "_VeltroInitConstellation",
    "_VeltroInitInfiniteCanvas",
    "_VeltroInitGeometryDraw",
    "_VeltroInitMultiShapeTrail",
    "_VeltroInitSpotlight",
    "_VeltroInitMagText",
    "_VeltroInitDistortion",
    "_VeltroInitColorSampler",
    "_VeltroInitGravityCursor",
    "_VeltroInitWaveText",
    "_VeltroInitRotatingText3d",
    "_VeltroInitMorphingText",
    "_VeltroInitKineticScramble",
    "_VeltroInitCookieConsent",
    "_VeltroInitGravityWells",
    "_VeltroInitFluidSimulation",
    "_VeltroInitClothSimulation",
    "_VeltroInitMagneticFields",
    "_VeltroInitPendulumWave",
    "_VeltroInitCollisionChaos",
    "_VeltroInitBlackHole",
    "_VeltroInitParallaxDepth",
    "_VeltroInitScrollTriggered",
    "_VeltroInitHorizontalScrollGallery",
    "_VeltroInitVelocitySkew",
    "_VeltroInitScrollFluid",
    "_VeltroInitVelocityFluidBg",
    "_VeltroInitAuroraBorealis",
    "_VeltroInitParticleNebula",
    "_VeltroInitGeometricPatterns",
    "_VeltroInitLiquidGradient",
    "_VeltroInitHolographicOverlay",
    "_VeltroInitLightLeaks",
    "_VeltroInitCarousel3d",
    "_VeltroInitIsometricGrid",
    "_VeltroInitPerspectiveRooms",
    "_VeltroInitFloatingIslands",
    "_VeltroInitLayeredParallax",
    "_VeltroInitKineticLayout",
    "_VeltroInitMorphingGrid",
    "_VeltroInitSpatialNavigation",
  ];
  inits.forEach(function (name) {
    if (typeof window[name] === "function") window[name]();
  });
  if (typeof FB !== "undefined" && FB.bindings) FB.bindings.wire();
};
