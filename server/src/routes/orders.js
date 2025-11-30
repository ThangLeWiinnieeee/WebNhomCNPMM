import express from 'express';
const router = express.Router();
import Order from '../models/order.js';
import auth from '../middlewares/auth.middleware.js';

router.get('/my-orders', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId })
      .populate('items.serviceId')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(orders); // Trả array [] nếu không có orders
  } catch (error) {
    console.error('Lỗi fetch orders:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy đơn hàng' });
  }
});

export default router;