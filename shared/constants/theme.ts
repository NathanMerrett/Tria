import { Platform } from 'react-native';
import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';

// Lexend for display/headings, Inter for body — applied across all MD3 typescale tokens
const lexendSemiBold = { fontFamily: 'Lexend_600SemiBold' };
const titleFont = { fontFamily: 'Lexend_500Medium' };
const bodyFont = { fontFamily: 'Inter_400Regular' };
const labelFont = { fontFamily: 'Inter_500Medium' };

const fontConfig = {
  displayLarge: lexendSemiBold,
  displayMedium: lexendSemiBold,
  displaySmall: lexendSemiBold,
  headlineLarge: lexendSemiBold,
  headlineMedium: lexendSemiBold,
  headlineSmall: lexendSemiBold,
  titleLarge: titleFont,
  titleMedium: titleFont,
  titleSmall: titleFont,
  bodyLarge: bodyFont,
  bodyMedium: bodyFont,
  bodySmall: bodyFont,
  labelLarge: labelFont,
  labelMedium: labelFont,
  labelSmall: labelFont,
};

const fonts = configureFonts({ config: fontConfig });

export const AppLightTheme = {
  ...MD3LightTheme,
  fonts,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF5722',
    primaryContainer: '#FFCCBC',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#7C1800',
    secondary: '#C45252',
    secondaryContainer: '#F9DEDC',
    onSecondary: '#FFFFFF',
    tertiary: '#A15AB8',
    tertiaryContainer: '#EDD9F5',
    onTertiary: '#FFFFFF',
    background: '#ECEEF1',
    onBackground: '#111416',
    surface: '#FFFFFF',
    onSurface: '#111416',
    onSurfaceVariant: '#49454F',
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: '#F5F5F5',
    surfaceContainer: '#ECEEF1',
    surfaceContainerHigh: '#E4E6E9',
    surfaceContainerHighest: '#DCDFE3',
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
    error: '#B3261E',
  },
};

export const AppDarkTheme = {
  ...MD3DarkTheme,
  fonts,
  colors: {
    ...MD3DarkTheme.colors,

    // Brand
    primary: '#ff8f6f',             // Action Orange
    primaryContainer: '#7a3018',    // Gradient end (primary → primaryContainer)
    onPrimary: '#1a0500',
    onPrimaryContainer: '#ffd8cc',

    // Sport segments (swim / bike / run)
    secondary: '#7dd4fc',           // Swim — cool blue
    tertiary: '#4ADE80',            // Run — green; also transition timer

    // Surfaces — stacked glass layers (base → elevated)
    background: '#0c0e10',
    surface: '#0c0e10',             // Base
    surfaceContainerLowest: '#080a0c', // Segmented control track
    surfaceContainerLow: '#111315', // Sections
    surfaceContainer: '#161819',
    surfaceContainerHigh: '#1c1e21', // Interactive elements
    surfaceContainerHighest: '#222528', // Inputs, most elevated

    // Text — never pure white
    onBackground: '#eeeef0',
    onSurface: '#eeeef0',
    onSurfaceVariant: '#a8aab0',    // Labels, secondary text

    // Ghost border — used at 15% opacity, feels like a glint not a divider
    outlineVariant: '#2e3136',

    error: '#F87171',
  },
};

export const Fonts = {
  display: 'Lexend_700Bold',
  heading: 'Lexend_600SemiBold',
  title: 'Lexend_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  label: 'Inter_500Medium',
  labelSemiBold: 'Inter_600SemiBold',
  mono: Platform.select({
    ios: 'ui-monospace',
    default: 'monospace',
    web: "SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace",
  }),
};
