import React from 'react';
import { View } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useUser } from '@/src/context/UserContext';
import { useTheme, Appbar } from 'react-native-paper';
import { HeaderAvatar } from '@/src/features/athlete/components/HeaderAvatar';
import { getHeaderTitle } from '@react-navigation/elements';

// 1. Custom Header Component
const TabsHeader = ({ options, route }: { options: any; route: any }) => {
  const theme = useTheme();

  // This helper prioritizes 'headerTitle' over 'title'
  const title = getHeaderTitle(options, route.name);

  return (
    <Appbar.Header
      style={{ backgroundColor: theme.colors.background, elevation: 0 }}
    >
      {/* MOVED TO LEFT: 
         We place the Avatar View before the Content. 
         Changed paddingRight to paddingLeft/Right for balance.
      */}
      <View style={{ paddingHorizontal: 16 }}>
        <HeaderAvatar />
      </View>

      {/* Title will now appear to the right of the avatar */}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
};

export default function TabsLayout() {
  const { session } = useUser();
  const theme = useTheme();

  if (!session) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        header: (props) => <TabsHeader {...props} />,
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
        },
      }}>

      <Tabs.Screen
        name="index"
        options={{
          // SEPARATE THEM HERE:
          headerTitle: 'Schedule', // The text at the top
          tabBarLabel: 'Today',      // The text at the bottom
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="sun" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          headerTitle: 'Your Schedule', // The text at the top
          tabBarLabel: 'Plan',          // The text at the bottom
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="calendar" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="data"
        options={{
          headerTitle: 'Analytics', // The text at the top
          tabBarLabel: 'Data',      // The text at the bottom
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="chart-line" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}