import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// This component accepts "children" (the form)
export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    const theme = useTheme();

    return (
        <View style={[styles.rootContainer, { backgroundColor: theme.colors.background }]}>
            <Appbar.Header style={styles.appbarHeader}>
                <Appbar.BackAction onPress={() => router.navigate("/")} color={theme.colors.onSurface} />
            </Appbar.Header>

            <SafeAreaView style={styles.contentSafeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardAvoidingView}
                >
                    {children}
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    rootContainer: { flex: 1 },
    appbarHeader: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 },
    contentSafeArea: { flex: 1 },
    keyboardAvoidingView: { flex: 1 },
});