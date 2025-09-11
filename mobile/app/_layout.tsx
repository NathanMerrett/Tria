import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { UserProvider, useUser } from "../context/UserContext";
import { PaperProvider } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { SafeAreaProvider } from "react-native-safe-area-context";


SplashScreen.preventAutoHideAsync();

function Boot() {
  const { loading, session, user } = useUser(); // Destructure session and user to log them

  useEffect(() => {
    console.log('Boot Component: useEffect triggered. Loading:', loading);
    if (!loading) {
      console.log('Boot Component: Loading is false, hiding splash screen.');
      SplashScreen.hideAsync();
    }
  }, [loading]);

  console.log('Boot Component: Rendering. Current loading state:', loading, 'Session:', session ? 'Active' : 'None', 'User:', user ? user.id : 'None');

  if (loading) {
    console.log('Boot Component: Still loading, returning null.');
    return null;
  }

  console.log('Boot Component: Loading complete, rendering Slot.');
  return <Slot />;
}

export default function RootLayout() {
  const theme = useAppTheme();
  console.log('RootLayout: Rendering...');
  
  return (
    <UserProvider>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <Boot />
        </PaperProvider>
      </SafeAreaProvider>
    </UserProvider>
  );
}