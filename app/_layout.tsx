import { useEffect, useRef } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import {
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
} from '@expo-google-fonts/lexend';
import 'react-native-reanimated';

import { useAuthStore } from '@/features/auth/store/auth-store';
import { AppDarkTheme } from '@/shared/constants/theme';
import { queryClient } from '@/shared/lib/query-client';
import { supabase } from '@/shared/lib/supabase';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function AuthGate() {
  const { session, isLoading, recoveryMode, setSession, setLoading, setRecoveryMode } = useAuthStore();
  const segments = useSegments();
  const segmentsRef = useRef(segments);
  segmentsRef.current = segments;
  const router = useRouter();

  // Bootstrap auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true);
        setSession(newSession);
        return;
      }
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, [setSession, setLoading, setRecoveryMode]);

  // Handle redirects — only re-run when auth state changes, not on every navigation
  useEffect(() => {
    if (isLoading) return;

    const inAuth = segmentsRef.current[0] === '(auth)';
    const onResetScreen = segmentsRef.current[1] === 'reset-password';

    if (recoveryMode) {
      if (!onResetScreen) router.replace('/(auth)/reset-password');
      return;
    }

    if (!session) {
      if (!inAuth) router.replace('/(auth)/sign-in');
    } else {
      if (inAuth) router.replace('/(tabs)');
    }
  }, [session, isLoading, recoveryMode, router]);

  return null;
}

export default function RootLayout() {
  const theme = AppDarkTheme;

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <AuthGate />
        <Stack screenOptions={{ contentStyle: { backgroundColor: theme.colors.background } }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </PaperProvider>
    </QueryClientProvider>
  );
}
