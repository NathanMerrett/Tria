import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, useTheme, Divider } from 'react-native-paper';
import { useRouter } from 'expo-router';
import WizardHeader from '@/src/components/WizardHeader';
import { TOTAL_WIZARD_STEPS } from '@/constants/appConstants';

export default function WizardEntry() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={styles.rootContainer}>
      <WizardHeader step={1} />
      <View style={[styles.content, { backgroundColor: theme.colors.background }]}>
        <Text variant="headlineSmall" style={{ marginBottom: 8 }}>
          What plan are you looking for?
        </Text>
        {/* <Text variant="titleSmall" style={{ marginBottom: 20, opacity: 0.9 }}>
          Choose the path that fits you best.
        </Text> */}

        {/* Primary: I have a race */}
        <Card
          mode="elevated"
          onPress={() => router.push('/wizard/race/distance')}
          style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}
          accessible accessibilityLabel="I have a race. Build a plan to my race date."
        >
          <Card.Content>
            <Text variant="titleLarge" style={{ marginBottom: 6 }}>I’ve booked a race</Text>
            <Text variant="bodyMedium" style={styles.cardBody}>
              Tell us your distance and race date. We’ll build backwards so you arrive ready.
            </Text>
          </Card.Content>
        </Card>
        <Card
          mode="elevated"
          onPress={() => router.push('/wizard/plan/weeks')}
          style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}
          accessible accessibilityLabel="I just want a plan. Pick distance, weeks, and start date."
        >
          <Card.Content>
            <Text variant="titleLarge" style={{ marginBottom: 6 }}>I just want a plan</Text>
            <Text variant="bodyMedium" style={styles.cardBody}>
              No race yet? Pick a distance, choose how many weeks, and set a start date.
            </Text>
          </Card.Content>
        </Card>

        <View style={{ height: 12 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: { flex: 1 },
  content: { flex: 1, padding: 20, gap: 16 },
  card: { borderRadius: 12 },
  title: { textAlign: 'left', marginBottom: 8 },
  subtitleText: { textAlign: 'left', marginBottom: 10 },
  cardBody: { opacity: 0.9 },
  cardActions: { justifyContent: 'flex-end', paddingRight: 8, paddingBottom: 8 },
  divider: { marginVertical: 8, opacity: 0.2 },
});
