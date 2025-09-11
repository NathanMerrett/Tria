import { Stack } from 'expo-router';

export default function PlanLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* index.tsx renders under /plan */}
      {/* nested routes pick up their own titles */}
    </Stack>
  );
}