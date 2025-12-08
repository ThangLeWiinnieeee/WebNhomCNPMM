import express from 'express';
import { getActiveCategories, getCategoryById } from '../../controllers/user/category.controller.js';

const router = express.Router();

// ==================== Public Routes ====================
// Các route công khai cho user xem danh mục (chỉ danh mục đang hoạt động)

// Lấy danh sách danh mục đang active
router.get('/', getActiveCategories);

// Lấy chi tiết một danh mục
router.get('/:id', getCategoryById);

export default router;
