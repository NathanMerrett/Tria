// src/features/plan/components/planScreen/WeekList/PlanWorkoutRow.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Icon, useTheme } from 'react-native-paper';
import { format, parseISO } from 'date-fns';
import { WorkoutSummary } from '@/src/types/index'; // Assume types are here
import { DISCIPLINE_COLORS } from '@/src/lib/constants';

interface PlanWorkoutRowProps {
    workout: WorkoutSummary;
}

export const PlanWorkoutRow = ({ workout }: PlanWorkoutRowProps) => {
    const theme = useTheme();

    // Formatting: "Mon 12"
    const dateObj = parseISO(workout.date);
    const dayName = format(dateObj, 'EEE');
    const dayNumber = format(dateObj, 'dd');

    // Discipline Color
    const disciplineColor = DISCIPLINE_COLORS[workout.discipline] || theme.colors.onSurface;

    return (
        <View style={styles.container}>
            {/* 1. Date Column (Fixed Width for alignment) */}
            <View style={styles.dateCol}>
                <Text
                    variant="labelSmall"
                    style={{ color: theme.colors.outline, textTransform: 'uppercase', fontWeight: 'bold' }}
                >
                    {dayName}
                </Text>
                <Text
                    variant="labelMedium"
                    style={{ color: theme.colors.onSurfaceVariant }}
                >
                    {dayNumber}
                </Text>
            </View>

            {/* 2. Content Column */}
            <View style={styles.contentCol}>
                <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurface }}
                    numberOfLines={1}
                >
                    {workout.title}
                </Text>

                {/* Metadata Row: Discipline • Duration */}
                <View style={styles.metaRow}>
                    <View
                        style={[styles.dot, { backgroundColor: disciplineColor }]}
                    />
                    <Text
                        variant="labelSmall"
                        style={{ color: theme.colors.outline, marginLeft: 6, textTransform: 'uppercase' }}
                    >
                        {workout.discipline} • {workout.duration_mins}m
                    </Text>
                </View>
            </View>

            {/* 3. Status Column (Key Session Star or Checkmark) */}
            <View style={styles.statusCol}>
                {workout.completed ? (
                    <Icon source="check" size={18} color={theme.colors.secondary} /> // Use secondary (Teal) for success
                ) : workout.is_key_session ? (
                    <Icon source="star" size={16} color={theme.colors.tertiary} />
                ) : null}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        // Optional: faint separator line between rows
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    dateCol: {
        width: 50,
        alignItems: 'center',
        marginRight: 12,
    },
    contentCol: {
        flex: 1,
        justifyContent: 'center',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusCol: {
        width: 30,
        alignItems: 'flex-end',
    }
});