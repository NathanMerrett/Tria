import { Tabs } from 'expo-router';
import React from 'react';
import { Text, useColorScheme } from 'react-native';

import { HapticTab } from '@/shared/components/haptic-tab';
import { Colors } from '@/shared/constants/theme';

const ICONS: Record<string, string> = {
  index: '📅',
  plan: '📋',
  settings: '⚙️',
};

function TabIcon({ name, color }: { name: string; color: string }) {
  return (
    <Text style={{ fontSize: 20, color, lineHeight: 24 }}>{ICONS[name] ?? '•'}</Text>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color }) => <TabIcon name="index" color={color} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: 'Plan',
          tabBarIcon: ({ color }) => <TabIcon name="plan" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabIcon name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}
