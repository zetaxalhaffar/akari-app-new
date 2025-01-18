import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';

const gradientPositions = {
  topToBottom: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  bottomToTop: { start: { x: 0, y: 1 }, end: { x: 0, y: 0 } },
  leftToRight: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  rightToLeft: { start: { x: 1, y: 0 }, end: { x: 0, y: 0 } },
};

const CustomLinear = ({
  colors,
  positionOfGradient = 'leftToRight',
  textStyles,
  title,
  loading,
  disabled,
  buttonStyles,
}) => {
  return (
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
  );
}

const styles = StyleSheet.create({})

export default CustomLinear;
