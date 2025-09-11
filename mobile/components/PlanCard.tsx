import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, useTheme, ProgressBar, Divider } from 'react-native-paper';
import type { Plan } from '../data/plan';

type Props = {
  plan: Plan;
};

const MS_DAY = 24 * 60 * 60 * 1000;
const MS_WEEK = 7 * MS_DAY;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const formatDate = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const plural = (n: number, unit: string) =>
  `${Math.abs(n)} ${unit}${Math.abs(n) === 1 ? '' : 's'}`;

const PlanCard: React.FC<Props> = ({ plan }) => {
  const theme = useTheme();

  const {
    totalWeeks,
    currentWeek,
    progress,
    daysToRace,
    countdownLabel,
    rangeLabel,
  } = useMemo(() => {
    const start = new Date(plan.startsOn);
    const end = new Date(plan.endsOn);
    const now = new Date();

    const totalWeeks = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime() + 1) / MS_WEEK)
    );
    const raw = Math.floor((now.getTime() - start.getTime()) / MS_WEEK) + 1;
    const currentWeek = clamp(raw, 0, totalWeeks);
    const progress = totalWeeks > 0 ? currentWeek / totalWeeks : 0;

    const daysToRace = Math.ceil(
      (end.setHours(23, 59, 59, 999) - now.getTime()) / MS_DAY
    );

    const countdownLabel =
      daysToRace > 0
        ? `${plural(daysToRace, 'day')} to go`
        : daysToRace === 0
        ? 'Race is today'
        : `${plural(daysToRace, 'day')} since race`;

    const rangeLabel = `${formatDate(plan.startsOn)} – ${formatDate(
      plan.endsOn
    )}`;

    return { totalWeeks, currentWeek, progress, daysToRace, countdownLabel, rangeLabel };
  }, [plan]);

  return (
    <Card
      mode='contained'
      style={[
        styles.card,
        { backgroundColor: theme.colors.surfaceVariant },
      ]}
    >
      {/* Header */}
      <Card.Content style={styles.header}>
        <View style={styles.headerLeft}>
          <Text variant="titleMedium" style={styles.cardTitle}>
            {plan.name}
          </Text>
          <Text variant="labelLarge" style={styles.subtle}>
            {plan.discipline} • {plan.level}
          </Text>
          <Text variant="labelMedium" style={styles.subtle}>
            {rangeLabel}
          </Text>
        </View>
      </Card.Content>

      {/* Progress */}
      <Card.Content style={styles.progressSection}>
        <View style={styles.progressRow}>
          <Text variant="labelMedium">
            Week {currentWeek} of {totalWeeks}
          </Text>
          <Text variant="labelMedium">{Math.round(progress * 100)}%</Text>
        </View>
        <ProgressBar
          progress={progress}
          style={styles.progressBar}
          color={theme.colors.primary}
        />
      </Card.Content>

      <Divider style={styles.divider} />

      {/* Race / Countdown */}
      <Card.Content style={styles.footerSection}>
        <View style={styles.footerRow}>
          <Text variant="bodyMedium">Race day: {formatDate(plan.endsOn)}</Text>
          <Text
            variant="bodyMedium"
            style={[
              styles.countdown,
              daysToRace < 0 ? { color: theme.colors.outline } : undefined,
            ]}
          >
            {countdownLabel}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
  },
  header: {
    paddingBottom: 0,
  },
  headerLeft: {
    gap: 3,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtle: {
    opacity: 0.8,
  },
  progressSection: {
    paddingTop: 10,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressBar: {
    height: 8,
    borderRadius: 6,
  },
  divider: {
    opacity: 0.6,
  },
  footerSection: {
    paddingTop: 8,
    paddingBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countdown: {
    fontWeight: '600',
  },
});

export default PlanCard;
