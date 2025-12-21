/**
 * Admin Dashboard Thunks
 * Location: client/src/stores/thunks/adminDashboardThunks.js
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosConfig';

/**
 * Fetch complete dashboard statistics
 */
export const fetchCompleteDashboardStats = createAsyncThunk(
  'admin/dashboard/fetchCompleteDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      // axios config returns data directly, not response
      const data = await axios.get('/admin/dashboard/complete-stats');
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch dashboard stats');
    }
  }
);

/**
 * Fetch revenue overview
 */
export const fetchRevenueOverview = createAsyncThunk(
  'admin/dashboard/fetchRevenueOverview',
  async (_, { rejectWithValue }) => {
    try {
      const data = await axios.get('/admin/dashboard/revenue-overview');
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch revenue overview');
    }
  }
);

/**
 * Fetch monthly revenue chart data
 */
export const fetchMonthlyRevenue = createAsyncThunk(
  'admin/dashboard/fetchMonthlyRevenue',
  async (_, { rejectWithValue }) => {
    try {
      const data = await axios.get('/admin/dashboard/monthly-revenue');
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch monthly revenue');
    }
  }
);

/**
 * Fetch new customers statistics
 */
export const fetchNewCustomersStats = createAsyncThunk(
  'admin/dashboard/fetchNewCustomersStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await axios.get('/admin/dashboard/new-customers');
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch new customers stats');
    }
  }
);

/**
 * Fetch top products
 */
export const fetchTopProducts = createAsyncThunk(
  'admin/dashboard/fetchTopProducts',
  async (limit = 10, { rejectWithValue }) => {
    try {
      const data = await axios.get(`/admin/dashboard/top-products?limit=${limit}`);
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch top products');
    }
  }
);

/**
 * Fetch recent successful orders
 */
export const fetchRecentOrders = createAsyncThunk(
  'admin/dashboard/fetchRecentOrders',
  async (limit = 5, { rejectWithValue }) => {
    try {
      const data = await axios.get(`/admin/dashboard/recent-orders?limit=${limit}`);
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch recent orders');
    }
  }
);

/**
 * Fetch order status statistics
 */
export const fetchOrderStatusStats = createAsyncThunk(
  'admin/dashboard/fetchOrderStatusStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await axios.get('/admin/dashboard/order-status-stats');
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch order status stats');
    }
  }
);
