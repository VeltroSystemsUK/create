# Custom Blocks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement 5 new blocks (Icon Box, Tabs, Modal, Image Viewer, Data Table) as registered widgets following existing Framework Builder patterns.

**Architecture:** Each block is a standalone file in `widgets/` registering via `FB.widgets.register(type, { render, editPanel })`. A shared CSS file covers all 5. `src/main.js` gets 5 new import lines. Blocks appear automatically in the block palette via `FB.widgets.byCategory()`.

**Tech Stack:** Vanilla JS (ES modules), CSS, existing FB global namespace. No external dependencies.

---

### Task 1: Create shared CSS

**Files:**

- Create: `css/custom-blocks.css`

- [ ] **Step 1: Write CSS for all 5 blocks**

```css
/* ===== Custom Blocks ===== */

/* --- Icon Box --- */
.fw-icon-box {
  display: flex;
  gap: 16px;
  padding: 32px 24px;
  transition: transform 0.2s ease;
}
.fw-icon-box a {
  text-decoration: none;
  color: inherit;
  display: flex;
  gap: 16px;
}
.fw-icon-box.fw-icon-box-center {
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.fw-icon-box.fw-icon-box-left {
  flex-direction: row;
  align-items: flex-start;
  text-align: left;
}
.fw-icon-box-icon {
  flex-shrink: 0;
  line-height: 1;
  transition:
    transform 0.25s ease,
    filter 0.25s ease;
}
.fw-icon-box:hover .fw-icon-box-icon {
  transform: scale(1.1);
  filter: brightness(1.2);
}
.fw-icon-box-headline {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 6px 0;
}
.fw-icon-box-body {
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.85;
  margin: 0;
}
.fw-icon-box-link {
  display: inline-block;
  margin-top: 8px;
  font-weight: 600;
  cursor: pointer;
}

/* --- Tabs --- */
.fw-tabs {
  display: flex;
  flex-direction: column;
}
.fw-tabs.fw-tabs-left {
  flex-direction: row;
}
.fw-tabs-bar {
  display: flex;
  gap: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.fw-tabs-left .fw-tabs-bar {
  flex-direction: column;
  border-bottom: none;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}
.fw-tab-btn {
  padding: 12px 24px;
  background: none;
  border: none;
  color: inherit;
  opacity: 0.5;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  white-space: nowrap;
  position: relative;
  transition: opacity 0.2s ease;
}
.fw-tab-btn:hover {
  opacity: 0.8;
}
.fw-tab-btn.fw-tab-active {
  opacity: 1;
}
.fw-tab-btn.fw-tab-style-underline::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: var(--accent, #cdfe00);
  transition: width 0.25s ease;
}
.fw-tab-btn.fw-tab-active.fw-tab-style-underline::after {
  width: 70%;
}
.fw-tab-btn.fw-tab-style-pills {
  border-radius: 6px;
  margin: 0 2px;
}
.fw-tab-btn.fw-tab-active.fw-tab-style-pills {
  background: rgba(255, 255, 255, 0.1);
}
.fw-tab-btn.fw-tab-style-bordered {
  border: 1px solid transparent;
  border-radius: 6px 6px 0 0;
}
.fw-tab-btn.fw-tab-active.fw-tab-style-bordered {
  border-color: rgba(255, 255, 255, 0.15);
  border-bottom-color: transparent;
}
.fw-tabs-left .fw-tab-btn.fw-tab-style-bordered {
  border-radius: 6px 0 0 6px;
}
.fw-tabs-left .fw-tab-btn.fw-tab-active.fw-tab-style-bordered {
  border-color: rgba(255, 255, 255, 0.15);
  border-right-color: transparent;
}
.fw-tab-content {
  padding: 24px 0;
  line-height: 1.6;
  transition: opacity 0.2s ease;
}
.fw-tabs-left .fw-tab-content {
  padding: 0 24px;
}
.fw-tab-content-hidden {
  display: none;
}
.fw-tabs-empty {
  padding: 2rem;
  text-align: center;
  opacity: 0.4;
  font-style: italic;
}

/* --- Modal --- */
.fw-modal-wrapper {
  position: relative;
}
.fw-modal-trigger {
  display: inline-block;
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.fw-modal-trigger:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.fw-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.25s ease,
    visibility 0.25s ease;
}
.fw-modal-overlay.fw-modal-open {
  opacity: 1;
  visibility: visible;
}
.fw-modal-box {
  position: relative;
  max-width: 90vw;
  max-height: 85vh;
  overflow-y: auto;
  border-radius: 12px;
  padding: 48px;
  transform: scale(0.95);
  transition: transform 0.25s ease;
}
.fw-modal-open .fw-modal-box {
  transform: scale(1);
}
.fw-modal-close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.15s ease;
  color: inherit;
  line-height: 1;
  padding: 4px;
}
.fw-modal-close:hover {
  opacity: 1;
}
.fw-modal-headline {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 12px 0;
  padding-right: 24px;
}
.fw-modal-body {
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 24px;
}
.fw-modal-btn {
  display: inline-block;
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.15s ease;
}
.fw-modal-btn:hover {
  transform: translateY(-1px);
}
.fw-modal-empty {
  padding: 2rem;
  text-align: center;
  opacity: 0.4;
  font-style: italic;
}

/* --- Image Viewer --- */
.fw-image-viewer {
  position: relative;
  overflow: hidden;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
}
.fw-image-viewer:active {
  cursor: grabbing;
}
.fw-image-viewer img {
  display: block;
  width: 100%;
  transition: transform 0.05s linear;
  pointer-events: none;
}
.fw-image-viewer-zoom-mode {
  cursor: zoom-in;
}
.fw-image-viewer-zoom-mode:active {
  cursor: zoom-out;
}
.fw-image-viewer-zoom-badge {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.fw-image-viewer-zoom-badge.fw-visible {
  opacity: 1;
}
.fw-image-viewer-compare {
  position: relative;
  overflow: hidden;
  cursor: col-resize;
}
.fw-image-viewer-compare img {
  display: block;
  width: 100%;
  pointer-events: none;
}
.fw-image-viewer-compare-overlay {
  position: absolute;
  inset: 0;
  overflow: hidden;
  width: 50%;
}
.fw-image-viewer-compare-overlay img {
  min-width: 100%;
  height: 100%;
  object-fit: cover;
}
.fw-image-viewer-compare-handle {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 3px;
  background: #fff;
  transform: translateX(-50%);
  z-index: 2;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
}
.fw-image-viewer-compare-handle::after {
  content: "◀▶";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 50%;
  padding: 6px;
  font-size: 0.7rem;
  line-height: 1;
  color: #000;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}
.fw-image-viewer-empty {
  padding: 4rem 2rem;
  text-align: center;
  opacity: 0.4;
  font-style: italic;
}
.fw-image-viewer-label {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  pointer-events: none;
  z-index: 3;
}
.fw-image-viewer-label-right {
  left: auto;
  right: 12px;
}

/* --- Data Table --- */
.fw-data-table {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.fw-data-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}
.fw-data-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  position: sticky;
  top: 0;
  transition: background 0.15s ease;
}
.fw-data-table th:hover {
  filter: brightness(1.15);
}
.fw-data-table th .fw-sort-icon {
  margin-left: 6px;
  font-size: 0.75rem;
  opacity: 0.4;
}
.fw-data-table th.fw-sort-asc .fw-sort-icon,
.fw-data-table th.fw-sort-desc .fw-sort-icon {
  opacity: 1;
}
.fw-data-table td {
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.fw-data-table tr:last-child td {
  border-bottom: none;
}
.fw-data-table .fw-data-table-empty {
  padding: 3rem 2rem;
  text-align: center;
  opacity: 0.5;
  font-style: italic;
}
.fw-data-table .fw-data-table-row-count {
  font-size: 0.8rem;
  opacity: 0.5;
  padding: 8px 16px 0;
}
```

