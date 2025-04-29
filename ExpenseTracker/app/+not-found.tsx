import { Link, Stack } from 'expo-router';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Hold on...' }} />
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2e78b7" />
        <Text style={styles.title}>We're trying to find the right page.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Return to Home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  link: {
    marginTop: 20,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 16,
    color: '#2e78b7',
    fontWeight: 'bold',
  },
});