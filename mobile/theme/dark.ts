// theme/dark.ts
import { MD3DarkTheme as DefaultTheme } from 'react-native-paper';

export const darkTheme = {
  ...DefaultTheme,
  roundness: 12,
  colors: {
    ...DefaultTheme.colors,

    // Brand
    primary: '#ff80dfff',     // CTAs / highlights - Adjusted for better contrast on dark backgrounds
    secondary: '#00e6d3ff',   // Secondary actions / progress - Adjusted for better contrast
    tertiary: '#4cd964ff',    // Success / completion - Brightened for accessibility

    // Base
    background: '#1A1A1A',
    surface: '#232323',
    surfaceVariant: '#2C2C2E',
    outline: '#4A4A4E',

    // Text
    onSurface: '#ffffffff',   // Primary text - High contrast against dark surfaces
    onSurfaceVariant: '#A0A0A0', // Secondary text - Sufficient contrast for less prominent text

    // Status
    error: '#FF453A',
    success: '#32D74B',
    warning: '#FFD60A',

    discipline: {
      swim: '#3498db',     // Bright Blue
      bike: '#e67e22',     // Bright Orange
      run: '#2ecc71',      // Bright Green
      strength: '#9b59b6', // Bright Purple
      other: '#95a5a6',    // Grey
    },
  },
};