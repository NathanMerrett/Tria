import { Alert, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/features/auth/store/auth-store';
import { signOut } from '@/features/auth/lib/auth';

export default function SettingsScreen() {
  const user = useAuthStore((s) => s.session?.user);

  function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => signOut().catch(console.error),
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text variant="headlineMedium" style={styles.title}>Settings</Text>

        <Card style={styles.card} mode="outlined">
          <Card.Title title="Account" />
          <Card.Content style={styles.cardContent}>
            <List.Item
              title={user?.email ?? '—'}
              left={(props) => <List.Icon {...props} icon="account" />}
            />
          </Card.Content>
          <Card.Actions>
            <Button mode="text" textColor="#DC2626" onPress={handleSignOut}>
              Sign Out
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
  title: {
    fontWeight: '700',
    marginBottom: 4,
  },
  card: {
    borderRadius: 14,
  },
  cardContent: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
});
