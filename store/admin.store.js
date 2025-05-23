import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';
import { notify } from 'react-native-notificated';
import { getSecureStore } from '../composables/secure.store';

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
  // https://arrows-dev.versetech.net/api/admin/{apartment | share}/approve/{apartment_id}
  approveUnitLoading: false,
  approveUnitError: null,
  approveUnitResponse: null,
  approveUnit: async (type, id) => {
    try {
      set({ approveUnitLoading: true });
      const response = await axiosInstance.get(`/admin/${type}/approve/${id}`);
      set({ approveUnitResponse: response });
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: response?.message ?? 'تم الموافقة على الطلب بنجاح',
        },
      });
      return response;
    } catch (error) {
      notify('error', { params: { title: 'حدث خطأ ما', description: error?.message } });

      console.log(error);
      set({ approveUnitError: error });
    } finally {
      set({ approveUnitLoading: false });
    }
  },
  // https://arrows-dev.versetech.net/api/admin/close_apartment/{apartment}
  closeUnitLoading: false,
  closeUnitError: null,
  closeUnitResponse: null,
  closeUnit: async (type, id) => {
    try {
      set({ closeUnitLoading: true });
      const response = await axiosInstance.post(`/admin/close_${type}/${id}`);
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: response?.message ?? 'تم إتمام الصفقة بنجاح',
        },
      });
      set({ closeUnitResponse: response });
      return response;
    } catch (error) {
      notify('error', { params: { title: 'حدث خطأ ما', description: error?.message } });

      console.log(error);
      set({ closeUnitError: error });
    } finally {
      set({ closeUnitLoading: false });
    }
  },
  // https://arrows-dev.versetech.net/api/{apartment | share}/delete/{apartment_id}
  deleteUnitLoading: false,
  deleteUnitError: null,
  deleteUnitResponse: null,
  deleteUnit: async (type, id) => {
    try {
      set({ deleteUnitLoading: true });
      const response = await axiosInstance.delete(`/${type}/delete/${id}`);
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: response?.message ?? 'تم حذف الطلب بنجاح',
        },
      });
      set({ deleteUnitResponse: response });
      return response;
    } catch (error) {
      console.log(error);
      notify('error', { params: { title: 'حدث خطأ ما', description: error?.message } });

      set({ deleteUnitError: error });
    } finally {
      set({ deleteUnitLoading: false });
    }
  },

  //https://akari.versetech.net/api /user/update_firebase
  updateFirebaseLoading: false,
  updateFirebaseError: null,
  updateFirebaseResponse: null,
  updateFirebase: async (params) => {
    try {
      // Check if token is available before making the API call
      const token = await getSecureStore('token');
      if (!token) {
        console.log('No token available, skipping Firebase update');
        return null;
      }
      
      set({ updateFirebaseLoading: true });
      const response = await axiosInstance.get('/user/update_firebase', {
        params: {
          firebase: params.firebase,
        },
      });
      set({ updateFirebaseResponse: response });
      return response;
    } catch (error) {
      console.log(error);
      set({ updateFirebaseError: error });
    } finally {
      set({ updateFirebaseLoading: false });
    }
  },
}));
