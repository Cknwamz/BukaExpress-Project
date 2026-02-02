import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { CartScreen } from '../CartScreen';
import { ProfileScreen } from '../ProfileScreen';
import { EditProfileScreen } from '../EditProfileScreen';
import { SettingsScreen } from '../SettingsScreen';
import { WishlistScreen } from '../WishListScreen'; 
import { OrdersScreen } from '../OrdersScreen';
import { ShippingAddressScreen } from '../ShippingAddressScreen';

// =================================================================
// 1. GLOBAL MOCKS
// =================================================================

// Navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      replace: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
    }),
  };
});

// Settings
const mockToggleDark = jest.fn();
jest.mock('../../context/SettingsContext', () => ({
  useSettings: () => ({
    colors: { 
      background: '#FFF', text: '#000', primary: 'blue', 
      surface: '#eee', error: 'red', border: '#ccc', textLight: '#888'
    },
    darkMode: false,
    toggleDarkMode: mockToggleDark,
    notifications: true,
    toggleNotifications: jest.fn(),
    emailPromos: false,
    toggleEmailPromos: jest.fn(),
  }),
}));

// User Context
const mockLogout = jest.fn();
const mockUpdateUser = jest.fn();
jest.mock('../../context/UserContext', () => ({
  useUser: () => ({
    user: { 
      name: 'Test User', 
      email: 'test@test.com', 
      bio: 'Test Bio',
      phone: '1234567890',
      avatar: 'https://fake.com/img.png'
    },
    logout: mockLogout,
    updateUser: mockUpdateUser,
  }),
}));

// Cart Context
const mockRemoveFromCart = jest.fn();
const mockClearSession = jest.fn();
const mockRemoveFromWishlist = jest.fn();
const mockAddToCart = jest.fn();
jest.mock('../../context/CartContext', () => ({
  useCart: () => ({
    items: [
      { id: 1, title: 'Cart Item 1', price: 50, quantity: 1, image: 'img.png', category: 'Test' }
    ],
    wishlist: [
      { id: 2, title: 'Wish Item 1', price: 100, image: 'img.png' }
    ],
    orders: [
      { id: 'ORD-1', date: '2026-01-20', total: 150, status: 'Delivered', items: [{}, {}] }
    ],
    total: 50.00,
    removeFromCart: mockRemoveFromCart,
    clearSession: mockClearSession,
    removeFromWishlist: mockRemoveFromWishlist,
    addToCart: mockAddToCart,
  }),
}));

// =================================================================
// 2. THE TEST SUITE
// =================================================================

describe('Secondary App Flows', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers(); // 👈 Enable Time Travel for loading spinners
  });

  afterEach(() => {
    jest.useRealTimers(); // Cleanup
  });

  // -----------------------------------------------------------------
  // 1. CART SCREEN
  // -----------------------------------------------------------------
  test('CartScreen renders items and removes them', () => {
    const { getByText, getAllByText } = render(<CartScreen />);
    
    // Check Item Title
    expect(getByText('Cart Item 1')).toBeTruthy();
    
    // 🛑 FIX: Use getAllByText because "$50.00" appears twice (Item Price & Total Price)
    const prices = getAllByText('$50.00');
    expect(prices.length).toBeGreaterThan(0);
    
    // Click Remove
    fireEvent.press(getByText('Remove'));
    expect(mockRemoveFromCart).toHaveBeenCalledWith(1);
  });

  // -----------------------------------------------------------------
  // 2. PROFILE SCREEN
  // -----------------------------------------------------------------
  test('ProfileScreen renders info and handles logout', async () => {
    const { getByText } = render(<ProfileScreen />);

    expect(getByText('Test User')).toBeTruthy();
    expect(getByText('test@test.com')).toBeTruthy();

    fireEvent.press(getByText('Log Out'));

    await waitFor(() => {
      expect(mockClearSession).toHaveBeenCalled();
      expect(mockLogout).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------
  // 3. EDIT PROFILE
  // -----------------------------------------------------------------
  test('EditProfileScreen updates user info', async () => {
    const props: any = { navigation: { goBack: jest.fn() } };
    const { getByText, getByDisplayValue } = render(<EditProfileScreen {...props} />);

    const nameInput = getByDisplayValue('Test User');
    fireEvent.changeText(nameInput, 'Updated Name');
    
    fireEvent.press(getByText('Save Changes'));

    // 🛑 FIX: Fast forward time so the 1-second "simulated network request" finishes
    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith(expect.objectContaining({ name: 'Updated Name' }));
    });
  });

  // -----------------------------------------------------------------
  // 4. SETTINGS SCREEN
  // -----------------------------------------------------------------
  test('SettingsScreen renders toggles', () => {
    const { getByText } = render(<SettingsScreen />);
    expect(getByText('Dark Mode')).toBeTruthy();
    expect(getByText('Push Notifications')).toBeTruthy();
  });

  // -----------------------------------------------------------------
  // 5. WISHLIST SCREEN
  // -----------------------------------------------------------------
  test('WishlistScreen moves item to cart', () => {
    const { getByText } = render(<WishlistScreen />);

    expect(getByText('Wish Item 1')).toBeTruthy();

    fireEvent.press(getByText('Add to Cart'));
    
    expect(mockAddToCart).toHaveBeenCalled();
    expect(mockRemoveFromWishlist).toHaveBeenCalled();
  });

  // -----------------------------------------------------------------
  // 6. ORDERS SCREEN
  // -----------------------------------------------------------------
  test('OrdersScreen renders history', () => {
    const { getByText } = render(<OrdersScreen />);
    expect(getByText('Order #ORD-1')).toBeTruthy();
    expect(getByText('Delivered')).toBeTruthy();
  });

  // -----------------------------------------------------------------
  // 7. SHIPPING ADDRESS
  // -----------------------------------------------------------------
  test('ShippingAddressScreen inputs and saves', async () => {
    const props: any = { navigation: { goBack: jest.fn() } };
    const { getByText, getByDisplayValue } = render(<ShippingAddressScreen {...props} />);

    const addressInput = getByDisplayValue('123 Babcock Way');
    fireEvent.changeText(addressInput, 'New Address 456');

    // 1. Click Save
    fireEvent.press(getByText('Save Address'));

    // 2. Button goes to "Loading" state (Text disappears)
    // 🛑 FIX: Force the 1-second timeout to complete immediately
    act(() => {
      jest.runAllTimers();
    });

    // 3. Loading finishes -> Text reappears -> Alert shows (Mocked)
    // We check that the text came back, proving the loading cycle finished
    await waitFor(() => {
      expect(getByText('Save Address')).toBeTruthy(); 
    });
  });
});