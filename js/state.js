window.FB = {};

FB.state = {
  blocks: [],
  selectedId: null,
  history: [],
  future: [],
  pages: [],
  currentPageId: null,
  page: { title: "", description: "", favicon: "", customCSS: "" },
  theme: {
    accent: "#CDFE00",
    bg: "#111111",
    text: "#f7f6f2",
    surface: "#1a1a2a",
    fontHeading: "Lexend",
    fontBody: "Lexend",
  },
};

FB.state.genId = function () {
  return "b_" + Math.random().toString(36).slice(2, 9);
};

FB.state.saveHistory = function () {
  FB.state.history.push(JSON.stringify(FB.state.blocks));
  if (FB.state.history.length > 100) FB.state.history.shift();
  FB.state.future = [];
};

FB.state.undo = function () {
  if (!FB.state.history.length) return;
  FB.state.future.push(JSON.stringify(FB.state.blocks));
  var historyEntry = FB.state.history.pop();
  if (!historyEntry) return;
  try {
    FB.state.blocks = JSON.parse(historyEntry);
  } catch (e) {
    console.error("[undo] Failed to parse history:", e);
    return;
  }
  FB.canvas.render();
  FB.panels.updateUndoRedo();
  FB.util.showToast("Undone");
};

FB.state.redo = function () {
  if (!FB.state.future.length) return;
  FB.state.history.push(JSON.stringify(FB.state.blocks));
  var futureEntry = FB.state.future.pop();
  if (!futureEntry) return;
  try {
    FB.state.blocks = JSON.parse(futureEntry);
  } catch (e) {
    console.error("[redo] Failed to parse future:", e);
    return;
  }
  FB.canvas.render();
  FB.panels.updateUndoRedo();
  FB.util.showToast("Redone");
};
