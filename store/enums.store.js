import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';

export const useEnumsStore = create((set) => ({
  jobTitlesSchemaLoading: false,
  jobTitlesSchemaError: null,
  jobTitlesSchemaResponse: null,
  getJobTitles: async (state) => {
    try {
      set({ jobTitlesSchemaLoading: true });
      const response = await axiosInstance.get('/job_titles');
      set({ jobTitlesSchemaResponse: response });
      return response;
    } catch (error) {
      set({ jobTitlesSchemaError: error });
    } finally {
      set({ jobTitlesSchemaLoading: false });
    }
  },
  regionsSchema: {
    loading: false,
    error: null,
    response: null,
  },
  regions: [],
  //https://arrows-dev.versetech.net/api/region/list
  getRegions: async (state) => {
    try {
      set({ regionsSchema: { loading: true } });
      const response = await axiosInstance.get('/region/list');
      set({ regionsSchema: { response } });
      set({ regions: response });
      return response;
    } catch (error) {
      set({ regionsSchema: { error } });
    } finally {
      set({ regionsSchema: { loading: false } });
    }
  },
  //https://arrows-dev.versetech.net/api/sector/list/{region_id}
  sectorsBasedOnRegionSchema: {
    loading: false,
    error: null,
    response: {},
  },
  getSectorsBasedOnRegion: async (regionId) => {
    try {
      set({ sectorsBasedOnRegionSchema: { loading: true } });
      const response = await axiosInstance.get(`/sector/list/${regionId}`);
      set((state) => ({
        sectorsBasedOnRegionSchema: { ...state.sectorsBasedOnRegionSchema, response },
      }));
      return response;
    } catch (error) {
      set({ sectorsBasedOnRegionSchema: { error } });
    } finally {
      set({ sectorsBasedOnRegionSchema: { loading: false } });
    }
  },
  //https://arrows-dev.versetech.net/api/apartment/types
  apartmentTypesSchema: {
    loading: false,
    error: null,
    response: null,
  },
  getApartmentTypes: async () => {
    try {
      set({ apartmentTypesSchema: { loading: true } });
      const response = await axiosInstance.get('/apartment/types');
      set({ apartmentTypesSchema: { response } });
      return response;
    } catch (error) {
      set({ apartmentTypesSchema: { error } });
    } finally {
      set({ apartmentTypesSchema: { loading: false } });
    }
  },
  // https://arrows-dev.versetech.net/api/apartment_status
  apartmentStatusSchema: {
    loading: false,
    error: null,
    response: null,
  },
  getApartmentStatus: async () => {
    try {
      set({ apartmentStatusSchema: { loading: true } });
      const response = await axiosInstance.get('/apartment_status');
      set({ apartmentStatusSchema: { response } });
      return response;
    } catch (error) {
      set({ apartmentStatusSchema: { error } });
    } finally {
      set({ apartmentStatusSchema: { loading: false } });
    }
  },
  //https://arrows-dev.versetech.net/api/direction/list
  directionsSchema: {
    loading: false,
    error: null,
    response: null,
  },
  getDirections: async () => {
    try {
      set({ directionsSchema: { loading: true } });
      const response = await axiosInstance.get('/direction');
      set({ directionsSchema: { response } });
      return response;
    } catch (error) {
      set({ directionsSchema: { error } });
    } finally {
      set({ directionsSchema: { loading: false } });
    }
  },
  // https://arrows-dev.versetech.net/api/statistics
  statisticsSchemaLoading: true,
  statisticsSchemaError: null,
  statisticsSchemaResponse: null,
  getStatistics: async () => {
    try {
      set({ statisticsSchemaLoading: true });
      const response = await axiosInstance.get('/statistics');
      set({ statisticsSchemaResponse: response });
      return response;
    } catch (error) {
      set({ statisticsSchemaError: error });
    } finally {
      set({ statisticsSchemaLoading: false });
    }
  },
}));
