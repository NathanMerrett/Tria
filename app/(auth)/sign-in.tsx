import { Link } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { HelperText, Text, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { signInWithEmail, signInWithGoogle, signInWithStrava } from '@/features/auth/lib/auth';
import { useAuthAction } from '@/features/auth/hooks/use-auth-action';
import { AppButton } from '@/shared/components/app-button';
import { AuthDivider } from '@/shared/components/auth-divider';
import { FormField } from '@/shared/components/form-field';
import { GoogleIcon } from '@/shared/components/icons/google-icon';
import { StravaIcon } from '@/shared/components/icons/strava-icon';
import { Fonts } from '@/shared/constants/theme';

export default function SignInScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, run } = useAuthAction();

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
            <FormField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="name@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              left={<TextInput.Icon icon="at" color={() => colors.onSurfaceVariant} />}
            />

            <FormField
              label="Password"
              rightLabel={
                <Link href="/(auth)/forgot-password" asChild>
                  <Pressable>
                    <Text variant="labelSmall" style={{ color: colors.primary, fontFamily: Fonts.label }}>
                      FORGOT?
                    </Text>
                  </Pressable>
                </Link>
              }
              value={password}
              onChangeText={setPassword}
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
            />

            {error && (
              <HelperText type="error" visible padding="none">
                {error}
              </HelperText>
            )}

            <AppButton
              onPress={() => run('email', () => signInWithEmail(email, password), 'Sign in failed. Please try again.')}
              loading={loading === 'email'}
              disabled={!!loading}
              style={styles.loginButton}
            >
              Login →
            </AppButton>
          </View>

          {/* Social */}
          <View style={styles.social}>
            <AuthDivider label="OR CONTINUE WITH" />

            <View style={styles.socialButtons}>
              <AppButton
                variant="outlined"
                onPress={() => run('strava', signInWithStrava)}
                loading={loading === 'strava'}
                disabled={!!loading}
                icon={() => <StravaIcon size={18} />}
                style={styles.socialButton}
              >
                Strava
              </AppButton>
              <AppButton
                variant="outlined"
                onPress={() => run('google', signInWithGoogle)}
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
    fontSize: 40,
    lineHeight: 48,
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
  loginButton: {
    marginTop: 4,
  },
  social: {
    gap: 16,
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
