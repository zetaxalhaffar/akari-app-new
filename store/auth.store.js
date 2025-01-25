import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';

export const useAuthStore = create((set) => ({
  requestOtpSchema: {
    response: null,
  },
  requestOtpLoading: false,
  requestOtp: async (loginData) => {
    try {
      set({ requestOtpLoading: true });
      const response = await axiosInstance.post('/requestOtp', loginData);
      set({ requestOtpSchema: { response } });
      return response;
    } catch (error) {
      console.log(error);
      return error;
    } finally {
      set({ requestOtpLoading: false });
    }
  },
  loginWithOtpSchema: {
    loading: false,
    error: null,
    response: null,
  },
  loginWithOtploading: false,
  loginWithOtp: async (loginData) => {
    try {
      set({ loginWithOtploading: true });
      const response = await axiosInstance.post('/loginWithOtp', loginData);
      set({ loginWithOtpSchema: { response } });
      return response;
    } catch (error) {
      return error;
    } finally {
      set({ loginWithOtploading: false });
    }
  },
  signupSchema: {
    response: null,
  },
  signupLoading: false,
  signup: async (signupData) => {
    try {
      set({ signupLoading: true });
      const response = await axiosInstance.post('/signup', signupData);
      set({ signupSchema: { response } });
      return response;
    } catch (error) {
      return error;
    } finally {
      set({ signupLoading: false });
    }
  },
  // https://arrows-dev.versetech.net/api/user/auth_data
  authDataSchema: {
    loading: false,
    error: null,
    response: null,
  },
  getAuthData: async () => {
    try {
      set({ authDataSchema: { loading: true } });
      const response = await axiosInstance.get('/user/auth_data');
      set({ authDataSchema: { response } });
      return response;
    } catch (error) {
      return error;
    } finally {
      set({ authDataSchema: { loading: false } });
    }
  },
}));
