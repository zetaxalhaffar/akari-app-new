import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { router, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { BackHandler, I18nManager, Image, TouchableOpacity, View } from 'react-native';

import CustomAlert from './CustomAlert';
import CustomIcon from './CustomIcon';

import { getSecureStore } from '@/composables/secure.store';
import images from '@/constants/images';
import { useNotificationsStore } from '@/store/notifications.store';

const HomePageHeader = ({ hasActions = true, customActions = false, children }) => {
  const [showExitAlert, setShowExitAlert] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const token = await getSecureStore('token');
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  const handleLogoPress = () => {
    router.dismissAll();
    router.push('(tabs)');
  };

  const handleBackPress = () => {
    if (pathname === '/') {
      // Show exit app confirmation on home page
      setShowExitAlert(true);
    } else {
      router.back();
    }
  };

  const handleExitConfirm = () => {
    setShowExitAlert(false);
    BackHandler.exitApp();
  };

  const handleExitCancel = () => {
    setShowExitAlert(false);
  };

  const { notificationCount } = useNotificationsStore();
  const pathname = usePathname();

  return (
    <View
      className={` flex-row items-center justify-between px-4 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
      <View className={`flex items-center ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
        <TouchableOpacity
          onPress={handleBackPress}
          className={`-ml-2 -mr-1 flex-row items-center ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
          <CustomIcon handleOnIconPress={handleBackPress} containerStyles="border-[0] p-1">
            <Entypo name="chevron-right" size={24} color="#a47764" />
          </CustomIcon>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogoPress} className="flex-row items-center">
          <Image source={images.only_word} className="h-24 w-24" resizeMode="contain" />
        </TouchableOpacity>
      </View>
      {hasActions && !customActions && (
        <View className={`items-center gap-2 ${I18nManager.isRTL ? 'ltr-view' : 'rtl-view'}`}>
          {pathname === '/' && (
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/information' })}
              className="flex-row items-center gap-2 rounded-full border border-toast-200 bg-toast-100 p-2">
              <Feather name="help-circle" size={20} color="#a47764" />
            </TouchableOpacity>
          )}
          {isAuthenticated && (
            <>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/notifications',
                  })
                }
                className="relative flex-row items-center rounded-full p-2">
                {notificationCount > 0 && (
                  <View className="tpo-0 absolute left-0 top-0 h-2 w-2 rounded-full bg-red-600" />
                )}
                <Feather name="bell" size={20} color="#a47764" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/search',
                  })
                }
                className="flex-row items-center rounded-full p-2">
                <Feather name="search" size={20} color="#a47764" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/myfavorites',
                  })
                }
                className="flex-row items-center rounded-full p-2">
                <Feather name="star" size={20} color="#a47764" />
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
      {hasActions && customActions && children}

      <CustomAlert
        visible={showExitAlert}
        title="الخروج من التطبيق"
        message="هل أنت متأكد من أنك تريد الخروج؟"
        onConfirm={handleExitConfirm}
        onCancel={handleExitCancel}
      />
    </View>
  );
};

export default HomePageHeader;
