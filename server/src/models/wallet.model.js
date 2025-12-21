import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One wallet per user
    },
    balance: {
      type: Number,
      default: 0,
      min: 0, // Balance không được âm
    },
    totalEarnings: {
      type: Number,
      default: 0, // Tổng tiền kiếm được
    },
    totalWithdrawals: {
      type: Number,
      default: 0, // Tổng tiền rút ra
    },
    lastTransaction: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'frozen', 'suspended'],
      default: 'active',
    },
    notes: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Wallet', walletSchema);
