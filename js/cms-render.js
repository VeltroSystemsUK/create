(function () {
  if (window.location.search.includes("edit")) return;

  function api(path) {
    return fetch(path).then(function (res) {
      if (!res.ok) throw new Error("Request failed");
      return res.json();
    });
  }

  function findCurrentPage(schema) {
    var path = window.location.pathname.replace(/\/$/, "") || "/";
    if (!schema || !schema.pages) return null;
    for (var i = 0; i < schema.pages.length; i++) {
      var p = schema.pages[i];
      var s = p.slug || "";
      if (s === "/" || s === "" || s === "index") {
        if (path === "/") return p;
      } else {
        var slug = s.startsWith("/") ? s : "/" + s;
        if (slug === path) return p;
      }
    }
    return schema.pages[0] || null;
  }

  function applyContent(schema, content) {
    var pageSchema = findCurrentPage(schema);
    if (!pageSchema) return;
    var pageContent = content[pageSchema.pageId];
    if (!pageContent) return;
    var blocks = pageSchema.blocks || [];

    var containers = document.querySelectorAll(
      "body > section[data-scroll], body > header, body > footer",
    );

    containers.forEach(function (container, idx) {
      if (idx >= blocks.length) return;
      var blockContent = pageContent.blocks[blocks[idx].blockId];
      if (!blockContent) return;

      var fields = container.querySelectorAll("[data-field]");
      fields.forEach(function (el) {
        var fieldName = el.getAttribute("data-field");
        var val = blockContent[fieldName];
        if (val === undefined || val === null) return;
        if (el.tagName === "IMG") {
          el.src = val;
        } else {
          el.textContent = val;
        }
      });
    });
  }

  Promise.all([api("/api/cms/schema"), api("/api/cms/content")])
    .then(function (results) {
      applyContent(results[0], results[1]);
    })
    .catch(function (e) {
      console.error("CMS render failed:", e);
    });
})();
