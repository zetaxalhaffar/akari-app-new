# Chat Interface Integration Guide

## Overview
The chat interface has been created with WhatsApp-style design that matches your app's look and feel. It consists of three main components:

1. **Chat Screen** (`app/chat.jsx`) - Main chat interface
2. **MessageBubble** (`components/MessageBubble.jsx`) - Individual message component
3. **ChatInput** (`components/ChatInput.jsx`) - Input area with send button
4. **TypingIndicator** (`components/TypingIndicator.jsx`) - Animated typing indicator

## Features

### ✅ Implemented Features
- **WhatsApp-style UI** with messages on right (user) and left (system)
- **Multiline text support** in the input field
- **HTTP request messaging** (no sockets)
- **Typing indicator** with animated dots while waiting for API response
- **Toast color scheme** matching your app (`#a47764`)
- **RTL support** with Arabic text alignment
- **Cairo font family** consistent with your app
- **Message timestamps** with proper Arabic formatting
- **Auto-scroll** to latest messages
- **Keyboard handling** with proper avoiding behavior
- **Send button states** (enabled/disabled/loading)
- **Message delivery indicators** (✓✓ for user messages)

## API Integration

The chat interface expects your API endpoint to:

**Endpoint:** `POST /api/chat`

**Request:**
```json
{
  "message": "User's message text",
  "conversation_id": "unique_session_id"
}
```

**Response:**
```json
{
  "response": "AI assistant's response text"
}
```

Or alternatively:
```json
{
  "message": "AI assistant's response text"
}
```

## Navigation Integration

### Option 1: Add as a Tab (Recommended)
Add to `app/(tabs)/_layout.tsx`:

```jsx
<Tabs.Screen
  key="chat"
  name="chat"
  options={{
    tabBarIcon: ({ color, focused }) => (
      <View style={{ justifyContent: 'center', alignItems: 'center', width: 80, paddingTop: 20 }}>
        <Ionicons 
          name={focused ? "chatbubble" : "chatbubble-outline"} 
          size={24} 
          color={color} 
        />
        <Text className="font-psemibold" style={{ color, fontSize: 10, marginTop: 2 }}>
          الدردشة
        </Text>
      </View>
    ),
  }}
/>
```

Then move `app/chat.jsx` to `app/(tabs)/chat.jsx`

### Option 2: Navigate from Existing Screen
Add a chat button to any existing screen:

```jsx
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// In your component's render:
<TouchableOpacity
  onPress={() => router.push('/chat')}
  className="bg-toast-500 rounded-full p-3"
>
  <Ionicons name="chatbubble" size={24} color="white" />
</TouchableOpacity>
```

### Option 3: Floating Action Button
Add to any screen:

```jsx
import { FAB } from 'react-native-paper';

// In your component:
<FAB
  icon="chat"
  style={{
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#a47764',
  }}
  onPress={() => router.push('/chat')}
/>
```

## Customization

### Update API Endpoint
In `app/chat.jsx`, change the API endpoint:

```jsx
const response = await axiosInstance.post('/your-api-endpoint', {
  message: messageText,
  conversation_id: 'user_chat_session',
});
```

### Customize Messages
Modify the response handling in `sendMessage` function:

```jsx
const aiMessage = {
  id: (Date.now() + 1).toString(),
  text: response.your_response_field || 'Default message',
  isUser: false,
  timestamp: new Date(),
};
```

### Change Colors
The interface uses your app's toast colors. To change:

1. Update `tailwind.config.js` toast colors
2. Or modify component classes directly:
   - User messages: `bg-toast-500` → `bg-blue-500`
   - Send button: `bg-toast-500` → `bg-blue-500`
   - Header: `bg-toast-500` → `bg-blue-500`

### Add Features

#### Message Status
In `MessageBubble.jsx`, you can add message status (sent, delivered, read):

```jsx
{isUser && (
  <View className="ml-1 flex-row">
    <Text className="text-xs text-white/70">
      {message.status === 'sent' && '✓'}
      {message.status === 'delivered' && '✓✓'}
      {message.status === 'read' && '✓✓'}
    </Text>
  </View>
)}
```

#### Voice Messages
Add microphone button to `ChatInput.jsx`:

```jsx
<TouchableOpacity className="mr-2">
  <Ionicons name="mic" size={24} color="#9CA3AF" />
</TouchableOpacity>
```

#### File Attachments
Add attachment button:

```jsx
<TouchableOpacity className="mr-2">
  <Ionicons name="attach" size={24} color="#9CA3AF" />
</TouchableOpacity>
```

## Troubleshooting

### API Not Working
1. Check if your API endpoint is correct
2. Verify the request/response format
3. Check network connectivity
4. Review console logs for errors

### Styling Issues
1. Ensure NativeWind is properly configured
2. Check if Cairo fonts are loaded
3. Verify toast colors are defined in tailwind.config.js

### Keyboard Issues
1. Adjust `keyboardVerticalOffset` in `ChatInput.jsx`
2. Test on both iOS and Android
3. Check if `KeyboardAvoidingView` behavior is appropriate

## File Structure
```
app/
  chat.jsx                 # Main chat screen
components/
  MessageBubble.jsx        # Individual message component
  ChatInput.jsx           # Input area with send button
  TypingIndicator.jsx     # Animated typing indicator
```

This chat interface is production-ready and follows your app's design patterns. You can easily extend it with additional features as needed. 