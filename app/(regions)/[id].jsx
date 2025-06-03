import React, { useEffect, useRef, useState } from 'react';
import { I18nManager, Text, TouchableOpacity, View, Modal, ScrollView, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomePageHeader from '@/components/HomePageHeader';
import { router, useGlobalSearchParams } from 'expo-router';
import CustomTopTabs from '../../components/CustomTopTabs';
import { useUnitsStore } from '../../store/units.store';
import CustomButton from '@/components/CustomButton';
import { FlashList } from '@shopify/flash-list';
import UnitShareCard from '../../components/UnitCardShare';
import UnitApartmentCard from '../../components/UnitCardApartment';
import EmptyScreen from '@/components/EmptyScreen';
import { ActivityIndicator } from 'react-native-web';
import { Feather } from '@expo/vector-icons';

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

// Region With Id
const RegionWithId = () => {
  // Get Region Id
  const { id } = useGlobalSearchParams();
  
  console.log('Region ID from params:', id); // Debug log

  // Get All Shares and Apartments For Region
  const {
    getAllSharesForRegion,
    getAllSortedSharesForRegion,
    getAllApartmentsForRegion,
    getAllSortedApartmentsForRegion,
    sharesResponse,
    apartmentsResponse,
    sharesLoading,
    sharesRecords,
    apartmentsRecords,
    apartmentsLoading,
    clearSharesRecords,
    clearApartmentsRecords,
  } = useUnitsStore();

  // Get Shares Based On Region
  const filtersParams = useRef({
    page: 1,
  });
  
  // FlashList ref for scrolling to top
  const flashListRef = useRef(null);

  const getSharesBasedOnRegion = async (firstLoad = false) => {
    if (!id || id === 'myfavorites') {
      console.log('Invalid region ID, skipping API call:', id);
      return;
    }
    
    // Check if we have sorting parameters
    const hasSortingParams = filtersParams.current.sort_by || filtersParams.current.sort_direction || filtersParams.current.transaction_type || filtersParams.current.my_posts_first;
    
    if (hasSortingParams) {
      const shares = await getAllSortedSharesForRegion(id, filtersParams.current, firstLoad);
    } else {
      const shares = await getAllSharesForRegion(id, filtersParams.current, firstLoad);
    }
  };

  // Get Apartments Based On Region
  const getApartmentsBasedOnRegion = async (firstLoad = false) => {
    if (!id || id === 'myfavorites') {
      console.log('Invalid region ID, skipping API call:', id);
      return;
    }
    
    // Check if we have sorting parameters
    const hasSortingParams = filtersParams.current.sort_by || filtersParams.current.sort_direction || filtersParams.current.transaction_type || filtersParams.current.my_posts_first;
    
    if (hasSortingParams) {
      const apartments = await getAllSortedApartmentsForRegion(id, filtersParams.current, firstLoad);
    } else {
      const apartments = await getAllApartmentsForRegion(id, filtersParams.current, firstLoad);
    }
  };

  // Handle Tab Change
  const [tabId, setTabId] = useState('shares');
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [myPostsFirst, setMyPostsFirst] = useState('0');

  // Bottom Sheet Animation - Simplified
  const screenHeight = Dimensions.get('window').height;
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  // Show Bottom Sheet
  const showBottomSheet = () => {
    setShowSortModal(true);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Hide Bottom Sheet
  const hideBottomSheet = () => {
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowSortModal(false);
    });
  };
  
  const handleTabChange = (newTabId) => {
    const isSameTab = tabId === newTabId;
    
    filtersParams.current.page = 1;
    // Clear content when switching tabs
    clearSharesRecords();
    clearApartmentsRecords();
    // Clear sorting parameters
    filtersParams.current.sort_by = '';
    filtersParams.current.sort_direction = '';
    filtersParams.current.transaction_type = '';
    filtersParams.current.my_posts_first = '0';
    setSortBy('');
    setSortDirection('');
    setTransactionType('');
    setMyPostsFirst('0');
    setTabId(newTabId);
    
    // If it's the same tab (double tap), reload content immediately
    if (isSameTab) {
      if (newTabId === 'shares') {
        getSharesBasedOnRegion(true);
      } else {
        getApartmentsBasedOnRegion(true);
      }
    }
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

  // Sorting Options for Shares
  const sharesSortingOptions = [
    { label: 'منشوراتي أولاً', sortBy: '', sortDirection: '', transactionType: '', myPostsFirst: '1' },
    { label: 'الأعلى سعراً', sortBy: 'price', sortDirection: 'desc', transactionType: '' },
    { label: 'الأقل سعراً', sortBy: 'price', sortDirection: 'asc', transactionType: '' },
    { label: 'الأكثر مشاهدة', sortBy: 'views', sortDirection: 'desc', transactionType: '' },
    { label: 'الأقل مشاهدة', sortBy: 'views', sortDirection: 'asc', transactionType: '' },
    { label: 'الأكثر تفاعل', sortBy: 'reactions', sortDirection: 'desc', transactionType: '' },
    { label: 'الأقل تفاعل', sortBy: 'reactions', sortDirection: 'asc', transactionType: '' },
    { label: 'الأكثر عدد أسهم', sortBy: 'quantity', sortDirection: 'desc', transactionType: '' },
    { label: 'الأقل عدد أسهم', sortBy: 'quantity', sortDirection: 'asc', transactionType: '' },
    { label: 'عروض البيع أولاً', sortBy: '', sortDirection: '', transactionType: '1' },
    { label: 'إعلانات الشراء أولاً', sortBy: '', sortDirection: '', transactionType: '2' },
    { label: 'العروض الحديثة أولاً', sortBy: 'created_date', sortDirection: 'desc', transactionType: '' },
    { label: 'العروض القديمة أولاً', sortBy: 'created_date', sortDirection: 'asc', transactionType: '' },
     ];

  // Sorting Options for Apartments (without share-specific options)
  const apartmentsSortingOptions = [
    { label: 'منشوراتي أولاً', sortBy: '', sortDirection: '', transactionType: '', myPostsFirst: '1' },
    { label: 'الأعلى سعراً', sortBy: 'price', sortDirection: 'desc', transactionType: '' },
    { label: 'الأقل سعراً', sortBy: 'price', sortDirection: 'asc', transactionType: '' },
    { label: 'الأكثر مشاهدة', sortBy: 'views', sortDirection: 'desc', transactionType: '' },
    { label: 'الأقل مشاهدة', sortBy: 'views', sortDirection: 'asc', transactionType: '' },
    { label: 'الأكثر شعبية', sortBy: 'reactions', sortDirection: 'desc', transactionType: '' },
    { label: 'الأقل شعبية', sortBy: 'reactions', sortDirection: 'asc', transactionType: '' },
    { label: 'عروض البيع أولاً', sortBy: '', sortDirection: '', transactionType: '1' },
    { label: 'إعلانات الشراء أولاً', sortBy: '', sortDirection: '', transactionType: '2' },
    { label: 'العروض الحديثة أولاً', sortBy: 'created_date', sortDirection: 'desc', transactionType: '' },
    { label: 'العروض القديمة أولاً', sortBy: 'created_date', sortDirection: 'asc', transactionType: '' },
  
  ];

  // Get current sorting options based on active tab
  const getCurrentSortingOptions = () => {
    return tabId === 'shares' ? sharesSortingOptions : apartmentsSortingOptions;
  };

  // Handle Sort Selection
  const handleSortSelection = (option) => {
    setSortBy(option.sortBy);
    setSortDirection(option.sortDirection);
    setTransactionType(option.transactionType);
    setMyPostsFirst(option.myPostsFirst || '0');
    hideBottomSheet();
    
    // Apply sorting
    filtersParams.current.page = 1;
    filtersParams.current.sort_by = option.sortBy;
    filtersParams.current.sort_direction = option.sortDirection;
    filtersParams.current.transaction_type = option.transactionType;
    filtersParams.current.my_posts_first = option.myPostsFirst || '0';
    
    if (tabId === 'shares') {
      getSharesBasedOnRegion(true);
    } else {
      getApartmentsBasedOnRegion(true);
    }
    
    // Scroll to top after a brief delay to ensure data is loaded
    setTimeout(() => {
      if (flashListRef.current) {
        flashListRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    }, 100);
  };

  // Clear filters and reload default data
  const clearFiltersAndReload = () => {
    // Reset filter parameters
    filtersParams.current.page = 1;
    filtersParams.current.sort_by = '';
    filtersParams.current.sort_direction = '';
    filtersParams.current.transaction_type = '';
    filtersParams.current.my_posts_first = '0';
    
    // Reset state variables
    setSortBy('');
    setSortDirection('');
    setTransactionType('');
    setMyPostsFirst('0');
    
    // Hide bottom sheet
    hideBottomSheet();
    
    // Reload data without filters using normal APIs
    if (tabId === 'shares') {
      getAllSharesForRegion(id, filtersParams.current, true);
    } else {
      getAllApartmentsForRegion(id, filtersParams.current, true);
    }
    
    // Scroll to top after clearing filters
    setTimeout(() => {
      if (flashListRef.current) {
        flashListRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    }, 100);
  };

  const topTabAction = useRef({
    title: tabId == 'share' ? 'أضف إعلانك الأن' : 'أضف إعلانك الأن',
  });

  // Get Shares and Apartments Based On Region UseEffect
  useEffect(() => {
    // Only proceed if we have a valid numeric ID
    if (!id || id === 'myfavorites' || isNaN(parseInt(id))) {
      console.log('Skipping API calls for invalid region ID:', id);
      return;
    }
    
    // Only load data if we don't already have records loaded
    const hasSharesData = sharesRecords && sharesRecords.length > 0;
    const hasApartmentsData = apartmentsRecords && apartmentsRecords.length > 0;
    
    filtersParams.current.page = 1;
    
    // Only load shares if we don't have data already
    if (!hasSharesData) {
      getSharesBasedOnRegion(true);
    }
    
    // Only load apartments if we don't have data already
    if (!hasApartmentsData) {
      getApartmentsBasedOnRegion(true);
    }
  }, [tabId, id]); // Add id as dependency

  return (
    <SafeAreaView className="flex-1 bg-white">
      <HomePageHeader hasActions={true} customActions={true}>
        <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} items-center gap-2`}>
          <View className="mt-2 flex-row items-center">
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/search',
                })
              }
              className="flex-row items-center rounded-full p-2">
              <Feather name="search" size={20} color="#a47764" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => showBottomSheet()}
              className="flex-row items-center rounded-full p-2 ml-2">
              <Feather name="filter" size={20} color="#a47764" />
            </TouchableOpacity>
          </View>
          <CustomButton
            containerStyles={'mt-3'}
            hasGradient={true}
            colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
            title={tabId == 'shares' ? 'أضف إعلانك الأن' : 'أضف إعلانك الأن'}
            positionOfGradient={'leftToRight'}
            textStyles={'text-white text-sm'}
            handleButtonPress={() => {
              router.push(`/(create)/${tabId}`);
            }}
          />
        </View>
      </HomePageHeader>
      <View className="flex-1">
        <CustomTopTabs topTabItems={topTabItems} onTabChange={handleTabChange}>
          <View className="flex-1 px-4 pt-4">
            <FlashList
              ref={flashListRef}
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
              ListEmptyComponent={() =>
                sharesLoading || apartmentsLoading ? (
                  <Text />
                ) : (
                  <EmptyScreen title="لا يوجد عروض للبيع أو للشراء" />
                )
              }
            />
          </View>
        </CustomTopTabs>
      </View>
      
      {/* Sort Bottom Sheet */}
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => hideBottomSheet()}>
        <View className="flex-1">
          {/* Backdrop */}
          <TouchableOpacity 
            className="flex-1 bg-black/50"
            activeOpacity={1}
            onPress={() => hideBottomSheet()}
          />
          
          {/* Bottom Sheet */}
          <Animated.View
            style={{
              transform: [{ translateY }],
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: screenHeight * 0.8,
            }}
            className="bg-white rounded-t-3xl">
            
            {/* Force RTL container */}
            <View className="p-6">
              {/* Drag Handle */}
              <View className="items-center mb-4">
                <View className="w-12 h-1 bg-gray-300 rounded-full" />
              </View>
              
              {/* Title */}
              <Text className="text-xl font-pbold text-center mb-6 text-gray-800">
                {tabId === 'shares' ? 'ترتيب الأسهم حسب' : 'ترتيب العقارات حسب'}
              </Text>
              
              {/* Options List */}
              <ScrollView 
                className="mb-4" 
                style={{ maxHeight: screenHeight * 0.5 }}
                showsVerticalScrollIndicator={false}>
                {getCurrentSortingOptions().map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleSortSelection(option)}
                    className="py-4 border-b border-gray-100">
                    <Text className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} text-base font-pregular text-gray-700`}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              {/* Cancel Button */}
              <TouchableOpacity
                onPress={() => clearFiltersAndReload()}
                className="py-3 bg-gray-100 rounded-lg">
                <Text className="text-center text-gray-600 font-pmedium">
                  إلغاء الترتيب
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default RegionWithId;
