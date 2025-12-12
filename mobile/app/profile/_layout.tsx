import { Stack } from 'expo-router';
import { Appbar, useTheme } from 'react-native-paper';
import { router } from 'expo-router';

// This is the header that will be used for all screens INSIDE the profile stack
const ProfileStackHeader = ({ }) => {
  const theme = useTheme();
  return (
    <Appbar.Header style={{ backgroundColor: theme.colors.background, elevation: 0 }}>
      <Appbar.BackAction onPress={() => router.back()} />
      <Appbar.Content title={'Profile'} />
    </Appbar.Header>
  );
};

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ header: ProfileStackHeader }}>
      <Stack.Screen name="index" options={{ title: 'My Profile' }} />
      {/* <Stack.Screen name="edit" options={{ title: 'Edit Profile' }} /> */}
      {/* You can add more screens like 'settings' here */}
    </Stack>
  );
}