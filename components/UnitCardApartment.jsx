import { router } from 'expo-router';
import { View, Text, TouchableOpacity, Image, I18nManager } from 'react-native';
import CustomLinear from './CustomLinear';
import icons from '@/constants/icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';

const gradientPositions = {
  topToBottom: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  bottomToTop: { start: { x: 0, y: 1 }, end: { x: 0, y: 0 } },
  leftToRight: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  rightToLeft: { start: { x: 1, y: 0 }, end: { x: 0, y: 0 } },
};


const UnitApartmentCard = ({ item }) => {
  const user = JSON.parse(SecureStore.getItem('user'));

  const handleApartmentPress = () => {
    router.push(`/(apartments)/${item.id}`);
  };

  return (
    <TouchableOpacity
      onPress={item.closed != 1 ? handleApartmentPress : null}
      activeOpacity={item.closed != 1 ? 0.8 : 1}
      className="relative my-3 h-[350px] w-full overflow-hidden rounded-lg border border-toast-900/50">
      {item.closed == 1 && (
        <LinearGradient
          style={{ borderRadius: 6 }}
          colors={['#633e3d', '#774B46DB', '#8D5E52A1', '#0000005C', '#0000001B']}
          className={`absolute z-20 flex h-full w-full flex-row items-center justify-center gap-2 rounded-lg p-2`}
          start={gradientPositions.bottomToTop.start}
          end={gradientPositions.bottomToTop.end}>
          <Text className="py-4 font-psemibold text-6xl text-white">
            {item.transaction_type == 'sell' ? 'تم البيع' : 'تم الشراء'}
          </Text>
        </LinearGradient>
      )}
      <View
        className={`absolute z-10 m-3 rounded-t-lg border-toast-500 ${I18nManager.isRTL ? 'right-0' : 'left-0'}`}>
        <CustomLinear
          title={item.transaction_type == 'sell' ? 'بيع' : 'شراء'}
          colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
          positionOfGradient="leftToRight"
          textStyles="text-white !text-xs mt-1"
          buttonStyles="rounded-lg py-1 px-8"
        />
      </View>
      <View
        className={`absolute z-10 m-3 rounded-t-lg border-toast-500 ${I18nManager.isRTL ? 'left-0' : 'right-0'}`}>
        <CustomLinear
          title={`${item.id}#`}
          colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
          positionOfGradient="leftToRight"
          textStyles="text-white !text-xs mt-1"
          buttonStyles="rounded-lg py-1 px-8"
        />
        {(user?.privilege == 'admin' || user?.user_id == item?.user?.id) && (
          <View className="mt-2">
            {item.approve == 0 && (
              <CustomLinear
                title={item.approve == 1 ? 'متاح' : 'قيد المراجعة'}
                colors={['#e3a001', '#b87005', '#95560b', '#7a460d', '#7a460d']}
                positionOfGradient="leftToRight"
                textStyles="text-white !text-xs mt-1"
                buttonStyles="rounded-lg py-1 px-8"
              />
            )}
          </View>
        )}
      </View>
      <Image source={{ uri: item?.sector?.cover?.img }} className="h-full w-full" />
      <View className="absolute inset-0 bottom-0 w-full rounded-lg bg-toast-900/90 p-4 backdrop-blur-sm">
        <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} justify-between gap-4`}>
          <Text className="font-psemibold text-xl text-white">
            {item?.sector?.sector_name?.name} - {item?.sector?.sector_name?.code}
          </Text>
          {item?.user?.authenticated == '1' ? (
            <Image source={icons.gold} className="h-8 w-8" tintColor="#eae2db" />
          ) : (
            <View />
          )}
        </View>
        <Text className="mb-1 font-pregular text-base text-white">
          {item.region?.name} - {item.post_type == 'share' ? 'أسهم تنظيمية' : 'عقارات'}
        </Text>
        <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} flex-wrap items-center gap-1`}>
          <View className="flex-row items-center gap-1">
            <Image
              source={icons.price}
              className={'h-6 w-6'}
              tintColor={'#FFF'}
              resizeMode="contain"
            />
            <Text className="font-pmedium text-sm text-white">سعر العقار : {item.price}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Image
              source={icons.direction}
              className={'h-6 w-6'}
              tintColor={'#FFF'}
              resizeMode="contain"
            />
            <Text className="font-pmedium text-sm text-white">
              اتجاه العقار : {item.direction.name}
            </Text>
          </View>
        </View>
        <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mt-1 flex-wrap items-center gap-1`}>
          <View className="flex-row items-center gap-1">
            <Image
              source={icons.date}
              className={'h-6 w-6'}
              tintColor={'#FFF'}
              resizeMode="contain"
            />
            <Text className="font-pmedium text-sm text-white">تاريخ النشر : {item.since}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Image
              source={icons.view}
              className={'h-6 w-6'}
              tintColor={'#FFF'}
              resizeMode="contain"
            />
            <Text className="font-pmedium text-sm text-white">المشاهدات: {item.views}</Text>
          </View>
        </View>
        <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mt-1 flex-wrap items-center gap-1`}>
          <View className="flex-row items-center gap-1">
            <Image
              source={icons.home_screen_active}
              className={'h-6 w-6'}
              tintColor={'#FFF'}
              resizeMode="contain"
            />
            <Text className="font-pmedium text-sm text-white">
              نوع العقار : {item?.apartment_type?.name}
            </Text>
          </View>
          {(user?.privilege == 'admin' || user?.user_id == item?.user?.id) && (
            <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} flex-row items-center gap-1`}>
              <Image
                source={icons.user}
                className={'h-6 w-6'}
                tintColor={'#FFF'}
                resizeMode="contain"
              />
              <Text className="font-pmedium text-sm text-white">
                الجهة العارضة : {item.owner_name}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UnitApartmentCard;
