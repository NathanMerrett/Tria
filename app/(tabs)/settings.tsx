import { Alert, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, List, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { signOut } from '@/features/auth/lib/auth';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { AppButton } from '@/shared/components/app-button';
import { Fonts } from '@/shared/constants/theme';

export default function SettingsScreen() {
  const { colors } = useTheme();
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
    <SafeAreaView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: colors.onBackground }]}>Settings</Text>

        <Card style={styles.card} mode="outlined">
          <Card.Title title="Account" />
          <Card.Content style={styles.cardContent}>
            <List.Item
              title={user?.email ?? '—'}
              left={(props) => <List.Icon {...props} icon="account" />}
            />
          </Card.Content>
          <Card.Actions>
            <AppButton
              variant="outlined"
              onPress={handleSignOut}
              style={{ borderColor: colors.error }}
              labelStyle={{ color: colors.error }}
            >
              Sign Out
            </AppButton>
          </Card.Actions>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    padding: 24,
    gap: 16,
    paddingBottom: 40,
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
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
