import axios from 'axios';
import { store } from '../stores/store'; // Import store

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // URL backend của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm Interceptor (can thiệp) vào MỖI request
api.interceptors.request.use(
  (config) => {
    // Lấy token từ Redux state
    const token = store.getState().auth.token;

    if (token) {
      // Backend của chúng ta dùng header 'x-auth-token'
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;