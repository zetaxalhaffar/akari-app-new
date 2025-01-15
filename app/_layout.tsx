import '../global.css';
import { Redirect, Stack } from 'expo-router';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { getSecureStore, setSecureStore } from '@/composables/secure.store';
import { useEffect, useRef, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { I18nManager } from 'react-native';
import { createNotifications } from 'react-native-notificated';

const { NotificationsProvider, useNotifications, ...events } = createNotifications({
  isNotch: true,
  defaultStylesSettings: {
    globalConfig: {
      titleFamily: 'Cairo-Bold',
      descriptionFamily: 'Cairo-Bold',
      titleSize: 14,
      descriptionSize: 10,
      borderType: 'accent',
      defaultIconType: 'monochromatic',
    },
    successConfig: {
      accentColor: '#a47764',
    },
  },
});

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(auth)',
};

// Async function to load fonts
const useCustomFonts = async () => {
  const [loaded] = useFonts({
    'Cairo-Black': require('@/assets/fonts/Cairo-Black.ttf'),
    'Cairo-ExtraBold': require('@/assets/fonts/Cairo-ExtraBold.ttf'),
    'Cairo-ExtraLight': require('@/assets/fonts/Cairo-ExtraLight.ttf'),
    'Cairo-Light': require('@/assets/fonts/Cairo-Light.ttf'),
    'Cairo-Medium': require('@/assets/fonts/Cairo-Medium.ttf'),
    'Cairo-Regular': require('@/assets/fonts/Cairo-Regular.ttf'),
    'Cairo-SemiBold': require('@/assets/fonts/Cairo-SemiBold.ttf'),
    'Cairo-Bold': require('@/assets/fonts/Cairo-Bold.ttf'),
  });

  return loaded;
};

export default function RootLayout() {
  const fontsLoaded = useCustomFonts();
  const hasToken = useRef(false);

  useEffect(() => {
    const initialize = async () => {
      SplashScreen.hideAsync();
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
      const token = await getSecureStore('token');
      if (token) {
        hasToken.current = true;
      }
    };
    initialize();
  }, []);
  if (!fontsLoaded) {
    // Render a splash/loading screen while the state is being resolved
    return <Redirect href="/(auth)" />;
  }
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NotificationsProvider>
          <Stack initialRouteName={hasToken.current ? '(tabs)' : '(auth)'}>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ title: 'Modal', presentation: 'modal' }} />
            <Stack.Screen name="notifications" options={{ headerShown: false }} />
          </Stack>
        </NotificationsProvider>
      </GestureHandlerRootView>
    </>
  );
}
