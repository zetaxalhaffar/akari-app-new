import React, { useEffect, useRef, useState } from 'react';
import { View, Text, I18nManager, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeadWithBackButton from '@/components/CustomHeadWithBackButton';
import { router } from 'expo-router';
import CustomTopTabs from '../../components/CustomTopTabs';
import { FlashList } from '@shopify/flash-list';
import { useOrdersStore } from '../../store/orders.store';
import CustomLinear from '../../components/CustomLinear';
import icons from '@/constants/icons';
import EmptyScreen from '../../components/EmptyScreen';

// Top Tab Items
const topTabItems = [
  {
    id: 'shares',
    title: 'طلبات الأسهم',
  },
  {
    id: 'apartments',
    title: 'طلبات العقارات',
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
          {item.sector.sector_name?.name} - {item.sector.sector_name.code}
        </Text>
        <Text className="mb-1 font-pregular text-base text-white">
          {item.region?.name} - {item.post_type == 'share' ? 'أسهم تنظيمية' : 'عقارات'}
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
          {item.sector?.sector_name?.name} - {item.sector?.sector_name?.code}
        </Text>
        <Text className="mb-1 font-pregular text-base text-white">
          {item.region?.name} - {item.post_type == 'share' ? 'أسهم تنظيمية' : 'عقارات'}
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
              اتجاه العقار : {item.direction?.name}
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

const MyOrders = () => {
  // Get Shares Based On Region
  const filtersParams = useRef({
    page: 1,
  });
  // call order store
  const {
    sharesOrders,
    sharesOrdersLoading,
    getSharesOrders,
    getApartmentsOrders,
    apartmentsOrders,
    apartmentsOrdersLoading,
  } = useOrdersStore();

  const getSharesOrdersData = async (isFirstLoad = false) => {
    await getSharesOrders(filtersParams.current, isFirstLoad);
    console.log('sharesOrders', sharesOrders.length);
  };

  const getApartmentsOrdersData = async (isFirstLoad = false) => {
    await getApartmentsOrders(filtersParams.current, isFirstLoad);
    console.log('apartmentsOrders', apartmentsOrders.length);
  };

  // Handle Tab Change
  const [tabId, setTabId] = useState('shares');
  const handleTabChange = (tabId) => {
    filtersParams.current.page = 1;
    setTabId(tabId);
  };

  const handleRefresh = () => {
    filtersParams.current.page = 1;
    getSharesOrdersData(true);
    getApartmentsOrdersData(true);
  };

  useEffect(() => {
    filtersParams.current.page = 1;
    getSharesOrdersData(true);
    getApartmentsOrdersData(true);
  }, [tabId]);

  return (
    <SafeAreaView className="flex-1">
      <CustomHeadWithBackButton title="طلباتي" handleButtonPress={() => router.back()} />
      <View className="flex-1">
        <CustomTopTabs topTabItems={topTabItems} onTabChange={handleTabChange}>
          <View className="flex-1 px-4 pt-4">
            <FlashList
              data={tabId == 'shares' ? sharesOrders : apartmentsOrders}
              estimatedItemSize={350}
              refreshing={sharesOrdersLoading || apartmentsOrdersLoading}
              onRefresh={handleRefresh}
              renderItem={({ item }) =>
                tabId == 'shares' ? (
                  sharesOrders.length > 0 ? (
                    <UnitShareCard item={item.orderable} />
                  ) : (
                    <Text>لا يوجد طلبات</Text>
                  )
                ) : apartmentsOrders.length > 0 ? (
                  <UnitApartmentCard item={item.orderable} />
                ) : (
                  <Text>لا يوجد طلبات</Text>
                )
              }
              onEndReached={() => {}}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={<EmptyScreen />}
            />
          </View>
        </CustomTopTabs>
      </View>
    </SafeAreaView>
  );
};

export default MyOrders;
