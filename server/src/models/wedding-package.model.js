import mongoose from 'mongoose';

/**
 * Wedding Package Model Schema
 * Model đại diện cho gói tiệc cưới trọn gói trong hệ thống
 * Mỗi gói bao gồm nhiều dịch vụ/sản phẩm được liệt kê trong mảng services
 */
const schema = new mongoose.Schema({
  // Tên gói tiệc cưới (ví dụ: "COMBO HAPPY", "COMBO STANDARD")
  name: {
    type: String,
    required: true,
    trim: true,
  },
  // Slug URL-friendly (tự động tạo từ tên)
  slug: {
    type: String,
    unique: true,
    sparse: true, // Cho phép null nhưng vẫn unique khi có giá trị
  },
  // Giá gốc của gói (bắt buộc)
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  // Số tiền giảm giá (VND)
  discount: {
    type: Number,
    default: 0,
    min: 0,
  },
  // Phần trăm giảm giá (tự động tính từ price và discount)
  discountPercent: {
    type: Number,
    default: 0,
  },
  // Danh sách URL ảnh gói tiệc (lưu trên Cloudinary)
  images: {
    type: [String],
    default: [],
  },
  // Danh sách tên các dịch vụ/sản phẩm trong gói (mảng string)
  services: {
    type: [String],
    default: [],
  },
  // Mô tả chi tiết về gói (HTML format)
  description: {
    type: String,
  },
  // Mô tả ngắn gọn (hiển thị ở danh sách)
  shortDescription: {
    type: String,
  },
  // Trạng thái active (ẩn/hiện gói)
  isActive: {
    type: Boolean,
    default: true,
  },
  // Số thứ tự sắp xếp (tự động tăng, dùng để sắp xếp gói mới nhất)
  orderNumber: {
    type: Number,
    unique: true,
    sparse: true, // Cho phép null nhưng vẫn unique khi có giá trị
  },
  // Số lượt xem (tăng khi có người xem chi tiết)
  viewCount: {
    type: Number,
    default: 0,
  },
  // Số lượt đặt hàng (tăng khi có đơn hàng)
  purchaseCount: {
    type: Number,
    default: 0,
  },
  // Danh sách tags để tìm kiếm và filter
  tags: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true, // Tự động tạo createdAt và updatedAt
});

/**
 * Pre-save hook: Tự động xử lý trước khi lưu document
 * - Tự động tính discountPercent từ price và discount
 * - Tự động gán orderNumber tăng dần cho gói mới
 */
schema.pre('save', async function (next) {
  // Tính phần trăm giảm giá nếu có discount
  if (this.discount && this.price) {
    this.discountPercent = Math.round((this.discount / this.price) * 100);
  }

  // Tự động gán orderNumber cho gói mới (chưa có orderNumber)
  // orderNumber = orderNumber lớn nhất + 1, hoặc bắt đầu từ 1 nếu chưa có gói nào
  if (!this.orderNumber && this.isNew) {
    try {
      const WeddingPackageModel = mongoose.model('WeddingPackage');
      const lastPackage = await WeddingPackageModel.findOne().sort({ orderNumber: -1 }).exec();
      this.orderNumber = lastPackage && lastPackage.orderNumber ? (lastPackage.orderNumber + 1) : 1;
    } catch (error) {
      // Nếu có lỗi khi query, mặc định bắt đầu từ 1
      this.orderNumber = 1;
    }
  }

  next();
});

// Tạo model WeddingPackage với collection name 'weddingpackages'
const weddingPackage = mongoose.model('WeddingPackage', schema, 'weddingpackages');

export default weddingPackage;
