import { View, FlatList, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useMemo } from 'react';
import { Appbar, Card, Text, List, Chip, useTheme } from 'react-native-paper';
import { getWeeksByPlan, getWorkoutsByWeek } from '../../../../../../data/plan';

export default function WeekOverview() {
  const theme = useTheme();
  const { planId, weekId } = useLocalSearchParams<{ planId: string; weekId: string }>();

  // Find the selected week from the plan
  const week = useMemo(() => {
    const arr = getWeeksByPlan(String(planId)) ?? [];
    return arr.find(w => String(w.id) === String(weekId));
  }, [planId, weekId]);

  if (!week) {
    return (
      <View style={styles.center}>
        <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Week" />
        </Appbar.Header>
        <Text variant="titleMedium" style={{ marginTop: 24 }}>Week not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title={`Week ${week.number ?? ''}`}
          subtitle={formatRange(week)}
        />
      </Appbar.Header>

      <WeekBody week={week} />
    </View>
  );
}

function WeekBody({ week }: { week: any }) {
  const workouts = getWorkoutsByWeek(week.id); // [{ id, name, dayLabel, duration, modality, status }]
  const days = groupByDay(workouts);           // [{ day:'Mon', items:[...] }, ...]

  return (
    <FlatList
      data={days}
      keyExtractor={(d: any) => d.day}
      renderItem={({ item: d }: any) => (
        <Card style={styles.card}>
          <Card.Title
            title={`${d.day} • ${prettyDate(d.date ?? week.start)}`}
            right={() => (
              <Chip compact>
                {d.items.filter((x: any) => x.status === 'done').length}/{d.items.length} done
              </Chip>
            )}
          />
          <Card.Content>
            {d.items.map((w: any) => (
              <List.Item
                key={w.id}
                title={w.name}
                description={`${w.modality} • ${w.duration} min`}
                left={(p) => <List.Icon {...p} icon={iconFor(w.modality)} />}
              />
            ))}
            {d.items.length === 0 && <Text variant="bodyMedium">Rest</Text>}
          </Card.Content>
        </Card>
      )}
      contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
    />
  );
}

/** helpers **/
function formatRange(week?: any) {
  if (!week) return '';
  const s = new Date(week.start); const e = new Date(week.end);
  return `${s.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })} – ${e.toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}`;
}
function prettyDate(d: string | Date) {
  const dt = new Date(d);
  return dt.toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short' });
}
function groupByDay(workouts: any[]) {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const map: Record<string, any[]> = Object.fromEntries(days.map(d => [d, []]));
  workouts.forEach(w => { map[w.dayLabel ?? 'Mon']?.push(w); });
  return days.map(day => ({ day, items: map[day] ?? [] }));
}
function iconFor(modality?: string) {
  switch ((modality || '').toLowerCase()) {
    case 'run': return 'run';
    case 'bike': return 'bike';
    case 'swim': return 'waves';
    default: return 'calendar';
  }
}

const styles = StyleSheet.create({
  card: { marginHorizontal: 12, borderRadius: 16 },
  center: { flex: 1, alignItems: 'stretch' },
});
