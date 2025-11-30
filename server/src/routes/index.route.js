import express from 'express';
import userRoutes from './user.route.js';
import authRoutes from './auth.route.js';
import cartRoutes from './cart.route.js';
import orderRoutes from './order.route.js';
const router = express.Router();

router.use('/user', userRoutes);
router.use('/account', authRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);

export default router;