// components/WizardHeader.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, ProgressBar, useTheme, MD3Colors } from 'react-native-paper';
import { useRouter } from 'expo-router';

type Props = {
  step: number;
};

export default function WizardHeader({ step }: Props) {
  const router = useRouter();
  const theme = useTheme();

  // Guard + clamp
  const totalSteps = 13
  // const safeTotal = Math.max(1, totalSteps || 1);
  const progress = Math.max(0, Math.min(1, step / totalSteps));

  return (
    <Appbar.Header mode="center-aligned" style={{ backgroundColor: theme.colors.background }}>
      <Appbar.BackAction onPress={() => router.back()} />
      <View style={styles.center}>
        <ProgressBar
          progress={progress}
          color={theme.colors.secondary}
          style={styles.progress}
        />
      </View>
      <Appbar.Action icon="close" onPress={() => router.push('/(tabs)')} />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', paddingHorizontal: 16 },
  progress: { width: '100%', height: 8, borderRadius: 8 },
});
