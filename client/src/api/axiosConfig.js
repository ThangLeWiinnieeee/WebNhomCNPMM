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
    const { response } = error;

    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
          // Unauthorized - Token hết hạn
          console.warn('🔒 Token hết hạn, đăng xuất...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Hiển thị thông báo trước khi redirect
          toast.warning('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
          
          // Delay 1s để user đọc được thông báo
          setTimeout(() => {
            window.location.href = '/login';
          }, 1000);
          break;
          
        case 403:
          // Forbidden - Không có quyền
          console.error('🚫 Không có quyền truy cập');
          toast.error('Bạn không có quyền truy cập tài nguyên này.');
          break;
          
        case 404:
          // Not Found
          console.error('🔍 Không tìm thấy tài nguyên');
          toast.error('Không tìm thấy dữ liệu yêu cầu.');
          break;
          
        case 500:
          // Server Error
          console.error('💥 Lỗi server:', data);
          toast.error('Lỗi hệ thống! Vui lòng thử lại sau.');
          
          // Optional: Gửi error log lên monitoring service
          // sendErrorToMonitoring({ status, data, url: response.config.url });
          break;
          
        default:
          // Các lỗi khác
          console.error('⚠️ Lỗi:', status, data);
          toast.error(data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
      
      return Promise.reject(data);
    } else {
      // Không có response - Network error
      console.error('Lỗi kết nối mạng');
      toast.error('Không thể kết nối đến server. Kiểm tra kết nối mạng.');
      return Promise.reject({ message: 'Network Error' });
    }
  }
);

export default axiosInstance;