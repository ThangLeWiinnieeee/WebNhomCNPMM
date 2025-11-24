import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

// Thunk để lấy thông tin profile
export const getUserProfile = createAsyncThunk(
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
export const updateUserProfile = createAsyncThunk(
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

// Thunk để đổi mật khẩu
export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await api.post('/user/change-password', passwordData);
      return response.data || response;
    } catch (error) {
      const errorMessage = error?.message || 'Lỗi khi đổi mật khẩu';
      return rejectWithValue(errorMessage);
    }
  }
);
