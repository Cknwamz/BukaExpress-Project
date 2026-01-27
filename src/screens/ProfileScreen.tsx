import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useUser } from '../context/UserContext';
import { useSettings } from '../context/SettingsContext';
import { useCart } from '../context/CartContext'; // <--- Import Cart Logic

export const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, logout } = useUser();
  const { colors } = useSettings();
  const { clearSession } = useCart(); // <--- Get the Wiper

  // --- SAFETY GUARD ---
  useEffect(() => {
    if (!user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [user, navigation]);

  if (!user) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // --- LOGOUT LOGIC ---
  const handleLogout = async () => {
    // 1. Wipe Data
    await clearSession();
    // 2. Kill User Session
    logout();
    // 3. Go to Login
    navigation.replace('Login');
  };

  const MenuOption = ({ label, icon, onPress, isDestructive = false }: any) => (
    <TouchableOpacity 
      style={[styles.menuRow, { backgroundColor: colors.surface }]} 
      onPress={onPress}
    >
      <View style={styles.menuLeft}>
        <Text style={[
          styles.menuText, 
          { color: isDestructive ? colors.error : colors.text }
        ]}>
          {label}
        </Text>
      </View>
      <Text style={[styles.arrow, { color: colors.textLight }]}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: user.avatar || 'https://picsum.photos/200' }} 
              style={[styles.avatar, { backgroundColor: colors.border }]} 
            />
            <View style={[styles.statusDot, { borderColor: colors.surface }]} />
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
          <Text style={[styles.bio, { color: colors.textLight }]}>{user.bio}</Text>
          <Text style={[styles.email, { color: colors.primary }]}>{user.email}</Text>
          
          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: colors.background, borderColor: colors.border }]} 
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={[styles.editButtonText, { color: colors.text }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textLight }]}>Shopping</Text>
          <MenuOption label="Order History" icon="box" onPress={() => navigation.navigate('Orders')} />
          <MenuOption label="Wishlist" icon="heart" onPress={() => navigation.navigate('Wishlist')} />
          <MenuOption label="Shipping Addresses" icon="map" onPress={() => navigation.navigate('ShippingAddress')} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textLight }]}>Settings</Text>
          <MenuOption label="Preferences & Notifications" icon="settings" onPress={() => navigation.navigate('Settings')} />
          <MenuOption label="Privacy Policy" icon="lock" onPress={() => navigation.navigate('PrivacyPolicy')} />
        </View>

        <View style={styles.section}>
          <MenuOption 
            label="Log Out" 
            icon="log-out" 
            isDestructive 
            onPress={handleLogout} // <--- Connected to new logic
          />
        </View>

        <Text style={[styles.version, { color: colors.textLight }]}>v1.3.0 • Secure Session</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { paddingBottom: 40 },
  header: { alignItems: 'center', paddingVertical: 32, borderBottomWidth: 1, marginBottom: 24 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  statusDot: { position: 'absolute', bottom: 4, right: 4, width: 20, height: 20, borderRadius: 10, backgroundColor: '#4CAF50', borderWidth: 3 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  bio: { fontSize: 14, marginBottom: 4, textAlign: 'center', paddingHorizontal: 40 },
  email: { fontSize: 14, marginBottom: 16, fontWeight: '600' },
  editButton: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  editButtonText: { fontSize: 14, fontWeight: '600' },
  section: { marginBottom: 24, borderTopWidth: 1, borderBottomWidth: 1 },
  sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, letterSpacing: 1 },
  menuRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuText: { fontSize: 16, marginLeft: 8 },
  arrow: { fontSize: 20, fontWeight: '300' },
  version: { textAlign: 'center', fontSize: 12, marginTop: 8 },
});