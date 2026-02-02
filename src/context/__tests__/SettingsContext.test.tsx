import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Text, Button, View } from 'react-native';
import { SettingsProvider, useSettings } from '../SettingsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  // We make sure these return Promises so the code waits correctly
  getItem: jest.fn(() => Promise.resolve(null)), 
  setItem: jest.fn(() => Promise.resolve()),
}));

// 2. Mock Colors
jest.mock('../../theme/colors', () => ({
  lightColors: { background: '#FFFFFF', text: '#000000' },
  darkColors: { background: '#000000', text: '#FFFFFF' },
}));

// 3. Spy Component
const TestSettingsComponent = () => {
  const { darkMode, toggleDarkMode, colors } = useSettings();

  return (
    <View>
      <Text testID="mode-text">{darkMode ? 'Dark' : 'Light'}</Text>
      <Text testID="bg-color">{colors.background}</Text>
      <Button title="Toggle" onPress={toggleDarkMode} />
    </View>
  );
};

describe('SettingsContext', () => {
  it('toggles dark mode and updates colors', async () => {
    const { getByText, getByTestId } = render(
      <SettingsProvider>
        <TestSettingsComponent />
      </SettingsProvider>
    );

    // 🛑 THE FIX: Wait for the initial load to finish!
    // We wait until AsyncStorage.getItem has been called.
    // This ensures 'loading' becomes false inside your Context.
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });

    // 1. Check Initial State (Light Mode)
    expect(getByTestId('mode-text').props.children).toBe('Light');

    // 2. Toggle Mode
    fireEvent.press(getByText('Toggle'));

    // 3. Check Updated State (Dark Mode)
    expect(getByTestId('mode-text').props.children).toBe('Dark');

    // 4. Verify it saved to disk
    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });
});