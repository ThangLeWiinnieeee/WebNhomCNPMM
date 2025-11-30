const Order = require('../models/order'); // Import model (casing đúng: Order.js)

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ auth middleware (JWT token)
    const orders = await Order.find({ userId })
      .populate('items.serviceId') // Populate nếu có model Service
      .sort({ createdAt: -1 }) // Mới nhất trước
      .limit(20); // Giới hạn

    res.json(orders); // Trả array orders cho frontend
  } catch (error) {
    console.error('Lỗi fetch orders:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng' });
  }
};

module.exports = { getMyOrders };