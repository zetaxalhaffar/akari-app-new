import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { createNotifications, notify } from 'react-native-notificated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useEnumsStore } from '../../store/enums.store';

import HomePageHeader from '@/components/HomePageHeader';
import icons from '@/constants/icons';
import { useAuthStore } from '@/store/auth.store';
import { useRegionsStore } from '@/store/regions.store';
import { useVersionsStore } from '@/store/versions.store';
import images from '~/constants/images';

const gradientPositions = {
  topToBottom: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  bottomToTop: { start: { x: 0, y: 1 }, end: { x: 0, y: 0 } },
  leftToRight: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  rightToLeft: { start: { x: 1, y: 0 }, end: { x: 0, y: 0 } },
};
const colors = ['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c'];
export default function Home() {
  const { useNotifications } = createNotifications();

  // Get user data from secure storage (same as support screen)
  const [userData, setUserData] = useState(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const positionOfGradient = 'topToBottom';
  const positionOfGradient2 = 'bottomToTop';
  const { regionResponse, getRegions } = useRegionsStore();
  const { statisticsSchemaResponse, getStatistics, statisticsSchemaLoading } = useEnumsStore();
  const { showAlert } = useVersionsStore();
  const { getAuthData } = useAuthStore();
  const getRegionsList = async () => {
    setUserData(null);
    setUserDataLoading(true);
    await getRegions();
    await getStatistics();
    const response = await getAuthData();
    setUserData(response);
    setUserDataLoading(false);
  };
  useEffect(() => {
    getRegionsList();
  }, []);

  const { remove } = useNotifications();

  const [backPressCount, setBackPressCount] = useState(0);

  // Optimized navigation handlers using requestAnimationFrame
  const handleRegionPress = useCallback((regionId) => {
    requestAnimationFrame(() => {
      router.push({
        pathname: `/(regions)/${regionId}`,
      });
    });
  }, []);

  const handleShareStatisticsPress = useCallback((itemId) => {
    requestAnimationFrame(() => {
      router.push({
        pathname: `/(regions)/${itemId}`,
      });
    });
  }, []);

  const handleApartmentStatisticsPress = useCallback((apartmentTypeId) => {
    requestAnimationFrame(() => {
      router.push({
        pathname: '/SearchResults',
        params: {
          currentType: 'apartment',
          apartment_type_id: apartmentTypeId,
        },
      });
    });
  }, []);

  const handleChatPress = useCallback(() => {
    requestAnimationFrame(() => {
      router.push('/chat');
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      const backAction = () => {
        if (backPressCount === 0) {
          notify('success', {
            params: { title: 'يرجى الضغط مرة أخرى للخروج' },
            config: {
              duration: 2000,
            },
          });
          setBackPressCount(1);

          setTimeout(() => {
            setBackPressCount(0);
          }, 2000);

          return true; // Prevent default behavior
        } else if (backPressCount === 1) {
          remove();
          BackHandler.exitApp();
        }
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove(); // Clean up the event listener
    }, [backPressCount])
  );

  return (
    <SafeAreaView className="flex-1">
      <HomePageHeader />
      <View className="px-4">
        <Text className="font-psemibold text-lg">لا تضيع فرصة الاستثمار</Text>
        <Text className="font-pregular text-base">كل الوحدات متاحة, اختر الوحدة التي تناسبك</Text>
      </View>
      {statisticsSchemaLoading || userDataLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#a47764" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 50 }}
          refreshControl={<RefreshControl refreshing={false} onRefresh={getRegionsList} />}>
          {userData && userData?.chat && (
            <TouchableOpacity className="mx-4 mt-4" onPress={handleChatPress} activeOpacity={0.8}>
              <Image source={images.akari_ai} className="h-24 w-full" resizeMode="contain" />
            </TouchableOpacity>
          )}
          <View className="mt-6 px-3">
            <ScrollView
              contentContainerStyle={{
                gap: 8,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
              showsHorizontalScrollIndicator={false}>
              {regionResponse &&
                regionResponse?.map((item) => (
                  <TouchableOpacity
                    key={item?.id}
                    className="relative h-[200px] rounded-lg bg-toast-500"
                    style={{ width: '48.5%' }}
                    onPress={() => handleRegionPress(item?.id)}
                    activeOpacity={0.8}>
                  <Image
                    source={images.city_1}
                    resizeMode="cover"
                    className="h-full w-full rounded-lg"
                  />
                  <View className="absolute inset-0 bottom-0 w-full rounded-lg bg-toast-900/70 p-4 backdrop-blur-sm">
                    <Text className="text-center font-psemibold text-lg text-white">
                      {item?.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View className="my-2 px-4 py-1">
                        <Image source={images.stat} className="h-24 w-full mb-1" resizeMode="contain" />
 
            <View className="mb-16 mt-2">
              <ScrollView
                contentContainerStyle={{
                  gap: 8,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}
                showsHorizontalScrollIndicator={false}>
                {statisticsSchemaResponse?.share_statistics?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{ width: '48.5%' }}
                    onPress={() => handleShareStatisticsPress(item?.id)}
                    activeOpacity={0.8}>
                    <LinearGradient
                      style={{ borderRadius: 6 }}
                      colors={colors}
                      className="h-[130px] items-center justify-center rounded-lg p-2"
                      start={gradientPositions[positionOfGradient2].start}
                      end={gradientPositions[positionOfGradient2].end}>
                      <Image
                        source={icons.building_1}
                        resizeMode="cover"
                        className="h-12 w-12"
                        tintColor="#FFFFFF"
                      />
                      <Text className="font-psemibold text-sm text-white">
                       أسهم {item?.name} 
                      </Text>
                      <Text className="mt-1 font-pmedium text-xs text-white">
                        عدد إعلانات الشراء: {item?.buy_shares_count}
                      </Text>
                      <Text className="mt-1 font-pmedium text-xs text-white">
                        عدد إعلانات البيع: {item?.sell_shares_count}
                      </Text>

                    </LinearGradient>
                  </TouchableOpacity>
                ))}
                <LinearGradient
                  style={{ borderRadius: 6 }}
                  colors={colors}
                  className="h-[100px] w-full items-center justify-center rounded-lg"
                  start={gradientPositions[positionOfGradient].start}
                  end={gradientPositions[positionOfGradient].end}>
                  <Image
                    source={icons.updates}
                    resizeMode="cover"
                    className="h-12 w-12"
                    tintColor="#FFFFFF"
                  />
                  <Text className="font-pbold text-center text-white text-xl mt-2">
                    عدد العقارات المتاحة حسب النوع
                  </Text>
                </LinearGradient>
                {statisticsSchemaResponse?.apartment_statistics?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{ width: '48.5%' }}
                    onPress={() => handleApartmentStatisticsPress(item?.id)}
                    activeOpacity={0.8}>
                    <LinearGradient
                      style={{ borderRadius: 6 }}
                      colors={colors}
                      className="h-[130px] items-center justify-center rounded-lg p-2"
                      start={gradientPositions[positionOfGradient].start}
                      end={gradientPositions[positionOfGradient].end}>
                      <Image
                        source={icons.building_1}
                        resizeMode="cover"
                        className="h-12 w-12"
                        tintColor="#FFFFFF"
                      />
                      <Text className="text-center font-psemibold text-sm text-white">
                        {item?.name}
                      </Text>
                      <Text className="text-center font-pbold text-xl text-white">
                        {item?.apartments_count}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
