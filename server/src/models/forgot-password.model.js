import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    email: String,
    otp: String,
    expireAt: { //Thời gian hết hạn
        type: Date,
        expires: 0
    }
},
{
    timestamps: true //Tự động tạo ra 2 trường CreateAt và UpdateAt
})

const ForgotPassword = mongoose.model('ForgotPassword', schema, "forgot-password");

export default ForgotPassword;