import { router, useGlobalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  Share,
  I18nManager,
  Alert,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUnitsStore } from '../../store/units.store';
import CustomHeadWithBackButton from '../../components/CustomHeadWithBackButton';
import { AntDesign } from '@expo/vector-icons';
import CustomImageSlider from '@/components/CustomImageSlider';
import CustomButton from '@/components/CustomButton';
import icons from '../../constants/icons';
import { getSecureStoreNoAsync } from '@/composables/secure.store';
import CustomBottomSheet from '@/components/CustomBottomSheet';
import DeleteItem from '../../components/DeleteItem';
import CustomBottomModalSheet from '@/components/CustomBottomModalSheet';
import { useAdminStore } from '../../store/admin.store';
import AdminActionItem from '../../components/AdminActionItem';
import CustomLinear from '../../components/CustomLinear';

// Imports for Reaction Functionality
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useReactionStore } from '@/store/reaction.store';
import { useFavoriteStore } from '@/store/favorite.store';

// Animated Emoji Button Component
const EmojiButton = ({ emoji, onPress, isSelected }) => {
  const scale = useSharedValue(1);
  const backgroundColor = useSharedValue(isSelected ? '#e5e7eb' : '#f3f4f6');

  useEffect(() => {
    scale.value = withSpring(isSelected ? 1.2 : 1);
    backgroundColor.value = withTiming(isSelected ? '#d1d5db' : '#f3f4f6', { duration: 150 });
  }, [isSelected, scale, backgroundColor]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: backgroundColor.value,
    };
  });

  return (
    <TouchableOpacity onPress={onPress}>
      <Animated.View className="rounded-full p-2" style={animatedStyle}>
        <Text className="text-xl">{emoji}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Available Reactions
const availableReactions = [
  { value: 'like', icon: '👍🏼', title: 'أعجبني' },
  { value: 'love', icon: '❤️', title: 'أحببته' },
  { value: 'wow', icon: '😮', title: 'أدهشني' },
  { value: 'sad', icon: '😢', title: 'احزنني' },
  { value: 'angry', icon: '😠', title: 'أغضبني' },
];

const OwnersSection = ({ owners }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!owners) return null;
  
  const ownersList = owners.split(', ');
  const maxInitialOwners = 3;
  const hasMoreOwners = ownersList.length > maxInitialOwners;
  const displayedOwners = isExpanded ? ownersList : ownersList.slice(0, maxInitialOwners);
  const remainingCount = ownersList.length - maxInitialOwners;

  return (
    <View className="mt-4 rounded-lg border border-toast-100 p-4">
      <Text className="font-pmedium text-base text-zinc-600">المالكين</Text>
      <View className="mt-2">
        {displayedOwners.map((owner, index) => (
          <View key={index} className="mb-1 flex-row items-center">
            <View className="mr-2 h-1 w-1 rounded-full bg-zinc-400" />
            <Text className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-right' : 'text-left'}`}>
              {owner.trim()}
            </Text>
          </View>
        ))}
        
        {hasMoreOwners && !isExpanded && (
          <TouchableOpacity 
            onPress={() => setIsExpanded(true)}
            className="mt-2"
            activeOpacity={0.7}
          >
            <CustomLinear
              title={`عرض جميع المالكين (${remainingCount} آخرين)`}
              colors={['#bda28c', '#a47764', '#8d5e52', '#774b46', '#633e3d']}
              positionOfGradient="leftToRight"
              textStyles="text-white !text-sm font-pmedium"
              buttonStyles="rounded-md py-2 px-3 flex-row items-center"
              icon={<AntDesign name="down" size={14} color="white" style={{ marginLeft: 4 }} />}
              iconPosition="right"
            />
          </TouchableOpacity>
        )}
        
        {isExpanded && (
          <TouchableOpacity 
            onPress={() => setIsExpanded(false)}
            className="mt-2"
            activeOpacity={0.7}
          >
            <CustomLinear
              title="إخفاء المالكين"
              colors={['#f8f9fa', '#e9ecef', '#dee2e6', '#ced4da', '#adb5bd']}
              positionOfGradient="leftToRight"
              textStyles="!text-sm font-pmedium"
              textColor="#633e3d"
              buttonStyles="rounded-md py-2 px-3 flex-row items-center justify-center border border-gray-200"
              icon={<AntDesign name="up" size={14} color="#633e3d" style={{ marginRight: 4 }} />}
              iconPosition="left"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const UnitDetails = ({
  item,
  displayedReaction,
  showReactions,
  onLikePress,
  onLikeLongPress,
  onReactionSelect,
  onOpenReactionsModal,
  onDismissReactions,
  displayedFavorite,
  onFavoritePress,
}) => {
  const user = getSecureStoreNoAsync('user');

  // Conditions for showing extra details
  const roomsCountValue = item?.rooms_count;
  const showRooms = roomsCountValue != null && parseInt(String(roomsCountValue), 10) > 0;

  const salonsCountValue = item?.salons_count;
  const showSalons = salonsCountValue != null && parseInt(String(salonsCountValue), 10) > 0;

  const balconyCountValue = item?.balcony_count;
  const showBalcony = balconyCountValue != null && parseInt(String(balconyCountValue), 10) > 0;

  const showTerrace = item?.is_taras === 1 || item?.is_taras === '1';
  const showApartmentStatus = !!item?.apartment_status?.name;
  const showApartmentType = !!item?.apartment_type?.name;

  const showExtraDetailsSection =
    showRooms ||
    showSalons ||
    showBalcony ||
    showTerrace ||
    showApartmentStatus ||
    showApartmentType;

  return (
    <View className="px-4 py-4">
      {/* Reaction UI Integrated Here */}
      <View className="mb-4">
        <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mb-2 items-center justify-between px-1 py-1`}>
          {item?.reaction_counts?.total_count > 0 && (
            <TouchableOpacity onPress={onOpenReactionsModal} activeOpacity={0.7}>
              <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} items-center gap-1`}>
                <View
                  className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} items-center gap-1`}>
                  {item?.reaction_counts?.like_count > 0 && (
                    <Text>{item?.reaction_counts?.like_count > 0 ? '👍🏼' : ''}</Text>
                  )}
                  {item?.reaction_counts?.angry_count > 0 && (
                    <Text>{item?.reaction_counts?.angry_count > 0 ? '😠' : ''}</Text>
                  )}
                  {item?.reaction_counts?.love_count > 0 && (
                    <Text>{item?.reaction_counts?.love_count > 0 ? '❤️' : ''}</Text>
                  )}
                  {item?.reaction_counts?.sad_count > 0 && (
                    <Text>{item?.reaction_counts?.sad_count > 0 ? '😢' : ''}</Text>
                  )}
                  {item?.reaction_counts?.wow_count > 0 && (
                    <Text>{item?.reaction_counts?.wow_count > 0 ? '😮' : ''}</Text>
                  )}
                </View>
                <Text>{item?.reaction_counts?.total_count}</Text>
              </View>
            </TouchableOpacity>
          )}
          <View>
            <Text className="font-psemibold text-sm text-gray-600">{item?.views} مشاهدة</Text>
          </View>
        </View>

        {showReactions && (
          <>
            {/* Overlay to dismiss reactions when touching outside */}
            <Pressable
              className="absolute inset-0 z-10"
              style={{
                position: 'absolute',
                top: -1000,
                bottom: -1000,
                left: -1000,
                right: -1000,
              }}
              onPress={onDismissReactions}
            />
            <Animated.View
              className="absolute bottom-12 left-2 z-20 flex-row items-center gap-2 rounded-full border border-gray-300 bg-white p-1 shadow-lg drop-shadow-sm"
              style={{
                elevation: 5,
                transform: [{ translateX: I18nManager.isRTL ? -10 : 10 }],
                bottom: 50, // Adjust as needed
              }}>
              {availableReactions.map((reaction) => (
                <EmojiButton
                  key={reaction.value}
                  emoji={reaction.icon}
                  onPress={() => onReactionSelect(reaction.value)}
                />
              ))}
            </Animated.View>
          </>
        )}

        <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} my-2 flex-row gap-2`}>
          <TouchableOpacity
            onPress={onLikePress}
            onLongPress={onLikeLongPress}
            delayLongPress={200}
            className="relative flex-1 items-center justify-center rounded-md border border-gray-200 py-3 hover:bg-gray-100 active:bg-gray-200">
            {(() => {
              const reactionObj = availableReactions.find((r) => r.value === displayedReaction);
              if (reactionObj) {
                return (
                  <View
                    className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} flex flex-row items-center justify-center gap-2`}>
                    <Text className="text-lg">{reactionObj.icon}</Text>
                    <Text className="text-md font-psemibold capitalize text-gray-700">
                      {reactionObj.title}
                    </Text>
                  </View>
                );
              }
              return (
                <View
                  className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} flex flex-row items-center justify-center gap-2`}>
                  <AntDesign name="like2" size={18} color="#374151" />
                  <Text className="text-md mt-1 font-psemibold text-gray-700">إعجاب</Text>
                </View>
              );
            })()}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onFavoritePress}
            className="relative flex-1 items-center justify-center rounded-md border border-gray-200 py-3 hover:bg-gray-100 active:bg-gray-200">
            <View
              className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} flex flex-row items-center justify-center gap-2`}>
              <AntDesign 
                name={displayedFavorite ? "star" : "staro"} 
                size={18} 
                color={displayedFavorite ? "#FFD700" : "#374151"} 
              />
              <Text className="text-md mt-1 font-psemibold text-gray-700">مفضلة</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View className={`rounded-lg border border-toast-100 p-4`}>
        <Text className="font-psemibold text-lg text-black">تفاصيل العقار</Text>
        <Text className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} font-pregular text-sm text-zinc-600`}>
          {item?.transaction_type === 'buy' ? (
            <Text className={'font-pregular text-base text-zinc-500'}>
              نرغب بشراء عقار في {item?.sector?.code?.view_code} بكمية {item?.equity} حصة سهمية بسعر{' '}
              {item?.price} في منطقة {item?.region?.name}
            </Text>
          ) : (
            <Text className={'font-pregular text-base text-zinc-500'}>
              نرغب ببيع عقار في {item?.sector?.code?.view_code} بكمية {item?.equity} حصة سهمية بسعر{' '}
              {item?.price}  في منطقة {item?.region?.name}
            </Text>
          )}
        </Text>       
         <Text
          className={`font-pregular mt-2 text-sm text-zinc-500 ${
            I18nManager.isRTL ? 'text-left' : 'text-right'
          }`}>
          تم النشر {item?.since}
        </Text>
      </View>
      <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mt-4 flex-row gap-2`}>
        <View className="flex-1 rounded-lg border border-toast-100 p-4">
          <Image source={icons.price} className="mb-1 h-7 w-7" tintColor="#a47764" />
          <Text className="font-pmedium text-base text-zinc-600">سعر العقار</Text>
          <Text
            className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
            {item?.price} 
          </Text>
        </View>
        {item?.payment_method_id !== 0 && item?.payment_method && (
          <View className="flex-1 rounded-lg border border-toast-100 p-4">
            <Image source={icons.price} className="mb-1 h-7 w-7" tintColor="#a47764" />
            <Text className="font-pmedium text-base text-zinc-600">طريقة الدفع</Text>
            <Text
              className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
              {item?.payment_method?.name}
            </Text>
          </View>
        )}
        <View className="flex-1 rounded-lg border border-toast-100 p-4">
          <Image source={icons.quantity} className="mb-1 h-7 w-7" tintColor="#a47764" />
          <Text className="font-pmedium text-base text-zinc-600">اسهم العقار</Text>
          <Text
            className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
            {item?.equity}
          </Text>
        </View>
      </View>
      <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mt-4 flex-row gap-2`}>
        <View className="flex-1 rounded-lg border border-toast-100 p-4">
          <Image source={icons.location} className="mb-1 h-7 w-7" tintColor="#a47764" />
          <Text className="font-pmedium text-base text-zinc-600">المنطقة</Text>
          <Text className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>{item?.region?.name}</Text>
        </View>
        <View className="flex-1 rounded-lg border border-toast-100 p-4">
          <Image source={icons.sector} className="mb-1 h-7 w-7" tintColor="#a47764" />
          <Text className="font-pmedium text-base text-zinc-600">القطاع</Text>
          <Text className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>{item?.sector?.code?.name}</Text>
        </View>
        <View className="flex-1 rounded-lg border border-toast-100 p-4">
          <Image source={icons.section_number} className="mb-1 h-7 w-7" tintColor="#a47764" />
          <Text className="font-pmedium text-base text-zinc-600">رقم المقسم</Text>
          <Text className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
            {item?.sector?.code?.code}
          </Text>
        </View>
      </View>
      {/* apartment details */}
      <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mt-4 flex-row gap-2`}>
        <View className="flex-1 rounded-lg border border-toast-100 p-4">
          <Image source={icons.area} className="mb-1 h-7 w-7" tintColor="#a47764" />
          <Text className="font-pmedium text-base text-zinc-600">المساحة</Text>
          <Text
            className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
            {item?.area} م2
          </Text>
        </View>
        <View className="flex-1 rounded-lg border border-toast-100 p-4">
          <Image source={icons.floor} className="mb-1 h-7 w-7" tintColor="#a47764" />
          <Text className="font-pmedium text-base text-zinc-600">الطابق</Text>
          <Text
            className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
            {item?.floor || 'أرضي'}
          </Text>
        </View>
        <View className="flex-1 rounded-lg border border-toast-100 p-4">
          <Image source={icons.direction} className="mb-1 h-7 w-7" tintColor="#a47764" />
          <Text className="font-pmedium text-base text-zinc-600">اتجاه العقار</Text>
          <Text
            className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
            {item?.direction?.name}
          </Text>
        </View>

      </View>
      {/* owner details */}
      {(user?.privilege == 'admin' || user?.user_id == item?.user?.id) && (
        <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mt-4 flex-row gap-2`}>
          <View className="flex-1 rounded-lg border border-toast-100 p-4">
            <Image source={icons.owner} className="mb-1 h-7 w-7" tintColor="#a47764" />
            <Text className="font-pmedium text-base text-zinc-600">الجهة العارضة</Text>
            <Text
              className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
              {item?.owner_name}
            </Text>
          </View>
        </View>
      )}
      {/* extra details */}
      {showExtraDetailsSection && (
        <View className="mt-4 gap-2 rounded-lg border border-toast-100 p-4 ">
          <View className=" mb-3">
            <Text className="font-psemibold text-lg text-black">تفاصيل إضافية</Text>
          </View>
          {(() => {
            const availableItems = [];
            
            if (showRooms) {
              availableItems.push(
                <View key="rooms" className="flex-1 rounded-lg">
                  <Image source={icons.rooms} className="mb-1 h-7 w-7" tintColor="#a47764" />
                  <Text className="font-pmedium text-base text-zinc-600">عدد الغرف</Text>
                  <Text
                    className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
                    {item?.rooms_count}
                  </Text>
                </View>
              );
            }
            
            if (showSalons) {
              availableItems.push(
                <View key="salons" className="flex-1 rounded-lg">
                  <Image source={icons.salons} className="mb-1 h-7 w-7" tintColor="#a47764" />
                  <Text className="font-pmedium text-base text-zinc-600">عدد الصالونات</Text>
                  <Text
                    className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
                    {item?.salons_count}
                  </Text>
                </View>
              );
            }
            
            if (showBalcony) {
              availableItems.push(
                <View key="balcony" className="flex-1 rounded-lg">
                  <Image source={icons.balcons} className="mb-1 h-7 w-7" tintColor="#a47764" />
                  <Text className="font-pmedium text-base text-zinc-600">عدد البلكونات</Text>
                  <Text
                    className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
                    {item?.balcony_count}
                  </Text>
                </View>
              );
            }
            
            if (showTerrace) {
              availableItems.push(
                <View key="terrace" className="flex-1 rounded-lg">
                  <Image source={icons.terrace} className="mb-1 h-7 w-7" tintColor="#a47764" />
                  <Text className="font-pmedium text-base text-zinc-600">تراس</Text>
                  <Text
                    className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
                    {item?.is_taras == 1 ? 'موجود' : 'غير موجود'}
                  </Text>
                </View>
              );
            }
            
            if (showApartmentStatus) {
              availableItems.push(
                <View key="status" className="flex-1 rounded-lg">
                  <Image source={icons.apartment_status} className="mb-1 h-7 w-7" tintColor="#a47764" />
                  <Text className="font-pmedium text-base text-zinc-600">حالة العقار</Text>
                  <Text
                    className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
                    {item?.apartment_status?.name}
                  </Text>
                </View>
              );
            }
            
            if (showApartmentType) {
              availableItems.push(
                <View key="type" className="flex-1 rounded-lg">
                  <Image source={icons.building_type} className="mb-1 h-7 w-7" tintColor="#a47764" />
                  <Text className="font-pmedium text-base text-zinc-600">نوع العقار</Text>
                  <Text
                    className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
                    {item?.apartment_type?.name}
                  </Text>
                </View>
              );
            }
            
                         // Group items into rows of 2
             const rows = [];
             for (let i = 0; i < availableItems.length; i += 2) {
               const rowItems = availableItems.slice(i, i + 2);
               rows.push(
                 <View key={`row-${i}`} className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} flex-row gap-7`}>
                   {rowItems}
                 </View>
               );
             }
            
            return rows;
          })()}
        </View>
      )}
             {/* Additional Sector Information */}
      {item?.sector && (() => {
        // Check if any sector details are available
        const hasAnyDetails = 
          item?.sector?.outer_area ||
          item?.sector?.residential_area ||
          (item?.sector?.commercial_area && item?.sector?.commercial_area !== '0') ||
          item?.sector?.floors_number ||
          item?.sector?.total_floor_area ||
          item?.sector?.share_count ||
          item?.sector?.contractor ||
          item?.sector?.engineers ||
          item?.sector?.description ||
          item?.sector?.owners;
        
        if (!hasAnyDetails) return null;
        
        return (
          <View className="mt-4">
            <Text className="mb-2 font-psemibold text-lg text-black">تفاصيل المقسم {item?.sector?.code?.code}</Text>
          
          {/* Areas Row */}
          <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} flex-row gap-2`}>
            {item?.sector?.outer_area && (
              <View className="flex-1 rounded-lg border border-toast-100 p-4">
                <Image source={icons.location} className="mb-1 h-7 w-7" tintColor="#a47764" />
                <Text className="font-pmedium text-base text-zinc-600">مساحة أرض المقسم</Text>
                <Text className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
                  {item?.sector?.outer_area} م²
                </Text>
              </View>
            )}
            {item?.sector?.residential_area && (
              <View className="flex-1 rounded-lg border border-toast-100 p-4">
                <Image source={icons.location} className="mb-1 h-7 w-7" tintColor="#a47764" />
                <Text className="font-pmedium text-base text-zinc-600">المساحة السكنية</Text>
                <Text className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
                  {item?.sector?.residential_area} م²
                </Text>
              </View>
            )}
            {item?.sector?.commercial_area && item?.sector?.commercial_area !== '0' && (
              <View className="flex-1 rounded-lg border border-toast-100 p-4">
                <Image source={icons.location} className="mb-1 h-7 w-7" tintColor="#a47764" />
                <Text className="font-pmedium text-base text-zinc-600">المساحة التجارية</Text>
                <Text className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
                  {item?.sector?.commercial_area} م²
                </Text>
              </View>
            )}
          </View>

          {/* Building Details Row */}
          <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mt-4 flex-row gap-2`}>
            {item?.sector?.floors_number && (
              <View className="flex-1 rounded-lg border border-toast-100 p-4">
                <Image source={icons.sector} className="mb-1 h-7 w-7" tintColor="#a47764" />
                <Text className="font-pmedium text-base text-zinc-600">عدد الطوابق</Text>
                <Text className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
                  {item?.sector?.floors_number} طابق
                </Text>
              </View>
            )}
            {item?.sector?.total_floor_area && (
              <View className="flex-1 rounded-lg border border-toast-100 p-4">
                <Image source={icons.location} className="mb-1 h-7 w-7" tintColor="#a47764" />
                <Text className="font-pmedium text-base text-zinc-600">إجمالي مساحة الطوابق</Text>
                <Text className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
                  {item?.sector?.total_floor_area} م²
                </Text>
              </View>
            )}
            {item?.sector?.share_count && (
              <View className="flex-1 rounded-lg border border-toast-100 p-4">
                <Image source={icons.quantity} className="mb-1 h-7 w-7" tintColor="#a47764" />
                <Text className="font-pmedium text-base text-zinc-600">إجمالي عدد الأسهم</Text>
                <Text className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
                  {item?.sector?.share_count}
                </Text>
              </View>
            )}
          </View>

          {/* People Details Row */}
          <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mt-4 flex-row gap-2`}>
            {item?.sector?.contractor && (
              <View className="flex-1 rounded-lg border border-toast-100 p-4">
                <Image source={icons.owner} className="mb-1 h-7 w-7" tintColor="#a47764" />
                <Text className="font-pmedium text-base text-zinc-600">المتعهد</Text>
                <Text className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
                  {item?.sector?.contractor}
                </Text>
              </View>
            )}
            {item?.sector?.engineers && (
              <View className="flex-1 rounded-lg border border-toast-100 p-4">
                <Image source={icons.owner} className="mb-1 h-7 w-7" tintColor="#a47764" />
                <Text className="font-pmedium text-base text-zinc-600">المهندسين</Text>
                <Text className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
                  {item?.sector?.engineers}
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          {item?.sector?.description && (
            <View className="mt-4 rounded-lg border border-toast-100 p-4">
              <Text className="font-pmedium text-base text-zinc-600">وصف المقسم</Text>
              <Text className={`font-pregular text-sm text-zinc-600 ${I18nManager.isRTL ? 'text-left' : 'text-right'}`}>
                {item?.sector?.description}
              </Text>
            </View>
          )}

          {/* Owners */}
          {item?.sector?.owners && (
            <OwnersSection owners={item?.sector?.owners} />
          )}
        </View>
        );
      })()}
      {/* extra details */}
    </View>
  );
};

