import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('<Button />', () => {
 
  it('renders the correct title', () => {
    const { getByText } = render(<Button title="Test Button" onPress={() => {}} />);
    
  
    expect(getByText('Test Button')).toBeTruthy();
  });

 
  it('calls the onPress function when clicked', () => {
    const mockOnPress = jest.fn(); // Creates a fake function to track clicks
    const { getByText } = render(<Button title="Click Me" onPress={mockOnPress} />);
    
    const button = getByText('Click Me');
    fireEvent.press(button); // Simulates a user tap

   
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});