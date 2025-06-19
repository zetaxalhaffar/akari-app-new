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

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef();

  // Sample initial message
  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  }, []);

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
        disabled={isLoading}
        loading={isLoading}
        placeholder="اكتب رسالة..."
      />
    </SafeAreaView>
  );
};

export default Chat; 