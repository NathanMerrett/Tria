// components/WizardHeader.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, ProgressBar, useTheme, Text, MD3Colors } from 'react-native-paper';
import { useRouter } from 'expo-router';

type Props = {
  step: number;
  totalSteps: number;
  onCloseRoute?: string; // default to '/(tabs)'
};

export default function WizardHeader({ step, totalSteps, onCloseRoute = '/(tabs)' }: Props) {
  const router = useRouter();
  const progress = Math.max(0, Math.min(1, step / totalSteps));
  const theme = useTheme();


  return (
    <Appbar.Header mode="center-aligned" style={{ backgroundColor: theme.colors.background }}>
      <Appbar.BackAction onPress={() => router.back()} />
      <View style={styles.center}>
        {/* <ProgressBar progress={0.5} style={styles.progress} /> */}
        <ProgressBar progress={progress} theme={{ colors: { primary: 'green' } }} />
      </View>
      <Appbar.Action icon="close" onPress={() => router.replace(onCloseRoute)} />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  progress: { width: '60%', height: 8, borderRadius: 8 },
});
