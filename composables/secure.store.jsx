import * as SecureStore from 'expo-secure-store';

export const getSecureStore = async (name) => {
  return await SecureStore.getItemAsync(name);
};

export const getSecureStoreNoAsync = (name) => {
  return JSON.parse(SecureStore.getItem(name));
};

export const setSecureStore = async (name, value) => {
  return await SecureStore.setItemAsync(name, value);
};

export const deleteSecureStore = async (name) => {
  return await SecureStore.deleteItemAsync(name);
};
