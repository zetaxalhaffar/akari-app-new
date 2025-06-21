import React, { useEffect, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ChatInput from '@/components/ChatInput';
import CustomAlert from '@/components/CustomAlert';
import HomePageHeader from '@/components/HomePageHeader';
import MessageBubble from '@/components/MessageBubble';
import TypingIndicator from '@/components/TypingIndicator';
import { getSecureStore, setSecureStore } from '@/composables/secure.store';
import { useChatStore } from '@/store/chat.store';
import axiosInstance from '@/utils/axiosInstance';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showClearAlert, setShowClearAlert] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const flatListRef = useRef();
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  // Import chat store functions
  const { deleteThreads, deleteThreadsLoading } = useChatStore();

  // Get user data from secure storage (same as support screen)
  const [userData, setUserData] = useState(null);

  // Dedicated scroll function
  const scrollToBottom = (animated = true) => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated });
    }, 150);
  };

  // Auto-scroll when messages change
  useEffect(() => {
    if (shouldScrollToBottom && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages, shouldScrollToBottom]);

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
        const messagesWithDates = parsedMessages.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
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
      // Keep only the last 100 messages and filter out typing indicators
      const messagesToSave = messages.slice(-100).filter((msg) => msg.type !== 'typing');
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

  // Handle message status changes
  const handleMessageStatusChange = (messageId, newStatus) => {
    if (newStatus === 'delivered') {
      // Update the message status to delivered
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: 'delivered' } : msg
        )
      );
    } else if (newStatus === 'typing') {
      // Show typing indicator after delivered status
      setShowTypingIndicator(true);
      
      // Scroll to bottom when typing indicator appears
      setTimeout(() => {
        scrollToBottom();
      }, 100);
      
      // Start the actual API call with some delay to make it feel more natural
      const apiCallDelay = Math.random() * 1000 + 500; // 0.5-1.5 seconds
      setTimeout(() => {
        performApiCall(messageId);
      }, apiCallDelay);
    }
  };

  const performApiCall = async (triggerMessageId) => {
    try {
      // Get the user message that triggered this
      const triggerMessage = messages.find(msg => msg.id === triggerMessageId);
      if (!triggerMessage) return;

      // Make HTTP request to AI API
      const response = await axiosInstance.post('/chat', {
        message: triggerMessage.text,
      });

      // Since axios interceptor returns response.data directly,
      // 'response' here is actually the response body, not the full axios response
      const responseData = response;

      // Add AI response to chat
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

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat API Error:', error);
      // Add error message
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: 'آسف، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setShowTypingIndicator(false);
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim().length === 0) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
      status: 'sent', // Initial status
    };

    setInputText('');
    setMessages((prev) => [...prev, userMessage]);

    // Note: The API call will be triggered by the message status change
    // This creates a more realistic flow: send -> delivered -> typing -> response
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
        messageStatus={item.status}
        messageId={item.id}
        onStatusChange={handleMessageStatusChange}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="border-b border-gray-200 bg-white py-2">
        <HomePageHeader />
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        className="flex-1"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
        onContentSizeChange={() => {
          if (shouldScrollToBottom) {
            scrollToBottom();
          }
        }}
        onLayout={() => {
          if (shouldScrollToBottom) {
            scrollToBottom(false);
          }
        }}
      />

      {/* Typing Indicator */}
      {showTypingIndicator && <TypingIndicator />}

      {/* Input Area */}
      <ChatInput
        value={inputText}
        onChangeText={setInputText}
        onSend={sendMessage}
        onClearHistory={() => setShowClearAlert(true)}
        hasMessages={messages.length > 1} // More than just the welcome message
        disabled={isLoading || deleteThreadsLoading || showTypingIndicator}
        loading={isLoading}
        clearLoading={deleteThreadsLoading}
        placeholder="اكتب رسالة..."
        user={userData}
      />

      {/* Clear Chat Alert */}
      <CustomAlert
        visible={showClearAlert}
        title="حذف المحادثة"
        message="هل أنت متأكد من أنك تريد حذف جميع الرسائل؟"
        onConfirm={clearChatHistory}
        onCancel={() => setShowClearAlert(false)}
        confirmText="حذف"
        cancelText="إلغاء"
      />
    </SafeAreaView>
  );
};

export default Chat;
