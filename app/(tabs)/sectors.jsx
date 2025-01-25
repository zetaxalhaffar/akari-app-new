import { View, Text, Image } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomePageHeader from '@/components/HomePageHeader';
import { useRegionsStore } from '@/store/regions.store';
import CustomTopTabs from '../../components/CustomTopTabs';
import { useSectoresStore } from '../../store/sectores.store';
import { FlashList } from '@shopify/flash-list';
import icons from '@/constants/icons';
const SectorsScreen = () => {
  const { regionResponse, getRegions } = useRegionsStore();
  const { getSectors, sectorsResponse, sectorsLoading } = useSectoresStore();

  const filtersParams = useRef({
    page: 1,
  });

  const [sectoreSection, setSectoreSection] = useState([]);

  const getSectorsList = async (region_id) => {
    const sectoreList = await getSectors(region_id, filtersParams.current, true);
    const sectorsTypesSelection = [];

    for (let sector in sectoreList) {
      if (sectoreList[sector] !== true) {
        sectorsTypesSelection.push({
          id: sector,
          name: sectoreList[sector]?.key,
        });
      }
    }
    setSectoreSection(sectorsTypesSelection);
  };

  const getRegionsList = async () => {
    const response = await getRegions();
    if (response.length > 0) {
      getSectorsList(tabId);
    }
  };

  // Handle Tab Change
  const [tabId, setTabId] = useState(1);
  const handleTabChange = (tabId) => {
    setTabId(tabId);
    getSectorsList(tabId);
  };

  const [sectorTabId, setSectorTabId] = useState('0');
  const handleTabChangeForSector = (tabId) => {
    setSectorTabId(tabId);
  };

  useEffect(() => {
    getRegionsList();
  }, [tabId]);
  return (
    <SafeAreaView className="flex-1 ">
      <HomePageHeader hasActions={false} />
      {regionResponse && (
        <View className="flex-1">
          <CustomTopTabs
            topTabItems={regionResponse}
            onTabChange={handleTabChange}
            defaultActiveTab={1}
            itemTitle="name">
            <View className="flex-1 px-4 pt-4">
              <CustomTopTabs
                topTabItems={sectoreSection}
                onTabChange={handleTabChangeForSector}
                defaultActiveTab={'0'}
                itemTitle="name">
                <View className="flex-1 px-4 pt-4">
                  <FlashList
                    data={sectorsResponse?.[sectorTabId]?.code ?? []}
                    estimatedItemSize={350}
                    refreshing={sectorsLoading}
                    onRefresh={() => {}}
                    renderItem={({ item }) => (
                      <View className="my-2 rounded-lg border border-toast-200">
                        <Image
                          source={{ uri: item.sector_photos[0] }}
                          width={'100%'}
                          height={300}
                          className="rounded-lg"
                        />
                        <View className="absolute inset-0 bottom-0 w-full rounded-lg bg-toast-900/90 p-4 backdrop-blur-sm">
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
                        </View>
                      </View>
                    )}
                    onEndReached={() => {}}
                    onEndReachedThreshold={0.5}
                  />
                </View>
              </CustomTopTabs>
            </View>
          </CustomTopTabs>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SectorsScreen;
