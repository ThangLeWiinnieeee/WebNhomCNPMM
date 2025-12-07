import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

// Thunk để đăng ký
export const registerUserThunk = createAsyncThunk(
  'auth/registerUser',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post('/account/register', payload);
      return response;
    } catch (error) {
      // Error đã được xử lý từ axiosConfig, trả về message từ backend
      return rejectWithValue(error?.message || 'Đăng ký thất bại');
    }
  }
);

// Thunk để đăng nhập
export const loginUserThunk = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/account/login', credentials);

      // Lưu token vào localStorage
      const token = response.accessToken;
      if (token) {
        localStorage.setItem('token', token);
      }

      // Lấy thông tin user từ response
      const userData = response.user;

      return { token, user: userData };
    } catch (error) {
      // Error đã được xử lý từ axiosConfig, trả về message từ backend
      return rejectWithValue(error?.message || 'Lỗi khi đăng nhập');
    }
  }
);

// Thunk để đăng nhập bằng Google
export const googleLoginThunk = createAsyncThunk(
  'auth/googleLogin',
  async (googleUserInfo, { rejectWithValue }) => {
    try {
      console.log('Google user info:', googleUserInfo);  
      const response = await api.post('/account/google-login', { 
        email: googleUserInfo.email,
        name: googleUserInfo.name,
        picture: googleUserInfo.picture,
        sub: googleUserInfo.sub
      });
      
      // Lưu token vào localStorage
      const token = response.accessToken;
      if (token) {
        localStorage.setItem('token', token);
      }

      // Lấy thông tin user từ response
      const userData = response.user;

      return { token, user: userData };
    } catch (error) {
      return rejectWithValue(error?.message || 'Lỗi khi đăng nhập bằng Google');
    }
  }
);

// Thunk để verify token
export const verifyTokenThunk = createAsyncThunk(
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

      return response.user || response;
    } catch (error) {
      // Xóa token nếu không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return rejectWithValue(error?.message || 'Token không hợp lệ');
    }
  }
);

// Thunk để gửi email quên mật khẩu
export const forgotPasswordThunk = createAsyncThunk(
  'user/forgotPassword',
  async (emailData, { rejectWithValue }) => {
    try {
      const response = await api.post('/account/forgot-password', emailData);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || 'Lỗi khi gửi OTP đến email');
    }
  }
);

// Thunk để xác thực OTP
export const verifyOtpThunk = createAsyncThunk(
  'auth/verifyOtp',
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await api.post('/account/otp-password', otpData);
      
      // Lưu accessToken vào localStorage nếu có
      const token = response.accessToken;
      if (token) {
        localStorage.setItem('token', token);
      }
      
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || 'Lỗi khi xác thực OTP');
    }
  }
);

// Thunk để reset mật khẩu
export const resetPasswordThunk = createAsyncThunk(
  'auth/resetPassword',
  async (resetData, { rejectWithValue }) => {
    try {
      const response = await api.post('/account/reset-password', resetData);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || 'Lỗi khi reset mật khẩu');
    }
  }
);

// Thunk để đăng xuất
export const logoutUserThunk = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/account/logout');
      
      // Xóa token khỏi localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return true;
    } catch (error) {
      // Dù có lỗi vẫn xóa token local
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return rejectWithValue(error?.message || 'Lỗi khi đăng xuất');
    }
  }
);