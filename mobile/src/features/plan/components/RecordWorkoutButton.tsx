import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';

interface RecordWorkoutButtonProps {
    onPress: () => void;
}

export const RecordWorkoutButton = ({ onPress }: RecordWorkoutButtonProps) => {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <Button
                mode="contained"
                onPress={onPress}
                style={styles.button}
                contentStyle={styles.buttonContent}
            >
                Record Workout
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute', // This is the magic key for "floating"
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        // Optional: add a gradient or semi-transparent background here if you want
        // to fade out the content behind it, but simple padding works too.
    },
    button: {
        borderRadius: 50, // Makes it a pill shape, which looks nice floating
        elevation: 4,     // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    buttonContent: {
        height: 50,
    }
});