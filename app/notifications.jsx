import { View, Text, TouchableOpacity, I18nManager } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomIcon from '@/components/CustomIcon';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import { useNotificationsStore } from '@/store/notifications.store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FlashList } from '@shopify/flash-list';
import CustomHeadWithBackButton from '../components/CustomHeadWithBackButton';

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
      <CustomHeadWithBackButton
        title="الإشعارات"
        rightText="تحديد الجميع كمقروء"
        rightTextPress={() => {}}
        handleButtonPress={() => router.back()}
      />
      <View className="flex-1">
        <FlashList
          data={notifications.data}
          renderItem={({ item }) => <NotificationItem notification={item} />}
          estimatedItemSize={200}
          refreshing={notificationLoading}
          onRefresh={getNotificationsList}
        />
      </View>
    </SafeAreaView>
  );
};

export default Notifications;
