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
import { getSecureStoreNoAsync } from '@/composables/secure.store';
import CustomBottomSheet from '@/components/CustomBottomSheet';
import DeleteItem from '@/components/DeleteItem';
import { useAdminStore } from '../../store/admin.store';

import CustomBottomModalSheet from '@/components/CustomBottomModalSheet';
import AdminActionItem from '../../components/AdminActionItem';
import CustomLinear from '../../components/CustomLinear';

const UnitDetails = ({ item }) => {
  const user = getSecureStoreNoAsync('user');

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
      {(user?.privilege == 'admin' || user?.user_id == item?.user?.id) && (
        <View className="mt-4 flex-row gap-2">
          <View className="flex-1 rounded-lg border border-toast-100 p-4">
            <Image source={icons.owner} className="mb-1 h-7 w-7" tintColor="#a47764" />
            <Text className="font-pmedium text-base text-zinc-600">الجهة العارضة</Text>
            <Text
              className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
              {item?.owner_name}
            </Text>
          </View>
        </View>
      )}
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

  /*================== admin actions ==================*/

  const {
    approveUnitLoading,
    approveUnit,
    closeUnitLoading,
    closeUnit,
    deleteUnitLoading,
    deleteUnit,
  } = useAdminStore();

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

  const bottomSheetModalRef = useRef(null);
  const closeUnitBottomSheetModalRef = useRef(null);
  const deleteUnitBottomSheetModalRef = useRef(null);
  const handleApproveUnit = async () => {
    bottomSheetModalRef.current.present();
  };

  const handleCloseUnit = async () => {
    closeUnitBottomSheetModalRef.current.present();
  };

  const handleApproveUnitConfirm = async () => {
    const response = await approveUnit('share', id);
    if (response?.success) {
      getShareDetailsHandler();
      bottomSheetModalRef.current.dismiss();
    }
  };

  const handleCloseUnitConfirm = async () => {
    const response = await closeUnit('share', id);
    if (response?.success) {
      getShareDetailsHandler();
      closeUnitBottomSheetModalRef.current.dismiss();
    }
  };

  const handleDeleteUnit = async () => {
    deleteUnitBottomSheetModalRef.current.present();
  };

  const handleDeleteUnitConfirm = async () => {
    const response = await deleteUnit('share', id);
    if (response?.success) {
      router.replace('/(tabs)');
      router.dismissAll();
    }
  };

  useEffect(() => {
    getShareDetailsHandler();
  }, [id]);

  return (
    <>
      <CustomBottomModalSheet
        backdropBehave="close"
        enablePanDownToClose={true}
        bottomSheetModalRef={bottomSheetModalRef}
        handleSheetChanges={() => {}}
        snapPoints={['30%']}
        handleDismissModalPress={() => {}}>
        <View className="h-full items-center justify-center">
          <AdminActionItem
            title="الموافقة على الطلب"
            description="هل أنت متاكد من الموافقة على الطلب؟"
            icon={icons.admin_approve}
            color="#3cab3d"
            confirm_color="bg-[#3cab3d]"
            onDeleteConfirm={handleApproveUnitConfirm}
            onClose={() => bottomSheetModalRef.current.dismiss()}
            confirmLoading={approveUnitLoading}
          />
        </View>
      </CustomBottomModalSheet>
      <CustomBottomModalSheet
        backdropBehave="close"
        enablePanDownToClose={true}
        bottomSheetModalRef={closeUnitBottomSheetModalRef}
        handleSheetChanges={() => {}}
        snapPoints={['30%']}
        handleDismissModalPress={() => {}}>
        <View className="h-full items-center justify-center">
          {shareDetailsResponse?.closed == 0 ? (
            <AdminActionItem
              title="إتمام الصفقة"
              description="هل أنت متاكد من إتمام الصفقة؟"
              icon={icons.admin_approve}
              color="#314158"
              confirm_color="bg-[#314158]"
              onDeleteConfirm={handleCloseUnitConfirm}
              onClose={() => closeUnitBottomSheetModalRef.current.dismiss()}
              confirmLoading={closeUnitLoading}
            />
          ) : (
            <View className="items-center justify-center">
              <Text className="font-psemibold text-lg text-black">الصفقة مغلقة بالفعل</Text>
            </View>
          )}
        </View>
      </CustomBottomModalSheet>
      <CustomBottomModalSheet
        backdropBehave="close"
        enablePanDownToClose={true}
        bottomSheetModalRef={deleteUnitBottomSheetModalRef}
        handleSheetChanges={() => {}}
        snapPoints={['30%']}
        handleDismissModalPress={() => {}}>
        <View className="h-full items-center justify-center">
          <AdminActionItem
            title="حذف الطلب"
            description="هل أنت متاكد من حذف الطلب؟"
            icon={icons.delete_icon}
            color="#82181A"
            confirm_color="bg-[#82181A]"
            onDeleteConfirm={handleDeleteUnitConfirm}
            onClose={() => deleteUnitBottomSheetModalRef.current.dismiss()}
            confirmLoading={deleteUnitLoading}
          />
        </View>
      </CustomBottomModalSheet>
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
            <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} justify-between`}>
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
              {(user?.privilege == 'admin' || user?.user_id == shareDetailsResponse?.user?.id) && (
                <View className="mt-2 px-4">
                  {shareDetailsResponse?.approve == 0 && (
                    <CustomLinear
                      title={shareDetailsResponse?.approve == 1 ? 'متاح' : 'قيد المراجعة'}
                      colors={['#e3a001', '#b87005', '#95560b', '#7a460d', '#7a460d']}
                      positionOfGradient="leftToRight"
                      textStyles="text-white !text-xs mt-1"
                      buttonStyles="rounded-lg py-1 px-8"
                    />
                  )}
                </View>
              )}
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
              {user?.user_id == shareDetailsResponse?.user?.id && user?.privilege !== 'admin' ? (
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
                <>
                  {user?.privilege !== 'admin' && (
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

                  {user?.privilege == 'admin' && (
                    <>
                      {shareDetailsResponse?.approve == 0 && (
                        <View className={`gap-2 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
                          <CustomButton
                            hasGradient={true}
                            colors={['#3cab3d', '#2d8c2e', '#266f27', '#2d8c2e', '#3cab3d']}
                            title={'الموافقة على الطلب'}
                            containerStyles={'flex-grow'}
                            positionOfGradient={'leftToRight'}
                            textStyles={'text-white'}
                            buttonStyles={'h-[45px]'}
                            handleButtonPress={handleApproveUnit}
                          />
                        </View>
                      )}
                      <View className={`gap-2 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mt-4`}>
                        <CustomButton
                          hasGradient={true}
                          colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
                          title={'تعديل الطلب'}
                          containerStyles={'flex-grow'}
                          positionOfGradient={'leftToRight'}
                          textStyles={'text-white'}
                          buttonStyles={'h-[45px]'}
                          handleButtonPress={() => router.push(`/(edit)/share/${id}`)}
                        />
                      </View>
                      <View className={`gap-2 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mt-4`}>
                        <CustomButton
                          hasGradient={true}
                          colors={['#314158', '#62748E', '#90A1B9', '#90A1B9', '#90A1B9']}
                          title={'إتمام الصفقة'}
                          containerStyles={'flex-grow'}
                          positionOfGradient={'leftToRight'}
                          textStyles={'text-white'}
                          buttonStyles={'h-[45px]'}
                          handleButtonPress={handleCloseUnit}
                        />
                        <CustomButton
                          hasGradient={true}
                          colors={['#82181A', '#82181A', '#82181A', '#9F0712', '#C10007']}
                          title={'حذف الطلب'}
                          containerStyles={'flex-grow'}
                          positionOfGradient={'leftToRight'}
                          textStyles={'text-white'}
                          buttonStyles={'h-[45px]'}
                          handleButtonPress={handleDeleteUnit}
                        />
                      </View>
                    </>
                  )}
                </>
              )}
            </View>
          </>
        )}
      </SafeAreaView>
    </>
  );
};

export default SharesDetails;
