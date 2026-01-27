import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../context/SettingsContext'; // <--- Import Brain

const SettingRow = ({ label, value, onValueChange, colors }: any) => (
  <View style={styles.row}>
    <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    <Switch 
      value={value} 
      onValueChange={onValueChange} 
      trackColor={{ false: colors.border, true: colors.primary }}
      thumbColor={colors.surface}
    />
  </View>
);

export const SettingsScreen = () => {
  // 1. Get Values & Actions from the Brain
  const { 
    darkMode, toggleDarkMode, 
    notifications, toggleNotifications,
    emailPromos, toggleEmailPromos,
    colors // <--- Get dynamic colors
  } = useSettings();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textLight }]}>Preferences</Text>
          <SettingRow 
            label="Dark Mode" 
            value={darkMode} 
            onValueChange={toggleDarkMode} 
            colors={colors}
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textLight }]}>Notifications</Text>
          <SettingRow 
            label="Push Notifications" 
            value={notifications} 
            onValueChange={toggleNotifications} 
            colors={colors}
          />
          <SettingRow 
            label="Email Promotions" 
            value={emailPromos} 
            onValueChange={toggleEmailPromos} 
            colors={colors}
          />
        </View>
        
        <Text style={[styles.note, { color: colors.textLight }]}>
          {notifications ? "You will receive updates." : "Notifications are paused."}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24 },
  section: { marginBottom: 32, borderRadius: 12, padding: 16, borderWidth: 1 },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 16, textTransform: 'uppercase' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  label: { fontSize: 16 },
  note: { textAlign: 'center', fontSize: 12 }
});