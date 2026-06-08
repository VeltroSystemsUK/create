FB.help = {};

FB.help._modal = null;
FB.help._activeTopic = "overview";
FB.help._escHandler = null;

FB.help.TOPICS = [
  {
    id: "overview",
    label: "Interface Overview",
    category: "Getting Started",
    icon: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
    content: {
      title: "Interface Overview",
      intro:
        "Veltro Create is a visual page composer — no code required. Stack and style sections to build any page layout.",
      itemsLabel: "Key Areas",
      items: [
        {
          icon: "M2 3h20v4H2zM2 9h20",
          label: "Top Bar",
          desc: "Device preview, undo/redo, preview mode, save, load, import, AI import and export all live here.",
        },
        {
          icon: "M2 2h6v20H2zM10 6h12M10 12h12M10 18h12",
          label: "Left Panel",
          desc: "Browse and add sections, templates, layouts, and widgets. Click any item to add it to your canvas.",
        },
        {
          icon: "M3 3h18v18H3zM9 9h6v6H9z",
          label: "Canvas",
          desc: "Your live editing area. Click a block to select it. Use the ↑↓ arrows or drag to reorder blocks.",
        },
        {
          icon: "M16 2h6v20h-6M2 6h12M2 12h12M2 18h12",
          label: "Right Panel",
          desc: "Appears when a block is selected. Edit content, colours, typography, spacing, animations and more.",
        },
      ],
      tip: "New to Veltro Create? Click Take the Tour for a guided 2-minute walkthrough of the whole interface.",
    },
  },
  {
    id: "sections",
    label: "Working with Sections",
    category: "Building",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    content: {
      title: "Working with Sections",
      intro:
        "Sections are the building blocks of your page. Add them from the left panel, then rearrange and customise freely.",
      itemsLabel: "Actions",
      items: [
        {
          icon: "M12 5v14M5 12h14",
          label: "Adding a Section",
          desc: "Open the Sections panel on the left and click any section to add it to the bottom of your canvas.",
        },
        {
          icon: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
          label: "Selecting a Block",
          desc: "Click any block on the canvas to select it. The right panel opens with its editing controls.",
        },
        {
          icon: "M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4",
          label: "Reordering",
          desc: "Use the ↑ and ↓ arrows on a selected block to move it, or drag it to a new position on the canvas.",
        },
        {
          icon: "M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z",
          label: "Duplicating",
          desc: "Select a block, then use Actions → Duplicate in the right panel. Or press Ctrl+C then Ctrl+V.",
        },
        {
          icon: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
          label: "Deleting",
          desc: "Select a block and press Delete, or use the Delete button in the Actions section of the right panel.",
        },
      ],
      tip: "Use the Layers panel in the left sidebar to see all sections in order — click any layer to jump directly to that block.",
    },
  },
  {
    id: "styling",
    label: "Styling",
    category: "Building",
    icon: "M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6",
    content: {
      title: "Styling",
      intro:
        "Every visual property of a block is controlled from the right panel. Select any block to reveal its full styling options.",
      itemsLabel: "Right Panel Sections",
      items: [
        {
          icon: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
          label: "Style — Colours",
          desc: "Set background colour, opacity, and gradient. Use the gradient builder for linear or radial effects with custom colour stops.",
        },
        {
          icon: "M4 7h16M4 12h10M4 17h6",
          label: "Typography",
          desc: "Choose from 30 Google Fonts. Control size, weight, line height, letter spacing, and text alignment.",
        },
        {
          icon: "M21 3H3v7h18V3zM21 14H3v7h18v-7z",
          label: "Spacing & Dimensions",
          desc: "Set padding, margin (4-edge), width, height, min/max constraints, aspect ratio, and line-clamp.",
        },
        {
          icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
          label: "Effects & Border",
          desc: "Add box shadows, backdrop blur (glassmorphism), mix-blend-mode (16 options), and full border controls with radius.",
        },
        {
          icon: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3",
          label: "Hover States",
          desc: "Define a different background, opacity, or scale when the user hovers. CSS transitions are applied automatically.",
        },
      ],
      tip: "Wrapper properties (opacity, transform, hover) update instantly. Content props like background colour fully re-render the block.",
    },
  },
  {
    id: "templates",
    label: "Templates & Saving",
    category: "Building",
    icon: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
    content: {
      title: "Templates & Saving",
      intro:
        "Start from a professional template or save your own designs — your work is auto-saved and restored between sessions.",
      itemsLabel: "How To",
      items: [
        {
          icon: "M4 6h16M4 10h16M4 14h16M4 18h16",
          label: "Loading a Template",
          desc: "Open the Templates section in the left panel and click any thumbnail to load it onto the canvas.",
        },
        {
          icon: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z",
          label: "Saving Your Work",
          desc: "Click Save in the toolbar (or Ctrl+S). Your work is also auto-saved every 30 seconds to local storage.",
        },
        {
          icon: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
          label: "Loading Saved Work",
          desc: "Click Load in the toolbar to open the Template Manager and restore a previously saved design.",
        },
        {
          icon: "M12 2L2 7l10 5 10-5-10-5z",
          label: "Block Themes",
          desc: "The Block Themes panel applies a colour palette across all blocks at once — great for rapid full-page restyling.",
        },
      ],
      tip: "Your last session is automatically restored when you reload the page — no manual save needed between sessions.",
    },
  },
  {
    id: "pages",
    label: "Pages",
    category: "Building",
    icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
    content: {
      title: "Pages",
      intro:
        "Veltro Create supports multi-page projects. Each page has its own independent canvas.",
      itemsLabel: "Managing Pages",
      items: [
        {
          icon: "M4 6h16M4 10h16M4 14h16",
          label: "Viewing Pages",
          desc: "Open the Pages accordion in the left panel, or use the page tabs at the top of the canvas to see all pages.",
        },
        {
          icon: "M12 5v14M5 12h14",
          label: "Adding a Page",
          desc: "Click the + button at the top of the Pages panel to add a new blank page to your project.",
        },
        {
          icon: "M9 18l6-6-6-6",
          label: "Switching Pages",
          desc: "Click any page name in the Pages panel, or click a page tab above the canvas to switch to it.",
        },
        {
          icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
          label: "Renaming & Deleting",
          desc: "Use the options menu next to any page in the Pages panel to rename or delete it.",
        },
      ],
      tip: "When you export, all pages are included — each page becomes a separate section or file in the output.",
    },
  },
  {
    id: "import",
    label: "Import",
    category: "Advanced",
    icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
    content: {
      title: "Import",
      intro:
        "Pull content from any live website, or describe a page in plain English and let AI build it instantly.",
      itemsLabel: "Import Options",
      items: [
        {
          icon: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
          label: "URL Import",
          desc: "Click Import in the toolbar, paste any public URL, and Veltro Create scrapes and converts it into editable blocks.",
        },
        {
          icon: "M12 2a5 5 0 0 1 5 5c0 2.5-1.5 4.5-3 6l-2 3-2-3c-1.5-1.5-3-3.5-3-6a5 5 0 0 1 5-5z",
          label: "AI Import",
          desc: "Click AI in the toolbar, describe the page you need — layout, content, style — and AI generates it instantly.",
        },
        {
          icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
          label: "Reviewing Imports",
          desc: "Imported blocks land on the canvas ready to edit. Rearrange, restyle, or delete any block after importing.",
        },
      ],
      tip: 'AI Import works best with a clear brief. Include industry, style, and key sections — e.g. "Dark SaaS landing page with hero, 3 features and a CTA."',
    },
  },
  {
    id: "export",
    label: "Export",
    category: "Advanced",
    icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
    content: {
      title: "Export",
      intro:
        "When your design is ready, export clean production code — no extra libraries or dependencies required.",
      itemsLabel: "Export Formats",
      items: [
        {
          icon: "M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z",
          label: "Export HTML",
          desc: "A complete, standalone HTML file with all styles inlined. Drop it anywhere — no build step required.",
        },
        {
          icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
          label: "Export React JSX",
          desc: "A React component tree as JSX. Ready to paste into any React project.",
        },
        {
          icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
          label: "Export TSX",
          desc: "The same as React export but with TypeScript annotations — for TSX-based projects.",
        },
        {
          icon: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
          label: "Preview First",
          desc: "Click Preview in the toolbar to see exactly how your page looks before exporting. Check all three device sizes.",
        },
      ],
      tip: "Use Preview mode to check your design at desktop, tablet, and mobile sizes before downloading.",
    },
  },
  {
    id: "animations",
    label: "Animations & Effects",
    category: "Advanced",
    icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    content: {
      title: "Animations & Effects",
      intro:
        "Add entrance animations, interactive hover effects, and advanced visual treatments to any block.",
      itemsLabel: "What's Available",
      items: [
        {
          icon: "M5 3l14 9-14 9V3z",
          label: "Animation Presets",
          desc: "Select a block, open the Animation section in the right panel, choose from 10 presets, set duration and delay, then click Preview.",
        },
        {
          icon: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3",
          label: "Hover States",
          desc: "Define a different background, opacity, or scale on hover. Smooth CSS transitions are applied automatically.",
        },
        {
          icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
          label: "Effects & Border",
          desc: "Box shadows, backdrop blur for glassmorphism, mix-blend-mode (16 options), and full border controls live in the Effects section.",
        },
        {
          icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
          label: "Veltro Widgets",
          desc: "The Widgets panel has advanced animated components — particle fields, animated counters, SVG draws, countdowns, and more.",
        },
      ],
      tip: "Animations use IntersectionObserver — they trigger as each block scrolls into view, not all at once on page load.",
    },
  },
  {
    id: "shortcuts",
    label: "Keyboard Shortcuts",
    category: "Reference",
    icon: "M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01",
    content: {
      title: "Keyboard Shortcuts",
      intro:
        "Speed up your workflow with these shortcuts. All are disabled while editing text inside a block.",
      itemsLabel: "Shortcuts",
      items: [
        {
          icon: "M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
          label: "Ctrl + Z",
          desc: "Undo the last action.",
        },
        {
          icon: "M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
          label: "Ctrl + Y",
          desc: "Redo the last undone action.",
        },
        {
          icon: "M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
          label: "Ctrl + C",
          desc: "Copy the selected block to the clipboard.",
        },
        {
          icon: "M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
          label: "Ctrl + V",
          desc: "Paste a copied block below the current selection.",
        },
        {
          icon: "M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
          label: "Delete",
          desc: "Delete the selected block.",
        },
        {
          icon: "M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
          label: "Escape",
          desc: "Deselect the current block.",
        },
      ],
      tip: "Keyboard shortcuts are shown as tooltips on toolbar buttons — hover over any button to see its shortcut key.",
    },
  },
];

