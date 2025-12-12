import { AppState, Platform } from 'react-native';
import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store'; // <--- CHANGED
import { createClient } from '@supabase/supabase-js';

// 1. Validated Env Vars
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ Missing Supabase URL or Key in .env file');
}

// 2. Custom Secure Adapter
// SecureStore doesn't match the exact API of AsyncStorage, so we wrap it.
const ExpoSecureAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 3. Use Secure Storage for Mobile, nothing for web (defaults to LocalStorage)
    ...(Platform.OS !== "web" ? { storage: ExpoSecureAdapter } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// 4. App State Listener (Your existing logic is perfect)
if (Platform.OS !== "web") {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}