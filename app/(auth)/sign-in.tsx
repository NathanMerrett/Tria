import { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { Text, TextInput, Divider, useTheme } from 'react-native-paper';
import { AppButton } from '@/shared/components/app-button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

import { GoogleIcon } from '@/features/auth/components/google-icon';
import { StravaIcon } from '@/features/auth/components/strava-icon';
import { signInWithEmail, signInWithGoogle, signInWithStrava } from '@/features/auth/lib/auth';
import { Fonts } from '@/shared/constants/theme';

type LoadingState = 'email' | 'google' | 'strava' | null;

export default function SignInScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<LoadingState>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAuth(provider: LoadingState, fn: () => Promise<void>) {
    setLoading(provider);
    setError(null);
    try {
      await fn();
    } catch (e: any) {
      setError(e?.message ?? 'Sign in failed. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Branding */}
          <View style={styles.header}>
            <Text style={[styles.brand, { color: colors.primary }]}>Tria</Text>
            <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
              {'ENGINEERED FOR THE '}
              <Text variant="bodyMedium" style={{ color: colors.primary }}>ATHLETE</Text>
              {'.'}
            </Text>
          </View>

          {/* Welcome */}
          <View style={styles.welcome}>
            <Text style={[styles.welcomeTitle, { color: colors.onBackground }]}>
              Welcome Back
            </Text>
            <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
              Log in to sync your performance data.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text variant="labelSmall" style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                placeholder="name@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                left={<TextInput.Icon icon="at" color={() => colors.onSurfaceVariant} />}
                style={styles.input}
                outlineStyle={styles.inputOutline}
              />
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text variant="labelSmall" style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>
                  Password
                </Text>
                <Link href="/(auth)/forgot-password" asChild>
                  <Pressable>
                    <Text variant="labelSmall" style={{ color: colors.primary, fontFamily: Fonts.label }}>
                      FORGOT?
                    </Text>
                  </Pressable>
                </Link>
              </View>
              <TextInput
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                autoComplete="password"
                left={<TextInput.Icon icon="lock-outline" color={() => colors.onSurfaceVariant} />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    color={() => colors.onSurfaceVariant}
                    onPress={() => setShowPassword((v) => !v)}
                  />
                }
                style={styles.input}
                outlineStyle={styles.inputOutline}
              />
            </View>

            {error && (
              <Text variant="bodySmall" style={{ color: colors.error }}>
                {error}
              </Text>
            )}

            <AppButton
              onPress={() => handleAuth('email', () => signInWithEmail(email, password))}
              loading={loading === 'email'}
              disabled={!!loading}
              style={styles.loginButton}
            >
              Login →
            </AppButton>
          </View>

          {/* Social */}
          <View style={styles.social}>
            <View style={styles.dividerRow}>
              <Divider style={styles.dividerLine} />
              <Text variant="labelSmall" style={[styles.dividerLabel, { color: colors.onSurfaceVariant }]}>
                OR CONTINUE WITH
              </Text>
              <Divider style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <AppButton
                variant="outlined"
                onPress={() => handleAuth('strava', signInWithStrava)}
                loading={loading === 'strava'}
                disabled={!!loading}
                icon={() => <StravaIcon size={18} />}
                style={styles.socialButton}
              >
                Strava
              </AppButton>
              <AppButton
                variant="outlined"
                onPress={() => handleAuth('google', signInWithGoogle)}
                loading={loading === 'google'}
                disabled={!!loading}
                icon={() => <GoogleIcon size={18} />}
                style={styles.socialButton}
              >
                Google
              </AppButton>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
              New to Tria?{' '}
            </Text>
            <Link href="/(auth)/sign-up" asChild>
              <Pressable>
                <Text variant="bodySmall" style={{ color: colors.primary, fontFamily: Fonts.label }}>
                  CREATE ACCOUNT
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
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    gap: 32,
  },
  header: {
    gap: 6,
  },
  brand: {
    fontFamily: Fonts.display,
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -1,
  },
  welcome: {
    gap: 6,
  },
  welcomeTitle: {
    fontFamily: Fonts.heading,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    backgroundColor: 'transparent',
  },
  inputOutline: {
    borderRadius: 8,
  },
  loginButton: {
    marginTop: 4,
  },
  social: {
    gap: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dividerLine: {
    flex: 1,
  },
  dividerLabel: {
    letterSpacing: 1,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
