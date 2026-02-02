import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
// Note: Keeping filename as per your structure (SignupScrenn)
import { SignupScreen } from '../SignupScrenn'; 
import { HomeScreen } from '../HomeScreen';
import { ProductDetailsScreen } from '../ProductDetailsScreen';
import { CheckoutScreen } from '../CheckoutScreen';

// =================================================================
// 1. GLOBAL MOCKS (The Setup)
// =================================================================

// Navigation Mock (Hooks)
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      replace: jest.fn(),
      goBack: jest.fn(),
      addListener: jest.fn(),
      isFocused: jest.fn(() => true),
    }),
    useRoute: () => ({
      params: { productId: 99 },
    }),
  };
});

// Mock Settings Context
jest.mock('../../context/SettingsContext', () => ({
  useSettings: () => ({
    colors: { 
      background: '#FFFFFF', text: '#000000', primary: '#0000FF', 
      surface: '#F5F5F5', error: 'red', border: '#E0E0E0', textLight: '#888'
    },
    darkMode: false,
  }),
}));

// Mock User Context
const mockRegister = jest.fn();
jest.mock('../../context/UserContext', () => ({
  useUser: () => ({
    register: mockRegister,
    user: null,
  }),
}));

// Mock Cart Context
const mockAddToCart = jest.fn();
const mockPlaceOrder = jest.fn();
const mockIsInWishlist = jest.fn();
jest.mock('../../context/CartContext', () => ({
  useCart: () => ({
    addToCart: mockAddToCart,
    placeOrder: mockPlaceOrder,
    isInWishlist: mockIsInWishlist,
    items: [],
    total: 150.00,
  }),
}));

// Mock Products Hook
jest.mock('../../hooks/useProducts', () => ({
  useProducts: () => ({
    products: [
      { id: 1, title: 'Test Shoe', price: 120, image: 'shoe.png', category: 'Shoes' },
    ],
    loading: false,
    error: null,
    refetch: jest.fn()
  }),
}));

// Mock Product Service
jest.mock('../../services/productService', () => ({
  productService: {
    getProductById: jest.fn(() => Promise.resolve({
      id: 99,
      title: 'Detailed Shoe',
      price: 200,
      description: 'Best shoe ever',
      image: 'detail.png',
      category: 'Luxury'
    })),
  },
}));

// =================================================================
// 2. THE TEST SUITE
// =================================================================

describe('App Critical Flows', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // -----------------------------------------------------------------
  // FLOW 1: SIGNUP (Registration)
  // -----------------------------------------------------------------
  describe('1. Signup Flow', () => {
    it('validates password rules and registers user', async () => {
      mockRegister.mockResolvedValueOnce(true);

      // 🛑 FIX: Pass dummy 'navigation' and 'route' props to satisfy the component
      const props: any = { navigation: { replace: jest.fn(), navigate: jest.fn() }, route: {} };
      const { getByPlaceholderText, getAllByText, getByTestId } = render(<SignupScreen {...props} />);

      // 1. Fill Form
      fireEvent.changeText(getByPlaceholderText('John Doe'), 'New User');
      fireEvent.changeText(getByPlaceholderText('name@example.com'), 'new@test.com');
      
      // 2. Fill Passwords
      fireEvent.changeText(getByTestId('password-input'), 'Password123!'); 
      fireEvent.changeText(getByTestId('confirm-input'), 'Password123!');

      // 3. Submit (Handle multiple "Create Account" texts)
      const buttons = getAllByText('Create Account');
      // The button is usually the second one (Header is first)
      fireEvent.press(buttons[1]);

      // 4. Verify
      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith('new@test.com', 'Password123!', 'New User');
      });
    });
  });

  // -----------------------------------------------------------------
  // FLOW 2: HOME SCREEN (Browsing)
  // -----------------------------------------------------------------
  describe('2. Home Screen', () => {
    it('renders products', () => {
      // HomeScreen doesn't take props, so standard render is fine
      const { getByText } = render(<HomeScreen />);
      expect(getByText('Test Shoe')).toBeTruthy();
      expect(getByText('$120.00')).toBeTruthy();
    });
  });

  // -----------------------------------------------------------------
  // FLOW 3: PRODUCT DETAILS (Add to Cart)
  // -----------------------------------------------------------------
  describe('3. Product Details Screen', () => {
    it('loads product info and adds to cart', async () => {
      // 🛑 FIX: Explicitly pass 'route.params' because the component reads from Props, not just Hooks
      const props: any = { 
        navigation: {}, 
        route: { params: { productId: 99 } } 
      };

      const { getByText } = render(<ProductDetailsScreen {...props} />);

      await waitFor(() => {
        expect(getByText('Detailed Shoe')).toBeTruthy();
      });

      fireEvent.press(getByText('Add to Cart'));
      expect(mockAddToCart).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------
  // FLOW 4: CHECKOUT (Payment)
  // -----------------------------------------------------------------
  describe('4. Checkout Screen', () => {
    it('validates inputs and places order', async () => {
      const { getByText, getByPlaceholderText } = render(<CheckoutScreen />);

      // 1. Fill Info
      fireEvent.changeText(getByPlaceholderText('John Doe'), 'Buyer Name');
      fireEvent.changeText(getByPlaceholderText('123 Street Name'), '123 Test St');
      fireEvent.changeText(getByPlaceholderText('Lagos'), 'Lagos');
      fireEvent.changeText(getByPlaceholderText('0000 0000 0000 0000'), '1234567812345678');
      fireEvent.changeText(getByPlaceholderText('MM/YY'), '12/30');
      fireEvent.changeText(getByPlaceholderText('123'), '111');

      // 2. Pay
      fireEvent.press(getByText('Pay $150.00'));

      // 3. Verify
      await waitFor(() => {
        expect(mockPlaceOrder).toHaveBeenCalled();
      });
    });
  });
});