import mongoose from 'mongoose';

/**
 * Category Model Schema
 * Model đại diện cho danh mục sản phẩm/dịch vụ
 * Mỗi sản phẩm phải thuộc một danh mục
 */
const schema = new mongoose.Schema({
  // Tên danh mục (bắt buộc, unique)
  name: {
    type: String,
    required: true,
    unique: true,
  },
  // Slug URL-friendly (tự động tạo từ tên)
  slug: {
    type: String,
    unique: true,
    sparse: true, // Cho phép null nhưng vẫn unique khi có giá trị
  },
  // Mô tả danh mục
  description: {
    type: String,
  },
  // URL ảnh đại diện cho danh mục (lưu trên Cloudinary)
  image: {
    type: String,
  },
  // Trạng thái active (ẩn/hiện danh mục)
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true, // Tự động tạo createdAt và updatedAt
});

// Tạo model Category với collection name 'categories'
const category = mongoose.model('Category', schema, 'categories');

export default category;

