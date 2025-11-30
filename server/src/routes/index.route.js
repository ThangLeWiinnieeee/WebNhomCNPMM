import express from 'express';
import userRoutes from './user.route.js';
import authRoutes from './auth.route.js';
import orderRoutes from './orders.js';
const router = express.Router();

router.use('/user', userRoutes);
router.use('/account', authRoutes);
router.use('/orders', orderRoutes);

export default router;