import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

const CustomIcon = ({ children, containerStyles, handleOnIconPress }) => {
  return (
    <TouchableOpacity onPress={handleOnIconPress} className={`${containerStyles} flex items-center justify-center border w-12 h-12 rounded-full`}>
      {children}
    </TouchableOpacity>
  );
};

export default CustomIcon;
