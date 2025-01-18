import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';
import { notify } from 'react-native-notificated';

export const useUnitsStore = create((set, get) => ({
  // https://arrows-dev.versetech.net/api/share/list/{region_id}
  sharesLoading: false,
  sharesError: null,
  sharesResponse: [],
  sharesRecords: [],
  getAllSharesForRegion: async (regionId, params, firstLoad = false) => {
    try {
      set({ sharesLoading: true });
      const response = await axiosInstance.get(`/share/list/${regionId}`, { params });
      const currentSharesRecords = get().sharesRecords; // Access current state
      set({ sharesResponse: response });
      if (firstLoad) {
        set({ sharesRecords: response.data });
      } else {
        set({ sharesRecords: [...currentSharesRecords, ...response.data] }); // Update state
      }
      return response;
    } catch (error) {
      set({ sharesError: error });
    } finally {
      set({ sharesLoading: false });
    }
  },
  // https://arrows-dev.versetech.net/api/apartment/list/{region_id}
  apartmentsLoading: false,
  apartmentsError: null,
  apartmentsResponse: [],
  apartmentsRecords: [],
  getAllApartmentsForRegion: async (regionId, params, firstLoad = false) => {
    try {
      set({ apartmentsLoading: true });
      const response = await axiosInstance.get(`/apartment/list/${regionId}`, { params });
      const currentApartmentsRecords = get().apartmentsRecords; // Access current state
      set({ apartmentsResponse: response });
      if (firstLoad) {
        set({ apartmentsRecords: response.data });
      } else {
        set({ apartmentsRecords: [...currentApartmentsRecords, ...response.data] }); // Update state
      }
      return response;
    } catch (error) {
      set({ apartmentsError: error });
    } finally {
      set({ apartmentsLoading: false });
    }
  },
  // https://akari.versetech.net/api/share/view/{id}
  shareDetailsLoading: false,
  shareDetailsError: null,
  shareDetailsResponse: [],
  getShareDetails: async (id) => {
    try {
      set({ shareDetailsLoading: true });
      const response = await axiosInstance.get(`/share/view/${id}`);
      set({ shareDetailsResponse: response });
      return response;
    } catch (error) {
      set({ shareDetailsError: error });
    } finally {
      set({ shareDetailsLoading: false });
    }
  },
  // https://arrows-dev.versetech.net/api/apartment/view/{id}
  apartmentDetailsLoading: false,
  apartmentDetailsError: null,
  apartmentDetailsResponse: [],
  getApartmentDetails: async (id) => {
    try {
      set({ apartmentDetailsLoading: true });
      const response = await axiosInstance.get(`/apartment/view/${id}`);
      set({ apartmentDetailsResponse: response });
      return response;
    } catch (error) {
      set({ apartmentDetailsError: error });
    } finally {
      set({ apartmentDetailsLoading: false });
    }
  },
  // https://arrows-dev.versetech.net/api/share/create_sell_request/{share_id}
  createSellRequestLoading: false,
  createSellRequestError: null,
  createSellRequestResponse: [],
  createSellRequest: async (shareId, data) => {
    try {
      set({ createSellRequestLoading: true });
      const response = await axiosInstance.post(`/share/create_sell_request/${shareId}`, data);
      set({ createSellRequestResponse: response });
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: response?.message ?? "تم إرسال الرسالة بنجاح",
        },
      });
      return response;
    } catch (error) {
      notify('error', { params: { title: 'حدث خطأ ما', description: error?.message } });
      set({ createSellRequestError: error });
    } finally {
      set({ createSellRequestLoading: false });
    }
  },
  // https://arrows-dev.versetech.net/api/share/create_buy_request/{share_id}
  createBuyRequestLoading: false,
  createBuyRequestError: null,
  createBuyRequestResponse: [],
  createBuyRequest: async (shareId, data) => {
    try {
      set({ createBuyRequestLoading: true });
      const response = await axiosInstance.post(`/share/create_buy_request/${shareId}`, data);
      set({ createBuyRequestResponse: response });
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: response?.message ?? "تم إرسال الرسالة بنجاح",
        },
      });
      return response;
    } catch (error) {
      notify('error', { params: { title: 'حدث خطأ ما', description: error?.message } });
      set({ createBuyRequestError: error });
    } finally {
      set({ createBuyRequestLoading: false });
    }
  },
  // https://arrows-dev.versetech.net/api/apartment/create_sell_request/{apartment_id}
  createApartmentSellRequestLoading: false,
  createApartmentSellRequestError: null,
  createApartmentSellRequestResponse: [],
  createApartmentSellRequest: async (apartmentId, data) => {
    try {
      set({ createApartmentSellRequestLoading: true });
      const response = await axiosInstance.post(`/apartment/create_sell_request/${apartmentId}`, data);
      set({ createApartmentSellRequestResponse: response });
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: response?.message ?? "تم إرسال الرسالة بنجاح",
        },
      });
      return response;
    } catch (error) {
      notify('error', { params: { title: 'حدث خطأ ما', description: error?.message } });
      set({ createApartmentSellRequestError: error });
    } finally {
      set({ createApartmentSellRequestLoading: false });
    }
  },
  // https://arrows-dev.versetech.net/api/apartment/create_buy_request/{apartment_id}
  createApartmentBuyRequestLoading: false,
  createApartmentBuyRequestError: null,
  createApartmentBuyRequestResponse: [],
  createApartmentBuyRequest: async (apartmentId, data) => {
    try {
      set({ createApartmentBuyRequestLoading: true });
      const response = await axiosInstance.post(`/apartment/create_buy_request/${apartmentId}`, data);
      set({ createApartmentBuyRequestResponse: response });
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: response?.message ?? "تم إرسال الرسالة بنجاح",
        },
      });
      return response;
    } catch (error) {
      notify('error', { params: { title: 'حدث خطأ ما', description: error?.message } });
      set({ createApartmentBuyRequestError: error });
    } finally {
      set({ createApartmentBuyRequestLoading: false });
    }
  }
}));
