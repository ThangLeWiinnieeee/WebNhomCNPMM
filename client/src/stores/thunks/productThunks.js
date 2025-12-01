import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig';

// Lấy 8 sản phẩm mới nhất
export const fetchNewestProductsThunk = createAsyncThunk(
  'product/fetchNewestProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/newest');
      
      if (response.code === 'error') {
        return rejectWithValue(response.message || 'Lấy sản phẩm mới nhất thất bại');
      }
      
      return response.data || response;
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Lỗi khi lấy sản phẩm mới nhất';
      return rejectWithValue(errorMessage);
    }
  }
);

// Lấy 6 sản phẩm bán chạy nhất
export const fetchBestSellingProductsThunk = createAsyncThunk(
  'product/fetchBestSellingProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/best-selling');
      
      if (response.code === 'error') {
        return rejectWithValue(response.message || 'Lấy sản phẩm bán chạy thất bại');
      }
      
      return response.data || response;
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Lỗi khi lấy sản phẩm bán chạy';
      return rejectWithValue(errorMessage);
    }
  }
);

// Lấy 8 sản phẩm xem nhiều nhất
export const fetchMostViewedProductsThunk = createAsyncThunk(
  'product/fetchMostViewedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/most-viewed');
      
      if (response.code === 'error') {
        return rejectWithValue(response.message || 'Lấy sản phẩm xem nhiều thất bại');
      }
      
      return response.data || response;
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Lỗi khi lấy sản phẩm xem nhiều';
      return rejectWithValue(errorMessage);
    }
  }
);

// Lấy 4 sản phẩm khuyến mãi cao nhất
export const fetchPromotionProductsThunk = createAsyncThunk(
  'product/fetchPromotionProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products/promotion');
      
      if (response.code === 'error') {
        return rejectWithValue(response.message || 'Lấy sản phẩm khuyến mãi thất bại');
      }
      console.log(response);
      return response.data || response;
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Lỗi khi lấy sản phẩm khuyến mãi';
      return rejectWithValue(errorMessage);
    }
  }
);

// Lấy tất cả sản phẩm với pagination và filters
export const fetchAllProductsThunk = createAsyncThunk(
  'product/fetchAllProducts',
  async ({ 
    page = 1, 
    limit = 16, 
    filter = 'all', 
    search = '', 
    categoryId = null,
    minPrice = null,
    maxPrice = null,
    sortBy = '',
  }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        filter,
      });
      
      if (search) {
        params.append('search', search);
      }
      
      if (categoryId) {
        params.append('categoryId', categoryId);
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
      
      const response = await api.get(`/products?${params.toString()}`);
      
      if (response.code === 'error') {
        return rejectWithValue(response.message || 'Lấy danh sách sản phẩm thất bại');
      }
      
      return {
        products: response.data || [],
        pagination: response.pagination || {},
      };
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Lỗi khi lấy danh sách sản phẩm';
      return rejectWithValue(errorMessage);
    }
  }
);

// Lấy chi tiết sản phẩm theo ID
export const fetchProductByIdThunk = createAsyncThunk(
  'product/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${productId}`);
      
      if (response.code === 'error') {
        return rejectWithValue(response.message || 'Lấy thông tin sản phẩm thất bại');
      }
      
      return response.data || response;
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Lỗi khi lấy thông tin sản phẩm';
      return rejectWithValue(errorMessage);
    }
  }
);

// Tìm kiếm sản phẩm
export const searchProductsThunk = createAsyncThunk(
  'product/searchProducts',
  async ({ q, page = 1, limit = 16 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        q,
        page: page.toString(),
        limit: limit.toString(),
      });
      
      const response = await api.get(`/products/search?${params.toString()}`);
      
      if (response.code === 'error') {
        return rejectWithValue(response.message || 'Tìm kiếm sản phẩm thất bại');
      }
      
      return {
        products: response.data || [],
        pagination: response.pagination || {},
      };
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Lỗi khi tìm kiếm sản phẩm';
      return rejectWithValue(errorMessage);
    }
  }
);

// Lấy sản phẩm theo danh mục
export const fetchProductsByCategoryThunk = createAsyncThunk(
  'product/fetchProductsByCategory',
  async ({ categoryId, page = 1, limit = 16 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      const response = await api.get(`/products/category/${categoryId}?${params.toString()}`);
      
      if (response.code === 'error') {
        return rejectWithValue(response.message || 'Lấy sản phẩm theo danh mục thất bại');
      }
      
      return {
        products: response.data || [],
        pagination: response.pagination || {},
      };
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Lỗi khi lấy sản phẩm theo danh mục';
      return rejectWithValue(errorMessage);
    }
  }
);

// Lấy sản phẩm liên quan (cùng category, loại trừ product hiện tại)
export const fetchRelatedProductsThunk = createAsyncThunk(
  'product/fetchRelatedProducts',
  async ({ productId, limit = 3 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
      });
      
      const response = await api.get(`/products/${productId}/related?${params.toString()}`);
      
      if (response.code === 'error') {
        return rejectWithValue(response.message || 'Lấy sản phẩm liên quan thất bại');
      }
      
      return response.data || [];
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Lỗi khi lấy sản phẩm liên quan';
      return rejectWithValue(errorMessage);
    }
  }
);

// Lấy tất cả danh mục
export const fetchAllCategoriesThunk = createAsyncThunk(
  'product/fetchAllCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/categories');
      
      if (response.code === 'error') {
        return rejectWithValue(response.message || 'Lấy danh sách danh mục thất bại');
      }
      
      return response.data || response;
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || 'Lỗi khi lấy danh sách danh mục';
      return rejectWithValue(errorMessage);
    }
  }
);

