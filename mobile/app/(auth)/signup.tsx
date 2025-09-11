import { useState } from 'react';
import { View, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../../lib/supabase'; // Adjust path if needed
import { Link, router } from 'expo-router';
import { TextInput, Button, Text, Appbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper'; // Import the useTheme hook

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme(); // Get the theme object

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
    router.replace('/(auth)/login');
  };

  return (
    // 1. Root container sets the overall background color for the screen
    <View style={[styles.rootContainer, { backgroundColor: theme.colors.background }]}>
      
      {/* 2. Appbar is styled to be transparent and flat, blending with the background */}
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.BackAction 
          onPress={() => router.navigate("/")} 
          color={theme.colors.onSurface} 
        />
      </Appbar.Header>

      {/* 3. SafeAreaView wraps only the content, not the header */}
      <SafeAreaView style={styles.contentSafeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          {/* 4. Form container centers the content */}
          <View style={styles.formContainer}>
            <Text variant="displayMedium" style={[styles.title, { color: theme.colors.primary }]}>
              Create Account
            </Text>
            <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Start your Triathlon with us
            </Text>

            <TextInput
              label="Username"
              mode='outlined'
              value={username}
              onChangeText={setUsername}
              left={<TextInput.Icon icon="account-outline"/>}
              autoCapitalize="none"
              disabled={loading}
              style={styles.input}
            />
            <TextInput
              label="Email"
              mode='outlined'
              value={email}
              onChangeText={setEmail}
              left={<TextInput.Icon icon="email-outline"/>}
              keyboardType="email-address"
              autoCapitalize="none"
              disabled={loading}
              style={styles.input}
            />
            <TextInput
              label="Password"
              mode='outlined'
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              left={<TextInput.Icon icon="lock-outline" />}
              disabled={loading}
              style={styles.input}
            />

            <Button mode='contained' onPress={signUp} loading={loading} style={styles.button}>
              Sign Up
            </Button>

            <Link href="/(auth)/login" asChild>
              <Button mode='text' disabled={loading} style={styles.link}>
                Already have an account? Log In
              </Button>
            </Link>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

// 5. Styles are updated to match the new structure
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  appbarHeader: {
    backgroundColor: 'transparent', // Make it transparent to show the root view's color
    elevation: 0, // Remove shadow on Android
    shadowOpacity: 0, // Remove shadow on iOS
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
    paddingHorizontal: 20, // Use horizontal padding
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  link: {
    marginTop: 8,
  },
});