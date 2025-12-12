// // app/wizard/start/start-date.tsx
// import React, { useEffect, useMemo, useState } from 'react';
// import { View, StyleSheet, ScrollView, Platform } from 'react-native';
// import { Card, Text, Button, Chip, useTheme, ActivityIndicator, HelperText, Divider } from 'react-native-paper';
// import { useRouter } from 'expo-router';
// import WizardHeader from '@/src/components/WizardHeader';
// import { useWizardDispatch, useWizardState } from '@/src/context/WizardContext';
// import { TOTAL_WIZARD_STEPS } from '@/constants/appConstants';
// import { apiFetch } from '@/src/api/config';

// // If you already have a typed API client, replace this with it.
// const READINESS_PATH = '/v1/plan/assess';

// // ---- Types returned by your backend ----
// type ReadinessResponse = {
//   status: 'green' | 'amber' | 'red';
//   message: string;
//   weeks_available: number;
//   minimum_plan_length: number;
//   ideal_plan_length: number;
//   min_plan_start_date: string;     // ISO
//   ideal_plan_start_date: string;   // ISO
//   suggested_start_date: string;    // ISO
//   suggested_start_mode: string;
//   earliest_start_date: string;     // ISO
//   join_week_index: number | null;
//   race_week_start: string;         // ISO
// };

// // ---- Local helpers ----
// const fmt = (iso: string | Date) =>
//   new Date(iso).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

// const toISO = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

// const clampDate = (d: Date, min: Date, max: Date) => new Date(Math.min(Math.max(d.getTime(), min.getTime()), max.getTime()));
// export default function StartDate() {
//   const theme = useTheme();
//   const router = useRouter();
//   const dispatch = useWizardDispatch();
//   const wizard = useWizardState(); // assumes you’ve stored prior steps here

//   const [data, setData] = useState<ReadinessResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);

//   // user selection
//   const [selectedISO, setSelectedISO] = useState<string | null>(null);
//   const [customISO, setCustomISO] = useState<string | null>(null);

//   // bounds (memoize for safety)
//   const bounds = useMemo(() => {
//     if (!data) return null;
//     const min = new Date(data.earliest_start_date);      // cannot start before this
//     const max = new Date(data.race_week_start);          // cannot start on/after race week start
//     return { min, max };
//   }, [data]);

//   useEffect(() => {
//     const fetchReadiness = async () => {
//       try {
//         setLoading(true);
//         setErr(null);

//         const payload = {
//           distance: wizard.distance,
//           race_date: wizard.raceDate,
//           swim_ability: wizard.swimAbility,
//           bike_ability: wizard.bikeAbility,
//           run_ability: wizard.runAbility
//         };

//         console.log(payload)

//         const json = await apiFetch<ReadinessResponse>(READINESS_PATH, {
//           method: 'POST',
//           body: JSON.stringify(payload),
//         });


//         setData(json);
//         setSelectedISO(json.suggested_start_date);
//       } catch (e: any) {
//         setErr(e?.message || 'Failed to assess readiness.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReadiness();
//   }, []);

//   const readyToContinue = !!selectedISO && !!data;

//   const onPickPreset = (iso: string) => {
//     if (!bounds) return;
//     const d = clampDate(new Date(iso), bounds.min, bounds.max);
//     const boundedISO = toISO(d);
//     setCustomISO(null);
//     setSelectedISO(boundedISO);
//   };

//   const onPickCustomToday = () => {
//     if (!bounds) return;
//     const d = clampDate(new Date(), bounds.min, bounds.max);
//     const boundedISO = toISO(d);
//     setCustomISO(boundedISO);
//     setSelectedISO(boundedISO);
//   };

//   const onContinue = () => {
//     if (!data || !selectedISO) return;
//     dispatch({ type: 'SET_START_DATE', payload: new Date(selectedISO) });
//     router.push('/wizard/review');
//   };

//   // UI bits
//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <WizardHeader step={12} />
//         <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
//           <ActivityIndicator />
//           <Text style={{ marginTop: 12 }}>Assessing readiness…</Text>
//         </View>
//       </View>
//     );
//   }

//   if (err || !data) {
//     return (
//       <View style={styles.container}>
//         <WizardHeader step={12} />
//         <View style={[styles.center, { padding: 16 }]}>
//           <Text variant="headlineSmall" style={{ marginBottom: 8 }}>Something went wrong</Text>
//           <HelperText type="error" visible>{err || 'Unknown error'}</HelperText>
//           <Button mode="contained" onPress={() => router.back()} icon="arrow-left">Go back</Button>
//         </View>
//       </View>
//     );
//   }

