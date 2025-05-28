import { FlashList } from '@shopify/flash-list';
import React, { useState, useEffect } from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
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
      <View className="flex-row justify-around border-b border-gray-200">
        {topTabItems.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => {
              setActiveTab(tab.id);
              onTabChange(tab.id);
            }}
            className={`p-2 ${activeTab === tab.id ? 'border-b-2 border-toast-500' : ''}`}>
            <Text
              className={`font-pmedium transition-all duration-300 ${
                activeTab === tab.id ? 'text-base text-toast-500' : 'text-sm text-gray-500'
              }`}>
              {tab[itemTitle]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Tab Content */}
      {children}
    </>
  );
};

export default CustomTopTabs;
