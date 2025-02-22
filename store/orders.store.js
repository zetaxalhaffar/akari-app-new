import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';

export const useOrdersStore = create((set, get) => ({
  //https://arrows-dev.versetech.net/api/share/orders/list
  sharesOrders: [],
  sharesOrdersLoading: false,
  sharesOrdersError: null,
  sharesResponse: [],
  getSharesOrders: async (params, firstLoad = false) => {
    try {
      set({ sharesOrdersLoading: true });
      const response = await axiosInstance.get('/share/orders/list', { params });
      set({ sharesResponse: response });
      const currentSharesRecords = get().sharesOrders; // Access current state
      if (firstLoad) {
        set({ sharesOrders: response.data });
      } else {
        set({ sharesOrders: [...currentSharesRecords, ...response.data] }); // Update state
      }
      return response;
    } catch (error) {
      set({ sharesOrdersError: error });
    } finally {
      set({ sharesOrdersLoading: false });
    }
  },
  // https://arrows-dev.versetech.net/api/share/orders/list
  apartmentsOrders: [],
  apartmentsResponse: [],
  apartmentsOrdersLoading: false,
  apartmentsOrdersError: null,
  getApartmentsOrders: async (params, firstLoad = false) => {
    try {
      set({ apartmentsOrdersLoading: true });
      const response = await axiosInstance.get('/apartment/orders/list', { params });
      set({ apartmentsResponse: response });
      const currentApartmentsRecords = get().apartmentsOrders; // Access current state
      if (firstLoad) {
        set({ apartmentsOrders: response.data });
      } else {
        set({ apartmentsOrders: [...currentApartmentsRecords, ...response.data] }); // Update state
      }
      return response;
    } catch (error) {
      set({ apartmentsOrdersError: error });
    } finally {
      set({ apartmentsOrdersLoading: false });
    }
  },
  // https://arrows-dev.versetech.net/api/profile/apartment/listAll/buy | sell
  apartmentsOrdersForCurrentUser: [],
  apartmentsOrdersForCurrentUserLoading: false,
  apartmentsOrdersForCurrentUserError: null,

  getApartmentsOrdersForCurrentUser: async (type, params, firstLoad = false) => {
    try {
      set({ apartmentsOrdersForCurrentUserLoading: true });
      const response = await axiosInstance.get(`/profile/apartment/listAll/${type}`, { params });
      set({ apartmentsOrdersForCurrentUser: response });
      return response;
    } catch (error) {
      set({ apartmentsOrdersForCurrentUserError: error });
    } finally {
      set({ apartmentsOrdersForCurrentUserLoading: false });
    }
  },
  // https://arrows-dev.versetech.net/api/profile/share/listAll/buy | sell
  sharesOrdersForCurrentUser: [],
  sharesOrdersForCurrentUserLoading: false,
  sharesOrdersForCurrentUserError: null,

  getSharesOrdersForCurrentUser: async (type, params, firstLoad = false) => {
    try {
      set({ sharesOrdersForCurrentUserLoading: true });

      const response = await axiosInstance.get(`/profile/share/listAll/${type}`, { params });
      set({ sharesOrdersForCurrentUser: response });
      return response;
    } catch (error) {
      set({ sharesOrdersForCurrentUserError: error });
    } finally {
      set({ sharesOrdersForCurrentUserLoading: false });
    }
  },
}));
