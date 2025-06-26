import HomePageHeader from '@/components/HomePageHeader';
import { router } from 'expo-router';
import { I18nManager, Image, ScrollView, Text, TouchableOpacity, View, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@/constants/icons';
import { deleteSecureStore, getSecureStoreNoAsync } from '@/composables/secure.store';
import CustomIcon from '../../components/CustomIcon';
import { Entypo, Feather, FontAwesome } from '@expo/vector-icons';
import LogoutItem from '@/components/LogoutItem';
import { useContext, useRef, useState, useEffect } from 'react';
import CustomBottomModalSheet from '@/components/CustomBottomModalSheet';
import { useAuthStore } from '@/store/auth.store';
import * as Application from 'expo-application';
import { NotificationPermissionContext } from '../_layout';
import Checkbox from 'expo-checkbox';

const NotificationPermissionSwitcher = ({ icon, title }) => {
  const { requestNotificationPermission, disableNotificationPermission, hasPermission } =
    useContext(NotificationPermissionContext);

  const handleToggle = async (value) => {
    if (value) {
      await requestNotificationPermission();
    } else {
      await disableNotificationPermission();
    }
  };
  return (
    <TouchableOpacity
      onPress={() => handleToggle(!hasPermission)}
      className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mx-4 my-2 items-center justify-between gap-4 rounded-lg bg-toast-100 p-4`}>
      <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} items-center gap-4`}>
        <View className="flex h-12 w-12 items-center justify-center rounded-full ">
          <Image source={icon} className="h-6 w-6" resizeMode="contain" tintColor="#a47764" />
        </View>
        <View>
          <Text className="font-psemibold text-lg text-toast-700">{title}</Text>
        </View>
      </View>
      <View>
        <CustomIcon containerStyles="border-[0]">
          <Checkbox
            value={hasPermission}
            onValueChange={handleToggle}
            color={hasPermission ? '#a47764' : '#B71C1C'}
          />
        </CustomIcon>
      </View>
    </TouchableOpacity>
  );
};

const MoreSettingsItem = ({ icon, title, handleItemPress }) => {
  return (
    <TouchableOpacity
      onPress={handleItemPress}
      className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mx-4 my-2 items-center justify-between gap-4 rounded-lg bg-toast-100 p-4`}>
      <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} items-center gap-4`}>
        <View className="flex h-12 w-12 items-center justify-center rounded-full ">
          <Image source={icon} className="h-6 w-6" resizeMode="contain" tintColor="#a47764" />
        </View>
        <View>
          <Text className="font-psemibold text-lg text-toast-700">{title}</Text>
        </View>
      </View>
      <View pointerEvents="none">
        <CustomIcon containerStyles="border-[0]">
          <Entypo name="chevron-left" size={24} color="#71717a" />
        </CustomIcon>
      </View>
    </TouchableOpacity>
  );
};

const MoreSettingsItemWithVectorIcon = ({ iconName, IconComponent, title, handleItemPress }) => {
  return (
    <TouchableOpacity
      onPress={handleItemPress}
      className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mx-4 my-2 items-center justify-between gap-4 rounded-lg bg-toast-100 p-4`}>
      <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} items-center gap-4`}>
        <View className="flex h-12 w-12 items-center justify-center rounded-full ">
          <IconComponent name={iconName} size={24} color="#a47764" />
        </View>
        <View>
          <Text className="font-psemibold text-lg text-toast-700">{title}</Text>
        </View>
      </View>
      <View pointerEvents="none">
        <CustomIcon containerStyles="border-[0]">
          <Entypo name="chevron-left" size={24} color="#71717a" />
        </CustomIcon>
      </View>
    </TouchableOpacity>
  );
};

const LogoutInnerItem = ({ icon, title, handleItemPress }) => {
  return (
    <TouchableOpacity
      onPress={handleItemPress}
      className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mx-4 mb-10 mt-2 items-center justify-between gap-4 rounded-lg bg-red-800 p-4`}>
      <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} items-center gap-4`}>
        <View className="flex h-12 w-12 items-center justify-center rounded-full ">
          <Image source={icon} className="h-6 w-6" resizeMode="contain" tintColor="#ffffff" />
        </View>
        <View>
          <Text className="font-psemibold text-lg text-white">{title}</Text>
        </View>
      </View>
      <View pointerEvents="none">
        <CustomIcon containerStyles="border-[0]">
          <Entypo name="chevron-left" size={24} color="#ffffff" />
        </CustomIcon>
      </View>
    </TouchableOpacity>
  );
};

