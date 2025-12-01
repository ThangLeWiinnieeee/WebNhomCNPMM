import express from 'express';
import orderController from '../controllers/order.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

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

// PUT /api/orders/:orderId/status - Cập nhật trạng thái (admin)
router.put('/:orderId/status', verifyToken, (req, res) => orderController.updateOrderStatus(req, res));

export default router;
