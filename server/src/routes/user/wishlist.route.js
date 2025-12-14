import express from 'express';
import wishlistController from '../../controllers/user/wishlist.controller.js';
import { verifyToken } from '../../middlewares/user/auth.middleware.js';

const router = express.Router();

// ==================== User Routes ====================
// Tất cả các route đều yêu cầu đăng nhập

// Thêm sản phẩm vào wishlist
router.post('/products/:id/like', verifyToken, wishlistController.likeProduct);

// Xóa sản phẩm khỏi wishlist
router.delete('/products/:id/like', verifyToken, wishlistController.unlikeProduct);

// Kiểm tra sản phẩm có trong wishlist không
router.get('/products/:id/like/check', verifyToken, wishlistController.checkLiked);

// Thêm gói tiệc vào wishlist
router.post('/wedding-packages/:id/like', verifyToken, wishlistController.likePackage);

// Xóa gói tiệc khỏi wishlist
router.delete('/wedding-packages/:id/like', verifyToken, wishlistController.unlikePackage);

// Kiểm tra gói tiệc có trong wishlist không
router.get('/wedding-packages/:id/like/check', verifyToken, wishlistController.checkPackageLiked);

// Lấy danh sách sản phẩm yêu thích (bao gồm cả product và wedding_package)
router.get('/user/wishlist', verifyToken, wishlistController.getWishlist);

export default router;
