import express from 'express';
import weddingPackageController from '../../controllers/admin/wedding-package.controller.js';
import { validateCreateWeddingPackage, validateUpdateWeddingPackage } from '../../validates/admin/wedding-package.validate.js';
import { requireAdmin } from '../../middlewares/admin/admin.middleware.js';

const router = express.Router();

// ==================== Admin Routes ====================
// Tất cả các route đều yêu cầu quyền admin

// Lấy danh sách tất cả gói tiệc (admin có thể xem cả inactive)
router.get('/', requireAdmin, weddingPackageController.getAllPackages);

// Lấy chi tiết một gói tiệc
router.get('/:id', requireAdmin, weddingPackageController.getPackageById);

// Tạo gói tiệc mới
router.post('/', requireAdmin, validateCreateWeddingPackage, weddingPackageController.createPackage);

// Cập nhật gói tiệc
router.put('/:id', requireAdmin, validateUpdateWeddingPackage, weddingPackageController.updatePackage);

// Xóa gói tiệc
router.delete('/:id', requireAdmin, weddingPackageController.deletePackage);

export default router;
