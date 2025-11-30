import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
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
  // Tính tổng tiền hàng
  this.totalPrice = this.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  // Tính thuế (10% mặc định)
  this.tax = this.totalPrice * 0.1;

  // Tính tổng cuối cùng
  this.finalTotal = this.totalPrice + this.tax - this.discount;

  next();
});

export default mongoose.model('Cart', cartSchema);
