import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, List, Divider, useTheme } from 'react-native-paper';
import { useProfile } from '@/src/features/athlete/hooks/useProfile';
import { useLogout } from '@/src/features/authentication/hooks/useLogout';
import { UserAvatar } from '@/src/features/athlete/components/UserAvatar';
import { router } from 'expo-router';

export default function ProfileScreen() {
    const theme = useTheme();
    const { data: profile } = useProfile();
    const { handleLogout, isLoading: isLoggingOut } = useLogout();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                {/* 1. Top Section: Big Avatar & Name */}
                <View style={styles.header}>
                    <UserAvatar
                        firstName={profile?.first_name}
                        lastName={profile?.last_name}
                        size={80}
                    />
                    <Text variant="headlineSmall" style={styles.name}>
                        {profile?.first_name} {profile?.last_name}
                    </Text>
                    <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
                        {profile?.role === 'admin' ? 'Admin Access' : 'Athlete'}
                    </Text>
                </View>

                <Divider />

                {/* 2. Menu Options */}
                <View style={styles.menu}>
                    <List.Section>
                        <List.Subheader>Settings</List.Subheader>

                        {/* Example: Navigate to an Edit screen */}
                        <List.Item
                            title="Edit Profile"
                            left={(props) => <List.Icon {...props} icon="account-edit-outline" />}
                            right={(props) => <List.Icon {...props} icon="chevron-right" />}
                            onPress={() => router.push('/profile/edit')}
                        />
                        <List.Item
                            title="Notifications"
                            left={(props) => <List.Icon {...props} icon="bell-outline" />}
                            right={(props) => <List.Icon {...props} icon="chevron-right" />}
                            onPress={() => console.log('Nav to notifications')}
                        />
                        <List.Item
                            title="App Theme"
                            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
                            right={(props) => <List.Icon {...props} icon="chevron-right" />}
                        />
                    </List.Section>
                </View>

                {/* 3. Bottom Action: Sign Out */}
                <View style={styles.footer}>
                    <Button
                        mode="outlined"
                        onPress={handleLogout}
                        loading={isLoggingOut}
                        icon="logout"
                        textColor={theme.colors.error}
                        style={{ borderColor: theme.colors.error }}
                    >
                        Sign Out
                    </Button>
                    <Text variant="labelSmall" style={styles.version}>
                        Version 1.0.0
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { alignItems: 'center', paddingVertical: 30 },
    name: { marginTop: 16, fontWeight: 'bold' },
    menu: { flex: 1 },
    footer: { padding: 20, marginBottom: 10 },
    version: { textAlign: 'center', marginTop: 10, opacity: 0.5 }
});