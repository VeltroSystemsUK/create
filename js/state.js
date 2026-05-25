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
  FB.state.blocks = JSON.parse(FB.state.history.pop());
  FB.canvas.render();
  FB.panels.updateUndoRedo();
  FB.util.showToast("Undone");
};

FB.state.redo = function () {
  if (!FB.state.future.length) return;
  FB.state.history.push(JSON.stringify(FB.state.blocks));
  FB.state.blocks = JSON.parse(FB.state.future.pop());
  FB.canvas.render();
  FB.panels.updateUndoRedo();
  FB.util.showToast("Redone");
};
