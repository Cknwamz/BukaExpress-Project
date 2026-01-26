// src/services/productService.ts
import { Product } from '../types';
import { MOCK_PRODUCTS } from './mockData';

// We keep this variable here so we can easily switch back later
const USE_MOCK_DATA = true;
const BASE_URL = 'https://fakestoreapi.com';

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    if (USE_MOCK_DATA) {
      // Simulate network delay of 500ms so the loading spinner still shows
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(MOCK_PRODUCTS);
        }, 500);
      });
    }

    // Original Code (Kept for when server is fixed)
    try {
      const response = await fetch(`${BASE_URL}/products`);
      if (!response.ok) throw new Error('Network error');
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  getProductById: async (id: number): Promise<Product> => {
    if (USE_MOCK_DATA) {
      const product = MOCK_PRODUCTS.find(p => p.id === id);
      if (!product) throw new Error('Product not found');
      return Promise.resolve(product);
    }

    try {
      const response = await fetch(`${BASE_URL}/products/${id}`);
      if (!response.ok) throw new Error('Network error');
      return await response.json();
    } catch (error) {
      throw error;
    }
  }
};