import CustomButton from '@/components/CustomButton.jsx';
import Entypo from '@expo/vector-icons/Entypo';
import { Link, router, useGlobalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useRef, useState } from 'react';
import {
  I18nManager,
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { notify } from 'react-native-notificated';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomIcon from '../../components/CustomIcon';
import CustomOtpTextInput from '../../components/OtpTextInput ';
import { useAuthStore } from '../../store/auth.store';

/* ======================= handle notifications ======================= */
import messaging from '@react-native-firebase/messaging';

/* ======================= handle notifications ======================= */

const OtpValidationScreen = () => {
  const { phone, country_code, parent } = useGlobalSearchParams();
  const form = useRef({
    phone,
    otp_number: '',
    country_code,
  });

  /* ======================= handle notifications ======================= */

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  const [firebaseToken, setFirebaseToken] = useState('');

  useEffect(() => {
    if (requestUserPermission()) {
      messaging()
        .getToken()
        .then((token) => {
          console.log(token, 'fc token');
          setFirebaseToken(token);
        });
    } else {
      console.log('no permission', authStatus);
    }
  }, []);

  /* ======================= handle notifications ======================= */
  const { loginWithOtp, loginWithOtploading, requestOtp, requestOtpLoading } = useAuthStore();
  const [counter, setCounter] = useState(60);
  const timer = useRef(null);

  const startTimer = () => {
    clearInterval(timer.current); // Clear any existing timer
    setCounter(60); // Reset counter to 60
    timer.current = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          clearInterval(timer.current); // Stop the timer at 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    // Start the timer on component mount
    startTimer();

    // Clean up the timer on component unmount
    return () => {
      clearInterval(timer.current);
    };
  }, []);

  const handleResendOtp = async () => {
    const isDone = await requestOtp({ phone, country_code });
    if (isDone.success) {
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: isDone.message,
        },
      });
      startTimer();
    } else {
      notify('error', {
        params: {
          title: 'حدث خطأ ما',
          description: isDone.message,
        },
      });
    }
  };

  const handleOtp = (otp) => {
    form.current.otp_number = otp;
    handleLogin();
  };

  const handleLogin = async () => {
    console.log('handleLogin ========================= 1======================', firebaseToken);
    const isDone = await loginWithOtp({ ...form.current, firebase: firebaseToken ?? '' });
    if (isDone.success) {
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: isDone.message,
        },
      });
      SecureStore.setItemAsync('token', isDone.access_token);
      SecureStore.setItemAsync(
        'user',
        JSON.stringify({
          ...isDone,
        })
      );
      
      // Ensure RTL is properly configured before navigation
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
      
      router.replace({
        pathname: '(tabs)',
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
        <TouchableOpacity
          className={`m-3 mb-3 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} items-center`}>
          <CustomIcon
            handleOnIconPress={() => {
              parent === 'signup'
                ? router.replace({ pathname: '(auth)/signup' })
                : router.replace({ pathname: '(auth)/login' });
            }}
            containerStyles="border-[0]">
            <Entypo name="chevron-right" size={24} color="#000" />
          </CustomIcon>
          <Text
            className={`${I18nManager.isRTL ? 'rtl-text' : 'ltr-text'} mt-2 font-psemibold text-lg`}>
            {parent === 'signup' ? 'إنشاء حساب' : 'تسجيل الدخول'}
          </Text>
        </TouchableOpacity>
        <View
          className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} container-view mt-4 !pb-0`}>
          <Text className={`${I18nManager.isRTL ? 'rtl-text' : 'ltr-text'} font-psemibold text-xl`}>
            تأكيد رقم الهاتف
          </Text>
        </View>
        <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} container-view !py-0`}>
          <Text
            className={`${I18nManager.isRTL ? 'rtl-text' : 'ltr-text'} font-psemibold text-base text-gray-500`}>
            أدخل رمز OTP المكون من 6 أرقام المرسل إلى
          </Text>
        </View>
        <Text
          className={`${I18nManager.isRTL ? 'ltr-text' : 'rtl-text'} px-4 font-psemibold text-base text-gray-500`}>
          {phone}
        </Text>
        <View style={{ flexGrow: 1 }}>
          <View
            className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} container-view mt-12 !py-0`}>
            <CustomOtpTextInput otp={form.current.otp_number} handleOtp={handleOtp} />
          </View>
          <View className="mt-12">
            <View className="items-center justify-center">
              <Text className="text-center font-psemibold text-base text-gray-500">
                لم يصلك الرمز؟{' '}
              </Text>
              <TouchableOpacity
                disabled={counter > 0}
                onPress={handleResendOtp}
                className={`mt-2 items-center justify-center gap-2 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
                <Text
                  className={`text-primary font-pmedium text-lg underline ${counter > 0 ? 'text-gray-400' : 'text-toast-800'}`}>
                  إعادة الإرسال
                </Text>
                {counter > 0 && (
                  <Text className="text-primary font-psemibold text-lg text-toast-800">
                    {counter}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="justify-end self-stretch">
          <View className="mx-4">
            <CustomButton
              hasGradient={true}
              colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
              title={parent === 'signup' ? 'إنشاء حساب' : 'تسجيل الدخول'}
              containerStyles={'flex-grow'}
              positionOfGradient={'leftToRight'}
              textStyles={'text-white'}
              buttonStyles={'h-[45px]'}
              handleButtonPress={handleLogin}
              disabled={!form.current.phone.length}
              loading={loginWithOtploading}
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

export default OtpValidationScreen;
