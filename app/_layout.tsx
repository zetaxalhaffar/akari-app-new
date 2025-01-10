import '../global.css';
import { Redirect, Stack } from 'expo-router';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { getSecureStore, setSecureStore } from '@/composables/secure.store';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import CustomSplashScreen from '@/screens/SplashScreen';
import * as SplashScreen from 'expo-splash-screen';
import { I18nManager } from 'react-native';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(onboarding)/index',
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
  const [isOnboarding, setIsOnboarding] = useState(null); // null to prevent flashing during state resolution
  const fontsLoaded = useCustomFonts();

  const checkOnboarding = async () => {
    const isOnboarding = await getSecureStore('isOnboarding');
    setIsOnboarding(!isOnboarding); // Set true if onboarding hasn't been completed
  };

  useEffect(() => {
    const initialize = async () => {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
      Text.defaultProps = Text.defaultProps || {};
      Text.defaultProps.allowFontScaling = false;
      TextInput.defaultProps = TextInput.defaultProps || {};
      TextInput.defaultProps.allowFontScaling = false;
      SplashScreen.hideAsync();
      await checkOnboarding();
    };
    initialize();
  }, []);
  if (!isOnboarding && !fontsLoaded) {
    // Render a splash/loading screen while the state is being resolved
    return <Redirect href="/(auth)" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack initialRouteName={isOnboarding ? '(drawer)' : '(onboarding)/index'}>
        <Stack.Screen name="(onboarding)/index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ title: 'Modal', presentation: 'modal' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
