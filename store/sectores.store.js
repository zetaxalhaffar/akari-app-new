import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';

export const useSectoresStore = create((set, get) => ({
  //https://arrows-dev.versetech.net/api/sector/list/{region_id}
  sectors: [],
  sectorsLoading: false,
  sectorsError: null,
  sectorsResponse: {},
  sectorsRecords: [],
  getSectors: async (region_id, params, firstLoad = false) => {
    try {
      set({ sectorsLoading: true });
      const response = await axiosInstance.get(`/sector/list/${region_id}`, { params });
      
      if (firstLoad) {
        set({ 
          sectorsResponse: response,
          sectorsRecords: response.data || []
        });
      } else {
        // For pagination, we need to merge the 'code' arrays within each sector type
        const currentRecords = get().sectorsRecords;
        const newData = response.data || [];
        
        const mergedRecords = currentRecords.map((currentSector, index) => {
          const newSector = newData[index];
          if (newSector && newSector.key === currentSector.key) {
            return {
              ...currentSector,
              code: [...currentSector.code, ...(newSector.code || [])]
            };
          }
          return currentSector;
        });
        
        set({ 
          sectorsResponse: response,
          sectorsRecords: mergedRecords
        });
      }
      
      return response;
    } catch (error) {
      set({ sectorsError: error });
    } finally {
      set({ sectorsLoading: false });
    }
  },
}));
