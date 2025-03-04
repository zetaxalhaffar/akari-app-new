import { router } from 'expo-router';
import { View, Text, TouchableOpacity, Image, I18nManager } from 'react-native';
import CustomLinear from './CustomLinear';
import icons from '@/constants/icons';
import { LinearGradient } from 'expo-linear-gradient';
import { getSecureStoreNoAsync } from '@/composables/secure.store';

const gradientPositions = {
  topToBottom: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  bottomToTop: { start: { x: 0, y: 1 }, end: { x: 0, y: 0 } },
  leftToRight: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  rightToLeft: { start: { x: 1, y: 0 }, end: { x: 0, y: 0 } },
};

const user = getSecureStoreNoAsync('user');

const UnitShareCard = ({ item }) => {
  const handleSharePress = () => {
    router.push(`/(shares)/${item.id}`);
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={item.closed != 1 ? 0.8 : 1}
        onPress={item.closed != 1 ? handleSharePress : null}
        className="relative my-3 h-[350px] w-full overflow-hidden rounded-lg border border-toast-900/50">
        {item.closed == 1 && (
          <LinearGradient
            style={{ borderRadius: 6 }}
            colors={['#633e3d', '#774B46DB', '#8D5E52A1', '#0000005C', '#0000001B']}
            className={`absolute z-20 flex h-full w-full flex-row items-center justify-center gap-2 rounded-lg p-2`}
            start={gradientPositions.bottomToTop.start}
            end={gradientPositions.bottomToTop.end}>
            <Text
              className="py-4 font-psemibold text-6xl text-white"
              style={{
                textShadowColor: 'rgba(119, 75, 70, 0.75)',
                textShadowOffset: { width: -1, height: 1 },
                textShadowRadius: 10,
              }}>
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
        <Image source={{ uri: item.sector.cover.img }} className="h-full w-full" />
        <View className="absolute inset-0 bottom-0 w-full rounded-lg bg-toast-900/90 p-4 backdrop-blur-sm">
          <Text className="font-psemibold text-xl text-white">
            {item.sector.sector_name.name} - {item.sector.sector_name.code}
          </Text>
          <Text className="mb-1 font-pregular text-base text-white">
            {item.region.name} - {item.post_type == 'share' ? 'أسهم تنظيمية' : 'عقارات'}
          </Text>
          <View className="flex-row flex-wrap items-center gap-1">
            <View className="flex-row items-center gap-1">
              <Image
                source={icons.price}
                className={'h-6 w-6'}
                tintColor={'#FFF'}
                resizeMode="contain"
              />
              <Text className="font-pmedium text-sm text-white">سعر السهم : {item.price}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Image
                source={icons.quantity}
                className={'h-6 w-6'}
                tintColor={'#FFF'}
                resizeMode="contain"
              />
              <Text className="font-pmedium text-sm text-white">
                الأسهم المطروحة : {item.quantity}
              </Text>
            </View>
          </View>
          <View className="mt-1 flex-row flex-wrap items-center gap-1">
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
          <View className="mt-1 flex-row flex-wrap items-center gap-1">
            <View className="flex-row items-center gap-1">
              <Image
                source={icons.user}
                className={'h-6 w-6'}
                tintColor={'#FFF'}
                resizeMode="contain"
              />
              <Text className="font-pmedium text-sm text-white">
                صاحب العلاقة : {item.owner_name}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default UnitShareCard;
