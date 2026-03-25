import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TodayScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text variant="headlineMedium" style={styles.title}>Today</Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Your training sessions will appear here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 20,
    gap: 8,
  },
  title: {
    fontWeight: '700',
  },
  subtitle: {
    opacity: 0.6,
  },
});
