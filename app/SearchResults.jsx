// app/SearchResults.jsx
import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
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

  const { searchForUnits, searchForUnitsLoading, searchForUnitsResponse } = useUnitsStore();

  const getSearchResults = async () => {
    // Pass all searchParams to the function
    await searchForUnits(searchParams);
    console.log('searchForUnitsResponse ====================', searchForUnitsResponse);
  };

  const handleRefresh = () => {
    getSearchResults();
  };

  const handleEndReached = () => {
    getSearchResults();
  };

  useEffect(() => {
    getSearchResults();
    // Depend on the searchParams object.
    // Note: For objects in dependency arrays, ensure stable references or serialize if needed,
    // but for searchParams from expo-router, this should generally be fine.
  }, [searchParams]);

  return (
    <SafeAreaView className="flex-1">
      <CustomHeadWithBackButton title="نتائج البحث" handleButtonPress={() => router.back()} />
      <View className="flex-1 px-4 pt-4">
        <FlashList
          data={searchForUnitsResponse?.data}
          estimatedItemSize={350}
          refreshing={searchForUnitsLoading}
          onRefresh={handleRefresh}
          renderItem={({ item }) =>
            // Use currentType from searchParams
            searchParams.currentType == 'share' ? (
              <UnitShareCard item={item} />
            ) : (
              <UnitApartmentCard item={item} />
            )
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={() => (searchForUnitsLoading ? <Text /> : <EmptyScreen />)}
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchResultsScreen;
