import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../api/axios';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId) => {
    const res = await axios.get(`/profile/${userId}`);
    return res.data;
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ id, data }) => {
    const res = await axios.put(`/profile/${id}`, data);
    return res.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: { profile: null, userId: null, status: 'idle' },
  reducers: {
    logout: (state) => {
      state.profile = null;
      state.token = null;
      localStorage.removeItem('token'); // nếu lưu token
    },
    setProfile: (state, action) => { state.profile = action.payload; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.userId = action.payload._id;
        state.status = 'succeeded';
      })
      .addCase(fetchUserProfile.rejected, (state) => { state.status = 'failed'; })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  }
});

export const { setProfile, logout } = userSlice.actions;
export default userSlice.reducer;