import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';
import { api } from '../services/api'; 
import { useUser } from './UserContext'; 

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Delivered';
}

interface CartContextType {
  items: CartItem[];
  wishlist: Product[];
  orders: Order[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  placeOrder: () => Promise<void>; 
  total: number;
  count: number;
  loading: boolean;
  clearSession: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser(); 
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. LOAD DATA ON STARTUP
  useEffect(() => {
    loadData();
  }, []);

  // 2. SAVE DATA WHENEVER IT CHANGES
  useEffect(() => {
    if (!loading) {
      saveData();
    }
  }, [items, wishlist, orders]);

  const loadData = async () => {
    try {
      const [savedCart, savedWishlist, savedOrders] = await Promise.all([
        AsyncStorage.getItem('@cart'),
        AsyncStorage.getItem('@wishlist'),
        AsyncStorage.getItem('@orders')
      ]);

      if (savedCart) setItems(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('@cart', JSON.stringify(items));
      await AsyncStorage.setItem('@wishlist', JSON.stringify(wishlist));
      await AsyncStorage.setItem('@orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save data', e);
    }
  };

  const clearSession = async () => {
    try {
      setItems([]);
      setWishlist([]);
      setOrders([]);
      await AsyncStorage.multiRemove(['@cart', '@wishlist', '@orders']);
    } catch (e) {
      console.error('Failed to clear session', e);
    }
  };

  // --- CART LOGIC ---
  const addToCart = (product: Product) => {
    setItems(current => {
      const existing = current.find(item => item.id === product.id);
      if (existing) {
        return current.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setItems(current => current.filter(item => item.id !== id));
  };

  // --- WISHLIST LOGIC ---
  const addToWishlist = (product: Product) => {
    setWishlist(current => {
      if (current.find(item => item.id === product.id)) return current;
      return [...current, product];
    });
  };

  const removeFromWishlist = (id: number) => {
    setWishlist(current => current.filter(item => item.id !== id));
  };

  const isInWishlist = (id: number) => {
    return wishlist.some(item => item.id === id);
  };

  // --- ORDER LOGIC ---
  const placeOrder = async () => {
    if (items.length === 0) return;

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date().toLocaleDateString(),
      items: [...items],
      total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'Processing'
    };

    // 1. Update Local State (Instant Feedback)
    setOrders(prev => [newOrder, ...prev]);
    setItems([]); 

    // 2. Send to Backend (If user is logged in)
    if (user?.email) {
      try {
        await api.placeOrder(user.email, newOrder);
        console.log('Order saved to MongoDB!');
      } catch (error) {
        console.error('Failed to sync order to DB', error);
      }
    }
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, wishlist, orders, 
      addToCart, removeFromCart, 
      addToWishlist, removeFromWishlist, isInWishlist,
      placeOrder, total, count, loading,
      clearSession
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};