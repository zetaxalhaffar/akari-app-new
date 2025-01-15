import { Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
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
  disabled,
  loading = false,
}) => {
  return (
    <View className={`${containerStyles} rounded-lg`}>
      {hasGradient && (
        <TouchableOpacity onPress={handleButtonPress} disabled={disabled}>
          <LinearGradient
            style={{ borderRadius: 6 }}
            colors={colors}
            className={`${buttonStyles} flex flex-row items-center justify-center gap-2 rounded-lg p-2 ${disabled ? 'opacity-50' : ''}`}
            start={gradientPositions[positionOfGradient].start}
            end={gradientPositions[positionOfGradient].end}>
            <Text className={`${textStyles} font-pbold text-base`}>{title}</Text>
            {loading && (
              <ActivityIndicator animating={loading} className={'` mb-1'} color={'#FFF'} />
            )}
          </LinearGradient>
        </TouchableOpacity>
      )}
      {!hasGradient && (
        <TouchableOpacity
          className={`${buttonStyles} flex flex-row items-center justify-center gap-2 rounded-lg p-2`}
          onPress={handleButtonPress}>
          <Text className={`${textStyles} font-pbold text-base`}>{title}</Text>
          {loading && (
            <ActivityIndicator animating={loading} className={'mb-1'} color={'#633e3d'} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomButton;
