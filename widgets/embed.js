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
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("codeBlock", {
  label: "Code Block",
  icon: "{ }",
  iconBg: "#1a1a2a",
  iconColor: "#66d9ef",
  category: "embed",
  defaultProps: {
    code: "console.log('Hello World');",
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
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
  editPanel: function (id, p) { return ""; },
});

FB.widgets.register("lottie", {
  label: "Lottie Animation",
  icon: "\u25CF",
  iconBg: "#2a1a2a",
  iconColor: "#CDFE00",
  category: "embed",
  defaultProps: {
    src: "https://assets10.lottiefiles.com/packages/lf20_puciaact.json",
    autoplay: true,
    loop: true,
    height: 300,
    speed: 1,
    bg: "transparent",
  },
  render: function (p) {
    var id = p._blockId || "lt" + Date.now();
    return (
      '<div class="fw-lottie-wrap" id="lottie-' +
      id +
      '" data-src="' +
      (p.src || "") +
      '" data-autoplay="' +
      (p.autoplay ? "1" : "0") +
      '" data-loop="' +
      (p.loop ? "1" : "0") +
      '" data-speed="' +
      (p.speed || 1) +
      '" style="width:100%;height:' +
      (p.height || 300) +
      "px;background:" +
      (p.bg || "transparent") +
      ';position:relative;border-radius:4px;overflow:hidden"><div class="fw-lottie-svg" style="width:100%;height:100%"></div></div>'
    );
  },
  editPanel: function (id, p) { return ""; },
});

// ── Motion Block (created by Motion Creator) ──
FB.widgets.register("motionBlock", {
  label: "Motion Animation",
  icon: "🎬",
  iconBg: "#1a1a2a",
  iconColor: "#cdfe00",
  category: "embed",
  defaultProps: { animData: "{}", height: 350, bg: "#0d0d1a", loop: true },
  render: function (p) {
    var id = p._blockId || "mot" + Date.now();
    return (
      '<div class="fw-motion-wrap" id="motion-' +
      id +
      '" data-anim="' +
      (p.animData || "{}").replace(/"/g, "&quot;") +
      '" data-loop="' +
      (p.loop ? "1" : "0") +
      '" style="height:' +
      (p.height || 350) +
      "px;background:" +
      (p.bg || "#0d0d1a") +
      ';position:relative;overflow:hidden;border-radius:4px"><canvas class="fw-motion-canvas" style="position:absolute;inset:0;width:100%;height:100%"></canvas></div>'
    );
  },
  editPanel: function (id, p) { return ""; },
});

if (window.FB && window.FB.panels) {
  FB.panels._lottieLoaded = false;

  FB.panels.initLottie = function () {
  document
    .querySelectorAll(".fw-lottie-wrap:not([data-lottie-init])")
    .forEach(function (wrap) {
      wrap.dataset.lottieInit = "1";
      var src = wrap.dataset.src;
      var autoplay = wrap.dataset.autoplay === "1";
      var loop = wrap.dataset.loop === "1";
      var speed = +(wrap.dataset.speed || 1);
      if (!src) return;
      var container = wrap.querySelector(".fw-lottie-svg");
      if (!container) return;

      function loadAndPlay() {
        if (!window.bodymovin) return;
        var anim = window.bodymovin.loadAnimation({
          container: container,
          renderer: "svg",
          loop: loop,
          autoplay: autoplay,
          path: src,
        });
        anim.setSpeed(speed);
        anim.addEventListener("data_failed", function () {
          container.innerHTML =
            '<div style="padding:2rem;text-align:center;color:#666;font-size:12px">Failed to load animation</div>';
        });
      }

      if (window.bodymovin) {
        loadAndPlay();
      } else {
        var s = document.createElement("script");
        s.src =
          "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js";
        s.onload = loadAndPlay;
        s.onerror = function () {
          container.innerHTML =
            '<div style="padding:2rem;text-align:center;color:#666;font-size:12px">Could not load Lottie renderer</div>';
        };
        document.head.appendChild(s);
      }
    });
  };

  FB.panels._initLottie = function () {
    FB.panels.initLottie();
    setInterval(function () {
      FB.panels.initLottie();
    }, 2000);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", FB.panels._initLottie);
  } else {
    FB.panels._initLottie();
  }
}

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
  editPanel: function (id, p) { return ""; },
});
