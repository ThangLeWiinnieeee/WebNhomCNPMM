import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig.js';

/**
 * Create ZaloPay payment request
 */
export const createZaloPayPaymentThunk = createAsyncThunk(
  'payment/createZaloPayPayment',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.post('/payment/zalopay/create', {
        orderId,
      });

      if (!response.success) {
        return rejectWithValue(response.message || 'Lỗi khi tạo thanh toán');
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Lỗi khi tạo yêu cầu thanh toán'
      );
    }
  }
);

/**
 * Check ZaloPay payment status
 */
export const checkZaloPayStatusThunk = createAsyncThunk(
  'payment/checkZaloPayStatus',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/payment/zalopay/${orderId}/status`);

      if (!response.success) {
        return rejectWithValue(response.message || 'Lỗi khi kiểm tra trạng thái');
      }

      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Lỗi khi kiểm tra trạng thái thanh toán'
      );
    }
  }
);
