import { Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { getSecureStore } from '@/composables/secure.store';

export const unstable_settings = {
  initialRouteName: 'login',
};

const AuthMainStack = () => {
  const [token, setToken] = useState(null);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const checkForToken = async () => {
      const savedToken = await getSecureStore('token');
      setToken(savedToken);
      setIsCheckingToken(false); // Mark token check as complete
    };
    checkForToken();
  }, []);

  if (isCheckingToken) {
    // You can render a loading indicator while checking the token
    return null; // Or a Splash screen / Spinner
  }

  if (token) {
    // Redirect to the tabs route if token exists
    return <Redirect href="/(tabs)" />;
  }

  return (
    <>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} backgroundColor="#a47764" />
      <Stack initialRouteName="index" screenOptions={{ animation: 'fade' }}>
        <Stack.Screen name="otpvalidation" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="index" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="login" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="signup" options={{ headerShown: false, animation: 'fade' }} />
      </Stack>
    </>
  );
};

export default AuthMainStack;