- [ ] **Step 2: Verify file created**

Run: `ls -la css/custom-blocks.css`
Expected: File exists with non-zero size.

---

### Task 2: Icon Box widget

**Files:**

- Create: `widgets/icon-box.js`

- [ ] **Step 1: Write the Icon Box widget**

```js
FB.widgets.register("iconBox", {
  category: "content",
  render: function (p) {
    var icon = p.icon || "⚡";
    var size = p.iconSize || 48;
    var color = p.iconColor || "#CDFE00";
    var align = p.align === "left" ? "fw-icon-box-left" : "fw-icon-box-center";
    var link = p.linkUrl
      ? '<a href="' +
        p.linkUrl +
        '" style="color:' +
        (p.textColor || "#f7f6f2") +
        '">'
      : "";
    var linkEnd = p.linkUrl ? "</a>" : "";
    var linkText =
      p.linkUrl && p.linkText
        ? '<span class="fw-icon-box-link" style="color:' +
          (p.accentColor || "#CDFE00") +
          '">' +
          p.linkText +
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
        ? '<h3 class="fw-icon-box-headline">' + p.headline + "</h3>"
        : "") +
      (p.body ? '<p class="fw-icon-box-body">' + p.body + "</p>" : "") +
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
      esc(p.icon || "⚡") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','icon',this.value)\" /></div>" +
      '<div class="rp-row"><label>Icon Size (px)</label>' +
      '<input type="number" value="' +
      (p.iconSize || 48) +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','iconSize',+this.value)\" /></div>" +
      '<div class="rp-row"><label>Icon Color</label>' +
      '<input type="color" value="' +
      (p.iconColor || "#CDFE00") +
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
      "','linkText',this.value)\" /></div>"
    );
  },
});
```

