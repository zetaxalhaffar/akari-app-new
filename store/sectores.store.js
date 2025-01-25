import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';

export const useSectoresStore = create((set, get) => ({
  //https://arrows-dev.versetech.net/api/sector/list/{region_id}
  sectors: [],
  sectorsLoading: false,
  sectorsError: null,
  sectorsResponse: [],
  getSectors: async (region_id, params, firstLoad = false) => {
    try {
      set({ sectorsLoading: true });
      const response = await axiosInstance.get(`/sector/list/${region_id}`, { params });
      set({ sectorsResponse: response });
      return response;
    } catch (error) {
      set({ sectorsError: error });
    } finally {
      set({ sectorsLoading: false });
    }
  },
}));
