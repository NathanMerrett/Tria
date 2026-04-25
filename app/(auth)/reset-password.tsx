import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { updatePassword } from '@/features/auth/lib/auth';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { AppButton } from '@/shared/components/app-button';
import { FormField } from '@/shared/components/form-field';
import { Fonts } from '@/shared/constants/theme';

export default function ResetPasswordScreen() {
  const { colors } = useTheme();
  const setRecoveryMode = useAuthStore((s) => s.setRecoveryMode);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await updatePassword(password);
      // Clear recovery mode — AuthGate will redirect to /(tabs) on the next render
      setRecoveryMode(false);
    } catch (e: unknown) {
      setError((e as any)?.message ?? 'Failed to update password. Please try again.');
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

          <View style={styles.hero}>
            <Text style={[styles.title, { color: colors.onBackground }]}>
              New Password
            </Text>
            <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
              Choose a strong password for your account.
            </Text>
          </View>

          <View style={styles.form}>
            <FormField
              label="New Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              autoComplete="new-password"
              left={<TextInput.Icon icon="lock-outline" color={() => colors.onSurfaceVariant} />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  color={() => colors.onSurfaceVariant}
                  onPress={() => setShowPassword((v) => !v)}
                />
              }
            />

            <FormField
              label="Confirm Password"
              value={confirm}
              onChangeText={setConfirm}
              placeholder="••••••••"
              secureTextEntry={!showConfirm}
              autoComplete="new-password"
              left={<TextInput.Icon icon="lock-check-outline" color={() => colors.onSurfaceVariant} />}
              right={
                <TextInput.Icon
                  icon={showConfirm ? 'eye-off' : 'eye'}
                  color={() => colors.onSurfaceVariant}
                  onPress={() => setShowConfirm((v) => !v)}
                />
              }
            />

            {error && (
              <HelperText type="error" visible padding="none">
                {error}
              </HelperText>
            )}

            <AppButton onPress={handleSubmit} loading={loading} disabled={loading}>
              Set New Password
            </AppButton>
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
});
