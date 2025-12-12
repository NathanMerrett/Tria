// theme/light.ts
import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const lightTheme = {
  ...DefaultTheme,
  roundness: 12,
  colors: {
    ...DefaultTheme.colors,

    // Brand
    primary: '#C50085',      // Darkened so white text is ≥ 4.5:1
    secondary: '#00B3A4',
    tertiary: '#2ECC71',

    // Base
    background: '#F8F9FB',
    surface: '#FFFFFF',
    surfaceVariant: '#EEF1F5',
    outline: '#D5D9E1',

    // Text
    onSurface: '#1C1C1E',
    onSurfaceVariant: '#666A73', // Darker for accessible body text on surfaceVariant
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onTertiary: '#000000',

    // Status
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FFD60A', // For fills, use dark text on top

    discipline: {
      swim: '#00639B',     // Deep Accessible Blue
      bike: '#C05400',     // Burnt Orange (Standard orange is too hard to read on white)
      run: '#006D31',      // Forest Green
      strength: '#6F43C0', // Deep Violet
      other: '#5E6066',    // Slate Grey
    },
  },
};