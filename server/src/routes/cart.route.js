import express from 'express';
import cartController from '../controllers/cart.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// GET /api/cart - Lấy giỏ hàng
router.get('/', verifyToken, (req, res) => cartController.getCart(req, res));

// GET /api/cart/count - Lấy số lượng items
router.get('/count', verifyToken, (req, res) => cartController.getCartCount(req, res));

// POST /api/cart/add - Thêm dịch vụ vào giỏ
router.post('/add', verifyToken, (req, res) => cartController.addToCart(req, res));

// PUT /api/cart/update/:itemId - Cập nhật item
router.put('/update/:itemId', verifyToken, (req, res) => cartController.updateCartItem(req, res));

// DELETE /api/cart/remove/:itemId - Xóa item
router.delete('/remove/:itemId', verifyToken, (req, res) => cartController.removeFromCart(req, res));

// DELETE /api/cart/clear - Xóa toàn bộ giỏ
router.delete('/clear', verifyToken, (req, res) => cartController.clearCart(req, res));

// PUT /api/cart/applyDiscount - Áp dụng giảm giá
router.put('/applyDiscount', verifyToken, (req, res) => cartController.applyDiscount(req, res));

// PUT /api/cart/notes - Cập nhật ghi chú
router.put('/notes', verifyToken, (req, res) => cartController.updateNotes(req, res));

export default router;
