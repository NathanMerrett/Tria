import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import WeekCard from '../../../components/WeekCard';
import PlanCard from '../../../components/PlanCard';
import { currentUser } from '../../../data/auth';
import { getUserActivePlan, getWeeksByPlan, getWorkoutsByWeek } from '../../../data/plan';
import { useTheme, Text, Button, Card, Appbar, Divider } from 'react-native-paper';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function PlanScreen() {
  const activePlan = getUserActivePlan(currentUser.id);
  const weeks = activePlan ? getWeeksByPlan(activePlan.id) : [];
  const theme = useTheme();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={styles.rootContainer}>
      <Appbar.Header style={{ backgroundColor: theme.colors.background, borderBottomWidth: 1, borderBottomColor: theme.colors.outlineVariant }}>
        <Appbar.Content title="Tria" titleStyle={styles.appbarTitle} />
        <Appbar.Action icon="account-circle" onPress={() => router.push('/profile')} />
      </Appbar.Header>

      <SafeAreaView style={[styles.contentSafeArea, { backgroundColor: theme.colors.background }]}>
        <ScrollView
          contentContainerStyle={{
            paddingTop: 12,
            paddingHorizontal: 12,
            paddingBottom: tabBarHeight,
          }}
        >
          {/* Plan overview */}
          {activePlan ? (
            <PlanCard
              plan={activePlan}
              // onPress={() => router.push(`/plan/${activePlan.id}`)}
            />
          ) : (
            <Card>
              <Card.Content>
                <Text variant="titleMedium">No active plan</Text>
                <Text variant="bodyMedium" style={{ opacity: 0.8, marginTop: 4 }}>
                  Create or pick a training plan to get started.
                </Text>
              </Card.Content>
              <Card.Actions>
                <Button>Browse plans</Button>
              </Card.Actions>
            </Card>
          )}

          {/* Visual separation */}
          <Divider style={{ marginVertical: 26 }} />

          {/* Weeks */}
          {weeks.length === 0 ? (
            <Text style={{ opacity: 0.7, textAlign: 'center', marginTop: 24 }}>
              No weeks to show yet.
            </Text>
          ) : (
            weeks.map((week, idx) => (
              <View key={week.id} style={idx === 0 ? styles.firstWeek : styles.weekSpacer}>
                <WeekCard
                  week={week}
                  workouts={getWorkoutsByWeek(week.id)}
                  onPress={() => router.push(`/plan/${activePlan?.id}/week/${week.id}`)}
                />
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: { flex: 1 },
  appbarTitle: { fontWeight: 'bold' },
  contentSafeArea: { flex: 1 },
  firstWeek: { marginTop: 0 },
  weekSpacer: { marginTop: 16 }, // extra spacing between weeks
});
