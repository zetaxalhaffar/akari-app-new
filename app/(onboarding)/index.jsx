import { Platform, StyleSheet, Text, View } from 'react-native';
import React, { useRef } from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import { StatusBar } from 'expo-status-bar';
import { setSecureStore } from '~/composables/secure.store.jsx';
import { router } from 'expo-router';
const OnboardingScreen = () => {
  const handleCompleteOnboarding = async () => {
    await setSecureStore('isOnboarding', 'true');
    router.replace('(auth)');
  };
  const animation = useRef(null);
  return (
    <>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} backgroundColor="#a47764" />
      <View className="flex-1">
        <Onboarding
          onSkip={handleCompleteOnboarding}
          nextLabel={'التالي'}
          skipLabel={'تخطي'}
          titleStyles={{
            fontFamily: 'Cairo-Bold',
          }}
          pages={[
            {
              backgroundColor: '#fff',
              image: (
                <View>
                  <LottieView
                    autoPlay
                    ref={animation}
                    style={{
                      width: 300,
                      height: 200,
                    }}
                    // Find more Lottie files at https://lottiefiles.com/featured
                    source={require('../../assets/animations/home.json')}
                  />
                </View>
              ),
              title: 'تجربة التطبيق',
              subtitle: 'Done with React Native Onboarding Swiper',
            },
            {
              backgroundColor: '#fff',
              image: (
                <View>
                  <Text>Onboarding 2</Text>
                </View>
              ),
              title: 'Onboarding',
              subtitle: 'Done with React Native Onboarding Swiper',
            },
            {
              backgroundColor: '#fff',
              image: (
                <View>
                  <Text>Onboarding 3</Text>
                </View>
              ),
              title: 'Onboarding',
              subtitle: 'Done with React Native Onboarding Swiper',
            },
          ]}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  lottie: {
    width: 300,
    height: 400,
  },
});

export default OnboardingScreen;
