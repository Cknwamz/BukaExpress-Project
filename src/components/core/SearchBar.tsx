import React from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  Text 
} from 'react-native';
import { useSettings } from '../../context/SettingsContext'; // <--- Import Brain

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

export const SearchBar = ({ value, onChangeText, onClear }: Props) => {
  const { colors } = useSettings(); // <--- Get Dynamic Colors

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.surface, // Dark Grey in Dark Mode
        borderColor: colors.border 
      }
    ]}>
      <Text style={[styles.icon, { color: colors.text }]}>🔍</Text>
      <TextInput
        style={[styles.input, { color: colors.text }]} // White text in Dark Mode
        placeholder="Search products..."
        placeholderTextColor={colors.textLight}
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear}>
          <Text style={[styles.clear, { color: colors.textLight }]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    marginBottom: 16,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  clear: {
    fontSize: 16,
    padding: 4,
  },
});