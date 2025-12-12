import React from 'react';
import { Avatar, useTheme } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

interface UserAvatarProps {
    firstName?: string | null;
    lastName?: string | null;
    size?: number;
}

export const UserAvatar = ({ firstName, lastName, size = 36 }: UserAvatarProps) => {
    const theme = useTheme();

    // Logic to get initials (e.g. "John Doe" -> "JD")
    const getInitials = () => {
        const f = firstName ? firstName[0].toUpperCase() : '';
        const l = lastName ? lastName[0].toUpperCase() : '';
        return f + l || '?'; // Fallback to '?' if no name
    };

    return (
        <Avatar.Text
            size={size}
            label={getInitials()}
            style={{ backgroundColor: theme.colors.primaryContainer }}
            color={theme.colors.onPrimaryContainer}
        />
    );
};