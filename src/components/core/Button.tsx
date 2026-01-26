import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacityProps 
} from 'react-native';
import { colors } from '../../theme/colors';

// The "Contract" for using this button
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'outline'; // Restricts to only these two options
  isLoading?: boolean;
}

export const Button = ({ 
  title, 
  variant = 'primary', 
  isLoading = false, 
  style, 
  disabled,
  ...props 
}: ButtonProps) => {
  
  const isPrimary = variant === 'primary';
  
  // Dynamic Styles
  const containerStyle = [
    styles.container,
    isPrimary ? styles.primaryContainer : styles.outlineContainer,
    disabled || isLoading ? styles.disabled : null,
    style, // Allows overriding from outside if absolutely needed
  ];

  const textStyle = [
    styles.text,
    isPrimary ? styles.primaryText : styles.outlineText,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={isPrimary ? '#FFF' : colors.primary} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 8, // Slightly rounded, but still sharp enough for streetwear look
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%', // Takes full width of its parent
  },
  primaryContainer: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  outlineText: {
    color: colors.primary,
  },
});