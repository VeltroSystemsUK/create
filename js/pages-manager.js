FB.pagesManager = {};
FB.pagesManager._selectedId = null;

FB.pagesManager._templates = {
  blank: [],
  landing: function () {
    return [
      {
        id: FB.state.genId(),
        type: "nav",
        props: {
          logoText: "Your Brand",
          links: [
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
          ],
          ctaText: "Get Started",
          bg: "#111111",
          textColor: "#ffffff",
          accentColor: "#CDFE00",
        },
      },
      {
        id: FB.state.genId(),
        type: "hero",
        props: {
          eyebrow: "",
          headline: "We Build Remarkable Experiences",
          subtext:
            "Award-winning digital studio crafting websites that captivate and convert.",
          ctaText: "Get Started →",
          bg: "#111111",
          textColor: "#f7f6f2",
          accentColor: "#CDFE00",
          showBlob: true,
        },
      },
      {
        id: FB.state.genId(),
        type: "features",
        props: {
          label: "What We Do",
          headline: "Our Services",
          items: [
            {
              icon: "✦",
              title: "Strategy",
              desc: "We start with understanding your goals.",
            },
            {
              icon: "✦",
              title: "Design",
              desc: "Crafted visuals that tell your story.",
            },
            {
              icon: "✦",
              title: "Build",
              desc: "Fast, accessible, production-ready code.",
            },
          ],
          bg: "#ffffff",
          textColor: "#111111",
          accentColor: "#CDFE00",
        },
      },
      {
        id: FB.state.genId(),
        type: "cta",
        props: {
          headline: "Ready to start?",
          btnText: "Contact Us →",
          bg: "#111111",
          textColor: "#ffffff",
        },
      },
      {
        id: FB.state.genId(),
        type: "footer",
        props: {
          logoText: "Your Brand",
          tagline: "",
          cols: [
            { heading: "Company", links: ["Home", "About", "Services"] },
            { heading: "Contact", links: ["hello@yourbrand.com"] },
          ],
          copyright: "© " + new Date().getFullYear() + " Your Brand",
          bg: "#111111",
          accentColor: "#CDFE00",
        },
      },
    ];
  },
  about: function () {
    return [
      {
        id: FB.state.genId(),
        type: "nav",
        props: {
          logoText: "Your Brand",
          links: [
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
          ],
          ctaText: "Get Started",
          bg: "#111111",
          textColor: "#ffffff",
          accentColor: "#CDFE00",
        },
      },
      {
        id: FB.state.genId(),
        type: "hero",
        props: {
          eyebrow: "",
          headline: "About Us",
          subtext:
            "We're a team of designers and developers passionate about craft.",
          ctaText: "",
          bg: "#111111",
          textColor: "#f7f6f2",
          accentColor: "#CDFE00",
          showBlob: false,
        },
      },
      {
        id: FB.state.genId(),
        type: "textBlock",
        props: {
          headline: "Our Story",
          body: "Founded with a passion for craft, we set out to build a studio that puts quality first. Every project we take on is an opportunity to push the boundaries of what's possible on the web.",
          bg: "#ffffff",
          textColor: "#111111",
          accentColor: "#CDFE00",
          paddingV: 64,
          paddingH: 48,
        },
      },
      {
        id: FB.state.genId(),
        type: "stats",
        props: {
          items: [
            { value: "50+", label: "Projects" },
            { value: "8", label: "Years" },
            { value: "100%", label: "Passion" },
          ],
          bg: "#111111",
          textColor: "#ffffff",
          accentColor: "#CDFE00",
        },
      },
      {
        id: FB.state.genId(),
        type: "footer",
        props: {
          logoText: "Your Brand",
          tagline: "",
          cols: [
            { heading: "Company", links: ["Home", "About", "Services"] },
            { heading: "Contact", links: ["hello@yourbrand.com"] },
          ],
          copyright: "© " + new Date().getFullYear() + " Your Brand",
          bg: "#111111",
          accentColor: "#CDFE00",
        },
      },
    ];
  },
  contact: function () {
    return [
      {
        id: FB.state.genId(),
        type: "nav",
        props: {
          logoText: "Your Brand",
          links: [
            { label: "Home", href: "/" },
            { label: "Contact", href: "/contact" },
          ],
          ctaText: "",
          bg: "#111111",
          textColor: "#ffffff",
          accentColor: "#CDFE00",
        },
      },
      {
        id: FB.state.genId(),
        type: "hero",
        props: {
          eyebrow: "",
          headline: "Get In Touch",
          subtext:
            "We'd love to hear about your project. Send us a message and we'll get back to you.",
          ctaText: "",
          bg: "#111111",
          textColor: "#f7f6f2",
          accentColor: "#CDFE00",
          showBlob: false,
        },
      },
      {
        id: FB.state.genId(),
        type: "textBlock",
        props: {
          headline: "Contact Details",
          body: "hello@yourbrand.com\n\nLondon, UK",
          bg: "#ffffff",
          textColor: "#111111",
          accentColor: "#CDFE00",
          paddingV: 64,
          paddingH: 48,
        },
      },
      {
        id: FB.state.genId(),
        type: "footer",
        props: {
          logoText: "Your Brand",
          tagline: "",
          cols: [{ heading: "Company", links: ["Home", "About", "Contact"] }],
          copyright: "© " + new Date().getFullYear() + " Your Brand",
          bg: "#111111",
          accentColor: "#CDFE00",
        },
      },
    ];
  },
  blog: function () {
    return [
      {
        id: FB.state.genId(),
        type: "nav",
        props: {
          logoText: "Your Brand",
          links: [
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
          ],
          ctaText: "",
          bg: "#111111",
          textColor: "#ffffff",
          accentColor: "#CDFE00",
        },
      },
      {
        id: FB.state.genId(),
        type: "hero",
        props: {
          eyebrow: "",
          headline: "Journal",
          subtext: "Thoughts on design, code, and craft.",
          ctaText: "",
          bg: "#111111",
          textColor: "#f7f6f2",
          accentColor: "#CDFE00",
          showBlob: false,
        },
      },
      {
        id: FB.state.genId(),
        type: "textBlock",
        props: {
          headline: "Latest Posts",
          body: "Your blog posts will appear here. Add content blocks below.",
          bg: "#ffffff",
          textColor: "#111111",
          accentColor: "#CDFE00",
          paddingV: 64,
          paddingH: 48,
        },
      },
      {
        id: FB.state.genId(),
        type: "footer",
        props: {
          logoText: "Your Brand",
          tagline: "",
          cols: [{ heading: "Company", links: ["Home", "Blog"] }],
          copyright: "© " + new Date().getFullYear() + " Your Brand",
          bg: "#111111",
          accentColor: "#CDFE00",
        },
      },
    ];
  },
  pricing: function () {
    return [
      {
        id: FB.state.genId(),
        type: "nav",
        props: {
          logoText: "Your Brand",
          links: [
            { label: "Home", href: "/" },
            { label: "Pricing", href: "/pricing" },
          ],
          ctaText: "Get Started",
          bg: "#111111",
          textColor: "#ffffff",
          accentColor: "#CDFE00",
        },
      },
      {
        id: FB.state.genId(),
        type: "hero",
        props: {
          eyebrow: "",
          headline: "Simple Pricing",
          subtext: "One plan, no surprises. Everything you need to launch.",
          ctaText: "",
          bg: "#111111",
          textColor: "#f7f6f2",
          accentColor: "#CDFE00",
          showBlob: false,
        },
      },
      {
        id: FB.state.genId(),
        type: "stats",
        props: {
          items: [
            { value: "£999", label: "Starter" },
            { value: "£2,499", label: "Pro" },
            { value: "Custom", label: "Enterprise" },
          ],
          bg: "#ffffff",
          textColor: "#111111",
          accentColor: "#CDFE00",
        },
      },
      {
        id: FB.state.genId(),
        type: "cta",
        props: {
          headline: "Ready to get started?",
          btnText: "Contact Us →",
          bg: "#111111",
          textColor: "#ffffff",
        },
      },
      {
        id: FB.state.genId(),
        type: "footer",
        props: {
          logoText: "Your Brand",
          tagline: "",
          cols: [{ heading: "Company", links: ["Home", "Pricing"] }],
          copyright: "© " + new Date().getFullYear() + " Your Brand",
          bg: "#111111",
          accentColor: "#CDFE00",
        },
      },
    ];
  },
  services: function () {
    return [
      {
        id: FB.state.genId(),
        type: "nav",
        props: {
          logoText: "Your Brand",
          links: [
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
          ],
          ctaText: "Get Started",
          bg: "#111111",
          textColor: "#ffffff",
          accentColor: "#CDFE00",
        },
      },
      {
        id: FB.state.genId(),
        type: "hero",
        props: {
          eyebrow: "",
          headline: "Our Services",
          subtext:
            "Everything you need to launch and grow your digital presence.",
          ctaText: "",
          bg: "#111111",
          textColor: "#f7f6f2",
          accentColor: "#CDFE00",
          showBlob: false,
        },
      },
      {
        id: FB.state.genId(),
        type: "features",
        props: {
          label: "What We Offer",
          headline: "Services",
          items: [
            {
              icon: "✦",
              title: "Web Design",
              desc: "Bespoke websites built for performance and craft.",
            },
            {
              icon: "✦",
              title: "Branding",
              desc: "Identity systems that resonate and endure.",
            },
            {
              icon: "✦",
              title: "Development",
              desc: "Fast, accessible, production-ready builds.",
            },
          ],
          bg: "#ffffff",
          textColor: "#111111",
          accentColor: "#CDFE00",
        },
      },
      {
        id: FB.state.genId(),
        type: "cta",
        props: {
          headline: "Let's work together",
          btnText: "Get in touch →",
          bg: "#111111",
          textColor: "#ffffff",
        },
      },
      {
        id: FB.state.genId(),
        type: "footer",
        props: {
          logoText: "Your Brand",
          tagline: "",
          cols: [{ heading: "Company", links: ["Home", "Services"] }],
          copyright: "© " + new Date().getFullYear() + " Your Brand",
          bg: "#111111",
          accentColor: "#CDFE00",
        },
      },
    ];
  },
};

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
    var fresh = rowsEl.cloneNode(false);
    fresh.innerHTML = FB.pagesManager._buildListRows();
    rowsEl.parentNode.replaceChild(fresh, rowsEl);
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
      var fresh = rowsEl.cloneNode(false);
      fresh.innerHTML = FB.pagesManager._buildListRows();
      rowsEl.parentNode.replaceChild(fresh, rowsEl);
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

