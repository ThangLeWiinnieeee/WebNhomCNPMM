import express from 'express';
// User routes
import userRoutes from './user/user.route.js';
import authRoutes from './user/auth.route.js';
import cartRoutes from './user/cart.route.js';
import publicCategoryRoutes from './user/category.route.js';
import publicProductRoutes from './user/product.route.js';
import userOrderRoutes from './user/order.route.js';
import weddingPackageRoutes from './user/wedding-package.route.js';
import productCommentRoutes from './user/product-comment.route.js';
import productViewRoutes from './user/product-view.route.js';
import wishlistRoutes from './user/wishlist.route.js';
import publicSettingsRoutes from './user/settings.route.js';
// Admin routes
import adminDashboardRoutes from './admin/dashboard.route.js';
import adminStatisticsRoutes from './admin/statistics.route.js';
import adminOrderRoutes from './admin/order.route.js';
import adminProductRoutes from './admin/product.route.js';
import adminCategoryRoutes from './admin/category.route.js';
import adminWeddingPackageRoutes from './admin/wedding-package.route.js';
import adminSettingsRoutes from './admin/settings.route.js';
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
router.use('/wedding-packages', weddingPackageRoutes); // Public wedding package routes
router.use('/', productCommentRoutes); // Product comment routes (mixed public/private)
router.use('/', productViewRoutes); // Product view routes
router.use('/', wishlistRoutes); // Wishlist routes
router.use('/settings', publicSettingsRoutes); // Public settings routes

// Admin routes
router.use('/admin/dashboard', adminDashboardRoutes);
router.use('/admin/statistics', adminStatisticsRoutes);
router.use('/admin/orders', adminOrderRoutes);
router.use('/admin/products', adminProductRoutes);
router.use('/admin/categories', adminCategoryRoutes);
router.use('/admin/wedding-packages', adminWeddingPackageRoutes);
router.use('/admin/settings', adminSettingsRoutes);

// Payment routes
router.use('/payment', paymentRoutes);

// Shared routes
router.use('/upload', uploadRoutes);

export default router;