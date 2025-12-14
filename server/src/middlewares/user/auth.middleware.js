import jwt from 'jsonwebtoken';
import userModel from '../../models/user.model.js';

// Middleware xác minh user là ai 
const verifyToken = async (req, res, next) => {
  try {
      // Lấy token từ header Authorization
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
        if(!token) {
            return  res.status(401).json({ 
                code: 'error',
                message: 'Không thể lấy access token' 
            });
        }
        // Xác minh token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
            // Kiểm tra nếu có lỗi
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ 
                        code: 'error',
                        message: 'Token đã hết hạn'
                    });
                }
                if (err.name === 'JsonWebTokenError') {
                    res.clearCookie('token');
                    return res.status(403).json({ 
                        code: 'error',
                        message: 'Token không hợp lệ' 
                    });
                }
                // Các lỗi khác
                return res.status(403).json({ 
                    code: 'error',
                    message: 'Xác thực token thất bại' 
                });
            }
            
            // Token hợp lệ, lấy thông tin user từ database
            try {
                const user = await userModel.findById(decodedUser.userId).select('-password');
                if (!user) {
                    return res.status(404).json({ 
                        code: 'error',
                        message: 'Người dùng không tồn tại' 
                    });
                }
                // Gán thông tin user vào req để sử dụng trong các middleware hoặc route tiếp theo
                req.user = user;
                next();
            } catch (dbError) {
                console.error("Lỗi khi truy vấn database:", dbError);
                return res.status(500).json({ 
                    code: 'error',
                    message: 'Lỗi hệ thống khi xác thực người dùng' 
                });
            }
        })
  } catch (error) {
      console.error("Lỗi xác minh JWT trong middleware",error);
      return res.status(500).json({ 
        code: 'error',
        message: 'Lỗi hệ thống' 
    });
  }
}

/**
 * Optional authentication middleware
 * Set req.user nếu có token hợp lệ, nhưng không bắt buộc đăng nhập
 * Dùng cho các route public nhưng cần biết user nếu đã đăng nhập
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      // Không có token, tiếp tục mà không set req.user
      return next();
    }

    // Xác minh token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
      if (err) {
        // Token không hợp lệ hoặc hết hạn, tiếp tục mà không set req.user
        return next();
      }
      
      try {
        const user = await userModel.findById(decodedUser.userId).select('-password');
        if (user) {
          req.user = user;
        }
        return next();
      } catch (dbError) {
        // Lỗi database, tiếp tục mà không set req.user
        console.error("Lỗi khi truy vấn database trong optionalAuth:", dbError);
        return next();
      }
    });
  } catch (error) {
    // Lỗi, tiếp tục mà không set req.user
    return next();
  }
};

export { verifyToken, optionalAuth };