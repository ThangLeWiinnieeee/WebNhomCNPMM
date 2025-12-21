/**
 * Admin Order Management Thunks
 * Location: client/src/stores/thunks/adminOrderThunks.js
 */

import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosConfig';

/**
 * Fetch all orders with filters
 */
export const fetchAdminOrders = createAsyncThunk(
  'admin/order/fetchOrders',
  async ({ status = '', page = 1, limit = 10, search = '' }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('page', page);
      params.append('limit', limit);
      if (search) params.append('search', search);

      const data = await axios.get(`/admin/orders?${params.toString()}`);
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch orders');
    }
  }
);

/**
 * Fetch order detail
 */
export const fetchOrderDetail = createAsyncThunk(
  'admin/order/fetchDetail',
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await axios.get(`/admin/orders/${orderId}`);
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch order detail');
    }
  }
);

/**
 * Mark order as completed
 * Updates status + wallet
 */
export const markOrderCompleted = createAsyncThunk(
  'admin/order/markCompleted',
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await axios.put(`/admin/orders/${orderId}/mark-completed`);
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to mark order as completed');
    }
  }
);

/**
 * Update order status
 */
export const updateOrderStatus = createAsyncThunk(
  'admin/order/updateStatus',
  async ({ orderId, status, notes = '' }, { rejectWithValue }) => {
    try {
      const data = await axios.put(`/admin/orders/${orderId}/status`, {
        status,
        notes,
      });
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to update order status');
    }
  }
);

/**
 * Confirm order (pending -> confirmed)
 */
export const confirmOrder = createAsyncThunk(
  'admin/order/confirm',
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await axios.put(`/admin/orders/${orderId}/confirm`);
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to confirm order');
    }
  }
);

/**
 * Confirm deposit 30% (confirmed -> processing)
 */
export const confirmDeposit30 = createAsyncThunk(
  'admin/order/deposit30',
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await axios.put(`/admin/orders/${orderId}/deposit-30`);
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to confirm 30% deposit');
    }
  }
);

/**
 * Confirm full payment 100% (confirmed -> processing)
 */
export const confirmPaid100 = createAsyncThunk(
  'admin/order/paid100',
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await axios.put(`/admin/orders/${orderId}/paid-100`);
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to confirm full payment');
    }
  }
);

/**
 * Confirm remaining 70% payment
 */
export const confirmPaidRemaining70 = createAsyncThunk(
  'admin/order/paidRemaining70',
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await axios.put(`/admin/orders/${orderId}/paid-remaining-70`);
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to confirm remaining 70% payment');
    }
  }
);

/**
 * Complete service (processing -> completed)
 */
export const completeService = createAsyncThunk(
  'admin/order/completeService',
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await axios.put(`/admin/orders/${orderId}/complete-service`);
      if (data.success) {
        return data.data;
      }
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to complete service');
    }
  }
);
