import { QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { useAuthStore } from '@/features/auth/store/auth-store';
import { AppDarkTheme, AppLightTheme } from '@/shared/constants/theme';
import { queryClient } from '@/shared/lib/query-client';
import { supabase } from '@/shared/lib/supabase';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AuthGate() {
  const { session, isLoading, setSession, setLoading } = useAuthStore();
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

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, [setSession, setLoading]);

  // Handle redirects — only re-run when auth state changes, not on every navigation
  useEffect(() => {
    if (isLoading) return;

    const inAuth = segmentsRef.current[0] === '(auth)';

    if (!session) {
      if (!inAuth) router.replace('/(auth)/sign-in');
    } else {
      if (inAuth) router.replace('/(tabs)');
    }
  }, [session, isLoading, router]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? AppDarkTheme : AppLightTheme;

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <AuthGate />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </PaperProvider>
    </QueryClientProvider>
  );
}
