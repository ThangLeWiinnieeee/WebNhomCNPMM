import mongoose from 'mongoose';
import categoryModel from './src/models/category.model.js';
import productModel from './src/models/product.model.js';
import 'dotenv/config';

// Dữ liệu categories mẫu - 6 dịch vụ wedding
const categoriesData = [
  {
    name: 'Tổ chức tiệc cưới',
    slug: 'to-chuc-tiec-cuoi',
    description: 'Lên kế hoạch và tổ chức tiệc cưới hoàn hảo theo phong cách của bạn',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=500',
    isActive: true,
  },
  {
    name: 'Chụp ảnh cưới',
    slug: 'chup-anh-cuoi',
    description: 'Lưu giữ những khoảnh khắc đẹp nhất của ngày trọng đại',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=500',
    isActive: true,
  },
  {
    name: 'Trang trí hoa',
    slug: 'trang-tri-hoa',
    description: 'Thiết kế và trang trí hoa tươi sang trọng, độc đáo',
    image: 'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=500',
    isActive: true,
  },
  {
    name: 'Âm thanh - Ánh sáng',
    slug: 'am-thanh-anh-sang',
    description: 'Hệ thống âm thanh, ánh sáng chuyên nghiệp, hiện đại',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500',
    isActive: true,
  },
  {
    name: 'Bánh cưới',
    slug: 'banh-cuoi',
    description: 'Bánh cưới độc quyền với thiết kế sang trọng và tinh tế',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500',
    isActive: true,
  },
  {
    name: 'Trang phục cưới',
    slug: 'trang-phuc-cuoi',
    description: 'Cho thuê và thiết kế trang phục cưới cao cấp',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500',
    isActive: true,
  },
];

