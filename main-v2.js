const base = import.meta.env.BASE_URL;
const images = [
  base + "images/DSCF2754.jpg",
  base + "images/IMG_1790.jpg",
  base + "images/IMG_4296.jpg",
];

const img = document.getElementById("hero-img");
if (img) {
  const src = images[Math.floor(Math.random() * images.length)];
  img.src = src;
  img.addEventListener("load", () => img.classList.add("loaded"), { once: true });
}
