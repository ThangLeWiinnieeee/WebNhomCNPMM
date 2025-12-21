import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null = tất cả user
  },
  discount: { type: Number, default: 3 },
  expiryDate: { type: Date, required: true },
  isUsed: { type: Boolean, default: false }, // dùng cho coupon cá nhân
  // CHỈ dùng cho coupon global
  quantity: {
    type: Number,
    default: 1,
    min: 0
  },
  usedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }], // dùng cho coupon global
  type: { type: String, enum: ['review-reward'], default: 'review-reward' },
}, { timestamps: true });

export default mongoose.model('Coupon', couponSchema);
