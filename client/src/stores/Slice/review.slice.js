import { createSlice } from '@reduxjs/toolkit';
import { submitReviewThunk, fetchReviewThunk } from '../thunks/review.thunk';

const initialState = {
  reviews: [],
  existingReview: null, // Add this for single review display
  points: 0,
  coupon: null,
  loading: false,
  error: null,
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearReward: (state) => {
      state.points = 0;
      state.coupon = null;
    },
    setExistingReview: (state, action) => { // Optional reducer for manual set
      state.existingReview = action.payload;
    },
    clearExistingReview: (state) => {
      state.existingReview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit review
      .addCase(submitReviewThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitReviewThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data?.review) {
          state.existingReview = action.payload.data.review; // Set the new review
          state.reviews.push(action.payload.data.review); // Optional: add to list
        }
        state.points = action.payload.data.points;
        state.coupon = action.payload.data.coupon;
      })
      .addCase(submitReviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // Fetch existing review
      .addCase(fetchReviewThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.existingReview = action.payload; // Direct assignment since thunk returns review directly
      })
      .addCase(fetchReviewThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearError, clearReward, setExistingReview, clearExistingReview } = reviewSlice.actions;
export default reviewSlice.reducer;