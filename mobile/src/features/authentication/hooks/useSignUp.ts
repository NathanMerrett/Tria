import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../api/authService';

export const useSignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signUpMutation = useMutation({
        mutationFn: authService.signUp,
        onSuccess: () => {
            // Logic specific to Signup: Verify email prompt
            Alert.alert('Success!', 'Please check your email to verify your account.', [
                { text: 'OK', onPress: () => router.replace('/(auth)/login') }
            ]);
        },
        onError: (error: Error) => {
            Alert.alert('Sign up failed', error.message);
        },
    });

    // Dev Bypass
    useEffect(() => {
        if (__DEV__) {
            setUsername('TestUser');
            setEmail(`test${Math.floor(Math.random() * 1000)}@example.com`); // Random email to avoid "User exists" errors
            setPassword('password123');
        }
    }, []);

    const handleSignUp = () => {
        if (!email || !password || !username) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        signUpMutation.mutate({
            email,
            password,
            options: { data: { username } }
        });
    };

    return {
        username, setUsername,
        email, setEmail,
        password, setPassword,
        isLoading: signUpMutation.isPending,
        handleSignUp,
    };
};