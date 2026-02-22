import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace this with your backend base URL
const BASE_URL = 'https://online-learning-mobileapp.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = async (data) => {
  // data = { name, email, password }
  return api.post('/register', data);
};

export const loginUser = async (data) => {
  // data = { email, password }
  return api.post('/login', data);
};

export default api;