import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';
export const useVersionsStore = create((set) => ({
  versionSchemaLoading: false,
  versionSchemaError: null,
  versionSchemaResponse: null,
  showAlert: false,
  getVersion: async (state) => {
    try {
      set({ versionSchemaLoading: true });
      const response = await axiosInstance.get('/version/get');
      set({ versionSchemaResponse: response });
      return response;
    } catch (error) {
      set({ jobTitlesSchemaError: error });
    } finally {
      set({ versionSchemaLoading: false });
    }
  },
  setVersion: async (state) => {
    try {
      const response = await axiosInstance.post('/version/set', {
        version: state,
      });
      console.log(response, 'response');
    } catch (error) {
      set({ versionSchemaError: error });
    } finally {
      set({ versionSchemaLoading: false });
    }
  },
  showAlertFunction: (state) => {
    set({ showAlert: state.showAlert });
  },
}));
