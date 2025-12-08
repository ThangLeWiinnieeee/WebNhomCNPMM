import express from 'express';
import userController from '../../controllers/user/user.controller.js';
import { verifyToken } from '../../middlewares/user/auth.middleware.js';
import { updateProfileValidate, changePasswordValidate } from '../../validates/user/user.validate.js';

const router = express.Router();

router.get('/profile', verifyToken, userController.getProfile);
router.put('/profile', verifyToken, updateProfileValidate, userController.updateProfile);
router.post('/change-password', verifyToken, changePasswordValidate, userController.changePassword);

export default router;