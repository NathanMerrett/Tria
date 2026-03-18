import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Divider, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SocialSignInButton } from '@/features/auth/components/social-sign-in-button';
import { signInWithGoogle, signInWithStrava } from '@/features/auth/lib/auth';

export default function SignInScreen() {
  const [loading, setLoading] = useState<'google' | 'strava' | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    setLoading('google');
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e: any) {
      setError(e?.message ?? 'Sign in failed. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  async function handleStrava() {
    setLoading('strava');
    setError(null);
    try {
      await signInWithStrava();
    } catch (e: any) {
      setError(e?.message ?? 'Sign in failed. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.hero}>
          <Text style={styles.logo}>
            Tria
          </Text>
          <Text variant="bodyLarge" style={styles.tagline}>
            Your triathlon training companion
          </Text>
        </View>

        <View style={styles.authCard}>
          <Text variant="headlineSmall" style={styles.heading}>
            Sign in to get started
          </Text>
<View style={styles.buttons}>
            <SocialSignInButton
              provider="google"
              onPress={handleGoogle}
              loading={loading === 'google'}
            />
            <Divider style={styles.divider} />
            <SocialSignInButton
              provider="strava"
              onPress={handleStrava}
              loading={loading === 'strava'}
            />
          </View>

          <Text variant="bodySmall" style={styles.terms}>
            By signing in you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </View>

      <Snackbar
        visible={!!error}
        onDismiss={() => setError(null)}
        duration={4000}
        action={{ label: 'Dismiss', onPress: () => setError(null) }}
      >
        {error}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 40,
  },
  hero: {
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    color: '#38BDF8',
    fontWeight: '800',
    letterSpacing: -1,
    fontSize: 56,
    lineHeight: 68,
  },
  tagline: {
    color: '#94A3B8',
    textAlign: 'center',
  },
  authCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    gap: 12,
  },
  heading: {
    color: '#F8FAFC',
    fontWeight: '700',
  },
  subheading: {
    color: '#94A3B8',
    marginBottom: 4,
  },
  buttons: {
    gap: 4,
    marginVertical: 8,
  },
  divider: {
    marginVertical: 4,
    backgroundColor: '#334155',
  },
  terms: {
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
});
