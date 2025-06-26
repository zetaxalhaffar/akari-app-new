import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';
import { notify } from 'react-native-notificated';
import { chatStorage } from '../utils/chatStorage';

export const useChatStore = create((set, get) => ({
  // Messages state
  messages: [],
  pendingApiCall: null, // Store pending API call info
  isTyping: false,
  activeApiCalls: new Set(), // Track active API calls to prevent duplicates
  typingTimeoutId: null, // Store timeout ID for safety timeout
  
  // Save pending API call to storage
  savePendingApiCall: async (pendingCall) => {
    try {
      await chatStorage.savePendingApiCall(pendingCall);
    } catch (error) {
      console.error('Error saving pending API call:', error);
    }
  },

  // Load pending API call from storage
  loadPendingApiCall: async () => {
    try {
      const pendingCall = await chatStorage.loadPendingApiCall();
      if (pendingCall) {
        set({ pendingApiCall: pendingCall });
        return pendingCall;
      }
    } catch (error) {
      console.error('Error loading pending API call:', error);
    }
    return null;
  },

  // Clear pending API call from both state and storage
  clearPendingApiCall: async () => {
    try {
      set({ pendingApiCall: null });
      await chatStorage.clearPendingApiCall();
    } catch (error) {
      console.error('Error clearing pending API call:', error);
    }
  },
  
  // Load messages from storage
  loadMessages: async () => {
    try {
      // First, migrate any existing data from SecureStore to AsyncStorage
      await chatStorage.migrateFromSecureStore();
      
      const savedMessages = await chatStorage.loadMessages();
      if (savedMessages && savedMessages.length > 0) {
        set({ messages: savedMessages });
      } else {
        // Set initial welcome message if no saved messages
        const welcomeMessage = {
          id: '1',
          text: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
          isUser: false,
          timestamp: new Date(),
        };
        set({ messages: [welcomeMessage] });
      }
    } catch (error) {
      console.error('Error loading messages from storage:', error);
      const welcomeMessage = {
        id: '1',
        text: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
        isUser: false,
        timestamp: new Date(),
      };
      set({ messages: [welcomeMessage] });
    }
  },

  // Save messages to storage
  saveMessages: async () => {
    try {
      const { messages } = get();
      await chatStorage.saveMessages(messages);
    } catch (error) {
      console.error('Error saving messages to storage:', error);
    }
  },

  // Add a new message
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message]
    }));
    get().saveMessages();
  },

  // Update message status
  updateMessageStatus: (messageId, status) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, status } : msg
      )
    }));
  },

  // Check if response already exists for a message
  hasResponseForMessage: (messageId) => {
    const { messages } = get();
    // Find the original user message
    const userMessageIndex = messages.findIndex(msg => msg.id === messageId);
    if (userMessageIndex === -1) return false;
    
    // Check if there's a non-user message (AI response) after this user message
    for (let i = userMessageIndex + 1; i < messages.length; i++) {
      if (!messages[i].isUser) {
        return true; // Found an AI response after this user message
      }
    }
    return false;
  },

  // Send message and handle API call
  sendMessage: async (messageText) => {
    const { addMessage, scheduleApiResponse, activeApiCalls, updateMessageStatus } = get();
    
    // MUST: Do not send any API call while another is active
    if (activeApiCalls.size > 0) {
      console.log('API call already active, blocking new message');
      return;
    }
    
    const userMessage = {
      id: Date.now().toString(),
      text: messageText.trim(),
      isUser: true,
      timestamp: new Date(),
      status: 'sent',
    };

    // Add user message
    addMessage(userMessage);

    // Start status animation for the newly sent message
    const deliveredDelay = Math.random() * 2000 + 1000; // 1-3 seconds
    setTimeout(() => {
      updateMessageStatus(userMessage.id, 'delivered');
    }, deliveredDelay);

    // Schedule API response
    scheduleApiResponse(userMessage.id, messageText.trim());
  },

  // Schedule API response with proper timing
  scheduleApiResponse: async (messageId, messageText) => {
    const { savePendingApiCall, handleApiResponse } = get();
    
    // Start typing indicator after a brief delay
    setTimeout(() => {
      set({ isTyping: true });
      
      // Set pending API call info
      const pendingCall = {
        messageId,
        messageText,
        timestamp: Date.now()
      };
      
      set({ pendingApiCall: pendingCall });
      savePendingApiCall(pendingCall);

      // Make API call with delay
      const apiCallDelay = Math.random() * 1000 + 500;
      setTimeout(() => {
        handleApiResponse(messageId, messageText);
      }, apiCallDelay);
      
    }, 1500); // 1.5 second delay before showing typing
  },

  // Handle API response (persists even if component unmounts)
  handleApiResponse: async (triggerMessageId, messageText) => {
    const { activeApiCalls } = get();
    
    // Check if this API call is already in progress
    if (activeApiCalls.has(triggerMessageId)) {
      console.log('API call already in progress for message:', triggerMessageId);
      return;
    }

    // Check if response already exists to prevent duplicates
    if (get().hasResponseForMessage(triggerMessageId)) {
      console.log('Response already exists for message:', triggerMessageId);
      await get().clearPendingApiCall();
      set({ isTyping: false });
      return;
    }

    // Mark this API call as active
    activeApiCalls.add(triggerMessageId);
    set({ activeApiCalls: new Set(activeApiCalls) });

    try {
      const response = await axiosInstance.post('/chat', {
        message: messageText,
      });

      const responseData = response;
      const aiMessage = {
        id: `ai-response-${Date.now()}`,
        text:
          responseData?.response ||
          responseData?.message ||
          responseData?.text ||
          responseData?.data ||
          (typeof responseData === 'string' ? responseData : null) ||
          'آسف، لم أتمكن من فهم طلبك.',
        isUser: false,
        timestamp: new Date(),
      };

      // Add AI response
      get().addMessage(aiMessage);
      
      // Update original message status to delivered
      get().updateMessageStatus(triggerMessageId, 'delivered');

    } catch (error) {
      console.error('Chat API Error:', error);
      
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: 'آسف، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
        isUser: false,
        timestamp: new Date(),
      };

      get().addMessage(errorMessage);
    } finally {
      // Clean up: remove from active calls, clear pending call and typing
      const { activeApiCalls, typingTimeoutId } = get();
      activeApiCalls.delete(triggerMessageId);
      
      // Clear the safety timeout if it exists
      if (typingTimeoutId) {
        clearTimeout(typingTimeoutId);
        set({ typingTimeoutId: null });
      }
      
      set({ activeApiCalls: new Set(activeApiCalls) });
      
      await get().clearPendingApiCall();
      set({ isTyping: false });
    }
  },

  // Check and resume pending API calls - ONLY show typing indicator, no new API calls
  checkPendingApiCalls: async () => {
    // Always reset typing indicator first to prevent stuck state
    set({ isTyping: false, typingTimeoutId: null });
    
    // Load pending API call from storage
    const pendingCall = await get().loadPendingApiCall();
    
    if (pendingCall) {
      const { messageId, messageText, timestamp } = pendingCall;
      
      // Check if the pending call is not too old (e.g., less than 5 minutes)
      const maxAge = 5 * 60 * 1000; // 5 minutes
      if (Date.now() - timestamp < maxAge) {
        // Check if response already exists
        if (get().hasResponseForMessage(messageId)) {
          console.log('Response already exists, clearing pending call');
          await get().clearPendingApiCall();
          return;
        }
        
        // IMPORTANT: Only show typing indicator, do NOT make a new API call
        // The original API call is still running in the background
        console.log('Showing typing indicator for pending API call');
        set({ isTyping: true });
        
        // Add safety timeout to clear typing indicator if API call was lost
        // This prevents the typing indicator from staying forever if the app was killed
        const safetyTimeout = setTimeout(async () => {
          console.log('Safety timeout: Clearing typing indicator and pending call');
          set({ isTyping: false });
          await get().clearPendingApiCall();
        }, 30000); // 30 seconds timeout
        
        // Store the timeout ID so we can clear it if needed
        set({ typingTimeoutId: safetyTimeout });
        
        // Do NOT call handleApiResponse here - let the original call complete
        
      } else {
        // Clear old pending call
        await get().clearPendingApiCall();
      }
    }
  },

  // Clear all messages
  clearMessages: async () => {
    try {
      await chatStorage.clearMessages();
      await get().clearPendingApiCall(); // Also clear any pending API calls
      const welcomeMessage = {
        id: Date.now().toString(),
        text: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
        isUser: false,
        timestamp: new Date(),
      };
      set({ 
        messages: [welcomeMessage],
        pendingApiCall: null,
        isTyping: false,
        activeApiCalls: new Set(),
        typingTimeoutId: null
      });
    } catch (error) {
      console.error('Error clearing messages:', error);
    }
  },

  // Delete chat threads
  deleteThreadsLoading: false,
  deleteThreadsError: null,
  deleteThreadsResponse: null,
  deleteThreads: async () => {
    try {
      set({ deleteThreadsLoading: true });
      const response = await axiosInstance.delete('/chat/threads');
      set({ deleteThreadsResponse: response });
      notify('success', {
        params: {
          title: 'تمت العملية بنجاح',
          description: 'تم حذف جميع الرسائل بنجاح',
        },
      });
      
      // Also clear local messages and pending calls
      await get().clearMessages();
      
      return response;
    } catch (error) {
      console.log(error);
      set({ deleteThreadsError: error });
      notify('error', {
        params: {
          title: 'حدث خطأ ما',
          description: error?.message || 'فشل في حذف الرسائل',
        },
      });
    } finally {
      set({ deleteThreadsLoading: false });
    }
  },

  // Manually clear typing indicator (useful for debugging or emergency reset)
  clearTypingIndicator: () => {
    const { typingTimeoutId } = get();
    
    // Clear the safety timeout if it exists
    if (typingTimeoutId) {
      clearTimeout(typingTimeoutId);
      set({ typingTimeoutId: null });
    }
    
    set({ isTyping: false });
    console.log('Manually cleared typing indicator');
  },

  // Get storage statistics for debugging
  getStorageStats: async () => {
    try {
      const stats = await chatStorage.getStorageStats();
      console.log('Chat Storage Stats:', stats);
      return stats;
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return null;
    }
  },
})); 