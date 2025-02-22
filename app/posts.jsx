import React, { useEffect, useRef, useState } from 'react';
import { View, Text, I18nManager, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeadWithBackButton from '@/components/CustomHeadWithBackButton';
import { router, useGlobalSearchParams } from 'expo-router';
import CustomTopTabs from '@/components/CustomTopTabs';
import { FlashList } from '@shopify/flash-list';
import { useOrdersStore } from '@/store/orders.store';
import CustomLinear from '@/components/CustomLinear';
import icons from '@/constants/icons';
import EmptyScreen from '@/components/EmptyScreen';
import CustomButton from '@/components/CustomButton';
import UnitShareCard from '../components/UnitCardShare';
import UnitApartmentCard from '../components/UnitCardApartment';

// Top Tab Items
const topTabItems = [
  {
    id: 'buy',
    title: 'طلبات الشراء',
  },
  {
    id: 'sell',
    title: 'طلبات البيع',
  },
];


const MyOrders = () => {
  const { tab } = useGlobalSearchParams();

  // Get Shares Based On Region
  const filtersParams = useRef({
    page: 1,
  });
  // call order store
  const {
    apartmentsOrdersForCurrentUser,
    getApartmentsOrdersForCurrentUser,
    apartmentsOrdersForCurrentUserLoading,
    getSharesOrdersForCurrentUser,
    sharesOrdersForCurrentUserLoading,
    sharesOrdersForCurrentUser,
  } = useOrdersStore();

  const getSharesOrdersData = async (isFirstLoad = false) => {
    await getSharesOrdersForCurrentUser(tabId, filtersParams.current, isFirstLoad);
    console.log(sharesOrdersForCurrentUser.data.length, 'sharesOrdersForCurrentUser');
  };

  const getApartmentsOrdersData = async (isFirstLoad = false) => {
    await getApartmentsOrdersForCurrentUser(tabId, filtersParams.current, isFirstLoad);
    console.log(apartmentsOrdersForCurrentUser.data.length, 'apartmentsOrdersForCurrentUser');
  };

  // Handle Tab Change
  const [tabId, setTabId] = useState('sell');
  const handleTabChange = (tabId) => {
    filtersParams.current.page = 1;
    setTabId(tabId);
  };

  const handleRefresh = () => {
    filtersParams.current.page = 1;
    getSharesOrdersData(true);
    getApartmentsOrdersData(true);
  };

  const handleButtonPress = () => {
    router.push(`/(create)/${tab}`);
  };

  // Handle End Reached
  const handleEndReached = () => {
    console.log(sharesOrdersForCurrentUser.next_page_url, 'sharesOrdersForCurrentUser');
    console.log(apartmentsOrdersForCurrentUser.next_page_url, 'apartmentsOrdersForCurrentUser');
    if (tabId == 'shares') {
      if (sharesOrdersForCurrentUser.next_page_url) {
        filtersParams.current.page++;
        getSharesOrdersData();
      }
    } else {
      if (apartmentsOrdersForCurrentUser.next_page_url) {
        filtersParams.current.page++;
        getApartmentsOrdersData();
      }
    }
  };

  useEffect(() => {
    filtersParams.current.page = 1;
    getSharesOrdersData(true);
    getApartmentsOrdersData(true);
  }, [tabId]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row items-center justify-between pe-4">
        <CustomHeadWithBackButton
          title={`${tab == 'shares' ? 'طلبات الأسهم التنظيمية' : 'طلبات العقارات'}`}
          handleButtonPress={() => router.back()}
        />
        <CustomButton
          hasGradient={true}
          colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
          title={'إضافة طلب'}
          positionOfGradient={'leftToRight'}
          textStyles={'text-white text-sm'}
          handleButtonPress={handleButtonPress}
        />
      </View>
      <View className="flex-1">
        <CustomTopTabs
          defaultActiveTab={'sell'}
          topTabItems={topTabItems}
          onTabChange={handleTabChange}>
          <View className="flex-1 px-4 pt-4">
            <FlashList
              data={
                tabId == 'shares'
                  ? sharesOrdersForCurrentUser?.data
                  : apartmentsOrdersForCurrentUser?.data
              }
              estimatedItemSize={350}
              refreshing={
                sharesOrdersForCurrentUserLoading || apartmentsOrdersForCurrentUserLoading
              }
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
              ListEmptyComponent={<EmptyScreen />}
            />
          </View>
        </CustomTopTabs>
      </View>
    </SafeAreaView>
  );
};

export default MyOrders;
