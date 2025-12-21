/**
 * Admin Statistics Routes
 * Location: server/src/routes/admin/statistics.route.js
 */

import express from 'express';
import statisticsController from '../../controllers/admin/statistics.controller.js';
import { requireAdmin } from '../../middlewares/admin/admin.middleware.js';

const router = express.Router();

// Middleware: Verify admin role
router.use(requireAdmin);

/**
 * @route   GET /api/admin/statistics/revenue-sales
 * @desc    Get revenue sales (successful orders) with pagination
 * @access  Private (Admin only)
 * @query   startDate, endDate, page, limit
 */
router.get('/revenue-sales', statisticsController.getRevenueSales);

/**
 * @route   GET /api/admin/statistics/top-products
 * @desc    Get top 10 best-selling products
 * @access  Private (Admin only)
 * @query   limit, startDate, endDate
 */
router.get('/top-products', statisticsController.getTopProducts);

/**
 * @route   GET /api/admin/statistics/cash-flow
 * @desc    Get cash flow statistics (pending, deposit, fullPayment payments)
 * @access  Private (Admin only)
 */
router.get('/cash-flow', statisticsController.getCashFlow);

/**
 * @route   GET /api/admin/statistics/new-customers
 * @desc    Get new customers statistics
 * @access  Private (Admin only)
 * @query   startDate, endDate
 */
router.get('/new-customers', statisticsController.getNewCustomers);

/**
 * @route   GET /api/admin/statistics/summary
 * @desc    Get statistics summary (for dashboard)
 * @access  Private (Admin only)
 */
router.get('/summary', statisticsController.getSummary);

/**
 * @route   GET /api/admin/statistics/monthly-revenue
 * @desc    Get monthly revenue chart (12 months) for Statistics page
 * @access  Private (Admin only)
 */
router.get('/monthly-revenue', statisticsController.getMonthlyRevenue);

export default router;
