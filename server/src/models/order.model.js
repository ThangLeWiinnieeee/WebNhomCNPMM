import mongoose from 'mongoose';
import DailyCounter from './daily-counter.model.js';

const orderItemSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    serviceName: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    selectedOptions: {
      guestCount: Number,
      theme: String,
      date: Date,
      additionalNotes: String
    }
  },
  { _id: true }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    orderID: {
      type: String,
      unique: true,
      sparse: true,
      default: null
    },
    // Thông tin khách hàng
    customerInfo: {
      fullName: {
        type: String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        lowercase: true
      },
      phone: {
        type: String,
        required: true
      },
      address: {
        type: String,
        required: true
      },
      city: String,
      district: String,
      ward: String,
      notes: String // Ghi chú đặc biệt
    },
    // Chi tiết đơn hàng
    items: [orderItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    finalTotal: {
      type: Number,
      required: true,
      min: 0
    },
    // Thanh toán
    paymentMethod: {
      type: String,
      enum: ['cod', 'zalopay', 'credit_card'],
      default: 'cod'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending'
    },
    // Payment gateway data (for ZaloPay, etc.)
    paymentData: {
      transactionId: String,
      provider: String, // 'zalopay', 'stripe', etc.
      status: String, // 'pending', 'completed', 'failed'
      createdAt: Date,
      completedAt: Date,
      failedAt: Date,
      failureReason: String,
      zaloPayData: Object, // ZaloPay specific data
    },
    // Trạng thái đơn hàng
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'completed', 'cancelled'],
      default: 'pending'
    },
    // Thời gian
    eventDate: {
      type: Date,
      required: true
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

// Middleware để tạo orderID tự động theo ngày (YYMMDD + sequential number)
// Sử dụng Atomic Update với DailyCounter để tránh race condition
orderSchema.pre('save', async function (next) {
  try {
    if (this.isNew && !this.orderID) {
      // Tạo key theo ngày hiện tại dạng YYMMDD (ví dụ: 251211)
      const now = new Date();
      const year = String(now.getFullYear()).slice(-2);
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const dateKey = `${year}${month}${day}`;
      
      // Sử dụng findOneAndUpdate với $inc để tăng counter một cách atomic
      // Nếu document chưa tồn tại, nó sẽ được tạo với count = 1
      const counter = await DailyCounter.findOneAndUpdate(
        { date: dateKey },
        { 
          $inc: { count: 1 },
          $set: { updatedAt: new Date() }
        },
        { 
          new: true,  // Trả về document sau khi update
          upsert: true  // Tạo document nếu không tồn tại
        }
      );
      
      // Tạo orderID với sequential number được formatted (001, 002, ..., 999, 1000, ...)
      const sequentialNumber = String(counter.count).padStart(3, '0');
      this.orderID = `${dateKey}${sequentialNumber}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware tính toán tự động (chạy sau orderID middleware)
orderSchema.pre('save', function (next) {
  try {
    // Tính totalPrice từ items
    this.totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Tính tax (10%)
    this.tax = Math.round(this.totalPrice * 0.1 * 100) / 100;
    
    // Tính finalTotal
    this.finalTotal = this.totalPrice + this.tax - (this.discount || 0);
    
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Order', orderSchema);
