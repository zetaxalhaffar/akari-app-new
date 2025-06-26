import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSecureStore, deleteSecureStore } from '../composables/secure.store';

const CHAT_MESSAGES_KEY = 'chat_messages';
const PENDING_API_CALL_KEY = 'pending_api_call';

/**
 * Chat storage utility using AsyncStorage instead of SecureStore
 * to avoid the 2048 byte limitation for large chat histories
 */
export const chatStorage = {
  /**
   * Migrate existing chat data from SecureStore to AsyncStorage
   * This should be called once during app initialization
   */
  migrateFromSecureStore: async () => {
    try {
      console.log('Starting chat data migration from SecureStore to AsyncStorage...');
      
      // Check if AsyncStorage already has data (migration already done)
      const existingMessages = await AsyncStorage.getItem(CHAT_MESSAGES_KEY);
      const existingPendingCall = await AsyncStorage.getItem(PENDING_API_CALL_KEY);
      
      if (existingMessages || existingPendingCall) {
        console.log('Migration already completed, skipping...');
        return;
      }
      
      // Migrate messages
      try {
        const secureMessages = await getSecureStore('chat_messages');
        if (secureMessages) {
          await AsyncStorage.setItem(CHAT_MESSAGES_KEY, secureMessages);
          await deleteSecureStore('chat_messages');
          console.log('Successfully migrated chat messages');
        }
      } catch (error) {
        console.log('No existing chat messages to migrate or migration error:', error.message);
      }
      
      // Migrate pending API call
      try {
        const securePendingCall = await getSecureStore('pending_api_call');
        if (securePendingCall) {
          await AsyncStorage.setItem(PENDING_API_CALL_KEY, securePendingCall);
          await deleteSecureStore('pending_api_call');
          console.log('Successfully migrated pending API call');
        }
      } catch (error) {
        console.log('No existing pending API call to migrate or migration error:', error.message);
      }
      
      console.log('Chat data migration completed successfully');
    } catch (error) {
      console.error('Error during chat data migration:', error);
      // Don't throw error - let the app continue even if migration fails
    }
  },

  /**
   * Save messages to AsyncStorage
   * @param {Array} messages - Array of message objects
   */
  saveMessages: async (messages) => {
    try {
      // Keep only the last 100 messages to prevent storage bloat
      const messagesToSave = messages.slice(-100).filter((msg) => msg.type !== 'typing');
      const jsonString = JSON.stringify(messagesToSave);
      await AsyncStorage.setItem(CHAT_MESSAGES_KEY, jsonString);
      console.log(`Saved ${messagesToSave.length} messages to storage`);
    } catch (error) {
      console.error('Error saving messages to storage:', error);
      throw error;
    }
  },

  /**
   * Load messages from AsyncStorage
   * @returns {Promise<Array>} Array of message objects
   */
  loadMessages: async () => {
    try {
      const jsonString = await AsyncStorage.getItem(CHAT_MESSAGES_KEY);
      if (jsonString) {
        const parsedMessages = JSON.parse(jsonString);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        console.log(`Loaded ${messagesWithDates.length} messages from storage`);
        return messagesWithDates;
      }
      return null;
    } catch (error) {
      console.error('Error loading messages from storage:', error);
      throw error;
    }
  },

  /**
   * Clear all messages from storage
   */
  clearMessages: async () => {
    try {
      await AsyncStorage.removeItem(CHAT_MESSAGES_KEY);
      console.log('Cleared all messages from storage');
    } catch (error) {
      console.error('Error clearing messages from storage:', error);
      throw error;
    }
  },

  /**
   * Save pending API call to AsyncStorage
   * @param {Object} pendingCall - Pending API call object
   */
  savePendingApiCall: async (pendingCall) => {
    try {
      const jsonString = JSON.stringify(pendingCall);
      await AsyncStorage.setItem(PENDING_API_CALL_KEY, jsonString);
    } catch (error) {
      console.error('Error saving pending API call:', error);
      throw error;
    }
  },

  /**
   * Load pending API call from AsyncStorage
   * @returns {Promise<Object|null>} Pending API call object or null
   */
  loadPendingApiCall: async () => {
    try {
      const jsonString = await AsyncStorage.getItem(PENDING_API_CALL_KEY);
      if (jsonString) {
        return JSON.parse(jsonString);
      }
      return null;
    } catch (error) {
      console.error('Error loading pending API call:', error);
      throw error;
    }
  },

  /**
   * Clear pending API call from storage
   */
  clearPendingApiCall: async () => {
    try {
      await AsyncStorage.removeItem(PENDING_API_CALL_KEY);
    } catch (error) {
      console.error('Error clearing pending API call:', error);
      throw error;
    }
  },

  /**
   * Get storage statistics for debugging
   * @returns {Promise<Object>} Storage stats
   */
  getStorageStats: async () => {
    try {
      const messagesData = await AsyncStorage.getItem(CHAT_MESSAGES_KEY);
      const pendingCallData = await AsyncStorage.getItem(PENDING_API_CALL_KEY);
      
      return {
        messagesSize: messagesData ? messagesData.length : 0,
        pendingCallSize: pendingCallData ? pendingCallData.length : 0,
        totalSize: (messagesData ? messagesData.length : 0) + 
                   (pendingCallData ? pendingCallData.length : 0),
        messagesCount: messagesData ? JSON.parse(messagesData).length : 0,
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return { messagesSize: 0, pendingCallSize: 0, totalSize: 0, messagesCount: 0 };
    }
  },
}; 