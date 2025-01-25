import { router, useGlobalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Image,
  Share,
  ScrollView,
  I18nManager,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUnitsStore } from '@/store/units.store';
import CustomHeadWithBackButton from '@/components/CustomHeadWithBackButton';
import { AntDesign } from '@expo/vector-icons';
import CustomImageSlider from '@/components/CustomImageSlider';
import CustomButton from '@/components/CustomButton';
import icons from '@/constants/icons';
import { getSecureStore, getSecureStoreNoAsync } from '@/composables/secure.store';
import CustomBottomSheet from '@/components/CustomBottomSheet';
import DeleteItem from '@/components/DeleteItem';

const UnitDetails = ({ item }) => {
  return (
    <View className="px-4 py-4">
      <View className={`rounded-lg border border-toast-100 p-4`}>
        <Text className="font-psemibold text-lg text-black">تفاصيل الوحدة</Text>
        <Text className="font-pregular text-sm text-zinc-600">
          {item?.transaction_type === 'buy' ? (
            <Text className={'font-pregular text-zinc-500'}>
              نرغب بشراء اسهم تنظيمية في {item?.sector?.code?.view_code} بكمية {item?.quantity} سهم
              بسعر {item?.price} ل.س بالسهم في منطقة {item?.region?.name}
            </Text>
          ) : (
            <Text className={'font-pregular text-zinc-500'}>
              نرغب ببيع اسهم تنظيمية في {item?.sector?.code?.view_code} بكمية {item?.quantity} سهم
              بسعر {item?.price} ل.س بالسهم في منطقة {item?.region?.name}
            </Text>
          )}
        </Text>
      </View>
      <View className="mt-4 flex-row gap-2">
        <View className="flex-1 rounded-lg border border-toast-100 p-4">
          <Image source={icons.price} className="mb-1 h-7 w-7" tintColor="#a47764" />
          <Text className="font-pmedium text-base text-zinc-600">سعر السهم المطروح</Text>
          <Text
            className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
            {item?.price}
          </Text>
        </View>
        <View className="flex-1 rounded-lg border border-toast-100 p-4">
          <Image source={icons.quantity} className="mb-1 h-7 w-7" tintColor="#a47764" />
          <Text className="font-pmedium text-base text-zinc-600">الأسهم المطروحة</Text>
          <Text
            className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
            {item?.quantity}
          </Text>
        </View>
      </View>
      <View className="mt-4 flex-row gap-2">
        <View className="flex-1 rounded-lg border border-toast-100 p-4">
          <Image source={icons.location} className="mb-1 h-7 w-7" tintColor="#a47764" />
          <Text className="font-pmedium text-base text-zinc-600">المنطقة</Text>
          <Text className="font-pregular text-sm text-zinc-600">{item?.region?.name}</Text>
        </View>
        <View className="flex-1 rounded-lg border border-toast-100 p-4">
          <Image source={icons.sector} className="mb-1 h-7 w-7" tintColor="#a47764" />
          <Text className="font-pmedium text-base text-zinc-600">القطاع</Text>
          <Text className="font-pregular text-sm text-zinc-600">{item?.sector?.code?.name}</Text>
        </View>
        <View className="flex-1 rounded-lg border border-toast-100 p-4">
          <Image source={icons.section_number} className="mb-1 h-7 w-7" tintColor="#a47764" />
          <Text className="font-pmedium text-base text-zinc-600">رقم المقسم</Text>
          <Text className="font-pregular text-sm text-zinc-600">
            {item?.sector?.code?.view_code}
          </Text>
        </View>
      </View>
      <View className="mt-4 flex-row gap-2">
        <View className="flex-1 rounded-lg border border-toast-100 p-4">
          <Image source={icons.owner} className="mb-1 h-7 w-7" tintColor="#a47764" />
          <Text className="font-pmedium text-base text-zinc-600">مالك الوحدة</Text>
          <Text
            className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
            {item?.owner_name}
          </Text>
        </View>
      </View>
    </View>
  );
};

