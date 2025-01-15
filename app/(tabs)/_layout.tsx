import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';

import { TabBarIcon } from '~/components/TabBarIcon';

export default function TabLayout() {
  return (
    <>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} backgroundColor="#a47764" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#a47764',
          tabBarInactiveTintColor: '#774b46',
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'الرئيسية',
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            title: 'المنتجات',
            tabBarIcon: ({ color }) => <TabBarIcon name="bell" color={color} />,
          }}
        />
        <Tabs.Screen
          name="more"
          options={{
            title: 'المزيد',
            tabBarIcon: ({ color }) => <TabBarIcon name="menu" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
