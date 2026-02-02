import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
// ✅ Keep the path that works for your structure
import { ProductCard } from '../product/ProductCard'; 

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

describe('<ProductCard />', () => {
  
  // 2. FAKE DATA
  const mockProduct = {
    id: 1,
    title: 'Nike Air Max', // Matches your component code
    price: 120.00,
    image: 'https://example.com/shoe.png',
    description: 'Cool shoe',
    category: 'Shoes',
    rating: 4.5,
    reviews: 10
  } as any; 

  it('renders product name and price', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} onPress={() => {}} />
    );

    expect(getByText('Nike Air Max')).toBeTruthy();
    // Your component code formats price like: ${product.price.toFixed(2)}
    // So 120.00 becomes "$120.00"
    expect(getByText('$120.00')).toBeTruthy(); 
  });

  it('calls onPress when clicked', () => {
    // 1. Create a "Spy" function
    const mockOnPress = jest.fn();

    const { getByText } = render(
      // 2. Pass the spy to the component
      <ProductCard product={mockProduct} onPress={mockOnPress} />
    );

    const card = getByText('Nike Air Max');
    
    // 3. Simulate the tap
    fireEvent.press(card);

    // 4. Check if the spy was alerted
    expect(mockOnPress).toHaveBeenCalledTimes(1); 
  });
});