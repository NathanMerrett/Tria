import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import WizardHeader from '@/src/components/WizardHeader';
import AbilityCard from '@/src/components/AbilityCard';
import { useWizardDispatch, AbilityRatingType } from '@/src/context/WizardContext';

type SwimAbilityInfo = {
  title: string;
  subtitle: string;
  ability: AbilityRatingType;
};


export default function RaceDetails() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useWizardDispatch();

  const abilities: SwimAbilityInfo[] = [
    { title: 'Beginner', subtitle: 'Can swim short distances (10–25 m) with frequent stops; still learning breathing and technique.', ability: 1 },
    { title: 'Novice', subtitle: 'Can swim 50–100 m non-stop but struggles with endurance and consistent breathing.', ability: 2 },
    { title: 'Intermediate', subtitle: 'Can swim 200–400 m continuously with decent freestyle form; starting structured training.', ability: 3 },
    { title: 'Advanced', subtitle: 'Can swim 750–1500 m non-stop with good pacing, form, and some open-water experience.', ability: 4 },
    { title: 'Elite', subtitle: 'Can swim 1500 m+ at race pace with excellent technique, sighting, and open-water skills.', ability: 5 },
  ];

  const handleSelect = (ability: AbilityRatingType) => {
    dispatch({ type: 'SET_SWIM_ABILITY', payload: ability });
    router.push('/wizard/ability/bikeability');
  };

  return (
    <View style={styles.container}>
      <WizardHeader step={6} />
      <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineSmall" style={{ marginBottom: 16 }}>
          What is your current Swimming ability?
        </Text>
        {abilities.map((d, idx) => (
          <AbilityCard
            key={idx}
            title={d.title}
            subtitle={d.subtitle}
            ability={d.ability}
            onPress={handleSelect}
            testID={`swim-ability-${d.ability}`}

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
