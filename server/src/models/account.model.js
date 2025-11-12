const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // (Bạn có thể thêm các trường khác như 'name'...)
},
{
    timestamps: true //Tự động tạo ra 2 trường CreateAt và UpdateAt
});

const account = mongoose.model('User', schema, "users");

module.exports = account;