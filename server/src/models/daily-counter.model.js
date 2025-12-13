import mongoose from 'mongoose';

const dailyCounterSchema = new mongoose.Schema(
  {
    // Key format: "YYMMDD" (ví dụ: 251211)
    date: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    // Sequential counter for the day
    count: {
      type: Number,
      default: 0,
      min: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model('DailyCounter', dailyCounterSchema);
