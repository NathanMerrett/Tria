// app/wizard/availability/days.tsx
import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Text, Button, useTheme, Checkbox, Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';
import WizardHeader from '@/src/components/WizardHeader';
import { TOTAL_WIZARD_STEPS } from '@/constants/appConstants';
import {
  useWizardDispatch,
  useWizardState,
  WeekdaysType,
} from '@/src/context/WizardContext';

const DAYS = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
] as const;

type DayKey = typeof DAYS[number]['key'];
type DaySlot = 'am' | 'pm';

const toWeekday: Record<DayKey, WeekdaysType> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

export default function AvailabilityDays() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useWizardDispatch();
  const { availability } = useWizardState();

  // Count how many AM/PM sessions are selected across the week
  const selectedSessionsCount = useMemo(() => {
    return DAYS.reduce((sum, d) => {
      const day = toWeekday[d.key];
      const am = availability[day].am.selected ? 1 : 0;
      const pm = availability[day].pm.selected ? 1 : 0;
      return sum + am + pm;
    }, 0);
  }, [availability]);

  const toggleSlot = (dayKey: DayKey, slot: DaySlot) => {
    const day = toWeekday[dayKey];
    const current = availability[day][slot].selected;
    dispatch({
      type: 'SET_SLOT_SELECTED',
      payload: { day, slot, selected: !current },
    });
  };

  // NEW: bulk setter to support quick-select buttons
  const setAll = (am: boolean, pm: boolean) => {
    DAYS.forEach((d) => {
      const day = toWeekday[d.key];
      const currentAM = availability[day].am.selected;
      const currentPM = availability[day].pm.selected;

      if (currentAM !== am) {
        dispatch({
          type: 'SET_SLOT_SELECTED',
          payload: { day, slot: 'am', selected: am },
        });
      }
      if (currentPM !== pm) {
        dispatch({
          type: 'SET_SLOT_SELECTED',
          payload: { day, slot: 'pm', selected: pm },
        });
      }
    });
  };

  // NEW: convenience handlers
  const selectAll = () => setAll(true, true);
  const selectAM = () => setAll(true, false);
  const selectPM = () => setAll(false, true);

  const onNext = () => {
    // Go to Page 2: capture Long OK per selected slot
    // Change the route below to match your file structure for page 2.
    router.push('/wizard/availability/longersessiondays');
  };

  return (
    <View style={styles.rootContainer}>
      <WizardHeader
        step={4}
      />

      <ScrollView
        style={[styles.content, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={{ justifyContent: 'flex-start' }}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="headlineSmall" style={styles.title}>
          When can you usually train?
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Tick any <Text style={{ fontWeight: '700' }}>AM</Text> or{' '}
          <Text style={{ fontWeight: '700' }}>PM</Text> sessions that could work as a session. This does not mean they'll all be used.
        </Text>

        <View style={styles.infoRow}>
          {/* <Icon source="clock-outline" size={20} color={theme.colors.secondary} /> */}
          {/* <Text variant="bodyLarge" style={styles.infoText}>
            Sessions last no more than 2 hours.
          </Text> */}
        </View>
        <Text
          variant="bodyLarge"
          style={[styles.alerttext, { color: theme.colors.secondary }]}
        >
          Please pick at least 5 sessions.
        </Text>

        <View style={styles.quickSelectRow}>
          <Button
            mode="outlined"
            onPress={selectAll}
            accessibilityLabel="Select all AM and PM across the week"
            compact
          >
            Select All
          </Button>
          <Button
            mode="outlined"
            onPress={selectAM}
            accessibilityLabel="Select all AM sessions across the week"
            compact
          >
            AM
          </Button>
          <Button
            mode="outlined"
            onPress={selectPM}
            accessibilityLabel="Select all PM sessions across the week"
            compact
          >
            PM
          </Button>
        </View>

        <Card mode="elevated" style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderDay}>{''}</Text>
            <Text variant="titleMedium" style={styles.tableHeaderText}>AM</Text>
            <Text variant="titleMedium" style={styles.tableHeaderText}>PM</Text>
          </View>
          {DAYS.map((d) => {
            const dayLabel = toWeekday[d.key];
            const amSelected = availability[dayLabel].am.selected;
            const pmSelected = availability[dayLabel].pm.selected;

            return (
              <View key={d.key} style={styles.tableRow}>
                <Text variant="titleMedium" style={styles.dayLabel}>{d.label}</Text>
                <View style={styles.checkboxContainer}>
                  <Checkbox.Android
                    status={amSelected ? 'checked' : 'unchecked'}
                    onPress={() => toggleSlot(d.key, 'am')}
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <Checkbox.Android
                    status={pmSelected ? 'checked' : 'unchecked'}
                    onPress={() => toggleSlot(d.key, 'pm')}
                  />
                </View>
              </View>
            );
          })}
        </Card>
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={[styles.footer, { backgroundColor: theme.colors.background }]}>
        <Button
          mode="contained"
          onPress={onNext}
          accessibilityLabel="Next: choose availability days"
          contentStyle={{ height: 48 }}
          disabled={selectedSessionsCount < 5}
        >
          Next
        </Button>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: { flex: 1 },
  content: { padding: 20 },
  title: { marginBottom: 8 },
  subtitle: { marginBottom: 8, },
  alerttext: { marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { marginLeft: 6, opacity: 0.8 },
  footer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  quickSelectRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tableCard: { marginVertical: 6, borderRadius: 12, padding: 12 },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 15 },
  tableHeaderDay: { flex: 2 },
  tableHeaderText: { flex: 1, textAlign: 'center' },
  tableRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 12 },
  dayLabel: { flex: 2 },
  checkboxContainer: { flex: 1, alignItems: 'center' },
});