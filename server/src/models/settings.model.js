import mongoose from 'mongoose';

/**
 * Settings Model Schema
 * Model đại diện cho cài đặt hệ thống (single document)
 * Lưu thông tin thương hiệu, liên hệ, và các link mạng xã hội
 */
const schema = new mongoose.Schema({
  // Tên thương hiệu
  brandName: {
    type: String,
    default: 'TONY WEDDING',
  },
  // Website
  website: {
    type: String,
    default: 'www.tonywedding.vn',
  },
  // Hotline
  hotline: {
    type: String,
  },
  // Email
  email: {
    type: String,
  },
  // Địa chỉ
  address: {
    type: String,
  },
  // Các link mạng xã hội
  socialLinks: {
    facebook: {
      type: String,
    },
    zalo: {
      type: String,
    },
    instagram: {
      type: String,
    },
    tiktok: {
      type: String,
    },
  },
}, {
  timestamps: true, // Tự động tạo createdAt và updatedAt
});

// Tạo model Settings với collection name 'settings'
// Sử dụng findOneAndUpdate với upsert: true để đảm bảo chỉ có 1 document
const settings = mongoose.model('Settings', schema, 'settings');

export default settings;
