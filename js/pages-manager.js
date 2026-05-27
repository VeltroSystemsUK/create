FB.pagesManager = {};
FB.pagesManager._selectedId = null;

FB.pagesManager.open = function () {
  var overlay = document.getElementById("pages-manager-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "pages-manager-overlay";
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = FB.pagesManager._buildHTML();
  overlay.classList.add("open");
  // Select current page by default
  FB.pagesManager._selectedId = FB.state.currentPageId;
  FB.pagesManager._highlightRow(FB.pagesManager._selectedId);
  FB.pagesManager._wireDrag();
  // Close on backdrop click
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) FB.pagesManager.close();
  });
};

FB.pagesManager.close = function () {
  var overlay = document.getElementById("pages-manager-overlay");
  if (overlay) overlay.classList.remove("open");
};

FB.pagesManager._buildHTML = function () {
  return (
    '<div class="pm-panel">' +
    '<div class="pm-header"><span>Pages</span>' +
    '<button class="pm-close-btn" onclick="FB.pagesManager.close()">×</button></div>' +
    '<div class="pm-body">' +
    '<div class="pm-list">' +
    '<div class="pm-list-rows" id="pm-list-rows">' +
    FB.pagesManager._buildListRows() +
    "</div>" +
    '<button class="pm-add-btn" onclick="FB.pagesManager.openAddModal()">+ Add page</button>' +
    "</div>" +
    '<div class="pm-settings" id="pm-settings">' +
    FB.pagesManager._buildSettings(FB.state.currentPageId) +
    "</div>" +
    "</div>" +
    '<div class="pm-template-overlay" id="pm-template-overlay"></div>' +
    "</div>"
  );
};

FB.pagesManager._buildListRows = function () {
  return FB.state.pages
    .map(function (page) {
      var isActive = page.id === FB.pagesManager._selectedId;
      var blockCount = page.blocks ? page.blocks.length : 0;
      var canDel = FB.state.pages.length > 1;
      return (
        '<div class="pm-list-row' +
        (isActive ? " active" : "") +
        '"' +
        ' data-page-id="' +
        page.id +
        '"' +
        ' draggable="true"' +
        " onclick=\"FB.pagesManager._selectPage('" +
        page.id +
        "')\">" +
        '<span class="pm-drag-handle">⠿</span>' +
        '<span class="pm-row-name">' +
        page.name +
        "</span>" +
        '<span class="pm-row-count">' +
        blockCount +
        "</span>" +
        (canDel
          ? '<button class="pm-row-del" onclick="event.stopPropagation();FB.pagesManager._deletePage(\'' +
            page.id +
            '\')" title="Delete page">×</button>'
          : "") +
        "</div>"
      );
    })
    .join("");
};

FB.pagesManager._buildSettings = function (pageId) {
  var page = FB.state.pages.find(function (p) {
    return p.id === pageId;
  });
  if (!page)
    return '<p style="color:#555;font-size:11px;padding:8px">No page selected</p>';
  var ogImg = page.ogImage || "";
  return (
    '<div class="pm-settings-title">' +
    page.name +
    " — Settings</div>" +
    FB.pagesManager._field(
      "title",
      "Page Title",
      page.title || "",
      "text",
      pageId,
    ) +
    FB.pagesManager._field("slug", "Slug", page.slug || "", "text", pageId) +
    FB.pagesManager._field(
      "metaDesc",
      "Meta Description",
      page.metaDesc || "",
      "textarea",
      pageId,
    ) +
    FB.pagesManager._field(
      "ogTitle",
      "OG Title",
      page.ogTitle || "",
      "text",
      pageId,
    ) +
    FB.pagesManager._field(
      "ogDesc",
      "OG Description",
      page.ogDesc || "",
      "textarea",
      pageId,
    ) +
    '<div class="pm-field">' +
    "<label>OG Image</label>" +
    '<div class="pm-og-image-row">' +
    '<img id="pm-og-preview" class="pm-og-preview' +
    (ogImg ? " visible" : "") +
    '" src="' +
    ogImg +
    '" alt="OG preview">' +
    '<button class="pm-og-pick-btn" onclick="FB.pagesManager._pickOgImage(\'' +
    pageId +
    "')\">📁 Pick</button>" +
    "</div></div>" +
    '<button class="pm-ai-btn" id="pm-ai-btn" onclick="FB.pagesManager._runAiSeo(\'' +
    pageId +
    "')\">✦ Auto-generate SEO</button>"
  );
};

