import { View, Text, Image, Linking } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeadWithBackButton from '../../components/CustomHeadWithBackButton';
import icons from '../../constants/icons';
import { router } from 'expo-router';
import CustomButton from '../../components/CustomButton';
import { getSecureStoreNoAsync } from '@/composables/secure.store';

const Premium = () => {
  const user = getSecureStoreNoAsync('user');

  return (
    <SafeAreaView className="flex-1">
      <CustomHeadWithBackButton title="الحساب الذهبي" handleButtonPress={() => router.back()} />
      <View className="items-center justify-center">
        <Image source={icons.gold} tintColor={'#a47764'} />
        <View className="w-full px-4 mt-4">
          <Text className="text-md font-pregular text-zinc-600">
            <Text className="font-pbold">الحساب الذهبي</Text>: ارتقِ بعروضك إلى مستوى أعلى مع مزايا
            حصرية!
          </Text>
          <Text className="text-md font-pregular text-zinc-600">
            نقدم لك <Text className="font-pbold">الحساب الذهبي</Text>، وهو مستوى مميز يمنحك مزايا
            إضافية وحصرية لتعزيز ظهور عروضك بشكل استثنائي. بالإضافة إلى ميزات الحساب المميز
          </Text>
        </View>
        <View className="w-full px-4 py-4">
          <Text className="font-pbold text-lg text-zinc-600">يشمل الحساب الذهبي</Text>
          <Text className="text-md font-pregular text-zinc-600">
            - سوف تظهر علامة النجمة الذهبية مع كل عرض تقوم بنشرة
          </Text>
          <Text className="text-md font-pregular text-zinc-600">
            - ظهور عروضك بدون الحاجه لموافقة الإدارة  
          </Text>
          <Text className="text-md font-pregular text-zinc-600">
            - ظهورًا أعلى في نتائج البحث
          </Text>
          <Text className="text-md font-pregular text-zinc-600">
            - أدوات تحليل متقدمة
          </Text>
          <Text className="text-md font-pregular text-zinc-600">
            - دعمًا فنيًا ذو أولوية.
          </Text>
        </View>
        <View className="my-4 h-[1px] w-full bg-zinc-200"></View>
        <View className="w-full px-4 pt-4">
          <Text className="text-md font-pregular text-zinc-600">
            لترقية حسابك إلى <Text className="font-pbold">الحساب الذهبي</Text> والتمتع بالمزايا
            الحصرية، يرجى التواصل مع فريق الدعم الفني. سيقدم لك الفريق المزيد من التفاصيل حول هذه
            الميزة وكيفية الاشتراك بها.
          </Text>
        </View>
        <View className="w-full px-4">
          <CustomButton
            hasGradient={false}
            title={'واتساب'}
            containerStyles={'flex-grow mx-4 mt-4'}
            positionOfGradient={'leftToRight'}
            textStyles={'text-black text-green-500'}
            buttonStyles={'h-[45px] border border-green-500'}
            handleButtonPress={() => {
              Linking.openURL(`https://wa.me/${user?.support_phone}`);
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Premium;
