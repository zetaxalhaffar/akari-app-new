import React, { useEffect, useRef } from 'react';
import { View, Animated, Text } from 'react-native';

const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dotValue, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dotValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dotValue, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animation1 = animateDot(dot1, 0);
    const animation2 = animateDot(dot2, 200);
    const animation3 = animateDot(dot3, 400);

    animation1.start();
    animation2.start();
    animation3.start();

    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
    };
  }, []);

  const dotStyle = (animatedValue) => ({
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
    transform: [
      {
        scale: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.2],
        }),
      },
    ],
  });

  return (
    <View className="mx-3 mb-3 flex-row justify-end">
      <View className="max-w-[80%] rounded-2xl rounded-bl-md bg-gray-200 px-4 py-3">
        <View className="flex-row items-center">
          <Animated.View
            style={[dotStyle(dot1), { marginHorizontal: 1 }]}
            className="h-2 w-2 rounded-full bg-gray-500"
          />
          <Animated.View
            style={[dotStyle(dot2), { marginHorizontal: 1 }]}
            className="h-2 w-2 rounded-full bg-gray-500"
          />
          <Animated.View
            style={[dotStyle(dot3), { marginHorizontal: 1 }]}
            className="h-2 w-2 rounded-full bg-gray-500"
          />
        </View>
      </View>
    </View>
  );
};

export default TypingIndicator; 