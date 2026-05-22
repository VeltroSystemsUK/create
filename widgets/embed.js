// Embed Widgets

FB.widgets.register("googleMaps", {
  label: "Google Maps",
  icon: "\uD83D\uDDFA",
  iconBg: "#1a2a2a",
  iconColor: "#CDFE00",
  category: "embed",
  defaultProps: { address: "London, UK", zoom: 12, height: 350 },
  render: function (p) {
    var q = encodeURIComponent(p.address || "London");
    return (
      '<div style="padding:0.5rem 1rem"><iframe width="100%" height="' +
      (p.height || 350) +
      '" frameborder="0" style="border:0;border-radius:6px" src="https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=' +
      q +
      "&zoom=" +
      (p.zoom || 12) +
      '"></iframe></div>'
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Address</label><input type="text" value="' +
      p.address +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','address',this.value)\"></div>" +
      '<div class="rp-row"><label>Zoom: ' +
      (p.zoom || 12) +
      '</label><input type="range" min="5" max="20" value="' +
      (p.zoom || 12) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','zoom',+this.value);this.previousElementSibling.textContent='Zoom: '+this.value\"></div>" +
      '<div class="rp-row"><label>Height: ' +
      (p.height || 350) +
      'px</label><input type="range" min="200" max="600" value="' +
      (p.height || 350) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value);this.previousElementSibling.textContent='Height: '+this.value+'px'\"></div>"
    );
  },
});

FB.widgets.register("codeHighlight", {
  label: "Code Highlight",
  icon: "</>",
  iconBg: "#1e1e1e",
  iconColor: "#569CD6",
  category: "embed",
  defaultProps: {
    code: 'function hello() {\n  console.log("Hello World");\n}',
    language: "JavaScript",
  },
  render: function (p) {
    return (
      '<div class="fw-code-block" style="margin:0.5rem 1rem;border-radius:6px;overflow:hidden;border:1px solid #eee">' +
      '<div class="fw-code-header" style="padding:6px 12px;background:#f5f5f5;font-size:11px;color:#999;border-bottom:1px solid #eee;display:flex;justify-content:space-between">' +
      "<span>" +
      (p.language || "Code") +
      "</span><span style=\"cursor:pointer\" onclick=\"var el=this.parentElement.nextElementSibling;navigator.clipboard.writeText(el.textContent);this.textContent='Copied!';setTimeout(function(){this.textContent='\uD83D\uDCCB'}.bind(this),1500)\">\uD83D\uDCCB</span></div>" +
      '<pre style="padding:16px;background:#1e1e1e;color:#d4d4d4;font-family:monospace;font-size:12px;line-height:1.6;overflow-x:auto;margin:0" contenteditable data-field="code">' +
      (p.code || "") +
      "</pre></div>"
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Language</label><input type="text" value="' +
      p.language +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','language',this.value)\"></div>" +
      '<div class="rp-row"><label>Code</label><textarea rows="6" style="font-family:monospace;font-size:11px" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','code',this.value)\">" +
      p.code +
      "</textarea></div>"
    );
  },
});

FB.widgets.register("shareButtons", {
  label: "Share Buttons",
  icon: "\uD83D\uDD17",
  iconBg: "#1a2a3a",
  iconColor: "#CDFE00",
  category: "embed",
  defaultProps: {
    networks: ["Twitter", "Facebook", "LinkedIn"],
    url: window.location.href,
  },
  render: function (p) {
    var nets = {
      Twitter: "\uD83D\uDD17",
      Facebook: "\uD83D\uDD17",
      LinkedIn: "\uD83D\uDD17",
      Email: "\u2709",
    };
    var colors = {
      Twitter: "#1DA1F2",
      Facebook: "#4267B2",
      LinkedIn: "#0077B5",
      Email: "#666",
    };
    var networks = p.networks || [];
    return (
      '<div class="fw-share-buttons" style="display:flex;gap:8px;flex-wrap:wrap;padding:0.5rem 1rem">' +
      networks
        .map(function (n) {
          return (
            '<button class="fw-share-btn" style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:4px;font-size:12px;font-weight:500;color:#fff;cursor:pointer;border:none;font-family:inherit;background:' +
            (colors[n] || "#333") +
            '">' +
            (nets[n] || "\uD83D\uDD17") +
            " " +
            n +
            "</button>"
          );
        })
        .join("") +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Networks (one per line)</label><textarea rows="4" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','networks',this.value.split('\\n').filter(function(s){return s.trim()}))\">" +
      (p.networks || []).join("\n") +
      "</textarea></div>"
    );
  },
});

