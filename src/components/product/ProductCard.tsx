import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { Product } from '../../types';
import { useSettings } from '../../context/SettingsContext'; // <--- Import Brain

const { width } = Dimensions.get('window');
const cardWidth = (width - 48 - 15) / 2; 

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard = ({ product, onPress }: ProductCardProps) => {
  const { colors } = useSettings(); // <--- Get Dynamic Colors

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { 
          backgroundColor: colors.surface, // Dynamic Background
          borderColor: colors.border     // Dynamic Border
        }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.imageContainer, { backgroundColor: '#FFFFFF' }]}> 
        {/* Images usually look best on white, even in dark mode. 
            You can change this to colors.surface if you prefer dark box for images. */}
        <Image 
          source={{ uri: product.image }} 
          style={styles.image} 
          resizeMode="contain" 
        />
      </View>
      
      <View style={styles.details}>
        <Text 
          style={[styles.category, { color: colors.textLight }]} 
          numberOfLines={1}
        >
          {product.category}
        </Text>
        <Text 
          style={[styles.title, { color: colors.text }]} 
          numberOfLines={2}
        >
          {product.title}
        </Text>
        <Text style={[styles.price, { color: colors.primary }]}>
          ${product.price.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    // Removed shadow for cleaner dark mode look
  },
  imageContainer: {
    height: 140,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    padding: 12,
  },
  category: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    height: 36, 
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
  },
});