const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,//Xoá khoảng trắng thừa
    lowercase: true //Chuyển về chữ thường
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
    trim: true
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
  bio: { 
    type: String,
    maxLength: 500
  },
  phone: { 
    type: String,
    sparse: true //Cho phép trường này có thể null nhưng vẫn giữ tính unique
  }
},{
    timestamps: true //Tự động tạo ra 2 trường CreateAt và UpdateAt
});

const user = mongoose.model('User', schema, "users");

module.exports = user;