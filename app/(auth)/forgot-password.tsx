import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { HelperText, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

import { resetPassword } from '@/features/auth/lib/auth';
import { AppButton } from '@/shared/components/app-button';
import { FormField } from '@/shared/components/form-field';
import { Fonts } from '@/shared/constants/theme';

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (e: unknown) {
      setError((e as any)?.message ?? 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.flex}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.brand, { color: colors.primary }]}>Tria</Text>

          {sent ? (
            <View style={styles.hero}>
              <Text style={[styles.title, { color: colors.onBackground }]}>
                Check your inbox
              </Text>
              <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                We sent a reset link to{' '}
                <Text variant="bodyMedium" style={{ color: colors.primary }}>{email}</Text>
                {'. Tap it to set a new password.'}
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.hero}>
                <Text style={[styles.title, { color: colors.onBackground }]}>
                  Reset Password
                </Text>
                <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
                  {"Enter your email and we'll send you a reset link."}
                </Text>
              </View>

              <View style={styles.form}>
                <FormField
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />

                {error && (
                  <HelperText type="error" visible padding="none">
                    {error}
                  </HelperText>
                )}

                <AppButton onPress={handleSubmit} loading={loading} disabled={loading}>
                  Send Reset Link
                </AppButton>
              </View>
            </>
          )}

          <View style={styles.footer}>
            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
              Remember your password?{' '}
            </Text>
            <Link href="/(auth)/sign-in" asChild>
              <Pressable>
                <Text variant="bodySmall" style={{ color: colors.primary, fontFamily: Fonts.label }}>
                  LOG IN
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    gap: 32,
  },
  brand: {
    fontFamily: Fonts.display,
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -1,
  },
  hero: {
    gap: 8,
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  form: {
    gap: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