FB.help._buildShell = function () {
  var backdrop = document.createElement("div");
  backdrop.id = "fb-help-backdrop";
  backdrop.addEventListener("click", function (e) {
    if (e.target === backdrop) FB.help.close();
  });

  var modal = document.createElement("div");
  modal.id = "fb-help-modal";

  var sidebar = document.createElement("div");
  sidebar.id = "fb-help-sidebar";
  sidebar.innerHTML =
    '<div class="fb-help-sidebar-head">' +
    '<div class="fb-help-sidebar-title">HELP CENTRE</div>' +
    '<div class="fb-help-sidebar-sub">Veltro Create</div>' +
    "</div>" +
    '<div class="fb-help-topics" id="fb-help-topics"></div>' +
    '<div class="fb-help-sidebar-footer">' +
    '<button id="fb-help-tour-btn" onclick="FB.help.startTour()">' +
    '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">' +
    '<polygon points="5 3 19 12 5 21 5 3"/>' +
    "</svg>" +
    "Take the Tour" +
    "</button>" +
    "</div>";

  var content = document.createElement("div");
  content.id = "fb-help-content";

  var closeBtn = document.createElement("button");
  closeBtn.id = "fb-help-close";
  closeBtn.setAttribute("aria-label", "Close help");
  closeBtn.innerHTML =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
    '<line x1="18" y1="6" x2="6" y2="18"/>' +
    '<line x1="6" y1="6" x2="18" y2="18"/>' +
    "</svg>";
  closeBtn.addEventListener("click", FB.help.close);
  content.appendChild(closeBtn);

  modal.appendChild(sidebar);
  modal.appendChild(content);
  backdrop.appendChild(modal);
  return backdrop;
};