const ApartmentDetails = () => {
  // Get the id from the url
  const { id } = useGlobalSearchParams();

  // get Current User
  const user = getSecureStoreNoAsync('user');

  // init store
  const {
    getApartmentDetails,
    apartmentDetailsResponse,
    apartmentDetailsLoading,
    deleteApartment,
    deleteApartmentLoading,
  } = useUnitsStore();

  /*================== admin actions ==================*/
  const {
    approveUnitLoading,
    approveUnit,
    closeUnitLoading,
    closeUnit,
    deleteUnitLoading,
    deleteUnit,
  } = useAdminStore();

  /*================== Reaction Functionality ==================*/
  const { setReactions, removeReaction } = useReactionStore();
  const { toggleFavorite } = useFavoriteStore();
  const [showReactions, setShowReactions] = useState(false);
  const [displayedReaction, setDisplayedReaction] = useState(null);
  const [displayedFavorite, setDisplayedFavorite] = useState(false);
  const reactionsBottomSheetModalRef = useRef(null); // For detailed reaction list
  const reactionTimerRef = useRef(null);

  useEffect(() => {
    if (apartmentDetailsResponse) {
      setDisplayedReaction(apartmentDetailsResponse.current_user_reaction);
      setDisplayedFavorite(Boolean(apartmentDetailsResponse.is_favorited));
    }
  }, [apartmentDetailsResponse?.current_user_reaction, apartmentDetailsResponse?.is_favorited]);

  // Clear timer on component unmount
  useEffect(() => {
    return () => {
      if (reactionTimerRef.current) {
        clearTimeout(reactionTimerRef.current);
      }
    };
  }, []);

  // Function to update reactions locally
  const updateLocalReactions = (reactionSummary) => {
    if (apartmentDetailsResponse && reactionSummary) {
      // Update the reaction counts without refetching the entire apartment
      const updatedApartment = {
        ...apartmentDetailsResponse,
        reaction_counts: reactionSummary,
      };
      // Update the store directly
      useUnitsStore.setState((state) => ({
        ...state,
        apartmentDetailsResponse: updatedApartment,
      }));
    }
  };

  const handleReactionSelect = async (reaction) => {
    // Clear the auto-hide timer when user selects a reaction
    if (reactionTimerRef.current) {
      clearTimeout(reactionTimerRef.current);
    }
    
    const previousReaction = displayedReaction;
    setDisplayedReaction(reaction); // Optimistic update
    setShowReactions(false);

    const response = await setReactions({
      type: reaction,
      post_type: 'apartment',
      post_id: id,
    });

    if (response) {
      // Update local state with the reaction summary from the response
      updateLocalReactions(response.reaction_summary);
    } else {
      setDisplayedReaction(previousReaction); // Revert on error
    }
  };

  const handleLikePress = () => {
    if (showReactions) {
      handleReactionSelect('like');
      return;
    }

    if (displayedReaction) {
      const previousReaction = displayedReaction;
      setDisplayedReaction(null); // Optimistic update

      removeReaction({
        post_type: 'apartment',
        post_id: id,
      })
        .then((response) => {
          if (response) {
            // Update local state with the reaction summary from the response
            updateLocalReactions(response.reaction_summary);
          } else {
            setDisplayedReaction(previousReaction); // Revert
          }
        })
        .catch(() => {
          setDisplayedReaction(previousReaction); // Revert
        });
    } else {
      setDisplayedReaction('like'); // Optimistic update for 'like'

      setReactions({
        type: 'like',
        post_type: 'apartment',
        post_id: id,
      })
        .then((response) => {
          if (response) {
            // Update local state with the reaction summary from the response
            updateLocalReactions(response.reaction_summary);
          } else {
            setDisplayedReaction(null); // Revert
          }
        })
        .catch(() => {
          setDisplayedReaction(null); // Revert
        });
    }
  };

  const handleLikeLongPress = () => {
    setShowReactions(true);
    
    // Clear any existing timer
    if (reactionTimerRef.current) {
      clearTimeout(reactionTimerRef.current);
    }
    
    // Set timer to auto-hide reactions after 2 seconds
    reactionTimerRef.current = setTimeout(() => {
      setShowReactions(false);
    }, 3000);
  };

  const handleOpenReactionsModal = () => {
    reactionsBottomSheetModalRef.current?.present();
  };

  const handleFavoritePress = () => {
    const previousFavorite = displayedFavorite;
    setDisplayedFavorite(!displayedFavorite); // Optimistic update
    
    console.log('ApartmentDetails - Favorite button pressed. Previous state:', previousFavorite, 'New optimistic state:', !displayedFavorite);
    
    toggleFavorite({
      type: 'apartment',
      id: id,
    }).then(response => {
      console.log('ApartmentDetails - Toggle favorite response:', response);
      if (response && response.data) {
        // Update with actual response from server
        console.log('ApartmentDetails - Server response is_favorited:', response.data.is_favorited, 'type:', typeof response.data.is_favorited);
        setDisplayedFavorite(Boolean(response.data.is_favorited));
      } else {
        // Revert optimistic update on failure
        console.log('ApartmentDetails - No response data, reverting to:', previousFavorite);
        setDisplayedFavorite(previousFavorite);
      }
    }).catch(() => {
      // Revert optimistic update on error
      console.log('ApartmentDetails - Error occurred, reverting to:', previousFavorite);
      setDisplayedFavorite(previousFavorite);
    });
  };

  const handleShare = async (item) => {
    console.log(item);
    try {
      const result = await Share.share({
        message: item?.share_button ?? '',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const getApartmentDetailsHandler = async () => {
    if (!id) return;
    await getApartmentDetails(id);
  };

  const handleDeleteConfirm = async () => {
    const response = await deleteApartment(id);
    if (response?.success) {
      router.replace('/(tabs)');
      router.dismissAll();
    }
  };

  const bottomSheetModalRef = useRef(null);
  const closeUnitBottomSheetModalRef = useRef(null);
  const deleteUnitBottomSheetModalRef = useRef(null);
  const handleApproveUnit = async () => {
    bottomSheetModalRef.current.present();
  };

  const handleCloseUnit = async () => {
    closeUnitBottomSheetModalRef.current.present();
  };

  const handleApproveUnitConfirm = async () => {
    const response = await approveUnit('apartment', id);
    if (response?.success) {
      getApartmentDetailsHandler();
      bottomSheetModalRef.current.dismiss();
    }
  };

  const handleCloseUnitConfirm = async () => {
    const response = await closeUnit('apartment', id);
    if (response?.success) {
      getApartmentDetailsHandler();
      closeUnitBottomSheetModalRef.current.dismiss();
    }
  };

  const handleDeleteUnit = async () => {
    deleteUnitBottomSheetModalRef.current.present();
  };

  const handleDeleteUnitConfirm = async () => {
    const response = await deleteUnit('apartment', id);
    if (response?.success) {
      router.replace('/(tabs)');
      router.dismissAll();
    }
  };

  useEffect(() => {
    getApartmentDetailsHandler();
  }, [id]);

  // Reload data when screen comes into focus (e.g., when returning from edit screen)
  useFocusEffect(
    React.useCallback(() => {
      if (id) {
        getApartmentDetailsHandler();
      }
    }, [id])
  );

  return (
    <>
      <CustomBottomModalSheet
        backdropBehave="close"
        enablePanDownToClose={true}
        bottomSheetModalRef={bottomSheetModalRef}
        handleSheetChanges={() => {}}
        snapPoints={['30%']}
        handleDismissModalPress={() => {}}>
        <View className="h-full items-center justify-center">
          <AdminActionItem
            title="الموافقة على الإعلان"
            description="هل أنت متاكد من الموافقة على الإعلان؟"
            icon={icons.admin_approve}
            color="#3cab3d"
            confirm_color="bg-[#3cab3d]"
            onDeleteConfirm={handleApproveUnitConfirm}
            onClose={() => bottomSheetModalRef.current.dismiss()}
            confirmLoading={approveUnitLoading}
          />
        </View>
      </CustomBottomModalSheet>
      <CustomBottomModalSheet
        backdropBehave="close"
        enablePanDownToClose={true}
        bottomSheetModalRef={closeUnitBottomSheetModalRef}
        handleSheetChanges={() => {}}
        snapPoints={['30%']}
        handleDismissModalPress={() => {}}>
        <View className="h-full items-center justify-center">
          {apartmentDetailsResponse?.closed == 0 ? (
            <AdminActionItem
              title="إتمام الصفقة"
              description="هل أنت متاكد من إتمام الصفقة؟"
              icon={icons.admin_approve}
              color="#314158"
              confirm_color="bg-[#314158]"
              onDeleteConfirm={handleCloseUnitConfirm}
              onClose={() => closeUnitBottomSheetModalRef.current.dismiss()}
              confirmLoading={closeUnitLoading}
            />
          ) : (
            <View className="items-center justify-center">
              <Text className="font-psemibold text-lg text-black">الصفقة مغلقة بالفعل</Text>
            </View>
          )}
        </View>
      </CustomBottomModalSheet>
      <CustomBottomModalSheet
        backdropBehave="close"
        enablePanDownToClose={true}
        bottomSheetModalRef={deleteUnitBottomSheetModalRef}
        handleSheetChanges={() => {}}
        snapPoints={['30%']}
        handleDismissModalPress={() => {}}>
        <View className="h-full items-center justify-center">
          <AdminActionItem
            title="حذف الإعلان"
            description="هل أنت متاكد من حذف الإعلان؟"
            icon={icons.delete_icon}
            color="#82181A"
            confirm_color="bg-[#82181A]"
            onDeleteConfirm={handleDeleteUnitConfirm}
            onClose={() => deleteUnitBottomSheetModalRef.current.dismiss()}
            confirmLoading={deleteUnitLoading}
          />
        </View>
      </CustomBottomModalSheet>

      {/* Modal for Detailed Reaction Counts */}
      <CustomBottomModalSheet
        backdropBehave="close"
        enablePanDownToClose={true}
        bottomSheetModalRef={reactionsBottomSheetModalRef}
        handleSheetChanges={() => {}}
        snapPoints={['30%', '50%', '70%']}
        handleDismissModalPress={() => {}}>
        <View className="p-4">
          <Text className="mb-4 text-center font-psemibold text-lg">التفاعلات</Text>
          <View className={`flex ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} flex-wrap gap-4`}>
            {availableReactions.map((reaction) => {
              const countKey = `${reaction.value}_count`;
              const count = apartmentDetailsResponse?.reaction_counts?.[countKey] || 0;
              if (count > 0) {
                return (
                  <View
                    key={reaction.value}
                    className={`flex ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} items-center gap-2 rounded-lg bg-gray-100 p-2`}>
                    <Text className="text-2xl">{count}</Text>
                    <Text className="text-2xl">{reaction.icon}</Text>
                    <Text className="mt-1 font-pmedium text-sm text-gray-700">
                      {reaction.title}
                    </Text>
                  </View>
                );
              }
              return null;
            })}
            {(!apartmentDetailsResponse?.reaction_counts ||
              apartmentDetailsResponse?.reaction_counts?.total_count === 0) && (
              <Text className="w-full text-center font-pregular text-gray-500">
                لا يوجد تفاعلات بعد.
              </Text>
            )}
          </View>
        </View>
      </CustomBottomModalSheet>

      <SafeAreaView className="flex-1">
        {apartmentDetailsLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="100" color="#a47764" />
          </View>
        ) : (
          <>
            <CustomHeadWithBackButton
              title="تفاصيل العقار"
              rightIcon={<AntDesign name="sharealt" size={24} color="black" />}
              rightIconPress={() => handleShare(apartmentDetailsResponse)}
              handleButtonPress={() => router.back()}
            />
            <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} justify-between`}>
              <View className="px-4">
                <Text className="font-psemibold text-xl">
                  {apartmentDetailsResponse?.sector?.code?.name} -{' '}
                  {apartmentDetailsResponse?.sector?.code?.view_code}
                </Text>
                <Text className="font-pregular text-sm text-zinc-600">
                  {apartmentDetailsResponse?.region?.name} -{' '}
                  {apartmentDetailsResponse?.post_type == 'share' ? 'أسهم تنظيمية' : 'عقارات'}
                </Text>
                <Text className="font-pregular text-sm text-zinc-600">الرقم المرجعي : {apartmentDetailsResponse?.id}</Text>
              </View>
            </View>
            <ScrollView className="flex-1">
              <View className="flex-1 relative">
                {(user?.privilege == 'admin' || user?.user_id == apartmentDetailsResponse?.user?.id) && (
                  <View className="absolute z-10" style={{ top: 25, left: 20 }}>
                    {apartmentDetailsResponse?.approve == 0 && (
                      <CustomLinear
                        title={apartmentDetailsResponse?.approve == 1 ? 'متاح' : 'قيد المراجعة'}
                        colors={['#e3a001', '#b87005', '#95560b', '#7a460d', '#7a460d']}
                        positionOfGradient="leftToRight"
                        textStyles="text-white !text-xs mt-1"
                        buttonStyles="rounded-lg py-1 px-8"
                      />
                    )}
                  </View>
                )}
                {apartmentDetailsResponse && (
                  <CustomImageSlider
                    images={apartmentDetailsResponse?.photos}
                    height={300}
                    newImages={apartmentDetailsResponse}
                  />
                )}
                <View style={{ marginTop: 20 }}>
                  <UnitDetails
                    item={apartmentDetailsResponse}
                    displayedReaction={displayedReaction}
                    showReactions={showReactions}
                    onLikePress={handleLikePress}
                    onLikeLongPress={handleLikeLongPress}
                    onReactionSelect={handleReactionSelect}
                    onOpenReactionsModal={handleOpenReactionsModal}
                    onDismissReactions={() => setShowReactions(false)}
                    displayedFavorite={displayedFavorite}
                    onFavoritePress={handleFavoritePress}
                  />
                </View>
              </View>
            </ScrollView>
            <View className="p-4">
              {user?.user_id == apartmentDetailsResponse?.user?.id &&
              user?.privilege !== 'admin' ? (
                <View className={`gap-2 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
                  <CustomBottomSheet
                    snapPoints={['25%']}
                    trigger={
                      <CustomButton
                        hasGradient={true}
                        colors={['#82181A', '#82181A', '#82181A', '#9F0712', '#C10007']}
                        title={'حذف الإعلان'}
                        containerStyles={'flex-grow'}
                        positionOfGradient={'leftToRight'}
                        textStyles={'text-white'}
                        buttonStyles={'h-[45px]'}
                      />
                    }>
                    <DeleteItem
                      onDeleteConfirm={handleDeleteConfirm}
                      confirmLoading={deleteApartmentLoading}
                    />
                  </CustomBottomSheet>
                  <CustomButton
                    hasGradient={true}
                    colors={['#314158', '#62748E', '#90A1B9', '#90A1B9', '#90A1B9']}
                    title={'تعديل الإعلان'}
                    containerStyles={'flex-grow'}
                    positionOfGradient={'leftToRight'}
                    textStyles={'text-white'}
                    buttonStyles={'h-[45px]'}
                    handleButtonPress={() => router.push(`/(edit)/apartment/${id}`)}
                  />
                </View>
              ) : (
                <>
                  {user?.privilege !== 'admin' && (
                    <CustomButton
                      hasGradient={true}
                      colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
                      title={'تواصل مع فريق عقاري'}
                      containerStyles={'flex-grow'}
                      positionOfGradient={'leftToRight'}
                      textStyles={'text-white'}
                      buttonStyles={'h-[45px]'}
                      handleButtonPress={() => router.push('/(contact)')}
                    />
                  )}

                  {user?.privilege == 'admin' && (
                    <>
                      {apartmentDetailsResponse?.approve == 0 && (
                        <View className={`gap-2 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
                          <CustomButton
                            hasGradient={true}
                            colors={['#3cab3d', '#2d8c2e', '#266f27', '#2d8c2e', '#3cab3d']}
                            title={'الموافقة على الإعلان'}
                            containerStyles={'flex-grow'}
                            positionOfGradient={'leftToRight'}
                            textStyles={'text-white'}
                            buttonStyles={'h-[45px]'}
                            handleButtonPress={handleApproveUnit}
                          />
                        </View>
                      )}
                      <View className={`gap-2 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mt-4`}>
                        <CustomButton
                          hasGradient={true}
                          colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
                          title={'تعديل الإعلان'}
                          containerStyles={'flex-grow'}
                          positionOfGradient={'leftToRight'}
                          textStyles={'text-white'}
                          buttonStyles={'h-[45px]'}
                          handleButtonPress={() => router.push(`/(edit)/apartment/${id}`)}
                        />
                      </View>
                      <View className={`gap-2 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mt-4`}>
                        <CustomButton
                          hasGradient={true}
                          colors={['#314158', '#62748E', '#90A1B9', '#90A1B9', '#90A1B9']}
                          title={'إتمام الصفقة'}
                          containerStyles={'flex-grow'}
                          positionOfGradient={'leftToRight'}
                          textStyles={'text-white'}
                          buttonStyles={'h-[45px]'}
                          handleButtonPress={handleCloseUnit}
                        />
                        <CustomButton
                          hasGradient={true}
                          colors={['#82181A', '#82181A', '#82181A', '#9F0712', '#C10007']}
                          title={'حذف الإعلان'}
                          containerStyles={'flex-grow'}
                          positionOfGradient={'leftToRight'}
                          textStyles={'text-white'}
                          buttonStyles={'h-[45px]'}
                          handleButtonPress={handleDeleteUnit}
                        />
                      </View>
                    </>
                  )}
                </>
              )}
            </View>
          </>
        )}
      </SafeAreaView>
    </>
  );
};

export default ApartmentDetails;
