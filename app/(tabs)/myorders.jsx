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
import CustomButton from '@/components/CustomButton';
import UnitShareCard from '../../components/UnitCardShare';
import UnitApartmentCard from '../../components/UnitCardApartment';

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
      <CustomHeadWithBackButton title="المواعيد" handleButtonPress={() => router.back()} />
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
