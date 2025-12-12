// src/features/schedule/components/WorkoutCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Workout } from '@/src/types';
import { useTheme } from 'react-native-paper';

interface WorkoutCardProps {
    workout: Workout;
    onToggle: (id: string, newStatus: boolean) => void;
    onPress: (id: string) => void;
}

export const WorkoutCard = ({ workout, onToggle, onPress }: WorkoutCardProps) => {
    const theme = useTheme();

    // 1. GET COLOR FROM THEME
    // Cast strict keys or fallback to 'other'
    const disciplineKey = workout.discipline as keyof typeof theme.colors.discipline;
    const stripeColor = theme.colors.discipline[disciplineKey] || theme.colors.discipline.other;

    const dateStr = new Intl.DateTimeFormat('en-GB', {
        weekday: 'long', day: 'numeric', month: 'short'
    }).format(new Date(workout.date)).toLowerCase();

    return (
        <View style={[
            styles.cardContainer,
            {
                borderLeftColor: stripeColor,
                backgroundColor: theme.colors.surface,
                // 2. APPLY THEME BORDER HERE
                borderColor: theme.colors.outline,
                borderWidth: 1,
            }
        ]}>

            {/* AREA 1: Body */}
            <Pressable
                style={styles.clickableBody}
                onPress={() => onPress(workout.id)}
                android_ripple={{ color: theme.colors.onSurface }}
            >
                <View style={styles.content}>
                    <Text style={[styles.meta, { color: theme.colors.onSurfaceVariant }]}>
                        {dateStr} • {workout.duration_mins} mins
                    </Text>

                    <Text style={[styles.title, { color: theme.colors.onSurface }]} numberOfLines={1}>
                        {workout.title}
                    </Text>

                    <Text style={[styles.desc, { color: theme.colors.onSurfaceVariant }]} numberOfLines={1}>
                        {workout.description}
                    </Text>
                </View>
            </Pressable>

            {/* AREA 2: Checkbox */}
            <Pressable
                style={styles.checkboxArea}
                onPress={() => onToggle(workout.id, !workout.completed)}
                hitSlop={20}
            >
                <Ionicons
                    name={workout.completed ? "checkbox" : "square-outline"}
                    size={32}
                    color={workout.completed ? stripeColor : theme.colors.onSurfaceDisabled}
                />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        borderRadius: 16,
        marginBottom: 16,
        borderLeftWidth: 6,

        // Shadow (subtle on dark mode, but good to keep)
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2, // Slightly higher for dark mode visibility
        shadowRadius: 6,
        elevation: 4,
        overflow: 'hidden',
    },
    clickableBody: {
        flex: 1,
        paddingVertical: 24,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    checkboxArea: {
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    divider: {
        width: 1,
        height: '70%',
        marginRight: 14,
        opacity: 0.5, // Make the divider slightly subtle
    },
    content: {
        justifyContent: 'center',
    },
    meta: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 12,
        textTransform: 'lowercase',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 6,
        lineHeight: 24,
    },
    desc: {
        fontSize: 14,
        lineHeight: 20,
    },
});