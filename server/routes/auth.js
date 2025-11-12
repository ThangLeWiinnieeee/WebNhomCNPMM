const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { 
  addUser, 
  findUserByEmail, 
  findUserByUsername, 
  updateUser,
  addOTP,
  findOTP,
  deleteOTP,
  cleanExpiredOTPs
} = require('../utils/db');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { generateOTP, getOTPExpiration, isOTPExpired } = require('../utils/otp');
const { sendOTPEmail } = require('../utils/email');
const { generateToken } = require('../middleware/auth');
const { JWT_SECRET } = require('../config');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Validate input
    const validation = validateRegistration({ username, email, password, confirmPassword });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Check if user already exists
    const existingUserByEmail = await findUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'Email đã được sử dụng' });
    }

    const existingUserByUsername = await findUserByUsername(username);
    if (existingUserByUsername) {
      return res.status(400).json({ error: 'Tên người dùng đã được sử dụng' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (unverified)
    const user = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      verified: false,
      createdAt: new Date().toISOString()
    };

    await addUser(user);

    // Generate and send OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiration();

    await addOTP({
      email,
      code: otp,
      expiresAt: expiresAt.toISOString(),
      userId: user.id
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp);
    if (!emailResult.success) {
      return res.status(500).json({ error: 'Không thể gửi email OTP' });
    }

    // Clean expired OTPs
    await cleanExpiredOTPs();

    res.status(201).json({ 
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP.',
      email 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Lỗi server khi đăng ký' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email và mã OTP là bắt buộc' });
    }

    // Clean expired OTPs first
    await cleanExpiredOTPs();

    // Find OTP
    const otpRecord = await findOTP(email, code);
    if (!otpRecord) {
      return res.status(400).json({ error: 'Mã OTP không hợp lệ' });
    }

    // Check if OTP is expired
    if (isOTPExpired(otpRecord.expiresAt)) {
      await deleteOTP(email, code);
      return res.status(400).json({ error: 'Mã OTP đã hết hạn' });
    }

    // Update user to verified
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }

    await updateUser(email, { verified: true });

    // Delete used OTP
    await deleteOTP(email, code);

    // Generate token
    const token = generateToken(user);

    res.json({ 
      message: 'Xác thực thành công',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'Lỗi server khi xác thực OTP' });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email là bắt buộc' });
    }

    // Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'Người dùng không tồn tại' });
    }

    if (user.verified) {
      return res.status(400).json({ error: 'Tài khoản đã được xác thực' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiration();

    await addOTP({
      email,
      code: otp,
      expiresAt: expiresAt.toISOString(),
      userId: user.id
    });

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp);
    if (!emailResult.success) {
      return res.status(500).json({ error: 'Không thể gửi email OTP' });
    }

    // Clean expired OTPs
    await cleanExpiredOTPs();

    res.json({ message: 'Mã OTP mới đã được gửi đến email của bạn' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ error: 'Lỗi server khi gửi lại OTP' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const validation = validateLogin({ email, password });
    if (!validation.valid) {
      return res.status(400).json({ errors: validation.errors });
    }

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    // Check if account is verified
    if (!user.verified) {
      return res.status(403).json({ error: 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email để xác thực.' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Lỗi server khi đăng nhập' });
  }
});

// Verify token
router.get('/verify-token', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ valid: false, error: 'Không có token' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database to ensure they still exist
    const user = await findUserByEmail(decoded.email);
    if (!user) {
      return res.status(401).json({ valid: false, error: 'Người dùng không tồn tại' });
    }
    
    res.json({ 
      valid: true, 
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    res.status(401).json({ valid: false, error: 'Token không hợp lệ' });
  }
});

module.exports = router;
