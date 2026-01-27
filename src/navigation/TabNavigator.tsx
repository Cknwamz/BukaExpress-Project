import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { CartScreen } from '../screens/CartScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ProductDetailsScreen } from '../screens/ProductDetailsScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { WishlistScreen } from '../screens/WishListScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { ShippingAddressScreen } from '../screens/ShippingAddressScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicyScreen';

// Types & Context
import { RootStackParamList, RootTabParamList } from './types'; // <--- IMPORTED TYPES
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

// 1. TYPED NAVIGATORS (Fixes the red lines)
const Tab = createBottomTabNavigator<RootTabParamList>();
const HomeStack = createNativeStackNavigator<RootStackParamList>(); 
const ProfileStack = createNativeStackNavigator<RootStackParamList>();

// --- HOME STACK (Home -> Product Details) ---
const HomeStackScreen = () => {
  const { colors } = useSettings();
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        headerTitle: '',
        headerBackTitle: ''
      }}
    >
      <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </HomeStack.Navigator>
  );
};

// --- PROFILE STACK (Profile -> Settings, Orders, etc.) ---
const ProfileStackScreen = () => {
  const { colors } = useSettings();
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        headerTitleStyle: { color: colors.text },
        headerBackTitle: ''
      }}
    >
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="Orders" component={OrdersScreen} options={{ title: 'My Orders' }} />
      <ProfileStack.Screen name="Wishlist" component={WishlistScreen} options={{ title: 'My Wishlist' }} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile' }} />
      <ProfileStack.Screen name="ShippingAddress" component={ShippingAddressScreen} options={{ title: 'Addresses' }} />
      <ProfileStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{ title: 'Privacy Policy' }} />
    </ProfileStack.Navigator>
  );
};

// --- MAIN TABS ---
export const TabNavigator = () => {
  const { count } = useCart();
  const { colors } = useSettings();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ focused }) => {
          let iconName = '';
          if (route.name === 'Home') iconName = '🏠';
          if (route.name === 'Cart') iconName = '🛒';
          if (route.name === 'Profile') iconName = '👤';
          return <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>{iconName}</Text>;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      
      <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ 
          tabBarBadge: count > 0 ? count : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.primary, color: '#FFF' }
        }} 
      />
      
      <Tab.Screen name="Profile" component={ProfileStackScreen} />
    </Tab.Navigator>
  );
};