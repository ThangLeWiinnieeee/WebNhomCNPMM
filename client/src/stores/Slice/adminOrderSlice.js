/**
 * Admin Order Management Slice
 * Location: client/src/stores/Slice/adminOrderSlice.js
 */

import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAdminOrders,
  fetchOrderDetail,
  markOrderCompleted,
  updateOrderStatus,
  confirmOrder,
  confirmDeposit30,
  confirmPaid100,
  confirmPaidRemaining70,
  completeService,
} from '../thunks/adminOrderThunks';

const initialState = {
  // Order list
  orders: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },

  // Order detail
  selectedOrder: null,

  // Loading states
  loading: false,
  loadingDetail: false,
  loadingAction: false,

  // Error states
  error: null,
  errorDetail: null,
  errorAction: null,

  // Filters
  filterStatus: '',
  searchQuery: '',

  // Last update
  lastUpdated: null,
};

const adminOrderSlice = createSlice({
  name: 'adminOrder',
  initialState,
  reducers: {
    // Set filter status
    setFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
      state.pagination.page = 1;
    },

    // Set search query
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.pagination.page = 1;
    },

    // Clear errors
    clearErrors: (state) => {
      state.error = null;
      state.errorDetail = null;
      state.errorAction = null;
    },
  },

  extraReducers: (builder) => {
    // Fetch Orders
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        // Handle both direct array and object with data property
        if (action.payload?.data) {
          state.orders = action.payload.data;
          state.pagination = action.payload.pagination;
        } else if (action.payload?.pagination) {
          state.pagination = action.payload.pagination;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Order Detail
    builder
      .addCase(fetchOrderDetail.pending, (state) => {
        state.loadingDetail = true;
        state.errorDetail = null;
      })
      .addCase(fetchOrderDetail.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.loadingDetail = false;
        state.errorDetail = action.payload;
      });

    // Mark Order Completed
    builder
      .addCase(markOrderCompleted.pending, (state) => {
        state.loadingAction = true;
        state.errorAction = null;
      })
      .addCase(markOrderCompleted.fulfilled, (state, action) => {
        state.loadingAction = false;
        // Update the order in the list
        const orderIndex = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = action.payload.order;
        }
        // Update selected order
        if (state.selectedOrder?._id === action.payload.order._id) {
          state.selectedOrder = action.payload.order;
        }
      })
      .addCase(markOrderCompleted.rejected, (state, action) => {
        state.loadingAction = false;
        state.errorAction = action.payload;
      });

    // Update Order Status
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loadingAction = true;
        state.errorAction = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loadingAction = false;
        // Update the order in the list
        const orderIndex = state.orders.findIndex(o => o._id === action.payload._id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = action.payload;
        }
        // Update selected order
        if (state.selectedOrder?._id === action.payload._id) {
          state.selectedOrder = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loadingAction = false;
        state.errorAction = action.payload;
      });

    // Confirm Order
    builder
      .addCase(confirmOrder.pending, (state) => {
        state.loadingAction = true;
        state.errorAction = null;
      })
      .addCase(confirmOrder.fulfilled, (state, action) => {
        state.loadingAction = false;
        const orderIndex = state.orders.findIndex(o => o._id === action.payload._id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = action.payload;
        }
        if (state.selectedOrder?._id === action.payload._id) {
          state.selectedOrder = action.payload;
        }
      })
      .addCase(confirmOrder.rejected, (state, action) => {
        state.loadingAction = false;
        state.errorAction = action.payload;
      });

    // Confirm Deposit 30%
    builder
      .addCase(confirmDeposit30.pending, (state) => {
        state.loadingAction = true;
        state.errorAction = null;
      })
      .addCase(confirmDeposit30.fulfilled, (state, action) => {
        state.loadingAction = false;
        const orderIndex = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = action.payload.order;
        }
        if (state.selectedOrder?._id === action.payload.order._id) {
          state.selectedOrder = action.payload.order;
        }
      })
      .addCase(confirmDeposit30.rejected, (state, action) => {
        state.loadingAction = false;
        state.errorAction = action.payload;
      });

    // Confirm Full Payment 100%
    builder
      .addCase(confirmPaid100.pending, (state) => {
        state.loadingAction = true;
        state.errorAction = null;
      })
      .addCase(confirmPaid100.fulfilled, (state, action) => {
        state.loadingAction = false;
        const orderIndex = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = action.payload.order;
        }
        if (state.selectedOrder?._id === action.payload.order._id) {
          state.selectedOrder = action.payload.order;
        }
      })
      .addCase(confirmPaid100.rejected, (state, action) => {
        state.loadingAction = false;
        state.errorAction = action.payload;
      });

    // Confirm Remaining 70% Payment
    builder
      .addCase(confirmPaidRemaining70.pending, (state) => {
        state.loadingAction = true;
        state.errorAction = null;
      })
      .addCase(confirmPaidRemaining70.fulfilled, (state, action) => {
        state.loadingAction = false;
        const orderIndex = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = action.payload.order;
        }
        if (state.selectedOrder?._id === action.payload.order._id) {
          state.selectedOrder = action.payload.order;
        }
      })
      .addCase(confirmPaidRemaining70.rejected, (state, action) => {
        state.loadingAction = false;
        state.errorAction = action.payload;
      });

    // Complete Service
    builder
      .addCase(completeService.pending, (state) => {
        state.loadingAction = true;
        state.errorAction = null;
      })
      .addCase(completeService.fulfilled, (state, action) => {
        state.loadingAction = false;
        const orderIndex = state.orders.findIndex(o => o._id === action.payload._id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = action.payload;
        }
        if (state.selectedOrder?._id === action.payload._id) {
          state.selectedOrder = action.payload;
        }
      })
      .addCase(completeService.rejected, (state, action) => {
        state.loadingAction = false;
        state.errorAction = action.payload;
      });
  },
});

export const { setFilterStatus, setSearchQuery, clearErrors } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
