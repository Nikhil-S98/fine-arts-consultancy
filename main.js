import gsap from "gsap";

// ── Hero image ───────────────────────────────────
const base = import.meta.env.BASE_URL;
const sectionImages = {
  services: base + "images/INDEX_services.jpg",
  about:    base + "images/INDEX_about.jpg",
  contact:  base + "images/INDEX_contact.jpg",
};

const heroImg = document.getElementById("hero-img");
const page = document.querySelector(".page");
const heroEl = document.querySelector(".hero");

const footerEl = document.querySelector(".footer");

function fitLayout() {
  if (!heroImg || !heroImg.naturalWidth || !page || !heroEl) return;
  if (window.innerWidth <= 959) {
    page.style.padding = "";
    heroEl.style.marginLeft = "";
    heroEl.style.marginRight = "";
    if (footerEl) { footerEl.style.marginLeft = ""; footerEl.style.marginRight = ""; }
    return;
  }
  const pageW = page.getBoundingClientRect().width;
  const imgW = heroImg.getBoundingClientRect().width;
  const pad = Math.round(Math.max(0, (pageW - imgW) / 2));
  page.style.padding = `0 ${pad}px`;
  heroEl.style.marginLeft = `-${pad}px`;
  heroEl.style.marginRight = `-${pad}px`;
  if (footerEl) {
    footerEl.style.marginLeft = `-${pad}px`;
    footerEl.style.marginRight = `-${pad}px`;
  }
}

function setHeroImage(name) {
  if (!heroImg) return;
  gsap.to(heroImg, {
    opacity: 0, duration: 0.25, ease: "power1.in", onComplete: () => {
      heroImg.src = sectionImages[name];
      heroImg.onload = () => {
        fitLayout();
        gsap.to(heroImg, { opacity: 1, duration: 0.4, ease: "power1.out" });
      };
    }
  });
}

const initSection = ["services", "about", "contact"].includes(window.location.hash.slice(1))
  ? window.location.hash.slice(1)
  : "services";

if (heroImg) {
  heroImg.src = sectionImages[initSection];
  heroImg.addEventListener("load", () => {
    heroImg.classList.add("loaded");
    fitLayout();
  }, { once: true });
}

window.addEventListener("resize", fitLayout);

// ── Main views ───────────────────────────────────
const views = {
  services: document.getElementById("services"),
  about: document.getElementById("about"),
  contact: document.getElementById("contact"),
};

let active = "services";

gsap.set([views.about, views.contact], { opacity: 0, pointerEvents: "none" });

// ── Nav active state ─────────────────────────────
function setNavActive(name) {
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.toggle("nav-link--active", link.getAttribute("href") === `#${name}`);
  });
}

setNavActive("services");

// ── Services panel ───────────────────────────────
const serviceBtns = document.querySelectorAll(".services-btn");
const servicePanels = document.querySelectorAll(".services-panel");

function resetServicePanels() {
  servicePanels.forEach((p) => p.classList.remove("is-visible"));
  serviceBtns.forEach((b) => b.classList.remove("services-btn--active"));
}

function buildPanelWords(panel) {
  if (!panel || panel.dataset.built) return;
  const items = [];
  panel.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent.split(/\s+/).filter(Boolean).forEach((w) => items.push({ type: "text", text: w }));
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      items.push({ type: "el", node: node.cloneNode(true) });
    }
  });
  panel.textContent = "";
  items.forEach((item, i) => {
    const span = document.createElement("span");
    span.className = "panel-word";
    if (item.type === "text") span.textContent = item.text;
    else span.appendChild(item.node);
    panel.appendChild(span);
    if (i < items.length - 1) panel.appendChild(document.createTextNode(" "));
  });
  panel.dataset.built = "true";
}

function animatePanelWords(panel) {
  buildPanelWords(panel);
  const words = panel.querySelectorAll(".panel-word");
  gsap.killTweensOf(words);
  gsap.set(words, { opacity: 0 });
  gsap.to(words, { opacity: 1, duration: 0.25, ease: "power1.out", stagger: 0.035 });
}

function showServicePanel(panelId) {
  servicePanels.forEach((p) => {
    if (p.id === panelId) {
      p.classList.add("is-visible");
      animatePanelWords(p);
    } else {
      p.classList.remove("is-visible");
    }
  });
  serviceBtns.forEach((b) => {
    b.classList.toggle("services-btn--active", `panel-${b.dataset.panel}` === panelId);
  });
}

function animateServicesRule() {
  const rule = document.querySelector("#services .services-rule");
  if (!rule) return;
  gsap.killTweensOf(rule);
  gsap.set(rule, { scaleY: 0 });
  gsap.to(rule, { scaleY: 1, duration: 0.5, ease: "power2.out" });
}

serviceBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    showServicePanel(`panel-${btn.dataset.panel}`);
  });
});

// ── About word animation ─────────────────────────
function buildWords() {
  const p = document.querySelector("#about .about-copy");
  if (!p || p.dataset.built) return;
  const text = (p.textContent || "").replace(/\s+/g, " ").trim();
  p.textContent = "";
  text.split(" ").forEach((word, i, arr) => {
    const span = document.createElement("span");
    span.className = "about-word";
    span.textContent = word;
    p.appendChild(span);
    if (i < arr.length - 1) p.appendChild(document.createTextNode(" "));
  });
  p.dataset.built = "true";
}

function animateAbout() {
  buildWords();
  const words = document.querySelectorAll("#about .about-word");
  gsap.killTweensOf(words);
  gsap.set(words, { opacity: 0 });
  gsap.to(words, {
    opacity: 1,
    duration: 0.25,
    ease: "power1.out",
    stagger: 0.035,
  });
}

// ── Contact animation ────────────────────────────
function animateContact() {
  const email = document.querySelector("#contact .contact-email");
  if (!email) return;
  gsap.killTweensOf(email);
  gsap.fromTo(email, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power1.out" });
}

// ── Switch view ──────────────────────────────────
function switchTo(name) {
  if (name === active || !views[name]) return;

  setHeroImage(name);

  gsap.to(views[active], { opacity: 0, duration: 0.2, ease: "power1.in" });
  gsap.set(views[active], { pointerEvents: "none" });

  gsap.set(views[name], { pointerEvents: "auto" });
  gsap.fromTo(views[name], { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power1.out", delay: 0.15 });

  if (name === "about") gsap.delayedCall(0.15, animateAbout);
  if (name === "contact") gsap.delayedCall(0.15, animateContact);
  if (name === "services") {
    resetServicePanels();
    gsap.delayedCall(0.15, animateServicesRule);
  }

  active = name;
  setNavActive(name);
}

// ── Nav clicks ───────────────────────────────────
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href") || "";
    if (!href.startsWith("#")) return;
    e.preventDefault();
    switchTo(href.slice(1));
    history.pushState(null, "", href);
  });
});

// ── Init ─────────────────────────────────────────
const initHash = window.location.hash.slice(1);
if (initHash && views[initHash] && initHash !== "services") {
  gsap.set(views.services, { opacity: 0, pointerEvents: "none" });
  gsap.set(views[initHash], { opacity: 1, pointerEvents: "auto" });
  active = initHash;
  setNavActive(initHash);
  if (initHash === "about") buildWords();
} else {
  resetServicePanels();
  animateServicesRule();
}
