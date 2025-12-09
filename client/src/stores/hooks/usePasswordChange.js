import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import api from '../../api/axiosConfig';

/**
 * Custom hook for handling password change
 * @param {Object} options - Configuration options
 * @param {Function} options.onSuccess - Callback when password change succeeds
 * @param {Function} options.onError - Callback when password change fails
 * @returns {Object} Password change state and methods
 */
export const usePasswordChange = (options = {}) => {
  const { onSuccess, onError } = options;
  
  const [state, setState] = useState({
    loading: false,
    error: null
  });

  /**
   * Change password
   */
  const changePassword = useCallback(async ({ currentPassword, newPassword }) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response = await api.post('/user/change-password', {
        currentPassword,
        newPassword
      });

      if (response.code === 'success') {
        toast.success('Đổi mật khẩu thành công');
        setState(prev => ({ ...prev, loading: false }));
        
        if (onSuccess) {
          onSuccess();
        }
        
        return true;
      } else {
        throw new Error(response.message || 'Đổi mật khẩu thất bại');
      }
    } catch (error) {
      const errorMessage = error?.message || 'Lỗi khi đổi mật khẩu';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      toast.error(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      return false;
    }
  }, [onSuccess, onError]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    loading: state.loading,
    error: state.error,
    
    // Methods
    changePassword,
    clearError
  };
};
