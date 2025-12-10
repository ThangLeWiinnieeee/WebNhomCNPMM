import express from 'express';
import orderController from '../../controllers/user/order.controller.js';
import { verifyToken } from '../../middlewares/user/auth.middleware.js';

const router = express.Router();

// ==================== User Routes ====================
// Các route cho user quản lý đơn hàng của mình

// POST /api/orders - Tạo đơn hàng
router.post('/', verifyToken, (req, res) => orderController.createOrder(req, res));

// GET /api/orders - Lấy danh sách đơn hàng của user
router.get('/', verifyToken, (req, res) => orderController.getUserOrders(req, res));

// GET /api/orders/:orderId - Lấy chi tiết đơn hàng
router.get('/:orderId', verifyToken, (req, res) => orderController.getOrderDetail(req, res));

// PUT /api/orders/:orderId/confirm - Xác nhận thanh toán COD
router.put('/:orderId/confirm', verifyToken, (req, res) => orderController.confirmCODPayment(req, res));

// PUT /api/orders/:orderId/cancel - Hủy đơn hàng
router.put('/:orderId/cancel', verifyToken, (req, res) => orderController.cancelOrder(req, res));

export default router;
