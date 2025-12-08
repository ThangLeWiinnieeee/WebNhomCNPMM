import mongoose from 'mongoose';

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

schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Tạo model Session với collection name 'sessions'
const session = mongoose.model('Session', schema, "sessions");

export default session;