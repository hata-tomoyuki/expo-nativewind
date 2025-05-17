import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: '#3b82f6',
      headerShown: false,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'リスト',
          tabBarIcon: ({ color }) => <FontAwesome name="list" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: '作成',
          tabBarIcon: ({ color }) => <FontAwesome name="plus" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
