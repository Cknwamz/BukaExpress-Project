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
import { useSettings } from '../context/SettingsContext';
import { useUser } from '../context/UserContext'; // <--- Import UserContext

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;
const ALLOWED_DOMAINS = ['@gmail.com', '@outlook.com', '@yahoo.com', '@icloud.com'];

export const LoginScreen = ({ navigation }: Props) => {
  const { colors } = useSettings();
  const { login } = useUser(); // <--- Get login function

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [emailError, setEmailError] = useState('');
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [hasNoSpaces, setHasNoSpaces] = useState(true);

  useEffect(() => {
    setIsLengthValid(password.length >= 8);
    setHasSpecialChar(/[!@#$%^&*(),.?":{}|<>]/.test(password));
    setHasNoSpaces(!/\s/.test(password) && password.length > 0);
  }, [password]);

  const validateEmail = (text: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) return 'Invalid email format';
    const domainValid = ALLOWED_DOMAINS.some(domain => text.toLowerCase().endsWith(domain));
    if (!domainValid) return `Must use: ${ALLOWED_DOMAINS.map(d => d.replace('@', '')).join(', ')}`;
    return '';
  };

  const handleLogin = async () => {
    const emailValidationErr = validateEmail(email);
    if (emailValidationErr) {
      setEmailError(emailValidationErr);
      return;
    }
    if (!isLengthValid || !hasSpecialChar || !hasNoSpaces) {
      Alert.alert('Security Check', 'Please meet all password requirements highlighted in red.');
      setShowPasswordRules(true);
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      setLoading(false);
      navigation.replace('Tabs'); 
    } catch (error) {
      setLoading(false);
      Alert.alert('Login Failed', String(error));
    }
  };

  const PasswordRule = ({ valid, text }: { valid: boolean, text: string }) => (
    <View style={styles.ruleRow}>
      <Text style={[styles.ruleIcon, { color: valid ? '#4CAF50' : showPasswordRules ? colors.error : colors.textLight }]}>
        {valid ? '✓' : '•'}
      </Text>
      <Text style={[styles.ruleText, { color: valid ? '#4CAF50' : showPasswordRules ? colors.error : colors.textLight }]}>
        {text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={[styles.logo, { color: colors.primary }]}>STORE.</Text>
            <Text style={[styles.subtitle, { color: colors.textLight }]}>Welcome back! Please login to continue.</Text>
          </View>

          <View style={styles.form}>
            <Input 
              label="Email Address" 
              placeholder="name@gmail.com"
              value={email}
              onChangeText={(text) => { setEmail(text); setEmailError(''); }}
              onBlur={() => setEmailError(validateEmail(email))}
              autoCapitalize="none"
              keyboardType="email-address"
              error={emailError}
            />
            <Input 
              label="Password" 
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => { setPassword(text); setShowPasswordRules(true); }}
              secureTextEntry
              style={showPasswordRules && (!isLengthValid || !hasSpecialChar || !hasNoSpaces) ? { borderColor: colors.border } : undefined}
            />

            {showPasswordRules && (
              <View style={[styles.rulesContainer, { backgroundColor: colors.surface }]}>
                <PasswordRule valid={isLengthValid} text="Minimum 8 characters" />
                <PasswordRule valid={hasSpecialChar} text="At least 1 special character (!@#...)" />
                <PasswordRule valid={hasNoSpaces} text="Cannot contain spaces" />
              </View>
            )}
            
            <Button title="Sign In" onPress={handleLogin} loading={loading} style={{ marginTop: 24 }} />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textLight }]}>Don't have an account?</Text>
            {/* LINK TO SIGNUP */}
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={[styles.link, { color: colors.primary }]}> Sign Up</Text>
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
  header: { marginBottom: 48 },
  logo: { fontSize: 40, fontWeight: '900', letterSpacing: -2, marginBottom: 12 },
  subtitle: { fontSize: 16, lineHeight: 24 },
  form: { marginBottom: 24 },
  rulesContainer: { marginTop: 8, marginBottom: 8, padding: 12, borderRadius: 8 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  ruleIcon: { fontSize: 14, marginRight: 8, fontWeight: 'bold' },
  ruleText: { fontSize: 13 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  footerText: {},
  link: { fontWeight: '700' },
});