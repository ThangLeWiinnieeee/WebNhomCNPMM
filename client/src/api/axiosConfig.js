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
    // Log response để debug (có thể bỏ trong production)
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    const { response } = error;

    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
          // Unauthorized - Token hết hạn hoặc không hợp lệ
          
          // Kiểm tra xem có phải đang logout không (từ API /account/logout)
          const isLogoutRequest = error.config?.url?.includes('/account/logout');
          
          // Không redirect nếu đang ở trang login hoặc register
          const currentPath = window.location.pathname;
          if (currentPath !== '/login' && currentPath !== '/register' && !isLogoutRequest) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Chỉ hiển thị thông báo khi token thực sự hết hạn (không phải logout)
            toast.warning('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
            
            // Delay 1s để user đọc được thông báo
            setTimeout(() => {
              window.location.href = '/';
            }, 1000);
          }
          break;
          
        case 403:
          // Forbidden - Không có quyền
          toast.error('Bạn không có quyền truy cập tài nguyên này.');
          break;
          
        case 404:
          // Not Found
          toast.error('Không tìm thấy dữ liệu yêu cầu.');
          break;
          
        case 500:
          // Server Error
          toast.error('Lỗi hệ thống! Vui lòng thử lại sau.');
          break;
          
        default:
          // Các lỗi khác
          toast.error(data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
      
      return Promise.reject(data);
    } else {
      // Không có response - Network error
      toast.error('Không thể kết nối đến server. Kiểm tra kết nối mạng.');
      return Promise.reject({ message: 'Network Error' });
    }
  }
);

export default axiosInstance;