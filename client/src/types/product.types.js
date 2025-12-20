/**
 * @typedef {Object} CategoryReference
 * @property {string} _id - Category ID
 * @property {string} name - Category name
 */

/**
 * Product Interface - Based on Mongoose Schema
 * 
 * @typedef {Object} IProduct
 * @property {string} _id - MongoDB ObjectId (from Mongoose)
 * @property {string} name - Product name (required)
 * @property {string} [slug] - URL-friendly slug (optional)
 * @property {string} [description] - Full product description (optional)
 * @property {string} [shortDescription] - Brief product description (optional)
 * @property {number} price - Product price (required)
 * @property {number} [discountPrice] - Discounted price (optional)
 * @property {number} [discountPercent] - Discount percentage, default: 0
 * @property {string[]} [images] - Array of image URLs, default: []
 * @property {CategoryReference|string} category - Category object (populated) or ObjectId string (required)
 * @property {'quantifiable'|'package'} [serviceType] - Service type, default: 'package'
 * @property {string|null} [unit] - Unit of measurement for quantifiable services (optional)
 * @property {number} [orderNumber] - Display order number (optional)
 * @property {number} [purchaseCount] - Number of purchases, default: 0
 * @property {number} [viewCount] - Number of views, default: 0
 * @property {boolean} [isActive] - Whether product is active, default: true
 * @property {boolean} [isPromotion] - Whether product is on promotion, default: false
 * @property {string[]} [tags] - Product tags array, default: []
 * @property {Date|string} [createdAt] - Creation timestamp (from Mongoose timestamps)
 * @property {Date|string} [updatedAt] - Last update timestamp (from Mongoose timestamps)
 */

/**
 * Sample Product Mock Data
 * Full example with all fields for UI testing
 */
export const sampleProduct = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Gói tiệc cưới Luxury',
  slug: 'goi-tiec-cuoi-luxury',
  description: `Gói tiệc cưới Luxury là sự kết hợp hoàn hảo giữa truyền thống và hiện đại, mang đến cho bạn một ngày cưới đáng nhớ nhất. 

Bao gồm đầy đủ các dịch vụ:
• Trang trí sảnh tiệc cao cấp với hoa tươi nhập khẩu
• Quầy bar với rượu vang và cocktail signature
• Hệ thống âm thanh, ánh sáng chuyên nghiệp
• MC chuyên nghiệp dẫn chương trình
• Đội ngũ phục vụ tận tâm, chuyên nghiệp
• Thực đơn 8 món đa dạng, đảm bảo chất lượng
• Quay phim, chụp ảnh với team chuyên nghiệp
• Bánh cưới 3 tầng cao cấp

Địa điểm: Khách sạn 5 sao hoặc sảnh tiệc cao cấp
Thời gian: Toàn bộ ngày cưới từ sáng đến tối`,
  shortDescription: 'Gói tiệc cưới cao cấp với đầy đủ dịch vụ từ trang trí, MC, phục vụ đến quay phim chụp ảnh. Địa điểm tại khách sạn 5 sao.',
  price: 50000000,
  discountPrice: 42000000,
  discountPercent: 16,
  images: [
    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80',
  ],
  category: {
    _id: '507f191e810c19729de860ea',
    name: 'Tổ Chức Tiệc Cưới',
  },
  serviceType: 'package',
  unit: null,
  orderNumber: 1,
  purchaseCount: 256,
  viewCount: 1248,
  isActive: true,
  isPromotion: true,
  tags: ['tiệc cưới', 'luxury', 'cao cấp', 'wedding', 'full service'],
  createdAt: '2024-01-15T08:30:00.000Z',
  updatedAt: '2024-03-20T14:22:00.000Z',
};

/**
 * Sample Product with Quantifiable Service Type
 */
export const sampleQuantifiableProduct = {
  _id: '507f1f77bcf86cd799439012',
  name: 'Dịch vụ MC tiệc cưới',
  slug: 'dich-vu-mc-tiec-cuoi',
  description: 'Dịch vụ MC chuyên nghiệp cho tiệc cưới với kinh nghiệm dày dạn.',
  shortDescription: 'MC chuyên nghiệp với nhiều năm kinh nghiệm',
  price: 5000000,
  discountPrice: 4500000,
  discountPercent: 10,
  images: [
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80',
  ],
  category: {
    _id: '507f191e810c19729de860eb',
    name: 'MC & Dẫn Chương Trình',
  },
  serviceType: 'quantifiable',
  unit: 'người',
  orderNumber: 2,
  purchaseCount: 89,
  viewCount: 567,
  isActive: true,
  isPromotion: false,
  tags: ['mc', 'dẫn chương trình', 'tiệc cưới'],
  createdAt: '2024-01-20T10:15:00.000Z',
  updatedAt: '2024-03-18T09:45:00.000Z',
};

/**
 * Sample Product without discount
 */
export const sampleProductNoDiscount = {
  _id: '507f1f77bcf86cd799439013',
  name: 'Gói tiệc cưới cơ bản',
  slug: 'goi-tiec-cuoi-co-ban',
  description: 'Gói tiệc cưới cơ bản với đầy đủ các dịch vụ thiết yếu.',
  shortDescription: 'Gói tiệc cưới cơ bản với giá cả hợp lý',
  price: 20000000,
  discountPrice: null,
  discountPercent: 0,
  images: [
    'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
  ],
  category: {
    _id: '507f191e810c19729de860ea',
    name: 'Tổ Chức Tiệc Cưới',
  },
  serviceType: 'package',
  unit: null,
  orderNumber: 3,
  purchaseCount: 512,
  viewCount: 2345,
  isActive: true,
  isPromotion: false,
  tags: ['tiệc cưới', 'cơ bản', 'budget'],
  createdAt: '2024-01-10T07:00:00.000Z',
  updatedAt: '2024-03-15T16:30:00.000Z',
};

/**
 * Review Interface - For product reviews
 * 
 * @typedef {Object} Review
 * @property {string} _id - Review ID
 * @property {string} productId - Product ID
 * @property {string} userId - User ID
 * @property {string} orderId - Order ID (for validation)
 * @property {number} rating - Rating (1-5)
 * @property {string} comment - Review comment
 * @property {string[]} images - Review images
 * @property {Date|string} createdAt - Creation timestamp
 * @property {Date|string} updatedAt - Update timestamp
 */

/**
 * User Points Interface - For loyalty points
 * 
 * @typedef {Object} UserPoints
 * @property {string} _id - Points record ID
 * @property {string} userId - User ID
 * @property {number} points - Current points balance
 * @property {number} totalEarned - Total points earned
 * @property {Date|string} lastUpdated - Last update timestamp
 */

/**
 * Coupon Interface - For discount codes
 * 
 * @typedef {Object} Coupon
 * @property {string} _id - Coupon ID
 * @property {string} code - Coupon code
 * @property {string} userId - User ID
 * @property {number} discount - Discount percentage
 * @property {Date} expiryDate - Expiry date
 * @property {boolean} isUsed - Whether used
 * @property {string} type - Coupon type (e.g., 'review-reward')
 */

// Export type definition for use in JSDoc comments
export default {
  sampleProduct,
  sampleQuantifiableProduct,
  sampleProductNoDiscount,
};

// Export interfaces for TypeScript/JS use (if using TS, convert to interface)
export { Review, UserPoints, Coupon } from './product.types'; // Self-export for convenience