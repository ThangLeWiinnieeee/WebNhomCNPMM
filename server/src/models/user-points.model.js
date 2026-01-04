// model điểm tích lũy
import mongoose from 'mongoose';

const userPointsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('UserPoints', userPointsSchema);
