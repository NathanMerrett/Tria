import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../api/authService';

export const useLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 1. Setup TanStack Query Mutation
    const loginMutation = useMutation({
        mutationFn: authService.signIn,
        onSuccess: (data) => {
            console.log('Login Success', data);
            // Navigate only on success
            router.replace('/(tabs)');
        },
        onError: (error: Error) => {
            console.log('Login Failed', error.message);
            Alert.alert('Login Failed', error.message);
        },
    });

    // 2. Dev Bypass Logic
    useEffect(() => {
        if (__DEV__) {
            // Option A: Just pre-fill the form (Preferred)
            setEmail('dev@test.com');
            setPassword('password123');

            // Option B: Auto-login immediately (Uncomment if you want to skip the screen entirely)
            // loginMutation.mutate({ email: 'test@example.com', password: 'password123' });
        }
    }, []);

    // 3. The Handler called by the UI
    const handleSignIn = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter fields');
            return;
        }
        // Trigger the mutation
        loginMutation.mutate({ email, password });
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        // Expose React Query states nicely
        isLoading: loginMutation.isPending,
        handleSignIn,
    };
};