import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig.js';

// Get Cart
export const getCartThunk = createAsyncThunk(
  'cart/getCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Không có token, trả về cart rỗng
        return { items: [], totalPrice: 0, tax: 0, discount: 0, finalTotal: 0 };
      }
      const response = await api.get('/cart');
      return response;
    } catch (error) {
      if (error.response?.status === 401) {
        // Token hết hạn hoặc không hợp lệ, trả về cart rỗng
        return { items: [], totalPrice: 0, tax: 0, discount: 0, finalTotal: 0 };
      }
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy giỏ hàng');
    }
  }
);

// Add to Cart
export const addToCartThunk = createAsyncThunk(
  'cart/addToCart',
  async (cartData, { rejectWithValue }) => {
    try {
      const response = await api.post('/cart/add', cartData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi thêm vào giỏ hàng');
    }
  }
);

// Update Cart Item
export const updateCartItemThunk = createAsyncThunk(
  'cart/updateItem',
  async ({ itemId, ...updateData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/update/${itemId}`, updateData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Loi khi cap nhat gio hang');
    }
  }
);

// Remove from Cart
export const removeFromCartThunk = createAsyncThunk(
  'cart/removeItem',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/remove/${itemId}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa sản phẩm');
    }
  }
);

// Clear Cart
export const clearCartThunk = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete('/cart/clear');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa giỏ hàng');
    }
  }
);

// Apply Discount
export const applyDiscountThunk = createAsyncThunk(
  'cart/applyDiscount',
  async (discountAmount, { rejectWithValue }) => {
    try {
      const response = await api.put('/cart/applyDiscount', { discountAmount });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi áp dụng giảm giá');
    }
  }
);

// Update Notes
export const updateNotesThunk = createAsyncThunk(
  'cart/updateNotes',
  async (notes, { rejectWithValue }) => {
    try {
      const response = await api.put('/cart/notes', { notes });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi cập nhật ghi chú');
    }
  }
);

// Get Cart Count
export const getCartCountThunk = createAsyncThunk(
  'cart/getCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/cart/count');
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi lấy số lượng giỏ hàng');
    }
  }
);
