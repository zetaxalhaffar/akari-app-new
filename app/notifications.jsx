import { View, Text, TouchableOpacity, I18nManager, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useNotificationsStore } from '@/store/notifications.store';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FlashList } from '@shopify/flash-list';
import CustomHeadWithBackButton from '../components/CustomHeadWithBackButton';
import EmptyScreen from '../components/EmptyScreen';
import images from '../constants/images';

const NotificationItem = ({ notification }) => {
  return (
    <TouchableOpacity
      className={`flex items-center gap-6 px-4 py-3 ${I18nManager.isRTL ? 'rtl-view ' : 'ltr-view'}`}>
      <View className="flex-row items-center rounded-lg bg-gray-200 p-2">
        <MaterialIcons name="notes" size={24} color="black" />
      </View>
      <View className="flex-1">
        <Text className={`mt-1 font-psemibold text-lg`}>{notification.title}</Text>

        <Text className={`font-pmedium text-base`}>{notification.body}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Notifications = () => {
  const {
    getNotifications,
    notificationLoading,
    notificationResponse,
    deleteAllNotifications,
    deleteAllNotificationsLoading,
    setNotificationCount,
  } = useNotificationsStore();
  const [notifications, setNotifications] = useState({});
  const getNotificationsList = async () => {
    const response = await getNotifications();
    setNotifications(response);
    setNotificationCount(0);
  };

  const handleDeleteAllNotifications = async () => {
    const response = await deleteAllNotifications();
    console.log(response);
    getNotificationsList();
  };

  useEffect(() => {
    getNotificationsList();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <CustomHeadWithBackButton
        title="الإشعارات"
        rightText="حذف الاشعارات"
        rightTextPress={
          notifications.data && notifications.data.length > 0 ? handleDeleteAllNotifications : null
        }
        handleButtonPress={() => router.back()}
        rightTextLoading={deleteAllNotificationsLoading}
      />
      <View className="flex-1">
        <FlashList
          data={notifications.data}
          renderItem={({ item }) => <NotificationItem notification={item} />}
          estimatedItemSize={200}
          refreshing={notificationLoading}
          onRefresh={getNotificationsList}
          ListEmptyComponent={() =>
            notificationLoading ? (
              <Text />
            ) : (
              <EmptyScreen title="لا يوجد إشعارات" img={images.empty_notifications} />
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Notifications;
