import axios from 'axios';

// Replace this with your backend base URL
const BASE_URL = 'https://online-learning-mobileapp.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = async (data) => {
  // data = { name, email, password }
  return api.post('/register', data);
};

export const loginUser = async (data) => {
  // data = { email, password }
  return api.post('/login', data);
};

export default api;