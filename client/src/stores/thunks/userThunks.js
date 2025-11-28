import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

// Thunk để lấy thông tin profile
export const getUserProfileThunk = createAsyncThunk(
  'user/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/profile');
      return response.data?.user || response.user || response.data || response;
    } catch (error) {
      const errorMessage = error?.message || 'Lỗi khi lấy thông tin profile';
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk để cập nhật thông tin user
export const updateUserProfileThunk = createAsyncThunk(
  'user/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put('/user/profile', userData);
      return response.data?.user || response.user || response.data || response;
    } catch (error) {
      const errorMessage = error?.message || 'Lỗi khi cập nhật thông tin';
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk để đổi mật khẩu (khi đã đăng nhập)
export const changePasswordThunk = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await api.post('/account/change-password', passwordData);
      
      if (response.code === "error") {
        return rejectWithValue(response.message || 'Đổi mật khẩu thất bại');
      }
      
      return response.data || response;
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Lỗi khi đổi mật khẩu';
      return rejectWithValue(errorMessage);
    }
  }
);