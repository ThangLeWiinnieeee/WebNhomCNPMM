import express from 'express';
import userController from '../controllers/user.controller.js';
const router = express.Router();


router.post('/register',userController.registerPost);
router.post('/login',userController.loginPost);
router.post('/logout',userController.logoutPost);

router.get('/profile', userController.getProfile);

export default router;