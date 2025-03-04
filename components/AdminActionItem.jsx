import { View, Text, Image, I18nManager } from 'react-native';
import React from 'react';
import CustomButton from './CustomButton';

const AdminActionItem = ({
  title,
  description,
  icon,
  color,
  onDeleteConfirm,
  onClose,
  confirmLoading,
  confirm_color,
}) => {
  return (
    <View className="flex items-center justify-center gap-2">
      <View>
        <Image source={icon} tintColor={color} />
      </View>
      <Text className="text-center font-pbold text-base text-black">{title}</Text>
      <Text className="text-center font-pregular text-base text-black">{description}</Text>
      <View
        className={`m-4 flex items-center justify-center gap-2 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
        <CustomButton
          hasGradient={false}
          title={'الغاء'}
          containerStyles={'flex-grow'}
          positionOfGradient={'leftToRight'}
          textStyles={'text-black'}
          buttonStyles={'h-[45px]'}
          handleButtonPress={onClose}
        />
        <CustomButton
          hasGradient={false}
          title={'تأكيد'}
          containerStyles={'flex-grow'}
          positionOfGradient={'leftToRight'}
          textStyles={'text-white'}
          buttonStyles={`h-[45px] ${confirm_color}`}
          handleButtonPress={onDeleteConfirm}
          loading={confirmLoading}
        />
      </View>
    </View>
  );
};

export default AdminActionItem;
