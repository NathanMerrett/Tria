import { View, Image, StyleSheet } from "react-native";
import { Link, Redirect } from "expo-router";
import { Button } from "react-native-paper";
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../context/UserContext";

export default function LandingPage() {
  const { session, loading } = useUser(); // Also destructure loading to understand when the check is complete
  const theme = useTheme();

  console.log('LandingPage: Rendering. Session:', session ? 'Active' : 'None', 'Loading:', loading);

  if (loading) {
    console.log('LandingPage: Still loading, rendering nothing yet.');
    return null; // Or a loading spinner if you prefer
  }

  if (session) {
    console.log('LandingPage: Session active, redirecting to (tabs).');
    return <Redirect href="/(tabs)" />;
  }

  console.log('LandingPage: No active session, showing login/signup options.');
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.content}>
        <Image
          source={require("../assets/images/tria_icon.png")}
          style={styles.logo}
        />
        <Link href="/(auth)/signup" asChild>
          <Button mode="contained" style={styles.button}> 
            Sign Up
          </Button>
        </Link>

        <Link href="/(auth)/login" asChild>
          <Button mode="outlined" style={styles.button}>
            Login
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 10,
  },
  button: {
    width: 200,
    marginBottom: 10
  }
});