import { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase'; // Adjust path if needed
import { Link, router } from 'expo-router';
import {
  PaperProvider,
  TextInput,
  Button,
  Text,
} from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Import our shared components & theme
import PrimaryButton from '../../components/PrimaryButton'; // Adjust path
import { theme } from '../../theme'; // Adjust path

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      Alert.alert('Login failed', error.message);
      return;
    }
    router.replace('/(tabs)/today');
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Text variant="headlineMedium" style={styles.title}>
              Welcome!
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Sign in to continue
            </Text>

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              left={<TextInput.Icon icon="email-outline" />}
              keyboardType="email-address"
              autoCapitalize="none"
              disabled={loading}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
              left={<TextInput.Icon icon="lock-outline" />}
              disabled={loading}
            />

            <PrimaryButton title="Log In" onPress={signIn} loading={loading} />
            
            <Link href="/signup" asChild>
              <Button
                  style={styles.secondaryButton}
                  labelStyle={{ color: theme.colors.primary }}
                  disabled={loading}
              >
                Don't have an account? Sign Up
              </Button>
            </Link>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
  },
  secondaryButton: {
    marginTop: 16,
  },
});