FB.widgets.register("modal", {
  label: "Modal",
  icon: "\u25A2",
  iconBg: "#2a1a2a",
  iconColor: "#CDFE00",
  category: "interactive",
  defaultProps: {
    triggerType: "button",
    triggerText: "View Project",
    headline: "Want to work together?",
    body: "<p>We build bold brands for ambitious companies.</p>",
    btnText: "Get in touch \u2192",
    btnUrl: "",
    showCloseBtn: true,
    closeOnOverlay: true,
    overlayBg: "rgba(0,0,0,0.7)",
    modalWidth: 480,
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
    paddingV: 48,
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
    var triggerType = p.triggerType || "button";
    var triggerText = esc(p.triggerText || "Open Modal");
    var headline = esc(p.headline || "");
    var body = p.body || "";
    var btnText = esc(p.btnText || "");
    var btnUrl = esc(p.btnUrl || "");
    var bg = p.bg || "#111111";
    var color = p.textColor || "#f7f6f2";
    var accent = p.accentColor || "#CDFE00";
    var overlayBg = p.overlayBg || "rgba(0,0,0,0.7)";
    var mw = p.modalWidth || 480;

    var modalId = "fw-modal-" + Math.random().toString(36).substr(2, 6);

    var triggerHtml = "";
    if (triggerType === "button") {
      triggerHtml =
        '<button class="fw-modal-trigger" style="background:' +
        accent +
        ";color:" +
        bg +
        '" onclick="document.getElementById(\'' +
        modalId +
        "').classList.add('fw-modal-open');document.body.style.overflow='hidden'\">" +
        triggerText +
        "</button>";
    }

    var closeBtn =
      '<button class="fw-modal-close" onclick="' +
      "document.getElementById('" +
      modalId +
      "').classList.remove('fw-modal-open');document.body.style.overflow=''\" aria-label=\"Close\">\u2715</button>";

    var contentHtml = headline
      ? '<h2 class="fw-modal-headline">' + headline + "</h2>"
      : "";
    contentHtml += body ? '<div class="fw-modal-body">' + body + "</div>" : "";
    if (btnText) {
      contentHtml +=
        (btnUrl ? '<a href="' + btnUrl + '"' : "<button") +
        ' class="fw-modal-btn" style="background:' +
        accent +
        ";color:" +
        bg +
        '"' +
        (btnUrl
          ? ""
          : " onclick=\"document.getElementById('" +
            modalId +
            "').classList.remove('fw-modal-open');document.body.style.overflow=''\"") +
        (btnUrl ? ">" : ">") +
        btnText +
        (btnUrl ? "" : "</button>") +
        (btnUrl ? "</a>" : "");
    }

    var closeOverlay =
      "onclick=\"if(event.target===this){document.getElementById('" +
      modalId +
      "').classList.remove('fw-modal-open');document.body.style.overflow=''}\"";

    return (
      '<div class="fw-modal-wrapper" style="background:' +
      (p.bg || "transparent") +
      ";color:" +
      color +
      '">' +
      triggerHtml +
      '<div id="' +
      modalId +
      '" class="fw-modal-overlay" style="background:' +
      overlayBg +
      '" ' +
      (p.closeOnOverlay !== false ? closeOverlay : "") +
      ">" +
      '<div class="fw-modal-box" style="max-width:' +
      mw +
      "px;background:" +
      bg +
      ";color:" +
      color +
      '">' +
      (p.showCloseBtn !== false ? closeBtn : "") +
      (headline || body || btnText
        ? contentHtml
        : '<div class="fw-modal-empty">Configure modal content in the edit panel</div>') +
      "</div>" +
      "</div>" +
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
    return (
      '<div class="rp-row"><label>Trigger Type</label>' +
      "<select onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','triggerType',this.value)\">" +
      '<option value="button"' +
      ((p.triggerType || "button") === "button" ? " selected" : "") +
      ">Button</option>" +
      '<option value="timed"' +
      (p.triggerType === "timed" ? " selected" : "") +
      ">Timed (auto-open)</option>" +
      '<option value="scroll"' +
      (p.triggerType === "scroll" ? " selected" : "") +
      ">On Scroll</option>" +
      "</select></div>" +
      '<div class="rp-row"><label>Trigger Text</label>' +
      '<input type="text" value="' +
      esc(p.triggerText || "Open Modal") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','triggerText',this.value)\" /></div>" +
      '<div class="rp-row"><label>Headline</label>' +
      '<input type="text" value="' +
      esc(p.headline || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','headline',this.value)\" /></div>" +
      '<div class="rp-row"><label>Body (HTML)</label>' +
      '<textarea rows="3" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','body',this.value)\">" +
      esc(p.body || "") +
      "</textarea></div>" +
      '<div class="rp-row"><label>Button Text</label>' +
      '<input type="text" value="' +
      esc(p.btnText || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','btnText',this.value)\" /></div>" +
      '<div class="rp-row"><label>Button URL</label>' +
      '<input type="text" value="' +
      esc(p.btnUrl || "") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','btnUrl',this.value)\" /></div>" +
      '<div class="rp-row"><label>Modal Width (px)</label>' +
      '<input type="number" value="' +
      esc(String(p.modalWidth || 480)) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','modalWidth',+this.value)\" /></div>" +
      '<div class="rp-row"><label><input type="checkbox"' +
      (p.showCloseBtn !== false ? " checked" : "") +
      " onclick=\"FB.panels.updateWidgetProp('" +
      id +
      "','showCloseBtn',this.checked)\" /> Show Close Button</label></div>" +
      '<div class="rp-row"><label><input type="checkbox"' +
      (p.closeOnOverlay !== false ? " checked" : "") +
      " onclick=\"FB.panels.updateWidgetProp('" +
      id +
      "','closeOnOverlay',this.checked)\" /> Close on Overlay Click</label></div>"
    );
  },
});
