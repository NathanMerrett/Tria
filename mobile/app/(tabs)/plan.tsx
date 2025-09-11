// import { View, StyleSheet, FlatList, SafeAreaView } from 'react-native';
// import { router } from 'expo-router';
// import WeekCard from '../../components/WeekCard';
// import { currentUser } from '../../data/auth';
// import { getUserActivePlan, getWeeksByPlan, getWorkoutsByWeek } from '../../data/plan';
// import { useTheme, Text, Button, ActivityIndicator, Card, Appbar} from 'react-native-paper';
// import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';


// export default function PlanScreen() {
//   const activePlan = getUserActivePlan(currentUser.id);
//   const weeks = activePlan ? getWeeksByPlan(activePlan.id) : [];
//   const theme = useTheme();
//   const tabBarHeight = useBottomTabBarHeight();

//   return (
//     <View style={styles.rootContainer}>
//       <Appbar.Header style={{ backgroundColor: theme.colors.background }} >
//         <Appbar.Content title="Tria" titleStyle={styles.appbarTitle}/>
//         <Appbar.Action icon="account-circle" onPress={() => router.push('/profile')}/>
//       </Appbar.Header>
      
//       <SafeAreaView style={styles.contentSafeArea}>
//         <FlatList
//           data={weeks}
//           keyExtractor={(w) => w.id}
//           renderItem={({ item: week }) => (
//             <WeekCard
//               week={week}
//               workouts={getWorkoutsByWeek(week.id)}
//               onPress={() => router.push(`/plan/${activePlan?.id}/week/${week.id}`)}
//             />
//           )}
//           contentContainerStyle={{ paddingTop: 12, paddingHorizontal: 12, paddingBottom: tabBarHeight}} // padding around all items
//           ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
//         />
//       </SafeAreaView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   rootContainer: {
//     flex: 1,
//   },
//   appbarTitle: {
//     fontWeight: 'bold',
//   },
//   contentSafeArea: {
//     flex: 1,
//   }
// });