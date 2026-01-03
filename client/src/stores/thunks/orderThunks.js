import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

// Tạo đơn hàng
export const createOrderThunk = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      console.log('create order: ', orderData);
      const response = await api.post('/orders', orderData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.message || 'Lỗi tạo đơn hàng');
    }
  }
);

// Lấy danh sách đơn hàng của user
export const getUserOrdersThunk = createAsyncThunk(
  'order/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/orders');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi lấy danh sách đơn hàng');
    }
  }
);

// Lấy chi tiết đơn hàng
export const getOrderDetailThunk = createAsyncThunk(
  'order/getOrderDetail',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi lấy chi tiết đơn hàng');
    }
  }
);

// Xác nhận thanh toán COD
export const confirmCODPaymentThunk = createAsyncThunk(
  'order/confirmCODPayment',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${orderId}/confirm`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi xác nhận thanh toán');
    }
  }
);

// Hủy đơn hàng
export const cancelOrderThunk = createAsyncThunk(
  'order/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${orderId}/cancel`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi hủy đơn hàng');
    }
  }
);

// Cập nhật trạng thái đơn hàng
export const updateOrderStatusThunk = createAsyncThunk(
  'order/updateOrderStatus',
  async ({ orderId, orderStatus, paymentStatus }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, {
        orderStatus,
        paymentStatus
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi cập nhật trạng thái');
    }
  }
);

// Lấy điểm
export const getUserPointsThunk = createAsyncThunk(
  'order/getUserPoints',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/orders/points');
      return res; // { success, points }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Không lấy được điểm'
      );
    }
  }
);

// Lấy coupon
export const getUserCouponsThunk = createAsyncThunk(
  'order/getUserCoupons',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/orders/coupons');
      return res; // { success, coupons }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Không lấy được coupon'
      );
    }
  }
);

// Review thunks
export const getReviewsThunk = createAsyncThunk(
  'order/getReviews',
  async ({ page = 1, limit = 10, search = '' }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page, limit, search });
      const response = await api.get(`/admin/reviews?${params}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi lấy đánh giá');
    }
  }
);

export const deleteReviewThunk = createAsyncThunk(
  'order/deleteReview',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/reviews/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi xóa');
    }
  }
);

// Promotion thunks
export const getPromotionsThunk = createAsyncThunk(
  'order/getPromotions',
  async ({ page = 1, limit = 10, search = '' }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page, limit, search });
      const response = await api.get(`/admin/promotions?${params}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi lấy khuyến mãi');
    }
  }
);

export const createPromotionThunk = createAsyncThunk(
  'order/createPromotion',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/promotions', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi tạo');
    }
  }
);

export const updatePromotionThunk = createAsyncThunk(
  'order/updatePromotion',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/promotions/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi cập nhật');
    }
  }
);

export const deletePromotionThunk = createAsyncThunk(
  'order/deletePromotion',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/promotions/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi xóa');
    }
  }
);