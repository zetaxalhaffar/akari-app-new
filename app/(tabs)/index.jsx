import { Text, View, Image, TouchableOpacity, I18nManager, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomePageHeader from '@/components/HomePageHeader';
import images from '~/constants/images';
import { useRegionsStore } from '@/store/regions.store';
import { useEffect } from 'react';
import { router } from 'expo-router';
export default function Home() {

  const { regionResponse, regionLoading, regionError, getRegions } = useRegionsStore();
  const getRegionsList = async () => {
    const response = await getRegions();
    console.log(response, "response");
    console.log(regionResponse, "regionResponse");
  };
  useEffect(() => {
    getRegionsList();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <HomePageHeader />
      <View className="px-4">
        <Text className="text-lg font-psemibold">
          لا تضيع فرصة الاستثمار
        </Text>
        <Text className="text-base font-pregular">
          كل الوحدات متاحة, اختر الوحدة التي تناسبك
        </Text>
      </View>
      <ScrollView>
        <View className="flex-row gap-3 px-3 mt-6">
          {regionResponse && regionResponse?.map((item) => (
            <TouchableOpacity key={item?.id} className="bg-toast-500 rounded-lg flex-1 h-[200px] relative" onPress={() => router.push({
              pathname: `/(regions)/${item?.id}`,
            })}>
              <Image
                source={images.city_1}
                resizeMode="cover"
                className="h-full w-full rounded-lg"
              />
              <View className="absolute inset-0 bg-toast-900/70 backdrop-blur-sm w-full bottom-0 rounded-lg p-4">
                <Text className="text-lg font-psemibold text-white text-center">
                  {item?.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
