// main.js — Shared behaviour for all pages

import { getFavorites, FAVORITES_CHANGED_EVENT } from './storage.js';

/* ---------- Hamburger navigation ---------- */
function initNav() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    nav.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close when a link is clicked (mobile)
  nav.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement && window.innerWidth < 900) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true');
    }
  });
}

/* ---------- Favourite counter in the footer ---------- */
function renderFavCount(count) {
  const slot = document.getElementById('fav-count');
  if (!slot) return;
  slot.textContent = count === 1 ? '1 saved item' : `${count} saved items`;
}

function initFavCounter() {
  renderFavCount(getFavorites().length);

  document.addEventListener(FAVORITES_CHANGED_EVENT, (event) => {
    const count = event.detail?.count ?? getFavorites().length;
    renderFavCount(count);
  });

  window.addEventListener('storage', (event) => {
    if (event.key === 'mstore:favorites') {
      renderFavCount(getFavorites().length);
    }
  });
}

/* ---------- Year in footer ---------- */
function initYear() {
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initFavCounter();
  initYear();
});