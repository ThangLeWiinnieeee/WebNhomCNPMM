import mongoose from 'mongoose';

/**
 * ForgotPassword Model Schema
 * Model quản lý OTP reset password
 * Lưu email, OTP code và thời gian hết hạn
 * Tự động xóa document hết hạn bằng MongoDB TTL index
 */
const schema = new mongoose.Schema({
    // Email của người dùng yêu cầu reset password
    email: String,
    // Mã OTP (One-Time Password) để xác thực
    otp: String,
    // Thời gian hết hạn - MongoDB sẽ tự động xóa document khi hết hạn
    expiresAt: {
        type: Date,
        expires: 0 // TTL index: xóa ngay khi expiresAt <= thời gian hiện tại
    }
},
{
    timestamps: true // Tự động tạo createdAt và updatedAt
})

// Tạo model ForgotPassword với collection name 'forgot-password'
const ForgotPassword = mongoose.model('ForgotPassword', schema, "forgot-password");

export default ForgotPassword;