import { Stack, Redirect } from "expo-router";
import { useUser } from "@/src/context/UserContext";

export default function AuthLayout() {
  const { session } = useUser();

  // Already logged in? Keep auth screens inaccessible.
  if (session) return <Redirect href="/(tabs)" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
