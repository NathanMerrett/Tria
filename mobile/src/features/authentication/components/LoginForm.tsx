import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { Link } from 'expo-router';

interface LoginFormProps {
    email: string;
    onEmailChange: (text: string) => void;
    password: string;
    onPasswordChange: (text: string) => void;
    isLoading: boolean; // Changed from 'loading' to match generic terms
    onSubmit: () => void;
}

export const LoginForm = ({
    email,
    onEmailChange,
    password,
    onPasswordChange,
    isLoading,
    onSubmit,
}: LoginFormProps) => {
    const theme = useTheme();

    return (
        <View style={styles.formContainer}>
            <Text variant="displayMedium" style={[styles.title, { color: theme.colors.primary }]}>
                Welcome!
            </Text>

            <TextInput
                style={styles.input}
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={onEmailChange}
                autoCapitalize="none"
                disabled={isLoading} // Disable inputs while mutating
            />

            <TextInput
                style={styles.input}
                mode="outlined"
                label="Password"
                value={password}
                onChangeText={onPasswordChange}
                secureTextEntry
                disabled={isLoading}
            />
            <Link href="/(auth)/ForgotPassword" asChild>
                <Button mode="text">Forgot Password?</Button>
            </Link>

            <Button
                style={styles.button}
                mode="contained"
                onPress={onSubmit}
                loading={isLoading}
                disabled={isLoading}
            >
                Sign In
            </Button>

            {__DEV__ && (
                <Text style={{ textAlign: 'center', marginTop: 10, color: 'red' }}>
                    [DEV MODE]: Credentials pre-filled
                </Text>
            )}

            <Link href="/(auth)/signup" asChild>
                <Button style={styles.signUpButton} mode="text">
                    Don't have an account? Sign Up
                </Button>
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
    title: { textAlign: 'center' },
    input: { marginBottom: 16 },
    button: { marginTop: 8 },
    signUpButton: { marginTop: 16 },
});