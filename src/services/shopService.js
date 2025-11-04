// src/services/shopService.js
import axios from 'axios';

const API_BASE_URL = 'https://hair-salon-app-1.onrender.com';
const api = axios.create({
  baseURL: API_BASE_URL,
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

export const shopService = {
  // Get all shops
  getAllShops: async () => {
    try {
      const response = await api.get('/shop');
      return response.data;
    } catch (error) {
      // Return empty array if endpoint doesn't exist yet
      if (error.response?.status === 404) {
        return [];
      }
      throw error.response?.data || error.message;
    }
  },

  // Get shops count
  getShopsCount: async () => {
    try {
      const response = await api.get('/shop/count');
      return response.data;
    } catch (error) {
      // Return 0 if endpoint doesn't exist yet
      if (error.response?.status === 404) {
        return { count: 0 };
      }
      throw error.response?.data || error.message;
    }
  },

  // Get shop by ID
  getShopById: async (id) => {
    try {
      const response = await api.get(`/shop/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create shop
  createShop: async (shopData) => {
    try {
      const response = await api.post('/shop', shopData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update shop
  updateShop: async (id, shopData) => {
    try {
      const response = await api.put(`/shop/${id}`, shopData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete shop
  deleteShop: async (id) => {
    try {
      const response = await api.delete(`/shop/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default shopService;