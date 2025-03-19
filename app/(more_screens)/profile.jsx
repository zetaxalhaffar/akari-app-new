import {
  View,
  Text,
  I18nManager,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import CustomBottomSheet from '@/components/CustomBottomSheet';
import LogoutItem from '@/components/LogoutItem';
import CustomIcon from '../../components/CustomIcon';
import { Entypo } from '@expo/vector-icons';
import { getSecureStoreNoAsync } from '@/composables/secure.store';
import { Input } from '@/components/CustomInput';
import { useAuthStore } from '@/store/auth.store';
import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import icons from '../../constants/icons';

export const gradientPositions = {
  topToBottom: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  bottomToTop: { start: { x: 0, y: 1 }, end: { x: 0, y: 0 } },
  leftToRight: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  rightToLeft: { start: { x: 1, y: 0 }, end: { x: 0, y: 0 } },
};
export const colors = ['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c'];

const profile = () => {
  const user = getSecureStoreNoAsync('user');

  const { getUserProfile, userProfileSchemaLoading, userProfileSchemaResponse } = useAuthStore();

  const getUserProfileData = async () => {
    await getUserProfile(user?.user_id);
  };

  const handleLogout = () => {
    router.push('/(auth)');
  };

  // Renamed component to Profile to follow React naming conventions
  useEffect(() => {
    getUserProfileData();
  }, []); // Added dependency

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <View
          className={`flex-row items-center justify-between px-2 py-3 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
          <TouchableOpacity
            onPress={() => router.back()}
            className={`flex-row items-center ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
            <CustomIcon handleOnIconPress={() => router.back()} containerStyles="border-[0]">
              <Entypo name="chevron-right" size={24} color="#000" />
            </CustomIcon>
            <Text
              className={`font-psemibold text-lg ${I18nManager.isRTL ? 'text-right' : 'text-left'} mt-1`}>
              تفاصيل الحساب
            </Text>
          </TouchableOpacity>
          <View>
            <CustomBottomSheet
              snapPoints={['25%']}
              trigger={
                <Text className={`text-right font-psemibold text-base text-red-500`}>
                  تسجيل الخروج
                </Text>
              }>
              <LogoutItem onDeleteConfirm={handleLogout} confirmLoading={false} />
            </CustomBottomSheet>
          </View>
        </View>
        <View className="flex-1 px-4">
          {userProfileSchemaLoading && (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#a47764" />
            </View>
          )}
          {!userProfileSchemaLoading && (
            <>
              <View className="my-4">
                <Input
                  placeholder="الاسم"
                  value={userProfileSchemaResponse?.name}
                  editable={false}
                />
              </View>
              <View className="my-4">
                <Input
                  placeholder="الهاتف"
                  value={userProfileSchemaResponse?.phone}
                  editable={false}
                />
              </View>
              <View className="my-4">
                <ScrollView
                  contentContainerStyle={{
                    gap: 16,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                  }}
                  showsHorizontalScrollIndicator={false}>
                  <LinearGradient
                    style={{ borderRadius: 6, width: '47%' }}
                    colors={colors}
                    className={`h-[130px] items-center justify-center rounded-lg p-2`}
                    start={gradientPositions.topToBottom.start}
                    end={gradientPositions.topToBottom.end}>
                    <Image
                      source={icons.building_1}
                      resizeMode="cover"
                      className="h-12 w-12"
                      tintColor={'#FFFFFF'}
                    />
                    <Text className="font-psemibold text-sm text-white">الأسهم التنظيمية</Text>
                    <Text className="mt-1 font-pmedium text-xs text-white">
                      {userProfileSchemaResponse?.shares_count}
                    </Text>
                  </LinearGradient>
                  <LinearGradient
                    style={{ borderRadius: 6, width: '47%' }}
                    colors={colors}
                    className={`h-[130px] items-center justify-center rounded-lg p-2`}
                    start={gradientPositions.bottomToTop.start}
                    end={gradientPositions.bottomToTop.end}>
                    <Image
                      source={icons.building_1}
                      resizeMode="cover"
                      className="h-12 w-12"
                      tintColor={'#FFFFFF'}
                    />
                    <Text className="font-psemibold text-sm text-white">العقارات</Text>
                    <Text className="mt-1 font-pmedium text-xs text-white">
                      {userProfileSchemaResponse?.apartment_count}
                    </Text>
                  </LinearGradient>
                  <LinearGradient
                    style={{ borderRadius: 6, width: '47%' }}
                    colors={colors}
                    className={`h-[130px] items-center justify-center rounded-lg p-2`}
                    start={gradientPositions.leftToRight.start}
                    end={gradientPositions.leftToRight.end}>
                    <Image
                      source={icons.building_1}
                      resizeMode="cover"
                      className="h-12 w-12"
                      tintColor={'#FFFFFF'}
                    />
                    <Text className="font-psemibold text-sm text-white">عدد الطلبات</Text>
                    <Text className="mt-1 font-pmedium text-xs text-white">
                      {userProfileSchemaResponse?.orderable_count}
                    </Text>
                  </LinearGradient>
                </ScrollView>
              </View>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default profile;
