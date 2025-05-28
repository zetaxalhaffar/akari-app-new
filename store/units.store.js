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
      console.log('response', response);
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
      console.log('response for apartments', response);
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
      setTimeout(() => {
        set({ shareDetailsLoading: false });
      }, 1000);
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
      setTimeout(() => {  
        set({ apartmentDetailsLoading: false });
      }, 1000);
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
          description: response?.message ?? 'تم إرسال الرسالة بنجاح',
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
          description: response?.message ?? 'تم إرسال الرسالة بنجاح',
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
      const response = await axiosInstance.post(
        `/apartment/create_sell_request/${apartmentId}`,
        data
      );
      set({ createApartmentSellRequestResponse: response });
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: response?.message ?? 'تم إرسال الرسالة بنجاح',
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
      const response = await axiosInstance.post(
        `/apartment/create_buy_request/${apartmentId}`,
        data
      );
      set({ createApartmentBuyRequestResponse: response });
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: response?.message ?? 'تم إرسال الرسالة بنجاح',
        },
      });
      return response;
    } catch (error) {
      notify('error', { params: { title: 'حدث خطأ ما', description: error?.message } });
      set({ createApartmentBuyRequestError: error });
    } finally {
      set({ createApartmentBuyRequestLoading: false });
    }
  },
  //https://arrows-dev.versetech.net/api/share/buy
  createShareRequestLoading: false,
  createShareRequestError: null,
  createShareRequestResponse: [],
  createShareRequest: async (type, data) => {
    try {
      set({ createShareRequestLoading: true });
      const response = await axiosInstance.post(`/share/${type}`, data);
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: response?.message ?? 'تم إرسال الرسالة بنجاح',
        },
      });
      return response;
    } catch (error) {
      notify('error', { params: { title: 'حدث خطأ ما', description: error?.message } });
      set({ createShareRequestError: error });
    } finally {
      set({ createShareRequestLoading: false });
    }
  },
  createApartmentRequestLoading: false,
  createApartmentRequestError: null,
  createApartmentRequestResponse: [],
  createApartmentRequest: async (type, data) => {
    try {
      set({ createApartmentRequestLoading: true });
      const response = await axiosInstance.post(`/apartment/${type}`, data);
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: response?.message ?? 'تم إرسال الرسالة بنجاح',
        },
      });
      return response;
    } catch (error) {
      notify('error', { params: { title: 'حدث خطأ ما', description: error?.message } });
      set({ createApartmentRequestError: error });
    } finally {
      set({ createApartmentRequestLoading: false });
    }
  },
  // https://arrows-dev.versetech.net/api/share/delete/{share_id}
  deleteShareLoading: false,
  deleteShareError: null,
  deleteShareResponse: [],
  deleteShare: async (shareId) => {
    try {
      set({ deleteShareLoading: true });
      const response = await axiosInstance.delete(`/share/delete/${shareId}`);
      set({ deleteShareResponse: response });
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: response?.message ?? 'تم حذف الطلب بنجاح',
        },
      });
      return response;
    } catch (error) {
      notify('error', { params: { title: 'حدث خطأ ما', description: error?.message } });
      set({ deleteShareError: error });
    } finally {
      set({ deleteShareLoading: false });
    }
  },
  // https://arrows-dev.versetech.net/api/apartment/delete/{apartment_id}
  deleteApartmentLoading: false,
  deleteApartmentError: null,
  deleteApartmentResponse: [],
  deleteApartment: async (apartmentId) => {
    try {
      set({ deleteApartmentLoading: true });
      const response = await axiosInstance.delete(`/apartment/delete/${apartmentId}`);
      set({ deleteApartmentResponse: response });
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: response?.message ?? 'تم حذف الطلب بنجاح',
        },
      });
      return response;
    } catch (error) {
      notify('error', { params: { title: 'حدث خطأ ما', description: error?.message } });
      set({ deleteApartmentError: error });
    } finally {
      set({ deleteApartmentLoading: false });
    }
  },
  // https://arrows-dev.versetech.net/api/share/update/{share_id}
  updateShareRequestLoading: false,
  updateShareRequestError: null,
  updateShareRequestResponse: [],
  updateShareRequest: async (shareId, data) => {
    try {
      set({ updateShareRequestLoading: true });
      const response = await axiosInstance.post(`/share/update/${shareId}`, data);
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: response?.message ?? 'تم تعديل الطلب بنجاح',
        },
      });
      return response;
    } catch (error) {
      notify('error', { params: { title: 'حدث خطأ ما', description: error?.message } });
      set({ updateShareRequestError: error });
    } finally {
      set({ updateShareRequestLoading: false });
    }
  },
  // https://arrows-dev.versetech.net/api/apartment/update/{apartment_id}
  updateApartmentRequestLoading: false,
  updateApartmentRequestError: null,
  updateApartmentRequestResponse: [],
  updateApartmentRequest: async (apartmentId, data) => {
    try {
      set({ updateApartmentRequestLoading: true });
      const response = await axiosInstance.post(`/apartment/update/${apartmentId}`, data);
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: response?.message ?? 'تم تعديل الطلب بنجاح',
        },
      });
      return response;
    } catch (error) {
      notify('error', { params: { title: 'حدث خطأ ما', description: error?.message } });
      set({ updateApartmentRequestError: error });
    } finally {
      set({ updateApartmentRequestLoading: false });
    }
  },
  // https://arrows-dev.versetech.net/api/apartment/search || https://arrows-dev.versetech.net/api/share/search
  searchForUnitsLoading: false,
  searchForUnitsError: null,
  searchForUnitsResponse: [],
  searchForUnits: async (data) => {
    try {
      set({ searchForUnitsLoading: true });
      const response = await axiosInstance.get(`/${data.currentType}/search`, { params: data });
      set({ searchForUnitsResponse: response });
      return response;
    } catch (error) {
      set({ searchForUnitsError: error });
      notify('error', { params: { title: 'حدث خطأ ما', description: error?.message } });
    } finally {
      set({ searchForUnitsLoading: false });
    }
  },
  // Clear search results
  clearSearchResults: () => {
    set({ 
      searchForUnitsResponse: { data: [] },
      searchForUnitsError: null 
    });
  },
  // Clear shares records
  clearSharesRecords: () => {
    set({ 
      sharesRecords: [],
      sharesResponse: []
    });
  },
  // Clear apartments records
  clearApartmentsRecords: () => {
    set({ 
      apartmentsRecords: [],
      apartmentsResponse: []
    });
  },
  // Update reaction counts for a share
  updateShareReactions: (shareId, reactionSummary) => {
    const sharesRecords = get().sharesRecords;
    const updatedShares = sharesRecords.map(share => {
      if (share.id === shareId) {
        return { ...share, reaction_counts: reactionSummary };
      }
      return share;
    });
    set({ sharesRecords: updatedShares });
  },
  // Update reaction counts for an apartment
  updateApartmentReactions: (apartmentId, reactionSummary) => {
    const apartmentsRecords = get().apartmentsRecords;
    const updatedApartments = apartmentsRecords.map(apartment => {
      if (apartment.id === apartmentId) {
        return { ...apartment, reaction_counts: reactionSummary };
      }
      return apartment;
    });
    set({ apartmentsRecords: updatedApartments });
  },
}));
