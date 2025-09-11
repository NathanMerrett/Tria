import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, useTheme, Checkbox } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import WizardHeader from '../../../components/WizardHeader';
import { TOTAL_WIZARD_STEPS } from '../../../constants/appConstants';
import {
  useWizardDispatch,
  useWizardState,
  WeekdaysType,
} from '../../../context/WizardContext';

const DAYS = [
  { key: 'mon', label: 'Monday' as WeekdaysType },
  { key: 'tue', label: 'Tuesday' as WeekdaysType },
  { key: 'wed', label: 'Wednesday' as WeekdaysType },
  { key: 'thu', label: 'Thursday' as WeekdaysType },
  { key: 'fri', label: 'Friday' as WeekdaysType },
  { key: 'sat', label: 'Saturday' as WeekdaysType },
  { key: 'sun', label: 'Sunday' as WeekdaysType },
] as const;

type DayKey = typeof DAYS[number]['key'];
type DaySlot = 'am' | 'pm';

export default function LongerSessionDays() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useWizardDispatch();
  const { availability } = useWizardState();

  const hasAnySelectedSessions = useMemo(() => {
    return DAYS.some(({ label }) => {
      const day = availability[label];
      return day?.am?.selected || day?.pm?.selected;
    });
  }, [availability]);

  const toggleLong = (day: WeekdaysType, slot: DaySlot) => {
    const current = availability[day]?.[slot];
    if (!current?.selected) return; // ignore taps on disabled slots
    dispatch({
      type: 'SET_SLOT_LONG_OK',
      payload: { day, slot, longOK: !current.longOK },
    });
  };

  const onBack = () => router.back();
  const onNext = () => router.push('/wizard/ability/swimmingability');

  // Soft recommendation: count how many long-capable were marked
  const longCount = useMemo(() => {
    let n = 0;
    for (const { label } of DAYS) {
      const d = availability[label];
      if (d?.am?.selected && d.am.longOK) n++;
      if (d?.pm?.selected && d.pm.longOK) n++;
    }
    return n;
  }, [availability]);

  return (
    <View style={styles.root}>
      <WizardHeader step={2} totalSteps={TOTAL_WIZARD_STEPS} onCloseRoute="/(tabs)" />

      <ScrollView
        style={[styles.content, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={{ justifyContent: 'flex-start' }}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="headlineSmall" style={styles.title}>
          Which of your selected sessions can be a longer session?
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Mark any <Text style={{ fontWeight: '700' }}>AM</Text> or <Text style={{ fontWeight: '700' }}>PM</Text> slots where you have more than 2 hours to train. This is useful for longer run/cycles or brick sessions.
        </Text>
        <Text variant="bodyLarge" style={[styles.tip, { color: theme.colors.secondary }]}>
          Tip: 1–2 long-capable sessions per week works well for most plans.
        </Text>

        <Card mode="elevated" style={styles.tableCard}>
                  <View style={styles.tableHeader}>
                    <Text style={styles.tableHeaderDay}>{''}</Text>
                    <Text variant="titleMedium" style={styles.tableHeaderText}>AM</Text>
                    <Text variant="titleMedium" style={styles.tableHeaderText}>PM</Text>
                  </View>

        {DAYS.map(({ key, label }) => {
          const day = availability[label];
          const amSelected = !!day?.am?.selected;
          const pmSelected = !!day?.pm?.selected;
          const amLongOK = !!day?.am?.longOK;
          const pmLongOK = !!day?.pm?.longOK;
          const dim = !amSelected && !pmSelected;

          return (

            <View key={key} style={styles.tableRow}>
                <Text variant="titleMedium" style={styles.dayLabel}>{label}</Text>
                    <View style={styles.checkboxContainer}>
                      {amSelected ? 
                      <Checkbox.Android
                        status={amSelected && amLongOK ? 'checked' : 'unchecked'}
                        onPress={() => toggleLong(label, 'am')}
                      /> : '' }
                    </View>
                    <View style={styles.checkboxContainer}>
                      {pmSelected ? 
                      <Checkbox.Android
                        status={pmLongOK ? 'checked' : 'unchecked'}
                        onPress={() => toggleLong(label, 'pm')}
                      /> : '' }
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
          accessibilityLabel="Next: set swimming level"
          contentStyle={styles.nextButtonContent}
          disabled={!hasAnySelectedSessions}
        >
          Next
        </Button>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, padding: 20, gap: 16 },
  title: { marginBottom: 8 },
  subtitle: { marginBottom: 8 },
  tip: { marginBottom: 8 },
  noticeCard: { marginTop: 12, borderRadius: 12 },
  noticeInner: { padding: 16 },
  dayCard: { marginVertical: 6, borderRadius: 12 },
  dayHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, paddingHorizontal: 12 },
  slotRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 6, paddingBottom: 6, flexWrap: 'wrap' },
  slotCol: { flexGrow: 1, minWidth: '45%', borderRadius: 10, justifyContent: 'center' },
  checkboxItem: { borderRadius: 8 },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  nextButtonContent: { height: 48 },

  // New styles for the table layout
  tableCard: {
    marginVertical: 6,
    borderRadius: 12,
    padding: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 15,
    // borderBottomWidth: 1,
  },
  tableHeaderDay: {
    flex: 2, // Give more space for the day label
  },
  tableHeaderText: {
    flex: 1,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    // borderBottomWidth: 0.5,
    // borderColor: T, // Lighter border for rows
  },
  dayLabel: {
    flex: 2,
  },
  checkboxContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
