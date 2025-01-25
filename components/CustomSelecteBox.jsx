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

const CustomDropdown = ({
  value,
  setValue,
  arrayOfValues = [],
  placeholder = 'قم بإختيار القيمة',
  valueKey = 'id',
  emptyMessage = 'لا يوجد بيانات',
  disabled = false,
  keyName = 'name',
}) => {
  const [visible, setVisible] = useState(false);

  const [loaded] = useFonts({
    'Cairo-Medium': require('@/assets/fonts/Cairo-Medium.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <>
      <Text className="mb-2 font-pmedium text-gray-700">{placeholder}</Text>

      <View
        className={`h-[48px] w-full justify-center rounded-lg border ${disabled ? 'border-gray-300 opacity-50' : 'border-toast-500'}`}>
        <TouchableOpacity
          disabled={disabled}
          className={`flex justify-between p-2 ${I18nManager.isRTL ? 'rtl-view' : 'ltr-view'}`}
          onPress={() => setVisible(true)}>
          <Text
            className={`px-2 font-pmedium text-base ${value ? 'text-gray-700' : 'text-gray-400'} ${I18nManager.isRTL ? 'ltr-text' : 'rtl-text'}`}>
            {(arrayOfValues && arrayOfValues.find((item) => item.id === value)?.[keyName]) ||
              `يرجى إختيار ${placeholder}`}
          </Text>
          {disabled && <ActivityIndicator color="#a47764" />}
        </TouchableOpacity>
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
                      {placeholder}
                    </Text>
                  </View>
                )}
                data={arrayOfValues}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                      setValue(item[valueKey]); // Or item[valueKey]
                      setVisible(false);
                    }}>
                    <Text
                      className={`font-pmedium text-base text-gray-600 ${I18nManager.isRTL ? 'ltr-text' : 'rtl-text'}`}>
                      {item[keyName]}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                  <View className="my-4 flex-1 items-center justify-center">
                    <Text className="font-pmedium text-base text-gray-900">{emptyMessage}</Text>
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
