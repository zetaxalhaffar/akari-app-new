import { View, Text, Image, I18nManager, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import images from '@/constants/images';
import { router } from 'expo-router';
import { useNotificationsStore } from '@/store/notifications.store';

const HomePageHeader = ({ hasActions = true, customActions = false, children }) => {
  const handleLogoPress = () => {
    router.dismissAll();
    router.push('(tabs)');
  };

  const { notificationCount } = useNotificationsStore();

  return (
    <View
      className={` flex-row items-center justify-between px-4 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
      <TouchableOpacity onPress={handleLogoPress} className={`flex-row items-center`}>
        <Image source={images.only_word} className="h-24 w-24" resizeMode="contain" />
      </TouchableOpacity>
      {hasActions && !customActions && (
        <View className={`items-center gap-2 ${I18nManager.isRTL ? 'ltr-view' : 'rtl-view'}`}>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/(tabs)/more' })}
            className="flex-row items-center gap-2 rounded-full border border-toast-200 bg-toast-100 p-2">
            <Feather name="user" size={20} color="#a47764" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/notifications',
              })
            }
            className="relative flex-row items-center rounded-full p-2">
            {notificationCount > 0 && (
              <View className={'tpo-0 absolute left-0 top-0 h-2 w-2 rounded-full bg-red-600'}></View>
            )}
            <Feather name="bell" size={20} color="#a47764" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: '/search',
              })
            }
            className="flex-row items-center rounded-full p-2">
            <Feather name="search" size={20} color="#a47764" />
          </TouchableOpacity>
        </View>
      )}
      {hasActions && customActions && children}
    </View>
  );
};

export default HomePageHeader;
