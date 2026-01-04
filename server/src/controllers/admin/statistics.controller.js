/**
 * Admin Statistics Controller
 * Xử lý các request liên quan đến thống kê & báo cáo
 * Location: server/src/controllers/admin/statistics.controller.js
 */

import Order from '../../models/order.model.js';
import Product from '../../models/product.model.js';
import User from '../../models/user.model.js';

class StatisticsController {
  /**
   * GET /api/admin/statistics/revenue-sales
   * Lấy danh sách doanh thu bán hàng (đơn hàng đã giao thành công)
   * Query params: startDate, endDate, page, limit
   */
  async getRevenueSales(req, res) {
    try {
      const { startDate, endDate, page = 1, limit = 10 } = req.query;
      
      // Build match query
      const matchQuery = { orderStatus: 'completed' };
      
      // Add date filter if provided
      if (startDate || endDate) {
        const dateRangeCondition = {};
        if (startDate) dateRangeCondition.$gte = new Date(startDate);
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          dateRangeCondition.$lte = end;
        }
        
        // Match orders where completedAt, updatedAt, or createdAt is in range
        matchQuery.$or = [
          { completedAt: dateRangeCondition },
          { updatedAt: dateRangeCondition },
          { createdAt: dateRangeCondition }
        ];
        matchQuery.orderStatus = 'completed'; // Keep status check
      }

      // Get total count
      const total = await Order.countDocuments(matchQuery);

      // Get paginated orders with fallback date field
      const orders = await Order.aggregate([
        { $match: matchQuery },
        {
          $addFields: {
            dateForDisplay: {
              $cond: [
                { $ne: ['$completedAt', null] },
                '$completedAt',
                { $cond: [{ $ne: ['$updatedAt', null] }, '$updatedAt', '$createdAt'] }
              ]
            }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $project: {
            _id: 1,
            orderID: 1,
            customerInfo: 1,
            finalTotal: 1,
            items: 1,
            itemCount: { $size: '$items' },
            paymentMethod: 1,
            orderStatus: 1,
            completedAt: 1,
            createdAt: 1,
            updatedAt: 1,
            dateForDisplay: 1,
            userName: { $arrayElemAt: ['$userDetails.fullname', 0] },
          },
        },
        { $sort: { dateForDisplay: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: parseInt(limit) },
      ]);

      // Calculate total revenue
      const totalRevenue = await Order.aggregate([
        { $match: matchQuery },
        { $group: { _id: null, total: { $sum: '$finalTotal' } } },
      ]);

      return res.status(200).json({
        success: true,
        data: {
          orders,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / limit),
          },
          totalRevenue: totalRevenue[0]?.total || 0,
        },
      });
    } catch (error) {
      console.error('Error fetching revenue sales:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch revenue sales',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/admin/statistics/top-products
   * Lấy top 10 sản phẩm bán nhiều nhất
   * Query params: limit (default: 10), startDate, endDate
   */
  async getTopProducts(req, res) {
    try {
      const { limit = 10, startDate, endDate } = req.query;

      // Build match query for orders
      const matchQuery = { orderStatus: 'completed' };
      
      if (startDate || endDate) {
        const dateRangeCondition = {};
        if (startDate) dateRangeCondition.$gte = new Date(startDate);
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          dateRangeCondition.$lte = end;
        }
        
        // Match orders where completedAt, updatedAt, or createdAt is in range
        matchQuery.$or = [
          { completedAt: dateRangeCondition },
          { updatedAt: dateRangeCondition },
          { createdAt: dateRangeCondition }
        ];
        matchQuery.orderStatus = 'completed';
      }

      // Get top products from completed orders
      const topProducts = await Order.aggregate([
        { $match: matchQuery },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.serviceId',
            productName: { $first: '$items.serviceName' },
            unitsSold: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
            avgPrice: { $avg: '$items.price' },
            orderCount: { $sum: 1 }, // Count how many orders contain this product
          },
        },
        { $sort: { totalRevenue: -1, unitsSold: -1 } },
        { $limit: parseInt(limit) },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'productDetails',
          },
        },
        {
          $project: {
            _id: 1,
            productId: '$_id',
            productName: 1,
            category: { $arrayElemAt: ['$productDetails.category', 0] },
            unitsSold: 1,
            totalRevenue: 1,
            avgPrice: 1,
            orderCount: 1,
          },
        },
      ]);

      return res.status(200).json({
        success: true,
        data: { topProducts },
      });
    } catch (error) {
      console.error('Error fetching top products:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch top products',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/admin/statistics/new-customers
   * Lấy thống kê khách hàng mới
   * Query params: startDate, endDate
   */
  async getNewCustomers(req, res) {
    try {
      const { startDate, endDate } = req.query;

      // Build match query
      const matchQuery = {};
      if (startDate || endDate) {
        matchQuery.createdAt = {};
        if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          matchQuery.createdAt.$lte = end;
        }
      }

      // Get new customers in period
      const newCustomersData = await User.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: null,
            totalNewCustomers: { $sum: 1 },
          },
        },
      ]);

      // Get last month comparison (only if not using date filters)
      const now = new Date();
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const lastMonthNewCustomers = await User.countDocuments({
        createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
      });

      // Get this month (only if not using date filters)
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const thisMonthNewCustomers = await User.countDocuments({
        createdAt: { $gte: thisMonthStart },
      });

      // Calculate growth rate
      const growthRate = lastMonthNewCustomers !== 0 
        ? ((thisMonthNewCustomers - lastMonthNewCustomers) / lastMonthNewCustomers) * 100
        : 0;

      return res.status(200).json({
        success: true,
        data: {
          newCustomers: {
            total: newCustomersData[0]?.totalNewCustomers || 0,
            thisMonth: thisMonthNewCustomers,
            lastMonth: lastMonthNewCustomers,
            growthRate: parseFloat(growthRate.toFixed(2)),
          },
        },
      });
    } catch (error) {
      console.error('Error fetching new customers:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch new customers',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/admin/statistics/cash-flow
   * Lấy thống kê dòng tiền (pending, deposit, fullPayment)
   * Query params: startDate, endDate
   */
  async getCashFlow(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      // Build date range condition if provided
      let dateRangeCondition = null;
      if (startDate || endDate) {
        dateRangeCondition = {};
        if (startDate) dateRangeCondition.$gte = new Date(startDate);
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          dateRangeCondition.$lte = end;
        }
      }
      
      // Get pending amount (orders with status: pending, confirmed, processing - no deposit confirmed yet)
      const pendingMatchQuery = {
        $or: [
          { orderStatus: 'pending' },
          { orderStatus: 'confirmed' },
          { orderStatus: 'processing' },
        ],
        'paymentTracking.depositConfirmed': false,
      };
      
      if (dateRangeCondition) {
        pendingMatchQuery.$or = [
          ...pendingMatchQuery.$or,
          { completedAt: dateRangeCondition },
          { updatedAt: dateRangeCondition },
          { createdAt: dateRangeCondition }
        ];
      }
      
      const pendingOrders = await Order.aggregate([
        { $match: pendingMatchQuery },
        {
          $group: {
            _id: null,
            total: { $sum: '$finalTotal' },
            count: { $sum: 1 },
          },
        },
      ]);

      // Get deposit amount (paymentTracking.depositConfirmed = true, but not fullPaymentConfirmed)
      const depositMatchQuery = {
        'paymentTracking.depositConfirmed': true,
        'paymentTracking.fullPaymentConfirmed': false,
      };
      
      if (dateRangeCondition) {
        depositMatchQuery.$or = [
          { completedAt: dateRangeCondition },
          { updatedAt: dateRangeCondition },
          { createdAt: dateRangeCondition }
        ];
      }
      
      const depositOrders = await Order.aggregate([
        { $match: depositMatchQuery },
        {
          $group: {
            _id: null,
            total: { $sum: '$finalTotal' },
            count: { $sum: 1 },
          },
        },
      ]);

      // Get full payment amount (paymentTracking.fullPaymentConfirmed = true)
      const fullPaymentMatchQuery = {
        'paymentTracking.fullPaymentConfirmed': true,
      };
      
      if (dateRangeCondition) {
        fullPaymentMatchQuery.$or = [
          { completedAt: dateRangeCondition },
          { updatedAt: dateRangeCondition },
          { createdAt: dateRangeCondition }
        ];
      }
      
      const fullPaymentOrders = await Order.aggregate([
        { $match: fullPaymentMatchQuery },
        {
          $group: {
            _id: null,
            total: { $sum: '$finalTotal' },
            count: { $sum: 1 },
          },
        },
      ]);

      // Extract values
      const pending = pendingOrders[0] || { total: 0, count: 0 };
      const deposit = depositOrders[0] || { total: 0, count: 0 };
      const fullPayment = fullPaymentOrders[0] || { total: 0, count: 0 };

      // Calculate total and percentages
      const grandTotal = pending.total + deposit.total + fullPayment.total;
      const pendingPercent = grandTotal > 0 ? (pending.total / grandTotal) * 100 : 0;
      const depositPercent = grandTotal > 0 ? (deposit.total / grandTotal) * 100 : 0;
      const fullPaymentPercent = grandTotal > 0 ? (fullPayment.total / grandTotal) * 100 : 0;

      return res.status(200).json({
        success: true,
        data: {
          cashFlow: {
            pending: {
              total: pending.total,
              count: pending.count,
              percentage: parseFloat(pendingPercent.toFixed(2)),
            },
            deposit: {
              total: deposit.total,
              count: deposit.count,
              percentage: parseFloat(depositPercent.toFixed(2)),
            },
            fullPayment: {
              total: fullPayment.total,
              count: fullPayment.count,
              percentage: parseFloat(fullPaymentPercent.toFixed(2)),
            },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching cash flow:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch cash flow',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/admin/statistics/summary
   * Lấy tóm tắt thống kê (sử dụng cho dashboard banner)
   */
  async getSummary(req, res) {
    try {
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Total revenue this month
      const monthRevenue = await Order.aggregate([
        {
          $match: {
            orderStatus: 'completed',
            createdAt: { $gte: thisMonthStart },
          },
        },
        { $group: { _id: null, total: { $sum: '$finalTotal' } } },
      ]);

      // Total orders this month
      const monthOrders = await Order.countDocuments({
        orderStatus: 'completed',
        createdAt: { $gte: thisMonthStart },
      });

      // Pending amount
      const pendingAmount = await Order.aggregate([
        {
          $match: {
            $or: [
              { orderStatus: 'pending' },
              { orderStatus: 'confirmed' },
              { orderStatus: 'processing' },
            ],
          },
        },
        { $group: { _id: null, total: { $sum: '$finalTotal' } } },
      ]);

      // New customers this month
      const newCustomersThisMonth = await User.countDocuments({
        createdAt: { $gte: thisMonthStart },
      });

      return res.status(200).json({
        success: true,
        data: {
          summary: {
            monthRevenue: monthRevenue[0]?.total || 0,
            monthOrders,
            pendingAmount: pendingAmount[0]?.total || 0,
            newCustomersThisMonth,
          },
        },
      });
    } catch (error) {
      console.error('Error fetching summary:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch summary',
        error: error.message,
      });
    }
  }

  /**
   * GET /api/admin/statistics/monthly-revenue
   * Lấy doanh thu theo từng tháng (12 tháng gần nhất hoặc khoảng thời gian tùy chọn)
   * Query params: startDate, endDate
   */
  async getMonthlyRevenue(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      const today = new Date();
      const twelveMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 11, 1);

      // Build match query - use completedAt or createdAt
      let matchQuery = {
        orderStatus: 'completed',
      };

      if (startDate || endDate) {
        const dateRangeCondition = {};
        if (startDate) {
          dateRangeCondition.$gte = new Date(startDate);
        } else {
          dateRangeCondition.$gte = twelveMonthsAgo;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          dateRangeCondition.$lte = end;
        }
        
        // Match orders where completedAt, updatedAt, or createdAt falls within range
        matchQuery.$or = [
          { completedAt: dateRangeCondition },
          { updatedAt: dateRangeCondition },
          { createdAt: dateRangeCondition }
        ];
        matchQuery.orderStatus = 'completed';
      } else {
        // Default: use either completedAt or createdAt from last 12 months
        matchQuery.$or = [
          { completedAt: { $gte: twelveMonthsAgo } },
          { updatedAt: { $gte: twelveMonthsAgo } },
          { createdAt: { $gte: twelveMonthsAgo } }
        ];
        matchQuery.orderStatus = 'completed';
      }

      const revenues = await Order.aggregate([
        {
          $match: matchQuery,
        },
        {
          $addFields: {
            dateForGrouping: {
              $cond: [
                { $ne: ['$completedAt', null] },
                '$completedAt',
                { $cond: [{ $ne: ['$updatedAt', null] }, '$updatedAt', '$createdAt'] }
              ]
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$dateForGrouping' },
              month: { $month: '$dateForGrouping' },
            },
            totalRevenue: { $sum: '$finalTotal' },
            orderCount: { $sum: 1 },
          },
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1 },
        },
      ]);

      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];

      const monthlyData = revenues.map(item => ({
        month: monthNames[item._id.month - 1],
        revenue: item.totalRevenue,
        orders: item.orderCount,
        fullDate: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      }));

      return res.status(200).json({
        success: true,
        data: monthlyData,
      });
    } catch (error) {
      console.error('Error fetching monthly revenue:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch monthly revenue',
        error: error.message,
      });
    }
  }
}

export default new StatisticsController();
