import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, Text, Image } from 'react-native';
import icons from '@/constants/icons';

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
            shadowRadius: 10,
            shadowColor: '#eae2db',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
          },
        }}>
        <Tabs.Screen
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
                <Text className="font-psemibold" style={{ color, fontSize: 10, marginTop: 2 }}>
                  الرئيسية
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
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
                <Text className="font-psemibold" style={{ color, fontSize: 10, marginTop: 2 }}>
                  المواعيد
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
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
                <Text className="font-psemibold" style={{ color, fontSize: 10, marginTop: 2 }}>
                  طلباتي
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
                <Text className="font-psemibold" style={{ color, fontSize: 10, marginTop: 2 }}>
                  المقاسم
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
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
                <Text className="font-psemibold" style={{ color, fontSize: 10, marginTop: 2 }}>
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