FB.pagesManager._field = function (key, label, value, type, pageId) {
  var tag = type === "textarea" ? "textarea" : "input";
  var attrs =
    'class="' +
    (type === "textarea" ? "" : "") +
    '"' +
    ' data-page-id="' +
    pageId +
    '"' +
    ' data-key="' +
    key +
    '"' +
    ' onblur="FB.pagesManager._onFieldBlur(this)"';
  if (type === "textarea") {
    return (
      '<div class="pm-field"><label>' +
      label +
      "</label>" +
      "<textarea " +
      attrs +
      ">" +
      value +
      "</textarea></div>"
    );
  }
  return (
    '<div class="pm-field"><label>' +
    label +
    "</label>" +
    '<input type="text" ' +
    attrs +
    ' value="' +
    value.replace(/"/g, "&quot;") +
    '"></div>'
  );
};

FB.pagesManager._onFieldBlur = function (el) {
  var pageId = el.dataset.pageId;
  var key = el.dataset.key;
  var val = el.value.trim();
  if (key === "slug") val = FB.pagesManager._formatSlug(val, pageId);
  FB.pagesManager._saveSetting(pageId, key, val);
  if (key === "slug") el.value = val;
};

FB.pagesManager._formatSlug = function (val, pageId) {
  var page = FB.state.pages.find(function (p) {
    return p.id === pageId;
  });
  // Home page slug is always "index"
  if (page && page.name.toLowerCase() === "home") return "index";
  return (
    val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/^-+|-+$/g, "") || "page"
  );
};

FB.pagesManager._saveSetting = function (pageId, key, val) {
  var page = FB.state.pages.find(function (p) {
    return p.id === pageId;
  });
  if (!page) return;
  page[key] = val;
  FB.pages._save();
  // Refresh page name in title if name changed
  if (key === "title") {
    var titleEl = document.querySelector(".pm-settings-title");
    if (titleEl)
      titleEl.textContent = (page.name || page.title) + " — Settings";
  }
};

FB.pagesManager._selectPage = function (id) {
  FB.pagesManager._selectedId = id;
  FB.pagesManager._highlightRow(id);
  var settingsEl = document.getElementById("pm-settings");
  if (settingsEl) settingsEl.innerHTML = FB.pagesManager._buildSettings(id);
};

FB.pagesManager._highlightRow = function (id) {
  document.querySelectorAll(".pm-list-row").forEach(function (row) {
    row.classList.toggle("active", row.dataset.pageId === id);
  });
};

FB.pagesManager._deletePage = function (id) {
  FB.pages.delete(id);
  // If the deleted page was selected, select the new current page
  FB.pagesManager._selectedId = FB.state.currentPageId;
  var rowsEl = document.getElementById("pm-list-rows");
  if (rowsEl) {
    rowsEl.innerHTML = FB.pagesManager._buildListRows();
    FB.pagesManager._wireDrag();
  }
  var settingsEl = document.getElementById("pm-settings");
  if (settingsEl)
    settingsEl.innerHTML = FB.pagesManager._buildSettings(
      FB.state.currentPageId,
    );
};

FB.pagesManager._wireDrag = function () {
  var rows = document.getElementById("pm-list-rows");
  if (!rows) return;
  var draggingId = null;

  rows.addEventListener("dragstart", function (e) {
    var row = e.target.closest(".pm-list-row");
    if (!row) return;
    draggingId = row.dataset.pageId;
    row.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
  });

  rows.addEventListener("dragend", function () {
    draggingId = null;
    rows.querySelectorAll(".pm-list-row").forEach(function (r) {
      r.classList.remove("dragging", "drag-over");
    });
  });

  rows.addEventListener("dragover", function (e) {
    e.preventDefault();
    var row = e.target.closest(".pm-list-row");
    rows.querySelectorAll(".pm-list-row").forEach(function (r) {
      r.classList.remove("drag-over");
    });
    if (row && row.dataset.pageId !== draggingId) {
      row.classList.add("drag-over");
    }
  });

  rows.addEventListener("drop", function (e) {
    e.preventDefault();
    var row = e.target.closest(".pm-list-row");
    if (!row || !draggingId || row.dataset.pageId === draggingId) return;
    var fromIdx = FB.state.pages.findIndex(function (p) {
      return p.id === draggingId;
    });
    var toIdx = FB.state.pages.findIndex(function (p) {
      return p.id === row.dataset.pageId;
    });
    if (fromIdx < 0 || toIdx < 0) return;
    var moved = FB.state.pages.splice(fromIdx, 1)[0];
    FB.state.pages.splice(toIdx, 0, moved);
    FB.pages._save();
    FB.pages.render();
    var rowsEl = document.getElementById("pm-list-rows");
    if (rowsEl) {
      rowsEl.innerHTML = FB.pagesManager._buildListRows();
      FB.pagesManager._wireDrag();
    }
  });
};

FB.pagesManager._pickOgImage = function (pageId) {
  FB.pagesManager.close();
  FB.mediaGallery.pickWithCallback(function (url) {
    FB.pagesManager._saveSetting(pageId, "ogImage", url);
    FB.pagesManager.open();
    FB.pagesManager._selectPage(pageId);
  });
  // Navigate to media panel
  var mediaBtn =
    document.querySelector('[data-panel="media"]') ||
    document.querySelector('.nav-item[onclick*="media"]');
  if (mediaBtn) mediaBtn.click();
};

// Placeholder — implemented in Task 8
FB.pagesManager._runAiSeo = function (pageId) {
  FB.util.showToast("AI SEO coming soon");
};

// Placeholder — implemented in Task 7
FB.pagesManager.openAddModal = function () {
  FB.util.showToast("Template picker coming soon");
};
