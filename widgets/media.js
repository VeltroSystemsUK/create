// Media Widgets

FB.widgets.register("imageGallery", {
  label: "Image Gallery",
  icon: "\u25A6",
  iconBg: "#1a3a2a",
  iconColor: "#CDFE00",
  category: "media",
  defaultProps: { columns: 3, gap: 8, images: ["", "", ""] },
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
                '" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px">'
            : '<div style="background:#f0f0f0;aspect-ratio:1;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#ccc;font-size:11px;border:1px dashed #ddd">Image ' +
                (i + 1) +
                "</div>";
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
      "','columns',+this.value);this.previousElementSibling.textContent='Columns: '+this.value\"></div>" +
      '<div class="rp-row"><label>Gap: ' +
      (p.gap || 8) +
      'px</label><input type="range" min="2" max="24" value="' +
      (p.gap || 8) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','gap',+this.value);this.previousElementSibling.textContent='Gap: '+this.value+'px'\"></div>";
    (p.images || ["", "", ""]).forEach(function (src, i) {
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

FB.widgets.register("imageCarousel", {
  label: "Image Carousel",
  icon: "\u25B6",
  iconBg: "#1a2a2a",
  iconColor: "#CDFE00",
  category: "media",
  defaultProps: { images: ["", "", ""] },
  render: function (p) {
    var imgs = p.images || [];
    if (imgs.length === 0)
      return '<div style="padding:2rem;text-align:center;color:#999">Empty carousel</div>';
    var imgsHtml = imgs
      .map(function (src) {
        return src
          ? '<div style="min-width:100%"><img src="' +
              src +
              '" style="width:100%;height:300px;object-fit:cover;border-radius:6px"></div>'
          : '<div style="min-width:100%;height:300px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;color:#ccc;border-radius:6px;border:1px dashed #ddd">Empty Slide</div>';
      })
      .join("");
    return (
      '<div style="padding:0.5rem 1rem;overflow:hidden;position:relative;border-radius:6px">' +
      '<div style="display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:8px;scrollbar-width:none">' +
      imgs
        .map(function (src, i) {
          return (
            '<div style="min-width:100%;scroll-snap-align:start">' +
            (src
              ? '<img src="' +
                src +
                '" style="width:100%;height:300px;object-fit:cover;border-radius:6px">'
              : '<div style="width:100%;height:300px;background:#f0f0f0;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#ccc">Slide ' +
                (i + 1) +
                "</div>") +
            "</div>"
          );
        })
        .join("") +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var html = "";
    (p.images || ["", "", ""]).forEach(function (src, i) {
      html +=
        '<div class="rp-row"><label>Slide ' +
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

FB.widgets.register("soundCloud", {
  label: "SoundCloud",
  icon: "\u266A",
  iconBg: "#2a1a1a",
  iconColor: "#FF5500",
  category: "media",
  defaultProps: { url: "https://soundcloud.com/artist/track" },
  render: function (p) {
    return (
      '<div style="padding:0.5rem 1rem">' +
      '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=' +
      encodeURIComponent(p.url || "") +
      '&color=ff5500&show_artwork=true"></iframe></div>'
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Track URL</label><input type="text" value="' +
      p.url +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','url',this.value)\"></div>"
    );
  },
});
