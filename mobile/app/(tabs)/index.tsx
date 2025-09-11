import { View, StyleSheet, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/context/UserContext';
import dayjs from 'dayjs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Text, Button, ActivityIndicator, Card, Appbar} from 'react-native-paper';
// import { getInitials } from '@/utils/helpers';

type Workout = {
  id: number; // Or string, depending on your database schema
  name: string;
  description: string;
  user_id: string;
  workout_date: string;
  // Add any other properties a workout might have
};

const TempWorkoutListItem = ({ item }: {item: Workout }) => {
  const theme = useTheme();
  return (
    <Card style={{ marginBottom: 12, backgroundColor: theme.colors.surface }}>
      <Card.Content>
        {item.name}
        {item.description}
      </Card.Content>
    </Card>
  );
};

export default function TodayScreen() {
  const { user, profile } = useUser();
  const theme = useTheme();
  const userId = user?.id;
  const username = profile?.first_name || 'there';
  // const initials = getInitials(profile?.full_name);
  const [todaysWorkouts, setTodaysWorkouts] = useState<Workout[]>([]);
  const [hasPlan, setHasPlan] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchPlanAndWorkouts = async () => {
      setLoading(true);
      const { data: plan, error: planError } = await supabase
        .from('plans')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();
      setLoading(false);

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

  // --- RENDER STATES ---

  if (loading) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  let content;

  if (!hasPlan) {
    // If there's no plan, assign the "No Plan" view to our content variable
    content = (
      <View style={styles.centeredContainer}>
        <Text variant="headlineLarge">
          Hey, {username}!
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          You don't have a plan set up yet.
        </Text>
        <Button
          mode="contained"
          icon="plus"
          style={styles.button}
          onPress={() => router.push('../wizard')}
        >
          Start New Plan
        </Button>
      </View>
    );
  } else {
    // If there IS a plan, assign the workout list to our content variable
    const dataToRender = todaysWorkouts.length > 0 ? todaysWorkouts : [/* ... sample data ... */];
    content = (
      <View style={styles.contentContainer}>
        <Text variant="headlineLarge">
          Hey, {username}!
        </Text>
        <Text variant="titleLarge" style={[styles.header, { color: theme.colors.onSurface }]}>
          Today's Workouts
        </Text>
        <FlatList
          data={dataToRender}
          renderItem={({ item }) => <TempWorkoutListItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingTop: 16 }}
        />
      </View>
    );
  }

  // 3. The final, single return statement renders the shell and the conditional content
  return (
    <View style={[styles.rootContainer, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.background }} >
        <Appbar.Content title="Tria" titleStyle={styles.appbarTitle}/>
        <Appbar.Action icon="account-circle" onPress={() => router.push('/profile')}/>
      </Appbar.Header>

      <SafeAreaView style={styles.contentSafeArea}>
        {content}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  appbarTitle: {
    fontWeight: 'bold',
  },
  contentSafeArea: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  header: {
    marginTop: 24,
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
  },
});