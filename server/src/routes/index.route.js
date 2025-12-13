import express from 'express';
// User routes
import userRoutes from './user/user.route.js';
import authRoutes from './user/auth.route.js';
import cartRoutes from './user/cart.route.js';
import publicCategoryRoutes from './user/category.route.js';
import publicProductRoutes from './user/product.route.js';
import userOrderRoutes from './user/order.route.js';
// Admin routes
import adminOrderRoutes from './admin/order.route.js';
import adminProductRoutes from './admin/product.route.js';
import adminCategoryRoutes from './admin/category.route.js';
// Shared routes
import uploadRoutes from './upload.route.js';
import paymentRoutes from './payment.route.js';

const router = express.Router();

// User routes
router.use('/user', userRoutes);
router.use('/account', authRoutes);
router.use('/cart', cartRoutes);
router.use('/categories', publicCategoryRoutes); // Public category routes
router.use('/products', publicProductRoutes); // Public product routes
router.use('/orders', userOrderRoutes); // User order routes

// Admin routes
router.use('/admin/orders', adminOrderRoutes);
router.use('/admin/products', adminProductRoutes);
router.use('/admin/categories', adminCategoryRoutes);

// Payment routes
router.use('/payment', paymentRoutes);

// Shared routes
router.use('/upload', uploadRoutes);

export default router;