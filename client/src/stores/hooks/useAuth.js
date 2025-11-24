import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser, logoutUser, verifyToken } from '../thunks/authThunks';
import { updateUserProfile, changePassword } from '../thunks/userThunks';
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
      const result = await dispatch(loginUser(credentials)).unwrap();
      return { success: true, data: result };
    } catch (error) {
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
      const result = await dispatch(registerUser(userData)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  /**
   * Đăng xuất
   */
  const logout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      return { success: true };
    } catch (error) {
      // Vẫn trả về success true vì đã xóa token local
      return { success: true, error };
    }
  };

  /**
   * Xác thực token hiện tại
   */
  const verify = async () => {
    try {
      const result = await dispatch(verifyToken()).unwrap();
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
      const result = await dispatch(updateUserProfile(userData)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  /**
   * Đổi mật khẩu
   * @param {Object} passwordData - {oldPassword, newPassword}
   */
  const updatePassword = async (passwordData) => {
    try {
      const result = await dispatch(changePassword(passwordData)).unwrap();
      return { success: true, data: result };
    } catch (error) {
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
    logout,
    verify,
    updateProfile,
    updatePassword,
    setAuth,
    clearAuth,
    clearAuthError,
    
    // Utilities
    hasRole,
    hasPermission,
  };
};

export default useAuth;
