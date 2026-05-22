FB.help = {};

FB.help._modal = null;
FB.help._activeTopic = "overview";
FB.help._escHandler = null;

FB.help.TOPICS = [
  {
    id: "overview",
    label: "Interface Overview",
    category: "Getting Started",
    icon: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  },
  {
    id: "sections",
    label: "Working with Sections",
    category: "Building",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  },
  {
    id: "styling",
    label: "Styling",
    category: "Building",
    icon: "M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6",
  },
  {
    id: "templates",
    label: "Templates & Saving",
    category: "Building",
    icon: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8",
  },
  {
    id: "pages",
    label: "Pages",
    category: "Building",
    icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
  },
  {
    id: "import",
    label: "Import",
    category: "Advanced",
    icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  },
  {
    id: "export",
    label: "Export",
    category: "Advanced",
    icon: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  },
  {
    id: "animations",
    label: "Animations & Effects",
    category: "Advanced",
    icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  },
  {
    id: "shortcuts",
    label: "Keyboard Shortcuts",
    category: "Reference",
    icon: "M2 4h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01",
  },
];

FB.help._buildShell = function () {
  var backdrop = document.createElement("div");
  backdrop.id = "fb-help-backdrop";
  backdrop.addEventListener("click", function (e) {
    if (e.target === backdrop) FB.help.close();
  });

  var modal = document.createElement("div");
  modal.id = "fb-help-modal";

  var sidebar = document.createElement("div");
  sidebar.id = "fb-help-sidebar";
  sidebar.innerHTML =
    '<div class="fb-help-sidebar-head">' +
    '<div class="fb-help-sidebar-title">HELP CENTRE</div>' +
    '<div class="fb-help-sidebar-sub">Framework Builder</div>' +
    "</div>" +
    '<div class="fb-help-topics" id="fb-help-topics"></div>' +
    '<div class="fb-help-sidebar-footer">' +
    '<button id="fb-help-tour-btn" onclick="FB.help.startTour()">' +
    '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">' +
    '<polygon points="5 3 19 12 5 21 5 3"/>' +
    "</svg>" +
    "Take the Tour" +
    "</button>" +
    "</div>";

  var content = document.createElement("div");
  content.id = "fb-help-content";

  var closeBtn = document.createElement("button");
  closeBtn.id = "fb-help-close";
  closeBtn.setAttribute("aria-label", "Close help");
  closeBtn.innerHTML =
    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
    '<line x1="18" y1="6" x2="6" y2="18"/>' +
    '<line x1="6" y1="6" x2="18" y2="18"/>' +
    "</svg>";
  closeBtn.addEventListener("click", FB.help.close);
  content.appendChild(closeBtn);

  modal.appendChild(sidebar);
  modal.appendChild(content);
  backdrop.appendChild(modal);
  return backdrop;
};

FB.help.open = function (topicId) {
  if (FB.help._modal) {
    FB.help._switchTopic(topicId || FB.help._activeTopic);
    return;
  }
  var backdrop = FB.help._buildShell();
  document.body.appendChild(backdrop);
  FB.help._modal = backdrop;

  if (FB.help._buildTopicList) FB.help._buildTopicList();
  if (FB.help._render) FB.help._render(topicId || "overview");

  FB.help._escHandler = function (e) {
    if (e.key === "Escape") FB.help.close();
  };
  document.addEventListener("keydown", FB.help._escHandler);
};

FB.help.close = function () {
  if (!FB.help._modal) return;
  FB.help._modal.remove();
  FB.help._modal = null;
  if (FB.help._escHandler) {
    document.removeEventListener("keydown", FB.help._escHandler);
    FB.help._escHandler = null;
  }
};

FB.help._buildTopicList = function () {
  var container = document.getElementById("fb-help-topics");
  if (!container) return;
  container.innerHTML = "";
  FB.help.TOPICS.forEach(function (topic) {
    var item = document.createElement("div");
    item.className =
      "fb-help-topic-item" +
      (topic.id === FB.help._activeTopic ? " active" : "");
    item.dataset.id = topic.id;
    item.innerHTML =
      '<svg class="fb-help-item-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
      '<path d="' +
      topic.icon +
      '"/>' +
      "</svg>" +
      '<span class="fb-help-topic-label">' +
      topic.label +
      "</span>";
    item.addEventListener("click", function () {
      FB.help._switchTopic(topic.id);
    });
    container.appendChild(item);
  });
};

FB.help._switchTopic = function (id) {
  FB.help._activeTopic = id;
  document.querySelectorAll(".fb-help-topic-item").forEach(function (el) {
    el.classList.toggle("active", el.dataset.id === id);
  });
  if (FB.help._render) FB.help._render(id);
};
