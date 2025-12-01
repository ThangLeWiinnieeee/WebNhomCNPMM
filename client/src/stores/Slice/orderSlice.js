import { createSlice } from '@reduxjs/toolkit';
import {
  createOrderThunk,
  getUserOrdersThunk,
  getOrderDetailThunk,
  confirmCODPaymentThunk,
  cancelOrderThunk,
  updateOrderStatusThunk
} from '../thunks/orderThunks';

const initialState = {
  orders: [],
  currentOrder: null,
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
    // Tạo đơn hàng
    builder
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
      });

    // Lấy danh sách đơn hàng
    builder
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
      });

    // Lấy chi tiết đơn hàng
    builder
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
      });

    // Xác nhận thanh toán COD
    builder
      .addCase(confirmCODPaymentThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(confirmCODPaymentThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload.order;
        state.message = action.payload.message;
        // Cập nhật trong danh sách đơn hàng
        const index = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      })
      .addCase(confirmCODPaymentThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Hủy đơn hàng
    builder
      .addCase(cancelOrderThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(cancelOrderThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload.order;
        state.message = action.payload.message;
        // Cập nhật trong danh sách đơn hàng
        const index = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (index !== -1) {
          state.orders[index] = action.payload.order;
        }
      })
      .addCase(cancelOrderThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Cập nhật trạng thái đơn hàng
    builder
      .addCase(updateOrderStatusThunk.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload.order;
        state.message = action.payload.message;
        // Cập nhật trong danh sách đơn hàng
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
