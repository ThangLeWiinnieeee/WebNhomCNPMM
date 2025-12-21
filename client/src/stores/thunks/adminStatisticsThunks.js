/**
 * Admin Statistics Thunks
 * Location: client/src/stores/thunks/adminStatisticsThunks.js
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosConfig';

/**
 * Fetch revenue sales (successful orders)
 */
export const fetchRevenueSales = createAsyncThunk(
  'admin/statistics/fetchRevenueSales',
  async ({ startDate, endDate, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const params = { page, limit };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      console.log('Fetching revenue sales with params:', params);
      const data = await axios.get('/admin/statistics/revenue-sales', { params });
      console.log('Revenue sales response:', data);
      return data?.data || { orders: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }, totalRevenue: 0 };
    } catch (error) {
      console.error('Revenue sales error:', error);
      return rejectWithValue(error.message || 'Failed to fetch revenue sales');
    }
  }
);

/**
 * Fetch top products
 */
export const fetchTopProducts = createAsyncThunk(
  'admin/statistics/fetchTopProducts',
  async ({ limit = 10, startDate, endDate }, { rejectWithValue }) => {
    try {
      const params = { limit };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      console.log('Fetching top products with params:', params);
      const data = await axios.get('/admin/statistics/top-products', { params });
      console.log('Top products response:', data);
      return data?.data?.topProducts || [];
    } catch (error) {
      console.error('Top products error:', error);
      return rejectWithValue(error.message || 'Failed to fetch top products');
    }
  }
);

/**
 * Fetch cash flow statistics (pending, deposit, fullPayment)
 */
export const fetchCashFlow = createAsyncThunk(
  'admin/statistics/fetchCashFlow',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching cash flow...');
      const data = await axios.get('/admin/statistics/cash-flow');
      console.log('Cash flow response:', data);
      return data?.data?.cashFlow || { pending: { total: 0, count: 0, percentage: 0 }, deposit: { total: 0, count: 0, percentage: 0 }, fullPayment: { total: 0, count: 0, percentage: 0 } };
    } catch (error) {
      console.error('Cash flow error:', error);
      return rejectWithValue(error.message || 'Failed to fetch cash flow');
    }
  }
);

/**
 * Fetch new customers statistics
 */
export const fetchNewCustomers = createAsyncThunk(
  'admin/statistics/fetchNewCustomers',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      console.log('Fetching new customers with params:', params);
      const data = await axios.get('/admin/statistics/new-customers', { params });
      console.log('New customers response:', data);
      return data?.data?.newCustomers || { total: 0, thisMonth: 0, lastMonth: 0, growthRate: 0 };
    } catch (error) {
      console.error('New customers error:', error);
      return rejectWithValue(error.message || 'Failed to fetch new customers');
    }
  }
);

/**
 * Fetch statistics summary
 */
export const fetchStatisticsSummary = createAsyncThunk(
  'admin/statistics/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching summary...');
      const data = await axios.get('/admin/statistics/summary');
      console.log('Summary response:', data);
      return data?.data?.summary || { monthRevenue: 0, monthOrders: 0, pendingAmount: 0, newCustomersThisMonth: 0 };
    } catch (error) {
      console.error('Summary error:', error);
      return rejectWithValue(error.message || 'Failed to fetch statistics summary');
    }
  }
);

/**
 * Fetch monthly revenue chart (12 months)
 */
export const fetchMonthlyRevenueChart = createAsyncThunk(
  'admin/statistics/fetchMonthlyRevenue',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching monthly revenue chart...');
      const data = await axios.get('/admin/statistics/monthly-revenue');
      console.log('Monthly revenue response:', data);
      return data?.data || [];
    } catch (error) {
      console.error('Monthly revenue error:', error);
      return rejectWithValue(error.message || 'Failed to fetch monthly revenue');
    }
  }
);
