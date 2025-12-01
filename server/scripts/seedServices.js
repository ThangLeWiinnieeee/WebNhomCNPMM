/**
 * ========================================
 * WEDDING SERVICE DATABASE SEEDING SCRIPT
 * ========================================
 * 
 * File: server/scripts/seedServices.js
 * Purpose: Tạo và thêm 12 dịch vụ tiệc cưới mẫu vào MongoDB
 * 
 * Usage:
 *   cd server
 *   node scripts/seedServices.js
 * 
 * Output:
 *   - Kết nối MongoDB
 *   - Xóa các dịch vụ cũ
 *   - Thêm 12 dịch vụ mẫu mới
 *   - Hiển thị danh sách dịch vụ đã thêm
 *   - Ngắt kết nối MongoDB
 * 
 * Requirements:
 *   - MongoDB đang chạy
 *   - File .env với DATABASE_URL được cấu hình
 * 
 * ========================================
 */

import mongoose from 'mongoose';
import Service from '../src/models/service.model.js';
import 'dotenv/config';

/**
 * Mảng chứa 12 dịch vụ tiệc cưới mẫu
 * Được chia thành 6 danh mục, mỗi danh mục 2 dịch vụ
 * 
 * Danh mục:
 *   1. Catering (Nhà hàng): 2 dịch vụ
 *   2. Decoration (Trang trí): 2 dịch vụ
 *   3. Photography (Quay phim & Chụp ảnh): 2 dịch vụ
 *   4. Music (Âm nhạc & DJ): 2 dịch vụ
 *   5. Venue (Địa điểm tổ chức): 2 dịch vụ
 *   6. Other (Khác): 2 dịch vụ
 */
