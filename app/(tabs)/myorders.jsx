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
    title: 'طلبات الأسهم',
  },
  {
    id: 'apartments',
    title: 'طلبات العقارات',
  },
];

const OrderListItem = ({ parentId, type, item, onOrderDeleted }) => {
  const user = getSecureStoreNoAsync('user');

  const { deleteOrder, deleteOrderLoading } = useOrdersStore();

  const bottomSheetModalRef = useRef(null);

  const handleUnitPress = () => {
    router.push(`/(${type})/${item.id}`);
  };

  const onClose = () => {
    bottomSheetModalRef.current.dismiss();
  };

  const onDeleteConfirm = async () => {
    const isDone = await deleteOrder(parentId);
    console.log('isDone', isDone);
    if (isDone.success) {
      bottomSheetModalRef.current.dismiss();
      onOrderDeleted();
    }
  };
  return (
    <View className="mt-6 gap-8 px-4">
      <CustomBottomModalSheet
        backdropBehave="close"
        enablePanDownToClose={true}
        snapPoints={['20%']}
        bottomSheetModalRef={bottomSheetModalRef}
        handleSheetChanges={() => {}}
        handleDismissModalPress={() => {}}>
        <View className="h-full items-center justify-center">
          <Text className="mt-4 font-psemibold text-xl">هل أنت متأكد من إلغاء الطلب؟</Text>
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
      <TouchableOpacity
        activeOpacity={item.closed != 1 ? 0.8 : 1}
        onPress={item.closed != 1 ? handleUnitPress : null}
        className={`flex items-center gap-6 ${I18nManager.isRTL ? 'rtl-view ' : 'ltr-view'}`}>
        <View className="rounded-lg bg-gray-200">
          <Image source={{ uri: item?.sector?.cover?.img }} className="size-20 rounded-lg" />
        </View>
        <View className="flex-1">
          <Text className="font-psemibold text-lg">
            {item.region.name} - {item.transaction_type == 'sell' ? 'بيع' : 'شراء'}
          </Text>
          <Text className="mt-1 font-psemibold text-sm text-zinc-600">
            {item.sector.sector_name.name} - {item.sector.sector_name.code}
          </Text>
          <Text className="font-pmedium text-sm">السعر : {item.price}</Text>
          <Text className="font-pmedium text-sm">{item.owner_name}</Text>
        </View>
        <TouchableOpacity onPress={() => bottomSheetModalRef.current.present()}>
          <View className="flex size-12 items-center justify-center rounded-full bg-red-700 p-2 px-4">
            <Image source={icons.delete_icon} className="size-6 text-white" tintColor={'white'} />
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

  const [visible, setVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1">
      <CustomHeadWithBackButton title="المواعيد" handleButtonPress={() => router.back()} />

      <View className="flex-1">
        <CustomTopTabs topTabItems={topTabItems} onTabChange={handleTabChange}>
          <View className="relative flex-1 px-4 pt-4">
            {/* <DropdownMenu
              visible={visible}
              handleOpen={() => setVisible(true)}
              handleClose={() => setVisible(false)}
              trigger={
                <View>
                  <Text>Actions</Text>
                </View>
              }>
              <View>
                <Text>test</Text>
              </View>
            </DropdownMenu> */}
            <FlashList
              data={tabId == 'shares' ? sharesOrders : apartmentsOrders}
              estimatedItemSize={350}
              refreshing={sharesOrdersLoading || apartmentsOrdersLoading}
              onRefresh={handleRefresh}
              renderItem={({ item }) => (
                <OrderListItem
                  parentId={item.id}
                  type={tabId}
                  item={item.orderable}
                  onOrderDeleted={handleRefresh}
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
                    title="لترتيب موعد مع مالك أي عقار، افتح صفحة العقار واضغط على الزر الخاص بالتواصل مع فريق عقاري ومن ثم إختر “ترتيب موعد” ، سوف يقوم فريق عقاري بالتواصل معك لترتيب موعد مع مالك العقار.
و سوف تظهر جميع مواعيدك هنا بمجرد طلبها."
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
