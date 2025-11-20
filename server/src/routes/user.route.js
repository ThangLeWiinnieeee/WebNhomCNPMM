import express from 'express';
import userController from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.get('/profile', verifyToken ,userController.getProfile);

export default router;