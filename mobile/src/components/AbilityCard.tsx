// components/AbilityCard.tsx
import React, { memo } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { AbilityRatingType } from '../context/WizardContext';

export type AbilityCardProps = {
  title: string;
  subtitle?: string;
  ability: AbilityRatingType;
  onPress: (ability: AbilityRatingType) => void;
  style?: ViewStyle;
  accessibilityLabel?: string;
  testID?: string;
};

function AbilityCard({
  title,
  subtitle,
  ability,
  onPress,
  style,
  accessibilityLabel,
  testID,
}: AbilityCardProps) {
  const theme = useTheme();

  return (
    <Card
      mode="elevated"
      onPress={() => onPress(ability)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? `${title}. ${subtitle ?? ''}`.trim()}
      style={[styles.card, style, { backgroundColor: theme.colors.surfaceVariant }]}
      testID={testID}
    >
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
        {!!subtitle && (
          <Text variant="bodyMedium" style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12 },
  title: { marginBottom: 8, fontWeight: 'bold' },
  subtitle: { opacity: 0.8 },
});

export default memo(AbilityCard);
