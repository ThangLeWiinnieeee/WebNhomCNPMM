import jwt from 'jsonwebtoken';
import userModel from '../../models/user.model.js';

/**
 * Middleware kiểm tra quyền admin
 * Yêu cầu user phải đăng nhập và có role = 'admin'
 */
export const requireAdmin = async (req, res, next) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        code: 'error',
        message: 'Vui lòng đăng nhập!',
      });
    }

    // Verify token với ACCESS_TOKEN_SECRET (giống như auth.middleware.js)
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // Lấy thông tin user từ database
    const user = await userModel.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        code: 'error',
        message: 'Người dùng không tồn tại!',
      });
    }

    // Kiểm tra role admin
    if (user.role !== 'admin') {
      return res.status(403).json({
        code: 'error',
        message: 'Bạn không có quyền truy cập!',
      });
    }

    // Lưu thông tin user vào request
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in requireAdmin middleware:', error);
    
    // Xử lý lỗi chi tiết hơn
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        code: 'error',
        message: 'Token đã hết hạn!',
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        code: 'error',
        message: 'Token không hợp lệ!',
      });
    }
    
    return res.status(401).json({
      code: 'error',
      message: 'Xác thực thất bại!',
    });
  }
};
