import axios from 'axios';
import { toast } from 'sonner';

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
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Xử lý response thành công
    const data = response.data;
    
    // Kiểm tra nếu backend trả về code: 'error'
    if (data && data.code === 'error') {
      // Reject để thunk catch được lỗi
      return Promise.reject(data);
    }
    
    return data;
  },
  (error) => {
    // Xử lý lỗi network hoặc lỗi không có response
    if (!error.response) {
      toast.error('Không thể kết nối đến server. Kiểm tra kết nối mạng.');
      return Promise.reject({ code: 'error', message: 'Network Error' });
    }
    
    // Nếu có response, trả về data từ backend
    const data = error.response.data;
    return Promise.reject(data || { code: 'error', message: 'Có lỗi xảy ra' });
  }
);

export default axiosInstance;