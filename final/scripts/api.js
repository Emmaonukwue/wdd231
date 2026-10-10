// api.js — Fetch wrappers for mStore using the Fake Store API

const BASE_URL = 'https://fakestoreapi.com';

/**
 * Fetch all products.
 * @returns {Promise<Array>}
 */
export async function fetchProducts() {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`Products request failed (${response.status})`);
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Unexpected response shape from products endpoint.');
    }
    return data;
  } catch (error) {
    console.error('fetchProducts error:', error);
    throw error;
  }
}

/**
 * Fetch a single product by id.
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function fetchProduct(id) {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error(`Product ${id} request failed (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error(`fetchProduct(${id}) error:`, error);
    throw error;
  }
}

/**
 * Fetch all product categories.
 * @returns {Promise<string[]>}
 */
export async function fetchCategories() {
  try {
    const response = await fetch(`${BASE_URL}/products/categories`);
    if (!response.ok) {
      throw new Error(`Categories request failed (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error('fetchCategories error:', error);
    throw error;
  }
}