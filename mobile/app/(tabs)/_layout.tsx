import { Tabs, Redirect } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useUser } from '@/context/UserContext';
import { useTheme } from 'react-native-paper'; // Import useTheme

export default function TabsLayout() {
  const { session } = useUser();
  const theme = useTheme(); // Hook to get theme colors

  // Not logged in? Protect tabs.
  if (!session) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.secondary, // Color for the active icon and label
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant, // Color for inactive icons and labels
        tabBarStyle: {
          backgroundColor: theme.colors.surface, // Use surface color for the tab bar background
          // borderTopColor: theme.colors.outline, // Use outline color for the top border
          // borderTopWidth: 1, // Add a 1-pixel border to the top
          // elevation: 3, // Adds a shadow for Android (optional)
          // shadowOpacity: 0.1, // Adds a shadow for iOS (optional)
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="star" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: 'Plan',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="calendar-alt" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="users" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: 'Support',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="question-circle" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}