import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { Link } from 'expo-router';

interface SignUpFormProps {
    username: string;
    onUsernameChange: (text: string) => void;
    email: string;
    onEmailChange: (text: string) => void;
    password: string;
    onPasswordChange: (text: string) => void;
    isLoading: boolean;
    onSubmit: () => void;
}

export const SignUpForm = ({
    username, onUsernameChange,
    email, onEmailChange,
    password, onPasswordChange,
    isLoading, onSubmit
}: SignUpFormProps) => {
    const theme = useTheme();

    return (
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
                onChangeText={onUsernameChange}
                left={<TextInput.Icon icon="account-outline" />}
                autoCapitalize="none"
                disabled={isLoading}
                style={styles.input}
            />
            <TextInput
                label="Email"
                mode='outlined'
                value={email}
                onChangeText={onEmailChange}
                left={<TextInput.Icon icon="email-outline" />}
                keyboardType="email-address"
                autoCapitalize="none"
                disabled={isLoading}
                style={styles.input}
            />
            <TextInput
                label="Password"
                mode='outlined'
                value={password}
                onChangeText={onPasswordChange}
                secureTextEntry
                left={<TextInput.Icon icon="lock-outline" />}
                disabled={isLoading}
                style={styles.input}
            />

            <Button mode='contained' onPress={onSubmit} loading={isLoading} disabled={isLoading} style={styles.button}>
                Sign Up
            </Button>

            <Link href="/(auth)/login" asChild>
                <Button mode='text' disabled={isLoading} style={styles.link}>
                    Already have an account? Log In
                </Button>
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
    title: { textAlign: 'center', marginBottom: 8 },
    subtitle: { textAlign: 'center', marginBottom: 32 },
    input: { marginBottom: 16 },
    button: { marginTop: 16 },
    link: { marginTop: 8 },
});