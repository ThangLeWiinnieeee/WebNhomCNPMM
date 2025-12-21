import { createSlice } from '@reduxjs/toolkit';
import {
  createOrderThunk,
  getUserOrdersThunk,
  getOrderDetailThunk,
  confirmCODPaymentThunk,
  cancelOrderThunk,
  updateOrderStatusThunk,
  getUserPointsThunk,
  getUserCouponsThunk
} from '../thunks/orderThunks';

const initialState = {
  orders: [],
  currentOrder: null,
  points: 0,  // Key thống nhất
  coupons: [],  // Key thống nhất
  pointsStatus: 'idle',  // 'idle' | 'loading' | 'succeeded' | 'rejected'
  couponsStatus: 'idle',
  status: 'idle',
  error: null,
  message: ''
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.message = '';
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Points (safe check payload)
      .addCase(getUserPointsThunk.pending, (state) => {
        state.pointsStatus = 'loading';
        state.error = null;
      })
      .addCase(getUserPointsThunk.fulfilled, (state, action) => {
        state.pointsStatus = 'succeeded';
        if (action.payload && action.payload.success !== false) {
          state.points = action.payload.points || 0;  // Safe: fallback 0 nếu undefined
        } else {
          state.points = 0;
          console.warn('Points payload invalid:', action.payload);  // Debug log
        }
      })
      .addCase(getUserPointsThunk.rejected, (state, action) => {
        state.pointsStatus = 'rejected';
        state.points = 0;
        state.error = action.payload || 'Lỗi lấy điểm';
      })

      // Coupons (safe check)
      .addCase(getUserCouponsThunk.pending, (state) => {
        state.couponsStatus = 'loading';
        state.error = null;
      })
      .addCase(getUserCouponsThunk.fulfilled, (state, action) => {
        state.couponsStatus = 'succeeded';
        if (action.payload && action.payload.success !== false) {
          state.coupons = action.payload.coupons || [];  // Safe: fallback []
        } else {
          state.coupons = [];
          console.warn('Coupons payload invalid:', action.payload);  // Debug
        }
      })
      .addCase(getUserCouponsThunk.rejected, (state, action) => {
        state.couponsStatus = 'rejected';
        state.coupons = [];
        state.error = action.payload || 'Lỗi lấy coupons';
      })

      // Tạo đơn hàng
      .addCase(createOrderThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload.order;
        state.message = action.payload.message;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Lấy danh sách đơn hàng
      .addCase(getUserOrdersThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getUserOrdersThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload.orders || [];
      })
      .addCase(getUserOrdersThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Lấy chi tiết đơn hàng
      .addCase(getOrderDetailThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getOrderDetailThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload.order;
      })
      .addCase(getOrderDetailThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Xác nhận thanh toán COD
      .addCase(confirmCODPaymentThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(confirmCODPaymentThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload.order;
        state.message = action.payload.message;
        const index = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      })
      .addCase(confirmCODPaymentThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Hủy đơn hàng
      .addCase(cancelOrderThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(cancelOrderThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload.order;
        state.message = action.payload.message;
        const index = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      })
      .addCase(cancelOrderThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Cập nhật trạng thái đơn hàng
      .addCase(updateOrderStatusThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload.order;
        state.message = action.payload.message;
        const index = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      })
      .addCase(updateOrderStatusThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearMessage, clearError } = orderSlice.actions;
export default orderSlice.reducer;