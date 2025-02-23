import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeadWithBackButton from '../../components/CustomHeadWithBackButton';
import { router } from 'expo-router';
import { useUnitsStore } from '../../store/units.store';
import icons from '../../constants/icons';

const Contact = () => {
  const {
    shareDetailsResponse,
    apartmentDetailsResponse,
    shareDetailsLoading,
    createSellRequestLoading,
    createSellRequest,
    createBuyRequestLoading,
    createBuyRequest,
    createApartmentSellRequestLoading,
    createApartmentSellRequest,
    createApartmentBuyRequestLoading,
    createApartmentBuyRequest,
  } = useUnitsStore();

  const handleWhatsappPress = () => {
    Linking.openURL(
      `https://wa.me/${shareDetailsResponse?.user?.phone || apartmentDetailsResponse?.user?.phone}?text=${shareDetailsResponse?.question_message || apartmentDetailsResponse?.question_message}`
    );
  };

  const handlePhonePress = () => {
    Linking.openURL(`tel:${shareDetailsResponse?.user?.phone || apartmentDetailsResponse?.user?.phone}`);
  };

  const handleDatePress = async () => {
    const typeOfContact = shareDetailsResponse?.transaction_type || apartmentDetailsResponse?.transaction_type;
    const typeOfPost = shareDetailsResponse?.post_type || apartmentDetailsResponse?.post_type;
    if (typeOfContact == 'sell') {
      if (typeOfPost == 'apartment') {
        const response = await createApartmentBuyRequest(shareDetailsResponse?.id || apartmentDetailsResponse?.id);
        if (response?.success) {
          router.back();
        }
      } else {
        const response = await createBuyRequest(shareDetailsResponse?.id || apartmentDetailsResponse?.id);
        if (response?.success) {
          router.back();
        }
      }
    } else {
      if (typeOfPost == 'apartment') {
        const response = await createApartmentSellRequest(shareDetailsResponse?.id || apartmentDetailsResponse?.id);
        if (response?.success) {
          router.back();
        }
      } else {
        const response = await createSellRequest(shareDetailsResponse?.id || apartmentDetailsResponse?.id);
        if (response?.success) {
          router.back();
        }
      }
    }
  };

  const disabled =
    createApartmentBuyRequestLoading ||
    createApartmentSellRequestLoading ||
    createBuyRequestLoading ||
    createSellRequestLoading;

  const disabledFromServer = shareDetailsResponse?.order_status || apartmentDetailsResponse?.order_status;

  useEffect(() => {
    if (!shareDetailsResponse?.id && !apartmentDetailsResponse?.id) {
      router.back();
    }
  }, [shareDetailsResponse, apartmentDetailsResponse]);

  return (
    <SafeAreaView className="flex-1">
      <CustomHeadWithBackButton
        title="اختر طريقة التواصل"
        handleButtonPress={() => router.back()}
      />
      <View className="mt-6 gap-8 px-4">
        <TouchableOpacity onPress={handlePhonePress} className="flex-row items-center gap-6">
          <View className="flex-row items-center rounded-lg bg-gray-200 p-2">
            <Image tintColor={'#1f2937'} source={icons.phone} className="h-8 w-8" />
          </View>
          <View>
            <Text className="font-psemibold text-lg">عن طريق الهاتف</Text>
            <Text className="max-w-[250px] font-pregular text-sm">
              يمكنك الاتصال المباشر بفريق عقاري للحصول على المساعدة الفورية.
            </Text>
          </View>
        </TouchableOpacity>
        <View className="h-[1px] bg-gray-200" />
        <TouchableOpacity onPress={handleWhatsappPress} className="flex-row items-center gap-6">
          <View className="flex-row items-center gap-2 rounded-lg bg-gray-200 p-2">
            <Image tintColor={'#1f2937'} source={icons.whatsapp} className="h-8 w-8" />
          </View>
          <View>
            <Text className="font-psemibold text-lg">عن طريق الوتساب</Text>
            <Text className="max-w-[250px] font-pregular text-sm">
              تواصل معنا بسهولة إما عن طريق الدردشة النصية أو إجراء مكالمة صوتية.
            </Text>
          </View>
        </TouchableOpacity>
        <View className="h-[1px] bg-gray-200" />
        <TouchableOpacity
          onPress={handleDatePress}
          className={`flex-row items-center gap-6 ${disabled || disabledFromServer ? 'opacity-50' : ''}`}
          disabled={disabled || disabledFromServer}>
          <View className="flex-row items-center gap-2 rounded-lg bg-gray-200 p-2">
            <Image tintColor={'#1f2937'} source={icons.date} className="h-8 w-8" />
          </View>
          <View>
            <Text className="font-psemibold text-lg">ترتيب موعد</Text>
            <Text className="max-w-[250px] font-pregular text-sm">
              أرسل طلبك إلينا وسيقوم فريق عقاري بالتواصل معك لتحديد الموعد المناسب وترتيب كافة
              التفاصيل.
            </Text>
            {disabledFromServer && (
              <View className="mt-2 self-start rounded-lg bg-toast-900 p-2">
                <Text className="mt-1 font-psemibold text-xs text-white">تم ترتيب موعد مسبقا</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Contact;
