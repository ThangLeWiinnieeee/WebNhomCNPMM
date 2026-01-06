import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import 'dotenv/config';

// Danh sách 30 users mẫu với thông tin đa dạng
const usersData = [
  {
    fullname: 'Nguyễn Văn An',
    email: 'nguyenvanan@gmail.com',
    password: 'Password123!',
    phone: '0901234567',
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    role: 'user',
    type: 'login',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    fullname: 'Trần Thị Bình',
    email: 'tranthibinh@gmail.com',
    password: 'Password123!',
    phone: '0902345678',
    address: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
    role: 'user',
    type: 'login',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=2'
  },
  {
    fullname: 'Lê Minh Cường',
    email: 'leminhcuong@gmail.com',
    password: 'Password123!',
    phone: '0903456789',
    address: '789 Đường Võ Văn Tần, Quận 3, TP.HCM',
    role: 'user',
    type: 'loginGoogle',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=3'
  },
  {
    fullname: 'Phạm Thị Dung',
    email: 'phamthidung@gmail.com',
    password: 'Password123!',
    phone: '0904567890',
    address: '321 Đường Pasteur, Quận 1, TP.HCM',
    role: 'user',
    type: 'login',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=4'
  },
  {
    fullname: 'Hoàng Văn Em',
    email: 'hoangvanem@gmail.com',
    password: 'Password123!',
    phone: '0905678901',
    address: '654 Đường Hai Bà Trưng, Quận 3, TP.HCM',
    role: 'user',
    type: 'login',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    fullname: 'Đặng Thị Phương',
    email: 'dangthiphuong@gmail.com',
    password: 'Password123!',
    phone: '0906789012',
    address: '987 Đường Lý Tự Trọng, Quận 1, TP.HCM',
    role: 'user',
    type: 'loginGoogle',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=6'
  },
  {
    fullname: 'Võ Văn Giang',
    email: 'vovangiang@gmail.com',
    password: 'Password123!',
    phone: '0907890123',
    address: '159 Đường Nam Kỳ Khởi Nghĩa, Quận 1, TP.HCM',
    role: 'user',
    type: 'login',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=7'
  },
  {
    fullname: 'Bùi Thị Hoa',
    email: 'buithihoa@gmail.com',
    password: 'Password123!',
    phone: '0908901234',
    address: '753 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
    role: 'user',
    type: 'login',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=8'
  },
  {
    fullname: 'Ngô Văn Hưng',
    email: 'ngovanhung@gmail.com',
    password: 'Password123!',
    phone: '0909012345',
    address: '246 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM',
    role: 'user',
    type: 'loginGoogle',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=9'
  },
  {
    fullname: 'Dương Thị Lan',
    email: 'duongthilan@gmail.com',
    password: 'Password123!',
    phone: '0910123456',
    address: '369 Đường Trần Hưng Đạo, Quận 5, TP.HCM',
    role: 'user',
    type: 'login',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=10'
  },
  {
    fullname: 'Phan Văn Khánh',
    email: 'phanvankhanh@gmail.com',
    password: 'Password123!',
    phone: '0911234567',
    address: '582 Đường Nguyễn Thị Minh Khai, Quận 3, TP.HCM',
    role: 'user',
    type: 'login',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=11'
  },
  {
    fullname: 'Lý Thị Mai',
    email: 'lythimai@gmail.com',
    password: 'Password123!',
    phone: '0912345678',
    address: '147 Đường Lê Văn Sỹ, Quận Phú Nhuận, TP.HCM',
    role: 'user',
    type: 'loginGoogle',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    fullname: 'Trịnh Văn Nam',
    email: 'trinhvannam@gmail.com',
    password: 'Password123!',
    phone: '0913456789',
    address: '951 Đường Hoàng Văn Thụ, Quận Phú Nhuận, TP.HCM',
    role: 'user',
    type: 'login',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=13'
  },
  {
    fullname: 'Cao Thị Ngọc',
    email: 'caothingoc@gmail.com',
    password: 'Password123!',
    phone: '0914567890',
    address: '258 Đường Phan Xích Long, Quận Phú Nhuận, TP.HCM',
    role: 'user',
    type: 'login',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=14'
  },
  {
    fullname: 'Đỗ Văn Oanh',
    email: 'dovanoanh@gmail.com',
    password: 'Password123!',
    phone: '0915678901',
    address: '741 Đường Phan Đăng Lưu, Quận Phú Nhuận, TP.HCM',
    role: 'user',
    type: 'loginGoogle',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=15'
  },
  {
    fullname: 'Hồ Thị Phương',
    email: 'hothiphuong@gmail.com',
    password: 'Password123!',
    phone: '0916789012',
    address: '852 Đường Nguyễn Văn Trỗi, Quận Phú Nhuận, TP.HCM',
    role: 'user',
    type: 'login',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=16'
  },
  {
    fullname: 'Mai Văn Quang',
    email: 'maivanquang@gmail.com',
    password: 'Password123!',
    phone: '0917890123',
    address: '369 Đường Cộng Hòa, Quận Tân Bình, TP.HCM',
    role: 'user',
    type: 'login',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=17'
  },
  {
    fullname: 'Tô Thị Rạng',
    email: 'tothirang@gmail.com',
    password: 'Password123!',
    phone: '0918901234',
    address: '147 Đường Hoàng Hoa Thám, Quận Tân Bình, TP.HCM',
    role: 'user',
    type: 'loginGoogle',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=18'
  },
  {
    fullname: 'Lưu Văn Sơn',
    email: 'luuvanson@gmail.com',
    password: 'Password123!',
    phone: '0919012345',
    address: '753 Đường Trường Chinh, Quận Tân Bình, TP.HCM',
    role: 'user',
    type: 'login',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=19'
  },
  {
    fullname: 'Chu Thị Tuyết',
    email: 'chuthituyet@gmail.com',
    password: 'Password123!',
    phone: '0920123456',
    address: '951 Đường Lạc Long Quân, Quận 11, TP.HCM',
    role: 'user',
    type: 'login',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=20'
  },
  {
    fullname: 'Đinh Văn Uyên',
    email: 'dinhvanuyen@gmail.com',
    password: 'Password123!',
    phone: '0921234567',
    address: '456 Đường Âu Cơ, Quận Tân Phú, TP.HCM',
    role: 'user',
    type: 'loginGoogle',
    status: 'suspended',
    avatar: 'https://i.pravatar.cc/150?img=21'
  },
  {
    fullname: 'Trương Thị Vân',
    email: 'truongthivan@gmail.com',
    password: 'Password123!',
    phone: '0922345678',
    address: '789 Đường Lũy Bán Bích, Quận Tân Phú, TP.HCM',
    role: 'user',
    type: 'login',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=22'
  },
  {
    fullname: 'Vũ Văn Xuân',
    email: 'vuvanxuan@gmail.com',
    password: 'Password123!',
    phone: '0923456789',
    address: '321 Đường Tân Kỳ Tân Quý, Quận Tân Phú, TP.HCM',
    role: 'user',
    type: 'login',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=23'
  },
  {
    fullname: 'Huỳnh Thị Yến',
    email: 'huynhthiyen@gmail.com',
    password: 'Password123!',
    phone: '0924567890',
    address: '654 Đường Phạm Văn Chiêu, Quận Gò Vấp, TP.HCM',
    role: 'user',
    type: 'loginGoogle',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=24'
  },
  {
    fullname: 'Lâm Văn Anh',
    email: 'lamvananh@gmail.com',
    password: 'Password123!',
    phone: '0925678901',
    address: '987 Đường Quang Trung, Quận Gò Vấp, TP.HCM',
    role: 'user',
    type: 'login',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=25'
  },
  {
    fullname: 'Quách Thị Bảo',
    email: 'quachthibao@gmail.com',
    password: 'Password123!',
    phone: '0926789012',
    address: '159 Đường Phan Văn Trị, Quận Gò Vấp, TP.HCM',
    role: 'user',
    type: 'login',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=26'
  },
  {
    fullname: 'Kim Văn Châu',
    email: 'kimvanchau@gmail.com',
    password: 'Password123!',
    phone: '0927890123',
    address: '753 Đường Nguyễn Oanh, Quận Gò Vấp, TP.HCM',
    role: 'user',
    type: 'loginGoogle',
    status: 'inactive',
    avatar: 'https://i.pravatar.cc/150?img=27'
  },
  {
    fullname: 'Hà Thị Diệp',
    email: 'hathidiep@gmail.com',
    password: 'Password123!',
    phone: '0928901234',
    address: '246 Đường Lê Đức Thọ, Quận Gò Vấp, TP.HCM',
    role: 'user',
    type: 'login',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=28'
  },
  {
    fullname: 'Đào Văn Đức',
    email: 'daovanduc@gmail.com',
    password: 'Password123!',
    phone: '0929012345',
    address: '369 Đường Nguyễn Văn Lượng, Quận Gò Vấp, TP.HCM',
    role: 'user',
    type: 'login',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=29'
  },
  {
    fullname: 'Tạ Thị Oanh',
    email: 'tathioanh@gmail.com',
    password: 'Password123!',
    phone: '0930123456',
    address: '582 Đường Phan Huy Ích, Quận Gò Vấp, TP.HCM',
    role: 'user',
    type: 'loginGoogle',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=30'
  }
];

