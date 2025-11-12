const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Lấy token từ header
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ error: 'Không có token, xác thực thất bại' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token không hợp lệ' });
  }
};