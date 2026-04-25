import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';

import { exchangeCode } from '@/features/auth/lib/auth';

/**
 * Deep-link target for OAuth and password-reset redirects (tria://callback).
 *
 * OAuth: iOS intercepts the redirect inside openAuthSessionAsync before it
 * fires as a deep link, so this screen is never rendered in the normal OAuth path.
 *
 * Password reset: the user taps the email link, the OS opens the app here,
 * and we exchange the one-time code for a session. onAuthStateChange in
 * AuthGate fires PASSWORD_RECOVERY, which routes to /(auth)/reset-password.
 */
export default function CallbackScreen() {
  const { colors } = useTheme();
  const { code } = useLocalSearchParams<{ code: string }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;
    exchangeCode(code).catch((e: unknown) => {
      setError((e as any)?.message ?? 'This link is invalid or has expired. Please request a new one.');
    });
  }, [code]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text variant="bodyMedium" style={{ color: colors.error, textAlign: 'center' }}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text variant="bodyMedium">Completing sign in…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
});
