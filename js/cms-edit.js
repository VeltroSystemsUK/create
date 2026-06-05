(function () {
  if (!window.location.search.includes("edit")) return;

  var currentSession = null;
  var currentSchema = null;
  var currentContent = null;
  var currentPageId = null;
  var debounceTimer = null;

  function api(method, path, body) {
    var opts = { method: method, headers: {} };
    if (body != null && !(body instanceof FormData)) {
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(body);
    } else if (body instanceof FormData) {
      opts.body = body;
    }
    return fetch(path, opts).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) throw new Error(data.error || "Request failed");
        return data;
      });
    });
  }

  function getCookie(name) {
    var m = document.cookie.match(new RegExp("(?:^| )" + name + "=([^;]+)"));
    return m ? m[1] : null;
  }

  function injectCSS() {
    var style = document.createElement("style");
    style.textContent = [
      "#cms-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;z-index:99999}",
      "#cms-overlay.hidden{display:none}",
      ".cms-login-box{background:#1a1a2e;padding:40px;border-radius:12px;width:340px;color:#e0e0e0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}",
      ".cms-login-box h1{font-size:22px;margin-bottom:8px;color:#fff}",
      ".cms-login-box p{font-size:13px;color:#888;margin-bottom:24px}",
      ".cms-login-box label{display:block;font-size:12px;color:#aaa;margin-bottom:6px;text-transform:uppercase;letter-spacing:.5px}",
      ".cms-login-box input[type=password]{width:100%;padding:10px 12px;border:1px solid #333;border-radius:6px;background:#111;color:#fff;font-size:15px;outline:none;box-sizing:border-box}",
      ".cms-login-box input[type=password]:focus{border-color:#cdfe00}",
      ".cms-login-box .cms-btn{width:100%;margin-top:20px;padding:10px;background:#cdfe00;color:#111;border:none;border-radius:6px;font-size:15px;font-weight:600;cursor:pointer}",
      ".cms-login-box .cms-btn:hover{opacity:.9}",
      ".cms-login-error{color:#ff6b6b;font-size:13px;margin-top:10px;display:none}",
      "#cms-toolbar{position:fixed;bottom:0;left:0;right:0;height:44px;background:#1a1a2e;border-top:1px solid #333;display:flex;align-items:center;padding:0 20px;z-index:99998;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px}",
      "#cms-toolbar .cms-label{color:#cdfe00;font-weight:600}",
      "#cms-toolbar .cms-spacer{flex:1}",
      "#cms-toolbar a{color:#888;text-decoration:none;margin-left:16px}",
      "#cms-toolbar a:hover{color:#fff}",
      ".cms-editable{cursor:text}",
      ".cms-editable:hover{outline:2px dashed #cdfe00;outline-offset:2px}",
      ".cms-editable-image{cursor:pointer}",
      ".cms-editable-image:hover{outline:2px dashed #cdfe00;outline-offset:2px}",
      ".cms-saved-indicator{position:fixed;bottom:56px;right:20px;background:#4caf50;color:#fff;padding:8px 16px;border-radius:6px;font-size:13px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;opacity:0;transition:opacity .3s ease;pointer-events:none;z-index:99999}",
      ".cms-saved-indicator.visible{opacity:1}",
    ].join("");
    document.head.appendChild(style);
  }

  var savedTimer = null;

  function showSaved() {
    var el = document.querySelector(".cms-saved-indicator");
    if (!el) {
      el = document.createElement("div");
      el.className = "cms-saved-indicator";
      el.textContent = "Saved";
      document.body.appendChild(el);
    }
    el.classList.add("visible");
    clearTimeout(savedTimer);
    savedTimer = setTimeout(function () {
      el.classList.remove("visible");
    }, 1500);
  }

  function saveField(pageId, blockId, field, value) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      api("PUT", "/api/cms/content", {
        pageId: pageId,
        blockId: blockId,
        field: field,
        value: value,
      })
        .then(function () {
          showSaved();
          if (currentContent) {
            if (!currentContent[pageId])
              currentContent[pageId] = { blocks: {} };
            if (!currentContent[pageId].blocks[blockId])
              currentContent[pageId].blocks[blockId] = {};
            currentContent[pageId].blocks[blockId][field] = value;
          }
        })
        .catch(function (e) {
          console.error("CMS save failed:", e);
        });
    }, 600);
  }

  function handleImageClick(el, pageId, blockId, field) {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.addEventListener("change", function () {
      var file = input.files[0];
      if (!file) return;
      var fd = new FormData();
      fd.append("file", file);
      api("POST", "/api/cms/media/upload", fd)
        .then(function (res) {
          var url = res.media.url;
          return api("PUT", "/api/cms/content", {
            pageId: pageId,
            blockId: blockId,
            field: field,
            value: url,
          }).then(function () {
            if (el.tagName === "IMG") {
              el.src = url;
            } else {
              el.style.backgroundImage = "url(" + url + ")";
            }
            showSaved();
          });
        })
        .catch(function (e) {
          console.error("CMS image upload failed:", e);
        });
    });
    input.click();
  }

  function setupEditables(pageSchema) {
    var pageContent = (currentContent && currentContent[currentPageId]) || {
      blocks: {},
    };
    var blocks = pageSchema.blocks || [];

    var containers = document.querySelectorAll(
      "body > section[data-scroll], body > header, body > footer",
    );

    containers.forEach(function (container, idx) {
      if (idx >= blocks.length) return;
      var blockSchema = blocks[idx];
      var fields = container.querySelectorAll("[data-field]");
      if (!fields.length) return;

      fields.forEach(function (el) {
        var fieldName = el.getAttribute("data-field");
        var fieldDef = blockSchema.fields[fieldName];
        if (!fieldDef || !fieldDef.editable) return;

        if (fieldDef.type === "image") {
          el.classList.add("cms-editable-image");
          el.addEventListener("click", function (e) {
            e.preventDefault();
            handleImageClick(el, currentPageId, blockSchema.blockId, fieldName);
          });
          el.addEventListener("error", function () {
            this.style.border = "2px solid #ff6b6b";
            this.style.opacity = "0.5";
            this.title = "Image not found";
          });
        } else {
          el.contentEditable = true;
          el.classList.add("cms-editable");
          el.addEventListener("blur", function () {
            var val = el.innerHTML.trim();
            saveField(currentPageId, blockSchema.blockId, fieldName, val);
          });
          el.addEventListener("keydown", function (e) {
            if (e.key === "Escape") el.blur();
          });
        }
      });
    });
  }

  function findCurrentPage(schema) {
    var path = window.location.pathname.replace(/\/$/, "") || "/";
    if (!schema || !schema.pages) return null;
    for (var i = 0; i < schema.pages.length; i++) {
      var p = schema.pages[i];
      var slug = p.slug || "";
      if (slug === "/" || slug === "" || slug === "index") {
        if (path === "/") return p;
      } else {
        var s = slug.startsWith("/") ? slug : "/" + slug;
        if (s === path) return p;
      }
    }
    return schema.pages[0] || null;
  }

  function initEditor() {
    var toolbar = document.createElement("div");
    toolbar.id = "cms-toolbar";
    toolbar.innerHTML =
      '<span class="cms-label">\u270F\ufe0f Editing Mode</span>' +
      '<span class="cms-spacer"></span>' +
      '<a href="?" id="cms-exit-link">Exit Edit Mode</a>' +
      '<a href="/admin" target="_blank">\uD83D\uDCCA Admin Dashboard</a>';
    document.body.appendChild(toolbar);
    document.body.style.paddingBottom = "44px";

    Promise.all([api("GET", "/api/cms/schema"), api("GET", "/api/cms/content")])
      .then(function (results) {
        currentSchema = results[0];
        currentContent = results[1];
        var pageSchema = findCurrentPage(currentSchema);
        if (pageSchema) {
          currentPageId = pageSchema.pageId;
          setupEditables(pageSchema);
        }
      })
      .catch(function (e) {
        console.error("CMS init failed:", e);
      });
  }

  function showLogin() {
    var overlay = document.createElement("div");
    overlay.id = "cms-overlay";
    overlay.innerHTML =
      '<div class="cms-login-box">' +
      "<h1>\uD83D\uDD10 CMS Login</h1>" +
      "<p>Enter the CMS password to edit this page.</p>" +
      '<label for="cms-pw">Password</label>' +
      '<input type="password" id="cms-pw" placeholder="Enter password">' +
      '<button class="cms-btn" id="cms-login-btn">Sign In</button>' +
      '<div class="cms-login-error" id="cms-login-error"></div>' +
      "</div>";
    document.body.appendChild(overlay);

    var input = document.getElementById("cms-pw");
    var errEl = document.getElementById("cms-login-error");

    function submit() {
      var pw = input.value;
      if (!pw) return;
      errEl.style.display = "none";
      api("POST", "/api/cms/auth/login", { password: pw })
        .then(function (res) {
          if (res.success) {
            document.cookie = "cms_session=" + res.session + "; path=/";
            overlay.classList.add("hidden");
            initEditor();
          } else {
            errEl.textContent = res.error || "Invalid password";
            errEl.style.display = "block";
          }
        })
        .catch(function (e) {
          errEl.textContent = e.message;
          errEl.style.display = "block";
        });
    }

    document.getElementById("cms-login-btn").addEventListener("click", submit);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") submit();
    });
    input.focus();
  }

  injectCSS();
  var session = getCookie("cms_session");
  if (session) {
    currentSession = session;
    initEditor();
  } else {
    showLogin();
  }
})();
