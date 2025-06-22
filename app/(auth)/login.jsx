import CustomButton from '@/components/CustomButton.jsx';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
  I18nManager,
  Image,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import PhoneInput from 'react-native-international-phone-number';
import { notify } from 'react-native-notificated';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomIcon from '../../components/CustomIcon';
import images from '../../constants/images';
import { useAuthStore } from '../../store/auth.store';
const LoginScreen = () => {
  const [form, setForm] = useState({
    phone: '',
  });
  const [selectedCountry, setSelectedCountry] = useState('SY');

  const handleInputValue = (value) => {
    setForm({ ...form, phone: value });
  };

  const handleSelectedCountry = (country) => {
    setSelectedCountry(country);
  };

  const { requestOtp, requestOtpLoading } = useAuthStore();

  const handleLogin = async () => {
    const isDone = await requestOtp({
      phone: form.phone,
      country_code: selectedCountry.cca2,
    });
    console.log(isDone, 'isDone');
    if (isDone.success) {
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: isDone.message,
        },
        config: {
          duration: 10000,
        },
      });
      
      // Ensure RTL is properly configured before navigation
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
      
      router.replace({
        pathname: '(auth)/otpvalidation',
        params: { parent: 'login', phone: form.phone, country_code: selectedCountry.cca2 },
      });
    } else {
      notify('error', {
        params: {
          title: 'حدث خطأ ما',
          description: isDone.message,
        },
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1">
        <View className={`m-3 mb-0 ${I18nManager.isRTL ? 'ltr-view' : 'rtl-view'}`}>
          <CustomIcon
            handleOnIconPress={() => {
              router.replace('/(auth)');
            }}
            containerStyles="border-toast-600 bg-toast-100">
            <EvilIcons name="close" size={22} color="#a47764" className="mb-1" />
          </CustomIcon>
        </View>
        <View className={`${I18nManager.isRTL ? 'items-start' : 'items-end'}`}>
          <Image source={images.row_logo} className="h-24 w-24" />
        </View>
        <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} container-view`}>
          <Text className={`${I18nManager.isRTL ? 'rtl-text' : 'ltr-text'} font-pbold text-2xl`}>
            تسجيل الدخول إلى حسابك
          </Text>
        </View>

        <View
          className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} container-view mt-6 !pb-0`}>
          <Text className={`${I18nManager.isRTL ? 'rtl-text' : 'ltr-text'} font-psemibold text-xl`}>
            أدخل رقم هاتفك
          </Text>
        </View>
        <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} container-view !py-0`}>
          <Text
            className={`${I18nManager.isRTL ? 'rtl-text' : 'ltr-text'} font-psemibold text-base text-gray-500 text-right`}>
        الرجاء إستخدام رقم هاتفك لتسجيل الدخول
          </Text>
        </View>
        <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} container-view !py-0`}>
          <Text
            className={`${I18nManager.isRTL ? 'rtl-text' : 'ltr-text'} font-psemibold text-base text-gray-500 text-right`}>
            سوف يتم إرسال كود تحقق إلى رقمك.
          </Text>
        </View>
        <View
          style={{ flexGrow: 1 }}
          className={`container-view mt-12 !py-0`}>
          <PhoneInput
            phoneInputStyles={{
              flagContainer: {
                backgroundColor: 'transparent',
              },
              container: {
                borderColor: '#a47764',
                borderWidth: 1,
                backgroundColor: 'transparent',
                flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
              },
            }}
            value={form.phone}
            onChangePhoneNumber={handleInputValue}
            selectedCountry={selectedCountry}
            onChangeSelectedCountry={handleSelectedCountry}
            language={'ar'}
            defaultCountry={'SY'}
            style={{
              fontFamily: 'Cairo-Medium',
              minWidth: 160,
              marginHorizontal: 6,
            }}
            excludedCountries={['IL', 'AI']}
            popularCountries={['SY']}
          />
        </View>
        <View className="justify-end self-stretch">
          <View className="mx-4">
            <CustomButton
              hasGradient={true}
              colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
              title={'إرسال الكود'}
              containerStyles={'flex-grow'}
              positionOfGradient={'leftToRight'}
              textStyles={'text-white'}
              buttonStyles={'h-[45px]'}
              handleButtonPress={handleLogin}
              disabled={!form.phone.length}
              loading={requestOtpLoading}
            />
          </View>
          <View className="my-4">
            <Text className="text-center font-psemibold text-base text-gray-500">
              جديد في عقاري؟{' '}
              <Link
                href={{ pathname: '(auth)/signup' }}
                replace
                className="text-primary text-toast-800 underline">
                إنشاء حساب
              </Link>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
