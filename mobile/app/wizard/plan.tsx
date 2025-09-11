import React, { useMemo, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useTheme, Card, Text, Button, HelperText, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import WizardHeader from '../../components/WizardHeader';
import { useWizardDispatch, useWizardState, DistanceType } from '../../context/WizardContext';
import { TOTAL_WIZARD_STEPS } from '../../constants/appConstants';
import { nextMonday, addWeeks, fmtDate } from '../../utils/helpers';

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
  selected,
}: DistanceInfo & { onPress: (distance: DistanceType) => void; selected: boolean }) {
  const theme = useTheme();
  return (
    <Card
      mode="elevated"
      onPress={() => onPress(distance)}
      style={[
        styles.card,
        { backgroundColor: theme.colors.surfaceVariant, borderWidth: selected ? 2 : 0, borderColor: theme.colors.primary },
      ]}
    >
      <Card.Content>
        <Text variant="titleMedium" style={styles.cardTitle}>{title}</Text>
        {details.map((line, idx) => (
          <Text key={idx} variant="bodyMedium">{line}</Text>
        ))}
      </Card.Content>
    </Card>
  );
}

export default function Step1() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useWizardDispatch();
  const state = useWizardState();

  // Local UI state with context defaults
  const [distance, setDistance] = useState<DistanceType>(state.distance ?? 'Olympic');
  const [weeks, setWeeks] = useState<number>(state.planWeeks ?? defaultWeeksByDistance(distance));
  const [startDate, setStartDate] = useState<Date>(state.startDate ?? nextMonday());

  // When distance changes and user hasn't explicitly chosen weeks before, reset weeks to sensible default
  useEffect(() => {
    if (state.planWeeks == null) setWeeks(defaultWeeksByDistance(distance));
  }, [distance]);

  const endDate = useMemo(() => addWeeks(startDate, weeks), [startDate, weeks]);
  const minWeeks = minWeeksByDistance(distance);
  const tooShort = weeks < minWeeks;

  // const chooseDistance = (d: DistanceType) => setDistance(d);

  const distances: DistanceInfo[] = [
    {
      title: 'Sprint Distance',
      distance: 'Sprint',
      details: ['🏊 Swim: 750m (0.47 miles)', '🚴 Bike: 20km (12.4 miles)', '🏃 Run: 5km (3.1 miles)'],
    },
    {
      title: 'Olympic Distance',
      distance: 'Olympic',
      details: ['🏊 Swim: 1.5km (0.93 miles)', '🚴 Bike: 40km (24.8 miles)', '🏃 Run: 10km (6.2 miles)'],
    },
    {
      title: 'Half Ironman (70.3)',
      distance: 'Half Ironman',
      details: ['🏊 Swim: 1.9km (1.2 miles)', '🚴 Bike: 90km (56 miles)', '🏃 Run: 21.1km (13.1 miles)'],
    },
    {
      title: 'Full Ironman (140.6)',
      distance: 'Full Ironman',
      details: ['🏊 Swim: 3.9km (2.4 miles)', '🚴 Bike: 180km (112 miles)', '🏃 Run: 42.2km (26.2 miles)'],
    },
    // NOTE: Add "Full Ironman" later when DistanceType includes it
  ];

  const bumpWeeks = (delta: number) => setWeeks((w) => clamp(w + delta, 1, 24));

  const onNext = () => {
    dispatch({ type: 'SET_DISTANCE', payload: distance });
    // @ts-ignore ensure this action exists in your context
    dispatch({ type: 'SET_PLAN_WEEKS', payload: weeks });
    dispatch({ type: 'SET_START_DATE', payload: startDate });
    router.push('/wizard/availability/days'); // keep your current flow
  };

  return (
    <View style={styles.rootContainer}>
      <WizardHeader step={1} totalSteps={TOTAL_WIZARD_STEPS} onCloseRoute="/(tabs)" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={[styles.content, { backgroundColor: theme.colors.background }]}>
          <Text variant="headlineSmall" style={{ marginBottom: 15 }}>Plan basics</Text>
          <Text variant="titleSmall" style={{ marginBottom: 20 }}>
            Pick your distance, choose how many weeks you’ll train, and set your start date.
          </Text>

          {/* Set a distance */}
          <Text variant="titleMedium" style={styles.sectionTitle}>Set a distance</Text>
          <View style={styles.cardsContainer}>
            {distances.map((d, idx) => (
              <DistanceCard
                key={idx}
                title={d.title}
                distance={d.distance}
                details={d.details}
                onPress={setDistance}
                selected={distance === d.distance}
              />
            ))}
          </View>

          <Divider style={styles.sectionDivider} />

          {/* Set a plan length */}
          <Text variant="titleMedium" style={styles.sectionTitle}>Set a plan length</Text>
          <View style={styles.row}>
            <Button mode="outlined" onPress={() => bumpWeeks(-1)} compact>−</Button>
            <Text variant="headlineSmall" style={{ minWidth: 80, textAlign: 'center' }}>{weeks} wk</Text>
            <Button mode="outlined" onPress={() => bumpWeeks(+1)} compact>+</Button>
          </View>
          <HelperText type={tooShort ? 'error' : 'info'} visible>
            {tooShort
              ? `Tight for ${distance}. We’ll compress intensity. Min recommended: ${minWeeks} weeks.`
              : 'You can adjust this later if needed.'}
          </HelperText>

          <Divider style={styles.sectionDivider} />

          {/* Set a start date (inline DateTimePicker like your Step2) */}
          <Text variant="titleMedium" style={styles.sectionTitle}>Set a start date</Text>
          <Text variant="titleSmall" style={{ marginBottom: 4 }}>
            {`${fmtDate(startDate)} (${startDate.toLocaleDateString(undefined, { weekday: 'short' })})`}
          </Text>
          <View accessible accessibilityLabel="Pick your start date">
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_e, date) => date && setStartDate(date)}
              minimumDate={new Date()}
            />
          </View>
          <HelperText type="info" visible>
            Defaults to next Monday. Adjust to line up the end date with a race if you want.
          </HelperText>

          {/* Live preview */}
          <Card mode="elevated" style={[styles.card, { backgroundColor: theme.colors.surfaceVariant, marginTop: 16 }]}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.cardTitle}>Target race date</Text>
              <Text variant="bodyLarge">{fmtDate(endDate)}</Text>
              <Text variant="bodyMedium" style={{ marginTop: 4 }}>
                {fmtDate(startDate)} → {fmtDate(endDate)} • {weeks} week{weeks === 1 ? '' : 's'}
              </Text>
            </Card.Content>
          </Card>

          <View style={{ height: 12 }} />

          <Button mode="contained" onPress={onNext} disabled={weeks < 1}>
            Next
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const defaultWeeksByDistance = (d: DistanceType): number => {
  switch (d) {
    case 'Sprint': return 8;
    case 'Olympic': return 12;
    case 'Half Ironman': return 20;
    case 'Full Ironman': return 24;
  }
};

const minWeeksByDistance = (d: DistanceType): number => {
  switch (d) {
    case 'Sprint': return 4;
    case 'Olympic': return 6;
    case 'Half Ironman': return 12;
    case 'Full Ironman': return 20;
  }
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

/* ---------- styles ---------- */

const styles = StyleSheet.create({
  rootContainer: { flex: 1 },
  scrollViewContent: { flexGrow: 1 },
  content: { flex: 1, padding: 20 },
  sectionTitle: { marginTop: 8, marginBottom: 8 },
  sectionDivider: { marginVertical: 16, opacity: 0.2 },
  cardsContainer: { gap: 16 },
  card: { borderRadius: 10 },
  cardTitle: { fontWeight: 'bold', marginBottom: 3 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});