const MoreScreen = () => {
  const bottomSheetModalRef = useRef(null);
  const { getAuthData } = useAuthStore();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const handleOpenURL = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    } catch (error) {
      console.error('Error opening URL:', error);
    }
  };
  
  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      console.log('==================== MORE SCREEN INIT ====================');
      
      // Check what's in secure store
      const userData = getSecureStoreNoAsync('user');
      console.log('Secure store user data:', userData);
      console.log('Secure store user keys:', Object.keys(userData || {}));
      console.log('Secure store user name:', userData?.name);
      
      // Check API response
      const response = await getAuthData();
      console.log('API response:', response);
      console.log('API response keys:', Object.keys(response || {}));
      console.log('API response name:', response?.name);
      
      setUser(response);
      setLoading(false);
      console.log('=======================================================');
    };
    initialize();
  }, []);
  const handleLogout = async () => {
    await deleteSecureStore('user');
    await deleteSecureStore('token');
    router.push('/(auth)');
    bottomSheetModalRef.current.dismiss();
  };
  return (
    <>
      <SafeAreaView className="flex-1 ">
        <HomePageHeader hasActions={false} />
        <TouchableOpacity
          onPress={() => router.push('/(more_screens)/profile')}
          className={`px-4 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mx-4 items-center justify-between gap-4`}>
          <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} items-center gap-4`}>
            <View className="flex h-12 w-12 items-center justify-center rounded-full bg-toast-100">
              <Image
                source={icons.user}
                className="h-6 w-6"
                resizeMode="contain"
                tintColor={'#a47764'}
              />
            </View>
                          <View>
                <View className="w-full items-end min-w-[100px]">
                  {loading ? (
                    <View className="h-1 w-full bg-toast-300 rounded-full animate-pulse"></View>
                  ) : (
                    <Text className={`font-psemibold text-lg ${I18nManager.isRTL ? 'text-right' : 'text-left'}`}>{user?.name}</Text>
                  )}
                </View>
                                 {!loading && user?.phone && (
                   <Text className={`font-psemibold text-sm text-zinc-400 ${I18nManager.isRTL ? 'text-right' : 'text-left'}`}>+{user?.phone}</Text>
                 )}
              </View>
          </View>
          <View pointerEvents="none">
            <CustomIcon containerStyles="border-[0]">
              <Entypo name="chevron-left" size={24} color="#71717a" />
            </CustomIcon>
          </View>
        </TouchableOpacity>
        <View className="my-6" style={{ width: '100%', height: 2, backgroundColor: '#e4e4e7' }} />
        <View className="flex-1">
          <ScrollView>
            <View className="flex-1">
              <MoreSettingsItem
                handleItemPress={() => router.push('/(more_screens)/information')}
                icon={icons.support}
                title="شرح شامل عن الأسهم"
              />
              <MoreSettingsItem
                handleItemPress={() => router.push({
                  pathname: '/(more_screens)/information',
                  params: { url: 'https://arrows-dev.versetech.net/info.html#app-fees' }
                })}
                icon={icons.support}
                title="أجور تطبيق عقاري دمشق"
              />
              {user && user?.privilege == 'admin' && (
                <MoreSettingsItem
                  handleItemPress={() => router.push('/(admin)/users_list')}
                  icon={icons.user}
                  title="المستخدمين"
                />
              )}
              {user && user?.privilege == 'admin' && (
                <MoreSettingsItem
                  handleItemPress={() => router.push('/(admin)/bulk_messages')}
                  icon={icons.bulk_messages}
                  title="رسائل جماعية"
                />
              )}

              <MoreSettingsItem
                      handleItemPress={() => router.push({
                        pathname: '/(more_screens)/information',
                        params: { url: 'https://arrows-dev.versetech.net/golden-account.html' }
                      })}
                      icon={icons.gold}
                      title="الحساب الذهبي"
              />

              <MoreSettingsItemWithVectorIcon
                handleItemPress={() => router.push('/myfavorites')}
                iconName="star"
                IconComponent={Entypo}
                title="المفضلة"
              />

              <MoreSettingsItem
                handleItemPress={() => router.push('/notifications')}
                icon={icons.notifications}
                title="مركز الإشعارات"
              />

              <NotificationPermissionSwitcher icon={icons.notifications} title="تفعيل الإشعارات" />


              <MoreSettingsItem
                handleItemPress={() => router.push('/(more_screens)/support')}
                icon={icons.support}
                title="الدعم"
              />

              <MoreSettingsItemWithVectorIcon
                handleItemPress={() => handleOpenURL('https://www.facebook.com/akari.damascus')}
                iconName="facebook"
                IconComponent={FontAwesome}
                title="صفحة الفيسبوك"
              />



              <MoreSettingsItem
                handleItemPress={() => router.push({
                  pathname: '/(more_screens)/information',
                  params: { url: 'https://arrows-dev.versetech.net/privacy-policy.html' }
                })}
                icon={icons.privacy}
                title="سياسة الخصوصية"
              />

              <MoreSettingsItem
                handleItemPress={() => router.push({
                  pathname: '/(more_screens)/information',
                  params: { url: 'https://arrows-dev.versetech.net/terms.html' }
                })}
                icon={icons.terms}
                title="شروط الاستخدام"
              />

              <LogoutInnerItem
                handleItemPress={() => bottomSheetModalRef.current.present()}
                icon={icons.logout}
                title="تسجيل الخروج"
              />
            </View>
            <View className="mb-8 items-center justify-center border-t border-zinc-200 pt-4">
              <Text>Version {Application.nativeBuildVersion}</Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>

      <CustomBottomModalSheet
        backdropBehave="close"
        enablePanDownToClose={true}
        snapPoints={['35%']}
        bottomSheetModalRef={bottomSheetModalRef}>
        <View className="h-full items-center justify-center">
          <LogoutItem
            onDeleteConfirm={handleLogout}
            confirmLoading={false}
            bottomSheetModalRef={bottomSheetModalRef}
            onClose={() => bottomSheetModalRef.current.dismiss()}
          />
        </View>
      </CustomBottomModalSheet>
    </>
  );
};

export default MoreScreen;
