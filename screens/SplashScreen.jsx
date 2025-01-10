import { View, Text, Platform } from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');


const SplashScreen = () => {
  return (
    <>
      <View className="bg-toast-500 flex-1">
        <LottieView
          source={require('@/assets/animations/splash_screen.json')}
          autoPlay
          loop={false}
          resizeMode="cover"
          style={{width: width, height: height + 100}}
          onAnimationFinish={() => {
            console.log('Animation finished');
          }}
        />
      </View>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} backgroundColor="#a47764" />
    </>
  );
};

const styles = {
  title: `text-3xl font-pbold py-4`,
};

export default SplashScreen;
