import React from 'react';
import { View } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useUser } from '@/src/context/UserContext';
import { useTheme, Appbar } from 'react-native-paper';
import { HeaderAvatar } from '@/src/features/athlete/components/HeaderAvatar';
import { getHeaderTitle } from '@react-navigation/elements'; // Helper to get the active tab title

// 1. Create the Custom Header Component
const TabsHeader = ({ options, route }: { options: any; route: any }) => {
  const theme = useTheme();
  const title = getHeaderTitle(options, route.name);

  return (
    <Appbar.Header
      // Match the style of your ProfileStackHeader
      style={{ backgroundColor: theme.colors.background, elevation: 0 }}
    >
      {/* Since this is the main Tab view, we usually don't need a BackAction. 
         We render the Title and the Avatar.
      */}
      <Appbar.Content title={title} />

      {/* Container for the Avatar to ensure consistent spacing */}
      <View style={{ paddingRight: 16 }}>
        <HeaderAvatar />
      </View>
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
        // 2. REPLACEMENT: Use 'header' instead of 'headerRight'
        header: (props) => <TabsHeader {...props} />,

        // Tab Bar Styling
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
          title: 'Today', // This string is passed to props.options in TabsHeader
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="sun" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: 'Plan',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="calendar" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: 'Support',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="question" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}