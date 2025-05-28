import { View, Text, I18nManager } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '@/components/CustomButton.jsx';
import ParallaxSlider from '../../components/ParallaxSlider';
import { router } from 'expo-router';

const BOTTOM_NAVIGATION_HEIGHT = 78;


const AuthMainStack = () => {
  console.log(I18nManager.isRTL, "isRTL")
  return (
    <SafeAreaView>
      <View className={'relative'}>
        <View className={'relative h-screen'}>
          <ParallaxSlider />
        </View>
        <View className={styles.bottom_navigation} style={{ height: BOTTOM_NAVIGATION_HEIGHT }}>
          <CustomButton
            hasGradient={true}
            colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
            title={'حساب جديد'}
            containerStyles={'flex-grow'}
            positionOfGradient={'leftToRight'}
            textStyles={'text-white'}
            buttonStyles={'h-[45px]'}
            handleButtonPress={() => {
              router.push('/(auth)/signup');
            }}
          />
          <CustomButton
            title={'تسجيل الدخول'}
            containerStyles={'flex-grow'}
            buttonStyles={'border border-gray-600 h-[45px]'}
            textStyles={'text-gray-600'}
            handleButtonPress={() => {
              router.push('/(auth)/login');
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  bottom_navigation:
    `bg-white border-t-[2px] border-gray-200 absolute bottom-0 left-0 right-0 p-4 flex flex-row justify-between items-center gap-4`,
};

export default AuthMainStack;
