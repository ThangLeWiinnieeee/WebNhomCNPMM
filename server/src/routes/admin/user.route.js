import express from 'express';
import userController from '../../controllers/admin/user.controller.js';
import { requireAdmin } from '../../middlewares/admin/admin.middleware.js';
import { validateUpdateUser, validateLockUser } from '../../validates/admin/user.validate.js';

const router = express.Router();

// ==================== Admin User Routes ====================
// Tất cả các route đều yêu cầu quyền admin

// Xuất CSV (đặt trước /:userId để tránh conflict)
router.get('/export/csv', requireAdmin, userController.exportCsv);

// Lấy danh sách tất cả người dùng
router.get('/', requireAdmin, userController.getAllUsers);

// Lấy chi tiết một người dùng
router.get('/:userId', requireAdmin, userController.getUserById);

// Cập nhật thông tin người dùng
router.put('/:userId', requireAdmin, validateUpdateUser, userController.updateUser);

// Khóa tài khoản
router.put('/:userId/lock', requireAdmin, validateLockUser, userController.lockUser);

// Mở khóa tài khoản
router.put('/:userId/unlock', requireAdmin, userController.unlockUser);

// Xóa người dùng (soft delete)
router.delete('/:userId', requireAdmin, userController.deleteUser);

export default router;
