import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { productService } from '../services/productService';
import { Product } from '../types';
import { colors } from '../theme/colors';
import { Button } from '../components/core/Button';
import { useCart } from '../context/CartContext'; // <--- Import Hook

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

export const ProductDetailsScreen = ({ route }: Props) => {
  const { productId } = route.params;
  const { addToCart } = useCart(); // <--- Get the function from the brain
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const data = await productService.getProductById(productId);
      setProduct(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      Alert.alert('Success', 'Added to cart!'); // Simple feedback
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  
  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Product not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
           <Image 
             source={{ uri: product.image }} 
             style={styles.image}
             resizeMode="contain"
           />
        </View>
        <View style={styles.details}>
          <Text style={styles.brand}>{product.category}</Text>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button 
          title="Add to Cart" 
          onPress={handleAddToCart} // <--- Connected here
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingBottom: 100 },
  imageContainer: {
    height: 300,
    width: '100%',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  image: { width: '100%', height: '100%' },
  details: { paddingHorizontal: 24 },
  brand: { fontSize: 12, fontWeight: '700', color: colors.primary, letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 12, lineHeight: 32 },
  price: { fontSize: 24, color: colors.primary, marginBottom: 24, fontWeight: '600' },
  description: { fontSize: 16, color: colors.secondary, lineHeight: 24 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.surface, padding: 24, borderTopWidth: 1, borderTopColor: colors.border },
});