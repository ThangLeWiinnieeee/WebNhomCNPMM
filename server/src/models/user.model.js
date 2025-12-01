import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: { 
    type: String 
  },
  avatarID: {
    type: String
  },
  phone: { 
    type: String,
    sparse: true //Cho phép trường này có thể null nhưng vẫn giữ tính unique
  },
  type: {
    type: String,
    required: true,
    enum: ['login', 'loginGoogle']
  }
},{
    timestamps: true //Tự động tạo ra 2 trường CreateAt và UpdateAt
});

const user = mongoose.model('User', schema, "users");

export default user;