// Dữ liệu products mẫu - 50+ sản phẩm với serviceType và unit phù hợp
const productsData = [
  // ========== TỔ CHỨC TIỆC CƯỚI (package) ==========
  {
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
    serviceType: 'package',
    unit: null,
    purchaseCount: 256,
    viewCount: 1248,
    isPromotion: true,
    tags: ['tiệc cưới', 'luxury', 'cao cấp', 'wedding', 'full service'],
  },
  {
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
    serviceType: 'package',
    unit: null,
    orderNumber: 3,
    purchaseCount: 512,
    viewCount: 2345,
    isActive: true,
    isPromotion: false,
    tags: ['tiệc cưới', 'cơ bản', 'budget'],
  },
  {
    name: 'Gói tổ chức tiệc cưới cao cấp',
    description: 'Gói dịch vụ tổ chức tiệc cưới cao cấp với đầy đủ dịch vụ: wedding planner chuyên nghiệp, trang trí cao cấp, MC, phục vụ. Phù hợp cho các đám cưới lớn.',
    shortDescription: 'Gói tổ chức tiệc cưới cao cấp đầy đủ dịch vụ',
    price: 35000000,
    discountPrice: 28000000,
    images: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    ],
    serviceType: 'package',
    unit: null,
    purchaseCount: 650,
    viewCount: 2800,
    isPromotion: true,
    tags: ['tổ chức tiệc', 'cao cấp', 'wedding planner'],
  },
  {
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
    serviceType: 'quantifiable',
    unit: 'người',
    orderNumber: 2,
    purchaseCount: 89,
    viewCount: 567,
    isActive: true,
    isPromotion: false,
    tags: ['mc', 'dẫn chương trình', 'tiệc cưới'],
  },
  {
    name: 'Gói tổ chức tiệc cưới trọn gói',
    description: 'Gói tổ chức tiệc cưới trọn gói bao gồm tất cả: lên kế hoạch, trang trí, MC, âm thanh ánh sáng, phục vụ. Giải pháp hoàn hảo cho đám cưới của bạn.',
    shortDescription: 'Gói tổ chức tiệc cưới trọn gói đầy đủ',
    price: 50000000,
    discountPrice: 40000000,
    images: [
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    ],
    serviceType: 'package',
    unit: null,
    purchaseCount: 420,
    viewCount: 1900,
    isPromotion: true,
    tags: ['tổ chức tiệc', 'trọn gói', 'đầy đủ'],
  },
  {
    name: 'Dịch vụ phục vụ tiệc cưới',
    description: 'Dịch vụ phục vụ tiệc cưới chuyên nghiệp với đội ngũ nhân viên được đào tạo, phục vụ tận tình, chu đáo.',
    shortDescription: 'Dịch vụ phục vụ tiệc cưới chuyên nghiệp',
    price: 8000000,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
    ],
    serviceType: 'package',
    unit: null,
    purchaseCount: 580,
    viewCount: 2400,
    isPromotion: false,
    tags: ['phục vụ', 'nhân viên', 'tiệc cưới'],
  },
  {
    name: 'Dịch vụ trang điểm cô dâu',
    description: 'Dịch vụ trang điểm cô dâu chuyên nghiệp với đội ngũ makeup artist giàu kinh nghiệm. Bao gồm trang điểm và làm tóc.',
    shortDescription: 'Dịch vụ trang điểm cô dâu chuyên nghiệp',
    price: 3000000,
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800',
    ],
    serviceType: 'package',
    unit: null,
    purchaseCount: 850,
    viewCount: 3200,
    isPromotion: false,
    tags: ['trang điểm', 'makeup', 'cô dâu'],
  },
  {
    name: 'Dịch vụ trang điểm cô dâu cao cấp',
    description: 'Dịch vụ trang điểm cô dâu cao cấp với makeup artist chuyên nghiệp. Bao gồm trang điểm, làm tóc, và chụp ảnh makeover.',
    shortDescription: 'Dịch vụ trang điểm cô dâu cao cấp',
    price: 8000000,
    discountPrice: 6500000,
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800',
    ],
    serviceType: 'package',
    unit: null,
    purchaseCount: 520,
    viewCount: 2100,
    isPromotion: true,
    tags: ['trang điểm', 'cao cấp', 'makeup'],
  },
  {
    name: 'Dịch vụ lên kế hoạch tiệc cưới',
    description: 'Dịch vụ lên kế hoạch tiệc cưới chi tiết với wedding planner chuyên nghiệp. Tư vấn và lên kế hoạch hoàn chỉnh cho đám cưới của bạn.',
    shortDescription: 'Dịch vụ lên kế hoạch tiệc cưới chuyên nghiệp',
    price: 10000000,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
    ],
    serviceType: 'package',
    unit: null,
    purchaseCount: 380,
    viewCount: 1600,
    isPromotion: false,
    tags: ['lên kế hoạch', 'wedding planner', 'tư vấn'],
  },

  // ========== CHỤP ẢNH CƯỚI (package) ==========
  {
    name: 'Gói chụp ảnh cưới cơ bản',
    description: 'Gói chụp ảnh cưới cơ bản bao gồm: chụp ảnh trong ngày cưới, 100 ảnh chỉnh sửa, album cưới. Phù hợp cho các cặp đôi muốn lưu giữ kỷ niệm.',
    shortDescription: 'Gói chụp ảnh cưới cơ bản với 100 ảnh',
    price: 8000000,
    discountPrice: 6500000,
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800',
    ],
    serviceType: 'package',
    unit: null,
    purchaseCount: 1100,
    viewCount: 4500,
    isPromotion: true,
    tags: ['chụp ảnh', 'cơ bản', 'album cưới'],
  },
  {
    name: 'Gói chụp ảnh cưới ngoại cảnh',
    description: 'Gói chụp ảnh cưới ngoại cảnh với nhiều địa điểm đẹp. Bao gồm: chụp ảnh trước ngày cưới, 200 ảnh chỉnh sửa, album cao cấp.',
    shortDescription: 'Gói chụp ảnh cưới ngoại cảnh nhiều địa điểm',
    price: 15000000,
    discountPrice: 12000000,
    images: [
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800',
    ],
    serviceType: 'package',
    unit: null,
    purchaseCount: 850,
    viewCount: 3800,
    isPromotion: true,
    tags: ['chụp ảnh', 'ngoại cảnh', 'album'],
  },
  {
    name: 'Gói quay phim cưới',
    description: 'Gói quay phim cưới chuyên nghiệp với đội ngũ quay phim giàu kinh nghiệm. Bao gồm: video highlight, video đầy đủ, drone footage.',
    shortDescription: 'Gói quay phim cưới chuyên nghiệp với drone',
    price: 20000000,
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    ],
    serviceType: 'package',
    unit: null,
    purchaseCount: 520,
    viewCount: 2100,
    isPromotion: false,
    tags: ['quay phim', 'video', 'drone'],
  },
  {
    name: 'Gói chụp ảnh + quay phim trọn gói',
    description: 'Gói chụp ảnh và quay phim trọn gói với giá ưu đãi. Bao gồm: chụp ảnh, quay phim, album, video highlight, drone footage.',
    shortDescription: 'Gói chụp ảnh + quay phim trọn gói',
    price: 30000000,
    discountPrice: 24000000,
    images: [
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800',
    ],
    serviceType: 'package',
    unit: null,
    purchaseCount: 680,
    viewCount: 2900,
    isPromotion: true,
    tags: ['chụp ảnh', 'quay phim', 'trọn gói'],
  },
  {
    name: 'Gói chụp ảnh cưới premium',
    description: 'Gói chụp ảnh cưới premium với nhiếp ảnh gia chuyên nghiệp. Bao gồm: chụp ảnh trong và ngoài ngày cưới, 300 ảnh chỉnh sửa, album cao cấp.',
    shortDescription: 'Gói chụp ảnh cưới premium',
    price: 25000000,
    discountPrice: 20000000,
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    ],
    serviceType: 'package',
    unit: null,
    purchaseCount: 420,
    viewCount: 1800,
    isPromotion: true,
    tags: ['chụp ảnh', 'premium', 'nhiếp ảnh gia'],
  },
  {
    name: 'Gói quay phim cưới 4K',
    description: 'Gói quay phim cưới chất lượng 4K với đội ngũ quay phim chuyên nghiệp. Bao gồm: video 4K, drone footage, video highlight.',
    shortDescription: 'Gói quay phim cưới chất lượng 4K',
    price: 28000000,
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    ],
    serviceType: 'package',
    unit: null,
    purchaseCount: 350,
    viewCount: 1500,
    isPromotion: false,
    tags: ['quay phim', '4K', 'drone'],
  },
  {
    name: 'Chụp ảnh cưới theo giờ',
    description: 'Dịch vụ chụp ảnh cưới theo giờ với nhiếp ảnh gia chuyên nghiệp. Phù hợp cho các đám cưới nhỏ hoặc cần thêm giờ chụp.',
    shortDescription: 'Chụp ảnh cưới theo giờ',
    price: 2000000,
    images: [
      'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800',
    ],
    serviceType: 'package',
    unit: null,
    purchaseCount: 280,
    viewCount: 1200,
    isPromotion: false,
    tags: ['chụp ảnh', 'theo giờ'],
  },

  // ========== TRANG TRÍ HOA (quantifiable) ==========
  {
    name: 'Hoa cưới hồng lãng mạn',
    description: 'Bó hoa cưới màu hồng lãng mạn, tươi mới. Phù hợp cho cô dâu trong ngày cưới. Hoa được chọn lọc kỹ, tươi lâu.',
    shortDescription: 'Bó hoa cưới màu hồng lãng mạn',
    price: 1500000,
    discountPrice: 1200000,
    images: [
      'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800',
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'bó',
    purchaseCount: 1200,
    viewCount: 4800,
    isPromotion: true,
    tags: ['hoa cưới', 'hồng', 'lãng mạn'],
  },
  {
    name: 'Hoa trang trí tiệc cưới',
    description: 'Hoa trang trí tiệc cưới với nhiều loại hoa tươi, tạo không gian lãng mạn cho đám cưới. Bao gồm: hoa bàn tiệc, hoa cổng chào, hoa sân khấu.',
    shortDescription: 'Hoa trang trí tiệc cưới đầy đủ',
    price: 5000000,
    discountPrice: 4000000,
    images: [
      'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'bộ',
    purchaseCount: 920,
    viewCount: 3600,
    isPromotion: true,
    tags: ['hoa trang trí', 'tiệc cưới', 'đầy đủ'],
  },
  {
    name: 'Hoa cưới trắng tinh khôi',
    description: 'Bó hoa cưới màu trắng tinh khôi, thanh khiết. Phù hợp cho các đám cưới truyền thống. Hoa được bảo quản tốt, tươi lâu.',
    shortDescription: 'Bó hoa cưới màu trắng tinh khôi',
    price: 1800000,
    images: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'bó',
    purchaseCount: 720,
    viewCount: 2800,
    isPromotion: false,
    tags: ['hoa cưới', 'trắng', 'tinh khôi'],
  },
  {
    name: 'Vòng hoa đội đầu cô dâu',
    description: 'Vòng hoa đội đầu cô dâu thiết kế tinh tế, thanh lịch. Phù hợp cho các cô dâu yêu thích phong cách tự nhiên, lãng mạn.',
    shortDescription: 'Vòng hoa đội đầu cô dâu tinh tế',
    price: 800000,
    images: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'cái',
    purchaseCount: 580,
    viewCount: 2200,
    isPromotion: false,
    tags: ['vòng hoa', 'đội đầu', 'cô dâu'],
  },
  {
    name: 'Hoa cổng chào cưới',
    description: 'Hoa cổng chào cưới thiết kế lộng lẫy, tạo điểm nhấn cho đám cưới. Phù hợp cho các đám cưới lớn, sang trọng.',
    shortDescription: 'Hoa cổng chào cưới lộng lẫy',
    price: 3000000,
    images: [
      'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'bộ',
    purchaseCount: 420,
    viewCount: 1600,
    isPromotion: false,
    tags: ['hoa cổng chào', 'trang trí', 'lộng lẫy'],
  },
  {
    name: 'Hoa cưới đỏ rực rỡ',
    description: 'Bó hoa cưới màu đỏ rực rỡ, tươi tắn. Phù hợp cho các đám cưới theo phong cách Á Đông.',
    shortDescription: 'Bó hoa cưới màu đỏ rực rỡ',
    price: 2000000,
    images: [
      'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'bó',
    purchaseCount: 680,
    viewCount: 2600,
    isPromotion: false,
    tags: ['hoa cưới', 'đỏ', 'rực rỡ'],
  },
  {
    name: 'Hoa cưới tím lãng mạn',
    description: 'Bó hoa cưới màu tím lãng mạn, độc đáo. Phù hợp cho các cô dâu yêu thích phong cách hiện đại.',
    shortDescription: 'Bó hoa cưới màu tím lãng mạn',
    price: 1700000,
    discountPrice: 1400000,
    images: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'bó',
    purchaseCount: 550,
    viewCount: 2100,
    isPromotion: true,
    tags: ['hoa cưới', 'tím', 'lãng mạn'],
  },
  {
    name: 'Chậu hoa trang trí bàn tiệc',
    description: 'Chậu hoa trang trí bàn tiệc với thiết kế tinh tế, tạo không gian lãng mạn cho bàn tiệc.',
    shortDescription: 'Chậu hoa trang trí bàn tiệc',
    price: 500000,
    images: [
      'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'chậu',
    purchaseCount: 850,
    viewCount: 3200,
    isPromotion: false,
    tags: ['hoa trang trí', 'bàn tiệc', 'chậu hoa'],
  },
  {
    name: 'Hoa cưới vàng tươi sáng',
    description: 'Bó hoa cưới màu vàng tươi sáng, rực rỡ. Phù hợp cho các đám cưới mùa xuân, tươi mới.',
    shortDescription: 'Bó hoa cưới màu vàng tươi sáng',
    price: 1600000,
    images: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'bó',
    purchaseCount: 480,
    viewCount: 1900,
    isPromotion: false,
    tags: ['hoa cưới', 'vàng', 'tươi sáng'],
  },
  {
    name: 'Hoa cưới phối màu hiện đại',
    description: 'Bó hoa cưới phối màu hiện đại, độc đáo. Thiết kế theo xu hướng mới nhất, phù hợp cho các cô dâu yêu thích phong cách hiện đại.',
    shortDescription: 'Bó hoa cưới phối màu hiện đại',
    price: 2200000,
    discountPrice: 1800000,
    images: [
      'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'bó',
    purchaseCount: 620,
    viewCount: 2400,
    isPromotion: true,
    tags: ['hoa cưới', 'phối màu', 'hiện đại'],
  },

  // ========== ÂM THANH - ÁNH SÁNG (package) ==========
  {
    name: 'Thuê hệ thống âm thanh cơ bản',
    description: 'Thuê hệ thống âm thanh cơ bản cho tiệc cưới. Bao gồm: loa, micro, mixer. Phù hợp cho các đám cưới nhỏ với 50-100 khách.',
    shortDescription: 'Thuê hệ thống âm thanh cơ bản',
    price: 3000000,
    discountPrice: 2400000,
    images: [
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    ],
    serviceType: 'package',
    unit: null,
    purchaseCount: 1100,
    viewCount: 4200,
    isPromotion: true,
    tags: ['âm thanh', 'cơ bản', 'thuê'],
  },
  {
    name: 'Thuê hệ thống âm thanh cao cấp',
    description: 'Thuê hệ thống âm thanh cao cấp với chất lượng âm thanh tuyệt vời. Bao gồm: loa công suất lớn, micro không dây, mixer chuyên nghiệp.',
    shortDescription: 'Thuê hệ thống âm thanh cao cấp',
    price: 8000000,
    discountPrice: 6500000,
    images: [
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    ],
    serviceType: 'package',
    unit: null,
    purchaseCount: 650,
    viewCount: 2800,
    isPromotion: true,
    tags: ['âm thanh', 'cao cấp', 'chuyên nghiệp'],
  },
  {
    name: 'Thuê hệ thống ánh sáng LED',
    description: 'Thuê hệ thống ánh sáng LED chuyên nghiệp cho tiệc cưới. Tạo không gian lãng mạn, sang trọng với nhiều hiệu ứng ánh sáng đẹp mắt.',
    shortDescription: 'Thuê hệ thống ánh sáng LED chuyên nghiệp',
    price: 5000000,
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    ],
    serviceType: 'package',
    unit: null,
    purchaseCount: 720,
    viewCount: 3100,
    isPromotion: false,
    tags: ['ánh sáng', 'LED', 'chuyên nghiệp'],
  },
  {
    name: 'Gói âm thanh + ánh sáng trọn gói',
    description: 'Gói thuê âm thanh và ánh sáng trọn gói với giá ưu đãi. Bao gồm: hệ thống âm thanh cao cấp, ánh sáng LED, nhân viên vận hành.',
    shortDescription: 'Gói âm thanh + ánh sáng trọn gói',
    price: 12000000,
    discountPrice: 10000000,
    images: [
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    ],
    serviceType: 'package',
    unit: null,
    purchaseCount: 850,
    viewCount: 3600,
    isPromotion: true,
    tags: ['âm thanh', 'ánh sáng', 'trọn gói'],
  },
  {
    name: 'Thuê hệ thống karaoke',
    description: 'Thuê hệ thống karaoke cho tiệc cưới. Bao gồm: loa karaoke, micro, màn hình, đầu karaoke. Tạo không khí vui vẻ cho đám cưới.',
    shortDescription: 'Thuê hệ thống karaoke cho tiệc cưới',
    price: 4000000,
    images: [
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    ],
    serviceType: 'package',
    unit: null,
    purchaseCount: 580,
    viewCount: 2400,
    isPromotion: false,
    tags: ['karaoke', 'giải trí', 'tiệc cưới'],
  },
  {
    name: 'Thuê hệ thống ánh sáng sân khấu',
    description: 'Thuê hệ thống ánh sáng sân khấu chuyên nghiệp với nhiều hiệu ứng đẹp mắt. Tạo không gian sân khấu lộng lẫy cho đám cưới.',
    shortDescription: 'Thuê hệ thống ánh sáng sân khấu',
    price: 6000000,
    discountPrice: 4800000,
    images: [
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    ],
    serviceType: 'package',
    unit: null,
    purchaseCount: 450,
    viewCount: 1800,
    isPromotion: true,
    tags: ['ánh sáng', 'sân khấu', 'chuyên nghiệp'],
  },
  {
    name: 'Thuê hệ thống âm thanh không dây',
    description: 'Thuê hệ thống âm thanh không dây hiện đại, tiện lợi. Phù hợp cho các đám cưới ngoài trời hoặc không gian rộng.',
    shortDescription: 'Thuê hệ thống âm thanh không dây',
    price: 7000000,
    images: [
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    ],
    serviceType: 'package',
    unit: null,
    purchaseCount: 380,
    viewCount: 1500,
    isPromotion: false,
    tags: ['âm thanh', 'không dây', 'hiện đại'],
  },

  // ========== BÁNH CƯỚI (quantifiable) ==========
  {
    name: 'Bánh cưới 3 tầng sang trọng',
    description: 'Bánh cưới 3 tầng thiết kế sang trọng với lớp kem bơ thơm ngon. Trang trí hoa đường tinh tế, phù hợp cho các đám cưới lớn.',
    shortDescription: 'Bánh cưới 3 tầng sang trọng',
    price: 5000000,
    discountPrice: 4000000,
    images: [
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'chiếc',
    purchaseCount: 980,
    viewCount: 3800,
    isPromotion: true,
    tags: ['bánh cưới', '3 tầng', 'sang trọng'],
  },
  {
    name: 'Bánh cưới 2 tầng đơn giản',
    description: 'Bánh cưới 2 tầng thiết kế đơn giản nhưng tinh tế. Phù hợp cho các đám cưới nhỏ. Bánh thơm ngon, đẹp mắt.',
    shortDescription: 'Bánh cưới 2 tầng đơn giản',
    price: 3000000,
    images: [
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'chiếc',
    purchaseCount: 650,
    viewCount: 2500,
    isPromotion: false,
    tags: ['bánh cưới', '2 tầng', 'đơn giản'],
  },
  {
    name: 'Bánh cưới 4 tầng hoàng gia',
    description: 'Bánh cưới 4 tầng thiết kế hoàng gia, lộng lẫy. Phù hợp cho các đám cưới lớn, sang trọng. Bánh được làm thủ công, tinh tế.',
    shortDescription: 'Bánh cưới 4 tầng hoàng gia',
    price: 8000000,
    discountPrice: 6500000,
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'chiếc',
    purchaseCount: 420,
    viewCount: 1900,
    isPromotion: true,
    tags: ['bánh cưới', '4 tầng', 'hoàng gia'],
  },
  {
    name: 'Bánh cưới chocolate cao cấp',
    description: 'Bánh cưới chocolate với nguyên liệu cao cấp, thơm ngon. Phù hợp cho các cặp đôi yêu thích chocolate. Thiết kế sang trọng.',
    shortDescription: 'Bánh cưới chocolate cao cấp',
    price: 4500000,
    discountPrice: 3600000,
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'chiếc',
    purchaseCount: 520,
    viewCount: 2100,
    isPromotion: true,
    tags: ['bánh cưới', 'chocolate', 'cao cấp'],
  },
  {
    name: 'Bánh cưới mini cho tiệc nhỏ',
    description: 'Bánh cưới mini thiết kế xinh xắn, phù hợp cho các tiệc cưới nhỏ, thân mật. Bánh thơm ngon, đẹp mắt.',
    shortDescription: 'Bánh cưới mini cho tiệc nhỏ',
    price: 2000000,
    images: [
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'chiếc',
    purchaseCount: 380,
    viewCount: 1500,
    isPromotion: false,
    tags: ['bánh cưới', 'mini', 'tiệc nhỏ'],
  },
  {
    name: 'Bánh cưới trái cây tươi',
    description: 'Bánh cưới với trái cây tươi, thơm ngon. Phù hợp cho các đám cưới mùa hè, tươi mát.',
    shortDescription: 'Bánh cưới trái cây tươi',
    price: 4000000,
    discountPrice: 3200000,
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'chiếc',
    purchaseCount: 480,
    viewCount: 1900,
    isPromotion: true,
    tags: ['bánh cưới', 'trái cây', 'tươi'],
  },
  {
    name: 'Bánh cưới 5 tầng cao cấp',
    description: 'Bánh cưới 5 tầng thiết kế cao cấp, lộng lẫy. Phù hợp cho các đám cưới lớn, sang trọng nhất.',
    shortDescription: 'Bánh cưới 5 tầng cao cấp',
    price: 12000000,
    discountPrice: 10000000,
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'chiếc',
    purchaseCount: 280,
    viewCount: 1200,
    isPromotion: true,
    tags: ['bánh cưới', '5 tầng', 'cao cấp'],
  },
  {
    name: 'Bánh cưới vanilla thơm ngon',
    description: 'Bánh cưới vanilla với hương vị thơm ngon, nhẹ nhàng. Phù hợp cho các cặp đôi yêu thích hương vị truyền thống.',
    shortDescription: 'Bánh cưới vanilla thơm ngon',
    price: 3500000,
    images: [
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'chiếc',
    purchaseCount: 550,
    viewCount: 2200,
    isPromotion: false,
    tags: ['bánh cưới', 'vanilla', 'thơm ngon'],
  },

  // ========== TRANG PHỤC CƯỚI (quantifiable) ==========
  {
    name: 'Áo cưới cổ điển sang trọng',
    description: 'Áo cưới thiết kế cổ điển với chất liệu cao cấp, phù hợp cho cô dâu trong ngày trọng đại. Thiết kế tinh tế với đường may tỉ mỉ, tạo dáng thanh lịch và quyến rũ.',
    shortDescription: 'Áo cưới cổ điển sang trọng cho cô dâu',
    price: 15000000,
    discountPrice: 12000000,
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800',
      'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'bộ',
    purchaseCount: 850,
    viewCount: 3200,
    isPromotion: true,
    tags: ['áo cưới', 'cổ điển', 'sang trọng'],
  },
  {
    name: 'Váy cưới hiện đại không tay',
    description: 'Váy cưới thiết kế hiện đại, không tay, phù hợp với các cô dâu yêu thích phong cách trẻ trung. Chất liệu mềm mại, thoáng mát.',
    shortDescription: 'Váy cưới hiện đại không tay',
    price: 12000000,
    discountPrice: 9500000,
    images: [
      'https://images.unsplash.com/photo-1594633312689-8875c8696c0a?w=800',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'bộ',
    purchaseCount: 1200,
    viewCount: 4500,
    isPromotion: true,
    tags: ['váy cưới', 'hiện đại', 'không tay'],
  },
  {
    name: 'Vest cưới cao cấp cho chú rể',
    description: 'Vest cưới thiết kế thanh lịch, phù hợp cho chú rể trong ngày cưới. Chất liệu vải cao cấp, form dáng chuẩn.',
    shortDescription: 'Vest cưới cao cấp cho chú rể',
    price: 8000000,
    images: [
      'https://images.unsplash.com/photo-1594938291221-94f31335c3dc?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'bộ',
    purchaseCount: 650,
    viewCount: 2800,
    isPromotion: false,
    tags: ['vest', 'chú rể', 'cao cấp'],
  },
  {
    name: 'Áo cưới tay dài hoàng gia',
    description: 'Áo cưới thiết kế hoàng gia với tay dài, đuôi dài lộng lẫy. Phù hợp cho các đám cưới lớn, sang trọng.',
    shortDescription: 'Áo cưới tay dài hoàng gia',
    price: 25000000,
    discountPrice: 20000000,
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'bộ',
    purchaseCount: 320,
    viewCount: 1800,
    isPromotion: true,
    tags: ['áo cưới', 'hoàng gia', 'tay dài'],
  },
  {
    name: 'Váy cưới đuôi cá quyến rũ',
    description: 'Váy cưới đuôi cá thiết kế quyến rũ, ôm sát cơ thể, tôn lên vẻ đẹp của cô dâu.',
    shortDescription: 'Váy cưới đuôi cá quyến rũ',
    price: 14000000,
    discountPrice: 11000000,
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'bộ',
    purchaseCount: 720,
    viewCount: 2900,
    isPromotion: true,
    tags: ['váy cưới', 'đuôi cá', 'quyến rũ'],
  },
  {
    name: 'Váy cưới ngắn cá tính',
    description: 'Váy cưới ngắn thiết kế cá tính, phù hợp cho các cô dâu yêu thích phong cách trẻ trung, năng động.',
    shortDescription: 'Váy cưới ngắn cá tính',
    price: 6000000,
    images: [
      'https://images.unsplash.com/photo-1594633312689-8875c8696c0a?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'bộ',
    purchaseCount: 450,
    viewCount: 2100,
    isPromotion: false,
    tags: ['váy cưới', 'ngắn', 'cá tính'],
  },
  {
    name: 'Áo cưới vintage lãng mạn',
    description: 'Áo cưới phong cách vintage với thiết kế lãng mạn, cổ điển. Phù hợp cho các cô dâu yêu thích phong cách retro.',
    shortDescription: 'Áo cưới vintage lãng mạn',
    price: 10000000,
    discountPrice: 8000000,
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'bộ',
    purchaseCount: 580,
    viewCount: 2400,
    isPromotion: true,
    tags: ['áo cưới', 'vintage', 'lãng mạn'],
  },
  {
    name: 'Vest cưới màu xanh navy',
    description: 'Vest cưới màu xanh navy thanh lịch, phù hợp cho chú rể. Chất liệu vải cao cấp, form dáng đẹp.',
    shortDescription: 'Vest cưới màu xanh navy',
    price: 7500000,
    images: [
      'https://images.unsplash.com/photo-1594938291221-94f31335c3dc?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'bộ',
    purchaseCount: 420,
    viewCount: 1900,
    isPromotion: false,
    tags: ['vest', 'xanh navy', 'thanh lịch'],
  },
  {
    name: 'Áo cưới không tay đơn giản',
    description: 'Áo cưới thiết kế đơn giản, không tay, phù hợp cho các cô dâu yêu thích phong cách tối giản nhưng vẫn thanh lịch.',
    shortDescription: 'Áo cưới không tay đơn giản',
    price: 9000000,
    images: [
      'https://images.unsplash.com/photo-1594633312689-8875c8696c0a?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'bộ',
    purchaseCount: 380,
    viewCount: 1600,
    isPromotion: false,
    tags: ['áo cưới', 'không tay', 'đơn giản'],
  },
  {
    name: 'Vest cưới màu đen cổ điển',
    description: 'Vest cưới màu đen cổ điển, thanh lịch. Phù hợp cho các đám cưới truyền thống.',
    shortDescription: 'Vest cưới màu đen cổ điển',
    price: 7000000,
    images: [
      'https://images.unsplash.com/photo-1594938291221-94f31335c3dc?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'bộ',
    purchaseCount: 550,
    viewCount: 2200,
    isPromotion: false,
    tags: ['vest', 'đen', 'cổ điển'],
  },
  {
    name: 'Váy cưới A-line thanh lịch',
    description: 'Váy cưới dáng A-line thanh lịch, phù hợp cho mọi dáng người. Thiết kế tinh tế, sang trọng.',
    shortDescription: 'Váy cưới A-line thanh lịch',
    price: 11000000,
    discountPrice: 9000000,
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800',
    ],
    serviceType: 'quantifiable',
    unit: 'bộ',
    purchaseCount: 680,
    viewCount: 2700,
    isPromotion: true,
    tags: ['váy cưới', 'A-line', 'thanh lịch'],
  },
];

const seedProducts = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Đã kết nối database');

    // Xóa dữ liệu cũ
    await productModel.deleteMany({});
    await categoryModel.deleteMany({});
    console.log('Đã xóa dữ liệu cũ');

    // Tạo categories
    const createdCategories = await categoryModel.insertMany(categoriesData);
    console.log(`Đã tạo ${createdCategories.length} categories`);

    // Tạo products với category references
    const productsWithCategories = productsData.map((product, index) => {
      // Xác định category dựa trên index
      let categoryIndex = 0;
      if (index < 9) categoryIndex = 0; // Tổ chức tiệc cưới (đã thêm 1 product Luxury)
      else if (index < 16) categoryIndex = 1; // Chụp ảnh cưới
      else if (index < 26) categoryIndex = 2; // Trang trí hoa
      else if (index < 33) categoryIndex = 3; // Âm thanh - Ánh sáng
      else if (index < 41) categoryIndex = 4; // Bánh cưới
      else categoryIndex = 5; // Trang phục cưới

      return {
        ...product,
        category: createdCategories[categoryIndex]._id,
        slug: product.slug || product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      };
    });

    const createdProducts = await productModel.insertMany(productsWithCategories);
    console.log(`Đã tạo ${createdProducts.length} products`);

    console.log('✅ Seed dữ liệu thành công!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed dữ liệu:', error);
    process.exit(1);
  }
};

seedProducts();

