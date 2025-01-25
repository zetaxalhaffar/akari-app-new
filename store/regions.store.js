import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';

export const useRegionsStore = create((set) => ({
  //https://arrows-dev.versetech.net/api/region/list
  regionLoading: false,
  regionError: null,
  regionResponse: null,
  getRegions: async (state) => {
    try {
      set({ regionLoading: true });
      const response = await axiosInstance.get('/region/list');
      set({ regionResponse: response });
      return response;
    } catch (error) {
      console.log(error);
      set({ regionError: error });
    } finally {
      set({ regionLoading: false });
    }
  },
}));

