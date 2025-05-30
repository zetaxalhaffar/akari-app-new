import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, I18nManager, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeadWithBackButton from '@/components/CustomHeadWithBackButton';
import { router } from 'expo-router';
import CustomTopTabs from '../components/CustomTopTabs';
import { FlashList } from '@shopify/flash-list';
import { useFavoriteStore } from '../store/favorite.store';
import icons from '@/constants/icons';
import EmptyScreen from '../components/EmptyScreen';
import CustomButton from '@/components/CustomButton';
import CustomBottomModalSheet from '@/components/CustomBottomModalSheet';
import { getSecureStoreNoAsync } from '@/composables/secure.store';

// Top Tab Items
const topTabItems = [
  {
    id: 'share',
    title: 'الأسهم المفضلة',
  },
  {
    id: 'apartment',
    title: 'العقارات المفضلة',
  },
];

const FavoriteListItem = ({ parentId, type, item, onFavoriteDeleted }) => {
  const user = getSecureStoreNoAsync('user');

  const { removeFavorite, removeFavoriteLoading } = useFavoriteStore();

  const bottomSheetModalRef = useRef(null);

  const handleUnitPress = () => {
    if (type === 'share') {
      router.push(`/(shares)/${item.id}`);
    } else {
      router.push(`/(apartments)/${item.id}`);
    }
  };

  const onClose = () => {
    bottomSheetModalRef.current.dismiss();
  };

  const onDeleteConfirm = async () => {
    const isDone = await removeFavorite(type, item.id);
    console.log('isDone', isDone);
    if (isDone) {
      bottomSheetModalRef.current.dismiss();
      onFavoriteDeleted();
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
          <Text className="mt-4 font-psemibold text-xl">هل أنت متأكد ؟</Text>
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
              loading={removeFavoriteLoading}
            />
          </View>
        </View>
      </CustomBottomModalSheet>
      <TouchableOpacity
        activeOpacity={item.closed != 1 ? 0.8 : 1}
        onPress={item.closed != 1 ? handleUnitPress : null}
        className={`flex items-center gap-6 ${I18nManager.isRTL ? 'rtl-view ' : 'ltr-view'}`}>
        <View className="flex-1 ">

                <View className="flex-1">
                          <Text className="font-psemibold text-lg" style={{ textAlign: I18nManager.isRTL ? 'left' : 'right' }}>
                            {item.region.name} - {item.transaction_type == 'sell' ? 'بيع' : 'شراء'}
                          </Text>

                          <Text className="mt-1 font-psemibold text-sm text-zinc-600" style={{ textAlign: I18nManager.isRTL ? 'left' : 'right' }}>
                            {item.sector.code}
                          </Text>
                </View>

                <View className="flex-1">
                          <Text className="font-pmedium text-sm" style={{ textAlign: I18nManager.isRTL ? 'left' : 'right' }}>
                            {type === 'share' ? `السعر : ${item.price}` : `سعر العقار : ${item.price}`}
                          </Text>
                          {type === 'share' && item.quantity && (
                            <Text className="font-pmedium text-sm" style={{ textAlign: I18nManager.isRTL ? 'left' : 'right' }}>الأسهم المطروحة : {item.quantity}</Text>
                          )}
                </View>

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

const MyFavorites = () => {
  // Get Favorites Based On Type
  const filtersParams = useRef({
    page: 1,
  });

  // call favorite store
  const {
    favoritesListResponse,
    favoritesListLoading,
    getFavoritesList,
  } = useFavoriteStore();

  const [sharesFavorites, setSharesFavorites] = useState([]);
  const [apartmentsFavorites, setApartmentsFavorites] = useState([]);
  const [hasMoreShares, setHasMoreShares] = useState(true);
  const [hasMoreApartments, setHasMoreApartments] = useState(true);
  const [currentPageShares, setCurrentPageShares] = useState(1);
  const [currentPageApartments, setCurrentPageApartments] = useState(1);

  const getFavoritesData = async (type = 'all', isFirstLoad = false) => {
    const currentPage = type === 'share' ? currentPageShares : 
                       type === 'apartment' ? currentPageApartments : 1;
    
    const response = await getFavoritesList(type, isFirstLoad ? 1 : currentPage);
    if (response && response.data) {
      const favorites = response.data.data || [];
      const hasMore = response.data.next_page_url !== null;
      const newPage = response.data.current_page + 1;
      
      if (type === 'share') {
        if (isFirstLoad) {
          setSharesFavorites(favorites);
        } else {
          setSharesFavorites(prev => [...prev, ...favorites]);
        }
        setHasMoreShares(hasMore);
        setCurrentPageShares(newPage);
      } else if (type === 'apartment') {
        if (isFirstLoad) {
          setApartmentsFavorites(favorites);
        } else {
          setApartmentsFavorites(prev => [...prev, ...favorites]);
        }
        setHasMoreApartments(hasMore);
        setCurrentPageApartments(newPage);
      } else {
        // Filter by type when getting all
        const shares = favorites.filter(fav => fav.favoritable_type === 'App\\Models\\Share');
        const apartments = favorites.filter(fav => fav.favoritable_type === 'App\\Models\\Apartment');
        
        if (isFirstLoad) {
          setSharesFavorites(shares);
          setApartmentsFavorites(apartments);
        } else {
          setSharesFavorites(prev => [...prev, ...shares]);
          setApartmentsFavorites(prev => [...prev, ...apartments]);
        }
        setHasMoreShares(hasMore);
        setHasMoreApartments(hasMore);
        setCurrentPageShares(newPage);
        setCurrentPageApartments(newPage);
      }
    }
    console.log('sharesFavorites', sharesFavorites.length);
    console.log('apartmentsFavorites', apartmentsFavorites.length);
  };

  // Handle Tab Change
  const [tabId, setTabId] = useState('share');
  const handleTabChange = (tabId) => {
    setTabId(tabId);
  };

  const handleRefresh = () => {
    setCurrentPageShares(1);
    setCurrentPageApartments(1);
    setHasMoreShares(true);
    setHasMoreApartments(true);
    getFavoritesData('all', true);
  };

  const loadMoreData = () => {
    const hasMore = tabId === 'share' ? hasMoreShares : hasMoreApartments;
    if (!favoritesListLoading && hasMore) {
      getFavoritesData(tabId, false);
    }
  };

  useEffect(() => {
    filtersParams.current.page = 1;
    getFavoritesData('all', true);
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <CustomHeadWithBackButton title="المفضلة" handleButtonPress={() => router.back()} />

      <View className="flex-1">
        <CustomTopTabs topTabItems={topTabItems} onTabChange={handleTabChange}>
          <View className="relative flex-1 px-4 pt-4">
            <FlashList
              data={tabId == 'share' ? sharesFavorites : apartmentsFavorites}
              estimatedItemSize={350}
              refreshing={favoritesListLoading}
              onRefresh={handleRefresh}
              renderItem={({ item }) => (
                <FavoriteListItem
                  parentId={item.id}
                  type={tabId}
                  item={item.favoritable}
                  onFavoriteDeleted={handleRefresh}
                />
              )}
              onEndReached={loadMoreData}
              onEndReachedThreshold={0.5}
              ListEmptyComponent={() =>
                favoritesListLoading ? (
                  <Text />
                ) : (
                  <EmptyScreen
                    img={''}
                    mainTitle="لم تقم بإضافة أي عنصر للمفضلة حتى الآن"
                    title="لإضافة أي عقار أو سهم للمفضلة، افتح صفحة العقار أو السهم واضغط على أيقونة النجمة. سوف تظهر جميع العناصر المفضلة لديك هنا."
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

export default MyFavorites; 