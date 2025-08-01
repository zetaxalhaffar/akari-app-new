import CustomButton from '@/components/CustomButton.jsx';
import { Input } from '@/components/CustomInput';
import CustomSelecteBox from '@/components/CustomSelecteBox.jsx';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Checkbox from 'expo-checkbox';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { I18nManager, Image, Keyboard, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import PhoneInput from 'react-native-international-phone-number';
import { notify } from 'react-native-notificated';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomIcon from '../../components/CustomIcon';
import images from '../../constants/images';
import { useAuthStore } from '../../store/auth.store';
import { useEnumsStore } from '../../store/enums.store';

const LoginScreen = () => {
  // handle enum store
  const { getJobTitles, jobTitlesSchemaResponse } = useEnumsStore();
  const { signup, signupSchema, signupLoading } = useAuthStore();

  const getJobTitlesList = async () => {
    await getJobTitles();
  };

  useEffect(() => {
    getJobTitlesList();
  }, []);
  // handle enum store
  const [form, setForm] = useState({
    country_code: 'SY',
    phone: '',
    name: '',
    job_title: 0,
  });
  const [selectedCountry, setSelectedCountry] = useState('SY');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleInputValue = (value) => {
    setForm({ ...form, phone: value });
  };

  const handleSelectedCountry = (country) => {
    setForm({ ...form, country_code: country.cca2 });
    setSelectedCountry(country);
  };

  const handleOpenTerms = () => {
    router.push({
      pathname: '/(more_screens)/information',
      params: { url: 'https://arrows-dev.versetech.net/terms.html' }
    });
  };

  const handleSignup = async () => {
    if (!agreeToTerms) {
      notify('error', { 
        params: { 
          title: 'موافقة مطلوبة', 
          description: 'يجب الموافقة على شروط الاستخدام للمتابعة' 
        } 
      });
      return;
    }
    
    const isDone = await signup(form);
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
      router.replace({
        pathname: '(auth)/otpvalidation',
        params: {
          phone: form.phone,
          country_code: form.country_code,
          parent: 'signup',
        },
      });
    } else {
      notify('error', { params: { title: 'حدث خطأ ما', description: isDone.message } });
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
        <View>
          <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mt-4 px-4`}>
            <Text
              className={`${I18nManager.isRTL ? 'rtl-text' : 'ltr-text'} py-2 font-pbold text-2xl`}>
              إنشاء حساب جديد
            </Text>
          </View>
          <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} container-view !py-0`}>
            <Text
              className={`${I18nManager.isRTL ? 'rtl-text' : 'ltr-text'} font-psemibold text-base text-gray-500`}>
              يرجى إدخال التفاصيل التالية لإنشاء حسابك
            </Text>
          </View>
        </View>
        <View style={{ flexGrow: 1 }} className={`container-view mt-12 !py-0`}>
          <View>
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
          <View className="my-4">
            <Input
              placeholder="الاسم"
              value={form.name}
              onChangeText={(value) => setForm({ ...form, name: value })}
            />
          </View>
          <View className="mb-4">
            <CustomSelecteBox
              value={form.job_title}
              setValue={(value) => setForm({ ...form, job_title: value })}
              arrayOfValues={jobTitlesSchemaResponse}
              valueKey="id"
              placeholder="المسمى الوظيفي"
              label="المسمى الوظيفي"
            />
          </View>
          
          <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mb-4 items-center gap-3`}>
            <Checkbox
              value={agreeToTerms}
              onValueChange={setAgreeToTerms}
              color={agreeToTerms ? '#a47764' : '#B71C1C'}
            />
            <TouchableOpacity onPress={handleOpenTerms}>
              <Text className={`${I18nManager.isRTL ? 'rtl-text' : 'ltr-text'} font-psemibold text-base text-toast-800`}>
                أوافق على شروط الإستخدام 
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="justify-end self-stretch">
          <View className="mx-4">
            <CustomButton
              hasGradient={true}
              colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
              title={'حساب جديد'}
              containerStyles={'flex-grow'}
              positionOfGradient={'leftToRight'}
              textStyles={'text-white'}
              buttonStyles={'!h-[45px]'}
              handleButtonPress={handleSignup}
              loading={signupLoading}
              disabled={!agreeToTerms || !form.phone.length}
            />
          </View>
          <View className="my-4">
            <Text className="text-center font-psemibold text-base text-gray-500">
              هل لديك حساب؟{' '}
              <Link
                href={{ pathname: '(auth)/login' }}
                replace
                className="text-primary text-toast-800 underline">
                تسجيل الدخول
              </Link>
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
