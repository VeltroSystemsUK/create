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
        "Veltro Create is a visual design studio for creating responsive pages. Stack, style, and export with no code.",
      itemsLabel: "Key Areas",
      items: [
        {
          icon: "M2 3h20v4H2zM2 9h20",
          label: "Top Bar",
          desc: "Device preview (desktop/tablet/mobile), undo/redo, preview mode, AI tools, export options, theme toggle, and language selection.",
        },
        {
          icon: "M2 2h6v20H2zM10 6h12M10 12h12M10 18h12",
          label: "Left Panel",
          desc: "Elements (text, shapes, images), Layers, Media Library, Brand Settings, and Assets. Collapsed mode shows icon-only view for more canvas space.",
        },
        {
          icon: "M3 3h18v18H3zM9 9h6v6H9z",
          label: "Canvas",
          desc: "Your live editing area. Click any element to select it. Drag to move, use handles to resize. Aligned guides help with positioning.",
        },
        {
          icon: "M16 2h6v20h-6M2 6h12M2 12h12M2 18h12",
          label: "Right Panel",
          desc: "Design properties (colors, typography, spacing), alignment controls, and export options. Updates based on selected element.",
        },
      ],
      tip: "New to Veltro Create? Click Take the Tour for a guided walkthrough of the interface.",
    },
  },
  {
    id: "elements",
    label: "Adding Elements",
    category: "Building",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    content: {
      title: "Adding Elements",
      intro:
        "Build with Text, Shapes, and Images. Add elements from the Elements accordion, then arrange and style them freely.",
      itemsLabel: "Element Types",
      items: [
        {
          icon: "M12 5v14M5 12h14",
          label: "Text",
          desc: "Add editable text with full font control: 30+ Google Fonts, weights, sizes, transforms, line height, letter spacing, and opacity.",
        },
        {
          icon: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
          label: "Shapes",
          desc: "Draw rectangles, circles, triangles, stars, arrows, and more. Full customization: fill, stroke, corners, shadows, and effects.",
        },
        {
          icon: "M4 5h16v14H4z",
          label: "Images",
          desc: "Insert images from your Media Library or upload new ones. Control size, opacity, flip, and apply visual effects.",
        },
        {
          icon: "M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4",
          label: "Reorder Elements",
          desc: "Use arrow buttons or drag elements on the canvas. Layers panel shows hierarchy — click any layer to select it.",
        },
        {
          icon: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
          label: "Duplicate & Delete",
          desc: "Press Ctrl+D to duplicate selected element. Press Delete to remove. Use Ctrl+Z to undo any action.",
        },
      ],
      tip: "The Layers panel shows your element structure. Useful for selecting nested elements or understanding layout hierarchy.",
    },
  },
  {
    id: "styling",
    label: "Styling & Design Properties",
    category: "Building",
    icon: "M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6",
    content: {
      title: "Styling & Design Properties",
      intro:
        "Full design control from the Design panel in the right sidebar. Select any element to reveal all its properties.",
      itemsLabel: "Design Properties",
      items: [
        {
          icon: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
          label: "Colors & Effects",
          desc: "Background color, opacity, shadows, blur, border, border radius, and blend modes. All with live preview.",
        },
        {
          icon: "M4 7h16M4 12h10M4 17h6",
          label: "Text & Typography",
          desc: "30+ Google Fonts, sizes, weights (Light to ExtraBold), styles (Bold, Italic), decorations (Underline, Strikethrough), text transform (uppercase, lowercase, capitalize), line height, letter spacing, alignment, and opacity.",
        },
        {
          icon: "M21 3H3v7h18V3zM21 14H3v7h18v-7z",
          label: "Size & Position",
          desc: "Width, height, position, padding, margin. Set constraints and alignment for responsive behavior.",
        },
        {
          icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
          label: "Advanced Effects",
          desc: "Box shadows with blur and spread, backdrop blur (glassmorphism), mix-blend-mode options, border customization.",
        },
        {
          icon: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3",
          label: "Alignment Tools",
          desc: "Align, distribute, and arrange elements. Snap to guides for precise positioning and consistent spacing.",
        },
      ],
      tip: "Brand Settings accordion lets you define global colors, fonts, and radius — apply them across all elements at once.",
    },
  },
  {
    id: "brand",
    label: "Brand Settings",
    category: "Building",
    icon: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
    content: {
      title: "Brand Settings",
      intro:
        "Define your brand's core design system — colors, fonts, and radius. Apply them globally across elements.",
      itemsLabel: "Brand Properties",
      items: [
        {
          icon: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z",
          label: "Brand Colors",
          desc: "Set Primary, Accent, Secondary Surface, Background, and Text colors. Use color pickers or hex input.",
        },
        {
          icon: "M4 7h16M4 12h10M4 17h6",
          label: "Brand Fonts",
          desc: "Choose Heading Font and Body Font from 30+ Google Fonts. These become available for quick selection.",
        },
        {
          icon: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3",
          label: "Border Radius",
          desc: "Set default corner radius (0-24px) for all elements. Control the overall visual softness of your design.",
        },
        {
          icon: "M3 3h18v18H3z",
          label: "Apply Brand",
          desc: "Capture colors from selected elements. Apply brand settings to canvas background or all elements at once.",
        },
      ],
      tip: "Brand Settings are stored locally. Keep them consistent for a cohesive design system throughout your project.",
    },
  },
  {
    id: "media",
    label: "Media Library",
    category: "Building",
    icon: "M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z",
    content: {
      title: "Media Library",
      intro:
        "Organize and manage all your images and media files. Upload, tag, filter, and drag to canvas.",
      itemsLabel: "Features",
      items: [
        {
          icon: "M12 5v14M5 12h14",
          label: "Upload Media",
          desc: "Click Upload in the Media Library accordion to add images. Files are stored on the server and persist across sessions.",
        },
        {
          icon: "M4 7h16M4 12h10M4 17h6",
          label: "Organize with Tags",
          desc: "Right-click any media item to add tags for easy filtering and organization. Tags help you find media quickly.",
        },
        {
          icon: "M3 3h18v18H3z",
          label: "Filter by Category",
          desc: "Filter media by type: All, Graphics, Photos, Icons, Videos. Categories auto-assign based on file type.",
        },
        {
          icon: "M7 16V4m0 0L3 8m4-4l4 4",
          label: "Drag to Canvas",
          desc: "Drag any media item directly onto the canvas. Images insert at drop position with automatic scaling.",
        },
      ],
      tip: "Media is stored server-side. Upload once, use anywhere. All files persist between sessions.",
    },
  },
  {
    id: "import",
    label: "AI Template Builder",
    category: "Advanced",
    icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
    content: {
      title: "AI Template Builder",
      intro:
        "Generate complete page designs from plain text descriptions. Describe what you need and AI builds it instantly.",
      itemsLabel: "How To Use AI",
      items: [
        {
          icon: "M12 2a5 5 0 0 1 5 5c0 2.5-1.5 4.5-3 6l-2 3-2-3c-1.5-1.5-3-3.5-3-6a5 5 0 0 1 5-5z",
          label: "Open AI Template Builder",
          desc: "Click 'AI Template Builder' in Assets accordion or Create menu. Opens a dialog to describe your page.",
        },
        {
          icon: "M4 7h16M4 12h10M4 17h6",
          label: "Describe Your Page",
          desc: "Write a clear description: industry, style, layout sections, content focus. E.g., 'SaaS landing with hero, pricing, CTA'.",
        },
        {
          icon: "M3 3h18v18H3z",
          label: "AI Generates Design",
          desc: "AI creates a complete page layout with content, colors, and typography. Fully editable on the canvas.",
        },
        {
          icon: "M7 16V4m0 0L3 8m4-4l4 4",
          label: "Edit & Customize",
          desc: "All elements are fully editable. Rearrange sections, change text, adjust colors, modify fonts — no restrictions.",
        },
      ],
      tip: "Be specific in your description for better results. Include industry, target audience, and key sections.",
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
        "When your design is ready, export in multiple formats. Clean, production-ready code with zero dependencies.",
      itemsLabel: "Export Options",
      items: [
        {
          icon: "M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z",
          label: "Export HTML",
          desc: "Standalone HTML file with all styles inlined. Drop anywhere, works immediately. Perfect for static hosting.",
        },
        {
          icon: "M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z",
          label: "Export PNG",
          desc: "Rasterized image of your design. Great for previews, social sharing, or presentations.",
        },
        {
          icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
          label: "Export SVG",
          desc: "Vector format for scalable graphics. Preserves all vector shapes and text as editable SVG.",
        },
        {
          icon: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
          label: "Preview Mode",
          desc: "Click Preview in toolbar to test responsiveness at desktop, tablet, and mobile sizes before exporting.",
        },
      ],
      tip: "Always preview at multiple sizes. Check layout, typography, and alignment look correct on all devices.",
    },
  },
  {
    id: "effects",
    label: "Visual Effects & Hover",
    category: "Advanced",
    icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    content: {
      title: "Visual Effects & Hover States",
      intro:
        "Add interactive hover effects and advanced visual treatments. Make your design feel responsive and polished.",
      itemsLabel: "Available Effects",
      items: [
        {
          icon: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3",
          label: "Hover States",
          desc: "Define different styles on hover: background color, opacity, or scale. CSS transitions apply automatically for smooth interactions.",
        },
        {
          icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z",
          label: "Shadows & Blur",
          desc: "Box shadows with control over spread, blur, and offset. Backdrop blur for glassmorphism effects.",
        },
        {
          icon: "M3 3h18v18H3z",
          label: "Mix Blend Modes",
          desc: "16 blend mode options (multiply, screen, overlay, etc.) for creative layering and color effects.",
        },
        {
          icon: "M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6",
          label: "Borders & Radius",
          desc: "Full border customization: width, color, style. Border radius for curved corners (0-24px).",
        },
      ],
      tip: "Hover effects are instant. Use blur and shadows to create depth. Blend modes work best with semi-transparent elements.",
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
        "Speed up your workflow with these keyboard shortcuts. Shortcuts are available when not editing text.",
      itemsLabel: "Shortcuts",
      items: [
        {
          icon: "M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
          label: "Ctrl + Z",
          desc: "Undo the last change.",
        },
        {
          icon: "M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
          label: "Ctrl + Y",
          desc: "Redo the last undone change.",
        },
        {
          icon: "M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
          label: "Ctrl + D",
          desc: "Duplicate the selected element.",
        },
        {
          icon: "M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
          label: "Delete",
          desc: "Delete the selected element from the canvas.",
        },
        {
          icon: "M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
          label: "Arrow Keys (↑↓)",
          desc: "Move selected element up or down in the layer order.",
        },
        {
          icon: "M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
          label: "Escape",
          desc: "Deselect current element and close panels.",
        },
      ],
      tip: "Many shortcuts are shown in toolbar button tooltips. Hover to discover more. Works outside text editing mode.",
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
            "This quick tour walks you through the interface. Use arrow buttons or keyboard to navigate — press ESC to exit anytime.",
          side: "over",
          align: "center",
        },
      },
      {
        element: "#topbar",
        popover: {
          title: "Top Bar",
          description:
            "Device preview, undo/redo, preview mode, theme toggle, AI tools, and export. Everything to manage your design.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#left-panel",
        popover: {
          title: "Left Panel",
          description:
            "Elements (text, shapes, images), Layers, Media Library, Brand Settings, and Assets. Collapse it to icon view for more canvas space.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "[data-acc='elements']",
        popover: {
          title: "Elements",
          description:
            "Click to expand and add text, shapes, or images to your canvas. All the building blocks you need.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "[data-acc='brand']",
        popover: {
          title: "Brand Settings",
          description:
            "Define your brand colors, fonts, and border radius. Apply them globally for a consistent design system.",
          side: "right",
          align: "start",
        },
      },
      {
        element: "#ds-canvas-wrap",
        popover: {
          title: "The Canvas",
          description:
            "Your live editing area. Click any element to select. Drag to move. Use handles to resize. Guides help align elements.",
          side: "left",
          align: "start",
        },
      },
      {
        element: "#ds-right-panel",
        popover: {
          title: "Design Panel",
          description:
            "Colors, typography, spacing, effects, borders, hover states, and alignment. All controls for the selected element.",
          side: "left",
          align: "start",
        },
      },
      {
        element: ".tb-preview",
        popover: {
          title: "Preview Mode",
          description:
            "Click Preview to test your design at desktop, tablet, and mobile sizes. Check responsiveness before exporting.",
          side: "bottom",
          align: "center",
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
