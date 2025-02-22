import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
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

  return (
    <SafeAreaView className="flex-1">
      <CustomHeadWithBackButton title="طلباتي" handleButtonPress={() => router.back()} />
      <View className="mt-6 gap-8 px-4">
        <TouchableOpacity onPress={handleSharesPress} className="flex-row items-center gap-6">
          <View className="flex-row items-center rounded-lg bg-gray-200 p-2">
            <Image tintColor={'#1f2937'} source={icons.building_1} className="h-8 w-8" />
          </View>
          <View>
            <Text className="font-psemibold text-lg">طلبات الأسهم التنظيمية</Text>
            <Text className="max-w-[250px] font-pregular text-sm">
              هنا يمكنك مشاهدة طلباتك التي قمت بإنشاءها
            </Text>
          </View>
        </TouchableOpacity>
        <View className="h-[1px] bg-gray-200" />
        <TouchableOpacity onPress={handleApartmentsPress} className="flex-row items-center gap-6">
          <View className="flex-row items-center gap-2 rounded-lg bg-gray-200 p-2">
            <Image tintColor={'#1f2937'} source={icons.building_1} className="h-8 w-8" />
          </View>
          <View>
            <Text className="font-psemibold text-lg">طلبات العقارات</Text>
            <Text className="max-w-[250px] font-pregular text-sm">
              هنا يمكنك مشاهدة طلباتك التي قمت بإنشاءها
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default MyPostsList;
