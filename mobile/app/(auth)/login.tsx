import { useState } from 'react';
import { View, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Link, router } from 'expo-router';
import { TextInput, Button, Text, Appbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const signIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert('Login failed', error.message);
      return;
    }
    router.replace('/(tabs)');
  };

  return (
    // CHANGE #1: Set the root container's background color explicitly.
    // This ensures the entire screen, including the area behind the status bar, is the correct color.
    <View style={[styles.rootContainer, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.BackAction 
          onPress={() => router.navigate("/")} 
          color={theme.colors.onSurface} 
        /> 
      </Appbar.Header>

      <SafeAreaView style={styles.contentSafeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.formContainer}>
            <Text variant="displayMedium" style={[styles.title, { color: theme.colors.primary }]}>
              Welcome!
            </Text>
            <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Sign in to continue
            </Text>

            {/* --- No changes to the form itself --- */}

            <TextInput
              style={styles.input}
              mode='outlined'
              label="Email"
              value={email}
              onChangeText={setEmail}
              left={<TextInput.Icon icon="email-outline" />}
              keyboardType="email-address"
              autoCapitalize="none"
              disabled={loading}
            />

            <TextInput
              style={styles.input}
              mode='outlined'
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              left={<TextInput.Icon icon="lock-outline" />}
              disabled={loading}
            />

            <Button 
              style={styles.button}
              mode='contained' 
              onPress={signIn} 
              loading={loading}
            >
              Sign In
            </Button>

            <Link href="/(auth)/signup" asChild>
              <Button 
                style={styles.signUpButton}
                mode='text'
              >
                Don't have an account? Sign Up
              </Button>
            </Link>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  // CHANGE #4: Added a new style for the Appbar.
  appbarHeader: {
    backgroundColor: 'transparent', // Make it transparent to show the root view's color
    elevation: 0, // Remove shadow on Android
    shadowOpacity: 0, // Remove shadow on iOS
    borderBottomWidth: 0, // Remove potential border
  },
  contentSafeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  signUpButton: {
    marginTop: 16,
  }
});