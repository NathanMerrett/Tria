import type { ComponentProps } from 'react';
import { Button, useTheme } from 'react-native-paper';

import { Fonts } from '@/shared/constants/theme';

type PaperButtonProps = ComponentProps<typeof Button>;

interface AppButtonProps extends Omit<PaperButtonProps, 'mode'> {
  /**
   * primary  — contained, orange fill, semi-bold uppercase label (default)
   * outlined — bordered, transparent fill, regular uppercase label
   */
  variant?: 'primary' | 'outlined';
}

export function AppButton({
  variant = 'primary',
  style,
  contentStyle,
  labelStyle,
  ...props
}: AppButtonProps) {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';

  return (
    <Button
      mode={isPrimary ? 'contained' : 'outlined'}
      style={[
        { borderRadius: 8 },
        !isPrimary && { borderColor: colors.outlineVariant },
        style,
      ]}
      contentStyle={[
        { height: isPrimary ? 52 : 48 },
        !isPrimary && { paddingHorizontal: 4 },
        contentStyle,
      ]}
      labelStyle={[
        {
          fontFamily: isPrimary ? Fonts.labelSemiBold : Fonts.label,
          textTransform: 'uppercase',
          letterSpacing: isPrimary ? 2 : 0.5,
          fontSize: isPrimary ? 14 : 13,
        },
        !isPrimary && { color: colors.onSurface },
        labelStyle,
      ]}
      {...props}
    />
  );
}
