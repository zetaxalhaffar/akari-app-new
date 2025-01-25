import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomePageHeader from '@/components/HomePageHeader';
import { router, useGlobalSearchParams } from 'expo-router';
import CustomTopTabs from '../../components/CustomTopTabs';
import { useUnitsStore } from '../../store/units.store';
import CustomButton from '@/components/CustomButton';
import { FlashList } from '@shopify/flash-list';
import CustomLinear from '../../components/CustomLinear';
import icons from '~/constants/icons';

// Top Tab Items
const topTabItems = [
  {
    id: 'shares',
    title: 'الأسهم التنظيمية',
  },
  {
    id: 'apartments',
    title: 'العقارات',
  },
];

const UnitShareCard = ({ item }) => {
  const handleSharePress = () => {
    router.push(`/(shares)/${item.id}`);
  };
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleSharePress}
      className="relative my-3 h-[350px] w-full overflow-hidden rounded-lg border border-toast-900/50">
      <View
        className={`absolute z-10 m-3 rounded-t-lg border-toast-500 ${I18nManager.isRTL ? 'right-0' : 'left-0'}`}>
        <CustomLinear
          title={item.transaction_type == 'sell' ? 'بيع' : 'شراء'}
          colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
          positionOfGradient="leftToRight"
          textStyles="text-white !text-xs mt-1"
          buttonStyles="rounded-lg py-1 px-8"
        />
      </View>
      <View
        className={`absolute z-10 m-3 rounded-t-lg border-toast-500 ${I18nManager.isRTL ? 'left-0' : 'right-0'}`}>
        <CustomLinear
          title={`${item.id}#`}
          colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
          positionOfGradient="leftToRight"
          textStyles="text-white !text-xs mt-1"
          buttonStyles="rounded-lg py-1 px-8"
        />
      </View>
      <Image source={{ uri: item.sector.cover.img }} className="h-full w-full" />
      <View className="absolute inset-0 bottom-0 w-full rounded-lg bg-toast-900/90 p-4 backdrop-blur-sm">
        <Text className="font-psemibold text-xl text-white">
          {item.sector.sector_name.name} - {item.sector.sector_name.code}
        </Text>
        <Text className="mb-1 font-pregular text-base text-white">
          {item.region.name} - {item.post_type == 'share' ? 'أسهم تنظيمية' : 'عقارات'}
        </Text>
        <View className="flex-row flex-wrap items-center gap-1">
          <View className="flex-row items-center gap-1">
            <Image
              source={icons.price}
              className={'h-6 w-6'}
              tintColor={'#FFF'}
              resizeMode="contain"
            />
            <Text className="font-pmedium text-sm text-white">سعر السهم : {item.price}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Image
              source={icons.quantity}
              className={'h-6 w-6'}
              tintColor={'#FFF'}
              resizeMode="contain"
            />
            <Text className="font-pmedium text-sm text-white">
              الأسهم المطروحة : {item.quantity}
            </Text>
          </View>
        </View>
        <View className="mt-1 flex-row flex-wrap items-center gap-1">
          <View className="flex-row items-center gap-1">
            <Image
              source={icons.date}
              className={'h-6 w-6'}
              tintColor={'#FFF'}
              resizeMode="contain"
            />
            <Text className="font-pmedium text-sm text-white">تاريخ النشر : {item.since}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Image
              source={icons.view}
              className={'h-6 w-6'}
              tintColor={'#FFF'}
              resizeMode="contain"
            />
            <Text className="font-pmedium text-sm text-white">المشاهدات: {item.views}</Text>
          </View>
        </View>
        <View className="mt-1 flex-row flex-wrap items-center gap-1">
          <View className="flex-row items-center gap-1">
            <Image
              source={icons.unit_status}
              className={'h-6 w-6'}
              tintColor={'#FFF'}
              resizeMode="contain"
            />
            <Text className="font-pmedium text-sm text-white">
              حالة الطلب : {item.approve == 1 ? 'متاح' : 'قيد المراجعة'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const UnitApartmentCard = ({ item }) => {
  const handleApartmentPress = () => {
    router.push(`/(apartments)/${item.id}`);
  };

  return (
    <TouchableOpacity
      onPress={handleApartmentPress}
      activeOpacity={0.8}
      className="relative my-3 h-[350px] w-full overflow-hidden rounded-lg border border-toast-900/50">
      <View
        className={`absolute z-10 m-3 rounded-t-lg border-toast-500 ${I18nManager.isRTL ? 'right-0' : 'left-0'}`}>
        <CustomLinear
          title={item.transaction_type == 'sell' ? 'بيع' : 'شراء'}
          colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
          positionOfGradient="leftToRight"
          textStyles="text-white !text-xs mt-1"
          buttonStyles="rounded-lg py-1 px-8"
        />
      </View>
      <View
        className={`absolute z-10 m-3 rounded-t-lg border-toast-500 ${I18nManager.isRTL ? 'left-0' : 'right-0'}`}>
        <CustomLinear
          title={`${item.id}#`}
          colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
          positionOfGradient="leftToRight"
          textStyles="text-white !text-xs mt-1"
          buttonStyles="rounded-lg py-1 px-8"
        />
      </View>
      <Image source={{ uri: item.sector.cover.img }} className="h-full w-full" />
      <View className="absolute inset-0 bottom-0 w-full rounded-lg bg-toast-900/90 p-4 backdrop-blur-sm">
        <Text className="font-psemibold text-xl text-white">
          {item.sector.sector_name.name} - {item.sector.sector_name.code}
        </Text>
        <Text className="mb-1 font-pregular text-base text-white">
          {item.region.name} - {item.post_type == 'share' ? 'أسهم تنظيمية' : 'عقارات'}
        </Text>
        <View className="flex-row flex-wrap items-center gap-1">
          <View className="flex-row items-center gap-1">
            <Image
              source={icons.price}
              className={'h-6 w-6'}
              tintColor={'#FFF'}
              resizeMode="contain"
            />
            <Text className="font-pmedium text-sm text-white">سعر العقار : {item.price}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Image
              source={icons.direction}
              className={'h-6 w-6'}
              tintColor={'#FFF'}
              resizeMode="contain"
            />
            <Text className="font-pmedium text-sm text-white">
              اتجاه العقار : {item.direction.name}
            </Text>
          </View>
        </View>
        <View className="mt-1 flex-row flex-wrap items-center gap-1">
          <View className="flex-row items-center gap-1">
            <Image
              source={icons.date}
              className={'h-6 w-6'}
              tintColor={'#FFF'}
              resizeMode="contain"
            />
            <Text className="font-pmedium text-sm text-white">تاريخ النشر : {item.since}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Image
              source={icons.view}
              className={'h-6 w-6'}
              tintColor={'#FFF'}
              resizeMode="contain"
            />
            <Text className="font-pmedium text-sm text-white">المشاهدات: {item.views}</Text>
          </View>
        </View>
        <View className="mt-1 flex-row flex-wrap items-center gap-1">
          <View className="flex-row items-center gap-1">
            <Image
              source={icons.unit_status}
              className={'h-6 w-6'}
              tintColor={'#FFF'}
              resizeMode="contain"
            />
            <Text className="font-pmedium text-sm text-white">
              حالة الطلب : {item.approve == 1 ? 'متاح' : 'قيد المراجعة'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Region With Id
const RegionWithId = () => {
  // Get Region Id
  const { id } = useGlobalSearchParams();

  // Get All Shares and Apartments For Region
  const {
    getAllSharesForRegion,
    getAllApartmentsForRegion,
    sharesResponse,
    apartmentsResponse,
    sharesLoading,
    sharesRecords,
    apartmentsRecords,
  } = useUnitsStore();

  // Get Shares Based On Region
  const filtersParams = useRef({
    page: 1,
  });
  const getSharesBasedOnRegion = async (firstLoad = false) => {
    const shares = await getAllSharesForRegion(id, filtersParams.current, firstLoad);
  };

  // Get Apartments Based On Region
  const getApartmentsBasedOnRegion = async (firstLoad = false) => {
    const apartments = await getAllApartmentsForRegion(id, filtersParams.current, firstLoad);
  };

  // Handle Tab Change
  const [tabId, setTabId] = useState('shares');
  const handleTabChange = (tabId) => {
    filtersParams.current.page = 1;
    setTabId(tabId);
  };

  // Handle End Reached
  const handleEndReached = () => {
    console.log(sharesResponse.next_page_url, 'sharesResponse');
    if (tabId == 'shares') {
      if (sharesResponse.next_page_url) {
        filtersParams.current.page++;
        getSharesBasedOnRegion();
      }
    } else {
      if (apartmentsResponse.next_page_url) {
        filtersParams.current.page++;
        getApartmentsBasedOnRegion();
      }
    }
  };

  // Handle Refresh
  const handleRefresh = () => {
    filtersParams.current.page = 1;
    if (tabId == 'shares') {
      getSharesBasedOnRegion(true);
    } else {
      getApartmentsBasedOnRegion(true);
    }
  };

  const topTabAction = useRef({
    title: tabId == 'share' ? 'إضافة سهم تنظيمي' : 'إضافة عقار',
  });

  // Get Shares and Apartments Based On Region UseEffect
  useEffect(() => {
    filtersParams.current.page = 1;
    getSharesBasedOnRegion(true);
    getApartmentsBasedOnRegion(true);
  }, [tabId]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <HomePageHeader hasActions={true} customActions={true}>
        <CustomButton
          hasGradient={true}
          colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
          title={tabId == 'shares' ? 'إضافة سهم تنظيمي' : 'إضافة عقار'}
          positionOfGradient={'leftToRight'}
          textStyles={'text-white text-sm'}
          handleButtonPress={() => {
            router.push(`/(create)/${tabId}`);
          }}
        />
      </HomePageHeader>
      <View className="flex-1">
        <CustomTopTabs topTabItems={topTabItems} onTabChange={handleTabChange}>
          <View className="flex-1 px-4 pt-4">
            <FlashList
              data={tabId == 'shares' ? sharesRecords : apartmentsRecords}
              estimatedItemSize={350}
              refreshing={sharesLoading}
              onRefresh={handleRefresh}
              renderItem={({ item }) =>
                tabId == 'shares' ? (
                  <UnitShareCard item={item} />
                ) : (
                  <UnitApartmentCard item={item} />
                )
              }
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.5}
            />
          </View>
        </CustomTopTabs>
      </View>
    </SafeAreaView>
  );
};

export default RegionWithId;
