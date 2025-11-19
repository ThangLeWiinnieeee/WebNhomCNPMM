import express from 'express';
import userRoutes from './user.route.js';
import authRoutes from './auth.route.js';
const router = express.Router();

router.use('/user', userRoutes);
router.use('/account', authRoutes);

export default router;