import mongoose from 'mongoose';

/**
 * User Model Schema
 * Model đại diện cho người dùng trong hệ thống
 * Lưu thông tin tài khoản, avatar, và thông tin liên hệ
 */
const schema = new mongoose.Schema({
  // Họ và tên người dùng (bắt buộc, unique)
  fullname: {
    type: String,
    required: true,
    unique: true,
  },
  // Email đăng nhập (bắt buộc, unique)
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Mật khẩu đã được hash (bắt buộc)
  password: {
    type: String,
    required: true,
  },
  // URL ảnh đại diện (lưu trên Cloudinary)
  avatar: { 
    type: String,
    default: null
  },
  // Public ID của ảnh trên Cloudinary (dùng để xóa ảnh)
  avatarID: {
    type: String,
    default: null
  },
  // Số điện thoại (unique, nhưng cho phép null)
  phone: { 
    type: String,
    sparse: true //Cho phép trường này có thể null nhưng vẫn giữ tính unique
  },
  // Địa chỉ
  address: {
    type: String
  },
  // Role của user: 'user' hoặc 'admin'
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'],
    default: 'user'
  },
  type: {
    type: String,
    required: true,
    enum: ['login', 'loginGoogle']
  }
},{
    timestamps: true // Tự động tạo createdAt và updatedAt
});

// Tạo model User với collection name 'users'
const user = mongoose.model('User', schema, "users");

export default user;