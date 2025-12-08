import express from 'express';
import orderController from '../../controllers/admin/order.controller.js';
import { requireAdmin } from '../../middlewares/admin/admin.middleware.js';

const router = express.Router();

// ==================== Admin Routes ====================
// Tất cả các route đều yêu cầu quyền admin

// GET /api/admin/orders - Lấy tất cả đơn hàng (admin)
router.get('/', requireAdmin, (req, res) => orderController.getAllOrders(req, res));

// GET /api/admin/orders/:orderId - Lấy chi tiết đơn hàng
router.get('/:orderId', requireAdmin, (req, res) => orderController.getOrderDetail(req, res));

// PUT /api/admin/orders/:orderId/status - Cập nhật trạng thái đơn hàng
router.put('/:orderId/status', requireAdmin, (req, res) => orderController.updateOrderStatus(req, res));

export default router;
