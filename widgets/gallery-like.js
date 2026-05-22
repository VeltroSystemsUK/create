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
  editPanel: function (id, p) {
    var html =
      '<div class="rp-row"><label>Columns: ' +
      (p.columns || 3) +
      '</label><input type="range" min="2" max="6" value="' +
      (p.columns || 3) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','columns',+this.value);this.previousElementSibling.textContent='Columns: '+this.value\"></div>";
    (p.images || []).forEach(function (src, i) {
      html +=
        '<div class="rp-row"><label>Image ' +
        (i + 1) +
        ' URL</label><input type="text" value="' +
        src +
        '" onchange="var blk=FB.state.blocks.find(function(b){return b.id===\'' +
        id +
        "'});var imgs=JSON.parse(JSON.stringify(blk.props.images||[]));imgs[" +
        i +
        "]=this.value;FB.panels.updateWidgetProp('" +
        id +
        "','images',imgs)\"></div>";
    });
    return html;
  },
});

FB.widgets.register("portfolio", {
  label: "Portfolio",
  icon: "\u25A9",
  iconBg: "#2a1a3a",
  iconColor: "#CDFE00",
  category: "gallery-like",
  defaultProps: {
    items: [
      { title: "Project 1", tag: "Brand" },
      { title: "Project 2", tag: "Web" },
      { title: "Project 3", tag: "Brand" },
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
            '<div style="width:100%;aspect-ratio:4/3;background:linear-gradient(135deg,#1a1a3a,' +
            ["#3a1a5e", "#1a4a6e", "#2e6e2e", "#7e3a1a", "#3a3a3a"][i % 5] +
            ");display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.2);font-size:2rem;font-weight:700;font-family:'Lexend',sans-serif\">" +
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
  editPanel: function (id, p) {
    var html =
      '<div class="rp-row"><label>Columns: ' +
      (p.columns || 3) +
      '</label><input type="range" min="2" max="4" value="' +
      (p.columns || 3) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','columns',+this.value);this.previousElementSibling.textContent='Columns: '+this.value\"></div>";
    (p.items || []).forEach(function (item, i) {
      html +=
        '<div class="rp-row" style="border:1px solid var(--border);border-radius:4px;margin:4px 14px;padding:8px">' +
        '<div style="display:flex;gap:4px"><input type="text" value="' +
        item.title +
        '" placeholder="Title" style="flex:1" onchange="var items=JSON.parse(JSON.stringify(FB.state.blocks.find(function(b){return b.id===\'' +
        id +
        "'}).props.items||[]));items[" +
        i +
        "].title=this.value;FB.panels.updateWidgetProp('" +
        id +
        "','items',items)\">" +
        '<input type="text" value="' +
        (item.tag || "") +
        '" placeholder="Tag" style="width:80px" onchange="var items=JSON.parse(JSON.stringify(FB.state.blocks.find(function(b){return b.id===\'' +
        id +
        "'}).props.items||[]));items[" +
        i +
        "].tag=this.value;FB.panels.updateWidgetProp('" +
        id +
        "','items',items)\"></div></div>";
    });
    return html;
  },
});

FB.widgets.register("slides", {
  label: "Slides",
  icon: "\u25A0",
  iconBg: "#1a1a2a",
  iconColor: "#CDFE00",
  category: "gallery-like",
  defaultProps: {
    slides: [
      { title: "Slide 1", desc: "Description 1", cta: "Learn More" },
      { title: "Slide 2", desc: "Description 2", cta: "Get Started" },
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
            "flex-direction:column;justify-content:center;min-height:350px;padding:3rem;background:linear-gradient(135deg," +
            ["#1a1a3a", "#1a3a2a", "#2a1a3a"][i % 3] +
            "," +
            ["#3a1a5e", "#2a6e3a", "#5a2a7a"][i % 3] +
            ')">' +
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
  editPanel: function (id, p) {
    var html = "";
    (p.slides || []).forEach(function (s, i) {
      html +=
        '<div class="rp-row" style="border:1px solid var(--border);border-radius:4px;margin:4px 14px;padding:8px">' +
        "<label>Slide " +
        (i + 1) +
        ' Title</label><input type="text" value="' +
        s.title +
        '" onchange="var slides=JSON.parse(JSON.stringify(FB.state.blocks.find(function(b){return b.id===\'' +
        id +
        "'}).props.slides||[]));slides[" +
        i +
        "].title=this.value;FB.panels.updateWidgetProp('" +
        id +
        "','slides',slides)\">" +
        '<label style="margin-top:4px">Description</label><textarea rows="2" onchange="var slides=JSON.parse(JSON.stringify(FB.state.blocks.find(function(b){return b.id===\'' +
        id +
        "'}).props.slides||[]));slides[" +
        i +
        "].desc=this.value;FB.panels.updateWidgetProp('" +
        id +
        "','slides',slides)\">" +
        s.desc +
        "</textarea>" +
        '<label style="margin-top:4px">CTA Text</label><input type="text" value="' +
        s.cta +
        '" onchange="var slides=JSON.parse(JSON.stringify(FB.state.blocks.find(function(b){return b.id===\'' +
        id +
        "'}).props.slides||[]));slides[" +
        i +
        "].cta=this.value;FB.panels.updateWidgetProp('" +
        id +
        "','slides',slides)\"></div>";
    });
    return html;
  },
});
