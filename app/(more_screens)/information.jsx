import React, { useState, useRef } from 'react';
import { View, ActivityIndicator, TouchableOpacity, I18nManager, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Feather from '@expo/vector-icons/Feather';
import HomePageHeader from '@/components/HomePageHeader';
import { useLocalSearchParams } from 'expo-router';

const InformationScreen = () => {
  const { url } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const webViewRef = useRef(null);
  const screenWidth = Dimensions.get('window').width;

  const renderLoading = () => (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#f2f2f2', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      <ActivityIndicator size="large" color="#a47764" />
    </View>
  );

  const scrollToTop = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript('window.scrollTo(0, 0); true;');
    }
  };

  const injectedJavaScript = `
    (function() {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'viewport');
      meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      document.head.appendChild(meta);

      const style = document.createElement('style');
      style.innerHTML = 'body { -webkit-user-select: none; -webkit-touch-callout: none; user-select: none; }';
      document.head.appendChild(style);

      function sendScrollPosition() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'scroll',
          scrollPercentage: scrollPercentage
        }));
      }
      
      window.addEventListener('scroll', sendScrollPosition);
      sendScrollPosition();
    })();
    true;
  `;

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'scroll') {
        setShowScrollButton(data.scrollPercentage >= 1);
      }
    } catch (error) {
      console.log('Error parsing message:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <HomePageHeader hasActions={true} />
      <View className="flex-1" style={{ backgroundColor: '#f2f2f2' }}>
        <WebView 
          ref={webViewRef}
          source={{ uri: url || 'https://arrows-dev.versetech.net/info.html' }}
          style={{ flex: 1, backgroundColor: '#f2f2f2' }}
          startInLoadingState={true}
          scalesPageToFit={false}
          textZoom={100}
          setBuiltInZoomControls={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          renderLoading={renderLoading}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          injectedJavaScript={injectedJavaScript}
          onMessage={handleMessage}
        />
        {isLoading && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#f2f2f2',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <ActivityIndicator size="large" color="#a47764" />
          </View>
        )}
        {showScrollButton && (
          <View style={{
            position: 'absolute',
            bottom: 20,
            left: I18nManager.isRTL ? screenWidth - 70 : 20,
            zIndex: 1000,
          }}>
            <TouchableOpacity
              onPress={scrollToTop}
              style={{
                backgroundColor: '#a47764',
                borderRadius: 25,
                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <Feather name="arrow-up" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default InformationScreen; 