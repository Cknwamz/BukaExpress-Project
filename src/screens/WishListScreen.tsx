import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';
import { Button } from '../components/core/Button';

export const WishlistScreen = () => {
  const { wishlist, removeFromWishlist, addToCart } = useCart();

  const handleMoveToCart = (item: any) => {
    addToCart(item);
    removeFromWishlist(item.id);
  };

  if (wishlist.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.emptyText}>Your wishlist is empty.</Text>
        <Text style={styles.subText}>Save items you want to watch.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.imageBox}>
              <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
            </View>
            <View style={styles.details}>
              <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
              
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => removeFromWishlist(item.id)}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
                <View style={styles.buttonWrapper}>
                   <Button 
                     title="Add to Cart" 
                     onPress={() => handleMoveToCart(item)}
                     style={{ height: 36 }} // Smaller button
                   />
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  subText: { color: colors.textLight },
  list: { padding: 24 },
  itemContainer: { flexDirection: 'row', marginBottom: 16, backgroundColor: colors.surface, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  imageBox: { width: 80, height: 80, backgroundColor: '#fff', borderRadius: 8, marginRight: 16, justifyContent: 'center', alignItems: 'center' },
  image: { width: '80%', height: '80%' },
  details: { flex: 1, justifyContent: 'space-between' },
  itemTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: colors.primary },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  removeText: { color: colors.error, fontSize: 13, fontWeight: '600' },
  buttonWrapper: { width: 100 }
});