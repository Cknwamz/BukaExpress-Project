import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Import Types
import { useNavigation } from '@react-navigation/native'; // Import Hook
import { colors } from '../theme/colors';
import { useProducts } from '../hooks/useProducts';
import { Button } from '../components/core/Button';
import { ProductCard } from '../components/product/ProductCard';
import { RootStackParamList } from '../navigation/types';

export const HomeScreen = () => {
  // 1. Initialize Navigation Hook
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // 2. Get Data
  const { products, loading, error, refetch } = useProducts();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Try Again" onPress={refetch} style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New Arrivals</Text>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        
        // Grid Layout Settings
        numColumns={2} 
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            // 3. THIS IS THE NAVIGATION TRIGGER
            onPress={() => navigation.navigate('ProductDetails', { productId: item.id })} 
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28, 
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    textAlign: 'center',
  },
});