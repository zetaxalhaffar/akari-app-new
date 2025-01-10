import { View, Text, Platform } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export const unstable_settings = {
  initialRouteName: 'login',
};

const AuthMainStack = () => {
  return (
    <>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} backgroundColor="#a47764" />
      <Stack initialRouteName="index">
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default AuthMainStack;