FB.widgets.register("videoPlaylist", {
  label: "Video Playlist",
  icon: "\u25B6",
  iconBg: "#1a1a2a",
  iconColor: "#CDFE00",
  category: "embed",
  defaultProps: {
    videos: [
      { src: "https://www.youtube.com/embed/dQw4w9WgXcQ", title: "Video 1" },
      { src: "https://www.youtube.com/embed/dQw4w9WgXcQ", title: "Video 2" },
    ],
    active: 0,
  },
  render: function (p) {
    var videos = p.videos || [];
    if (videos.length === 0)
      return '<div style="padding:1rem;text-align:center;color:#999">Empty playlist</div>';
    var active = p.active || 0;
    return (
      '<div class="fw-playlist" style="display:flex;gap:12px;padding:0.5rem 1rem">' +
      '<div class="fw-playlist-main" style="flex:2"><iframe src="' +
      (videos[active]?.src || "") +
      '" style="width:100%;aspect-ratio:16/9;border-radius:4px;border:none"></iframe></div>' +
      '<div class="fw-playlist-side" style="flex:1;max-height:300px;overflow-y:auto">' +
      videos
        .map(function (v, i) {
          return (
            '<div class="fw-playlist-item' +
            (i === active ? " active" : "") +
            '" style="padding:8px;cursor:pointer;border-radius:4px;font-size:13px;' +
            (i === active
              ? "background:var(--accent);color:#111;font-weight:500"
              : "") +
            '" onclick="FB.panels.updateWidgetProp(\'' +
            p._blockId +
            "','active'," +
            i +
            ')">' +
            v.title +
            "</div>"
          );
        })
        .join("") +
      "</div></div>"
    );
  },
  editPanel: function (id, p) {
    var html = "";
    (p.videos || []).forEach(function (v, i) {
      html +=
        '<div class="rp-row" style="border:1px solid var(--border);border-radius:4px;margin:4px 14px;padding:8px">' +
        "<label>Video " +
        (i + 1) +
        ' Title</label><input type="text" value="' +
        v.title +
        '" onchange="var vs=JSON.parse(JSON.stringify(FB.state.blocks.find(function(b){return b.id===\'' +
        id +
        "'}).props.videos||[]));vs[" +
        i +
        "].title=this.value;FB.panels.updateWidgetProp('" +
        id +
        "','videos',vs)\">" +
        '<label style="margin-top:4px">Embed URL</label><input type="text" value="' +
        v.src +
        '" onchange="var vs=JSON.parse(JSON.stringify(FB.state.blocks.find(function(b){return b.id===\'' +
        id +
        "'}).props.videos||[]));vs[" +
        i +
        "].src=this.value;FB.panels.updateWidgetProp('" +
        id +
        "','videos',vs)\"></div>";
    });
    return html;
  },
});

FB.widgets.register("lottie", {
  label: "Lottie",
  icon: "\u25CF",
  iconBg: "#2a1a2a",
  iconColor: "#CDFE00",
  category: "embed",
  defaultProps: {
    src: "https://assets10.lottiefiles.com/packages/lf20_puciaact.json",
    autoplay: true,
    loop: true,
    height: 300,
  },
  render: function (p) {
    return (
      '<div style="padding:0.5rem 1rem;text-align:center">' +
      '<lottie-player src="' +
      (p.src || "") +
      '" ' +
      (p.autoplay ? "autoplay" : "") +
      " " +
      (p.loop ? "loop" : "") +
      ' mode="normal" style="width:100%;height:' +
      (p.height || 300) +
      'px"></lottie-player>' +
      '<div style="font-size:11px;color:#999;margin-top:4px">Lottie animation — requires lottie-player script</div></div>'
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Animation JSON URL</label><input type="text" value="' +
      p.src +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','src',this.value)\"></div>" +
      '<div class="rp-row"><label>Height: ' +
      (p.height || 300) +
      'px</label><input type="range" min="100" max="600" value="' +
      (p.height || 300) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value);this.previousElementSibling.textContent='Height: '+this.value+'px'\"></div>" +
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.autoplay ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','autoplay',this.checked)\"> Autoplay</label></div>" +
      '<div class="rp-row"><label><input type="checkbox" ' +
      (p.loop ? "checked" : "") +
      " onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','loop',this.checked)\"> Loop</label></div>"
    );
  },
});

// HTML Embed — renders raw HTML with preserved styles via Shadow DOM
FB.widgets.register("htmlEmbed", {
  label: "HTML Embed",
  icon: "</>",
  iconBg: "#1a1a2a",
  iconColor: "#ff6b6b",
  category: "embed",
  isContainer: false,
  defaultProps: {
    html: "<div style='padding:2rem;text-align:center;color:#666'><p>Paste or import HTML content here. Styles are scoped via Shadow DOM.</p></div>",
  },
  render: function (p) {
    return '<div class="fw-html-embed" style="min-height:60px;position:relative"></div>';
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>HTML Content</label><textarea rows="10" style="font-family:monospace;font-size:11px;line-height:1.5" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','html',this.value)\">" +
      (p.html || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;") +
      "</textarea></div>" +
      '<div style="padding:8px 14px;font-size:11px;color:var(--text-muted);border-top:1px solid var(--border)">HTML renders in a scoped Shadow DOM. Inline styles preserved.</div>'
    );
  },
});
