import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, I18nManager, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeadWithBackButton from '@/components/CustomHeadWithBackButton';
import { router } from 'expo-router';
import CustomTopTabs from '../../components/CustomTopTabs';
import { FlashList } from '@shopify/flash-list';
import { useOrdersStore } from '../../store/orders.store';
import icons from '@/constants/icons';
import EmptyScreen from '../../components/EmptyScreen';
import CustomButton from '@/components/CustomButton';
import CustomBottomModalSheet from '@/components/CustomBottomModalSheet';
import { getSecureStoreNoAsync } from '@/composables/secure.store';

// Top Tab Items
const topTabItems = [
  {
    id: 'shares',
    title: 'إعلانات الأسهم',
  },
  {
    id: 'apartments',
    title: 'إعلانات العقارات',
  },
];

const OrderListItem = ({ parentId, type, item, onOrderDeleted, onDeletePress }) => {
  const handleUnitPress = () => {
    console.log('Item pressed:', item.id, 'Type:', type);
    router.push(`/(${type})/${item.id}`);
  };

  const handleDeletePress = () => {
    console.log('Delete button pressed for item:', parentId);
    onDeletePress(parentId);
  };

  return (
    <View className="mb-4 px-4">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleUnitPress}
        className={`flex-row items-center py-3 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
        
        <View className="rounded-lg bg-gray-200 mr-4">
          <Image 
            source={{ uri: item?.sector?.cover?.img }} 
            className="size-20 rounded-lg"
          />
        </View>
        
        <View className="flex-1">
          <Text className="font-psemibold text-lg text-gray-900 mb-1">
            {item.region.name} - {item.transaction_type == 'sell' ? 'بيع' : 'شراء'}
          </Text>
          <Text className="font-psemibold text-sm text-zinc-600 mb-1">
            {item.sector.sector_name.name} - {item.sector.sector_name.code}
          </Text>
          <Text className="font-pmedium text-sm text-gray-700">السعر : {item.price}</Text>
        </View>
        
        <TouchableOpacity
          onPress={handleDeletePress}
          className="ml-3">
          <View className="flex size-12 items-center justify-center rounded-full bg-red-700">
            <Image source={icons.delete_icon} className="size-6" tintColor={'white'} />
          </View>
        </TouchableOpacity>
        
      </TouchableOpacity>
      
      <View className="h-[1px] bg-gray-200" />
    </View>
  );
};

const MyOrders = () => {
  // Get Shares Based On Region
  const filtersParams = useRef({
    page: 1,
  });
  
  // Add state for delete modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const bottomSheetModalRef = useRef(null);
  
  // call order store
  const {
    sharesOrders,
    sharesOrdersLoading,
    getSharesOrders,
    getApartmentsOrders,
    apartmentsOrders,
    apartmentsOrdersLoading,
    deleteOrder,
    deleteOrderLoading,
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

  const handleDeletePress = (orderId) => {
    setSelectedOrderId(orderId);
    bottomSheetModalRef.current.present();
  };

  const onClose = () => {
    bottomSheetModalRef.current.dismiss();
    setSelectedOrderId(null);
  };

  const onDeleteConfirm = async () => {
    if (selectedOrderId) {
      const isDone = await deleteOrder(selectedOrderId);
      console.log('isDone', isDone);
      if (isDone.success) {
        bottomSheetModalRef.current.dismiss();
        setSelectedOrderId(null);
        handleRefresh();
      }
    }
  };

  useEffect(() => {
    filtersParams.current.page = 1;
    getSharesOrdersData(true);
    getApartmentsOrdersData(true);
  }, [tabId]);

  const [visible, setVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1">
      <CustomHeadWithBackButton title="المواعيد" handleButtonPress={() => router.back()} />

      <CustomBottomModalSheet
        backdropBehave="close"
        enablePanDownToClose={true}
        snapPoints={['20%']}
        bottomSheetModalRef={bottomSheetModalRef}
        handleSheetChanges={() => {}}
        handleDismissModalPress={() => {}}>
        <View className="h-full items-center justify-center">
          <Text className="mt-4 font-psemibold text-xl">هل أنت متأكد من إلغاء الموعد؟</Text>
          <View
            className={`m-4 flex items-center justify-center gap-2 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
            <CustomButton
              hasGradient={false}
              title={'الغاء'}
              containerStyles={'flex-grow'}
              positionOfGradient={'leftToRight'}
              textStyles={'text-black'}
              buttonStyles={'h-[45px]'}
              handleButtonPress={onClose}
            />
            <CustomButton
              hasGradient={false}
              title={'تأكيد'}
              containerStyles={'flex-grow'}
              positionOfGradient={'leftToRight'}
              textStyles={'text-white'}
              buttonStyles={'h-[45px] bg-red-800'}
              handleButtonPress={onDeleteConfirm}
              loading={deleteOrderLoading}
            />
          </View>
        </View>
      </CustomBottomModalSheet>

      <View className="flex-1">
        <CustomTopTabs topTabItems={topTabItems} onTabChange={handleTabChange}>
          <View className="relative flex-1 px-4 pt-4">
            <FlashList
              data={tabId == 'shares' ? sharesOrders : apartmentsOrders}
              estimatedItemSize={100}
              refreshing={sharesOrdersLoading || apartmentsOrdersLoading}
              onRefresh={handleRefresh}
              renderItem={({ item }) => (
                <OrderListItem
                  parentId={item.id}
                  type={tabId}
                  item={item.orderable}
                  onOrderDeleted={handleRefresh}
                  onDeletePress={handleDeletePress}
                />
              )}
              onEndReached={() => {}}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={() =>
                sharesOrdersLoading || apartmentsOrdersLoading ? (
                  <Text />
                ) : (
                  <EmptyScreen
                    img={''}
                    mainTitle="لم تقم بترتيب مواعيد حتى الآن"
                    title={`لترتيب موعد مع مالك أي عقار، افتح صفحة العقار واضغط على الزر الخاص بالتواصل مع فريق عقاري ومن ثم إختر "ترتيب موعد" ، سوف يقوم فريق عقاري بالتواصل معك لترتيب موعد مع مالك العقار.
و سوف تظهر جميع مواعيدك هنا بمجرد طلبها.`}
                  />
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
