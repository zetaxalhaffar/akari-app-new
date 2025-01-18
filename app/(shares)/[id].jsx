import { router, useGlobalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Image, ScrollView, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUnitsStore } from '../../store/units.store';
import CustomHeadWithBackButton from '../../components/CustomHeadWithBackButton';
import { AntDesign } from '@expo/vector-icons';
import CustomImageSlider from '@/components/CustomImageSlider';
import CustomButton from '@/components/CustomButton';
import icons from '../../constants/icons';



const UnitDetails = ({ item }) => {
  return (
    <View className="py-4 px-4">
      <View className={`p-4 border border-toast-100 rounded-lg`}>
        <Text className="text-lg font-psemibold text-black">
          تفاصيل الوحدة
        </Text>
        <Text className="text-sm font-pregular text-zinc-600">
          {item?.transaction_type === "buy" ? (
            <Text className={"text-zinc-500 font-pregular"}>
              نرغب بشراء اسهم تنظيمية
              في {item?.sector?.code?.view_code} بكمية {item?.quantity} سهم
              بسعر {item?.price} ل.س بالسهم في منطقة {item?.region?.name}
            </Text>) : (<Text className={"text-zinc-500 font-pregular"}>
              نرغب ببيع اسهم تنظيمية
              في {item?.sector?.code?.view_code} بكمية {item?.quantity} سهم
              بسعر {item?.price} ل.س بالسهم في منطقة {item?.region?.name}
            </Text>)}
        </Text>
      </View>
      <View className="mt-4 flex-row gap-2">
        <View className="flex-1 p-4 border border-toast-100 rounded-lg">
          <Image source={icons.price} className="w-7 h-7 mb-1" tintColor="#a47764" />
          <Text className="text-base font-pmedium text-zinc-600">
            سعر السهم المطروح
          </Text>
          <Text className={`text-sm font-pregular text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
            {item?.price}
          </Text>
        </View>
        <View className="flex-1 p-4 border border-toast-100 rounded-lg">
          <Image source={icons.quantity} className="w-7 h-7 mb-1" tintColor="#a47764" />
          <Text className="text-base font-pmedium text-zinc-600">
            الأسهم المطروحة
          </Text>
          <Text className={`text-sm font-pregular text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
            {item?.quantity}
          </Text>
        </View>
      </View>
      <View className="mt-4 flex-row gap-2">
        <View className="flex-1 p-4 border border-toast-100 rounded-lg">
          <Image source={icons.location} className="w-7 h-7 mb-1" tintColor="#a47764" />
          <Text className="text-base font-pmedium text-zinc-600">
            المنطقة
          </Text>
          <Text className="text-sm font-pregular text-zinc-600">
            {item?.region?.name}
          </Text>
        </View>
        <View className="flex-1 p-4 border border-toast-100 rounded-lg">
          <Image source={icons.sector} className="w-7 h-7 mb-1" tintColor="#a47764" />
          <Text className="text-base font-pmedium text-zinc-600">
            القطاع
          </Text>
          <Text className="text-sm font-pregular text-zinc-600">
            {item?.sector?.code?.name}
          </Text>
        </View>
        <View className="flex-1 p-4 border border-toast-100 rounded-lg">
          <Image source={icons.section_number} className="w-7 h-7 mb-1" tintColor="#a47764" />
          <Text className="text-base font-pmedium text-zinc-600">
            رقم المقسم
          </Text>
          <Text className="text-sm font-pregular text-zinc-600">
            {item?.sector?.code?.view_code}
          </Text>
        </View>
      </View>
      <View className="mt-4 flex-row gap-2">
        <View className="flex-1 p-4 border border-toast-100 rounded-lg">
          <Image source={icons.owner} className="w-7 h-7 mb-1" tintColor="#a47764" />
          <Text className="text-base font-pmedium text-zinc-600">
            مالك الوحدة
          </Text>
          <Text className={`text-sm font-pregular text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
            {item?.owner_name}
          </Text>
        </View>
      </View>
    </View>
  )
}


const SharesDetails = () => {
  // Get the id from the url
  const { id } = useGlobalSearchParams();

  // init store
  const { getShareDetails, shareDetailsResponse, shareDetailsLoading } = useUnitsStore();

  const handleShare = () => {
    console.log(shareDetailsResponse)
  }



  const getShareDetailsHandler = async () => {
    if (!id) return;
    await getShareDetails(id);
  }


  useEffect(() => {
    getShareDetailsHandler();
  }, [id]);


  return (
    <SafeAreaView className="flex-1">
      {shareDetailsLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="100" color="#a47764" />
        </View>
      ) : (
        <>
          <CustomHeadWithBackButton
            title="تفاصيل الوحدة"
            rightIcon={<AntDesign name="sharealt" size={24} color="black" />}
            rightIconPress={handleShare}
            handleButtonPress={() => router.back()}
          />
          <View>
            <View className="px-4">
              <Text className="text-xl font-psemibold">
                {shareDetailsResponse?.sector?.code?.name} - {shareDetailsResponse?.sector?.code?.view_code}
              </Text>
              <Text className="text-sm font-pregular text-zinc-600">
                {shareDetailsResponse?.region?.name} - {shareDetailsResponse?.post_type == 'share' ? 'أسهم تنظيمية' : 'عقارات'}
              </Text>
            </View>
          </View>
          <ScrollView>
            <View className="flex-1">
              {shareDetailsResponse && <CustomImageSlider images={shareDetailsResponse?.photos} height={300} newImages={shareDetailsResponse} />}
              <View className="mt-4">
                <UnitDetails item={shareDetailsResponse} />
              </View>
            </View>
          </ScrollView>
          <View className="p-4">
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
          </View>
        </>

      )}
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({})

export default SharesDetails;

