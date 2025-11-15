const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
},{
    timestamps: true //Tự động tạo ra 2 trường CreateAt và UpdateAt
});

// Tự động xoá các phiên làm việc đã hết hạn
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const session = mongoose.model('Session', schema, "sessions");

module.exports = session;