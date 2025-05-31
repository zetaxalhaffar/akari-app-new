import { View, Text, Image, I18nManager } from 'react-native';
import React from 'react';
import icons from '../constants/icons';
import CustomButton from './CustomButton';

const DeleteItem = ({ onDeleteConfirm, onClose,confirmLoading }) => {
  return (
    <View className="flex items-center justify-center gap-2">
      <View>
        <Image source={icons.delete_icon} tintColor={'#C10007'} />
      </View>
      <Text className="text-center font-pbold text-base text-black">
        هل أنت متاكد من حذف الإعلان؟
      </Text>
      <Text className="text-center font-pregular text-base text-black">
        سيتم حذف الإعلان والإشعارات المرتبطة به
      </Text>
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
          buttonStyles={'h-[45px] bg-red-800'}
          handleButtonPress={onDeleteConfirm}
          loading={confirmLoading}
        />
      </View>
    </View>
  );
};

export default DeleteItem;
