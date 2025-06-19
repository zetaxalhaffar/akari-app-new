import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  I18nManager,
  ActivityIndicator,
} from 'react-native';
import { useFonts } from 'expo-font';
import { AntDesign } from '@expo/vector-icons';

const CustomDropdown = ({
  value,
  setValue,
  arrayOfValues = [],
  placeholder = 'قم بإختيار القيمة',
  valueKey = 'id',
  emptyMessage = 'لا يوجد بيانات',
  disabled = false,
  keyName = 'name',
  hideLoading = false,
  label,
  showClear = true,
  onClear = null,
}) => {
  const [visible, setVisible] = useState(false);

  const [loaded] = useFonts({
    'Cairo-Medium': require('@/assets/fonts/Cairo-Medium.ttf'),
  });

  if (!loaded) {
    return null;
  }

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      setValue('');
    }
  };

  const hasValue = value !== null && value !== undefined && value !== '' && value !== 0;

  return (
    <>
      {label && <Text className="mb-2 font-pmedium text-gray-700">{label}</Text>}
      <View
        className={`h-[48px] w-full justify-center rounded-lg border ${disabled ? 'border-gray-300 opacity-50' : 'border-toast-500'}`}>
        <View className={`flex-row items-center justify-between p-2 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}>
          <TouchableOpacity
            disabled={disabled}
            className="flex-1"
            onPress={() => setVisible(true)}>
            <Text
              className={`px-2 font-pmedium text-base ${hasValue ? 'text-gray-700' : 'text-gray-400'} ${I18nManager.isRTL ? 'ltr-text' : 'rtl-text'}`}>
              {(() => {
                if (arrayOfValues && arrayOfValues.length > 0 && value && value !== 0) {
                  const selectedItem = arrayOfValues.find((item) => item[valueKey] === value);
                  if (selectedItem && selectedItem[keyName]) {
                    return String(selectedItem[keyName]);
                  }
                }
                return `يرجى إختيار ${placeholder || 'القيمة'}`;
              })()}
            </Text>
          </TouchableOpacity>
          
          {/* Clear button */}
          {showClear && hasValue && !disabled && (
            <TouchableOpacity
              onPress={handleClear}
              className="ml-2 p-1"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <AntDesign name="close" size={16} color="#a47764" />
            </TouchableOpacity>
          )}
          
          {/* Loading indicator */}
          {disabled && !hideLoading && <ActivityIndicator color="#a47764" />}
        </View>
        
        <Modal
          statusBarTranslucent
          transparent
          visible={visible}
          animationType="fade"
          onRequestClose={() => setVisible(false)}>
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setVisible(false)}>
            <View style={styles.dropdown}>
              <FlatList
                showsVerticalScrollIndicator={true}
                persistentScrollbar={true}
                ListHeaderComponent={() => (
                  <View className="bg-white pt-2">
                    <Text
                      className={`px-2 font-pmedium text-base text-gray-400 ${I18nManager.isRTL ? 'ltr-text' : 'rtl-text'}`}>
                      {String(placeholder || 'اختر القيمة')}
                    </Text>
                  </View>
                )}
                data={arrayOfValues}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                      setValue(item[valueKey]);
                      setVisible(false);
                    }}>
                    <Text
                      className={`font-pmedium text-base text-gray-600 ${I18nManager.isRTL ? 'ltr-text' : 'rtl-text'}`}>
                      {String(item[keyName] || '')}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                  <View className="my-4 flex-1 items-center justify-center">
                    <Text className="font-pmedium text-base text-gray-900">{String(emptyMessage || 'لا يوجد بيانات')}</Text>
                  </View>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  dropdownButton: {
    padding: 12,
    backgroundColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dropdown: {
    width: '80%',
    maxHeight: '50%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
  },
  item: {
    padding: 12,
  },
  itemText: {
    fontFamily: 'Cairo-Medium',
    fontSize: 14,
    color: '#333',
  },
});

export default CustomDropdown;
