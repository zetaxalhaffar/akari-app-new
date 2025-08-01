import CustomButton from '@/components/CustomButton.jsx';
import { router } from 'expo-router';
import React from 'react';
import { I18nManager, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ParallaxSlider from '../../components/ParallaxSlider';

const BOTTOM_NAVIGATION_HEIGHT = 78;


const AuthMainStack = () => {
  console.log(I18nManager.isRTL, "isRTL")
  
  // Ensure RTL is properly configured
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
  
  return (
    <SafeAreaView className="flex-1">
      <View className={'relative flex-1'}>
        <View className={'absolute inset-0'}>
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
