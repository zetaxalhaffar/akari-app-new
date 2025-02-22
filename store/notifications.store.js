import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';
import { notify } from 'react-native-notificated';

export const useNotificationsStore = create((set) => ({
  //https://arrows-dev.versetech.net/api/notification/list
  notificationLoading: false,
  notificationError: null,
  notificationResponse: null,
  getNotifications: async (state) => {
    try {
      set({ notificationLoading: true });
      const response = await axiosInstance.get('/notification/list');
      set({ notificationResponse: response });
      return response;
    } catch (error) {
      console.log(error);
      set({ notificationError: error });
    } finally {
      set({ notificationLoading: false });
    }
  },
  notificationCount: 0,
  notificationCountLoading: false,
  notificationCountError: null,
  setNotificationCount: (count) => set({ notificationCount: count }),
  getNotificationCount: async () => {
    try {
      set({ notificationCountLoading: true });
      const response = await axiosInstance.get('/notification/count');
      set({ notificationCount: response.data.count });
    } catch (error) {
      console.log(error);
      set({ notificationCountError: error });
    } finally {
      set({ notificationCountLoading: false });
    }
  },
  deleteAllNotificationsLoading: false,
  deleteAllNotificationsError: null,
  deleteAllNotifications: async () => {
    try {
      set({ deleteAllNotificationsLoading: true });
      const response = await axiosInstance.delete('/notification/empty');
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: 'تم حذف الاشعارات',
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      set({ deleteAllNotificationsError: error });
    } finally {
      set({ deleteAllNotificationsLoading: false });
    }
  },
}));