const SharesDetails = () => {
  // Get the id from the url
  const { id } = useGlobalSearchParams();

  // init store
  const {
    getShareDetails,
    shareDetailsResponse,
    shareDetailsLoading,
    deleteShare,
    deleteShareLoading,
  } = useUnitsStore();

  const handleShare = async (item) => {
    console.log(item);
    try {
      const result = await Share.share({
        message: item?.share_button ?? '',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  // get Current User

  const user = getSecureStoreNoAsync('user');
  console.log(typeof user, 'user', user);

  const getShareDetailsHandler = async () => {
    if (!id) return;
    const response = await getShareDetails(id);
  };

  const handleDeleteConfirm = async () => {
    const response = await deleteShare(id);
    if (response?.success) {
      router.replace('/(tabs)');
      router.dismissAll();
    }
  };

  useEffect(() => {
    getShareDetailsHandler();
  }, [id]);

  return (
    <SafeAreaView className="flex-1">
      {shareDetailsLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="100" color="#a47764" />
        </View>
      ) : (
        <>
          <CustomHeadWithBackButton
            title="تفاصيل الوحدة"
            rightIcon={<AntDesign name="sharealt" size={24} color="black" />}
            rightIconPress={() => handleShare(shareDetailsResponse)}
            handleButtonPress={() => router.back()}
          />
          <View>
            <View className="px-4">
              <Text className="font-psemibold text-xl">
                {shareDetailsResponse?.sector?.code?.name} -{' '}
                {shareDetailsResponse?.sector?.code?.view_code}
              </Text>
              <Text className="font-pregular text-sm text-zinc-600">
                {shareDetailsResponse?.region?.name} -{' '}
                {shareDetailsResponse?.post_type == 'share' ? 'أسهم تنظيمية' : 'عقارات'}
              </Text>
            </View>
          </View>
          <ScrollView>
            <View className="flex-1">
              {shareDetailsResponse && (
                <CustomImageSlider
                  images={shareDetailsResponse?.photos}
                  height={300}
                  newImages={shareDetailsResponse}
                />
              )}
              <View style={{ marginTop: 20 }}>
                <UnitDetails item={shareDetailsResponse} />
              </View>
            </View>
          </ScrollView>
          <View className="p-4">
            {user?.user_id == shareDetailsResponse?.user?.id ? (
              <View className={`gap-2 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
                <CustomBottomSheet
                  snapPoints={['25%']}
                  trigger={
                    <CustomButton
                      hasGradient={true}
                      colors={['#82181A', '#82181A', '#82181A', '#9F0712', '#C10007']}
                      title={'حذف الطلب'}
                      containerStyles={'flex-grow'}
                      positionOfGradient={'leftToRight'}
                      textStyles={'text-white'}
                      buttonStyles={'h-[45px]'}
                    />
                  }>
                  <DeleteItem
                    onDeleteConfirm={handleDeleteConfirm}
                    confirmLoading={deleteShareLoading}
                  />
                </CustomBottomSheet>
                <CustomButton
                  hasGradient={true}
                  colors={['#314158', '#62748E', '#90A1B9', '#90A1B9', '#90A1B9']}
                  title={'تعديل الطلب'}
                  containerStyles={'flex-grow'}
                  positionOfGradient={'leftToRight'}
                  textStyles={'text-white'}
                  buttonStyles={'h-[45px]'}
                  handleButtonPress={() => router.push(`/(edit)/share/${id}`)}
                />
              </View>
            ) : (
              <CustomButton
                hasGradient={true}
                colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
                title={'تواصل مع فريق عقاري'}
                containerStyles={'flex-grow'}
                positionOfGradient={'leftToRight'}
                textStyles={'text-white'}
                buttonStyles={'h-[45px]'}
                handleButtonPress={() => router.push('/(contact)')}
              />
            )}
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default SharesDetails;
