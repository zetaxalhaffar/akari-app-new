import React from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, Text, Image } from 'react-native';
import icons from '@/constants/icons';

const TAB_FONT_SIZE = 10; // Change this value to adjust all tab fonts at once

export default function TabLayout() {
  return (
    <>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} backgroundColor="#a47764" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#a47764',
          tabBarInactiveTintColor: '#71717a',
          tabBarStyle: {
            backgroundColor: '#eae2db',
            borderTopWidth: 0,
            height: 60,
            borderRadius: 16,
            position: 'sticky',
            elevation: 10,
            bottom: 15,
            left: 15, // Adjusts the tab bar to fit properly
            right: 15,
            marginHorizontal: 15, // Removed to prevent shrinking
            justifyContent: 'center',
            alignItems: 'center',
            shadowRadius: 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
          },
        }}>
        <Tabs.Screen
          key="index"
          name="index"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 80,
                  paddingTop: 20,
                }}>
                <Image
                  source={focused ? icons.home_screen_active : icons.home_screen_unactive}
                  className="h-6 w-6"
                  tintColor={color}
                />
                <Text className="font-psemibold" style={{ color, fontSize: TAB_FONT_SIZE, marginTop: 2 }} allowFontScaling={false}>
                  الرئيسية
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          key="myorders"
          name="myorders"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 80,
                  paddingTop: 20,
                }}>
                <Image
                  source={focused ? icons.my_posts_active : icons.my_posts_unactive}
                  className="h-6 w-6"
                  tintColor={color}
                />
                <Text className="font-psemibold" style={{ color, fontSize: TAB_FONT_SIZE, marginTop: 2 }} allowFontScaling={false}>
                  المواعيد
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          key="myposts"
          name="myposts"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 80,
                  paddingTop: 20,
                }}>
                <Image
                  source={focused ? icons.order_screen_active : icons.order_screen_unactive}
                  className="h-6 w-6"
                  tintColor={color}
                />
                <Text className="font-psemibold" style={{ color, fontSize: TAB_FONT_SIZE, marginTop: 2 }} allowFontScaling={false}>
                  إعلاناتي
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="sectors"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 80,
                  paddingTop: 20,
                }}>
                <Image
                  source={focused ? icons.sector_screen_active : icons.sector_screen_unactive}
                  className="h-6 w-6"
                  tintColor={color}
                />
                <Text className="font-psemibold" style={{ color, fontSize: TAB_FONT_SIZE, marginTop: 2 }} allowFontScaling={false}>
                  المقاسم
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          key="more"
          name="more"
          options={{
            title: 'المزيد',
            tabBarIcon: ({ color, focused }) => (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 80,
                  paddingTop: 20,
                }}>
                <Image
                  source={focused ? icons.menu_screen_active : icons.menu_screen_unactive}
                  className="h-6 w-6"
                  tintColor={color}
                />
                <Text className="font-psemibold" style={{ color, fontSize: TAB_FONT_SIZE, marginTop: 2 }} allowFontScaling={false}>
                  المزيد
                </Text>
              </View>
            ),
          }}
        />
      </Tabs>
    </>
  );
}
