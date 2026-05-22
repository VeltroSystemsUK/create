// Basic Widgets

FB.widgets.register("heading", {
  label: "Heading",
  icon: "H",
  iconBg: "#1a1a3a",
  iconColor: "#CDFE00",
  category: "basic",
  defaultProps: {
    text: "Hello World",
    tag: "h2",
    align: "left",
    color: "#111111",
    size: 32,
  },
  render: function (p) {
    var tag = p.tag || "h2";
    return (
      "<" +
      tag +
      ' style="text-align:' +
      (p.align || "left") +
      ";color:" +
      (p.color || "#111") +
      ";font-size:" +
      (p.size || 32) +
      'px;font-family:\'Lexend\',sans-serif;font-weight:800;letter-spacing:-1px;line-height:1.1;margin:0;padding:0.5rem 1rem" contenteditable data-field="text">' +
      (p.text || "") +
      "</" +
      tag +
      ">"
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Text</label><input type="text" value="' +
      p.text +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','text',this.value)\"></div>" +
      '<div class="rp-row"><label>Tag</label><select onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','tag',this.value)\">" +
      ["h1", "h2", "h3", "h4", "h5", "h6", "div", "p"]
        .map(function (t) {
          return (
            '<option value="' +
            t +
            '"' +
            (p.tag === t ? " selected" : "") +
            ">" +
            t.toUpperCase() +
            "</option>"
          );
        })
        .join("") +
      "</select></div>" +
      '<div class="rp-row"><label>Size: ' +
      (p.size || 32) +
      'px</label><input type="range" min="14" max="72" value="' +
      (p.size || 32) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','size',+this.value);this.previousElementSibling.textContent='Size: '+this.value+'px'\"></div>"
    );
  },
});

FB.widgets.register("divider", {
  label: "Divider",
  icon: "\u2014",
  iconBg: "#2a2a2a",
  iconColor: "#CDFE00",
  category: "basic",
  defaultProps: { width: 100, height: 2, color: "#ddd", style: "solid" },
  render: function (p) {
    return (
      '<hr style="width:' +
      (p.width || 100) +
      "%;height:" +
      (p.height || 2) +
      "px;background:" +
      (p.color || "#ddd") +
      ';border:none;margin:1rem auto">'
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Width: ' +
      (p.width || 100) +
      '%</label><input type="range" min="10" max="100" value="' +
      (p.width || 100) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','width',+this.value);this.previousElementSibling.textContent='Width: '+this.value+'%'\"></div>" +
      '<div class="rp-row"><label>Height: ' +
      (p.height || 2) +
      'px</label><input type="range" min="1" max="10" value="' +
      (p.height || 2) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value);this.previousElementSibling.textContent='Height: '+this.value+'px'\"></div>" +
      '<div class="rp-row"><label>Color</label><div class="color-row"><input type="color" value="' +
      (p.color || "#ddd") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      '\',\'color\',this.value)"><input type="text" value="' +
      (p.color || "#ddd") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color',this.value)\"></div></div>"
    );
  },
});

FB.widgets.register("spacer", {
  label: "Spacer",
  icon: "\u24A2",
  iconBg: "#2a2a2a",
  iconColor: "#999",
  category: "basic",
  defaultProps: { height: 50 },
  render: function (p) {
    return (
      '<div style="height:' +
      (p.height || 50) +
      'px;pointer-events:none"></div>'
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Height: ' +
      (p.height || 50) +
      'px</label><input type="range" min="10" max="200" value="' +
      (p.height || 50) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','height',+this.value);this.previousElementSibling.textContent='Height: '+this.value+'px'\"></div>"
    );
  },
});

