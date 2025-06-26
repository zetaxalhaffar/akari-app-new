import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { logCrash } from '../utils/axiosInstance';
import CustomButton from './CustomButton';
import images from '../constants/images';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to GitHub
    this.setState({
      error,
      errorInfo,
    });

    // Send crash report to GitHub
    logCrash(error, {
      source: 'ErrorBoundary',
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name,
    });

    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <View className="flex-1 items-center justify-center bg-gray-50 p-6">
          <Image
            className="h-[150px] w-[150px] mb-6"
            resizeMode="contain"
            source={images.connection_lost} // You can use a different error image
          />
          
          <Text className="text-2xl font-pbold text-center text-gray-800 mb-2">
            حدث خطأ غير متوقع
          </Text>
          
          <Text className="text-base font-pregular text-center text-gray-600 mb-6 px-4">
            نعتذر عن هذا الخطأ. تم إرسال تقرير عن المشكلة تلقائياً
          </Text>
          
          <CustomButton
            hasGradient={true}
            colors={['#633e3d', '#774b46', '#8d5e52', '#a47764', '#bda28c']}
            title={'إعادة المحاولة'}
            containerStyles={'w-full'}
            positionOfGradient={'leftToRight'}
            textStyles={'text-white'}
            buttonStyles={'h-[50px]'}
            onPress={this.handleRestart}
            handleButtonPress={this.handleRestart}
            disabled={false}
            loading={false}
          />

          {/* Show error details in development mode */}
          {__DEV__ && (
            <View className="mt-6 p-4 bg-red-50 rounded-lg w-full">
              <Text className="text-sm font-pregular text-red-800 mb-2">
                Error Details (Development Only):
              </Text>
              <Text className="text-xs font-pregular text-red-600">
                {this.state.error?.toString()}
              </Text>
            </View>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 