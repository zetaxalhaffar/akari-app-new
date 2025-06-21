import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';
import { notify } from 'react-native-notificated';

export const useChatStore = create((set) => ({
  // Delete chat threads
  deleteThreadsLoading: false,
  deleteThreadsError: null,
  deleteThreadsResponse: null,
  deleteThreads: async () => {
    try {
      set({ deleteThreadsLoading: true });
      const response = await axiosInstance.delete('/chat/threads');
      set({ deleteThreadsResponse: response });
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: 'تم حذف جميع الرسائل بنجاح',
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      set({ deleteThreadsError: error });
      notify('error', {
        params: {
          title: 'حدث خطأ ما',
          description: error?.message || 'فشل في حذف الرسائل',
        },
      });
    } finally {
      set({ deleteThreadsLoading: false });
    }
  },
})); 