import { View, StyleSheet } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';

interface AuthDividerProps {
  label: string;
}

export function AuthDivider({ label }: AuthDividerProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <Divider style={styles.line} />
      <Text variant="labelSmall" style={[styles.label, { color: colors.onSurfaceVariant }]}>
        {label}
      </Text>
      <Divider style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  line: { flex: 1 },
  label: { letterSpacing: 1 },
});
