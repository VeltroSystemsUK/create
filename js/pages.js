FB.pages = {};

FB.pages._getDefaults = function () {
  return {
    title: "",
    description: "",
    ogImage: "",
    favicon: "",
    customCSS: "",
    metalinks: [],
  };
};

FB.pages._ensureMetadata = function (page) {
  var defaults = FB.pages._getDefaults();
  Object.keys(defaults).forEach(function (key) {
    if (!(key in page)) {
      page[key] = defaults[key];
    }
  });
};

FB.pages.init = function () {
  // Always start fresh - no restore from localStorage
  // (localStorage is still updated for session recovery, just not auto-restored)
  var id = "p_" + Math.random().toString(36).slice(2, 7);
  var defaults = FB.pages._getDefaults();
  var newPage = { id: id, name: "Home", slug: "index", blocks: [] };
  Object.assign(newPage, defaults);
  FB.state.pages = [newPage];
  FB.state.currentPageId = id;
  return false;
};

FB.pages.current = function () {
  return FB.state.pages.find(function (p) {
    return p.id === FB.state.currentPageId;
  });
};

FB.pages._save = function () {
  var cur = FB.pages.current();
  if (cur) cur.blocks = JSON.parse(JSON.stringify(FB.state.blocks));
  try {
    localStorage.setItem(
      "fb-pages-save",
      JSON.stringify({
        pages: FB.state.pages,
        currentPageId: FB.state.currentPageId,
      }),
    );
  } catch (e) {}
};

FB.pages.switchTo = function (id) {
  if (id === FB.state.currentPageId) return;
  FB.pages._save();
  var next = FB.state.pages.find(function (p) {
    return p.id === id;
  });
  if (!next) return;
  FB.state.currentPageId = id;
  FB.state.blocks = JSON.parse(JSON.stringify(next.blocks));
  FB.state.selectedId = null;
  FB.state.history = [];
  FB.state.future = [];
  FB.canvas.render();
  FB.panels.renderRightPanel();
  if (FB.panels.updateUndoRedo) FB.panels.updateUndoRedo();
  FB.pages.render();
};

FB.pages.add = function () {
  FB.pages._save();
  var id = "p_" + Math.random().toString(36).slice(2, 7);
  var defaults = [
    "About",
    "Services",
    "Work",
    "Contact",
    "Blog",
    "Pricing",
    "FAQ",
    "Team",
  ];
  var existingNames = FB.state.pages.map(function (p) {
    return p.name;
  });
  var name = defaults.find(function (n) {
    return existingNames.indexOf(n) === -1;
  });
  if (!name) name = "Page " + (FB.state.pages.length + 1);
  var newPage = {
    id: id,
    name: name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    blocks: [],
  };
  FB.pages._ensureMetadata(newPage);
  FB.state.pages.push(newPage);
  FB.pages.switchTo(id);
  FB.util.showToast("+ Page added: " + name);
};

FB.pages.delete = function (id) {
  if (FB.state.pages.length <= 1) {
    FB.util.showToast("Cannot delete the only page");
    return;
  }
  var page = FB.state.pages.find(function (p) {
    return p.id === id;
  });
  if (
    !confirm(
      'Delete page "' + (page ? page.name : "") + '"? This cannot be undone.',
    )
  )
    return;
  var idx = FB.state.pages.findIndex(function (p) {
    return p.id === id;
  });
  if (idx === -1) return;
  FB.state.pages.splice(idx, 1);
  if (FB.state.currentPageId === id) {
    var newPage = FB.state.pages[Math.max(0, idx - 1)];
    FB.state.currentPageId = newPage.id;
    FB.state.blocks = JSON.parse(JSON.stringify(newPage.blocks));
    FB.state.selectedId = null;
    FB.state.history = [];
    FB.state.future = [];
    FB.canvas.render();
    FB.panels.renderRightPanel();
  }
  FB.pages._save();
  FB.pages.render();
};

FB.pages.rename = function (id, name) {
  var page = FB.state.pages.find(function (p) {
    return p.id === id;
  });
  if (!page || !name.trim()) return;
  page.name = name.trim();
  page.slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  FB.pages._save();
  FB.pages.render();
};

