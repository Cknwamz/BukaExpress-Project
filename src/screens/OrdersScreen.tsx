import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';

export const OrdersScreen = () => {
  const { orders } = useCart();

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.emptyText}>No orders yet.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.id}>Order #{item.id}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.items}>{item.items.length} Items</Text>
              <Text style={styles.total}>${item.total.toFixed(2)}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{item.status}</Text>
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
  emptyText: { color: colors.textLight, fontSize: 16 },
  list: { padding: 24 },
  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  id: { fontWeight: 'bold', fontSize: 16, color: colors.text },
  date: { color: colors.textLight, fontSize: 14 },
  items: { color: colors.textLight, fontSize: 14 },
  total: { fontWeight: 'bold', fontSize: 16, color: colors.primary },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 12,
  },
  statusText: { color: '#2196F3', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
});