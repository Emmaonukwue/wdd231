// products.js — Products page logic for mStore

import { fetchProducts, fetchCategories } from './api.js';
import { getFavorites, toggleFavorite, isFavorite } from './storage.js';
import { openProductModal, initModal } from './modal.js';

const grid = document.getElementById('product-grid');
const status = document.getElementById('status');
const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('category');
const sortSelect = document.getElementById('sort');

let allProducts = [];

/* ---------- Status helpers ---------- */
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

/* ---------- Card template ---------- */
function productCardTemplate(product) {
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

/* ---------- Render pipeline ---------- */
function applyFiltersAndRender() {
  const term = (searchInput?.value || '').trim().toLowerCase();
  const category = categorySelect?.value || 'all';
  const sort = sortSelect?.value || 'default';

  let list = [...allProducts];

  if (term) {
    list = list.filter((p) =>
      p.title.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  }

  if (category !== 'all') {
    list = list.filter((p) => p.category === category);
  }

  // Array method: sort with comparator
  if (sort === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    list.sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0));
  }

  render(list);
}

function render(list) {
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = '';
    showStatus('No products match your filters.');
    return;
  }

  hideStatus();

  // Array method: map to build the markup
  const markup = list.map(productCardTemplate).join('');
  grid.innerHTML = markup;
}

/* ---------- Category dropdown ---------- */
function populateCategories(categories) {
  if (!categorySelect) return;
  const options = ['all', ...categories];
  categorySelect.innerHTML = options
    .map((cat) => {
      const label = cat === 'all' ? 'All categories' : cat;
      return `<option value="${cat}">${label}</option>`;
    })
    .join('');
}

/* ---------- Event handling ---------- */
function attachGridHandlers() {
  if (!grid) return;

  grid.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const detailsBtn = target.closest('.btn-details');
    const favBtn = target.closest('.btn-fav');

    if (detailsBtn) {
      const id = Number(detailsBtn.dataset.id);
      const product = allProducts.find((p) => p.id === id);
      if (product) openProductModal(product, isFavorite(id), handleToggleFavorite);
      return;
    }

    if (favBtn) {
      const id = Number(favBtn.dataset.id);
      handleToggleFavorite(id);
      // Update the button in place
      const nowFav = isFavorite(id);
      favBtn.classList.toggle('is-fav', nowFav);
      favBtn.setAttribute('aria-pressed', String(nowFav));
      favBtn.textContent = nowFav ? '★ Saved' : '☆ Save';
    }
  });
}

/**
 * Called by the modal when a favourite is toggled.
 * @param {number} id
 * @returns {boolean} new favourite state
 */
function handleToggleFavorite(id) {
  const nowFav = toggleFavorite(id);
  // Sync any matching card button
  const cardBtn = grid?.querySelector(`.btn-fav[data-id="${id}"]`);
  if (cardBtn) {
    cardBtn.classList.toggle('is-fav', nowFav);
    cardBtn.setAttribute('aria-pressed', String(nowFav));
    cardBtn.textContent = nowFav ? '★ Saved' : '☆ Save';
  }
  return nowFav;
}

/* ---------- Init ---------- */
async function initProductsPage() {
  if (!grid) return;

  initModal();
  showStatus('Loading products…');

  try {
    const [products, categories] = await Promise.all([
      fetchProducts(),
      fetchCategories().catch(() => [])
    ]);

    allProducts = products;
    populateCategories(categories);
    applyFiltersAndRender();

    searchInput?.addEventListener('input', applyFiltersAndRender);
    categorySelect?.addEventListener('change', applyFiltersAndRender);
    sortSelect?.addEventListener('change', applyFiltersAndRender);

    attachGridHandlers();
  } catch (error) {
    showStatus(
      'Sorry — we could not load products right now. Please refresh and try again.',
      true
    );
  }
}

document.addEventListener('DOMContentLoaded', initProductsPage);