import React, { useMemo, useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, HelperText, useTheme, Card, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import WizardHeader from '@/src/components/WizardHeader';
import { useWizardDispatch } from '@/src/context/WizardContext';


// ---- helpers ---------------------------------------------------------------
const isFiniteNumber = (n: number) => Number.isFinite(n) && !Number.isNaN(n);

/** Parse a pace string that can be either seconds (e.g. "95") or mm:ss */
function parsePaceToSeconds(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^\d+$/.test(trimmed)) {
    const seconds = parseInt(trimmed, 10);
    return seconds >= 0 ? seconds : null;
  }
  const mmss = trimmed.match(/^(\d{1,2}):(\d{1,2})$/);
  if (mmss) {
    const mm = parseInt(mmss[1], 10);
    const ss = parseInt(mmss[2], 10);
    if (ss >= 60) return null; // invalid seconds
    return mm * 60 + ss;
  }
  return null;
}

function formatSecondsToMMSS(sec?: number | null): string {
  if (!isFiniteNumber(sec ?? NaN)) return '';
  const s = Math.max(0, Math.floor(sec!));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}:${ss.toString().padStart(2, '0')}`;
}

// ---- page -----------------------------------------------------------------
export default function FitnessBenchmarks() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useWizardDispatch();

  // Local UI state (as strings to keep user input flexible)
  const [swimCssInput, setSwimCssInput] = useState(''); // seconds OR mm:ss per 100m
  const [runTpInput, setRunTpInput] = useState(''); // seconds OR mm:ss per km
  const [ftpInput, setFtpInput] = useState(''); // watts

  const [swimMaxInput, setSwimMaxInput] = useState(''); // meters
  const [bikeMaxInput, setBikeMaxInput] = useState(''); // km
  const [runMaxInput, setRunMaxInput] = useState(''); // km

  const swimCssSeconds = useMemo(() => parsePaceToSeconds(swimCssInput), [swimCssInput]);
  const runTpSeconds = useMemo(() => parsePaceToSeconds(runTpInput), [runTpInput]);
  const ftp = useMemo(() => {
    const n = Number(ftpInput);
    return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
  }, [ftpInput]);

  const swimMax = useMemo(() => {
    const n = Number(swimMaxInput);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [swimMaxInput]);

  const bikeMax = useMemo(() => {
    const n = Number(bikeMaxInput);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [bikeMaxInput]);

  const runMax = useMemo(() => {
    const n = Number(runMaxInput);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [runMaxInput]);

  const hasErrors = {
    swimCss: swimCssInput.length > 0 && swimCssSeconds == null,
    runTp: runTpInput.length > 0 && runTpSeconds == null,
    ftp: ftpInput.length > 0 && ftp == null,
    swimMax: swimMaxInput.length > 0 && swimMax == null,
    bikeMax: bikeMaxInput.length > 0 && bikeMax == null,
    runMax: runMaxInput.length > 0 && runMax == null,
  } as const;

  const canContinue =
    swimCssSeconds != null &&
    runTpSeconds != null &&
    ftp != null &&
    swimMax != null &&
    bikeMax != null &&
    runMax != null &&
    !Object.values(hasErrors).some(Boolean);

  const onContinue = () => {
    if (!canContinue) return;

    // Dispatch to wizard context (see notes at the top re: units)
    dispatch({ type: 'SET_SWIM_CSS', payload: swimCssSeconds! }); // sec/100m
    dispatch({ type: 'SET_RUN_PACE', payload: runTpSeconds! }); // sec/km
    dispatch({ type: 'SET_BIKE_FTP', payload: ftp! }); // watts

    dispatch({ type: 'SET_SWIM_DISTANCE', payload: Math.round(swimMax!) }); // meters
    dispatch({ type: 'SET_BIKE_DISTANCE', payload: bikeMax! }); // kilometers
    dispatch({ type: 'SET_RUN_DISTANCE', payload: runMax! }); // kilometers

    // Navigate to the next step in the wizard
    router.push('/wizard/gear/gear');
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <WizardHeader step={7} />
      <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
          Whats your current fitness like?
        </Text>
        <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
          If you know them, tell us your latest performances across the 3 disciplines.
        </Text>

        {/* Current performance */}
        <Card mode="elevated" style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={{ marginBottom: 12 }}>Current Paces</Text>
            <TextInput
              label="Swimming CSS"
              value={swimCssInput}
              onChangeText={setSwimCssInput}
              mode='outlined'
              // placeholder="e.g. 1:35 or 95"
              keyboardType="numbers-and-punctuation"
              error={hasErrors.swimCss}
              right={<TextInput.Affix text="mm:ss" />}
              accessibilityLabel="Swim CSS pace per 100 meters"
              style={styles.input}
            />
            {/* <HelperText type={hasErrors.swimCss ? 'error' : 'info'} visible>
              {hasErrors.swimCss ? 'Enter mm:ss or total seconds' : `Parsed: ${formatSecondsToMMSS(swimCssSeconds)} /100m`}
            </HelperText> */}

            <TextInput
              mode='outlined'
              label="Running Threshold"
              value={runTpInput}
              onChangeText={setRunTpInput}
              placeholder="e.g. 4:15 or 255"
              keyboardType="numbers-and-punctuation"
              error={hasErrors.runTp}
              right={<TextInput.Affix text="mm:ss" />}
              accessibilityLabel="Run threshold pace per kilometer"
              style={styles.input}
            />
            {/* <HelperText type={hasErrors.runTp ? 'error' : 'info'} visible>
              {hasErrors.runTp ? 'Enter mm:ss or total seconds' : `Parsed: ${formatSecondsToMMSS(runTpSeconds)} /km`}
            </HelperText> */}

            <TextInput
              mode='outlined'
              label="Cycling FTP"
              value={ftpInput}
              onChangeText={setFtpInput}
              placeholder="e.g. 250"
              keyboardType="numeric"
              error={hasErrors.ftp}
              right={<TextInput.Affix text="W" />}
              accessibilityLabel="Cycling functional threshold power in watts"
              style={styles.input}
            />
            {/* <HelperText type={hasErrors.ftp ? 'error' : 'info'} visible>
              {hasErrors.ftp ? 'Enter a positive number in watts' : 'Estimated sustainable 60‑min power'}
            </HelperText> */}
          </Card.Content>
        </Card>

        <Divider style={{ marginVertical: 8 }} />

        {/* Recent single-session highs */}
        <Card mode="elevated" style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={{ marginBottom: 12 }}>Current Distances</Text>
            <Text variant="bodyMedium" style={{ marginBottom: 12 }}>Tip: Use the last 3 months as a baseline for this.</Text>

            <TextInput
              mode='outlined'
              label="Longest Swim"
              value={swimMaxInput}
              onChangeText={setSwimMaxInput}
              placeholder="e.g. 2500"
              keyboardType="numeric"
              error={hasErrors.swimMax}
              right={<TextInput.Affix text="m" />}
              accessibilityLabel="Longest single swim distance in meters in the last 3 months"
              style={styles.input}
            />
            {/* <HelperText type={hasErrors.swimMax ? 'error' : 'info'} visible>
              {hasErrors.swimMax ? 'Enter meters, e.g. 2500' : 'Meters swum in one session'}
            </HelperText> */}

            <TextInput
              label="Longest Cycle"
              mode='outlined'
              value={bikeMaxInput}
              onChangeText={setBikeMaxInput}
              placeholder="e.g. 80"
              keyboardType="numeric"
              error={hasErrors.bikeMax}
              right={<TextInput.Affix text="km" />}
              accessibilityLabel="Longest single bike distance in kilometers in the last 3 months"
              style={styles.input}
            />
            {/* <HelperText type={hasErrors.bikeMax ? 'error' : 'info'} visible>
              {hasErrors.bikeMax ? 'Enter kilometers, e.g. 80' : 'Kilometers ridden in one session'}
            </HelperText> */}

            <TextInput
              label="Longest Run"
              mode='outlined'
              value={runMaxInput}
              onChangeText={setRunMaxInput}
              placeholder="e.g. 15"
              keyboardType="numeric"
              error={hasErrors.runMax}
              right={<TextInput.Affix text="km" />}
              accessibilityLabel="Longest single run distance in kilometers in the last 3 months"
              style={styles.input}
            />
            {/* <HelperText type={hasErrors.runMax ? 'error' : 'info'} visible>
              {hasErrors.runMax ? 'Enter kilometers, e.g. 15' : 'Kilometers run in one session'}
            </HelperText> */}
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={onContinue}
          disabled={!canContinue}
          accessibilityRole="button"
          style={{ marginTop: 8 }}
        >
          Next
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, padding: 20, gap: 16, justifyContent: 'flex-start' },
  card: { borderRadius: 12 },
  input: { marginBottom: 12 },
});
