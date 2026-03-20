import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View style={styles.container}>
        <Text variant="headlineMedium">This screen doesn&apos;t exist.</Text>
        <Link href="/(tabs)" style={styles.link}>
          <Text variant="bodyLarge" style={styles.linkText}>Go to home screen</Text>
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
  link: {
    marginTop: 15,
  },
  linkText: {
    color: '#1A6B8A',
  },
});
