import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatInput = ({
  value,
  onChangeText,
  onSend,
  disabled = false,
  loading = false,
  placeholder = "اكتب رسالة...",
}) => {
  const handleSend = () => {
    if (value.trim().length > 0 && !disabled && !loading) {
      onSend();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
              <View className="border-t border-gray-200 bg-white py-3">
        <View className="flex-row items-center">
          {/* Send Button */}
          <TouchableOpacity
            onPress={handleSend}
            disabled={value.trim().length === 0 || disabled || loading}
            className="h-18 w-18 items-center justify-center mx-[3px]"
          >
            {loading ? (
              <ActivityIndicator 
                size="large" 
                color={value.trim().length > 0 && !disabled ? '#a47764' : '#9CA3AF'} 
              />
            ) : (
              <Ionicons
                name="caret-forward"
                size={36}
                color={value.trim().length > 0 && !disabled ? '#a47764' : '#9CA3AF'}
              />
            )}
          </TouchableOpacity>

          {/* Input Container */}
          <View 
            className="flex-1 max-h-32 border border-gray-300 bg-gray-50 px-4 py-3 mr-3"
            style={{ borderRadius: 5 }}
          >
            <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder={placeholder}
              multiline
              textAlign="right"
              className="font-pregular text-base text-gray-800"
              style={{ 
                textAlignVertical: 'center',
                maxHeight: 100,
              }}
              placeholderTextColor="#9CA3AF"
              editable={!disabled && !loading}
            />
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatInput; 