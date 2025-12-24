import React from 'react';
import { View } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useUser } from '@/src/context/UserContext';
import { useTheme, Appbar } from 'react-native-paper';
import { HeaderAvatar } from '@/src/features/athlete/components/HeaderAvatar';
import { getHeaderTitle } from '@react-navigation/elements';

const TabsHeader = ({ options, route }: { options: any; route: any }) => {
  const theme = useTheme();

  const title = getHeaderTitle(options, route.name);

  return (
    <Appbar.Header
      style={{ backgroundColor: theme.colors.background, elevation: 0 }}
    >
      <View style={{ paddingHorizontal: 16 }}>
        <HeaderAvatar />
      </View>
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
          headerTitle: 'Schedule',
          tabBarLabel: 'Today',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="sun" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          headerTitle: 'Your Plan',
          tabBarLabel: 'Plan',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="calendar" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="data"
        options={{
          headerTitle: 'Analytics',
          tabBarLabel: 'Data',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="chart-line" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}