import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

// Thunk để login
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

      // Lấy thông tin user từ response hoặc từ API
      let userData = response.data?.user || response.user;
      
      // Nếu không có user data trong response, gọi API profile
      if (!userData && token) {
        try {
          const profileRes = await api.get('/user/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          userData = profileRes.data || profileRes;
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

// Thunk để logout
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

      return response.data || response;
    } catch (error) {
      // Xóa token nếu không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      const errorMessage = error?.message || 'Token không hợp lệ';
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk để cập nhật thông tin user
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put('/user/profile', userData);
      return response.data || response;
    } catch (error) {
      const errorMessage = error?.message || 'Lỗi khi cập nhật thông tin';
      return rejectWithValue(errorMessage);
    }
  }
);

// Thunk để đổi mật khẩu
export const changePassword = createAsyncThunk(
  'auth/changePassword',
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

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    // Set credentials manually (for Google login, etc.)
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.error = null;
      
      // Lưu vào localStorage
      if (token) localStorage.setItem('token', token);
      if (user) localStorage.setItem('user', JSON.stringify(user));
    },
    
    // Logout manual
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Xóa localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Update user info
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      // Cập nhật localStorage
      localStorage.setItem('user', JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    builder
      // ============ LOGIN USER ============
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        
        // Lưu vào localStorage
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      // ============ REGISTER USER ============
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ LOGOUT USER ============
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Vẫn logout dù có lỗi
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
      })

      // ============ VERIFY TOKEN ============
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
      })

      // ============ UPDATE USER PROFILE ============
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.loading = false;
        state.error = null;
        
        // Cập nhật localStorage
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ CHANGE PASSWORD ============
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setCredentials, 
  clearCredentials, 
  setLoading, 
  setError, 
  clearError, 
  updateUser 
} = authSlice.actions;

export default authSlice.reducer;