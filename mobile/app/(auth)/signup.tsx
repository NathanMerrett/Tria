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

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    setLoading(false);

    if (error) {
      Alert.alert('Sign up failed', error.message);
      return;
    }
    Alert.alert('Success!', 'Please check your email to verify your account.');
    router.replace('/login');
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <Text variant="headlineMedium" style={styles.title}>
              Create Account
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Start your journey with us
            </Text>

            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              left={<TextInput.Icon icon="account-outline" />}
              autoCapitalize="none"
              disabled={loading}
            />
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

            <PrimaryButton title="Sign Up" onPress={signUp} loading={loading} />

            <Link href="/login" asChild>
              <Button
                style={styles.secondaryButton}
                labelStyle={{ color: theme.colors.primary }}
                disabled={loading}
              >
                Already have an account? Log In
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