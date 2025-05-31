import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getErrorMessage } from '@/app/utils/helpers';

type ErrorStateProps = {
  errors: unknown[];
};

const ErrorState: React.FC<ErrorStateProps> = ({ errors }) => {
  useEffect(() => {
    errors.forEach((e, i) => {
      console.error(`Error ${i + 1}:`, getErrorMessage(e));
    });
  }, [errors]);

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="alert-circle-outline" size={60} color="#FF4C4C" />
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.subtitle}>Pull down to refresh and try again.</Text>
    </View>
  );
};

export default ErrorState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
