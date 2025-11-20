import express from 'express';
import userController from '../controllers/auth.controller.js';
import { registerValidate, loginValidate, forgotPasswordValidate, otpPasswordValidate, resetPasswordValidate } from '../validates/auth.validate.js';
const router = express.Router();

router.post('/register', registerValidate ,userController.registerPost);
router.post('/login', loginValidate ,userController.loginPost);
router.post('/logout',userController.logoutPost);

export default router;