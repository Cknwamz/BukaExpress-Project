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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useCart } from '../context/CartContext';
import { Button } from '../components/core/Button';
import { useSettings } from '../context/SettingsContext'; // <--- Import Brain

export const CartScreen = () => {
  const { items, removeFromCart, total } = useCart();
  const { colors } = useSettings(); // <--- Get Dynamic Colors
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (items.length === 0) {
    return (
      <SafeAreaView style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Your Bag is Empty</Text>
        <Text style={[styles.emptySubtitle, { color: colors.textLight }]}>Go add some streetwear style.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>My Bag ({items.length})</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.itemContainer, { backgroundColor: colors.surface }]}>
            <View style={[styles.imageBox, { backgroundColor: '#fff' }]}>
              <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
            </View>
            <View style={styles.details}>
              <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
              <Text style={[styles.itemCategory, { color: colors.textLight }]}>{item.category}</Text>
              <Text style={[styles.itemPrice, { color: colors.primary }]}>${item.price.toFixed(2)}</Text>
              <View style={styles.controls}>
                <Text style={[styles.quantity, { color: colors.text }]}>Qty: {item.quantity}</Text>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Text style={[styles.removeText, { color: colors.error }]}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.textLight }]}>Total</Text>
          <Text style={[styles.totalValue, { color: colors.primary }]}>${total.toFixed(2)}</Text>
        </View>
        <Button 
          title="Checkout Now" 
          onPress={() => navigation.navigate('Checkout')} 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 24, borderBottomWidth: 1 },
  title: { fontSize: 24, fontWeight: '800' },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  emptySubtitle: { fontSize: 16 },
  list: { padding: 24 },
  itemContainer: { flexDirection: 'row', marginBottom: 24, borderRadius: 12, padding: 12, elevation: 1 },
  imageBox: { width: 80, height: 80, borderRadius: 8, marginRight: 16, justifyContent: 'center', alignItems: 'center' },
  image: { width: '80%', height: '80%' },
  details: { flex: 1, justifyContent: 'space-between' },
  itemTitle: { fontSize: 14, fontWeight: '600' },
  itemCategory: { fontSize: 12, textTransform: 'uppercase', marginTop: 4 },
  itemPrice: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  controls: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, alignItems: 'center' },
  quantity: { fontSize: 14, fontWeight: '500' },
  removeText: { fontSize: 12, fontWeight: '600' },
  footer: { padding: 24, borderTopWidth: 1 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, alignItems: 'flex-end' },
  totalLabel: { fontSize: 16 },
  totalValue: { fontSize: 24, fontWeight: '800' },
});