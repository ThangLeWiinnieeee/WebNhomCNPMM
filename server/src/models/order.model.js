import mongoose from 'mongoose';

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
    orderNumber: {
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

// Middleware để tạo orderNumber tự động
orderSchema.pre('save', async function (next) {
  try {
    if (this.isNew && !this.orderNumber) {
      const count = await mongoose.model('Order').countDocuments();
      this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware tính toán tự động (chạy sau orderNumber middleware)
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
