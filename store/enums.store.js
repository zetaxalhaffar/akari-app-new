import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';

export const useEnumsStore = create((set) => ({
  jobTitlesSchema: {
    loading: false,
    error: null,
    response: null,
  },
  getJobTitles: async (state) => {
    try {
      const response = await axiosInstance.get('/job_titles');
      set({ jobTitlesSchema: { response } });
    } catch (error) {
      console.log(error);
      set({ jobTitlesSchema: { error } });
    }
  },
}));
