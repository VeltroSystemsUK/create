FB.widgets.register("imageViewer", {
  label: "Image Viewer",
  icon: "\u25C9",
  iconBg: "#1a2a3a",
  iconColor: "#CDFE00",
  category: "media",
  defaultProps: {
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200",
    imageAlt: "Design showcase",
    mode: "zoom",
    zoomMin: 1,
    zoomMax: 5,
    zoomStep: 0.5,
    compareImage: "",
    compareLabel: "After",
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
    paddingV: 64,
    paddingH: 48,
  },
  render: function (p) {
    var esc = function (v) {
      return v !== undefined && v !== null
        ? String(v)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
        : "";
    };
    var src = p.imageUrl || "";
    var alt = esc(p.imageAlt || "");
    var mode = p.mode || "zoom";
    var bg = p.bg || "#111111";
    var color = p.textColor || "#f7f6f2";
    var accent = p.accentColor || "#CDFE00";

    if (!src) {
      return (
        '<div class="fw-image-viewer-empty" style="background:' +
        bg +
        ";color:" +
        color +
        '">Select an image in the edit panel</div>'
      );
    }

    if (mode === "compare") {
      var compareSrc = p.compareImage || "";
      if (!compareSrc) {
        return (
          '<div class="fw-image-viewer" style="background:' +
          bg +
          ";color:" +
          color +
          '">' +
          '<img src="' +
          src +
          '" alt="' +
          alt +
          '" />' +
          '<div style="padding:1rem;text-align:center;opacity:0.5">Set a comparison image in the edit panel</div>' +
          "</div>"
        );
      }
      var viewerId = "fw-iv-" + Math.random().toString(36).substr(2, 6);
      return (
        '<div class="fw-image-viewer fw-image-viewer-compare" id="' +
        viewerId +
        '" style="background:' +
        bg +
        '">' +
        '<img src="' +
        src +
        '" alt="' +
        alt +
        '" />' +
        '<div class="fw-image-viewer-compare-overlay" style="width:50%">' +
        '<img src="' +
        compareSrc +
        '" alt="' +
        esc(p.compareLabel || "After") +
        '" />' +
        '<div class="fw-image-viewer-label">' +
        esc(p.compareLabel || "After") +
        "</div>" +
        "</div>" +
        '<div class="fw-image-viewer-compare-handle"></div>' +
        '<div class="fw-image-viewer-label fw-image-viewer-label-right">Before</div>' +
        "<script>" +
        "(function(){var el=document.getElementById('" +
        viewerId +
        "');if(!el)return;" +
        "var handle=el.querySelector('.fw-image-viewer-compare-handle');" +
        "var overlay=el.querySelector('.fw-image-viewer-compare-overlay');" +
        "if(!handle||!overlay)return;" +
        "var dragging=false;" +
        "var onMove=function(e){if(!dragging)return;" +
        "var rect=el.getBoundingClientRect();" +
        "var x=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width));" +
        "handle.style.left=(x*100)+'%';" +
        "overlay.style.width=(x*100)+'%';};" +
        "handle.addEventListener('mousedown',function(e){e.preventDefault();dragging=true;});" +
        "document.addEventListener('mousemove',onMove);" +
        "document.addEventListener('mouseup',function(){dragging=false;});" +
        "})()" +
        "</script>" +
        "</div>"
      );
    }

    var viewerId = "fw-iv-" + Math.random().toString(36).substr(2, 6);
    var isZoom = mode === "zoom";
    var modeClass = isZoom ? "fw-image-viewer-zoom-mode" : "";
    var zoomMin = p.zoomMin || 1;
    var zoomMax = p.zoomMax || 5;
    var zoomStep = p.zoomStep || 0.5;

    return (
      '<div class="fw-image-viewer ' +
      modeClass +
      '" id="' +
      viewerId +
      '" style="background:' +
      bg +
      '">' +
      '<img src="' +
      src +
      '" alt="' +
      alt +
      '" />' +
      '<div class="fw-image-viewer-zoom-badge" style="color:' +
      accent +
      '">100%</div>' +
      "<script>" +
      "(function(){var el=document.getElementById('" +
      viewerId +
      "');if(!el)return;" +
      "var img=el.querySelector('img');if(!img)return;" +
      "var badge=el.querySelector('.fw-image-viewer-zoom-badge');" +
      "var scale=1,origW=0,origH=0;" +
      "var tx=0,ty=0;" +
      "var isDragging=false,startX=0,startY=0,startTx=0,startTy=0;" +
      "" +
      "img.onload=function(){origW=img.naturalWidth;origH=img.naturalHeight;};" +
      "if(img.complete){origW=img.naturalWidth;origH=img.naturalHeight;}" +
      "" +
      "el.addEventListener('wheel',function(e){" +
      "if(" +
      isZoom +
      "){e.preventDefault();" +
      "var delta=e.deltaY>0?-1:1;" +
      "var old=scale;" +
      "scale=Math.max(" +
      zoomMin +
      ",Math.min(" +
      zoomMax +
      ",scale+delta*" +
      zoomStep +
      "));" +
      "if(badge){badge.textContent=Math.round(scale*100)+'%';badge.classList.add('fw-visible');" +
      "clearTimeout(badge._hide);badge._hide=setTimeout(function(){badge.classList.remove('fw-visible');},1500);}" +
      "img.style.transform='translate('+tx+'px,'+ty+'px) scale('+scale+')';" +
      "}}," +
      ");" +
      "" +
      "el.addEventListener('mousedown',function(e){" +
      "if(e.target.closest('.fw-image-viewer-compare-handle,.fw-image-viewer-compare-overlay'))return;" +
      "isDragging=true;startX=e.clientX;startY=e.clientY;startTx=tx;startTy=ty;" +
      "});" +
      "document.addEventListener('mousemove',function(e){" +
      "if(!isDragging)return;" +
      "tx=startTx+(e.clientX-startX);ty=startTy+(e.clientY-startY);" +
      "img.style.transform='translate('+tx+'px,'+ty+'px) scale('+scale+')';" +
      "});" +
      "document.addEventListener('mouseup',function(){isDragging=false;});" +
      "})()" +
      "</script>" +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var esc = function (v) {
      return v !== undefined && v !== null
        ? String(v)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
        : "";
    };
    var modeOptions = [
      { v: "zoom", l: "Zoom" },
      { v: "pan", l: "Pan" },
      { v: "compare", l: "Compare" },
    ];
    var modeHtml = "";
    for (var i = 0; i < modeOptions.length; i++) {
      var m = modeOptions[i];
      modeHtml +=
        '<option value="' +
        m.v +
        '"' +
        ((p.mode || "zoom") === m.v ? " selected" : "") +
        ">" +
        m.l +
        "</option>";
    }
    return (
      '<div class="rp-row"><label>Image URL</label>' +
      '<input type="text" value="' +
      esc(p.imageUrl || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','imageUrl',this.value)\" /></div>" +
      '<div class="rp-row"><label>Alt text</label>' +
      '<input type="text" value="' +
      esc(p.imageAlt || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','imageAlt',this.value)\" /></div>" +
      '<div class="rp-row"><label>Viewer Mode</label>' +
      "<select onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','mode',this.value)\">" +
      modeHtml +
      "</select></div>" +
      '<div class="rp-row" id="fw-iv-zoom-group"' +
      (p.mode === "compare" ? ' style="display:none"' : "") +
      ">" +
      "<label>Max Zoom</label>" +
      '<input type="number" step="0.5" value="' +
      esc(String(p.zoomMax || 5)) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','zoomMax',+this.value)\" /></div>" +
      '<div class="rp-row" id="fw-iv-compare-group"' +
      (p.mode !== "compare" ? ' style="display:none"' : "") +
      ">" +
      "<label>Comparison Image URL</label>" +
      '<input type="text" value="' +
      esc(p.compareImage || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','compareImage',this.value)\" /></div>" +
      '<div class="rp-row" id="fw-iv-compare-label-group"' +
      (p.mode !== "compare" ? ' style="display:none"' : "") +
      ">" +
      "<label>Comparison Label</label>" +
      '<input type="text" value="' +
      esc(p.compareLabel || "After") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','compareLabel',this.value)\" /></div>"
    );
  },
});
