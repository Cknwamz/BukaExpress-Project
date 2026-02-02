import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { Button } from '../components/core/Button';
import { Input } from '../components/core/Input';

// Payment Options
const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit Card', icon: '💳' },
  { id: 'apple', label: 'Apple Pay', icon: '' },
  { id: 'delivery', label: 'Pay on Delivery', icon: '📦' },
];

export const CheckoutScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { total, placeOrder } = useCart();
  const { colors, darkMode } = useSettings();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  
  // Card State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const [loading, setLoading] = useState(false);
  const [applePayStatus, setApplePayStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

  // --- VALIDATION LOGIC ---
  const validateCard = () => {
    if (cardNumber.replace(/\s/g, '').length < 16) {
      Alert.alert('Invalid Card', 'Card number must be 16 digits.');
      return false;
    }
    const [month, year] = expiry.split('/');
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      Alert.alert('Invalid Date', 'Use MM/YY format (e.g. 12/26).');
      return false;
    }
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    const expMonth = parseInt(month, 10);
    const expYear = parseInt(year, 10);

    if (expMonth < 1 || expMonth > 12) {
      Alert.alert('Invalid Date', 'Month must be between 01 and 12.');
      return false;
    }
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      Alert.alert('Card Expired', 'This card has expired. Please use a valid card.');
      return false;
    }
    if (cvv.length < 3) {
      Alert.alert('Invalid CVV', 'CVV must be 3 digits.');
      return false;
    }
    return true;
  };

  const handleCheckout = async () => {
    if (!name || !address || !city) {
      Alert.alert('Missing Info', 'Please fill in your shipping details.');
      return;
    }

    if (paymentMethod === 'card') {
      if (!validateCard()) return;
    }

    setLoading(true);

    // --- APPLE PAY SIMULATION ---
    if (paymentMethod === 'apple') {
      setApplePayStatus('scanning');
      // 1. Simulate Face ID Scan (1.5 seconds)
      await new Promise(resolve => setTimeout(resolve, 1500));
      setApplePayStatus('success');
      // 2. Simulate Bank Processing (1 second)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // --- REAL BACKEND CALL ---
    try {
      await placeOrder(); 
      setLoading(false);
      setApplePayStatus('idle'); // Reset
      Alert.alert('Success', 'Order placed successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Tabs') }
      ]);
    } catch (error) {
      setLoading(false);
      setApplePayStatus('idle');
      Alert.alert('Error', 'Something went wrong processing your order.');
    }
  };

  // Custom Apple Pay Button Component
  const ApplePayButton = () => (
    <TouchableOpacity 
      style={styles.applePayButton} 
      onPress={handleCheckout}
      disabled={loading}
    >
      {loading ? (
         <View style={styles.appleContent}>
            {applePayStatus === 'scanning' && <Text style={styles.appleText}>Face ID...</Text>}
            {applePayStatus === 'success' && <Text style={styles.appleText}>✓ Approved</Text>}
            <ActivityIndicator color="white" style={{ marginLeft: 10 }} />
         </View>
      ) : (
        <View style={styles.appleContent}>
          <Text style={styles.appleLogo}></Text>
          <Text style={styles.appleText}>Pay</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          
          {/* 1. SHIPPING SECTION */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Shipping Address</Text>
            <Input label="Full Name" value={name} onChangeText={setName} placeholder="John Doe" />
            <Input label="Address" value={address} onChangeText={setAddress} placeholder="123 Street Name" />
            <Input label="City" value={city} onChangeText={setCity} placeholder="Lagos" />
          </View>

          {/* 2. PAYMENT METHOD SELECTOR */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Method</Text>
            <View style={styles.methodsContainer}>
              {PAYMENT_METHODS.map((method) => {
                const isSelected = paymentMethod === method.id;
                return (
                  <TouchableOpacity
                    key={method.id}
                    style={[
                      styles.methodCard,
                      { 
                        backgroundColor: isSelected ? colors.primary : colors.surface,
                        borderColor: isSelected ? colors.primary : colors.border
                      }
                    ]}
                    onPress={() => setPaymentMethod(method.id)}
                  >
                    <Text style={{ fontSize: 24, marginBottom: 8 }}>{method.icon}</Text>
                    <Text style={[
                      styles.methodLabel, 
                      { color: isSelected ? '#FFF' : colors.text }
                    ]}>
                      {method.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 3. DYNAMIC FORMS */}
          {paymentMethod === 'card' && (
            <View style={[styles.cardForm, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Input 
                label="Card Number" 
                value={cardNumber} 
                onChangeText={setCardNumber} 
                placeholder="0000 0000 0000 0000" 
                keyboardType="numeric" 
                maxLength={19}
              />
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Input 
                    label="Expiry (MM/YY)" 
                    value={expiry} 
                    onChangeText={setExpiry} 
                    placeholder="MM/YY" 
                    maxLength={5}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Input 
                    label="CVV" 
                    value={cvv} 
                    onChangeText={setCvv} 
                    placeholder="123" 
                    keyboardType="numeric" 
                    maxLength={3} 
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
          )}

          {paymentMethod === 'apple' && (
            <View style={[styles.infoBox, { backgroundColor: colors.surface }]}>
              <Text style={{ color: colors.text, textAlign: 'center', marginBottom: 8 }}>
                Pay securely with your Apple ID.
              </Text>
              <Text style={{ color: colors.textLight, fontSize: 12, textAlign: 'center' }}>
                Double-click logic simulated below.
              </Text>
            </View>
          )}

          {paymentMethod === 'delivery' && (
            <View style={[styles.infoBox, { backgroundColor: colors.surface }]}>
              <Text style={{ color: colors.text, textAlign: 'center' }}>
                You will pay with cash or transfer when the rider arrives.
              </Text>
            </View>
          )}

          {/* 4. SUMMARY & ACTION BUTTON */}
          <View style={styles.summary}>
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.textLight }]}>Total to Pay</Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>${total.toFixed(2)}</Text>
            </View>
            
            {/* Conditional Button Rendering */}
            {paymentMethod === 'apple' ? (
              <ApplePayButton />
            ) : (
              <Button 
                title={paymentMethod === 'delivery' ? "Place Order" : `Pay $${total.toFixed(2)}`}
                onPress={handleCheckout} 
                loading={loading} 
              />
            )}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 100 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  methodsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  methodCard: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 12, 
    borderRadius: 12, 
    borderWidth: 1, 
    marginHorizontal: 4,
    height: 100
  },
  methodLabel: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  cardForm: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 24 },
  row: { flexDirection: 'row' },
  infoBox: { padding: 24, borderRadius: 12, alignItems: 'center', marginBottom: 24 },
  summary: { marginTop: 20 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, alignItems: 'flex-end' },
  totalLabel: { fontSize: 16 },
  totalValue: { fontSize: 28, fontWeight: '800' },
  
  // Apple Pay Specific Styles
  applePayButton: {
    backgroundColor: '#000', // Apple Pay is always black
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  appleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleLogo: {
    color: '#FFF',
    fontSize: 24,
    marginRight: 4,
    paddingBottom: 4, // Visual alignment
  },
  appleText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
  }
});