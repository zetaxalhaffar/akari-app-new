import React, { useEffect, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import ChatInput from '@/components/ChatInput';
import CustomAlert from '@/components/CustomAlert';
import HomePageHeader from '@/components/HomePageHeader';
import MessageBubble from '@/components/MessageBubble';
import TypingIndicator from '@/components/TypingIndicator';
import { getSecureStore } from '@/composables/secure.store';
import { useChatStore } from '@/store/chat.store';

const Chat = () => {
  const [inputText, setInputText] = useState('');
  const [showClearAlert, setShowClearAlert] = useState(false);
  const flatListRef = useRef();
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  
  // Get params from navigation
  const params = useLocalSearchParams();

  // Import chat store functions and state
  const { 
    messages, 
    isTyping, 
    loadMessages, 
    sendMessage, 
    checkPendingApiCalls,
    deleteThreads, 
    deleteThreadsLoading 
  } = useChatStore();

  // Get user data from secure storage
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

  // Auto-scroll when typing indicator changes
  useEffect(() => {
    if (isTyping) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [isTyping]);

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

  // Load messages and check for pending API calls on component mount
  useEffect(() => {
    const initializeChat = async () => {
      await loadMessages();
      // Check if there are any pending API calls to resume
      await checkPendingApiCalls();
    };
    initializeChat();
  }, []);

  // Auto-send message if provided via navigation params
  useEffect(() => {
    if (params.autoMessage && typeof params.autoMessage === 'string' && params.autoMessage.trim()) {
      // Wait a bit for the chat to initialize
      const timer = setTimeout(() => {
        sendMessage(params.autoMessage.trim());
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [params.autoMessage, sendMessage]);

  const clearChatHistory = async () => {
    try {
      // Hide the dialog immediately
      setShowClearAlert(false);

      // Clear messages from server and local storage
      await deleteThreads();
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  const handleSendMessage = async () => {
    if (inputText.trim().length === 0) return;

    const messageText = inputText.trim();
    setInputText('');
    
    // Use store's sendMessage function
    await sendMessage(messageText);
  };

  const renderMessage = ({ item, index }) => {
    return (
      <MessageBubble
        message={item.text}
        isUser={item.isUser}
        timestamp={item.timestamp}
        isFirstMessage={index === 0 && !item.isUser}
        messageStatus={item.status}
        messageId={item.id}
        onStatusChange={null} // No animations for loaded messages - status is managed in store
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
      {isTyping && <TypingIndicator />}

      {/* Input Area */}
      <ChatInput
        value={inputText}
        onChangeText={setInputText}
        onSend={handleSendMessage}
        onClearHistory={() => setShowClearAlert(true)}
        hasMessages={messages.length > 1} // More than just the welcome message
        disabled={deleteThreadsLoading || isTyping}
        loading={false}
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
