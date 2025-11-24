import express from 'express';
import authController from '../controllers/auth.controller.js';
import { registerValidate, loginValidate, forgotPasswordValidate, otpPasswordValidate, resetPasswordValidate } from '../validates/auth.validate.js';
const router = express.Router();

router.post('/register', registerValidate ,authController.registerPost);
router.post('/login', loginValidate ,authController.loginPost);
router.post('/forgot-password', forgotPasswordValidate ,authController.forgotPasswordPost);
router.post('/logout',authController.logoutPost);

export default router;