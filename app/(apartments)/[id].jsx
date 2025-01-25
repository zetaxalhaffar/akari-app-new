import { router, useGlobalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  Share,
  I18nManager,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUnitsStore } from '../../store/units.store';
import CustomHeadWithBackButton from '../../components/CustomHeadWithBackButton';
import { AntDesign } from '@expo/vector-icons';
import CustomImageSlider from '@/components/CustomImageSlider';
import CustomButton from '@/components/CustomButton';
import icons from '../../constants/icons';
import { getSecureStoreNoAsync } from '@/composables/secure.store';
import CustomBottomSheet from '@/components/CustomBottomSheet';
import DeleteItem from '../../components/DeleteItem';

const UnitDetails = ({ item }) => {
  return (
    <View className="px-4 py-4">
      <View className={`rounded-lg border border-toast-100 p-4`}>
        <Text className="font-psemibold text-lg text-black">تفاصيل العقار</Text>
        <Text className="font-pregular text-sm text-zinc-600">
          {item?.transaction_type === 'buy' ? (
            <Text className={'font-pregular text-base text-zinc-500'}>
              نرغب بشراء اسهم عقارية في {item?.sector?.code?.view_code} بكمية {item?.equity} حصة
              سهمية بسعر {item?.price} في منطقة {item?.region?.name}
            </Text>
          ) : (
            <Text className={'font-pregular text-base text-zinc-500'}>
              نرغب ببيع اسهم عقارية في {item?.sector?.code?.view_code} بكمية {item?.equity} حصة
              سهمية بسعر {item?.price} في منطقة {item?.region?.name}
            </Text>
          )}
        </Text>
      </View>
      <View className="mt-4 flex-row gap-2">
        <View className="flex-1 rounded-lg border border-toast-100 p-4">
          <Image source={icons.price} className="mb-1 h-7 w-7" tintColor="#a47764" />
          <Text className="font-pmedium text-base text-zinc-600">سعر العقار</Text>
          <Text
            className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
            {item?.price}
          </Text>
        </View>
        <View className="flex-1 rounded-lg border border-toast-100 p-4">
          <Image source={icons.quantity} className="mb-1 h-7 w-7" tintColor="#a47764" />
          <Text className="font-pmedium text-base text-zinc-600">اسهم العقار</Text>
          <Text
            className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
            {item?.equity}
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
      {/* apartment details */}
      <View className="mt-4 flex-row gap-2">
        <View className="flex-1 rounded-lg border border-toast-100 p-4">
          <Image source={icons.area} className="mb-1 h-7 w-7" tintColor="#a47764" />
          <Text className="font-pmedium text-base text-zinc-600">المساحة</Text>
          <Text
            className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
            {item?.area} م2
          </Text>
        </View>
        <View className="flex-1 rounded-lg border border-toast-100 p-4">
          <Image source={icons.floor} className="mb-1 h-7 w-7" tintColor="#a47764" />
          <Text className="font-pmedium text-base text-zinc-600">الطابق</Text>
          <Text
            className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
            {item?.floor}
          </Text>
        </View>
        <View className="flex-1 rounded-lg border border-toast-100 p-4">
          <Image source={icons.direction} className="mb-1 h-7 w-7" tintColor="#a47764" />
          <Text className="font-pmedium text-base text-zinc-600">اتجاه العقار</Text>
          <Text
            className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
            {item?.direction?.name}
          </Text>
        </View>
      </View>
      {/* owner details */}
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
      {/* extra details */}
      <View className="mt-4 gap-2 rounded-lg border border-toast-100 p-4 ">
        <View className=" mb-3">
          <Text className="font-psemibold text-lg text-black">تفاصيل إضافية</Text>
        </View>
        <View className="flex-row">
          <View className="flex-1 rounded-lg">
            <Image source={icons.rooms} className="mb-1 h-7 w-7" tintColor="#a47764" />
            <Text className="font-pmedium text-base text-zinc-600">عدد الغرف</Text>
            <Text
              className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
              {item?.rooms_count}
            </Text>
          </View>
          <View className="flex-1 rounded-lg">
            <Image source={icons.salons} className="mb-1 h-7 w-7" tintColor="#a47764" />
            <Text className="font-pmedium text-base text-zinc-600">عدد الصالونات</Text>
            <Text
              className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
              {item?.salons_count}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <View className="flex-1 rounded-lg">
            <Image source={icons.balcons} className="mb-1 h-7 w-7" tintColor="#a47764" />
            <Text className="font-pmedium text-base text-zinc-600">عدد البلكونات</Text>
            <Text
              className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
              {item?.balcony_count}
            </Text>
          </View>
          <View className="flex-1 rounded-lg">
            <Image source={icons.terrace} className="mb-1 h-7 w-7" tintColor="#a47764" />
            <Text className="font-pmedium text-base text-zinc-600">تراس</Text>
            <Text
              className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
              {item?.is_taras}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <View className="flex-1 rounded-lg">
            <Image source={icons.apartment_status} className="mb-1 h-7 w-7" tintColor="#a47764" />
            <Text className="font-pmedium text-base text-zinc-600">حالة العقار</Text>
            <Text
              className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
              {item?.apartment_status?.name}
            </Text>
          </View>
          <View className="flex-1 rounded-lg">
            <Image source={icons.building_type} className="mb-1 h-7 w-7" tintColor="#a47764" />
            <Text className="font-pmedium text-base text-zinc-600">نوع العقار</Text>
            <Text
              className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
              {item?.apartment_type?.name}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const ApartmentDetails = () => {
  // Get the id from the url
  const { id } = useGlobalSearchParams();

  // get Current User

  const user = getSecureStoreNoAsync('user');

  // init store
  const {
    getApartmentDetails,
    apartmentDetailsResponse,
    apartmentDetailsLoading,
    deleteApartment,
    deleteApartmentLoading,
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

  const getApartmentDetailsHandler = async () => {
    if (!id) return;
    await getApartmentDetails(id);
  };

  const handleDeleteConfirm = async () => {
    const response = await deleteApartment(id);
    if (response?.success) {
      router.replace('/(tabs)');
      router.dismissAll();
    }
  };

  useEffect(() => {
    getApartmentDetailsHandler();
  }, [id]);

  return (
    <SafeAreaView className="flex-1">
      {apartmentDetailsLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="100" color="#a47764" />
        </View>
      ) : (
        <>
          <CustomHeadWithBackButton
            title="تفاصيل العقار"
            rightIcon={<AntDesign name="sharealt" size={24} color="black" />}
            rightIconPress={() => handleShare(apartmentDetailsResponse)}
            handleButtonPress={() => router.back()}
          />
          <View>
            <View className="px-4">
              <Text className="font-psemibold text-xl">
                {apartmentDetailsResponse?.sector?.code?.name} -{' '}
                {apartmentDetailsResponse?.sector?.code?.view_code}
              </Text>
              <Text className="font-pregular text-sm text-zinc-600">
                {apartmentDetailsResponse?.region?.name} -{' '}
                {apartmentDetailsResponse?.post_type == 'share' ? 'أسهم تنظيمية' : 'عقارات'}
              </Text>
            </View>
          </View>
          <ScrollView className="flex-1">
            <View>
              {apartmentDetailsResponse && (
                <CustomImageSlider
                  images={apartmentDetailsResponse?.photos}
                  height={300}
                  newImages={apartmentDetailsResponse}
                />
              )}
              <View style={{ marginTop: 20 }}>
                <UnitDetails item={apartmentDetailsResponse} />
              </View>
            </View>
          </ScrollView>
          <View className="p-4">
            {user?.user_id == apartmentDetailsResponse?.user?.id ? (
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
                    confirmLoading={deleteApartmentLoading}
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
                  handleButtonPress={() => router.push(`/(edit)/apartment/${id}`)}
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

export default ApartmentDetails;