FB.pagesManager.openAddModal = function () {
  var overlay = document.getElementById("pm-template-overlay");
  if (!overlay) return;
  FB.pagesManager._templateSelection = "blank";
  FB.pagesManager._duplicateId = null;
  overlay.innerHTML = FB.pagesManager._buildTemplatePanel();
  overlay.classList.add("open");
};

FB.pagesManager._buildTemplatePanel = function () {
  var templateKeys = [
    "blank",
    "landing",
    "about",
    "contact",
    "blog",
    "pricing",
    "services",
  ];
  var templateLabels = {
    blank: "Blank",
    landing: "Landing",
    about: "About",
    contact: "Contact",
    blog: "Blog",
    pricing: "Pricing",
    services: "Services",
  };
  var dupOptions = FB.state.pages
    .map(function (p) {
      return '<option value="' + p.id + '">' + p.name + "</option>";
    })
    .join("");
  return (
    '<div class="pm-template-panel">' +
    '<div class="pm-template-header"><h3>New Page</h3>' +
    "<button class=\"pm-template-close\" onclick=\"document.getElementById('pm-template-overlay').classList.remove('open')\">×</button></div>" +
    '<input class="pm-template-name" id="pm-template-name-input" type="text" placeholder="Page name" value="">' +
    '<div class="pm-template-grid">' +
    templateKeys
      .map(function (key) {
        return (
          '<button class="pm-template-btn' +
          (key === "blank" ? " selected" : "") +
          '"' +
          ' data-template="' +
          key +
          '"' +
          " onclick=\"FB.pagesManager._selectTemplate(this, '" +
          key +
          "')\">" +
          templateLabels[key] +
          "</button>"
        );
      })
      .join("") +
    "</div>" +
    '<div class="pm-template-divider">— or duplicate existing —</div>' +
    '<select class="pm-template-dup-select" id="pm-dup-select" onchange="FB.pagesManager._selectDuplicate(this.value)">' +
    '<option value="">None</option>' +
    dupOptions +
    "</select>" +
    '<button class="pm-template-create-btn" onclick="FB.pagesManager._createPage()">Create Page</button>' +
    "</div>"
  );
};

