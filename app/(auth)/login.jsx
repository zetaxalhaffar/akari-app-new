import React from 'react';
import { View, Text,Image, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import CustomIcon from '../../components/CustomIcon';
import { router } from 'expo-router';
import images from '../../constants/images';


function LoginScreen() {
  console.log(I18nManager)
  
  return (
    <SafeAreaView>
      <View className="m-3 mb-0">
        <CustomIcon
          handleOnIconPress={() => {
            router.back();
          }}
          containerStyles="border-toast-600 bg-toast-100">
          <EvilIcons name="close" size={22} color="#a47764" className="mb-1" />
        </CustomIcon>
      </View>
      <View>
        <Image source={images.row_logo} className="w-24 h-24" />
      </View>
      <View>
        <Text>LoginScreen</Text>
      </View>
    </SafeAreaView>
  );
}

export default LoginScreen;
