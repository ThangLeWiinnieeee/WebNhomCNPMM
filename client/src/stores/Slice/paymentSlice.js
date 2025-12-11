import { createSlice } from '@reduxjs/toolkit';
import { createZaloPayPaymentThunk, checkZaloPayStatusThunk } from '../thunks/paymentThunks.js';

const initialState = {
  paymentData: null,
  paymentStatus: 'idle', // 'idle', 'pending', 'succeeded', 'failed'
  paymentError: null,
  statusCheckLoading: false,
  statusCheckError: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.paymentError = null;
    },
    resetPaymentState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Create ZaloPay Payment
    builder
      .addCase(createZaloPayPaymentThunk.pending, (state) => {
        state.paymentStatus = 'pending';
        state.paymentError = null;
      })
      .addCase(createZaloPayPaymentThunk.fulfilled, (state, action) => {
        state.paymentStatus = 'succeeded';
        state.paymentData = action.payload;
        state.paymentError = null;
      })
      .addCase(createZaloPayPaymentThunk.rejected, (state, action) => {
        state.paymentStatus = 'failed';
        state.paymentError = action.payload;
        state.paymentData = null;
      });

    // Check ZaloPay Status
    builder
      .addCase(checkZaloPayStatusThunk.pending, (state) => {
        state.statusCheckLoading = true;
        state.statusCheckError = null;
      })
      .addCase(checkZaloPayStatusThunk.fulfilled, (state, action) => {
        state.statusCheckLoading = false;
        state.paymentData = action.payload;
        state.statusCheckError = null;
      })
      .addCase(checkZaloPayStatusThunk.rejected, (state, action) => {
        state.statusCheckLoading = false;
        state.statusCheckError = action.payload;
      });
  },
});

export const { clearPaymentError, resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
