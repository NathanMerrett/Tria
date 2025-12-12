import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Card,
  Text,
  List,
  useTheme,
  ProgressBar,
  Divider,
} from 'react-native-paper';
import type { Week, Workout } from '../data/plan';

type Props = {
  week: Week;
  workouts: Workout[];
  onPress?: () => void;
};

const WeekCard: React.FC<Props> = ({ week, workouts, onPress }) => {
  const theme = useTheme();

  // --- Formatting helpers ---
  const formatDate = (iso?: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  };

  const formatDay = (iso?: string) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString(undefined, { weekday: 'short' });
  };

  const km = (val?: number) =>
    typeof val === 'number' ? `${val.toFixed(1)} km` : '';

  // --- Icons / colors per discipline ---
  const getWorkoutTypeProps = (type?: string) => {
    const t = (type || '').toLowerCase();
    if (t === 'run') return { icon: 'run', color: theme.colors.primary };
    if (t === 'bike') return { icon: 'bike', color: theme.colors.secondary };
    if (t === 'swim') return { icon: 'swim', color: theme.colors.tertiary };
    if (t === 'brick') return { icon: 'toy-brick', color: theme.colors.error };
    return { icon: 'dots-horizontal', color: theme.colors.outline };
  };

  // --- Aggregates ---
  const { total, completed, totalDistanceKm } = useMemo(() => {
    const total = workouts.length;
    const completed = workouts.filter(w => w.completed).length;
    const totalDistanceKm = workouts.reduce((acc, w) => acc + (w.distanceKm || 0), 0);
    return { total, completed, totalDistanceKm };
  }, [workouts]);

  const progress = total > 0 ? completed / total : 0;

  return (
    <Card
      mode='contained'
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: theme.colors.surfaceVariant, borderWidth: 1, borderColor: theme.colors.outlineVariant }
      ]}
    >
      <Card.Content style={styles.header}>
        <View style={styles.headerLeft}>
          <Text variant="titleMedium" style={styles.cardTitle}>
            {formatDate(week.startDate)} – {formatDate(week.endDate)}
          </Text>
          <Text variant="labelLarge" style={styles.subtle}>
            Week {week.number}
          </Text>
        </View>
      </Card.Content>

      <Card.Content style={styles.progressSection}>
        <View style={styles.progressRow}>
          <Text variant="labelMedium">
            {completed}/{total} complete
          </Text>
        </View>
        <ProgressBar
          progress={progress}
          style={styles.progressBar}
          color={theme.colors.primary}
        />
        <View style={styles.totalsRow}>
          <Text variant="bodySmall">Workouts: {total}</Text>
          <Text variant="bodySmall">Distance: {totalDistanceKm.toFixed(1)} km</Text>
        </View>
      </Card.Content>

      <Divider style={styles.divider} />

      <Card.Content style={styles.listSection}>
        <View style={styles.listContainer}>
          {workouts.map((w) => {
            const { icon, color } = getWorkoutTypeProps(w.type);
            const rightText = [formatDay(w.date), km(w.distanceKm)]
              .filter(Boolean)
              .join(' – ');
            return (
              <List.Item
                key={w.id}
                title={rightText}
                left={(props) => <List.Icon {...props} icon={icon} color={color} />}
                style={styles.listItem}
                titleStyle={styles.listItemTitle}
              />
            );
          })}
          {workouts.length === 0 && (
            <Text variant="bodyLarge">No workouts planned this week.</Text>
          )}
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
    paddingTop: 8,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    borderRadius: 6,
  },
  divider: {
    opacity: 0.6,
  },
  listSection: {
    paddingTop: 8,
    paddingBottom: 12,
  },
  listContainer: {
    gap: 4,
    marginTop: 4,
  },
  listItem: {
    paddingHorizontal: 0,
    paddingVertical: 2,
    borderRadius: 8,
  },
  listItemTitle: {
    // keep titles compact and readable
  },
});

export default WeekCard;