const sampleServices = [
  // ============================================
  // DANH MỤC 1: CATERING (Nhà hàng & Menu)
  // ============================================
  // Dịch vụ 1: Menu Deluxe
  {
    name: 'Menu Tiệc Cưới Deluxe 5 Món',
    description: 'Menu tiệc cưới sang trọng gồm 5 món chính, phục vụ nhà bếp chuyên nghiệp',
    price: 2500000,
    category: 'catering',
    image: 'https://via.placeholder.com/300x200?text=Catering+Deluxe',
    minGuests: 50,
    maxGuests: 500,
    rating: 4.8,
    reviews: 45,
    customizationOptions: [
      {
        optionName: 'Số lượng khách',
        optionType: 'number',
        isRequired: true,
        choices: []
      },
      {
        optionName: 'Loại menu',
        optionType: 'select',
        isRequired: true,
        choices: ['Á Đông', 'Âu Châu', 'Fusion', 'Vegetarian']
      }
    ]
  },
  // Dịch vụ 2: Menu Premium
  {
    name: 'Menu Tiệc Cưới Premium 10 Món',
    description: 'Menu tiệc cưới cao cấp gồm 10 món đặc biệt, có nhà bếp đầu bếp nổi tiếng',
    price: 4500000,
    category: 'catering',
    image: 'https://via.placeholder.com/300x200?text=Catering+Premium',
    minGuests: 100,
    maxGuests: 800,
    rating: 4.9,
    reviews: 67,
    customizationOptions: [
      {
        optionName: 'Số lượng khách',
        optionType: 'number',
        isRequired: true,
        choices: []
      },
      {
        optionName: 'Loại menu',
        optionType: 'select',
        isRequired: true,
        choices: ['Á Đông', 'Âu Châu', 'Fusion', 'Vegetarian', 'Halal']
      }
    ]
  },
  
  // ============================================
  // DANH MỤC 2: DECORATION (Trang trí)
  // ============================================
  // Dịch vụ 3: Trang trí cơ bản
  {
    name: 'Trang Trí Tiệc Cơ Bản',
    description: 'Trang trí sân khấu và bàn tiệc với hoa tươi và đèn trang trí cơ bản',
    price: 1500000,
    category: 'decoration',
    image: 'https://via.placeholder.com/300x200?text=Decoration+Basic',
    minGuests: 50,
    maxGuests: 300,
    rating: 4.5,
    reviews: 32,
    customizationOptions: [
      {
        optionName: 'Chủ đề',
        optionType: 'select',
        isRequired: true,
        choices: ['Cổ Điển', 'Hiện Đại', 'Vintage', 'Tối Giản']
      },
      {
        optionName: 'Màu sắc chủ đạo',
        optionType: 'select',
        isRequired: true,
        choices: ['Đỏ', 'Trắng', 'Hồng', 'Vàng', 'Tím', 'Xanh']
      }
    ]
  },
  // Dịch vụ 4: Trang trí VIP
  {
    name: 'Trang Trí Tiệc Cao Cấp VIP',
    description: 'Trang trí tiệc cưới sang trọng với thiết kế độc quyền, hoa nhập khẩu và công nghệ ánh sáng hiện đại',
    price: 3500000,
    category: 'decoration',
    image: 'https://via.placeholder.com/300x200?text=Decoration+VIP',
    minGuests: 100,
    maxGuests: 1000,
    rating: 4.9,
    reviews: 89,
    customizationOptions: [
      {
        optionName: 'Chủ đề',
        optionType: 'select',
        isRequired: true,
        choices: ['Cổ Điển', 'Hiện Đại', 'Vintage', 'Tối Giản', 'Phương Đông', 'Địa Trung Hải']
      },
      {
        optionName: 'Màu sắc chủ đạo',
        optionType: 'select',
        isRequired: true,
        choices: ['Đỏ', 'Trắng', 'Hồng', 'Vàng', 'Tím', 'Xanh', 'Đen', 'Bạc']
      }
    ]
  },

  // ============================================
  // DANH MỤC 3: PHOTOGRAPHY (Quay phim & Chụp ảnh)
  // ============================================
  // Dịch vụ 5: Quay phim cơ bản 4 giờ
  {
    name: 'Quay Phim Tiệc Cưới Cơ Bản 4 Giờ',
    description: 'Dịch vụ quay phim tiệc cưới 4 giờ với 1 cameraman chuyên nghiệp',
    price: 1800000,
    category: 'photography',
    image: 'https://via.placeholder.com/300x200?text=Photography+Basic',
    minGuests: 50,
    maxGuests: 500,
    rating: 4.6,
    reviews: 41,
    customizationOptions: [
      {
        optionName: 'Thời lượng quay phim',
        optionType: 'number',
        isRequired: true,
        choices: []
      },
      {
        optionName: 'Phong cách video',
        optionType: 'select',
        isRequired: true,
        choices: ['Hiện Đại', 'Lãng Mạn', 'Hề Hước', 'Tài Liệu']
      }
    ]
  },
  // Dịch vụ 6: Quay phim & Chụp ảnh Full Day
  {
    name: 'Quay Phim + Chụp Ảnh Tiệc Full Day',
    description: 'Gói dịch vụ quay phim toàn ngày và chụp ảnh chuyên nghiệp với 2 cameraman và 1 photographer',
    price: 4200000,
    category: 'photography',
    image: 'https://via.placeholder.com/300x200?text=Photography+FullDay',
    minGuests: 50,
    maxGuests: 800,
    rating: 4.9,
    reviews: 112,
    customizationOptions: [
      {
        optionName: 'Phong cách video',
        optionType: 'select',
        isRequired: true,
        choices: ['Hiện Đại', 'Lãng Mạn', 'Hề Hước', 'Tài Liệu', 'Cinematic']
      },
      {
        optionName: 'Số lượng album ảnh',
        optionType: 'number',
        isRequired: true,
        choices: []
      }
    ]
  },

  // ============================================
  // DANH MỤC 4: MUSIC (Âm nhạc & DJ)
  // ============================================
  // Dịch vụ 7: Dàn nhạc Live
  {
    name: 'Dàn Nhạc Live 4 Người',
    description: 'Dàn nhạc live gồm 4 nhạc công chuyên nghiệp, có thể chơi nhạc tiệc cưới kinh điển',
    price: 2000000,
    category: 'music',
    image: 'https://via.placeholder.com/300x200?text=Music+Band',
    minGuests: 50,
    maxGuests: 600,
    rating: 4.7,
    reviews: 56,
    customizationOptions: [
      {
        optionName: 'Thời gian biểu diễn',
        optionType: 'number',
        isRequired: true,
        choices: []
      },
      {
        optionName: 'Loại nhạc',
        optionType: 'select',
        isRequired: true,
        choices: ['Nhạc Cổ Điển', 'Nhạc Nhẹ', 'Nhạc Hiện Đại', 'Nhạc Quốc Tế']
      }
    ]
  },
  // Dịch vụ 8: DJ + Sound System
  {
    name: 'DJ + Hệ Thống Âm Thanh Cao Cấp',
    description: 'DJ chuyên nghiệp kết hợp với hệ thống âm thanh Dolby Cinema 7.1 chất lượng cao',
    price: 3000000,
    category: 'music',
    image: 'https://via.placeholder.com/300x200?text=Music+DJ',
    minGuests: 100,
    maxGuests: 1500,
    rating: 4.8,
    reviews: 93,
    customizationOptions: [
      {
        optionName: 'Thời gian DJ',
        optionType: 'number',
        isRequired: true,
        choices: []
      },
      {
        optionName: 'Phong cách âm nhạc',
        optionType: 'select',
        isRequired: true,
        choices: ['Electronic Dance', 'Indie Pop', 'Nhạc Sôi Động', 'Nhạc Lãng Mạn']
      }
    ]
  },

  // ============================================
  // DANH MỤC 5: VENUE (Địa điểm tổ chức)
  // ============================================
  // Dịch vụ 9: Nhà hàng tiệc cồi điển
  {
    name: 'Nhà Hàng Tiệc Cưới Cổ Điển',
    description: 'Nhà hàng tiệc cưới cổ điển có sức chứa 300 khách, đầy đủ tiện nghi',
    price: 5000000,
    category: 'venue',
    image: 'https://via.placeholder.com/300x200?text=Venue+Classic',
    minGuests: 50,
    maxGuests: 300,
    rating: 4.6,
    reviews: 67,
    customizationOptions: [
      {
        optionName: 'Giờ sử dụng',
        optionType: 'select',
        isRequired: true,
        choices: ['Trưa', 'Chiều', 'Tối']
      },
      {
        optionName: 'Số lượng khách',
        optionType: 'number',
        isRequired: true,
        choices: []
      }
    ]
  },
  // Dịch vụ 10: Resort sang trọng
  {
    name: 'Khu Resort Tiệc Cưới Sang Trọng',
    description: 'Khu resort 5 sao với vườn cây xanh, có bể bơi, sức chứa tới 1000 khách',
    price: 8000000,
    category: 'venue',
    image: 'https://via.placeholder.com/300x200?text=Venue+Resort',
    minGuests: 100,
    maxGuests: 1000,
    rating: 4.9,
    reviews: 145,
    customizationOptions: [
      {
        optionName: 'Loại sân',
        optionType: 'select',
        isRequired: true,
        choices: ['Sân Trong Nhà', 'Sân Ngoài Trời', 'Sân Nửa Trong Nửa Ngoài']
      },
      {
        optionName: 'Số lượng khách',
        optionType: 'number',
        isRequired: true,
        choices: []
      }
    ]
  },

  // ============================================
  // DANH MỤC 6: OTHER (Dịch vụ khác)
  // ============================================
  // Dịch vụ 11: MC & Lễ Thành Hôn
  {
    name: 'Lễ Thành Hôn & MC Tiệc Cưới',
    description: 'MC chuyên nghiệp dẫn dắt lễ thành hôn và tiệc cưới toàn ngày',
    price: 1200000,
    category: 'other',
    image: 'https://via.placeholder.com/300x200?text=MC+Service',
    minGuests: 50,
    maxGuests: 1000,
    rating: 4.7,
    reviews: 78,
    customizationOptions: [
      {
        optionName: 'Thời lượng dịch vụ',
        optionType: 'number',
        isRequired: true,
        choices: []
      },
      {
        optionName: 'Phong cách MC',
        optionType: 'select',
        isRequired: true,
        choices: ['Chuyên Nghiệp', 'Hài Hước', 'Lãng Mạn', 'Modern']
      }
    ]
  },
  // Dịch vụ 12: Trang điểm & Uốn tóc
  {
    name: 'Trang Điểm & Uốn Tóc Cô Dâu',
    description: 'Dịch vụ trang điểm chuyên nghiệp và uốn tóc cho cô dâu với các chuyên gia hàng đầu',
    price: 800000,
    category: 'other',
    image: 'https://via.placeholder.com/300x200?text=Makeup+Hair',
    minGuests: 1,
    maxGuests: 1,
    rating: 4.8,
    reviews: 112,
    customizationOptions: [
      {
        optionName: 'Loại trang điểm',
        optionType: 'select',
        isRequired: true,
        choices: ['Truyền Thống', 'Hiện Đại', 'Hòa Trộn']
      },
      {
        optionName: 'Kiểu tóc',
        optionType: 'select',
        isRequired: true,
        choices: ['Tóc Búi', 'Tóc Xõa', 'Tóc Nửa Búi', 'Tóc Uốn']
      }
    ]
  }
];

