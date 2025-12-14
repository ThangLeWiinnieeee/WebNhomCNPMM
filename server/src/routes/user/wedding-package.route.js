import express from 'express';
import weddingPackageController from '../../controllers/user/wedding-package.controller.js';
import { optionalAuth } from '../../middlewares/user/auth.middleware.js';

const router = express.Router();

// ==================== Public Routes ====================
// Các route công khai cho user xem gói tiệc

// Lấy danh sách gói tiệc tương tự (phải đặt trước /:id để tránh conflict)
router.get('/:id/similar', weddingPackageController.getSimilarPackages);

// Lấy chi tiết một gói tiệc (có optional auth để lưu package view nếu user đã đăng nhập)
router.get('/:id', optionalAuth, weddingPackageController.getPackageById);

// Lấy tất cả gói tiệc với filter và phân trang
router.get('/', weddingPackageController.getAllPackages);

export default router;
