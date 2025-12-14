import { createSlice } from '@reduxjs/toolkit';
import { fetchSettingsThunk } from '../thunks/settingsThunks';

const initialState = {
  settings: {
    brandName: 'Wedding Dream',
    website: 'www.weddingdream.vn',
    hotline: '',
    email: '',
    address: '',
    socialLinks: {
      facebook: '',
      zalo: '',
      instagram: '',
      tiktok: '',
    },
  },
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearSettings: (state) => {
      state.settings = initialState.settings;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch settings
      .addCase(fetchSettingsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettingsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload || initialState.settings;
        state.error = null;
      })
      .addCase(fetchSettingsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi khi tải thông tin settings';
        // Giữ nguyên settings mặc định nếu có lỗi
      });
  },
});

export const { clearSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
