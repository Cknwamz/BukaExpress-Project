import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '../theme/colors';

// Define the shape of our context
interface SettingsContextType {
  darkMode: boolean;
  notifications: boolean;
  emailPromos: boolean;
  colors: typeof lightColors; // Exposes the active color palette
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
  toggleEmailPromos: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailPromos, setEmailPromos] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load settings on startup
  useEffect(() => {
    loadSettings();
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    if (!loading) saveSettings();
  }, [darkMode, notifications, emailPromos]);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('@settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setDarkMode(parsed.darkMode ?? false);
        setNotifications(parsed.notifications ?? true);
        setEmailPromos(parsed.emailPromos ?? false);
      }
    } catch (e) {
      console.error('Failed to load settings', e);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    const settings = { darkMode, notifications, emailPromos };
    await AsyncStorage.setItem('@settings', JSON.stringify(settings));
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const toggleNotifications = () => setNotifications(prev => !prev);
  const toggleEmailPromos = () => setEmailPromos(prev => !prev);

  // The Magic: This decides which colors to serve
  const activeColors = darkMode ? darkColors : lightColors;

  return (
    <SettingsContext.Provider value={{
      darkMode,
      notifications,
      emailPromos,
      colors: activeColors, // <--- The App uses this!
      toggleDarkMode,
      toggleNotifications,
      toggleEmailPromos
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};