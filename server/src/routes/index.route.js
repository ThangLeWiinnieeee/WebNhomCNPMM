import express from 'express';
import userRoutes from './user.route.js';
import authRoutes from './auth.route.js';
import cartRoutes from './cart.route.js';
import orderRoutes from './order.route.js';
import productRoutes from './product.route.js';
import categoryRoutes from './category.route.js';
import uploadRoutes from './upload.route.js';
const router = express.Router();

router.use('/user', userRoutes);
router.use('/account', authRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/upload', uploadRoutes);

export default router;