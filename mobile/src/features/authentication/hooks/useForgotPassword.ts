import { useState } from 'react';
import { Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../api/authService';
import { router } from 'expo-router';

export const useForgotPassword = () => {
    const [email, setEmail] = useState('');

    const resetMutation = useMutation({
        mutationFn: authService.resetPassword,
        onSuccess: () => {
            Alert.alert(
                'Check your email',
                'If an account exists, we have sent a password reset link.',
                [{ text: 'Back to Login', onPress: () => router.back() }]
            );
        },
        onError: (error: Error) => {
            Alert.alert('Error', error.message);
        },
    });

    const handleReset = () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }
        resetMutation.mutate(email);
    };

    return {
        email,
        setEmail,
        isLoading: resetMutation.isPending,
        handleReset,
    };
};