import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';
import { api } from '../services/api'; 

// 1. Define the User Shape (Matches MongoDB)
interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  phone: string;
  avatar: string;
  orders: any[];
  wishlist: any[];
}

// 2. Define the Context Shape
interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>; // Updated
  updateUser: (updates: Partial<User>) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // --- ACTIONS ---

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await api.login(email, password);
      setUser(userData);
    } catch (error: any) {
      console.error('Login Error:', error);
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Pass name to API
      const userData = await api.register(email, password, name);
      setUser(userData);
    } catch (error: any) {
      console.error('Registration Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    setLoading(true);
    try {
      const updatedUser = await api.updateProfile(user.email, updates as any);
      setUser(updatedUser);
    } catch (error: any) {
      console.error('Update Error:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, register, updateUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};