FB.pages.render = function () {
  var bar = document.getElementById("page-tabs-bar");
  if (!bar) return;
  var html = '<div class="page-tabs-inner">';
  FB.state.pages.forEach(function (page) {
    var active = page.id === FB.state.currentPageId;
    html +=
      '<div class="page-tab' +
      (active ? " active" : "") +
      '" data-page-id="' +
      page.id +
      '">' +
      '<span class="page-tab-name" title="Double-click to rename" ondblclick="FB.pages._startRename(\'' +
      page.id +
      "')\">" +
      page.name +
      "</span>" +
      '<button class="page-tab-settings" onclick="event.stopPropagation();FB.pages.showMetadataEditor(\'' +
      page.id +
      '\')" title="Page settings">⚙️</button>' +
      (FB.state.pages.length > 1
        ? '<button class="page-tab-del" onclick="event.stopPropagation();FB.pages.delete(\'' +
          page.id +
          '\')" title="Delete page">×</button>'
        : "") +
      "</div>";
  });
  html +=
    '<button class="page-tab-add" onclick="FB.pages.add()" title="Add page">+</button>';
  html += "</div>";
  bar.innerHTML = html;
  bar.querySelectorAll(".page-tab").forEach(function (tab) {
    tab.addEventListener("click", function (e) {
      if (e.target.classList.contains("page-tab-del")) return;
      if (e.target.classList.contains("page-tab-settings")) return;
      FB.pages.switchTo(tab.dataset.pageId);
    });
  });
};

FB.pages._startRename = function (id) {
  var bar = document.getElementById("page-tabs-bar");
  if (!bar) return;
  var tab = bar.querySelector('[data-page-id="' + id + '"]');
  if (!tab) return;
  var nameEl = tab.querySelector(".page-tab-name");
  var cur = nameEl.textContent;
  var inp = document.createElement("input");
  inp.className = "page-tab-rename-input";
  inp.value = cur;
  nameEl.replaceWith(inp);
  inp.focus();
  inp.select();
  var committed = false;
  function commit() {
    if (committed) return;
    committed = true;
    FB.pages.rename(id, inp.value || cur);
  }
  inp.addEventListener("blur", commit);
  inp.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      inp.blur();
    }
    if (e.key === "Escape") {
      inp.value = cur;
      inp.blur();
    }
  });
};

FB.pages.updateMetadata = function (pageId, key, value) {
  var page = FB.state.pages.find(function (p) {
    return p.id === pageId;
  });
  if (!page) return;
  page[key] = value;
  FB.pages._save();
};

FB.pages.showMetadataEditor = function (pageId) {
  if (FB.state.currentPageId !== pageId) {
    FB.pages.switchTo(pageId);
  }
  FB.state.metadataEditingPageId = pageId;
  FB.panels.renderRightPanel();
};

FB.pages.renderMetadataPanel = function (pageId) {
  var page = FB.state.pages.find(function (p) {
    return p.id === pageId;
  });
  if (!page) return "";

  var html = '<div class="metadata-panel">';
  html += '<h3 style="margin:0 0 1rem 0;font-size:1rem;">Page Settings</h3>';

  // Page title
  html += '<div class="metadata-field">';
  html += '<label>Page Title <span class="char-count">0/60</span></label>';
  html +=
    '<input id="page_title" name="page_title" type="text" class="page-title-input" value="' +
    (page.title || "") +
    '" placeholder="e.g., Home | My Site" maxlength="60" />';
  html += "</div>";

  // Meta description
  html += '<div class="metadata-field">';
  html += '<label>Meta Description <span class="char-count">0/160</span></label>';
  html +=
    '<textarea id="page_description" name="page_description" class="page-description-input" placeholder="e.g., Learn about our amazing services" maxlength="160" style="height:80px;resize:vertical;">' +
    (page.description || "") +
    "</textarea>";
  html += "</div>";

  // OG Image
  html += '<div class="metadata-field">';
  html +=
    '<label>Open Graph Image <span style="font-size:0.85em;color:#666;">(optional)</span></label>';
  html +=
    '<input id="page_ogImage" name="page_ogImage" type="text" class="page-og-image-input" value="' +
    (page.ogImage || "") +
    '" placeholder="https://example.com/image.jpg" />';
  html += "</div>";

  // Favicon
  html += '<div class="metadata-field">';
  html +=
    '<label>Favicon URL <span style="font-size:0.85em;color:#666;">(optional)</span></label>';
  html +=
    '<input id="page_favicon" name="page_favicon" type="text" class="page-favicon-input" value="' +
    (page.favicon || "") +
    '" placeholder="https://example.com/favicon.ico" />';
  html += "</div>";

  // Custom CSS
  html += '<div class="metadata-field">';
  html +=
    '<label>Custom CSS <span style="font-size:0.85em;color:#666;">(optional)</span></label>';
  html +=
    '<textarea id="page_customCSS" name="page_customCSS" class="page-css-input" placeholder="/* Page-specific styles */" style="height:100px;resize:vertical;font-family:monospace;font-size:12px;">' +
    (page.customCSS || "") +
    "</textarea>";
  html += "</div>";

  // Meta Links
  html += '<div class="metadata-field">';
  html += '<label>Meta Links & Enrichment</label>';
  html += '<div class="metalinks-buttons">';
  html +=
    '<button class="metalink-btn" onclick="FB.pages._addMetalink(\'canonical\', \'' +
    pageId +
    '\')">Add Canonical</button>';
  html +=
    '<button class="metalink-btn" onclick="FB.pages._addMetalink(\'alternate\', \'' +
    pageId +
    '\')">Add Alternate</button>';
  html +=
    '<button class="metalink-btn" onclick="FB.pages._addMetalink(\'custom\', \'' +
    pageId +
    '\')">Add Custom</button>';
  html += "</div>";

  // Meta links table
  if (page.metalinks && page.metalinks.length) {
    html += '<table class="metalinks-table">';
    html +=
      '<thead><tr><th>Type</th><th>Value</th><th>Action</th></tr></thead><tbody>';
    page.metalinks.forEach(function (link, idx) {
      html += "<tr>";
      html += "<td>" + (link.rel || "custom") + "</td>";
      html +=
        '<td style="word-break:break-all;font-size:0.9em;">' +
        (link.href || "") +
        (link.hreflang ? " (hreflang: " + link.hreflang + ")" : "") +
        "</td>";
      html +=
        '<td><button class="metalink-remove-btn" onclick="FB.pages._removeMetalink(\'' +
        pageId +
        "', " +
        idx +
        ')">✕</button></td>';
      html += "</tr>";
    });
    html += "</tbody></table>";
  }
  html += "</div>";

  // Save button
  html +=
    '<button class="metadata-save-btn" onclick="FB.pages._saveMetadataPanel(\'' +
    pageId +
    '\')" style="margin-top:1rem;">Save Changes</button>';

  html += "</div>";
  return html;
};

