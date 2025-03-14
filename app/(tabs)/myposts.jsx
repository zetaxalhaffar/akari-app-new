import React from 'react';
import { View, Text, Image, TouchableOpacity, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeadWithBackButton from '@/components/CustomHeadWithBackButton';
import { router } from 'expo-router';
import icons from '@/constants/icons';

const MyPostsList = () => {
  const handleSharesPress = () => {
    router.push('/posts?tab=shares');
  };

  const handleApartmentsPress = () => {
    router.push('/posts?tab=apartments');
  };

  const handleCreateSharesPost = () => {
    router.push('/(create)/shares');
  };

  const handleCreateApartmentsPost = () => {
    router.push('/(create)/apartments');
  };

  return (
    <SafeAreaView className="flex-1">
      <CustomHeadWithBackButton title="طلباتي" handleButtonPress={() => router.back()} />
      <View className="mt-6 gap-8 px-4">
        <TouchableOpacity
          onPress={handleSharesPress}
          className={`flex items-center gap-6 ${I18nManager.isRTL ? 'rtl-view ' : 'ltr-view'}`}>
          <View className="flex-row items-center rounded-lg bg-gray-200 p-2">
            <Image tintColor={'#1f2937'} source={icons.building_1} className="h-8 w-8" />
          </View>
          <View className="flex-1">
            <Text className="font-psemibold text-lg">طلبات الأسهم التنظيمية</Text>
            <Text className="max-w-[230px] font-pregular text-sm">
              هنا يمكنك مشاهدة طلباتك التي قمت بإنشاءها
            </Text>
          </View>
          <TouchableOpacity onPress={handleCreateSharesPost}>
            <View className="size-12 items-center justify-center rounded-full bg-gray-200 ">
              <Text className="mt-2 font-psemibold text-2xl">+</Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
        <View className="h-[1px] bg-gray-200" />
        <TouchableOpacity
          onPress={handleApartmentsPress}
          className={`items-center gap-6 ${I18nManager.isRTL ? 'rtl-view ' : 'ltr-view'}`}>
          <View className="flex-row items-center gap-2 rounded-lg bg-gray-200 p-2">
            <Image tintColor={'#1f2937'} source={icons.building_1} className="h-8 w-8" />
          </View>
          <View className="flex-1">
            <Text className="font-psemibold text-lg">طلبات العقارات</Text>
            <Text className="max-w-[230px] font-pregular text-sm">
              هنا يمكنك مشاهدة طلباتك التي قمت بإنشاءها
            </Text>
          </View>
          <TouchableOpacity onPress={handleCreateApartmentsPost}>
            <View className="size-12 items-center justify-center rounded-full bg-gray-200 ">
              <Text className="mt-2 font-psemibold text-2xl">+</Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MyPostsList;
