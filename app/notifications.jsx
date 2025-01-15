import { View, Text, TouchableOpacity, I18nManager } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomIcon from '@/components/CustomIcon';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import { useNotificationsStore } from '@/store/notifications.store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Header = () => {
  return (
    <View
      className={`flex-row items-center justify-between px-2 py-3 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
      <TouchableOpacity
        onPress={() => router.back()}
        className={`flex-row items-center ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
        <CustomIcon containerStyles="border-[0]">
          <Entypo name="chevron-right" size={24} color="#000" />
        </CustomIcon>
        <Text
          className={`font-psemibold text-lg ${I18nManager.isRTL ? 'text-right' : 'text-left'} mt-2`}>
          الإشعارات
        </Text>
      </TouchableOpacity>
      <View>
        <Text className="text-right font-psemibold text-base underline">تحديد الجميع كمقروء</Text>
      </View>
    </View>
  );
};

const NotificationItem = ({ notification }) => {
  return (
    <TouchableOpacity
      className={`flex-row items-start gap-3 px-2 py-3 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
      <MaterialIcons name="notes" size={24} color="black" />
      <View className="flex-1">
        <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
          <Text
            className={`mt-1 font-psemibold text-lg ${I18nManager.isRTL ? 'rtl-text' : 'ltr-text'}`}>
            {notification.title}
          </Text>
        </View>
        <View className={`mt-4 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
          <Text
            className={`text-justify font-pmedium text-base ${I18nManager.isRTL ? 'rtl-text' : 'ltr-text'}`}>
            {notification.body}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Notifications = () => {
  const { getNotifications, notificationLoading, notificationResponse } = useNotificationsStore();
  const [notifications, setNotifications] = useState({});
  const getNotificationsList = async () => {
    const response = await getNotifications();
    setNotifications(response);
  };

  useEffect(() => {
    getNotificationsList();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />
      <View>
        {notifications.data &&
          notifications.data.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
      </View>
    </SafeAreaView>
  );
};

export default Notifications;
