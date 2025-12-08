import express from 'express';
import productController from '../../controllers/admin/product.controller.js';
import { validateCreateProduct, validateUpdateProduct } from '../../validates/admin/product.validate.js';
import { requireAdmin } from '../../middlewares/admin/admin.middleware.js';

const router = express.Router();

// ==================== Admin Routes ====================
// Tất cả các route đều yêu cầu quyền admin

// Lấy tất cả sản phẩm (admin có thể xem cả inactive)
router.get('/', requireAdmin, productController.getAllProducts);

// Lấy chi tiết một sản phẩm
router.get('/:id', requireAdmin, productController.getProductById);

// Tạo sản phẩm mới (có validation)
router.post('/', requireAdmin, validateCreateProduct, productController.createProduct);

// Cập nhật sản phẩm (có validation)
router.put('/:id', requireAdmin, validateUpdateProduct, productController.updateProduct);

// Xóa sản phẩm
router.delete('/:id', requireAdmin, productController.deleteProduct);

export default router;

