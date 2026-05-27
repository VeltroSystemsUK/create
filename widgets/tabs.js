FB.widgets.register("tabs", {
  label: "Tabs",
  icon: "\u25E9",
  iconBg: "#1a1a2a",
  iconColor: "#CDFE00",
  category: "content",
  defaultProps: {
    tabs: [
      {
        label: "Design",
        content: "<p>Content for the Design tab goes here.</p>",
      },
      {
        label: "Development",
        content: "<p>Content for the Development tab.</p>",
      },
      { label: "Strategy", content: "<p>Content for the Strategy tab.</p>" },
    ],
    tabStyle: "underline",
    tabPosition: "top",
    bg: "#111111",
    textColor: "#f7f6f2",
    accentColor: "#CDFE00",
    paddingV: 64,
    paddingH: 48,
  },
  render: function (p) {
    var tabs = p.tabs || [];
    var active = p.activeTab || 0;
    if (active >= tabs.length) active = 0;
    var position = p.tabPosition === "left" ? " fw-tabs-left" : "";
    var style = p.tabStyle || "underline";
    var bg = p.bg || "#111111";
    var color = p.textColor || "#f7f6f2";
    var accent = p.accentColor || "#CDFE00";
    var esc = function (v) {
      return v !== undefined && v !== null
        ? String(v)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
        : "";
    };

    if (!tabs.length) {
      return (
        '<div class="fw-tabs' +
        position +
        '" style="background:' +
        bg +
        ";color:" +
        color +
        '"><div class="fw-tabs-empty">Add tabs in the edit panel</div></div>'
      );
    }

    var barHtml =
      '<div class="fw-tabs-bar"' +
      (position ? ' style="border-right-color:rgba(255,255,255,0.1)"' : "") +
      ">";
    for (var i = 0; i < tabs.length; i++) {
      var t = tabs[i];
      var isActive = i === active;
      barHtml +=
        '<button class="fw-tab-btn fw-tab-style-' +
        style +
        (isActive ? " fw-tab-active" : "") +
        '" data-tab-index="' +
        i +
        '" style="color:' +
        color +
        (isActive && style === "underline" ? ";--accent:" + accent : "") +
        (isActive && (style === "pills" || style === "bordered")
          ? ";background:rgba(255,255,255,0.1)"
          : "") +
        '" onclick="' +
        "(function(el){var container=el.closest('.fw-tabs');if(!container)return;" +
        "var idx=parseInt(el.dataset.tabIndex);" +
        "var blockEl=container.closest('[data-id]');if(!blockEl)return;" +
        "var blockId=blockEl.dataset.id;" +
        "var state=FB.state.get().blocks.find(function(b){return b.id===blockId});" +
        "if(state){state.props.activeTab=idx;FB.canvas._renderBlock(state,blockEl.parentNode);}" +
        "})(this)" +
        '">' +
        esc(t.label || "Tab " + (i + 1)) +
        "</button>";
    }
    barHtml += "</div>";

    var contentHtml =
      '<div class="fw-tab-content"' + (position ? ' style="flex:1"' : "") + ">";
    for (var i = 0; i < tabs.length; i++) {
      contentHtml +=
        '<div class="fw-tab-panel' +
        (i !== active ? " fw-tab-content-hidden" : "") +
        '">' +
        (tabs[i].content || "") +
        "</div>";
    }
    contentHtml += "</div>";

    return (
      '<div class="fw-tabs' +
      position +
      '" style="background:' +
      bg +
      ";color:" +
      color +
      '">' +
      barHtml +
      contentHtml +
      "</div>"
    );
  },
  editPanel: function (id, p) {
    var tabs = p.tabs || [];
    var esc = function (v) {
      return v !== undefined && v !== null
        ? String(v)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
        : "";
    };
    var html =
      '<div class="rp-row"><label>Tab Style</label>' +
      "<select onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','tabStyle',this.value)\">" +
      '<option value="underline"' +
      ((p.tabStyle || "underline") === "underline" ? " selected" : "") +
      ">Underline</option>" +
      '<option value="pills"' +
      (p.tabStyle === "pills" ? " selected" : "") +
      ">Pills</option>" +
      '<option value="bordered"' +
      (p.tabStyle === "bordered" ? " selected" : "") +
      ">Bordered</option>" +
      "</select></div>" +
      '<div class="rp-row"><label>Tab Position</label>' +
      "<select onchange=\"FB.panels.updateWidgetProp('" +
      id +
      "','tabPosition',this.value)\">" +
      '<option value="top"' +
      (p.tabPosition !== "left" ? " selected" : "") +
      ">Top</option>" +
      '<option value="left"' +
      (p.tabPosition === "left" ? " selected" : "") +
      ">Left</option>" +
      "</select></div>";

    html += '<div class="rp-row"><label>Tabs</label></div>';
    for (var i = 0; i < tabs.length; i++) {
      html +=
        '<div style="margin-bottom:8px;padding:8px;background:rgba(255,255,255,0.05);border-radius:6px">' +
        '<input type="text" style="width:100%;margin-bottom:4px;box-sizing:border-box" value="' +
        esc(tabs[i].label || "") +
        '" placeholder="Tab label" onchange="' +
        "(function(el,i){var t=p.tabs;if(t&&t[i]){t[i].label=el.value;" +
        "FB.panels.updateWidgetProp('" +
        id +
        "','tabs',t);}})(this," +
        i +
        ')" />' +
        '<textarea rows="2" style="width:100%;box-sizing:border-box" placeholder="Tab content (HTML)" onchange="' +
        "(function(el,i){var t=p.tabs;if(t&&t[i]){t[i].content=el.value;" +
        "FB.panels.updateWidgetProp('" +
        id +
        "','tabs',t);}})(this," +
        i +
        ')" >' +
        esc(tabs[i].content || "") +
        "</textarea>";
      if (tabs.length > 1) {
        html +=
          '<button style="margin-top:4px;font-size:0.8rem" onclick="' +
          "var t=p.tabs;t.splice(" +
          i +
          ",1);FB.panels.updateWidgetProp('" +
          id +
          "','tabs',t)" +
          '">Remove</button>';
      }
      html += "</div>";
    }
    html +=
      '<button style="font-size:0.85rem" onclick="' +
      "var t=p.tabs;t.push({label:'New Tab',content:''});" +
      "FB.panels.updateWidgetProp('" +
      id +
      "','tabs',t)" +
      '">+ Add Tab</button>';
    return html;
  },
});
