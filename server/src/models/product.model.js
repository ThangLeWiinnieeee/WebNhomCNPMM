import mongoose from 'mongoose';

/**
 * Product Model Schema
 * Model đại diện cho sản phẩm/dịch vụ trong hệ thống
 * Hỗ trợ 2 loại dịch vụ: quantifiable (có số lượng) và package (gói dịch vụ)
 */
const schema = new mongoose.Schema({
  // Tên sản phẩm/dịch vụ
  name: {
    type: String,
    required: true,
  },
  // Slug URL-friendly (tự động tạo từ tên)
  slug: {
    type: String,
    unique: true,
    sparse: true, // Cho phép null nhưng vẫn unique khi có giá trị
  },
  // Mô tả chi tiết (HTML format)
  description: {
    type: String,
  },
  // rich-editor
  // Mô tả ngắn gọn (hiển thị ở danh sách)
  shortDescription: {
    type: String,
  },
  // Giá gốc (bắt buộc)
  price: {
    type: Number,
    required: true,
  },
  // Giá khuyến mãi (nếu có)
  discountPrice: {
    type: Number,
  },
  // Phần trăm giảm giá (tự động tính từ price và discountPrice)
  discountPercent: {
    type: Number,
    default: 0,
  },
  // Danh sách URL ảnh sản phẩm (lưu trên Cloudinary)
  images: {
    type: [String],
    default: [],
  },
  // Reference đến Category model
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  // Loại dịch vụ: 'quantifiable' (có số lượng) hoặc 'package' (gói dịch vụ)
  serviceType: {
    type: String,
    enum: ['quantifiable', 'package'],
    default: 'package',
  },
  // Đơn vị tính (chỉ dùng cho serviceType = 'quantifiable', ví dụ: 'người', 'bàn', 'm2')
  unit: {
    type: String,
    default: null,
  },
  // Số thứ tự sắp xếp (tự động tăng, dùng để sắp xếp sản phẩm mới nhất)
  orderNumber: {
    type: Number,
    unique: true,
    sparse: true, // Cho phép null nhưng vẫn unique khi có giá trị
  },
  // Số lượt đặt hàng (tăng khi có đơn hàng)
  purchaseCount: {
    type: Number,
    default: 0,
  },
  // Số lượt xem (tăng khi có người xem chi tiết)
  viewCount: {
    type: Number,
    default: 0,
  },
  // Trạng thái active (ẩn/hiện sản phẩm)
  isActive: {
    type: Boolean,
    default: true,
  },
  // Có đang khuyến mãi không
  isPromotion: {
    type: Boolean,
    default: false,
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
 * - Tự động tính discountPercent từ price và discountPrice
 * - Tự động gán orderNumber tăng dần cho sản phẩm mới
 */
schema.pre('save', async function (next) {
  // Tính phần trăm giảm giá nếu có giá khuyến mãi
  if (this.discountPrice && this.price) {
    this.discountPercent = Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }

  // Tự động gán orderNumber cho sản phẩm mới (chưa có orderNumber)
  // orderNumber = orderNumber lớn nhất + 1, hoặc bắt đầu từ 1 nếu chưa có sản phẩm nào
  if (!this.orderNumber && this.isNew) {
    try {
      const ProductModel = mongoose.model('Product');
      const lastProduct = await ProductModel.findOne().sort({ orderNumber: -1 }).exec();
      this.orderNumber = lastProduct && lastProduct.orderNumber ? (lastProduct.orderNumber + 1) : 1;
    } catch (error) {
      // Nếu có lỗi khi query, mặc định bắt đầu từ 1
      this.orderNumber = 1;
    }
  }

  next();
});

// Tạo model Product với collection name 'products'
const product = mongoose.model('Product', schema, 'products');

export default product;

