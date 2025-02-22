import { View, Text, I18nManager, TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import CustomIcon from './CustomIcon';

const CustomHeadWithBackButton = ({
  rightTextStyles,
  title,
  rightText,
  rightTextPress,
  handleButtonPress,
  rightIcon,
  rightIconPress,
}) => {
  return (
    <View
      className={`flex-row items-center justify-between px-2 py-3 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
      <TouchableOpacity
        onPress={handleButtonPress}
        className={`flex-row items-center ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
        <CustomIcon handleOnIconPress={handleButtonPress} containerStyles="border-[0]">
          <Entypo name="chevron-right" size={24} color="#000" />
        </CustomIcon>
        <Text
          className={`font-psemibold text-lg ${I18nManager.isRTL ? 'text-right' : 'text-left'} mt-1`}>
          {title}
        </Text>
      </TouchableOpacity>
      {rightText && (
        <View>
          <Text
            onPress={rightTextPress}
            className={`text-right font-psemibold text-base underline ${rightTextStyles}`}>
            {rightText}
          </Text>
        </View>
      )}
      {rightIcon && (
        <CustomIcon handleOnIconPress={rightIconPress} containerStyles="border-[0]">
          {rightIcon}
        </CustomIcon>
      )}
    </View>
  );
};

export default CustomHeadWithBackButton;
