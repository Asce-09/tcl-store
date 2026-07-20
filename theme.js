(function () {
  var STORAGE_KEY = "tcl-theme";

  function getStoredTheme() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch (e) {
      // localStorage unavailable (private browsing, etc.) — fall back to default
    }
    return null;
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      // Light is the default and needs no attribute at all — this way the
      // correct (light) theme is guaranteed even if this script never runs.
      document.documentElement.removeAttribute("data-theme");
    }
  }

  // Apply immediately, before the page paints, so there's no flash of the
  // wrong theme. This script is loaded in <head> for exactly that reason.
  applyTheme(getStoredTheme() || "light");

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.getElementById("themeToggle");
    if (!btn) return;
    btn.onclick = function () {
      var isDark = document.documentElement.getAttribute("data-theme") === "dark";
      var next = isDark ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        // ignore — theme just won't persist across reloads
      }
    };
  });
})();
