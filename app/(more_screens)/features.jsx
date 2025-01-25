import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const features = () => {
  return (
    <SafeAreaView className="flex-1">
      <View>
        <Text>features</Text>
      </View>
    </SafeAreaView>
  );
};

export default features;
