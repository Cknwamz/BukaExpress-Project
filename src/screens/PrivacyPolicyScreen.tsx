import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export const PrivacyPolicyScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.lastUpdated}>Last Updated: January 27, 2026</Text>
        
        <Text style={styles.heading}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Welcome to STORE. We know that you care how information about you is used and shared, and we appreciate your trust that we will do so carefully and sensibly. This Privacy Notice describes how we collect and process your personal information through our websites, devices, products, services, and applications.
        </Text>

        <Text style={styles.heading}>2. Information We Collect</Text>
        <Text style={styles.paragraph}>
          We collect your personal information in order to provide and continually improve our products and services. Here are the types of personal information we collect:
          {'\n'}• Information You Give Us: We receive and store any information you provide in relation to our Services.
          {'\n'}• Automatic Information: We automatically collect and store certain types of information about your use of our Services.
        </Text>

        <Text style={styles.heading}>3. How We Use Information</Text>
        <Text style={styles.paragraph}>
          We use your personal information to operate, provide, develop, and improve the products and services that we offer our customers. These purposes include:
          {'\n'}• Purchase and delivery of products and services.
          {'\n'}• Recommendations and personalization.
          {'\n'}• Comply with legal obligations.
          {'\n'}• Communicate with you.
        </Text>

        <Text style={styles.heading}>4. Sharing Information</Text>
        <Text style={styles.paragraph}>
          Information about our customers is an important part of our business, and we are not in the business of selling our customers' personal information to others. We share customers' personal information only as described below and with subsidiaries that follow practices at least as protective as those described in this Privacy Notice.
        </Text>

        <Text style={styles.footer}>
          By using our services, you agree to this policy.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 24, paddingBottom: 40 },
  lastUpdated: { fontSize: 12, color: colors.textLight, marginBottom: 24, fontStyle: 'italic' },
  heading: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8, marginTop: 16 },
  paragraph: { fontSize: 14, color: colors.textLight, lineHeight: 22 },
  footer: { marginTop: 40, paddingTop: 20, borderTopWidth: 1, borderTopColor: colors.border, textAlign: 'center', color: colors.textLight, fontSize: 12 }
});