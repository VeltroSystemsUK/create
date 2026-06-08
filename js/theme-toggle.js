FB.themeToggle = {};

FB.themeToggle.current = "dark";

FB.themeToggle.init = function () {
  var saved = localStorage.getItem("fb-theme");
  if (saved === "light") {
    FB.themeToggle.set("light");
  } else {
    FB.themeToggle.set("dark");
  }
};

FB.themeToggle.set = function (mode) {
  FB.themeToggle.current = mode;
  document.documentElement.setAttribute("data-theme", mode);
  localStorage.setItem("fb-theme", mode);
  var icon = document.getElementById("theme-icon");
  if (icon) {
    icon.textContent = mode === "dark" ? "☀" : "☾";
  }
};

FB.themeToggle.toggle = function () {
  var next = FB.themeToggle.current === "dark" ? "light" : "dark";
  FB.themeToggle.set(next);
};
