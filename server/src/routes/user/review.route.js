import express from 'express';
import multer from 'multer';
const router = express.Router();

import { submitReview, getReviewByOrder } from '../../controllers/user/review.controller.js';
import { verifyToken } from '../../middlewares/user/auth.middleware.js';

// Configure multer for memory storage (no disk saving)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'), false);
    }
  }
});

router.post('/submit', verifyToken, upload.array('images', 5), submitReview); // Handle up to 5 images
router.get('/order/:orderId', verifyToken, getReviewByOrder);

export default router;