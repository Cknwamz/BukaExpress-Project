import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Text, Button, View } from 'react-native';
// ✅ Import the Provider and Hook
import { CartProvider, useCart } from '../CartContext'; 

jest.mock('../UserContext', () => ({
  useUser: () => ({ user: { email: 'test@test.com' } }),
}));

jest.mock('../../services/api', () => ({
  api: {
    placeOrder: jest.fn(),
  },
}));


const TestCartComponent = () => {
  const { items, addToCart, removeFromCart, total } = useCart();

  const demoProduct = {
    id: 99, // ✅ Changed to Number to match your interface
    title: 'Test Shoe',
    price: 100,
    image: 'test.png',
    category: 'shoes',
    description: 'test',
    rating: 5,
    reviews: 10
  };

  return (
    <View>
      {/* We display the length of 'items' to check if add/remove works */}
      <Text testID="cart-count">{items.length}</Text>
      
      {/* We display 'total' to check if math works */}
      <Text testID="total-price">{total}</Text>
      
      <Button title="Add Item" onPress={() => addToCart(demoProduct)} />
      <Button title="Remove Item" onPress={() => removeFromCart(99)} />
    </View>
  );
};

describe('CartContext Logic', () => {
  
  it('adds an item and updates total price', async () => {
    const { getByText, getByTestId } = render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    // 1. Initial State: 0 items
    expect(getByTestId('cart-count').props.children).toBe(0);

    // 2. Add Item
    fireEvent.press(getByText('Add Item'));

    // 3. Wait for update (AsyncStorage might cause a tiny delay)
    await waitFor(() => {
      expect(getByTestId('cart-count').props.children).toBe(1);
    });
    
    // 4. Check Total (Should be 100)
    expect(getByTestId('total-price').props.children).toBe(100);
  });

  it('removes an item', async () => {
    const { getByText, getByTestId } = render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    // 1. Add item first
    fireEvent.press(getByText('Add Item'));
    await waitFor(() => expect(getByTestId('cart-count').props.children).toBe(1));

    // 2. Remove item
    fireEvent.press(getByText('Remove Item'));

    // 3. Verify it's gone
    await waitFor(() => {
      expect(getByTestId('cart-count').props.children).toBe(0);
    });
  });
});