import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { colors } from '../../theme/colors';
import { Product } from '../../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // (Screen width - padding) / 2 columns

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export const ProductCard = ({ product, onPress }: ProductCardProps) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.9}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: product.image }} 
          style={styles.image} 
          resizeMode="contain" 
        />
      </View>
      
      <View style={styles.details}>
        <Text style={styles.brand} numberOfLines={1}>
          {product.category.toUpperCase()}
        </Text>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.price}>
          ${product.price.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    marginBottom: 16,
    borderRadius: 0, // Sharp corners for streetwear vibe
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 160,
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  brand: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textLight,
    marginBottom: 4,
    letterSpacing: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    height: 36, // Fixed height for 2 lines to align grid
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
});