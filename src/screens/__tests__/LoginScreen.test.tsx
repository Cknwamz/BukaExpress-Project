import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LoginScreen } from '../LoginScreen';

// 1. MOCK NAVIGATION
const mockNavigate = jest.fn();
const mockReplace = jest.fn();
const mockProps: any = {
  navigation: { navigate: mockNavigate, replace: mockReplace },
};

// 2. MOCK SETTINGS (To match your useSettings hook)
jest.mock('../../context/SettingsContext', () => ({
  useSettings: () => ({
    colors: { 
      primary: 'blue', 
      background: 'white', 
      error: 'red',
      surface: 'gray',
      textLight: 'black',
      border: 'black'
    }
  }),
}));

// 3. MOCK USER CONTEXT (To match your useUser hook)
const mockLogin = jest.fn();
jest.mock('../../context/UserContext', () => ({
  useUser: () => ({
    login: mockLogin,
  }),
}));

describe('<LoginScreen />', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows validation error for invalid email domain', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen {...mockProps} />);

    const emailInput = getByPlaceholderText('name@gmail.com');
    
    // Type an email with a banned domain (e.g. not gmail/outlook)
    fireEvent.changeText(emailInput, 'hacker@badsite.com');
    
    // Trigger validation (onBlur)
    fireEvent(emailInput, 'blur');

    // Check if error message appears
    expect(getByText(/Must use:/)).toBeTruthy();
  });

  it('calls login and redirects when inputs are valid', async () => {
    // Setup successful login response
    mockLogin.mockResolvedValueOnce(true);

    const { getByPlaceholderText, getByText } = render(<LoginScreen {...mockProps} />);

    // 1. Fill Valid Email
    fireEvent.changeText(getByPlaceholderText('name@gmail.com'), 'john@gmail.com');
    
    // 2. Fill Valid Password (Needs special char & >8 chars)
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'Password123!');

    // 3. Press Login
    fireEvent.press(getByText('Sign In'));

    // 4. Verify Login was called with correct data
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('john@gmail.com', 'Password123!');
    });

    // 5. Verify Navigation to 'Tabs'
    expect(mockReplace).toHaveBeenCalledWith('Tabs');
  });
});