import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SearchBar } from '../SearchBar';

// 🛠️ MOCK SETTINGS (To prevent the "Provider" crash)
jest.mock('../../../context/SettingsContext', () => ({
  useSettings: () => ({
    colors: {
      surface: '#F5F5F5',
      text: '#000000',
      textLight: '#888888',
      border: '#E0E0E0',
      primary: '#0000FF',
    },
    darkMode: false,
  }),
}));

describe('<SearchBar />', () => {

  it('renders the placeholder text', () => {
    const { getByPlaceholderText } = render(
      <SearchBar 
        value="" 
        onChangeText={() => {}} 
        onClear={() => {}} 
      />
    );

    // Most search bars say "Search..." or "Search products"
    // If this fails, check what your actual placeholder text is!
    expect(getByPlaceholderText(/Search/i)).toBeTruthy();
  });

  it('calls onChangeText when typing', () => {
    const mockOnChange = jest.fn(); // Spy function 🕵️‍♂️

    const { getByPlaceholderText } = render(
      <SearchBar 
        value="" 
        onChangeText={mockOnChange} 
        onClear={() => {}} 
      />
    );

    const input = getByPlaceholderText(/Search/i);
    
    // Simulate typing "Nike"
    fireEvent.changeText(input, 'Nike');

    // Did the spy see it?
    expect(mockOnChange).toHaveBeenCalledWith('Nike');
  });
});