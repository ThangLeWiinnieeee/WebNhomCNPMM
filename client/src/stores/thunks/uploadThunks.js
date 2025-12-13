import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

/**
 * Upload image to Cloudinary
 * @param {File} file - The image file to upload
 * @returns {Promise<string>} - The uploaded image URL
 */
export const uploadImageThunk = createAsyncThunk(
  'upload/uploadImage',
  async (file, { rejectWithValue }) => {
    try {
      // Validate file
      if (!file) {
        return rejectWithValue('Vui lòng chọn file ảnh');
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        return rejectWithValue('Vui lòng chọn file ảnh hợp lệ (JPG, PNG, GIF, WEBP)');
      }

      if (file.size > 5 * 1024 * 1024) {
        return rejectWithValue('Kích thước ảnh không được vượt quá 5MB');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('image', file);

      // Upload to server
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.code === 'success' && response.data?.url) {
        return response.data.url;
      }

      return rejectWithValue(response.message || 'Lỗi khi tải ảnh lên');
    } catch (error) {
      return rejectWithValue(error?.message || 'Lỗi khi tải ảnh lên');
    }
  }
);

/**
 * Upload avatar for user profile
 * @param {File} file - The avatar image file
 * @returns {Promise<Object>} - Updated user data with new avatar
 */
export const uploadAvatarThunk = createAsyncThunk(
  'upload/uploadAvatar',
  async (file, { rejectWithValue }) => {
    try {
      // Validate file
      if (!file) {
        return rejectWithValue('Vui lòng chọn file ảnh');
      }

      if (!file.type.startsWith('image/')) {
        return rejectWithValue('Vui lòng chọn file ảnh');
      }

      if (file.size > 5 * 1024 * 1024) {
        return rejectWithValue('Kích thước ảnh không được vượt quá 5MB');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('image', file);

      // Upload to server (this endpoint also updates user profile)
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.code === 'success') {
        return response.user || response.data;
      }

      return rejectWithValue(response.message || 'Lỗi khi tải ảnh lên');
    } catch (error) {
      return rejectWithValue(error?.message || 'Lỗi khi tải ảnh lên');
    }
  }
);
