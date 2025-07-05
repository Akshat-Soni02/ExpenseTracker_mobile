import Header from '@/components/Header';
import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';

const PrivacyPolicyScreen = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Header/>
      <Text style={styles.title}>Privacy Policy for Expenzz</Text>
      <Text style={styles.lastUpdated}>Last Updated: 6th June, 2025</Text>

      <Text style={styles.sectionTitle}>1. Introduction</Text>
      <Text style={styles.paragraph}>
        This Privacy Policy describes how Expenzz ("we," "us," or "our") collects, uses, and shares personal information of users ("you") of the Expenzz mobile application (the "App"). The App is designed to help individuals register and manage their expenses, split amounts with friends, add personal transactions, create and manage splits within groups, utilize virtual wallets for transactions, and manage bills. We are committed to protecting your privacy and ensuring the security of your personal information. This policy aims to provide you with clear and comprehensive information about our data handling practices, reflecting our dedication to transparency and building trust. Our practices are designed to comply with applicable data privacy laws and regulations, including those set forth by Google Play, ensuring that your information is handled responsibly and in accordance with your rights.
      </Text>

      <Text style={styles.sectionTitle}>2. Information We Collect</Text>
      <Text style={styles.paragraph}>
        We collect various types of information from you to provide, maintain, and improve the App's functionality and user experience. The information we collect depends on how you interact with the App and the features you use.
      </Text>

      <Text style={styles.subsectionTitle}>2.1. Information You Provide Directly to Us</Text>
      <Text style={styles.paragraph}>
        When you use the App, you may provide the following information directly:
      </Text>
      <Text style={styles.listItem}>
         <Text style={styles.listItemTitle}>• Registration Information:</Text>  When you register an account with the App, you may do so through Google or via email and password. If you choose to register via email, we collect your email address and a password. If you register through Google, we may collect your name, email address, and profile picture associated with your Google account. Providing an email address is necessary to create an account and access the App across different devices. You may also have the option to provide a phone number, which can be used for account recovery and added security. This information allows us to identify you as a user and provide you with access to the App's features.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• Transaction Data:</Text> When you use the App to add personal transactions or split amounts with friends, we collect details about these transactions. This includes the amount, date, description, and category of the expense. If you are splitting an amount with friends, we will collect information about the friends involved, which may include their names, email addresses, phone numbers, or internal identifiers within the App if they are also users. For group splits, we collect the names of the groups you create and the members within those groups.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• Wallet Information:</Text> The App allows you to create virtual wallets to organize your finances. When you create and use these wallets, we collect the names and descriptions you provide for your wallets, as well as the transaction history associated with each wallet.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• Bill Management Data:</Text>If you use the App's bill management features, we collect information about the bills you add, such as the bill name, amount, due date, and recurrence settings. You may also set up reminders and notification preferences for these bills, which are stored within the App.
      </Text>
      <Text style={styles.listItem}>
       <Text style={styles.listItemTitle}> • Communications:</Text> If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
      </Text>

      <Text style={styles.subsectionTitle}>2.2. Information We Collect Automatically</Text>
      <Text style={styles.paragraph}>
        When you access or use the App, we may automatically collect certain information about your device and your usage of the App:
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• Device Information:</Text> We automatically collect certain information about the device you use to access the App. This includes your IP address, mobile device ID number, model, and manufacturer, the version of your operating system, browser type (if accessing via a web interface), the App version, and language settings. This automatic collection helps us ensure the App functions correctly on your device, provides security for your account, and allows us to analyze usage patterns to improve the App.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• Usage Data:</Text> We collect information about how you interact with the App. This includes the features you use, the actions you take within the App (e.g., taps, scrolls), and the frequency and duration of your usage. We may also collect crash reports and performance data to identify and fix issues.
      </Text>

      <Text style={styles.subsectionTitle}>2.3. Information from Third-Party Integrations</Text>
      <Text style={styles.paragraph}>
        If you choose to register or log in to the App using your Google account, we may collect your name, email address, and potentially your profile picture from Google. This integration streamlines the registration process and allows you to connect with friends who also use the App. This data is treated as if you provided it directly to us.
      </Text>

      <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
      <Text style={styles.paragraph}>
        We use the information we collect for various purposes, including:
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• To Provide and Maintain the App:</Text> This includes creating and managing your account, enabling expense tracking, facilitating expense splitting, managing virtual wallets, and handling bill reminders.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• To Improve and Personalize Your Experience:</Text> We use usage data and feedback to understand user behavior, identify areas for improvement, develop new features, and personalize the App's interface and recommendations.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• For Security and Fraud Prevention:</Text> We use device information and usage data to detect and prevent fraudulent activity, unauthorized access, and other security incidents, ensuring the integrity of your account and our services.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• For Analytics and Performance Monitoring:</Text> We analyze aggregated and anonymized data to monitor the App's performance, understand trends, and make informed business decisions.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• To Communicate with You:</Text> We may use your email address to send you important updates about the App, policy changes, security alerts, and to respond to your inquiries.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• To Comply with Legal Obligations:</Text> We may use your information as necessary to comply with applicable laws, regulations, legal processes, or governmental requests.
      </Text>

      <Text style={styles.sectionTitle}>4. How We Share Your Information</Text>
      <Text style={styles.paragraph}>
        We may share your information in the following circumstances:
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• With Other Users:</Text> When you split expenses or create groups, certain information (like your name, profile picture, and the amounts owed/paid) will be visible to the friends or group members involved to facilitate the core functionality of the App.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• With Service Providers:</Text> We may share your information with third-party vendors, consultants, and other service providers who perform services on our behalf, such as hosting, analytics, customer support, and IT services. These service providers are obligated to protect your information and only use it for the purposes for which it was disclosed.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• For Legal Reasons:</Text> We may disclose your information if required to do so by law or in the good faith belief that such action is necessary to (i) comply with a legal obligation, (ii) protect and defend our rights or property, (iii) act in urgent circumstances to protect the personal safety of users of the App or the public, or (iv) protect against legal liability.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• In Case of Business Transfers:</Text> In the event that Expenzz is involved in a merger, acquisition, financing, reorganization, bankruptcy, receivership, dissolution, or sale of all or a portion of its assets, your information may be transferred as part of that transaction. We will notify you via email and/or a prominent notice on our App of any change in ownership or uses of your personal information, as well as any choices you may have regarding your personal information.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• With Your Consent:</Text> We may share your information with third parties when we have your explicit consent to do so.
      </Text>

      <Text style={styles.sectionTitle}>5. Data Security</Text>
      <Text style={styles.paragraph}>
        We are committed to protecting the security of your personal information. We implement a variety of security measures, including technical, administrative, and physical safeguards, to maintain the safety of your personal information when you enter, submit, or access your personal information. These measures include:
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• Access Controls:</Text> Access to your data is restricted to authorized personnel who need to access it for the purposes described in this Privacy Policy.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• Regular Security Reviews:</Text> We regularly review our security practices to ensure they remain effective and up-to-date with evolving threats.
      </Text>
      <Text style={styles.paragraph}>
        However, no method of transmission over the Internet or method of electronic storage is 100% secure. Therefore, while we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
      </Text>

      <Text style={styles.sectionTitle}>6. Data Retention</Text>
      <Text style={styles.paragraph}>
        We retain your personal information for as long as your account is active or as needed to provide you with the services. We will also retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements. If you request the deletion of your account, we will delete your personal information as described in the "Your Choices and Rights" section, subject to any legal or legitimate business reasons for retention.
      </Text>

      <Text style={styles.sectionTitle}>7. Your Choices and Rights</Text>
      <Text style={styles.paragraph}>
        You have certain choices and rights regarding your personal information:
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• Account Information:</Text> You can review and update your account information by logging into the App and navigating to your profile settings.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• Marketing Communications:</Text> You can opt-out of receiving promotional emails from us by following the unsubscribe instructions provided in those emails. Please note that we may still send you non-promotional messages related to your account or our ongoing business relations.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• Device Permissions:</Text> You can control the data that your device allows us to collect through your device's privacy settings (e.g., location services, notifications).
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• Data Access and Deletion:</Text> You have the right to request access to the personal information we hold about you and to request that we delete your personal information. To exercise these rights, please contact us at expensetracker414@gmail.com. We will respond to your request in accordance with applicable laws. Please note that deleting your account will result in the permanent deletion of your data within the App, and it may not be recoverable.
      </Text>
      <Text style={styles.listItem}>
        <Text style={styles.listItemTitle}>• Data Portability:</Text> You may have the right to request a copy of your data in a structured, commonly used, and machine-readable format.
      </Text>

      <Text style={styles.sectionTitle}>8. Children's Privacy</Text>
      <Text style={styles.paragraph}>
        The App is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you become aware that a child under 13 has provided us with personal information, please contact us at expensetracker414@gmail.com, and we will take steps to delete such information and terminate the child's account.
      </Text>

      <Text style={styles.sectionTitle}>9. Third-Party Services</Text>
      <Text style={styles.paragraph}>
        The App may contain links to third-party websites or services that are not owned or controlled by Expenzz. This Privacy Policy applies only to the information collected by our App. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. We encourage you to review the privacy policies of any third-party services you access through our App.
      </Text>

      <Text style={styles.sectionTitle}>10. Contact Us</Text>
      <Text style={styles.paragraph}>
        If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
      </Text>
      <Text style={styles.paragraph}>
        Expenzz Support
      </Text>
      <Text style={styles.paragraph}>
        Email: expensetracker414@gmail.com
      </Text>

      <Text style={styles.sectionTitle}>11. Updates to This Privacy Policy</Text>
      <Text style={styles.paragraph}>
        We may update this Privacy Policy from time to time to reflect changes in our data practices or legal requirements. We will notify you of any material changes by posting the updated policy within the App or by other means, such as sending you an email to the address associated with your account. We will also update the "Last Updated" date at the beginning of this Privacy Policy. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information. Your continued use of the App after we post any changes to this Privacy Policy will constitute your acceptance of the updated policy.
      </Text>

      <Text style={styles.sectionTitle}>12. Disclaimers</Text>
      <Text style={styles.paragraph}>
        The App is provided on an "as-is" and "as available" basis, without any warranties of any kind, express or implied. To the fullest extent permitted by applicable law, we disclaim all warranties, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement. We will not be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with your use of the App or this Privacy Policy.
      </Text>

      <Text style={styles.paragraph}>
        Copyright © 2025 Expenzz. All rights reserved.
      </Text>
      {/* Continue adding sections 3 through 12 in a similar manner */}
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
  listItem: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
    marginLeft: 10,
  },
  listItemTitle: {
    fontWeight: 'bold',
  },
});

export default PrivacyPolicyScreen;