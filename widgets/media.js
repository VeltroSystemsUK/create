// Media Widgets

FB.widgets.register("imageGallery", {
  label: "Image Gallery",
  icon: "\u25A6",
  iconBg: "#1a3a2a",
  iconColor: "#CDFE00",
  category: "media",
  defaultProps: { columns: 3, gap: 8, images: ["", "", ""], captions: ["", "", ""] },
  render: function (p) {
    var imgs = p.images || [];
    var caps = p.captions || [];
    return (
      '<div style="display:grid;grid-template-columns:repeat(' +
      (p.columns || 3) +
      ",1fr);gap:" +
      (p.gap || 8) +
      'px;padding:0.5rem 1rem">' +
      imgs
        .map(function (src, i) {
          return src
            ? '<div style="text-align:center">' +
                '<img src="' +
                src +
                '" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px">' +
                (caps[i]
                  ? '<div style="font-size:11px;color:#666;margin-top:4px">' + caps[i] + '</div>'
                  : '') +
                '</div>'
            : '<div style="background:#f0f0f0;aspect-ratio:1;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#ccc;font-size:11px;border:1px dashed #ddd">Image ' +
                (i + 1) +
                "</div>";
        })
        .join("") +
      "</div>"
    );
  },
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
});