FB.help.open = function (topicId) {
  if (FB.help._modal) {
    FB.help._switchTopic(topicId || FB.help._activeTopic);
    return;
  }
  var backdrop = FB.help._buildShell();
  document.body.appendChild(backdrop);
  FB.help._modal = backdrop;

  if (FB.help._buildTopicList) FB.help._buildTopicList();
  if (FB.help._render) FB.help._render(topicId || "overview");

  FB.help._escHandler = function (e) {
    if (e.key === "Escape") FB.help.close();
  };
  document.addEventListener("keydown", FB.help._escHandler);
};

FB.help.close = function () {
  if (!FB.help._modal) return;
  FB.help._modal.remove();
  FB.help._modal = null;
  if (FB.help._escHandler) {
    document.removeEventListener("keydown", FB.help._escHandler);
    FB.help._escHandler = null;
  }
};

FB.help._buildTopicList = function () {
  var container = document.getElementById("fb-help-topics");
  if (!container) return;
  container.innerHTML = "";
  FB.help.TOPICS.forEach(function (topic) {
    var item = document.createElement("div");
    item.className =
      "fb-help-topic-item" +
      (topic.id === FB.help._activeTopic ? " active" : "");
    item.dataset.id = topic.id;
    item.innerHTML =
      '<svg class="fb-help-item-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
      '<path d="' +
      topic.icon +
      '"/>' +
      "</svg>" +
      '<span class="fb-help-topic-label">' +
      topic.label +
      "</span>";
    item.addEventListener("click", function () {
      FB.help._switchTopic(topic.id);
    });
    container.appendChild(item);
  });
};

