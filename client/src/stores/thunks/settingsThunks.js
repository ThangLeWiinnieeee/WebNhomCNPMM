import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

/**
 * Lấy thông tin settings từ server
 * @returns {Promise} Thông tin settings
 */
export const fetchSettingsThunk = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/settings');
      
      if (response.code === 'error') {
        return rejectWithValue(response.message || 'Lấy thông tin settings thất bại');
      }
      
      return response.data || response;
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Lỗi khi lấy thông tin settings';
      return rejectWithValue(errorMessage);
    }
  }
);
