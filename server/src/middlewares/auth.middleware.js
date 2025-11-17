import jwt from 'jsonwebtoken';
const userModel = require('../models/user.model');

// Middleware xác minh user là ai 
module.exports.verifyToken = async (req, res, next) => {
  try {
      // Lấy token từ header Authorization
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
        if(!token) {
            return  res.status(401).json({ error: 'Không thể lấy access token' });
        }
        // Xác minh token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
            if (err) {
                console.error("Lỗi xác minh token",err);
                return res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
            }
            // Lấy thông tin user từ database
            const user = await userModel.findById(decodedUser.userId).select('-password');
            if (!user) {
                return res.status(404).json({ error: 'Người dùng không tồn tại' });
            }
            // Gán thông tin user vào req để sử dụng trong các middleware hoặc route tiếp theo
            req.user = user;
            next();
        })
  } catch (error) {
      console.error("Lỗi xác minh JWT trong middleware",error);
      return res.status(500).json({ error: 'Lỗi hệ thống' });
  }
}