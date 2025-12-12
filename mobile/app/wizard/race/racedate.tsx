import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Card, Text, useTheme, Button, HelperText, Divider, Icon } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import WizardHeader from '@/src/components/WizardHeader';
import { useWizardDispatch, useWizardState } from '@/src/context/WizardContext';
import { TOTAL_WIZARD_STEPS } from '@/constants/appConstants';
import { fmtDate, nextMonday } from '@/utils/helpers';
import { SafeAreaView } from 'react-native-safe-area-context';

const WEEK_MS = 7 * 24 * 3600 * 1000;

export default function RaceDatesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useWizardDispatch();
  const state = useWizardState();

  const today = new Date(); today.setHours(0, 0, 0, 0);

  // Seed from context, allow nullish
  const [raceDate, setRaceDate] = useState<Date>(state.raceDate ?? new Date(Math.max(today.getTime(), (state.startDate ?? today).getTime() + WEEK_MS)));


  const onChangeRace = (_: any, selected?: Date) => {
    if (!selected) return;
    const r = new Date(selected); r.setHours(0, 0, 0, 0);
    setRaceDate(r);
  };

  const weeksToGo = useMemo(() => {
    const ms = Math.max(0, raceDate.getTime() - today.getTime());
    return Math.max(1, Math.ceil(ms / WEEK_MS));
  }, [today, raceDate]);

  const distance = state.distance ?? 'Sprint';

  // const isTooSoon =
  //   (distance === 'Olympic' && weeksToGo < 6) ||
  //   (distance === 'Half Ironman' && weeksToGo < 12);

  const onNext = () => {
    dispatch({ type: 'SET_RACE_DATE', payload: raceDate });
    router.push('/wizard/availability/sessions');
  };

  return (
    <View style={styles.root}>
      <WizardHeader step={3} />
      <ScrollView style={[styles.content, { backgroundColor: theme.colors.background }]} contentContainerStyle={{ flexDirection: 'column', justifyContent: 'center' }}>
        <Text variant="headlineSmall" style={styles.title}>
          What date is the race?
        </Text>
        <DateTimePicker
          value={raceDate}
          minimumDate={today}
          mode='date'

          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeRace}
        />

        {/* <Divider style={{marginTop: 16}}/> */}

        <HelperText
          type="error"
          // visible={isTooSoon}
          style={{ marginTop: 4 }}
          accessibilityRole="alert"
        >
          <Icon source="alert-circle" size={16} />{'  '}
          This program length is quite short for {distance.toLowerCase()} plan — intensity will be adjusted to cater for this.
        </HelperText>
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={[styles.footer, { backgroundColor: theme.colors.background }]}>
        <Button
          mode="contained"
          onPress={onNext}
          accessibilityLabel="Next: choose availability days"
          contentStyle={{ height: 48 }}
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
  title: { marginBottom: 12 },
  subtitle: { marginBottom: 12 },
  sectionTitle: { marginTop: 8, marginBottom: 8 },
  nextButton: { marginTop: 16 },
  weeksCard: { borderRadius: 12, borderWidth: 1 },
  weeksContent: { alignItems: 'center', justifyContent: 'center', gap: 2 },
  footer: {
    // borderTopWidth: StyleSheet.hairlineWidth,
    // borderColor: 'rgba(0,0,0,0.12)',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12, // extra breathing room above home indicator
  },
  nextButtonContent: {
    height: 48,              // consistent tappable size
  },
});
