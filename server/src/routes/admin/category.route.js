import express from 'express';
import categoryController from '../../controllers/admin/category.controller.js';
import { validateCreateCategory, validateUpdateCategory } from '../../validates/admin/category.validate.js';
import { requireAdmin } from '../../middlewares/admin/admin.middleware.js';

const router = express.Router();

// ==================== Admin Routes ====================
// Tất cả các route đều yêu cầu quyền admin

// Lấy danh sách tất cả danh mục (admin có thể xem cả inactive)
router.get('/', requireAdmin, categoryController.getAllCategories);

// Lấy chi tiết một danh mục
router.get('/:id', requireAdmin, categoryController.getCategoryById);

// Tạo danh mục mới (có validation)
router.post('/', requireAdmin, validateCreateCategory, categoryController.createCategory);

// Cập nhật danh mục (có validation)
router.put('/:id', requireAdmin, validateUpdateCategory, categoryController.updateCategory);

// Xóa danh mục
router.delete('/:id', requireAdmin, categoryController.deleteCategory);

export default router;

