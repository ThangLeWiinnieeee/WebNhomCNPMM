import mongoose from 'mongoose';

/**
 * Wishlist Model Schema
 * Model đại diện cho danh sách sản phẩm yêu thích của user
 * Hỗ trợ cả product và wedding_package
 */
const schema = new mongoose.Schema({
  // Reference đến User model
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
}, {
  timestamps: true, // Tự động tạo createdAt và updatedAt
});

// Index để đảm bảo mỗi user chỉ thích 1 item 1 lần (theo type)
schema.index({ userId: 1, itemId: 1, type: 1 }, { unique: true });

// Index để tìm wishlist theo userId nhanh hơn
schema.index({ userId: 1, createdAt: -1 });

// Tạo model Wishlist với collection name 'wishlists'
const wishlist = mongoose.model('Wishlist', schema, 'wishlists');

export default wishlist;
