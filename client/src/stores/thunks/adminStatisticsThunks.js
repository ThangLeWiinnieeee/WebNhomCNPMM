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
      const response = await axios.get('/admin/statistics/revenue-sales', { params });
      // axios interceptor returns { success, data: { orders, pagination, totalRevenue } }
      const payload = response?.data || response;
      
      console.log('Revenue sales response:', payload);
      
      // Ensure consistent data structure
      return {
        orders: Array.isArray(payload?.orders) ? payload.orders : [],
        pagination: payload?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
        totalRevenue: payload?.totalRevenue || 0,
      };
    } catch (error) {
      console.error('Revenue sales error:', error);
      return rejectWithValue(error?.message || 'Failed to fetch revenue sales');
    }
  }
);

/**
 * Fetch top products
 */
export const fetchTopProducts = createAsyncThunk(
  'admin/statistics/fetchTopProducts',
  async ({ limit = 10, startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const params = { limit };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      console.log('Fetching top products with params:', params);
      const response = await axios.get('/admin/statistics/top-products', { params });
      // axios interceptor returns { success, data: { topProducts } }
      const payload = response?.data || response;
      
      console.log('Top products response:', payload);
      
      // Handle different response formats - Backend returns { topProducts: [...] }
      const topProducts = Array.isArray(payload?.topProducts) 
        ? payload.topProducts 
        : Array.isArray(payload?.data?.topProducts)
          ? payload.data.topProducts
        : Array.isArray(payload) 
          ? payload 
          : [];
      
      console.log('Processed top products:', topProducts);
      
      return topProducts;
    } catch (error) {
      console.error('Top products error:', error);
      return rejectWithValue(error?.message || 'Failed to fetch top products');
    }
  }
);

/**
 * Fetch cash flow statistics (pending, deposit, fullPayment)
 */
export const fetchCashFlow = createAsyncThunk(
  'admin/statistics/fetchCashFlow',
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      console.log('Fetching cash flow with params:', params);
      const response = await axios.get('/admin/statistics/cash-flow', { params });
      const payload = response?.data || response;
      
      console.log('Cash flow response:', payload);
      
      // Ensure consistent structure
      return payload?.cashFlow || {
        pending: { total: 0, count: 0, percentage: 0 },
        deposit: { total: 0, count: 0, percentage: 0 },
        fullPayment: { total: 0, count: 0, percentage: 0 },
      };
    } catch (error) {
      console.error('Cash flow error:', error);
      return rejectWithValue(error?.message || 'Failed to fetch cash flow');
    }
  }
);

/**
 * Fetch new customers statistics
 */
export const fetchNewCustomers = createAsyncThunk(
  'admin/statistics/fetchNewCustomers',
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      console.log('Fetching new customers with params:', params);
      const response = await axios.get('/admin/statistics/new-customers', { params });
      const payload = response?.data || response;
      
      console.log('New customers response:', payload);
      
      return payload?.newCustomers || {
        total: 0,
        thisMonth: 0,
        lastMonth: 0,
        growthRate: 0,
      };
    } catch (error) {
      console.error('New customers error:', error);
      return rejectWithValue(error?.message || 'Failed to fetch new customers');
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
      const response = await axios.get('/admin/statistics/summary');
      const payload = response?.data || response;
      
      console.log('Summary response:', payload);
      
      return payload?.summary || {
        monthRevenue: 0,
        monthOrders: 0,
        pendingAmount: 0,
        newCustomersThisMonth: 0,
      };
    } catch (error) {
      console.error('Summary error:', error);
      return rejectWithValue(error?.message || 'Failed to fetch statistics summary');
    }
  }
);

/**
 * Fetch monthly revenue chart (12 months or filtered range)
 */
export const fetchMonthlyRevenueChart = createAsyncThunk(
  'admin/statistics/fetchMonthlyRevenue',
  async ({ startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      console.log('Fetching monthly revenue chart with params:', params);
      const response = await axios.get('/admin/statistics/monthly-revenue', { params });
      const payload = response?.data || response;
      
      console.log('Monthly revenue response:', payload);
      
      // Handle both array and object responses
      const revenueData = Array.isArray(payload) ? payload : (payload?.data || payload?.monthlyRevenue || []);
      
      if (!Array.isArray(revenueData) || revenueData.length === 0) {
        console.warn('No revenue data returned, returning default structure');
        return {
          labels: [],
          datasets: [],
          rawData: [],
        };
      }
      
      return revenueData;
    } catch (error) {
      console.error('Monthly revenue error:', error);
      return rejectWithValue(error?.message || 'Failed to fetch monthly revenue');
    }
  }
);