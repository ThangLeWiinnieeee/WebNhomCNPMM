/**
 * Admin Statistics Redux Slice
 * Location: client/src/stores/Slice/adminStatisticsSlice.js
 */

import { createSlice } from '@reduxjs/toolkit';
import {
  fetchRevenueSales,
  fetchCashFlow,
  fetchTopProducts,
  fetchNewCustomers,
  fetchStatisticsSummary,
  fetchMonthlyRevenueChart,
} from '../thunks/adminStatisticsThunks';

const initialState = {
  // Revenue Sales
  revenueSales: {
    orders: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    totalRevenue: 0,
  },

  // Top Products
  topProducts: [],

  // New Customers
  newCustomers: {
    total: 0,
    thisMonth: 0,
    lastMonth: 0,
    growthRate: 0,
  },

  // Summary
  summary: {
    monthRevenue: 0,
    monthOrders: 0,
    pendingAmount: 0,
    newCustomersThisMonth: 0,
  },

  // Cash Flow
  cashFlow: {
    pending: { total: 0, count: 0, percentage: 0 },
    deposit: { total: 0, count: 0, percentage: 0 },
    fullPayment: { total: 0, count: 0, percentage: 0 },
  },

  // Monthly Revenue Chart
  monthlyRevenue: {
    labels: [],
    datasets: [],
    rawData: [],
  },

  // Loading states
  loading: false,
  loadingRevenueSales: false,
  loadingCashFlow: false,
  loadingTopProducts: false,
  loadingNewCustomers: false,
  loadingSummary: false,
  loadingMonthlyRevenue: false,

  // Error states
  error: null,
  errorRevenueSales: null,
  errorCashFlow: null,
  errorTopProducts: null,
  errorNewCustomers: null,
  errorSummary: null,
  errorMonthlyRevenue: null,
};

// Helper function to transform monthly revenue data
const transformMonthlyRevenueData = (rawData) => {
  if (!Array.isArray(rawData) || rawData.length === 0) {
    return {
      labels: [],
      datasets: [],
      rawData: [],
    };
  }

  try {
    return {
      labels: rawData.map(item => item.month || item.label || ''),
      datasets: [
        {
          label: 'Doanh Thu (VND)',
          data: rawData.map(item => item.revenue || item.amount || 0),
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Số Đơn',
          data: rawData.map(item => item.orders || item.count || 0),
          borderColor: '#2196F3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
      rawData: rawData,
    };
  } catch (e) {
    console.error('Error transforming monthly revenue data:', e);
    return {
      labels: [],
      datasets: [],
      rawData: [],
    };
  }
};

const adminStatisticsSlice = createSlice({
  name: 'adminStatistics',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.errorRevenueSales = null;
      state.errorCashFlow = null;
      state.errorTopProducts = null;
      state.errorNewCustomers = null;
      state.errorSummary = null;
      state.errorMonthlyRevenue = null;
    },
    resetStatistics: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch Revenue Sales
    builder
      .addCase(fetchRevenueSales.pending, (state) => {
        state.loadingRevenueSales = true;
        state.errorRevenueSales = null;
      })
      .addCase(fetchRevenueSales.fulfilled, (state, action) => {
        state.loadingRevenueSales = false;
        state.revenueSales = {
          orders: Array.isArray(action.payload?.orders) ? action.payload.orders : [],
          pagination: action.payload?.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
          totalRevenue: action.payload?.totalRevenue || 0,
        };
      })
      .addCase(fetchRevenueSales.rejected, (state, action) => {
        state.loadingRevenueSales = false;
        state.errorRevenueSales = action.payload;
        state.revenueSales = {
          orders: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
          totalRevenue: 0,
        };
      });

    // Fetch Cash Flow
    builder
      .addCase(fetchCashFlow.pending, (state) => {
        state.loadingCashFlow = true;
        state.errorCashFlow = null;
      })
      .addCase(fetchCashFlow.fulfilled, (state, action) => {
        state.loadingCashFlow = false;
        state.cashFlow = action.payload || {
          pending: { total: 0, count: 0, percentage: 0 },
          deposit: { total: 0, count: 0, percentage: 0 },
          fullPayment: { total: 0, count: 0, percentage: 0 },
        };
      })
      .addCase(fetchCashFlow.rejected, (state, action) => {
        state.loadingCashFlow = false;
        state.errorCashFlow = action.payload;
        state.cashFlow = {
          pending: { total: 0, count: 0, percentage: 0 },
          deposit: { total: 0, count: 0, percentage: 0 },
          fullPayment: { total: 0, count: 0, percentage: 0 },
        };
      });

    // Fetch Top Products
    builder
      .addCase(fetchTopProducts.pending, (state) => {
        state.loadingTopProducts = true;
        state.errorTopProducts = null;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.loadingTopProducts = false;
        state.topProducts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.loadingTopProducts = false;
        state.errorTopProducts = action.payload;
        state.topProducts = [];
      });

    // Fetch New Customers
    builder
      .addCase(fetchNewCustomers.pending, (state) => {
        state.loadingNewCustomers = true;
        state.errorNewCustomers = null;
      })
      .addCase(fetchNewCustomers.fulfilled, (state, action) => {
        state.loadingNewCustomers = false;
        state.newCustomers = action.payload || {
          total: 0,
          thisMonth: 0,
          lastMonth: 0,
          growthRate: 0,
        };
      })
      .addCase(fetchNewCustomers.rejected, (state, action) => {
        state.loadingNewCustomers = false;
        state.errorNewCustomers = action.payload;
        state.newCustomers = {
          total: 0,
          thisMonth: 0,
          lastMonth: 0,
          growthRate: 0,
        };
      });

    // Fetch Statistics Summary
    builder
      .addCase(fetchStatisticsSummary.pending, (state) => {
        state.loadingSummary = true;
        state.errorSummary = null;
      })
      .addCase(fetchStatisticsSummary.fulfilled, (state, action) => {
        state.loadingSummary = false;
        state.summary = action.payload || {
          monthRevenue: 0,
          monthOrders: 0,
          pendingAmount: 0,
          newCustomersThisMonth: 0,
        };
      })
      .addCase(fetchStatisticsSummary.rejected, (state, action) => {
        state.loadingSummary = false;
        state.errorSummary = action.payload;
        state.summary = {
          monthRevenue: 0,
          monthOrders: 0,
          pendingAmount: 0,
          newCustomersThisMonth: 0,
        };
      });

    // Fetch Monthly Revenue Chart
    builder
      .addCase(fetchMonthlyRevenueChart.pending, (state) => {
        state.loadingMonthlyRevenue = true;
        state.errorMonthlyRevenue = null;
      })
      .addCase(fetchMonthlyRevenueChart.fulfilled, (state, action) => {
        state.loadingMonthlyRevenue = false;
        // Transform raw data into chart-ready format
        state.monthlyRevenue = transformMonthlyRevenueData(action.payload);
      })
      .addCase(fetchMonthlyRevenueChart.rejected, (state, action) => {
        state.loadingMonthlyRevenue = false;
        state.errorMonthlyRevenue = action.payload;
        state.monthlyRevenue = {
          labels: [],
          datasets: [],
          rawData: [],
        };
      });
  },
});

export const { clearErrors, resetStatistics } = adminStatisticsSlice.actions;
export default adminStatisticsSlice.reducer;