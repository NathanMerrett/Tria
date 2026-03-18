import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

import { supabase } from '@/shared/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

async function signInWithProvider(provider: 'google' | 'strava') {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'tria',
    path: 'callback',
  });

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

export async function handleOAuthCallback(url: string) {
  // Extract just the code parameter — exchangeCodeForSession needs the code, not the full URL
  const params = new URLSearchParams(url.split('?')[1] ?? '');
  const code = params.get('code');
  if (!code) throw new Error('No code found in OAuth callback URL');
  const { error } = await supabase.auth.exchangeCodeForSession(code);
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
