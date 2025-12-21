import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      default: null,
    },
    type: {
      type: String,
      enum: ['income', 'withdrawal', 'refund', 'fee', 'bonus'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: String,
    // Thông tin chi tiết giao dịch
    details: {
      orderID: String, // Mã đơn hàng
      serviceCharge: Number, // Phí dịch vụ
      discountApplied: Number, // Giảm giá
      finalAmount: Number, // Số tiền cuối cùng
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    balanceBefore: Number, // Số dư trước giao dịch
    balanceAfter: Number, // Số dư sau giao dịch
    metadata: mongoose.Schema.Types.Mixed, // Dữ liệu linh hoạt
    createdAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Index for faster queries
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ walletId: 1, createdAt: -1 });
transactionSchema.index({ orderId: 1 });

export default mongoose.model('Transaction', transactionSchema);
