import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomePageHeader from '@/components/HomePageHeader';
import { useRegionsStore } from '@/store/regions.store';
import CustomTopTabs from '../../components/CustomTopTabs';
import { useSectoresStore } from '../../store/sectores.store';
import { FlashList } from '@shopify/flash-list';
import icons from '@/constants/icons';
import { ScrollView, Dimensions, I18nManager } from 'react-native';
import CustomBottomModalSheet from '@/components/CustomBottomModalSheet';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';

const SectorImageCarousel = ({ photos, height = 300, onImagePress }) => {
  const { width } = Dimensions.get('window');
  const scrollViewRef = useRef(null);
  const [active, setActive] = useState(0);
  
  const onScrollChange = ({ nativeEvent }) => {
    const slide = Math.round(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
    if (slide !== active) {
      setActive(slide);
    }
  };

  const scrollToImage = (index) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * (width - 32),
        animated: true,
      });
      setActive(index);
    }
  };

  if (!photos || photos.length === 0) {
    return (
      <View style={{ height }} className="items-center justify-center bg-gray-200 rounded-lg">
        <Text className="text-gray-500">لا توجد صور</Text>
      </View>
    );
  }

  return (
    <View className="relative">
      <View className="overflow-hidden rounded-lg">
        <ScrollView
          ref={scrollViewRef}
          pagingEnabled
          horizontal
          onScroll={onScrollChange}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          style={{ height }}
          decelerationRate="fast"
          snapToInterval={width - 32}
          snapToAlignment="start">
          {photos.map((photo, index) => (
            <TouchableOpacity
              key={index}
              onPress={onImagePress}
              activeOpacity={0.9}
              style={{ width: width - 32, height }}>
              <Image
                source={{ uri: photo }}
                style={{ width: width - 32, height }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {photos.length > 1 && (
        <View 
          className="absolute left-0 right-0 flex-row justify-center gap-2"
          style={{ bottom: -28 }}>
          {photos.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => scrollToImage(index)}
              className={`h-5 w-5 items-center justify-center rounded-full border-4 border-toast-300 ${
                index === active ? 'bg-white' : 'bg-toast-300'
              }`}>
              <View
                className={`h-3 w-3 rounded-full ${
                  index === active ? 'bg-toast-500' : ''
                }`}
                style={index === active ? {} : { backgroundColor: '#bda28c' }}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const SectorsScreen = () => {
  const { regionResponse, getRegions } = useRegionsStore();
  const { getSectors, sectorsResponse, sectorsLoading, sectorsRecords } = useSectoresStore();

  const filtersParams = useRef({
    page: 1,
  });

  const [sectoreSection, setSectoreSection] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);
  const bottomSheetModalRef = useRef(null);

  const getSectorsList = async (region_id, firstLoad = false) => {
    const sectoreList = await getSectors(region_id, filtersParams.current, firstLoad);
    if (firstLoad && sectoreList?.data) {
      const sectorsTypesSelection = [];
      sectoreList.data.forEach((sector, index) => {
        sectorsTypesSelection.push({
          id: index.toString(),
          name: sector.key,
        });
      });
      setSectoreSection(sectorsTypesSelection);
      // Reset sector tab to first tab when loading new region data
      setSectorTabId('0');
    }
  };

  const getRegionsList = async () => {
    const response = await getRegions();
    if (response.length > 0) {
      // Set the first region as default tab
      const firstRegionId = response[0].id;
      setTabId(firstRegionId);
      filtersParams.current.page = 1;
      getSectorsList(firstRegionId, true);
    }
  };

  // Handle Tab Change
  const [tabId, setTabId] = useState(null);
  const handleTabChange = (tabId) => {
    setTabId(tabId);
    filtersParams.current.page = 1;
    // Clear sector section when changing region (sector tab will be reset in getSectorsList)
    setSectoreSection([]);
    getSectorsList(tabId, true);
  };

  const [sectorTabId, setSectorTabId] = useState('0');
  const handleTabChangeForSector = (tabId) => {
    setSectorTabId(tabId);
    // Clear selected sector when changing sector tabs
    setSelectedSector(null);
  };

  // Handle End Reached for pagination
  const handleEndReached = () => {
    if (sectorsResponse.next_page_url) {
      filtersParams.current.page++;
      getSectorsList(tabId, false);
    }
  };

  // Handle Refresh
  const handleRefresh = () => {
    filtersParams.current.page = 1;
    getSectorsList(tabId, true);
  };

  useEffect(() => {
    getRegionsList();
  }, []);

  // Get current sector data based on selected tab
  const getCurrentSectorData = () => {
    if (!sectorsRecords || !sectorsRecords[parseInt(sectorTabId)]) {
      return [];
    }
    return sectorsRecords[parseInt(sectorTabId)].code || [];
  };

  // Handle sector card press
  const handleSectorPress = (item) => {
    setSelectedSector(item);
    bottomSheetModalRef.current?.present();
  };

  // Handle navigation to search results
  const handleNavigateToSearch = (type) => {
    if (!selectedSector) return;
    
    console.log('Selected sector data:', JSON.stringify(selectedSector, null, 2));
    
    const searchParams = {
      currentType: type,
      region_id: tabId.toString(),
      sector_id: selectedSector.id.toString(),
      sectoreType: sectorTabId,
      id: '',
      price_operator: '=',
      price: '',
      owner_name: '',
      apartment_type_id: '',
      direction_id: '',
      apartment_status_id: '',
      area: '',
      floor: '',
      rooms_count: '',
      salons_count: '',
      balcony_count: '',
      is_taras: '0',
    };

    console.log('Navigating to SearchResults with params:', JSON.stringify(searchParams, null, 2));
    
    router.push({
      pathname: '/SearchResults',
      params: searchParams,
    });
    
    bottomSheetModalRef.current?.dismiss();
  };

  return (
    <SafeAreaView className="flex-1 ">
      <HomePageHeader hasActions={false} />
      {regionResponse && (
        <View className="flex-1">
          <CustomTopTabs
            topTabItems={regionResponse}
            onTabChange={handleTabChange}
            defaultActiveTab={tabId}
            itemTitle="name">
            <View className="flex-1 px-4 pt-4">
              <CustomTopTabs
                topTabItems={sectoreSection}
                onTabChange={handleTabChangeForSector}
                defaultActiveTab={sectorTabId}
                itemTitle="name">
                <View className="flex-1 px-4 pt-4">
                  <FlashList
                    data={getCurrentSectorData()}
                    estimatedItemSize={350}
                    refreshing={sectorsLoading}
                    onRefresh={handleRefresh}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    renderItem={({ item }) => (
                      <View className="my-2 mb-8 rounded-lg border border-toast-200">
                        <View className="relative">
                          <SectorImageCarousel
                            photos={item.sector_photos?.map(photo => photo) || []}
                            onImagePress={() => handleSectorPress(item)}
                          />
                        </View>
                        <TouchableOpacity 
                          onPress={() => handleSectorPress(item)}
                          activeOpacity={0.8}
                          className="absolute inset-0 bottom-0 w-full rounded-lg bg-toast-900/90 p-4 backdrop-blur-sm">
                          <Text className="font-psemibold text-xl text-white">
                            المقسم رقم {item?.code}
                          </Text>
                          <View className="flex-row flex-wrap items-center gap-1">
                            <View className="flex-row items-center gap-1">
                              <Image
                                source={icons.building_1}
                                className={'h-6 w-6'}
                                tintColor={'#FFF'}
                                resizeMode="contain"
                              />
                              <Text className="font-pmedium text-sm text-white">
                                العقارات المتاحة ضمن القسم : {item.apartment_count}
                              </Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                              <Image
                                source={icons.quantity}
                                className={'h-6 w-6'}
                                tintColor={'#FFF'}
                                resizeMode="contain"
                              />
                              <Text className="font-pmedium text-sm text-white">
                                الأسهم التنظيمية المتاحة ضمن المقسم : {item?.share_count}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.5}
                  />
                </View>
              </CustomTopTabs>
            </View>
          </CustomTopTabs>
        </View>
      )}

      <CustomBottomModalSheet
        backdropBehave="close"
        enablePanDownToClose={true}
        bottomSheetModalRef={bottomSheetModalRef}
        handleSheetChanges={() => {}}
        snapPoints={['35%']}
        handleDismissModalPress={() => {}}>
        <View className="p-6 pb-12">
          <Text className="mb-6 text-center font-psemibold text-lg">
            المقسم رقم {selectedSector?.code}
          </Text>
          <View className="gap-4 mb-8">
            {selectedSector?.apartment_count > 0 && (
              <CustomButton
                hasGradient={true}
                colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
                title={`عرض العقارات المتاحة في المقسم (${selectedSector?.apartment_count})`}
                containerStyles={'w-full'}
                positionOfGradient={'leftToRight'}
                textStyles={'text-white text-center'}
                buttonStyles={'h-[50px]'}
                handleButtonPress={() => handleNavigateToSearch('apartment')}
                loading={false}
              />
            )}
            {selectedSector?.share_count > 0 && (
              <CustomButton
                hasGradient={true}
                colors={['#314158', '#62748E', '#90A1B9', '#90A1B9', '#90A1B9']}
                title={`عرض الأسهم المتاحة في المقسم (${selectedSector?.share_count})`}
                containerStyles={'w-full'}
                positionOfGradient={'leftToRight'}
                textStyles={'text-white text-center'}
                buttonStyles={'h-[50px]'}
                handleButtonPress={() => handleNavigateToSearch('share')}
                loading={false}
              />
            )}
            {(!selectedSector?.apartment_count || selectedSector?.apartment_count === 0) && 
             (!selectedSector?.share_count || selectedSector?.share_count === 0) && (
              <Text className="text-center font-pmedium text-gray-500">
                لا توجد عقارات أو أسهم متاحة في هذا المقسم
              </Text>
            )}
          </View>
        </View>
      </CustomBottomModalSheet>
    </SafeAreaView>
  );
};

export default SectorsScreen;
