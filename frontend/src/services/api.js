import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', errorMessage);
    return Promise.reject(error);
  }
);

// ==================== BRAND APIs ====================

export const brandAPI = {
  // Get all brands
  getAll: async () => {
    return api.get('/brands');
  },

  // Get single brand by name
  getOne: async (brandName) => {
    return api.get(`/brands/${brandName}`);
  },

  // Get all categories
  getCategories: async () => {
    return api.get('/brands/categories');
  },
};

// ==================== PRODUCT APIs ====================

export const productAPI = {
  // Get all products with filters
  getAll: async (params = {}) => {
    return api.get('/products', { params });
  },

  // Get single product by ID
  getOne: async (id) => {
    return api.get(`/products/${id}`);
  },

  // Get products by brand
  getByBrand: async (brandName, params = {}) => {
    return api.get(`/products/brand/${brandName}`, { params });
  },

  // Get featured products
  getFeatured: async (limit = 8) => {
    return api.get('/products/featured', { params: { limit } });
  },

  // Get all categories
  getCategories: async () => {
    return api.get('/brands/categories');
  },
};

export default api;
