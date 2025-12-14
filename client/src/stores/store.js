import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './Slice/authSlice';
import cartReducer from './Slice/cartSlice';
import orderReducer from './Slice/orderSlice';
import productReducer from './Slice/productSlice';
import categoryReducer from './Slice/categorySlice';
import paymentReducer from './Slice/paymentSlice';
import weddingPackageReducer from './Slice/weddingPackageSlice';
import settingsReducer from './Slice/settingsSlice';

// Cáºu hÃnh persist cho auth slice
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated'], // Chá persist user, token, isAuthenticated
};

// Táºo persisted reducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Configure store
export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    cart: cartReducer,
    order: orderReducer,
    product: productReducer,
    category: categoryReducer,
    payment: paymentReducer,
    weddingPackage: weddingPackageReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Táºo persistor
export const persistor = persistStore(store);
