import { createSlice } from '@reduxjs/toolkit';
import {
  getCartThunk,
  addToCartThunk,
  updateCartItemThunk,
  removeFromCartThunk,
  clearCartThunk,
  applyDiscountThunk,
  updateNotesThunk,
  getCartCountThunk
} from '../thunks/cartThunks.js';

const initialState = {
  items: [],
  totalPrice: 0,
  tax: 0,
  discount: 0,
  finalTotal: 0,
  notes: '',
  cartCount: 0,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  extraReducers: (builder) => {
    // Get Cart
    builder
      .addCase(getCartThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCartThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.cart.items;
        state.totalPrice = action.payload.cart.totalPrice;
        state.tax = action.payload.cart.tax;
        state.discount = action.payload.cart.discount;
        state.finalTotal = action.payload.cart.finalTotal;
        state.notes = action.payload.cart.notes || '';
        // Hiển thị số dịch vụ (distinct items)
        state.cartCount = action.payload.cart.items.length;
        state.error = null;
      })
      .addCase(getCartThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Add to Cart
    builder
      .addCase(addToCartThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.cart.items;
        state.totalPrice = action.payload.cart.totalPrice;
        state.tax = action.payload.cart.tax;
        state.discount = action.payload.cart.discount;
        state.finalTotal = action.payload.cart.finalTotal;
        state.cartCount = action.payload.cart.items.length;
        state.error = null;
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Update Cart Item
    builder
      .addCase(updateCartItemThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCartItemThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.cart.items;
        state.totalPrice = action.payload.cart.totalPrice;
        state.tax = action.payload.cart.tax;
        state.discount = action.payload.cart.discount;
        state.finalTotal = action.payload.cart.finalTotal;
        state.cartCount = action.payload.cart.items.length;
        state.error = null;
      })
      .addCase(updateCartItemThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Remove from Cart
    builder
      .addCase(removeFromCartThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeFromCartThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.cart.items;
        state.totalPrice = action.payload.cart.totalPrice;
        state.tax = action.payload.cart.tax;
        state.discount = action.payload.cart.discount;
        state.finalTotal = action.payload.cart.finalTotal;
        state.cartCount = action.payload.cart.items.length;
        state.error = null;
      })
      .addCase(removeFromCartThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Clear Cart
    builder
      .addCase(clearCartThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(clearCartThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = [];
        state.totalPrice = 0;
        state.tax = 0;
        state.discount = 0;
        state.finalTotal = 0;
        state.cartCount = 0;
        state.error = null;
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Apply Discount
    builder
      .addCase(applyDiscountThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(applyDiscountThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.discount = action.payload.cart.discount;
        state.finalTotal = action.payload.cart.finalTotal;
        state.error = null;
      })
      .addCase(applyDiscountThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Update Notes
    builder
      .addCase(updateNotesThunk.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateNotesThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notes = action.payload.cart.notes;
        state.error = null;
      })
      .addCase(updateNotesThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // Get Cart Count
    builder
      .addCase(getCartCountThunk.fulfilled, (state, action) => {
        state.cartCount = action.payload.count;
      });
  }
});

export default cartSlice.reducer;
