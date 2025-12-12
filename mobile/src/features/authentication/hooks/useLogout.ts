import { Alert } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../api/authService';
import { router } from 'expo-router';

export const useLogout = () => {
    const queryClient = useQueryClient();

    const logoutMutation = useMutation({
        mutationFn: authService.signOut,
        onSuccess: () => {
            // 1. Clear all cached data (User profile, leaderboard, etc.)
            queryClient.clear();

            // 2. Navigate to login (Your _layout.tsx usually handles this automatically, but being explicit helps)
            router.replace('/(auth)/login');
        },
        onError: (error: Error) => {
            Alert.alert('Error signing out', error.message);
        },
    });

    return {
        handleLogout: () => logoutMutation.mutate(),
        isLoading: logoutMutation.isPending,
    };
};