FB.pagesManager._selectTemplate = function (btn, key) {
  FB.pagesManager._templateSelection = key;
  FB.pagesManager._duplicateId = null;
  document.querySelectorAll(".pm-template-btn").forEach(function (b) {
    b.classList.toggle("selected", b.dataset.template === key);
  });
  var dupSel = document.getElementById("pm-dup-select");
  if (dupSel) dupSel.value = "";
};

FB.pagesManager._selectDuplicate = function (pageId) {
  FB.pagesManager._duplicateId = pageId || null;
  if (pageId) {
    document.querySelectorAll(".pm-template-btn").forEach(function (b) {
      b.classList.remove("selected");
    });
    FB.pagesManager._templateSelection = null;
  }
};

FB.pagesManager._createPage = function () {
  var nameInput = document.getElementById("pm-template-name-input");
  var name = nameInput ? nameInput.value.trim() : "";
  if (!name) {
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
    var existing = FB.state.pages.map(function (p) {
      return p.name;
    });
    name =
      defaults.find(function (n) {
        return existing.indexOf(n) < 0;
      }) || "Page " + (FB.state.pages.length + 1);
  }
  var slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  var blocks = [];
  if (FB.pagesManager._duplicateId) {
    var src = FB.state.pages.find(function (p) {
      return p.id === FB.pagesManager._duplicateId;
    });
    if (src)
      blocks = JSON.parse(JSON.stringify(src.blocks)).map(function (b) {
        return Object.assign({}, b, { id: FB.state.genId() });
      });
  } else if (
    FB.pagesManager._templateSelection &&
    FB.pagesManager._templateSelection !== "blank"
  ) {
    var tplFn = FB.pagesManager._templates[FB.pagesManager._templateSelection];
    if (typeof tplFn === "function") blocks = tplFn();
  }
  var id = "p_" + Math.random().toString(36).slice(2, 7);
  FB.state.pages.push({ id: id, name: name, slug: slug, blocks: blocks });
  FB.pages._save();
  document.getElementById("pm-template-overlay").classList.remove("open");
  FB.pagesManager._selectedId = id;
  var rowsEl = document.getElementById("pm-list-rows");
  if (rowsEl) {
    var fresh = rowsEl.cloneNode(false);
    fresh.innerHTML = FB.pagesManager._buildListRows();
    rowsEl.parentNode.replaceChild(fresh, rowsEl);
    FB.pagesManager._wireDrag();
  }
  var settingsEl = document.getElementById("pm-settings");
  if (settingsEl) settingsEl.innerHTML = FB.pagesManager._buildSettings(id);
  FB.pages.render();
  FB.util.showToast("+ Page added: " + name);
};
