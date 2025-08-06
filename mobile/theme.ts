import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#014981ff', // A strong purple for primary actions
    secondary: '#03dac4', // A teal for accents
    background: '#f5f5f5', // A light grey background for the screen
    surface: '#ffffff', // White for component surfaces like inputs
  },
};