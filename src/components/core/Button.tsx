import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  ActivityIndicator 
} from 'react-native';
import { colors } from '../../theme/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  style?: ViewStyle;
  loading?: boolean; // <--- This fixes the red line
}

export const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  style,
  loading = false 
}: ButtonProps) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        styles[variant], 
        style,
        loading && styles.disabled // Dim the button when loading
      ]} 
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading} // Prevent double-clicking
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : '#FFF'} />
      ) : (
        <Text style={[styles.text, variant === 'outline' && styles.textOutline]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  textOutline: {
    color: colors.primary,
  },
});