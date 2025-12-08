import express from 'express';
import productController from '../../controllers/admin/product.controller.js';

const router = express.Router();

// ==================== Public Routes ====================
// Các route công khai cho user xem sản phẩm

// Lấy danh sách sản phẩm theo các tiêu chí
router.get('/newest', productController.getNewestProducts);
router.get('/best-selling', productController.getBestSellingProducts);
router.get('/most-viewed', productController.getMostViewedProducts);
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

export default router;
