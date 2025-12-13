import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  serviceName: String,
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  price: {
    type: Number,
    required: true
  },
  // Dành cho dịch vụ tiệc cưới, có thể chứa các thông tin cụ thể
  selectedOptions: {
    guestCount: Number,
    theme: String,
    date: Date,
    additionalNotes: String
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  finalTotal: {
    type: Number,
    default: 0
  },
  notes: String,
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  }
}, {
  timestamps: true,
  collection: 'carts'
});

// Pre-save middleware để tính toán tổng tiền
cartSchema.pre('save', function(next) {
  try {
    // Tính tổng tiền hàng
    this.totalPrice = this.items.reduce((sum, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);

    // Tính thuế (10% mặc định)
    this.tax = Math.round(this.totalPrice * 0.1 * 100) / 100;

    // Tính tổng cuối cùng (giảm giá nếu có)
    this.finalTotal = Math.round((this.totalPrice + this.tax - (this.discount || 0)) * 100) / 100;

    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Cart', cartSchema);
