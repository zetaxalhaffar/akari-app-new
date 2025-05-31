import { View, Text, Image } from 'react-native';
import React from 'react';
import images from '../constants/images';

const EmptyScreen = ({ img = images.empty_status, title = 'لا يوجد إعلانات', mainTitle = '' }) => {
  return (
    <View className="flex-1 items-center justify-center" style={{ marginTop: 100 }}>
      {img && <Image source={img} className="h-[150px] w-[150px]" resizeMode="contain" />}
      {mainTitle && <Text className="font-psemibold text-xl text-zinc-500">{mainTitle}</Text>}
      <Text className="text-md font-pregular text-zinc-500">{title}</Text>
    </View>
  );
};

export default EmptyScreen;
