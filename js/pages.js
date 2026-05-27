FB.pages = {};

FB.pages.init = function () {
  var id = "p_" + Math.random().toString(36).slice(2, 7);
  FB.state.pages = [{ id: id, name: "Home", slug: "index", blocks: [] }];
  FB.state.currentPageId = id;
  FB.state.blocks = [];
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
  FB.state.pages.push({
    id: id,
    name: name,
    slug: name.toLowerCase().replace(/\s+/g, "-"),
    blocks: [],
  });
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

  var html =
    '<button class="page-tabs-scroll-btn" id="page-tabs-prev" onclick="FB.pages._scrollTabs(-1)" title="Scroll left">‹</button>';
  html += '<div class="page-tabs-inner" id="page-tabs-inner">';
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
  html +=
    '<button class="page-tabs-scroll-btn" id="page-tabs-next" onclick="FB.pages._scrollTabs(1)" title="Scroll right">›</button>';
  html +=
    '<button class="page-tabs-manage-btn" onclick="FB.pagesManager.open()" title="Manage pages">Manage</button>';
  bar.innerHTML = html;

  bar.querySelectorAll(".page-tab").forEach(function (tab) {
    tab.addEventListener("click", function (e) {
      if (e.target.classList.contains("page-tab-del")) return;
      FB.pages.switchTo(tab.dataset.pageId);
    });
  });

  FB.pages._updateScrollBtns();
  var inner = document.getElementById("page-tabs-inner");
  if (inner) inner.addEventListener("scroll", FB.pages._updateScrollBtns);
};

FB.pages._scrollTabs = function (dir) {
  var inner = document.getElementById("page-tabs-inner");
  if (inner) inner.scrollBy({ left: dir * 160, behavior: "smooth" });
};

FB.pages._updateScrollBtns = function () {
  var inner = document.getElementById("page-tabs-inner");
  var prev = document.getElementById("page-tabs-prev");
  var next = document.getElementById("page-tabs-next");
  if (!inner || !prev || !next) return;
  var overflows = inner.scrollWidth > inner.clientWidth + 2;
  prev.classList.toggle("visible", overflows && inner.scrollLeft > 4);
  next.classList.toggle(
    "visible",
    overflows && inner.scrollLeft < inner.scrollWidth - inner.clientWidth - 4,
  );
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
