import mongoose from 'mongoose';

/**
 * Product Comment Model Schema
 * Model đại diện cho đánh giá/bình luận của khách hàng về sản phẩm
 * Chỉ lưu text và rating, không lưu orderId hay isVerified
 */
const schema = new mongoose.Schema({
  // Reference đến Product model
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  // Reference đến User model
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Điểm đánh giá (1-5 sao)
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  // Nội dung bình luận
  comment: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true, // Tự động tạo createdAt và updatedAt
});

// Index để tìm comments theo productId nhanh hơn
schema.index({ productId: 1, createdAt: -1 });

// Index để đảm bảo mỗi user chỉ comment 1 lần cho 1 sản phẩm (optional - có thể cho phép nhiều comment)
// schema.index({ productId: 1, userId: 1 }, { unique: true });

// Tạo model ProductComment với collection name 'productcomments'
const productComment = mongoose.model('ProductComment', schema, 'productcomments');

export default productComment;
