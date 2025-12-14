import React, { useState } from 'react';
import { Card, Text, IconButton, useTheme, Divider } from 'react-native-paper';
import { StyleSheet, View, LayoutAnimation, Platform, UIManager } from 'react-native';

// Enable layout animation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface CoachesNoteProps {
    note?: string;
}

export const CoachesNote = ({ note }: CoachesNoteProps) => {
    const [expanded, setExpanded] = useState(false);
    const theme = useTheme();

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const content = note || "Focus on maintaining a steady cadence today. Your heart rate should remain in Zone 2 for the majority of the session. Don't forget to hydrate immediately after finishing!";

    return (
        <Card
            style={{
                marginBottom: 10,
                borderRadius: 8, // Matching WorkoutCard radius
                // borderLeftWidth: 6, // Matching WorkoutCard stripe
                // borderLeftColor: theme.colors.secondary, // Distinct color for "Notes" vs "Workouts"
                backgroundColor: theme.colors.surface,
            }}
            mode="elevated"
            onPress={toggleExpand} // Allow tapping anywhere to toggle
        >
            <View style={styles.headerContainer}>
                {/* ICON & TITLE ROW */}
                <View style={styles.titleRow}>
                    <IconButton
                        icon="clipboard-text-outline"
                        iconColor={theme.colors.secondary}
                        size={24}
                        style={{ margin: 0, padding: 0, marginRight: 8 }}
                    />
                    <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: 'bold' }}>
                        Coach's Note
                    </Text>
                </View>

                <IconButton
                    icon={expanded ? "chevron-up" : "chevron-down"}
                    iconColor={theme.colors.onSurfaceVariant}
                    size={24}
                    onPress={toggleExpand}
                    style={{ margin: 0 }} // Remove default margins for alignment
                />
            </View>

            {/* EXPANDED CONTENT */}
            {expanded && (
                <View>
                    <Divider style={{ marginHorizontal: 20 }} />
                    <Card.Content style={styles.content}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, lineHeight: 24 }}>
                            {content}
                        </Text>
                    </Card.Content>
                </View>
            )}
        </Card>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16, // Slightly reduced vs workout card to keep header tight
        paddingHorizontal: 20,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    content: {
        paddingTop: 16,
        paddingBottom: 24, // Matches bottom padding of WorkoutCard
        paddingHorizontal: 20
    }
});