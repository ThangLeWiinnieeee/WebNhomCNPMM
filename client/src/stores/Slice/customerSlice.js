/**
 * Admin Customer Management Slice
 * Location: client/src/stores/Slice/customerSlice.js
 */

import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllCustomers,
  fetchCustomerById,
  updateCustomer,
  deleteCustomer,
  fetchCustomerStats,
  updateCustomerStatus,
} from '../thunks/customerThunks';

const initialState = {
  // Customer list
  customers: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCustomers: 0,
    limit: 10,
  },

  // Customer detail
  selectedCustomer: null,

  // Customer stats
  stats: {
    totalCustomers: 0,
    newCustomersThisMonth: 0,
    topCustomers: [],
  },

  // Loading states
  loading: false,
  loadingDetail: false,
  loadingAction: false,
  loadingStats: false,

  // Error states
  error: null,
  errorDetail: null,
  errorAction: null,
  errorStats: null,

  // Filters
  searchQuery: '',
  sortBy: 'createdAt',
  sortOrder: 'desc',

  // Last update
  lastUpdated: null,
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    // Set search query
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.pagination.currentPage = 1; // Reset to page 1 when searching
    },

    // Set sort options
    setSortOptions: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      if (sortBy) state.sortBy = sortBy;
      if (sortOrder) state.sortOrder = sortOrder;
      state.pagination.currentPage = 1;
    },

    // Set current page
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },

    // Clear selected customer
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
      state.errorDetail = null;
    },

    // Clear errors
    clearErrors: (state) => {
      state.error = null;
      state.errorDetail = null;
      state.errorAction = null;
      state.errorStats = null;
    },

    // Clear action error
    clearActionError: (state) => {
      state.errorAction = null;
    },
  },

  extraReducers: (builder) => {
    // Fetch All Customers
    builder
      .addCase(fetchAllCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.customers;
        state.pagination = action.payload.pagination;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Lỗi khi tải danh sách khách hàng';
      });

    // Fetch Customer By ID
    builder
      .addCase(fetchCustomerById.pending, (state) => {
        state.loadingDetail = true;
        state.errorDetail = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loadingDetail = false;
        state.selectedCustomer = action.payload.customer;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.errorDetail = action.payload || 'Lỗi khi tải thông tin khách hàng';
      });

    // Update Customer
    builder
      .addCase(updateCustomer.pending, (state) => {
        state.loadingAction = true;
        state.errorAction = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loadingAction = false;
        
        // Update in customers list
        const index = state.customers.findIndex(c => c._id === action.payload.customer._id);
        if (index !== -1) {
          state.customers[index] = {
            ...state.customers[index],
            ...action.payload.customer,
          };
        }

        // Update selected customer if it's the same one
        if (state.selectedCustomer?._id === action.payload.customer._id) {
          state.selectedCustomer = {
            ...state.selectedCustomer,
            ...action.payload.customer,
          };
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loadingAction = false;
        state.errorAction = action.payload || 'Lỗi khi cập nhật khách hàng';
      });

    // Delete Customer
    builder
      .addCase(deleteCustomer.pending, (state) => {
        state.loadingAction = true;
        state.errorAction = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loadingAction = false;
        
        // Remove from customers list
        state.customers = state.customers.filter(c => c._id !== action.payload.customerId);
        
        // Update pagination
        state.pagination.totalCustomers = Math.max(0, state.pagination.totalCustomers - 1);
        
        // Clear selected customer if it's the deleted one
        if (state.selectedCustomer?._id === action.payload.customerId) {
          state.selectedCustomer = null;
        }
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loadingAction = false;
        state.errorAction = action.payload || 'Lỗi khi xóa khách hàng';
      });

    // Fetch Customer Stats
    builder
      .addCase(fetchCustomerStats.pending, (state) => {
        state.loadingStats = true;
        state.errorStats = null;
      })
      .addCase(fetchCustomerStats.fulfilled, (state, action) => {
        state.loadingStats = false;
        state.stats = action.payload.stats;
      })
      .addCase(fetchCustomerStats.rejected, (state, action) => {
        state.loadingStats = false;
        state.errorStats = action.payload || 'Lỗi khi tải thống kê';
      });

    // Update Customer Status
    builder
      .addCase(updateCustomerStatus.pending, (state) => {
        state.loadingAction = true;
        state.errorAction = null;
      })
      .addCase(updateCustomerStatus.fulfilled, (state, action) => {
        state.loadingAction = false;
        
        // Update customer status in list
        const customerIndex = state.customers.findIndex(c => c._id === action.payload.customer._id);
        if (customerIndex !== -1) {
          state.customers[customerIndex].status = action.payload.customer.status;
        }
        
        // Update selected customer if it's the updated one
        if (state.selectedCustomer?._id === action.payload.customer._id) {
          state.selectedCustomer.status = action.payload.customer.status;
        }
      })
      .addCase(updateCustomerStatus.rejected, (state, action) => {
        state.loadingAction = false;
        state.errorAction = action.payload || 'Lỗi khi cập nhật trạng thái';
      });
  },
});

export const {
  setSearchQuery,
  setSortOptions,
  setCurrentPage,
  clearSelectedCustomer,
  clearErrors,
  clearActionError,
} = customerSlice.actions;

export default customerSlice.reducer;
