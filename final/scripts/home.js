// home.js — Featured products on the mStore landing page

import { fetchProducts } from './api.js';
import { isFavorite, toggleFavorite } from './storage.js';
import { openProductModal, initModal } from './modal.js';

const grid = document.getElementById('featured-grid');
const status = document.getElementById('featured-status');

function showStatus(message, isError = false) {
  if (!status) return;
  status.textContent = message;
  status.hidden = false;
  status.classList.toggle('error', isError);
}

function hideStatus() {
  if (!status) return;
  status.hidden = true;
  status.textContent = '';
  status.classList.remove('error');
}

function cardTemplate(product) {
  const fav = isFavorite(product.id);
  return `
    <article class="product-card" data-id="${product.id}">
      <div class="product-card-image">
        <img src="${product.image}" alt="${product.title}" width="200" height="200" loading="lazy">
      </div>
      <div class="product-card-body">
        <span class="product-card-category">${product.category}</span>
        <h3 class="product-card-title">${product.title}</h3>
        <div class="product-card-meta">
          <span class="product-card-price">$${Number(product.price).toFixed(2)}</span>
          <span class="product-card-rating">
            <span class="star" aria-hidden="true">★</span>
            <span>${product.rating?.rate ?? '—'}</span>
          </span>
        </div>
        <button type="button" class="btn btn-small btn-details" data-id="${product.id}">
          View Details
        </button>
        <button
          type="button"
          class="btn btn-secondary btn-small btn-fav ${fav ? 'is-fav' : ''}"
          data-id="${product.id}"
          aria-pressed="${fav}">
          ${fav ? '★ Saved' : '☆ Save'}
        </button>
      </div>
    </article>
  `;
}

function handleToggleFavorite(id) {
  const nowFav = toggleFavorite(id);
  const btn = grid?.querySelector(`.btn-fav[data-id="${id}"]`);
  if (btn) {
    btn.classList.toggle('is-fav', nowFav);
    btn.setAttribute('aria-pressed', String(nowFav));
    btn.textContent = nowFav ? '★ Saved' : '☆ Save';
  }
  const counter = document.getElementById('fav-count');
  if (counter) {
    const n = JSON.parse(localStorage.getItem('mstore:favorites') || '[]').length;
    counter.textContent = n === 1 ? '1 saved item' : `${n} saved items`;
  }
  return nowFav;
}

async function initHome() {
  if (!grid) return;
  initModal();

  showStatus('Loading featured products…');

  try {
    const products = await fetchProducts();
    // Array method: sort by rating desc, then take the first four
    const featured = [...products]
      .sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0))
      .slice(0, 4);

    grid.innerHTML = featured.map(cardTemplate).join('');
    hideStatus();

    grid.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const detailsBtn = target.closest('.btn-details');
      const favBtn = target.closest('.btn-fav');

      if (detailsBtn) {
        const id = Number(detailsBtn.dataset.id);
        const product = products.find((p) => p.id === id);
        if (product) openProductModal(product, isFavorite(id), handleToggleFavorite);
      } else if (favBtn) {
        handleToggleFavorite(Number(favBtn.dataset.id));
      }
    });
  } catch (error) {
    showStatus('Unable to load featured products right now.', true);
  }
}

document.addEventListener('DOMContentLoaded', initHome);