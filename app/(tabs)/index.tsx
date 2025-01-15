import { router, Stack } from 'expo-router';
import { View, Text, Image, I18nManager, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '@/constants/images';
import Feather from '@expo/vector-icons/Feather';
const HomePageHeader = () => {
  return (
    <View
      className={`flex-row items-center justify-between px-4 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
      <View className={`flex-row items-center`}>
        <Image source={images.only_word} className="h-24 w-24" resizeMode="contain" />
      </View>
      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/notifications',
            })
          }
          className="flex-row items-center gap-2 rounded-full p-2">
          <Feather name="bell" size={20} color="#a47764" />
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center gap-2 rounded-full border border-toast-200 bg-toast-100 p-2">
          <Feather name="user" size={20} color="#a47764" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <HomePageHeader />
    </SafeAreaView>
  );
}
