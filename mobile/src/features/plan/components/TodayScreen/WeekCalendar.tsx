import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

// Helper to generate days for the current week
const getWeekDays = (baseDate: Date) => {
    const week = [];
    // Start from Sunday or Monday? Let's assume Monday start for this example
    const startOfWeek = new Date(baseDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        week.push(date);
    }
    return week;
};

interface WeekCalendarProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
}

export function WeekCalendar({ selectedDate, onSelectDate }: WeekCalendarProps) {
    const theme = useTheme();
    const [weekDays, setWeekDays] = useState<Date[]>([]);

    useEffect(() => {
        setWeekDays(getWeekDays(new Date()));
    }, []);

    const isSameDay = (d1: Date, d2: Date) => {
        return d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth();
    };

    return (
        <View style={styles.container}>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={weekDays}
                keyExtractor={(item) => item.toISOString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                    const isSelected = isSameDay(item, selectedDate);

                    return (
                        <TouchableOpacity
                            onPress={() => onSelectDate(item)}
                            style={[
                                styles.dayItem,
                                isSelected && { backgroundColor: theme.colors.primary }
                            ]}
                        >
                            {/* Day Name (Mon, Tue) */}
                            <Text style={[
                                styles.dayName,
                                { color: isSelected ? theme.colors.onPrimary : theme.colors.onSurfaceVariant }
                            ]}>
                                {item.toLocaleDateString('en-US', { weekday: 'short' })}
                            </Text>

                            {/* Day Number (12, 13) */}
                            <Text style={[
                                styles.dayNumber,
                                { color: isSelected ? theme.colors.onPrimary : theme.colors.onSurface }
                            ]}>
                                {item.getDate()}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
    },
    listContent: {
        paddingHorizontal: 16, // Match your screen padding
    },
    dayItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 70,
        marginRight: 10,
        borderRadius: 12,
        // Optional: Add slight border for non-selected items
        borderWidth: 1,
        borderColor: 'transparent',
    },
    dayName: {
        fontSize: 12,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    dayNumber: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});