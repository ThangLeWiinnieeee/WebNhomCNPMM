import express from 'express';
import categoryController from '../controllers/category.controller.js';
import { validateCreateCategory, validateUpdateCategory } from '../validates/category.validate.js';
// import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ==================== Public Routes ====================
// Các route công khai, không cần authentication

// Lấy danh sách tất cả danh mục
router.get('/', categoryController.getAllCategories);

// Lấy chi tiết một danh mục
router.get('/:id', categoryController.getCategoryById);

// ==================== Admin Routes ====================
// Các route quản trị, cần authentication (tạm thời public, sẽ thêm verifyToken sau)

// Tạo danh mục mới (có validation)
router.post('/', validateCreateCategory, categoryController.createCategory);

// Cập nhật danh mục (có validation)
router.put('/:id', validateUpdateCategory, categoryController.updateCategory);

// Xóa danh mục
router.delete('/:id', categoryController.deleteCategory);

export default router;

