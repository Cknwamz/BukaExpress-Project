import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
// ✅ Keep your correct path
import { CategoryList } from '../home/CategoryList'; 

// 1. MOCK SETTINGS
jest.mock('../../context/SettingsContext', () => ({
  useSettings: () => ({
    colors: {
      text: '#000000',
      primary: '#0000FF',
      background: '#FFFFFF',
      surface: '#F5F5F5',
      textLight: '#888888',
    },
    darkMode: false,
  }),
}));

describe('<CategoryList />', () => {

  it('renders default categories correctly', () => {
    // ⚠️ The component uses hardcoded categories, so we don't pass a list!
    // It also changes "electronics" to "Electronics", so we check for that.
    const { getByText } = render(
      <CategoryList 
        selectedCategory="All" 
        onSelect={() => {}} // Prop name is 'onSelect'
      />
    );

    expect(getByText('All')).toBeTruthy();
    expect(getByText("Men's clothing")).toBeTruthy(); // It capitalizes the text
    expect(getByText('Electronics')).toBeTruthy();
  });

  it('calls onSelect when a category is pressed', () => {
    const mockSelect = jest.fn();

    const { getByText } = render(
      <CategoryList 
        selectedCategory="All" 
        onSelect={mockSelect} 
      />
    );

    // 1. Find the button (Text is Capitalized)
    const jeweleryBtn = getByText('Jewelery');
    
    // 2. Press it
    fireEvent.press(jeweleryBtn);

    // 3. Check the result
    // Note: The component sends back the lowercase ID ("jewelery") 
    // even though it displays "Jewelery".
    expect(mockSelect).toHaveBeenCalledWith('jewelery');
  });
});