import { Stack, useRouter, useSegments } from 'expo-router';
import { UserProvider, useUser } from '../context/UserContext'; // Adjust path if needed
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// This is the component that contains the actual navigation logic.
// It's separate so it can be wrapped by the UserProvider.
const RootLayoutNav = () => {
  // Get the auth state and loading status from your custom hook
  const { session, loading } = useUser();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // 1. Wait until the session is loaded or an error occurs
    if (loading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    // 2. Hide the native splash screen now that we have auth status
    SplashScreen.hideAsync();

    // 3. Perform the redirect based on auth state
    if (session && !inAuthGroup) {
      // User is authenticated and not in an auth screen.
      // Redirect them to the main screen of the app.
      router.replace('/(tabs)/today'); // <-- Or your main app route
    } else if (!session && !inAuthGroup) {
      // User is not authenticated and is not in an auth screen.
      // This can happen if they are on a protected route and get logged out.
      // Send them to the login page.
      router.replace('/login');
    }

  }, [session, loading, segments]); // Re-run the effect when auth state or loading status changes

  // The Stack navigator will render the appropriate screen.
  // The useEffect handles the redirection logic.
  return <Stack screenOptions={{ headerShown: false }} />;
};

// This is the main export for the root layout.
export default function RootLayout() {
  return (
    // Your UserProvider wraps everything, making the user/session
    // available to all components, including RootLayoutNav.
    <UserProvider>
      <RootLayoutNav />
    </UserProvider>
  );
}