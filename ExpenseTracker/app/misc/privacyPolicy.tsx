// PrivacyPolicyScreen.js

import Header from '@/components/Header';
import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Header/>
      <Text style={styles.title}>Privacy Policy for ExpenseEase</Text>
      <Text style={styles.lastUpdated}>Last Updated: 10th May, 2025</Text>

      <Text style={styles.sectionTitle}>1. Introduction</Text>
      <Text style={styles.paragraph}>
        This Privacy Policy describes how ExpenseEase ("we," "us," or "our") collects, uses, and shares personal information of users ("you") of the ExpenseEase mobile application (the "App"). The App is designed to help individuals register and manage their expenses, split amounts with friends, add personal transactions, create and manage splits within groups, utilize virtual wallets for transactions, and manage bills. We are committed to protecting your privacy and ensuring the security of your personal information. This policy aims to provide you with clear and comprehensive information about our data handling practices, reflecting our dedication to transparency and building trust. Our practices are designed to comply with applicable data privacy laws and regulations, ensuring that your information is handled responsibly and in accordance with your rights.
      </Text>

      <Text style={styles.sectionTitle}>2. Information We Collect</Text>
      <Text style={styles.paragraph}>
        We collect various types of information from you to provide and improve the App's functionality. The information we collect depends on how you interact with the App and the features you use.
      </Text>

      <Text style={styles.subsectionTitle}>Registration Information:</Text>
      <Text style={styles.paragraph}>
        When you register an account with the App, you may do so through Google or via email and password. If you choose to register via email, we collect your email address and a password. If you register through Google, we may collect your name, email address, and profile picture associated with your Google account. Providing an email address is necessary to create an account and access the App across different devices. You may also have the option to provide a phone number, which can be used for account recovery and added security. This information allows us to identify you as a user and provide you with access to the App's features.
      </Text>

      <Text style={styles.subsectionTitle}>Transaction Data:</Text>
      <Text style={styles.paragraph}>
        When you use the App to add personal transactions or split amounts with friends, we collect details about these transactions. This includes the amount, date, description, and category of the expense. If you are splitting an amount with friends, we will collect information about the friends involved, which may include their names, email addresses, phone numbers, or internal identifiers within the App if they are also users. For group splits, we collect the names of the groups you create and the members within those groups. This data is essential for recording and managing your expenses, facilitating the splitting of costs, and providing you with a history of your financial activities within the App.
      </Text>

      <Text style={styles.subsectionTitle}>Wallet Information:</Text>
      <Text style={styles.paragraph}>
        The App allows you to create virtual wallets to organize your finances. When you create and use these wallets, we collect the names and descriptions you provide for your wallets, as well as the transaction history associated with each wallet. While the current features do not explicitly link to external funding sources, future updates might include this functionality, potentially involving the collection of payment information.
      </Text>

      <Text style={styles.subsectionTitle}>Bill Management Data:</Text>
      <Text style={styles.paragraph}>
        If you use the App's bill management features, we collect information about the bills you add, such as the bill name, amount, due date, and recurrence settings. You may also set up reminders and notification preferences for these bills, which are stored within the App.
      </Text>

      <Text style={styles.subsectionTitle}>Device Information:</Text>
      <Text style={styles.paragraph}>
        We automatically collect certain information about the device you use to access the App. This includes your IP address, mobile device ID number, model, and manufacturer, the version of your operating system, browser type (if accessing via a web interface), the App version, language settings, and, if you grant permission, your device's location. This automatic collection helps us ensure the App functions correctly on your device, provides security for your account, and allows us to analyze usage patterns to improve the App.
      </Text>

      <Text style={styles.subsectionTitle}>Usage Data:</Text>
      <Text style={styles.paragraph}>
        We collect information about how you interact with the App. This includes the features you use, the actions you take within the App, and the frequency and duration of your usage. We may also collect crash reports and performance data to identify and fix issues. Analyzing this data helps us understand how users are using the App, identify areas for improvement, and personalize your experience.
      </Text>

      <Text style={styles.subsectionTitle}>Location Data (If Applicable):</Text>
      <Text style={styles.paragraph}>
        Depending on future features, the App may request permission to collect your device's location data. This could be used to suggest nearby friends to split expenses with or to allow you to tag transactions with location information. If we collect precise location data, we will ask for your explicit consent, and you will have control over whether to allow this collection through your device settings.
      </Text>

      <Text style={styles.subsectionTitle}>Information from Third-Party Integrations:</Text>
      <Text style={styles.paragraph}>
        If you choose to register or log in to the App using your Google account, we may collect your name, email address, and potentially your profile picture from Google. This integration streamlines the registration process and allows you to connect with friends who also use the App. This data is treated as if you provided it directly to us.
      </Text>

      {/* Continue adding sections 3 through 12 in a similar manner */}

      <Text style={styles.sectionTitle}>10. Contact Us</Text>
      <Text style={styles.paragraph}>
        If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
      </Text>
      <Text style={styles.paragraph}>
        ExpenseEase
      </Text>
      <Text style={styles.paragraph}>
        Email: expenseease414@gmail.com
      </Text>

      <Text style={styles.sectionTitle}>11. Updates to This Privacy Policy</Text>
      <Text style={styles.paragraph}>
        We may update this Privacy Policy from time to time to reflect changes in our data practices or legal requirements. We will notify you of any material changes by posting the updated policy within the App or by other means, such as sending you an email. We will also update the "Last Updated" date at the beginning of this Privacy Policy. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information. Your continued use of the App after we post any changes to this Privacy Policy will constitute your acceptance of the updated policy.
      </Text>

      <Text style={styles.sectionTitle}>12. Disclaimers</Text>
      <Text style={styles.paragraph}>
        The App is provided on an "as-is" and "as available" basis, without any warranties of any kind, express or implied. To the fullest extent permitted by applicable law, we disclaim all warranties, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement. We will not be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with your use of the App or this Privacy Policy.
      </Text>

      <Text style={styles.paragraph}>
        Copyright © 2025 ExpenseEase. All rights reserved.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default PrivacyPolicyScreen;