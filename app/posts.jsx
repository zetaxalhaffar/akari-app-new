import { FlashList } from '@shopify/flash-list';
import { router, useGlobalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import UnitApartmentCard from '../components/UnitCardApartment';
import UnitShareCard from '../components/UnitCardShare';

import CustomButton from '@/components/CustomButton';
import CustomHeadWithBackButton from '@/components/CustomHeadWithBackButton';
import CustomTopTabs from '@/components/CustomTopTabs';
import EmptyScreen from '@/components/EmptyScreen';
import { useOrdersStore } from '@/store/orders.store';

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
  const { tab } = useGlobalSearchParams(); // 'shares' or 'apartments'

  // Filters Ref
  const filtersParams = useRef({
    page: 1,
  });

  const [tabId, setTabId] = useState('buy');


  // Order Store
  const {
    apartmentsOrdersForCurrentUser,
    getApartmentsOrdersForCurrentUser,
    apartmentsOrdersForCurrentUserLoading,
    getSharesOrdersForCurrentUser,
    sharesOrdersForCurrentUserLoading,
    sharesOrdersForCurrentUser,
  } = useOrdersStore();

  // Data Fetching Functions
  const getSharesOrdersData = async (isFirstLoad = false) => {
    console.log('Fetching shares orders for tab:', tabId, 'page:', filtersParams.current.page);
    await getSharesOrdersForCurrentUser(tabId, filtersParams.current, isFirstLoad);
  };

  const getApartmentsOrdersData = async (isFirstLoad = false) => {
    console.log('Fetching apartments orders for tab:', tabId, 'page:', filtersParams.current.page);
    await getApartmentsOrdersForCurrentUser(tabId, filtersParams.current, isFirstLoad);
  };

  // Handle Tab Change (Buy/Sell)
  const handleTabChange = (newTabId) => {
    filtersParams.current.page = 1; // Reset page on tab change
    setTabId(newTabId);
  };

  // Initial data fetch and fetch on tabId change
  useEffect(() => {
    filtersParams.current.page = 1; // Reset page when tabId changes
    if (tab === 'shares') {
      getSharesOrdersData(true);
    } else if (tab === 'apartments') {
      getApartmentsOrdersData(true);
    }
  }, [tabId, tab]); // Add 'tab' dependency

  // Handle Refresh
  const handleRefresh = () => {
    filtersParams.current.page = 1; // Reset page on refresh
    if (tab === 'shares') {
      getSharesOrdersData(true);
    } else {
      getApartmentsOrdersData(true);
    }
  };

  // Handle Add Button Press
  const handleButtonPress = () => {
    // Determine the correct creation path based on the main tab ('shares' or 'apartments')
    const createPath = tab === 'shares' ? '/(create)/shares' : '/(create)/apartments';
    // You might need to adjust the actual route names based on your file structure
    router.push(createPath);
  };

  // Handle End Reached for Pagination
  const handleEndReached = () => {
    if (tab == 'shares') {
      if (sharesOrdersForCurrentUser?.next_page_url && !sharesOrdersForCurrentUserLoading) {
        filtersParams.current.page++;
        getSharesOrdersData();
      }
    } else if (tab == 'apartments') {
      if (apartmentsOrdersForCurrentUser?.next_page_url && !apartmentsOrdersForCurrentUserLoading) {
        filtersParams.current.page++;
        getApartmentsOrdersData();
      }
    }
  };

  const isLoading =
    tab == 'shares' ? sharesOrdersForCurrentUserLoading : apartmentsOrdersForCurrentUserLoading;
  const data =
    tab == 'shares' ? sharesOrdersForCurrentUser?.data : apartmentsOrdersForCurrentUser?.data;

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-row items-center justify-between pe-4">
        <CustomHeadWithBackButton
          title={`${tab === 'shares' ? 'طلبات الأسهم التنظيمية' : 'طلبات العقارات'}`}
          handleButtonPress={() => router.back()}
        />
        <CustomButton
          hasGradient
          colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
          title="إضافة طلب"
          positionOfGradient="leftToRight"
          textStyles="text-white text-sm pt-1"
          handleButtonPress={handleButtonPress} // Updated handler
        />
      </View>
      <View className="flex-1">
        <CustomTopTabs
          defaultActiveTab="buy" // Changed default to 'sell' as per initial state
          topTabItems={topTabItems}
          onTabChange={handleTabChange}>
          <View className="flex-1 px-4 pt-4">
            <FlashList
              data={data}
              keyExtractor={(item) => item.id.toString()} // Added keyExtractor
              estimatedItemSize={350} // Adjust if needed
              refreshing={isLoading}
              onRefresh={handleRefresh}
              renderItem={({ item }) =>
                tab === 'shares' ? <UnitShareCard item={item} /> : <UnitApartmentCard item={item} />
              }
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={() =>
                isLoading ? (
                  <Text /> // Or a loading indicator
                ) : (
                  <EmptyScreen title="لا يوجد طلبات" />
                )
              }
            />
          </View>
        </CustomTopTabs>
      </View>
    </SafeAreaView>
  );
};

export default MyOrders;
