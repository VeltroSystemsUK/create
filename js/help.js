FB.help = {};

FB.help._modal = null;
FB.help._activeTopic = "overview";
FB.help._escHandler = null;

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
