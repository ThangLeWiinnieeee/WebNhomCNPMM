import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

/**
 * Lấy tất cả gói tiệc với pagination và filters
 * @param {Object} params - Tham số filter và pagination
 * @returns {Promise} Danh sách gói tiệc
 */
export const fetchAllPackagesThunk = createAsyncThunk(
  'weddingPackage/fetchAllPackages',
  async ({ 
    page = 1, 
    limit = 16, 
    search = '', 
    minPrice = null,
    maxPrice = null,
    sortBy = '',
  }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) {
        params.append('search', search);
      }
      
      if (minPrice !== null && minPrice !== '') {
        params.append('minPrice', minPrice.toString());
      }
      
      if (maxPrice !== null && maxPrice !== '') {
        params.append('maxPrice', maxPrice.toString());
      }
      
      if (sortBy) {
        params.append('sortBy', sortBy);
      }
      
      const response = await api.get(`/wedding-packages?${params.toString()}`);
      
      if (response.code === 'error') {
        return rejectWithValue(response.message || 'Lấy danh sách gói tiệc thất bại');
      }
      
      return {
        packages: response.data || [],
        pagination: response.pagination || {},
      };
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Lỗi khi lấy danh sách gói tiệc';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Lấy chi tiết gói tiệc theo ID
 * @param {string} packageId - ID của gói tiệc
 * @returns {Promise} Thông tin chi tiết gói tiệc
 */
export const fetchPackageByIdThunk = createAsyncThunk(
  'weddingPackage/fetchPackageById',
  async (packageId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/wedding-packages/${packageId}`);
      
      if (response.code === 'error') {
        return rejectWithValue(response.message || 'Lấy thông tin gói tiệc thất bại');
      }
      
      return response.data || response;
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Lỗi khi lấy thông tin gói tiệc';
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Lấy danh sách gói tiệc tương tự
 * @param {string} packageId - ID của gói tiệc hiện tại
 * @param {number} limit - Số lượng gói tương tự muốn lấy
 * @returns {Promise} Danh sách gói tiệc tương tự
 */
export const fetchSimilarPackagesThunk = createAsyncThunk(
  'weddingPackage/fetchSimilarPackages',
  async ({ packageId, limit = 4 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
      });
      
      const response = await api.get(`/wedding-packages/${packageId}/similar?${params.toString()}`);
      
      if (response.code === 'error') {
        return rejectWithValue(response.message || 'Lấy danh sách gói tiệc tương tự thất bại');
      }
      
      return {
        packages: response.data || [],
      };
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Lỗi khi lấy danh sách gói tiệc tương tự';
      return rejectWithValue(errorMessage);
    }
  }
);
