import { Tabs } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons'; // Using a different icon set for variety

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: 'blue', // Example styling
      // headerShown: true, // You might want a header on each tab
    }}>
      <Tabs.Screen
        name="today"
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