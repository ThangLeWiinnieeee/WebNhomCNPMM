import express from 'express';
import productController from '../controllers/product.controller.js';
import { validateCreateProduct, validateUpdateProduct } from '../validates/product.validate.js';
// import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ==================== Public Routes ====================
// Các route công khai, không cần authentication

// Lấy danh sách sản phẩm theo các tiêu chí
router.get('/newest', productController.getNewestProducts);
router.get('/best-selling', productController.getBestSellingProducts);
router.get('/most-viewed', productController.getMostViewedProducts);
//product/promotion
router.get('/promotion', productController.getPromotionProducts);

// Tìm kiếm sản phẩm
router.get('/search', productController.searchProducts);

// Lấy sản phẩm theo danh mục
router.get('/category/:categoryId', productController.getProductsByCategory);

// Lấy sản phẩm liên quan (phải đặt trước /:id để tránh conflict)
router.get('/:id/related', productController.getRelatedProducts);

// Lấy chi tiết một sản phẩm
router.get('/:id', productController.getProductById);


// Lấy tất cả sản phẩm với filter và phân trang
router.get('/', productController.getAllProducts);

// ==================== Admin Routes ====================
// Các route quản trị, cần authentication (tạm thời public, sẽ thêm verifyToken sau)

// Tạo sản phẩm mới (có validation)
router.post('/', validateCreateProduct, productController.createProduct);

// Cập nhật sản phẩm (có validation)
router.put('/:id', validateUpdateProduct, productController.updateProduct);

// Xóa sản phẩm
router.delete('/:id', productController.deleteProduct);

export default router;

