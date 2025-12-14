import express from 'express';
import productViewController from '../../controllers/user/product-view.controller.js';
import { verifyToken } from '../../middlewares/user/auth.middleware.js';

const router = express.Router();

// ==================== User Routes ====================

// Ghi nhận lượt xem sản phẩm (không cần đăng nhập)
router.post('/products/:id/view', productViewController.recordProductView);

// Lấy danh sách sản phẩm đã xem gần đây (cần đăng nhập)
router.get('/user/recently-viewed', verifyToken, productViewController.getRecentlyViewed);

export default router;
