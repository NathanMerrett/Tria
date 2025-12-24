import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme, Icon, Divider } from 'react-native-paper';
import { format, parseISO } from 'date-fns';
import { PlanProgressBar } from './PlanProgressBar';
import { RaceCountdown } from './RaceCountdown';
import { PlanStats } from './PlanStats';

interface PlanOverviewCardProps {
    planName: string;
    raceDate: string; // ISO string
    daysUntilRace: number;
    stats: {
        swimTotal: number;
        bikeTotal: number;
        runTotal: number;
        totalWeeks: number;
        currentWeek: number;
    };
}

export const PlanOverviewCard = ({
    planName,
    raceDate,
    daysUntilRace,
    stats
}: PlanOverviewCardProps) => {
    const theme = useTheme();

    const formattedDate = React.useMemo(() => {
        try {
            return format(parseISO(raceDate), 'MMMM do, yyyy');
        } catch (e) {
            return raceDate;
        }
    }, [raceDate]);

    return (
        <Card
            style={[styles.card, { borderColor: theme.colors.outlineVariant }]}
            mode="outlined" // "Outlined" looks more technical/minimal than "Elevated"
        >
            <Card.Content>
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        {/* 1. Title: Relies on Theme (Regular weight), not bold */}
                        <Text
                            variant="headlineSmall"
                            style={{ color: theme.colors.onSurface }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {planName}
                        </Text>

                        {/* 2. Metadata Row: Technical styling */}
                        <View style={styles.dateRow}>
                            <Icon source="calendar" size={14} color={theme.colors.onSurfaceVariant} />
                            <Text
                                variant="labelMedium" // Uses the wide letter-spacing from theme
                                style={{
                                    color: theme.colors.onSurfaceVariant,
                                    marginLeft: 6,
                                    textTransform: 'uppercase' // Adds to the dashboard feel
                                }}
                            >
                                {formattedDate}
                            </Text>
                        </View>
                    </View>

                    {/* 3. Countdown: No container background needed anymore */}
                    <View style={styles.countdownWrapper}>
                        <RaceCountdown daysUntilRace={daysUntilRace} />
                    </View>
                </View>

                {/* Optional: A subtle divider adds to the 'wireframe' look */}
                <Divider style={{ marginVertical: 16, backgroundColor: theme.colors.outlineVariant }} />

                {/* Progress Bar */}
                <View style={styles.section}>
                    <PlanProgressBar totalWeeks={stats.totalWeeks} currentWeek={stats.currentWeek} />
                </View>

                {/* Summary Stats */}
                <View style={styles.section}>
                    <PlanStats
                        swimTotal={stats.swimTotal}
                        bikeTotal={stats.bikeTotal}
                        runTotal={stats.runTotal}
                    />
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 16,
        borderRadius: 12, // Slightly tighter radius looks more technical
        backgroundColor: 'transparent', // Or theme.colors.surface if you want a fill
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start', // Top alignment ensures big numbers don't shift title
    },
    titleContainer: {
        flex: 1,
        marginRight: 16,
        justifyContent: 'center',
        paddingTop: 4, // Visual alignment with the large number in RaceCountdown
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    countdownWrapper: {
        // We no longer need background colors here
        // The minimalist number stands on its own
        alignItems: 'flex-end',
    },
    section: {
        marginTop: 8,
    }
});