import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Text, Button, View } from 'react-native';
import { UserProvider, useUser } from '../UserContext';

// 1. MOCK THE API
// We intercept the call to the backend and return a fake "Mongo-style" user
jest.mock('../../services/api', () => ({
  api: {
    login: jest.fn(() => Promise.resolve({ 
      _id: 'mongo_123', 
      name: 'Test User',
      email: 'test@example.com', 
      bio: 'I am a test user',
      phone: '1234567890',
      avatar: 'avatar.png',
      orders: [],
      wishlist: []
    })),
  },
}));

// 2. SPY COMPONENT
const TestAuthComponent = () => {
  const { user, login, logout } = useUser();

  return (
    <View>
      {/* Show 'No User' if null, or the email if logged in */}
      <Text testID="user-email">{user ? user.email : 'No User'}</Text>
      
      <Button 
        title="Login" 
        onPress={() => login('test@example.com', 'password123')} 
      />
      
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

describe('UserContext Logic', () => {

  it('logs in the user successfully', async () => {
    const { getByText, getByTestId } = render(
      <UserProvider>
        <TestAuthComponent />
      </UserProvider>
    );

    // 1. Initially logged out
    expect(getByTestId('user-email').props.children).toBe('No User');

    // 2. Click Login
    fireEvent.press(getByText('Login'));

    // 3. Wait for the "fake" API to finish and update state
    await waitFor(() => {
      expect(getByTestId('user-email').props.children).toBe('test@example.com');
    });
  });

  it('logs out the user', async () => {
    const { getByText, getByTestId } = render(
      <UserProvider>
        <TestAuthComponent />
      </UserProvider>
    );

    // 1. Log in first
    fireEvent.press(getByText('Login'));
    await waitFor(() => expect(getByTestId('user-email').props.children).toBe('test@example.com'));

    // 2. Log out
    fireEvent.press(getByText('Logout'));

    // 3. Verify state is cleared
    await waitFor(() => {
      expect(getByTestId('user-email').props.children).toBe('No User');
    });
  });
});