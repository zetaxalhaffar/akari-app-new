import { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, I18nManager } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import CustomIcon from './CustomIcon';
import { EvilIcons } from '@expo/vector-icons';

const ToastMessage = forwardRef(({ type, text, description, timeout = 1000 }, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  const TOAST_TYPE = {
    success: {
      backgroundColor: 'bg-toast-500',
    },
    danger: {
      backgroundColor: 'bg-red-700',
    },
    info: {
      backgroundColor: 'bg-info-500',
    },
    warning: {
      backgroundColor: 'bg-warning-500',
    },
  };

  const showToast = () => {
    console.log('show toast in');
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      clearTimeout(timer);
    }, timeout);
  };

  useImperativeHandle(ref, () => ({
    show: showToast,
  }));

  const backgroundColor = TOAST_TYPE[type].backgroundColor;
  return (
    <>
      {isVisible && (
        <Animated.View
          className="absolute top-20 z-[1000] w-full"
          entering={FadeInUp.delay(200)}
          exiting={FadeOutUp}>
          <View className={`mx-4 rounded-lg p-4 ${backgroundColor}`}>
            <Text
              className={`font-psemibold text-lg text-white ${I18nManager.isRTL ? 'ltr-text' : 'rtl-text'}`}>
              {text}
            </Text>
            <Text
              className={`font-pmedium text-base text-white ${I18nManager.isRTL ? 'ltr-text' : 'rtl-text'}`}>
              {description}
            </Text>
          </View>
        </Animated.View>
      )}
    </>
  );
});

export default ToastMessage;
