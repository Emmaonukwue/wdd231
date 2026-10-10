// storage.js — Local Storage helpers for mStore

const FAVORITES_KEY = 'mstore:favorites';
const THEME_KEY = 'mstore:theme';

export const FAVORITES_CHANGED_EVENT = 'favorites:changed';

/**
 * Read the saved favorites array from localStorage.
 * @returns {number[]} Array of product IDs.
 */
export function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Could not read favorites:', error);
    return [];
  }
}

/**
 * Persist the favorites array and broadcast the change.
 * @param {number[]} ids
 */
export function saveFavorites(ids) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
    document.dispatchEvent(
      new CustomEvent(FAVORITES_CHANGED_EVENT, {
        detail: { favorites: [...ids], count: ids.length }
      })
    );
  } catch (error) {
    console.warn('Could not save favorites:', error);
  }
}

/**
 * Toggle a product ID in the favorites list.
 * @param {number} id
 * @returns {boolean} true if now favorited, false if removed.
 */
export function toggleFavorite(id) {
  const favorites = getFavorites();
  const index = favorites.indexOf(id);
  let isFavorite;
  if (index === -1) {
    favorites.push(id);
    isFavorite = true;
  } else {
    favorites.splice(index, 1);
    isFavorite = false;
  }
  saveFavorites(favorites);
  return isFavorite;
}

/** @param {number} id */
export function isFavorite(id) {
  return getFavorites().includes(id);
}

/** Theme persistence */
export function getTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'light';
  } catch {
    return 'light';
  }
}

/** @param {'light'|'dark'} theme */
export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.warn('Could not save theme:', error);
  }
}