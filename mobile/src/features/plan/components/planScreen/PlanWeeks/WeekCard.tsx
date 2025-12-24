import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { format, parseISO, addDays, startOfWeek } from 'date-fns';
import { WeekData, WorkoutSummary } from '@/src/types/index';
import { DISCIPLINE_COLORS } from '@/src/lib/constants';

// Helper: Renders a single workout line item
const WorkoutLine = ({ workout, theme }: { workout: WorkoutSummary, theme: any }) => (
    <View style={styles.workoutLine}>
        {/* Color Indicator */}
        <View style={[styles.pillIndicator, { backgroundColor: DISCIPLINE_COLORS[workout.discipline] || theme.colors.primary }]} />

        <Text
            variant="labelSmall"
            numberOfLines={1}
            style={{ flex: 1, color: theme.colors.onSurface }}
        >
            {workout.title || workout.discipline}
        </Text>

        <Text variant="labelSmall" style={{ color: theme.colors.outline }}>
            {workout.duration_mins}m
        </Text>
    </View>
);

// Helper: Renders a specific day row (Date + Workouts)
const DayRow = ({ date, workouts, theme, isToday }: any) => {
    const isRestDay = workouts.length === 0;

    return (
        <View style={[styles.dayRow, isToday && { backgroundColor: theme.colors.elevation.level2 }]}>
            {/* Left: Date Label */}
            <View style={styles.dateColumn}>
                <Text
                    style={[
                        styles.dayText,
                        { color: isToday ? theme.colors.primary : theme.colors.onSurfaceVariant, fontWeight: isToday ? 'bold' : 'normal' }
                    ]}
                >
                    {format(date, 'EEE').toUpperCase()}
                </Text>
                <Text style={{ fontSize: 10, color: theme.colors.outline }}>
                    {format(date, 'd')}
                </Text>
            </View>

            {/* Right: Workouts List */}
            <View style={styles.workoutsColumn}>
                {!isRestDay ? (
                    workouts.map((w: WorkoutSummary) => (
                        <WorkoutLine key={w.id} workout={w} theme={theme} />
                    ))
                ) : (
                    <View style={styles.workoutLine}>
                        <View style={[styles.pillIndicator, { backgroundColor: 'transparent', borderColor: theme.colors.outlineVariant, borderWidth: 1 }]} />
                        <Text style={{ fontSize: 11, color: theme.colors.outlineVariant, fontStyle: 'italic' }}>Rest Day</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export const PlanWeekCard = ({ week, onPress }: { week: WeekData, onPress: () => void }) => {
    const theme = useTheme();

    const isActive = week.status === 'active';
    const isCompleted = week.status === 'completed';

    // Opacity Logic: Fade out if completed
    const containerOpacity = isCompleted ? 0.5 : 1;

    // Dates Calculation
    const startDate = week.workouts.length ? parseISO(week.workouts[0].date) : new Date();
    const todayStr = format(new Date(), 'yyyy-MM-dd');

    const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const currentDate = addDays(startOfWeek(startDate, { weekStartsOn: 1 }), i);
        const dateStr = format(currentDate, 'yyyy-MM-dd');
        return {
            date: currentDate,
            workouts: week.workouts.filter(w => w.date.startsWith(dateStr)),
            isToday: dateStr === todayStr
        };
    });

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={[
                styles.container,
                {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.outlineVariant,
                    opacity: containerOpacity,
                    borderWidth: isActive ? 2 : 1,
                }
            ]}
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text variant="titleSmall" style={{ color: isActive ? theme.colors.primary : theme.colors.onSurface }}>
                        Week {week.weekNumber}
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                        {Math.floor(week.totalDuration / 60)}h {week.totalDuration % 60}m Volume
                    </Text>
                </View>
                {isActive && (
                    <View style={{ backgroundColor: theme.colors.primaryContainer, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                        <Text style={{ fontSize: 9, color: theme.colors.onPrimaryContainer, fontWeight: 'bold' }}>CURRENT</Text>
                    </View>
                )}
            </View>

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: theme.colors.outlineVariant, opacity: 0.2, marginBottom: 8 }} />

            {/* Agenda List */}
            <View style={styles.listContainer}>
                {weekDays.map((day, i) => (
                    <DayRow
                        key={i}
                        date={day.date}
                        workouts={day.workouts}
                        theme={theme}
                        isToday={day.isToday}
                    />
                ))}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        borderRadius: 12,
        padding: 12,
        // No shadow, simple border logic handled inline
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    listContainer: {
        gap: 4,
    },
    dayRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 4,
    },
    dateColumn: {
        width: 35,
        alignItems: 'center',
        marginRight: 8,
        paddingTop: 3,
    },
    dayText: {
        fontSize: 10,
        fontWeight: '600',
    },
    workoutsColumn: {
        flex: 1,
        gap: 2,
    },
    workoutLine: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 18,
    },
    pillIndicator: {
        width: 3,
        height: '80%',
        borderRadius: 1.5,
        marginRight: 6
    }
});