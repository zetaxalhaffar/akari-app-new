import '../global.css';
import { Redirect, Stack } from 'expo-router';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { getSecureStore, setSecureStore } from '@/composables/secure.store';
import { useEffect, useRef, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { I18nManager } from 'react-native';
import { createNotifications } from 'react-native-notificated';
import { useAuthStore } from '@/store/auth.store';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
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
      multiline: 3,
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

  const { getAuthData } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      SplashScreen.hideAsync();
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
      const token = await getSecureStore('token');
      if (token) {
        hasToken.current = true;
        const response = await getAuthData();
        console.log(response, 'response');
        await setSecureStore('user', JSON.stringify(response));
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
          <BottomSheetModalProvider>
            <Stack initialRouteName={hasToken.current ? '(tabs)' : '(auth)'}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen name="modal" options={{ title: 'Modal', presentation: 'modal' }} />
              <Stack.Screen name="notifications" options={{ headerShown: false }} />
              <Stack.Screen name="(regions)/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="(shares)/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="(apartments)/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="(contact)/index" options={{ headerShown: false }} />
              <Stack.Screen name="(create)/shares" options={{ headerShown: false }} />
              <Stack.Screen name="(create)/apartments" options={{ headerShown: false }} />
              <Stack.Screen name="(edit)/share/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="(edit)/apartment/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="(more_screens)/features" options={{ headerShown: false }} />
              <Stack.Screen name="(more_screens)/support" options={{ headerShown: false }} />
              <Stack.Screen name="(more_screens)/profile" options={{ headerShown: false }} />
            </Stack>
          </BottomSheetModalProvider>
        </NotificationsProvider>
      </GestureHandlerRootView>
    </>
  );
}
