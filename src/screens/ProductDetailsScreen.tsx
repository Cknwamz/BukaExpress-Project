import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Image, 
  Alert, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { productService } from '../services/productService';
import { Product } from '../types';
import { Button } from '../components/core/Button';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext'; // <--- Import Brain

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

export const ProductDetailsScreen = ({ route }: Props) => {
  const { productId } = route.params;
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const { colors } = useSettings(); // <--- Get Dynamic Colors
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const isLiked = isInWishlist(productId);

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
      Alert.alert('Success', 'Added to cart!');
    }
  };

  const toggleWishlist = () => {
    if (!product) return;
    if (isLiked) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Product not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Image Container */}
        <View style={[styles.imageContainer, { backgroundColor: colors.surface }]}>
           <View style={{ width: '90%', height: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 10 }}>
             <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
           </View>
           
           <TouchableOpacity 
             style={[styles.heartButton, { backgroundColor: colors.surface, shadowColor: colors.text }]} 
             onPress={toggleWishlist}
           >
             <Text style={styles.heartIcon}>{isLiked ? '♥' : '♡'}</Text>
           </TouchableOpacity>
        </View>

        {/* Text Details */}
        <View style={styles.details}>
          <Text style={[styles.brand, { color: colors.primary }]}>{product.category}</Text>
          <Text style={[styles.title, { color: colors.text }]}>{product.title}</Text>
          <Text style={[styles.price, { color: colors.primary }]}>${product.price.toFixed(2)}</Text>
          <Text style={[styles.description, { color: colors.textLight }]}>{product.description}</Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <Button title="Add to Cart" onPress={handleAddToCart} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingBottom: 100 },
  imageContainer: { 
    height: 350, 
    width: '100%', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 24, 
    position: 'relative',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  image: { width: '100%', height: '100%' },
  heartButton: { 
    position: 'absolute', 
    top: 24, 
    right: 24, 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 4,
    shadowOffset: {width:0, height:2}, 
    shadowOpacity:0.1, 
    shadowRadius:4 
  },
  heartIcon: { fontSize: 24, color: '#FF5252', marginTop: 2 },
  details: { paddingHorizontal: 24 },
  brand: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, lineHeight: 32 },
  price: { fontSize: 28, marginBottom: 24, fontWeight: '700' },
  description: { fontSize: 16, lineHeight: 26 },
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    padding: 24, 
    borderTopWidth: 1, 
  },
});