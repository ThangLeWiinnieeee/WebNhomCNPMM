import express from 'express';
import authController from '../../controllers/user/auth.controller.js';
import { registerValidate, loginValidate, forgotPasswordValidate, otpPasswordValidate, resetPasswordValidate } from '../../validates/user/auth.validate.js';
const router = express.Router();

router.post('/register', registerValidate ,authController.registerPost);
router.post('/login', loginValidate ,authController.loginPost);
router.post('/google-login', authController.googleLoginPost);
router.post('/forgot-password', forgotPasswordValidate ,authController.forgotPasswordPost);
router.post('/otp-password', otpPasswordValidate ,authController.otpPasswordPost);
router.post('/reset-password', resetPasswordValidate ,authController.resetPasswordPost);
router.post('/logout',authController.logoutPost);

export default router;