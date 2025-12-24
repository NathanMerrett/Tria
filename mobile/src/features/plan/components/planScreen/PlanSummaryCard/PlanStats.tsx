import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Icon, useTheme } from 'react-native-paper';
import { DISCIPLINE_COLORS, DISCIPLINE_ICONS } from '@/src/lib/constants';

interface PlanStatsProps {
    swimTotal: number;
    bikeTotal: number;
    runTotal: number;
}

export const PlanStats = ({ swimTotal, bikeTotal, runTotal }: PlanStatsProps) => {
    const theme = useTheme();

    const stats = [
        {
            label: 'Swim',
            value: swimTotal,
            type: 'swim'
        },
        {
            label: 'Bike',
            value: bikeTotal,
            type: 'bike'
        },
        {
            label: 'Run',
            value: runTotal,
            type: 'run'
        }
    ];

    return (
        <View style={[styles.container, { borderTopColor: theme.colors.outlineVariant }]}>
            {stats.map((stat, index) => {
                const color = DISCIPLINE_COLORS[stat.type] || theme.colors.onSurface;
                const icon = DISCIPLINE_ICONS[stat.type];

                return (
                    <View key={index} style={styles.statItem}>
                        {/* Header: Small Icon + Uppercase Label */}
                        <View style={styles.headerRow}>
                            <Icon source={icon} size={12} color={color} />
                            <Text
                                variant="labelSmall"
                                style={{
                                    color: theme.colors.onSurfaceVariant,
                                    marginLeft: 4,
                                    textTransform: 'uppercase'
                                }}
                            >
                                {stat.label}
                            </Text>
                        </View>

                        {/* Value: Large, Thin, Bright */}
                        <Text
                            variant="headlineSmall" // Or titleLarge depending on space
                            style={{
                                color: theme.colors.onSurface,
                                marginTop: 2
                            }}
                        >
                            {stat.value}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    }
});