import { places } from "../data/discover.mjs";

/* ---------- 1. Build the 8 cards ---------- */
const grid = document.querySelector("#discover-grid");

if (grid) {
  places.forEach((place, i) => {
    const card = document.createElement("article");
    card.className = `discover-card card-${i + 1}`;

    card.innerHTML = `
      <h2>${place.name}</h2>
      <figure>
        <img src="images/${place.image}"
             alt="${place.name}"
             width="300" height="200"
             loading="lazy" decoding="async">
      </figure>
      <address>${place.address}</address>
      <p>${place.description}</p>
      <button type="button" class="btn learn-more">Learn More</button>
    `;
    grid.appendChild(card);
  });
}

/* ---------- 2. localStorage visit message ---------- */
const msgBox = document.querySelector("#visitor-message");
if (msgBox) {
  const KEY = "chamberLastVisit";
  const now = Date.now();
  const last = localStorage.getItem(KEY);

  if (!last) {
    msgBox.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    const MS_PER_DAY = 86400000;
    const days = Math.floor((now - Number(last)) / MS_PER_DAY);

    if (days < 1) {
      msgBox.textContent = "Back so soon! Awesome!";
    } else if (days === 1) {
      msgBox.textContent = "You last visited 1 day ago.";
    } else {
      msgBox.textContent = `You last visited ${days} days ago.`;
    }
  }

  localStorage.setItem(KEY, now);
}