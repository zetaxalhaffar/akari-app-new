import HomePageHeader from '@/components/HomePageHeader';
import { router } from 'expo-router';
import { I18nManager, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import icons from '@/constants/icons';
import { getSecureStoreNoAsync } from '@/composables/secure.store';
import CustomIcon from '../../components/CustomIcon';
import { Entypo } from '@expo/vector-icons';

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

const MoreScreen = () => {
  const user = getSecureStoreNoAsync('user');
  return (
    <>
      <SafeAreaView className="flex-1 ">
        <HomePageHeader hasActions={false} />
        <View
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
        </View>
        <View className="my-6" style={{ width: '100%', height: 2, backgroundColor: '#e4e4e7' }} />
        <View className="flex-1">
          <ScrollView>
            <View className="flex-1">
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
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default MoreScreen;
