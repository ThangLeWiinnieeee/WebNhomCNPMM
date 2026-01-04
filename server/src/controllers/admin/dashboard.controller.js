/**
 * Admin Dashboard Controller
 * Xử lý các request liên quan đến dashboard statistics
 * Location: server/src/controllers/admin/dashboard.controller.js
 */

import {
  getCompleteDashboardStats,
  getMonthlyRevenue,
  getRevenueOverview,
  getNewCustomersStats,
  getTopProducts,
  getRecentSuccessfulOrders,
  getOrderStatusStats,
} from '../../helpers/dashboard.helper.js';

class DashboardController {
  /**
   * GET /api/admin/dashboard/complete-stats
   * Lấy tất cả thống kê (optimization - 1 lần call)
   */
  async getCompleteDashboardStats(req, res) {
    try {
      const stats = await getCompleteDashboardStats();

      return res.status(200).json({
        success: true,
        data: stats,
        message: 'Dashboard stats retrieved successfully',
      });
    } catch (error) {
      console.error('Dashboard stats error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard stats',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/admin/dashboard/revenue-overview
   * Lấy tổng doanh thu (hôm nay, tháng này, năm này)
   */
  async getRevenueOverview(req, res) {
    try {
      const overview = await getRevenueOverview();

      return res.status(200).json({
        success: true,
        data: overview,
      });
    } catch (error) {
      console.error('Revenue overview error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch revenue overview',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/admin/dashboard/monthly-revenue
   * Lấy doanh thu theo từng tháng (12 tháng gần nhất)
   */
  async getMonthlyRevenueChart(req, res) {
    try {
      const monthlyData = await getMonthlyRevenue();

      return res.status(200).json({
        success: true,
        data: {
          labels: monthlyData.map(item => item.month),
          datasets: [
            {
              label: 'Revenue (VND)',
              data: monthlyData.map(item => item.revenue),
              borderColor: '#4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Orders',
              data: monthlyData.map(item => item.orders),
              borderColor: '#2196F3',
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        rawData: monthlyData, // Dữ liệu raw để xử lý khác nếu cần
      });
    } catch (error) {
      console.error('Monthly revenue error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch monthly revenue',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/admin/dashboard/new-customers
   * Lấy thống kê khách hàng mới
   */
  async getNewCustomersStats(req, res) {
    try {
      const stats = await getNewCustomersStats();

      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('New customers stats error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch new customers stats',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/admin/dashboard/top-products
   * Lấy Top N sản phẩm bán chạy nhất
   * Query: ?limit=10 (default: 10)
   */
  async getTopProducts(req, res) {
    try {
      const limit = Math.min(parseInt(req.query.limit) || 10, 50); // Max 50 để không quá nặng
      const products = await getTopProducts(limit);

      return res.status(200).json({
        success: true,
        data: products,
        count: products.length,
      });
    } catch (error) {
      console.error('Top products error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch top products',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/admin/dashboard/recent-orders
   * Lấy danh sách đơn hàng đã giao gần nhất
   * Query: ?limit=5 (default: 5)
   */
  async getRecentSuccessfulOrders(req, res) {
    try {
      const limit = Math.min(parseInt(req.query.limit) || 5, 20); // Max 20
      const orders = await getRecentSuccessfulOrders(limit);

      return res.status(200).json({
        success: true,
        data: orders,
        count: orders.length,
      });
    } catch (error) {
      console.error('Recent orders error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch recent orders',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/admin/dashboard/order-status-stats
   * Lấy thống kê đơn hàng theo trạng thái
   */
  async getOrderStatusStats(req, res) {
    try {
      const stats = await getOrderStatusStats();

      // Map status thành tên hiển thị
      const statusMap = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        processing: 'Processing',
        completed: 'Completed',
        cancelled: 'Cancelled',
      };

      const mappedStats = stats.map(item => ({
        status: item._id,
        statusLabel: statusMap[item._id] || item._id,
        count: item.count,
        revenue: item.totalRevenue,
      }));

      return res.status(200).json({
        success: true,
        data: mappedStats,
      });
    } catch (error) {
      console.error('Order status stats error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch order status stats',
        error: error.message,
      });
    }
  }
}

export default new DashboardController();
