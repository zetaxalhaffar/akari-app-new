import { View, Text, Image, Linking } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeadWithBackButton from '../../components/CustomHeadWithBackButton';
import icons from '../../constants/icons';
import { router } from 'expo-router';
import CustomButton from '../../components/CustomButton';
import { getSecureStoreNoAsync } from '@/composables/secure.store';

const support = () => {
  const user = getSecureStoreNoAsync('user');

  return (
    <SafeAreaView className="flex-1">
      <CustomHeadWithBackButton title="المساعدة والدعم" handleButtonPress={() => router.back()} />
      <View className="mt-40 items-center justify-center">
        <Image source={icons.support_2} tintColor={'#a47764'} />
        <Text className="mt-4 font-pbold text-2xl">المساعدة والدعم</Text>
        <Text className="text-md font-pregular text-zinc-600">
          نحن هنا للمساعدة إذا كان لديك سؤال, فريقنا موجود
        </Text>
        <View className="w-full px-4">
          <CustomButton
            hasGradient={false}
            title={'واتساب'}
            containerStyles={'flex-grow mx-4 mt-4'}
            positionOfGradient={'leftToRight'}
            textStyles={'text-black text-green-500'}
            buttonStyles={'h-[45px] border border-green-500'}
            handleButtonPress={() => {
              Linking.openURL(`https://wa.me/${user?.support_phone}`);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default support;
