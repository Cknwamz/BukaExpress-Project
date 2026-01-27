import React from 'react';
import { 
  ScrollView, 
  TouchableOpacity, 
  Text, 
  StyleSheet 
} from 'react-native';
import { useSettings } from '../../context/SettingsContext'; // <--- Import Brain

const CATEGORIES = ["All", "men's clothing", "jewelery", "electronics", "women's clothing"];

interface Props {
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export const CategoryList = ({ selectedCategory, onSelect }: Props) => {
  const { colors } = useSettings(); // <--- Get Dynamic Colors

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((cat) => {
        const isActive = selectedCategory === cat;
        return (
          <TouchableOpacity
            key={cat}
            style={[
              styles.chip,
              { 
                backgroundColor: isActive ? colors.primary : colors.surface,
                borderColor: isActive ? colors.primary : colors.border
              }
            ]}
            onPress={() => onSelect(cat)}
          >
            <Text 
              style={[
                styles.text,
                { 
                  // If active, text is white (or black if primary is white).
                  // If inactive, text is dynamic textLight.
                  color: isActive ? (colors.background === '#121212' ? '#000' : '#FFF') : colors.textLight 
                }
              ]}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});