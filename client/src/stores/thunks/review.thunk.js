import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig.js';

// Submit review (với thưởng điểm/coupon)
export const submitReviewThunk = createAsyncThunk(
  'review/submitReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      // For FormData, explicitly pass config to avoid JSON header override
      const response = await api.post('/reviews/submit', reviewData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response; // { success, message, data: { review, points, coupon } }
    } catch (error) {
      console.error('Lỗi gửi đánh giá:', error);
      return rejectWithValue(error.message || 'Lỗi gửi đánh giá');
    }
  }
);

// Fetch existing review by orderId
export const fetchReviewThunk = createAsyncThunk(
  'review/fetchReview',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/reviews/order/${orderId}`);
      return response?.data?.review || response?.review || null;
    } catch (error) {
      console.error('Lỗi lấy đánh giá:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Lỗi lấy đánh giá');
    }
  }
);

// Lấy danh sách reviews của user (tùy chọn, nếu cần fetch sau)
export const getUserReviewsThunk = createAsyncThunk(
  'review/getUserReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/reviews');
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Lỗi lấy danh sách đánh giá');
    }
  }
);