import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import WizardHeader from '@/src/components/WizardHeader';
import { useWizardDispatch, DistanceType } from '@/src/context/WizardContext';
import { TOTAL_WIZARD_STEPS } from '@/constants/appConstants';

type DistanceInfo = {
  title: string;
  distance: DistanceType;
  details: string[];
};

function DistanceCard({
  title,
  distance,
  details,
  onPress,
}: DistanceInfo & { onPress: (distance: DistanceType) => void }) {
  const theme = useTheme();
  return (
    <Card
      mode="elevated"
      onPress={() => onPress(distance)}
      accessibilityRole="button"
      style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}
    >
      <Card.Content>
        <Text variant="titleLarge" style={{ marginBottom: 8 }}>
          {title}
        </Text>
        <Text variant='bodyMedium'>
          {details}
        </Text>
      </Card.Content>
    </Card>
  );
}

export default function RaceDetails() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useWizardDispatch();

  const distances: DistanceInfo[] = [
    { title: 'Sprint Distance', distance: 'sprint', details: ['🏊 750 m', '🚴 20 km', '🏃 5 km'] },
    { title: 'Olympic Distance', distance: 'olympic', details: ['🏊 1.5 km', '🚴 40 km', '🏃 10 km'] },
    { title: 'Half Ironman (70.3)', distance: 'half', details: ['🏊 1.9 km', '🚴 90 km', '🏃 21.1 km'] },
    // { title: 'Full Ironman (140.6)', distance: 'Full Ironman', details: ['🏊 3.8 km', '🚴 180 km', '🏃 42.2 km'] },
  ];

  const handleSelect = (distance: DistanceType) => {
    dispatch({ type: 'SET_DISTANCE', payload: distance });
    router.push('/wizard/race/racedate');
  };

  return (
    <View style={styles.container}>
      <WizardHeader step={2} />
      <View style={[styles.content, { backgroundColor: theme.colors.background }]}>
        <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
          What distance is your race?
        </Text>

        <View style={styles.cardsContainer}>
          {distances.map((d, idx) => (
            <DistanceCard
              key={idx}
              title={d.title}
              distance={d.distance}
              details={d.details}
              onPress={handleSelect}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 20, gap: 16, justifyContent: 'flex-start' },
  cardsContainer: { gap: 16 },
  card: { borderRadius: 12 },
});
