import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeadWithBackButton from '../../components/CustomHeadWithBackButton';
import { router } from 'expo-router';
import { useUnitsStore } from '../../store/units.store';
import icons from '../../constants/icons';

const Contact = () => {


  const { shareDetailsResponse, shareDetailsLoading, createSellRequestLoading, createSellRequest, createBuyRequestLoading, createBuyRequest, createApartmentSellRequestLoading, createApartmentSellRequest, createApartmentBuyRequestLoading, createApartmentBuyRequest } = useUnitsStore();



  const handleWhatsappPress = () => {
    Linking.openURL(`https://wa.me/${shareDetailsResponse?.user?.phone}&text=${shareDetailsResponse?.question_message}`);
  }

  const handlePhonePress = () => {
    Linking.openURL(`tel:${shareDetailsResponse?.user?.phone}`);
  }

  const handleDatePress = async () => {
    const typeOfContact = shareDetailsResponse?.transaction_type
    const typeOfPost = shareDetailsResponse?.post_type
    if (typeOfContact == "sell") {
      if (typeOfPost == "apartment") {
        const response = await createApartmentBuyRequest(shareDetailsResponse?.id)
        if (response?.success) {
          router.back()
        }

      } else {
        const response = await createBuyRequest(shareDetailsResponse?.id)
        if (response?.success) {
          router.back()
        }
      }
    } else {
      if (typeOfPost == "apartment") {
        const response = await createApartmentSellRequest(shareDetailsResponse?.id)
        if (response?.success) {
          router.back()
        }
      } else {
        const response = await createSellRequest(shareDetailsResponse?.id)
        if (response?.success) {
          router.back()
        }
      }
    }
  }

  const disabled = createApartmentBuyRequestLoading || createApartmentSellRequestLoading || createBuyRequestLoading || createSellRequestLoading

  const disabledFromServer = shareDetailsResponse.order_status

  useEffect(() => {
    console.log(shareDetailsResponse.order, "in contact")
    if (!shareDetailsResponse?.id) {
      router.back()
    }

  }, [shareDetailsResponse])

  return (
    <SafeAreaView className='flex-1'>
      <CustomHeadWithBackButton
        title="اختر طريقة التواصل"
        handleButtonPress={() => router.back()}
      />
      <View className='px-4 gap-8 mt-6'>

        <TouchableOpacity onPress={handlePhonePress} className='flex-row items-center gap-6'>
          <View className='flex-row items-center bg-gray-200 rounded-lg p-2'>
            <Image tintColor={"#1f2937"} source={icons.phone} className='w-8 h-8' />
          </View>
          <View>
            <Text className='text-lg font-psemibold'>
              عن طريق الهاتف
            </Text>
            <Text className='text-sm font-pregular max-w-[250px]'>
              يمكنك الاتصال المباشر بفريق عقاري للحصول على المساعدة الفورية.
            </Text>
          </View>
        </TouchableOpacity>
        <View className='h-[1px] bg-gray-200' />
        <TouchableOpacity onPress={handleWhatsappPress} className='flex-row items-center gap-6'>
          <View className='flex-row items-center gap-2 bg-gray-200 rounded-lg p-2'>
            <Image tintColor={"#1f2937"} source={icons.whatsapp} className='w-8 h-8' />
          </View>
          <View>
            <Text className='text-lg font-psemibold'>
              عن طريق الوتساب
            </Text>
            <Text className='text-sm font-pregular max-w-[250px]'>
              تواصل معنا بسهولة إما عن طريق الدردشة النصية أو إجراء مكالمة صوتية.

            </Text>
          </View>
        </TouchableOpacity>
        <View className='h-[1px] bg-gray-200' />
        <TouchableOpacity onPress={handleDatePress} className={`flex-row items-center gap-6 ${disabled || disabledFromServer ? 'opacity-50' : ''}`} disabled={disabled || disabledFromServer}>
          <View className='flex-row items-center gap-2 bg-gray-200 rounded-lg p-2'>
            <Image tintColor={"#1f2937"} source={icons.date} className='w-8 h-8' />
          </View>
          <View>
            <Text className='text-lg font-psemibold'>
              ترتيب موعد
            </Text>
            <Text className='text-sm font-pregular max-w-[250px]'>
              أرسل طلبك إلينا وسيقوم فريق عقاري بالتواصل معك لتحديد الموعد المناسب وترتيب كافة التفاصيل.
            </Text>
            {disabledFromServer && (
              <View className='bg-toast-900 rounded-lg p-2 mt-2 self-start'>
                <Text className='text-white text-xs font-psemibold mt-1'>
                  تم ترتيب موعد مسبقا
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


export default Contact;
