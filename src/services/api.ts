import axios from 'axios';

const BASE_URL = 'http://172.20.10.13:5000'; 

export const api = {
  register: async (email: string, password: string, name: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, { email, password, name });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.error || 'Registration failed';
    }
  },

  // 2. LOGIN
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, { email, password });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.error || 'Login failed';
    }
  },

  // 3. UPDATE PROFILE
  updateProfile: async (email: string, updates: any) => {
    try {
      const response = await axios.put(`${BASE_URL}/users/${email}`, updates);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.error || 'Update failed';
    }
  },

  // 4. PLACE ORDER
  placeOrder: async (email: string, order: any) => {
    try {
      const response = await axios.post(`${BASE_URL}/orders`, { email, order });
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.error || 'Order failed';
    }
  }
};