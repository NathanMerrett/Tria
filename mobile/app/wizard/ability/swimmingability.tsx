import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import WizardHeader from '../../../components/WizardHeader';
import { useWizardDispatch, AbilityRatingType } from '../../../context/WizardContext';
import { TOTAL_WIZARD_STEPS } from '../../../constants/appConstants';

type SwimAbilityInfo = {
  title: string;
  subtitle: string;
  ability: AbilityRatingType;
};

function AbilityCard({
  title,
  subtitle,
  ability,  
  onPress,
}: SwimAbilityInfo & { onPress: (ability: AbilityRatingType) => void }) {
  const theme = useTheme();
  return (
    <Card
      mode="elevated"
      onPress={() => onPress(ability)}
      accessibilityRole="button"
      style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}
    >
      <Card.Content>
        <Text variant="titleLarge" style={{marginBottom: 10}}>
          {title}
        </Text>
        <Text variant='bodyLarge'>
          {subtitle}
        </Text>
      </Card.Content>
    </Card>
  );
}

export default function RaceDetails() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useWizardDispatch();

  const abilities: SwimAbilityInfo[] = [
    { title: 'Beginner', subtitle: 'Can swim short distances (10–25 m) with frequent stops; still learning breathing and technique.', ability: 1},
    { title: 'Novice', subtitle: 'Can swim 50–100 m non-stop but struggles with endurance and consistent breathing.', ability: 2},
    { title: 'Intermediate', subtitle: 'Can swim 200–400 m continuously with decent freestyle form; starting structured training.', ability: 3},
    { title: 'Advanced', subtitle: 'Can swim 750–1500 m non-stop with good pacing, form, and some open-water experience.', ability: 4},
    { title: 'Elite', subtitle: 'Can swim 1500 m+ at race pace with excellent technique, sighting, and open-water skills.', ability: 5},
];

  const handleSelect = (ability: AbilityRatingType) => {
    dispatch({ type: 'SET_SWIM_ABILITY', payload: ability });
    router.push('/wizard/ability/swimmingpace');
  };

  return (
    <View style={styles.container}>
      <WizardHeader step={1} totalSteps={TOTAL_WIZARD_STEPS} onCloseRoute="/(tabs)" />
      <View style={[styles.content, { backgroundColor: theme.colors.background }]}>
        <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
          What is your current Swimming ability?
        </Text>

        <View style={styles.cardsContainer}>
          {abilities.map((d, idx) => (
            <AbilityCard
              key={idx}
              title={d.title}
              ability={d.ability}
              subtitle={d.subtitle}
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
