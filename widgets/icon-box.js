FB.widgets.register("iconBox", {
  label: "Icon Box",
  icon: "\u25A2",
  iconBg: "#1a2a2a",
  iconColor: "#CDFE00",
  category: "content",
  defaultProps: {
    icon: "\u26A1",
    iconSize: 48,
    iconColor: "#CDFE00",
    headline: "Lightning Fast",
    body: "We build performance-optimised sites that load in under a second.",
    align: "center",
    bg: "transparent",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
    paddingV: 32,
    paddingH: 24,
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
    var icon = p.icon || "\u26A1";
    var size = p.iconSize || 48;
    var color = p.iconColor || "#CDFE00";
    var align = p.align === "left" ? "fw-icon-box-left" : "fw-icon-box-center";
    var href = p.linkUrl ? esc(p.linkUrl) : "";
    var link = href
      ? '<a href="' +
        href +
        '" style="color:' +
        (p.textColor || "#f7f6f2") +
        '">'
      : "";
    var linkEnd = href ? "</a>" : "";
    var linkText =
      href && p.linkText
        ? '<span class="fw-icon-box-link" style="color:' +
          (p.accentColor || "#CDFE00") +
          '">' +
          esc(p.linkText) +
          "</span>"
        : "";

    return (
      '<div class="fw-icon-box ' +
      align +
      '" style="background:' +
      (p.bg || "transparent") +
      ";color:" +
      (p.textColor || "#f7f6f2") +
      '">' +
      link +
      '<div class="fw-icon-box-icon" style="font-size:' +
      size +
      "px;color:" +
      color +
      '">' +
      icon +
      "</div>" +
      "<div>" +
      (p.headline
        ? '<h3 class="fw-icon-box-headline">' + esc(p.headline) + "</h3>"
        : "") +
      (p.body ? '<p class="fw-icon-box-body">' + esc(p.body) + "</p>" : "") +
      linkText +
      "</div>" +
      linkEnd +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var esc = function (v) {
      return v !== undefined && v !== null
        ? String(v).replace(/"/g, "&quot;")
        : "";
    };
    return (
      '<div class="rp-row"><label>Icon (emoji or character)</label>' +
      '<input type="text" value="' +
      esc(p.icon || "\u26A1") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','icon',this.value)\" /></div>" +
      '<div class="rp-row"><label>Icon Size (px)</label>' +
      '<input type="number" value="' +
      esc(String(p.iconSize || 48)) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','iconSize',+this.value)\" /></div>" +
      '<div class="rp-row"><label>Icon Color</label>' +
      '<input type="color" value="' +
      esc(p.iconColor || "#CDFE00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','iconColor',this.value)\" /></div>" +
      '<div class="rp-row"><label>Alignment</label>' +
      "<select onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','align',this.value)\">" +
      '<option value="center"' +
      ((p.align || "center") === "center" ? " selected" : "") +
      ">Center</option>" +
      '<option value="left"' +
      (p.align === "left" ? " selected" : "") +
      ">Left</option>" +
      "</select></div>" +
      '<div class="rp-row"><label>Headline</label>' +
      '<input type="text" value="' +
      esc(p.headline || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','headline',this.value)\" /></div>" +
      '<div class="rp-row"><label>Body text</label>' +
      '<textarea rows="3" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','body',this.value)\">" +
      esc(p.body || "") +
      "</textarea></div>" +
      '<div class="rp-row"><label>Link URL (optional)</label>' +
      '<input type="text" value="' +
      esc(p.linkUrl || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','linkUrl',this.value)\" /></div>" +
      '<div class="rp-row"><label>Link text</label>' +
      '<input type="text" value="' +
      esc(p.linkText || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','linkText',this.value)\" /></div>" +
      '<div class="rp-row"><label>Background</label>' +
      '<input type="color" value="' +
      esc(p.bg || "transparent") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','bg',this.value)\" /></div>" +
      '<div class="rp-row"><label>Text Color</label>' +
      '<input type="color" value="' +
      esc(p.textColor || "#f7f6f2") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','textColor',this.value)\" /></div>" +
      '<div class="rp-row"><label>Accent Color</label>' +
      '<input type="color" value="' +
      esc(p.accentColor || "#CDFE00") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','accentColor',this.value)\" /></div>"
    );
  },
});
