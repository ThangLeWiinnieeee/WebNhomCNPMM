import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

/**
 * Fetch all categories (Admin)
 */
export const fetchCategoriesThunk = createAsyncThunk(
  'category/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/categories');
      if (response.code === 'success') {
        return response.data;
      }
      return rejectWithValue(response.message || 'Lỗi khi tải danh mục');
    } catch (error) {
      return rejectWithValue(error?.message || 'Lỗi khi tải danh mục');
    }
  }
);

/**
 * Create new category (Admin)
 */
export const createCategoryThunk = createAsyncThunk(
  'category/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/categories', categoryData);
      if (response.code === 'success') {
        return response.data;
      }
      return rejectWithValue(response.message || 'Lỗi khi tạo danh mục');
    } catch (error) {
      return rejectWithValue(error?.message || 'Lỗi khi tạo danh mục');
    }
  }
);

/**
 * Update category (Admin)
 */
export const updateCategoryThunk = createAsyncThunk(
  'category/updateCategory',
  async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/categories/${categoryId}`, categoryData);
      if (response.code === 'success') {
        return response.data;
      }
      return rejectWithValue(response.message || 'Lỗi khi cập nhật danh mục');
    } catch (error) {
      return rejectWithValue(error?.message || 'Lỗi khi cập nhật danh mục');
    }
  }
);

/**
 * Delete category (Admin)
 */
export const deleteCategoryThunk = createAsyncThunk(
  'category/deleteCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/admin/categories/${categoryId}`);
      if (response.code === 'success') {
        return categoryId;
      }
      return rejectWithValue(response.message || 'Lỗi khi xóa danh mục');
    } catch (error) {
      return rejectWithValue(error?.message || 'Lỗi khi xóa danh mục');
    }
  }
);

/**
 * Toggle category active status (Admin)
 */
export const toggleCategoryStatusThunk = createAsyncThunk(
  'category/toggleCategoryStatus',
  async ({ categoryId, isActive }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/categories/${categoryId}`, {
        isActive
      });
      if (response.code === 'success') {
        return response.data;
      }
      return rejectWithValue(response.message || 'Lỗi khi cập nhật trạng thái danh mục');
    } catch (error) {
      return rejectWithValue(error?.message || 'Lỗi khi cập nhật trạng thái danh mục');
    }
  }
);
