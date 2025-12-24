// theme/dark.ts
import { MD3DarkTheme as DefaultTheme, configureFonts } from 'react-native-paper';

// Define the font family (System ensures it works on iOS/Android out of the box)
const baseFont = { fontFamily: 'System', } as const;
const baseVariants = configureFonts({ config: { ...DefaultTheme.fonts } });

const customFontConfig = {
  ...baseVariants,
  displayLarge: {
    ...baseFont,
    fontSize: 57,
    fontWeight: '300', // Light
    lineHeight: 64,
    letterSpacing: -0.25,
  },
  displayMedium: {
    ...baseFont,
    fontSize: 45,
    fontWeight: '300', // Light
    lineHeight: 52,
    letterSpacing: 0,
  },
  displaySmall: {
    ...baseFont,
    fontSize: 36,
    fontWeight: '400', // Regular
    lineHeight: 44,
    letterSpacing: 0,
  },

  headlineLarge: {
    ...baseFont,
    fontSize: 32,
    fontWeight: '400', // Regular (Minimalism avoids heavy bolding)
    lineHeight: 40,
    letterSpacing: 0,
  },
  headlineMedium: {
    ...baseFont,
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 36,
    letterSpacing: 0,
  },
  headlineSmall: {
    ...baseFont,
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 32,
    letterSpacing: 0,
  },

  titleLarge: {
    ...baseFont,
    fontSize: 22,
    fontWeight: '500', // Medium
    lineHeight: 28,
    letterSpacing: 0,
  },
  titleMedium: {
    ...baseFont,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  titleSmall: {
    ...baseFont,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0.1,
  },

  labelLarge: {
    ...baseFont,
    fontSize: 14,
    fontWeight: '600', // Semi-bold
    lineHeight: 20,
    letterSpacing: 1.5, // Wide spacing
  },
  labelMedium: {
    ...baseFont,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    letterSpacing: 1.5, // Wide spacing
  },
  labelSmall: {
    ...baseFont,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 16,
    letterSpacing: 1.5, // Wide spacing
  },

  bodyLarge: {
    ...baseFont,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    ...baseFont,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bodySmall: {
    ...baseFont,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.4,
  },
} as const;

export const darkTheme = {
  ...DefaultTheme,
  roundness: 12,
  fonts: configureFonts({ config: customFontConfig }), // Apply the hierarchy
  colors: {
    ...DefaultTheme.colors,
    primary: '#ff80dfff',     // CTAs / highlights - Adjusted for better contrast on dark backgrounds
    secondary: '#00e6d3ff',   // Secondary actions / progress - Adjusted for better contrast
    tertiary: '#4cd964ff',    // Success / completion - Brightened for accessibility
    background: '#1A1A1A',
    surface: '#232323',
    surfaceVariant: '#2C2C2E',
    outline: '#4A4A4E',
    onSurface: '#ffffffff',   // Primary text - High contrast against dark surfaces
    onSurfaceVariant: '#A0A0A0', // Secondary text - Sufficient contrast for less prominent text
    error: '#FF453A',
    success: '#32D74B',
    warning: '#FFD60A',
  },
};