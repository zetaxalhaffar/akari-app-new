import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import HomePageHeader from '@/components/HomePageHeader';

const PrivacyScreen = () => {
  return (
    <SafeAreaView className="flex-1">
      <HomePageHeader hasActions={false} customActions={false} />
      <ScrollView className="flex-1 px-4">
        <View>
          <Text className="font-pbold text-2xl text-black">سياسية الخصوصية</Text>
          <Text className="mt-2 font-pregular  text-base">
            تهدف هذه السياسة إلى شرح كيفية جمعنا واستخدامنا وحماية معلوماتك الشخصية عند استخدامك
            لتطبيق "عقاري". نحن ملتزمون بحماية خصوصيتك، ونضمن لك أن معاملتك لبياناتك ستكون وفقًا
            لأعلى معايير الأمان والقوانين السورية المعمول بها.
          </Text>
          <Text className="mt-4 font-pbold text-2xl text-black">البيانات التي نجمعها:</Text>
          <Text className="mt-2 font-pregular  text-base">
            • بيانات التسجيل: اسم المستخدم، رقم الهاتف.{'\n'}• بيانات التحقق: رقم الهوية الوطني،
            تاريخ الميلاد، الكنية (للتحقق من هوية المستخدم).{'\n'}• الطرفيات المستخدمة للتحقق :
            الكميرا، سوف يتم طلب إعطاء الإذن لاستخدام كاميرا الجوال لأخذ صورة عن الباركود لتوثيق
            الحساب.{'\n'}• بيانات الاستخدام: معلومات حول كيفية استخدامك للتطبيق، مثل الأجهزة التي
            تستخدمها، وتاريخ ووقت دخولك إلى التطبيق، والصفحات التي تزورها، والبحث الذي تقوم به.
            {'\n'}• بيانات الموقع: قد نطلب منك السماح لنا بالوصول إلى موقعك الجغرافي لتقديم خدمات
            أفضل، مثل عرض العقارات القريبة منك.
          </Text>
          <Text className="mt-4 font-pbold text-2xl text-black">كيفية استخدامنا لبياناتك:</Text>
          <Text className="mt-2 font-pregular  text-base">
            • التحقق من الهوية: نستخدم رقم الهوية الوطني، وتاريخ الميلاد، والكنية لتوثيق حسابك.
            {'\n'}• تقديم الخدمات: نستخدم البيانات لتقديم خدمات التطبيق، مثل عرض أسعار الأسهم
            العقارية في دمشق.{'\n'}• التحسين: نقوم بتحليل البيانات لتحسين أداء التطبيق وتجربة
            المستخدم.{'\n'}• التسويق: قد نستخدم بياناتك لإرسال إشعارات لك حول عروض خاصة أو خدمات
            جديدة، مع إعطائك خيار تسجيل الخروج.
          </Text>
          <Text className="mt-4 font-pbold text-2xl text-black">حماية بياناتك:</Text>
          <Text className="mt-2 font-pregular  text-base">
            نحن نلتزم باتخاذ جميع التدابير اللازمة لحماية بياناتك من الوصول غير المصرح به أو التعديل
            أو الكشف عنه أو التدمير. نحن نستخدم تقنيات أمان متطورة لحماية البيانات الحساسة مثل رقم
            الهوية الوطني.
          </Text>
          <Text className="mt-4 font-pbold text-2xl text-black">مشاركة البيانات:</Text>
          <Text className="mt-2 font-pregular  text-base">
            نحن لا نقوم بمشاركة بياناتك الشخصية مع أي أطراف ثالثة، باستثناء الحالات التي يكون فيها
            ذلك مطلوبًا قانونًا أو لحماية حقوقنا.
          </Text>
          <Text className="mt-4 font-pbold text-2xl text-black">حقوقك:</Text>
          <Text className="mt-2 font-pregular  text-base">
            لديك الحق في:{'\n'}• الوصول إلى بياناتك الشخصية: يمكنك طلب نسخة من البيانات التي نحتفظ
            بها عنك.{'\n'}• تصحيح أي معلومات غير صحيحة: يمكنك طلب تصحيح أي معلومات غير صحيحة في ملفك
            الشخصي.{'\n'}• حذف بياناتك: يمكنك طلب حذف بياناتك الشخصية، مع مراعاة الالتزامات
            القانونية.{'\n'}• الاعتراض على معالجة بياناتك: يمكنك الاعتراض على معالجة بياناتك لأغراض
            معينة.
          </Text>
          <Text className="font-pbold text-2xl text-black mt-4">التغييرات على سياسة الخصوصية:</Text>
          <Text className="mt-2 font-pregular  text-base mb-4">
            نحتفظ بالحق في تعديل هذه السياسة في أي وقت. سنقوم بإخطارك بأي تغييرات جوهرية.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyScreen;
