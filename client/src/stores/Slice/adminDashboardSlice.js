/**
 * Admin Dashboard Redux Slice
 * Location: client/src/stores/Slice/adminDashboardSlice.js
 */

import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCompleteDashboardStats,
  fetchRevenueOverview,
  fetchMonthlyRevenue,
  fetchNewCustomersStats,
  fetchTopProducts,
  fetchRecentOrders,
  fetchOrderStatusStats,
} from '../thunks/adminDashboardThunks';

const initialState = {
  // Complete stats
  stats: null,
  
  // Individual data
  revenueOverview: null,
  monthlyRevenue: {
    labels: [],
    datasets: [],
    rawData: [],
  },
  newCustomers: null,
  topProducts: [],
  recentOrders: [],
  orderStatusStats: [],

  // Loading states
  loading: false,
  loadingRevenue: false,
  loadingCharts: false,
  loadingOrders: false,

  // Error states
  error: null,
  errorRevenue: null,
  errorCharts: null,
  errorOrders: null,

  // Last update
  lastUpdated: null,
};

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    // Reset all errors
    clearErrors: (state) => {
      state.error = null;
      state.errorRevenue = null;
      state.errorCharts = null;
      state.errorOrders = null;
    },
    // Reset dashboard
    resetDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch Complete Dashboard Stats
    builder
      .addCase(fetchCompleteDashboardStats.pending, (state) => {
        state.loading = true;
        state.loadingCharts = true;
        state.loadingOrders = true;
        state.error = null;
        state.errorCharts = null;
        state.errorOrders = null;
      })
      .addCase(fetchCompleteDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload || {};
        state.revenueOverview = action.payload?.revenueOverview || {
          today: { revenue: 0, orders: 0 },
          month: { revenue: 0, orders: 0 },
          year: { revenue: 0, orders: 0 },
        };
        state.monthlyRevenue = {
          labels: action.payload?.monthlyRevenue?.map(item => item.month) || [],
          datasets: [],
          rawData: action.payload?.monthlyRevenue || [],
        };
        state.newCustomers = action.payload?.newCustomers || {
          newLast30Days: 0,
          newLast7Days: 0,
          newToday: 0,
          totalUsers: 0,
          avgNewPerDay: 0,
        };
        state.topProducts = action.payload?.topProducts || [];
        state.recentOrders = action.payload?.recentOrders || [];
        state.orderStatusStats = action.payload?.orderStatusStats || {
          pending: 0,
          confirmed: 0,
          processing: 0,
          completed: 0,
          cancelled: 0,
        };
        state.loadingCharts = false;
        state.loadingOrders = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchCompleteDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.loadingCharts = false;
        state.loadingOrders = false;
        state.error = action.payload;
        state.errorCharts = action.payload;
        state.errorOrders = action.payload;
        // Maintain default state values instead of setting to undefined
        state.stats = {};
        state.revenueOverview = {
          today: { revenue: 0, orders: 0 },
          month: { revenue: 0, orders: 0 },
          year: { revenue: 0, orders: 0 },
        };
        state.monthlyRevenue = {
          labels: [],
          datasets: [],
          rawData: [],
        };
        state.recentOrders = [];
      });

    // Fetch Revenue Overview
    builder
      .addCase(fetchRevenueOverview.pending, (state) => {
        state.loadingRevenue = true;
        state.errorRevenue = null;
      })
      .addCase(fetchRevenueOverview.fulfilled, (state, action) => {
        state.loadingRevenue = false;
        state.revenueOverview = action.payload;
      })
      .addCase(fetchRevenueOverview.rejected, (state, action) => {
        state.loadingRevenue = false;
        state.errorRevenue = action.payload;
      });

    // Fetch Monthly Revenue
    builder
      .addCase(fetchMonthlyRevenue.pending, (state) => {
        state.loadingCharts = true;
        state.errorCharts = null;
      })
      .addCase(fetchMonthlyRevenue.fulfilled, (state, action) => {
        state.loadingCharts = false;
        // API returns array directly, convert to chart format
        const revenueData = Array.isArray(action.payload) ? action.payload : action.payload.data || [];
        state.monthlyRevenue = {
          labels: revenueData.map(item => item.month),
          datasets: [
            {
              label: 'Doanh Thu',
              data: revenueData.map(item => item.revenue),
            },
          ],
          rawData: revenueData,
        };
      })
      .addCase(fetchMonthlyRevenue.rejected, (state, action) => {
        state.loadingCharts = false;
        state.errorCharts = action.payload;
      });

    // Fetch New Customers Stats
    builder
      .addCase(fetchNewCustomersStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewCustomersStats.fulfilled, (state, action) => {
        state.loading = false;
        state.newCustomers = action.payload;
      })
      .addCase(fetchNewCustomersStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Top Products
    builder
      .addCase(fetchTopProducts.pending, (state) => {
        state.loadingCharts = true;
        state.errorCharts = null;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.loadingCharts = false;
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.loadingCharts = false;
        state.errorCharts = action.payload;
      });

    // Fetch Recent Orders
    builder
      .addCase(fetchRecentOrders.pending, (state) => {
        state.loadingOrders = true;
        state.errorOrders = null;
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.loadingOrders = false;
        state.recentOrders = action.payload;
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.loadingOrders = false;
        state.errorOrders = action.payload;
      });

    // Fetch Order Status Stats
    builder
      .addCase(fetchOrderStatusStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderStatusStats.fulfilled, (state, action) => {
        state.loading = false;
        state.orderStatusStats = action.payload;
      })
      .addCase(fetchOrderStatusStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors, resetDashboard } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
