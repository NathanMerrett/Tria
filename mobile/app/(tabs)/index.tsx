import React, { useState } from 'react';
import { View, FlatList, ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, Text, Chip } from 'react-native-paper';

import { useWeekSnapshot } from '@/src/features/plan/hooks/useActiveWeek';
import { WorkoutCard } from '@/src/features/plan/components/TodayScreen/WorkoutCard';
import { NoActivePlanState } from '@/src/features/plan/components/NoActivePlanState';
import { WeekCalendar } from '@/src/features/plan/components/TodayScreen/WeekCalendar';
import { CoachesNote } from '@/src/features/plan/components/CoachesNote';

export default function IndexScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data, isLoading, hasPlan, toggleWorkout, refetch } = useWeekSnapshot(selectedDate);

  if (isLoading && !data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!hasPlan) return <NoActivePlanState onCreate={() => router.push('/wizard')} />;

  const dailyWorkouts = data?.selectedDay.workouts || [];

  const ScreenHeader = () => (
    <View style={{ marginBottom: 10 }}>
      {/* PHASE CHIP */}
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 }}>
        {hasPlan && (
          <Chip compact mode="flat" style={{ backgroundColor: theme.colors.secondaryContainer }}>
            {`${data?.currentPhase} • Wk ${data?.planProgress?.currentWeek}`}
          </Chip>
        )}
      </View>

      {/* COACHES NOTE */}
      <View style={{ marginBottom: 20 }}>
        <CoachesNote note={data?.selectedDay.notes} />
      </View>

      {/* TITLE */}
      <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
        Planned Workouts
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>

      {/* CALENDAR (Fixed) */}
      <WeekCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      <FlatList
        data={dailyWorkouts}
        keyExtractor={(item) => item.id}

        // Use a single style object for the heavy lifting of layout
        contentContainerStyle={styles.listContent}

        ListHeaderComponent={<ScreenHeader />}

        renderItem={({ item }) => (
          <WorkoutCard
            workout={item}
            onToggle={(_id, status) => toggleWorkout(item.id, status)}
            onPress={() => router.push(`/workout/${item.id}`)}
          />
        )}

        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>Rest Day</Text>
            <Text variant="bodyMedium" style={{ marginTop: 8, textAlign: 'center', color: theme.colors.onSurfaceVariant }}>
              No workouts scheduled. Enjoy the recovery!
            </Text>
          </View>
        }

        onRefresh={refetch}
        refreshing={isLoading}
      />
    </SafeAreaView>
  );
}

// Only keep styles that manage complex layout or "magic numbers"
const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16, // The source of truth for left/right alignment
    paddingTop: 16,
    paddingBottom: 40,
    flexGrow: 1
  },
});