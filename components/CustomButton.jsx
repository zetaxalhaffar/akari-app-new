import { Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const gradientPositions = {
  topToBottom: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  bottomToTop: { start: { x: 0, y: 1 }, end: { x: 0, y: 0 } },
  leftToRight: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  rightToLeft: { start: { x: 1, y: 0 }, end: { x: 0, y: 0 } },
};

const CustomButton = ({
  title,
  onPress,
  buttonStyles,
  textStyles,
  containerStyles,
  colors,
  hasGradient,
  positionOfGradient = 'leftToRight',
  handleButtonPress,
}) => {
  return (
    <View className={`${containerStyles} rounded-lg`}>
      {hasGradient && (
        <TouchableOpacity onPress={handleButtonPress}>
          <LinearGradient
            style={{ borderRadius: 6 }}
            colors={colors}
            className={`${buttonStyles} flex items-center justify-center rounded-lg p-2`}
            start={gradientPositions[positionOfGradient].start}
            end={gradientPositions[positionOfGradient].end}>
            <Text className={`${textStyles} font-pbold text-base`}>{title}</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
      {!hasGradient && (
        <TouchableOpacity
          className={`${buttonStyles} flex items-center justify-center rounded-lg p-2`}
          onPress={handleButtonPress}>
          <Text className={`${textStyles} font-pbold text-base`}>{title}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomButton;
