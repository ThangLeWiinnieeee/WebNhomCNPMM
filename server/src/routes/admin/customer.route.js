import express from 'express';
import customerController from '../../controllers/admin/customer.controller.js';
import { requireAdmin } from '../../middlewares/admin/admin.middleware.js';

const router = express.Router();

// ==================== Admin Customer Routes ====================
// Tất cả các route đều yêu cầu quyền admin

// Lấy thống kê khách hàng (phải đặt trước route /:id để tránh conflict)
router.get('/stats', requireAdmin, customerController.getCustomerStats);

// Lấy danh sách tất cả khách hàng
router.get('/', requireAdmin, customerController.getAllCustomers);

// Lấy chi tiết một khách hàng
router.get('/:id', requireAdmin, customerController.getCustomerById);

// Cập nhật thông tin khách hàng
router.put('/:id', requireAdmin, customerController.updateCustomer);

// Thay đổi trạng thái tài khoản khách hàng (khóa/mở khóa)
router.patch('/:id/status', requireAdmin, customerController.updateCustomerStatus);

// Xóa khách hàng
router.delete('/:id', requireAdmin, customerController.deleteCustomer);

export default router;
