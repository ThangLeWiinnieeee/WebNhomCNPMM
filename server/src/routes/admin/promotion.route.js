import express from 'express';
import { requireAdmin  } from '../../middlewares/admin/admin.middleware.js';
import promotionController from '../../controllers/admin/promotion.controller.js';

const router = express.Router();

router.use(requireAdmin);

router.get('/', promotionController.getPromotions);
router.post('/', promotionController.createPromotion);
router.put('/:id', promotionController.updatePromotion);
router.delete('/:id', promotionController.deletePromotion);

export default router;