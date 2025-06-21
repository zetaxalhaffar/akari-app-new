import React, { useEffect, useState } from 'react';
import { I18nManager, Text, View } from 'react-native';

import { handleReferenceClick, parseMessageText } from '@/utils/messageParser';

const MessageBubble = ({ 
  message, 
  isUser, 
  timestamp, 
  isFirstMessage = false, 
  messageStatus = 'sent', // 'sent', 'delivered', 'read'
  onStatusChange = null,
  messageId = null
}) => {
  const [currentStatus, setCurrentStatus] = useState(messageStatus);

  useEffect(() => {
    if (isUser && messageStatus === 'sent' && onStatusChange && messageId) {
      // Generate random delay between 1-3 seconds for the second tick
      const deliveredDelay = Math.random() * 2000 + 1000; // 1-3 seconds

      const deliveredTimer = setTimeout(() => {
        setCurrentStatus('delivered');
        onStatusChange(messageId, 'delivered');

        // After showing delivered status, trigger typing indicator
        // Add small delay before showing typing indicator
        const typingDelay = 500; // 0.5 seconds after delivered
        setTimeout(() => {
          onStatusChange(messageId, 'typing');
        }, typingDelay);
      }, deliveredDelay);

      return () => clearTimeout(deliveredTimer);
    }
  }, [isUser, messageStatus, onStatusChange, messageId]);

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Function to render message status ticks
  const renderMessageStatus = () => {
    if (!isUser) return null;

    switch (currentStatus) {
      case 'sent':
        return <Text className="text-base font-black text-white/50">✔</Text>;
      case 'delivered':
      case 'read':
        return <Text className="text-base font-black text-blue-300">✔✔</Text>;
      default:
        return <Text className="text-base font-black text-white/50">✔</Text>;
    }
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
          <Text key={index} className={`font-pbold ${isUser ? 'text-white' : 'text-gray-800'}`}>
            {boldText}
          </Text>
        );
      }

      // Regular text
      return <Text key={index}>{part}</Text>;
    });
  };

  // Function to render parsed message with clickable links
  const renderParsedMessage = (text) => {
    if (!text) return null;

    const parsedParts = parseMessageText(text);

    return parsedParts.map((part, index) => {
      if (part.type === 'link') {
        return (
          <Text
            key={index}
            className={`font-psemibold ${isUser ? 'text-white' : 'text-blue-600'}`}
            onPress={() => handleReferenceClick(part.linkType, part.id)}
            style={{ paddingVertical: 3, paddingHorizontal: 3 }}>
            {part.content}
          </Text>
        );
      }

      // For regular text, also check for bold formatting
      return <Text key={index}>{renderFormattedText(part.content)}</Text>;
    });
  };

  // Render message container with gradient or solid background
  const renderMessageContainer = () => {
    const containerClass = `max-w-[80%] px-4 py-3`;
    
    const shadowStyle = {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    };

    if (isUser) {
      // User message with solid background
      return (
        <View
          className={containerClass}
          style={[
            shadowStyle, 
            { 
              backgroundColor: '#A88B67', // Solid brown color
              borderRadius: 16,
              borderBottomRightRadius: 4, // Sharp corner for user messages like WhatsApp
            }
          ]}>
          <Text
            className={`font-pregular text-base leading-6 text-white`}
            style={{ textAlign: I18nManager.isRTL ? 'left' : 'right' }}>
            {renderParsedMessage(message)}
          </Text>
          <View
            className={`mt-2 flex ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} justify-end`}>
            <Text className="text-xs text-white/70">
              {formatTime(timestamp)}
            </Text>
            <View className={`ml-1 flex ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
              {renderMessageStatus()}
            </View>
          </View>
        </View>
      );
    } else {
      // AI message with solid background
      return (
        <View
          className={containerClass}
          style={[
            shadowStyle,
            {
              backgroundColor: '#e1e4ea', // gray-200
              borderRadius: 16,
              borderBottomLeftRadius: 4, // Sharp corner for AI messages
            }
          ]}>
          <Text
            className={`font-pregular text-base leading-6 text-gray-800`}
            style={{ textAlign: I18nManager.isRTL ? 'left' : 'right' }}>
            {renderParsedMessage(message)}
          </Text>
          <View
            className={`mt-2 flex ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} justify-end`}>
            <Text className="text-xs text-gray-500">
              {formatTime(timestamp)}
            </Text>
          </View>
        </View>
      );
    }
  };

  return (
    <View
      className={`mx-3 mb-3 flex ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'} ${
        isUser ? 'justify-start' : 'justify-end' // User messages: left (brown), AI messages: right (gray)
      }`}>
      {renderMessageContainer()}
    </View>
  );
};

export default MessageBubble;