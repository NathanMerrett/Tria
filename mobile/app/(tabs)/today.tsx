import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState, Fragment } from 'react';
import { Stack, router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useUser } from '@/context/UserContext';
import dayjs from 'dayjs';
import WorkoutListItem from '@/components/WorkoutListItem';

export default function TodayScreen() {
  const { user } = useUser();
  const userId = user?.id;

  const [todaysWorkouts, setTodaysWorkouts] = useState<any[]>([]);
  const [hasPlan, setHasPlan] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchPlanAndWorkouts = async () => {
      const { data: plan, error: planError } = await supabase
        .from('plans')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      if (planError) console.error(planError);

      if (!plan) {
        setHasPlan(false);
        setLoading(false);
        return;
      }

      setHasPlan(true);

      const today = dayjs().format('YYYY-MM-DD');

      const { data: workouts, error: workoutsError } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId)
        .eq('workout_date', today);

      if (workoutsError) console.error(workoutsError);

      setTodaysWorkouts(workouts ?? []);
      setLoading(false);
    };

    fetchPlanAndWorkouts();
  }, [userId]);

  // 🔑 Sign-out handler
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/'); // adjust to your auth route
  };

  // ---------- RENDER ----------
  if (loading || hasPlan === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  // a) No active plan → start wizard
  if (!hasPlan) {
    return (
      <Fragment>
        {/* Header with Sign-out */}
        <Stack.Screen
          options={{
            // title: 'Today',
            headerRight: () => (
              <TouchableOpacity onPress={handleSignOut} style={{ paddingHorizontal: 16 }}>
                <Text style={{ color: '#EF4444', fontWeight: '500' }}>Sign out</Text>
              </TouchableOpacity>
            ),
          }}
        />
        {/* Body */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, marginBottom: 16 }}>
            You don&apos;t have an active plan yet.
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: '#4F46E5',
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
            }}
            onPress={() => router.push('../plan/wizard/step_1')}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Start New Plan</Text>
          </TouchableOpacity>
        </View>
      </Fragment>
    );
  }

  // b) Active plan → show workouts (or placeholder)
  const dataToRender =
    todaysWorkouts.length > 0
      ? todaysWorkouts
      : [
          {
            id: 'placeholder',
            name: 'Sample Workout',
            description: 'Chest & Triceps – 3×10 Bench Press, 3×12 Tricep Dips',
          },
        ];

  return (
    <Fragment>
      {/* Header with Sign-out */}
      <Stack.Screen
        options={{
          title: 'Today',
          headerRight: () => (
            <TouchableOpacity onPress={handleSignOut} style={{ paddingHorizontal: 16 }}>
              <Text style={{ color: '#EF4444', fontWeight: '500' }}>Sign out</Text>
            </TouchableOpacity>
          ),
        }}
      />

      {/* Body */}
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>
          Today&apos;s Workouts
        </Text>

        <FlatList
          data={dataToRender}
          renderItem={({ item }) => <WorkoutListItem/>}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </Fragment>
  );
}
