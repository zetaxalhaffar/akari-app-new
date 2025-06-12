import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomePageHeader from '@/components/HomePageHeader';
import { useRegionsStore } from '@/store/regions.store';
import CustomTopTabs from '../../components/CustomTopTabs';
import { useSectoresStore } from '../../store/sectores.store';
import { FlashList } from '@shopify/flash-list';
import icons from '@/constants/icons';
import { ScrollView, Dimensions, I18nManager } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import CustomBottomModalSheet from '@/components/CustomBottomModalSheet';
import CustomButton from '@/components/CustomButton';
import { router, useFocusEffect } from 'expo-router';
import { BackHandler } from 'react-native';

const InfoRow = ({ label, value, unit = '' }) => {
  if (!value || value === 0 || value === '0' || String(value).trim().length === 0) return null;
  return (
    <View className="mb-4 border-b border-gray-200 pb-2">
      <View className="flex-row-reverse justify-between items-center">
        <Text className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} text-base font-pmedium text-toast-900`}>{value}{unit}</Text>
        <Text className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} text-base font-psemibold text-gray-700`}>{label}</Text>
      </View>
    </View>
  );
};

const DescriptionRow = ({ label, value }) => {
    if (!value || !value.trim()) return null;
    return (
        <View className="mb-4 border-b border-gray-200 pb-2">
            <Text className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mb-2 text-base font-psemibold text-gray-700`}>{label}</Text>
            <Text className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} text-base font-pmedium text-toast-900`}>{value}</Text>
        </View>
    );
};

