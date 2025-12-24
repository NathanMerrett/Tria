import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface PlanProgressBarProps {
    totalWeeks: number;
    currentWeek: number;
}

export const PlanProgressBar = ({ totalWeeks, currentWeek }: PlanProgressBarProps) => {
    const theme = useTheme();

    const getSegmentColor = (index: number) => {
        const activeIndex = currentWeek - 1;

        if (index < activeIndex) {
            return theme.colors.primary; // Completed: Brand Color
        } else if (index === activeIndex) {
            return theme.colors.onSurface; // Current: White (Acts as a bright "cursor")
        } else {
            return theme.colors.surfaceVariant; // Future: Dark Grey background
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.labelContainer}>
                {/* Label Styling:
                    1. Uses 'labelMedium' for the wide tracking defined in your theme.
                    2. 'uppercase' gives it the dashboard aesthetic.
                    3. Nesting Text allows us to mix Grey label with White data.
                */}
                <Text
                    variant="labelMedium"
                    style={{
                        color: theme.colors.onSurfaceVariant,
                        textTransform: 'uppercase'
                    }}
                >
                    Week <Text style={{ color: theme.colors.onSurface }}>{currentWeek}</Text> / {totalWeeks}
                </Text>

                {/* Optional: Calculate % for a complete dashboard feel */}
                <Text
                    variant="labelMedium"
                    style={{
                        color: theme.colors.onSurfaceVariant,
                        textTransform: 'uppercase'
                    }}
                >
                    {Math.round(((currentWeek - 1) / totalWeeks) * 100)}% Complete
                </Text>
            </View>

            <View style={styles.trackContainer}>
                {Array.from({ length: totalWeeks }).map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.segment,
                            {
                                backgroundColor: getSegmentColor(index),
                                // 2px spacing is tighter/cleaner than 4px for technical UIs
                                marginRight: index === totalWeeks - 1 ? 0 : 2
                            }
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 12,
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline', // Aligns text perfectly
        marginBottom: 8,
    },
    trackContainer: {
        flexDirection: 'row',
        height: 6, // Thinner height looks more elegant
        width: '100%',
    },
    segment: {
        flex: 1,
        height: '100%',
        borderRadius: 2, // Small radius looks "engineered", large radius looks "bubbly"
    }
});