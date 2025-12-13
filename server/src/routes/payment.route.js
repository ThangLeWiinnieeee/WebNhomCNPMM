import express from 'express';
import PaymentController from '../controllers/payment.controller.js';
import { verifyToken } from '../middlewares/user/auth.middleware.js';

const router = express.Router();

/**
 * ZaloPay Payment Routes
 */

// Create ZaloPay payment request
router.post('/zalopay/create', verifyToken, (req, res) =>
  PaymentController.createZaloPayPayment(req, res)
);

// Handle ZaloPay callback (webhook)
router.post('/zalopay/callback', (req, res) =>
  PaymentController.handleZaloPayCallback(req, res)
);

// Check ZaloPay payment status
router.get('/zalopay/:orderId/status', verifyToken, (req, res) =>
  PaymentController.checkZaloPayStatus(req, res)
);

export default router;
