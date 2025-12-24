import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

interface PlanActionsProps {
    onRearrangePress: () => void;
    onEditPress: () => void;
}

export const PlanActions = ({ onRearrangePress, onEditPress }: PlanActionsProps) => {
    const theme = useTheme();

    // Shared style for the technical "button look"
    const buttonStyle = {
        borderColor: theme.colors.outlineVariant,
        backgroundColor: theme.colors.background,
        borderRadius: 4, // "Engineered" look: not quite square, not fully round
    };

    const labelStyle = {
        ...theme.fonts.labelLarge,
        letterSpacing: 1, // Technical spacing
        color: theme.colors.onSurface,
    };

    return (
        <View style={styles.container}>
            <Button
                mode="outlined"
                onPress={onRearrangePress}
                icon="shuffle-variant"
                style={[styles.button, buttonStyle]}
                contentStyle={styles.buttonContent}
                labelStyle={labelStyle}
            >
                Rearrange
            </Button>

            <View style={styles.spacer} />

            <Button
                mode="outlined"
                onPress={onEditPress}
                icon="pencil-outline"
                style={[styles.button, buttonStyle]}
                contentStyle={styles.buttonContent}
                labelStyle={labelStyle}
            >
                Edit Plan
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 16, // Aligns with your Cards
        marginBottom: 16,      // Space before the next section
    },
    button: {
        flex: 1,
        borderWidth: 1,
    },
    buttonContent: {
        height: 48, // Easy tap target
    },
    spacer: {
        width: 12,
    }
});