FB.util = {};

FB.util.showToast = function (msg) {
  const t = document.getElementById("toast");
  t.innerHTML = msg + '<div class="toast-progress"></div>';
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(function () {
    t.classList.remove("show");
  }, 2200);
};

FB.init = function () {
  FB.panels.buildLibrary();
  var restored = FB.pages.init();
  if (!restored) FB.templates.loadStarter();
  FB.pages.render();
  FB.templates.populateTemplates();
  FB.templates.populateBlockThemes();
  FB.canvas.render();
  FB.canvas.initAnimations();
  FB.canvas.initWordSwap();
  FB.canvas.initSplitText();
  FB.canvas.initMaskReveal();
  FB.canvas.initCounters();
  FB.canvas.initGlitch();
  FB.canvas.initParticles();
  FB.canvas.initDayNight();
  FB.canvas.initScrollIndicator();
  FB.canvas.initSvgDraw();
  FB.canvas.initCountdown();
  FB.canvas.initProductTabs();
  if (FB.theme && FB.theme.apply) FB.theme.apply();
  if (FB.themeToggle && FB.themeToggle.init) FB.themeToggle.init();
  if (FB.language && FB.language.init) FB.language.init();

  if (localStorage.getItem("fb-left-collapsed") === "true") {
    document.getElementById("left-panel").classList.add("collapsed");
  }
  // Right panel starts collapsed by default
  if (localStorage.getItem("fb-right-collapsed") !== "false") {
    document.getElementById("right-panel").classList.add("collapsed");
  }
  FB.panels.updatePanelsCollapsed();

  // Cmd+C / Cmd+V for block copy-paste (not handled in canvas.initKeyboard)
  document.addEventListener("keydown", function (e) {
    var tag = document.activeElement ? document.activeElement.tagName : "";
    var isEditing =
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      (document.activeElement &&
        document.activeElement.contentEditable === "true");
    if (isEditing) return;
    var meta = e.metaKey || e.ctrlKey;
    if (meta && e.key === "c" && FB.state.selectedId) {
      var _block = FB.state.blocks.find(function (b) {
        return b.id === FB.state.selectedId;
      });
      if (_block) {
        navigator.clipboard.writeText(
          JSON.stringify({ type: _block.type, props: _block.props }),
        );
        FB.util.showToast("\uD83D\uDCCB Block copied");
      }
    }
    if (meta && e.key === "v") {
      e.preventDefault();
      navigator.clipboard.readText().then(function (text) {
        try {
          var _data = JSON.parse(text);
          if (_data.type && _data.props) {
            FB.canvas.insertBlock(_data.type, FB.state.selectedId);
            FB.util.showToast("\uD83D\uDCCB Block pasted");
          }
        } catch (_) {}
      });
    }
  });

  document
    .getElementById("modal-overlay")
    .addEventListener("click", function (e) {
      if (e.target === document.getElementById("modal-overlay"))
        FB.export.close();
    });

  setInterval(function () {
    FB.pages._save();
  }, 30000);
};

document.addEventListener("DOMContentLoaded", FB.init);
