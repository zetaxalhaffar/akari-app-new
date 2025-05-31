import { ScrollView, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import CustomHeadWithBackButton from '@/components/CustomHeadWithBackButton';
import CustomSelecteBox from '@/components/CustomSelecteBox.jsx';

import { Input } from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton.jsx';
import { useAdminStore } from '../../store/admin.store';

const Notifications = () => {
  /* ================= Admin Store ===================*/
  const { sendBulkMessage, sendBulkMessageLoading } = useAdminStore();
  /* ================= Admin Store ===================*/

  const notificationContentTypes = useMemo(
    () => [
      {
        value: 'txt',
        id: 'txt',
        name: 'رسالة نصية',
        size: 20,
        color: '#a47764',
      },
      {
        value: 'share',
        id: 'share',
        name: 'عرض أسهم تنظيمية',
        size: 20,
        color: '#a47764',
      },
      {
        value: 'apartment',
        id: 'apartment',
        name: 'عرض عقار',
        size: 20,
        color: '#a47764',
      },

      {
        value: 'url',
        id: 'url',
        name: 'إعلان',
        align: 'start',
        size: 20,
        color: '#a47764',
      },
    ],
    []
  );

  const [form, setForm] = useState({
    title: '',
    body: '',
    type: '',
    content: '',
  });

  const handleSendMessage = async () => {
    const isDone = await sendBulkMessage(form);
    console.log(isDone);
    // setForm({
    //   title: '',
    //   body: '',
    //   type: '',
    //   content: '',
    // });
  };

  return (
    <SafeAreaView className="h-screen flex-1">
      <CustomHeadWithBackButton title="رسائل جماعية" handleButtonPress={() => router.back()} />
      <ScrollView className="flex-1 px-4">
        <View className="my-2">
          <CustomSelecteBox
            value={form.type}
            setValue={(value) => setForm({ ...form, type: value })}
            arrayOfValues={notificationContentTypes}
            valueKey="id"
            placeholder="نوع الرسالة"
            hideLoading={true}
          />
        </View>
        <View className="my-2">
          <Input
            placeholder="العنوان"
            value={form.title}
            onChangeText={(value) => setForm({ ...form, title: value })}
            type="text"
          />
        </View>
        <View className="my-2">
          <Input
            placeholder="الرسالة"
            value={form.body}
            onChangeText={(value) => setForm({ ...form, body: value })}
            type="text"
            multiline={true}
            numberOfLines={6}
          />
        </View>
        <View className="my-2">
          <Input
            placeholder="المحتوى"
            value={form.content}
            onChangeText={(value) => setForm({ ...form, content: value })}
            type="text"
            multiline={true}
            numberOfLines={6}
          />
        </View>
      </ScrollView>
      <View className="mb-6 px-4">
        <CustomButton
          hasGradient={true}
          colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
          title={'إرسال الرسالة'}
          containerStyles={'flex-grow'}
          positionOfGradient={'leftToRight'}
          textStyles={'text-white'}
          buttonStyles={'h-[45px]'}
          handleButtonPress={handleSendMessage}
          loading={sendBulkMessageLoading}
        />
      </View>
    </SafeAreaView>
  );
};

export default Notifications;
