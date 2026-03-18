import { Platform } from 'react-native';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const AppLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1A6B8A',
    secondary: '#F97316',
    tertiary: '#16A34A',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    error: '#DC2626',
  },
};

export const AppDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#38BDF8',
    secondary: '#FB923C',
    tertiary: '#4ADE80',
    background: '#0F172A',
    surface: '#1E293B',
    error: '#F87171',
  },
};

// Legacy Colors export for compatibility with existing components
export const Colors = {
  light: {
    text: '#11181C',
    background: AppLightTheme.colors.background,
    tint: AppLightTheme.colors.primary,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: AppLightTheme.colors.primary,
  },
  dark: {
    text: '#ECEDEE',
    background: AppDarkTheme.colors.background,
    tint: AppDarkTheme.colors.primary,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: AppDarkTheme.colors.primary,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