FB.pages._saveMetadataPanel = function (pageId) {
  var panel = document.querySelector(".metadata-panel");
  if (!panel) return;

  var title = panel.querySelector(".page-title-input").value;
  var description = panel.querySelector(".page-description-input").value;
  var ogImage = panel.querySelector(".page-og-image-input").value;
  var favicon = panel.querySelector(".page-favicon-input").value;
  var customCSS = panel.querySelector(".page-css-input").value;

  FB.pages.updateMetadata(pageId, "title", title);
  FB.pages.updateMetadata(pageId, "description", description);
  FB.pages.updateMetadata(pageId, "ogImage", ogImage);
  FB.pages.updateMetadata(pageId, "favicon", favicon);
  FB.pages.updateMetadata(pageId, "customCSS", customCSS);

  FB.util.showToast("Page metadata saved");
  FB.state.metadataEditingPageId = null;
  FB.panels.renderRightPanel();
};

FB.pages._addMetalink = function (type, pageId) {
  var page = FB.state.pages.find(function (p) {
    return p.id === pageId;
  });
  if (!page) return;

  var rel = "";
  var href = "";
  var hreflang = "";

  if (type === "canonical") {
    rel = "canonical";
    href = prompt("Enter canonical URL:");
    if (!href) return;
  } else if (type === "alternate") {
    rel = "alternate";
    href = prompt("Enter alternate URL:");
    if (!href) return;
    hreflang = prompt("Enter hreflang value (e.g., en-US):");
    if (!hreflang) return;
  } else if (type === "custom") {
    rel = prompt("Enter rel attribute (e.g., prefetch, preload):");
    if (!rel) return;
    href = prompt("Enter href:");
    if (!href) return;
  }

  if (!page.metalinks) page.metalinks = [];
  page.metalinks.push({ rel: rel, href: href, hreflang: hreflang || null });
  FB.pages._save();
  FB.pages.showMetadataEditor(pageId);
};

FB.pages._removeMetalink = function (pageId, idx) {
  var page = FB.state.pages.find(function (p) {
    return p.id === pageId;
  });
  if (!page || !page.metalinks || idx < 0 || idx >= page.metalinks.length) return;
  page.metalinks.splice(idx, 1);
  FB.pages._save();
  FB.pages.showMetadataEditor(pageId);
};

// Export all pages as separate HTML files (sequential downloads)
FB.pages.exportAll = function () {
  FB.pages._save();
  var pages = FB.state.pages;
  var origId = FB.state.currentPageId;
  var origBlocks = JSON.parse(JSON.stringify(FB.state.blocks));
  var idx = 0;

  function downloadNext() {
    if (idx >= pages.length) {
      // Restore original state
      FB.state.currentPageId = origId;
      FB.state.blocks = origBlocks;
      FB.canvas.render();
      FB.pages.render();
      FB.util.showToast("All pages exported");
      return;
    }
    var page = pages[idx++];
    FB.state.currentPageId = page.id;
    FB.state.blocks = JSON.parse(JSON.stringify(page.blocks));
    var html = FB.export.generateHTML();
    var slug = page.slug || page.name.toLowerCase().replace(/\s+/g, "-");
    var filename = (slug === "index" ? "index" : slug) + ".html";
    var blob = new Blob([html], { type: "text/html" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(downloadNext, 600);
  }
  downloadNext();
};
