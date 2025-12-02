import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  registerUserThunk, 
  loginUserThunk, 
  googleLoginThunk,
  logoutUserThunk, 
  verifyTokenThunk, 
  forgotPasswordThunk,
  verifyOtpThunk,
  resetPasswordThunk
} from '../thunks/authThunks';
import { updateUserProfileThunk } from '../thunks/userThunks';
import { 
  setCredentials,
  clearCredentials,
  clearError 
} from '../Slice/authSlice';

/**
 * Custom hook để quản lý authentication
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  /**
   * Đăng nhập
   * @param {Object} credentials - {email, password}
   * @returns {Promise}
   */
  const login = async (credentials) => {
    try {
      const result = await dispatch(loginUserThunk(credentials)).unwrap();
      toast.success("Đăng nhập thành công!");
      
      // Điều hướng theo role
      const userRole = result?.user?.role || result?.user?.role_id;
      if (userRole === 'admin' || userRole === 'administrator') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
      
      return { success: true, data: result };
    } catch (error) {
      toast.error(error || "Đăng nhập thất bại!");
      return { success: false, error };
    }
  };

  /**
   * Đăng ký
   * @param {Object} userData - {fullName, email, password}
   * @returns {Promise}
   */
  const register = async (userData) => {
    try {
      const result = await dispatch(registerUserThunk(userData)).unwrap();
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate('/login');
      return { success: true, data: result };
    } catch (error) {
      toast.error(error || "Đăng ký thất bại!");
      return { success: false, error };
    }
  };

  /**
   * Đăng nhập bằng Google
   * @param {Object} googleUserInfo - Thông tin user từ Google
   * @returns {Promise}
   */
  const loginWithGoogle = async (googleUserInfo) => {
    try {
      const result = await dispatch(googleLoginThunk(googleUserInfo)).unwrap();
      toast.success("Đăng nhập Google thành công!");
      
      // Điều hướng theo role
      const userRole = result?.user?.role || result?.user?.role_id;
      if (userRole === 'admin' || userRole === 'administrator') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
      
      return { success: true, data: result };
    } catch (error) {
      toast.error(error || "Đăng nhập Google thất bại!");
      return { success: false, error };
    }
  };

  /**
   * Đăng xuất
   */
  const logout = async () => {
    try {
      await dispatch(logoutUserThunk()).unwrap();
      toast.success('Đăng xuất thành công!');
      navigate('/');
      return { success: true };
    } catch (error) {
      toast.error('Đăng xuất thất bại!');
      navigate('/');
      return { success: true, error };
    }
  };

  /**
   * Xác thực token hiện tại
   */
  const verify = async () => {
    try {
      const result = await dispatch(verifyTokenThunk()).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  /**
   * Cập nhật thông tin user
   * @param {Object} userData - Thông tin cần cập nhật
   */
  const updateProfile = async (userData) => {
    try {
      const result = await dispatch(updateUserProfileThunk(userData)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  const forgotPassword = async (emailData) => {
    try {
      const result = await dispatch(forgotPasswordThunk(emailData)).unwrap();
      toast.success("Mã OTP đã được gửi đến email của bạn!");
      return { success: true, data: result };
    } catch (error) {
      toast.error(error || "Gửi OTP thất bại!");
      return { success: false, error };
    }
  };

  /**
   * Xác thực OTP
   * @param {Object} otpData - {email, otp}
   * @returns {Promise}
   */
  const verifyOtp = async (otpData) => {
    try {
      const result = await dispatch(verifyOtpThunk(otpData)).unwrap();
      toast.success("Xác thực OTP thành công!");
      return { success: true, data: result };
    } catch (error) {
      toast.error(error || "Xác thực OTP thất bại!");
      return { success: false, error };
    }
  };

  /**
   * Đặt lại mật khẩu
   * @param {Object} resetData - {email, password, confirmPassword}
   * @returns {Promise}
   */
  const resetPassword = async (resetData) => {
    try {
      const result = await dispatch(resetPasswordThunk(resetData)).unwrap();
      toast.success("Đặt lại mật khẩu thành công!");
      navigate('/login');
      return { success: true, data: result };
    } catch (error) {
      toast.error(error || "Đặt lại mật khẩu thất bại!");
      return { success: false, error };
    }
  };

  /**
   * Set credentials manually (for external auth like Google)
   * @param {Object} credentials - {token, user}
   */
  const setAuth = (credentials) => {
    dispatch(setCredentials(credentials));
  };

  /**
   * Clear credentials manually
   */
  const clearAuth = () => {
    dispatch(clearCredentials());
  };

  /**
   * Clear error state
   */
  const clearAuthError = () => {
    dispatch(clearError());
  };

  /**
   * Kiểm tra quyền user (có thể mở rộng)
   * @param {String} role - Role cần kiểm tra
   */
  const hasRole = (role) => {
    if (!user || !user.role) return false;
    return user.role === role;
  };

  /**
   * Kiểm tra quyền truy cập
   * @param {Array} allowedRoles - Mảng các role được phép
   * @returns {Boolean}
   */
  const hasPermission = (allowedRoles = []) => {
    if (!user || !user.role) return false;
    return allowedRoles.includes(user.role);
  };

  return {
    // State
    user,
    token,
    isAuthenticated,
    loading,
    error,
    
    // Actions
    login,
    register,
    loginWithGoogle,
    logout,
    verify,
    updateProfile,
    forgotPassword,
    verifyOtp,
    resetPassword,
    setAuth,
    clearAuth,
    clearAuthError,
    
    // Utilities
    hasRole,
    hasPermission,
  };
};

export default useAuth;
