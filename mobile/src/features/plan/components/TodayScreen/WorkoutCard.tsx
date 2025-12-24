// src/features/schedule/components/WorkoutCard.tsx
import React from 'react';
import { View } from 'react-native';
import { Card, Text, IconButton, useTheme } from 'react-native-paper';
import { WorkoutSummary } from '@/src/types';
import { DISCIPLINE_COLORS } from '@/src/lib/constants';

interface WorkoutCardProps {
    workout: WorkoutSummary;
    onToggle: (id: string, newStatus: boolean) => void;
    onPress: (id: string) => void;
}

export const WorkoutCard = ({ workout, onToggle, onPress }: WorkoutCardProps) => {
    const theme = useTheme();

    const disciplineKey = workout.discipline as keyof typeof DISCIPLINE_COLORS;
    const stripeColor = DISCIPLINE_COLORS[disciplineKey] || DISCIPLINE_COLORS.default;

    return (
        <Card
            style={{
                marginBottom: 16,
                // 1. Less Cornering (Standard is usually 16, reduced to 8)
                borderRadius: 8,
                borderLeftWidth: 6,
                borderLeftColor: stripeColor,
                backgroundColor: theme.colors.surface,
            }}
            mode="elevated"
            onPress={() => onPress(workout.id)}
        >
            {/* 2. More Padding: Increased vertical to 24 for "more space" */}
            <Card.Content style={{ paddingVertical: 24, paddingHorizontal: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>

                    {/* TEXT CONTENT */}
                    <View style={{ flex: 1, paddingRight: 12 }}>
                        <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>
                            {workout.title}
                        </Text>

                        {/* Added marginTop to spacing out the lines vertically */}
                        <Text
                            variant="labelLarge"
                            style={{
                                color: theme.colors.primary,
                                marginTop: 8
                            }}
                        >
                            {workout.duration_mins} mins
                        </Text>

                        <Text
                            variant="bodyMedium"
                            numberOfLines={1}
                            style={{
                                color: theme.colors.onSurfaceVariant,
                                marginTop: 8
                            }}
                        >
                            {workout.description}
                        </Text>
                    </View>

                    {/* CHECKBOX */}
                    <View style={{
                        // Negative margins to counteract IconButton's internal padding
                        // ensuring it looks visually aligned with the Title text
                        marginTop: -12,
                        marginRight: -12
                    }}>
                        <IconButton
                            icon={workout.completed ? "checkbox-marked" : "checkbox-blank-outline"}
                            iconColor={workout.completed ? stripeColor : theme.colors.onSurfaceDisabled}
                            size={30}
                            onPress={() => onToggle(workout.id, !workout.completed)}
                        />
                    </View>
                </View>
            </Card.Content>
        </Card>
    );
};