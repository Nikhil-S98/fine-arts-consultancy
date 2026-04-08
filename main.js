import gsap from "gsap";

import.meta._gsap = gsap;

function syncNavActive() {
  var hash = window.location.hash || "";
  document.querySelectorAll(".site-nav__link").forEach(function (link) {
    var href = link.getAttribute("href") || "";
    link.classList.toggle("site-nav__link--active", href === hash);
  });
}

(function () {
  var links = document.querySelectorAll(".services-list__link");
  var paras = document.querySelectorAll(".services-copy__p");
  if (!links.length || !paras.length) {
    window.addEventListener("hashchange", syncNavActive);
    syncNavActive();
    return;
  }

  function resetPanels() {
    paras.forEach(function (p) {
      p.classList.add("services-copy__p--hidden");
    });
    links.forEach(function (a) {
      a.classList.remove("services-list__link--active");
    });
  }

  function showPanel(id) {
    paras.forEach(function (p) {
      p.classList.toggle("services-copy__p--hidden", p.id !== id);
    });
    links.forEach(function (a) {
      var hid = (a.getAttribute("href") || "").slice(1);
      a.classList.toggle("services-list__link--active", hid === id);
    });
  }

  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var id = link.getAttribute("href");
      if (!id || id.charAt(0) !== "#") return;
      showPanel(id.slice(1));
    });
  });

  window.addEventListener("hashchange", function () {
    syncNavActive();
    if (window.location.hash === "#services") {
      resetPanels();
    }
  });

  resetPanels();
  syncNavActive();
})();
