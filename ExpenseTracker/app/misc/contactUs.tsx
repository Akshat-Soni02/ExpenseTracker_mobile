import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, Linking } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Header from '@/components/Header';

const ContactUsScreen = () => {
  const { control, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    Alert.alert('Message Sent', 'Thank you for contacting us!');
    reset();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <Header/>
      <Text style={styles.title}>Contact Us</Text>

      <Text style={styles.info}>We'd love to hear from you! Reach out to us using the details below or send us a message.</Text>

      <View style={styles.contactBlock}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.link} onPress={() => Linking.openURL('mailto:expenseease414@gmail.com')}>
          expenseease.app
        </Text>
      </View>

      <View style={styles.contactBlock}>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.link} onPress={() => Linking.openURL('tel:+919649603978')}>
          +91 9649603978
        </Text>
        <Text style={styles.link} onPress={() => Linking.openURL('tel:+917721981559')}>
          +91 7721981559
        </Text>
      </View>

      <Text style={styles.subheading}>Or send us a message:</Text>

      <Controller
        control={control}
        name="name"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Your Email"
            value={value}
            keyboardType="email-address"
            onChangeText={onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="message"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Your Message"
            multiline
            numberOfLines={4}
            value={value}
            onChangeText={onChange}
          />
        )}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Send Message</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ContactUsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 16,
  },
  info: {
    fontSize: 14,
    marginBottom: 16,
    color: '#444',
  },
  contactBlock: {
    marginBottom: 12,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    color: '#007AFF',
    fontSize: 14,
    marginTop: 4,
  },
  text: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
