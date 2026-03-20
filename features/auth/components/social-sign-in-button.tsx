import React from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { Button } from 'react-native-paper';

interface Props {
  provider: 'google' | 'strava';
  onPress: () => void;
  loading?: boolean;
}

const PROVIDER_CONFIG = {
  google: {
    label: 'Continue with Google',
    color: '#4285F4',
    textColor: '#FFFFFF',
  },
  strava: {
    label: 'Continue with Strava',
    color: '#FC4C02',
    textColor: '#FFFFFF',
  },
};

export function SocialSignInButton({ provider, onPress, loading }: Props) {
  const config = PROVIDER_CONFIG[provider];

  return (
    <Button
      mode="contained"
      onPress={onPress}
      loading={loading}
      disabled={loading}
      buttonColor={config.color}
      textColor={config.textColor}
      style={styles.button}
      contentStyle={styles.content}
    >
      {config.label}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    marginVertical: 6,
  },
  content: {
    height: 48,
  },
});
