import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Workout } from '@/src/types';

interface WorkoutDetailHeaderProps {
    workout: Workout;
}

export const WorkoutDetailHeader = ({ workout }: WorkoutDetailHeaderProps) => {
    const theme = useTheme();

    // Determine color based on discipline
    // Note: This logic parallels WorkoutCard.tsx. In a larger app, we'd move this to a utility.
    const disciplineKey = workout.discipline as keyof typeof theme.colors.discipline;
    const disciplineColor = theme.colors.discipline[disciplineKey] || theme.colors.discipline.other;

    const dateStr = new Date(workout.date).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });

    const getIconName = (d: string) => {
        switch (d) {
            case 'swim': return 'water-outline';
            case 'bike': return 'bicycle-outline';
            case 'run': return 'walk-outline'; // or flamer-outline
            default: return 'barbell-outline';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.iconContainer, { backgroundColor: disciplineColor }]}>
                <Ionicons name={getIconName(workout.discipline)} size={40} color="#FFF" />
            </View>

            <View style={styles.content}>
                <Text style={[styles.date, { color: theme.colors.onSurfaceVariant }]}>
                    {dateStr}
                </Text>
                <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                    {workout.title}
                </Text>
                <View style={styles.metrics}>
                    <Ionicons name="time-outline" size={16} color={theme.colors.onSurfaceVariant} />
                    <Text style={[styles.metricText, { color: theme.colors.onSurfaceVariant }]}>
                        {workout.duration_mins} mins
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 24,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    content: {
        flex: 1,
    },
    date: {
        fontSize: 14,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontWeight: '600',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        lineHeight: 32,
    },
    metrics: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metricText: {
        marginLeft: 6,
        fontSize: 16,
    }
});
