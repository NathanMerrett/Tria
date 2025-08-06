import { View, Image, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { PaperProvider, Button } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '../components/PrimaryButton';
import { theme } from '../theme';

export default function LandingPage() {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          {/* Your Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/tria_icon.png')} // Adjust path as needed
              style={styles.logo}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            {/* Primary Action: Sign Up */}
            <Link href="/signup" asChild>
              <PrimaryButton title="Sign Up" style={styles.button} />
            </Link>

            {/* Secondary Action: Login */}
            <Link href="/login" asChild>
              <Button
                mode="outlined"
                style={styles.button}
                labelStyle={{ color: theme.colors.primary, fontWeight: 'bold' }}
              >
                Login
              </Button>
            </Link>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 24,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 240,
    height: 240,
    resizeMode: 'contain',
  },
  actions: {
    width: '100%',
  },
  button: {
    marginBottom: 12,
    paddingVertical: 4,
  },
});