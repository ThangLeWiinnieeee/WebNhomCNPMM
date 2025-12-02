import { createSlice } from '@reduxjs/toolkit';
import {
  fetchNewestProductsThunk,
  fetchBestSellingProductsThunk,
  fetchMostViewedProductsThunk,
  fetchPromotionProductsThunk,
  fetchAllProductsThunk,
  fetchProductByIdThunk,
  fetchRelatedProductsThunk,
  searchProductsThunk,
  fetchProductsByCategoryThunk,
  fetchAllCategoriesThunk,
} from '../thunks/productThunks';

const productSlice = createSlice({
  name: 'product',
  initialState: {
    newestProducts: [],
    bestSellingProducts: [],
    mostViewedProducts: [],
    promotionProducts: [],
    allProducts: [],
    currentProduct: null,
    relatedProducts: [],
    categories: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 16,
      total: 0,
      totalPages: 0,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // ============ FETCH NEWEST PRODUCTS ============
      .addCase(fetchNewestProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewestProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.newestProducts = action.payload;
        state.error = null;
      })
      .addCase(fetchNewestProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ FETCH BEST SELLING PRODUCTS ============
      .addCase(fetchBestSellingProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBestSellingProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.bestSellingProducts = action.payload;
        state.error = null;
      })
      .addCase(fetchBestSellingProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ FETCH MOST VIEWED PRODUCTS ============
      .addCase(fetchMostViewedProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMostViewedProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.mostViewedProducts = action.payload;
        state.error = null;
      })
      .addCase(fetchMostViewedProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ FETCH PROMOTION PRODUCTS ============
      .addCase(fetchPromotionProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromotionProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.promotionProducts = action.payload;
        state.error = null;
      })
      .addCase(fetchPromotionProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ FETCH ALL PRODUCTS ============
      .addCase(fetchAllProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.allProducts = action.payload.products || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.error = null;
      })
      .addCase(fetchAllProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ FETCH PRODUCT BY ID ============
      .addCase(fetchProductByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
        state.error = null;
        // Clear related products when product changes
        state.relatedProducts = [];
      })
      .addCase(fetchProductByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ FETCH RELATED PRODUCTS ============
      .addCase(fetchRelatedProductsThunk.pending, (state) => {
        // Don't set loading to true to avoid blocking UI
        state.error = null;
      })
      .addCase(fetchRelatedProductsThunk.fulfilled, (state, action) => {
        state.relatedProducts = action.payload;
        state.error = null;
      })
      .addCase(fetchRelatedProductsThunk.rejected, (state, action) => {
        state.relatedProducts = [];
        // Don't set error for related products to avoid showing error toast
      })

      // ============ SEARCH PRODUCTS ============
      .addCase(searchProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.allProducts = action.payload.products || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.error = null;
      })
      .addCase(searchProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ FETCH PRODUCTS BY CATEGORY ============
      .addCase(fetchProductsByCategoryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategoryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.allProducts = action.payload.products || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.error = null;
      })
      .addCase(fetchProductsByCategoryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ FETCH ALL CATEGORIES ============
      .addCase(fetchAllCategoriesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategoriesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.error = null;
      })
      .addCase(fetchAllCategoriesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentProduct, setPagination } = productSlice.actions;
export default productSlice.reducer;

