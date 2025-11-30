import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID user từ auth
  orderNumber: { type: String, unique: true, required: true }, // e.g., 'WD-001' - sẽ auto-generate nếu thiếu
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  items: [{
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }, // Nếu có model Service
    name: { type: String, required: true }, // Tên dịch vụ
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true }, // Tổng tiền
  createdAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString().slice(-6); // Lấy 6 chữ số cuối timestamp
    this.orderNumber = `WD-${timestamp}-${Math.floor(Math.random() * 1000)}`; // WD- + timestamp + random để unique
  }
  next();
});

export default mongoose.model('Order', orderSchema);