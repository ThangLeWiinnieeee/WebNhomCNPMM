import mongoose from 'mongoose';

/**
 * Session Model Schema
 * Model quản lý phiên đăng nhập của người dùng
 * Lưu refresh token và thời gian hết hạn
 * Tự động xóa session hết hạn bằng MongoDB TTL index
 */
const schema = new mongoose.Schema({
    // Reference đến User model
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Tạo index để query nhanh hơn
    },
    // Refresh token (unique, dùng để refresh access token)
    refreshToken: {
        type: String,
        required: true,
        unique: true
    },
    // Thời gian hết hạn của session
    expiresAt: {
        type: Date,
        required: true
    }
},{
    timestamps: true // Tự động tạo createdAt và updatedAt
});

/**
 * TTL Index: Tự động xóa document khi expiresAt đã qua
 * expireAfterSeconds: 0 nghĩa là xóa ngay khi expiresAt <= thời gian hiện tại
 * MongoDB sẽ tự động chạy background job để xóa các document hết hạn
 */
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Tạo model Session với collection name 'sessions'
const session = mongoose.model('Session', schema, "sessions");

export default session;