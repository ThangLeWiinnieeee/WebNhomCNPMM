import express from 'express';
import orderController from '../../controllers/user/order.controller.js';
import { verifyToken } from '../../middlewares/user/auth.middleware.js';

const router = express.Router();

// ==================== User Routes ====================
// Các route cho user quản lý đơn hàng của mình

// GET /api/orders/points - Lấy điểm của user
router.get('/points', verifyToken, (req, res) => orderController.getUserPoints(req, res));

// GET /api/orders/coupons - Lấy danh sách mã giảm giá của user
router.get('/coupons', verifyToken, (req, res) => orderController.getUserCoupons(req, res));

// POST /api/orders/validate-coupon - Xác thực mã giảm giá
router.post('/validate-coupon', verifyToken, (req, res) => orderController.validateCoupon(req, res));

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