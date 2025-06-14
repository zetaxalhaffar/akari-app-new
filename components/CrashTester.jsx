import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { logCrash } from '../utils/axiosInstance';

const CrashTester = () => {
  const testJSError = () => {
    throw new Error('Test JavaScript Error - This is intentional for testing crash reporting');
  };

  const testAsyncError = async () => {
    throw new Error('Test Async Error - This is intentional for testing crash reporting');
  };

  const testPromiseRejection = () => {
    Promise.reject(new Error('Test Promise Rejection - This is intentional for testing crash reporting'));
  };

  const testManualCrashLog = () => {
    const testError = new Error('Manual Test Error - This is intentional for testing crash reporting');
    logCrash(testError, { source: 'manual_test', testData: 'This is test data' });
  };

  // Only show in development mode
  if (!__DEV__) {
    return null;
  }

  return (
    <View className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg m-4">
      <Text className="text-lg font-pbold text-yellow-800 mb-4">
        Crash Testing (Development Only)
      </Text>
      
      <TouchableOpacity
        onPress={testJSError}
        className="bg-red-500 p-3 rounded-lg mb-2"
      >
        <Text className="text-white font-psemibold text-center">
          Test JS Error (Will crash app)
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={testAsyncError}
        className="bg-orange-500 p-3 rounded-lg mb-2"
      >
        <Text className="text-white font-psemibold text-center">
          Test Async Error
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={testPromiseRejection}
        className="bg-purple-500 p-3 rounded-lg mb-2"
      >
        <Text className="text-white font-psemibold text-center">
          Test Promise Rejection
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={testManualCrashLog}
        className="bg-blue-500 p-3 rounded-lg mb-2"
      >
        <Text className="text-white font-psemibold text-center">
          Test Manual Crash Log
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CrashTester; 