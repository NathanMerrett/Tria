import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { useWorkout } from '@/src/features/plan/hooks/useWorkoutDetail';
import { WorkoutDetailHeader } from '@/src/features/plan/components/WorkoutDetailHeader';

export default function WorkoutDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const theme = useTheme();
    const router = useRouter();

    const { workout, isLoading, error } = useWorkout(id!);

    if (isLoading) {
        return (
            <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (error || !workout) {
        return (
            <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
                <Text style={{ color: theme.colors.error }}>Failed to load workout.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Custom Header for Screen Stack */}
            <Stack.Screen
                options={{
                    title: workout.discipline.toUpperCase(),
                    headerBackTitle: "Back",
                    headerTintColor: theme.colors.primary,
                }}
            />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <WorkoutDetailHeader workout={workout} />

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                        Description
                    </Text>
                    <Text style={[styles.bodyText, { color: theme.colors.onSurfaceVariant }]}>
                        {workout.description}
                    </Text>
                </View>

                {/* Placeholder for future structured steps */}
                {/* <View style={styles.section}> ... </View> */}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    section: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12,
    },
    bodyText: {
        fontSize: 16,
        lineHeight: 24,
    }
});
