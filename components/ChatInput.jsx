import React, { useState } from 'react';
import {
  ActivityIndicator,
  I18nManager,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
  placeholder = 'اكتب رسالة...',
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <View className="border-t border-gray-200 bg-white py-3">
        <View
          className={`mx-2 flex items-center justify-center gap-2 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
          {/* Send Button */}
          <TouchableOpacity
            onPress={handleSend}
            disabled={value.trim().length === 0 || disabled || loading}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color={value.trim().length > 0 && !disabled ? '#a47764' : '#9CA3AF'}
              />
            ) : (
              // <Ionicons
              //   name="caret-forward"
              //   size={36}
              //   color={value.trim().length > 0 && !disabled ? '#a47764' : '#9CA3AF'}
              // />
              <View
                className={`flex items-center gap-2 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
                <Image
                  source={require('@/assets/icons/send.png')}
                  className="h-7 w-7 ps-4"
                  tintColor={value.trim().length > 0 && !disabled ? '#a47764' : '#9CA3AF'}
                  resizeMode="contain"
                />
                <Image
                  source={require('@/assets/icons/microphone.png')}
                  className="h-7 w-7 ps-4 hidden"
                  tintColor={value.trim().length > 0 && !disabled ? '#a47764' : '#9CA3AF'}
                  resizeMode="contain"
                />
              </View>
            )}
          </TouchableOpacity>

          {/* Input Container */}
          <View
            className="max-h-32 flex-1 border border-gray-300 bg-gray-50 px-4 py-3"
            style={{ borderRadius: 5 }}>
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
            disabled={disabled || loading || clearLoading || !hasMessages}>
            {clearLoading ? (
              <ActivityIndicator
                size="small"
                color={
                  disabled || loading || !hasMessages
                    ? '#D1D5DB' // Light gray when disabled or no messages
                    : '#4B5563' // Dark gray when messages exist
                }
              />
            ) : (
              // <Ionicons
              //   name="trash-outline"
              //   size={24}
              //   color={
              //     disabled || loading || clearLoading || !hasMessages
              //       ? '#D1D5DB' // Light gray when disabled or no messages
              //       : '#4B5563' // Dark gray when messages exist
              //   }
              // />
              <Image
                source={require('@/assets/icons/delete_icon.png')}
                className="h-7 w-7"
                tintColor={
                  disabled || loading || clearLoading || !hasMessages ? '#D1D5DB' : '#a47764'
                }
              />
            )}
          </TouchableOpacity>
        </View>

        {/* WhatsApp Support Link */}
        <TouchableOpacity
          onPress={handleWhatsAppPress}
          disabled={!user?.support_phone}
          className="mx-4 mt-2">
          <Text
            className="text-center font-pregular text-xs text-gray-500"
            style={{
              textAlign: 'center',
              opacity: user?.support_phone ? 1 : 0.5,
            }}>
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
