// Content Widgets

FB.widgets.register("image", {
  label: "Image",
  icon: "\uD83D\uDDBC",
  iconBg: "#1a2a3a",
  iconColor: "#CDFE00",
  category: "content",
  defaultProps: {
    src: "",
    alt: "Image",
    width: "100%",
    align: "center",
    borderRadius: 0,
  },
  render: function (p) {
    return (
      '<div style="text-align:' +
      (p.align || "center") +
      ';padding:0.5rem 1rem">' +
      (p.src
        ? '<img src="' +
          p.src +
          '" alt="' +
          (p.alt || "") +
          '" style="max-width:' +
          (p.width || "100%") +
          ";border-radius:" +
          (p.borderRadius || 0) +
          'px;height:auto">'
        : '<div style="background:#f0f0f0;border:2px dashed #ccc;border-radius:6px;padding:3rem;text-align:center;color:#999;font-size:14px">\uD83D\uDDBC Image Placeholder<br><span style="font-size:11px">Set source URL in Style panel</span></div>') +
      "</div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("imageBox", {
  label: "Image Box",
  icon: "\uD83D\uDDBC",
  iconBg: "#2a1a3a",
  iconColor: "#CDFE00",
  category: "content",
  defaultProps: {
    src: "",
    title: "Image Title",
    desc: "Description text",
    imageBorderRadius: 6,
    imageOpacity: 1,
    titleFontSize: 18,
    descFontSize: 14,
    overlayBgColor: "rgba(0, 0, 0, 0.6)",
  },
  render: function (p) {
    return (
      '<div class="fw-image-box" style="position:relative;overflow:hidden;border-radius:' +
      (p.imageBorderRadius || 6) +
      'px;margin:0.5rem 1rem;height:300px;background:#f0f0f0' +
      (p.src ? ";background-image:url('" + p.src + "');background-size:cover;background-position:center" : "") +
      '">' +
      (p.src ? '<div class="fw-image-overlay" style="position:absolute;inset:0;background:' +
      (p.overlayBgColor || "rgba(0, 0, 0, 0.6)") +
      ';display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-end;padding:20px;opacity:1;z-index:2">' +
      '<h3 class="fw-image-title" style="margin:0 0 8px;font-size:' +
      (p.titleFontSize || 18) +
      'px;font-weight:600;color:#fff;width:100%">' +
      (p.title || "Image Title") +
      '</h3>' +
      '<p class="fw-image-desc" style="margin:0;font-size:' +
      (p.descFontSize || 14) +
      'px;color:#fff;line-height:1.4;width:100%">' +
      (p.desc || "Description text") +
      '</p></div>' : '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#999;text-align:center;flex-direction:column"><div style="font-size:3rem">\uD83D\uDDBC\uFE0F</div><div style="font-size:14px;margin-top:10px">Image Box<br><span style="font-size:11px;opacity:0.7">Add image URL in properties</span></div></div>') +
      '</div>'
    );
  },
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("button", {
  label: "Button",
  icon: "\u25B6",
  iconBg: "#1a2a3a",
  iconColor: "#CDFE00",
  category: "content",
  defaultProps: {
    text: "Click Me",
    url: "#",
    size: "md",
    align: "center",
    bg: "#CDFE00",
    color: "#111",
    image: "",
    imagePosition: "left",
    imageSize: 20,
    imageBorderRadius: 4,
  },
  render: function (p) {
    var sizes = {
      sm: "8px 16px;font-size:11px",
      md: "12px 24px;font-size:13px",
      lg: "16px 32px;font-size:15px",
    };
    var parts = (sizes[p.size] || sizes.md).split(";");
    var imageHtml = p.image
      ? '<img src="' +
        p.image +
        '" style="width:' +
        (p.imageSize || 20) +
        'px;height:' +
        (p.imageSize || 20) +
        'px;object-fit:cover;border-radius:' +
        (p.imageBorderRadius || 4) +
        'px">'
      : "";
    return (
      '<div style="text-align:' +
      (p.align || "center") +
      ';padding:0.5rem 1rem">' +
      '<a href="' +
      (p.url || "#") +
      '" style="display:inline-flex;align-items:center;gap:8px;background:' +
      (p.bg || "#CDFE00") +
      ";color:" +
      (p.color || "#111") +
      ";padding:" +
      parts[0] +
      ";" +
      (parts[1] || "") +
      ';font-weight:600;border:none;border-radius:6px;cursor:pointer;text-decoration:none;font-family:inherit;' +
      (p.imagePosition === "top" ? "flex-direction:column;" : "") +
      '" contenteditable data-field="text">' +
      (p.imagePosition === "left" ? imageHtml : "") +
      (p.text || "Click Me") +
      (p.imagePosition === "top" ? imageHtml : "") +
      "</a></div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("video", {
  label: "Video",
  icon: "\u25B6",
  iconBg: "#1a1a2a",
  iconColor: "#CDFE00",
  category: "content",
  defaultProps: {
    src: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    controls: true,
    aspectRatio: "56.25%",
    thumbnail: "",
    showThumbnail: true,
    thumbnailBorderRadius: 6,
  },
  render: function (p) {
    var bgStyle = p.thumbnail && p.showThumbnail
      ? "background-image:url('" + p.thumbnail + "');background-size:cover;background-position:center;"
      : "";
    return (
      '<div style="padding:0.5rem 1rem"><div style="position:relative;padding-bottom:' +
      (p.aspectRatio || "56.25%") +
      ';height:0;overflow:hidden;border-radius:' +
      (p.thumbnailBorderRadius || 6) +
      'px;' +
      (p.thumbnail && p.showThumbnail ? bgStyle : "") +
      '">' +
      (p.src ? '<iframe src="' +
      (p.src || "") +
      '" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none" ' +
      (p.controls ? "allowfullscreen" : "") +
      "></iframe>" : '<div style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3);color:#fff;font-size:14px">Add video URL</div>') +
      '</div></div>'
    );
  },
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("iconBox", {
  label: "Icon Box",
  icon: "\u2B1B",
  iconBg: "#1a2a3a",
  iconColor: "#CDFE00",
  category: "content",
  defaultProps: {
    icon: "\u2726",
    title: "Feature Title",
    desc: "Short description of this feature.",
    align: "left",
    image: "",
    useImage: false,
    imageSize: 60,
    imageBorderRadius: 4,
    imageMarginBottom: 12,
  },
  render: function (p) {
    var iconHtml = p.useImage && p.image
      ? '<img src="' +
        p.image +
        '" style="width:' +
        (p.imageSize || 60) +
        'px;height:' +
        (p.imageSize || 60) +
        'px;object-fit:cover;border-radius:' +
        (p.imageBorderRadius || 4) +
        'px;display:block;' +
        (p.align === "center" ? "margin:0 auto " : "margin:0 0 ") +
        (p.imageMarginBottom || 12) +
        'px">'
      : '<div class="fw-iconbox-icon" style="font-size:2rem;' +
      (p.align === "center" ? "margin:0 auto 8px" : "") +
      '">' +
      p.icon +
      "</div>";
    return (
      '<div class="fw-iconbox" style="padding:1rem;text-align:' +
      (p.align || "left") +
      '">' +
      iconHtml +
      '<div class="fw-iconbox-content"><h4 style="margin:0 0 4px;font-size:15px;font-weight:600" contenteditable data-field="title">' +
      p.title +
      "</h4>" +
      '<p style="margin:0;font-size:13px;line-height:1.5" contenteditable data-field="desc">' +
      p.desc +
      "</p></div></div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("iconList", {
  label: "Icon List",
  icon: "\u2630",
  iconBg: "#1a2a3a",
  iconColor: "#CDFE00",
  category: "content",
  defaultProps: {
    items: [
      { icon: "\u2726", text: "List item one" },
      { icon: "\u2726", text: "List item two" },
      { icon: "\u2726", text: "List item three" },
    ],
    color: "#CDFE00",
  },
  render: function (p) {
    var items = p.items || [];
    return (
      '<ul class="fw-iconlist" style="list-style:none;padding:0.5rem 1rem;margin:0">' +
      items
        .map(function (item) {
          return (
            '<li style="display:flex;align-items:center;gap:10px;padding:6px 0;font-size:14px"><span style="color:' +
            (p.color || "#CDFE00") +
            '">' +
            item.icon +
            "</span> <span>" +
            item.text +
            "</span></li>"
          );
        })
        .join("") +
      "</ul>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("socialIcons", {
  label: "Social Icons",
  icon: "\uD83D\uDD17",
  iconBg: "#1a1a3a",
  iconColor: "#CDFE00",
  category: "content",
  defaultProps: {
    items: [
      { icon: "\uD83D\uDCF1", url: "#", label: "Instagram" },
      { icon: "\uD83D\uDCF7", url: "#", label: "Twitter" },
      { icon: "\uD83D\uDCBB", url: "#", label: "GitHub" },
    ],
    shape: "circle",
    size: 40,
  },
  render: function (p) {
    var items = p.items || [];
    return (
      '<div class="fw-social-icons" style="display:flex;gap:8px;flex-wrap:wrap;padding:0.5rem 1rem">' +
      items
        .map(function (item) {
          return (
            '<a href="' +
            item.url +
            '" class="fw-social-icon" style="display:inline-flex;align-items:center;justify-content:center;width:' +
            (p.size || 40) +
            "px;height:" +
            (p.size || 40) +
            "px;border-radius:" +
            (p.shape === "circle"
              ? "50%"
              : p.shape === "square"
                ? "4px"
                : "0") +
            ";font-size:" +
            (p.size || 40) * 0.4 +
            'px;color:#fff;background:#333;text-decoration:none" title="' +
            item.label +
            '">' +
            item.icon +
            "</a>"
          );
        })
        .join("") +
      "</div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});
