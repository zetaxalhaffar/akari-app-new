// app/SearchResults.jsx
import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalSearchParams, router } from 'expo-router';
import CustomHeadWithBackButton from '../components/CustomHeadWithBackButton';
import { useUnitsStore } from '../store/units.store';
import { FlashList } from '@shopify/flash-list';
import UnitShareCard from '../components/UnitCardShare';
import UnitApartmentCard from '../components/UnitCardApartment';
import EmptyScreen from '@/components/EmptyScreen';

const SearchResultsScreen = () => {
  // Retrieve all passed parameters
  const searchParams = useGlobalSearchParams();
  const [results, setResults] = useState([]);
  const [originalSearchParams, setOriginalSearchParams] = useState(null);
  const isInitialized = useRef(false);
  const stableSearchParams = useRef(null);

  const { searchForUnits, searchForUnitsLoading, searchForUnitsResponse, clearSearchResults } = useUnitsStore();

  const getSearchResults = async (clearPrevious = false) => {
    // Use the stable stored params to completely prevent any parameter pollution
    const paramsToUse = stableSearchParams.current;
    if (!paramsToUse) {
      console.log('No stable search params available, skipping request');
      return;
    }
    
    // Clear previous search results if this is a new search
    if (clearPrevious) {
      clearSearchResults();
    }
    
    console.log('Making search request with params:', JSON.stringify(paramsToUse, null, 2));
    console.log('Expected API endpoint:', `/${paramsToUse.currentType}/search`);
    await searchForUnits(paramsToUse);
    console.log('searchForUnitsResponse ====================', searchForUnitsResponse);
  };

  const handleRefresh = () => {
    console.log('handleRefresh called');
    getSearchResults();
  };

  const handleEndReached = () => {
    console.log('handleEndReached called');
    getSearchResults();
  };

  useEffect(() => {
    // Only store params and make request on initial mount
    if (!isInitialized.current) {
      console.log('Initializing SearchResults with params:', JSON.stringify(searchParams, null, 2));
      
      // Clear any previous search results immediately
      clearSearchResults();
      
      // Create a clean copy of search params, excluding any router-specific keys
      const cleanParams = {};
      for (const [key, value] of Object.entries(searchParams)) {
        if (!key.startsWith('__EXPO_ROUTER_') && !key.startsWith('_')) {
          cleanParams[key] = value;
        }
      }
      
      setOriginalSearchParams(cleanParams);
      stableSearchParams.current = cleanParams;
      isInitialized.current = true;
      getSearchResults(true); // Clear previous results on initial load
    }
  }, []); // Empty dependency array to run only once

  // Component unmount cleanup
  useEffect(() => {
    return () => {
      console.log('SearchResults component unmounting');
    };
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <CustomHeadWithBackButton title="نتائج البحث" handleButtonPress={() => router.back()} />
      <View className="flex-1 px-4 pt-4">
        <FlashList
          data={searchForUnitsResponse?.data}
          estimatedItemSize={350}
          showsVerticalScrollIndicator={false}
          refreshing={searchForUnitsLoading}
          onRefresh={handleRefresh}
          renderItem={({ item }) => {
            // Use the actual post_type from the data to determine which card to render
            // This prevents mismatches between expected type and actual data
            const isShare = item.post_type === 'share' || stableSearchParams.current?.currentType === 'share';
            console.log(`Rendering item ${item.id}: post_type=${item.post_type}, currentType=${stableSearchParams.current?.currentType}, using=${isShare ? 'UnitShareCard' : 'UnitApartmentCard'}`);
            
            return isShare ? (
              <UnitShareCard item={item} />
            ) : (
              <UnitApartmentCard item={item} />
            );
          }}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={() => (searchForUnitsLoading ? <Text /> : <EmptyScreen />)}
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchResultsScreen;
