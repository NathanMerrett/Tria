// app/wizard/review.tsx
import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, useWindowDimensions, Pressable } from 'react-native';
import {
  Text,
  Card,
  Divider,
  Chip,
  List,
  Button,
  useTheme,
  HelperText,
  Snackbar,
  Icon,
} from 'react-native-paper';
import { useRouter } from 'expo-router';

import WizardHeader from '@/src/components/WizardHeader';
import { useWizardState } from '@/src/context/WizardContext';
import type {
  WeeklyAvailability,
  WeekdaysType,
  DaySlot,
  SlotAvailability,
} from '@/src/context/WizardContext';

const DAYS: WeekdaysType[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SLOTS: DaySlot[] = ['am', 'pm'];

// --- Helpers ---------------------------------------------------------------

function formatDate(d?: Date) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '—';
  }
}

function hasAnyAvailability(availability: WeeklyAvailability) {
  return DAYS.some(day => SLOTS.some(slot => availability[day][slot].selected));
}

function countSelected(availability: WeeklyAvailability) {
  let count = 0;
  DAYS.forEach(day => SLOTS.forEach(slot => { if (availability[day][slot].selected) count += 1; }));
  return count;
}

function getMissing(state: ReturnType<typeof useWizardState>): string[] {
  const missing: string[] = [];
  if (!state.distance) missing.push('distance');

  // EITHER raceDate OR (planWeeks AND startDate)
  const hasRacePath = !!state.raceDate;
  const hasPlanPath = !!state.planWeeks && !!state.startDate;
  if (!hasRacePath && !hasPlanPath) {
    missing.push('dates (race date OR start date + weeks)');
  }
  if (!hasAnyAvailability(state.availability)) missing.push('weekly availability');
  // Abilities/metrics are optional here, but you can enforce if needed:
  return missing;
}

function AbilityRow({
  label,
  ability,
  metricLabel,
  metricValue,
  unit,
}: {
  label: string;
  ability?: number;
  metricLabel: string;
  metricValue?: number;
  unit?: string;
}) {
  const right = metricValue != null ? `${metricValue}${unit ?? ''}` : '—';
  const subtitle =
    ability != null ? `Ability: ${'★'.repeat(ability)}${'☆'.repeat(5 - ability)}` : 'Ability: —';
  return (
    <List.Item
      title={label}
      description={subtitle}
      right={() => <Text style={{ alignSelf: 'center', opacity: 0.8 }}>{metricLabel}: {right}</Text>}
      left={props => <List.Icon {...props} icon="gauge" />}
    />
  );
}

function AvailabilityMatrix({ availability }: { availability: WeeklyAvailability }) {
  const theme = useTheme();
  return (
    <View>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderDay}>{''}</Text>
        <Text variant="titleMedium" style={styles.tableHeaderText}>AM</Text>
        <Text variant="titleMedium" style={styles.tableHeaderText}>PM</Text>
      </View>
      {DAYS.map((day, idx) => {
        const am = availability[day].am;
        const pm = availability[day].pm;
        return (
          <View key={day} style={styles.tableRow}>
            <Text style={styles.dayLabel}>{day}</Text>
            <AvailabilityCell data={am} style={styles.checkboxContainer} />
            <AvailabilityCell data={pm} style={styles.checkboxContainer} />
          </View>
        );
      })}
    </View>
  );
}

type AvailabilityCellProps = {
  data: SlotAvailability;
  style?: any;
};

function AvailabilityCell({ data, style }: AvailabilityCellProps) {
  const theme = useTheme();
  const selected = data.selected;
  const longOK = data.longOK && selected;

  return (
    <View style={[styles.checkboxContainer]}>
      <Icon
        source={selected ? 'check' : 'close'}
        size={20}
        color={longOK ? theme.colors.primary : selected ? theme.colors.secondary : theme.colors.onSurfaceVariant}
      />
    </View>
  );
}

// --- Screen ----------------------------------------------------------------

