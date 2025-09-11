import { useColorScheme } from 'react-native';
import { lightTheme } from './light';
import { darkTheme } from './dark';

export const useAppTheme = () => {
  const scheme = useColorScheme(); // 'light' | 'dark' | null
  return scheme === 'dark' ? darkTheme : lightTheme;
};