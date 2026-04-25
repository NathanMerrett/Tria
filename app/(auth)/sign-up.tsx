import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Checkbox,
  HelperText,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { z } from 'zod';

import { signInWithGoogle, signInWithStrava, signUpWithEmail } from '@/features/auth/lib/auth';
import { useAuthAction } from '@/features/auth/hooks/use-auth-action';
import { AppButton } from '@/shared/components/app-button';
import { AuthDivider } from '@/shared/components/auth-divider';
import { FormField } from '@/shared/components/form-field';
import { GoogleIcon } from '@/shared/components/icons/google-icon';
import { Fonts } from '@/shared/constants/theme';

const schema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Must be at least 8 characters'),
});

type FieldErrors = Partial<Record<'fullName' | 'email' | 'password', string>>;

export default function SignUpScreen() {
  const { colors } = useTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const { loading, setLoading, error, setError, run } = useAuthAction();

  async function handleEmailSignUp() {
    const result = schema.safeParse({ fullName, email, password });
    if (!result.success) {
      const flat = z.flattenError(result.error).fieldErrors;
      setFieldErrors({
        fullName: flat.fullName?.[0],
        email: flat.email?.[0],
        password: flat.password?.[0],
      });
      return;
    }
    setFieldErrors({});
    setError(null);
    setLoading('email');
    try {
      await signUpWithEmail(email, password, fullName);
    } catch (e: any) {
      const msg: string = e?.message ?? '';
      if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('already exists')) {
        setFieldErrors({ email: 'An account already exists with this email.' });
      } else {
        setError(msg || 'Sign up failed. Please try again.');
      }
    } finally {
      setLoading(null);
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
          {/* Branding */}
          <Text style={[styles.brand, { color: colors.primary }]}>Tria</Text>

          {/* Hero */}
          <View style={styles.hero}>
            <Text style={[styles.heroTitle, { color: colors.onBackground }]}>
              {'START YOUR\n'}
              <Text style={[styles.heroTitle, { color: colors.primary }]}>16-WEEK </Text>
              {'JOURNEY'}
            </Text>
            <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
              Elite triathlon performance starts here.
            </Text>
          </View>

          {/* OAuth */}
          <View style={styles.oauth}>
            <TouchableRipple
              onPress={() => run('strava', signInWithStrava)}
              disabled={!!loading}
              style={[styles.stravaCard, { backgroundColor: colors.primary }]}
              borderless
            >
              <View style={styles.stravaInner}>
                <View style={[styles.stravaIconWrap, { backgroundColor: '#FC4C02' }]}>
                  <MaterialCommunityIcons name="run-fast" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.stravaText}>
                  <Text variant="labelSmall" style={[styles.stravaEyebrow, { color: colors.onPrimary }]}>
                    CONNECTED TRAINING
                  </Text>
                  <Text style={[styles.stravaLabel, { color: colors.onPrimary }]}>
                    Sync Strava Data
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={22} color={colors.onPrimary} />
              </View>
            </TouchableRipple>

            <AppButton
              variant="outlined"
              onPress={() => run('google', signInWithGoogle)}
              loading={loading === 'google'}
              disabled={!!loading}
              icon={() => <GoogleIcon size={18} />}
            >
              Sign up with Google
            </AppButton>
          </View>

          {/* Divider */}
          <AuthDivider label="OR EMAIL SIGNUP" />

          {/* Form */}
          <View style={styles.form}>
            <FormField
              label="Athlete Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Full Name"
              autoComplete="name"
              autoCapitalize="words"
              errorMessage={fieldErrors.fullName}
            />

            <FormField
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="athlete@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              errorMessage={fieldErrors.email}
            />

            <FormField
              label="Password"
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
              errorMessage={fieldErrors.password}
            />

            {error && (
              <HelperText type="error" visible padding="none">
                {error}
              </HelperText>
            )}

            {/* Terms */}
            <Pressable style={styles.terms} onPress={() => setAgreed((v) => !v)}>
              <View
                style={[
                  styles.checkboxWrap,
                  {
                    backgroundColor: colors.surfaceVariant,
                    borderColor: agreed ? colors.primary : colors.outlineVariant,
                  },
                ]}
              >
                <Checkbox
                  status={agreed ? 'checked' : 'unchecked'}
                  color={colors.primary}
                />
              </View>
              <Text variant="bodySmall" style={[styles.termsText, { color: colors.onSurfaceVariant }]}>
                {'I agree to the '}
                <Text variant="bodySmall" style={{ color: colors.primary }}>Terms of Performance</Text>
                {' and '}
                <Text variant="bodySmall" style={{ color: colors.primary }}>Privacy Protocol</Text>
                {'.'}
              </Text>
            </Pressable>

            <AppButton
              onPress={handleEmailSignUp}
              loading={loading === 'email'}
              disabled={!agreed || !!loading}
            >
              Create Account
            </AppButton>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
              Already have an account?{' '}
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
  heroTitle: {
    fontFamily: Fonts.display,
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -1,
  },
  oauth: {
    gap: 12,
  },
  stravaCard: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  stravaInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  stravaIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stravaText: {
    flex: 1,
    gap: 2,
  },
  stravaEyebrow: {
    letterSpacing: 1,
  },
  stravaLabel: {
    fontFamily: Fonts.title,
    fontSize: 15,
  },
  form: {
    gap: 16,
  },
  terms: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
