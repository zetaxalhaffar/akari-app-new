import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  I18nManager,
} from 'react-native';
import { useFonts } from 'expo-font';

const CustomDropdown = ({
  value,
  setValue,
  arrayOfValues = [],
  placeholder = 'قم بإختيار القيمة',
  valueKey = 'id',
}) => {
  const [visible, setVisible] = useState(false);

  const [loaded] = useFonts({
    'Cairo-Medium': require('@/assets/fonts/Cairo-Medium.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <View className="h-[48px] w-full justify-center rounded-lg border border-toast-500">
      <TouchableOpacity className="bg-white p-2" onPress={() => setVisible(true)}>
        <Text
          className={`px-2 font-pmedium text-base ${value ? 'text-gray-700' : 'text-gray-400'} ${I18nManager.isRTL ? 'ltr-text' : 'rtl-text'}`}>
          {(arrayOfValues && arrayOfValues.find((item) => item.id === value)?.name) || placeholder}
        </Text>
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
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
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
