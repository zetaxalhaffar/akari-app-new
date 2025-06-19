import React from 'react';
import { View, Text, I18nManager } from 'react-native';

const MessageBubble = ({ message, isUser, timestamp, isFirstMessage = false }) => {
  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Function to parse markdown-style bold text and render it
  const renderFormattedText = (text) => {
    if (!text) return null;
    
    // Split text by bold markers **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      // Check if this part is bold (wrapped in **)
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2); // Remove ** from both ends
        return (
          <Text
            key={index}
            className={`font-pbold ${isUser ? 'text-white' : 'text-gray-800'}`}
          >
            {boldText}
          </Text>
        );
      }
      
      // Regular text
      return (
        <Text key={index}>
          {part}
        </Text>
      );
    });
  };

  return (
    <View
      className={`mx-3 mb-3 flex-row ${
        isUser ? 'justify-start' : 'justify-end' // User messages: left (brown), AI messages: right (gray)
      }`}
    >
      <View
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-toast-500 rounded-br-md'
            : isFirstMessage
            ? 'bg-gray-200 rounded-br-md'
            : 'bg-gray-200 rounded-br-md'
        }`}
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <Text
          className={`font-pregular text-base leading-6 ${
            isUser ? 'text-white' : 'text-gray-800'
          }`}
          style={{ textAlign: I18nManager.isRTL ? 'left' : 'right' }}
        >
          {renderFormattedText(message)}
        </Text>
        <View className={`mt-2 flex-row ${isUser ? 'justify-start' : 'justify-end'}`}>
          <Text
            className={`text-xs ${
              isUser ? 'text-white/70' : 'text-gray-500'
            }`}
          >
            {formatTime(timestamp)}
          </Text>
          {isUser && (
            <View className="ml-1 flex-row">
              {/* Double checkmark for delivered/read status */}
              <Text className="text-xs text-white/70">✓✓</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default MessageBubble; 