/**
 * Seed users vào database
 */
async function seedUsers() {
  try {
    // Kết nối database
    console.log('Đang kết nối MongoDB...');
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Đã kết nối MongoDB thành công!');

    // Kiểm tra số lượng users hiện tại
    const currentCount = await User.countDocuments();
    console.log(`📊 Số lượng users hiện tại: ${currentCount}`);

    // Hash password cho tất cả users
    console.log('🔐 Đang hash passwords...');
    const usersWithHashedPassword = await Promise.all(
      usersData.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return {
          ...user,
          password: hashedPassword
        };
      })
    );

    // Insert users vào database
    console.log('📝 Đang thêm users vào database...');
    const insertedUsers = await User.insertMany(usersWithHashedPassword, { 
      ordered: false // Tiếp tục insert ngay cả khi có lỗi duplicate
    });

    console.log(`✅ Đã thêm thành công ${insertedUsers.length} users!`);
    
    // Hiển thị tổng số users sau khi seed
    const finalCount = await User.countDocuments();
    console.log(`📊 Tổng số users sau khi seed: ${finalCount}`);

    // Thống kê theo loại
    const loginCount = await User.countDocuments({ type: 'login' });
    const googleLoginCount = await User.countDocuments({ type: 'loginGoogle' });
    const activeCount = await User.countDocuments({ status: 'active' });
    const suspendedCount = await User.countDocuments({ status: 'suspended' });
    const inactiveCount = await User.countDocuments({ status: 'inactive' });

    console.log('\n📈 Thống kê users:');
    console.log(`  - Login thường: ${loginCount}`);
    console.log(`  - Login Google: ${googleLoginCount}`);
    console.log(`  - Trạng thái Active: ${activeCount}`);
    console.log(`  - Trạng thái Suspended: ${suspendedCount}`);
    console.log(`  - Trạng thái Inactive: ${inactiveCount}`);

  } catch (error) {
    if (error.code === 11000) {
      // Lỗi duplicate key
      console.error('⚠️ Một số users đã tồn tại trong database.');
      console.error('Đã bỏ qua các users bị trùng lặp.');
      
      // Vẫn hiển thị thống kê
      const finalCount = await User.countDocuments();
      console.log(`📊 Tổng số users hiện tại: ${finalCount}`);
    } else {
      console.error('❌ Lỗi khi seed users:', error.message);
    }
  } finally {
    // Đóng kết nối
    await mongoose.connection.close();
    console.log('\n🔌 Đã đóng kết nối MongoDB');
    process.exit(0);
  }
}

// Chạy seed function
seedUsers();
