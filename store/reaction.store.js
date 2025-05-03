import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';

export const useReactionStore = create((set) => ({
  // https://arrows-dev.versetech.net/api/react
  reactionSchemaLoading: false,
  reactionSchemaError: null,
  reactionSchemaResponse: null,
  setReactions: async (state) => {
    try {
      set({ reactionSchemaLoading: true });
      const response = await axiosInstance.post('/react', state);
      console.log('response in reaction store=============');
      console.log('response', response);
      console.log('response in reaction store=============');
      set({ reactionSchemaResponse: response });
      return response;
    } catch (error) {
      set({ reactionSchemaError: error });
    } finally {
      set({ reactionSchemaLoading: false });
    }
  },
  // https://arrows-dev.versetech.net/api/react/remove
  removeReactionSchemaLoading: false,
  removeReactionSchemaError: null,
  removeReactionSchemaResponse: null,
  removeReaction: async (state) => {
    try {
      set({ removeReactionSchemaLoading: true });
      const response = await axiosInstance.delete('/react', {
        data: state,
      });
      console.log('response in reaction store=============');
      console.log('response', response);
      console.log('response in reaction store=============');
      set({ removeReactionSchemaResponse: response });
      return response;
    } catch (error) {
      set({ removeReactionSchemaError: error });
    } finally {
      set({ removeReactionSchemaLoading: false });
    }
  },
}));
