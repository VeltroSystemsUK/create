FB.language = {};

FB.language.LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "zh-CN", name: "Chinese (Simplified)", flag: "🇨🇳" },
  { code: "zh-TW", name: "Chinese (Traditional)", flag: "🇹🇼" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "sv", name: "Swedish", flag: "🇸🇪" },
  { code: "da", name: "Danish", flag: "🇩🇰" },
  { code: "fi", name: "Finnish", flag: "🇫🇮" },
  { code: "no", name: "Norwegian", flag: "🇳🇴" },
  { code: "cs", name: "Czech", flag: "🇨🇿" },
  { code: "el", name: "Greek", flag: "🇬🇷" },
  { code: "he", name: "Hebrew", flag: "🇮🇱" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "ms", name: "Malay", flag: "🇲🇾" },
  { code: "uk", name: "Ukrainian", flag: "🇺🇦" },
  { code: "ro", name: "Romanian", flag: "🇷🇴" },
  { code: "hu", name: "Hungarian", flag: "🇭🇺" },
];

FB.language.current = "en";

FB.language.init = function () {
  var saved = localStorage.getItem("fb-language");
  if (saved) {
    FB.language.current = saved;
  }
  FB.language.renderMenu();
  FB.language.updateDisplay();
};

FB.language.renderMenu = function () {
  var menu = document.getElementById("lang-menu");
  if (!menu) return;
  var html = "";
  FB.language.LANGUAGES.forEach(function (lang) {
    var active = lang.code === FB.language.current ? " active" : "";
    html +=
      '<button class="' +
      active +
      '" onclick="FB.language.select(\'' +
      lang.code +
      '\')" data-lang="' +
      lang.code +
      '">' +
      '<span class="lang-flag">' +
      lang.flag +
      "</span>" +
      "<span>" +
      lang.name +
      "</span>" +
      "</button>";
  });
  menu.innerHTML = html;
};

FB.language.updateDisplay = function () {
  var lang = FB.language.LANGUAGES.find(function (l) {
    return l.code === FB.language.current;
  });
  var flag = document.getElementById("lang-current-flag");
  var code = document.getElementById("lang-current-code");
  if (flag && lang) flag.textContent = lang.flag;
  if (code) code.textContent = FB.language.current.toUpperCase();
};

FB.language.toggleMenu = function () {
  var menu = document.getElementById("lang-menu");
  if (!menu) return;
  var isOpen = menu.classList.contains("open");
  if (isOpen) {
    menu.classList.remove("open");
  } else {
    menu.classList.add("open");
  }
};

FB.language.select = function (code) {
  FB.language.current = code;
  localStorage.setItem("fb-language", code);
  FB.language.updateDisplay();
  FB.language.renderMenu();
  document.getElementById("lang-menu").classList.remove("open");

  if (
    typeof google !== "undefined" &&
    google.translate &&
    google.translate.TranslateElement
  ) {
    var select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event("change"));
    }
  }
};

FB.language.closeMenu = function (e) {
  var dropdown = document.querySelector(".lang-dropdown");
  var menu = document.getElementById("lang-menu");
  if (dropdown && menu && !dropdown.contains(e.target)) {
    menu.classList.remove("open");
  }
};

document.addEventListener("click", FB.language.closeMenu);
