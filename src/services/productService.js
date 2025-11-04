// src/services/productService.js
import axios from 'axios';

const API_URL = 'http://localhost:3002/product';

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const productService = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create product
  createProduct: async (productData) => {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        formData.append(key, productData[key]);
      });
      
      const response = await api.post('/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        formData.append(key, productData[key]);
      });
      
      const response = await api.put(`/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default productService;