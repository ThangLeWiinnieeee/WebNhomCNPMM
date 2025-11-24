import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

// Thunk để đăng ký
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('/account/register', payload);
      
      // Kiểm tra response
      if (response.code === "error") {
        return rejectWithValue(response.message || 'Đăng ký thất bại');
      }
      
      return response.data || response;
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Lỗi khi đăng ký';
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk để đăng nhập
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/account/login', credentials);
      
      // Kiểm tra response structure
      if (response.code === "error") {
        return rejectWithValue(response.message || 'Đăng nhập thất bại');
      }

      // Lưu token vào localStorage
      const token = response.data?.accessToken || response.accessToken;
      if (token) {
        localStorage.setItem('token', token);
      }

      // Lấy thông tin user từ response
      let userData = response.data?.user || response.user;
      
      // Nếu không có user data trong response, gọi API profile
      if (!userData && token) {
        try {
          const profileRes = await api.get('/user/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          userData = profileRes.data?.user || profileRes.user || profileRes.data || profileRes;
        } catch (profileError) {
          // Sử dụng email từ credentials nếu không lấy được profile
          userData = { email: credentials.email };
        }
      }

      return { token, user: userData };
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Lỗi khi đăng nhập';
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk để đăng xuất
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Gọi API logout
      await api.post('/account/logout');
      
      // Xóa token khỏi localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return true;
    } catch (error) {
      // Dù có lỗi vẫn xóa token local
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      const errorMessage = error?.message || 'Lỗi khi đăng xuất';
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk để verify token
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token || localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Không có token');
      }

      const response = await api.get('/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data?.user || response.user || response.data || response;
    } catch (error) {
      // Xóa token nếu không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      const errorMessage = error?.message || 'Token không hợp lệ';
      return rejectWithValue(errorMessage);
    }
  }
);
