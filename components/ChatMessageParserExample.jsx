import React from 'react';
import { View, Text, Alert } from 'react-native';
import MessageBubble from './MessageBubble';

const ChatMessageParserExample = () => {
  // Example messages with the patterns
  const exampleMessages = [
    {
      id: '1',
      text: 'مرحباً! لقد وجدت عقار مناسب لك [Apartment | الرقم المرجعي: 123] في منطقة الشام.',
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: '2', 
      text: 'يمكنك أيضاً مراجعة هذه الأسهم التنظيمية [Share | الرقم المرجعي: 456] التي قد تهمك.',
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: '3',
      text: 'الأنماط العربية: [شقة | الرقم المرجعي: 555] و [سهم | الرقم المرجعي: 666] متاحة أيضاً.',
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: '4',
      text: 'هنا عدة خيارات: [Apartment | الرقم المرجعي: 789] و [Share | الرقم المرجعي: 101] و [شقة | الرقم المرجعي: 202]',
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: '5',
      text: 'شكراً لك، سأراجع هذه الخيارات.',
      isUser: true,
      timestamp: new Date(),
    }
  ];

  return (
    <View className="flex-1 p-4">
      <Text className="mb-4 text-center font-psemibold text-lg">
        Chat Message Parser Examples
      </Text>
      <Text className="mb-4 text-center font-pregular text-sm text-gray-600">
        Click on any reference number to navigate to the details
      </Text>
      
      {exampleMessages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message.text}
          isUser={message.isUser}
          timestamp={message.timestamp}
          isFirstMessage={false}
        />
      ))}
    </View>
  );
};

export default ChatMessageParserExample; 