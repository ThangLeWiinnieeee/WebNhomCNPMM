import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllPackagesThunk,
  fetchPackageByIdThunk,
  fetchSimilarPackagesThunk,
} from '../thunks/weddingPackageThunks';

const weddingPackageSlice = createSlice({
  name: 'weddingPackage',
  initialState: {
    allPackages: [],
    currentPackage: null,
    similarPackages: [],
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
    clearCurrentPackage: (state) => {
      state.currentPackage = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // ============ FETCH ALL PACKAGES ============
      .addCase(fetchAllPackagesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPackagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.allPackages = action.payload.packages || action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
        state.error = null;
      })
      .addCase(fetchAllPackagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ FETCH PACKAGE BY ID ============
      .addCase(fetchPackageByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackageByIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPackage = action.payload.package || action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(fetchPackageByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ============ FETCH SIMILAR PACKAGES ============
      .addCase(fetchSimilarPackagesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarPackagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.similarPackages = action.payload.packages || action.payload.data || [];
        state.error = null;
      })
      .addCase(fetchSimilarPackagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentPackage, setPagination } = weddingPackageSlice.actions;
export default weddingPackageSlice.reducer;
