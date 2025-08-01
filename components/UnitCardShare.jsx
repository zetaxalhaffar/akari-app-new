import { router } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  I18nManager,
  Linking,
  Alert,
  Share,
} from 'react-native';
import CustomLinear from './CustomLinear';
import icons from '@/constants/icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect, useRef, useMemo } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useReactionStore } from '@/store/reaction.store';
import { useFavoriteStore } from '@/store/favorite.store';
import { AntDesign } from '@expo/vector-icons';
import CustomBottomModalSheet from '@/components/CustomBottomModalSheet';
import { useUnitsStore } from '../store/units.store';

const gradientPositions = {
  topToBottom: { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  bottomToTop: { start: { x: 0, y: 1 }, end: { x: 0, y: 0 } },
  leftToRight: { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  rightToLeft: { start: { x: 1, y: 0 }, end: { x: 0, y: 0 } },
};

// Animated Emoji Button Component
const EmojiButton = ({ emoji, onPress, isSelected = false }) => {
  const scale = useSharedValue(1);
  const backgroundColor = useSharedValue('#f3f4f6');

  useEffect(() => {
    scale.value = withSpring(isSelected ? 1.2 : 1);
    backgroundColor.value = withTiming(isSelected ? '#d1d5db' : '#f3f4f6', { duration: 150 });
  }, [isSelected]);

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

//removeReaction will take post_id , post_type == share

const UnitShareCard = ({ item }) => {
  const { setReactions, removeReaction, reactionSchemaResponse } = useReactionStore();
  const { toggleFavorite } = useFavoriteStore();

  const { sharesRecords, updateShareReactions, updateSearchResultUserReaction, updateSearchResultUserFavorite } = useUnitsStore();
  const reactionTimerRef = useRef(null);
  const availableReactions = [
    {
      value: 'like',
      icon: '👍🏼',
      title: 'أعجبني',
    },
    {
      value: 'love',
      icon: '❤️',
      title: 'أحببته',
    },
    // {
    //   value: 'haha',
    //   icon: '😂',
    // },
    {
      value: 'wow',
      icon: '😮',
      title: 'أدهشني',
    },
    {
      value: 'sad',
      icon: '😢',
      title: 'احزنني',
    },
    {
      value: 'angry',
      icon: '😠',
      title: 'أغضبني',
    },
  ];

  const user = useMemo(() => {
    try {
      const userData = SecureStore.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }, []);

  const [showReactions, setShowReactions] = useState(false);
  const [displayedReaction, setDisplayedReaction] = useState(item?.current_user_reaction);
  const [displayedFavorite, setDisplayedFavorite] = useState(Boolean(item?.is_favorited));

  const handleShareToOtherPress = async () => {
    console.log(item);
    try {
      const result = await Share.share({
        message: item?.share_button ?? 'for test',
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

  const handleSharePress = () => {
    requestAnimationFrame(() => {
      router.push(`/(shares)/${item.id}`);
    });
  };

  useEffect(() => {
    setDisplayedReaction(item?.current_user_reaction);
  }, [item?.current_user_reaction]);

  useEffect(() => {
    console.log('UnitCardShare - item.is_favorited changed:', item?.is_favorited, 'type:', typeof item?.is_favorited);
    setDisplayedFavorite(Boolean(item?.is_favorited));
  }, [item?.is_favorited]);

  // Clear timer on component unmount
  useEffect(() => {
    return () => {
      if (reactionTimerRef.current) {
        clearTimeout(reactionTimerRef.current);
      }
    };
  }, []);

  // Handles selecting a reaction from the popup
  const handleReactionSelect = (reaction) => {
    // Clear the auto-hide timer when user selects a reaction
    if (reactionTimerRef.current) {
      clearTimeout(reactionTimerRef.current);
    }
    
    const previousReaction = displayedReaction;
    setDisplayedReaction(reaction); // Optimistic update
    setShowReactions(false);
    
    requestAnimationFrame(async () => {
      const response = await setReactions({
        type: reaction,
        post_type: 'share',
        post_id: item.id,
      });
      if (response) {
        updateShareReactions(item.id, response.reaction_summary);
        // Update user reaction in search results as well
        updateSearchResultUserReaction(item.id, 'share', reaction);
      } else {
        // Optional: revert on error
        // setDisplayedReaction(previousReaction);
      }
    });
    console.log(`Reaction selected: ${reaction}`);
  };

  const handleLikePress = () => {
    const currentReaction = displayedReaction; // Use displayed state

    if (showReactions) {
      // If popup is open and user taps like button instead of emoji, select 'like'
      handleReactionSelect('like');
      return;
    }

    if (currentReaction) {
      // If already reacted, remove reaction
      const previousReaction = currentReaction; // Store previous state for potential revert
      setDisplayedReaction(null); // Optimistic update
      removeReaction({
        post_type: 'share',
        post_id: item.id,
      })
        .then((response) => {
          if (response) {
            updateShareReactions(item.id, response.reaction_summary);
            // Update user reaction in search results as well
            updateSearchResultUserReaction(item.id, 'share', null);
          } else {
            // Revert optimistic update on failure
            setDisplayedReaction(previousReaction);
          }
        })
        .catch(() => {
          // Revert optimistic update on error
          setDisplayedReaction(previousReaction);
        });
      console.log('Reaction cleared');
    } else {
      // If no reaction, select 'like'
      setDisplayedReaction('like'); // Optimistic update
      setReactions({
        type: 'like',
        post_type: 'share',
        post_id: item.id,
      })
        .then((response) => {
          if (response) {
            updateShareReactions(item.id, response.reaction_summary);
            // Update user reaction in search results as well
            updateSearchResultUserReaction(item.id, 'share', 'like');
          } else {
            // Revert optimistic update on failure
            setDisplayedReaction(null);
          }
        })
        .catch(() => {
          // Revert optimistic update on error
          setDisplayedReaction(null);
        });
      console.log('Default Like selected');
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
    bottomSheetModalRef.current?.present();
  };

  const handleFavoritePress = () => {
    const previousFavorite = displayedFavorite;
    setDisplayedFavorite(!displayedFavorite); // Optimistic update
    
    console.log('UnitCardShare - Favorite button pressed. Previous state:', previousFavorite, 'New optimistic state:', !displayedFavorite);
    
    requestAnimationFrame(() => {
      toggleFavorite({
        type: 'share',
        id: item.id,
      }).then(response => {
        console.log('UnitCardShare - Toggle favorite response:', response);
        if (response && response.data) {
          // Update with actual response from server
          console.log('UnitCardShare - Server response is_favorited:', response.data.is_favorited, 'type:', typeof response.data.is_favorited);
          const isFavorited = Boolean(response.data.is_favorited);
          setDisplayedFavorite(isFavorited);
          // Update favorite state in search results as well
          updateSearchResultUserFavorite(item.id, 'share', isFavorited);
        } else {
          // Revert optimistic update on failure
          console.log('UnitCardShare - No response data, reverting to:', previousFavorite);
          setDisplayedFavorite(previousFavorite);
        }
      }).catch(() => {
        // Revert optimistic update on error
        console.log('UnitCardShare - Error occurred, reverting to:', previousFavorite);
        setDisplayedFavorite(previousFavorite);
      });
    });
  };

  const bottomSheetModalRef = useRef(null);

  return (
    <>
      <CustomBottomModalSheet
        backdropBehave="close"
        enablePanDownToClose={true}
        bottomSheetModalRef={bottomSheetModalRef}
        handleSheetChanges={() => {}}
        snapPoints={['30%', '50%', '70%']}
        handleDismissModalPress={() => {}}>
        <View className="p-4">
          <Text className="mb-4 text-center font-psemibold text-lg">التفاعلات</Text>
          <View className={`flex ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} gap-4 justify-center items-center`}>
            {availableReactions.map((reaction) => {
              const countKey = `${reaction.value}_count`;
              const count = item?.reaction_counts?.[countKey] || 0;
              if (count > 0) {
                return (
                  <View
                    key={reaction.value}
                    className={`flex ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} items-center gap-2 rounded-lg bg-gray-100 p-2`}>
                    <Text className="text-2xl">{count}</Text>
                    <Text className="text-2xl">{reaction.icon}</Text>
              
                  </View>
                );
              }
              return null;
            })}
          </View>
        </View>
      </CustomBottomModalSheet>
      <View className="relative">
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
          <Image 
            source={item?.sector?.cover?.img ? { uri: item.sector.cover.img } : require('@/assets/images/no_photo.jpg')} 
            className="h-full w-full" 
          />
          <View className="absolute inset-0 bottom-0 w-full rounded-lg bg-toast-900/90 p-4 backdrop-blur-sm">
            <View
              className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} justify-between gap-4`}>
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
              {item.region.name} - {item.post_type == 'share' ? 'أسهم تنظيمية' : 'عقارات'} /  {item.transaction_type == 'sell' ? 'رغبة في البيع' : 'رغبة في الشراء'}
            </Text>

            <View
              className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} flex-wrap items-center gap-1`}>
              <View className="flex-row items-center gap-1">
                <Image
                  source={icons.price}
                  className={'h-6 w-6'}
                  tintColor={'#FFF'}
                  resizeMode="contain"
                />
                <Text className="font-pmedium text-sm text-white">سعر السهم : {item.price}</Text>
              </View>

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
            <View
              className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mt-1 flex-wrap items-center gap-1`}>
              <View className="flex-row items-center gap-1">
                <Image
                  source={icons.date}
                  className={'h-6 w-6'}
                  tintColor={'#FFF'}
                  resizeMode="contain"
                />
                <Text className="font-pmedium text-sm text-white">تاريخ النشر : {item.since}</Text>
              </View>
            </View>
            {(user?.privilege == 'admin' || user?.user_id == item?.user?.id) && (
              <View
                className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} mt-1 flex-wrap items-center gap-1`}>
                <View className="flex-row items-center gap-1">
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
              </View>
            )}

          </View>
        </TouchableOpacity>

        {/* Conditionally Rendered Reactions Popup */}
        {showReactions && (
          <Animated.View
            className="absolute bottom-12 left-2 z-10 flex-row items-center gap-4 space-x-1 rounded-full border border-gray-300 bg-white p-1 p-2 shadow-lg drop-shadow-sm"
            style={{ elevation: 5 }}>
            {availableReactions.map((reaction) => (
              <EmojiButton
                key={reaction.value}
                emoji={reaction.icon}
                onPress={() => handleReactionSelect(reaction.value)}
                isSelected={displayedReaction === reaction.value}
              />
            ))}
          </Animated.View>
        )}

        {/* Action Buttons Row */}
        {item?.reaction_counts?.total_count > 0 && (
          <TouchableOpacity onPress={handleOpenReactionsModal} activeOpacity={0.7}>
            <View
              className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} justify-between px-9 py-1`}>
              <View className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} items-center gap-3`}>
                {item?.reaction_counts?.like_count > 0 && (
                  <Text>{item?.reaction_counts?.like_count > 0 ? '👍🏼' : ''}</Text>
                )}
                {item?.reaction_counts?.angry_count > 0 && (
                  <Text>{item?.reaction_counts?.angry_count > 0 ? '😠' : ''}</Text>
                )}
                {/* {item?.reaction_counts?.haha_count > 0 && (
                <Text>{item?.reaction_counts?.haha_count > 0 ? '😂' : ''}</Text>
              )} */}
                {item?.reaction_counts?.love_count > 0 && (
                  <Text>{item?.reaction_counts?.love_count > 0 ? '❤️' : ''}</Text>
                )}
                {item?.reaction_counts?.sad_count > 0 && (
                  <Text>{item?.reaction_counts?.sad_count > 0 ? '😢' : ''}</Text>
                )}
                {item?.reaction_counts?.wow_count > 0 && (
                  <Text>{item?.reaction_counts?.wow_count > 0 ? '😮' : ''}</Text>
                )}
                <Text>{item?.reaction_counts?.total_count}</Text>
              </View>
              <Text></Text>
            </View>
          </TouchableOpacity>
        )}
        <View className="flex-row justify-around">
          {/* Like Button (Handles short and long press) */}
          <TouchableOpacity
            onPress={handleLikePress}
            onLongPress={handleLikeLongPress}
            delayLongPress={200}
            className="flex-1 items-center justify-center rounded-md py-2 hover:bg-gray-100 active:bg-gray-200">
            {(() => {
              const displayReactionValue = displayedReaction; // Use new state
              const reactionObj = availableReactions.find(
                (reaction) => reaction.value === displayReactionValue
              );

              if (reactionObj) {
                // Display Selected/Fetched Reaction
                return (
                  <View
                    className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} flex flex-row items-center justify-center gap-1`}>
                    <Text className="text-md">{reactionObj.icon}</Text>
                    <Text className="text-md font-psemibold capitalize">{reactionObj.title}</Text>
                  </View>
                );
              } else {
                // Display Default Like Button
                return (
                  <View
                    className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} flex items-center justify-center gap-3`}>
                    <AntDesign name="like2" size={18} color="#374151" />
                    <Text className="text-md mt-1 font-psemibold text-gray-700">إعجاب</Text>
                  </View>
                );
              }
            })()}
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity
            onPress={handleShareToOtherPress}
            className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} flex-1 items-center justify-center gap-3 rounded-md p-2 hover:bg-gray-100 active:bg-gray-200`}>
            {/* Placeholder for Share Icon */}
            <AntDesign name="sharealt" size={16} color="black" />
            <Text className="text-md font-psemibold text-gray-700">شارك</Text>
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity
            onPress={handleFavoritePress}
            className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} flex-1 items-center justify-center gap-3 rounded-md p-2 hover:bg-gray-100 active:bg-gray-200`}>
            <AntDesign 
              name={displayedFavorite ? "star" : "staro"} 
              size={18} 
              color={displayedFavorite ? "#FFD700" : "#374151"} 
            />
            <Text className="text-md font-psemibold text-gray-700">مفضلة</Text>
          </TouchableOpacity>

          <TouchableOpacity
            
            className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} flex-1 items-center justify-center gap-3 rounded-md p-2 hover:bg-gray-100 active:bg-gray-200`}>
            {/* Placeholder for Share Icon */}
            <Image
              source={icons.view}
              className={'h-6 w-6'}
              tintColor={'#000'}
              resizeMode="contain"
            />
            <Text className="text-md font-psemibold text-gray-700"> {item.views} </Text>
          </TouchableOpacity>

          {/* WhatsApp Share Button */}
          {/* <TouchableOpacity
            onPress={handleWhatsAppShare}
            className={`${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} flex-1 items-center justify-center gap-3 rounded-md p-2 hover:bg-gray-100 active:bg-gray-200`}>
            <Image source={icons.whatsapp} className="h-5 w-5" tintColor="#374151" />
            <Text className="text-md font-psemibold text-gray-700">واتساب</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </>
  );
};

export default UnitShareCard;
