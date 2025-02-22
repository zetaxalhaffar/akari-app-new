import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeadWithBackButton from '@/components/CustomHeadWithBackButton';
import { router } from 'expo-router';
import icons from '@/constants/icons';

const FeaturesScreen = () => {
  return (
    <SafeAreaView className="flex-1">
      <CustomHeadWithBackButton title="المزايا" handleButtonPress={() => router.back()} />
      <View className="mt-6 gap-8 px-4">
        <TouchableOpacity onPress={() => {}} className="flex-row items-center gap-6">
          <View className="flex-row items-center rounded-lg bg-[#5B5FE9]/20 p-2">
            <Image tintColor={'#5B5FE9'} source={icons.mobile} className="h-8 w-8" />
          </View>
          <View>
            <Text className="font-psemibold text-lg">تجربة سلسة وسهلة</Text>
            <Text className="max-w-[250px] font-pregular text-sm">
              استمتع بتجربة سلسة وسهلة للتعامل مع العقارات والأسهم التنظيمية
            </Text>
          </View>
        </TouchableOpacity>
        <View className="h-[1px] bg-gray-200" />
        <TouchableOpacity onPress={() => {}} className="flex-row items-center gap-6">
          <View className="flex-row items-center gap-2 rounded-lg bg-[#539BFF]/20 p-2">
            <Image tintColor={'#539BFF'} source={icons.building_1} className="h-8 w-8" />
          </View>
          <View>
            <Text className="font-psemibold text-lg">خيارات كثيرة ومناسبة لك</Text>
            <Text className="max-w-[250px] font-pregular text-sm">
              استمتع بخيارات كثيرة ومناسبة لك للتعامل مع العقارات والأسهم التنظيمية
            </Text>
          </View>
        </TouchableOpacity>
        <View className="h-[1px] bg-gray-200" />
        <TouchableOpacity onPress={() => {}} className="flex-row items-center gap-6">
          <View className="flex-row items-center gap-2 rounded-lg bg-[#05b187]/20 p-2">
            <Image tintColor={'#05b187'} source={icons.updates} className="h-8 w-8" />
          </View>
          <View>
            <Text className="font-psemibold text-lg">تحديثات مستمرة</Text>
            <Text className="max-w-[250px] font-pregular text-sm">
              استمتع بتحديثات مستمرة للتطوير والتحسين
            </Text>
          </View>
        </TouchableOpacity>
        <View className="h-[1px] bg-gray-200" />
        <TouchableOpacity onPress={() => {}} className="flex-row items-center gap-6">
          <View className="flex-row items-center gap-2 rounded-lg bg-[#FFAB91]/20 p-2">
            <Image tintColor={'#FFAB91'} source={icons.support_2} className="h-8 w-8" />
          </View>
          <View>
            <Text className="font-psemibold text-lg">الدعم الفني</Text>
            <Text className="max-w-[250px] font-pregular text-sm">
              استمتع بالدعم الفني السريع من فريق عقاري المميز
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FeaturesScreen;