export default function WizardReview() {
  const state = useWizardState();
  const theme = useTheme();
  const router = useRouter();
  const [snack, setSnack] = useState<string | null>(null);



  const missing = useMemo(() => getMissing(state), [state]);
  const canSubmit = missing.length === 0;

  const handleGetPlan = () => {
    if (!canSubmit) {
      setSnack(`Please complete: ${missing.join(', ')}`);
      return;
    }
    // TODO: wire to your plan generation (FastAPI/Supabase). For now, navigate.
    console.log('availability json:', JSON.stringify(state.availability, null, 2));
    console.log(state)
    router.push('/(tabs)'); // or whatever route you use
  };

  const selectedSlots = countSelected(state.availability);

  return (
    <View style={styles.rootContainer}>
      <WizardHeader step={12} />
      <ScrollView contentContainerStyle={styles.scrollContent} style={{ backgroundColor: theme.colors.background }}>
        <Text variant="titleLarge" style={{ marginBottom: 8 }}>Review your selections</Text>
        <Text variant="bodyLarge" style={{ opacity: 0.8, marginBottom: 8 }}>
          Make sure everything looks right before we build your plan.
        </Text>

        {/* Plan */}
        <Card mode="elevated" style={styles.card}>
          <Card.Title titleVariant='titleLarge' title="Plan" />
          <Card.Content style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
            <List.Item
              title="Distance"
              description={state.distance}
              left={props => <List.Icon icon="run" />}
            //   right={() => (
            //     <Chip compact onPress={() => router.push('/wizard/race')}>edit</Chip>
            //   )}
            />
            <List.Item
              title="Race date"
              description={formatDate(state.raceDate)}
              left={props => <List.Icon icon="calendar" />}
              style={{ marginStart: 24 }}
            //   right={() => <Chip compact onPress={() => router.push('/wizard/race/racedate')}>edit</Chip>}
            />
          </Card.Content>
        </Card>

        {/* Availability */}
        <Card mode="elevated" style={styles.card}>
          <Card.Title titleVariant='titleLarge' title="Weekly availability" />
          <Card.Content>
            <AvailabilityMatrix availability={state.availability} />
          </Card.Content>
        </Card>

        {/* Abilities & Metrics */}
        <Card mode="elevated" style={styles.card}>
          <Card.Title titleVariant='titleLarge' title="Abilities & metrics" />
          <Card.Content>
            <AbilityRow
              label="Swim"
              ability={state.swimAbility}
              metricLabel="CSS"
              metricValue={state.swimCSS}
              unit=" s/100m"
            />
            <AbilityRow
              label="Bike"
              ability={state.bikeAbility}
              metricLabel="FTP"
              metricValue={state.bikeFTP}
              unit=" W"
            />
            <AbilityRow
              label="Run"
              ability={state.runAbility}
              metricLabel="Threshold pace"
              metricValue={state.runThreshold}
              unit=" s/km"
            />
            <Divider style={styles.divider} />
            <List.Item
              title="Recent swim distance"
              description={state.swimDistance != null ? `${state.swimDistance} m` : '—'}
              left={props => <List.Icon {...props} icon="pool" />}
            />
            <List.Item
              title="Recent bike distance"
              description={state.bikeDistance != null ? `${state.bikeDistance} km` : '—'}
              left={props => <List.Icon {...props} icon="bike" />}
            />
            <List.Item
              title="Recent run distance"
              description={state.runDistance != null ? `${state.runDistance} km` : '—'}
              left={props => <List.Icon {...props} icon="shoe-sneaker" />}
            />
          </Card.Content>
        </Card>

        {/* Gear */}
        <Card mode="elevated" style={styles.card}>
          <Card.Title titleVariant="titleLarge" title="Gear" />
          <Card.Content>
            <List.Item
              title="Heart rate monitor"
              left={props => <List.Icon {...props} icon='heart' />}
              right={() => <Text>{state.hasHRMonitor ? 'Yes' : 'No'}</Text>}
            />
            <List.Item
              title="Power meter"
              left={props => <List.Icon {...props} icon='lightning-bolt' />}
              right={() => <Text>{state.hasPowerMeter ? 'Yes' : 'No'}</Text>}
            />
          </Card.Content>
        </Card>

        {/* Validation note */}
        {missing.length > 0 && (
          <HelperText type="error" visible style={{ marginTop: 4 }}>
            Missing: {missing.join(', ')}
          </HelperText>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom action */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.background }]}>
        <Button
          mode="contained"
          onPress={handleGetPlan}
          disabled={!canSubmit}
          icon="auto-fix"
          style={{ borderRadius: 12, marginBottom: 24 }}
          accessibilityLabel="Generate training plan"
        >
          Get plan
        </Button>
      </View>

      <Snackbar visible={!!snack} onDismiss={() => setSnack(null)} duration={2500}>
        {snack}
      </Snackbar>
    </View>
  );
}

// --- Styles ----------------------------------------------------------------

const styles = StyleSheet.create({
  rootContainer: { flex: 1 },
  scrollContent: { padding: 20, gap: 16 },
  card: { borderRadius: 12 },
  divider: { opacity: 0.15, marginVertical: 4 },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  // Availability matrix
  tableHeader: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 15 },
  tableHeaderDay: { flex: 2 },
  tableHeaderText: { flex: 1, textAlign: 'center' },
  tableRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 12 },
  dayLabel: { flex: 2 },
  checkboxContainer: { flex: 1, alignItems: 'center' },
});
