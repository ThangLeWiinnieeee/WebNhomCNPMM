import { createSlice } from '@reduxjs/toolkit';
import { registerUserThunk, loginUserThunk, logoutUserThunk, verifyTokenThunk, forgotPasswordThunk } from '../thunks/authThunks';
import { updateUserProfileThunk } from '../thunks/userThunks';

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
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        
        // Lưu vào localStorage - đảm bảo token được lưu
        if (action.payload.token) {
          localStorage.setItem('token', action.payload.token);
        }
        if (action.payload.user) {
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      // ============ REGISTER USER ============
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ LOGOUT USER ============
      .addCase(logoutUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUserThunk.rejected, (state) => {
        // Vẫn logout dù có lỗi
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
      })

      // ============ VERIFY TOKEN ============
      .addCase(verifyTokenThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyTokenThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyTokenThunk.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
      })

      // ============ UPDATE USER PROFILE ============
      .addCase(updateUserProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfileThunk.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.loading = false;
        state.error = null;
        
        // Cập nhật localStorage
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(updateUserProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ FORGOT PASSWORD ============
      .addCase(forgotPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
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