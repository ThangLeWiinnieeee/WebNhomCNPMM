import express from 'express';
import settingsController from '../../controllers/user/settings.controller.js';

const router = express.Router();

// ==================== Public Routes ====================
// Route công khai để lấy thông tin settings (không cần đăng nhập)

// Lấy thông tin settings
router.get('/', settingsController.getPublicSettings);

export default router;
