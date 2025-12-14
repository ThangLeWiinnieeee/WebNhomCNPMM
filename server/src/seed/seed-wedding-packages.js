import mongoose from 'mongoose';
import weddingPackageModel from '../models/wedding-package.model.js';
import 'dotenv/config';

/**
 * Seed data cho Wedding Packages
 * Dựa trên thông tin từ ảnh: COMBO HAPPY, STANDARD, SIGNATURE 1&2, DELUXE
 */

// Dữ liệu gói tiệc mẫu
const packagesData = [
  {
    name: 'COMBO HAPPY',
    slug: 'combo-happy',
    price: 20500000,
    discount: 2000000,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
    ],
    services: [
      'Gói Happy',
      'Gói Hoa lụa cơ bản',
    ],
    description: `COMBO HAPPY - Gói tiệc cưới cơ bản với giá cả hợp lý, phù hợp cho các cặp đôi muốn có một ngày cưới đáng nhớ mà không quá tốn kém.

Bao gồm:
• Gói Happy - Dịch vụ chụp ảnh cưới cơ bản
• Gói Hoa lụa cơ bản - Trang trí hoa lụa cho tiệc cưới

Với mức giá ưu đãi, bạn sẽ có được một ngày cưới trọn vẹn với đầy đủ các dịch vụ cần thiết.`,
    shortDescription: 'Gói tiệc cưới cơ bản với giá cả hợp lý, bao gồm chụp ảnh và trang trí hoa lụa.',
    isActive: true,
    tags: ['combo', 'happy', 'cơ bản', 'tiết kiệm'],
  },
  {
    name: 'COMBO STANDARD',
    slug: 'combo-standard',
    price: 25000000,
    discount: 2000000,
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
    ],
    services: [
      'Gói Ảnh Cổng 2',
      'Gói Happy',
      'Gói Hoa lụa cơ bản',
    ],
    description: `COMBO STANDARD - Gói tiệc cưới tiêu chuẩn với nhiều dịch vụ hơn, phù hợp cho các cặp đôi muốn có một ngày cưới đầy đủ và chuyên nghiệp.

Bao gồm:
• Gói Ảnh Cổng 2 - Chụp ảnh cổng cưới chuyên nghiệp
• Gói Happy - Dịch vụ chụp ảnh cưới cơ bản
• Gói Hoa lụa cơ bản - Trang trí hoa lụa cho tiệc cưới

Gói này mang đến cho bạn một ngày cưới hoàn hảo với đầy đủ các dịch vụ từ chụp ảnh đến trang trí.`,
    shortDescription: 'Gói tiệc cưới tiêu chuẩn với đầy đủ dịch vụ chụp ảnh và trang trí.',
    isActive: true,
    tags: ['combo', 'standard', 'tiêu chuẩn', 'đầy đủ'],
  },
  {
    name: 'COMBO SIGNATURE 1',
    slug: 'combo-signature-1',
    price: 33000000,
    discount: 3400000,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80',
    ],
    services: [
      'Gói Signature',
      'Gói VIP',
      'Gói Hoa lụa cơ bản',
    ],
    description: `COMBO SIGNATURE 1 - Gói tiệc cưới cao cấp với các dịch vụ signature và VIP, mang đến trải nghiệm sang trọng và đẳng cấp.

Bao gồm:
• Gói Signature - Dịch vụ chụp ảnh cưới signature độc quyền
• Gói VIP - Dịch vụ cao cấp với nhiều ưu đãi đặc biệt
• Gói Hoa lụa cơ bản - Trang trí hoa lụa cho tiệc cưới

Với gói này, bạn sẽ có một ngày cưới đẳng cấp với các dịch vụ cao cấp nhất.`,
    shortDescription: 'Gói tiệc cưới cao cấp với dịch vụ Signature và VIP, mang đến trải nghiệm sang trọng.',
    isActive: true,
    tags: ['combo', 'signature', 'vip', 'cao cấp', 'sang trọng'],
  },
  {
    name: 'COMBO SIGNATURE 2',
    slug: 'combo-signature-2',
    price: 41000000,
    discount: 4400000,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
    ],
    services: [
      'Gói Signature',
      'Gói VIP',
      'Gói Hoa lụa cơ bản x 2',
    ],
    description: `COMBO SIGNATURE 2 - Gói tiệc cưới cao cấp nâng cấp với gấp đôi dịch vụ trang trí hoa, phù hợp cho các tiệc cưới lớn và sang trọng.

Bao gồm:
• Gói Signature - Dịch vụ chụp ảnh cưới signature độc quyền
• Gói VIP - Dịch vụ cao cấp với nhiều ưu đãi đặc biệt
• Gói Hoa lụa cơ bản x 2 - Trang trí hoa lụa gấp đôi cho không gian rộng lớn

Gói này được thiết kế đặc biệt cho các tiệc cưới lớn với không gian rộng, cần nhiều điểm trang trí hoa.`,
    shortDescription: 'Gói tiệc cưới cao cấp với dịch vụ Signature, VIP và trang trí hoa gấp đôi.',
    isActive: true,
    tags: ['combo', 'signature', 'vip', 'cao cấp', 'lớn', 'sang trọng'],
  },
  {
    name: 'COMBO DELUXE',
    slug: 'combo-deluxe',
    price: 45000000,
    discount: 7400000,
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
    ],
    services: [
      'Gói Signature',
      'Gói DELUXE',
      'Gói Hoa lụa cơ bản x 2',
    ],
    description: `COMBO DELUXE - Gói tiệc cưới cao cấp nhất với đầy đủ các dịch vụ deluxe, mang đến trải nghiệm xa hoa và đẳng cấp nhất.

Bao gồm:
• Gói Signature - Dịch vụ chụp ảnh cưới signature độc quyền
• Gói DELUXE - Dịch vụ deluxe với các ưu đãi và dịch vụ đặc biệt nhất
• Gói Hoa lụa cơ bản x 2 - Trang trí hoa lụa gấp đôi cho không gian rộng lớn

Đây là gói tiệc cưới cao cấp nhất, phù hợp cho những cặp đôi muốn có một ngày cưới hoàn hảo và xa hoa nhất.`,
    shortDescription: 'Gói tiệc cưới deluxe cao cấp nhất với đầy đủ dịch vụ signature, deluxe và trang trí hoa gấp đôi.',
    isActive: true,
    tags: ['combo', 'deluxe', 'signature', 'cao cấp nhất', 'xa hoa', 'đẳng cấp'],
  },
];

/**
 * Hàm seed dữ liệu wedding packages
 */
const seedWeddingPackages = async () => {
  try {
    // Kết nối database
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Đã kết nối MongoDB');

    // Xóa tất cả packages cũ (optional - comment nếu muốn giữ lại)
    // await weddingPackageModel.deleteMany({});
    // console.log('✅ Đã xóa dữ liệu cũ');

    // Tạo packages mới
    for (const packageData of packagesData) {
      // Kiểm tra xem package đã tồn tại chưa
      const existingPackage = await weddingPackageModel.findOne({ slug: packageData.slug });
      
      if (!existingPackage) {
        const newPackage = new weddingPackageModel(packageData);
        await newPackage.save();
        console.log(`✅ Đã tạo gói: ${packageData.name}`);
      } else {
        console.log(`⏭️  Gói ${packageData.name} đã tồn tại, bỏ qua`);
      }
    }

    console.log('✅ Hoàn thành seed wedding packages!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi seed wedding packages:', error);
    process.exit(1);
  }
};


seedWeddingPackages();

