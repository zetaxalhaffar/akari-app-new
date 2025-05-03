import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeadWithBackButton from '../../components/CustomHeadWithBackButton';
import { router } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { View, Text, Switch, I18nManager } from 'react-native';
import { useAdminStore } from '../../store/admin.store';
import { Input } from '@/components/CustomInput';
import EmptyScreen from '@/components/EmptyScreen';
import images from '@/constants/images';
import CustomButton from '../../components/CustomButton';

// Separate CardItem component
const CardItem = ({ user, blockUnblockUser, onBlockUnblockComplete }) => {
  const toggleSwitch = async () => {
    await blockUnblockUser(user.id, user.block == 1 ? 'unblock' : 'block');
    if (onBlockUnblockComplete) {
      onBlockUnblockComplete();
    }
  };

  const handleEdit = () => {
    // Logic to edit the user
    console.log(`Edit user: ${user.name}`);
    bottomSheetModalRef.current.present();
  };
  const bottomSheetModalRef = useRef(null);

  return (
    <View className="my-2 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-psemibold text-lg text-gray-800">{user.name}</Text>
        <View
          className={
            I18nManager.isRTL
              ? 'rtl-view items-center justify-center gap-1'
              : 'ltr-view items-center justify-center gap-1'
          }>
          <View className={`rounded-full ${user.block == 1 ? 'bg-[#d4c2b3]' : 'bg-[#EEE]'}`}>
            <Switch
              shouldRasterizeIOS={true}
              trackColor={{ false: '#EEE', true: '#d4c2b3' }}
              thumbColor={user.block == 1 ? '#a47764' : '#ccc'}
              onValueChange={toggleSwitch}
              value={user.block == 1}
              style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }} // Slightly larger switch
            />
          </View>
          <Text className={'font-pmedium text-sm'}>{user.block == 1 ? 'محظور' : 'فعال'}</Text>
        </View>
      </View>
      <View className="border-t border-gray-200 pt-4">
        <Text className="mb-1 mt-2 font-pmedium text-sm text-gray-600 text-right">
          رقم الهاتف: {user.phone}
        </Text>
        <Text className="mb-1 font-pmedium text-sm text-gray-600 text-right">
          عدد الطلبات: {user.orderable_count}
        </Text>
        <Text className="mb-1 font-pmedium text-sm text-gray-600 text-right">
          عدد الأسهم: {user.shares_count}
        </Text>
        <Text className="mb-1 font-pmedium text-sm text-gray-600 text-right">
          عدد العقارات: {user.apartment_count}
        </Text>
      </View>
    </View>
  );
};

const UsersList = () => {
  const {
    getUsersListByAdmin,
    usersListByAdminResponse,
    usersListByAdminLoading,
    blockUnblockUser,
    blockUnblockUserLoading,
    searchUser,
    searchUserLoading,
    searchUserResponse,
    usersListByAdminRecords
  } = useAdminStore();
  const params = useRef({
    page: 1,
  });
  const handleEndReached = () => {
    // Logic to load more data
    console.log('End reached, load more data');
    params.current.page += 1;
    // Fetch more data based on the new page
    getUsersList()
  };

  const handleRefresh = () => {
    // Logic to refresh data
    console.log('Refreshing data');
    params.current.page = 1;
    // Fetch data for the first page
  };

  const getUsersList = async (firstLoad = false) => {
    console.log('getUsersList');
    await getUsersListByAdmin(params.current, firstLoad);
    console.log(usersListByAdminResponse);
  };
  const [userSearch, setUserSearch] = useState('');
  const searchTimeout = useRef(null);

  const handleSearch = (value) => {
    setUserSearch(value);
    // if (searchTimeout.current) {
    //   clearTimeout(searchTimeout.current);
    // }
    // searchTimeout.current = setTimeout(async () => {
    //   if (value) {
    //     await searchUser({
    //       phone: value,
    //     });
    //   }
    //   console.log(searchUserResponse);
    // }, 500); // Adjust the delay as needed
  };

  const handleSearchPress = async () => {
    if (userSearch.length) {
      await searchUser({ phone: userSearch });
    }
  };

  // Callback function to refresh the user list
  const refreshUserList = () => {
    console.log('refreshUserList');
    params.current.page = 1;
    getUsersList(true);
  };

  const userArrayList = () => {
    if (userSearch.length) {
      return searchUserResponse?.data ?? [];
    } else {
      return usersListByAdminRecords ?? [];
    }
  };

  useEffect(() => {
    params.current.page = 1;
    getUsersList(true);
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <CustomHeadWithBackButton title="المستخدمين" handleButtonPress={() => router.back()} />
      <View className="px-4">
        <Input
          showPlaceholder={false}
          placeholder="رقم المستخدم"
          value={userSearch}
          onChangeText={handleSearch}
        />
        <CustomButton
          hasGradient={true}
          colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
          title="بحث"
          textStyles={'text-white'}
          containerStyles={'mt-4'}
          handleButtonPress={handleSearchPress}
          loading={searchUserLoading}
        />
      </View>
      <View className="flex-1 px-4 pb-8">
        <FlashList
          data={userArrayList() ?? []}
          renderItem={({ item }) => (
            <CardItem
              user={item}
              blockUnblockUser={blockUnblockUser}
              onBlockUnblockComplete={refreshUserList}
            />
          )}
          keyExtractor={(item) => item.id}
          estimatedItemSize={150} // Adjust based on your item size
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          onRefresh={handleRefresh}
          refreshing={usersListByAdminLoading || blockUnblockUserLoading || searchUserLoading}
          ListEmptyComponent={() => <EmptyScreen title="لا يوجد مستخدمين" img={images.no_data} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default UsersList;
