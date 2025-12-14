import express from 'express';
import settingsController from '../../controllers/admin/settings.controller.js';
import { requireAdmin } from '../../middlewares/admin/admin.middleware.js';

const router = express.Router();

// ==================== Admin Routes ====================
// Tất cả các route đều yêu cầu quyền admin

// Lấy thông tin settings
router.get('/', requireAdmin, settingsController.getSettings);

// Cập nhật settings
router.put('/', requireAdmin, settingsController.updateSettings);

export default router;
