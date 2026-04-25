import type { ReactNode, ComponentProps } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, HelperText, useTheme } from 'react-native-paper';

type TextInputProps = ComponentProps<typeof TextInput>;

interface FormFieldProps extends TextInputProps {
  label: string;
  rightLabel?: ReactNode;
  errorMessage?: string;
}

export function FormField({ label, rightLabel, errorMessage, style, outlineStyle, ...props }: FormFieldProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.group}>
      <View style={styles.labelRow}>
        <Text variant="labelSmall" style={[styles.label, { color: colors.onSurfaceVariant }]}>
          {label}
        </Text>
        {rightLabel}
      </View>
      <TextInput
        mode="outlined"
        error={!!errorMessage}
        style={[styles.input, style]}
        outlineStyle={[styles.outline, outlineStyle]}
        {...props}
      />
      {errorMessage && (
        <HelperText type="error" visible padding="none">
          {errorMessage}
        </HelperText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: 'transparent',
  },
  outline: {
    borderRadius: 8,
  },
});
