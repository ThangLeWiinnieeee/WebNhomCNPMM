// model mã giảm giá
import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  discount: { type: Number, default: 3 }, // % off
  expiryDate: { type: Date, required: true },
  isUsed: { type: Boolean, default: false },
  type: { type: String, enum: ['review-reward'], default: 'review-reward' },
}, { timestamps: true });

export default mongoose.model('Coupon', couponSchema);
