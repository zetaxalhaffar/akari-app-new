import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';

const CustomAlert = ({ visible, title, message, onConfirm, onCancel }) => {
  if (!visible) {
    return null;
  }

  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            {onCancel && (
              <CustomButton
                title="إلغاء"
                handleButtonPress={onCancel}
                containerStyles="flex-1 mr-2"
                buttonStyles="bg-gray-300"
                textStyles="text-black"
              />
            )}
            <CustomButton
              title="موافق"
              handleButtonPress={onConfirm}
              hasGradient
              containerStyles="flex-1 ml-2"
              textStyles="text-white"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Cairo-Bold', // Using app font
    fontSize: 18,
    marginBottom: 10,
  },
  message: {
    fontFamily: 'Cairo-Regular', // Using app font
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16,
  },
});

export default CustomAlert; 