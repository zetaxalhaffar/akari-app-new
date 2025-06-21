import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomAlert from './CustomAlert';

const ChatInput = ({
  value,
  onChangeText,
  onSend,
  onClearHistory,
  hasMessages = false,
  disabled = false,
  loading = false,
  clearLoading = false,
  placeholder = "اكتب رسالة...",
  user = null,
}) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleSend = () => {
    if (value.trim().length > 0 && !disabled && !loading) {
      onSend();
    }
  };

  const handleWhatsAppPress = async () => {
    console.log('WhatsApp link clicked!');
    console.log('User data:', user);
    const phoneNumber = user?.support_phone;
    console.log('Phone number:', phoneNumber);
    
    if (phoneNumber) {
      const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent('مرحبا، أحتاج المساعدة')}`;
      console.log('WhatsApp URL:', whatsappUrl);
      
      try {
        const supported = await Linking.canOpenURL(whatsappUrl);
        console.log('WhatsApp URL supported:', supported);
        if (supported) {
          await Linking.openURL(whatsappUrl);
        } else {
          showAlert('خطأ', 'تطبيق واتساب غير مثبت على هذا الجهاز');
        }
      } catch (error) {
        console.error('WhatsApp error:', error);
        showAlert('خطأ', 'حدث خطأ أثناء فتح واتساب');
      }
    } else {
      showAlert('خطأ', 'رقم الهاتف غير متوفر');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View className="border-t border-gray-200 bg-white py-3">
        <View className="flex-row items-center justify-center">
          {/* Send Button */}
          <TouchableOpacity
            onPress={handleSend}
            disabled={value.trim().length === 0 || disabled || loading}
            className="h-18 w-18 items-center justify-center pl-1"
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
            className="flex-1 max-h-32 border border-gray-300 bg-gray-50 px-4 py-3 mx-2"
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

          {/* Clear History Button */}
          <TouchableOpacity
            onPress={onClearHistory}
            disabled={disabled || loading || clearLoading || !hasMessages}
            className="h-12 w-12 items-center justify-center pr-2"
          >
            {clearLoading ? (
              <ActivityIndicator 
                size="small" 
                color={
                  disabled || loading || !hasMessages 
                    ? '#D1D5DB'  // Light gray when disabled or no messages
                    : '#4B5563'  // Dark gray when messages exist
                } 
              />
            ) : (
              <Ionicons
                name="trash-outline"
                size={24}
                color={
                  disabled || loading || clearLoading || !hasMessages 
                    ? '#D1D5DB'  // Light gray when disabled or no messages
                    : '#4B5563'  // Dark gray when messages exist
                }
              />
            )}
          </TouchableOpacity>
        </View>
        
        {/* WhatsApp Support Link */}
        <TouchableOpacity 
          onPress={handleWhatsAppPress}
          disabled={!user?.support_phone}
          className="mt-2 mx-4"
        >
          <Text 
            className="text-xs text-center text-gray-500 font-pregular"
            style={{ 
              textAlign: 'center',
              opacity: user?.support_phone ? 1 : 0.5 
            }}
          >
            الذكاء الاصطناعي قد يخطئ – تواصل معنا عبر واتساب.
          </Text>
        </TouchableOpacity>
      </View>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={() => setAlertVisible(false)}
      />
    </KeyboardAvoidingView>
  );
};

export default ChatInput; 