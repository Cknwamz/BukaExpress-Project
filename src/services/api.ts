import axios from 'axios';

// ✅ Your specific IPv4 address
const BASE_URL = 'http://192.168.2.17:5000'; 

export const api = {
  // 1. REGISTER
  // Updated to accept name
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
  }
};