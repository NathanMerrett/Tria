import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

/**
 * Deep-link target for OAuth redirects.
 * In the openAuthSessionAsync flow, iOS intercepts the tria:// redirect before
 * it fires as a deep link, so this screen is never rendered in the normal path.
 * AuthGate in _layout.tsx handles all post-auth navigation via onAuthStateChange.
 */
export default function CallbackScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text variant="bodyMedium" style={styles.text}>
        Completing sign in…
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#0F172A',
  },
  text: {
    color: '#94A3B8',
  },
});
