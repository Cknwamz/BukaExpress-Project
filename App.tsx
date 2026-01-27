import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { CartProvider } from './src/context/CartContext';
import { UserProvider } from './src/context/UserContext';
import { SettingsProvider } from './src/context/SettingsContext'; // <--- Import

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider> 
        <UserProvider> 
          <CartProvider>
            <NavigationContainer>
              <StatusBar style="auto" /> 
              {/* style="auto" lets the phone decide based on dark mode */}
              <RootNavigator />
            </NavigationContainer>
          </CartProvider>
        </UserProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}