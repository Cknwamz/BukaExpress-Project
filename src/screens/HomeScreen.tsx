import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useProducts } from '../hooks/useProducts';
import { Button } from '../components/core/Button';
import { ProductCard } from '../components/product/ProductCard';
import { SearchBar } from '../components/core/SearchBar';
import { CategoryList } from '../components/home/CategoryList';
import { RootStackParamList } from '../navigation/types';
import { useSettings } from '../context/SettingsContext'; // <--- Import Brain

export const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { products, loading, error, refetch } = useProducts();
  const { colors } = useSettings(); // <--- Dynamic Colors
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = category === 'All' || product.category === category;
      const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.error, fontSize: 16 }}>{error}</Text>
        <Button title="Try Again" onPress={refetch} style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.primary }]}>Find your style</Text>
        <SearchBar 
          value={search} 
          onChangeText={setSearch} 
          onClear={() => setSearch('')} 
        />
      </View>

      <View style={{ backgroundColor: colors.background }}>
        <CategoryList 
          selectedCategory={category} 
          onSelect={setCategory} 
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ color: colors.textLight }}>No items found.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            onPress={() => navigation.navigate('ProductDetails', { productId: item.id })} 
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { paddingHorizontal: 24, paddingTop: 10 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -1, marginBottom: 16 },
  listContent: { paddingHorizontal: 24, paddingBottom: 20 },
  row: { justifyContent: 'space-between' },
  emptyContainer: { padding: 40, alignItems: 'center' },
});