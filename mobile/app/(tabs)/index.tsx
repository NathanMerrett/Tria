import React from 'react';
import { View, Text, FlatList, ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from 'react-native-paper';

// --- FEATURE IMPORTS ---
// We pull in the pieces we built in src/features/schedule
import { useTodayWorkouts } from '@/src/features/schedule/hooks/useTodayWorkouts';
import { WorkoutCard } from '@/src/features/schedule/components/WorkoutCard';
import { NoActivePlanState } from '@/src/features/schedule/components/NoActivePlanState';

export default function IndexScreen() {
  const router = useRouter();
  const theme = useTheme();

  // 1. DATA LOGIC: Use the custom hook
  const {
    isLoading,
    hasPlan,
    planName,
    workouts,
    refresh,
    toggleWorkout
  } = useTodayWorkouts();

  // 2. NAVIGATION LOGIC
  const handleCardPress = (workoutId: string) => {
    router.push(`/workout/${workoutId}`);
  };

  // 3. LOADING STATE
  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // 4. EMPTY STATE (No Plan)
  if (!hasPlan) {
    return <NoActivePlanState onCreate={() => router.push('/wizard')} />;
  }

  // 5. MAIN CONTENT (Active Plan)
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={[styles.date, { color: theme.colors.onSurface }]}>
          {new Date().toDateString()}
        </Text>
        <Text style={[styles.planName, { color: theme.colors.secondary }]}>
          {planName}
        </Text>
      </View>

      {/* Workout List */}
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}

        // Render the Card with Split Actions
        renderItem={({ item }) => (
          <WorkoutCard
            workout={item}
            onToggle={toggleWorkout}     // Checkbox action
            onPress={handleCardPress}    // Navigate action
          />
        )}

        // "Rest Day" State
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
              Rest Day! No workouts scheduled.
            </Text>
          </View>
        }

        // Pull to Refresh
        onRefresh={refresh}
        refreshing={isLoading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  date: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planName: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.8
  },
  list: {
    padding: 16,
    paddingBottom: 40, // Extra space at bottom for scrolling
  },
  emptyText: {
    fontSize: 18,
    marginTop: 50,
    textAlign: 'center'
  }
});