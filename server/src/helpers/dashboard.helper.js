/**
 * Dashboard Query Helper Functions
 * Tính toán thống kê cho admin dashboard
 * Location: server/src/helpers/dashboard.helper.js
 */

import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';

/**
 * Tính tổng doanh thu theo tháng (12 tháng gần nhất)
 * @returns {Promise<Array>} Array của revenue theo tháng
 * Format: [{ month: "Jan", revenue: 450000000 }, ...]
 */
export const getMonthlyRevenue = async () => {
  try {
    const today = new Date();
    const twelveMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 11, 1);

    const revenues = await Order.aggregate([
      {
        $match: {
          // FIXED: Chỉ lấy đơn hàng đã hoàn thành để thống kê doanh thu thực tế
          orderStatus: 'completed',
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalRevenue: { $sum: '$finalTotal' },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Map kết quả để có format user-friendly
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return revenues.map(item => ({
      month: monthNames[item._id.month - 1],
      revenue: item.totalRevenue,
      orders: item.orderCount,
      fullDate: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
    }));
  } catch (error) {
    console.error('Error calculating monthly revenue:', error);
    throw error;
  }
};

/**
 * Lấy tổng doanh thu hôm nay, tháng này, năm này
 * @returns {Promise<Object>}
 */
export const getRevenueOverview = async () => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    // Lấy doanh thu theo 3 khoảng thời gian (hôm nay, tháng này, năm này)
    const [todayData, monthData, yearData] = await Promise.all([
      Order.aggregate([
        {
          $match: {
            orderStatus: 'completed',
            createdAt: { $gte: todayStart },
          },
        },
        { $group: { _id: null, total: { $sum: '$finalTotal' }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        {
          $match: {
            orderStatus: 'completed',
            createdAt: { $gte: monthStart },
          },
        },
        { $group: { _id: null, total: { $sum: '$finalTotal' }, count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        {
          $match: {
            orderStatus: 'completed',
            createdAt: { $gte: yearStart },
          },
        },
        { $group: { _id: null, total: { $sum: '$finalTotal' }, count: { $sum: 1 } } },
      ]),
    ]);

    return {
      today: {
        revenue: todayData[0]?.total || 0,
        orders: todayData[0]?.count || 0,
      },
      month: {
        revenue: monthData[0]?.total || 0,
        orders: monthData[0]?.count || 0,
      },
      year: {
        revenue: yearData[0]?.total || 0,
        orders: yearData[0]?.count || 0,
      },
    };
  } catch (error) {
    console.error('Error calculating revenue overview:', error);
    throw error;
  }
};

/**
 * Đếm khách hàng mới trong 30 ngày qua
 * @returns {Promise<Object>}
 */
export const getNewCustomersStats = async () => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Tính người dùng mới
    const [newLast30, newLast7, newToday, totalUsers] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      User.countDocuments({ createdAt: { $gte: todayStart } }),
      User.countDocuments({}),
    ]);

    return {
      newLast30Days: newLast30,
      newLast7Days: newLast7,
      newToday: newToday,
      totalUsers: totalUsers,
      avgNewPerDay: Math.round(newLast30 / 30),
    };
  } catch (error) {
    console.error('Error calculating new customers stats:', error);
    throw error;
  }
};

/**
 * Lấy Top 10 sản phẩm bán chạy nhất (trong 90 ngày gần nhất)
 * @returns {Promise<Array>}
 */
export const getTopProducts = async (limit = 10) => {
  try {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    const topProducts = await Order.aggregate([
      {
        $match: {
          orderStatus: 'completed',
          createdAt: { $gte: ninetyDaysAgo },
        },
      },
      {
        // Unwind items array để có thể group by product
        $unwind: '$items',
      },
      {
        $group: {
          _id: '$items.serviceId',
          productName: { $first: '$items.serviceName' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          orderCount: { $sum: 1 },
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
      {
        $limit: Math.min(limit, 50), // Safety limit
      },
      {
        // Lookup để lấy thông tin product (ảnh, slug, etc.)
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $addFields: {
          image: { $arrayElemAt: ['$productDetails.images', 0] },
          slug: { $arrayElemAt: ['$productDetails.slug', 0] },
          productTitle: { $arrayElemAt: ['$productDetails.title', 0] },
        },
      },
      {
        $project: {
          _id: 1,
          productName: 1,
          productTitle: 1,
          totalQuantity: 1,
          totalRevenue: 1,
          orderCount: 1,
          image: 1,
          slug: 1,
        },
      },
    ]);

    return topProducts;
  } catch (error) {
    console.error('Error fetching top products:', error);
    throw error;
  }
};

/**
 * Lấy danh sách đơn hàng đã giao gần nhất (thành công)
 * @param {Number} limit Số lượng đơn hàng (default: 5)
 * @returns {Promise<Array>}
 */
export const getRecentSuccessfulOrders = async (limit = 5) => {
  try {
    const recentOrders = await Order.aggregate([
      {
        $match: {
          // FIXED: Chỉ lấy đơn hàng đã hoàn thành (completed)
          orderStatus: 'completed',
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $limit: limit,
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
          paymentMethod: 1,
          paymentStatus: 1,
          orderStatus: 1,
          createdAt: 1,
          completedAt: 1,
          itemCount: { $size: '$items' },
          userName: { $arrayElemAt: ['$userDetails.fullname', 0] },
        },
      },
    ]);

    return recentOrders;
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    throw error;
  }
};

/**
 * Lấy thống kê đơn hàng theo trạng thái
 * @returns {Promise<Object>}
 */
export const getOrderStatusStats = async () => {
  try {
    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
          totalRevenue: { $sum: { $cond: [{ $eq: ['$orderStatus', 'completed'] }, '$finalTotal', 0] } },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return statusStats;
  } catch (error) {
    console.error('Error fetching order status stats:', error);
    throw error;
  }
};

/**
 * Lấy tất cả stats một lần (optimization)
 * @returns {Promise<Object>}
 */
export const getCompleteDashboardStats = async () => {
  try {
    const [
      monthlyRevenue,
      revenueOverview,
      newCustomers,
      topProducts,
      recentOrders,
      orderStatusStats,
    ] = await Promise.all([
      getMonthlyRevenue(),
      getRevenueOverview(),
      getNewCustomersStats(),
      getTopProducts(10),
      getRecentSuccessfulOrders(5),
      getOrderStatusStats(),
    ]);

    return {
      monthlyRevenue,
      revenueOverview,
      newCustomers,
      topProducts,
      recentOrders,
      orderStatusStats,
    };
  } catch (error) {
    console.error('Error fetching complete dashboard stats:', error);
    throw error;
  }
};
