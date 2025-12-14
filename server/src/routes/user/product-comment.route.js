import express from 'express';
import productCommentController from '../../controllers/user/product-comment.controller.js';
import { verifyToken } from '../../middlewares/user/auth.middleware.js';

const router = express.Router();

// ==================== User Routes ====================
// Tất cả các route đều yêu cầu đăng nhập

// Tạo comment mới cho sản phẩm
router.post('/products/:id/comments', verifyToken, productCommentController.createComment);

// Lấy danh sách comments của sản phẩm (public - không cần đăng nhập)
router.get('/products/:id/comments', productCommentController.getCommentsByProduct);

// Cập nhật comment (chỉ user tạo comment mới được cập nhật)
router.put('/comments/:id', verifyToken, productCommentController.updateComment);

// Xóa comment (chỉ user tạo comment mới được xóa)
router.delete('/comments/:id', verifyToken, productCommentController.deleteComment);

export default router;