/**
 * Hàm chính: Kết nối MongoDB, xóa dịch vụ cũ, thêm dịch vụ mới
 * 
 * Các bước:
 * 1. Kết nối đến MongoDB sử dụng DATABASE_URL từ .env
 * 2. Xóa tất cả dịch vụ cũ trong collection Service
 * 3. Thêm 12 dịch vụ mẫu mới
 * 4. Hiển thị danh sách dịch vụ đã thêm
 * 5. Ngắt kết nối MongoDB
 * 
 * @async
 * @returns {Promise<void>}
 */
async function seedServices() {
  try {
    // ========== BƯỚC 1: Kết nối MongoDB ==========
    // Sử dụng DATABASE_URL từ .env file
    // Mặc định: mongodb://localhost:27017/wedding-services
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Kết nối MongoDB thành công');

    // ========== BƯỚC 2: Xóa dịch vụ cũ ==========
    // Xóa tất cả document hiện tại trong collection Service
    // để tránh trùng lặp khi chạy lại script
    await Service.deleteMany({});
    console.log('🗑️  Xóa các dịch vụ cũ');

    // ========== BƯỚC 3: Thêm dịch vụ mẫu ==========
    // Sử dụng insertMany() để thêm toàn bộ 12 dịch vụ mẫu vào database
    const insertedServices = await Service.insertMany(sampleServices);
    console.log(`✨ Đã thêm ${insertedServices.length} dịch vụ mẫu`);

    // ========== BƯỚC 4: Hiển thị danh sách ==========
    // In ra danh sách dịch vụ đã thêm với thông tin cơ bản
    // Format: [Số thứ tự]. [Tên dịch vụ] ([Danh mục]) - [Giá] ₫
    console.log('\n📋 Danh sách dịch vụ đã thêm:');
    insertedServices.forEach((service, index) => {
      console.log(`${index + 1}. ${service.name} (${service.category}) - ${service.price.toLocaleString('vi-VN')} ₫`);
    });

    // ========== BƯỚC 5: Ngắt kết nối ==========
    // Đóng kết nối MongoDB khi hoàn tất
    await mongoose.disconnect();
    console.log('\n✅ Hoàn tất thêm dữ liệu mẫu');
  } catch (error) {
    // Xử lý lỗi
    console.error('❌ Lỗi:', error.message);
    process.exit(1); // Thoát process với mã lỗi
  }
}

// ========== CHẠY HÀM ==========
// Gọi hàm seedServices khi script được chạy
seedServices();
