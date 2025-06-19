import { FlashList } from '@shopify/flash-list';
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, Image, ScrollView } from 'react-native';
import images from '~/constants/images';
import { useUnitsStore } from '../store/units.store';

const CustomTopTabs = ({
  topTabItems = [],
  onTabChange,
  children,
  defaultActiveTab = 'shares',
  itemTitle = 'title',
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  // Update activeTab when defaultActiveTab prop changes
  useEffect(() => {
    setActiveTab(defaultActiveTab);
  }, [defaultActiveTab]);

  return (
    <>
      {/* Tab Headers */}
      <View className="border-b border-gray-200">
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingHorizontal: 16,
            flexGrow: 1,
            justifyContent: 'center'
          }}
          className="flex-grow-0"
        >
          <View className="flex-row gap-4">
        {topTabItems.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => {
              setActiveTab(tab.id);
              onTabChange(tab.id);
            }}
                className={`py-3 px-4 ${activeTab === tab.id ? 'border-b-2 border-toast-500' : ''}`}>
            <Text
                  className={`font-pmedium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id ? 'text-base text-toast-500' : 'text-sm text-gray-500'
              }`}>
              {tab[itemTitle]}
            </Text>
          </TouchableOpacity>
        ))}
          </View>
        </ScrollView>
      </View>
      {/* Tab Content */}
      {children}
    </>
  );
};

export default CustomTopTabs;
