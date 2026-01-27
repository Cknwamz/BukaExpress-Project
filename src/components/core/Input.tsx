import React from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TextInputProps 
} from 'react-native';
import { useSettings } from '../../context/SettingsContext'; // <--- Import Brain

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

export const Input = ({ label, error, style, ...props }: Props) => {
  const { colors } = useSettings(); // <--- Get Dynamic Colors

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TextInput 
        style={[
          styles.input, 
          { 
            backgroundColor: colors.surface, 
            color: colors.text, 
            borderColor: colors.border 
          },
          error ? { borderColor: colors.error } : null,
          style
        ]}
        placeholderTextColor={colors.textLight}
        {...props}
      />
      {error && <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});