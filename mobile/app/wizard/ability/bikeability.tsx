import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import WizardHeader from '@/src/components/WizardHeader';
import AbilityCard from '@/src/components/AbilityCard';
import { useWizardDispatch, AbilityRatingType } from '@/src/context/WizardContext';
import { TOTAL_WIZARD_STEPS } from '../../../constants/appConstants';

type BikeAbilityInfo = {
  title: string;
  subtitle: string;
  ability: AbilityRatingType;
};


export default function RaceDetails() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useWizardDispatch();

  const abilities: BikeAbilityInfo[] = [
    { title: 'Beginner', subtitle: 'Rides short distances (5–10 km) at an easy pace, building basic bike handling confidence.', ability: 1 },
    { title: 'Novice', subtitle: 'Can ride 15–25 km continuously at a steady pace; limited experience with gears or hills.', ability: 2 },
    { title: 'Intermediate', subtitle: 'Comfortable riding 30–60 km, uses gears efficiently, and starting structured bike sessions.', ability: 3 },
    { title: 'Advanced', subtitle: 'Can ride 80–120 km at solid endurance pace; experienced with group riding and pacing strategy.', ability: 4 },
    { title: 'Elite', subtitle: 'Can ride 120 km+ at race pace, maintains high power output and advanced bike handling skills.', ability: 5 },
  ];

  const handleSelect = (ability: AbilityRatingType) => {
    dispatch({ type: 'SET_BIKE_ABILITY', payload: ability });
    router.push('/wizard/ability/runability');
  };

  return (
    <View style={styles.container}>
      <WizardHeader step={6} />
      <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineSmall" style={{ marginBottom: 16 }}>
          What is your current Cycling ability?
        </Text>
        {abilities.map((d, idx) => (
          <AbilityCard
            key={idx}
            title={d.title}
            subtitle={d.subtitle}
            ability={d.ability}
            onPress={handleSelect}
            testID={`bike-ability-${d.ability}`}

          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 10, gap: 16, justifyContent: 'flex-start' },
});
