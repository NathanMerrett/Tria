import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { supabase } from '@/shared/lib/supabase';

// In Expo Go the custom scheme isn't registered — use the exp+ scheme instead.
// In a native build, use the real app scheme.
const redirectUri =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient
    ? 'exp+tria://callback'
    : AuthSession.makeRedirectUri({ scheme: 'tria', path: 'callback' });

WebBrowser.maybeCompleteAuthSession();

export type LoadingState = 'email' | 'google' | 'strava' | null;

async function signInWithProvider(provider: 'google' | 'strava') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as any,
    options: {
      redirectTo: redirectUri,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (!data.url) throw new Error('No OAuth URL returned');

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
  if (result.type === 'success' && result.url) {
    await handleOAuthCallback(result.url);
  }
}

export async function signInWithGoogle() {
  return signInWithProvider('google');
}

export async function signInWithStrava() {
  return signInWithProvider('strava');
}

export async function exchangeCode(code: string) {
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) throw error;
}

export async function handleOAuthCallback(url: string) {
  const params = new URLSearchParams(url.split('?')[1] ?? '');
  const code = params.get('code');
  if (!code) throw new Error('No code found in OAuth callback URL');
  return exchangeCode(code);
}

export async function signInWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectUri });
  if (error) throw error;
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function refreshSession() {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) throw error;
  return data.session;
}
