import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import WizardHeader from '@/src/components/WizardHeader';
import AbilityCard from '@/src/components/AbilityCard';
import { useWizardDispatch, AbilityRatingType } from '@/src/context/WizardContext';
import { TOTAL_WIZARD_STEPS } from '@/constants/appConstants';

type RunAbilityInfo = {
  title: string;
  subtitle: string;
  ability: AbilityRatingType;
};


export default function RaceDetails() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useWizardDispatch();

  const abilities: RunAbilityInfo[] = [
    { title: 'Beginner', subtitle: 'Can jog/walk up to 2 km, building base fitness and run form.', ability: 1 },
    { title: 'Novice', subtitle: 'Can run 3–5 km continuously at an easy pace, still developing endurance.', ability: 2 },
    { title: 'Intermediate', subtitle: 'Can run 5–10 km comfortably, starting structured training and pacing efforts.', ability: 3 },
    { title: 'Advanced', subtitle: 'Can run 10–21 km at strong endurance pace, with good pacing and recovery strategies.', ability: 4 },
    { title: 'Elite', subtitle: 'Can run 21 km+ at race pace, highly efficient form, advanced pacing and race strategy.', ability: 5 },
  ];

  const handleSelect = (ability: AbilityRatingType) => {
    dispatch({ type: 'SET_RUN_ABILITY', payload: ability });
    router.push('/wizard/gear/gear');
  };

  return (
    <View style={styles.container}>
      <WizardHeader step={6} />
      <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineSmall" style={{ marginBottom: 16 }}>
          What is your current Running ability?
        </Text>
        {abilities.map((d, idx) => (
          <AbilityCard
            key={idx}
            title={d.title}
            subtitle={d.subtitle}
            ability={d.ability}
            onPress={handleSelect}
            testID={`run-ability-${d.ability}`}

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
