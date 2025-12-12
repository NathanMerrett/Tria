import { Stack } from 'expo-router';
import { Appbar, useTheme } from 'react-native-paper';
import { router } from 'expo-router';

// This is the header that will be used for all screens INSIDE the profile stack
const WorkoutStackHeader = ({ }) => {
  const theme = useTheme();
  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.background, elevation: 0 }}>
      <Appbar.BackAction onPress={() => router.back()} />
      <Appbar.Content title={'Workout'} />
    </Appbar.Header>
  );
};

export default function WorkoutLayout() {
  return (
    <Stack screenOptions={{ header: WorkoutStackHeader }}>
      <Stack.Screen name="index" options={{ title: 'Workout' }} />
    </Stack>
  );
}