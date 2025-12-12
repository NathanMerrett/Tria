import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';

interface ForgotPasswordFormProps {
    email: string;
    onEmailChange: (text: string) => void;
    isLoading: boolean;
    onSubmit: () => void;
}

export const ForgotPasswordForm = ({
    email,
    onEmailChange,
    isLoading,
    onSubmit,
}: ForgotPasswordFormProps) => {
    const theme = useTheme();

    return (
        <View style={styles.formContainer}>
            <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
                Reset Password
            </Text>
            <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                Enter your email to receive a reset link
            </Text>

            <TextInput
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={onEmailChange}
                autoCapitalize="none"
                keyboardType="email-address"
                left={<TextInput.Icon icon="email-outline" />}
                disabled={isLoading}
                style={styles.input}
            />

            <Button
                mode="contained"
                onPress={onSubmit}
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
            >
                Send Reset Link
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
    title: { textAlign: 'center', marginBottom: 8 },
    subtitle: { textAlign: 'center', marginBottom: 32 },
    input: { marginBottom: 16 },
    button: { marginTop: 8 },
});