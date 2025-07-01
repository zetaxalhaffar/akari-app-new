import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Linking, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeadWithBackButton from '../../components/CustomHeadWithBackButton';
import { router } from 'expo-router';
import { useUnitsStore } from '../../store/units.store';
import icons from '../../constants/icons';
import images from '../../constants/images';
import CustomButton from '../../components/CustomButton';
import CustomBottomModalSheet from '@/components/CustomBottomModalSheet';
import { useOrdersStore } from '../../store/orders.store';
import CustomAlert from '../../components/CustomAlert';

const Contact = () => {
  const {
    shareDetailsResponse,
    apartmentDetailsResponse,
    createSellRequestLoading,
    createSellRequest,
    createBuyRequestLoading,
    createBuyRequest,
    createApartmentSellRequestLoading,
    createApartmentSellRequest,
    createApartmentBuyRequestLoading,
    createApartmentBuyRequest,
  } = useUnitsStore();

  const { deleteOrder, deleteOrderLoading } = useOrdersStore();

  const [contactMethod, setContactMethod] = useState(null);
  const [alertInfo, setAlertInfo] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const handleWhatsappPress = () => {
    setContactMethod('whatsapp');
    intentionBottomSheetModalRef.current.present();
  };

  const handlePhonePress = () => {
    setContactMethod('phone');
    intentionBottomSheetModalRef.current.present();
  };

  const intentionBottomSheetModalRef = useRef(null);

  const onIntentionClose = () => {
    intentionBottomSheetModalRef.current.dismiss();
  };

  const performDateAction = async () => {
    const typeOfContact =
      shareDetailsResponse?.transaction_type || apartmentDetailsResponse?.transaction_type;
    const typeOfPost = shareDetailsResponse?.post_type || apartmentDetailsResponse?.post_type;

    if (typeOfContact == 'sell') {
      if (typeOfPost == 'apartment') {
        const response = await createApartmentBuyRequest(
          shareDetailsResponse?.id || apartmentDetailsResponse?.id
        );
        if (response?.success) {
          router.back();
        }
      } else {
        const response = await createBuyRequest(
          shareDetailsResponse?.id || apartmentDetailsResponse?.id
        );
        if (response?.success) {
          router.back();
        }
      }
    } else {
      if (typeOfPost == 'apartment') {
        const response = await createApartmentSellRequest(
          shareDetailsResponse?.id || apartmentDetailsResponse?.id
        );
        if (response?.success) {
          router.back();
        }
      } else {
        const response = await createSellRequest(
          shareDetailsResponse?.id || apartmentDetailsResponse?.id
        );
        if (response?.success) {
          router.back();
        }
      }
    }
  };

  const cleanPhoneNumber = (number) => {
    if (!number) return '';
    // Remove all non-digit characters except for the leading '+'
    return number.replace(/[^+\d]/g, '');
  };

  const proceedWithAction = async () => {
    const phoneNumber = shareDetailsResponse?.user?.phone || apartmentDetailsResponse?.user?.phone;
    const cleanedPhoneNumber = cleanPhoneNumber(phoneNumber);

    if (contactMethod === 'phone') {
      if (cleanedPhoneNumber) {
        Linking.openURL(`tel:${cleanedPhoneNumber}`);
      } else {
        setAlertInfo({
          visible: true,
          title: 'خطأ',
          message: 'رقم الهاتف غير متوفر',
        });
      }
    } else if (contactMethod === 'whatsapp') {
      if (cleanedPhoneNumber) {
        const ownerName = `${(shareDetailsResponse?.user?.name || apartmentDetailsResponse?.user?.name) || ''} ${(shareDetailsResponse?.user?.surname || apartmentDetailsResponse?.user?.surname) || ''}`.trim();
        const question = shareDetailsResponse?.question_message || apartmentDetailsResponse?.question_message;
        const defaultMessage = `مرحبا ${ownerName}, أود الاستفسار عن العقار المعروض`;
        const whatsappUrl = `whatsapp://send?phone=${cleanedPhoneNumber}&text=${encodeURIComponent(question || defaultMessage)}`;
        
        try {
          const supported = await Linking.canOpenURL(whatsappUrl);
          if (supported) {
            await Linking.openURL(whatsappUrl);
          } else {
            setAlertInfo({
              visible: true,
              title: 'خطأ',
              message: 'تطبيق واتساب غير مثبت على هذا الجهاز',
            });
          }
        } catch (error) {
          setAlertInfo({
            visible: true,
            title: 'خطأ',
            message: 'حدث خطأ أثناء فتح واتساب',
          });
        }
      } else {
        setAlertInfo({
          visible: true,
          title: 'خطأ',
          message: 'رقم الهاتف غير متوفر',
        });
      }
    } else if (contactMethod === 'date') {
      performDateAction();
    }
    setContactMethod(null); // Reset
  };

  const handleIntentionSelection = (intention) => {
    const typeOfContact =
      shareDetailsResponse?.transaction_type || apartmentDetailsResponse?.transaction_type;
    onIntentionClose();
    if (intention === 'buy') {
      if (typeOfContact === 'sell') {
        proceedWithAction();
      } else {
        setTimeout(() => {
          setAlertInfo({
            visible: true,
            title: 'خطأ',
            message: 'لا يمكنك الشراء من هذا الإعلان لأنه طلب شراء.',
          });
        }, 500);
      }
    } else if (intention === 'sell') {
      if (typeOfContact === 'buy') {
        proceedWithAction();
      } else {
        setTimeout(() => {
          setAlertInfo({
            visible: true,
            title: 'خطأ',
            message: 'لا يمكنك البيع لهذا الإعلان لأنه بالفعل إعلان بيع.',
          });
        }, 500);
      }
    }
  };

  const handleDatePress = () => {
    setContactMethod('date');
    intentionBottomSheetModalRef.current.present();
  };

  const handleAIChatPress = () => {
    /*
    const question = shareDetailsResponse?.question_message || apartmentDetailsResponse?.question_message;
    // Navigate to chat with the question message to be auto-sent
    router.push({
      pathname: '/chat',
      params: {
        autoMessage: question || 'مرحبا، أحتاج المساعدة بهذا الإعلان'
      }
    });
    */
    router.push('/chat');
  };

  const disabled =
    createApartmentBuyRequestLoading ||
    createApartmentSellRequestLoading ||
    createBuyRequestLoading ||
    createSellRequestLoading;

  const disabledFromServer =
    shareDetailsResponse?.order_status || apartmentDetailsResponse?.order_status;

  useEffect(() => {
    if (!shareDetailsResponse?.id && !apartmentDetailsResponse?.id) {
      router.back();
    }
  }, [shareDetailsResponse, apartmentDetailsResponse]);

  const bottomSheetModalRef = useRef(null);

  const onClose = () => {
    bottomSheetModalRef.current.dismiss();
  };

  const onDeleteConfirm = async () => {
    const isDone = await deleteOrder(shareDetailsResponse?.orderable?.id || apartmentDetailsResponse?.orderable?.id);
    console.log('isDone', isDone);
    if (isDone.success) {
      bottomSheetModalRef.current.dismiss();
      router.back();
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <CustomAlert
        visible={alertInfo.visible}
        title={alertInfo.title}
        message={alertInfo.message}
        onConfirm={() => setAlertInfo({ ...alertInfo, visible: false })}
      />
      <CustomBottomModalSheet
        backdropBehave="close"
        enablePanDownToClose={true}
        enableDynamicSizing={true}
        bottomSheetModalRef={intentionBottomSheetModalRef}
        handleSheetChanges={() => {}}
        handleDismissModalPress={() => {}}>
        <View className="items-center justify-center p-4">
          <Text className="mt-4 font-psemibold text-xl">مالذي تريد ان تفعله؟</Text>
          <View
            className={`m-4 flex items-center justify-center gap-2 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
            <CustomButton
              hasGradient={false}
              title={'أريد أن أشتري'}
              containerStyles={'flex-grow'}
              positionOfGradient={'leftToRight'}
              textStyles={'text-black'}
              buttonStyles={'h-[45px]'}
              handleButtonPress={() => handleIntentionSelection('buy')}
            />
            <CustomButton
              hasGradient={true}
              title={'أريد أن أبيع'}
              containerStyles={'flex-grow'}
              positionOfGradient={'leftToRight'}
              textStyles={'text-white'}
              buttonStyles={'h-[45px]'}
              handleButtonPress={() => handleIntentionSelection('sell')}
            />
          </View>
        </View>
      </CustomBottomModalSheet>
      <CustomBottomModalSheet
        backdropBehave="close"
        enablePanDownToClose={true}
        snapPoints={['20%']}
        bottomSheetModalRef={bottomSheetModalRef}
        handleSheetChanges={() => {}}
        handleDismissModalPress={() => {}}>
        <View className="h-full items-center justify-center">
          <Text className="mt-4 font-psemibold text-xl">هل أنت متأكد من إلغاء الإعلان؟</Text>
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
              loading={deleteOrderLoading}
            />
          </View>
        </View>
      </CustomBottomModalSheet>
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
            <Text className="max-w-[300px] font-pregular text-base">
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
            <Text className="max-w-[300px] font-pregular text-base">
              تواصل معنا بسهولة إما عن طريق الدردشة النصية أو إجراء مكالمة صوتية.
            </Text>
          </View>
        </TouchableOpacity>
        <View className="h-[1px] bg-gray-200" />
        <TouchableOpacity onPress={handleAIChatPress} className="flex-row items-center gap-6">
          <View className="flex-row items-center justify-center rounded-lg bg-gray-200 p-2 h-12 w-12">
            <Text className="text-2xl font-bold text-gray-800">AI</Text>
          </View>
          <View>
            <Text className="font-psemibold text-lg">عن طريق الدردشة مع الذكاء الصناعي</Text>
            <Text className="max-w-[300px] font-pregular text-base">
              احصل على إجابات فورية ومساعدة ذكية حول استفساراتك العقارية من خلال مساعدنا الذكي المتخصص.
            </Text>
          </View>
        </TouchableOpacity>
        <View className="h-[1px] bg-gray-200" />
        <View>
          <TouchableOpacity
            onPress={handleDatePress}
            className={`flex-row items-center gap-6 ${disabled || disabledFromServer ? 'opacity-50' : ''}`}
            disabled={disabled || disabledFromServer}>
            <View className="flex-row items-center gap-2 rounded-lg bg-gray-200 p-2">
              <Image tintColor={'#1f2937'} source={icons.date} className="h-8 w-8" />
            </View>
            <View>
              <Text className="font-psemibold text-lg">ترتيب موعد</Text>
              <Text className="max-w-[300px] font-pregular text-base">
                أرسل إعلانك إلينا وسيقوم فريق عقاري بالتواصل معك لتحديد الموعد المناسب وترتيب كافة
                التفاصيل.
              </Text>
            </View>
          </TouchableOpacity>
          {disabledFromServer && (
            <View
              className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}  flex-row items-center justify-between gap-2 px-16`}>
              <View
                className={`mt-2 self-start rounded-lg bg-toast-900 p-2 ${disabled || disabledFromServer ? 'opacity-50' : ''}`}>
                <Text className="mt-1 font-psemibold text-xs text-white">تم ترتيب موعد مسبقا</Text>
              </View>
              <TouchableOpacity onPress={() => bottomSheetModalRef.current.present()}>
                <View className="mt-2 flex items-center justify-center rounded-lg bg-red-700 p-2 px-4">
                  <Text className="mt-1 font-psemibold text-xs text-white">إلغاء الموعد</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Contact;
