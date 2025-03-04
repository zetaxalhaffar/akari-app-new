import HomePageHeader from '@/components/HomePageHeader';
import { router } from 'expo-router';
import { I18nManager, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@/constants/icons';
import { deleteSecureStore } from '@/composables/secure.store';
import CustomIcon from '../../components/CustomIcon';
import { Entypo } from '@expo/vector-icons';
import LogoutItem from '@/components/LogoutItem';
import { useRef, useState } from 'react';
import CustomBottomModalSheet from '@/components/CustomBottomModalSheet';
import { useAuthStore } from '@/store/auth.store';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';

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
      <View>
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
      <View>
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
  useEffect(() => {
    const initialize = async () => {
      const response = await getAuthData();
      setUser(response);
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
              <Text className="font-psemibold text-lg">{user?.name}</Text>
              <Text className="font-psemibold text-sm text-zinc-400">تفاصيل الحساب</Text>
            </View>
          </View>
          <View>
            <CustomIcon containerStyles="border-[0]">
              <Entypo name="chevron-left" size={24} color="#71717a" />
            </CustomIcon>
          </View>
        </TouchableOpacity>
        <View className="my-6" style={{ width: '100%', height: 2, backgroundColor: '#e4e4e7' }} />
        <View className="flex-1">
          <ScrollView>
            <View className="flex-1">
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
                handleItemPress={() => router.push('/notifications')}
                icon={icons.notifications}
                title="الإشعارات"
              />
              <MoreSettingsItem
                handleItemPress={() => router.push('/(more_screens)/features')}
                icon={icons.features}
                title="المزايا"
              />
              <MoreSettingsItem
                handleItemPress={() => router.push('/(more_screens)/support')}
                icon={icons.support}
                title="الدعم"
              />
              <MoreSettingsItem
                handleItemPress={() => router.push('/(more_screens)/privacy')}
                icon={icons.terms}
                title="سياسية الخصوصية"
              />
              <MoreSettingsItem
                handleItemPress={() => router.push('/(more_screens)/terms')}
                icon={icons.privacy}
                title="الأحكام والشروط"
              />
              <LogoutInnerItem
                handleItemPress={() => bottomSheetModalRef.current.present()}
                icon={icons.logout}
                title="تسجيل الخروج"
              />
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
