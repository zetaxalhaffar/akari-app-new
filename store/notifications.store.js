import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';

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
}));
