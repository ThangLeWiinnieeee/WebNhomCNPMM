/**
 * Admin Customer Management Thunks
 * Location: client/src/stores/thunks/customerThunks.js
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

/**
 * Fetch all customers with filters
 * @param {Object} params - Filter parameters
 * @param {Number} params.page - Page number
 * @param {Number} params.limit - Items per page
 * @param {String} params.search - Search query
 * @param {String} params.sortBy - Sort field
 * @param {String} params.sortOrder - Sort order (asc/desc)
 */
export const fetchAllCustomers = createAsyncThunk(
  'customer/fetchAll',
  async ({ page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' }, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/customers', {
        params: {
          page,
          limit,
          search,
          sortBy,
          sortOrder,
        },
      });

      // Axios interceptor đã return data, nên response chính là data
      if (response.success) {
        return {
          customers: response.customers,
          pagination: response.pagination,
        };
      }
      return rejectWithValue(response.message || 'Lỗi khi tải danh sách khách hàng');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Lỗi khi tải danh sách khách hàng';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch customer detail by ID
 * @param {String} customerId - Customer ID
 */
export const fetchCustomerById = createAsyncThunk(
  'customer/fetchById',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/customers/${customerId}`);

      if (response.success) {
        return {
          customer: response.customer,
        };
      }
      return rejectWithValue(response.message || 'Lỗi khi tải thông tin khách hàng');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Lỗi khi tải thông tin khách hàng';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update customer information
 * @param {Object} params - Update parameters
 * @param {String} params.customerId - Customer ID
 * @param {Object} params.data - Update data
 */
export const updateCustomer = createAsyncThunk(
  'customer/update',
  async ({ customerId, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/customers/${customerId}`, data);

      if (response.success) {
        return {
          customer: response.customer,
          message: response.message,
        };
      }
      return rejectWithValue(response.message || 'Lỗi khi cập nhật khách hàng');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Lỗi khi cập nhật khách hàng';
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete customer
 * @param {String} customerId - Customer ID
 */
export const deleteCustomer = createAsyncThunk(
  'customer/delete',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/customers/${customerId}`);

      if (response.success) {
        return {
          customerId,
          message: response.message,
        };
      }
      return rejectWithValue(response.message || 'Lỗi khi xóa khách hàng');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Lỗi khi xóa khách hàng';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update customer status
 * @param {Object} params - Parameters
 * @param {String} params.customerId - Customer ID
 * @param {String} params.status - New status (active, suspended, inactive)
 */
export const updateCustomerStatus = createAsyncThunk(
  'customer/updateStatus',
  async ({ customerId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/customers/${customerId}/status`, { status });

      if (response.success) {
        return {
          customer: response.customer,
          message: response.message,
        };
      }
      return rejectWithValue(response.message || 'Lỗi khi cập nhật trạng thái');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Lỗi khi cập nhật trạng thái';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch customer statistics
 */
export const fetchCustomerStats = createAsyncThunk(
  'customer/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/customers/stats');

      if (response.success) {
        return {
          stats: response.stats,
        };
      }
      return rejectWithValue(response.message || 'Lỗi khi tải thống kê');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Lỗi khi tải thống kê';
      return rejectWithValue(message);
    }
  }
);
