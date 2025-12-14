import mongoose from 'mongoose';

/**
 * Product View Model Schema
 * Model đại diện cho lượt xem sản phẩm của user
 * Dùng để track recently viewed products và wedding packages
 * Hỗ trợ cả product và wedding_package
 */
const schema = new mongoose.Schema({
  // Reference đến User model (optional - có thể xem mà không cần đăng nhập)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true, // Cho phép null cho user chưa đăng nhập
  },
  // Loại item: 'product' hoặc 'wedding_package'
  type: {
    type: String,
    enum: ['product', 'wedding_package'],
    required: true,
  },
  // Reference đến Product hoặc WeddingPackage model (tùy theo type)
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'typeModel',
  },
  // Dynamic reference dựa trên type
  typeModel: {
    type: String,
    enum: ['Product', 'WeddingPackage'],
    required: true,
  },
  // Thời gian xem
  viewedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true, // Tự động tạo createdAt và updatedAt
});

// Index để tìm views theo userId và itemId nhanh hơn
schema.index({ userId: 1, viewedAt: -1 });
schema.index({ itemId: 1, type: 1, viewedAt: -1 });

// Tạo model ProductView với collection name 'productviews'
const productView = mongoose.model('ProductView', schema, 'productviews');

export default productView;