//   const minISO = toISO(bounds!.min);
//   const maxISO = toISO(bounds!.max);

//   const PresetButton = ({
//     label,
//     dateISO,
//     testID,
//   }: { label: string; dateISO: string; testID?: string }) => {
//     const selected = selectedISO === toISO(new Date(dateISO));
//     return (
//       <Button
//         mode={selected ? 'contained' : 'outlined'}
//         onPress={() => onPickPreset(dateISO)}
//         style={{ marginVertical: 4 }}
//         testID={testID}
//       >
//         {label}: {fmt(dateISO)}
//       </Button>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <WizardHeader step={12} />
//       <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={styles.scrollContent}>

//         {/* Risk / Summary */}
//         <Card mode="elevated">
//           <Card.Content>
//             <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
//               <Text style={{ color: theme.colors.onSurfaceVariant }}>Weeks available: {data.weeks_available}</Text>
//             </View>
//             <Text variant="titleMedium" style={{ marginBottom: 6 }}>
//               Readiness assessment
//             </Text>
//             <Text style={{ color: theme.colors.onSurfaceVariant }}>{data.message}</Text>
//           </Card.Content>
//         </Card>

//         {/* Dates + Modes */}
//         <Card>
//           <Card.Content style={{ gap: 8 }}>
//             <Text variant="titleMedium">Plan timing</Text>
//             <Text>Race week starts: <Text style={{ fontWeight: '600' }}>{fmt(data.race_week_start)}</Text></Text>
//             <Text>Earliest possible start: <Text style={{ fontWeight: '600' }}>{fmt(data.earliest_start_date)}</Text></Text>
//             <Divider style={{ marginVertical: 8 }} />
//             <Text>Minimum full-plan start: {fmt(data.min_plan_start_date)} ({data.minimum_plan_length} wks)</Text>
//             <Text>Ideal full-plan start: {fmt(data.ideal_plan_start_date)} ({data.ideal_plan_length} wks)</Text>
//             <Text>Suggested: <Text style={{ fontWeight: '600' }}>{fmt(data.suggested_start_date)}</Text> ({data.suggested_start_mode}{typeof data.join_week_index === 'number' ? `, join at week ${data.join_week_index + 1}` : ''})</Text>
//           </Card.Content>
//         </Card>

//         {/* Choice group */}
//         <Card>
//           <Card.Content>
//             <Text variant="titleMedium" style={{ marginBottom: 8 }}>Choose your start date</Text>

//             <PresetButton label="Suggested" dateISO={data.suggested_start_date} testID="start-suggested" />
//             <PresetButton label="Ideal" dateISO={data.ideal_plan_start_date} testID="start-ideal" />
//             <PresetButton label="Minimum" dateISO={data.min_plan_start_date} testID="start-minimum" />

//             <Divider style={{ marginVertical: 8 }} />
//             <Text variant="titleSmall" style={{ marginBottom: 6 }}>Or pick today (bounded)</Text>
//             <Button mode={customISO ? 'contained' : 'outlined'} onPress={onPickCustomToday} icon={Platform.OS === 'ios' ? 'calendar' : 'calendar-month'}>
//               Use today: {fmt(toISO(clampDate(new Date(), bounds!.min, bounds!.max)))}
//             </Button>
//             <HelperText type="info" visible>
//               Start date must be between {fmt(minISO)} and {fmt(maxISO)}.
//             </HelperText>

//             {selectedISO && (
//               <Chip style={{ alignSelf: 'flex-start', marginTop: 8 }}>
//                 Selected: {fmt(selectedISO)}
//               </Chip>
//             )}
//           </Card.Content>
//         </Card>

//         {/* Continue */}
//         <View style={{ flexDirection: 'row', gap: 12 }}>
//           <Button mode="outlined" onPress={() => router.back()} icon="arrow-left" style={{ flex: 1 }}>
//             Back
//           </Button>
//           <Button
//             mode="contained"
//             onPress={onContinue}
//             disabled={!readyToContinue}
//             icon="arrow-right"
//             style={{ flex: 1 }}
//             testID="start-continue"
//           >
//             Continue
//           </Button>
//         </View>

//         {/* Edge-case help for red risk */}
//         {data.status === 'red' && (
//           <HelperText type="error" visible style={{ marginTop: -4 }}>
//             Your risk is high. Consider choosing the Ideal or Minimum full-plan start, or set a later race date.
//           </HelperText>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   scrollContent: { padding: 10, gap: 16, justifyContent: 'flex-start' },
//   center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
// });