- [ ] **Step 2: Verify no syntax errors**

Run: `node -e "require('fs').readFileSync('widgets/icon-box.js','utf8'); console.log('Syntax OK')"` or use `node --check widgets/icon-box.js`
(Note: will error on `FB` being undefined — that's expected in Node context. Just confirm no parse errors.)

---

### Task 3: Tabs widget

**Files:**

- Create: `widgets/tabs.js`

- [ ] **Step 1: Write the Tabs widget**

```js
FB.widgets.register("tabs", {
  category: "content",
  render: function (p) {
    var tabs = p.tabs || [];
    var active = p.activeTab || 0;
    if (active >= tabs.length) active = 0;
    var position = p.tabPosition === "left" ? " fw-tabs-left" : "";
    var style = p.tabStyle || "underline";
    var bg = p.bg || "#111111";
    var color = p.textColor || "#f7f6f2";
    var accent = p.accentColor || "#CDFE00";

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
        // Find parent tabs container, update active tab, re-render
        "(function(el){var container=el.closest('.fw-tabs');if(!container)return;" +
        "var idx=parseInt(el.dataset.tabIndex);" +
        "var blockEl=container.closest('[data-id]');if(!blockEl)return;" +
        "var blockId=blockEl.dataset.id;" +
        "var state=FB.state.get().blocks.find(function(b){return b.id===blockId});" +
        "if(state){state.props.activeTab=idx;FB.canvas._renderBlock(state,blockEl.parentNode);}" +
        "})(this)" +
        '">' +
        (t.label || "Tab " + (i + 1)) +
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
        ? String(v).replace(/"/g, "&quot;")
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
```

- [ ] **Step 2: Verify syntax**

Run: `node --check widgets/tabs.js 2>&1 || echo "Expected: FB not defined error only"`

---

### Task 4: Modal / Popup widget

**Files:**

- Create: `widgets/modal.js`

- [ ] **Step 1: Write the Modal widget**

```js
FB.widgets.register("modal", {
  category: "interactive",
  render: function (p) {
    var triggerType = p.triggerType || "button";
    var triggerText = p.triggerText || "Open Modal";
    var headline = p.headline || "";
    var body = p.body || "";
    var btnText = p.btnText || "";
    var btnUrl = p.btnUrl || "";
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
        ? String(v).replace(/"/g, "&quot;")
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
      (p.modalWidth || 480) +
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
```

- [ ] **Step 2: Verify syntax**

Run: `node --check widgets/modal.js 2>&1 || echo "Expected: FB not defined error only"`

---

### Task 5: Image Viewer widget

**Files:**

- Create: `widgets/image-viewer.js`

- [ ] **Step 1: Write the Image Viewer widget**

```js
FB.widgets.register("imageViewer", {
  category: "media",
  render: function (p) {
    var src = p.imageUrl || "";
    var alt = p.imageAlt || "";
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
        (p.compareLabel || "After") +
        '" />' +
        '<div class="fw-image-viewer-label">' +
        (p.compareLabel || "After") +
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

    // Zoom or Pan mode
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
        ? String(v).replace(/"/g, "&quot;")
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
      (p.zoomMax || 5) +
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
```

- [ ] **Step 2: Verify syntax**

Run: `node --check widgets/image-viewer.js 2>&1 || echo "Expected: FB not defined error only"`

---

### Task 6: Data Table widget

**Files:**

- Create: `widgets/data-table.js`

- [ ] **Step 1: Write the Data Table widget**

```js
FB.widgets.register("dataTable", {
  category: "content",
  render: function (p) {
    var csv = p.csvData || "";
    var bg = p.bg || "#111111";
    var color = p.textColor || "#f7f6f2";
    var accent = p.accentColor || "#CDFE00";
    var hdrBg = p.headerBg || bg === "#111111" ? "#1a1a1a" : "#e0e0e0";
    var hdrColor = p.headerTextColor || color;
    var evenBg = p.rowEvenBg || "rgba(255,255,255,0.03)";
    var oddBg = p.rowOddBg || "transparent";
    var borderColor = p.borderColor || "rgba(255,255,255,0.1)";
    var sortable = p.sortable !== false;
    var striped = p.striped !== false;

    // Parse CSV
    var lines = csv
      .split("\n")
      .map(function (l) {
        return l.trim();
      })
      .filter(function (l) {
        return l.length > 0;
      });
    if (lines.length < 2) {
      return (
        '<div class="fw-data-table" style="background:' +
        bg +
        ";color:" +
        color +
        '">' +
        '<div class="fw-data-table-empty">Paste CSV data in the edit panel to build your table</div>' +
        "</div>"
      );
    }

    var headers = FB.widgets._parseCSVLine(lines[0]);
    var rows = [];
    for (var i = 1; i < lines.length; i++) {
      rows.push(FB.widgets._parseCSVLine(lines[i]));
    }

    var tableId = "fw-dt-" + Math.random().toString(36).substr(2, 6);
    var html =
      '<div class="fw-data-table" style="background:' +
      bg +
      ";color:" +
      color +
      ";" +
      "border:1px solid " +
      borderColor +
      ';border-radius:8px;overflow:hidden">' +
      '<table id="' +
      tableId +
      '" style="border-collapse:collapse;width:100%">' +
      "<thead><tr>";

    for (var c = 0; c < headers.length; c++) {
      html +=
        '<th data-col="' +
        c +
        '" style="background:' +
        hdrBg +
        ";color:" +
        hdrColor +
        ";padding:12px 16px;text-align:left;font-weight:600;" +
        (sortable ? "cursor:pointer;user-select:none" : "") +
        '"' +
        (sortable
          ? " onclick=\"FB.widgets._sortTable('" + tableId + "'," + c + ')"'
          : "") +
        ">" +
        headers[c] +
        (sortable ? ' <span class="fw-sort-icon">↕</span>' : "") +
        "</th>";
    }
    html += "</tr></thead><tbody>";

    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      var rowBg = striped && r % 2 === 1 ? evenBg : oddBg;
      html += '<tr style="background:' + rowBg + '">';
      for (var c = 0; c < headers.length; c++) {
        html +=
          "<td style='padding:10px 16px;border-bottom:1px solid " +
          borderColor +
          "'>" +
          (row[c] || "") +
          "</td>";
      }
      html += "</tr>";
    }

    html +=
      "</tbody></table>" +
      '<div class="fw-data-table-row-count" style="padding:8px 16px;color:' +
      color +
      '">Showing ' +
      rows.length +
      " rows</div>" +
      "</div>";

    return html;
  },
  editPanel: function (id, p) {
    var csv = p.csvData || "";
    var esc = function (v) {
      return v !== undefined && v !== null
        ? String(v).replace(/"/g, "&quot;")
        : "";
    };
    return (
      '<div class="rp-row"><label>CSV Data</label>' +
      '<textarea rows="8" placeholder="Paste CSV here...\nHeader1,Header2,Header3\nVal1,Val2,Val3" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','csvData',this.value)\">" +
      esc(csv) +
      "</textarea>" +
      '<div style="font-size:0.8rem;opacity:0.5;margin-top:4px">First row = column headers. Paste from Excel/Sheets.</div>' +
      "</div>" +
      '<div class="rp-row"><label>' +
      '<input type="checkbox"' +
      (p.sortable !== false ? " checked" : "") +
      " onclick=\"FB.panels.updateWidgetProp('" +
      id +
      "','sortable',this.checked)\" /> Sortable columns</label></div>" +
      '<div class="rp-row"><label>' +
      '<input type="checkbox"' +
      (p.striped !== false ? " checked" : "") +
      " onclick=\"FB.panels.updateWidgetProp('" +
      id +
      "','striped',this.checked)\" /> Striped rows</label></div>" +
      '<div class="rp-row"><label>Header Background</label>' +
      '<input type="color" value="' +
      (p.headerBg || "#1a1a1a") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','headerBg',this.value)\" /></div>" +
      '<div class="rp-row"><label>Header Text Color</label>' +
      '<input type="color" value="' +
      (p.headerTextColor || p.textColor || "#f7f6f2") +
      '" onchange="FB.panels.updateWidgetProp(\'' +
      id +
      "','headerTextColor',this.value)\" /></div>"
    );
  },
});

// CSV line parser (handles quoted fields)
FB.widgets._parseCSVLine = function (line) {
  var result = [];
  var current = "";
  var inQuotes = false;
  for (var i = 0; i < line.length; i++) {
    var ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
};

// Table sorter
FB.widgets._sortTable = function (tableId, colIndex) {
  var table = document.getElementById(tableId);
  if (!table) return;
  var tbody = table.querySelector("tbody");
  if (!tbody) return;
  var rows = Array.from(tbody.querySelectorAll("tr"));
  var header = table.querySelector("thead th[data-col='" + colIndex + "']");
  if (!header) return;

  // Toggle sort direction
  var asc = header.classList.contains("fw-sort-asc");
  table.querySelectorAll("thead th").forEach(function (th) {
    th.classList.remove("fw-sort-asc", "fw-sort-desc");
  });
  header.classList.add(asc ? "fw-sort-desc" : "fw-sort-asc");

  // Update sort icons
  table.querySelectorAll("thead th .fw-sort-icon").forEach(function (icon) {
    icon.textContent = "↕";
  });
  header.querySelector(".fw-sort-icon").textContent = asc ? "↓" : "↑";

  // Sort
  rows.sort(function (a, b) {
    var aVal = (a.cells[colIndex] ? a.cells[colIndex].textContent : "").trim();
    var bVal = (b.cells[colIndex] ? b.cells[colIndex].textContent : "").trim();
    var aNum = parseFloat(aVal);
    var bNum = parseFloat(bVal);
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return asc ? bNum - aNum : aNum - bNum;
    }
    return asc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
  });

  rows.forEach(function (row) {
    tbody.appendChild(row);
  });
};
```

- [ ] **Step 2: Verify syntax**

Run: `node --check widgets/data-table.js 2>&1 || echo "Expected: FB not defined error only"`

---

### Task 7: Wire up imports in main.js

**Files:**

- Modify: `src/main.js` (add 5 import lines before `app.js`)

- [ ] **Step 1: Add imports for all 5 new widget files**

Add the following lines before the `import "../js/app.js";` line in `src/main.js`:

```js
import "../widgets/icon-box.js";
import "../widgets/tabs.js";
import "../widgets/modal.js";
import "../widgets/image-viewer.js";
import "../widgets/data-table.js";
```

The section should look like:

```js
import "../widgets/design-templates.js";
import "../js/motion-creator.js";
import "../js/deep-scrape.js";
import "../js/rebuild.js";
import "../widgets/icon-box.js";
import "../widgets/tabs.js";
import "../widgets/modal.js";
import "../widgets/image-viewer.js";
import "../widgets/data-table.js";
```

- [ ] **Step 2: Link CSS in framework-builder.html**

Add the CSS link after existing CSS links in the `<head>` of `framework-builder.html`:

```html
<link rel="stylesheet" href="css/custom-blocks.css" />
```

Find the existing CSS link block and add this after the last one.

- [ ] **Step 3: Verify no import errors**

Run: `npx vite build 2>&1`
Expected: Build succeeds (the JS files don't export anything, they just register side effects — Vite should bundle them fine).

---

### Self-Review Checklist

1. **Spec coverage:** Each block in the spec has a corresponding Task (Tasks 2-6). All props and behaviours defined in the spec are reflected in the render/editPanel code.
2. **Placeholder scan:** No TBDs, TODOs, or vague instructions. Every step either contains complete code or an exact command.
3. **Type consistency:** All `FB.widgets.register()` calls use matching type strings between the render/editPanel and category. Prop names match between the design spec and the widget code.
4. **Scope check:** 5 blocks in one plan, covering ~500 lines of JS + CSS. Each block is independently testable.
