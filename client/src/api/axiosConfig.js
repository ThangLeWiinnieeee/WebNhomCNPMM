import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // URL backend của bạn
  withCredentials: true, // Gửi cookie cùng với request
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Thêm token vào header nếu có
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Log response để debug (có thể bỏ trong production)
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.status, error.response?.config?.url);
    return Promise.reject(error);
  }
);

export default axiosInstance;