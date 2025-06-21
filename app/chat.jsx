import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axiosInstance from '@/utils/axiosInstance';
import TypingIndicator from '@/components/TypingIndicator';
import MessageBubble from '@/components/MessageBubble';
import ChatInput from '@/components/ChatInput';
import HomePageHeader from '@/components/HomePageHeader';
import CustomAlert from '@/components/CustomAlert';
import { getSecureStore, setSecureStore } from '@/composables/secure.store';
import { useChatStore } from '@/store/chat.store';
import { useAuthStore } from '@/store/auth.store';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showClearAlert, setShowClearAlert] = useState(false);
  const flatListRef = useRef();

  // Import chat store functions
  const { deleteThreads, deleteThreadsLoading } = useChatStore();
  
  // Get user data from secure storage (same as support screen)
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await getSecureStore('user');
        if (user) {
          setUserData(JSON.parse(user));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);

  // Load messages from storage on component mount
  useEffect(() => {
    loadMessagesFromStorage();
  }, []);

  // Save messages to storage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessagesToStorage();
    }
  }, [messages]);

  const loadMessagesFromStorage = async () => {
    try {
      const savedMessages = await getSecureStore('chat_messages');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsedMessages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } else {
        // Set initial welcome message if no saved messages
        setMessages([
          {
            id: '1',
            text: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error('Error loading messages from storage:', error);
      // Set initial welcome message on error
      setMessages([
        {
          id: '1',
          text: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const saveMessagesToStorage = async () => {
    try {
      // Keep only the last 30 messages
      const messagesToSave = messages.slice(-100).filter(msg => msg.type !== 'typing');
      await setSecureStore('chat_messages', JSON.stringify(messagesToSave));
    } catch (error) {
      console.error('Error saving messages to storage:', error);
    }
  };

  const clearChatHistory = async () => {
    try {
      // Hide the dialog immediately
      setShowClearAlert(false);
      
      // Clear messages from server first
      await deleteThreads();
      
      // Clear messages from storage
      await setSecureStore('chat_messages', JSON.stringify([]));
      
      // Reset messages to initial welcome message
      setMessages([
        {
          id: Date.now().toString(),
          text: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim().length === 0) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    const messageText = inputText.trim();
    setInputText('');
    setIsLoading(true);

    const aiResponseId = `ai-response-${Date.now()}`;
    const typingPlaceholder = {
      id: aiResponseId,
      type: 'typing',
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage, typingPlaceholder]);

    try {
      // Make HTTP request to AI API
      const response = await axiosInstance.post('/chat', {
        message: messageText,
      });

      // Since axios interceptor returns response.data directly,
      // 'response' here is actually the response body, not the full axios response
      const responseData = response;

      // Add AI response to chat
      const aiMessage = {
        id: aiResponseId,
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

      setMessages(prev =>
        prev.map(msg => (msg.id === aiResponseId ? aiMessage : msg))
      );
    } catch (error) {
      console.error('Chat API Error:', error);
      // Add error message
      const errorMessage = {
        id: aiResponseId,
        text: 'آسف، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev =>
        prev.map(msg => (msg.id === aiResponseId ? errorMessage : msg))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item, index }) => {
    if (item.type === 'typing') {
      return <TypingIndicator />;
    }
    return (
      <MessageBubble
        message={item.text}
        isUser={item.isUser}
        timestamp={item.timestamp}
        isFirstMessage={index === 0 && !item.isUser}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white py-2 border-b border-gray-200">
        <HomePageHeader />
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        className="flex-1"
        contentContainerStyle={{ paddingTop: 16 }}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input Area */}
      <ChatInput
        value={inputText}
        onChangeText={setInputText}
        onSend={sendMessage}
        onClearHistory={() => setShowClearAlert(true)}
        hasMessages={messages.length > 1} // More than just the welcome message
        disabled={isLoading || deleteThreadsLoading}
        loading={isLoading}
        clearLoading={deleteThreadsLoading}
        placeholder="اكتب رسالة..."
        user={userData}
      />

      {/* Clear History Alert */}
      <CustomAlert
        visible={showClearAlert}
        title="مسح السجل"
        message="هل أنت متأكد من أنك تريد مسح جميع رسائل المحادثة؟ لا يمكن التراجع عن هذا الإجراء."
        onConfirm={clearChatHistory}
        onCancel={() => setShowClearAlert(false)}
      />
    </SafeAreaView>
  );
};

export default Chat; 