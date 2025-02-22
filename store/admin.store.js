import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';
import { notify } from 'react-native-notificated';

export const useAdminStore = create((set, get) => ({
  // https://arrows-dev.versetech.net/api/admin/user/ListAll
  usersListByAdminLoading: false,
  usersListByAdminError: null,
  usersListByAdminResponse: null,
  usersListByAdminRecords: [],
  getUsersListByAdmin: async (params, firstLoad = false) => {
    try {
      set({ usersListByAdminLoading: true });
      const response = await axiosInstance.get('/admin/user/ListAll', { params });
      set({ usersListByAdminResponse: response });
      if (firstLoad) {
        set({ usersListByAdminRecords: response.data });
      } else {
        set({ usersListByAdminRecords: [...get().usersListByAdminRecords, ...response.data] }); // Update state
      }
      return response;
    } catch (error) {
      console.log(error);
      set({ usersListByAdminError: error });
    } finally {
      set({ usersListByAdminLoading: false });
    }
  },
  // https://arrows-dev.versetech.net/api/admin/user/block/{user_id}
  blockUnblockUserLoading: false,
  blockUnblockUserError: null,
  blockUnblockUserResponse: null,
  blockUnblockUser: async (user_id, action) => {
    try {
      set({ blockUnblockUserLoading: true });
      const response = await axiosInstance.post(`/admin/user/${action}/${user_id}`);
      set({ blockUnblockUserResponse: response });
      return response;
    } catch (error) {
      console.log(error);
      set({ blockUnblockUserError: error });
    } finally {
      set({ blockUnblockUserLoading: false });
    }
  },
  // https://arrows-dev.versetech.net/api/admin/search
  searchUserLoading: false,
  searchUserError: null,
  searchUserResponse: null,
  searchUser: async (params) => {
    try {
      set({ searchUserLoading: true });
      const response = await axiosInstance.get('/admin/search', { params });
      set({ searchUserResponse: response });
      return response;
    } catch (error) {
      notify('error', { params: { title: 'حدث خطأ ما', description: error?.message } });

      console.log(error);
      set({ searchUserError: error });
    } finally {
      set({ searchUserLoading: false });
    }
  },
  //https://arrows-dev.versetech.net/api/admin/notification/send_all
  sendBulkMessageLoading: false,
  sendBulkMessageError: null,
  sendBulkMessageResponse: null,
  sendBulkMessage: async (params) => {
    try {
      set({ sendBulkMessageLoading: true });

      const response = await axiosInstance.post('/admin/notification/send_all', params);
      set({ sendBulkMessageResponse: response });
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: response?.message ?? 'تم إرسال الرسالة بنجاح',
        },
      });
      return response;
    } catch (error) {
      notify('error', { params: { title: 'حدث خطأ ما', description: error?.message } });

      console.log(error);
      set({ sendBulkMessageError: error });
    } finally {
      set({ sendBulkMessageLoading: false });
    }
  },
}));
