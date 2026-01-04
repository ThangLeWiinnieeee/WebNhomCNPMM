/**
 * Admin Dashboard Routes
 * Location: server/src/routes/admin/dashboard.route.js
 */

import express from 'express';
import dashboardController from '../../controllers/admin/dashboard.controller.js';
import { requireAdmin } from '../../middlewares/admin/admin.middleware.js';

const router = express.Router();

// Middleware: Verify admin role
router.use(requireAdmin);

/**
 * @route   GET /api/admin/dashboard/complete-stats
 * @desc    Get all dashboard statistics in one call (optimized)
 * @access  Private (Admin only)
 */
router.get('/complete-stats', dashboardController.getCompleteDashboardStats);

/**
 * @route   GET /api/admin/dashboard/revenue-overview
 * @desc    Get revenue overview (today, month, year)
 * @access  Private (Admin only)
 */
router.get('/revenue-overview', dashboardController.getRevenueOverview);

/**
 * @route   GET /api/admin/dashboard/monthly-revenue
 * @desc    Get monthly revenue chart data (12 months)
 * @access  Private (Admin only)
 */
router.get('/monthly-revenue', dashboardController.getMonthlyRevenueChart);

/**
 * @route   GET /api/admin/dashboard/new-customers
 * @desc    Get new customers statistics
 * @access  Private (Admin only)
 */
router.get('/new-customers', dashboardController.getNewCustomersStats);

/**
 * @route   GET /api/admin/dashboard/top-products
 * @desc    Get top selling products
 * @access  Private (Admin only)
 * @query   limit - Number of products (default: 10, max: 50)
 */
router.get('/top-products', dashboardController.getTopProducts);

/**
 * @route   GET /api/admin/dashboard/recent-orders
 * @desc    Get recent successful orders
 * @access  Private (Admin only)
 * @query   limit - Number of orders (default: 5, max: 20)
 */
router.get('/recent-orders', dashboardController.getRecentSuccessfulOrders);

/**
 * @route   GET /api/admin/dashboard/order-status-stats
 * @desc    Get orders grouped by status
 * @access  Private (Admin only)
 */
router.get('/order-status-stats', dashboardController.getOrderStatusStats);

export default router;
