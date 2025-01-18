import React, { useState } from 'react';
import { View, Text, Image, I18nManager, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import CustomIcon from '../../components/CustomIcon';
import { Link, router } from 'expo-router';
import images from '../../constants/images';
import PhoneInput from 'react-native-international-phone-number';
import CustomButton from '@/components/CustomButton.jsx';
import { useAuthStore } from '../../store/auth.store';
import { notify } from 'react-native-notificated';
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
      });
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
    <SafeAreaView className="flex-1 bg-white">
      <View className={`m-3 mb-0 ${I18nManager.isRTL ? 'ltr-view' : 'rtl-view'}`}>
        <CustomIcon
          handleOnIconPress={() => {
            router.back();
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

      <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} container-view mt-6 !pb-0`}>
        <Text className={`${I18nManager.isRTL ? 'rtl-text' : 'ltr-text'} font-psemibold text-xl`}>
          أدخل رقم تليفونك
        </Text>
      </View>
      <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} container-view !py-0`}>
        <Text
          className={`${I18nManager.isRTL ? 'rtl-text' : 'ltr-text'} font-psemibold text-base text-gray-500`}>
          الرجاء استخدام رقم تليفونك لتسجيل الدخول
        </Text>
      </View>
      <View
        style={{ flexGrow: 1 }}
        className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} container-view mt-12 !py-0`}>
        <PhoneInput
          phoneInputStyles={{
            flagContainer: {
              backgroundColor: 'transparent',
            },
            container: {
              borderColor: '#a47764',
              borderWidth: 1,
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
            title={'إبدأ الان'}
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
  );
};

export default LoginScreen;
