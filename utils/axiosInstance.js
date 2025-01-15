import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

const mode = process.env.NODE_ENV;

const getToken = async () => {
  return await SecureStore.getItemAsync('token');
};

const createPullRequest = async (errorDetails, phone) => {
  const branchName = `http-report-${new Date().toISOString()}`;

  // You can add logic to push crash logs to the repo (optional)

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
        title: `HTTP ERROR Report on ${new Date().toLocaleString()}`,
        body: JSON.stringify({
          error: errorDetails,
          phone: phone ?? '',
        }),
        head: branchName, // Use the branch that has the crash report or fix (optional)
        base: 'main', // Or your default branch
      }),
    }
  );

  const data = await response.json();
};

// Create a default Axios instance
const axiosInstance = axios.create({
  baseURL:
    mode === 'development' ? process.env.EXPO_PUBLIC_DEV_URI : process.env.EXPO_PUBLIC_DEV_URI,
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
    console.log(process.env.EXPO_PUBLIC_DEV_URI, 'process.env.EXPO_PUBLIC_DEV_URI');
    console.log(token, 'token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

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
    console.log(response.data);
    return response.data;
  },
  async (error) => {
    console.log(error);
    const errorResponse = error.response;
    if (errorResponse) {
      // Handle specific status codes globally
      switch (errorResponse.status) {
        case 401:
          // Handle unauthorized error
          await SecureStore.deleteItemAsync('token');
          break;
        case 403:
          // Handle forbidden error
          break;
        case 500:
          // Handle server error
          const user = JSON.parse(SecureStore.getItem('user'));

          createPullRequest(errorResponse, user?.phone);
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
