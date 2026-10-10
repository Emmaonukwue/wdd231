// modal.js — Accessible modal dialog for product details

const modal = document.getElementById('product-modal');
let lastFocusedElement = null;

/**
 * Build the modal content and open it.
 * @param {Object} product
 * @param {boolean} isFav
 * @param {(id:number)=>void} onToggleFavorite
 */
export function openProductModal(product, isFav, onToggleFavorite) {
  if (!modal) return;

  lastFocusedElement = document.activeElement;

  const body = modal.querySelector('.modal-body');
  body.innerHTML = `
    <button type="button" class="modal-close" aria-label="Close product details">&times;</button>
    <div class="modal-image">
      <img src="${product.image}" alt="${product.title}" width="220" height="220" loading="lazy">
    </div>
    <p class="modal-category">${product.category}</p>
    <h2 class="modal-title" id="modal-title">${product.title}</h2>
    <p class="modal-description">${product.description}</p>
    <div class="modal-meta">
      <span class="modal-price">$${Number(product.price).toFixed(2)}</span>
      <span class="product-card-rating">
        <span class="star" aria-hidden="true">★</span>
        <span>${product.rating?.rate ?? '—'} (${product.rating?.count ?? 0})</span>
      </span>
    </div>
    <button type="button" class="btn btn-favorite" data-id="${product.id}">
      ${isFav ? '★ Remove from Favorites' : '☆ Add to Favorites'}
    </button>
  `;

  body.querySelector('.modal-close').addEventListener('click', closeProductModal);

  const favBtn = body.querySelector('.btn-favorite');
  favBtn.addEventListener('click', () => {
    const nowFav = onToggleFavorite(product.id);
    favBtn.textContent = nowFav ? '★ Remove from Favorites' : '☆ Add to Favorites';
  });

  modal.showModal();
  body.querySelector('.modal-close')?.focus();
}

export function closeProductModal() {
  if (!modal) return;
  modal.close();
  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
}

/**
 * Wire up the modal's built-in close behaviours.
 */
export function initModal() {
  if (!modal) return;

  // Close when the user clicks the backdrop
  modal.addEventListener('click', (event) => {
    const rect = modal.getBoundingClientRect();
    const inDialog =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (!inDialog) closeProductModal();
  });

  // Esc is handled natively by <dialog>; ensure focus returns.
  modal.addEventListener('close', () => {
    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  });
}