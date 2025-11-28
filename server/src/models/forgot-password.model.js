import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    email: String,
    otp: String,
    expiresAt: { //Thời gian hết hạn - MongoDB sẽ tự động xóa document
        type: Date,
        expires: 0
    }
},
{
    timestamps: true //Tự động tạo ra 2 trường CreateAt và UpdateAt
})

const ForgotPassword = mongoose.model('ForgotPassword', schema, "forgot-password");

export default ForgotPassword;