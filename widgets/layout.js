// Layout Widgets

FB.widgets.register("row", {
  label: "Row / Columns",
  icon: "\u25A6",
  iconBg: "#1a1a2a",
  iconColor: "#CDFE00",
  category: "layout",
  isContainer: true,
  defaultProps: { columns: 2, layout: "1fr 1fr", gap: 16 },
  render: function (p) {
    var cols = p.columns || 2;
    var colHtml = "";
    for (var i = 0; i < cols; i++) {
      colHtml +=
        '<div class="fw-col" data-col="' +
        i +
        '" style="min-height:80px;border:1px dashed rgba(0,0,0,0.08);border-radius:6px;padding:8px;display:flex;flex-direction:column;gap:4px">' +
        '<div class="fw-col-label" style="font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#ccc;text-align:center;padding:4px 0;pointer-events:none">Col ' +
        (i + 1) +
        "</div>" +
        "</div>";
    }
    return (
      '<div class="fw-row-container" style="display:grid;grid-template-columns:' +
      (p.layout || "1fr 1fr") +
      ";gap:" +
      (p.gap || 16) +
      'px;padding:0.5rem 1rem;min-height:100px">' +
      colHtml +
      "</div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("tabs", {
  label: "Tabs",
  icon: "\u2637",
  iconBg: "#1a1a2a",
  iconColor: "#CDFE00",
  category: "layout",
  defaultProps: {
    items: [
      { title: "Tab 1", content: "Content for tab 1" },
      { title: "Tab 2", content: "Content for tab 2" },
    ],
    activeTab: 0,
  },
  render: function (p) {
    var items = p.items || [];
    if (items.length === 0)
      return '<div style="padding:1rem;color:#999">No tabs defined</div>';
    var headers = items
      .map(function (item, i) {
        return (
          '<div class="fw-tab-header" style="padding:10px 20px;cursor:pointer;border-bottom:2px solid ' +
          (i === (p.activeTab || 0) ? "var(--accent)" : "transparent") +
          ";color:" +
          (i === (p.activeTab || 0) ? "var(--accent)" : "#999") +
          ";font-weight:" +
          (i === (p.activeTab || 0) ? "600" : "400") +
          ';font-size:13px;transition:all 0.2s">' +
          item.title +
          "</div>"
        );
      })
      .join("");
    var panels = items
      .map(function (item, i) {
        return (
          '<div class="fw-tab-panel" style="display:' +
          (i === (p.activeTab || 0) ? "block" : "none") +
          ';padding:20px 0;font-size:14px;line-height:1.6">' +
          item.content +
          "</div>"
        );
      })
      .join("");
    return (
      '<div class="fw-widget-tabs" style="padding:0.5rem 1rem"><div class="fw-tabs-headers" style="display:flex;border-bottom:2px solid #eee">' +
      headers +
      '</div><div class="fw-tabs-panels">' +
      panels +
      "</div></div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("accordion", {
  label: "Accordion",
  icon: "\u2637",
  iconBg: "#1a2a1a",
  iconColor: "#CDFE00",
  category: "layout",
  defaultProps: {
    items: [
      { title: "Section 1", content: "Content 1" },
      { title: "Section 2", content: "Content 2" },
    ],
  },
  render: function (p) {
    var items = p.items || [];
    return (
      '<div style="padding:0.5rem 1rem">' +
      items
        .map(function (item, i) {
          return (
            '<div class="fw-acc-item" style="border-bottom:1px solid #eee">' +
            '<div class="fw-acc-header" style="display:flex;justify-content:space-between;padding:12px 0;cursor:pointer;font-weight:500;font-size:14px" onclick="this.classList.toggle(\'open\');var b=this.nextElementSibling;b.classList.toggle(\'open\')">' +
            "<span>" +
            item.title +
            '</span><span class="fw-acc-icon" style="transition:transform 0.2s;font-size:12px">\u25B6</span></div>' +
            '<div class="fw-acc-body" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease;font-size:13px;line-height:1.6;color:#666">' +
            '<div style="padding:0 0 12px">' +
            item.content +
            "</div></div></div>"
          );
        })
        .join("") +
      "</div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("toggle", {
  label: "Toggle",
  icon: "\u2630",
  iconBg: "#2a1a2a",
  iconColor: "#CDFE00",
  category: "layout",
  defaultProps: {
    items: [
      { title: "Option 1", content: "Toggle content 1" },
      { title: "Option 2", content: "Toggle content 2" },
    ],
  },
  render: function (p) {
    var items = p.items || [];
    return (
      '<div style="padding:0.5rem 1rem">' +
      items
        .map(function (item, i) {
          return (
            '<div style="border-bottom:1px solid #eee">' +
            "<div style=\"display:flex;justify-content:space-between;padding:10px 0;cursor:pointer;font-size:14px\" onclick=\"var b=this.nextElementSibling;if(b.style.display==='block'){b.style.display='none'}else{b.style.display='block'}\">" +
            "<span>" +
            item.title +
            '</span><span style="font-size:12px;color:#999">+</span></div>' +
            '<div style="display:none;padding:0 0 10px;font-size:13px;line-height:1.6;color:#666">' +
            item.content +
            "</div></div>"
          );
        })
        .join("") +
      "</div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("priceTable", {
  label: "Price Table",
  icon: "$",
  iconBg: "#2a3a1a",
  iconColor: "#CDFE00",
  category: "layout",
  defaultProps: {
    title: "Basic",
    price: "19",
    period: "/mo",
    currency: "$",
    description: "",
    features: ["Feature 1", "Feature 2", "Feature 3"],
    cta: "Buy Now",
    featured: false,
    badgeText: "Popular",
    image: "",
  },
  render: function (p) {
    return (
      '<div style="padding:0.5rem 1rem"><div style="background:' +
      (p.featured ? "#111" : "#fff") +
      ";border:1px solid " +
      (p.featured ? "#111" : "#eee") +
      ";border-radius:8px;padding:2rem;text-align:center;" +
      (p.featured ? "color:#fff;transform:scale(1.03)" : "color:#111") +
      '">' +
      (p.image
        ? '<img src="' +
          p.image +
          '" style="max-height:60px;margin-bottom:0.75rem" alt="">'
        : "") +
      (p.featured
        ? '<div style="background:var(--accent);color:#111;font-size:10px;letter-spacing:3px;text-transform:uppercase;padding:4px;font-weight:600;border-radius:4px;margin-bottom:1rem;display:inline-block">' +
          (p.badgeText || "Popular") +
          "</div>"
        : "") +
      "<h3 style=\"font-family:'Lexend',sans-serif;font-size:1.3rem;font-weight:700;margin-bottom:0.5rem\">" +
      (p.title || "Basic") +
      "</h3>" +
      (p.description
        ? '<p style="font-size:12px;color:' +
          (p.featured ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)") +
          ";margin-bottom:0.75rem\">" +
          p.description +
          "</p>"
        : "") +
      "<div style=\"font-family:'Lexend',sans-serif;font-size:3rem;font-weight:800;letter-spacing:-2px\">" +
      (p.currency || "") +
      (p.price || "19") +
      "</div>" +
      '<div style="font-size:12px;color:' +
      (p.featured ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)") +
      ';margin-bottom:1.5rem">' +
      (p.period || "/mo") +
      "</div>" +
      '<ul style="list-style:none;padding:0;margin:0 0 1.5rem">' +
      (p.features || [])
        .map(function (f) {
          return (
            '<li style="padding:0.5rem 0;font-size:13px;border-bottom:1px solid ' +
            (p.featured ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)") +
            '">' +
            f +
            "</li>"
          );
        })
        .join("") +
      "</ul>" +
      '<button style="width:100%;padding:0.8rem;background:' +
      (p.featured ? "var(--accent)" : "#111") +
      ";color:" +
      (p.featured ? "#111" : "#fff") +
      ';border:none;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer">' +
      (p.cta || "Buy Now") +
      "</button></div></div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("priceList", {
  label: "Price List",
  icon: "\u2637",
  iconBg: "#2a2a1a",
  iconColor: "#CDFE00",
  category: "layout",
  defaultProps: {
    items: [
      { title: "Item 1", desc: "Description", price: "$10", image: "", tag: "" },
      { title: "Item 2", desc: "Description", price: "$15", image: "", tag: "" },
    ],
    columns: 1,
  },
  render: function (p) {
    var items = p.items || [];
    return (
      '<div style="padding:0.5rem 1rem">' +
      items
        .map(function (item) {
          return (
            '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #eee">' +
            '<div style="display:flex;align-items:center;gap:10px">' +
            (item.image
              ? '<img src="' +
                item.image +
                '" style="width:40px;height:40px;border-radius:50%;object-fit:cover" alt="">'
              : "") +
            '<div><div style="display:flex;align-items:center;gap:6px"><span style="font-weight:500;font-size:14px">' +
            item.title +
            "</span>" +
            (item.tag
              ? '<span style="font-size:9px;letter-spacing:1px;text-transform:uppercase;background:var(--accent);color:#111;padding:2px 6px;border-radius:3px;font-weight:600">' +
                item.tag +
                "</span>"
              : "") +
            "</div>" +
            (item.desc
              ? '<div style="font-size:12px;color:#999">' + item.desc + "</div>"
              : "") +
            "</div></div>" +
            '<div style="font-weight:700;font-size:16px;color:var(--accent)">' +
            item.price +
            "</div></div>"
          );
        })
        .join("") +
      "</div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("flipBox", {
  label: "Flip Box",
  icon: "\u21C4",
  iconBg: "#1a2a3a",
  iconColor: "#CDFE00",
  category: "layout",
  defaultProps: {
    frontTitle: "Front",
    frontDesc: "This is the front",
    backTitle: "Back",
    backDesc: "This is the back",
    height: 300,
  },
  render: function (p) {
    var h = p.height || 300;
    return (
      '<div class="fw-flip-box" style="perspective:1000px;height:' +
      h +
      'px;margin:0.5rem 1rem">' +
      '<div class="fw-flip-inner" style="position:relative;width:100%;height:100%;transition:transform 0.6s;transform-style:preserve-3d">' +
      '<div class="fw-flip-front" style="position:absolute;width:100%;height:100%;backface-visibility:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;border-radius:6px;background:#fff;border:1px solid #eee">' +
      "<h3 style=\"font-family:'Lexend',sans-serif;font-weight:700;margin-bottom:0.5rem\">" +
      p.frontTitle +
      "</h3>" +
      '<p style="font-size:13px;color:#666;text-align:center">' +
      p.frontDesc +
      "</p></div>" +
      '<div class="fw-flip-back" style="position:absolute;width:100%;height:100%;backface-visibility:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;border-radius:6px;background:#111;color:#fff;transform:rotateY(180deg)">' +
      "<h3 style=\"font-family:'Lexend',sans-serif;font-weight:700;margin-bottom:0.5rem\">" +
      p.backTitle +
      "</h3>" +
      '<p style="font-size:13px;text-align:center">' +
      p.backDesc +
      "</p></div></div></div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("cta", {
  label: "CTA",
  icon: "\u2192",
  iconBg: "#3a3a00",
  iconColor: "#CDFE00",
  category: "layout",
  defaultProps: {
    title: "Ready to start?",
    desc: "Let's build something great together.",
    btnText: "Get in Touch",
    bg: "#CDFE00",
    color: "#111",
  },
  render: function (p) {
    return (
      '<div style="background:' +
      (p.bg || "#CDFE00") +
      ';padding:3rem 2rem;text-align:center;margin:0.5rem 1rem;border-radius:6px">' +
      "<h2 style=\"font-family:'Lexend',sans-serif;font-size:clamp(1.5rem,4vw,3rem);font-weight:800;letter-spacing:-1px;color:" +
      (p.color || "#111") +
      ';line-height:1;margin-bottom:0.5rem" contenteditable data-field="title">' +
      p.title +
      "</h2>" +
      '<p style="font-size:14px;color:' +
      (p.color || "#111") +
      ';margin-bottom:1.5rem" contenteditable data-field="desc">' +
      p.desc +
      "</p>" +
      '<button style="background:' +
      (p.color || "#111") +
      ";color:" +
      (p.bg || "#CDFE00") +
      ';padding:0.8rem 2rem;border:none;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit" contenteditable data-field="btnText">' +
      p.btnText +
      "</button></div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

// Footer widget — configurable multi-column footer
FB.widgets.register("footerWidget", {
  label: "Footer",
  icon: "\u22A5",
  iconBg: "#1a1a1a",
  iconColor: "#CDFE00",
  category: "layout",
  defaultProps: {
    columns: 3,
    layout: "1fr 1fr 1fr",
    col1Title: "About",
    col1Content:
      "We build brands and digital experiences that matter. Based in Nottingham, working worldwide.",
    col2Title: "Links",
    col2Links: ["Home", "Work", "Services", "About", "Contact"],
    col3Title: "Contact",
    col3Content: "hello@brand.co.uk\n0115 000 0000\nNottingham, UK",
    col4Title: "Follow",
    col4Links: ["Twitter", "Instagram", "LinkedIn", "Dribbble"],
    copyright: "\u00A9 2026 YourBrand. All rights reserved.",
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
  },
  render: function (p) {
    var cols = p.columns || 3;
    var items = [];
    if (cols >= 1) {
      var links1 = (p.col2Links || [])
        .map(function (l) {
          return (
            '<a href="#" style="color:rgba(255,255,255,0.5);text-decoration:none;font-size:13px;display:block;margin-bottom:8px;transition:color 0.2s">' +
            l +
            "</a>"
          );
        })
        .join("");
      var col2Body = links1 || p.col2Content || "";
      var col4Body = (p.col4Links || [])
        .map(function (l) {
          return (
            '<a href="#" style="color:rgba(255,255,255,0.5);text-decoration:none;font-size:13px;display:block;margin-bottom:8px;transition:color 0.2s">' +
            l +
            "</a>"
          );
        })
        .join("");
      items = [
        { title: p.col1Title || "About", body: p.col1Content || "" },
        { title: p.col2Title || "Links", body: col2Body },
        {
          title: p.col3Title || "Contact",
          body: (p.col3Content || "").replace(/\n/g, "<br>"),
        },
        { title: p.col4Title || "Follow", body: col4Body },
      ];
    }
    var colHtml = "";
    for (var i = 0; i < cols && i < items.length; i++) {
      colHtml +=
        '<div style="flex:1;min-width:160px">' +
        '<h4 style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:1rem;font-weight:400">' +
        items[i].title +
        "</h4>" +
        '<div style="font-size:13px;font-weight:300;line-height:1.7;color:rgba(255,255,255,0.5)">' +
        items[i].body +
        "</div></div>";
    }
    return (
      '<div class="fw-footer-widget" style="background:' +
      p.bg +
      ";padding:4rem 3rem 2rem;color:" +
      p.textColor +
      '">' +
      '<div style="display:flex;flex-wrap:wrap;gap:2rem;margin-bottom:3rem;grid-template-columns:' +
      (p.layout || "1fr 1fr 1fr") +
      '">' +
      colHtml +
      "</div>" +
      '<div style="padding-top:2rem;border-top:0.5px solid rgba(255,255,255,0.06);font-size:12px;color:rgba(255,255,255,0.3);text-align:center">' +
      (p.copyright || "") +
      "</div></div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

// Section / Container — full-bleed background with overlay and droppable content zone
FB.widgets.register("container", {
  label: "Section / Container",
  icon: "□",
  iconBg: "#0d1117",
  iconColor: "#CDFE00",
  category: "layout",
  isContainer: true,
  defaultProps: {
    columns: 1,
    columnLayout: "1fr",
    columnGap: 24,
    bgType: "color",
    bgColor: "#111111",
    bgImage: "",
    bgSize: "cover",
    bgPosition: "center center",
    gradientAngle: 135,
    gradientColor1: "#0d1117",
    gradientColor2: "#1a1a2e",
    videoUrl: "",
    overlayColor: "#000000",
    overlayOpacity: 0,
    minHeight: 300,
    paddingV: 60,
    paddingH: 40,
    contentMaxWidth: 1200,
    contentMaxWidthEnabled: true,
  },
  render: function (p) {
    var bgStyle = "";
    if (p.bgType === "image" && p.bgImage) {
      bgStyle =
        "background-image:url(" +
        p.bgImage +
        ");background-size:" +
        (p.bgSize || "cover") +
        ";background-position:" +
        (p.bgPosition || "center center") +
        ";background-repeat:no-repeat";
    } else if (p.bgType === "gradient") {
      bgStyle =
        "background-image:linear-gradient(" +
        (p.gradientAngle || 135) +
        "deg," +
        (p.gradientColor1 || "#0d1117") +
        "," +
        (p.gradientColor2 || "#1a1a2e") +
        ")";
    } else if (p.bgType === "video") {
      bgStyle = "background-color:#000";
    } else {
      bgStyle = "background-color:" + (p.bgColor || "#111111");
    }

    var videoHtml = "";
    if (p.bgType === "video" && p.videoUrl) {
      videoHtml =
        '<video autoplay muted loop playsinline style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0"><source src="' +
        p.videoUrl +
        '"></video>';
    }

    var overlayHtml =
      '<div class="fw-container-overlay" style="position:absolute;inset:0;z-index:1;background:' +
      (p.overlayColor || "#000000") +
      ";opacity:" +
      (p.overlayOpacity || 0) +
      ';pointer-events:none"></div>';

    var cols = p.columns || 1;
    var colHtml = "";
    for (var i = 0; i < cols; i++) {
      colHtml +=
        '<div class="fw-col" data-col="' +
        i +
        '" style="min-height:100px;border:1px dashed rgba(255,255,255,0.12);border-radius:4px;padding:8px;display:flex;flex-direction:column;gap:4px">' +
        '<div class="fw-col-label" style="font-size:9px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.3);text-align:center;padding:4px 0;pointer-events:none">Col ' +
        (i + 1) +
        "</div></div>";
    }

    var innerStyle =
      "display:grid;grid-template-columns:" +
      (p.columnLayout || "1fr") +
      ";gap:" +
      (p.columnGap || 24) +
      "px;" +
      (p.contentMaxWidthEnabled
        ? "max-width:" + (p.contentMaxWidth || 1200) + "px;"
        : "") +
      "width:100%;margin:0 auto";

    return (
      '<div class="fw-container-block" style="position:relative;overflow:hidden;' +
      bgStyle +
      '">' +
      videoHtml +
      overlayHtml +
      '<div class="fw-container-content" style="position:relative;z-index:2;padding:' +
      (p.paddingV || 60) +
      "px " +
      (p.paddingH || 40) +
      "px;min-height:" +
      (p.minHeight || 300) +
      'px">' +
      '<div class="fw-container-inner" style="' +
      innerStyle +
      '">' +
      colHtml +
      "</div></div></div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

// Tiling Window Manager — dynamic focus-driven flex layout
FB.widgets.register("twmWorkspace", {
  label: "TWM Workspace",
  icon: "\u25A8",
  iconBg: "#121214",
  iconColor: "#00ffcc",
  category: "layout",
  defaultProps: {
    nodes: [
      {
        title: "Main Workspace",
        desc: "This panel has primary system focus. Notice how neighboring blocks dynamically yield screen real estate.",
        label: "sys.dev/node-01",
      },
      {
        title: "Secondary Stream",
        desc: "Hovering over or clicking this pane re-tiles the environment instantly.",
        label: "sys.dev/node-02",
      },
      {
        title: "System Logs",
        desc: "A flexible horizontal sub-row running at the baseline of the window manager layout matrix.",
        label: "sys.dev/node-03",
      },
    ],
  },
  render: function (p) {
    var nodes = p.nodes || [];
    var html = '<div class="twm-workspace" data-twm="true">';
    nodes.forEach(function (n, i) {
      html +=
        '<div class="twm-node' +
        (i === 0 ? " active-focus" : "") +
        '" data-node-id="' +
        (i + 1) +
        '">' +
        '<div class="twm-node-label">' +
        (n.label || "sys.dev/node-" + (i + 1)) +
        "</div>" +
        '<div class="twm-node-title">' +
        (n.title || "Node " + (i + 1)) +
        "</div>" +
        '<div class="twm-node-desc">' +
        (n.desc || "") +
        "</div></div>";
    });
    html += "</div>";
    return html;
  },
  editPanel: function (id, p) { return ""; },
});
