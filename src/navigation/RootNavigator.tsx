import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useSettings } from '../context/SettingsContext'; 

// Only import screens that are NOT in the tabs
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScrenn';
import { TabNavigator } from './TabNavigator';
import { CheckoutScreen } from '../screens/CheckoutScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { colors, darkMode } = useSettings(); 

  return (
    <>
      <StatusBar style={darkMode ? 'light' : 'dark'} backgroundColor={colors.surface} />
      
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerTintColor: colors.primary,
          headerBackTitle: '', 
          headerStyle: { backgroundColor: colors.surface },
          headerShadowVisible: false,
          headerTitleStyle: { color: colors.text }
        }}
      >
        {/* Auth Screens (No Tabs) */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        
        {/* Main App (Has Tabs inside) */}
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        
        {/* Checkout (No Tabs - Focused Flow) */}
        <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
      </Stack.Navigator>
    </>
  );
};