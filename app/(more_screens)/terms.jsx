import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomePageHeader from '@/components/HomePageHeader';

const TermsScreen = () => {
  return (
    <SafeAreaView className="flex-1">
      <HomePageHeader hasActions={false} customActions={false} />
      <ScrollView className="flex-1 px-4">
        <View>
          <Text className="font-pbold text-2xl text-black">اتفاقية استخدام تطبيق "عقاري"</Text>
          <Text className="mt-2 font-pregular text-base">
            اتفاقية الاستخدام هذه تحدد الشروط والأحكام التي تحكم استخدامك لتطبيق "عقاري". باستخدام
            التطبيق، فإنك توافق على الالتزام بهذه الشروط.
          </Text>
          <Text className="font-pbold text-xl text-black mt-4">الشروط والأحكام:</Text>
          <Text className="mt-2 font-pregular text-base">
            • الاستخدام الشخصي: التطبيق مخصص للاستخدام الشخصي لمعرفة أسعار العقارات ومن ثم التواصل
            مع فريق عقاري والذي يلعب دور الوسيط مقابل عمولة معلومة عند العقد.{'\n'}• المسؤولية: أنت
            مسؤول عن الحفاظ على سرية بيانات حسابك والحفاظ على جوالك من الاستخدام من طرف ثالث.{'\n'}•
            حقوق الملكية الفكرية: جميع الحقوق في التطبيق ومحتواه تعود إلى مالك التطبيق.{'\n'}•
            الإنهاء: نحتفظ بالحق في إنهاء حسابك في أي وقت.{'\n'}• التعويض: أنت توافق على تعويضنا عن
            أي خسارة نتعرض لها بسبب انتهاكك لهذه الاتفاقية.{'\n'}• البيانات الشخصية: أنت توافق على
            أننا سنقوم بجمع واستخدام بياناتك الشخصية وفقًا لسياسة الخصوصية.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsScreen;
