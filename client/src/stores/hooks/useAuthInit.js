import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../Slice/authSlice';

/**
 * Hook khôi phục auth state từ localStorage khi ứng dụng khởi động
 * Được gọi một lần duy nhất trong component App
 */
export const useAuthInit = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    // Nếu Redux state chưa có token nhưng localStorage có, khôi phục nó
    if (!auth.token && !auth.isAuthenticated) {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token || user) {
        console.log('🔄 Khôi phục auth state từ localStorage');
        
        dispatch(setCredentials({
          token: token || null,
          user: user ? JSON.parse(user) : null,
        }));
      }
    }
  }, []); // Chỉ chạy một lần khi component mount

  return {
    isInitialized: auth.token !== null || auth.isAuthenticated,
    token: auth.token,
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
  };
};

export default useAuthInit;
