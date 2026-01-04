import express from 'express';
import orderController from '../../controllers/admin/order.controller.js';
import { requireAdmin } from '../../middlewares/admin/admin.middleware.js';

const router = express.Router();

// ==================== Admin Routes ====================
// Tất cả các route đều yêu cầu quyền admin

// GET /api/admin/orders - Lấy tất cả đơn hàng (admin)
router.get('/', requireAdmin, (req, res) => orderController.adminGetAllOrders(req, res));

// GET /api/admin/orders/:id - Lấy chi tiết đơn hàng
router.get('/:id', requireAdmin, (req, res) => orderController.adminGetOrderDetail(req, res));

// PUT /api/admin/orders/:id/status - Cập nhật trạng thái đơn hàng
router.put('/:id/status', requireAdmin, (req, res) => orderController.updateOrderStatus(req, res));

// PUT /api/admin/orders/:id/mark-completed - Đánh dấu đã hoàn thành + update wallet
router.put('/:id/mark-completed', requireAdmin, (req, res) => orderController.markOrderCompleted(req, res));

// PUT /api/admin/orders/:id/confirm - Xác nhận đơn hàng (pending -> confirmed)
router.put('/:id/confirm', requireAdmin, (req, res) => orderController.confirmOrder(req, res));

// PUT /api/admin/orders/:id/deposit-30 - Xác nhận cọc 30% (confirmed -> processing)
router.put('/:id/deposit-30', requireAdmin, (req, res) => orderController.confirmDeposit30(req, res));

// PUT /api/admin/orders/:id/paid-100 - Xác nhận đã thanh toán 100% (confirmed -> processing)
router.put('/:id/paid-100', requireAdmin, (req, res) => orderController.confirmPaid100(req, res));

// PUT /api/admin/orders/:id/paid-remaining-70 - Xác nhận thanh toán 70% còn lại (khi đã cọc 30%)
router.put('/:id/paid-remaining-70', requireAdmin, (req, res) => orderController.confirmPaidRemaining70(req, res));

// PUT /api/admin/orders/:id/complete-service - Xác nhận hoàn thành dịch vụ (processing -> completed)
router.put('/:id/complete-service', requireAdmin, (req, res) => orderController.completeService(req, res));

export default router;
