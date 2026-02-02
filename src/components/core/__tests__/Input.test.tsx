import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';
import { SettingsProvider } from '../../../context/SettingsContext'; // <--- Import the Brain

describe('<Input />', () => {

  // Test 1: Does the label and placeholder show up?
  it('renders label and placeholder correctly', () => {
    // We wrap the Input inside the SettingsProvider so it can find the colors
    const { getByText, getByPlaceholderText } = render(
      <SettingsProvider>
        <Input 
          label="Email Address" 
          value="" 
          onChangeText={() => {}} 
          placeholder="user@example.com"
        />
      </SettingsProvider>
    );

    expect(getByText('Email Address')).toBeTruthy();
    expect(getByPlaceholderText('user@example.com')).toBeTruthy();
  });

  // Test 2: Does typing work?
  it('calls onChangeText when text is entered', () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText } = render(
      <SettingsProvider>
        <Input 
          label="Name" 
          value="" 
          onChangeText={mockOnChange} 
          placeholder="Enter Name"
        />
      </SettingsProvider>
    );

    const inputField = getByPlaceholderText('Enter Name');
    
    fireEvent.changeText(inputField, 'John');

    expect(mockOnChange).toHaveBeenCalledWith('John');
  });
});