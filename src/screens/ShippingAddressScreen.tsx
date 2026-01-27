import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { Button } from '../components/core/Button';
import { Input } from '../components/core/Input';

export const ShippingAddressScreen = ({ navigation }: any) => {
  const [address, setAddress] = useState('123 Babcock Way');
  const [city, setCity] = useState('Ilishan-Remo');
  const [state, setState] = useState('Ogun State');
  const [zip, setZip] = useState('102112');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // In a real app, this would save to the UserContext or Backend
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Saved', 'Your shipping address has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Input label="Street Address" value={address} onChangeText={setAddress} />
          <Input label="City" value={city} onChangeText={setCity} />
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Input label="State" value={state} onChangeText={setState} />
            </View>
            <View style={{ width: 120 }}>
              <Input label="Zip Code" value={zip} onChangeText={setZip} keyboardType="numeric" />
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <Button title="Save Address" onPress={handleSave} loading={loading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 24 },
  row: { flexDirection: 'row' },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface }
});