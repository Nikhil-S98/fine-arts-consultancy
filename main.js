import gsap from "gsap";

import.meta._gsap = gsap;

var COLOR_DEFAULT = "rgb(0, 0, 0)";
var COLOR_ACTIVE = "rgb(0, 0, 255)";
var COLOR_HOVER = "rgb(0, 0, 255)";

function animateLinkColor(link, color) {
  if (!link) return;
  gsap.to(link, { color: color, duration: 0.2, ease: "power1.out", overwrite: true });
}

function syncNavActive() {
  var hash = window.location.hash || "";
  document.querySelectorAll(".site-nav__link").forEach(function (link) {
    var href = link.getAttribute("href") || "";
    link.classList.toggle("site-nav__link--active", href === hash);
    animateLinkColor(link, href === hash ? COLOR_ACTIVE : COLOR_DEFAULT);
  });
}

function wireFadeColors(selector) {
  document.querySelectorAll(selector).forEach(function (link) {
    link.addEventListener("mouseenter", function () {
      animateLinkColor(link, COLOR_HOVER);
    });
    link.addEventListener("mouseleave", function () {
      var isActive =
        link.classList.contains("site-nav__link--active") ||
        link.classList.contains("services-list__link--active");
      animateLinkColor(link, isActive ? COLOR_ACTIVE : COLOR_DEFAULT);
    });
  });
}

function ensureAboutWords() {
  var p = document.querySelector("#about .about__copy");
  if (!p) return [];
  if (p.dataset.wordsReady === "true") {
    return Array.prototype.slice.call(p.querySelectorAll(".about__word"));
  }

  var text = (p.textContent || "").replace(/\s+/g, " ").trim();
  if (!text) return [];

  p.textContent = "";
  var words = text.split(" ");
  words.forEach(function (word, idx) {
    var span = document.createElement("span");
    span.className = "about__word";
    span.textContent = word;
    p.appendChild(span);
    if (idx !== words.length - 1) {
      p.appendChild(document.createTextNode(" "));
    }
  });

  p.dataset.wordsReady = "true";
  return Array.prototype.slice.call(p.querySelectorAll(".about__word"));
}

function animateAbout() {
  var words = ensureAboutWords();
  if (!words.length) return;
  gsap.killTweensOf(words);
  gsap.set(words, { opacity: 0, y: 8 });
  gsap.to(words, {
    opacity: 1,
    y: 0,
    duration: 0.25,
    ease: "power1.out",
    stagger: 0.035,
    overwrite: true,
  });
}

function animateServicesRule() {
  var rule = document.querySelector("#services .services-rule");
  if (!rule) return;
  gsap.killTweensOf(rule);
  gsap.set(rule, { scaleY: 0 });
  gsap.to(rule, { scaleY: 1, duration: 0.6, ease: "power2.out", overwrite: true });
}

function animateSectionForHash(hash) {
  if (hash === "#about") animateAbout();
  if (hash === "#services") animateServicesRule();
}

(function () {
  var links = document.querySelectorAll(".services-list__link");
  var paras = document.querySelectorAll(".services-copy__p");
  if (!links.length || !paras.length) {
    window.addEventListener("hashchange", syncNavActive);
    syncNavActive();
    wireFadeColors(".site-nav__link, .contact__email, .services-email-link");
    animateSectionForHash(window.location.hash || "");
    return;
  }

  function resetPanels() {
    paras.forEach(function (p) {
      p.classList.add("services-copy__p--hidden");
    });
    links.forEach(function (a) {
      a.classList.remove("services-list__link--active");
      animateLinkColor(a, COLOR_DEFAULT);
    });
  }

  function showPanel(id) {
    paras.forEach(function (p) {
      var show = p.id === id;
      if (show) {
        p.classList.remove("services-copy__p--hidden");
        gsap.killTweensOf(p);
        gsap.fromTo(
          p,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, ease: "power1.out", overwrite: true }
        );
      } else {
        p.classList.add("services-copy__p--hidden");
      }
    });
    links.forEach(function (a) {
      var hid = (a.getAttribute("href") || "").slice(1);
      a.classList.toggle("services-list__link--active", hid === id);
      animateLinkColor(a, hid === id ? COLOR_ACTIVE : COLOR_DEFAULT);
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
    var nextHash = window.location.hash || "";
    if (nextHash === "#services") {
      resetPanels();
    }
    animateSectionForHash(nextHash);
  });

  resetPanels();
  syncNavActive();
  wireFadeColors(".site-nav__link, .services-list__link, .contact__email, .services-email-link");
  animateSectionForHash(window.location.hash || "");
})();
