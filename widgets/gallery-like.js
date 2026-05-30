// Gallery Widgets

FB.widgets.register("gallery", {
  label: "Gallery",
  icon: "\u25A8",
  iconBg: "#1a3a2a",
  iconColor: "#CDFE00",
  category: "gallery-like",
  defaultProps: { images: ["", "", "", ""], columns: 3, gap: 8 },
  render: function (p) {
    var imgs = p.images || [];
    return (
      '<div style="display:grid;grid-template-columns:repeat(' +
      (p.columns || 3) +
      ",1fr);gap:" +
      (p.gap || 8) +
      'px;padding:0.5rem 1rem">' +
      imgs
        .map(function (src, i) {
          return src
            ? '<img src="' +
                src +
                '" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:4px;transition:transform 0.3s;cursor:pointer">'
            : '<div style="background:#f0f0f0;aspect-ratio:4/3;border-radius:4px;display:flex;align-items:center;justify-content:center;color:#ccc;border:1px dashed #ddd;font-size:11px">Empty</div>';
        })
        .join("") +
      "</div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("portfolio", {
  label: "Portfolio Grid",
  icon: "\u25A8",
  iconBg: "#1a3a2a",
  iconColor: "#CDFE00",
  category: "gallery-like",
  defaultProps: {
    items: [
      { title: "Project 1", tag: "Brand", image: "" },
      { title: "Project 2", tag: "Web", image: "" },
      { title: "Project 3", tag: "App", image: "" },
    ],
    columns: 3,
  },
  render: function (p) {
    var items = p.items || [];
    return (
      '<div style="padding:0.5rem 1rem"><div class="fw-portfolio-grid" style="display:grid;grid-template-columns:repeat(' +
      (p.columns || 3) +
      ',1fr);gap:12px">' +
      items
        .map(function (item, i) {
          return (
            '<div class="fw-portfolio-item" style="position:relative;overflow:hidden;border-radius:6px;background:#f5f5f5">' +
            '<div style="width:100%;aspect-ratio:4/3;' +
            (item.image ? 'background-image:url(' + item.image + ');background-size:cover;background-position:center' : 'background:linear-gradient(135deg,#1a1a3a,' + ["#3a1a5e", "#1a4a6e", "#2e6e2e", "#7e3a1a", "#3a3a3a"][i % 5] + ')') +
            ';display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.2);font-size:2rem;font-weight:700;font-family:\'Lexend\',sans-serif">' +
            (item.title || "").charAt(0) +
            "</div>" +
            '<div style="padding:0.8rem"><div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:2px">' +
            (item.tag || "") +
            "</div>" +
            '<div style="font-weight:600;font-size:14px">' +
            (item.title || "") +
            "</div></div></div>"
          );
        })
        .join("") +
      "</div></div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("slides", {
  label: "Slides",
  icon: "\u25A0",
  iconBg: "#1a1a2a",
  iconColor: "#CDFE00",
  category: "gallery-like",
  defaultProps: {
    slides: [
      { title: "Slide 1", desc: "Description 1", cta: "Learn More", bgImage: "" },
      { title: "Slide 2", desc: "Description 2", cta: "Get Started", bgImage: "" },
    ],
  },
  render: function (p) {
    var slides = p.slides || [];
    return (
      '<div class="fw-slides" style="position:relative;overflow:hidden;margin:0.5rem 1rem;border-radius:6px;min-height:350px">' +
      slides
        .map(function (s, i) {
          return (
            '<div class="fw-slide' +
            (i === 0 ? " active" : "") +
            '" style="' +
            (i === 0 ? "display:flex;" : "display:none;") +
            "flex-direction:column;justify-content:center;min-height:350px;padding:3rem;" +
            (s.bgImage ? 'background-image:url(' + s.bgImage + ');background-size:cover;background-position:center' : 'background:linear-gradient(135deg,' + ["#1a1a3a", "#1a3a2a", "#2a1a3a"][i % 3] + ',' + ["#3a1a5e", "#2a6e3a", "#5a2a7a"][i % 3] + ')') +
            '">' +
            '<div style="max-width:500px"><h2 style="font-family:\'Lexend\',sans-serif;font-size:clamp(1.5rem,4vw,3rem);font-weight:800;color:#fff;line-height:1.1;margin-bottom:0.8rem">' +
            s.title +
            "</h2>" +
            '<p style="font-size:15px;color:rgba(255,255,255,0.7);line-height:1.6;margin-bottom:1.5rem">' +
            s.desc +
            "</p>" +
            '<button style="background:var(--accent);color:#111;padding:12px 28px;border:none;border-radius:6px;font-weight:600;font-size:13px;cursor:pointer">' +
            s.cta +
            "</button></div></div>"
          );
        })
        .join("") +
      "</div>"
    );
  },
  editPanel: function (id, p) { return ""; },
});
