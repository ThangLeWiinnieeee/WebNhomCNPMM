import express from 'express';
import { requireAdmin  } from '../../middlewares/admin/admin.middleware.js';
import reviewController from '../../controllers/admin/review.controller.js';

const router = express.Router();

router.use(requireAdmin);

router.get('/', reviewController.getReviews);
// router.put('/:id/approve', reviewController.approveReview);
router.delete('/:id', reviewController.deleteReview);

export default router;