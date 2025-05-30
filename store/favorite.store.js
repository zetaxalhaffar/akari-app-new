import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';

export const useFavoriteStore = create((set) => ({
  // GET /favorites - Display a listing of user's favorites
  favoritesListLoading: false,
  favoritesListError: null,
  favoritesListResponse: null,
  getFavoritesList: async (type = 'all', page = 1) => {
    try {
      set({ favoritesListLoading: true });
      const response = await axiosInstance.get('/favorites', {
        params: { type, page }
      });
      console.log('response in favorites store (list)=============');
      console.log('response', response);
      console.log('response in favorites store (list)=============');
      set({ favoritesListResponse: response });
      return response;
    } catch (error) {
      set({ favoritesListError: error });
    } finally {
      set({ favoritesListLoading: false });
    }
  },

  // POST /favorites - Add an item to favorites
  addFavoriteLoading: false,
  addFavoriteError: null,
  addFavoriteResponse: null,
  addFavorite: async (state) => {
    try {
      set({ addFavoriteLoading: true });
      const response = await axiosInstance.post('/favorites', state);
      console.log('response in favorites store (add)=============');
      console.log('response', response);
      console.log('response in favorites store (add)=============');
      set({ addFavoriteResponse: response });
      return response;
    } catch (error) {
      set({ addFavoriteError: error });
    } finally {
      set({ addFavoriteLoading: false });
    }
  },

  // POST /favorites/toggle - Toggle favorite status for an item
  toggleFavoriteLoading: false,
  toggleFavoriteError: null,
  toggleFavoriteResponse: null,
  toggleFavorite: async (state) => {
    try {
      set({ toggleFavoriteLoading: true });
      const response = await axiosInstance.post('/favorites/toggle', state);
      console.log('response in favorites store (toggle)=============');
      console.log('response', response);
      console.log('response in favorites store (toggle)=============');
      set({ toggleFavoriteResponse: response });
      return response;
    } catch (error) {
      set({ toggleFavoriteError: error });
    } finally {
      set({ toggleFavoriteLoading: false });
    }
  },

  // POST /favorites/check - Check if an item is favorited by the user
  checkFavoriteLoading: false,
  checkFavoriteError: null,
  checkFavoriteResponse: null,
  checkFavorite: async (state) => {
    try {
      set({ checkFavoriteLoading: true });
      const response = await axiosInstance.post('/favorites/check', state);
      console.log('response in favorites store (check)=============');
      console.log('response', response);
      console.log('response in favorites store (check)=============');
      set({ checkFavoriteResponse: response });
      return response;
    } catch (error) {
      set({ checkFavoriteError: error });
    } finally {
      set({ checkFavoriteLoading: false });
    }
  },

  // DELETE /favorites/{type}/{id} - Remove an item from favorites
  removeFavoriteLoading: false,
  removeFavoriteError: null,
  removeFavoriteResponse: null,
  removeFavorite: async (type, id) => {
    try {
      set({ removeFavoriteLoading: true });
      const response = await axiosInstance.delete(`/favorites/${type}/${id}`);
      console.log('response in favorites store (remove)=============');
      console.log('response', response);
      console.log('response in favorites store (remove)=============');
      set({ removeFavoriteResponse: response });
      return response;
    } catch (error) {
      set({ removeFavoriteError: error });
    } finally {
      set({ removeFavoriteLoading: false });
    }
  },
})); 