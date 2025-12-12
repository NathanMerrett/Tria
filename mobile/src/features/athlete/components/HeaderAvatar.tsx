import React from 'react';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useProfile } from '../hooks/useProfile';
import { UserAvatar } from './UserAvatar';
import { ActivityIndicator } from 'react-native-paper';

export const HeaderAvatar = () => {
    const { data: profile, isLoading } = useProfile();

    const handlePress = () => {
        // Navigate to the profile settings page
        router.push('/profile');
    };

    if (isLoading) {
        return <ActivityIndicator size={20} style={{ marginRight: 15 }} />;
    }

    return (
        <TouchableOpacity onPress={handlePress} style={{ marginRight: 15 }}>
            <UserAvatar
                firstName={profile?.first_name}
                lastName={profile?.last_name}
                size={28}
            />
        </TouchableOpacity>
    );
};