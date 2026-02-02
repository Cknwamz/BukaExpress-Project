import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { Button } from '../components/core/Button';
import { Input } from '../components/core/Input';
import { useUser } from '../context/UserContext';
import { useSettings } from '../context/SettingsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export const SignupScreen = ({ navigation }: Props) => {
  const { colors } = useSettings();
  const { register } = useUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- PASSWORD VALIDATION STATE ---
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [hasNoSpaces, setHasNoSpaces] = useState(true);

  // Live Validation Effect
  useEffect(() => {
    setIsLengthValid(password.length >= 8);
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(password));
    setHasNoSpaces(!/\s/.test(password) && password.length > 0);
  }, [password]);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Missing Fields', 'Please fill in all fields.');
      return;
    }

    // 1. Enforce Password Rules
    if (!isLengthValid || !hasSpecialChar || !hasNoSpaces) {
        Alert.alert('Weak Password', 'Please meet all password requirements highlighted below.');
        setShowPasswordRules(true);
        return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, name);
      setLoading(false);
      navigation.replace('Tabs');
    } catch (error) {
      setLoading(false);
      Alert.alert('Registration Failed', String(error));
    }
  };

  // Helper Component for Rules
  const PasswordRule = ({ valid, text }: { valid: boolean, text: string }) => (
    <View style={styles.ruleRow}>
      <Text style={[styles.ruleIcon, { color: valid ? '#4CAF50' : colors.textLight }]}>
        {valid ? '✓' : '•'}
      </Text>
      <Text style={[styles.ruleText, { color: valid ? '#4CAF50' : colors.textLight }]}>
        {text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.primary }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.textLight }]}>Join us and start shopping.</Text>
          </View>

          <View style={styles.form}>
            <Input 
              label="Full Name" 
              placeholder="John Doe" 
              value={name} 
              onChangeText={setName} 
            />
            
            <Input 
              label="Email Address" 
              placeholder="name@example.com" 
              value={email} 
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input 
              testID="password-input" 
              label="Password" 
              placeholder="••••••••" 
              value={password} 
              onChangeText={(text) => {
                setPassword(text);
                setShowPasswordRules(true);
              }}
              secureTextEntry
              style={showPasswordRules && (!isLengthValid || !hasSpecialChar || !hasNoSpaces) ? { borderColor: colors.border } : undefined}
            />

            {/* LIVE PASSWORD RULES UI */}
            {showPasswordRules && (
              <View style={[styles.rulesContainer, { backgroundColor: colors.surface }]}>
                <PasswordRule valid={isLengthValid} text="Minimum 8 characters" />
                <PasswordRule valid={hasSpecialChar} text="At least 1 special character (!@#...)" />
                <PasswordRule valid={hasNoSpaces} text="Cannot contain spaces" />
              </View>
            )}

            <Input 
              testID="confirm-input"
              label="Confirm Password" 
              placeholder="••••••••" 
              value={confirmPassword} 
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            
            <Button 
              title="Create Account" 
              onPress={handleSignup} 
              loading={loading} 
              style={{ marginTop: 24 }}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textLight }]}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.link, { color: colors.primary }]}> Sign In</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  scroll: { flexGrow: 1, padding: 24, justifyContent: 'center' },
  header: { marginBottom: 32 },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 16 },
  form: { marginBottom: 24 },
  rulesContainer: { marginTop: -8, marginBottom: 16, padding: 12, borderRadius: 8 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  ruleIcon: { fontSize: 14, marginRight: 8, fontWeight: 'bold' },
  ruleText: { fontSize: 13 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  footerText: {},
  link: { fontWeight: '700' },
});