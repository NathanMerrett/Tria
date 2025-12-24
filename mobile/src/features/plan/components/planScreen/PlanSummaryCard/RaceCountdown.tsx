import React from 'react';
import { View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface RaceCountdownProps {
    daysUntilRace: number;
}

export const RaceCountdown = ({ daysUntilRace }: RaceCountdownProps) => {
    const theme = useTheme();

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 12 }}>
            {/* The Number: 
         Uses 'displayMedium' to get that 45px Thin look defined in theme 
      */}
            <Text
                variant="displayMedium"
                style={{ color: theme.colors.onSurface }}
            >
                {daysUntilRace}
            </Text>

            {/* The Label: 
         Uses 'labelMedium' to get that 1.5px letter spacing.
         We add 'uppercase' here to complete the technical style.
      */}
            <Text
                variant="labelMedium"
                style={{
                    color: theme.colors.onSurfaceVariant, // Greyed out for hierarchy
                    textTransform: 'uppercase',
                    marginTop: -4 // Slight negative margin to pull it closer to the number
                }}
            >
                Days To Go
            </Text>
        </View>
    );
};