FB.widgets.register("icon", {
  label: "Icon",
  icon: "\u2726",
  iconBg: "#1a2a3a",
  iconColor: "#CDFE00",
  category: "basic",
  defaultProps: { icon: "\u2605", size: 48, color: "#CDFE00" },
  render: function (p) {
    return (
      '<div style="text-align:center;padding:1rem"><span style="font-size:' +
      (p.size || 48) +
      "px;color:" +
      (p.color || "#CDFE00") +
      '" contenteditable data-field="icon">' +
      (p.icon || "\u2605") +
      "</span></div>"
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Icon (emoji/SVG)</label><input type="text" value="' +
      p.icon +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','icon',this.value)\"></div>" +
      '<div class="rp-row"><label>Size: ' +
      (p.size || 48) +
      'px</label><input type="range" min="16" max="128" value="' +
      (p.size || 48) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','size',+this.value);this.previousElementSibling.textContent='Size: '+this.value+'px'\"></div>" +
      '<div class="rp-row"><label>Color</label><div class="color-row"><input type="color" value="' +
      (p.color || "#CDFE00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      '\',\'color\',this.value)"><input type="text" value="' +
      (p.color || "#CDFE00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','color',this.value)\"></div></div>"
    );
  },
});

FB.widgets.register("html", {
  label: "HTML",
  icon: "</>",
  iconBg: "#2a1a1a",
  iconColor: "#e88",
  category: "basic",
  defaultProps: { html: "<p>Your HTML here</p>" },
  render: function (p) {
    return '<div style="padding:0.5rem 1rem">' + (p.html || "") + "</div>";
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Raw HTML</label><textarea rows="6" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','html',this.value)\">" +
      p.html +
      "</textarea></div>"
    );
  },
});

FB.widgets.register("shortcode", {
  label: "Shortcode",
  icon: "[]",
  iconBg: "#2a2a1a",
  iconColor: "#999",
  category: "basic",
  defaultProps: { shortcode: "[your_shortcode]" },
  render: function (p) {
    return (
      '<div style="padding:1rem;background:#f5f5f5;border:1px dashed #ccc;border-radius:4px;text-align:center;color:#999;font-size:12px">' +
      (p.shortcode || "[shortcode]") +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Shortcode</label><input type="text" value="' +
      p.shortcode +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','shortcode',this.value)\"></div>"
    );
  },
});

FB.widgets.register("blockquote", {
  label: "Blockquote",
  icon: "\u201C",
  iconBg: "#1a2a1a",
  iconColor: "#CDFE00",
  category: "basic",
  defaultProps: {
    quote: "The best way to predict the future is to create it.",
    attribution: "Peter Drucker",
    borderColor: "#CDFE00",
  },
  render: function (p) {
    return (
      '<blockquote style="border-left:4px solid ' +
      (p.borderColor || "#CDFE00") +
      ';padding:1rem 1.5rem;margin:1rem;background:#f9f9f9"><p style="font-size:16px;font-weight:300;font-style:italic;line-height:1.6;margin-bottom:0.5rem" contenteditable data-field="quote">' +
      (p.quote || "") +
      '</p><cite style="font-size:13px;color:#999" contenteditable data-field="attribution">\u2014 ' +
      (p.attribution || "") +
      "</cite></blockquote>"
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Quote</label><textarea rows="3" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','quote',this.value)\">" +
      p.quote +
      "</textarea></div>" +
      '<div class="rp-row"><label>Attribution</label><input type="text" value="' +
      p.attribution +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','attribution',this.value)\"></div>" +
      '<div class="rp-row"><label>Border Color</label><div class="color-row"><input type="color" value="' +
      (p.borderColor || "#CDFE00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      '\',\'borderColor\',this.value)"><input type="text" value="' +
      (p.borderColor || "#CDFE00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','borderColor',this.value)\"></div></div>"
    );
  },
});

FB.widgets.register("textPath", {
  label: "Text Path",
  icon: "~",
  iconBg: "#1a2a3a",
  iconColor: "#CDFE00",
  category: "basic",
  defaultProps: { text: "Curved Text", fontSize: 24, color: "#111111" },
  render: function (p) {
    var pathId = "tp_" + Math.random().toString(36).slice(2, 6);
    return (
      '<svg width="100%" height="100" xmlns="http://www.w3.org/2000/svg" style="display:block">' +
      '<path id="' +
      pathId +
      '" d="M 10 50 Q 200 10 390 50" fill="none" stroke="none"/>' +
      '<text font-size="' +
      (p.fontSize || 24) +
      '" fill="' +
      (p.color || "#111") +
      '">' +
      '<textPath href="#' +
      pathId +
      '">' +
      (p.text || "") +
      "</textPath></text></svg>"
    );
  },
  editPanel: function (id, p) {
    return (
      '<div class="rp-row"><label>Text</label><input type="text" value="' +
      p.text +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','text',this.value)\"></div>" +
      '<div class="rp-row"><label>Font Size: ' +
      (p.fontSize || 24) +
      'px</label><input type="range" min="12" max="60" value="' +
      (p.fontSize || 24) +
      '" oninput="FB.panels.updateWidgetProp(\'' +
      id +
      "','fontSize',+this.value);this.previousElementSibling.textContent='Font Size: '+this.value+'px'\"></div>"
    );
  },
});