const InfoListRow = ({ label, items, listKey }) => {
    if (!items || items.length === 0 || (items.length === 1 && items[0].trim() === '')) return null;
    
    const [showAll, setShowAll] = useState(false);
    const displayedItems = showAll ? items : items.slice(0, 3);

    return (
        <View className="mb-4 border-b border-gray-200 pb-2">
            <Text className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mb-2 text-base font-psemibold text-gray-700`}>{label}</Text>
            <View className="gap-1 pr-2">
                {displayedItems.map((item, index) => (
                    <Text key={`${listKey}-${index}`} className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} text-base font-pmedium text-toast-900`}>{item.trim()}</Text>
                ))}
            </View>
            {items.length > 3 && (
                <TouchableOpacity onPress={() => setShowAll(!showAll)} className="mt-2 items-end">
                    <Text className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} text-base font-psemibold text-blue-500`}>
                        {showAll ? 'عرض أقل' : `عرض الكل (${items.length})`}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const SectorImageCarousel = ({ photos, height = 300, onImagePress }) => {
  const { width } = Dimensions.get('window');
  const scrollViewRef = useRef(null);
  const [active, setActive] = useState(0);
  const imageWidth = width - 32;
  
  const onScrollChange = ({ nativeEvent }) => {
    const slide = Math.round(nativeEvent.contentOffset.x / imageWidth);
    if (slide !== active) {
      setActive(slide);
    }
  };

  const scrollToImage = (index) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * imageWidth,
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
          className="absolute left-0 right-0 flex-row-reverse justify-center gap-2"
          style={{ bottom: -28 }}>
          {photos.slice(0, Math.min(10, photos.length)).map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => scrollToImage(index)}
              className={`h-5 w-5 items-center justify-center rounded-full border-4 border-toast-300 ${
                index === active ? 'bg-toast-500' : 'bg-toast-300'
              }`}>
              <View
                className={`h-3 w-3 rounded-full ${
                  index === active ? 'bg-white' : ''
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

// Searchable Dropdown Component
const SectorDropdown = ({ options, selectedValue, onSelect, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef(null);

  // Filter options based on search text (case insensitive)
  const filteredOptions = options.filter(option =>
    option.toString().toLowerCase().includes(searchText.toLowerCase()) ||
    searchText === ''
  );

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleOptionSelect = (option) => {
    onSelect(option);
    setSearchText(option);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleClearFilter = () => {
    onSelect('');
    setSearchText('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // Update search text when selectedValue changes externally
  useEffect(() => {
    setSearchText(selectedValue || '');
  }, [selectedValue]);

  return (
    <View className="mb-4">
      <View className="relative">
        <TextInput
          ref={inputRef}
          value={searchText}
          onChangeText={setSearchText}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="rounded-lg border border-toast-300 bg-white px-4 py-3 pr-12 font-pmedium text-toast-900 text-right"
          style={{ textAlign: 'right' }}
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity
          onPress={() => setIsOpen(!isOpen)}
          className="absolute left-3 top-3 h-6 w-6 items-center justify-center"
        >
          <Image
            source={icons.chevron_down}
            className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            tintColor="#8d5e52"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      
      {isOpen && (
        <>
          {/* Backdrop to close dropdown when touched outside */}
          <TouchableOpacity
            onPress={() => {
              setIsOpen(false);
              inputRef.current?.blur();
            }}
            className="absolute -top-4 -left-4 -right-4 -bottom-4"
            style={{
              position: 'absolute',
              top: -1000,
              left: -1000,
              right: -1000,
              bottom: -1000,
              zIndex: 999,
            }}
            activeOpacity={1}
          />
          
          {(searchText !== '' || filteredOptions.length > 0) && (
            <View className="absolute top-full left-0 right-0 mt-1 max-h-48 rounded-lg border border-toast-300 bg-white shadow-lg" style={{ zIndex: 1000 }}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                  onPress={handleClearFilter}
                  className="border-b border-gray-100 px-4 py-3"
                >
                  <Text className="font-pmedium text-gray-600 text-right" style={{ textAlign: I18nManager.isRTL ? 'left' : 'right' }} >عرض جميع المقاسم</Text>
                </TouchableOpacity>
                {filteredOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleOptionSelect(option)}
                    className={`px-4 py-3 ${index < filteredOptions.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <Text className="font-pmedium text-toast-900 text-right" style={{ textAlign: I18nManager.isRTL ? 'left' : 'right' }}>{option}</Text>
                  </TouchableOpacity>
                ))}
                {filteredOptions.length === 0 && searchText !== '' && (
                  <View className="px-4 py-3">
                    <Text className="font-pmedium text-gray-500 text-right">لا توجد نتائج</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </>
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
  const flashListRef = useRef(null);

  const [sectoreSection, setSectoreSection] = useState([]);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedSectorCode, setSelectedSectorCode] = useState(''); // New state for dropdown filter
  const bottomSheetModalRef = useRef(null);
  const infoBottomSheetModalRef = useRef(null);
  const [mainSheetIndex, setMainSheetIndex] = useState(-1);
  const [infoSheetIndex, setInfoSheetIndex] = useState(-1);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (infoSheetIndex > -1) {
          infoBottomSheetModalRef.current?.dismiss();
          return true;
        }
        if (mainSheetIndex > -1) {
          bottomSheetModalRef.current?.dismiss();
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress
      );

      return () => subscription.remove();
    }, [mainSheetIndex, infoSheetIndex])
  );

  const hasAdditionalInfo = (sector) => {
    if (!sector) return false;
    const fields = ['description', 'outer_area', 'residential_area', 'commercial_area', 'floors_number', 'total_floor_area', 'owners', 'contractor', 'engineers'];
    return fields.some(field => {
      const value = sector[field];
      return value !== null && value !== undefined && value !== 0 && value !== '0' && String(value).trim().length > 0;
    });
  };

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
      // Reset sector code filter when loading new region data
      setSelectedSectorCode('');
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
    // Scroll to top when changing region tabs
    setTimeout(() => {
      flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
  };

  const [sectorTabId, setSectorTabId] = useState('0');
  const handleTabChangeForSector = (tabId) => {
    setSectorTabId(tabId);
    // Clear selected sector when changing sector tabs
    setSelectedSector(null);
    // Reset sector code filter when changing sector tabs
    setSelectedSectorCode('');
    // Scroll to top when changing sector tabs
    setTimeout(() => {
      flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
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
    const allData = sectorsRecords[parseInt(sectorTabId)].code || [];
    
    // Filter by selected sector code if one is selected
    if (selectedSectorCode) {
      return allData.filter(item => item.code === selectedSectorCode);
    }
    
    return allData;
  };

  // Get available sector codes for dropdown
  const getAvailableSectorCodes = () => {
    if (!sectorsRecords || !sectorsRecords[parseInt(sectorTabId)]) {
      return [];
    }
    const allData = sectorsRecords[parseInt(sectorTabId)].code || [];
    const codes = allData.map(item => item.code).filter(Boolean);
    // Remove duplicates and sort
    return [...new Set(codes)].sort((a, b) => a.localeCompare(b, 'ar', { numeric: true }));
  };

  // Handle sector code filter change
  const handleSectorCodeChange = (code) => {
    setSelectedSectorCode(code);
    // Scroll to top when filter changes
    setTimeout(() => {
      flashListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
  };

  // Calculate number of visible buttons and corresponding height
  const getBottomSheetHeight = (sector) => {
    let buttonCount = 0;
    
    if (sector?.apartment_count > 0) buttonCount++;
    if (sector?.share_count > 0) buttonCount++;
    if (hasAdditionalInfo(sector)) buttonCount++;
    
    // Base height + height per button + padding
    // Base: 120px for title and padding
    // Each button: 50px height + 16px gap
    // Additional padding: 32px bottom
    const baseHeight = 120;
    const buttonHeight = 66; // 50px + 16px gap
    const bottomPadding = 32;
    const totalHeight = baseHeight + (buttonCount * buttonHeight) + bottomPadding;
    
    // Convert to percentage of screen height (assuming ~800px screen height)
    const heightPercentage = Math.min(Math.max((totalHeight / 800) * 100, 25), 60);
    
    return [`${heightPercentage}%`];
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

  const handleShowMoreInfo = () => {
    bottomSheetModalRef.current?.dismiss();
    infoBottomSheetModalRef.current?.present();
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
                  {/* Sector Code Dropdown */}
                  <SectorDropdown
                    options={getAvailableSectorCodes()}
                    selectedValue={selectedSectorCode}
                    onSelect={handleSectorCodeChange}
                    placeholder="اختر مقسم معين"
                  />
                  
                  <FlashList
                    ref={flashListRef}
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
        handleSheetChanges={setMainSheetIndex}
        snapPoints={getBottomSheetHeight(selectedSector)}
        handleDismissModalPress={() => {}}>
        <View className="p-6 pb-8">
          <Text className="mb-6 text-center font-psemibold text-lg">
            المقسم رقم {selectedSector?.code}
          </Text>
          <View className="gap-4">
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
            {hasAdditionalInfo(selectedSector) && (
                <CustomButton
                    hasGradient={false}
                    title="عرض معلومات إضافية"
                    containerStyles={'w-full border border-toast-500'}
                    textStyles={'text-toast-500 text-center'}
                    buttonStyles={'h-[50px]'}
                    handleButtonPress={handleShowMoreInfo}
                    loading={false}
                />
            )}
            {(!selectedSector?.apartment_count || selectedSector?.apartment_count === 0) && 
             (!selectedSector?.share_count || selectedSector?.share_count === 0) &&
             !hasAdditionalInfo(selectedSector) && (
              <Text className="text-center font-pmedium text-gray-500">
                لا توجد عقارات أو أسهم متاحة في هذا المقسم
              </Text>
            )}
          </View>
        </View>
      </CustomBottomModalSheet>

      <CustomBottomModalSheet
        bottomSheetModalRef={infoBottomSheetModalRef}
        snapPoints={['60%', '90%']}
        handleSheetChanges={setInfoSheetIndex}
        backdropBehave="close"
        enablePanDownToClose={true}>
          <BottomSheetScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
            <Text className="mb-6 text-center font-psemibold text-lg text-gray-800">
              معلومات إضافية للمقسم {selectedSector?.code}
            </Text>
            <DescriptionRow label="الوصف" value={selectedSector?.description} />
            <InfoRow label="المساحة الخارجية" value={selectedSector?.outer_area} unit=" م²" />
            <InfoRow label="المساحة السكنية" value={selectedSector?.residential_area} unit=" م²" />
            <InfoRow label="المساحة التجارية" value={selectedSector?.commercial_area} unit=" م²" />
            <InfoRow label="مساحة الطوابق الإجمالية" value={selectedSector?.total_floor_area} unit=" م²" />
            <InfoRow label="عدد الطوابق" value={selectedSector?.floors_number} />
            <InfoListRow label="المتعهد" items={selectedSector?.contractor?.split(',')} listKey="contractors" />
            <InfoListRow label="المهندسين" items={selectedSector?.engineers?.split(',')} listKey="engineers" />
          </BottomSheetScrollView>
      </CustomBottomModalSheet>
    </SafeAreaView>
  );
};

export default SectorsScreen;
