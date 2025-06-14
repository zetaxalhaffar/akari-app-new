import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { Platform } from 'react-native';

const mode = process.env.NODE_ENV;

const getToken = async () => {
  return await SecureStore.getItemAsync('token');
};

const createPullRequest = async (errorDetails, phone, errorType = 'HTTP_ERROR') => {
  const branchName = `${errorType.toLowerCase()}-report-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`;

  // Create a pull request
  const response = await fetch(
    'https://api.github.com/repos/zetaxalhaffar/akari_app_errors/issues',
    {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: 'Bearer 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',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        title: `${errorType} Report on ${new Date().toLocaleString()}`,
        body: JSON.stringify({
          errorType,
          error: errorDetails,
          phone: phone ?? '',
          timestamp: new Date().toISOString(),
          device: {
            platform: Platform.OS,
            version: Platform.Version,
          },
        }),
        head: branchName,
        base: 'main',
      }),
    }
  );

  const data = await response.json();
  console.log('Error report sent to GitHub:', data);
};

// Crash logging function
const logCrash = async (error, errorInfo = {}) => {
  try {
    let user = {};
    try {
      const userData = await SecureStore.getItemAsync('user');
      user = userData ? JSON.parse(userData) : {};
    } catch (e) {
      console.log('Could not retrieve user data for crash report');
    }

    const crashDetails = {
      message: error.message || 'Unknown error',
      stack: error.stack || 'No stack trace available',
      name: error.name || 'Error',
      timestamp: new Date().toISOString(),
      errorInfo,
      url: global.location?.href || 'Unknown location',
    };

    await createPullRequest(crashDetails, user?.phone, 'APP_CRASH');
  } catch (reportError) {
    console.error('Failed to report crash:', reportError);
  }
};

// Global error handler setup
const setupGlobalErrorHandlers = () => {
  // Handle JavaScript errors
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Check if this looks like an unhandled error
    if (args[0] && args[0].toString().includes('Error:')) {
      const error = new Error(args.join(' '));
      logCrash(error, { source: 'console.error' });
    }
    originalConsoleError(...args);
  };

  // Handle unhandled promise rejections
  if (global.addEventListener) {
    global.addEventListener('unhandledrejection', (event) => {
      const error = event.reason || event.error || new Error('Unhandled Promise Rejection');
      logCrash(error, { source: 'unhandledrejection', event: event.type });
    });
  }

  // React Native specific error handling
  if (global.ErrorUtils) {
    const originalGlobalHandler = global.ErrorUtils.getGlobalHandler();
    global.ErrorUtils.setGlobalHandler((error, isFatal) => {
      logCrash(error, { source: 'ErrorUtils', isFatal });
      if (originalGlobalHandler) {
        originalGlobalHandler(error, isFatal);
      }
    });
  }
};

// Export the setup function
export { setupGlobalErrorHandlers, logCrash };

// Create a default Axios instance
const axiosInstance = axios.create({
  baseURL:
    mode === 'development' ? process.env.EXPO_PUBLIC_DEV_URI : process.env.EXPO_PUBLIC_PROD_URI,
  // baseURL: process.env.EXPO_PUBLIC_DEV_URI,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor to add the Authorization header and log request details
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    //console.log(process.env.EXPO_PUBLIC_DEV_URI, 'process.env.EXPO_PUBLIC_DEV_URI');
    console.log(token, 'token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }


    console.log(config.params, 'config.params');
    // Log the request URI and payload
    console.log('Request Payload:', config.data);

    // Generate a unique random number (between 100000 and 999999)
    const randId = Math.floor(Math.random() * 900000) + 100000;

    // Append the rand parameter to the URL
    const separator = config.url.includes('?') ? '&' : '?';
    config.url = `${config.url}${separator}rand=${randId}`;

    console.log(`Request URI (after adding rand): ${config.url}`);

    // Create an AbortController instance to handle the timeout
    const controller = new AbortController();
    config.signal = controller.signal;

    // Set a timeout to cancel the request after 10 seconds
    setTimeout(() => {
      controller.abort(); // Cancel the request
    }, 100000); // 10 seconds timeout

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    console.log(error, "error");
    const errorResponse = error.response;
    if (errorResponse) {
      // Handle specific status codes globally
      switch (errorResponse.status) {
        case 401:
          // Handle unauthorized error
          await SecureStore.deleteItemAsync('token');
          router.replace('/(auth)/login');
          break;
        case 403:
          // Handle forbidden error
          break;
        case 500:
          // Handle server error
          const user = JSON.parse(SecureStore.getItem('user'));

          createPullRequest(errorResponse, user?.phone, 'HTTP_ERROR');
          break;
        default:
          break;
      }
    } else if (error.code === 'ERR_CANCELED') {
      // Handle the timeout/cancel error
      console.log(error);
    }

    return Promise.reject(errorResponse ? errorResponse.data : error.message);
  }
);

export default axiosInstance;
