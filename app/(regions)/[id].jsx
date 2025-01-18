import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomePageHeader from '@/components/HomePageHeader';
import { router, useGlobalSearchParams } from 'expo-router';
import CustomTopTabs from '../../components/CustomTopTabs';
import { useUnitsStore } from '../../store/units.store';

import { FlashList } from '@shopify/flash-list';
import CustomLinear from '../../components/CustomLinear';
import icons from '~/constants/icons';

// Top Tab Items
const topTabItems = [
  {
    id: 'shares',
    title: 'الأسهم التنظيمية'
  },
  {
    id: 'apartments',
    title: 'الأسهم العقارية'
  },
]


const UnitShareCard = ({ item }) => {
  const handleSharePress = () => {
    router.push(`/(shares)/${item.id}`);
  }
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handleSharePress} className="relative w-full my-3 border border-toast-900/50 h-[350px] rounded-lg overflow-hidden">
      <View className={`absolute m-3 rounded-t-lg border-toast-500 z-10 ${I18nManager.isRTL ? 'right-0' : 'left-0'}`}>
        <CustomLinear
          title={item.transaction_type == 'sell' ? 'بيع' : 'شراء'}
          colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
          positionOfGradient="leftToRight"
          textStyles="text-white !text-xs mt-1"
          buttonStyles="rounded-lg py-1 px-8"
        />
      </View>
      <View className={`absolute m-3 rounded-t-lg border-toast-500 z-10 ${I18nManager.isRTL ? 'left-0' : 'right-0'}`}>
        <CustomLinear
          title={`${item.id}#`}
          colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
          positionOfGradient="leftToRight"
          textStyles="text-white !text-xs mt-1"
          buttonStyles="rounded-lg py-1 px-8"
        />
      </View>
      <Image source={{ uri: item.sector.cover.img }} className="w-full h-full" />
      <View className="absolute inset-0 bg-toast-900/90 backdrop-blur-sm w-full bottom-0 rounded-lg p-4">
        <Text className="text-xl font-psemibold text-white">
          {item.sector.sector_name.name} - {item.sector.sector_name.code}
        </Text>
        <Text className="text-base font-pregular text-white mb-1">
          {item.region.name} - {item.post_type == 'share' ? 'أسهم تنظيمية' : 'عقارات'}
        </Text>
        <View className="flex-row items-center gap-1 flex-wrap">
          <View className="flex-row items-center gap-1">
            <Image source={icons.price} className={'w-6 h-6'} tintColor={'#FFF'} resizeMode='contain' />
            <Text className="text-sm font-pmedium text-white">
              سعر السهم : {item.price}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Image source={icons.quantity} className={'w-6 h-6'} tintColor={'#FFF'} resizeMode='contain' />
            <Text className="text-sm font-pmedium text-white">
              الأسهم المطروحة : {item.quantity}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-1 mt-1 flex-wrap">
          <View className="flex-row items-center gap-1">
            <Image source={icons.date} className={'w-6 h-6'} tintColor={'#FFF'} resizeMode='contain' />
            <Text className="text-sm font-pmedium text-white">
              تاريخ النشر : {item.since}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Image source={icons.view} className={'w-6 h-6'} tintColor={'#FFF'} resizeMode='contain' />
            <Text className="text-sm font-pmedium text-white">
              المشاهدات: {item.views}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const UnitApartmentCard = ({ item }) => {
  const handleApartmentPress = () => {
    router.push(`/(apartments)/${item.id}`);
  }

  return (
    <TouchableOpacity onPress={handleApartmentPress} activeOpacity={0.8} className="relative w-full my-3 border border-toast-900/50 h-[350px] rounded-lg overflow-hidden">
      <View className={`absolute m-3 rounded-t-lg border-toast-500 z-10 ${I18nManager.isRTL ? 'right-0' : 'left-0'}`}>
        <CustomLinear
          title={item.transaction_type == 'sell' ? 'بيع' : 'شراء'}
          colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
          positionOfGradient="leftToRight"
          textStyles="text-white"
          buttonStyles="rounded-lg py-1 px-8"
        />
      </View>
      <Image source={{ uri: item.sector.cover.img }} className="w-full h-full" />
      <View className="absolute inset-0 bg-toast-900/90 backdrop-blur-sm w-full bottom-0 rounded-lg p-4">
        <Text className="text-xl font-psemibold text-white">
          {item.sector.sector_name.name} - {item.sector.sector_name.code}
        </Text>
        <Text className="text-base font-pregular text-white mb-1">
          {item.region.name} - {item.post_type == 'share' ? 'أسهم تنظيمية' : 'عقارات'}
        </Text>
        <View className="flex-row items-center gap-1 flex-wrap">
          <View className="flex-row items-center gap-1">
            <Image source={icons.price} className={'w-6 h-6'} tintColor={'#FFF'} resizeMode='contain' />
            <Text className="text-sm font-pmedium text-white">
              سعر العقار : {item.price}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Image source={icons.direction} className={'w-6 h-6'} tintColor={'#FFF'} resizeMode='contain' />
            <Text className="text-sm font-pmedium text-white">
              اتجاه العقار : {item.direction.name}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-1 mt-1 flex-wrap">
          <View className="flex-row items-center gap-1">
            <Image source={icons.date} className={'w-6 h-6'} tintColor={'#FFF'} resizeMode='contain' />
            <Text className="text-sm font-pmedium text-white">
              تاريخ النشر : {item.since}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Image source={icons.view} className={'w-6 h-6'} tintColor={'#FFF'} resizeMode='contain' />
            <Text className="text-sm font-pmedium text-white">
              المشاهدات: {item.views}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}


// Region With Id
const RegionWithId = () => {
  // Get Region Id
  const { id } = useGlobalSearchParams();

  // Get All Shares and Apartments For Region
  const { getAllSharesForRegion, getAllApartmentsForRegion, sharesResponse, apartmentsResponse, sharesLoading, sharesRecords, apartmentsRecords } = useUnitsStore();

  // Get Shares Based On Region
  const filtersParams = useRef({
    page: 1
  })
  const getSharesBasedOnRegion = async (firstLoad = false) => {
    const shares = await getAllSharesForRegion(id, filtersParams.current, firstLoad);
  }

  // Get Apartments Based On Region
  const getApartmentsBasedOnRegion = async (firstLoad = false) => {
    const apartments = await getAllApartmentsForRegion(id, filtersParams.current, firstLoad);
  }

  // Handle Tab Change
  const [tabId, setTabId] = useState('shares');
  const handleTabChange = (tabId) => {
    filtersParams.current.page = 1;
    setTabId(tabId);
  }

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
  }

  // Handle Refresh
  const handleRefresh = () => {
    filtersParams.current.page = 1;
    if (tabId == 'shares') {
      getSharesBasedOnRegion(true);
    } else {
      getApartmentsBasedOnRegion(true);
    }
  }

  // Get Shares and Apartments Based On Region UseEffect
  useEffect(() => {
    filtersParams.current.page = 1;
    getSharesBasedOnRegion(true);
    getApartmentsBasedOnRegion(true);
  }, [tabId]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <HomePageHeader hasActions={false} />
      <View className="flex-1">
        <CustomTopTabs topTabItems={topTabItems} onTabChange={handleTabChange}>
          <View className="flex-1 pt-4 px-4">
            <FlashList
              data={tabId == 'shares' ? sharesRecords : apartmentsRecords}
              estimatedItemSize={350}
              refreshing={sharesLoading}
              onRefresh={handleRefresh}
              renderItem={({ item }) => (
                tabId == 'shares' ? <UnitShareCard item={item} /> : <UnitApartmentCard item={item} />
              )}
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
