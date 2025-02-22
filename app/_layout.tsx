import '../global.css';
import { Redirect, Stack } from 'expo-router';
import { GestureHandlerRootView, TextInput } from 'react-native-gesture-handler';
import { getSecureStore, setSecureStore } from '@/composables/secure.store';
import { useEffect, useRef, useState } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { I18nManager, Image, Text, View } from 'react-native';
import { createNotifications, notify } from 'react-native-notificated';
import { useAuthStore } from '@/store/auth.store';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import NetInfo from '@react-native-community/netinfo';
import CustomBottomModalSheet from '@/components/CustomBottomModalSheet';
import images from '~/constants/images';
import * as SecureStore from 'expo-secure-store';

/* ======================= handle notifications ======================= */
import messaging from '@react-native-firebase/messaging';
import { useNotificationsStore } from '@/store/notifications.store';

/* ======================= handle notifications ======================= */

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

  const { setNotificationCount } = useNotificationsStore();

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
        await SecureStore.setItemAsync('user', JSON.stringify(response));
      }
    };
    initialize();
  }, []);

  // ======================= handle notifications =======================

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  useEffect(() => {
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then((token) => {
          console.log(token);
        });
    } else {
      console.log('no permission', authStatus);
    }

    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification
          );
        }
      });
    // "Assume  a message-notification contains a 'data' property with"

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      const data = remoteMessage.data;

      if (data?.notification_type === 'share') {
        // router.push(`/show/share/${data?.content}?type=share`);
        console.log('no notification type ========================= 1======================');
      } else if (data?.notification_type === 'apartment') {
        console.log('no notification type ========================= 2======================');
        // router.push(`/show/apartment/${data?.content}?type=apartment`);
      } else if (data?.notification_type === 'url') {
        console.log('no notification type ========================= 3======================');
        // await Linking.openURL(data?.content);
      } else {
        console.log('no notification type ========================= 4======================');
        // router.push('/notifications');
      }
    });

    // Register background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
      const { data } = remoteMessage;
      if (data?.notification_type === 'share') {
        // router.push(`/show/share/${data?.content}?type=share`);
        console.log('no notification type ========================= 5======================');
      } else if (data?.notification_type === 'apartment') {
        // router.push(`/show/apartment/${data?.content}?type=apartment`);
        console.log('no notification type ========================= 6======================');
      } else if (data?.notification_type === 'url') {
        console.log('no notification type ========================= 7======================');
        // await Linking.openURL(data?.content);
      } else {
        console.log('no notification type ========================= 8======================');
        // router.push('/notifications');
      }
    });

    const unscubscribe = messaging().onMessage(async (remoteMessage) => {
      const data = remoteMessage.data;
      console.log('onMessage ========================= 1======================', data);
      notify('success', {
        params: {
          title: data?.title ?? 'لديك إشعار جديد',
        },
      });
      setNotificationCount(1);
      // SecureStore.setItem('new_notification', 'true');
      // Toast.show({
      //   type: 'success',
      //   text1: 'لديك إشعار جديد',
      // });
    });

    return unscubscribe;
  }, []);

  // ======================= handle notifications =======================
  const bottomSheetModalRef = useRef<any>(null);
  const [isConnected, setConnected] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      setConnected(state.isConnected);
      if (!state.isConnected) {
        bottomSheetModalRef.current.present();
      } else {
        bottomSheetModalRef.current.dismiss();
      }
    });

    return () => unsubscribe();
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
            <CustomBottomModalSheet
              bottomSheetModalRef={bottomSheetModalRef}
              handleSheetChanges={() => {}}
              handleDismissModalPress={() => {}}>
              <View className="h-full items-center justify-center">
                <Image
                  className="h-[200px] w-[200px]"
                  resizeMode="contain"
                  source={images.connection_lost}
                />

                <Text className="mt-4 font-psemibold text-xl">
                  حدث خطأ ما أثناء الاتصال بالانترنت
                </Text>
                <Text className="text-md mt-4 font-psemibold text-zinc-400">
                  يرجى التحقق من اتصالك بالانترنت
                </Text>
              </View>
            </CustomBottomModalSheet>

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
              <Stack.Screen name="search" options={{ headerShown: false }} />
              <Stack.Screen name="posts" options={{ headerShown: false }} />
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
              <Stack.Screen name="(more_screens)/privacy" options={{ headerShown: false }} />
              <Stack.Screen name="(more_screens)/terms" options={{ headerShown: false }} />
              <Stack.Screen name="(admin)/users_list" options={{ headerShown: false }} />
              <Stack.Screen name="(admin)/bulk_messages" options={{ headerShown: false }} />
            </Stack>
          </BottomSheetModalProvider>
        </NotificationsProvider>
      </GestureHandlerRootView>
    </>
  );
}