FB.help._switchTopic = function (id) {
  FB.help._activeTopic = id;
  document.querySelectorAll(".fb-help-topic-item").forEach(function (el) {
    el.classList.toggle("active", el.dataset.id === id);
  });
  if (FB.help._render) FB.help._render(id);
};

FB.help._render = function (topicId) {
  var topic = FB.help.TOPICS.find(function (t) {
    return t.id === topicId;
  });
  if (!topic) return;
  FB.help._activeTopic = topicId;

  var container = document.getElementById("fb-help-content");
  if (!container) return;

  var closeBtn = document.getElementById("fb-help-close");

  var article = document.createElement("div");
  article.className = "fb-help-article";
  article.innerHTML =
    '<div class="fb-help-category">' +
    topic.category +
    "</div>" +
    '<div class="fb-help-article-title">' +
    topic.content.title +
    "</div>" +
    '<div class="fb-help-intro">' +
    topic.content.intro +
    "</div>" +
    '<div class="fb-help-items-label">' +
    topic.content.itemsLabel +
    "</div>";

  var itemsEl = document.createElement("div");
  itemsEl.className = "fb-help-items";
  topic.content.items.forEach(function (item) {
    var el = document.createElement("div");
    el.className = "fb-help-item";
    el.innerHTML =
      '<svg class="fb-help-item-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
      '<path d="' +
      item.icon +
      '"/>' +
      "</svg>" +
      "<div>" +
      '<div class="fb-help-item-label">' +
      item.label +
      "</div>" +
      '<div class="fb-help-item-desc">' +
      item.desc +
      "</div>" +
      "</div>";
    itemsEl.appendChild(el);
  });
  article.appendChild(itemsEl);

  if (topic.content.tip) {
    var tipEl = document.createElement("div");
    tipEl.className = "fb-help-tip";
    tipEl.innerHTML =
      '<svg class="fb-help-tip-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
      '<circle cx="12" cy="12" r="10"/>' +
      '<line x1="12" y1="8" x2="12" y2="12"/>' +
      '<line x1="12" y1="16" x2="12.01" y2="16"/>' +
      "</svg>" +
      '<div class="fb-help-tip-text">' +
      topic.content.tip +
      "</div>";
    article.appendChild(tipEl);
  }

  container.innerHTML = "";
  if (closeBtn) container.appendChild(closeBtn);
  container.appendChild(article);
};

