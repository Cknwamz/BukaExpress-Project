import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';
import { Button } from '../components/core/Button';
import { Input } from '../components/core/Input';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

export const CheckoutScreen = ({ navigation }: Props) => {
  const { total, placeOrder } = useCart(); // <--- Updated Import
  const [loading, setLoading] = useState(false);
  
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [card, setCard] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePay = () => {
    if (!address || !city || !zip || !card || !expiry || !cvv) {
      Alert.alert('Missing Details', 'Please fill in all shipping and payment info.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      placeOrder(); // <--- The Change: Saves order instead of just clearing
      Alert.alert('Success!', 'Your order has been placed.', [
        { 
          text: 'Cool', 
          onPress: () => navigation.navigate('Tabs') 
        }
      ]);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.section}>
            <Text style={styles.header}>Shipping Address</Text>
            <Input label="Street Address" placeholder="123 Babcock Way" value={address} onChangeText={setAddress} />
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Input label="City" placeholder="Ilishan-Remo" value={city} onChangeText={setCity} />
              </View>
              <View style={{ width: 100 }}>
                <Input label="Zip" placeholder="102112" value={zip} onChangeText={setZip} keyboardType="numeric" />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.header}>Payment Details</Text>
            <Input label="Card Number" placeholder="0000 0000 0000 0000" value={card} onChangeText={setCard} keyboardType="numeric" maxLength={19} />
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Input label="Expiry" placeholder="MM/YY" value={expiry} onChangeText={setExpiry} maxLength={5} />
              </View>
              <View style={{ flex: 1 }}>
                <Input label="CVV" placeholder="123" value={cvv} onChangeText={setCvv} keyboardType="numeric" maxLength={3} secureTextEntry />
              </View>
            </View>
          </View>

          <View style={styles.summary}>
            <Text style={styles.totalLabel}>Total to Pay</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button title={`Pay $${total.toFixed(2)}`} onPress={handlePay} loading={loading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 24 },
  section: { marginBottom: 32 },
  header: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16 },
  row: { flexDirection: 'row' },
  summary: { marginTop: 10, alignItems: 'center', padding: 20, backgroundColor: colors.surface, borderRadius: 12 },
  totalLabel: { fontSize: 14, color: colors.textLight, marginBottom: 4 },
  totalValue: { fontSize: 32, fontWeight: '800', color: colors.primary },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
});