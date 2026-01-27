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
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { Button } from '../components/core/Button';
import { Input } from '../components/core/Input';
import { useUser } from '../context/UserContext';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export const EditProfileScreen = ({ navigation }: Props) => {
  const { user, updateUser } = useUser();
  const [loading, setLoading] = useState(false);

  // Form State initialized with current user data
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [phone, setPhone] = useState(user.phone);

  const handleSave = () => {
    setLoading(true);

    // Simulate Network Request
    setTimeout(() => {
      updateUser({ name, bio, phone });
      setLoading(false);
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Input 
            label="Full Name" 
            value={name} 
            onChangeText={setName} 
          />
          <Input 
            label="Bio / Title" 
            value={bio} 
            onChangeText={setBio} 
            multiline
            numberOfLines={3}
            style={{ height: 80, paddingTop: 12 }} // Taller input for Bio
          />
          <Input 
            label="Phone Number" 
            value={phone} 
            onChangeText={setPhone} 
            keyboardType="phone-pad"
          />
          {/* Email is usually read-only in edit screens */}
          <Input 
            label="Email Address" 
            value={user.email} 
            editable={false} 
            style={{ backgroundColor: colors.background, opacity: 0.7 }}
          />
        </ScrollView>

        <View style={styles.footer}>
          <Button 
            title="Save Changes" 
            onPress={handleSave} 
            loading={loading} 
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 24 },
  footer: { padding: 24, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
});