FB.help._getDriver = function () {
  if (
    window.driver &&
    window.driver.js &&
    typeof window.driver.js.driver === "function"
  ) {
    return window.driver.js.driver;
  }
  if (typeof window.driver === "function") {
    return window.driver;
  }
  return null;
};

FB.help.startTour = function () {
  FB.help.close();

  var driverFn = FB.help._getDriver();
  if (!driverFn) {
    FB.util.showToast("Tour unavailable — please reload and try again");
    return;
  }

  var driverObj = driverFn({
    showProgress: true,
    animate: true,
    allowClose: true,
    overlayOpacity: 0.55,
    stagePadding: 6,
    stageRadius: 6,
    onDestroyed: function () {
      localStorage.setItem("fb-help-seen", "1");
      if (FB.help._removeBanner) FB.help._removeBanner();
    },
    steps: [
      {
        popover: {
          title: "Welcome to Veltro Create",
          description:
            "This quick tour walks you through the key areas of the interface. Use the arrows or keyboard to navigate — press ESC to exit at any time.",
          side: "over",
          align: "center",
        },
      },
      {
        element: "#topbar",
        popover: {
          title: "The Toolbar",
          description:
            "Switch device views, undo/redo changes, preview your page, save and load designs, import from URLs or AI, and export your finished page.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#left-panel",
        popover: {
          title: "Left Panel",
          description:
            "Browse your section library, templates, layouts, and widgets. Everything you need to build a page lives here.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#block-library",
        popover: {
          title: "Sections Library",
          description:
            "Click any section to add it to your canvas. Sections are grouped by type — hero, features, testimonials, footers, and more.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#canvas-wrap",
        popover: {
          title: "The Canvas",
          description:
            "Your live editing area. Click a block to select it. Use the ↑↓ arrows to reorder, or drag blocks to new positions.",
          side: "left",
          align: "start",
        },
      },
      {
        element: "#right-panel",
        popover: {
          title: "Block Inspector",
          description:
            "When a block is selected, this panel shows all its controls — content, colours, typography, spacing, effects, hover states, and animations.",
          side: "left",
          align: "start",
        },
      },
      {
        element: '[title="AI Import"]',
        popover: {
          title: "AI Import",
          description:
            "Describe the page you want in plain English, or paste a URL. AI will generate a full page layout for you instantly.",
          side: "bottom",
          align: "center",
        },
      },
      {
        element: ".tb-export",
        popover: {
          title: "Export",
          description:
            "When your design is ready, export clean production code as HTML, React JSX, or TypeScript TSX — no extra dependencies needed.",
          side: "bottom",
          align: "end",
        },
      },
    ],
  });

  driverObj.drive();
};

FB.help._removeBanner = function () {
  var banner = document.getElementById("fb-help-banner");
  if (banner) banner.remove();
};

FB.help._checkFirstVisit = function () {
  if (localStorage.getItem("fb-help-seen")) return;

  setTimeout(function () {
    if (document.getElementById("fb-help-banner")) return;

    var banner = document.createElement("div");
    banner.id = "fb-help-banner";
    banner.innerHTML =
      '<span class="fb-banner-text">New here?</span>' +
      '<button class="fb-banner-tour-btn">Take a quick tour</button>' +
      '<button class="fb-banner-dismiss" aria-label="Dismiss">&#x2715;</button>';

    banner
      .querySelector(".fb-banner-tour-btn")
      .addEventListener("click", function () {
        localStorage.setItem("fb-help-seen", "1");
        FB.help._removeBanner();
        FB.help.startTour();
      });

    banner
      .querySelector(".fb-banner-dismiss")
      .addEventListener("click", function () {
        localStorage.setItem("fb-help-seen", "1");
        FB.help._removeBanner();
      });

    document.body.appendChild(banner);
  }, 1500);
};
